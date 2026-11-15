/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JournalArticle, Product } from '../types';
import {
  HERO_IMAGE,
  YARD300_BRAND_LOGO,
  JOURNAL_MINDSET_IMAGE,
  JOURNAL_GEAR_IMAGE,
  JOURNAL_RECOVERY_IMAGE,
  RYU_COMBAT_VIDEO,
  REN_COMBAT_VIDEO,
  KIRA_COMBAT_VIDEO,
  YARD_BAZARUTO_RESORT_IMAGE,
  YARD_ISLAND_AERIAL_NIGHT_IMAGE,
  FOUNDER_YAM_SUW_IMAGE,
  FOUNDER_MTK_IMAGE,
  FOUNDER_ARB_IMAGE,
  getProducts
} from '../constants';

export interface SiteSectionConfig {
  id: string;
  nameEn: string;
  nameAr: string;
  category: 'core' | 'combat' | 'gear' | 'community';
  enabled: boolean;
  order: number;
}

export interface PaymentGatewayConfig {
  id: 'metamask' | 'usdt_direct' | 'credit_card' | 'applepay' | 'googlepay' | 'paypal' | 'bank_transfer' | 'cod';
  nameEn: string;
  nameAr: string;
  enabled: boolean;
  badgeEn: string;
  badgeAr: string;
  feeOrDiscountNoteEn?: string;
  feeOrDiscountNoteAr?: string;
}

export interface SitePaymentSettings {
  treasuryEthAddress: string;
  treasuryTrc20Address: string;
  treasurySolanaAddress: string;
  gateways: PaymentGatewayConfig[];
  cryptoDiscountPercent: number;
  noticeEn: string;
  noticeAr: string;
}

export interface SiteVideoItem {
  id: string;
  titleEn: string;
  titleAr: string;
  url: string;
  posterUrl?: string;
  type: 'mp4' | 'youtube' | 'embed';
  tag: string;
  featuredIn: 'hero' | 'arena' | 'engine' | 'gallery';
}

export interface SiteMediaConfig {
  heroImage: string;
  heroBanner: string;
  brandLogo: string;
  productImageOverrides: Record<string, string>; // productId -> imageUrl
}

export interface SiteAnnouncementConfig {
  enabled: boolean;
  textEn: string;
  textAr: string;
  badgeEn: string;
  badgeAr: string;
  link?: string;
  colorTheme: 'red' | 'cyan' | 'gold' | 'emerald';
}

export interface CustomArticleData {
  id: number;
  titleEn: string;
  titleAr: string;
  dateEn: string;
  dateAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  image: string;
  category: string;
  author: string;
}

export interface HeroTextOverrides {
  badgeEn?: string;
  badgeAr?: string;
  title1En?: string;
  title2En?: string;
  title3En?: string;
  title4En?: string;
  title1Ar?: string;
  title2Ar?: string;
  title3Ar?: string;
  title4Ar?: string;
  subtitleEn?: string;
  subtitleAr?: string;
  kpi1Value?: string;
  kpi2Value?: string;
  kpi3Value?: string;
}

export interface ProductOverrideItem {
  name?: string;
  price?: number;
  originalPrice?: number;
  tagline?: string;
  description?: string;
  disabled?: boolean;
}

export interface ResortOverrideConfig {
  openingDateEn: string;
  openingDateAr: string;
  titleEn: string;
  titleAr: string;
  subtitleHighlightEn: string;
  subtitleHighlightAr: string;
  overviewEn: string;
  overviewAr: string;
  architectName: string;
  heroPanoramaImage: string;
  aerialNightImage: string;
}

export interface FounderOverrideItem {
  name?: string;
  nameAr?: string;
  role?: string;
  roleAr?: string;
  image?: string;
}

export interface BrandSiteSettings {
  clubMembershipPrice: number;
  campCapacity: number;
  footerTaglineEn: string;
  footerTaglineAr: string;
  contactEmail: string;
  instagramHandle: string;
  instagramUrl: string;
  xHandle: string;
  xUrl: string;
  founderOverrides: Record<string, FounderOverrideItem>;
}

export interface OwnerSiteConfig {
  media: SiteMediaConfig;
  sections: SiteSectionConfig[];
  payments: SitePaymentSettings;
  videos: SiteVideoItem[];
  articles: CustomArticleData[];
  announcement: SiteAnnouncementConfig;
  heroText: HeroTextOverrides;
  productOverrides: Record<string, ProductOverrideItem>;
  resort: ResortOverrideConfig;
  siteSettings: BrandSiteSettings;
  ownerPin: string;
}

const STORAGE_KEY = 'yard300_owner_site_config_v2';
const CONFIG_CHANGE_EVENT = 'yard300_owner_config_updated';

