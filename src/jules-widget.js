/**
 * JULES Widget — Vanilla JS, Zero Dependencies
 * Powered by Creator AI · https://creator.com.tr
 * ES Module build — imported directly by Vite, no runtime fetch needed.
 */
'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// SVG ICON LIBRARY
// ═══════════════════════════════════════════════════════════════════════════

function _lsvg(paths, size) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
}
function _psvg(path, size) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 256 256"><path d="' + path + '" fill="currentColor"/></svg>';
}

var ICO = {
  Bot: function (s) {
    return _lsvg('<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>', s);
  },
  Sparkles: function (s) {
    return _lsvg('<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>', s);
  },
  Copy: function (s) {
    return _lsvg('<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>', s);
  },
  ThumbsUp: function (s, filled) {
    return _lsvg('<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"' + (filled ? ' fill="currentColor"' : '') + '/>', s);
  },
  ThumbsDown: function (s, filled) {
    return _lsvg('<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"' + (filled ? ' fill="currentColor"' : '') + '/>', s);
  },
  ChevronRight: function (s) { return _lsvg('<path d="m9 18 6-6-6-6"/>', s); },
  ChevronLeft:  function (s) { return _lsvg('<path d="m15 18-6-6 6-6"/>', s); },
  Heart: function (s, filled) {
    return _lsvg('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"' + (filled ? ' fill="currentColor"' : '') + '/>', s);
  },
  X: function (s) { return _lsvg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', s); },
  Mic: function (s) {
    return _lsvg('<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>', s);
  },
  ArrowUpRight: function (s) { return _lsvg('<path d="M7 7h10v10"/><path d="M7 17 17 7"/>', s); },
  Clock: function (s) { return _lsvg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', s); },
  // Phosphor icons
  ArrowUp: function (s) {
    return _psvg('M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z', s);
  },
  CloudSun: function (s) {
    return _psvg('M164,72a76.2,76.2,0,0,0-20.26,2.73,55.63,55.63,0,0,0-9.41-11.54l9.51-13.57a8,8,0,1,0-13.11-9.18L121.22,54A55.9,55.9,0,0,0,96,48c-.58,0-1.16,0-1.74,0L91.37,31.71a8,8,0,1,0-15.75,2.77L78.5,50.82A56.1,56.1,0,0,0,55.23,65.67L41.61,56.14a8,8,0,1,0-9.17,13.11L46,78.77A55.55,55.55,0,0,0,40,104c0,.57,0,1.15,0,1.72L23.71,108.6a8,8,0,0,0,1.38,15.88,8.24,8.24,0,0,0,1.39-.12l16.32-2.88a55.74,55.74,0,0,0,5.86,12.42A52,52,0,0,0,84,224h80a76,76,0,0,0,0-152ZM92.92,120.76a52.14,52.14,0,0,0-31,4.17,40,40,0,0,1,66.62-44.17A76.26,76.26,0,0,0,92.92,120.76Z', s);
  },
  CloudFog: function (s) {
    return _psvg('M120,208H72a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm64-16H160a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Zm-24,32H104a8,8,0,0,0,0,16h56a8,8,0,0,0,0-16Zm72-124a76.08,76.08,0,0,1-76,76H76A52,52,0,0,1,76,72a53.26,53.26,0,0,1,8.92.76A76.08,76.08,0,0,1,232,100Zm-16,0A60.06,60.06,0,0,0,96,96.46a8,8,0,0,1-16-.92q.21-3.66.77-7.23A38.11,38.11,0,0,0,76,88a36,36,0,0,0,0,72h80A60.07,60.07,0,0,0,216,100Z', s);
  },
  Sun: function (s, weight) {
    if (weight === 'fill') {
      return _psvg('M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm8,24a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z', s);
    }
    return _psvg('M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z', s);
  },
  SunDim: function (s) {
    return _psvg('M120,40V32a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-8-8A8,8,0,0,0,50.34,61.66Zm0,116.68-8,8a8,8,0,0,0,11.32,11.32l8-8a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l8-8a8,8,0,0,0-11.32-11.32l-8,8A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l8,8a8,8,0,0,0,11.32-11.32ZM40,120H32a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Zm88,88a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,128,208Zm96-88h-8a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z', s);
  },
  CloudRain: function (s) {
    return _psvg('M158.66,196.44l-32,48a8,8,0,1,1-13.32-8.88l32-48a8,8,0,0,1,13.32,8.88ZM232,92a76.08,76.08,0,0,1-76,76H132.28l-29.62,44.44a8,8,0,1,1-13.32-8.88L113.05,168H76A52,52,0,0,1,76,64a53.26,53.26,0,0,1,8.92.76A76.08,76.08,0,0,1,232,92Zm-16,0A60.06,60.06,0,0,0,96,88.46a8,8,0,0,1-16-.92q.21-3.66.77-7.23A38.11,38.11,0,0,0,76,80a36,36,0,0,0,0,72h80A60.07,60.07,0,0,0,216,92Z', s);
  },
  CloudSnow: function (s) {
    return _psvg('M156,16A76.2,76.2,0,0,0,84.92,64.76,53.26,53.26,0,0,0,76,64a52,52,0,0,0,0,104h37.87L97.14,195.88A8,8,0,0,0,104,208h25.87l-16.73,27.88a8,8,0,0,0,13.72,8.24l24-40A8,8,0,0,0,144,192H118.13l14.4-24H156a76,76,0,0,0,0-152Zm0,136H76a36,36,0,0,1,0-72,38.11,38.11,0,0,1,4.78.31q-.56,3.57-.77,7.23a8,8,0,0,0,16,.92A60.06,60.06,0,1,1,156,152Z', s);
  },
  CloudLightning: function (s) {
    return _psvg('M156,16A76.2,76.2,0,0,0,84.92,64.76,53.26,53.26,0,0,0,76,64a52,52,0,0,0,0,104h37.87L97.14,195.88A8,8,0,0,0,104,208h25.87l-16.73,27.88a8,8,0,0,0,13.72,8.24l24-40A8,8,0,0,0,144,192H118.13l14.4-24H156a76,76,0,0,0,0-152Zm0,136H76a36,36,0,0,1,0-72,38.11,38.11,0,0,1,4.78.31q-.56,3.57-.77,7.23a8,8,0,0,0,16,.92A60.06,60.06,0,1,1,156,152Z', s);
  },
  Snowflake: function (s) {
    return _psvg('M223.77,150.09a8,8,0,0,1-5.86,9.68l-24.64,6,6.46,24.11a8,8,0,0,1-5.66,9.8A8.25,8.25,0,0,1,192,200a8,8,0,0,1-7.72-5.93l-7.72-28.8L136,141.86v46.83l21.66,21.65a8,8,0,0,1-11.32,11.32L128,203.31l-18.34,18.35a8,8,0,0,1-11.32-11.32L120,188.69V141.86L79.45,165.27l-7.72,28.8A8,8,0,0,1,64,200a8.25,8.25,0,0,1-2.08-.27,8,8,0,0,1-5.66-9.8l6.46-24.11-24.64-6a8,8,0,0,1,3.82-15.54l29.45,7.23L112,128,71.36,104.54l-29.45,7.23A7.85,7.85,0,0,1,40,112a8,8,0,0,1-1.91-15.77l24.64-6L56.27,66.07a8,8,0,0,1,15.46-4.14l7.72,28.8L120,114.14V67.31L98.34,45.66a8,8,0,0,1,11.32-11.32L128,52.69l18.34-18.35a8,8,0,0,1,11.32,11.32L136,67.31v46.83l40.55-23.41,7.72-28.8a8,8,0,0,1,15.46,4.14l-6.46,24.11,24.64,6A8,8,0,0,1,216,112a7.85,7.85,0,0,1-1.91-.23l-29.45-7.23L144,128l40.64,23.46,29.45-7.23A8,8,0,0,1,223.77,150.09Z', s);
  },
  SunHorizon: function (s) {
    return _psvg('M240,152H199.55a73.54,73.54,0,0,0,.45-8,72,72,0,0,0-144,0,73.54,73.54,0,0,0,.45,8H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM72,144a56,56,0,1,1,111.41,8H72.59A56.13,56.13,0,0,1,72,144Zm144,56a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,200ZM72.84,43.58a8,8,0,0,1,14.32-7.16l8,16a8,8,0,0,1-14.32,7.16Zm-56,48.84a8,8,0,0,1,10.74-3.57l16,8a8,8,0,0,1-7.16,14.31l-16-8A8,8,0,0,1,16.84,92.42Zm192,15.16a8,8,0,0,1,3.58-10.73l16-8a8,8,0,1,1,7.16,14.31l-16,8a8,8,0,0,1-10.74-3.58Zm-48-55.16,8-16a8,8,0,0,1,14.32,7.16l-8,16a8,8,0,1,1-14.32-7.16Z', s);
  },
  Moon: function (s, weight) {
    if (weight === 'fill') {
      return _psvg('M235.54,150.21a104.84,104.84,0,0,1-37,52.91A104,104,0,0,1,32,120,103.09,103.09,0,0,1,52.88,57.48a104.84,104.84,0,0,1,52.91-37,8,8,0,0,1,10,10,88.08,88.08,0,0,0,109.8,109.8,8,8,0,0,1,10,10Z', s);
    }
    return _psvg('M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23Z', s);
  },
  PhosphorX: function (s) {
    return _psvg('M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z', s);
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════

var SUGGESTIONS = ['İstanbul\'da otel öner', 'Bütçeme uygun seçenekler', 'En iyi restoranlar', 'Çok satan ürünler'];

var HOTEL_CARDS = [
  { id: 'h1', type: 'hotel', title: 'The Grand Bosphorus', subtitle: '5 Yıldızlı Otel · İstanbul, Türkiye', description: 'Boğaz\'ın nefes kesen manzarasına sahip lüks odalar ve süitler. Spa, açık yüzme havuzu ve dünyaca ünlü şeflerin yönettiği restoran ile unutulmaz bir konaklama deneyimi sunar.', image: 'https://images.unsplash.com/photo-1509647924673-bbb53e22eeb8?w=600&q=80', price: '₺4.200/gece', originalPrice: '₺5.800', rating: 4.8, reviews: 1240, badge: 'En Popüler', location: 'Beşiktaş, İstanbul', tags: ['Spa', 'Kahvaltı Dahil', 'WiFi'], cta: 'Oda Seç' },
  { id: 'h2', type: 'hotel', title: 'City Loft Suites', subtitle: 'Butik Otel · İstanbul, Türkiye', description: 'Taksim\'in kalbinde şık ve modern butik otel. Endüstriyel tasarım unsuruyla donatılmış geniş odalar, çatı terası ve özel cocktail barıyla şehir kaçamakları için ideal seçim.', image: 'https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=600&q=80', price: '₺2.100/gece', originalPrice: '₺2.900', rating: 4.5, reviews: 830, badge: '%28 İndirim', location: 'Taksim, İstanbul', tags: ['Tasarım Otel', 'WiFi', 'Bar'], cta: 'Rezervasyon Yap' },
  { id: 'h3', type: 'hotel', title: 'Aegean Pearl Resort', subtitle: 'Resort · Bodrum, Türkiye', description: 'Türkbükü koyunun masmavi sularına sıfır konumda sonsuzluk havuzlu lüks resort. All-inclusive seçeneği, özel plaj ve su sporları imkânlarıyla yaz tatilinin en iyisini yaşatır.', image: 'https://images.unsplash.com/photo-1715242563833-946f4b811399?w=600&q=80', price: '₺3.600/gece', rating: 4.7, reviews: 2180, badge: 'Yeni', location: 'Türkbükü, Bodrum', tags: ['Plaj', 'Havuz', 'All Inclusive'], cta: 'Detayları Gör' },
  { id: 'h4', type: 'hotel', title: 'Mountain View Lodge', subtitle: 'Dağ Evi · Uludağ, Bursa', description: 'Uludağ\'ın yayla havasında kütük ev mimarisiyle inşa edilmiş dağ evi. Kışın kayak pistlerine yürüme mesafesinde, yazın ise serin doğa yürüyüşleri için mükemmel bir kaçış noktası.', image: 'https://images.unsplash.com/photo-1679234148876-7e558003f115?w=600&q=80', price: '₺1.800/gece', originalPrice: '₺2.400', rating: 4.3, reviews: 560, location: 'Uludağ, Bursa', tags: ['Kayak', 'Şömine', 'Spa'], cta: 'Müsaitliği Kontrol Et' },
  { id: 'h5', type: 'hotel', title: 'Alaçatı Stone House', subtitle: 'Butik Otel · Alaçatı, İzmir', description: 'Ege\'nin rüzgarlı koyunda taş duvarlar ve beyaz badanalı bir dönüşüm. Zengin kahvaltısı, bisiklet kiralama imkânı ve rüzgar sörfü merkezlerine yakınlığıyla Alaçatı\'nın en sevilen butikleri arasında.', image: 'https://images.unsplash.com/photo-1746475470697-f40519dab2bc?w=600&q=80', price: '₺2.800/gece', originalPrice: '₺3.400', rating: 4.6, reviews: 920, badge: 'Ege\'nin İncisi', location: 'Alaçatı, İzmir', tags: ['Kahvaltı', 'Bisiklet', 'Sörf'], cta: 'Rezervasyon Yap' },
  { id: 'h6', type: 'hotel', title: 'Pera Palace Hotel', subtitle: 'Tarihi Otel · Beyoğlu, İstanbul', description: '1892\'de Orient Express yolcuları için inşa edilen efsanevi otel. Agatha Christie\'nin ilham aldığı Neo-Klasik mimarisi ve Boğaz manzaralı teraslı balosuyla tarihin içinde yaşayın.', image: 'https://images.unsplash.com/photo-1559081623-8ce23ec117d5?w=600&q=80', price: '₺5.500/gece', rating: 4.9, reviews: 4100, badge: 'Tarihi Miras', location: 'Beyoğlu, İstanbul', tags: ['Heritage', 'Spa', 'Restoran'], cta: 'Oda Seç' },
];

var RESTAURANT_CARDS = [
  { id: 'r1', type: 'place', title: 'Nusret Steakhouse', subtitle: 'Et Restoranı · Kuruçeşme', description: 'Dünyaca ünlü şef Nusret\'in en gözde restoranı. El seçimi wagyu ve dry-aged etler, özel servis ritüeli ve zarif atmosferiyle fine dining deneyimini yeniden tanımlıyor.', image: 'https://images.unsplash.com/photo-1762922425226-8cfe6987e7b0?w=600&q=80', price: '₺800+/kişi', rating: 4.6, reviews: 3420, badge: 'Michelin Önerisi', location: 'Kuruçeşme, İstanbul', time: '12:00 – 00:00', tags: ['Et', 'Fine Dining', 'Rezervasyon'], cta: 'Rezervasyon Yap' },
  { id: 'r2', type: 'place', title: 'Çiya Sofrası', subtitle: 'Anadolu Mutfağı · Kadıköy', description: 'Musa Dağdeviren\'in 35 yıllık emeğiyle kurduğu Anadolu mutfağının kalbi. Güneydoğu\'dan Ege\'ye uzanan 200\'den fazla yöresel tarif, her gün taze ve mevsimsel malzemelerle sofranıza geliyor.', image: 'https://images.unsplash.com/photo-1660145177383-e6e2c22adb5c?w=600&q=80', price: '₺200–400/kişi', rating: 4.9, reviews: 8900, badge: 'Efsane Lezzet', location: 'Kadıköy, İstanbul', time: '11:00 – 22:00', tags: ['Türk Mutfağı', 'Uygun Fiyat', 'Kebap'], cta: 'Menüyü Gör' },
  { id: 'r3', type: 'place', title: 'Sunset Rooftop Bar', subtitle: 'Kokteyl Bar & Restaurant · Galata', description: 'Galata Kulesi\'nin siluetine karşı İstanbul\'un iki yakasını izleyebileceğiniz çatı katı mekan. Yaratıcı kokteyller, tapas menüsü ve canlı DJ performanslarıyla gece hayatının vazgeçilmezi.', image: 'https://images.unsplash.com/photo-1762457556450-365eb6ee21d8?w=600&q=80', price: '₺500–900/kişi', rating: 4.4, reviews: 1890, badge: 'Manzara', location: 'Galata, İstanbul', time: '18:00 – 02:00', tags: ['Rooftop', 'Kokteyl', 'Romantik'], cta: 'Masa Ayırt' },
  { id: 'r4', type: 'place', title: 'Balıkçı Sabahattin', subtitle: 'Balık Restoranı · Sultanahmet', description: 'Sultanahmet\'in tarihi sokaklarında 1927\'den bu yana hizmet veren köklü balık lokantası. Günlük taze Boğaz balıkları, zeytinyağlı mezeler ve Türk rakısıyla otantik bir İstanbul sofrası.', image: 'https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=600&q=80', price: '₺350–600/kişi', rating: 4.5, reviews: 2340, location: 'Sultanahmet, İstanbul', time: '12:00 – 23:00', tags: ['Balık', 'Deniz Ürünleri', 'Tarihi'], cta: 'İncele' },
  { id: 'r5', type: 'place', title: 'Mikla Restaurant', subtitle: 'İskandinav-Türk Füzyon · Beyoğlu', description: 'Şef Mehmet Gürs\'ün imza restoranı. İstanbul\'un en yüksek noktalarından birinde, çağdaş Türk mutfağını İskandinav tekniklerle harmanlayan panoramik manzaralı gurme deneyimi.', image: 'https://images.unsplash.com/photo-1509647924673-bbb53e22eeb8?w=600&q=80', price: '₺900–1400/kişi', rating: 4.8, reviews: 2760, badge: 'Fine Dining', location: 'Beyoğlu, İstanbul', time: '18:30 – 23:30', tags: ['Füzyon', 'Manzara', 'Tasting Menu'], cta: 'Rezervasyon Yap' },
];

var PRODUCT_CARDS = [
  { id: 'p1', type: 'product', title: 'Nike Air Max 270', subtitle: 'Spor Ayakkabı · Nike', description: 'Nike\'ın ikonik Max Air yastıklama teknolojisiyle tasarlanmış günlük spor ayakkabı. Hafif mesh üst yüzey, geniş burun bölgesi ve kaymaz dış taban ile konfor sağlar.', image: 'https://images.unsplash.com/photo-1570348272490-7d6d5fddf335?w=600&q=80', price: '₺3.499', originalPrice: '₺4.999', rating: 4.7, reviews: 5420, badge: '%30 İndirim', tags: ['Spor', 'Günlük', 'Unisex'], cta: 'Sepete Ekle' },
  { id: 'p2', type: 'product', title: 'MacBook Air M3', subtitle: 'Laptop · Apple', description: 'Apple Silicon M3 çipiyle donatılmış ince ve hafif dizüstü bilgisayar. 18 saate kadar pil ömrü, Liquid Retina ekran ve tam gün performansıyla yaratıcı profesyoneller için tasarlandı.', image: 'https://images.unsplash.com/photo-1660145177383-e6e2c22adb5c?w=600&q=80', price: '₺54.999', rating: 4.9, reviews: 9870, badge: 'Yeni Ürün', tags: ['Laptop', 'Üretkenlik', 'Premium'], cta: 'Satın Al' },
  { id: 'p3', type: 'product', title: 'Sony WH-1000XM5', subtitle: 'Kablosuz Kulaklık · Sony', description: 'Sony\'nin amiral gemisi gürültü engelleme kulaklığı. Endüstri lideri ANC teknolojisi, 30 saatlik pil ömrü ve katlanabilir tasarımıyla seyahat ve ofis kullanımı için en iyi seçenek.', image: 'https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?w=600&q=80', price: '₺8.999', originalPrice: '₺11.999', rating: 4.8, reviews: 7230, badge: 'En Çok Satan', tags: ['ANC', 'Bluetooth', '30 Saat'], cta: 'Ürünü İncele', productId: 'sony-wh1000xm5' },
  { id: 'p4', type: 'product', title: 'Apple Watch Ultra 2', subtitle: 'Akıllı Saat · Apple', description: 'Apple\'ın en güçlü akıllı saati. Titanyum kasa, 60 saatlik pil ömrü, 100m su direnci ve hassas GPS ile dağ tırmanışından derinsu dalışına tüm maceralarınıza eşlik ediyor.', image: 'https://images.unsplash.com/photo-1716234479503-c460b87bdf98?w=600&q=80', price: '₺34.999', rating: 4.8, reviews: 4210, badge: 'Premium', tags: ['Spor', 'GPS', 'Titanium'], cta: 'İncele' },
];

var SCENARIOS = [
  { keywords: ['otel', 'hotel', 'konaklama', 'bodrum', 'istanbul', 'uludağ', 'tatil'], reply: 'İstanbul ve çevresinde size uygun otel seçeneklerini buldum! Bütçenize, konumunuza ve tercihlerinize göre filtrelenmiş 6 harika seçenek var. Detayları sağ tarafta inceleyebilirsiniz.', cards: HOTEL_CARDS, cardLabel: '6 Otel', panelTitle: 'Önerilen Oteller' },
  { keywords: ['restoran', 'yemek', 'restaurant', 'lokanta', 'kebap', 'balık', 'yeme'], reply: 'İstanbul\'un en sevilen restoranlarını sizin için derledim! Farklı mutfak türleri ve fiyat aralıklarında 5 özel öneri sizi bekliyor. Sağ panelden detayları inceleyip rezervasyon yapabilirsiniz.', cards: RESTAURANT_CARDS, cardLabel: '5 Restoran', panelTitle: 'Önerilen Restoranlar' },
  { keywords: ['ürün', 'satın', 'ayakkabı', 'laptop', 'kulaklık', 'teknoloji', 'alışveriş', 'fiyat', 'çok satan', 'ürünler'], reply: 'Aradığınız ürünlerle ilgili size en iyi seçenekleri buldum! Puan, fiyat ve özelliklere göre sıralanmış 4 ürün var. Sağ tarafta detaylıca inceleyebilir ve sepete ekleyebilirsiniz.', cards: PRODUCT_CARDS, cardLabel: '4 Ürün', panelTitle: 'Önerilen Ürünler' },
  { keywords: ['bütçe', 'uygun', 'ekonomik', 'ucuz', 'indirim'], reply: 'Bütçenize uygun seçenekleri filtreledim! En iyi fiyat-performans oranına sahip 6 otel sağ panelde sizi bekliyor.', cards: HOTEL_CARDS, cardLabel: '6 Bütçeye Uygun Otel', panelTitle: 'Bütçeye Uygun Seçenekler' },
];

var DEFAULT_REPLIES = [
  'Anlıyorum! Size daha iyi yardımcı olabilmem için biraz daha bilgi verir misiniz? Örneğin bütçeniz veya tercih ettiğiniz konum nedir?',
  'Harika bir soru! Bu konuda size yardımcı olmak için birkaç seçenek hazırlıyorum...',
  'Tabii ki! Bu konuda en güncel ve güvenilir bilgileri getiriyorum, bir an lütfen.',
  'Mükemmel! Sizin için en uygun seçenekleri analiz ediyorum. Tercihlerinizi öğrenmek ister misiniz?',
];

var EMOJIS = ['👋🏼', '🖖🏼', 'BOT_ICON', '👇🏼', '👍🏼', '🙏🏼', '🤝🏼', '👏🏼'];

var MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
var DAYS   = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function genId() { return 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9); }

function formatTime(date) {
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getDateStr() {
  var now = new Date();
  return now.getDate() + ' ' + MONTHS[now.getMonth()] + ' ' + DAYS[now.getDay()] + '.';
}

function getSunLabel(weatherInfo) {
  if (!weatherInfo) return null;
  var now = new Date();
  var parts = weatherInfo.sunrise.split(':').map(Number);
  var eParts = weatherInfo.sunset.split(':').map(Number);
  var nowMin = now.getHours() * 60 + now.getMinutes();
  var sunriseMin = parts[0] * 60 + parts[1];
  var sunsetMin  = eParts[0] * 60 + eParts[1];
  if (nowMin < sunriseMin) return { label: weatherInfo.sunrise, isSunrise: true };
  if (nowMin < sunsetMin)  return { label: weatherInfo.sunset, isSunrise: false };
  return { label: weatherInfo.sunrise, isSunrise: true };
}

function weatherIconHtml(code, accentColor, size) {
  var style = 'color:' + accentColor + ';flex-shrink:0;';
  size = size || 14;
  var ico;
  if (code === 0)  ico = ICO.Sun(size);
  else if (code === 1)  ico = ICO.SunDim(size);
  else if (code <= 3)   ico = ICO.CloudSun(size);
  else if (code <= 48)  ico = ICO.CloudFog(size);
  else if (code <= 67)  ico = ICO.CloudRain(size);
  else if ([71,73,75,85,86].indexOf(code) !== -1) ico = ICO.Snowflake(size);
  else if (code === 77) ico = ICO.CloudSnow(size);
  else if (code <= 82)  ico = ICO.CloudRain(size);
  else ico = ICO.CloudLightning(size);
  return '<span style="' + style + '">' + ico + '</span>';
}

// ═══════════════════════════════════════════════════════════════════════════
// JULES WIDGET CLASS
// ═══════════════════════════════════════════════════════════════════════════

function JulesWidget(options) {
  options = options || {};
  this._target        = options.target || document.body;
  this._headerHeight  = options.headerHeight || 0;
  this._onCloseCb     = options.onClose || null;
  this._onProductClick= options.onProductClick || null;
  this._onDarkChange  = options.onDarkChange || null;

  this._st = {
    isOpen: false,
    messages: [],
    isTyping: false,
    activeCardMsgId: null,
    panelSessions: [],
    cardData: {},
    isPanelOpen: false,
    isMobile: window.innerWidth < 768,
    likedCards: new Set(),
    scrollToSessionId: null,
    isDark: options.isDark || false,
    emojiIndex: 0,
    emojiPhase: 'visible',
    weatherInfo: null,
    inputValue: '',
    votes: {},
    showFavDrawer: false,
    drawerDragY: 0,
    showFavorites: false,
    heartHover: false,
    activeCardIndices: {},
    defaultReplyIndex: 0,
  };

  this._drawerTouchStartY = 0;
  this._timers = {};
  this._styleTag = null;
  this._root = null;
  this._resizeBound = this._onResize.bind(this);

  this._injectStyles();
  this._createDOM();
  window.addEventListener('resize', this._resizeBound);
  this._startEmojiCycle();
  this._fetchWeather();
}

// ─── Public API ───────────────────────────────────────────────────────────

JulesWidget.prototype.open = function () {
  this._st.isOpen = true;
  this._applyOpenState();
  this._lockScroll();
};

JulesWidget.prototype.close = function () {
  this._st.isOpen = false;
  this._applyOpenState();
  this._unlockScroll();
  if (this._onCloseCb) this._onCloseCb();
};

JulesWidget.prototype.setDark = function (v) {
  this._st.isDark = v;
  this._applyTheme();
  if (this._onDarkChange) this._onDarkChange(v);
};

JulesWidget.prototype.destroy = function () {
  window.removeEventListener('resize', this._resizeBound);
  Object.keys(this._timers).forEach(function (k) { clearTimeout(this._timers[k]); }, this);
  if (this._styleTag && this._styleTag.parentNode) this._styleTag.parentNode.removeChild(this._styleTag);
  if (this._root && this._root.parentNode) this._root.parentNode.removeChild(this._root);
};

// ─── Style injection ──────────────────────────────────────────────────────

JulesWidget.prototype._injectStyles = function () {
  if (document.getElementById('jules-widget-styles')) return;
  var tag = document.createElement('style');
  tag.id = 'jules-widget-styles';
  tag.textContent = [
    '@property --jw-orbit-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }',
    '@keyframes jw-orbit { from { --jw-orbit-angle: 0deg; } to { --jw-orbit-angle: 360deg; } }',
    '@keyframes jw-bounce { 0%,100% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); } 50% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } }',
    '@keyframes jw-fadein { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }',
    '.jw-orbit-light { background: conic-gradient(from var(--jw-orbit-angle) at 50% 50%, rgba(229,231,235,0.85) 0deg, rgba(229,231,235,0.85) 258deg, rgba(27,163,184,0.55) 276deg, rgba(77,196,206,0.90) 293deg, rgba(27,163,184,0.55) 310deg, rgba(229,231,235,0.85) 328deg, rgba(229,231,235,0.85) 360deg); animation: jw-orbit 6.4s linear infinite; }',
    '.jw-orbit-dark  { background: conic-gradient(from var(--jw-orbit-angle) at 50% 50%, rgba(19,34,48,0.95) 0deg, rgba(19,34,48,0.95) 258deg, rgba(27,163,184,0.40) 276deg, rgba(77,196,206,0.65) 293deg, rgba(27,163,184,0.40) 310deg, rgba(19,34,48,0.95) 328deg, rgba(19,34,48,0.95) 360deg); animation: jw-orbit 6.4s linear infinite; }',
    '.jw-bounce-1 { animation: jw-bounce 1s infinite; animation-delay: 0ms; }',
    '.jw-bounce-2 { animation: jw-bounce 1s infinite; animation-delay: 150ms; }',
    '.jw-bounce-3 { animation: jw-bounce 1s infinite; animation-delay: 300ms; }',
    '.jw-msg-in { animation: jw-fadein 0.22s ease forwards; }',
    '.jw-hide-scrollbar::-webkit-scrollbar { display: none; }',
    '.jw-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }',
    '.jw-card-img { transition: transform 0.7s ease; }',
    '.jw-card-wrap:hover .jw-card-img { transform: scale(1.04); }',
    'textarea.jw-ta::placeholder { color: var(--jw-placeholder); }',
  ].join('\n');
  document.head.appendChild(tag);
  this._styleTag = tag;
};

// ─── Theme ────────────────────────────────────────────────────────────────

JulesWidget.prototype._theme = function () {
  var dark = this._st.isDark;
  return {
    bg:           dark ? 'rgba(10,23,32,0.84)'  : 'rgba(255,255,255,0.84)',
    border:       dark ? 'rgba(77,196,206,0.18)': 'rgba(10,110,130,0.13)',
    textPrimary:  dark ? '#e0f2f9'              : '#111827',
    textSecondary:dark ? '#8bbccc'              : '#374151',
    textMuted:    dark ? '#4a7a8e'              : '#9ca3af',
    accentColor:  '#1ba3b8',
    accentDimBg:  dark ? 'rgba(27,163,184,0.12)': 'rgba(27,163,184,0.08)',
    accentDimBdr: dark ? 'rgba(27,163,184,0.3)' : 'rgba(27,163,184,0.25)',
    inputBg:      dark ? '#0c1e2c'              : '#f9fafb',
    userBubble:   dark ? 'linear-gradient(135deg,#0a6e82 0%,#1ba3b8 100%)' : 'linear-gradient(135deg,#1ba3b8 0%,#0a6e82 100%)',
    userBubbleText: '#ffffff',
  };
};

// ─── DOM creation ─────────────────────────────────────────────────────────

JulesWidget.prototype._createDOM = function () {
  var self = this;
  var root = document.createElement('div');
  root.id = 'jules-widget-root';
  root.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;';
  this._root = root;

  // Backdrop
  var bd = document.createElement('div');
  bd.id = 'jw-backdrop';
  var hh0 = this._headerHeight || 0;
  bd.style.cssText = 'position:absolute;left:0;right:0;bottom:0;top:' + hh0 + 'px;background:rgba(0,0,0,0.35);opacity:0;transition:opacity 0.3s ease;pointer-events:none;';
  bd.addEventListener('click', function () { self.close(); });
  root.appendChild(bd);

  // Widget panel
  var wp = document.createElement('div');
  wp.id = 'jw-panel';
  root.appendChild(wp);

  this._target.appendChild(root);
  this._rebuildPanel();
};

JulesWidget.prototype._rebuildPanel = function () {
  var self = this;
  var st   = this._st;
  var T    = this._theme();
  var wp   = document.getElementById('jw-panel');
  if (!wp) return;
  wp.innerHTML = '';

  // Panel outer styles
  var hh = this._headerHeight || 0;
  wp.style.cssText = [
    'position:absolute;right:0;bottom:0;',
    'top:' + hh + 'px;',
    'left:0;',
    'display:flex;',
    'justify-content:center;',
    'align-items:' + (st.isMobile ? 'flex-start' : 'center') + ';',
    'padding:' + (st.isMobile ? '0' : '28px 0') + ';',
    'pointer-events:none;',
    'opacity:0;',
    'transform:translateY(-18px);',
    'transition:transform 0.32s cubic-bezier(0.4,0,0.2,1),opacity 0.28s ease;',
  ].join('');

  // Inner container
  var inner = document.createElement('div');
  inner.id = 'jw-inner';
  inner.style.cssText = [
    'display:flex;',
    'width:100%;',
    'height:100%;',
    'min-height:0;',
    'max-width:' + (st.isMobile ? '100%' : '1200px') + ';',
    'flex-direction:' + (st.isMobile ? 'column' : 'row') + ';',
    'background:' + (st.isMobile ? (st.isDark ? 'rgba(10,23,32,0.84)' : 'rgba(255,255,255,1)') : (st.isDark ? 'rgba(10,23,32,0.84)' : 'rgba(255,255,255,0.84)')) + ';',
    'backdrop-filter:blur(24px) saturate(1.6);',
    '-webkit-backdrop-filter:blur(24px) saturate(1.6);',
    'box-shadow:0 8px 40px rgba(0,0,0,0.25);',
    'border-radius:' + (st.isMobile ? '0' : '38px') + ';',
    'overflow:hidden;',
    'transition:background 0.3s;',
  ].join('');
  wp.appendChild(inner);

  // Content panel slot
  var cpSlot = document.createElement('div');
  cpSlot.id = 'jw-cp-slot';
  cpSlot.style.cssText = 'transition:all 0.3s ease;overflow:hidden;';
  inner.appendChild(cpSlot);

  // Chat panel
  var chat = document.createElement('div');
  chat.id = 'jw-chat';
  chat.style.cssText = 'display:flex;flex-direction:column;overflow:hidden;transition:all 0.3s ease;';
  inner.appendChild(chat);

  if (st.isMobile) {
    cpSlot.style.cssText += 'width:100%;flex-shrink:0;order:1;border-bottom:1px solid ' + T.border + ';';
    chat.style.cssText   += 'width:100%;flex-shrink:0;order:2;';
  } else {
    cpSlot.style.cssText += 'flex:1;border-left:1px solid ' + T.border + ';order:2;';
    chat.style.cssText   += 'flex-shrink:0;order:1;';
  }

  this._buildChatPanel(chat);
  this._updatePanelSlot();
  this._applyPanelLayout();
};

// ─── Chat panel build ─────────────────────────────────────────────────────

JulesWidget.prototype._buildChatPanel = function (chat) {
  var self = this;
  var st   = this._st;
  var T    = this._theme();

  chat.style.background = 'transparent';

  // Header
  var header = document.createElement('div');
  header.id = 'jw-header';
  header.style.cssText = [
    'display:flex;align-items:center;gap:12px;flex-shrink:0;',
    'padding:' + (st.isMobile ? '6px 20px' : '14px 20px') + ';',
    'background:transparent;',
    'border-bottom:1px solid ' + T.border + ';',
    'transition:border-color 0.3s;',
  ].join('');
  chat.appendChild(header);
  this._buildHeader(header);

  // Messages
  var msgs = document.createElement('div');
  msgs.id = 'jw-messages';
  msgs.style.cssText = 'flex:1;min-height:0;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px;scroll-behavior:smooth;';
  chat.appendChild(msgs);
  this._renderMessages();

  // Suggestions bar (will be shown/hidden)
  var sugg = document.createElement('div');
  sugg.id = 'jw-suggestions';
  sugg.style.cssText = 'flex-shrink:0;';
  chat.appendChild(sugg);
  this._renderSuggestions();

  // Input area
  var inputArea = document.createElement('div');
  inputArea.id = 'jw-input-area';
  inputArea.style.cssText = 'padding-bottom:16px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;';
  chat.appendChild(inputArea);
  this._buildInputArea(inputArea);
};

// ─── Header ───────────────────────────────────────────────────────────────

JulesWidget.prototype._buildHeader = function (header) {
  var self = this;
  var st   = this._st;
  var T    = this._theme();
  header.innerHTML = '';

  // Close button
  var closeBtn = document.createElement('button');
  closeBtn.title = 'Jules\'ı kapat';
  closeBtn.innerHTML = ICO.PhosphorX(11);
  closeBtn.style.cssText = 'width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:8px;border:1px solid ' + T.border + ';background:transparent;color:' + T.textMuted + ';cursor:pointer;flex-shrink:0;transition:background 0.15s,border-color 0.15s,color 0.15s;';
  closeBtn.addEventListener('mouseenter', function () {
    closeBtn.style.background = 'rgba(248,113,113,0.12)';
    closeBtn.style.borderColor = '#f87171';
    closeBtn.style.color = '#f87171';
  });
  closeBtn.addEventListener('mouseleave', function () {
    closeBtn.style.background = 'transparent';
    closeBtn.style.borderColor = T.border;
    closeBtn.style.color = T.textMuted;
  });
  closeBtn.addEventListener('click', function () { self.close(); });
  header.appendChild(closeBtn);

  // Date/weather row
  var dateRow = document.createElement('div');
  dateRow.style.cssText = 'display:flex;align-items:center;gap:12px;overflow:hidden;';

  var dateSpan = document.createElement('span');
  dateSpan.style.cssText = 'font-size:10px;color:' + T.textSecondary + ';white-space:nowrap;flex-shrink:0;';
  dateSpan.textContent = getDateStr();
  dateRow.appendChild(dateSpan);

  if (st.weatherInfo) {
    var wRow = document.createElement('div');
    wRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
    wRow.innerHTML = weatherIconHtml(st.weatherInfo.code, T.accentColor, 14) + '<span style="font-size:10px;color:' + T.textSecondary + ';white-space:nowrap;">' + st.weatherInfo.temp + '°C</span>';
    dateRow.appendChild(wRow);

    var sunLabel = getSunLabel(st.weatherInfo);
    if (sunLabel && !st.isMobile) {
      var sunRow = document.createElement('div');
      sunRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
      sunRow.innerHTML = '<span style="color:' + T.accentColor + ';flex-shrink:0;display:inline-flex;">' + ICO.SunHorizon(12) + '</span><span style="font-size:10px;color:' + T.textSecondary + ';white-space:nowrap;">' + sunLabel.label + '</span>';
      dateRow.appendChild(sunRow);
    }
  }
  header.appendChild(dateRow);

  // Right side
  var right = document.createElement('div');
  right.style.cssText = 'margin-left:auto;display:flex;align-items:center;gap:10px;flex-shrink:0;';

  // Favorites button (mobile only)
  if (st.isMobile) {
    var favBtn = document.createElement('button');
    var allFavs = this._getAllFavCards();
    var favCount = allFavs.length;
    favBtn.style.cssText = 'position:relative;padding:6px;border-radius:8px;border:none;background:transparent;color:' + (favCount > 0 ? '#f87171' : T.textMuted) + ';cursor:pointer;';
    var heartHtml = ICO.Heart(16, favCount > 0);
    favBtn.innerHTML = heartHtml + (favCount > 0 ? '<span style="position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:#f87171;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1;">' + favCount + '</span>' : '');
    favBtn.addEventListener('click', function () {
      self._st.showFavDrawer = true;
      self._renderFavDrawer();
    });
    favBtn.addEventListener('mouseenter', function () { favBtn.style.background = T.accentDimBg; });
    favBtn.addEventListener('mouseleave', function () { favBtn.style.background = 'transparent'; });
    right.appendChild(favBtn);
  }

  // Dark mode switch
  right.appendChild(this._buildDarkSwitch());

  // Panel toggle (desktop only, when panel has sessions)
  if (!st.isPanelOpen && st.panelSessions.length > 0 && !st.isMobile) {
    var toggleBtn = document.createElement('button');
    toggleBtn.title = 'Sonuçları göster';
    toggleBtn.innerHTML = ICO.ChevronLeft(14);
    toggleBtn.style.cssText = 'width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:8px;border:1px solid ' + T.accentDimBdr + ';background:' + T.accentDimBg + ';color:' + T.accentColor + ';cursor:pointer;transition:background 0.15s,color 0.15s;';
    toggleBtn.addEventListener('mouseenter', function () { toggleBtn.style.background = '#0a6e82'; toggleBtn.style.color = '#fff'; });
    toggleBtn.addEventListener('mouseleave', function () { toggleBtn.style.background = T.accentDimBg; toggleBtn.style.color = T.accentColor; });
    toggleBtn.addEventListener('click', function () { self._handleTogglePanel(); });
    right.appendChild(toggleBtn);
  }
  header.appendChild(right);
};

// ─── Dark mode switch ─────────────────────────────────────────────────────

JulesWidget.prototype._buildDarkSwitch = function () {
  var self = this;
  var st   = this._st;

  var btn = document.createElement('button');
  btn.id = 'jw-dark-switch';
  btn.title = st.isDark ? 'Açık moda geç' : 'Koyu moda geç';
  btn.style.cssText = 'position:relative;width:47px;height:23px;border-radius:12px;border:none;cursor:pointer;background:transparent;padding:0;flex-shrink:0;';

  var track = document.createElement('div');
  track.style.cssText = [
    'position:absolute;inset:0;border-radius:12px;',
    'background:' + (st.isDark ? 'linear-gradient(135deg,#0b1822 0%,#1c3d54 100%)' : 'linear-gradient(135deg,#fffbeb 0%,#fde68a 100%)') + ';',
    'border:' + (st.isDark ? '1.5px solid #2a4a5e' : '1.5px solid #fcd34d') + ';',
    'box-shadow:' + (st.isDark ? 'inset 0 2px 5px rgba(0,0,0,0.6),0 0 10px rgba(77,196,206,0.08)' : 'inset 0 2px 5px rgba(0,0,0,0.05),0 0 8px rgba(251,191,36,0.25)') + ';',
    'display:flex;align-items:center;justify-content:space-between;padding:0 6px;overflow:hidden;',
    'transition:background 0.35s ease,border-color 0.35s ease,box-shadow 0.35s ease;',
  ].join('');

  // Stars (dark) or sun dots (light)
  if (st.isDark) {
    track.innerHTML = '<div style="position:absolute;top:4px;left:14px;width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,0.5);"></div><div style="position:absolute;top:8px;left:20px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(255,255,255,0.35);"></div><div style="position:absolute;top:5px;left:26px;width:1px;height:1px;border-radius:50%;background:rgba(255,255,255,0.4);"></div>';
  } else {
    track.innerHTML = '<div style="position:absolute;top:3px;right:9px;width:2px;height:2px;border-radius:50%;background:rgba(245,158,11,0.5);"></div><div style="position:absolute;bottom:3px;right:14px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(245,158,11,0.4);"></div>';
  }

  var sunIcon  = document.createElement('span');
  sunIcon.style.cssText = 'color:' + (st.isDark ? '#3d6880' : '#f59e0b') + ';opacity:' + (st.isDark ? '0.3' : '1') + ';flex-shrink:0;z-index:1;transition:opacity 0.3s,color 0.3s;display:inline-flex;';
  sunIcon.innerHTML = ICO.Sun(11, 'fill');
  track.appendChild(sunIcon);

  var moonIcon = document.createElement('span');
  moonIcon.style.cssText = 'color:' + (st.isDark ? '#4dc4ce' : '#a78bfa') + ';opacity:' + (st.isDark ? '1' : '0.4') + ';flex-shrink:0;z-index:1;transition:opacity 0.3s,color 0.3s;display:inline-flex;';
  moonIcon.innerHTML = ICO.Moon(11, 'fill');
  track.appendChild(moonIcon);
  btn.appendChild(track);

  var thumb = document.createElement('div');
  thumb.style.cssText = [
    'position:absolute;top:4px;',
    'left:' + (st.isDark ? '25px' : '4px') + ';',
    'width:16px;height:16px;border-radius:8px;',
    'background:' + (st.isDark ? 'linear-gradient(135deg,#1ba3b8 0%,#0a6e82 100%)' : 'linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%)') + ';',
    'box-shadow:' + (st.isDark ? '0 2px 6px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.18)' : '0 2px 6px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.9)') + ';',
    'transition:left 0.32s cubic-bezier(0.4,0,0.2,1),background 0.35s ease,box-shadow 0.35s ease;',
    'display:flex;align-items:center;justify-content:center;z-index:2;',
  ].join('');
  thumb.innerHTML = '<span style="display:inline-flex;color:rgba(255,255,255,0.9);">' + (st.isDark ? ICO.Moon(9, 'fill') : ICO.Sun(9, 'fill')) + '</span>';
  btn.appendChild(thumb);

  btn.addEventListener('click', function () {
    self._st.isDark = !self._st.isDark;
    self._applyTheme();
    if (self._onDarkChange) self._onDarkChange(self._st.isDark);
  });
  return btn;
};

// ─── Messages ─────────────────────────────────────────────────────────────

JulesWidget.prototype._renderMessages = function () {
  var self = this;
  var st   = this._st;
  var msgs = document.getElementById('jw-messages');
  if (!msgs) return;
  msgs.innerHTML = '';
  msgs.style.colorScheme = st.isDark ? 'dark' : 'light';

  if (st.messages.length === 0) {
    msgs.appendChild(this._buildWelcome());
  } else {
    st.messages.forEach(function (msg) {
      msgs.appendChild(self._buildMessageEl(msg));
    });
  }

  // Typing indicator
  if (st.isTyping) {
    msgs.appendChild(this._buildTypingEl());
  }

  // Scroll to bottom
  var bottom = document.createElement('div');
  bottom.id = 'jw-bottom';
  msgs.appendChild(bottom);

  clearTimeout(this._timers.scroll);
  this._timers.scroll = setTimeout(function () {
    var b = document.getElementById('jw-bottom');
    if (b) b.scrollIntoView({ behavior: 'smooth' });
  }, 50);
};

JulesWidget.prototype._buildWelcome = function () {
  var self = this;
  var T = this._theme();
  var wrap = document.createElement('div');
  wrap.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;';

  // Emoji cycling container
  var emojiWrap = document.createElement('div');
  emojiWrap.id = 'jw-emoji-wrap';
  emojiWrap.style.cssText = 'width:56px;height:56px;position:relative;overflow:hidden;flex-shrink:0;';

  var emojiInner = document.createElement('div');
  emojiInner.id = 'jw-emoji-inner';
  emojiInner.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;';
  emojiInner.appendChild(this._buildEmojiContent());
  emojiWrap.appendChild(emojiInner);
  wrap.appendChild(emojiWrap);

  var textDiv = document.createElement('div');
  textDiv.style.textAlign = 'center';
  textDiv.innerHTML = '<p style="font-size:14px;font-weight:600;color:' + T.textPrimary + ';margin-bottom:4px;">Size nasıl yardımcı olabilirim?</p><p style="font-size:12px;color:' + T.textMuted + ';">Bir şeyler sorun, size en iyi sonuçları getireyim.</p>';
  wrap.appendChild(textDiv);

  var chips = document.createElement('div');
  chips.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px;';
  SUGGESTIONS.forEach(function (s) {
    var chip = document.createElement('button');
    chip.textContent = s;
    chip.style.cssText = 'padding:8px 12px;border-radius:12px;font-size:12px;border:1px solid ' + T.accentDimBdr + ';color:' + T.textSecondary + ';background:transparent;cursor:pointer;transition:all 0.15s;';
    chip.addEventListener('mouseenter', function () { chip.style.borderColor = T.accentColor; chip.style.color = T.accentColor; chip.style.background = T.accentDimBg; });
    chip.addEventListener('mouseleave', function () { chip.style.borderColor = T.accentDimBdr; chip.style.color = T.textSecondary; chip.style.background = 'transparent'; });
    chip.addEventListener('click', function () { self._handleSend(s); });
    chips.appendChild(chip);
  });
  wrap.appendChild(chips);
  return wrap;
};

JulesWidget.prototype._buildEmojiContent = function () {
  var st = this._st;
  var phase = st.emojiPhase;
  var s;
  if (phase === 'out')     s = { transform: 'scale(0.4) rotate(-15deg)', opacity: '0', transition: 'transform 0.18s cubic-bezier(0.4,0,1,1),opacity 0.18s ease' };
  else if (phase === 'in') s = { transform: 'scale(1.25) rotate(8deg)',  opacity: '0', transition: 'none' };
  else                     s = { transform: 'scale(1) rotate(0deg)',     opacity: '1', transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1),opacity 0.18s ease' };

  var styleStr = 'will-change:transform;transform:' + s.transform + ';opacity:' + s.opacity + ';transition:' + s.transition + ';';

  if (EMOJIS[st.emojiIndex] === 'BOT_ICON') {
    var div = document.createElement('div');
    div.style.cssText = styleStr;
    div.innerHTML = '<div style="width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:#0a6e82;box-shadow:0 4px 12px rgba(0,0,0,0.2);">' + ICO.Bot(18) + '</div>';
    var svgEl = div.querySelector('svg');
    if (svgEl) svgEl.style.color = 'white';
    return div;
  } else {
    var span = document.createElement('span');
    span.style.cssText = 'font-size:28px;line-height:1;display:block;user-select:none;' + styleStr;
    span.textContent = EMOJIS[st.emojiIndex];
    return span;
  }
};

JulesWidget.prototype._buildMessageEl = function (msg) {
  var self = this;
  var st   = this._st;
  var T    = this._theme();
  var wrap = document.createElement('div');
  wrap.className = 'jw-msg-in';
  wrap.style.cssText = 'display:flex;flex-direction:column;';

  var row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:10px;' + (msg.role === 'user' ? 'justify-content:flex-end;' : 'justify-content:flex-start;');

  if (msg.role === 'assistant') {
    var avatar = document.createElement('div');
    avatar.style.cssText = 'width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;background:#0a6e82;box-shadow:0 2px 6px rgba(0,0,0,0.15);';
    avatar.innerHTML = '<span style="color:white;display:inline-flex;">' + ICO.Bot(14) + '</span>';
    row.appendChild(avatar);
  }

  var col = document.createElement('div');
  col.style.cssText = 'display:flex;flex-direction:column;gap:4px;' + (msg.role === 'user' ? 'align-items:flex-end;' : 'align-items:flex-start;') + 'max-width:' + (st.isMobile ? '85%' : '50%') + ';';

  var bubble = document.createElement('div');
  bubble.style.cssText = [
    'padding:10px 14px;font-size:12px;line-height:1.6;',
    'border-radius:' + (msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px') + ';',
    'background:' + (msg.role === 'user' ? T.userBubble : 'transparent') + ';',
    'color:' + (msg.role === 'user' ? T.userBubbleText : (st.isDark ? '#cfe8f4' : '#1f2937')) + ';',
    msg.role === 'user' ? ('box-shadow:' + (st.isDark ? '0 2px 8px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.10)') + ';') : '',
  ].join('');
  bubble.textContent = msg.content;
  col.appendChild(bubble);

  // Show cards button (desktop only)
  if (msg.hasCards && msg.role === 'assistant' && !st.isMobile) {
    var cardBtn = document.createElement('button');
    var isActive = st.activeCardMsgId === msg.id;
    cardBtn.innerHTML = '<span style="display:inline-flex;">' + ICO.Sparkles(11) + '</span><span>' + esc(msg.cardLabel || 'Sonuçları Gör') + '</span><span style="display:inline-flex;">' + ICO.ChevronRight(11) + '</span>';
    cardBtn.style.cssText = [
      'display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:12px;',
      'font-size:10px;font-weight:500;cursor:pointer;border:none;transition:background 0.15s;',
      isActive ? 'background:#0a6e82;color:white;' : ('background:' + T.accentDimBg + ';color:' + T.accentColor + ';border:1px solid ' + T.accentDimBdr + ';'),
    ].join('');
    cardBtn.addEventListener('mouseenter', function () {
      if (self._st.activeCardMsgId !== msg.id) cardBtn.style.background = st.isDark ? 'rgba(77,196,206,0.2)' : '#b2e4ea';
    });
    cardBtn.addEventListener('mouseleave', function () {
      if (self._st.activeCardMsgId !== msg.id) cardBtn.style.background = T.accentDimBg;
    });
    cardBtn.addEventListener('click', function () { self._handleShowCards(msg.id); });
    col.appendChild(cardBtn);
  }

  // Timestamp + action buttons
  var meta = document.createElement('div');
  meta.style.cssText = 'display:flex;align-items:center;gap:8px;';
  var ts = document.createElement('span');
  ts.style.cssText = 'font-size:10px;color:' + T.textMuted + ';';
  ts.textContent = formatTime(msg.timestamp);
  meta.appendChild(ts);

  if (msg.role === 'assistant') {
    var actions = document.createElement('div');
    actions.style.cssText = 'display:flex;align-items:center;gap:4px;';

    var copyBtn = this._mkActionBtn(ICO.Copy(11), T, function () {
      if (navigator.clipboard) navigator.clipboard.writeText(msg.content);
    });
    actions.appendChild(copyBtn);

    var vote = st.votes[msg.id];
    var upBtn = document.createElement('button');
    upBtn.innerHTML = ICO.ThumbsUp(11, vote === 'up');
    upBtn.style.cssText = 'padding:4px;border:none;background:transparent;cursor:pointer;border-radius:4px;color:' + (vote === 'up' ? '#16a34a' : T.textMuted) + ';transition:color 0.15s;';
    upBtn.addEventListener('mouseenter', function () { if (self._st.votes[msg.id] !== 'up') upBtn.style.color = '#16a34a'; });
    upBtn.addEventListener('mouseleave', function () { if (self._st.votes[msg.id] !== 'up') upBtn.style.color = T.textMuted; });
    upBtn.addEventListener('click', function () {
      self._st.votes[msg.id] = self._st.votes[msg.id] === 'up' ? null : 'up';
      self._renderMessages();
    });
    actions.appendChild(upBtn);

    var downBtn = document.createElement('button');
    downBtn.innerHTML = ICO.ThumbsDown(11, vote === 'down');
    downBtn.style.cssText = 'padding:4px;border:none;background:transparent;cursor:pointer;border-radius:4px;color:' + (vote === 'down' ? '#dc2626' : T.textMuted) + ';transition:color 0.15s;';
    downBtn.addEventListener('mouseenter', function () { if (self._st.votes[msg.id] !== 'down') downBtn.style.color = '#dc2626'; });
    downBtn.addEventListener('mouseleave', function () { if (self._st.votes[msg.id] !== 'down') downBtn.style.color = T.textMuted; });
    downBtn.addEventListener('click', function () {
      self._st.votes[msg.id] = self._st.votes[msg.id] === 'down' ? null : 'down';
      self._renderMessages();
    });
    actions.appendChild(downBtn);
    meta.appendChild(actions);
  }
  col.appendChild(meta);
  row.appendChild(col);
  wrap.appendChild(row);

  // Mobile inline carousel
  if (st.isMobile && msg.hasCards && msg.role === 'assistant' && st.cardData[msg.id]) {
    var carousel = this._buildMobileCarousel(st.cardData[msg.id].cards, msg.id);
    carousel.style.marginTop = '4px';
    wrap.appendChild(carousel);
  }
  return wrap;
};

JulesWidget.prototype._mkActionBtn = function (iconHtml, T, onClick) {
  var btn = document.createElement('button');
  btn.innerHTML = iconHtml;
  btn.style.cssText = 'padding:4px;border:none;background:transparent;cursor:pointer;border-radius:4px;color:' + T.textMuted + ';transition:color 0.15s;';
  btn.addEventListener('mouseenter', function () { btn.style.color = T.textSecondary; });
  btn.addEventListener('mouseleave', function () { btn.style.color = T.textMuted; });
  if (onClick) btn.addEventListener('click', onClick);
  return btn;
};

JulesWidget.prototype._buildTypingEl = function () {
  var T = this._theme();
  var wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;gap:10px;justify-content:flex-start;';
  var av = document.createElement('div');
  av.style.cssText = 'width:28px;height:28px;border-radius:8px;background:#0a6e82;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;';
  av.innerHTML = '<span style="color:white;display:inline-flex;">' + ICO.Bot(14) + '</span>';
  var dots = document.createElement('div');
  dots.style.cssText = 'display:flex;align-items:center;gap:4px;padding:12px 14px;';
  [0, 1, 2].forEach(function (i) {
    var d = document.createElement('span');
    d.className = 'jw-bounce-' + (i + 1);
    d.style.cssText = 'width:6px;height:6px;border-radius:50%;display:inline-block;background:' + T.textMuted + ';';
    dots.appendChild(d);
  });
  wrap.appendChild(av);
  wrap.appendChild(dots);
  return wrap;
};

// ─── Suggestions ──────────────────────────────────────────────────────────

JulesWidget.prototype._renderSuggestions = function () {
  var self = this;
  var st   = this._st;
  var T    = this._theme();
  var sugg = document.getElementById('jw-suggestions');
  if (!sugg) return;
  sugg.innerHTML = '';

  if (st.messages.length === 0) { sugg.style.display = 'none'; return; }
  sugg.style.display = '';
  sugg.style.cssText = 'flex-shrink:0;padding:' + (st.isMobile ? '12px 16px 8px' : '14px 16px 8px') + ';display:flex;gap:8px;overflow-x:auto;border-top:1px solid ' + (st.isDark ? 'rgba(77,196,206,0.18)' : 'rgba(10,110,130,0.13)') + ';';
  sugg.classList.add('jw-hide-scrollbar');

  SUGGESTIONS.forEach(function (s) {
    var chip = document.createElement('button');
    chip.textContent = s;
    chip.style.cssText = 'padding:6px 12px;border-radius:12px;font-size:10px;border:1px solid ' + T.accentDimBdr + ';color:' + T.textSecondary + ';background:transparent;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all 0.15s;';
    chip.addEventListener('mouseenter', function () { chip.style.borderColor = T.accentColor; chip.style.color = T.accentColor; chip.style.background = T.accentDimBg; });
    chip.addEventListener('mouseleave', function () { chip.style.borderColor = T.accentDimBdr; chip.style.color = T.textSecondary; chip.style.background = 'transparent'; });
    chip.addEventListener('click', function () { self._handleSend(s); });
    sugg.appendChild(chip);
  });
};

// ─── Input area ───────────────────────────────────────────────────────────

JulesWidget.prototype._buildInputArea = function (inputArea) {
  var self = this;
  var st   = this._st;
  var T    = this._theme();

  // Orbit wrapper
  var orbitOuter = document.createElement('div');
  orbitOuter.id = 'jw-orbit-outer';
  orbitOuter.style.cssText = 'position:relative;width:700px;max-width:calc(100% - 32px);border-radius:17px;padding:1.5px;background:transparent;overflow:hidden;';

  var orbit = document.createElement('div');
  orbit.id = 'jw-orbit';
  orbit.className = st.isDark ? 'jw-orbit-dark' : 'jw-orbit-light';
  orbit.style.cssText = 'position:absolute;inset:0;z-index:0;';
  orbitOuter.appendChild(orbit);

  var inputInner = document.createElement('div');
  inputInner.id = 'jw-input-inner';
  inputInner.style.cssText = [
    'position:relative;z-index:1;border-radius:15.5px;',
    'background:' + T.inputBg + ';',
    'transition:background 0.3s;',
    st.isMobile
      ? 'display:flex;flex-direction:row;align-items:center;gap:8px;padding:0 12px;height:54px;cursor:text;'
      : 'display:flex;flex-direction:column;gap:4px;padding:8px;height:98px;cursor:text;',
  ].join('');
  inputInner.addEventListener('click', function () {
    var ta = document.getElementById('jw-ta');
    if (ta) ta.focus();
  });

  // Textarea
  var ta = document.createElement('textarea');
  ta.id = 'jw-ta';
  ta.rows = 1;
  ta.placeholder = 'Bir şeyler sorun...';
  ta.className = 'jw-ta';
  ta.value = st.inputValue;
  ta.style.cssText = [
    'flex:1;width:100%;background:transparent;resize:none;outline:none;border:none;',
    'line-height:1.5;cursor:text;',
    'font-size:' + (st.isMobile ? '14px' : '12px') + ';',
    'color:' + T.textPrimary + ';',
    st.isMobile ? 'align-self:center;max-height:36px;overflow-y:auto;' : '',
    '--jw-placeholder:' + T.textMuted + ';',
  ].join('');

  ta.addEventListener('input', function () {
    self._st.inputValue = ta.value;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 112) + 'px';
    self._updateSendBtn();
  });
  ta.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); self._doSend(); }
  });

  // Inject placeholder style (replace existing to avoid accumulation)
  var phExist = document.getElementById('jw-ph-style');
  if (phExist && phExist.parentNode) phExist.parentNode.removeChild(phExist);
  var phStyle = document.createElement('style');
  phStyle.id = 'jw-ph-style';
  phStyle.textContent = '#jw-ta::placeholder { color: ' + T.textMuted + '; }';
  document.head.appendChild(phStyle);

  inputInner.appendChild(ta);

  // Actions row
  var actRow = document.createElement('div');
  actRow.id = 'jw-act-row';
  actRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;justify-content:flex-end;';

  // Panel toggle switch (desktop only)
  if (!st.isMobile) {
    actRow.appendChild(this._buildPanelSwitch());
  }

  // Mic button
  var micBtn = document.createElement('button');
  micBtn.innerHTML = ICO.Mic(16);
  micBtn.style.cssText = 'padding:6px;border-radius:8px;border:none;background:transparent;color:' + T.textMuted + ';cursor:pointer;transition:color 0.15s,background 0.15s;';
  micBtn.addEventListener('mouseenter', function () { micBtn.style.color = T.accentColor; micBtn.style.background = T.accentDimBg; });
  micBtn.addEventListener('mouseleave', function () { micBtn.style.color = T.textMuted; micBtn.style.background = 'transparent'; });
  actRow.appendChild(micBtn);

  // Send button
  var sendBtn = document.createElement('button');
  sendBtn.id = 'jw-send';
  sendBtn.innerHTML = ICO.ArrowUp(13);
  sendBtn.disabled = !st.inputValue.trim();
  sendBtn.style.cssText = 'display:flex;align-items:center;justify-content:center;color:white;background:#0a6e82;width:63px;border-radius:7px;padding:5px 0;border:none;cursor:pointer;transition:opacity 0.15s;' + (!st.inputValue.trim() ? 'opacity:0.4;cursor:not-allowed;' : '');
  sendBtn.addEventListener('click', function () { self._doSend(); });
  actRow.appendChild(sendBtn);
  inputInner.appendChild(actRow);
  orbitOuter.appendChild(inputInner);
  inputArea.appendChild(orbitOuter);

  // Footer brand row
  var footer = document.createElement('div');
  footer.id = 'jw-footer';
  footer.style.cssText = 'display:flex;align-items:center;justify-content:space-between;width:100%;max-width:700px;align-self:center;padding:8px 16px 2px;';
  this._buildFooter(footer, T);
  inputArea.appendChild(footer);
};

