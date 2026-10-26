import { z } from 'zod';
import { LIST_MAX_ITEMS } from '@/lib/study';

export const ItemZ = z.object({
  id: z.number().int().positive().optional(),
  ar: z.string().trim().min(1, 'Her kelimenin Arapçasını yaz.').max(120, 'Arapça yazım en fazla 120 karakter.').regex(/[؀-ۿ]/, 'Arapça sütununa Arapça harflerle yaz.'),
  tl: z.string().trim().max(120, 'Okunuş en fazla 120 karakter.').default(''),
  tr: z.string().trim().min(1, 'Her kelimenin Türkçe anlamını yaz.').max(300, 'Anlam en fazla 300 karakter.'),
  note: z.string().trim().max(300, 'Not en fazla 300 karakter.').default('')
});

export const ListZ = z.object({
  title: z.string().trim().min(1, 'Listeye bir ad ver.').max(80, 'Liste adı en fazla 80 karakter.'),
  description: z.string().trim().max(300, 'Açıklama en fazla 300 karakter.').default(''),
  items: z.array(ItemZ).max(LIST_MAX_ITEMS, `Bir listede en fazla ${LIST_MAX_ITEMS} kelime olabilir.`)
});

/** Adresteki liste numarası */
export function listId(raw: string) {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}
