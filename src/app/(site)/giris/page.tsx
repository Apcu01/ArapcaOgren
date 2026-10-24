import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { getSessionUser } from '@/lib/auth';
import { googleEnabled } from '@/lib/google';

export const metadata = { title: 'Giriş yap' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ hata?: string }> }) {
  if (await getSessionUser()) redirect('/hesap');
  const { hata } = await searchParams;
  return <AuthForm mode="login" google={googleEnabled()} error={hata} />;
}
