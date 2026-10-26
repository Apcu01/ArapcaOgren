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
- **Kelime bul (`/kelime-bul`):** Arapça kelime duyulduğu gibi Latin harfleriyle (ketebe, efvan, müderris) ya da Arapça yazılır. Önce derslerdeki kelimelerde, sonra yaklaşık 850 kelimelik yerleşik sözlükte (`scripts/lexicon-data.ts`: defterdeki kelimeler, meslekler, selamlaşmalar, bağlaçlar, harf-i cerler, ev eşyaları, yiyecekler, yerler, hayvanlar, giyim, hava ve doğa, okul, spor, duygular, alışveriş, sağlık, sayılar, günlük kalıplar, sıfatlar ve sık fiiller; çift kayıt ve ders kelimeleriyle çakışma kontrolü: `npx tsx scripts/lexicon-check.ts`; `npm run db:lexicon` ile veritabanına yüklenir) esnek okunuş araması yapılır. Harekeler tamamen yanlış okunsa da ünsüz iskeletine göre en yakın kelimeler önerilir. Yerleşik sözlükte de (hareke, şedde, uzatma ve İngilizce yazım farkları yok sayılır; `src/lib/translit.ts`). Bulunamazsa OpenRouter üzerinden yapay zekâya (varsayılan `deepseek/deepseek-v4-flash-0731`, `LOOKUP_MODEL` ile değişir) sorulur; harekeli yazılış, Türkçe anlam, kök ve örnek cümle döner. Sonuçlar `lookups` tablosunda önbelleğe alınır, aynı arama tekrar ücret oluşturmaz. Ders kelimeleri, yerleşik sözlük ve önbellek herkese açık ve sınırsızdır; yalnızca maliyet doğuran yapay zekâ isteği giriş ister ve IP başına saatte 120 ile sınırlıdır. Arama en fazla 40 karakterdir ve günlük toplam tavan (`LOOKUP_DAILY_LIMIT`, varsayılan 2000). Arama başına maliyet yaklaşık 0,00005 - 0,0001 $; yönetim panelindeki Kelime aramaları sayfası aramaları ve toplam maliyeti gösterir. Mikrofon düğmesiyle kelime söylenerek de aranabilir (tarayıcının Arapça konuşma tanıması; desteklemeyen tarayıcıda düğme görünmez).
- **Kelime sayfaları (`/kelime/...`):** Derslerdeki ve yerleşik sözlükteki her kelimenin kendi sayfası var (örnek: `/kelime/ketebe`): anlam, okunuş, harekeli yazılış, kök ailesi, Türkçedeki karşılıklar ve geçtiği dersler. Arama motorları için başlık ("Ketebe ne demek?"), açıklama ve yapılandırılmış veri içerir; `/kelime` sayfası hepsini A-Z listeler, site haritasında da yer alır. Adresler okunuştan üretilir (`src/lib/slug.ts`), aynı okunuşlu kelimeler anlamla ayrılır (`ma-su`, `ma-ne`).
- **Listelerim (`/listelerim`, hesap gerekir):** Herkes kendi kelime listelerini oluşturur (en fazla 100 liste, listede 300 kelime). Düzenleyicide okunuş, Arapça ya da Türkçe anlam yazınca derslerden ve yerleşik sözlükten öneri gelir (yapay zekâ kullanılmaz); "Toplu ekle" ile satır satır yapıştırılır (`Arapça ; okunuş ; anlam`), "Dersten ekle" ile bir dersin bütün kelimeleri eklenir. Kelime bul, sözlük ve kelime sayfalarındaki "Listeye ekle" düğmesi de kelimeyi listeye ekler. Quizlet'teki modların hepsi var: **Kartlar** (çevrilen kartlar, otomatik oynatma, karıştırma, yıldız, "Biliyorum / Öğreniyorum" ile ayırma ve kaydırma), **Öğren** (7 kelimelik turlar; önce çoktan seçmeli, sonra yazılı; yanlışlar turun sonunda tekrar gelir), **Test** (doğru/yanlış, çoktan seçmeli, eşleştirme ve yazılı; puan sonunda, "Yanlışlarla yeni test"), **Eşleştir** (süreye karşı, yanlışa 1 sn ceza), **Blast** (doğru cevabı taşıyan göktaşını vur, 3 can, seviyeyle hızlanır), **Bloklar** (doğru cevapla 3 blok kazan, 8x8 tahtada satır ve sütun doldur) ve **Tılsım** (üçlü dizme; soru tılsımlarında doğru cevap hamle kazandırır). Soru yönü (Arapça → Türkçe, tersi, karışık), yalnız yıldızlılar ve yazılı sorular ayarlanabilir. Yazılı cevaplarda anlamlardan biri yeterli, küçük yazım hatası "neredeyse" sayılır; Arapça cevap harekesiz ya da okunuşla yazılabilir (`src/lib/study.ts`). Kelimenin durumu (Çalışılmamış, Öğrenmeye devam, Öğrenildi) Kartlar, Öğren ve Test cevaplarına göre belirlenir, art arda iki doğru öğrenilmiş sayılır; oyunlarda en iyi süre ve puan saklanır. Liste çalışmak çalışma takvimine ve seriye de sayılır. **Paylaşım:** liste sayfasındaki "Paylaş" ile gizli bir bağlantı açılır (`/liste/[token]`, arama motorlarına kapalı). Bağlantıyı alan herkes kelimeleri görür; giriş yapınca "Listelerime kopyala" ile kendi hesabına kopyalar (kopya bağımsızdır, ilerleme sıfırdan başlar). Paylaşanın yalnızca adı görünür, ilerlemesi görünmez. Paylaşım kapatılınca ya da "Yeni bağlantı oluştur" ile bağlantı yenilenince eski bağlantı çalışmaz; kaç kez kopyalandığı pencerede görünür. **Kopyanın güncellenmesi:** kopya, asıl listeyi ve her kelimenin asıl karşılığını hatırlar. Asıl listeye kelime eklenir, bir kelime düzeltilir ya da çıkarılırsa kopyanın sayfasında "Asıl listede değişiklik var" uyarısı çıkar; "Gözden geçir" ile istenenler seçilip alınır, seçilmeyenler bir daha önerilmez. Kopyalayanın kendi eklediği kelimeler, düzenlemeleri ve ilerlemesi korunur. Asıl listenin sahibinin çalışması ya da sırayı değiştirmesi öneri oluşturmaz (kelimenin `updated_at` alanı yalnızca içerik değişince ilerler). Asıl liste silinir ya da paylaşımı kapatılırsa güncelleme gelmez; bağlantıyı yenilemek güncellemeleri durdurmaz.
- **Hata bildirimi:** Sorularda, kelime kartlarında ve ders bölümlerinde "Hata mı var?" düğmesi; bildirimler yönetim panelindeki Bildirimler sayfasında toplanır.
- **Paylaşım kartı:** Tamamlanan her ders için indirilebilir ve paylaşılabilir görsel.
- **PWA:** Telefona uygulama gibi eklenebilir, ziyaret edilen ya da indirilen dersler çevrimdışı açılır. "Uygulamayı yükle" düğmesi ayarlar menüsünde, mobil menüde ve telefonda ana sayfadaki kapatılabilir kartta bulunur (`src/components/InstallApp.tsx`): Android ve bilgisayarda tarayıcının yükleme penceresini açar, iPhone ve iPad'de Ana Ekrana Ekle adımlarını gösterir. Uygulama zaten yüklüyse ya da tarayıcı desteklemiyorsa görünmez.
- **Yönetim paneli (`/admin`):** Şu an sitede olanlar (canlı: üye ve misafir sayısı, baktıkları sayfalar; açık sekmeler dakikada bir sinyal gönderir, sunucu belleğinde tutulur), son 14 günün grafiği ve tablosu (siteye giren kişi, okunan konu, yapılan etkinlik, dinlenen ders ve kelime, kelime bul araması, doğru ve yanlış cevap; yeni sayaçlar `daily_metrics` tablosunda), istatistikler (soru bazında dahil), kullanıcılar ve verileri, ders/etkinlik düzenleme, sesler, hata bildirimleri, kelime listeleri (`/admin/listeler`: bütün üyelerin listeleri, liste adı / üye adı / e-posta ile arama, paylaşılan ve kopya süzgeci, özet sayılar; liste sayfasında kelimeler ve öğrenme durumları, oyun rekorları, bu listeden alınan kopyalar; uygunsuz içerik için "Paylaşımı kapat" ve "Listeyi sil"). Kullanıcı sayfasında o üyenin listeleri de görünür.

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

