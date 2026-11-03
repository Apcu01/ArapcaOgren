'use client';

/* Sınıflarım: kodla sınıfa katıl, yeni sınıf aç, açtığın ve katıldığın sınıflar */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch } from '../lists/useList';
import { Loading } from '../lists/parts';
import { normCode, type ClassSummary } from '@/lib/class-shared';

export function ClassLogin({ next }: { next?: string }) {
  const q = next ? '?next=' + encodeURIComponent(next) : '';
  return (
    <div className="max-w-[560px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
      <span className="w-14 h-14 rounded-2xl bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={I.users(26)} /></span>
      <h1 className="m-0 text-[28px] font-bold">Sınıflar için giriş yap</h1>
      <p className="m-0 text-mute leading-relaxed">Öğretmenler sınıf açıp ders, okuma metni ve kelime listesi ödevi verir; kimin bitirdiğini görür. Öğrenciler öğretmenin verdiği kodla katılır.</p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href={'/giris' + q} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Giriş yap</Link>
        <Link href={'/kayit' + q} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-ink font-semibold inline-flex items-center hover:text-ink hover:border-lineh">Hesap aç</Link>
      </div>
    </div>
  );
}

export default function ClassesView() {
  const { user, session, toast } = useApp();
  const router = useRouter();
  const [list, setList] = useState<ClassSummary[] | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState<'' | 'join' | 'create'>('');
  const [err, setErr] = useState<{ join?: string; create?: string }>({});

  const load = useCallback(async () => {
    const r = await jsonFetch<{ classes: ClassSummary[] }>('/api/classes');
    setList(r.ok ? r.data.classes : []);
  }, []);
  useEffect(() => { if (session === 'ready' && user) void load(); }, [session, user, load]);

  if (session === 'loading') return <Loading />;
  if (!user) return <ClassLogin next="/siniflar" />;

  async function join(e: React.FormEvent) {
    e.preventDefault();
    setBusy('join'); setErr({});
    const r = await jsonFetch<{ id: number; already?: boolean }>('/api/classes', { method: 'POST', body: JSON.stringify({ action: 'join', code }) });
    setBusy('');
    if (!r.ok) { setErr({ join: r.error }); return; }
    toast(r.data.already ? 'Zaten bu sınıftasın.' : 'Sınıfa katıldın!');
    router.push('/siniflar/' + r.data.id);
  }
  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy('create'); setErr({});
    const r = await jsonFetch<{ id: number }>('/api/classes', { method: 'POST', body: JSON.stringify({ action: 'create', name }) });
    setBusy('');
    if (!r.ok) { setErr({ create: r.error }); return; }
    router.push('/siniflar/' + r.data.id);
  }

  const owned = (list || []).filter((c) => c.isOwner);
  const joined = (list || []).filter((c) => !c.isOwner);
  const Card = ({ c }: { c: ClassSummary }) => (
    <Link href={`/siniflar/${c.id}`} className="cat flex flex-col gap-2 p-5 rounded-2xl bg-s4 border border-line3 text-ink hover:text-ink">
      <span className="flex items-center justify-between gap-3">
        <span className="text-[18px] font-bold truncate">{c.name}</span>
        {c.code && <span className="shrink-0 px-2.5 py-1 rounded-lg bg-s2 border border-line3 font-mono font-bold tracking-[.15em] text-acct text-sm">{c.code}</span>}
      </span>
      <span className="text-sm text-mute2">{c.isOwner ? 'Öğretmeni sensin' : `Öğretmen: ${c.owner}`}</span>
      <span className="mt-1 text-xs font-semibold text-acct">{c.members} öğrenci · {c.tasks} ödev</span>
    </Link>
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Sınıflar</span>
        <h1 className="m-0 text-[34px] sm:text-[44px] leading-tight font-bold tracking-tight">Sınıflarım</h1>
        <p className="m-0 text-mute max-w-[680px] leading-relaxed">Öğretmenin verdiği kodla sınıfa katıl ya da kendi sınıfını açıp öğrencilerine ders, okuma metni ve kelime listesi ödevi ver. Ödevlerin durumu ve sınıfın haftalık ligi sınıf sayfasında.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <form onSubmit={join} className="flex flex-col gap-3 p-5 rounded-2xl bg-s3 border border-line">
          <h2 className="m-0 text-lg font-bold">Sınıfa katıl</h2>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-mute">Öğretmeninin verdiği 6 haneli kod</span>
            <input value={code} onChange={(e) => setCode(normCode(e.target.value))} maxLength={6} autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="ABC234"
              className="h-12 px-4 rounded-xl bg-s2 border border-line3 text-ink font-mono font-bold tracking-[.3em] text-lg uppercase outline-none focus:border-acc" />
          </label>
          {err.join && <p role="alert" className="m-0 text-sm text-bad">{err.join}</p>}
          <button type="submit" disabled={code.length !== 6 || !!busy} className="self-start h-11 px-5 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50">{busy === 'join' ? 'Katılınıyor' : 'Katıl'}</button>
        </form>
        <form onSubmit={create} className="flex flex-col gap-3 p-5 rounded-2xl bg-s3 border border-line">
          <h2 className="m-0 text-lg font-bold">Yeni sınıf aç <span className="text-sm font-normal text-faint">(öğretmenler için)</span></h2>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-mute">Sınıfın adı</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Örneğin: 9-A Arapça" className="h-12 px-4 rounded-xl bg-s2 border border-line3 text-ink outline-none focus:border-acc" />
          </label>
          {err.create && <p role="alert" className="m-0 text-sm text-bad">{err.create}</p>}
          <button type="submit" disabled={!name.trim() || !!busy} className="self-start h-11 px-5 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50 inline-flex items-center gap-2"><Raw html={I.plus(16)} /> {busy === 'create' ? 'Açılıyor' : 'Sınıfı aç'}</button>
        </form>
      </div>

      {!list ? <Loading /> : (
        <>
          {joined.length > 0 && (
            <section className="flex flex-col gap-3"><h2 className="m-0 text-[22px] font-bold">Katıldığım sınıflar</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{joined.map((c) => <Card key={c.id} c={c} />)}</div></section>
          )}
          {owned.length > 0 && (
            <section className="flex flex-col gap-3"><h2 className="m-0 text-[22px] font-bold">Açtığım sınıflar</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{owned.map((c) => <Card key={c.id} c={c} />)}</div></section>
          )}
          {!list.length && <p className="m-0 p-6 rounded-2xl bg-s1 border border-line text-center text-mute">Henüz bir sınıfın yok. Kodla katılabilir ya da yeni sınıf açabilirsin.</p>}
        </>
      )}
    </div>
  );
}
