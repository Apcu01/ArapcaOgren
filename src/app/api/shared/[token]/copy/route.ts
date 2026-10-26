import { getSessionUser } from '@/lib/auth';
import { fail, ok } from '@/lib/api';
import { copyShared } from '@/lib/lists';
import { LISTS_MAX } from '@/lib/study';

type Ctx = { params: Promise<{ token: string }> };

// Paylaşılan listeyi kendi listelerine kopyala (hesap gerekir)
export async function POST(_req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Kopyalamak için giriş yapmalısın.', 401);
  const r = await copyShared(user.id, (await params).token);
  if ('error' in r) return r.error === 'full' ? fail(`En fazla ${LISTS_MAX} liste oluşturabilirsin.`) : fail('Bu liste artık paylaşılmıyor.', 404);
  return ok({ id: r.id });
}
