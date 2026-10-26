'use client';

/* Canlı yarışma giriş sayfası: PIN ile katıl ya da yarışma aç (hesap gerekmez) */
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch } from '../lists/useList';
import { hostKeyOf, post, save } from './shared';
import { DIR_LABEL, type Dir, type ListSummary } from '@/lib/study';

export type LiveTopic = { id: string; name: string; n: number; words: number };
type Source = { type: 'topic'; id: string } | { type: 'list'; id: number } | { type: 'shared'; token: string };

export default function LiveLanding({ topics, shared }: { topics: LiveTopic[]; shared: { token: string; title: string; count: number } | null }) {
  const router = useRouter();
  const { user, session, toast } = useApp();
  const [pin, setPin] = useState('');
  const [lists, setLists] = useState<ListSummary[] | null>(null);
  const [source, setSource] = useState<Source | null>(shared ? { type: 'shared', token: shared.token } : null);
  const [count, setCount] = useState(10);
  const [seconds, setSeconds] = useState<10 | 20 | 30 | 60>(20);
  const [dir, setDir] = useState<Dir>('ar');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const u = new URLSearchParams(location.search);
    const p = (u.get('pin') || '').replace(/\D/g, '').slice(0, 6);
    if (p) setPin(p);
    const konu = u.get('konu');
    const liste = Number(u.get('liste'));
    if (konu && topics.some((t) => t.id === konu)) setSource({ type: 'topic', id: konu });
    else if (liste > 0) setSource({ type: 'list', id: liste });
  }, [topics]);
  useEffect(() => {
    if (session === 'loading' || !user) return;
    jsonFetch<{ lists: ListSummary[] }>('/api/lists').then((r) => r.ok && setLists(r.data.lists));
  }, [session, user]);

  function joinGame(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pin)) { toast('PIN 6 haneli bir sayı.'); return; }
    router.push(`/canli/${pin}`);
  }
  async function create() {
    if (!source) { toast('Önce bir ders ya da liste seç.'); return; }
    setBusy(true);
    const r = await post<{ code: string; hostKey: string }>('/api/live', { source, count, seconds, dir });
    setBusy(false);
    if (!r.ok) { toast(r.error); return; }
    save(hostKeyOf(r.data.code), r.data.hostKey);
    router.push(`/canli/${r.data.code}/sunucu`);
  }

  const pick = (s: Source, label: string, sub: string, key: string) => {
    const on = !!source && JSON.stringify(source) === JSON.stringify(s);
    return (
      <button key={key} type="button" onClick={() => setSource(s)} aria-pressed={on}
        className={`flex items-center justify-between gap-3 px-4 h-12 rounded-xl border text-left ${on ? 'bg-acc text-onacc border-acc' : 'bg-s2 border-line3 text-soft hover:text-ink hover:border-lineh'}`}>
        <span className="font-semibold truncate">{label}</span><span className={`text-xs shrink-0 ${on ? 'text-onacc/80' : 'text-faint'}`}>{sub}</span>
      </button>
    );
  };
  const listsOk = lists?.filter((l) => l.count >= 4) ?? [];

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Sınıfça yarış</span>
        <h1 className="m-0 text-[34px] sm:text-[44px] leading-tight font-bold tracking-tight">Canlı yarışma</h1>
        <p className="m-0 text-mute max-w-[640px] leading-relaxed">Öğretmen yarışmayı açıp tahtaya yansıtır; öğrenciler telefonlarından PIN ile katılır. Sorular herkese aynı anda gelir, hızlı ve doğru cevap daha çok puan getirir. Kimsenin hesap açması gerekmez.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-start">
        <section aria-labelledby="join-h" className="flex flex-col gap-4 p-6 rounded-[22px] bg-s4 border border-line3">
          <h2 id="join-h" className="m-0 text-xl font-bold">Yarışmaya katıl</h2>
          <form onSubmit={joinGame} className="flex flex-col gap-3">
            <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="off" placeholder="PIN" aria-label="Yarışma PIN'i"
              className="h-16 px-4 rounded-xl bg-s2 border border-line3 text-ink text-[30px] font-bold tracking-[.3em] text-center outline-none focus:border-acc placeholder:tracking-normal placeholder:text-faint placeholder:text-xl" />
            <button type="submit" className="h-14 rounded-xl bg-acc text-onacc text-lg font-bold">Devam</button>
          </form>
          <p className="m-0 text-xs text-faint">PIN, öğretmeninin ekranında yazıyor.</p>
        </section>

        <section aria-labelledby="host-h" className="flex flex-col gap-5 p-6 rounded-[22px] bg-s1 border border-line">
          <div className="flex flex-col gap-1">
            <h2 id="host-h" className="m-0 text-xl font-bold">Yarışma aç</h2>
            <p className="m-0 text-sm text-mute">Bir dersin kelimelerini ya da bir kelime listesini seç.</p>
          </div>

          {shared && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold tracking-[.1em] uppercase text-lab">Paylaşılan liste</span>
              {pick({ type: 'shared', token: shared.token }, shared.title, `${shared.count} kelime`, 'shared')}
            </div>
          )}
          {user && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold tracking-[.1em] uppercase text-lab">Listelerim</span>
              {lists === null ? <span className="text-sm text-mute">Yükleniyor</span>
                : !listsOk.length ? <span className="text-sm text-mute">En az 4 kelimelik listen yok.</span>
                : <div className="grid gap-2 sm:grid-cols-2">{listsOk.map((l) => pick({ type: 'list', id: l.id }, l.title, `${l.count} kelime`, 'l' + l.id))}</div>}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold tracking-[.1em] uppercase text-lab">Dersler</span>
            <div className="grid gap-2 sm:grid-cols-2 max-h-[340px] overflow-y-auto pr-1">
              {topics.filter((t) => t.words >= 4).map((t) => pick({ type: 'topic', id: t.id }, `${t.n}. ${t.name}`, `${t.words} kelime`, 't' + t.id))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-soft">Soru sayısı</span>
              <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink">
                {[5, 10, 15, 20, 30].map((n) => <option key={n} value={n}>{n} soru</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-soft">Süre</span>
              <select value={seconds} onChange={(e) => setSeconds(Number(e.target.value) as 10 | 20 | 30 | 60)} className="h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink">
                {[10, 20, 30, 60].map((n) => <option key={n} value={n}>Soru başına {n} sn</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-soft">Soru yönü</span>
              <select value={dir} onChange={(e) => setDir(e.target.value as Dir)} className="h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink">
                {(Object.keys(DIR_LABEL) as Dir[]).map((d) => <option key={d} value={d}>{DIR_LABEL[d]}</option>)}
              </select>
            </label>
          </div>
          <button type="button" onClick={create} disabled={busy || !source} className="self-start h-14 px-7 rounded-xl bg-acc text-onacc text-lg font-bold inline-flex items-center gap-2 disabled:opacity-50">
            <Raw html={I.play(18)} /> {busy ? 'Açılıyor' : 'Yarışmayı aç'}
          </button>
          {!user && session === 'ready' && <p className="m-0 text-xs text-faint">Kendi kelime listenle yarışma açmak için giriş yapabilirsin; ders kelimeleri için gerekmez.</p>}
        </section>
      </div>
    </div>
  );
}
