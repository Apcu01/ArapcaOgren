import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { adminOrFail } from '@/lib/admin';
import { fail, ok, parse } from '@/lib/api';
import { refreshSite } from '@/lib/cache';
import { isNewsLink, NEWS_LIMITS } from '@/lib/news-shared';
import { cleanText } from '@/lib/text';

// Yenilikler yazıları: ekleme, düzenleme, silme (yalnızca yönetici). Sonra bütün sayfalar yenilenir: başlıktaki nokta herkese görünür.
const clean = (s: string) => cleanText(s).trim();
const Fields = z.object({
  title: z.string().transform(clean).pipe(z.string().min(1, 'Başlık yaz.').max(NEWS_LIMITS.title, `Başlık en fazla ${NEWS_LIMITS.title} karakter olabilir.`)),
  body: z.string().transform(clean).pipe(z.string().max(NEWS_LIMITS.body, `Yazı en fazla ${NEWS_LIMITS.body} karakter olabilir.`)),
  link: z.string().transform(clean).pipe(z.string().max(NEWS_LIMITS.link).refine((s) => !s || isNewsLink(s), 'Bağlantı site içinden olmalı ve "/" ile başlamalı (ör. /okuma).')),
  published: z.boolean()
});
const Id = z.object({ id: z.number().int().positive() });

export async function POST(req: Request) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const p = await parse(req, Fields);
  if ('res' in p) return p.res;
  const { title, body, link, published } = p.data;
  const [r] = await db.insert(schema.news).values({ title, body, link: link || null, published }).$returningId();
  refreshSite('news:');
  return ok({ id: r.id });
}

export async function PATCH(req: Request) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const p = await parse(req, Fields.partial().extend(Id.shape));
  if ('res' in p) return p.res;
  const { id, link, ...rest } = p.data;
  const set = { ...rest, ...(link !== undefined ? { link: link || null } : {}) };
  if (!Object.keys(set).length) return fail('Değişiklik yok.');
  await db.update(schema.news).set(set).where(eq(schema.news.id, id));
  refreshSite('news:');
  return ok();
}

export async function DELETE(req: Request) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const p = await parse(req, Id);
  if ('res' in p) return p.res;
  await db.delete(schema.news).where(eq(schema.news.id, p.data.id));
  refreshSite('news:');
  return ok();
}
