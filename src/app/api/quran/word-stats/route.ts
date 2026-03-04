import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// إزالة التشكيل من الكلمة
function removeDiacritics(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

// تنظيف الكلمة
function cleanWord(word: string): string {
  return removeDiacritics(word.trim().replace(/[^\u0600-\u06FF]/g, ''));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word');

    if (!word) {
      return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
    }

    const cleanedWord = cleanWord(word);

    // البحث في جميع الآيات
    const ayahs = await db.ayah.findMany({
      include: {
        surah: {
          select: {
            nameAr: true,
          },
        },
      },
    });

    const matches: { surahId: number; ayahNumber: number; surahName: string }[] = [];

    for (const ayah of ayahs) {
      // تقسيم النص إلى كلمات
      const words = ayah.textSimple.split(/\s+/).map(cleanWord);
      const position = words.indexOf(cleanedWord);

      if (position !== -1) {
        matches.push({
          surahId: ayah.surahId,
          ayahNumber: ayah.numberInSurah,
          surahName: ayah.surah.nameAr,
        });
      }
    }

    // حساب عدد مرات ذكر الكلمة
    const count = matches.length;

    return NextResponse.json({
      wordText: word,
      wordRoot: null,
      count,
      ayahs: matches,
    });
  } catch (error) {
    console.error('Error fetching word stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
