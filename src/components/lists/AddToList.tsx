'use client';

/* "Listeye ekle": Kelime bul, sözlük ve kelime sayfalarından bir kelimeyi kişisel listeye ekler */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch } from './useList';
import type { ListSummary } from '@/lib/study';

type Word = { ar: string; tl?: string; tr: string };

// Sayfa içinde birden çok düğme aynı listeyi paylaşsın
let cache: { at: number; lists: ListSummary[] } | null = null;
async function myLists(force = false) {
  if (!force && cache && Date.now() - cache.at < 60_000) return cache.lists;
  const r = await jsonFetch<{ lists: ListSummary[] }>('/api/lists');
  if (!r.ok) return null;
  cache = { at: Date.now(), lists: r.data.lists };
  return cache.lists;
}

export default function AddToList({ word, className = '', compact = false }: { word: Word; className?: string; compact?: boolean }) {
  const { user, toast } = useApp();
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<ListSummary[] | null>(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (box.current && !e.composedPath().includes(box.current)) setOpen(false); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', h);
    document.addEventListener('keydown', k);
    if (user) myLists().then((l) => setLists(l ?? []));
    return () => { document.removeEventListener('click', h); document.removeEventListener('keydown', k); };
  }, [open, user]);

  const item = { ar: word.ar, tl: word.tl || '', tr: word.tr, note: '' };
  async function add(l: ListSummary) {
    setBusy(true);
    const r = await jsonFetch<{ added: boolean }>(`/api/lists/${l.id}/study`, { method: 'POST', body: JSON.stringify({ action: 'add', item }) });
    setBusy(false);
    if (!r.ok) { toast(r.error); return; }
    toast(r.data.added ? `"${l.title}" listesine eklendi.` : `Bu kelime zaten "${l.title}" listesinde.`);
    cache = null;
    setOpen(false);
  }
  async function create() {
    const title = name.trim();
    if (!title) return;
    setBusy(true);
    const r = await jsonFetch<{ id: number }>('/api/lists', { method: 'POST', body: JSON.stringify({ title, description: '', items: [item] }) });
    setBusy(false);
    if (!r.ok) { toast(r.error); return; }
    toast(`"${title}" listesi oluşturuldu ve kelime eklendi.`);
    cache = null; setName(''); setOpen(false);
  }

  return (
    <span ref={box} className={`relative inline-flex ${className}`}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={compact ? `${word.tr}: listeye ekle` : undefined} title="Listeye ekle"
        className={compact
          ? 'w-9 h-9 rounded-full text-faint hover:text-ink hover:bg-s5 flex items-center justify-center'
          : 'px-2.5 py-1 rounded-full bg-s2 border border-line3 text-soft text-xs font-semibold hover:text-ink hover:border-lineh inline-flex items-center gap-1.5'}>
        <Raw html={I.plus(compact ? 17 : 13)} />{!compact && ' Listeye ekle'}
      </button>
      {open && (
        <span className="absolute z-40 right-0 top-full mt-2 w-[270px] p-2 rounded-2xl bg-s4 border border-line3 shadow-2xl flex flex-col gap-1 text-left">
          {!user ? (
            <span className="p-3 flex flex-col gap-2 text-sm text-mute">
              Kelimeyi kendi listene eklemek için giriş yap.
              <Link href="/giris" className="self-start h-9 px-4 rounded-lg bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Giriş yap</Link>
            </span>
          ) : (
            <>
              <span className="px-3 pt-1.5 pb-1 text-xs font-bold tracking-[.1em] uppercase text-lab">Listeye ekle</span>
              {lists === null && <span className="px-3 py-2 text-sm text-mute">Yükleniyor</span>}
              <span className="max-h-[220px] overflow-y-auto flex flex-col">
                {lists?.map((l) => (
                  <button key={l.id} type="button" disabled={busy} onClick={() => add(l)} className="flex items-center justify-between gap-2 px-3 h-10 rounded-lg text-sm text-soft hover:text-ink hover:bg-s5 text-left">
                    <span className="truncate font-semibold">{l.title}</span><span className="text-xs text-faint shrink-0">{l.count}</span>
                  </button>
                ))}
              </span>
              <form onSubmit={(e) => { e.preventDefault(); create(); }} className="flex gap-1.5 p-1.5 border-t border-line mt-1 pt-2">
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Yeni liste adı" aria-label="Yeni liste adı"
                  className="flex-1 min-w-0 h-9 px-3 rounded-lg bg-s2 border border-line3 text-ink text-sm outline-none focus:border-acc" />
                <button type="submit" disabled={busy || !name.trim()} className="h-9 px-3 rounded-lg bg-acc text-onacc text-sm font-bold disabled:opacity-50">Oluştur</button>
              </form>
            </>
          )}
        </span>
      )}
    </span>
  );
}
