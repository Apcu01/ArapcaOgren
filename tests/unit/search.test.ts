import { describe, expect, it } from 'vitest';
import { searchKey } from '@/lib/text';

describe('arama anahtarı', () => {
  it('Türkçe harfleri sadeleştirir', () => {
    expect(searchKey('Sıfatlar')).toBe(searchKey('sifatlar'));
    expect(searchKey('SIFAT')).toBe('sifat');
    expect(searchKey('Günler ve aylar')).toContain('gunler');
    expect(searchKey('İyelik')).toBe('iyelik');
    expect(searchKey('Sayılar')).toBe('sayilar');
  });
  it('boşluk, tire ve şapkayı yok sayar', () => {
    expect(searchKey('harf i cer')).toBe(searchKey('Harf-i cer'));
    expect(searchKey('kitâbun')).toBe('kitabun');
    expect(searchKey('  saat  ')).toBe('saat');
  });
});
