import { describe, expect, it } from 'vitest';
import { NEW_LESSONS } from '../../scripts/new-lessons';
import { NEW_LESSONS_2 } from '../../scripts/new-lessons-2';
import { deepClean } from '../../scripts/typography';
import { TopicInput } from '@/lib/topic-schema';

// Yeni dersler (14-21): şemaya uyar, cevaplar seçeneklerde, tipografi kurallarına uygun
const ALL = [...NEW_LESSONS, ...NEW_LESSONS_2];
const braces = (s: string) => (s.match(/\{\{/g) || []).length === (s.match(/\}\}/g) || []).length;

describe('yeni dersler', () => {
  it.each(ALL.map((t) => [t.id, t] as const))('%s yönetim paneli şemasından geçer', (_id, t) => {
    const r = TopicInput.safeParse({ ...t, published: true });
    if (!r.success) throw new Error(JSON.stringify(r.error.issues.slice(0, 3)));
  });

  it('ders numaraları ve kısa adlar benzersiz', () => {
    expect(new Set(ALL.map((t) => t.id)).size).toBe(ALL.length);
    expect(new Set(ALL.map((t) => t.n)).size).toBe(ALL.length);
  });

  it('çoktan seçmeli ve boşluk doldurma sorularında doğru cevap seçeneklerde, seçenekler tekrarsız', () => {
    for (const t of ALL) {
      for (const a of t.acts) {
        for (const q of a.items || []) {
          if (Array.isArray(q) || !('options' in q || 'w' in q || 't' in q)) continue;
          const x = q as { t?: string; options?: string[]; a?: unknown; s?: string; w?: string[] };
          const type = x.t || (a.type === 'test' ? 'mc' : a.type);
          if (type === 'mc' || type === 'fill') {
            expect(x.options, `${t.id} ${a.title}`).toContain(x.a);
            expect(new Set(x.options).size).toBe(x.options!.length);
          }
          if (type === 'fill') expect(String(x.s)).toContain('___');
          if (type === 'tf') expect(typeof x.a).toBe('boolean');
          if (type === 'order') expect(x.w!.length, `${t.id} ${a.title}`).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('her bölümün öğretmen anlatımı ve özet anlatımı var', () => {
    for (const t of ALL) {
      for (const s of t.lesson) expect(s.narr?.length, `${t.id}: ${s.h}`).toBeGreaterThan(300);
      expect(t.summaryNarr?.length).toBeGreaterThan(200);
    }
  });

  it('uzun tire, kıvrık tırnak ve üç nokta karakteri yok; Arapça işaretleri kapalı', () => {
    expect(deepClean(ALL)).toEqual(ALL);
    const walk = (v: unknown): void => {
      if (typeof v === 'string') expect(braces(v), v.slice(0, 80)).toBe(true);
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(ALL);
  });

  it('18-21. derslerde sınırsız pratik ve konu testi var; sınırsız pratik testten önce', () => {
    for (const t of NEW_LESSONS_2) {
      const types = t.acts.map((a) => a.type);
      expect(types, t.id).toContain('endless');
      expect(types.indexOf('endless'), t.id).toBeLessThan(types.indexOf('test'));
      expect(t.words.length, t.id).toBeGreaterThanOrEqual(12);
      expect(new Set(t.words.map((w) => w.ar)).size, t.id).toBe(t.words.length);
    }
  });
});
