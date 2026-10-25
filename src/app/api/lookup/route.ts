import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, ok, parse } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { aiCallsToday, aiLookup, cachedLookup, lexiconLookup, LOOKUP_DAILY_LIMIT } from '@/lib/lookup';
import { limitCheck, recordAttempt } from '@/lib/ratelimit';
import { LOOKUP_RE } from '@/lib/translit';
import { throttle } from '@/lib/throttle';

const Body = z.object({
  q: z.string().trim().min(1, 'Bir kelime yaz.').max(40, 'En fazla 40 karakter yazabilirsin.').regex(LOOKUP_RE, 'Yalnızca harf kullan (en fazla 40 karakter).'),
  // true: yerleşik sözlüğü atla, doğrudan yapay zekâya sor ("Yapay zekâya sor" düğmesi)
  ai: z.boolean().optional()
});

// Ders kelimeleri (sayfada), yerleşik sözlük ve önbellek herkese açık ve sınırsızdır.
// Yalnızca maliyet doğuran yapay zekâ isteği hesap ister ve IP başına saatlik sınıra tabidir.
export async function POST(req: Request) {
  const limited = throttle('lookup', req);
  if (limited) return limited;
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const { q, ai } = p.data;

  // 1) Yerleşik sözlük: ücretsiz ve anında
  if (!ai) {
    const lex = await lexiconLookup(q);
    if (lex) return ok({ source: 'lexicon', ...lex });
  }
  // 2) Daha önce yapay zekâya sorulduysa önbellekten
  const hit = await cachedLookup(q);
  if (hit) return ok({ source: 'cache', ...hit });

  // 3) Yapay zekâ: giriş zorunlu
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Yapay zekâya sormak için giriş yapmalısın.', needLogin: true }, { status: 401 });
  if (!process.env.OPENROUTER_API_KEY) return fail('Yapay zekâ ile arama şu an kapalı.', 503);
  const blocked = await limitCheck('lookup', req, null);
  if (blocked) return blocked;
  if ((await aiCallsToday()) >= LOOKUP_DAILY_LIMIT) return fail('Bugünkü arama sınırına ulaşıldı. Yarın tekrar dene ya da sözlüğe bak.', 503);

  try {
    const result = await aiLookup(q);
    await recordAttempt('lookup', req, null, true);
    return ok({ source: 'ai', ...result });
  } catch (e) {
    console.error('Kelime bul hatası:', (e as Error).message);
    return fail('Şu an cevap alınamadı. Biraz sonra tekrar dene.', 502);
  }
}
