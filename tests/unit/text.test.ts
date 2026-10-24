import { describe, expect, it } from 'vitest';
import { actsOf, audioKey, dayKey, makeText, normAr, normTr, strip, streakOf } from '@/lib/text';
import type { Activity, Word } from '@/lib/types';

describe('Arapça metin yardımcıları', () => {
  it('harekeleri siler', () => {
    expect(strip('كِتَابٌ')).toBe('كتاب');
    expect(strip('السَّاعَةُ')).toBe('الساعة');
  });

  it('arama için hemze ve tâ merbûtayı sadeleştirir', () => {
    expect(normAr('أَحْمَد')).toBe('احمد');
    expect(normAr('مَدْرَسَة')).toBe('مدرسه');
    expect(normAr('عَلَى')).toBe('علي');
  });

  it('ses anahtarı harekeden ve noktalamadan bağımsızdır', () => {
    expect(audioKey('كَيْفَ حَالُكَ؟')).toBe(audioKey('كيف حالك'));
    expect(audioKey('  بَيْتٌ  ')).toBe('بيت');
  });

  it('Türkçe aramayı şapka ve kesme işaretinden bağımsız yapar', () => {
    expect(normTr('Kitâb')).toBe('kitab');
    expect(normTr("mu'allim")).toBe('muallim');
    expect(normTr('İSTANBUL')).toBe('istanbul');
  });
});

describe('makeText', () => {
  const tx = makeText(true);
  const plain = makeText(false);

  it('{{...}} içindeki Arapçayı Arapça yazı tipi alanına sarar', () => {
    const html = tx.rich('Örnek: {{كِتَابٌ}} demektir');
    expect(html).toContain('<span class="ar ');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('كِتَابٌ');
    expect(html).not.toContain('{{');
  });

  it('işaretsiz Arapçayı da otomatik algılar', () => {
    expect(tx.text('ال takısı')).toContain('<span class="ar');
  });

  it('harekeler kapalıysa harekesiz gösterir ama asıl metni saklar', () => {
    const html = plain.ar('كِتَابٌ');
    expect(html).toContain('>كتاب<');
    expect(html).toContain('data-v="كِتَابٌ"');
  });

  it('düz metindeki HTML karakterlerini kaçışlar', () => {
    expect(tx.text('<script>')).toBe('&lt;script&gt;');
  });

  it('auto: yalnızca Arapça olanı tek alan yapar, karışık metni parçalar', () => {
    expect(tx.auto('بَيْتٌ')).toMatch(/^<span class="ar/);
    expect(tx.auto('Güneş harfi')).toBe('Güneş harfi');
  });
});

describe('actsOf', () => {
  const words: Word[] = Array.from({ length: 6 }, (_, i) => ({ ar: 'ك' + i, tr: 'k' + i }));
  const acts: Activity[] = [
    { id: '1', type: 'flash', title: 'Kartlar', desc: '' },
    { id: '2', type: 'mc', title: 'Test', desc: '', items: [{ q: 'a', options: ['x', 'y'], a: 'x' }] },
    { id: '3', type: 'clock', mode: 'mix', title: 'Saat', desc: '' }
  ];

  it('kart ve soru sayılarını hesaplar', () => {
    const v = actsOf({ acts, words });
    expect(v[0].meta).toBe('6 kart');
    expect(v[1].meta).toBe('1 soru');
    expect(v[2].meta).toBe('Sınırsız soru');
  });

  it('autoListen ile kelimelerden dinleme etkinliği ekler', () => {
    const v = actsOf({ acts, words, autoListen: true });
    expect(v.some((a) => a.type === 'listen')).toBe(true);
  });
});

describe('streakOf', () => {
  it('bugünden geriye art arda günleri sayar', () => {
    const d = new Date();
    const days = [0, 1, 2].map((i) => dayKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - i)));
    expect(streakOf(days)).toBe(3);
  });
  it('bugün çalışılmadıysa dünden başlar', () => {
    const d = new Date();
    const days = [1, 2].map((i) => dayKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - i)));
    expect(streakOf(days)).toBe(2);
  });
  it('boşluk varsa seri kırılır', () => {
    const d = new Date();
    const days = [0, 2, 3].map((i) => dayKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - i)));
    expect(streakOf(days)).toBe(1);
  });
});
