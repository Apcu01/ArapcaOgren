'use client';

/* Eşleştir: Arapça ve Türkçe kutucukları en kısa sürede eşleştir. Yanlış eşleştirme 1 saniye ceza */
import { useEffect, useRef, useState } from 'react';
import { Ar } from '../../AppProvider';
import { GameOver } from '../parts';
import type { ModeProps } from '../StudyShell';
import { fmtTime, type ListItem } from '@/lib/study';
import { shuffle } from '@/lib/text';

type Tile = { key: string; item: ListItem; side: 'ar' | 'tr' };
const PAIRS = 6;
const PENALTY = 1000;

export default function Match({ list, items, study }: ModeProps) {
  const [tiles, setTiles] = useState<Tile[] | null>(null);
  const [gone, setGone] = useState<Set<string>>(new Set());
  const [sel, setSel] = useState<Tile | null>(null);
  const [bad, setBad] = useState<string[]>([]);
  const [penalty, setPenalty] = useState(0);
  const [now, setNow] = useState(0);
  const [end, setEnd] = useState<{ ms: number; record: boolean } | null>(null);
  const t0 = useRef(0);

  const start = () => {
    const pick = shuffle(items).slice(0, PAIRS);
    setTiles(shuffle(pick.flatMap((item) => [{ key: item.id + 'a', item, side: 'ar' as const }, { key: item.id + 't', item, side: 'tr' as const }])));
    setGone(new Set()); setSel(null); setBad([]); setPenalty(0); setEnd(null);
    t0.current = performance.now(); setNow(0);
  };

  useEffect(() => {
    if (!tiles || end) return;
    const t = setInterval(() => setNow(performance.now() - t0.current), 100);
    return () => clearInterval(t);
  }, [tiles, end]);

  const tap = (t: Tile) => {
    if (gone.has(t.key) || end) return;
    if (!sel) { setSel(t); return; }
    if (sel.key === t.key) { setSel(null); return; }
    if (sel.item.id === t.item.id) {
      const g = new Set(gone).add(sel.key).add(t.key);
      setGone(g); setSel(null);
      study.gameAnswer(true);
      if (tiles && g.size === tiles.length) {
        const ms = performance.now() - t0.current + penalty;
        setNow(ms - penalty);
        setEnd({ ms, record: false });
        study.best('match', ms).then((r) => r && setEnd({ ms, record: r.record }));
      }
    } else {
      setBad([sel.key, t.key]); setSel(null); setPenalty((p) => p + PENALTY);
      study.gameAnswer(false);
      setTimeout(() => setBad([]), 450);
    }
  };

  if (end) {
    return (
      <GameOver title="Süren" value={fmtTime(end.ms)} record={end.record} best={list.best.match != null ? fmtTime(list.best.match) : undefined} onAgain={start}>
        {penalty > 0 && <span className="text-sm text-mute">Yanlış eşleştirme cezası dahil: +{penalty / 1000} sn</span>}
      </GameOver>
    );
  }
  if (!tiles) {
    return (
      <div className="pop flex flex-col items-center text-center gap-4 py-12">
        <h1 className="m-0 text-[30px] font-bold">Eşleştir</h1>
        <p className="m-0 text-mute max-w-[440px] leading-relaxed">Arapça kelimeyi anlamıyla eşleştir. Kutucuklar eşleşince kaybolur. Hepsini en kısa sürede temizle; yanlış eşleştirme 1 saniye ceza ekler.</p>
        {list.best.match != null && <span className="text-sm text-soft">En iyi süren: {fmtTime(list.best.match)}</span>}
        <button type="button" onClick={start} className="mt-2 h-12 px-7 rounded-xl bg-acc text-onacc font-bold">Oyunu başlat</button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[28px] font-bold tabular-nums" aria-live="off">{fmtTime(now + penalty)}</span>
        {penalty > 0 && <span className="text-sm text-bad font-semibold">+{penalty / 1000} sn ceza</span>}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {tiles.map((t) => {
          const off = gone.has(t.key);
          const cls = off ? 'opacity-0 scale-90 pointer-events-none' : bad.includes(t.key) ? 'shake bg-badbg border-badln' : sel?.key === t.key ? 'bg-chip border-acc' : 'bg-s4 border-line3 hover:border-lineh';
          return (
            <button key={t.key} type="button" onClick={() => tap(t)} disabled={off} aria-hidden={off}
              className={`min-h-[96px] sm:min-h-[120px] p-2.5 rounded-2xl border-2 text-ink flex items-center justify-center text-center transition-all duration-200 ${cls}`}>
              {t.side === 'ar' ? <Ar t={t.item.ar} className="text-[22px] sm:text-[26px] leading-[1.4]" /> : <span className="text-[14px] sm:text-[16px] font-semibold leading-snug break-words">{t.item.tr}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
