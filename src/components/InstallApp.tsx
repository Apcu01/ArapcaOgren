'use client';

/* "Uygulamayı yükle" düğmesi: Android ve bilgisayarda (Chrome, Edge) tarayıcının yükleme penceresini açar,
   iPhone ve iPad'de bu pencere olmadığı için Ana Ekrana Ekle adımlarını gösterir.
   Uygulama zaten yüklüyse ya da tarayıcı desteklemiyorsa hiçbir şey göstermez. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
export type InstallMode = 'prompt' | 'ios' | 'none';

// Tarayıcı bu olayı sayfa açılır açılmaz gönderebilir; bileşenler yüklenmeden kaçırmamak için modül yüklenince dinlenir
let deferred: PromptEvent | null = null;
let installed = false;
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e as PromptEvent; notify(); });
  window.addEventListener('appinstalled', () => { deferred = null; installed = true; notify(); });
}

function standalone() {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}
function isIos() {
  // iPadOS kendini Mac olarak tanıtır; dokunmatik ekran ayırt eder
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function mode(): InstallMode {
  if (installed || standalone()) return 'none';
  if (deferred) return 'prompt';
  return isIos() ? 'ios' : 'none';
}

export function useInstall() {
  const m = useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, mode, () => 'none' as InstallMode);
  const [help, setHelp] = useState(false);
  const { toast } = useApp();
  async function install() {
    if (m === 'ios') { setHelp(true); return; }
    const e = deferred;
    if (!e) return;
    await e.prompt();
    const { outcome } = await e.userChoice;
    // Olay yalnızca bir kez kullanılabilir
    deferred = null;
    notify();
    if (outcome === 'accepted') toast('Uygulama yükleniyor. Ana ekrandan açabilirsin.');
  }
  return { mode: m, install, help, closeHelp: () => setHelp(false) };
}

/** Menülerde kullanılan düğme */
export function InstallButton({ className = '' }: { className?: string }) {
  const { mode: m, install, help, closeHelp } = useInstall();
  if (m === 'none') return null;
  return (
    <>
      <button type="button" onClick={install} className={className}>
        <Raw html={I.phone(17)} /> Uygulamayı yükle
      </button>
      {help && <IosHelp onClose={closeHelp} />}
    </>
  );
}

const HIDE_KEY = 'arblearn:install-hidden';

/** Ana sayfadaki kart: yalnızca telefon ve tablette, kapatılınca bir daha gösterilmez */
export function InstallCard() {
  const { mode: m, install, help, closeHelp } = useInstall();
  const [show, setShow] = useState(false);
  useEffect(() => {
    let hidden = false;
    try { hidden = localStorage.getItem(HIDE_KEY) === '1'; } catch { /* depolama kapalı */ }
    setShow(!hidden && window.matchMedia('(pointer: coarse)').matches);
  }, []);
  if (m === 'none' || !show) return null;
  function hide() {
    setShow(false);
    try { localStorage.setItem(HIDE_KEY, '1'); } catch { /* depolama kapalı */ }
  }
  return (
    <section aria-label="Uygulama" className="relative flex items-start gap-4 p-5 pr-12 rounded-2xl bg-s1 border border-line">
      <span className="w-11 h-11 shrink-0 rounded-xl bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={I.phone(20)} /></span>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="font-bold">Uygulama olarak kullan</span>
        <span className="text-sm text-mute2 leading-relaxed">Ana ekrana ekle, tek dokunuşla aç. İndirdiğin dersler internetsiz de açılır.</span>
        <button type="button" onClick={install} className="self-start mt-2 h-10 px-5 rounded-xl bg-acc text-onacc text-sm font-bold">Yükle</button>
      </div>
      <button type="button" onClick={hide} aria-label="Kapat" className="absolute top-2 right-2 w-9 h-9 rounded-full text-faint hover:text-ink flex items-center justify-center" dangerouslySetInnerHTML={{ __html: I.x(15) }} />
      {help && <IosHelp onClose={closeHelp} />}
    </section>
  );
}

function IosHelp({ onClose }: { onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>('button')?.focus();
    return () => prev?.focus();
  }, []);
  const steps: [string, string, string][] = [
    ['1', I.share(18), 'Tarayıcının alt ya da üst çubuğundaki Paylaş düğmesine dokun.'],
    ['2', I.addBox(18), '"Ana Ekrana Ekle" seçeneğine dokun. Görünmüyorsa listeyi aşağı kaydır.'],
    ['3', I.check(18), 'Sağ üstteki "Ekle" düğmesine dokun. ArapcaOgren ana ekranında görünür.']
  ];
  return (
    <div className="fixed inset-0 z-[95] bg-black/60 flex items-end sm:items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Escape') onClose(); }}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="ios-h" className="pop w-full max-w-[420px] rounded-3xl bg-s4 border border-line3 shadow-2xl p-6 flex flex-col gap-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <h2 id="ios-h" className="m-0 text-xl font-bold text-ink">Ana ekrana ekle</h2>
          <button type="button" onClick={onClose} aria-label="Kapat" className="w-10 h-10 shrink-0 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh" dangerouslySetInnerHTML={{ __html: I.x(16) }} />
        </div>
        <ol className="m-0 p-0 list-none flex flex-col gap-3">
          {steps.map(([n, icon, t]) => (
            <li key={n} className="flex items-center gap-3">
              <span className="w-9 h-9 shrink-0 rounded-full bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={icon} /></span>
              <span className="text-[15px] text-soft leading-relaxed">{t}</span>
            </li>
          ))}
        </ol>
        <button type="button" onClick={onClose} className="h-11 rounded-xl bg-acc text-onacc font-bold">Tamam</button>
      </div>
    </div>
  );
}