JulesWidget.prototype._buildPanelSwitch = function () {
  var self = this;
  var st   = this._st;
  var T    = this._theme();
  var border = T.border;
  var isPanelOpen = st.isPanelOpen;

  var wrap = document.createElement('button');
  wrap.id = 'jw-panel-switch';
  wrap.title = isPanelOpen ? 'Sonuçları gizle' : 'Sonuçları göster';
  wrap.disabled = st.panelSessions.length === 0;
  wrap.style.cssText = 'display:flex;align-items:center;border:none;background:transparent;cursor:pointer;padding:0;opacity:' + (st.panelSessions.length > 0 ? '1' : '0.28') + ';' + (st.panelSessions.length === 0 ? 'cursor:not-allowed;' : '');

  var track = document.createElement('div');
  track.style.cssText = [
    'position:relative;width:30px;height:16px;border-radius:3px;',
    'background:' + (isPanelOpen ? 'linear-gradient(180deg,#0a6e82 0%,#0d8fa6 100%)' : (st.isDark ? 'linear-gradient(180deg,#1a3247 0%,#1e3a55 100%)' : 'linear-gradient(180deg,#c0c0c0 0%,#d4d4d4 100%)')) + ';',
    'box-shadow:' + (isPanelOpen ? 'inset 0 2px 3px rgba(0,0,0,0.35),inset 0 -1px 1px rgba(255,255,255,0.12),0 0 6px rgba(10,110,130,0.3)' : 'inset 0 2px 3px rgba(0,0,0,0.22),inset 0 -1px 1px rgba(255,255,255,0.1)') + ';',
    'border:1px solid ' + (isPanelOpen ? '#076575' : border) + ';',
    'transition:background 0.2s;',
  ].join('');

  // Decorative lines left & right
  var linesHtml = '<div style="position:absolute;top:50%;transform:translateY(-50%);left:3px;display:flex;flex-direction:column;gap:2px;">' + [0,1,2].map(function(){return '<div style="width:4px;height:1px;background:rgba(255,255,255,0.3);border-radius:1px;"></div>';}).join('') + '</div>';
  linesHtml += '<div style="position:absolute;top:50%;transform:translateY(-50%);right:3px;display:flex;flex-direction:column;gap:2px;">' + [0,1,2].map(function(){return '<div style="width:4px;height:1px;background:rgba(0,0,0,0.15);border-radius:1px;"></div>';}).join('') + '</div>';

  var thumb = '<div style="position:absolute;top:2px;left:' + (isPanelOpen ? '15px' : '2px') + ';width:11px;height:10px;border-radius:2px;background:linear-gradient(180deg,#ffffff 0%,#e4e4e4 100%);box-shadow:0 1px 2px rgba(0,0,0,0.38),inset 0 1px 0 rgba(255,255,255,0.9);transition:left 0.18s cubic-bezier(0.4,0,0.2,1);display:flex;align-items:center;justify-content:center;"><div style="display:flex;flex-direction:column;gap:2px;">' + [0,1,2].map(function(){return '<div style="width:5px;height:1px;background:rgba(0,0,0,0.18);border-radius:1px;"></div>';}).join('') + '</div></div>';

  track.innerHTML = linesHtml + thumb;
  wrap.appendChild(track);
  wrap.addEventListener('click', function () { if (self._st.panelSessions.length > 0) self._handleTogglePanel(); });
  return wrap;
};

