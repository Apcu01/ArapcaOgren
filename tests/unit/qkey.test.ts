import { describe, expect, it } from 'vitest';
import { mistakeKey, qTypeOf, questionKey, questionLabel } from '@/lib/qkey';
import type { Question } from '@/lib/types';

const q: Question = { q: '“Kitap” hangisidir?', options: ['كِتَابٌ', 'بَيْتٌ', 'قَلَمٌ'], a: 'كِتَابٌ' };

describe('soru anahtarı', () => {
  it('seçeneklerin sırasından bağımsızdır', () => {
    const shuffled = { ...q, options: ['قَلَمٌ', 'كِتَابٌ', 'بَيْتٌ'] };
    expect(questionKey(q, 'mc')).toBe(questionKey(shuffled, 'mc'));
  });

  it('doğru cevap ya da metin değişince değişir', () => {
    expect(questionKey(q, 'mc')).not.toBe(questionKey({ ...q, a: 'بَيْتٌ' }, 'mc'));
    expect(questionKey(q, 'mc')).not.toBe(questionKey({ ...q, q: 'Başka soru' }, 'mc'));
  });

  it('oynatıcıya özel alanlardan etkilenmez', () => {
    const withRetry = { ...q, _retry: true } as Question;
    expect(questionKey(withRetry, 'mc')).toBe(questionKey(q, 'mc'));
  });

  it('konu testinde türü belirtilmemiş soru çoktan seçmelidir', () => {
    expect(qTypeOf({}, 'test')).toBe('mc');
    expect(qTypeOf({}, 'fill')).toBe('fill');
    expect(qTypeOf({ t: 'tf' }, 'test')).toBe('tf');
  });

  it('hata anahtarı ders kimliğiyle başlar ve 64 karakteri aşmaz', () => {
    const k = mistakeKey('saatler', { ...q, t: 'mc' });
    expect(k.startsWith('saatler:q')).toBe(true);
    expect(k.length).toBeLessThanOrEqual(64);
  });
});

describe('soru etiketi', () => {
  it('HTML ve {{ }} işaretlerini temizler', () => {
    expect(questionLabel({ q: '<b>Kalın</b> {{بَيْتٌ}} nedir?' })).toBe('Kalın بَيْتٌ nedir?');
  });
  it('saatli soruya saati ekler', () => {
    expect(questionLabel({ q: 'Saat kaç?', clock: '7:45' })).toBe('Saat kaç? (7:45)');
  });
});
