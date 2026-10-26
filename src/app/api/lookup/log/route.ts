import { z } from 'zod';
import { ok, parse } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { logLookup } from '@/lib/lookup-log';
import { LOOKUP_RE } from '@/lib/translit';
import { throttle } from '@/lib/throttle';

// Derslerdeki kelimelerle sayfada bulunan aramalar sunucuya gitmez; günlüğe yazılması için yalnızca bildirilir
const Body = z.object({
  q: z.string().trim().min(1).max(40).regex(LOOKUP_RE),
  ar: z.string().max(120).optional(),
  tr: z.string().max(300).optional(),
  anonId: z.string().max(64).nullable().optional()
});

export async function POST(req: Request) {
  const limited = throttle('lookup', req);
  if (limited) return limited;
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const user = await getSessionUser();
  await logLookup({ ...p.data, source: 'lesson', userId: user?.id });
  return ok();
}
