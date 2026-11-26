import NewsAdmin from '@/components/admin/NewsAdmin';
import { requireAdmin } from '@/lib/auth';
import { getNews } from '@/lib/news';

export const metadata = { title: 'Yenilikler' };

export default async function NewsAdminPage() {
  await requireAdmin();
  const list = await getNews({ all: true });
  return <NewsAdmin list={list} />;
}
