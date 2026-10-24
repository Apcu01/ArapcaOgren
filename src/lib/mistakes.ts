import 'server-only';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import type { MistakeItem } from './qkey';
import type { Question } from './types';

export const MAX_MISTAKES = 500;

export async function getMistakes(userId: number): Promise<MistakeItem[]> {
  const rows = await db.select().from(schema.mistakes).where(eq(schema.mistakes.userId, userId))
    .orderBy(desc(schema.mistakes.updatedAt)).limit(MAX_MISTAKES);
  return rows.map((r) => ({ mkey: r.mkey, topicId: r.topicId, question: r.question, count: r.count, at: r.updatedAt.getTime() }));
}

export async function addMistake(userId: number, mkey: string, topicId: string, question: Question, times = 1) {
  await db.insert(schema.mistakes).values({ userId, mkey, topicId, question, count: times })
    .onDuplicateKeyUpdate({ set: { count: sql`count + VALUES(count)`, question: sql`VALUES(question)` } });
  // Üst sınırı aşarsa en eski kayıtları sil
  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(schema.mistakes).where(eq(schema.mistakes.userId, userId));
  if (Number(n) > MAX_MISTAKES) {
    const old = await db.select({ mkey: schema.mistakes.mkey }).from(schema.mistakes).where(eq(schema.mistakes.userId, userId))
      .orderBy(asc(schema.mistakes.updatedAt)).limit(Number(n) - MAX_MISTAKES);
    for (const o of old) await db.delete(schema.mistakes).where(and(eq(schema.mistakes.userId, userId), eq(schema.mistakes.mkey, o.mkey)));
  }
}

export async function resolveMistake(userId: number, mkey: string) {
  await db.delete(schema.mistakes).where(and(eq(schema.mistakes.userId, userId), eq(schema.mistakes.mkey, mkey)));
}

export async function clearMistakes(userId: number) {
  await db.delete(schema.mistakes).where(eq(schema.mistakes.userId, userId));
}
