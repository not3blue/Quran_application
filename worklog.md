# المسجد التقني - منصة المصحف الإلكتروني المتكاملة
## Technical Blueprint for Professional Quran Web Application

---
Task ID: 1
Agent: Main Architect
Task: Create comprehensive technical blueprint for Electronic Quran Platform

Work Log:
- Analyzed project structure and available technologies
- Designed complete database schema
- Created API architecture
- Defined UI/UX guidelines

Stage Summary:
- Complete technical blueprint created
- Database schema designed for Quran data
- API endpoints documented
- Component structure defined

---

# 📋 المخطط التقني والوظيفي الشامل

## 1️⃣ رؤية المنتج والجمهور المستهدف

### الجمهور المستهدف
| الفئة | الوصف | الاحتياجات |
|-------|-------|-----------|
| **طلاب العلم** | دارسو العلوم الشرعية | تفسير عميق، مقارنة التفاسير، ملاحظات علمية |
| **عامة المستخدمين** | المسلمون الراغبون في التلاوة | واجهة بسيطة، استماع سهل، علامات مرجعية |
| **حفظة القرآن** | من يراجعون حفظهم | تكرار الآيات، وضع المراجعة |
| **غير الناطقين بالعربية** | المعنيون بدراسة القرآن | ترجمة كلمة بكلمة، ترجمة معاني |

### القيمة التنافسية
- **واجهة عربية أصيلة**: تصميم يراعي اتجاه RTL وجماليات الخط العربي
- **مصادر تفسير متعددة**: 5+ تفاسير موثوقة مع إمكانية المقارنة
- **تجربة استماع متقدمة**: تعدد القراء مع خيارات التحكم
- **أداء عالي**: تحميل فوري للصفحات مع تخزين مؤقت ذكي

---

## 2️⃣ الميزات الأساسية

### 📖 عرض المصحف
```
Features:
- عرض الخط العثماني بدقة عالية
- تقسيم الصفحات حسب المصحف الشريف
- ترقيم الآيات والأجزاء والأحزاب
- الانتقال السريع بين السور
```

### 📚 نظام التفسير
```
Available Tafsirs:
- تفسير ابن كثير
- تفسير الطبري
- تفسير السعدي
- تفسير القرطبي
- تفسير الجلالين
- تفسير البغوي

Features:
- عرض جنباً إلى جنب
- تفسير الآية المحددة فقط
- ربط الآيات بالتفسير
```

### 🎧 الاستماع والتلاوة
```
Reciters:
- عبد الباسط عبد الصمد (مرتل)
- محمد صديق المنشاوي (مرتل)
- مصطفى إسماعيل (مرتل)
- الحذيفي (مرتل)
- عبد الرحمن السديس (مرتل)

Audio Features:
- تشغيل / إيقاف مؤقت
- تكرار الآية (1-10 مرات)
- التشغيل التلقائي للآية التالية
- تحديد نطاق التشغيل
```

### 🔍 محرك البحث
```
Search Types:
- بحث بالنص الكامل
- بحث بجذر الكلمة
- بحث برقم السورة والآية
- بحث متقدم بالتفاسير
```

### ⭐ العلامات والملاحظات
```
Features:
- وضع علامات مرجعية
- إضافة ملاحظات شخصية
- تصنيف العلامات (ألوان)
- مزامنة السجل الأخير
```

---

## 3️⃣ البنية التقنية

### Frontend Stack
```
Framework: Next.js 16 (App Router)
Language: TypeScript 5
Styling: Tailwind CSS 4 + shadcn/ui
State: Zustand (client) + TanStack Query (server)
Theme: next-themes (dark/light mode)
Fonts: Amiri (Uthmani), Noto Naskh Arabic
```

### Backend Stack
```
Runtime: Node.js (via Next.js API Routes)
Database: SQLite (Prisma ORM)
Authentication: NextAuth.js
Caching: In-memory + Service Worker
```

