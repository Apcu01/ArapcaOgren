import { notFound } from 'next/navigation';
import TopicEditor from '@/components/admin/TopicEditor';
import { getAudioMap } from '@/lib/audio';
import { getNarrationIds } from '@/lib/narration';
import { getQuestionStats } from '@/lib/stats';
import { getTopic, getTopics } from '@/lib/topics';
import type { Topic } from '@/lib/types';

export const metadata = { title: 'Ders düzenle' };

export default async function EditTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audio = await getAudioMap();
  if (id === 'yeni') {
    const all = await getTopics({ all: true });
    const blank: Topic = {
      id: '', n: Math.max(0, ...all.map((t) => t.n)) + 1, level: 'Başlangıç', glyph: '', ar: '', name: '', desc: '', long: '', tags: '',
      readMins: 10, intro: '', lesson: [{ h: 'Giriş', p: [] }], keys: [], mistakes: [], words: [], acts: [], published: false
    };
    return <TopicEditor initial={blank} isNew audio={audio} qstats={{}} narr={{ sections: [], summary: null }} />;
  }
  const [t, qstats] = await Promise.all([getTopic(id, { all: true }), getQuestionStats(id)]);
  if (!t) notFound();
  const narr = await getNarrationIds(t);
  return <TopicEditor initial={t} isNew={false} audio={audio} qstats={qstats} narr={narr} />;
}
