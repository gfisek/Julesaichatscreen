# JULES AI Assistant Widget

Apple estetiği, glassmorphism efektleri ve minimalist tasarımla hazırlanmış, Shadow DOM tabanlı Web Component.

---

## Proje Yapısı

```
├── /public/                         # Production dosyaları
│   ├── jules-src/                   # Web Component modülleri (KAYNAK KOD)
│   │   ├── widget.js                # Entry point (JulesWidget sınıfı + state)
│   │   ├── constants.js             # EMOJIS, TW_PHRASES, DEFAULT_CONFIG, DEFAULT_CARDS, FORM_CONFIG, FIELD_META
│   │   ├── shadow.css               # Shadow DOM stylesheet (kaynak CSS — IDE tam destek)
│   │   ├── css.js                   # shadow.css'i import edip SHADOW_CSS olarak re-export eder
│   │   ├── icons.js                 # ICO nesnesi — Lucide (stroke) + Phosphor (fill)
│   │   ├── utils.js                 # debounce, genId, esc, escSelector, heartHtml, weatherIconHtml, getSunLabel, isSafeUrl, lockBodyScroll, …
│   │   ├── handlers.js              # Kullanıcı etkileşim handler'ları (incremental DOM update)
│   │   ├── helpers.js               # UI helper metodları + incremental update metodları
│   │   ├── render-chat.js           # Chat alanı render fonksiyonları
│   │   ├── render-input.js          # Orbit input & footer render fonksiyonları
│   │   ├── render-content.js        # İçerik/favoriler paneli render fonksiyonları
│   │   └── render-form.js           # Satır içi form render fonksiyonları
│   ├── jules-widget/
│   │   ├── config.json              # Widget konfigürasyonu
│   │   └── cards.json               # Kart verisi
│   ├── jules-widget.js              # Build çıktısı (git'e eklenmez)
│   ├── jules-widget.min.js          # Minified build (git'e eklenmez)
│   ├── demo.html                    # Demo & entegrasyon örneği
│   └── BUILD.md                     # Detaylı build dokümantasyonu
│
├── package.json                     # Build script'leri & dependencies
└── guidelines/Guidelines.md         # Geliştirme kılavuzu
```

---

## Hızlı Başlangıç

```bash
# Dependencies yükle
npm install

# Watch mode (otomatik build + sourcemap)
npm run widget:dev

# Tek seferlik build
npm run widget:build

# Production build (minified)
npm run widget:minify
```

### Demo Test

```bash
# Build al
npm run widget:build

# HTTP sunucusu başlat (file:// çalışmaz, HTTP şart)
npx serve .

# Tarayıcıda aç
# http://localhost:3000/public/demo.html
```

---

## Build Komutları

