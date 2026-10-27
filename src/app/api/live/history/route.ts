import { fail } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { listLiveResults } from '@/lib/live-history';

// Öğretmenin geçmiş yarışmaları
export async function GET() {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const rows = await listLiveResults(user.id);
  return Response.json({ results: rows.map((r) => ({ ...r, startedAt: r.startedAt.toISOString() })) }, { headers: { 'Cache-Control': 'private, no-store' } });
}
