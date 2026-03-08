import { useState, useCallback, useMemo } from "react";
import { useJulesContext } from "../context/JulesContext";
import { ChatHeader }      from "./chat/ChatHeader";
import { MessageList }     from "./chat/MessageList";
import { ChipBar }         from "./chat/ChipBar";
import { ChatInput }       from "./chat/ChatInput";
import { FavoritesDrawer } from "./chat/FavoritesDrawer";
import type { PanelSession } from "./ContentPanel";
import type { CardItem }   from "../types/jules";
// Message tipi artık types/jules.ts'de tanımlı; buradan re-export edilir.
export type { Message } from "../types/jules";

type Props = {
  messages: Message[];
  onSend: (text: string) => void;
  onShowCards: (msgId: string) => void;
  activeCardMsgId: string | null;
  isTyping: boolean;
  isPanelOpen: boolean;
  hasPanelSessions: boolean;
  onTogglePanel: () => void;
  isMobile?: boolean;
  cardData?: Record<string, { cards: CardItem[]; title: string }>;
  panelSessions?: PanelSession[];
  onProductClick?: (productId: string) => void;
  onClose?: () => void;
  isPinnedRight?: boolean;
  onTogglePinnedRight?: () => void;
  suggestions?: string[];
};

const DEFAULT_SUGGESTIONS = [
  "İstanbul'da otel öner",
  "Bütçeme uygun seçenekler",
  "En iyi restoranlar",
  "Çok satan ürünler",
];

export function ChatPanel({
  messages, onSend, onShowCards, activeCardMsgId, isTyping,
  isPanelOpen, hasPanelSessions, onTogglePanel,
  isMobile, cardData, panelSessions, onProductClick, onClose,
  isPinnedRight, onTogglePinnedRight,
  suggestions: suggestionsProp,
}: Props) {
  const { isDark, likedCards } = useJulesContext();
  const suggestions = suggestionsProp ?? DEFAULT_SUGGESTIONS;

  const [isGlowing, setIsGlowing]        = useState(false);
  const [showFavDrawer, setShowFavDrawer] = useState(false);

  const isCompact = isMobile || !!isPinnedRight;
  const border    = isDark ? "#1d3547" : "#e5e7eb";

  // Favorites data — useMemo: yalnızca panelSessions veya likedCards değişince yeniden hesaplanır
  const allFavCards = useMemo(() =>
    (panelSessions || []).flatMap(s =>
      s.cards
        .filter(c => likedCards.has(`${s.id}-${c.id}`))
        .map(c => ({ card: c, sessionId: s.id }))
    ),
    [panelSessions, likedCards]
  );
  const totalFavCount = useMemo(() => allFavCards.length, [allFavCards]);

  const handleChipSend = useCallback((text: string) => {
    onSend(text);
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 800);
  }, [onSend]);

  return (
    <div className="flex flex-col h-full" style={{ background: "transparent", transition: "background 0.3s" }}>

      <ChatHeader
        isMobile={isMobile}
        isPinnedRight={isPinnedRight}
        isCompact={isCompact}
        border={border}
        onClose={onClose}
        onShowFavDrawer={() => setShowFavDrawer(true)}
        totalFavCount={totalFavCount}
        isPanelOpen={isPanelOpen}
        hasPanelSessions={hasPanelSessions}
        onTogglePanel={onTogglePanel}
        onTogglePinnedRight={onTogglePinnedRight}
      />

      <MessageList
        messages={messages}
        isTyping={isTyping}
        isCompact={isCompact}
        isPanelOpen={isPanelOpen}
        cardData={cardData}
        activeCardMsgId={activeCardMsgId}
        onShowCards={onShowCards}
        isMobile={isMobile}
        onProductClick={onProductClick}
        suggestions={suggestions}
        onSend={onSend}
      />

      <ChipBar
        messages={messages}
        suggestions={suggestions}
        isCompact={isCompact}
        isMobile={isMobile}
        isPinnedRight={isPinnedRight}
        onChipSend={handleChipSend}
      />

      <ChatInput
        onSend={onSend}
        isCompact={isCompact}
        isMobile={isMobile}
        isPinnedRight={isPinnedRight}
        isPanelOpen={isPanelOpen}
        hasPanelSessions={hasPanelSessions}
        onTogglePanel={onTogglePanel}
        isGlowing={isGlowing}
        hasMessages={messages.length > 0}
      />

      {isCompact && (
        <FavoritesDrawer
          isOpen={showFavDrawer}
          onClose={() => setShowFavDrawer(false)}
          allFavCards={allFavCards}
          totalFavCount={totalFavCount}
          isMobile={isMobile}
          onProductClick={onProductClick}
        />
      )}
    </div>
  );
}