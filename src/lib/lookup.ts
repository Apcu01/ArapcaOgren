import 'server-only';
import { eq, gte, sql, count } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { cached } from './cache';
import { indexLexicon, matchLexicon, toLookupResult, type LexEntry } from './lexicon';
import { isAr, normAr } from './text';
import type { LookupResult } from './types';

/* Kelime bul: Latin harfli okunuştan Arapça kelimeyi yapay zekâ ile bulur. Sonuçlar veritabanında önbelleğe alınır. */
export const LOOKUP_MODEL = process.env.LOOKUP_MODEL || 'deepseek/deepseek-v4-flash-0731';
/** Bir günde modele gidebilecek en fazla arama (önbellekten gelenler hariç); beklenmedik faturaya karşı tavan */
export const LOOKUP_DAILY_LIMIT = Number(process.env.LOOKUP_DAILY_LIMIT || 2000);

const SYSTEM = `Sen Türkçe konuşan Arapça öğrencilerine yardım eden bir sözlüksün.
Kullanıcı bir Arapça kelimeyi ya da kısa ifadeyi Latin harfleriyle, duyduğu gibi yazar. Yazım Türkçe ya da İngilizce okunuş kurallarına göre olabilir, harekeleri (kısa ünlüleri) yanlış olabilir, şedde ve uzatmaları atlanmış olabilir, fiil çekimli olabilir (ketebtu = كَتَبْتُ). Kullanıcı Arapça harflerle de yazabilir.
Görevin: bu yazıma uyan gerçek Modern Standart Arapça kelimeleri bulmak.
Kurallar:
- Yalnızca gerçekten var olan, yaygın kelimeleri ver. Asla kelime uydurma. Emin değilsen ya da uyan kelime yoksa "results" boş olsun ve "note" alanında kısaca açıkla.
- En olası kelime önce gelsin. Yazım gerçekten birden fazla yaygın kelimeye uyuyorsa en fazla 3 sonuç ver; uymuyorsa tek sonuç yeter.
- "ar": tam harekeli Arapça yazılış (kelime çekimliyse çekimli hâli).
- "tl": Türkçe okunuş kurallarıyla (ş, ç, â, î, û; ayn için ‘ işareti), örneğin ketebe, ‘afven, müderris.
- "tr": kısa ve doğru Türkçe anlam(lar). "en": kısa İngilizce anlam.
- "type": isim, fiil, sıfat, harf, zamir ya da kalıp ifade. Fiil çekimliyse kısaca hangi çekim olduğunu "note" alanında söyle.
- "root": kök harfleri aralarında boşlukla (ك ت ب); kökü yoksa boş.
- "example": harekeli, basit ve doğal bir örnek cümle ve Türkçesi.
- "note": gerekirse tek cümlelik Türkçe açıklama (yazım düzeltmesi, sık karıştırılan kelime); yoksa boş.
Yalnızca şu biçimde geçerli JSON döndür, başka hiçbir şey yazma:
{"results":[{"ar":"","tl":"","tr":"","en":"","type":"","root":"","example":{"ar":"","tr":""}}],"note":""}`;

const str = (max: number) => z.string().trim().max(max);
const Result = z.object({
  results: z.array(z.object({
    ar: str(80).refine(isAr, 'Arapça değil'),
    tl: str(80),
    tr: str(300).min(1),
    en: str(200).optional().default(''),
    type: str(40).optional().default(''),
    root: str(20).optional().default(''),
    example: z.object({ ar: str(200).default(''), tr: str(300).default('') }).optional()
  })).max(3),
  note: str(400).optional().default('')
});

/** Önbellek anahtarı: Arapça yazımda harekesiz biçim, Latin yazımda küçük harf */
export const lookupKey = (q: string) =>
  isAr(q) ? 'ar:' + normAr(q).replace(/\s+/g, ' ').trim() : 'tl:' + q.trim().toLocaleLowerCase('tr').replace(/\s+/g, ' ');

export async function cachedLookup(q: string): Promise<LookupResult | null> {
  const key = lookupKey(q);
  const [row] = await db.select({ id: schema.lookups.id, result: schema.lookups.result }).from(schema.lookups).where(eq(schema.lookups.qkey, key)).limit(1);
  if (!row) return null;
  await db.update(schema.lookups).set({ hits: sql`hits + 1`, lastAt: new Date() }).where(eq(schema.lookups.id, row.id));
  return row.result;
}

export async function aiCallsToday() {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const [r] = await db.select({ n: count() }).from(schema.lookups).where(gte(schema.lookups.createdAt, start));
  return r?.n ?? 0;
}

async function callModel(q: string): Promise<{ result: LookupResult; cost: number }> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY tanımlı değil.');
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: LOOKUP_MODEL,
          messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: q }],
          max_tokens: 900,
          temperature: 0.2,
          reasoning: { enabled: false },
          usage: { include: true }
        }),
        signal: AbortSignal.timeout(25_000)
      });
      const j = await r.json() as { choices?: { message?: { content?: string } }[]; usage?: { cost?: number }; error?: { message?: string } };
      if (!r.ok) throw new Error(j.error?.message || 'HTTP ' + r.status);
      const text = (j.choices?.[0]?.message?.content || '').trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
      const parsed = Result.safeParse(JSON.parse(text));
      if (!parsed.success) throw new Error('Geçersiz cevap biçimi');
      // Boş örnek cümleleri at
      const results = parsed.data.results.map(({ example, ...r }) => (example?.ar ? { ...r, example: { ar: example.ar, tr: example.tr } } : r));
      return { result: { results, note: parsed.data.note }, cost: j.usage?.cost ?? 0 };
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

/** Modele sorar ve sonucu önbelleğe yazar */
export async function aiLookup(q: string): Promise<LookupResult> {
  const { result, cost } = await callModel(q);
  await db.insert(schema.lookups)
    .values({ qkey: lookupKey(q), query: q.trim().slice(0, 80), model: LOOKUP_MODEL, result, cost })
    .onDuplicateKeyUpdate({ set: { hits: sql`hits + 1` } });
  return result;
}

/** Yerleşik sözlük (lexicon tablosu): okunuş anahtarlarıyla birlikte bellekte tutulur */
const lexIndex = () => cached('lexicon:index', async () => {
  const rows = await db.select().from(schema.lexicon);
  const list: LexEntry[] = rows.map((r) => ({ ar: r.ar, tl: r.tl, tr: r.tr, en: r.en, type: r.type, variants: r.variants || [], muAr: r.muAr ?? undefined, muTl: r.muTl ?? undefined, note: r.note ?? undefined }));
  return indexLexicon(list);
});

/** Yerleşik sözlükte arar; bulunursa yapay zekâya gerek kalmaz */
export async function lexiconLookup(q: string): Promise<(LookupResult & { match: 'exact' | 'near' }) | null> {
  const m = matchLexicon(await lexIndex(), q);
  return m ? { ...toLookupResult(m), match: m.kind } : null;
}
