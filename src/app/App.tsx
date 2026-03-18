import { useState, useCallback, useRef, useEffect, useLayoutEffect } from "react";
import { ChatPanel, type Message } from "./components/ChatPanel";
import { ContentPanel, type CardItem, type PanelSession } from "./components/ContentPanel";
import { MiniJules } from "./components/MiniJules";
import { JulesContext } from "./context/JulesContext";
import {
  JULES_CONFIG, JULES_CARDS,
} from "../data/jules-data";
import type { FormType, FormFieldData } from "./types/jules";
import { useScrollbarFade } from "./hooks/useScrollbarFade";

// Geliştirme + preview: src/data/jules-data.ts'den import edilir (fetch/CORS sorunu yok).
// Production widget.js: aynı şemayı /public/jules-widget/*.json'dan fetch eder.
// Şema değişince her iki dosyayı birlikte güncelle.

// ─── Sabit config — useState gereksiz, bu veriler hiç değişmez ───────────────
const julesConfig = JULES_CONFIG;
const julesCards  = JULES_CARDS;

// ─── Ana bileşen ──────────────────────────────────────────────────────────────

export default function App() {
  useScrollbarFade();
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
  // ── Form state ─────────────────────────────────────────────────────────────
  const [kvkkAccepted, setKvkkAccepted]       = useState(false);
  const [submittedForms, setSubmittedForms]   = useState<Record<string, FormFieldData>>({});

  // ── Minimize state ──────────────────────────────────────────────────────────
  const [isMinimized, setIsMinimized]         = useState(true);   // Default: MiniJules
  const boxRef = useRef<HTMLDivElement>(null);

  // ── Intro animasyon state ────────────────────────────────────────────────────
  const [introAnimating, setIntroAnimating]   = useState(false);  // MiniJules DOM'da tutar
  const introShownRef                         = useRef(false);     // Session flag
  const fromIntroRef                          = useRef(false);     // Jules fade-in modu
  const miniJulesContainerRef                 = useRef<HTMLDivElement | null>(null);
  const introTimersRef                        = useRef<ReturnType<typeof setTimeout>[]>([]);

  const miniJulesRefCb = useCallback((el: HTMLDivElement | null) => {
    miniJulesContainerRef.current = el;
  }, []);

  const defaultReplyIndexRef = useRef(0);
  const isMobileRef          = useRef(isMobile);

  // ── config.json renklerini CSS variable olarak uygula ────────────────────────
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

  // ── Dark mode → DOM'a data-dark attr yaz (scrollbar CSS için zorunlu) ──────────
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-dark", "");
    } else {
      document.documentElement.removeAttribute("data-dark");
    }
  }, [isDark]);

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

  // ── Form tetikleyicileri ─────────────────────────────────────────────────────
  const FORM_TRIGGERS: Record<string, FormType> = {
    'anaform': 'anaform',
    'adsoyad': 'adsoyad',
    'eposta':  'eposta',
  };

  const FORM_REPLIES: Record<FormType, string> = {
    anaform: 'Sizi daha iyi tanıyabilmek için bilgilerinizi paylaşır mısınız?',
    adsoyad: 'Adınızı ve soyadınızı öğrenebilir miyim?',
    eposta:  'E-posta adresinizi alabilir miyim?',
  };

  // ── Mesaj gönderme — senaryo eşleştirmesi jules-data.ts'den gelir ────────────

  const handleSendCore = useCallback((text: string) => {
    const userMsg: Message = { id: generateId(), role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const lower    = text.toLowerCase().trim();
    const formType = FORM_TRIGGERS[lower] as FormType | undefined;
    const scenario = !formType
      ? julesCards.scenarios.find(s => s.keywords.some(kw => lower.includes(kw)))
      : undefined;
    const cards    = scenario ? julesCards.datasets[scenario.dataset] : undefined;
    const delay    = 1200 + Math.random() * 800;

    setTimeout(() => {
      setIsTyping(false);
      const botMsgId = generateId();
      const botMsg: Message = {
        id: botMsgId,
        role: "assistant",
        content: formType
          ? FORM_REPLIES[formType]
          : (scenario ? scenario.reply : getDefaultReply()),
        timestamp: new Date(),
        hasCards: !!cards,
        cardLabel: scenario?.cardLabel,
        formType,
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

  const handleSend = useCallback((text: string) => {
    handleSendCore(text);
  }, [handleSendCore]);

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

  // ── Expand animasyonu: box ilk render'da translateY(-160px)'ten gelir ─────────
  useLayoutEffect(() => {
    if (isMinimized) return;
    const box = boxRef.current;
    if (!box) return;

    if (fromIntroRef.current) {
      // Intro'dan geliyorsa: aşağıdan scale + fade ile yüksel (morfing hissi)
      fromIntroRef.current = false;
      box.style.transform  = "translateY(60px) scale(0.96)";
      box.style.opacity    = "0";
      box.style.filter     = "blur(6px)";
      box.style.transition = "none";
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!boxRef.current) return;
          boxRef.current.style.transition = "transform 886ms cubic-bezier(0,0,0.2,1), opacity 714ms cubic-bezier(0,0,0.2,1), filter 714ms cubic-bezier(0,0,0.2,1)";
          boxRef.current.style.transform  = "translateY(0) scale(1)";
          boxRef.current.style.opacity    = "1";
          boxRef.current.style.filter     = "blur(0px)";
        });
      });
      return () => cancelAnimationFrame(id);
    }

    // Normal spring animasyon — yukarıdan iner
    box.style.transform  = "translateY(-160px)";
    box.style.opacity    = "0";
    box.style.transition = "none";
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!boxRef.current) return;
        boxRef.current.style.transition = "transform 420ms cubic-bezier(0.34,1.28,0.64,1), opacity 280ms ease";
        boxRef.current.style.transform  = "translateY(0)";
        boxRef.current.style.opacity    = "1";
      });
    });
    return () => cancelAnimationFrame(id);
  }, [isMinimized]);

  // ── Intro sequence — MiniJules düşer, Jules aşağıdan yükselir ────────────────
  const runIntroSequence = useCallback(() => {
    const el = miniJulesContainerRef.current;
    if (!el) { setIsMinimized(false); return; }

    introTimersRef.current.forEach(clearTimeout);
    introTimersRef.current = [];
    const addTimer = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      introTimersRef.current.push(id);
      return id;
    };

    setIntroAnimating(true);

    const viewH = window.innerHeight;

    // MiniJules yer çekimiyle hızlı düşer (ease-in = ivmelenerek)
    requestAnimationFrame(() => {
      el.style.transition = `transform 960ms cubic-bezier(0.4, 0, 1, 1), opacity 320ms ease-in 600ms`;
      el.style.transform  = `translateY(${viewH + 80}px) scale(0.88)`;
      el.style.opacity    = "0";
    });

    // Jules 640ms'de — MiniJules ekrandan çıkmadan önce — aşağıdan yükselmeye başlar
    addTimer(() => {
      fromIntroRef.current = true;
      setIsMinimized(false);
    }, 640);

    // MiniJules DOM'dan kaldır
    addTimer(() => {
      setIntroAnimating(false);
    }, 1400);
  }, []);

  // ── Cleanup: unmount'ta intro timer'larını temizle ───────────────────────────
  useEffect(() => {
    return () => {
      introTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  // ── Minimize / Expand ────────────────────────────────────────────────────────
  const handleMinimize = useCallback(() => {
    const box = boxRef.current;
    if (!box) { setIsMinimized(true); return; }
    // Fiziksel ivmeyle yukarı fırlat
    box.style.transition = "transform 350ms cubic-bezier(0.4,0,0.9,0.08), opacity 300ms ease";
    box.style.transform  = "translateY(-160px)";
    box.style.opacity    = "0";
    setTimeout(() => setIsMinimized(true), 350);
  }, []);

  const handleExpand = useCallback(() => {
    // İlk tıklamada intro sekansı — sonraki tıklamalar direkt açar
    if (!introShownRef.current) {
      introShownRef.current = true;
      runIntroSequence();
      return;
    }
    setIsMinimized(false);
    // useLayoutEffect spring animasyonunu halleder
  }, [runIntroSequence]);

  // ── Form handler'ları ─────────────────────────────────────────────────────────
  /**
   * Backend entegrasyon noktası (TSX stub):
   * Production'da bu fonksiyonun içi fetch('/api/form-submit', ...) ile doldurulur.
   * Web Component'te ise jules:formsubmit eventi dışarıya dispatch edilir.
   */
  const handleFormSubmit = useCallback((msgId: string, data: FormFieldData) => {
    setSubmittedForms(prev => ({ ...prev, [msgId]: data }));
    if (data.kvkkAccepted) setKvkkAccepted(true);
    // TODO (production): fetch('/api/form-submit', { method: 'POST', body: JSON.stringify({ msgId, data }) });
  }, []);

  const handleKvkkAccepted = useCallback(() => {
    setKvkkAccepted(true);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

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
      {/* Overlay — MiniJules modunda kararmaz */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: (isMinimized || isPinned) ? "transparent" : "rgba(0,0,0,0.38)",
          backdropFilter: (isMinimized || isPinned) ? "none" : "blur(2px)",
          WebkitBackdropFilter: (isMinimized || isPinned) ? "none" : "blur(2px)",
          pointerEvents: (isMinimized || isPinned) ? "none" : "auto",
          transition: "background 0.35s ease, backdrop-filter 0.35s ease",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) handleMinimize(); }}
      >
        <style>{`
          @keyframes jules-slide-in-right {
            from { opacity: 0; transform: translateX(32px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>

        {/* Ana widget kapsayıcı — minimize modunda gizli */}
        {!isMinimized && (
          <div
            ref={boxRef}
            style={{
              pointerEvents: "auto",
              ...(isPinned ? {
                position: "fixed",
                right: 0, top: 0,
                width: "390px",
                height: "100dvh",
                borderRadius: "7px 0 0 7px",
                boxShadow: "-8px 0 48px rgba(0,0,0,0.28), -2px 0 8px rgba(0,0,0,0.10)",
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
                  onClose={handleMinimize}
                  kvkkAccepted={kvkkAccepted}
                  submittedForms={submittedForms}
                  onFormSubmit={handleFormSubmit}
                  onKvkkAccepted={handleKvkkAccepted}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MiniJules — overlay dışında, her zaman tıklanabilir */}
      {(isMinimized || introAnimating) && (
        <MiniJules
          isPinnedRight={isPinned}
          suggestions={getSuggestions()}
          hasMessages={messages.length > 0}
          onExpand={handleExpand}
          containerRef={miniJulesRefCb}
          isAnimating={introAnimating}
        />
      )}
    </JulesContext.Provider>
  );
}