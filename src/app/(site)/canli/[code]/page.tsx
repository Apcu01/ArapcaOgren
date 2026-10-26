import { notFound } from 'next/navigation';
import LivePlayer from '@/components/live/LivePlayer';

export const metadata = { title: 'Canlı yarışma', robots: { index: false } };

export default async function LivePlayerPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^\d{6}$/.test(code)) notFound();
  return <LivePlayer code={code} />;
}
