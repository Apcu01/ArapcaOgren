import 'server-only';
import { and, eq, gt, lt, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { blockedFor, RULES, waitMessage, type AttemptKind } from './limits';

/** İstemcinin IP adresi (vekil sunucu arkasında X-Forwarded-For'un ilk değeri) */
export function clientIp(req: Request) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim().slice(0, 64);
  return (req.headers.get('x-real-ip') || 'yerel').slice(0, 64);
}

/** Engel varsa 429 yanıtı döndürür, yoksa null */
export async function limitCheck(kind: AttemptKind, req: Request, email: string | null) {
  const ip = clientIp(req);
  const since = new Date(Date.now() - RULES[kind].windowMin * 60e3);
  const who = email ? or(eq(schema.authAttempts.ip, ip), eq(schema.authAttempts.email, email)) : eq(schema.authAttempts.ip, ip);
  const rows = await db.select({ email: schema.authAttempts.email, ip: schema.authAttempts.ip, ok: schema.authAttempts.ok, createdAt: schema.authAttempts.createdAt })
    .from(schema.authAttempts)
    .where(and(eq(schema.authAttempts.kind, kind), gt(schema.authAttempts.createdAt, since), who));
  const wait = blockedFor(kind, rows, email, ip);
  if (!wait) return null;
  return NextResponse.json({ error: waitMessage(wait) }, { status: 429, headers: { 'Retry-After': String(wait) } });
}

export async function recordAttempt(kind: AttemptKind, req: Request, email: string | null, ok: boolean) {
  await db.insert(schema.authAttempts).values({ kind, ip: clientIp(req), email, ok });
  // Ara sıra bir günden eski kayıtları temizle
  if (Math.random() < 0.02) {
    await db.delete(schema.authAttempts).where(lt(schema.authAttempts.createdAt, new Date(Date.now() - 864e5)));
  }
}
