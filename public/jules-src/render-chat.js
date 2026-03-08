/**
 * render-chat.js — Chat panel render metodları
 * _buildChatPanel · _buildHeader · _buildWelcome · _getEmojiStyle
 * _buildMessage   · _buildTyping  · _buildSuggestions · _startTypewriter
 */
import { ICO }                              from './icons.js';
import { esc, formatTime, getDateStr,
         getSunLabel, weatherIconHtml }     from './utils.js';
import { EMOJIS, TW_PHRASES }              from './constants.js';

// ── Chat Panel ─────────────────────────────────────────────────────────────────
export function _buildChatPanel() {
  const st = this._st;
  const isCompact = st.isMobile || st.isPinnedRight;

  const chat = document.createElement('div');
  chat.id = 'jw-chat';
  chat.style.background = 'transparent';

  chat.appendChild(this._buildHeader(isCompact));

  // Messages
  const msgs = document.createElement('div');
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

  const bottomAnchor = document.createElement('div');
  bottomAnchor.id = 'jw-bottom';
  msgs.appendChild(bottomAnchor);
  chat.appendChild(msgs);
  this._refs.msgs = msgs;

  if (st.messages.length > 0) {
    chat.appendChild(this._buildSuggestions(isCompact));
  }

  chat.appendChild(this._buildInputArea(isCompact));
  return chat;
}

