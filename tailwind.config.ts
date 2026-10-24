import type { Config } from 'tailwindcss';

// Renkler eski sitedeki (Claude Design arayüzü) tw.js ile birebir aynı
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0E0B09',
        head: '#120E0B',
        s1: '#15100C',
        s2: '#17120E',
        s3: '#18120E',
        s4: '#1E1611',
        s5: '#221A14',
        chip: '#2B1F16',
        line: '#2A2019',
        line2: '#33271E',
        line3: '#4A3424',
        lineh: '#6B4A2E',
        ink: '#F2E8DC',
        soft: '#C9B6A4',
        mute: '#B8A595',
        mute2: '#A8958A',
        faint: '#8F7D6E',
        acc: '#C8894A',
        acct: '#D9A066',
        accs: '#E3B583',
        lab: '#C08A55',
        onacc: '#1A120C',
        ok: '#8FAE6B',
        okt: '#A9C98A',
        okbg: '#1F2A17',
        okln: '#34472A',
        bad: '#E59A8C',
        badbg: '#2A1614',
        badln: '#5A2C24',
        prog: '#E8B677',
        progbg: '#33230F',
        progln: '#5A3E1C'
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        ar: ['"Noto Sans Arabic"', 'sans-serif']
      }
    }
  }
};

export default config;
