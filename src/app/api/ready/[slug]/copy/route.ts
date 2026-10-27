import { getSessionUser } from '@/lib/auth';
import { fail, ok } from '@/lib/api';
import { countLists, createList } from '@/lib/lists';
import { readyList } from '@/lib/ready-lists';
import { LISTS_MAX } from '@/lib/study';
import { readyWords } from '@/lib/words';

type Ctx = { params: Promise<{ slug: string }> };

// Hazır listeyi kendi listelerine kopyala (hesap gerekir); kopya bağımsızdır
export async function POST(_req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Kopyalamak için giriş yapmalısın.', 401);
  const l = readyList((await params).slug);
  if (!l) return fail('Liste bulunamadı.', 404);
  if ((await countLists(user.id)) >= LISTS_MAX) return fail(`En fazla ${LISTS_MAX} liste oluşturabilirsin.`);
  const words = await readyWords(l.words);
  const id = await createList(user.id, l.title, l.description, words.map((w) => ({ ar: w.ar, tl: w.tl, tr: w.tr, note: '' })));
  return ok({ id });
}
