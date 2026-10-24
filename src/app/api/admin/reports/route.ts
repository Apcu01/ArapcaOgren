import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { adminOrFail } from '@/lib/admin';
import { ok, parse } from '@/lib/api';

const Patch = z.object({ id: z.number().int().positive(), status: z.enum(['open', 'done']) });
const Del = z.object({ id: z.number().int().positive() });

export async function PATCH(req: Request) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const p = await parse(req, Patch);
  if ('res' in p) return p.res;
  await db.update(schema.reports)
    .set({ status: p.data.status, resolvedAt: p.data.status === 'done' ? new Date() : null })
    .where(eq(schema.reports.id, p.data.id));
  return ok();
}

export async function DELETE(req: Request) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const p = await parse(req, Del);
  if ('res' in p) return p.res;
  await db.delete(schema.reports).where(eq(schema.reports.id, p.data.id));
  return ok();
}
