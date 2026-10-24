import { and, eq, ne, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { adminOrFail } from '@/lib/admin';
import { fail, ok, parse } from '@/lib/api';
import { resetProgress } from '@/lib/progress';

type Ctx = { params: Promise<{ id: string }> };

async function otherAdmins(id: number) {
  const [r] = await db.select({ n: sql<number>`count(*)` }).from(schema.users).where(and(eq(schema.users.role, 'admin'), ne(schema.users.id, id)));
  return Number(r.n);
}

const Patch = z.object({ role: z.enum(['user', 'admin']).optional(), resetProgress: z.boolean().optional() });

export async function PATCH(req: Request, { params }: Ctx) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const id = Number((await params).id);
  const p = await parse(req, Patch);
  if ('res' in p) return p.res;
  const [u] = await db.select({ id: schema.users.id, role: schema.users.role }).from(schema.users).where(eq(schema.users.id, id));
  if (!u) return fail('Kullanıcı bulunamadı.', 404);
  if (p.data.role && p.data.role !== u.role) {
    if (p.data.role === 'user' && (await otherAdmins(id)) === 0) return fail('Son yöneticinin yetkisi kaldırılamaz.');
    await db.update(schema.users).set({ role: p.data.role }).where(eq(schema.users.id, id));
  }
  if (p.data.resetProgress) await resetProgress(id);
  return ok();
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const id = Number((await params).id);
  if (id === a.user.id) return fail('Kendi hesabını buradan silemezsin; Hesabım sayfasını kullan.');
  const [u] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.id, id));
  if (!u) return fail('Kullanıcı bulunamadı.', 404);
  await db.delete(schema.users).where(eq(schema.users.id, id));
  return ok();
}
