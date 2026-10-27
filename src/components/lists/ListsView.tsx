'use client';

/* Listelerim: kullanıcının kelime listeleri */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch } from './useList';
import { Loading, LoginNeeded } from './parts';
import type { ListSummary } from '@/lib/study';

export default function ListsView() {
  const { user, session } = useApp();
  const [lists, setLists] = useState<ListSummary[] | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    if (session === 'loading' || !user) return;
    jsonFetch<{ lists: ListSummary[] }>('/api/lists').then((r) => (r.ok ? setLists(r.data.lists) : setErr(r.error)));
  }, [session, user]);

  if (session === 'loading') return <Loading />;
  if (!user) return <LoginNeeded />;

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Kelime çalışması</span>
          <h1 className="m-0 text-[34px] sm:text-[42px] leading-tight font-bold tracking-tight">Listelerim</h1>
          <p className="m-0 text-mute max-w-[560px] leading-relaxed">Kendi kelime listeni oluştur; kartlarla, adım adım öğrenerek, testlerle ve oyunlarla çalış.</p>
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
      {lists && lists.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {lists.map((l) => {
            const pct = l.count ? Math.round((l.learned / l.count) * 100) : 0;
            return (
              <Link key={l.id} href={`/listelerim/${l.id}`} className="cat flex flex-col gap-4 p-6 rounded-[20px] bg-s4 border border-line3 text-ink hover:text-ink">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xl font-bold truncate">{l.title}</span>
                  <span className="text-sm text-mute2">{l.count} kelime{l.description ? ' · ' + l.description : ''}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-mute"><span>{l.learned} öğrenildi · {l.learning} devam ediyor</span><span>%{pct}</span></div>
                  <div className="h-2 rounded-full bg-track overflow-hidden flex">
                    <div className="h-full bg-acc" style={{ width: pct + '%' }} />
                    <div className="h-full bg-prog/60" style={{ width: (l.count ? (l.learning / l.count) * 100 : 0) + '%' }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
