import { useState } from "react";
import {
  ArrowLeft, ShoppingCart, Heart, Star, Lightning,
  Truck, ShieldCheck, ArrowsClockwise, Package,
  ChatCircleDots, Check, Plus, Minus,
} from "@phosphor-icons/react";

interface ProductPageProps {
  onBack: () => void;
  onOpenJules: () => void;
}

const PRODUCT = {
  id: "sony-wh1000xm5",
  name: "Sony WH-1000XM5",
  brand: "Sony",
  category: "Kablosuz Kulaklık",
  price: 8999,
  originalPrice: 11999,
  rating: 4.8,
  reviews: 7230,
  badge: "En Çok Satan",
  stock: 12,
  sku: "WH1000XM5/BCE",
  images: [
    "https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTb255JTIwd2lyZWxlc3MlMjBoZWFkcGhvbmVzJTIwbm9pc2UlMjBjYW5jZWxsaW5nfGVufDF8fHx8MTc3MTYzNzQzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  ],
  colors: [
    { name: "Siyah", hex: "#1a1a1a", available: true },
    { name: "Gümüş", hex: "#c8c8c8", available: true },
    { name: "Orman Yeşili", hex: "#2d4a35", available: false },
  ],
  tags: ["Aktif Gürültü Engelleme", "Bluetooth 5.2", "30 Saat Pil", "LDAC", "Katlanabilir"],
  description: `Sony WH-1000XM5, endüstrinin en güçlü gürültü engelleme teknolojisiyle donatılmış amiral gemisi kulaklığıdır. 8 adet mikrofon ve yeni HD Gürültü Engelleme İşlemcisi QN1 ile birlikte çalışarak çevresel sesleri mükemmel şekilde bastırır.

Ultra hafif tasarımı ve esnek bantı sayesinde uzun saatler boyunca konforlu kullanım sunar. 30 mm sürücüler ile geniş frekans aralığında kristal netliğinde ses deneyimi yaşarsınız.`,
  highlights: [
    "8 mikrofon ile endüstri lideri ANC",
    "30 saate kadar pil ömrü (ANC ile)",
    "3 dakika şarj ile 3 saat kullanım",
    "Multipoint Bluetooth ile 2 cihaza aynı anda bağlantı",
    "Çağrı kalitesi için 4 mikrofon",
    "DSEE Extreme ile AI ses iyileştirme",
  ],
  specs: [
    { label: "Sürücü Birimi", value: "30 mm, dome tipi" },
    { label: "Frekans Aralığı", value: "4 Hz – 40 kHz" },
    { label: "Empedans", value: "48 Ohm (1 kHz)" },
    { label: "Hassasiyet", value: "102 dB/mW" },
    { label: "Bluetooth Sürümü", value: "5.2" },
    { label: "Desteklenen Codec", value: "SBC, AAC, LDAC" },
    { label: "Menzil", value: "10 m" },
    { label: "Pil Ömrü (ANC açık)", value: "30 saat" },
    { label: "Pil Ömrü (ANC kapalı)", value: "40 saat" },
    { label: "Şarj Süresi", value: "3.5 saat (USB-C)" },
    { label: "Ağırlık", value: "250 g" },
    { label: "Renk Seçenekleri", value: "Siyah, Gümüş, Orman Yeşili" },
  ],
  reviews_data: [
    { name: "Ahmet Y.", rating: 5, date: "15 Şubat 2026", comment: "Aldığım en iyi kulaklık. ANC modu gerçekten büyüleyici, metro gürültüsünü tamamen kapatıyor. Pil ömrü de söz verdiği gibi.", verified: true },
    { name: "Selin K.", rating: 5, date: "8 Şubat 2026", comment: "Uzun iş seyahatlerinde vazgeçilmezim oldu. Uçak gürültüsünde bile müziği rahatça dinleyebiliyorum. Ses kalitesi mükemmel.", verified: true },
    { name: "Murat T.", rating: 4, date: "2 Şubat 2026", comment: "Ses kalitesi ve ANC açısından çok başarılı. Sadece kablo olmadan müzik dinlenemediğini söyleyeyim. Yine de kesinlikle tavsiye ederim.", verified: false },
    { name: "Deniz A.", rating: 5, date: "28 Ocak 2026", comment: "Multipoint Bluetooth özelliği inanılmaz pratik. Hem laptopa hem telefona aynı anda bağlı, geçişler otomatik oluyor.", verified: true },
  ],
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          weight={i <= Math.floor(rating) ? "fill" : i - 0.5 <= rating ? "duotone" : "regular"}
          style={{ color: "#f59e0b" }}
        />
      ))}
    </div>
  );
}

