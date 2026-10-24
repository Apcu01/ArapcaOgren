'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { I, Raw } from './icons';

export type NarrIds = { sections: (number | null)[]; summary: number | null };
export type Track = { id: number; title: string; anchor: string };

const RATES = [0.75, 1, 1.25, 1.5];
const RATE_KEY = 'arblearn:narr-rate';
const fmtTime = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');

/** Ders anlatımı oynatıcısı: bölümleri sırayla çalar, çalan bölümü vurgular ve sayfayı ona kaydırır */
export function useLessonAudio(tracks: Track[]) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [cur, setCur] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);
  const curRef = useRef<number | null>(null);
  curRef.current = cur;

  useEffect(() => {
    try { const r = Number(localStorage.getItem(RATE_KEY)); if (RATES.includes(r)) setRate(r); } catch { /* yok */ }
    const a = new Audio();
    a.preload = 'auto';
    audio.current = a;
    const tick = () => { setPos(a.currentTime); setDur(a.duration || 0); };
    a.addEventListener('timeupdate', tick);
    a.addEventListener('loadedmetadata', tick);
    a.addEventListener('play', () => setPlaying(true));
    a.addEventListener('pause', () => setPlaying(false));
    return () => { a.pause(); a.src = ''; };
  }, []);

  const play = useCallback((i: number, scroll = true) => {
    const a = audio.current;
    const t = tracks[i];
    if (!a || !t) return;
    try { speechSynthesis.cancel(); } catch { /* yok */ }
    a.src = `/api/narration/${t.id}`;
    a.playbackRate = rate;
    a.play().catch(() => null);
    setCur(i);
    setPos(0);
    if (scroll) document.getElementById(t.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [tracks, rate]);

  // Bölüm bitince sıradakine geç
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const onEnd = () => {
      const c = curRef.current;
      if (c != null && c + 1 < tracks.length) play(c + 1);
      else { setCur(null); setPlaying(false); }
    };
    a.addEventListener('ended', onEnd);
    return () => a.removeEventListener('ended', onEnd);
  }, [tracks, play]);

  // Sayfadaki bir kelimenin sesi çalınınca anlatımı duraklat
  useEffect(() => {
    const h = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('[data-say]')) audio.current?.pause(); };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (cur == null) return play(0);
    if (a.paused) a.play().catch(() => null); else a.pause();
  };
  const stop = () => { audio.current?.pause(); setCur(null); };
  const cycleRate = () => {
    const r = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    setRate(r);
    if (audio.current) audio.current.playbackRate = r;
    try { localStorage.setItem(RATE_KEY, String(r)); } catch { /* yok */ }
  };
  const seek = (frac: number) => { const a = audio.current; if (a && a.duration) a.currentTime = frac * a.duration; };
  const playAnchor = (anchor: string) => { const i = tracks.findIndex((t) => t.anchor === anchor); if (i >= 0) play(i, false); };

  return { tracks, cur, playing, rate, pos, dur, play, toggle, stop, cycleRate, seek, playAnchor, activeAnchor: cur != null && tracks[cur] ? tracks[cur].anchor : null };
}

export type LessonAudio = ReturnType<typeof useLessonAudio>;

/** Konu anlatımının başındaki tanıtım kartı */
export function ListenCard({ la }: { la: LessonAudio }) {
  if (!la.tracks.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-s4 border border-line3">
      <div className="flex items-center gap-4 min-w-0">
        <span className="w-12 h-12 shrink-0 rounded-full bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={I.headphones(22)} /></span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-bold text-[17px]">Dersi sesli dinle</span>
          <span className="text-sm text-mute">Öğretmen anlatımı · {la.tracks.length} bölüm. Okurken ya da tek başına dinleyebilirsin.</span>
        </div>
      </div>
      <button type="button" onClick={la.toggle} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold text-[15px] inline-flex items-center gap-2">
        <Raw html={la.playing ? I.pause(18) : I.playS(18)} /> {la.cur == null ? 'Dinlemeye başla' : la.playing ? 'Duraklat' : 'Devam et'}
      </button>
    </div>
  );
}