JulesWidget.prototype._buildFooter = function (footer, T) {
  var st = this._st;
  footer.innerHTML = '';

  // Left: Jules branding
  var left = document.createElement('div');
  left.style.cssText = 'display:flex;align-items:center;gap:8px;';
  left.innerHTML = '<div style="position:relative;">' +
    '<div style="width:24px;height:24px;border-radius:8px;background:#0a6e82;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.15);">' +
      '<span style="color:white;display:inline-flex;">' + ICO.Bot(12) + '</span>' +
    '</div>' +
    '<span style="position:absolute;bottom:-2px;right:-2px;width:8px;height:8px;background:#34d399;border-radius:50%;border:1.5px solid transparent;"></span>' +
  '</div>' +
  '<div>' +
    '<p style="font-weight:700;font-size:11px;color:' + T.textPrimary + ';line-height:1.2;margin:0;">JULES</p>' +
    '<p style="font-weight:500;font-size:9px;color:#34d399;line-height:1.2;margin:0;">Çevrimiçi</p>' +
  '</div>';
  footer.appendChild(left);

  // Center: disclaimer
  var center = document.createElement('p');
  center.style.cssText = 'font-size:10px;color:' + T.textMuted + ';text-align:center;line-height:' + (st.isMobile ? '1.6' : '1.4') + ';margin:0;';
  if (st.isMobile) {
    center.innerHTML = 'AI yanıtlar hata içerebilir.<br>Önemli bilgileri doğrulayın.';
  } else {
    center.textContent = 'AI yanıtlar hata içerebilir. Önemli bilgileri doğrulayın.';
  }
  footer.appendChild(center);

  // Right: Powered by Creator AI
  var right = document.createElement('div');
  right.style.cssText = 'display:flex;align-items:center;gap:4px;';
  right.innerHTML = '<span style="color:' + T.accentColor + ';display:inline-flex;flex-shrink:0;">' + ICO.Sparkles(9) + '</span>';
  var link = document.createElement('a');
  link.href = 'https://creator.com.tr';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Powered by Creator AI';
  link.style.cssText = 'font-weight:500;font-size:10px;color:' + (st.isDark ? '#6fa8bf' : '#6b7280') + ';text-decoration:underline;text-underline-offset:2px;transition:color 0.15s;';
  link.addEventListener('mouseenter', function () { link.style.color = '#34d399'; });
  link.addEventListener('mouseleave', function () { link.style.color = st.isDark ? '#6fa8bf' : '#6b7280'; });
  right.appendChild(link);
  footer.appendChild(right);
};

