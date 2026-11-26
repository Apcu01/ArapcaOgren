/* ---------- Ek alıştırmalar: benzer sesler, Arapça rakamlar ve sayılar, zıt ve eş anlamlılar ----------
   Sınırsız pratikteki gibi kodla üretilir; dinleme sorularındaki her ifadenin sesi kayıtlıdır (scripts/audio-texts.ts). */
import { shuffle } from './text';
import type { EQ } from './endless';
import { loanQ } from './loanwords';

const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
const chance = (p: number) => Math.random() < p;
const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr') + s.slice(1);

/* ================= Benzer sesler ================= */
export type SoundGroup = { id: string; title: string; letters: string[]; hint: string; pairs: [string, string, string, string][] };

/** Türklerin en çok karıştırdığı sesler; her çiftte yalnızca o ses farklıdır: [kelime 1, anlamı, kelime 2, anlamı] */
export const SOUND_GROUPS: SoundGroup[] = [
  { id: 'ha', title: 'ح ve ه', letters: ['ح', 'ه'], hint: 'ح boğazın ortasından, nefesli ve sert bir h; ه göğüsten çıkan hafif bir nefes, Türkçedeki h.',
    pairs: [['حَرَم', 'kutsal alan', 'هَرَم', 'piramit'], ['نَحْر', 'gerdan', 'نَهْر', 'nehir'], ['فَحْم', 'kömür', 'فَهْم', 'anlayış'], ['سَحَر', 'seher vakti', 'سَهَر', 'geceyi uyanık geçirme']] },
  { id: 'hi', title: 'ح ve خ', letters: ['ح', 'خ'], hint: 'ح hırıltısız, nefesli bir h; خ gırtlağın üstünden hırıltılı çıkar (Almanca "Bach").',
    pairs: [['حَال', 'durum', 'خَال', 'dayı'], ['حَلَقَ', 'tıraş etti', 'خَلَقَ', 'yarattı'], ['حَدّ', 'sınır', 'خَدّ', 'yanak'], ['نَحْل', 'arılar', 'نَخْل', 'hurma ağaçları']] },
  { id: 'kaf', title: 'ق ve ك', letters: ['ق', 'ك'], hint: 'ق dilin en arkasıyla, kalın bir k; ك Türkçedeki ince k.',
    pairs: [['قَلْب', 'kalp', 'كَلْب', 'köpek'], ['قُلْ', 'söyle', 'كُلْ', 'ye'], ['قَلَّ', 'azaldı', 'كَلَّ', 'yoruldu']] },
  { id: 'sad', title: 'س ve ص', letters: ['س', 'ص'], hint: 'س ince bir s; ص ağzı doldurarak kalın söylenir ve yanındaki ünlüyü de kalınlaştırır.',
    pairs: [['سَيْف', 'kılıç', 'صَيْف', 'yaz'], ['سَارَ', 'yürüdü', 'صَارَ', 'oldu'], ['سُورَة', 'sure', 'صُورَة', 'resim'], ['نَسْر', 'kartal', 'نَصْر', 'zafer']] },
  { id: 'ti', title: 'ت ve ط', letters: ['ت', 'ط'], hint: 'ت ince bir t; ط dil damağa yapışarak kalın söylenir.',
    pairs: [['تِين', 'incir', 'طِين', 'çamur'], ['تَابَ', 'tövbe etti', 'طَابَ', 'hoş oldu'], ['فَتَرَ', 'gevşedi', 'فَطَرَ', 'yarattı']] },
  { id: 'dad', title: 'د ve ض', letters: ['د', 'ض'], hint: 'د Türkçedeki d; ض ağzı dolduran kalın bir d.',
    pairs: [['دَلَّ', 'yol gösterdi', 'ضَلَّ', 'yolunu kaybetti'], ['هَدَمَ', 'yıktı', 'هَضَمَ', 'sindirdi'], ['دَرْب', 'yol', 'ضَرْب', 'vurma']] },
  { id: 'zel', title: 'ذ, ز ve ظ', letters: ['ذ', 'ز', 'ظ'], hint: 'ز Türkçedeki z; ذ dil ucu dişlerin arasındayken söylenir (İngilizce "this"); ظ bunun kalın hâli.',
    pairs: [['ذَلَّ', 'alçaldı', 'زَلَّ', 'kaydı'], ['ذَلَّ', 'alçaldı', 'ظَلَّ', 'devam etti'], ['زَلَّ', 'kaydı', 'ظَلَّ', 'devam etti'], ['نَذَرَ', 'adadı', 'نَظَرَ', 'baktı'], ['زَهْر', 'çiçekler', 'ظَهْر', 'sırt']] },
  { id: 'se', title: 'ث ve س', letters: ['ث', 'س'], hint: 'س ince bir s; ث dil ucu dişlerin arasındayken söylenen peltek s (İngilizce "think").',
    pairs: [['ثَارَ', 'ayaklandı', 'سَارَ', 'yürüdü'], ['ثَمِين', 'değerli', 'سَمِين', 'şişman'], ['ثَمَر', 'meyve', 'سَمَر', 'gece sohbeti']] },
  { id: 'ayn', title: 'ع ve ء', letters: ['ع', 'ء'], hint: 'ء (hemze) kısa bir kesilmedir; ع gırtlağı sıkarak çıkan, Türkçede olmayan bir ses.',
    pairs: [['عَمَل', 'iş', 'أَمَل', 'umut'], ['سَعَلَ', 'öksürdü', 'سَأَلَ', 'sordu'], ['عَلِمَ', 'bildi', 'أَلِمَ', 'acı çekti']] },
  { id: 'gayn', title: 'غ ve خ', letters: ['غ', 'خ'], hint: 'خ hırıltılı ve titreşimsiz; غ aynı yerden gargara yapar gibi titreşimli söylenir.',
    pairs: [['غَيْر', 'başka', 'خَيْر', 'iyilik'], ['غَالٍ', 'pahalı', 'خَالٍ', 'boş']] },
  { id: 'uzun', title: 'Kısa ve uzun ünlü', letters: [], hint: 'Uzatma harfi (ا و ي) ünlüyü iki kat uzatır ve çoğu zaman anlamı değiştirir.',
    pairs: [['عَلَم', 'bayrak', 'عَالَم', 'dünya'], ['كَتَبَ', 'yazdı', 'كَاتَبَ', 'yazıştı'], ['جَمَل', 'deve', 'جَمَال', 'güzellik']] },
  { id: 'sedde', title: 'Şeddeli ve şeddesiz', letters: [], hint: 'Şedde harfi iki kez okutur; anlam çoğu zaman değişir.',
    pairs: [['دَرَسَ', 'ders çalıştı', 'دَرَّسَ', 'ders verdi'], ['كَسَرَ', 'kırdı', 'كَسَّرَ', 'paramparça etti'], ['قَطَعَ', 'kesti', 'قَطَّعَ', 'doğradı']] }
];

