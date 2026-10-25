# ArapcaOgren | Arapça Öğren

Next.js 16 (App Router) + TypeScript + MySQL ile çalışan Arapça öğrenme sitesi. Arayüz, `oldsite/` klasöründeki statik sürümle (Claude Design arayüzü) aynıdır.

- **Hesapsız kullanım:** Bütün dersler ve etkinlikler hesap açmadan çalışır; ilerleme ve hatalar tarayıcının `localStorage`'ında tutulur.
- **Hesapla kullanım:** Giriş yapılınca okunan konular, etkinlik skorları, seri, son ders ve hatalar doğrudan veritabanına yazılır. Misafirken biriken ilerleme, kayıt ya da giriş anında hesaba aktarılır. E-posta ya da Google ile giriş yapılabilir.
- **Hatalarım:** Yanlış yapılan sorular toplanır; doğru cevaplanınca listeden düşer.
- **Gerçek ses kayıtları:** Yönetim panelinden yüklenen ya da kaydedilen sesler, tarayıcı sesinin yerine çalınır.
- **Öğretmen anlatımı:** Her dersin bölümleri ve özeti ElevenLabs sesiyle sesli anlatılır; bölüm bölüm dinlenebilir, alttaki oynatıcıyla hız ayarlanır.
- **Telaffuz alıştırması:** Kelime dinlenir, sonra mikrofona söylenir; tarayıcının konuşma tanıması (Chrome, Edge, Safari) söyleneni kontrol eder ve kullanıcı kendi sesini dinleyebilir. Konuşma tanıma olmayan tarayıcılarda kendi sesini kaydedip kendini değerlendirme moduna geçer.
- **Arapça yazı boyutu:** Ayarlardan Arapça metinler normal, büyük ya da çok büyük gösterilebilir.
- **Harf yazma:** Alfabe sayfasında harfin silik biçiminin üzerinden parmakla ya da fareyle geçilir; çizim harfin şekliyle karşılaştırılır. Dört biçim (tek, başta, ortada, sonda) ayrı ayrı çalışılır.
- **Kök ailesi:** Sözlükte kökü bilinen kelimelerde "Kök" düğmesi; kökün anlamını, derslerde aynı kökten gelen kelimeleri ve Türkçedeki karşılıklarını (كتب: kitap, kâtip, mektep) gösterir. Veri `src/lib/roots.ts` dosyasında.
- **Çalışma takvimi:** İlerlemem sayfasında son bir yılın günlük çalışma haritası, çalışılan gün sayısı ve en uzun seri.
- **Açık ve koyu tema:** Ayarlardan Koyu, Açık ya da Sistem seçilir; renkler `globals.css` içindeki tema değişkenlerinden gelir.
- **Hata bildirimi:** Sorularda, kelime kartlarında ve ders bölümlerinde "Hata mı var?" düğmesi; bildirimler yönetim panelindeki Bildirimler sayfasında toplanır.
- **Paylaşım kartı:** Tamamlanan her ders için indirilebilir ve paylaşılabilir görsel.
- **PWA:** Telefona uygulama gibi eklenebilir, ziyaret edilen ya da indirilen dersler çevrimdışı açılır.
- **Yönetim paneli (`/admin`):** İstatistikler (soru bazında dahil), kullanıcılar ve verileri, ders/etkinlik düzenleme, sesler, hata bildirimleri.

## Kurulum

```bash
npm install
```

`.env.example` dosyasını `.env.local` olarak kopyalayıp değerleri doldur (MySQL 8 önerilir). Değişkenler:

| Değişken | Açıklama |
| --- | --- |
| `DATABASE_URL` | MySQL bağlantısı |
| `SITE_URL` | Yayındaki adres (site haritası, paylaşım görselleri, Google girişi) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | İsteğe bağlı. Boşsa Google düğmesi görünmez. |

Tabloları oluştur:

```bash
npm run db:push
```

Dersleri eski siteden veritabanına aktar (var olanları değiştirmek için `-- --force` ekle):

```bash
npm run db:seed
```

Yönetici hesabı oluştur ya da var olan bir hesabı yönetici yap:

```bash
npm run admin:create -- eposta@ornek.com "GüçlüBirŞifre" "Ad Soyad"
```

Geliştirme sunucusu:

```bash
npm run dev
```

Üretim:

```bash
npm run build
```

```bash
npm start
```

### Google ile giriş

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) üzerinde bir **OAuth istemci kimliği** (Web uygulaması) oluştur.
2. **Yetkili yönlendirme URI'si** olarak `<SITE_URL>/api/auth/google/callback` ekle (yerelde `http://localhost:3000/api/auth/google/callback`).
3. İstemci kimliğini ve gizli anahtarı `.env.local` dosyasına yaz, sunucuyu yeniden başlat.

Google'dan gelen e-posta, var olan bir hesabın e-postasıyla aynıysa iki hesap birleştirilir. Yalnızca Google ile açılan hesaplar, Hesabım sayfasından sonradan şifre belirleyebilir.

## Testler

```bash
npm test
```

Birim ve bileşen testleri (71 test): Arapça metin işleme, arama, saat ifadeleri, telaffuz karşılaştırması, kök ailesi, soru anahtarları, giriş sınırı kuralları, ders verisinin doğrulaması ve oynatıcının puanlaması.

```bash
npm run test:api
```

API entegrasyon testleri (12 test): çalışan bir sunucu (`TEST_BASE_URL`, varsayılan `http://localhost:3000`) ve `.env.local` içindeki veritabanı gerekir. Geçici test hesapları açar ve sonunda oluşturduğu her kaydı siler. Kayıt sınırı nedeniyle aynı IP'den saatte birkaç kez çalıştırılabilir.

```bash
npm run test:e2e
```

