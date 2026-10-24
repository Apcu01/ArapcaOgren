import DictionaryView from '@/components/DictionaryView';
import { getTopics } from '@/lib/topics';

export const metadata = { title: 'Sözlük', description: 'Derslerde geçen bütün Arapça kelimeler: Türkçe ve İngilizce karşılıkları, okunuşları ve sesli telaffuzları.', alternates: { canonical: '/sozluk' } };

export default async function DictionaryPage({ searchParams }: { searchParams: Promise<{ konu?: string }> }) {
  const [{ konu }, topics] = await Promise.all([searchParams, getTopics()]);
  return <DictionaryView topics={topics} initialKonu={konu || ''} />;
}