const LETTER_NAME: Record<string, string> = { 'ح': 'ha', 'ه': 'he', 'خ': 'hı', 'ق': 'kaf', 'ك': 'kef', 'س': 'sin', 'ص': 'sad', 'ت': 'te', 'ط': 'tı', 'د': 'dal', 'ض': 'dad', 'ذ': 'zel', 'ز': 'ze', 'ظ': 'zı', 'ث': 'se', 'ع': 'ayn', 'ء': 'hemze', 'غ': 'gayn' };
/** Kelimede gruptaki hangi harf geçiyor (hemze, elif üstünde de olabilir) */
const letterIn = (w: string, letters: string[]) => letters.find((l) => (l === 'ء' ? /[ءأإآؤئ]/.test(w) : w.includes(l)));

function sesQ(): EQ {
  const gr = pick(SOUND_GROUPS);
  const [a1, t1, a2, t2] = pick(gr.pairs);
  const first = chance(0.5);
  const [ar, tr, other, otr] = first ? [a1, t1, a2, t2] : [a2, t2, a1, t1];
  const why = `{{${a1}}} "${t1}", {{${a2}}} "${t2}" demek. ${gr.hint}`;
  const g = 'ses-' + gr.id;
  // Bazen harfi sorar: "Hangi harfi duydun?"
  const letter = gr.letters.length ? letterIn(ar, gr.letters) : undefined;
  if (letter && chance(0.35)) {
    const opts = shuffle(gr.letters);
    return { key: 'ses-h' + ar, kind: 'ses-harf', label: 'Benzer sesler: ' + gr.title, g, prompt: 'Dinle: kelimede hangi harfi duydun?', ar, listen: true,
      options: opts, optAr: true, a: letter, full: ar, fullTr: tr, why: `{{${ar}}} kelimesinde ${LETTER_NAME[letter]} ({{${letter}}}) var. ${why}` };
  }
  // Üçlü grupta (ذ ز ظ) üçüncü kelime de seçeneklere girebilir
  const extra = gr.id === 'zel' ? gr.pairs.flatMap((p) => [p[0], p[2]]).filter((w) => w !== ar && w !== other && w.slice(1) === ar.slice(1)) : [];
  return { key: 'ses-d' + ar, kind: 'ses-dinle', label: 'Benzer sesler: ' + gr.title, g, prompt: 'Dinle: hangi kelimeyi duydun?', ar, listen: true,
    options: shuffle([ar, other, ...extra.slice(0, 1)]), optAr: true, a: ar, full: ar, fullTr: `${cap(tr)} (öbürü: ${otr})`, why };
}

