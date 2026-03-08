/**
 * handlers.js — Kullanıcı etkileşim handler'ları
 * _handleSend · _handleShowCards · _handleClosePanel · _handleTogglePanel
 * _handleTogglePinned · _handleLike · _handleVote · _handleCopy
 */
import { ICO }                   from './icons.js';
import { genId, heartHtml }      from './utils.js';
import { DEFAULT_CONFIG }        from './constants.js';

export function _handleSend(text) {
  if (!text || !text.trim()) return;
  text = text.trim();
  this._st.inputValue = '';

  if (this._st.isMobile) {
    const ta = this._shadow && this._shadow.querySelector('textarea');
    if (ta) ta.blur();
  }

  const userMsg = { id: genId(), role: 'user', content: text, timestamp: new Date() };
  this._st.messages.push(userMsg);
  this._st.isTyping = true;
  this._build();

  const lower    = text.toLowerCase();
  const scenarios = this._cards.scenarios || [];
  const datasets  = this._cards.datasets  || {};
  const scenario  = scenarios.find(s => s.keywords && s.keywords.some(kw => lower.includes(kw)));
  const cards     = scenario ? datasets[scenario.dataset] : undefined;
  const replies   = this._config.defaultReplies || DEFAULT_CONFIG.defaultReplies;
  const delay     = 1200 + Math.random() * 800;

  clearTimeout(this._timers.reply);
  this._timers.reply = setTimeout(() => {
    this._st.isTyping = false;
    const botId  = genId();
    const botMsg = {
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
        const exists = this._st.panelSessions.find(s => s.id === botId);
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
  this._build();
}

export function _handleClosePanel() {
  this._st.activeCardMsgId = null;
  this._st.isPanelOpen = false;
  this._build();
}

export function _handleTogglePanel() {
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

export function _handleTogglePinned() {
  this._st.isPinnedRight = !this._st.isPinnedRight;
  if (this._st.isPinnedRight) {
    this._st.isPanelOpen = false;
    this._st.activeCardMsgId = null;
  }
  this._build();
}

export function _handleLike(likeKey) {
  if (this._st.likedCards.has(likeKey)) this._st.likedCards.delete(likeKey);
  else this._st.likedCards.add(likeKey);
  const liked = this._st.likedCards.has(likeKey);
  this.dispatchEvent(new CustomEvent('jules:likechange', { detail: { likeKey, liked } }));

  // Hedefli DOM güncellemesi — kalp butonlarını güncelle
  this._shadow.querySelectorAll('[data-like-key="' + likeKey + '"]').forEach(btn => {
    const onImg = btn.dataset.onImg === '1';
    const hs    = onImg ? 16 : 14;
    btn.innerHTML = heartHtml(hs, liked, false, onImg);
  });

  if (this._st.showFavoritesInPanel || this._st.showFavDrawer) {
    this._build();
  } else {
    const favCount = this._getFavCount();
    const T = this._T();
    // Compact header fav butonu
    const compactFavBtn = this._shadow.querySelector('[data-compact-fav-btn]');
    if (compactFavBtn) {
      compactFavBtn.style.color = favCount > 0 ? '#f87171' : T.textMuted;
      compactFavBtn.innerHTML   = ICO.Heart(16, favCount > 0) +
        (favCount > 0 ? '<span style="position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:#f87171;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;">' + favCount + '</span>' : '');
    }
    // CP header fav butonu
    const cpFavBtn = this._shadow.querySelector('[data-cp-fav-btn]');
    if (cpFavBtn) {
      const isActive = this._st.showFavoritesInPanel;
      cpFavBtn.style.color       = (isActive || favCount > 0) ? '#f87171' : T.textMuted;
      cpFavBtn.style.borderColor = (isActive || favCount > 0) ? '#f87171' : T.border;
      cpFavBtn.style.background  = (isActive || favCount > 0) ? (this._st.isDark ? 'rgba(248,113,113,0.1)' : '#fff5f5') : 'transparent';
      cpFavBtn.innerHTML = ICO.Heart(10, isActive || favCount > 0) + (favCount > 0 ? '<span>' + favCount + '</span>' : '');
    }
  }
}

export function _handleVote(msgId, vote) {
  const prev = this._st.votes[msgId];
  this._st.votes[msgId] = (prev === vote) ? null : vote;
  const newVote = this._st.votes[msgId];
  this.dispatchEvent(new CustomEvent('jules:vote', { detail: { msgId, vote: newVote } }));

  const T = this._T();
  const upBtn = this._shadow.querySelector('[data-vote-up-id="' + msgId + '"]');
  if (upBtn) {
    const votedUp = newVote === 'up';
    upBtn.style.color = votedUp ? '#16a34a' : T.textMuted;
    upBtn.innerHTML   = ICO.ThumbsUp(11, votedUp);
  }
  const downBtn = this._shadow.querySelector('[data-vote-down-id="' + msgId + '"]');
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
  const btn = this._shadow.querySelector('[data-copy-id="' + msgId + '"]');
  if (btn) { btn.innerHTML = ICO.Check(11); btn.style.color = '#16a34a'; }

  clearTimeout(this._timers.copy);
  this._timers.copy = setTimeout(() => {
    this._st.copied = null;
    const b = this._shadow.querySelector('[data-copy-id="' + msgId + '"]');
    if (b) { b.innerHTML = ICO.Copy(11); b.style.color = this._T().textMuted; }
  }, 1800);
}
