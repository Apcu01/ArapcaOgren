'use client';

import { useApp } from './AppProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { I, Raw } from './icons';

const LS_KEY = 'arblearn:v1';
const MISTAKES_KEY = 'arblearn:mistakes';

const GOOGLE_ERRORS: Record<string, string> = {
  'google-kapali': 'Google ile giriş bu sitede henüz etkin değil.',
  'google-iptal': 'Google ile giriş iptal edildi.',
  'google-durum': 'Google girişi zaman aşımına uğradı. Tekrar dene.',
  'google-hata': 'Google ile bağlantı kurulamadı. Tekrar dene.',
  'google-eposta': 'Google hesabının e-posta adresi doğrulanmamış.'
};

// Misafirken biriken ilerlemeyi ve hataları hesaba aktar, sonra tarayıcıdaki kopyayı temizle
export async function mergeGuestProgress() {
  try {
    const list = JSON.parse(localStorage.getItem(MISTAKES_KEY) || '[]');
    if (Array.isArray(list) && list.length) {
      const r = await fetch('/api/mistakes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'merge', items: list.slice(0, 500) }) });
      if (r.ok) localStorage.removeItem(MISTAKES_KEY);
    }
  } catch { /* yok say */ }
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    const has = raw.progress && Object.keys(raw.progress).length > 0;
    if (has || (raw.days && raw.days.length)) {
      const r = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'merge', state: { progress: raw.progress || {}, last: raw.last ?? null, days: raw.days || [], counts: raw.counts || {} } })
      });
      if (r.ok) localStorage.setItem(LS_KEY, JSON.stringify({}));
      return has;
    }
  } catch { /* yok say */ }
  return false;
}

export const inputCls = 'w-full h-[52px] px-4 rounded-[14px] bg-s2 border border-line2 text-ink font-medium text-base outline-none focus:border-lineh placeholder:text-faint';

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-soft">{label}</span>
      {children}
      {hint && <span className="text-xs text-faint">{hint}</span>}
    </label>
  );
}

export default function AuthForm({ mode, google = false, error }: { mode: 'login' | 'register'; google?: boolean; error?: string }) {
  const router = useRouter();
  const { refreshSession } = useApp();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(error ? GOOGLE_ERRORS[error] || '' : '');
  const googleHref = () => {
    const next = typeof window === 'undefined' ? null : new URLSearchParams(location.search).get('next');
    return '/api/auth/google' + (next ? '?next=' + encodeURIComponent(next) : '');
  };
  const isReg = mode === 'register';

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(['name', 'email', 'password'].filter((k) => f.has(k)).map((k) => [k, String(f.get(k))]));
    try {
      const r = await fetch(`/api/auth/${isReg ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(j.error || 'Bir hata oluştu, tekrar dene.'); setBusy(false); return; }
      await mergeGuestProgress();
      await refreshSession();
      const next = new URLSearchParams(location.search).get('next');
      router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : '/');
      router.refresh();
    } catch {
      setErr('Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.');
      setBusy(false);
    }
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 flex flex-wrap gap-10 items-start justify-center">
      <div className="flex-[1_1_380px] max-w-[460px] flex flex-col gap-4 pt-2">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">{isReg ? 'Hesap aç' : 'Giriş yap'}</span>
        <h1 className="m-0 text-[36px] sm:text-[44px] leading-[1.1] tracking-[-0.025em] font-bold">{isReg ? 'İlerlemen her cihazda seninle' : 'Tekrar hoş geldin'}</h1>
        <p className="m-0 text-lg leading-relaxed text-mute">
          Hesap açmak zorunlu değil: bütün dersler ve etkinlikler hesapsız da çalışır. Hesabın olursa okuduğun konular, etkinlik skorların ve serin veritabanına kaydedilir; telefondan, bilgisayardan kaldığın yerden devam edersin.
        </p>
        <div className="flex gap-3 p-4 sm:p-5 rounded-2xl bg-progbg/60 border border-progln">
          <span className="text-prog shrink-0 mt-0.5"><Raw html={I.bulb(20)} /></span>
          <p className="m-0 text-[15px] leading-relaxed text-prose">Bu tarayıcıda hesapsız çalıştıysan, {isReg ? 'hesap açtığında' : 'giriş yaptığında'} mevcut ilerlemen otomatik olarak hesabına aktarılır.</p>
        </div>
      </div>
      <form onSubmit={submit} className="flex-[1_1_380px] max-w-[460px] flex flex-col gap-5 p-7 rounded-[22px] bg-s4 border border-line3" noValidate>
        <h2 className="m-0 text-2xl font-bold">{isReg ? 'Yeni hesap' : 'Giriş'}</h2>
        {google && (
          <>
            <a href="/api/auth/google" onClick={(e) => { e.currentTarget.href = googleHref(); }}
              className="h-[50px] rounded-xl bg-ink text-onacc font-bold text-[15px] inline-flex items-center justify-center gap-3 hover:text-onacc hover:brightness-95">
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z" />
                <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-5 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
              </svg>
              Google ile devam et
            </a>
            <div className="flex items-center gap-3 text-xs text-faint"><span className="h-px flex-1 bg-line2" />ya da e-postayla<span className="h-px flex-1 bg-line2" /></div>
          </>
        )}
        {isReg && <Field label="Adın"><input name="name" required minLength={2} maxLength={80} autoComplete="name" className={inputCls} placeholder="Ad Soyad" /></Field>}
        <Field label="E-posta"><input name="email" type="email" required autoComplete="email" className={inputCls} placeholder="ornek@eposta.com" /></Field>
        <Field label="Şifre" hint={isReg ? 'En az 8 karakter.' : undefined}>
          <input name="password" type="password" required minLength={isReg ? 8 : 1} autoComplete={isReg ? 'new-password' : 'current-password'} className={inputCls} />
        </Field>
        {err && <p role="alert" className="m-0 px-4 py-3 rounded-xl bg-badbg border border-badln text-bad text-sm">{err}</p>}
        <button type="submit" disabled={busy} className="h-[50px] rounded-xl bg-acc text-onacc font-bold text-[15px] inline-flex items-center justify-center gap-2 disabled:opacity-60">
          {busy ? 'Lütfen bekle' : isReg ? 'Hesabı oluştur' : 'Giriş yap'} {!busy && <Raw html={I.arrow()} />}
        </button>
        <p className="m-0 text-sm text-mute text-center">
          {isReg ? <>Zaten hesabın var mı? <Link href="/giris">Giriş yap</Link></> : <>Hesabın yok mu? <Link href="/kayit">Hesap aç</Link></>}
        </p>
      </form>
    </div>
  );
}
