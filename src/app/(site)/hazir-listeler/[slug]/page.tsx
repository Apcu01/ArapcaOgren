import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ar, SayBtn } from '@/components/AppProvider';
import CopyShared from '@/components/lists/CopyShared';
import { READY_LISTS, readyList } from '@/lib/ready-lists';
import { SITE_NAME } from '@/lib/site';
import { readyWords } from '@/lib/words';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return READY_LISTS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Params) {
  const l = readyList((await params).slug);
  if (!l) return { title: 'Liste bulunamadı', robots: { index: false } };
  return {
    title: `${l.title}: Arapça kelime listesi`,
    description: `${l.description} ${l.words.length} kelime, okunuşu ve sesiyle.`,
    alternates: { canonical: `/hazir-listeler/${l.slug}` }
  };
}

export default async function ReadyListPage({ params }: Params) {
  const l = readyList((await params).slug);
  if (!l) notFound();
  const words = await readyWords(l.words);
  const others = READY_LISTS.filter((x) => x.group === l.group && x.slug !== l.slug);
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-20 flex flex-col gap-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: `${l.title} (Arapça)`, description: l.description,
        hasDefinedTerm: words.map((w) => ({ '@type': 'DefinedTerm', name: w.ar, description: w.tr, alternateName: w.tl })),
        publisher: { '@type': 'Organization', name: SITE_NAME }
      }) }} />
      <Link href="/hazir-listeler" className="self-start text-sm text-mute hover:text-ink">← Hazır listeler</Link>
      <section className="flex flex-col gap-4 p-6 sm:p-8 rounded-[24px] bg-s3 border border-line">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Hazır liste · {l.group}</span>
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-[30px] sm:text-[38px] leading-tight font-bold tracking-tight">{l.title}</h1>
          <span className="text-mute">{words.length} kelime · {l.description}</span>
        </div>
        <p className="m-0 text-soft leading-relaxed max-w-[640px]">Listeyi kendi listelerine kopyala; kartlarla, adım adım öğrenerek, testlerle ve oyunlarla çalış. Kopya senin olur, istediğin kelimeyi ekleyip çıkarabilirsin.</p>
        <div className="flex flex-wrap items-center gap-3">
          <CopyShared copyUrl={`/api/ready/${l.slug}/copy`} back={`/hazir-listeler/${l.slug}`} />
          <Link href={`/canli?hazir=${l.slug}`} className="h-12 px-5 rounded-xl border border-line3 bg-s2 text-ink font-semibold inline-flex items-center hover:text-ink hover:border-lineh">Bu listeyle canlı yarışma aç</Link>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[22px] font-bold">Kelimeler ({words.length})</h2>
        <div className="flex flex-col gap-2">
          {words.map((w) => (
            <div key={w.ar} className="flex items-center gap-3 sm:gap-5 px-4 sm:px-5 py-3 rounded-2xl bg-s4 border border-line3">
              <Link href={`/kelime/${w.slug}`} prefetch={false} className="flex-1 min-w-0 text-[16px] font-semibold text-ink hover:text-acct break-words">{w.tr}</Link>
              <div className="flex flex-col items-end">
                <Ar t={w.ar} className="text-[24px] text-ink leading-[1.5]" />
                <span className="tl text-xs text-mute">{w.tl}</span>
              </div>
              <SayBtn text={w.ar} />
            </div>
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[20px] font-bold">Aynı gruptaki diğer listeler</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => <Link key={o.slug} href={`/hazir-listeler/${o.slug}`} className="px-4 h-10 rounded-full bg-s2 border border-line3 text-soft font-semibold inline-flex items-center hover:text-ink hover:border-lineh">{o.title}</Link>)}
          </div>
        </section>
      )}
    </div>
  );
}
