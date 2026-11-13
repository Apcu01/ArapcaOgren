import 'server-only';
import { eq, inArray, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { refreshSite } from './cache';
import { LOOKUP_MODEL } from './lookup';
import { firstIssue, ReadingZ, type ReadingInput } from './reading-schema';
import { bareWord, sentenceAr, type Reading } from './readings';
import { wordSlug } from './slug';
import { audioKey, isAr } from './text';
import { getTopics } from './topics';
import { synthesize } from './tts';

const R = schema.readings;
const READING_MODEL = process.env.READING_MODEL || LOOKUP_MODEL;
/** Kelime sesleriyle aynı ses (scripts/tts.ts) */
const WORD_VOICE = 'george';
const PRICE_PER_CHAR = 40e-6;

const changed = () => refreshSite('readings:');

export async function saveReading(r: ReadingInput, isNew: boolean) {
  const [exists] = await db.select({ slug: R.slug }).from(R).where(eq(R.slug, r.slug)).limit(1);
  if (isNew && exists) return { error: 'Bu adresle bir metin zaten var. Başka bir adres seç.' };
  if (!isNew && !exists) return { error: 'Metin bulunamadı.' };
  const data = { title: r.title, ar: r.ar, level: r.level, topic: r.topic, description: r.desc, sentences: r.sentences, questions: r.questions };
  if (isNew) {
    const [m] = await db.select({ p: sql<number>`COALESCE(MAX(${R.position}), -1)` }).from(R);
    await db.insert(R).values({ slug: r.slug, position: Number(m?.p ?? -1) + 1, ...data });
  } else {
    // Elle düzenlenen taslak artık yapay zekâ taslağı sayılmaz
    await db.update(R).set({ ...data, ai: false }).where(eq(R.slug, r.slug));
  }
  changed();
  return { slug: r.slug };
}

export async function setPublished(slug: string, on: boolean) {
  const r = await db.update(R).set({ published: on }).where(eq(R.slug, slug));
  changed();
  return r[0].affectedRows > 0;
}

export async function deleteReading(slug: string) {
  const r = await db.delete(R).where(eq(R.slug, slug));
  changed();
  return r[0].affectedRows > 0;
}

/** Sırayı bir yukarı ya da aşağı taşır */
export async function moveReading(slug: string, dir: -1 | 1) {
  const rows = await db.select({ slug: R.slug, position: R.position }).from(R).orderBy(R.position, R.createdAt);
  const i = rows.findIndex((x) => x.slug === slug);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return false;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await Promise.all(rows.map((x, k) => db.update(R).set({ position: k, updatedAt: sql`${R.updatedAt}` }).where(eq(R.slug, x.slug))));
  changed();
  return true;
}

/* ---------- Sesler ---------- */
/** Metnin sesi olmayan ifadeleri: Arapça başlık, cümleler ve dokunulunca okunan kelimeler */
export async function missingAudio(r: Pick<Reading, 'ar' | 'sentences'>) {
  const all = new Map<string, string>();
  const add = (s: string) => { const k = audioKey(s); if (k && isAr(s) && !all.has(k)) all.set(k, s.trim()); };
  add(r.ar);
  for (const x of r.sentences) { add(sentenceAr(x)); for (const t of x.w) add(bareWord(t[0])); }
  if (!all.size) return [];
  const have = new Set((await db.select({ k: schema.audio.textKey }).from(schema.audio).where(inArray(schema.audio.textKey, [...all.keys()]))).map((x) => x.k));
  return [...all].filter(([k]) => !have.has(k)).map(([key, text]) => ({ key, text }));
}
export const audioCost = (texts: { text: string }[]) => texts.reduce((n, t) => n + t.text.length, 0) * PRICE_PER_CHAR;

/** Eksik sesleri üretir (en fazla 200 ifade); kaç tanesinin üretildiğini ve hataları döner */
export async function generateAudio(slug: string) {
  const [row] = await db.select().from(R).where(eq(R.slug, slug)).limit(1);
  if (!row) return { error: 'Metin bulunamadı.' };
  if (!process.env.OPENROUTER_API_KEY) return { error: 'OPENROUTER_API_KEY tanımlı değil.' };
  const todo = (await missingAudio(row)).slice(0, 200);
  let made = 0, failed = 0, i = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (i < todo.length) {
      const t = todo[i++];
      try {
        const data = await synthesize(t.text, { voice: WORD_VOICE });
        await db.insert(schema.audio).values({ textKey: t.key, text: t.text.slice(0, 500), mime: 'audio/mpeg', size: data.length, data })
          .onDuplicateKeyUpdate({ set: { data, size: data.length, mime: 'audio/mpeg' } });
        made++;
      } catch (e) { failed++; console.error('Okuma sesi üretilemedi:', (e as Error).message); }
    }
  }));
  if (made) refreshSite('audio:');
  return { made, failed, cost: audioCost(todo) };
}

/* ---------- Yapay zekâ taslağı ---------- */
const tidy = (s: string) => s.replace(/\s[—–]\s/g, ', ').replace(/[—–]/g, '-').replace(/…/g, '...').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
function deepTidy<T>(v: T): T {
  if (typeof v === 'string') return tidy(v) as T;
  if (Array.isArray(v)) return v.map(deepTidy) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepTidy(x)])) as T;
  return v;
}