Birim ve bileşen testleri (84 test): Arapça metin işleme, arama, saat ifadeleri, telaffuz karşılaştırması, kök ailesi, soru anahtarları, giriş sınırı kuralları, ders verisinin doğrulaması ve oynatıcının puanlaması.

```bash
npm run test:api
```

API entegrasyon testleri (12 test): çalışan bir sunucu (`TEST_BASE_URL`, varsayılan `http://localhost:3000`) ve `.env.local` içindeki veritabanı gerekir. Geçici test hesapları açar ve sonunda oluşturduğu her kaydı siler. Kayıt sınırı nedeniyle aynı IP'den saatte birkaç kez çalıştırılabilir.

```bash
npm run test:e2e
```

Uçtan uca testler (Playwright, 11 test): gerçek bir Chromium tarayıcısında arama, kelime bul (yapay zekâ cevabı taklit edilir, ücret oluşmaz), ders okuma ve etkinlik çözme, ilerleme sayfası ve çalışma takvimi, tema değiştirme, sözlükte kök ailesi, harf çizme, mobil menü ve hesap akışı (kayıt, misafir ilerlemesinin aktarılması, başka tarayıcıdan giriş, hesabın silinmesi). Yerel geliştirme sunucusunu kullanır, açık değilse başlatır; başka bir adres için `E2E_URL` verilebilir. İlk kurulumda tarayıcı bir kez indirilmelidir: `npx playwright install chromium`. Hesap ve kelime bul testleri birer geçici hesap açıp sonunda siler; kayıt sınırı (IP başına saatte 5) nedeniyle aynı bilgisayardan saatte en fazla iki kez çalıştırılabilir.

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
| `src/app/(site)/` | Herkese açık sayfalar: `/`, `/konu/[id]` (eski `/konu?id=...` adresleri kalıcı olarak yönlendirilir), `/sozluk`, `/kelime-bul`, `/kelime`, `/kelime/[slug]`, `/liste/[token]` (paylaşılan liste), `/listelerim` (liste sayfası `/listelerim/[id]`, düzenleme `/duzenle`, modlar `/kartlar`, `/ogren`, `/test`, `/eslestir`, `/blast`, `/bloklar`, `/tilsim`), `/ilerleme`, `/alfabe`, `/hatalarim`, `/giris`, `/kayit`, `/hesap` |
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

