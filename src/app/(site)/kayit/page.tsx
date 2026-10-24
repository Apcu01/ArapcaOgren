import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { getSessionUser } from '@/lib/auth';
import { googleEnabled } from '@/lib/google';

export const metadata = { title: 'Hesap aç' };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ hata?: string }> }) {
  if (await getSessionUser()) redirect('/hesap');
  const { hata } = await searchParams;
  return <AuthForm mode="register" google={googleEnabled()} error={hata} />;
}
