import 'server-only';
import { and, eq, inArray, notInArray } from 'drizzle-orm';
import { db, schema } from '@/db';
import { cached } from './cache';
import { narrKey, synthesize } from './tts';
import type { Topic } from './types';

/** Bir dersin anlatım seslerinin numaraları: bölüm sırasına göre ve özet (metin değiştiyse null) */
export type NarrIds = { sections: (number | null)[]; summary: number | null };

export async function getNarrationIds(t: Pick<Topic, 'id' | 'lesson' | 'summaryNarr'>): Promise<NarrIds> {
  const keys = t.lesson.map((s) => (s.narr?.trim() ? narrKey(s.narr) : null));
  const sumKey = t.summaryNarr?.trim() ? narrKey(t.summaryNarr) : null;
  const wanted = [...keys, sumKey].filter((k): k is string => !!k);
  const rows = wanted.length
    ? await cached('narr:' + t.id + ':' + wanted.join(','), () => db.select({ id: schema.narrationAudio.id, nkey: schema.narrationAudio.nkey }).from(schema.narrationAudio).where(inArray(schema.narrationAudio.nkey, wanted)))
    : [];
  const byKey = new Map(rows.map((r) => [r.nkey, r.id]));
  return { sections: keys.map((k) => (k ? byKey.get(k) ?? null : null)), summary: sumKey ? byKey.get(sumKey) ?? null : null };
}

/** Bir metni seslendirip kaydeder; aynı metnin sesi varsa yeniden üretmez */
export async function ensureNarration(topicId: string, text: string, force = false) {
  const nkey = narrKey(text);
  const [old] = await db.select({ id: schema.narrationAudio.id }).from(schema.narrationAudio).where(eq(schema.narrationAudio.nkey, nkey)).limit(1);
  if (old && !force) return old.id;
  const data = await synthesize(text);
  if (old) await db.delete(schema.narrationAudio).where(eq(schema.narrationAudio.id, old.id));
  const [r] = await db.insert(schema.narrationAudio).values({ nkey, topicId, mime: 'audio/mpeg', size: data.length, data }).$returningId();
  return r.id;
}

/** Dersin artık kullanılmayan eski anlatım seslerini siler */
export async function pruneNarration(t: Pick<Topic, 'id' | 'lesson' | 'summaryNarr'>) {
  const keep = [...t.lesson.map((s) => s.narr), t.summaryNarr].filter((x): x is string => !!x?.trim()).map((x) => narrKey(x));
  const where = keep.length
    ? and(eq(schema.narrationAudio.topicId, t.id), notInArray(schema.narrationAudio.nkey, keep))
    : eq(schema.narrationAudio.topicId, t.id);
  await db.delete(schema.narrationAudio).where(where);
}
