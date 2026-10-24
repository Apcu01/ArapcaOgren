'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Topic, Word } from '@/lib/types';
import { isAr, normAr, normTr } from '@/lib/text';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

type Row = Word & { topics: { id: string; name: string }[] };

export default function DictionaryView({ topics, initialKonu }: { topics: Topic[]; initialKonu: string }) {
  const { tx } = useApp();
  const [q, setQ] = useState('');
  const [konu, setKonu] = useState(initialKonu);

  // Tüm derslerin kelimelerini tek listede topla
  const words = useMemo(() => {
    const seen = new Map<string, Row>();
    topics.forEach((t) => (t.words || []).forEach((w) => {
      const k = normAr(w.ar) + '|' + w.tr;
      const ref = { id: t.id, name: t.name };
      if (seen.has(k)) seen.get(k)!.topics.push(ref);
      else seen.set(k, { ...w, topics: [ref] });
    }));
    return [...seen.values()];
  }, [topics]);

  const list = useMemo(() => {
    const s = q.trim(), qt = normTr(s), qa = normAr(s);
    return words.filter((w) => (!konu || w.topics.some((t) => t.id === konu)) &&
      (!s || normTr(w.tr + ' ' + (w.en || '') + ' ' + (w.tl || '')).includes(qt) || (isAr(s) && normAr(w.ar).includes(qa))));
  }, [words, q, konu]);

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Sözlük</span>
        <h1 className="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">Tüm kelimeler</h1>
        <p className="m-0 text-mute text-lg max-w-[620px]">Derslerde geçen bütün kelimeler. Türkçe, İngilizce, okunuş ya da Arapça yazarak arayabilirsin; harekesiz yazman yeterli.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="flex-[1_1_320px] flex items-center gap-3 px-[18px] h-[54px] rounded-[14px] bg-s2 border border-line2 text-faint focus-within:border-lineh">
          <Raw html={I.search()} /><span className="sr-only">Kelime ara</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" autoComplete="off" placeholder="Ara: kitap, book, كتاب" className="flex-1 min-w-0 bg-transparent border-0 outline-none text-ink font-medium text-base placeholder:text-faint" />
        </label>
        <label className="flex-[0_1_260px] flex items-center gap-2 px-4 h-[54px] rounded-[14px] bg-s2 border border-line2 text-mute">
          <span className="sr-only">Derse göre filtrele</span>
          <select value={konu} onChange={(e) => setKonu(e.target.value)} className="flex-1 bg-transparent border-0 outline-none text-ink font-semibold text-[15px]">
            <option value="" className="bg-s2">Tüm dersler</option>
            {topics.map((t) => <option key={t.id} value={t.id} className="bg-s2">{t.n}. {t.name}</option>)}
          </select>
        </label>
      </div>
      <div className="flex justify-between text-sm text-faint"><span>{list.length} kelime</span><span>Kelimeye dokunarak sesli dinleyebilirsin</span></div>
      <div className="rounded-[20px] bg-s1 border border-line overflow-hidden">
        {!list.length && <div className="p-10 text-center text-mute rounded-2xl border border-dashed border-line3">Eşleşen kelime yok.</div>}
        {list.map((w, i) => (
          <div key={i} className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 border-b border-[#241B15] last:border-b-0">
            <div className="flex items-center gap-3 min-w-[180px] flex-1 sm:flex-none sm:w-[260px] justify-between sm:justify-start">
              <button type="button" data-say={w.ar} aria-label="Dinle" className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-full bg-chip border border-line3 text-acct hover:text-ink" dangerouslySetInnerHTML={{ __html: I.speaker(16) }} />
              <Raw html={tx.ar(w.ar, 'text-[26px] text-ink')} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[16px] font-semibold text-ink">{w.tr}</span>
              <span className="text-sm text-faint"><span className="tl">{w.tl || ''}</span>{w.en && <span className="en">{w.tl ? ' · ' : ''}EN: {w.en}</span>}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {w.topics.map((t) => <Link key={t.id} href={`/konu?id=${t.id}`} className="px-2.5 py-1 rounded-full bg-s5 border border-line2 text-xs font-semibold text-soft hover:text-ink">{t.name}</Link>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
