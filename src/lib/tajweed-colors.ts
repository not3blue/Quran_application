// أحكام التجويد مع ألوانها

// ألوان أحكام التجويد
export const TAJWEED_COLORS = {
  // النون الساكنة والتنوين
  idgham: '#2E7D32',        // الإدغام - أخضر داكن
  izhar: '#1565C0',         // الإظهار - أزرق
  iqlab: '#7B1FA2',         // الإقلاب - بنفسجي
  ikhfa: '#00838F',         // الإخفاء - سماوي
  
  // الميم الساكنة
  idghamMim: '#2E7D32',     // إدغام المتماثلين - أخضر
  ikhfaShafawi: '#6A1B9A',  // الإخفاء الشفوي - بنفسجي داكن
  izharShafawi: '#1565C0',  // الإظهار الشفوي - أزرق
  
  // المدود
  wajib: '#C62828',         // المد الواجب المتصل - أحمر
  jaiz: '#EF6C00',          // المد الجائز - برتقالي
  lazim: '#AD1457',         // المد اللازم - وردي داكن
  
  // الغنة
  ghunnah: '#00695C',       // الغنة - أخضر مزرق
  
  // القلقلة
  qalqalah: '#D84315',      // القلقلة - برتقالي داكن
  
  // التفخيم والترقيق
  tafkhim: '#37474F',       // التفخيم - رمادي داكن
  tarqiq: '#78909C',        // الترقيق - رمادي فاتح
  
  // السكت
  waqf: '#5D4037',          // الوقف - بني
};

// حروف الإظهار (أ، هـ، ع، ح، غ، خ)
const IZHAR_LETTERS = ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'];

// حروف الإدغام (ي، ر، م، ل، و، ن) - بدون النون في الإدغام بغنة
const IDGHAM_LETTERS = ['ي', 'ر', 'م', 'ل', 'و'];
const IDGHAM_WITHOUT_GHUNNAH = ['ر', 'ل']; // إدغام بلا غنة
const IDGHAM_WITH_GHUNNAH = ['ي', 'م', 'و', 'ن']; // إدغام بغنة

// حرف الإقلاب (باء)
const IQLAB_LETTER = 'ب';

// حروف الإخفاء (صف، ذ، ث، ك، ج، ش، ق، س، د، ط، ز، ف، ت، ض، ظ)
const IKHFA_LETTERS = ['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ', 'غ', 'خ'];

// حروف القلقلة (ق، ط، ب، ج، د)
const QALQALAH_LETTERS = ['ق', 'ط', 'ب', 'ج', 'د'];

// حروف الاستعلاء (ق، ظ، ص، ط، ض، غ، خ)
const ISTIQLA_LETTERS = ['ق', 'ظ', 'ص', 'ط', 'ض', 'غ', 'خ'];

// حروف المد (ا، و، ي)
const MAD_LETTERS = ['ا', 'و', 'ي'];

// علامات التشكيل
const SUKUN = '\u0652';     // ْ - السكون
const SHADDA = '\u0651';    // ّ - الشدة
const FATHA = '\u064E';     // َ - الفتحة
const DAMMA = '\u064F';     // ُ - الضمة
const KASRA = '\u0650';     // ِ - الكسرة
const TANWIN_FATH = '\u064B'; // ً - تنوين فتح
const TANWIN_DAMM = '\u064C'; // ٌ - تنوين ضم
const TANWIN_KASR = '\u064D'; // ٍ - تنوين كسر

// إزالة التشكيل للحصول على الحرف الأساسي
function getBaseLetter(char: string): string {
  return char.replace(/[\u064B-\u065F\u0670]/g, '');
}

// التحقق من وجود حركة
function hasHarakah(text: string): boolean {
  return /[\u064B-\u0650]/.test(text);
}

// التحقق من وجود سكون
function hasSukun(text: string): boolean {
  return text.includes(SUKUN);
}

// التحقق من وجود شدة
function hasShadda(text: string): boolean {
  return text.includes(SHADDA);
}

// التحقق من وجود تنوين
function hasTanwin(text: string): boolean {
  return /[\u064B-\u064D]/.test(text);
}

