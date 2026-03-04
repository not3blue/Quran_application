import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// تحديث ملاحظة
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const note = await db.wordNote.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error updating word note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// حذف ملاحظة
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.wordNote.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting word note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
