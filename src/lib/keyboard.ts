/* Arapça klavye öğretici: standart Arapça (101) düzeni ve alıştırma hedefleri (tarayıcı ve testler ortak kullanır).
   Tuşlar fiziksel yerine göre (KeyboardEvent.code) eşleştirilir: bilgisayara Arapça klavye eklenmemiş olsa da çalışır. */
import { shuffle } from './text';

/** code: fiziksel tuş; tr: Türkçe Q klavyedeki etiketi; ar: Arapça harf; sh: Shift ile çıkan */
export type KKey = { code: string; tr: string; ar: string; sh?: string };

export const KB_ROWS: KKey[][] = [
  [{ code: 'Backquote', tr: '"', ar: 'ذ', sh: 'ّ' }, ...[...'1234567890'].map((d) => ({ code: 'Digit' + d, tr: d, ar: d })), { code: 'Minus', tr: '*', ar: '-' }, { code: 'Equal', tr: '-', ar: '=' }],
  [
    { code: 'KeyQ', tr: 'Q', ar: 'ض', sh: 'َ' }, { code: 'KeyW', tr: 'W', ar: 'ص', sh: 'ً' }, { code: 'KeyE', tr: 'E', ar: 'ث', sh: 'ُ' }, { code: 'KeyR', tr: 'R', ar: 'ق', sh: 'ٌ' },
    { code: 'KeyT', tr: 'T', ar: 'ف', sh: 'لإ' }, { code: 'KeyY', tr: 'Y', ar: 'غ', sh: 'إ' }, { code: 'KeyU', tr: 'U', ar: 'ع', sh: '‘' }, { code: 'KeyI', tr: 'I', ar: 'ه', sh: '÷' },
    { code: 'KeyO', tr: 'O', ar: 'خ', sh: '×' }, { code: 'KeyP', tr: 'P', ar: 'ح', sh: '؛' }, { code: 'BracketLeft', tr: 'Ğ', ar: 'ج', sh: '<' }, { code: 'BracketRight', tr: 'Ü', ar: 'د', sh: '>' }
  ],
  [
    { code: 'KeyA', tr: 'A', ar: 'ش', sh: 'ِ' }, { code: 'KeyS', tr: 'S', ar: 'س', sh: 'ٍ' }, { code: 'KeyD', tr: 'D', ar: 'ي', sh: ']' }, { code: 'KeyF', tr: 'F', ar: 'ب', sh: '[' },
    { code: 'KeyG', tr: 'G', ar: 'ل', sh: 'لأ' }, { code: 'KeyH', tr: 'H', ar: 'ا', sh: 'أ' }, { code: 'KeyJ', tr: 'J', ar: 'ت', sh: 'ـ' }, { code: 'KeyK', tr: 'K', ar: 'ن', sh: '،' },
    { code: 'KeyL', tr: 'L', ar: 'م', sh: '/' }, { code: 'Semicolon', tr: 'Ş', ar: 'ك', sh: ':' }, { code: 'Quote', tr: 'İ', ar: 'ط', sh: '"' }
  ],
  [
    { code: 'KeyZ', tr: 'Z', ar: 'ئ', sh: '~' }, { code: 'KeyX', tr: 'X', ar: 'ء', sh: 'ْ' }, { code: 'KeyC', tr: 'C', ar: 'ؤ', sh: '}' }, { code: 'KeyV', tr: 'V', ar: 'ر', sh: '{' },
    { code: 'KeyB', tr: 'B', ar: 'لا', sh: 'لآ' }, { code: 'KeyN', tr: 'N', ar: 'ى', sh: 'آ' }, { code: 'KeyM', tr: 'M', ar: 'ة', sh: '’' }, { code: 'Comma', tr: 'Ö', ar: 'و', sh: ',' },
    { code: 'Period', tr: 'Ç', ar: 'ز', sh: '.' }, { code: 'Slash', tr: '.', ar: 'ظ', sh: '؟' }
  ]
];

const ALL_KEYS = KB_ROWS.flat();
/** Fiziksel tuş ve Shift'ten çıkan karakter */
export function charOf(code: string, shift: boolean): string | null {
  const k = ALL_KEYS.find((x) => x.code === code);
  if (!k) return null;
  return shift ? k.sh ?? null : k.ar;
}
/** Bir karakteri yazan tuş (ipucu için) */
export function keyFor(ch: string): { key: KKey; shift: boolean } | null {
  for (const k of ALL_KEYS) {
    if (k.ar === ch) return { key: k, shift: false };
    if (k.sh === ch) return { key: k, shift: true };
  }
  return null;
}

