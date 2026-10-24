import { ogImage } from '@/lib/og';
import { getTopics } from '@/lib/topics';

// /og?id=saatler: dersin sosyal medya önizleme görseli
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const t = id ? (await getTopics()).find((x) => x.id === id) : undefined;
  const img = t
    ? await ogImage({ kicker: `Ders ${t.n} · ${t.level}`, title: t.name, sub: t.desc.replace(/\{\{|\}\}|<[^>]+>/g, '').replace(/[؀-ۿ]+/g, '').replace(/\s+/g, ' ').trim().slice(0, 120) })
    : await ogImage({ kicker: 'Ücretsiz Arapça dersleri', title: 'Arapça Öğren', sub: 'Konu anlatımı, örnekler ve etkinliklerle adım adım: saatler, zamirler, sıfatlar ve daha fazlası.' });
  img.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  return img;
}
