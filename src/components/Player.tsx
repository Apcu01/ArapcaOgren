'use client';

/* Etkinlik oynatıcısı: kelime kartları, eşleştirme, çoktan seçmeli, boşluk doldurma,
   doğru/yanlış, cümle kurma, dinleme, karma konu testi ve sınırsız saat pratiği */
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Pair, Question, QType, Word } from '@/lib/types';
import { esc, isAr, shuffle, SPEAK_MAX, TYPE, type ActView } from '@/lib/text';
import { pronScore, pronVerdict, type PronVerdict } from '@/lib/pron';
import { clockSVG, distractors, fmt, hmKey, nextH, randTime, ring, timeAr, timeTr, timeWhy, type HM } from '@/lib/clock';
import { hash53 } from '@/lib/qkey';

/* ---------- Hatalarım için yanlışları çoktan seçmeli soruya çevirme (seçenekler kararlı) ---------- */
const pick3 = (seed: string, pool: string[]) => [...new Set(pool)].sort((a, b) => (hash53(seed + a) < hash53(seed + b) ? -1 : 1)).slice(0, 3);
const wordQ = (w: Word, words: Word[]): Question => ({
  t: 'mc', q: 'Bu kelimenin anlamı nedir?', ar: w.ar, tl: w.tl,
  options: [w.tr, ...pick3(w.ar, words.filter((x) => x.tr !== w.tr).map((x) => x.tr))], a: w.tr
});
const pairQ = (p: { l: string; r: string }, all: { l: string; r: string }[]): Question => {
  const options = [p.r, ...pick3(p.l, all.filter((x) => x.r !== p.r).map((x) => x.r))];
  return isAr(p.l) ? { t: 'mc', q: 'Karşılığı hangisi?', ar: p.l, options, a: p.r } : { t: 'mc', q: `"${p.l}" karşılığı hangisi?`, options, a: p.r };
};
const clockQ = (t: HM): Question => {
  const mir: Record<number, number> = { 0: 30, 5: 55, 10: 50, 15: 45, 20: 40, 25: 35, 30: 0, 35: 25, 40: 20, 45: 15, 50: 10, 55: 5 };
  const opts = [t, { h: nextH(t.h), m: t.m }, { h: t.h, m: mir[t.m] }, { h: ((t.h + 10) % 12) + 1, m: t.m }];
  return { t: 'mc', q: 'Saat kaç?', clock: fmt(t.h, t.m), options: [...new Set(opts.map((o) => timeAr(o.h, o.m)))], a: timeAr(t.h, t.m), why: timeWhy(t.h, t.m) };
};
// Bildirime eklenen içerik: oynatıcının iç alanları atılır
const cleanQ = (q: Question & { _retry?: boolean; _i?: number }) => { const { _retry, _i, ...rest } = q; void _retry; void _i; return rest as Question; };
const cleanW = (w: Word & { _i?: number }) => ({ ar: w.ar, tr: w.tr, tl: w.tl, en: w.en, note: w.note });
const wordLabel = (w: Word) => w.ar + ' (' + w.tr + ')';
const MIN_LABEL: Record<number, string> = { 0: 'tam saat', 5: '5 geçe', 10: '10 geçe', 15: 'çeyrek geçe', 20: '20 geçe', 25: '25 geçe', 30: 'buçuk', 35: '35 geçe', 40: '20 kala', 45: 'çeyrek kala', 50: '10 kala', 55: '5 kala' };
import { useApp, SayBtn } from './AppProvider';
import { qTypeOf, questionKey, questionLabel, type AnswerRec } from '@/lib/qkey';
import { I, Raw } from './icons';
import ReportButton from './ReportButton';

export type PTopic = { id: string; name: string; words: Word[] };
type Wrong = { prompt: string; right: string; given?: string; why?: string };
type Endless = { answered: number; correct: number; best: number };
type Finish = (score: number, done: boolean, wrong: Wrong[], endless?: Endless) => void;
type SetHdr = (progress: number, label: string) => void;

const endlessDone = (e: Endless) => e.answered >= 10 && e.correct / e.answered >= 0.7;

