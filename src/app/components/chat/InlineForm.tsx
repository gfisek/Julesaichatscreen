/**
 * InlineForm.tsx — Chat içi inline form bileşeni (Figma Make görsel referansı)
 * Braun-inspired. FieldEl bileşeni InlineForm DIŞINDA tanımlanmıştır;
 * içeride tanımlansaydı her render'da unmount/remount olur → focus kaybolurdu.
 */
import { useState } from "react";
import { Send } from "lucide-react";
import { useJulesContext } from "../../context/JulesContext";
import type { FormType, FormFieldData } from "../../types/jules";

// ── Sabit veriler (modül scope — render bağımsız) ────────────────────────────
type FieldName = keyof Omit<FormFieldData, "kvkkAccepted">;

interface FieldMeta {
  label: string;
  type: "text" | "email" | "tel" | "area";
  placeholder: string;
  required: boolean;
  autocomplete: string;
}

const FORM_FIELDS: Record<FormType, FieldName[]> = {
  anaform: ["adSoyad", "eposta", "telefon", "mesaj"],
  adsoyad: ["adSoyad"],
  eposta:  ["eposta"],
};

const FIELD_META: Record<FieldName, FieldMeta> = {
  adSoyad: { label: "AD SOYAD", type: "text",  placeholder: "Adınız Soyadınız",    required: true,  autocomplete: "name"  },
  eposta:  { label: "E-POSTA",  type: "email", placeholder: "ornek@mail.com",       required: true,  autocomplete: "email" },
  telefon: { label: "TELEFON",  type: "tel",   placeholder: "05XX XXX XX XX",       required: false, autocomplete: "tel"   },
  mesaj:   { label: "MESAJ",    type: "area",  placeholder: "Mesajınızı yazın...",  required: true,  autocomplete: "off"   },
};

const FORM_TITLES: Record<FormType, string> = {
  anaform: "İLETİŞİM FORMU",
  adsoyad: "KİMLİK BİLGİSİ",
  eposta:  "E-POSTA",
};

