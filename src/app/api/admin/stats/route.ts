import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // جلب الإحصائيات من قاعدة البيانات
    const totalSurahs = await db.surah.count();
    const totalAyat = await db.ayah.count();
    const totalReciters = await db.reciter.count();
    const totalTafsirSources = await db.tafsirSource.count();

    const stats = {
      totalSurahs,
      totalAyat,
      totalReciters,
      totalTafsirSources,
      totalViews: 0, // يمكن إضافته لاحقاً
      activeUsers: 0, // يمكن إضافته لاحقاً
      lastUpdated: new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);

    // إرجاع بيانات افتراضية في حالة الخطأ
    return NextResponse.json({
      totalSurahs: 114,
      totalAyat: 6236,
      totalReciters: 0,
      totalTafsirSources: 0,
      totalViews: 0,
      activeUsers: 0,
      lastUpdated: new Date().toLocaleDateString('ar-SA')
    });
  }
}