/* ================= Arapça rakamlar ve sayılar ================= */
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
/** 345 -> ٣٤٥ (Arapça rakamlar da soldan sağa yazılır) */
export const toArDigits = (s: string | number) => String(s).replace(/[0-9]/g, (d) => AR_DIGITS[+d]);
/** Yazılan cevaptaki Arapça ya da Farsça rakamları Latin rakama çevirir, rakam dışındakileri atar */
export const normDigits = (s: string) => s.replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d))).replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[^0-9]/g, '');

export const DIGIT_WORDS = ['صِفْر', 'وَاحِد', 'اِثْنَان', 'ثَلَاثَة', 'أَرْبَعَة', 'خَمْسَة', 'سِتَّة', 'سَبْعَة', 'ثَمَانِيَة', 'تِسْعَة'];
export const DIGIT_TR = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const TEENS = ['عَشَرَة', 'أَحَدَ عَشَرَ', 'اِثْنَا عَشَرَ', 'ثَلَاثَةَ عَشَرَ', 'أَرْبَعَةَ عَشَرَ', 'خَمْسَةَ عَشَرَ', 'سِتَّةَ عَشَرَ', 'سَبْعَةَ عَشَرَ', 'ثَمَانِيَةَ عَشَرَ', 'تِسْعَةَ عَشَرَ'];
const TENS = ['', '', 'عِشْرُونَ', 'ثَلَاثُونَ', 'أَرْبَعُونَ', 'خَمْسُونَ', 'سِتُّونَ', 'سَبْعُونَ', 'ثَمَانُونَ', 'تِسْعُونَ'];
// Bileşik sayılarda birler önce gelir ve yalın hâl alır: خَمْسَةٌ وَعِشْرُونَ (beş ve yirmi)
const UNITS_C = ['', 'وَاحِدٌ', 'اِثْنَانِ', 'ثَلَاثَةٌ', 'أَرْبَعَةٌ', 'خَمْسَةٌ', 'سِتَّةٌ', 'سَبْعَةٌ', 'ثَمَانِيَةٌ', 'تِسْعَةٌ'];

/** 0-100 arası sayının Arapçası (sayarken söylendiği gibi) */
export function numAr(n: number): string {
  if (n < 10) return DIGIT_WORDS[n];
  if (n < 20) return TEENS[n - 10];
  if (n === 100) return 'مِئَة';
  const t = Math.floor(n / 10), u = n % 10;
  return u ? `${UNITS_C[u]} وَ${TENS[t]}` : TENS[t];
}

/** Fiyat: sayılan isim sayıya göre değişir (1-2 tekil/ikil, 3-10 çoğul, 11-99 tekil ve üstün, 100 tamlama) */
export function priceAr(n: number): string {
  if (n === 1) return 'رِيَالٌ وَاحِدٌ';
  if (n === 2) return 'رِيَالَانِ';
  if (n <= 10) return `${n === 10 ? 'عَشَرَةُ' : DIGIT_WORDS[n] + 'ُ'} رِيَالَاتٍ`;
  if (n === 100) return 'مِئَةُ رِيَالٍ';
  const base = n < 20 ? TEENS[n - 10] : numAr(n);
  return `${base} رِيَالًا`;
}
export const PRICES = [1, 2, 3, 5, 7, 10, 11, 12, 15, 18, 20, 25, 30, 40, 45, 50, 60, 75, 90, 99, 100];
const priceWhy = (n: number) =>
  n === 1 ? 'Birde isim tekil olur, sayı isimden sonra gelir: رِيَالٌ وَاحِدٌ.'
    : n === 2 ? 'İkide ismin ikil hâli yeter: رِيَالَانِ (iki riyal).'
    : n <= 10 ? '3 ile 10 arasında sayılan isim çoğul olur: رِيَالَاتٍ.'
      : n === 100 ? 'Yüzden sonra isim tekil gelir: مِئَةُ رِيَالٍ.'
        : '11 ile 99 arasında sayılan isim tekil ve üstünlü olur: رِيَالًا.';

