'use client';

/* Test: doğru/yanlış, çoktan seçmeli, eşleştirme ve yazılı sorulardan oluşan sınav. Puan test bitince görünür */
import { useRef, useState } from 'react';
import { Ar } from '../../AppProvider';
import { Face } from '../parts';
import type { ModeProps } from '../StudyShell';
import { answerOf, buildTest, DIR_LABEL, fmtTime, grade, type Dir, type ListItem, type Q, type Side, type TestTypes } from '@/lib/study';

const TYPE_LABEL: Record<keyof TestTypes, string> = { tf: 'Doğru / Yanlış', mc: 'Çoktan seçmeli', match: 'Eşleştirme', write: 'Yazılı' };
/** Cevaplar: tf -> boolean, mc -> seçilen kelime id, write -> metin, match -> kelime id -> seçilen cevap id */
type Ans = boolean | number | string | Record<number, number>;

export default function TestMode({ items, opts, study }: ModeProps) {
  const [cfg, setCfg] = useState({ count: Math.min(20, items.length), types: { tf: true, mc: true, match: items.length >= 3, write: true } as TestTypes, dir: opts.dir });
  const [qs, setQs] = useState<Q[] | null>(null);
  const [ans, setAns] = useState<Record<number, Ans>>({});
  const [result, setResult] = useState<{ ok: boolean[]; ms: number } | null>(null);
  const started = useRef(0);

  const start = (src: ListItem[] = items) => {
    setQs(buildTest(src, Math.min(cfg.count, src.length), cfg.types, cfg.dir));
    setAns({}); setResult(null); started.current = Date.now();
    window.scrollTo({ top: 0 });
  };

  if (!qs) {
    const any = Object.values(cfg.types).some(Boolean);
    return (
      <div className="pop max-w-[560px] w-full mx-auto flex flex-col gap-6 p-6 sm:p-8 rounded-[22px] bg-s4 border border-line3">
        <div className="flex flex-col gap-1"><h1 className="m-0 text-[26px] font-bold">Test ayarları</h1><p className="m-0 text-sm text-mute">Sonucunu test bitince görürsün.</p></div>
        <label className="flex flex-col gap-2">
          <span className="flex justify-between text-[15px] font-semibold"><span>Soru sayısı</span><span className="text-acct">{cfg.count}</span></span>
          <input type="range" min={1} max={items.length} value={cfg.count} onChange={(e) => setCfg({ ...cfg, count: Number(e.target.value) })} className="accent-acc" />
          <span className="text-xs text-faint">En fazla {items.length} (listedeki kelime sayısı)</span>
        </label>
        <fieldset className="m-0 p-0 border-0 flex flex-col gap-1">
          <legend className="text-[15px] font-semibold mb-2">Soru türleri</legend>
          {(Object.keys(TYPE_LABEL) as (keyof TestTypes)[]).map((k) => (
            <label key={k} className="flex items-center justify-between gap-3 py-2 cursor-pointer">
              <span className="text-soft">{TYPE_LABEL[k]}{k === 'match' && items.length < 3 ? ' (en az 3 kelime)' : ''}</span>
              <input type="checkbox" checked={cfg.types[k]} disabled={k === 'match' && items.length < 3} onChange={(e) => setCfg({ ...cfg, types: { ...cfg.types, [k]: e.target.checked } })} className="w-5 h-5 accent-acc" />
            </label>
          ))}
        </fieldset>
        <div className="flex flex-col gap-2">
          <span className="text-[15px] font-semibold">Soru yönü</span>
          <div role="radiogroup" aria-label="Soru yönü" className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-s2 border border-line3">
            {(Object.keys(DIR_LABEL) as Dir[]).map((d) => (
              <button key={d} type="button" role="radio" aria-checked={cfg.dir === d} onClick={() => setCfg({ ...cfg, dir: d })}
                className={`h-10 rounded-lg text-[12px] sm:text-[13px] font-semibold ${cfg.dir === d ? 'bg-acc text-onacc' : 'text-soft hover:text-ink'}`}>{DIR_LABEL[d]}</button>
            ))}
          </div>
        </div>
        <button type="button" disabled={!any} onClick={() => start()} className="h-12 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50">Testi başlat</button>
      </div>
    );
  }

  const total = qs.reduce((n, q) => n + (q.kind === 'match' ? q.items.length : 1), 0);
  const answered = qs.reduce((n, q, i) => {
    const a = ans[i];
    if (q.kind === 'match') return n + Object.keys((a as Record<number, number>) || {}).length;
    return n + (a === undefined || a === '' ? 0 : 1);
  }, 0);

  function submit() {
    if (!qs) return;
    if (answered < total && !confirm(`${total - answered} soruyu boş bıraktın. Yine de bitirilsin mi?`)) return;
    const ok: boolean[] = [];
    qs.forEach((q, i) => {
      const a = ans[i];
      if (q.kind === 'tf') { const r = a === q.truth; ok.push(r); study.answer(q.item.id, r); }
      else if (q.kind === 'mc') { const r = a === q.item.id; ok.push(r); study.answer(q.item.id, r); }
      else if (q.kind === 'write') { const r = typeof a === 'string' && grade(a, q.item, q.dir) !== 'wrong'; ok.push(r); study.answer(q.item.id, r); }
      else for (const it of q.items) { const r = (a as Record<number, number> | undefined)?.[it.id] === it.id; ok.push(r); study.answer(it.id, r); }
    });
    study.flush();
    setResult({ ok, ms: Date.now() - started.current });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const wrongItems = result ? (() => {
    const out: ListItem[] = [];
    let k = 0;
    qs.forEach((q) => { for (const it of q.kind === 'match' ? q.items : [q.item]) { if (!result.ok[k]) out.push(it); k++; } });
    return out;
  })() : [];
  const score = result ? result.ok.filter(Boolean).length : 0;
  const pct = result ? Math.round((score / total) * 100) : 0;

  return (
    <div className="max-w-[820px] w-full mx-auto flex flex-col gap-5">
      {result ? (
        <div className="pop flex flex-col sm:flex-row gap-6 items-center p-6 sm:p-8 rounded-[22px] bg-s4 border border-line3">
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90" aria-hidden="true"><circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3.5" className="stroke-track" /><circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${pct * 0.974} 100`} className={pct >= 70 ? 'stroke-ok' : 'stroke-prog'} /></svg>
            <span className="absolute inset-0 flex items-center justify-center text-[28px] font-bold">%{pct}</span>
          </div>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h2 className="m-0 text-[26px] font-bold">{pct === 100 ? 'Kusursuz!' : pct >= 70 ? 'Çok iyi!' : 'Biraz daha pratik'}</h2>
            <p className="m-0 text-mute">{total} sorudan {score} doğru · {fmtTime(result.ms)}</p>
            <div className="flex gap-2 flex-wrap justify-center sm:justify-start mt-2">
              {wrongItems.length > 0 && <button type="button" onClick={() => start(wrongItems)} className="h-11 px-4 rounded-xl bg-acc text-onacc font-bold">Yanlışlarla yeni test ({wrongItems.length})</button>}
              <button type="button" onClick={() => start()} className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-ink font-semibold hover:border-lineh">Yeni test</button>
              <button type="button" onClick={() => setQs(null)} className="h-11 px-4 rounded-xl text-soft font-semibold hover:text-ink">Ayarlar</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-bg/95 backdrop-blur flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-track overflow-hidden"><div className="h-full bg-acc transition-all" style={{ width: (answered / total) * 100 + '%' }} /></div>
          <span className="text-sm text-mute whitespace-nowrap">{answered} / {total}</span>
        </div>
      )}

      {(() => {
        let k = 0;
        return qs.map((q, i) => {
          const from = k;
          k += q.kind === 'match' ? q.items.length : 1;
          const okSlice = result?.ok.slice(from, k);
          const n = i + 1;
          return (
            <section key={i} aria-label={`Soru ${n}`} className={`p-5 sm:p-7 rounded-[22px] bg-s4 border ${okSlice ? (okSlice.every(Boolean) ? 'border-okln' : 'border-badln') : 'border-line3'}`}>
              <div className="flex justify-between gap-3 mb-4 text-xs font-bold tracking-[.1em] uppercase text-lab">
                <span>{q.kind === 'tf' ? 'Doğru mu?' : q.kind === 'mc' ? 'Çoktan seçmeli' : q.kind === 'write' ? 'Yazılı' : 'Eşleştir'}</span>
                <span>{n} / {qs.length}</span>
              </div>
              <QView q={q} a={ans[i]} set={(v) => setAns((x) => ({ ...x, [i]: v }))} done={!!result} oks={okSlice} />
            </section>
          );
        });
      })()}

      {!result && <button type="button" onClick={submit} className="self-center h-12 px-8 rounded-xl bg-acc text-onacc font-bold">Cevapları gönder</button>}
    </div>
  );
}

function QView({ q, a, set, done, oks }: { q: Q; a: Ans | undefined; set: (v: Ans) => void; done: boolean; oks?: boolean[] }) {
  const other = (d: Side): Side => (d === 'ar' ? 'tr' : 'ar');
  if (q.kind === 'tf') {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4 items-center">
          <div className="text-center"><Face item={q.item} side={q.dir} size="md" /></div>
          <div className="text-center sm:border-l border-line sm:pl-4">{q.dir === 'ar' ? <Face item={q.shown} side="tr" /> : <Ar t={q.shown.ar} className="text-[30px] text-ink" />}</div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[true, false].map((v) => {
            const cls = !done ? (a === v ? 'is-sel' : '') : v === q.truth ? 'is-right' : a === v ? 'is-wrong' : 'is-gone';
            return <button key={String(v)} type="button" disabled={done} onClick={() => set(v)} aria-pressed={a === v} className={`opt ${cls} h-12 rounded-xl bg-s2 border border-line3 text-ink font-semibold`}>{v ? 'Doğru' : 'Yanlış'}</button>;
          })}
        </div>
      </div>
    );
  }
  if (q.kind === 'mc') {
    const side = other(q.dir);
    return (
      <div className="flex flex-col gap-4">
        <div className={q.dir === 'ar' ? 'text-center' : ''}><Face item={q.item} side={q.dir} /></div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {q.options.map((o) => {
            const cls = !done ? (a === o.id ? 'is-sel' : '') : o.id === q.item.id ? 'is-right' : a === o.id ? 'is-wrong' : 'is-gone';
            return (
              <button key={o.id} type="button" disabled={done} onClick={() => set(o.id)} aria-pressed={a === o.id} className={`opt ${cls} min-h-[56px] px-4 py-2 rounded-xl bg-s2 border border-line3 text-ink ${side === 'ar' ? 'text-right' : 'text-left'}`}>
                {side === 'ar' ? <Ar t={o.ar} className="text-[22px]" /> : <span className="font-semibold">{o.tr}</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if (q.kind === 'write') {
    const v = typeof a === 'string' ? a : '';
    return (
      <div className="flex flex-col gap-3">
        <div className={q.dir === 'ar' ? 'text-center' : ''}><Face item={q.item} side={q.dir} /></div>
        <input value={v} readOnly={done} onChange={(e) => set(e.target.value)} maxLength={120} autoComplete="off" spellCheck={false} aria-label="Cevabın"
          placeholder={q.dir === 'ar' ? 'Türkçe anlamını yaz' : 'Arapçasını ya da okunuşunu yaz'}
          className={`h-12 px-4 rounded-xl bg-s2 border text-ink text-[16px] outline-none focus:border-acc ${done ? (oks?.[0] ? 'border-okln' : 'border-badln') : 'border-line3'}`} />
        {done && !oks?.[0] && <span className="text-sm"><span className="text-mute">Doğru cevap: </span>{q.dir === 'ar' ? <b className="text-ink">{answerOf(q.item, q.dir)}</b> : <><Ar t={q.item.ar} className="text-[20px] text-ink" /> <span className="text-mute">({q.item.tl})</span></>}</span>}
      </div>
    );
  }
  // Eşleştirme: her kelimeye sağdaki listeden harf seçilir
  const sel = (a as Record<number, number>) || {};
  const side = other(q.dir);
  const letter = (n: number) => 'ABCDE'[n];
  return (
    <div className="grid md:grid-cols-[1fr_1fr] gap-5">
      <div className="flex flex-col gap-2.5">
        {q.items.map((it, j) => {
          const chosen = sel[it.id];
          const ok = oks?.[j];
          return (
            <label key={it.id} className={`flex items-center gap-3 p-2.5 rounded-xl border ${done ? (ok ? 'border-okln bg-okbg' : 'border-badln bg-badbg') : 'border-line3 bg-s2'}`}>
              <select value={chosen ?? ''} disabled={done} onChange={(e) => set({ ...sel, [it.id]: Number(e.target.value) })} aria-label="Eşleşen cevap"
                className="h-10 w-16 shrink-0 rounded-lg bg-s4 border border-line3 text-ink font-bold text-center">
                <option value="">-</option>
                {q.answers.map((x, n) => <option key={x.id} value={x.id}>{letter(n)}</option>)}
              </select>
              <span className="flex-1 min-w-0 text-center">{q.dir === 'ar' ? <Ar t={it.ar} className="text-[22px]" /> : <span className="font-semibold">{it.tr}</span>}</span>
              {done && !ok && <span className="text-xs font-bold text-bad shrink-0">Doğrusu {letter(q.answers.findIndex((x) => x.id === it.id))}</span>}
            </label>
          );
        })}
      </div>
      <ol className="m-0 p-0 list-none flex flex-col gap-2.5">
        {q.answers.map((x, n) => (
          <li key={x.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-s1 border border-line">
            <span className="w-8 h-8 shrink-0 rounded-full bg-chip border border-line3 text-acct text-sm font-bold flex items-center justify-center">{letter(n)}</span>
            <span className={`flex-1 ${side === 'ar' ? 'text-right' : ''}`}>{side === 'ar' ? <Ar t={x.ar} className="text-[22px]" /> : <span className="font-semibold">{x.tr}</span>}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

