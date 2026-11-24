import 'server-only';
import { and, eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import type { ProgressState } from './types';

export async function getUserProgress(userId: number): Promise<ProgressState> {
  const [lessons, acts, days, [u]] = await Promise.all([
    db.select().from(schema.topicProgress).where(eq(schema.topicProgress.userId, userId)),
    db.select().from(schema.activityProgress).where(eq(schema.activityProgress.userId, userId)),
    db.select({ day: schema.studyDays.day, n: schema.studyDays.n }).from(schema.studyDays).where(eq(schema.studyDays.userId, userId)),
    db.select({ lastTopic: schema.users.lastTopic }).from(schema.users).where(eq(schema.users.id, userId))
  ]);
  const state: ProgressState = { progress: {}, last: u?.lastTopic ?? null, days: days.map((d) => d.day).sort(), counts: Object.fromEntries(days.map((d) => [d.day, d.n])) };
  const tp = (id: string) => (state.progress[id] = state.progress[id] || { lesson: false, acts: {} });
  for (const l of lessons) tp(l.topicId).lesson = l.lessonRead;
  for (const a of acts) tp(a.topicId).acts[a.actKey] = { best: a.best, last: a.last, done: a.done, tries: a.tries };
  return state;
}

export async function markDay(userId: number, day: string, inc = 1) {
  await db.insert(schema.studyDays).values({ userId, day, n: inc }).onDuplicateKeyUpdate({ set: { n: sql`n + VALUES(n)` } });
}

/** Puan için: ders daha önce okunmuş mu, etkinlik daha önce tamamlanmış mı */
export async function wasLessonRead(userId: number, topicId: string) {
  const [r] = await db.select({ v: schema.topicProgress.lessonRead }).from(schema.topicProgress)
    .where(and(eq(schema.topicProgress.userId, userId), eq(schema.topicProgress.topicId, topicId))).limit(1);
  return !!r?.v;
}
export async function wasActDone(userId: number, topicId: string, actKey: string) {
  const [r] = await db.select({ v: schema.activityProgress.done }).from(schema.activityProgress)
    .where(and(eq(schema.activityProgress.userId, userId), eq(schema.activityProgress.topicId, topicId), eq(schema.activityProgress.actKey, actKey))).limit(1);
  return !!r?.v;
}

export async function saveLesson(userId: number, topicId: string) {
  await db.insert(schema.topicProgress).values({ userId, topicId, lessonRead: true })
    .onDuplicateKeyUpdate({ set: { lessonRead: true } });
}

// Skor birleştirme: en iyi skor korunur, bir kez tamamlanan tamamlanmış kalır
const actMerge = {
  best: sql`GREATEST(best, VALUES(best))`,
  last: sql`VALUES(last)`,
  done: sql`(done OR VALUES(done))`,
  tries: sql`tries + VALUES(tries)`
};
export async function saveAct(userId: number, topicId: string, actKey: string, score: number, done: boolean, tries = 1) {
  await db.insert(schema.activityProgress)
    .values({ userId, topicId, actKey, best: score, last: score, done, tries })
    .onDuplicateKeyUpdate({ set: actMerge });
}

export async function setLastTopic(userId: number, topicId: string) {
  await db.update(schema.users).set({ lastTopic: topicId }).where(eq(schema.users.id, userId));
}

// Misafirken biriken localStorage ilerlemesini hesaba aktar
// Her tablo tek (çok satırlı) sorguyla yazılır: uzak veritabanına her ders, etkinlik ve gün için ayrı gidilmez
export async function mergeProgress(userId: number, state: ProgressState) {
  const entries = Object.entries(state.progress || {});
  const lessons = entries.filter(([, rec]) => rec.lesson).map(([topicId]) => ({ userId, topicId, lessonRead: true }));
  const acts = entries.flatMap(([topicId, rec]) => Object.entries(rec.acts || {}).map(([actKey, a]) => (
    { userId, topicId, actKey, best: a.best, last: a.best, done: a.done, tries: Math.max(1, a.tries || 1) }
  )));
  const days = (state.days || []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .map((day) => ({ userId, day, n: Math.max(1, Math.min(500, state.counts?.[day] || 1)) }));
  const inChunks = async <T,>(rows: T[], write: (part: T[]) => Promise<unknown>) => {
    for (let i = 0; i < rows.length; i += 500) await write(rows.slice(i, i + 500));
  };
  await Promise.all([
    inChunks(lessons, (part) => db.insert(schema.topicProgress).values(part).onDuplicateKeyUpdate({ set: { lessonRead: true } })),
    inChunks(acts, (part) => db.insert(schema.activityProgress).values(part).onDuplicateKeyUpdate({ set: actMerge })),
    inChunks(days, (part) => db.insert(schema.studyDays).values(part).onDuplicateKeyUpdate({ set: { n: sql`n + VALUES(n)` } })),
    state.last ? setLastTopic(userId, state.last) : null
  ]);
}

export async function resetProgress(userId: number) {
  await Promise.all([
    db.delete(schema.topicProgress).where(eq(schema.topicProgress.userId, userId)),
    db.delete(schema.activityProgress).where(eq(schema.activityProgress.userId, userId)),
    db.delete(schema.studyDays).where(eq(schema.studyDays.userId, userId)),
    db.update(schema.users).set({ lastTopic: null }).where(and(eq(schema.users.id, userId)))
  ]);
}
