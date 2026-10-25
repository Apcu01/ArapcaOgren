import type { Metadata } from 'next';
import Link from 'next/link';
import TopicView from '@/components/TopicView';
import { SITE_NAME, siteOrigin } from '@/lib/site';
import { getNarrationIds } from '@/lib/narration';
import { getTopics } from '@/lib/topics';
import type { Topic } from '@/lib/types';
import { I, Raw } from '@/components/icons';

type Props = { params: Promise<{ id: string }> };

// Ders sayfaları önceden hazırlanır; yeni eklenen dersler ilk ziyarette hazırlanıp saklanır.
// Yalnızca yayındaki dersler gösterilir; taslaklar yönetim panelinden önizlenir.
export const dynamicParams = true;
export async function generateStaticParams() {
  return (await getTopics()).map((t) => ({ id: t.id }));
}

// Meta açıklamalarda HTML, {{ }} işaretleri ve fazla boşluk olmasın
const plain = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\{\{|\}\}/g, '').replace(/\s+/g, ' ').trim();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = (await getTopics()).find((x) => x.id === id);
  if (!t) return { title: 'Konu bulunamadı', robots: { index: false } };
  const title = `${t.name}: Arapça ${t.name.toLocaleLowerCase('tr')} konu anlatımı ve alıştırmalar`;
  const description = plain(t.long || t.desc).slice(0, 160);
  const url = `/konu/${t.id}`;
  return {
    title,
    description,
    keywords: [`Arapça ${t.name.toLocaleLowerCase('tr')}`, ...(t.tags || '').split(/\s+/).filter(Boolean).slice(0, 12)],
    alternates: { canonical: url },
    openGraph: { type: 'article', title: `${t.name} | ${SITE_NAME}`, description, url, images: [{ url: `/og?id=${t.id}`, width: 1200, height: 630, alt: t.name }] },
    twitter: { card: 'summary_large_image', title: `${t.name} | ${SITE_NAME}`, description, images: [`/og?id=${t.id}`] }
  };
}

// Google için yapılandırılmış veri: ders (Course) ve sayfa yolu
function jsonLd(t: Topic) {
  const base = siteOrigin();
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: `Arapça: ${t.name}`,
      description: plain(t.long || t.desc),
      inLanguage: 'tr',
      educationalLevel: t.level,
      isAccessibleForFree: true,
      url: `${base}/konu/${t.id}`,
      provider: { '@type': 'Organization', name: SITE_NAME, url: base },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: `PT${(t.readMins || 10) + t.acts.length * 5}M` },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'TRY', category: 'Free' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Kategoriler', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: t.name, item: `${base}/konu/${t.id}` }
      ]
    }
  ];
}

function TopicNotFound() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-24 text-center flex flex-col gap-4 items-center">
      <h1 className="m-0 text-3xl font-bold">Konu bulunamadı</h1>
      <p className="m-0 text-mute">Aradığın konu mevcut değil ya da adresi değişmiş olabilir.</p>
      <Link href="/" className="inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold hover:text-onacc">Kategorilere dön <Raw html={I.arrow()} /></Link>
    </div>
  );
}

export default async function TopicPage({ params }: Props) {
  const { id } = await params;
  const all = await getTopics();
  const idx = all.findIndex((x) => x.id === id);
  const t = all[idx];
  if (!t) return <TopicNotFound />;
  const nav = (x?: { id: string; name: string }) => (x ? { id: x.id, name: x.name } : null);
  const narr = await getNarrationIds(t);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(t)).replace(/</g, '\\u003c') }} />
      <TopicView topic={t} prev={nav(all[idx - 1])} next={nav(all[idx + 1])} narr={narr} />
    </>
  );
}