/** Görünüşü karışan rakamlar: ٢-٣, ٤-٦, ٥-٠, ٧-٨, ٦-٩ */
const LOOK: Record<string, string> = { '2': '3', '3': '2', '4': '6', '6': '4', '5': '0', '0': '5', '7': '8', '8': '7', '9': '6', '1': '9' };
function digitDistractors(s: string): string[] {
  const out = new Set<string>();
  const rev = [...s].reverse().join('');
  if (rev !== s && rev[0] !== '0') out.add(rev);
  for (let k = 0; k < 12 && out.size < 6; k++) {
    const i = Math.floor(Math.random() * s.length), c = s[i];
    const swap = chance(0.7) && LOOK[c] ? LOOK[c] : String((+c + 1 + Math.floor(Math.random() * 8)) % 10);
    const v = s.slice(0, i) + swap + s.slice(i + 1);
    if (v !== s && v[0] !== '0') out.add(v);
  }
  // Rakamları aynı sayılarda (55, 777) yukarıdakiler çoğu zaman tek seçenek bulur: komşu sayılarla tamamlanır
  for (let d = 1; out.size < 3 && d < 30; d++) {
    for (const v of [String(+s + d), String(+s - d)]) if (v.length === s.length && v[0] !== '0') out.add(v);
  }
  return shuffle([...out]).slice(0, 3);
}
const randNum = () => { const len = pick([2, 2, 3, 3, 4]); let s = String(1 + Math.floor(Math.random() * 9)); while (s.length < len) s += Math.floor(Math.random() * 10); return s; };

function rakamQ(): EQ {
  const kind = pick(['oku', 'oku', 'yaz', 'yaz', 'dinle', 'dinle', 'telefon', 'fiyat']);
  const g = kind === 'oku' || kind === 'yaz' ? 'rakam' : 'sayi';
  if (kind === 'oku' || kind === 'yaz') {
    const s = randNum(), ar = toArDigits(s), wrong = digitDistractors(s);
    const why = `${[...s].map((d) => `{{${toArDigits(d)}}} = ${d}`).join(', ')}. Arapça rakamlar da soldan sağa okunur.`;
    const say = +s <= 100 ? numAr(+s) : null;
    if (kind === 'oku') return { key: 'r-oku' + s, kind: 'rakam-oku', label: 'Rakam okuma', g, prompt: 'Bu sayı kaç?', ar, options: shuffle([s, ...wrong]), optAr: false, a: s, full: ar, fullTr: s, say, why };
    return { key: 'r-yaz' + s, kind: 'rakam-yaz', label: 'Rakamla yazma', g, prompt: 'Bu sayının Arapça rakamlarla yazılışı hangisi?', tr: s, options: shuffle([ar, ...wrong.map(toArDigits)]), optAr: true, a: ar, full: ar, fullTr: s, say, why };
  }
  if (kind === 'telefon') {
    // Telefon numarası rakam rakam okunur
    const s = '5' + Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    const seq = [...s].map((d) => DIGIT_WORDS[+d]);
    return { key: 'r-tel' + s, kind: 'rakam-telefon', label: 'Telefon numarası dinleme', g, prompt: 'Dinle: telefon numarasını rakamlarla yaz.', ar: seq.join(' '), listen: true, seq, input: 'digits', alt: digitDistractors(s),
      options: [], optAr: false, a: s, full: toArDigits(s), fullTr: s.replace(/^(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3'), say: null,
      why: 'Rakamlar tek tek okundu: ' + [...s].map((d) => `{{${DIGIT_WORDS[+d]}}} ${d}`).join(', ') + '.' };
  }
  if (kind === 'fiyat') {
    const n = pick(PRICES), ar = priceAr(n);
    return { key: 'r-fiyat' + n, kind: 'rakam-fiyat', label: 'Fiyat dinleme', g, prompt: 'Dinle: kaç riyal? Rakamla yaz.', ar, listen: true, input: 'digits', alt: shuffle(PRICES.filter((x) => x !== n)).slice(0, 3).map(String),
      options: [], optAr: false, a: String(n), full: ar, fullTr: `${n} riyal`, why: priceWhy(n) };
  }
  const n = Math.floor(Math.random() * 101), ar = numAr(n);
  const why = n > 20 && n % 10 ? `Bileşik sayılarda önce birler, sonra onlar söylenir: {{${UNITS_C[n % 10]}}} (${n % 10}) {{وَ}} (ve) {{${TENS[Math.floor(n / 10)]}}} (${Math.floor(n / 10) * 10}).` : `{{${ar}}} = ${n}.`;
  const near = n >= 10 ? digitDistractors(String(n)) : shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x !== n)).slice(0, 3).map(String);
  return { key: 'r-dinle' + n, kind: 'rakam-dinle', label: 'Sayı dinleme', g, prompt: 'Dinle: hangi sayıyı duydun? Rakamla yaz.', ar, listen: true, input: 'digits', alt: near,
    options: [], optAr: false, a: String(n), full: ar, fullTr: String(n), why };
}

