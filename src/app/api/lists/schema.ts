import { z } from 'zod';
import { LIST_MAX_ITEMS } from '@/lib/study';
import { cleanText } from '@/lib/text';

/** Görünmez karakterleri (kopyala-yapıştırla gelen sıfır genişlikli boşluk gibi) kayıttan önce temizler */
const clean = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((v) => (typeof v === 'string' ? cleanText(v) : v), schema);

export const ItemZ = z.object({
  id: z.number().int().positive().optional(),
  ar: clean(z.string().trim().min(1, 'Her kelimenin Arapçasını yaz.').max(120, 'Arapça yazım en fazla 120 karakter.').regex(/[؀-ۿ]/, 'Arapça sütununa Arapça harflerle yaz.')),
  tl: clean(z.string().trim().max(120, 'Okunuş en fazla 120 karakter.').default('')),
  tr: clean(z.string().trim().min(1, 'Her kelimenin Türkçe anlamını yaz.').max(300, 'Anlam en fazla 300 karakter.')),
  note: clean(z.string().trim().max(300, 'Not en fazla 300 karakter.').default(''))
});

/** Klasör: listeleri gruplamak için tek bir ad (ör. "1. dönem"); boşsa klasörsüz. Gönderilmezse (eski istemci) değişmez */
export const FolderZ = clean(z.string().trim().max(40, 'Klasör adı en fazla 40 karakter.'));
/** Etiketler: en fazla 6 kısa etiket; büyük-küçük harf farkıyla tekrar edenlerden ilki kalır */
export const TagsZ = z.array(clean(z.string().trim().min(1).max(24, 'Bir etiket en fazla 24 karakter.'))).max(6, 'En fazla 6 etiket ekleyebilirsin.')
  .transform((tags) => tags.filter((t, i) => tags.findIndex((x) => x.toLocaleLowerCase('tr') === t.toLocaleLowerCase('tr')) === i));

export const ListZ = z.object({
  title: clean(z.string().trim().min(1, 'Listeye bir ad ver.').max(80, 'Liste adı en fazla 80 karakter.')),
  description: clean(z.string().trim().max(300, 'Açıklama en fazla 300 karakter.').default('')),
  folder: FolderZ.optional(),
  tags: TagsZ.optional(),
  items: z.array(ItemZ).max(LIST_MAX_ITEMS, `Bir listede en fazla ${LIST_MAX_ITEMS} kelime olabilir.`)
});

/** Adresteki liste numarası */
export function listId(raw: string) {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}
