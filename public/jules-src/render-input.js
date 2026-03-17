/**
 * render-input.js — Input alanı, STT ve analog switch'ler
 * _buildInputArea · _toggleMic · _updateMicUI · _showMicToast
 * _buildPinSwitch · _buildDarkSwitch
 */
import { ICO } from './icons.js';
import { esc, isSafeUrl } from './utils.js';

// ── EQ bar yardımcısı (mic & speaker aktif animasyonu) ─────────────────────────
function buildEqBars() {
  const wrap = document.createElement('span');
  wrap.style.cssText = 'position:absolute;inset:0;display:none;align-items:center;justify-content:center;gap:1.5px;pointer-events:none;';
  const colors = ['#ff4d6d','#ff9a3c','#f7d700','#2ecc71','#4dc4ce','#4488ff'];
  const delays = [0, 85, 170, 255, 170, 85];
  colors.forEach((c, i) => {
    const bar = document.createElement('span');
    bar.style.cssText = 'width:2px;height:3px;background:' + c + ';border-radius:1px;display:inline-block;animation:jw-eq-bar 0.65s ease-in-out ' + delays[i] + 'ms infinite;';
    wrap.appendChild(bar);
  });
  return wrap;
}

/* buildMicEqBars kaldırıldı — mic ikonu artık jw-mic-rainbow-icon class ile renk geçişi yapıyor */

