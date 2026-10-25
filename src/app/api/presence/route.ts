import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { ok, parse } from '@/lib/api';
import { touch } from '@/lib/presence';
import { throttle } from '@/lib/throttle';

// Açık sekmenin "buradayım" sinyali (dakikada bir); yalnızca bellekte tutulur
const Body = z.object({
  anonId: z.string().min(8).max(64).nullable().optional(),
  path: z.string().max(200).regex(/^\//)
});

export async function POST(req: Request) {
  const limited = throttle('presence', req);
  if (limited) return limited;
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const user = await getSessionUser();
  const id = user ? 'u:' + user.id : p.data.anonId ? 'a:' + p.data.anonId : null;
  if (id) {
    const mobile = /Mobi|Android|iPhone|iPad/i.test(req.headers.get('user-agent') || '');
    touch(id, { userId: user?.id ?? null, name: user?.name ?? null, path: p.data.path.split('#')[0], mobile });
  }
  return ok();
}
