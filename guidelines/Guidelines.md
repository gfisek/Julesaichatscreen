# JULES Gelistirme Kilavuzu

Bu dosya, JULES AI Asistan projesinde yapay zeka destekli duzenlemeler icin
baglam ve kural seti saglar.

---

## Proje Ozeti

JULES; Apple estetigne sahip, glassmorphism efektli bir AI asistan widget'idir.
Shadow DOM tabanli Web Component olarak (`/public/jules-src/`) gelistirilir;
Vanilla JS + Shadow DOM ile production dagitimi yapilir.

`/public/jules-widget.js` dosyasi her build'de `esbuild` tarafindan
`jules-src/widget.js`'ten sifirdan uretilir; yalnizca `jules-src/` altindaki
kaynak dosyalar duzenlenir.

---

## Genel Kurallar

- Hicbir zaman `jules-widget.js` veya `jules-widget.min.js` dosyalarini duzenleme;
  bunlar build ciktisidir, kaynak `jules-src/` altindadir.
- Veri degisikliklerinde `jules-widget/config.json` ve `cards.json` guncellenmeli.
- Turkce icerikte `text-transform: uppercase` kullanma;
  statik metinler buyuk yazilsin, dinamikler `toLocaleUpperCase('tr-TR')` ile donusturulsun.
- Kart yapisina `tags` alani ekleme -- bu alan kaldirildi.

---

## Dosya Sorumluluklari

| Dosya | Ne Degistirilir |
|-------|----------------|
| `constants.js` | Emoji, typewriter phrase, default config, form tanimlari |
| `shadow.css` | Shadow DOM CSS -- tum stiller burada, IDE tam destegi ile |
| `css.js` | Yalnizca `shadow.css`'i import edip re-export eder -- duzenleme |
| `icons.js` | ICO nesnesi -- yeni ikon ekleme, `weatherIcon` dispatcher |
| `utils.js` | Yardimci fonksiyon ekleme/guncelleme (`esc`, `escSelector`, `isSafeUrl` vb.) |
| `handlers.js` | Kullanici etkilesim mantigi |
| `helpers.js` | UI helper, incremental update, hava durumu |
| `render-chat.js` | Chat mesaj ve header render |
| `render-input.js` | Orbit input, chip bar, footer render |
| `render-content.js` | Kart ve favoriler paneli render |
| `render-form.js` | Satir ici form render |
| `widget.js` | State, lifecycle, public API -- dikkatli degistir |

---

## Tasarim Sistemi

### Renk Paleti

```
primary:      #1c3d54   (koyu lacivert -- baslik, buton)
secondary:    #0a6e82   (orta teal)
accent:       #1ba3b8   (canli teal -- CTA, badge kenarligi)
accentLight:  #4dc4ce   (acik teal -- ikon vurgu, aktif durum)
accentBg:     #e6f7f9   (cok acik teal -- chip arka plani)
```

### Tipografi

- Font: SF Pro Display -> Inter -> system-ui
- Boyutlar mobilde: mesaj `13px`, kart baslik `13px`, aciklama `12px`, badge `10px`, CTA `11px`
- Boyutlar desktop: +1-2px yukari
- `font-weight` ve `line-height` degerlerini Tailwind class'i ile degil, inline style ile yaz

### Ikonlar

Tum ikonlar `ICO` nesnesinden cekilir (`icons.js`).
Disaridan ikon kutuphanesi import edilmez; yeni ikon gerekiyorsa `ICO`'ya eklenir.

`ICO.weatherIcon(code, size)` -- WMO hava durumu kodlarini ikon metotlarina esler:

| WMO Kod Araligi | Ikon |
|------------------|------|
| 0-1 | `Sun` |
| 2-3 | `CloudSun` |
| 45-48 | `CloudFog` |
| 51-67 | `CloudRain` |
| 71-77 | `Snowflake` |
| 80-82 | `CloudRain` |
| 85-86 | `CloudSnow` |
| 95-99 | `CloudLightning` |
| diger | `CloudSun` (fallback) |

---

## Web Component Kurallari

### State Yonetimi

Tum state `this._st` nesnesindedir; dogrudan property atamasi yapma.
State degisimi sonrasi `this._build()` veya incremental guncelleme metodu cagrilir.

### Incremental Guncelleme Onceligi

Full `_build()` yerine mumkun oldugunda incremental metodlari kullan:

