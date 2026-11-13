/* Sınıflar: tarayıcı ve sunucu ortak türler ve kurallar */

export const CLASS_LIMITS = { owned: 20, joined: 30, members: 200, tasks: 100 } as const;
/** Katılma kodu: karışan harfler (I, O, 0, 1) yok */
export const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const normCode = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
export const isCode = (s: string) => new RegExp(`^[${CODE_CHARS}]{6}$`).test(s);

export type TaskKind = 'topic' | 'reading' | 'list';
export const TASK_KIND: Record<TaskKind, string> = { topic: 'Ders', reading: 'Okuma metni', list: 'Kelime listesi' };

/** Öğrencinin ödevdeki durumu: pct 0-100, done: tamamlandı (ders: %100, okuma: %70 ve üstü, liste: kelimelerin hepsi öğrenildi) */
export type TaskStatus = { pct: number; done: boolean; started: boolean };
export type ClassTask = {
  id: number; kind: TaskKind; ref: string; title: string; due: string | null; createdAt: string;
  /** Öğrencinin açacağı bağlantı (liste: kendi kopyası ya da kopyalama sayfası) */
  href: string | null;
  /** Öğretmen görünümü: öğrenci numarası -> durum; öğrenci görünümü: yalnızca kendisi */
  status: Record<number, TaskStatus>;
};
export type ClassMember = { userId: number; name: string; joinedAt: string };
export type ClassSummary = { id: number; name: string; owner: string; isOwner: boolean; members: number; tasks: number; code?: string };
export type ClassDetail = {
  id: number; name: string; owner: string; isOwner: boolean; code: string | null; me: number;
  members: ClassMember[]; tasks: ClassTask[]; posts: ClassPost[];
};

export type ClassPost = { id: number; body: string; createdAt: string };
export const POST_MAX = 1000;

/** Ödev raporu (Excel'in Türkçe ayarlarında açılır: noktalı virgül ayraçlı, UTF-8 BOM): öğrenciler satırda, ödevler sütunda */
export function classReportCsv(c: Pick<ClassDetail, 'name' | 'members' | 'tasks'>, today: string) {
  const cell = (v: string | number) => { const s = String(v); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const row = (cells: (string | number)[]) => cells.map(cell).join(';');
  const tasks = [...c.tasks].reverse();
  const state = (s?: TaskStatus) => (!s || !s.started ? 'Başlanmadı' : s.done ? 'Tamamlandı' : `%${s.pct}`);
  const lines = [
    row([c.name, `${c.members.length} öğrenci`, `${tasks.length} ödev`, `Rapor: ${today}`]),
    '',
    row(['Öğrenci', ...tasks.map((t) => `${TASK_KIND[t.kind]}: ${t.title}${t.due ? ` (son gün ${t.due})` : ''}`), 'Tamamlanan ödev']),
    ...c.members.map((m) => row([m.name, ...tasks.map((t) => state(t.status[m.userId])), tasks.filter((t) => t.status[m.userId]?.done).length])),
    '',
    row(['Tamamlayan öğrenci', ...tasks.map((t) => Object.values(t.status).filter((s) => s.done).length), ''])
  ];
  return '\uFEFF' + lines.join('\r\n');
}
