import 'server-only';
import { cache } from 'react';
import { asc, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { buildSafe, cached } from './cache';
import type { Activity, ActType, Topic } from './types';

type TopicRow = typeof schema.topics.$inferSelect;
type ActRow = typeof schema.activities.$inferSelect;

export function toActivity(a: ActRow): Activity {
  return {
    id: String(a.id),
    type: a.type as ActType,
    mode: (a.mode as Activity['mode']) ?? null,
    title: a.title,
    desc: a.description,
    glyph: a.glyph || undefined,
    keepOrder: a.keepOrder || undefined,
    items: a.items ?? null
  };
}

export function toTopic(t: TopicRow, acts: ActRow[]): Topic {
  return {
    id: t.id,
    n: t.n,
    level: t.level,
    glyph: t.glyph,
    ar: t.ar,
    name: t.name,
    desc: t.description,
    long: t.long,
    tags: t.tags,
    readMins: t.readMins,
    intro: t.intro,
    lesson: t.lesson,
    keys: t.keyPoints,
    mistakes: t.mistakes,
    words: t.words,
    published: t.published,
    summaryNarr: t.summaryNarr,
    acts: acts.filter((a) => a.topicId === t.id).sort((x, y) => x.position - y.position || x.id - y.id).map(toActivity)
  };
}

// Sonuçlar önbellekten paylaşılır: çağıranlar dönen nesneleri değiştirmemeli
export const getTopics = cache((opts: { all?: boolean } = {}): Promise<Topic[]> => buildSafe(() => cached('topics:' + (opts.all ? 'all' : 'pub'), async () => {
  const [rows, acts] = await Promise.all([
    opts.all
      ? db.select().from(schema.topics).orderBy(asc(schema.topics.n))
      : db.select().from(schema.topics).where(eq(schema.topics.published, true)).orderBy(asc(schema.topics.n)),
    db.select().from(schema.activities).orderBy(asc(schema.activities.position))
  ]);
  return rows.map((t) => toTopic(t, acts));
}), []));

export async function getTopic(id: string, opts: { all?: boolean } = {}): Promise<Topic | null> {
  const t = await cached('topics:one:' + id, async () => {
    const [row] = await db.select().from(schema.topics).where(eq(schema.topics.id, id)).limit(1);
    if (!row) return null;
    const acts = await db.select().from(schema.activities).where(eq(schema.activities.topicId, id));
    return toTopic(row, acts);
  });
  return t && (t.published || opts.all) ? t : null;
}
