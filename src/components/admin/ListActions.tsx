'use client';

/* Yönetim paneli: kelime listesi denetimi (paylaşımı kapat, sil) */
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ListActions({ id, shared }: { id: number; shared: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function call(method: 'PATCH' | 'DELETE') {
    setBusy(true);
    setErr('');
    const r = await fetch(`/api/admin/lists/${id}`, { method });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(j.error || 'İşlem başarısız.'); return false; }
    return true;
  }

  const btn = 'h-10 px-4 rounded-xl border text-sm font-semibold disabled:opacity-50';
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2 justify-end">
        {shared && (
          <button type="button" disabled={busy} className={`${btn} border-line3 bg-s2 text-soft hover:border-lineh`}
            onClick={async () => { if (confirm('Bu listenin paylaşım bağlantısı kapatılsın mı? Sahibi isterse yeniden açabilir.') && (await call('PATCH'))) router.refresh(); }}>
            Paylaşımı kapat
          </button>
        )}
        <button type="button" disabled={busy} className={`${btn} border-badln bg-badbg text-bad`}
          onClick={async () => { if (confirm('Liste ve bütün kelimeleri kalıcı olarak silinsin mi? Sahibi de göremez.') && (await call('DELETE'))) { router.push('/admin/listeler'); router.refresh(); } }}>
          Listeyi sil
        </button>
      </div>
      {err && <span className="text-sm text-bad" role="alert">{err}</span>}
    </div>
  );
}
