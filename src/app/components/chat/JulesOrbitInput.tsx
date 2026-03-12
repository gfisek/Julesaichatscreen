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
import { Mic, Send } from "lucide-react";
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

  // Ekstra butonlar — panel toggle switch vs. (ChatInput tarafından geçilir)
  extraButtons?: React.ReactNode;
};

const TYPEWRITER_DELAYS = { type: 48, erase: 26, pause: 1300, gap: 400 };

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
  extraButtons,
}: Props) {
  const { isDark }     = useJulesContext();
  const { textPrimary, textMuted, accentColor, accentDimBg, inputBg } = useJulesTokens();

  const textareaRef        = useRef<HTMLTextAreaElement>(null);
  const micErrorTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef     = useRef<any>(null);
  const preVoiceTextRef    = useRef("");
  const twActiveRef        = useRef(false);
  const twPhrasesRef       = useRef<string[]>([]);

  const [input, setInput]               = useState("");
  const [isFocused, setIsFocused]       = useState(false);
  const [isListening, setIsListening]   = useState(false);
  const [micError, setMicError]         = useState<string | null>(null);
  const [twText, setTwText]             = useState("");
  const [taHeight, setTaHeight]         = useState(24);

  const showTypewriter = !hasMessages && !isFocused && input === "";
  twPhrasesRef.current = suggestions;

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

    const type = (phrase: string, i: number) => {
      if (!twActiveRef.current) return;
      setTwText(phrase.slice(0, i));
      if (i < phrase.length) {
        timerId = setTimeout(() => type(phrase, i + 1), TYPEWRITER_DELAYS.type);
      } else if (typeOnce) {
        // Yazma bitti, kalıcı kal — sil/döngü yok
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
        phraseIdx = (phraseIdx + 1) % twPhrasesRef.current.length;
        timerId = setTimeout(() => type(twPhrasesRef.current[phraseIdx], 0), TYPEWRITER_DELAYS.gap);
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
      const newH = Math.min(e.target.scrollHeight, 112);
      e.target.style.height = newH + "px";
    }
    // Desktop non-compact: flex:1 fills container, overflowY:auto handles scroll
  };

  /* ── STT (Speech-to-Text) ─────────────────────────────────────────────────── */
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

  /* ── Hesaplanan değerler ───────────────────────────────────────────────────── */
  const innerH = heightOverride
    ? `${heightOverride}px`
    : isMobile ? `${taHeight + 14}px`
    : isCompact ? "54px"
    : "98px";

  const taFontSize = fontSize ?? (isMobile ? "16px" : "14px");

  const handleBoxClick = () => {
    if (readOnly) { onReadOnlyClick?.(); return; }
    textareaRef.current?.focus();
  };

  /* ── Render ────────────────────────────────────────────────────────────────── */
  return (
    <div style={{ position: "relative", width: "100%", borderRadius: "17px", padding: "1.5px", background: "transparent", overflow: "hidden", transition: "background 0.2s" }}>

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

      {/* İç kart */}
      <div
        className={isCompact
          ? "flex flex-row items-center gap-2 px-3 shadow-sm cursor-text"
          : "flex flex-col gap-1 p-2 shadow-sm cursor-text"}
        onClick={handleBoxClick}
        style={{
          position: "relative",
          height: innerH,
          borderRadius: "15.5px",
          zIndex: 1,
          background: readOnly ? (isDark ? "#132230" : "#ffffff") : inputBg,
          transition: "height 0.15s ease, background 0.3s",
        }}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={readOnly ? "" : input}
          readOnly={readOnly}
          onChange={readOnly ? undefined : handleInputChange}
          onKeyDown={readOnly ? undefined : handleKeyDown}
          onFocus={() => { if (!readOnly) setIsFocused(true); }}
          onBlur={() => setIsFocused(false)}
          placeholder={showTypewriter ? twText : "Bir şeyler sorun..."}
          className={`flex-1 w-full bg-transparent resize-none outline-none jw-textarea${isCompact ? " jw-compact-textarea" : ""}`}
          style={{
            "--jw-placeholder": readOnly && isDark ? "#9bcfdf" : textMuted,
            lineHeight: "1.5",
            cursor: readOnly ? "pointer" : "text",
            fontSize: taFontSize,
            color: textPrimary,
            alignSelf: isCompact ? "center" : undefined,
            maxHeight: isMobile ? "49px" : isCompact ? "36px" : undefined,
            overflowY: "auto",
            caretColor: readOnly ? "transparent" : undefined,
          } as React.CSSProperties}
          onClick={readOnly ? (e) => { e.stopPropagation(); onReadOnlyClick?.(); } : undefined}
        />

        {/* Buton satırı */}
        <div className="flex items-center gap-1 shrink-0 justify-end">

          {/* Ekstra buton yuvası — ChatInput: panel switch buraya */}
          {!readOnly && extraButtons}

          {/* STT dinleniyor göstergesi */}
          {isListening && !readOnly && (
            <span style={{ fontSize: "10px", color: "#ef4444", fontWeight: 500, letterSpacing: "0.02em", animation: "mic-ring 1.1s ease-out infinite", userSelect: "none" }}>
              Dinleniyor…
            </span>
          )}

          {/* Mikrofon butonu */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (readOnly) { onReadOnlyClick?.(); return; }
              toggleMic();
            }}
            title={isListening ? "Dinlemeyi durdur" : "Sesli yaz (Türkçe)"}
            className={`${readOnly ? "p-0.5" : "p-1.5"} rounded-lg transition-all ${!readOnly && isListening ? "mic-listening" : ""}`}
            style={{
              color: !readOnly && isListening ? "#ef4444" : textMuted,
              background: !readOnly && isListening ? "rgba(239,68,68,0.10)" : "transparent",
              cursor: "pointer",
            }}
            onMouseEnter={e => { if (!readOnly && !isListening) { (e.currentTarget as HTMLButtonElement).style.color = accentColor; (e.currentTarget as HTMLButtonElement).style.background = accentDimBg; } }}
            onMouseLeave={e => { if (!readOnly && !isListening) { (e.currentTarget as HTMLButtonElement).style.color = textMuted; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; } }}
          >
            <Mic size={readOnly ? 14 : 16} />
          </button>

          {/* Gönder butonu */}
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
            style={{
              color: textMuted,
              background: "transparent",
              cursor: "pointer",
              lineHeight: 0,
            }}
            onMouseEnter={e => { if (!readOnly && input.trim()) { (e.currentTarget as HTMLButtonElement).style.color = accentColor; (e.currentTarget as HTMLButtonElement).style.background = accentDimBg; } }}
            onMouseLeave={e => { if (!readOnly) { (e.currentTarget as HTMLButtonElement).style.color = textMuted; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; } }}
          >
            <span style={{ display: "flex" }}>
              <Send size={readOnly ? 16 : isMobile ? 17 : 19} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}