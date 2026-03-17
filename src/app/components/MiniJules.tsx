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
  "Merhaba, size nasıl yardımcı olabilirim?",
  "Seyahat planı yap...",
  "Fiyat karşılaştır...",
  "Hafta sonu nereye gideyim?",
  "Trend ürünleri göster...",
  "Yakınımdaki kafeler...",
];

const MINI_RETURN_PHRASE = ["Size nasıl yardımcı olabilirim?"];

export type IntroPhase = "idle" | "flying" | "typing" | "exit" | "done";

type Props = {
  isPinnedRight?: boolean;
  suggestions?: string[];
  hasMessages?: boolean;
  onExpand: () => void;
  // Intro animasyon props
  containerRef?: (el: HTMLDivElement | null) => void;
  introPhase?: IntroPhase;
  introText?: string;
};

export function MiniJules({
  isPinnedRight,
  suggestions,
  hasMessages,
  onExpand,
  containerRef,
  introPhase = "idle",
  introText = "",
}: Props) {
  // Mesaj varsa: tek cümle + typeOnce; yoksa: tam liste döngüsü
  const phrases = hasMessages
    ? MINI_RETURN_PHRASE
    : (suggestions?.length ? suggestions : MINI_SUGGESTIONS);

  // İlk açılış animasyon class'ı — bir kez uygulanır
  const isFirstOpen = !_hasAppearedOnce;
  if (isFirstOpen) _hasAppearedOnce = true;

  // Intro aktifken ilk açılış animasyonu çakışmasın
  const animClass = (isFirstOpen && introPhase === "idle")
    ? (isPinnedRight ? "mini-jules-first-open-right" : "mini-jules-first-open-center")
    : "";

  // Intro sırasında: chevron gizli, tıklamalar engelli
  const isIntroActive = introPhase !== "idle" && introPhase !== "done";

  // Intro aktifken textarea yüksekliği büyür (flying/typing/exit fazlarında)
  const heightOverride = isIntroActive ? 60 : 24;

  const outerStyle: React.CSSProperties = isPinnedRight
    ? {
        position: "fixed", top: 0, right: 0,
        width: "390px",
        padding: "4px 12px",
        display: "flex", justifyContent: "flex-end",
        zIndex: 9998,
        background: "transparent",
        pointerEvents: isIntroActive ? "none" : "auto",
        touchAction: "manipulation",   /* iOS double-tap / pinch-zoom engellensin */
      }
    : {
        position: "fixed", top: 0, left: 0, right: 0,
        padding: "4px 16px",
        display: "flex", justifyContent: "center",
        zIndex: 9998,
        background: "transparent",
        pointerEvents: isIntroActive ? "none" : "auto",
        touchAction: "manipulation",   /* iOS double-tap / pinch-zoom engellensin */
      };

  return (
    <div
      ref={containerRef}
      style={outerStyle}
      className={animClass}
    >
      {/* Sadece orbit input — tüm tıklamalar onExpand'ı çağırır */}
      <div style={{
        display: "flex", alignItems: "center",
        width: isPinnedRight ? "100%" : "350px",
        maxWidth: "calc(100vw - 32px)",
      }}>
        <div style={{ flex: 1, filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.16))" }}>
          <JulesOrbitInput
            onSend={() => {}}
            readOnly={!isIntroActive}
            onReadOnlyClick={isIntroActive ? undefined : onExpand}
            isCompact
            isMobile={false}
            heightOverride={heightOverride}
            fontSize="13px"
            isGlowing={false}
            hasMessages={false}
            suggestions={isIntroActive ? [] : phrases}
            typeOnce={!!hasMessages}
            introPlaceholder={isIntroActive && introText !== undefined ? introText : undefined}
          />
        </div>
      </div>
    </div>
  );
}