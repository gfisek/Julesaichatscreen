/**
 * constants.js — Uygulama sabitleri
 */

export const EMOJIS = ['👋🏼', '🖖🏼', 'BOT_ICON', '👇🏼', '👍🏼', '🙏🏼', '🤝🏼', '👏🏼'];

export const TW_PHRASES = [
  'Bir şeyler sorun...',
  'Seyahat planı yap...',
  'Fiyat karşılaştır...',
  'Hafta sonu nereye gideyim?',
  'Trend ürünleri göster...',
  'Yakınımdaki kafeler...',
];

export const DEFAULT_CONFIG = {
  branding: {
    name: 'JULES',
    poweredBy: 'Powered by Creator AI',
    poweredByUrl: 'https://creator.com.tr',
  },
  colors: {
    primary: '#1c3d54',
    secondary: '#0a6e82',
    accent: '#1ba3b8',
    accentLight: '#4dc4ce',
    accentBg: '#e6f7f9',
  },
  font: { family: 'inherit' },
  suggestions: [
    'İstanbul\'da otel öner',
    'Bütçeme uygun seçenekler',
    'En iyi restoranlar',
    'Çok satan ürünler',
  ],
  defaultReplies: [
    'Anlıyorum! Size daha iyi yardımcı olabilmem için biraz daha bilgi verir misiniz?',
    'Harika bir soru! Bu konuda size yardımcı olmak için birkaç seçenek hazırlıyorum...',
    'Tabii ki! En güncel bilgileri getiriyorum, bir an lütfen.',
    'Mükemmel! Sizin için en uygun seçenekleri analiz ediyorum.',
  ],
};

export const DEFAULT_CARDS = { datasets: {}, scenarios: [] };
