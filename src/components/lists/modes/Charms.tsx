'use client';

/* Tılsım: yan yana iki tılsımın yerini değiştirip aynı türden 3 ya da daha fazlasını diz.
   Üzerinde +sayı olan soru tılsımları dizilince soru gelir; doğru cevap o kadar hamle kazandırır. Hamleler bitince oyun biter */
import { useMemo, useRef, useState } from 'react';
import { I, Raw } from '../../icons';
import { AnyQuestion, GameOver } from '../parts';
import type { ModeProps } from '../StudyShell';
import { mcQ, pickDir, type McQ, type WriteQ } from '@/lib/study';

const N = 7;
const START_MOVES = 15;
// Renk körlüğüne karşı her türün şekli de farklı
const KINDS = [
  { c: '#e0a458', g: 'elmas', d: 'M12 2 22 12 12 22 2 12z' },
  { c: '#7fb77e', g: 'daire', d: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z' },
  { c: '#6aa5d8', g: 'üçgen', d: 'M12 3 22 20H2z' },
  { c: '#c07ad6', g: 'kare', d: 'M4 4h16v16H4z' },
  { c: '#e07a6a', g: 'yıldız', d: 'm12 2 3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6z' }
];
type Cell = { id: number; k: number; bonus?: number };
type Board = Cell[];
let cid = 0;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function rand(board: Board | null): Cell {
  const qs = board ? board.filter((x) => x?.bonus).length : 0;
  const bonus = qs < 2 && Math.random() < 0.08 ? 2 + Math.floor(Math.random() * 3) : undefined;
  return { id: ++cid, k: Math.floor(Math.random() * KINDS.length), bonus };
}
/** Başlangıçta hazır üçlü olmayan tahta */
function fresh(): Board {
  const b: Board = [];
  for (let i = 0; i < N * N; i++) {
    let c: Cell;
    do { c = rand(b); } while (
      (i % N >= 2 && b[i - 1].k === c.k && b[i - 2].k === c.k) ||
      (i >= 2 * N && b[i - N].k === c.k && b[i - 2 * N].k === c.k)
    );
    b.push(c);
  }
  return b;
}
function matches(b: Board) {
  const hit = new Set<number>();
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const i = r * N + c, k = b[i].k;
    if (c <= N - 3 && b[i + 1].k === k && b[i + 2].k === k) { let j = c; while (j < N && b[r * N + j].k === k) hit.add(r * N + j++); }
    if (r <= N - 3 && b[i + N].k === k && b[i + 2 * N].k === k) { let j = r; while (j < N && b[j * N + c].k === k) hit.add(j++ * N + c); }
  }
  return hit;
}
const swapped = (b: Board, a: number, z: number) => { const n = b.slice(); [n[a], n[z]] = [n[z], n[a]]; return n; };
const adjacent = (a: number, z: number) => (Math.abs(a - z) === 1 && Math.floor(a / N) === Math.floor(z / N)) || Math.abs(a - z) === N;
function hasMove(b: Board) {
  for (let i = 0; i < N * N; i++) for (const z of [i + 1, i + N]) if (z < N * N && adjacent(i, z) && matches(swapped(b, i, z)).size) return true;
  return false;
}
/** Silinen yerlere üstteki tılsımlar düşer, boşluk yenileriyle dolar */
function collapse(b: Board, gone: Set<number>): Board {
  const out = b.slice();
  for (let c = 0; c < N; c++) {
    const col = [] as Cell[];
    for (let r = N - 1; r >= 0; r--) if (!gone.has(r * N + c)) col.push(b[r * N + c]);
    for (let r = N - 1, j = 0; r >= 0; r--, j++) out[r * N + c] = col[j] ?? rand(out);
  }
  return out;
}

