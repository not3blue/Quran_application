import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reciters = await db.reciter.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        bio: true,
        style: true,
        country: true,
        isDefault: true,
      }
    });
    
    return NextResponse.json(reciters);
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return NextResponse.json({ error: 'فشل في جلب القراء' }, { status: 500 });
  }
}
