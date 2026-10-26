import { eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { adminOrFail } from '@/lib/admin';
import { fail, ok } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };
const L = schema.wordLists;

async function target(params: Ctx['params']) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return null;
  const [l] = await db.select({ id: L.id }).from(L).where(eq(L.id, id));
  return l ?? null;
}

// Denetim: uygunsuz içerikli paylaşılan bir listenin paylaşımını kapat
export async function PATCH(_req: Request, { params }: Ctx) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const l = await target(params);
  if (!l) return fail('Liste bulunamadı.', 404);
  await db.update(L).set({ shareToken: null, updatedAt: sql`${L.updatedAt}` }).where(eq(L.id, l.id));
  return ok();
}

// Denetim: listeyi sil (kelimeleri de silinir; kopyaların asıl listeyle bağı kopar)
export async function DELETE(_req: Request, { params }: Ctx) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const l = await target(params);
  if (!l) return fail('Liste bulunamadı.', 404);
  await db.delete(L).where(eq(L.id, l.id));
  return ok();
}
