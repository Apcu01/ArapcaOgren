import { LiveHistoryList } from '@/components/live/LiveHistory';

export const metadata = { title: 'Geçmiş yarışmalarım', robots: { index: false } };

export default function LiveHistoryPage() {
  return <LiveHistoryList />;
}
