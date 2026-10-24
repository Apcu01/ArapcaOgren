// Eski sitedeki tipografiyi sadeleştirir: uzun tire, kıvrık tırnak ve üç nokta karakteri yerine düz karşılıklar.
// Arapça okunuşlardaki ayn işareti (‘) bilerek korunur.
const EXACT: [string, string][] = [
  ['({{أُمَّة}} — {{أُمّ}} ile aynı kök!)', '({{أُمَّة}}, {{أُمّ}} ile aynı kök!)'],
  ['’dan gelir — ama dikkat', '’dan gelir, ama dikkat'],
  ['{{أَخُوهُ}} — ama {{أَبِي}}', '{{أَخُوهُ}}, ama {{أَبِي}}'],
  ['olsun” — {{عَلَى}}', 'olsun”: {{عَلَى}}'],
  ['</em> — kelime kelime', '</em>, kelime kelime'],
  ['{{كَمِ السَّاعَةُ؟}} — Cevap:', '{{كَمِ السَّاعَةُ؟}} Cevap:'],
  ['yaygındır — zaten', 'yaygındır; zaten'],
  ['Kaç yaşındasın?” — {{', 'Kaç yaşındasın?” Cevap: {{'],
  ['belirlilik — en önemli kural', 'belirlilik (en önemli kural)'],
  ['({{كَثِير}} — “kesret”)', '({{كَثِير}}, “kesret”)'],
  ['?” — tekil.', '?”: tekil.'],
  ['Nerelisin?” — {{', 'Nerelisin?” Cevap: {{'],
  ['١ ٩ ٢ ٣ — soldan', '١ ٩ ٢ ٣: soldan'],
  ['nerede? — O ', 'nerede? O ']
];

export function clean(s: string): string {
  for (const [a, b] of EXACT) s = s.split(a).join(b);
  if (s.trim() === '—') return '-';
  s = s.replace(/\s—\s/g, ', ');
  s = s.replace(/(\d)–(\d)/g, '$1-$2').replace(/\s–\s/g, ', ').replace(/–/g, '-');
  return s.replace(/…/g, '...').replace(/[“”]/g, '"').replace(/’/g, "'");
}

export function deepClean<T>(v: T): T {
  if (typeof v === 'string') return clean(v) as T;
  if (Array.isArray(v)) return v.map(deepClean) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepClean(x)])) as T;
  return v;
}
