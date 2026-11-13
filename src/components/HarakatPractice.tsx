'use client';

/* Harekeleme (hareke koy): harekesiz kelimenin harflerine doğru harekeleri koy.
   Harf seçilir, alttaki düğmelerden hareke (ve gerekirse şedde) eklenir; seçim sıradaki harfe geçer.
   Derslerde (etkinlik penceresinde) ve kelime listelerinde ortak kullanılır. Yanlış kelime sonda tekrar sorulur. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { applyMark, build, grade, SHADDA, slots, VOWELS } from '@/lib/harakat';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

export type HItem = { id: string | number; ar: string; tl?: string; tr: string };
export type HResult = { right: number; total: number; wrong: (HItem & { given: string })[] };
type Step = HItem & { retry: boolean };

export default function HarakatPractice({ items, onAnswer, onProgress, onFinish }: {
  items: HItem[];
  onAnswer?: (item: HItem, ok: boolean) => void;
  onProgress?: (done: number, total: number) => void;
  onFinish: (r: HResult) => void;
}) {
  const { speak } = useApp();
  const [queue, setQueue] = useState<Step[]>(() => items.map((x) => ({ ...x, retry: false })));
  const [n, setN] = useState(0);
  const cur = queue[0];
  const ss = useMemo(() => (cur ? slots(cur.ar) : []), [cur]);
  const asked = useMemo(() => ss.map((s, i) => (s.asked ? i : -1)).filter((i) => i >= 0), [ss]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [sel, setSel] = useState(0);
  const [res, setRes] = useState<ReturnType<typeof grade> | null>(null);
  const first = useRef({ right: 0, done: 0 });
  const wrong = useRef<HResult['wrong']>([]);
  const next = useRef<HTMLButtonElement>(null);
  const total = items.length;

  useEffect(() => { setChosen(ss.map(() => '')); setSel(asked[0] ?? 0); }, [ss, asked]);
  useEffect(() => { onProgress?.(first.current.done, total); }, [n]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (res) next.current?.focus(); }, [res]);
  useEffect(() => { if (!queue.length) onFinish({ right: first.current.right, total, wrong: wrong.current }); }, [queue.length]); // eslint-disable-line react-hooks/exhaustive-deps
  // Ok tuşları harf seçer (sağdan sola yazı: sol ok sonraki harf)
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (res || (e.target as HTMLElement).matches?.('input,textarea')) return;
      const k = asked.indexOf(sel);
      if (e.key === 'ArrowLeft' && k < asked.length - 1) { e.preventDefault(); setSel(asked[k + 1]); }
      if (e.key === 'ArrowRight' && k > 0) { e.preventDefault(); setSel(asked[k - 1]); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [asked, sel, res]);

  if (!cur) return null;

  function put(mark: string) {
    if (res) return;
    const c = [...chosen];
    c[sel] = applyMark(c[sel] || '', mark);
    setChosen(c);
    // Hareke konunca sıradaki harfe geç (şedde ekleyince aynı harfte kal)
    if (mark !== SHADDA) {
      const k = asked.indexOf(sel);
      const later = asked.slice(k + 1).find((i) => !c[i]);
      if (later != null) setSel(later); else if (k < asked.length - 1) setSel(asked[k + 1]);
    }
  }
  function check() {
    if (res || !cur) return;
    const g = grade(ss, chosen);
    if (!cur.retry) {
      first.current.done++;
      if (g.ok) first.current.right++; else wrong.current.push({ ...cur, given: build(ss, chosen) });
      onAnswer?.(cur, g.ok);
    }
    if (!g.ok && !cur.retry) setQueue((q) => [...q, { ...q[0], retry: true }]);
    setRes(g);
  }
  function go() { setRes(null); setQueue((q) => q.slice(1)); setN((x) => x + 1); }

  const filled = asked.every((i) => chosen[i]);
  return (
    <div className="flex flex-col gap-6 pop" key={n}>
      {cur.retry && <span className="self-center px-3 py-1 rounded-full bg-progbg border border-progln text-prog text-xs font-bold">Tekrar soru</span>}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="m-0 text-mute">Kelimenin harflerine doğru harekeleri koy. Önce harfe, sonra harekeye dokun.</p>
        <span className="flex items-center gap-2 text-soft"><b className="text-ink text-lg">{cur.tr}</b>
          <button type="button" data-say={cur.ar} data-replay aria-label="Kelimeyi dinle" title="Dinle (Boşluk)" className="w-9 h-9 rounded-full border border-line3 bg-chip text-acct inline-flex items-center justify-center"><Raw html={I.speaker(16)} /></button>
        </span>
      </div>

      {/* Kelimenin şu anki hâli (harfler bitişik) */}
      <div className="text-center py-4 rounded-2xl bg-s3 border border-line2">
        <span className="ar text-[56px] sm:text-[64px] leading-[1.6] text-ink" lang="ar" dir="rtl">{build(ss, chosen)}</span>
      </div>

      {/* Harf harf: seçili harfe hareke konur */}
      <div dir="rtl" className="flex flex-wrap justify-center gap-2" role="group" aria-label="Harfler">
        {ss.map((s, i) => {
          const bad = res && !res.per[i];
          const on = sel === i && !res;
          return (
            <button key={i} type="button" disabled={!s.asked || !!res} onClick={() => setSel(i)} aria-pressed={on}
              aria-label={`${i + 1}. harf ${s.letter}${s.asked ? '' : ' (verili)'}`}
              className={`ar min-w-[56px] h-[72px] px-2 rounded-xl border text-[34px] leading-none flex items-center justify-center ${!s.asked ? 'bg-s1 border-line text-faint' : bad ? 'bg-badbg border-badln text-bad' : res ? 'bg-okbg border-okln text-okt' : on ? 'bg-chip border-acc text-acct ring-2 ring-acc' : 'bg-s2 border-line3 text-ink hover:border-lineh'}`} lang="ar">
              {s.letter + (s.asked ? (chosen[i] || '') : s.marks) + s.keep}
            </button>
          );
        })}
      </div>

      {!res && (
        <>
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Harekeler">
            {VOWELS.map(([m, l], k) => (
              <button key={m} type="button" onClick={() => put(m)} className="opt w-[84px] h-[72px] rounded-xl bg-s3 border border-line2 text-ink flex flex-col items-center justify-center gap-0.5 hover:border-lineh" data-v={m} title={`${k + 1}`}>
                <span className="ar text-[30px] leading-none" lang="ar">{'ب' + m}</span><span className="text-[11px] text-mute">{l}</span>
              </button>
            ))}
            <button type="button" onClick={() => put(SHADDA)} aria-pressed={!!chosen[sel]?.includes(SHADDA)} className={`opt w-[84px] h-[72px] rounded-xl border flex flex-col items-center justify-center gap-0.5 ${chosen[sel]?.includes(SHADDA) ? 'bg-chip border-acc text-acct' : 'bg-s3 border-line2 text-ink hover:border-lineh'}`} data-v={SHADDA} title="8">
              <span className="ar text-[30px] leading-none" lang="ar">{'ب' + SHADDA}</span><span className="text-[11px] text-mute">şedde</span>
            </button>
          </div>
          <div className="flex justify-center gap-2">
            <button type="button" onClick={() => setChosen(ss.map(() => ''))} className="h-11 px-4 rounded-xl text-soft font-semibold hover:text-ink">Temizle</button>
            <button type="button" onClick={check} disabled={!filled} className="h-11 px-6 rounded-xl bg-acc text-onacc font-bold disabled:opacity-40">Kontrol et</button>
          </div>
        </>
      )}

      <div aria-live="polite">
        {res && (
          <div className={`pop rounded-2xl p-5 flex flex-col gap-3 border ${res.ok ? 'bg-okbg border-okln' : 'bg-badbg border-badln'}`}>
            <span className={`flex items-center gap-2 font-bold text-lg ${res.ok ? 'text-okt' : 'text-bad'}`}><Raw html={res.ok ? I.check(20) : I.x(20)} /> {res.ok ? 'Doğru!' : `${res.right} / ${res.total} harf doğru`}</span>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="ar text-[40px] text-ink" lang="ar" dir="rtl">{cur.ar}</span>
              <span className="flex flex-col">{cur.tl && <span className="tl text-mute">{cur.tl}</span>}<span className="text-soft font-semibold">{cur.tr}</span></span>
            </div>
            {!res.ok && !cur.retry && <span className="text-xs text-faint">Bu kelimeyi sonda tekrar soracağız. Kırmızı harfler yanlış.</span>}
            <div className="flex justify-end"><button ref={next} type="button" data-next onClick={go} className="h-12 px-7 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">Devam <Raw html={I.arrow()} /></button></div>
          </div>
        )}
      </div>
    </div>
  );
}
