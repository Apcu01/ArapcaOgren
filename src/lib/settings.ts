// Görünüm ayarları (çerezde saklanır; sunucu ve istemci ortak kullanır)
/** arSize: Arapça yazı boyutu (0 normal, 1 büyük, 2 çok büyük) */
export type Settings = { harakat: boolean; tl: boolean; en: boolean; arSize: number };
export const DEFAULT_SETTINGS: Settings = { harakat: true, tl: true, en: true, arSize: 0 };
export const SETTINGS_COOKIE = 'arb_settings';
export const AR_SIZES = ['Normal', 'Büyük', 'Çok büyük'] as const;
/** Gövde sınıfları: sunucu ve istemci aynı biçimde uygular */
export const settingsClasses = (s: Settings) => [!s.tl && 'no-tl', !s.en && 'no-en', s.arSize > 0 && 'ar-' + s.arSize].filter(Boolean) as string[];