export default function Player({ topic, act, list, onClose, onSwitch, preview = false, practice = false }: {
  topic: PTopic;
  act: ActView;
  list: ActView[];
  onClose: () => void;
  onSwitch: (a: ActView) => void;
  /** Yönetim panelindeki önizleme: skor kaydedilmez */
  preview?: boolean;
  /** Hatalarım pratiği: etkinlik skoru kaydedilmez, doğru cevaplanan hata listeden düşer */
  practice?: boolean;
}) {
  const { setAct, track, addMistake, resolveMistake } = useApp();
  const answers = useRef<AnswerRec[]>([]);
  const log = useCallback((a: AnswerRec) => { answers.current.push(a); }, []);
  // Yanlışlar Hatalarım'a eklenir; daha önce yanlış yapılıp şimdi doğru cevaplanan soru listeden düşer
  const miss = useCallback((q: Question) => { if (!preview && !practice) addMistake(topic.id, q); }, [preview, practice, addMistake, topic.id]);
  const hit = useCallback((q: Question) => { if (!preview) resolveMistake(topic.id, q); }, [preview, resolveMistake, topic.id]);
  const [hdr, setHdrState] = useState({ p: 0, label: '' });
  const [result, setResult] = useState<null | { score: number; done: boolean; wrong: Wrong[]; endless?: Endless }>(null);
  const root = useRef<HTMLDivElement>(null);
  const endlessRef = useRef<Endless | null>(null);
  const saved = useRef(false);

  const setHdr = useCallback<SetHdr>((p, label) => setHdrState((h) => (h.p === p && h.label === label ? h : { p, label })), []);
  const toTop = useCallback(() => { if (root.current) root.current.scrollTop = 0; }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    root.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = '';
      try { speechSynthesis.cancel(); } catch { /* yok */ }
    };
  }, []);

  const save = useCallback((score: number, done: boolean) => {
    saved.current = true;
    if (preview || practice) return;
    setAct(topic.id, act.id, score, done);
    track('activity', { topicId: topic.id, actKey: act.id, score, answers: answers.current.slice(0, 300) });
  }, [setAct, track, topic.id, act.id, preview, practice]);

  const finish = useCallback<Finish>((score, done, wrong, endless) => {
    save(score, done);
    setResult({ score, done, wrong, endless });
    setHdr(1, 'Bitti');
    toTop();
  }, [save, setHdr, toTop]);

  const close = useCallback(() => {
    // Sınırsız pratikte sonuç ekranına geçmeden çıkılırsa da skoru kaydet
    const e = endlessRef.current;
    if (e && !saved.current && e.answered > 0) save(e.correct / e.answered, endlessDone(e));
    onClose();
  }, [onClose, save]);

  function onKey(e: React.KeyboardEvent) {
    if (!root.current) return;
    if (e.key === 'Escape') close();
    if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const opts = [...root.current.querySelectorAll<HTMLButtonElement>('.opt[data-v]:not(:disabled)')];
      const o = opts[+e.key - 1];
      if (o) { e.preventDefault(); o.click(); }
    }
    if (e.key === 'Enter') {
      const n = root.current.querySelector<HTMLButtonElement>('[data-next]');
      const ae = document.activeElement;
      if (n && ae && !ae.matches('button,a,input')) { e.preventDefault(); n.click(); }
    }
  }

  const props = { topic, act, finish, setHdr, toTop, endlessRef, close, log, miss, hit, preview };
  return (
    <div id="player" ref={root} tabIndex={-1} onKeyDown={onKey} className="fixed inset-0 z-[80] bg-bg overflow-y-auto outline-none" role="dialog" aria-modal="true">
      <div className="min-h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-head/95 backdrop-blur border-b border-line">
          <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4">
            <button type="button" onClick={close} aria-label="Etkinliği kapat" className="w-11 h-11 shrink-0 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh" dangerouslySetInnerHTML={{ __html: I.x() }} />
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="truncate text-mute">{preview && <span className="mr-2 px-2 py-0.5 rounded-full bg-progbg border border-progln text-prog text-[11px] font-bold">Önizleme</span>}<span className="text-lab font-bold uppercase tracking-[.08em] text-xs">{TYPE[act.type].label}</span> · {topic.name}: {act.title}</span>
                <span className="shrink-0 text-faint">{hdr.label}</span>
              </div>
              <div className="h-2 rounded-full bg-track overflow-hidden"><div className="h-full rounded-full bg-acc transition-all duration-300" style={{ width: Math.round(hdr.p * 100) + '%' }} /></div>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-[860px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {result ? (
            <Result {...result} act={act} list={list} onAgain={() => onSwitch(act)} onBack={close} onNext={onSwitch} />
          ) : act.type === 'flash' ? <Flash {...props} />
            : act.type === 'match' ? <Match {...props} />
            : act.type === 'clock' ? <ClockPractice {...props} />
            : act.type === 'speak' ? <Speak {...props} />
            : <Quiz {...props} />}
        </div>
      </div>
    </div>
  );
}

type SubProps = {
  topic: PTopic;
  act: ActView;
  finish: Finish;
  setHdr: SetHdr;
  toTop: () => void;
  endlessRef: React.MutableRefObject<Endless | null>;
  close: () => void;
  log: (a: AnswerRec) => void;
  miss: (q: Question) => void;
  hit: (q: Question) => void;
  preview: boolean;
};

/* ================= Kelime kartları ================= */
function Flash({ topic, act, finish, setHdr, miss, hit, preview }: SubProps) {
  const { tx } = useApp();
  const items = useMemo(() => ((act.items as Word[] | null | undefined)?.length ? (act.items as Word[]) : topic.words), [act.items, topic.words]);
  const [queue, setQueue] = useState(() => shuffle(items.map((w, i) => ({ ...w, _i: i }))));
  const [known, setKnown] = useState(0);
  const [missed, setMissed] = useState<Set<number>>(new Set());
  const [flipped, setFlipped] = useState(false);
  const [turn, setTurn] = useState(0);
  const front = useRef<HTMLButtonElement>(null);
  const knowBtn = useRef<HTMLButtonElement>(null);
  const total = items.length;

  useEffect(() => { setHdr(known / total, `${known} / ${total} kart`); }, [known, total, setHdr]);
  useEffect(() => {
    if (queue.length) return;
    const wrong = [...missed].map((i) => ({ prompt: tx.ar(items[i].ar, 'text-2xl'), right: esc(items[i].tr), why: items[i].tl ? 'Okunuşu: ' + esc(items[i].tl) : '' }));
    finish((total - missed.size) / total, true, wrong);
  }, [queue.length]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (flipped) knowBtn.current?.focus(); else front.current?.focus(); }, [flipped, turn]);

  const w = queue[0];
  if (!w) return null;
  const next = (knew: boolean) => {
    setFlipped(false);
    setTurn((n) => n + 1);
    if (knew) { setKnown((k) => k + 1); setQueue((q) => q.slice(1)); if (!missed.has(w._i)) hit(wordQ(w, items)); }
    else { if (!missed.has(w._i)) miss(wordQ(w, items)); setMissed((m) => new Set(m).add(w._i)); setQueue((q) => [...q.slice(1), q[0]]); }
  };

  return (
    <div className="flex flex-col items-center gap-8 pop" key={turn}>
      <p className="text-mute text-center">Kartın Arapça yüzünü oku, sesli dinle, anlamını tahmin et; sonra kartı çevir.</p>
      <div className={`flip w-full max-w-[520px] ${flipped ? 'is-flipped' : ''}`} onClick={(e) => { if (flipped && !(e.target as HTMLElement).closest('[data-say]')) setFlipped(false); }}>
        <div className="flip-inner">
          <button ref={front} type="button" onClick={() => setFlipped(true)} className="flip-face w-full min-h-[300px] rounded-3xl bg-s4 border border-line3 p-8 flex flex-col items-center justify-center gap-4 text-ink">
            <span className="text-xs font-bold tracking-[.12em] uppercase text-lab">Arapça</span>
            <Raw html={tx.ar(w.ar, 'text-[56px] leading-tight text-ink text-center')} />
            {w.tl && <span className="tl text-mute text-lg">{w.tl}</span>}
            <span className="mt-2 inline-flex items-center gap-2 text-sm text-faint"><Raw html={I.flipI(16)} /> Çevirmek için dokun</span>
          </button>
          <div className="flip-face flip-back w-full rounded-3xl bg-s5 border border-lineh p-8 flex flex-col items-center justify-center gap-3 text-center">
            <span className="text-xs font-bold tracking-[.12em] uppercase text-lab">Anlamı</span>
            <span className="text-[34px] font-bold leading-tight">{w.tr}</span>
            {w.en && <span className="en text-mute text-lg">EN: {w.en}</span>}
            <Raw html={tx.ar(w.ar, 'text-3xl text-accs')} />
            {w.note && <span className="text-sm text-mute2 max-w-[380px] leading-relaxed">{w.note}</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3"><SayBtn text={w.ar} cls="w-12 h-12" /><span className="text-sm text-faint">Telaffuzu dinle</span></div>
      {!preview && <ReportButton topicId={topic.id} kind="word" label="Bu kartta hata mı var?" context={{ label: wordLabel(w), word: cleanW(w), act: act.title }} />}
      {flipped && (
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => next(false)} className="h-12 px-6 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh inline-flex items-center gap-2"><Raw html={I.refresh(17)} /> Tekrar göster</button>
          <button ref={knowBtn} type="button" data-next onClick={() => next(true)} className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2"><Raw html={I.check(17)} /> Biliyorum</button>
        </div>
      )}
    </div>
  );
}

