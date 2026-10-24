import { desc } from 'drizzle-orm';
import { db, schema } from '@/db';
import AudioManager from '@/components/admin/AudioManager';
import { getAudioMap } from '@/lib/audio';
import { getTopics } from '@/lib/topics';

export const metadata = { title: 'Sesler' };

export default async function AudioPage() {
  const [topics, map, rows] = await Promise.all([
    getTopics({ all: true }),
    getAudioMap(),
    db.select({ id: schema.audio.id, text: schema.audio.text, size: schema.audio.size, mime: schema.audio.mime, createdAt: schema.audio.createdAt })
      .from(schema.audio).orderBy(desc(schema.audio.createdAt))
  ]);
  return (
    <AudioManager
      map={map}
      records={rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      topics={topics.map((t) => ({ id: t.id, name: t.name, n: t.n, words: t.words.map((w) => ({ ar: w.ar, tr: w.tr })) }))}
    />
  );
}
