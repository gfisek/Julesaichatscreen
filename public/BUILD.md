# JULES Widget — Build & Modül Rehberi

> **Not:** Tüm build komutları proje kök dizininden çalıştırılmalıdır.
> Build script'leri `package.json` içinde tanımlıdır.

---

## İçindekiler

1. [Dosya Yapısı](#dosya-yapısı)
2. [Build Komutları](#build-komutları)
3. [Geliştirme Akışı](#geliştirme-akışı)
4. [Modül API Referansı](#modül-api-referansı)
5. [Veri Şeması](#veri-şeması)
6. [Güvenlik Notları](#güvenlik-notları)
7. [Deployment](#deployment)

---

## Dosya Yapısı

```
/public/
├── jules-src/                   # Kaynak modüller — yalnızca burası düzenlenir
│   ├── widget.js                # Entry point: JulesWidget sınıfı, lifecycle, state
│   ├── constants.js             # Sabitler: EMOJIS, TW_PHRASES, DEFAULT_CONFIG,
│   │                            #   DEFAULT_CARDS, FORM_CONFIG, FIELD_META
│   ├── css.js                   # Shadow DOM stylesheet: export SHADOW_CSS (string)
│   ├── icons.js                 # export ICO — Lucide (stroke) + Phosphor (fill) SVG'leri
│   ├── utils.js                 # Yardımcı fonksiyonlar (aşağıda detay)
│   ├── handlers.js              # Kullanıcı etkileşim handler'ları
│   ├── helpers.js               # UI helper'ları + incremental update metodları
│   ├── render-chat.js           # Chat paneli render fonksiyonları
│   ├── render-input.js          # Orbit input & alt footer render
│   ├── render-content.js        # İçerik/favoriler paneli render + kart build
│   └── render-form.js           # Satır içi form render fonksiyonları
├── jules-widget/
│   ├── config.json              # Widget konfigürasyonu (branding, renkler, öneri chip'leri)
│   └── cards.json               # Senaryo + kart veri seti
├── jules-widget.js              # Build çıktısı — git'e eklenmez
├── jules-widget.min.js          # Minified build — git'e eklenmez
├── demo.html                    # Standalone demo & entegrasyon testi
└── BUILD.md                     # Bu dosya
```

> **Kural:** `jules-widget.js` her build'de sıfırdan üretilir.
> `jules-src/` dışında hiçbir dosyayı manuel düzenleme.

---

## Build Komutları

| Komut | Çıktı | Açıklama |
|-------|-------|----------|
| `npm run widget:dev` | `jules-widget.js` + `.map` | Watch + sourcemap (geliştirme) |
| `npm run widget:watch` | `jules-widget.js` | Watch, sourcemap'siz |
| `npm run widget:build` | `jules-widget.js` | Tek seferlik standart build |
| `npm run widget:minify` | `jules-widget.min.js` | Production (minified + tree-shake) |

### esbuild Parametreleri

```bash
# Standart
npx esbuild public/jules-src/widget.js \
  --bundle --format=iife \
  --outfile=public/jules-widget.js

# Minified
npx esbuild public/jules-src/widget.js \
  --bundle --format=iife --minify \
  --outfile=public/jules-widget.min.js

# Dev watch
npx esbuild public/jules-src/widget.js \
  --bundle --format=iife --sourcemap \
  --outfile=public/jules-widget.js --watch
```

---

## Geliştirme Akışı

### 1. HTTP Sunucusu Başlat

```bash
npm run widget:dev          # Terminal 1 — watch build
npx serve . -p 3000         # Terminal 2 — HTTP sunucusu
```

`file://` protokolü ile `fetch()` çalışmaz; mutlaka HTTP üzerinden test et.

### 2. Demo'yu Aç

```
http://localhost:3000/public/demo.html
```

### 3. Değişiklik Akışı

```
jules-src/*.js düzenle
       ↓
esbuild watch otomatik bundle günceller
       ↓
Tarayıcıda F5
```

### İki Sistemi Senkron Tut

Her `jules-src/` değişikliği için paralel React değişikliği de yapılmalıdır:

| WC tarafı | React tarafı |
|-----------|-------------|
| `render-chat.js` | `ChatPanel.tsx`, `MessageList.tsx` |
| `render-input.js` | `ChatInput.tsx`, `JulesOrbitInput.tsx` |
| `render-content.js` | `ContentPanel.tsx` |
| `render-form.js` | `InlineForm.tsx` |
| `helpers.js` | `ChatHeader.tsx` |
| `constants.js` | `jules-data.ts` |
| `jules-widget/config.json` | `jules-data.ts` → `JULES_CONFIG` |
| `jules-widget/cards.json` | `jules-data.ts` → `JULES_CARDS` |

---

## Modül API Referansı

### `widget.js` — JulesWidget

`HTMLElement` genişleten ana sınıf. Render modülleri prototype mixin ile eklenir.

**Public API:**

| Metod / Attribute | Açıklama |
|-------------------|----------|
| `open()` / `close()` | Widget'ı aç / kapat |
| `toggle()` | Aç/kapat |
| `expand()` | MiniJules → tam widget (spring animasyonu) |
| `minimize()` | Tam widget → MiniJules |
| `config-url` attribute | Config JSON URL'si (varsayılan: `./jules-widget/config.json`) |
| `cards-url` attribute | Cards JSON URL'si (varsayılan: `./jules-widget/cards.json`) |
| `open` attribute | Var ise widget açık başlar |
| `dark` attribute | Var ise dark mode açık başlar |

**Custom Events:**

| Event | `detail` | Açıklama |
|-------|----------|----------|
| `jules:productclick` | `{ productId, card }` | Kart CTA tıklandı |
| `jules:minimize` | — | Widget minimize edildi |

**Private metodlar (prefix `_`):**

| Metod | Açıklama |
|-------|----------|
| `_build()` | Ana DOM rebuild — minimize/expand geçişlerinde çağrılır |
| `_loadData()` | config.json + cards.json fetch, şema doğrulaması ile |
| `_applyCSSVars()` | config renk/font değerlerini CSS custom property olarak uygular |
| `_T()` | Aktif tema token'larını döner (`textPrimary`, `bg`, `accentColor`, …) |
| `_patchMessages()` | Sadece yeni mesajları DOM'a ekler, full rebuild yapmaz |
| `_openContentPanel()` | İçerik panelini incremental DOM ile açar |
| `_closeContentPanel()` | İçerik panelini DOM'dan kaldırır, chat genişler |
| `_showFavDrawerInc()` | Favori çekmecesini incremental ekler |
| `_hideFavDrawer()` | Favori çekmecesini kaldırır |
| `_fetchWeather()` | open-meteo API'den hava durumu çeker; AbortController ile iptal edilebilir |
| `_installFocusTrap()` | Shadow DOM içi tab döngüsü + Escape → close |
| `_removeFocusTrap()` | Focus trap listener'larını temizler |

---

### `utils.js` — Yardımcı Fonksiyonlar

| Export | İmza | Açıklama |
|--------|------|----------|
| `debounce` | `(fn, ms) → fn` | Trailing debounce |
| `genId` | `() → string` | `crypto.randomUUID()` tabanlı benzersiz ID |
| `formatTime` | `(Date) → string` | `HH:MM` formatı (tr-TR) |
| `esc` | `(s) → string` | HTML entity encode (`&`, `<`, `>`, `"`, `'`) |
| `getDateStr` | `() → string` | Türkçe uzun tarih (Pazartesi, 17 Mart) |
| `lockBodyScroll` | `() → void` | Referans sayaçlı body scroll kilidi |
| `unlockBodyScroll` | `() → void` | Kilit sayacını azaltır, 0'a gelince serbest bırakır |
| `forceUnlockBodyScroll` | `() → void` | Sayacı sıfırlar, her zaman serbest bırakır |
| `registerOrbitProperty` | `() → void` | `--jw-orbit-angle` CSS property'yi kayıt eder |
| `heartHtml` | `(size, isLiked, isHovered, onImg) → string` | Favori kalp SVG HTML'i |
| `weatherIconHtml` | `(code, color, size) → string` | WMO koduna göre hava durumu ikonu |
| `getSunLabel` | `(wi) → {label} \| null` | Gün doğumu/batımı etiketi (anlık saate göre) |
| `isSafeUrl` | `(url) → boolean` | URL protokol doğrulaması — `javascript:` / `data:` reddeder |

---

### `constants.js` — Sabitler

| Export | Tip | Açıklama |
|--------|-----|----------|
| `EMOJIS` | `string[]` | Emoji döngüsü için liste |
| `TW_PHRASES` | `string[]` | Typewriter placeholder metinleri |
| `DEFAULT_CONFIG` | `object` | Fallback widget konfigürasyonu |
| `DEFAULT_CARDS` | `object` | Fallback kart verisi `{ datasets: {}, scenarios: [] }` |
| `FORM_CONFIG` | `object` | Form tipleri ve alan tanımları |
| `FIELD_META` | `object` | Form alanı metadata'sı (label, type, placeholder, required, autocomplete) |

**Yeni form tipi eklemek:**
Yalnızca `constants.js`'teki `FORM_CONFIG`'e yeni entry ekle.
`render-form.js` ve `handlers.js` dinamik olarak bu yapıyı okur.

---

### `handlers.js` — Etkileşim Handler'ları

Prototype mixin ile `JulesWidget`'a eklenir. Doğrudan export edilmez, `widget.js` içinden `Object.assign` ile atanır.

| Metod | Açıklama |
|-------|----------|
| `_handleSend(text)` | Kullanıcı mesajı gönder + bot yanıtı tetikle |
| `_handleVote(msgId, dir)` | Mesaj oylama (up/down), incremental DOM güncelle |
| `_handleCopy(msgId, text)` | Clipboard kopyalama; güvenli bağlamda Clipboard API, değilse fallback |
| `_handleLike(cardId)` | Kart favorileme; badge ve like count güncelle |
| `_handleScenario(keyword)` | Keyword'e uyan scenario'yu bul, kartları aç |
| `_handleFormSubmit(type, data)` | Form gönder, bot yanıtı ekle |

---

### `render-chat.js` — Chat Render

| Metod | Açıklama |
|-------|----------|
| `_buildChatPanel()` | Tam chat paneli DOM ağacı |
| `_buildHeader()` | Hava durumu + tarih + dark/pin switch içeren header |
| `_buildMessages()` | Tüm mesaj listesi |
| `_buildMessage(msg)` | Tek mesaj baloncuğu (user/bot/card/form) |
| `_buildTypingIndicator()` | Üç nokta typing animasyonu |
| `_buildCardChip(msg)` | "Sonuçları Gör" kart bağlantı chip'i |
| `_scrollToLastMessage()` | Son mesaja smooth scroll |

---

### `render-input.js` — Input & Footer Render

| Metod | Açıklama |
|-------|----------|
| `_buildInputArea()` | Orbit input + chip bar + footer sarmalayıcı |
| `_buildOrbitInput()` | Canlı gradient kenarlıklı textarea + butonlar |
| `_buildChipBar()` | Öneri chip'leri satırı |
| `_buildFooter()` | "Powered by" bağlantısı + KVKK notu |
| `_buildDarkSwitch()` | Dark mode toggle switch |
| `_buildPinSwitch()` | Pin right toggle switch |

---

### `render-content.js` — İçerik Paneli Render

| Metod | Açıklama |
|-------|----------|
| `_buildContentPanel()` | İçerik veya favoriler paneli sarmalayıcı |
| `_buildSessionList()` | Kart seansları liste görünümü |
| `_buildCardNoImage(card)` | Görselsiz kart (kompakt liste layoutu) |
| `_buildCardPhoto(card)` | Görselli kart (tall card layoutu) |
| `_buildCtaBtn(card)` | CTA butonu; `card.url` `isSafeUrl()` ile doğrulanır |
| `_buildFavDrawer()` | Mobil favori bottom sheet |
| `_buildFavoritesView()` | Favoriler listesi görünümü |
| `_patchFavDrawer()` | Favori badge sayısını incremental güncelle |
| `_getAllFavCards()` | `likedCards` set'inden tam kart nesneleri |

---

### `render-form.js` — Form Render

| Metod | Açıklama |
|-------|----------|
| `_buildInlineForm(type)` | `FORM_CONFIG[type]`'a göre form DOM'u oluşturur |
| `_buildFormField(meta, name)` | Tek alan (input/textarea + label) |
| `_buildKvkkRow()` | KVKK onay checkbox + bağlantı satırı |

---

### `helpers.js` — UI Helper Metodları

| Metod | Açıklama |
|-------|----------|
| `_fetchWeather()` | Coğrafi konum → open-meteo → header güncelle |
| `_startEmojiCycle()` | Emoji döngüsü başlat |
| `_stopEmojiCycle()` | Emoji döngüsünü durdur |
| `_runIntroSequence()` | İlk açılış animasyon sekansı |
| `_buildMiniJules()` | Yüzen mini widget DOM'u |
| `_applyTheme()` | Dark/light mod uygula (CSS var + attribute) |
| `_getAllFavCards()` | Tüm kart setlerinden favorileri topla |
| `_getFavCount()` | Favori sayısı (cache'li) |

---

### `css.js` — Shadow DOM Stylesheet

Tek bir `export const SHADOW_CSS` string export eder.
Tüm stillar bu modüldedir; `widget.js` `adoptedStyleSheets` API ile uygular.

### `icons.js` — İkon Kütüphanesi

`export const ICO` nesnesi. Tüm ikonlar inline SVG string döner.

| Grup | İkonlar |
|------|---------|
| Lucide (stroke) | Bot, Sparkles, Copy, Check, ThumbsUp, ThumbsDown, ChevronRight/Left/Down/Up, Heart, X, Send, Mic, Volume2, ArrowUpRight, Clock, Info |
| Phosphor (fill) | ArrowUp, PaperPlaneTilt, CloudSun, CloudFog, Sun, SunDim, CloudRain, CloudSnow, CloudLightning, Snowflake, SunHorizon, Moon, PhosphorX, Monitor, SidebarSimple |

---

## Veri Şeması

### `config.json`

```jsonc
{
  "branding": {
    "name": "JULES",
    "poweredBy": "Powered by Creator AI",
    "poweredByUrl": "https://creator.com.tr"   // isSafeUrl() doğrulamasına tabi
  },
  "colors": {
    "primary":     "#1c3d54",
    "secondary":   "#0a6e82",
    "accent":      "#1ba3b8",
    "accentLight": "#4dc4ce",
    "accentBg":    "#e6f7f9"
  },
  "font": { "family": "inherit" },
  "suggestions": ["iPhone 16 serisi", "Mac modelleri", "…"],
  "defaultReplies": ["…"]
}
```

> Renk değerleri `_applyCSSVars()` içinde regex ile doğrulanır.
> Yalnızca `#RRGGBB`, `rgba()`, `hsla()` ve bilinen renk isimleri kabul edilir.

---

### `cards.json`

```jsonc
{
  "datasets": {
    "iphones": [
      {
        "id": "ip1",
        "type": "product",          // "product" | "article" | "service"
        "title": "iPhone 16 Pro Max",
        "subtitle": "6.9\" · Doğal Titanyum",
        "description": "…",
        "image": "https://…",       // isSafeUrl() doğrulamasına tabi
        "price": "$1,199",
        "rating": 4.9,
        "reviews": 15240,
        "badge": "Yeni",
        "badgeColor": "#1c3d54",
        "cta": "Satın Al",
        "url": "https://apple.com/…" // isSafeUrl() doğrulamasına tabi
      }
    ]
  },
  "scenarios": [
    {
      "keywords": ["iphone", "telefon"],
      "dataset": "iphones",
      "title": "iPhone Modelleri"
    }
  ]
}
```

> **Kaldırılan Alan:** `tags` dizisi artık render edilmiyor. Veri dosyasında bırakılabilir (ignored).

---

## Güvenlik Notları

### URL Doğrulaması

`card.url`, `card.image` ve `branding.poweredByUrl` alanları
`utils.js`'teki `isSafeUrl()` fonksiyonundan geçirilir.

```js
// İzin verilenler
"https://apple.com/iphone"
"http://localhost:3000"
"/products/iphone"
"./assets/image.jpg"

// Reddedilenler
"javascript:alert(1)"
"data:text/html,<script>…</script>"
"vbscript:msgbox(1)"
```

### HTML Sanitizasyon

- Kullanıcı girdisi (textarea) her zaman `textContent` ile yazılır, asla `innerHTML`.
- Kart başlık/açıklama/subtitle alanları `textContent` ile yazılır.
- Badge, CTA metni ve branding name `esc()` ile escape edilir.
- `sunLabel.label` (harici API verisi) `innerHTML`'e yazılmadan önce `esc()` uygulanır.

### `_loadData()` Şema Kontrolü

```js
// config: nesne olmalı, dizi/primitive kabul edilmez
if (cfg && typeof cfg === 'object' && !Array.isArray(cfg)) { … }

// cards: datasets nesne, scenarios dizi olmalı
this._cards = {
  datasets:  (typeof cards.datasets === 'object') ? cards.datasets  : {},
  scenarios: Array.isArray(cards.scenarios)        ? cards.scenarios : [],
};
```

### CSS Custom Property Doğrulaması

`_applyCSSVars()` içinde renk değerleri regex ile doğrulanır:
```
/^#[0-9a-fA-F]{3,8}$|^rgba?\s*\(.+\)$|^hsla?\s*\(.+\)$|^[a-z]+$/i
```

Font `family` değeri 200 karakter sınırı ve `[<>"']` karakter kontrolü ile doğrulanır.

---

## Deployment

### CDN / Self-Host

```
/dist/
├── jules-widget.min.js      # ~40-50 KB — tek dosya, sıfır bağımlılık
├── jules-widget/
│   ├── config.json
│   └── cards.json
```

### Host Siteye Ekleme

```html
<script src="/dist/jules-widget.min.js"></script>
<jules-widget
  config-url="/dist/jules-widget/config.json"
  cards-url="/dist/jules-widget/cards.json"
></jules-widget>
```

### Backend'den Kart Güncelleme

```
jules-widget/cards.json dosyasını sunucudan dinamik olarak serve et.
Widget her sayfa yüklemesinde bu dosyayı fetch eder.
Kart güncellemeleri için widget'ı yeniden build etmeye gerek yoktur.
```

### Önerilen CSP Başlıkları

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  connect-src 'self' https://api.open-meteo.com;
  img-src 'self' https://images.unsplash.com data:;
  style-src 'self' 'unsafe-inline';
```

> `unsafe-inline` Shadow DOM `adoptedStyleSheets` için gereklidir.

---

**Version:** 2.1
**Last Updated:** 17 Mart 2026
