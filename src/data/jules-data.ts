/**
 * jules-data.ts
 *
 * React uygulaması bu dosyadan veriyi import eder (geliştirme + preview ortamı).
 * Production'da jules-widget.js aynı şemayı /public/jules-widget/config.json
 * ve /public/jules-widget/cards.json dosyalarından fetch eder.
 *
 * Şema değişirse her iki tarafı (bu dosya + public JSON'lar) birlikte güncelle.
 */

import type { CardItem } from "../app/components/ContentPanel";

// ─── Tipler ──────────────────────────────────────────────────────────────────

export type JulesConfig = {
  branding: { name: string; poweredBy: string; poweredByUrl: string };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    accentLight: string;
    accentBg: string;
  };
  font: { family: string };
  suggestions: string[];
  defaultReplies: string[];
};

export type JulesScenario = {
  keywords: string[];
  reply: string;
  dataset: string;
  cardLabel: string;
  panelTitle: string;
};

export type JulesCardsData = {
  datasets: Record<string, CardItem[]>;
  scenarios: JulesScenario[];
};

// ─── config.json yansıması ───────────────────────────────────────────────────

export const JULES_CONFIG: JulesConfig = {
  branding: {
    name: "JULES",
    poweredBy: "Powered by Creator AI",
    poweredByUrl: "https://creator.com.tr",
  },
  colors: {
    primary:     "#1c3d54",
    secondary:   "#0a6e82",
    accent:      "#1ba3b8",
    accentLight: "#4dc4ce",
    accentBg:    "#e6f7f9",
  },
  font: { family: "inherit" },
  suggestions: [
    "iPhone 16 serisi",
    "Mac modelleri",
    "AirPods & aksesuarlar",
    "En çok satanlar",
  ],
  defaultReplies: [
    "Elbette! Apple ürünleri hakkında her konuda size yardımcı olmaya hazırım. Hangi ürün veya özellik ilginizi çekiyor?",
    "Harika bir soru! Apple ekosistemi hakkında size en doğru ve güncel bilgileri getiriyorum, bir an lütfen.",
    "Tabii ki! iPhone'dan Mac'e, AirPods'tan Apple Watch'a — tüm konularda yardım etmek için buradayım.",
    "Mükemmel! Size en uygun Apple ürününü bulmak için hemen inceliyorum. Kullanım alışkanlıklarınızı anlatır mısınız?",
  ],
};

// ─── cards.json yansıması ────────────────────────────────────────────────────

