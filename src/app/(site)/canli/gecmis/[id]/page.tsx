import { notFound } from 'next/navigation';
import { LiveHistoryItem } from '@/components/live/LiveHistory';

export const metadata = { title: 'Yarışma sonucu', robots: { index: false } };

export default async function LiveHistoryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return <LiveHistoryItem id={id} />;
}
