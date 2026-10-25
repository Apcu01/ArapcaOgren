import { adminOrFail } from '@/lib/admin';
import { ok } from '@/lib/api';
import { snapshot } from '@/lib/presence';

export async function GET() {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  return ok(snapshot());
}