// تطبيق ألوان التجويد على النص
export function applyTajweedColors(text: string): string {
  if (!text) return text;
  
  const chars = text.split('');
  const result: string[] = [];
  
  for (let i = 0; i < chars.length; i++) {
    const currentChar = chars[i];
    const nextChar = i < chars.length - 1 ? chars[i + 1] : '';
    const prevChar = i > 0 ? chars[i - 1] : '';
    
    const baseCurrent = getBaseLetter(currentChar);
    const baseNext = getBaseLetter(nextChar);
    const basePrev = getBaseLetter(prevChar);
    
    // تخطي المسافات وعلامات الترقيم
    if (/\s/.test(currentChar) || /[ًٌٍَُِّْ]/.test(currentChar)) {
      result.push(currentChar);
      continue;
    }
    
    let coloredChar = currentChar;
    let tajweedRule: string | null = null;
    
    // 1. الغنة - النون أو الميم المشددتان
    if ((baseCurrent === 'ن' || baseCurrent === 'م') && hasShadda(currentChar)) {
      tajweedRule = 'ghunnah';
    }
    
    // 2. القلقلة - حروف قطب جد بسكون أو شدة
    else if (QALQALAH_LETTERS.includes(baseCurrent) && (hasSukun(currentChar) || hasShadda(currentChar))) {
      tajweedRule = 'qalqalah';
    }
    
    // 3. النون الساكنة والتنوين
    else if (baseCurrent === 'ن' && hasSukun(currentChar)) {
      // البحث عن الحرف التالي
      const nextLetter = findNextLetter(chars, i);
      
      if (nextLetter) {
        if (IZHAR_LETTERS.includes(nextLetter)) {
          tajweedRule = 'izhar';
        } else if (IDGHAM_WITHOUT_GHUNNAH.includes(nextLetter)) {
          tajweedRule = 'idgham';
        } else if (IDGHAM_WITH_GHUNNAH.includes(nextLetter)) {
          tajweedRule = 'ghunnah';
        } else if (nextLetter === IQLAB_LETTER) {
          tajweedRule = 'iqlab';
        } else if (IKHFA_LETTERS.includes(nextLetter)) {
          tajweedRule = 'ikhfa';
        }
      }
    }
    
    // 4. الميم الساكنة
    else if (baseCurrent === 'م' && hasSukun(currentChar)) {
      const nextLetter = findNextLetter(chars, i);
      
      if (nextLetter) {
        if (nextLetter === 'م') {
          tajweedRule = 'idghamMim';
        } else if (nextLetter === 'ب') {
          tajweedRule = 'ikhfaShafawi';
        } else if (!['ا', 'و', 'ي'].includes(nextLetter)) {
          tajweedRule = 'izharShafawi';
        }
      }
    }
    
    // 5. المدود
    else if (MAD_LETTERS.includes(baseCurrent)) {
      // مد واجب متصل (همزة بعد حرف المد في نفس الكلمة)
      if (baseCurrent === 'ا' || baseCurrent === 'و' || baseCurrent === 'ي') {
        // التحقق من المد المتصل
        const prevLetterWithHarakah = chars.slice(Math.max(0, i - 2), i).join('');
        if (hasHamzah(prevLetterWithHarakah)) {
          tajweedRule = 'wajib';
        }
      }
    }
    
    // 6. التفخيم
    else if (ISTIQLA_LETTERS.includes(baseCurrent)) {
      // التحقق من الفتح أو الضم للتفخيم الأقصى
      if (currentChar.includes(FATHA) || currentChar.includes(DAMMA)) {
        tajweedRule = 'tafkhim';
      } else if (currentChar.includes(KASRA)) {
        tajweedRule = 'tarqiq';
      }
    }
    
    // تطبيق اللون
    if (tajweedRule && TAJWEED_COLORS[tajweedRule as keyof typeof TAJWEED_COLORS]) {
      const color = TAJWEED_COLORS[tajweedRule as keyof typeof TAJWEED_COLORS];
      result.push(`<span style="color: ${color}">${currentChar}</span>`);
    } else {
      result.push(currentChar);
    }
  }
  
  return result.join('');
}

// البحث عن الحرف التالي (تخطي التشكيل والمسافات)
function findNextLetter(chars: string[], currentIndex: number): string | null {
  for (let i = currentIndex + 1; i < chars.length; i++) {
    const char = chars[i];
    if (/\s/.test(char)) continue;
    if (/[ًٌٍَُِّْ]/.test(char)) continue;
    return getBaseLetter(char);
  }
  return null;
}

// التحقق من وجود همزة
function hasHamzah(text: string): boolean {
  return /[أإآءؤئ]/.test(text);
}

