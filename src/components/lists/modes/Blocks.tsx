'use client';

/* Bloklar: soruyu doğru cevapla, 3 blok kazan, blokları 8x8 tahtaya yerleştir.
   Dolan satır ve sütunlar silinir ve puan getirir. Eldeki bloklardan hiçbiri sığmazsa oyun biter */
import { useEffect, useMemo, useRef, useState } from 'react';
import { I, Raw } from '../../icons';
import { AnyQuestion, GameOver } from '../parts';
import type { ModeProps } from '../StudyShell';
import { mcQ, pickDir, type McQ, type WriteQ } from '@/lib/study';

const N = 8;
const COLORS = ['#e0a458', '#7fb77e', '#6aa5d8', '#c07ad6', '#e07a6a'];
const SHAPES: [number, number][][] = [
  [[0, 0]],
  [[0, 0], [0, 1]], [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [1, 1]], [[0, 1], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 0]], [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [2, 0], [2, 1]], [[0, 0], [0, 1], [0, 2], [1, 0]], [[0, 1], [1, 1], [2, 1], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]
];
type Piece = { id: number; cells: [number, number][]; color: number; h: number; w: number };
let pid = 0;
function randPiece(): Piece {
  const cells = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return { id: ++pid, cells, color: Math.floor(Math.random() * COLORS.length), h: Math.max(...cells.map((c) => c[0])) + 1, w: Math.max(...cells.map((c) => c[1])) + 1 };
}
type Board = (number | null)[];
const fits = (b: Board, p: Piece, r: number, c: number) => p.cells.every(([dr, dc]) => {
  const rr = r + dr, cc = c + dc;
  return rr >= 0 && cc >= 0 && rr < N && cc < N && b[rr * N + cc] === null;
});
const fitsAnywhere = (b: Board, p: Piece) => { for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (fits(b, p, r, c)) return true; return false; };
/** Parçanın ortası işaret edilen hücreye gelsin */
const anchor = (p: Piece, r: number, c: number) => [r - Math.floor((p.h - 1) / 2), c - Math.floor((p.w - 1) / 2)] as const;

