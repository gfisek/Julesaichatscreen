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
         registerOrbitProperty } from './utils.js';
import { DEFAULT_CONFIG,
         DEFAULT_CARDS }       from './constants.js';

// ── Render modules ────────────────────────────────────────────────────────────
import * as renderChat     from './render-chat.js';
import * as renderInput    from './render-input.js';
import * as renderContent  from './render-content.js';
import * as handlers       from './handlers.js';
import * as helpers        from './helpers.js';

// ═══════════════════════════════════════════════════════════════════════════════
// JulesWidget — Web Component
// ═══════════════════════════════════════════════════════════════════════════════
class JulesWidget extends HTMLElement {

  static get observedAttributes() {
    return ['config-url', 'cards-url', 'open', 'dark'];
  }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._timers = {};
    this._resizeBound = debounce(this._onResize.bind(this), 120);

    // ── State ──────────────────────────────────────────────────────────────────
    this._st = {
      isOpen:              false,
      isMinimized:         true,   // Default: MiniJules görünür
      messages:            [],
      isTyping:            false,
      activeCardMsgId:     null,
      panelSessions:       [],
      cardData:            {},
      isPanelOpen:         false,
      isMobile:            window.innerWidth < 768,
      likedCards:          new Set(),
      isDark:              false,
      isPinnedRight:       false,
      emojiIndex:          0,
      emojiPhase:          'visible',   // 'visible' | 'out' | 'in'
      weatherInfo:         null,
      inputValue:          '',
      votes:               {},
      showFavDrawer:       false,
      showFavoritesInPanel: false,
      activeCardIndices:   {},
      defaultReplyIndex:   0,
      copied:              null,
      drawerDragY:         0,
      isListening:         false,
    };

    this._config = Object.assign({}, DEFAULT_CONFIG);
    this._cards  = Object.assign({}, DEFAULT_CARDS);

    this._bodyOverflow  = '';
    this._recognition   = null;
    this._preVoiceText  = '';
    this._refs          = {};
    this._twStop        = null;
    this._lastIsCompact = null;
    this._tCache        = null;    // _T() sonucu — CSS var ref'leri sabit, tek seferlik cache
    this._weatherAbort  = null;    // AbortController — fetch iptal için
    this._favCountCache = undefined; // _getFavCount() cache — like'da invalidate edilir
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────────
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
    if (this._weatherAbort) { this._weatherAbort.abort(); this._weatherAbort = null; }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // Guard: Shadow DOM henüz build edilmediyse işlem yapma
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

