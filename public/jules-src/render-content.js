/**
 * render-content.js — Content panel, oturumlar, kartlar ve favoriler çekmecesi
 * _buildContentPanel · _buildFavoritesSection · _buildSession
 * _buildCarousel · _updateDots · _buildCardView · _buildHeartBtn · _buildCtaBtn
 * _buildFavDrawer
 */
import { ICO }                    from './icons.js';
import { esc, formatTime,
         heartHtml }              from './utils.js';

// ── Content Panel ──────────────────────────────────────────────────────────────
export function _buildContentPanel() {
  const T  = this._T();
  const st = this._st;

  const cp = document.createElement('div');
  cp.id = 'jw-content';
  cp.style.background = 'transparent';
  cp.style.transition = 'background 0.3s';

  // Header
  const cpHeader = document.createElement('div');
  cpHeader.id = 'jw-cp-header';
  cpHeader.style.cssText = 'padding:' + (st.isMobile ? '8px 14px' : '14px 20px') + ';background:' + T.bgHeader + ';border-bottom:1px solid ' + T.border + ';flex-shrink:0;backdrop-filter:blur(8px);';

  const cpHRow = document.createElement('div');
  cpHRow.style.cssText = 'display:flex;align-items:center;gap:8px;';

  // Close CP button
  const cpClose = document.createElement('button');
  cpClose.className = 'jw-btn';
  cpClose.title = 'Sonuçları gizle';
  cpClose.innerHTML = ICO.ChevronRight(14);
  cpClose.style.cssText = 'width:24px;height:24px;border-radius:8px;border:1px solid ' + T.accentDimBdr + ';background:' + T.accentDimBg + ';color:' + T.accentColor + ';flex-shrink:0;transition:background 0.15s,color 0.15s;';
  cpClose.addEventListener('mouseenter', () => { cpClose.style.background = 'var(--jules-secondary)'; cpClose.style.color = '#fff'; cpClose.style.borderColor = 'var(--jules-secondary)'; });
  cpClose.addEventListener('mouseleave', () => { const TT = this._T(); cpClose.style.background = TT.accentDimBg; cpClose.style.color = TT.accentColor; cpClose.style.borderColor = TT.accentDimBdr; });
  cpClose.addEventListener('click', () => this._handleClosePanel());
  cpHRow.appendChild(cpClose);

  const divider = document.createElement('div');
  divider.style.cssText = 'width:1px;height:16px;background:' + T.border + ';flex-shrink:0;';
  cpHRow.appendChild(divider);

  // Stats + Favorites
  const cpStats = document.createElement('div');
  cpStats.style.cssText = 'display:flex;align-items:center;gap:8px;min-width:0;flex:1;justify-content:flex-end;';

  const sparkIco = document.createElement('span');
  sparkIco.style.cssText = 'color:' + T.accentColor + ';flex-shrink:0;display:inline-flex;';
  sparkIco.innerHTML = ICO.Sparkles(10);
  cpStats.appendChild(sparkIco);

  const aiLabel = document.createElement('span');
  aiLabel.style.cssText = 'font-size:10px;font-weight:600;color:' + T.accentColor + ';letter-spacing:0.08em;white-space:nowrap;';
  aiLabel.textContent = 'SONUÇLAR';
  cpStats.appendChild(aiLabel);

  const dot = document.createElement('span');
  dot.style.cssText = 'font-size:9px;color:' + T.border + ';';
  dot.textContent = '·';
  cpStats.appendChild(dot);

  const totalResults = st.panelSessions.reduce((s, sess) => s + sess.cards.length, 0);
  const statsSpan = document.createElement('span');
  statsSpan.style.cssText = 'font-size:11px;color:' + T.textMuted + ';white-space:nowrap;';
  statsSpan.textContent = st.panelSessions.length + ' cevap · ' + totalResults + ' sonuç';
  cpStats.appendChild(statsSpan);

  const favCount  = this._getFavCount();
  const isFavActive = st.showFavoritesInPanel;
  const favBtn = document.createElement('button');
  favBtn.className = 'jw-btn';
  favBtn.dataset.cpFavBtn = '1';
  favBtn.style.cssText = 'display:flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:600;letter-spacing:0.02em;border:' + ((isFavActive || favCount > 0) ? '1px solid #f87171' : '1px solid ' + T.border) + ';background:' + ((isFavActive || favCount > 0) ? (st.isDark ? 'rgba(248,113,113,0.1)' : '#fff5f5') : 'transparent') + ';color:' + ((isFavActive || favCount > 0) ? '#f87171' : T.textMuted) + ';transition:all 0.15s ease;font-family:inherit;flex-shrink:0;';
  favBtn.innerHTML = ICO.Heart(10, isFavActive || favCount > 0) + (favCount > 0 ? '<span>' + favCount + '</span>' : '');
  favBtn.addEventListener('mouseenter', () => { favBtn.style.borderColor = '#f87171'; favBtn.style.color = '#f87171'; });
  favBtn.addEventListener('mouseleave', () => {
    const TT = this._T(); const fc = this._getFavCount();
    favBtn.style.borderColor = (this._st.showFavoritesInPanel || fc > 0) ? '#f87171' : TT.border;
    favBtn.style.color = (this._st.showFavoritesInPanel || fc > 0) ? '#f87171' : TT.textMuted;
  });
  favBtn.addEventListener('click', () => { st.showFavoritesInPanel = !st.showFavoritesInPanel; this._build(); });
  cpStats.appendChild(favBtn);

  cpHRow.appendChild(cpStats);
  cpHeader.appendChild(cpHRow);
  cp.appendChild(cpHeader);

  // Sessions list
  const sessionList = document.createElement('div');
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

  const bottomPad = document.createElement('div');
  bottomPad.style.height = '16px';
  sessionList.appendChild(bottomPad);
  cp.appendChild(sessionList);

  if (st.activeCardMsgId) {
    setTimeout(() => {
      const el = sessionList.querySelector('[data-session-id="' + st.activeCardMsgId + '"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  return cp;
}

// ── Favorites Section ──────────────────────────────────────────────────────────
export function _buildFavoritesSection() {
  const T = this._T();
  const allFavs = this._getAllFavCards();

  const wrap = document.createElement('div');

  const label = document.createElement('div');
  label.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 20px;position:sticky;top:0;z-index:10;background:' + T.bgSticky + ';border-bottom:1px solid ' + T.border + ';';
  label.innerHTML = '<span style="display:inline-flex;color:#f87171;">' + ICO.Heart(10) + '</span>' +
    '<span style="font-size:10px;font-weight:600;letter-spacing:0.06em;color:#f87171;">FAVORİLERİM</span>' +
    '<div style="flex:1;height:1px;background:' + T.border + ';"></div>' +
    '<span style="font-size:10px;color:' + T.textMuted + ';">' + allFavs.length + ' kart</span>';
  wrap.appendChild(label);

  const grid = document.createElement('div');
  grid.style.cssText = 'padding:16px;';

  if (allFavs.length === 0) {
    grid.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 0;gap:12px;text-align:center;"><span style="color:' + T.border + ';">' + ICO.Heart(24) + '</span><p style="font-size:14px;color:' + T.textMuted + ';">Henüz favori eklemediniz</p></div>';
  } else {
    const cardGrid = document.createElement('div');
    cardGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);column-gap:12px;row-gap:35px;';
    allFavs.forEach(({ card, sessionId }) => {
      cardGrid.appendChild(this._buildCardView(card, sessionId, true));
    });
    grid.appendChild(cardGrid);
  }
  wrap.appendChild(grid);
  return wrap;
}

// ── Session ────────────────────────────────────────────────────────────────────
export function _buildSession(sess, isLast) {
  const T  = this._T();
  const st = this._st;
  const isActive = sess.id === st.activeCardMsgId;

  const wrap = document.createElement('div');
  wrap.setAttribute('data-session-id', sess.id);

  const sHeader = document.createElement('div');
  sHeader.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 20px;position:sticky;top:0;z-index:10;background:' + T.bgSticky + ';border-bottom:1px solid ' + T.border + ';';

  const timeDiv = document.createElement('div');
  timeDiv.style.cssText = 'display:flex;align-items:center;gap:6px;';
  timeDiv.innerHTML = '<span style="display:inline-flex;color:' + (isActive ? T.accentColor : T.textMuted) + ';">' + ICO.Clock(10) + '</span>' +
    '<span style="font-size:10px;font-weight:600;letter-spacing:0.06em;color:' + (isActive ? T.accentColor : T.textMuted) + ';">' + formatTime(sess.timestamp) + '</span>';
  sHeader.appendChild(timeDiv);

  const line = document.createElement('div');
  line.style.cssText = 'flex:1;height:1px;background:' + T.border + ';';
  sHeader.appendChild(line);

  const titleSpan = document.createElement('span');
  titleSpan.style.cssText = 'font-size:10px;font-weight:600;letter-spacing:0.06em;color:' + (isActive ? T.accentColor : T.textMuted) + ';';
  titleSpan.textContent = sess.title.toLocaleUpperCase('tr-TR');
  sHeader.appendChild(titleSpan);

  if (isActive) {
    const activeDot = document.createElement('div');
    activeDot.style.cssText = 'width:6px;height:6px;border-radius:50%;background:' + T.accentColor + ';flex-shrink:0;';
    sHeader.appendChild(activeDot);
  }

  wrap.appendChild(sHeader);

  const cardsSection = document.createElement('div');
  if (st.isMobile) {
    cardsSection.style.cssText = 'padding:0;';
    cardsSection.appendChild(this._buildCarousel(sess.cards, sess.id));
  } else {
    cardsSection.style.cssText = 'padding:16px;';
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);column-gap:12px;row-gap:35px;';
    sess.cards.forEach(card => {
      grid.appendChild(this._buildCardView(card, sess.id, st.likedCards.has(sess.id + '-' + card.id)));
    });
    cardsSection.appendChild(grid);
  }
  wrap.appendChild(cardsSection);

  if (!isLast) {
    const sep = document.createElement('div');
    sep.style.cssText = 'margin:0 20px 4px;border-top:1px solid ' + T.border + ';';
    wrap.appendChild(sep);
  }

  return wrap;
}

// ── Mobile Carousel ────────────────────────────────────────────────────────────
export function _buildCarousel(cards, sessionId) {
  const T  = this._T();
  const st = this._st;
  const activeIdx = st.activeCardIndices[sessionId] || 0;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:10px;';

  const scrollEl = document.createElement('div');
  scrollEl.className = 'jw-scroll-x';
  scrollEl.style.cssText = 'display:flex;width:100%;gap:12px;padding:0 14%;box-sizing:border-box;scroll-snap-type:x mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;';

  const cardEls = [];
  cards.forEach((card, i) => {
    const cardWrap = document.createElement('div');
    cardWrap.style.cssText = 'flex-shrink:0;width:72%;scroll-snap-align:center;';
    cardWrap.appendChild(this._buildCardView(card, sessionId, st.likedCards.has(sessionId + '-' + card.id)));
    cardEls.push(cardWrap);
    scrollEl.appendChild(cardWrap);
  });

  const dotsRow = document.createElement('div');
  dotsRow.style.cssText = 'display:flex;align-items:center;gap:6px;';
  const dotEls = cards.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'jw-btn jw-dot' + (i === activeIdx ? ' active' : '');
    dot.style.cssText = 'width:' + (i === activeIdx ? '16px' : '6px') + ';height:6px;border-radius:3px;background:' + (i === activeIdx ? T.accentColor : (st.isDark ? '#3a6075' : '#9ca3af')) + ';transition:all 0.25s ease;';
    dot.addEventListener('click', () => {
      const el  = cardEls[i];
      const cx  = el.offsetLeft + el.offsetWidth / 2;
      const cw  = scrollEl.clientWidth;
      scrollEl.scrollTo({ left: cx - cw / 2, behavior: 'smooth' });
      st.activeCardIndices[sessionId] = i;
      this._updateDots(dotEls, i, T);
    });
    dotsRow.appendChild(dot);
    return dot;
  });

  scrollEl.addEventListener('scroll', () => {
    const center = scrollEl.scrollLeft + scrollEl.clientWidth / 2;
    let closest = 0, closestD = Infinity;
    cardEls.forEach((el, i) => {
      const cx = el.offsetLeft + el.offsetWidth / 2;
      const d  = Math.abs(cx - center);
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

export function _updateDots(dotEls, activeIdx, T) {
  dotEls.forEach((dot, i) => {
    dot.style.width      = i === activeIdx ? '16px' : '6px';
    dot.style.background = i === activeIdx ? T.accentColor : (this._st.isDark ? '#3a6075' : '#9ca3af');
  });
}

// ── Card View ──────────────────────────────────────────────────────────────────
export function _buildCardView(card, sessionId, liked) {
  const T  = this._T();
  const st = this._st;
  const likeKey = sessionId + '-' + card.id;

  const wrap = document.createElement('div');
  wrap.className = 'jw-card-wrap';
  wrap.style.cssText = 'border-radius:3px;background:' + T.bgCard + ';border:1px solid ' + T.borderCard + ';overflow:hidden;display:flex;flex-direction:column;transition:background 0.3s,border-color 0.2s;';
  wrap.addEventListener('mouseenter', () => { wrap.style.borderColor = st.isDark ? '#2d5070' : '#b0b0b0'; });
  wrap.addEventListener('mouseleave', () => { wrap.style.borderColor = this._T().borderCard; });

  if (card.noImage) {
    const content = document.createElement('div');
    content.style.cssText = 'display:flex;flex-direction:column;flex:1;padding:12px;gap:10px;';

    const topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';
    if (card.badge) {
      topRow.innerHTML = '<div style="display:flex;align-items:center;gap:6px;"><div style="width:2px;height:10px;background:var(--jules-accent-light);border-radius:1px;"></div><span style="font-size:9px;font-weight:700;letter-spacing:0.08em;color:var(--jules-accent-light);">' + esc(card.badge.toLocaleUpperCase('tr-TR')) + '</span></div>';
    } else {
      topRow.innerHTML = '<div></div>';
    }
    topRow.appendChild(this._buildHeartBtn(liked, likeKey));
    content.appendChild(topRow);

    const title = document.createElement('p');
    title.style.cssText = 'font-weight:600;font-size:12px;letter-spacing:-0.01em;color:' + T.textPrimary + ';line-height:1.4;';
    title.textContent = card.title;
    content.appendChild(title);

    const descWrap = document.createElement('div');
    descWrap.style.cssText = 'flex:1;overflow:hidden;';
    const desc = document.createElement('p');
    desc.style.cssText = 'font-size:11px;color:' + T.textPrimary + ';line-height:1.6;display:-webkit-box;-webkit-line-clamp:11;-webkit-box-orient:vertical;overflow:hidden;';
    desc.textContent = card.description;
    descWrap.appendChild(desc);
    content.appendChild(descWrap);

    content.appendChild(this._buildCtaBtn(card));
    wrap.appendChild(content);
  } else {
    const imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'position:relative;overflow:hidden;aspect-ratio:4/3;';

    const img = document.createElement('img');
    img.className = 'jw-card-img';
    img.src = card.image;
    img.alt = card.title;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    img.onerror = () => { imgWrap.style.background = T.bgSticky; img.style.display = 'none'; };
    imgWrap.appendChild(img);

    const imgHeart = this._buildHeartBtn(liked, likeKey, true);
    imgHeart.style.position = 'absolute';
    imgHeart.style.bottom = '8px';
    imgHeart.style.right  = '8px';
    imgWrap.appendChild(imgHeart);
    wrap.appendChild(imgWrap);

    const contentBottom = document.createElement('div');
    contentBottom.style.cssText = 'display:flex;flex-direction:column;gap:10px;padding:12px;';

    if (card.badge) {
      contentBottom.innerHTML = '<div style="display:flex;align-items:center;gap:6px;"><div style="width:2px;height:10px;background:var(--jules-accent-light);border-radius:1px;"></div><span style="font-size:9px;font-weight:700;letter-spacing:0.08em;color:var(--jules-accent-light);">' + esc(card.badge.toLocaleUpperCase('tr-TR')) + '</span></div>';
    }

    const title = document.createElement('p');
    title.style.cssText = 'font-weight:600;font-size:12px;letter-spacing:-0.01em;color:' + T.textPrimary + ';line-height:1.3;';
    title.textContent = card.title;
    contentBottom.appendChild(title);

    const desc = document.createElement('p');
    desc.style.cssText = 'font-size:11px;color:' + T.textPrimary + ';line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;';
    desc.textContent = card.description;
    contentBottom.appendChild(desc);

    contentBottom.appendChild(this._buildCtaBtn(card));
    wrap.appendChild(contentBottom);
  }

  return wrap;
}

export function _buildHeartBtn(liked, likeKey, onImg) {
  const btn = document.createElement('button');
  btn.className = 'jw-btn';
  btn.dataset.likeKey = likeKey;
  btn.dataset.onImg   = onImg ? '1' : '0';
  btn.style.cssText = 'background:transparent;width:24px;height:24px;flex-shrink:0;';

  const hs = onImg ? 16 : 14;
  btn.innerHTML = heartHtml(hs, liked, false, !!onImg);

  btn.addEventListener('mouseenter', () => {
    if (!this._st.likedCards.has(likeKey)) btn.innerHTML = heartHtml(hs, false, true, !!onImg);
  });
  btn.addEventListener('mouseleave', () => {
    if (!this._st.likedCards.has(likeKey)) btn.innerHTML = heartHtml(hs, false, false, !!onImg);
  });
  btn.addEventListener('click', e => {
    e.stopPropagation();
    this._handleLike(likeKey);
  });
  return btn;
}

export function _buildCtaBtn(card) {
  const T  = this._T();
  const st = this._st;
  const btn = document.createElement('button');
  btn.className = 'jw-btn';
  btn.style.cssText = 'display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;letter-spacing:0.03em;padding:4px 8px;border-radius:3px;border:1px solid ' + (st.isDark ? '#2a4a5e' : '#d1d5db') + ';color:' + (st.isDark ? '#6fa8bf' : '#555') + ';background:transparent;font-family:inherit;transition:all 0.15s;cursor:pointer;';
  btn.innerHTML = esc(card.cta || 'İncele') + ICO.ArrowUpRight(9);
  btn.addEventListener('mouseenter', () => {
    const TT = this._T();
    btn.style.borderColor = TT.accentColor;
    btn.style.background  = TT.accentColor;
    btn.style.color = 'white';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.borderColor = st.isDark ? '#2a4a5e' : '#d1d5db';
    btn.style.background  = 'transparent';
    btn.style.color = st.isDark ? '#6fa8bf' : '#555';
  });
  btn.addEventListener('click', () => {
    if (card.productId) {
      this.dispatchEvent(new CustomEvent('jules:productclick', { detail: { productId: card.productId, card } }));
    }
    if (card.url) {
      window.open(card.url, '_blank', 'noopener noreferrer');
    }
  });
  return btn;
}

// ── Favorites Drawer (mobile bottom sheet) ────────────────────────────────────
export function _buildFavDrawer() {
  const T  = this._T();
  const st = this._st;
  const allFavs = this._getAllFavCards();

  const backdrop = document.createElement('div');
  backdrop.id = 'jw-fav-backdrop';
  backdrop.addEventListener('click', () => { st.showFavDrawer = false; this._build(); });

  const drawer = document.createElement('div');
  drawer.id = 'jw-fav-drawer';
  drawer.className = 'jw-draw-in';
  drawer.style.background = st.isDark ? '#0c1c28' : '#ffffff';
  drawer.style.transform = 'translateY(' + st.drawerDragY + 'px)';
  drawer.addEventListener('click', e => e.stopPropagation());

  // Drag handle
  const handle = document.createElement('div');
  handle.style.cssText = 'display:flex;justify-content:center;padding:10px 0 8px;cursor:grab;touch-action:none;';
  handle.innerHTML = '<div style="width:36px;height:4px;border-radius:2px;background:' + T.border + ';"></div>';

  let dragStartY = 0;
  handle.addEventListener('touchstart', e => { dragStartY = e.touches[0].clientY; st.drawerDragY = 0; }, { passive: true });
  handle.addEventListener('touchmove', e => {
    const dy = e.touches[0].clientY - dragStartY;
    if (dy > 0) { st.drawerDragY = dy; drawer.style.transform = 'translateY(' + dy + 'px)'; }
  }, { passive: true });
  handle.addEventListener('touchend', () => {
    if (st.drawerDragY > 80) { st.showFavDrawer = false; st.drawerDragY = 0; this._build(); }
    else { st.drawerDragY = 0; drawer.style.transform = 'translateY(0)'; }
  });
  drawer.appendChild(handle);

  // Drawer header
  const dHeader = document.createElement('div');
  dHeader.style.cssText = 'padding:10px 16px 12px;border-bottom:1px solid ' + T.border + ';display:flex;align-items:center;justify-content:space-between;flex-shrink:0;';
  dHeader.innerHTML = '<div style="display:flex;align-items:center;gap:8px;"><span style="display:inline-flex;color:#f87171;">' + ICO.Heart(14) + '</span><span style="font-size:14px;font-weight:600;color:' + T.textPrimary + ';">Favorilerim</span>' +
    (allFavs.length > 0 ? '<span style="font-size:10px;font-weight:600;color:#f87171;background:' + (st.isDark ? 'rgba(248,113,113,0.12)' : '#fff5f5') + ';border:1px solid #fca5a5;border-radius:20px;padding:1px 7px;">' + allFavs.length + '</span>' : '') + '</div>';

  const closeDrawer = document.createElement('button');
  closeDrawer.className = 'jw-btn';
  closeDrawer.innerHTML = ICO.PhosphorX(16);
  closeDrawer.style.cssText = 'color:' + T.textMuted + ';background:' + (st.isDark ? '#1a3247' : '#f3f4f6') + ';border-radius:8px;padding:5px;';
  closeDrawer.addEventListener('click', () => { st.showFavDrawer = false; this._build(); });
  dHeader.appendChild(closeDrawer);
  drawer.appendChild(dHeader);

  // Drawer content
  const dContent = document.createElement('div');
  dContent.className = 'jw-scroll';
  dContent.style.cssText = 'flex:1;min-height:0;';

  if (allFavs.length === 0) {
    dContent.innerHTML = '<div style="padding:40px 24px;text-align:center;"><span style="color:' + T.border + ';display:inline-flex;margin-bottom:12px;">' + ICO.Heart(32) + '</span><p style="font-size:14px;color:' + T.textMuted + ';margin-bottom:6px;">Henüz favori eklemediniz</p><p style="font-size:12px;color:' + (st.isDark ? '#2a4a5e' : '#d1d5db') + ';">Kartların üzerindeki ♥ ikonuna dokunun</p></div>';
  } else {
    const grid = document.createElement('div');
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