'use client';

/* Çevrimdışı kullanım: bağlantı yokken üstte uyarı şeridi ve "Çevrimdışı kullanım" penceresi
   (dersler ve sayfalar, kelime sesleri, ders anlatımı sesleri, kişisel listeler; indirme ilerlemesi, kullanılan alan, silme) */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';
import { outboxSize } from '@/lib/outbox';

export const OPEN_OFFLINE = 'arb:offline';
type Plan = { pages: string[]; audio: { urls: string[]; bytes: number }; narration: { urls: string[]; bytes: number }; lists: { urls: string[]; count: number } };
type Part = 'pages' | 'audio' | 'narration' | 'lists';
const DONE_KEY = 'arblearn:offline-done';
const mb = (b: number) => (b / 1048576).toLocaleString('tr-TR', { maximumFractionDigits: b > 10 * 1048576 ? 0 : 1 }) + ' MB';

/** Service worker'a indirme işi gönderir; ilerleme bildirir, bitince indirilen sayıyı döner */
async function runJob(urls: string[], kind: 'pages' | 'static', onProgress: (done: number, total: number) => void) {
  const reg = await navigator.serviceWorker?.ready.catch(() => null);
  const active = reg?.active;
  if (!active) return -1;
  return new Promise<number>((resolve) => {
    const id = Math.random().toString(36).slice(2);
    const h = (e: MessageEvent) => {
      if (e.data?.id !== id) return;
      if (e.data.type === 'precache-progress') onProgress(e.data.done, e.data.total);
      if (e.data.type === 'precached') { navigator.serviceWorker.removeEventListener('message', h); onProgress(e.data.total, e.data.total); resolve(e.data.count); }
    };
    navigator.serviceWorker.addEventListener('message', h);
    active.postMessage({ type: 'precache', id, urls, kind });
  });
}

export function OfflineBanner() {
  const { online, user } = useApp();
  const [queued, setQueued] = useState(0);
  useEffect(() => {
    const up = () => setQueued(outboxSize(user?.id ?? -1));
    up();
    window.addEventListener('arb:outbox', up);
    return () => window.removeEventListener('arb:outbox', up);
  }, [user, online]);
  if (online) return null;
  return (
    <div role="status" className="sticky top-0 z-[60] px-4 py-2.5 bg-progbg border-b border-progln text-prog text-sm font-semibold flex items-center justify-center gap-2 text-center">
      <Raw html={I.wifiOff(16)} />
      <span>Çevrimdışısın. İndirdiğin ve daha önce açtığın sayfalar çalışır{user ? `; çalışmaların bağlantı gelince hesabına kaydedilecek${queued ? ` (${queued} kayıt bekliyor)` : ''}` : ''}.</span>
    </div>
  );
}