/** Ses üretimi: dinleme sorularında okunan sayılar ve fiyatlar */
export function numberTexts(): string[] {
  return [...Array.from({ length: 101 }, (_, n) => numAr(n)), ...PRICES.map(priceAr)];
}

/* ================= Zıt ve eş anlamlılar ================= */
/** [kelime, anlamı, karşılığı, anlamı] */
export type WordPair = [string, string, string, string];

export const ANTONYMS: WordPair[] = [
  ['كَبِير', 'büyük', 'صَغِير', 'küçük'], ['جَدِيد', 'yeni', 'قَدِيم', 'eski'], ['طَوِيل', 'uzun', 'قَصِير', 'kısa'],
  ['كَثِير', 'çok', 'قَلِيل', 'az'], ['سَهْل', 'kolay', 'صَعْب', 'zor'], ['قَرِيب', 'yakın', 'بَعِيد', 'uzak'],
  ['قَوِيّ', 'güçlü', 'ضَعِيف', 'güçsüz'], ['سَمِين', 'şişman', 'نَحِيف', 'zayıf'], ['غَنِيّ', 'zengin', 'فَقِير', 'fakir'],
  ['حَارّ', 'sıcak', 'بَارِد', 'soğuk'], ['سَرِيع', 'hızlı', 'بَطِيء', 'yavaş'], ['ثَقِيل', 'ağır', 'خَفِيف', 'hafif'],
  ['نَظِيف', 'temiz', 'وَسِخ', 'kirli'], ['جَمِيل', 'güzel', 'قَبِيح', 'çirkin'], ['أَبْيَض', 'beyaz', 'أَسْوَد', 'siyah'],
  ['مَفْتُوح', 'açık', 'مُغْلَق', 'kapalı'], ['سَعِيد', 'mutlu', 'حَزِين', 'üzgün'], ['كَرِيم', 'cömert', 'بَخِيل', 'cimri'],
  ['صَدِيق', 'dost', 'عَدُوّ', 'düşman'], ['أَوَّل', 'ilk', 'آخِر', 'son'], ['قَبْلَ', 'önce', 'بَعْدَ', 'sonra'],
  ['فَوْقَ', 'üstünde', 'تَحْتَ', 'altında'], ['يَمِين', 'sağ', 'يَسَار', 'sol'], ['لَيْل', 'gece', 'نَهَار', 'gündüz'],
  ['صَبَاح', 'sabah', 'مَسَاء', 'akşam'], ['شِتَاء', 'kış', 'صَيْف', 'yaz'], ['وَاسِع', 'geniş', 'ضَيِّق', 'dar'],
  ['حُلْو', 'tatlı', 'مُرّ', 'acı'], ['صَحِيح', 'doğru', 'خَاطِئ', 'yanlış'], ['رَخِيص', 'ucuz', 'غَالٍ', 'pahalı'],
  ['مَرِيض', 'hasta', 'سَلِيم', 'sağlıklı'], ['شُجَاع', 'cesur', 'جَبَان', 'korkak'], ['مُبَكِّر', 'erken', 'مُتَأَخِّر', 'geç kalmış'],
  ['مُمِلّ', 'sıkıcı', 'مُمْتِع', 'eğlenceli'], ['دَخَلَ', 'girdi', 'خَرَجَ', 'çıktı'], ['جَلَسَ', 'oturdu', 'قَامَ', 'ayağa kalktı'],
  ['نَامَ', 'uyudu', 'اِسْتَيْقَظَ', 'uyandı'], ['أَعْطَى', 'verdi', 'أَخَذَ', 'aldı'], ['فَتَحَ', 'açtı', 'أَغْلَقَ', 'kapattı'],
  ['ذَهَبَ', 'gitti', 'رَجَعَ', 'döndü'], ['بَدَأَ', 'başladı', 'اِنْتَهَى', 'bitti'], ['نَسِيَ', 'unuttu', 'تَذَكَّرَ', 'hatırladı'],
  ['ضَحِكَ', 'güldü', 'بَكَى', 'ağladı'], ['صَعِدَ', 'yukarı çıktı', 'نَزَلَ', 'indi'], ['بَاعَ', 'sattı', 'اِشْتَرَى', 'satın aldı'],
  ['أَحَبَّ', 'sevdi', 'كَرِهَ', 'nefret etti'], ['نَجَحَ', 'başardı', 'فَشِلَ', 'başaramadı'], ['نَعَمْ', 'evet', 'لَا', 'hayır']
];

