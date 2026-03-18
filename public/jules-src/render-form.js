/**
 * render-form.js — Inline chat form builder (Braun-inspired design)
 * _buildInlineForm · _buildFormSuccess
 */
import { ICO }                     from './icons.js';
import { esc }                     from './utils.js';
import { FORM_CONFIG, FIELD_META } from './constants.js';

// ── Validasyon ────────────────────────────────────────────────────────────────
function _validate(name, val) {
  if (!val && FIELD_META[name].required)                                    return 'Zorunlu alan.';
  if (name === 'eposta'  && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Geçerli bir e-posta girin.';
  if (name === 'telefon' && val && !/^[\d\s\-\+\(\)]{10,}$/.test(val))       return 'Geçerli bir numara girin.';
  return null;
}

// ── _buildInlineForm ──────────────────────────────────────────────────────────
export function _buildInlineForm(formType, msgId) {
  const self         = this;
  const cfg          = FORM_CONFIG[formType] || {};
  const fields       = cfg.fields || [];
  const isMob        = this._st.isMobile;
  const isPinned     = this._st.isPinnedRight;
  const isPanelOpen  = this._st.isPanelOpen;
  const isDesktopFull = !isMob && !isPinned && !isPanelOpen;

  const useGrid = isDesktopFull && fields.includes('adSoyad') && fields.includes('eposta');

  // ── Dış kap ────────────────────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.className = 'jw-form';
  wrap.dataset.formMsg = '1';
  if (isMob || isPinned) {
    wrap.style.marginLeft = '0';
    wrap.style.maxWidth   = '100%';
  } else if (isDesktopFull) {
    wrap.style.maxWidth = 'min(440px, calc(100% - 38px))';
  }

  // ── Başlık çubuğu ──────────────────────────────────────────────────────────
  const head = document.createElement('div');
  head.className = 'jw-form-head';

  const dot = document.createElement('span');
  dot.className = 'jw-form-head-dot';
  head.appendChild(dot);

  const headLbl = document.createElement('span');
  headLbl.className = 'jw-form-head-label';
  headLbl.textContent = cfg.title || 'FORM';
  head.appendChild(headLbl);
  wrap.appendChild(head);

  // ── İçerik kutusu ──────────────────────────────────────────────────────────
  const body = document.createElement('div');
  body.className = 'jw-form-body';

  // KVKK checkbox (zaten kabul edilmişse gösterme)
  const showKvkk = !this._st.kvkkAccepted;

  // Grid düzeni (ad+email yan yana) veya dikey
  const fieldsWrap = document.createElement('div');
  if (useGrid) {
    fieldsWrap.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;';
  } else {
    fieldsWrap.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
  }

  const inputEls = {};

  fields.forEach(name => {
    const meta = FIELD_META[name];
    if (!meta) return;

    const fieldWrap = document.createElement('div');
    const isArea    = meta.type === 'area';

    if (isArea && useGrid) {
      fieldWrap.style.gridColumn = '1 / -1';
    }

    const label = document.createElement('label');
    label.className = 'jw-field-label';
    label.textContent = meta.label;
    fieldWrap.appendChild(label);

    let input;
    if (isArea) {
      input = document.createElement('textarea');
      input.rows = 3;
      input.className = 'jw-field jw-field-area';
    } else {
      input = document.createElement('input');
      input.type = meta.type;
      input.className = 'jw-field';
    }
    input.placeholder   = meta.placeholder;
    input.autocomplete  = meta.autocomplete;
    input.dataset.field = name;

    const errSpan = document.createElement('span');
    errSpan.className = 'jw-field-err';

    input.addEventListener('blur', () => {
      const err = _validate(name, input.value.trim());
      errSpan.textContent = err || '';
      input.classList.toggle('jw-field-invalid', !!err);
    });

    fieldWrap.appendChild(input);
    fieldWrap.appendChild(errSpan);
    fieldsWrap.appendChild(fieldWrap);
    inputEls[name] = input;
  });

  body.appendChild(fieldsWrap);

  // KVKK
  if (showKvkk) {
    const kvkkRow = document.createElement('label');
    kvkkRow.className = 'jw-kvkk-row';

    const kvkkBox = document.createElement('input');
    kvkkBox.type = 'checkbox';
    kvkkBox.className = 'jw-kvkk-check';
    // NOT burada global state mutasyonu yapma — sadece submit'te set edilmeli
    kvkkRow.appendChild(kvkkBox);

    const kvkkTxt = document.createElement('span');
    kvkkTxt.className = 'jw-kvkk-txt';
    kvkkTxt.innerHTML = '<a href="#" target="_blank" rel="noopener noreferrer">Gizlilik Politikası</a>\'nı okudum ve kabul ediyorum.';
    kvkkRow.appendChild(kvkkTxt);
    body.appendChild(kvkkRow);
  }

  // Submit butonu
  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'jw-submit-btn';
  submitBtn.textContent = 'Gönder';
  submitBtn.addEventListener('click', () => {
    let hasError = false;
    const data = { kvkkAccepted: this._st.kvkkAccepted };

    fields.forEach(name => {
      const el  = inputEls[name];
      if (!el) return;
      const val = el.value.trim();
      const err = _validate(name, val);
      const errSpan = el.nextElementSibling;
      if (errSpan && errSpan.classList.contains('jw-field-err')) {
        errSpan.textContent = err || '';
        el.classList.toggle('jw-field-invalid', !!err);
      }
      if (err) hasError = true;
      data[name] = val;
    });

    if (showKvkk) {
      const kvkkCheck = body.querySelector('.jw-kvkk-check');
      if (kvkkCheck && !kvkkCheck.checked) {
        hasError = true;
      } else if (kvkkCheck && kvkkCheck.checked) {
        data.kvkkAccepted = true;
      }
    }

    if (!hasError) {
      self._handleFormSubmit(msgId, formType, data);
    }
  });

  body.appendChild(submitBtn);
  wrap.appendChild(body);
  return wrap;
}

// ── _buildFormSuccess ─────────────────────────────────────────────────────────
export function _buildFormSuccess(formType, data) {
  const T  = this._T();
  const st = this._st;

  const wrap = document.createElement('div');
  wrap.className = 'jw-form';
  wrap.dataset.formMsg = '1';
  if (!st.isMobile && !st.isPinnedRight) {
    wrap.style.maxWidth = st.isPanelOpen ? 'calc(100% - 38px)' : 'min(440px, calc(100% - 38px))';
  }

  const body = document.createElement('div');
  body.className = 'jw-form-body';
  body.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:12px;padding:16px;text-align:center;';

  body.innerHTML = [
    '<div style="width:40px;height:40px;border-radius:50%;background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);display:flex;align-items:center;justify-content:center;">',
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    '</div>',
    '<p style="font-size:13px;font-weight:600;color:' + T.textPrimary + ';">Bilgileriniz alındı!</p>',
    '<p style="font-size:11px;color:' + T.textMuted + ';line-height:1.6;">',
      (data && data.adSoyad ? esc(data.adSoyad) + ', size' : 'Size') + ' en kısa sürede dönüş yapacağız.',
    '</p>',
  ].join('');

  wrap.appendChild(body);
  return wrap;
}