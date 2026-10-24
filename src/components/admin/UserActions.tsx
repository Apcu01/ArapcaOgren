'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UserActions({ id, role, self }: { id: number; role: 'user' | 'admin'; self: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function call(method: 'PATCH' | 'DELETE', body?: unknown) {
    setBusy(true);
    setErr('');
    const r = await fetch(`/api/admin/users/${id}`, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(j.error || 'İşlem başarısız.'); return false; }
    return true;
  }

  const btn = 'h-10 px-4 rounded-xl border text-sm font-semibold disabled:opacity-50';
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2 justify-end">
        <button type="button" disabled={busy} className={`${btn} border-line3 bg-s2 text-soft hover:border-lineh`}
          onClick={async () => {
            const to = role === 'admin' ? 'user' : 'admin';
            if (!confirm(to === 'admin' ? 'Bu kullanıcı yönetici yapılsın mı? Tüm yönetim paneline erişebilecek.' : 'Yöneticilik yetkisi kaldırılsın mı?')) return;
            if (await call('PATCH', { role: to })) router.refresh();
          }}>
          {role === 'admin' ? 'Yöneticiliği kaldır' : 'Yönetici yap'}
        </button>
        <button type="button" disabled={busy} className={`${btn} border-line3 bg-s2 text-soft hover:border-lineh`}
          onClick={async () => { if (confirm('Bu kullanıcının tüm ilerlemesi silinsin mi?') && (await call('PATCH', { resetProgress: true }))) router.refresh(); }}>
          İlerlemeyi sıfırla
        </button>
        {!self && (
          <button type="button" disabled={busy} className={`${btn} border-badln text-bad hover:bg-badbg`}
            onClick={async () => { if (confirm('Kullanıcı ve tüm verileri kalıcı olarak silinsin mi?') && (await call('DELETE'))) { router.push('/admin/kullanicilar'); router.refresh(); } }}>
            Kullanıcıyı sil
          </button>
        )}
      </div>
      {err && <p role="alert" className="m-0 text-sm text-bad">{err}</p>}
    </div>
  );
}
