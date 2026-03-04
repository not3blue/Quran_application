'use client';

import { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Share2, Bookmark, Copy, Check, BookOpen, Sparkles, Moon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { sahifaSajjadiya, duaCategories, type Dua } from '@/data/sahifa-sajjadiya';
import { useToast } from '@/hooks/use-toast';

interface SahifaSajjadiyaProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SahifaSajjadiya({ isOpen, onClose }: SahifaSajjadiyaProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const { toast } = useToast();

  // تصفية الأدعية حسب التصنيف
  const filteredDuas = useMemo(() => {
    if (!selectedCategory) return sahifaSajjadiya;
    return sahifaSajjadiya.filter((dua) => dua.category === selectedCategory);
  }, [selectedCategory]);

  // نسخ الدعاء
  const handleCopy = async (dua: Dua) => {
    const text = `${dua.title}\n\n${dua.content.join('\n\n')}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ الدعاء إلى الحافظة',
    });
  };

  // تبديل المفضلة
  const toggleBookmark = (duaId: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(duaId) ? prev.filter((id) => id !== duaId) : [...prev, duaId]
    );
    toast({
      title: bookmarkedIds.includes(duaId) ? 'تمت الإزالة' : 'تمت الإضافة',
      description: bookmarkedIds.includes(duaId) ? 'تمت إزالة الدعاء من المفضلة' : 'تمت إضافة الدعاء إلى المفضلة',
    });
  };

  // المشاركة
  const handleShare = async (dua: Dua) => {
    const text = `${dua.title}\n\n${dua.content.join('\n\n')}\n\nمن الصحيفة السجادية`;
    if (navigator.share) {
      await navigator.share({
        title: dua.title,
        text: text,
      });
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'تم النسخ',
        description: 'تم نسخ الدعاء للمشاركة',
      });
    }
  };

  // التنقل بين الأدعية
  const navigateDua = (direction: 'prev' | 'next') => {
    if (!selectedDua) return;
    const currentIndex = sahifaSajjadiya.findIndex((d) => d.id === selectedDua.id);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < sahifaSajjadiya.length) {
      setSelectedDua(sahifaSajjadiya[newIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* الخلفية المتدرجة الاحترافية */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-950">
        {/* طبقة زخرفية علوية */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        
        {/* نجوم متلألئة */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Star className="w-1 h-1 text-amber-300/30" fill="currentColor" />
            </div>
          ))}
        </div>
        
        {/* زخرفة إسلامية */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a852' fill-opacity='1'%3E%3Cpath d='M40 0l40 40-40 40L0 40 40 0zm0 10L10 40l30 30 30-30L40 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative h-full flex flex-col">
        {/* الهيدر الاحترافي */}
        <header className="flex-shrink-0 backdrop-blur-xl bg-emerald-950/60 border-b border-amber-500/20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-amber-200/70 hover:text-amber-100 hover:bg-amber-500/10 rounded-xl transition-all duration-300"
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="flex items-center gap-4">
                {/* أيقونة متوهجة */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl blur-lg opacity-50 animate-pulse" />
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
                    <BookOpen className="h-7 w-7 text-emerald-950" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-l from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent flex items-center gap-3">
                    الصحيفة السجادية
                    <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
                  </h1>
                  <p className="text-sm text-emerald-300/70 flex items-center gap-2">
                    <Moon className="w-3 h-3" />
                    الإمام زين العابدين عليه السلام
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-200 border border-amber-500/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="font-bold text-lg">{sahifaSajjadiya.length}</span>
                <span className="mr-1 text-amber-300/80">دعاء</span>
              </Badge>
            </div>
          </div>
        </header>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex overflow-hidden">
          {/* الشريط الجانبي - التصنيفات */}
          <aside className="w-72 flex-shrink-0 border-l border-amber-500/10 bg-emerald-950/40 backdrop-blur-sm overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="text-lg font-bold text-amber-200 mb-4 flex items-center gap-2 px-2">
                  <Heart className="h-5 w-5 text-amber-500" />
                  التصنيفات
                </h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === null ? 'default' : 'ghost'}
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "w-full justify-start gap-3 rounded-xl h-12 transition-all duration-300",
                      selectedCategory === null
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-semibold shadow-lg shadow-amber-500/30"
                        : "text-emerald-200/70 hover:text-amber-100 hover:bg-amber-500/10"
                    )}
                  >
                    <span className="text-lg">📚</span>
                    <span>جميع الأدعية</span>
                    <Badge variant="outline" className="mr-auto bg-transparent border-amber-500/30 text-inherit">
                      {sahifaSajjadiya.length}
                    </Badge>
                  </Button>
                  {duaCategories.map((category) => {
                    const count = sahifaSajjadiya.filter((d) => d.category === category.id).length;
                    if (count === 0) return null;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'ghost'}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "w-full justify-start gap-3 rounded-xl h-12 transition-all duration-300",
                          selectedCategory === category.id
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-semibold shadow-lg shadow-amber-500/30"
                            : "text-emerald-200/70 hover:text-amber-100 hover:bg-amber-500/10"
                        )}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                        <Badge variant="outline" className="mr-auto bg-transparent border-amber-500/30 text-inherit">
                          {count}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </aside>

          {/* قائمة الأدعية */}
          <div className="w-96 flex-shrink-0 border-l border-amber-500/10 bg-emerald-950/20 backdrop-blur-sm overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {filteredDuas.map((dua, index) => (
                  <button
                    key={dua.id}
                    onClick={() => setSelectedDua(dua)}
                    className={cn(
                      "w-full text-right p-4 rounded-xl transition-all duration-300 border-2 group",
                      "hover:shadow-xl",
                      selectedDua?.id === dua.id
                        ? "bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-500/5 border-amber-500/50 shadow-lg shadow-amber-500/20"
                        : "bg-white/5 border-transparent hover:border-amber-500/30 hover:bg-amber-500/5"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-lg transition-all duration-300",
                        selectedDua?.id === dua.id
                          ? "bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 shadow-lg"
                          : "bg-emerald-800/50 text-amber-200/70 group-hover:bg-amber-500/20 group-hover:text-amber-200"
                      )}>
                        {dua.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-amber-100 text-lg leading-tight mb-1 group-hover:text-amber-50 transition-colors">
                          {dua.title}
                        </h4>
                        <p className="text-sm text-emerald-300/50 line-clamp-2">
                          {dua.content[0].substring(0, 80)}...
                        </p>
                      </div>
                      {bookmarkedIds.includes(dua.id) && (
                        <Bookmark className="h-5 w-5 text-amber-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* محتوى الدعاء */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-emerald-950/30 via-transparent to-emerald-900/20">
            {selectedDua ? (
              <>
                {/* هيدر الدعاء */}
                <div className="flex-shrink-0 p-6 border-b border-amber-500/10 bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-transparent backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl blur-xl opacity-40" />
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-emerald-950 font-bold text-xl shadow-xl shadow-amber-500/30">
                          {selectedDua.id}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-amber-100 leading-tight">
                          {selectedDua.title}
                        </h2>
                        <p className="text-sm text-emerald-300/50 mt-1">{selectedDua.titleEn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(selectedDua.id)}
                        className={cn(
                          "rounded-xl w-10 h-10 transition-all duration-300",
                          bookmarkedIds.includes(selectedDua.id)
                            ? "text-amber-500 hover:text-amber-400 bg-amber-500/10"
                            : "text-emerald-300/50 hover:text-amber-200 hover:bg-amber-500/10"
                        )}
                      >
                        <Bookmark className={cn("h-5 w-5", bookmarkedIds.includes(selectedDua.id) && "fill-current")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(selectedDua)}
                        className="text-emerald-300/50 hover:text-amber-200 rounded-xl w-10 h-10 transition-all duration-300 hover:bg-amber-500/10"
                      >
                        {copiedId === selectedDua.id ? (
                          <Check className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare(selectedDua)}
                        className="text-emerald-300/50 hover:text-amber-200 rounded-xl w-10 h-10 transition-all duration-300 hover:bg-amber-500/10"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <Badge className="mt-4 bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/20 px-3 py-1 rounded-full">
                    {duaCategories.find((c) => c.id === selectedDua.category)?.name}
                  </Badge>
                </div>

                {/* محتوى الدعاء مع شريط تمرير */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-8">
                      <div className="max-w-3xl mx-auto space-y-8">
                        {selectedDua.content.map((paragraph, index) => (
                          <div
                            key={index}
                            className="relative group"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {/* خط ذهبي متدرج */}
                            <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-amber-500 via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-lg shadow-amber-500/50" />
                            
                            {/* خلفية متوهجة عند التحويم */}
                            <div className="absolute inset-0 bg-gradient-to-l from-amber-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <p className="text-2xl leading-loose text-amber-50/90 font-arabic text-right pr-6 relative z-10 group-hover:text-amber-50 transition-colors duration-300">
                              {paragraph}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>

                {/* التنقل */}
                <div className="flex-shrink-0 p-4 border-t border-amber-500/10 bg-emerald-950/60 backdrop-blur-sm">
                  <div className="flex items-center justify-between max-w-3xl mx-auto">
                    <Button
                      variant="ghost"
                      onClick={() => navigateDua('prev')}
                      disabled={selectedDua.id === 1}
                      className="text-emerald-200/70 hover:text-amber-200 hover:bg-amber-500/10 rounded-xl gap-2 disabled:opacity-30 transition-all duration-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                      <span>السابق</span>
                    </Button>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: Math.min(5, sahifaSajjadiya.length) }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all duration-300",
                              i === Math.floor((selectedDua.id - 1) / (sahifaSajjadiya.length / 5))
                                ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                                : "bg-emerald-700/50"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-emerald-300/50 text-sm font-medium">
                        {selectedDua.id} / {sahifaSajjadiya.length}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => navigateDua('next')}
                      disabled={selectedDua.id === sahifaSajjadiya.length}
                      className="text-emerald-200/70 hover:text-amber-200 hover:bg-amber-500/10 rounded-xl gap-2 disabled:opacity-30 transition-all duration-300"
                    >
                      <span>التالي</span>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full blur-2xl opacity-30 animate-pulse" />
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-500/5 flex items-center justify-center border border-amber-500/20 backdrop-blur-sm">
                      <BookOpen className="h-14 w-14 text-amber-500/80" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-amber-100 mb-2">اختر دعاءً للقراءة</h3>
                  <p className="text-emerald-300/50">اختر دعاءً من القائمة لعرضه</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* الفوتر */}
        <footer className="flex-shrink-0 py-3 px-6 border-t border-amber-500/10 bg-emerald-950/60 backdrop-blur-sm">
          <div className="flex items-center justify-center text-sm text-emerald-300/50">
            <span>صنع بواسطة المهندس محمد عزالدين</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
