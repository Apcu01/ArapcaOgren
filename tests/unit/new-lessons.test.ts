import { describe, expect, it } from 'vitest';
import { NEW_LESSONS } from '../../scripts/new-lessons';
import { deepClean } from '../../scripts/typography';
import { TopicInput } from '@/lib/topic-schema';

// Yeni dersler (14-17): şemaya uyar, cevaplar seçeneklerde, tipografi kurallarına uygun
describe('yeni dersler', () => {
  it.each(NEW_LESSONS.map((t) => [t.id, t] as const))('%s yönetim paneli şemasından geçer', (_id, t) => {
    const r = TopicInput.safeParse({ ...t, published: true });
    if (!r.success) throw new Error(JSON.stringify(r.error.issues.slice(0, 3)));
  });

  it('ders numaraları ve kısa adlar benzersiz', () => {
    expect(new Set(NEW_LESSONS.map((t) => t.id)).size).toBe(NEW_LESSONS.length);
    expect(new Set(NEW_LESSONS.map((t) => t.n)).size).toBe(NEW_LESSONS.length);
  });

  it('çoktan seçmeli ve boşluk doldurma sorularında doğru cevap seçeneklerde, seçenekler tekrarsız', () => {
    for (const t of NEW_LESSONS) {
      for (const a of t.acts) {
        for (const q of a.items || []) {
          if (Array.isArray(q) || !('options' in q || 'w' in q || 't' in q)) continue;
          const x = q as { t?: string; options?: string[]; a?: unknown; s?: string };
          const type = x.t || (a.type === 'test' ? 'mc' : a.type);
          if (type === 'mc' || type === 'fill') {
            expect(x.options, `${t.id} ${a.title}`).toContain(x.a);
            expect(new Set(x.options).size).toBe(x.options!.length);
          }
          if (type === 'fill') expect(String(x.s)).toContain('___');
        }
      }
    }
  });

  it('her bölümün öğretmen anlatımı ve özet anlatımı var', () => {
    for (const t of NEW_LESSONS) {
      for (const s of t.lesson) expect(s.narr?.length, `${t.id}: ${s.h}`).toBeGreaterThan(300);
      expect(t.summaryNarr?.length).toBeGreaterThan(200);
    }
  });

  it('uzun tire, kıvrık tırnak ve üç nokta karakteri yok', () => {
    expect(deepClean(NEW_LESSONS)).toEqual(NEW_LESSONS);
  });
});