// ── Input Area ─────────────────────────────────────────────────────────────────
export function _buildInputArea(isCompact) {
  const T  = this._T();
  const st = this._st;
  const branding = this._config.branding || {};

  const area = document.createElement('div');
  area.id = 'jw-input-area';
  area.style.cssText = 'padding:0 16px 16px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;';

  const inputWrapper = document.createElement('div');
  inputWrapper.id = 'jw-input-wrapper';
  inputWrapper.style.cssText = 'position:relative;width:700px;max-width:100%;';

  // Orbit wrapper
  const orbitWrap = document.createElement('div');
  orbitWrap.style.cssText = 'position:relative;width:100%;border-radius:17px;padding:1.5px;background:transparent;overflow:hidden;transition:background 0.2s;';

  const orbitBg = document.createElement('div');
  this._refs.inputOrbit = orbitBg;
  orbitBg.className = st.isDark ? 'jw-orbit-dark' : 'jw-orbit-light';
  orbitBg.style.cssText = 'position:absolute;inset:0;z-index:0;';
  orbitWrap.appendChild(orbitBg);

  // ── Inner kart ──
  const inner = document.createElement('div');
  inner.style.cssText = [
    'position:relative;z-index:1;border-radius:15.5px;',
    'background:' + T.inputBg + ';',
    'transition:background 0.3s;',
    isCompact
      ? 'display:flex;flex-direction:row;align-items:center;gap:8px;padding:0 12px;' + (st.isMobile ? 'min-height:38px;height:38px;transition:height 0.15s ease;' : 'min-height:54px;')
      : 'display:flex;flex-direction:column;gap:4px;padding:8px;min-height:98px;',
    'cursor:text;',
  ].join('');

  const taParent = inner;

  // Textarea
  const ta = document.createElement('textarea');
  ta.className = 'jw-ta jw-scroll';
  ta.rows = 1;
  ta.placeholder = 'Bir şeyler sorun...';
  ta.value = st.inputValue || '';
  const taFontSize = st.isMobile ? '16' : '14';
  const taMaxH = st.isMobile ? '120px' : (isCompact ? '48px' : 'none');
  ta.style.cssText = [
    'flex:1;font-size:' + taFontSize + 'px;color:' + T.textPrimary + ';',
    'max-height:' + taMaxH + ';',
    st.isMobile ? 'overflow-y:auto;' : (isCompact ? 'overflow-y:auto;align-self:center;' : ''),
  ].join('');
  ta.addEventListener('input', e => {
    this._st.inputValue = e.target.value;
    e.target.style.height = 'auto';
    const maxScroll = isCompact ? 48 : 112;
    const newH = Math.min(e.target.scrollHeight, maxScroll);
    e.target.style.height = newH + 'px';
    if (st.isMobile && inner) {
      inner.style.minHeight = (newH + 14) + 'px';
      inner.style.height    = (newH + 14) + 'px';
    }
    if (isCompact && !st.isMobile && inner) {
      const cH = Math.max(newH + 18, 54);
      inner.style.minHeight = cH + 'px';
      inner.style.height    = cH + 'px';
    }
    if (this._twStop) { this._twStop(); this._twStop = null; }
    const hasVal = e.target.value.trim().length > 0;
    if (sendBtn) {
      sendBtn.style.opacity = hasVal ? '1' : '0.4';
      sendBtn.style.cursor  = hasVal ? 'pointer' : 'not-allowed';
      sendBtn.style.color   = hasVal ? T.accentColor : T.textMuted;
    }
  });
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._handleSend(ta.value); }
  });

  // ── Mobile keyboard fix ──
  if (st.isMobile) {
    ta.addEventListener('focus', () => {
      setTimeout(() => { orbitWrap.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 350);
    });
    const vv = window.visualViewport;
    if (vv) {
      const handleVVResize = () => {
        if (document.activeElement === ta || this._shadow.activeElement === ta) {
          requestAnimationFrame(() => { orbitWrap.scrollIntoView({ behavior: 'smooth', block: 'end' }); });
        }
      };
      vv.addEventListener('resize', handleVVResize);
      this._cleanupMobileKeyboard = () => { vv.removeEventListener('resize', handleVVResize); };
    }
  }

  taParent.appendChild(ta);

  if (st.messages.length === 0) {
    this._timers.twStart = setTimeout(() => this._startTypewriter(ta), 80);
  }

  // ── Button row ──
  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;justify-content:flex-end;';

  // ── Speaker butonu ──
  const speakerBtn = document.createElement('button');
  speakerBtn.className = 'jw-btn';
  speakerBtn.title = 'Cevapları seslendir';
  speakerBtn.setAttribute('aria-label', 'Seslendirme modunu aç/kapat');
  speakerBtn.style.cssText = 'position:relative;padding:6px;border-radius:8px;transition:color 0.15s,background 0.15s;color:' + (st.isSpeaking ? 'var(--jules-accent)' : T.textMuted) + ';background:' + (st.isSpeaking ? 'rgba(27,163,184,0.10)' : 'transparent') + ';';
  const speakerIco = document.createElement('span');
  speakerIco.innerHTML = ICO.Volume2(16);
  speakerIco.style.cssText = 'display:inline-flex;transition:opacity 0.15s;opacity:' + (st.isSpeaking ? '0' : '1') + ';';
  const speakerEq = buildEqBars();
  speakerEq.style.display = st.isSpeaking ? 'flex' : 'none';
  speakerBtn.appendChild(speakerIco);
  speakerBtn.appendChild(speakerEq);
  speakerBtn.addEventListener('mouseenter', () => { if (!this._st.isSpeaking) { speakerBtn.style.color = T.accentColor; speakerBtn.style.background = T.accentDimBg; } });
  speakerBtn.addEventListener('mouseleave', () => { if (!this._st.isSpeaking) { speakerBtn.style.color = T.textMuted; speakerBtn.style.background = 'transparent'; } });
  speakerBtn.addEventListener('click', () => this._toggleSpeaker());
  this._refs.speakerBtn  = speakerBtn;
  this._refs.speakerIcon = speakerIco;
  this._refs.speakerEq   = speakerEq;
  btnRow.appendChild(speakerBtn);

  // ── Mic butonu ──
  const micBtn = document.createElement('button');
  micBtn.className = 'jw-btn';
  micBtn.title = st.isListening ? 'Seslendirmeyi durdur' : 'Sesli yaz (Türkçe)';
  micBtn.setAttribute('aria-label', st.isListening ? 'Seslendirmeyi durdur' : 'Sesli yaz');
  micBtn.style.cssText = 'position:relative;padding:6px;border-radius:8px;transition:color 0.15s,background 0.15s;color:' + (st.isListening ? T.accentColor : T.textMuted) + ';background:' + (st.isListening ? T.accentDimBg : 'transparent') + ';';
  const micIco = document.createElement('span');
  micIco.innerHTML = ICO.Mic(16);
  // Başlangıç durumu: dinliyorsa rainbow animasyonu açık
  micIco.className = st.isListening ? 'jw-mic-active-icon' : '';
  micIco.style.cssText = 'display:inline-flex;';
  micBtn.appendChild(micIco);
  micBtn.addEventListener('mouseenter', () => { if (!this._st.isListening) { micBtn.style.color = T.accentColor; micBtn.style.background = T.accentDimBg; } });
  micBtn.addEventListener('mouseleave', () => { if (!this._st.isListening) { micBtn.style.color = T.textMuted; micBtn.style.background = 'transparent'; } });
  micBtn.addEventListener('click', () => this._toggleMic(ta));
  this._refs.micBtn  = micBtn;
  this._refs.micIcon = micIco;
  btnRow.appendChild(micBtn);

  // ── Send butonu ──
  const hasInitVal = !!(st.inputValue && st.inputValue.trim());
  const sendBtn = document.createElement('button');
  sendBtn.className = 'jw-btn';
  sendBtn.setAttribute('aria-label', 'Mesaj gönder');
  sendBtn.innerHTML = ICO.Send(isCompact ? 16 : 19);
  sendBtn.style.cssText = [
    'padding:6px;border-radius:8px;',
    'display:flex;align-items:center;justify-content:center;line-height:0;',
    'color:' + (hasInitVal ? T.accentColor : T.textMuted) + ';background:transparent;',
    'opacity:' + (hasInitVal ? '1' : '0.4') + ';',
    'cursor:' + (hasInitVal ? 'pointer' : 'not-allowed') + ';',
    'transition:color 0.15s,background 0.15s,opacity 0.15s;',
  ].join('');
  sendBtn.addEventListener('mouseenter', () => { if (ta.value.trim()) { sendBtn.style.color = T.accentColor; sendBtn.style.background = T.accentDimBg; } });
  sendBtn.addEventListener('mouseleave', () => { sendBtn.style.color = ta.value.trim() ? T.accentColor : T.textMuted; sendBtn.style.background = 'transparent'; });
  sendBtn.addEventListener('click', () => this._handleSend(ta.value));
  sendBtn.addEventListener('touchend', e => {
    e.preventDefault();
    if (!ta.value.trim()) return;
    ta.blur();
    const val = ta.value;
    setTimeout(() => this._handleSend(val), 0);
  });
  this._refs.sendBtn = sendBtn;
  btnRow.appendChild(sendBtn);

  inner.addEventListener('click', () => ta.focus());
  taParent.appendChild(btnRow);
  orbitWrap.appendChild(inner);
  inputWrapper.appendChild(orbitWrap);
  area.appendChild(inputWrapper);

  // Brand footer
  const footer = document.createElement('div');
  footer.style.cssText = 'display:flex;align-items:center;justify-content:space-between;width:100%;max-width:700px;margin-top:8px;';

  const leftDiv = document.createElement('div');
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

  const disclaimer = document.createElement('p');
  disclaimer.style.cssText = 'font-size:10px;color:' + T.textMuted + ';text-align:center;line-height:1.6;';
  if (isCompact) {
    disclaimer.innerHTML = 'Cevaplar hata içerebilir.<br>Önemli bilgileri kontrol edin.';
  } else {
    disclaimer.textContent = 'Cevaplar hata içerebilir. Önemli bilgileri kontrol edin.';
  }
  footer.appendChild(disclaimer);

  const poweredDiv = document.createElement('div');
  const poweredLink = document.createElement('a');
  // isSafeUrl — javascript: protokolünü engeller
  poweredLink.href   = isSafeUrl(branding.poweredByUrl) ? branding.poweredByUrl : 'https://creator.com.tr';
  poweredLink.target = '_blank';
  poweredLink.rel    = 'noopener noreferrer';
  const _linkClr = st.isDark ? '#6fa8bf' : '#6b7280';
  poweredLink.addEventListener('mouseenter', () => { poweredLink.style.color = '#34d399'; });
  poweredLink.addEventListener('mouseleave', () => { poweredLink.style.color = _linkClr; });

  if (isCompact) {
    poweredDiv.style.cssText = 'display:flex;';
    poweredLink.style.cssText = 'font-size:10px;font-weight:500;color:' + _linkClr + ';text-decoration:none;transition:color 0.15s;display:flex;flex-direction:column;align-items:flex-end;gap:1px;';
    const row1 = document.createElement('span');
    row1.style.cssText = 'display:flex;align-items:center;gap:4px;';
    row1.innerHTML = '<span style="color:' + T.accentColor + ';display:inline-flex;">' + ICO.Sparkles(9) + '</span>'
                   + '<span style="text-decoration:underline;text-underline-offset:2px;">Powered by</span>';
    const row2 = document.createElement('span');
    row2.style.cssText = 'text-decoration:underline;text-underline-offset:2px;';
    row2.textContent = 'Creator AI';
    poweredLink.appendChild(row1);
    poweredLink.appendChild(row2);
  } else {
    poweredDiv.style.cssText = 'display:flex;align-items:center;gap:4px;';
    poweredDiv.innerHTML = '<span style="color:' + T.accentColor + ';display:inline-flex;">' + ICO.Sparkles(9) + '</span>';
    poweredLink.style.cssText = 'font-size:10px;font-weight:500;color:' + _linkClr + ';text-decoration:underline;text-underline-offset:2px;transition:color 0.15s;';
    poweredLink.textContent = branding.poweredBy || 'Powered by Creator AI';
  }
  poweredDiv.appendChild(poweredLink);
  footer.appendChild(poweredDiv);

  area.appendChild(footer);
  return area;
}

