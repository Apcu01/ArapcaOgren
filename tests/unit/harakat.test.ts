import { describe, expect, it } from 'vitest';
import { applyMark, askedCount, build, DAMMA, FATHA, grade, KASRA, normMarks, SHADDA, slots, SUKUN, TAN_D } from '@/lib/harakat';

describe('harekeleme', () => {
  it('kelimeyi harflere ayırır, uzatma harfini sormaz', () => {
    const s = slots('كِتَابٌ');
    expect(s.map((x) => x.letter).join('')).toBe('كتاب');
    expect(s.map((x) => x.asked)).toEqual([true, true, false, true]);
    expect(s[3].marks).toBe(TAN_D);
    expect(build(s)).toBe('كِتَابٌ');
    expect(askedCount('كِتَابٌ')).toBe(3);
  });
  it('şedde ile harekenin sırası fark etmez', () => {
    expect(normMarks(FATHA + SHADDA)).toBe(SHADDA + FATHA);
    const s = slots('مُدَرِّسٌ');
    expect(s[2].marks).toBe(SHADDA + KASRA);
    const chosen = s.map((x) => x.marks);
    chosen[2] = KASRA + SHADDA;
    expect(grade(s, chosen).ok).toBe(true);
  });
  it('yanlış harfleri tek tek bildirir', () => {
    const s = slots('قَلَمٌ');
    const g = grade(s, [FATHA, DAMMA, TAN_D]);
    expect(g.per).toEqual([true, false, true]);
    expect(g.ok).toBe(false);
    expect(g.right).toBe(2);
    expect(g.total).toBe(3);
  });
  it('şedde düğmesi açılıp kapanır, hareke değişince şedde kalır', () => {
    expect(applyMark('', SHADDA)).toBe(SHADDA);
    expect(applyMark(SHADDA, FATHA)).toBe(SHADDA + FATHA);
    expect(applyMark(SHADDA + FATHA, KASRA)).toBe(SHADDA + KASRA);
    expect(applyMark(SHADDA + FATHA, SHADDA)).toBe(FATHA);
    expect(applyMark(SHADDA + FATHA, SUKUN)).toBe(SUKUN);
  });
  it('ötreli elif gibi işaretler verili kalır', () => {
    const s = slots('هٰذَا');
    expect(s[0].keep).toBe('ٰ');
    expect(s[0].asked).toBe(false);
    expect(build(s)).toBe('هٰذَا');
  });
});
