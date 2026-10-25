'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Topic } from '@/lib/types';
import { actsOf, isAr, normAr, searchKey } from '@/lib/text';
import { Ar, useApp } from './AppProvider';
import { I, Raw } from './icons';

const LEVELS = ['Tümü', 'Başlangıç', 'Orta', 'İleri'];
const STEPS: [string, string, string][] = [
  ['1', 'Konuyu oku', 'Kurallar, tablolar ve püf noktalarıyla konuyu adım adım öğren.'],
  ['2', 'Örnekleri dinle', 'Her örneği Türkçe ve İngilizce karşılığıyla oku, sesli dinle.'],
  ['3', 'Etkinlikleri çöz', 'Kartlar, eşleştirme, boşluk doldurma ve cümle kurma ile pekiştir.'],
  ['4', 'Testi geç', 'Konu testinde %70 ve üstünü al; yanlışlarının açıklamasını oku.']
];

export default function HomeView({ topics }: { topics: Topic[] }) {
  const { tx, topicStats, state } = useApp();
  const [level, setLevel] = useState('Tümü');
  const [q, setQ] = useState('');
  const actMap = useMemo(() => Object.fromEntries(topics.map((t) => [t.id, actsOf(t)])), [topics]);
  const pctLabel = (st: ReturnType<typeof topicStats>) => (st.pct === 100 ? 'Tamamlandı' : !st.started ? 'Başlanmadı' : '%' + st.pct);
  const totalActs = topics.reduce((n, t) => n + actMap[t.id].length, 0);

  const list = useMemo(() => {
    const qt = searchKey(q), qa = isAr(q) ? normAr(q.trim()) : '';
    return topics.filter((t) => (level === 'Tümü' || t.level === level) &&
      (!q.trim() || (!!qt && searchKey(t.name + ' ' + t.desc + ' ' + (t.tags || '')).includes(qt)) || (!!qa && normAr(t.ar).includes(qa))));
  }, [topics, level, q]);

  const toResults = () => document.getElementById('konular')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Kaldığın yer kartı
  const cont = topics.find((x) => x.id === state.last) || topics.find((x) => topicStats(x.id, actMap[x.id]).pct < 100) || topics[0];
  const cst = cont ? topicStats(cont.id, actMap[cont.id]) : null;

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20 flex flex-col gap-12">
      <section className="flex flex-wrap gap-8 items-stretch">
        <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-[18px] justify-center">
          <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Arapça öğrenmeye devam</span>
          <h1 className="m-0 text-[38px] sm:text-[52px] leading-[1.08] tracking-[-0.025em] font-bold">Bugün ne öğrenmek<br />istersin?</h1>
          <p className="m-0 max-w-[540px] text-lg leading-relaxed text-mute">Bir konu seç: önce detaylı anlatımı oku, Türkçe ve İngilizce karşılaştırmalı örneklerle kavra, sonra etkinliklerle adım adım pekiştir.</p>
          <label className="mt-2 max-w-[520px] flex items-center gap-3 px-[18px] h-[54px] rounded-[14px] bg-s2 border border-line2 text-faint focus-within:border-lineh">
            <Raw html={I.search()} />
            <span className="sr-only">Konu ara</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); toResults(); } }} type="search" autoComplete="off" placeholder="Konu ara: saatler, zamirler, sıfatlar" className="flex-1 min-w-0 bg-transparent border-0 outline-none text-ink font-medium text-base placeholder:text-faint" />
          </label>
          {/* Sonuçlar aşağıdaki listede; ekranın dışında kalabildiği için kaç konu bulunduğu burada da söylenir */}
          <p className="m-0 -mt-1 text-sm text-mute2 empty:hidden" aria-live="polite">
            {q.trim() && (list.length
              ? <>{list.length} konu bulundu · <button type="button" onClick={toResults} className="text-acct font-semibold hover:text-ink underline underline-offset-4">Sonuçlara git</button></>
              : <>&quot;{q.trim()}&quot; için konu bulunamadı.</>)}
          </p>
        </div>
        {cont && cst && (
          <Link href={`/konu?id=${cont.id}`} className="flex-[1_1_360px] min-w-0 flex flex-col gap-[18px] p-7 rounded-[22px] bg-s4 border border-line3 text-ink hover:text-ink hover:border-lineh">
            <div className="flex justify-between items-start gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-lab tracking-[.08em] uppercase">{state.last ? 'Kaldığın yer' : 'Buradan başla'}</span>
                <span className="text-2xl font-bold">{cont.name}</span>
                <span className="text-sm text-mute2">Ders {cont.n} · {cont.level}</span>
              </div>
              <Ar t={cont.ar} className="text-[40px] leading-none text-acct" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm text-mute"><span>{cst.done} / {cst.total} etkinlik{cst.lesson ? ' · konu okundu' : ''}</span><span>%{cst.pct}</span></div>
              <div className="h-2 rounded-full bg-track overflow-hidden"><div className="h-full rounded-full bg-acc" style={{ width: cst.pct + '%' }} /></div>
            </div>
            <span className="self-start inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold text-[15px]">{cst.started ? 'Devam et' : 'Başla'} <Raw html={I.arrow()} /></span>
          </Link>
        )}
      </section>

      <section aria-label="Nasıl çalışılır" className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(([n, h, p]) => (
          <div key={n} className="flex gap-4 p-5 rounded-2xl bg-s1 border border-line">
            <span className="w-9 h-9 shrink-0 rounded-full bg-chip border border-line3 text-acct font-bold flex items-center justify-center">{n}</span>
            <div className="flex flex-col gap-1"><span className="font-bold">{h}</span><span className="text-sm text-mute2 leading-relaxed">{p}</span></div>
          </div>
        ))}
      </section>

      <section id="konular" className="scroll-mt-6 flex flex-col gap-[22px]">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-col gap-1.5">
            <h2 className="m-0 text-[28px] font-bold tracking-tight">Kategoriler</h2>
            <span className="text-[15px] text-mute2">{topics.length} konu · {totalActs} etkinlik · önerilen sıra: ders numarası</span>
          </div>
          <div role="group" aria-label="Seviye filtresi" className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(l)} className={`h-11 px-[18px] rounded-full font-semibold text-sm border ${level === l ? 'bg-acc text-onacc border-acc' : 'bg-s2 text-soft border-line2 hover:border-lineh'}`}>{l}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fill,minmax(270px,1fr))]">
          {!list.length && (
            <div className="col-span-full p-10 rounded-2xl border border-dashed border-line3 text-center text-mute">"{q}" için konu bulunamadı. Başka bir kelime dene.</div>
          )}
          {list.map((t) => {
            const st = topicStats(t.id, actMap[t.id]);
            return (
              <Link key={t.id} className="cat flex flex-col gap-5 p-6 rounded-[18px] bg-s3 border border-line text-ink hover:text-ink" href={`/konu?id=${t.id}`}>
                <div className="flex justify-between items-start gap-3">
                  <span className="w-14 h-14 rounded-[14px] bg-chip border border-chipln flex items-center justify-center font-ar text-[30px] text-acct" aria-hidden="true">{t.glyph}</span>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-2.5 py-[5px] rounded-full bg-s5 border border-line2 text-xs font-semibold text-mute">{t.level}</span>
                    <span className="text-xs text-faint">Ders {t.n}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Ar t={t.ar} className="text-[26px] leading-snug text-accs text-left" />
                  <span className="text-xl font-bold">{t.name}</span>
                  <Raw className="text-sm leading-relaxed text-mute2" html={tx.text(t.desc)} />
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex justify-between text-[13px] text-mute2"><span>{actMap[t.id].length} etkinlik</span><span>{pctLabel(st)}</span></div>
                  <div className="h-1.5 rounded-full bg-line overflow-hidden"><div className="h-full rounded-full" style={{ width: st.pct + '%', background: st.pct === 100 ? 'rgb(var(--c-ok))' : 'rgb(var(--c-acc))' }} /></div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
