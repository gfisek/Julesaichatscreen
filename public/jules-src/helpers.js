/**
 * helpers.js — Yardımcı widget metodları
 * _T · _makeAccentBtn · _buildEmptyFavsWrap
 * _getFavCount · _getAllFavCards · _scrollToBottom · _scrollToLastMessage
 * _startEmojiCycle · _stopEmojiCycle · _updateEmoji · _fetchWeather
 * ── Incremental DOM Updates ──
 * _patchMessages · _openContentPanel · _closeContentPanel
 * _patchHeader · _patchCardsButtons · _patchFormWidths
 * _showFavDrawerInc · _hideFavDrawer · _patchFavDrawer
 * _refreshContentPanelBody · _patchFormMessage · _runIntroSequence
 */
import { ICO }                              from './icons.js';
import { weatherIconHtml, getSunLabel,
         lockBodyScroll, esc }              from './utils.js';
import { EMOJIS }                           from './constants.js';

// ══════════════════════════════════════════════════════════════════════════════
// _T() — CSS custom property referans token'ları
// CSS var() stringleri Shadow DOM'da paint-time çözümlenir; tek seferlik cache.
// ══════════════════════════════════════════════════════════════════════════════
export function _T() {
  if (this._tCache) return this._tCache;
  this._tCache = {
    bg:            'var(--jw-bg)',
    bgHeader:      'var(--jw-header-bg)',
    bgSticky:      'var(--jw-sticky-bg)',
    bgCard:        'var(--jw-card-bg)',
    border:        'var(--jw-border)',
    borderCard:    'var(--jw-card-border)',
    textPrimary:   'var(--jw-text-primary)',
    textSecondary: 'var(--jw-text-secondary)',
    textMuted:     'var(--jw-text-muted)',
    accentColor:   'var(--jw-accent-color)',
    accentDimBg:   'var(--jw-accent-dim-bg)',
    accentDimBdr:  'var(--jw-accent-dim-bdr)',
    inputBg:       'var(--jw-input-bg)',
    userBubble:    'var(--jw-user-bubble)',
    userBubbleTxt: 'var(--jw-user-bubble-txt)',
    botText:       'var(--jw-bot-text)',
  };
  return this._tCache;
}

// ══════════════════════════════════════════════════════════════════════════════
// _makeAccentBtn — 24×24 accent icon button factory
// Header ve content panel'deki kapat/toggle butonları için ortak factory.
// Live-reads this._st.isDark in hover handlers → stale closure yok.
// ══════════════════════════════════════════════════════════════════════════════
export function _makeAccentBtn(icon, title) {
  const T    = this._T();
  const isDk = this._st.isDark;

  const btn = document.createElement('button');
  btn.className = 'jw-btn';
  btn.title = title;
  btn.setAttribute('aria-label', title);
  btn.innerHTML = icon;
  btn.style.cssText = [
    'width:24px;height:24px;border-radius:8px;flex-shrink:0;',
    'display:flex;align-items:center;justify-content:center;',
    'transition:background 0.15s,color 0.15s,border-color 0.15s;',
    'border:1px solid '  + (isDk ? 'var(--jules-secondary)' : T.accentDimBdr) + ';',
    'background:'        + (isDk ? 'var(--jules-secondary)' : T.accentDimBg)  + ';',
    'color:'             + (isDk ? '#ffffff'                : T.accentColor)   + ';',
  ].join('');

  btn.addEventListener('mouseenter', () => {
    const dk = this._st.isDark;
    btn.style.background  = dk ? 'rgba(77,196,206,0.18)'    : 'var(--jules-secondary)';
    btn.style.borderColor = dk ? 'rgba(77,196,206,0.32)'    : 'var(--jules-secondary)';
    btn.style.color       = dk ? 'var(--jules-accent-light)': '#ffffff';
  });
  btn.addEventListener('mouseleave', () => {
    const dk = this._st.isDark;
    const TT = this._T();
    btn.style.background  = dk ? 'var(--jules-secondary)'  : TT.accentDimBg;
    btn.style.borderColor = dk ? 'var(--jules-secondary)'  : TT.accentDimBdr;
    btn.style.color       = dk ? '#ffffff'                 : TT.accentColor;
  });
  return btn;
}

