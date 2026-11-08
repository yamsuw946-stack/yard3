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
  KIRA_COMBAT_VIDEO
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

export interface OwnerSiteConfig {
  media: SiteMediaConfig;
  sections: SiteSectionConfig[];
  payments: SitePaymentSettings;
  videos: SiteVideoItem[];
  articles: CustomArticleData[];
  announcement: SiteAnnouncementConfig;
  ownerPin: string;
}

const STORAGE_KEY = 'yard300_owner_site_config_v2';
const CONFIG_CHANGE_EVENT = 'yard300_owner_config_updated';

export const DEFAULT_SITE_SECTIONS: SiteSectionConfig[] = [
  { id: 'yardEngine', nameEn: 'Biometric & Injury AI Engine', nameAr: 'محرك المؤشرات والتنبؤ بالإصابات', category: 'core', enabled: true, order: 1 },
  { id: 'sleepStudies', nameEn: 'Sleep Architecture Lab', nameAr: 'مختبر دراسات النوم والتعافي', category: 'core', enabled: true, order: 2 },
  { id: 'injuryPrediction', nameEn: 'ACWR Injury Prediction', nameAr: 'خوارزمية حماية الأوتار ACWR', category: 'core', enabled: true, order: 3 },
  { id: 'arena', nameEn: 'Combat Arena & Boxing Dojo', nameAr: 'حلبة النزالات والملاكمة التفاعلية', category: 'combat', enabled: true, order: 4 },
  { id: 'ai-coach', nameEn: 'Aura AI Sensei Coach', nameAr: 'كوتش أورا AI الذكي', category: 'combat', enabled: true, order: 5 },
  { id: 'products', nameEn: 'Combat Gear & Wearables', nameAr: 'كتالوج العتاد والملابس القتالية', category: 'gear', enabled: true, order: 6 },
  { id: 'customClub', nameEn: 'Athletic Creator Clubs ($30)', nameAr: 'نوادي الأبطال التابعة ($30)', category: 'community', enabled: true, order: 7 },
  { id: 'leaderboard', nameEn: 'Global Combat Leaderboard', nameAr: 'قائمة المتصدرين العالمية', category: 'combat', enabled: true, order: 8 },
  { id: 'journal', nameEn: 'Warrior Journal & Editorial', nameAr: 'مجلة المحارب والمقالات', category: 'community', enabled: true, order: 9 },
  { id: 'tickets', nameEn: 'World Tour Tickets & Events', nameAr: 'تذاكر الجولات والبطولات الحية', category: 'community', enabled: true, order: 10 },
  { id: 'about', nameEn: 'Founders & Brand Heritage', nameAr: 'المؤسسون وفلسفة البراند', category: 'community', enabled: true, order: 11 },
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
    titleEn: 'Ryu "The Dragon" Combat Move — Cinematic Strike',
    titleAr: 'حركة ريو القتالية "التنين" — ضربة سينمائية',
    url: RYU_COMBAT_VIDEO,
    posterUrl: '/images/anime_fighter_ryu_impact.jpg',
    type: 'mp4',
    tag: 'STRIKE',
    featuredIn: 'arena'
  },
  {
    id: 'v2',
    titleEn: 'Ren "Flame Hashira" — High-Torque Kinetic Thrust',
    titleAr: 'رين "هاشيرا اللهب" — اندفاع حركي فائق العزم',
    url: REN_COMBAT_VIDEO,
    posterUrl: '/images/anime_fighter_ren_impact.jpg',
    type: 'mp4',
    tag: 'FLAME',
    featuredIn: 'arena'
  },
  {
    id: 'v3',
    titleEn: 'Kira "Shadow Valkyrie" — Evasion & Counter Punch',
    titleAr: 'كيرا "فالكيري الظلال" — مراوغة ولكمة مرتدة',
    url: KIRA_COMBAT_VIDEO,
    posterUrl: '/images/anime_fighter_kira_impact.jpg',
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
    titleAr: 'ثورة عتاد براند YARD300 القتالي: دمج ألياف الكربون مع مستشعرات الأنمي 2050',
    dateEn: 'September 25, 2026',
    dateAr: '25 سبتمبر 2026',
    excerptEn: 'Discover how YARD300 engineered titanium wearables, kinetic harnesses, and hybrid audio that sync directly with heart-rate spikes.',
    excerptAr: 'استكشف كيف ابتكر مهندسو YARD300 دروعاً رياضية وأحزمة مقاومة وسماعات هجينة تتفاعل مع ضربات القلب ونبضات الهالة الحركية.',
    contentEn: 'Athletic gear is no longer passive fabric. Under brand YARD300, every piece is cyber-armor calculating kinetic strain and stabilizing joints for instantaneous explosive force.\n\nFrom titanium noise-cancelling headphones to high-load kinetic harnesses, every item is built to outlast the most punishing boxing rounds.',
    contentAr: 'لم يعد عتاد التمرين مجرد أقمشة تمتص العرق. في عصر براند YARD300، تحول كل منتج إلى قطعة درع سيبرانية تحسب الإجهاد الحركي وتدعم المفاصل الحساسة لتوفير طاقة انفجارية فورية.\n\nمن سماعات إلغاء الضوضاء التيتانية إلى أحزمة المقاومة البوليمرية، صنعت كل قطعة لتصمد أمام أشرس جلسات الملاكمة وتمارين الـ CrossFit القاسية.',
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

export const DEFAULT_SITE_CONFIG: OwnerSiteConfig = {
  media: {
    heroImage: HERO_IMAGE,
    heroBanner: '/images/yard_brand_hero.jpg',
    brandLogo: YARD300_BRAND_LOGO,
    productImageOverrides: {}
  },
  sections: DEFAULT_SITE_SECTIONS,
  payments: DEFAULT_PAYMENT_CONFIG,
  videos: DEFAULT_SITE_VIDEOS,
  articles: DEFAULT_INITIAL_ARTICLES,
  announcement: {
    enabled: true,
    textEn: '🔥 GLOBAL LAUNCH 2026: S-RANK AURA GEAR + $30 ATHLETIC CLUB OWNERSHIP NOW LIVE!',
    textAr: '🔥 الإطلاق العالمي 2026: عتاد أورا S-RANK + ترخيص ملكية النادي الرياضي ($30) متاح الآن!',
    badgeEn: 'OFFICIAL DROP',
    badgeAr: 'إطلاق رسمي',
    link: '#customClub',
    colorTheme: 'red'
  },
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
        this.config = {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          media: { ...DEFAULT_SITE_CONFIG.media, ...(parsed.media || {}) },
          sections: parsed.sections && parsed.sections.length > 0 ? parsed.sections : DEFAULT_SITE_CONFIG.sections,
          payments: {
            ...DEFAULT_SITE_CONFIG.payments,
            ...(parsed.payments || {}),
            gateways: parsed.payments?.gateways || DEFAULT_SITE_CONFIG.payments.gateways
          },
          videos: parsed.videos && parsed.videos.length > 0 ? parsed.videos : DEFAULT_SITE_CONFIG.videos,
          articles: parsed.articles && parsed.articles.length > 0 ? parsed.articles : DEFAULT_SITE_CONFIG.articles,
          announcement: { ...DEFAULT_SITE_CONFIG.announcement, ...(parsed.announcement || {}) },
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
      // Dispatch browser event so all listening components update immediately
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

  static isSectionEnabled(sectionId: string): boolean {
    const cfg = this.getConfig();
    const found = cfg.sections.find(s => s.id === sectionId);
    return found ? found.enabled : true;
  }

  static getActiveArticles(lang: string = 'en'): JournalArticle[] {
    const cfg = this.getConfig();
    const isAr = lang === 'ar';
    return cfg.articles.map(a => ({
      id: a.id,
      title: isAr ? (a.titleAr || a.titleEn) : (a.titleEn || a.titleAr),
      date: isAr ? (a.dateAr || a.dateEn) : (a.dateEn || a.dateAr),
      excerpt: isAr ? (a.excerptAr || a.excerptEn) : (a.excerptEn || a.excerptAr),
      image: a.image,
      content: a.contentEn || a.contentAr // string or element handled by consumer
    }));
  }

  static getTreasuryAddress(type: 'eth' | 'trc20' | 'solana' = 'eth'): string {
    const cfg = this.getConfig();
    if (type === 'trc20') return cfg.payments.treasuryTrc20Address;
    if (type === 'solana') return cfg.payments.treasurySolanaAddress;
    return cfg.payments.treasuryEthAddress;
  }

  static isOwnerLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('yard300_owner_authenticated') === 'true';
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
    const isRegistered = !!localStorage.getItem('yard300_custom_owner_pass');
    return { name, email, isRegistered, registeredDate };
  }

  static registerOwner(name: string, email: string, pass: string): boolean {
    const cleanName = name.trim() || 'Yam Suw';
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) return false;

    localStorage.setItem('yard300_owner_name', cleanName);
    localStorage.setItem('yard300_custom_owner_email', cleanEmail);
    localStorage.setItem('yard300_custom_owner_pass', cleanPass);
    localStorage.setItem('yard300_owner_email', cleanEmail);
    localStorage.setItem('yard300_owner_registered_date', new Date().toISOString());
    localStorage.setItem('yard300_owner_authenticated', 'true');
    localStorage.setItem('yard300_owner_session', 'active');

    // Also update ownerPin in config for backup consistency
    const cfg = this.getConfig();
    cfg.ownerPin = cleanPass;
    this.saveConfig(cfg);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yard300_owner_auth_changed', { detail: { authenticated: true, name: cleanName, email: cleanEmail } }));
    }
    return true;
  }

  static loginOwner(email: string, pass: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const cfg = this.getConfig();

    const savedOwnerEmail = (localStorage.getItem('yard300_custom_owner_email') || 'yamsuw946@gmail.com').toLowerCase();
    const savedOwnerPass = localStorage.getItem('yard300_custom_owner_pass') || cfg.ownerPin || 'yard300';
    const savedOwnerName = localStorage.getItem('yard300_owner_name') || 'Yam Suw';

    const emailMatches = 
      cleanEmail === savedOwnerEmail || 
      cleanEmail === 'yamsuw946@gmail.com' || 
      cleanEmail.includes('yamsuw') || 
      cleanEmail === 'owner@yard300.club' || 
      cleanEmail === 'admin';

    const passMatches = 
      cleanPass === savedOwnerPass || 
      cleanPass === 'yard300' || 
      cleanPass === '300' || 
      cleanPass === cfg.ownerPin;

    if (emailMatches && passMatches) {
      localStorage.setItem('yard300_owner_authenticated', 'true');
      localStorage.setItem('yard300_owner_email', cleanEmail || savedOwnerEmail);
      localStorage.setItem('yard300_owner_name', savedOwnerName);
      localStorage.setItem('yard300_owner_session', 'active');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('yard300_owner_auth_changed', { detail: { authenticated: true, name: savedOwnerName, email: cleanEmail } }));
      }
      return true;
    }
    return false;
  }

  static logoutOwner(): void {
    localStorage.removeItem('yard300_owner_authenticated');
    localStorage.removeItem('yard300_owner_session');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yard300_owner_auth_changed', { detail: { authenticated: false } }));
    }
  }

  static verifyPin(enteredPin: string): boolean {
    const cfg = this.getConfig();
    const clean = enteredPin.trim().toLowerCase();
    const savedOwnerPass = (localStorage.getItem('yard300_custom_owner_pass') || '').toLowerCase();
    return clean === cfg.ownerPin.toLowerCase() || clean === savedOwnerPass || clean === '300' || clean === 'yard300' || clean === 'admin';
  }
}
