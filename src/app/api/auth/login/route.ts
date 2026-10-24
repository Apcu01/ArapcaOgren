import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { createSession } from '@/lib/auth';
import { fail, ok, parse } from '@/lib/api';
import { limitCheck, recordAttempt } from '@/lib/ratelimit';

const Body = z.object({
  email: z.string().trim().toLowerCase().min(1, 'E-posta adresini gir.').max(190),
  password: z.string().min(1, 'Şifreni gir.').max(200)
});

// Hesap yoksa da bcrypt karşılaştırması yapılsın: yanıt süresinden hesabın varlığı anlaşılmasın
let dummy: string | null = null;

export async function POST(req: Request) {
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const email = p.data.email;
  const blocked = await limitCheck('login', req, email);
  if (blocked) return blocked;
  const [u] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  dummy ??= await bcrypt.hash('arapcaogren-dummy', 12);
  const good = await bcrypt.compare(p.data.password, u?.passwordHash || dummy);
  if (!u || !good) {
    await recordAttempt('login', req, email, false);
    // Hesabın var olup olmadığını belli etmeyen tek bir mesaj
    return fail('E-posta ya da şifre hatalı. Hesabını Google ile açtıysan "Google ile devam et" düğmesini kullan.', 401);
  }
  await recordAttempt('login', req, email, true);
  await createSession(u.id);
  await db.update(schema.users).set({ lastSeenAt: new Date() }).where(eq(schema.users.id, u.id));
  return ok();
}
