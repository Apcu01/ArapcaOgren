import { desc, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import LookupsView from '@/components/admin/LookupsView';
import { LOOKUP_DAILY_LIMIT, LOOKUP_MODEL } from '@/lib/lookup';

export const metadata = { title: 'Kelime aramaları' };

export default async function LookupsPage() {
  const [rows, [tot], [lex]] = await Promise.all([
    db.select().from(schema.lookups).orderBy(desc(schema.lookups.lastAt)).limit(300),
    db.select({
      n: sql<number>`COUNT(*)`,
      hits: sql<number>`COALESCE(SUM(hits), 0)`,
      cost: sql<number>`COALESCE(SUM(cost), 0)`,
      today: sql<number>`COALESCE(SUM(created_at >= UTC_DATE()), 0)`,
      month: sql<number>`COALESCE(SUM(CASE WHEN created_at >= DATE_FORMAT(UTC_DATE(), '%Y-%m-01') THEN cost ELSE 0 END), 0)`
    }).from(schema.lookups),
    db.select({ n: sql<number>`COUNT(*)` }).from(schema.lexicon)
  ]);
  return (
    <LookupsView
      model={LOOKUP_MODEL}
      dailyLimit={LOOKUP_DAILY_LIMIT}
      lexiconSize={Number(lex.n)}
      totals={{ n: Number(tot.n), hits: Number(tot.hits), cost: Number(tot.cost), today: Number(tot.today), month: Number(tot.month) }}
      rows={rows.map((r) => ({ id: r.id, query: r.query, result: r.result, hits: r.hits, cost: r.cost, createdAt: r.createdAt.toISOString(), lastAt: r.lastAt.toISOString() }))}
    />
  );
}