export const SYNONYMS: WordPair[] = [
  ['جَمِيل', 'güzel', 'حَسَن', 'güzel, iyi'], ['جَدِيد', 'yeni', 'حَدِيث', 'yeni, modern'], ['بَيْت', 'ev', 'مَنْزِل', 'ev, konut'],
  ['طَرِيق', 'yol', 'شَارِع', 'cadde'], ['عَمَل', 'iş', 'وَظِيفَة', 'görev, iş'], ['طَبِيب', 'doktor', 'دُكْتُور', 'doktor'],
  ['كَلَام', 'söz', 'قَوْل', 'söz, ifade'], ['دُكَّان', 'dükkân', 'مَتْجَر', 'mağaza'], ['خَوْف', 'korku', 'رُعْب', 'dehşet'],
  ['جَاهِز', 'hazır', 'مُسْتَعِدّ', 'hazır'], ['صَفّ', 'sınıf', 'فَصْل', 'sınıf'], ['أَمَل', 'umut', 'رَجَاء', 'umut, rica'],
  ['دَوَاء', 'ilaç', 'عِلَاج', 'tedavi, ilaç'], ['عَجُوز', 'yaşlı', 'مُسِنّ', 'yaşlı'], ['سَعِيد', 'mutlu', 'مَسْرُور', 'memnun, mutlu'],
  ['وَالِد', 'baba', 'أَب', 'baba'], ['وَالِدَة', 'anne', 'أُمّ', 'anne'], ['وَلَد', 'çocuk', 'طِفْل', 'çocuk'],
  ['كَبِير', 'büyük', 'ضَخْم', 'iri, kocaman'], ['سَيَّارَة', 'araba', 'عَرَبَة', 'araba'], ['مُعَلِّم', 'öğretmen', 'مُدَرِّس', 'öğretmen'],
  ['قَلَق', 'endişe', 'اِضْطِرَاب', 'kaygı'], ['حَادِث', 'kaza, olay', 'وَاقِعَة', 'olay'], ['بَدَأَ', 'başladı', 'شَرَعَ', 'başladı, girişti'],
  ['رَجَعَ', 'döndü', 'عَادَ', 'geri geldi'], ['جَلَسَ', 'oturdu', 'قَعَدَ', 'oturdu'], ['فَهِمَ', 'anladı', 'أَدْرَكَ', 'kavradı'],
  ['رَأَى', 'gördü', 'شَاهَدَ', 'izledi, gördü'], ['أَرَادَ', 'istedi', 'رَغِبَ', 'arzu etti'], ['شَكَرَ', 'teşekkür etti', 'حَمِدَ', 'övdü, şükretti']
];

