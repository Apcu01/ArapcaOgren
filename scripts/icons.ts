/**
 * brand/logo.svg dosyasından favicon ve uygulama ikonlarını üretir.
 *   npm run icons
 */
import fs from 'node:fs';
import sharp from 'sharp';

const LOGO = fs.readFileSync('brand/logo.svg', 'utf8');
// Logo içeriği (zemin dikdörtgeni hariç)
const INNER = LOGO.replace(/^[\s\S]*?<rect[^>]*\/>/, '').replace(/<\/svg>\s*$/, '');

// iOS / Android maskelenebilir ikon: tam zemin, içerik güvenli alanda (%72)
const fullBleed = (scale: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="#2B1F16"/>
  <g transform="translate(32 32) scale(${scale}) translate(-32 -32)">${INNER}</g>
</svg>`;

const png = (svg: string, size: number) => sharp(Buffer.from(svg), { density: 1200 }).resize(size, size).png().toBuffer();

// PNG gömülü .ico dosyası
function ico(images: { size: number; data: Buffer }[]) {
  const head = Buffer.alloc(6 + images.length * 16);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach((im, i) => {
    const o = 6 + i * 16;
    head.writeUInt8(im.size >= 256 ? 0 : im.size, o);
    head.writeUInt8(im.size >= 256 ? 0 : im.size, o + 1);
    head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6);
    head.writeUInt32LE(im.data.length, o + 8); head.writeUInt32LE(offset, o + 12);
    offset += im.data.length;
  });
  return Buffer.concat([head, ...images.map((i) => i.data)]);
}

async function main() {
  fs.mkdirSync('public/icons', { recursive: true });
  fs.writeFileSync('src/app/icon.svg', LOGO);
  fs.writeFileSync('public/logo.svg', LOGO);
  fs.writeFileSync('src/app/apple-icon.png', await png(fullBleed(0.86), 180));
  fs.writeFileSync('public/icons/icon-192.png', await png(LOGO, 192));
  fs.writeFileSync('public/icons/icon-512.png', await png(LOGO, 512));
  fs.writeFileSync('public/icons/maskable-512.png', await png(fullBleed(0.72), 512));
  fs.writeFileSync('src/app/favicon.ico', ico([
    { size: 16, data: await png(LOGO, 16) },
    { size: 32, data: await png(LOGO, 32) },
    { size: 48, data: await png(LOGO, 48) }
  ]));
  console.log('İkonlar üretildi.');
}

main().catch((e) => { console.error(e); process.exit(1); });
