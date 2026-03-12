import { useRef, useState } from "react";
import { Sparkles, Bot } from "lucide-react";
import { SwitchTooltip }   from "./SwitchTooltip";
import { JulesOrbitInput } from "./JulesOrbitInput";
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
  const { textPrimary, textMuted, textSecondary, accentColor, border } = useJulesTokens();

  const panelToggleBtnRef   = useRef<HTMLButtonElement>(null);
  const panelToggleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [panelToggleTooltip, setPanelToggleTooltip] = useState(false);

  /* ── Panel toggle switch — sadece desktop (!isCompact) modunda görünür ─── */
  const panelSwitch = !isCompact ? (
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
  ) : null;

  return (
    <div className={`${isMobile ? "pb-2" : "pb-4"} shrink-0 flex flex-col items-center`}>
      <div className="w-full flex justify-center px-4">
        <div style={{ position: "relative", width: "700px", maxWidth: "100%" }}>
          <JulesOrbitInput
            onSend={onSend}
            isCompact={isCompact}
            isMobile={isMobile}
            isPinnedRight={isPinnedRight}
            isGlowing={isGlowing}
            hasMessages={hasMessages}
            suggestions={TYPEWRITER_PHRASES}
            extraButtons={panelSwitch}
          />
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
