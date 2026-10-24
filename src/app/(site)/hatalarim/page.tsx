import MistakesView from '@/components/MistakesView';
import { getTopics } from '@/lib/topics';

export const metadata = { title: 'Hatalarım', robots: { index: false } };

export default async function MistakesPage() {
  const topics = await getTopics();
  return <MistakesView topics={topics.map((t) => ({ id: t.id, name: t.name, n: t.n }))} />;
}
