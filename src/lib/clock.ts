import { shuffle } from './text';

/** Saat kadranı SVG'si (HTML dizesi) */
export function clockSVG(hm: string, size = 180) {
  const [h, m] = hm.split(':').map(Number);
  const c = size / 2;
  const ha = (((h % 12) + m / 60) * 30 - 90) * (Math.PI / 180);
  const ma = (m * 6 - 90) * (Math.PI / 180);
  let ticks = '';
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 - 90) * (Math.PI / 180);
    const big = i % 5 === 0;
    const r1 = c - 10, r2 = c - (big ? 22 : 15);
    ticks += `<line x1="${c + r1 * Math.cos(a)}" y1="${c + r1 * Math.sin(a)}" x2="${c + r2 * Math.cos(a)}" y2="${c + r2 * Math.sin(a)}" style="stroke:${big ? 'rgb(var(--c-acct))' : 'rgb(var(--c-line3))'}" stroke-width="${big ? 3 : 1.5}" stroke-linecap="round"/>`;
  }
  let nums = '';
  for (let i = 1; i <= 12; i++) {
    const a = (i * 30 - 90) * (Math.PI / 180);
    const r = c - 38;
    nums += `<text x="${c + r * Math.cos(a)}" y="${c + r * Math.sin(a)}" dy=".35em" text-anchor="middle" style="fill:rgb(var(--c-mute))" font-size="${size / 13}" font-family="Manrope, sans-serif" font-weight="600">${i}</text>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Saat ${hm}">
    <circle cx="${c}" cy="${c}" r="${c - 3}" style="fill:rgb(var(--c-s3));stroke:rgb(var(--c-line3))" stroke-width="3"/>
    ${ticks}${nums}
    <line x1="${c}" y1="${c}" x2="${c + c * 0.45 * Math.cos(ha)}" y2="${c + c * 0.45 * Math.sin(ha)}" style="stroke:rgb(var(--c-ink))" stroke-width="6" stroke-linecap="round"/>
    <line x1="${c}" y1="${c}" x2="${c + c * 0.7 * Math.cos(ma)}" y2="${c + c * 0.7 * Math.sin(ma)}" style="stroke:rgb(var(--c-acc))" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${c}" cy="${c}" r="6" style="fill:rgb(var(--c-acc))"/>
  </svg>`;
}