JulesWidget.prototype._updateSendBtn = function () {
  var btn = document.getElementById('jw-send');
  if (!btn) return;
  var hasVal = !!this._st.inputValue.trim();
  btn.disabled = !hasVal;
  btn.style.opacity = hasVal ? '1' : '0.4';
  btn.style.cursor  = hasVal ? 'pointer' : 'not-allowed';
};

// ─── Content Panel ────────────────────────────────────────────────────────

JulesWidget.prototype._updatePanelSlot = function () {
  var self = this;
  var st   = this._st;
  var T    = this._theme();
  var slot = document.getElementById('jw-cp-slot');
  if (!slot) return;

  if (!st.isPanelOpen) {
    slot.style.width  = '0';
    slot.style.height = '0';
    slot.style.overflow = 'hidden';
    slot.style.borderWidth = '0';
    slot.innerHTML = '';
    return;
  }
  slot.style.borderWidth = '';
  slot.style.overflow = '';
  if (st.isMobile) {
    slot.style.height = '50%';
    slot.style.width  = '100%';
  } else {
    slot.style.flex = '1';
    slot.style.height = '';
  }
  slot.innerHTML = '';
  slot.appendChild(this._buildContentPanel());
};

JulesWidget.prototype._buildContentPanel = function () {
  var self = this;
  var st   = this._st;
  var T    = this._theme();

  var panel = document.createElement('div');
  panel.style.cssText = 'display:flex;flex-direction:column;height:100%;background:transparent;transition:background 0.3s;';

  // Header
  var hdr = document.createElement('div');
  hdr.style.cssText = 'flex-shrink:0;background:' + (st.isDark ? 'rgba(14,31,44,0.55)' : 'rgba(255,255,255,0.55)') + ';border-bottom:1px solid ' + T.border + ';padding:' + (st.isMobile ? '8px 14px' : '14px 20px') + ';transition:background 0.3s,border-color 0.3s;';

  var hdrRow = document.createElement('div');
  hdrRow.style.cssText = 'display:flex;align-items:center;gap:8px;';

  // Close panel btn
  var closeBtn = document.createElement('button');
  closeBtn.title = 'Sonuçları gizle';
  closeBtn.innerHTML = ICO.ChevronRight(14);
  closeBtn.style.cssText = 'width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:8px;border:1px solid ' + T.accentDimBdr + ';background:' + T.accentDimBg + ';color:' + T.accentColor + ';cursor:pointer;transition:background 0.15s,color 0.15s;';
  closeBtn.addEventListener('mouseenter', function () { closeBtn.style.background = '#0a6e82'; closeBtn.style.color = '#fff'; closeBtn.style.borderColor = '#0a6e82'; });
  closeBtn.addEventListener('mouseleave', function () { closeBtn.style.background = T.accentDimBg; closeBtn.style.color = T.accentColor; closeBtn.style.borderColor = T.accentDimBdr; });
  closeBtn.addEventListener('click', function () { self._handleClosePanel(); });
  hdrRow.appendChild(closeBtn);

  var sep = document.createElement('div');
  sep.style.cssText = 'width:1px;height:16px;background:' + T.border + ';flex-shrink:0;';
  hdrRow.appendChild(sep);

  var totalResults = st.panelSessions.reduce(function (s, sess) { return s + sess.cards.length; }, 0);
  var totalFavCount = this._countFavs();

  var rightInfo = document.createElement('div');
  rightInfo.style.cssText = 'display:flex;align-items:center;gap:8px;min-width:0;flex:1;justify-content:flex-end;';

  rightInfo.innerHTML = '<span style="color:' + T.accentColor + ';display:inline-flex;flex-shrink:0;">' + ICO.Sparkles(10) + '</span>' +
    '<span style="font-size:10px;font-weight:600;color:' + T.accentColor + ';letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap;">AI Sonuçları</span>' +
    '<span style="font-size:9px;color:' + T.border + ';">·</span>' +
    '<span style="font-size:11px;color:' + T.textMuted + ';white-space:nowrap;">' + st.panelSessions.length + ' cevap · ' + totalResults + ' sonuç</span>';

  // Favorites toggle
  var favToggle = document.createElement('button');
  var showFavs = st.showFavorites;
  var hh = st.heartHover;
  var hasFavs = totalFavCount >= 1;
  var isRed = showFavs || hh || hasFavs;
  favToggle.style.cssText = 'display:flex;align-items:center;gap:4px;padding:' + (st.isMobile ? '3px 8px' : '3px 9px') + ';border-radius:20px;font-size:10px;font-weight:600;cursor:pointer;flex-shrink:0;transition:all 0.15s ease;border:1px solid ' + (isRed ? '#f87171' : T.border) + ';background:' + (isRed ? (st.isDark ? 'rgba(248,113,113,0.1)' : '#fff5f5') : 'transparent') + ';color:' + (isRed ? '#f87171' : T.textMuted) + ';';
  favToggle.innerHTML = '<span style="display:inline-flex;color:' + (isRed ? '#f87171' : T.textMuted) + ';">' + ICO.Heart(10, showFavs || (hh && hasFavs)) + '</span>' + (totalFavCount > 0 ? '<span>' + totalFavCount + '</span>' : '');
  favToggle.addEventListener('mouseenter', function () {
    self._st.heartHover = true;
    self._updatePanelSlot();
  });
  favToggle.addEventListener('mouseleave', function () {
    self._st.heartHover = false;
    self._updatePanelSlot();
  });
  favToggle.addEventListener('click', function () {
    self._st.showFavorites = !self._st.showFavorites;
    self._updatePanelSlot();
  });
  rightInfo.appendChild(favToggle);
  hdrRow.appendChild(rightInfo);
  hdr.appendChild(hdrRow);
  panel.appendChild(hdr);

  // Content scroll area
  var scroll = document.createElement('div');
  scroll.id = 'jw-cp-scroll';
  scroll.style.cssText = 'flex:1;min-height:0;overflow-y:auto;color-scheme:' + (st.isDark ? 'dark' : 'light') + ';';

  var bgSticky = st.isDark ? '#1a3247' : '#F2F2F3';

  if (st.panelSessions.length === 0) {
    scroll.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;text-align:center;padding:24px;">' +
      '<div style="width:48px;height:48px;border-radius:12px;background:' + (st.isDark ? '#1a3247' : '#f3f4f6') + ';display:flex;align-items:center;justify-content:center;">' + '<span style="color:' + T.textMuted + ';display:inline-flex;">' + ICO.Sparkles(18) + '</span></div>' +
      '<p style="font-size:14px;color:' + T.textMuted + ';">Henüz sonuç yok</p></div>';
  } else if (st.showFavorites) {
    var allFavs = this._getAllFavCards();
    var favSect = document.createElement('div');
    var favHdr = document.createElement('div');
    favHdr.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 20px;position:sticky;top:0;z-index:10;background:' + bgSticky + ';border-bottom:1px solid ' + T.border + ';';
    favHdr.innerHTML = '<span style="display:inline-flex;color:#f87171;">' + ICO.Heart(10) + '</span>' +
      '<span style="font-size:10px;font-weight:600;letter-spacing:0.06em;color:#f87171;text-transform:uppercase;">Favorilerim</span>' +
      '<div style="flex:1;height:1px;background:' + T.border + ';"></div>' +
      '<span style="font-size:10px;color:' + T.textMuted + ';">' + totalFavCount + ' kart</span>';
    favSect.appendChild(favHdr);
    var favGrid = document.createElement('div');
    favGrid.style.cssText = 'padding:16px;';
    if (allFavs.length === 0) {
      favGrid.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 0;gap:12px;text-align:center;"><span style="color:' + (st.isDark ? '#1d3547' : '#e5e7eb') + ';display:inline-flex;">' + ICO.Heart(24) + '</span><p style="font-size:14px;color:' + T.textMuted + ';">Henüz favori eklemediniz</p></div>';
    } else {
      var grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);column-gap:12px;row-gap:35px;';
      allFavs.forEach(function (f) {
        grid.appendChild(self._buildCardView(f.card, true, f.sessionId));
      });
      favGrid.appendChild(grid);
    }
    favSect.appendChild(favGrid);
    scroll.appendChild(favSect);
  } else {
    st.panelSessions.forEach(function (sess, idx) {
      var isActive = sess.id === st.activeCardMsgId;
      var isLast   = idx === st.panelSessions.length - 1;

      var sessSect = document.createElement('div');
      sessSect.id = 'jw-sess-' + sess.id;

      var sessHdr = document.createElement('div');
      sessHdr.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 20px;position:sticky;top:0;z-index:10;background:' + bgSticky + ';border-bottom:1px solid ' + T.border + ';';
      sessHdr.innerHTML = '<div style="display:flex;align-items:center;gap:6px;">' +
        '<span style="color:' + (isActive ? T.accentColor : T.textMuted) + ';display:inline-flex;">' + ICO.Clock(10) + '</span>' +
        '<span style="font-size:10px;font-weight:600;letter-spacing:0.06em;color:' + (isActive ? T.accentColor : T.textMuted) + ';text-transform:uppercase;">' + formatTime(sess.timestamp) + '</span>' +
      '</div>' +
      '<div style="flex:1;height:1px;background:' + T.border + ';"></div>' +
      '<span style="font-size:10px;font-weight:600;letter-spacing:0.06em;color:' + (isActive ? T.accentColor : T.textMuted) + ';text-transform:uppercase;">' + esc(sess.title) + '</span>' +
      (isActive ? '<div style="width:6px;height:6px;border-radius:50%;background:' + T.accentColor + ';"></div>' : '');
      sessSect.appendChild(sessHdr);

      var cardsWrap = document.createElement('div');
      cardsWrap.style.padding = '16px';
      var cardsGrid = document.createElement('div');
      cardsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);column-gap:12px;row-gap:35px;';
      sess.cards.forEach(function (card) {
        cardsGrid.appendChild(self._buildCardView(card, st.likedCards.has(sess.id + '-' + card.id), sess.id));
      });
      cardsWrap.appendChild(cardsGrid);
      sessSect.appendChild(cardsWrap);

      if (!isLast) {
        var sep2 = document.createElement('div');
        sep2.style.cssText = 'margin:0 20px 4px;border-top:1px solid ' + T.border + ';';
        sessSect.appendChild(sep2);
      }
      scroll.appendChild(sessSect);
    });

    // Scroll to active session
    if (st.scrollToSessionId) {
      var sid = st.scrollToSessionId;
      clearTimeout(self._timers.scrollToSess);
      self._timers.scrollToSess = setTimeout(function () {
        var el = document.getElementById('jw-sess-' + sid);
        var sc = document.getElementById('jw-cp-scroll');
        if (el && sc) {
          var top = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
          sc.scrollTo({ top: top, behavior: 'smooth' });
        }
        self._st.scrollToSessionId = null;
      }, 80);
    }
  }

  scroll.appendChild((function () { var d = document.createElement('div'); d.style.height = '16px'; return d; })());
  panel.appendChild(scroll);
  return panel;
};

