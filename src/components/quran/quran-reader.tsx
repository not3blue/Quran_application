'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuranStore, type Ayah, type Surah, type SelectedWord } from '@/store/quran-store';
import { cn } from '@/lib/utils';
import { Bookmark, BookmarkCheck, MessageSquare, Sparkles, Volume2, ChevronRight, ChevronLeft, Info, Minus, Plus } from 'lucide-react';
import { 
  getTajweedColor, 
  TAJWEED_LEGEND, 
  TAJWEED_COLORS,
  findNextLetter 
} from '@/lib/tajweed-colors';

interface QuranReaderProps {
  onAyahSelect: (ayah: Ayah) => void;
  onTafsirToggle: () => void;
  onWordSelect: (word: SelectedWord) => void;
}

// إزالة التشكيل من النص
function removeDiacritics(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

// التحقق من وجود سكون
function hasSukun(text: string): boolean {
  return text.includes('\u0652'); // ْ
}

// التحقق من وجود شدة
function hasShadda(text: string): boolean {
  return text.includes('\u0651'); // ّ
}

// التحقق من وجود تنوين
function hasTanwin(text: string): boolean {
  return /[\u064B-\u064D]/.test(text);
}

// الحصول على الحرف الأساسي بدون تشكيل
function getBaseLetter(char: string): string {
  return char.replace(/[\u064B-\u065F\u0670]/g, '');
}

export function QuranReader({ onAyahSelect, onTafsirToggle, onWordSelect }: QuranReaderProps) {
  const {
    currentSurah,
    ayat,
    selectedAyah,
    setSelectedAyah,
    currentAyahIndex,
    setCurrentAyahIndex,
    fontSize,
    setFontSize,
    fontFamily,
    bookmarks,
    addBookmark,
    removeBookmark,
    selectedWord,
    wordPanelOpen,
    setTafsirPanelOpen,
  } = useQuranStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const ayahRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const [hoveredAyah, setHoveredAyah] = useState<number | null>(null);

  // التمرير للآية المحددة
  useEffect(() => {
    if (currentAyahIndex >= 0 && ayahRefs.current.size > 0) {
      const ayahElement = ayahRefs.current.get(currentAyahIndex);
      if (ayahElement) {
        ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentAyahIndex]);

  // التحقق من وجود علامة مرجعية
  const isBookmarked = (ayahId: number) => {
    return bookmarks.some((b) => b.ayahId === ayahId);
  };

  // إضافة/إزالة علامة مرجعية
  const toggleBookmark = (ayah: Ayah) => {
    if (isBookmarked(ayah.id)) {
      const bookmark = bookmarks.find((b) => b.ayahId === ayah.id);
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      addBookmark({
        id: `bookmark-${ayah.id}`,
        ayahId: ayah.id,
        surahId: currentSurah?.id || 0,
        ayahNumber: ayah.numberInSurah,
        color: '#d4af37',
        label: null,
      });
    }
  };

  // معالجة النقر على آية
  const handleAyahClick = useCallback(
    (ayah: Ayah, index: number) => {
      setSelectedAyah(ayah);
      setCurrentAyahIndex(index);
      onAyahSelect(ayah);
      // فتح لوحة التفسير تلقائياً
      setTafsirPanelOpen(true);
    },
    [setSelectedAyah, setCurrentAyahIndex, onAyahSelect, setTafsirPanelOpen]
  );

  // معالجة النقر على كلمة
  const handleWordClick = useCallback(
    (e: React.MouseEvent, ayah: Ayah, wordIndex: number) => {
      e.stopPropagation();

      // استخراج الكلمة من النص
      const text = ayah.textSimple || ayah.textUthmani;
      const words = text.split(/\s+/);

      if (wordIndex >= 0 && wordIndex < words.length) {
        const wordText = removeDiacritics(words[wordIndex].replace(/[^\u0600-\u06FF]/g, ''));

        if (wordText) {
          const selectedWord: SelectedWord = {
            text: wordText,
            ayahId: ayah.id,
            surahId: ayah.surahId,
            ayahNumber: ayah.numberInSurah,
            wordPosition: wordIndex,
          };
          onWordSelect(selectedWord);
        }
      }
    },
    [onWordSelect]
  );

  // تقسيم الآية إلى كلمات
  const getAyahWords = (ayah: Ayah) => {
    let text = ayah.textUthmani;
    // إزالة البسملة من الآية الأولى (ما عدا الفاتحة والتوبة)
    if (ayah.numberInSurah === 1 && currentSurah?.number !== 1 && currentSurah?.number !== 9) {
      const words = text.split(/\s+/);
      // إذا بدأت بكلمة "بسم" أو "بِسْمِ" - أزل أول 4 كلمات (البسملة)
      if (words.length > 4) {
        const firstWord = words[0].replace(/[^\u0621-\u063A\u0641-\u064A]/g, '');
        if (firstWord === 'بسم' || firstWord === 'بس') {
          return words.slice(4).filter(w => w.length > 0);
        }
      }
    }
    return text.split(/\s+/).filter(w => w.length > 0);
  };

  // تقديم كلمة مع تلوين أحكام التجويد
  const renderWordWithTajweed = (word: string): React.ReactNode => {
    const chars = word.split('');
    const result: React.ReactNode[] = [];
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const nextChar = i < chars.length - 1 ? chars[i + 1] : undefined;
      const baseChar = getBaseLetter(char);
      const baseNext = nextChar ? getBaseLetter(nextChar) : null;
      
      // تخطي علامات التشكيل في المعالجة ولكن عرضها مع الحرف السابق
      if (/[ًٌٍَُِّْ]/.test(char)) {
        result.push(char);
        continue;
      }
      
      let color: string | undefined = undefined;
      
      // حروف القلقلة (ق ط ب ج د) مع سكون أو شدة
      if (['ق', 'ط', 'ب', 'ج', 'د'].includes(baseChar)) {
        if (hasSukun(char) || hasShadda(char) || (i + 1 < chars.length && hasSukun(chars[i + 1]))) {
          color = TAJWEED_COLORS.qalqalah;
        }
      }
      
      // الغنة - النون أو الميم المشددتان
      if ((baseChar === 'ن' || baseChar === 'م')) {
        if (hasShadda(char) || (i + 1 < chars.length && hasShadda(chars[i + 1]))) {
          color = TAJWEED_COLORS.ghunnah;
        }
      }
      
      // النون الساكنة
      if (baseChar === 'ن' && (hasSukun(char) || (i + 1 < chars.length && hasSukun(chars[i + 1])))) {
        // البحث عن الحرف التالي في الكلمة
        let nextLetter: string | null = null;
        for (let j = i + 1; j < chars.length; j++) {
          const c = chars[j];
          if (/[ًٌٍَُِّْ]/.test(c)) continue;
          nextLetter = getBaseLetter(c);
          break;
        }
        
        if (nextLetter) {
          // حروف الإظهار: ء هـ ع ح غ خ
          if (['ء', 'ه', 'ع', 'ح', 'غ', 'خ'].includes(nextLetter)) {
            color = TAJWEED_COLORS.izhar;
          }
          // حروف الإدغام: ي ر م ل و
          else if (['ي', 'ر', 'م', 'ل', 'و'].includes(nextLetter)) {
            color = TAJWEED_COLORS.idgham;
          }
          // الإقلاب: ب
          else if (nextLetter === 'ب') {
            color = TAJWEED_COLORS.iqlab;
          }
          // الإخفاء
          else if (['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ'].includes(nextLetter)) {
            color = TAJWEED_COLORS.ikhfa;
          }
        }
      }
      
      // الميم الساكنة
      if (baseChar === 'م' && (hasSukun(char) || (i + 1 < chars.length && hasSukun(chars[i + 1])))) {
        let nextLetter: string | null = null;
        for (let j = i + 1; j < chars.length; j++) {
          const c = chars[j];
          if (/[ًٌٍَُِّْ]/.test(c)) continue;
          nextLetter = getBaseLetter(c);
          break;
        }
        
        if (nextLetter) {
          if (nextLetter === 'م') {
            color = TAJWEED_COLORS.idghamMim;
          } else if (nextLetter === 'ب') {
            color = TAJWEED_COLORS.ikhfaShafawi;
          } else if (!['ا', 'و', 'ي'].includes(nextLetter)) {
            color = TAJWEED_COLORS.izharShafawi;
          }
        }
      }
      
      // تطبيق اللون
      if (color) {
        // جمع الحرف مع التشكيل التالي إن وجد
        let charWithDiacritics = char;
        while (i + 1 < chars.length && /[ًٌٍَُِّْ]/.test(chars[i + 1])) {
          i++;
          charWithDiacritics += chars[i];
        }
        result.push(
          <span key={i} style={{ color }}>
            {charWithDiacritics}
          </span>
        );
      } else {
        result.push(char);
      }
    }
    
    return result;
  };

  if (!currentSurah) {
    return (
      <div className="flex-1 flex items-center justify-center quran-reading-area p-8">
        <div className="text-center max-w-lg">
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center shadow-2xl shadow-[var(--shadow-green)]">
              <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-[var(--primary)] mb-4 flex items-center justify-center gap-3">
            القرآن الكريم
            <Sparkles className="h-8 w-8 text-[var(--gold)]" />
          </h2>
          <p className="text-xl text-[var(--muted)] mb-8 leading-relaxed">
            اختر سورة من القائمة للبدء بالقراءة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col quran-reading-area overflow-hidden">
      {/* رأس السورة */}
      <div className="border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center shadow-lg">
              <span className="text-xl font-black text-white">{currentSurah.number}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                {currentSurah.nameAr}
                <Badge variant="outline" className={cn(
                  "text-xs px-2 py-0.5 rounded-full border-0",
                  currentSurah.revelation === 'مكية' 
                    ? "bg-[var(--burgundy)] text-white" 
                    : "bg-[var(--gold)] text-[var(--burgundy-dark)]"
                )}>
                  {currentSurah.revelation}
                </Badge>
              </h2>
              <p className="text-xs text-[var(--muted)]">
                {currentSurah.nameEn} • {currentSurah.ayahCount} آية
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* تحكم بحجم الخط */}
            <div className="flex items-center gap-1 bg-[var(--background-secondary)] rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                disabled={fontSize <= 16}
                className="h-8 w-8 p-0 rounded-md hover:bg-[var(--gold)]/20 disabled:opacity-40"
                title="تصغير الخط"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xs text-[var(--muted)] w-8 text-center font-medium">{fontSize}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFontSize(Math.min(48, fontSize + 2))}
                disabled={fontSize >= 48}
                className="h-8 w-8 p-0 rounded-md hover:bg-[var(--gold)]/20 disabled:opacity-40"
                title="تكبير الخط"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Badge variant="outline" className="px-3 py-1 rounded-lg border-[var(--gold)] text-[var(--gold-dark)] bg-[var(--gold)]/5 text-xs">
              الجزء {ayat[0]?.juz || '-'}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-lg border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5 text-xs">
              صفحة {ayat[0]?.page || '-'}
            </Badge>
          </div>
        </div>
        
        {/* مفتاح ألوان التجويد */}
        <div className="border-b border-[var(--border)] bg-[var(--card)]/50 px-4 py-2">
          <div className="flex items-center justify-center gap-4 flex-wrap max-w-4xl mx-auto">
            <span className="text-xs text-[var(--muted)] flex items-center gap-1">
              <Info className="h-3 w-3" />
              أحكام التجويد:
            </span>
            {TAJWEED_LEGEND.slice(0, 6).map((rule, index) => (
              <div key={index} className="flex items-center gap-1">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: rule.color }}
                />
                <span className="text-xs text-[var(--foreground)]">{rule.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* صفحات القرآن */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-6">
          {/* صفحة قرآنية واحدة */}
          <div className="quran-page max-w-4xl mx-auto">
            {/* إطار الصفحة */}
            <div className="page-frame">
              {/* عنوان الصفحة */}
              <div className="page-header">
                <span className="text-sm font-bold text-[var(--gold-dark)]">
                  {currentSurah.nameAr}
                </span>
                <span className="text-xs text-[var(--muted)]">
                  الجزء {ayat[0]?.juz || '-'} - صفحة {ayat[0]?.page || '-'}
                </span>
              </div>

              {/* محتوى الآيات - جنب إلى جنب */}
              <div className="page-content">
                {/* البسملة في سطر منفصل */}
                {currentSurah.number !== 9 && currentSurah.number !== 1 && (
                  <div className="text-center mb-8 pb-6 border-b-2 border-[var(--gold)]/30">
                    <p 
                      className="text-[var(--primary)] font-bold leading-loose"
                      style={{ 
                        fontFamily: '"Scheherazade New", "Amiri Quran", serif',
                        fontSize: `${fontSize + 8}px`,
                        fontWeight: 700,
                        textAlign: 'center',
                        width: '100%',
                        display: 'block'
                      }}
                    >
                      ﴾ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿
                    </p>
                  </div>
                )}
                
                {/* الآيات */}
                <div 
                  className={cn(
                    "ayah-text-inline quran-text",
                    `font-${fontFamily}`
                  )}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {ayat.map((ayah, index) => {
                    const words = getAyahWords(ayah);
                    return (
                      <span
                        key={ayah.id}
                        ref={(el) => {
                          if (el) ayahRefs.current.set(index, el);
                        }}
                        className={cn(
                          "ayah-inline",
                          selectedAyah?.id === ayah.id && "ayah-inline-selected",
                          hoveredAyah === ayah.id && "ayah-inline-hovered"
                        )}
                        onClick={() => handleAyahClick(ayah, index)}
                        onMouseEnter={() => setHoveredAyah(ayah.id)}
                        onMouseLeave={() => setHoveredAyah(null)}
                      >
                        {/* كلمات الآية */}
                        {words.map((word, wordIndex) => {
                          const cleanedWord = removeDiacritics(word.replace(/[^\u0600-\u06FF]/g, ''));
                          const isSelected = selectedWord?.text === cleanedWord;
                          return (
                            <span key={wordIndex}>
                              <span
                                className={cn(
                                  "word",
                                  isSelected && "word-selected"
                                )}
                                onClick={(e) => handleWordClick(e, ayah, wordIndex)}
                              >
                                {renderWordWithTajweed(word)}
                              </span>
                              {' '}
                            </span>
                          );
                        })}
                        {/* رقم الآية */}
                        <span className="ayah-number">{ayah.numberInSurah}</span>{' '}
                        {/* مؤشر السجدة */}
                        {ayah.sajda && (
                          <span className="sajda-indicator">۩</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* تذييل الصفحة */}
              <div className="page-footer">
                <ChevronRight className="h-4 w-4 text-[var(--gold)]" />
                <span className="text-xs text-[var(--muted)]">الحزب {ayat[0]?.hizb || '-'}</span>
                <ChevronLeft className="h-4 w-4 text-[var(--gold)]" />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* شريط أدوات الآية المحددة */}
      {selectedAyah && (
        <div className="border-t border-[var(--border)] bg-[var(--card)] p-3">
          <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleBookmark(selectedAyah)}
              className={cn(
                "gap-2 rounded-lg h-10 font-semibold",
                isBookmarked(selectedAyah.id)
                  ? "bg-[var(--gold)] text-white border-[var(--gold)]" 
                  : "hover:border-[var(--gold)]"
              )}
            >
              {isBookmarked(selectedAyah.id) ? (
                <>
                  <BookmarkCheck className="h-4 w-4" />
                  <span>محفوظة</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  <span>حفظ</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onTafsirToggle}
              className="gap-2 rounded-lg h-10 hover:border-[var(--primary)]"
            >
              <MessageSquare className="h-4 w-4" />
              <span>التفسير</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-lg h-10">
              <Volume2 className="h-4 w-4" />
              <span>استماع</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
