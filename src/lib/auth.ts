import 'server-only';
import crypto from 'node:crypto';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { and, eq, gt } from 'drizzle-orm';
import { db, schema } from '@/db';
import type { SessionUser } from './types';

export const SESSION_COOKIE = 'arb_session';
const SESSION_DAYS = 30;

const hash = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

// Oturum bilgisi 60 saniye bellekte tutulur: her sayfa geçişinde uzak veritabanına gidilmez (~85 ms kazanç).
// Çıkış yapınca o oturum, rol / ad / hesap değişince hepsi hemen silinir.
const g = globalThis as unknown as { __arbSess?: Map<string, { u: SessionUser | null; at: number }> };
const sessCache = (g.__arbSess ??= new Map());
const SESSION_CACHE_MS = 60_000;
export function clearSessionCache() { sessCache.clear(); }

export const sessionCookieOptions = (expires: Date) => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  expires
});

/** Oturum kaydı oluşturur; çerezi çağıran yazar */
export async function newSessionToken(userId: number) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db.insert(schema.sessions).values({ id: hash(token), userId, expiresAt });
  return { token, expiresAt };
}

export async function createSession(userId: number) {
  const { token, expiresAt } = await newSessionToken(userId);
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) { sessCache.delete(hash(token)); await db.delete(schema.sessions).where(eq(schema.sessions.id, hash(token))); }
  jar.delete(SESSION_COOKIE);
}

// Aynı istek içinde tek sorgu
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const key = hash(token);
  const hit = sessCache.get(key);
  if (hit && Date.now() - hit.at < SESSION_CACHE_MS) return hit.u;
  const rows = await db
    .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, role: schema.users.role, lastSeenAt: schema.users.lastSeenAt })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.id, key), gt(schema.sessions.expiresAt, new Date())))
    .limit(1);
  const u = rows[0];
  if (sessCache.size > 5000) sessCache.clear();
  if (!u) { sessCache.set(key, { u: null, at: Date.now() }); return null; }
  // Son görülme zamanını en fazla 10 dakikada bir güncelle
  if (!u.lastSeenAt || Date.now() - u.lastSeenAt.getTime() > 10 * 60e3) {
    await db.update(schema.users).set({ lastSeenAt: new Date() }).where(eq(schema.users.id, u.id));
  }
  const user: SessionUser = { id: u.id, name: u.name, email: u.email, role: u.role };
  sessCache.set(key, { u: user, at: Date.now() });
  return user;
});

export async function requireUser() {
  const u = await getSessionUser();
  if (!u) redirect('/giris');
  return u;
}

// Yönetici olmayanlara panelin varlığını bile gösterme
export async function requireAdmin() {
  const u = await getSessionUser();
  if (!u || u.role !== 'admin') notFound();
  return u;
}
