import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import { X as PhosphorX } from "@phosphor-icons/react";
import { CardView } from "../ContentPanel";
import { useJulesContext } from "../../context/JulesContext";
import { useJulesTokens }  from "../../hooks/useJulesTokens";
import type { CardItem }   from "../../types/jules";

export type FavCard = { card: CardItem; sessionId: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  allFavCards: FavCard[];
  totalFavCount: number;
  isMobile?: boolean;
  onProductClick?: (productId: string) => void;
};

export function FavoritesDrawer({ isOpen, onClose, allFavCards, totalFavCount, isMobile, onProductClick }: Props) {
  const { isDark, onLikedCardsChange } = useJulesContext();
  const { textPrimary, textMuted, border } = useJulesTokens();
  const [drawerDragY, setDrawerDragY]   = useState(0);
  const drawerTouchStartY               = useRef(0);

  const handleLike = (key: string) => {
    onLikedCardsChange(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: isDark ? "#0c1c28" : "#ffffff",
          borderRadius: "20px 20px 0 0", height: "75vh",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
          transform: `translateY(${drawerDragY}px)`,
          transition: drawerDragY === 0 ? "transform 0.3s cubic-bezier(0.32,0.72,0,1)" : "none",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div
          style={{ display: "flex", justifyContent: "center", paddingTop: "10px", paddingBottom: "8px", cursor: "grab", touchAction: "none" }}
          onTouchStart={e => { drawerTouchStartY.current = e.touches[0].clientY; setDrawerDragY(0); }}
          onTouchMove={e => { const dy = e.touches[0].clientY - drawerTouchStartY.current; if (dy > 0) setDrawerDragY(dy); }}
          onTouchEnd={() => { if (drawerDragY > 80) { onClose(); setDrawerDragY(0); } else { setDrawerDragY(0); } }}
        >
          {isMobile && null}
        </div>

        {/* Header */}
        <div style={{ padding: "10px 16px 12px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Heart size={14} style={{ color: "#f87171", fill: "#f87171" } as React.CSSProperties} />
            <span style={{ fontSize: "14px", fontWeight: 600, color: textPrimary }}>Favorilerim</span>
            {totalFavCount > 0 && (
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#f87171", background: isDark ? "rgba(248,113,113,0.12)" : "#fff5f5", border: "1px solid #fca5a5", borderRadius: "20px", padding: "1px 7px" }}>
                {totalFavCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ color: textMuted, background: isDark ? "#1a3247" : "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer", padding: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <PhosphorX size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {allFavCards.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <Heart size={32} style={{ color: isDark ? "#1d3547" : "#e5e7eb", margin: "0 auto 12px" } as React.CSSProperties} />
              <p style={{ fontSize: "14px", color: textMuted, marginBottom: "6px" }}>Henüz favori eklemediniz</p>
              <p style={{ fontSize: "12px", color: isDark ? "#2a4a5e" : "#d1d5db" }}>Kartların üzerindeki ♥ ikonuna dokunun</p>
            </div>
          ) : (
            <div style={{ padding: "12px 14px 20px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {allFavCards.map(({ card, sessionId }) => (
                <CardView
                  key={`${sessionId}-${card.id}`}
                  card={card}
                  liked={true}
                  onLike={() => handleLike(`${sessionId}-${card.id}`)}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}