/** Bölüm başlığının yanındaki küçük dinle düğmesi */
export function SectionListen({ la, anchor }: { la: LessonAudio; anchor: string }) {
  const i = la.tracks.findIndex((t) => t.anchor === anchor);
  if (i < 0) return null;
  const active = la.cur === i;
  return (
    <button type="button" onClick={() => (active ? la.toggle() : la.play(i, false))}
      aria-label={active && la.playing ? 'Anlatımı duraklat' : 'Bu bölümün anlatımını dinle'}
      className={`ml-auto self-center shrink-0 h-9 px-3 rounded-full border text-[13px] font-semibold inline-flex items-center gap-1.5 ${active ? 'bg-acc text-onacc border-acc' : 'bg-s2 text-soft border-line3 hover:text-ink hover:border-lineh'}`}>
      <Raw html={active && la.playing ? I.pause(14) : I.headphones(15)} /> {active && la.playing ? 'Duraklat' : 'Dinle'}
    </button>
  );
}

/** Dinlerken ekranın altında sabit duran oynatıcı */
export function NowPlaying({ la }: { la: LessonAudio }) {
  if (la.cur == null) return null;
  const t = la.tracks[la.cur];
  const frac = la.dur ? la.pos / la.dur : 0;
  const btn = 'w-10 h-10 shrink-0 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh disabled:opacity-40';
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[70] w-[min(720px,calc(100vw-24px))] p-3 sm:p-4 rounded-2xl bg-s4/95 backdrop-blur border border-line3 shadow-2xl flex flex-col gap-2.5" role="region" aria-label="Ders anlatımı oynatıcısı">
      <div className="flex items-center gap-2 sm:gap-3">
        <button type="button" className={btn} onClick={() => la.play(la.cur! - 1)} disabled={la.cur === 0} aria-label="Önceki bölüm" dangerouslySetInnerHTML={{ __html: I.prev(16) }} />
        <button type="button" className="w-12 h-12 shrink-0 rounded-full bg-acc text-onacc flex items-center justify-center" onClick={la.toggle} aria-label={la.playing ? 'Duraklat' : 'Oynat'} dangerouslySetInnerHTML={{ __html: la.playing ? I.pause(20) : I.playS(20) }} />
        <button type="button" className={btn} onClick={() => la.play(la.cur! + 1)} disabled={la.cur === la.tracks.length - 1} aria-label="Sonraki bölüm" dangerouslySetInnerHTML={{ __html: I.next(16) }} />
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-xs text-faint">Bölüm {la.cur + 1} / {la.tracks.length}</span>
          <span className="text-sm sm:text-[15px] font-semibold truncate">{t.title}</span>
        </div>
        <button type="button" onClick={la.cycleRate} className="h-9 px-2.5 shrink-0 rounded-lg border border-line3 bg-s2 text-soft text-sm font-bold hover:text-ink" aria-label="Okuma hızı">{la.rate}x</button>
        <button type="button" className={btn} onClick={la.stop} aria-label="Oynatıcıyı kapat" dangerouslySetInnerHTML={{ __html: I.x(14) }} />
      </div>
      <div className="flex items-center gap-3 text-xs text-faint">
        <span className="w-9 text-right tabular-nums">{fmtTime(la.pos)}</span>
        <div className="flex-1 h-2 rounded-full bg-[#2E231B] cursor-pointer relative" role="slider" aria-label="Konum" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(frac * 100)} tabIndex={0}
          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); la.seek((e.clientX - r.left) / r.width); }}
          onKeyDown={(e) => { if (e.key === 'ArrowRight') la.seek(Math.min(1, frac + 0.05)); if (e.key === 'ArrowLeft') la.seek(Math.max(0, frac - 0.05)); }}>
          <div className="h-full rounded-full bg-acc" style={{ width: frac * 100 + '%' }} />
        </div>
        <span className="w-9 tabular-nums">{fmtTime(la.dur)}</span>
      </div>
    </div>
  );
}