/* ================= Eşleştirme ================= */
type MPair = { l: string; r: string; i: number };
function Match({ act, finish, setHdr, miss, hit }: SubProps) {
  const { tx, speak } = useApp();
  const rounds = useMemo(() => {
    const pairs = shuffle((act.items as Pair[]).map((p, i) => ({ l: p[0], r: p[1], i })));
    const rs: MPair[][] = [];
    for (let i = 0; i < pairs.length; i += 5) rs.push(pairs.slice(i, i + 5));
    // tek kalan çifti önceki tura kat
    if (rs.length > 1 && rs[rs.length - 1].length < 3) { const last = rs.pop()!; rs[rs.length - 1].push(...last); }
    return rs;
  }, [act.items]);
  const total = rounds.reduce((n, r) => n + r.length, 0);
  const [round, setRound] = useState(0);
  const [matched, setMatched] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const missPairs = useRef(new Map<number, MPair>());
  const [sel, setSel] = useState<{ side: 'l' | 'r'; i: number } | null>(null);
  const [right, setRight] = useState<Set<number>>(new Set());
  const [gone, setGone] = useState<Set<number>>(new Set());
  const [bad, setBad] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const pairs = rounds[round];
  const order = useMemo(() => ({ L: shuffle(pairs), R: shuffle(pairs) }), [pairs]);

  useEffect(() => { setHdr(matched / total, `${matched} / ${total} çift`); }, [matched, total, setHdr]);

  function click(side: 'l' | 'r', i: number) {
    if (!sel || sel.side === side) {
      setSel({ side, i });
      const p = pairs.find((x) => x.i === i)!;
      if (side === 'l' && isAr(p.l)) speak(p.l);
      return;
    }
    const a = sel;
    setSel(null);
    if (a.i === i) {
      const nr = new Set(right).add(i);
      const allPairs = rounds.flat();
      const mp = pairs.find((x) => x.i === i)!;
      if (!missPairs.current.has(i)) hit(pairQ(mp, allPairs));
      setRight(nr);
      setTimeout(() => setGone((g) => new Set(g).add(i)), 450);
      const m = matched + 1;
      setMatched(m);
      setMsg('Doğru eşleşme!');
      if (pairs.every((p) => nr.has(p.i))) {
        setTimeout(() => {
          if (round + 1 < rounds.length) { setRound(round + 1); setRight(new Set()); setGone(new Set()); setMsg(''); }
          else {
            const wrong = [...missPairs.current.values()].map((p) => ({ prompt: tx.auto(p.l, 'text-2xl'), right: tx.auto(p.r, 'text-2xl') }));
            const score = total / (total + mistakes);
            finish(score, score >= 0.7, wrong);
          }
        }, 650);
      }
    } else {
      setMistakes((x) => x + 1);
      const li = a.side === 'l' ? a.i : i;
      const lp = pairs.find((x) => x.i === li)!;
      if (!missPairs.current.has(li)) miss(pairQ(lp, rounds.flat()));
      missPairs.current.set(li, lp);
      const ids = [a.side + a.i, side + i];
      setBad(ids);
      setTimeout(() => setBad((b) => (b === ids ? [] : b)), 500);
      setMsg('Bu ikisi eş değil, tekrar dene.');
    }
  }

  const col = (arr: MPair[], side: 'l' | 'r') => arr.map((p) => {
    const txt = side === 'l' ? p.l : p.r;
    const isRight = right.has(p.i);
    const cls = [
      'opt w-full min-h-[64px] px-4 py-3 rounded-2xl bg-s3 border border-line2 text-ink text-[16px] font-semibold text-center',
      sel && sel.side === side && sel.i === p.i ? 'is-sel' : '',
      isRight ? 'is-right' : '',
      gone.has(p.i) ? 'is-gone' : '',
      bad.includes(side + p.i) ? 'is-wrong shake' : ''
    ].join(' ');
    return (
      <button key={side + p.i} type="button" className={cls} disabled={isRight} onClick={() => click(side, p.i)}>
        <Raw html={tx.auto(txt, 'text-[26px]')} />
      </button>
    );
  });

  return (
    <div className="flex flex-col gap-6 pop" key={round}>
      <div className="text-center flex flex-col gap-2">
        <h2 className="m-0 text-2xl font-bold">Eşleri bul</h2>
        <p className="m-0 text-mute">Soldan bir öğe seç, sonra sağdaki karşılığına dokun.{rounds.length > 1 ? ` Tur ${round + 1} / ${rounds.length}.` : ''}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <div className="flex flex-col gap-3">{col(order.L, 'l')}</div>
        <div className="flex flex-col gap-3">{col(order.R, 'r')}</div>
      </div>
      <p className="text-center text-sm text-faint min-h-[20px]" aria-live="polite">{msg}</p>
    </div>
  );
}

/* ================= Soru tabanlı etkinlikler ================= */
type Q = Question & { t: QType; _retry?: boolean };

function buildListen(words: Word[]): Q[] {
  return shuffle(words).slice(0, 10).map((w) => {
    const others = shuffle(words.filter((x) => x.tr !== w.tr)).slice(0, 3).map((x) => x.tr);
    return { t: 'listen', ar: w.ar, tl: w.tl, options: [w.tr, ...others], a: w.tr };
  });
}