// ─── CardView ─────────────────────────────────────────────────────────────

JulesWidget.prototype._buildCardView = function (card, liked, sessionId) {
  var self = this;
  var st   = this._st;
  var T    = this._theme();
  var bgCard      = st.isDark ? '#142230' : '#ffffff';
  var borderCard  = st.isDark ? '#1d3547' : '#e5e7eb';
  var borderHover = st.isDark ? '#2d5070' : '#b0b0b0';
  var textPrimary = st.isDark ? '#cfe8f4' : '#111827';
  var ctaBorder   = st.isDark ? '#2a4a5e' : '#d1d5db';
  var ctaText     = st.isDark ? '#6fa8bf' : '#555';
  var ac = T.accentColor;

  var wrap = document.createElement('div');
  wrap.className = 'jw-card-wrap';
  wrap.style.cssText = 'border-radius:3px;background:' + bgCard + ';border:1px solid ' + borderCard + ';overflow:hidden;display:flex;flex-direction:column;transition:background 0.3s,border-color 0.2s;cursor:default;';
  wrap.addEventListener('mouseenter', function () { wrap.style.borderColor = borderHover; });
  wrap.addEventListener('mouseleave', function () { wrap.style.borderColor = borderCard; });

  // Image
  var imgWrap = document.createElement('div');
  imgWrap.style.cssText = 'position:relative;overflow:hidden;aspect-ratio:4/3;';
  var img = document.createElement('img');
  img.src = card.image;
  img.alt = card.title;
  img.className = 'jw-card-img';
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
  imgWrap.appendChild(img);

  // Heart button
  var likeBtn = document.createElement('button');
  likeBtn.style.cssText = 'position:absolute;bottom:8px;right:8px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:transparent;border:none;padding:0;cursor:pointer;';
  var heartColor = liked ? '#f87171' : 'white';
  likeBtn.innerHTML = '<span style="color:' + heartColor + ';' + (liked ? '' : 'filter:drop-shadow(0 1px 2px rgba(0,0,0,0.35));') + 'display:inline-flex;">' + ICO.Heart(16, liked) + '</span>';
  likeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var key = sessionId + '-' + card.id;
    var next = new Set(self._st.likedCards);
    if (next.has(key)) next.delete(key); else next.add(key);
    self._st.likedCards = next;
    self._updatePanelSlot();
    self._updateFavBtn();
  });
  imgWrap.appendChild(likeBtn);
  wrap.appendChild(imgWrap);

  // Content
  var content = document.createElement('div');
  content.style.cssText = 'display:flex;flex-direction:column;gap:10px;padding:12px;';

  if (card.badge) {
    var badgeRow = document.createElement('div');
    badgeRow.style.cssText = 'display:flex;align-items:center;gap:6px;';
    badgeRow.innerHTML = '<div style="width:2px;height:10px;background:#4dc4ce;border-radius:1px;"></div><span style="font-size:9px;font-weight:700;letter-spacing:0.08em;color:#4dc4ce;text-transform:uppercase;">' + esc(card.badge) + '</span>';
    content.appendChild(badgeRow);
  }

  var title = document.createElement('p');
  title.style.cssText = 'font-weight:600;font-size:12px;letter-spacing:-0.01em;color:' + textPrimary + ';margin:0;';
  title.textContent = card.title;
  content.appendChild(title);

  var desc = document.createElement('p');
  desc.style.cssText = 'font-size:11px;color:' + textPrimary + ';line-height:1.6;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;';
  desc.textContent = card.description;
  content.appendChild(desc);

  var ctaWrap = document.createElement('div');
  var ctaBtn = document.createElement('button');
  ctaBtn.style.cssText = 'display:inline-flex;align-items:center;gap:4px;border-radius:3px;font-size:10px;font-weight:600;letter-spacing:0.03em;padding:4px 8px;border:1px solid ' + ctaBorder + ';background:transparent;color:' + ctaText + ';cursor:pointer;transition:all 0.15s;';
  ctaBtn.innerHTML = esc(card.cta || 'İncele') + ICO.ArrowUpRight(9);
  ctaBtn.addEventListener('mouseenter', function () { ctaBtn.style.borderColor = ac; ctaBtn.style.background = ac; ctaBtn.style.color = 'white'; });
  ctaBtn.addEventListener('mouseleave', function () { ctaBtn.style.borderColor = ctaBorder; ctaBtn.style.background = 'transparent'; ctaBtn.style.color = ctaText; });
  if (card.productId && this._onProductClick) {
    ctaBtn.addEventListener('click', function () { self._onProductClick(card.productId); });
  }
  ctaWrap.appendChild(ctaBtn);
  content.appendChild(ctaWrap);
  wrap.appendChild(content);
  return wrap;
};