// ══════════════════════════════════════════════════════════════════════════════
// _buildEmptyFavsWrap — Favori yokken gösterilen boş durum elemanı.
// Drawer ve incremental patch'te ortak kullanım için.
// ══════════════════════════════════════════════════════════════════════════════
export function _buildEmptyFavsWrap() {
  const T  = this._T();
  const st = this._st;
  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:40px 24px;text-align:center;';
  wrap.innerHTML =
    '<span style="color:' + T.border + ';display:inline-flex;margin-bottom:12px;">' + ICO.Heart(32) + '</span>' +
    '<p style="font-size:14px;color:' + T.textMuted + ';margin-bottom:6px;">Henüz favori eklemediniz</p>' +
    '<p style="font-size:12px;color:' + (st.isDark ? '#2a4a5e' : '#d1d5db') + ';">Kartların üzerindeki ♥ ikonuna dokunun</p>';
  return wrap;
}

// ── Favori sayaç yardımcıları ───────────────────────────────────────────────
/**
 * _getFavCount — Toplam beğenilen kart sayısı.
 * _favCountCache ile önbelleğe alınır; _handleLike'da invalidate edilir.
 */
export function _getFavCount() {
  if (this._favCountCache !== undefined) return this._favCountCache;
  let count = 0;
  this._st.panelSessions.forEach(s => {
    s.cards.forEach(c => {
      if (this._st.likedCards.has(s.id + '-' + c.id)) count++;
    });
  });
  this._favCountCache = count;
  return count;
}

export function _getAllFavCards() {
  const all = [];
  this._st.panelSessions.forEach(s => {
    s.cards.forEach(c => {
      if (this._st.likedCards.has(s.id + '-' + c.id)) all.push({ card: c, sessionId: s.id });
    });
  });
  return all;
}

// ── Scroll yardımcıları ─────────────────────────────────────────────────────
export function _scrollToBottom() {
  clearTimeout(this._timers.scroll);
  this._timers.scroll = setTimeout(() => {
    const bottom = this._shadow.getElementById('jw-bottom');
    if (bottom) bottom.scrollIntoView({ behavior: 'smooth' });
  }, 60);
}

// Mobilde bot mesajının üstünü ekran üstüne kaydır; değilse alta kaydır
export function _scrollToLastMessage() {
  clearTimeout(this._timers.scroll);
  this._timers.scroll = setTimeout(() => {
    const msgs = this._st.messages;
    if (!msgs || msgs.length === 0) return;
    const last = msgs[msgs.length - 1];
    if (this._st.isMobile && last.role === 'assistant') {
      const el = this._shadow.getElementById('jw-msg-' + last.id);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    }
    const bottom = this._shadow.getElementById('jw-bottom');
    if (bottom) bottom.scrollIntoView({ behavior: 'smooth' });
  }, 60);
}

// ── Emoji Cycling ──────────────────────────────────────────────────────────────
export function _startEmojiCycle() {
  if (this._timers.emoji) return;

  const self = this;
  const step = () => {
    self._timers.emoji = setTimeout(() => {
      if (self._st.isMinimized) {
        delete self._timers.emoji;
        return;
      }
      self._st.emojiPhase = 'out';
      self._updateEmoji();
      self._timers.emoji = setTimeout(() => {
        self._st.emojiIndex = (self._st.emojiIndex + 1) % EMOJIS.length;
        self._st.emojiPhase = 'in';
        self._updateEmoji();
        self._timers.emoji = setTimeout(() => {
          self._st.emojiPhase = 'visible';
          self._updateEmoji();
          step();
        }, 180);
      }, 180);
    }, 1088);
  };
  step();
}

export function _stopEmojiCycle() {
  if (this._timers.emoji) {
    clearTimeout(this._timers.emoji);
    delete this._timers.emoji;
  }
}

