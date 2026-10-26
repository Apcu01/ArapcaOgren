import { notFound } from 'next/navigation';
import ListOverview from '@/components/lists/ListOverview';

export const metadata = { title: 'Kelime listesi', robots: { index: false } };

export default async function ListPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return <ListOverview id={id} />;
}
