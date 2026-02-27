import { useState, useCallback, useRef, useEffect } from "react";
import { ChatPanel, type Message } from "./ChatPanel";
import { ContentPanel, type CardItem, type PanelSession } from "./ContentPanel";

// ─── Mock card datasets ───────────────────────────────────────────────────────
const HOTEL_CARDS: CardItem[] = [
  {
    id: "h1", type: "hotel", title: "The Grand Bosphorus",
    subtitle: "5 Yıldızlı Otel · İstanbul, Türkiye",
    description: "Boğaz'ın nefes kesen manzarasına sahip lüks odalar ve süitler. Spa, açık yüzme havuzu ve dünyaca ünlü şeflerin yönettiği restoran ile unutulmaz bir konaklama deneyimi sunar.",
    image: "https://images.unsplash.com/photo-1509647924673-bbb53e22eeb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb20lMjBsdXh1cnl8ZW58MXx8fHwxNzcxNTA3NjcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺4.200/gece", originalPrice: "₺5.800", rating: 4.8, reviews: 1240,
    badge: "En Popüler", badgeColor: "#1c3d54", location: "Beşiktaş, İstanbul",
    tags: ["Spa", "Kahvaltı Dahil", "WiFi"], cta: "Oda Seç",
  },
  {
    id: "h2", type: "hotel", title: "City Loft Suites",
    subtitle: "Butik Otel · stanbul, Türkiye",
    description: "Taksim'in kalbinde şık ve modern butik otel. Endüstriyel tasarım unsuruyla donatılmış geniş odalar, çatı terası ve özel cocktail barıyla şehir kaçamakları için ideal seçim.",
    image: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYXBhcnRtZW50JTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzcxNTk2NzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺2.100/gece", originalPrice: "₺2.900", rating: 4.5, reviews: 830,
    badge: "%28 İndirim", badgeColor: "#059669", location: "Taksim, İstanbul",
    tags: ["Tasarım Otel", "WiFi", "Bar"], cta: "Rezervasyon Yap",
  },
  {
    id: "h3", type: "hotel", title: "Aegean Pearl Resort",
    subtitle: "Resort · Bodrum, Türkiye",
    description: "Türkbükü koyunun masmavi sularına sıfır konumda sonsuzluk havuzlu lüks resort. All-inclusive seçeneği, özel plaj ve su sporları imkânlarıyla yaz tatilinin en iyisini yaşatır.",
    image: "https://images.unsplash.com/photo-1715242563833-946f4b811399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMHRyb3BpY2FsJTIwcG9vbHxlbnwxfHx8fDE3NzE1OTY3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺3.600/gece", rating: 4.7, reviews: 2180,
    badge: "Yeni", badgeColor: "#1ba3b8", location: "Türkbükü, Bodrum",
    tags: ["Plaj", "Havuz", "All Inclusive"], cta: "Detayları Gör",
  },
  {
    id: "h4", type: "hotel", title: "Mountain View Lodge",
    subtitle: "Dağ Evi · Uludağ, Bursa",
    description: "Uludağ'ın yayla havasında kütük ev mimarisiyle inşa edilmiş dağ evi. Kışın kayak pistlerine yürüme mesafesinde, yazın ise serin doğa yürüyüşleri için mükemmel bir kaçış noktası.",
    image: "https://images.unsplash.com/photo-1679234148876-7e558003f115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbiUyMG1vdW50YWluc3xlbnwxfHx8fDE3NzE1Njg4ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺1.800/gece", originalPrice: "₺2.400", rating: 4.3, reviews: 560,
    location: "Uludağ, Bursa", tags: ["Kayak", "Şömine", "Spa"], cta: "Müsaitliği Kontrol Et",
  },
  {
    id: "h5", type: "hotel", title: "Alaçatı Stone House",
    subtitle: "Butik Otel · Alaçatı, İzmir",
    description: "Ege'nin rüzgarlı koyunda taş duvarlar ve beyaz badanalı bir dönüşüm. Zengin kahvaltısı, bisiklet kiralama imkânı ve rüzgar sörfü merkezlerine yakınlığıyla Alaçatı'nın en sevilen butikleri arasında.",
    image: "https://images.unsplash.com/photo-1746475470697-f40519dab2bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBib3V0aXF1ZSUyMGhvdGVsJTIwcG9vbCUyMHRlcnJhY2V8ZW58MXx8fHwxNzcxNjM1NDk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺2.800/gece", originalPrice: "₺3.400", rating: 4.6, reviews: 920,
    badge: "Ege'nin İncisi", badgeColor: "#4dc4ce", location: "Alaçatı, İzmir",
    tags: ["Kahvaltı", "Bisiklet", "Sörf"], cta: "Rezervasyon Yap",
  },
  {
    id: "h6", type: "hotel", title: "Pera Palace Hotel",
    subtitle: "Tarihi Otel · Beyoğlu, İstanbul",
    description: "1892'de Orient Express yolcuları için inşa edilen efsanevi otel. Agatha Christie'nin ilham aldığı Neo-Klasik mimarisi ve Boğaz manzaralı teraslı balosuyla tarihin içinde yaşayın.",
    image: "https://images.unsplash.com/photo-1559081623-8ce23ec117d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpYyUyMElzdGFuYnVsJTIwaG90ZWwlMjBsb2JieSUyMGVsZWdhbnR8ZW58MXx8fHwxNzcxNjM1NDk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺5.500/gece", rating: 4.9, reviews: 4100,
    badge: "Tarihi Miras", badgeColor: "#1c3d54", location: "Beyoğlu, İstanbul",
    tags: ["Heritage", "Spa", "Restoran"], cta: "Oda Seç",
  },
];

