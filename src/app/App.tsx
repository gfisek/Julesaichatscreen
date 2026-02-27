import { useState, useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import { JulesWidget } from "./components/JulesWidget";
import { ProductPage } from "./components/ProductPage";
import {
  MagnifyingGlass,
  ShoppingCart,
  ChatCircleDots,
  List,
  X,
  Lightning,
  Truck,
  ShieldCheck,
  ArrowRight,
  Star,
  Tag,
  Phone,
  Laptop,
  Headphones,
  Watch,
  Television,
  Heart,
  DeviceMobile,
} from "@phosphor-icons/react";

const HEADER_HEIGHT = 64;

// ─── Product Data ────────────────────────────────────────────────────────────
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "MacBook Air M3",
    brand: "Apple",
    price: "₺54.999",
    oldPrice: "₺62.999",
    rating: 4.9,
    reviews: 9870,
    badge: "Yeni",
    badgeColor: "#1ba3b8",
    image: "https://images.unsplash.com/photo-1660145177383-e6e2c22adb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjB3b3Jrc3BhY2UlMjBwcm9kdWN0aXZpdHl8ZW58MXx8fHwxNzcxNTk2NzEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: "₺8.999",
    oldPrice: "₺11.999",
    rating: 4.8,
    reviews: 7230,
    badge: "En Çok Satan",
    badgeColor: "#0a6e82",
    image: "https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTb255JTIwd2lyZWxlc3MlMjBoZWFkcGhvbmVzJTIwbm9pc2UlMjBjYW5jZWxsaW5nfGVufDF8fHx8MTc3MTYzNzQzMHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    price: "₺34.999",
    oldPrice: null,
    rating: 4.8,
    reviews: 4210,
    badge: "Premium",
    badgeColor: "#1c3d54",
    image: "https://images.unsplash.com/photo-1716234479503-c460b87bdf98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNoJTIwd2VhcmFibGUlMjB0ZWNoJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzE2MzU0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    name: "Nike Air Max 270",
    brand: "Nike",
    price: "₺3.499",
    oldPrice: "₺4.999",
    rating: 4.7,
    reviews: 5420,
    badge: "%30 İndirim",
    badgeColor: "#059669",
    image: "https://images.unsplash.com/photo-1570348272490-7d6d5fddf335?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBwcm9kdWN0JTIwc2hvZXMlMjBzbmVha2Vyc3xlbnwxfHx8fDE3NzE1OTY3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const CATEGORIES = [
  { icon: Laptop, label: "Laptop", count: "240+ ürün", color: "#1c3d54" },
  { icon: Phone, label: "Telefon", count: "180+ ürün", color: "#0a6e82" },
  { icon: Headphones, label: "Kulaklık", count: "95+ ürün", color: "#1ba3b8" },
  { icon: Watch, label: "Akıllı Saat", count: "60+ ürün", color: "#4dc4ce" },
  { icon: Television, label: "TV & Ekran", count: "110+ ürün", color: "#1c3d54" },
  { icon: Tag, label: "Kampanyalar", count: "Fırsatlar", color: "#0a6e82" },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          weight={i <= Math.round(rating) ? "fill" : "regular"}
          size={12}
          style={{ color: i <= Math.round(rating) ? "#f59e0b" : "#d1d5db" }}
        />
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [julesButtonHovered, setJulesButtonHovered] = useState(false);
  const [julesMobileHovered, setJulesMobileHovered] = useState(false);
  const [julesIsDark, setJulesIsDark] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "product">("home");
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(5);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when widget opens
  useEffect(() => {
    if (isWidgetOpen) setMobileMenuOpen(false);
    else setJulesButtonHovered(false);
  }, [isWidgetOpen]);

  useEffect(() => {
    if (isDrawerOpen) setMobileMenuOpen(false);
    else setJulesMobileHovered(false);
  }, [isDrawerOpen]);

  const handleProductClick = (productId: string) => {
    setIsWidgetOpen(false);
    setCurrentPage("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
  };

  const navLinks = ["Ana Sayfa", "Ürünler", "Kampanyalar", "Markalar", "Blog"];

  return (
    <div className="min-h-screen" style={{ background: "#f8f9fa" }}>

      {/* ─── HEADER ─────────────────────────────────────────────────────────── */}
      <header
        ref={headerRef}
        className="sticky top-0 z-30 flex items-center w-full"
        style={{
          height: HEADER_HEIGHT,
          background: "#1c3d54",
          boxShadow: "0 2px 16px rgba(28,61,84,0.18)",
        }}
      >
        <div className="flex items-center w-full px-4 md:px-8 gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0 select-none">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 34, height: 34, background: "linear-gradient(135deg, #1ba3b8, #4dc4ce)" }}
            >
              <Lightning weight="fill" size={18} style={{ color: "#fff" }} />
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>
              VOLT
            </span>
            <span style={{ color: "#4dc4ce", fontWeight: 400, fontSize: 13, marginLeft: -2 }}>market</span>
          </a>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Search bar — desktop */}
          <div
            className="hidden md:flex items-center flex-1 max-w-sm ml-4 rounded-xl overflow-hidden transition-all"
            style={{
              background: searchFocused ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)",
              border: searchFocused ? "1.5px solid #4dc4ce" : "1.5px solid transparent",
              transition: "all 0.2s",
            }}
          >
            <MagnifyingGlass size={16} style={{ color: "rgba(255,255,255,0.5)", marginLeft: 12 }} />
            <input
              placeholder="Ürün, marka veya kategori ara..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "#fff", fontSize: 13, padding: "8px 12px", flex: 1,
              }}
            />
          </div>

          <div className="flex-1" />

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Mobile search */}
            <button
              className="md:hidden flex items-center justify-center rounded-xl p-2 transition-colors"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              <MagnifyingGlass size={20} />
            </button>

            {/* Wishlist */}
            <button
              className="relative hidden md:flex items-center justify-center rounded-xl p-2 transition-colors"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex items-center justify-center rounded-full text-white"
                  style={{ width: 16, height: 16, fontSize: 9, fontWeight: 700, background: "#1ba3b8" }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              className="relative flex items-center justify-center rounded-xl p-2 transition-colors"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex items-center justify-center rounded-full text-white"
                  style={{ width: 16, height: 16, fontSize: 9, fontWeight: 700, background: "#e53e3e" }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Jules Mobile Button — desktop only */}
            <button
              onClick={() => setIsDrawerOpen(v => !v)}
              className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 ml-1 transition-all"
              style={{
                background: (isDrawerOpen || julesMobileHovered) ? "linear-gradient(135deg, #1ba3b8, #4dc4ce)" : "rgba(255,255,255,0.12)",
                border: (isDrawerOpen || julesMobileHovered) ? "1.5px solid transparent" : "1.5px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                transition: "all 0.25s",
              }}
              onMouseEnter={() => setJulesMobileHovered(true)}
              onMouseLeave={() => setJulesMobileHovered(false)}
            >
              <DeviceMobile size={16} weight="fill" />
              <span>Jules Sidepane</span>
            </button>

            {/* Jules Chat Button */}
            <style>{`
              @property --jules-orbit-angle {
                syntax: '<angle>';
                initial-value: 0deg;
                inherits: false;
              }
              @keyframes jules-orbit-spin {
                from { --jules-orbit-angle: 0deg; }
                to   { --jules-orbit-angle: 360deg; }
              }
              .jules-btn-orbit-light {
                background: conic-gradient(
                  from var(--jules-orbit-angle) at 50% 50%,
                  rgba(28,61,84,0.25) 0deg,
                  rgba(28,61,84,0.25) 255deg,
                  rgba(27,163,184,0.60) 274deg,
                  rgba(77,196,206,0.95) 293deg,
                  rgba(27,163,184,0.60) 312deg,
                  rgba(28,61,84,0.25) 331deg,
                  rgba(28,61,84,0.25) 360deg
                );
                animation: jules-orbit-spin 5s linear infinite;
              }
              .jules-btn-orbit-dark {
                background: conic-gradient(
                  from var(--jules-orbit-angle) at 50% 50%,
                  rgba(10,18,26,0.55) 0deg,
                  rgba(10,18,26,0.55) 255deg,
                  rgba(27,163,184,0.45) 274deg,
                  rgba(77,196,206,0.75) 293deg,
                  rgba(27,163,184,0.45) 312deg,
                  rgba(10,18,26,0.55) 331deg,
                  rgba(10,18,26,0.55) 360deg
                );
                animation: jules-orbit-spin 5s linear infinite;
              }
            `}</style>
            <div
              style={{
                position: "relative",
                padding: "1.5px",
                borderRadius: "13px",
                overflow: "hidden",
                marginLeft: "4px",
                flexShrink: 0,
              }}
            >
              <div
                className={julesIsDark ? "jules-btn-orbit-dark" : "jules-btn-orbit-light"}
                style={{ position: "absolute", inset: 0, zIndex: 0 }}
              />
              <button
                onClick={() => setIsWidgetOpen(v => !v)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
                style={{
                  position: "relative",
                  zIndex: 1,
                  background: (isWidgetOpen || julesButtonHovered) ? "linear-gradient(135deg, #1ba3b8, #4dc4ce)" : "#375469",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  transition: "all 0.25s",
                }}
                onMouseEnter={() => setJulesButtonHovered(true)}
                onMouseLeave={() => setJulesButtonHovered(false)}
              >
                {/* Jules logo avatar */}
                <div
                  style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    background: "#0a6e82",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 0 1.5px rgba(77,196,206,0.5)",
                  }}
                >
                  <Bot size={12} style={{ color: "#fff" }} />
                </div>
                <span className="hidden sm:inline">Jules AI</span>
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex items-center justify-center rounded-xl p-2 ml-1 transition-colors"
              style={{ color: "rgba(255,255,255,0.8)" }}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav menu */}
        {mobileMenuOpen && (
          <div
            className="absolute left-0 right-0 flex flex-col px-4 pb-4 pt-2 gap-1 md:hidden"
            style={{
              top: HEADER_HEIGHT, zIndex: 35,
              background: "#1c3d54",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            {navLinks.map((link) => (
              <a key={link} href="#"
                className="px-3 py-2.5 rounded-xl text-sm"
                style={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                {link}
              </a>
            ))}
            <div className="h-px my-1" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div
              className="flex items-center rounded-xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.15)" }}
            >
              <MagnifyingGlass size={16} style={{ color: "rgba(255,255,255,0.5)", marginLeft: 12 }} />
              <input
                placeholder="Ürün ara..."
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: "#fff", fontSize: 13, padding: "8px 12px", flex: 1,
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* ─── PAGE CONTENT ───────────────────────────────────────────────────── */}
      <main>

        {currentPage === "product" && (
          <ProductPage
            onBack={handleBackToHome}
            onOpenJules={() => setIsWidgetOpen(true)}
          />
        )}

        {currentPage === "home" && (<>

        {/* Hero Section */}
        <section
          className="relative flex items-center overflow-hidden"
          style={{
            minHeight: isMobile ? 320 : 440,
            background: "linear-gradient(135deg, #1c3d54 0%, #0a6e82 55%, #1ba3b8 100%)",
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, #4dc4ce 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 40%)",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center w-full max-w-6xl mx-auto px-6 md:px-12 py-12 gap-8">
            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-5"
                style={{ background: "rgba(255,255,255,0.15)", color: "#e6f7f9", fontWeight: 600, letterSpacing: "0.05em" }}
              >
                <Lightning weight="fill" size={12} />
                KAMPANYA — 12 AY 0 FAİZ
              </div>
              <h1 style={{ color: "#fff", fontWeight: 800, fontSize: isMobile ? 28 : 44, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                Teknolojinin<br />
                <span style={{ color: "#4dc4ce" }}>En İyileri</span><br />
                Burada
              </h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginTop: 14, maxWidth: 400 }}>
                Binlerce ürün, özel fiyatlar ve ücretsiz kargo. Jules AI asistanınız her zaman yanınızda.
              </p>
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 mt-7">
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all"
                  style={{
                    background: "linear-gradient(135deg, #1ba3b8, #4dc4ce)",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    boxShadow: "0 4px 20px rgba(77,196,206,0.4)",
                  }}
                >
                  Alışverişe Başla
                  <ArrowRight size={16} weight="bold" />
                </button>
                <button
                  onClick={() => setIsWidgetOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all"
                  style={{
                    background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)",
                    color: "#fff", fontWeight: 600, fontSize: 14,
                  }}
                >
                  <ChatCircleDots size={16} weight="fill" />
                  Jules'a Sor
                </button>
              </div>
            </div>

            {/* Hero image */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  width: isMobile ? 260 : 380,
                  height: isMobile ? 180 : 260,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1759297044036-19a0256fade2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzbWFydHBob25lJTIwbW9kZXJuJTIwd29ya3NwYWNlJTIwZmxhdCUyMGxheXxlbnwxfHx8fDE3NzE5Mzc0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Tech products"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(28,61,84,0.3), transparent)" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Features strip */}
        <section style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div className="flex flex-wrap justify-center md:justify-between items-center max-w-6xl mx-auto px-6 py-4 gap-4">
            {[
              { icon: Truck, text: "Ücretsiz Kargo", sub: "500₺ üzeri siparişlerde" },
              { icon: ShieldCheck, text: "2 Yıl Garanti", sub: "Tüm ürünlerde" },
              { icon: Lightning, text: "Hızlı Teslimat", sub: "Aynı gün kargo" },
              { icon: Tag, text: "En İyi Fiyat", sub: "Fiyat garantisi" },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-lg p-2"
                  style={{ background: "#e6f7f9" }}>
                  <Icon size={18} style={{ color: "#0a6e82" }} weight="fill" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1c3d54" }}>{text}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ color: "#1c3d54", fontWeight: 800, fontSize: 22 }}>Kategoriler</h2>
            <a href="#" className="flex items-center gap-1 text-sm" style={{ color: "#1ba3b8", fontWeight: 600 }}>
              Tümünü Gör <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map(({ icon: Icon, label, count, color }) => (
              <a
                key={label}
                href="#"
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all cursor-pointer group"
                style={{ background: "#fff", border: "1.5px solid #e5e7eb", textDecoration: "none" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1ba3b8";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 20px rgba(27,163,184,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl p-3"
                  style={{ background: "#e6f7f9" }}
                >
                  <Icon size={24} style={{ color }} weight="fill" />
                </div>
                <div className="text-center">
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1c3d54" }}>{label}</div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>{count}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 pb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ color: "#1c3d54", fontWeight: 800, fontSize: 22 }}>Öne Çıkan Ürünler</h2>
            <a href="#" className="flex items-center gap-1 text-sm" style={{ color: "#1ba3b8", fontWeight: 600 }}>
              Tümünü Gör <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURED_PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl overflow-hidden transition-all cursor-pointer"
                style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(28,61,84,0.12)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#1ba3b8";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: 160, background: "#f3f4f6" }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  {p.badge && (
                    <span
                      className="absolute top-2 left-2 text-white rounded-lg px-2 py-0.5"
                      style={{ fontSize: 10, fontWeight: 700, background: p.badgeColor }}
                    >
                      {p.badge}
                    </span>
                  )}
                  <button className="absolute top-2 right-2 flex items-center justify-center rounded-full p-1.5"
                    style={{ background: "rgba(255,255,255,0.9)" }}>
                    <Heart size={13} style={{ color: "#9ca3af" }} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{p.brand}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1c3d54", marginTop: 2, lineHeight: 1.3 }}>{p.name}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <StarRating rating={p.rating} />
                    <span style={{ fontSize: 10, color: "#6b7280" }}>({p.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#1c3d54" }}>{p.price}</div>
                      {p.oldPrice && (
                        <div style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through" }}>{p.oldPrice}</div>
                      )}
                    </div>
                    <button
                      className="flex items-center justify-center rounded-xl p-2 transition-all"
                      style={{ background: "linear-gradient(135deg, #1ba3b8, #4dc4ce)" }}
                    >
                      <ShoppingCart size={14} style={{ color: "#fff" }} weight="fill" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Jules AI Banner */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 pb-12">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl p-8 md:p-10"
            style={{ background: "linear-gradient(135deg, #1c3d54, #0a6e82)" }}
          >
            <div className="text-center md:text-left">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-3"
                style={{ background: "rgba(77,196,206,0.2)", color: "#4dc4ce", fontWeight: 600 }}
              >
                <Lightning weight="fill" size={11} />
                AI DESTEKLI ALIŞVERİŞ
              </div>
              <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 24, lineHeight: 1.2 }}>
                Jules AI ile<br />Doğru Ürünü Bul
              </h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 8, maxWidth: 380 }}>
                Bütçenize ve ihtiyaçlarınıza göre kişiselleştirilmiş ürün önerileri alın. "laptop öner" veya "uygun kulaklık" yazmanız yeterli.
              </p>
            </div>
            <button
              onClick={() => setIsWidgetOpen(true)}
              className="flex items-center gap-3 px-7 py-4 rounded-2xl shrink-0 transition-all"
              style={{
                background: "linear-gradient(135deg, #1ba3b8, #4dc4ce)",
                color: "#fff", fontWeight: 700, fontSize: 15,
                boxShadow: "0 8px 28px rgba(77,196,206,0.35)",
              }}
            >
              <ChatCircleDots size={22} weight="fill" />
              Jules'ı Başlat
            </button>
          </div>
        </section>

        {/* Tech store image showcase */}
        <section
          className="py-8 mb-4"
          style={{ background: "#fff", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}
        >
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="rounded-2xl overflow-hidden" style={{ height: isMobile ? 180 : 280 }}>
              <img
                src="https://images.unsplash.com/photo-1768137348738-ce11911f54f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZWxlY3Ryb25pY3MlMjBzdG9yZSUyMHByb2R1Y3RzJTIwZGlzcGxheXxlbnwxfHx8fDE3NzE5Mzc0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Tech store"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
        </>)}
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#1c3d54", color: "#fff", paddingTop: 48, paddingBottom: 28 }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center rounded-lg"
                  style={{ width: 34, height: 34, background: "linear-gradient(135deg, #1ba3b8, #4dc4ce)" }}>
                  <Lightning weight="fill" size={18} style={{ color: "#fff" }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 18 }}>VOLT</span>
                <span style={{ color: "#4dc4ce", fontWeight: 400, fontSize: 12 }}>market</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, maxWidth: 220 }}>
                Türkiye'nin en hızlı büyüyen teknoloji perakendecisi. Kalite, hız ve güvenin adresi.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: "Kurumsal", links: ["Hakkımızda", "Kariyer", "Basın Odası", "İletişim"],
              },
              {
                title: "Yardım", links: ["Sık Sorulan Sorular", "Kargo & Teslimat", "İade & Değişim", "Garanti"],
              },
              {
                title: "Kategoriler", links: ["Laptop & PC", "Telefon", "Kulaklık", "Akıllı Saat"],
              },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>{col.title}</div>
                {col.links.map((l) => (
                  <a key={l} href="#" className="block mb-2" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              © 2026 VOLT Market. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(77,196,206,0.1)", border: "1px solid rgba(77,196,206,0.2)" }}>
              <ChatCircleDots size={13} weight="fill" style={{ color: "#4dc4ce" }} />
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>Desteklendi:</span>
              <a
                href="https://creator.com.tr"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#4dc4ce", fontWeight: 700, fontSize: 11, textDecoration: "none" }}
              >
                Creator AI — Jules
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── JULES OVERLAY WIDGET ────────────────────────────────────────────── */}
      <JulesWidget
        isOpen={isWidgetOpen}
        onClose={() => setIsWidgetOpen(false)}
        headerHeight={HEADER_HEIGHT}
        onProductClick={handleProductClick}
        isDark={julesIsDark}
        onDarkChange={setJulesIsDark}
      />

      {/* ─── JULES SIDEPANE DRAWER (desktop side panel) ─────────────────────────── */}
      <JulesWidget
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        headerHeight={HEADER_HEIGHT}
        onProductClick={handleProductClick}
        variant="drawer"
        isDark={julesIsDark}
        onDarkChange={setJulesIsDark}
      />
    </div>
  );
}