export const JULES_CARDS: JulesCardsData = {
  datasets: {

    // ── iPhone 16 Serisi ──────────────────────────────────────────────────────
    iphones: [
      {
        id: "ip1", type: "product",
        title: "iPhone 16 Pro Max",
        subtitle: "6.9\" · Doğal Titanyum",
        description: "Apple'ın en büyük Pro ekranı, A18 Pro çip ve 5x optik zoom kamera. Dört renk seçeneği ve Kamera Kontrolü ile profesyonel fotoğrafçılık artık parmak ucunuzda.",
        image: "https://images.unsplash.com/photo-1725625972772-9f1bc04a2608?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$1,199", rating: 4.9, reviews: 15240,
        badge: "Yeni", badgeColor: "#1c3d54",
        tags: ["Titanyum", "A18 Pro", "5x Zoom"], cta: "Satın Al",
      },
      {
        id: "ip2", type: "product",
        title: "iPhone 16 Pro",
        subtitle: "6.3\" · Doğal Titanyum",
        description: "Kamera Kontrolü, A18 Pro çip ve 4K 120fps ProRes video ile iPhone deneyimi yeniden tanımlanıyor. Kompakt formda en üst düzey performans.",
        image: "https://images.unsplash.com/photo-1588295207965-dded25c206c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$999", rating: 4.9, reviews: 18730,
        badge: "Pro", badgeColor: "#1c3d54",
        tags: ["Kamera Kontrolü", "A18 Pro", "4K ProRes"], cta: "Satın Al",
      },
      {
        id: "ip3", type: "product",
        title: "iPhone 16",
        subtitle: "6.1\" · 5 Renk Seçeneği",
        description: "A18 çip, Dynamic Island ve Kamera Kontrolü ile güçlü bir başlangıç. Apple Intelligence özellikleri ve geliştirilmiş 48MP kamerayla her anı mükemmel kaydeder.",
        image: "https://images.unsplash.com/photo-1576935429546-2ea4323c7a79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$799", rating: 4.8, reviews: 23400,
        tags: ["A18", "Dynamic Island", "Kamera Kontrolü"], cta: "Satın Al",
      },
      {
        id: "ip4", type: "product",
        title: "iPhone 16 Plus",
        subtitle: "6.7\" · Büyük Ekran, Uzun Pil",
        description: "iPhone 16'nın tüm gücü, daha büyük bir ekranda. A18 çip ve uzun pil ömrüyle tam gün kesintisiz kullanım. Dynamic Island ve Kamera Kontrolü dahil.",
        noImage: true,
        price: "$899", rating: 4.7, reviews: 11200,
        badge: "Büyük Ekran", badgeColor: "#1ba3b8",
        tags: ["6.7'' OLED", "A18", "Uzun Pil"], cta: "Satın Al",
      },
      {
        id: "ip5", type: "product",
        title: "iPhone 15 Pro",
        subtitle: "6.1\" · Titanyum · Fırsatla",
        description: "Titanyum kasa, A17 Pro çip ve USB‑C ile iPhone'da yeni bir dönem. Action Button ve 48MP kamera sistemi, şimdi çok daha uygun fiyatla.",
        image: "https://images.unsplash.com/photo-1725625972772-9f1bc04a2608?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$699", originalPrice: "$999", rating: 4.8, reviews: 31500,
        badge: "%30 İndirim", badgeColor: "#059669",
        tags: ["USB-C", "A17 Pro", "Titanyum"], cta: "Satın Al",
      },
      {
        id: "ip6", type: "product",
        title: "iPhone 15",
        subtitle: "6.1\" · Dynamic Island · USB-C",
        description: "Dynamic Island ve USB-C, ilk kez standart iPhone'da. 48MP Ana kamera ve A16 Bionic çipiyle muhteşem fotoğraflar çekin. En erişilebilir modern iPhone.",
        image: "https://images.unsplash.com/photo-1588295207965-dded25c206c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$599", originalPrice: "$799", rating: 4.7, reviews: 42100,
        cta: "Satın Al",
      },
    ],

    // ── Mac Modelleri ─────────────────────────────────────────────────────────
    macs: [
      {
        id: "mc1", type: "product",
        title: "MacBook Air 13\" M4",
        subtitle: "Fanless · 18 Saat Pil · 4 Renk",
        description: "M4 çipli MacBook Air — dünyanın en çok satan dizüstü bilgisayarı, şimdiye kadarki en güçlü haliyle. Sessiz fanless tasarım ve 18 saat pil ömrüyle tam gün çalışma özgürlüğü.",
        image: "https://images.unsplash.com/photo-1649744998058-1e25ed7ea1d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$1,099", rating: 4.9, reviews: 21400,
        badge: "Yeni", badgeColor: "#1c3d54",
        tags: ["M4 Çip", "18 Saat Pil", "Fanless"], cta: "Satın Al",
      },
      {
        id: "mc2", type: "product",
        title: "MacBook Air 15\" M4",
        subtitle: "15.3\" Liquid Retina · Fanless",
        description: "Büyük ve parlak 15\" ekranda M4 gücü. Taşınabilir hissettiren fanless bir 15\" dizüstü bilgisayar isteyenler için mükemmel seçim. 18 saatlik pil ve Thunderbolt 4 bağlantısıyla.",
        image: "https://images.unsplash.com/photo-1649744998058-1e25ed7ea1d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$1,299", rating: 4.9, reviews: 13800,
        tags: ["Büyük Ekran", "M4 Çip", "Uzun Pil"], cta: "Satın Al",
      },
      {
        id: "mc3", type: "product",
        title: "MacBook Pro 14\" M4 Pro",
        subtitle: "Liquid Retina XDR · ProRes Video",
        description: "M4 Pro çipinin olağanüstü gücü, Liquid Retina XDR ekranın mükemmel görüntü kalitesiyle buluşuyor. Video editing, kod ve yaratıcı projeler için 24 saate varan pil ömrüyle.",
        image: "https://images.unsplash.com/photo-1621111848501-8d3634f82336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$1,999", rating: 4.9, reviews: 9600,
        badge: "Pro", badgeColor: "#1c3d54",
        tags: ["M4 Pro", "Liquid XDR", "ProRes"], cta: "Satın Al",
      },
      {
        id: "mc4", type: "product",
        title: "MacBook Pro 16\" M4 Max",
        subtitle: "En Güçlü MacBook Pro",
        description: "M4 Max çipiyle sınırları aşan performans. 3D render, makine öğrenmesi ve 8K ProRes video düzenleme gibi en ağır görevler için. 16\" ekran, 128GB'a kadar birleşik bellek.",
        image: "https://images.unsplash.com/photo-1621111848501-8d3634f82336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$3,499", rating: 4.9, reviews: 5200,
        badge: "En Güçlü", badgeColor: "#1c3d54",
        tags: ["M4 Max", "16\" XDR", "128GB RAM"], cta: "Satın Al",
      },
      {
        id: "mc5", type: "product",
        title: "Mac mini M4",
        subtitle: "En Küçük Mac, En Büyük Güç",
        description: "Apple'ın şimdiye kadar tasarladığı en küçük Mac mini. M4 çipiyle masaüstünde inanılmaz hız, Thunderbolt 4 ve Wi-Fi 6E bağlantısıyla ev ve ofiste eksiksiz çalışma.",
        noImage: true,
        price: "$599", rating: 4.8, reviews: 16700,
        tags: ["M4 Çip", "Kompakt", "Thunderbolt 4"], cta: "Satın Al",
      },
      {
        id: "mc6", type: "product",
        title: "iMac 24\" M4",
        subtitle: "4.5K Retina · 7 Renk · Hepsi Bir Arada",
        description: "M4 çip, 4.5K Retina ekran ve zarif tek parça tasarımıyla iMac masaüstünü yeniden tanımlıyor. 7 canlı renk, altı hoparlörlü ses sistemi ve en ince iMac tasarımıyla.",
        image: "https://images.unsplash.com/photo-1716681864253-4693b3fe8e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$1,299", rating: 4.9, reviews: 12300,
        badge: "Hepsi Bir Arada", badgeColor: "#0a6e82",
        cta: "Satın Al",
      },
    ],

    // ── AirPods & Aksesuarlar ─────────────────────────────────────────────────
    accessories: [
      {
        id: "acc1", type: "product",
        title: "AirPods Pro (2. Nesil)",
        subtitle: "ANC · Spatial Audio · H2 Çip",
        description: "Sektörün en iyi Aktif Gürültü Engelleme teknolojisi, Kişiselleştirilmiş Mekânsal Ses ve 30 saatlik toplam pil ömrüyle. USB-C şarjlı MagSafe kılıfıyla tam özgürlük.",
        image: "https://images.unsplash.com/photo-1755182529034-189a6051faae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$249", rating: 4.9, reviews: 54200,
        badge: "En Çok Satan", badgeColor: "#1c3d54",
        tags: ["ANC", "Spatial Audio", "H2 Çip"], cta: "Satın Al",
      },
      {
        id: "acc2", type: "product",
        title: "AirPods 4",
        subtitle: "Yeni Tasarım · H2 Çip · USB-C",
        description: "Yeniden tasarlanan AirPods, H2 çip ve isteğe bağlı Aktif Gürültü Engelleme ile her kulağa uyacak şekilde özelleştirilebilir. Sesle Siri ve USB-C şarj desteği dahil.",
        noImage: true,
        price: "$129", rating: 4.7, reviews: 28700,
        tags: ["H2 Çip", "USB-C", "Açık Tasarım"], cta: "Satın Al",
      },
      {
        id: "acc3", type: "product",
        title: "AirPods Max",
        subtitle: "Over-Ear · Premium Ses · H2 Çip",
        description: "Alüminyum kafa bandı, örgülü kulaklık kapları ve H2 çipiyle üstün ses kalitesi. Sektörün en iyi ANC ve Şeffaflık Modu. Beş renk seçeneği, USB-C şarj.",
        image: "https://images.unsplash.com/photo-1765279302883-68bc58059bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$549", rating: 4.8, reviews: 17900,
        badge: "Premium", badgeColor: "#1c3d54",
        cta: "Satın Al",
      },
      {
        id: "acc4", type: "product",
        title: "Apple Watch Series 10",
        subtitle: "En İnce Apple Watch · Uyku Apnesi",
        description: "Apple'ın en ince ve en hafif akıllı saati. Uyku apnesi tespiti, çarpınma ölçümü ve hızlı şarj özelliğiyle sağlık ve zindeliğinizi her gün eksiksiz takip edin.",
        image: "https://images.unsplash.com/photo-1772683709326-134a6a4635d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$399", rating: 4.8, reviews: 31200,
        badge: "Yeni", badgeColor: "#1ba3b8",
        tags: ["Uyku Apnesi", "Kalp Ritmi", "Hızlı Şarj"], cta: "Satın Al",
      },
      {
        id: "acc5", type: "product",
        title: "Apple Watch Ultra 2",
        subtitle: "Titanyum · 60 Saat · 100m Su",
        description: "En zorlu koşullar için tasarlanan nihai Apple Watch. Titanyum kasa, 2000 nit parlaklık ve 60 saatlik pil ömrüyle derin su dalışından ultra maratona her maceraya hazır.",
        image: "https://images.unsplash.com/photo-1759489036027-44eac680741a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$799", rating: 4.9, reviews: 14600,
        badge: "Spor & Macera", badgeColor: "#1c3d54",
        tags: ["Titanyum", "100m Su Direnci", "60 Saat Pil"], cta: "Satın Al",
      },
    ],

    // ── En Çok Satanlar ───────────────────────────────────────────────────────
    bestsellers: [
      {
        id: "bs1", type: "product",
        title: "iPhone 16 Pro",
        subtitle: "2024'ün Bir Numaralı iPhone'u",
        description: "Kamera Kontrolü, A18 Pro çip ve sinema kalitesinde 4K ProRes video. Titanyum kasa ve 48MP kamerasıyla fotoğraf ve videoyu yeniden tanımlayan iPhone modeli.",
        image: "https://images.unsplash.com/photo-1725625972772-9f1bc04a2608?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$999", rating: 4.9, reviews: 18730,
        badge: "#1 iPhone", badgeColor: "#1c3d54",
        tags: ["A18 Pro", "Titanyum", "ProRes 4K"], cta: "Satın Al",
      },
      {
        id: "bs2", type: "product",
        title: "MacBook Air 15\" M4",
        subtitle: "Dünyanın En Çok Satan Dizüstüsü",
        description: "M4 çipi, büyük 15\" Liquid Retina ekran ve 18 saatlik pil ömrüyle öğrencilerin ve profesyonellerin favorisi. Fanless sessiz tasarım, her yerde tam performans.",
        image: "https://images.unsplash.com/photo-1649744998058-1e25ed7ea1d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$1,299", rating: 4.9, reviews: 13800,
        badge: "#1 Mac", badgeColor: "#1c3d54",
        cta: "Satın Al",
      },
      {
        id: "bs3", type: "product",
        title: "AirPods Pro (2. Nesil)",
        subtitle: "Dünyanın En Çok Satan Premium Kulaklığı",
        description: "H2 çip, sektör lideri ANC ve Kişiselleştirilmiş Mekânsal Ses. 30 saatlik pil ömrü ve USB-C şarjlı kılıfıyla tam gün kesintisiz müzik ve arama deneyimi.",
        image: "https://images.unsplash.com/photo-1755182529034-189a6051faae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$249", rating: 4.9, reviews: 54200,
        tags: ["ANC", "Spatial Audio", "USB-C"], cta: "Satın Al",
      },
      {
        id: "bs4", type: "product",
        title: "Apple Watch Series 10",
        subtitle: "En Çok Tercih Edilen Akıllı Saat",
        description: "Apple'ın en ince akıllı saati, uyku apnesi tespiti ve gelişmiş sağlık özellikleriyle. Hızlı şarj, 18 saatlik pil ve geniş ekranıyla günlük yaşamın vazgeçilmezi.",
        image: "https://images.unsplash.com/photo-1772683709326-134a6a4635d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$399", rating: 4.8, reviews: 31200,
        badge: "#1 Watch", badgeColor: "#0a6e82",
        cta: "Satın Al",
      },
      {
        id: "bs5", type: "product",
        title: "iPad Air M2",
        subtitle: "Üretkenlik ve Yaratıcılık Bir Arada",
        description: "M2 çip, Apple Pencil Pro ve Magic Keyboard desteğiyle iPad Air, taşınabilir üretkenliği yeniden tanımlıyor. Ultra ince Liquid Retina ekran, tam gün pil ömrü.",
        image: "https://images.unsplash.com/photo-1669691177924-f12fcc3cc540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$599", rating: 4.8, reviews: 22400,
        badge: "#1 iPad", badgeColor: "#1ba3b8",
        tags: ["M2 Çip", "Apple Pencil Pro", "Magic Keyboard"], cta: "Satın Al",
      },
    ],
  },

  scenarios: [
    {
      keywords: ["iphone", "telefon", "ios", "16 serisi", "15 serisi"],
      reply: "iPhone ailesi için en kapsamlı karşılaştırmayı hazırladım! A18 Pro'dan kamera sistemine, Titanyum tasarımdan pil ömrüne kadar tüm modeller sağ panelde sizi bekliyor. Hangi iPhone'un size göre olduğunu birlikte bulalım.",
      dataset: "iphones", cardLabel: "6 iPhone", panelTitle: "iPhone Modelleri",
    },
    {
      keywords: ["mac", "macbook", "imac", "mac mini", "macos", "laptop"],
      reply: "Mac ailesinin tüm yıldızlarını sizin için listeledim! M4 çipli yeni modeller inanılmaz bir performans sunuyor. MacBook Air'den iMac'e, kullanım amacınıza en uygun modeli birlikte seçelim.",
      dataset: "macs", cardLabel: "6 Mac", panelTitle: "Mac Modelleri",
    },
    {
      keywords: ["airpods", "aksesuar", "kulaklık", "apple watch", "watch"],
      reply: "AirPods, Apple Watch ve diğer Apple aksesuarları için güncel seçenekleri hazırladım! Spatial Audio'dan Aktif Gürültü Engelleme'ye, spor saatinden premium over-ear kulaklığa — tüm modeller sağ panelde.",
      dataset: "accessories", cardLabel: "5 Aksesuar", panelTitle: "AirPods & Aksesuarlar",
    },
    {
      keywords: ["en çok satan", "çok satanlar", "en popüler", "bestseller", "ürünler"],
      reply: "Apple'ın en çok satan ürünleri karşınızda! iPhone'dan Mac'e, AirPods'tan Apple Watch'a — müşterilerin en çok tercih ettiği 5 model sağ panelde sizi bekliyor. Beğendiğinizi kalp ikonuyla favorilere ekleyebilirsiniz.",
      dataset: "bestsellers", cardLabel: "5 Ürün", panelTitle: "En Çok Satanlar",
    },
  ],
};
