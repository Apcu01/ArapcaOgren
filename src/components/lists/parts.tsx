'use client';

/* Kelime listesi modlarının ortak parçaları: kelime yüzü, çoktan seçmeli ve yazılı soru */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Ar, SayBtn, useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { answerOf, grade, type Grade, type ListItem, type McQ, type Side, type WriteQ } from '@/lib/study';

export function LoginNeeded({ what = 'Kelime listeleri' }: { what?: string }) {
  return (
    <div className="max-w-[560px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
      <span className="w-14 h-14 rounded-2xl bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={I.list(24)} /></span>
      <h1 className="m-0 text-[28px] font-bold">{what} için giriş yap</h1>
      <p className="m-0 text-mute leading-relaxed">Kendi kelime listelerini oluşturup kartlarla, testlerle ve oyunlarla çalışabilirsin. Listelerin hesabında saklanır, her cihazdan devam edersin.</p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/giris" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Giriş yap</Link>
        <Link href="/kayit" className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-ink font-semibold inline-flex items-center hover:text-ink hover:border-lineh">Hesap aç</Link>
      </div>
      <Link href="/hazir-listeler" className="text-sm font-semibold">Hesapsız da göz at: hazır kelime listeleri</Link>
    </div>
  );
}

export function Missing() {
  return (
    <div className="max-w-[560px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
      <h1 className="m-0 text-[28px] font-bold">Liste bulunamadı</h1>
      <p className="m-0 text-mute">Bu liste silinmiş ya da başka bir hesaba ait olabilir.</p>
      <Link href="/listelerim" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Listelerime dön</Link>
    </div>
  );
}

export function Loading() {
  return <div className="max-w-[1000px] mx-auto px-4 py-20 text-center text-mute" role="status">Yükleniyor</div>;
}

