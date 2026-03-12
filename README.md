# JULES AI Assistant Widget

Apple estetiği, glassmorphism efektleri ve minimalist tasarımla hazırlanmış, Shadow DOM tabanlı Web Component.

---

## Proje Yapısı

```
├── /src/app/                    # React Preview (Figma Make ortamı)
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatHeader.tsx       # Chat başlığı & mod toggle
│   │   │   ├── ChatInput.tsx        # Input wrapper
│   │   │   ├── ChipBar.tsx          # Öneri chip'leri
│   │   │   ├── FavoritesDrawer.tsx  # Favoriler çekmecesi
│   │   │   ├── JulesOrbitInput.tsx  # Ortak orbit input bileşeni
│   │   │   ├── MessageList.tsx      # Mesaj listesi & scroll
│   │   │   └── SwitchTooltip.tsx    # Mod geçiş tooltip
│   │   ├── ChatPanel.tsx            # Ana chat paneli
│   │   ├── ContentPanel.tsx         # İçerik/favoriler paneli
│   │   ├── FavButton.tsx            # Favori butonu
│   │   └── MiniJules.tsx            # Mini yüzen widget
│   ├── context/JulesContext.tsx     # Global state
│   ├── hooks/useJulesTokens.ts      # Token hook
│   ├── types/jules.ts               # TypeScript tipleri
│   └── data/jules-data.ts           # Config & mock data (src tarafı)
│
├── /src/styles/
│   ├── theme.css                    # Design tokens & orbit input CSS
│   ├── fonts.css                    # Font imports
│   ├── index.css                    # Global styles
│   └── tailwind.css                 # Tailwind entry
│
├── /public/                         # Production dosyaları
│   ├── jules-src/                   # Web Component modülleri (KAYNAK KOD)
│   │   ├── widget.js                # Entry point (JulesWidget sınıfı)
│   │   ├── constants.js             # Config & defaults
│   │   ├── css.js                   # Shadow DOM styles
│   │   ├── icons.js                 # Phosphor icon SVG'leri
│   │   ├── utils.js                 # Utilities
│   │   ├── handlers.js              # Event handlers
│   │   ├── helpers.js               # UI helpers
│   │   ├── render-chat.js           # Chat rendering
│   │   ├── render-input.js          # Input rendering
│   │   └── render-content.js        # Content panel rendering
│   ├── jules-widget/
│   │   ├── config.json              # Widget konfigürasyonu
│   │   └── cards.json               # Kart verisi
│   ├── jules-widget.js              # Build output (git'e eklenmez)
│   ├── jules-widget.min.js          # Minified build (git'e eklenmez)
│   ├── demo.html                    # Demo & entegrasyon örneği
│   └── BUILD.md                     # Detaylı build dokümantasyonu
│
├── package.json                     # Build script'leri & dependencies
└── vite.config.ts                   # React preview build config
```

---

## Hızlı Başlangıç

### 1. Geliştirme Ortamı (Figma Make)
Figma Make'te otomatik çalışır, ekstra kurulum gerekmez.

### 2. Web Component Geliştirme

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

### 3. Demo Test

```bash
# Build al
npm run widget:build

# HTTP sunucusu başlat (file:// çalışmaz, HTTP şart)
npx serve .

# Tarayıcıda aç
# http://localhost:3000/public/demo.html
```

---

## İki Farklı Sistem

### React Preview (`/src/`)
- **Amaç:** Figma Make ortamında önizleme
- **Entry:** `/src/app/App.tsx`
- **Tech:** React 18 + Tailwind CSS v4
- **Data:** `/src/data/jules-data.ts`

### Web Component (`/public/jules-src/`)
- **Amaç:** Production widget (gerçek siteler için)
- **Entry:** `/public/jules-src/widget.js`
- **Tech:** Vanilla JS + Shadow DOM
- **Data:** `/public/jules-widget/*.json`
- **Build:** esbuild ile IIFE bundle

> **Her değişiklikte her iki sistemi de senkron tut.**

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
- **JulesOrbitInput:** `ChatInput` ve `MiniJules` tarafından paylaşılan ortak bileşen
- **Scroll:** Mobilde bot mesajı geldiğinde `scrollIntoView({ block: "start" })` ile üstten kesme önlendi; `scroll-padding-top: 7px` eklendi
- **Favoriler:** Favorilerim panelinde boş durum açıklaması ("Kartların üzerindeki ♥ ikonuna dokunun")

### Mobil
- Mesaj baloncukları `13px`, kart başlıkları `13px`, açıklamalar `12px`, badge'ler `10px`, CTA'lar `11px`
- Kapat butonu ikonu `12px`

### Türkçe
- `text-transform: uppercase` kaldırıldı
- Statik metinler büyük harfle yazıldı
- Dinamik metinler `toLocaleUpperCase('tr-TR')` ile dönüştürülüyor

### Performans (Web Component)
- Full DOM rebuild'ler incremental update metodlarıyla değiştirildi:
  - `_patchMessages()` — sadece yeni mesajları DOM'a ekler
  - `_openContentPanel()` / `_closeContentPanel()` — panel toggle
  - `_showFavDrawerInc()` / `_hideFavDrawer()` — favori çekmecesi
  - Suggestions cache, smart typewriter stop, input area persist
- Tipik kullanımda 3 full rebuild → 0 rebuild

---

## Değişiklik Yaparken

### Sadece UI Testi (Hızlı)
1. `/src/app/components/*.tsx` düzenle
2. Figma Make otomatik yeniler

### Production Sync (Tam)
1. `/src/app/components/*.tsx` düzenle (React preview)
2. `/public/jules-src/*.js` düzenle (Web Component)
3. `npm run widget:dev` çalıştır
4. `demo.html`'i test et

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
  document.querySelector('jules-widget').open();
  // widget.setAttribute('dark', 'true');
</script>
```

---

## Teknik Detaylar

- **Bundle Tool:** esbuild v0.25+
- **Format:** IIFE (Immediately Invoked Function Expression)
- **Encapsulation:** Shadow DOM (tam CSS/JS izolasyonu)
- **Size:** ~100 KB (unminified) / ~40-50 KB (minified)
- **Browser Support:** Modern browsers (ES6+)
- **React:** 18.3.1 (peer dependency, sadece preview için)
- **Tailwind CSS:** v4

---

## Dokümantasyon

- **[public/BUILD.md](./public/BUILD.md)** — Detaylı build & deployment rehberi
- **[public/demo.html](./public/demo.html)** — Canlı örnek & entegrasyon kodu
- **Modül API'leri** — Her `.js` dosyasındaki JSDoc yorumları

---

**Version:** 2.0
**Last Updated:** 12 Mart 2026
**Maintained by:** JULES Team
