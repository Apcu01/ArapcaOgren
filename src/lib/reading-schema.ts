/* Okuma metni doğrulaması: yönetim paneli kaydı ve yapay zekâ taslağı aynı kurallardan geçer */
import { z } from 'zod';
import { READING_LEVELS } from './readings';

const arWord = /[؀-ۿ]/;
const arOnly = (s: string) => arWord.test(s) && !/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(s);

export const TokenZ = z.tuple([
  z.string().trim().min(1).max(60).refine((s) => arOnly(s) && !/\s/.test(s), 'Arapça kelime tek parça ve yalnızca Arapça olmalı.')
    .refine((s) => /[ء-ي]/.test(s), 'Noktalama ayrı kelime olamaz; önceki kelimeye bitişik yaz.'),
  z.string().trim().min(1, 'Her kelimenin anlamını yaz.').max(80)
]);
export const SentenceZ = z.object({
  w: z.array(TokenZ).min(1).max(40),
  tr: z.string().trim().min(1, 'Her cümlenin Türkçe çevirisini yaz.').max(300)
});
export const QuestionZ = z.object({
  q: z.string().trim().min(1, 'Soru boş olamaz.').max(200),
  options: z.array(z.string().trim().min(1, 'Seçenek boş olamaz.').max(120)).min(2).max(4),
  a: z.string().trim().min(1)
}).refine((q) => q.options.includes(q.a), 'Doğru cevap seçeneklerden biri olmalı.')
  .refine((q) => new Set(q.options).size === q.options.length, 'Seçenekler birbirinden farklı olmalı.');

export const ReadingZ = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Adres yalnızca küçük harf, rakam ve tire içerebilir.').min(2).max(64),
  title: z.string().trim().min(1, 'Başlık yaz.').max(120),
  ar: z.string().trim().min(1, 'Arapça başlık yaz.').max(191).refine(arOnly, 'Arapça başlık yalnızca Arapça olmalı.'),
  level: z.enum(READING_LEVELS),
  topic: z.string().max(64).nullable(),
  desc: z.string().trim().max(400),
  sentences: z.array(SentenceZ).min(1, 'En az bir cümle olmalı.').max(40),
  questions: z.array(QuestionZ).max(10)
});
export type ReadingInput = z.infer<typeof ReadingZ>;

/** İlk hatayı Türkçe ve yerini belirterek döner */
export function firstIssue(e: z.ZodError) {
  const i = e.issues[0];
  const where = i.path.map((p) => (typeof p === 'number' ? p + 1 : p === 'sentences' ? 'cümle' : p === 'questions' ? 'soru' : p === 'w' ? 'kelime' : p === 'options' ? 'seçenek' : '')).filter(Boolean).join(' ');
  return (where ? where + ': ' : '') + i.message;
}
