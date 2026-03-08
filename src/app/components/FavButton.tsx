import { Heart } from "lucide-react";
import { useJulesContext } from "../context/JulesContext";

type Props = {
  totalFavCount: number;
  onClick: () => void;
};

export function FavButton({ totalFavCount, onClick }: Props) {
  const { isDark } = useJulesContext();
  const textMuted   = isDark ? "#3d7089" : "#9ca3af";
  const accentDimBg = isDark ? "rgba(77,196,206,0.10)" : "var(--jules-accent-bg)";

  return (
    <button
      onClick={onClick}
      className="relative p-1.5 rounded-lg transition-colors"
      style={{ color: totalFavCount > 0 ? "#f87171" : textMuted, background: "transparent" }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = accentDimBg; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
    >
      <Heart
        size={16}
        style={{ fill: totalFavCount > 0 ? "#f87171" : "none", color: totalFavCount > 0 ? "#f87171" : textMuted }}
      />
      {totalFavCount > 0 && (
        <span style={{
          position: "absolute", top: "1px", right: "1px",
          width: "14px", height: "14px", borderRadius: "50%",
          background: "#f87171", color: "#fff",
          fontSize: "8px", fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
        }}>
          {totalFavCount}
        </span>
      )}
    </button>
  );
}
