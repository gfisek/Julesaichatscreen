// ─── Paylaşılan veri tipleri ──────────────────────────────────────────────────
// Bu dosya tüm bileşenlerin ortak tipler için tek kaynağıdır.
// ChatPanel, ContentPanel, MessageList, ChipBar vd. buradan import eder.

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  hasCards?: boolean;
  cardLabel?: string;
};

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
  noImage?: boolean;
};

export type PanelSession = {
  id: string;
  cards: CardItem[];
  title: string;
  timestamp: Date;
};
