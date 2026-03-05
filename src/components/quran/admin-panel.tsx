'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  Eye,
  BookMarked,
  Calendar,
  Activity,
  Settings,
  BarChart3,
  FileText,
  Headphones,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  totalSurahs: number;
  totalAyat: number;
  totalReciters: number;
  totalTafsirSources: number;
  totalViews: number;
  activeUsers: number;
  lastUpdated: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#0d4a3a] via-[#0a3d2e] to-[#072a21] overflow-auto">
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
              <span>الرئيسية</span>
            </Button>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40">
              <Settings className="h-6 w-6 text-emerald-900 drop-shadow" />
            </div>
            <div className="text-amber-50">
              <h1 className="text-xl font-bold tracking-wide drop-shadow">
                لوحة التحكم
              </h1>
              <p className="text-sm text-amber-200/80 font-medium">إدارة وإحصائيات التطبيق</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={fetchStats}
              className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl px-5 h-11 gap-2 font-medium"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              <span>تحديث</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total Surahs */}
          <Card className="bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 border-amber-400/30 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-100">السور</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-bold text-amber-50">{stats?.totalSurahs || 114}</div>
              )}
              <p className="text-xs text-amber-200/70 mt-1">سورة قرآنية</p>
            </CardContent>
          </Card>

          {/* Total Ayat */}
          <Card className="bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 border-amber-400/30 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-100">الآيات</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-bold text-amber-50">{stats?.totalAyat || 6236}</div>
              )}
              <p className="text-xs text-amber-200/70 mt-1">آية قرآنية</p>
            </CardContent>
          </Card>

          {/* Reciters */}
          <Card className="bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 border-amber-400/30 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-100">القراء</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center">
                <Headphones className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-bold text-amber-50">{stats?.totalReciters || 0}</div>
              )}
              <p className="text-xs text-amber-200/70 mt-1">قارئ متاح</p>
            </CardContent>
          </Card>

          {/* Tafsir Sources */}
          <Card className="bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 border-amber-400/30 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-100">التفاسير</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center">
                <BookMarked className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-bold text-amber-50">{stats?.totalTafsirSources || 0}</div>
              )}
              <p className="text-xs text-amber-200/70 mt-1">مصدر تفسير</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 border-amber-400/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-amber-50 flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-400" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl h-12 justify-start gap-2">
                <BookOpen className="h-5 w-5" />
                إدارة السور
              </Button>
              <Button className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl h-12 justify-start gap-2">
                <Headphones className="h-5 w-5" />
                إدارة القراء
              </Button>
              <Button className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl h-12 justify-start gap-2">
                <FileText className="h-5 w-5" />
                إدارة التفاسير
              </Button>
              <Button className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 rounded-xl h-12 justify-start gap-2">
                <Settings className="h-5 w-5" />
                الإعدادات
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 border-amber-400/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-amber-50 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-400" />
                معلومات النظام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <span className="text-amber-200/80">إصدار التطبيق</span>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">v1.1.0</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <span className="text-amber-200/80">قاعدة البيانات</span>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">SQLite</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <span className="text-amber-200/80">الإطار</span>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">Next.js 16</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <span className="text-amber-200/80">آخر تحديث</span>
                <span className="text-amber-300 text-sm">{stats?.lastUpdated || new Date().toLocaleDateString('ar-SA')}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Info */}
        <Card className="bg-gradient-to-br from-[#0f5d47]/95 to-[#0a4535]/95 border-amber-400/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-amber-50 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-400" />
              حول التطبيق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-10 h-10 text-emerald-900" />
              </div>
              <h3 className="text-xl font-bold text-amber-50 mb-2">المصحف الإلكتروني</h3>
              <p className="text-amber-200/70 max-w-md mx-auto">
                تطبيق ويب متكامل للقرآن الكريم مع التفسير والاستماع وأوقات الصلاة والصحيفة السجادية
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Badge className="bg-amber-400/20 text-amber-100 border-amber-400/40 px-4 py-2">
                  صنع من قبل المهندس محمد عزالدين
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
