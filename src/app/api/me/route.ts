import { getSessionUser } from '@/lib/auth';
import { ok } from '@/lib/api';
import { getMistakes } from '@/lib/mistakes';
import { getUserProgress } from '@/lib/progress';

// Oturum, ilerleme ve hatalar: sayfalar önceden hazırlandığı için tarayıcı bunları buradan alır
export async function GET() {
  const user = await getSessionUser();
  if (!user) return ok({ user: null }, 200);
  const [progress, mistakes] = await Promise.all([getUserProgress(user.id), getMistakes(user.id)]);
  const res = ok({ user, progress, mistakes });
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}
