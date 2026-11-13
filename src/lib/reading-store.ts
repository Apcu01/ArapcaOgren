import 'server-only';
import { asc, eq } from 'drizzle-orm';
import { cache } from 'react';
import { db, schema } from '@/db';
import { buildSafe, cached } from './cache';
import type { Reading } from './readings';

const R = schema.readings;
type Row = typeof R.$inferSelect;
const toReading = (r: Row): Reading => ({
  slug: r.slug, title: r.title, ar: r.ar, level: r.level as Reading['level'], topic: r.topic, desc: r.description,
  sentences: r.sentences, questions: r.questions, published: r.published, ai: r.ai
});

/** Okuma metinleri sırasıyla (varsayılan: yalnızca yayındakiler) */
export const getReadings = cache((opts: { all?: boolean } = {}): Promise<Reading[]> => buildSafe(() => cached('readings:' + (opts.all ? 'all' : 'pub'), async () => {
  const rows = opts.all
    ? await db.select().from(R).orderBy(asc(R.position), asc(R.createdAt))
    : await db.select().from(R).where(eq(R.published, true)).orderBy(asc(R.position), asc(R.createdAt));
  return rows.map(toReading);
}), []));

export async function getReading(slug: string, opts: { all?: boolean } = {}) {
  return (await getReadings(opts)).find((r) => r.slug === slug) || null;
}