export default function Blocks({ list, items, opts, study }: ModeProps) {
  const [board, setBoard] = useState<Board>(() => Array(N * N).fill(null));
  const [pieces, setPieces] = useState<(Piece | null)[]>([]);
  const [phase, setPhase] = useState<'start' | 'question' | 'place' | 'over'>('start');
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [hover, setHover] = useState<[number, number] | null>(null);
  const [cleared, setCleared] = useState<number[]>([]);
  const [qn, setQn] = useState(0);
  const [record, setRecord] = useState(false);
  const boardEl = useRef<HTMLDivElement>(null);
  const drag = useRef<{ i: number; touch: boolean } | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);

  const q: McQ | WriteQ = useMemo(() => {
    const it = items[Math.floor(Math.random() * items.length)];
    return opts.write && Math.random() < 0.35 ? { kind: 'write', item: it, dir: pickDir(opts.dir) } : mcQ(it, items, opts.dir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qn]);

  const finish = (s: number) => {
    setPhase('over');
    study.best('blocks', s).then((r) => r && setRecord(r.record));
  };
  const start = () => {
    setBoard(Array(N * N).fill(null)); setPieces([]); setScore(0); setLines(0); setSel(null); setRecord(false);
    setPhase('question'); setQn((n) => n + 1);
  };

  // Doğru cevapta kazanılan bloklar devam edilince verilir; yanlışta yeni soru gelir
  const earned = useRef<Piece[] | null>(null);
  const onAnswer = (ok: boolean) => {
    study.gameAnswer(ok);
    earned.current = ok ? [randPiece(), randPiece(), randPiece()] : null;
  };
  const onNext = () => {
    const ps = earned.current;
    earned.current = null;
    if (!ps) { setQn((n) => n + 1); return; }
    setPieces(ps);
    setPhase('place');
    if (!ps.some((p) => fitsAnywhere(board, p))) setTimeout(() => finish(score), 600);
  };

  const place = (i: number, r0: number, c0: number) => {
    const p = pieces[i];
    if (!p) return false;
    const [r, c] = anchor(p, r0, c0);
    if (!fits(board, p, r, c)) return false;
    const b = board.slice();
    for (const [dr, dc] of p.cells) b[(r + dr) * N + c + dc] = p.color;
    // Dolan satır ve sütunlar
    const full: number[] = [];
    let n = 0;
    for (let k = 0; k < N; k++) {
      const row = Array.from({ length: N }, (_, j) => k * N + j);
      const col = Array.from({ length: N }, (_, j) => j * N + k);
      if (row.every((x) => b[x] !== null)) { full.push(...row); n++; }
      if (col.every((x) => b[x] !== null)) { full.push(...col); n++; }
    }
    const gained = p.cells.length + n * n * 10;
    for (const x of full) b[x] = null;
    const ps = pieces.map((x, j) => (j === i ? null : x));
    const s = score + gained;
    setBoard(b); setPieces(ps); setScore(s); setLines((l) => l + n); setSel(null); setHover(null);
    if (full.length) { setCleared(full); setTimeout(() => setCleared([]), 350); }
    if (!ps.some(Boolean)) { setPhase('question'); setQn((x) => x + 1); }
    else if (!ps.some((x) => x && fitsAnywhere(b, x))) setTimeout(() => finish(s), 700);
    return true;
  };

  // Sürükleyip bırakma (fare ve dokunmatik)
  const cellAt = (x: number, y: number): [number, number] | null => {
    const el = boardEl.current;
    if (!el) return null;
    const rc = el.getBoundingClientRect();
    if (x < rc.left || y < rc.top || x > rc.right || y > rc.bottom) return null;
    return [Math.floor(((y - rc.top) / rc.height) * N), Math.floor(((x - rc.left) / rc.width) * N)];
  };
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      // Parmağın altında kalmasın diye dokunmatikte parça biraz yukarıda gösterilir
      const y = e.clientY - (d.touch ? 70 : 0);
      setGhostPos({ x: e.clientX, y });
      setHover(cellAt(e.clientX, y));
    };
    const up = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      setGhostPos(null);
      const y = e.clientY - (d.touch ? 70 : 0);
      const cell = cellAt(e.clientX, y);
      if (cell) place(d.i, cell[0], cell[1]);
      else setHover(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  });

  const active = drag.current?.i ?? sel;
  const preview = new Map<number, boolean>();
  if (active != null && hover && pieces[active]) {
    const p = pieces[active]!;
    const [r, c] = anchor(p, hover[0], hover[1]);
    const ok = fits(board, p, r, c);
    for (const [dr, dc] of p.cells) { const rr = r + dr, cc = c + dc; if (rr >= 0 && cc >= 0 && rr < N && cc < N) preview.set(rr * N + cc, ok); }
  }

  if (phase === 'over') return <GameOver title="Puanın" value={String(score)} record={record} best={list.best.blocks != null ? String(list.best.blocks) : undefined} onAgain={start}><span className="text-mute">{lines} satır ve sütun temizledin</span></GameOver>;
  if (phase === 'start') {
    return (
      <div className="pop flex flex-col items-center text-center gap-4 py-12">
        <span className="w-16 h-16 rounded-2xl bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={I.blocks(30)} /></span>
        <h1 className="m-0 text-[30px] font-bold">Bloklar</h1>
        <p className="m-0 text-mute max-w-[480px] leading-relaxed">Soruyu doğru cevapla, 3 blok kazan. Blokları sürükleyerek (ya da bloğa, sonra tahtaya dokunarak) yerleştir. Dolan satır ve sütunlar silinir ve puan getirir. Hiçbir blok sığmazsa oyun biter.</p>
        {list.best.blocks != null && <span className="text-sm text-soft">En iyi puanın: {list.best.blocks}</span>}
        <button type="button" onClick={start} className="mt-2 h-12 px-7 rounded-xl bg-acc text-onacc font-bold">Oyunu başlat</button>
      </div>
    );
  }

  const cellPx = 'min(10vw, 54px)';
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
      <div className="flex flex-col gap-3 items-center">
        <div className="w-full flex justify-between text-sm text-mute"><span>{lines} satır</span><span className="text-[22px] font-bold text-ink tabular-nums">{score}</span></div>
        <div ref={boardEl} className="grid gap-[3px] p-[6px] rounded-2xl bg-s0 border border-line3 touch-none select-none" style={{ gridTemplateColumns: `repeat(${N}, ${cellPx})` }}
          onPointerLeave={() => { if (!drag.current) setHover(null); }}>
          {board.map((v, k) => {
            const pv = preview.get(k);
            const bg = v !== null ? COLORS[v] : pv === true ? COLORS[pieces[active!]!.color] + '99' : undefined;
            return (
              <button key={k} type="button" aria-label={`Satır ${Math.floor(k / N) + 1}, sütun ${(k % N) + 1}${v !== null ? ', dolu' : ''}`}
                onPointerEnter={() => { if (sel != null && !drag.current) setHover([Math.floor(k / N), k % N]); }}
                onClick={() => { if (sel != null) place(sel, Math.floor(k / N), k % N); }}
                className={`rounded-[6px] transition-colors ${cleared.includes(k) ? 'animate-pulse bg-ok' : ''} ${pv === false ? 'bg-badbg' : v === null && pv === undefined ? 'bg-s3' : ''}`}
                style={{ width: cellPx, height: cellPx, background: bg }} />
            );
          })}
        </div>
      </div>

      {/* Telefonda soru tahtanın üstünde görünsün */}
      <div className={`w-full max-w-[460px] flex flex-col gap-4 ${phase === 'question' ? 'order-first lg:order-none' : ''}`}>
        {phase === 'question' ? (
          <div className="pop p-5 rounded-[22px] bg-s4 border border-line3 flex flex-col gap-3">
            <span className="text-xs font-bold tracking-[.1em] uppercase text-lab">Doğru cevapla, 3 blok kazan</span>
            <AnyQuestion key={qn} q={q} onAnswer={onAnswer} onNext={onNext} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="text-sm text-mute text-center">Bloğu tahtaya sürükle ya da bloğa, sonra tahtaya dokun</span>
            <div className="flex justify-around items-center gap-3 min-h-[140px] p-3 rounded-[22px] bg-s1 border border-line touch-none">
              {pieces.map((p, i) => p ? (
                <button key={p.id} type="button" aria-label={`${i + 1}. blok, ${p.cells.length} kare`} aria-pressed={sel === i}
                  onPointerDown={(e) => { drag.current = { i, touch: e.pointerType !== 'mouse' }; setSel(i); setGhostPos({ x: e.clientX, y: e.clientY - (e.pointerType !== 'mouse' ? 70 : 0) }); }}
                  className={`p-2 rounded-xl border-2 ${sel === i ? 'border-acc bg-s4' : 'border-transparent'} ${fitsAnywhere(board, p) ? '' : 'opacity-40'}`}>
                  <Mini p={p} size={20} />
                </button>
              ) : <span key={i} className="w-[60px]" />)}
            </div>
          </div>
        )}
      </div>
      {ghostPos && drag.current && pieces[drag.current.i] && (
        <div className="fixed z-[90] pointer-events-none opacity-80" style={{ left: ghostPos.x, top: ghostPos.y, transform: 'translate(-50%, -50%)' }}>
          <Mini p={pieces[drag.current.i]!} size={30} />
        </div>
      )}
    </div>
  );
}

function Mini({ p, size }: { p: Piece; size: number }) {
  return (
    <span className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${p.w}, ${size}px)`, gridTemplateRows: `repeat(${p.h}, ${size}px)` }}>
      {Array.from({ length: p.h * p.w }, (_, k) => {
        const on = p.cells.some(([r, c]) => r === Math.floor(k / p.w) && c === k % p.w);
        return <span key={k} className="rounded-[4px]" style={{ background: on ? COLORS[p.color] : 'transparent' }} />;
      })}
    </span>
  );
}