`users`, `sessions` (çerezdeki belirtecin yalnızca SHA-256 özeti saklanır), `topics`, `activities`, `topic_progress`, `activity_progress`, `study_days`, `mistakes`, `question_stats`, `audio` (ses dosyaları), `narration_audio` (öğretmen anlatımı sesleri), `reports` (hata bildirimleri), `lookups` (kelime bul önbelleği), `lexicon` (kelime bul yerleşik sözlüğü; `ar` sütunu harekeye duyarlı `utf8mb4_bin`), `word_lists` ve `word_list_items` (kişisel kelime listeleri, paylaşım bağlantısı `share_token`, kopyalanma sayısı, kopyalar için asıl liste `source_list_id` ve kelime karşılığı `source_item_id`, kelime başına doğru/yanlış sayısı ve art arda doğru sayısı; hesap silinince listeler de silinir), `auth_attempts` (giriş ve bildirim sınırı), `events` (ziyaret, ders okuma ve etkinlik bitirme; misafirler dahil).

## Güvenlik

- Şifreler bcrypt ile saklanır.
- Giriş: aynı e-postaya 15 dakikada 5, aynı IP'den 20 hatalı deneme sonrası geçici engel. Kayıt: IP başına saatte 5 hesap. Şifre değiştirme ve hesap silme: 15 dakikada 5 hatalı şifre.
- Yönetici olmayanlar paneli 404 olarak görür; yönetici API'leri sunucu tarafında yetki denetler.
- Herkese açık sayaç uç noktalarında IP başına dakikalık sınır (`src/lib/throttle.ts`, sunucu belleğinde): sayaçlar 300, canlı sinyal 400, olaylar 1500, kelime bul 300. Okul ağında bütün sınıf aynı IP'yi paylaştığı için sınırlar 40 kişilik bir sınıfa göre geniş tutuldu; amaç betikle şişirmeyi engellemek.