/** Ayrı verilmiş noktalama önceki kelimeye, tek başına verilmiş bitişik harf (وَ، فَ، بِ، لِ) sonraki kelimeye eklenir */
const PREFIX: Record<string, string> = { 'وَ': 've', 'فَ': 'sonra', 'بِ': 'ile', 'لِ': 'için', 'كَ': 'gibi' };
export function joinTokens(w: [string, string][]): [string, string][] {
  const out: [string, string][] = [];
  let pre: [string, string] | null = null;
  for (const [a, t] of w) {
    if (!/[ء-ي]/.test(a)) {
      if (out.length) out[out.length - 1] = [out[out.length - 1][0] + a, out[out.length - 1][1]];
      continue;
    }
    if (PREFIX[a]) { pre = [a, t]; continue; }
    out.push(pre ? [pre[0] + a, `${PREFIX[pre[0]]} ${t}`] : [a, t]);
    pre = null;
  }
  if (pre) out.push(pre);
  return out;
}

const SYSTEM = `Sen Türk öğrencilere Arapça öğreten bir öğretmensin. İstenen konuda, istenen seviyede kısa bir Arapça okuma metni yazarsın.
Kurallar:
- Fasih (Modern Standart) Arapça, kısa ve basit cümleler. Başlangıç seviyesinde 5-7 kelimelik cümleler, isim cümleleri ve temel fiiller.
- Bütün Arapça metin tam harekeli olmalı (i'rab dahil). Harekeler doğru olmalı.
- Her cümle kelime kelime verilir: "w" dizisinde her öğe [Arapça kelime, o cümledeki Türkçe karşılığı]. Arapça kelime tek parçadır, boşluk içermez.
  Noktalama (، . ؟ !) bitişik olduğu kelimenin içinde kalır. Bitişik edat ve zamirler (وَ، بِ، لِ، ـهُ) kelimeyle birlikte tek öğedir.
- Noktalamayı ve وَ، فَ، بِ، لِ gibi bitişik harfleri ASLA ayrı öğe yapma. Doğru: ["فَأَذْهَبُ","sonra gidiyorum"], ["جِدًّا،","çok"].
- Kelime karşılıkları kısa ve o cümledeki anlama göre olsun ("ve annem", "-de", "gitti (kadın)").
- "tr": cümlenin doğal Türkçe çevirisi.
- Sonda metinle ilgili 4 Türkçe anlama sorusu: her biri 4 seçenekli, "a" doğru seçeneğin aynısı.
- Türkçe metinlerde uzun tire, kıvrık tırnak ve üç nokta karakteri kullanma.
- Yalnızca JSON döndür, başka hiçbir şey yazma. Biçim:
{"title":"Türkçe başlık","ar":"Arapça başlık (harekeli)","desc":"Türkçe tek cümlelik özet","sentences":[{"w":[["كَلِمَةٌ","anlam"]],"tr":"çeviri"}],"questions":[{"q":"soru","options":["a","b","c","d"],"a":"a"}]}`;

export async function draftReading(opts: { theme: string; level: ReadingInput['level']; topic: string | null; count: number }) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return { error: 'OPENROUTER_API_KEY tanımlı değil.' };
  const topic = opts.topic ? (await getTopics({ all: true })).find((t) => t.id === opts.topic) : null;
  const vocab = topic ? topic.words.slice(0, 50).map((w) => `${w.ar} = ${w.tr}`).join('\n') : '';
  const user = [
    `Konu: ${opts.theme}`,
    `Seviye: ${opts.level}`,
    `Cümle sayısı: ${opts.count}`,
    topic ? `Mümkün olduğunca şu dersin ("${topic.name}") kelimelerini kullan:\n${vocab}` : ''
  ].filter(Boolean).join('\n');
  let res: Response;
  try {
    res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: READING_MODEL, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }], max_tokens: 4000, temperature: 0.5, reasoning: { enabled: false }, usage: { include: true } }),
      signal: AbortSignal.timeout(90_000)
    });
  } catch { return { error: 'Yapay zekâya ulaşılamadı. Biraz sonra tekrar dene.' }; }
  const j = (await res.json().catch(() => ({}))) as { choices?: { message?: { content?: string } }[]; usage?: { cost?: number }; error?: { message?: string } };
  if (!res.ok) return { error: 'Yapay zekâ hatası: ' + (j.error?.message || res.status) };
  let raw: Record<string, unknown>;
  try { raw = JSON.parse((j.choices?.[0]?.message?.content || '').trim().replace(/^```(?:json)?\s*|\s*```$/g, '')); } catch { return { error: 'Yapay zekânın cevabı okunamadı. Tekrar dene.' }; }
  raw = deepTidy(raw);
  // Boşluk içeren kelime öğelerini böl (aynı anlamla)
  const sentences = Array.isArray(raw.sentences) ? (raw.sentences as { w?: [string, string][]; tr?: string }[]).map((x) => ({
    tr: String(x.tr || ''),
    w: joinTokens((x.w || []).flatMap(([a, t]) => String(a || '').trim().split(/\s+/).filter(Boolean).map((p) => [p, String(t || '')] as [string, string])))
  })) : [];
  // Benzersiz adres
  const base = wordSlug(String(raw.title || opts.theme)).slice(0, 56) || 'metin';
  const taken = new Set((await db.select({ s: R.slug }).from(R)).map((x) => x.s));
  let slug = base, n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  const parsed = ReadingZ.safeParse({ slug, title: raw.title, ar: raw.ar, level: opts.level, topic: opts.topic, desc: String(raw.desc || ''), sentences, questions: raw.questions || [] });
  if (!parsed.success) return { error: 'Taslak kurallara uymadı (' + firstIssue(parsed.error) + '). Tekrar dene.' };
  const [m] = await db.select({ p: sql<number>`COALESCE(MAX(${R.position}), -1)` }).from(R);
  const r = parsed.data;
  await db.insert(R).values({ slug, position: Number(m?.p ?? -1) + 1, title: r.title, ar: r.ar, level: r.level, topic: r.topic, description: r.desc, sentences: r.sentences, questions: r.questions, published: false, ai: true });
  changed();
  return { slug, cost: j.usage?.cost ?? 0 };
}
