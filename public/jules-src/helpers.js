/**
 * helpers.js — Yardımcı widget metodları
 * _getFavCount · _getAllFavCards · _scrollToBottom · _scrollToLastMessage
 * _startEmojiCycle · _updateEmoji · _fetchWeather
 * ── Incremental DOM Updates ──
 * _patchMessages · _openContentPanel · _closeContentPanel
 * _patchHeader · _patchCardsButtons · _patchPanelToggle
 * _showFavDrawerInc · _hideFavDrawer · _refreshContentPanelBody
 */
import { ICO }                              from './icons.js';
import { weatherIconHtml, getSunLabel }     from './utils.js';
import { EMOJIS }                           from './constants.js';

/**
 * _getFavCount — Toplam beğenilen kart sayısı.
 * _favCountCache ile önbelleğe alınır; _handleLike'da invalidate edilir (O(1) okuma).
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
    // Desktop veya kullanıcı mesajı: alta kaydır
    const bottom = this._shadow.getElementById('jw-bottom');
    if (bottom) bottom.scrollIntoView({ behavior: 'smooth' });
  }, 60);
}

// ── Emoji Cycling ──────────────────────────────────────────────────────────────
export function _startEmojiCycle() {
  const self = this;
  const step = () => {
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
          step();
        }, 180);
      }, 180);
    }, 1088);
  };
  step();
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
 * disconnectedCallback'te _weatherAbort.abort() çağrılarak uçuşta olan istek iptal edilir.
 */
