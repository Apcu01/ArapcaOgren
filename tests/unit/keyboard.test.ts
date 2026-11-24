import { describe, expect, it } from 'vitest';
import { advanceBy, charOf, KB_MODES, KB_ROWS, KB_WORDS, kbTargets, keyFor } from '@/lib/keyboard';

const LETTERS = [...'ابتثجحخدذرزسشصضطظعغفقكلمنهوي', 'ة', 'ى', 'ء', 'ئ', 'ؤ', 'أ', 'إ', 'آ'];

describe('Arapça klavye düzeni', () => {
  it('her harfin bir tuşu var ve tuşlar tekrar etmiyor', () => {
    for (const c of LETTERS) expect(keyFor(c), c).not.toBeNull();
    const codes = KB_ROWS.flat().map((k) => k.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
  it('fiziksel tuştan harfi bulur (Arapça klavye eklenmemiş olsa da)', () => {
    expect(charOf('KeyA', false)).toBe('ش');
    expect(charOf('KeyH', false)).toBe('ا');
    expect(charOf('KeyH', true)).toBe('أ');
    expect(charOf('KeyQ', true)).toBe('َ');
    expect(charOf('Backquote', false)).toBe('ذ');
    expect(charOf('Backquote', true)).toBe('ّ');
    expect(charOf('KeyB', false)).toBe('لا');
    expect(charOf('F13', false)).toBeNull();
  });
  it('Türkçe Q klavyedeki etiketler gösterilir', () => {
    expect(keyFor('ك')!.key.tr).toBe('Ş');
    expect(keyFor('ط')!.key.tr).toBe('İ');
    expect(keyFor('ج')!.key.tr).toBe('Ğ');
    expect(keyFor('و')!.key.tr).toBe('Ö');
    expect(keyFor('أ')).toEqual({ key: expect.objectContaining({ code: 'KeyH' }), shift: true });
  });
});

describe('klavye alıştırması', () => {
  it('harf turunda 25 hedef, art arda aynısı gelmez, hepsi o sıradan', () => {
    for (const m of KB_MODES.filter((x) => x.chars)) {
      const t = kbTargets(m.id);
      expect(t).toHaveLength(25);
      for (let i = 1; i < t.length; i++) expect(t[i].text).not.toBe(t[i - 1].text);
      for (const x of t) expect(m.chars).toContain(x.text);
    }
    const all = kbTargets('hepsi');
    expect(all).toHaveLength(25);
  });
  it('kelime turunda 8 kelime, her harfi klavyede yazılabilir', () => {
    const t = kbTargets('kelime');
    expect(t).toHaveLength(8);
    for (const [w] of KB_WORDS) for (const c of w) expect(keyFor(c), w + ' ' + c).not.toBeNull();
  });
  it('لا tuşu iki harfi birden yazar; ل ve ا ayrı ayrı da yazılabilir', () => {
    expect(advanceBy('لا', 0, 'لا')).toBe(2);
    expect(advanceBy('سلام', 1, 'لا')).toBe(2);
    expect(advanceBy('لا', 0, 'ل')).toBe(1);
    expect(advanceBy('كتاب', 0, 'ت')).toBe(0);
    expect(advanceBy('كتاب', 0, '')).toBe(0);
  });
});
