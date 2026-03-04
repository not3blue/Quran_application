'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuranStore } from '@/store/quran-store';
import { cn } from '@/lib/utils';
import { Type, Volume2, BookOpen, Palette, Sparkles, Check } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const {
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    autoPlay,
    setAutoPlay,
    repeatCount,
    setRepeatCount,
    showTafsir,
    setShowTafsir,
    selectedReciter,
    setSelectedReciter,
    selectedTafsirSource,
    setSelectedTafsirSource,
    reciters,
    tafsirSources,
  } = useQuranStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-[var(--border)]">
          <DialogTitle className="text-right text-2xl font-bold text-[var(--primary)] flex items-center justify-end gap-2">
            <Sparkles className="h-6 w-6 text-[var(--gold)]" />
            الإعدادات
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* إعدادات الخط */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <Type className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <h3 className="font-bold text-[var(--foreground)]">إعدادات الخط</h3>
            </div>

            {/* حجم الخط */}
            <div className="space-y-3 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">حجم الخط</Label>
                <Badge variant="outline" className="px-3 py-1 rounded-lg bg-[var(--gold)]/10 text-[var(--gold-dark)] font-semibold">
                  {fontSize}px
                </Badge>
              </div>
              <Slider
                value={[fontSize]}
                min={16}
                max={40}
                step={2}
                onValueChange={([value]) => setFontSize(value)}
                className="py-2"
              />
            </div>

            {/* نوع الخط */}
            <div className="space-y-2">
              <Label className="font-semibold">نوع الخط</Label>
              <Select
                value={fontFamily}
                onValueChange={(value: 'amiri' | 'noto' | 'uthman') => setFontFamily(value)}
              >
                <SelectTrigger className="h-12 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="amiri" className="rounded-lg">خط أميري</SelectItem>
                  <SelectItem value="noto" className="rounded-lg">خط نوتو نسخ</SelectItem>
                  <SelectItem value="uthman" className="rounded-lg">خط عثمان طه</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* معاينة */}
            <div className="p-5 rounded-xl bg-gradient-to-l from-[var(--gold)]/5 via-transparent to-[var(--gold)]/5 border-2 border-[var(--gold)]/30">
              <p className="text-xs text-[var(--muted)] mb-2 font-medium">معاينة:</p>
              <p
                className={cn("quran-text text-right", `font-${fontFamily}`)}
                style={{ fontSize: `${fontSize}px` }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          </div>

          {/* إعدادات التفسير */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-[var(--gold-dark)]" />
              </div>
              <h3 className="font-bold text-[var(--foreground)]">إعدادات التفسير</h3>
            </div>

            {/* إظهار التفسير */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <Label className="font-semibold">إظهار لوحة التفسير</Label>
              <Switch
                checked={showTafsir}
                onCheckedChange={setShowTafsir}
              />
            </div>

            {/* التفسير الافتراضي */}
            {tafsirSources.length > 0 && (
              <div className="space-y-2">
                <Label className="font-semibold">التفسير الافتراضي</Label>
                <Select
                  value={selectedTafsirSource.toString()}
                  onValueChange={(value) => setSelectedTafsirSource(parseInt(value))}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {tafsirSources.map((source) => (
                      <SelectItem key={source.id} value={source.id.toString()} className="rounded-lg">
                        {source.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* إعدادات الصوت */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--burgundy)]/10 flex items-center justify-center">
                <Volume2 className="h-4 w-4 text-[var(--burgundy)]" />
              </div>
              <h3 className="font-bold text-[var(--foreground)]">إعدادات الصوت</h3>
            </div>

            {/* التشغيل التلقائي */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <Label className="font-semibold">التشغيل التلقائي للآية التالية</Label>
              <Switch
                checked={autoPlay}
                onCheckedChange={setAutoPlay}
              />
            </div>

            {/* عدد التكرار */}
            <div className="space-y-3 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">عدد مرات التكرار</Label>
                <Badge variant="outline" className="px-3 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] font-semibold">
                  {repeatCount} مرات
                </Badge>
              </div>
              <Slider
                value={[repeatCount]}
                min={1}
                max={10}
                step={1}
                onValueChange={([value]) => setRepeatCount(value)}
                className="py-2"
              />
            </div>

            {/* القارئ الافتراضي */}
            {reciters.length > 0 && (
              <div className="space-y-2">
                <Label className="font-semibold">القارئ الافتراضي</Label>
                <Select
                  value={selectedReciter.toString()}
                  onValueChange={(value) => setSelectedReciter(parseInt(value))}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] font-semibold">
                    <SelectValue />
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
            )}
          </div>

          {/* زر الإغلاق */}
          <div className="flex justify-end pt-4 border-t border-[var(--border)]">
            <Button 
              onClick={onClose}
              className="btn-premium px-8 py-3 rounded-xl text-base"
            >
              <Check className="h-5 w-5 ml-2" />
              تم
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
