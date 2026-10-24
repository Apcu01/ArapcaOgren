import 'server-only';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { getTopic } from '@/lib/topics';
import type { TopicInputT } from '@/lib/topic-schema';
import type { Item, Mistake, Section, Word } from '@/lib/types';

/** Dersi ve etkinliklerini tek işlemde yazar; listede olmayan etkinlikler silinir */
export async function writeTopic(t: TopicInputT, isNew: boolean) {
  const row = {
    n: t.n,
    level: t.level,
    glyph: t.glyph,
    ar: t.ar,
    name: t.name,
    description: t.desc,
    long: t.long || null,
    tags: t.tags || null,
    readMins: t.readMins,
    intro: t.intro,
    lesson: t.lesson as Section[],
    keyPoints: t.keys,
    mistakes: t.mistakes as Mistake[],
    words: t.words as Word[],
    published: t.published,
    summaryNarr: t.summaryNarr || null
  };
  await db.transaction(async (tx) => {
    if (isNew) await tx.insert(schema.topics).values({ id: t.id, ...row });
    else await tx.update(schema.topics).set(row).where(eq(schema.topics.id, t.id));

    const existing = await tx.select({ id: schema.activities.id }).from(schema.activities).where(eq(schema.activities.topicId, t.id));
    const keep = new Set<number>();
    for (const [i, a] of t.acts.entries()) {
      const vals = {
        topicId: t.id,
        position: i,
        type: a.type,
        mode: a.type === 'clock' ? a.mode || 'mix' : null,
        title: a.title,
        description: a.desc,
        glyph: a.glyph || '',
        keepOrder: !!a.keepOrder,
        items: ['flash', 'listen', 'clock', 'speak'].includes(a.type) && !(a.items && a.items.length) ? null : ((a.items || []) as Item[])
      };
      const id = Number(a.id);
      if (a.id && existing.some((e) => e.id === id)) {
        await tx.update(schema.activities).set(vals).where(eq(schema.activities.id, id));
        keep.add(id);
      } else {
        await tx.insert(schema.activities).values(vals);
      }
    }
    for (const e of existing) if (!keep.has(e.id)) await tx.delete(schema.activities).where(eq(schema.activities.id, e.id));
  });
  return getTopic(t.id, { all: true });
}
