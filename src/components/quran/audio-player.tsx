'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuranStore, type Reciter } from '@/store/quran-store';
import { cn } from '@/lib/utils';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Music,
} from 'lucide-react';

export function AudioPlayer() {
  const {
    selectedAyah,
    currentSurah,
    reciters,
    setReciters,
    selectedReciter,
    setSelectedReciter,
    isPlaying,
    setIsPlaying,
    repeatCount,
    setRepeatCount,
    autoPlay,
    setAutoPlay,
    currentAyahIndex,
    ayat,
    nextAyah,
    prevAyah,
  } = useQuranStore();

  const [isExpanded, setIsExpanded] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const repeatCountRef = useRef(0);

  // حساب المدة المتوقعة
  const duration = useMemo(() => {
    if (!selectedAyah) return 0;
    return selectedAyah.textUthmani.length * 0.1;
  }, [selectedAyah]);

  // جلب القراء
  useEffect(() => {
    const fetchReciters = async () => {
      try {
        const response = await fetch('/api/reciters');
        const data = await response.json();
        setReciters(data);
        
        const defaultReciter = data.find((r: Reciter) => r.isDefault);
        if (defaultReciter) {
          setSelectedReciter(defaultReciter.id);
        }
      } catch (error) {
        console.error('Error fetching reciters:', error);
      }
    };

    if (reciters.length === 0) {
      fetchReciters();
    }
  }, [reciters.length, setReciters, setSelectedReciter]);

  // تنسيق الوقت
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // التحكم في التشغيل
  const togglePlay = useCallback(() => {
    if (!selectedAyah) return;
    setIsPlaying(!isPlaying);
  }, [selectedAyah, isPlaying, setIsPlaying]);

  // تغيير وضع التكرار
  const toggleRepeat = useCallback(() => {
    const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
    
    if (nextMode === 'one') {
      setRepeatCount(3);
    }
  }, [repeatMode, setRepeatCount]);

  if (!selectedAyah) return null;

  return (
    <AudioPlayerContent
      key={selectedAyah.id}
      selectedAyah={selectedAyah}
      currentSurah={currentSurah}
      reciters={reciters}
      selectedReciter={selectedReciter}
      setSelectedReciter={setSelectedReciter}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      repeatCount={repeatCount}
      autoPlay={autoPlay}
      setAutoPlay={setAutoPlay}
      currentAyahIndex={currentAyahIndex}
      ayat={ayat}
      nextAyah={nextAyah}
      prevAyah={prevAyah}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      volume={volume}
      setVolume={setVolume}
      isMuted={isMuted}
      setIsMuted={setIsMuted}
      repeatMode={repeatMode}
      toggleRepeat={toggleRepeat}
      togglePlay={togglePlay}
      formatTime={formatTime}
      duration={duration}
      audioRef={audioRef}
      repeatCountRef={repeatCountRef}
    />
  );
}

