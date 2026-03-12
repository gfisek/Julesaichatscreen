/**
 * render-input.js — Input alanı, STT ve analog switch'ler
 * _buildInputArea · _toggleMic · _updateMicUI · _showMicToast
 * _buildPanelToggleSwitch · _buildPinSwitch · _buildDarkSwitch
 */
import { ICO } from './icons.js';
import { esc } from './utils.js';

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

  // Inner
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

  // Textarea
  const ta = document.createElement('textarea');
  ta.className = 'jw-ta jw-scroll';
  ta.rows = 1;
  ta.placeholder = 'Bir şeyler sorun...';
  ta.value = st.inputValue || '';
  const taFontSize = st.isMobile ? '16' : '14';
  const taMaxH = st.isMobile ? '49px' : (isCompact ? '36px' : 'none');
  ta.style.cssText = [
    'flex:1;font-size:' + taFontSize + 'px;color:' + T.textPrimary + ';',
    'max-height:' + taMaxH + ';',
    st.isMobile ? 'overflow-y:hidden;' : (isCompact ? 'overflow-y:auto;align-self:center;' : ''),
  ].join('');
  ta.addEventListener('input', e => {
    this._st.inputValue = e.target.value;
    e.target.style.height = 'auto';
    const maxScroll = st.isMobile ? 49 : 112;
    const newH = Math.min(e.target.scrollHeight, maxScroll);
    e.target.style.height = newH + 'px';
    if (st.isMobile && inner) {
      inner.style.minHeight = (newH + 14) + 'px';
      inner.style.height    = (newH + 14) + 'px';
    }
    if (this._twStop) { this._twStop(); this._twStop = null; }
  });
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._handleSend(ta.value); }
  });
  inner.appendChild(ta);

  if (st.messages.length === 0) {
    setTimeout(() => this._startTypewriter(ta), 80);
  }

  // Button row
  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;justify-content:flex-end;';

  if (!isCompact) {
    btnRow.appendChild(this._buildPanelToggleSwitch());
  }

  // Mic label
  const micLabel = document.createElement('span');
  micLabel.id = 'jw-mic-label';
  micLabel.textContent = 'Dinleniyor…';
  micLabel.style.cssText = 'font-size:10px;font-weight:500;color:#ef4444;letter-spacing:0.02em;display:' + (st.isListening ? 'inline' : 'none') + ';user-select:none;';
  btnRow.appendChild(micLabel);
  this._refs.micStatusLabel = micLabel;

  // Mic button
  const micBtn = document.createElement('button');
  micBtn.className = 'jw-btn' + (st.isListening ? ' jw-mic-listening' : '');
  micBtn.title = st.isListening ? 'Dinlemeyi durdur' : 'Sesli yaz (Türkçe)';
  micBtn.innerHTML = ICO.Mic(16);
  micBtn.style.cssText = 'padding:6px;border-radius:8px;transition:color 0.15s,background 0.15s;color:' + (st.isListening ? '#ef4444' : T.textMuted) + ';background:' + (st.isListening ? 'rgba(239,68,68,0.10)' : 'transparent') + ';';
  micBtn.addEventListener('mouseenter', () => { if (!this._st.isListening) { micBtn.style.color = T.accentColor; micBtn.style.background = T.accentDimBg; } });
  micBtn.addEventListener('mouseleave', () => { if (!this._st.isListening) { micBtn.style.color = T.textMuted; micBtn.style.background = 'transparent'; } });
  micBtn.addEventListener('click', () => this._toggleMic(ta));
  this._refs.micBtn = micBtn;
  btnRow.appendChild(micBtn);

  // Send button — bare icon + hover (React JulesOrbitInput ile tutarlı)
  const hasInitVal = !!(st.inputValue && st.inputValue.trim());
  const sendBtn = document.createElement('button');
  sendBtn.className = 'jw-btn';
  sendBtn.innerHTML = ICO.Send(isCompact ? 16 : 19);
  sendBtn.style.cssText = [
    'padding:6px;border-radius:8px;',
    'display:flex;align-items:center;justify-content:center;line-height:0;',
    'color:' + T.textMuted + ';background:transparent;',
    'opacity:' + (hasInitVal ? '1' : '0.4') + ';',
    'cursor:' + (hasInitVal ? 'pointer' : 'not-allowed') + ';',
    'transition:color 0.15s,background 0.15s,opacity 0.15s;',
  ].join('');
  sendBtn.addEventListener('mouseenter', () => {
    if (ta.value.trim()) { sendBtn.style.color = T.accentColor; sendBtn.style.background = T.accentDimBg; }
  });
  sendBtn.addEventListener('mouseleave', () => {
    sendBtn.style.color = T.textMuted; sendBtn.style.background = 'transparent';
  });
  sendBtn.addEventListener('click', () => this._handleSend(ta.value));
  sendBtn.addEventListener('touchend', e => {
    e.preventDefault();
    if (!ta.value.trim()) return;
    ta.blur();
    const val = ta.value;
    setTimeout(() => this._handleSend(val), 0);
  });
  this._refs.sendBtn = sendBtn;
  ta.addEventListener('input', () => {
    const hasVal = ta.value.trim().length > 0;
    sendBtn.style.opacity = hasVal ? '1' : '0.4';
    sendBtn.style.cursor  = hasVal ? 'pointer' : 'not-allowed';
  });
  btnRow.appendChild(sendBtn);

  inner.addEventListener('click', () => ta.focus());
  inner.appendChild(btnRow);
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
    disclaimer.innerHTML = 'AI yanıtlar hata içerebilir.<br>Önemli bilgileri doğrulayın.';
  } else {
    disclaimer.textContent = 'AI yanıtlar hata içerebilir. Önemli bilgileri doğrulayın.';
  }
  footer.appendChild(disclaimer);

  const poweredDiv = document.createElement('div');
  poweredDiv.style.cssText = 'display:flex;align-items:center;gap:4px;';
  poweredDiv.innerHTML = '<span style="color:' + T.accentColor + ';display:inline-flex;">' + ICO.Sparkles(9) + '</span>';
  const poweredLink = document.createElement('a');
  poweredLink.href   = branding.poweredByUrl || 'https://creator.com.tr';
  poweredLink.target = '_blank';
  poweredLink.rel    = 'noopener noreferrer';
  poweredLink.textContent = branding.poweredBy || 'Powered by Creator AI';
  poweredLink.style.cssText = 'font-size:10px;font-weight:500;color:' + (st.isDark ? '#6fa8bf' : '#6b7280') + ';text-decoration:underline;text-underline-offset:2px;transition:color 0.15s;';
  poweredLink.addEventListener('mouseenter', () => { poweredLink.style.color = '#34d399'; });
  poweredLink.addEventListener('mouseleave', () => { poweredLink.style.color = st.isDark ? '#6fa8bf' : '#6b7280'; });
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
    ta.style.height = Math.min(ta.scrollHeight, 112) + 'px';
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
  const T        = this._T();
  const micBtn   = this._refs.micBtn;
  const micLabel = this._refs.micStatusLabel;

  if (micBtn) {
    if (isListening) {
      micBtn.classList.add('jw-mic-listening');
      micBtn.title = 'Dinlemeyi durdur';
      micBtn.style.color      = '#ef4444';
      micBtn.style.background = 'rgba(239,68,68,0.10)';
    } else {
      micBtn.classList.remove('jw-mic-listening');
      micBtn.title = 'Sesli yaz (Türkçe)';
      micBtn.style.color      = T.textMuted;
      micBtn.style.background = 'transparent';
    }
  }
  if (micLabel) {
    micLabel.style.display = isListening ? 'inline' : 'none';
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

// ── Panel Toggle Switch ────────────────────────────────────────────────────────
export function _buildPanelToggleSwitch() {
  const T  = this._T();
  const st = this._st;
  const isPanelOpen = st.isPanelOpen;
  const hasSessions = st.panelSessions.length > 0;

  const btn = document.createElement('button');
  btn.id = 'jw-panel-toggle-switch';
  btn.className = 'jw-btn';
  btn.title = isPanelOpen ? 'Sonuçları gizle' : 'Sonuçları göster';
  btn.style.cssText = 'opacity:' + (hasSessions ? '1' : '0.28') + ';cursor:' + (hasSessions ? 'pointer' : 'not-allowed') + ';';
  btn.disabled = !hasSessions;

  const track = document.createElement('div');
  track.dataset.ptTrack = '1'; // _patchPanelToggle() targeted update için marker
  track.style.cssText = [
    'position:relative;width:30px;height:16px;border-radius:3px;',
    'background:' + (isPanelOpen ? 'linear-gradient(180deg,var(--jules-secondary) 0%,var(--jules-accent) 100%)' : (st.isDark ? 'linear-gradient(180deg,#1a3247 0%,#1e3a55 100%)' : 'linear-gradient(180deg,#c0c0c0 0%,#d4d4d4 100%)')) + ';',
    'box-shadow:' + (isPanelOpen ? 'inset 0 2px 3px rgba(0,0,0,0.35),inset 0 -1px 1px rgba(255,255,255,0.12),0 0 6px rgba(10,110,130,0.3)' : 'inset 0 2px 3px rgba(0,0,0,0.22),inset 0 -1px 1px rgba(255,255,255,0.1)') + ';',
    'border:' + (isPanelOpen ? '1px solid #076575' : '1px solid ' + T.border) + ';',
    'transition:background 0.2s,border-color 0.2s,box-shadow 0.2s;',
    'display:flex;align-items:center;justify-content:space-between;padding:0 3px;overflow:hidden;',
  ].join('');

  const leftLines = document.createElement('div');
  leftLines.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
  leftLines.innerHTML = '<div style="width:4px;height:1px;background:rgba(255,255,255,0.3);border-radius:1px;"></div>'.repeat(3);
  track.appendChild(leftLines);

  const rightLines = document.createElement('div');
  rightLines.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
  rightLines.innerHTML = '<div style="width:4px;height:1px;background:rgba(0,0,0,0.15);border-radius:1px;"></div>'.repeat(3);
  track.appendChild(rightLines);

  const thumb = document.createElement('div');
  thumb.dataset.ptThumb = '1'; // _patchPanelToggle() targeted update için marker
  thumb.style.cssText = [
    'position:absolute;top:2px;',
    'left:' + (isPanelOpen ? '15px' : '2px') + ';',
    'width:11px;height:10px;border-radius:2px;',
    'background:linear-gradient(180deg,#ffffff 0%,#e4e4e4 100%);',
    'box-shadow:0 1px 2px rgba(0,0,0,0.38),inset 0 1px 0 rgba(255,255,255,0.9);',
    'transition:left 0.18s cubic-bezier(0.4,0,0.2,1);',
    'display:flex;align-items:center;justify-content:center;',
  ].join('');
  thumb.innerHTML = '<div style="display:flex;flex-direction:column;gap:2px;">' + '<div style="width:5px;height:1px;background:rgba(0,0,0,0.18);border-radius:1px;"></div>'.repeat(3) + '</div>';
  track.appendChild(thumb);
  btn.appendChild(track);

  btn.addEventListener('click', () => {
    // Closure yerine live state — hasSessions değişse bile doğru çalışır
    if (!this._st.panelSessions.length) return;
    const isPanelNew = !this._st.isPanelOpen;
    thumb.style.left = isPanelNew ? '15px' : '2px';
    setTimeout(() => this._handleTogglePanel(), 220);
  });
  return btn;
}

// ── Pin Switch ─────────────────────────────────────────────────────────────────
export function _buildPinSwitch() {
  const T  = this._T();
  const st = this._st;
  const isPinned = st.isPinnedRight;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;';

  const tooltip = document.createElement('div');
  tooltip.className = 'jw-tooltip';
  tooltip.innerHTML =
    '<div class="jw-tooltip-arrow" style="background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';border-left:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';border-top:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';"></div>' +
    '<div class="jw-tooltip-body" style="background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';color:' + (st.isDark ? '#cfe8f4' : 'var(--jules-primary)') + ';border:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';box-shadow:0 4px 14px rgba(0,0,0,' + (st.isDark ? '0.28' : '0.10') + ');">' + (isPinned ? 'Tam ekrana dön' : 'Sağa yapıştır') + '</div>';
  wrap.appendChild(tooltip);

  const btn = document.createElement('button');
  btn.id = 'jw-pin-switch';
  btn.className = 'jw-btn';
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
  tooltip.innerHTML =
    '<div class="jw-tooltip-arrow" style="background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';border-left:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';border-top:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';"></div>' +
    '<div class="jw-tooltip-body" style="background:' + (st.isDark ? 'rgba(10,26,38,0.97)' : 'rgba(245,250,252,0.98)') + ';color:' + (st.isDark ? '#cfe8f4' : 'var(--jules-primary)') + ';border:1px solid ' + (st.isDark ? 'var(--jules-primary)' : '#c8dde6') + ';box-shadow:0 4px 14px rgba(0,0,0,' + (st.isDark ? '0.28' : '0.10') + ');">' + (st.isDark ? 'Açık moda geç' : 'Koyu moda geç') + '</div>';
  wrap.appendChild(tooltip);

  const btn = document.createElement('button');
  btn.id = 'jw-dark-switch';
  btn.className = 'jw-btn';
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

  if (st.isDark) {
    track.innerHTML = '<div style="position:absolute;top:4px;left:14px;width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,0.5);"></div><div style="position:absolute;top:8px;left:20px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(255,255,255,0.35);"></div><div style="position:absolute;top:5px;left:26px;width:1px;height:1px;border-radius:50%;background:rgba(255,255,255,0.4);"></div>';
  } else {
    track.innerHTML = '<div style="position:absolute;top:3px;right:9px;width:2px;height:2px;border-radius:50%;background:rgba(245,158,11,0.5);"></div><div style="position:absolute;bottom:3px;right:14px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(245,158,11,0.4);"></div>';
  }

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
  wrap.appendChild(btn);
  return wrap;
}
