import { notFound } from 'next/navigation';
import ClassView from '@/components/classes/ClassView';
import { READINGS } from '@/lib/readings';
import { getTopics } from '@/lib/topics';

export const metadata = { title: 'Sınıf', robots: { index: false } };

export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const topics = (await getTopics()).map((t) => ({ id: t.id, name: `${t.n}. ${t.name}` }));
  const readings = READINGS.map((r) => ({ id: r.slug, name: `${r.title} (${r.level})` }));
  return <ClassView id={id} topics={topics} readings={readings} />;
}