interface AudioPlayerContentProps {
  selectedAyah: NonNullable<ReturnType<typeof useQuranStore>['selectedAyah']>;
  currentSurah: ReturnType<typeof useQuranStore>['currentSurah'];
  reciters: ReturnType<typeof useQuranStore>['reciters'];
  selectedReciter: number;
  setSelectedReciter: (id: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  repeatCount: number;
  autoPlay: boolean;
  setAutoPlay: (auto: boolean) => void;
  currentAyahIndex: number;
  ayat: ReturnType<typeof useQuranStore>['ayat'];
  nextAyah: () => void;
  prevAyah: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  repeatMode: 'off' | 'one' | 'all';
  toggleRepeat: () => void;
  togglePlay: () => void;
  formatTime: (seconds: number) => string;
  duration: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  repeatCountRef: React.MutableRefObject<number>;
}

function AudioPlayerContent({
  selectedAyah,
  currentSurah,
  reciters,
  selectedReciter,
  setSelectedReciter,
  isPlaying,
  setIsPlaying,
  repeatCount,
  autoPlay,
  setAutoPlay,
  currentAyahIndex,
  ayat,
  nextAyah,
  prevAyah,
  isExpanded,
  setIsExpanded,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  repeatMode,
  toggleRepeat,
  togglePlay,
  formatTime,
  duration,
  audioRef,
  repeatCountRef,
}: AudioPlayerContentProps) {
  const [currentTime, setCurrentTime] = useState(0);

  // محاكاة تشغيل الصوت
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          if (repeatMode === 'one') {
            repeatCountRef.current += 1;
            if (repeatCountRef.current < repeatCount) {
              return 0;
            }
          }
          
          if (autoPlay && currentAyahIndex < ayat.length - 1) {
            nextAyah();
          } else {
            setIsPlaying(false);
          }
          repeatCountRef.current = 0;
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, duration, repeatMode, repeatCount, autoPlay, currentAyahIndex, ayat.length, nextAyah, setIsPlaying, repeatCountRef]);

  return (
    <div className={cn(
      "premium-player transition-all duration-300",
      isExpanded ? "py-4" : "py-2"
    )}>
      <audio ref={audioRef} />

      <div className="container mx-auto px-6">
        {/* الشريط العلوي */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6">
            {/* معلومات الآية */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center shadow-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-[var(--primary)]">
                  {currentSurah?.nameAr}
                </span>
                <span className="mx-2 text-[var(--muted)]">•</span>
                <span className="text-[var(--muted)] font-medium">
                  الآية {selectedAyah.numberInSurah}
                </span>
              </div>
            </div>

            {/* القارئ */}
            <Select
              value={selectedReciter.toString()}
              onValueChange={(value) => setSelectedReciter(parseInt(value))}
            >
              <SelectTrigger className="w-48 h-10 text-sm rounded-xl border-2 border-[var(--border)] bg-[var(--background)] font-medium">
                <SelectValue placeholder="اختر القارئ" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {reciters.map((reciter) => (
                  <SelectItem key={reciter.id} value={reciter.id.toString()} className="rounded-lg">
                    {reciter.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* زر الطي */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-xl w-10 h-10 hover:bg-[var(--background-secondary)]"
          >
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-[var(--muted)]" />
            ) : (
              <ChevronUp className="h-5 w-5 text-[var(--muted)]" />
            )}
          </Button>
        </div>

        {/* عناصر التحكم */}
        {isExpanded && (
          <>
            <div className="flex items-center gap-6">
              {/* أزرار التحكم */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="player-control-btn"
                  onClick={prevAyah}
                  disabled={currentAyahIndex === 0}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  className="player-play-btn"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white mr-[-2px]" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="player-control-btn"
                  onClick={nextAyah}
                  disabled={currentAyahIndex === ayat.length - 1}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* شريط التقدم */}
              <div className="flex-1 flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--muted)] w-12 text-right">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={([value]) => setCurrentTime(value)}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-[var(--muted)] w-12">
                  {formatTime(duration)}
                </span>
              </div>

              {/* التكرار */}
              <Button
                variant="ghost"
                className={cn(
                  "player-control-btn",
                  repeatMode !== 'off' && "bg-[var(--gold)] text-white border-[var(--gold)] hover:bg-[var(--gold-dark)]"
                )}
                onClick={toggleRepeat}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="h-5 w-5" />
                ) : (
                  <Repeat className="h-5 w-5" />
                )}
              </Button>

              {/* عدد التكرار */}
              {repeatMode === 'one' && (
                <Badge className="bg-[var(--gold)] text-white px-3 py-1 rounded-lg font-semibold">
                  ×{repeatCount}
                </Badge>
              )}

              {/* التشغيل التلقائي */}
              <Button
                variant="ghost"
                className={cn(
                  "player-control-btn",
                  autoPlay && "bg-[var(--primary)] text-white border-[var(--primary)] hover:bg-[var(--primary-dark)]"
                )}
                onClick={() => setAutoPlay(!autoPlay)}
                title="التشغيل التلقائي"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </Button>

              {/* مستوى الصوت */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="player-control-btn"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) => {
                    setVolume(value);
                    setIsMuted(value === 0);
                  }}
                  className="w-24"
                />
              </div>
            </div>

            {/* نص الآية */}
            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <p className="quran-text text-center text-[var(--muted)] truncate max-w-3xl mx-auto">
                {selectedAyah.textUthmani}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
