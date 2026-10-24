import { describe, expect, it } from 'vitest';
import { distractors, hmKey, nextH, timeAr, timeTr, timeWhy } from '@/lib/clock';

const ALL = Array.from({ length: 12 }, (_, i) => i + 1).flatMap((h) => Array.from({ length: 12 }, (_, j) => ({ h, m: j * 5 })));

describe('saat ifadeleri', () => {
  it('tam saatlerde dişil sıra sayısı kullanılır, saat bir istisnadır', () => {
    expect(timeAr(3, 0)).toBe('الثَّالِثَةُ');
    expect(timeAr(1, 0)).toBe('الْوَاحِدَةُ');
    expect(timeAr(12, 0)).toBe('الثَّانِيَةَ عَشْرَةَ');
  });

  it('kala derken bir sonraki saat söylenir', () => {
    expect(timeAr(7, 45)).toBe('الثَّامِنَةُ إِلَّا رُبْعًا');
    expect(timeAr(12, 55)).toBe('الْوَاحِدَةُ إِلَّا خَمْسَ دَقَائِقَ');
    expect(nextH(12)).toBe(1);
  });

  it('geçe ve buçuk', () => {
    expect(timeAr(3, 30)).toBe('الثَّالِثَةُ وَالنِّصْفُ');
    expect(timeAr(5, 15)).toBe('الْخَامِسَةُ وَالرُّبْعُ');
    expect(timeAr(10, 20)).toBe('الْعَاشِرَةُ وَالثُّلْثُ');
  });

  it('Türkçe karşılıklar doğru hal ekini kullanır', () => {
    expect(timeTr(3, 0)).toBe('Saat üç.');
    expect(timeTr(4, 15)).toBe('Saat dördü çeyrek geçiyor.');
    expect(timeTr(7, 45)).toBe('Saat sekize çeyrek var.');
    expect(timeTr(2, 30)).toBe('Saat iki buçuk.');
  });

  it('her saat ve dakika için ifade ve açıklama üretilir', () => {
    for (const t of ALL) {
      expect(timeAr(t.h, t.m).length).toBeGreaterThan(3);
      expect(timeTr(t.h, t.m)).toMatch(/^Saat /);
      expect(timeWhy(t.h, t.m)).toBeTruthy();
    }
  });

  it('144 saatin hepsinin Arapça ifadesi birbirinden farklıdır', () => {
    expect(new Set(ALL.map((t) => timeAr(t.h, t.m))).size).toBe(144);
  });
});

describe('çeldiriciler', () => {
  it('her zaman doğru cevaptan farklı 3 benzersiz seçenek üretir', () => {
    for (const t of ALL) {
      const d = distractors(t);
      expect(d).toHaveLength(3);
      const keys = new Set([hmKey(t), ...d.map(hmKey)]);
      expect(keys.size).toBe(4);
    }
  });
});
