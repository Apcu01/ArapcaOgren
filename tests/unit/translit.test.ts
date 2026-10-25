import { describe, expect, it } from 'vitest';
import { LOOKUP_RE, phonKey, sameSound } from '@/lib/translit';

describe('okunuş eşleştirme', () => {
  it('hareke farklarını yok sayar', () => {
    expect(sameSound('ketebe', 'katabe')).toBe(true);
    expect(sameSound('ketebe', 'kataba')).toBe(true);
    expect(sameSound('efvan', 'afvan')).toBe(true);
    expect(sameSound('afven', 'afvan')).toBe(true);
  });
  it('şedde ve uzatma yazılmasa da eşleşir', () => {
    expect(sameSound('müderris', 'muderis')).toBe(true);
    expect(sameSound('müderris', 'mudarris')).toBe(true);
    expect(sameSound('kitâb', 'kitab')).toBe(true);
  });
  it('İngilizce yazımı ve ayn işaretini tanır', () => {
    expect(sameSound('şukran', 'shukran')).toBe(true);
    expect(sameSound('‘alâ', 'ala')).toBe(true);
    expect(sameSound('mu‘allim', 'muallim')).toBe(true);
    expect(sameSound('cemîl', 'jamil')).toBe(true);
  });
  it('tenvin ve son ünlü farkını tolere eder, belirlilik takısını atar', () => {
    expect(sameSound('kitâb', 'kitabun')).toBe(true);
    expect(sameSound('el-yevme', 'yevm')).toBe(true);
    expect(sameSound('es-sebt', 'sebt')).toBe(true);
  });
  it('farklı kelimeleri karıştırmaz', () => {
    expect(sameSound('ketebe', 'kitâb')).toBe(false);
    expect(sameSound('kalem', 'kamer')).toBe(false);
    expect(phonKey('')).toBe('');
  });
  it('yalnızca izin verilen karakterleri kabul eder', () => {
    expect(LOOKUP_RE.test('müderris')).toBe(true);
    expect(LOOKUP_RE.test('كتب')).toBe(true);
    expect(LOOKUP_RE.test('<script>')).toBe(false);
    expect(LOOKUP_RE.test('a'.repeat(41))).toBe(false);
  });
});