| Senaryo | Kullanilacak Metod |
|---------|-------------------|
| Yeni mesaj | `_patchMessages()` |
| Icerik paneli ac | `_openContentPanel()` |
| Icerik paneli kapat | `_closeContentPanel()` |
| Favori cekmece ac | `_showFavDrawerInc()` |
| Favori cekmece kapat | `_hideFavDrawer()` |
| Favori sayisi guncelle | `_patchFavDrawer()` |

### Timer Yonetimi

Tum `setTimeout` / `setInterval` cagrilari `this._timers` nesnesine kaydedilmeli:

```js
this._timers.myTimer = setTimeout(() => { ... }, 300);
```

`disconnectedCallback`'te otomatik temizlenir:
```js
Object.keys(this._timers).forEach(k => clearTimeout(this._timers[k]));
```

Timer adlari benzersiz olmali. Var olan bir timera tekrar yazmadan once `clearTimeout` yap.

### AbortController

Async islemler (fetch, geolocation) icin AbortController kullan.
`this._weatherAbort` ornegini model al:

```js
if (this._myAbort) { this._myAbort.abort(); }
this._myAbort = new AbortController();
fetch(url, { signal: this._myAbort.signal });
```

---

## Guvenlik Kurallari

### URL Dogrulamasi (ZORUNLU)

`card.url`, `card.image`, `branding.poweredByUrl` ve herhangi bir harici URL'i
dogrudan DOM'a yazmadan once `isSafeUrl()` ile dogrula:

```js
import { isSafeUrl } from './utils.js';

// Dogru
if (isSafeUrl(card.url)) window.open(card.url, '_blank', 'noopener noreferrer');

// YANLIS -- asla yapma
window.open(card.url, '_blank');
```

`isSafeUrl` yalnizca su prefixlere izin verir: `https://`, `http://`, `/`, `./`, `../`, `#`.
`javascript:`, `data:`, `vbscript:` ve protocol-relative (`//evil.com`) reddedilir.

### innerHTML Kurallari

```js
// Sadece hardcoded string veya esc() edilmis deger
el.innerHTML = '<span>' + ICO.Check(12) + '</span>';           // DOGRU - hardcoded SVG
el.innerHTML = '<b>' + esc(card.badge) + '</b>';               // DOGRU - esc()
el.innerHTML = '<span>' + esc(sunLabel.label) + '</span>';     // DOGRU - esc()

// Sayi bile olsa API'den gelen deger esc() ile sarilmali (defense-in-depth)
wRow.innerHTML = '...' + esc(String(wi.temp)) + '...'          // DOGRU - API degeri

// Kullanici / harici veri icin textContent kullan
el.textContent = card.title;       // DOGRU
el.textContent = msg.content;      // DOGRU
el.innerHTML   = card.title;       // YANLIS - XSS riski
```

### querySelector Selector Injection Korumasi (ZORUNLU)

Harici veriden gelen degerler (card.id, msgId vb.) `querySelector` attribute
selector'larinda kullanilirken `escSelector()` ile sarilmalidir:

```js
import { escSelector } from './utils.js';

// DOGRU
shadow.querySelector('[data-like-key="' + escSelector(likeKey) + '"]');

// YANLIS -- card.id icinde " karakteri varsa selector kirilir
shadow.querySelector('[data-like-key="' + likeKey + '"]');
```

`escSelector()` `"` ve `\` karakterlerini backslash ile escape eder.

### CSS Injection Korumasi (ZORUNLU)

`_applyCSSVars()` config.json'dan gelen renk degerlerini CSS custom property
olarak atar. Iki katmanli koruma vardir:

**1. Renk degerleri:** Yalnizca su formatlara izin verilir:
- Hex: `^#[0-9a-fA-F]{3,8}$`
- Fonksiyonel: `^(?:rgba?|hsla?)\s*\([0-9.,\s%]+\)$` -- yalnizca rakamlara izin verir, `;` `url()` `expression()` reddedilir

```js
// Gecerli
'#1c3d54', 'rgba(28, 61, 84, 0.9)', 'hsl(200, 50%, 20%)'

// Reddedilir (CSS injection vektoru)
'rgba(0,0,0);background:url(//evil.com)', '#fff;--jw-bg:red'
```

**2. Font ailesi:** Asagidaki karakterler yasaklidir: `< > " ' ; { } ( ) \`

```js
// Gecerli
'Inter, system-ui, sans-serif'