export function _updateEmoji() {
  const inner = this._shadow.getElementById('jw-emoji-inner');
  if (!inner) return;
  const cur = EMOJIS[this._st.emojiIndex];
  const ps  = this._getEmojiStyle(this._st.emojiPhase);
  if (cur === 'BOT_ICON') {
    inner.innerHTML = '<div style="' + ps + 'will-change:transform;"><div style="width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--jules-secondary);"><span style="color:white;">' + ICO.Bot(18) + '</span></div></div>';
  } else {
    inner.innerHTML = '<span style="font-size:28px;line-height:1;display:block;user-select:none;will-change:transform;' + ps + '">' + cur + '</span>';
  }
}

// ── Weather ────────────────────────────────────────────────────────────────────
/**
 * _fetchWeather — AbortController ile güvenli fetch.
 * disconnectedCallback'te _weatherAbort.abort() çağrılarak uçuşta istek iptal edilir.
 */
export function _fetchWeather() {
  const self = this;

  if (self._weatherAbort) self._weatherAbort.abort();
  const controller = new AbortController();
  self._weatherAbort = controller;

  const applyWeather = () => {
    if (controller.signal.aborted) return;
    const wi = self._st.weatherInfo;
    if (self._st.isMinimized) return;
    const dateRow = self._shadow.getElementById('jw-date-row');
    if (!dateRow || !dateRow.isConnected) { self._build(); return; }

    const oldW = self._shadow.getElementById('jw-weather-row');
    const oldS = self._shadow.getElementById('jw-sun-row');
    if (oldW) oldW.remove();
    if (oldS) oldS.remove();

    const wRow = document.createElement('div');
    wRow.id = 'jw-weather-row';
    wRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
    wRow.innerHTML = weatherIconHtml(wi.code, 'var(--jw-accent-color)', 14) +
      '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + wi.temp + '°C</span>';
    dateRow.appendChild(wRow);

    const sunLabel = getSunLabel(wi);
    if (sunLabel && !self._st.isMobile && !self._st.isPinnedRight) {
      const sunRow = document.createElement('div');
      sunRow.id = 'jw-sun-row';
      sunRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
      // esc() — API kaynaklı sunrise/sunset değeri innerHTML'e yazılıyor
      sunRow.innerHTML = '<span style="color:var(--jw-accent-color);display:inline-flex;">' + ICO.SunHorizon(12) + '</span>' +
        '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + esc(sunLabel.label) + '</span>';
      dateRow.appendChild(sunRow);
    }
  };

  const fallback = () => {
    if (controller.signal.aborted) return;
    self._st.weatherInfo = { temp: 13, code: 2, sunrise: '06:48', sunset: '18:23' };
    applyWeather();
  };

  if (!navigator.geolocation) { fallback(); return; }
  navigator.geolocation.getCurrentPosition(
    pos => {
      if (controller.signal.aborted) return;
      const lat = pos.coords.latitude, lon = pos.coords.longitude;
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
        '&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto&forecast_days=1';
      fetch(url, { signal: controller.signal })
        .then(r => r.json())
        .then(data => {
          self._st.weatherInfo = {
            temp:    Math.round(data.current.temperature_2m),
            code:    data.current.weather_code,
            sunrise: data.daily.sunrise[0].split('T')[1].slice(0, 5),
            sunset:  data.daily.sunset[0].split('T')[1].slice(0, 5),
          };
          applyWeather();
        })
        .catch(e => { if (e.name !== 'AbortError') fallback(); });
    },
    fallback
  );
}

// ══════════════���═══════════════════════════════════════════════════════════════
// Incremental DOM Update Methods
// ══════════════════════════════════════════════════════════════════════════════

// ── Incremental Message Patch ──────────────────────────────────────────────────
/**
 * Mevcut mesajları koruyarak sadece yeni mesajları ekler.
 * Welcome → chat geçişini, typing indicator'ı ve suggestions bar'ı yönetir.
 */
