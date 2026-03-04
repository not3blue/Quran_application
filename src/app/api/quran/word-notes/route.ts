import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// جلب ملاحظات الكلمة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word');

    if (!word) {
      return NextResponse.json([]);
    }

    try {
      const notes = await db.wordNote.findMany({
        where: { wordText: word },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(notes);
    } catch (dbError) {
      // إذا كان الجدول غير موجود، أرجع مصفوفة فارغة
      console.log('WordNote table might not exist yet');
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching word notes:', error);
    return NextResponse.json([]);
  }
}

// إضافة ملاحظة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wordText, surahId, ayahNumber, wordPosition, content, parentId } = body;

    if (!wordText || !content) {
      return NextResponse.json({ error: 'Word and content are required' }, { status: 400 });
    }

    // الحصول على عدد الملاحظات الحالية لترتيبها
    const existingNotes = await db.wordNote.count({
      where: { wordText },
    });

    const note = await db.wordNote.create({
      data: {
        wordText,
        surahId: surahId || 0,
        ayahNumber: ayahNumber || 0,
        wordPosition: wordPosition || 0,
        content,
        parentId: parentId || null,
        order: existingNotes,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating word note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
