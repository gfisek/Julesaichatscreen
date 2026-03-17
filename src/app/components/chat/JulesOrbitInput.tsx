/**
 * JulesOrbitInput.tsx — Paylaşımlı orbit-border input kutusu
 *
 * Hem ChatInput (tam mod) hem MiniJules (readOnly/expand modu) tarafından kullanılır.
 * Bu bileşen dışında textarea/orbit/mic/send kodu YOKTUR.
 *
 * readOnly=true → tüm etkileşimler onReadOnlyClick'i çağırır (MiniJules expand)
 * readOnly=false → tam STT + send fonksiyonelliği (ChatInput normal modu)
 */
import { useState, useRef, useEffect } from "react";
import { Mic, Send, Volume2 } from "lucide-react";
import { useJulesContext } from "../../context/JulesContext";
import { useJulesTokens } from "../../hooks/useJulesTokens";

type Props = {
  // Core
  onSend: (text: string) => void;
  suggestions: string[];
  hasMessages?: boolean;
  isGlowing?: boolean;

  // Layout
  isCompact: boolean;
  isMobile?: boolean;
  isPinnedRight?: boolean;
  heightOverride?: number;  // px — varsayılan hesaplamayı ezer (MiniJules: 44)
  fontSize?: string;         // varsayılan font boyutunu ezer (MiniJules: "14px")

  // ReadOnly modu — MiniJules: her tıklama onReadOnlyClick'i çağırır
  readOnly?: boolean;
  onReadOnlyClick?: () => void;

  // typeOnce — ilk cümleyi yazıp dur, silme/döngü yok (hasMessages sonrası MiniJules)
  typeOnce?: boolean;

  // introPlaceholder — intro animasyonu sırasında typewriter'ı bypass eder
  introPlaceholder?: string;
};

const TYPEWRITER_DELAYS = { type: 48, erase: 26, pause: 1300, gap: 400 };

// ── EQ bar renk/gecikme tanımları ─────────────────────────────────────────────
const EQ_BARS = [
  { color: "#ff4d6d", delay: "0ms"   },
  { color: "#ff9a3c", delay: "85ms"  },
  { color: "#f7d700", delay: "170ms" },
  { color: "#2ecc71", delay: "255ms" },
  { color: "#4dc4ce", delay: "170ms" },
  { color: "#4488ff", delay: "85ms"  },
];

/** Speaker aktifken — gökkuşağı EQ barları, ikon tamamen gizlenir */
function EqBars() {
  return (
    <span style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "1.5px", pointerEvents: "none",
    }}>
      {EQ_BARS.map((bar, i) => (
        <span key={i} style={{
          width: "2px", height: "3px",
          background: bar.color,
          borderRadius: "1px",
          display: "inline-block",
          animationName: "jw-eq-bar",
          animationDuration: "0.65s",
          animationTimingFunction: "ease-in-out",
          animationDelay: bar.delay,
          animationIterationCount: "infinite",
        }} />
      ))}
    </span>
  );
}