    if (box) {
      // Jules box'ı fiziksel ivmeyle yukarı fırlat
      box.style.transition = 'transform 350ms cubic-bezier(0.4,0,0.9,0.08), opacity 300ms ease';
      box.style.transform  = 'translateY(-160px)';
      box.style.opacity    = '0';

      // Overlay arka planını soldur
      if (overlay) {
        overlay.style.transition   = 'background 300ms ease, backdrop-filter 300ms ease';
        overlay.style.background   = 'transparent';
        overlay.style.backdropFilter = 'none';
        overlay.style.webkitBackdropFilter = 'none';
      }

      setTimeout(() => {
        this._st.isOpen      = false;
        this._st.isMinimized = true;
        document.body.style.overflow = this._bodyOverflow || '';
        this._bodyOverflow = '';
        this.dispatchEvent(new CustomEvent('jules:minimize'));
        this._build();
      }, 350);
    } else {
      this._st.isOpen      = false;
      this._st.isMinimized = true;
      document.body.style.overflow = this._bodyOverflow || '';
      this._bodyOverflow = '';
      this.dispatchEvent(new CustomEvent('jules:minimize'));
      this._build();
    }
  }

  // ── Expand: MiniJules'tan Jules'a yaylı spring ile aşağı iner ────────────
  expand() {
    if (!this._st.isMinimized) return;

    if (this._twStop) { this._twStop(); this._twStop = null; }

    this._st.isMinimized = false;
    this._st.isOpen      = true;
    this._bodyOverflow   = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    this._build();

    // Yukarıdan spring ile aşağı gelsin — fiziksel hissettirsin
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
  }

  // ── Data Loading ──────────────────────────────────────────────────────────────
  async _loadData() {
    const configUrl = this.getAttribute('config-url') || './jules-widget/config.json';
    const cardsUrl  = this.getAttribute('cards-url')  || './jules-widget/cards.json';
    try {
      const [cfgRes, cardsRes] = await Promise.all([fetch(configUrl), fetch(cardsUrl)]);
      if (cfgRes.ok)   this._config = await cfgRes.json();
      if (cardsRes.ok) this._cards  = await cardsRes.json();
    } catch (e) {
      console.warn('[JulesWidget] Config/cards yüklenemedi, varsayılanlar kullanılıyor:', e.message);
    }
    this._applyCSSVars();
  }

  _applyCSSVars() {
    const c    = this._config.colors || {};
    const f    = this._config.font   || {};
    const host = this._shadow.host;
    if (c.primary)     host.style.setProperty('--jules-primary',      c.primary);
    if (c.secondary)   host.style.setProperty('--jules-secondary',    c.secondary);
    if (c.accent)      host.style.setProperty('--jules-accent',       c.accent);
    if (c.accentLight) host.style.setProperty('--jules-accent-light', c.accentLight);
    if (c.accentBg)    host.style.setProperty('--jules-accent-bg',    c.accentBg);
    if (f.family)      host.style.setProperty('--jules-font',         f.family);
  }

  // ── CSS Injection ─────────────────────────────────────────────────────────────
  _injectCSS() {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(SHADOW_CSS);
    this._shadow.adoptedStyleSheets = [sheet];
  }

  // ── Theme ─────────────────────────────────────────────────────────────────────
  /**
   * _T() — CSS custom property referansları döndürür.
   * :host / :host([data-dark]) kuralları gerçek değerleri sağlar.
   *
   * Tüm değerler sabit CSS var() string'leri — tarayıcı cascade'de çözümlenir.
   * Nesne bir kez oluşturulur ve instance ömrü boyunca cache'de tutulur.
   */
  _T() {
    if (this._tCache) return this._tCache;
    this._tCache = {
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
    return this._tCache;
  }

  /**
   * _applyTheme: data-dark toggle → CSS cascade --jw-* token'ları günceller.
   * Yalnızca CSS variable dışı bağımlılıklar için hedefli DOM güncellemeleri yapılır.
   */
  _applyTheme() {
    const isDark = this._st.isDark;
    const host   = this._shadow.host;

    // 1. CSS cascade
    isDark ? host.setAttribute('data-dark', '') : host.removeAttribute('data-dark');

    // 2. colorScheme (scrollbar rengi)
    if (this._refs.msgs) this._refs.msgs.style.colorScheme = isDark ? 'dark' : 'light';
    const sessionList = this._shadow.querySelector('#jw-content > .jw-scroll');
    if (sessionList) sessionList.style.colorScheme = isDark ? 'dark' : 'light';

    // 3. Orbit ring sınıfı
    if (this._refs.inputOrbit) {
      this._refs.inputOrbit.className = isDark ? 'jw-orbit-dark' : 'jw-orbit-light';
    }
    // MiniJules orbit ring
    if (this._refs.miniOrbitBg) {
      this._refs.miniOrbitBg.className = isDark ? 'jw-orbit-dark' : 'jw-orbit-light';
    }

    // 4. Dark switch → yerinde yeniden kur
    const dsBtn = this._shadow.getElementById('jw-dark-switch');
    if (dsBtn && dsBtn.parentElement && dsBtn.parentElement.parentElement) {
      dsBtn.parentElement.parentElement.replaceChild(this._buildDarkSwitch(), dsBtn.parentElement);
    }

    // 5. Pin switch → yerinde yeniden kur
    const psBtn = this._shadow.getElementById('jw-pin-switch');
    if (psBtn && psBtn.parentElement && psBtn.parentElement.parentElement) {
      psBtn.parentElement.parentElement.replaceChild(this._buildPinSwitch(), psBtn.parentElement);
    }

    // 6. Panel toggle switch → track gradientleri isDark'a bağlı
    const ptBtn = this._shadow.getElementById('jw-panel-toggle-switch');
    if (ptBtn && ptBtn.parentElement) {
      ptBtn.parentElement.replaceChild(this._buildPanelToggleSwitch(), ptBtn);
    }
  }

  // ── Open/Close ────────────────────────────────────────────────────────────────
  _applyOpenState() {
    if (this._st.isMinimized) return; // MiniJules modu — overlay yok
    const ov = this._refs.overlay;
    if (!ov) return;
    const st = this._st;

    ov.classList.toggle('jw-active', st.isOpen);
    ov.classList.toggle('jw-open',   st.isOpen && !st.isPinnedRight);
    ov.classList.toggle('jw-pinned', st.isOpen && !!st.isPinnedRight);

    if (st.isOpen) {
      this._bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = this._bodyOverflow || '';
      this._bodyOverflow = '';
    }
  }

  // ── Resize ────────────────────────────────────────────────────────────────────
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

  // ── Main Build ────────────────────────────────────────────────────────────────
  _build() {
    const sh = this._shadow;
    const st = this._st;

    // ── Input area reuse logic ──
    const isCompact = st.isMobile || st.isPinnedRight;
    const canReuseInput = !st.isMinimized && this._refs.inputArea &&
      this._lastIsCompact === isCompact;

    // Stop typewriter only when input will be rebuilt
    if (!canReuseInput) {
      if (this._twStop) { this._twStop(); this._twStop = null; }
    }

    // Detach reusable input area before clearing Shadow DOM
    if (canReuseInput && this._refs.inputArea.isConnected) {
      this._refs.inputArea.remove();
    }

    sh.innerHTML = '';

    const T  = this._T();

    const host = this._shadow.host;
    st.isDark ? host.setAttribute('data-dark', '') : host.removeAttribute('data-dark');

    // ── MiniJules modu: sadece küçük bar ────────────────────────────────────
    if (st.isMinimized) {
      sh.appendChild(this._buildMiniJules());
      this._lastIsCompact = null;
      this._refs.contentPanel = null;
      this._refs.chatPanel = null;
      this._refs.inner = null;
      return;
    }

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'jw-overlay';
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

    // Fav drawer
    if (st.showFavDrawer) {
      sh.appendChild(this._buildFavDrawer());
    }

    this._lastIsCompact = isCompact;
    this._scrollToLastMessage();
  }
}

// ── Prototype mixin — render + handler + helper metodları ─────────────────────
Object.assign(JulesWidget.prototype, renderChat);
Object.assign(JulesWidget.prototype, renderInput);
Object.assign(JulesWidget.prototype, renderContent);
Object.assign(JulesWidget.prototype, handlers);
Object.assign(JulesWidget.prototype, helpers);

// ── Kayıt ─────────────────────────────────────────────────────────────────────
if (!customElements.get('jules-widget')) {
  customElements.define('jules-widget', JulesWidget);
}

window.JulesWidget = JulesWidget;