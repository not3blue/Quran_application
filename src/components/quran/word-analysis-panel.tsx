'use client';

import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQuranStore, type WordNote, type SelectedWord } from '@/store/quran-store';
import { cn } from '@/lib/utils';
import {
  X,
  Hash,
  BookOpen,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  Save,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WordAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WordAnalysisPanel({ isOpen, onClose }: WordAnalysisPanelProps) {
  const {
    selectedWord,
    wordStatistics,
    wordNotes,
    setSelectedWord,
    setWordStatistics,
    setWordNotes,
    currentSurah,
    ayat,
  } = useQuranStore();

  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [selectedAyahForWord, setSelectedAyahForWord] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const { toast } = useToast();

  // جلب إحصائيات الكلمة
  useEffect(() => {
    const fetchWordStats = async () => {
      if (!selectedWord) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/quran/word-stats?word=${encodeURIComponent(selectedWord.text)}`);
        const data = await response.json();
        setWordStatistics(data);
      } catch (error) {
        console.error('Error fetching word stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordStats();
  }, [selectedWord, setWordStatistics]);

  // جلب ملاحظات الكلمة
  useEffect(() => {
    const fetchWordNotes = async () => {
      if (!selectedWord) return;

      try {
        const response = await fetch(`/api/quran/word-notes?word=${encodeURIComponent(selectedWord.text)}`);
        const data = await response.json();
        setWordNotes(data);
      } catch (error) {
        console.error('Error fetching word notes:', error);
      }
    };

    fetchWordNotes();
  }, [selectedWord, setWordNotes]);

  // إضافة ملاحظة جديدة
  const handleAddNote = async () => {
    if (!selectedWord || !newNote.trim()) return;

    try {
      const response = await fetch('/api/quran/word-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordText: selectedWord.text,
          surahId: selectedWord.surahId,
          ayahNumber: selectedWord.ayahNumber,
          wordPosition: selectedWord.wordPosition,
          content: newNote.trim(),
        }),
      });

      const note = await response.json();
      setWordNotes([...wordNotes, note]);
      setNewNote('');
      toast({
        title: 'تمت الإضافة',
        description: 'تم إضافة الملاحظة بنجاح',
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة الملاحظة',
        variant: 'destructive',
      });
    }
  };

  // حذف ملاحظة
  const handleDeleteNote = async (noteId: string) => {
    try {
      await fetch(`/api/quran/word-notes/${noteId}`, { method: 'DELETE' });
      setWordNotes(wordNotes.filter((n) => n.id !== noteId));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الملاحظة بنجاح',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // تحديث ملاحظة
  const handleUpdateNote = async (noteId: string) => {
    if (!editingContent.trim()) return;

    try {
      const response = await fetch(`/api/quran/word-notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent }),
      });

      const updatedNote = await response.json();
      setWordNotes(wordNotes.map((n) => (n.id === noteId ? updatedNote : n)));
      setEditingNoteId(null);
      setEditingContent('');
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الملاحظة بنجاح',
      });
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        'w-96 border-r border-[var(--border)] bg-[var(--card)] flex flex-col transition-all duration-300 shadow-xl',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      dir="rtl"
    >
      {/* رأس اللوحة */}
      <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center shadow-md">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-bold text-lg text-[var(--foreground)]">تحليل الكلمة</h3>
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

      {/* الكلمة المحددة */}
      {selectedWord && (
        <div className="p-5 border-b border-[var(--border)] bg-gradient-to-r from-[var(--gold)]/5 via-transparent to-[var(--gold)]/5">
          <div className="text-center mb-4">
            <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--gold)]/10 border-2 border-[var(--gold)]/30 shadow-lg">
              <span className="quran-text text-4xl font-bold text-[var(--primary)]">
                {selectedWord.text}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
            <Badge variant="outline" className="rounded-xl border-[var(--primary)]/30">
              {currentSurah?.nameAr} - الآية {selectedWord.ayahNumber}
            </Badge>
          </div>
        </div>
      )}

      {/* المحتوى */}
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          {/* الإحصائيات */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : wordStatistics ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="h-5 w-5 text-[var(--gold)]" />
                <h4 className="font-bold text-[var(--foreground)]">إحصائيات الكلمة</h4>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--primary)]/5 to-[var(--gold)]/5 border border-[var(--border)]">
                <div className="text-center mb-4">
                  <span className="text-5xl font-black text-[var(--primary)]">
                    {wordStatistics.count}
                  </span>
                  <p className="text-sm text-[var(--muted)] mt-1">مرة في القرآن الكريم</p>
                </div>

                {wordStatistics.wordRoot && (
                  <div className="text-center py-3 border-t border-[var(--border)]">
                    <span className="text-sm text-[var(--muted)]">الجذر: </span>
                    <span className="font-bold text-[var(--foreground)]">{wordStatistics.wordRoot}</span>
                  </div>
                )}
              </div>

              {/* مواضع الكلمة */}
              {wordStatistics.ayahs.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-[var(--muted)] mb-3">مواضع الذكر:</h5>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {wordStatistics.ayahs.slice(0, 20).map((ayah, idx) => (
                      <button
                        key={`${ayah.surahId}-${ayah.ayahNumber}`}
                        onClick={() => setSelectedAyahForWord(`${ayah.surahId}-${ayah.ayahNumber}`)}
                        className={cn(
                          'w-full text-right px-3 py-2 rounded-lg text-sm transition-colors',
                          'hover:bg-[var(--primary)]/10',
                          selectedAyahForWord === `${ayah.surahId}-${ayah.ayahNumber}` &&
                            'bg-[var(--primary)]/10 text-[var(--primary)]'
                        )}
                      >
                        <span className="font-medium">{ayah.surahName}</span>
                        <span className="text-[var(--muted)]"> - الآية {ayah.ayahNumber}</span>
                      </button>
                    ))}
                    {wordStatistics.ayahs.length > 20 && (
                      <p className="text-xs text-center text-[var(--muted)] py-2">
                        و{wordStatistics.ayahs.length - 20} موضع آخر...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-[var(--muted)] mx-auto mb-3" />
              <p className="text-[var(--muted)]">اختر كلمة لعرض إحصائياتها</p>
            </div>
          )}

          {/* الملاحظات */}
          <div className="space-y-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[var(--foreground)]">الملاحظات</h4>
              <Badge variant="outline" className="rounded-full">
                {wordNotes.length}
              </Badge>
            </div>

            {/* إضافة ملاحظة جديدة */}
            <div className="space-y-3">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="أضف ملاحظة على هذه الكلمة..."
                className="min-h-[100px] rounded-xl border-[var(--border)] focus:border-[var(--primary)]"
              />
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="w-full gap-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-light)]"
              >
                <Plus className="h-4 w-4" />
                إضافة ملاحظة
              </Button>
            </div>

            {/* قائمة الملاحظات */}
            <div className="space-y-3">
              {wordNotes.length === 0 ? (
                <div className="text-center py-6 text-sm text-[var(--muted)]">
                  لا توجد ملاحظات بعد
                </div>
              ) : (
                wordNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-3"
                  >
                    {editingNoteId === note.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="min-h-[80px] rounded-xl"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateNote(note.id)}
                            className="flex-1 gap-1 rounded-lg"
                          >
                            <Save className="h-3 w-3" />
                            حفظ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditingContent('');
                            }}
                            className="rounded-lg"
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed text-[var(--foreground)]">
                          {note.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[var(--muted)]">
                            {new Date(note.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg hover:bg-[var(--primary)]/10"
                              onClick={() => {
                                setEditingNoteId(note.id);
                                setEditingContent(note.content);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg hover:bg-red-100 hover:text-red-600"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
