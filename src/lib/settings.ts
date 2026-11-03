// Görünüm ayarları (çerezde saklanır; sunucu ve istemci ortak kullanır)
export type Theme = 'dark' | 'light' | 'system';
/**
 * arSize: Arapça yazı boyutu (0 normal, 1 büyük, 2 çok büyük); theme: renk teması;
 * txtSize: bütün sayfanın yazı boyutu; rate: kelime seslerinin hızı (1 normal); motion: false ise canlandırmalar kapalı
 */
export type Settings = { harakat: boolean; tl: boolean; en: boolean; arSize: number; theme: Theme; txtSize: number; rate: number; motion: boolean };
export const DEFAULT_SETTINGS: Settings = { harakat: true, tl: true, en: true, arSize: 0, theme: 'dark', txtSize: 0, rate: 1, motion: true };
export const SETTINGS_COOKIE = 'arb_settings';
export const AR_SIZES = ['Normal', 'Büyük', 'Çok büyük'] as const;
export const TXT_SIZES = ['Normal', 'Büyük', 'Çok büyük'] as const;
/** Ses hızı seçenekleri: kelime sesleri ve sesli okuma bu oranla çalınır */
export const RATES: [number, string][] = [[0.6, 'Yavaş'], [0.8, 'Biraz yavaş'], [1, 'Normal']];
export const THEMES: [Theme, string][] = [['dark', 'Koyu'], ['light', 'Açık'], ['system', 'Sistem']];
/** Tarayıcı çubuğu rengi (başlık rengiyle aynı) */
export const THEME_COLOR = { dark: '#0E0B09', light: '#FBF7F1' } as const;
/** Gövde sınıfları: sunucu ve istemci aynı biçimde uygular */
export const settingsClasses = (s: Settings) => [!s.tl && 'no-tl', !s.en && 'no-en', s.arSize > 0 && 'ar-' + s.arSize, s.txtSize > 0 && 'txt-' + s.txtSize, !s.motion && 'no-motion'].filter(Boolean) as string[];
/** Ayarların gövdeye eklediği bütün sınıflar (açılıp kapatılırken) */
export const SETTINGS_CLASSES = ['no-tl', 'no-en', 'ar-1', 'ar-2', 'txt-1', 'txt-2', 'no-motion'];

/** Çerezden gelen ayarları doğrular; bozuk ya da eksik alanlar varsayılana döner */
export function parseSettings(raw: string | undefined): Settings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const s = { ...DEFAULT_SETTINGS, ...JSON.parse(decodeURIComponent(raw)) } as Settings;
    s.arSize = [0, 1, 2].includes(s.arSize) ? s.arSize : 0;
    s.txtSize = [0, 1, 2].includes(s.txtSize) ? s.txtSize : 0;
    s.rate = RATES.some(([r]) => r === s.rate) ? s.rate : 1;
    s.motion = s.motion !== false;
    s.theme = THEMES.some(([t]) => t === s.theme) ? s.theme : 'dark';
    return s;
  } catch { return DEFAULT_SETTINGS; }
}
