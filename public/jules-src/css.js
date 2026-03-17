/**
 * css.js — Shadow DOM stylesheet
 * Tüm CSS string'leri burada toplanır; esbuild bundle'a gömülür.
 */

// ── 1. CSS Variables ───────────────────────────────────────────────────────────
export const CSS_VARS = `
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
    /* ── Audit4 #14 (P3): Bot mesaj text rengi ── */
    --jw-bot-text:         #1f2937;
    /* ── MiniJules ── */
    --jw-mini-bg:          #f8f9f7;
    --jw-mini-inner-bg:    #ffffff;
    /* ── Form ── */
    --jw-form-bg:          #e8f3f8;
    --jw-form-section-bg:  #f4f9fc;
    --jw-form-input-bg:    #ffffff;
    --jw-form-border:      #b8d0de;
    --jw-form-label:       #6b8fa0;
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
    /* ── Audit4 #14 (P3): Bot mesaj text rengi ── */
    --jw-bot-text:         #cfe8f4;
    /* ── MiniJules ── */
    --jw-mini-bg:          #0c1c28;
    --jw-mini-inner-bg:    #132230;
    /* ── Form ── */
    --jw-form-bg:          #0d2235;
    --jw-form-section-bg:  #071722;
    --jw-form-input-bg:    #132d42;
    --jw-form-border:      #1e4360;
    --jw-form-label:       #5a90aa;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
`;

// ── 2. Animations & Keyframes ──────────────────────────────────────────────────
export const CSS_ANIMATIONS = `
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
    0%   { box-shadow: 0 0 0 1.5px rgba(239,68,68,0.85); }
    55%  { box-shadow: 0 0 0 1.5px rgba(239,68,68,0.12); }
    100% { box-shadow: 0 0 0 1.5px rgba(239,68,68,0.85); }
  }
  @keyframes jw-toast-in {
    from { opacity:0; transform:translateX(-50%) translateY(6px); }
    to   { opacity:1; transform:translateX(-50%) translateY(0); }
  }
  @keyframes jw-mini-appear {
    from { opacity:0; transform:translateY(-14px) scale(0.98); }
    to   { opacity:1; transform:translateY(0)     scale(1); }
  }
  @keyframes jw-mini-first-open {
    0%   { opacity:0; transform:translateY(-100vh); }
    20%  { opacity:1;                               }
    100% { opacity:1; transform:translateY(0);      }
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
    border-radius: 17px;
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
    border-radius: 17px;
  }
  .jw-mic-listening {
    animation: jw-mic-ring 1.1s ease-out infinite;
    background: rgba(239,68,68,0.10) !important;
  }
  @keyframes jw-mic-recording-blink {
    0%,  49% { opacity: 1; }
    50%, 100% { opacity: 0.18; }
  }
  .jw-mic-active-icon {
    animation: jw-mic-recording-blink 0.9s step-end infinite;
  }
  .jw-bounce-1 { animation: jw-bounce 1s infinite 0ms; }
  .jw-bounce-2 { animation: jw-bounce 1s infinite 150ms; }
  .jw-bounce-3 { animation: jw-bounce 1s infinite 300ms; }
  .jw-msg-in    { animation: jw-fadein 0.22s ease forwards; }
  .jw-slide-in  { animation: jw-slide-in 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
  .jw-draw-in   { animation: jw-draw-in 0.35s cubic-bezier(0.32,0.72,0,1) forwards; }
  @keyframes jw-eq-bar {
    0%, 100% { height: 3px; }
    50%       { height: 12px; }
  }
`;

