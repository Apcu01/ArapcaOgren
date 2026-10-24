import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE_NAME } from './site';

// Sosyal medya önizleme görseli (1200x630). Arapça harf birleştirme desteklenmediği için yalnızca Latin yazı kullanılır.
const FONT_DIR = path.join(process.cwd(), 'node_modules', '@fontsource', 'manrope', 'files');
let fonts: { name: string; data: Buffer; weight: 500 | 800; style: 'normal' }[] | null = null;
async function loadFonts() {
  if (fonts) return fonts;
  const f = (sub: string, w: 500 | 800) => fs.readFile(path.join(FONT_DIR, `manrope-${sub}-${w}-normal.woff`)).then((data) => ({ name: 'Manrope', data, weight: w, style: 'normal' as const }));
  fonts = await Promise.all([f('latin', 500), f('latin', 800), f('latin-ext', 500), f('latin-ext', 800)]);
  return fonts;
}
let logo: string | null = null;
async function logoData() {
  logo ??= 'data:image/svg+xml;base64,' + (await fs.readFile(path.join(process.cwd(), 'public', 'logo.svg'))).toString('base64');
  return logo;
}

export async function ogImage({ title, kicker, sub }: { title: string; kicker: string; sub: string }) {
  const [fs_, lg] = await Promise.all([loadFonts(), logoData()]);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0E0B09', padding: 48, fontFamily: 'Manrope' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#18120E', border: '3px solid #4A3424', borderRadius: 36, padding: '48px 56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lg} width={76} height={76} alt="" />
            <span style={{ fontSize: 36, fontWeight: 800, color: '#F2E8DC' }}>{SITE_NAME}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#C08A55', letterSpacing: 3 }}>{kicker.toLocaleUpperCase('tr')}</span>
            <span style={{ fontSize: title.length > 26 ? 64 : 80, fontWeight: 800, color: '#F2E8DC', lineHeight: 1.05 }}>{title}</span>
            <span style={{ fontSize: 30, fontWeight: 500, color: '#B8A595', lineHeight: 1.35 }}>{sub}</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: fs_ }
  );
}
