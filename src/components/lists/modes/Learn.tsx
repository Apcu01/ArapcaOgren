'use client';

/* Öğren: 7 kelimelik turlar. Kelime önce çoktan seçmeli sorulur (tanıdık olur), sonra yazılı sorulur (öğrenilir).
   Yanlış cevaplanan kelime turun sonunda bir kez daha gelir. */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Ar } from '../../AppProvider';
import { I, Raw } from '../../icons';
import { AnyQuestion } from '../parts';
import type { ModeProps } from '../StudyShell';
import { mcQ, nextRound, pickDir, type LearnState, type ListItem, type McQ, type WriteQ } from '@/lib/study';

type Step = { item: ListItem; retry: boolean };

export default function Learn({ list, items, opts, study }: ModeProps) {
  const [st, setSt] = useState<LearnState>({});
  const [roundNo, setRoundNo] = useState(1);
  const [queue, setQueue] = useState<Step[]>(() => nextRound(items, {}).map((item) => ({ item, retry: false })));
  const [pos, setPos] = useState(0);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [phase, setPhase] = useState<'q' | 'summary'>('q');
  const [qn, setQn] = useState(0);

  const step = queue[pos];
  const stage = step ? st[step.item.id] ?? 0 : 0;
  // Soru, kelime ya da aşama değişince yeniden üretilir (aynı soruda seçenekler karışmasın)
  const q: McQ | WriteQ | null = useMemo(() => {
    if (!step) return null;
    if (stage >= 1 && opts.write) return { kind: 'write', item: step.item, dir: pickDir(opts.dir) };
    return mcQ(step.item, items, opts.dir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qn]);

  const counts = { neu: 0, fam: 0, mas: 0 };
  for (const it of items) { const s = st[it.id] ?? 0; if (s === 2) counts.mas++; else if (s === 1) counts.fam++; else counts.neu++; }
  const allDone = counts.mas === items.length;

  const onAnswer = (ok: boolean) => {
    if (!step) return;
    study.answer(step.item.id, ok);
    const id = step.item.id;
    setResults((r) => ({ ...r, [id]: r[id] === false ? false : ok }));
    if (ok) setSt((s) => ({ ...s, [id]: Math.min(2, (s[id] ?? 0) + 1) as 0 | 1 | 2 }));
    else if (!step.retry) setQueue((qq) => [...qq, { item: step.item, retry: true }]);
  };
  const onNext = () => {
    if (pos + 1 < queue.length) { setPos(pos + 1); setQn((n) => n + 1); }
    else setPhase('summary');
  };
  const nextR = () => {
    const r = nextRound(items, st);
    setQueue(r.map((item) => ({ item, retry: false })));
    setPos(0); setResults({}); setPhase('q'); setRoundNo((n) => n + 1); setQn((n) => n + 1);
  };
  const restart = () => {
    setSt({});
    setQueue(nextRound(items, {}).map((item) => ({ item, retry: false })));
    setPos(0); setResults({}); setPhase('q'); setRoundNo(1); setQn((n) => n + 1);
  };

  const bar = (
    <div className="flex flex-col gap-2">
      <div className="h-2.5 rounded-full bg-track overflow-hidden flex">
        <div className="h-full bg-ok transition-all" style={{ width: (counts.mas / items.length) * 100 + '%' }} />
        <div className="h-full bg-prog transition-all" style={{ width: (counts.fam / items.length) * 100 + '%' }} />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-mute">
        <span><b className="text-okt">{counts.mas}</b> öğrenildi</span>
        <span><b className="text-prog">{counts.fam}</b> tanıdık</span>
        <span><b className="text-soft">{counts.neu}</b> yeni</span>
      </div>
    </div>
  );

  if (phase === 'summary') {
    const ids = [...new Set(queue.map((s) => s.item.id))];
    return (
      <div className="pop flex flex-col gap-6 max-w-[760px] w-full mx-auto">
        {bar}
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-[26px] font-bold">{allDone ? 'Tebrikler, hepsini öğrendin!' : `${roundNo}. tur bitti`}</h2>
          <p className="m-0 text-mute">{allDone ? `${list.title} listesindeki ${items.length} kelimenin hepsini çalıştın.` : `${items.length - counts.mas} kelime kaldı. Bir sonraki turda kaldığın yerden devam et.`}</p>
        </div>
        <div className="flex flex-col gap-2">
          {ids.map((id) => {
            const it = items.find((x) => x.id === id)!;
            const ok = results[id];
            return (
              <div key={id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-s4 border border-line3">
                <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center ${ok ? 'bg-okbg text-okt' : 'bg-badbg text-bad'}`}><Raw html={ok ? I.check(14) : I.x(14)} /></span>
                <span className="flex-1 font-semibold">{it.tr}</span>
                <Ar t={it.ar} className="text-[20px]" />
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 flex-wrap">
          {allDone ? (
            <>
              <button type="button" onClick={restart} className="h-12 px-5 rounded-xl border border-line3 bg-s2 text-ink font-semibold hover:border-lineh">Baştan başla</button>
              <Link href={`/listelerim/${list.id}/test`} className="h-12 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Test yap</Link>
            </>
          ) : <button type="button" onClick={nextR} className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold">Devam et</button>}
        </div>
      </div>
    );
  }

  if (!q || !step) return null;
  return (
    <div className="flex flex-col gap-6 max-w-[760px] w-full mx-auto">
      {bar}
      <div className="flex items-center gap-2 text-xs font-bold tracking-[.1em] uppercase text-lab">
        <span>{roundNo}. tur · {pos + 1} / {queue.length}</span>
        {step.retry && <span className="px-2 py-0.5 rounded-full bg-s2 border border-prog text-prog normal-case tracking-normal font-semibold">Tekrar deneyelim</span>}
        {stage >= 1 && opts.write && !step.retry && <span className="px-2 py-0.5 rounded-full bg-s2 border border-line3 text-soft normal-case tracking-normal font-semibold">Bunu tanıyorsun, şimdi yaz</span>}
      </div>
      <div className="p-5 sm:p-7 rounded-[22px] bg-s4 border border-line3">
        <AnyQuestion key={qn} q={q} onAnswer={onAnswer} onNext={onNext} />
      </div>
    </div>
  );
}
