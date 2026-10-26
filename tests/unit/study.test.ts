import { describe, expect, it } from 'vitest';
import { buildTest, fmtTime, gradeAr, gradeTr, meanings, mcQ, nextRound, statusOf, type ListItem } from '@/lib/study';

const mk = (id: number, ar: string, tl: string, tr: string): ListItem => ({ id, ar, tl, tr, note: '', starred: false, correct: 0, wrong: 0, streak: 0 });
const items = [
  mk(1, 'كَتَبَ', 'ketebe', 'yazdı'),
  mk(2, 'كِتَابٌ', 'kitâbun', 'kitap'),
  mk(3, 'قَلَمٌ', 'kalemun', 'kalem'),
  mk(4, 'بَيْتٌ', 'beytun', 'ev, oda'),
  mk(5, 'مَدْرَسَةٌ', 'medresetun', 'okul'),
  mk(6, 'مُدَرِّسٌ', 'müderrisun', 'öğretmen (erkek)'),
  mk(7, 'بَابٌ', 'bâbun', 'kapı')
];

describe('kelime durumu', () => {
  it('son iki cevap doğruysa öğrenildi', () => {
    expect(statusOf({ correct: 0, wrong: 0, streak: 0 })).toBe('new');
    expect(statusOf({ correct: 1, wrong: 3, streak: 1 })).toBe('learning');
    expect(statusOf({ correct: 2, wrong: 3, streak: 2 })).toBe('learned');
  });
});

describe('cevap kontrolü', () => {
  it('Türkçe anlamlardan biri, büyük/küçük harf ve parantez fark etmez', () => {
    expect(meanings('ev, oda')).toEqual(['ev', 'oda']);
    expect(gradeTr('Oda', 'ev, oda')).toBe('right');
    expect(gradeTr('öğretmen', 'öğretmen (erkek)')).toBe('right');
    expect(gradeTr('ögretmen', 'öğretmen (erkek)')).toBe('almost');
    expect(gradeTr('kalem', 'kitap')).toBe('wrong');
    expect(gradeTr('', 'kitap')).toBe('wrong');
  });
  it('Arapça cevap harekesiz ya da okunuşla', () => {
    expect(gradeAr('كتاب', items[1])).toBe('right');
    expect(gradeAr('كَتَبَ', items[1])).toBe('wrong');
    expect(gradeAr('kitab', items[1])).toBe('right');
    expect(gradeAr('katabe', items[0])).toBe('right');
    expect(gradeAr('müderis', items[5])).toBe('right');
    expect(gradeAr('kalem', items[1])).toBe('wrong');
  });
});

describe('soru üretimi', () => {
  it('çoktan seçmelide doğru cevap bir kez ve seçenekler farklı', () => {
    for (let i = 0; i < 20; i++) {
      const q = mcQ(items[0], items, 'ar');
      expect(q.options).toHaveLength(4);
      expect(q.options.filter((o) => o.id === 1)).toHaveLength(1);
      expect(new Set(q.options.map((o) => o.id)).size).toBe(4);
    }
  });
  it('az kelimede seçenek sayısı kelime sayısını aşmaz', () => {
    expect(mcQ(items[0], items.slice(0, 2), 'ar').options).toHaveLength(2);
  });
  it('test istenen sayıda kelimeyi her türe dağıtır', () => {
    const t = buildTest(items, 7, { tf: true, mc: true, match: false, write: true }, 'ar');
    const used = t.flatMap((q) => (q.kind === 'match' ? q.items : [q.item])).map((x) => x.id);
    expect(used.sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(t.map((q) => q.kind))).toEqual(new Set(['tf', 'mc', 'write']));
  });
  it('yalnız eşleştirme seçilirse 5erli gruplar', () => {
    const t = buildTest(items, 7, { tf: false, mc: false, match: true, write: false }, 'tr');
    expect(t.map((q) => q.kind)).toEqual(['match', 'match']);
  });
  it('öğren turu önce tanıdık kelimeleri, öğrenilenleri hiç getirmez', () => {
    const r = nextRound(items, { 1: 2, 2: 1, 3: 2 });
    expect(r[0].id).toBe(2);
    expect(r.map((x) => x.id)).not.toContain(1);
    expect(r).toHaveLength(5);
  });
});

it('süre biçimi', () => {
  expect(fmtTime(12345)).toBe('12,3 sn');
  expect(fmtTime(65200)).toBe('1:05,2');
});