export const DEFAULT_SITE_SECTIONS: SiteSectionConfig[] = [
  { id: 'yardEngine', nameEn: 'Biometric & Injury AI Engine', nameAr: 'محرك المؤشرات والتنبؤ بالإصابات', category: 'core', enabled: true, order: 1 },
  { id: 'sleepStudies', nameEn: 'Sleep Architecture Lab', nameAr: 'مختبر دراسات النوم والتعافي', category: 'core', enabled: true, order: 2 },
  { id: 'injuryPrediction', nameEn: 'ACWR Injury Prediction', nameAr: 'خوارزمية حماية الأوتار ACWR', category: 'core', enabled: true, order: 3 },
  { id: 'arena', nameEn: 'Combat Arena & Boxing Dojo', nameAr: 'حلبة النزالات والملاكمة التفاعلية', category: 'combat', enabled: true, order: 4 },
  { id: 'ai-coach', nameEn: 'Aura AI Sensei Coach', nameAr: 'المدرب الذكي بالذكاء الاصطناعي', category: 'combat', enabled: true, order: 5 },
  { id: 'products', nameEn: 'Combat Gear & Wearables', nameAr: 'متجر العتاد والملابس الحصرية', category: 'gear', enabled: true, order: 6 },
  { id: 'customClub', nameEn: 'Athletic Creator Clubs ($30)', nameAr: 'النادي الرياضي الخاص ($30)', category: 'community', enabled: true, order: 7 },
  { id: 'leaderboard', nameEn: 'Global Combat Leaderboard', nameAr: 'قائمة المتصدرين العالمية', category: 'combat', enabled: true, order: 8 },
  { id: 'journal', nameEn: 'Warrior Journal & Editorial', nameAr: 'مجلة المحارب والمقالات', category: 'community', enabled: true, order: 9 },
  { id: 'tickets', nameEn: 'World Tour Tickets & Events', nameAr: 'تذاكر البطولات والفعاليات', category: 'community', enabled: true, order: 10 },
  { id: 'about', nameEn: 'Founders & Brand Heritage', nameAr: 'المؤسسون وفلسفة البراند', category: 'community', enabled: true, order: 11 }
];

export const DEFAULT_PAYMENT_CONFIG: SitePaymentSettings = {
  treasuryEthAddress: '0x8C7Fcba5c8A96c6F9A83f077606A0911a949a93E',
  treasuryTrc20Address: 'TN3W4H6rK2KEi83TZ865hW9gkAmNW8nEDv',
  treasurySolanaAddress: '7Xw8P2f6CgVv9wH2gZJkLpMqR3sT5uW8yN1oP4rS6eT',
  cryptoDiscountPercent: 5,
  noticeEn: 'Official Merchant Treasury: Instant verification on Ethereum, Polygon & TRC20 networks.',
  noticeAr: 'خزينة التاجر المعتمدة: تأكيد فوري عبر شبكات إيثيريوم وبوليجون وTRC20.',
  gateways: [
    {
      id: 'metamask',
      nameEn: 'MetaMask / Web3 Crypto',
      nameAr: 'محفظة ميتا ماسك Web3',
      enabled: true,
      badgeEn: 'Zero Gas Delay',
      badgeAr: 'دفع مشفر فوري',
      feeOrDiscountNoteEn: '5% Instant Cash Discount',
      feeOrDiscountNoteAr: 'خصم مباشر 5%'
    },
    {
      id: 'usdt_direct',
      nameEn: 'USDT Direct Transfer (TRC20 / ERC20)',
      nameAr: 'تحويل USDT مباشر (TRC20 / ERC20)',
      enabled: true,
      badgeEn: 'QR & Address',
      badgeAr: 'عنوان مباشر ورمز QR',
      feeOrDiscountNoteEn: '5% Crypto Discount',
      feeOrDiscountNoteAr: 'خصم 5% مباشر'
    },
    {
      id: 'credit_card',
      nameEn: 'Credit & Debit Cards (Visa, MasterCard)',
      nameAr: 'البطاقات الائتمانية والبنكية (فيزا، ماستركارد)',
      enabled: true,
      badgeEn: '256-Bit SSL',
      badgeAr: 'مشفر بمعايير البنوك',
      feeOrDiscountNoteEn: 'Standard Checkout',
      feeOrDiscountNoteAr: 'دفع قياسي'
    },
    {
      id: 'applepay',
      nameEn: 'Apple Pay',
      nameAr: 'أبل باي (Apple Pay)',
      enabled: true,
      badgeEn: '1-Click Touch ID',
      badgeAr: 'دفع بلمسة واحدة',
      feeOrDiscountNoteEn: 'Fast & Secure',
      feeOrDiscountNoteAr: 'سريع وآمن'
    },
    {
      id: 'googlepay',
      nameEn: 'Google Pay',
      nameAr: 'جوجل باي (Google Pay)',
      enabled: true,
      badgeEn: 'GPay Instant',
      badgeAr: 'فوري ومعتمد',
      feeOrDiscountNoteEn: 'Fast & Secure',
      feeOrDiscountNoteAr: 'سريع وآمن'
    },
    {
      id: 'paypal',
      nameEn: 'PayPal Verified Shield',
      nameAr: 'باي بال (PayPal)',
      enabled: true,
      badgeEn: 'Buyer Protection',
      badgeAr: 'حماية المشتري الكاملة',
      feeOrDiscountNoteEn: 'Global Guarantee',
      feeOrDiscountNoteAr: 'ضمان دولي'
    },
    {
      id: 'bank_transfer',
      nameEn: 'Direct Bank Wire Transfer',
      nameAr: 'حوالة بنكية مباشرة (IBAN / SWIFT)',
      enabled: true,
      badgeEn: 'Manual Verification',
      badgeAr: 'اعتماد يدوي للحوالات',
      feeOrDiscountNoteEn: 'Invoice via Email',
      feeOrDiscountNoteAr: 'فاتورة رسمية عبر الإيميل'
    },
    {
      id: 'cod',
      nameEn: 'Cash on Delivery (GCC / Selected Regions)',
      nameAr: 'الدفع عند الاستلام (دول الخليج ومناطق مختارة)',
      enabled: true,
      badgeEn: 'Pay on Arrival',
      badgeAr: 'الدفع عند المعاينة',
      feeOrDiscountNoteEn: 'Subject to courier fees',
      feeOrDiscountNoteAr: 'تخضع لرسوم مندوب التوصيل'
    }
  ]
};

