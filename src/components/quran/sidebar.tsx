'use client';

import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuranStore, type Surah } from '@/store/quran-store';
import { cn } from '@/lib/utils';
import { Search, BookOpen, Layers, Star, ChevronLeft, Home } from 'lucide-react';

interface SidebarProps {
  onSurahSelect: (surah: Surah) => void;
}

export function Sidebar({ onSurahSelect }: SidebarProps) {
  const { surahs, currentSurah, setSurahs, currentView, setCurrentView } = useQuranStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'meccan' | 'medinan'>('all');
  const [hoveredSurah, setHoveredSurah] = useState<number | null>(null);

  // جلب السور
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('/api/quran/surahs');
        const data = await response.json();
        setSurahs(data);
      } catch (error) {
        console.error('Error fetching surahs:', error);
      }
    };
    
    if (surahs.length === 0) {
      fetchSurahs();
    }
  }, [surahs.length, setSurahs]);

  // تصفية السور
  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch = searchQuery
      ? surah.nameAr.includes(searchQuery) ||
        surah.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString() === searchQuery
      : true;
    
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'meccan' 
        ? surah.revelation === 'مكية'
        : surah.revelation === 'مدنية';
    
    return matchesSearch && matchesFilter;
  });

  // قائمة الأجزاء
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <aside className="premium-sidebar w-80 flex flex-col h-full">
      {/* زر الرئيسية */}
      <div className="p-4 border-b border-[var(--border)]">
        <button
          onClick={() => setCurrentView('home')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
            currentView === 'home'
              ? "bg-gradient-to-l from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg"
              : "bg-[var(--background-secondary)] hover:bg-[var(--primary)]/10 text-[var(--foreground)]"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="font-bold">الصفحة الرئيسية</span>
        </button>
      </div>

      {/* العنوان */}
      <div className="p-5 border-b border-[var(--border)] bg-gradient-to-l from-[var(--primary)]/5 to-transparent">
        <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          تصفح القرآن
        </h2>
      </div>

      {/* البحث */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)]" />
          <Input
            placeholder="ابحث عن سورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12 h-12 text-right rounded-xl border-2 border-[var(--border)] focus:border-[var(--gold)] bg-[var(--background)] text-lg"
          />
        </div>
      </div>

      {/* التبويبات */}
      <Tabs defaultValue="surahs" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4 mt-4 h-12 rounded-xl bg-[var(--background-secondary)] p-1">
          <TabsTrigger value="surahs" className="text-sm rounded-lg data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white font-semibold transition-all">
            <BookOpen className="h-4 w-4 ml-2" />
            السور
          </TabsTrigger>
          <TabsTrigger value="juz" className="text-sm rounded-lg data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white font-semibold transition-all">
            <Layers className="h-4 w-4 ml-2" />
            الأجزاء
          </TabsTrigger>
        </TabsList>

        {/* فلتر نوع الوحي */}
        <TabsContent value="surahs" className="flex-1 m-0">
          <div className="flex gap-2 px-4 py-3 border-b border-[var(--border)]">
            <Badge
              variant={filter === 'all' ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer text-sm px-4 py-1.5 rounded-full transition-all font-semibold",
                filter === 'all' 
                  ? "bg-[var(--primary)] text-white border-0" 
                  : "hover:bg-[var(--background-secondary)]"
              )}
              onClick={() => setFilter('all')}
            >
              الكل ({surahs.length})
            </Badge>
            <Badge
              variant={filter === 'meccan' ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer text-sm px-4 py-1.5 rounded-full transition-all font-semibold",
                filter === 'meccan' 
                  ? "bg-[var(--burgundy)] text-white border-0" 
                  : "hover:bg-[var(--background-secondary)]"
              )}
              onClick={() => setFilter('meccan')}
            >
              مكية
            </Badge>
            <Badge
              variant={filter === 'medinan' ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer text-sm px-4 py-1.5 rounded-full transition-all font-semibold",
                filter === 'medinan' 
                  ? "bg-[var(--gold-dark)] text-white border-0" 
                  : "hover:bg-[var(--background-secondary)]"
              )}
              onClick={() => setFilter('medinan')}
            >
              مدنية
            </Badge>
          </div>

          {/* قائمة السور */}
          <ScrollArea className="flex-1 h-[calc(100vh-340px)]">
            <div className="p-3 space-y-2">
              {filteredSurahs.map((surah, index) => (
                <button
                  key={surah.number}
                  onClick={() => onSurahSelect(surah)}
                  onMouseEnter={() => setHoveredSurah(surah.number)}
                  onMouseLeave={() => setHoveredSurah(null)}
                  className={cn(
                    "surah-card w-full group",
                    currentSurah?.number === surah.number && "active"
                  )}
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <div className="surah-number">
                    {surah.number}
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full transition-all",
                        surah.revelation === 'مكية' 
                          ? "bg-[var(--burgundy)]/10 text-[var(--burgundy)]" 
                          : "bg-[var(--gold)]/20 text-[var(--gold-dark)]",
                        currentSurah?.number === surah.number && "bg-white/20 text-white"
                      )}>
                        {surah.revelation}
                      </span>
                      <p className={cn(
                        "font-bold text-lg truncate transition-colors",
                        currentSurah?.number === surah.number 
                          ? "text-white" 
                          : "text-[var(--foreground)]"
                      )}>
                        {surah.nameAr}
                      </p>
                    </div>
                    <p className={cn(
                      "text-sm mt-1 flex items-center justify-end gap-2",
                      currentSurah?.number === surah.number 
                        ? "text-white/70" 
                        : "text-[var(--muted)]"
                    )}>
                      <span>{surah.ayahCount} آية</span>
                      <span className="text-[var(--border)]">•</span>
                      <span className="font-normal">{surah.nameEn}</span>
                    </p>
                  </div>
                  <ChevronLeft className={cn(
                    "h-5 w-5 transition-all duration-300",
                    currentSurah?.number === surah.number 
                      ? "text-white opacity-100" 
                      : "text-[var(--muted)] opacity-0 group-hover:opacity-100"
                  )} />
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* قائمة الأجزاء */}
        <TabsContent value="juz" className="flex-1 m-0 mt-4">
          <div className="px-4">
            <p className="text-sm text-[var(--muted)] mb-4 text-right font-medium">
              اختر جزءاً للانتقال إليه
            </p>
          </div>
          <ScrollArea className="flex-1 h-[calc(100vh-340px)]">
            <div className="grid grid-cols-5 gap-3 p-4">
              {juzList.map((juz) => (
                <button
                  key={juz}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-xl transition-all duration-300",
                    "bg-[var(--card)] border-2 border-[var(--border)]",
                    "hover:border-[var(--gold)] hover:shadow-lg hover:shadow-[var(--gold-glow)]",
                    "hover:bg-gradient-to-br hover:from-[var(--primary)] hover:to-[var(--primary-light)]",
                    "hover:text-white hover:scale-105",
                    "font-bold text-lg text-[var(--foreground)]"
                  )}
                >
                  {juz}
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* معلومات */}
      <div className="p-4 border-t border-[var(--border)] bg-gradient-to-l from-[var(--gold)]/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-[var(--gold)]" />
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {surahs.length} سورة
            </span>
          </div>
          <span className="text-xs text-[var(--muted)]">
            30 جزء • 60 حزب
          </span>
        </div>
      </div>
    </aside>
  );
}
