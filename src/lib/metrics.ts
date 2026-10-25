// İstemcinin topladığı günlük sayaçlar (yönetim panelindeki 14 günlük grafik)
export const METRICS = ['lesson_listen', 'word_listen', 'lookup', 'correct', 'wrong'] as const;
export type Metric = (typeof METRICS)[number];
