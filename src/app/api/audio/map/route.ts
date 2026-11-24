import { audioVersion, getAudioMap } from '@/lib/audio';

/* Yüklenmiş seslerin eşlemesi (harekesiz metin -> kayıt numarası). Sayfa ?v= ile güncel sürümü ister:
   sürüm tutuyorsa yanıt bir yıl önbellekte kalır (içerik değişince sürüm, dolayısıyla adres de değişir).
   Sürüm eskiyse (önbellekteki eski bir sayfa) güncel eşleme döner ama saklanmaz. */
export async function GET(req: Request) {
  const map = await getAudioMap();
  const fresh = new URL(req.url).searchParams.get('v') === audioVersion(map);
  return Response.json(map, { headers: { 'Cache-Control': fresh ? 'public, max-age=31536000, immutable' : 'no-cache' } });
}
