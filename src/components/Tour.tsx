'use client';

/* Tanıtım turu: siteye ilk kez gelen ziyaretçiye ana sayfada bir kez gösterilen 4 adımlık kısa tanıtım.
   İlerlemesi olan (siteyi zaten kullanan) ziyaretçiye gösterilmez; Yenilikler sayfasındaki "Siteyi tanı" düğmesiyle her zaman açılır. */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

export const OPEN_TOUR = 'arb:tour';
const KEY = 'arblearn:tour';

const STEPS: { icon: keyof typeof I; title: string; text: string }[] = [
  { icon: 'book', title: 'Hoş geldin!', text: 'Burada Arapçayı Türkçe anlatımla adım adım öğrenirsin. Her derste kısa bir konu anlatımı, sesli öğretmen anlatımı ve sesli örnekler var. Kategoriler sayfasından ilk dersini seç.' },
  { icon: 'rocket', title: 'Etkinlikler ve sınırsız pratik', text: "Kartlar, eşleştirme ve boşluk doldurmayla pekiştir. Sınırsız pratikte sorular bitmez. Yanlış yaptığın sorular Hatalarım'da toplanır; doğru cevaplayınca listeden düşer." },
  { icon: 'search', title: 'Kelime bul ve Sözlük', text: "Bilmediğin bir Arapça kelimeyi Kelime bul'a yaz: anlamını, kökünü ve örnek cümlesini gör. Sözlükte derslerdeki bütün kelimeler sesli. Türkçedeki Arapça kelimeler sayfasında bildiğin kelimelerin aslını bulursun." },
  { icon: 'list', title: 'Listelerin ve yarışmalar', text: 'Kendi kelime listeni oluşturup kartlar ve testlerle çalışabilir, sınıfınla canlı yarışma açabilirsin. İlerlemen bu tarayıcıda saklanır; hesap açarsan her cihazda seninle olur.' }
];

export default function Tour() {
  const { ready, session, state, user } = useApp();
  const path = usePathname();
  const [step, setStep] = useState<number | null>(null);
  const dlg = useRef<HTMLDivElement>(null);
  const decided = useRef(false);

  useEffect(() => {
    const open = () => setStep(0);
    window.addEventListener(OPEN_TOUR, open);
    return () => window.removeEventListener(OPEN_TOUR, open);
  }, []);

  // İlk ziyaret: ilerleme yüklendikten sonra, yalnızca ana sayfada, sayfa açılışında bir kez karar verilir.
  // "Görüldü" kaydı pencere kapatılınca yazılır: kullanıcı görmeden sayfa yenilenirse tanıtım yine çıkar.
  // Otomasyon tarayıcılarında (uçtan uca testler) kendiliğinden açılmaz; testler Yenilikler sayfasındaki düğmeyle açar.
  useEffect(() => {
    if (decided.current || !ready || session === 'loading' || path !== '/') return;
    decided.current = true;
    try {
      if (localStorage.getItem(KEY)) return;
      const fresh = !state.days.length && !Object.keys(state.progress).length;
      if (!fresh) localStorage.setItem(KEY, 'skip');
      else if (!navigator.webdriver) setStep(0);
    } catch { /* depolama kapalı: her açılışta göstermemek için hiç gösterme */ }
  }, [ready, session, path, state]);

  const close = () => {
    setStep(null);
    try { localStorage.setItem(KEY, 'shown'); } catch { /* depolama kapalı */ }
  };

  const open = step !== null;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setStep(null); try { localStorage.setItem(KEY, 'shown'); } catch { /* yok */ } } };
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('keydown', k); prev?.focus?.(); };
  }, [open]);
  useEffect(() => { if (open) dlg.current?.focus(); }, [open, step]);

  if (step === null) return null;
  const s = STEPS[step];
  const last = step === STEPS.length - 1;
  return (
    <div className="fixed inset-0 z-[95] bg-black/60 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div ref={dlg} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tur-baslik" aria-describedby="tur-metin"
        className="pop w-full max-w-[460px] p-6 sm:p-7 rounded-2xl bg-s4 border border-line3 shadow-2xl outline-none flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <span className="w-14 h-14 rounded-2xl bg-chip border border-chipln text-acct flex items-center justify-center"><Raw html={I[s.icon](26)} /></span>
          <button type="button" onClick={close} className="h-9 px-3 rounded-lg text-sm font-semibold text-faint hover:text-ink">Atla</button>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-[.1em] uppercase text-lab">Tanıtım · {step + 1} / {STEPS.length}</span>
          <h2 id="tur-baslik" className="m-0 text-2xl font-bold">{s.title}</h2>
          <p id="tur-metin" className="m-0 text-soft leading-relaxed">{s.text}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            {STEPS.map((_, i) => <span key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-acc' : 'w-2 bg-track'}`} />)}
          </span>
          <span className="flex gap-2">
            {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh hover:text-ink">Geri</button>}
            <button type="button" onClick={() => (last ? close() : setStep(step + 1))} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">
              {last ? 'Başla' : <>İleri <Raw html={I.arrow(16)} /></>}
            </button>
          </span>
        </div>
        {last && !user && <p className="m-0 -mt-1 text-sm text-mute">İlerlemeni kaybetmemek için <Link href="/kayit" onClick={close}>hesap açabilirsin</Link>.</p>}
      </div>
    </div>
  );
}
