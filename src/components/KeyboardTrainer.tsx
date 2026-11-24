'use client';

/* Arapça klavye öğretici: tuşların yeri, harf harf yazma oyunu, hız ve doğruluk; en iyi sonuç bu cihazda saklanır */
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { advanceBy, charOf, KB_MODES, KB_ROWS, kbTargets, keyFor, type KbMode, type KKey } from '@/lib/keyboard';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

type Target = { text: string; tr?: string };
type Run = { mode: KbMode; targets: Target[]; i: number; pos: number; ok: number; bad: number; startedAt: number; endedAt: number };
type Best = { cpm: number; acc: number };

const BEST_KEY = 'arblearn:kb-best';
const readBest = (): Partial<Record<KbMode, Best>> => { try { return JSON.parse(localStorage.getItem(BEST_KEY) || '{}'); } catch { return {}; } };
const MARKS = /[ً-ْ]/;
/** Hareke tek başına görünmez: noktalı daire üstünde gösterilir */
const showChar = (c: string) => (MARKS.test(c) ? '◌' + c : c);
const isArabic = (s: string) => /[؀-ۿ]/.test(s);

export default function KeyboardTrainer() {
  const { toast } = useApp();
  const [run, setRun] = useState<Run | null>(null);
  const [hint, setHint] = useState(true);
  const [flash, setFlash] = useState<{ code: string; ok: boolean } | null>(null);
  const [best, setBest] = useState<Partial<Record<KbMode, Best>>>({});
  const [now, setNow] = useState(0);
  const runRef = useRef(run);
  runRef.current = run;
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => { setBest(readBest()); }, []);
  useEffect(() => {
    if (!run || run.endedAt || !run.startedAt) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [run]);

  const start = (mode: KbMode) => {
    setRun({ mode, targets: kbTargets(mode), i: 0, pos: 0, ok: 0, bad: 0, startedAt: 0, endedAt: 0 });
    setFlash(null);
    setTimeout(() => box.current?.focus({ preventScroll: false }), 50);
  };

  /** Yazılan karakter: doğruysa ilerler, yanlışsa sayılır (geri silme yok) */
  const type = useCallback((typed: string, code: string) => {
    const r = runRef.current;
    if (!r || r.endedAt) return;
    const t = r.targets[r.i];
    const step = advanceBy(t.text, r.pos, typed);
    const at = r.startedAt || Date.now();
    setFlash({ code, ok: step > 0 });
    if (!step) { setRun({ ...r, bad: r.bad + 1, startedAt: at }); return; }
    let i = r.i, pos = r.pos + step;
    if (pos >= t.text.length) { i++; pos = 0; }
    const done = i >= r.targets.length;
    const next = { ...r, i, pos, ok: r.ok + step, startedAt: at, endedAt: done ? Date.now() : 0 };
    setRun(next);
    if (done) {
      const mins = Math.max(1 / 60, (next.endedAt - at) / 60000);
      const cpm = Math.round(next.ok / mins), acc = next.ok / (next.ok + next.bad);
      const prev = readBest()[r.mode];
      // Rekor: doğruluğu %80 ve üstü olan en hızlı tur
      if (acc >= 0.8 && (!prev || cpm > prev.cpm)) {
        const all = { ...readBest(), [r.mode]: { cpm, acc } };
        try { localStorage.setItem(BEST_KEY, JSON.stringify(all)); } catch { /* yok */ }
        setBest(all);
        toast('Yeni rekor: dakikada ' + cpm + ' harf!');
      }
    }
  }, [toast]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const r = runRef.current;
      if (!r || r.endedAt || e.ctrlKey || e.metaKey || e.altKey) return;
      if ((e.target as HTMLElement).matches?.('input,textarea,select')) return;
      // Arapça klavye eklenmişse tarayıcı Arapça harfi verir; eklenmemişse fiziksel tuştan bulunur
      const typed = e.key.length <= 2 && isArabic(e.key) ? e.key : charOf(e.code, e.shiftKey);
      if (!typed) return;
      // Yakalama aşamasında çalışır ve olayı işaretler: sitenin kısayolları (h: harekeler, t: okunuş) tetiklenmez
      e.preventDefault();
      type(typed, e.code);
    };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [type]);
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 350);
    return () => clearTimeout(t);
  }, [flash]);

  const t = run && run.i < run.targets.length ? run.targets[run.i] : null;
  const expected = t ? (t.text.startsWith('لا', run!.pos) && run!.mode === 'alt' ? 'لا' : t.text[run!.pos]) : '';
  const target = expected ? keyFor(expected) : null;
  const elapsed = run?.startedAt ? ((run.endedAt || now || Date.now()) - run.startedAt) / 60000 : 0;
  const cpm = elapsed > 0.02 ? Math.round(run!.ok / elapsed) : 0;
  const acc = run && run.ok + run.bad ? Math.round((run.ok / (run.ok + run.bad)) * 100) : 100;

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-col gap-3 max-w-[760px]">
        <Link href="/alfabe" className="self-start inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><Raw html={I.back()} /> Alfabe</Link>
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Arapça klavye</span>
        <h1 className="m-0 text-[34px] sm:text-[42px] font-bold tracking-tight leading-tight">Arapça yazmayı öğren</h1>
        <p className="m-0 text-mute text-lg leading-relaxed">Standart Arapça (101) klavye düzeninde harflerin yerini adım adım çalış. Bilgisayarına Arapça klavye eklemesen de çalışır: tuşlara Türkçe klavyendeki yerlerinden basarsın. Telefonda tuşlara dokunarak çalışabilirsin.</p>
      </div>

      <section className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]" aria-label="Alıştırmalar">
        {KB_MODES.map((m) => {
          const b = best[m.id];
          return (
            <button key={m.id} type="button" onClick={() => start(m.id)}
              className={`cat text-left p-5 rounded-[18px] border flex flex-col gap-2 text-ink ${run?.mode === m.id ? 'bg-chip border-acc' : 'bg-s3 border-line'}`}>
              <span className="font-bold text-lg">{m.title}</span>
              <span className="text-sm text-mute2 leading-relaxed" dir="auto">{m.desc}</span>
              <span className="text-xs text-faint">{b ? `En iyi: dakikada ${b.cpm} harf · %${Math.round(b.acc * 100)}` : 'Henüz denemedin'}</span>
            </button>
          );
        })}
      </section>

      {run && (
        <section ref={box} tabIndex={-1} aria-label="Yazma alanı" className="outline-none flex flex-col gap-5 p-5 sm:p-7 rounded-[22px] bg-s1 border border-line">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="font-bold text-ink">{KB_MODES.find((m) => m.id === run.mode)!.title}</span>
            <span className="flex flex-wrap gap-2">
              {[['İlerleme', `${Math.min(run.i, run.targets.length)} / ${run.targets.length}`], ['Hız', cpm ? `${cpm} harf/dk` : '-'], ['Doğruluk', `%${acc}`], ['Yanlış', String(run.bad)]].map(([l, v]) => (
                <span key={l} className="px-3 py-1.5 rounded-full bg-s2 border border-line"><span className="text-faint">{l}</span> <b className="text-ink">{v}</b></span>
              ))}
            </span>
          </div>

          {t ? (
            <div className="flex flex-col items-center gap-2 py-4" aria-live="polite">
              <span className="text-xs font-semibold uppercase tracking-[.1em] text-lab">{run.mode === 'kelime' ? 'Bu kelimeyi yaz' : 'Bu harfi yaz'}</span>
              <span className="font-ar text-[72px] sm:text-[88px] leading-[1.25] text-ink" lang="ar" dir="rtl">
                {run.mode === 'kelime'
                  ? [...t.text].map((c, k) => <span key={k} className={k < run.pos ? 'text-okt' : k === run.pos ? 'text-acct underline decoration-4 underline-offset-[14px]' : 'text-faint'}>{c}</span>)
                  : showChar(t.text)}
              </span>
              {t.tr && <span className="text-mute">{t.tr}</span>}
              {hint && target && (
                <span className="text-sm text-soft">Tuş: <b className="text-ink">{target.shift ? 'Shift + ' : ''}{target.key.tr}</b></span>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-3 py-6">
              <span className="w-14 h-14 rounded-2xl bg-okbg border border-okln text-okt flex items-center justify-center"><Raw html={I.check(28)} /></span>
              <h2 className="m-0 text-2xl font-bold">Tur bitti</h2>
              <p className="m-0 text-mute">Dakikada <b className="text-ink">{cpm}</b> harf · doğruluk <b className="text-ink">%{acc}</b> · {run.bad} yanlış tuş</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button type="button" onClick={() => start(run.mode)} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2"><Raw html={I.refresh(17)} /> Tekrar</button>
                {run.mode !== 'kelime' && <button type="button" onClick={() => start('kelime')} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:text-ink">Kelimelere geç</button>}
              </div>
            </div>
          )}

          <Keyboard target={hint ? target : null} flash={flash} onKey={(k, shift) => { const c = shift ? k.sh : k.ar; if (c) type(c, k.code); }} />
          <label className="self-center flex items-center gap-2 text-sm text-soft cursor-pointer">
            <input type="checkbox" checked={hint} onChange={(e) => setHint(e.target.checked)} className="w-4 h-4 accent-[rgb(var(--c-acc))]" />
            Tuşu göster (ezberledikçe kapat)
          </label>
        </section>
      )}

      <details className="group p-5 rounded-2xl bg-s1 border border-line">
        <summary className="cursor-pointer font-bold text-ink list-none flex items-center justify-between gap-3">
          Bilgisayarına ya da telefonuna Arapça klavye nasıl eklenir?
          <span className="text-faint group-open:rotate-180 transition-transform"><Raw html={I.down(18)} /></span>
        </summary>
        <ul className="mt-4 mb-0 pl-5 flex flex-col gap-2 text-prose leading-relaxed">
          <li><b>Windows:</b> Ayarlar, Saat ve dil, Dil ve bölge, Dil ekle, Arapça. Dil listesinde Arapça'nın seçeneklerinden klavye olarak "Arapça (101)" seç. Klavyeler arasında <b>Windows tuşu + Boşluk</b> ile geçersin.</li>
          <li><b>Mac:</b> Sistem Ayarları, Klavye, Giriş Kaynakları, Düzenle, artı (+) düğmesi, Arapça. Geçiş için <b>Control + Boşluk</b> ya da Fn (küre) tuşu.</li>
          <li><b>Android (Gboard):</b> Gboard ayarları, Diller, Klavye ekle, Arapça. Boşluk tuşundaki küre simgesiyle geçersin.</li>
          <li><b>iPhone:</b> Ayarlar, Genel, Klavye, Klavyeler, Yeni Klavye Ekle, Arapça. Klavyedeki küre simgesiyle geçersin.</li>
        </ul>
        <p className="mt-3 mb-0 text-sm text-mute">Harekeleri (üstün, esre, ötre) Shift tuşuyla yazarsın; bu sayfadaki "Harekeler" alıştırması onları çalıştırır.</p>
      </details>
    </div>
  );
}

/** Ekrandaki klavye: hedef tuş yeşil kenarlı, basılan tuş kısa süre yeşil ya da kırmızı yanar; dokunarak da yazılır */
function Keyboard({ target, flash, onKey }: { target: { key: KKey; shift: boolean } | null; flash: { code: string; ok: boolean } | null; onKey: (k: KKey, shift: boolean) => void }) {
  const [shift, setShift] = useState(false);
  const shiftOn = shift || !!target?.shift;
  return (
    <div className="flex flex-col gap-1.5 select-none overflow-x-auto" dir="ltr" aria-label="Arapça klavye">
      {KB_ROWS.map((row, r) => (
        <div key={r} className="flex gap-1.5 justify-center" style={{ paddingLeft: r === 2 ? '1.2rem' : r === 3 ? '2.6rem' : 0 }}>
          {row.map((k) => {
            const isT = target?.key.code === k.code;
            const fl = flash?.code === k.code ? (flash.ok ? 'bg-okbg border-okln' : 'bg-badbg border-badln shake') : '';
            const label = shiftOn ? k.sh ?? '' : k.ar;
            return (
              <button key={k.code} type="button" onClick={() => onKey(k, shiftOn)} aria-label={`${k.tr} tuşu: ${label}`}
                className={`relative shrink-0 w-[46px] sm:w-[54px] h-[54px] sm:h-[60px] rounded-xl border flex items-center justify-center ${fl || (isT ? 'bg-chip border-acc ring-2 ring-acc/50' : 'bg-s3 border-line2')}`}>
                <span className="absolute left-1.5 top-1 text-[10px] font-bold text-faint">{k.tr}</span>
                <span className="font-ar text-[22px] sm:text-[24px] leading-none text-ink" lang="ar">{showChar(label)}</span>
              </button>
            );
          })}
        </div>
      ))}
      <div className="flex justify-center gap-1.5">
        <button type="button" aria-pressed={shift} onClick={() => setShift(!shift)} className={`h-11 px-5 rounded-xl border text-sm font-semibold ${shiftOn ? 'bg-acc text-onacc border-acc' : 'bg-s3 border-line2 text-soft'}`}>Shift</button>
      </div>
    </div>
  );
}
