import 'server-only';
import { and, eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import type { ProgressState } from './types';

export async function getUserProgress(userId: number): Promise<ProgressState> {
  const [lessons, acts, days, [u]] = await Promise.all([
    db.select().from(schema.topicProgress).where(eq(schema.topicProgress.userId, userId)),
    db.select().from(schema.activityProgress).where(eq(schema.activityProgress.userId, userId)),
    db.select({ day: schema.studyDays.day }).from(schema.studyDays).where(eq(schema.studyDays.userId, userId)),
    db.select({ lastTopic: schema.users.lastTopic }).from(schema.users).where(eq(schema.users.id, userId))
  ]);
  const state: ProgressState = { progress: {}, last: u?.lastTopic ?? null, days: days.map((d) => d.day).sort() };
  const tp = (id: string) => (state.progress[id] = state.progress[id] || { lesson: false, acts: {} });
  for (const l of lessons) tp(l.topicId).lesson = l.lessonRead;
  for (const a of acts) tp(a.topicId).acts[a.actKey] = { best: a.best, last: a.last, done: a.done, tries: a.tries };
  return state;
}

export async function markDay(userId: number, day: string) {
  await db.insert(schema.studyDays).values({ userId, day }).onDuplicateKeyUpdate({ set: { day: sql`day` } });
}

export async function saveLesson(userId: number, topicId: string) {
  await db.insert(schema.topicProgress).values({ userId, topicId, lessonRead: true })
    .onDuplicateKeyUpdate({ set: { lessonRead: true } });
}

// Skor birleştirme: en iyi skor korunur, bir kez tamamlanan tamamlanmış kalır
export async function saveAct(userId: number, topicId: string, actKey: string, score: number, done: boolean, tries = 1) {
  await db.insert(schema.activityProgress)
    .values({ userId, topicId, actKey, best: score, last: score, done, tries })
    .onDuplicateKeyUpdate({
      set: {
        best: sql`GREATEST(best, VALUES(best))`,
        last: sql`VALUES(last)`,
        done: sql`(done OR VALUES(done))`,
        tries: sql`tries + VALUES(tries)`
      }
    });
}

export async function setLastTopic(userId: number, topicId: string) {
  await db.update(schema.users).set({ lastTopic: topicId }).where(eq(schema.users.id, userId));
}

// Misafirken biriken localStorage ilerlemesini hesaba aktar
export async function mergeProgress(userId: number, state: ProgressState) {
  for (const [topicId, rec] of Object.entries(state.progress || {})) {
    if (rec.lesson) await saveLesson(userId, topicId);
    for (const [actKey, a] of Object.entries(rec.acts || {})) {
      await saveAct(userId, topicId, actKey, a.best, a.done, Math.max(1, a.tries || 1));
    }
  }
  for (const d of state.days || []) if (/^\d{4}-\d{2}-\d{2}$/.test(d)) await markDay(userId, d);
  if (state.last) await setLastTopic(userId, state.last);
}

export async function resetProgress(userId: number) {
  await Promise.all([
    db.delete(schema.topicProgress).where(eq(schema.topicProgress.userId, userId)),
    db.delete(schema.activityProgress).where(eq(schema.activityProgress.userId, userId)),
    db.delete(schema.studyDays).where(eq(schema.studyDays.userId, userId)),
    db.update(schema.users).set({ lastTopic: null }).where(and(eq(schema.users.id, userId)))
  ]);
}
