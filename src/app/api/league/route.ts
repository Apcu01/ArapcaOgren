import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { fail, ok, parse } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { throttle } from '@/lib/throttle';
import { leagueBoard } from '@/lib/xp';

// Haftalık lig tablosu (herkese açık; giriş yapmışsa kendi sırası da)
export async function GET(req: Request) {
  const limited = throttle('metrics', req);
  if (limited) return limited;
  const user = await getSessionUser();
  const res = ok(await leagueBoard(user?.id ?? null));
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}

// Ligde adı gizle / göster
const Body = z.object({ hidden: z.boolean() });
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  await db.update(schema.users).set({ leagueHidden: p.data.hidden }).where(eq(schema.users.id, user.id));
  return ok({ hidden: p.data.hidden });
}