export const DEFAULT_SITE_VIDEOS: SiteVideoItem[] = [
  {
    id: 'v1',
    titleEn: 'Kenji Sato — High-Output Combat Conditioning',
    titleAr: 'كينجي ساتو — التكييف القتالي عالي الأداء',
    url: RYU_COMBAT_VIDEO,
    posterUrl: '/images/ai_human_striker_male.jpg',
    type: 'mp4',
    tag: 'STRIKE',
    featuredIn: 'arena'
  },
  {
    id: 'v2',
    titleEn: 'Victor Kael — Tactical Endurance Session',
    titleAr: 'فيكتور كايل — جلسة التحمل التكتيكية',
    url: REN_COMBAT_VIDEO,
    posterUrl: '/images/ai_human_tactical_male.jpg',
    type: 'mp4',
    tag: 'FLAME',
    featuredIn: 'arena'
  },
  {
    id: 'v3',
    titleEn: 'Elena Lin — Bio-Enhanced Kinetic Evasion',
    titleAr: 'إيلينا لين — المراوغة الحركية المتقدمة',
    url: KIRA_COMBAT_VIDEO,
    posterUrl: '/images/ai_human_valkyrie_female.jpg',
    type: 'mp4',
    tag: 'SPEED',
    featuredIn: 'arena'
  }
];

