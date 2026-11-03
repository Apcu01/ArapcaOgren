/* Rozetler: ilerlemeden hesaplanır, ayrıca saklanmaz (tarayıcıda ve sunucuda ortak).
   Ders, etkinlik, seri, okuma ve dikte rozetleri misafirlerde de çalışır;
   kelime listesi, canlı yarışma ve lig rozetleri hesap gerektirir. */
import type { ProgressState } from './types';
import { DICTATE_KEY } from './text';
import { READING_TOPIC } from './readings';

export type BadgeStats = {
  lessons: number; acts: number; perfect: number; streakMax: number; readings: number; dictations: number;
  /** Yalnızca üyelerde (sunucudan) */
  words?: number; lists?: number; live?: number; podiums?: number; xp?: number;
};
type Metric = keyof BadgeStats;
export type BadgeDef = { id: string; title: string; desc: string; glyph: string; metric: Metric; target: number; member?: boolean };
export type Badge = BadgeDef & { cur: number; earned: boolean; locked: boolean };

export const BADGES: BadgeDef[] = [
  { id: 'ders-1', title: 'İlk adım', desc: 'İlk dersini oku', glyph: 'أ', metric: 'lessons', target: 1 },
  { id: 'ders-5', title: 'Meraklı', desc: '5 dersin konu anlatımını oku', glyph: '٥', metric: 'lessons', target: 5 },
  { id: 'ders-10', title: 'Çalışkan öğrenci', desc: '10 dersin konu anlatımını oku', glyph: '١٠', metric: 'lessons', target: 10 },
  { id: 'ders-15', title: 'Bilge', desc: '15 dersin konu anlatımını oku', glyph: '١٥', metric: 'lessons', target: 15 },
  { id: 'etk-10', title: 'Isınma turu', desc: '10 etkinliği tamamla', glyph: '✓', metric: 'acts', target: 10 },
  { id: 'etk-50', title: 'Azimli', desc: '50 etkinliği tamamla', glyph: '✓✓', metric: 'acts', target: 50 },
  { id: 'etk-100', title: 'Usta', desc: '100 etkinliği tamamla', glyph: '١٠٠', metric: 'acts', target: 100 },
  { id: 'tam-1', title: 'Kusursuz', desc: 'Bir etkinlikte %100 al', glyph: '★', metric: 'perfect', target: 1 },
  { id: 'tam-10', title: 'Hatasız usta', desc: '10 etkinlikte %100 al', glyph: '★★', metric: 'perfect', target: 10 },
  { id: 'seri-3', title: 'Üç gün', desc: 'Art arda 3 gün çalış', glyph: '٣', metric: 'streakMax', target: 3 },
  { id: 'seri-7', title: 'Bir hafta', desc: 'Art arda 7 gün çalış', glyph: '٧', metric: 'streakMax', target: 7 },
  { id: 'seri-30', title: 'Bir ay', desc: 'Art arda 30 gün çalış', glyph: '٣٠', metric: 'streakMax', target: 30 },
  { id: 'seri-100', title: 'Yüz gün', desc: 'Art arda 100 gün çalış', glyph: '١٠٠', metric: 'streakMax', target: 100 },
  { id: 'oku-1', title: 'Okur', desc: 'Bir okuma metnini bitir (%70 ve üstü)', glyph: 'ق', metric: 'readings', target: 1 },
  { id: 'oku-4', title: 'Kitap kurdu', desc: '4 okuma metnini bitir', glyph: 'كتب', metric: 'readings', target: 4 },
  { id: 'oku-8', title: 'Hikâye avcısı', desc: '8 okuma metnini bitir', glyph: 'قصص', metric: 'readings', target: 8 },
  { id: 'dikte-1', title: 'Kulak misafiri', desc: 'Bir dikteyi bitir (%70 ve üstü)', glyph: 'س', metric: 'dictations', target: 1 },
  { id: 'dikte-5', title: 'Kulağı kesin', desc: '5 derste dikteyi bitir', glyph: 'سمع', metric: 'dictations', target: 5 },
  { id: 'kelime-25', title: 'Kelime avcısı', desc: 'Listelerinde 25 kelime öğren', glyph: 'ك', metric: 'words', target: 25, member: true },
  { id: 'kelime-100', title: 'Kelime hazinesi', desc: 'Listelerinde 100 kelime öğren', glyph: '١٠٠', metric: 'words', target: 100, member: true },
  { id: 'kelime-300', title: 'Yürüyen sözlük', desc: 'Listelerinde 300 kelime öğren', glyph: '٣٠٠', metric: 'words', target: 300, member: true },
  { id: 'liste-1', title: 'Koleksiyoncu', desc: 'İlk kelime listeni oluştur', glyph: '☰', metric: 'lists', target: 1, member: true },
  { id: 'canli-1', title: 'Yarışma sunucusu', desc: 'Bir canlı yarışma bitir (giriş yapmışken)', glyph: '⚑', metric: 'live', target: 1, member: true },
  { id: 'lig-1', title: 'Kürsüde', desc: 'Haftalık ligi ilk üçte bitir', glyph: '٣', metric: 'podiums', target: 1, member: true },
  { id: 'xp-1000', title: 'Puan avcısı', desc: 'Toplam 1.000 puan topla', glyph: '١٠٠٠', metric: 'xp', target: 1000, member: true },
  { id: 'xp-5000', title: 'Efsane', desc: 'Toplam 5.000 puan topla', glyph: '٥٠٠٠', metric: 'xp', target: 5000, member: true }
];

/** En uzun seri (art arda çalışılan gün sayısı) */
export function longestStreak(days: string[]) {
  const ts = [...new Set(days)].map((d) => Date.parse(d + 'T12:00:00Z')).filter(Number.isFinite).sort((a, b) => a - b);
  let best = 0, run = 0, prev = NaN;
  for (const t of ts) { run = t - prev === 86400000 ? run + 1 : 1; best = Math.max(best, run); prev = t; }
  return best;
}

/** İlerleme kaydından hesaplanabilen sayılar (ders, etkinlik, seri, okuma, dikte) */
export function progressStats(s: ProgressState): Omit<BadgeStats, 'words' | 'lists' | 'live' | 'podiums' | 'xp'> {
  let lessons = 0, acts = 0, perfect = 0, readings = 0, dictations = 0;
  for (const [topic, rec] of Object.entries(s.progress || {})) {
    if (topic === READING_TOPIC) { readings += Object.values(rec.acts || {}).filter((a) => a.done).length; continue; }
    if (rec.lesson) lessons++;
    for (const [key, a] of Object.entries(rec.acts || {})) {
      if (key === DICTATE_KEY) { if (a.done) dictations++; continue; }
      if (a.done) acts++;
      if (a.best >= 1) perfect++;
    }
  }
  return { lessons, acts, perfect, streakMax: longestStreak(s.days || []), readings, dictations };
}

export function evaluate(stats: BadgeStats, member: boolean): Badge[] {
  return BADGES.map((b) => {
    const v = stats[b.metric];
    const cur = typeof v === 'number' ? v : 0;
    return { ...b, cur: Math.min(cur, b.target), earned: cur >= b.target, locked: !!b.member && !member };
  });
}