export function OfflineDialog() {
  const { user, toast } = useApp();
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [pick, setPick] = useState<Record<Part, boolean>>({ pages: true, audio: true, narration: false, lists: true });
  const [prog, setProg] = useState<{ part: Part; done: number; total: number } | null>(null);
  const [usage, setUsage] = useState<number | null>(null);
  const [doneAt, setDoneAt] = useState<string | null>(null);
  const [sw, setSw] = useState(true);
  const dlg = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => { navigator.storage?.estimate?.().then((e) => setUsage(e.usage ?? null)).catch(() => null); }, []);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_OFFLINE, show);
    return () => window.removeEventListener(OPEN_OFFLINE, show);
  }, []);
  useEffect(() => {
    if (!open) return;
    dlg.current?.focus();
    setSw(!!navigator.serviceWorker?.controller);
    try { setDoneAt(localStorage.getItem(DONE_KEY)); } catch { /* yok */ }
    measure();
    fetch('/api/offline-urls', { cache: 'no-store' }).then((r) => r.json()).then(setPlan).catch(() => setPlan(null));
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && !prog) setOpen(false); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open, measure, prog, user]);

  async function download() {
    if (!plan) return;
    const parts: [Part, string[], 'pages' | 'static'][] = [];
    if (pick.pages) parts.push(['pages', plan.pages, 'pages']);
    if (pick.lists && plan.lists.urls.length) parts.push(['lists', plan.lists.urls, 'pages']);
    if (pick.audio) parts.push(['audio', plan.audio.urls, 'static']);
    if (pick.narration) parts.push(['narration', plan.narration.urls, 'static']);
    let ok = 0, all = 0;
    for (const [part, urls, kind] of parts) {
      setProg({ part, done: 0, total: urls.length });
      const n = await runJob(urls, kind, (done, total) => setProg({ part, done, total }));
      if (n < 0) { setProg(null); toast('Çevrimdışı kullanım için siteyi yayındaki adresinden (https) bir kez açman gerekir.'); return; }
      ok += n; all += urls.length;
    }
    setProg(null);
    const at = new Date().toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
    try { localStorage.setItem(DONE_KEY, at); } catch { /* yok */ }
    setDoneAt(at);
    measure();
    toast(ok === all ? 'İndirme bitti. Seçtiklerin artık internetsiz de açılır.' : `${ok} / ${all} dosya indirildi. Kalanlar için bağlantı gelince tekrar dene.`);
  }
  async function clearAll() {
    if (!confirm('İndirilen bütün sayfalar ve sesler bu cihazdan silinsin mi? İlerlemen silinmez.')) return;
    const reg = await navigator.serviceWorker?.ready.catch(() => null);
    reg?.active?.postMessage({ type: 'clear-all' });
    try { localStorage.removeItem(DONE_KEY); } catch { /* yok */ }
    setDoneAt(null);
    setTimeout(measure, 600);
    toast('Çevrimdışı veriler silindi.');
  }

  if (!open) return null;
  const row = (k: Part, title: string, hint: string, disabled = false) => (
    <label className={`flex items-start gap-3 p-3 rounded-xl border ${pick[k] && !disabled ? 'bg-s3 border-line3' : 'bg-s1 border-line'} ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
      <input type="checkbox" checked={pick[k] && !disabled} disabled={disabled || !!prog || k === 'pages'} onChange={(e) => setPick((p) => ({ ...p, [k]: e.target.checked }))} className="mt-1 w-5 h-5 accent-acc" />
      <span className="flex flex-col"><span className="font-semibold text-ink">{title}</span><span className="text-xs text-mute2">{hint}</span></span>
    </label>
  );
  const LABEL: Record<Part, string> = { pages: 'Dersler ve sayfalar', lists: 'Listelerim', audio: 'Kelime sesleri', narration: 'Ders anlatımı sesleri' };

  return (
    <div className="fixed inset-0 z-[95] bg-black/60 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget && !prog) setOpen(false); }}>
      <div ref={dlg} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="cevrimdisi-baslik" className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-s4 border border-line3 shadow-2xl outline-none flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="cevrimdisi-baslik" className="m-0 text-xl font-bold inline-flex items-center gap-2"><Raw html={I.download(20)} /> Çevrimdışı kullanım</h2>
          <button type="button" disabled={!!prog} onClick={() => setOpen(false)} aria-label="Kapat" className="w-10 h-10 rounded-full bg-chip border border-line3 text-ink inline-flex items-center justify-center hover:border-lineh disabled:opacity-40"><Raw html={I.x(16)} /></button>
        </div>
        <p className="m-0 text-sm text-mute leading-relaxed">Seçtiklerini bu cihaza indir; internet yokken de dersleri okuyup etkinlikleri çözebilirsin.{user ? ' Çevrimdışıyken yaptıkların bağlantı gelince hesabına kaydedilir.' : ' İlerlemen bu tarayıcıda saklanır.'}</p>
        {!sw && <p className="m-0 p-3 rounded-xl bg-progbg border border-progln text-prog text-sm">Çevrimdışı kullanım, site yayındaki adresinden (https) açıldığında çalışır. Sayfayı yenileyip tekrar dene.</p>}
        {!plan ? <p className="m-0 text-mute text-sm">Hazırlanıyor</p> : (
          <div className="flex flex-col gap-2">
            {row('pages', 'Dersler ve sayfalar', `${plan.pages.length} sayfa: dersler, okuma metinleri, sözlük, hazır listeler (her zaman indirilir)`)}
            {row('lists', 'Listelerim', user ? (plan.lists.count ? `Son çalıştığın ${plan.lists.count} liste ve bütün çalışma modları` : 'Henüz listen yok') : 'Giriş yapınca kendi listelerin de indirilebilir', !user || !plan.lists.count)}
            {row('audio', 'Kelime sesleri', `${plan.audio.urls.length} kayıt, yaklaşık ${mb(plan.audio.bytes)}`)}
            {row('narration', 'Ders anlatımı sesleri', `${plan.narration.urls.length} kayıt, yaklaşık ${mb(plan.narration.bytes)}`)}
          </div>
        )}
        {prog && (
          <div className="flex flex-col gap-1.5" role="status">
            <span className="flex justify-between text-sm"><span className="text-soft font-semibold">{LABEL[prog.part]} indiriliyor</span><span className="text-faint">{prog.done} / {prog.total}</span></span>
            <span className="h-2 rounded-full bg-track overflow-hidden"><span className="block h-full rounded-full bg-acc transition-all" style={{ width: Math.round((prog.done / Math.max(1, prog.total)) * 100) + '%' }} /></span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={download} disabled={!plan || !!prog || !sw} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50 inline-flex items-center gap-2"><Raw html={I.download(16)} /> {prog ? 'İndiriliyor' : doneAt ? 'Güncelle' : 'İndir'}</button>
          <button type="button" onClick={clearAll} disabled={!!prog || !sw} className="h-11 px-4 rounded-xl text-soft font-semibold hover:text-bad disabled:opacity-40">İndirilenleri sil</button>
        </div>
        <p className="m-0 text-xs text-faint">
          {doneAt ? `Son indirme: ${doneAt}. ` : ''}{usage != null ? `Bu sitenin cihazında kullandığı alan: ${mb(usage)}.` : ''} Dersler güncellenince indirmeyi yenilemek için tekrar "Güncelle"ye bas.
        </p>
      </div>
    </div>
  );
}