export const DEFAULT_INITIAL_ARTICLES: CustomArticleData[] = [
  {
    id: 1,
    titleEn: 'Samurai Warrior Mindset: Shattering Limits Past 100% & Conquering Muscle Fatigue',
    titleAr: 'عقلية محارب الساموراي: كسر الحدود 100% وتحطيم سقف الإجهاد العضلي',
    dateEn: 'September 28, 2026',
    dateAr: '28 سبتمبر 2026',
    excerptEn: "The difference between an ordinary lifter and an elite combat champion isn't genetics — it's razor-sharp focus, tactical discipline, and pushing through deep burn.",
    excerptAr: 'الفرق بين الممارس العادي وبطل القتال الخارق ليس في الجينات، بل في التركيز الشرس والانضباط التكتيكي ومواصلة الضغط عند أعلى درجات الاحتراق.',
    contentEn: 'When muscles burn and your mind screams to drop the barbell, the inner samurai awakens. In the YARD300 combat philosophy, fixed ceilings do not exist; fatigue is merely the neurological bell signaling that real growth has begun.\n\nSynthesizing neuromuscular coordination, endurance hormone monitoring, and tactical deep combat respiration allows you to shatter the 100% threshold safely.\n\n"The katana is forged only in fierce flame, and champion muscle is sculpted only by annihilating self-doubt!"',
    contentAr: 'عندما تشعر باحتراق أليافك العضلية ويطالبك عقلك بالتوقف، يظهر محارب الساموراي الكامن بداخلك. في منهجية YARD300، لا نؤمن بالحدود الثابتة؛ فالإرهاق مجرد إشارة عصبية عابرة تعلن بدء التدريب الحقيقي.\n\nدمج التوافق العصبي العضلي، ومراقبة هرمونات التحمل، والتنفس القتالي العميق يتيح لك تحقيق كومبو لا نهائي وكسر حاجز الـ 100% دون التعرض للإصابات المفاجئة.\n\n"النصل لا يُصقل إلا باللهب العالي، وعضلات البطل لا تُبنى إلا بكسر حاجز الخوف!"',
    image: JOURNAL_MINDSET_IMAGE,
    category: 'Mindset & Combat',
    author: 'Yam Suw & Team YARD'
  },
  {
    id: 2,
    titleEn: 'YARD300 Combat Gear Revolution: Carbon Armor & 2050 Biometric Precision',
    titleAr: 'ثورة عتاد براند YARD300 القتالي: دمج ألياف الكربون مع مستشعرات الأداء 2050',
    dateEn: 'September 25, 2026',
    dateAr: '25 سبتمبر 2026',
    excerptEn: 'Discover how YARD300 engineered titanium wearables, kinetic harnesses, and hybrid audio that sync directly with heart-rate spikes.',
    excerptAr: 'استكشف كيف ابتكر مهندسو YARD300 دروعاً رياضية وأحزمة مقاومة وسماعات هجينة تتفاعل مع ضربات القلب ونبضات الهالة الحركية.',
    contentEn: 'Athletic gear is no longer passive fabric. Under brand YARD300, every piece is cyber-armor calculating kinetic strain and stabilizing joints for instantaneous explosive force.\n\nFrom titanium noise-cancelling headphones to high-load kinetic harnesses, every item is built to outlast the most punishing boxing rounds.',
    contentAr: 'لم يعد عتاد التمرين مجرد أقمشة تمتص العرق. في عصر براند YARD300، تحول كل منتج إلى قطعة درع متطورة تحسب الإجهاد الحركي وتدعم المفاصل الحساسة لتوفير طاقة انفجارية فورية.\n\nمن سماعات إلغاء الضوضاء التيتانية إلى أحزمة المقاومة البوليمرية، صنعت كل قطعة لتصمد أمام أشرس جلسات الملاكمة وتمارين الـ CrossFit القاسية.',
    image: JOURNAL_GEAR_IMAGE,
    category: 'Gear Tech',
    author: 'Engineering Lab YARD300'
  },
  {
    id: 3,
    titleEn: 'Ninja Recovery Protocol: HRV Restoration & Deep Tissue Healing in 4 Hours',
    titleAr: 'بروتوكول الاستشفاء النينجا: استعادة معدل HRV والشفاء العضلي العميق في 4 ساعات',
    dateEn: 'September 20, 2026',
    dateAr: '20 سبتمبر 2026',
    excerptEn: 'AI algorithms reveal the secrets of photobiomodulation and cold exposure to restore full combat readiness without passive downtime.',
    excerptAr: 'خوارزميات الذكاء الاصطناعي تكشف أسرار كبسولات الضوء الأحمر والكمادات الثلجية لاستعادة الجاهزية القتالية التامة بدون إهدار أيام راحة سلبية.',
    contentEn: 'A modern warrior never leaves recovery to luck. Active healing is tracked with the exact rigor applied to heavy boxing rounds.\n\nUtilizing SpO2 metrics, 850nm red light wavelengths, and YARD300 deep sleep staging, athletes reboot to peak 9999 AU capacity overnight.',
    contentAr: 'المحارب الذكي لا ينتظر أن يشفى جسده بالمصادفة. الاستشفاء النشط يُدار بنفس الدقة والصرامة التي تُدار بها جولات الملاكمة.\n\nباستخدام قراءات SpO2، وموجات الضوء الأحمر 850nm، وتتبع مراحل النوم العميق بمحرك YARD300، يعود المحارب إلى كامل طاقته في صباح اليوم التالي.',
    image: JOURNAL_RECOVERY_IMAGE,
    category: 'Biometrics & Recovery',
    author: 'Dr. Biometric AI Team'
  }
];

export const DEFAULT_RESORT_CONFIG: ResortOverrideConfig = {
  openingDateEn: 'GRAND OPENING · OCTOBER 2027',
  openingDateAr: 'الافتتاح الرسمي · أكتوبر 2027',
  titleEn: 'YARD Bazaruto Sanctuary —',
  titleAr: 'منتجع يارد الصحي —',
  subtitleHighlightEn: 'Luxury Recovery & Coastal Hospitality',
  subtitleHighlightAr: 'ملاذ الاستشفاء والضيافة الساحلية',
  overviewEn: 'A coastal recovery sanctuary in the Bazaruto Archipelago opening October 2027 — uniting 10 private villas, a boutique hotel, entertainment promenade, lagoon pool, 4 global restaurants, a dedicated sand & combat gym wing, and a specialized sports & mental wellness hospital.',
  overviewAr: 'ملاذ ساحلي متكامل على رمال أرخبيل بازاروتو يستقبل زواره بدءاً من أكتوبر 2027؛ يجمع بين 10 فيلل شاطئية مستقلة، وفندق بوتيكي، ومنطقة ترفيهية ومول متكامل، وصالة قتالية على الرمال، و4 مطاعم عالمية، ومستشفى متخصص في الطب الرياضي والتأهيل النفسي.',
  architectName: 'Ayman .A. suwaidi',
  heroPanoramaImage: YARD_BAZARUTO_RESORT_IMAGE,
  aerialNightImage: YARD_ISLAND_AERIAL_NIGHT_IMAGE
};

