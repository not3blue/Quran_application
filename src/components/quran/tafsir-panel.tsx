'use client';

import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuranStore, type Ayah } from '@/store/quran-store';
import { cn } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight, BookOpen, Sparkles, User, Loader2, ExternalLink } from 'lucide-react';

interface TafsirPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TafsirPanel({ isOpen, onClose }: TafsirPanelProps) {
  const {
    selectedAyah,
    currentTafsir,
    setCurrentTafsir,
    currentSurah,
    ayat,
    currentAyahIndex,
    setCurrentAyahIndex,
    setSelectedAyah,
  } = useQuranStore();

  const [isLoading, setIsLoading] = useState(false);

  // جلب التفسير عند تحديد آية
  useEffect(() => {
    const fetchTafsir = async () => {
      if (!selectedAyah) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/tafsir/${selectedAyah.id}`);
        const data = await response.json();
        setCurrentTafsir(data);
      } catch (error) {
        console.error('Error fetching tafsir:', error);
        setCurrentTafsir([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTafsir();
  }, [selectedAyah, setCurrentTafsir]);

  // التنقل بين الآيات
  const navigateAyah = (direction: 'prev' | 'next') => {
    if (!ayat.length) return;

    if (direction === 'prev' && currentAyahIndex > 0) {
      const newIndex = currentAyahIndex - 1;
      setCurrentAyahIndex(newIndex);
      setSelectedAyah(ayat[newIndex]);
    } else if (direction === 'next' && currentAyahIndex < ayat.length - 1) {
      const newIndex = currentAyahIndex + 1;
      setCurrentAyahIndex(newIndex);
      setSelectedAyah(ayat[newIndex]);
    }
  };

  if (!isOpen) return null;

  const tafsirText = currentTafsir[0]?.text || '';
  const tafsirSource = currentTafsir[0]?.source;

  return (
    <aside
      className={cn(
        'w-96 border-l border-[var(--border)] bg-[var(--card)] flex flex-col transition-all duration-300 shadow-xl',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      dir="rtl"
    >
      {/* رأس اللوحة */}
      <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-gradient-to-l from-[var(--gold)]/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] flex items-center justify-center shadow-md">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">التفسير</h3>
            <p className="text-xs text-[var(--muted)]">التيسير في التفسير</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-xl hover:bg-[var(--background-secondary)]"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* الآية المحددة */}
      {selectedAyah && (
        <div className="p-5 border-b border-[var(--border)] bg-gradient-to-l from-[var(--primary)]/5 via-transparent to-[var(--primary)]/5">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="outline"
              className="px-4 py-2 rounded-xl bg-gradient-to-l from-[var(--primary)] to-[var(--primary-light)] text-white border-0 font-semibold"
            >
              {currentSurah?.nameAr} - الآية {selectedAyah.numberInSurah}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-[var(--background-secondary)]"
                onClick={() => navigateAyah('prev')}
                disabled={currentAyahIndex === 0}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-[var(--background-secondary)]"
                onClick={() => navigateAyah('next')}
                disabled={currentAyahIndex === ayat.length - 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--background)] border-2 border-[var(--gold)]/30 shadow-sm">
            <p className="quran-text text-xl leading-loose text-[var(--primary)] text-center">
              {selectedAyah.textUthmani}
            </p>
          </div>
        </div>
      )}

      {/* التفسير */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--gold)] mx-auto mb-4" />
            <p className="text-[var(--muted)] font-medium">جاري تحميل التفسير...</p>
          </div>
        </div>
      ) : !selectedAyah ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[var(--background-secondary)] flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-[var(--muted)]" />
            </div>
            <p className="text-[var(--muted)] font-medium">اختر آية لعرض تفسيرها</p>
          </div>
        </div>
      ) : currentTafsir.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[var(--background-secondary)] flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-[var(--muted)]" />
            </div>
            <p className="text-[var(--muted)] font-medium">لا يوجد تفسير متاح لهذه الآية حالياً</p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-5">
            {/* معلومات المصدر */}
            <div className="mb-5 pb-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)]">
                    {tafsirSource?.authorAr || 'السيد بدرالدين أمير الدين الحوثي'}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {tafsirSource?.nameAr || 'التيسير في التفسير'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                تفسير جامع يجمع بين التفسير بالمأثور والمعقول، يركز على المعاني والإرشادات القرآنية بأسلوب
                سهل وواضح.
              </p>
              {/* رابط المصدر */}
              <a
                href="https://ziydia.com/book/514"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-xs text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span>مشاهدة في زيدية</span>
              </a>
            </div>

            {/* نص التفسير */}
            <div className="prose prose-sm max-w-none">
              <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <div className="leading-loose text-justify text-[var(--foreground)] text-base whitespace-pre-line">
                  {tafsirText.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph.startsWith('تفسير') || paragraph.startsWith('الآية') ? (
                        <span className="font-bold text-[var(--primary)]">{paragraph}</span>
                      ) : (
                        <span>{paragraph}</span>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* ملاحظة */}
            <div className="mt-5 p-4 rounded-xl bg-[var(--gold)]/5 border border-[var(--gold)]/20">
              <p className="text-xs text-[var(--muted)] leading-relaxed text-center">
                التفسير من كتاب &quot;التيسير في التفسير&quot; للعلامة السيد بدرالدين أمير الدين الحوثي رحمه الله
              </p>
            </div>

            {/* التنقل بين الآيات */}
            <div className="mt-5 flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateAyah('prev')}
                disabled={currentAyahIndex === 0}
                className="gap-2 rounded-xl"
              >
                <ChevronRight className="h-4 w-4" />
                <span>الآية السابقة</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateAyah('next')}
                disabled={currentAyahIndex === ayat.length - 1}
                className="gap-2 rounded-xl"
              >
                <span>الآية التالية</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </ScrollArea>
      )}
    </aside>
  );
}