const RESTAURANT_CARDS: CardItem[] = [
  {
    id: "r1", type: "place", title: "Nusret Steakhouse",
    subtitle: "Et Restoranı · Kuruçeşme",
    description: "Dünyaca ünlü şef Nusret'in en gözde restoranı. El seçimi wagyu ve dry-aged etler, özel servis ritüeli ve zarif atmosferiyle fine dining deneyimini yeniden tanımlıyor.",
    image: "https://images.unsplash.com/photo-1762922425226-8cfe6987e7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpbmluZ3xlbnwxfHx8fDE3NzE1ODE5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺800+/kişi", rating: 4.6, reviews: 3420,
    badge: "Michelin Önerisi", badgeColor: "#1c3d54", location: "Kuruçeşme, İstanbul",
    time: "12:00 – 00:00", tags: ["Et", "Fine Dining", "Rezervasyon"], cta: "Rezervasyon Yap",
  },
  {
    id: "r2", type: "place", title: "Çiya Sofrası",
    subtitle: "Anadolu Mutfağı · Kadıköy",
    description: "Musa Dağdeviren'in 35 yıllık emeğiyle kurduğu Anadolu mutfağının kalbi. Güneydoğu'dan Ege'ye uzanan 200'den fazla yöresel tarif, her gün taze ve mevsimsel malzemelerle sofranıza geliyor.",
    image: "https://images.unsplash.com/photo-1660145177383-e6e2c22adb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjB3b3Jrc3BhY2UlMjBwcm9kdWN0aXZpdHl8ZW58MXx8fHwxNzcxNTk2NzEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺200–400/kişi", rating: 4.9, reviews: 8900,
    badge: "Efsane Lezzet", badgeColor: "#0a6e82", location: "Kadıköy, İstanbul",
    time: "11:00 – 22:00", tags: ["Türk Mutfağı", "Uygun Fiyat", "Kebap"], cta: "Menüyü Gör",
  },
  {
    id: "r3", type: "place", title: "Sunset Rooftop Bar",
    subtitle: "Kokteyl Bar & Restaurant · Galata",
    description: "Galata Kulesi'nin siluetine karşı İstanbul'un iki yakasını izleyebileceğiniz çatı katı mekan. Yaratıcı kokteyller, tapas menüsü ve canlı DJ performanslarıyla gece hayatının vazgeçilmezi.",
    image: "https://images.unsplash.com/photo-1762457556450-365eb6ee21d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWRpdGVycmFuZWFuJTIwcm9vZnRvcCUyMHJlc3RhdXJhbnQlMjB2aWV3JTIwc2VhfGVufDF8fHx8MTc3MTYzNTUwMXww&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺500–900/kişi", rating: 4.4, reviews: 1890,
    badge: "Manzara", badgeColor: "#4dc4ce", location: "Galata, İstanbul",
    time: "18:00 – 02:00", tags: ["Rooftop", "Kokteyl", "Romantik"], cta: "Masa Ayırt",
  },
  {
    id: "r4", type: "place", title: "Balıkçı Sabahattin",
    subtitle: "Balık Restoranı · Sultanahmet",
    description: "Sultanahmet'in tarihi sokaklarında 1927'den bu yana hizmet veren köklü balık lokantası. Günlük taze Boğaz balıkları, zeytinyağlı mezeler ve Türk rakısıyla otantik bir İstanbul sofrası.",
    image: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYXBhcnRtZW50JTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzcxNTk2NzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺350–600/kişi", rating: 4.5, reviews: 2340,
    location: "Sultanahmet, İstanbul", time: "12:00 – 23:00",
    tags: ["Balık", "Deniz Ürünleri", "Tarihi"], cta: "İncele",
  },
  {
    id: "r5", type: "place", title: "Mikla Restaurant",
    subtitle: "İskandinav-Türk Füzyon · Beyoğlu",
    description: "Şef Mehmet Gürs'ün imza restoranı. İstanbul'un en yüksek noktalarından birinde, çağdaş Türk mutfağını İskandinav tekniklerle harmanlayan panoramik manzaralı gurme deneyimi.",
    image: "https://images.unsplash.com/photo-1509647924673-bbb53e22eeb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb20lMjBsdXh1cnl8ZW58MXx8fHwxNzcxNTA3NjcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺900–1400/kişi", rating: 4.8, reviews: 2760,
    badge: "Fine Dining", badgeColor: "#1c3d54", location: "Beyoğlu, İstanbul",
    time: "18:30 – 23:30", tags: ["Füzyon", "Manzara", "Tasting Menu"], cta: "Rezervasyon Yap",
  },
];

