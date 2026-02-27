import { useState, useRef, useEffect } from "react";
import {
  Mic, Sparkles, RotateCcw, Copy, ThumbsUp, ThumbsDown,
  ChevronRight, ChevronLeft, Bot, Heart, X,
} from "lucide-react";
import {
  ArrowUp, CloudSun, CloudFog, Sun, SunDim, CloudRain,
  CloudSnow, CloudLightning, Snowflake, SunHorizon, Moon, X as PhosphorX,
} from "@phosphor-icons/react";
import { MobileCarousel, CardView, type CardItem, type PanelSession } from "./ContentPanel";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  hasCards?: boolean;
  cardLabel?: string;
};

type Props = {
  messages: Message[];
  onSend: (text: string) => void;
  onShowCards: (msgId: string) => void;
  activeCardMsgId: string | null;
  isTyping: boolean;
  isPanelOpen: boolean;
  hasPanelSessions: boolean;
  onTogglePanel: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  isMobile?: boolean;
  cardData?: Record<string, { cards: CardItem[]; title: string }>;
  likedCards?: Set<string>;
  onLikedCardsChange?: (updater: (prev: Set<string>) => Set<string>) => void;
  panelSessions?: PanelSession[];
  onProductClick?: (productId: string) => void;
  onClose?: () => void;
};

const suggestions = [
  "İstanbul'da otel öner",
  "Bütçeme uygun seçenekler",
  "En iyi restoranlar",
  "Çok satan ürünler",
];

