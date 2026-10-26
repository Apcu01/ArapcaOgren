import { z } from 'zod';
import { fail, ok, parse } from '@/lib/api';
import { answer, host, hostView, join, LIVE, peek, playerView } from '@/lib/live';
import { throttle } from '@/lib/throttle';

type Ctx = { params: Promise<{ code: string }> };
const noStore = { 'Cache-Control': 'no-store' };
const id = z.string().min(8).max(40);

/* Durum: ?k=öğretmen anahtarı, ?p=&pk= öğrenci, hiçbiri yoksa yalnızca yarışma var mı */
export async function GET(req: Request, { params }: Ctx) {
  const limited = throttle('live', req);
  if (limited) return limited;
  const code = (await params).code;
  const u = new URL(req.url).searchParams;
  if (u.get('k')) {
    const v = hostView(code, u.get('k')!);
    return v ? Response.json(v, { headers: noStore }) : fail('Yarışma bulunamadı.', 404);
  }
  if (u.get('p') && u.get('pk')) return Response.json(playerView(code, u.get('p')!, u.get('pk')!), { headers: noStore });
  const v = peek(code);
  return v ? Response.json(v, { headers: noStore }) : fail('Bu PIN ile süren bir yarışma yok.', 404);
}

const Body = z.discriminatedUnion('action', [
  z.object({ action: z.literal('join'), name: z.string().max(60) }),
  z.object({ action: z.literal('answer'), pid: id, pkey: id, q: z.number().int().min(0).max(100), choice: z.number().int().min(0).max(3) }),
  z.object({ action: z.enum(['start', 'next', 'skip', 'kick', 'end']), k: id, pid: id.optional() })
]);

export async function POST(req: Request, { params }: Ctx) {
  const limited = throttle('live', req);
  if (limited) return limited;
  const code = (await params).code;
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const b = p.data;
  const r = b.action === 'join' ? join(code, b.name.slice(0, LIVE.nameMax + 10))
    : b.action === 'answer' ? answer(code, b.pid, b.pkey, b.q, b.choice)
    : host(code, b.k, b.action, b.pid);
  if ('error' in r) return fail(r.error!, 400);
  return ok(r);
}