const PRODUCT_CARDS: CardItem[] = [
  {
    id: "p1", type: "product", title: "Nike Air Max 270",
    subtitle: "Spor Ayakkabı · Nike",
    description: "Nike'ın ikonik Max Air yastıklama teknolojisiyle tasarlanmış günlük spor ayakkabı. Hafif mesh üst yüzey, geniş burun bölgesi ve kaymaz dış taban ile konfor sağlar.",
    image: "https://images.unsplash.com/photo-1570348272490-7d6d5fddf335?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBwcm9kdWN0JTIwc2hvZXMlMjBzbmVha2Vyc3xlbnwxfHx8fDE3NzE1OTY3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺3.499", originalPrice: "₺4.999", rating: 4.7, reviews: 5420,
    badge: "%30 İndirim", badgeColor: "#059669", tags: ["Spor", "Günlük", "Unisex"], cta: "Sepete Ekle",
  },
  {
    id: "p2", type: "product", title: "MacBook Air M3",
    subtitle: "Laptop · Apple",
    description: "Apple Silicon M3 çipiyle donatılmış ince ve hafif dizüstü bilgisayar. 18 saate kadar pil ömrü, Liquid Retina ekran ve tam gün performansıyla yaratıcı profesyoneller için tasarlandı.",
    image: "https://images.unsplash.com/photo-1660145177383-e6e2c22adb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjB3b3Jrc3BhY2UlMjBwcm9kdWN0aXZpdHl8ZW58MXx8fHwxNzcxNTk2NzEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺54.999", rating: 4.9, reviews: 9870,
    badge: "Yeni Ürün", badgeColor: "#1ba3b8", tags: ["Laptop", "Üretkenlik", "Premium"], cta: "Satın Al",
  },
  {
    id: "p3", type: "product", title: "Sony WH-1000XM5",
    subtitle: "Kablosuz Kulaklık · Sony",
    description: "Sony'nin amiral gemisi gürültü engelleme kulaklığı. Endüstri lideri ANC teknolojisi, 30 saatlik pil ömrü ve katlanabilir tasarımıyla seyahat ve ofis kullanımı için en iyi seçenek.",
    image: "https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTb255JTIwd2lyZWxlc3MlMjBoZWFkcGhvbmVzJTIwbm9pc2UlMjBjYW5jZWxsaW5nfGVufDF8fHx8MTc3MTYzNzQzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺8.999", originalPrice: "₺11.999", rating: 4.8, reviews: 7230,
    badge: "En Çok Satan", badgeColor: "#0a6e82", tags: ["ANC", "Bluetooth", "30 Saat"],
    cta: "Ürünü İncele", productId: "sony-wh1000xm5",
  },
  {
    id: "p4", type: "product", title: "Apple Watch Ultra 2",
    subtitle: "Akıllı Saat · Apple",
    description: "Apple'ın en güçlü akıllı saati. Titanyum kasa, 60 saatlik pil ömrü, 100m su direnci ve hassas GPS ile dağ tırmanışından derinsu dalışına tüm maceralarınıza eşlik ediyor.",
    image: "https://images.unsplash.com/photo-1716234479503-c460b87bdf98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNoJTIwd2VhcmFibGUlMjB0ZWNoJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzE2MzU0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "₺34.999", rating: 4.8, reviews: 4210,
    badge: "Premium", badgeColor: "#1c3d54", tags: ["Spor", "GPS", "Titanium"], cta: "İncele",
  },
];

