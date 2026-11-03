/* Haftalık lig ve puan (XP) kuralları: tarayıcıda ve sunucuda ortak.
   Gün ve hafta Türkiye saatine göredir; hafta pazartesi başlar, pazar gece biter. */

export const XP = {
  /** Dersi ilk kez okumak */
  lesson: 20,
  /** Her etkinlik denemesi: 2 + skorun 8 katı (0-10) */
  actBase: 2,
  actScore: 8,
  /** Etkinliği ilk kez tamamlamak (%70 ve üstü) */
  actDone: 15,
  /** Listede doğru cevap başına */
  listAnswer: 1,
  /** Liste oyunu bitirmek */
  game: 5,
  /** Günlük üst sınır (hile ve aşırı tekrar için) */
  dailyCap: 1000
} as const;

export const actXp = (score: number, firstDone: boolean) => XP.actBase + Math.round(Math.max(0, Math.min(1, score)) * XP.actScore) + (firstDone ? XP.actDone : 0);

/** Türkiye saatiyle bugünün tarihi: YYYY-AA-GG */
export function trDay(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}
const parse = (day: string) => new Date(day + 'T12:00:00Z');
const fmt = (d: Date) => d.toISOString().slice(0, 10);
export function addDays(day: string, n: number) { const d = parse(day); d.setUTCDate(d.getUTCDate() + n); return fmt(d); }
/** Günün içinde bulunduğu haftanın pazartesisi */
export function weekStart(day: string) { const d = parse(day); const w = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - w); return fmt(d); }
export const weekEnd = (start: string) => addDays(start, 6);
/** Haftanın bitimine kalan gün (bugün dahil değil) */
export const daysLeft = (today: string) => 6 - Math.round((parse(today).getTime() - parse(weekStart(today)).getTime()) / 86400000);

/** Ligde görünen ad: ilk ad ve soyadın baş harfi (Efe K.) */
export function leagueName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'Öğrenci';
  return parts.length === 1 ? parts[0] : `${parts[0]} ${parts[parts.length - 1][0].toLocaleUpperCase('tr')}.`;
}

export type LeagueRow = { rank: number; userId: number; name: string; xp: number; me?: boolean };
export type LeagueBoard = { week: string; end: string; daysLeft: number; rows: LeagueRow[]; me: LeagueRow | null; hidden: boolean; lastWeek: LeagueRow[] };

/** Aynı puana aynı sıra (1, 2, 2, 4) */
export function rankRows<T extends { xp: number }>(rows: T[]): (T & { rank: number })[] {
  const sorted = [...rows].sort((a, b) => b.xp - a.xp);
  let rank = 0, prev = -1;
  return sorted.map((r, i) => { if (r.xp !== prev) { rank = i + 1; prev = r.xp; } return { ...r, rank }; });
}
