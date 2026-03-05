import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// أنواع البيانات
export interface Surah {
  id: number;
  number: number;
  nameAr: string;
  nameEn: string;
  revelation: string;
  ayahCount: number;
  startPage: number;
}

export interface Ayah {
  id: number;
  surahId: number;
  numberInSurah: number;
  numberGlobal: number;
  textUthmani: string;
  textSimple: string;
  page: number;
  juz: number;
  hizb: number;
  sajda: boolean;
}

export interface Tafsir {
  id: number;
  ayahId: number;
  sourceId: number;
  text: string;
  source?: TafsirSource;
}

export interface TafsirSource {
  id: number;
  nameAr: string;
  nameEn: string;
  authorAr: string;
}

export interface Reciter {
  id: number;
  nameAr: string;
  nameEn: string;
  style: string;
  country: string | null;
}

export interface Bookmark {
  id: string;
  ayahId: number;
  surahId: number;
  ayahNumber: number;
  color: string;
  label: string | null;
}

// ملاحظات الكلمات الهرمية
export interface WordNote {
  id: string;
  wordText: string;
  wordRoot: string | null;
  surahId: number;
  ayahNumber: number;
  wordPosition: number;
  content: string;
  parentId: string | null;
  order: number;
  children?: WordNote[];
}

// إحصائيات الكلمات
export interface WordStatistic {
  wordText: string;
  wordRoot: string | null;
  count: number;
  ayahs: { surahId: number; ayahNumber: number; surahName?: string }[];
}

// الكلمة المحددة
export interface SelectedWord {
  text: string;
  ayahId: number;
  surahId: number;
  ayahNumber: number;
  wordPosition: number;
}

// حالة التطبيق
interface QuranState {
  // العرض الحالي
  currentView: 'home' | 'quran' | 'duas' | 'admin';

  // البيانات
  surahs: Surah[];
  currentSurah: Surah | null;
  ayat: Ayah[];
  tafsirSources: TafsirSource[];
  reciters: Reciter[];

  // التصفح
  currentAyahIndex: number;
  selectedAyah: Ayah | null;

  // التفسير
  showTafsir: boolean;
  tafsirPanelOpen: boolean;
  currentTafsir: Tafsir[];
  selectedTafsirSource: number;

  // الكلمات
  selectedWord: SelectedWord | null;
  wordStatistics: WordStatistic | null;
  wordNotes: WordNote[];
  wordPanelOpen: boolean;

  // الصوت
  selectedReciter: number;
  isPlaying: boolean;
  repeatCount: number;
  autoPlay: boolean;

  // العرض
  fontSize: number;
  fontFamily: 'amiri' | 'noto' | 'uthman';

  // البحث
  searchQuery: string;
  searchResults: Ayah[];

  // العلامات
  bookmarks: Bookmark[];

  // آخر قراءة
  lastReading: {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    ayahId: number;
  } | null;

  // الإجراءات
  setSurahs: (surahs: Surah[]) => void;
  setCurrentSurah: (surah: Surah | null) => void;
  setAyat: (ayat: Ayah[]) => void;
  setTafsirSources: (sources: TafsirSource[]) => void;
  setReciters: (reciters: Reciter[]) => void;

  setCurrentAyahIndex: (index: number) => void;
  setSelectedAyah: (ayah: Ayah | null) => void;

  setShowTafsir: (show: boolean) => void;
  setTafsirPanelOpen: (open: boolean) => void;
  setCurrentTafsir: (tafsir: Tafsir[]) => void;
  setSelectedTafsirSource: (sourceId: number) => void;

  setSelectedWord: (word: SelectedWord | null) => void;
  setWordStatistics: (stats: WordStatistic | null) => void;
  setWordNotes: (notes: WordNote[]) => void;
  addWordNote: (note: WordNote) => void;
  setWordPanelOpen: (open: boolean) => void;

  setSelectedReciter: (reciterId: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setRepeatCount: (count: number) => void;
  setAutoPlay: (auto: boolean) => void;

  setFontSize: (size: number) => void;
  setFontFamily: (family: 'amiri' | 'noto' | 'uthman') => void;

  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Ayah[]) => void;

  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  setBookmarks: (bookmarks: Bookmark[]) => void;
  setLastReading: (reading: { surahNumber: number; surahName: string; ayahNumber: number; ayahId: number } | null) => void;

