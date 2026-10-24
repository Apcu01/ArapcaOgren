export type Word = { ar: string; tr: string; tl?: string; en?: string; note?: string };
export type Example = { ar: string; tl?: string; tr: string; en?: string; note?: string };
export type Mistake = { bad: string; good: string; why: string };
export type Section = {
  h: string;
  p?: string[];
  table?: { cols: string[]; rows: string[][] };
  p2?: string[];
  ex?: Example[];
  cmp?: { tr?: string; en?: string };
  tips?: string[];
  /** Sesli anlatım metni (öğretmen anlatımı); {{...}} Arapça işaretleri ses üretiminde kaldırılır */
  narr?: string;
};

export const ACT_TYPES = ['flash', 'match', 'mc', 'fill', 'order', 'tf', 'listen', 'test', 'clock', 'speak'] as const;
export type ActType = (typeof ACT_TYPES)[number];
export type QType = 'mc' | 'fill' | 'tf' | 'order' | 'listen';

export type Question = {
  t?: QType;
  q?: string;
  ar?: string;
  tl?: string;
  clock?: string;
  s?: string;
  hint?: string;
  options?: string[];
  a?: string | boolean;
  fixed?: boolean;
  why?: string;
  tr?: string;
  en?: string;
  w?: string[];
  alt?: string[][];
};
export type Pair = [string, string];
export type Item = Question | Pair | Word;

export type Activity = {
  id: string;
  type: ActType;
  mode?: 'c2t' | 't2c' | 'mix' | null;
  title: string;
  desc: string;
  glyph?: string;
  keepOrder?: boolean;
  items?: Item[] | null;
  auto?: boolean;
};

export type Topic = {
  id: string;
  n: number;
  level: string;
  glyph: string;
  ar: string;
  name: string;
  desc: string;
  long?: string | null;
  tags?: string | null;
  readMins?: number;
  intro: string;
  lesson: Section[];
  keys: string[];
  mistakes: Mistake[];
  words: Word[];
  acts: Activity[];
  published?: boolean;
  /** Dersin sonundaki özet anlatımı */
  summaryNarr?: string | null;
};

// Kart listeleri için hafif ders özeti
export type TopicSummary = Pick<Topic, 'id' | 'n' | 'level' | 'glyph' | 'ar' | 'name' | 'desc' | 'tags'> & {
  acts: Pick<Activity, 'id' | 'type'>[];
};

export type ActRec = { best: number; done: boolean; tries: number; last: number };
export type TopicRec = { lesson: boolean; acts: Record<string, ActRec> };
export type ProgressState = { progress: Record<string, TopicRec>; last: string | null; days: string[] };

export type SessionUser = { id: number; name: string; email: string; role: 'user' | 'admin' };

/** Hata bildiriminde saklanan içerik: bildirildiği andaki soru, kelime ya da bölüm */
export type ReportContext = { label: string; question?: Question; word?: Word; section?: string; act?: string };
