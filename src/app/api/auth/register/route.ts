import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { createSession } from '@/lib/auth';
import { fail, ok, parse } from '@/lib/api';
import { limitCheck, recordAttempt } from '@/lib/ratelimit';

const Body = z.object({
  name: z.string().trim().min(2, 'Adın en az 2 karakter olmalı.').max(80, 'Ad en fazla 80 karakter olabilir.'),
  email: z.string().trim().toLowerCase().max(190, 'E-posta çok uzun.').pipe(z.email('Geçerli bir e-posta adresi gir.')),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı.').max(200)
});

export async function POST(req: Request) {
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const { name, email, password } = p.data;
  const blocked = await limitCheck('register', req, null);
  if (blocked) return blocked;
  const exists = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
  if (exists.length) return fail('Bu e-posta ile kayıtlı bir hesap zaten var.', 409);
  const [r] = await db.insert(schema.users)
    .values({ name, email, passwordHash: await bcrypt.hash(password, 12), lastSeenAt: new Date() })
    .$returningId();
  await recordAttempt('register', req, email, true);
  await createSession(r.id);
  return ok();
}
