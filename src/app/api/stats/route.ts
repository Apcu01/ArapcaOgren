import { and, eq, gte, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { fail, ok } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { xpStats } from '@/lib/xp';

// Rozetler için hesaba bağlı sayılar: listelerde öğrenilen kelime, liste, canlı yarışma, puan ve lig derecesi
export async function GET() {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const L = schema.wordLists, W = schema.wordListItems;
  const [[words], [lists], [live], xs] = await Promise.all([
    db.select({ n: sql<number>`COUNT(*)` }).from(W).innerJoin(L, eq(L.id, W.listId)).where(and(eq(L.userId, user.id), gte(W.streak, 2))),
    db.select({ n: sql<number>`COUNT(*)` }).from(L).where(eq(L.userId, user.id)),
    db.select({ n: sql<number>`COUNT(*)` }).from(schema.liveResults).where(eq(schema.liveResults.userId, user.id)),
    xpStats(user.id)
  ]);
  const res = ok({ words: Number(words?.n || 0), lists: Number(lists?.n || 0), live: Number(live?.n || 0), xp: xs.xpTotal, podiums: xs.podiums });
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}
