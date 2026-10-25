import { describe, expect, it } from 'vitest';
import { rootOf, spaced, WORD_ROOTS } from '@/lib/roots';

describe('kök ailesi', () => {
  it('her kelimenin kökü tanımlı ve anlamı var', () => {
    for (const w of Object.keys(WORD_ROOTS)) {
      const r = rootOf(w);
      expect(r, w).not.toBeNull();
      expect(r!.meaning.length).toBeGreaterThan(0);
    }
  });
  it('harekeli ve tenvinli yazımı da tanır', () => {
    expect(rootOf('كِتَابٌ')?.letters).toBe('كتب');
    expect(rootOf('مَدْرَسَةٌ')?.letters).toBe('درس');
    expect(rootOf('أَكْبَرُ')?.letters).toBe('كبر');
  });
  it('kök taşımayan kelimelerde boş döner', () => {
    expect(rootOf('هُوَ')).toBeNull();
    expect(rootOf('فِي')).toBeNull();
  });
  it('kök harflerini aralıklı gösterir', () => {
    expect(spaced('كتب')).toBe('ك ت ب');
  });
});
