import { useState, useRef, useEffect } from "react";
import {
  CloudSun, CloudFog, Sun, SunDim, CloudRain,
  CloudSnow, CloudLightning, Snowflake, SunHorizon,
  Moon, Monitor, SidebarSimple,
} from "@phosphor-icons/react";
import { ChevronLeft, ChevronUp } from "lucide-react";
import { SwitchTooltip } from "./SwitchTooltip";
import { FavButton }     from "../FavButton";
import { useJulesContext } from "../../context/JulesContext";
import { useJulesTokens }  from "../../hooks/useJulesTokens";

type WeatherInfo = { temp: number; code: number; sunrise: string; sunset: string };

type Props = {
  isMobile?: boolean;
  isPinnedRight?: boolean;
  isCompact: boolean;
  border: string;
  onClose?: () => void;
  onShowFavDrawer: () => void;
  totalFavCount: number;
  isPanelOpen: boolean;
  hasPanelSessions: boolean;
  onTogglePanel: () => void;
  onTogglePinnedRight?: () => void;
};

export function ChatHeader({
  isMobile, isPinnedRight, isCompact, border,
  onClose, onShowFavDrawer, totalFavCount,
  isPanelOpen, hasPanelSessions, onTogglePanel, onTogglePinnedRight,
}: Props) {
  const { isDark, onToggleDark } = useJulesContext();
  const { textSecondary, textMuted, accentColor, accentDimBg, accentDimBdr } = useJulesTokens();
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);

  const now = new Date();
  const MONTHS = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
  const DAYS   = ["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"];
  const dateStr = `${now.getDate()} ${MONTHS[now.getMonth()]} ${DAYS[now.getDay()]}.`;

  const sunLabel = (() => {
    if (!weatherInfo) return null;
    const [sh, sm] = weatherInfo.sunrise.split(":").map(Number);
    const [eh, em] = weatherInfo.sunset.split(":").map(Number);
    const nowMin     = now.getHours() * 60 + now.getMinutes();
    const sunriseMin = sh * 60 + sm;
    const sunsetMin  = eh * 60 + em;
    if (nowMin < sunriseMin) return { label: weatherInfo.sunrise, isSunrise: true };
    if (nowMin < sunsetMin)  return { label: weatherInfo.sunset,  isSunrise: false };
    return { label: weatherInfo.sunrise, isSunrise: true };
  })();

  function weatherIcon(code: number) {
    const style = { color: accentColor, flexShrink: 0 };
    if (code === 0)  return <Sun            size={14} style={style} />;
    if (code === 1)  return <SunDim         size={14} style={style} />;
    if (code <= 3)   return <CloudSun       size={14} style={style} />;
    if (code <= 48)  return <CloudFog       size={14} style={style} />;
    if (code <= 67)  return <CloudRain      size={14} style={style} />;
    if (code === 71 || code === 73 || code === 75 || code === 85 || code === 86)
                     return <Snowflake      size={14} style={style} />;
    if (code === 77) return <CloudSnow      size={14} style={style} />;
    if (code <= 82)  return <CloudRain      size={14} style={style} />;
    return                  <CloudLightning size={14} style={style} />;
  }

  useEffect(() => {
    const fallback = () => setWeatherInfo({ temp: 13, code: 2, sunrise: "06:48", sunset: "18:23" });
    if (!navigator.geolocation) { fallback(); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto&forecast_days=1`;
          const res  = await fetch(url);
          const data = await res.json();
          setWeatherInfo({
            temp:    Math.round(data.current.temperature_2m),
            code:    data.current.weather_code,
            sunrise: data.daily.sunrise[0].split("T")[1].slice(0, 5),
            sunset:  data.daily.sunset[0].split("T")[1].slice(0, 5),
          });
        } catch { fallback(); }
      },
      fallback
    );
  }, []);

  return (
    <div
      className="flex items-center gap-3 shrink-0 sticky top-0 z-10"
      style={{
        paddingTop: isMobile ? "6px" : "14px",
        paddingRight: "20px",
        paddingBottom: isMobile ? "3px" : "14px",
        paddingLeft: "20px",
        height: isMobile ? undefined : "52px",
        boxSizing: "border-box",
        background: "transparent",
        borderBottom: (isMobile || isPinnedRight) ? `1px solid ${border}` : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      {/* Sol: kapat + tarih + hava */}
      <div className="flex items-center gap-2 overflow-hidden">
        <button
          onClick={() => onClose?.()}
          title="Jules'ı küçült"
          className="flex items-center justify-center rounded-lg transition-all"
          style={{
            width: "22px", height: "22px", flexShrink: 0, cursor: "pointer",
            color:      isDark ? "#ffffff"                  : "var(--jules-secondary)",
            background: isDark ? "var(--jules-secondary)"   : "rgba(10,160,184,0.09)",
            border:     `1px solid ${isDark ? "var(--jules-secondary)" : "rgba(10,160,184,0.22)"}`,
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background  = isDark ? "rgba(77,196,206,0.18)"     : "var(--jules-secondary)";
            el.style.borderColor = isDark ? "rgba(77,196,206,0.32)"     : "var(--jules-secondary)";
            el.style.color       = isDark ? "var(--jules-accent-light)" : "#ffffff";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background  = isDark ? "var(--jules-secondary)"  : "rgba(10,160,184,0.09)";
            el.style.borderColor = isDark ? "var(--jules-secondary)"  : "rgba(10,160,184,0.22)";
            el.style.color       = isDark ? "#ffffff"                 : "var(--jules-secondary)";
          }}
        >
          <ChevronUp size={isCompact ? 13 : 12} />
        </button>
        <span style={{ fontSize: "10px", color: textSecondary, whiteSpace: "nowrap", flexShrink: 0 }}>{dateStr}</span>
        {weatherInfo && (
          <>
            <div className="flex items-center gap-1 shrink-0">
              {weatherIcon(weatherInfo.code)}
              <span style={{ fontSize: "10px", color: textSecondary, whiteSpace: "nowrap" }}>{weatherInfo.temp}°C</span>
            </div>
            {sunLabel && !isMobile && !isPinnedRight && (
              <div className="flex items-center gap-1 shrink-0">
                <SunHorizon size={12} style={{ color: accentColor, flexShrink: 0 }} />
                <span style={{ fontSize: "10px", color: textSecondary, whiteSpace: "nowrap" }}>{sunLabel.label}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sağ: butonlar */}
      <div className="ml-auto flex items-center gap-2.5 shrink-0">
        {isMobile && <FavButton totalFavCount={totalFavCount} onClick={onShowFavDrawer} />}
        {!isMobile && (
          <PinRightSwitch isPinned={!!isPinnedRight} onToggle={onTogglePinnedRight || (() => {})} />
        )}
        <DarkModeSwitch onToggle={onToggleDark} />
        {isPinnedRight && !isMobile && (
          <FavButton totalFavCount={totalFavCount} onClick={onShowFavDrawer} />
        )}
        {!isPanelOpen && hasPanelSessions && !isCompact && (
          <button
            onClick={onTogglePanel}
            title="Sonuçları göster"
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: "24px", height: "23px", cursor: "pointer",
              color:      isDark ? "#ffffff"                  : "var(--jules-secondary)",
              background: isDark ? "var(--jules-secondary)"   : "rgba(10,160,184,0.09)",
              border:     `1px solid ${isDark ? "var(--jules-secondary)" : "rgba(10,160,184,0.22)"}`,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background  = isDark ? "rgba(77,196,206,0.18)"     : "var(--jules-secondary)";
              el.style.borderColor = isDark ? "rgba(77,196,206,0.32)"     : "var(--jules-secondary)";
              el.style.color       = isDark ? "var(--jules-accent-light)" : "#ffffff";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background  = isDark ? "var(--jules-secondary)"  : "rgba(10,160,184,0.09)";
              el.style.borderColor = isDark ? "var(--jules-secondary)"  : "rgba(10,160,184,0.22)";
              el.style.color       = isDark ? "#ffffff"                 : "var(--jules-secondary)";
            }}
          >
            <ChevronLeft size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── PinRightSwitch ────────────────────────────────────────────────────────── */
function PinRightSwitch({ isPinned, onToggle }: { isPinned: boolean; onToggle: () => void }) {
  const { isDark } = useJulesContext();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouchRef    = useRef(false);
  const buttonRef     = useRef<HTMLButtonElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") { isTouchRef.current = true; if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current); setTooltipVisible(false); }
  };
  const handleMouseEnter = () => { if (isTouchRef.current) { isTouchRef.current = false; return; } hoverTimerRef.current = setTimeout(() => setTooltipVisible(true), 600); };
  const handleMouseLeave = () => { if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current); setTooltipVisible(false); };

  return (
    <button
      ref={buttonRef} onClick={onToggle}
      onPointerDown={handlePointerDown} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      style={{ position: "relative", width: "47px", height: "23px", borderRadius: "12px", border: "none", cursor: "pointer", background: "transparent", padding: 0, flexShrink: 0 }}
    >
      <SwitchTooltip text={isPinned ? "Tam ekrana dön" : "Sağa yasla"} visible={tooltipVisible} anchorRef={buttonRef} />
      {/* Track */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "12px",
        background: isDark ? "linear-gradient(to right, #2e5a72 0%, #244a5e 100%)" : "linear-gradient(to right, #f3f4f6 0%, #e5e7eb 100%)",
        border: isDark ? "1.5px solid #2e5269" : "1.5px solid #c5c9d0",
        boxShadow: isDark ? "0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(77,196,206,0.15)" : "inset 0 2px 5px rgba(0,0,0,0.05), 0 0 8px rgba(0,0,0,0.10)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 6px", overflow: "hidden",
        transition: "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
      }}>
        <Monitor
          size={10} weight="fill"
          style={{
            color: isDark ? (!isPinned ? "var(--jules-accent-light)" : "rgba(255,255,255,0.75)") : "#374151",
            opacity: isDark ? 1 : (isPinned ? 0.75 : 1),
            flexShrink: 0, zIndex: 1, transition: "color 0.3s, opacity 0.3s",
          }}
        />
        <SidebarSimple
          size={10} weight="fill"
          style={{
            color: isDark ? (isPinned ? "var(--jules-accent-light)" : "rgba(255,255,255,0.75)") : "#5a6a78",
            opacity: isDark ? 1 : (isPinned ? 1 : 0.88),
            flexShrink: 0, zIndex: 1, transition: "color 0.3s, opacity 0.3s", transform: "scaleX(-1)",
          }}
        />
      </div>
      {/* Thumb */}
      <div style={{
        position: "absolute", top: "4px", left: isPinned ? "25px" : "4px",
        width: "16px", height: "16px", borderRadius: "8px",
        background: isDark ? "linear-gradient(135deg, #2a4a5e 0%, #1e3a4f 100%)" : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
        boxShadow: isDark ? "0 2px 5px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)" : "0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
        transition: "left 0.32s cubic-bezier(0.4,0,0.2,1), background 0.35s ease, box-shadow 0.35s ease",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
      }}>
        {isPinned
          ? <SidebarSimple size={8} weight="fill" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.4)", transform: "scaleX(-1)" }} />
          : <Monitor      size={8} weight="fill" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.4)" }} />
        }
      </div>
    </button>
  );
}

/* ── DarkModeSwitch ────────────────────────────────────────────────────────── */
function DarkModeSwitch({ onToggle }: { onToggle: () => void }) {
  const { isDark } = useJulesContext();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouchRef    = useRef(false);
  const buttonRef     = useRef<HTMLButtonElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") { isTouchRef.current = true; if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current); setTooltipVisible(false); }
  };
  const handleMouseEnter = () => { if (isTouchRef.current) { isTouchRef.current = false; return; } hoverTimerRef.current = setTimeout(() => setTooltipVisible(true), 600); };
  const handleMouseLeave = () => { if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current); setTooltipVisible(false); };

  return (
    <button
      ref={buttonRef} onClick={onToggle}
      onPointerDown={handlePointerDown} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      style={{ position: "relative", width: "47px", height: "23px", borderRadius: "12px", border: "none", cursor: "pointer", background: "transparent", padding: 0, flexShrink: 0 }}
    >
      <SwitchTooltip text={isDark ? "Açık moda geç" : "Koyu moda geç"} visible={tooltipVisible} anchorRef={buttonRef} />
      {/* Track */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "12px",
        background: isDark
          ? "linear-gradient(135deg, #0b1822 0%, var(--jules-primary) 100%)"
          : "linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)",
        border: isDark ? "1.5px solid #2a4a5e" : "1.5px solid #fcd34d",
        boxShadow: isDark
          ? "inset 0 2px 5px rgba(0,0,0,0.6), 0 0 10px rgba(77,196,206,0.08)"
          : "inset 0 2px 5px rgba(0,0,0,0.05), 0 0 8px rgba(251,191,36,0.25)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 6px", overflow: "hidden",
        transition: "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
      }}>
        {isDark && (<>
          <div style={{ position: "absolute", top: "4px",  left: "14px", width: "2px",   height: "2px",   borderRadius: "50%", background: "rgba(255,255,255,0.5)"  }} />
          <div style={{ position: "absolute", top: "8px",  left: "20px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "rgba(255,255,255,0.35)" }} />
          <div style={{ position: "absolute", top: "5px",  left: "26px", width: "1px",   height: "1px",   borderRadius: "50%", background: "rgba(255,255,255,0.4)"  }} />
        </>)}
        {!isDark && (<>
          <div style={{ position: "absolute", top: "3px",    right: "9px",  width: "2px",   height: "2px",   borderRadius: "50%", background: "rgba(245,158,11,0.5)" }} />
          <div style={{ position: "absolute", bottom: "3px", right: "14px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "rgba(245,158,11,0.4)" }} />
        </>)}
        <Sun  size={11} weight="fill" style={{ color: isDark ? "#3d6880" : "#f59e0b", opacity: isDark ? 0.3 : 1, flexShrink: 0, zIndex: 1, transition: "opacity 0.3s, color 0.3s" }} />
        <Moon size={11} weight="fill" style={{ color: isDark ? "var(--jules-accent-light)" : "#a78bfa", opacity: isDark ? 1 : 0.4, flexShrink: 0, zIndex: 1, transition: "opacity 0.3s, color 0.3s" }} />
      </div>
      {/* Thumb */}
      <div style={{
        position: "absolute", top: "4px", left: isDark ? "25px" : "4px",
        width: "16px", height: "16px", borderRadius: "8px",
        background: isDark
          ? "linear-gradient(135deg, var(--jules-accent) 0%, var(--jules-secondary) 100%)"
          : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        boxShadow: isDark
          ? "0 2px 6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)"
          : "0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
        transition: "left 0.32s cubic-bezier(0.4,0,0.2,1), background 0.35s ease, box-shadow 0.35s ease",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
      }}>
        {isDark
          ? <Moon size={9} weight="fill" style={{ color: "rgba(255,255,255,0.9)"  }} />
          : <Sun  size={9} weight="fill" style={{ color: "rgba(255,255,255,0.95)" }} />
        }
      </div>
    </button>
  );
}