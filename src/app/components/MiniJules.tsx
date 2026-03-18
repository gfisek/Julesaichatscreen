/**
 * MiniJules.tsx — Minimize edilmiş durum çubuğu
 *
 * Orbit input, mic, send → doğrudan JulesOrbitInput (sıfır kod tekrarı)
 * Chevron kaldırıldı — orbit input tıklanarak açılır
 */
import { JulesOrbitInput } from "./chat/JulesOrbitInput";

// ── İlk açılış flag'i — modül düzeyinde, mount/unmount'tan bağımsız ─────────
let _hasAppearedOnce = false;

const MINI_SUGGESTIONS = [
  "iPhone 16 Pro?",
  "Mac Air mı, Pro mu?",
  "iPad modelleri",
  "Servis randevusu",
  "AppleCare+ nedir?",
  "Garantim doldu?",
];

const MINI_RETURN_PHRASE = ["Size nasıl yardımcı olabilirim?"];

type Props = {
  isPinnedRight?: boolean;
  suggestions?: string[];
  hasMessages?: boolean;
  onExpand: () => void;
  containerRef?: (el: HTMLDivElement | null) => void;
  isAnimating?: boolean;
};

export function MiniJules({
  isPinnedRight,
  suggestions,
  hasMessages,
  onExpand,
  containerRef,
  isAnimating = false,
}: Props) {
  const phrases = hasMessages
    ? MINI_RETURN_PHRASE
    : (suggestions?.length ? suggestions : MINI_SUGGESTIONS);

  // İlk açılış animasyon class'ı — bir kez uygulanır
  const isFirstOpen = !_hasAppearedOnce;
  if (isFirstOpen) _hasAppearedOnce = true;

  const animClass = (isFirstOpen && !isAnimating)
    ? (isPinnedRight ? "mini-jules-first-open-right" : "mini-jules-first-open-center")
    : "";

  const outerStyle: React.CSSProperties = isPinnedRight
    ? {
        position: "fixed", top: 0, right: 0,
        width: "390px",
        padding: "4px 12px",
        display: "flex", justifyContent: "flex-end",
        zIndex: 9998,
        background: "transparent",
        pointerEvents: isAnimating ? "none" : "auto",
        touchAction: "manipulation",
      }
    : {
        position: "fixed", top: 0, left: 0, right: 0,
        padding: "4px 16px",
        display: "flex", justifyContent: "center",
        zIndex: 9998,
        background: "transparent",
        pointerEvents: isAnimating ? "none" : "auto",
        touchAction: "manipulation",
      };

  return (
    <div
      ref={containerRef}
      style={outerStyle}
      className={animClass}
    >
      <div style={{
        display: "flex", alignItems: "center",
        width: isPinnedRight ? "100%" : "350px",
        maxWidth: "calc(100vw - 32px)",
      }}>
        <div style={{ flex: 1, filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.16))" }}>
          <JulesOrbitInput
            onSend={() => {}}
            readOnly={true}
            onReadOnlyClick={isAnimating ? undefined : onExpand}
            isCompact
            isMobile={false}
            heightOverride={24}
            fontSize="13px"
            isGlowing={false}
            hasMessages={false}
            suggestions={isAnimating ? [] : phrases}
            typeOnce={!!hasMessages}
          />
        </div>
      </div>
    </div>
  );
}