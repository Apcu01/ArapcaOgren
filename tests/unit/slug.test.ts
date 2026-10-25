import { describe, expect, it } from 'vitest';
import { wordSlug } from '@/lib/slug';

describe('kelime adresi', () => {
  it('okunuşu adrese çevirir', () => {
    expect(wordSlug('kitâb')).toBe('kitab');
    expect(wordSlug('‘afven')).toBe('afven');
    expect(wordSlug('es-selâmu aleykum')).toBe('es-selamu-aleykum');
    expect(wordSlug('şeribe')).toBe('seribe');
    expect(wordSlug("kemi's-sâ‘atu?")).toBe('kemis-saatu');
    expect(wordSlug('Ramadân')).toBe('ramadan');
  });
});
