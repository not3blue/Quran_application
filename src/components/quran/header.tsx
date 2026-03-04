'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Search, BookOpen, Settings, X, Sparkles, BookMarked, Heart, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useQuranStore, type Ayah } from '@/store/quran-store';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Ayah[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { surahs, setCurrentSurah, setAyat, currentView, setCurrentView } = useQuranStore();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = async (ayah: Ayah & { surah: { id: number; number: number; nameAr: string } }) => {
    try {
      const response = await fetch(`/api/quran/surah/${ayah.surah?.number || ayah.surahId}`);
      const surah = await response.json();
      setCurrentSurah(surah);
      setAyat(surah.ayat);
      setSearchOpen(false);
      setCurrentView('quran');
    } catch (error) {
      console.error('Error loading surah:', error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-gradient-to-l from-[#0d4a3a] via-[#0a3d2e] to-[#0d4a3a] border-b border-amber-400/30 shadow-xl shadow-black/20">
        <div className="flex h-[72px] items-center justify-between px-6">
          {/* الشعار وزر الرجوع */}
          <div className="flex items-center gap-4">
            {/* زر الرجوع للصفحة الرئيسية - يظهر فقط في صفحة القرآن */}
            {currentView === 'quran' && (
              <Button
                variant="ghost"
                onClick={() => setCurrentView('home')}
                className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl px-4 h-10 gap-2 font-medium transition-all duration-300"
              >
                <ArrowRight className="h-5 w-5" />
                <span>الرئيسية</span>
              </Button>
            )}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40 ring-2 ring-amber-300/30">
              <BookOpen className="h-6 w-6 text-emerald-900 drop-shadow" />
            </div>
            <div className="text-amber-50">
              <h1 className="text-xl font-bold tracking-wide flex items-center gap-2 drop-shadow">
                المصحف الإلكتروني
                <Sparkles className="h-5 w-5 text-amber-400 inline animate-pulse" />
              </h1>
              <p className="text-sm text-amber-200/80 font-medium">القرآن الكريم مع التفسير والاستماع</p>
            </div>
          </div>

          {/* تبويبات التنقل */}
          <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1.5 backdrop-blur-md border border-white/10">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('quran')}
              className={cn(
                "rounded-lg px-5 h-10 gap-2 font-medium transition-all duration-300",
                currentView === 'quran'
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 shadow-lg shadow-amber-500/40 font-bold"
                  : "text-amber-100/80 hover:text-amber-50 hover:bg-white/10"
              )}
            >
              <BookOpen className="h-5 w-5" />
              <span>القرآن الكريم</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView('duas')}
              className={cn(
                "rounded-lg px-5 h-10 gap-2 font-medium transition-all duration-300",
                currentView === 'duas'
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 shadow-lg shadow-amber-500/40 font-bold"
                  : "text-amber-100/80 hover:text-amber-50 hover:bg-white/10"
              )}
            >
              <Heart className="h-5 w-5" />
              <span>الصحيفة السجادية</span>
            </Button>
          </div>

          {/* أزرار التحكم */}
          <div className="flex items-center gap-3">
            {/* زر البحث */}
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setSearchOpen(true)}
              className="relative bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl px-5 h-11 gap-2 font-medium transition-all duration-300"
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">البحث</span>
            </Button>
            
            {/* زر الوضع الليلي */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl w-11 h-11 transition-all duration-300"
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            
            {/* زر الإعدادات */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl w-11 h-11 transition-all duration-300"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* نافذة البحث */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] bg-[var(--card)] border-2 border-[var(--border-gold)] rounded-2xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-[var(--border)]">
            <DialogTitle className="text-right text-2xl font-bold text-[var(--primary)] flex items-center justify-end gap-2">
              <Sparkles className="h-6 w-6 text-[var(--gold)]" />
              البحث في القرآن الكريم
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-3 pt-4">
            <Input
              placeholder="اكتب كلمة أو جزء من آية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-right text-lg h-14 rounded-xl border-2 border-[var(--border)] focus:border-[var(--gold)] focus:ring-[var(--gold)] bg-[var(--background)]"
              dir="rtl"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="btn-premium h-14 px-8 rounded-xl text-lg"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  <span>جاري البحث...</span>
                </div>
              ) : (
                <>
                  <Search className="h-5 w-5 ml-2" />
                  بحث
                </>
              )}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-6 max-h-[50vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold border-0">
                  تم العثور على {searchResults.length} نتيجة
                </Badge>
              </div>
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    className={cn(
                      "p-5 rounded-xl cursor-pointer transition-all duration-300 border-2",
                      "bg-[var(--card)] border-[var(--border)]",
                      "hover:border-[var(--gold)] hover:shadow-lg hover:shadow-[var(--gold-glow)]",
                      "hover:-translate-x-1",
                      "text-right fade-in-up"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleResultClick(result as Ayah & { surah: { id: number; nameAr: string } })}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant="outline" 
                        className="bg-gradient-to-l from-[var(--primary)] to-[var(--primary-light)] text-white px-4 py-1.5 rounded-full text-sm font-semibold border-0"
                      >
                        {(result as Ayah & { surah: { nameAr: string } }).surah?.nameAr || 'سورة'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="ayah-number text-sm">
                          {result.numberInSurah}
                        </span>
                      </div>
                    </div>
                    <p className="quran-text text-xl leading-relaxed text-[var(--quran-text)]">
                      {result.textUthmani}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {searchQuery && searchResults.length === 0 && !isSearching && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--background-secondary)] flex items-center justify-center">
                <Search className="h-10 w-10 text-[var(--muted)]" />
              </div>
              <p className="text-lg text-[var(--muted)]">لم يتم العثور على نتائج</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">جرب البحث بكلمات أخرى</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
