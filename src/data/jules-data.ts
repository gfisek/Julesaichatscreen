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
    "iPhone modelleri",
    "Mac modelleri",
    "iPad modelleri",
    "Servis randevusu",
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
        cta: "İncele",
      },
      {
        id: "ip2", type: "product",
        title: "iPhone 16 Pro",
        subtitle: "6.3\" · Doğal Titanyum",
        description: "Kamera Kontrolü, A18 Pro çip ve 4K 120fps ProRes video ile iPhone deneyimi yeniden tanımlanıyor. Kompakt formda en üst düzey performans.",
        image: "https://images.unsplash.com/photo-1588295207965-dded25c206c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$999", rating: 4.9, reviews: 18730,
        badge: "Pro", badgeColor: "#1c3d54",
        cta: "Satın Al",
      },
      {
        id: "ip3", type: "product",
        title: "iPhone 16",
        subtitle: "6.1\" · 5 Renk Seçeneği",
        description: "A18 çip, Dynamic Island ve Kamera Kontrolü ile güçlü bir başlangıç. Apple Intelligence özellikleri ve geliştirilmiş 48MP kamerayla her anı mükemmel kaydeder.",
        image: "https://images.unsplash.com/photo-1576935429546-2ea4323c7a79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$799", rating: 4.8, reviews: 23400,
        cta: "Satın Al",
      },
      {
        id: "ip4", type: "product",
        title: "iPhone 16 Plus",
        subtitle: "6.7\" · Büyük Ekran, Uzun Pil",
        description: "iPhone 16'nın tüm gücü, daha büyük bir ekranda. A18 çip ve uzun pil ömrüyle tam gün kesintisiz kullanım. Dynamic Island ve Kamera Kontrolü dahil.",
        noImage: true,
        image: "",
        price: "$899", rating: 4.7, reviews: 11200,
        badge: "Büyük Ekran", badgeColor: "#1ba3b8",
        cta: "Karşılaştır",
      },
      {
        id: "ip5", type: "product",
        title: "iPhone 15 Pro",
        subtitle: "6.1\" · Titanyum · Fırsatla",
        description: "Titanyum kasa, A17 Pro çip ve USB‑C ile iPhone'da yeni bir dönem. Action Button ve 48MP kamera sistemi, şimdi çok daha uygun fiyatla.",
        image: "https://images.unsplash.com/photo-1725625972772-9f1bc04a2608?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$699", originalPrice: "$999", rating: 4.8, reviews: 31500,
        badge: "%30 İndirim", badgeColor: "#059669",
        cta: "Fırsatı Gör",
      },
      {
        id: "ip6", type: "product",
        title: "iPhone 15",
        subtitle: "6.1\" · Dynamic Island · USB-C",
        description: "Dynamic Island ve USB-C, ilk kez standart iPhone'da. 48MP Ana kamera ve A16 Bionic çipiyle muhteşem fotoğraflar çekin. En erişilebilir modern iPhone.",
        image: "https://images.unsplash.com/photo-1588295207965-dded25c206c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$599", originalPrice: "$799", rating: 4.7, reviews: 42100,
        cta: "Fırsatı Gör",
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
        cta: "Satın Al",
      },
      {
        id: "mc2", type: "product",
        title: "MacBook Air 15\" M4",
        subtitle: "15.3\" Liquid Retina · Fanless",
        description: "Büyük ve parlak 15\" ekranda M4 gücü. Taşınabilir hissettiren fanless bir 15\" dizüstü bilgisayar isteyenler için mükemmel seçim. 18 saatlik pil ve Thunderbolt 4 bağlantısıyla.",
        image: "https://images.unsplash.com/photo-1649744998058-1e25ed7ea1d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$1,299", rating: 4.9, reviews: 13800,
        cta: "İncele",
      },
      {
        id: "mc3", type: "product",
        title: "MacBook Pro 14\" M4 Pro",
        subtitle: "Liquid Retina XDR · ProRes Video",
        description: "M4 Pro çipinin olağanüstü gücü, Liquid Retina XDR ekranın mükemmel görüntü kalitesiyle buluşuyor. Video editing, kod ve yaratıcı projeler için 24 saate varan pil ömrüyle.",
        image: "https://images.unsplash.com/photo-1621111848501-8d3634f82336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$1,999", rating: 4.9, reviews: 9600,
        badge: "Pro", badgeColor: "#1c3d54",
        cta: "Yapılandır",
      },
      {
        id: "mc4", type: "product",
        title: "MacBook Pro 16\" M4 Max",
        subtitle: "En Güçlü MacBook Pro",
        description: "M4 Max çipiyle sınırları aşan performans. 3D render, makine öğrenmesi ve 8K ProRes video düzenleme gibi en ağır görevler için. 16\" ekran, 128GB'a kadar birleşik bellek.",
        image: "https://images.unsplash.com/photo-1621111848501-8d3634f82336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$3,499", rating: 4.9, reviews: 5200,
        badge: "En Güçlü", badgeColor: "#1c3d54",
        cta: "Yapılandır",
      },
      {
        id: "mc5", type: "product",
        title: "Mac mini M4",
        subtitle: "En Küçük Mac, En Büyük Güç",
        description: "Apple'ın şimdiye kadar tasarladığı en küçük Mac mini. M4 çipiyle masaüstünde inanılmaz hız, Thunderbolt 4 ve Wi-Fi 6E bağlantısıyla ev ve ofiste eksiksiz çalışma.",
        noImage: true,
        image: "",
        price: "$599", rating: 4.8, reviews: 16700,
        cta: "Satın Al",
      },
      {
        id: "mc6", type: "product",
        title: "iMac 24\" M4",
        subtitle: "4.5K Retina · 7 Renk · Hepsi Bir Arada",
        description: "M4 çip, 4.5K Retina ekran ve zarif tek parça tasarımıyla iMac masaüstünü yeniden tanımlıyor. 7 canlı renk, altı hoparlörlü ses sistemi ve en ince iMac tasarımıyla.",
        image: "https://images.unsplash.com/photo-1716681864253-4693b3fe8e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$1,299", rating: 4.9, reviews: 12300,
        badge: "Hepsi Bir Arada", badgeColor: "#0a6e82",
        cta: "İncele",
      },
    ],

    // ── iPad Modelleri ────────────────────────────────────────────────────────
    ipads: [
      {
        id: "ip_pro11", type: "product",
        title: "iPad Pro 11\" M4",
        subtitle: "Ultra İnce · OLED · Apple Pencil Pro",
        description: "Apple'ın en ince ürünü. M4 çip, göz alıcı Ultra Retina XDR OLED ekran ve Apple Pencil Pro desteğiyle yaratıcılık ve üretkenlikte yeni bir çıta. Tandem OLED teknolojisiyle.",
        image: "https://images.unsplash.com/photo-1638273266965-843b01e02a5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$999", rating: 4.9, reviews: 14200,
        badge: "Yeni", badgeColor: "#1c3d54",
        cta: "İncele",
      },
      {
        id: "ip_pro13", type: "product",
        title: "iPad Pro 13\" M4",
        subtitle: "En Büyük Pro · OLED �� Magic Keyboard",
        description: "13\" Ultra Retina XDR OLED ekran ve M4 çipiyle masaüstü performansı artık avucunuzda. Magic Keyboard ile tam bir dizüstü deneyimi; Apple Pencil Pro ile sınırsız yaratıcılık.",
        image: "https://images.unsplash.com/photo-1638273266965-843b01e02a5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$1,299", rating: 4.9, reviews: 8700,
        badge: "En Güçlü iPad", badgeColor: "#1c3d54",
        cta: "Yapılandır",
      },
      {
        id: "ip_air11", type: "product",
        title: "iPad Air 11\" M2",
        subtitle: "Üretkenlik · Apple Pencil Pro",
        description: "M2 çip, Liquid Retina ekran ve Apple Pencil Pro desteğiyle iPad Air üretkenliği yeniden tanımlıyor. Öğrencilerden profesyonellere herkes için mükemmel denge: hız, incelik ve taşınabilirlik.",
        image: "https://images.unsplash.com/photo-1669691177924-f12fcc3cc540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$599", rating: 4.8, reviews: 22400,
        cta: "Satın Al",
      },
      {
        id: "ip_mini", type: "product",
        title: "iPad mini A17 Pro",
        subtitle: "Kompakt · Her Yere Sığar",
        description: "A17 Pro çipiyle güçlendirilen yeni iPad mini — her çantaya, her ana sığan en kişisel iPad. Apple Intelligence desteği, Apple Pencil Pro uyumluluğu ve 8.3\" parlak ekranıyla.",
        image: "https://images.unsplash.com/photo-1610664840481-10b7b43c9283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$499", rating: 4.8, reviews: 11300,
        badge: "Yeni", badgeColor: "#1ba3b8",
        cta: "Satın Al",
      },
      {
        id: "ip_10", type: "product",
        title: "iPad (10. Nesil)",
        subtitle: "Herkes için iPad · 5 Renk",
        description: "A14 Bionic çip, 10.9\" Liquid Retina ekran ve USB-C ile iPad deneyimi her zamankinden daha erişilebilir. Beş canlı renk seçeneği, tüm gün pil ömrü, geniş açılı ön kamera.",
        noImage: true,
        image: "",
        price: "$349", rating: 4.7, reviews: 38600,
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
        cta: "Satın Al",
      },
      {
        id: "acc2", type: "product",
        title: "AirPods 4",
        subtitle: "Yeni Tasarım · H2 Çip · USB-C",
        description: "Yeniden tasarlanan AirPods, H2 çip ve isteğe bağlı Aktif Gürültü Engelleme ile her kulağa uyacak şekilde özelleştirilebilir. Sesle Siri ve USB-C şarj desteği dahil.",
        noImage: true,
        image: "",
        price: "$129", rating: 4.7, reviews: 28700,
        cta: "Satın Al",
      },
      {
        id: "acc3", type: "product",
        title: "AirPods Max",
        subtitle: "Over-Ear · Premium Ses · H2 Çip",
        description: "Alüminyum kafa bandı, örgülü kulaklık kapları ve H2 çipiyle üstün ses kalitesi. Sektörün en iyi ANC ve Şeffaflık Modu. Beş renk seçeneği, USB-C şarj.",
        image: "https://images.unsplash.com/photo-1765279302883-68bc58059bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$549", rating: 4.8, reviews: 17900,
        badge: "Premium", badgeColor: "#1c3d54",
        cta: "İncele",
      },
      {
        id: "acc4", type: "product",
        title: "Apple Watch Series 10",
        subtitle: "En İnce Apple Watch · Uyku Apnesi",
        description: "Apple'ın en ince ve en hafif akıllı saati. Uyku apnesi tespiti, çarpınma ölçümü ve hızlı şarj özelliğiyle sağlık ve zindeliğinizi her gün eksiksiz takip edin.",
        image: "https://images.unsplash.com/photo-1772683709326-134a6a4635d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$399", rating: 4.8, reviews: 31200,
        badge: "Yeni", badgeColor: "#1ba3b8",
        cta: "Satın Al",
      },
      {
        id: "acc5", type: "product",
        title: "Apple Watch Ultra 2",
        subtitle: "Titanyum · 60 Saat · 100m Su",
        description: "En zorlu koşullar için tasarlanan nihai Apple Watch. Titanyum kasa, 2000 nit parlaklık ve 60 saatlik pil ömrüyle derin su dalışından ultra maratona her maceraya hazır.",
        image: "https://images.unsplash.com/photo-1759489036027-44eac680741a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        price: "$799", rating: 4.9, reviews: 14600,
        badge: "Spor & Macera", badgeColor: "#1c3d54",
        cta: "İncele",
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
        cta: "Satın Al",
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
        cta: "Satın Al",
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
        cta: "Satın Al",
      },
    ],

    // ── Servis & Destek ───────────────────────────────────────────────────────
    service: [
      {
        id: "srv1", type: "product",
        title: "Genius Bar Randevusu",
        subtitle: "Apple Store'da Birebir Destek",
        description: "Apple uzmanlarıyla yüz yüze görüşün. Cihazınızı getirin, uzman bir Genius sizi dinlesin ve çözümü birlikte bulun. Randevunuzu ücretsiz alabilirsiniz.",
        image: "https://images.unsplash.com/photo-1759392790299-a8874cabc000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        badge: "Ücretsiz", badgeColor: "#059669",
        cta: "Randevu Al",
      },
      {
        id: "srv2", type: "product",
        title: "AppleCare+ ile Koru",
        subtitle: "Kaza & Hasar Güvencesi",
        description: "Beklenmedik hasarlara karşı tam güvence. Ekran çatlaması, sıvı hasarı ve pil sorunları AppleCare+ kapsamında hızla çözülür. Yerinde servis seçeneğiyle cihazınız elinizden çıkmaz.",
        noImage: true,
        image: "",
        badge: "Önerilir", badgeColor: "#1c3d54",
        cta: "Bilgi Al",
      },
      {
        id: "srv3", type: "product",
        title: "Ekran & Pil Tamiri",
        subtitle: "Aynı Gün Servis · Orijinal Parça",
        description: "Kırık ekran veya şarj tutmayan pil mi? Apple yetkili teknisyenler, orijinal Apple parçalarıyla aynı gün tamir seçeneği sunar. Online fiyat hesaplama ile sürpriz yoktur.",
        noImage: true,
        image: "",
        cta: "Fiyat Al",
      },
      {
        id: "srv4", type: "product",
        title: "Yetkili Servis Noktası Bul",
        subtitle: "Size En Yakın Apple Yetkili Servis",
        description: "Türkiye genelinde 200'den fazla Apple Yetkili Servis Sağlayıcısı mevcuttur. Konumunuza en yakın noktayı bulun, çalışma saatlerini kontrol edin ve cihazınızı kolayca bırakın.",
        noImage: true,
        image: "",
        cta: "Servis Bul",
      },
      {
        id: "srv5", type: "product",
        title: "Garanti & Servis Durumu",
        subtitle: "Cihazınızın Durumunu Sorgulayın",
        description: "Cihazınızın garanti kapsamını, AppleCare+ geçerlilik tarihini ve açık servis taleplerini anında öğrenin. Seri numaranızla sorgulama 30 saniyeden az sürer.",
        noImage: true,
        image: "",
        badge: "7/24", badgeColor: "#0a6e82",
        cta: "Sorgula",
      },
    ],
  },

  scenarios: [
    {
      keywords: ["iphone", "telefon", "ios", "16 serisi", "15 serisi", "iphone modelleri"],
      reply: "iPhone ailesi için en kapsamlı karşılaştırmayı hazırladım! A18 Pro'dan kamera sistemine, Titanyum tasarımdan pil ömrüne kadar tüm modeller sağ panelde sizi bekliyor. Hangi iPhone'un size göre olduğunu birlikte bulalım.",
      dataset: "iphones", cardLabel: "6 iPhone", panelTitle: "iPhone Modelleri",
    },
    {
      keywords: ["mac", "macbook", "imac", "mac mini", "macos", "laptop", "mac modelleri"],
      reply: "Mac ailesinin tüm yıldızlarını sizin için listeledim! M4 çipli yeni modeller inanılmaz bir performans sunuyor. MacBook Air'den iMac'e, kullanım amacınıza en uygun modeli birlikte seçelim.",
      dataset: "macs", cardLabel: "6 Mac", panelTitle: "Mac Modelleri",
    },
    {
      keywords: ["ipad", "tablet", "ipad modelleri", "ipad pro", "ipad air", "ipad mini"],
      reply: "iPad ailesi için güncel modellerin tamamını listeledim! Ultra ince iPad Pro'dan her bütçeye uygun iPad'e, hangisinin size göre olduğunu birlikte keşfedelim. Apple Pencil Pro veya Magic Keyboard ile hangisini eşleştirirsiniz?",
      dataset: "ipads", cardLabel: "5 iPad", panelTitle: "iPad Modelleri",
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
    {
      keywords: ["servis", "randevu", "tamir", "genius bar", "applecare", "garanti", "servis randevusu", "destek", "ekran", "pil tamiri"],
      reply: "Servis ve destek konusunda size yardımcı olmaktan memnuniyet duyarım. Genius Bar randevusundan AppleCare+ bilgisine, tamir fiyatlarından yetkili servis noktasına — ihtiyacınıza uygun seçenek sağ panelde hazır.",
      dataset: "service", cardLabel: "5 Seçenek", panelTitle: "Servis & Destek",
    },
  ],
};