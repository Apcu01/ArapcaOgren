'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Example, Section, Topic } from '@/lib/types';
import { actsOf, esc, isAr, TYPE, type ActView, type TextFns } from '@/lib/text';
import { ring } from '@/lib/clock';
import { useApp, SayBtn } from './AppProvider';
import { I, Raw } from './icons';
import Player from './Player';
import ShareCard from './ShareCard';
import ReportButton from './ReportButton';
import { ListenCard, NowPlaying, SectionListen, useLessonAudio, type LessonAudio, type NarrIds } from './LessonAudio';

type Nav = { id: string; name: string } | null;

export default function TopicView({ topic: t, prev, next, narr }: { topic: Topic; prev: Nav; next: Nav; narr?: NarrIds }) {
  const app = useApp();
  const { tx, topicStats, actState, setLast, setLesson, track } = app;
  const list = useMemo(() => actsOf(t), [t]);
  const [tab, setTab] = useState<'lesson' | 'acts'>('lesson');
  const [kind, setKind] = useState('Tümü');
  const [playing, setPlaying] = useState<{ act: ActView; nonce: number } | null>(null);

  useEffect(() => { setLast(t.id); track('view', { path: '/konu/' + t.id, topicId: t.id }); }, [t.id, setLast, track]);
  useEffect(() => { if (location.hash === '#etkinlikler') setTab('acts'); }, []);

  const tracks = useMemo(() => {
    const out = t.lesson.flatMap((s, i) => (narr?.sections[i] ? [{ id: narr.sections[i]!, title: `${i + 1}. ${s.h}`, anchor: `b${i + 1}` }] : []));
    if (narr?.summary) out.push({ id: narr.summary, title: 'Özet: akılda kalacaklar', anchor: 'puf' });
    return out;
  }, [t.lesson, narr]);
  const la = useLessonAudio(tracks);
  const st = topicStats(t.id, list);
  const [share, setShare] = useState<null | { congrats: boolean }>(null);
  const pctAtOpen = useRef(st.pct);
  // Ders kartı için: denenen etkinliklerin en iyi skorlarının ortalaması
  const tried = list.map((a) => actState(t.id, a.id)).filter((x): x is NonNullable<typeof x> => !!x);
  const avgScore = tried.length ? tried.reduce((n, x) => n + x.best, 0) / tried.length : 0;
  const nextAct = list.find((a) => !actState(t.id, a.id)?.done) || null;
  const mins = list.reduce((n, a) => n + a.mins, 0) + (t.readMins || 10);

  function changeTab(v: 'lesson' | 'acts') {
    setTab(v);
    history.replaceState(null, '', v === 'acts' ? '#etkinlikler' : location.pathname + location.search);
  }
  const openAct = (a: ActView) => {
    la.stop(); if (!playing) pctAtOpen.current = st.pct; setPlaying({ act: a, nonce: Date.now() }); };
  function readDone() {
    if (!st.lesson) track('lesson', { topicId: t.id });
    setLesson(t.id);
    changeTab('acts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goNext() {
    if (!st.lesson) { changeTab('lesson'); setTimeout(() => document.getElementById('pane')?.scrollIntoView({ behavior: 'smooth' }), 0); return; }
    openAct(nextAct || list[list.length - 1]);
  }

  return (
    <div className={`max-w-[1240px] mx-auto px-4 sm:px-6 pt-8 ${la.cur != null ? 'pb-44' : 'pb-20'} flex flex-col gap-8`}>
      <nav aria-label="Sayfa yolu" className="flex items-center gap-2.5 text-sm text-faint">
        <Link href="/" className="inline-flex items-center gap-1.5 text-mute hover:text-ink"><Raw html={I.back()} /> Kategoriler</Link>
        <span aria-hidden="true">/</span><span className="text-ink">{t.name}</span>
      </nav>

      <section className="flex flex-wrap gap-8 items-center justify-between p-6 sm:p-9 rounded-3xl bg-s3 border border-track">
        <div className="flex-[999_1_480px] min-w-0 flex flex-col gap-3.5">
          <div className="flex flex-wrap items-baseline gap-x-[18px] gap-y-1">
            <h1 className="m-0 text-[36px] sm:text-[46px] leading-[1.1] tracking-[-0.025em] font-bold">{t.name}</h1>
            <Raw html={tx.ar(t.ar, 'text-[36px] sm:text-[46px] leading-[1.1] text-acct')} />
          </div>
          <Raw as="p" className="m-0 max-w-[560px] text-[17px] leading-relaxed text-mute" html={tx.text(t.long || t.desc)} />
          <div className="flex flex-wrap gap-2.5 mt-1">
            {[t.level, 'Ders ' + t.n, list.length + ' etkinlik', '~' + mins + ' dk'].map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-full bg-s5 border border-line2 text-[13px] font-semibold text-soft">{c}</span>
            ))}
          </div>
        </div>
        <div className="flex-[1_1_300px] min-w-0 flex items-center gap-[22px]">
          <Raw html={ring(st.pct)} />
          <div className="flex flex-col gap-2.5">
            <span className="text-[15px] text-mute">{st.done} / {st.total} etkinlik{st.lesson ? ' · konu okundu' : ''}</span>
            <button type="button" onClick={goNext} className="inline-flex items-center justify-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold text-[15px]">
              {!st.lesson ? 'Konuyu oku' : nextAct ? 'Sıradakine geç' : 'Tekrar et'} <Raw html={I.arrow()} />
            </button>
            {st.pct === 100 && (
              <button type="button" onClick={() => setShare({ congrats: false })} className="inline-flex items-center justify-center gap-2 px-5 h-[42px] rounded-xl border border-line3 bg-s2 text-soft font-semibold text-sm hover:border-lineh hover:text-ink">Paylaşım kartı</button>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-7 items-start">
        <section className="flex-[999_1_600px] min-w-0 flex flex-col gap-6">
          <div role="tablist" aria-label="Bölüm" className="flex gap-1 p-1 rounded-2xl bg-s1 border border-line self-start">
            <button type="button" role="tab" aria-selected={tab === 'lesson'} onClick={() => changeTab('lesson')} className={`h-11 px-5 rounded-xl font-bold text-[15px] inline-flex items-center gap-2 ${tab === 'lesson' ? 'bg-chip text-ink border border-line3' : 'text-mute hover:text-ink border border-transparent'}`}><Raw html={I.book(17)} /> Konu anlatımı</button>
            <button type="button" role="tab" aria-selected={tab === 'acts'} onClick={() => changeTab('acts')} className={`h-11 px-5 rounded-xl font-bold text-[15px] inline-flex items-center gap-2 ${tab === 'acts' ? 'bg-chip text-ink border border-line3' : 'text-mute hover:text-ink border border-transparent'}`}>Etkinlikler <span className="text-xs px-2 py-0.5 rounded-full bg-s5 border border-line2 text-soft">{list.length}</span></button>
          </div>
          <div id="pane">
            {tab === 'lesson'
              ? <Lesson t={t} tx={tx} lessonRead={st.lesson} onDone={readDone} la={la} />
              : <Activities t={t} list={list} kind={kind} setKind={setKind} nextId={nextAct?.id} onOpen={openAct} />}
          </div>
          <div className="flex flex-wrap justify-between gap-3 pt-4 border-t border-line">
            {prev ? <Link href={`/konu/${prev.id}`} className="inline-flex items-center gap-2 text-mute hover:text-ink"><Raw html={I.back()} /> {prev.name}</Link> : <span />}
            {next && <Link href={`/konu/${next.id}`} className="inline-flex items-center gap-2 text-acct">Sonraki ders: {next.name} <Raw html={I.arrow(16)} /></Link>}
          </div>
        </section>
        <Words t={t} />
      </div>

      <NowPlaying la={la} />
      {share && <ShareCard topicId={t.id} topicName={t.name} topicAr={t.ar} score={avgScore} acts={st.done} congrats={share.congrats} onClose={() => setShare(null)} />}
      {playing && (
        <Player
          key={playing.act.id + playing.nonce}
          topic={t}
          act={playing.act}
          list={list}
          onClose={() => {
            setPlaying(null);
            changeTab('acts');
            // Son etkinlikle ders tamamlandıysa tebrik kartını aç
            if (pctAtOpen.current < 100 && st.pct === 100) setShare({ congrats: true });
          }}
          onSwitch={openAct}
        />
      )}
    </div>
  );
}

/* ---------- Anlatım ---------- */
function Lesson({ t, tx, lessonRead, onDone, la }: { t: Topic; tx: TextFns; lessonRead: boolean; onDone: () => void; la: LessonAudio }) {
  const rich = (h: string) => tx.rich(h);
  const example = (e: Example, i: number) => (
    <div key={i} className="flex flex-col gap-2 p-4 sm:p-5 rounded-2xl bg-s1 border border-line">
      <div className="flex items-center justify-between gap-3">
        <SayBtn text={e.ar} />
        <Raw html={tx.ar(e.ar, 'text-[28px] sm:text-[30px] text-ink text-right flex-1')} />
      </div>
      {e.tl && <div className="tl text-sm text-faint text-right">{e.tl}</div>}
      <div className="flex flex-col gap-1 pt-2 border-t border-line4">
        <div className="flex gap-2 text-[15px]"><span className="shrink-0 w-7 text-xs font-bold text-lab pt-0.5">TR</span><span className="text-ink">{e.tr}</span></div>
        {e.en && <div className="en flex gap-2 text-[15px]"><span className="shrink-0 w-7 text-xs font-bold text-lab pt-0.5">EN</span><span className="text-mute">{e.en}</span></div>}
        {e.note && <Raw as="div" className="text-sm text-mute2 leading-relaxed mt-1" html={rich(e.note)} />}
      </div>
    </div>
  );
  const cell = (c: string) => {
    if (c.includes('{{') || /[A-Za-zÇĞİÖŞÜçğıöşü0-9]/.test(c)) return rich(c);
    if (isAr(c)) return `<span class="inline-flex items-center gap-2">${tx.ar(c)}<button type="button" data-say="${esc(c)}" aria-label="Dinle" class="text-faint hover:text-acct">${I.speaker(15)}</button></span>`;
    return c;
  };
  const table = (tb: NonNullable<Section['table']>) => (
    <div className="overflow-x-auto rounded-2xl border border-line2 bg-s1">
      <table className="lt">
        <thead><tr>{tb.cols.map((c, i) => <th key={i} dangerouslySetInnerHTML={{ __html: tx.text(c) }} />)}</tr></thead>
        <tbody>{tb.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} dangerouslySetInnerHTML={{ __html: cell(c) }} />)}</tr>)}</tbody>
      </table>
    </div>
  );
  const tip = (text: string, i: number) => (
    <div key={i} className="flex gap-3 p-4 sm:p-5 rounded-2xl bg-progbg/60 border border-progln">
      <span className="text-prog shrink-0 mt-0.5"><Raw html={I.bulb(20)} /></span>
      <div className="prose-l"><p className="!text-[15.5px]"><b className="text-prog">Püf noktası: </b><Raw html={rich(text)} /></p></div>
    </div>
  );
  const compare = (c: NonNullable<Section['cmp']>) => (
    <div className="grid sm:grid-cols-2 gap-3">
      {c.tr && <div className="p-4 sm:p-5 rounded-2xl bg-s1 border border-line flex flex-col gap-2"><span className="text-xs font-bold tracking-[.1em] uppercase text-lab">Türkçede</span><div className="prose-l"><p className="!text-[15px]" dangerouslySetInnerHTML={{ __html: rich(c.tr) }} /></div></div>}
      {c.en && <div className="en p-4 sm:p-5 rounded-2xl bg-s1 border border-line flex flex-col gap-2"><span className="text-xs font-bold tracking-[.1em] uppercase text-lab">İngilizcede</span><div className="prose-l"><p className="!text-[15px]" dangerouslySetInnerHTML={{ __html: rich(c.en) }} /></div></div>}
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <ListenCard la={la} />
      <div className="p-5 sm:p-6 rounded-2xl bg-s3 border border-line2 flex flex-col gap-3">
        <span className="text-xs font-bold tracking-[.12em] uppercase text-lab">Bu derste</span>
        <div className="prose-l"><p dangerouslySetInnerHTML={{ __html: rich(t.intro) }} /></div>
        <nav aria-label="Bölümler" className="flex flex-wrap gap-2 mt-1">
          {t.lesson.map((s, i) => <a key={i} href={`#b${i + 1}`} className="px-3 py-1.5 rounded-full bg-s5 border border-line2 text-[13px] font-semibold text-soft hover:text-ink hover:border-lineh">{i + 1}. {s.h}</a>)}
          <a href="#puf" className="px-3 py-1.5 rounded-full bg-s5 border border-line2 text-[13px] font-semibold text-soft hover:text-ink hover:border-lineh">Özet & hatalar</a>
        </nav>
      </div>
      {t.lesson.map((s, i) => (
        <div key={i} className="contents">
          {i > 0 && <hr className="border-0 h-px bg-line my-2" />}
          <section id={`b${i + 1}`} className={`scroll-mt-24 flex flex-col gap-4 pt-2 ${la.activeAnchor === `b${i + 1}` ? 'narr-on' : ''}`}>
            <h2 className="m-0 flex flex-wrap items-baseline gap-3 text-[22px] sm:text-2xl font-bold tracking-tight"><span className="text-acct text-base font-bold">{i + 1}.</span>{s.h}<SectionListen la={la} anchor={`b${i + 1}`} /></h2>
            {s.p && s.p.length > 0 && <div className="prose-l">{s.p.map((p, j) => <p key={j} dangerouslySetInnerHTML={{ __html: rich(p) }} />)}</div>}
            {s.table && table(s.table)}
            {s.p2 && s.p2.length > 0 && <div className="prose-l">{s.p2.map((p, j) => <p key={j} dangerouslySetInnerHTML={{ __html: rich(p) }} />)}</div>}
            {s.ex && s.ex.length > 0 && <div className="grid gap-3 md:grid-cols-2">{s.ex.map(example)}</div>}
            {s.cmp && (s.cmp.tr || s.cmp.en) && compare(s.cmp)}
            {(s.tips || []).map(tip)}
            <div className="flex justify-end"><ReportButton topicId={t.id} kind="section" label="Bu bölümde hata mı var?" context={{ label: (i + 1) + '. ' + s.h, section: s.h }} /></div>
          </section>
        </div>
      ))}
      <section id="puf" className={`scroll-mt-24 flex flex-col gap-4 ${la.activeAnchor === 'puf' ? 'narr-on' : ''}`}>
        <h2 className="m-0 flex flex-wrap items-baseline gap-3 text-2xl font-bold tracking-tight">Özet: akılda kalacaklar<SectionListen la={la} anchor="puf" /></h2>
        <ul className="m-0 p-0 list-none grid gap-2.5">
          {t.keys.map((k, i) => (
            <li key={i} className="flex gap-3 p-4 rounded-xl bg-s1 border border-line"><span className="text-ok shrink-0 mt-0.5"><Raw html={I.check(18)} /></span><span className="prose-l"><span className="text-[15.5px] leading-relaxed text-prose" dangerouslySetInnerHTML={{ __html: rich(k) }} /></span></li>
          ))}
        </ul>
        {t.mistakes.length > 0 && (
          <>
            <h3 className="m-0 mt-4 text-xl font-bold flex items-center gap-2"><span className="text-bad"><Raw html={I.alert(20)} /></span> Sık yapılan hatalar</h3>
            <div className="grid gap-3">
              {t.mistakes.map((m, i) => (
                <div key={i} className="rounded-2xl bg-s1 border border-line p-4 sm:p-5 flex flex-col gap-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-badbg border border-badln"><span className="text-bad shrink-0"><Raw html={I.x(18)} /></span><Raw html={tx.auto(m.bad, 'text-2xl text-badfg')} /></div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-okbg border border-okln"><span className="text-okt shrink-0"><Raw html={I.check(18)} /></span><Raw html={tx.auto(m.good, 'text-2xl text-okfg')} /></div>
                  </div>
                  <p className="m-0 text-[15px] text-mute leading-relaxed" dangerouslySetInnerHTML={{ __html: rich(m.why) }} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-s4 border border-line3">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-lg">{lessonRead ? 'Konuyu okudun' : 'Konuyu okudun mu?'}</span>
          <span className="text-sm text-mute">Şimdi öğrendiklerini etkinliklerle pekiştirme zamanı.</span>
        </div>
        <button type="button" onClick={onDone} className="inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold">{lessonRead ? 'Etkinliklere geç' : 'Okudum, etkinliklere geç'} <Raw html={I.arrow()} /></button>
      </div>
    </div>
  );
}

/* ---------- Etkinlik kartları ---------- */
function Activities({ t, list, kind, setKind, nextId, onOpen }: {
  t: Topic; list: ActView[]; kind: string; setKind: (k: string) => void; nextId?: string; onOpen: (a: ActView) => void;
}) {
  const { tx, actState } = useApp();
  const kinds = ['Tümü', ...new Set(list.map((a) => TYPE[a.type].kind))];
  const shown = list.filter((a) => kind === 'Tümü' || TYPE[a.type].kind === kind);
  const badge = (a: ActView): [string, string] => {
    const s = actState(t.id, a.id);
    if (s && s.done) return ['Tamamlandı · %' + Math.round(s.best * 100), 'bg-okbg text-okt border-okln'];
    if (s) return ['Denendi · %' + Math.round(s.best * 100), 'bg-progbg text-prog border-progln'];
    return ['Başlanmadı', 'bg-s0 text-dim border-edge'];
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-3.5 items-center justify-between">
        <p className="m-0 text-mute text-[15px]">Etkinlikler önerilen sırada. %70 ve üstü başarı tamamlanmış sayılır.</p>
        <div role="group" aria-label="Etkinlik türü" className="flex flex-wrap gap-2">
          {kinds.map((k) => <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={`h-11 px-4 rounded-full font-semibold text-sm border ${kind === k ? 'bg-acc text-onacc border-acc' : 'bg-s2 text-soft border-line2 hover:border-lineh'}`}>{k}</button>)}
        </div>
      </div>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        {shown.map((a) => {
          const [bl, bc] = badge(a);
          const cur = nextId === a.id;
          return (
            <button key={a.id} type="button" onClick={() => onOpen(a)} className={`act-card text-left flex flex-col gap-[18px] p-[22px] rounded-[18px] text-ink ${cur ? 'bg-s4 border border-lineh' : 'bg-s3 border border-line'}`}>
              <span className="flex justify-between items-center gap-3 w-full">
                <span className="text-xs font-bold tracking-[.08em] uppercase text-lab">{TYPE[a.type].label}</span>
                <span className={`px-2.5 py-[5px] rounded-full text-xs font-bold border ${bc}`}>{bl}</span>
              </span>
              <span className="flex items-center gap-4">
                <span className="flex-none w-[60px] h-[60px] rounded-[14px] bg-chip border border-chipln flex items-center justify-center font-ar text-[20px] text-acct overflow-hidden" aria-hidden="true">{tx.showAr(a.glyph || t.glyph)}</span>
                <span className="flex flex-col gap-1 min-w-0">
                  <span className="text-lg font-bold">{a.title}</span>
                  <Raw className="text-sm leading-relaxed text-mute2" html={tx.text(a.desc)} />
                </span>
              </span>
              <span className="flex justify-between items-center w-full pt-3.5 border-t border-line text-[13px] text-mute2 mt-auto">
                <span className="inline-flex items-center gap-1.5"><Raw html={I.clock()} /> {a.mins} dk</span>
                <span>{cur && <><b className="text-acct">Sıradaki</b> · </>}{a.meta}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Kelime paneli ---------- */
function Words({ t }: { t: Topic }) {
  const { tx } = useApp();
  return (
    <aside className="flex-[1_1_320px] min-w-0 flex flex-col gap-4 p-6 rounded-[20px] bg-s1 border border-line lg:sticky lg:top-6">
      <div className="flex justify-between items-center">
        <h2 className="m-0 text-lg font-bold">Kelime önizleme</h2>
        <span className="text-[13px] text-faint">{t.words.length} kelime</span>
      </div>
      <div className="flex flex-col max-h-[560px] overflow-y-auto pr-1">
        {t.words.map((w, i) => (
          <div key={i} className="flex justify-between items-center gap-3 py-3 border-b border-line4">
            <span className="flex flex-col min-w-0"><span className="text-[15px] text-soft">{w.tr}</span>{w.tl && <span className="tl text-xs text-faint">{w.tl}</span>}</span>
            <span className="flex items-center gap-2">
              <Raw html={tx.ar(w.ar, 'text-[22px] text-ink')} />
              <button type="button" data-say={w.ar} aria-label={`${w.tr}: dinle`} className="w-8 h-8 inline-flex items-center justify-center rounded-full text-faint hover:text-acct" dangerouslySetInnerHTML={{ __html: I.speaker(15) }} />
            </span>
          </div>
        ))}
      </div>
      <Link href={`/sozluk?konu=${t.id}`} className="h-[46px] rounded-xl border border-line3 text-acct font-semibold text-[15px] inline-flex items-center justify-center hover:border-lineh">Sözlükte gör</Link>
    </aside>
  );
}
