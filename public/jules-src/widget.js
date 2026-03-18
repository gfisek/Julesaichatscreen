/**
 * widget.js — JulesWidget Web Component (entry point)
 *
 * Build:
 *   npx esbuild public/jules-src/widget.js --bundle --format=iife --outfile=public/jules-widget.js
 *
 * Minify:
 *   npx esbuild public/jules-src/widget.js --bundle --format=iife --minify --outfile=public/jules-widget.min.js
 *
 * Watch (dev):
 *   npx esbuild public/jules-src/widget.js --bundle --format=iife --outfile=public/jules-widget.js --watch
 */

import { SHADOW_CSS }         from './css.js';
import { debounce,
         registerOrbitProperty,
         lockBodyScroll,
         unlockBodyScroll,
         forceUnlockBodyScroll } from './utils.js';
import { DEFAULT_CONFIG,
         DEFAULT_CARDS }       from './constants.js';

// ── Render modules ────────────────────────────────────────────────────────────
import * as renderChat     from './render-chat.js';
import * as renderInput    from './render-input.js';
import * as renderContent  from './render-content.js';
import * as handlers       from './handlers.js';
import * as helpers        from './helpers.js';
import * as renderForm     from './render-form.js';

// Mixin çakışma tespiti — yalnızca debug modunda çalışır (production'da console kirliliği önlenir)
(function checkMixinConflicts() {
  if (typeof location === 'undefined' || (!location.search.includes('jw-debug') && !location.hostname.includes('localhost'))) return;
  const modules = [renderChat, renderInput, renderContent, handlers, helpers, renderForm];
  const seen = new Set();
  modules.forEach(mod => {
    Object.keys(mod).forEach(key => {
      if (seen.has(key)) {
        console.warn('[JulesWidget] ⚠ Mixin çakışması: "' + key + '" birden fazla modülde tanımlı.');
      }
      seen.add(key);
    });
  });
})();

// ══════════════════════════════════════════════════════════════════════════════
// JulesWidget — Web Component
// ══════════════════════════════════════════════════════════════════════════════
class JulesWidget extends HTMLElement {

  static get observedAttributes() {
    return ['config-url', 'cards-url', 'open', 'dark'];
  }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._timers = {};
    this._resizeBound = debounce(this._onResize.bind(this), 120);

    // ── State ────────────────────────────────────────────────────────────────
    this._st = {
      isOpen:               false,
      isMinimized:          true,
      messages:             [],
      isTyping:             false,
      activeCardMsgId:      null,
      panelSessions:        [],
      cardData:             {},
      isPanelOpen:          false,
      isMobile:             window.innerWidth < 768,
      likedCards:           new Set(), // Set JSON serileştirilemez; persist için [...likedCards] kullan
      isDark:               false,
      isPinnedRight:        false,
      emojiIndex:           0,
      emojiPhase:           'visible',
      weatherInfo:          null,
      inputValue:           '',
      votes:                {},
      showFavDrawer:        false,
      showFavoritesInPanel: false,
      activeCardIndices:    {},
      defaultReplyIndex:    0,
      copied:               null,
      drawerDragY:          0,
      isListening:          false,
      kvkkAccepted:         false,
      submittedForms:       {},
      isSpeaking:           false,
    };

    this._config = Object.assign({}, DEFAULT_CONFIG);
    this._cards  = Object.assign({}, DEFAULT_CARDS);

