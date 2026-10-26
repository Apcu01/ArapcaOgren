'use client';

/* Kopyalanan listede, asıl listeye eklenen, düzeltilen ve asıl listeden silinen kelimeleri önerir */
import { useEffect, useRef, useState } from 'react';
import { Ar, useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch } from './useList';
import type { SyncDiff } from '@/lib/study';

export default function SourceUpdates({ listId, onApplied }: { listId: number; onApplied: () => void }) {
  const [diff, setDiff] = useState<SyncDiff | null>(null);
  const [open, setOpen] = useState(false);
  const load = () => jsonFetch<{ updates: SyncDiff | null }>(`/api/lists/${listId}/updates`).then((r) => r.ok && setDiff(r.data.updates));
  useEffect(() => { load(); }, [listId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!diff) return null;
  const { added, changed, removed } = diff;
  const total = added.length + changed.length + removed.length;
  const from = <>{diff.source.owner} adlı kullanıcının <b className="text-soft font-semibold">{diff.source.title}</b> listesinden kopyalandı</>;
  if (!total) return <p className="m-0 -mt-4 text-sm text-faint">{from}.</p>;
  const parts = [added.length && `${added.length} yeni`, changed.length && `${changed.length} düzeltilmiş`, removed.length && `${removed.length} silinmiş`].filter(Boolean).join(', ');
  return (
    <>
      <div className="pop -mt-2 flex flex-wrap items-center gap-4 p-4 sm:p-5 rounded-2xl bg-s4 border border-acc">
        <span className="w-11 h-11 shrink-0 rounded-xl bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={I.refresh(20)} /></span>
        <div className="flex-1 min-w-[200px] flex flex-col gap-0.5">
          <span className="font-bold text-ink">Asıl listede değişiklik var: {parts} kelime</span>
          <span className="text-sm text-mute2">{from}. İstediklerini seçip kendi listene alabilirsin.</span>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold">Gözden geçir</button>
      </div>
      {open && <Review listId={listId} diff={diff} onClose={() => setOpen(false)} onDone={() => { setOpen(false); load(); onApplied(); }} />}
    </>
  );
}

function Review({ listId, diff, onClose, onDone }: { listId: number; diff: SyncDiff; onClose: () => void; onDone: () => void }) {
  const { toast } = useApp();
  // Varsayılan: hepsi seçili
  const [add, setAdd] = useState(() => new Set(diff.added.map((x) => x.sourceId)));
  const [change, setChange] = useState(() => new Set(diff.changed.map((x) => x.id)));
  const [remove, setRemove] = useState(() => new Set(diff.removed.map((x) => x.id)));
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>('button')?.focus();
    return () => prev?.focus();
  }, []);
  const toggle = (set: Set<number>, fn: (s: Set<number>) => void, id: number) => { const n = new Set(set); if (n.has(id)) n.delete(id); else n.add(id); fn(n); };

  async function apply(none = false) {
    setBusy(true);
    const r = await jsonFetch<{ added: number; changed: number; removed: number }>(`/api/lists/${listId}/updates`, {
      method: 'POST', body: JSON.stringify(none ? { add: [], change: [], remove: [] } : { add: [...add], change: [...change], remove: [...remove] })
    });
    setBusy(false);
    if (!r.ok) { toast(r.error); return; }
    const d = r.data;
    const msg = [d.added && `${d.added} kelime eklendi`, d.changed && `${d.changed} kelime düzeltildi`, d.removed && `${d.removed} kelime silindi`].filter(Boolean).join(', ');
    toast(msg ? msg + '.' : 'Değişiklikler alınmadı. Bunlar bir daha önerilmeyecek.');
    onDone();
  }

  const row = 'flex items-center gap-3 px-3 py-2.5 rounded-xl bg-s2 border border-line3 cursor-pointer';
  const n = add.size + change.size + remove.size;
  return (
    <div className="fixed inset-0 z-[95] bg-black/60 flex items-end sm:items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Escape') onClose(); }}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="upd-h" className="pop w-full max-w-[600px] max-h-[88vh] rounded-3xl bg-s4 border border-line3 shadow-2xl flex flex-col">
        <div className="flex items-start justify-between gap-3 p-6 pb-3">
          <div className="flex flex-col gap-1">
            <h2 id="upd-h" className="m-0 text-xl font-bold">Asıl listedeki değişiklikler</h2>
            <p className="m-0 text-sm text-mute">Seçtiklerin listene alınır. Kendi eklediğin kelimeler ve ilerlemen korunur.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" className="w-10 h-10 shrink-0 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh" dangerouslySetInnerHTML={{ __html: I.x(16) }} />
        </div>

        <div className="overflow-y-auto px-6 flex flex-col gap-5 pb-2">
          {diff.added.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="m-0 text-xs font-bold tracking-[.1em] uppercase text-lab">Yeni kelimeler ({diff.added.length})</h3>
              {diff.added.map((x) => (
                <label key={x.sourceId} className={row}>
                  <input type="checkbox" checked={add.has(x.sourceId)} onChange={() => toggle(add, setAdd, x.sourceId)} className="w-5 h-5 accent-acc shrink-0" />
                  <span className="flex-1 min-w-0 flex flex-col"><span className="font-semibold text-ink">{x.tr}</span>{x.tl && <span className="tl text-xs text-mute">{x.tl}</span>}</span>
                  <Ar t={x.ar} className="text-[22px] text-ink" />
                </label>
              ))}
            </section>
          )}
          {diff.changed.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="m-0 text-xs font-bold tracking-[.1em] uppercase text-lab">Düzeltilen kelimeler ({diff.changed.length})</h3>
              {diff.changed.map((x) => (
                <label key={x.id} className={`${row} items-start`}>
                  <input type="checkbox" checked={change.has(x.id)} onChange={() => toggle(change, setChange, x.id)} className="w-5 h-5 accent-acc shrink-0 mt-1" />
                  <span className="flex-1 min-w-0 flex flex-col gap-1 text-sm">
                    {(['ar', 'tl', 'tr', 'note'] as const).filter((f) => x.from[f] !== x.to[f]).map((f) => (
                      <span key={f} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-faint w-16 shrink-0">{f === 'ar' ? 'Arapça' : f === 'tl' ? 'Okunuş' : f === 'tr' ? 'Anlam' : 'Not'}</span>
                        <span className="text-mute line-through decoration-bad/70">{f === 'ar' ? <Ar t={x.from.ar} className="text-[18px]" /> : x.from[f] || '(boş)'}</span>
                        <Raw html={I.arrow(13)} className="text-faint" />
                        <span className="text-ink font-semibold">{f === 'ar' ? <Ar t={x.to.ar} className="text-[18px]" /> : x.to[f] || '(boş)'}</span>
                      </span>
                    ))}
                  </span>
                </label>
              ))}
            </section>
          )}
          {diff.removed.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="m-0 text-xs font-bold tracking-[.1em] uppercase text-lab">Asıl listeden çıkarılanlar ({diff.removed.length})</h3>
              <p className="m-0 text-xs text-faint">Seçilenler senin listenden de silinir; seçmediklerin listende kalır.</p>
              {diff.removed.map((x) => (
                <label key={x.id} className={row}>
                  <input type="checkbox" checked={remove.has(x.id)} onChange={() => toggle(remove, setRemove, x.id)} className="w-5 h-5 accent-acc shrink-0" />
                  <span className="flex-1 min-w-0 font-semibold text-ink">{x.tr}</span>
                  <Ar t={x.ar} className="text-[22px] text-ink" />
                </label>
              ))}
            </section>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-end p-6 pt-4 border-t border-line">
          <button type="button" onClick={() => apply(true)} disabled={busy} className="h-11 px-4 rounded-xl text-soft font-semibold hover:text-ink">Hiçbirini alma</button>
          <button type="button" onClick={() => apply()} disabled={busy || !n} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50">{busy ? 'Uygulanıyor' : `Seçilenleri uygula (${n})`}</button>
        </div>
      </div>
    </div>
  );
}
