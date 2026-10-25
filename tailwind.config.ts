import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Renkler tema değişkenlerinden gelir (globals.css): koyu tema eski sitedeki tw.js ile birebir aynı
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        head: 'rgb(var(--c-head) / <alpha-value>)',
        s1: 'rgb(var(--c-s1) / <alpha-value>)',
        s2: 'rgb(var(--c-s2) / <alpha-value>)',
        s3: 'rgb(var(--c-s3) / <alpha-value>)',
        s4: 'rgb(var(--c-s4) / <alpha-value>)',
        s5: 'rgb(var(--c-s5) / <alpha-value>)',
        chip: 'rgb(var(--c-chip) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        line2: 'rgb(var(--c-line2) / <alpha-value>)',
        line3: 'rgb(var(--c-line3) / <alpha-value>)',
        lineh: 'rgb(var(--c-lineh) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        soft: 'rgb(var(--c-soft) / <alpha-value>)',
        mute: 'rgb(var(--c-mute) / <alpha-value>)',
        mute2: 'rgb(var(--c-mute2) / <alpha-value>)',
        faint: 'rgb(var(--c-faint) / <alpha-value>)',
        acc: 'rgb(var(--c-acc) / <alpha-value>)',
        acct: 'rgb(var(--c-acct) / <alpha-value>)',
        accs: 'rgb(var(--c-accs) / <alpha-value>)',
        lab: 'rgb(var(--c-lab) / <alpha-value>)',
        onacc: 'rgb(var(--c-onacc) / <alpha-value>)',
        ok: 'rgb(var(--c-ok) / <alpha-value>)',
        okt: 'rgb(var(--c-okt) / <alpha-value>)',
        okbg: 'rgb(var(--c-okbg) / <alpha-value>)',
        okln: 'rgb(var(--c-okln) / <alpha-value>)',
        bad: 'rgb(var(--c-bad) / <alpha-value>)',
        badbg: 'rgb(var(--c-badbg) / <alpha-value>)',
        badln: 'rgb(var(--c-badln) / <alpha-value>)',
        prog: 'rgb(var(--c-prog) / <alpha-value>)',
        progbg: 'rgb(var(--c-progbg) / <alpha-value>)',
        progln: 'rgb(var(--c-progln) / <alpha-value>)',
        line4: 'rgb(var(--c-line4) / <alpha-value>)',
        prose: 'rgb(var(--c-prose) / <alpha-value>)',
        dim: 'rgb(var(--c-dim) / <alpha-value>)',
        chipln: 'rgb(var(--c-chipln) / <alpha-value>)',
        edge: 'rgb(var(--c-edge) / <alpha-value>)',
        s0: 'rgb(var(--c-s0) / <alpha-value>)',
        track: 'rgb(var(--c-track) / <alpha-value>)',
        pill: 'rgb(var(--c-pill) / <alpha-value>)',
        okfg: 'rgb(var(--c-okfg) / <alpha-value>)',
        badfg: 'rgb(var(--c-badfg) / <alpha-value>)',
        okbd: 'rgb(var(--c-okbd) / <alpha-value>)',
        badbd: 'rgb(var(--c-badbd) / <alpha-value>)',
        acch: 'rgb(var(--c-acch) / <alpha-value>)',
        thumb: 'rgb(var(--c-thumb) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        ar: ['"Noto Sans Arabic"', 'sans-serif']
      }
    }
  }
};

export default config;