| Komut | Çıktı | Açıklama |
|-------|-------|----------|
| `npm run widget:dev` | `jules-widget.js` + sourcemap | Watch mode (geliştirme) |
| `npm run widget:build` | `jules-widget.js` | Standart build |
| `npm run widget:watch` | `jules-widget.js` | Watch (sourcemap'siz) |
| `npm run widget:minify` | `jules-widget.min.js` | Production (minified) |

Detaylı bilgi için: **[public/BUILD.md](./public/BUILD.md)**

---

## Özellikler

### UI & Tasarım
- **Renk Paleti:** `#1c3d54` tabanlı glassmorphism
- **İkonlar:** Phosphor Icons (`PaperPlaneTilt` send butonu)
- **Tipografi:** SF Pro Display, Inter fallback
- **Dark Mode:** Tam destek; placeholder `#9bcfdf` (ice-blue) ile okunabilirlik sağlandı
- **Orbit Input:** CSS mask yerine `padding: 1.5px` + gradient animasyon — tüm modlarda eşit kalınlıkta çerçeve

### Modlar
- **Desktop:** Tam ekran chat paneli + içerik paneli
- **Pinned Right:** Sağa sabitlenmiş kompakt panel
- **MiniJules:** Yüzen mini widget; şeffaf header, orbit drop-shadow, typewriter "Size nasıl yardımcı olabilirim?" (tek seferlik, döngüsüz)

### Chat
- **Scroll:** Mobilde bot mesajı geldiğinde `scrollIntoView({ block: "start" })` ile üstten kesme önlendi; `scroll-padding-top: 7px` eklendi
- **Favoriler:** Favorilerim panelinde boş durum açıklaması ("Kartların üzerindeki ♥ ikonuna dokunun")

### Kartlar
- Kart yapısı: başlık, alt başlık, açıklama, rozet, görsel ve CTA butonu
- Tag (etiket) satırı kaldırıldı — kartlar daha kompakt
- Görsel yüklenemezse arka plan rengi ile graceful fallback

### Form Sistemi
- `constants.js`'teki `FORM_CONFIG` / `FIELD_META` ile merkezi alan tanımları
- Desteklenen form tipleri: `anaform`, `adsoyad`, `eposta`
- `render-form.js` Shadow DOM'da render, `handlers.js`'de submit yönetimi
- KVKK onay checkbox'ı — form gönderilemeden önce işaretlenmesi zorunlu

### Mobil
- Mesaj baloncukları `13px`, kart başlıkları `13px`, açıklamalar `12px`, badge'ler `10px`, CTA'lar `11px`
- Kapat butonu ikonu `12px`

### Türkçe
- `text-transform: uppercase` kaldırıldı
- Statik metinler büyük harfle yazıldı
- Dinamik metinler `toLocaleUpperCase('tr-TR')` ile dönüştürülüyor

### Performans
- Full DOM rebuild'ler incremental update metodlarıyla değiştirildi:
  - `_patchMessages()` — sadece yeni mesajları DOM'a ekler
  - `_openContentPanel()` / `_closeContentPanel()` — panel toggle
  - `_showFavDrawerInc()` / `_hideFavDrawer()` — favori çekmecesi
  - Suggestions cache, smart typewriter stop, input area persist
- Tipik kullanımda 3 full rebuild → 0 rebuild

---

## Güvenlik

Bu bölüm Mart 2026 güvenlik audit'inde tespit edilen bulguları ve uygulanan düzeltmeleri özetler.

### `isSafeUrl(url)` — `utils.js`

Tüm URL doğrulama noktaları bu tek fonksiyon üzerinden geçer.
İzin verilen: `https://`, `http://`, `/`, `./`, `../`, `#`
Reddedilen: `javascript:`, `data:`, `vbscript:` ve diğer protokoller.

Kullanım noktaları:
| Lokasyon | Alan | Risk |
|----------|------|------|
| `render-content.js` | `card.url` → `window.open()` | URL injection |
| `render-content.js` | `card.image` → `img.src` | Protokol bypass |
| `render-input.js` | `branding.poweredByUrl` → `<a href>` | URL injection |

### HTML Escape — `esc()`

Tüm `innerHTML` atamaları ya hardcoded SVG ya da `esc()` geçmiş string kullanır.
Harici API'den gelen değerler (`wi.temp`, `wi.sunrise`, `wi.sunset`) da `esc()` ile sanitize edilir (defense-in-depth).

### Selector Injection — `escSelector()`

`querySelector('[attr="value"]')` pattern'lerinde harici veriden gelen değerler
`escSelector()` ile sarılır. `"` ve `\` karakterlerini backslash ile escape eder.

### CSS Injection — `_applyCSSVars()` / `setSafe()`

Renk değerleri iki regex ile doğrulanır:
- Hex: `/^#[0-9a-fA-F]{3,8}$/`
- Fonksiyonel: `/^(?:rgba?|hsla?)\s*\([0-9.,\s%]+\)$/i`

Font `family` değeri 200 karakter sınırı ve `[<>"';{}()\\]` karakter kontrolü ile doğrulanır.

### JSON Schema Doğrulaması

`_loadData()` artık yüklenen JSON'ların temel yapısını doğrular:
- `config`: nesne olmalı, dizi/primitive kabul edilmez
- `cards.datasets`: nesne olmalı
- `cards.scenarios`: dizi olmalı

Kötü biçimlendirilmiş veri varsayılan değerleri korur, crash olmaz.

### Mixin Conflict Check

`widget.js`'teki modül çakışma tespiti yalnızca `localhost` veya
`?jw-debug` parametresi ile çalışır; production'da `console.warn` basılmaz.

### Shadow DOM Notu

`attachShadow({ mode: 'open' })` ile oluşturulan Shadow DOM, host sayfanın
`element.shadowRoot` üzerinden erişilebilir. Bu tasarım gereğidir (public API).
Shadow DOM içinde hassas kullanıcı verisi saklanmamaktadır.

---

## Host Siteye Entegrasyon

```html
<!-- 1. Script yükle -->
<script src="/jules-widget.min.js"></script>

<!-- 2. Widget ekle -->
<jules-widget
  config-url="/jules-widget/config.json"
  cards-url="/jules-widget/cards.json"
></jules-widget>

<!-- 3. JavaScript API (opsiyonel) -->
<script>
  const w = document.querySelector('jules-widget');
  w.open();            // Widget'ı aç
  w.close();           // Kapat
  w.toggle();          // Aç/kapat
  // w.setAttribute('dark', '');  // Dark mode
</script>
```

### Custom Events

```js
document.querySelector('jules-widget').addEventListener('jules:productclick', e => {
  console.log(e.detail.productId, e.detail.card);
});
// jules:minimize  — widget minimize edildiğinde
```

---

## Teknik Detaylar

| Özellik | Değer |
|---------|-------|
| Bundle Tool | esbuild v0.25+ |
| Format | IIFE (Immediately Invoked Function Expression) |
| Encapsulation | Shadow DOM (tam CSS/JS izolasyonu) |
| Yaklaşık Boyut | ~100 KB (unminified) / ~40–50 KB (minified) |
| Tarayıcı Desteği | Modern tarayıcılar (ES2020+) |

---

## Dokümantasyon

- **[public/BUILD.md](./public/BUILD.md)** — Detaylı build & modül API rehberi
- **[public/demo.html](./public/demo.html)** — Canlı örnek & entegrasyon kodu
- **[guidelines/Guidelines.md](./guidelines/Guidelines.md)** — Geliştirme kılavuzu & güvenlik kuralları
- **Modül JSDoc** — Her `.js` dosyasındaki satır içi yorumlar

---

**Version:** 2.2
**Last Updated:** 18 Mart 2026
**Maintained by:** JULES Team
