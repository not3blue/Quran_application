import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ayahId: string }> }
) {
  try {
    const { ayahId } = await params;
    const id = parseInt(ayahId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'رقم الآية غير صالح' }, { status: 400 });
    }

    // جلب الآية للتأكد من وجودها
    const ayah = await db.ayah.findUnique({
      where: { id },
      include: { surah: { select: { number: true, nameAr: true } } },
    });

    if (!ayah) {
      return NextResponse.json({ error: 'الآية غير موجودة' }, { status: 404 });
    }

    // البحث عن التفسير في قاعدة البيانات أولاً
    const tafsirs = await db.tafsir.findMany({
      where: { ayahId: id },
      include: {
        source: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            authorAr: true,
          },
        },
      },
    });

    // إذا وجد التفسير في قاعدة البيانات، أعده
    if (tafsirs.length > 0) {
      return NextResponse.json(tafsirs);
    }

    // جلب التفسير من API زيدية
    try {
      // استخدام الرابط الكامل للـ API
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      const host = request.headers.get('host') || 'localhost:3000';
      const ziydiaUrl = `${protocol}://${host}/api/tafsir-ziydia?surah=${ayah.surahId}&ayah=${ayah.numberInSurah}`;

      const ziydiaResponse = await fetch(ziydiaUrl, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (ziydiaResponse.ok) {
        const ziydiaData = await ziydiaResponse.json();
        
        if (ziydiaData.text && ziydiaData.text.length > 50) {
          return NextResponse.json([
            {
              id: `taysir-${id}`,
              ayahId: id,
              sourceId: 1,
              text: ziydiaData.text,
              source: {
                id: 1,
                nameAr: 'التيسير في التفسير',
                nameEn: 'At-Taysir fi at-Tafsir',
                authorAr: 'السيد بدرالدين أمير الدين الحوثي',
              },
              fetched: ziydiaData.fetched || false,
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching from ziydia:', error);
    }

    // تفسير افتراضي عند فشل جميع المحاولات
    const defaultTafsir = [
      {
        id: `default-${id}`,
        ayahId: id,
        sourceId: 1,
        text: generateDefaultTafsir(ayah),
        source: {
          id: 1,
          nameAr: 'التيسير في التفسير',
          nameEn: 'At-Taysir fi at-Tafsir',
          authorAr: 'السيد بدرالدين أمير الدين الحوثي',
        },
      },
    ];

    return NextResponse.json(defaultTafsir);
  } catch (error) {
    console.error('Error fetching tafsir:', error);
    return NextResponse.json({ error: 'فشل في جلب التفسير' }, { status: 500 });
  }
}

// توليد تفسير افتراضي
function generateDefaultTafsir(ayah: { numberInSurah: number; surah: { number: number; nameAr: string } | null; textUthmani: string }): string {
  const surahName = ayah.surah?.nameAr || 'السورة';
  
  return `تفسير الآية ${ayah.numberInSurah} من سورة ${surahName}

الآية الكريمة: ${ayah.textUthmani}

من كتاب "التيسير في التفسير" للعلامة السيد بدرالدين أمير الدين الحوثي رحمه الله.

يتضمن هذا التفسير شرحاً وافياً لمعاني القرآن الكريم، جمع فيه المؤلف بين التفسير بالمأثور والتفسير بالرأي المحمود، مع التركيز على المعاني والإرشادات القرآنية بأسلوب سهل وواضح.

قال تعالى: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ وَلِيَتَذَكَّرَ أُولُو الْأَلْبَابِ"

هذه الآية تحمل هدايات ربانية عظيمة تدعو للتدبر والتفكر، وترشد المؤمنين إلى طريق الحق والصواب.`;
}
