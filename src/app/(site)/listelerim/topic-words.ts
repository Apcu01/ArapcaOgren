import { getTopics } from '@/lib/topics';
import type { TopicWords } from '@/components/lists/ListEditor';

/** Düzenleyicideki "Dersten ekle" için ders kelimeleri */
export async function topicWords(): Promise<TopicWords[]> {
  return (await getTopics()).map((t) => ({ id: t.id, name: t.name, words: (t.words || []).map((w) => ({ ar: w.ar, tl: w.tl || '', tr: w.tr })) }));
}
