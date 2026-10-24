import { z } from 'zod';
import { ACT_TYPES } from './types';

// Yönetim panelinden gelen ders verisi (içerik esnek JSON; temel yapı doğrulanır)
const str = z.string().max(20000);
const opt = z.string().max(20000).optional();

const Word = z.object({ ar: str, tr: str, tl: opt, en: opt, note: opt });
const Example = z.object({ ar: str, tr: str, tl: opt, en: opt, note: opt });
const Section = z.object({
  h: z.string().min(1, 'Her bölümün bir başlığı olmalı.').max(300),
  p: z.array(str).optional(),
  table: z.object({ cols: z.array(str), rows: z.array(z.array(str)) }).optional(),
  p2: z.array(str).optional(),
  ex: z.array(Example).optional(),
  cmp: z.object({ tr: opt, en: opt }).optional(),
  tips: z.array(str).optional(),
  narr: z.string().max(20000).optional()
});
const Question = z.object({
  t: z.enum(['mc', 'fill', 'tf', 'order', 'listen']).optional(),
  q: opt, ar: opt, tl: opt, clock: z.string().regex(/^\d{1,2}:\d{2}$/, 'Saat "3:30" biçiminde olmalı.').optional(),
  s: opt, hint: opt, options: z.array(str).optional(), a: z.union([z.string(), z.boolean()]).optional(),
  fixed: z.boolean().optional(), why: opt, tr: opt, en: opt, w: z.array(str).optional(), alt: z.array(z.array(str)).optional()
});
const Item = z.union([z.tuple([str, str]), Question, Word]);

export const ActivityInput = z.object({
  id: z.string().max(20).optional(),
  type: z.enum(ACT_TYPES),
  mode: z.enum(['c2t', 't2c', 'mix']).nullable().optional(),
  title: z.string().trim().min(1, 'Her etkinliğin bir başlığı olmalı.').max(191),
  desc: z.string().max(5000).default(''),
  glyph: z.string().max(64).optional(),
  keepOrder: z.boolean().optional(),
  items: z.array(Item).nullable().optional()
});

export const TopicInput = z.object({
  id: z.string().trim().regex(/^[a-z0-9][a-z0-9-]{0,63}$/, 'Kısa ad yalnızca küçük harf, rakam ve tire içerebilir (örn. "renkler").'),
  n: z.number().int().min(0).max(9999),
  level: z.string().trim().min(1).max(20),
  glyph: z.string().max(32).default(''),
  ar: z.string().max(191).default(''),
  name: z.string().trim().min(1, 'Dersin bir adı olmalı.').max(191),
  desc: z.string().max(5000).default(''),
  long: z.string().max(5000).nullable().optional(),
  tags: z.string().max(5000).nullable().optional(),
  readMins: z.number().int().min(0).max(600).default(10),
  intro: z.string().max(20000).default(''),
  lesson: z.array(Section),
  keys: z.array(str),
  mistakes: z.array(z.object({ bad: str, good: str, why: str })),
  words: z.array(Word),
  published: z.boolean().default(true),
  summaryNarr: z.string().max(20000).nullable().optional(),
  acts: z.array(ActivityInput)
});
export type TopicInputT = z.infer<typeof TopicInput>;
