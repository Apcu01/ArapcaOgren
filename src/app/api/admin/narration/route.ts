import { z } from 'zod';
import { adminOrFail } from '@/lib/admin';
import { fail, ok, parse } from '@/lib/api';
import { ensureNarration, getNarrationIds, pruneNarration } from '@/lib/narration';
import { getTopic } from '@/lib/topics';

// Yönetim panelinden bir bölümün (ya da özetin) anlatım sesini kayıtlı metne göre üret
const Body = z.object({ topicId: z.string().min(1).max(64), part: z.union([z.number().int().min(0).max(200), z.literal('summary'), z.literal('all')]) });

export async function POST(req: Request) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  if (!process.env.OPENROUTER_API_KEY) return fail('Sunucuda OPENROUTER_API_KEY tanımlı değil.', 500);
  const t = await getTopic(p.data.topicId, { all: true });
  if (!t) return fail('Ders bulunamadı.', 404);
  const texts: string[] = [];
  if (p.data.part === 'all') {
    texts.push(...t.lesson.map((s) => s.narr || '').filter((x) => x.trim()));
    if (t.summaryNarr?.trim()) texts.push(t.summaryNarr);
  } else {
    const text = p.data.part === 'summary' ? t.summaryNarr : t.lesson[p.data.part]?.narr;
    if (!text?.trim()) return fail('Bu bölümün kayıtlı bir anlatım metni yok. Önce metni yazıp dersi kaydet.');
    texts.push(text);
  }
  try {
    for (const x of texts) await ensureNarration(t.id, x);
  } catch (e) {
    return fail((e as Error).message, 502);
  }
  await pruneNarration(t);
  return ok({ ids: await getNarrationIds(t) });
}