export function ChatPanel({
  messages, onSend, onShowCards, activeCardMsgId, isTyping,
  isPanelOpen, hasPanelSessions, onTogglePanel, isDark, onToggleDark,
  isMobile, cardData, likedCards, onLikedCardsChange, panelSessions, onProductClick, onClose,
}: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [votes, setVotes] = useState<Record<string, "up" | "down" | null>>({});
  const [isFocused, setIsFocused] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState<{ temp: number; code: number; sunrise: string; sunset: string } | null>(null);
  const [showFavDrawer, setShowFavDrawer] = useState(false);
  const [activeCardIndices, setActiveCardIndices] = useState<Record<string, number>>({});
  const [drawerDragY, setDrawerDragY] = useState(0);
  const drawerTouchStartY = useRef(0);

  /* ── Shared emoji cycling ── */
  const EMOJIS = ["👋🏼", "🖖🏼", "BOT_ICON", "👇🏼", "👍🏼", "🙏🏼", "🤝🏼", "👏🏼"];
  const [emojiIndex, setEmojiIndex] = useState(0);
  const [emojiPhase, setEmojiPhase] = useState<"visible" | "out" | "in">("visible");

  useEffect(() => {
    const hold = setTimeout(() => {
      setEmojiPhase("out");
      setTimeout(() => {
        setEmojiIndex(prev => (prev + 1) % EMOJIS.length);
        setEmojiPhase("in");
        setTimeout(() => setEmojiPhase("visible"), 180);
      }, 180);
    }, 1088);
    return () => clearTimeout(hold);
  }, [emojiIndex]);

  const emojiAnimStyle: React.CSSProperties =
    emojiPhase === "out"
      ? { transform: "scale(0.4) rotate(-15deg)", opacity: 0,  transition: "transform 0.18s cubic-bezier(0.4,0,1,1), opacity 0.18s ease" }
      : emojiPhase === "in"
      ? { transform: "scale(1.25) rotate(8deg)",  opacity: 0,  transition: "none" }
      : { transform: "scale(1) rotate(0deg)",     opacity: 1,  transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease" };

  /* ── Theme tokens ── */
  const bg            = "transparent";
  const border        = isDark ? "#1d3547" : "#e5e7eb";
  const textPrimary   = isDark ? "#cfe8f4" : "#111827";
  const textSecondary = isDark ? "#6fa8bf" : "#6b7280";
  const textMuted     = isDark ? "#3d7089" : "#9ca3af";
  const userBubble    = isDark ? "#1a3247" : "#F2F2F3";
  const userBubbleText= isDark ? "#cfe8f4" : "#374151";
  const inputBg       = isDark ? "#132230" : "#f9fafb";
  const accentColor   = isDark ? "#4dc4ce" : "#0a6e82";
  const accentDimBg   = isDark ? "rgba(77,196,206,0.10)" : "#e6f7f9";
  const accentDimBdr  = isDark ? "rgba(77,196,206,0.25)" : "#62b8c8";

  /* ── Date ── */
  const now = new Date();
  const MONTHS = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
  const DAYS   = ["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"];
  const dateStr = `${now.getDate()} ${MONTHS[now.getMonth()]} ${DAYS[now.getDay()]}.`;

  const sunLabel = (() => {
    if (!weatherInfo) return null;
    const [sh, sm] = weatherInfo.sunrise.split(":").map(Number);
    const [eh, em] = weatherInfo.sunset.split(":").map(Number);
    const nowMin    = now.getHours() * 60 + now.getMinutes();
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

  /* ── Favorites helpers ── */
  const allFavCards = (panelSessions || []).flatMap(s =>
    s.cards
      .filter(c => likedCards?.has(`${s.id}-${c.id}`))
      .map(c => ({ card: c, sessionId: s.id }))
  );
  const totalFavCount = allFavCards.length;

  const handleLike = (key: string) => {
    onLikedCardsChange?.(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleVote = (msgId: string, vote: "up" | "down") => {
    setVotes(prev => ({ ...prev, [msgId]: prev[msgId] === vote ? null : vote }));
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 112) + "px";
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-full" style={{ background: bg, transition: "background 0.3s" }}>

      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 shrink-0 sticky top-0 z-10"
        style={{
          paddingTop: isMobile ? "6px" : "14px",
          paddingRight: "20px",
          paddingBottom: isMobile ? "6px" : "14px",
          paddingLeft: "20px",
          background: bg, borderBottom: `1px solid ${border}`, transition: "background 0.3s, border-color 0.3s"
        }}
      >
        {/* Close button — leftmost */}
        {onClose && (
          <button
            onClick={onClose}
            title="Jules'ı kapat"
            className="flex items-center justify-center rounded-lg transition-all"
            style={{ width: "24px", height: "24px", color: textMuted, background: "transparent", border: `1px solid ${border}`, flexShrink: 0, cursor: "pointer" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.12)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#f87171";
              (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = border;
              (e.currentTarget as HTMLButtonElement).style.color = textMuted;
            }}
          >
            <PhosphorX size={11} weight="bold" />
          </button>
        )}

        {/* Date / Weather / Sunset */}
        <div className="flex items-center gap-3 overflow-hidden">
          <span style={{ fontSize: "10px", color: textSecondary, whiteSpace: "nowrap", flexShrink: 0 }}>{dateStr}</span>
          {weatherInfo && (
            <>
              <div className="flex items-center gap-1 shrink-0">
                {weatherIcon(weatherInfo.code)}
                <span style={{ fontSize: "10px", color: textSecondary, whiteSpace: "nowrap" }}>{weatherInfo.temp}°C</span>
              </div>
              {sunLabel && !isMobile && (
                <div className="flex items-center gap-1 shrink-0">
                  <SunHorizon size={12} style={{ color: accentColor, flexShrink: 0 }} />
                  <span style={{ fontSize: "10px", color: textSecondary, whiteSpace: "nowrap" }}>{sunLabel.label}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2.5 shrink-0">
          {/* Favorilerim butonu — sadece mobilde göster */}
          {isMobile && (
          <button
            onClick={() => setShowFavDrawer(true)}
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
          )}
          {/* Analog dark/light switch */}
          <DarkModeSwitch isDark={isDark} onToggle={onToggleDark} />
          {!isPanelOpen && hasPanelSessions && !isMobile && (
            <button
              onClick={onTogglePanel}
              title="Sonuçları göster"
              className="flex items-center justify-center rounded-lg transition-all"
              style={{ width: "24px", height: "24px", color: accentColor, background: accentDimBg, border: `1px solid ${accentDimBdr}`, cursor: "pointer" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#0a6e82";
                (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = accentDimBg;
                (e.currentTarget as HTMLButtonElement).style.color = accentColor;
              }}
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth flex flex-col"
        style={{ colorScheme: isDark ? "dark" : "light" }}
      >
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div
              style={{ width: "56px", height: "56px", position: "relative", overflow: "hidden", flexShrink: 0 }}
            >
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {EMOJIS[emojiIndex] === "BOT_ICON" ? (
                  <div style={{ ...emojiAnimStyle, willChange: "transform" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: "#0a6e82" }}>
                      <Bot size={18} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: "28px",
                      lineHeight: 1,
                      display: "block",
                      userSelect: "none",
                      willChange: "transform",
                      ...emojiAnimStyle,
                    }}
                  >
                    {EMOJIS[emojiIndex]}
                  </span>
                )}
              </div>
            </div>
            <div className="text-center">
              <p style={{ fontSize: "14px", fontWeight: 600, color: textPrimary, marginBottom: "4px" }}>
                Size nasıl yardımcı olabilirim?
              </p>
              <p style={{ fontSize: "12px", color: textMuted }}>
                Bir şeyler sorun, size en iyi sonuçları getireyim.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  className="px-3 py-2 rounded-xl text-xs transition-all"
                  style={{ border: `1px solid ${accentDimBdr}`, color: textSecondary, background: "transparent" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor;
                    (e.currentTarget as HTMLButtonElement).style.color = accentColor;
                    (e.currentTarget as HTMLButtonElement).style.background = accentDimBg;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = accentDimBdr;
                    (e.currentTarget as HTMLButtonElement).style.color = textSecondary;
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            {/* Message row */}
            <div className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm" style={{ background: "#0a6e82" }}>
                  <Bot size={14} className="text-white" />
                </div>
              )}
              <div className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                style={{ maxWidth: isMobile ? "85%" : "50%" }}
              >
                <div
                  className="px-3.5 py-2.5 text-xs leading-relaxed"
                  style={{
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                    background: msg.role === "user" ? userBubble : "transparent",
                    color: msg.role === "user" ? userBubbleText : (isDark ? "#cfe8f4" : "#1f2937"),
                    boxShadow: msg.role === "user" ? (isDark ? "0 2px 8px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.10)") : "none",
                  }}
                >
                  {msg.content}
                </div>

                {/* Show cards button — desktop only */}
                {msg.hasCards && msg.role === "assistant" && !isMobile && (
                  <button
                    onClick={() => onShowCards(msg.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
                    style={
                      activeCardMsgId === msg.id
                        ? { background: "#0a6e82", color: "white", fontWeight: 500, fontSize: "10px" }
                        : { background: accentDimBg, color: accentColor, border: `1px solid ${accentDimBdr}`, fontWeight: 500, fontSize: "10px" }
                    }
                    onMouseEnter={e => {
                      if (activeCardMsgId !== msg.id) {
                        (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(77,196,206,0.2)" : "#b2e4ea";
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeCardMsgId !== msg.id) {
                        (e.currentTarget as HTMLButtonElement).style.background = accentDimBg;
                      }
                    }}
                  >
                    <Sparkles size={11} />
                    {msg.cardLabel || "Sonuçları Gör"}
                    <ChevronRight size={11} className={`transition-transform ${activeCardMsgId === msg.id ? "rotate-90" : ""}`} />
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "10px", color: textMuted }}>{formatTime(msg.timestamp)}</span>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1 transition-colors rounded"
                        style={{ color: textMuted }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = textSecondary; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = textMuted; }}
                      >
                        <Copy size={11} />
                      </button>
                      <button
                        onClick={() => handleVote(msg.id, "up")}
                        className="p-1 transition-colors rounded"
                        style={{ color: votes[msg.id] === "up" ? "#16a34a" : textMuted }}
                        onMouseEnter={e => { if (votes[msg.id] !== "up") (e.currentTarget as HTMLButtonElement).style.color = "#16a34a"; }}
                        onMouseLeave={e => { if (votes[msg.id] !== "up") (e.currentTarget as HTMLButtonElement).style.color = textMuted; }}
                      >
                        <ThumbsUp size={11} className={votes[msg.id] === "up" ? "fill-green-500 text-green-500" : ""} />
                      </button>
                      <button
                        onClick={() => handleVote(msg.id, "down")}
                        className="p-1 transition-colors rounded"
                        style={{ color: votes[msg.id] === "down" ? "#dc2626" : textMuted }}
                        onMouseEnter={e => { if (votes[msg.id] !== "down") (e.currentTarget as HTMLButtonElement).style.color = "#dc2626"; }}
                        onMouseLeave={e => { if (votes[msg.id] !== "down") (e.currentTarget as HTMLButtonElement).style.color = textMuted; }}
                      >
                        <ThumbsDown size={11} className={votes[msg.id] === "down" ? "fill-red-500 text-red-500" : ""} />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Inline cards — mobile only */}
            {isMobile && msg.hasCards && msg.role === "assistant" && cardData?.[msg.id] && (
              <div className="w-full mt-1">
                <MobileCarousel
                  cards={cardData[msg.id].cards}
                  sessionId={msg.id}
                  likedCards={likedCards || new Set()}
                  onLike={handleLike}
                  activeIndex={activeCardIndices[msg.id] ?? 0}
                  onIndexChange={(i) => setActiveCardIndices(prev => ({ ...prev, [msg.id]: i }))}
                  isDark={isDark}
                  onProductClick={onProductClick}
                />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm" style={{ background: "#0a6e82" }}>
              <Bot size={14} className="text-white" />
            </div>
            <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDelay: "0ms",   background: textMuted }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDelay: "150ms", background: textMuted }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDelay: "300ms", background: textMuted }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Suggestion chips ── */}
      {messages.length > 0 && (
        <div className={`px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none shrink-0 ${isMobile ? "pt-3" : "justify-center"}`}
          style={{
            paddingTop: isMobile ? undefined : "14px",
            borderTop: `1px solid ${isDark ? "rgba(77,196,206,0.18)" : "rgba(10,110,130,0.13)"}`,
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSend(s)}
              className="px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap shrink-0"
              style={{ borderColor: accentDimBdr, fontSize: "10px", color: textSecondary, background: "transparent" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor;
                (e.currentTarget as HTMLButtonElement).style.color = accentColor;
                (e.currentTarget as HTMLButtonElement).style.background = accentDimBg;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = accentDimBdr;
                (e.currentTarget as HTMLButtonElement).style.color = textSecondary;
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <div className="pb-4 shrink-0 flex flex-col items-center">
        <style>{`
          @property --orbit-angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          @keyframes orbit-ccw {
            from { --orbit-angle: 0deg; }
            to   { --orbit-angle: 360deg; }
          }
          .input-orbit-active {
            background: conic-gradient(
              from var(--orbit-angle) at 50% 50%,
              rgba(229,231,235,0.85) 0deg,
              rgba(229,231,235,0.85) 258deg,
              rgba(27,163,184,0.55)  276deg,
              rgba(77,196,206,0.90)  293deg,
              rgba(27,163,184,0.55)  310deg,
              rgba(229,231,235,0.85) 328deg,
              rgba(229,231,235,0.85) 360deg
            );
            animation: orbit-ccw 6.4s linear infinite;
          }
          .input-orbit-active-dark {
            background: conic-gradient(
              from var(--orbit-angle) at 50% 50%,
              rgba(19,34,48,0.95) 0deg,
              rgba(19,34,48,0.95) 258deg,
              rgba(27,163,184,0.40) 276deg,
              rgba(77,196,206,0.65) 293deg,
              rgba(27,163,184,0.40) 310deg,
              rgba(19,34,48,0.95) 328deg,
              rgba(19,34,48,0.95) 360deg
            );
            animation: orbit-ccw 6.4s linear infinite;
          }
        `}</style>
        <div className="w-full flex justify-center px-4">
          <div
            style={{
              position: "relative",
              width: "700px",
              maxWidth: "100%",
              borderRadius: "17px",
              padding: "1.5px",
              background: "transparent",
              overflow: "hidden",
              transition: "background 0.2s",
            }}
          >
            <div
              className={isDark ? "input-orbit-active-dark" : "input-orbit-active"}
              style={{ position: "absolute", inset: 0, zIndex: 0 }}
            />
            <div
              className={isMobile ? "flex flex-row items-center gap-2 px-3 shadow-sm cursor-text" : "flex flex-col gap-1 p-2 shadow-sm cursor-text"}
              onClick={() => textareaRef.current?.focus()}
              style={{
                position: "relative",
                height: isMobile ? "54px" : "98px",
                borderRadius: "15.5px",
                zIndex: 1,
                background: inputBg,
                transition: "background 0.3s",
              }}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Bir şeyler sorun..."
                className="flex-1 w-full bg-transparent resize-none outline-none"
                style={{
                  lineHeight: "1.5",
                  cursor: "text",
                  fontSize: isMobile ? "14px" : "12px",
                  color: textPrimary,
                  alignSelf: isMobile ? "center" : undefined,
                  maxHeight: isMobile ? "36px" : undefined,
                  overflowY: isMobile ? "auto" : undefined,
                }}
              />
              <style>{`textarea::placeholder { color: ${textMuted}; }`}</style>

              <div className="flex items-center gap-1 shrink-0 justify-end">
                {/* Panel toggle switch — desktop only */}
                {!isMobile && (
                  <button
                    onClick={onTogglePanel}
                    disabled={!hasPanelSessions}
                    title={isPanelOpen ? "Sonuçları gizle" : "Sonuçları göster"}
                    className="flex items-center transition-opacity"
                    style={{ opacity: hasPanelSessions ? 1 : 0.28, cursor: hasPanelSessions ? "pointer" : "not-allowed" }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "30px",
                        height: "16px",
                        borderRadius: "3px",
                        background: isPanelOpen
                          ? "linear-gradient(180deg, #0a6e82 0%, #0d8fa6 100%)"
                          : isDark
                            ? "linear-gradient(180deg, #1a3247 0%, #1e3a55 100%)"
                            : "linear-gradient(180deg, #c0c0c0 0%, #d4d4d4 100%)",
                        boxShadow: isPanelOpen
                          ? "inset 0 2px 3px rgba(0,0,0,0.35), inset 0 -1px 1px rgba(255,255,255,0.12), 0 0 6px rgba(10,110,130,0.3)"
                          : "inset 0 2px 3px rgba(0,0,0,0.22), inset 0 -1px 1px rgba(255,255,255,0.1)",
                        transition: "background 0.2s",
                        border: isPanelOpen ? "1px solid #076575" : `1px solid ${border}`,
                      }}
                    >
                      <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "3px", display: "flex", flexDirection: "column", gap: "2px" }}>
                        {[0,1,2].map(i => <div key={i} style={{ width: "4px", height: "1px", background: "rgba(255,255,255,0.3)", borderRadius: "1px" }} />)}
                      </div>
                      <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "3px", display: "flex", flexDirection: "column", gap: "2px" }}>
                        {[0,1,2].map(i => <div key={i} style={{ width: "4px", height: "1px", background: "rgba(0,0,0,0.15)", borderRadius: "1px" }} />)}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "2px",
                          left: isPanelOpen ? "15px" : "2px",
                          width: "11px",
                          height: "10px",
                          borderRadius: "2px",
                          background: "linear-gradient(180deg, #ffffff 0%, #e4e4e4 100%)",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.9)",
                          transition: "left 0.18s cubic-bezier(0.4,0,0.2,1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          {[0,1,2].map(i => <div key={i} style={{ width: "5px", height: "1px", background: "rgba(0,0,0,0.18)", borderRadius: "1px" }} />)}
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                <button
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: textMuted }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = accentColor;
                    (e.currentTarget as HTMLButtonElement).style.background = accentDimBg;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = textMuted;
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  <Mic size={16} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  style={{ background: "#0a6e82", width: "63px", borderRadius: "7px", padding: "5px 0" }}
                >
                  <ArrowUp size={13} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* ── Brand footer row ── */}
        <div className="flex items-center justify-between w-full px-4 mt-2 mb-0.5" style={{ maxWidth: "700px", alignSelf: "center" }}>
          {/* Left: Jules logo + JULES + Çevrimiçi */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "#0a6e82" }}>
                <Bot size={12} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full"
                style={{ border: `1.5px solid ${bg}` }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "11px", color: textPrimary, lineHeight: 1.2 }}>JULES</p>
              <p style={{ fontWeight: 500, fontSize: "9px", color: "#34d399", lineHeight: 1.2 }}>Çevrimiçi</p>
            </div>
          </div>
          {/* Center: disclaimer */}
          <p style={{ fontSize: "10px", color: textMuted, textAlign: "center", lineHeight: isMobile ? 1.6 : undefined }}>
            {isMobile ? (
              <>AI yanıtlar hata içerebilir.<br />Önemli bilgileri doğrulayın.</>
            ) : (
              "AI yanıtlar hata içerebilir. Önemli bilgileri doğrulayın."
            )}
          </p>
          {/* Right: Powered by Creator AI */}
          <div className="flex items-center gap-1">
            <Sparkles size={9} style={{ color: accentColor, flexShrink: 0 }} />
            <a
              href="https://creator.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 500,
                color: isDark ? "#6fa8bf" : "#6b7280",
                fontSize: "10px",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#34d399"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = isDark ? "#6fa8bf" : "#6b7280"; }}
            >
              Powered by Creator AI
            </a>
          </div>
        </div>
      </div>

      {/* ── Favorites Drawer — mobile bottom sheet ── */}
      {isMobile && showFavDrawer && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
          onClick={() => setShowFavDrawer(false)}
        >
          <div
            style={{
              background: isDark ? "#0c1c28" : "#ffffff",
              borderRadius: "20px 20px 0 0",
              height: "75vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
              transform: `translateY(${drawerDragY}px)`,
              transition: drawerDragY === 0 ? "transform 0.3s cubic-bezier(0.32,0.72,0,1)" : "none",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer handle — swipe to close */}
            <div
              style={{ display: "flex", justifyContent: "center", paddingTop: "10px", paddingBottom: "8px", cursor: "grab", touchAction: "none" }}
              onTouchStart={e => {
                drawerTouchStartY.current = e.touches[0].clientY;
                setDrawerDragY(0);
              }}
              onTouchMove={e => {
                const dy = e.touches[0].clientY - drawerTouchStartY.current;
                if (dy > 0) setDrawerDragY(dy);
              }}
              onTouchEnd={() => {
                if (drawerDragY > 80) {
                  setShowFavDrawer(false);
                  setDrawerDragY(0);
                } else {
                  setDrawerDragY(0);
                }
              }}
            >
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: isDark ? "#1d3547" : "#e5e7eb" }} />
            </div>
            {/* Drawer header */}
            <div
              style={{
                padding: "10px 16px 12px",
                borderBottom: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Heart size={14} style={{ color: "#f87171", fill: "#f87171" }} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: textPrimary }}>Favorilerim</span>
                {totalFavCount > 0 && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#f87171",
                      background: isDark ? "rgba(248,113,113,0.12)" : "#fff5f5",
                      border: "1px solid #fca5a5",
                      borderRadius: "20px",
                      padding: "1px 7px",
                    }}
                  >
                    {totalFavCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowFavDrawer(false)}
                style={{
                  color: textMuted,
                  background: isDark ? "#1a3247" : "#f3f4f6",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PhosphorX size={16} />
              </button>
            </div>
            {/* Drawer content */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {allFavCards.length === 0 ? (
                <div style={{ padding: "40px 24px", textAlign: "center" }}>
                  <Heart size={32} style={{ color: isDark ? "#1d3547" : "#e5e7eb", margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "14px", color: textMuted, marginBottom: "6px" }}>Henüz favori eklemediniz</p>
                  <p style={{ fontSize: "12px", color: isDark ? "#2a4a5e" : "#d1d5db" }}>
                    Kartların üzerindeki ♥ ikonuna dokunun
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    padding: "12px 14px 20px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px",
                  }}
                >
                  {allFavCards.map(({ card, sessionId }) => (
                    <CardView
                      key={`${sessionId}-${card.id}`}
                      card={card}
                      liked={true}
                      onLike={() => handleLike(`${sessionId}-${card.id}`)}
                      isDark={isDark}
                      onProductClick={onProductClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   DarkModeSwitch — analog pill with Moon / Sun icons
   ──────────────────────────────────────────────────────────────────────────── */
function DarkModeSwitch({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? "Açık moda geç" : "Koyu moda geç"}
      style={{
        position: "relative",
        width: "47px",
        height: "23px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        background: "transparent",
        padding: 0,
        flexShrink: 0,
      }}
    >
      {/* Track */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "12px",
          background: isDark
            ? "linear-gradient(135deg, #0b1822 0%, #1c3d54 100%)"
            : "linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)",
          border: isDark ? "1.5px solid #2a4a5e" : "1.5px solid #fcd34d",
          boxShadow: isDark
            ? "inset 0 2px 5px rgba(0,0,0,0.6), 0 0 10px rgba(77,196,206,0.08)"
            : "inset 0 2px 5px rgba(0,0,0,0.05), 0 0 8px rgba(251,191,36,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6px",
          overflow: "hidden",
          transition: "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
        }}
      >
        {isDark && (
          <>
            <div style={{ position: "absolute", top: "4px", left: "14px", width: "2px", height: "2px", borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
            <div style={{ position: "absolute", top: "8px", left: "20px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "rgba(255,255,255,0.35)" }} />
            <div style={{ position: "absolute", top: "5px", left: "26px", width: "1px", height: "1px", borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
          </>
        )}
        {!isDark && (
          <>
            <div style={{ position: "absolute", top: "3px", right: "9px", width: "2px", height: "2px", borderRadius: "50%", background: "rgba(245,158,11,0.5)" }} />
            <div style={{ position: "absolute", bottom: "3px", right: "14px", width: "1.5px", height: "1.5px", borderRadius: "50%", background: "rgba(245,158,11,0.4)" }} />
          </>
        )}
        <Sun
          size={11}
          weight="fill"
          style={{
            color: isDark ? "#3d6880" : "#f59e0b",
            opacity: isDark ? 0.3 : 1,
            flexShrink: 0,
            zIndex: 1,
            transition: "opacity 0.3s, color 0.3s",
          }}
        />
        <Moon
          size={11}
          weight="fill"
          style={{
            color: isDark ? "#4dc4ce" : "#a78bfa",
            opacity: isDark ? 1 : 0.4,
            flexShrink: 0,
            zIndex: 1,
            transition: "opacity 0.3s, color 0.3s",
          }}
        />
      </div>

      {/* Thumb */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          left: isDark ? "25px" : "4px",
          width: "16px",
          height: "16px",
          borderRadius: "8px",
          background: isDark
            ? "linear-gradient(135deg, #1ba3b8 0%, #0a6e82 100%)"
            : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          boxShadow: isDark
            ? "0 2px 6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)"
            : "0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
          transition: "left 0.32s cubic-bezier(0.4,0,0.2,1), background 0.35s ease, box-shadow 0.35s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        {isDark
          ? <Moon size={9} weight="fill" style={{ color: "rgba(255,255,255,0.9)" }} />
          : <Sun  size={9} weight="fill" style={{ color: "rgba(255,255,255,0.95)" }} />
        }
      </div>
    </button>
  );
}