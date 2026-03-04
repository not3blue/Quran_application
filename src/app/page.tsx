'use client';

import { useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/quran/header';
import { Sidebar } from '@/components/quran/sidebar';
import { QuranReader } from '@/components/quran/quran-reader';
import { TafsirPanel } from '@/components/quran/tafsir-panel';
import { WordAnalysisPanel } from '@/components/quran/word-analysis-panel';
import { AudioPlayer } from '@/components/quran/audio-player';
import { SettingsDialog } from '@/components/quran/settings-dialog';
import { SahifaSajjadiya } from '@/components/quran/sahifa-sajjadiya';
import {
  useQuranStore,
  type Surah,
  type Ayah,
  type SelectedWord,
} from '@/store/quran-store';
import { Toaster } from '@/components/ui/toaster';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Clock, ChevronLeft, MapPin, BookMarked, Sparkles, RefreshCw
} from 'lucide-react';

// نوع بيانات أوقات الصلاة
interface PrayerTime {
  key: string;
  name: string;
  time: string;
  timeFormatted: string;
}

interface PrayerTimesData {
  city: string;
  date: {
    gregorian: string;
    hijri: string;
  };
  prayers: PrayerTime[];
  sunrise: string;
  method: string;
}

// مكون الصفحة الرئيسية
function HomePage({ 
  onSurahSelect, 
  onQuranClick,
  onLastReadingClick
}: { 
  onSurahSelect: (surah: Surah) => void;
  onQuranClick: () => void;
  onLastReadingClick: () => void;
}) {
  const { surahs, currentSurah, setCurrentView, lastReading } = useQuranStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const [hijriDate, setHijriDate] = useState('');

  // جلب أوقات الصلاة
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoadingPrayers(true);
        const response = await fetch('/api/prayer-times?city=sanaa');
        const data = await response.json();
        
        if (data.success && data.data) {
          setPrayerTimes(data.data);
          setHijriDate(data.data.date.hijri);
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      } finally {
        setLoadingPrayers(false);
      }
    };

    fetchPrayerTimes();
    
    // تحديث كل دقيقة
    const interval = setInterval(fetchPrayerTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-auto relative">
      {/* خلفية متدرجة فاخرة HD */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d4a3a] via-[#0a3d2e] to-[#072a21]"></div>
      
      {/* نقش إسلامي خلفية */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a852' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}></div>
      
      {/* زخرفة دوائر ذهبية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] border border-amber-400/10 rounded-full"></div>
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] border border-amber-400/5 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] border border-amber-400/10 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-[450px] h-[450px] border border-amber-400/5 rounded-full"></div>
      </div>
      
      {/* نجوم متلألئة HD */}
      <div className="absolute top-12 right-24 w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
      <div className="absolute top-20 left-40 w-2 h-2 bg-amber-200 rounded-full animate-pulse shadow-lg shadow-amber-300/50" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute top-32 right-56 w-1 h-1 bg-white rounded-full animate-pulse shadow-lg shadow-white/50" style={{ animationDelay: '0.7s' }}></div>
      <div className="absolute bottom-32 left-28 w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse shadow-lg shadow-amber-400/50" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-48 left-20 w-1 h-1 bg-amber-400/80 rounded-full animate-pulse shadow-lg shadow-amber-400/50" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-48 right-40 w-2 h-2 bg-amber-200/80 rounded-full animate-pulse shadow-lg shadow-amber-300/50" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        
        {/* القسم العلوي - الآية الكريمة */}
        <div className="text-center mb-8 sm:mb-10">
          {/* شعار */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-2xl opacity-40 animate-pulse scale-150"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-2xl ring-4 ring-amber-400/30 ring-offset-4 ring-offset-[#0a3d2e]">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-900 drop-shadow-lg" />
            </div>
          </div>
          
          {/* الآية الكريمة */}
          <div className="relative py-4 sm:py-6">
            <div className="relative flex flex-col items-center justify-center">
              {/* إطار زخرفي متعدد الطبقات */}
              <div className="relative p-2 sm:p-3">
                {/* طبقة خارجية */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 rounded-3xl blur-sm"></div>
                {/* طبقة متوسطة */}
                <div className="absolute inset-1 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl"></div>
                {/* الصورة */}
                <img 
                  src="/aya-isra.png" 
                  alt="إِنَّ هَٰذَا ٱلْقُرْءَانَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ"
                  className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain"
                  style={{ 
                    filter: 'drop-shadow(0 8px 32px rgba(217, 167, 83, 0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                    imageRendering: 'crisp-edges'
                  }}
                />
              </div>
              {/* اسم السورة */}
              <div className="mt-4 sm:mt-5 flex items-center gap-3 sm:gap-4">
                <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400/60"></div>
                <p className="text-center text-sm sm:text-base text-amber-100 font-semibold tracking-wider drop-shadow-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  ﴿ سورة الإسراء - الآية ٩ ﴾
                </p>
                <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400/60"></div>
              </div>
            </div>
          </div>
        </div>

        {/* البطاقات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
          
          {/* بطاقة القرآن الكريم */}
          <div 
            onClick={onQuranClick}
            className="group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/40 to-amber-600/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative h-full bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-white overflow-hidden border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 shadow-xl shadow-black/20">
              {/* زخرفة */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-sm"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-400/20 to-transparent rounded-full translate-x-1/2 translate-y-1/2 blur-sm"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40 ring-2 ring-amber-300/30">
                    <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-900 drop-shadow" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-amber-50 drop-shadow">القرآن الكريم</h3>
                    <p className="text-amber-200/80 text-xs sm:text-sm">القرآن كاملاً مع التفسير</p>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/20 shadow-lg">
                    <span className="font-bold text-base sm:text-lg text-amber-300">114</span>
                    <span className="text-white/90 text-xs sm:text-sm mr-1">سورة</span>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/20 shadow-lg">
                    <span className="font-bold text-base sm:text-lg text-amber-300">6236</span>
                    <span className="text-white/90 text-xs sm:text-sm mr-1">آية</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* بطاقة آخر قراءة */}
          <div 
            onClick={onLastReadingClick}
            className="group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/40 to-amber-600/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative h-full bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-white overflow-hidden border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 shadow-xl shadow-black/20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-sm"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-400/20 to-transparent rounded-full translate-x-1/2 translate-y-1/2 blur-sm"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40 ring-2 ring-amber-300/30">
                    <BookMarked className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-900 drop-shadow" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-amber-50 drop-shadow">آخر قراءة</h3>
                    <p className="text-amber-200/80 text-xs sm:text-sm">
                      {lastReading ? `${lastReading.surahName} - آية ${lastReading.ayahNumber}` : 'استمر من حيث توقفت'}
                    </p>
                  </div>
                </div>
                {lastReading ? (
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-amber-400/25 text-amber-100 border border-amber-400/40 px-3 py-1 text-xs sm:text-sm shadow-lg">{lastReading.surahName}</Badge>
                    <Badge className="bg-amber-400/25 text-amber-100 border border-amber-400/40 px-3 py-1 text-xs sm:text-sm shadow-lg">آية {lastReading.ayahNumber}</Badge>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-white/15 text-white/90 border border-white/20 px-3 py-1 text-xs sm:text-sm shadow-lg">متابعة</Badge>
                    <Badge className="bg-white/15 text-white/90 border border-white/20 px-3 py-1 text-xs sm:text-sm shadow-lg">حفظ</Badge>
                    <Badge className="bg-white/15 text-white/90 border border-white/20 px-3 py-1 text-xs sm:text-sm shadow-lg">تلاوة</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* بطاقة أوقات الصلاة */}
          <div className="group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/40 to-amber-600/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative h-full bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-white overflow-hidden border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 shadow-xl shadow-black/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-full translate-x-1/2 -translate-y-1/2 blur-sm"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40 ring-2 ring-amber-300/30">
                      <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-900 drop-shadow" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-amber-50 drop-shadow">أوقات الصلاة</h3>
                      <div className="flex items-center gap-1.5 text-amber-200/80 text-xs sm:text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{prayerTimes?.city || 'صنعاء'}، اليمن</span>
                      </div>
                    </div>
                  </div>
                  {/* زر التحديث */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLoadingPrayers(true);
                      fetch('/api/prayer-times?city=sanaa')
                        .then(res => res.json())
                        .then(data => {
                          if (data.success && data.data) {
                            setPrayerTimes(data.data);
                            setHijriDate(data.data.date.hijri);
                          }
                        })
                        .finally(() => setLoadingPrayers(false));
                    }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 text-amber-200 ${loadingPrayers ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                
                {/* التاريخ الهجري */}
                {hijriDate && (
                  <div className="mb-3 text-center py-2 px-3 bg-amber-400/10 rounded-xl border border-amber-400/20">
                    <span className="text-amber-200 text-xs sm:text-sm font-medium">{hijriDate}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  {loadingPrayers ? (
                    // skeleton loading
                    [...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl px-3 sm:px-4 py-2 animate-pulse">
                        <div className="h-4 w-12 bg-white/20 rounded"></div>
                        <div className="h-4 w-16 bg-amber-400/30 rounded"></div>
                      </div>
                    ))
                  ) : prayerTimes?.prayers ? (
                    prayerTimes.prayers.map((prayer, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/10 shadow-lg">
                        <span className="text-white/90 text-xs sm:text-sm font-medium">{prayer.name}</span>
                        <span className="font-bold text-amber-300 text-sm sm:text-base drop-shadow">{prayer.timeFormatted}</span>
                      </div>
                    ))
                  ) : (
                    // بيانات افتراضية
                    [
                      { name: 'الفجر', time: '4:45 ص' },
                      { name: 'الظهر', time: '12:10 م' },
                      { name: 'العصر', time: '3:30 م' },
                      { name: 'المغرب', time: '6:10 م' },
                      { name: 'العشاء', time: '7:30 م' },
                    ].map((prayer, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/10 shadow-lg">
                        <span className="text-white/90 text-xs sm:text-sm font-medium">{prayer.name}</span>
                        <span className="font-bold text-amber-300 text-sm sm:text-base drop-shadow">{prayer.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* قسم الصحيفة السجادية */}
        <div 
          onClick={() => setCurrentView('duas')}
          className="group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.01]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-amber-500/40 to-amber-400/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="relative bg-gradient-to-l from-[#0c4a3a]/95 via-[#0d5442]/95 to-[#0c4a3a]/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-white overflow-hidden border border-amber-400/40 hover:border-amber-400/70 transition-all duration-300 shadow-2xl shadow-black/30">
            {/* نجوم متلألئة */}
            <div className="absolute top-4 right-8 w-2 h-2 bg-amber-300 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
            <div className="absolute top-10 right-16 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse shadow-lg shadow-amber-300/50" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-6 left-20 w-1.5 h-1.5 bg-amber-300/80 rounded-full animate-pulse shadow-lg shadow-amber-400/50" style={{ animationDelay: '1s' }}></div>
            
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-sm"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-400/20 to-transparent rounded-full translate-x-1/2 translate-y-1/2 blur-sm"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity scale-110"></div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/50 ring-2 ring-amber-300/40">
                    <BookMarked className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-900 drop-shadow-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-amber-50 drop-shadow-lg">
                    الصحيفة السجادية
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-pulse drop-shadow" />
                  </h3>
                  <p className="text-amber-200/80 text-sm sm:text-base">مجموعة الأدعية المباركة للإمام زين العابدين (ع)</p>
                </div>
              </div>
              <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300/70 group-hover:text-amber-200 group-hover:-translate-x-2 transition-all drop-shadow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuranPage() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    setCurrentSurah,
    setAyat,
    setSelectedAyah,
    showTafsir,
    tafsirPanelOpen,
    setTafsirPanelOpen,
    setSelectedWord,
    wordPanelOpen,
    currentView,
    setCurrentView,
    currentSurah,
    lastReading,
    setLastReading,
    setCurrentAyahIndex,
  } = useQuranStore();

  const handleSurahSelect = useCallback(
    async (surah: Surah) => {
      try {
        const response = await fetch(`/api/quran/surah/${surah.number}`);
        const data = await response.json();
        setCurrentSurah(data);
        setAyat(data.ayat);
        setSelectedAyah(data.ayat[0] || null);
        setTafsirPanelOpen(false);
        setSelectedWord(null);
        setCurrentView('quran');
      } catch (error) {
        console.error('Error loading surah:', error);
      }
    },
    [setCurrentSurah, setAyat, setSelectedAyah, setTafsirPanelOpen, setSelectedWord, setCurrentView]
  );

  const handleLastReadingClick = useCallback(
    async () => {
      if (!lastReading) {
        // إذا لم توجد قراءة سابقة، انتقل للقرآن
        setCurrentView('quran');
        return;
      }
      
      try {
        const response = await fetch(`/api/quran/surah/${lastReading.surahNumber}`);
        const data = await response.json();
        setCurrentSurah(data);
        setAyat(data.ayat);
        
        // البحث عن الآية المحددة
        const ayahIndex = data.ayat.findIndex((a: Ayah) => a.numberInSurah === lastReading.ayahNumber);
        if (ayahIndex !== -1) {
          setSelectedAyah(data.ayat[ayahIndex]);
          setCurrentAyahIndex(ayahIndex);
        } else {
          setSelectedAyah(data.ayat[0] || null);
        }
        
        setTafsirPanelOpen(false);
        setSelectedWord(null);
        setCurrentView('quran');
      } catch (error) {
        console.error('Error loading last reading:', error);
        setCurrentView('quran');
      }
    },
    [lastReading, setCurrentSurah, setAyat, setSelectedAyah, setTafsirPanelOpen, setSelectedWord, setCurrentView, setCurrentAyahIndex]
  );

  const handleAyahSelect = useCallback(
    (ayah: Ayah) => {
      setSelectedAyah(ayah);
      
      // حفظ آخر قراءة
      if (currentSurah) {
        setLastReading({
          surahNumber: currentSurah.number,
          surahName: currentSurah.nameAr,
          ayahNumber: ayah.numberInSurah,
          ayahId: ayah.id,
        });
      }
      
      if (showTafsir && !tafsirPanelOpen) {
        setTafsirPanelOpen(true);
      }
    },
    [setSelectedAyah, showTafsir, tafsirPanelOpen, setTafsirPanelOpen, currentSurah, setLastReading]
  );

  const handleTafsirToggle = useCallback(() => {
    setTafsirPanelOpen(!tafsirPanelOpen);
  }, [tafsirPanelOpen, setTafsirPanelOpen]);

  const handleWordSelect = useCallback(
    (word: SelectedWord) => {
      setSelectedWord(word);
    },
    [setSelectedWord]
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        {currentView === 'home' && (
          <>
            <Header onSettingsClick={() => setSettingsOpen(true)} />
            <div className="flex-1 flex overflow-hidden">
              <HomePage 
                onSurahSelect={handleSurahSelect} 
                onQuranClick={() => setCurrentView('quran')} 
                onLastReadingClick={handleLastReadingClick}
              />
            </div>
            <footer className="bg-gradient-to-l from-[#062a20] to-[#081f18] py-4 px-6 border-t border-amber-400/20">
              <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-amber-200/50">
                <span>صنع من قبل المهندس محمد عزالدين</span>
                <span className="hidden sm:inline text-amber-400/30">|</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-amber-300/70 font-medium">v1.0.1</span>
                </span>
              </div>
            </footer>
          </>
        )}

        {currentView === 'duas' && (
          <SahifaSajjadiya isOpen={true} onClose={() => setCurrentView('home')} />
        )}

        {currentView === 'quran' && (
          <>
            <Header onSettingsClick={() => setSettingsOpen(true)} />
            <div className="flex-1 flex overflow-hidden">
              <Sidebar onSurahSelect={handleSurahSelect} />
              <QuranReader
                onAyahSelect={handleAyahSelect}
                onTafsirToggle={handleTafsirToggle}
                onWordSelect={handleWordSelect}
              />
              {wordPanelOpen && (
                <WordAnalysisPanel isOpen={wordPanelOpen} onClose={() => setSelectedWord(null)} />
              )}
              {tafsirPanelOpen && (
                <TafsirPanel isOpen={tafsirPanelOpen} onClose={() => setTafsirPanelOpen(false)} />
              )}
            </div>
            <AudioPlayer />
            <footer className="bg-gradient-to-l from-[#062a20] to-[#081f18] py-4 px-6 border-t border-amber-400/20">
              <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-amber-200/50">
                <span>صنع من قبل المهندس محمد عزالدين</span>
                <span className="hidden sm:inline text-amber-400/30">|</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-amber-300/70 font-medium">v1.0.1</span>
                </span>
              </div>
            </footer>
          </>
        )}

        <SettingsDialog isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
