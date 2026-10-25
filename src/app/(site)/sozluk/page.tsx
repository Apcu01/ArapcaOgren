import DictionaryView from '@/components/DictionaryView';
import { getTopics } from '@/lib/topics';
import { getWordSlugMap } from '@/lib/words';

export const metadata = { title: 'Sözlük', description: 'Derslerde geçen bütün Arapça kelimeler: Türkçe ve İngilizce karşılıkları, okunuşları ve sesli telaffuzları.', alternates: { canonical: '/sozluk' } };

// Önceden hazırlanır; ?konu= süzgeci tarayıcıda okunur
export default async function DictionaryPage() {
  const [topics, slugs] = await Promise.all([getTopics(), getWordSlugMap()]);
  return <DictionaryView topics={topics} slugs={slugs} />;
}