// ── STT ────────────────────────────────────────────────────────────────────────
export function _toggleMic(ta) {
  if (this._st.isListening) {
    this._recognition && this._recognition.stop();
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    this._showMicToast('Ses tanıma bu tarayıcıda desteklenmiyor. Chrome veya Edge kullanın.');
    return;
  }

  this._preVoiceText = ta.value;

  const rec = new SR();
  rec.lang            = 'tr-TR';
  rec.continuous      = false;
  rec.interimResults  = true;
  rec.maxAlternatives = 1;

  rec.onstart = () => {
    this._st.isListening = true;
    this._updateMicUI(true);
  };

  rec.onresult = e => {
    let interim = '', final = '';
    for (let i = 0; i < e.results.length; i++) {
      if (e.results[i].isFinal) final   += e.results[i][0].transcript;
      else                       interim += e.results[i][0].transcript;
    }
    const base   = this._preVoiceText;
    const prefix = base ? base + ' ' : '';
    ta.value = prefix + (final || interim);
    this._st.inputValue = ta.value;
    if (this._refs.sendBtn) {
      const hasVal = ta.value.trim().length > 0;
      this._refs.sendBtn.style.opacity = hasVal ? '1' : '0.4';
      this._refs.sendBtn.style.cursor  = hasVal ? 'pointer' : 'not-allowed';
    }
    ta.style.height = 'auto';
    // isCompact — compact modda textarea mic input'unu da sınırlamalı
    const isCompactMic = this._st.isMobile || this._st.isPinnedRight;
    ta.style.height = Math.min(ta.scrollHeight, isCompactMic ? 48 : 112) + 'px';
  };

  rec.onend = () => {
    this._st.isListening = false;
    this._recognition = null;
    this._updateMicUI(false);
    setTimeout(() => ta.focus(), 80);
  };

  rec.onerror = e => {
    this._st.isListening = false;
    this._recognition = null;
    this._updateMicUI(false);
    if      (e.error === 'not-allowed')   this._showMicToast('Mikrofon izni reddedildi. Tarayıcı ayarlarından izin verin.');
    else if (e.error === 'no-speech')     this._showMicToast('Ses algılanamadı. Lütfen tekrar deneyin.');
    else if (e.error === 'audio-capture') this._showMicToast('Mikrofona erişilemiyor. Bağlantıyı kontrol edin.');
  };

  this._recognition = rec;
  rec.start();
}

