// Hata bildirimi seçenekleri (istemci ve sunucu ortak kullanır)
export type ReportKind = 'question' | 'word' | 'section';

export const REPORT_REASONS = {
  answer: 'Doğru cevap yanlış',
  options: 'Seçeneklerde sorun var',
  typo: 'Yazım ya da hareke hatası',
  audio: 'Ses hatalı ya da eksik',
  meaning: 'Anlam ya da çeviri yanlış',
  unclear: 'Açıklama anlaşılmıyor',
  other: 'Başka bir sorun'
} as const;
export type ReportReason = keyof typeof REPORT_REASONS;

/** Bildirim türüne göre gösterilen nedenler */
export const REASONS_FOR: Record<ReportKind, ReportReason[]> = {
  question: ['answer', 'options', 'typo', 'audio', 'unclear', 'other'],
  word: ['meaning', 'typo', 'audio', 'other'],
  section: ['typo', 'meaning', 'unclear', 'audio', 'other']
};

export const KIND_LABEL: Record<ReportKind, string> = { question: 'Soru', word: 'Kelime', section: 'Ders bölümü' };
