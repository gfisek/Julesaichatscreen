import { useState, useCallback, useRef, useEffect } from "react";
import { ChatPanel, type Message } from "./components/ChatPanel";
import { ContentPanel, type CardItem, type PanelSession } from "./components/ContentPanel";
import { JulesContext } from "./context/JulesContext";
import {
  JULES_CONFIG, JULES_CARDS,
  type JulesConfig, type JulesCardsData,
} from "../data/jules-data";

// Geliştirme + preview: src/data/jules-data.ts'den import edilir (fetch/CORS sorunu yok).
// Production widget.js: aynı şemayı /public/jules-widget/*.json'dan fetch eder.
// Şema değişince her iki dosyayı birlikte güncelle.

// ─── Sabit config — useState gereksiz, bu veriler hiç değişmez ───────────────
const julesConfig: JulesConfig  = JULES_CONFIG;
const julesCards:  JulesCardsData = JULES_CARDS;

// ─── Ana bileşen ──────────────────────────────────────────────────────────────

export default function App() {
  const [messages, setMessages]               = useState<Message[]>([]);
  const [isTyping, setIsTyping]               = useState(false);
  const [activeCardMsgId, setActiveCardMsgId] = useState<string | null>(null);
  const [panelSessions, setPanelSessions]     = useState<PanelSession[]>([]);
  const [cardData, setCardData]               = useState<Record<string, { cards: CardItem[]; title: string }>>({});
  const [isPanelOpen, setIsPanelOpen]         = useState(false);
  const [isMobile, setIsMobile]               = useState(() => window.innerWidth < 768);
  const [likedCards, setLikedCards]           = useState<Set<string>>(new Set());
  const [scrollToSessionId, setScrollToSessionId] = useState<string | null>(null);
  const [isDark, setIsDark]                   = useState(false);
  const [isPinnedRight, setIsPinnedRight]     = useState(false);

  const defaultReplyIndexRef = useRef(0);
  const isMobileRef          = useRef(isMobile);

  // ─── config.json renklerini CSS variable olarak uygula ────────────────────────
  useEffect(() => {
    const { colors, font } = julesConfig;
    const existing = document.getElementById("jules-config-vars");
    if (existing) existing.remove();
    const style = document.createElement("style");
    style.id = "jules-config-vars";
    style.textContent = `
      :root {
        --jules-primary:      ${colors.primary};
        --jules-secondary:    ${colors.secondary};
        --jules-accent:       ${colors.accent};
        --jules-accent-light: ${colors.accentLight};
        --jules-accent-bg:    ${colors.accentBg};
        --jules-font:         ${font.family};
      }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById("jules-config-vars")?.remove(); };
  }, []); // julesConfig artık sabit, bir kez çalışır

  // ── Yardımcı getter'lar ──────────────────────────────────────────────────────

  const getSuggestions  = () => julesConfig.suggestions;
  const getDefaultReply = () => {
    const replies = julesConfig.defaultReplies;
    return replies[defaultReplyIndexRef.current++ % replies.length];
  };

  // ── Resize & state senkronizasyonu ──────────────────────────────────────────

  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  useEffect(() => {
    if (isMobile && isPanelOpen) {
      setIsPanelOpen(false);
      setActiveCardMsgId(null);
    }
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // ── Mesaj gönderme — senaryo eşleştirmesi jules-data.ts'den gelir ────────────

  const handleSend = useCallback((text: string) => {
    const userMsg: Message = { id: generateId(), role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const lower    = text.toLowerCase();
    const scenario = julesCards.scenarios.find(s => s.keywords.some(kw => lower.includes(kw)));
    const cards    = scenario ? julesCards.datasets[scenario.dataset] : undefined;
    const delay    = 1200 + Math.random() * 800;

    setTimeout(() => {
      setIsTyping(false);
      const botMsgId = generateId();
      const botMsg: Message = {
        id: botMsgId,
        role: "assistant",
        content: scenario ? scenario.reply : getDefaultReply(),
        timestamp: new Date(),
        hasCards: !!cards,
        cardLabel: scenario?.cardLabel,
      };
      setMessages(prev => [...prev, botMsg]);

      if (cards && scenario) {
        const sessionData = { cards, title: scenario.panelTitle };
        setCardData(prev => ({ ...prev, [botMsgId]: sessionData }));
        setTimeout(() => {
          setActiveCardMsgId(botMsgId);
          setPanelSessions(prev => [
            ...prev,
            { id: botMsgId, cards, title: scenario.panelTitle, timestamp: new Date() },
          ]);
          if (!isMobileRef.current) setIsPanelOpen(true);
        }, 300);
      }
    }, delay);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShowCards = useCallback((msgId: string) => {
    setActiveCardMsgId(msgId);
    setIsPanelOpen(true);
    setCardData(prev => {
      const data = prev[msgId];
      if (!data) return prev;
      setPanelSessions(sessions => {
        if (sessions.find(s => s.id === msgId)) return sessions;
        return [...sessions, { id: msgId, ...data, timestamp: new Date() }];
      });
      setScrollToSessionId(msgId);
      return prev;
    });
  }, []);

  const handleClosePanel = () => {
    setActiveCardMsgId(null);
    setIsPanelOpen(false);
  };

  const handleTogglePanel = useCallback(() => {
    if (isPanelOpen) {
      setIsPanelOpen(false);
      setActiveCardMsgId(null);
    } else if (panelSessions.length > 0) {
      setIsPanelOpen(true);
      if (!activeCardMsgId && panelSessions.length > 0) {
        setActiveCardMsgId(panelSessions[panelSessions.length - 1].id);
      }
    }
  }, [isPanelOpen, panelSessions, activeCardMsgId]);

  const handleTogglePinnedRight = useCallback(() => {
    setIsPinnedRight(v => {
      if (!v) {
        setIsPanelOpen(false);
        setActiveCardMsgId(null);
      }
      return !v;
    });
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────

  const bg     = isDark ? "rgba(10,23,32,0.97)" : "rgba(255,255,255,0.97)";
  const border = isDark ? "#1d3547" : "#e5e7eb";
  const isPinned = isPinnedRight && !isMobile;

  return (
    <JulesContext.Provider value={{
      isDark,
      onToggleDark: () => setIsDark(v => !v),
      likedCards,
      onLikedCardsChange: setLikedCards,
    }}>
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDark ? "#07111a" : "#f0f4f6",
          overflow: "hidden",
        }}
      >
        <style>{`
          @keyframes jules-slide-in-right {
            from { opacity: 0; transform: translateX(32px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>

        {/* Ana widget kapsayıcı */}
        <div
          style={{
            ...(isPinned ? {
              position: "fixed",
              right: 0, top: 0,
              width: "390px",
              height: "100dvh",
              borderRadius: "7px 0 0 7px",
              boxShadow: "-8px 0 48px rgba(0,0,0,0.28), -2px 0 8px rgba(0,0,0,0.10)",
              animation: "jules-slide-in-right 0.35s cubic-bezier(0.4,0,0.2,1)",
              flexDirection: "column",
            } : {
              width: "100%",
              height: "100dvh",
              maxWidth: "100%",
              flexDirection: "row",
              borderRadius: 0,
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            }),
            display: "flex",
            justifyContent: "center",
            background: bg,
            backdropFilter: "blur(24px) saturate(1.6)",
            WebkitBackdropFilter: "blur(24px) saturate(1.6)",
            overflow: "hidden",
            transition: "background 0.3s",
          }}
        >
          {/* Full-width header bottom border — tam ekran modda, sadece desktop */}
          {!isPinned && !isMobile && (
            <div
              style={{
                position: "absolute",
                top: "52px",
                left: 0,
                right: 0,
                height: "1px",
                background: border,
                zIndex: 20,
                transition: "background 0.3s",
                pointerEvents: "none",
              }}
            />
          )}
          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : "1200px",
              height: "100%",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              overflow: "hidden",
            }}
          >
            {/* İçerik paneli — pinned modda gizli */}
            {isPanelOpen && !isPinned && (
              <div
                style={
                  isMobile
                    ? { height: "50%", width: "100%", borderBottom: `1px solid ${border}`, flexShrink: 0, order: 1, overflow: "hidden" }
                    : { flex: 1, borderLeft: `1px solid ${border}`, order: 2, overflow: "hidden" }
                }
              >
                <ContentPanel
                  sessions={panelSessions}
                  activeSessionId={activeCardMsgId}
                  onClose={handleClosePanel}
                  isMobile={isMobile}
                  scrollToSessionId={scrollToSessionId}
                  onScrollHandled={() => setScrollToSessionId(null)}
                />
              </div>
            )}

            {/* Chat paneli */}
            <div
              style={
                isPinned
                  ? { width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }
                  : isMobile
                    ? { height: isPanelOpen ? "50%" : "100%", width: "100%", flexShrink: 0, order: 2, overflow: "hidden", display: "flex", flexDirection: "column" }
                    : { width: isPanelOpen ? "50%" : "100%", flexShrink: 0, order: 1, overflow: "hidden", display: "flex", flexDirection: "column", transition: "width 0.3s ease" }
              }
            >
              <ChatPanel
                messages={messages}
                onSend={handleSend}
                onShowCards={handleShowCards}
                activeCardMsgId={activeCardMsgId}
                isTyping={isTyping}
                isPanelOpen={isPanelOpen}
                hasPanelSessions={panelSessions.length > 0}
                onTogglePanel={handleTogglePanel}
                isMobile={isMobile}
                cardData={cardData}
                panelSessions={panelSessions}
                isPinnedRight={isPinned}
                onTogglePinnedRight={handleTogglePinnedRight}
                suggestions={getSuggestions()}
              />
            </div>
          </div>
        </div>
      </div>
    </JulesContext.Provider>
  );
}