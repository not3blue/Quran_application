import { PrismaClient } from '@prisma/client';
import ZAI from 'z-ai-web-dev-sdk';

const prisma = new PrismaClient();

// بيانات السور
const surahsData = [
  { number: 1, nameAr: "الفاتحة", nameEn: "Al-Fatiha", revelation: "مكية", ayahCount: 7, startPage: 1, orderRevelation: 5 },
  { number: 2, nameAr: "البقرة", nameEn: "Al-Baqara", revelation: "مدنية", ayahCount: 286, startPage: 2, orderRevelation: 87 },
  { number: 3, nameAr: "آل عمران", nameEn: "Aal-Imran", revelation: "مدنية", ayahCount: 200, startPage: 50, orderRevelation: 89 },
  { number: 4, nameAr: "النساء", nameEn: "An-Nisa", revelation: "مدنية", ayahCount: 176, startPage: 77, orderRevelation: 92 },
  { number: 5, nameAr: "المائدة", nameEn: "Al-Ma'ida", revelation: "مدنية", ayahCount: 120, startPage: 106, orderRevelation: 112 },
  { number: 6, nameAr: "الأنعام", nameEn: "Al-An'am", revelation: "مكية", ayahCount: 165, startPage: 128, orderRevelation: 55 },
  { number: 7, nameAr: "الأعراف", nameEn: "Al-A'raf", revelation: "مكية", ayahCount: 206, startPage: 151, orderRevelation: 39 },
  { number: 8, nameAr: "الأنفال", nameEn: "Al-Anfal", revelation: "مدنية", ayahCount: 75, startPage: 177, orderRevelation: 88 },
  { number: 9, nameAr: "التوبة", nameEn: "At-Tawba", revelation: "مدنية", ayahCount: 129, startPage: 187, orderRevelation: 113 },
  { number: 10, nameAr: "يونس", nameEn: "Yunus", revelation: "مكية", ayahCount: 109, startPage: 208, orderRevelation: 51 },
  { number: 11, nameAr: "هود", nameEn: "Hud", revelation: "مكية", ayahCount: 123, startPage: 221, orderRevelation: 52 },
  { number: 12, nameAr: "يوسف", nameEn: "Yusuf", revelation: "مكية", ayahCount: 111, startPage: 235, orderRevelation: 53 },
  { number: 13, nameAr: "الرعد", nameEn: "Ar-Ra'd", revelation: "مدنية", ayahCount: 43, startPage: 249, orderRevelation: 96 },
  { number: 14, nameAr: "إبراهيم", nameEn: "Ibrahim", revelation: "مكية", ayahCount: 52, startPage: 255, orderRevelation: 72 },
  { number: 15, nameAr: "الحجر", nameEn: "Al-Hijr", revelation: "مكية", ayahCount: 99, startPage: 262, orderRevelation: 54 },
  { number: 16, nameAr: "النحل", nameEn: "An-Nahl", revelation: "مكية", ayahCount: 128, startPage: 267, orderRevelation: 70 },
  { number: 17, nameAr: "الإسراء", nameEn: "Al-Isra", revelation: "مكية", ayahCount: 111, startPage: 282, orderRevelation: 50 },
  { number: 18, nameAr: "الكهف", nameEn: "Al-Kahf", revelation: "مكية", ayahCount: 110, startPage: 293, orderRevelation: 69 },
  { number: 19, nameAr: "مريم", nameEn: "Maryam", revelation: "مكية", ayahCount: 98, startPage: 305, orderRevelation: 44 },
  { number: 20, nameAr: "طه", nameEn: "Ta-Ha", revelation: "مكية", ayahCount: 135, startPage: 312, orderRevelation: 45 },
  { number: 21, nameAr: "الأنبياء", nameEn: "Al-Anbiya", revelation: "مكية", ayahCount: 112, startPage: 322, orderRevelation: 73 },
  { number: 22, nameAr: "الحج", nameEn: "Al-Hajj", revelation: "مدنية", ayahCount: 78, startPage: 332, orderRevelation: 103 },
  { number: 23, nameAr: "المؤمنون", nameEn: "Al-Mu'minun", revelation: "مكية", ayahCount: 118, startPage: 342, orderRevelation: 74 },
  { number: 24, nameAr: "النور", nameEn: "An-Nur", revelation: "مدنية", ayahCount: 64, startPage: 350, orderRevelation: 102 },
  { number: 25, nameAr: "الفرقان", nameEn: "Al-Furqan", revelation: "مكية", ayahCount: 77, startPage: 359, orderRevelation: 42 },
  { number: 26, nameAr: "الشعراء", nameEn: "Ash-Shu'ara", revelation: "مكية", ayahCount: 227, startPage: 367, orderRevelation: 47 },
  { number: 27, nameAr: "النمل", nameEn: "An-Naml", revelation: "مكية", ayahCount: 93, startPage: 377, orderRevelation: 48 },
  { number: 28, nameAr: "القصص", nameEn: "Al-Qasas", revelation: "مكية", ayahCount: 88, startPage: 385, orderRevelation: 49 },
  { number: 29, nameAr: "العنكبوت", nameEn: "Al-Ankabut", revelation: "مكية", ayahCount: 69, startPage: 393, orderRevelation: 85 },
  { number: 30, nameAr: "الروم", nameEn: "Ar-Rum", revelation: "مكية", ayahCount: 60, startPage: 404, orderRevelation: 84 },
  { number: 31, nameAr: "لقمان", nameEn: "Luqman", revelation: "مكية", ayahCount: 34, startPage: 411, orderRevelation: 57 },
  { number: 32, nameAr: "السجدة", nameEn: "As-Sajda", revelation: "مكية", ayahCount: 30, startPage: 415, orderRevelation: 75 },
  { number: 33, nameAr: "الأحزاب", nameEn: "Al-Ahzab", revelation: "مدنية", ayahCount: 73, startPage: 418, orderRevelation: 90 },
  { number: 34, nameAr: "سبأ", nameEn: "Saba", revelation: "مكية", ayahCount: 54, startPage: 428, orderRevelation: 58 },
  { number: 35, nameAr: "فاطر", nameEn: "Fatir", revelation: "مكية", ayahCount: 45, startPage: 434, orderRevelation: 43 },
  { number: 36, nameAr: "يس", nameEn: "Ya-Sin", revelation: "مكية", ayahCount: 83, startPage: 440, orderRevelation: 41 },
  { number: 37, nameAr: "الصافات", nameEn: "As-Saffat", revelation: "مكية", ayahCount: 182, startPage: 446, orderRevelation: 56 },
  { number: 38, nameAr: "ص", nameEn: "Sad", revelation: "مكية", ayahCount: 88, startPage: 453, orderRevelation: 38 },
  { number: 39, nameAr: "الزمر", nameEn: "Az-Zumar", revelation: "مكية", ayahCount: 75, startPage: 458, orderRevelation: 59 },
  { number: 40, nameAr: "غافر", nameEn: "Ghafir", revelation: "مكية", ayahCount: 85, startPage: 467, orderRevelation: 60 },
  { number: 41, nameAr: "فصلت", nameEn: "Fussilat", revelation: "مكية", ayahCount: 54, startPage: 477, orderRevelation: 61 },
  { number: 42, nameAr: "الشورى", nameEn: "Ash-Shura", revelation: "مكية", ayahCount: 53, startPage: 483, orderRevelation: 62 },
  { number: 43, nameAr: "الزخرف", nameEn: "Az-Zukhruf", revelation: "مكية", ayahCount: 89, startPage: 489, orderRevelation: 63 },
  { number: 44, nameAr: "الدخان", nameEn: "Ad-Dukhan", revelation: "مكية", ayahCount: 59, startPage: 496, orderRevelation: 64 },
  { number: 45, nameAr: "الجاثية", nameEn: "Al-Jathiya", revelation: "مكية", ayahCount: 37, startPage: 499, orderRevelation: 65 },
  { number: 46, nameAr: "الأحقاف", nameEn: "Al-Ahqaf", revelation: "مكية", ayahCount: 35, startPage: 502, orderRevelation: 66 },
  { number: 47, nameAr: "محمد", nameEn: "Muhammad", revelation: "مدنية", ayahCount: 38, startPage: 507, orderRevelation: 95 },
  { number: 48, nameAr: "الفتح", nameEn: "Al-Fath", revelation: "مدنية", ayahCount: 29, startPage: 511, orderRevelation: 111 },
  { number: 49, nameAr: "الحجرات", nameEn: "Al-Hujurat", revelation: "مدنية", ayahCount: 18, startPage: 515, orderRevelation: 106 },
  { number: 50, nameAr: "ق", nameEn: "Qaf", revelation: "مكية", ayahCount: 45, startPage: 518, orderRevelation: 34 },
  { number: 51, nameAr: "الذاريات", nameEn: "Adh-Dhariyat", revelation: "مكية", ayahCount: 60, startPage: 520, orderRevelation: 67 },
  { number: 52, nameAr: "الطور", nameEn: "At-Tur", revelation: "مكية", ayahCount: 49, startPage: 523, orderRevelation: 76 },
  { number: 53, nameAr: "النجم", nameEn: "An-Najm", revelation: "مكية", ayahCount: 62, startPage: 526, orderRevelation: 23 },
  { number: 54, nameAr: "القمر", nameEn: "Al-Qamar", revelation: "مكية", ayahCount: 55, startPage: 528, orderRevelation: 37 },
  { number: 55, nameAr: "الرحمن", nameEn: "Ar-Rahman", revelation: "مدنية", ayahCount: 78, startPage: 531, orderRevelation: 97 },
  { number: 56, nameAr: "الواقعة", nameEn: "Al-Waqi'a", revelation: "مكية", ayahCount: 96, startPage: 534, orderRevelation: 46 },
  { number: 57, nameAr: "الحديد", nameEn: "Al-Hadid", revelation: "مدنية", ayahCount: 29, startPage: 537, orderRevelation: 94 },
  { number: 58, nameAr: "المجادلة", nameEn: "Al-Mujadila", revelation: "مدنية", ayahCount: 22, startPage: 542, orderRevelation: 105 },
  { number: 59, nameAr: "الحشر", nameEn: "Al-Hashr", revelation: "مدنية", ayahCount: 24, startPage: 545, orderRevelation: 101 },
  { number: 60, nameAr: "الممتحنة", nameEn: "Al-Mumtahina", revelation: "مدنية", ayahCount: 13, startPage: 549, orderRevelation: 91 },
  { number: 61, nameAr: "الصف", nameEn: "As-Saff", revelation: "مدنية", ayahCount: 14, startPage: 551, orderRevelation: 109 },
  { number: 62, nameAr: "الجمعة", nameEn: "Al-Jumu'a", revelation: "مدنية", ayahCount: 11, startPage: 553, orderRevelation: 110 },
  { number: 63, nameAr: "المنافقون", nameEn: "Al-Munafiqun", revelation: "مدنية", ayahCount: 11, startPage: 554, orderRevelation: 104 },
  { number: 64, nameAr: "التغابن", nameEn: "At-Taghabun", revelation: "مدنية", ayahCount: 18, startPage: 556, orderRevelation: 108 },
  { number: 65, nameAr: "الطلاق", nameEn: "At-Talaq", revelation: "مدنية", ayahCount: 12, startPage: 558, orderRevelation: 99 },
  { number: 66, nameAr: "التحريم", nameEn: "At-Tahrim", revelation: "مدنية", ayahCount: 12, startPage: 560, orderRevelation: 107 },
  { number: 67, nameAr: "الملك", nameEn: "Al-Mulk", revelation: "مكية", ayahCount: 30, startPage: 562, orderRevelation: 77 },
  { number: 68, nameAr: "القلم", nameEn: "Al-Qalam", revelation: "مكية", ayahCount: 52, startPage: 564, orderRevelation: 2 },
  { number: 69, nameAr: "الحاقة", nameEn: "Al-Haqqa", revelation: "مكية", ayahCount: 52, startPage: 566, orderRevelation: 78 },
  { number: 70, nameAr: "المعارج", nameEn: "Al-Ma'arij", revelation: "مكية", ayahCount: 44, startPage: 568, orderRevelation: 79 },
  { number: 71, nameAr: "نوح", nameEn: "Nuh", revelation: "مكية", ayahCount: 28, startPage: 570, orderRevelation: 71 },
  { number: 72, nameAr: "الجن", nameEn: "Al-Jinn", revelation: "مكية", ayahCount: 28, startPage: 572, orderRevelation: 40 },
  { number: 73, nameAr: "المزمل", nameEn: "Al-Muzzammil", revelation: "مكية", ayahCount: 20, startPage: 574, orderRevelation: 3 },
  { number: 74, nameAr: "المدثر", nameEn: "Al-Muddaththir", revelation: "مكية", ayahCount: 56, startPage: 575, orderRevelation: 4 },
  { number: 75, nameAr: "القيامة", nameEn: "Al-Qiyama", revelation: "مكية", ayahCount: 40, startPage: 577, orderRevelation: 31 },
  { number: 76, nameAr: "الإنسان", nameEn: "Al-Insan", revelation: "مدنية", ayahCount: 31, startPage: 578, orderRevelation: 98 },
  { number: 77, nameAr: "المرسلات", nameEn: "Al-Mursalat", revelation: "مكية", ayahCount: 50, startPage: 580, orderRevelation: 33 },
  { number: 78, nameAr: "النبأ", nameEn: "An-Naba", revelation: "مكية", ayahCount: 40, startPage: 582, orderRevelation: 80 },
  { number: 79, nameAr: "النازعات", nameEn: "An-Nazi'at", revelation: "مكية", ayahCount: 46, startPage: 583, orderRevelation: 81 },
  { number: 80, nameAr: "عبس", nameEn: "Abasa", revelation: "مكية", ayahCount: 42, startPage: 585, orderRevelation: 24 },
  { number: 81, nameAr: "التكوير", nameEn: "At-Takwir", revelation: "مكية", ayahCount: 29, startPage: 586, orderRevelation: 7 },
  { number: 82, nameAr: "الانفطار", nameEn: "Al-Infitar", revelation: "مكية", ayahCount: 19, startPage: 587, orderRevelation: 82 },
  { number: 83, nameAr: "المطففين", nameEn: "Al-Mutaffifin", revelation: "مكية", ayahCount: 36, startPage: 587, orderRevelation: 86 },
  { number: 84, nameAr: "الانشقاق", nameEn: "Al-Inshiqaq", revelation: "مكية", ayahCount: 25, startPage: 589, orderRevelation: 83 },
  { number: 85, nameAr: "البروج", nameEn: "Al-Buruj", revelation: "مكية", ayahCount: 22, startPage: 590, orderRevelation: 27 },
  { number: 86, nameAr: "الطارق", nameEn: "At-Tariq", revelation: "مكية", ayahCount: 17, startPage: 591, orderRevelation: 36 },
  { number: 87, nameAr: "الأعلى", nameEn: "Al-A'la", revelation: "مكية", ayahCount: 19, startPage: 591, orderRevelation: 8 },
  { number: 88, nameAr: "الغاشية", nameEn: "Al-Ghashiya", revelation: "مكية", ayahCount: 26, startPage: 592, orderRevelation: 68 },
  { number: 89, nameAr: "الفجر", nameEn: "Al-Fajr", revelation: "مكية", ayahCount: 30, startPage: 593, orderRevelation: 10 },
  { number: 90, nameAr: "البلد", nameEn: "Al-Balad", revelation: "مكية", ayahCount: 20, startPage: 594, orderRevelation: 35 },
  { number: 91, nameAr: "الشمس", nameEn: "Ash-Shams", revelation: "مكية", ayahCount: 15, startPage: 594, orderRevelation: 26 },
  { number: 92, nameAr: "الليل", nameEn: "Al-Layl", revelation: "مكية", ayahCount: 21, startPage: 595, orderRevelation: 9 },
  { number: 93, nameAr: "الضحى", nameEn: "Ad-Duha", revelation: "مكية", ayahCount: 11, startPage: 596, orderRevelation: 11 },
  { number: 94, nameAr: "الشرح", nameEn: "Ash-Sharh", revelation: "مكية", ayahCount: 8, startPage: 596, orderRevelation: 12 },
  { number: 95, nameAr: "التين", nameEn: "At-Tin", revelation: "مكية", ayahCount: 8, startPage: 597, orderRevelation: 28 },
  { number: 96, nameAr: "العلق", nameEn: "Al-Alaq", revelation: "مكية", ayahCount: 19, startPage: 597, orderRevelation: 1 },
  { number: 97, nameAr: "القدر", nameEn: "Al-Qadr", revelation: "مكية", ayahCount: 5, startPage: 598, orderRevelation: 25 },
  { number: 98, nameAr: "البينة", nameEn: "Al-Bayyina", revelation: "مدنية", ayahCount: 8, startPage: 598, orderRevelation: 100 },
  { number: 99, nameAr: "الزلزلة", nameEn: "Az-Zalzala", revelation: "مدنية", ayahCount: 8, startPage: 599, orderRevelation: 93 },
  { number: 100, nameAr: "العاديات", nameEn: "Al-Adiyat", revelation: "مكية", ayahCount: 11, startPage: 599, orderRevelation: 14 },
  { number: 101, nameAr: "القارعة", nameEn: "Al-Qari'a", revelation: "مكية", ayahCount: 11, startPage: 600, orderRevelation: 30 },
  { number: 102, nameAr: "التكاثر", nameEn: "At-Takathur", revelation: "مكية", ayahCount: 8, startPage: 600, orderRevelation: 16 },
  { number: 103, nameAr: "العصر", nameEn: "Al-Asr", revelation: "مكية", ayahCount: 3, startPage: 601, orderRevelation: 13 },
  { number: 104, nameAr: "الهمزة", nameEn: "Al-Humaza", revelation: "مكية", ayahCount: 9, startPage: 601, orderRevelation: 32 },
  { number: 105, nameAr: "الفيل", nameEn: "Al-Fil", revelation: "مكية", ayahCount: 5, startPage: 601, orderRevelation: 19 },
  { number: 106, nameAr: "قريش", nameEn: "Quraysh", revelation: "مكية", ayahCount: 4, startPage: 602, orderRevelation: 29 },
  { number: 107, nameAr: "الماعون", nameEn: "Al-Ma'un", revelation: "مكية", ayahCount: 7, startPage: 602, orderRevelation: 17 },
  { number: 108, nameAr: "الكوثر", nameEn: "Al-Kawthar", revelation: "مكية", ayahCount: 3, startPage: 602, orderRevelation: 15 },
  { number: 109, nameAr: "الكافرون", nameEn: "Al-Kafirun", revelation: "مكية", ayahCount: 6, startPage: 603, orderRevelation: 18 },
  { number: 110, nameAr: "النصر", nameEn: "An-Nasr", revelation: "مدنية", ayahCount: 3, startPage: 603, orderRevelation: 114 },
  { number: 111, nameAr: "المسد", nameEn: "Al-Masad", revelation: "مكية", ayahCount: 5, startPage: 603, orderRevelation: 6 },
  { number: 112, nameAr: "الإخلاص", nameEn: "Al-Ikhlas", revelation: "مكية", ayahCount: 4, startPage: 604, orderRevelation: 22 },
  { number: 113, nameAr: "الفلق", nameEn: "Al-Falaq", revelation: "مكية", ayahCount: 5, startPage: 604, orderRevelation: 20 },
  { number: 114, nameAr: "الناس", nameEn: "An-Nas", revelation: "مكية", ayahCount: 6, startPage: 604, orderRevelation: 21 },
];

