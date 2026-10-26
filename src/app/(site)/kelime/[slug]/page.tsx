import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ar, SayBtn } from '@/components/AppProvider';
import AddToList from '@/components/lists/AddToList';
import { I, Raw } from '@/components/icons';
import { rootOf, spaced } from '@/lib/roots';
import { SITE_NAME, siteOrigin } from '@/lib/site';
import { getWord, getWordIndex } from '@/lib/words';

type Props = { params: Promise<{ slug: string }> };

// Kelime sayfaları önceden hazırlanır; yeni kelimeler ilk ziyarette hazırlanıp saklanır
export const dynamicParams = true;
export async function generateStaticParams() {
  return (await getWordIndex()).map((w) => ({ slug: w.slug }));
}

const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr') + s.slice(1);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = await getWord((await params).slug);
  if (!w) return { title: 'Kelime bulunamadı', robots: { index: false } };
  const title = `${cap(w.tl)} ne demek? ${w.ar} Arapça anlamı`;
  const description = `${cap(w.tl)} (${w.ar}): ${w.tr}. Arapça kelimenin harekeli yazılışı, okunuşu, ${w.type ? w.type + ' olarak kullanımı, ' : ''}kökü ve sesli telaffuzu.`.slice(0, 160);
  const url = `/kelime/${w.slug}`;
  return {
    title,
    description,
    keywords: [`${w.tl} ne demek`, `${w.tl} anlamı`, `${w.tr} arapça`, w.ar, 'Arapça kelime'],
    alternates: { canonical: url },
    openGraph: { type: 'article', title: `${title} | ${SITE_NAME}`, description, url }
  };
}

export default async function WordPageView({ params }: Props) {
  const { slug } = await params;
  const [w, all] = await Promise.all([getWord(slug), getWordIndex()]);
  if (!w) notFound();
  const root = rootOf(w.ar);
  const family = root ? all.filter((x) => x.slug !== w.slug && rootOf(x.ar)?.letters === root.letters).slice(0, 12) : [];
  const base = siteOrigin();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: w.ar,
    alternateName: w.tl,
    description: w.tr,
    inLanguage: 'ar',
    url: `${base}/kelime/${w.slug}`,
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: `${SITE_NAME} Arapça sözlük`, url: `${base}/kelime` }
  };

  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-6 pt-8 pb-20 flex flex-col gap-7">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <nav aria-label="Sayfa yolu" className="text-sm text-faint flex flex-wrap gap-2">
        <Link href="/kelime" className="text-mute hover:text-ink">Arapça kelimeler</Link><span>/</span><span className="text-soft">{w.tl}</span>
      </nav>

      <section className="p-6 sm:p-8 rounded-[24px] bg-s3 border border-line flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-col gap-2 min-w-0">
            <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Arapça kelime{w.type ? ' · ' + w.type : ''}</span>
            <h1 className="m-0 text-[34px] sm:text-[42px] font-bold tracking-tight leading-tight">{cap(w.tl)} ne demek?</h1>
            <p className="m-0 text-[22px] font-semibold text-ink leading-snug">{w.tr}</p>
            {w.en && <p className="en m-0 text-mute">İngilizce: {w.en}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Ar t={w.ar} className="text-[56px] leading-tight text-ink" />
            <SayBtn text={w.ar} cls="w-12 h-12" />
          </div>
        </div>
        <div className="-mt-2">
          <AddToList word={w} />
        </div>
        <dl className="m-0 grid gap-3 sm:grid-cols-2">
          <div className="p-4 rounded-xl bg-s1 border border-line"><dt className="text-xs font-bold tracking-[.08em] uppercase text-lab">Okunuşu</dt><dd className="m-0 mt-1 text-lg font-semibold">{w.tl}</dd></div>
          <div className="p-4 rounded-xl bg-s1 border border-line"><dt className="text-xs font-bold tracking-[.08em] uppercase text-lab">Harekeli yazılışı</dt><dd className="m-0 mt-1"><span className="font-ar text-[26px]" lang="ar" dir="rtl">{w.ar}</span></dd></div>
          {w.muAr && (
            <div className="p-4 rounded-xl bg-s1 border border-line sm:col-span-2"><dt className="text-xs font-bold tracking-[.08em] uppercase text-lab">Şimdiki / geniş zaman</dt>
              <dd className="m-0 mt-1 flex items-center gap-3"><Ar t={w.muAr} className="text-[26px]" /><span className="text-soft">{w.muTl}</span><SayBtn text={w.muAr} cls="w-9 h-9" size={16} /></dd></div>
          )}
        </dl>
        {w.note && <p className="m-0 flex gap-2 text-[15px] text-prose leading-relaxed"><span className="text-acct shrink-0 mt-0.5"><Raw html={I.bulb(17)} /></span>{w.note}</p>}
      </section>

      {root && (
        <section className="p-6 rounded-[20px] bg-s1 border border-line flex flex-col gap-4">
          <h2 className="m-0 text-xl font-bold">Kökü: <span className="font-ar text-acct" lang="ar" dir="rtl">{spaced(root.letters)}</span> <span className="text-mute text-base font-semibold">({root.meaning})</span></h2>
          {root.note && <p className="m-0 text-prose leading-relaxed">{root.note}</p>}
          {family.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold tracking-[.08em] uppercase text-lab">Aynı kökten kelimeler</span>
              <div className="flex flex-wrap gap-2">
                {family.map((f) => (
                  <Link key={f.slug} href={`/kelime/${f.slug}`} className="px-3 py-1.5 rounded-xl bg-s3 border border-line2 inline-flex items-center gap-2 hover:border-lineh text-ink hover:text-ink">
                    <span className="font-ar text-[19px]" lang="ar" dir="rtl">{f.ar}</span><span className="text-sm text-soft">{f.tr.split(',')[0]}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {root.tr.length > 0 && <p className="m-0 text-sm text-mute2">Türkçede bu kökten: <span className="text-soft">{root.tr.join(', ')}</span></p>}
        </section>
      )}

      <section className="flex flex-wrap gap-3">
        {w.topics.map((t) => (
          <Link key={t.id} href={`/konu/${t.id}`} className="h-11 px-4 rounded-xl bg-okbg border border-okln text-okt font-semibold inline-flex items-center gap-2 hover:text-ink">Bu kelime derste geçiyor: {t.name} <Raw html={I.arrow(15)} /></Link>
        ))}
        <Link href="/kelime-bul" className="h-11 px-4 rounded-xl bg-s2 border border-line3 text-soft font-semibold inline-flex items-center gap-2 hover:text-ink hover:border-lineh"><Raw html={I.search(15)} /> Başka bir kelime bul</Link>
        <Link href="/kelime" className="h-11 px-4 rounded-xl bg-s2 border border-line3 text-soft font-semibold inline-flex items-center hover:text-ink hover:border-lineh">Tüm kelimeler</Link>
      </section>
    </div>
  );
}
