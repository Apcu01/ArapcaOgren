import 'server-only';
import { db, schema } from '@/db';
import { buildSafe, cached } from './cache';
import { TYPE_LABEL } from './lexicon';
import { getTopics } from './topics';
import { wordSlug } from './slug';

/* Kelime sayfaları (/kelime/[slug]): yerleşik sözlük ve ders kelimeleri tek listede */
export type WordPage = {
  slug: string; ar: string; tl: string; tr: string; en: string; type: string;
  note?: string; muAr?: string; muTl?: string;
  topics: { id: string; name: string }[];
};

export const getWordIndex = () => buildSafe(() => cached('words:index', async () => {
  const [lex, topics] = await Promise.all([db.select().from(schema.lexicon), getTopics()]);
  const byAr = new Map<string, Omit<WordPage, 'slug'>>();
  for (const r of lex) {
    byAr.set(r.ar, { ar: r.ar, tl: r.tl, tr: r.tr, en: r.en, type: TYPE_LABEL[r.type] || r.type, note: r.note ?? undefined, muAr: r.muAr ?? undefined, muTl: r.muTl ?? undefined, topics: [] });
  }
  // Ders kelimeleri: sözlükte varsa derse bağlanır, yoksa eklenir
  for (const t of topics) for (const w of t.words || []) {
    if (!w.tl) continue;
    const ref = { id: t.id, name: t.name };
    const hit = byAr.get(w.ar);
    if (hit) { if (!hit.topics.some((x) => x.id === t.id)) hit.topics.push(ref); }
    else byAr.set(w.ar, { ar: w.ar, tl: w.tl, tr: w.tr, en: w.en || '', type: '', note: w.note, topics: [ref] });
  }
  // Adres: okunuştan; aynı okunuşlu kelimeler anlamıyla ayrılır (ma-su, ma-ne)
  const list = [...byAr.values()].sort((a, b) => a.tl.localeCompare(b.tl, 'tr'));
  const groups = new Map<string, typeof list>();
  for (const w of list) {
    const base = wordSlug(w.tl);
    if (!base) continue;
    groups.set(base, [...(groups.get(base) || []), w]);
  }
  const out: WordPage[] = [];
  const used = new Set<string>();
  for (const [base, ws] of groups) {
    for (const w of ws) {
      let slug = ws.length === 1 ? base : `${base}-${wordSlug(w.tr.split(/[,(;]/)[0]).split('-').slice(0, 2).join('-')}`;
      for (let i = 2; used.has(slug); i++) slug = `${base}-${i}`;
      used.add(slug);
      out.push({ slug, ...w });
    }
  }
  return out;
}), [] as WordPage[]);

export async function getWord(slug: string) {
  return (await getWordIndex()).find((w) => w.slug === slug) ?? null;
}

/** Arapça yazım -> sayfa adresi (Kelime bul ve sözlükten bağlantı vermek için) */
export async function getWordSlugMap() {
  return Object.fromEntries((await getWordIndex()).map((w) => [w.ar, w.slug]));
}

/** Hazır listenin kelimeleri: okunuş, anlam ve kelime sayfası adresiyle (sözlükte bulunamayan atlanır) */
export async function readyWords(words: string[]) {
  const byAr = new Map((await getWordIndex()).map((w) => [w.ar, w]));
  return words.flatMap((ar) => {
    const w = byAr.get(ar);
    return w ? [{ ar: w.ar, tl: w.tl, tr: w.tr, slug: w.slug }] : [];
  });
}
