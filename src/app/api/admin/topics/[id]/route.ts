import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { adminOrFail } from '@/lib/admin';
import { fail, ok, parse } from '@/lib/api';
import { TopicInput } from '@/lib/topic-schema';
import { writeTopic } from '../write';

type Ctx = { params: Promise<{ id: string }> };

async function exists(id: string) {
  const r = await db.select({ id: schema.topics.id }).from(schema.topics).where(eq(schema.topics.id, id)).limit(1);
  return r.length > 0;
}

// Dersi kaydet (tüm içerik + etkinlikler)
export async function PUT(req: Request, { params }: Ctx) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const { id } = await params;
  if (!(await exists(id))) return fail('Ders bulunamadı.', 404);
  const p = await parse(req, TopicInput);
  if ('res' in p) return p.res;
  if (p.data.id !== id) return fail('Dersin kısa adı değiştirilemez.');
  const topic = await writeTopic(p.data, false);
  return ok({ topic });
}

// Yayın durumu / sıra gibi hızlı değişiklikler
const Patch = z.object({ published: z.boolean().optional(), n: z.number().int().min(0).max(9999).optional() });
export async function PATCH(req: Request, { params }: Ctx) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const { id } = await params;
  const p = await parse(req, Patch);
  if ('res' in p) return p.res;
  if (!(await exists(id))) return fail('Ders bulunamadı.', 404);
  if (Object.keys(p.data).length) await db.update(schema.topics).set(p.data).where(eq(schema.topics.id, id));
  return ok();
}

// Dersi, etkinliklerini ve bu derse ait kullanıcı ilerlemesini sil
export async function DELETE(_req: Request, { params }: Ctx) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const { id } = await params;
  if (!(await exists(id))) return fail('Ders bulunamadı.', 404);
  await db.transaction(async (tx) => {
    await tx.delete(schema.activityProgress).where(eq(schema.activityProgress.topicId, id));
    await tx.delete(schema.topicProgress).where(eq(schema.topicProgress.topicId, id));
    await tx.delete(schema.topics).where(eq(schema.topics.id, id));
  });
  return ok();
}
