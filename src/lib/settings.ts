// Görünüm ayarları (çerezde saklanır; sunucu ve istemci ortak kullanır)
export type Theme = 'dark' | 'light' | 'system';
/** arSize: Arapça yazı boyutu (0 normal, 1 büyük, 2 çok büyük); theme: renk teması */
export type Settings = { harakat: boolean; tl: boolean; en: boolean; arSize: number; theme: Theme };
export const DEFAULT_SETTINGS: Settings = { harakat: true, tl: true, en: true, arSize: 0, theme: 'dark' };
export const SETTINGS_COOKIE = 'arb_settings';
export const AR_SIZES = ['Normal', 'Büyük', 'Çok büyük'] as const;
export const THEMES: [Theme, string][] = [['dark', 'Koyu'], ['light', 'Açık'], ['system', 'Sistem']];
/** Tarayıcı çubuğu rengi (başlık rengiyle aynı) */
export const THEME_COLOR = { dark: '#0E0B09', light: '#FBF7F1' } as const;
/** Gövde sınıfları: sunucu ve istemci aynı biçimde uygular */
export const settingsClasses = (s: Settings) => [!s.tl && 'no-tl', !s.en && 'no-en', s.arSize > 0 && 'ar-' + s.arSize].filter(Boolean) as string[];

/** Çerezden gelen ayarları doğrular; bozuk ya da eksik alanlar varsayılana döner */
export function parseSettings(raw: string | undefined): Settings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const s = { ...DEFAULT_SETTINGS, ...JSON.parse(decodeURIComponent(raw)) } as Settings;
    s.arSize = [0, 1, 2].includes(s.arSize) ? s.arSize : 0;
    s.theme = THEMES.some(([t]) => t === s.theme) ? s.theme : 'dark';
    return s;
  } catch { return DEFAULT_SETTINGS; }
}