export function _patchMessages() {
  const msgs = this._refs.msgs;
  if (!msgs) { this._build(); return; }
  if (!msgs.isConnected) { this._build(); return; }

  const st = this._st;
  const isCompact = st.isMobile || st.isPinnedRight;
  const bottom = this._shadow.getElementById('jw-bottom');
  if (!bottom) { this._build(); return; }

  if (st.messages.length > 0 && this._twStop) {
    this._twStop(); this._twStop = null;
  }

  // data-msg-id ile say — typing/welcome elementlerini saymaz
  const renderedCount = msgs.querySelectorAll('[data-msg-id]').length;

  // Welcome → Chat geçişi: welcome ekranını kaldır
  if (renderedCount === 0 && st.messages.length > 0) {
    while (msgs.firstChild && msgs.firstChild !== bottom) {
      msgs.removeChild(msgs.firstChild);
    }
  }

  // Yeni mesajları ekle
  for (let i = renderedCount; i < st.messages.length; i++) {
    msgs.insertBefore(this._buildMessage(st.messages[i], isCompact), bottom);
  }

  // Typing indicator
  const existingTyping = this._shadow.getElementById('jw-typing');
  if (st.isTyping && !existingTyping) {
    msgs.insertBefore(this._buildTyping(), bottom);
  } else if (!st.isTyping && existingTyping) {
    existingTyping.remove();
  }

  // Typing sırasında send butonunu görsel olarak disabled yap
  if (this._refs.sendBtn) {
    if (st.isTyping) {
      this._refs.sendBtn.style.opacity = '0.3';
      this._refs.sendBtn.style.cursor  = 'not-allowed';
      this._refs.sendBtn.style.pointerEvents = 'none';
    } else {
      this._refs.sendBtn.style.pointerEvents = '';
    }
  }

  // Suggestions bar (ilk mesajda eklenir, sonra hep kalır)
  const chat = this._refs.chatPanel;
  if (chat && st.messages.length > 0) {
    const existingSugg = this._shadow.getElementById('jw-sugg-wrap');
    if (!existingSugg) {
      const inputArea = this._refs.inputArea || this._shadow.getElementById('jw-input-area');
      if (inputArea && inputArea.parentElement === chat) {
        chat.insertBefore(this._buildSuggestions(isCompact), inputArea);
      }
    }
  }

  // Send butonunu ve textarea'yı güncelle
  const ta = this._shadow.querySelector('.jw-ta');
  if (ta && !st.inputValue) {
    ta.value = '';
    ta.style.height = 'auto';
    if (st.isMobile) {
      const inner = ta.parentElement;
      if (inner) { inner.style.minHeight = '38px'; inner.style.height = '38px'; }
    }
    if (st.isPinnedRight && !st.isMobile) {
      const inner = ta.parentElement;
      if (inner) { inner.style.minHeight = '54px'; inner.style.height = '54px'; }
    }
  }
  if (this._refs.sendBtn) {
    const hasVal = (st.inputValue || '').trim().length > 0;
    this._refs.sendBtn.style.opacity = hasVal ? '1' : '0.4';
    this._refs.sendBtn.style.cursor  = hasVal ? 'pointer' : 'not-allowed';
    this._refs.sendBtn.style.color   = hasVal ? this._T().accentColor : this._T().textMuted;
  }

  this._scrollToLastMessage();
}

// ── Content Panel: Aç ──────────────────────────────────────────────────────────
export function _openContentPanel() {
  const inner = this._refs.inner;
  const box   = this._refs.box;
  if (!inner || !box || this._st.isMobile || this._st.isPinnedRight) {
    this._build(); return;
  }

  const cp = this._buildContentPanel();
  if (this._refs.contentPanel && this._refs.contentPanel.isConnected) {
    inner.replaceChild(cp, this._refs.contentPanel);
  } else {
    inner.insertBefore(cp, inner.firstChild);
  }
  this._refs.contentPanel = cp;
  box.classList.add('jw-panel-open');

  this._patchHeader();
  this._patchCardsButtons();
  this._patchFormWidths();
}

// ── Content Panel: Kapat ───────────────────────────────────────────────────────
export function _closeContentPanel() {
  const box = this._refs.box;
  if (!box) { this._build(); return; }

  if (this._refs.contentPanel && this._refs.contentPanel.isConnected) {
    this._refs.contentPanel.remove();
  }
  this._refs.contentPanel = null;
  box.classList.remove('jw-panel-open');

  this._patchHeader();
  this._patchCardsButtons();
  this._patchFormWidths();
}

