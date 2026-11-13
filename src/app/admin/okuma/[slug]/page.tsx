import { notFound } from 'next/navigation';
import ReadingEditor from '@/components/admin/ReadingEditor';
import { getReading } from '@/lib/reading-store';
import type { Reading } from '@/lib/readings';
import { getTopics } from '@/lib/topics';

export const metadata = { title: 'Okuma metni düzenle' };

const EMPTY: Reading = { slug: '', title: '', ar: '', level: 'Başlangıç', topic: null, desc: '', sentences: [{ w: [], tr: '' }], questions: [] };

export default async function AdminReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isNew = slug === 'yeni';
  const r = isNew ? EMPTY : await getReading(slug, { all: true });
  if (!r) notFound();
  const topics = (await getTopics({ all: true })).map((t) => ({ id: t.id, name: `${t.n}. ${t.name}` }));
  return <ReadingEditor initial={r} isNew={isNew} topics={topics} />;
}
