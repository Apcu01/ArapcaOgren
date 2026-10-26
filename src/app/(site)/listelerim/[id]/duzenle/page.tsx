import { notFound } from 'next/navigation';
import ListEditor from '@/components/lists/ListEditor';
import { topicWords } from '../../topic-words';

export const metadata = { title: 'Listeyi düzenle', robots: { index: false } };

export default async function EditListPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return <ListEditor id={id} topics={await topicWords()} />;
}