    this._bodyOverflow         = '';
    this._recognition          = null;
    this._preVoiceText         = '';
    this._refs                 = {};
    this._twStop               = null;
    this._lastIsCompact        = null;
    this._tCache               = null;      // _T() sonucu — CSS var ref'leri sabit, tek seferlik cache
    this._weatherAbort         = null;      // AbortController — fetch iptal için
    this._favCountCache        = undefined; // _getFavCount() cache — like'da invalidate edilir
    this._focusTrapHandler     = null;
    this._escHandler           = null;
    this._pendingConsentAction = null;
    this._miniFirstOpen        = true;      // İlk miniJules açılışı için özel animasyon flag'i
    this._introShown           = false;     // Session intro animasyon flag'i
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────
  connectedCallback() {
    registerOrbitProperty();
    this._injectCSS();
    this._initScrollbarFade();
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
    // Tüm kayıtlı timer'ları (intro_seq_* dahil) temizle
    Object.keys(this._timers).forEach(k => clearTimeout(this._timers[k]));
    if (this._weatherAbort) { this._weatherAbort.abort(); this._weatherAbort = null; }
    if (this._scrollFadeHandler) {
      this._shadow.removeEventListener('scroll', this._scrollFadeHandler, { capture: true });
      this._scrollFadeHandler = null;
    }
    if (this._scrollFadeTimers) {
      this._scrollFadeTimers.forEach(timer => clearTimeout(timer));
      this._scrollFadeTimers.clear();
      this._scrollFadeTimers = null;
    }
    if (this._st.isOpen && !this._st.isMinimized) forceUnlockBodyScroll();
    this._removeFocusTrap();
    this._stopEmojiCycle();
    if (this._cleanupMobileKeyboard) { this._cleanupMobileKeyboard(); this._cleanupMobileKeyboard = null; }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._refs.overlay && !this._shadow.getElementById('jw-mini')) return;
    if (name === 'open') { newVal !== null ? this.open() : this.close(); }
    if (name === 'dark') { this._st.isDark = newVal !== null; this._applyTheme(); }
  }

  // ── Public API ───────────────────────────────────────────────────────────────
  open()   { this.expand(); }
  close()  { this.minimize(); }
  toggle() { this._st.isMinimized ? this.expand() : this.minimize(); }

  // ── Minimize: Jules yukarı kayarak MiniJules'a dönüşür ────────────────────
  minimize() {
    if (this._st.isMinimized) return;

    const box     = this._refs.box;
    const overlay = this._refs.overlay;

    this._removeFocusTrap();

    if (box) {
      box.style.transition = 'transform 350ms cubic-bezier(0.4,0,0.9,0.08), opacity 300ms ease';
      box.style.transform  = 'translateY(-160px)';
      box.style.opacity    = '0';

      if (overlay) {
        overlay.style.transition         = 'background 300ms ease, backdrop-filter 300ms ease';
        overlay.style.background         = 'transparent';
        overlay.style.backdropFilter     = 'none';
        overlay.style.webkitBackdropFilter = 'none';
      }

      clearTimeout(this._timers.minimize);
      this._timers.minimize = setTimeout(() => {
        this._st.isOpen      = false;
        this._st.isMinimized = true;
        unlockBodyScroll();
        this.dispatchEvent(new CustomEvent('jules:minimize'));
        this._build();
      }, 350);
    } else {
      this._st.isOpen      = false;
      this._st.isMinimized = true;
      unlockBodyScroll();
      this.dispatchEvent(new CustomEvent('jules:minimize'));
      this._build();
    }
  }

  // ── Expand: MiniJules'tan Jules'a yaylı spring ile aşağı iner ────────────
  expand() {
    if (!this._st.isMinimized) return;

    if (!this._introShown) {
      this._introShown = true;
      this._runIntroSequence();
      return;
    }

    if (this._twStop) { this._twStop(); this._twStop = null; }

    this._st.isMinimized = false;
    this._st.isOpen      = true;
    lockBodyScroll();

    this._build();

    const box = this._refs.box;
    if (box) {
      box.style.transform  = 'translateY(-160px)';
      box.style.opacity    = '0';
      box.style.transition = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          box.style.transition = 'transform 420ms cubic-bezier(0.34,1.28,0.64,1), opacity 280ms ease';
          box.style.transform  = 'translateY(0)';
          box.style.opacity    = '1';
        });
      });
    }

    this._installFocusTrap();
    this._startEmojiCycle();
    this._timers.expandFocus = setTimeout(() => {
      const first = this._shadow.querySelector('button:not([disabled])');
      if (first) first.focus();
    }, 450);
  }

  // ── Data Loading ─────────────────────────────────────────────────────────────
  async _loadData() {
    const configUrl = this.getAttribute('config-url') || './jules-widget/config.json';
    const cardsUrl  = this.getAttribute('cards-url')  || './jules-widget/cards.json';
    try {
      const [cfgRes, cardsRes] = await Promise.all([fetch(configUrl), fetch(cardsUrl)]);
      if (cfgRes.ok) {
        const cfg = await cfgRes.json();
        // Temel şema doğrulaması — Array veya primitive gelirse varsayılan korunur
        if (cfg && typeof cfg === 'object' && !Array.isArray(cfg)) {
          this._config = cfg;
        }
      }
      if (cardsRes.ok) {
        const cards = await cardsRes.json();
        // datasets ve scenarios varlığını doğrula — eksikse crash önlenir
        if (cards && typeof cards === 'object' && !Array.isArray(cards)) {
          this._cards = {
            datasets:  cards.datasets  && typeof cards.datasets  === 'object' ? cards.datasets  : {},
            scenarios: Array.isArray(cards.scenarios) ? cards.scenarios : [],
          };
        }
      }
    } catch (e) {
      console.warn('[JulesWidget] Config/cards yüklenemedi, varsayılanlar kullanılıyor:', e.message);
    }
    this._applyCSSVars();
  }

  // ── Config CSS değişkeni güvenli setter ────────────────────────────────────
  _applyCSSVars() {
    const VALID_COLOR = /^#[0-9a-fA-F]{3,8}$/;
    const VALID_FUNC  = /^(?:rgba?|hsla?)\s*\([0-9.,\s%]+\)$/i;
    const c    = this._config.colors || {};
    const f    = this._config.font   || {};
    const host = this._shadow.host;

    const setSafe = (prop, val) => {
      if (val && typeof val === 'string') {
        const v = val.trim();
        if (VALID_COLOR.test(v) || VALID_FUNC.test(v)) {
          host.style.setProperty(prop, v);
        }
      }
    };

    setSafe('--jules-primary',      c.primary);
    setSafe('--jules-secondary',    c.secondary);
    setSafe('--jules-accent',       c.accent);
    setSafe('--jules-accent-light', c.accentLight);
    setSafe('--jules-accent-bg',    c.accentBg);

    if (f.family && typeof f.family === 'string' && f.family.length < 200 && !/[<>"';{}()\\]/.test(f.family)) {
      host.style.setProperty('--jules-font', f.family);
    }
  }

  // ── CSS Injection ──────────────────────────────────────────────────────────
  _injectCSS() {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(SHADOW_CSS);
    this._shadow.adoptedStyleSheets = [sheet];
  }

  // ── Scrollbar fade: Shadow DOM içi scroll'larda .jw-scrolling class yönetimi
  _initScrollbarFade() {
    this._scrollFadeTimers = new Map();
    this._scrollFadeHandler = (e) => {
      const target = e.target;
      if (!target || typeof target.classList === 'undefined') return;

      target.classList.add('jw-scrolling');

      const existing = this._scrollFadeTimers.get(target);
      if (existing !== undefined) clearTimeout(existing);

      const timer = setTimeout(() => {
        target.classList.remove('jw-scrolling');
        this._scrollFadeTimers.delete(target);
      }, 800);

      this._scrollFadeTimers.set(target, timer);
    };
    this._shadow.addEventListener('scroll', this._scrollFadeHandler, { capture: true, passive: true });
  }

  // ── Theme ──────────────────────────────────────────────────────────────────
  _applyTheme() {
    const isDark = this._st.isDark;
    const host   = this._shadow.host;

    isDark ? host.setAttribute('data-dark', '') : host.removeAttribute('data-dark');

    if (this._refs.msgs) this._refs.msgs.style.colorScheme = isDark ? 'dark' : 'light';
    const sessionList = this._shadow.querySelector('#jw-content > .jw-scroll');
    if (sessionList) sessionList.style.colorScheme = isDark ? 'dark' : 'light';

    if (this._refs.inputOrbit)  this._refs.inputOrbit.className  = isDark ? 'jw-orbit-dark' : 'jw-orbit-light';
    if (this._refs.miniOrbitBg) this._refs.miniOrbitBg.className = isDark ? 'jw-orbit-dark' : 'jw-orbit-light';

    // Switch'leri _syncTheme ile güncelle — replaceChild yok, event listener korunur
    const dsWrap = this._shadow.getElementById('jw-dark-switch')?.parentElement;
    if (dsWrap?._syncTheme) {
      dsWrap._syncTheme(isDark);
    } else {
      const dsBtn = this._shadow.getElementById('jw-dark-switch');
      if (dsBtn?.parentElement?.parentElement) {
        dsBtn.parentElement.parentElement.replaceChild(this._buildDarkSwitch(), dsBtn.parentElement);
      }
    }

    const psWrap = this._shadow.getElementById('jw-pin-switch')?.parentElement;
    if (psWrap?._syncTheme) {
      psWrap._syncTheme(isDark);
    } else {
      const psBtn = this._shadow.getElementById('jw-pin-switch');
      if (psBtn?.parentElement?.parentElement) {
        psBtn.parentElement.parentElement.replaceChild(this._buildPinSwitch(), psBtn.parentElement);
      }
    }
  }

  // ── Resize ────────────────────────────────────────────────────────────────
  _onResize() {
    const wasMobile = this._st.isMobile;
    this._st.isMobile = window.innerWidth < 768;
    if (wasMobile !== this._st.isMobile) {
      if (this._st.isMobile && this._st.isPanelOpen) {
        this._st.isPanelOpen = false;
        this._st.activeCardMsgId = null;
      }
      this._build();
    }
  }

  // ── Main Build ────────────────────────────────────────────────────────────
  _build() {
    const sh = this._shadow;
    const st = this._st;

    const isCompact = st.isMobile || st.isPinnedRight;
    const canReuseInput = !st.isMinimized && this._refs.inputArea &&
      this._lastIsCompact === isCompact;

    if (!canReuseInput) {
      // twStart timer'ı iptal et — stale ta üzerinde typewriter leak'ini önler
      clearTimeout(this._timers.twStart);
      if (this._twStop) { this._twStop(); this._twStop = null; }
    }

    if (canReuseInput && this._refs.inputArea.isConnected) {
      this._refs.inputArea.remove();
    }

    sh.innerHTML = '';

    const T  = this._T();
    const host = this._shadow.host;
    st.isDark ? host.setAttribute('data-dark', '') : host.removeAttribute('data-dark');

    // MiniJules modu
    if (st.isMinimized) {
      sh.appendChild(this._buildMiniJules());
      this._lastIsCompact = null;
      this._refs.contentPanel = null;
      this._refs.chatPanel = null;
      this._refs.inner = null;
      return;
    }

    // Overlay — dialog semantiği (ekran okuyucular modalı tanır)
    const overlay = document.createElement('div');
    overlay.id = 'jw-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Jules AI Asistan');
    if (st.isOpen) {
      overlay.classList.add('jw-active');
      if (st.isPinnedRight) overlay.classList.add('jw-pinned');
      else                  overlay.classList.add('jw-open');
    }
    overlay.addEventListener('click', e => { if (e.target === overlay) this.close(); });
    this._refs.overlay = overlay;

    // Box
    const box = document.createElement('div');
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

    // Inner wrapper
    const inner = document.createElement('div');
    inner.style.cssText = 'display:flex;width:100%;height:100%;overflow:hidden;margin:0 auto;';
    if (isCompact) {
      inner.style.flexDirection = 'column';
      inner.style.maxWidth = '100%';
    } else {
      inner.style.flexDirection = 'row';
      inner.style.maxWidth = '1200px';
    }
    this._refs.inner = inner;

    // Content panel
    if (st.isPanelOpen && !st.isPinnedRight) {
      const cp = this._buildContentPanel();
      this._refs.contentPanel = cp;
      inner.appendChild(cp);
    } else {
      this._refs.contentPanel = null;
    }

    // Chat panel
    inner.appendChild(this._buildChatPanel());

    box.appendChild(inner);
    overlay.appendChild(box);
    sh.appendChild(overlay);

    if (st.showFavDrawer) {
      sh.appendChild(this._buildFavDrawer());
    }

    this._lastIsCompact = isCompact;
    this._scrollToLastMessage();

    // _build() sonrası focus trap restore — panel toggle ve resize sonrası kaybolmaması için
    if (!st.isMinimized && st.isOpen) {
      this._installFocusTrap();
    }
  }

  // ── Focus Trap — Shadow DOM uyumlu, dinamik element listeli ──────────────
  _installFocusTrap() {
    const overlay = this._refs.overlay;
    if (!overlay) return;

    const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // this._shadow.activeElement ile Shadow DOM'da doğru odak tespiti
    this._focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;
      const focusables = [...overlay.querySelectorAll(FOCUSABLE_SELECTOR)];
      if (!focusables.length) return;

      const active = this._shadow.activeElement;
      const first  = focusables[0];
      const last   = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (active === first || !focusables.includes(active)) { last.focus(); e.preventDefault(); }
      } else {
        if (active === last  || !focusables.includes(active)) { first.focus(); e.preventDefault(); }
      }
    };

    this._escHandler = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); this.close(); }
    };

    overlay.addEventListener('keydown', this._focusTrapHandler);
    overlay.addEventListener('keydown', this._escHandler);
  }

  _removeFocusTrap() {
    const overlay = this._refs.overlay;
    if (!overlay) return;
    overlay.removeEventListener('keydown', this._focusTrapHandler);
    overlay.removeEventListener('keydown', this._escHandler);
    this._focusTrapHandler = null;
    this._escHandler       = null;
  }
}

// ── Prototype mixin ───────────────────────────────────────────────────────────
Object.assign(JulesWidget.prototype, renderChat);
Object.assign(JulesWidget.prototype, renderInput);
Object.assign(JulesWidget.prototype, renderContent);
Object.assign(JulesWidget.prototype, handlers);
Object.assign(JulesWidget.prototype, helpers);
Object.assign(JulesWidget.prototype, renderForm);

// ── Kayıt ─────────────────────────────────────────────────────────────────────
if (!customElements.get('jules-widget')) {
  customElements.define('jules-widget', JulesWidget);
}

window.JulesWidget = JulesWidget;