import ListsView from '@/components/lists/ListsView';

export const metadata = { title: 'Listelerim', description: 'Kendi Arapça kelime listelerini oluştur; kartlar, öğrenme, test ve oyunlarla çalış.', robots: { index: false } };

export default function ListsPage() {
  return <ListsView />;
}
