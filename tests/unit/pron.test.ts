import { describe, expect, it } from 'vitest';
import { pronNorm, pronScore, pronVerdict } from '@/lib/pron';

describe('telaffuz karşılaştırma', () => {
  it('harekeleri, elif ve te farklarını yok sayar', () => {
    expect(pronNorm('كِتَابٌ')).toBe('كتاب');
    expect(pronNorm('مَدْرَسَةٌ')).toBe(pronNorm('مدرسه'));
    expect(pronNorm('أَحْمَرُ')).toBe(pronNorm('احمر'));
  });
  it('baştaki ال takısını yok sayar', () => {
    expect(pronScore('الْكِتَابُ', ['كتاب'])).toBe(1);
    expect(pronScore('بَيْتٌ', ['البيت'])).toBe(1);
  });
  it('rakamla tanınan sayıları kabul eder', () => {
    expect(pronScore('ثَلَاثَةٌ', ['3'])).toBe(1);
    expect(pronScore('خَمْسَةٌ', ['٥'])).toBe(1);
  });
  it('seçeneklerin en iyisini alır ve kararı verir', () => {
    expect(pronVerdict(pronScore('أَخْضَرُ', ['اصفر', 'اخضر']))).toBe('ok');
    expect(pronVerdict(pronScore('طَالِبَةٌ', ['طالب']))).toBe('close');
    expect(pronVerdict(pronScore('سَيَّارَةٌ', ['قلم']))).toBe('bad');
    expect(pronScore('قَلَمٌ', [])).toBe(0);
  });
});
