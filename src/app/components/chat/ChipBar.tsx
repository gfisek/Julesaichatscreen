import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useJulesContext } from "../../context/JulesContext";
import { useJulesTokens }  from "../../hooks/useJulesTokens";
import type { Message }    from "../../types/jules";

type Props = {
  messages: Message[];
  suggestions: string[];
  isCompact: boolean;
  isMobile?: boolean;
  isPinnedRight?: boolean;
  onChipSend: (text: string) => void;
};

export function ChipBar({ messages, suggestions, isCompact, isMobile, isPinnedRight, onChipSend }: Props) {
  const { isDark } = useJulesContext();
  const { textSecondary, textPrimary, accentColor, accentDimBg, accentDimBdr } = useJulesTokens();
  const chipScrollRef = useRef<HTMLDivElement>(null);
  const [chipScroll, setChipScroll]       = useState({ left: false, right: false });
  const [chipsExpanded, setChipsExpanded] = useState(false);

  const updateChipFade = () => {
    const el = chipScrollRef.current;
    if (!el) return;
    setChipScroll({
      left:  el.scrollLeft > 4,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 4,
    });
  };

  const scrollChips = (direction: "left" | "right") => {
    const el = chipScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -(el.clientWidth * 0.7) : (el.clientWidth * 0.7), behavior: "smooth" });
  };

  const handleChipClick = (s: string) => {
    onChipSend(s);
    if (isMobile || isPinnedRight) setChipsExpanded(false);
  };

  useEffect(() => {
    const t = setTimeout(() => updateChipFade(), 60);
    return () => clearTimeout(t);
  }, [messages, isPinnedRight, suggestions]);

  useEffect(() => { setChipsExpanded(false); }, [isPinnedRight]);

  if (messages.length === 0) return null;

  return (
    <div
      className="shrink-0 relative group"
      style={{ borderTop: `1px solid ${!isCompact ? "transparent" : (isDark ? "rgba(77,196,206,0.18)" : "rgba(10,110,130,0.13)")}` }}
    >
      {/* Mobile / Pinned-right toggle satırı */}
      {(isMobile || isPinnedRight) && (
        <div className={`flex items-center ${isPinnedRight && chipsExpanded ? "justify-between px-3" : "justify-center"}`}>
          {isPinnedRight && chipsExpanded ? (
            chipScroll.left
              ? <button onClick={() => scrollChips("left")} className="p-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  style={{ color: isDark ? "rgba(77,196,206,0.8)" : "rgba(10,110,130,0.7)", background: isDark ? "rgba(77,196,206,0.12)" : "rgba(10,110,130,0.08)", marginTop: "7px" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.background = "var(--jules-secondary)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = isDark ? "rgba(77,196,206,0.8)" : "rgba(10,110,130,0.7)"; (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(77,196,206,0.12)" : "rgba(10,110,130,0.08)"; }}>
                  <ChevronLeft size={13} />
                </button>
              : <div style={{ width: "21px", marginTop: "7px" }} />
          ) : null}

          <button onClick={() => setChipsExpanded(prev => !prev)} className="px-3 py-0.5 transition-colors"
            style={{ color: isDark ? "rgba(77,196,206,0.5)" : "rgba(10,110,130,0.4)" }}>
            <ChevronUp size={17} style={{ transform: chipsExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.22s ease" }} />
          </button>

          {isPinnedRight && chipsExpanded ? (
            chipScroll.right
              ? <button onClick={() => scrollChips("right")} className="p-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  style={{ color: isDark ? "rgba(77,196,206,0.8)" : "rgba(10,110,130,0.7)", background: isDark ? "rgba(77,196,206,0.12)" : "rgba(10,110,130,0.08)", marginTop: "7px" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.background = "var(--jules-secondary)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = isDark ? "rgba(77,196,206,0.8)" : "rgba(10,110,130,0.7)"; (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(77,196,206,0.12)" : "rgba(10,110,130,0.08)"; }}>
                  <ChevronRight size={13} />
                </button>
              : <div style={{ width: "21px", marginTop: "7px" }} />
          ) : null}
        </div>
      )}

      {/* Chips animasyonlu sarmalayıcı */}
      <div style={{
        overflow: "hidden",
        maxHeight: (isMobile || isPinnedRight) ? (chipsExpanded ? "120px" : "0px") : "none",
        transition: "max-height 0.25s ease",
      }}>
        {/* Sol ok — desktop tam ekran */}
        {chipScroll.left && !isCompact && (
          <div style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 10, display: "flex", alignItems: "center" }}>
            <button onClick={() => scrollChips("left")}
              className="p-1.5 rounded-full backdrop-blur-md shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-auto"
              style={{ color: textPrimary, transform: "translateX(-2px)", background: isDark ? "rgba(30,58,85,0.85)" : "rgba(255,255,255,0.95)", border: `1px solid ${isDark ? "rgba(77,196,206,0.3)" : "rgba(0,0,0,0.1)"}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--jules-secondary)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--jules-secondary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = textPrimary; (e.currentTarget as HTMLButtonElement).style.borderColor = isDark ? "rgba(77,196,206,0.3)" : "rgba(0,0,0,0.1)"; (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(30,58,85,0.85)" : "rgba(255,255,255,0.95)"; }}>
              <ChevronLeft size={14} />
            </button>
          </div>
        )}
        {/* Sağ ok — desktop tam ekran */}
        {chipScroll.right && !isCompact && (
          <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 10, display: "flex", alignItems: "center" }}>
            <button onClick={() => scrollChips("right")}
              className="p-1.5 rounded-full backdrop-blur-md shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-auto"
              style={{ color: textPrimary, transform: "translateX(2px)", background: isDark ? "rgba(30,58,85,0.85)" : "rgba(255,255,255,0.95)", border: `1px solid ${isDark ? "rgba(77,196,206,0.3)" : "rgba(0,0,0,0.1)"}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--jules-secondary)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--jules-secondary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = textPrimary; (e.currentTarget as HTMLButtonElement).style.borderColor = isDark ? "rgba(77,196,206,0.3)" : "rgba(0,0,0,0.1)"; (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(30,58,85,0.85)" : "rgba(255,255,255,0.95)"; }}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        <div className={isCompact ? "w-full" : "w-full flex justify-center px-4"}>
          <div
            ref={chipScrollRef}
            onScroll={updateChipFade}
            className={`pb-2 flex gap-2 shrink-0 ${isCompact ? "pt-3 overflow-x-auto jw-chip-scroll-container" : "pt-3 overflow-x-auto justify-center flex-wrap"}`}
            style={{
              width: isCompact ? "100%" : "700px", maxWidth: "100%",
              boxSizing: isCompact ? "border-box" : undefined,
              paddingLeft: isCompact ? "16px" : undefined,
              paddingRight: isCompact ? "16px" : undefined,
              scrollPaddingLeft: isCompact ? "16px" : undefined,
              scrollbarWidth: "none",
              msOverflowStyle: "none" as any,
              scrollSnapType: isCompact ? "x mandatory" : "none",
            }}
          >
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleChipClick(s)}
                className="px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap shrink-0 jw-chip-snap"
                style={{ borderColor: accentDimBdr, fontSize: "10px", color: textSecondary, background: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor; (e.currentTarget as HTMLButtonElement).style.color = accentColor; (e.currentTarget as HTMLButtonElement).style.background = accentDimBg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = accentDimBdr; (e.currentTarget as HTMLButtonElement).style.color = textSecondary; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}