export const DEFAULT_BRAND_SITE_SETTINGS: BrandSiteSettings = {
  clubMembershipPrice: 30,
  campCapacity: 300,
  footerTaglineEn: 'High-performance combat athletics, injury prediction algorithms, and bio-recovery protocols.',
  footerTaglineAr: 'رياضات قتالية عالية الأداء، خوارزميات التنبؤ بالإصابات، ومنتجع الاستشفاء الحيوي في أرخبيل بازاروتو.',
  contactEmail: 'contact@yard300.club',
  instagramHandle: '@yard.300',
  instagramUrl: 'https://www.instagram.com/yard.300',
  xHandle: '@YAMSUW300',
  xUrl: 'https://x.com/YAMSUW300',
  founderOverrides: {
    'yam-suw': {
      name: 'yam suw',
      nameAr: 'يام سو (Yam Suw)',
      role: 'Co-Founder • Shaolin Fighter & Head Coach',
      roleAr: 'المؤسس المشارك • مقاتل شاولين والمدرب الرئيسي',
      image: FOUNDER_YAM_SUW_IMAGE
    },
    'mtk': {
      name: 'M.T.K',
      nameAr: 'M.T.K',
      role: 'Co-Founder · Pilates, Functional Flow & Recovery Lead',
      roleAr: 'المؤسس المشارك · قيادة البيلاتس واللياقة الوظيفية والاستشفاء',
      image: FOUNDER_MTK_IMAGE
    },
    'arb': {
      name: 'A.R.B',
      nameAr: 'إي آر بي (A.R.B)',
      role: 'Co-Founder & Combat Strategy Coach',
      roleAr: 'المؤسس المشارك ومدرب الاستراتيجيات القتالية',
      image: FOUNDER_ARB_IMAGE
    }
  }
};

export const DEFAULT_SITE_CONFIG: OwnerSiteConfig = {
  media: {
    heroImage: HERO_IMAGE,
    heroBanner: '/images/ai_human_arena_duo.jpg',
    brandLogo: YARD300_BRAND_LOGO,
    productImageOverrides: {}
  },
  sections: DEFAULT_SITE_SECTIONS,
  payments: DEFAULT_PAYMENT_CONFIG,
  videos: DEFAULT_SITE_VIDEOS,
  articles: DEFAULT_INITIAL_ARTICLES,
  announcement: {
    enabled: true,
    textEn: 'GLOBAL LAUNCH 2026: S-RANK GEAR + $30 ATHLETIC CLUB OWNERSHIP NOW LIVE.',
    textAr: 'الإطلاق العالمي 2026: عتاد S-RANK وترخيص النادي الرياضي ($30) متاح الآن.',
    badgeEn: 'OFFICIAL DROP',
    badgeAr: 'إطلاق رسمي',
    link: '#customClub',
    colorTheme: 'red'
  },
  heroText: {
    kpi1Value: '+9,999',
    kpi2Value: '100%',
    kpi3Value: 'S-RANK'
  },
  productOverrides: {},
  resort: DEFAULT_RESORT_CONFIG,
  siteSettings: DEFAULT_BRAND_SITE_SETTINGS,
  ownerPin: '300'
};

export class OwnerConfigService {
  private static config: OwnerSiteConfig | null = null;

