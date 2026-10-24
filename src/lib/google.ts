import 'server-only';
import crypto from 'node:crypto';

export const googleEnabled = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export const OAUTH_COOKIE = 'arb_oauth';

/** Sitenin kök adresi: SITE_URL tanımlıysa o, değilse isteğin geldiği adres */
export function siteUrl(req?: Request) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '');
  if (req) return new URL(req.url).origin;
  return 'http://localhost:3000';
}
export const redirectUri = (req: Request) => `${siteUrl(req)}/api/auth/google/callback`;

const b64url = (b: Buffer) => b.toString('base64url');
export function pkce() {
  const verifier = b64url(crypto.randomBytes(32));
  const challenge = b64url(crypto.createHash('sha256').update(verifier).digest());
  const state = b64url(crypto.randomBytes(16));
  return { verifier, challenge, state };
}

/** Yalnızca sitenin kendi sayfalarına yönlendirmeye izin ver */
export const safeNext = (n: string | null | undefined) => (n && n.startsWith('/') && !n.startsWith('//') && !n.startsWith('/\\') ? n : '/');

export type GoogleProfile = { sub: string; email: string; emailVerified: boolean; name: string };

/** Yetki kodunu belirteçle değiştirir; kimlik belirtecini doğrudan Google'ın uç noktasından aldığımız için içeriğine güvenilir */
export async function exchangeCode(code: string, verifier: string, req: Request): Promise<GoogleProfile> {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri(req),
      grant_type: 'authorization_code',
      code_verifier: verifier
    })
  });
  if (!r.ok) throw new Error('Google belirteç değişimi başarısız: ' + r.status);
  const j = (await r.json()) as { id_token?: string };
  if (!j.id_token) throw new Error('Kimlik belirteci yok');
  const payload = JSON.parse(Buffer.from(j.id_token.split('.')[1], 'base64url').toString('utf8'));
  const issOk = payload.iss === 'https://accounts.google.com' || payload.iss === 'accounts.google.com';
  if (!issOk || payload.aud !== process.env.GOOGLE_CLIENT_ID || payload.exp * 1000 < Date.now()) throw new Error('Geçersiz kimlik belirteci');
  return {
    sub: String(payload.sub),
    email: String(payload.email || '').toLowerCase(),
    emailVerified: payload.email_verified === true || payload.email_verified === 'true',
    name: String(payload.name || payload.given_name || payload.email || 'Öğrenci').slice(0, 80)
  };
}
