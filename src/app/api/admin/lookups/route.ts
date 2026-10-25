import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { adminOrFail } from '@/lib/admin';
import { ok, parse } from '@/lib/api';

// Önbellekteki bir aramayı siler: aynı kelime tekrar sorulunca yapay zekâdan yeniden alınır
const Del = z.object({ id: z.number().int().positive() });

export async function DELETE(req: Request) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const p = await parse(req, Del);
  if ('res' in p) return p.res;
  await db.delete(schema.lookups).where(eq(schema.lookups.id, p.data.id));
  return ok();
}
