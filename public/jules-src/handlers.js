/**
 * handlers.js — Kullanıcı etkileşim handler'ları
 * _handleSend · _handleShowCards · _handleClosePanel · _handleTogglePanel
 * _handleTogglePinned · _handleLike · _handleVote · _handleCopy
 * _handleFormSubmit · _handleKvkkAccept
 *
 * Incremental DOM update metodları (_patchMessages vb.) _build() yerine kullanılır.
 */
import { ICO }                   from './icons.js';
import { genId, heartHtml,
         escSelector }      from './utils.js';
import { DEFAULT_CONFIG,
         FORM_CONFIG }           from './constants.js';

// FORM_TRIGGERS → FORM_CONFIG'den türetilir; yeni form tipi eklenince sadece constants.js güncellenir.
const FORM_TRIGGERS = Object.fromEntries(
  Object.entries(FORM_CONFIG).map(([key, cfg]) => [key, { formType: key, reply: cfg.reply }])
);

export function _handleSend(text) {
  if (!text || !text.trim()) return;
  // Bot cevaplarken yeni mesaj göndermeyi engelle
  if (this._st.isTyping) return;
  text = text.trim();

  this._st.inputValue = '';
  if (this._st.isMobile) {
    // .jw-ta — form textarea'larıyla (.jw-field-area) çakışmayı önler
    const ta = this._shadow && this._shadow.querySelector('.jw-ta');
    if (ta) ta.blur();
  }

  const userMsg = { id: genId(), role: 'user', content: text, timestamp: new Date() };
  this._st.messages.push(userMsg);
  this._st.isTyping = true;
  this._patchMessages();

  // Turkish locale — İ→i, Ş→ş vb. doğru dönüşür
  const lower    = text.toLocaleLowerCase('tr-TR').trim();

  // Form tetikleyici kontrolü
  const formTrigger = FORM_TRIGGERS[lower] || null;

  const scenarios = this._cards.scenarios || [];
  const datasets  = this._cards.datasets  || {};
  const scenario  = !formTrigger
    ? scenarios.find(s => s.keywords && s.keywords.some(kw => lower.includes(kw)))
    : null;
  const cards     = scenario ? datasets[scenario.dataset] : undefined;
  const replies   = this._config.defaultReplies || DEFAULT_CONFIG.defaultReplies;
  const delay     = 1200 + Math.random() * 800;

  clearTimeout(this._timers.reply);
  this._timers.reply = setTimeout(() => {
    // stale refs guard — _build() araya girmişse _patchMessages güvenli çalışır
    if (!this._refs.msgs || !this._refs.msgs.isConnected) {
      this._st.isTyping = false;
      this._build();
      return;
    }

    this._st.isTyping = false;
    const botId  = genId();
    const botMsg = {
      id:        botId,
      role:      'assistant',
      content:   formTrigger
        ? formTrigger.reply
        : (scenario ? scenario.reply : replies[this._st.defaultReplyIndex++ % replies.length]),
      timestamp: new Date(),
      hasCards:  !!cards,
      cardLabel: scenario ? scenario.cardLabel : undefined,
      formType:  formTrigger ? formTrigger.formType : undefined,
    };
    this._st.messages.push(botMsg);

    if (cards && scenario) {
      this._st.cardData[botId] = { cards, title: scenario.panelTitle };
      this._patchMessages();
      // this._timers'a kayıt — disconnect sırasında state mutasyonunu önler
      this._timers.cardOpen = setTimeout(() => {
        this._st.activeCardMsgId = botId;
        const exists = this._st.panelSessions.find(s => s.id === botId);
        if (!exists) {
          this._st.panelSessions.push({ id: botId, cards, title: scenario.panelTitle, timestamp: new Date() });
        }
        if (!this._st.isMobile && !this._st.isPinnedRight) {
          this._st.isPanelOpen = true;
          this._openContentPanel();
        }
      }, 300);
    } else {
      this._patchMessages();
    }
  }, delay);
}

export function _handleShowCards(msgId) {
  this._st.activeCardMsgId = msgId;
  this._st.isPanelOpen = true;
  const data = this._st.cardData[msgId];
  if (data) {
    const exists = this._st.panelSessions.find(s => s.id === msgId);
    if (!exists) {
      this._st.panelSessions.push({ id: msgId, ...data, timestamp: new Date() });
    }
  }
  this._openContentPanel();
}

export function _handleClosePanel() {
  this._st.activeCardMsgId = null;
  this._st.isPanelOpen = false;
  this._closeContentPanel();
}

export function _handleTogglePanel() {
  if (this._st.isPanelOpen) {
    this._st.isPanelOpen = false;
    this._st.activeCardMsgId = null;
    this._closeContentPanel();
  } else if (this._st.panelSessions.length > 0) {
    this._st.isPanelOpen = true;
    if (!this._st.activeCardMsgId && this._st.panelSessions.length > 0) {
      this._st.activeCardMsgId = this._st.panelSessions[this._st.panelSessions.length - 1].id;
    }
    this._openContentPanel();
  }
}

export function _handleTogglePinned() {
  this._st.isPinnedRight = !this._st.isPinnedRight;
  if (this._st.isPinnedRight) {
    this._st.isPanelOpen = false;
    this._st.activeCardMsgId = null;
  } else if (this._st.panelSessions.length > 0) {
    // Unpin: önceki oturumlar varsa paneli ve en son aktif oturumu restore et
    this._st.isPanelOpen = true;
    if (!this._st.activeCardMsgId) {
      this._st.activeCardMsgId = this._st.panelSessions[this._st.panelSessions.length - 1].id;
    }
  }
  this._build();
}

