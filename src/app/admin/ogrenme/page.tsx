import Link from 'next/link';
import { Bar, Card, pct, scoreColor, Stat } from '@/components/admin/ui';
import { learningStats } from '@/lib/learning-stats';
import { PUSH_KINDS, PUSH_LABEL } from '@/lib/push-shared';
import { DICTATE_KEY, HARAKAT_KEY } from '@/lib/text';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Okuma, dikte, sınıf, lig' };

export default async function AdminLearningPage() {
  await requireAdmin();
  const s = await learningStats();
  const maxViews = Math.max(1, ...s.readings.map((r) => r.views));
  const prac = (k: string) => s.practice[k] || { n: 0, avg: 0, people: 0 };
  const qWeak = s.readings.flatMap((r) => r.questions.filter((q) => q.attempts >= 3 && q.rate != null).map((q) => ({ ...q, title: r.title, slug: r.slug }))).sort((a, b) => a.rate! - b.rate!).slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight">Okuma, dikte, sınıf, lig</h1>
        <p className="m-0 text-mute">Okuma metinleri, dikte ve hareke koyma, sınıflar, haftalık lig ve bildirimler. Okuma ve alıştırma denemelerinde misafirler de sayılır.</p>
      </div>

      <Card title="Okuma metinleri" right={<Link href="/admin/okuma" className="text-sm font-semibold">Metinleri düzenle</Link>}>
        <div className="overflow-x-auto -mx-1">
          <table className="lt min-w-[720px]">
            <thead><tr><th>Metin</th><th>Görüntülenme</th><th>Okuyan kişi</th><th>Soru çözme</th><th>Ortalama</th><th>Üye: bitiren / deneyen</th></tr></thead>
            <tbody>
              {s.readings.map((r) => (
                <tr key={r.slug}>
                  <td className="font-semibold"><Link href={`/admin/okuma/${r.slug}`}>{r.title}</Link>{!r.published && <span className="ml-2 text-xs text-faint">taslak</span>}</td>
                  <td><span className="flex items-center gap-2 min-w-[120px]"><Bar value={r.views} max={maxViews} /><span className="text-sm w-10 text-right">{r.views}</span></span></td>
                  <td>{r.readers}</td>
                  <td>{r.attempts}</td>
                  <td className={r.avg != null ? scoreColor(r.avg) : ''}>{pct(r.avg)}</td>
                  <td>{r.done} / {r.members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {qWeak.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-lab">En çok yanlış yapılan anlama soruları</span>
            {qWeak.map((q) => (
              <div key={q.slug + q.q} className="flex flex-wrap items-center gap-3 px-3 py-2 rounded-xl bg-s2 border border-line2 text-sm">
                <span className="flex-1 min-w-[220px]"><b>{q.title}:</b> {q.q}</span>
                <span className={scoreColor(q.rate!)}>{pct(q.rate)} doğru</span><span className="text-faint">{q.attempts} cevap</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Dikte ve hareke koyma">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Stat label="Dikte (ders sayfası)" value={prac(DICTATE_KEY).n} sub={`${prac(DICTATE_KEY).people} kişi · ortalama ${pct(prac(DICTATE_KEY).n ? prac(DICTATE_KEY).avg : null)}`} />
          <Stat label="Hareke koyma" value={prac(HARAKAT_KEY).n} sub={`${prac(HARAKAT_KEY).people} kişi · ortalama ${pct(prac(HARAKAT_KEY).n ? prac(HARAKAT_KEY).avg : null)}`} />
        </div>
        {!s.words.length ? <p className="m-0 text-sm text-mute">En az 3 kez sorulan kelime henüz yok.</p> : (
          <div className="overflow-x-auto -mx-1">
            <table className="lt min-w-[560px]">
              <thead><tr><th>Kelime</th><th>Alıştırma</th><th>Ders</th><th>Yanlış</th><th>Deneme</th></tr></thead>
              <tbody>
                {s.words.map((w) => (
                  <tr key={w.kind + w.topic + w.label}>
                    <td className="ar text-[19px]" lang="ar" dir="rtl">{w.label}</td>
                    <td className="text-sm">{w.kind === DICTATE_KEY ? 'Dikte' : 'Hareke'}</td>
                    <td className="text-sm"><Link href={`/konu/${w.topic}`}>{w.topic}</Link></td>
                    <td className={scoreColor(1 - w.wrong / w.attempts)}>{pct(w.wrong / w.attempts)}</td>
                    <td>{w.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Sınıflar">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Stat label="Sınıf" value={s.classes.classes} sub={`son 30 günde ${s.classes.new30} yeni`} />
          <Stat label="Öğretmen" value={s.classes.teachers} />
          <Stat label="Öğrenci" value={s.classes.students} sub={`${s.classes.members} üyelik`} />
          <Stat label="Ödev / duyuru" value={`${s.classes.tasks} / ${s.classes.posts}`} />
        </div>
        {s.topClasses.length > 0 && (
          <div className="overflow-x-auto -mx-1">
            <table className="lt min-w-[560px]">
              <thead><tr><th>Sınıf</th><th>Öğretmen</th><th>Öğrenci</th><th>Ödev</th><th>Bu hafta puan</th></tr></thead>
              <tbody>{s.topClasses.map((c) => <tr key={c.id}><td className="font-semibold">{c.name}</td><td>{c.owner}</td><td>{c.members}</td><td>{c.tasks}</td><td>{c.xp}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Haftalık lig" right={<Link href="/lig" className="text-sm font-semibold">Ligi gör</Link>}>
          <div className="grid gap-3 grid-cols-2">
            <Stat label="Bu hafta puan alan" value={s.league.people} sub={`toplam ${s.league.xp.toLocaleString('tr-TR')} puan`} />
            <Stat label="Geçen hafta" value={s.league.lastPeople} sub={`toplam ${s.league.lastXp.toLocaleString('tr-TR')} puan`} />
          </div>
          <ol className="m-0 p-0 list-none flex flex-col gap-1.5">
            {s.league.top.map((u, i) => (
              <li key={u.id} className="flex items-center gap-3 px-3 h-10 rounded-xl bg-s2 border border-line2 text-sm">
                <b className="w-6">{i + 1}.</b><Link href={`/admin/kullanicilar/${u.id}`} className="flex-1 truncate">{u.name}</Link>
                {u.hidden && <span className="text-xs text-faint">ligde gizli</span>}<b>{u.xp}</b>
              </li>
            ))}
          </ol>
        </Card>
        <Card title="Bildirimler">
          <div className="grid gap-3 grid-cols-2">
            <Stat label="Bildirim açık cihaz" value={s.push.subs} sub={`${s.push.users} üye`} />
            <Stat label="Son 7 günde hatırlatma" value={Object.values(s.push.sends).reduce((a, b) => a + b, 0)} />
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            {PUSH_KINDS.map((k) => (
              <div key={k} className="flex items-center gap-3 px-3 h-10 rounded-xl bg-s2 border border-line2">
                <span className="flex-1">{PUSH_LABEL[k][0]}</span><span className="text-mute">{s.push.kinds[k] || 0} cihaz</span>
                {k !== 'posts' && <span className="text-faint">{s.push.sends[k] || 0} gönderim</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
