import { normAr } from './text';

/* ---------- Telaffuz karşılaştırma: tarayıcının duyduğu metin ile hedef kelime ---------- */

// Konuşma tanıma sayıları bazen rakamla yazar
const DIGITS: Record<string, string> = {
  '0': 'صفر', '1': 'واحد', '2': 'اثنان', '3': 'ثلاثه', '4': 'اربعه', '5': 'خمسه',
  '6': 'سته', '7': 'سبعه', '8': 'ثمانيه', '9': 'تسعه', '10': 'عشره'
};

/** Karşılaştırma biçimi: harekesiz, elif/te/ye farkları yok, noktalamasız, boşluksuz, baştaki ال yok */
export function pronNorm(s: string) {
  const t = String(s || '').trim().replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660));
  const v = DIGITS[t] ?? t;
  return normAr(v)
    .replace(/[^ء-ي\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length > 3 && w.startsWith('ال') ? w.slice(2) : w))
    .join('');
}

function lev(a: string, b: string) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

/** 0 ile 1 arası benzerlik; tanınan seçeneklerin en iyisi alınır */
export function pronScore(target: string, heard: string[]) {
  const t = pronNorm(target);
  if (!t) return 0;
  let best = 0;
  for (const h of heard) {
    const x = pronNorm(h);
    if (!x) continue;
    best = Math.max(best, 1 - lev(t, x) / Math.max(t.length, x.length));
  }
  return best;
}

export type PronVerdict = 'ok' | 'close' | 'bad';
export const pronVerdict = (score: number): PronVerdict => (score >= 0.99 ? 'ok' : score >= 0.75 ? 'close' : 'bad');
