import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, ok, parse } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { aiCallsToday, aiLookup, cachedLookup, lexiconLookup, LOOKUP_DAILY_LIMIT } from '@/lib/lookup';
import { logLookup } from '@/lib/lookup-log';
import { limitCheck, recordAttempt } from '@/lib/ratelimit';
import { LOOKUP_RE } from '@/lib/translit';
import { throttle } from '@/lib/throttle';
import type { LookupResult } from '@/lib/types';

const Body = z.object({
  q: z.string().trim().min(1, 'Bir kelime yaz.').max(40, 'En fazla 40 karakter yazabilirsin.').regex(LOOKUP_RE, 'Yalnızca harf kullan (en fazla 40 karakter).'),
  // true: yerleşik sözlüğü atla, doğrudan yapay zekâya sor ("Yapay zekâya sor" düğmesi)
  ai: z.boolean().optional(),
  // Yönetim panelindeki arama günlüğü için (misafirleri ayırt etmek)
  anonId: z.string().max(64).nullable().optional()
});

const first = (r: LookupResult) => ({ ar: r.results[0]?.ar, tr: r.results[0]?.tr });

// Ders kelimeleri (sayfada), yerleşik sözlük ve önbellek herkese açık ve sınırsızdır.
// Yalnızca maliyet doğuran yapay zekâ isteği hesap ister ve IP başına saatlik sınıra tabidir.
export async function POST(req: Request) {
  const limited = throttle('lookup', req);
  if (limited) return limited;
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const { q, ai, anonId } = p.data;
  const user = await getSessionUser();
  const log = (source: Parameters<typeof logLookup>[0]['source'], extra: { near?: boolean; ar?: string; tr?: string } = {}) =>
    logLookup({ q, source, userId: user?.id, anonId, ...extra });

  // 1) Yerleşik sözlük: ücretsiz ve anında
  if (!ai) {
    const lex = await lexiconLookup(q);
    if (lex) { await log('lexicon', { near: lex.match === 'near', ...first(lex) }); return ok({ source: 'lexicon', ...lex }); }
  }
  // 2) Daha önce yapay zekâya sorulduysa önbellekten
  const hit = await cachedLookup(q);
  if (hit) { await log(hit.results.length ? 'cache' : 'none', first(hit)); return ok({ source: 'cache', ...hit }); }

  // 3) Yapay zekâ: giriş zorunlu
  if (!user) { await log('login'); return NextResponse.json({ error: 'Yapay zekâya sormak için giriş yapmalısın.', needLogin: true }, { status: 401 }); }
  if (!process.env.OPENROUTER_API_KEY) return fail('Yapay zekâ ile arama şu an kapalı.', 503);
  const blocked = await limitCheck('lookup', req, null);
  if (blocked) return blocked;
  if ((await aiCallsToday()) >= LOOKUP_DAILY_LIMIT) return fail('Bugünkü arama sınırına ulaşıldı. Yarın tekrar dene ya da sözlüğe bak.', 503);

  try {
    const result = await aiLookup(q);
    await recordAttempt('lookup', req, null, true);
    await log(result.results.length ? 'ai' : 'none', first(result));
    return ok({ source: 'ai', ...result });
  } catch (e) {
    console.error('Kelime bul hatası:', (e as Error).message);
    await log('error');
    return fail('Şu an cevap alınamadı. Biraz sonra tekrar dene.', 502);
  }
}
