import { fail, ok } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { deleteLiveResult, getLiveResult } from '@/lib/live-history';

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (params: Ctx['params']) => { const n = Number((await params).id); return Number.isInteger(n) && n > 0 ? n : null; };

export async function GET(_req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const id = await idOf(params);
  const r = id ? await getLiveResult(user.id, id) : null;
  if (!r) return fail('Yarışma bulunamadı.', 404);
  return Response.json({ report: r.report }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const id = await idOf(params);
  if (!id || !(await deleteLiveResult(user.id, id))) return fail('Yarışma bulunamadı.', 404);
  return ok();
}
