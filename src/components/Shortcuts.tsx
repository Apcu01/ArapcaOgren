'use client';

/* Klavye kısayolları: "?" yardım penceresini açar, "g" ardından bir harf sayfaya gider,
   "/" sayfadaki arama kutusuna geçer, "h" harekeleri, "o" okunuşu açıp kapatır.
   Yazı yazılırken (kutu, metin alanı) ve etkinlik penceresi açıkken devre dışıdır. */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

export const GO: [string, string, string][] = [
  ['a', '/', 'Ana sayfa'],
  ['i', '/ilerleme', 'İlerlemem'],
  ['p', '/lig', 'Haftalık lig'],
  ['s', '/sozluk', 'Sözlük'],
  ['k', '/kelime-bul', 'Kelime bul'],
  ['o', '/okuma', 'Okuma'],
  ['l', '/listelerim', 'Listelerim'],
  ['c', '/siniflar', 'Sınıflarım'],
  ['y', '/canli', 'Yarışma'],
  ['f', '/alfabe', 'Alfabe'],
  ['h', '/hatalarim', 'Hatalarım']
];

const GENERAL: [string, string][] = [
  ['?', 'Bu pencereyi aç'],
  ['/', 'Sayfadaki arama kutusuna geç'],
  ['h', 'Harekeleri göster / gizle'],
  ['o', 'Okunuşu göster / gizle'],
  ['Esc', 'Pencereyi ya da menüyü kapat']
];
const IN_ACT: [string, string][] = [
  ['1 - 9', 'Seçeneği seç'],
  ['Enter', 'Kontrol et / devam et'],
  ['Boşluk', 'Sesi tekrar dinle (dinleme ve dikte)'],
  ['Esc', 'Etkinliği kapat']
];

export const OPEN_SHORTCUTS = 'arb:shortcuts';
const typing = (el: Element | null) => !!el && (el.matches('input, textarea, select, [contenteditable="true"]') || !!el.closest('[contenteditable="true"]'));

export default function Shortcuts() {
  const { settings, setSetting, toast } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pending = useRef<number>(0);
  const dlg = useRef<HTMLDivElement>(null);
  const s = useRef(settings);
  s.current = settings;

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_SHORTCUTS, show);
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
      if (typing(document.activeElement) || document.getElementById('player')) return;
      const k = e.key.toLocaleLowerCase('tr');
      if (Date.now() - pending.current < 1500) {
        pending.current = 0;
        const g = GO.find(([x]) => x === k);
        if (g) { e.preventDefault(); router.push(g[1]); }
        return;
      }
      if (e.key === '?') { e.preventDefault(); setOpen((o) => !o); return; }
      if (k === 'g') { pending.current = Date.now(); return; }
      if (e.key === '/') {
        const box = document.querySelector<HTMLInputElement>('#app input[type="search"], #app input[data-search]');
        if (box) { e.preventDefault(); box.focus(); box.select(); }
        return;
      }
      if (k === 'h') { setSetting('harakat', !s.current.harakat); toast(s.current.harakat ? 'Harekeler gizlendi.' : 'Harekeler gösteriliyor.'); return; }
      if (k === 'o') { setSetting('tl', !s.current.tl); toast(s.current.tl ? 'Okunuş gizlendi.' : 'Okunuş gösteriliyor.'); }
    };
    document.addEventListener('keydown', h);
    return () => { document.removeEventListener('keydown', h); window.removeEventListener(OPEN_SHORTCUTS, show); };
  }, [router, setSetting, toast]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    dlg.current?.focus();
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('keydown', k); prev?.focus?.(); };
  }, [open]);

  if (!open) return null;
  const Row = ({ k, l }: { k: string; l: string }) => (
    <li className="flex items-center justify-between gap-4 py-2 border-b border-line4 last:border-0">
      <span className="text-sm text-soft">{l}</span>
      <kbd className="shrink-0 min-w-[30px] h-7 px-2 rounded-md bg-s2 border border-line3 text-ink text-xs font-bold inline-flex items-center justify-center">{k}</kbd>
    </li>
  );
  return (
    <div className="fixed inset-0 z-[95] bg-black/60 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div ref={dlg} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="kisayol-baslik" className="w-full max-w-[640px] max-h-[88vh] overflow-y-auto p-6 rounded-2xl bg-s4 border border-line3 shadow-2xl outline-none flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <h2 id="kisayol-baslik" className="m-0 text-xl font-bold inline-flex items-center gap-2"><Raw html={I.keyboard(20)} /> Klavye kısayolları</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Kapat" className="w-10 h-10 rounded-full bg-chip border border-line3 text-ink inline-flex items-center justify-center hover:border-lineh"><Raw html={I.x(16)} /></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <section className="flex flex-col gap-1">
            <h3 className="m-0 text-xs font-bold tracking-[.1em] uppercase text-lab">Genel</h3>
            <ul className="m-0 p-0 list-none">{GENERAL.map(([k, l]) => <Row key={k + l} k={k} l={l} />)}</ul>
            <h3 className="m-0 mt-4 text-xs font-bold tracking-[.1em] uppercase text-lab">Etkinliklerde</h3>
            <ul className="m-0 p-0 list-none">{IN_ACT.map(([k, l]) => <Row key={k + l} k={k} l={l} />)}</ul>
          </section>
          <section className="flex flex-col gap-1">
            <h3 className="m-0 text-xs font-bold tracking-[.1em] uppercase text-lab">Sayfaya git: önce g, sonra</h3>
            <ul className="m-0 p-0 list-none">{GO.map(([k, , l]) => <Row key={k} k={k} l={l} />)}</ul>
          </section>
        </div>
        <p className="m-0 text-xs text-faint">Kısayollar bir kutuya yazı yazarken çalışmaz. Ayarlar menüsündeki "Canlandırmaları azalt", yazı boyutu ve ses hızı da erişilebilirlik içindir.</p>
      </div>
    </div>
  );
}
