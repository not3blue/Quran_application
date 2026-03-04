import { NextResponse } from 'next/server';

interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
    date: {
      readable: string;
      hijri: {
        date: string;
        month: { ar: string };
        year: string;
      };
    };
    meta: {
      method: { name: string };
      latitude: number;
      longitude: number;
    };
  };
}

// إعدادات المدن اليمنية
const CITIES: Record<string, { lat: number; lng: number; name: string; nameAr: string }> = {
  sanaa: { lat: 15.3694, lng: 44.1910, name: 'Sanaa', nameAr: 'صنعاء' },
  aden: { lat: 12.7794, lng: 45.0367, name: 'Aden', nameAr: 'عدن' },
  taiz: { lat: 13.5789, lng: 44.0219, name: 'Taiz', nameAr: 'تعز' },
  hudaydah: { lat: 14.7978, lng: 42.9545, name: 'Al Hudaydah', nameAr: 'الحديدة' },
  ibb: { lat: 13.9720, lng: 44.1744, name: 'Ibb', nameAr: 'إب' },
  dhamar: { lat: 14.5428, lng: 44.4057, name: 'Dhamar', nameAr: 'ذمار' },
  marib: { lat: 15.4625, lng: 45.3255, name: 'Marib', nameAr: 'مارب' },
  sadah: { lat: 16.9402, lng: 43.7638, name: 'Sadah', nameAr: 'صعدة' },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'sanaa';
  
  const cityData = CITIES[city] || CITIES.sanaa;
  
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  
  try {
    // استخدام Aladhan API (مجاني)
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${cityData.lat}&longitude=${cityData.lng}&method=5`,
      { next: { revalidate: 3600 } } // تحديث كل ساعة
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }
    
    const data: PrayerTimesResponse = await response.json();
    
    if (data.code !== 200) {
      throw new Error('Invalid response from prayer times API');
    }
    
    const timings = data.data.timings;
    
    // تنسيق الوقت (إزالة الثواني)
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const minute = minutes;
      const period = hour >= 12 ? 'م' : 'ص';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minute} ${period}`;
    };
    
    const prayers = [
      { key: 'fajr', name: 'الفجر', time: timings.Fajr },
      { key: 'dhuhr', name: 'الظهر', time: timings.Dhuhr },
      { key: 'asr', name: 'العصر', time: timings.Asr },
      { key: 'maghrib', name: 'المغرب', time: timings.Maghrib },
      { key: 'isha', name: 'العشاء', time: timings.Isha },
    ];
    
    return NextResponse.json({
      success: true,
      data: {
        city: cityData.nameAr,
        date: {
          gregorian: data.data.date.readable,
          hijri: `${data.data.date.hijri.date} ${data.data.date.hijri.month.ar} ${data.data.date.hijri.year}`,
        },
        prayers: prayers.map(p => ({
          ...p,
          timeFormatted: formatTime(p.time),
        })),
        sunrise: formatTime(timings.Sunrise),
        method: 'أم القرى',
      },
    });
    
  } catch (error) {
    console.error('Prayer times error:', error);
    
    // إرجاع أوقات افتراضية في حالة الخطأ
    return NextResponse.json({
      success: false,
      error: 'Unable to fetch prayer times',
      data: {
        city: cityData.nameAr,
        prayers: [
          { key: 'fajr', name: 'الفجر', time: '04:45', timeFormatted: '4:45 ص' },
          { key: 'dhuhr', name: 'الظهر', time: '12:10', timeFormatted: '12:10 م' },
          { key: 'asr', name: 'العصر', time: '15:30', timeFormatted: '3:30 م' },
          { key: 'maghrib', name: 'المغرب', time: '18:10', timeFormatted: '6:10 م' },
          { key: 'isha', name: 'العشاء', time: '19:30', timeFormatted: '7:30 م' },
        ],
      },
    });
  }
}

// تصدير المدن المتاحة
export { CITIES };
