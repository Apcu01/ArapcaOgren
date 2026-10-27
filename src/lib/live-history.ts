import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import type { LiveReport } from './live-report';

const R = schema.liveResults;

/** Biten yarışmayı öğretmenin geçmişine yazar (yalnızca giriş yapmış öğretmen) */
export async function saveLiveResult(userId: number, r: LiveReport) {
  const total = r.players.length * r.questions.length;
  const right = r.players.reduce((n, p) => n + p.right, 0);
  await db.insert(R).values({
    userId, title: r.title.slice(0, 120), questions: r.questions.length, players: r.players.length,
    accuracy: total ? right / total : 0, report: r, startedAt: new Date(r.startedAt)
  });
}

export async function listLiveResults(userId: number) {
  return db.select({ id: R.id, title: R.title, questions: R.questions, players: R.players, accuracy: R.accuracy, startedAt: R.startedAt })
    .from(R).where(eq(R.userId, userId)).orderBy(desc(R.startedAt)).limit(200);
}

export async function getLiveResult(userId: number, id: number) {
  const [r] = await db.select().from(R).where(and(eq(R.id, id), eq(R.userId, userId)));
  return r ?? null;
}

export async function deleteLiveResult(userId: number, id: number) {
  const r = await db.delete(R).where(and(eq(R.id, id), eq(R.userId, userId)));
  return r[0].affectedRows > 0;
}