// ─── Mobile Carousel ──────────────────────────────────────────────────────

JulesWidget.prototype._buildMobileCarousel = function (cards, sessionId) {
  var self = this;
  var st   = this._st;
  var T    = this._theme();
  var ac   = T.accentColor;

  var outer = document.createElement('div');
  outer.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:10px;';

  var track = document.createElement('div');
  track.style.cssText = 'display:flex;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;gap:12px;width:100%;padding-left:14%;padding-right:14%;box-sizing:border-box;scroll-padding-left:14%;';
  track.classList.add('jw-hide-scrollbar');

  var cardRefs = [];
  var activeIndex = st.activeCardIndices[sessionId] || 0;

  cards.forEach(function (card) {
    var slide = document.createElement('div');
    slide.style.cssText = 'flex-shrink:0;width:72%;scroll-snap-align:center;';
    slide.appendChild(self._buildCardView(card, st.likedCards.has(sessionId + '-' + card.id), sessionId));
    cardRefs.push(slide);
    track.appendChild(slide);
  });

  // Dots
  var dotsRow = document.createElement('div');
  dotsRow.style.cssText = 'display:flex;align-items:center;gap:6px;';
  var dots = [];

  function updateDots(idx) {
    dots.forEach(function (d, i) {
      d.style.width    = i === idx ? '16px' : '6px';
      d.style.background = i === idx ? ac : (st.isDark ? '#3a6075' : '#9ca3af');
    });
  }

  cards.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.style.cssText = 'height:6px;border-radius:3px;border:none;padding:0;cursor:pointer;transition:all 0.25s ease;width:' + (i === activeIndex ? '16px' : '6px') + ';background:' + (i === activeIndex ? ac : (st.isDark ? '#3a6075' : '#9ca3af')) + ';';
    dot.addEventListener('click', function () {
      var cardEl = cardRefs[i];
      if (!cardEl) return;
      var center = cardEl.offsetLeft + cardEl.offsetWidth / 2;
      track.scrollTo({ left: center - track.clientWidth / 2, behavior: 'smooth' });
      self._st.activeCardIndices[sessionId] = i;
      updateDots(i);
    });
    dots.push(dot);
    dotsRow.appendChild(dot);
  });

  track.addEventListener('scroll', function () {
    var containerCenter = track.scrollLeft + track.clientWidth / 2;
    var closest = 0, closestDist = Infinity;
    cardRefs.forEach(function (card, i) {
      var cardCenter = card.offsetLeft + card.offsetWidth / 2;
      var dist = Math.abs(cardCenter - containerCenter);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    self._st.activeCardIndices[sessionId] = closest;
    updateDots(closest);
  });

  outer.appendChild(track);
  outer.appendChild(dotsRow);
  return outer;
};

// ─── Favorites drawer (mobile) ────────────────────────────────────────────

JulesWidget.prototype._renderFavDrawer = function () {
  var self = this;
  var st   = this._st;
  var T    = this._theme();

  var existing = document.getElementById('jw-fav-drawer');
  if (existing) existing.parentNode.removeChild(existing);

  if (!st.showFavDrawer) return;

  var allFavs = this._getAllFavCards();
  var totalFavCount = allFavs.length;

  var overlay = document.createElement('div');
  overlay.id = 'jw-fav-drawer';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.5);backdrop-filter:blur(2px);display:flex;flex-direction:column;justify-content:flex-end;';
  overlay.addEventListener('click', function () { st.showFavDrawer = false; self._renderFavDrawer(); });

  var sheet = document.createElement('div');
  sheet.style.cssText = 'background:' + (st.isDark ? '#0c1c28' : '#ffffff') + ';border-radius:20px 20px 0 0;height:75vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -8px 40px rgba(0,0,0,0.25);transform:translateY(' + st.drawerDragY + 'px);transition:' + (st.drawerDragY === 0 ? 'transform 0.3s cubic-bezier(0.32,0.72,0,1)' : 'none') + ';';
  sheet.addEventListener('click', function (e) { e.stopPropagation(); });

  // Drag handle
  var handle = document.createElement('div');
  handle.style.cssText = 'display:flex;justify-content:center;padding:10px 0 8px;cursor:grab;touch-action:none;';
  handle.innerHTML = '<div style="width:36px;height:4px;border-radius:2px;background:' + (st.isDark ? '#1d3547' : '#e5e7eb') + ';"></div>';
  handle.addEventListener('touchstart', function (e) { self._drawerTouchStartY = e.touches[0].clientY; st.drawerDragY = 0; }, { passive: true });
  handle.addEventListener('touchmove', function (e) {
    var dy = e.touches[0].clientY - self._drawerTouchStartY;
    if (dy > 0) { st.drawerDragY = dy; sheet.style.transform = 'translateY(' + dy + 'px)'; }
  }, { passive: true });
  handle.addEventListener('touchend', function () {
    if (st.drawerDragY > 80) { st.showFavDrawer = false; st.drawerDragY = 0; self._renderFavDrawer(); }
    else { st.drawerDragY = 0; sheet.style.transform = 'translateY(0)'; sheet.style.transition = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)'; }
  });
  sheet.appendChild(handle);

  // Drawer header
  var dhdr = document.createElement('div');
  dhdr.style.cssText = 'padding:10px 16px 12px;border-bottom:1px solid ' + T.border + ';display:flex;align-items:center;justify-content:space-between;flex-shrink:0;';
  var dleft = document.createElement('div');
  dleft.style.cssText = 'display:flex;align-items:center;gap:8px;';
  dleft.innerHTML = '<span style="display:inline-flex;color:#f87171;">' + ICO.Heart(14, true) + '</span>' +
    '<span style="font-size:14px;font-weight:600;color:' + T.textPrimary + ';">Favorilerim</span>' +
    (totalFavCount > 0 ? '<span style="font-size:10px;font-weight:600;color:#f87171;background:' + (st.isDark ? 'rgba(248,113,113,0.12)' : '#fff5f5') + ';border:1px solid #fca5a5;border-radius:20px;padding:1px 7px;">' + totalFavCount + '</span>' : '');
  dhdr.appendChild(dleft);

  var closeBtn = document.createElement('button');
  closeBtn.innerHTML = ICO.PhosphorX(16);
  closeBtn.style.cssText = 'color:' + T.textMuted + ';background:' + (st.isDark ? '#1a3247' : '#f3f4f6') + ';border:none;border-radius:8px;cursor:pointer;padding:5px;display:flex;align-items:center;justify-content:center;';
  closeBtn.addEventListener('click', function () { st.showFavDrawer = false; self._renderFavDrawer(); });
  dhdr.appendChild(closeBtn);
  sheet.appendChild(dhdr);

  // Drawer content
  var dcontent = document.createElement('div');
  dcontent.style.cssText = 'overflow-y:auto;flex:1;';
  if (allFavs.length === 0) {
    dcontent.innerHTML = '<div style="padding:40px 24px;text-align:center;">' +
      '<span style="color:' + (st.isDark ? '#1d3547' : '#e5e7eb') + ';display:inline-flex;margin-bottom:12px;">' + ICO.Heart(32) + '</span>' +
      '<p style="font-size:14px;color:' + T.textMuted + ';margin-bottom:6px;">Henüz favori eklemediniz</p>' +
      '<p style="font-size:12px;color:' + (st.isDark ? '#2a4a5e' : '#d1d5db') + ';">Kartların üzerindeki ♥ ikonuna dokunun</p></div>';
  } else {
    var grid = document.createElement('div');
    grid.style.cssText = 'padding:12px 14px 20px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px;';
    allFavs.forEach(function (f) {
      grid.appendChild(self._buildCardView(f.card, true, f.sessionId));
    });
    dcontent.appendChild(grid);
  }
  sheet.appendChild(dcontent);
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
};

