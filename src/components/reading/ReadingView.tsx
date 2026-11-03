'use client';

/* Okuma metni: kelimeye dokununca anlamı ve sesi, cümle cümle ya da baştan sona dinleme,
   çeviriyi gösterme ve sonda anlama soruları (sonuç, etkinlik ilerlemesi gibi kaydedilir) */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import AddToList from '../lists/AddToList';
import { bareWord, READING_TOPIC, sentenceAr, type Reading } from '@/lib/readings';
import { shuffle } from '@/lib/text';

type Nav = { slug: string; title: string } | null;

export default function ReadingView({ reading: r, lesson, next }: { reading: Reading; lesson: { id: string; name: string } | null; next: Nav }) {
  const { tx, speak, playUntilEnd, stopSay, track } = useApp();
  const [sel, setSel] = useState<{ s: number; w: number } | null>(null);
  const [allTr, setAllTr] = useState(false);
  const [shown, setShown] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState<number | null>(null);
  const run = useRef(0);

  useEffect(() => { track('view', { path: '/okuma/' + r.slug, topicId: READING_TOPIC }); }, [r.slug, track]);
  useEffect(() => () => { run.current++; stopSay(); }, [stopSay]);

  async function playAll(from = 0) {
    const me = ++run.current;
    setSel(null);
    for (let i = from; i < r.sentences.length; i++) {
      if (run.current !== me) return;
      setReading(i);
      document.getElementById('c' + i)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      await playUntilEnd(sentenceAr(r.sentences[i]));
      if (run.current !== me) return;
      await new Promise((ok) => setTimeout(ok, 350));
    }
    if (run.current === me) setReading(null);
  }
  function stop() { run.current++; stopSay(); setReading(null); }
  function one(i: number) { run.current++; setReading(i); playUntilEnd(sentenceAr(r.sentences[i])).then(() => setReading((x) => (x === i ? null : x))); }
  const toggleTr = (i: number) => setShown((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });

  const picked = sel ? r.sentences[sel.s].w[sel.w] : null;

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-8 pb-20 flex flex-col gap-8">
      <Link href="/okuma" className="self-start inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><Raw html={I.back()} /> Okuma metinleri</Link>
      <header className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">{r.level} · okuma metni</span>
        <h1 className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[34px] sm:text-[42px] leading-tight font-bold tracking-tight">
          {r.title} <span className="ar text-acct text-[36px] sm:text-[44px] font-normal" lang="ar" dir="rtl">{tx.showAr(r.ar)}</span>
        </h1>
        <p className="m-0 text-mute leading-relaxed max-w-[680px]">{r.desc}</p>
        {lesson && <p className="m-0 text-sm text-faint">Kelimeleri <Link href={`/konu/${lesson.id}`} className="text-acct">{lesson.name}</Link> dersinde.</p>}
      </header>

      <div className="sticky top-0 z-20 -mx-4 sm:mx-0 px-4 sm:px-4 py-3 sm:rounded-2xl bg-head/95 backdrop-blur border-y sm:border border-line flex flex-wrap items-center gap-2">
        {reading == null
          ? <button type="button" onClick={() => playAll(0)} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2"><Raw html={I.play(16)} /> Baştan sona dinle</button>
          : <button type="button" onClick={stop} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2"><Raw html={I.pause(16)} /> Durdur</button>}
        <button type="button" aria-pressed={allTr} onClick={() => setAllTr(!allTr)} className={`h-11 px-4 rounded-xl border font-semibold text-sm ${allTr ? 'border-acc bg-chip text-acct' : 'border-line3 bg-s2 text-soft hover:text-ink'}`}>
          {allTr ? 'Çevirileri gizle' : 'Çevirileri göster'}
        </button>
        <span className="text-xs text-faint ml-auto hidden sm:inline">Bir kelimeye dokun: anlamı ve sesi</span>
      </div>

      <article className="flex flex-col gap-3" aria-label="Metin">
        {r.sentences.map((x, i) => {
          const open = allTr || shown.has(i);
          return (
            <div key={i} id={'c' + i} className={`flex flex-col gap-2 p-4 sm:p-5 rounded-2xl border transition-colors ${reading === i ? 'bg-s4 border-lineh' : 'bg-s1 border-line'}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0 flex flex-wrap gap-x-2 gap-y-1 justify-start" dir="rtl" lang="ar">
                  {x.w.map((t, j) => {
                    const on = sel?.s === i && sel?.w === j;
                    return (
                      <button key={j} type="button" onClick={() => { setSel(on ? null : { s: i, w: j }); if (!on) speak(bareWord(t[0])); }}
                        aria-label={`${bareWord(t[0])}: ${t[1]}`} aria-expanded={on}
                        className={`ar text-[28px] sm:text-[32px] leading-[1.7] px-1 rounded-lg ${on ? 'bg-chip text-acct ring-1 ring-acc' : 'text-ink hover:bg-s3'}`}>
                        {tx.showAr(t[0])}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button type="button" onClick={() => one(i)} aria-label={`${i + 1}. cümleyi dinle`} className="w-10 h-10 rounded-full border border-line3 bg-chip text-acct inline-flex items-center justify-center hover:border-lineh"><Raw html={I.speaker(17)} /></button>
                  {!allTr && <button type="button" onClick={() => toggleTr(i)} aria-pressed={open} aria-label="Çeviriyi göster" title="Çeviri" className={`w-10 h-10 rounded-full border text-xs font-bold ${open ? 'border-acc text-acct bg-chip' : 'border-line3 bg-s2 text-soft'}`}>TR</button>}
                </div>
              </div>
              {sel?.s === i && picked && (
                <div className="pop flex flex-wrap items-center gap-3 p-3 rounded-xl bg-s3 border border-line3" role="status">
                  <span className="ar text-[30px] text-ink" lang="ar" dir="rtl">{tx.showAr(bareWord(picked[0]))}</span>
                  <span className="flex-1 min-w-[120px] text-[17px] font-semibold text-soft">{picked[1]}</span>
                  <button type="button" data-say={bareWord(picked[0])} aria-label="Kelimeyi dinle" className="w-10 h-10 rounded-full border border-line3 bg-chip text-acct inline-flex items-center justify-center"><Raw html={I.speaker(16)} /></button>
                  <AddToList word={{ ar: bareWord(picked[0]), tr: picked[1] }} compact />
                </div>
              )}
              {open && <p className="m-0 text-soft leading-relaxed">{x.tr}</p>}
            </div>
          );
        })}
      </article>

      <Questions r={r} />

      {next && (
        <Link href={`/okuma/${next.slug}`} className="self-end inline-flex items-center gap-2 text-acct font-semibold">Sonraki metin: {next.title} <Raw html={I.arrow(16)} /></Link>
      )}
    </div>
  );
}

/* ---------- Anlama soruları ---------- */
function Questions({ r }: { r: Reading }) {
  const { setAct, actState, track } = useApp();
  const [order, setOrder] = useState(() => r.questions.map((q) => q.options));
  const [ans, setAns] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const prev = actState(READING_TOPIC, r.slug);
  // Seçenekler tarayıcıda karışır (sunucudaki ilk çizimle aynı olsun diye sonradan)
  useEffect(() => { setOrder(r.questions.map((q) => shuffle(q.options))); }, [r]);

  const right = r.questions.filter((q, i) => ans[i] === q.a).length;
  const all = Object.keys(ans).length === r.questions.length;
  function check() {
    setChecked(true);
    const score = right / r.questions.length;
    setAct(READING_TOPIC, r.slug, score, score >= 0.7);
    track('activity', { topicId: READING_TOPIC, actKey: r.slug, score });
    document.getElementById('sorular')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function again() { setAns({}); setChecked(false); setOrder(r.questions.map((q) => shuffle(q.options))); }

  return (
    <section id="sorular" className="flex flex-col gap-4 p-5 sm:p-7 rounded-[22px] bg-s3 border border-line scroll-mt-20" aria-labelledby="sorular-baslik">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="sorular-baslik" className="m-0 text-[22px] font-bold">Anlama soruları</h2>
        {prev && !checked && <span className="text-sm text-faint">Önceki en iyi sonucun: %{Math.round(prev.best * 100)}</span>}
      </div>
      {checked && (
        <div className={`pop p-4 rounded-xl border flex flex-wrap items-center gap-3 ${right / r.questions.length >= 0.7 ? 'bg-okbg border-okln' : 'bg-progbg border-progln'}`} role="status">
          <span className={`text-lg font-bold ${right / r.questions.length >= 0.7 ? 'text-okt' : 'text-prog'}`}>{right} / {r.questions.length} doğru</span>
          <span className="text-sm text-soft flex-1 min-w-[200px]">{right === r.questions.length ? 'Harika, metni tamamen anladın.' : right / r.questions.length >= 0.7 ? 'Güzel! Metin okundu olarak işaretlendi.' : 'Metni bir kez daha okuyup tekrar dene; %70 ve üstü okundu sayılır.'}</span>
          <button type="button" onClick={again} className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:text-ink">Tekrar dene</button>
        </div>
      )}
      <ol className="m-0 p-0 list-none flex flex-col gap-5">
        {r.questions.map((q, i) => (
          <li key={i} className="flex flex-col gap-2.5">
            <span className="font-semibold text-ink">{i + 1}. {q.q}</span>
            <div role="radiogroup" aria-label={q.q} className="grid sm:grid-cols-2 gap-2">
              {order[i].map((o) => {
                const on = ans[i] === o;
                const cls = checked ? (o === q.a ? 'is-right' : on ? 'is-wrong' : 'opacity-70') : on ? 'is-sel' : '';
                return (
                  <button key={o} type="button" role="radio" aria-checked={on} disabled={checked} onClick={() => setAns((a) => ({ ...a, [i]: o }))}
                    className={`opt min-h-[52px] px-4 py-2.5 rounded-xl bg-s2 border border-line2 text-left text-ink font-medium ${cls}`}>{o}</button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      {!checked && (
        <div className="flex justify-end">
          <button type="button" onClick={check} disabled={!all} className="h-12 px-7 rounded-xl bg-acc text-onacc font-bold disabled:opacity-40">Cevapları kontrol et</button>
        </div>
      )}
    </section>
  );
}
