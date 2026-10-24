import { eq } from 'drizzle-orm';
import AccountView from '@/components/AccountView';
import { db, schema } from '@/db';
import { requireUser } from '@/lib/auth';

export const metadata = { title: 'Hesabım' };

export default async function AccountPage() {
  const user = await requireUser();
  const [u] = await db.select({ createdAt: schema.users.createdAt, hasPw: schema.users.passwordHash, google: schema.users.googleSub }).from(schema.users).where(eq(schema.users.id, user.id));
  return <AccountView createdAt={u.createdAt.toISOString()} hasPassword={!!u.hasPw} google={!!u.google} />;
}
