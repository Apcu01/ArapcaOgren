'use client';

import { useEffect } from 'react';

// Service worker yalnızca üretimde kaydedilir (geliştirmede sıcak yeniden yüklemeyle çakışmasın)
export default function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => null);
      return;
    }
    navigator.serviceWorker.register('/sw.js').catch(() => null);
  }, []);
  return null;
}

/** Tüm dersleri ve ana sayfaları çevrimdışı kullanım için önbelleğe al */
export async function precacheAll(onDone: (n: number, total: number) => void) {
  const reg = await navigator.serviceWorker?.ready;
  if (!reg?.active) return false;
  const r = await fetch('/api/offline-urls');
  const { urls } = (await r.json()) as { urls: string[] };
  const h = (e: MessageEvent) => {
    if (e.data?.type === 'precached') { onDone(e.data.count, e.data.total); navigator.serviceWorker.removeEventListener('message', h); }
  };
  navigator.serviceWorker.addEventListener('message', h);
  reg.active.postMessage({ type: 'precache', urls });
  return true;
}

export function clearPageCache() {
  navigator.serviceWorker?.controller?.postMessage({ type: 'clear-pages' });
}
