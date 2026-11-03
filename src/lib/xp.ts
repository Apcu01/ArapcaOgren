import 'server-only';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { addDays, leagueName, rankRows, trDay, weekEnd, weekStart, daysLeft, XP, type LeagueBoard, type LeagueRow } from './league';

/** Puan ekler (günlük üst sınıra kadar); hata çalışmayı bozmasın diye yutulur */
export async function addXp(userId: number, n: number) {
  if (!(n > 0)) return;
  try {
    await db.insert(schema.xpLog).values({ userId, day: trDay(), xp: Math.min(n, XP.dailyCap) })
      .onDuplicateKeyUpdate({ set: { xp: sql`LEAST(${schema.xpLog.xp} + VALUES(xp), ${XP.dailyCap})` } });
  } catch (e) {
    console.error('Puan yazılamadı:', (e as Error).message);
  }
}

/** Haftalık puanlar: verilen kullanıcılar (ya da herkes) */
async function weekXp(start: string, userIds?: number[]) {
  const end = weekEnd(start);
  if (userIds && !userIds.length) return [] as { userId: number; name: string; hidden: boolean; xp: number }[];
  const rows = await db.select({
    userId: schema.xpLog.userId, name: schema.users.name, hidden: schema.users.leagueHidden, xp: sql<number>`SUM(${schema.xpLog.xp})`
  }).from(schema.xpLog).innerJoin(schema.users, eq(schema.users.id, schema.xpLog.userId))
    .where(and(gte(schema.xpLog.day, start), lte(schema.xpLog.day, end), userIds ? inArray(schema.xpLog.userId, userIds) : undefined))
    .groupBy(schema.xpLog.userId, schema.users.name, schema.users.leagueHidden)
    .orderBy(desc(sql`SUM(${schema.xpLog.xp})`)).limit(userIds ? 500 : 1000);
  return rows.map((r) => ({ ...r, xp: Number(r.xp) }));
}

const toRows = (list: { userId: number; name: string; xp: number }[], me?: number): LeagueRow[] =>
  rankRows(list.filter((r) => r.xp > 0)).map((r) => ({ rank: r.rank, userId: r.userId, name: leagueName(r.name), xp: r.xp, ...(r.userId === me ? { me: true } : {}) }));

/**
 * Lig tablosu. members verilirse sınıf ligi (gizlilik ayarı sayılmaz, herkes sınıf arkadaşlarını görür);
 * verilmezse genel lig (adını gizleyenler tabloda yok, kendisi kendi sırasını yine görür).
 */
export async function leagueBoard(me: number | null, members?: number[], limit = 50): Promise<LeagueBoard> {
  const today = trDay();
  const week = weekStart(today);
  const [cur, last, meRow] = await Promise.all([
    weekXp(week, members),
    weekXp(addDays(week, -7), members),
    me ? db.select({ hidden: schema.users.leagueHidden }).from(schema.users).where(eq(schema.users.id, me)).limit(1) : Promise.resolve([])
  ]);
  const visible = (l: typeof cur) => (members ? l : l.filter((r) => !r.hidden));
  const all = toRows(visible(cur), me ?? undefined);
  let mine = all.find((r) => r.me) || null;
  // Adını gizleyen kendi puanını yine görür (gizliler hariç sıralamadaki yeri)
  if (!mine && me) {
    const own = cur.find((r) => r.userId === me);
    if (own && own.xp > 0) mine = { rank: all.filter((r) => r.xp > own.xp).length + 1, userId: me, name: leagueName(own.name), xp: own.xp, me: true };
  }
  return {
    week, end: weekEnd(week), daysLeft: daysLeft(today),
    rows: all.slice(0, limit), me: mine, hidden: !!meRow[0]?.hidden,
    lastWeek: toRows(visible(last), me ?? undefined).slice(0, 3)
  };
}

/** Rozetler için: toplam puan ve biten haftalarda ilk üçe girme sayısı (son 26 hafta) */
export async function xpStats(userId: number) {
  const [[tot]] = await Promise.all([
    db.select({ xp: sql<number>`COALESCE(SUM(${schema.xpLog.xp}), 0)` }).from(schema.xpLog).where(eq(schema.xpLog.userId, userId))
  ]);
  const thisWeek = weekStart(trDay());
  const from = addDays(thisWeek, -7 * 26);
  // Her haftanın puanları: kullanıcının girdiği haftalarda ilk üçte mi
  const rows = await db.select({ userId: schema.xpLog.userId, day: schema.xpLog.day, xp: schema.xpLog.xp })
    .from(schema.xpLog).innerJoin(schema.users, eq(schema.users.id, schema.xpLog.userId))
    .where(and(gte(schema.xpLog.day, from), sql`${schema.xpLog.day} < ${thisWeek}`, eq(schema.users.leagueHidden, false)));
  const weeks = new Map<string, Map<number, number>>();
  for (const r of rows) {
    const w = weekStart(r.day);
    const m = weeks.get(w) || new Map<number, number>();
    m.set(r.userId, (m.get(r.userId) || 0) + r.xp);
    weeks.set(w, m);
  }
  let podiums = 0;
  for (const m of weeks.values()) {
    if (!m.has(userId)) continue;
    const ranked = rankRows([...m.entries()].map(([u, xp]) => ({ u, xp })));
    if (ranked.find((r) => r.u === userId)!.rank <= 3) podiums++;
  }
  return { xpTotal: Number(tot?.xp || 0), podiums };
}
