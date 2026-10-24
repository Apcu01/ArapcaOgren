import ProgressView from '@/components/ProgressView';
import { getTopics } from '@/lib/topics';

export const metadata = { title: 'İlerlemem' };

export default async function ProgressPage() {
  return <ProgressView topics={await getTopics()} />;
}
