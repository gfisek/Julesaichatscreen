import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  Heart,
  Sparkles,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export type CardItem = {
  id: string;
  type: "hotel" | "product" | "place" | "article";
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price?: string;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeColor?: string;
  tags?: string[];
  location?: string;
  time?: string;
  cta?: string;
  productId?: string;
};

export type PanelSession = {
  id: string;
  cards: CardItem[];
  title: string;
  timestamp: Date;
};

type Props = {
  sessions: PanelSession[];
  activeSessionId: string | null;
  onClose: () => void;
  isMobile?: boolean;
  likedCards: Set<string>;
  onLikedCardsChange: (updater: (prev: Set<string>) => Set<string>) => void;
  scrollToSessionId?: string | null;
  onScrollHandled?: () => void;
  isDark: boolean;
  onProductClick?: (productId: string) => void;
};

export function ContentPanel({
  sessions, activeSessionId, onClose, isMobile, likedCards,
  onLikedCardsChange, scrollToSessionId, onScrollHandled, isDark, onProductClick,
}: Props) {
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeCardIndices, setActiveCardIndices] = useState<Record<string, number>>({});
  const [heartHover, setHeartHover] = useState(false);
  const bottomRef        = useRef<HTMLDivElement>(null);
  const activeRef        = useRef<HTMLDivElement>(null);
  const sessionRefs      = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /* ── Theme tokens ── */
  const bg          = "transparent";
  const bgSticky    = isDark ? "#1a3247" : "#F2F2F3";
  const bgHeader    = isDark ? "rgba(14, 31, 44, 0.55)" : "rgba(255, 255, 255, 0.55)";
  const border      = isDark ? "#1d3547" : "#e5e7eb";
  const textPrimary = isDark ? "#cfe8f4" : "#111827";
  const textMuted   = isDark ? "#3d7089" : "#9ca3af";
  const accentColor = isDark ? "#4dc4ce" : "#0a6e82";
  const accentDimBg  = isDark ? "rgba(77,196,206,0.10)" : "#e6f7f9";
  const accentDimBdr = isDark ? "rgba(77,196,206,0.25)" : "#b2e4ea";

  useEffect(() => {
    if (sessions.length > 0) {
      setTimeout(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
    }
  }, [sessions.length]);

  useEffect(() => {
    if (!scrollToSessionId) return;
    const el        = sessionRefs.current[scrollToSessionId];
    const container = scrollContainerRef.current;
    if (el && container) {
      setTimeout(() => {
        const elTop = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
        container.scrollTo({ top: elTop, behavior: "smooth" });
        onScrollHandled?.();
      }, 80);
    }
  }, [scrollToSessionId]);

  const toggleLike = (key: string) => {
    onLikedCardsChange((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const totalFavCount = sessions.reduce((sum, s) =>
    sum + s.cards.filter(c => likedCards.has(`${s.id}-${c.id}`)).length, 0
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const totalResults = sessions.reduce((sum, s) => sum + s.cards.length, 0);

  const allFavCards = sessions.flatMap(s =>
    s.cards
      .filter(c => likedCards.has(`${s.id}-${c.id}`))
      .map(c => ({ card: c, sessionId: s.id, sessionTitle: s.title }))
  );

  return (
    <div className="flex flex-col h-full" style={{ background: bg, transition: "background 0.3s" }}>

      {/* ── Header ── */}
      <div
        className="shrink-0"
        style={{ background: bgHeader, borderBottom: `1px solid ${border}`, padding: isMobile ? "8px 14px" : "14px 20px", transition: "background 0.3s, border-color 0.3s" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex items-center justify-center shrink-0 transition-all rounded-lg"
            style={{ width: "24px", height: "24px", color: accentColor, background: accentDimBg, border: `1px solid ${accentDimBdr}`, cursor: "pointer" }}
            title="Sonuçları gizle"
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "#0a6e82";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#0a6e82";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = accentDimBg;
              (e.currentTarget as HTMLButtonElement).style.color = accentColor;
              (e.currentTarget as HTMLButtonElement).style.borderColor = accentDimBdr;
            }}
          >
            <ChevronRight size={14} />
          </button>

          <div style={{ width: "1px", height: "16px", background: border, flexShrink: 0 }} />

          <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
            <Sparkles size={10} style={{ color: accentColor, flexShrink: 0 }} />
            <span style={{ fontSize: "10px", fontWeight: 600, color: accentColor, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              AI Sonuçları
            </span>
            <span style={{ fontSize: "9px", color: border }}>·</span>
            <span style={{ fontSize: "11px", color: textMuted, whiteSpace: "nowrap" }}>
              {sessions.length} cevap · {totalResults} sonuç
            </span>
            <button
              onClick={() => setShowFavorites(v => !v)}
              onMouseEnter={() => setHeartHover(true)}
              onMouseLeave={() => setHeartHover(false)}
              className="flex items-center gap-1 transition-all"
              style={(() => {
                const hasFavs = totalFavCount >= 1;
                const isRed   = showFavorites || heartHover || hasFavs;
                return {
                  padding: isMobile ? "3px 8px" : "3px 9px",
                  borderRadius: "20px",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  border: isRed ? "1px solid #f87171" : `1px solid ${border}`,
                  background: isRed ? (isDark ? "rgba(248,113,113,0.1)" : "#fff5f5") : "transparent",
                  color: isRed ? "#f87171" : textMuted,
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                };
              })()}
            >
              {(() => {
                const hasFavs  = totalFavCount >= 1;
                const isFilled = showFavorites || (heartHover && hasFavs);
                const isRed    = showFavorites || heartHover || hasFavs;
                return (
                  <Heart
                    size={10}
                    style={{
                      color: isRed ? "#f87171" : textMuted,
                      fill: isFilled ? "#f87171" : "none",
                    }}
                  />
                );
              })()}
              {totalFavCount > 0 && <span>{totalFavCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Session history ─ */}
      <div className="flex-1 overflow-y-auto" ref={scrollContainerRef} style={{ colorScheme: isDark ? "dark" : "light" }}>
        {sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: isDark ? "#1a3247" : "#f3f4f6" }}>
              <Sparkles size={18} style={{ color: textMuted }} />
            </div>
            <p style={{ fontSize: "14px", color: textMuted }}>Henüz sonuç yok</p>
          </div>
        )}

        {/* Favoriler modu */}
        {showFavorites && (
          <div>
            <div
              className="flex items-center gap-3 px-5 py-2.5 sticky top-0 z-10"
              style={{ background: bgSticky, borderBottom: `1px solid ${border}` }}
            >
              <Heart size={10} style={{ color: "#f87171" }} />
              <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em", color: "#f87171", textTransform: "uppercase" }}>
                Favorilerim
              </span>
              <div className="flex-1 h-px" style={{ background: border }} />
              <span style={{ fontSize: "10px", color: textMuted }}>{totalFavCount} kart</span>
            </div>
            <div className="p-4">
              {allFavCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <Heart size={24} style={{ color: isDark ? "#1d3547" : "#e5e7eb" }} />
                  <p style={{ fontSize: "14px", color: textMuted }}>Henüz favori eklemediniz</p>
                </div>
              ) : isMobile ? (
                <MobileCarousel
                  cards={allFavCards.map(f => f.card)}
                  sessionId="favs"
                  likedCards={likedCards}
                  onLike={(key) => {
                    const cardId = key.replace("favs-", "");
                    const match = allFavCards.find(f => f.card.id === cardId);
                    if (match) toggleLike(`${match.sessionId}-${match.card.id}`);
                  }}
                  activeIndex={activeCardIndices["favs"] ?? 0}
                  onIndexChange={(i) => setActiveCardIndices(prev => ({ ...prev, favs: i }))}
                  isDark={isDark}
                />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: "12px", rowGap: "35px" }}>
                  {allFavCards.map(({ card, sessionId }) => (
                    <CardView
                      key={`${sessionId}-${card.id}`}
                      card={card}
                      liked={true}
                      onLike={() => toggleLike(`${sessionId}-${card.id}`)}
                      isDark={isDark}
                      onProductClick={onProductClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Normal mod */}
        {!showFavorites && sessions.map((session, idx) => {
          const isActive = session.id === activeSessionId;
          const isLast   = idx === sessions.length - 1;

          return (
            <div
              key={session.id}
              ref={(el) => {
                sessionRefs.current[session.id] = el;
                if (isActive) (activeRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
              }}
            >
              <div
                className="flex items-center gap-3 px-5 py-2.5 sticky top-0 z-10"
                style={{ background: bgSticky, borderBottom: `1px solid ${border}` }}
              >
                <div className="flex items-center gap-1.5">
                  <Clock size={10} style={{ color: isActive ? accentColor : textMuted }} />
                  <span
                    className="tracking-widest uppercase"
                    style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em", color: isActive ? accentColor : textMuted }}
                  >
                    {formatTime(session.timestamp)}
                  </span>
                </div>
                <div className="flex-1 h-px" style={{ background: border }} />
                <span
                  className="uppercase tracking-widest"
                  style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em", color: isActive ? accentColor : textMuted }}
                >
                  {session.title}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                )}
              </div>

              {isMobile ? (
                <MobileCarousel
                  cards={session.cards}
                  sessionId={session.id}
                  likedCards={likedCards}
                  onLike={toggleLike}
                  activeIndex={activeCardIndices[session.id] ?? 0}
                  onIndexChange={(i) => setActiveCardIndices(prev => ({ ...prev, [session.id]: i }))}
                  isDark={isDark}
                />
              ) : (
                <div className="p-4">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: "12px", rowGap: "35px" }}>
                    {session.cards.map((card) => {
                      const likeKey = `${session.id}-${card.id}`;
                      return (
                        <CardView
                          key={card.id}
                          card={card}
                          liked={likedCards.has(likeKey)}
                          onLike={() => toggleLike(likeKey)}
                          isDark={isDark}
                          onProductClick={onProductClick}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {!isLast && <div className="mx-5 mb-1" style={{ borderTop: `1px solid ${border}` }} />}
            </div>
          );
        })}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MobileCarousel
   ───────────────────────────────────────────────────────────────────────────── */
export function MobileCarousel({
  cards, sessionId, likedCards, onLike, activeIndex, onIndexChange, isDark, onProductClick,
}: {
  cards: CardItem[];
  sessionId: string;
  likedCards: Set<string>;
  onLike: (key: string) => void;
  activeIndex: number;
  onIndexChange: (i: number) => void;
  isDark: boolean;
  onProductClick?: (productId: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);

  /* Scroll position → closest card index */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
    });
    onIndexChange(closestIdx);
  };

  /* Dot click → scroll to card center */
  const scrollToIndex = (i: number) => {
    const el   = scrollRef.current;
    const card = cardRefs.current[i];
    if (!el || !card) return;
    const cardCenter     = card.offsetLeft + card.offsetWidth / 2;
    const containerWidth = el.clientWidth;
    el.scrollTo({ left: cardCenter - containerWidth / 2, behavior: "smooth" });
    onIndexChange(i);
  };

  const accentColor = isDark ? "#4dc4ce" : "#0a6e82";

  return (
    <div className="flex flex-col items-center py-3 gap-2.5">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          gap: "12px",
          width: "100%",
          paddingLeft: "14%",
          paddingRight: "14%",
          boxSizing: "border-box",
          scrollPaddingLeft: "14%",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        className="hide-scrollbar"
      >
        {cards.map((card, i) => {
          const likeKey = `${sessionId}-${card.id}`;
          return (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{ flexShrink: 0, width: "72%", scrollSnapAlign: "center" }}
            >
              <CardView
                card={card}
                liked={likedCards.has(likeKey)}
                onLike={() => onLike(likeKey)}
                isDark={isDark}
                onProductClick={onProductClick}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            style={{
              width: i === activeIndex ? "16px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === activeIndex ? accentColor : (isDark ? "#3a6075" : "#9ca3af"),
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   CardView
   ───────────────────────────────────────────────────────────────────────────── */
export function CardView({ card, liked, onLike, isDark, onProductClick }: {
  card: CardItem;
  liked: boolean;
  onLike: () => void;
  isDark: boolean;
  onProductClick?: (productId: string) => void;
}) {
  const [hoverCta, setHoverCta] = useState(false);

  const bgCard       = isDark ? "#142230" : "#ffffff";
  const borderCard   = isDark ? "#1d3547" : "#e5e7eb";
  const borderHover  = isDark ? "#2d5070" : "#b0b0b0";
  const textPrimary  = isDark ? "#cfe8f4" : "#111827";
  const textDesc     = isDark ? "#cfe8f4" : "#111827";
  const ctaBorder    = isDark ? "#2a4a5e" : "#d1d5db";
  const ctaText      = isDark ? "#6fa8bf" : "#555";
  const accentColor  = isDark ? "#4dc4ce" : "#0a6e82";

  return (
    <div
      className="overflow-hidden flex flex-col group transition-colors"
      style={{
        borderRadius: "3px",
        background: bgCard,
        border: `1px solid ${borderCard}`,
        transition: "background 0.3s, border-color 0.2s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = borderHover; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = borderCard; }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <button
          onClick={onLike}
          className="absolute bottom-2 right-2 w-6 h-6 flex items-center justify-center transition-colors"
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <Heart
            size={16}
            style={{
              color: liked ? "#f87171" : "white",
              fill: liked ? "#f87171" : "white",
              filter: liked ? "none" : "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
            }}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 px-3 pt-3 pb-3">
        {card.badge && (
          <div className="flex items-center gap-1.5">
            <div className="w-0.5 h-2.5" style={{ background: "#4dc4ce", borderRadius: "1px" }} />
            <span
              className="uppercase"
              style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", color: "#4dc4ce" }}
            >
              {card.badge}
            </span>
          </div>
        )}

        <p style={{ fontWeight: 600, fontSize: "12px", letterSpacing: "-0.01em", color: textPrimary }}>
          {card.title}
        </p>

        <p
          style={{
            fontSize: "11px",
            color: textDesc,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.6",
          }}
        >
          {card.description}
        </p>

        <div>
          <button
            onMouseEnter={() => setHoverCta(true)}
            onMouseLeave={() => setHoverCta(false)}
            className="inline-flex items-center gap-1 transition-all"
            style={{
              borderRadius: "3px",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.03em",
              padding: "4px 8px",
              border: `1px solid ${hoverCta ? accentColor : ctaBorder}`,
              background: hoverCta ? accentColor : "transparent",
              color: hoverCta ? "white" : ctaText,
              transition: "all 0.15s",
            }}
            onClick={() => card.productId && onProductClick?.(card.productId)}
          >
            {card.cta || "İncele"}
            <ArrowUpRight size={9} />
          </button>
        </div>
      </div>
    </div>
  );
}