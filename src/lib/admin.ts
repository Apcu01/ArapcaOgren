import 'server-only';
import { getSessionUser } from './auth';
import { fail } from './api';

/** API uçları için yönetici kontrolü */
export async function adminOrFail() {
  const u = await getSessionUser();
  if (!u) return { res: fail('Oturum yok.', 401) } as const;
  if (u.role !== 'admin') return { res: fail('Bu işlem için yetkin yok.', 403) } as const;
  return { user: u } as const;
}
