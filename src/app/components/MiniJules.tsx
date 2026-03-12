/**
 * MiniJules.tsx — Minimize edilmiş durum çubuğu
 *
 * Orbit input, mic, send → doğrudan JulesOrbitInput (sıfır kod tekrarı)
 * Chevron → kapsayıcının dışında, transparent bg, teal renk
 */
import { ChevronDown } from "lucide-react";
import { JulesOrbitInput } from "./chat/JulesOrbitInput";

const MINI_SUGGESTIONS = [
  "Merhaba, size nasıl yardımcı olabilirim?",
  "Seyahat planı yap...",
  "Fiyat karşılaştır...",
  "Hafta sonu nereye gideyim?",
  "Trend ürünleri göster...",
  "Yakınımdaki kafeler...",
];

const MINI_RETURN_PHRASE = ["Size nasıl yardımcı olabilirim?"];

type Props = {
  isPinnedRight?: boolean;
  suggestions?: string[];
  hasMessages?: boolean;
  onExpand: () => void;
};

export function MiniJules({ isPinnedRight, suggestions, hasMessages, onExpand }: Props) {
  // Mesaj varsa: tek cümle + typeOnce; yoksa: tam liste döngüsü
  const phrases = hasMessages
    ? MINI_RETURN_PHRASE
    : (suggestions?.length ? suggestions : MINI_SUGGESTIONS);

  const outerStyle: React.CSSProperties = isPinnedRight
    ? {
        position: "fixed", top: 0, right: 0,
        width: "390px",
        padding: "4px 12px",
        display: "flex", justifyContent: "flex-end",
        zIndex: 9998,
        background: "transparent",
        pointerEvents: "auto",
        transition: "background 0.3s",
      }
    : {
        position: "fixed", top: 0, left: 0, right: 0,
        padding: "4px 16px",
        display: "flex", justifyContent: "center",
        zIndex: 9998,
        background: "transparent",
        pointerEvents: "auto",
        transition: "background 0.3s",
      };

  return (
    <div style={outerStyle}>
      {/* Satır: [orbit input] + [chevron] */}
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        width: isPinnedRight ? "100%" : "350px",
        maxWidth: "calc(100vw - 32px)",
      }}>

        {/* JulesOrbitInput — readOnly modda, tüm tıklamalar onExpand'ı çağırır */}
        <div style={{ flex: 1, filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.16))" }}>
          <JulesOrbitInput
            onSend={() => {}}
            readOnly
            onReadOnlyClick={onExpand}
            isCompact
            isMobile={false}
            heightOverride={24}
            fontSize="13px"
            isGlowing={false}
            hasMessages={false}
            suggestions={phrases}
            typeOnce={!!hasMessages}
          />
        </div>

        {/* Chevron — dışarıda, transparent, teal */}
        <button
          onClick={onExpand}
          title="Jules'ı aç"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", cursor: "pointer",
            padding: "6px", borderRadius: "8px",
            color: "var(--jules-secondary)",
            opacity: 0.85, flexShrink: 0,
            transition: "opacity 0.15s, transform 0.2s, color 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(3px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}