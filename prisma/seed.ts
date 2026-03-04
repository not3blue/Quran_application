import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// بيانات السور الكاملة
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

// آيات سورة الفاتحة (نموذج)
const fatihaAyahs = [
  { numberInSurah: 1, textUthmani: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", textSimple: "بسم الله الرحمن الرحيم", page: 1, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 2, textUthmani: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", textSimple: "الحمد لله رب العالمين", page: 1, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 3, textUthmani: "الرَّحْمَٰنِ الرَّحِيمِ", textSimple: "الرحمن الرحيم", page: 1, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 4, textUthmani: "مَالِكِ يَوْمِ الدِّينِ", textSimple: "مالك يوم الدين", page: 1, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 5, textUthmani: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", textSimple: "إياك نعبد وإياك نستعين", page: 1, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 6, textUthmani: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", textSimple: "اهدنا الصراط المستقيم", page: 1, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 7, textUthmani: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", textSimple: "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين", page: 1, juz: 1, hizb: 0.5, sajda: false },
];

// آيات سورة البقرة (أول 10 آيات)
const baqarahAyahs = [
  { numberInSurah: 1, textUthmani: "الم", textSimple: "الم", page: 2, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 2, textUthmani: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", textSimple: "ذلك الكتاب لا ريب فيه هدى للمتقين", page: 2, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 3, textUthmani: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", textSimple: "الذين يؤمنون بالغيب ويقيمون الصلاة ومما رزقناهم ينفقون", page: 2, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 4, textUthmani: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ", textSimple: "والذين يؤمنون بما أنزل إليك وما أنزل من قبلك وبالآخرة هم يوقنون", page: 2, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 5, textUthmani: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ", textSimple: "أولئك على هدى من ربهم وأولئك هم المفلحون", page: 2, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 6, textUthmani: "إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ", textSimple: "إن الذين كفروا سواء عليهم أأنذرتهم أم لم تنذرهم لا يؤمنون", page: 2, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 7, textUthmani: "خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ", textSimple: "ختم الله على قلوبهم وعلى سمعهم وعلى أبصارهم غشاوة ولهم عذاب عظيم", page: 2, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 8, textUthmani: "وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ", textSimple: "ومن الناس من يقول آمنا بالله وباليوم الآخر وما هم بمؤمنين", page: 2, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 9, textUthmani: "يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ", textSimple: "يخادعون الله والذين آمنوا وما يخدعون إلا أنفسهم وما يشعرون", page: 2, juz: 1, hizb: 0.5, sajda: false },
  { numberInSurah: 10, textUthmani: "فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ", textSimple: "في قلوبهم مرض فزادهم الله مرضا ولهم عذاب أليم بما كانوا يكذبون", page: 2, juz: 1, hizb: 0.5, sajda: false },
];

// آيات سورة الإخلاص
const ikhlasAyahs = [
  { numberInSurah: 1, textUthmani: "قُلْ هُوَ اللَّهُ أَحَدٌ", textSimple: "قل هو الله أحد", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 2, textUthmani: "اللَّهُ الصَّمَدُ", textSimple: "الله الصمد", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 3, textUthmani: "لَمْ يَلِدْ وَلَمْ يُولَدْ", textSimple: "لم يلد ولم يولد", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 4, textUthmani: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", textSimple: "ولم يكن له كفوا أحد", page: 604, juz: 30, hizb: 60, sajda: false },
];

// آيات سورة الناس
const nasAyahs = [
  { numberInSurah: 1, textUthmani: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", textSimple: "قل أعوذ برب الناس", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 2, textUthmani: "مَلِكِ النَّاسِ", textSimple: "ملك الناس", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 3, textUthmani: "إِلَٰهِ النَّاسِ", textSimple: "إله الناس", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 4, textUthmani: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", textSimple: "من شر الوسواس الخناس", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 5, textUthmani: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", textSimple: "الذي يوسوس في صدور الناس", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 6, textUthmani: "مِنَ الْجِنَّةِ وَالنَّاسِ", textSimple: "من الجنة والناس", page: 604, juz: 30, hizb: 60, sajda: false },
];

// آيات سورة الفلق
const falaqAyahs = [
  { numberInSurah: 1, textUthmani: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", textSimple: "قل أعوذ برب الفلق", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 2, textUthmani: "مِن شَرِّ مَا خَلَقَ", textSimple: "من شر ما خلق", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 3, textUthmani: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", textSimple: "ومن شر غاسق إذا وقب", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 4, textUthmani: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", textSimple: "ومن شر النفاثات في العقد", page: 604, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 5, textUthmani: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", textSimple: "ومن شر حاسد إذا حسد", page: 604, juz: 30, hizb: 60, sajda: false },
];

// آيات سورة الكوثر
const kawtharAyahs = [
  { numberInSurah: 1, textUthmani: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", textSimple: "إنا أعطيناك الكوثر", page: 602, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 2, textUthmani: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", textSimple: "فصل لربك وانحر", page: 602, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 3, textUthmani: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", textSimple: "إن شانئك هو الأبتر", page: 602, juz: 30, hizb: 60, sajda: false },
];

// آيات سورة العصر
const asrAyahs = [
  { numberInSurah: 1, textUthmani: "وَالْعَصْرِ", textSimple: "والعصر", page: 601, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 2, textUthmani: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", textSimple: "إن الإنسان لفي خسر", page: 601, juz: 30, hizb: 60, sajda: false },
  { numberInSurah: 3, textUthmani: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", textSimple: "إلا الذين آمنوا وعملوا الصالحات وتواصوا بالحق وتواصوا بالصبر", page: 601, juz: 30, hizb: 60, sajda: false },
];

// مصادر التفسير - التيسير في التفسير فقط
const tafsirSources = [
  {
    nameAr: "التيسير في التفسير",
    nameEn: "At-Taisir fi at-Tafsir",
    authorAr: "السيد بدرالدين أمير الدين الحوثي",
    authorEn: "Al-Sayyid Badr al-Din Amir al-Din al-Houthi",
    description: "تفسير جامع يجمع بين التفسير بالمأثور والمعقول، يركز على المعاني والإرشادات القرآنية بأسلوب سهل وواضح",
    language: "ar",
    isDefault: true
  },
];

// القراء
const reciters = [
  { nameAr: "عبد الباسط عبد الصمد", nameEn: "Abdul Basit Abdul Samad", bio: "قارئ مصري مشهور بأسلوبه المجود المؤثر", style: "مرتل", country: "مصر", isDefault: true },
  { nameAr: "محمد صديق المنشاوي", nameEn: "Mohammed Siddiq Al-Minshawi", bio: "قارئ مصري له صوت مؤثر وخاشع", style: "مرتل", country: "مصر", isDefault: false },
  { nameAr: "ماهر المعيقلي", nameEn: "Maher Al-Muaiqly", bio: "إمام الحرم المكي الشريف", style: "مرتل", country: "السعودية", isDefault: false },
  { nameAr: "عبد الرحمن السديس", nameEn: "Abdurrahman As-Sudais", bio: "الإمام الرئيس للحرم المكي الشريف", style: "مرتل", country: "السعودية", isDefault: false },
  { nameAr: "سعود الشريم", nameEn: "Saoud Ash-Shuraim", bio: "إمام وخطيب الحرم المكي الشريف", style: "مرتل", country: "السعودية", isDefault: false },
];

// تفاسير من كتاب التيسير في التفسير
const tafsirData = [
  // الفاتحة
  { surahId: 1, ayahNumber: 1, sourceId: 1, text: "﴿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ﴾: البسملة افتتاح لكل أمر مهم، والله هو المعبود بحق، الرحمن الذي وسعت رحمته جميع خلقه، الرحيم بالمؤمنين خاصة." },
  { surahId: 1, ayahNumber: 2, sourceId: 1, text: "﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾: الحمد لله هو الثناء على الله بصفاته الكاملة ونعمه الجزيلة، ورب العالمين أي مربي جميع الخلق ومالكهم." },
  { surahId: 1, ayahNumber: 3, sourceId: 1, text: "﴿الرَّحْمَٰنِ الرَّحِيمِ﴾: الرحمن والرحيم من أسماء الله الحسنى، دالان على كمال رحمته، فالرحمن ذو الرحمة العامة، والرحيم ذو الرحمة الخاصة بالمؤمنين." },
  { surahId: 1, ayahNumber: 4, sourceId: 1, text: "﴿مَالِكِ يَوْمِ الدِّينِ﴾: المالك ليوم القيامة والحساب، الذي يدين العباد بأعمالهم، فيجازي المحسن بإحسانه والمسيء بإساءته." },
  { surahId: 1, ayahNumber: 5, sourceId: 1, text: "﴿إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ﴾: نخصك وحدك بالعبادة والاستعانة، وهذه هي عبادة التوكل والاستقامة على طريق الحق." },
  { surahId: 1, ayahNumber: 6, sourceId: 1, text: "﴿اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ﴾: اهدنا وأرشدنا إلى الطريق المستقيم، وهو الإسلام الذي لا اعوجاج فيه، طريق الأنبياء والصالحين." },
  { surahId: 1, ayahNumber: 7, sourceId: 1, text: "﴿صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ﴾: طريق الذين أنعمت عليهم من النبيين والصديقين والشهداء والصالحين، غير طريق اليهود الذين غضب الله عليهم، ولا طريق النصارى الذين ضلوا عن الحق." },
];

async function main() {
  console.log("🌱 بدء زرع البيانات...");

  // حذف البيانات القديمة
  console.log("🗑️ حذف البيانات القديمة...");
  await prisma.tafsir.deleteMany();
  await prisma.audioFile.deleteMany();
  await prisma.ayah.deleteMany();
  await prisma.surah.deleteMany();
  await prisma.tafsirSource.deleteMany();
  await prisma.reciter.deleteMany();
  await prisma.wordNote.deleteMany();
  await prisma.wordStatistic.deleteMany();

  // إضافة السور
  console.log("📖 إضافة السور...");
  const createdSurahs: Record<number, number> = {};
  for (const surah of surahsData) {
    const created = await prisma.surah.create({ data: surah });
    createdSurahs[surah.number] = created.id;
  }

  // إضافة الآيات
  console.log("📝 إضافة الآيات...");
  let globalNumber = 1;

  // الفاتحة
  for (const ayah of fatihaAyahs) {
    await prisma.ayah.create({
      data: {
        surahId: createdSurahs[1],
        numberInSurah: ayah.numberInSurah,
        numberGlobal: globalNumber++,
        textUthmani: ayah.textUthmani,
        textSimple: ayah.textSimple,
        page: ayah.page,
        juz: ayah.juz,
        hizb: ayah.hizb,
        sajda: ayah.sajda,
      }
    });
  }

  // البقرة
  for (const ayah of baqarahAyahs) {
    await prisma.ayah.create({
      data: {
        surahId: createdSurahs[2],
        numberInSurah: ayah.numberInSurah,
        numberGlobal: globalNumber++,
        textUthmani: ayah.textUthmani,
        textSimple: ayah.textSimple,
        page: ayah.page,
        juz: ayah.juz,
        hizb: ayah.hizb,
        sajda: ayah.sajda,
      }
    });
  }

  // الكوثر
  globalNumber = 6205;
  for (const ayah of kawtharAyahs) {
    await prisma.ayah.create({
      data: {
        surahId: createdSurahs[108],
        numberInSurah: ayah.numberInSurah,
        numberGlobal: globalNumber++,
        textUthmani: ayah.textUthmani,
        textSimple: ayah.textSimple,
        page: ayah.page,
        juz: ayah.juz,
        hizb: ayah.hizb,
        sajda: ayah.sajda,
      }
    });
  }

  // العصر
  globalNumber = 6177;
  for (const ayah of asrAyahs) {
    await prisma.ayah.create({
      data: {
        surahId: createdSurahs[103],
        numberInSurah: ayah.numberInSurah,
        numberGlobal: globalNumber++,
        textUthmani: ayah.textUthmani,
        textSimple: ayah.textSimple,
        page: ayah.page,
        juz: ayah.juz,
        hizb: ayah.hizb,
        sajda: ayah.sajda,
      }
    });
  }

  // الفلق
  globalNumber = 6226;
  for (const ayah of falaqAyahs) {
    await prisma.ayah.create({
      data: {
        surahId: createdSurahs[113],
        numberInSurah: ayah.numberInSurah,
        numberGlobal: globalNumber++,
        textUthmani: ayah.textUthmani,
        textSimple: ayah.textSimple,
        page: ayah.page,
        juz: ayah.juz,
        hizb: ayah.hizb,
        sajda: ayah.sajda,
      }
    });
  }

  // الناس
  globalNumber = 6231;
  for (const ayah of nasAyahs) {
    await prisma.ayah.create({
      data: {
        surahId: createdSurahs[114],
        numberInSurah: ayah.numberInSurah,
        numberGlobal: globalNumber++,
        textUthmani: ayah.textUthmani,
        textSimple: ayah.textSimple,
        page: ayah.page,
        juz: ayah.juz,
        hizb: ayah.hizb,
        sajda: ayah.sajda,
      }
    });
  }

  // الإخلاص
  globalNumber = 6222;
  for (const ayah of ikhlasAyahs) {
    await prisma.ayah.create({
      data: {
        surahId: createdSurahs[112],
        numberInSurah: ayah.numberInSurah,
        numberGlobal: globalNumber++,
        textUthmani: ayah.textUthmani,
        textSimple: ayah.textSimple,
        page: ayah.page,
        juz: ayah.juz,
        hizb: ayah.hizb,
        sajda: ayah.sajda,
      }
    });
  }

  // إضافة مصادر التفسير
  console.log("📚 إضافة مصادر التفسير...");
  const createdSources: Record<number, number> = {};
  for (const source of tafsirSources) {
    const created = await prisma.tafsirSource.create({ data: source });
    createdSources[source.isDefault ? 1 : 0] = created.id;
  }

  // إضافة القراء
  console.log("🎙️ إضافة القراء...");
  for (const reciter of reciters) {
    await prisma.reciter.create({ data: reciter });
  }

  // إضافة التفاسير
  console.log("📖 إضافة التفاسير...");
  for (const tafsir of tafsirData) {
    const ayah = await prisma.ayah.findFirst({
      where: { surahId: createdSurahs[tafsir.surahId], numberInSurah: tafsir.ayahNumber }
    });
    if (ayah) {
      await prisma.tafsir.create({
        data: {
          ayahId: ayah.id,
          sourceId: createdSources[tafsir.sourceId] || createdSources[1],
          text: tafsir.text,
        }
      });
    }
  }

  console.log("✅ تم زرع البيانات بنجاح!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
