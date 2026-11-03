import { z } from 'zod';
import { fail, ok, parse } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { isCode, normCode } from '@/lib/class-shared';
import { createClass, joinClass, myClasses } from '@/lib/classes';
import { throttle } from '@/lib/throttle';

// Sınıflarım: açtığım ve katıldığım sınıflar (hesap gerekir)
export async function GET() {
  const user = await getSessionUser();
  if (!user) return fail('Sınıflar için giriş yapmalısın.', 401);
  return Response.json({ classes: await myClasses(user.id) }, { headers: { 'Cache-Control': 'private, no-store' } });
}

const Body = z.discriminatedUnion('action', [
  z.object({ action: z.literal('create'), name: z.string().trim().min(1, 'Sınıfa bir ad ver.').max(80, 'Sınıf adı en fazla 80 karakter olabilir.') }),
  z.object({ action: z.literal('join'), code: z.string().max(20) })
]);

export async function POST(req: Request) {
  const limited = throttle('classes', req);
  if (limited) return limited;
  const user = await getSessionUser();
  if (!user) return fail('Sınıflar için giriş yapmalısın.', 401);
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  if (p.data.action === 'create') {
    const r = await createClass(user.id, p.data.name);
    return 'error' in r ? fail(r.error!) : ok(r);
  }
  const code = normCode(p.data.code);
  if (!isCode(code)) return fail('Katılma kodu 6 karakterdir (harf ve rakam).');
  const r = await joinClass(user.id, code);
  return 'error' in r && r.error ? fail(r.error, 'id' in r ? 409 : 404) : ok(r);
}