export function _handleLike(likeKey) {
  if (this._st.likedCards.has(likeKey)) this._st.likedCards.delete(likeKey);
  else this._st.likedCards.add(likeKey);
  const liked = this._st.likedCards.has(likeKey);
  this._favCountCache = undefined;
  this.dispatchEvent(new CustomEvent('jules:likechange', { detail: { likeKey, liked } }));

  // Hedefli DOM güncellemesi — kalp butonlarını güncelle
  this._shadow.querySelectorAll('[data-like-key="' + escSelector(likeKey) + '"]').forEach(btn => {
    const onImg = btn.dataset.onImg === '1';
    const hs    = onImg ? 16 : 14;
    btn.innerHTML = heartHtml(hs, liked, false, onImg);
  });

  // Fav görünümleri açıksa sadece ilgili alanı yenile
  if (this._st.showFavoritesInPanel) {
    this._refreshContentPanelBody();
  }
  if (this._st.showFavDrawer) {
    this._patchFavDrawer(likeKey, liked);
  }

  // Her durumda fav sayacı butonlarını güncelle
  const favCount = this._getFavCount();
  const T = this._T();

  const compactFavBtn = this._shadow.querySelector('[data-compact-fav-btn]');
  if (compactFavBtn) {
    compactFavBtn.style.color = favCount > 0 ? '#f87171' : T.textMuted;
    compactFavBtn.innerHTML   = ICO.Heart(16, favCount > 0) +
      (favCount > 0 ? '<span style="position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:#f87171;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;">' + favCount + '</span>' : '');
  }

  const cpFavBtn = this._shadow.querySelector('[data-cp-fav-btn]');
  if (cpFavBtn) {
    const isActive = this._st.showFavoritesInPanel;
    cpFavBtn.style.color       = (isActive || favCount > 0) ? '#f87171' : T.textMuted;
    cpFavBtn.style.borderColor = (isActive || favCount > 0) ? '#f87171' : T.border;
    cpFavBtn.style.background  = (isActive || favCount > 0) ? (this._st.isDark ? 'rgba(248,113,113,0.1)' : '#fff5f5') : 'transparent';
    cpFavBtn.innerHTML = ICO.Heart(10, isActive || favCount > 0) + (favCount > 0 ? '<span>' + favCount + '</span>' : '');
  }
}

export function _handleVote(msgId, vote) {
  const prev = this._st.votes[msgId];
  this._st.votes[msgId] = (prev === vote) ? null : vote;
  const newVote = this._st.votes[msgId];
  this.dispatchEvent(new CustomEvent('jules:vote', { detail: { msgId, vote: newVote } }));

  const T = this._T();
  const upBtn = this._shadow.querySelector('[data-vote-up-id="' + escSelector(msgId) + '"]');
  if (upBtn) {
    const votedUp = newVote === 'up';
    upBtn.style.color = votedUp ? '#16a34a' : T.textMuted;
    upBtn.innerHTML   = ICO.ThumbsUp(11, votedUp);
  }
  const downBtn = this._shadow.querySelector('[data-vote-down-id="' + escSelector(msgId) + '"]');
  if (downBtn) {
    const votedDown = newVote === 'down';
    downBtn.style.color = votedDown ? '#dc2626' : T.textMuted;
    downBtn.innerHTML   = ICO.ThumbsDown(11, votedDown);
  }
}

export function _handleCopy(msgId, text) {
  const fallback = (t) => {
    const ta = document.createElement('textarea');
    ta.value = t;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => fallback(text));
  } else { fallback(text); }

  this._st.copied = msgId;
  const btn = this._shadow.querySelector('[data-copy-id="' + escSelector(msgId) + '"]');
  if (btn) { btn.innerHTML = ICO.Check(11); btn.style.color = '#16a34a'; }

  clearTimeout(this._timers.copy);
  this._timers.copy = setTimeout(() => {
    this._st.copied = null;
    const b = this._shadow.querySelector('[data-copy-id="' + escSelector(msgId) + '"]');
    if (b) { b.innerHTML = ICO.Copy(11); b.style.color = this._T().textMuted; }
  }, 1800);
}

// ── Form Submit ─────────────────────────────────────────────────────────────────
/**
 * Form verisi gönderildiğinde çağrılır.
 * Backend entegrasyon noktası: 'jules:formsubmit' eventi dispatch edilir.
 * Dışarıdan dinlemek için:
 *   widget.addEventListener('jules:formsubmit', e => fetch('/api/form', { body: JSON.stringify(e.detail) }));
 */
export function _handleFormSubmit(msgId, formType, data) {
  this._st.submittedForms[msgId] = data;
  if (data.kvkkAccepted) this._st.kvkkAccepted = true;

  this._patchFormMessage(msgId);

  this.dispatchEvent(new CustomEvent('jules:formsubmit', {
    detail: { formType, msgId, submittedAt: new Date().toISOString(), data },
    bubbles:  true,
    composed: true,
  }));
}

// ── KVKK Kabul ─────────────────────────────────────────────────────────────────
/**
 * Artık dışarıdan çağrılmıyor — kvkkAccepted yalnızca _handleFormSubmit içinde
 * set edilir (form submit anında). Checkbox change event'i bu fonksiyonu tetiklemez.
 * Geriye dönük uyumluluk için export korundu; widget.js'de bağlanmaz.
 */
export function _handleKvkkAccept() {
  this._st.kvkkAccepted = true;
}