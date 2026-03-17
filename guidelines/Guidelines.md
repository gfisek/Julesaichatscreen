# JULES Geliştirme Kılavuzu

Bu dosya, JULES AI Asistan projesinde yapay zeka destekli düzenlemeler için
bağlam ve kural seti sağlar.

---

## Proje Özeti

JULES; Apple estetiğine sahip, glassmorphism efektli bir AI asistan widget'ıdır.
İki paralel sistem barındırır:

- **React Preview** (`/src/`) — Figma Make ortamında önizleme, Tailwind CSS v4
- **Web Component** (`/public/jules-src/`) — Vanilla JS + Shadow DOM, production dağıtımı

**Her güncelleme her iki tarafta da yapılmalıdır.**

---

## Genel Kurallar

- Hiçbir zaman `jules-widget.js` veya `jules-widget.min.js` dosyalarını düzenleme;
  bunlar build çıktısıdır, kaynak `jules-src/` altındadır.
- Yeni özellik eklerken hem `jules-src/*.js` hem de ilgili `*.tsx` bileşenini güncelle.
- Veri değişikliklerinde hem `jules-widget/config.json` + `cards.json`
  hem de `src/data/jules-data.ts` güncellenmeli.
- Türkçe içerikte `text-transform: uppercase` kullanma;
  statik metinler büyük yazılsın, dinamikler `toLocaleUpperCase('tr-TR')` ile dönüştürülsün.
- Kart yapısına `tags` alanı ekleme — bu alan kaldırıldı.

---

## Dosya Sorumlulukları

| Dosya | Ne Değiştirilir |
|-------|----------------|
| `constants.js` | Emoji, typewriter phrase, default config, form tanımları |
| `css.js` | Shadow DOM CSS — SHADOW_CSS string |
| `icons.js` | ICO nesnesi — yeni ikon ekleme |
| `utils.js` | Yardımcı fonksiyon ekleme/güncelleme |
| `handlers.js` | Kullanıcı etkileşim mantığı |
| `helpers.js` | UI helper, incremental update, hava durumu |
| `render-chat.js` | Chat mesaj ve header render |
| `render-input.js` | Orbit input, chip bar, footer render |
| `render-content.js` | Kart ve favoriler paneli render |
| `render-form.js` | Satır içi form render |
| `widget.js` | State, lifecycle, public API — dikkatli değiştir |

---

## Tasarım Sistemi

### Renk Paleti

```
primary:      #1c3d54   (koyu lacivert — başlık, buton)
secondary:    #0a6e82   (orta teal)
accent:       #1ba3b8   (canlı teal — CTA, badge kenarlığı)
accentLight:  #4dc4ce   (açık teal — ikon vurgu, aktif durum)
accentBg:     #e6f7f9   (çok açık teal — chip arka planı)
```

### Tipografi

- Font: SF Pro Display → Inter → system-ui
- Boyutlar mobilde: mesaj `13px`, kart başlık `13px`, açıklama `12px`, badge `10px`, CTA `11px`
- Boyutlar desktop: +1–2px yukarı
- `font-weight` ve `line-height` değerlerini Tailwind class'ı ile değil, inline style ile yaz

### İkonlar

Tüm ikonlar `ICO` nesnesinden çekilir (`icons.js`).
Dışarıdan ikon kütüphanesi import edilmez; yeni ikon gerekiyorsa `ICO`'ya eklenir.

---

## Web Component Kuralları

### State Yönetimi

Tüm state `this._st` nesnesindedir; doğrudan property ataması yapma.
State değişimi sonrası `this._build()` veya incremental güncelleme metodu çağrılır.

### Incremental Güncelleme Önceliği

Full `_build()` yerine mümkün olduğunda incremental metodları kullan:

| Senaryo | Kullanılacak Metod |
|---------|--------------------|
| Yeni mesaj | `_patchMessages()` |
| İçerik paneli aç | `_openContentPanel()` |
| İçerik paneli kapat | `_closeContentPanel()` |
| Favori çekmece aç | `_showFavDrawerInc()` |
| Favori çekmece kapat | `_hideFavDrawer()` |
| Favori sayısı güncelle | `_patchFavDrawer()` |

### Timer Yönetimi

Tüm `setTimeout` / `setInterval` çağrıları `this._timers` nesnesine kaydedilmeli:

```js
this._timers.myTimer = setTimeout(() => { … }, 300);
```

`disconnectedCallback`'te otomatik temizlenir:
```js
Object.keys(this._timers).forEach(k => clearTimeout(this._timers[k]));
```

