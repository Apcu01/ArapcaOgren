import 'server-only';
import { cache } from 'react';
import { db, schema } from '@/db';
import { buildSafe, cached } from './cache';

/** Yüklenmiş ses kayıtlarının eşlemesi: harekesiz metin anahtarı -> kayıt numarası */
export const getAudioMap = cache((): Promise<Record<string, number>> => buildSafe(() => cached('audio:map', async () => {
  const rows = await db.select({ id: schema.audio.id, k: schema.audio.textKey }).from(schema.audio);
  return Object.fromEntries(rows.map((r) => [r.k, r.id]));
}), {}));

export const AUDIO_MIMES = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/aac', 'audio/x-m4a'];
export const AUDIO_MAX_BYTES = 2 * 1024 * 1024;
