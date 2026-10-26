import { notFound } from 'next/navigation';
import LiveHost from '@/components/live/LiveHost';

export const metadata = { title: 'Canlı yarışma (öğretmen)', robots: { index: false } };

export default async function LiveHostPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^\d{6}$/.test(code)) notFound();
  return <LiveHost code={code} />;
}
