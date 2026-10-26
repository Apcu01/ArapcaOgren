import ListEditor from '@/components/lists/ListEditor';
import { topicWords } from '../topic-words';

export const metadata = { title: 'Yeni liste', robots: { index: false } };

export default async function NewListPage() {
  return <ListEditor topics={await topicWords()} />;
}
