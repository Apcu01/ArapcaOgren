import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { adminOrFail } from '@/lib/admin';
import { fail, ok, parse } from '@/lib/api';
import { TopicInput } from '@/lib/topic-schema';
import { writeTopic } from './write';
import { invalidate } from '@/lib/cache';

// Yeni ders oluştur
export async function POST(req: Request) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const p = await parse(req, TopicInput);
  if ('res' in p) return p.res;
  const exists = await db.select({ id: schema.topics.id }).from(schema.topics).where(eq(schema.topics.id, p.data.id)).limit(1);
  if (exists.length) return fail('Bu kısa adla bir ders zaten var. Başka bir kısa ad seç.', 409);
  const topic = await writeTopic(p.data, true);
  invalidate('topics:');
  return ok({ topic });
}
