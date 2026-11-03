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
  members: ClassMember[]; tasks: ClassTask[];
};
