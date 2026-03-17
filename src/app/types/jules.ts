// ─── Paylaşılan veri tipleri ──────────────────────────────────────────────────
// Bu dosya tüm bileşenlerin ortak tipler için tek kaynağıdır.
// ChatPanel, ContentPanel, MessageList, ChipBar vd. buradan import eder.

// ── Form tipleri ──────────────────────────────────────────────────────────────
export type FormType = 'anaform' | 'adsoyad' | 'eposta';

export type FormFieldData = {
  adSoyad?: string;
  eposta?: string;
  telefon?: string;
  mesaj?: string;
  kvkkAccepted: boolean;
};

/**
 * FormSubmission — Backend entegrasyon arayüzü.
 * TSX tarafında stub olarak kullanılır.
 * Production'da jules:formsubmit event'inde detail objesi bu şemayı taşır.
 */
export type FormSubmission = {
  formType: FormType;
  msgId: string;
  submittedAt: string;
  data: FormFieldData;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  hasCards?: boolean;
  cardLabel?: string;
  formType?: FormType; // Varsa bu bot mesajının altına inline form render edilir
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
  url?: string;
  noImage?: boolean;
};

export type PanelSession = {
  id: string;
  cards: CardItem[];
  title: string;
  timestamp: Date;
};