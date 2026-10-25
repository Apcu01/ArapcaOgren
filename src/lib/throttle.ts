import 'server-only';
import { NextResponse } from 'next/server';
import { clientIp } from './ratelimit';

/* Herkese açık uç noktalar için IP başına basit hız sınırı (sunucu belleğinde, veritabanına yük bindirmez).
   Okul ve ev ağlarında birçok kişi aynı IP ile çıkar; sınırlar böyle bir sınıfın (40 kişiye kadar) rahat kullanımına göre
   ayarlıdır. Amaç, bir betikle sürekli istek gönderilip sayıların şişirilmesini ya da sunucunun yorulmasını önlemek. */
type Win = { n: number; reset: number };
const g = globalThis as unknown as { __arbThrottle?: Map<string, Win> };
const store = (g.__arbThrottle ??= new Map());

export const LIMITS = {
  metrics: { max: 300, windowMs: 60_000 },
  presence: { max: 400, windowMs: 60_000 },
  events: { max: 1500, windowMs: 60_000 },
  lookup: { max: 300, windowMs: 60_000 }
} as const;

/** Sınır aşıldıysa 429 yanıtı, aşılmadıysa null döner */
export function throttle(kind: keyof typeof LIMITS, req: Request) {
  const { max, windowMs } = LIMITS[kind];
  const key = kind + ':' + clientIp(req);
  const now = Date.now();
  const w = store.get(key);
  if (!w || now >= w.reset) store.set(key, { n: 1, reset: now + windowMs });
  else if (++w.n > max) {
    return NextResponse.json({ error: 'Çok fazla istek. Biraz bekleyip tekrar dene.' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((w.reset - now) / 1000)) } });
  }
  // Ara sıra süresi dolanları temizle
  if (store.size > 5000) for (const [k, x] of store) if (now >= x.reset) store.delete(k);
  return null;
}
