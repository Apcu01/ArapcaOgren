import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopicView from '@/components/TopicView';
import { getNarrationIds } from '@/lib/narration';
import { getTopics } from '@/lib/topics';

export const metadata = { title: 'Ders önizleme', robots: { index: false } };

// Taslak dahil her dersin sitedeki görünümü (yalnızca yöneticiler; yönetim düzeni yetkiyi kontrol eder)
export default async function TopicPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = await getTopics({ all: true });
  const idx = all.findIndex((x) => x.id === id);
  const t = all[idx];
  if (!t) notFound();
  const nav = (x?: { id: string; name: string }) => (x ? { id: x.id, name: x.name } : null);
  return (
    <div className="flex flex-col gap-4 -mx-4 sm:-mx-6">
      <p className="m-0 mx-4 sm:mx-6 px-4 py-3 rounded-xl bg-progbg border border-progln text-prog text-sm font-semibold flex flex-wrap gap-x-3 justify-between">
        <span>Önizleme{t.published ? '' : ': bu ders taslak, sitede görünmüyor'}.</span>
        <Link href={`/admin/dersler/${t.id}`} className="text-prog underline underline-offset-4">Düzenlemeye dön</Link>
      </p>
      <TopicView topic={t} prev={nav(all[idx - 1])} next={nav(all[idx + 1])} narr={await getNarrationIds(t)} />
    </div>
  );
}