type Scenario = {
  keywords: string[];
  reply: string;
  cards?: CardItem[];
  cardLabel?: string;
  panelTitle?: string;
};

const SCENARIOS: Scenario[] = [
  {
    keywords: ["otel", "hotel", "konaklama", "bodrum", "istanbul", "uludağ", "tatil"],
    reply: "İstanbul ve çevresinde size uygun otel seçeneklerini buldum! Bütçenize, konumunuza ve tercihlerinize göre filtrelenmiş 6 harika seçenek var. Detayları sağ tarafta inceleyebilirsiniz.",
    cards: HOTEL_CARDS, cardLabel: "6 Otel", panelTitle: "Önerilen Oteller",
  },
  {
    keywords: ["restoran", "yemek", "restaurant", "lokanta", "kebap", "balık", "yeme"],
    reply: "İstanbul'un en sevilen restoranlarını sizin için derledim! Farklı mutfak türleri ve fiyat aralıklarında 5 özel öneri sizi bekliyor. Sağ panelden detayları inceleyip rezervasyon yapabilirsiniz.",
    cards: RESTAURANT_CARDS, cardLabel: "5 Restoran", panelTitle: "Önerilen Restoranlar",
  },
  {
    keywords: ["ürün", "satın", "ayakkabı", "laptop", "kulaklık", "teknoloji", "alışveriş", "fiyat", "çok satan", "ürünler"],
    reply: "Aradığınız ürünlerle ilgili size en iyi seçenekleri buldum! Puan, fiyat ve özelliklere göre sıralanmış 4 ürün var. Sağ tarafta detaylıca inceleyebilir ve sepete ekleyebilirsiniz.",
    cards: PRODUCT_CARDS, cardLabel: "4 Ürün", panelTitle: "Önerilen Ürünler",
  },
  {
    keywords: ["bütçe", "uygun", "ekonomik", "ucuz", "indirim"],
    reply: "Bütçenize uygun seçenekleri filtreledim! En iyi fiyat-performans oranına sahip 6 otel sağ panelde sizi bekliyor.",
    cards: HOTEL_CARDS, cardLabel: "6 Bütçeye Uygun Otel", panelTitle: "Bütçeye Uygun Seçenekler",
  },
];

