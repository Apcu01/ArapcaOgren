# ArbLearn — Arapça Öğren

Claude Design'daki "Arapça Öğrenme Arayüzü" tasarımıyla yapılmış, giriş/kayıt ve veritabanı olmayan statik bir Arapça öğrenme sitesi. HTML + CSS + JavaScript ve Tailwind CSS (CDN) kullanır.

## Çalıştırma

Site uzantısız adresler kullanır (`/konu?id=saatler`, `/sozluk`). Bu yüzden dosyaya çift tıklayarak değil, bir sunucu üzerinden açmalısın:

```bash
node serve.js
```

Sonra `http://localhost:5173` adresine git. İnternet bağlantısı gerekir (Tailwind ve Google Fonts CDN'den yüklenir).

### Yayına alma

| Barındırma | Ne yapmalı? |
| --- | --- |
| Apache / cPanel | Hazır: kökteki `.htaccess` uzantısız adresleri çalıştırır ve `.html`'li eski adresleri yönlendirir (`mod_rewrite` açık olmalı). |
| Vercel | Hazır: `vercel.json` içinde `cleanUrls` açık. |
| Netlify | Ek ayar gerekmez; Netlify `/konu` adresinde `konu.html`'i zaten sunar. |
| Nginx | `location / { try_files $uri $uri.html $uri/ =404; }` |

## Sayfalar

| Adres | İçerik |
| --- | --- |
| `/` | Kategoriler, arama, seviye filtresi, "kaldığın yer" |
| `/konu?id=…` | Konu anlatımı (tablolar, örnekler, püf noktaları, TR/EN karşılaştırma, sık hatalar) ve etkinlikler |
| `/sozluk` | Tüm derslerdeki kelimeler, arama ve sesli dinleme |
| `/alfabe` | 28 harf, harf biçimleri, harekeler ve alıştırmalar |
| `/ilerleme` | Ders ve etkinlik ilerlemesi |

## Dersler (önerilen sıra)

1. Belirlilik ve Tamlama · 2. Zamirler · 3. İyelik Ekleri · 4. Soru Kelimeleri · 5. Sıfatlar · 6. Renkler · 7. Sayılar · 8. Saatler · 9. Günler ve Aylar · 10. Aile · 11. Fiiller · 12. Harf-i Cerler

## Etkinlik türleri

Kelime kartları, eşleştirme, çoktan seçmeli (saat kadranlı sorular dahil), boşluk doldurma, doğru/yanlış, cümle kurma, dinle-ve-seç (kelimelerden otomatik üretilir) ve karma konu testi. Her yanlıştan sonra açıklama gösterilir; yanlış sorular etkinliğin sonunda tekrar sorulur. %70 ve üstü başarı etkinliği "tamamlandı" sayar.

## Notlar

- İlerleme yalnızca tarayıcının `localStorage`'ında tutulur (hesap yok).
- Sesli okuma tarayıcının Web Speech API'sini kullanır. Arapça ses için en iyi sonucu Microsoft Edge ya da işletim sisteminin Arapça ses paketi verir.
- Sağ üstteki ayar düğmesinden harekeler, okunuş ve İngilizce karşılıklar gizlenebilir.

## Yeni ders eklemek

`assets/js/data/` içine mevcut bir dosyayı örnek alarak yeni bir dosya ekle ve `index.html`, `konu.html`, `sozluk.html`, `ilerleme.html` dosyalarına `<script>` etiketiyle bağla. Ders metninde `{{...}}` içine yazılan Arapça otomatik olarak Arapça yazı tipiyle ve sağdan sola gösterilir.
