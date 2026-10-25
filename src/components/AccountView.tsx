'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from './AppProvider';
import { Field, inputCls } from './AuthForm';
import { clearPageCache } from './ServiceWorker';

type Msg = { ok: boolean; text: string } | null;

async function send(method: string, body: unknown) {
  const r = await fetch('/api/account', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, error: j.error as string | undefined };
}

function Note({ m }: { m: Msg }) {
  if (!m) return null;
  return <p role="status" className={`m-0 px-4 py-3 rounded-xl text-sm border ${m.ok ? 'bg-okbg border-okln text-okt' : 'bg-badbg border-badln text-bad'}`}>{m.text}</p>;
}

export default function AccountView({ createdAt, hasPassword, google }: { createdAt: string; hasPassword: boolean; google: boolean }) {
  const { user, streak, state, refreshSession } = useApp();
  const router = useRouter();
  const [m1, setM1] = useState<Msg>(null);
  const [m2, setM2] = useState<Msg>(null);
  const [m3, setM3] = useState<Msg>(null);
  if (!user) return null;
  const lessons = Object.values(state.progress).filter((p) => p.lesson).length;
  const acts = Object.values(state.progress).reduce((n, p) => n + Object.values(p.acts).filter((a) => a.done).length, 0);

  async function saveName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get('name'));
    const r = await send('PATCH', { name });
    setM1(r.ok ? { ok: true, text: 'Adın güncellendi.' } : { ok: false, text: r.error || 'Kaydedilemedi.' });
    if (r.ok) { await refreshSession(); router.refresh(); }
  }
  async function savePass(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const r = await send('PATCH', { currentPassword: hasPassword ? String(f.get('cur')) : undefined, newPassword: String(f.get('new')) });
    setM2(r.ok ? { ok: true, text: hasPassword ? 'Şifren değiştirildi.' : 'Şifren belirlendi. Artık e-postanla da giriş yapabilirsin.' } : { ok: false, text: r.error || 'Değiştirilemedi.' });
    if (r.ok) { form.reset(); if (!hasPassword) router.refresh(); }
  }
  async function del(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirm('Hesabın ve tüm ilerlemen kalıcı olarak silinecek. Emin misin?')) return;
    const fd = new FormData(e.currentTarget);
    const r = await send('DELETE', hasPassword ? { password: String(fd.get('pw')) } : { confirm: String(fd.get('pw')).trim().toLocaleUpperCase('tr') });
    if (!r.ok) { setM3({ ok: false, text: r.error || 'Silinemedi.' }); return; }
    await refreshSession();
    router.push('/');
    router.refresh();
  }
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearPageCache();
    await refreshSession();
    router.push('/');
    router.refresh();
  }

  const card = 'p-6 sm:p-7 rounded-[20px] bg-s3 border border-line2 flex flex-col gap-4';
  const btn = 'self-start h-11 px-5 rounded-xl bg-acc text-onacc font-bold text-[15px]';
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Hesabım</span>
          <h1 className="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">Merhaba, {user.name}</h1>
          <p className="m-0 text-mute">{user.email} · {new Date(createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} tarihinden beri üye{google ? ' · Google hesabı bağlı' : ''}</p>
        </div>
        <button type="button" onClick={logout} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Çıkış yap</button>
      </div>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        {[['Okunan konu', lessons], ['Tamamlanan etkinlik', acts], ['Seri', streak + ' gün']].map(([l, v]) => (
          <div key={l} className="p-5 rounded-2xl bg-s3 border border-line2 flex flex-col gap-1"><span className="text-sm text-mute2">{l}</span><span className="text-[28px] font-bold">{v}</span></div>
        ))}
      </div>
      <p className="m-0 -mt-4 text-sm text-faint">Ayrıntılar için <Link href="/ilerleme">İlerlemem</Link> sayfasına bak.</p>

      <form onSubmit={saveName} className={card}>
        <h2 className="m-0 text-xl font-bold">Profil</h2>
        <Field label="Adın"><input name="name" defaultValue={user.name} required minLength={2} maxLength={80} className={inputCls} /></Field>
        <Note m={m1} />
        <button type="submit" className={btn}>Kaydet</button>
      </form>

      <form onSubmit={savePass} className={card}>
        <h2 className="m-0 text-xl font-bold">{hasPassword ? 'Şifre değiştir' : 'Şifre belirle'}</h2>
        {!hasPassword && <p className="m-0 text-sm text-mute">Hesabını Google ile açtın. İstersen bir şifre belirleyip e-postanla da giriş yapabilirsin.</p>}
        {hasPassword && <Field label="Mevcut şifre"><input name="cur" type="password" required autoComplete="current-password" className={inputCls} /></Field>}
        <Field label="Yeni şifre" hint="En az 8 karakter."><input name="new" type="password" required minLength={8} autoComplete="new-password" className={inputCls} /></Field>
        <Note m={m2} />
        <button type="submit" className={btn}>Şifreyi değiştir</button>
      </form>

      <form onSubmit={del} className="p-6 sm:p-7 rounded-[20px] border border-badln bg-badbg/50 flex flex-col gap-4">
        <h2 className="m-0 text-xl font-bold">Hesabı sil</h2>
        <p className="m-0 text-sm text-mute">Hesabın ve kayıtlı tüm ilerlemen kalıcı olarak silinir. Geri alınamaz.</p>
        {hasPassword
          ? <Field label="Onaylamak için şifren"><input name="pw" type="password" required autoComplete="current-password" className={inputCls} /></Field>
          : <Field label="Onaylamak için SİL yaz"><input name="pw" type="text" required autoComplete="off" className={inputCls} /></Field>}
        <Note m={m3} />
        <button type="submit" className="self-start h-11 px-5 rounded-xl border border-badln text-bad font-semibold hover:bg-badbg">Hesabımı sil</button>
      </form>
    </div>
  );
}