const DEFAULT_REPLIES = [
  "Anlıyorum! Size daha iyi yardımcı olabilmem için biraz daha bilgi verir misiniz? Örneğin bütçeniz veya tercih ettiğiniz konum nedir?",
  "Harika bir soru! Bu konuda size yardımcı olmak için birkaç seçenek hazırlıyorum...",
  "Tabii ki! Bu konuda en güncel ve güvenilir bilgileri getiriyorum, bir an lütfen.",
  "Mükemmel! Sizin için en uygun seçenekleri analiz ediyorum. Tercihlerinizi öğrenmek ister misiniz?",
];

interface JulesWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  headerHeight?: number;
  onProductClick?: (productId: string) => void;
  variant?: "overlay" | "drawer";
  isDark?: boolean;
  onDarkChange?: (v: boolean) => void;
}

export function JulesWidget({ isOpen, onClose, headerHeight = 64, onProductClick, variant = "overlay", isDark: externalIsDark, onDarkChange }: JulesWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeCardMsgId, setActiveCardMsgId] = useState<string | null>(null);
  const [panelSessions, setPanelSessions] = useState<PanelSession[]>([]);
  const [cardData, setCardData] = useState<Record<string, { cards: CardItem[]; title: string }>>({});
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());
  const [scrollToSessionId, setScrollToSessionId] = useState<string | null>(null);
  const [internalIsDark, setInternalIsDark] = useState(false);
  const isDark = externalIsDark !== undefined ? externalIsDark : internalIsDark;
  const setIsDark = (v: boolean) => {
    setInternalIsDark(v);
    onDarkChange?.(v);
  };
  const defaultReplyIndexRef = useRef(0);
  const isMobileRef = useRef(isMobile);
  const isDrawerRef = useRef(variant === "drawer");

  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  useEffect(() => {
    if (isMobile && isPanelOpen) {
      setIsPanelOpen(false);
      setActiveCardMsgId(null);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when widget is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
      document.body.dataset.scrollY = String(scrollY);
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      delete document.body.dataset.scrollY;
      window.scrollTo(0, scrollY);
    }
    return () => {
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      delete document.body.dataset.scrollY;
      if (scrollY) window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const handleSend = useCallback((text: string) => {
    const userMsg: Message = { id: generateId(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const lower = text.toLowerCase();
    const matched = SCENARIOS.find((s) => s.keywords.some((kw) => lower.includes(kw)));
    const delay = 1200 + Math.random() * 800;

    setTimeout(() => {
      setIsTyping(false);
      const botMsgId = generateId();
      const botMsg: Message = {
        id: botMsgId, role: "assistant",
        content: matched ? matched.reply : DEFAULT_REPLIES[defaultReplyIndexRef.current++ % DEFAULT_REPLIES.length],
        timestamp: new Date(), hasCards: !!matched?.cards, cardLabel: matched?.cardLabel,
      };
      setMessages((prev) => [...prev, botMsg]);

      if (matched?.cards) {
        const sessionData = { cards: matched.cards!, title: matched.panelTitle || "Sonuçlar" };
        setCardData((prev) => ({ ...prev, [botMsgId]: sessionData }));
        setTimeout(() => {
          setActiveCardMsgId(botMsgId);
          setPanelSessions((prev) => [...prev, { id: botMsgId, cards: matched.cards!, title: matched.panelTitle || "Sonuçlar", timestamp: new Date() }]);
          if (!isMobileRef.current && !isDrawerRef.current) setIsPanelOpen(true);
        }, 300);
      }
    }, delay);
  }, []);

  const handleShowCards = useCallback((msgId: string) => {
    setActiveCardMsgId(msgId);
    setIsPanelOpen(true);
    setCardData((prev) => {
      const data = prev[msgId];
      if (!data) return prev;
      setPanelSessions((sessions) => {
        if (sessions.find((s) => s.id === msgId)) return sessions;
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

  const isDrawer = variant === "drawer";
  // For drawer: always force mobile layout
  const effectiveMobile = isDrawer ? true : isMobile;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: isDrawer ? 45 : 40,
          top: headerHeight,
          background: "rgba(0,0,0,0.35)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Widget Panel */}
      <div
        style={
          isDrawer
            ? {
                position: "fixed", right: 0, zIndex: 50,
                top: headerHeight,
                width: 390,
                height: `calc(100dvh - ${headerHeight}px)`,
                transform: isOpen ? "translateX(0)" : "translateX(100%)",
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? "all" : "none",
                transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
                display: "flex",
                flexDirection: "column",
              }
            : {
                position: "fixed", left: 0, right: 0, zIndex: 50,
                top: headerHeight,
                height: `calc(100dvh - ${headerHeight}px)`,
                transform: isOpen ? "translateY(0)" : "translateY(-18px)",
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? "all" : "none",
                transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
                display: "flex",
                justifyContent: "center",
                alignItems: isMobile ? undefined : "center",
                padding: isMobile ? 0 : "28px 0",
              }
        }
      >
        {/* Inner container */}
        <div
          className="flex h-full w-full transition-all duration-300 ease-in-out"
          style={{
            maxWidth: effectiveMobile ? "100%" : "1200px",
            flexDirection: effectiveMobile ? "column" : "row",
            background: effectiveMobile
                ? (isDark ? "rgba(10, 23, 32, 0.84)" : "rgba(255, 255, 255, 1)")
                : (isDark ? "rgba(10, 23, 32, 0.84)" : "rgba(255, 255, 255, 0.84)"),
            backdropFilter: "blur(24px) saturate(1.6)",
            WebkitBackdropFilter: "blur(24px) saturate(1.6)",
            boxShadow: isDrawer ? "-8px 0 40px rgba(0,0,0,0.25)" : "0 8px 40px rgba(0,0,0,0.25)",
            borderRadius: isDrawer ? "0" : (effectiveMobile ? 0 : "38px"),
            overflow: "hidden",
          }}
        >
          {/* Content panel */}
          {isPanelOpen && (
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out opacity-100"
              style={
                effectiveMobile
                  ? { height: "50%", width: "100%", borderBottom: `1px solid ${isDark ? "#3d7089" : "#e5e7eb"}`, flexShrink: 0, order: 1 }
                  : { flex: 1, borderLeft: `1px solid ${isDark ? "#3d7089" : "#e5e7eb"}`, order: 2 }
              }
            >
              <ContentPanel
                sessions={panelSessions}
                activeSessionId={activeCardMsgId}
                onClose={handleClosePanel}
                isMobile={effectiveMobile}
                likedCards={likedCards}
                onLikedCardsChange={setLikedCards}
                scrollToSessionId={scrollToSessionId}
                onScrollHandled={() => setScrollToSessionId(null)}
                isDark={isDark}
                onProductClick={onProductClick}
              />
            </div>
          )}

          {/* Chat panel */}
          <div
            className="flex flex-col transition-all duration-300 ease-in-out"
            style={
              effectiveMobile
                ? { height: isPanelOpen ? "50%" : "100%", width: "100%", flexShrink: 0, order: 2, overflow: "hidden" }
                : { width: isPanelOpen ? "50%" : "100%", flexShrink: 0, order: 1, overflow: "hidden" }
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
              isDark={isDark}
              onToggleDark={() => setIsDark((v) => !v)}
              isMobile={effectiveMobile}
              cardData={cardData}
              likedCards={likedCards}
              onLikedCardsChange={setLikedCards}
              panelSessions={panelSessions}
              onProductClick={onProductClick}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );
}