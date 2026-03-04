import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const surahNumber = parseInt(id);

    if (isNaN(surahNumber)) {
      return NextResponse.json({ error: 'رقم السورة غير صالح' }, { status: 400 });
    }

    // البحث عن السورة برقمها وليس بمعرفها
    const surah = await db.surah.findFirst({
      where: { number: surahNumber },
      include: {
        ayat: {
          orderBy: { numberInSurah: 'asc' },
        },
      },
    });

    if (!surah) {
      return NextResponse.json({ error: 'السورة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json(surah);
  } catch (error) {
    console.error('Error fetching surah:', error);
    return NextResponse.json({ error: 'فشل في جلب السورة' }, { status: 500 });
  }
}
