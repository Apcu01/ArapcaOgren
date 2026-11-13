import ReadingsAdmin from '@/components/admin/ReadingsAdmin';
import { getReadings } from '@/lib/reading-store';
import { getTopics } from '@/lib/topics';

export const metadata = { title: 'Okuma metinleri' };

export default async function AdminReadingsPage() {
  const [readings, topics] = await Promise.all([getReadings({ all: true }), getTopics({ all: true })]);
  const name = (id: string | null) => topics.find((t) => t.id === id)?.name || '';
  return (
    <ReadingsAdmin
      readings={readings.map((r) => ({ slug: r.slug, title: r.title, ar: r.ar, level: r.level, lesson: name(r.topic), sentences: r.sentences.length, questions: r.questions.length, published: !!r.published, ai: !!r.ai }))}
      topics={topics.map((t) => ({ id: t.id, name: `${t.n}. ${t.name}` }))}
    />
  );
}