  // التنقل
  nextAyah: () => void;
  prevAyah: () => void;
  goToAyah: (index: number) => void;

  // تبديل العرض
  setCurrentView: (view: 'home' | 'quran' | 'duas') => void;
}

export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      // العرض الحالي
      currentView: 'home',

      // البيانات الافتراضية
      surahs: [],
      currentSurah: null,
      ayat: [],
      tafsirSources: [],
      reciters: [],

      currentAyahIndex: 0,
      selectedAyah: null,

      showTafsir: true,
      tafsirPanelOpen: false,
      currentTafsir: [],
      selectedTafsirSource: 1,

      selectedWord: null,
      wordStatistics: null,
      wordNotes: [],
      wordPanelOpen: false,

      selectedReciter: 1,
      isPlaying: false,
      repeatCount: 1,
      autoPlay: true,

      fontSize: 24,
      fontFamily: 'amiri',

      searchQuery: '',
      searchResults: [],

      bookmarks: [],
      lastReading: null,

      // الإجراءات
      setSurahs: (surahs) => set({ surahs }),
      setCurrentSurah: (surah) => set({ currentSurah: surah, currentAyahIndex: 0 }),
      setAyat: (ayat) => set({ ayat }),
      setTafsirSources: (sources) => set({ tafsirSources: sources }),
      setReciters: (reciters) => set({ reciters }),

      setCurrentAyahIndex: (index) => set({ currentAyahIndex: index }),
      setSelectedAyah: (ayah) => set({ selectedAyah: ayah }),

      setShowTafsir: (show) => set({ showTafsir: show }),
      setTafsirPanelOpen: (open) => set({ tafsirPanelOpen: open }),
      setCurrentTafsir: (tafsir) => set({ currentTafsir: tafsir }),
      setSelectedTafsirSource: (sourceId) => set({ selectedTafsirSource: sourceId }),

      setSelectedWord: (word) => set({ selectedWord: word, wordPanelOpen: !!word }),
      setWordStatistics: (stats) => set({ wordStatistics: stats }),
      setWordNotes: (notes) => set({ wordNotes: notes }),
      addWordNote: (note) => set((state) => ({
        wordNotes: [...state.wordNotes, note]
      })),
      setWordPanelOpen: (open) => set({ wordPanelOpen: open }),

      setSelectedReciter: (reciterId) => set({ selectedReciter: reciterId }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setRepeatCount: (count) => set({ repeatCount: count }),
      setAutoPlay: (auto) => set({ autoPlay: auto }),

      setFontSize: (size) => set({ fontSize: size }),
      setFontFamily: (family) => set({ fontFamily: family }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchResults: (results) => set({ searchResults: results }),

      addBookmark: (bookmark) => set((state) => ({
        bookmarks: [...state.bookmarks, bookmark]
      })),
      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== id)
      })),
      setBookmarks: (bookmarks) => set({ bookmarks }),
      setLastReading: (reading) => set({ lastReading: reading }),

      // التنقل
      nextAyah: () => {
        const { ayat, currentAyahIndex } = get();
        if (currentAyahIndex < ayat.length - 1) {
          set({ currentAyahIndex: currentAyahIndex + 1 });
        }
      },
      prevAyah: () => {
        const { currentAyahIndex } = get();
        if (currentAyahIndex > 0) {
          set({ currentAyahIndex: currentAyahIndex - 1 });
        }
      },
      goToAyah: (index) => set({ currentAyahIndex: index }),

      // تبديل العرض
      setCurrentView: (view: 'home' | 'quran' | 'duas' | 'admin') => set({ currentView: view }),
    }),
    {
      name: 'quran-storage',
      partialize: (state) => ({
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        selectedReciter: state.selectedReciter,
        selectedTafsirSource: state.selectedTafsirSource,
        showTafsir: state.showTafsir,
        autoPlay: state.autoPlay,
        repeatCount: state.repeatCount,
        bookmarks: state.bookmarks,
        lastReading: state.lastReading,
      }),
    }
  )
);
