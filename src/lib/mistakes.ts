import 'server-only';
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import type { MistakeItem } from './qkey';
import type { Question } from './types';

export const MAX_MISTAKES = 500;
const M = schema.mistakes;

export async function getMistakes(userId: number): Promise<MistakeItem[]> {
  const rows = await db.select().from(M).where(eq(M.userId, userId))
    .orderBy(desc(M.updatedAt)).limit(MAX_MISTAKES);
  return rows.map((r) => ({ mkey: r.mkey, topicId: r.topicId, question: r.question, count: r.count, at: r.updatedAt.getTime() }));
}

export type NewMistake = { mkey: string; topicId: string; question: Question; count?: number };

/**
 * Hataları ekler; aynı soru zaten varsa sayısı artar. Üst sınır aşılırsa en eski kayıtlar silinir.
 * Misafirken biriken hatalar girişte toplu gelir: hepsi tek sorguda yazılır (uzak veritabanına her biri için gidilmez).
 */
export async function addMistakes(userId: number, items: NewMistake[]) {
  if (!items.length) return;
  for (let i = 0; i < items.length; i += 100) {
    await db.insert(M).values(items.slice(i, i + 100).map((it) => ({ userId, mkey: it.mkey, topicId: it.topicId, question: it.question, count: it.count || 1 })))
      .onDuplicateKeyUpdate({ set: { count: sql`count + VALUES(count)`, question: sql`VALUES(question)` } });
  }
  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(M).where(eq(M.userId, userId));
  if (Number(n) > MAX_MISTAKES) {
    const old = await db.select({ mkey: M.mkey }).from(M).where(eq(M.userId, userId))
      .orderBy(asc(M.updatedAt)).limit(Number(n) - MAX_MISTAKES);
    if (old.length) await db.delete(M).where(and(eq(M.userId, userId), inArray(M.mkey, old.map((o) => o.mkey))));
  }
}

export function addMistake(userId: number, mkey: string, topicId: string, question: Question, times = 1) {
  return addMistakes(userId, [{ mkey, topicId, question, count: times }]);
}

export async function resolveMistake(userId: number, mkey: string) {
  await db.delete(M).where(and(eq(M.userId, userId), eq(M.mkey, mkey)));
}

export async function clearMistakes(userId: number) {
  await db.delete(M).where(eq(M.userId, userId));
}
