'use client';

/* Paylaşılan ya da hazır bir listeyi kendi listelerine kopyala; giriş yapılmamışsa giriş sonrası bu sayfaya dönülür */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch } from './useList';

export default function CopyShared({ copyUrl, back: backPath }: { copyUrl: string; back: string }) {
  const { user, session, toast } = useApp();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const back = encodeURIComponent(backPath);

  async function copy() {
    setBusy(true);
    const r = await jsonFetch<{ id: number }>(copyUrl, { method: 'POST' });
    setBusy(false);
    if (!r.ok) { toast(r.error); return; }
    toast('Liste kopyalandı. Artık senin listen.');
    router.push(`/listelerim/${r.data.id}`);
  }

  if (session === 'loading') return <span className="h-12" />;
  if (!user) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/giris?next=${back}`} className="h-12 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Giriş yap ve kopyala</Link>
        <Link href={`/kayit?next=${back}`} className="h-12 px-5 rounded-xl border border-line3 bg-s2 text-ink font-semibold inline-flex items-center hover:text-ink hover:border-lineh">Hesap aç</Link>
      </div>
    );
  }
  return (
    <button type="button" onClick={copy} disabled={busy} className="self-start h-12 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2 disabled:opacity-60">
      <Raw html={I.plus(18)} /> {busy ? 'Kopyalanıyor' : 'Listelerime kopyala'}
    </button>
  );
}