export default function Charms({ list, items, opts, study }: ModeProps) {
  const [board, setBoard] = useState<Board>(fresh);
  const [phase, setPhase] = useState<'start' | 'play' | 'question' | 'over'>('start');
  const [moves, setMoves] = useState(START_MOVES);
  const [score, setScore] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [popping, setPopping] = useState<Set<number>>(new Set());
  const [bad, setBad] = useState<number[]>([]);
  const [bonus, setBonus] = useState(0);
  const [combo, setCombo] = useState(0);
  const [qn, setQn] = useState(0);
  const [record, setRecord] = useState(false);
  const busy = useRef(false);
  const won = useRef(false);
  const swipe = useRef<{ i: number; x: number; y: number } | null>(null);
  // Kaydırmadan sonra gelen tıklama seçim yapmasın
  const swiped = useRef(false);

  const q: McQ | WriteQ = useMemo(() => {
    const it = items[Math.floor(Math.random() * items.length)];
    return opts.write && Math.random() < 0.35 ? { kind: 'write', item: it, dir: pickDir(opts.dir) } : mcQ(it, items, opts.dir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qn]);

  const finish = (s: number) => {
    setPhase('over');
    study.best('charms', s).then((r) => r && setRecord(r.record));
  };
  const start = () => {
    setBoard(fresh()); setMoves(START_MOVES); setScore(0); setSel(null); setRecord(false); setPhase('play');
  };

  async function trySwap(a: number, z: number) {
    if (busy.current || !adjacent(a, z)) return;
    setSel(null);
    let b = swapped(board, a, z);
    let hit = matches(b);
    if (!hit.size) {
      setBad([a, z]);
      setTimeout(() => setBad([]), 350);
      return;
    }
    busy.current = true;
    setBoard(b);
    let m = moves - 1, s = score, got = 0, k = 1;
    setMoves(m);
    // Zincirleme: düşen tılsımlar yeni üçlüler oluşturdukça devam eder
    while (hit.size) {
      setCombo(k);
      setPopping(hit);
      await wait(260);
      for (const i of hit) got += b[i].bonus || 0;
      s += hit.size * 10 * k;
      setScore(s);
      b = collapse(b, hit);
      setPopping(new Set());
      setBoard(b);
      await wait(200);
      hit = matches(b);
      k++;
    }
    setCombo(0);
    while (!hasMove(b)) { b = fresh(); setBoard(b); }
    busy.current = false;
    if (got) { setBonus(got); setPhase('question'); setQn((n) => n + 1); return; }
    if (m <= 0) finish(s);
  }

  const onAnswer = (ok: boolean) => { study.gameAnswer(ok); won.current = ok; };
  const onNext = () => {
    const m = moves + (won.current ? bonus : 0);
    won.current = false;
    setMoves(m);
    if (m <= 0) finish(score); else setPhase('play');
  };

  const tap = (i: number) => {
    if (swiped.current) { swiped.current = false; return; }
    if (busy.current || phase !== 'play') return;
    if (sel === null) setSel(i);
    else if (sel === i) setSel(null);
    else if (adjacent(sel, i)) trySwap(sel, i);
    else setSel(i);
  };
  const onDown = (i: number, e: React.PointerEvent) => { swipe.current = { i, x: e.clientX, y: e.clientY }; swiped.current = false; };
  const onMove = (e: React.PointerEvent) => {
    const s = swipe.current;
    if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
    swipe.current = null;
    swiped.current = true;
    const c = s.i % N, r = Math.floor(s.i / N);
    const z = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? (c < N - 1 ? s.i + 1 : -1) : (c > 0 ? s.i - 1 : -1)) : (dy > 0 ? (r < N - 1 ? s.i + N : -1) : (r > 0 ? s.i - N : -1));
    if (z >= 0) trySwap(s.i, z);
  };

  if (phase === 'over') return <GameOver title="Puanın" value={String(score)} record={record} best={list.best.charms != null ? String(list.best.charms) : undefined} onAgain={start} />;
  if (phase === 'start') {
    return (
      <div className="pop flex flex-col items-center text-center gap-4 py-12">
        <span className="w-16 h-16 rounded-2xl bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={I.gem(30)} /></span>
        <h1 className="m-0 text-[30px] font-bold">Tılsım</h1>
        <p className="m-0 text-mute max-w-[480px] leading-relaxed">Yan yana iki tılsımın yerini değiştir (kaydır ya da sırayla dokun), aynı türden en az 3 tanesini diz. Üzerinde <b className="text-soft">+sayı</b> yazan soru tılsımlarını dizersen bir soru gelir; doğru cevap o kadar hamle kazandırır. {START_MOVES} hamlen var.</p>
        {list.best.charms != null && <span className="text-sm text-soft">En iyi puanın: {list.best.charms}</span>}
        <button type="button" onClick={start} className="mt-2 h-12 px-7 rounded-xl bg-acc text-onacc font-bold">Oyunu başlat</button>
      </div>
    );
  }

  const cell = 'min(11.5vw, 62px)';
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
      <div className="flex flex-col gap-3 items-center">
        <div className="w-full flex justify-between items-baseline">
          <span className="text-sm text-mute"><b className={`text-[20px] ${moves <= 3 ? 'text-bad' : 'text-ink'}`}>{moves}</b> hamle</span>
          {combo > 1 && <span className="pop text-sm font-bold text-acct">{combo}x zincir!</span>}
          <span className="text-[22px] font-bold tabular-nums">{score}</span>
        </div>
        <div className="grid gap-[4px] p-[6px] rounded-2xl bg-s0 border border-line3 touch-none select-none" style={{ gridTemplateColumns: `repeat(${N}, ${cell})` }}
          onPointerMove={onMove} onPointerUp={() => { swipe.current = null; }} onPointerLeave={() => { swipe.current = null; }}>
          {board.map((x, i) => (
            <button key={x.id} type="button" onClick={() => tap(i)} onPointerDown={(e) => onDown(i, e)}
              aria-label={`${KINDS[x.k].g}${x.bonus ? `, soru tılsımı +${x.bonus}` : ''}`} aria-pressed={sel === i}
              className={`relative rounded-xl flex items-center justify-center transition-all duration-200 ${popping.has(i) ? 'scale-0 opacity-0' : ''} ${bad.includes(i) ? 'shake' : ''} ${sel === i ? 'ring-2 ring-acc bg-s5' : 'bg-s3'}`}
              style={{ width: cell, height: cell }}>
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '56%', height: '56%' }}><path d={KINDS[x.k].d} fill={KINDS[x.k].c} /></svg>
              {x.bonus && <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-acc text-onacc text-[11px] font-bold flex items-center justify-center shadow">+{x.bonus}</span>}
            </button>
          ))}
        </div>
      </div>
      {phase === 'question' && (
        <div className="pop order-first lg:order-none w-full max-w-[460px] p-5 rounded-[22px] bg-s4 border border-line3 flex flex-col gap-3">
          <span className="text-xs font-bold tracking-[.1em] uppercase text-lab">Soru tılsımı: doğru cevapla, +{bonus} hamle kazan</span>
          <AnyQuestion key={qn} q={q} onAnswer={onAnswer} onNext={onNext} />
        </div>
      )}
    </div>
  );
}
