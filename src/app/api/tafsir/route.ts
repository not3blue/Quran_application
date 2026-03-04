import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const sources = await db.tafsirSource.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        authorAr: true,
        authorEn: true,
        description: true,
        isDefault: true,
      }
    });
    
    return NextResponse.json(sources);
  } catch (error) {
    console.error('Error fetching tafsir sources:', error);
    return NextResponse.json({ error: 'فشل في جلب مصادر التفسير' }, { status: 500 });
  }
}
