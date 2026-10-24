import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { newSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth';
import { exchangeCode, googleEnabled, OAUTH_COOKIE, safeNext, type GoogleProfile } from '@/lib/google';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fail = (code: string) => {
    const r = NextResponse.redirect(new URL(`/giris?hata=${code}`, url));
    r.cookies.delete({ name: OAUTH_COOKIE, path: '/api/auth/google' });
    return r;
  };
  if (!googleEnabled()) return fail('google-kapali');
  if (url.searchParams.get('error')) return fail('google-iptal');

  let saved: { state: string; verifier: string; next: string } | null = null;
  try {
    const raw = (await cookies()).get(OAUTH_COOKIE)?.value;
    saved = raw ? JSON.parse(raw) : null;
  } catch { saved = null; }
  const code = url.searchParams.get('code');
  if (!saved || !code || url.searchParams.get('state') !== saved.state) return fail('google-durum');

  let profile: GoogleProfile;
  try { profile = await exchangeCode(code, saved.verifier, req); } catch { return fail('google-hata'); }
  if (!profile.emailVerified || !profile.email) return fail('google-eposta');

  // 1) Google hesabı zaten bağlıysa o hesap  2) aynı e-postalı hesap varsa ona bağla  3) yoksa yeni hesap
  let [u] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.googleSub, profile.sub)).limit(1);
  if (!u) {
    [u] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, profile.email)).limit(1);
    if (u) await db.update(schema.users).set({ googleSub: profile.sub }).where(eq(schema.users.id, u.id));
  }
  if (!u) {
    const [r] = await db.insert(schema.users)
      .values({ name: profile.name, email: profile.email, googleSub: profile.sub, passwordHash: null, lastSeenAt: new Date() })
      .$returningId();
    u = { id: r.id };
  }
  await db.update(schema.users).set({ lastSeenAt: new Date() }).where(eq(schema.users.id, u.id));
  const { token, expiresAt } = await newSessionToken(u.id);

  // Misafir ilerlemesini aktarmak için istemci tarafındaki ara sayfaya git
  const res = NextResponse.redirect(new URL(`/giris/tamam?next=${encodeURIComponent(safeNext(saved.next))}`, url));
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  res.cookies.delete({ name: OAUTH_COOKIE, path: '/api/auth/google' });
  return res;
}