function validate(name: FieldName, val: string): string | null {
  if (!val && FIELD_META[name].required)                                     return "Zorunlu alan.";
  if (name === "eposta"  && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Geçerli bir e-posta girin.";
  if (name === "telefon" && val && !/^[\d\s\-\+\(\)]{10,}$/.test(val))      return "Geçerli bir numara girin.";
  return null;
}

// ── Renk paleti ───────────────────────────────────────────────────────────────
// Light: pastel teal-blue (#e8f3f8 gövde, #f4f9fc bölüm, #ffffff input)
// Dark:  navy (#0d2235 gövde, #071722 bölüm, #132d42 input) — okunabilir kontrast
interface FormTokens {
  formBg:       string;  // form gövdesi (alanların arkası)
  sectionBg:    string;  // başlık / kvkk / footer
  inputBg:      string;  // input & textarea arka planı
  formBorder:   string;  // form içi border
  outerBorder:  string;  // dış çerçeve
  label:        string;  // alan etiketi rengi
  text:         string;  // input yazı rengi
  muted:        string;  // yardımcı metin
  accent:       string;  // odak, link
  placeholder:  string;
}

function getTokens(isDark: boolean): FormTokens {
  return isDark ? {
    formBg:      "#0d2235",
    sectionBg:   "#071722",
    inputBg:     "#132d42",
    formBorder:  "#1e4360",
    outerBorder: "#1d3547",
    label:       "#5a90aa",
    text:        "#cfe8f4",
    muted:       "#4a7a96",
    accent:      "#4dc4ce",
    placeholder: "#3d6a82",
  } : {
    formBg:      "#e8f3f8",
    sectionBg:   "#f4f9fc",
    inputBg:     "#ffffff",
    formBorder:  "#b8d0de",
    outerBorder: "#c8dde9",
    label:       "#6b8fa0",
    text:        "#111827",
    muted:       "#6b7280",
    accent:      "#0a6e82",
    placeholder: "#9ca3af",
  };
}

// ── FieldEl — InlineForm DIŞINDA (focus kayıp önlemi) ────────────────────────
interface FieldElProps {
  name:         FieldName;
  msgId:        string;
  value:        string;
  error?:       string;
  tk:           FormTokens;
  onChange:     (name: FieldName, val: string) => void;
  onClearError: (name: FieldName) => void;
}

function FieldEl({ name, msgId, value, error, tk, onChange, onClearError }: FieldElProps) {
  const meta   = FIELD_META[name];
  const hasErr = !!error;

  const baseInput: React.CSSProperties = {
    border:       `1.5px solid ${hasErr ? "#f87171" : tk.formBorder}`,
    borderRadius: "3px",
    background:   tk.inputBg,
    color:        tk.text,
    fontFamily:   "inherit",
    fontSize:     "12px",
    padding:      "7px 9px",
    outline:      "none",
    width:        "100%",
    transition:   "border-color 0.12s",
  };

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={`jf-${msgId}-${name}`}
        style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em", color: tk.label }}
      >
        {meta.label}{meta.required ? " *" : ""}
      </label>

      {meta.type === "area" ? (
        <textarea
          id={`jf-${msgId}-${name}`}
          placeholder={meta.placeholder}
          value={value}
          autoComplete={meta.autocomplete}
          rows={3}
          onChange={e => { onChange(name, e.target.value); onClearError(name); }}
          style={{
            ...baseInput,
            resize:      "none",
            minHeight:   "62px",
            maxHeight:   "100px",
            overflowY:   "auto",
            // placeholder rengi CSS değişkeni yerine inline style ile
            caretColor: tk.accent,
          }}
        />
      ) : (
        <input
          id={`jf-${msgId}-${name}`}
          type={meta.type}
          placeholder={meta.placeholder}
          value={value}
          autoComplete={meta.autocomplete}
          onChange={e => { onChange(name, e.target.value); onClearError(name); }}
          onFocus={e => { e.currentTarget.style.borderColor = tk.accent; }}
          onBlur={e  => { e.currentTarget.style.borderColor = hasErr ? "#f87171" : tk.formBorder; }}
          style={baseInput}
        />
      )}

      {hasErr && (
        <span style={{ fontSize: "9px", color: "#f87171", letterSpacing: "0.02em" }}>{error}</span>
      )}
    </div>
  );
}

// ── InlineForm ────────────────────────────────────────────────────────────────
interface InlineFormProps {
  formType:           FormType;
  msgId:              string;
  kvkkAlreadyAccepted: boolean;
  onSubmit:           (data: FormFieldData) => void;
  onKvkkAccepted:     () => void;
  submitted?:         boolean;
  submittedData?:     FormFieldData;
  isCompact?:         boolean;
  isPanelOpen?:       boolean;
}

