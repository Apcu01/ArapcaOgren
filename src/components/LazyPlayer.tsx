'use client';

import { useEffect, useState, type ComponentProps } from 'react';

/* Etkinlik motoru (bütün etkinlik türleri, sınırsız pratik soru üreticisi, dikte, telaffuz) ders sayfasındaki
   kodun yaklaşık yarısıydı ve sayfa açılırken indirilip çalıştırılıyordu. Etkinlik ancak bir düğmeye basılınca
   açıldığı için artık sayfa açıldıktan sonra, tarayıcı boşta kalınca arka planda indirilir.
   next/dynamic (Suspense) kullanılmaz: kod hazır olsa bile React içeriği ~300 ms geciktiriyordu (ölçüldü).
   Burada kod hazırsa etkinlik ilk çizimde açılır, değilse gelene kadar bekleme ekranı görünür. */
type Mod = typeof import('./Player');
let mod: Mod | null = null;
let pending: Promise<Mod> | null = null;

/** Etkinlik kodunu bir kez indirir; olmazsa (ör. bağlantı koptu) sonraki çağrı yeniden dener */
export function preloadPlayer() {
  pending ??= import('./Player').then(
    (m) => (mod = m),
    (e) => { pending = null; throw e; }
  );
  return pending;
}

/** Sayfa açıldıktan sonra etkinlik kodunu önceden indirir: etkinliğe basınca beklemeden açılır */
export function usePreloadPlayer() {
  useEffect(() => {
    if (mod) return;
    const load = () => { preloadPlayer().catch(() => null); };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(load, 1500);
    return () => clearTimeout(t);
  }, []);
}

export default function Player(props: ComponentProps<Mod['default']>) {
  const [m, setM] = useState<Mod | null>(mod);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (m) return;
    let live = true;
    preloadPlayer().then((x) => { if (live) setM(x); }, () => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [m]);
  if (m) return <m.default {...props} />;
  return (
    <div className="fixed inset-0 z-[80] bg-bg flex flex-col items-center justify-center gap-4 p-6 text-center" role="status" aria-live="polite">
      <span className="text-mute">{failed ? 'Etkinlik yüklenemedi. Bağlantını kontrol edip tekrar dene.' : 'Etkinlik hazırlanıyor'}</span>
      {failed && <button type="button" onClick={props.onClose} className="h-11 px-5 rounded-xl border border-line3 text-soft font-semibold hover:text-ink">Kapat</button>}
    </div>
  );
}
