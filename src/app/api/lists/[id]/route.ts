import { getSessionUser } from '@/lib/auth';
import { fail, ok, parse } from '@/lib/api';
import { deleteList, getList, saveList } from '@/lib/lists';
import { ListZ, listId } from '../schema';

type Ctx = { params: Promise<{ id: string }> };
const MISSING = 'Liste bulunamadı.';

export async function GET(_req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const id = listId((await params).id);
  const list = id ? await getList(user.id, id) : null;
  if (!list) return fail(MISSING, 404);
  return Response.json({ list }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function PUT(req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const id = listId((await params).id);
  if (!id) return fail(MISSING, 404);
  const p = await parse(req, ListZ);
  if ('res' in p) return p.res;
  const { title, description, items } = p.data;
  if (!(await saveList(user.id, id, title, description, items))) return fail(MISSING, 404);
  return ok();
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const id = listId((await params).id);
  if (!id || !(await deleteList(user.id, id))) return fail(MISSING, 404);
  return ok();
}
