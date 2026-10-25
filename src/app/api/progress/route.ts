import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { fail, ok, parse } from '@/lib/api';
import { markDay, mergeProgress, resetProgress, saveAct, saveLesson, setLastTopic } from '@/lib/progress';

const id = z.string().min(1).max(64);
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const ActRec = z.object({
  best: z.number().min(0).max(1),
  done: z.boolean(),
  tries: z.number().int().min(0).max(100000),
  last: z.number().min(0).max(1).optional()
});

const Body = z.discriminatedUnion('action', [
  z.object({ action: z.literal('lesson'), topicId: id, day }),
  z.object({ action: z.literal('act'), topicId: id, actKey: id, score: z.number().min(0).max(1), done: z.boolean(), day }),
  z.object({ action: z.literal('last'), topicId: id }),
  z.object({ action: z.literal('reset') }),
  z.object({
    action: z.literal('merge'),
    state: z.object({
      progress: z.record(z.string().max(64), z.object({
        lesson: z.boolean().optional().default(false),
        acts: z.record(z.string().max(64), ActRec).optional().default({})
      })),
      last: z.string().max(64).nullable().optional(),
      days: z.array(day).max(2000).optional().default([]),
      counts: z.record(day, z.number().int().min(0).max(100000)).optional()
    })
  })
]);

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail('Oturum yok.', 401);
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const b = p.data;
  switch (b.action) {
    case 'lesson':
      await saveLesson(user.id, b.topicId);
      await markDay(user.id, b.day);
      break;
    case 'act':
      await saveAct(user.id, b.topicId, b.actKey, b.score, b.done);
      await markDay(user.id, b.day);
      break;
    case 'last':
      await setLastTopic(user.id, b.topicId);
      break;
    case 'reset':
      await resetProgress(user.id);
      break;
    case 'merge': {
      const progress = Object.fromEntries(Object.entries(b.state.progress).map(([k, v]) => [k, {
        lesson: v.lesson,
        acts: Object.fromEntries(Object.entries(v.acts).map(([a, r]) => [a, { ...r, last: r.last ?? r.best }]))
      }]));
      await mergeProgress(user.id, { progress, last: b.state.last ?? null, days: b.state.days, counts: b.state.counts });
      break;
    }
  }
  return ok();
}