### Database Schema
```prisma
// Core Quran Data
model Surah {
  id          Int      @id
  number      Int      @unique
  nameAr      String
  nameEn      String
  revelation  String   // مكية / مدنية
  ayahCount   Int
  startPage   Int
  ayat        Ayah[]
}

model Ayah {
  id              Int      @id
  surahId         Int
  numberInSurah   Int
  numberGlobal    Int      @unique
  textUthmani     String
  textSimple      String
  page            Int
  juz             Int
  hizb            Float
  sajda           Boolean  @default(false)
  surah           Surah    @relation(fields: [surahId], references: [id])
  tafsirs         Tafsir[]
  bookmarks       Bookmark[]
}

model TafsirSource {
  id          Int       @id
  nameAr      String
  nameEn      String
  author      String
  tafsirs     Tafsir[]
}

model Tafsir {
  id          Int          @id
  ayahId      Int
  sourceId    Int
  text        String
  ayah        Ayah         @relation(fields: [ayahId], references: [id])
  source      TafsirSource @relation(fields: [sourceId], references: [id])
}

model Reciter {
  id          Int       @id
  nameAr      String
  nameEn      String
  style       String    // مرتل / مجود
  audioFiles  AudioFile[]
}

model AudioFile {
  id          Int      @id
  reciterId   Int
  surahId     Int
  ayahNumber  Int
  audioUrl    String
  duration    Float
  reciter     Reciter  @relation(fields: [reciterId], references: [id])
}

// User Data
model User {
  id          String     @id @default(cuid())
  email       String     @unique
  name        String?
  bookmarks   Bookmark[]
  notes       Note[]
  settings    UserSettings?
}

model Bookmark {
  id        String   @id @default(cuid())
  userId    String
  ayahId    Int
  color     String   @default("#gold")
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  ayah      Ayah     @relation(fields: [ayahId], references: [id])
}

model Note {
  id        String   @id @default(cuid())
  userId    String
  ayahId    Int
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}

model UserSettings {
  id              String   @id @default(cuid())
  userId          String   @unique
  fontSize        Int      @default(24)
  fontFamily      String   @default("amiri")
  selectedReciter Int      @default(1)
  selectedTafsir  Int      @default(1)
  autoPlay        Boolean  @default(true)
  repeatCount     Int      @default(1)
  darkMode        Boolean  @default(false)
  user            User     @relation(fields: [userId], references: [id])
}
```

### API Endpoints
```
GET  /api/quran/surahs              # قائمة السور
GET  /api/quran/surahs/[id]         # سورة معينة مع آياتها
GET  /api/quran/ayah/[id]           # آية معينة
GET  /api/quran/page/[num]          # صفحة معينة
GET  /api/quran/search              # البحث في القرآن

GET  /api/tafsir/sources            # مصادر التفسير
GET  /api/tafsir/[ayahId]           # تفسير آية من جميع المصادر
GET  /api/tafsir/[ayahId]/[source]  # تفسير من مصدر محدد

GET  /api/audio/reciters            # قائمة القراء
GET  /api/audio/[ayahId]/[reciter]  # ملف صوتي لآية

POST /api/bookmarks                 # إضافة علامة
GET  /api/bookmarks                 # العلامات المحفوظة
DELETE /api/bookmarks/[id]          # حذف علامة

POST /api/notes                     # إضافة ملاحظة
GET  /api/notes                     # الملاحظات
PUT  /api/notes/[id]                # تعديل ملاحظة
DELETE /api/notes/[id]              # حذف ملاحظة

GET  /api/user/settings             # إعدادات المستخدم
PUT  /api/user/settings             # تحديث الإعدادات
```

---

## 4️⃣ تصميم واجهة المستخدم

### هيكل التخطيط
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: الشعار | البحث | الوضع الليلي | تسجيل الدخول       │
├─────────┬───────────────────────────────────┬───────────────┤
│         │                                   │               │
│ SIDEBAR │      MAIN QURAN READING AREA     │   TAFSIR      │
│         │                                   │    PANEL      │
│ - السور │    ┌─────────────────────────┐   │               │
│ - الأجزاء│    │   بِسْمِ اللَّهِ الرَّحْمَٰنِ   │   │  تفسير      │
│ - الصفحات│   │   الرَّحِيمِ              │   │  ابن كثير   │
│ - العلامات│  └─────────────────────────┘   │               │
│         │                                   │  ───────────  │
│         │    ┌─────────────────────────┐   │               │
│         │    │   آيات السورة...        │   │  تفسير       │
│         │    │   🎧 🔖 📝              │   │  السعدي      │
│         │    └─────────────────────────┘   │               │
├─────────┴───────────────────────────────────┴───────────────┤
│  AUDIO PLAYER: ▶️ ⏸️ ⏮️ ⏭️ 🔁 التكرار | شريط التقدم        │
├─────────────────────────────────────────────────────────────┤
│  FOOTER: حقوق الملكية | روابط مفيدة                        │
└─────────────────────────────────────────────────────────────┘
```

### نظام الألوان
```css
/* Light Mode */
--background: #fafafa;
--foreground: #1a1a1a;
--primary: #047857;      /* إسلامي أخضر */
--accent: #d4af37;       /* ذهبي */
--card: #ffffff;
--border: #e5e5e5;

/* Dark Mode */
--background: #0f0f0f;
--foreground: #f5f5f5;
--primary: #10b981;
--accent: #fbbf24;
--card: #1a1a1a;
--border: #333333;
```

### الخطوط العربية
```css
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap');

