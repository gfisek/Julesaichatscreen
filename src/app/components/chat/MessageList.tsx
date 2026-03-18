import { useRef, useEffect, useState, useCallback } from "react";
import { Bot, Copy, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { MobileCarousel } from "../ContentPanel";
import { useJulesContext } from "../../context/JulesContext";
import { useJulesTokens }  from "../../hooks/useJulesTokens";
import { InlineForm }      from "./InlineForm";
import type { Message }    from "../../types/jules";
import type { CardItem }   from "../../types/jules";
import type { FormFieldData } from "../../types/jules";

type Props = {
  messages: Message[];
  isTyping: boolean;
  isCompact: boolean;
  isPanelOpen: boolean;
  cardData?: Record<string, { cards: CardItem[]; title: string }>;
  activeCardMsgId: string | null;
  onShowCards: (msgId: string) => void;
  isMobile?: boolean;
  onProductClick?: (productId: string) => void;
  suggestions: string[];
  onSend: (text: string) => void;
  // Form props
  kvkkAccepted: boolean;
  submittedForms: Record<string, FormFieldData>;
  onFormSubmit: (msgId: string, data: FormFieldData) => void;
  onKvkkAccepted: () => void;
};

const EMOJIS = ["👋🏼", "🖖🏼", "BOT_ICON", "👇🏼", "👍🏼", "🙏🏼", "🤝🏼", "👏🏼"];

export function MessageList({
  messages, isTyping, isCompact, isPanelOpen, cardData,
  activeCardMsgId, onShowCards, isMobile, onProductClick,
  suggestions, onSend,
  kvkkAccepted, submittedForms, onFormSubmit, onKvkkAccepted,
}: Props) {
  const { isDark, likedCards, onLikedCardsChange } = useJulesContext();
  const {
    textPrimary, textSecondary, textMuted,
    userBubble, userBubbleText,
    accentColor, accentDimBg, accentDimBdr,
  } = useJulesTokens();
  const bottomRef  = useRef<HTMLDivElement>(null);
  const msgRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  // Mesaj ref callback — her mesaj elementi mount olduğunda kaydedilir
  const setMsgRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) msgRefsMap.current.set(id, el);
    else    msgRefsMap.current.delete(id);
  }, []);

  const [votes, setVotes]                   = useState<Record<string, "up" | "down" | null>>({});
  const [copied, setCopied]                 = useState<string | null>(null);
  const [activeCardIndices, setActiveCardIndices] = useState<Record<string, number>>({});
  const [emojiIndex, setEmojiIndex]         = useState(0);
  const [emojiPhase, setEmojiPhase]         = useState<"visible" | "out" | "in">("visible");
  const [chipsVisible, setChipsVisible]     = useState(false);

  useEffect(() => {
    // Chip'leri Jules fade-in'iyle örtüşecek şekilde tetikle
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setChipsVisible(true))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  // Ease-out stagger: boşluklar artar (ilk chip hızlı, sonrakiler giderek gecikmeli)
  const chipDelay = (i: number) => 700 + Math.round(Math.pow(i, 1.4) * 120);

  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (isMobile && last.role === "assistant") {
      // Mobil + bot yanıtı: yeni mesajın üstü ekranın üstüne gelsin
      const el = msgRefsMap.current.get(last.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    // Diğer durumlar (kullanıcı mesajı, desktop): alta kaydır
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMobile]);

  useEffect(() => {
    // Typing göstergesi görünürken alta kaydır
    if (isTyping) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isTyping]);

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
      ? { transform: "scale(0.4) rotate(-15deg)", opacity: 0, transition: "transform 0.18s cubic-bezier(0.4,0,1,1), opacity 0.18s ease" }
      : emojiPhase === "in"
      ? { transform: "scale(1.25) rotate(8deg)",  opacity: 0, transition: "none" }
      : { transform: "scale(1) rotate(0deg)",     opacity: 1, transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease" };

  const handleLike = (key: string) => {
    onLikedCardsChange(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };
  const handleVote = (msgId: string, vote: "up" | "down") => {
    setVotes(prev => ({ ...prev, [msgId]: prev[msgId] === vote ? null : vote }));
  };
  const handleCopy = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(msgId);
    setTimeout(() => setCopied(null), 1800);
  };
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth flex flex-col"
      style={{ colorScheme: isDark ? "dark" : "light", overscrollBehavior: "contain", scrollPaddingTop: isMobile ? "7px" : "0px" }}
    >
      {/* ── Boş durum ── */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div style={{ width: "56px", height: "56px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {EMOJIS[emojiIndex] === "BOT_ICON" ? (
                <div style={{ ...emojiAnimStyle, willChange: "transform" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: "var(--jules-secondary)" }}>
                    <Bot size={18} className="text-white" />
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: "28px", lineHeight: 1, display: "block", userSelect: "none", willChange: "transform", ...emojiAnimStyle }}>
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
            {suggestions.map((s, idx) => (
              <button
                key={s}
                onClick={() => onSend(s)}
                className="px-3 py-2 rounded-xl text-xs"
                style={{
                  border: `1px solid ${accentDimBdr}`,
                  color: textSecondary,
                  background: "transparent",
                  opacity: chipsVisible ? 1 : 0,
                  transform: chipsVisible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 560ms cubic-bezier(0,0,0.2,1) ${chipDelay(idx)}ms, transform 560ms cubic-bezier(0,0,0.2,1) ${chipDelay(idx)}ms, border-color 0.15s, color 0.15s, background 0.15s`,
                  willChange: "opacity, transform",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor; (e.currentTarget as HTMLButtonElement).style.color = accentColor; (e.currentTarget as HTMLButtonElement).style.background = accentDimBg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = accentDimBdr; (e.currentTarget as HTMLButtonElement).style.color = textSecondary; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Mesajlar ── */}
      {messages.map((msg) => (
        <div key={msg.id} ref={setMsgRef(msg.id)} className="flex flex-col">
          <div className={`flex gap-2.5 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm" style={{ background: "var(--jules-secondary)" }}>
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div
              className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
              style={{ maxWidth: isCompact ? "85%" : isPanelOpen ? "70%" : "50%" }}
            >
              <div
                className={`leading-relaxed ${msg.role === "user" ? "px-3.5 py-2.5" : `pl-0 pt-0 pr-3.5 ${(isMobile || isCompact) && msg.role === "assistant" ? "pb-1" : "pb-2.5"}`}`}
                style={{
                  fontSize: isMobile ? "13px" : "12px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                  background: msg.role === "user" ? userBubble : "transparent",
                  color: msg.role === "user" ? userBubbleText : (isDark ? "#cfe8f4" : "#1f2937"),
                  boxShadow: msg.role === "user" ? (isDark ? "0 2px 8px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.10)") : "none",
                }}
              >
                {msg.content}
              </div>

              <div className="flex items-center gap-2" style={{ marginTop: (isMobile || isCompact) ? "0px" : "2px" }}>
                <span style={{ fontSize: "10px", color: textMuted }}>{formatTime(msg.timestamp)}</span>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1 transition-colors rounded"
                      style={{ color: copied === msg.id ? "#16a34a" : textMuted }}
                      title="Kopyala"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      onMouseEnter={e => { if (copied !== msg.id) (e.currentTarget as HTMLButtonElement).style.color = textSecondary; }}
                      onMouseLeave={e => { if (copied !== msg.id) (e.currentTarget as HTMLButtonElement).style.color = textMuted; }}
                    >
                      {copied === msg.id
                        ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : <Copy size={11} />
                      }
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
                {msg.hasCards && msg.role === "assistant" && !isCompact && (
                  <button
                    onClick={() => onShowCards(msg.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
                    style={
                      activeCardMsgId === msg.id
                        ? { background: "var(--jules-secondary)", color: "white", border: "1px solid transparent", fontWeight: 500, fontSize: "9px", transition: "background 0.15s, color 0.15s, border-color 0.15s" }
                        : { background: accentDimBg, color: accentColor, border: `1px solid ${accentDimBdr}`, fontWeight: 500, fontSize: "9px", transition: "background 0.15s, color 0.15s, border-color 0.15s" }
                    }
                    onMouseEnter={e => { if (activeCardMsgId !== msg.id) (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(77,196,206,0.2)" : "#b2e4ea"; }}
                    onMouseLeave={e => { if (activeCardMsgId !== msg.id) (e.currentTarget as HTMLButtonElement).style.background = accentDimBg; }}
                  >
                    <Sparkles size={9} />
                    {msg.cardLabel || "Sonuçları Gör"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Compact mod — inline carousel */}
          {isCompact && msg.hasCards && msg.role === "assistant" && cardData?.[msg.id] && (
            <div className="mt-1" style={{ marginLeft: "-16px", marginRight: "-16px" }}>
              <MobileCarousel
                cards={cardData[msg.id].cards}
                sessionId={msg.id}
                likedCards={likedCards}
                onLike={handleLike}
                activeIndex={activeCardIndices[msg.id] ?? 0}
                onIndexChange={(i) => setActiveCardIndices(prev => ({ ...prev, [msg.id]: i }))}
                onProductClick={onProductClick}
                isMobile={isMobile}
              />
            </div>
          )}

          {/* Inline form */}
          {msg.role === "assistant" && msg.formType && (
            <InlineForm
              formType={msg.formType}
              msgId={msg.id}
              kvkkAlreadyAccepted={kvkkAccepted}
              onSubmit={(data) => onFormSubmit(msg.id, data)}
              onKvkkAccepted={onKvkkAccepted}
              submitted={!!submittedForms[msg.id]}
              submittedData={submittedForms[msg.id]}
              isCompact={isCompact}
              isPanelOpen={isPanelOpen}
            />
          )}
        </div>
      ))}

      {/* ── Typing indicator ── */}
      {isTyping && (
        <div className="flex gap-2.5 justify-start">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm" style={{ background: "var(--jules-secondary)" }}>
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
  );
}