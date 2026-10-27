import { z } from 'zod';
import { fail, ok, parse } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { getList, getShared } from '@/lib/lists';
import { buildQuestions, createGame } from '@/lib/live';
import { throttle } from '@/lib/throttle';
import { getTopics } from '@/lib/topics';
import { readyList } from '@/lib/ready-lists';
import { readyWords } from '@/lib/words';

const Body = z.object({
  source: z.discriminatedUnion('type', [
    z.object({ type: z.literal('topic'), id: z.string().min(1).max(64) }),
    z.object({ type: z.literal('list'), id: z.number().int().positive() }),
    z.object({ type: z.literal('shared'), token: z.string().min(16).max(32) }),
    z.object({ type: z.literal('ready'), slug: z.string().min(1).max(64) })
  ]),
  count: z.number().int().min(3).max(40),
  seconds: z.union([z.literal(10), z.literal(20), z.literal(30), z.literal(60)]),
  dir: z.enum(['ar', 'tr', 'mix'])
});

// Canlı yarışma açar. Hesap gerekmez; yalnızca kendi listesiyle açmak için giriş gerekir
export async function POST(req: Request) {
  const limited = throttle('liveCreate', req);
  if (limited) return limited;
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const { source, count, seconds, dir } = p.data;
  let title = '';
  let words: { ar: string; tl: string; tr: string }[] = [];
  if (source.type === 'topic') {
    const t = (await getTopics()).find((x) => x.id === source.id);
    if (!t) return fail('Ders bulunamadı.', 404);
    title = t.name;
    words = (t.words || []).map((w) => ({ ar: w.ar, tl: w.tl || '', tr: w.tr }));
  } else if (source.type === 'list') {
    const user = await getSessionUser();
    if (!user) return fail('Kendi listenle yarışma açmak için giriş yapmalısın.', 401);
    const l = await getList(user.id, source.id);
    if (!l) return fail('Liste bulunamadı.', 404);
    title = l.title;
    words = l.items;
  } else if (source.type === 'ready') {
    const l = readyList(source.slug);
    if (!l) return fail('Liste bulunamadı.', 404);
    title = l.title;
    words = await readyWords(l.words);
  } else {
    const l = await getShared(source.token);
    if (!l) return fail('Bu liste artık paylaşılmıyor.', 404);
    title = l.title;
    words = l.items;
  }
  // Aynı Arapça yazım bir kez sorulur
  const seen = new Set<string>();
  words = words.filter((w) => w.ar && w.tr && !seen.has(w.ar) && seen.add(w.ar));
  if (words.length < 4) return fail('Yarışma için en az 4 kelime gerekir.');
  // Giriş yapmış öğretmenin yarışma sonuçları geçmişine kaydedilir
  const host = await getSessionUser();
  const game = createGame(title, buildQuestions(words, Math.min(count, words.length), dir), seconds, host?.id ?? null);
  if (!game) return fail('Şu an çok fazla yarışma var. Biraz sonra tekrar dene.', 503);
  return ok(game);
}
