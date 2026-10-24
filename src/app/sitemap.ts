import type { MetadataRoute } from 'next';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { siteOrigin } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteOrigin();
  const topics = await db.select({ id: schema.topics.id, updatedAt: schema.topics.updatedAt }).from(schema.topics).where(eq(schema.topics.published, true));
  const last = topics.reduce((m, t) => (t.updatedAt > m ? t.updatedAt : m), new Date(0));
  return [
    { url: `${base}/`, lastModified: last, changeFrequency: 'weekly', priority: 1 },
    ...topics.map((t) => ({ url: `${base}/konu?id=${t.id}`, lastModified: t.updatedAt, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${base}/alfabe`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${base}/sozluk`, lastModified: last, changeFrequency: 'weekly', priority: 0.6 }
  ];
}