// ── 3. Utilities ───────────────────────────────────────────────────────────────
export const CSS_UTILS = `
  /* ── Scrollbar: ince, çerçevesiz, scroll sırasında fade-in/out ── */
  /* Tüm shadow DOM içi 3px, track yok, thumb şeffaf */
  :host *::-webkit-scrollbar { width: 3px; height: 3px; }
  :host *::-webkit-scrollbar-track { background: transparent; border: none; box-shadow: none; }
  :host *::-webkit-scrollbar-corner { background: transparent; }
  :host *::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 3px;
    border: none;
    transition: background 0.65s ease; /* fade-out: yavaş */
  }
  /* Scroll aktifken: thumb görünür, geçiş hızlı */
  .jw-scrolling::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    transition: background 0.15s ease; /* fade-in: hızlı */
  }
  /* Firefox */
  :host * { scrollbar-width: thin; scrollbar-color: transparent transparent; }
  .jw-scrolling { scrollbar-color: #D1D5DB transparent; }

  /* Yatay scroll (chip bar) — gizli kalır */
  .jw-scroll-x::-webkit-scrollbar { display: none; }
  .jw-scroll-x { -ms-overflow-style: none; scrollbar-width: none; overflow-x: auto; overscroll-behavior-x: contain; }

  /* Dikey scroll kapsayıcılar — sadece overflow, scrollbar CSS global'den gelir */
  .jw-scroll { overflow-y: auto; overscroll-behavior-y: contain; }

  .jw-card-img { transition: transform 0.7s ease; }
  .jw-card-wrap:hover .jw-card-img { transform: scale(1.04); }

  .jw-btn { background: transparent; border: none; cursor: pointer; padding: 0; display: inline-flex; align-items: center; justify-content: center; }
  .jw-btn:focus-visible { outline: 2px solid var(--jules-accent); outline-offset: 2px; border-radius: 4px; }
`;

// ── 4. Layout ─────────────────────────────────────────────────────────────────
export const CSS_LAYOUT = `
  #jw-overlay {
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
    transition: background 0.3s;
  }
  #jw-overlay.jw-active { pointer-events: auto; }
  #jw-overlay.jw-open   { background: rgba(0,0,0,0.38); backdrop-filter: blur(2px); }
  #jw-overlay.jw-pinned { background: transparent; backdrop-filter: none; pointer-events: none; }

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

// ── 5. Components ────────────────────────────────────────────────────────────
export const CSS_COMPONENTS = `
  #jw-header {
    display: flex; align-items: center; gap: 12px;
    flex-shrink: 0;
    border-bottom: 1px solid var(--jw-border);
    transition: border-color 0.3s, background 0.3s;
  }

  #jw-messages {
    flex: 1; min-height: 0;
    padding: 16px;
    display: flex; flex-direction: column;
    gap: 16px;
  }

  #jw-suggestions {
    display: flex; gap: 8px;
    overflow-x: auto; flex-shrink: 0;
    padding: 0 16px;
    border-top: 1px solid var(--jw-sugg-border);
    transition: border-color 0.3s;
  }

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

  #jw-cp-header {
    flex-shrink: 0;
    border-bottom: 1px solid var(--jw-border);
    transition: border-color 0.3s, background 0.3s;
  }
`;

// ── 6. Overlays ───────────────────────────────────────────────────────────────
export const CSS_OVERLAYS = `
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