// مواضع السجدة في القرآن
const sajdaAyahs: Record<number, number[]> = {
  7: [206], 13: [15], 16: [50], 17: [109], 19: [58], 22: [18, 77], 25: [60], 27: [26],
  32: [15], 38: [24], 41: [38], 53: [62], 84: [21], 96: [19]
};

// جلب آيات السورة من API
async function fetchSurahAyahs(surahNumber: number): Promise<any[]> {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const data = await response.json();
    
    if (data.code === 200 && data.data?.ayahs) {
      return data.data.ayahs;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    return [];
  }
}

// حساب الجزء والصفحة بناءً على رقم الآية العالمي
function calculatePageAndJuz(globalNumber: number): { page: number; juz: number; hizb: number } {
  // خريطة تقريبية للصفحات والأجزاء
  const pageMap: { page: number; juz: number; hizb: number }[] = [
    { page: 1, juz: 1, hizb: 0.5 },
    { page: 2, juz: 1, hizb: 1 },
    // ... يمكن إضافة المزيد من الدقة
  ];
  
  // حساب تقريبي
  const page = Math.ceil(globalNumber / 15) + 1;
  const juz = Math.ceil(globalNumber / 200) + 1;
  const hizb = Math.ceil(globalNumber / 100) / 2;
  
  return { page: Math.min(page, 604), juz: Math.min(juz, 30), hizb: Math.min(hizb, 60) };
}