export function _updateMicUI(isListening) {
  const T      = this._T();
  const micBtn = this._refs.micBtn;
  const micIco = this._refs.micIcon;

  if (micBtn) {
    if (isListening) {
      micBtn.title = 'Seslendirmeyi durdur';
      micBtn.setAttribute('aria-label', 'Seslendirmeyi durdur');
      micBtn.style.color      = T.accentColor;
      micBtn.style.background = T.accentDimBg;
    } else {
      micBtn.title = 'Sesli yaz (Türkçe)';
      micBtn.setAttribute('aria-label', 'Sesli yaz');
      micBtn.style.color      = T.textMuted;
      micBtn.style.background = 'transparent';
    }
  }
  // Rainbow class toggle — ikon rengi CSS animasyonuyla değişir
  if (micIco) {
    if (isListening) {
      micIco.classList.add('jw-mic-active-icon');
    } else {
      micIco.classList.remove('jw-mic-active-icon');
    }
  }
}

export function _showMicToast(message) {
  const existing = this._shadow.getElementById('jw-mic-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'jw-mic-toast';
  toast.style.cssText = [
    'position:absolute;bottom:calc(100% + 10px);left:50%;',
    'transform:translateX(-50%);',
    'background:rgba(220,38,38,0.92);color:#fff;',
    'font-size:11px;font-weight:500;',
    'padding:6px 14px 6px 10px;border-radius:20px;',
    'white-space:nowrap;pointer-events:none;z-index:9999;',
    'box-shadow:0 4px 18px rgba(0,0,0,0.22);',
    'display:flex;align-items:center;gap:6px;',
    'animation:jw-toast-in 0.2s ease forwards;',
  ].join('');

  const ico = document.createElement('span');
  ico.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  ico.style.flexShrink = '0';
  toast.appendChild(ico);

  const txt = document.createElement('span');
  txt.textContent = message;
  toast.appendChild(txt);

  const inputWrapper = this._shadow.getElementById('jw-input-wrapper');
  if (inputWrapper) {
    inputWrapper.appendChild(toast);
  } else {
    toast.style.position = 'fixed';
    toast.style.bottom   = '90px';
    this._shadow.appendChild(toast);
  }

  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
}

// ── Speaker (TTS stub) ─────────────────────────────────────────────────────────
export function _toggleSpeaker() {
  this._st.isSpeaking = !this._st.isSpeaking;
  this._updateSpeakerUI(this._st.isSpeaking);
}

export function _updateSpeakerUI(isSpeaking) {
  const T          = this._T();
  const speakerBtn = this._refs.speakerBtn;
  const speakerIco = this._refs.speakerIcon;
  const speakerEq  = this._refs.speakerEq;

  if (speakerBtn) {
    speakerBtn.style.color      = isSpeaking ? 'var(--jules-accent)' : T.textMuted;
    speakerBtn.style.background = isSpeaking ? 'rgba(27,163,184,0.10)' : 'transparent';
  }
  if (speakerIco) speakerIco.style.opacity = isSpeaking ? '0' : '1';
  if (speakerEq)  speakerEq.style.display  = isSpeaking ? 'flex' : 'none';
}

// ── Pin Switch ────────────────────────────────────────────────────────────────
export function _buildPinSwitch() {
  const T  = this._T();
  const st = this._st;
  const isPinned = st.isPinnedRight;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;';

  const tooltip = document.createElement('div');
  tooltip.className = 'jw-tooltip';
  const tooltipArrow = document.createElement('div');
  tooltipArrow.className = 'jw-tooltip-arrow';
  tooltipArrow.style.cssText = 'background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';border-left:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';border-top:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';';
  const tooltipBody = document.createElement('div');
  tooltipBody.className = 'jw-tooltip-body';
  tooltipBody.style.cssText = 'background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';color:' + (st.isDark ? '#cfe8f4' : 'var(--jules-primary)') + ';border:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';box-shadow:0 4px 14px rgba(0,0,0,' + (st.isDark ? '0.28' : '0.10') + ');';
  tooltipBody.textContent = isPinned ? 'Tam ekrana dön' : 'Sağa yapıştır';
  tooltip.appendChild(tooltipArrow);
  tooltip.appendChild(tooltipBody);
  wrap.appendChild(tooltip);

  const btn = document.createElement('button');
  btn.id = 'jw-pin-switch';
  btn.className = 'jw-btn';
  btn.title = isPinned ? 'Tam ekrana dön' : 'Sağa yapıştır';
  btn.setAttribute('aria-label', isPinned ? 'Tam ekrana dön' : 'Sağa yapıştır');  // Fix #11
  btn.setAttribute('aria-pressed', String(isPinned));  // Fix #11
  btn.style.cssText = 'position:relative;width:47px;height:23px;border-radius:12px;flex-shrink:0;';

  const track = document.createElement('div');
  track.style.cssText = [
    'position:absolute;inset:0;border-radius:12px;',
    'background:' + (isPinned ? 'linear-gradient(to right,var(--jules-accent) 0%,var(--jules-secondary) 100%)' : (st.isDark ? 'linear-gradient(to right,#2e5a72 0%,#244a5e 100%)' : 'linear-gradient(to right,#f3f4f6 0%,#e5e7eb 100%)')) + ';',
    'border:' + (isPinned ? '1.5px solid var(--jules-accent)' : (st.isDark ? '1.5px solid #2e5269' : '1.5px solid #c5c9d0')) + ';',
    'box-shadow:' + (isPinned ? '0 2px 6px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.22)' : (st.isDark ? '0 2px 6px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.12)' : '0 2px 5px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.9)')) + ';',
    'display:flex;align-items:center;justify-content:space-between;padding:0 6px;overflow:hidden;',
    'transition:background 0.35s ease,border-color 0.35s ease,box-shadow 0.35s ease;',
  ].join('');

  const monIco = document.createElement('span');
  monIco.style.cssText = 'flex-shrink:0;z-index:1;display:inline-flex;transition:color 0.3s,opacity 0.3s;color:' + (st.isDark ? (!isPinned ? 'var(--jules-accent-light)' : 'rgba(255,255,255,0.75)') : '#374151') + ';opacity:' + (st.isDark ? '1' : (isPinned ? '0.75' : '1')) + ';';
  monIco.innerHTML = ICO.Monitor(10);
  track.appendChild(monIco);

  const sideIco = document.createElement('span');
  sideIco.style.cssText = 'flex-shrink:0;z-index:1;display:inline-flex;transition:color 0.3s,opacity 0.3s;transform:scaleX(-1);color:' + (st.isDark ? (isPinned ? 'var(--jules-accent-light)' : 'rgba(255,255,255,0.75)') : '#5a6a78') + ';opacity:' + (st.isDark ? '1' : (isPinned ? '1' : '0.88')) + ';';
  sideIco.innerHTML = ICO.SidebarSimple(10);
  track.appendChild(sideIco);
  btn.appendChild(track);

  const thumb = document.createElement('div');
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

  btn.addEventListener('mouseenter', () => tooltip.classList.add('jw-tooltip-show'));
  btn.addEventListener('mouseleave', () => tooltip.classList.remove('jw-tooltip-show'));
  btn.addEventListener('click', () => {
    const isPinnedNew = !this._st.isPinnedRight;
    thumb.style.left = isPinnedNew ? '25px' : '4px';
    thumb.innerHTML = '<span style="display:inline-flex;color:rgba(255,255,255,0.9);">' + (isPinnedNew ? ICO.SidebarSimple(8) : ICO.Monitor(8)) + '</span>';
    setTimeout(() => this._handleTogglePinned(), 340);
  });

  // Fix #6: _syncTheme — replaceChild yerine doğrudan güncelleme
  wrap._syncTheme = (isDk) => {
    const isPin = this._st.isPinnedRight;
    track.style.background = isPin
      ? 'linear-gradient(to right,var(--jules-accent) 0%,var(--jules-secondary) 100%)'
      : (isDk ? 'linear-gradient(to right,#2e5a72 0%,#244a5e 100%)' : 'linear-gradient(to right,#f3f4f6 0%,#e5e7eb 100%)');
    track.style.border = isPin
      ? '1.5px solid var(--jules-accent)'
      : (isDk ? '1.5px solid #2e5269' : '1.5px solid #c5c9d0');
    track.style.boxShadow = isPin
      ? '0 2px 6px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.22)'
      : (isDk ? '0 2px 6px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.12)' : '0 2px 5px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.9)');
    monIco.style.color = isDk ? (!isPin ? 'var(--jules-accent-light)' : 'rgba(255,255,255,0.75)') : '#374151';
    sideIco.style.color = isDk ? (isPin ? 'var(--jules-accent-light)' : 'rgba(255,255,255,0.75)') : '#5a6a78';
    thumb.style.background = isPin
      ? 'linear-gradient(135deg,var(--jules-accent) 0%,var(--jules-secondary) 100%)'
      : (isDk ? 'linear-gradient(135deg,#2a4a5e 0%,#1e3a4f 100%)' : 'linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%)');
    thumb.style.boxShadow = isPin
      ? '0 2px 6px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.22)'
      : (isDk ? '0 2px 5px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.08)' : '0 2px 5px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.9)');
    // Audit4 #16 (P3): Tooltip tema güncelleme
    tooltipArrow.style.background = isDk ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)';
    tooltipArrow.style.borderLeft = '1px solid ' + (isDk ? 'var(--jules-primary)' : '#c8dde6');
    tooltipArrow.style.borderTop  = '1px solid ' + (isDk ? 'var(--jules-primary)' : '#c8dde6');
    tooltipBody.style.background  = isDk ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)';
    tooltipBody.style.color       = isDk ? '#cfe8f4' : 'var(--jules-primary)';
    tooltipBody.style.border      = '1px solid ' + (isDk ? 'var(--jules-primary)' : '#c8dde6');
    tooltipBody.style.boxShadow   = '0 4px 14px rgba(0,0,0,' + (isDk ? '0.28' : '0.10') + ')';
    tooltipBody.textContent       = isPin ? 'Tam ekrana dön' : 'Sağa yapıştır';
  };

  wrap.appendChild(btn);
  return wrap;
}