// ── 7. MiniJules ──────────────────────────────────────────────────────────────
export const CSS_MINI = `
  #jw-mini {
    position: fixed;
    z-index: 9998;
    pointer-events: auto;
    background: transparent;
    animation: jw-mini-appear 380ms cubic-bezier(0.34,1.2,0.64,1) forwards;
  }
  /* ── İlk açılış: tam ekrandan iniş ── */
  #jw-mini.jw-mini-first-open {
    animation: jw-mini-first-open 750ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  #jw-mini.jw-mini-center.jw-mini-first-open {
    transform-origin: top center;
  }
  #jw-mini.jw-mini-right.jw-mini-first-open {
    transform-origin: top right;
  }
  #jw-mini.jw-mini-center {
    top: 0; left: 0; right: 0;
    display: flex;
    justify-content: center;
    padding: 4px 16px;
  }
  #jw-mini.jw-mini-right {
    top: 0; right: 0;
    padding: 4px 12px;
    width: 390px;
    display: flex;
    justify-content: flex-end;
  }

  /* ── Row (orbit input + chevron) ── */
  #jw-mini-row {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 350px;
    max-width: calc(100vw - 32px);
  }
  #jw-mini.jw-mini-right #jw-mini-row { width: 100%; }

  /* ── Orbit wrapper ── */
  #jw-mini-orbit-wrap {
    position: relative;
    flex: 1;
    border-radius: 17px;
    padding: 1.5px;
    background: transparent;
    overflow: hidden;
    transition: background 0.2s;
    filter: drop-shadow(0 3px 12px rgba(0,0,0,0.16));
  }
  #jw-mini-orbit-bg {
    position: absolute; inset: 0; z-index: 0;
  }

  /* ── Inner input card ── */
  #jw-mini-inner {
    position: relative; z-index: 1;
    border-radius: 15.5px;
    background: var(--jw-mini-inner-bg);
    display: flex; flex-direction: row; align-items: center;
    gap: 4px;
    padding: 0 8px 0 12px;
    height: 24px;
    cursor: text;
    transition: background 0.3s;
  }

  /* ── Textarea ── */
  textarea.jw-mini-ta {
    flex: 1;
    background: transparent; border: none; outline: none;
    resize: none; font-family: inherit;
    font-size: 13px; color: var(--jw-text-primary);
    line-height: 1.4; overflow: hidden;
    padding: 0; cursor: pointer; caret-color: transparent;
    user-select: none; -webkit-user-select: none;
    touch-action: manipulation;
  }
  textarea.jw-mini-ta::placeholder { color: var(--jw-placeholder); }
  :host([data-dark]) textarea.jw-mini-ta::placeholder { color: #9bcfdf; }

  /* ── Mic button ── */
  .jw-mini-mic {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: none; cursor: pointer;
    padding: 2px; border-radius: 5px;
    color: var(--jw-text-muted); flex-shrink: 0;
    transition: color 0.15s, background 0.15s;
  }
  .jw-mini-mic:hover { color: var(--jules-secondary); background: rgba(27,163,184,0.08); }

  /* ── Send button ── */
  .jw-mini-send {
    display: flex; align-items: center; justify-content: center;
    background: var(--jules-secondary); border: none; cursor: pointer;
    padding: 3px 0; border-radius: 7px;
    width: 34px;
    color: white; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(10,110,130,0.28);
    transition: opacity 0.15s, transform 0.15s;
  }
  .jw-mini-send:hover  { opacity: 0.88; transform: scale(1.04); }
  .jw-mini-send:active { transform: scale(0.96); }

  /* ── Chevron — outside, transparent, teal ── */
  .jw-mini-chevron {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: none; cursor: pointer;
    padding: 6px; border-radius: 8px; flex-shrink: 0;
    color: var(--jules-secondary);
    opacity: 0.8;
    transition: color 0.15s, transform 0.2s, opacity 0.15s;
  }
  .jw-mini-chevron:hover  { color: var(--jules-accent); opacity: 1; transform: translateY(3px); }
  .jw-mini-chevron:active { transform: translateY(5px); }
`;

