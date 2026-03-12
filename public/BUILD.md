# JULES Widget — Build Guide

> **Not:** Build script'leri (`widget:build`, `widget:dev`, `widget:watch`, `widget:minify`) proje kökündeki `package.json` dosyasında tanımlıdır. Komutlar proje kök dizininden çalıştırılmalıdır.

---

## Dosya Yapısı

```
/public/
├── jules-src/                 # Web Component kaynak modülleri
│   ├── widget.js              # Entry point — JulesWidget sınıfı, state yönetimi
│   ├── constants.js           # EMOJIS, TW_PHRASES, DEFAULT_CONFIG, DEFAULT_CARDS
│   ├── css.js                 # Shadow DOM stylesheet (CSS_VARS + tüm stiller)
│   ├── icons.js               # ICO nesnesi — Lucide (stroke) + Phosphor (fill) SVG'leri
│   ├── utils.js               # debounce, genId, heartHtml, weatherIconHtml, getSunLabel, registerOrbitProperty
│   ├── handlers.js            # Kullanıcı etkileşim handler'ları (incremental DOM update)
│   ├── helpers.js             # UI helper metodları + incremental update metodları
│   ├── render-chat.js         # Chat alanı HTML render fonksiyonları
│   ├── render-input.js        # Orbit input alanı render fonksiyonları
│   └── render-content.js      # İçerik/favoriler paneli render fonksiyonları
├── jules-widget/
│   ├── config.json            # Widget konfigürasyonu (branding, renkler, vb.)
│   └── cards.json             # Senaryo/kart verileri
├── jules-widget.js            # Build çıktısı — git'e eklenmez
├── jules-widget.min.js        # Minified build çıktısı — git'e eklenmez
├── demo.html                  # Standalone demo & entegrasyon örneği
└── BUILD.md                   # Bu dosya
```

---

## Geliştirme

### Web Component Geliştirme

```bash
# Watch mode (dosya değişikliklerini izler, otomatik build + sourcemap)
npm run widget:dev

# Watch mode (sourcemap'siz)
npm run widget:watch
```

**Değişiklik akışı:**
1. `/public/jules-src/*.js` içinde ilgili modülü düzenle
2. Watch mode otomatik olarak bundle'ı günceller
3. Tarayıcıda `demo.html`'i yenile (HTTP sunucusu üzerinden)

---