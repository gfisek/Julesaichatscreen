import { useRef, useState, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { useJulesContext } from "../../context/JulesContext";

export function SwitchTooltip({
  text,
  visible,
  anchorRef,
}: {
  text: string;
  visible: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { isDark } = useJulesContext();
  const tipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clampDx, setClampDx] = useState(0);

  useLayoutEffect(() => {
    if (!visible || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.bottom + 10 });
    setClampDx(0);
  }, [visible, anchorRef]);

  useLayoutEffect(() => {
    if (!visible || !tipRef.current) return;
    const tr = tipRef.current.getBoundingClientRect();
    const MARGIN = 12;
    let dx = 0;
    if (tr.right > window.innerWidth - MARGIN) dx = window.innerWidth - MARGIN - tr.right;
    if (tr.left + dx < MARGIN) dx = MARGIN - tr.left;
    setClampDx(dx);
  }, [visible, pos]);

  if (typeof document === "undefined") return null;

  // Touch/mobile cihazlarda tooltip gösterme
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null;

  const glassBase   = isDark ? "rgba(8,20,30,0.82)"               : "rgba(248,252,255,0.80)";
  const glassBorder = isDark ? "1px solid rgba(77,163,184,0.30)"  : "1px solid rgba(180,215,230,0.75)";
  const glassColor  = isDark ? "#b8dff0"                          : "#1c3d54";
  const glassShadow = isDark
    ? "0 8px 32px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.07)"
    : "0 8px 32px rgba(28,61,84,0.12), 0 2px 8px rgba(28,61,84,0.07), inset 0 1px 0 rgba(255,255,255,0.75)";
  const caretBg     = isDark ? "rgba(12,26,38,0.88)"  : "rgba(242,250,254,0.88)";
  const caretBorder = isDark ? "rgba(77,163,184,0.30)" : "rgba(180,215,230,0.75)";

  return ReactDOM.createPortal(
    <div style={{
      position: "fixed",
      left: pos.x + clampDx,
      top: pos.y,
      transform: `translateX(-50%) translateY(${visible ? "0px" : "-5px"})`,
      pointerEvents: "none",
      zIndex: 99999,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.20s ease, transform 0.20s ease",
      whiteSpace: "nowrap",
    }}>
      {/* caret */}
      <div style={{
        position: "absolute", top: "-4px",
        left: `calc(50% - ${clampDx}px)`,
        transform: "translateX(-50%) rotate(45deg)",
        width: "8px", height: "8px",
        background: caretBg,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderLeft: `1px solid ${caretBorder}`, borderTop: `1px solid ${caretBorder}`,
        borderRadius: "2px 0 0 0",
      }} />
      {/* body */}
      <div ref={tipRef} style={{
        background: glassBase,
        backdropFilter: "blur(18px) saturate(1.8)", WebkitBackdropFilter: "blur(18px) saturate(1.8)",
        color: glassColor,
        fontSize: "9px", fontWeight: 500,
        padding: "6px 12px", borderRadius: "10px",
        border: glassBorder, boxShadow: glassShadow,
        letterSpacing: "0.025em",
      }}>
        {text}
      </div>
    </div>,
    document.body
  );
}