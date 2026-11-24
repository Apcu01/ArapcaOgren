// Testlerde next/font/google: yükleyiciler Next derleyicisi olmadan çalışmaz; yalnızca ad ve sınıf döner
type Opts = { variable?: string };
const loader = (family: string) => (opts: Opts = {}) => ({
  className: 'font-' + family.replace(/\s+/g, '-').toLowerCase(),
  variable: opts.variable ? 'var-' + opts.variable.replace(/^--/, '') : '',
  style: { fontFamily: `'${family}'` }
});

export const Manrope = loader('Manrope');
export const Noto_Sans_Arabic = loader('Noto Sans Arabic');
