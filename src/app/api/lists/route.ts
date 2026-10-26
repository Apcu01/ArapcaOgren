import { getSessionUser } from '@/lib/auth';
import { fail, ok, parse } from '@/lib/api';
import { countLists, createList, listLists } from '@/lib/lists';
import { LISTS_MAX } from '@/lib/study';
import { ListZ } from './schema';

// Kişisel kelime listeleri: hepsi hesap ister
export async function GET() {
  const user = await getSessionUser();
  if (!user) return fail('Listelerini görmek için giriş yapmalısın.', 401);
  return Response.json({ lists: await listLists(user.id) }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail('Liste oluşturmak için giriş yapmalısın.', 401);
  const p = await parse(req, ListZ);
  if ('res' in p) return p.res;
  if ((await countLists(user.id)) >= LISTS_MAX) return fail(`En fazla ${LISTS_MAX} liste oluşturabilirsin.`);
  const { title, description, items } = p.data;
  return ok({ id: await createList(user.id, title, description, items) });
}