export function JulesOrbitInput({
  onSend,
  suggestions,
  hasMessages = false,
  isGlowing = false,
  isCompact,
  isMobile,
  isPinnedRight,
  heightOverride,
  fontSize,
  readOnly = false,
  onReadOnlyClick,
  typeOnce = false,
  introPlaceholder,
}: Props) {
  const { isDark }     = useJulesContext();
  const { textPrimary, textMuted, accentColor, accentDimBg, inputBg } = useJulesTokens();

  const textareaRef        = useRef<HTMLTextAreaElement>(null);
  const wrapperRef         = useRef<HTMLDivElement>(null);
  const micErrorTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef     = useRef<any>(null);
  const preVoiceTextRef    = useRef("");
  const twActiveRef        = useRef(false);
  const twPhrasesRef       = useRef<string[]>([]);

  const [input, setInput]               = useState("");
  const [isFocused, setIsFocused]       = useState(false);
  const [isListening, setIsListening]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [micError, setMicError]         = useState<string | null>(null);
  const [twText, setTwText]             = useState("");
  const [taHeight, setTaHeight]         = useState(24);
  const [compactTaHeight, setCompactTaHeight] = useState(36); /* pinned-right satır yüksekliği */

  const showTypewriter = !hasMessages && !isFocused && input === "" && !introPlaceholder;
  twPhrasesRef.current = suggestions;

  /* ── Mobile keyboard — visualViewport resize handler ─────────────────────── */
  useEffect(() => {
    if (!isMobile || readOnly) return;
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      if (document.activeElement === textareaRef.current) {
        requestAnimationFrame(() => {
          wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
      }
    };

    vv.addEventListener("resize", handleResize);
    return () => vv.removeEventListener("resize", handleResize);
  }, [isMobile, readOnly]);

  /* ── Typewriter ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!showTypewriter || suggestions.length === 0) {
      twActiveRef.current = false;
      setTwText("");
      return;
    }
    twActiveRef.current = true;
    let phraseIdx = 0;
    let timerId: ReturnType<typeof setTimeout>;

    const type = (phrase: string | undefined, i: number) => {
      if (!twActiveRef.current || !phrase) return;
      setTwText(phrase.slice(0, i));
      if (i < phrase.length) {
        timerId = setTimeout(() => type(phrase, i + 1), TYPEWRITER_DELAYS.type);
      } else if (typeOnce) {
        return;
      } else {
        timerId = setTimeout(() => erase(phrase, phrase.length), TYPEWRITER_DELAYS.pause);
      }
    };
    const erase = (phrase: string, i: number) => {
      if (!twActiveRef.current) return;
      setTwText(phrase.slice(0, i));
      if (i > 0)
        timerId = setTimeout(() => erase(phrase, i - 1), TYPEWRITER_DELAYS.erase);
      else {
        if (!twPhrasesRef.current.length) return;
        phraseIdx = (phraseIdx + 1) % twPhrasesRef.current.length;
        const nextPhrase = twPhrasesRef.current[phraseIdx];
        if (!nextPhrase) return;
        timerId = setTimeout(() => type(nextPhrase, 0), TYPEWRITER_DELAYS.gap);
      }
    };

    type(suggestions[phraseIdx], 0);
    return () => { twActiveRef.current = false; clearTimeout(timerId); };
  }, [showTypewriter, typeOnce]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Mic hata göstergesi ───────────────────────────────────────────────────── */
  const showMicError = (msg: string) => {
    if (micErrorTimerRef.current) clearTimeout(micErrorTimerRef.current);
    setMicError(msg);
    micErrorTimerRef.current = setTimeout(() => setMicError(null), 3500);
  };

  /* ── Send ──────────────────────────────────────────────────────────────────── */
  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (isMobile) { setTaHeight(24); textareaRef.current?.blur(); }
    if (isCompact && !isMobile) setCompactTaHeight(36); /* compact yüksekliği sıfırla */
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (isMobile) {
      e.target.style.height = "auto";
      const newH = Math.min(e.target.scrollHeight, 49);
      e.target.style.height = newH + "px";
      setTaHeight(newH);
    } else if (isCompact) {
      e.target.style.height = "auto";
      const newH = Math.min(e.target.scrollHeight, 48); /* 2 satır cap */
      e.target.style.height = newH + "px";
      setCompactTaHeight(newH);
    }
  };

  /* ── STT (Speech-to-Text) ───────────────────────────────────────────────── */
  const toggleMic = () => {
    if (isListening) { recognitionRef.current?.stop(); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { showMicError("Ses tanıma bu tarayıcıda desteklenmiyor. Chrome veya Edge kullanın."); return; }
    preVoiceTextRef.current = input;
    const rec = new SR();
    rec.lang = "tr-TR"; rec.continuous = false; rec.interimResults = true; rec.maxAlternatives = 1;
    rec.onstart  = () => setIsListening(true);
    rec.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final  += e.results[i][0].transcript;
        else                      interim += e.results[i][0].transcript;
      }
      setInput((preVoiceTextRef.current ? preVoiceTextRef.current + " " : "") + (final || interim));
    };
    rec.onend = () => {
      setIsListening(false); recognitionRef.current = null;
      setTimeout(() => {
        textareaRef.current?.focus();
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 112) + "px";
        }
      }, 80);
    };
    rec.onerror = (e: any) => {
      setIsListening(false); recognitionRef.current = null;
      if      (e.error === "not-allowed")   showMicError("Mikrofon izni reddedildi. Tarayıcı ayarlarından izin verin.");
      else if (e.error === "no-speech")     showMicError("Ses algılanamadı. Lütfen tekrar deneyin.");
      else if (e.error === "audio-capture") showMicError("Mikrofona erişilemiyor. Bağlantıyı kontrol edin.");
    };
    recognitionRef.current = rec; rec.start();
  };

  /* ── Speaker (TTS stub) ───────────────────────────────────────────────────── */
  const toggleSpeaker = () => {
    setIsSpeaking(v => !v);
    // TODO: Web Speech API SpeechSynthesis entegrasyonu
  };

  /* ── Hesaplanan değerler ───────────────────────────────────────────────────── */
  const innerH = heightOverride
    ? `${heightOverride}px`
    : isMobile ? `${taHeight + 14}px`
    : isCompact ? `${Math.max(compactTaHeight + 18, 54)}px`  /* compact container textarea ile büyür */
    : "98px";

  const taFontSize = fontSize ?? (isMobile ? "16px" : "14px");

  // ── MiniJules modu: heightOverride set ise her zaman kompakt boyutlar ─────────
  const isInMiniJules   = !!heightOverride;
  const isExpandedMode  = isInMiniJules && (heightOverride ?? 0) > 30;
  const btnPad          = isInMiniJules ? "p-0.5" : (readOnly ? "p-0.5" : "p-1.5");
  const btnIconSm       = (isInMiniJules || readOnly) ? 14 : 16;
  const sendIconSm      = (isInMiniJules || readOnly) ? 16 : (isMobile ? 17 : 19);

  const handleBoxClick = () => {
    if (readOnly) { onReadOnlyClick?.(); return; }
    textareaRef.current?.focus();
  };

  // ── Ortak buton hover handler'ları ──────────────────────────────────────────
  const btnHoverOn  = (el: HTMLButtonElement) => { el.style.color = accentColor; el.style.background = accentDimBg; };
  const btnHoverOff = (el: HTMLButtonElement, clr: string) => { el.style.color = clr; el.style.background = "transparent"; };

  /* ── Render ────────────────────────────────────────────────────────────────── */
  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", borderRadius: "17px", padding: "1.5px", background: "transparent", overflow: "hidden", transition: "background 0.2s" }}>

      {/* Mic hata toast'u */}
      {micError && !readOnly && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
          background: "rgba(220,38,38,0.92)", color: "#fff", fontSize: "11px", fontWeight: 500,
          padding: "6px 14px 6px 10px", borderRadius: "20px", whiteSpace: "nowrap",
          pointerEvents: "none", zIndex: 20, boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
          display: "flex", alignItems: "center", gap: "6px",
          animation: "jw-toast-in 0.2s ease forwards",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {micError}
        </div>
      )}

      {/* Orbit animasyon arka planı */}
      <div
        className={`${isDark ? "input-orbit-active-dark" : "input-orbit-active"} ${isGlowing ? "orbit-glowing" : ""}`}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      />

      {/* ── COMPACT (mobile / pinned-right) iç kart ── */}
      {isCompact && (
        <div
          className="flex flex-row gap-2 px-3 shadow-sm cursor-text"
          onClick={handleBoxClick}
          style={{
            position: "relative",
            height: innerH,
            alignItems: "center",
            borderRadius: "15.5px",
            zIndex: 1,
            background: readOnly ? (isDark ? "#132230" : "#ffffff") : inputBg,
            transition: "height 0.5s ease, background 0.3s",
          }}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={isExpandedMode ? 2 : 1}
            value={readOnly ? "" : input}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : undefined}
            onChange={readOnly ? undefined : handleInputChange}
            onKeyDown={readOnly ? undefined : handleKeyDown}
            onFocus={(e) => {
              /* readOnly: iOS zoom & cursor'ı önle — anında blur */
              if (readOnly) { e.currentTarget.blur(); return; }
              setIsFocused(true);
              if (isMobile) {
                setTimeout(() => {
                  wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
                }, 350);
              }
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={introPlaceholder ?? (showTypewriter ? twText : "Bir şeyler sorun...")}
            className={`flex-1 w-full bg-transparent resize-none outline-none jw-textarea jw-compact-textarea`}
            style={{
              "--jw-placeholder": readOnly && isDark ? "#9bcfdf" : textMuted,
              lineHeight: "1.5",
              cursor: readOnly ? "pointer" : "text",
              fontSize: taFontSize,
              color: textPrimary,
              alignSelf: "center",
              maxHeight: readOnly
                ? (isExpandedMode ? "46px" : (isMobile ? "49px" : "36px"))
                : (isMobile ? "120px" : "48px"),   /* compact: 2 satır cap */
              overflowY: readOnly ? "hidden" : "auto",   /* readOnly'de gizli, aktif'te scroll */
              caretColor: readOnly ? "transparent" : undefined,
              userSelect: readOnly ? "none" : undefined,
              WebkitUserSelect: readOnly ? "none" : undefined,
            } as React.CSSProperties}
            onClick={readOnly ? (e) => { e.stopPropagation(); onReadOnlyClick?.(); } : undefined}
          />

          {/* Buton grubu */}
          <div
            className="flex items-center gap-1 shrink-0"
            style={isExpandedMode ? { alignSelf: "flex-end", paddingBottom: "5px" } : undefined}
          >
            {/* Speaker */}
            <button
              onClick={(e) => { e.stopPropagation(); if (readOnly) { onReadOnlyClick?.(); return; } toggleSpeaker(); }}
              title={isSpeaking ? "Seslendirmeyi durdur" : "Cevapları seslendir"}
              className={`${btnPad} flex items-center justify-center rounded-lg transition-all`}
              style={{
                position: "relative",
                color: isSpeaking ? "var(--jules-accent)" : textMuted,
                background: isSpeaking ? "rgba(27,163,184,0.10)" : "transparent",
                cursor: "pointer",
                lineHeight: 0,
              }}
              onMouseEnter={e => { if (!readOnly && !isSpeaking) btnHoverOn(e.currentTarget as HTMLButtonElement); }}
              onMouseLeave={e => { if (!readOnly && !isSpeaking) btnHoverOff(e.currentTarget as HTMLButtonElement, textMuted); }}
            >
              {isSpeaking && <EqBars />}
              <Volume2 size={btnIconSm} style={{ opacity: isSpeaking ? 0 : 1 }} />
            </button>

            {/* Mikrofon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (readOnly) { onReadOnlyClick?.(); return; }
                toggleMic();
              }}
              title={isListening ? "Seslendirmeyi durdur" : "Sesli yaz (Türkçe)"}
              className={`${btnPad} flex items-center justify-center rounded-lg transition-all`}
              style={{
                position: "relative",
                color: !readOnly && isListening ? accentColor : textMuted,
                background: !readOnly && isListening ? accentDimBg : "transparent",
                cursor: "pointer",
                lineHeight: 0,
              }}
              onMouseEnter={e => { if (!readOnly && !isListening) btnHoverOn(e.currentTarget as HTMLButtonElement); }}
              onMouseLeave={e => { if (!readOnly && !isListening) btnHoverOff(e.currentTarget as HTMLButtonElement, textMuted); }}
            >
              {/* Blink: span yok — animasyon class doğrudan SVG'e, layout sabit */}
              <Mic size={btnIconSm} className={!readOnly && isListening ? "mic-active-icon" : ""} />
            </button>

            {/* Gönder */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (readOnly) { onReadOnlyClick?.(); return; }
                handleSend();
              }}
              onTouchEnd={readOnly ? undefined : (e) => {
                e.preventDefault();
                if (!input.trim()) return;
                textareaRef.current?.blur();
                setTimeout(handleSend, 0);
              }}
              disabled={!readOnly && !input.trim()}
              className={`${btnPad} flex items-center justify-center rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
              style={{ color: (!readOnly && input.trim()) ? accentColor : textMuted, background: "transparent", cursor: "pointer", lineHeight: 0 }}
              onMouseEnter={e => { if (!readOnly && input.trim()) btnHoverOn(e.currentTarget as HTMLButtonElement); }}
              onMouseLeave={e => { if (!readOnly) { (e.currentTarget as HTMLButtonElement).style.color = input.trim() ? accentColor : textMuted; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; } }}
            >
              <span style={{ display: "flex" }}>
                <Send size={sendIconSm} />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ── DESKTOP (non-compact) iç kart — panel switch solda ── */}
      {!isCompact && (
        <div
          className="flex flex-col gap-1 p-2 shadow-sm cursor-text"
          onClick={handleBoxClick}
          style={{
            position: "relative",
            height: innerH,
            minHeight: "98px",
            borderRadius: "15.5px",
            zIndex: 1,
            background: readOnly ? (isDark ? "#132230" : "#ffffff") : inputBg,
            transition: "height 0.15s ease, background 0.3s",
          }}
        >
          {/* Textarea + buton satırı */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={readOnly ? "" : input}
            readOnly={readOnly}
            onChange={readOnly ? undefined : handleInputChange}
            onKeyDown={readOnly ? undefined : handleKeyDown}
            onFocus={() => { if (!readOnly) setIsFocused(true); }}
            onBlur={() => setIsFocused(false)}
            placeholder={introPlaceholder ?? (showTypewriter ? twText : "Bir şeyler sorun...")}
            className="flex-1 w-full bg-transparent resize-none outline-none jw-textarea"
            style={{
              "--jw-placeholder": readOnly && isDark ? "#9bcfdf" : textMuted,
              lineHeight: "1.5",
              cursor: readOnly ? "pointer" : "text",
              fontSize: taFontSize,
              color: textPrimary,
              overflowY: "auto",
              caretColor: readOnly ? "transparent" : undefined,  /* yalnızca readOnly/intro'da gizle */
            } as React.CSSProperties}
            onClick={readOnly ? (e) => { e.stopPropagation(); onReadOnlyClick?.(); } : undefined}
          />

          {/* Buton satırı — alt sağ */}
          <div className="flex items-center gap-1 shrink-0 justify-end">

            {/* Speaker */}
            <button
              onClick={(e) => { e.stopPropagation(); if (readOnly) { onReadOnlyClick?.(); return; } toggleSpeaker(); }}
              title={isSpeaking ? "Seslendirmeyi durdur" : "Cevapları seslendir"}
              className="p-1.5 rounded-lg transition-all"
              style={{
                position: "relative",
                color: isSpeaking ? "var(--jules-accent)" : textMuted,
                background: isSpeaking ? "rgba(27,163,184,0.10)" : "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={e => { if (!isSpeaking) btnHoverOn(e.currentTarget as HTMLButtonElement); }}
              onMouseLeave={e => { if (!isSpeaking) btnHoverOff(e.currentTarget as HTMLButtonElement, textMuted); }}
            >
              {isSpeaking && <EqBars />}
              <Volume2 size={16} style={{ opacity: isSpeaking ? 0 : 1 }} />
            </button>

            {/* Mikrofon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (readOnly) { onReadOnlyClick?.(); return; }
                toggleMic();
              }}
              title={isListening ? "Seslendirmeyi durdur" : "Sesli yaz (Türkçe)"}
              className={`${readOnly ? "p-0.5" : "p-1.5"} rounded-lg transition-all`}
              style={{
                position: "relative",
                color: !readOnly && isListening ? accentColor : textMuted,
                background: !readOnly && isListening ? accentDimBg : "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={e => { if (!readOnly && !isListening) btnHoverOn(e.currentTarget as HTMLButtonElement); }}
              onMouseLeave={e => { if (!readOnly && !isListening) btnHoverOff(e.currentTarget as HTMLButtonElement, textMuted); }}
            >
              {/* Blink: span yok — animasyon class doğrudan SVG'e, layout sabit */}
              <Mic size={readOnly ? 14 : 16} className={!readOnly && isListening ? "mic-active-icon" : ""} />
            </button>

            {/* Gönder */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (readOnly) { onReadOnlyClick?.(); return; }
                handleSend();
              }}
              onTouchEnd={readOnly ? undefined : (e) => {
                e.preventDefault();
                if (!input.trim()) return;
                textareaRef.current?.blur();
                setTimeout(handleSend, 0);
              }}
              disabled={!readOnly && !input.trim()}
              className={`${readOnly ? "p-0.5" : "p-1.5"} flex items-center justify-center rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
              style={{ color: (!readOnly && input.trim()) ? accentColor : textMuted, background: "transparent", cursor: "pointer", lineHeight: 0 }}
              onMouseEnter={e => { if (!readOnly && input.trim()) btnHoverOn(e.currentTarget as HTMLButtonElement); }}
              onMouseLeave={e => { if (!readOnly) { (e.currentTarget as HTMLButtonElement).style.color = input.trim() ? accentColor : textMuted; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; } }}
            >
              <span style={{ display: "flex" }}>
                <Send size={readOnly ? 16 : 19} />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}