// ─── Emoji cycling ────────────────────────────────────────────────────────

JulesWidget.prototype._startEmojiCycle = function () {
  var self = this;
  function cycle() {
    self._timers.emojiHold = setTimeout(function () {
      self._st.emojiPhase = 'out';
      self._updateEmoji();
      self._timers.emojiOut = setTimeout(function () {
        self._st.emojiIndex = (self._st.emojiIndex + 1) % EMOJIS.length;
        self._st.emojiPhase = 'in';
        self._updateEmoji();
        self._timers.emojiIn = setTimeout(function () {
          self._st.emojiPhase = 'visible';
          self._updateEmoji();
          cycle();
        }, 180);
      }, 180);
    }, 1088);
  }
  cycle();
};

JulesWidget.prototype._updateEmoji = function () {
  var inner = document.getElementById('jw-emoji-inner');
  if (!inner) return;
  inner.innerHTML = '';
  inner.appendChild(this._buildEmojiContent());
};

// ─── Weather ──────────────────────────────────────────────────────────────

JulesWidget.prototype._fetchWeather = function () {
  var self = this;
  function fallback() {
    self._st.weatherInfo = { temp: 13, code: 2, sunrise: '06:48', sunset: '18:23' };
    self._rebuildHeader();
  }
  if (!navigator.geolocation) { fallback(); return; }
  navigator.geolocation.getCurrentPosition(function (pos) {
    var lat = pos.coords.latitude, lon = pos.coords.longitude;
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto&forecast_days=1';
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      self._st.weatherInfo = {
        temp:    Math.round(data.current.temperature_2m),
        code:    data.current.weather_code,
        sunrise: data.daily.sunrise[0].split('T')[1].slice(0, 5),
        sunset:  data.daily.sunset[0].split('T')[1].slice(0, 5),
      };
      self._rebuildHeader();
    }).catch(fallback);
  }, fallback);
};

