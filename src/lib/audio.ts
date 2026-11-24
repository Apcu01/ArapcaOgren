import 'server-only';
import { createHash } from 'node:crypto';
import { cache } from 'react';
import { db, schema } from '@/db';
import { buildSafe, cached } from './cache';

/** Yüklenmiş ses kayıtlarının eşlemesi: harekesiz metin anahtarı -> kayıt numarası */
export const getAudioMap = cache((): Promise<Record<string, number>> => buildSafe(() => cached('audio:map', async () => {
  const rows = await db.select({ id: schema.audio.id, k: schema.audio.textKey }).from(schema.audio);
  return Object.fromEntries(rows.map((r) => [r.k, r.id]));
}), {}));

/* Eşleme sayfalara gömülmez (her sayfada ~160 KB'tı): tarayıcı /api/audio/map?v=SÜRÜM adresinden bir kez indirir.
   Sürüm eşlemenin içeriğinden üretilir; ses eklenip silindikçe değişir, aynı sürümün içeriği hiç değişmez. */
const versions = new WeakMap<object, string>();
export function audioVersion(map: Record<string, number>) {
  let v = versions.get(map);
  if (!v) {
    v = createHash('sha1').update(JSON.stringify(map)).digest('base64url').slice(0, 16);
    versions.set(map, v);
  }
  return v;
}
export const getAudioVersion = cache(async () => audioVersion(await getAudioMap()));

export const AUDIO_MIMES = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/aac', 'audio/x-m4a'];
export const AUDIO_MAX_BYTES = 2 * 1024 * 1024;
