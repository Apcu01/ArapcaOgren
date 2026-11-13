/* Harekeleme alıştırması: harekeli kelimeyi harf harf ayırır; harekesi olan harfler sorulur,
   uzatma harfleri (harekesiz elif, vav, ye) ve ötreli üstün elif gibi işaretler verili gelir. */

export const FATHA = 'َ', KASRA = 'ِ', DAMMA = 'ُ', SUKUN = 'ْ', SHADDA = 'ّ';
export const TAN_F = 'ً', TAN_D = 'ٌ', TAN_K = 'ٍ';
const ASKED = new Set([FATHA, KASRA, DAMMA, SUKUN, SHADDA, TAN_F, TAN_D, TAN_K]);
/** Sorulmayan ama gösterilen işaretler (ötreli elif, kısa elif işareti, vasla) */
const KEEP = /[ٰٕٓٔ]/;
const MARK = /[ً-ٰٕ]/;

/** Seçilebilen harekeler (şedde ayrıca eklenir) */
export const VOWELS: [string, string][] = [[FATHA, 'üstün'], [KASRA, 'esre'], [DAMMA, 'ötre'], [SUKUN, 'cezm'], [TAN_F, 'iki üstün'], [TAN_K, 'iki esre'], [TAN_D, 'iki ötre']];

export type Slot = { letter: string; /** sorulan işaretler (normalleştirilmiş) */ marks: string; /** verili işaretler */ keep: string; asked: boolean };

/** İşaretleri tek biçime getirir: şedde önce, sonra hareke */
export const normMarks = (m: string) => [...m].filter((c) => ASKED.has(c)).sort((a, b) => (a === SHADDA ? -1 : b === SHADDA ? 1 : 0)).join('');

export function slots(word: string): Slot[] {
  const out: Slot[] = [];
  for (const ch of word.normalize('NFC')) {
    if (MARK.test(ch)) {
      const s = out[out.length - 1];
      if (!s) continue;
      if (ASKED.has(ch)) s.marks += ch; else if (KEEP.test(ch)) s.keep += ch;
      continue;
    }
    out.push({ letter: ch, marks: '', keep: '', asked: false });
  }
  for (const s of out) { s.marks = normMarks(s.marks); s.asked = !!s.marks && /[ء-يٱ]/.test(s.letter); }
  return out;
}

/** Harflerden ve seçilen işaretlerden kelimeyi yeniden kurar */
export const build = (ss: Slot[], chosen?: string[]) => ss.map((s, i) => s.letter + (s.asked ? (chosen ? chosen[i] || '' : s.marks) : s.marks) + s.keep).join('');

/** Sorulacak harf sayısı (alıştırmaya uygunluk için) */
export const askedCount = (word: string) => slots(word).filter((s) => s.asked).length;

/** Seçime şedde ekler / kaldırır, harekeyi değiştirir (şedde korunur) */
export function applyMark(cur: string, mark: string) {
  const hasShadda = cur.includes(SHADDA);
  if (mark === SHADDA) return normMarks(hasShadda ? cur.replace(SHADDA, '') : SHADDA + cur.replace(SUKUN, ''));
  // Cezmin şeddeyle birlikte olmaz
  if (mark === SUKUN) return SUKUN;
  return normMarks((hasShadda ? SHADDA : '') + mark);
}

/** Her sorulan harf için doğru mu; hepsi doğruysa ok */
export function grade(ss: Slot[], chosen: string[]) {
  const per = ss.map((s, i) => !s.asked || normMarks(chosen[i] || '') === s.marks);
  return { per, ok: per.every(Boolean), right: ss.filter((s, i) => s.asked && per[i]).length, total: ss.filter((s) => s.asked).length };
}
