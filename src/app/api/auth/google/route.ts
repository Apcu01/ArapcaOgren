import { NextResponse } from 'next/server';
import { googleEnabled, OAUTH_COOKIE, pkce, redirectUri, safeNext } from '@/lib/google';

// Google giriş sayfasına yönlendir
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!googleEnabled()) return NextResponse.redirect(new URL('/giris?hata=google-kapali', url));
  const { verifier, challenge, state } = pkce();
  const next = safeNext(url.searchParams.get('next'));
  const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  auth.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri(req),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account'
  }).toString();
  const res = NextResponse.redirect(auth);
  res.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, verifier, next }), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/api/auth/google', maxAge: 600
  });
  return res;
}
