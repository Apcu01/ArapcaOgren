import Link from 'next/link';
import { getWordIndex } from '@/lib/words';

export const metadata = {
  title: 'Arapça kelimeler ve anlamları',
  description: 'Temel Arapça kelimelerin anlamları, okunuşları, harekeli yazılışları ve kökleri. Selamlaşmalar, meslekler, fiiller, sıfatlar, ev eşyaları ve daha fazlası.',
  alternates: { canonical: '/kelime' }
};

// Bütün kelime sayfalarının dizini (okunuşa göre alfabetik): hem ziyaretçiler hem arama motorları için
export default async function WordIndexPage() {
  const words = await getWordIndex();
  const groups = new Map<string, typeof words>();
  for (const w of words) {
    const k = w.slug[0]?.toLocaleUpperCase('tr') || '#';
    groups.set(k, [...(groups.get(k) || []), w]);
  }
  const letters = [...groups.keys()].sort((a, b) => a.localeCompare(b, 'tr'));
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Arapça kelimeler</span>
        <h1 className="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">{words.length} Arapça kelime ve anlamı</h1>
        <p className="m-0 text-mute text-lg max-w-[700px]">Her kelimenin harekeli yazılışı, okunuşu, anlamı, kökü ve sesli telaffuzu. Aradığın kelimenin yazımından emin değilsen <Link href="/kelime-bul">Kelime bul</Link> ile duyduğun gibi yazarak arayabilirsin.</p>
      </div>
      <nav aria-label="Harfler" className="flex flex-wrap gap-1.5">
        {letters.map((l) => <a key={l} href={`#harf-${l}`} className="w-9 h-9 rounded-lg bg-s2 border border-line2 text-soft font-bold inline-flex items-center justify-center hover:border-lineh hover:text-ink">{l}</a>)}
      </nav>
      {letters.map((l) => (
        <section key={l} id={`harf-${l}`} className="scroll-mt-6 flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-acct">{l}</h2>
          <ul className="m-0 p-0 list-none grid gap-x-6 gap-y-1 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
            {groups.get(l)!.map((w) => (
              <li key={w.slug}>
                <Link href={`/kelime/${w.slug}`} prefetch={false} className="flex items-baseline justify-between gap-3 py-1.5 border-b border-line4 text-ink hover:text-acct">
                  <span className="truncate"><b className="font-semibold">{w.tl}</b> <span className="text-mute2 text-sm">{w.tr.split(',')[0]}</span></span>
                  <span className="font-ar text-[18px] shrink-0" lang="ar" dir="rtl">{w.ar}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
