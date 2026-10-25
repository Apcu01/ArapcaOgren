import LookupView, { type DictWord } from '@/components/LookupView';
import { getTopics } from '@/lib/topics';
import { getWordSlugMap } from '@/lib/words';

export const metadata = {
  title: 'Kelime bul',
  description: 'Arapça bir kelimeyi duyduğun gibi Latin harfleriyle yaz (ketebe, afvan, müderris); harekeli yazılışını, anlamını, kökünü ve örnek cümlesini gör.',
  alternates: { canonical: '/kelime-bul' }
};

// Önceden hazırlanır; ?q= aramayı tarayıcı okur
export default async function LookupPage() {
  const [topics, slugs] = await Promise.all([getTopics(), getWordSlugMap()]);
  // Derslerdeki kelimeler: önce bunlarda aranır (ücretsiz ve anında)
  const seen = new Map<string, DictWord>();
  for (const t of topics) for (const w of t.words || []) {
    const k = w.ar + '|' + w.tr;
    const ref = { id: t.id, name: t.name };
    if (seen.has(k)) seen.get(k)!.topics.push(ref);
    else seen.set(k, { ar: w.ar, tr: w.tr, tl: w.tl || '', en: w.en || '', topics: [ref] });
  }
  return <LookupView words={[...seen.values()]} slugs={slugs} />;
}
