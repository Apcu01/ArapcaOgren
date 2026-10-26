'use client';

/* Blast: aşağıdaki kelimenin karşılığını taşıyan göktaşını, yere düşmeden vur.
   Yanlış göktaşı ya da kaçırılan doğru göktaşı bir can götürür; her 5 doğruda hız artar */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Ar } from '../../AppProvider';
import { I, Raw } from '../../icons';
import { Face, GameOver } from '../parts';
import type { ModeProps } from '../StudyShell';
import { distractors, pickDir, type ListItem, type Side } from '@/lib/study';
import { shuffle } from '@/lib/text';

type Rock = { item: ListItem; x: number; y: number; vx: number; state: 'fly' | 'hit' | 'bad' };
type Wave = { n: number; target: ListItem; dir: Side; rocks: Rock[] };
const LIVES = 3;
/** Göktaşı çapı: dört tanesi yan yana sığsın (telefonda küçülür) */
const rockSize = (w: number) => Math.max(72, Math.min(116, Math.floor(w / 4) - 6));

export default function Blast({ list, items, opts, study }: ModeProps) {
  const [phase, setPhase] = useState<'start' | 'play' | 'over'>('start');
  const [wave, setWave] = useState<Wave | null>(null);
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [flash, setFlash] = useState<ListItem | null>(null);
  const [record, setRecord] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const st = useRef({ wave: null as Wave | null, speed: 0, last: 0, lock: false, lives: LIVES, score: 0, hits: 0, paused: false });

  const level = Math.floor(hits / 5) + 1;

  const newWave = useCallback(() => {
    const w = area.current?.clientWidth || 360;
    const target = shuffle(items)[0];
    const opts4 = shuffle([target, ...distractors(target, items, 3)]);
    const ROCK = rockSize(w);
    const lane = (w - ROCK) / Math.max(1, opts4.length - 1);
    const rocks: Rock[] = opts4.map((item, i) => ({
      item, x: Math.max(0, Math.min(w - ROCK, i * lane + (Math.random() - 0.5) * 24)),
      // Hemen görünsünler ama aynı hizada gelmesinler
      y: -ROCK * 0.6 - Math.random() * 70, vx: (Math.random() - 0.5) * 14, state: 'fly'
    }));
    const wv = { n: (st.current.wave?.n ?? 0) + 1, target, dir: pickDir(opts.dir), rocks };
    st.current.wave = wv; st.current.lock = false;
    setWave(wv); setFlash(null);
  }, [items, opts.dir]);

  const over = useCallback(() => {
    setPhase('over');
    study.best('blast', st.current.score).then((r) => r && setRecord(r.record));
  }, [study]);

  const loseLife = useCallback((missed: ListItem | null) => {
    const l = st.current.lives - 1;
    st.current.lives = l; setLives(l);
    if (missed) setFlash(missed);
    st.current.lock = true;
    setTimeout(() => (l <= 0 ? over() : newWave()), missed ? 1300 : 500);
  }, [newWave, over]);

  // Oyun döngüsü: göktaşlarının konumu doğrudan DOM üzerinde güncellenir
  useEffect(() => {
    if (phase !== 'play') return;
    let raf = 0;
    const tick = (t: number) => {
      const s = st.current;
      const dt = s.last ? Math.min(0.05, (t - s.last) / 1000) : 0;
      s.last = t;
      const h = (area.current?.clientHeight || 500) - 92;
      const w = area.current?.clientWidth || 360;
      const ROCK = rockSize(w);
      if (s.wave && !s.lock && !s.paused) {
        for (const [i, r] of s.wave.rocks.entries()) {
          if (r.state !== 'fly') continue;
          r.y += s.speed * dt;
          r.x = Math.max(0, Math.min(w - ROCK, r.x + r.vx * dt));
          const el = els.current[i];
          if (el) el.style.transform = `translate(${r.x}px, ${r.y}px)`;
          if (r.item.id === s.wave.target.id && r.y > h - ROCK) { study.gameAnswer(false); loseLife(s.wave.target); break; }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const vis = () => { st.current.paused = document.hidden; st.current.last = 0; };
    document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', vis); };
  }, [phase, loseLife, study]);

  useEffect(() => { st.current.speed = 38 + (level - 1) * 9; }, [level]);

  const start = () => {
    Object.assign(st.current, { lives: LIVES, score: 0, hits: 0, last: 0, speed: 38 });
    setLives(LIVES); setScore(0); setHits(0); setRecord(false); setPhase('play');
    setTimeout(newWave, 50);
  };

  const shoot = (i: number) => {
    const s = st.current;
    const w = s.wave;
    if (!w || s.lock) return;
    const r = w.rocks[i];
    if (r.state !== 'fly') return;
    if (r.item.id === w.target.id) {
      r.state = 'hit'; s.lock = true;
      const h = area.current?.clientHeight || 500;
      // Erken vurana daha çok puan
      const pts = 100 + Math.round((1 - Math.max(0, r.y) / h) * 100) + (level - 1) * 20;
      s.score += pts; s.hits += 1;
      setScore(s.score); setHits(s.hits);
      study.gameAnswer(true);
      setWave({ ...w });
      setTimeout(newWave, 450);
    } else {
      r.state = 'bad';
      setWave({ ...w });
      study.gameAnswer(false);
      loseLife(w.target);
    }
  };

  if (phase === 'over') return <GameOver title="Puanın" value={String(score)} record={record} best={list.best.blast != null ? String(list.best.blast) : undefined} onAgain={start}><span className="text-mute">{hits} göktaşı vurdun · {level}. seviye</span></GameOver>;
  if (phase === 'start') {
    return (
      <div className="pop flex flex-col items-center text-center gap-4 py-12">
        <span className="w-16 h-16 rounded-2xl bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={I.rocket(30)} /></span>
        <h1 className="m-0 text-[30px] font-bold">Blast</h1>
        <p className="m-0 text-mute max-w-[460px] leading-relaxed">Aşağıda bir kelime görünür. Karşılığını taşıyan göktaşına dokunup vur, yere düşmesine izin verme. Yanlış göktaşı ya da kaçırılan doğru cevap bir can götürür. {LIVES} canın var.</p>
        {list.best.blast != null && <span className="text-sm text-soft">En iyi puanın: {list.best.blast}</span>}
        <button type="button" onClick={start} className="mt-2 h-12 px-7 rounded-xl bg-acc text-onacc font-bold">Oyunu başlat</button>
      </div>
    );
  }
  const ans: Side = wave?.dir === 'ar' ? 'tr' : 'ar';
  const ROCK = rockSize(area.current?.clientWidth || 360);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="flex gap-1 text-bad" aria-label={`${lives} can`}>{Array.from({ length: LIVES }, (_, i) => <Raw key={i} html={I.heart(20)} className={i < lives ? '' : 'opacity-20'} />)}</span>
        <span className="text-sm text-mute">{level}. seviye</span>
        <span className="text-[22px] font-bold tabular-nums">{score}</span>
      </div>
      <div ref={area} className="relative h-[62vh] min-h-[440px] max-h-[640px] rounded-[22px] bg-s0 border border-line3 overflow-hidden select-none touch-manipulation">
        {/* Yıldızlar */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(rgb(var(--c-faint)) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
        {wave?.rocks.map((r, i) => (
          <button key={wave.n + '-' + i} ref={(el) => { els.current[i] = el; }} type="button" onClick={() => shoot(i)} disabled={r.state !== 'fly'}
            style={{ width: ROCK, height: ROCK, transform: `translate(${r.x}px, ${r.y}px)` }}
            className={`absolute left-0 top-0 rounded-full border-2 flex items-center justify-center p-2.5 text-center transition-[opacity,scale] duration-300
              ${r.state === 'hit' ? 'scale-150 opacity-0 bg-okbg border-okln' : r.state === 'bad' ? 'scale-75 opacity-0 bg-badbg border-badln' : 'bg-s4 border-lineh shadow-lg hover:border-acc'}`}>
            {ans === 'ar' ? <Ar t={r.item.ar} className="text-[20px] leading-[1.3] text-ink" /> : <span className="text-[13px] font-semibold leading-tight text-ink break-words">{r.item.tr}</span>}
          </button>
        ))}
        <div className="absolute left-0 right-0 bottom-0 h-[92px] border-t border-line3 bg-s4/95 flex items-center justify-center gap-3 px-4">
          <span className="text-acct shrink-0"><Raw html={I.rocket(26)} /></span>
          {flash ? (
            <span className="pop flex items-center gap-2 text-sm"><span className="text-bad font-semibold">Doğrusu:</span> <Ar t={flash.ar} className="text-[20px] text-ink" /> <span className="text-ink font-semibold">{flash.tr}</span></span>
          ) : wave && <span className="min-w-0 truncate"><Face item={wave.target} side={wave.dir} size="sm" /></span>}
        </div>
      </div>
    </div>
  );
}
