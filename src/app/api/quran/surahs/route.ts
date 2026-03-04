import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const surahs = await db.surah.findMany({
      orderBy: { number: 'asc' },
      select: {
        id: true,
        number: true,
        nameAr: true,
        nameEn: true,
        revelation: true,
        ayahCount: true,
        startPage: true,
      }
    });
    
    return NextResponse.json(surahs);
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return NextResponse.json({ error: 'فشل في جلب السور' }, { status: 500 });
  }
}