// Reddedilir
'inherit;background:url(evil)', 'font;}'
```

### Yeni Veri Alani Eklerken Kontrol Listesi

1. Alan bir URL mi? -> `isSafeUrl()` ile dogrula
2. Alan `innerHTML`'e yazilacak mi? -> `esc()` uygula
3. Alan harici API'den mi geliyor? -> Her iki kontrol de zorunlu
4. Alan `querySelector` attribute selector'inda mi kullanilacak? -> `escSelector()` uygula
5. Alan CSS custom property'ye mi yazilacak? -> `_applyCSSVars` pattern'ini kullan, dogrudan `style.setProperty` yapma

---

## Form Sistemi

Yeni form tipi eklemek icin **yalnizca** `constants.js`'i duzenle:

```js
// constants.js -> FORM_CONFIG
telefon: {
  title:  'TELEFON',
  fields: ['telefon'],
  reply:  'Telefon numaranizi alabilir miyim?',
},
```

`render-form.js` ve `handlers.js` dinamik okur; baska dosya degismez.

---

## Kart Sistemi

### Kart Anatomisi

```
+-----------------------------+
|  [ROZET]                    |  <- badge (esc() ile)
|  Baslik                     |  <- textContent
|  Alt baslik                 |  <- textContent
|  Aciklama metni             |  <- textContent
|  [CTA Butonu ->]            |  <- isSafeUrl(card.url)
+-----------------------------+
```

- Tag (etiket) satiri **kaldirildi** -- ekleme.
- `card.image` -> `img.src` atamasindan once `isSafeUrl()` kontrolu.
- Gorsel yuklenemezse `img.onerror` -> arka plan rengi goster.

### Kart Tipi Secimi

| `card.image` var mi? | Kullanilan render |
|---------------------|-------------------|
| Evet | `_buildCardPhoto(card)` |
| Hayir | `_buildCardNoImage(card)` |

---

## CSS & Stil

### Shadow DOM

Tum stiller `/public/jules-src/shadow.css` icinde; class tanimlari burada.
Yeni stil gerektiginde buraya ekle, baska yere ekleme.
`css.js` dosyasini duzenleme -- o sadece bir bridge moduludur.

### CSS Custom Properties

Widget host element uzerinde tanimli:

```
--jules-primary      --jules-secondary    --jules-accent
--jules-accent-light --jules-accent-bg    --jules-font
--jw-orbit-angle     --jw-accent-color    --jw-text-primary
--jw-text-secondary  --jw-text-muted      --jw-border
```

Renk degerleri yalnizca `_applyCSSVars()` uzerinden set edilir; dogrudan `style.setProperty` cagrisindan kacin.
`_applyCSSVars` ici `setSafe()` fonksiyonu regex ile dogrulama yapar -- bkz. "CSS Injection Korumasi".

---

## Guvenlik Utility Referansi

| Fonksiyon | Dosya | Amac |
|-----------|-------|------|
| `esc(s)` | `utils.js` | HTML entity escape -- innerHTML'e yazilan tum harici/API degerleri icin |
| `escSelector(s)` | `utils.js` | CSS selector attribute value escape -- querySelector icin |
| `isSafeUrl(url)` | `utils.js` | URL protokol whitelist -- href/src/window.open icin |
| `setSafe()` | `widget.js` (`_applyCSSVars` icinde) | CSS custom property degeri dogrulama |

---

## Test Kontrol Listesi

Bir degisiklik tamamlandiginda:

- [ ] React preview'da gorsel dogrulama yapildi
- [ ] `npm run widget:build` hatasiz tamamlandi
- [ ] `demo.html`'de acilis, mesaj gonderme, kart goruntuleme test edildi
- [ ] Dark mode test edildi
- [ ] Mobil (< 768px) gorunumu test edildi
- [ ] Pinned Right modu test edildi
- [ ] Yeni URL alani varsa `isSafeUrl()` testi yapildi
- [ ] Yeni `innerHTML` varsa `esc()` kullanildigi dogrulandi
- [ ] Yeni timer varsa `this._timers` kaydedildigi kontrol edildi
- [ ] Yeni querySelector attribute selector'i varsa `escSelector()` kullanildigi dogrulandi
- [ ] Yeni CSS custom property atamasi varsa `_applyCSSVars`/`setSafe` pattern'i kullanildigi dogrulandi