async function main() {
  console.log("🌱 بدء إضافة جميع آيات القرآن الكريم...");
  console.log("📚 عدد السور: 114");
  console.log("📖 عدد الآيات المتوقعة: 6236");

  // حذف البيانات القديمة
  console.log("\n🗑️ تنظيف البيانات القديمة...");
  await prisma.tafsir.deleteMany();
  await prisma.ayah.deleteMany();
  await prisma.surah.deleteMany();
  await prisma.wordNote.deleteMany();
  await prisma.wordStatistic.deleteMany();

  // إضافة السور
  console.log("\n📖 إضافة السور...");
  const createdSurahs: Record<number, number> = {};
  for (const surah of surahsData) {
    const created = await prisma.surah.create({ data: surah });
    createdSurahs[surah.number] = created.id;
    process.stdout.write(`\r✅ تم إضافة السورة ${surah.number}: ${surah.nameAr}`);
  }
  console.log("\n");

  // إضافة الآيات
  console.log("📝 إضافة الآيات...");
  let globalNumber = 1;
  let totalAyahs = 0;

  for (let surahNumber = 1; surahNumber <= 114; surahNumber++) {
    const surah = surahsData.find(s => s.number === surahNumber);
    if (!surah) continue;

    process.stdout.write(`\r📥 جلب سورة ${surahNumber}: ${surah.nameAr}...`);

    const ayahs = await fetchSurahAyahs(surahNumber);
    
    for (const ayah of ayahs) {
      const { page, juz, hizb } = calculatePageAndJuz(globalNumber);
      const hasSajda = sajdaAyahs[surahNumber]?.includes(ayah.numberInSurah) || false;

      try {
        await prisma.ayah.create({
          data: {
            surahId: createdSurahs[surahNumber],
            numberInSurah: ayah.numberInSurah,
            numberGlobal: globalNumber,
            textUthmani: ayah.text,
            textSimple: ayah.text, // يمكن تحسينها لاحقاً
            page: page,
            juz: juz,
            hizb: hizb,
            sajda: hasSajda,
          }
        });
        globalNumber++;
        totalAyahs++;
      } catch (error) {
        console.error(`\n❌ خطأ في إضافة الآية ${ayah.numberInSurah} من ${surah.nameAr}`);
      }
    }

    // تأخير بسيط لتجنب حد طلبات كثيرة
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n\n✅ تم إضافة ${totalAyahs} آية بنجاح!`);
  console.log("📊 الإحصائيات:");
  console.log(`   - عدد السور: ${Object.keys(createdSurahs).length}`);
  console.log(`   - عدد الآيات: ${totalAyahs}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
