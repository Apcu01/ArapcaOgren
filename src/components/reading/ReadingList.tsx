'use client';

import Link from 'next/link';
import { useApp } from '../AppProvider';
import { READING_TOPIC } from '@/lib/readings';

export type ReadingCard = { slug: string; title: string; ar: string; level: string; desc: string; lesson: string; words: number; mins: number };

/** Okuma metinleri listesi: okunanlar ve en iyi anlama skoru tarayıcıdaki ilerlemeden */
export default function ReadingList({ cards }: { cards: ReadingCard[] }) {
  const { actState, tx } = useApp();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => {
        const st = actState(READING_TOPIC, c.slug);
        return (
          <Link key={c.slug} href={`/okuma/${c.slug}`} className="cat flex flex-col gap-3 p-5 rounded-2xl bg-s4 border border-line3 text-ink hover:text-ink">
            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold tracking-[.08em] uppercase text-lab">{c.level}</span>
              {st && <span className={`px-2.5 py-[5px] rounded-full text-xs font-bold border ${st.done ? 'bg-okbg text-okt border-okln' : 'bg-progbg text-prog border-progln'}`}>{st.done ? 'Okundu' : 'Denendi'} · %{Math.round(st.best * 100)}</span>}
            </span>
            <span className="flex items-baseline justify-between gap-3 flex-wrap">
              <span className="text-[19px] font-bold">{c.title}</span>
              <span className="ar text-[24px] text-acct" lang="ar" dir="rtl">{tx.showAr(c.ar)}</span>
            </span>
            <span className="text-sm text-mute2 leading-snug">{c.desc}</span>
            <span className="mt-auto pt-3 border-t border-line flex justify-between gap-3 text-[13px] text-mute2">
              <span>{c.words} kelime · {c.mins} dk</span>
              {c.lesson && <span className="truncate">Ders: {c.lesson}</span>}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