// دالة مبسطة لتلوين أحكام التجويد الأساسية
export function colorizeTajweed(text: string): React.ReactNode[] {
  if (!text) return [text];
  
  const parts: { text: string; color?: string }[] = [];
  const chars = text.split('');
  let currentPart = '';
  let currentColor: string | undefined = undefined;
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = i < chars.length - 1 ? chars[i + 1] : '';
    const baseChar = getBaseLetter(char);
    const baseNext = getBaseLetter(nextChar);
    
    let newColor: string | undefined = undefined;
    
    // القلقلة (ق ط ب ج د) مع سكون أو شدة
    if (QALQALAH_LETTERS.includes(baseChar)) {
      if (hasSukun(char) || hasShadda(char)) {
        newColor = TAJWEED_COLORS.qalqalah;
      }
    }
    
    // الغنة (نون أو ميم مشددة)
    if ((baseChar === 'ن' || baseChar === 'م') && hasShadda(char)) {
      newColor = TAJWEED_COLORS.ghunnah;
    }
    
    // النون الساكنة
    if (baseChar === 'ن' && hasSukun(char)) {
      const nextLetter = findNextLetter(chars, i);
      if (nextLetter) {
        if (IZHAR_LETTERS.includes(nextLetter)) {
          newColor = TAJWEED_COLORS.izhar;
        } else if (IDGHAM_LETTERS.includes(nextLetter)) {
          newColor = TAJWEED_COLORS.idgham;
        } else if (nextLetter === IQLAB_LETTER) {
          newColor = TAJWEED_COLORS.iqlab;
        } else if (IKHFA_LETTERS.includes(nextLetter)) {
          newColor = TAJWEED_COLORS.ikhfa;
        }
      }
    }
    
    // التنوين
    if (hasTanwin(char)) {
      const nextLetter = findNextLetter(chars, i);
      if (nextLetter) {
        if (IZHAR_LETTERS.includes(nextLetter)) {
          newColor = TAJWEED_COLORS.izhar;
        } else if (IDGHAM_LETTERS.includes(nextLetter)) {
          newColor = TAJWEED_COLORS.idgham;
        } else if (nextLetter === IQLAB_LETTER) {
          newColor = TAJWEED_COLORS.iqlab;
        } else if (IKHFA_LETTERS.includes(nextLetter)) {
          newColor = TAJWEED_COLORS.ikhfa;
        }
      }
    }
    
    // الميم الساكنة
    if (baseChar === 'م' && hasSukun(char)) {
      const nextLetter = findNextLetter(chars, i);
      if (nextLetter) {
        if (nextLetter === 'م') {
          newColor = TAJWEED_COLORS.idghamMim;
        } else if (nextLetter === 'ب') {
          newColor = TAJWEED_COLORS.ikhfaShafawi;
        } else {
          newColor = TAJWEED_COLORS.izharShafawi;
        }
      }
    }
    
    // إذا تغير اللون
    if (newColor !== currentColor) {
      if (currentPart) {
        parts.push({ text: currentPart, color: currentColor });
      }
      currentPart = char;
      currentColor = newColor;
    } else {
      currentPart += char;
    }
  }
  
  // إضافة الجزء الأخير
  if (currentPart) {
    parts.push({ text: currentPart, color: currentColor });
  }
  
  return parts.map((part, index) => ({
    text: part.text,
    color: part.color,
    key: index
  }));
}

// دالة لتفعيل تلوين التجويد على كلمة
export function getTajweedColor(char: string, nextChar?: string): string | undefined {
  const baseChar = getBaseLetter(char);
  const baseNext = nextChar ? getBaseLetter(nextChar) : null;
  
  // القلقلة
  if (QALQALAH_LETTERS.includes(baseChar) && (hasSukun(char) || hasShadda(char))) {
    return TAJWEED_COLORS.qalqalah;
  }
  
  // الغنة
  if ((baseChar === 'ن' || baseChar === 'م') && hasShadda(char)) {
    return TAJWEED_COLORS.ghunnah;
  }
  
  // النون الساكنة
  if (baseChar === 'ن' && hasSukun(char) && baseNext) {
    if (IZHAR_LETTERS.includes(baseNext)) return TAJWEED_COLORS.izhar;
    if (IDGHAM_LETTERS.includes(baseNext)) return TAJWEED_COLORS.idgham;
    if (baseNext === IQLAB_LETTER) return TAJWEED_COLORS.iqlab;
    if (IKHFA_LETTERS.includes(baseNext)) return TAJWEED_COLORS.ikhfa;
  }
  
  // التنوين
  if (hasTanwin(char) && baseNext) {
    if (IZHAR_LETTERS.includes(baseNext)) return TAJWEED_COLORS.izhar;
    if (IDGHAM_LETTERS.includes(baseNext)) return TAJWEED_COLORS.idgham;
    if (baseNext === IQLAB_LETTER) return TAJWEED_COLORS.iqlab;
    if (IKHFA_LETTERS.includes(baseNext)) return TAJWEED_COLORS.ikhfa;
  }
  
  // الميم الساكنة
  if (baseChar === 'م' && hasSukun(char) && baseNext) {
    if (baseNext === 'م') return TAJWEED_COLORS.idghamMim;
    if (baseNext === 'ب') return TAJWEED_COLORS.ikhfaShafawi;
    return TAJWEED_COLORS.izharShafawi;
  }
  
  return undefined;
}

// مفتاح ألوان التجويد للعرض
export const TAJWEED_LEGEND = [
  { name: 'الإدغام', color: TAJWEED_COLORS.idgham, description: 'النون الساكنة/التنوين + يرملون' },
  { name: 'الإظهار', color: TAJWEED_COLORS.izhar, description: 'النون الساكنة/التنوين + ءهعحغخ' },
  { name: 'الإقلاب', color: TAJWEED_COLORS.iqlab, description: 'النون الساكنة/التنوين + باء' },
  { name: 'الإخفاء', color: TAJWEED_COLORS.ikhfa, description: 'النون الساكنة/التنوين + باقي الحروف' },
  { name: 'الغنة', color: TAJWEED_COLORS.ghunnah, description: 'النون والميم المشددتان' },
  { name: 'القلقلة', color: TAJWEED_COLORS.qalqalah, description: 'ق ط ب ج د (ساكنة)' },
  { name: 'إدغام متماثلين', color: TAJWEED_COLORS.idghamMim, description: 'ميم ساكنة + ميم' },
  { name: 'إخفاء شفوي', color: TAJWEED_COLORS.ikhfaShafawi, description: 'ميم ساكنة + باء' },
];
