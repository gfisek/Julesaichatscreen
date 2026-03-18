/**
 * utils.js — Yardımcı fonksiyonlar
 */
import { ICO } from './icons.js';

// ── Debounce ────────────────────────────────────────────────────────────────────
export function debounce(fn, ms) {
  let t;
  return function () { clearTimeout(t); t = setTimeout(fn.bind(this), ms); };
}

// ── Heart SVG ───────────────────────────────────────────────────────────────────
function heartSVG(size, color, fill, filter) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
    '" viewBox="0 0 24 24" style="stroke:' + color + ';fill:' + fill +
    ';filter:' + (filter || 'none') + ';stroke-width:2;stroke-linecap:round;stroke-linejoin:round;' +
    'transition:stroke 0.15s,fill 0.15s;display:inline-block;">' +
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
}

export function heartHtml(size, isLiked, isHovered, onImg) {
  let color, fill, filter;
  if (isLiked) {
    color  = '#f87171';
    fill   = '#f87171';
    filter = 'none';
  } else if (isHovered) {
    color  = '#fca5a5';
    fill   = 'rgba(252,165,165,0.25)';
    filter = onImg ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))' : 'none';
  } else {
    color  = onImg ? 'white' : 'var(--jw-heart-default)';
    fill   = 'none';
    filter = onImg ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))' : 'none';
  }
  return heartSVG(size, color, fill, filter);
}

// ── ID & Zaman ──────────────────────────────────────────────────────────────────
// crypto.randomUUID() ile güçlendirilmiş ID üretimi; fallback Date.now() ile
export function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return 'msg-' + crypto.randomUUID();
  }
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

export function formatTime(date) {
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

// ── HTML escape ─────────────────────────────────────────────────────────────────
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── CSS Selector attribute value escape ─────────────────────────────────────────
/**
 * escSelector — querySelector('[attr="value"]') pattern'inde value kısmını güvenli hale getirir.
 * " ve \ karakterlerini backslash ile escape eder. Harici veri (card.id vb.) selector'a
 * yazılmadan önce bu fonksiyonla sarılmalıdır.
 */
export function escSelector(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// ── Tarih ───────────────────────────────────────────────────────────────────────
export function getDateStr() {
  return new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ── Body scroll lock (referans sayaçlı) ─────────────────────────────────────────
let _lockCount = 0;
let _savedOverflow = '';

export function lockBodyScroll() {
  _lockCount++;
  if (_lockCount === 1) {
    _savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
}

export function unlockBodyScroll() {
  if (_lockCount > 0) _lockCount--;
  if (_lockCount === 0) {
    document.body.style.overflow = _savedOverflow;
  }
}

export function forceUnlockBodyScroll() {
  _lockCount = 0;
  document.body.style.overflow = _savedOverflow;
}

// ── Orbit property ───────────────────────────────────────────────────────────────
export function registerOrbitProperty() {
  if (typeof CSS !== 'undefined' && CSS.registerProperty) {
    try {
      CSS.registerProperty({ name: '--jw-orbit-angle', syntax: '<angle>', inherits: false, initialValue: '0deg' });
    } catch (_) { /* zaten kayıtlı */ }
  }
}

// ── Hava durumu ─────────────────────────────────────────────────────────────────
export function weatherIconHtml(code, color, size) {
  const ico = ICO.weatherIcon(code, size);
  return '<span style="color:' + color + ';display:inline-flex;">' + ico + '</span>';
}

export function getSunLabel(wi) {
  if (!wi || !wi.sunrise || !wi.sunset) return null;
  const now       = new Date();
  const nowMins   = now.getHours() * 60 + now.getMinutes();
  const parse     = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const riseMins  = parse(wi.sunrise);
  const setMins   = parse(wi.sunset);

  if (nowMins < riseMins) return { label: 'Gün doğumu ' + wi.sunrise };
  if (nowMins < setMins)  return { label: 'Gün batımı ' + wi.sunset  };
  return null;
}

// ── URL Güvenlik Doğrulayıcı ────────────────────────────────────────────────────
/**
 * isSafeUrl — Yalnızca http/https/göreli URL'lere izin verir.
 * javascript:, data:, vburl protokollerini reddeder.
 * card.url, card.image ve branding.poweredByUrl için kullanılır.
 */
export function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const t = url.trim().toLowerCase();
  return (
    t.startsWith('https://') ||
    t.startsWith('http://')  ||
    t.startsWith('/')        ||
    t.startsWith('./')       ||
    t.startsWith('../')      ||
    t.startsWith('#')
  );
}