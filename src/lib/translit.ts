/* Latin harfli okunuşları karşılaştırma: aynı Arapça kelimenin farklı yazımları aynı anahtara iner.
   ketebe = katabe = kataba, efvan = afvan, müderris = muderis = mudarris, şukran = shukran, ‘alâ = ala */

const ARTICLE = /^(el|al|es|as|er|ar|et|at|en|an|ed|ad|ez|az|eş|aş)[-\s']+/;

/** Okunuşun karşılaştırma anahtarı */
export function phonKey(input: string) {
  let t = String(input || '').trim().toLocaleLowerCase('tr');
  if (!t) return '';
  t = t.replace(ARTICLE, ''); // el-yevm, es-sebt
  t = t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i'); // â î û ü ö ç ş ğ ı
  t = t.replace(/[ʿʾ'’‘`´ʻ\-\s.]/g, '');
  // İngilizce ve Türkçe yazım farkları
  t = t.replace(/sh/g, 's').replace(/ch/g, 'c').replace(/kh/g, 'h').replace(/gh/g, 'g').replace(/th/g, 's').replace(/dh/g, 'z')
    .replace(/j/g, 'c').replace(/q/g, 'k').replace(/w/g, 'v').replace(/x/g, 'h');
  // Harekeler yazılmadığı için kısa ünlüler kolay karışır: üç gruba indir
  t = t.replace(/[ae]/g, 'a').replace(/[i]/g, 'i').replace(/[ou]/g, 'u');
  // Şedde ve uzatma yazılmayabilir: tekrar eden harfleri teke indir
  t = t.replace(/(.)\1+/g, '$1');
  return t.replace(/[^a-z]/g, '');
}

/** Karşılaştırma anahtarları: tam anahtar ve sondaki ünlü ya da tenvin atılmış hâli (kitab = kitabun, katab = kataba) */
export function phonKeys(input: string): string[] {
  const k = phonKey(input);
  if (!k) return [];
  const loose = k.length > 4 ? k.replace(/(un|in|an)$/, '').replace(/[aiu]$/, '') : k.replace(/[aiu]$/, '');
  return loose && loose !== k ? [k, loose] : [k];
}

/** İki okunuş aynı kelimeyi gösteriyor mu? */
export function sameSound(a: string, b: string) {
  const ka = phonKeys(a), kb = phonKeys(b);
  return ka.some((x) => kb.includes(x));
}

/** Arama kutusuna yazılabilecek karakterler: Latin (Türkçe dahil), Arapça, boşluk, kesme ve tire */
export const LOOKUP_RE = /^[A-Za-zÇĞİÖŞÜçğıöşüâîûÂÎÛʿʾ'’‘`\-\s؀-ۿ]{1,40}$/;