function Quiz({ topic, act, finish, setHdr, toTop, log, miss, hit, preview }: SubProps) {
  const { tx, speak, canSpeak } = useApp();
  const T = tx.text;
  const initial = useMemo<Q[]>(() => {
    let items: Q[] = act.type === 'listen' && !(act.items && act.items.length)
      ? buildListen(topic.words)
      : ((act.items || []) as Question[]).map((x) => ({ ...x, t: (x.t || (act.type === 'test' ? 'mc' : act.type)) as QType }));
    if (!act.keepOrder) items = shuffle(items);
    return items;
  }, [act, topic.words]);
  const total = initial.length;
  const [queue, setQueue] = useState<Q[]>(initial);
  const [answered, setAnswered] = useState(0);
  const [firstCorrect, setFirstCorrect] = useState(0);
  const wrong = useRef<Wrong[]>([]);
  const [qid, setQid] = useState(0);
  const [res, setRes] = useState<null | { ok: boolean; right: string; given: string }>(null);
  const [orderAns, setOrderAns] = useState<number[]>([]);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const fb = useRef<HTMLDivElement>(null);

  const q = queue[0];
  const view = useMemo(() => {
    if (!q) return null;
    const opts = q.t === 'tf' ? ['Doğru', 'Yanlış'] : q.t === 'order' ? [] : q.fixed ? q.options || [] : shuffle(q.options || []);
    const bank = q.t === 'order' ? shuffle((q.w || []).map((w, i) => ({ w, i }))) : [];
    return { opts, bank };
  }, [qid]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setHdr(answered / total, `${Math.min(answered + 1, total)} / ${total}`); }, [answered, total, setHdr]);
  useEffect(() => {
    if (!q) { finish(firstCorrect / total, firstCorrect / total >= 0.7, wrong.current); return; }
    if (q.t === 'listen') { const t = setTimeout(() => speak(q.ar || ''), 250); return () => clearTimeout(t); }
  }, [qid]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (res) { nextBtn.current?.focus({ preventScroll: true }); fb.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  }, [res]);

  if (!q || !view) return null;

  function promptText(q: Q) {
    if (q.t === 'listen') return tx.ar(q.ar || '', 'text-2xl');
    if (q.t === 'fill') return isAr(q.s) ? tx.ar((q.s || '').replace('___', '___'), 'text-2xl') : esc((q.s || '').replace('___', '___'));
    if (q.t === 'order') return esc(q.tr);
    if (q.t === 'tf') return tx.auto(q.s || q.q, 'text-2xl');
    return T(q.q || '') + (q.ar ? ' ' + tx.ar(q.ar, 'text-2xl') : '') + (q.clock ? ` <span class="text-faint">(${q.clock})</span>` : '');
  }

  function answer(ok: boolean, right: string, given: string) {
    const first = !q._retry;
    if (first) {
      setAnswered((n) => n + 1);
      const qt = qTypeOf(q, act.type);
      if (qt !== 'listen') log({ qk: questionKey(q, qt), label: questionLabel(q), ok });
      if (ok) hit(q); else miss(q);
    }
    if (ok && first) setFirstCorrect((n) => n + 1);
    if (!ok && first) {
      wrong.current.push({ prompt: promptText(q), right: tx.auto(right, 'text-2xl'), given: tx.auto(given, 'text-2xl'), why: q.why ? T(q.why) : '' });
      setQueue((qs) => [...qs, { ...q, _retry: true }]);
    }
    setRes({ ok, right, given });
  }
  function pick(v: string) {
    if (res) return;
    const right = q.t === 'tf' ? (q.a ? 'Doğru' : 'Yanlış') : String(q.a);
    answer(v === right, right, v);
  }
  function checkOrder() {
    const w = q.w || [];
    const got = orderAns.map((i) => w[i]);
    const ok = [w].concat(q.alt || []).some((x) => x.join(' ') === got.join(' '));
    answer(ok, w.join(' '), got.join(' '));
  }
  function next() {
    setRes(null);
    setOrderAns([]);
    setQueue((qs) => qs.slice(1));
    setQid((n) => n + 1);
    toTop();
  }

  const right = res?.right ?? '';
  const voice = canSpeak();

  // Soru gövdesi
  let prompt: React.ReactNode = null;
  if (q.t === 'listen') {
    prompt = (
      <div className="flex flex-col items-center gap-4">
        <button type="button" data-say={q.ar} aria-label="Kelimeyi dinle" className="w-24 h-24 rounded-full bg-acc text-onacc flex items-center justify-center hover:brightness-110" dangerouslySetInnerHTML={{ __html: I.speaker(40) }} />
        <span className="text-sm text-faint">Tekrar dinlemek için dokun</span>
        {(!voice || res) && <div className="flex flex-col items-center gap-1"><Raw html={tx.ar(q.ar || '', 'text-[44px] text-ink')} />{q.tl && <span className="tl text-mute">{q.tl}</span>}</div>}
        {!voice && <span className="text-xs text-faint max-w-[360px] text-center">Arapça ses bulunamadığı için kelime yazılı gösteriliyor.</span>}
      </div>
    );
  } else {
    const s = q.s || '';
    const parts = s.split('___');
    prompt = (
      <>
        {q.q && <Raw as="p" className="m-0 text-lg sm:text-xl font-semibold text-center leading-relaxed" html={T(q.q)} />}
        {q.clock && <div className="flex justify-center"><Raw html={clockSVG(q.clock)} /></div>}
        {q.t === 'fill' ? (
          <>
            <div className="text-center px-2 py-6 rounded-2xl bg-s3 border border-line2">
              {isAr(s) ? (
                <span className="ar text-[34px] sm:text-[40px] text-ink" lang="ar" dir="rtl">
                  {parts.map((p, i) => (
                    <Fragment key={i}>
                      {i > 0 && <span className={`blank ${res ? (res.ok ? 'text-okt' : 'text-bad') : ''}`}>{res ? tx.showAr(right) : '؟'}</span>}
                      {tx.showAr(p)}
                    </Fragment>
                  ))}
                </span>
              ) : (
                <span className="text-2xl font-semibold">
                  {parts.map((p, i) => <Fragment key={i}>{i > 0 && <span className="blank">{res ? right : '?'}</span>}{p}</Fragment>)}
                </span>
              )}
            </div>
            {q.hint && <Raw as="p" className="m-0 text-center text-mute" html={T(q.hint)} />}
          </>
        ) : q.ar ? (
          <>
            <div className="flex items-center justify-center gap-4 flex-wrap"><Raw html={tx.ar(q.ar, 'text-[42px] sm:text-[48px] text-ink text-center')} /><SayBtn text={q.ar} /></div>
            {q.tl && <p className="tl m-0 text-center text-mute">{q.tl}</p>}
          </>
        ) : null}
        {q.t === 'tf' && q.s && <Raw className="text-center px-4 py-5 rounded-2xl bg-s3 border border-line2 text-xl font-semibold leading-relaxed block" as="div" html={tx.auto(q.s, 'text-[30px]')} />}
        {q.t === 'order' && <p className="m-0 text-center text-mute">Kelimeleri doğru sıraya diz: <b className="text-ink">{q.tr}</b></p>}
      </>
    );
  }

  // Cevap alanı
  let answerUI: React.ReactNode;
  if (q.t === 'order') {
    const w = q.w || [];
    const tok = (i: number, inAns: boolean) => (
      <button key={i} type="button" disabled={!!res} onClick={() => setOrderAns((a) => (inAns ? a.filter((x) => x !== i) : [...a, i]))}
        className={`opt px-4 py-2 rounded-xl bg-s3 border border-line2 text-ink ${res && inAns ? (res.ok ? 'is-right' : 'is-wrong') : ''}`}>
        <Raw html={tx.ar(w[i], 'text-[26px]')} />
      </button>
    );
    answerUI = (
      <>
        <div dir="rtl" className={`min-h-[76px] p-3 rounded-2xl border-2 border-dashed border-line3 flex flex-wrap gap-2 justify-start items-center ${res && !res.ok ? 'shake' : ''}`}>
          {orderAns.map((i) => tok(i, true))}
        </div>
        <div dir="rtl" className="flex flex-wrap gap-2 justify-center">
          {view.bank.filter((b) => !orderAns.includes(b.i)).map((b) => tok(b.i, false))}
        </div>
        {!res && <div className="flex justify-center"><button type="button" onClick={checkOrder} disabled={orderAns.length !== w.length} className="h-12 px-8 rounded-xl bg-acc text-onacc font-bold disabled:opacity-40">Kontrol et</button></div>}
      </>
    );
  } else {
    const arOpts = view.opts.some(isAr);
    const rightV = q.t === 'tf' ? (q.a ? 'Doğru' : 'Yanlış') : String(q.a);
    answerUI = (
      <div className={`grid ${view.opts.length > 2 || arOpts ? 'sm:grid-cols-2' : 'grid-cols-2'} gap-3`}>
        {view.opts.map((o) => {
          const cls = res ? (o === rightV ? 'is-right' : o === res.given && !res.ok ? 'is-wrong shake' : '') : '';
          return (
            <button key={o} type="button" disabled={!!res} onClick={() => pick(o)} data-v={o}
              className={`opt min-h-[60px] px-5 py-3 rounded-2xl bg-s3 border border-line2 text-ink font-semibold text-[16px] ${isAr(o) ? 'text-center' : 'text-left'} ${cls}`}>
              <Raw html={tx.auto(o, 'text-[28px]')} />
            </button>
          );
        })}
      </div>
    );
  }

  // Geri bildirim
  let feedback: React.ReactNode = null;
  if (res) {
    const full = q.t === 'fill' ? (q.s || '').replace('___', right) : right;
    feedback = (
      <div className={`pop rounded-2xl p-5 sm:p-6 flex flex-col gap-3 border ${res.ok ? 'bg-okbg border-okln' : 'bg-badbg border-badln'}`}>
        <div className={`flex items-center gap-2 font-bold text-lg ${res.ok ? 'text-okt' : 'text-bad'}`}>
          <Raw html={res.ok ? I.check(20) : I.x(20)} /> {res.ok ? 'Doğru!' : 'Yanlış'}
          {!res.ok && q.t !== 'order' && q.t !== 'listen' && <span className="font-semibold text-soft text-base">Doğru cevap: <Raw html={tx.auto(right, 'text-2xl')} /></span>}
        </div>
        {(q.t === 'order' || q.t === 'fill') && isAr(full) && (
          <div className="flex items-center gap-3 flex-wrap"><Raw html={tx.ar(full, 'text-[26px] text-ink')} /><SayBtn text={full} cls="w-9 h-9" size={16} /></div>
        )}
        {q.tr && q.t !== 'order' && <p className="m-0 text-soft">"{q.tr}"{q.en && <> <span className="en text-faint">· EN: {q.en}</span></>}</p>}
        {q.t === 'listen' && !res.ok && <p className="m-0 text-soft"><Raw html={tx.ar(q.ar || '', 'text-2xl')} /> = <b>{right}</b></p>}
        {q.why && <p className="m-0 text-[15px] leading-relaxed text-prose"><span className="inline-flex align-[-3px] text-acct mr-1"><Raw html={I.bulb(17)} /></span><Raw html={T(q.why)} /></p>}
        {!res.ok && !q._retry && <p className="m-0 text-xs text-faint">Bu soruyu sonda tekrar soracağız.</p>}
        <div className="flex justify-end"><button ref={nextBtn} type="button" data-next onClick={next} className="h-12 px-7 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">Devam <Raw html={I.arrow()} /></button></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 pop" key={qid}>
      {q._retry && <span className="self-center px-3 py-1 rounded-full bg-progbg border border-progln text-prog text-xs font-bold">Tekrar soru</span>}
      {prompt}
      {answerUI}
      <div ref={fb} aria-live="polite">{feedback}</div>
      {!preview && <div className="flex justify-center"><ReportButton topicId={topic.id} kind="question" label="Bu soruda hata mı var?" context={{ label: questionLabel(q), question: cleanQ(q), act: act.title }} /></div>}
    </div>
  );
}

