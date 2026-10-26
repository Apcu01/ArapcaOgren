'use client';

/* Liste paylaşımı: bağlantıyı alan herkes listeyi görür ve kendi hesabına kopyalayabilir */
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch } from './useList';
import type { WordList } from '@/lib/study';

export default function ShareButton({ list, update }: { list: WordList; update: (fn: (l: WordList) => WordList) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold inline-flex items-center gap-2 hover:text-ink hover:border-lineh">
        <Raw html={I.share(16)} /> Paylaş
      </button>
      {open && <ShareDialog list={list} update={update} onClose={() => setOpen(false)} />}
    </>
  );
}

function ShareDialog({ list, update, onClose }: { list: WordList; update: (fn: (l: WordList) => WordList) => void; onClose: () => void }) {
  const { toast } = useApp();
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const link = list.shareToken ? `${location.origin}/liste/${list.shareToken}` : '';

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>('button')?.focus();
    return () => prev?.focus();
  }, []);

  async function set(on: boolean, renew = false) {
    if (renew && !confirm('Eski bağlantı çalışmaz hâle gelir. Yeni bağlantı oluşturulsun mu?')) return;
    setBusy(true);
    const r = await jsonFetch<{ token: string | null }>(`/api/lists/${list.id}/study`, { method: 'POST', body: JSON.stringify({ action: 'share', on, renew }) });
    setBusy(false);
    if (!r.ok) { toast(r.error); return; }
    update((l) => ({ ...l, shareToken: r.data.token }));
    if (renew) toast('Yeni bağlantı oluşturuldu.');
  }
  async function copy() {
    try { await navigator.clipboard.writeText(link); toast('Bağlantı kopyalandı.'); }
    catch { toast('Kopyalanamadı. Bağlantıyı seçip elle kopyala.'); }
  }
  async function nativeShare() {
    try { await navigator.share({ title: list.title, text: `"${list.title}" kelime listesi`, url: link }); } catch { /* vazgeçildi */ }
  }
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <div className="fixed inset-0 z-[95] bg-black/60 flex items-end sm:items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Escape') onClose(); }}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="share-h" className="pop w-full max-w-[500px] rounded-3xl bg-s4 border border-line3 shadow-2xl p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="share-h" className="m-0 text-xl font-bold">Listeyi paylaş</h2>
            <p className="m-0 text-sm text-mute leading-relaxed">Bağlantıyı alan herkes kelimeleri görür ve listeyi kendi hesabına kopyalayıp çalışabilir. Senin ilerlemen paylaşılmaz; listede adın görünür.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" className="w-10 h-10 shrink-0 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh" dangerouslySetInnerHTML={{ __html: I.x(16) }} />
        </div>

        <label className="flex items-center justify-between gap-3 p-4 rounded-xl bg-s2 border border-line3 cursor-pointer">
          <span className="flex flex-col"><span className="font-semibold text-ink">Bağlantıyla paylaş</span><span className="text-xs text-faint">{list.shareToken ? 'Açık' : 'Kapalı: listeyi yalnızca sen görüyorsun'}</span></span>
          <input type="checkbox" checked={!!list.shareToken} disabled={busy} onChange={(e) => set(e.target.checked)} className="w-5 h-5 accent-acc" />
        </label>

        {link && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input readOnly value={link} aria-label="Paylaşım bağlantısı" onFocus={(e) => e.target.select()}
                className="flex-1 min-w-0 h-11 px-3 rounded-xl bg-s2 border border-line3 text-soft text-sm outline-none focus:border-acc" />
              <button type="button" onClick={copy} className="h-11 px-4 rounded-xl bg-acc text-onacc text-sm font-bold shrink-0">Kopyala</button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {canShare && <button type="button" onClick={nativeShare} className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:text-ink hover:border-lineh inline-flex items-center gap-2"><Raw html={I.share(15)} /> Uygulamayla paylaş</button>}
              <button type="button" onClick={() => set(true, true)} disabled={busy} className="h-10 px-3 rounded-xl text-faint text-sm font-semibold hover:text-ink">Yeni bağlantı oluştur</button>
              <span className="flex-1" />
              {list.copies > 0 && <span className="text-xs text-mute">{list.copies} kez kopyalandı</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
