/** Okunuştan sayfa adresi: "kitâb" -> kitab, "es-selâmu aleykum" -> es-selamu-aleykum, "‘afven" -> afven */
export function wordSlug(s: string) {
  return String(s || '')
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[ʿʾ‘’'`´?]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