.quran-text {
  font-family: 'Amiri', 'Noto Naskh Arabic', serif;
  font-size: 1.75rem;
  line-height: 2.5;
  text-align: justify;
  direction: rtl;
}
```

---

## 5️⃣ الميزات المتقدمة (اختيارية)

### تلوين التجويد
```javascript
const tajweedRules = {
  hamzatWasl: '#2196F3',
  madda: '#4CAF50',
  ghunna: '#9C27B0',
  qalqala: '#FF5722',
  idgham: '#795548',
  iqlab: '#607D8B'
};
```

### وضع عدم الاتصال (PWA)
```javascript
// service-worker.js
const CACHE_NAME = 'quran-cache-v1';
const STATIC_ASSETS = [
  '/quran-data.json',
  '/audio/',
  '/fonts/'
];
```

---

## 6️⃣ اعتبارات الأمان

- **Authentication**: JWT tokens via NextAuth.js
- **Rate Limiting**: 100 requests/minute for API
- **Input Validation**: Zod schemas for all inputs
- **XSS Prevention**: React's built-in escaping
- **CSRF Protection**: Built-in Next.js protection

---

## 7️⃣ استراتيجية التوسع

### المرحلة الأولى (MVP)
- عرض المصحف الكامل
- تفسير واحد (ابن كثير)
- قارئ واحد
- البحث الأساسي

### المرحلة الثانية
- 5 تفاسير مع المقارنة
- 5 قراء
- العلامات والملاحظات
- وضع عدم الاتصال

### المرحلة الثالثة
- ترجمة كلمة بكلمة
- تلوين التجويد
- لوحة إدارة المحتوى
- تحليلات الاستخدام

---

Task ID: 2-8
Agent: Full-Stack Developer
Task: Implement the complete Electronic Quran Platform

Work Log:
- Created comprehensive Prisma database schema with Surahs, Ayahs, Tafsirs, Reciters, AudioFiles, Bookmarks, Notes, and UserSettings
- Implemented database seed script with sample Quran data (114 Surahs, sample Ayahs, Tafsirs)
- Built Zustand store for state management with persistence
- Created API routes: /api/quran/surahs, /api/quran/surah/[id], /api/tafsir, /api/tafsir/[ayahId], /api/reciters, /api/search
- Developed Header component with search dialog and theme toggle
- Developed Sidebar component with surah list, juz navigation, and filtering
- Developed QuranReader component with Uthmani script display and ayah selection
- Developed TafsirPanel component with multiple tafsir sources and comparison
- Developed AudioPlayer component with playback controls, repeat, and auto-play
- Developed SettingsDialog for font size, font family, reciter, and tafsir preferences
- Implemented dark/light mode with next-themes
- Created custom CSS for Arabic typography (Amiri, Noto Naskh fonts)
- Added bookmarking functionality

Stage Summary:
- Complete MVP implementation of the Electronic Quran Platform
- Database schema with 14 models for Quran data and user features
- 6 API endpoints for data retrieval
- 7 React components for the main interface
- Arabic-first RTL design with Islamic-inspired color scheme
- Responsive design for mobile, tablet, and desktop
- Dark/light mode support
- Sample data: 114 Surahs, 7 Surahs with Ayahs, 5 Tafsir sources, 5 Reciters
- All lint checks passed

---
Task ID: 10
Agent: Main Developer
Task: Add Tafsir Al-Taysir for Quranic verses

Work Log:
- Updated tafsir-ziydia API route with improved tafsir fetching from ziydia.com
- Added fallback tafsir content for common verses (Al-Fatiha, Al-Ikhlas, Al-Baqarah)
- Improved HTML parsing and Arabic text extraction
- Updated main tafsir API route to better integrate with ziydia API
- Updated TafsirPanel component with improved styling and navigation
- Added link to view tafsir on ziydia.com
- Added verse navigation buttons in tafsir panel

Stage Summary:
- Tafsir Al-Taysir now properly integrated
- Fallback content added for popular verses
- Improved UI with better formatting and navigation
- All lint checks passed
- Application running successfully

---
Task ID: 11
Agent: Main Developer
Task: تحسينات متعددة على التطبيق

Work Log:
- إصلاح عرض الآيات جنب إلى جنب مع المسافات الصحيحة
- إضافة البسملة في سطر منفصل أعلى السور
- إزالة البسملة المكررة من الآية الأولى
- جعل لوحة التفسير تفتح تلقائياً عند النقر على الآية
- إصلاح رابط API التفسير
- حذف قائمة الأدعية من الصفحة الرئيسية
- إضافة قسم احترافي "التيسير في التفسير" في الصفحة الرئيسية
- تحديث أوقات الصلاة لمدينة صنعاء، اليمن

Stage Summary:
- الآيات تظهر بشكل مدمج (inline) بالرسم العثماني
- التفسير يظهر تلقائياً عند النقر على أي آية
- الصفحة الرئيسية نظيفة مع قسم تفسير احترافي
- جميع التعديلات تعمل بشكل صحيح