type Side = { ar: string; tr: string };
const sides = (list: WordPair[]): Side[] => list.flatMap(([a, at, b, bt]) => [{ ar: a, tr: at }, { ar: b, tr: bt }]);
/** Aynı türden çeldirici: fiil için fiiller (geçmiş zaman, sonu üstün), isim/sıfat için ötekiler */
const isVerb = (w: string) => /َ$/.test(w) || /ى$/.test(w);

function pairQ(type: 'zit' | 'es'): EQ {
  const list = type === 'zit' ? ANTONYMS : SYNONYMS;
  const [a, at, b, bt] = pick(list);
  const rev = chance(0.5);
  const [w, wt, ans, anst] = rev ? [b, bt, a, at] : [a, at, b, bt];
  const name = type === 'zit' ? 'zıt anlamlısı' : 'eş anlamlısı';
  // Çeldiriciler: aynı türden, cevapla ve kelimeyle aynı anlama gelmeyen kelimeler
  const pool = sides([...ANTONYMS, ...SYNONYMS]).filter((x) => x.ar !== w && x.ar !== ans && x.tr !== anst && x.tr !== wt && isVerb(x.ar) === isVerb(ans));
  const others = [...new Set(shuffle(pool).map((x) => x.ar))].slice(0, 3);
  const g = type;
  const why = type === 'zit' ? `{{${w}}} "${wt}", zıttı {{${ans}}} "${anst}".` : `{{${w}}} "${wt}" ile {{${ans}}} "${anst}" aynı anlama gelir.`;
  const full = `${w} ${type === 'zit' ? '↔' : '='} ${ans}`;
  if (chance(0.3)) {
    // Türkçesinden: "büyük" kelimesinin zıttının Arapçası
    return { key: type + '-tr' + w, kind: type + '-tr', label: type === 'zit' ? 'Zıt anlamlı (Türkçeden)' : 'Eş anlamlı (Türkçeden)', g,
      prompt: type === 'zit' ? `"${cap(wt)}" kelimesinin zıttı olan Arapça kelime hangisi?` : `"${cap(wt)}" anlamına gelen {{${w}}} kelimesinin eş anlamlısı hangisi?`,
      tr: type === 'zit' ? `${cap(wt)} ↔ ?` : `${cap(wt)} = ?`, options: shuffle([ans, ...others]), optAr: true, a: ans, full, fullTr: `${wt} ${type === 'zit' ? '↔' : '='} ${anst}`, say: ans, why };
  }
  return { key: type + '-ar' + w, kind: type + '-ar', label: type === 'zit' ? 'Zıt anlamlısını bul' : 'Eş anlamlısını bul', g,
    prompt: `Bu kelimenin ${name} hangisi? (${wt})`, ar: w, options: shuffle([ans, ...others]), optAr: true, a: ans, full, fullTr: `${wt} ${type === 'zit' ? '↔' : '='} ${anst}`, say: ans, why };
}

/** Zıt ve eş anlamlılar sayfasındaki eşleştirme oyunu için rastgele çiftler */
export const pairItems = (type: 'zit' | 'es', n = 10): [string, string][] => shuffle(type === 'zit' ? ANTONYMS : SYNONYMS).slice(0, n).map(([a, , b]) => [a, b]);

/** Zıt ve eş anlamlı kelimelerin hepsi (ses üretimi) */
export function pairTexts(): string[] {
  return [...new Set(sides([...ANTONYMS, ...SYNONYMS]).map((x) => x.ar))];
}
export function soundTexts(): string[] {
  return [...new Set(SOUND_GROUPS.flatMap((g) => g.pairs.flatMap((p) => [p[0], p[2]])))];
}

/** Sözde ders kimlikleri: ilerleme ve Hatalarım bu adlarla tutulur */
export const DRILLS: Record<string, { name: string; gen: () => EQ }> = {
  sesler: { name: 'Benzer sesler', gen: sesQ },
  rakamlar: { name: 'Rakamlar ve sayılar', gen: rakamQ },
  zitlar: { name: 'Zıt ve eş anlamlılar', gen: () => pairQ(chance(0.6) ? 'zit' : 'es') },
  turkce: { name: 'Türkçedeki Arapça kelimeler', gen: loanQ }
};
export { rakamQ };