  static getConfig(): OwnerSiteConfig {
    if (this.config) return this.config;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const rawMedia = { ...DEFAULT_SITE_CONFIG.media, ...(parsed.media || {}) };
        const isLegacyPath = (u?: string) => !u || /anime_|cyber_|yard_brand_hero|boxing_|tarik_|live_arena_/.test(u);
        const sanitizedMedia: SiteMediaConfig = {
          ...rawMedia,
          heroImage: isLegacyPath(rawMedia.heroImage) ? HERO_IMAGE : rawMedia.heroImage,
          heroBanner: isLegacyPath(rawMedia.heroBanner) ? '/images/ai_human_arena_duo.jpg' : rawMedia.heroBanner
        };
        const rawVideos: SiteVideoItem[] = parsed.videos && parsed.videos.length > 0 ? parsed.videos : DEFAULT_SITE_CONFIG.videos;
        const sanitizedVideos = rawVideos.map((v, idx) => ({
          ...v,
          posterUrl: isLegacyPath(v.posterUrl)
            ? (DEFAULT_SITE_VIDEOS[idx % DEFAULT_SITE_VIDEOS.length]?.posterUrl || HERO_IMAGE)
            : v.posterUrl
        }));
        const rawResort = { ...DEFAULT_RESORT_CONFIG, ...(parsed.resort || {}) };
        // Ensure latest resort assets when older stored defaults exist
        if (rawResort.heroPanoramaImage === '/images/yard_bazaruto_resort.jpg') {
          rawResort.heroPanoramaImage = YARD_BAZARUTO_RESORT_IMAGE;
        }
        if (
          rawResort.aerialNightImage === '/images/bazaruto_island_aerial_night.jpg' ||
          rawResort.aerialNightImage === '/images/bazaruto_aerial_night_v2.jpg'
        ) {
          rawResort.aerialNightImage = YARD_ISLAND_AERIAL_NIGHT_IMAGE;
        }

        const rawSiteSettings = {
          ...DEFAULT_BRAND_SITE_SETTINGS,
          ...(parsed.siteSettings || {}),
          founderOverrides: {
            ...DEFAULT_BRAND_SITE_SETTINGS.founderOverrides,
            ...(parsed.siteSettings?.founderOverrides || {})
          }
        };

        this.config = {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          media: sanitizedMedia,
          sections: parsed.sections && parsed.sections.length > 0 ? parsed.sections : DEFAULT_SITE_CONFIG.sections,
          payments: {
            ...DEFAULT_SITE_CONFIG.payments,
            ...(parsed.payments || {}),
            gateways: parsed.payments?.gateways || DEFAULT_SITE_CONFIG.payments.gateways
          },
          videos: sanitizedVideos,
          articles: parsed.articles && parsed.articles.length > 0 ? parsed.articles : DEFAULT_SITE_CONFIG.articles,
          announcement: { ...DEFAULT_SITE_CONFIG.announcement, ...(parsed.announcement || {}) },
          heroText: { ...DEFAULT_SITE_CONFIG.heroText, ...(parsed.heroText || {}) },
          productOverrides: parsed.productOverrides || {},
          resort: rawResort,
          siteSettings: rawSiteSettings,
          ownerPin: parsed.ownerPin || DEFAULT_SITE_CONFIG.ownerPin
        };
        return this.config;
      }
    } catch (e) {
      console.warn('Failed to parse owner site config, fallback to default:', e);
    }

    this.config = JSON.parse(JSON.stringify(DEFAULT_SITE_CONFIG));
    return this.config!;
  }

  static saveConfig(newConfig: OwnerSiteConfig): boolean {
    try {
      this.config = newConfig;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(CONFIG_CHANGE_EVENT, { detail: newConfig }));
      }
      return true;
    } catch (e) {
      console.error('Failed to save owner site config:', e);
      return false;
    }
  }

  static subscribe(callback: (config: OwnerSiteConfig) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<OwnerSiteConfig>;
      callback(customEvent.detail || this.getConfig());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(CONFIG_CHANGE_EVENT, handler);
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.config = null;
          callback(this.getConfig());
        }
      });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(CONFIG_CHANGE_EVENT, handler);
      }
    };
  }

  static resetToDefaults(): OwnerSiteConfig {
    this.config = JSON.parse(JSON.stringify(DEFAULT_SITE_CONFIG));
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CONFIG_CHANGE_EVENT, { detail: this.config }));
    }
    return this.config;
  }

  static getConfiguredProducts(lang: string = 'en', includeDisabled: boolean = false): Product[] {
    const cfg = this.getConfig();
    const baseList = getProducts(lang);
    return baseList
      .filter((p) => includeDisabled || !cfg.productOverrides?.[p.id]?.disabled)
      .map((p) => {
        const ov = cfg.productOverrides?.[p.id];
        const imgOv = cfg.media.productImageOverrides?.[p.id];
        return {
          ...p,
          name: ov?.name && ov.name.trim() ? ov.name : p.name,
          price: typeof ov?.price === 'number' && ov.price >= 0 ? ov.price : p.price,
          originalPrice: typeof ov?.originalPrice === 'number' ? ov.originalPrice : p.originalPrice,
          tagline: ov?.tagline && ov.tagline.trim() ? ov.tagline : p.tagline,
          description: ov?.description && ov.description.trim() ? ov.description : p.description,
          imageUrl: imgOv || p.imageUrl
        };
      });
  }

  static isSectionEnabled(sectionId: string): boolean {
    const cfg = this.getConfig();
    const found = cfg.sections.find(s => s.id === sectionId);
    return found ? found.enabled : true;
  }

  static getActiveArticles(lang: string = 'en'): JournalArticle[] {
    const cfg = this.getConfig();
    const isAr = lang === 'ar';
    const isDefaultArticles =
      cfg.articles.length === DEFAULT_INITIAL_ARTICLES.length &&
      cfg.articles.every((a, i) => a.titleEn === DEFAULT_INITIAL_ARTICLES[i]?.titleEn);
    if (isDefaultArticles && (lang === 'es' || lang === 'fr')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return cfg.articles.map((a) => ({
        id: a.id,
        title: lang === 'es'
          ? (a.id === 1
              ? 'Mentalidad de Guerrero Samurái: Superando el 100% y la Fatiga Muscular'
              : a.id === 2
              ? 'Revolución de Equipamiento YARD300: Armadura de Carbono y Precisión Biométrica'
              : 'Protocolo de Recuperación Ninja: Restauración de HRV en 4 Horas')
          : (a.id === 1
              ? 'Mentalité de Guerrier Samouraï : Dépasser les 100% et Vaincre la Fatigue'
              : a.id === 2
              ? 'Révolution Équipement YARD300 : Armure Carbone & Précision Biométrique'
              : 'Protocole de Récupération Ninja : Restauration VRC en 4 Heures'),
        date: lang === 'es'
          ? a.dateEn.replace('September', 'Septiembre')
          : a.dateEn.replace('September', 'Septembre'),
        excerpt: lang === 'es'
          ? (a.id === 1
              ? 'La diferencia entre un atleta común y un campeón de combate reside en el enfoque táctico y la disciplina bajo fatiga extrema.'
              : a.id === 2
              ? 'Descubre cómo YARD300 diseñó sensores de titanio y arneses cinéticos sincronizados con el ritmo cardíaco.'
              : 'Los algoritmos de IA revelan protocolos térmicos y de fotobiomodulación para recuperar la preparación total.')
          : (a.id === 1
              ? 'La différence entre un athlète ordinaire et un champion réside dans la concentration tactique et la discipline sous fatigue.'
              : a.id === 2
              ? 'Découvrez comment YARD300 a conçu des capteurs en titane et des tenues cinétiques synchronisées au rythme cardiaque.'
              : 'Les algorithmes d’IA révèlent les secrets de récupération active et de restauration de VRC sans temps mort.'),
        image: a.image,
        content: lang === 'es'
          ? (a.id === 1
              ? 'Cuando los músculos arden, despierta el guerrero interior. En la filosofía YARD300, la fatiga es la señal neurológica de adaptación real. Combinando coordinación neuromuscular, monitoreo de resistencia y respiración táctica, superas el umbral con seguridad.'
              : a.id === 2
              ? 'El equipamiento deportivo ya no es solo tela pasiva. Cada pieza de YARD300 actúa como ingeniería de soporte biomecánico para estabilizar articulaciones y maximizar la potencia explosiva.'
              : 'Un campeón nunca deja la recuperación al azar. Usando telemetría SpO2, fotobiomodulación de 850nm y análisis de sueño profundo, tu cuerpo se reinicia al máximo nivel.')
          : (a.id === 1
              ? 'Lorsque les muscles brûlent, le guerrier intérieur s’éveille. Dans l’approche YARD300, la fatigue annonce la véritable progression. En combinant coordination neuromusculaire et respiration tactique, vous dépassez vos limites en toute sécurité.'
              : a.id === 2
              ? 'L’équipement sportif n’est plus un simple textile. Chaque pièce YARD300 stabilise les articulations et accompagne la puissance explosive sous haute contrainte.'
              : 'Un athlète d’élite ne laisse jamais sa récupération au hasard. Grâce aux mesures SpO2 et à l’analyse du sommeil profond NREM3, vous retrouvez votre potentiel maximal.'),
      }));
    }
    return cfg.articles.map(a => ({
      id: a.id,
      title: isAr ? (a.titleAr || a.titleEn) : (a.titleEn || a.titleAr),
      date: isAr ? (a.dateAr || a.dateEn) : (a.dateEn || a.dateAr),
      excerpt: isAr ? (a.excerptAr || a.excerptEn) : (a.excerptEn || a.excerptAr),
      image: a.image,
      content: isAr ? (a.contentAr || a.contentEn) : (a.contentEn || a.contentAr)
    }));
  }

  static getTreasuryAddress(type: 'eth' | 'trc20' | 'solana' = 'eth'): string {
    const cfg = this.getConfig();
    if (type === 'trc20') return cfg.payments.treasuryTrc20Address;
    if (type === 'solana') return cfg.payments.treasurySolanaAddress;
    return cfg.payments.treasuryEthAddress;
  }

  private static hashOwnerSecret(secret: string): string {
    const clean = secret.trim();
    const input = `y300_own_s4lt_${clean}_v3`;
    let h1 = 0x811c9dc5;
    let h2 = 0x9e3779b9;
    for (let i = 0; i < input.length; i++) {
      const c = input.charCodeAt(i);
      h1 ^= c;
      h1 = Math.imul(h1, 0x01000193);
      h2 ^= (c + i);
      h2 = Math.imul(h2, 0x85ebca6b);
    }
    return `oh_${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0).toString(16).padStart(8, '0')}`;
  }

  private static checkOwnerRateLimit(): { allowed: boolean; waitSeconds?: number } {
    if (typeof window === 'undefined') return { allowed: true };
    try {
      const raw = localStorage.getItem('yard300_owner_attempts');
      if (!raw) return { allowed: true };
      const data = JSON.parse(raw) as { count: number; lockUntil?: number };
      if (data.lockUntil && Date.now() < data.lockUntil) {
        return { allowed: false, waitSeconds: Math.ceil((data.lockUntil - Date.now()) / 1000) };
      }
    } catch {}
    return { allowed: true };
  }

  private static recordOwnerFailedAttempt(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('yard300_owner_attempts');
      const data = raw ? (JSON.parse(raw) as { count: number; lockUntil?: number }) : { count: 0 };
      const count = (data.lockUntil && Date.now() >= data.lockUntil ? 0 : data.count) + 1;
      const lockUntil = count >= 5 ? Date.now() + 60_000 : undefined;
      localStorage.setItem('yard300_owner_attempts', JSON.stringify({ count, lockUntil }));
    } catch {}
  }

  private static clearOwnerFailedAttempts(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('yard300_owner_attempts');
    } catch {}
  }

  private static getStoredOwnerHash(): string {
    if (typeof window === 'undefined') return '';
    // Cleanly migrate any legacy plaintext pass if present
    const legacyPass = localStorage.getItem('yard300_custom_owner_pass');
    if (legacyPass) {
      const migrated = this.hashOwnerSecret(legacyPass);
      localStorage.setItem('yard300_custom_owner_hash', migrated);
      localStorage.removeItem('yard300_custom_owner_pass');
      return migrated;
    }
    const storedHash = localStorage.getItem('yard300_custom_owner_hash');
    if (storedHash) return storedHash;
    const cfg = this.getConfig();
    if (cfg.ownerPin && cfg.ownerPin !== 'CONFIGURED' && cfg.ownerPin !== '300') {
      return this.hashOwnerSecret(cfg.ownerPin);
    }
    return this.hashOwnerSecret('300');
  }

  static isOwnerLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    const authed = localStorage.getItem('yard300_owner_authenticated') === 'true';
    const sessionExp = Number(localStorage.getItem('yard300_owner_session_exp') || '0');
    if (!authed) return false;
    if (sessionExp && Date.now() > sessionExp) {
      this.logoutOwner();
      return false;
    }
    return true;
  }

  static getOwnerInfo(): { email: string; name: string } {
    if (typeof window === 'undefined') return { email: 'yamsuw946@gmail.com', name: 'Yam Suw' };
    const name = localStorage.getItem('yard300_owner_name') || 'Yam Suw';
    const email = localStorage.getItem('yard300_owner_email') || localStorage.getItem('yard300_custom_owner_email') || 'yamsuw946@gmail.com';
    return { email, name };
  }

  static getOwnerProfile(): { name: string; email: string; isRegistered: boolean; registeredDate?: string } {
    if (typeof window === 'undefined') return { name: 'Yam Suw', email: 'yamsuw946@gmail.com', isRegistered: false };
    const name = localStorage.getItem('yard300_owner_name') || 'Yam Suw';
    const email = localStorage.getItem('yard300_custom_owner_email') || localStorage.getItem('yard300_owner_email') || 'yamsuw946@gmail.com';
    const registeredDate = localStorage.getItem('yard300_owner_registered_date') || undefined;
    const isRegistered = Boolean(localStorage.getItem('yard300_custom_owner_hash') || localStorage.getItem('yard300_custom_owner_pass'));
    return { name, email, isRegistered, registeredDate };
  }

  static registerOwner(name: string, email: string, pass: string): boolean {
    const cleanName = name.replace(/[<>]/g, '').trim() || 'Yam Suw';
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || cleanPass.length < 4) return false;

    const passHash = this.hashOwnerSecret(cleanPass);
    localStorage.setItem('yard300_owner_name', cleanName);
    localStorage.setItem('yard300_custom_owner_email', cleanEmail);
    localStorage.setItem('yard300_custom_owner_hash', passHash);
    localStorage.removeItem('yard300_custom_owner_pass');
    localStorage.setItem('yard300_owner_email', cleanEmail);
    localStorage.setItem('yard300_owner_registered_date', new Date().toISOString());
    localStorage.setItem('yard300_owner_authenticated', 'true');
    localStorage.setItem('yard300_owner_session', 'active');
    localStorage.setItem('yard300_owner_session_exp', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    this.clearOwnerFailedAttempts();

    const cfg = this.getConfig();
    cfg.ownerPin = 'CONFIGURED';
    this.saveConfig(cfg);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yard300_owner_auth_changed', { detail: { authenticated: true, name: cleanName, email: cleanEmail } }));
    }
    return true;
  }

  static loginOwner(email: string, pass: string): boolean {
    const limit = this.checkOwnerRateLimit();
    if (!limit.allowed) return false;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (!cleanEmail || !cleanPass) return false;

    const savedOwnerEmail = (localStorage.getItem('yard300_custom_owner_email') || 'yamsuw946@gmail.com').toLowerCase();
    const savedOwnerName = localStorage.getItem('yard300_owner_name') || 'Yam Suw';

    const emailMatches =
      cleanEmail === savedOwnerEmail ||
      cleanEmail === 'yamsuw946@gmail.com' ||
      cleanEmail === 'owner@yard300.club';

    const expectedHash = this.getStoredOwnerHash();
    const enteredHash = this.hashOwnerSecret(cleanPass);

    if (emailMatches && enteredHash === expectedHash) {
      this.clearOwnerFailedAttempts();
      localStorage.setItem('yard300_owner_authenticated', 'true');
      localStorage.setItem('yard300_owner_email', cleanEmail || savedOwnerEmail);
      localStorage.setItem('yard300_owner_name', savedOwnerName);
      localStorage.setItem('yard300_owner_session', 'active');
      localStorage.setItem('yard300_owner_session_exp', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('yard300_owner_auth_changed', { detail: { authenticated: true, name: savedOwnerName, email: cleanEmail } }));
      }
      return true;
    }

    this.recordOwnerFailedAttempt();
    return false;
  }

  static logoutOwner(): void {
    localStorage.removeItem('yard300_owner_authenticated');
    localStorage.removeItem('yard300_owner_session');
    localStorage.removeItem('yard300_owner_session_exp');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yard300_owner_auth_changed', { detail: { authenticated: false } }));
    }
  }

  static verifyPin(enteredPin: string): boolean {
    const limit = this.checkOwnerRateLimit();
    if (!limit.allowed) return false;

    const clean = enteredPin.trim();
    if (!clean) return false;
    const expectedHash = this.getStoredOwnerHash();
    const ok = this.hashOwnerSecret(clean) === expectedHash;
    if (ok) this.clearOwnerFailedAttempts();
    else this.recordOwnerFailedAttempt();
    return ok;
  }
}

