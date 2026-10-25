'use client';

/* Sayfa geçişlerinde üstte ince ilerleme çubuğu: bağlantıya tıklanır tıklanmaz görünür, yeni sayfa gelince tamamlanır.
   Yükleme iskeleti (loading.tsx) yerine bu kullanılır: iskelet, React'in görsel titremeyi önlemek için içeriği geciktirmesine
   yol açıyordu (ölçüm: içerik ~200 ms yerine ~800 ms). Çubuk içeriği hiç geciktirmez. */
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

function Bar() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Site içi bağlantıya tıklanınca başla
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // aynı sayfa ya da yalnızca #bağlantı
      clearTimeout(timer.current);
      setState('loading');
      // Gezinme olmazsa (ör. hata) çubuk takılı kalmasın
      timer.current = setTimeout(() => setState('idle'), 8000);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Adres değişince tamamla
  useEffect(() => {
    setState((s) => (s === 'loading' ? 'done' : s));
  }, [pathname, search]);
  useEffect(() => {
    if (state !== 'done') return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 350);
  }, [state]);

  if (state === 'idle') return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none" aria-hidden="true">
      <div
        className="h-full bg-acc shadow-[0_0_8px_rgb(var(--c-acc))]"
        style={state === 'loading'
          ? { width: '80%', transition: 'width 2.5s cubic-bezier(.1,.6,.2,1)' }
          : { width: '100%', opacity: 0, transition: 'width .15s ease, opacity .3s ease .15s' }}
        ref={(el) => {
          // Başlangıçta %0'dan büyüsün
          if (el && state === 'loading' && !el.dataset.started) { el.dataset.started = '1'; el.style.width = '0%'; void el.offsetWidth; el.style.width = '80%'; }
        }}
      />
    </div>
  );
}

export default function NavProgress() {
  return <Suspense fallback={null}><Bar /></Suspense>;
}