export type KbMode = 'orta' | 'ust' | 'alt' | 'hepsi' | 'kelime' | 'hareke';
export const KB_MODES: { id: KbMode; title: string; desc: string; chars?: string[] }[] = [
  { id: 'orta', title: 'Orta sıra', desc: 'Parmakların durduğu sıra: ش س ي ب ل ا ت ن م ك ط', chars: ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'] },
  { id: 'ust', title: 'Üst sıra', desc: 'ض ص ث ق ف غ ع ه خ ح ج د', chars: ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'] },
  { id: 'alt', title: 'Alt sıra', desc: 'ذ ئ ء ؤ ر ى ة و ز ظ ve لا tuşu', chars: ['ذ', 'ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'] },
  { id: 'hepsi', title: 'Bütün harfler', desc: 'Üç sıradaki bütün harfler karışık gelir.' },
  { id: 'kelime', title: 'Kelimeler', desc: 'Derslerdeki sık kelimeleri harf harf yaz.' },
  { id: 'hareke', title: 'Harekeler', desc: 'Shift ile yazılan işaretler: üstün, esre, ötre, cezm, şedde ve hemzeli elifler.', chars: ['َ', 'ِ', 'ُ', 'ْ', 'ّ', 'ً', 'ٍ', 'ٌ', 'أ', 'إ', 'آ'] }
];

/** Kelime modunda yazılan kelimeler (harekesiz) ve anlamları */
export const KB_WORDS: [string, string][] = [
  ['كتاب', 'kitap'], ['قلم', 'kalem'], ['بيت', 'ev'], ['باب', 'kapı'], ['مدرسة', 'okul'], ['طالب', 'öğrenci'], ['معلم', 'öğretmen'],
  ['سيارة', 'araba'], ['شمس', 'güneş'], ['قمر', 'ay'], ['ماء', 'su'], ['خبز', 'ekmek'], ['ولد', 'çocuk'], ['بنت', 'kız'],
  ['كبير', 'büyük'], ['صغير', 'küçük'], ['جميل', 'güzel'], ['جديد', 'yeni'], ['يوم', 'gün'], ['ليل', 'gece'], ['سلام', 'barış, selam'],
  ['شكرا', 'teşekkürler'], ['نعم', 'evet'], ['لا', 'hayır'], ['اسم', 'isim'], ['مكتب', 'büro, masa'], ['طاولة', 'masa'], ['كرسي', 'sandalye'],
  ['قهوة', 'kahve'], ['شاي', 'çay'], ['سوق', 'çarşı'], ['طريق', 'yol'], ['مدينة', 'şehir'], ['صديق', 'arkadaş'], ['عائلة', 'aile'],
  ['أب', 'baba'], ['أم', 'anne'], ['أخ', 'erkek kardeş'], ['أخت', 'kız kardeş'], ['غرفة', 'oda'], ['ظهر', 'öğle, sırt'], ['ضيف', 'misafir']
];

/** Bir turun hedefleri: harf modlarında 25 karakter (art arda aynısı gelmez), kelime modunda 8 kelime */
export function kbTargets(mode: KbMode): { text: string; tr?: string }[] {
  if (mode === 'kelime') return shuffle(KB_WORDS).slice(0, 8).map(([text, tr]) => ({ text, tr }));
  const set = mode === 'hepsi' ? KB_MODES.slice(0, 3).flatMap((m) => m.chars!) : KB_MODES.find((m) => m.id === mode)!.chars!;
  const out: string[] = [];
  while (out.length < 25) {
    const c = set[Math.floor(Math.random() * set.length)];
    if (c !== out[out.length - 1]) out.push(c);
  }
  return out.map((text) => ({ text }));
}

/**
 * Yazılan karakter hedefteki sıradaki karaktere uyuyor mu; uyuyorsa kaç karakter ilerlenir.
 * لا tuşu iki karakter yazar (ل + ا); hedefte de ayrı ayrı yazılabilir.
 */
export function advanceBy(target: string, pos: number, typed: string): number {
  if (!typed) return 0;
  return target.startsWith(typed, pos) ? typed.length : 0;
}
