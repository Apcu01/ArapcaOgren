import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { fail, ok, parse } from '@/lib/api';
import { addMistake, clearMistakes, MAX_MISTAKES, resolveMistake } from '@/lib/mistakes';
import type { Question } from '@/lib/types';

const key = z.string().min(1).max(64);
const QuestionZ = z.object({
  t: z.enum(['mc', 'fill', 'tf', 'order', 'listen']),
  q: z.string().max(2000).optional(), ar: z.string().max(2000).optional(), tl: z.string().max(500).optional(),
  clock: z.string().max(8).optional(), s: z.string().max(2000).optional(), hint: z.string().max(2000).optional(),
  options: z.array(z.string().max(1000)).max(12).optional(), a: z.union([z.string().max(1000), z.boolean()]).optional(),
  fixed: z.boolean().optional(), why: z.string().max(4000).optional(), tr: z.string().max(1000).optional(),
  en: z.string().max(1000).optional(), w: z.array(z.string().max(200)).max(30).optional(), alt: z.array(z.array(z.string().max(200))).max(5).optional()
});
const Item = z.object({ mkey: key, topicId: key, question: QuestionZ, count: z.number().int().min(1).max(10000).optional() });

const Body = z.discriminatedUnion('action', [
  z.object({ action: z.literal('add'), ...Item.shape }),
  z.object({ action: z.literal('resolve'), mkey: key }),
  z.object({ action: z.literal('clear') }),
  z.object({ action: z.literal('merge'), items: z.array(Item).max(MAX_MISTAKES) })
]);

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail('Oturum yok.', 401);
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const b = p.data;
  if (b.action === 'add') await addMistake(user.id, b.mkey, b.topicId, b.question as Question);
  else if (b.action === 'resolve') await resolveMistake(user.id, b.mkey);
  else if (b.action === 'clear') await clearMistakes(user.id);
  else for (const it of b.items) await addMistake(user.id, it.mkey, it.topicId, it.question as Question, it.count || 1);
  return ok();
}