/* ================= Telaffuz ================= */
type SR = {
  lang: string; interimResults: boolean; maxAlternatives: number; continuous: boolean;
  start: () => void; stop: () => void; abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};
const recognizer = (): (new () => SR) | null => {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};
const canRecord = () => typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
const SPEAK_TRIES = 3;

type Attempt = { heard: string; score: number; verdict: PronVerdict };

function Speak({ topic, act, finish, setHdr, toTop, preview }: SubProps) {
  const { tx, speak, toast } = useApp();
  const items = useMemo(() => {
    const src = (act.items as Word[] | null | undefined)?.length ? (act.items as Word[]) : topic.words;
    return shuffle(src.filter((w) => w.ar)).slice(0, SPEAK_MAX);
  }, [act.items, topic.words]);
  const total = items.length;
  // Konuşma tanıma yoksa (Firefox vb.) kendi sesini kaydedip kendini değerlendirme modu
  const [auto, setAuto] = useState(() => !!recognizer());
  const [idx, setIdx] = useState(0);
  const [passed, setPassed] = useState(0);
  const [tries, setTries] = useState<Attempt[]>([]);
  const [state, setState] = useState<'idle' | 'listening' | 'recording'>('idle');
  const [selfDone, setSelfDone] = useState<null | boolean>(null);
  const [mine, setMine] = useState<string | null>(null);
  const wrong = useRef<Wrong[]>([]);
  const rec = useRef<SR | null>(null);
  const media = useRef<{ mr: MediaRecorder; stream: MediaStream } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const nextBtn = useRef<HTMLButtonElement>(null);

  const w = items[idx];
  const last = tries[tries.length - 1];
  const solved = auto ? !!last && last.verdict !== 'bad' : selfDone === true;
  const over = auto ? solved || tries.length >= SPEAK_TRIES : selfDone !== null;

  useEffect(() => { setHdr(idx / Math.max(1, total), `${Math.min(idx + 1, total)} / ${total}`); }, [idx, total, setHdr]);
  useEffect(() => {
    if (!w) return;
    const t = setTimeout(() => speak(w.ar), 300);
    return () => clearTimeout(t);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (over) nextBtn.current?.focus({ preventScroll: true }); }, [over]);
  useEffect(() => () => {
    clearTimeout(timer.current);
    try { rec.current?.abort(); } catch { /* yok */ }
    media.current?.stream.getTracks().forEach((t) => t.stop());
  }, []);
  useEffect(() => () => { if (mine) URL.revokeObjectURL(mine); }, [mine]);

  if (!total) return <p className="text-center text-mute">Bu derste söylenecek kelime yok.</p>;
  if (!w) return null;

  // Kendi sesini kaydet (tanımayla birlikte ya da tek başına)
  async function startRecording(maxMs: number, quiet = false) {
    if (!canRecord()) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (chunks.length) setMine(URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })));
        media.current = null;
        setState((s) => (s === 'recording' ? 'idle' : s));
      };
      mr.start();
      media.current = { mr, stream };
      clearTimeout(timer.current);
      timer.current = setTimeout(() => stopRecording(), maxMs);
      return true;
    } catch {
      if (!quiet) toast('Mikrofona erişilemedi. Tarayıcının adres çubuğundan mikrofon iznini aç.');
      return false;
    }
  }
  function stopRecording() {
    clearTimeout(timer.current);
    if (media.current?.mr.state === 'recording') media.current.mr.stop();
  }

  function listen() {
    const Rec = recognizer();
    if (!Rec) { setAuto(false); return; }
    try { speechSynthesis.cancel(); } catch { /* yok */ }
    const r = new Rec();
    r.lang = 'ar-SA';
    r.interimResults = false;
    r.maxAlternatives = 5;
    r.continuous = false;
    r.onresult = (e) => {
      const alts = Array.from(e.results[0] || []).map((a) => a.transcript);
      const score = pronScore(w.ar, alts);
      setTries((t) => [...t, { heard: alts[0] || '', score, verdict: pronVerdict(score) }]);
    };
    r.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        toast('Mikrofon izni verilmedi. Kendi sesini kaydedip dinleyerek devam edebilirsin.');
        setAuto(false);
      } else if (e.error === 'no-speech') toast('Ses duyulmadı. Mikrofona biraz daha yakın konuşmayı dene.');
      else if (e.error === 'network') { toast('Konuşma tanıma için internet bağlantısı gerekiyor. Kendi sesini dinleyerek devam edebilirsin.'); setAuto(false); }
    };
    r.onend = () => { stopRecording(); setState('idle'); rec.current = null; };
    rec.current = r;
    setMine(null);
    setState('listening');
    try { r.start(); } catch { setState('idle'); return; }
    // Aynı anda kendi sesini de kaydet ki sonra karşılaştırabilsin
    void startRecording(6000, true);
  }

  async function recordSelf() {
    if (state === 'recording') { stopRecording(); return; }
    setMine(null);
    if (await startRecording(5000)) setState('recording');
  }

  function next() {
    const ok = solved;
    if (ok) setPassed((n) => n + 1);
    else wrong.current.push({ prompt: esc(w.tr), right: tx.ar(w.ar, 'text-2xl'), given: last?.heard ? tx.ar(last.heard, 'text-2xl') : '', why: w.tl ? 'Okunuşu: ' + esc(w.tl) : '' });
    const done = passed + (ok ? 1 : 0);
    if (idx + 1 >= total) { finish(done / total, done / total >= 0.7, wrong.current); return; }
    setIdx(idx + 1);
    setTries([]);
    setSelfDone(null);
    setMine(null);
    toTop();
  }

  const mic = state === 'listening' || state === 'recording';
  const vcls = last ? (last.verdict === 'ok' ? 'bg-okbg border-okln text-okt' : last.verdict === 'close' ? 'bg-progbg border-progln text-prog' : 'bg-badbg border-badln text-bad') : '';
  return (
    <div className="flex flex-col items-center gap-7 pop" key={idx}>
      <p className="m-0 text-mute text-center max-w-[560px]">
        {auto ? 'Önce kelimeyi dinle, sonra mikrofona dokunup sen söyle. Tarayıcı söylediğini kontrol eder.' : 'Önce kelimeyi dinle, sonra kendi sesini kaydedip karşılaştır ve kendini değerlendir.'}
      </p>
      <div className="w-full max-w-[520px] rounded-3xl bg-s4 border border-line3 p-8 flex flex-col items-center gap-3 text-center">
        <Raw html={tx.ar(w.ar, 'text-[56px] leading-tight text-ink')} />
        {w.tl && <span className="tl text-mute text-lg">{w.tl}</span>}
        <span className="text-[17px] font-semibold text-soft">{w.tr}</span>
        <div className="flex items-center gap-3 mt-1"><SayBtn text={w.ar} cls="w-12 h-12" /><span className="text-sm text-faint">Doğru telaffuzu dinle</span></div>
      </div>

      {!over && (
        <div className="flex flex-col items-center gap-3">
          <button type="button" onClick={auto ? listen : recordSelf} disabled={auto && mic} aria-label={auto ? 'Söyle' : state === 'recording' ? 'Kaydı durdur' : 'Kaydet'}
            className={`w-24 h-24 rounded-full flex items-center justify-center ${mic ? 'bg-bad text-onacc animate-pulse' : 'bg-acc text-onacc hover:brightness-110'}`}>
            <Raw html={I.mic(40)} />
          </button>
          <span className="text-sm text-faint" aria-live="polite">
            {state === 'listening' ? 'Dinliyorum, şimdi söyle' : state === 'recording' ? 'Kaydediliyor, bitince dokun' : auto ? (tries.length ? `Tekrar dene (${tries.length} / ${SPEAK_TRIES})` : 'Söylemek için dokun') : 'Kaydetmek için dokun'}
          </span>
        </div>
      )}

      {last && (
        <div className={`pop w-full max-w-[520px] rounded-2xl p-5 border flex flex-col gap-2 ${vcls}`} aria-live="polite">
          <p className="m-0 font-bold text-lg">{last.verdict === 'ok' ? 'Harika, doğru söyledin!' : last.verdict === 'close' ? 'Çok yakın, kabul!' : 'Tam anlaşılmadı'}</p>
          <p className="m-0 text-soft text-[15px]">Duyulan: {last.heard ? <Raw html={tx.ar(last.heard, 'text-2xl')} /> : <i>boş</i>}</p>
          {last.verdict === 'bad' && tries.length < SPEAK_TRIES && <p className="m-0 text-sm text-soft">Doğru telaffuzu bir kez daha dinle, sonra yavaşça ve net söyle.</p>}
        </div>
      )}

      {mine && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => { new Audio(mine).play().catch(() => null); }} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh inline-flex items-center gap-2"><Raw html={I.mic(17)} /> Kendi sesini dinle</button>
          <button type="button" data-say={w.ar} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh inline-flex items-center gap-2"><Raw html={I.speaker(17)} /> Doğrusunu dinle</button>
        </div>
      )}

      {!auto && selfDone === null && (mine || !canRecord()) && (
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => setSelfDone(false)} className="h-12 px-6 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Biraz daha çalışmalıyım</button>
          <button type="button" onClick={() => setSelfDone(true)} className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2"><Raw html={I.check(17)} /> Doğru söyledim</button>
        </div>
      )}

      {(over || (auto && tries.length > 0)) && (
        <div className="flex flex-wrap justify-center gap-3">
          {!over && <button type="button" onClick={next} className="h-12 px-6 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Bu kelimeyi geç</button>}
          {over && <button ref={nextBtn} type="button" data-next onClick={next} className="h-12 px-7 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">{idx + 1 >= total ? 'Bitir' : 'Sonraki kelime'} <Raw html={I.arrow()} /></button>}
        </div>
      )}
      {!preview && <ReportButton topicId={topic.id} kind="word" label="Bu kelimede hata mı var?" context={{ label: wordLabel(w), word: cleanW(w), act: act.title }} />}
      {auto && !over && <button type="button" onClick={() => setAuto(false)} className="text-xs text-faint underline underline-offset-4 hover:text-soft">Konuşma tanıma çalışmıyor mu? Kendin değerlendir</button>}
    </div>
  );
}