JulesWidget.prototype._rebuildHeader = function () {
  var header = document.getElementById('jw-header');
  if (!header) return;
  this._buildHeader(header);
};

// ─── Chat logic ───────────────────────────────────────────────────────────

JulesWidget.prototype._doSend = function () {
  var ta = document.getElementById('jw-ta');
  var text = ta ? ta.value.trim() : this._st.inputValue.trim();
  if (!text) return;
  if (ta) { ta.value = ''; ta.style.height = 'auto'; }
  this._st.inputValue = '';
  this._updateSendBtn();
  this._handleSend(text);
};

JulesWidget.prototype._handleSend = function (text) {
  var self = this;
  var st   = this._st;

  var userMsg = { id: genId(), role: 'user', content: text, timestamp: new Date() };
  st.messages.push(userMsg);
  st.isTyping = true;
  this._renderMessages();
  this._renderSuggestions();

  var lower = text.toLowerCase();
  var matched = null;
  for (var i = 0; i < SCENARIOS.length; i++) {
    var sc = SCENARIOS[i];
    for (var j = 0; j < sc.keywords.length; j++) {
      if (lower.indexOf(sc.keywords[j]) !== -1) { matched = sc; break; }
    }
    if (matched) break;
  }

  var delay = 1200 + Math.random() * 800;
  clearTimeout(this._timers.typing);
  this._timers.typing = setTimeout(function () {
    st.isTyping = false;
    var botId = genId();
    var botMsg = {
      id: botId, role: 'assistant',
      content: matched ? matched.reply : DEFAULT_REPLIES[st.defaultReplyIndex++ % DEFAULT_REPLIES.length],
      timestamp: new Date(),
      hasCards: !!matched,
      cardLabel: matched ? matched.cardLabel : undefined,
    };
    st.messages.push(botMsg);
    self._renderMessages();
    self._renderSuggestions();

    if (matched) {
      st.cardData[botId] = { cards: matched.cards, title: matched.panelTitle || 'Sonuçlar' };
      clearTimeout(self._timers.cards);
      self._timers.cards = setTimeout(function () {
        st.activeCardMsgId = botId;
        st.panelSessions.push({ id: botId, cards: matched.cards, title: matched.panelTitle || 'Sonuçlar', timestamp: new Date() });
        if (!st.isMobile) {
          st.isPanelOpen = true;
          self._applyPanelLayout();
          self._updatePanelSlot();
        }
        self._rebuildHeader();
        self._refreshPanelSwitch();
        self._renderMessages(); // re-render to show show-cards button
      }, 300);
    }
  }, delay);
};

JulesWidget.prototype._handleShowCards = function (msgId) {
  var st = this._st;
  st.activeCardMsgId = msgId;
  st.isPanelOpen = true;
  var data = st.cardData[msgId];
  if (data) {
    var exists = false;
    for (var i = 0; i < st.panelSessions.length; i++) {
      if (st.panelSessions[i].id === msgId) { exists = true; break; }
    }
    if (!exists) st.panelSessions.push({ id: msgId, cards: data.cards, title: data.title, timestamp: new Date() });
    st.scrollToSessionId = msgId;
  }
  this._applyPanelLayout();
  this._updatePanelSlot();
  this._renderMessages();
  this._refreshPanelSwitch();
};

JulesWidget.prototype._handleClosePanel = function () {
  this._st.activeCardMsgId = null;
  this._st.isPanelOpen = false;
  this._applyPanelLayout();
  this._updatePanelSlot();
  this._renderMessages();
  this._rebuildHeader();
  this._refreshPanelSwitch();
};

JulesWidget.prototype._handleTogglePanel = function () {
  var st = this._st;
  if (st.isPanelOpen) {
    this._handleClosePanel();
  } else if (st.panelSessions.length > 0) {
    st.isPanelOpen = true;
    if (!st.activeCardMsgId && st.panelSessions.length > 0) {
      st.activeCardMsgId = st.panelSessions[st.panelSessions.length - 1].id;
    }
    this._applyPanelLayout();
    this._updatePanelSlot();
    this._rebuildHeader();
    this._refreshPanelSwitch();
  }
};

JulesWidget.prototype._refreshPanelSwitch = function () {
  var st = this._st;
  var sw = document.getElementById('jw-panel-switch');
  if (!sw) return;
  var T = this._theme();
  var border = T.border;
  var isPanelOpen = st.isPanelOpen;
  sw.disabled = st.panelSessions.length === 0;
  sw.style.opacity = st.panelSessions.length > 0 ? '1' : '0.28';
  sw.style.cursor  = st.panelSessions.length > 0 ? 'pointer' : 'not-allowed';
  var track = sw.querySelector('div');
  if (!track) return;
  track.style.background = isPanelOpen
    ? 'linear-gradient(180deg,#0a6e82 0%,#0d8fa6 100%)'
    : (st.isDark ? 'linear-gradient(180deg,#1a3247 0%,#1e3a55 100%)' : 'linear-gradient(180deg,#c0c0c0 0%,#d4d4d4 100%)');
  track.style.boxShadow = isPanelOpen
    ? 'inset 0 2px 3px rgba(0,0,0,0.35),inset 0 -1px 1px rgba(255,255,255,0.12),0 0 6px rgba(10,110,130,0.3)'
    : 'inset 0 2px 3px rgba(0,0,0,0.22),inset 0 -1px 1px rgba(255,255,255,0.1)';
  track.style.borderColor = isPanelOpen ? '#076575' : border;
  var thumb = track.children[2];
  if (thumb) thumb.style.left = isPanelOpen ? '15px' : '2px';
};

// ─── Layout updates ───────────────────────────────────────────────────────

JulesWidget.prototype._applyPanelLayout = function () {
  var st   = this._st;
  var chat = document.getElementById('jw-chat');
  var slot = document.getElementById('jw-cp-slot');
  if (!chat || !slot) return;
  if (st.isMobile) {
    chat.style.height = st.isPanelOpen ? '50%' : '100%';
    chat.style.width  = '100%';
  } else {
    chat.style.width = st.isPanelOpen ? '420px' : '100%';
    chat.style.height = '';
  }
};

JulesWidget.prototype._applyOpenState = function () {
  var bd  = document.getElementById('jw-backdrop');
  var wp  = document.getElementById('jw-panel');
  var st  = this._st;
  if (bd) {
    bd.style.opacity = st.isOpen ? '1' : '0';
    bd.style.pointerEvents = st.isOpen ? 'all' : 'none';
  }
  if (wp) {
    wp.style.opacity = st.isOpen ? '1' : '0';
    wp.style.transform = st.isOpen ? 'translateY(0)' : 'translateY(-18px)';
    wp.style.pointerEvents = st.isOpen ? 'all' : 'none';
  }
  var root = this._root;
  if (root) root.style.pointerEvents = st.isOpen ? 'all' : 'none';
};

JulesWidget.prototype._applyTheme = function () {
  this._rebuildPanel();
  this._applyOpenState();
};

JulesWidget.prototype._updateFavBtn = function () {
  this._rebuildHeader();
};

// ─── Resize ───────────────────────────────────────────────────────────────

JulesWidget.prototype._onResize = function () {
  var wasMobile = this._st.isMobile;
  this._st.isMobile = window.innerWidth < 768;
  if (wasMobile !== this._st.isMobile) {
    if (this._st.isMobile && this._st.isPanelOpen) {
      this._st.isPanelOpen = false;
      this._st.activeCardMsgId = null;
    }
    this._rebuildPanel();
    this._applyOpenState();
  }
};

// ─── Scroll lock ──────────────────────────────────────────────────────────

JulesWidget.prototype._lockScroll = function () {
  var scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + scrollY + 'px';
  document.body.style.width = '100%';
  document.body.dataset.scrollY = scrollY;
};

JulesWidget.prototype._unlockScroll = function () {
  var scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);
};

// ─── Helpers ──────────────────────────────────────────────────────────────

JulesWidget.prototype._countFavs = function () {
  return this._st.likedCards.size;
};

JulesWidget.prototype._getAllFavCards = function () {
  var st = this._st;
  var result = [];
  st.panelSessions.forEach(function (s) {
    s.cards.forEach(function (c) {
      if (st.likedCards.has(s.id + '-' + c.id)) {
        result.push({ card: c, sessionId: s.id, sessionTitle: s.title });
      }
    });
  });
  return result;
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export { JulesWidget };