// ── Form genişliklerini panel açık/kapalı durumuna göre güncelle ───────────────
export function _patchFormWidths() {
  const st = this._st;
  if (st.isMobile || st.isPinnedRight) return;

  const isDesktopFull = !st.isPanelOpen;
  const maxW = isDesktopFull ? 'min(440px, calc(100% - 38px))' : 'calc(100% - 38px)';

  this._shadow.querySelectorAll('[data-form-msg]').forEach(el => {
    el.style.maxWidth = maxW;
  });
}

// _installFocusTrap ve _removeFocusTrap widget.js class metodları olarak tanımlıdır.

// ─── Content Panel: İçerik Yenile ──────────────────────────────────────────────
/**
 * Sadece kaydırılabilir session listesini yeniden oluşturur; CP header korunur.
 * Like değişikliğinde tüm paneli yeniden yapmak yerine yalnızca değişen
 * içerik bölümü güncellenir.
 */
export function _refreshContentPanelBody() {
  const cp = this._refs.contentPanel;

  if (!cp || !cp.isConnected) {
    if (cp && cp.parentElement) {
      const newCp = this._buildContentPanel();
      cp.parentElement.replaceChild(newCp, cp);
      this._refs.contentPanel = newCp;
    } else {
      this._build();
    }
    return;
  }

  const st = this._st;
  const T  = this._T();

  const sessionList = cp.querySelector('.jw-scroll');
  if (!sessionList) {
    const newCp = this._buildContentPanel();
    cp.parentElement.replaceChild(newCp, cp);
    this._refs.contentPanel = newCp;
    return;
  }

  sessionList.innerHTML = '';
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

  const bottomPad = document.createElement('div');
  bottomPad.style.height = '16px';
  sessionList.appendChild(bottomPad);

  const favCount    = this._getFavCount();
  const isFavActive = st.showFavoritesInPanel;
  const cpFavBtn    = cp.querySelector('[data-cp-fav-btn]');
  if (cpFavBtn) {
    cpFavBtn.style.color       = (isFavActive || favCount > 0) ? '#f87171' : T.textMuted;
    cpFavBtn.style.borderColor = (isFavActive || favCount > 0) ? '#f87171' : T.border;
    cpFavBtn.style.background  = (isFavActive || favCount > 0) ? (st.isDark ? 'rgba(248,113,113,0.1)' : '#fff5f5') : 'transparent';
    cpFavBtn.innerHTML = ICO.Heart(10, isFavActive || favCount > 0) + (favCount > 0 ? '<span>' + favCount + '</span>' : '');
  }

  if (st.activeCardMsgId) {
    this._timers.cpBodyScroll = setTimeout(() => {
      const el = sessionList.querySelector('[data-session-id="' + st.activeCardMsgId + '"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }
}

// ── Header: Hedefli Güncelleme ─────────────────────────────────────────────────
/**
 * Panel açık/kapalıya göre chevron butonunu ekler veya kaldırır.
 * data-header-right ve data-panel-chevron marker'ları _buildHeader'da eklenir.
 */
export function _patchHeader() {
  const header = this._shadow.getElementById('jw-header');
  if (!header || !header.parentElement) return;

  const st = this._st;
  const isCompact   = st.isMobile || st.isPinnedRight;
  const shouldShow  = !st.isPanelOpen && st.panelSessions.length > 0 && !isCompact;
  const existingChev = header.querySelector('[data-panel-chevron]');

  if (shouldShow && !existingChev) {
    const right = header.querySelector('[data-header-right]');
    if (right) {
      const chevBtn = this._makeAccentBtn(ICO.ChevronLeft(14), 'Sonuçları göster');
      chevBtn.dataset.panelChevron = '1';
      chevBtn.addEventListener('click', () => this._handleTogglePanel());
      right.appendChild(chevBtn);
    }
  } else if (!shouldShow && existingChev) {
    existingChev.remove();
  }
}

// ── Cards Buttons: Active State Güncelle ───────────────────────────────────────
export function _patchCardsButtons() {
  const st = this._st;
  const T  = this._T();
  this._shadow.querySelectorAll('[data-cards-msg-id]').forEach(btn => {
    const msgId    = btn.dataset.cardsMsgId;
    const isActive = st.activeCardMsgId === msgId;
    if (isActive) {
      btn.style.background   = 'var(--jules-secondary)';
      btn.style.color        = 'white';
      btn.style.borderColor  = 'transparent';
    } else {
      btn.style.background   = T.accentDimBg;
      btn.style.color        = T.accentColor;
      btn.style.borderColor  = T.accentDimBdr;
    }
  });
}

// ── Fav Drawer: Aç (append) ───────────────────────────────────────────────────
export function _showFavDrawerInc() {
  if (this._st.showFavDrawer) return;
  this._st.showFavDrawer = true;
  this._shadow.appendChild(this._buildFavDrawer());
}

// ── Fav Drawer: Kapat (remove) ────────────────────────────────────────────────
export function _hideFavDrawer() {
  this._st.showFavDrawer = false;
  this._st.drawerDragY   = 0;
  const backdrop = this._shadow.getElementById('jw-fav-backdrop');
  if (backdrop) backdrop.remove();
}

// ── Fav Drawer: İncremental güncelleme ────────────────────────────────────────
/**
 * Like/unlike sonrası drawer'ı tamamen rebuild etmek yerine
 * sadece grid içeriğini ve header sayacını günceller.
 * [data-fav-header] attribute ile güvenli DOM sorgusu.
 */
export function _patchFavDrawer(likeKey, liked) {
  const backdrop = this._shadow.getElementById('jw-fav-backdrop');
  if (!backdrop) return;

  const drawer = backdrop.querySelector('#jw-fav-drawer');
  if (!drawer) return;

  const st      = this._st;
  const allFavs = this._getAllFavCards();

  // Grid içeriğini yeniden oluştur
  const dContent = drawer.querySelector('.jw-scroll');
  if (!dContent) return;

  dContent.innerHTML = '';

  if (allFavs.length === 0) {
    dContent.appendChild(this._buildEmptyFavsWrap());
  } else {
    const grid = document.createElement('div');
    grid.style.cssText = 'padding:12px 14px 20px;display:grid;grid-template-columns:repeat(2,1fr);column-gap:10px;row-gap:21px;';
    allFavs.forEach(({ card, sessionId }) => {
      grid.appendChild(this._buildCardView(card, sessionId, true));
    });
    dContent.appendChild(grid);
  }

  // Header sayacını güncelle (data-fav-badge — her zaman var, başta display:none olabilir)
  const dHeader = drawer.querySelector('[data-fav-header]');
  const badge   = dHeader ? dHeader.querySelector('[data-fav-badge]') : null;
  if (badge) {
    if (allFavs.length > 0) {
      badge.textContent = String(allFavs.length);
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }
}

// ── Form Message: Success View'a Geçiş ───────────────────────────────────────
/**
 * Form gönderildikten sonra sadece form elementini success kartıyla değiştirir.
 */
export function _patchFormMessage(msgId) {
  const msgEl = this._shadow.getElementById('jw-msg-' + msgId);
  if (!msgEl) return;

  const formEl = msgEl.querySelector('[data-form-msg]');
  if (!formEl || !formEl.parentElement) return;

  const msg = this._st.messages.find(m => m.id === msgId);
  if (!msg || !msg.formType) return;

  const data      = this._st.submittedForms[msgId];
  const successEl = this._buildFormSuccess(msg.formType, data);
  formEl.parentElement.replaceChild(successEl, formEl);

  this._timers.formScroll = setTimeout(() => {
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 80);
}

// ── Intro Sequence — Session'da bir kez çalışır ───────────────────────────────
/**
 * İlk MiniJules tıklamasında:
 *  Faz 1 (1400ms): MiniJules merkeze uçar
 *  Faz 2 (~1600ms): Textarea'ya typewriter "Hoş geldiniz..." yazar
 *  Faz 3 (1400ms): MiniJules aşağıya inerken Jules fade-in ile açılır
 *
 * Tüm timer'lar this._timers namespace'inde — disconnectedCallback'te temizlenir.
 */
export function _runIntroSequence() {
  const mini = this._shadow.getElementById('jw-mini');
  if (!mini) { this.expand(); return; }

  const INTRO_PART1  = 'Hoş geldiniz, ben asistanınız Jules.';
  const INTRO_PART2  = 'Size nasıl yardımcı olabilirim?';
  const viewH        = window.innerHeight;
  const viewW        = window.innerWidth;
  const elH          = mini.offsetHeight || 44;
  const isPinned     = this._st.isPinnedRight && !this._st.isMobile;

  const targetY = viewH / 2 - elH / 2 - 80;
  const targetX = isPinned ? (viewW / 2 - (viewW - 195)) : 0;

  mini.style.pointerEvents = 'none';

  if (this._twStop) { this._twStop(); this._twStop = null; }

  // Faz 1: Merkeze uçuş
  requestAnimationFrame(() => {
    mini.style.transition = 'transform 1400ms cubic-bezier(0.22, 1, 0.36, 1)';
    mini.style.transform  = isPinned
      ? 'translate(' + targetX + 'px, ' + targetY + 'px)'
      : 'translateY(' + targetY + 'px)';
  });

  const ta    = mini.querySelector('.jw-mini-ta');
  const inner = mini.querySelector('#jw-mini-inner');

  if (inner) {
    if (this._st.isMobile) {
      inner.style.transition = 'background 0.3s';
    } else {
      inner.style.transition = 'height 0.5s ease, background 0.3s';
    }
    inner.style.height = '60px';
    inner.style.alignItems = 'center';
    inner.style.paddingBottom = '0';
  }
  if (ta) {
    ta.rows = 2;
    ta.style.alignSelf = 'center';
    ta.style.maxHeight = '46px';
    ta.style.overflowY = 'hidden';
    ta.setAttribute('tabindex', '-1');
    ta.style.pointerEvents = 'none';
    ta.blur();
  }

  // Timer yardımcısı — this._timers namespace'ine kaydeder; disconnectedCallback'te temizlenir
  let _introTimerSeq = 0;
  const sched = (fn, ms) => {
    const key = 'intro_seq_' + (++_introTimerSeq);
    this._timers[key] = setTimeout(() => {
      delete this._timers[key];
      fn();
    }, ms);
  };

  const typeStr = (str, speedMs, onDone) => {
    let i = 0;
    const step = () => {
      if (ta) ta.placeholder = str.slice(0, i);
      i++;
      if (i <= str.length) sched(step, speedMs);
      else onDone();
    };
    step();
  };

  const startExit = () => {
    mini.style.transition = 'transform 1700ms cubic-bezier(0.4, 0, 1, 1), opacity 400ms ease-in 1150ms';
    mini.style.transform  = 'translateY(' + (viewH + 100) + 'px)';
    mini.style.opacity    = '0';

    this._timers.intro_open = setTimeout(() => {
      if (this._twStop) { this._twStop(); this._twStop = null; }
      this._st.isMinimized = false;
      this._st.isOpen      = true;

      lockBodyScroll();
      this._build();

      const box = this._refs.box;
      if (box) {
        box.style.transform  = 'translateY(0)';
        box.style.opacity    = '0';
        box.style.transition = 'none';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            box.style.transition = 'opacity 800ms cubic-bezier(0.16,1,0.3,1)';
            box.style.opacity    = '1';
          });
        });
      }
      this._installFocusTrap();
      this._startEmojiCycle();
    }, 1050);
  };

  // Faz 2: 1400ms sonra başlat
  this._timers.intro_fly = setTimeout(() => {
    if (ta) ta.placeholder = '';

    typeStr(INTRO_PART1, 30, () => {
      sched(() => {
        let idx = 0;
        const typePart2 = () => {
          if (ta) ta.placeholder = INTRO_PART1 + (idx > 0 ? '\n' + INTRO_PART2.slice(0, idx) : '');
          idx++;
          if (idx <= INTRO_PART2.length) sched(typePart2, 30);
          else sched(startExit, 1300);
        };
        typePart2();
      }, 900);
    });
  }, 1400);
}