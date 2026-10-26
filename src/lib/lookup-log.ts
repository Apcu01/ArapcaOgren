import 'server-only';
import { db, schema } from '@/db';
import { isAr, normAr } from './text';
import { phonKey } from './translit';

export type LogSource = 'lesson' | 'lexicon' | 'cache' | 'ai' | 'login' | 'none' | 'error';

/** Gruplama anahtarı: aynı kelimenin farklı yazımları (efvan, afvan) bir arada sayılsın */
export const logKey = (q: string) => (isAr(q) ? 'ar:' + normAr(q).replace(/\s+/g, '') : 'tl:' + (phonKey(q) || q.trim().toLocaleLowerCase('tr'))).slice(0, 120);

/** Aramayı günlüğe yazar; hata aramayı bozmasın diye yutulur */
export async function logLookup(e: { q: string; source: LogSource; near?: boolean; ar?: string; tr?: string; userId?: number | null; anonId?: string | null }) {
  try {
    await db.insert(schema.lookupLog).values({
      query: e.q.trim().slice(0, 80), qkey: logKey(e.q), source: e.source, near: !!e.near,
      resultAr: e.ar?.slice(0, 120) ?? null, resultTr: e.tr?.slice(0, 300) ?? null,
      userId: e.userId ?? null, anonId: e.anonId?.slice(0, 64) ?? null
    });
  } catch (err) {
    console.error('Arama günlüğü yazılamadı:', (err as Error).message);
  }
}
