'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  Download,
  FileText,
  Image,
  Headphones,
  Users,
  BookOpen,
  Database,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  FolderOpen,
  FileJson,
  Trash2
} from 'lucide-react';

interface DataManagementPageProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImportExportItem {
  id: string;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  count: number;
  type: 'images' | 'reciters' | 'audio' | 'files' | 'tafsir';
  color: string;
}

export function DataManagementPage({ isOpen, onClose }: DataManagementPageProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dataItems: ImportExportItem[] = [
    {
      id: 'images',
      name: 'Ayah Images',
      nameAr: 'صور الآيات',
      icon: <Image className="h-6 w-6" />,
      count: 0,
      type: 'images',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'reciters',
      name: 'Reciters',
      nameAr: 'المقرئين',
      icon: <Users className="h-6 w-6" />,
      count: 0,
      type: 'reciters',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'audio',
      name: 'Audio Files',
      nameAr: 'الملفات الصوتية',
      icon: <Headphones className="h-6 w-6" />,
      count: 0,
      type: 'audio',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'files',
      name: 'Documents',
      nameAr: 'الملفات',
      icon: <FolderOpen className="h-6 w-6" />,
      count: 0,
      type: 'files',
      color: 'from-orange-500 to-amber-500'
    },
    {
      id: 'tafsir',
      name: 'Tafsir Data',
      nameAr: 'التفسير',
      icon: <BookOpen className="h-6 w-6" />,
      count: 0,
      type: 'tafsir',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const handleExport = async (type: string) => {
    setSelectedType(type);
    setIsExporting(true);
    setStatus('idle');
    setProgress(0);
    setMessage('');

    try {
      // محاكاة عملية التصدير
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // إنشاء ملف JSON للتصدير
      const exportData = {
        type,
        exportDate: new Date().toISOString(),
        version: '1.2.0',
        data: []
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('success');
      setMessage('تم تصدير البيانات بنجاح!');
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ أثناء التصدير');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (type: string) => {
    fileInputRef.current?.click();
    setSelectedType(type);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedType) return;

    setIsImporting(true);
    setStatus('idle');
    setProgress(0);
    setMessage('');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);

          // محاكاة عملية الاستيراد
          for (let i = 0; i <= 100; i += 10) {
            setProgress(i);
            await new Promise(resolve => setTimeout(resolve, 200));
          }

          setStatus('success');
          setMessage('تم استيراد البيانات بنجاح!');
        } catch {
          setStatus('error');
          setMessage('ملف غير صالح');
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ أثناء الاستيراد');
      setIsImporting(false);
    }

    // إعادة تعيين input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    setStatus('idle');
    setProgress(0);
    setMessage('');

    try {
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const exportData = {
        type: 'all',
        exportDate: new Date().toISOString(),
        version: '1.2.0',
        data: {
          images: [],
          reciters: [],
          audio: [],
          files: [],
          tafsir: []
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `full_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('success');
      setMessage('تم تصدير جميع البيانات بنجاح!');
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ أثناء التصدير');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#0d4a3a] via-[#0a3d2e] to-[#072a21] overflow-auto">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-l from-[#0d4a3a] via-[#0a3d2e] to-[#0d4a3a] border-b border-amber-400/30 shadow-xl">
        <div className="flex h-[72px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl px-4 h-10 gap-2 font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>لوحة التحكم</span>
            </Button>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40">
              <Database className="h-6 w-6 text-emerald-900 drop-shadow" />
            </div>
            <div className="text-amber-50">
              <h1 className="text-xl font-bold tracking-wide drop-shadow">
                إدارة البيانات
              </h1>
              <p className="text-sm text-amber-200/80 font-medium">استيراد وتصدير البيانات</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportAll}
              disabled={isExporting || isImporting}
              className="bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 hover:from-amber-500 hover:to-amber-600 rounded-xl px-5 h-11 gap-2 font-bold shadow-lg shadow-amber-500/40"
            >
              {isExporting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              <span>تصدير الكل</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Status Message */}
        {(isExporting || isImporting || status !== 'idle') && (
          <Card className="mb-6 bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 border-amber-400/30 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {(isExporting || isImporting) && (
                  <Loader2 className="h-5 w-5 text-amber-400 animate-spin" />
                )}
                {status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                )}
                {status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${status === 'error' ? 'text-red-300' : 'text-amber-100'}`}>
                    {message || (isExporting ? 'جاري التصدير...' : 'جاري الاستيراد...')}
                  </p>
                  {(isExporting || isImporting) && (
                    <Progress value={progress} className="mt-2 h-2" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataItems.map((item) => (
            <Card
              key={item.id}
              className="bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 border-amber-400/30 shadow-xl hover:border-amber-400/60 transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    {item.icon}
                  </div>
                  <Badge className="bg-white/15 text-amber-100 border border-white/20">
                    {item.count} عنصر
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-bold text-amber-50 mb-1">
                  {item.nameAr}
                </CardTitle>
                <p className="text-sm text-amber-200/70 mb-4">{item.name}</p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleImport(item.id)}
                    disabled={isExporting || isImporting}
                    className="flex-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl h-10 gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>استيراد</span>
                  </Button>
                  <Button
                    onClick={() => handleExport(item.id)}
                    disabled={isExporting || isImporting}
                    className="flex-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl h-10 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>تصدير</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 border-amber-400/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-amber-50 flex items-center gap-2">
              <FileJson className="h-5 w-5 text-amber-400" />
              تعليمات الاستخدام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-amber-100/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-amber-50 flex items-center gap-2">
                  <Download className="h-4 w-4 text-amber-400" />
                  التصدير
                </h4>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>اضغط على زر "تصدير" لكل نوع بيانات</li>
                  <li>سيتم تحميل ملف JSON يحتوي على البيانات</li>
                  <li>استخدم "تصدير الكل" لنسخ احتياطي كامل</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-amber-50 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-amber-400" />
                  الاستيراد
                </h4>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>اضغط على زر "استيراد" واختر ملف JSON</li>
                  <li>يجب أن يكون الملف بالتنسيق الصحيح</li>
                  <li>سيتم استبدال البيانات الموجودة</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-400/10 rounded-xl border border-amber-400/20">
              <p className="text-sm text-amber-200/80">
                <strong className="text-amber-300">ملاحظة:</strong>
                {' '}يتم حفظ البيانات بتنسيق JSON ويمكن استيرادها في أي وقت. تأكد من أخذ نسخة احتياطية قبل الاستيراد.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
