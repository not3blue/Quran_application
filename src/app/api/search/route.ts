import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// إزالة التشكيل والأحرف الخاصة من النص العربي
function normalizeForSearch(text: string): string {
  if (!text) return '';
  
  return text
    // إزالة التشكيل (حركات، سكن، شدة، تنوين، etc.)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // إزالة علامات الوقف والتجويد الخاصة
    .replace(/[\u06D6-\u06ED]/g, '')
    // إزالة الأحرف الخاصة مثل ۡ (Small High Rounded Zero) و ے
    .replace(/[\u06E0-\u06FF]/g, '')
    // توحيد الألف
    .replace(/[ٱإأآا]/g, 'ا')
    // توحيد الياء والألف المقصورة
    .replace(/[يى]/g, 'ي')
    // توحيد الواو
    .replace(/[ؤو]/g, 'و')
    // توحيد الهاء والتاء المربوطة
    .replace(/[ةه]/g, 'ه')
    // إزالة المسافات الزائدة
    .replace(/\s+/g, ' ')
    .trim();
}

// إنشاء نسخة بدون "ال" للبحث
function removeAlPrefix(text: string): string {
  if (text.startsWith('ال') && text.length > 2) {
    return text.substring(2);
  }
  return text;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('q');
    
    if (!query || query.trim().length < 1) {
      return NextResponse.json([]);
    }
    
    const searchTerm = query.trim();
    const normalizedSearch = normalizeForSearch(searchTerm);
    const withoutAl = removeAlPrefix(normalizedSearch);
    
    if (normalizedSearch.length < 1) {
      return NextResponse.json([]);
    }
    
    // جلب جميع الآيات والبحث فيها
    const allAyahs = await db.ayah.findMany({
      include: {
        surah: {
          select: {
            id: true,
            number: true,
            nameAr: true,
            nameEn: true,
          }
        }
      }
    });
    
    // فلترة النتائج
    const results = allAyahs.filter(ayah => {
      const normalizedText = normalizeForSearch(ayah.textUthmani);
      const normalizedSimple = normalizeForSearch(ayah.textSimple);
      
      // البحث بالنص الكامل أو بدون "ال"
      const matchesFull = normalizedText.includes(normalizedSearch) || 
                          normalizedSimple.includes(normalizedSearch);
      
      const matchesWithoutAl = withoutAl !== normalizedSearch && (
        normalizedText.includes(withoutAl) || 
        normalizedSimple.includes(withoutAl) ||
        normalizedText.includes('ال' + withoutAl) ||
        normalizedSimple.includes('ال' + withoutAl)
      );
      
      return matchesFull || matchesWithoutAl;
    }).slice(0, 50);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'فشل في البحث' }, { status: 500 });
  }
}
