import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { destroySession, getSessionUser } from '@/lib/auth';
import { fail, ok, parse } from '@/lib/api';
import { limitCheck, recordAttempt } from '@/lib/ratelimit';

const Patch = z.object({
  name: z.string().trim().min(2, 'Adın en az 2 karakter olmalı.').max(80).optional(),
  currentPassword: z.string().max(200).optional(),
  newPassword: z.string().min(8, 'Yeni şifre en az 8 karakter olmalı.').max(200).optional()
});

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail('Oturum yok.', 401);
  const p = await parse(req, Patch);
  if ('res' in p) return p.res;
  const { name, currentPassword, newPassword } = p.data;
  const set: Partial<typeof schema.users.$inferInsert> = {};
  if (name) set.name = name;
  if (newPassword) {
    const [u] = await db.select({ h: schema.users.passwordHash }).from(schema.users).where(eq(schema.users.id, user.id));
    // Google ile açılmış ve şifresi olmayan hesap ilk şifresini mevcut şifre olmadan belirleyebilir
    if (u.h) {
      const blocked = await limitCheck('password', req, user.email);
      if (blocked) return blocked;
      if (!currentPassword || !(await bcrypt.compare(currentPassword, u.h))) {
        await recordAttempt('password', req, user.email, false);
        return fail('Mevcut şifre hatalı.', 403);
      }
    }
    set.passwordHash = await bcrypt.hash(newPassword, 12);
  }
  if (Object.keys(set).length) await db.update(schema.users).set(set).where(eq(schema.users.id, user.id));
  return ok();
}

const Del = z.object({ password: z.string().max(200).optional(), confirm: z.string().max(20).optional() });

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail('Oturum yok.', 401);
  const p = await parse(req, Del);
  if ('res' in p) return p.res;
  const [u] = await db.select({ h: schema.users.passwordHash }).from(schema.users).where(eq(schema.users.id, user.id));
  if (u.h) {
    const blocked = await limitCheck('password', req, user.email);
    if (blocked) return blocked;
    if (!p.data.password || !(await bcrypt.compare(p.data.password, u.h))) {
      await recordAttempt('password', req, user.email, false);
      return fail('Şifre hatalı.', 403);
    }
  } else if (p.data.confirm !== 'SİL') {
    return fail('Onaylamak için kutuya SİL yaz.');
  }
  await destroySession();
  await db.delete(schema.users).where(eq(schema.users.id, user.id));
  return ok();
}
