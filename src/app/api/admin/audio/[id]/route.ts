import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { adminOrFail } from '@/lib/admin';
import { fail, ok } from '@/lib/api';
import { refreshSite } from '@/lib/cache';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return fail('Geçersiz kayıt.');
  await db.delete(schema.audio).where(eq(schema.audio.id, id));
  refreshSite('audio:');
  return ok();
}
