'use client';

import { useEffect } from 'react';

// Service worker yalnızca üretimde kaydedilir (geliştirmede sıcak yeniden yüklemeyle çakışmasın).
// Geliştirmede çevrimdışı ve bildirim denemesi için: localStorage.setItem('arblearn:sw-dev', '1')
export default function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let devOn = false;
    try { devOn = localStorage.getItem('arblearn:sw-dev') === '1'; } catch { /* yok */ }
    if (process.env.NODE_ENV !== 'production' && !devOn) {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => null);
      return;
    }
    navigator.serviceWorker.register('/sw.js').catch(() => null);
  }, []);
  return null;
}

export function clearPageCache() {
  navigator.serviceWorker?.controller?.postMessage({ type: 'clear-pages' });
}
