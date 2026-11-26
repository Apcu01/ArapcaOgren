import 'server-only';
import { desc, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { buildSafe, cached } from './cache';
import type { NewsItem } from './news-shared';

const N = schema.news;
const toItem = (r: typeof N.$inferSelect): NewsItem => ({ id: r.id, title: r.title, body: r.body, link: r.link, published: r.published, at: r.createdAt.getTime() });

/** Yayındaki yazılar, yeniden eskiye; all: yönetim paneli için yayında olmayanlar da */
export const getNews = (opts: { all?: boolean } = {}): Promise<NewsItem[]> => buildSafe(() => cached('news:' + (opts.all ? 'all' : 'pub'), async () => {
  const rows = await (opts.all ? db.select().from(N) : db.select().from(N).where(eq(N.published, true)))
    .orderBy(desc(N.createdAt), desc(N.id)).limit(200);
  return rows.map(toItem);
}), []);

/**
 * Başlıktaki nokta için en yeni yayındaki yazının numarası (yazı yoksa 0).
 * Her sayfada çağrılır: tablo henüz yoksa (yayından sonra db:migrate çalışmadıysa) site bozulmasın, 0 döner.
 */
export async function latestNewsId(): Promise<number> {
  try {
    return (await getNews()).reduce((m, x) => Math.max(m, x.id), 0);
  } catch (e) {
    console.warn('Yenilikler okunamadı:', (e as Error).message);
    return 0;
  }
}
