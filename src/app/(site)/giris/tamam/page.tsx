import GoogleDone from '@/components/GoogleDone';

export const metadata = { title: 'Giriş yapılıyor', robots: { index: false } };

export default async function GoogleDonePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <GoogleDone next={next || '/'} />;
}
