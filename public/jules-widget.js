/**
 * JULES Widget — Web Component, Zero Dependencies
 * Powered by Creator AI · https://creator.com.tr
 *
 * Kullanım (Host sitede):
 *   <script src="/jules-widget.js"></script>
 *   <jules-widget
 *     config-url="/jules-widget/config.json"
 *     cards-url="/jules-widget/cards.json"
 *   ></jules-widget>
 *
 * Programatik:
 *   const w = document.querySelector('jules-widget');
 *   w.open();   // aç
 *   w.close();  // kapat
 *   w.toggle(); // aç/kapat
 *
 * @version 2.0.0
 */
(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // SVG İKON KÜTÜPHANESİ
  // ═══════════════════════════════════════════════════════════════════════════

  function _lsvg(paths, size) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;">' + paths + '</svg>';
  }
  function _psvg(path, size) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 256 256" style="display:inline-block;vertical-align:middle;"><path d="' + path + '" fill="currentColor"/></svg>';
  }

  var ICO = {
    Bot: function (s) {
      return _lsvg('<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>', s);
    },
    Sparkles: function (s) {
      return _lsvg('<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>', s);
    },
    Copy: function (s) {
      return _lsvg('<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>', s);
    },
    Check: function (s) {
      return _lsvg('<polyline points="20 6 9 17 4 12"/>', s);
    },
    ThumbsUp: function (s, filled) {
      return _lsvg('<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"' + (filled ? ' fill="currentColor"' : '') + '/>', s);
    },
    ThumbsDown: function (s, filled) {
      return _lsvg('<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"' + (filled ? ' fill="currentColor"' : '') + '/>', s);
    },
    ChevronRight: function (s) { return _lsvg('<path d="m9 18 6-6-6-6"/>', s); },
    ChevronLeft:  function (s) { return _lsvg('<path d="m15 18-6-6 6-6"/>', s); },
    Heart: function (s, filled) {
      return _lsvg('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"' + (filled ? ' fill="currentColor"' : '') + '/>', s);
    },
    X: function (s) { return _lsvg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', s); },
    Mic: function (s) {
      return _lsvg('<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>', s);
    },
    ArrowUpRight: function (s) { return _lsvg('<path d="M7 7h10v10"/><path d="M7 17 17 7"/>', s); },
    Clock: function (s) { return _lsvg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', s); },
    // Phosphor icons
    ArrowUp: function (s) {
      return _psvg('M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z', s);
    },
    CloudSun: function (s) {
      return _psvg('M164,72a76.2,76.2,0,0,0-20.26,2.73,55.63,55.63,0,0,0-9.41-11.54l9.51-13.57a8,8,0,1,0-13.11-9.18L121.22,54A55.9,55.9,0,0,0,96,48c-.58,0-1.16,0-1.74,0L91.37,31.71a8,8,0,1,0-15.75,2.77L78.5,50.82A56.1,56.1,0,0,0,55.23,65.67L41.61,56.14a8,8,0,1,0-9.17,13.11L46,78.77A55.55,55.55,0,0,0,40,104c0,.57,0,1.15,0,1.72L23.71,108.6a8,8,0,0,0,1.38,15.88,8.24,8.24,0,0,0,1.39-.12l16.32-2.88a55.74,55.74,0,0,0,5.86,12.42A52,52,0,0,0,84,224h80a76,76,0,0,0,0-152ZM92.92,120.76a52.14,52.14,0,0,0-31,4.17,40,40,0,0,1,66.62-44.17A76.26,76.26,0,0,0,92.92,120.76Z', s);
    },
    CloudFog: function (s) {
      return _psvg('M120,208H72a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm64-16H160a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Zm-24,32H104a8,8,0,0,0,0,16h56a8,8,0,0,0,0-16Zm72-124a76.08,76.08,0,0,1-76,76H76A52,52,0,0,1,76,72a53.26,53.26,0,0,1,8.92.76A76.08,76.08,0,0,1,232,100Zm-16,0A60.06,60.06,0,0,0,96,96.46a8,8,0,0,1-16-.92q.21-3.66.77-7.23A38.11,38.11,0,0,0,76,88a36,36,0,0,0,0,72h80A60.07,60.07,0,0,0,216,100Z', s);
    },
    Sun: function (s, weight) {
      if (weight === 'fill') {
        return _psvg('M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm8,24a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z', s);
      }
      return _psvg('M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z', s);
    },
    SunDim: function (s) {
      return _psvg('M120,40V32a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-8-8A8,8,0,0,0,50.34,61.66Zm0,116.68-8,8a8,8,0,0,0,11.32,11.32l8-8a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l8-8a8,8,0,0,0-11.32-11.32l-8,8A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l8,8a8,8,0,0,0,11.32-11.32ZM40,120H32a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Zm88,88a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,128,208Zm96-88h-8a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z', s);
    },
    CloudRain: function (s) {
      return _psvg('M158.66,196.44l-32,48a8,8,0,1,1-13.32-8.88l32-48a8,8,0,0,1,13.32,8.88ZM232,92a76.08,76.08,0,0,1-76,76H132.28l-29.62,44.44a8,8,0,1,1-13.32-8.88L113.05,168H76A52,52,0,0,1,76,64a53.26,53.26,0,0,1,8.92.76A76.08,76.08,0,0,1,232,92Zm-16,0A60.06,60.06,0,0,0,96,88.46a8,8,0,0,1-16-.92q.21-3.66.77-7.23A38.11,38.11,0,0,0,76,80a36,36,0,0,0,0,72h80A60.07,60.07,0,0,0,216,92Z', s);
    },
    CloudSnow: function (s) {
      return _psvg('M88,196a12,12,0,1,1-12-12A12,12,0,0,1,88,196Zm28,4a12,12,0,1,0,12,12A12,12,0,0,0,116,200Zm48-16a12,12,0,1,0,12,12A12,12,0,0,0,164,184ZM68,224a12,12,0,1,0,12,12A12,12,0,0,0,68,224Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,156,224ZM232,92a76.08,76.08,0,0,1-76,76H76A52,52,0,0,1,76,64a53.26,53.26,0,0,1,8.92.76A76.08,76.08,0,0,1,232,92Zm-16,0A60.06,60.06,0,0,0,96,88.46a8,8,0,0,1-16-.92q.21-3.66.77-7.23A38.11,38.11,0,0,0,76,80a36,36,0,0,0,0,72h80A60.07,60.07,0,0,0,216,92Z', s);
    },
    CloudLightning: function (s) {
      return _psvg('M156,16A76.2,76.2,0,0,0,84.92,64.76,53.26,53.26,0,0,0,76,64a52,52,0,0,0,0,104h37.87L97.14,195.88A8,8,0,0,0,104,208h25.87l-16.73,27.88a8,8,0,0,0,13.72,8.24l24-40A8,8,0,0,0,144,192H118.13l14.4-24H156a76,76,0,0,0,0-152Zm0,136H76a36,36,0,0,1,0-72,38.11,38.11,0,0,1,4.78.31q-.56,3.57-.77,7.23a8,8,0,0,0,16,.92A60.06,60.06,0,1,1,156,152Z', s);
    },
    Snowflake: function (s) {
      return _psvg('M223.77,150.09a8,8,0,0,1-5.86,9.68l-24.64,6,6.46,24.11a8,8,0,0,1-5.66,9.8A8.25,8.25,0,0,1,192,200a8,8,0,0,1-7.72-5.93l-7.72-28.8L136,141.86v46.83l21.66,21.65a8,8,0,0,1-11.32,11.32L128,203.31l-18.34,18.35a8,8,0,0,1-11.32-11.32L120,188.69V141.86L79.45,165.27l-7.72,28.8A8,8,0,0,1,64,200a8.25,8.25,0,0,1-2.08-.27,8,8,0,0,1-5.66-9.8l6.46-24.11-24.64-6a8,8,0,0,1,3.82-15.54l29.45,7.23L112,128,71.36,104.54l-29.45,7.23A7.85,7.85,0,0,1,40,112a8,8,0,0,1-1.91-15.77l24.64-6L56.27,66.07a8,8,0,0,1,15.46-4.14l7.72,28.8L120,114.14V67.31L98.34,45.66a8,8,0,0,1,11.32-11.32L128,52.69l18.34-18.35a8,8,0,0,1,11.32,11.32L136,67.31v46.83l40.55-23.41,7.72-28.8a8,8,0,0,1,15.46,4.14l-6.46,24.11,24.64,6A8,8,0,0,1,216,112a7.85,7.85,0,0,1-1.91-.23l-29.45-7.23L144,128l40.64,23.46,29.45-7.23A8,8,0,0,1,223.77,150.09Z', s);
    },
    SunHorizon: function (s) {
      return _psvg('M240,152H199.55a73.54,73.54,0,0,0,.45-8,72,72,0,0,0-144,0,73.54,73.54,0,0,0,.45,8H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM72,144a56,56,0,1,1,111.41,8H72.59A56.13,56.13,0,0,1,72,144Zm144,56a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,200ZM72.84,43.58a8,8,0,0,1,14.32-7.16l8,16a8,8,0,0,1-14.32,7.16Zm-56,48.84a8,8,0,0,1,10.74-3.57l16,8a8,8,0,0,1-7.16,14.31l-16-8A8,8,0,0,1,16.84,92.42Zm192,15.16a8,8,0,0,1,3.58-10.73l16-8a8,8,0,1,1,7.16,14.31l-16,8a8,8,0,0,1-10.74-3.58Zm-48-55.16,8-16a8,8,0,0,1,14.32,7.16l-8,16a8,8,0,1,1-14.32-7.16Z', s);
    },
    Moon: function (s, weight) {
      if (weight === 'fill') {
        return _psvg('M235.54,150.21a104.84,104.84,0,0,1-37,52.91A104,104,0,0,1,32,120,103.09,103.09,0,0,1,52.88,57.48a104.84,104.84,0,0,1,52.91-37,8,8,0,0,1,10,10,88.08,88.08,0,0,0,109.8,109.8,8,8,0,0,1,10,10Z', s);
      }
      return _psvg('M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23Z', s);
    },
    PhosphorX: function (s) {
      return _psvg('M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z', s);
    },
    Monitor: function (s) {
      return _psvg('M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8ZM152,224a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,224Z', s);
    },
    SidebarSimple: function (s) {
      return _psvg('M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H88V200H40ZM216,200H104V56H216Z', s);
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SHADOW DOM CSS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 1. CSS Variables — config.json'dan override edilir ───────────────────────
  var CSS_VARS = `
    :host {
      display: block;
      font-family: var(--jules-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
      -webkit-font-smoothing: antialiased;
      --jules-primary:       #1c3d54;
      --jules-secondary:     #0a6e82;
      --jules-accent:        #1ba3b8;
      --jules-accent-light:  #4dc4ce;
      --jules-accent-bg:     #e6f7f9;
      --jules-font:          inherit;
      /* ── Light theme tokens ─────────────────────────────── */
      --jw-bg:               rgba(255,255,255,0.97);
      --jw-outer-bg:         #f0f4f6;
      --jw-border:           #e5e7eb;
      --jw-text-primary:     #111827;
      --jw-text-secondary:   #6b7280;
      --jw-text-muted:       #9ca3af;
      --jw-user-bubble:      #F2F2F3;
      --jw-user-bubble-txt:  #374151;
      --jw-input-bg:         #f9fafb;
      --jw-placeholder:      #9ca3af;
      --jw-accent-color:     var(--jules-secondary);
      --jw-accent-dim-bg:    var(--jules-accent-bg);
      --jw-accent-dim-bdr:   #62b8c8;
      --jw-card-bg:          #ffffff;
      --jw-card-border:      #e5e7eb;
      --jw-sticky-bg:        #F2F2F3;
      --jw-header-bg:        rgba(255,255,255,0.55);
      --jw-sugg-border:      rgba(10,110,130,0.13);
      --jw-heart-default:    #d1d5db;
      --jw-arrow-bg:         rgba(255,255,255,0.95);
      --jw-arrow-border:     rgba(0,0,0,0.1);
      --jw-msg-shadow-alpha: 0.10;
    }
    :host([data-dark]) {
      --jw-bg:               rgba(10,23,32,0.97);
      --jw-outer-bg:         #07111a;
      --jw-border:           #1d3547;
      --jw-text-primary:     #cfe8f4;
      --jw-text-secondary:   #6fa8bf;
      --jw-text-muted:       #3d7089;
      --jw-user-bubble:      #1a3247;
      --jw-user-bubble-txt:  #cfe8f4;
      --jw-input-bg:         #132230;
      --jw-placeholder:      #3d7089;
      --jw-accent-color:     var(--jules-accent-light);
      --jw-accent-dim-bg:    rgba(77,196,206,0.10);
      --jw-accent-dim-bdr:   rgba(77,196,206,0.25);
      --jw-card-bg:          #142230;
      --jw-card-border:      #1d3547;
      --jw-sticky-bg:        #1a3247;
      --jw-header-bg:        rgba(14,31,44,0.55);
      --jw-sugg-border:      rgba(77,196,206,0.18);
      --jw-heart-default:    #2a4a5e;
      --jw-arrow-bg:         rgba(30,58,85,0.9);
      --jw-arrow-border:     rgba(77,196,206,0.3);
      --jw-msg-shadow-alpha: 0.35;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
  `;

  // ── 2. Animations & Keyframes ────────────────────────────────────────────────
  var CSS_ANIMATIONS = `
    /* Orbit animation için @property global scope'ta register edilmeli */
    @keyframes jw-orbit {
      from { --jw-orbit-angle: 0deg; }
      to   { --jw-orbit-angle: 360deg; }
    }
    @keyframes jw-bounce {
      0%,100% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
      50%      { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
    }
    @keyframes jw-fadein {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes jw-slide-in {
      from { opacity:0; transform:translateX(24px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes jw-draw-in {
      from { opacity:0; transform:translateY(32px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes jw-mic-ring {
      0%   { box-shadow: 0 0 0 0   rgba(239,68,68,0.55); }
      70%  { box-shadow: 0 0 0 7px rgba(239,68,68,0);    }
      100% { box-shadow: 0 0 0 0   rgba(239,68,68,0);    }
    }
    @keyframes jw-toast-in {
      from { opacity:0; transform:translateX(-50%) translateY(6px); }
      to   { opacity:1; transform:translateX(-50%) translateY(0); }
    }
    @keyframes jw-orbit-glow {
      0%   { filter: brightness(1) saturate(1) blur(0px);   transform: scale(1); }
      50%  { filter: brightness(1.4) saturate(1.5) blur(2px); transform: scale(1.02); }
      100% { filter: brightness(1) saturate(1) blur(0px);   transform: scale(1); }
    }
    .jw-orbit-glow {
      animation: jw-orbit 2.5s linear infinite, jw-orbit-glow 0.8s ease-in-out !important;
    }

    .jw-orbit-light {
      background: conic-gradient(
        from var(--jw-orbit-angle) at 50% 50%,
        #ff4d6d   0deg,
        #ff9a3c  52deg,
        #f7d700 103deg,
        #2ecc71 154deg,
        #4dc4ce 180deg,
        #4488ff 230deg,
        #7b5ea7 282deg,
        #e040fb 334deg,
        #ff4d6d 360deg
      );
      animation: jw-orbit 6.4s linear infinite;
    }
    .jw-orbit-dark {
      background: conic-gradient(
        from var(--jw-orbit-angle) at 50% 50%,
        rgba(255, 77,109,0.70)   0deg,
        rgba(255,154, 60,0.70)  52deg,
        rgba(247,215,  0,0.70) 103deg,
        rgba( 46,204,113,0.70) 154deg,
        rgba( 77,196,206,0.90) 180deg,
        rgba( 68,136,255,0.70) 230deg,
        rgba(123, 94,167,0.70) 282deg,
        rgba(224, 64,251,0.70) 334deg,
        rgba(255, 77,109,0.70) 360deg
      );
      animation: jw-orbit 6.4s linear infinite;
    }

    .jw-mic-listening {
      animation: jw-mic-ring 1.1s ease-out infinite;
      color: #ef4444 !important;
      background: rgba(239,68,68,0.10) !important;
    }

    .jw-bounce-1 { animation: jw-bounce 1s infinite 0ms; }
    .jw-bounce-2 { animation: jw-bounce 1s infinite 150ms; }
    .jw-bounce-3 { animation: jw-bounce 1s infinite 300ms; }

    .jw-msg-in    { animation: jw-fadein 0.22s ease forwards; }
    .jw-slide-in  { animation: jw-slide-in 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
    .jw-draw-in   { animation: jw-draw-in 0.35s cubic-bezier(0.32,0.72,0,1) forwards; }
  `;

  // ── 3. Utilities ─────────────────────────────────────────────────────────────
  var CSS_UTILS = `
    .jw-scroll::-webkit-scrollbar { display: none; }
    .jw-scroll { -ms-overflow-style: none; scrollbar-width: none; overflow-y: auto; overscroll-behavior-y: contain; }
    .jw-scroll-x::-webkit-scrollbar { display: none; }
    .jw-scroll-x { -ms-overflow-style: none; scrollbar-width: none; overflow-x: auto; overscroll-behavior-x: contain; }

    .jw-card-img { transition: transform 0.7s ease; }
    .jw-card-wrap:hover .jw-card-img { transform: scale(1.04); }

    .jw-btn { background: transparent; border: none; cursor: pointer; padding: 0; display: inline-flex; align-items: center; justify-content: center; }
    .jw-btn:focus-visible { outline: 2px solid var(--jules-accent); outline-offset: 2px; border-radius: 4px; }
  `;

  // ── 4. Layout — overlay, ana kutu, chat & content panelleri ─────────────────
  var CSS_LAYOUT = `
    /* Overlay */
    #jw-overlay {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      pointer-events: none;
      transition: background 0.3s;
    }
    #jw-overlay.jw-active { pointer-events: auto; }
    #jw-overlay.jw-open   { background: rgba(0,0,0,0.38); backdrop-filter: blur(2px); }
    #jw-overlay.jw-pinned { background: transparent; backdrop-filter: none; }

    /* Main widget box */
    #jw-box {
      display: flex;
      overflow: hidden;
      transition: background 0.3s, box-shadow 0.3s;
      pointer-events: auto;
    }
    #jw-box.jw-normal {
      width: 100vw; max-width: 100%;
      height: 100dvh;
      border-radius: 0;
      box-shadow: 0 12px 60px rgba(0,0,0,0.28), 0 2px 12px rgba(0,0,0,0.12);
      justify-content: center;
    }
    #jw-box.jw-mobile {
      width: 100vw; height: 100dvh;
      border-radius: 0;
      flex-direction: column;
    }
    #jw-box.jw-pinned {
      position: fixed; right: 0; top: 0;
      width: 390px; height: 100dvh;
      border-radius: 7px 0 0 7px;
      box-shadow: -8px 0 48px rgba(0,0,0,0.28), -2px 0 8px rgba(0,0,0,0.10);
      flex-direction: column;
      animation: jw-slide-in 0.35s cubic-bezier(0.4,0,0.2,1);
    }

    /* Chat pane */
    #jw-chat {
      display: flex; flex-direction: column;
      overflow: hidden;
      flex-shrink: 0;
      transition: width 0.3s ease, height 0.3s ease;
    }
    #jw-box.jw-normal  #jw-chat { width: 100%; }
    #jw-box.jw-normal.jw-panel-open #jw-chat { width: 50%; }
    #jw-box.jw-mobile  #jw-chat { width: 100%; height: 50%; }
    #jw-box.jw-mobile.jw-no-panel #jw-chat { height: 100%; }
    #jw-box.jw-pinned  #jw-chat { width: 100%; height: 100%; }

    /* Content pane */
    #jw-content {
      flex: 1; min-width: 0;
      display: flex; flex-direction: column;
      overflow: hidden;
      border-left: 1px solid var(--jw-border);
      order: 2;
      transition: border-color 0.3s;
    }
    #jw-box.jw-mobile #jw-content {
      border-left: none;
      border-bottom: 1px solid var(--jw-border);
      height: 50%; flex: none;
      width: 100%;
      order: 1;
    }
  `;

  // ── 5. Components — header, mesajlar, suggestions, input, textarea, chip ─────
  var CSS_COMPONENTS = `
    /* Header */
    #jw-header {
      display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
      border-bottom: 1px solid var(--jw-border);
      transition: border-color 0.3s, background 0.3s;
    }

    /* Messages */
    #jw-messages {
      flex: 1; min-height: 0;
      padding: 16px;
      display: flex; flex-direction: column;
      gap: 16px;
    }

    /* Suggestions */
    #jw-suggestions {
      display: flex; gap: 8px;
      overflow-x: auto; flex-shrink: 0;
      padding: 0 16px;
      border-top: 1px solid var(--jw-sugg-border);
      transition: border-color 0.3s;
      /* scrollbar gizleme: .jw-scroll-x utility class'ından miras alınıyor */
    }

    /* Input area */
    #jw-input-area {
      padding: 0 16px 16px;
      flex-shrink: 0;
      display: flex; flex-direction: column; align-items: center;
    }

    .jw-sugg-chip {
      flex-shrink: 0; white-space: nowrap;
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }

    .jw-sugg-arrow {
      width: 24px; height: 24px; border-radius: 50%;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      color: inherit; opacity: 0;
      transition: opacity 0.2s, transform 0.2s, background 0.2s;
    }
    #jw-sugg-wrap:hover .jw-sugg-arrow { opacity: 1; }
    .jw-sugg-arrow:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); color: var(--jules-accent); border-color: var(--jules-accent); }
    .jw-sugg-arrow-l { transform: translateX(-2px); }
    .jw-sugg-arrow-r { transform: translateX(2px); }

    textarea.jw-ta {
      background: transparent; border: none; outline: none;
      resize: none; width: 100%; flex: 1;
      font-family: inherit;
      line-height: 1.5;
    }
    textarea.jw-ta::placeholder { color: var(--jw-placeholder); }

    /* Content panel header */
    #jw-cp-header {
      flex-shrink: 0;
      border-bottom: 1px solid var(--jw-border);
      transition: border-color 0.3s, background 0.3s;
    }
  `;

  // ── 6. Overlays — tooltip, favoriler çekmecesi ───────────────────────────────
  var CSS_OVERLAYS = `
    /* Tooltip */
    .jw-tooltip {
      position: absolute; top: calc(100% + 8px); left: 50%;
      transform: translateX(-50%) translateY(-4px);
      pointer-events: none; z-index: 99;
      opacity: 0;
      transition: opacity 0.18s ease, transform 0.18s ease;
      white-space: nowrap;
    }
    .jw-tooltip.jw-tooltip-show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .jw-tooltip-arrow {
      position: absolute; top: -4px; left: 50%;
      transform: translateX(-50%) rotate(45deg);
      width: 7px; height: 7px;
    }
    .jw-tooltip-body {
      font-size: 10px; font-weight: 500;
      padding: 5px 9px; border-radius: 7px;
      letter-spacing: 0.01em;
    }

    /* Fav drawer */
    #jw-fav-backdrop {
      position: fixed; inset: 0; z-index: 200;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(2px);
      display: flex; flex-direction: column; justify-content: flex-end;
    }
    #jw-fav-drawer {
      border-radius: 20px 20px 0 0;
      height: 75vh;
      display: flex; flex-direction: column; overflow: hidden;
      box-shadow: 0 -8px 40px rgba(0,0,0,0.25);
      transition: transform 0.3s cubic-bezier(0.32,0.72,0,1);
    }
    .jw-dot {
      width: 6px; height: 6px; border-radius: 3px;
      border: none; padding: 0; cursor: pointer;
      transition: all 0.25s ease;
    }
    .jw-dot.active { width: 16px; }
  `;

  // ── Birleştir ─────────────────────────────────────────────��──────────────────
  var SHADOW_CSS = CSS_VARS + CSS_ANIMATIONS + CSS_UTILS + CSS_LAYOUT + CSS_COMPONENTS + CSS_OVERLAYS;

  // ═══════════════════════════════��═══════════════════════════════════════════
  // YARDIMCI FONKSİYONLAR
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Debounce ────────────────────────────────────────────────────────────────
  function debounce(fn, ms) {
    var t;
    return function() { clearTimeout(t); t = setTimeout(fn.bind(this), ms); };
  }

  // ─── Heart SVG helpers ───────────────────────────────────────────────────────
  // SVG inline-style üzerinden stroke/fill — CSS custom prop'lar burada da çalışır.
  function heartSVG(size, color, fill, filter) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" style="stroke:' + color + ';fill:' + fill +
      ';filter:' + (filter || 'none') + ';stroke-width:2;stroke-linecap:round;stroke-linejoin:round;' +
      'transition:stroke 0.15s,fill 0.15s;display:inline-block;">' +
      '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
  }

  function heartHtml(size, isLiked, isHovered, onImg) {
    var color, fill, filter;
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

  function genId() { return 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9); }

  function formatTime(date) {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var MONTHS = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  var DAYS   = ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];

  function getDateStr() {
    var n = new Date();
    return n.getDate() + ' ' + MONTHS[n.getMonth()] + ' ' + DAYS[n.getDay()] + '.';
  }

  function getSunLabel(wi) {
    if (!wi) return null;
    var now = new Date();
    var sr  = wi.sunrise.split(':').map(Number);
    var ss  = wi.sunset.split(':').map(Number);
    var nm  = now.getHours() * 60 + now.getMinutes();
    var srm = sr[0] * 60 + sr[1];
    var ssm = ss[0] * 60 + ss[1];
    if (nm < srm) return { label: wi.sunrise, isSunrise: true };
    if (nm < ssm) return { label: wi.sunset,  isSunrise: false };
    return { label: wi.sunrise, isSunrise: true };
  }

  function weatherIconHtml(code, color, size) {
    var st = 'style="color:' + color + ';flex-shrink:0;display:inline-flex;"';
    var ico;
    if      (code === 0)                                  ico = ICO.Sun(size);
    else if (code === 1)                                  ico = ICO.SunDim(size);
    else if (code <= 3)                                   ico = ICO.CloudSun(size);
    else if (code <= 48)                                  ico = ICO.CloudFog(size);
    else if (code <= 67)                                  ico = ICO.CloudRain(size);
    else if ([71,73,75,85,86].indexOf(code) !== -1)       ico = ICO.Snowflake(size);
    else if (code === 77)                                 ico = ICO.CloudSnow(size);
    else if (code <= 82)                                  ico = ICO.CloudRain(size);
    else                                                  ico = ICO.CloudLightning(size);
    return '<span ' + st + '>' + ico + '</span>';
  }

  // Conic gradient için @property global scope'a kaydet (Shadow DOM dışında)
  function registerOrbitProperty() {
    if (document.getElementById('jw-orbit-prop')) return;
    var st = document.createElement('style');
    st.id = 'jw-orbit-prop';
    st.textContent = '@property --jw-orbit-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }';
    document.head.appendChild(st);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WEB COMPONENT — JulesWidget
  // ═══════════════════════════════════════════════════════════════════════════

  var EMOJIS = ['👋🏼', '🖖🏼', 'BOT_ICON', '👇🏼', '👍🏼', '🙏🏼', '🤝🏼', '👏🏼'];

  /* Typewriter placeholder — chip'lerden farklı sorular */
  var TW_PHRASES = [
    'Bir şeyler sorun...',
    'Seyahat planı yap...',
    'Fiyat karşılaştır...',
    'Hafta sonu nereye gideyim?',
    'Trend ürünleri göster...',
    'Yakınımdaki kafeler...',
  ];

  var DEFAULT_CONFIG = {
    branding: { name: 'JULES', poweredBy: 'Powered by Creator AI', poweredByUrl: 'https://creator.com.tr' },
    colors: { primary: '#1c3d54', secondary: '#0a6e82', accent: '#1ba3b8', accentLight: '#4dc4ce', accentBg: '#e6f7f9' },
    font: { family: 'inherit' },
    suggestions: ['İstanbul\'da otel öner', 'Bütçeme uygun seçenekler', 'En iyi restoranlar', 'Çok satan ürünler'],
    defaultReplies: [
      'Anlıyorum! Size daha iyi yardımcı olabilmem için biraz daha bilgi verir misiniz?',
      'Harika bir soru! Bu konuda size yardımcı olmak için birkaç seçenek hazırlıyorum...',
      'Tabii ki! En güncel bilgileri getiriyorum, bir an lütfen.',
      'Mükemmel! Sizin için en uygun seçenekleri analiz ediyorum.',
    ],
  };

  var DEFAULT_CARDS = { datasets: {}, scenarios: [] };

  class JulesWidget extends HTMLElement {
    // Gözlenen attribute'lar
    static get observedAttributes() {
      return ['config-url', 'cards-url', 'open', 'dark'];
    }

    constructor() {
      super();
      this._shadow = this.attachShadow({ mode: 'open' });
      this._timers = {};
      // Debounce: yaln��zca isMobile sınırı (768px) geçilince rebuild tetiklensin
      this._resizeBound = debounce(this._onResize.bind(this), 120);

      // State
      this._st = {
        isOpen: false,
        messages: [],
        isTyping: false,
        activeCardMsgId: null,
        panelSessions: [],
        cardData: {},
        isPanelOpen: false,
        isMobile: window.innerWidth < 768,
        likedCards: new Set(),
        isDark: false,
        isPinnedRight: false,
        emojiIndex: 0,
        emojiPhase: 'visible',   // 'visible' | 'out' | 'in'
        weatherInfo: null,
        inputValue: '',
        votes: {},
        showFavDrawer: false,
        showFavoritesInPanel: false,
        activeCardIndices: {},
        defaultReplyIndex: 0,
        copied: null,
        drawerDragY: 0,
        isListening: false,
      };

      // Data
      this._config = Object.assign({}, DEFAULT_CONFIG);
      this._cards  = Object.assign({}, DEFAULT_CARDS);

      // Body overflow — host sitenin orijinal değerini saklama
      this._bodyOverflow = '';

      // STT
      this._recognition  = null;
      this._preVoiceText = '';

      // References (Shadow DOM elements)
      this._refs = {};
    }

    // ─── Lifecycle ────────────────────────────────────────────��──────────────

    connectedCallback() {
      registerOrbitProperty();
      this._injectCSS();
      this._loadData().then(() => {
        this._build();
        window.addEventListener('resize', this._resizeBound);
        this._startEmojiCycle();
        this._fetchWeather();
        if (this.hasAttribute('open')) this.open();
        if (this.hasAttribute('dark')) { this._st.isDark = true; this._applyTheme(); }
      });
    }

    disconnectedCallback() {
      window.removeEventListener('resize', this._resizeBound);
      Object.keys(this._timers).forEach(k => clearTimeout(this._timers[k]));
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (!this._refs.overlay) return;
      if (name === 'open')  { newVal !== null ? this.open() : this.close(); }
      if (name === 'dark')  { this._st.isDark = newVal !== null; this._applyTheme(); }
    }

    // ─── Public API ───────────────────────────────────────────────────────────

    open()   { this._st.isOpen = true;  this._applyOpenState(); }
    close()  { this._st.isOpen = false; this._applyOpenState(); this.dispatchEvent(new CustomEvent('jules:close')); }
    toggle() { this._st.isOpen ? this.close() : this.open(); }

    // ─── Data Loading ─────────────────────────────────────────────────────────

    async _loadData() {
      var configUrl = this.getAttribute('config-url') || './jules-widget/config.json';
      var cardsUrl  = this.getAttribute('cards-url')  || './jules-widget/cards.json';
      try {
        var [cfgRes, cardsRes] = await Promise.all([fetch(configUrl), fetch(cardsUrl)]);
        if (cfgRes.ok)   this._config = await cfgRes.json();
        if (cardsRes.ok) this._cards  = await cardsRes.json();
      } catch (e) {
        console.warn('[JulesWidget] Config/cards yüklenemedi, varsayılanlar kullanılıyor:', e.message);
      }
      // Apply CSS variables from config
      this._applyCSSVars();
    }

    _applyCSSVars() {
      var c = this._config.colors || {};
      var f = this._config.font   || {};
      var host = this._shadow.host;
      if (c.primary)      host.style.setProperty('--jules-primary',      c.primary);
      if (c.secondary)    host.style.setProperty('--jules-secondary',    c.secondary);
      if (c.accent)       host.style.setProperty('--jules-accent',       c.accent);
      if (c.accentLight)  host.style.setProperty('--jules-accent-light', c.accentLight);
      if (c.accentBg)     host.style.setProperty('--jules-accent-bg',    c.accentBg);
      if (f.family)       host.style.setProperty('--jules-font',         f.family);
    }

    // ─── CSS Injection ────────────────────────────────────────────────────────

    _injectCSS() {
      var sheet = new CSSStyleSheet();
      sheet.replaceSync(SHADOW_CSS);
      this._shadow.adoptedStyleSheets = [sheet];
    }

    // ─── Theme ────────────────────────────────────────────────────────────────

    // _T() artık CSS custom property referansları döndürür.
    // :host / :host([data-dark]) kuralları gerçek değerleri sağlar —
    // böylece _applyTheme() yalnızca data-dark toggle ile renkleri değiştirebilir.
    _T() {
      return {
        bg:            'var(--jw-bg)',
        outerBg:       'var(--jw-outer-bg)',
        border:        'var(--jw-border)',
        textPrimary:   'var(--jw-text-primary)',
        textSecondary: 'var(--jw-text-secondary)',
        textMuted:     'var(--jw-text-muted)',
        userBubble:    'var(--jw-user-bubble)',
        userBubbleTxt: 'var(--jw-user-bubble-txt)',
        inputBg:       'var(--jw-input-bg)',
        placeholder:   'var(--jw-placeholder)',
        accentColor:   'var(--jw-accent-color)',
        accentDimBg:   'var(--jw-accent-dim-bg)',
        accentDimBdr:  'var(--jw-accent-dim-bdr)',
        bgCard:        'var(--jw-card-bg)',
        borderCard:    'var(--jw-card-border)',
        bgSticky:      'var(--jw-sticky-bg)',
        bgHeader:      'var(--jw-header-bg)',
      };
    }

    // _applyTheme: data-dark toggle → CSS cascade tüm --jw-* token'ları günceller.
    // Yalnızca CSS variable dışı bağımlılıklar için hedefli DOM güncellemeleri yapılır.
    _applyTheme() {
      var isDark = this._st.isDark;
      var host   = this._shadow.host;

      // 1. data-dark ↔ :host([data-dark]) CSS cascade
      isDark ? host.setAttribute('data-dark', '') : host.removeAttribute('data-dark');

      // 2. colorScheme (scrollbar rengi)
      if (this._refs.msgs) this._refs.msgs.style.colorScheme = isDark ? 'dark' : 'light';
      var sessionList = this._shadow.querySelector('#jw-content > .jw-scroll');
      if (sessionList) sessionList.style.colorScheme = isDark ? 'dark' : 'light';

      // 3. Orbit ring sınıfı
      if (this._refs.inputOrbit) {
        this._refs.inputOrbit.className = isDark ? 'jw-orbit-dark' : 'jw-orbit-light';
      }

      // 4. Dark switch → karmaşık gradient/yıldız dekorasyonu, yerinde yeniden kur
      var dsBtn = this._shadow.getElementById('jw-dark-switch');
      if (dsBtn && dsBtn.parentElement && dsBtn.parentElement.parentElement) {
        dsBtn.parentElement.parentElement.replaceChild(
          this._buildDarkSwitch(), dsBtn.parentElement
        );
      }

      // 5. Pin switch → karmaşık gradient, yerinde yeniden kur
      var psBtn = this._shadow.getElementById('jw-pin-switch');
      if (psBtn && psBtn.parentElement && psBtn.parentElement.parentElement) {
        psBtn.parentElement.parentElement.replaceChild(
          this._buildPinSwitch(), psBtn.parentElement
        );
      }

      // 6. Panel toggle switch → track gradientleri isDark'a bağlı
      var ptBtn = this._shadow.getElementById('jw-panel-toggle-switch');
      if (ptBtn && ptBtn.parentElement) {
        ptBtn.parentElement.replaceChild(
          this._buildPanelToggleSwitch(), ptBtn
        );
      }
    }

    // ─── Open/Close State ─────────────────────────────────────────────────────

    _applyOpenState() {
      var ov = this._refs.overlay;
      if (!ov) return;
      var st = this._st;

      ov.classList.toggle('jw-active', st.isOpen);
      ov.classList.toggle('jw-open',   st.isOpen && !st.isPinnedRight);
      ov.classList.toggle('jw-pinned', st.isOpen && !!st.isPinnedRight);

      // Body scroll lock — host sitenin orijinal overflow değerini koru
      if (st.isOpen) {
        this._bodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = this._bodyOverflow || '';
        this._bodyOverflow = '';
      }
    }

    // ─── Resize ───────────────────────────────────────────────────────────────

    _onResize() {
      var wasMobile = this._st.isMobile;
      this._st.isMobile = window.innerWidth < 768;
      if (wasMobile !== this._st.isMobile) {
        if (this._st.isMobile && this._st.isPanelOpen) {
          this._st.isPanelOpen = false;
          this._st.activeCardMsgId = null;
        }
        this._build();
      }
    }

    // ─── Main Build ───────────────────────────────────────────────────────────

    _build() {
      // Önceki typewriter varsa durdur
      if (this._twStop) { this._twStop(); this._twStop = null; }

      var sh = this._shadow;
      sh.innerHTML = '';

      var T  = this._T();
      var st = this._st;

      // data-dark toggle → CSS cascade --jw-* token'larını günceller
      var host = this._shadow.host;
      st.isDark ? host.setAttribute('data-dark', '') : host.removeAttribute('data-dark');

      // Overlay
      var overlay = document.createElement('div');
      overlay.id = 'jw-overlay';
      if (st.isOpen) {
        overlay.classList.add('jw-active');
        if (st.isPinnedRight) overlay.classList.add('jw-pinned');
        else                  overlay.classList.add('jw-open');
      }
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.close();
      });
      this._refs.overlay = overlay;

      // Box (inner container)
      var box = document.createElement('div');
      box.id = 'jw-box';
      box.style.background = T.bg;
      box.style.backdropFilter = 'blur(24px) saturate(1.6)';
      box.style.webkitBackdropFilter = 'blur(24px) saturate(1.6)';

      if (st.isPinnedRight && !st.isMobile) {
        box.className = 'jw-pinned';
      } else if (st.isMobile) {
        box.className = 'jw-mobile';
        if (!st.isPanelOpen) box.classList.add('jw-no-panel');
      } else {
        box.className = 'jw-normal';
        if (st.isPanelOpen) box.classList.add('jw-panel-open');
      }
      this._refs.box = box;

      // Inner wrapper for centering and constraints
      var inner = document.createElement('div');
      inner.style.cssText = 'display:flex;width:100%;height:100%;overflow:hidden;margin:0 auto;';
      if (st.isPinnedRight && !st.isMobile) {
        inner.style.flexDirection = 'column';
        inner.style.maxWidth = '100%';
      } else if (st.isMobile) {
        inner.style.flexDirection = 'column';
        inner.style.maxWidth = '100%';
      } else {
        inner.style.flexDirection = 'row';
        inner.style.maxWidth = '1200px';
      }

      // Content panel (LEFT on mobile top, RIGHT on desktop)
      if (st.isPanelOpen && !st.isPinnedRight) {
        var cp = this._buildContentPanel();
        inner.appendChild(cp);
      }

      // Chat panel
      var chat = this._buildChatPanel();
      inner.appendChild(chat);

      box.appendChild(inner);
      overlay.appendChild(box);
      sh.appendChild(overlay);

      // Fav drawer
      if (st.showFavDrawer) {
        sh.appendChild(this._buildFavDrawer());
      }

      // Scroll to bottom
      this._scrollToBottom();
    }

    // ─── Chat Panel ───────────────────────────────────────────────────────────

    _buildChatPanel() {
      var T  = this._T();
      var st = this._st;
      var isCompact = st.isMobile || st.isPinnedRight;

      var chat = document.createElement('div');
      chat.id = 'jw-chat';
      chat.style.background = 'transparent';

      // Header
      var header = this._buildHeader(isCompact);
      chat.appendChild(header);

      // Messages
      var msgs = document.createElement('div');
      msgs.id = 'jw-messages';
      msgs.className = 'jw-scroll';
      msgs.style.cssText = 'flex:1;min-height:0;padding:16px;display:flex;flex-direction:column;gap:16px;overscroll-behavior:contain;';
      msgs.style.colorScheme = st.isDark ? 'dark' : 'light';

      if (st.messages.length === 0) {
        msgs.appendChild(this._buildWelcome(isCompact));
      } else {
        st.messages.forEach(msg => msgs.appendChild(this._buildMessage(msg, isCompact)));
        if (st.isTyping) msgs.appendChild(this._buildTyping());
      }

      var bottomAnchor = document.createElement('div');
      bottomAnchor.id = 'jw-bottom';
      msgs.appendChild(bottomAnchor);
      chat.appendChild(msgs);
      this._refs.msgs = msgs;

      // Suggestions (shown only after first message)
      if (st.messages.length > 0) {
        chat.appendChild(this._buildSuggestions(isCompact));
      }

      // Input
      chat.appendChild(this._buildInputArea(isCompact));

      return chat;
    }

    // ─── Header ───────────────────────────────────────────────────────────────

    _buildHeader(isCompact) {
      var T  = this._T();
      var st = this._st;

      var header = document.createElement('div');
      header.id = 'jw-header';
      header.style.cssText = [
        'display:flex;align-items:center;gap:12px;flex-shrink:0;',
        'padding:' + (isCompact ? '6px 20px' : '14px 20px') + ';',
        'background:transparent;border-bottom:1px solid ' + T.border + ';',
        'transition:border-color 0.3s;',
      ].join('');

      // Close button
      var closeBtn = document.createElement('button');
      closeBtn.className = 'jw-btn';
      closeBtn.title = "Jules'ı kapat";
      closeBtn.innerHTML = ICO.PhosphorX(11);
      closeBtn.style.cssText = 'width:24px;height:24px;border-radius:8px;border:1px solid ' + T.border + ';color:' + T.textMuted + ';flex-shrink:0;transition:background 0.15s,border-color 0.15s,color 0.15s;';
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(248,113,113,0.12)';
        closeBtn.style.borderColor = '#f87171';
        closeBtn.style.color = '#f87171';
      });
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'transparent';
        closeBtn.style.borderColor = T.border;
        closeBtn.style.color = T.textMuted;
      });
      closeBtn.addEventListener('click', () => this.close());
      header.appendChild(closeBtn);

      // Date + weather
      var dateRow = document.createElement('div');
      dateRow.id = 'jw-date-row';
      dateRow.style.cssText = 'display:flex;align-items:center;gap:12px;overflow:hidden;';

      var dateSpan = document.createElement('span');
      dateSpan.style.cssText = 'font-size:10px;color:' + T.textSecondary + ';white-space:nowrap;flex-shrink:0;';
      dateSpan.textContent = getDateStr();
      dateRow.appendChild(dateSpan);

      if (st.weatherInfo) {
        var wRow = document.createElement('div');
        wRow.id = 'jw-weather-row';
        wRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
        wRow.innerHTML = weatherIconHtml(st.weatherInfo.code, 'var(--jw-accent-color)', 14) +
          '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + st.weatherInfo.temp + '°C</span>';
        dateRow.appendChild(wRow);

        var sunLabel = getSunLabel(st.weatherInfo);
        if (sunLabel && !st.isMobile) {
          var sunRow = document.createElement('div');
          sunRow.id = 'jw-sun-row';
          sunRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
          sunRow.innerHTML = '<span style="color:var(--jw-accent-color);display:inline-flex;">' + ICO.SunHorizon(12) + '</span>' +
            '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + sunLabel.label + '</span>';
          dateRow.appendChild(sunRow);
        }
      }
      header.appendChild(dateRow);

      // Right side controls
      var right = document.createElement('div');
      right.style.cssText = 'margin-left:auto;display:flex;align-items:center;gap:10px;flex-shrink:0;';

      // Favorites button (compact mode only)
      if (isCompact) {
        var favCount = this._getFavCount();
        var favBtn = document.createElement('button');
        favBtn.className = 'jw-btn';
        favBtn.dataset.compactFavBtn = '1'; // hedefli güncelleme için marker
        favBtn.style.cssText = 'position:relative;padding:6px;border-radius:8px;color:' + (favCount > 0 ? '#f87171' : T.textMuted) + ';transition:color 0.15s,background 0.15s;';
        favBtn.innerHTML = ICO.Heart(16, favCount > 0) + (favCount > 0 ? '<span style="position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:#f87171;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;">' + favCount + '</span>' : '');
        favBtn.addEventListener('click', () => { this._st.showFavDrawer = true; this._build(); });
        favBtn.addEventListener('mouseenter', () => { favBtn.style.background = T.accentDimBg; });
        favBtn.addEventListener('mouseleave', () => { favBtn.style.background = 'transparent'; });
        right.appendChild(favBtn);
      }

      // PinRight Switch (desktop only)
      if (!st.isMobile) {
        right.appendChild(this._buildPinSwitch());
      }

      // Dark mode switch
      right.appendChild(this._buildDarkSwitch());

      // Panel toggle chevron (desktop, when panel sessions exist)
      if (!st.isPanelOpen && st.panelSessions.length > 0 && !isCompact) {
        var chevBtn = document.createElement('button');
        chevBtn.className = 'jw-btn';
        chevBtn.title = 'Sonuçları göster';
        chevBtn.innerHTML = ICO.ChevronLeft(14);
        chevBtn.style.cssText = 'width:24px;height:24px;border-radius:8px;border:1px solid ' + T.accentDimBdr + ';background:' + T.accentDimBg + ';color:' + T.accentColor + ';transition:background 0.15s,color 0.15s;';
        chevBtn.addEventListener('mouseenter', () => { chevBtn.style.background = 'var(--jules-secondary)'; chevBtn.style.color = '#fff'; });
        chevBtn.addEventListener('mouseleave', () => { chevBtn.style.background = T.accentDimBg; chevBtn.style.color = T.accentColor; });
        chevBtn.addEventListener('click', () => this._handleTogglePanel());
        right.appendChild(chevBtn);
      }

      header.appendChild(right);
      return header;
    }

    // ─── Welcome Screen ───────────────────────────────────────────────────────

    _buildWelcome(isCompact) {
      var T  = this._T();
      var st = this._st;
      var suggestions = (this._config.suggestions || []);

      var wrap = document.createElement('div');
      wrap.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;';

      // Emoji container
      var emojiWrap = document.createElement('div');
      emojiWrap.id = 'jw-emoji-wrap';
      emojiWrap.style.cssText = 'width:56px;height:56px;position:relative;overflow:hidden;flex-shrink:0;';

      var emojiInner = document.createElement('div');
      emojiInner.id = 'jw-emoji-inner';
      emojiInner.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;';

      var cur = EMOJIS[st.emojiIndex];
      var phaseStyle = this._getEmojiStyle(st.emojiPhase);

      if (cur === 'BOT_ICON') {
        emojiInner.innerHTML = '<div style="' + phaseStyle + 'will-change:transform;">' +
          '<div style="width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.18);background:var(--jules-secondary);">' +
          '<span style="color:white;">' + ICO.Bot(18) + '</span>' +
          '</div></div>';
      } else {
        emojiInner.innerHTML = '<span style="font-size:28px;line-height:1;display:block;user-select:none;will-change:transform;' + phaseStyle + '">' + cur + '</span>';
      }

      emojiWrap.appendChild(emojiInner);
      wrap.appendChild(emojiWrap);

      // Text
      var textDiv = document.createElement('div');
      textDiv.style.cssText = 'text-align:center;';
      textDiv.innerHTML = '<p style="font-size:14px;font-weight:600;color:' + T.textPrimary + ';margin-bottom:4px;">Size nasıl yardımcı olabilirim?</p>' +
        '<p style="font-size:12px;color:' + T.textMuted + ';">Bir şeyler sorun, size en iyi sonuçları getireyim.</p>';
      wrap.appendChild(textDiv);

      // Suggestion chips
      var chipsDiv = document.createElement('div');
      chipsDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px;';
      suggestions.forEach(s => {
        var chip = document.createElement('button');
        chip.className = 'jw-btn jw-sugg-chip';
        chip.textContent = s;
        chip.style.cssText = 'padding:8px 12px;font-size:10px;border:1px solid ' + T.accentDimBdr + ';color:' + T.textSecondary + ';border-radius:12px;font-family:inherit;transition:all 0.15s;';
        chip.addEventListener('mouseenter', () => {
          chip.style.borderColor = T.accentColor;
          chip.style.color = T.accentColor;
          chip.style.background = T.accentDimBg;
        });
        chip.addEventListener('mouseleave', () => {
          chip.style.borderColor = T.accentDimBdr;
          chip.style.color = T.textSecondary;
          chip.style.background = 'transparent';
        });
        chip.addEventListener('click', () => this._handleSend(s));
        chipsDiv.appendChild(chip);
      });
      wrap.appendChild(chipsDiv);

      return wrap;
    }

    _getEmojiStyle(phase) {
      if (phase === 'out') return 'transform:scale(0.4) rotate(-15deg);opacity:0;transition:transform 0.18s cubic-bezier(0.4,0,1,1),opacity 0.18s ease;';
      if (phase === 'in')  return 'transform:scale(1.25) rotate(8deg);opacity:0;transition:none;';
      return 'transform:scale(1) rotate(0deg);opacity:1;transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1),opacity 0.18s ease;';
    }

    // ─── Message ──────────────────────────────────────────────────────────────

    _buildMessage(msg, isCompact) {
      var T  = this._T();
      var st = this._st;
      var isUser = msg.role === 'user';

      var wrap = document.createElement('div');
      wrap.className = 'jw-msg-in';
      wrap.style.cssText = 'display:flex;flex-direction:column;';

      // Row (avatar + bubble)
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:10px;' + (isUser ? 'justify-content:flex-end;' : 'justify-content:flex-start;');

      if (!isUser) {
        var avatar = document.createElement('div');
        avatar.style.cssText = 'width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;box-shadow:0 2px 8px rgba(0,0,0,0.12);background:var(--jules-secondary);color:white;';
        avatar.innerHTML = ICO.Bot(14);
        row.appendChild(avatar);
      }

      var col = document.createElement('div');
      col.style.cssText = 'display:flex;flex-direction:column;gap:4px;' + (isUser ? 'align-items:flex-end;' : 'align-items:flex-start;') + 'max-width:' + (isCompact ? '85%' : '50%') + ';';

      // Bubble
      var bubble = document.createElement('div');
      // Compact/mobilde assistant bubble alt boşluğunu yarıya indir (10px→4px)
      var bubblePadding = (!isUser && isCompact) ? '10px 14px 4px 0' : '10px 14px';
      bubble.style.cssText = [
        'padding:' + bubblePadding + ';font-size:12px;line-height:1.6;border-radius:' + (isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px') + ';',
        'background:' + (isUser ? T.userBubble : 'transparent') + ';',
        'color:' + (isUser ? T.userBubbleTxt : (this._st.isDark ? '#cfe8f4' : '#1f2937')) + ';',
        isUser ? 'box-shadow:0 2px 8px rgba(0,0,0,var(--jw-msg-shadow-alpha));' : '',
      ].join('');
      bubble.textContent = msg.content;
      col.appendChild(bubble);

      // Show cards button (desktop non-compact)
      if (msg.hasCards && !isUser && !isCompact) {
        var cardsBtn = document.createElement('button');
        cardsBtn.className = 'jw-btn';
        var isActive = st.activeCardMsgId === msg.id;
        cardsBtn.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:12px;font-size:10px;font-weight:500;font-family:inherit;transition:background 0.15s,color 0.15s,border-color 0.15s;' +
          (isActive ? 'background:var(--jules-secondary);color:white;border:1px solid transparent;' : 'background:' + T.accentDimBg + ';color:' + T.accentColor + ';border:1px solid ' + T.accentDimBdr + ';');
        cardsBtn.innerHTML = ICO.Sparkles(11) + '<span>' + esc(msg.cardLabel || 'Sonuçları Gör') + '</span>';
        if (!isActive) {
          cardsBtn.addEventListener('mouseenter', () => { cardsBtn.style.background = this._st.isDark ? 'rgba(77,196,206,0.2)' : '#b2e4ea'; });
          cardsBtn.addEventListener('mouseleave', () => { cardsBtn.style.background = this._T().accentDimBg; });
        }
        cardsBtn.addEventListener('click', () => this._handleShowCards(msg.id));
        col.appendChild(cardsBtn);
      }

      // Time + action buttons
      var meta = document.createElement('div');
      meta.style.cssText = 'display:flex;align-items:center;gap:8px;';

      var timeSpan = document.createElement('span');
      timeSpan.style.cssText = 'font-size:10px;color:' + T.textMuted + ';';
      timeSpan.textContent = formatTime(msg.timestamp);
      meta.appendChild(timeSpan);

      if (!isUser) {
        // Copy — data-copy-id ile hedefli DOM güncellemesi için
        var copyBtn = document.createElement('button');
        copyBtn.className = 'jw-btn';
        copyBtn.dataset.copyId = msg.id;
        var isCopied = st.copied === msg.id;
        copyBtn.style.cssText = 'padding:4px;border-radius:4px;color:' + (isCopied ? '#16a34a' : T.textMuted) + ';transition:color 0.15s;';
        copyBtn.innerHTML = isCopied ? ICO.Check(11) : ICO.Copy(11);
        copyBtn.title = 'Kopyala';
        copyBtn.addEventListener('click', () => this._handleCopy(msg.id, msg.content));
        copyBtn.addEventListener('mouseenter', () => { if (this._st.copied !== msg.id) copyBtn.style.color = T.textSecondary; });
        copyBtn.addEventListener('mouseleave', () => { if (this._st.copied !== msg.id) copyBtn.style.color = T.textMuted; });
        meta.appendChild(copyBtn);

        // ThumbsUp — data-vote-up-id ile hedefli güncelleme için
        var upBtn = document.createElement('button');
        upBtn.className = 'jw-btn';
        upBtn.dataset.voteUpId = msg.id;
        var votedUp = st.votes[msg.id] === 'up';
        upBtn.style.cssText = 'padding:4px;border-radius:4px;color:' + (votedUp ? '#16a34a' : T.textMuted) + ';transition:color 0.15s;';
        upBtn.innerHTML = ICO.ThumbsUp(11, votedUp);
        upBtn.addEventListener('click', () => this._handleVote(msg.id, 'up'));
        upBtn.addEventListener('mouseenter', () => { if (this._st.votes[msg.id] !== 'up') upBtn.style.color = '#16a34a'; });
        upBtn.addEventListener('mouseleave', () => { if (this._st.votes[msg.id] !== 'up') upBtn.style.color = this._T().textMuted; });
        meta.appendChild(upBtn);

        // ThumbsDown — data-vote-down-id ile hedefli güncelleme için
        var downBtn = document.createElement('button');
        downBtn.className = 'jw-btn';
        downBtn.dataset.voteDownId = msg.id;
        var votedDown = st.votes[msg.id] === 'down';
        downBtn.style.cssText = 'padding:4px;border-radius:4px;color:' + (votedDown ? '#dc2626' : T.textMuted) + ';transition:color 0.15s;';
        downBtn.innerHTML = ICO.ThumbsDown(11, votedDown);
        downBtn.addEventListener('click', () => this._handleVote(msg.id, 'down'));
        downBtn.addEventListener('mouseenter', () => { if (this._st.votes[msg.id] !== 'down') downBtn.style.color = '#dc2626'; });
        downBtn.addEventListener('mouseleave', () => { if (this._st.votes[msg.id] !== 'down') downBtn.style.color = this._T().textMuted; });
        meta.appendChild(downBtn);
      }

      col.appendChild(meta);
      row.appendChild(col);
      wrap.appendChild(row);

      // Inline carousel (compact mode)
      if (isCompact && msg.hasCards && !isUser && st.cardData[msg.id]) {
        var carouselWrap = document.createElement('div');
        carouselWrap.style.cssText = 'width:100%;margin-top:4px;';
        carouselWrap.appendChild(this._buildCarousel(st.cardData[msg.id].cards, msg.id));
        wrap.appendChild(carouselWrap);
      }

      return wrap;
    }

    _buildTyping() {
      var T = this._T();
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;gap:10px;justify-content:flex-start;';

      var avatar = document.createElement('div');
      avatar.style.cssText = 'width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;background:var(--jules-secondary);color:white;';
      avatar.innerHTML = ICO.Bot(14);
      wrap.appendChild(avatar);

      var dots = document.createElement('div');
      dots.style.cssText = 'padding:12px 14px;border-radius:4px 16px 16px 16px;display:flex;align-items:center;gap:4px;';
      [1,2,3].forEach(i => {
        var dot = document.createElement('span');
        dot.className = 'jw-bounce-' + i;
        dot.style.cssText = 'width:6px;height:6px;border-radius:50%;display:inline-block;background:' + T.textMuted + ';';
        dots.appendChild(dot);
      });
      wrap.appendChild(dots);
      return wrap;
    }

    // ─── Typewriter Placeholder ───────────────────────────────────────────────

    _startTypewriter(ta) {
      if (!ta) return;
      var phrases = TW_PHRASES;
      var phraseIdx = 0;
      var active = true;
      var timers = [];

      var stop = () => {
        active = false;
        timers.forEach(t => clearTimeout(t));
        if (ta.placeholder.endsWith('|')) {
          ta.placeholder = ta.placeholder.slice(0, -1) || 'Bir şeyler sorun...';
        }
      };
      this._twStop = stop;

      var schedule = (fn, ms) => {
        var t = setTimeout(fn, ms);
        timers.push(t);
        // Tamamlanmış timer ID'lerinin birikmesini önle
        if (timers.length > 60) timers = timers.slice(-20);
      };

      var type = (phrase, charIdx) => {
        if (!active || ta.value) { ta.placeholder = 'Bir şeyler sorun...'; return; }
        ta.placeholder = phrase.slice(0, charIdx) + '|';
        if (charIdx < phrase.length) {
          schedule(() => type(phrase, charIdx + 1), 62);
        } else {
          schedule(() => erase(phrase, phrase.length), 1500);
        }
      };

      var erase = (phrase, charIdx) => {
        if (!active || ta.value) { ta.placeholder = 'Bir şeyler sorun...'; return; }
        if (charIdx === 0) {
          phraseIdx = (phraseIdx + 1) % phrases.length;
          schedule(() => type(phrases[phraseIdx], 0), 320);
        } else {
          ta.placeholder = phrase.slice(0, charIdx - 1) + '|';
          schedule(() => erase(phrase, charIdx - 1), 38);
        }
      };

      type(phrases[0], 0);
    }

    // ─── Suggestions ──────────────────────────────────────────────────────────

    _buildSuggestions(isCompact) {
      var T = this._T();
      var st = this._st;
      var suggestions = this._config.suggestions || [];
      // Dış wrapper — relative konum için
      var wrap = document.createElement('div');
      wrap.id = 'jw-sugg-wrap';
      wrap.style.cssText = 'position:relative;flex-shrink:0;border-top:1px solid ' + (st.isDark ? 'rgba(77,196,206,0.18)' : 'rgba(10,110,130,0.13)') + ';display:flex;justify-content:center;padding:0 16px;';

      var inner = document.createElement('div');
      inner.style.cssText = 'width:700px;max-width:100%;position:relative;display:flex;flex-direction:column;';

      // Sol Ok Konteyneri (Fade kaldırıldı)
      var fadeL = document.createElement('div');
      fadeL.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:32px;pointer-events:none;z-index:10;opacity:0;display:flex;align-items:center;padding-left:4px;';
      
      var arrowDefaultBg     = 'var(--jw-arrow-bg)';
      var arrowDefaultBorder = 'var(--jw-arrow-border)';

      if (!st.isMobile) {
        var btnL = document.createElement('button');
        btnL.className = 'jw-btn jw-sugg-arrow jw-sugg-arrow-l';
        btnL.innerHTML = ICO.ChevronLeft(14);
        btnL.style.cssText = 'pointer-events:auto; background:' + arrowDefaultBg + '; border:1px solid ' + arrowDefaultBorder + '; color:' + T.textPrimary + '; box-shadow:0 4px 12px rgba(0,0,0,0.15); transition:all 0.2s;';
        btnL.addEventListener('mouseenter', function() {
          btnL.style.background = 'var(--jules-secondary)';
          btnL.style.color = '#ffffff';
          btnL.style.borderColor = 'var(--jules-secondary)';
        });
        btnL.addEventListener('mouseleave', function() {
          btnL.style.background = arrowDefaultBg;
          btnL.style.color = T.textPrimary;
          btnL.style.borderColor = arrowDefaultBorder;
        });
        btnL.addEventListener('click', () => {
          bar.scrollBy({ left: -(bar.clientWidth * 0.7), behavior: 'smooth' });
        });
        fadeL.appendChild(btnL);
      }

      // Sağ Ok Konteyneri (Fade kaldırıldı)
      var fadeR = document.createElement('div');
      fadeR.style.cssText = 'position:absolute;right:0;top:0;bottom:0;width:32px;pointer-events:none;z-index:10;opacity:0;display:flex;align-items:center;justify-content:flex-end;padding-right:4px;';
      
      if (!st.isMobile) {
        var btnR = document.createElement('button');
        btnR.className = 'jw-btn jw-sugg-arrow jw-sugg-arrow-r';
        btnR.innerHTML = ICO.ChevronRight(14);
        btnR.style.cssText = 'pointer-events:auto; background:' + arrowDefaultBg + '; border:1px solid ' + arrowDefaultBorder + '; color:' + T.textPrimary + '; box-shadow:0 4px 12px rgba(0,0,0,0.15); transition:all 0.2s;';
        btnR.addEventListener('mouseenter', function() {
          btnR.style.background = 'var(--jules-secondary)';
          btnR.style.color = '#ffffff';
          btnR.style.borderColor = 'var(--jules-secondary)';
        });
        btnR.addEventListener('mouseleave', function() {
          btnR.style.background = arrowDefaultBg;
          btnR.style.color = T.textPrimary;
          btnR.style.borderColor = arrowDefaultBorder;
        });
        btnR.addEventListener('click', () => {
          bar.scrollBy({ left: (bar.clientWidth * 0.7), behavior: 'smooth' });
        });
        fadeR.appendChild(btnR);
      }

      // Scroll eden iç bar
      var bar = document.createElement('div');
      bar.id = 'jw-suggestions';
      bar.style.cssText = 'display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;flex-shrink:0;padding:' + (isCompact ? '12px 0' : '14px 0') + ';scroll-snap-type:' + (isCompact ? 'x mandatory' : 'none') + ';';
      if (!isCompact) bar.style.justifyContent = 'center';

      var updateFade = function () {
        var sl = bar.scrollLeft;
        var max = bar.scrollWidth - bar.clientWidth;
        fadeL.style.opacity = sl > 4 ? '1' : '0';
        fadeR.style.opacity = sl < max - 4 ? '1' : '0';
      };

      bar.addEventListener('scroll', updateFade);

      suggestions.forEach(function (s) {
        var chip = document.createElement('button');
        chip.className = 'jw-btn jw-sugg-chip';
        chip.textContent = s;
        chip.style.cssText = 'flex-shrink:0;white-space:nowrap;padding:6px 12px;font-size:10px;border:1px solid ' + T.accentDimBdr + ';border-radius:12px;color:' + T.textSecondary + ';font-family:inherit;transition:all 0.15s;background:transparent;scroll-snap-align:start;';
        chip.addEventListener('mouseenter', function () {
          chip.style.borderColor = T.accentColor;
          chip.style.color = T.accentColor;
          chip.style.background = T.accentDimBg;
        });
        chip.addEventListener('mouseleave', function () {
          chip.style.borderColor = T.accentDimBdr;
          chip.style.color = T.textSecondary;
          chip.style.background = 'transparent';
        });
        chip.addEventListener('click', () => {
          this._handleSend(s);
          var orbit = this._refs.inputOrbit;
          if (orbit) {
            orbit.classList.add('jw-orbit-glow');
            setTimeout(() => orbit.classList.remove('jw-orbit-glow'), 800);
          }
        });
        bar.appendChild(chip);
      }, this);

      inner.appendChild(fadeL);
      inner.appendChild(fadeR);
      inner.appendChild(bar);
      wrap.appendChild(inner);

      // Mount sonrası sağ fade'i kontrol et
      setTimeout(updateFade, 60);

      return wrap;
    }

    // ─── Input Area ───────────────────────────────────────────────────────────

    _buildInputArea(isCompact) {
      var T  = this._T();
      var st = this._st;
      var branding = this._config.branding || {};

      var area = document.createElement('div');
      area.id = 'jw-input-area';
      area.style.cssText = 'padding:0 16px 16px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;';

      // Toast konteyneri (position:relative, toast absolute konumlanır)
      var inputWrapper = document.createElement('div');
      inputWrapper.id = 'jw-input-wrapper';
      inputWrapper.style.cssText = 'position:relative;width:700px;max-width:100%;';

      // Orbit wrapper
      var orbitWrap = document.createElement('div');
      orbitWrap.style.cssText = 'position:relative;width:100%;border-radius:17px;padding:1.5px;background:transparent;overflow:hidden;transition:background 0.2s;';

      var orbitBg = document.createElement('div');
      this._refs.inputOrbit = orbitBg;
      orbitBg.className = st.isDark ? 'jw-orbit-dark' : 'jw-orbit-light';
      orbitBg.style.cssText = 'position:absolute;inset:0;z-index:0;';
      orbitWrap.appendChild(orbitBg);

      // Inner
      var inner = document.createElement('div');
      inner.style.cssText = [
        'position:relative;z-index:1;border-radius:15.5px;',
        'background:' + T.inputBg + ';',
        'transition:background 0.3s;',
        isCompact ? 'display:flex;flex-direction:row;align-items:center;gap:8px;padding:0 12px;' + (st.isMobile ? 'min-height:38px;height:38px;transition:height 0.15s ease;' : 'min-height:54px;') : 'display:flex;flex-direction:column;gap:4px;padding:8px;min-height:98px;',
        'cursor:text;',
      ].join('');

      // Textarea
      var ta = document.createElement('textarea');
      ta.className = 'jw-ta jw-scroll';
      ta.rows = 1;
      ta.placeholder = 'Bir şeyler sorun...';
      ta.value = st.inputValue || '';
      // iOS zoom fix: mobilde font-size 16px olmalı (≥16px → iOS zoom tetiklenmez)
      var taFontSize = st.isMobile ? '16' : (isCompact ? '14' : '12');
      // Mobilde max 2 satır (49px), pinned/compact'ta 36px
      var taMaxH = st.isMobile ? '49px' : (isCompact ? '36px' : 'none');
      ta.style.cssText = [
        'flex:1;font-size:' + taFontSize + 'px;color:' + T.textPrimary + ';',
        'max-height:' + taMaxH + ';',
        st.isMobile ? 'overflow-y:hidden;' : (isCompact ? 'overflow-y:auto;align-self:center;' : ''),
      ].join('');
      ta.addEventListener('input', e => {
        this._st.inputValue = e.target.value;
        e.target.style.height = 'auto';
        var maxScroll = st.isMobile ? 49 : 112;
        var newH = Math.min(e.target.scrollHeight, maxScroll);
        e.target.style.height = newH + 'px';
        // Mobilde inner container'ı da büyüt (14px = dikey padding)
        if (st.isMobile && inner) {
          inner.style.minHeight = (newH + 14) + 'px';
          inner.style.height = (newH + 14) + 'px';
        }
        // Kullanıcı yazmaya başlayınca typewriter'ı durdur
        if (this._twStop) { this._twStop(); this._twStop = null; }
      });
      ta.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._handleSend(ta.value); }
      });
      inner.appendChild(ta);

      // Mesaj yoksa typewriter başlat
      if (st.messages.length === 0) {
        // Kısa gecikme: DOM'a append edildikten sonra çalışsın
        setTimeout(() => this._startTypewriter(ta), 80);
      }

      // Buttons row
      var btnRow = document.createElement('div');
      btnRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;justify-content:flex-end;';

      // Panel toggle switch (desktop only)
      if (!isCompact) {
        btnRow.appendChild(this._buildPanelToggleSwitch());
      }

      // Mic — "Dinleniyor..." etiketi
      var micLabel = document.createElement('span');
      micLabel.id = 'jw-mic-label';
      micLabel.textContent = 'Dinleniyor…';
      micLabel.style.cssText = 'font-size:10px;font-weight:500;color:#ef4444;letter-spacing:0.02em;display:' + (st.isListening ? 'inline' : 'none') + ';user-select:none;';
      btnRow.appendChild(micLabel);
      this._refs.micStatusLabel = micLabel;

      // Mic button
      var micBtn = document.createElement('button');
      micBtn.className = 'jw-btn' + (st.isListening ? ' jw-mic-listening' : '');
      micBtn.title = st.isListening ? 'Dinlemeyi durdur' : 'Sesli yaz (Türkçe)';
      micBtn.innerHTML = ICO.Mic(16);
      micBtn.style.cssText = 'padding:6px;border-radius:8px;transition:color 0.15s,background 0.15s;color:' + (st.isListening ? '#ef4444' : T.textMuted) + ';background:' + (st.isListening ? 'rgba(239,68,68,0.10)' : 'transparent') + ';';
      micBtn.addEventListener('mouseenter', () => {
        if (!this._st.isListening) { micBtn.style.color = T.accentColor; micBtn.style.background = T.accentDimBg; }
      });
      micBtn.addEventListener('mouseleave', () => {
        if (!this._st.isListening) { micBtn.style.color = T.textMuted; micBtn.style.background = 'transparent'; }
      });
      micBtn.addEventListener('click', () => this._toggleMic(ta));
      this._refs.micBtn = micBtn;
      btnRow.appendChild(micBtn);

      // Send button
      var sendBtn = document.createElement('button');
      sendBtn.className = 'jw-btn';
      sendBtn.innerHTML = ICO.ArrowUp(13);
      sendBtn.style.cssText = 'width:63px;padding:5px 0;border-radius:7px;background:var(--jules-secondary);color:white;opacity:' + (st.inputValue && st.inputValue.trim() ? '1' : '0.4') + ';transition:opacity 0.15s;cursor:' + (st.inputValue && st.inputValue.trim() ? 'pointer' : 'not-allowed') + ';';
      sendBtn.addEventListener('click', () => this._handleSend(ta.value));
      // Mobilde touchend → önce blur (klavye kapanır), sonra gönder
      sendBtn.addEventListener('touchend', (e) => {
        e.preventDefault(); // simulated click'i engelle
        if (!ta.value.trim()) return;
        ta.blur();
        var val = ta.value;
        setTimeout(() => this._handleSend(val), 0);
      });
      this._refs.sendBtn = sendBtn;
      ta.addEventListener('input', () => {
        var hasVal = ta.value.trim().length > 0;
        sendBtn.style.opacity = hasVal ? '1' : '0.4';
        sendBtn.style.cursor  = hasVal ? 'pointer' : 'not-allowed';
      });
      btnRow.appendChild(sendBtn);

      inner.addEventListener('click', () => ta.focus());
      inner.appendChild(btnRow);
      orbitWrap.appendChild(inner);
      inputWrapper.appendChild(orbitWrap);
      area.appendChild(inputWrapper);

      // Brand footer
      var footer = document.createElement('div');
      footer.style.cssText = 'display:flex;align-items:center;justify-content:space-between;width:100%;max-width:700px;margin-top:8px;';

      // Left: JULES badge
      var leftDiv = document.createElement('div');
      leftDiv.style.cssText = 'display:flex;align-items:center;gap:8px;';
      leftDiv.innerHTML = [
        '<div style="position:relative;">',
          '<div style="width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:var(--jules-secondary);color:white;">' + ICO.Bot(12) + '</div>',
          '<span style="position:absolute;bottom:-2px;right:-2px;width:8px;height:8px;background:#34d399;border-radius:50%;border:1.5px solid ' + T.inputBg + ';"></span>',
        '</div>',
        '<div>',
          '<p style="font-size:11px;font-weight:700;color:' + T.textPrimary + ';line-height:1.2;">' + esc(branding.name || 'JULES') + '</p>',
          '<p style="font-size:9px;font-weight:500;color:#34d399;line-height:1.2;">Çevrimiçi</p>',
        '</div>',
      ].join('');
      footer.appendChild(leftDiv);

      // Center: disclaimer
      var disclaimer = document.createElement('p');
      disclaimer.style.cssText = 'font-size:10px;color:' + T.textMuted + ';text-align:center;line-height:1.6;';
      if (isCompact) {
        disclaimer.innerHTML = 'AI yanıtlar hata içerebilir.<br>Önemli bilgileri doğrulayın.';
      } else {
        disclaimer.textContent = 'AI yanıtlar hata içerebilir. Önemli bilgileri doğrulayın.';
      }
      footer.appendChild(disclaimer);

      // Right: powered by
      var poweredDiv = document.createElement('div');
      poweredDiv.style.cssText = 'display:flex;align-items:center;gap:4px;';
      poweredDiv.innerHTML = '<span style="color:' + T.accentColor + ';display:inline-flex;">' + ICO.Sparkles(9) + '</span>';
      var poweredLink = document.createElement('a');
      poweredLink.href   = branding.poweredByUrl || 'https://creator.com.tr';
      poweredLink.target = '_blank';
      poweredLink.rel    = 'noopener noreferrer';
      poweredLink.textContent = branding.poweredBy || 'Powered by Creator AI';
      poweredLink.style.cssText = 'font-size:10px;font-weight:500;color:' + (st.isDark ? '#6fa8bf' : '#6b7280') + ';text-decoration:underline;text-underline-offset:2px;transition:color 0.15s;';
      poweredLink.addEventListener('mouseenter', () => { poweredLink.style.color = '#34d399'; });
      poweredLink.addEventListener('mouseleave', () => { poweredLink.style.color = st.isDark ? '#6fa8bf' : '#6b7280'; });
      poweredDiv.appendChild(poweredLink);
      footer.appendChild(poweredDiv);

      area.appendChild(footer);
      return area;
    }

    // ─── STT ─────────────────────────────────────────────────────────────────

    _toggleMic(ta) {
      // Dinleme aktifse durdur
      if (this._st.isListening) {
        this._recognition && this._recognition.stop();
        return;
      }

      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        this._showMicToast('Ses tanıma bu tarayıcıda desteklenmiyor. Chrome veya Edge kullanın.');
        return;
      }

      this._preVoiceText = ta.value;

      var rec = new SR();
      rec.lang            = 'tr-TR';
      rec.continuous      = false;
      rec.interimResults  = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        this._st.isListening = true;
        this._updateMicUI(true);
      };

      rec.onresult = (e) => {
        var interim = '', final = '';
        for (var i = 0; i < e.results.length; i++) {
          if (e.results[i].isFinal) final   += e.results[i][0].transcript;
          else                       interim += e.results[i][0].transcript;
        }
        var base   = this._preVoiceText;
        var prefix = base ? base + ' ' : '';
        ta.value = prefix + (final || interim);
        this._st.inputValue = ta.value;
        // Send butonunu güncelle
        if (this._refs.sendBtn) {
          var hasVal = ta.value.trim().length > 0;
          this._refs.sendBtn.style.opacity = hasVal ? '1' : '0.4';
          this._refs.sendBtn.style.cursor  = hasVal ? 'pointer' : 'not-allowed';
        }
        // Textarea yüksekliğini ayarla
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 112) + 'px';
      };

      rec.onend = () => {
        this._st.isListening = false;
        this._recognition = null;
        this._updateMicUI(false);
        setTimeout(() => ta.focus(), 80);
      };

      rec.onerror = (e) => {
        this._st.isListening = false;
        this._recognition = null;
        this._updateMicUI(false);
        if      (e.error === 'not-allowed')    this._showMicToast('Mikrofon izni reddedildi. Tarayıcı ayarlarından izin verin.');
        else if (e.error === 'no-speech')      this._showMicToast('Ses algılanamadı. Lütfen tekrar deneyin.');
        else if (e.error === 'audio-capture')  this._showMicToast('Mikrofona erişilemiyor. Bağlantıyı kontrol edin.');
      };

      this._recognition = rec;
      rec.start();
    }

    _updateMicUI(isListening) {
      var T = this._T();
      var micBtn   = this._refs.micBtn;
      var micLabel = this._refs.micStatusLabel;

      if (micBtn) {
        if (isListening) {
          micBtn.classList.add('jw-mic-listening');
          micBtn.title = 'Dinlemeyi durdur';
          micBtn.style.color      = '#ef4444';
          micBtn.style.background = 'rgba(239,68,68,0.10)';
        } else {
          micBtn.classList.remove('jw-mic-listening');
          micBtn.title = 'Sesli yaz (Türkçe)';
          micBtn.style.color      = T.textMuted;
          micBtn.style.background = 'transparent';
        }
      }
      if (micLabel) {
        micLabel.style.display = isListening ? 'inline' : 'none';
      }
    }

    _showMicToast(message) {
      var existing = this._shadow.getElementById('jw-mic-toast');
      if (existing) existing.remove();

      var toast = document.createElement('div');
      toast.id = 'jw-mic-toast';
      toast.style.cssText = [
        'position:absolute;',
        'bottom:calc(100% + 10px);',
        'left:50%;',
        'transform:translateX(-50%);',
        'background:rgba(220,38,38,0.92);',
        'color:#fff;',
        'font-size:11px;font-weight:500;',
        'padding:6px 14px 6px 10px;',
        'border-radius:20px;',
        'white-space:nowrap;',
        'pointer-events:none;',
        'z-index:9999;',
        'box-shadow:0 4px 18px rgba(0,0,0,0.22);',
        'display:flex;align-items:center;gap:6px;',
        'animation:jw-toast-in 0.2s ease forwards;',
      ].join('');

      // Uyarı ikonu
      var ico = document.createElement('span');
      ico.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      ico.style.flexShrink = '0';
      toast.appendChild(ico);

      var txt = document.createElement('span');
      txt.textContent = message;
      toast.appendChild(txt);

      // Toast'ı input wrapper'ına göm (relative parent)
      var inputWrapper = this._shadow.getElementById('jw-input-wrapper');
      if (inputWrapper) {
        inputWrapper.appendChild(toast);
      } else {
        // Fallback: shadow root'a ekle
        toast.style.position = 'fixed';
        toast.style.bottom   = '90px';
        this._shadow.appendChild(toast);
      }

      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
    }

    // ─── Panel Toggle Switch ──────────────────────────────────────────────────

    _buildPanelToggleSwitch() {
      var T  = this._T();
      var st = this._st;
      var isPanelOpen = st.isPanelOpen;
      var hasSessions = st.panelSessions.length > 0;

      var btn = document.createElement('button');
      btn.id = 'jw-panel-toggle-switch';
      btn.className = 'jw-btn';
      btn.title = isPanelOpen ? 'Sonuçları gizle' : 'Sonuçları göster';
      btn.style.cssText = 'opacity:' + (hasSessions ? '1' : '0.28') + ';cursor:' + (hasSessions ? 'pointer' : 'not-allowed') + ';';
      btn.disabled = !hasSessions;

      var track = document.createElement('div');
      track.style.cssText = [
        'position:relative;width:30px;height:16px;border-radius:3px;',
        'background:' + (isPanelOpen ? 'linear-gradient(180deg,var(--jules-secondary) 0%,var(--jules-accent) 100%)' : (st.isDark ? 'linear-gradient(180deg,#1a3247 0%,#1e3a55 100%)' : 'linear-gradient(180deg,#c0c0c0 0%,#d4d4d4 100%)')) + ';',
        'box-shadow:' + (isPanelOpen ? 'inset 0 2px 3px rgba(0,0,0,0.35),inset 0 -1px 1px rgba(255,255,255,0.12),0 0 6px rgba(10,110,130,0.3)' : 'inset 0 2px 3px rgba(0,0,0,0.22),inset 0 -1px 1px rgba(255,255,255,0.1)') + ';',
        'border:' + (isPanelOpen ? '1px solid #076575' : '1px solid ' + T.border) + ';',
        'transition:background 0.2s,border-color 0.2s;',
        'display:flex;align-items:center;justify-content:space-between;padding:0 3px;overflow:hidden;',
      ].join('');

      // Grid lines decoration
      var leftLines = document.createElement('div');
      leftLines.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
      leftLines.innerHTML = '<div style="width:4px;height:1px;background:rgba(255,255,255,0.3);border-radius:1px;"></div>'.repeat(3);
      track.appendChild(leftLines);

      var rightLines = document.createElement('div');
      rightLines.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
      rightLines.innerHTML = '<div style="width:4px;height:1px;background:rgba(0,0,0,0.15);border-radius:1px;"></div>'.repeat(3);
      track.appendChild(rightLines);

      // Thumb
      var thumb = document.createElement('div');
      thumb.style.cssText = [
        'position:absolute;top:2px;',
        'left:' + (isPanelOpen ? '15px' : '2px') + ';',
        'width:11px;height:10px;border-radius:2px;',
        'background:linear-gradient(180deg,#ffffff 0%,#e4e4e4 100%);',
        'box-shadow:0 1px 2px rgba(0,0,0,0.38),inset 0 1px 0 rgba(255,255,255,0.9);',
        'transition:left 0.18s cubic-bezier(0.4,0,0.2,1);',
        'display:flex;align-items:center;justify-content:center;',
      ].join('');
      thumb.innerHTML = '<div style="display:flex;flex-direction:column;gap:2px;">' + '<div style="width:5px;height:1px;background:rgba(0,0,0,0.18);border-radius:1px;"></div>'.repeat(3) + '</div>';

      track.appendChild(thumb);
      btn.appendChild(track);
      btn.addEventListener('click', () => {
        if (!hasSessions) return;
        // 1. Thumb animate et
        var isPanelNew = !this._st.isPanelOpen;
        thumb.style.left = isPanelNew ? '15px' : '2px';
        // 2. Transition bittikten sonra rebuild
        setTimeout(() => {
          this._handleTogglePanel();
        }, 220);
      });
      return btn;
    }

    // ─── Analog Switches ──────────────────────────────────────────────────────

    _buildPinSwitch() {
      var T  = this._T();
      var st = this._st;
      var isPinned = st.isPinnedRight;

      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;';

      var tooltip = document.createElement('div');
      tooltip.className = 'jw-tooltip';
      tooltip.innerHTML = '<div class="jw-tooltip-arrow" style="background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';border-left:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';border-top:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';"></div>' +
        '<div class="jw-tooltip-body" style="background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';color:' + (st.isDark ? '#cfe8f4' : 'var(--jules-primary)') + ';border:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';box-shadow:0 4px 14px rgba(0,0,0,' + (st.isDark ? '0.28' : '0.10') + ');">' + (isPinned ? 'Tam ekrana dön' : 'Sağa yapıştır') + '</div>';
      wrap.appendChild(tooltip);

      var btn = document.createElement('button');
      btn.id = 'jw-pin-switch';
      btn.className = 'jw-btn';
      btn.style.cssText = 'position:relative;width:47px;height:23px;border-radius:12px;flex-shrink:0;';

      var track = document.createElement('div');
      track.style.cssText = [
        'position:absolute;inset:0;border-radius:12px;',
        'background:' + (isPinned ? 'linear-gradient(to right,var(--jules-accent) 0%,var(--jules-secondary) 100%)' : (st.isDark ? 'linear-gradient(to right,#2e5a72 0%,#244a5e 100%)' : 'linear-gradient(to right,#f3f4f6 0%,#e5e7eb 100%)')) + ';',
        'border:' + (isPinned ? '1.5px solid var(--jules-accent)' : (st.isDark ? '1.5px solid #2e5269' : '1.5px solid #c5c9d0')) + ';',
        'box-shadow:' + (isPinned ? '0 2px 6px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.22)' : (st.isDark ? '0 2px 6px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.12)' : '0 2px 5px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.9)')) + ';',
        'display:flex;align-items:center;justify-content:space-between;padding:0 6px;overflow:hidden;',
        'transition:background 0.35s ease,border-color 0.35s ease,box-shadow 0.35s ease;',
      ].join('');

      // Monitor (sol): tam ekranda teal, pinned'da beyaz (dark) / mevcut light rengi
      var monIco = document.createElement('span');
      monIco.style.cssText = [
        'flex-shrink:0;z-index:1;display:inline-flex;transition:color 0.3s,opacity 0.3s;',
        'color:' + (st.isDark ? (!isPinned ? 'var(--jules-accent-light)' : 'rgba(255,255,255,0.75)') : '#374151') + ';',
        'opacity:' + (st.isDark ? '1' : (isPinned ? '0.75' : '1')) + ';',
      ].join('');
      monIco.innerHTML = ICO.Monitor(10);
      track.appendChild(monIco);

      // SidebarSimple (sağ): pinned'da teal, tam ekranda beyaz (dark) / mevcut light rengi
      var sideIco = document.createElement('span');
      sideIco.style.cssText = [
        'flex-shrink:0;z-index:1;display:inline-flex;transition:color 0.3s,opacity 0.3s;transform:scaleX(-1);',
        'color:' + (st.isDark ? (isPinned ? 'var(--jules-accent-light)' : 'rgba(255,255,255,0.75)') : '#5a6a78') + ';',
        'opacity:' + (st.isDark ? '1' : (isPinned ? '1' : '0.88')) + ';',
      ].join('');
      sideIco.innerHTML = ICO.SidebarSimple(10);
      track.appendChild(sideIco);
      btn.appendChild(track);

      var thumb = document.createElement('div');
      thumb.style.cssText = [
        'position:absolute;top:4px;',
        'left:' + (isPinned ? '25px' : '4px') + ';',
        'width:16px;height:16px;border-radius:8px;',
        'background:' + (isPinned ? 'linear-gradient(135deg,var(--jules-accent) 0%,var(--jules-secondary) 100%)' : (st.isDark ? 'linear-gradient(135deg,#2a4a5e 0%,#1e3a4f 100%)' : 'linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%)')) + ';',
        'box-shadow:' + (isPinned ? '0 2px 6px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.22)' : (st.isDark ? '0 2px 5px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.08)' : '0 2px 5px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.9)')) + ';',
        'transition:left 0.32s cubic-bezier(0.4,0,0.2,1),background 0.35s ease;',
        'display:flex;align-items:center;justify-content:center;z-index:2;',
      ].join('');
      thumb.innerHTML = '<span style="display:inline-flex;color:rgba(255,255,255,0.9);">' + (isPinned ? ICO.SidebarSimple(8) : ICO.Monitor(8)) + '</span>';
      btn.appendChild(thumb);

      btn.addEventListener('mouseenter', () => { tooltip.classList.add('jw-tooltip-show'); });
      btn.addEventListener('mouseleave', () => { tooltip.classList.remove('jw-tooltip-show'); });
      btn.addEventListener('click', () => {
        // 1. Thumb animate et
        var isPinnedNew = !this._st.isPinnedRight;
        thumb.style.left = isPinnedNew ? '25px' : '4px';
        thumb.innerHTML = '<span style="display:inline-flex;color:rgba(255,255,255,0.9);">' + (isPinnedNew ? ICO.SidebarSimple(8) : ICO.Monitor(8)) + '</span>';
        // 2. Transition bittikten sonra rebuild
        setTimeout(() => {
          this._handleTogglePinned();
        }, 340);
      });
      wrap.appendChild(btn);
      return wrap;
    }

    _buildDarkSwitch() {
      var st = this._st;

      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;';

      var tooltip = document.createElement('div');
      tooltip.className = 'jw-tooltip';
      tooltip.innerHTML = '<div class="jw-tooltip-arrow" style="background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';border-left:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';border-top:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';"></div>' +
        '<div class="jw-tooltip-body" style="background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';color:' + (st.isDark ? '#cfe8f4' : 'var(--jules-primary)') + ';border:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';box-shadow:0 4px 14px rgba(0,0,0,' + (st.isDark ? '0.28' : '0.10') + ');">' + (st.isDark ? 'Açık moda geç' : 'Koyu moda geç') + '</div>';
      wrap.appendChild(tooltip);

      var btn = document.createElement('button');
      btn.id = 'jw-dark-switch';
      btn.className = 'jw-btn';
      btn.style.cssText = 'position:relative;width:47px;height:23px;border-radius:12px;flex-shrink:0;';

      var track = document.createElement('div');
      track.style.cssText = [
        'position:absolute;inset:0;border-radius:12px;overflow:hidden;',
        'background:' + (st.isDark ? 'linear-gradient(135deg,#0b1822 0%,#1c3d54 100%)' : 'linear-gradient(135deg,#fffbeb 0%,#fde68a 100%)') + ';',
        'border:' + (st.isDark ? '1.5px solid #2a4a5e' : '1.5px solid #fcd34d') + ';',
        'box-shadow:' + (st.isDark ? 'inset 0 2px 5px rgba(0,0,0,0.6),0 0 10px rgba(77,196,206,0.08)' : 'inset 0 2px 5px rgba(0,0,0,0.05),0 0 8px rgba(251,191,36,0.25)') + ';',
        'display:flex;align-items:center;justify-content:space-between;padding:0 6px;',
        'transition:background 0.35s ease,border-color 0.35s ease,box-shadow 0.35s ease;',
      ].join('');

      // Stars/dots
      if (st.isDark) {
        track.innerHTML = '<div style="position:absolute;top:4px;left:14px;width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,0.5);"></div><div style="position:absolute;top:8px;left:20px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(255,255,255,0.35);"></div><div style="position:absolute;top:5px;left:26px;width:1px;height:1px;border-radius:50%;background:rgba(255,255,255,0.4);"></div>';
      } else {
        track.innerHTML = '<div style="position:absolute;top:3px;right:9px;width:2px;height:2px;border-radius:50%;background:rgba(245,158,11,0.5);"></div><div style="position:absolute;bottom:3px;right:14px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(245,158,11,0.4);"></div>';
      }

      var sunIco = document.createElement('span');
      sunIco.style.cssText = 'color:' + (st.isDark ? '#3d6880' : '#f59e0b') + ';opacity:' + (st.isDark ? '0.3' : '1') + ';flex-shrink:0;z-index:1;display:inline-flex;transition:opacity 0.3s,color 0.3s;';
      sunIco.innerHTML = ICO.Sun(11, 'fill');
      track.appendChild(sunIco);

      var moonIco = document.createElement('span');
      moonIco.style.cssText = 'color:' + (st.isDark ? '#4dc4ce' : '#a78bfa') + ';opacity:' + (st.isDark ? '1' : '0.4') + ';flex-shrink:0;z-index:1;display:inline-flex;transition:opacity 0.3s,color 0.3s;';
      moonIco.innerHTML = ICO.Moon(11, 'fill');
      track.appendChild(moonIco);
      btn.appendChild(track);

      var thumb = document.createElement('div');
      thumb.style.cssText = [
        'position:absolute;top:4px;',
        'left:' + (st.isDark ? '25px' : '4px') + ';',
        'width:16px;height:16px;border-radius:8px;',
        'background:' + (st.isDark ? 'linear-gradient(135deg,#1ba3b8 0%,#0a6e82 100%)' : 'linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%)') + ';',
        'box-shadow:' + (st.isDark ? '0 2px 6px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.18)' : '0 2px 6px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.9)') + ';',
        'transition:left 0.32s cubic-bezier(0.4,0,0.2,1),background 0.35s ease,box-shadow 0.35s ease;',
        'display:flex;align-items:center;justify-content:center;z-index:2;',
      ].join('');
      thumb.innerHTML = '<span style="display:inline-flex;color:rgba(255,255,255,0.9);">' + (st.isDark ? ICO.Moon(9, 'fill') : ICO.Sun(9, 'fill')) + '</span>';
      btn.appendChild(thumb);

      btn.addEventListener('mouseenter', () => { tooltip.classList.add('jw-tooltip-show'); });
      btn.addEventListener('mouseleave', () => { tooltip.classList.remove('jw-tooltip-show'); });
      btn.addEventListener('click', () => {
        // 1. Thumb'u önce animate et (CSS transition çalışması için element varolmalı)
        var isDarkNew = !this._st.isDark;
        thumb.style.left = isDarkNew ? '25px' : '4px';
        thumb.innerHTML = '<span style="display:inline-flex;color:rgba(255,255,255,0.9);">' + (isDarkNew ? ICO.Moon(9, 'fill') : ICO.Sun(9, 'fill')) + '</span>';
        // 2. Transition bittikten sonra tam rebuild
        setTimeout(() => {
          this._st.isDark = isDarkNew;
          this.dispatchEvent(new CustomEvent('jules:darkchange', { detail: { isDark: this._st.isDark } }));
          this._applyTheme(); // CSS cascade + hedefli rebuild — tam _build() gerekmez
        }, 340);
      });
      wrap.appendChild(btn);
      return wrap;
    }

    // ─── Content Panel ────────────────────────────────────────────────────────

    _buildContentPanel() {
      var T  = this._T();
      var st = this._st;

      var cp = document.createElement('div');
      cp.id = 'jw-content';
      cp.style.background = 'transparent';
      cp.style.transition = 'background 0.3s';

      // CP Header
      var cpHeader = document.createElement('div');
      cpHeader.id = 'jw-cp-header';
      cpHeader.style.cssText = 'padding:' + (st.isMobile ? '8px 14px' : '14px 20px') + ';background:' + T.bgHeader + ';border-bottom:1px solid ' + T.border + ';flex-shrink:0;backdrop-filter:blur(8px);';

      var cpHRow = document.createElement('div');
      cpHRow.style.cssText = 'display:flex;align-items:center;gap:8px;';

      // Close CP button
      var cpClose = document.createElement('button');
      cpClose.className = 'jw-btn';
      cpClose.title = 'Sonuçları gizle';
      cpClose.innerHTML = ICO.ChevronRight(14);
      cpClose.style.cssText = 'width:24px;height:24px;border-radius:8px;border:1px solid ' + T.accentDimBdr + ';background:' + T.accentDimBg + ';color:' + T.accentColor + ';flex-shrink:0;transition:background 0.15s,color 0.15s;';
      cpClose.addEventListener('mouseenter', () => { cpClose.style.background = 'var(--jules-secondary)'; cpClose.style.color = '#fff'; cpClose.style.borderColor = 'var(--jules-secondary)'; });
      cpClose.addEventListener('mouseleave', () => { var TT = this._T(); cpClose.style.background = TT.accentDimBg; cpClose.style.color = TT.accentColor; cpClose.style.borderColor = TT.accentDimBdr; });
      cpClose.addEventListener('click', () => this._handleClosePanel());
      cpHRow.appendChild(cpClose);

      // Divider
      var divider = document.createElement('div');
      divider.style.cssText = 'width:1px;height:16px;background:' + T.border + ';flex-shrink:0;';
      cpHRow.appendChild(divider);

      // Stats + Favorites
      var cpStats = document.createElement('div');
      cpStats.style.cssText = 'display:flex;align-items:center;gap:8px;min-width:0;flex:1;justify-content:flex-end;';

      var sparkIco = document.createElement('span');
      sparkIco.style.cssText = 'color:' + T.accentColor + ';flex-shrink:0;display:inline-flex;';
      sparkIco.innerHTML = ICO.Sparkles(10);
      cpStats.appendChild(sparkIco);

      var aiLabel = document.createElement('span');
      aiLabel.style.cssText = 'font-size:10px;font-weight:600;color:' + T.accentColor + ';letter-spacing:0.08em;white-space:nowrap;';
      aiLabel.textContent = 'SONUÇLAR';
      cpStats.appendChild(aiLabel);

      var dot = document.createElement('span');
      dot.style.cssText = 'font-size:9px;color:' + T.border + ';';
      dot.textContent = '·';
      cpStats.appendChild(dot);

      var totalResults = st.panelSessions.reduce((s, sess) => s + sess.cards.length, 0);
      var statsSpan = document.createElement('span');
      statsSpan.style.cssText = 'font-size:11px;color:' + T.textMuted + ';white-space:nowrap;';
      statsSpan.textContent = st.panelSessions.length + ' cevap · ' + totalResults + ' sonuç';
      cpStats.appendChild(statsSpan);

      // Favorites toggle
      var favCount = this._getFavCount();
      var favBtn = document.createElement('button');
      favBtn.className = 'jw-btn';
      favBtn.dataset.cpFavBtn = '1'; // hedefli güncelleme için marker
      var isFavActive = st.showFavoritesInPanel;
      favBtn.style.cssText = 'display:flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:600;letter-spacing:0.02em;border:' + ((isFavActive || favCount > 0) ? '1px solid #f87171' : '1px solid ' + T.border) + ';background:' + ((isFavActive || favCount > 0) ? (st.isDark ? 'rgba(248,113,113,0.1)' : '#fff5f5') : 'transparent') + ';color:' + ((isFavActive || favCount > 0) ? '#f87171' : T.textMuted) + ';transition:all 0.15s ease;font-family:inherit;flex-shrink:0;';
      favBtn.innerHTML = ICO.Heart(10, isFavActive || favCount > 0) + (favCount > 0 ? '<span>' + favCount + '</span>' : '');
      favBtn.addEventListener('mouseenter', () => { favBtn.style.borderColor = '#f87171'; favBtn.style.color = '#f87171'; });
      favBtn.addEventListener('mouseleave', () => {
        var TT = this._T(); var fc = this._getFavCount();
        favBtn.style.borderColor = (this._st.showFavoritesInPanel || fc > 0) ? '#f87171' : TT.border;
        favBtn.style.color = (this._st.showFavoritesInPanel || fc > 0) ? '#f87171' : TT.textMuted;
      });
      favBtn.addEventListener('click', () => { st.showFavoritesInPanel = !st.showFavoritesInPanel; this._build(); });
      cpStats.appendChild(favBtn);

      cpHRow.appendChild(cpStats);
      cpHeader.appendChild(cpHRow);
      cp.appendChild(cpHeader);

      // Sessions list
      var sessionList = document.createElement('div');
      sessionList.className = 'jw-scroll';
      sessionList.style.cssText = 'flex:1;min-height:0;overscroll-behavior:contain;';
      sessionList.style.colorScheme = st.isDark ? 'dark' : 'light';

      if (st.panelSessions.length === 0) {
        sessionList.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;text-align:center;padding:24px;"><div style="width:48px;height:48px;border-radius:12px;background:' + (st.isDark ? '#1a3247' : '#f3f4f6') + ';display:flex;align-items:center;justify-content:center;"><span style="color:' + T.textMuted + ';">' + ICO.Sparkles(18) + '</span></div><p style="font-size:14px;color:' + T.textMuted + ';">Henüz sonuç yok</p></div>';
      } else if (st.showFavoritesInPanel) {
        sessionList.appendChild(this._buildFavoritesSection());
      } else {
        st.panelSessions.forEach((sess, idx) => {
          sessionList.appendChild(this._buildSession(sess, idx === st.panelSessions.length - 1));
        });
      }

      var bottomPad = document.createElement('div');
      bottomPad.style.height = '16px';
      sessionList.appendChild(bottomPad);

      cp.appendChild(sessionList);

      // Scroll to active session
      if (st.activeCardMsgId) {
        setTimeout(() => {
          var el = sessionList.querySelector('[data-session-id="' + st.activeCardMsgId + '"]');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }

      return cp;
    }

    _buildFavoritesSection() {
      var T  = this._T();
      var st = this._st;
      var allFavs = this._getAllFavCards();

      var wrap = document.createElement('div');

      // Sticky label
      var label = document.createElement('div');
      label.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 20px;position:sticky;top:0;z-index:10;background:' + T.bgSticky + ';border-bottom:1px solid ' + T.border + ';';
      label.innerHTML = '<span style="display:inline-flex;color:#f87171;">' + ICO.Heart(10) + '</span>' +
        '<span style="font-size:10px;font-weight:600;letter-spacing:0.06em;color:#f87171;">FAVORİLERİM</span>' +
        '<div style="flex:1;height:1px;background:' + T.border + ';"></div>' +
        '<span style="font-size:10px;color:' + T.textMuted + ';">' + allFavs.length + ' kart</span>';
      wrap.appendChild(label);

      var grid = document.createElement('div');
      grid.style.cssText = 'padding:16px;';

      if (allFavs.length === 0) {
        grid.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 0;gap:12px;text-align:center;"><span style="color:' + T.border + ';">' + ICO.Heart(24) + '</span><p style="font-size:14px;color:' + T.textMuted + ';">Henüz favori eklemediniz</p></div>';
      } else {
        var cardGrid = document.createElement('div');
        cardGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);column-gap:12px;row-gap:35px;';
        allFavs.forEach(({ card, sessionId }) => {
          cardGrid.appendChild(this._buildCardView(card, sessionId, true));
        });
        grid.appendChild(cardGrid);
      }
      wrap.appendChild(grid);
      return wrap;
    }

    _buildSession(sess, isLast) {
      var T  = this._T();
      var st = this._st;
      var isActive = sess.id === st.activeCardMsgId;

      var wrap = document.createElement('div');
      wrap.setAttribute('data-session-id', sess.id);

      // Session header (sticky)
      var sHeader = document.createElement('div');
      sHeader.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 20px;position:sticky;top:0;z-index:10;background:' + T.bgSticky + ';border-bottom:1px solid ' + T.border + ';';

      var timeDiv = document.createElement('div');
      timeDiv.style.cssText = 'display:flex;align-items:center;gap:6px;';
      timeDiv.innerHTML = '<span style="display:inline-flex;color:' + (isActive ? T.accentColor : T.textMuted) + ';">' + ICO.Clock(10) + '</span>' +
        '<span style="font-size:10px;font-weight:600;letter-spacing:0.06em;color:' + (isActive ? T.accentColor : T.textMuted) + ';">' + formatTime(sess.timestamp) + '</span>';
      sHeader.appendChild(timeDiv);

      var line = document.createElement('div');
      line.style.cssText = 'flex:1;height:1px;background:' + T.border + ';';
      sHeader.appendChild(line);

      var titleSpan = document.createElement('span');
      titleSpan.style.cssText = 'font-size:10px;font-weight:600;letter-spacing:0.06em;color:' + (isActive ? T.accentColor : T.textMuted) + ';';
      titleSpan.textContent = sess.title.toLocaleUpperCase('tr-TR');
      sHeader.appendChild(titleSpan);

      if (isActive) {
        var activeDot = document.createElement('div');
        activeDot.style.cssText = 'width:6px;height:6px;border-radius:50%;background:' + T.accentColor + ';flex-shrink:0;';
        sHeader.appendChild(activeDot);
      }

      wrap.appendChild(sHeader);

      // Cards
      var cardsSection = document.createElement('div');
      cardsSection.style.cssText = 'padding:16px;';

      if (st.isMobile) {
        cardsSection.style.cssText = 'padding:0;';
        cardsSection.appendChild(this._buildCarousel(sess.cards, sess.id));
      } else {
        var grid = document.createElement('div');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);column-gap:12px;row-gap:35px;';
        sess.cards.forEach(card => {
          grid.appendChild(this._buildCardView(card, sess.id, st.likedCards.has(sess.id + '-' + card.id)));
        });
        cardsSection.appendChild(grid);
      }

      wrap.appendChild(cardsSection);

      return wrap;
    }

    // ─── Mobile Carousel ──────────────────────────────────────────────────────

    _buildCarousel(cards, sessionId) {
      var T  = this._T();
      var st = this._st;
      var activeIdx = st.activeCardIndices[sessionId] || 0;

      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:10px;';

      // Scroll container
      var scrollEl = document.createElement('div');
      scrollEl.className = 'jw-scroll-x';
      scrollEl.style.cssText = 'display:flex;width:100%;gap:12px;padding:0 14%;box-sizing:border-box;scroll-snap-type:x mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;';

      var cardEls = [];
      cards.forEach((card, i) => {
        var cardWrap = document.createElement('div');
        cardWrap.style.cssText = 'flex-shrink:0;width:72%;scroll-snap-align:center;';
        cardWrap.appendChild(this._buildCardView(card, sessionId, st.likedCards.has(sessionId + '-' + card.id)));
        cardEls.push(cardWrap);
        scrollEl.appendChild(cardWrap);
      });

      // Dots
      var dotsRow = document.createElement('div');
      dotsRow.style.cssText = 'display:flex;align-items:center;gap:6px;';
      var dotEls = cards.map((_, i) => {
        var dot = document.createElement('button');
        dot.className = 'jw-btn jw-dot' + (i === activeIdx ? ' active' : '');
        dot.style.cssText = 'width:' + (i === activeIdx ? '16px' : '6px') + ';height:6px;border-radius:3px;background:' + (i === activeIdx ? T.accentColor : (st.isDark ? '#3a6075' : '#9ca3af')) + ';transition:all 0.25s ease;';
        dot.addEventListener('click', () => {
          var el   = cardEls[i];
          var cx   = el.offsetLeft + el.offsetWidth / 2;
          var cw   = scrollEl.clientWidth;
          scrollEl.scrollTo({ left: cx - cw / 2, behavior: 'smooth' });
          st.activeCardIndices[sessionId] = i;
          this._updateDots(dotEls, i, T);
        });
        dotsRow.appendChild(dot);
        return dot;
      });

      // Scroll event
      scrollEl.addEventListener('scroll', () => {
        var center = scrollEl.scrollLeft + scrollEl.clientWidth / 2;
        var closest = 0; var closestD = Infinity;
        cardEls.forEach((el, i) => {
          var cx = el.offsetLeft + el.offsetWidth / 2;
          var d  = Math.abs(cx - center);
          if (d < closestD) { closestD = d; closest = i; }
        });
        if (closest !== st.activeCardIndices[sessionId]) {
          st.activeCardIndices[sessionId] = closest;
          this._updateDots(dotEls, closest, T);
        }
      });

      wrap.appendChild(scrollEl);
      wrap.appendChild(dotsRow);
      return wrap;
    }

    _updateDots(dotEls, activeIdx, T) {
      dotEls.forEach((dot, i) => {
        dot.style.width  = i === activeIdx ? '16px' : '6px';
        dot.style.background = i === activeIdx ? T.accentColor : (this._st.isDark ? '#3a6075' : '#9ca3af');
      });
    }

    // ─── Card View ────────────────────────────────────────────────────────────

    _buildCardView(card, sessionId, liked) {
      var T  = this._T();
      var st = this._st;
      var likeKey = sessionId + '-' + card.id;

      var wrap = document.createElement('div');
      wrap.className = 'jw-card-wrap';
      wrap.style.cssText = 'border-radius:3px;background:' + T.bgCard + ';border:1px solid ' + T.borderCard + ';overflow:hidden;display:flex;flex-direction:column;transition:background 0.3s,border-color 0.2s;';
      wrap.addEventListener('mouseenter', () => { wrap.style.borderColor = st.isDark ? '#2d5070' : '#b0b0b0'; });
      wrap.addEventListener('mouseleave', () => { wrap.style.borderColor = this._T().borderCard; });

      if (card.noImage) {
        // No-image variant
        var content = document.createElement('div');
        content.style.cssText = 'display:flex;flex-direction:column;flex:1;padding:12px;gap:10px;';

        // Badge + heart row
        var topRow = document.createElement('div');
        topRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';
        if (card.badge) {
          topRow.innerHTML = '<div style="display:flex;align-items:center;gap:6px;"><div style="width:2px;height:10px;background:var(--jules-accent-light);border-radius:1px;"></div><span style="font-size:9px;font-weight:700;letter-spacing:0.08em;color:var(--jules-accent-light);">' + esc(card.badge.toLocaleUpperCase('tr-TR')) + '</span></div>';
        } else {
          topRow.innerHTML = '<div></div>';
        }
        var heartBtn = this._buildHeartBtn(liked, likeKey);
        topRow.appendChild(heartBtn);
        content.appendChild(topRow);

        // Title
        var title = document.createElement('p');
        title.style.cssText = 'font-weight:600;font-size:12px;letter-spacing:-0.01em;color:' + T.textPrimary + ';line-height:1.4;';
        title.textContent = card.title;
        content.appendChild(title);

        // Description
        var descWrap = document.createElement('div');
        descWrap.style.cssText = 'flex:1;overflow:hidden;';
        var desc = document.createElement('p');
        desc.style.cssText = 'font-size:11px;color:' + T.textPrimary + ';line-height:1.6;display:-webkit-box;-webkit-line-clamp:11;-webkit-box-orient:vertical;overflow:hidden;';
        desc.textContent = card.description;
        descWrap.appendChild(desc);
        content.appendChild(descWrap);

        // CTA
        content.appendChild(this._buildCtaBtn(card));
        wrap.appendChild(content);
      } else {
        // Photo variant
        var imgWrap = document.createElement('div');
        imgWrap.style.cssText = 'position:relative;overflow:hidden;aspect-ratio:4/3;';

        var img = document.createElement('img');
        img.className = 'jw-card-img';
        img.src = card.image;
        img.alt = card.title;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        img.onerror = () => { imgWrap.style.background = T.bgSticky; img.style.display = 'none'; };
        imgWrap.appendChild(img);

        var imgHeart = this._buildHeartBtn(liked, likeKey, true);
        imgHeart.style.position = 'absolute';
        imgHeart.style.bottom = '8px';
        imgHeart.style.right  = '8px';
        imgWrap.appendChild(imgHeart);

        wrap.appendChild(imgWrap);

        var contentBottom = document.createElement('div');
        contentBottom.style.cssText = 'display:flex;flex-direction:column;gap:10px;padding:12px;';
        var content = contentBottom;

        if (card.badge) {
          content.innerHTML = '<div style="display:flex;align-items:center;gap:6px;"><div style="width:2px;height:10px;background:var(--jules-accent-light);border-radius:1px;"></div><span style="font-size:9px;font-weight:700;letter-spacing:0.08em;color:var(--jules-accent-light);">' + esc(card.badge.toLocaleUpperCase('tr-TR')) + '</span></div>';
        }

        var title = document.createElement('p');
        title.style.cssText = 'font-weight:600;font-size:12px;letter-spacing:-0.01em;color:' + T.textPrimary + ';line-height:1.3;';
        title.textContent = card.title;
        content.appendChild(title);

        var desc = document.createElement('p');
        desc.style.cssText = 'font-size:11px;color:' + T.textPrimary + ';line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;';
        desc.textContent = card.description;
        content.appendChild(desc);

        content.appendChild(this._buildCtaBtn(card));
        wrap.appendChild(content);
      }

      return wrap;
    }

    _buildHeartBtn(liked, likeKey, onImg) {
      var btn = document.createElement('button');
      btn.className = 'jw-btn';
      btn.dataset.likeKey = likeKey;           // hedefli DOM güncellemesi için
      btn.dataset.onImg   = onImg ? '1' : '0'; // renk varyantı
      btn.style.cssText = 'background:transparent;width:24px;height:24px;flex-shrink:0;';

      var hs = onImg ? 16 : 14; // heartSize
      btn.innerHTML = heartHtml(hs, liked, false, !!onImg);

      btn.addEventListener('mouseenter', () => {
        if (!this._st.likedCards.has(likeKey)) btn.innerHTML = heartHtml(hs, false, true, !!onImg);
      });
      btn.addEventListener('mouseleave', () => {
        if (!this._st.likedCards.has(likeKey)) btn.innerHTML = heartHtml(hs, false, false, !!onImg);
      });
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._handleLike(likeKey);
      });
      return btn;
    }

    _buildCtaBtn(card) {
      var T  = this._T();
      var st = this._st;
      var btn = document.createElement('button');
      btn.className = 'jw-btn';
      btn.style.cssText = 'display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;letter-spacing:0.03em;padding:4px 8px;border-radius:3px;border:1px solid ' + (st.isDark ? '#2a4a5e' : '#d1d5db') + ';color:' + (st.isDark ? '#6fa8bf' : '#555') + ';background:transparent;font-family:inherit;transition:all 0.15s;cursor:pointer;';
      btn.innerHTML = esc(card.cta || 'İncele') + ICO.ArrowUpRight(9);
      btn.addEventListener('mouseenter', () => {
        var TT = this._T();
        btn.style.borderColor = TT.accentColor;
        btn.style.background  = TT.accentColor;
        btn.style.color = 'white';
      });
      btn.addEventListener('mouseleave', () => {
        var TT = this._T();
        btn.style.borderColor = st.isDark ? '#2a4a5e' : '#d1d5db';
        btn.style.background  = 'transparent';
        btn.style.color = st.isDark ? '#6fa8bf' : '#555';
      });
      btn.addEventListener('click', () => {
        // Önce custom event gönder (host site dinleyebilir)
        if (card.productId) {
          this.dispatchEvent(new CustomEvent('jules:productclick', { detail: { productId: card.productId, card } }));
        }
        // Kart URL'si varsa yeni sekmede aç
        if (card.url) {
          window.open(card.url, '_blank', 'noopener noreferrer');
        }
      });
      return btn;
    }

    // ─── Favorites Drawer (mobile bottom sheet) ───────────────────────────────

    _buildFavDrawer() {
      var T  = this._T();
      var st = this._st;
      var allFavs = this._getAllFavCards();

      var backdrop = document.createElement('div');
      backdrop.id = 'jw-fav-backdrop';
      backdrop.addEventListener('click', () => { st.showFavDrawer = false; this._build(); });

      var drawer = document.createElement('div');
      drawer.id = 'jw-fav-drawer';
      drawer.className = 'jw-draw-in';
      drawer.style.background = st.isDark ? '#0c1c28' : '#ffffff';
      drawer.style.transform = 'translateY(' + st.drawerDragY + 'px)';
      drawer.addEventListener('click', e => e.stopPropagation());

      // Drag handle
      var handle = document.createElement('div');
      handle.style.cssText = 'display:flex;justify-content:center;padding:10px 0 8px;cursor:grab;touch-action:none;';
      handle.innerHTML = '<div style="width:36px;height:4px;border-radius:2px;background:' + T.border + ';"></div>';

      var dragStartY = 0;
      handle.addEventListener('touchstart', e => { dragStartY = e.touches[0].clientY; st.drawerDragY = 0; }, { passive: true });
      handle.addEventListener('touchmove', e => {
        var dy = e.touches[0].clientY - dragStartY;
        if (dy > 0) { st.drawerDragY = dy; drawer.style.transform = 'translateY(' + dy + 'px)'; }
      }, { passive: true });
      handle.addEventListener('touchend', () => {
        if (st.drawerDragY > 80) { st.showFavDrawer = false; st.drawerDragY = 0; this._build(); }
        else { st.drawerDragY = 0; drawer.style.transform = 'translateY(0)'; }
      });
      drawer.appendChild(handle);

      // Drawer header
      var dHeader = document.createElement('div');
      dHeader.style.cssText = 'padding:10px 16px 12px;border-bottom:1px solid ' + T.border + ';display:flex;align-items:center;justify-content:space-between;flex-shrink:0;';
      dHeader.innerHTML = '<div style="display:flex;align-items:center;gap:8px;"><span style="display:inline-flex;color:#f87171;">' + ICO.Heart(14) + '</span><span style="font-size:14px;font-weight:600;color:' + T.textPrimary + ';">Favorilerim</span>' +
        (allFavs.length > 0 ? '<span style="font-size:10px;font-weight:600;color:#f87171;background:' + (st.isDark ? 'rgba(248,113,113,0.12)' : '#fff5f5') + ';border:1px solid #fca5a5;border-radius:20px;padding:1px 7px;">' + allFavs.length + '</span>' : '') + '</div>';

      var closeDrawer = document.createElement('button');
      closeDrawer.className = 'jw-btn';
      closeDrawer.innerHTML = ICO.PhosphorX(16);
      closeDrawer.style.cssText = 'color:' + T.textMuted + ';background:' + (st.isDark ? '#1a3247' : '#f3f4f6') + ';border-radius:8px;padding:5px;';
      closeDrawer.addEventListener('click', () => { st.showFavDrawer = false; this._build(); });
      dHeader.appendChild(closeDrawer);
      drawer.appendChild(dHeader);

      // Drawer content
      var dContent = document.createElement('div');
      dContent.className = 'jw-scroll';
      dContent.style.cssText = 'flex:1;min-height:0;';

      if (allFavs.length === 0) {
        dContent.innerHTML = '<div style="padding:40px 24px;text-align:center;"><span style="color:' + T.border + ';display:inline-flex;margin-bottom:12px;">' + ICO.Heart(32) + '</span><p style="font-size:14px;color:' + T.textMuted + ';margin-bottom:6px;">Henüz favori eklemediniz</p><p style="font-size:12px;color:' + (st.isDark ? '#2a4a5e' : '#d1d5db') + ';">Kartların üzerindeki ♥ ikonuna dokunun</p></div>';
      } else {
        var grid = document.createElement('div');
        grid.style.cssText = 'padding:12px 14px 20px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px;';
        allFavs.forEach(({ card, sessionId }) => {
          grid.appendChild(this._buildCardView(card, sessionId, true));
        });
        dContent.appendChild(grid);
      }
      drawer.appendChild(dContent);
      backdrop.appendChild(drawer);
      return backdrop;
    }

    // ─── Event Handlers ───────────────────────────────────────────────────────

    _handleSend(text) {
      if (!text || !text.trim()) return;
      text = text.trim();
      this._st.inputValue = '';

      // Mobilde klavyeyi kapat (blur → focus kaybı → klavye kapanır)
      if (this._st.isMobile) {
        var ta = this._root && this._root.querySelector('textarea');
        if (ta) ta.blur();
      }

      var userMsg = { id: genId(), role: 'user', content: text, timestamp: new Date() };
      this._st.messages.push(userMsg);
      this._st.isTyping = true;
      this._build();

      var lower    = text.toLowerCase();
      var scenarios = (this._cards.scenarios || []);
      var datasets  = (this._cards.datasets  || {});
      var scenario  = scenarios.find(s => s.keywords && s.keywords.some(kw => lower.includes(kw)));
      var cards     = scenario ? datasets[scenario.dataset] : undefined;
      var replies   = this._config.defaultReplies || DEFAULT_CONFIG.defaultReplies;
      var delay     = 1200 + Math.random() * 800;

      clearTimeout(this._timers.reply);
      this._timers.reply = setTimeout(() => {
        this._st.isTyping = false;
        var botId  = genId();
        var botMsg = {
          id: botId, role: 'assistant',
          content:   scenario ? scenario.reply : replies[this._st.defaultReplyIndex++ % replies.length],
          timestamp: new Date(),
          hasCards:  !!cards,
          cardLabel: scenario ? scenario.cardLabel : undefined,
        };
        this._st.messages.push(botMsg);

        if (cards && scenario) {
          this._st.cardData[botId] = { cards, title: scenario.panelTitle };
          setTimeout(() => {
            this._st.activeCardMsgId = botId;
            var exists = this._st.panelSessions.find(s => s.id === botId);
            if (!exists) {
              this._st.panelSessions.push({ id: botId, cards, title: scenario.panelTitle, timestamp: new Date() });
            }
            if (!this._st.isMobile && !this._st.isPinnedRight) this._st.isPanelOpen = true;
            this._build();
          }, 300);
        } else {
          this._build();
        }
      }, delay);
    }

    _handleShowCards(msgId) {
      this._st.activeCardMsgId = msgId;
      this._st.isPanelOpen = true;
      var data = this._st.cardData[msgId];
      if (data) {
        var exists = this._st.panelSessions.find(s => s.id === msgId);
        if (!exists) {
          this._st.panelSessions.push({ id: msgId, ...data, timestamp: new Date() });
        }
      }
      this._build();
    }

    _handleClosePanel() {
      this._st.activeCardMsgId = null;
      this._st.isPanelOpen = false;
      this._build();
    }

    _handleTogglePanel() {
      if (this._st.isPanelOpen) {
        this._st.isPanelOpen = false;
        this._st.activeCardMsgId = null;
      } else if (this._st.panelSessions.length > 0) {
        this._st.isPanelOpen = true;
        if (!this._st.activeCardMsgId && this._st.panelSessions.length > 0) {
          this._st.activeCardMsgId = this._st.panelSessions[this._st.panelSessions.length - 1].id;
        }
      }
      this._build();
    }

    _handleTogglePinned() {
      this._st.isPinnedRight = !this._st.isPinnedRight;
      if (this._st.isPinnedRight) {
        this._st.isPanelOpen = false;
        this._st.activeCardMsgId = null;
      }
      this._build();
    }

    _handleLike(likeKey) {
      if (this._st.likedCards.has(likeKey)) this._st.likedCards.delete(likeKey);
      else this._st.likedCards.add(likeKey);
      var liked = this._st.likedCards.has(likeKey);
      this.dispatchEvent(new CustomEvent('jules:likechange', { detail: { likeKey, liked } }));

      // Hedefli DOM güncellemesi — likeKey'e ait tüm kalp butonlarını güncelle
      this._shadow.querySelectorAll('[data-like-key="' + likeKey + '"]').forEach(btn => {
        var onImg = btn.dataset.onImg === '1';
        var hs    = onImg ? 16 : 14;
        btn.innerHTML = heartHtml(hs, liked, false, onImg);
      });

      // Fav sayı rozetleri ve header güncelleme — bağımlı UI değiştiğinden minimal rebuild
      if (this._st.showFavoritesInPanel || this._st.showFavDrawer) {
        // Favoriler paneli/drawer açıksa tam rebuild gerekli
        this._build();
      } else {
        // Sadece header fav badge'leri güncelle (compact + CP header)
        var favCount = this._getFavCount();
        var T = this._T();
        // Compact header fav butonu
        var compactFavBtn = this._shadow.querySelector('[data-compact-fav-btn]');
        if (compactFavBtn) {
          compactFavBtn.style.color = favCount > 0 ? '#f87171' : T.textMuted;
          compactFavBtn.innerHTML   = ICO.Heart(16, favCount > 0) +
            (favCount > 0 ? '<span style="position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:#f87171;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;">' + favCount + '</span>' : '');
        }
        // CP header fav butonu
        var cpFavBtn = this._shadow.querySelector('[data-cp-fav-btn]');
        if (cpFavBtn) {
          var isActive = this._st.showFavoritesInPanel;
          cpFavBtn.style.color       = (isActive || favCount > 0) ? '#f87171' : T.textMuted;
          cpFavBtn.style.borderColor = (isActive || favCount > 0) ? '#f87171' : T.border;
          cpFavBtn.style.background  = (isActive || favCount > 0) ? (this._st.isDark ? 'rgba(248,113,113,0.1)' : '#fff5f5') : 'transparent';
          cpFavBtn.innerHTML = ICO.Heart(10, isActive || favCount > 0) + (favCount > 0 ? '<span>' + favCount + '</span>' : '');
        }
      }
    }

    _handleVote(msgId, vote) {
      var prev = this._st.votes[msgId];
      this._st.votes[msgId] = (prev === vote) ? null : vote;
      var newVote = this._st.votes[msgId];
      this.dispatchEvent(new CustomEvent('jules:vote', { detail: { msgId, vote: newVote } }));

      // Hedefli DOM güncellemesi — full _build() gereksiz, sadece 2 buton değişiyor
      var T = this._T();
      var upBtn = this._shadow.querySelector('[data-vote-up-id="' + msgId + '"]');
      if (upBtn) {
        var votedUp = newVote === 'up';
        upBtn.style.color = votedUp ? '#16a34a' : T.textMuted;
        upBtn.innerHTML   = ICO.ThumbsUp(11, votedUp);
      }
      var downBtn = this._shadow.querySelector('[data-vote-down-id="' + msgId + '"]');
      if (downBtn) {
        var votedDown = newVote === 'down';
        downBtn.style.color = votedDown ? '#dc2626' : T.textMuted;
        downBtn.innerHTML   = ICO.ThumbsDown(11, votedDown);
      }
    }

    _handleCopy(msgId, text) {
      // Kopyalama
      var fallback = (t) => {
        var ta = document.createElement('textarea');
        ta.value = t;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => fallback(text));
      } else { fallback(text); }

      // Hedefli DOM güncellemesi — _build() gereksiz, sadece copy butonu değişiyor
      this._st.copied = msgId;
      var btn = this._shadow.querySelector('[data-copy-id="' + msgId + '"]');
      if (btn) { btn.innerHTML = ICO.Check(11); btn.style.color = '#16a34a'; }

      clearTimeout(this._timers.copy);
      this._timers.copy = setTimeout(() => {
        this._st.copied = null;
        var b = this._shadow.querySelector('[data-copy-id="' + msgId + '"]');
        if (b) { b.innerHTML = ICO.Copy(11); b.style.color = this._T().textMuted; }
      }, 1800);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    _getFavCount() {
      var count = 0;
      this._st.panelSessions.forEach(s => {
        s.cards.forEach(c => {
          if (this._st.likedCards.has(s.id + '-' + c.id)) count++;
        });
      });
      return count;
    }

    _getAllFavCards() {
      var all = [];
      this._st.panelSessions.forEach(s => {
        s.cards.forEach(c => {
          if (this._st.likedCards.has(s.id + '-' + c.id)) all.push({ card: c, sessionId: s.id });
        });
      });
      return all;
    }

    _scrollToBottom() {
      clearTimeout(this._timers.scroll);
      this._timers.scroll = setTimeout(() => {
        var bottom = this._shadow.getElementById('jw-bottom');
        if (bottom) bottom.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }

    // ─── Emoji Cycling ────────────────────────────────────────────────────────

    _startEmojiCycle() {
      var self = this;
      var step = () => {
        self._timers.emoji1 = setTimeout(() => {
          self._st.emojiPhase = 'out';
          self._updateEmoji();
          self._timers.emoji2 = setTimeout(() => {
            self._st.emojiIndex = (self._st.emojiIndex + 1) % EMOJIS.length;
            self._st.emojiPhase = 'in';
            self._updateEmoji();
            self._timers.emoji3 = setTimeout(() => {
              self._st.emojiPhase = 'visible';
              self._updateEmoji();
              step(); // loop
            }, 180);
          }, 180);
        }, 1088);
      };
      step();
    }

    _updateEmoji() {
      var inner = this._shadow.getElementById('jw-emoji-inner');
      if (!inner) return;
      var cur = EMOJIS[this._st.emojiIndex];
      var ps  = this._getEmojiStyle(this._st.emojiPhase);
      if (cur === 'BOT_ICON') {
        inner.innerHTML = '<div style="' + ps + 'will-change:transform;"><div style="width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--jules-secondary);"><span style="color:white;">' + ICO.Bot(18) + '</span></div></div>';
      } else {
        inner.innerHTML = '<span style="font-size:28px;line-height:1;display:block;user-select:none;will-change:transform;' + ps + '">' + cur + '</span>';
      }
    }

    // ─── Weather ──────────────────────────────────────────────────────────────

    _fetchWeather() {
      var self = this;

      // Tam rebuild yerine yalnızca header'daki hava durumu satırını güncelle
      var applyWeather = function() {
        var wi      = self._st.weatherInfo;
        var dateRow = self._shadow.getElementById('jw-date-row');
        if (!dateRow) { self._build(); return; } // fallback: header DOM'da yoksa

        // Eski weather/sun satırlarını temizle
        var oldW = self._shadow.getElementById('jw-weather-row');
        var oldS = self._shadow.getElementById('jw-sun-row');
        if (oldW) oldW.remove();
        if (oldS) oldS.remove();

        // Yeni weather satırı
        var wRow = document.createElement('div');
        wRow.id = 'jw-weather-row';
        wRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
        wRow.innerHTML = weatherIconHtml(wi.code, 'var(--jw-accent-color)', 14) +
          '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + wi.temp + '°C</span>';
        dateRow.appendChild(wRow);

        // Güneş satırı (yalnızca masaüstü)
        var sunLabel = getSunLabel(wi);
        if (sunLabel && !self._st.isMobile) {
          var sunRow = document.createElement('div');
          sunRow.id = 'jw-sun-row';
          sunRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
          sunRow.innerHTML = '<span style="color:var(--jw-accent-color);display:inline-flex;">' + ICO.SunHorizon(12) + '</span>' +
            '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + sunLabel.label + '</span>';
          dateRow.appendChild(sunRow);
        }
      };

      var fallback = function() {
        self._st.weatherInfo = { temp: 13, code: 2, sunrise: '06:48', sunset: '18:23' };
        applyWeather();
      };

      if (!navigator.geolocation) { fallback(); return; }
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          var lat = pos.coords.latitude, lon = pos.coords.longitude;
          var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
            '&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto&forecast_days=1';
          fetch(url).then(function(r) { return r.json(); }).then(function(data) {
            self._st.weatherInfo = {
              temp:    Math.round(data.current.temperature_2m),
              code:    data.current.weather_code,
              sunrise: data.daily.sunrise[0].split('T')[1].slice(0, 5),
              sunset:  data.daily.sunset[0].split('T')[1].slice(0, 5),
            };
            applyWeather();
          }).catch(fallback);
        },
        fallback
      );
    }
  }

  // ══════════���════════════════════════════════════════════════════════════════
  // KAYIT
  // ═══════════════════════════════════════════════════════════════════════════

  if (!customElements.get('jules-widget')) {
    customElements.define('jules-widget', JulesWidget);
  }

  // Global erişim için
  global.JulesWidget = JulesWidget;

})(window);
