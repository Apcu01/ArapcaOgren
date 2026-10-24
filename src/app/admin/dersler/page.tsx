import { sql } from 'drizzle-orm';
import { db } from '@/db';
import TopicsTable from '@/components/admin/TopicsTable';
import { getTopics } from '@/lib/topics';

export const metadata = { title: 'Dersler' };

export default async function TopicsAdmin() {
  const topics = await getTopics({ all: true });
  const [rows] = (await db.execute(sql`SELECT topic_id t, COUNT(*) n, AVG(score) avg FROM events WHERE type = 'activity' GROUP BY topic_id`)) as unknown as [{ t: string; n: number; avg: number }[]];
  const usage = Object.fromEntries(rows.map((r) => [r.t, { n: Number(r.n), avg: Number(r.avg) }]));
  return (
    <TopicsTable
      topics={topics.map((t) => ({ id: t.id, n: t.n, name: t.name, ar: t.ar, glyph: t.glyph, level: t.level, published: !!t.published, acts: t.acts.length, words: t.words.length, sections: t.lesson.length }))}
      usage={usage}
    />
  );
}