/* ================= Sınırsız saat pratiği ================= */
function ClockPractice({ act, finish, setHdr, toTop, endlessRef, close, log, miss, hit }: SubProps) {
  const { tx, speak } = useApp();
  const [stats, setStats] = useState<Endless & { streak: number }>({ answered: 0, correct: 0, best: 0, streak: 0 });
  const wrong = useRef<Wrong[]>([]);
  const make = (avoid?: string | null) => {
    const t = randTime(avoid);
    const mode = act.mode === 'mix' ? (Math.random() < 0.5 ? 'c2t' : 't2c') : act.mode || 'c2t';
    return { t, mode, opts: shuffle([t, ...distractors(t)]) };
  };
  const [cur, setCur] = useState(() => make());
  const [picked, setPicked] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const fb = useRef<HTMLDivElement>(null);
  const { t, mode, opts } = cur;
  const full = 'السَّاعَةُ ' + timeAr(t.h, t.m);

  useEffect(() => { endlessRef.current = stats; }, [stats, endlessRef]);
  useEffect(() => {
    setHdr(stats.answered ? stats.correct / stats.answered : 0, `Soru ${stats.answered + (picked ? 0 : 1)} · sınırsız`);
  }, [stats, picked, setHdr]);
  useEffect(() => {
    if (mode === 't2c') { const x = setTimeout(() => speak(full), 250); return () => clearTimeout(x); }
  }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (picked) { nextBtn.current?.focus({ preventScroll: true }); fb.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  }, [picked]);

  const goNext = () => { clearTimeout(timer.current); setPicked(null); setCur(make(hmKey(t))); toTop(); };

  function choose(o: HM) {
    if (picked) return;
    const ok = hmKey(o) === hmKey(t);
    log({ qk: 'saat-' + t.m, label: 'Saat :' + String(t.m).padStart(2, '0') + ' (' + MIN_LABEL[t.m] + ')', ok });
    if (ok) hit(clockQ(t)); else miss(clockQ(t));
    setPicked(hmKey(o));
    setStats((s) => {
      const streak = ok ? s.streak + 1 : 0;
      return { answered: s.answered + 1, correct: s.correct + (ok ? 1 : 0), streak, best: Math.max(s.best, streak) };
    });
    if (!ok) {
      wrong.current.push({
        prompt: `<span class="text-faint">${fmt(t.h, t.m)}</span> ${esc(timeTr(t.h, t.m))}`,
        given: tx.ar(timeAr(o.h, o.m), 'text-2xl') + ` <span class="text-faint">(${fmt(o.h, o.m)})</span>`,
        right: tx.ar(timeAr(t.h, t.m), 'text-2xl'),
        why: tx.text(timeWhy(t.h, t.m))
      });
      if (wrong.current.length > 12) wrong.current.shift();
    } else {
      // Doğruysa kısa bir süre sonra kendiliğinden sıradakine geç
      timer.current = setTimeout(goNext, 1600);
    }
  }
  function end() {
    clearTimeout(timer.current);
    if (!stats.answered) { endlessRef.current = null; return close(); }
    const e = { answered: stats.answered, correct: stats.correct, best: stats.best };
    finish(e.correct / e.answered, endlessDone(e), wrong.current, e);
  }

  const ok = picked === hmKey(t);
  const acc = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;
  const chips: [string, string | number, string][] = [
    ['Doğru', stats.correct, 'text-okt'], ['Yanlış', stats.answered - stats.correct, 'text-bad'], ['Seri', stats.streak, 'text-acct'],
    ['En iyi seri', stats.best, 'text-soft'], ['Başarı', stats.answered ? '%' + acc : '-', 'text-ink']
  ];

  return (
    <div className="flex flex-col gap-6 pop" key={hmKey(t) + mode + stats.answered}>
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        {chips.map(([l, v, c]) => <span key={l} className="px-3 py-1.5 rounded-full bg-s1 border border-line"><span className="text-faint">{l}</span> <b className={c}>{v}</b></span>)}
      </div>
      {mode === 'c2t' ? (
        <>
          <p className="m-0 text-lg sm:text-xl font-semibold text-center">Saat kaç? Kadrandaki saatin Arapçasını seç.</p>
          <div className="flex justify-center"><Raw html={clockSVG(fmt(t.h, t.m), 210)} /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            {opts.map((o, i) => (
              <button key={hmKey(o)} type="button" disabled={!!picked} onClick={() => choose(o)} data-v={hmKey(o)}
                className={`opt relative min-h-[64px] px-5 py-3 rounded-2xl bg-s3 border border-line2 text-ink text-center ${picked ? (hmKey(o) === hmKey(t) ? 'is-right' : hmKey(o) === picked ? 'is-wrong shake' : '') : ''}`}>
                <span className="absolute left-3 top-2 text-[11px] font-bold text-faint">{i + 1}</span>
                <Raw html={tx.ar(timeAr(o.h, o.m), 'text-[26px]')} />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="m-0 text-lg sm:text-xl font-semibold text-center">Bu saati gösteren kadranı seç.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap px-2 py-5 rounded-2xl bg-s3 border border-line2"><Raw html={tx.ar(full, 'text-[32px] sm:text-[38px] text-ink text-center')} /><SayBtn text={full} /></div>
          <div className="grid grid-cols-2 gap-3">
            {opts.map((o, i) => (
              <button key={hmKey(o)} type="button" disabled={!!picked} onClick={() => choose(o)} data-v={hmKey(o)} aria-label={`Seçenek ${i + 1}`}
                className={`opt relative p-3 rounded-2xl bg-s3 border border-line2 flex items-center justify-center ${picked ? (hmKey(o) === hmKey(t) ? 'is-right' : hmKey(o) === picked ? 'is-wrong shake' : '') : ''}`}>
                <span className="absolute left-3 top-2 text-[11px] font-bold text-faint">{i + 1}</span>
                <Raw html={clockSVG(fmt(o.h, o.m), 150).replace(/role="img" aria-label="[^"]*"/, 'aria-hidden="true"')} />
              </button>
            ))}
          </div>
        </>
      )}
      <div ref={fb} aria-live="polite">
        {picked && (
          <div className={`pop rounded-2xl p-5 sm:p-6 flex flex-col gap-3 border ${ok ? 'bg-okbg border-okln' : 'bg-badbg border-badln'}`}>
            <div className={`flex items-center gap-2 font-bold text-lg ${ok ? 'text-okt' : 'text-bad'}`}>
              <Raw html={ok ? I.check(20) : I.x(20)} /> {ok ? 'Doğru!' : 'Yanlış'}
              {ok && stats.streak >= 3 && <span className="text-acct text-base">{stats.streak} doğru üst üste</span>}
            </div>
            <div className="flex items-center gap-3 flex-wrap"><Raw html={tx.ar(full, 'text-[26px] text-ink')} /><SayBtn text={full} cls="w-9 h-9" size={16} /></div>
            <p className="m-0 text-soft"><b className="text-ink">{fmt(t.h, t.m)}</b> {timeTr(t.h, t.m)}</p>
            <p className="m-0 text-[15px] leading-relaxed text-prose"><span className="inline-flex align-[-3px] text-acct mr-1"><Raw html={I.bulb(17)} /></span><Raw html={tx.text(timeWhy(t.h, t.m))} /></p>
            <div className="flex justify-end"><button ref={nextBtn} type="button" data-next onClick={goNext} className="h-12 px-7 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">Sonraki saat <Raw html={I.arrow()} /></button></div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line">
        <span className="text-xs text-faint">İpucu: 1-4 tuşlarıyla seç, Enter ile devam et.</span>
        <button type="button" onClick={end} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Bitir ve sonucu gör</button>
      </div>
    </div>
  );
}

/* ================= Sonuç ================= */
function Result({ score, done, wrong, endless, act, list, onAgain, onBack, onNext }: {
  score: number; done: boolean; wrong: Wrong[]; endless?: Endless; act: ActView; list: ActView[];
  onAgain: () => void; onBack: () => void; onNext: (a: ActView) => void;
}) {
  const pct = Math.round(score * 100);
  const idx = list.findIndex((a) => a.id === act.id);
  const next = list[idx + 1];
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { nextRef.current?.focus({ preventScroll: true }); }, []);
  const msg = pct >= 90 ? ['Harika!', 'Bu etkinliği çok iyi kavradın.'] : pct >= 70 ? ['Tamamlandı', 'İyi iş. Yanlışlarını aşağıda gözden geçir.'] : ['Biraz daha pratik', 'Konu anlatımına göz atıp tekrar dene; %70 ve üstü tamamlanmış sayılır.'];
  return (
    <div className="flex flex-col items-center gap-7 text-center pop">
      <Raw html={ring(pct, 150, 12)} />
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-3xl font-bold">{endless && !done && pct >= 70 ? 'İyi gidiyorsun' : msg[0]}</h2>
        <p className="m-0 text-mute max-w-[460px]">
          {endless ? `${endless.answered} saat cevapladın · ${endless.correct} doğru · en uzun seri ${endless.best}.${done ? '' : ' Tamamlanmış sayılması için en az 10 soru ve %70 başarı gerekir.'}` : msg[1]}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onAgain} className="h-12 px-6 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh inline-flex items-center gap-2"><Raw html={I.refresh(17)} /> Tekrar dene</button>
        <button type="button" onClick={onBack} className="h-12 px-6 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Etkinliklere dön</button>
        {next && <button ref={nextRef} type="button" data-next onClick={() => onNext(next)} className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">Sıradaki: {next.title} <Raw html={I.arrow()} /></button>}
      </div>
      {wrong.length > 0 && (
        <section className="w-full flex flex-col gap-3">
          <h3 className="m-0 text-lg font-bold">Gözden geçir ({wrong.length})</h3>
          {wrong.map((w, i) => (
            <div key={i} className="rounded-2xl bg-s3 border border-line2 p-5 flex flex-col gap-2">
              <Raw as="div" className="text-ink font-semibold leading-relaxed" html={w.prompt} />
              {w.given && <div className="text-sm text-bad">Senin cevabın: <Raw html={w.given} /></div>}
              <div className="text-sm text-okt">Doğru: <Raw html={w.right} /></div>
              {w.why && <Raw as="div" className="text-sm text-mute leading-relaxed" html={w.why} />}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
