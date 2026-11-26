import { describe, expect, it } from 'vitest';
import { DEFAULT_NEWS, isNewsLink, NEWS_LIMITS, newsHtml } from '@/lib/news-shared';
import { makeText } from '@/lib/text';
import { deepClean } from '../../scripts/typography';

describe('Yenilikler', () => {
  it('bağlantı yalnızca site içi olabilir', () => {
    for (const ok of ['/', '/okuma', '/konu/renkler', '/kelime-bul?q=kitap', '/alfabe#rakamlar']) expect(isNewsLink(ok), ok).toBe(true);
    for (const bad of ['//kotu.example', '/\\kotu.example', 'https://kotu.example', 'javascript:alert(1)', 'okuma', '/a b', '/"x', "/'x"]) expect(isNewsLink(bad), bad).toBe(false);
  });
  it('yazı metni kaçışlanır; {{...}} Arapça yazı tipiyle çıkar', () => {
    const tx = makeText(true);
    const html = newsHtml('<img src=x onerror=alert(1)> {{صَدِيق}} arkadaş', tx);
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
    expect(html).toContain('class="ar');
    // Kapanmamış işaret ders metni gibi işlenmez: HTML yine kaçışlanır
    expect(newsHtml('{{ <b>x</b>', tx)).not.toContain('<b>');
  });
  it('ilk yazılar sınırlara ve yazım kurallarına uyar', () => {
    for (const n of DEFAULT_NEWS) {
      expect(n.title.length).toBeLessThanOrEqual(NEWS_LIMITS.title);
      expect(n.body.length).toBeLessThanOrEqual(NEWS_LIMITS.body);
      if (n.link) expect(isNewsLink(n.link)).toBe(true);
    }
    expect(deepClean(DEFAULT_NEWS)).toEqual(DEFAULT_NEWS);
  });
});
