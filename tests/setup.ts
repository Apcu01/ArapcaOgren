import { afterEach } from 'vitest';

// Node 25'in deneysel localStorage'ı jsdom'unkini gölgeliyor: testlerde bellek içi bir Storage kullan
class MemoryStorage implements Storage {
  private m = new Map<string, string>();
  get length() { return this.m.size; }
  clear() { this.m.clear(); }
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  removeItem(k: string) { this.m.delete(k); }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
}
if (typeof window !== 'undefined') {
  const s = new MemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', { value: s, configurable: true });
  Object.defineProperty(window, 'localStorage', { value: s, configurable: true });
}

afterEach(async () => {
  if (typeof document !== 'undefined') {
    const { cleanup } = await import('@testing-library/react');
    cleanup();
  }
});
