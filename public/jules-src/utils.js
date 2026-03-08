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
export function genId() {
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

export function formatTime(date) {
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

// ── HTML escape ─────────────────────────────────────────────────────────────────
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Tarih ───────────────────────────────────────────────────────────────────────
const MONTHS = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
const DAYS   = ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];

export function getDateStr() {
  const n = new Date();
  return n.getDate() + ' ' + MONTHS[n.getMonth()] + ' ' + DAYS[n.getDay()] + '.';
}

// ── Hava Durumu ─────────────────────────────────────────────────────────────────
export function getSunLabel(wi) {
  if (!wi) return null;
  const now = new Date();
  const sr  = wi.sunrise.split(':').map(Number);
  const ss  = wi.sunset.split(':').map(Number);
  const nm  = now.getHours() * 60 + now.getMinutes();
  const srm = sr[0] * 60 + sr[1];
  const ssm = ss[0] * 60 + ss[1];
  if (nm < srm) return { label: wi.sunrise, isSunrise: true };
  if (nm < ssm) return { label: wi.sunset,  isSunrise: false };
  return { label: wi.sunrise, isSunrise: true };
}

export function weatherIconHtml(code, color, size) {
  const st = 'style="color:' + color + ';flex-shrink:0;display:inline-flex;"';
  let ico;
  if      (code === 0)                                ico = ICO.Sun(size);
  else if (code === 1)                                ico = ICO.SunDim(size);
  else if (code <= 3)                                 ico = ICO.CloudSun(size);
  else if (code <= 48)                                ico = ICO.CloudFog(size);
  else if (code <= 67)                                ico = ICO.CloudRain(size);
  else if ([71,73,75,85,86].indexOf(code) !== -1)     ico = ICO.Snowflake(size);
  else if (code === 77)                               ico = ICO.CloudSnow(size);
  else if (code <= 82)                                ico = ICO.CloudRain(size);
  else                                                ico = ICO.CloudLightning(size);
  return '<span ' + st + '>' + ico + '</span>';
}

// ── @property kaydı (Shadow DOM dışında, global scope) ─────────────────────────
export function registerOrbitProperty() {
  if (document.getElementById('jw-orbit-prop')) return;
  const st = document.createElement('style');
  st.id = 'jw-orbit-prop';
  st.textContent = '@property --jw-orbit-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }';
  document.head.appendChild(st);
}