// Renkler style ile verilir: SVG özniteliklerinde tema değişkenleri (var) çalışmaz
/** İlerleme halkası (HTML dizesi) */
export function ring(pct: number, size = 112, stroke = 10) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const on = (c * pct) / 100;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="İlerleme yüzde ${pct}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:rgb(var(--c-track))" stroke-width="${stroke}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:${pct === 100 ? 'rgb(var(--c-ok))' : 'rgb(var(--c-acc))'}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${on} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    <text x="50%" y="50%" dy=".35em" text-anchor="middle" style="fill:rgb(var(--c-ink))" font-family="Manrope, sans-serif" font-size="${Math.round(size / 5)}" font-weight="700">%${pct}</text>
  </svg>`;
}

/* ---------- Sınırsız saat pratiği ---------- */
export type HM = { h: number; m: number };
const HOURS = ['', 'الْوَاحِدَةُ', 'الثَّانِيَةُ', 'الثَّالِثَةُ', 'الرَّابِعَةُ', 'الْخَامِسَةُ', 'السَّادِسَةُ', 'السَّابِعَةُ', 'الثَّامِنَةُ', 'التَّاسِعَةُ', 'الْعَاشِرَةُ', 'الْحَادِيَةَ عَشْرَةَ', 'الثَّانِيَةَ عَشْرَةَ'];
const TR_NOM = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on', 'on bir', 'on iki'];
const TR_ACC = ['', 'biri', 'ikiyi', 'üçü', 'dördü', 'beşi', 'altıyı', 'yediyi', 'sekizi', 'dokuzu', 'onu', 'on biri', 'on ikiyi'];
const TR_DAT = ['', 'bire', 'ikiye', 'üçe', 'dörde', 'beşe', 'altıya', 'yediye', 'sekize', 'dokuza', 'ona', 'on bire', 'on ikiye'];
const MIN_TR: Record<number, string> = { 5: 'beş', 10: 'on', 15: 'çeyrek', 20: 'yirmi', 25: 'yirmi beş', 35: 'yirmi beş', 40: 'yirmi', 45: 'çeyrek', 50: 'on', 55: 'beş' };
export const nextH = (h: number) => (h % 12) + 1;
export const fmt = (h: number, m: number) => h + ':' + String(m).padStart(2, '0');
export const hmKey = (t: HM) => t.h + ':' + t.m;

export function timeAr(h: number, m: number) {
  const H = HOURS[h], N = HOURS[nextH(h)];
  switch (m) {
    case 0: return H;
    case 5: return H + ' وَخَمْسُ دَقَائِقَ';
    case 10: return H + ' وَعَشْرُ دَقَائِقَ';
    case 15: return H + ' وَالرُّبْعُ';
    case 20: return H + ' وَالثُّلْثُ';
    case 25: return H + ' وَالنِّصْفُ إِلَّا خَمْسَ دَقَائِقَ';
    case 30: return H + ' وَالنِّصْفُ';
    case 35: return H + ' وَالنِّصْفُ وَخَمْسُ دَقَائِقَ';
    case 40: return N + ' إِلَّا ثُلْثًا';
    case 45: return N + ' إِلَّا رُبْعًا';
    case 50: return N + ' إِلَّا عَشْرَ دَقَائِقَ';
    default: return N + ' إِلَّا خَمْسَ دَقَائِقَ';
  }
}
export function timeTr(h: number, m: number) {
  if (m === 0) return 'Saat ' + TR_NOM[h] + '.';
  if (m === 30) return 'Saat ' + TR_NOM[h] + ' buçuk.';
  if (m < 30) return 'Saat ' + TR_ACC[h] + ' ' + MIN_TR[m] + ' geçiyor.';
  return 'Saat ' + TR_DAT[nextH(h)] + ' ' + MIN_TR[m] + ' var.';
}
export function timeWhy(h: number, m: number) {
  const nx = nextH(h);
  const W: Record<number, string> = {
    0: 'Tam saat: yalnızca dişil sıra sayısı söylenir.' + (h === 1 ? ' Saat bir istisnadır: {{الْوَاحِدَةُ}} ("birinci" değil).' : ''),
    5: '5 dakika geçe: {{وَ}} + {{خَمْسُ دَقَائِقَ}}. {{دَقِيقَة}} dişil olduğu için sayı ة almaz.',
    10: '10 dakika geçe: {{وَ}} + {{عَشْرُ دَقَائِقَ}}. {{دَقِيقَة}} dişil olduğu için sayı ة almaz.',
    15: '15 dakika = saatin dörtte biri: {{وَالرُّبْعُ}} (çeyrek geçe).',
    20: '20 dakika = saatin üçte biri: {{وَالثُّلْثُ}}.',
    25: '25 geçe Arapçada genelde "buçuğa beş var" diye söylenir: {{وَالنِّصْفُ إِلَّا خَمْسَ دَقَائِقَ}}.',
    30: 'Buçuk: {{وَالنِّصْفُ}} (yarım).',
    35: '35 geçe "buçuğu beş geçiyor" diye söylenir: {{وَالنِّصْفُ وَخَمْسُ دَقَائِقَ}}.',
    40: '40 dakika: bir sonraki saate (' + nx + ') yirmi var: {{إِلَّا ثُلْثًا}}.',
    45: 'Çeyrek kala: bir sonraki saat (' + nx + ') + {{إِلَّا رُبْعًا}}. Saati ' + h + ' değil ' + nx + ' söylemelisin.',
    50: '50 dakika: bir sonraki saate (' + nx + ') on var: {{إِلَّا عَشْرَ دَقَائِقَ}} ({{إِلَّا}} kelimesinden sonra üstün gelir).',
    55: '55 dakika: bir sonraki saate (' + nx + ') beş var: {{إِلَّا خَمْسَ دَقَائِقَ}}.'
  };
  return W[m];
}
export function randTime(avoid?: string | null): HM {
  let t: HM;
  do { t = { h: 1 + Math.floor(Math.random() * 12), m: 5 * Math.floor(Math.random() * 12) }; } while (avoid && hmKey(t) === avoid);
  return t;
}
// Öğretici çeldiriciler: komşu saat (kala/geçe karışıklığı), ayna dakika (15↔45), yakın dakikalar
export function distractors(t: HM): HM[] {
  const mir: Record<number, number> = { 0: 0, 5: 55, 10: 50, 15: 45, 20: 40, 25: 35, 30: 30, 35: 25, 40: 20, 45: 15, 50: 10, 55: 5 };
  const nx = nextH(t.h), pv = ((t.h + 10) % 12) + 1;
  const cand = shuffle<[number, number]>([[nx, t.m], [pv, t.m], [t.h, mir[t.m]], [nx, mir[t.m]], [pv, mir[t.m]], [t.h, (t.m + 15) % 60], [t.h, (t.m + 5) % 60], [t.h, (t.m + 55) % 60], [t.h, (t.m + 30) % 60]])
    .map(([h, m]) => ({ h, m }));
  const seen = new Set([hmKey(t)]);
  const out: HM[] = [];
  for (const c of cand) { if (!seen.has(hmKey(c))) { seen.add(hmKey(c)); out.push(c); } if (out.length === 3) break; }
  while (out.length < 3) { const r = randTime(); if (!seen.has(hmKey(r))) { seen.add(hmKey(r)); out.push(r); } }
  return out;
}
