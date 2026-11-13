import { notFound } from 'next/navigation';
import ReadingView from '@/components/reading/ReadingView';
import { getReading } from '@/lib/reading-store';

export const metadata = { title: 'Okuma metni önizleme' };

// Yayında olmayan metin de görülür; anlama soruları ilerlemeye kaydedilmez
export default async function AdminReadingPreview({ params }: { params: Promise<{ slug: string }> }) {
  const r = await getReading((await params).slug, { all: true });
  if (!r) notFound();
  return <ReadingView reading={r} lesson={null} next={null} preview />;
}