// ── Header ─────────────────────────────────────────────────────────────────────
export function _buildHeader(isCompact) {
  const T  = this._T();
  const st = this._st;

  const header = document.createElement('div');
  header.id = 'jw-header';
  header.style.cssText = [
    'display:flex;align-items:center;gap:12px;flex-shrink:0;',
    'padding:' + (isCompact ? '6px 20px' : '14px 20px') + ';',
    'background:transparent;border-bottom:1px solid ' + T.border + ';',
    'transition:border-color 0.3s;',
  ].join('');

  // Close button
  const closeBtn = document.createElement('button');
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
  const dateRow = document.createElement('div');
  dateRow.id = 'jw-date-row';
  dateRow.style.cssText = 'display:flex;align-items:center;gap:12px;overflow:hidden;';

  const dateSpan = document.createElement('span');
  dateSpan.style.cssText = 'font-size:10px;color:' + T.textSecondary + ';white-space:nowrap;flex-shrink:0;';
  dateSpan.textContent = getDateStr();
  dateRow.appendChild(dateSpan);

  if (st.weatherInfo) {
    const wRow = document.createElement('div');
    wRow.id = 'jw-weather-row';
    wRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
    wRow.innerHTML = weatherIconHtml(st.weatherInfo.code, 'var(--jw-accent-color)', 14) +
      '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + st.weatherInfo.temp + '°C</span>';
    dateRow.appendChild(wRow);

    const sunLabel = getSunLabel(st.weatherInfo);
    if (sunLabel && !st.isMobile) {
      const sunRow = document.createElement('div');
      sunRow.id = 'jw-sun-row';
      sunRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
      sunRow.innerHTML = '<span style="color:var(--jw-accent-color);display:inline-flex;">' + ICO.SunHorizon(12) + '</span>' +
        '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + sunLabel.label + '</span>';
      dateRow.appendChild(sunRow);
    }
  }
  header.appendChild(dateRow);

  // Right controls
  const right = document.createElement('div');
  right.style.cssText = 'margin-left:auto;display:flex;align-items:center;gap:10px;flex-shrink:0;';

  if (isCompact) {
    const favCount = this._getFavCount();
    const favBtn = document.createElement('button');
    favBtn.className = 'jw-btn';
    favBtn.dataset.compactFavBtn = '1';
    favBtn.style.cssText = 'position:relative;padding:6px;border-radius:8px;color:' + (favCount > 0 ? '#f87171' : T.textMuted) + ';transition:color 0.15s,background 0.15s;';
    favBtn.innerHTML = ICO.Heart(16, favCount > 0) + (favCount > 0 ? '<span style="position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:#f87171;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;">' + favCount + '</span>' : '');
    favBtn.addEventListener('click', () => { this._st.showFavDrawer = true; this._build(); });
    favBtn.addEventListener('mouseenter', () => { favBtn.style.background = T.accentDimBg; });
    favBtn.addEventListener('mouseleave', () => { favBtn.style.background = 'transparent'; });
    right.appendChild(favBtn);
  }

  if (!st.isMobile) {
    right.appendChild(this._buildPinSwitch());
  }

  right.appendChild(this._buildDarkSwitch());

  if (!st.isPanelOpen && st.panelSessions.length > 0 && !isCompact) {
    const chevBtn = document.createElement('button');
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

// ── Welcome ────────────────────────────────────────────────────────────────────
export function _buildWelcome(isCompact) {
  const T  = this._T();
  const st = this._st;
  const suggestions = this._config.suggestions || [];

  const wrap = document.createElement('div');
  wrap.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;';

  // Emoji
  const emojiWrap = document.createElement('div');
  emojiWrap.id = 'jw-emoji-wrap';
  emojiWrap.style.cssText = 'width:56px;height:56px;position:relative;overflow:hidden;flex-shrink:0;';

  const emojiInner = document.createElement('div');
  emojiInner.id = 'jw-emoji-inner';
  emojiInner.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;';

  const cur = EMOJIS[st.emojiIndex];
  const phaseStyle = _getEmojiStyle(st.emojiPhase);

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
  const textDiv = document.createElement('div');
  textDiv.style.cssText = 'text-align:center;';
  textDiv.innerHTML = '<p style="font-size:14px;font-weight:600;color:' + T.textPrimary + ';margin-bottom:4px;">Size nasıl yardımcı olabilirim?</p>' +
    '<p style="font-size:12px;color:' + T.textMuted + ';">Bir şeyler sorun, size en iyi sonuçları getireyim.</p>';
  wrap.appendChild(textDiv);

  // Suggestion chips
  const chipsDiv = document.createElement('div');
  chipsDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px;';
  suggestions.forEach(s => {
    const chip = document.createElement('button');
    chip.className = 'jw-btn jw-sugg-chip';
    chip.textContent = s;
    chip.style.cssText = 'padding:8px 12px;font-size:10px;border:1px solid ' + T.accentDimBdr + ';color:' + T.textSecondary + ';border-radius:12px;font-family:inherit;transition:all 0.15s;';
    chip.addEventListener('mouseenter', () => { chip.style.borderColor = T.accentColor; chip.style.color = T.accentColor; chip.style.background = T.accentDimBg; });
    chip.addEventListener('mouseleave', () => { chip.style.borderColor = T.accentDimBdr; chip.style.color = T.textSecondary; chip.style.background = 'transparent'; });
    chip.addEventListener('click', () => this._handleSend(s));
    chipsDiv.appendChild(chip);
  });
  wrap.appendChild(chipsDiv);

  return wrap;
}

// Emoji phase style — module-local (this gerektirmez, prototype'a da eklenir)
export function _getEmojiStyle(phase) {
  if (phase === 'out') return 'transform:scale(0.4) rotate(-15deg);opacity:0;transition:transform 0.18s cubic-bezier(0.4,0,1,1),opacity 0.18s ease;';
  if (phase === 'in')  return 'transform:scale(1.25) rotate(8deg);opacity:0;transition:none;';
  return 'transform:scale(1) rotate(0deg);opacity:1;transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1),opacity 0.18s ease;';
}

// ── Message ────────────────────────────────────────────────────────────────────
export function _buildMessage(msg, isCompact) {
  const T  = this._T();
  const st = this._st;
  const isUser = msg.role === 'user';

  const wrap = document.createElement('div');
  wrap.className = 'jw-msg-in';
  wrap.style.cssText = 'display:flex;flex-direction:column;';

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:10px;' + (isUser ? 'justify-content:flex-end;' : 'justify-content:flex-start;');

  if (!isUser) {
    const avatar = document.createElement('div');
    avatar.style.cssText = 'width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;box-shadow:0 2px 8px rgba(0,0,0,0.12);background:var(--jules-secondary);color:white;';
    avatar.innerHTML = ICO.Bot(14);
    row.appendChild(avatar);
  }

  const col = document.createElement('div');
  col.style.cssText = 'display:flex;flex-direction:column;gap:4px;' + (isUser ? 'align-items:flex-end;' : 'align-items:flex-start;') + 'max-width:' + (isCompact ? '85%' : '50%') + ';';

  // Bubble
  const bubble = document.createElement('div');
  const bubblePadding = (!isUser && isCompact) ? '10px 14px 4px 0' : '10px 14px';
  bubble.style.cssText = [
    'padding:' + bubblePadding + ';font-size:12px;line-height:1.6;border-radius:' + (isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px') + ';',
    'background:' + (isUser ? T.userBubble : 'transparent') + ';',
    'color:' + (isUser ? T.userBubbleTxt : (st.isDark ? '#cfe8f4' : '#1f2937')) + ';',
    isUser ? 'box-shadow:0 2px 8px rgba(0,0,0,var(--jw-msg-shadow-alpha));' : '',
  ].join('');
  bubble.textContent = msg.content;
  col.appendChild(bubble);

  // Cards button (desktop)
  if (msg.hasCards && !isUser && !isCompact) {
    const cardsBtn = document.createElement('button');
    cardsBtn.className = 'jw-btn';
    const isActive = st.activeCardMsgId === msg.id;
    cardsBtn.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:12px;font-size:10px;font-weight:500;font-family:inherit;transition:background 0.15s,color 0.15s,border-color 0.15s;' +
      (isActive ? 'background:var(--jules-secondary);color:white;border:1px solid transparent;' : 'background:' + T.accentDimBg + ';color:' + T.accentColor + ';border:1px solid ' + T.accentDimBdr + ';');
    cardsBtn.innerHTML = ICO.Sparkles(11) + '<span>' + esc(msg.cardLabel || 'Sonuçları Gör') + '</span>';
    if (!isActive) {
      cardsBtn.addEventListener('mouseenter', () => { cardsBtn.style.background = st.isDark ? 'rgba(77,196,206,0.2)' : '#b2e4ea'; });
      cardsBtn.addEventListener('mouseleave', () => { cardsBtn.style.background = this._T().accentDimBg; });
    }
    cardsBtn.addEventListener('click', () => this._handleShowCards(msg.id));
    col.appendChild(cardsBtn);
  }

  // Meta (time + actions)
  const meta = document.createElement('div');
  meta.style.cssText = 'display:flex;align-items:center;gap:8px;';

  const timeSpan = document.createElement('span');
  timeSpan.style.cssText = 'font-size:10px;color:' + T.textMuted + ';';
  timeSpan.textContent = formatTime(msg.timestamp);
  meta.appendChild(timeSpan);

  if (!isUser) {
    // Copy
    const copyBtn = document.createElement('button');
    copyBtn.className = 'jw-btn';
    copyBtn.dataset.copyId = msg.id;
    const isCopied = st.copied === msg.id;
    copyBtn.style.cssText = 'padding:4px;border-radius:4px;color:' + (isCopied ? '#16a34a' : T.textMuted) + ';transition:color 0.15s;';
    copyBtn.innerHTML = isCopied ? ICO.Check(11) : ICO.Copy(11);
    copyBtn.title = 'Kopyala';
    copyBtn.addEventListener('click', () => this._handleCopy(msg.id, msg.content));
    copyBtn.addEventListener('mouseenter', () => { if (this._st.copied !== msg.id) copyBtn.style.color = T.textSecondary; });
    copyBtn.addEventListener('mouseleave', () => { if (this._st.copied !== msg.id) copyBtn.style.color = T.textMuted; });
    meta.appendChild(copyBtn);

    // ThumbsUp
    const upBtn = document.createElement('button');
    upBtn.className = 'jw-btn';
    upBtn.dataset.voteUpId = msg.id;
    const votedUp = st.votes[msg.id] === 'up';
    upBtn.style.cssText = 'padding:4px;border-radius:4px;color:' + (votedUp ? '#16a34a' : T.textMuted) + ';transition:color 0.15s;';
    upBtn.innerHTML = ICO.ThumbsUp(11, votedUp);
    upBtn.addEventListener('click', () => this._handleVote(msg.id, 'up'));
    upBtn.addEventListener('mouseenter', () => { if (this._st.votes[msg.id] !== 'up') upBtn.style.color = '#16a34a'; });
    upBtn.addEventListener('mouseleave', () => { if (this._st.votes[msg.id] !== 'up') upBtn.style.color = this._T().textMuted; });
    meta.appendChild(upBtn);

    // ThumbsDown
    const downBtn = document.createElement('button');
    downBtn.className = 'jw-btn';
    downBtn.dataset.voteDownId = msg.id;
    const votedDown = st.votes[msg.id] === 'down';
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
    const carouselWrap = document.createElement('div');
    carouselWrap.style.cssText = 'width:100%;margin-top:4px;';
    carouselWrap.appendChild(this._buildCarousel(st.cardData[msg.id].cards, msg.id));
    wrap.appendChild(carouselWrap);
  }

  return wrap;
}

// ── Typing Indicator ───────────────────────────────────────────────────────────
export function _buildTyping() {
  const T = this._T();
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;gap:10px;justify-content:flex-start;';

  const avatar = document.createElement('div');
  avatar.style.cssText = 'width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;background:var(--jules-secondary);color:white;';
  avatar.innerHTML = ICO.Bot(14);
  wrap.appendChild(avatar);

  const dots = document.createElement('div');
  dots.style.cssText = 'padding:12px 14px;border-radius:4px 16px 16px 16px;display:flex;align-items:center;gap:4px;';
  [1, 2, 3].forEach(i => {
    const dot = document.createElement('span');
    dot.className = 'jw-bounce-' + i;
    dot.style.cssText = 'width:6px;height:6px;border-radius:50%;display:inline-block;background:' + T.textMuted + ';';
    dots.appendChild(dot);
  });
  wrap.appendChild(dots);
  return wrap;
}

// ── Typewriter Placeholder ─────────────────────────────────────────────────────
export function _startTypewriter(ta) {
  if (!ta) return;
  const phrases = TW_PHRASES;
  let phraseIdx = 0;
  let active = true;
  let timers = [];

  const stop = () => {
    active = false;
    timers.forEach(t => clearTimeout(t));
    if (ta.placeholder.endsWith('|')) {
      ta.placeholder = ta.placeholder.slice(0, -1) || 'Bir şeyler sorun...';
    }
  };
  this._twStop = stop;

  const schedule = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.push(t);
    if (timers.length > 60) timers = timers.slice(-20);
  };

  const type = (phrase, charIdx) => {
    if (!active || ta.value) { ta.placeholder = 'Bir şeyler sorun...'; return; }
    ta.placeholder = phrase.slice(0, charIdx) + '|';
    if (charIdx < phrase.length) {
      schedule(() => type(phrase, charIdx + 1), 62);
    } else {
      schedule(() => erase(phrase, phrase.length), 1500);
    }
  };

  const erase = (phrase, charIdx) => {
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

// ── Suggestions ────────────────────────────────────────────────────────────────
export function _buildSuggestions(isCompact) {
  const T  = this._T();
  const st = this._st;
  const suggestions = this._config.suggestions || [];

  const wrap = document.createElement('div');
  wrap.id = 'jw-sugg-wrap';
  wrap.style.cssText = 'position:relative;flex-shrink:0;border-top:1px solid ' + (st.isDark ? 'rgba(77,196,206,0.18)' : 'rgba(10,110,130,0.13)') + ';display:flex;justify-content:center;padding:0 16px;';

  const inner = document.createElement('div');
  inner.style.cssText = 'width:700px;max-width:100%;position:relative;display:flex;flex-direction:column;';

  const arrowDefaultBg     = 'var(--jw-arrow-bg)';
  const arrowDefaultBorder = 'var(--jw-arrow-border)';

  const fadeL = document.createElement('div');
  fadeL.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:32px;pointer-events:none;z-index:10;opacity:0;display:flex;align-items:center;padding-left:4px;';

  if (!st.isMobile) {
    const btnL = document.createElement('button');
    btnL.className = 'jw-btn jw-sugg-arrow jw-sugg-arrow-l';
    btnL.innerHTML = ICO.ChevronLeft(14);
    btnL.style.cssText = 'pointer-events:auto;background:' + arrowDefaultBg + ';border:1px solid ' + arrowDefaultBorder + ';color:' + T.textPrimary + ';box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:all 0.2s;';
    btnL.addEventListener('mouseenter', () => { btnL.style.background = 'var(--jules-secondary)'; btnL.style.color = '#fff'; btnL.style.borderColor = 'var(--jules-secondary)'; });
    btnL.addEventListener('mouseleave', () => { btnL.style.background = arrowDefaultBg; btnL.style.color = T.textPrimary; btnL.style.borderColor = arrowDefaultBorder; });
    btnL.addEventListener('click', () => { bar.scrollBy({ left: -(bar.clientWidth * 0.7), behavior: 'smooth' }); });
    fadeL.appendChild(btnL);
  }

  const fadeR = document.createElement('div');
  fadeR.style.cssText = 'position:absolute;right:0;top:0;bottom:0;width:32px;pointer-events:none;z-index:10;opacity:0;display:flex;align-items:center;justify-content:flex-end;padding-right:4px;';

  if (!st.isMobile) {
    const btnR = document.createElement('button');
    btnR.className = 'jw-btn jw-sugg-arrow jw-sugg-arrow-r';
    btnR.innerHTML = ICO.ChevronRight(14);
    btnR.style.cssText = 'pointer-events:auto;background:' + arrowDefaultBg + ';border:1px solid ' + arrowDefaultBorder + ';color:' + T.textPrimary + ';box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:all 0.2s;';
    btnR.addEventListener('mouseenter', () => { btnR.style.background = 'var(--jules-secondary)'; btnR.style.color = '#fff'; btnR.style.borderColor = 'var(--jules-secondary)'; });
    btnR.addEventListener('mouseleave', () => { btnR.style.background = arrowDefaultBg; btnR.style.color = T.textPrimary; btnR.style.borderColor = arrowDefaultBorder; });
    btnR.addEventListener('click', () => { bar.scrollBy({ left: (bar.clientWidth * 0.7), behavior: 'smooth' }); });
    fadeR.appendChild(btnR);
  }

  const bar = document.createElement('div');
  bar.id = 'jw-suggestions';
  bar.style.cssText = 'display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;flex-shrink:0;padding:' + (isCompact ? '12px 0' : '14px 0') + ';scroll-snap-type:' + (isCompact ? 'x mandatory' : 'none') + ';';
  if (!isCompact) bar.style.justifyContent = 'center';

  const updateFade = () => {
    const sl  = bar.scrollLeft;
    const max = bar.scrollWidth - bar.clientWidth;
    fadeL.style.opacity = sl > 4 ? '1' : '0';
    fadeR.style.opacity = sl < max - 4 ? '1' : '0';
  };
  bar.addEventListener('scroll', updateFade);

  suggestions.forEach(s => {
    const chip = document.createElement('button');
    chip.className = 'jw-btn jw-sugg-chip';
    chip.textContent = s;
    chip.style.cssText = 'flex-shrink:0;white-space:nowrap;padding:6px 12px;font-size:10px;border:1px solid ' + T.accentDimBdr + ';border-radius:12px;color:' + T.textSecondary + ';font-family:inherit;transition:all 0.15s;background:transparent;scroll-snap-align:start;';
    chip.addEventListener('mouseenter', () => { chip.style.borderColor = T.accentColor; chip.style.color = T.accentColor; chip.style.background = T.accentDimBg; });
    chip.addEventListener('mouseleave', () => { chip.style.borderColor = T.accentDimBdr; chip.style.color = T.textSecondary; chip.style.background = 'transparent'; });
    chip.addEventListener('click', () => {
      this._handleSend(s);
      const orbit = this._refs.inputOrbit;
      if (orbit) {
        orbit.classList.add('jw-orbit-glow');
        setTimeout(() => orbit.classList.remove('jw-orbit-glow'), 800);
      }
    });
    bar.appendChild(chip);
  });

  inner.appendChild(fadeL);
  inner.appendChild(fadeR);
  inner.appendChild(bar);
  wrap.appendChild(inner);

  setTimeout(updateFade, 60);
  return wrap;
}
