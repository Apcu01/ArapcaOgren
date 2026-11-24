'use client';

/* Listelerim: kullanıcının kelime listeleri; klasöre göre gruplanır, klasör ve etikete göre süzülür */
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch } from './useList';
import { Loading, LoginNeeded } from './parts';
import type { ListSummary } from '@/lib/study';

const ALL = '';
const NONE = '\u0000';
const trSort = (a: string, b: string) => a.localeCompare(b, 'tr');

export default function ListsView() {
  const { user, session } = useApp();
  const [lists, setLists] = useState<ListSummary[] | null>(null);
  const [err, setErr] = useState('');
  // Seçili klasör (ALL: hepsi, NONE: klasörsüz) ve etiket
  const [folder, setFolder] = useState(ALL);
  const [tag, setTag] = useState('');
  useEffect(() => {
    if (session === 'loading' || !user) return;
    jsonFetch<{ lists: ListSummary[] }>('/api/lists').then((r) => (r.ok ? setLists(r.data.lists) : setErr(r.error)));
  }, [session, user]);

  const folders = useMemo(() => [...new Set((lists || []).map((l) => l.folder).filter(Boolean))].sort(trSort), [lists]);
  const tags = useMemo(() => [...new Set((lists || []).flatMap((l) => l.tags))].sort(trSort), [lists]);
  const hasLoose = (lists || []).some((l) => !l.folder);
  const shown = (lists || []).filter((l) => (folder === ALL || (folder === NONE ? !l.folder : l.folder === folder)) && (!tag || l.tags.includes(tag)));
  // Klasörlere göre bölümler: klasörlüler adına göre, klasörsüzler en sonda
  const groups = useMemo(() => {
    const m = new Map<string, ListSummary[]>();
    for (const l of shown) m.set(l.folder, [...(m.get(l.folder) || []), l]);
    return [...m.entries()].sort((a, b) => (!a[0] ? 1 : !b[0] ? -1 : trSort(a[0], b[0])));
  }, [shown]);

  if (session === 'loading') return <Loading />;
  if (!user) return <LoginNeeded />;

  const chip = (on: boolean) => `h-9 px-3.5 rounded-full border text-sm font-semibold inline-flex items-center gap-1.5 ${on ? 'bg-acc text-onacc border-acc' : 'bg-s2 text-soft border-line2 hover:border-lineh hover:text-ink'}`;
  const grouped = folders.length > 0 && folder === ALL;

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Kelime çalışması</span>
          <h1 className="m-0 text-[34px] sm:text-[42px] leading-tight font-bold tracking-tight">Listelerim</h1>
          <p className="m-0 text-mute max-w-[560px] leading-relaxed">Kendi kelime listeni oluştur; kartlarla, adım adım öğrenerek, testlerle ve oyunlarla çalış. Listelerini klasörlere ayırıp etiketleyebilirsin.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/hazir-listeler" className="h-12 px-5 rounded-xl border border-line3 bg-s2 text-ink font-semibold inline-flex items-center hover:text-ink hover:border-lineh">Hazır listeler</Link>
          <Link href="/listelerim/yeni" className="h-12 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2 hover:text-onacc">
            <Raw html={I.plus(18)} /> Yeni liste
          </Link>
        </div>
      </div>

      {err && <p className="m-0 text-bad" role="alert">{err}</p>}
      {!lists && !err && <Loading />}
      {lists && lists.length === 0 && (
        <div className="flex flex-col items-center text-center gap-3 p-10 rounded-[22px] bg-s1 border border-line">
          <span className="w-14 h-14 rounded-2xl bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={I.cards(24)} /></span>
          <h2 className="m-0 text-xl font-bold">Henüz listen yok</h2>
          <p className="m-0 text-mute max-w-[460px] leading-relaxed">Bir liste oluştur, kelimeleri ekle. Okunuşu ya da anlamı yazınca derslerdeki ve sözlükteki kelimeler önerilir. Kelime bul ve sözlükten de listene kelime ekleyebilirsin. Ya da <Link href="/hazir-listeler">hazır listelerden</Link> birini kopyala.</p>
          <Link href="/listelerim/yeni" className="mt-2 h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2 hover:text-onacc"><Raw html={I.plus(17)} /> İlk listeni oluştur</Link>
        </div>
      )}

      {lists && lists.length > 0 && (folders.length > 0 || tags.length > 0) && (
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-s1 border border-line">
          {folders.length > 0 && (
            <div role="group" aria-label="Klasöre göre süz" className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[.08em] text-lab w-16">Klasör</span>
              <button type="button" aria-pressed={folder === ALL} onClick={() => setFolder(ALL)} className={chip(folder === ALL)}>Tümü</button>
              {folders.map((f) => (
                <button key={f} type="button" aria-pressed={folder === f} onClick={() => setFolder(folder === f ? ALL : f)} className={chip(folder === f)}>
                  <Raw html={I.list(14)} /> {f}
                </button>
              ))}
              {hasLoose && <button type="button" aria-pressed={folder === NONE} onClick={() => setFolder(folder === NONE ? ALL : NONE)} className={chip(folder === NONE)}>Klasörsüz</button>}
            </div>
          )}
          {tags.length > 0 && (
            <div role="group" aria-label="Etikete göre süz" className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[.08em] text-lab w-16">Etiket</span>
              {tags.map((t) => (
                <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(tag === t ? '' : t)} className={chip(tag === t)}>#{t}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {lists && lists.length > 0 && !shown.length && (
        <div className="p-8 rounded-2xl border border-dashed border-line3 text-center text-mute flex flex-col items-center gap-3">
          Bu süzgece uyan liste yok.
          <button type="button" onClick={() => { setFolder(ALL); setTag(''); }} className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:text-ink hover:border-lineh">Süzgeci temizle</button>
        </div>
      )}

      {groups.map(([name, items]) => (
        <section key={name || 'none'} className="flex flex-col gap-3" aria-label={name || 'Klasörsüz listeler'}>
          {grouped && (
            <h2 className="m-0 text-lg font-bold flex items-center gap-2">
              <span className="text-acct"><Raw html={I.list(18)} /></span>{name || 'Klasörsüz'} <span className="text-sm font-semibold text-faint">· {items.length} liste</span>
            </h2>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((l) => <ListCard key={l.id} l={l} onTag={setTag} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

function ListCard({ l, onTag }: { l: ListSummary; onTag: (t: string) => void }) {
  const pct = l.count ? Math.round((l.learned / l.count) * 100) : 0;
  return (
    <div className="cat relative flex flex-col gap-4 p-6 rounded-[20px] bg-s4 border border-line3 text-ink">
      <Link href={`/listelerim/${l.id}`} className="flex flex-col gap-1 min-w-0 text-ink hover:text-ink after:absolute after:inset-0 after:rounded-[20px]">
        <span className="text-xl font-bold truncate">{l.title}</span>
        <span className="text-sm text-mute2">{l.count} kelime{l.description ? ' · ' + l.description : ''}</span>
      </Link>
      {l.tags.length > 0 && (
        <span className="relative flex flex-wrap gap-1.5">
          {l.tags.map((t) => (
            <button key={t} type="button" onClick={() => onTag(t)} className="h-7 px-2.5 rounded-full bg-chip border border-chipln text-acct text-xs font-semibold hover:text-ink">#{t}</button>
          ))}
        </span>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-mute"><span>{l.learned} öğrenildi · {l.learning} devam ediyor</span><span>%{pct}</span></div>
        <div className="h-2 rounded-full bg-track overflow-hidden flex">
          <div className="h-full bg-acc" style={{ width: pct + '%' }} />
          <div className="h-full bg-prog/60" style={{ width: (l.count ? (l.learning / l.count) * 100 : 0) + '%' }} />
        </div>
      </div>
    </div>
  );
}
