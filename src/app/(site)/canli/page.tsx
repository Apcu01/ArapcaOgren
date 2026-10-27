import LiveLanding from '@/components/live/LiveLanding';
import { getShared } from '@/lib/lists';
import { getTopics } from '@/lib/topics';
import { READY_LISTS } from '@/lib/ready-lists';

export const metadata = {
  title: 'Canlı yarışma',
  description: 'Sınıfça Arapça kelime yarışması: öğretmen yarışmayı açar, öğrenciler telefondan PIN ile katılır. Hesap gerekmez.',
  alternates: { canonical: '/canli' }
};

// ?paylasim= ile paylaşılan bir listeden yarışma açılabilir (listenin adı sunucuda okunur)
export default async function LivePage({ searchParams }: { searchParams: Promise<{ paylasim?: string }> }) {
  const [topics, sp] = await Promise.all([getTopics(), searchParams]);
  const s = sp.paylasim ? await getShared(sp.paylasim) : null;
  return (
    <LiveLanding
      topics={topics.map((t) => ({ id: t.id, name: t.name, n: t.n, words: (t.words || []).length }))}
      shared={s && sp.paylasim ? { token: sp.paylasim, title: s.title, count: s.count } : null}
      ready={READY_LISTS.map((l) => ({ slug: l.slug, title: l.title, count: l.words.length }))}
    />
  );
}
