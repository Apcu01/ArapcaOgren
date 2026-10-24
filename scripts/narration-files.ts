// scripts/narrations/<ders>.json dosyalarındaki öğretmen anlatımlarını okur
import fs from 'node:fs';
import path from 'node:path';

export type NarrationFile = { sections: string[]; summary: string };

export const NARR_DIR = path.join(process.cwd(), 'scripts', 'narrations');

export function loadNarration(topicId: string): NarrationFile | null {
  const file = path.join(NARR_DIR, topicId + '.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8')) as NarrationFile;
}

export const narrationIds = () =>
  fs.readdirSync(NARR_DIR).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));

/** Anlatımları ders bölümlerine sırayla yerleştirir; bölüm sayısı tutmazsa hata verir */
export function applyNarration<S extends { narr?: string }>(topicId: string, lesson: S[], n: NarrationFile) {
  if (n.sections.length !== lesson.length) {
    throw new Error(`${topicId}: dersin ${lesson.length} bölümü var, anlatım dosyasında ${n.sections.length} metin var.`);
  }
  return lesson.map((s, i) => ({ ...s, narr: n.sections[i] }));
}