// ── Dark Mode Switch ───────────────────────────────────────────────────────────
export function _buildDarkSwitch() {
  const st = this._st;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;';

  const tooltip = document.createElement('div');
  tooltip.className = 'jw-tooltip';
  const tooltipArrow = document.createElement('div');
  tooltipArrow.className = 'jw-tooltip-arrow';
  tooltipArrow.style.cssText = 'background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';border-left:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';border-top:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';';
  const tooltipBody = document.createElement('div');
  tooltipBody.className = 'jw-tooltip-body';
  tooltipBody.style.cssText = 'background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';color:' + (st.isDark ? '#cfe8f4' : 'var(--jules-primary)') + ';border:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';box-shadow:0 4px 14px rgba(0,0,0,' + (st.isDark ? '0.28' : '0.10') + ');';
  tooltipBody.textContent = st.isDark ? 'Açık moda geç' : 'Koyu moda geç';
  tooltip.appendChild(tooltipArrow);
  tooltip.appendChild(tooltipBody);
  wrap.appendChild(tooltip);

  const btn = document.createElement('button');
  btn.id = 'jw-dark-switch';
  btn.className = 'jw-btn';
  btn.setAttribute('aria-label', st.isDark ? 'Açık moda geç' : 'Koyu moda geç');  // Fix #11
  btn.setAttribute('aria-pressed', String(st.isDark));  // Fix #11
  btn.style.cssText = 'position:relative;width:47px;height:23px;border-radius:12px;flex-shrink:0;';

  const track = document.createElement('div');
  track.style.cssText = [
    'position:absolute;inset:0;border-radius:12px;overflow:hidden;',
    'background:' + (st.isDark ? 'linear-gradient(135deg,#0b1822 0%,#1c3d54 100%)' : 'linear-gradient(135deg,#fffbeb 0%,#fde68a 100%)') + ';',
    'border:' + (st.isDark ? '1.5px solid #2a4a5e' : '1.5px solid #fcd34d') + ';',
    'box-shadow:' + (st.isDark ? 'inset 0 2px 5px rgba(0,0,0,0.6),0 0 10px rgba(77,196,206,0.08)' : 'inset 0 2px 5px rgba(0,0,0,0.05),0 0 8px rgba(251,191,36,0.25)') + ';',
    'display:flex;align-items:center;justify-content:space-between;padding:0 6px;',
    'transition:background 0.35s ease,border-color 0.35s ease,box-shadow 0.35s ease;',
  ].join('');

  // Fix #6: dekorasyon ayrı container — _syncTheme güncelleyebilir
  const decoEl = document.createElement('div');
  decoEl.className = 'jw-ds-deco';
  decoEl.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  decoEl.innerHTML = st.isDark
    ? '<div style="position:absolute;top:4px;left:14px;width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,0.5);"></div><div style="position:absolute;top:8px;left:20px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(255,255,255,0.35);"></div><div style="position:absolute;top:5px;left:26px;width:1px;height:1px;border-radius:50%;background:rgba(255,255,255,0.4);"></div>'
    : '<div style="position:absolute;top:3px;right:9px;width:2px;height:2px;border-radius:50%;background:rgba(245,158,11,0.5);"></div><div style="position:absolute;bottom:3px;right:14px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(245,158,11,0.4);"></div>';
  track.appendChild(decoEl);

  const sunIco = document.createElement('span');
  sunIco.style.cssText = 'color:' + (st.isDark ? '#3d6880' : '#f59e0b') + ';opacity:' + (st.isDark ? '0.3' : '1') + ';flex-shrink:0;z-index:1;display:inline-flex;transition:opacity 0.3s,color 0.3s;';
  sunIco.innerHTML = ICO.Sun(11, 'fill');
  track.appendChild(sunIco);

  const moonIco = document.createElement('span');
  moonIco.style.cssText = 'color:' + (st.isDark ? '#4dc4ce' : '#a78bfa') + ';opacity:' + (st.isDark ? '1' : '0.4') + ';flex-shrink:0;z-index:1;display:inline-flex;transition:opacity 0.3s,color 0.3s;';
  moonIco.innerHTML = ICO.Moon(11, 'fill');
  track.appendChild(moonIco);
  btn.appendChild(track);

  const thumb = document.createElement('div');
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

  btn.addEventListener('mouseenter', () => tooltip.classList.add('jw-tooltip-show'));
  btn.addEventListener('mouseleave', () => tooltip.classList.remove('jw-tooltip-show'));
  btn.addEventListener('click', () => {
    const isDarkNew = !this._st.isDark;
    thumb.style.left = isDarkNew ? '25px' : '4px';
    thumb.innerHTML = '<span style="display:inline-flex;color:rgba(255,255,255,0.9);">' + (isDarkNew ? ICO.Moon(9, 'fill') : ICO.Sun(9, 'fill')) + '</span>';
    setTimeout(() => {
      this._st.isDark = isDarkNew;
      this.dispatchEvent(new CustomEvent('jules:darkchange', { detail: { isDark: this._st.isDark } }));
      this._applyTheme();
    }, 340);
  });

  // Fix #6: _syncTheme — replaceChild yerine doğrudan güncelleme
  wrap._syncTheme = (isDk) => {
    track.style.background = isDk
      ? 'linear-gradient(135deg,#0b1822 0%,#1c3d54 100%)'
      : 'linear-gradient(135deg,#fffbeb 0%,#fde68a 100%)';
    track.style.border = isDk ? '1.5px solid #2a4a5e' : '1.5px solid #fcd34d';
    track.style.boxShadow = isDk
      ? 'inset 0 2px 5px rgba(0,0,0,0.6),0 0 10px rgba(77,196,206,0.08)'
      : 'inset 0 2px 5px rgba(0,0,0,0.05),0 0 8px rgba(251,191,36,0.25)';
    decoEl.innerHTML = isDk
      ? '<div style="position:absolute;top:4px;left:14px;width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,0.5);"></div><div style="position:absolute;top:8px;left:20px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(255,255,255,0.35);"></div><div style="position:absolute;top:5px;left:26px;width:1px;height:1px;border-radius:50%;background:rgba(255,255,255,0.4);"></div>'
      : '<div style="position:absolute;top:3px;right:9px;width:2px;height:2px;border-radius:50%;background:rgba(245,158,11,0.5);"></div><div style="position:absolute;bottom:3px;right:14px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(245,158,11,0.4);"></div>';
    sunIco.style.color   = isDk ? '#3d6880' : '#f59e0b';
    sunIco.style.opacity = isDk ? '0.3' : '1';
    moonIco.style.color   = isDk ? '#4dc4ce' : '#a78bfa';
    moonIco.style.opacity = isDk ? '1' : '0.4';
    thumb.style.left       = isDk ? '25px' : '4px';
    thumb.style.background = isDk
      ? 'linear-gradient(135deg,#1ba3b8 0%,#0a6e82 100%)'
      : 'linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%)';
    thumb.style.boxShadow = isDk
      ? '0 2px 6px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.18)'
      : '0 2px 6px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.9)';
    thumb.innerHTML = '<span style="display:inline-flex;color:rgba(255,255,255,0.9);">' + (isDk ? ICO.Moon(9, 'fill') : ICO.Sun(9, 'fill')) + '</span>';
    btn.setAttribute('aria-label', isDk ? 'Açık moda geç' : 'Koyu moda geç');
    btn.setAttribute('aria-pressed', String(isDk));
    tooltipBody.textContent = isDk ? 'Açık moda geç' : 'Koyu moda geç';
  };

  wrap.appendChild(btn);
  return wrap;
}