export function ProductPage({ onBack, onOpenJules }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const discount = Math.round((1 - PRODUCT.price / PRODUCT.originalPrice) * 100);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100%" }}>

      {/* ─── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{ color: "#0a6e82", background: "#e6f7f9", border: "1px solid #b2e4ea", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <ArrowLeft size={14} weight="bold" />
            Geri
          </button>
          <div className="flex items-center gap-1.5" style={{ fontSize: 12, color: "#9ca3af" }}>
            <span>Ana Sayfa</span>
            <span>/</span>
            <span>Kulaklık</span>
            <span>/</span>
            <span style={{ color: "#1c3d54", fontWeight: 600 }}>{PRODUCT.name}</span>
          </div>
        </div>
      </div>

      {/* ─── Main Product Section ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left — Images */}
          <div className="flex flex-col gap-3 lg:w-[480px] shrink-0">
            {/* Main image */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ background: "#fff", border: "1.5px solid #e5e7eb", aspectRatio: "1/1" }}
            >
              <img
                src={PRODUCT.images[selectedImage]}
                alt={PRODUCT.name}
                className="w-full h-full object-cover"
              />
              {/* Badge */}
              <div
                className="absolute top-4 left-4 px-3 py-1 rounded-lg text-white"
                style={{ background: "#0a6e82", fontSize: 11, fontWeight: 700 }}
              >
                {PRODUCT.badge}
              </div>
              {/* Discount badge */}
              <div
                className="absolute top-4 right-4 px-2.5 py-1 rounded-lg"
                style={{ background: "#059669", color: "#fff", fontSize: 12, fontWeight: 800 }}
              >
                %{discount}
              </div>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2">
              {PRODUCT.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{
                    width: 72, height: 72, flexShrink: 0,
                    border: selectedImage === i ? "2px solid #1ba3b8" : "2px solid #e5e7eb",
                    background: "#fff",
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Details */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Brand + SKU */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0a6e82", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {PRODUCT.brand}
              </span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>SKU: {PRODUCT.sku}</span>
            </div>

            {/* Name */}
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1c3d54", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              {PRODUCT.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 flex-wrap">
              <StarRating rating={PRODUCT.rating} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1c3d54" }}>{PRODUCT.rating}</span>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{PRODUCT.reviews.toLocaleString()} değerlendirme</span>
              <span style={{ fontSize: 11, color: "#059669", fontWeight: 600, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "2px 8px" }}>
                Stokta {PRODUCT.stock} adet
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span style={{ fontSize: 34, fontWeight: 900, color: "#1c3d54", letterSpacing: "-0.03em" }}>
                ₺{PRODUCT.price.toLocaleString()}
              </span>
              <div className="flex flex-col items-start mb-1">
                <span style={{ fontSize: 14, color: "#9ca3af", textDecoration: "line-through" }}>
                  ₺{PRODUCT.originalPrice.toLocaleString()}
                </span>
                <span style={{ fontSize: 12, color: "#059669", fontWeight: 700 }}>
                  ₺{(PRODUCT.originalPrice - PRODUCT.price).toLocaleString()} tasarruf
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {PRODUCT.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg" style={{ fontSize: 11, fontWeight: 600, background: "#e6f7f9", color: "#0a6e82", border: "1px solid #b2e4ea" }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #e5e7eb" }} />

            {/* Color picker */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                Renk: <span style={{ color: "#1c3d54" }}>{PRODUCT.colors[selectedColor].name}</span>
              </p>
              <div className="flex gap-2.5">
                {PRODUCT.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => color.available && setSelectedColor(i)}
                    title={color.name}
                    className="relative rounded-full transition-all"
                    style={{
                      width: 32, height: 32,
                      background: color.hex,
                      border: selectedColor === i ? "3px solid #1ba3b8" : "2px solid #e5e7eb",
                      boxShadow: selectedColor === i ? "0 0 0 2px #fff, 0 0 0 4px #1ba3b8" : "none",
                      opacity: color.available ? 1 : 0.35,
                      cursor: color.available ? "pointer" : "not-allowed",
                    }}
                  >
                    {!color.available && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.5)" }}>
                        <div style={{ width: 20, height: 1.5, background: "#9ca3af", transform: "rotate(-45deg)" }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Qty */}
              <div
                className="flex items-center gap-0 rounded-xl overflow-hidden"
                style={{ border: "1.5px solid #e5e7eb", background: "#fff" }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex items-center justify-center transition-colors"
                  style={{ width: 40, height: 44, color: "#374151", background: "transparent" }}
                >
                  <Minus size={14} weight="bold" />
                </button>
                <div
                  className="flex items-center justify-center"
                  style={{ width: 44, height: 44, fontSize: 15, fontWeight: 700, color: "#1c3d54", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}
                >
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(Math.min(PRODUCT.stock, quantity + 1))}
                  className="flex items-center justify-center transition-colors"
                  style={{ width: 40, height: 44, color: "#374151", background: "transparent" }}
                >
                  <Plus size={14} weight="bold" />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all flex-1"
                style={{
                  background: addedToCart ? "#059669" : "linear-gradient(135deg, #1ba3b8, #0a6e82)",
                  color: "#fff", fontWeight: 700, fontSize: 14,
                  boxShadow: "0 4px 16px rgba(10,110,130,0.3)",
                  minWidth: 180,
                  justifyContent: "center",
                }}
              >
                {addedToCart ? <Check size={16} weight="bold" /> : <ShoppingCart size={16} weight="fill" />}
                {addedToCart ? "Sepete Eklendi!" : "Sepete Ekle"}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted(v => !v)}
                className="flex items-center justify-center rounded-xl transition-all"
                style={{
                  width: 48, height: 48,
                  background: wishlisted ? "#fff5f5" : "#fff",
                  border: wishlisted ? "1.5px solid #fca5a5" : "1.5px solid #e5e7eb",
                  color: wishlisted ? "#f87171" : "#9ca3af",
                }}
              >
                <Heart size={20} weight={wishlisted ? "fill" : "regular"} />
              </button>
            </div>

            {/* Jules AI CTA */}
            <button
              onClick={onOpenJules}
              className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all"
              style={{ background: "#f0f9fa", border: "1.5px solid #b2e4ea", color: "#0a6e82", width: "100%" }}
            >
              <ChatCircleDots size={18} weight="fill" style={{ color: "#1ba3b8" }} />
              <div className="text-left">
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1c3d54" }}>Jules AI'ya Sor</p>
                <p style={{ fontSize: 11, color: "#6b7280" }}>Bu ürün hakkında soru sorun veya alternatif öneri alın</p>
              </div>
            </button>

            {/* Delivery info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, text: "Ücretsiz Kargo", sub: "Bugün kargoya verilir" },
                { icon: ShieldCheck, text: "2 Yıl Garanti", sub: "Resmi Sony Türkiye" },
                { icon: ArrowsClockwise, text: "30 Gün İade", sub: "Koşulsuz iade hakkı" },
                { icon: Package, text: "Orijinal Ürün", sub: "VOLT garantisi" },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex items-center gap-2.5 p-3 rounded-xl" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
                  <div className="flex items-center justify-center rounded-lg p-1.5" style={{ background: "#e6f7f9" }}>
                    <Icon size={16} weight="fill" style={{ color: "#0a6e82" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#1c3d54" }}>{text}</p>
                    <p style={{ fontSize: 10, color: "#9ca3af" }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="mt-12">
          {/* Tab nav */}
          <div className="flex gap-0 border-b" style={{ borderColor: "#e5e7eb" }}>
            {([
              { key: "description", label: "Ürün Açıklaması" },
              { key: "specs", label: "Teknik Özellikler" },
              { key: "reviews", label: `Yorumlar (${PRODUCT.reviews_data.length})` },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="px-5 py-3 transition-all"
                style={{
                  fontSize: 13, fontWeight: 600,
                  color: activeTab === key ? "#1ba3b8" : "#6b7280",
                  borderBottom: activeTab === key ? "2.5px solid #1ba3b8" : "2.5px solid transparent",
                  marginBottom: -1,
                  background: "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mt-6 bg-white rounded-2xl p-6 md:p-8" style={{ border: "1px solid #e5e7eb" }}>
            {activeTab === "description" && (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1c3d54", marginBottom: 12 }}>Ürün Hakkında</h3>
                  {PRODUCT.description.split("\n\n").map((para, i) => (
                    <p key={i} style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>{para}</p>
                  ))}
                </div>
                <div style={{ minWidth: 260 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1c3d54", marginBottom: 12 }}>Öne Çıkan Özellikler</h3>
                  <div className="flex flex-col gap-2.5">
                    {PRODUCT.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-2.5">
                        <div className="flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ width: 18, height: 18, background: "#e6f7f9" }}>
                          <Check size={10} weight="bold" style={{ color: "#0a6e82" }} />
                        </div>
                        <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1c3d54", marginBottom: 16 }}>Teknik Özellikler</h3>
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
                  {PRODUCT.specs.map((spec, i) => (
                    <div
                      key={spec.label}
                      className="flex"
                      style={{ borderBottom: i < PRODUCT.specs.length - 1 ? "1px solid #f3f4f6" : "none" }}
                    >
                      <div className="px-5 py-3.5 shrink-0" style={{ width: 200, background: "#f8f9fa", fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
                        {spec.label}
                      </div>
                      <div className="px-5 py-3.5 flex-1" style={{ background: "#fff", fontSize: 13, color: "#1c3d54", fontWeight: 500 }}>
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {/* Rating summary */}
                <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8" style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                    <span style={{ fontSize: 56, fontWeight: 900, color: "#1c3d54", lineHeight: 1 }}>{PRODUCT.rating}</span>
                    <StarRating rating={PRODUCT.rating} size={18} />
                    <span style={{ fontSize: 13, color: "#6b7280" }}>{PRODUCT.reviews.toLocaleString()} değerlendirme</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : star === 2 ? 1 : 1;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span style={{ fontSize: 12, color: "#6b7280", width: 8, textAlign: "right" }}>{star}</span>
                          <Star size={12} weight="fill" style={{ color: "#f59e0b", flexShrink: 0 }} />
                          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: "#f3f4f6" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #1ba3b8, #4dc4ce)", borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 12, color: "#9ca3af", width: 28 }}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review cards */}
                <div className="flex flex-col gap-5">
                  {PRODUCT.reviews_data.map((review, i) => (
                    <div key={i} className="p-5 rounded-xl" style={{ background: "#f8f9fa", border: "1px solid #e5e7eb" }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1ba3b8, #0a6e82)", color: "#fff", fontSize: 14, fontWeight: 700 }}>
                            {review.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#1c3d54" }}>{review.name}</span>
                              {review.verified && (
                                <span style={{ fontSize: 10, fontWeight: 600, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "1px 6px" }}>
                                  Doğrulanmış Alışveriş
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <StarRating rating={review.rating} size={11} />
                              <span style={{ fontSize: 11, color: "#9ca3af" }}>{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Jules Upsell Banner ──────────────────────────────────────────── */}
        <div
          className="mt-8 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: "linear-gradient(135deg, #1c3d54, #0a6e82)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lightning size={14} weight="fill" style={{ color: "#4dc4ce" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#4dc4ce", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Jules AI Asistan
              </span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Bu ürünle ilgili sorunuz mu var?</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>Karşılaştırma, öneri veya teknik detaylar için Jules'a sorun.</p>
          </div>
          <button
            onClick={onOpenJules}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl shrink-0 transition-all"
            style={{ background: "linear-gradient(135deg, #1ba3b8, #4dc4ce)", color: "#fff", fontWeight: 700, fontSize: 13 }}
          >
            <ChatCircleDots size={16} weight="fill" />
            Jules'a Sor
          </button>
        </div>
      </div>
    </div>
  );
}