## Notlar

- Sayfalar önceden hazırlanır: herkese açık sayfalar, dersler (`/konu/[id]`) ve kelime sayfaları derlemede statik HTML olarak üretilir, her istekte sunucuda çizilmez. Bunun için kök düzen çerez ya da oturum okumaz: ayarlar (hareke, okunuş, İngilizce, Arapça yazı boyutu, tema) bir çerezde saklanır ve sayfa çizilmeden önce küçük bir betikle uygulanır (renk ya da düzen sıçraması olmaz); oturum, ilerleme ve hatalar tarayıcıda `/api/me` ile alınır. Üst menüdeki hesap simgesi, oturum gelene kadar son giriş yapan kişinin adıyla (yerel ipucu) gösterilir.
- Derleme: `DATABASE_URL` ve `SITE_URL` derleme argümanı olarak verilirse (Dokploy: Build Args) içerik derlemede hazır olur. Verilmezse derleme yine başarılı olur, sunucu açıldıktan birkaç saniye sonra sayfalar veritabanından kendiliğinden yenilenir (`src/instrumentation.ts`, yalnızca üretimde; geliştirmede bu yenileme açık sekmeleri sürekli yeniletiyordu).
- İçerik güncelleme: yönetim panelindeki değişiklikler hazırlanmış sayfaları anında yeniler. Komut satırı betiklerinin (`db:seed`, `db:lexicon`, `audio:generate`, `audio:narrate`) yaptığı değişiklikler için panelin genel bakış sayfasındaki "Siteyi yenile" düğmesi kullanılır; kullanılmazsa en geç bir saat içinde ya da sunucu yeniden başlatılınca görünür.
- Hız: sayfa geçişlerinde üstte ince bir ilerleme çubuğu anında görünür (yükleme iskeleti bilerek kullanılmaz: React içeriği iskeletten sonra bir süre geciktirdiği için geçişi ~200 ms yerine ~800 ms yapıyordu). Sayfalar önceden hazır olduğu için geçişler yerelde ~105-140 ms sürer (önceden 190-570 ms). Ziyaret edilen sayfalar tarayıcıda 30 sn tutulur (`staleTimes`), oturum bilgisi sunucu belleğinde 60 sn tutulur (çıkış ve hesap değişikliklerinde hemen silinir).
- Dersler, ses eşlemesi, anlatım sesleri ve kelime listesi ayrıca sunucu belleğinde önbelleğe alınır (`src/lib/cache.ts`).
- Tailwind CSS 3.4 kullanılır (eski sitedeki CDN sürümüyle aynı ana sürüm). `npm audit` uyarıları Tailwind 3'ün derleme zamanı bağımlılıklarındandır; çalışan siteye gönderilmez.
- `drizzle-kit push`, mevcut bir veritabanında bileşik birincil anahtarları gereksiz yere yeniden kurmak isteyebilir ("Cannot drop index 'PRIMARY'"). Bu, aracın bilinen bir sorunudur; şema zaten günceldir.
- `.env.local` veritabanı şifresini içerir; `.gitignore` ile dışarıda tutulur.
