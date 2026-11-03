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

export function clearPageCache() {
  navigator.serviceWorker?.controller?.postMessage({ type: 'clear-pages' });
}
