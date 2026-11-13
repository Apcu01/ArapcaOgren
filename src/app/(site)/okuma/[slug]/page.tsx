import { notFound } from 'next/navigation';
import ReadingView from '@/components/reading/ReadingView';
import { sentenceAr } from '@/lib/readings';
import { getReading, getReadings } from '@/lib/reading-store';
import { SITE_NAME } from '@/lib/site';
import { getTopics } from '@/lib/topics';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getReadings()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params) {
  const r = await getReading((await params).slug);
  if (!r) return { title: 'Metin bulunamadı', robots: { index: false } };
  return {
    title: `${r.title}: Arapça okuma metni`,
    description: `${r.desc} Kelime kelime anlamı, sesi ve anlama sorularıyla.`,
    alternates: { canonical: `/okuma/${r.slug}` }
  };
}

export default async function ReadingPage({ params }: Params) {
  const r = await getReading((await params).slug);
  if (!r) notFound();
  const [topics, all] = await Promise.all([getTopics(), getReadings()]);
  const t = topics.find((x) => x.id === r.topic);
  const i = all.findIndex((x) => x.slug === r.slug);
  const next = all[i + 1] || all[0];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article', headline: `${r.title} (${r.ar})`, inLanguage: 'ar',
        description: r.desc, articleBody: r.sentences.map(sentenceAr).join(' '), publisher: { '@type': 'Organization', name: SITE_NAME }
      }) }} />
      <ReadingView reading={r} lesson={t ? { id: t.id, name: t.name } : null} next={next.slug === r.slug ? null : { slug: next.slug, title: next.title }} />
    </>
  );
}
