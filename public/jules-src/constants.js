/**
 * constants.js — Uygulama sabitleri
 */

export const EMOJIS = ['👋🏼', '🖖🏼', 'BOT_ICON', '👇🏼', '👍🏼', '🙏🏼', '🤝🏼', '👏🏼'];

export const TW_PHRASES = [
  'iPhone 16 ile 16 Pro arasındaki fark nedir?',
  'MacBook Air mı Pro mu almalıyım?',
  'Servis randevusu nasıl alırım?',
  'En uygun fiyatlı iPhone hangisi?',
  'Ekran tamiri ne kadar sürer?',
  'AppleCare+ almadan garanti kaç yıl?',
  'iPad Air ile MacBook hangisi daha iyi?',
  'iPhone 15 Pro hâlâ alınır mı?',
];

export const MINI_TW_PHRASES = [
  'iPhone 16 Pro?',
  'Mac Air mı, Pro mu?',
  'iPad modelleri',
  'Servis randevusu',
  'AppleCare+ nedir?',
  'Garantim doldu?',
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
    'iPhone modelleri',
    'Mac modelleri',
    'iPad modelleri',
    'Servis randevusu',
  ],
  defaultReplies: [
    'Elbette! Apple ürünleri hakkında her konuda size yardımcı olmaya hazırım. Hangi ürün veya özellik ilginizi çekiyor?',
    'Harika bir soru! Apple ekosistemi hakkında size en doğru ve güncel bilgileri getiriyorum, bir an lütfen.',
    'Tabii ki! iPhone\'dan Mac\'e, AirPods\'tan Apple Watch\'a — tüm konularda yardım etmek için buradayım.',
    'Mükemmel! Size en uygun Apple ürününü bulmak için hemen inceliyorum. Kullanım alışkanlıklarınızı anlatır mısınız?',
  ],
};

export const DEFAULT_CARDS = { datasets: {}, scenarios: [] };

/**
 * FORM_CONFIG — Her form tipi için başlık, alanlar ve bot yanıtı.
 * Yeni form tipi eklenince yalnızca bu dosya güncellenir.
 * handlers.js ve render-form.js bu yapıyı referans alır.
 */
export const FORM_CONFIG = {
  anaform: {
    title:  'İLETİŞİM FORMU',
    fields: ['adSoyad', 'eposta', 'telefon', 'mesaj'],
    reply:  'Sizi daha iyi tanıyabilmek için bilgilerinizi paylaşır mısınız?',
  },
  adsoyad: {
    title:  'KİMLİK BİLGİSİ',
    fields: ['adSoyad'],
    reply:  'Adınızı ve soyadınızı öğrenebilir miyim?',
  },
  eposta: {
    title:  'E-POSTA',
    fields: ['eposta'],
    reply:  'E-posta adresinizi alabilir miyim?',
  },
};

/**
 * FIELD_META — Alan tanımları.
 */
export const FIELD_META = {
  adSoyad: { label: 'AD SOYAD', type: 'text',  placeholder: 'Adınız Soyadınız',   required: true,  autocomplete: 'name'  },
  eposta:  { label: 'E-POSTA',  type: 'email', placeholder: 'ornek@mail.com',      required: true,  autocomplete: 'email' },
  telefon: { label: 'TELEFON',  type: 'tel',   placeholder: '05XX XXX XX XX',      required: false, autocomplete: 'tel'   },
  mesaj:   { label: 'MESAJ',    type: 'area',  placeholder: 'Mesajınızı yazın...', required: true,  autocomplete: 'off'   },
};