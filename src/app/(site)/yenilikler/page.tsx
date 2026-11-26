import NewsView from '@/components/NewsView';
import { getNews } from '@/lib/news';

export const metadata = {
  title: 'Yenilikler',
  description: 'ArapcaOgren sitesine eklenen yeni dersler, alıştırmalar ve özelliklerin duyuruları.',
  alternates: { canonical: '/yenilikler' }
};

export default async function NewsPage() {
  // Tablo henüz yoksa (yayından sonra db:migrate çalışmadıysa) sayfa boş liste gösterir
  const list = await getNews().catch(() => []);
  return <NewsView list={list} />;
}
