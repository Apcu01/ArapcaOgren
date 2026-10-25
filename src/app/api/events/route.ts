import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { getSessionUser } from '@/lib/auth';
import { ok, parse } from '@/lib/api';
import { throttle } from '@/lib/throttle';

const Body = z.object({
  type: z.enum(['view', 'lesson', 'activity']),
  anonId: z.string().max(64).nullable().optional(),
  path: z.string().max(255).optional(),
  topicId: z.string().max(64).optional(),
  actKey: z.string().max(64).optional(),
  score: z.number().min(0).max(1).optional(),
  // Etkinlikteki her sorunun ilk cevabı (soru bazında istatistik için)
  answers: z.array(z.object({ qk: z.string().min(1).max(64), label: z.string().max(255), ok: z.boolean() })).max(300).optional()
});

export async function POST(req: Request) {
  const limited = throttle('events', req);
  if (limited) return limited;
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const user = await getSessionUser();
  const e = p.data;
  await db.insert(schema.events).values({
    type: e.type,
    userId: user?.id ?? null,
    anonId: e.anonId ?? null,
    path: e.path ?? null,
    topicId: e.topicId ?? null,
    actKey: e.actKey ?? null,
    score: e.score ?? null
  });
  if (e.type === 'activity' && e.topicId && e.actKey && e.answers?.length) {
    // Aynı soru birden çok kez geldiyse önce topla
    const agg = new Map<string, { label: string; attempts: number; correct: number }>();
    for (const a of e.answers) {
      const r = agg.get(a.qk) || { label: a.label, attempts: 0, correct: 0 };
      r.attempts++; if (a.ok) r.correct++;
      agg.set(a.qk, r);
    }
    await db.insert(schema.questionStats)
      .values([...agg].map(([qkey, r]) => ({ topicId: e.topicId!, actKey: e.actKey!, qkey, label: r.label || 'Soru', attempts: r.attempts, correct: r.correct })))
      .onDuplicateKeyUpdate({ set: { attempts: sql`attempts + VALUES(attempts)`, correct: sql`correct + VALUES(correct)`, label: sql`VALUES(label)` } });
  }
  return ok();
}