Timer adları benzersiz olmalı. Var olan bir timera tekrar yazmadan önce `clearTimeout` yap.

### AbortController

Async işlemler (fetch, geolocation) için AbortController kullan.
`this._weatherAbort` örneğini model al:

```js
if (this._myAbort) { this._myAbort.abort(); }
this._myAbort = new AbortController();
fetch(url, { signal: this._myAbort.signal });
```

---

## Güvenlik Kuralları

### URL Doğrulaması (ZORUNlu)

`card.url`, `card.image`, `branding.poweredByUrl` ve herhangi bir harici URL'i
doğrudan DOM'a yazmadan önce `isSafeUrl()` ile doğrula:

```js
import { isSafeUrl } from './utils.js';

// Doğru
if (isSafeUrl(card.url)) window.open(card.url, '_blank', 'noopener noreferrer');

// YANLIŞ — asla yapma
window.open(card.url, '_blank');
```

### innerHTML Kuralları

```js
// Sadece hardcoded string veya esc() edilmiş değer
el.innerHTML = '<span>' + ICO.Check(12) + '</span>';           // ✅ hardcoded SVG
el.innerHTML = '<b>' + esc(card.badge) + '</b>';               // ✅ esc()
el.innerHTML = '<span>' + esc(sunLabel.label) + '</span>';     // ✅ esc()

// Kullanıcı / harici veri için textContent kullan
el.textContent = card.title;       // ✅
el.textContent = msg.content;      // ✅
el.innerHTML   = card.title;       // ❌ XSS riski
```

### Yeni Veri Alanı Eklerken Kontrol Listesi

1. Alan bir URL mi? → `isSafeUrl()` ile doğrula
2. Alan `innerHTML`'e yazılacak mı? → `esc()` uygula
3. Alan harici API'den mi geliyor? → Her iki kontrol de zorunlu

---

## Form Sistemi

Yeni form tipi eklemek için **yalnızca** `constants.js`'i düzenle:

```js
// constants.js → FORM_CONFIG
telefon: {
  title:  'TELEFON',
  fields: ['telefon'],
  reply:  'Telefon numaranızı alabilir miyim?',
},
```

`render-form.js` ve `handlers.js` dinamik okur; başka dosya değişmez.

---

## Kart Sistemi

### Kart Anatomisi

```
┌─────────────────────────────┐
│  [ROZET]                    │  ← badge (esc() ile)
│  Başlık                     │  ← textContent
│  Alt başlık                 │  ← textContent
│  Açıklama metni             │  ← textContent
│  [CTA Butonu →]             │  ← isSafeUrl(card.url)
└─────────────────────────────┘
```

- Tag (etiket) satırı **kaldırıldı** — ekleme.
- `card.image` → `img.src` atamasından önce `isSafeUrl()` kontrolü.
- Görsel yüklenemezse `img.onerror` → arka plan rengi göster.

### Kart Tipi Seçimi

| `card.image` var mı? | Kullanılan render |
|---------------------|-------------------|
| Evet | `_buildCardPhoto(card)` |
| Hayır | `_buildCardNoImage(card)` |

---

## CSS & Stil

### Shadow DOM

Tüm stiller `css.js`'teki `SHADOW_CSS` string'inde; class tanımları burada.
Yeni stil gerektiğinde buraya ekle, başka yere ekleme.

### CSS Custom Properties

Widget host element üzerinde tanımlı:

```
--jules-primary      --jules-secondary    --jules-accent
--jules-accent-light --jules-accent-bg    --jules-font
--jw-orbit-angle     --jw-accent-color    --jw-text-primary
--jw-text-secondary  --jw-text-muted      --jw-border
```

Renk değerleri yalnızca `_applyCSSVars()` üzerinden set edilir; doğrudan `style.setProperty` çağrısından kaçın.

---

## Test Kontrol Listesi

Bir değişiklik tamamlandığında:

- [ ] React preview'da görsel doğrulama yapıldı
- [ ] `npm run widget:build` hatasız tamamlandı
- [ ] `demo.html`'de açılış, mesaj gönderme, kart görüntüleme test edildi
- [ ] Dark mode test edildi
- [ ] Mobil (< 768px) görünümü test edildi
- [ ] Pinned Right modu test edildi
- [ ] Yeni URL alanı varsa `isSafeUrl()` testi yapıldı
- [ ] Yeni `innerHTML` varsa `esc()` kullanıldığı doğrulandı
- [ ] Yeni timer varsa `this._timers` kaydedildiği kontrol edildi