Uçtan uca testler (Playwright, 7 test): gerçek bir Chromium tarayıcısında arama, ders okuma ve etkinlik çözme, ilerleme sayfası ve çalışma takvimi, tema değiştirme, sözlükte kök ailesi, harf çizme, mobil menü ve hesap akışı (kayıt, misafir ilerlemesinin aktarılması, başka tarayıcıdan giriş, hesabın silinmesi). Yerel geliştirme sunucusunu kullanır, açık değilse başlatır; başka bir adres için `E2E_URL` verilebilir. İlk kurulumda tarayıcı bir kez indirilmelidir: `npx playwright install chromium`. Hesap testi bir kayıt yaptığı için kayıt sınırına sayılır ve oluşturduğu hesabı siler.

## Diğer komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run audio:generate` | Sesi olmayan bütün Arapça metinler için OpenRouter üzerinden (varsayılan: ElevenLabs Eleven v4 Turbo, "george" sesi) ses üretip veritabanına yükler. `-- --dry` kaç ifade ve ne kadar tutacağını gösterir, `-- --limit 5` deneme yapar, `-- --force` var olanları da yeniden üretir. `.env.local` içinde `OPENROUTER_API_KEY` gerekir. |
| `npm run audio:narrate` | Öğretmen anlatımlarını (`scripts/narrations/<ders>.json`: her bölüm için bir metin ve bir özet, Arapça kısımlar harekeli olarak `{{ }}` içinde) derslere yazar ve eksik anlatım seslerini ElevenLabs "sarah" sesiyle üretir. Metni değişen bölümün eski sesi silinir. `-- --dry` maliyeti gösterir, `-- --topic saatler` tek ders, `-- --force` yeniden üretir. Anlatımlar admin panelindeki ders düzenleyiciden de yazılıp tek tek seslendirilebilir. |
| `npm run icons` | `brand/logo.svg` dosyasından favicon ve uygulama ikonlarını üretir |
| `npm run typecheck` | TypeScript denetimi |

## Yapı

| Yol | İçerik |
| --- | --- |
| `src/app/(site)/` | Herkese açık sayfalar: `/`, `/konu?id=...`, `/sozluk`, `/ilerleme`, `/alfabe`, `/hatalarim`, `/giris`, `/kayit`, `/hesap` |
| `src/app/admin/` | Yönetim paneli: genel bakış, kullanıcılar, dersler ve düzenleyici, sesler |
| `src/app/api/` | Kimlik doğrulama (e-posta ve Google), ilerleme, hatalar, istatistik olayları, sesler, hesap ve yönetici API'leri |
| `src/app/og`, `sitemap.ts`, `robots.ts`, `manifest.ts` | Paylaşım görselleri, site haritası, robots, PWA bildirimi |
| `src/components/` | Arayüz bileşenleri; `Player.tsx` tüm etkinlik türlerini oynatır |
| `src/db/schema.ts` | Veritabanı şeması (Drizzle ORM) |
| `src/lib/` | Oturum, sorgular, metin/Arapça yardımcıları, saat pratiği, istatistikler, giriş sınırı |
| `public/sw.js` | Çevrimdışı kullanım için service worker (yalnızca üretimde kaydedilir) |
| `brand/logo.svg` | Logo kaynağı |
| `scripts/` | Ders aktarımı, yönetici oluşturma, ikon üretimi, tipografi temizliği |
| `tests/` | Birim, bileşen ve API testleri |
| `oldsite/` | Eski statik sürüm (`node oldsite/serve.js` ile `http://localhost:5173`) |

### Veritabanı tabloları

`users`, `sessions` (çerezdeki belirtecin yalnızca SHA-256 özeti saklanır), `topics`, `activities`, `topic_progress`, `activity_progress`, `study_days`, `mistakes`, `question_stats`, `audio` (ses dosyaları), `narration_audio` (öğretmen anlatımı sesleri), `reports` (hata bildirimleri), `auth_attempts` (giriş ve bildirim sınırı), `events` (ziyaret, ders okuma ve etkinlik bitirme; misafirler dahil).

## Güvenlik

- Şifreler bcrypt ile saklanır.
- Giriş: aynı e-postaya 15 dakikada 5, aynı IP'den 20 hatalı deneme sonrası geçici engel. Kayıt: IP başına saatte 5 hesap. Şifre değiştirme ve hesap silme: 15 dakikada 5 hatalı şifre.
- Yönetici olmayanlar paneli 404 olarak görür; yönetici API'leri sunucu tarafında yetki denetler.

## Notlar

- Ayarlar (hareke, okunuş, İngilizce, Arapça yazı boyutu, tema) bir çerezde saklanır; sunucu sayfayı doğru biçimde çizer.
- Dersler, ses eşlemesi ve anlatım sesleri sunucu belleğinde önbelleğe alınır (`src/lib/cache.ts`). Yönetim panelindeki değişiklikler anında yansır; komut satırı betiklerinin (`db:seed`, `audio:generate`, `audio:narrate`) yaptığı değişiklikler en geç 5 dakika sonra görünür ya da sunucu yeniden başlatılınca hemen görünür.
- Tailwind CSS 3.4 kullanılır (eski sitedeki CDN sürümüyle aynı ana sürüm). `npm audit` uyarıları Tailwind 3'ün derleme zamanı bağımlılıklarındandır; çalışan siteye gönderilmez.
- `drizzle-kit push`, mevcut bir veritabanında bileşik birincil anahtarları gereksiz yere yeniden kurmak isteyebilir ("Cannot drop index 'PRIMARY'"). Bu, aracın bilinen bir sorunudur; şema zaten günceldir.
- `.env.local` veritabanı şifresini içerir; `.gitignore` ile dışarıda tutulur.
