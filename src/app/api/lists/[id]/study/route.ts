import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { fail, ok, parse } from '@/lib/api';
import { appendItem, recordAnswers, resetProgress, saveBest, setShare, setStar } from '@/lib/lists';
import { markDay } from '@/lib/progress';
import { dayKey } from '@/lib/text';
import { ItemZ, listId } from '../../schema';

type Ctx = { params: Promise<{ id: string }> };
const itemId = z.number().int().positive();
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional();

const Body = z.discriminatedUnion('action', [
  // Kartlar, Öğren ve Test cevapları (kelimenin öğrenilme durumu)
  z.object({ action: z.literal('answers'), results: z.array(z.object({ id: itemId, ok: z.boolean() })).min(1).max(300), day }),
  z.object({ action: z.literal('star'), itemId, on: z.boolean() }),
  z.object({ action: z.literal('reset') }),
  // Oyun sonucu: eşleştirme süresi (ms) ya da puan
  z.object({ action: z.literal('best'), game: z.enum(['match', 'blast', 'blocks', 'charms']), value: z.number().int().min(0).max(100_000_000), day }),
  z.object({ action: z.literal('add'), item: ItemZ }),
  // Paylaşım bağlantısını aç / kapat / yenile
  z.object({ action: z.literal('share'), on: z.boolean(), renew: z.boolean().optional() })
]);

export async function POST(req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const id = listId((await params).id);
  if (!id) return fail('Liste bulunamadı.', 404);
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const b = p.data;
  const missing = () => fail('Liste bulunamadı.', 404);
  switch (b.action) {
    case 'answers':
      if (!(await recordAnswers(user.id, id, b.results))) return missing();
      // Liste çalışmak da o günü çalışılmış sayar (çalışma takvimi ve seri)
      await markDay(user.id, b.day || dayKey(new Date()));
      return ok();
    case 'star':
      return (await setStar(user.id, id, b.itemId, b.on)) ? ok() : missing();
    case 'reset':
      return (await resetProgress(user.id, id)) ? ok() : missing();
    case 'best': {
      const r = await saveBest(user.id, id, b.game, b.value);
      if (!r) return missing();
      await markDay(user.id, b.day || dayKey(new Date()));
      return ok(r);
    }
    case 'share': {
      const token = await setShare(user.id, id, b.on, b.renew);
      return token === undefined ? missing() : ok({ token });
    }
    case 'add': {
      const r = await appendItem(user.id, id, b.item);
      if (r === 'missing') return missing();
      if (r === 'full') return fail('Bu liste dolu (en fazla 300 kelime).');
      return ok({ added: r === 'ok' });
    }
  }
}
