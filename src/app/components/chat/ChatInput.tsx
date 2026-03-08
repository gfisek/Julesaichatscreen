import { useState, useRef, useEffect } from "react";
import { Mic, Sparkles, Bot } from "lucide-react";
import { ArrowUp } from "@phosphor-icons/react";
import { SwitchTooltip }   from "./SwitchTooltip";
import { useJulesContext }  from "../../context/JulesContext";
import { useJulesTokens }   from "../../hooks/useJulesTokens";

const TYPEWRITER_PHRASES = [
  "Bir şeyler sorun...",
  "Seyahat planı yap...",
  "Fiyat karşılaştır...",
  "Hafta sonu nereye gideyim?",
  "Trend ürünleri göster...",
  "Yakınımdaki kafeler...",
];

type Props = {
  onSend: (text: string) => void;
  isCompact: boolean;
  isMobile?: boolean;
  isPinnedRight?: boolean;
  isPanelOpen: boolean;
  hasPanelSessions: boolean;
  onTogglePanel: () => void;
  isGlowing: boolean;
  hasMessages: boolean;
};

export function ChatInput({
  onSend, isCompact, isMobile, isPinnedRight,
  isPanelOpen, hasPanelSessions, onTogglePanel,
  isGlowing, hasMessages,
}: Props) {
  const { isDark } = useJulesContext();
  const { textPrimary, textMuted, textSecondary, accentColor, accentDimBg, border, inputBg } = useJulesTokens();
  const textareaRef         = useRef<HTMLTextAreaElement>(null);
  const panelToggleBtnRef   = useRef<HTMLButtonElement>(null);
  const micErrorTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef      = useRef<any>(null);
  const preVoiceTextRef     = useRef("");
  const panelToggleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const twActiveRef         = useRef(false);
  const twPhrasesRef        = useRef<string[]>([]);

  const [input, setInput]                   = useState("");
  const [isFocused, setIsFocused]           = useState(false);
  const [isListening, setIsListening]       = useState(false);
  const [micError, setMicError]             = useState<string | null>(null);
  const [panelToggleTooltip, setPanelToggleTooltip] = useState(false);
  const [twText, setTwText]                 = useState("");
  const [taHeight, setTaHeight]             = useState(24); // textarea px yüksekliği (mobil dinamik)

  const showTypewriter = !hasMessages && !isFocused && input === "";
  twPhrasesRef.current = TYPEWRITER_PHRASES;

  /* ── Typewriter ── */
  useEffect(() => {
    if (!showTypewriter) { twActiveRef.current = false; setTwText(""); return; }
    twActiveRef.current = true;
    let phraseIdx = 0;
    let timerId: ReturnType<typeof setTimeout>;
    function type(phrase: string, charIdx: number) {
      if (!twActiveRef.current) return;
      setTwText(phrase.slice(0, charIdx));
      if (charIdx < phrase.length) timerId = setTimeout(() => type(phrase, charIdx + 1), 48);
      else timerId = setTimeout(() => erase(phrase, phrase.length), 1300);
    }
    function erase(phrase: string, charIdx: number) {
      if (!twActiveRef.current) return;
      setTwText(phrase.slice(0, charIdx));
      if (charIdx > 0) timerId = setTimeout(() => erase(phrase, charIdx - 1), 26);
      else { phraseIdx = (phraseIdx + 1) % twPhrasesRef.current.length; timerId = setTimeout(() => type(twPhrasesRef.current[phraseIdx], 0), 400); }
    }
    type(twPhrasesRef.current[phraseIdx], 0);
    return () => { twActiveRef.current = false; clearTimeout(timerId); };
  }, [showTypewriter]); // eslint-disable-line react-hooks/exhaustive-deps

  const showMicError = (msg: string) => {
    if (micErrorTimerRef.current) clearTimeout(micErrorTimerRef.current);
    setMicError(msg);
    micErrorTimerRef.current = setTimeout(() => setMicError(null), 3500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (isMobile) {
      setTaHeight(24);
      textareaRef.current?.blur(); // klavyeyi kapat
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    const maxH = isMobile ? 49 : 112; // mobilde max 2 satır (~49px)
    const newH = Math.min(e.target.scrollHeight, maxH);
    e.target.style.height = newH + "px";
    if (isMobile) setTaHeight(newH);
  };

  const toggleMic = () => {
    if (isListening) { recognitionRef.current?.stop(); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { showMicError("Ses tanıma bu tarayıcıda desteklenmiyor. Chrome veya Edge kullanın."); return; }
    preVoiceTextRef.current = input;
    const rec = new SR();
    rec.lang = "tr-TR"; rec.continuous = false; rec.interimResults = true; rec.maxAlternatives = 1;
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInput((preVoiceTextRef.current ? preVoiceTextRef.current + " " : "") + (final || interim));
    };
    rec.onend = () => {
      setIsListening(false); recognitionRef.current = null;
      setTimeout(() => {
        textareaRef.current?.focus();
        if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 112) + "px"; }
      }, 80);
    };
    rec.onerror = (e: any) => {
      setIsListening(false); recognitionRef.current = null;
      if (e.error === "not-allowed") showMicError("Mikrofon izni reddedildi. Tarayıcı ayarlarından izin verin.");
      else if (e.error === "no-speech") showMicError("Ses algılanamadı. Lütfen tekrar deneyin.");
      else if (e.error === "audio-capture") showMicError("Mikrofona erişilemiyor. Bağlantıyı kontrol edin.");
    };
    recognitionRef.current = rec; rec.start();
  };

  return (
    <div className={`${isMobile ? "pb-2" : "pb-4"} shrink-0 flex flex-col items-center`}>
      <div className="w-full flex justify-center px-4">
        <div style={{ position: "relative", width: "700px", maxWidth: "100%" }}>

          {/* Mic error toast */}
          {micError && (
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

          {/* Orbit border wrapper */}
          <div style={{ position: "relative", width: "100%", borderRadius: "17px", padding: "1.5px", background: "transparent", overflow: "hidden", transition: "background 0.2s" }}>
            <div
              className={`${isDark ? "input-orbit-active-dark" : "input-orbit-active"} ${isGlowing ? "orbit-glowing" : ""}`}
              style={{ position: "absolute", inset: 0, zIndex: 0 }}
            />
            <div
              className={isCompact ? "flex flex-row items-center gap-2 px-3 shadow-sm cursor-text" : "flex flex-col gap-1 p-2 shadow-sm cursor-text"}
              onClick={() => textareaRef.current?.focus()}
              style={{ position: "relative", height: isMobile ? `${taHeight + 14}px` : isCompact ? "54px" : "98px", borderRadius: "15.5px", zIndex: 1, background: inputBg, transition: "height 0.15s ease, background 0.3s" }}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={showTypewriter ? twText : "Bir şeyler sorun..."}
                className={`flex-1 w-full bg-transparent resize-none outline-none jw-textarea${isCompact ? " jw-compact-textarea" : ""}`}
                style={{
                  "--jw-placeholder": textMuted,
                  lineHeight: "1.5", cursor: "text",
                  fontSize: isMobile ? "16px" : isPinnedRight ? "14px" : "12px",
                  color: textPrimary,
                  alignSelf: isCompact ? "center" : undefined,
                  maxHeight: isMobile ? "49px" : isCompact ? "36px" : undefined,
                  overflowY: isMobile ? "hidden" : isCompact ? "auto" : undefined,
                } as React.CSSProperties}
              />

              <div className="flex items-center gap-1 shrink-0 justify-end">
                {/* Panel toggle switch — desktop only */}
                {!isCompact && (
                  <button
                    ref={panelToggleBtnRef}
                    onClick={onTogglePanel}
                    disabled={!hasPanelSessions}
                    className="flex items-center transition-opacity"
                    style={{ opacity: hasPanelSessions ? 1 : 0.28, cursor: hasPanelSessions ? "pointer" : "not-allowed" }}
                    onMouseEnter={() => { if (hasPanelSessions) { panelToggleTimerRef.current = setTimeout(() => setPanelToggleTooltip(true), 500); } }}
                    onMouseLeave={() => { if (panelToggleTimerRef.current) clearTimeout(panelToggleTimerRef.current); setPanelToggleTooltip(false); }}
                  >
                    <SwitchTooltip
                      text={isPanelOpen ? "Kartları gizle" : "Kartları göster"}
                      visible={panelToggleTooltip}
                      anchorRef={panelToggleBtnRef}
                    />
                    <div style={{
                      position: "relative", width: "30px", height: "16px", borderRadius: "3px",
                      background: isPanelOpen
                        ? "linear-gradient(180deg, var(--jules-secondary) 0%, var(--jules-accent) 100%)"
                        : isDark ? "linear-gradient(180deg, #1a3247 0%, #1e3a55 100%)" : "linear-gradient(180deg, #c0c0c0 0%, #d4d4d4 100%)",
                      boxShadow: isPanelOpen
                        ? "inset 0 2px 3px rgba(0,0,0,0.35), inset 0 -1px 1px rgba(255,255,255,0.12), 0 0 6px rgba(10,110,130,0.3)"
                        : "inset 0 2px 3px rgba(0,0,0,0.22), inset 0 -1px 1px rgba(255,255,255,0.1)",
                      transition: "background 0.2s",
                      border: isPanelOpen ? "1px solid #076575" : `1px solid ${border}`,
                    }}>
                      <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "3px", display: "flex", flexDirection: "column", gap: "2px" }}>
                        {[0,1,2].map(i => <div key={i} style={{ width: "4px", height: "1px", background: "rgba(255,255,255,0.3)", borderRadius: "1px" }} />)}
                      </div>
                      <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "3px", display: "flex", flexDirection: "column", gap: "2px" }}>
                        {[0,1,2].map(i => <div key={i} style={{ width: "4px", height: "1px", background: "rgba(0,0,0,0.15)", borderRadius: "1px" }} />)}
                      </div>
                      <div style={{
                        position: "absolute", top: "2px", left: isPanelOpen ? "15px" : "2px",
                        width: "11px", height: "10px", borderRadius: "2px",
                        background: "linear-gradient(180deg, #ffffff 0%, #e4e4e4 100%)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.9)",
                        transition: "left 0.18s cubic-bezier(0.4,0,0.2,1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          {[0,1,2].map(i => <div key={i} style={{ width: "5px", height: "1px", background: "rgba(0,0,0,0.18)", borderRadius: "1px" }} />)}
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                {isListening && (
                  <span style={{ fontSize: "10px", color: "#ef4444", fontWeight: 500, letterSpacing: "0.02em", animation: "mic-ring 1.1s ease-out infinite", userSelect: "none" }}>
                    Dinleniyor…
                  </span>
                )}
                <button
                  onClick={toggleMic}
                  title={isListening ? "Dinlemeyi durdur" : "Sesli yaz (Türkçe)"}
                  className={`p-1.5 rounded-lg transition-all ${isListening ? "mic-listening" : ""}`}
                  style={{ color: isListening ? "#ef4444" : textMuted, background: isListening ? "rgba(239,68,68,0.10)" : "transparent", cursor: "pointer" }}
                  onMouseEnter={e => { if (!isListening) { (e.currentTarget as HTMLButtonElement).style.color = accentColor; (e.currentTarget as HTMLButtonElement).style.background = accentDimBg; } }}
                  onMouseLeave={e => { if (!isListening) { (e.currentTarget as HTMLButtonElement).style.color = textMuted; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; } }}
                >
                  <Mic size={16} />
                </button>
                <button
                  onClick={handleSend}
                  onTouchEnd={(e) => {
                    e.preventDefault(); // simulated click'i engelle, klavye kapatmayı garantile
                    if (!input.trim()) return;
                    textareaRef.current?.blur(); // önce blur → klavye kapanır
                    setTimeout(handleSend, 0);  // sonra gönder
                  }}
                  disabled={!input.trim()}
                  className="flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  style={{ background: "var(--jules-secondary)", width: "63px", borderRadius: "7px", padding: "5px 0" }}
                >
                  <ArrowUp size={13} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand footer */}
      <div className="flex items-center justify-between w-full px-4 mt-2 mb-0.5" style={{ maxWidth: "700px", alignSelf: "center" }}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "var(--jules-secondary)" }}>
              <Bot size={12} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full"
              style={{ border: `1.5px solid ${isDark ? "#132230" : "#f9fafb"}` }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "11px", color: textPrimary, lineHeight: 1.2 }}>JULES</p>
            <p style={{ fontWeight: 500, fontSize: "9px", color: "#34d399", lineHeight: 1.2 }}>Çevrimiçi</p>
          </div>
        </div>
        <p style={{ fontSize: "10px", color: textMuted, textAlign: "center", lineHeight: isCompact ? 1.6 : undefined }}>
          {isCompact
            ? <>AI yanıtlar hata içerebilir.<br />Önemli bilgileri doğrulayın.</>
            : "AI yanıtlar hata içerebilir. Önemli bilgileri doğrulayın."}
        </p>
        <div className="flex items-center gap-1">
          <Sparkles size={9} style={{ color: accentColor, flexShrink: 0 }} />
          <a
            href="https://creator.com.tr" target="_blank" rel="noopener noreferrer"
            style={{ fontWeight: 500, color: isDark ? "#6fa8bf" : "#6b7280", fontSize: "10px", textDecoration: "underline", textUnderlineOffset: "2px", transition: "color 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#34d399"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = isDark ? "#6fa8bf" : "#6b7280"; }}
          >
            Powered by Creator AI
          </a>
        </div>
      </div>
    </div>
  );
}