/** Kelimenin bir yüzü: Arapça (okunuşuyla) ya da Türkçe anlam */
export function Face({ item, side, size = 'md', say = false }: { item: ListItem; side: Side; size?: 'sm' | 'md' | 'lg'; say?: boolean }) {
  if (side === 'tr') {
    const cls = size === 'lg' ? 'text-[28px] sm:text-[34px]' : size === 'md' ? 'text-[22px]' : 'text-[16px]';
    return <span className={`${cls} font-semibold text-ink leading-snug break-words`}>{item.tr}</span>;
  }
  const cls = size === 'lg' ? 'text-[44px] sm:text-[56px]' : size === 'md' ? 'text-[32px]' : 'text-[22px]';
  return (
    <span className="inline-flex flex-col items-center gap-1">
      <span className="inline-flex items-center gap-3">
        <Ar t={item.ar} className={`${cls} leading-[1.5] text-ink`} />
        {say && <SayBtn text={item.ar} />}
      </span>
      {item.tl && <span className={`tl text-mute ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>{item.tl}</span>}
    </span>
  );
}

/** Seçenek içeriği: Arapça seçenekte okunuş gösterilmez (cevabı ele vermesin) */
function OptText({ item, side }: { item: ListItem; side: Side }) {
  return side === 'tr' ? <span className="text-[16px] font-semibold">{item.tr}</span> : <Ar t={item.ar} className="text-[24px] leading-[1.4]" />;
}

const promptLabel = (dir: Side) => (dir === 'ar' ? 'Anlamı ne?' : 'Arapçası hangisi?');

/** Çoktan seçmeli soru. onAnswer cevap verildiğinde bir kez, onNext devam edilince çağrılır */
export function McQuestion({ q, onAnswer, onNext, autoNext = true }: { q: McQ; onAnswer: (ok: boolean) => void; onNext: () => void; autoNext?: boolean }) {
  const [pick, setPick] = useState<number | null>(null);
  const ansSide: Side = q.dir === 'ar' ? 'tr' : 'ar';
  const done = pick !== null;
  const ok = pick === q.item.id;
  const choose = (id: number) => {
    if (done) return;
    setPick(id);
    const right = id === q.item.id;
    onAnswer(right);
    if (right && autoNext) setTimeout(onNext, 800);
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      const n = Number(e.key);
      if (!done && n >= 1 && n <= q.options.length) choose(q.options[n - 1].id);
      else if (done && e.key === 'Enter') onNext();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-lab">{q.dir === 'ar' ? 'Arapça' : 'Türkçe'} · {promptLabel(q.dir)}</span>
        <div className={q.dir === 'ar' ? 'text-center py-2' : 'py-2'}><Face item={q.item} side={q.dir} say={q.dir === 'ar'} /></div>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {q.options.map((o, i) => {
          const cls = !done ? '' : o.id === q.item.id ? 'is-right' : o.id === pick ? 'is-wrong' : 'is-gone';
          return (
            <button key={o.id} type="button" disabled={done} onClick={() => choose(o.id)} data-opt
              className={`opt ${cls} min-h-[60px] px-4 py-3 rounded-xl bg-s2 border border-line3 text-ink flex items-center gap-3 text-left`}>
              <span className="w-7 h-7 shrink-0 rounded-full border border-line3 text-xs text-faint flex items-center justify-center">{i + 1}</span>
              <span className={`flex-1 ${ansSide === 'ar' ? 'text-right' : ''}`}><OptText item={o} side={ansSide} /></span>
            </button>
          );
        })}
      </div>
      {done && !ok && <Feedback item={q.item} dir={q.dir} grade="wrong" onNext={onNext} />}
      {done && ok && !autoNext && <Feedback item={q.item} dir={q.dir} grade="right" onNext={onNext} />}
    </div>
  );
}

/** Yazılı soru: Türkçe anlam ya da Arapça (okunuşla da yazılabilir). Sonuç devam edilince bildirilir ("Doğru saymalıydı" olabilir) */
export function WriteQuestion({ q, onAnswer, onNext }: { q: WriteQ; onAnswer: (ok: boolean) => void; onNext: () => void }) {
  const [val, setVal] = useState('');
  const [res, setRes] = useState<Grade | null>(null);
  const [override, setOverride] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);
  const submit = (skip = false) => {
    if (res) return;
    const g = skip ? 'wrong' : grade(val, q.item, q.dir);
    setRes(g);
  };
  const finish = () => { onAnswer(override || res !== 'wrong'); onNext(); };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-lab">{q.dir === 'ar' ? 'Türkçe anlamını yaz' : 'Arapçasını ya da okunuşunu yaz'}</span>
        <div className={q.dir === 'ar' ? 'text-center py-2' : 'py-2'}><Face item={q.item} side={q.dir} say={q.dir === 'ar'} /></div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (res) finish(); else submit(); }} className="flex flex-col gap-3">
        <input ref={input} value={val} onChange={(e) => setVal(e.target.value)} readOnly={!!res} maxLength={120} autoComplete="off" autoCapitalize="off" spellCheck={false}
          dir={q.dir === 'tr' && /[؀-ۿ]/.test(val) ? 'rtl' : 'ltr'} aria-label="Cevabın"
          placeholder={q.dir === 'ar' ? 'Cevabını yaz' : 'كتاب ya da kitab'}
          className={`h-14 px-4 rounded-xl bg-s2 border text-ink text-lg outline-none focus:border-acc ${res === 'wrong' && !override ? 'border-badln' : res ? 'border-okln' : 'border-line3'}`} />
        {!res && (
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => submit(true)} className="h-11 px-4 rounded-xl text-soft font-semibold hover:text-ink">Bilmiyorum</button>
            <button type="submit" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold">Cevapla</button>
          </div>
        )}
      </form>
      {res && (
        <Feedback item={q.item} dir={q.dir} grade={override ? 'right' : res} onNext={finish}
          onOverride={res === 'wrong' && !override && val.trim() ? () => setOverride(true) : undefined} />
      )}
    </div>
  );
}

/** Cevaptan sonra: doğru cevap ve devam düğmesi */
export function Feedback({ item, dir, grade: g, onNext, onOverride }: { item: ListItem; dir: Side; grade: Grade; onNext: () => void; onOverride?: () => void }) {
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => { btn.current?.focus(); }, []);
  const ans = answerOf(item, dir);
  const tone = g === 'wrong' ? 'bg-badbg border-badln' : 'bg-okbg border-okln';
  return (
    <div className={`pop flex flex-col gap-3 p-4 rounded-xl border ${tone}`} role="status">
      <span className={`font-bold ${g === 'wrong' ? 'text-bad' : 'text-okt'}`}>
        {g === 'right' ? 'Doğru!' : g === 'almost' ? 'Neredeyse! Küçük bir yazım farkı var.' : 'Doğru cevap:'}
      </span>
      {g !== 'right' && (
        <span className="flex items-center gap-3 flex-wrap">
          {dir === 'ar' ? <span className="text-[18px] font-semibold text-ink">{ans}</span> : <Face item={item} side="ar" size="sm" say />}
        </span>
      )}
      {item.note && <span className="text-sm text-mute">{item.note}</span>}
      <div className="flex gap-2 justify-end flex-wrap">
        {onOverride && <button type="button" onClick={onOverride} className="h-10 px-4 rounded-xl text-soft text-sm font-semibold hover:text-ink">Doğru saymalıydı</button>}
        <button ref={btn} type="button" onClick={onNext} className="h-10 px-5 rounded-xl bg-acc text-onacc text-sm font-bold">Devam</button>
      </div>
    </div>
  );
}

/** Oyun ve modlarda soru kartı: çoktan seçmeli ya da yazılı */
export function AnyQuestion({ q, onAnswer, onNext, autoNext }: { q: McQ | WriteQ; onAnswer: (ok: boolean) => void; onNext: () => void; autoNext?: boolean }) {
  return q.kind === 'mc'
    ? <McQuestion q={q} onAnswer={onAnswer} onNext={onNext} autoNext={autoNext} />
    : <WriteQuestion q={q} onAnswer={onAnswer} onNext={onNext} />;
}

/** Oyun sonu ekranı */
export function GameOver({ title, value, best, record, onAgain, children }: { title: string; value: string; best?: string; record?: boolean; onAgain: () => void; children?: React.ReactNode }) {
  return (
    <div className="pop flex flex-col items-center text-center gap-4 py-10">
      <span className="text-sm font-semibold tracking-[.1em] uppercase text-lab">{title}</span>
      <span className="text-[56px] font-bold leading-none text-ink">{value}</span>
      {record ? <span className="px-3 py-1 rounded-full bg-okbg border border-okln text-okt text-sm font-bold">Yeni rekor!</span>
        : best && <span className="text-mute">En iyi: {best}</span>}
      {children}
      <button type="button" onClick={onAgain} className="mt-2 h-12 px-6 rounded-xl bg-acc text-onacc font-bold">Tekrar oyna</button>
    </div>
  );
}
