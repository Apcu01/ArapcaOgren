// Kaba kuvvet koruması kuralları (saf fonksiyonlar; veritabanından bağımsız test edilebilir)
export type AttemptKind = 'login' | 'register' | 'password' | 'report' | 'lookup';

export const RULES: Record<AttemptKind, { windowMin: number; perEmail?: number; perIp?: number; countOk?: boolean }> = {
  // Aynı e-postaya 15 dakikada 5, aynı IP'den 20 hatalı giriş
  login: { windowMin: 15, perEmail: 5, perIp: 20 },
  // Aynı IP'den saatte 5 yeni hesap (başarılı kayıtlar da sayılır)
  register: { windowMin: 60, perIp: 5, countOk: true },
  // Şifre değiştirme / hesap silme: hesap başına 15 dakikada 5 hatalı şifre
  password: { windowMin: 15, perEmail: 5 },
  // Hata bildirimi: aynı IP'den saatte 20 bildirim
  report: { windowMin: 60, perIp: 20, countOk: true },
  // Yapay zekâ ile kelime arama (sözlükten ve önbellekten gelenler sayılmaz): aynı IP'den saatte 120
  lookup: { windowMin: 60, perIp: 120, countOk: true }
};

export type AttemptRow = { email: string | null; ip: string; ok: boolean; createdAt: Date };

/**
 * Pencere içindeki denemelere bakarak engel olup olmadığını söyler.
 * Engel varsa kaç saniye sonra tekrar denenebileceğini döndürür, yoksa 0.
 */
export function blockedFor(kind: AttemptKind, rows: AttemptRow[], email: string | null, ip: string, now = new Date()): number {
  const r = RULES[kind];
  const since = now.getTime() - r.windowMin * 60e3;
  const counted = rows.filter((x) => x.createdAt.getTime() > since && (r.countOk || !x.ok));
  const check = (list: AttemptRow[], limit?: number) => {
    if (!limit || list.length < limit) return 0;
    // En eski sayılan deneme pencereden çıkınca engel kalkar
    const sorted = list.map((x) => x.createdAt.getTime()).sort((a, b) => a - b);
    const unlock = sorted[list.length - limit] + r.windowMin * 60e3;
    return Math.max(1, Math.ceil((unlock - now.getTime()) / 1000));
  };
  const byEmail = email ? check(counted.filter((x) => x.email === email), r.perEmail) : 0;
  const byIp = check(counted.filter((x) => x.ip === ip), r.perIp);
  return Math.max(byEmail, byIp);
}

export function waitMessage(seconds: number) {
  const min = Math.ceil(seconds / 60);
  return `Çok fazla deneme yapıldı. Güvenliğin için ${min} dakika sonra tekrar dene.`;
}