// ── 8. Inline Forms (Braun-inspired) ─────────────────────────────────────────
export const CSS_FORMS = `
  /* ── Dış kap ── */
  .jw-form {
    margin: 10px 0 0 38px;
    max-width: calc(100% - 38px);
    border: 1.5px solid var(--jw-border);
    border-radius: 5px;
    background: var(--jw-form-bg);
    overflow: hidden;
    animation: jw-fadein 0.28s ease forwards;
  }

  /* ── Başlık çubuğu ── */
  .jw-form-head {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border-bottom: 1.5px solid var(--jw-form-border);
    background: var(--jw-form-section-bg);
  }
  .jw-form-head-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--jw-accent-color);
    flex-shrink: 0;
  }
  .jw-form-head-label {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.18em;
    color: var(--jw-form-label);
  }

  /* ── Gövde ── */
  .jw-form-body {
    padding: 13px 14px;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  /* ── 2 sütun grid (adSoyad + eposta yan yana) ── */
  .jw-form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  /* ── Alan grubu ── */
  .jw-form-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .jw-form-label {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: var(--jw-form-label);
  }
  .jw-form-input,
  .jw-form-textarea {
    border: 1.5px solid var(--jw-form-border);
    border-radius: 3px;
    background: var(--jw-form-input-bg);
    color: var(--jw-text-primary);
    font-family: inherit;
    font-size: 12px;
    padding: 7px 9px;
    outline: none;
    transition: border-color 0.12s;
    resize: none;
    width: 100%;
  }
  .jw-form-input::placeholder,
  .jw-form-textarea::placeholder {
    color: var(--jw-placeholder);
    font-size: 11px;
  }
  .jw-form-input:focus,
  .jw-form-textarea:focus {
    border-color: var(--jw-accent-color);
  }
  .jw-form-textarea {
    min-height: 62px;
    max-height: 100px;
    overflow-y: auto;
  }
  .jw-form-input.jw-input-error,
  .jw-form-textarea.jw-input-error {
    border-color: #f87171 !important;
  }
  .jw-form-field-err {
    font-size: 9px;
    color: #f87171;
    letter-spacing: 0.02em;
    line-height: 1.4;
  }

  /* ── KVKK — tam genişlik, gövde padding'inden kaçarak kenarlara yaslanır ── */
  .jw-kvkk {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 9px 14px;
    border-top: 1.5px solid var(--jw-form-border);
    background: var(--jw-form-section-bg);
  }
  .jw-kvkk-check {
    width: 13px; height: 13px;
    flex-shrink: 0; margin-top: 2px;
    accent-color: var(--jw-accent-color);
    cursor: pointer;
  }
  .jw-kvkk-text {
    font-size: 10px;
    color: var(--jw-text-muted);
    line-height: 1.55;
    cursor: default;
  }
  .jw-kvkk-link {
    color: var(--jw-accent-color);
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }

  /* ── Alt çubuk (gönder) ── */
  .jw-form-foot {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 9px 14px;
    border-top: 1.5px solid var(--jw-form-border);
    background: var(--jw-form-section-bg);
    gap: 8px;
  }
  .jw-form-submit {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 15px;
    border-radius: 3px;
    background: var(--jules-primary);
    color: white;
    font-size: 8px;
    font-weight: 800;
    font-family: inherit;
    letter-spacing: 0.16em;
    cursor: pointer;
    border: none;
    transition: background 0.12s, transform 0.08s;
  }
  .jw-form-submit:hover:not(:disabled) { background: var(--jules-secondary); }
  .jw-form-submit:active:not(:disabled) { transform: scale(0.97); }
  .jw-form-submit:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
  }

  /* ── Başarı kartı ── */
  .jw-form-success {
    margin: 10px 0 0 38px;
    max-width: calc(100% - 38px);
    border: 1.5px solid rgba(22,163,74,0.28);
    border-radius: 5px;
    overflow: hidden;
    animation: jw-fadein 0.28s ease forwards;
  }
  .jw-form-success-head {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border-bottom: 1px solid rgba(22,163,74,0.18);
    background: rgba(22,163,74,0.06);
  }
  .jw-form-success-body {
    padding: 11px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: var(--jw-form-bg);
  }
  .jw-form-success-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .jw-form-success-lbl {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.13em;
    color: var(--jw-text-muted);
    min-width: 54px;
    flex-shrink: 0;
    padding-top: 2px;
  }
  .jw-form-success-val {
    font-size: 11px;
    color: var(--jw-text-primary);
    overflow-wrap: break-word;
    word-break: break-word;
    line-height: 1.5;
  }
`;

export const SHADOW_CSS =
  CSS_VARS + CSS_ANIMATIONS + CSS_UTILS + CSS_LAYOUT + CSS_COMPONENTS + CSS_OVERLAYS + CSS_MINI + CSS_FORMS;