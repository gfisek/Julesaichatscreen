import { Sparkles, Bot } from "lucide-react";
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
  isGlowing: boolean;
  hasMessages: boolean;
};

export function ChatInput({
  onSend, isCompact, isMobile, isPinnedRight, isGlowing, hasMessages,
}: Props) {
  const { isDark } = useJulesContext();
  const { textPrimary, textMuted, accentColor } = useJulesTokens();

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
        <p style={{ fontSize: "10px", color: textMuted, textAlign: "center", lineHeight: 1.6 }}>
          {isCompact ? (
            <><span style={{ display: "block" }}>Cevaplar hata içerebilir.</span><span style={{ display: "block" }}>Önemli bilgileri kontrol edin.</span></>
          ) : (
            "Cevaplar hata içerebilir. Önemli bilgileri kontrol edin."
          )}
        </p>
        {isCompact ? (
          <a
            href="https://creator.com.tr" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1px", textDecoration: "none", transition: "color 0.15s", color: isDark ? "#6fa8bf" : "#6b7280" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#34d399"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = isDark ? "#6fa8bf" : "#6b7280"; }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Sparkles size={9} style={{ color: accentColor, flexShrink: 0 }} />
              <span style={{ fontWeight: 500, fontSize: "10px", textDecoration: "underline", textUnderlineOffset: "2px" }}>Powered by</span>
            </span>
            <span style={{ fontWeight: 500, fontSize: "10px", textDecoration: "underline", textUnderlineOffset: "2px" }}>Creator AI</span>
          </a>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
        )}
      </div>
    </div>
  );
}
