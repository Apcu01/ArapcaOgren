import 'server-only';
import { desc, eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db';

const G = schema.lookupLog;

export const SOURCE_LABEL: Record<string, string> = {
  lesson: 'Derslerde', lexicon: 'Yerleşik sözlük', cache: 'Yapay zekâ önbelleği', ai: 'Yapay zekâ',
  login: 'Bulunamadı (misafir)', none: 'Bulunamadı', error: 'Hata'
};
/** Ücretsiz kaynaklarda olmayan aramalar: yerleşik sözlüğe eklenmeye aday */
const MISSING = sql`${G.source} IN ('login', 'none', 'error', 'ai', 'cache')`;

export async function lookupStats(q: string) {
  const search = q ? sql`(${G.query} LIKE ${'%' + q.replace(/[%_\\]/g, (c) => '\\' + c) + '%'} OR ${G.resultTr} LIKE ${'%' + q + '%'})` : sql`1 = 1`;
  const [[tot], bySource, top, missing, recent] = await Promise.all([
    db.select({
      n: sql<number>`COUNT(*)`,
      today: sql<number>`COALESCE(SUM(${G.createdAt} >= UTC_DATE()), 0)`,
      week: sql<number>`COALESCE(SUM(${G.createdAt} >= UTC_DATE() - INTERVAL 6 DAY), 0)`,
      words: sql<number>`COUNT(DISTINCT ${G.qkey})`,
      members: sql<number>`COUNT(DISTINCT ${G.userId})`,
      guests: sql<number>`COUNT(DISTINCT CASE WHEN ${G.userId} IS NULL THEN ${G.anonId} END)`
    }).from(G),
    db.select({ source: G.source, n: sql<number>`COUNT(*)` }).from(G).groupBy(G.source),
    // En çok arananlar (son 30 gün), aynı kelimenin farklı yazımları birlikte
    db.select({
      qkey: G.qkey, n: sql<number>`COUNT(*)`, query: sql<string>`MAX(${G.query})`, variants: sql<number>`COUNT(DISTINCT ${G.query})`,
      ar: sql<string | null>`MAX(${G.resultAr})`, tr: sql<string | null>`MAX(${G.resultTr})`, lastAt: sql<Date>`MAX(${G.createdAt})`
    }).from(G).where(sql`${G.createdAt} >= UTC_DATE() - INTERVAL 30 DAY AND ${search}`).groupBy(G.qkey).orderBy(desc(sql`COUNT(*)`)).limit(30),
    // Ücretsiz kaynaklarda bulunamayanlar
    db.select({
      qkey: G.qkey, n: sql<number>`COUNT(*)`, query: sql<string>`MAX(${G.query})`,
      ar: sql<string | null>`MAX(${G.resultAr})`, tr: sql<string | null>`MAX(${G.resultTr})`,
      found: sql<number>`SUM(${G.source} IN ('ai', 'cache'))`, lastAt: sql<Date>`MAX(${G.createdAt})`
    }).from(G).where(sql`${MISSING} AND ${search}`).groupBy(G.qkey).orderBy(desc(sql`COUNT(*)`), desc(sql`MAX(${G.createdAt})`)).limit(40),
    db.select({
      id: G.id, query: G.query, source: G.source, near: G.near, ar: G.resultAr, tr: G.resultTr, createdAt: G.createdAt,
      userId: G.userId, userName: schema.users.name
    }).from(G).leftJoin(schema.users, eq(schema.users.id, G.userId)).where(search).orderBy(desc(G.id)).limit(150)
  ]);
  return {
    totals: { n: Number(tot.n), today: Number(tot.today), week: Number(tot.week), words: Number(tot.words), members: Number(tot.members), guests: Number(tot.guests) },
    bySource: Object.fromEntries(bySource.map((r) => [r.source, Number(r.n)])) as Record<string, number>,
    top: top.map((r) => ({ ...r, n: Number(r.n), variants: Number(r.variants) })),
    missing: missing.map((r) => ({ ...r, n: Number(r.n), found: Number(r.found) })),
    recent
  };
}