export function _fetchWeather() {
  const self = this;

  // Önceki isteği iptal et (varsa)
  if (self._weatherAbort) self._weatherAbort.abort();
  const controller = new AbortController();
  self._weatherAbort = controller;

  const applyWeather = () => {
    // Widget DOM'dan kaldırılmışsa ya da fetch iptal edildiyse işlem yapma
    if (controller.signal.aborted) return;
    const wi = self._st.weatherInfo;
    // MiniJules modunda header yok, sadece state'e kaydet — expand'ta kullanılır
    if (self._st.isMinimized) return;
    const dateRow = self._shadow.getElementById('jw-date-row');
    if (!dateRow) { self._build(); return; }

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
    if (sunLabel && !self._st.isMobile) {
      const sunRow = document.createElement('div');
      sunRow.id = 'jw-sun-row';
      sunRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
      sunRow.innerHTML = '<span style="color:var(--jw-accent-color);display:inline-flex;">' + ICO.SunHorizon(12) + '</span>' +
        '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + sunLabel.label + '</span>';
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

// ═══════════════════════════════════════════════════════════════════════════════
// Incremental DOM Update Methods
// ═══════════════════════════════════════════════════════════════════════════════

// ── Incremental Message Patch ──────────────────────────────────────────────────
/**
 * Mevcut mesajları koruyarak sadece yeni mesajları ekler.
 * Welcome → chat geçişini, typing indicator'ı ve suggestions bar'ı yönetir.
 * Full _build() yerine kullanılarak DOM yeniden oluşturmayı önler.
 */
export function _patchMessages() {
  const msgs = this._refs.msgs;
  if (!msgs) { this._build(); return; }

  const st = this._st;
  const isCompact = st.isMobile || st.isPinnedRight;
  const bottom = this._shadow.getElementById('jw-bottom');
  if (!bottom) { this._build(); return; }

  // Typewriter'ı durdur (mesaj varsa artık gerekli değil)
  if (st.messages.length > 0 && this._twStop) {
    this._twStop(); this._twStop = null;
  }

  // Mevcut rendered mesaj sayısı
  const renderedMsgs = msgs.querySelectorAll('.jw-msg-in');
  const renderedCount = renderedMsgs.length;

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
  }
  if (this._refs.sendBtn) {
    const hasVal = (st.inputValue || '').trim().length > 0;
    this._refs.sendBtn.style.opacity = hasVal ? '1' : '0.4';
    this._refs.sendBtn.style.cursor  = hasVal ? 'pointer' : 'not-allowed';
  }

  this._scrollToLastMessage();
}

// ── Content Panel: Aç ──────────────────────────────────────────────────────────
/**
 * Desktop'ta content panel'i ekler/günceller. Full _build() yapmaz.
 * Mobile/pinned modda fallback olarak _build() çağırır.
 */
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
  this._patchPanelToggle();
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
  this._patchPanelToggle();
}

// ── Content Panel: İçerik Yenile (fav toggle, like in fav view) ────────────────
/**
 * Sadece kaydırılabilir session listesini yeniden oluşturur; CP header korunur.
 * Fav toggle ve like değişikliğinde tüm paneli yeniden yapmak yerine
 * yalnızca değişen içerik bölümü güncellenir.
 */
export function _refreshContentPanelBody() {
  const cp = this._refs.contentPanel;

  // Fallback: panel DOM'da yoksa tam rebuild
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

  // Sadece session list'i güncelle, header'ı koru
  const sessionList = cp.querySelector('.jw-scroll');
  if (!sessionList) {
    // Selector bulunamadıysa tam panel replace
    const newCp = this._buildContentPanel();
    cp.parentElement.replaceChild(newCp, cp);
    this._refs.contentPanel = newCp;
    return;
  }

  // Session list'i temizle ve yeniden doldur
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

  // CP header fav butonunu güncelle (sayaç veya aktif durum değişmiş olabilir)
  const favCount   = this._getFavCount();
  const isFavActive = st.showFavoritesInPanel;
  const cpFavBtn   = cp.querySelector('[data-cp-fav-btn]');
  if (cpFavBtn) {
    cpFavBtn.style.color       = (isFavActive || favCount > 0) ? '#f87171' : T.textMuted;
    cpFavBtn.style.borderColor = (isFavActive || favCount > 0) ? '#f87171' : T.border;
    cpFavBtn.style.background  = (isFavActive || favCount > 0) ? (st.isDark ? 'rgba(248,113,113,0.1)' : '#fff5f5') : 'transparent';
    cpFavBtn.innerHTML = ICO.Heart(10, isFavActive || favCount > 0) + (favCount > 0 ? '<span>' + favCount + '</span>' : '');
  }

  // Aktif session'ı görünüme kaydır
  if (st.activeCardMsgId) {
    setTimeout(() => {
      const el = sessionList.querySelector('[data-session-id="' + st.activeCardMsgId + '"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }
}

// ── Header: Hedefli Güncelleme ────────────────────────────────────────────────
/**
 * Header'ı tamamen yeniden oluşturmak yerine sadece değişen kısmı günceller:
 * panel açık/kapalıya göre chevron butonunu ekler veya kaldırır.
 * data-header-right ve data-panel-chevron marker'ları _buildHeader'da eklenir.
 */
export function _patchHeader() {
  const header = this._shadow.getElementById('jw-header');
  if (!header || !header.parentElement) return;

  const st = this._st;
  const T  = this._T();
  const isCompact = st.isMobile || st.isPinnedRight;
  const shouldShow = !st.isPanelOpen && st.panelSessions.length > 0 && !isCompact;
  const existingChev = header.querySelector('[data-panel-chevron]');

  if (shouldShow && !existingChev) {
    // Chevron'u right div'e ekle
    const right = header.querySelector('[data-header-right]');
    if (right) {
      const chevBtn = document.createElement('button');
      chevBtn.className = 'jw-btn';
      chevBtn.dataset.panelChevron = '1';
      chevBtn.title = 'Sonuçları göster';
      chevBtn.innerHTML = ICO.ChevronLeft(14);
      chevBtn.style.cssText = 'width:24px;height:24px;border-radius:8px;border:1px solid ' + T.accentDimBdr + ';background:' + T.accentDimBg + ';color:' + T.accentColor + ';transition:background 0.15s,color 0.15s;';
      chevBtn.addEventListener('mouseenter', () => { chevBtn.style.background = 'var(--jules-secondary)'; chevBtn.style.color = '#fff'; chevBtn.style.borderColor = 'var(--jules-secondary)'; });
      chevBtn.addEventListener('mouseleave', () => { chevBtn.style.background = T.accentDimBg; chevBtn.style.color = T.accentColor; chevBtn.style.borderColor = T.accentDimBdr; });
      chevBtn.addEventListener('click', () => this._handleTogglePanel());
      right.appendChild(chevBtn);
    }
  } else if (!shouldShow && existingChev) {
    existingChev.remove();
  }
  // Diğer header elemanları (tarih, hava durumu, switch'ler) ayrı incremental metodlarla güncellenir
}

// ── Cards Buttons: Active State Güncelle ───────────────────────────────────────
/**
 * Mesajlardaki "Sonuçları Gör" butonlarının active/inactive stilini günceller.
 */
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

// ── Panel Toggle Switch: Hedefli Güncelleme ───────────────────────────────────
/**
 * replaceChild yerine track/thumb stillerini doğrudan günceller.
 * data-pt-track ve data-pt-thumb marker'ları _buildPanelToggleSwitch'te eklenir.
 * Click handler'ı ve closure referansları korunur — yeniden oluşturulmaz.
 */
export function _patchPanelToggle() {
  const btn = this._shadow.getElementById('jw-panel-toggle-switch');
  if (!btn) return;

  const st = this._st;
  const T  = this._T();
  const isPanelOpen = st.isPanelOpen;
  const hasSessions = st.panelSessions.length > 0;

  // Buton erişilebilirlik + görünüm
  btn.disabled   = !hasSessions;
  btn.style.opacity = hasSessions ? '1' : '0.28';
  btn.style.cursor  = hasSessions ? 'pointer' : 'not-allowed';
  btn.title = isPanelOpen ? 'Sonuçları gizle' : 'Sonuçları göster';

  // Track gradient + shadow + border
  const track = btn.querySelector('[data-pt-track]');
  if (track) {
    track.style.background  = isPanelOpen
      ? 'linear-gradient(180deg,var(--jules-secondary) 0%,var(--jules-accent) 100%)'
      : (st.isDark ? 'linear-gradient(180deg,#1a3247 0%,#1e3a55 100%)' : 'linear-gradient(180deg,#c0c0c0 0%,#d4d4d4 100%)');
    track.style.boxShadow   = isPanelOpen
      ? 'inset 0 2px 3px rgba(0,0,0,0.35),inset 0 -1px 1px rgba(255,255,255,0.12),0 0 6px rgba(10,110,130,0.3)'
      : 'inset 0 2px 3px rgba(0,0,0,0.22),inset 0 -1px 1px rgba(255,255,255,0.1)';
    track.style.borderColor = isPanelOpen ? '#076575' : T.border;
  }

  // Thumb pozisyonu
  const thumb = btn.querySelector('[data-pt-thumb]');
  if (thumb) {
    thumb.style.left = isPanelOpen ? '15px' : '2px';
  }
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