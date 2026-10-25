'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Topic, Word } from '@/lib/types';
import { isAr, normAr, searchKey } from '@/lib/text';
import { rootOf, spaced, type Root } from '@/lib/roots';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

type Row = Word & { topics: { id: string; name: string }[]; root: Root | null };

/** slugs: Arapça yazım -> kelime sayfası adresi */
export default function DictionaryView({ topics, slugs = {} }: { topics: Topic[]; slugs?: Record<string, string> }) {
  const { tx } = useApp();
  const [q, setQ] = useState('');
  const [konu, setKonu] = useState('');
  // Ders sayfasından gelen ?konu= süzgeci (sayfa önceden hazırlandığı için tarayıcıda okunur)
  useEffect(() => { const k = new URLSearchParams(location.search).get('konu'); if (k) setKonu(k); }, []);
  const [open, setOpen] = useState<string | null>(null);

  // Tüm derslerin kelimelerini tek listede topla
  const words = useMemo(() => {
    const seen = new Map<string, Row>();
    topics.forEach((t) => (t.words || []).forEach((w) => {
      const k = normAr(w.ar) + '|' + w.tr;
      const ref = { id: t.id, name: t.name };
      if (seen.has(k)) seen.get(k)!.topics.push(ref);
      else seen.set(k, { ...w, topics: [ref], root: rootOf(w.ar) });
    }));
    return [...seen.values()];
  }, [topics]);
  // Kök -> o kökten gelen sözlük kelimeleri
  const families = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const w of words) if (w.root) m.set(w.root.letters, [...(m.get(w.root.letters) || []), w]);
    return m;
  }, [words]);

  const list = useMemo(() => {
    const s = q.trim(), qt = searchKey(s), qa = normAr(s);
    return words.filter((w) => (!konu || w.topics.some((t) => t.id === konu)) &&
      (!s || (!!qt && searchKey(w.tr + ' ' + (w.en || '') + ' ' + (w.tl || '')).includes(qt)) || (isAr(s) && normAr(w.ar).includes(qa))));
  }, [words, q, konu]);

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Sözlük</span>
        <h1 className="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">Tüm kelimeler</h1>
        <p className="m-0 text-mute text-lg max-w-[620px]">Derslerde geçen bütün kelimeler. Türkçe, İngilizce, okunuş ya da Arapça yazarak arayabilirsin; harekesiz yazman yeterli. <b className="text-ink">Kök</b> düğmesi, kelimenin ailesini ve Türkçede aynı kökten gelen kelimeleri gösterir.</p>
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
        {list.map((w, i) => {
          const id = w.ar + '|' + w.tr;
          const isOpen = open === id && !!w.root;
          return (
          <div key={i} className="border-b border-line4 last:border-b-0">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4">
            <div className="flex items-center gap-3 min-w-[180px] flex-1 sm:flex-none sm:w-[260px] justify-between sm:justify-start">
              <button type="button" data-say={w.ar} aria-label="Dinle" className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-full bg-chip border border-line3 text-acct hover:text-ink" dangerouslySetInnerHTML={{ __html: I.speaker(16) }} />
              <Raw html={tx.ar(w.ar, 'text-[26px] text-ink')} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              {slugs[w.ar] ? <Link href={`/kelime/${slugs[w.ar]}`} prefetch={false} className="text-[16px] font-semibold text-ink hover:text-acct">{w.tr}</Link> : <span className="text-[16px] font-semibold text-ink">{w.tr}</span>}
              <span className="text-sm text-faint"><span className="tl">{w.tl || ''}</span>{w.en && <span className="en">{w.tl ? ' · ' : ''}EN: {w.en}</span>}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {w.root && (
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : id)}
                  className={`px-2.5 py-1 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 ${isOpen ? 'bg-acc text-onacc border-acc' : 'bg-chip border-chipln text-acct hover:text-ink'}`}>
                  Kök <span lang="ar" dir="rtl" className="font-ar text-[13px]">{spaced(w.root.letters)}</span>
                </button>
              )}
              {w.topics.map((t) => <Link key={t.id} href={`/konu/${t.id}`} className="px-2.5 py-1 rounded-full bg-s5 border border-line2 text-xs font-semibold text-soft hover:text-ink">{t.name}</Link>)}
            </div>
          </div>
          {isOpen && w.root && <RootPanel root={w.root} family={families.get(w.root.letters) || []} current={id} />}
          </div>
          );
        })}
      </div>
    </div>
  );
}

/** Kök ailesi: kökün anlamı, sözlükte aynı kökten kelimeler ve Türkçedeki karşılıkları */
function RootPanel({ root, family, current }: { root: Root; family: Row[]; current: string }) {
  const { tx } = useApp();
  return (
    <div className="pop mx-5 mb-4 p-4 sm:p-5 rounded-2xl bg-s3 border border-line2 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <span lang="ar" dir="rtl" className="font-ar text-[34px] leading-none text-acct tracking-wide">{spaced(root.letters)}</span>
        <span className="flex flex-col"><span className="text-xs font-bold tracking-[.08em] uppercase text-lab">Kök anlamı</span><span className="text-[16px] font-semibold text-ink">{root.meaning}</span></span>
      </div>
      {root.note && <Raw as="p" className="m-0 text-[15px] leading-relaxed text-prose" html={tx.text(root.note)} />}
      {family.length > 1 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-[.08em] uppercase text-lab">Derslerde bu kökten</span>
          <div className="flex flex-wrap gap-2">
            {family.map((f) => (
              <button key={f.ar + f.tr} type="button" data-say={f.ar} className={`px-3 py-1.5 rounded-xl border inline-flex items-center gap-2 ${f.ar + '|' + f.tr === current ? 'bg-s5 border-lineh' : 'bg-s1 border-line2 hover:border-lineh'}`}>
                <Raw html={tx.ar(f.ar, 'text-[20px] text-ink')} /><span className="text-sm text-soft">{f.tr}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {root.tr.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-[.08em] uppercase text-lab">Türkçede bu kökten</span>
          <div className="flex flex-wrap gap-1.5">{root.tr.map((t) => <span key={t} className="px-2.5 py-1 rounded-full bg-chip border border-chipln text-[13px] font-semibold text-acct">{t}</span>)}</div>
        </div>
      )}
    </div>
  );
}
