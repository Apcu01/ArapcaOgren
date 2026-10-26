'use client';

/* Canlı yarışma: ortak parçalar */
import { useCallback, useEffect, useRef, useState } from 'react';

/** Seçenek renkleri ve şekilleri (renk körlüğüne karşı şekil de farklı) */
export const OPTS = [
  { bg: '#d65a4f', shape: 'M12 4 21 20H3z', name: 'üçgen' },
  { bg: '#3d7fc4', shape: 'M12 2 22 12 12 22 2 12z', name: 'elmas' },
  { bg: '#c98f22', shape: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z', name: 'daire' },
  { bg: '#3f9a5c', shape: 'M4 4h16v16H4z', name: 'kare' }
];
export function Shape({ i, size = 26 }: { i: number; size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="shrink-0"><path d={OPTS[i].shape} fill="#fff" /></svg>;
}

export const hostKeyOf = (code: string) => `arblearn:live-host:${code}`;
export const playerKeyOf = (code: string) => `arblearn:live-player:${code}`;
export function store<T>(key: string): T | null {
  try { return JSON.parse(localStorage.getItem(key) || 'null') as T | null; } catch { return null; }
}
export function save(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* depolama kapalı */ }
}

export async function post<T>(url: string, body: unknown): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { ok: true, data: j as T } : { ok: false, error: (j as { error?: string }).error || 'Bir sorun oluştu.' };
  } catch {
    return { ok: false, error: 'Bağlantı kurulamadı. İnternetini kontrol et.' };
  }
}

/** Durumu saniyede bir sorar (sekme arka plandayken seyrek); refresh ile hemen sorar */
export function usePoll<T>(url: string | null, ms = 1000) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<number>(0);
  const [at, setAt] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tickRef = useRef<() => void>(() => {});
  useEffect(() => {
    if (!url) return;
    let stop = false;
    const tick = async () => {
      clearTimeout(timer.current);
      try {
        const r = await fetch(url, { cache: 'no-store' });
        if (stop) return;
        setStatus(r.status);
        if (r.ok) { setData((await r.json()) as T); setAt(Date.now()); }
      } catch { /* bağlantı kesildi: bir sonraki turda tekrar */ }
      if (!stop) timer.current = setTimeout(tick, document.hidden ? 4000 : ms);
    };
    tickRef.current = tick;
    tick();
    const vis = () => { if (!document.hidden) tick(); };
    document.addEventListener('visibilitychange', vis);
    return () => { stop = true; clearTimeout(timer.current); document.removeEventListener('visibilitychange', vis); };
  }, [url, ms]);
  const refresh = useCallback(() => tickRef.current(), []);
  return { data, status, at, refresh };
}

/** Sunucudan gelen kalan süreden yerel geri sayım (saniye, ondalıklı) */
export function useCountdown(remainingMs: number, receivedAt: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (remainingMs <= 0) return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [remainingMs, receivedAt]);
  return Math.max(0, (receivedAt + remainingMs - now) / 1000);
}

export function Ring({ left, total, size = 84 }: { left: number; total: number; size?: number }) {
  const pct = total ? left / total : 0;
  return (
    <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }} role="timer" aria-label={`${Math.ceil(left)} saniye kaldı`}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3.5" className="stroke-track" />
        <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${pct * 97.4} 100`} className={left <= 5 ? 'stroke-bad' : 'stroke-acc'} />
      </svg>
      <span className="font-bold tabular-nums" style={{ fontSize: size * 0.34 }}>{Math.ceil(left)}</span>
    </span>
  );
}

/** Soru metni: Arapça ise büyük ve sağdan sola */
export function Prompt({ text, tl, side, size = 'lg' }: { text: string; tl?: string; side: 'ar' | 'tr'; size?: 'lg' | 'md' }) {
  if (side === 'tr') return <span className={`${size === 'lg' ? 'text-[32px] sm:text-[44px]' : 'text-[22px]'} font-bold text-ink leading-tight text-center break-words`}>{text}</span>;
  return (
    <span className="flex flex-col items-center gap-1">
      <span lang="ar" dir="rtl" className={`ar ${size === 'lg' ? 'text-[52px] sm:text-[72px]' : 'text-[34px]'} leading-[1.4] text-ink`}>{text}</span>
      {tl && <span className={`tl text-mute ${size === 'lg' ? 'text-xl' : 'text-sm'}`}>{tl}</span>}
    </span>
  );
}

/** Seçenek metni: Arapça seçenek sağdan sola */
export const OptText = ({ text, big }: { text: string; big?: boolean }) =>
  /[؀-ۿ]/.test(text)
    ? <span lang="ar" dir="rtl" className={`ar ${big ? 'text-[30px] sm:text-[36px]' : 'text-[24px]'} leading-[1.4]`}>{text}</span>
    : <span className={`${big ? 'text-[20px] sm:text-[24px]' : 'text-[17px]'} font-bold leading-snug break-words`}>{text}</span>;
