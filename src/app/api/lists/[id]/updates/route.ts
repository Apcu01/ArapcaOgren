import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { fail, ok, parse } from '@/lib/api';
import { applyUpdates, getUpdates } from '@/lib/lists';
import { listId } from '../../schema';

type Ctx = { params: Promise<{ id: string }> };
const ids = z.array(z.number().int().positive()).max(300);
const Body = z.object({ add: ids, change: ids, remove: ids });

// Kopyalanan listenin asıl listesindeki değişiklikler: GET gösterir, POST seçilenleri uygular (seçilmeyenler bir daha önerilmez)
export async function GET(_req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const id = listId((await params).id);
  if (!id) return fail('Liste bulunamadı.', 404);
  return Response.json({ updates: await getUpdates(user.id, id) }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function POST(req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const id = listId((await params).id);
  if (!id) return fail('Liste bulunamadı.', 404);
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const r = await applyUpdates(user.id, id, p.data);
  if (!r) return fail('Asıl liste artık paylaşılmıyor.', 404);
  return ok(r);
}