export function InlineForm({
  formType, msgId, kvkkAlreadyAccepted,
  onSubmit, onKvkkAccepted,
  submitted = false, submittedData,
  isCompact = false,
}: InlineFormProps) {
  const { isDark } = useJulesContext();
  const tk = getTokens(isDark);

  // Genişlik: desktop'ta her zaman sabit (panel açık/kapalı fark etmez)
  const maxWidth   = isCompact ? "100%" : "min(440px, calc(100% - 38px))";
  const marginLeft = isCompact ? "0"    : "38px";
  const fields     = FORM_FIELDS[formType];
  // Grid: 2 kolon sadece desktop'ta (adSoyad + eposta yan yana)
  const useGrid    = !isCompact && fields.includes("adSoyad") && fields.includes("eposta");

  // KVKK fix: ilk render anındaki kabul durumunu sakla
  // Prop sonradan true olsa bile bu form KVKK'yı gizlemez
  const [initialKvkkAccepted] = useState(kvkkAlreadyAccepted);

  // KVKK sadece anaform ve eposta formlarında gösterilir
  const showKvkk = (formType === 'anaform' || formType === 'eposta') && !initialKvkkAccepted;

  const [values, setValues] = useState<Partial<Record<FieldName, string>>>({});
  const [errors, setErrors] = useState<Partial<Record<FieldName | "kvkk", string>>>({});
  const [kvkk,   setKvkk]   = useState(false);
  const [done,   setDone]   = useState(submitted);

  const handleChange     = (name: FieldName, val: string)  => setValues(prev => ({ ...prev, [name]: val }));
  const handleClearError = (name: FieldName)               => setErrors(prev => ({ ...prev, [name]: undefined }));

  // Gönder butonu aktiflik kontrolü: tüm zorunlu alanlar dolu + KVKK varsa onaylandı
  const requiredFields = fields.filter(name => FIELD_META[name].required);
  const allRequiredFilled = requiredFields.every(name => (values[name] || "").trim().length > 0);
  const kvkkOk = !showKvkk || kvkk;
  const isFormReady = allRequiredFilled && kvkkOk;

  const handleSubmit = () => {
    const newErrors: Partial<Record<FieldName | "kvkk", string>> = {};
    let valid = true;
    fields.forEach(name => {
      const err = validate(name, (values[name] || "").trim());
      if (err) { newErrors[name] = err; valid = false; }
    });
    if (showKvkk && !kvkk) { newErrors.kvkk = "KVKK onayı zorunludur."; valid = false; }
    if (!valid) { setErrors(newErrors); return; }

    const data: FormFieldData = { kvkkAccepted: true };
    fields.forEach(name => {
      const v = (values[name] || "").trim();
      if (v) (data as Record<string, string | boolean>)[name] = v;
    });
    if (showKvkk && kvkk) onKvkkAccepted();
    setDone(true);
    onSubmit(data);
  };

  // ── Stil yardımcıları ────────────────────────────────────────────────────────
  const wrapStyle: React.CSSProperties = {
    marginTop: "10px", marginLeft, maxWidth,
    border:       `1.5px solid ${tk.outerBorder}`,
    borderRadius: "5px",
    overflow:     "hidden",
  };
  const sectionStyle: React.CSSProperties = { background: tk.sectionBg };
  const divider: React.CSSProperties      = { borderTop: `1.5px solid ${tk.formBorder}` };
  const labelFont: React.CSSProperties    = { fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em" };

  // ── Success view ─────────────────────────────────────────────────────────────
  if (done) {
    const data = submittedData || (() => {
      const d: FormFieldData = { kvkkAccepted: true };
      fields.forEach(n => { const v = (values[n] || "").trim(); if (v) (d as Record<string, string | boolean>)[n] = v; });
      return d;
    })();

    return (
      <div style={{ ...wrapStyle, border: "1.5px solid rgba(22,163,74,0.28)" }}>
        <div className="flex items-center gap-2"
          style={{ padding: "8px 14px", borderBottom: "1px solid rgba(22,163,74,0.18)", background: isDark ? "rgba(22,163,74,0.08)" : "rgba(22,163,74,0.06)" }}>
          <div className="flex items-center justify-center shrink-0"
            style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(22,163,74,0.15)" }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <span style={{ ...labelFont, color: "#22c55e" }}>FORM GÖNDERİLDİ</span>
        </div>
        <div className="flex flex-col gap-1.5" style={{ padding: "11px 14px", background: tk.formBg }}>
          {fields.map(name => {
            const val = (data as Record<string, string | boolean>)[name];
            if (!val) return null;
            return (
              <div key={name} className="flex gap-3 items-start">
                <span style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.13em", color: tk.label, minWidth: "54px", flexShrink: 0, paddingTop: "2px" }}>
                  {FIELD_META[name].label}
                </span>
                <span style={{ fontSize: "11px", color: tk.text, wordBreak: "break-all", lineHeight: 1.5 }}>
                  {String(val)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Aktif form ───────────────────────────────────────────────────────────────
  return (
    <div style={{ ...wrapStyle, background: tk.formBg }}>

      {/* Başlık çubuğu */}
      <div className="flex items-center gap-2"
        style={{ padding: "8px 14px", ...sectionStyle, borderBottom: `1.5px solid ${tk.formBorder}` }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: tk.accent, flexShrink: 0, display: "inline-block" }} />
        <span style={{ ...labelFont, color: tk.label }}>{FORM_TITLES[formType]}</span>
      </div>

      {/* Alan gövdesi */}
      <div className="flex flex-col gap-[9px]" style={{ padding: "13px 14px" }}>
        {useGrid ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {(["adSoyad", "eposta"] as FieldName[]).map(name => (
                <FieldEl key={name} name={name} msgId={msgId}
                  value={values[name] || ""} error={errors[name]}
                  tk={tk} onChange={handleChange} onClearError={handleClearError} />
              ))}
            </div>
            {fields.filter(n => n !== "adSoyad" && n !== "eposta").map(name => (
              <FieldEl key={name} name={name} msgId={msgId}
                value={values[name] || ""} error={errors[name]}
                tk={tk} onChange={handleChange} onClearError={handleClearError} />
            ))}
          </>
        ) : (
          fields.map(name => (
            <FieldEl key={name} name={name} msgId={msgId}
              value={values[name] || ""} error={errors[name]}
              tk={tk} onChange={handleChange} onClearError={handleClearError} />
          ))
        )}
      </div>

      {/* KVKK — sadece anaform ve eposta formlarında; initialKvkkAccepted ile kontrol */}
      {showKvkk && (
        <>
          <div className="flex items-start gap-2"
            style={{ padding: "9px 14px", ...sectionStyle, ...divider }}>
            <input
              id={`jf-kvkk-${msgId}`}
              type="checkbox"
              checked={kvkk}
              onChange={e => {
                setKvkk(e.target.checked);
                // NOT: global state'i burada değil, sadece submit'te güncelle
                setErrors(prev => ({ ...prev, kvkk: undefined }));
              }}
              style={{ width: 13, height: 13, flexShrink: 0, marginTop: "2px", accentColor: tk.accent, cursor: "pointer" }}
            />
            <label htmlFor={`jf-kvkk-${msgId}`}
              style={{ fontSize: "10px", color: tk.muted, lineHeight: 1.55, cursor: "default" }}>
              Kişisel verilerimin{" "}
              <a href="#" onClick={e => e.preventDefault()}
                style={{ color: tk.accent, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                KVKK kapsamında
              </a>{" "}
              işlenmesine onay veriyorum.
            </label>
          </div>
          {errors.kvkk && (
            <span style={{ fontSize: "9px", color: "#f87171", padding: "0 14px 8px", display: "block" }}>
              {errors.kvkk}
            </span>
          )}
        </>
      )}

      {/* Gönder */}
      <div className="flex items-center justify-end"
        style={{ padding: "9px 14px", ...sectionStyle, ...divider }}>
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-1"
          style={{
            padding: "6px 15px", borderRadius: "3px",
            background: isFormReady ? "var(--jules-primary, #1c3d54)" : (isDark ? "#1a3247" : "#c0c0c0"),
            color: "white", ...labelFont, letterSpacing: "0.16em",
            border: "none",
            cursor: isFormReady ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            opacity: isFormReady ? 1 : 0.5,
            transition: "background 0.15s, opacity 0.15s",
          }}
          onMouseEnter={e => { if (isFormReady) (e.currentTarget as HTMLButtonElement).style.background = "var(--jules-secondary, #0a6e82)"; }}
          onMouseLeave={e => { if (isFormReady) (e.currentTarget as HTMLButtonElement).style.background = "var(--jules-primary, #1c3d54)"; }}
          disabled={!isFormReady}
        >
          <Send size={9} />
          <span>GÖNDER</span>
        </button>
      </div>
    </div>
  );
}