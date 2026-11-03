'use client';

/* Dikte (dinle ve yaz): kelime seslendirilir, kullanıcı duyduğunu Arapça harflerle ya da okunuşla yazar.
   Derslerde (etkinlik penceresinde) ve kelime listelerinde ortak kullanılır.
   Yanlış yazılan kelime sonda bir kez daha sorulur; sonuç ilk denemelere göre hesaplanır. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { gradeAr, type Grade } from '@/lib/study';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

export type DictItem = { id: string | number; ar: string; tl?: string; tr: string };
export type DictResult = { right: number; total: number; wrong: (DictItem & { given: string })[] };

/** Ekran klavyesi: Arapça klavyesi olmayanlar için (harekesiz yazmak yeterli) */
const KEYS = [
  'ض ص ث ق ف غ ع ه خ ح ج',
  'ش س ي ب ل ا ت ن م ك ط',
  'ء ر ى ة و ز ظ د ذ',
  'أ إ آ ؤ ئ'
].map((r) => r.split(' '));

type Step = DictItem & { retry: boolean };

export default function Dictation({ items, onAnswer, onProgress, onFinish }: {
  items: DictItem[];
  /** İlk denemedeki cevap (ilerleme ve hata kaydı için) */
  onAnswer?: (item: DictItem, ok: boolean) => void;
  onProgress?: (done: number, total: number) => void;
  onFinish: (r: DictResult) => void;
}) {
  const { speak, hasAudio, canSpeak, tx } = useApp();
  const [queue, setQueue] = useState<Step[]>(() => items.map((x) => ({ ...x, retry: false })));
  const [n, setN] = useState(0);
  const [val, setVal] = useState('');
  const [res, setRes] = useState<null | { g: Grade; given: string }>(null);
  const [hint, setHint] = useState(false);
  const [kb, setKb] = useState(false);
  const [voice, setVoice] = useState(true);
  const first = useRef({ right: 0, done: 0 });
  const wrong = useRef<DictResult['wrong']>([]);
  const input = useRef<HTMLInputElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const total = items.length;
  const cur = queue[0];

  // Ses kaydı da tarayıcı sesi de yoksa kelime dinletilemez: anlamı gösterilir, Arapçası istenir
  const audible = useMemo(() => !cur || hasAudio(cur.ar) || voice, [cur, hasAudio, voice]);
  const play = (slow = false) => { if (cur) speak(cur.ar, { slow }); };

  useEffect(() => { onProgress?.(first.current.done, total); }, [n]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!cur) return;
    setVoice(canSpeak());
    const t = setTimeout(() => { setVoice(canSpeak()); play(); input.current?.focus(); }, 300);
    return () => clearTimeout(t);
  }, [n]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (res) next.current?.focus(); }, [res]);
  // Boşluk: sesi tekrar çal (etkinlik penceresi bunu kendisi yapıyorsa olay işaretlenmiş gelir)
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key !== ' ' || e.defaultPrevented || (e.target as HTMLElement).matches?.('input,textarea,button,a')) return;
      const r = document.querySelector<HTMLButtonElement>('[data-replay]');
      if (r) { e.preventDefault(); r.click(); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);
  useEffect(() => {
    if (queue.length) return;
    onFinish({ right: first.current.right, total, wrong: wrong.current });
  }, [queue.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!cur) return null;

  function check(skip = false) {
    if (res || !cur) return;
    const given = skip ? '' : val.trim();
    if (!skip && !given) { input.current?.focus(); return; }
    const g: Grade = skip ? 'wrong' : gradeAr(given, { ar: cur.ar, tl: cur.tl || '' });
    const ok = g !== 'wrong';
    if (!cur.retry) {
      first.current.done++;
      if (ok) first.current.right++;
      else wrong.current.push({ ...cur, given });
      onAnswer?.(cur, ok);
    }
    if (!ok && !cur.retry) setQueue((q) => [...q, { ...q[0], retry: true }]);
    setRes({ g, given });
    if (!ok) play();
  }
  function go() {
    setRes(null); setVal(''); setHint(false);
    setQueue((q) => q.slice(1));
    setN((x) => x + 1);
  }
  function type(ch: string) {
    const el = input.current;
    if (!el) { setVal((v) => v + ch); return; }
    const s = el.selectionStart ?? val.length, e = el.selectionEnd ?? val.length;
    const v = val.slice(0, s) + ch + val.slice(e);
    setVal(v);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + ch.length, s + ch.length); });
  }
  function back() {
    const el = input.current;
    const s = el?.selectionStart ?? val.length, e = el?.selectionEnd ?? val.length;
    const from = s === e ? Math.max(0, s - 1) : s;
    setVal(val.slice(0, from) + val.slice(e));
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(from, from); });
  }

  const ok = res && res.g !== 'wrong';
  return (
    <div className="flex flex-col gap-6 pop" key={n}>
      {cur.retry && <span className="self-center px-3 py-1 rounded-full bg-progbg border border-progln text-prog text-xs font-bold">Tekrar soru</span>}
      {audible ? (
        <div className="flex flex-col items-center gap-3">
          <p className="m-0 text-mute text-center">Kelimeyi dinle, duyduğunu Arapça harflerle ya da okunuşuyla yaz.</p>
          <div className="flex items-center gap-3">
            <button type="button" data-replay onClick={() => play()} aria-label="Kelimeyi dinle" title="Dinle (Boşluk)"
              className="w-24 h-24 rounded-full bg-acc text-onacc flex items-center justify-center hover:brightness-110"><Raw html={I.speaker(40)} /></button>
            <button type="button" onClick={() => play(true)} aria-label="Yavaş dinle" title="Yavaş dinle"
              className="w-14 h-14 rounded-full bg-chip border border-line3 text-acct flex flex-col items-center justify-center hover:border-lineh text-[10px] font-bold gap-0.5"><Raw html={I.slow(18)} />Yavaş</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="m-0 text-sm text-faint max-w-[420px]">Bu kelimenin ses kaydı yok ve tarayıcında Arapça ses bulunamadı. Anlamına bakarak Arapçasını yaz.</p>
          <span className="text-[30px] font-bold text-ink">{cur.tr}</span>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); if (res) go(); else check(); }} className="flex flex-col gap-3">
        <input ref={input} value={val} onChange={(e) => setVal(e.target.value)} readOnly={!!res} maxLength={80} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
          dir={/[؀-ۿ]/.test(val) ? 'rtl' : 'ltr'} aria-label="Duyduğun kelime" placeholder="كتاب ya da kitâb"
          className={`h-16 px-4 rounded-2xl bg-s2 border text-ink text-[22px] text-center outline-none focus:border-acc ${res ? (ok ? 'border-okln' : 'border-badln') : 'border-line3'}`} />
        {!res && (
          <div className="flex flex-wrap gap-2 items-center">
            <button type="button" onClick={() => setKb(!kb)} aria-pressed={kb} className={`h-10 px-3.5 rounded-xl border text-sm font-semibold inline-flex items-center gap-2 ${kb ? 'border-acc text-acct bg-chip' : 'border-line3 text-soft bg-s2 hover:text-ink'}`}><Raw html={I.keyboard(16)} /> Arapça klavye</button>
            {audible && <button type="button" onClick={() => setHint(true)} disabled={hint} className="h-10 px-3.5 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:text-ink disabled:opacity-100 disabled:text-ink">{hint ? `Anlamı: ${cur.tr}` : 'İpucu: anlamı'}</button>}
            <span className="flex-1" />
            <button type="button" onClick={() => check(true)} className="h-11 px-4 rounded-xl text-soft font-semibold hover:text-ink">Bilmiyorum</button>
            <button type="submit" className="h-11 px-6 rounded-xl bg-acc text-onacc font-bold">Kontrol et</button>
          </div>
        )}
        {kb && !res && (
          <div dir="rtl" className="flex flex-col gap-1.5 p-2 rounded-2xl bg-s1 border border-line" aria-label="Arapça ekran klavyesi">
            {KEYS.map((row, i) => (
              <div key={i} className="flex justify-center gap-1.5">
                {row.map((k) => <button key={k} type="button" onClick={() => type(k)} className="ar flex-1 max-w-[46px] h-11 rounded-lg bg-s3 border border-line2 text-ink text-[22px] hover:border-lineh" lang="ar">{k}</button>)}
                {i === KEYS.length - 1 && (
                  <>
                    <button type="button" onClick={() => type(' ')} className="flex-[2] max-w-[120px] h-11 rounded-lg bg-s3 border border-line2 text-soft text-xs font-semibold">boşluk</button>
                    <button type="button" onClick={back} aria-label="Sil" className="flex-1 max-w-[60px] h-11 rounded-lg bg-s3 border border-line2 text-soft inline-flex items-center justify-center"><Raw html={I.back(18)} /></button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </form>

      <div aria-live="polite">
        {res && (
          <div className={`pop rounded-2xl p-5 flex flex-col gap-3 border ${ok ? 'bg-okbg border-okln' : 'bg-badbg border-badln'}`}>
            <span className={`flex items-center gap-2 font-bold text-lg ${ok ? 'text-okt' : 'text-bad'}`}>
              <Raw html={ok ? I.check(20) : I.x(20)} /> {res.g === 'right' ? 'Doğru!' : res.g === 'almost' ? 'Neredeyse! Küçük bir yazım farkı var.' : res.given ? 'Yanlış' : 'Doğru cevap'}
            </span>
            <div className="flex items-center gap-4 flex-wrap">
              <Raw html={tx.ar(cur.ar, 'text-[40px] text-ink')} />
              <span className="flex flex-col">
                {cur.tl && <span className="tl text-mute">{cur.tl}</span>}
                <span className="text-soft font-semibold">{cur.tr}</span>
              </span>
            </div>
            {!ok && res.given && <span className="text-sm text-mute">Senin yazdığın: <span dir="auto" className="text-ink font-semibold">{res.given}</span></span>}
            {!ok && !cur.retry && <span className="text-xs text-faint">Bu kelimeyi sonda tekrar soracağız.</span>}
            <div className="flex justify-end"><button ref={next} type="button" data-next onClick={go} className="h-12 px-7 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">Devam <Raw html={I.arrow()} /></button></div>
          </div>
        )}
      </div>
    </div>
  );
}
