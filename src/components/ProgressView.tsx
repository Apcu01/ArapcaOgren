'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { Topic } from '@/lib/types';
import { actsOf, TYPE } from '@/lib/text';
import { useApp } from './AppProvider';
import StudyCalendar from './StudyCalendar';

export default function ProgressView({ topics }: { topics: Topic[] }) {
  const { topicStats, actState, streak, reset, toast, user, state } = useApp();
  const actMap = useMemo(() => Object.fromEntries(topics.map((t) => [t.id, actsOf(t)])), [topics]);

  let doneActs = 0, totalActs = 0, sum = 0, tried = 0, doneTopics = 0;
  topics.forEach((t) => {
    if (topicStats(t.id, actMap[t.id]).pct === 100) doneTopics++;
    actMap[t.id].forEach((a) => {
      totalActs++;
      const s = actState(t.id, a.id);
      if (s) { tried++; sum += s.best; if (s.done) doneActs++; }
    });
  });
  const avg = tried ? Math.round((sum / tried) * 100) : 0;
  const cards: [string, string][] = [
    ['Tamamlanan ders', `${doneTopics} / ${topics.length}`],
    ['Tamamlanan etkinlik', `${doneActs} / ${totalActs}`],
    ['Ortalama başarı', tried ? '%' + avg : '-'],
    ['Seri', streak + ' gün']
  ];

  async function onReset() {
    if (!confirm('Tüm ilerlemen silinecek. Emin misin?')) return;
    await reset();
    toast('İlerleme sıfırlandı.');
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">İlerlemem</span>
        <h1 className="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">Ne kadar yol aldın?</h1>
        <p className="m-0 text-mute text-lg max-w-[640px]">
          {user
            ? 'İlerlemen hesabına kaydediliyor; hangi cihazdan girersen gir kaldığın yerden devam edersin.'
            : <>İlerlemen bu tarayıcıda saklanır. <Link href="/kayit">Hesap açarsan</Link> her cihazdan devam edebilirsin; mevcut ilerlemen de hesabına aktarılır.</>}
          {' '}Bir etkinlik %70 ve üstü başarıyla tamamlanmış sayılır; en iyi skorun görünür.
        </p>
      </div>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {cards.map(([l, v]) => <div key={l} className="p-5 rounded-2xl bg-s3 border border-line2 flex flex-col gap-1"><span className="text-sm text-mute2">{l}</span><span className="text-[28px] font-bold">{v}</span></div>)}
      </div>
      <StudyCalendar days={state.days} counts={state.counts} />
      <div className="flex flex-col gap-3">
        {topics.map((t) => {
          const st = topicStats(t.id, actMap[t.id]);
          return (
            <div key={t.id} className="p-5 sm:p-6 rounded-[18px] bg-s3 border border-line flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <Link href={`/konu?id=${t.id}`} className="flex items-center gap-4 text-ink hover:text-ink min-w-0">
                  <span className="w-12 h-12 shrink-0 rounded-xl bg-chip border border-chipln flex items-center justify-center font-ar text-[26px] text-acct" aria-hidden="true">{t.glyph}</span>
                  <span className="flex flex-col min-w-0"><span className="font-bold text-lg">{t.n}. {t.name}</span><span className="text-sm text-mute2">{st.lesson ? 'Konu okundu' : 'Konu okunmadı'} · {st.done}/{st.total} etkinlik</span></span>
                </Link>
                <div className="flex items-center gap-3 flex-[0_1_280px] min-w-[200px]">
                  <div className="flex-1 h-2 rounded-full bg-line overflow-hidden"><div className="h-full rounded-full" style={{ width: st.pct + '%', background: st.pct === 100 ? 'rgb(var(--c-ok))' : 'rgb(var(--c-acc))' }} /></div>
                  <span className="text-sm font-semibold w-12 text-right">%{st.pct}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {actMap[t.id].map((a) => {
                  const s = actState(t.id, a.id);
                  const cls = s && s.done ? 'bg-okbg text-okt border-okln' : s ? 'bg-progbg text-prog border-progln' : 'bg-s0 text-dim border-edge';
                  return <span key={a.id} className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`} title={a.title}>{TYPE[a.type].label}{s ? ' · %' + Math.round(s.best * 100) : ''}</span>;
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-badln bg-badbg/50">
        <div className="flex flex-col gap-1"><span className="font-bold">İlerlemeyi sıfırla</span><span className="text-sm text-mute">Tüm skorlar, okunan konular ve seri silinir. Geri alınamaz.</span></div>
        <button type="button" onClick={onReset} className="h-11 px-5 rounded-xl border border-badln text-bad font-semibold hover:bg-badbg">Sıfırla</button>
      </div>
    </div>
  );
}
