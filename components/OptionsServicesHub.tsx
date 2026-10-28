/**
 * OptionsServicesHub.tsx
 * Dedicated full-featured "Options / الخدمات والمزايا" view and modal
 * Houses all YARD300 chambers, services, AI engines, and tools neatly organized.
 */

import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  Swords, 
  Bot, 
  ShoppingBag, 
  Trophy, 
  BookOpen, 
  FileText, 
  User, 
  Flame, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  ArrowRight,
  CreditCard,
  Ticket,
  Moon,
  ShieldAlert,
  Award,
  Crown,
  Compass
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { 
  TITAN_BRAWLER_IMAGE,
  NINJA_KUNOICHI_IMAGE,
  LIVE_ARENA_IMAGE,
  AI_COACH_IMAGE,
  VALKYRIE_NEON_IMAGE,
  TARIK_SAIYAN_IMAGE,
  ABOUT_SQUAD_IMAGE,
  JOURNAL_GEAR_IMAGE,
  YARD_SHIRT_IMAGE,
  YARD_BRAND_HERO_BANNER,
  handleImageError
} from '../constants';
import ProductGrid from './ProductGrid';
import { Product } from '../types';

interface OptionsServicesHubProps {
  currentLang?: Language;
  onSelectOption: (optionId: string) => void;
  onSelectProduct?: (product: Product) => void;
  onBackToHome?: () => void;
}

interface ServiceOption {
  id: string;
  category: 'core' | 'combat' | 'gear' | 'community';
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  badgeEn: string;
  badgeAr: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  image?: string;
  statsEn: string;
  statsAr: string;
  featuresEn: string[];
  featuresAr: string[];
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'yardEngine',
    category: 'core',
    titleEn: 'YARD300 Biometric & Injury Prediction Engine',
    titleAr: 'محرك YARD300 الحيوي للتنبؤ بالإصابات والاستشفاء',
    subtitleEn: 'ACWR acute/chronic workload ratio, deep sleep staging, and 7-day injury prevention alerts.',
    subtitleAr: 'متابعة النبض والضغط العضلي الحاد والمزمن (ACWR)، أطوار النوم العميق، واستباق الإصابات قبل وقوعها بـ 7 أيام.',
    badgeEn: 'CORE AI ALGORITHM',
    badgeAr: 'المحرك الأساسي',
    icon: Activity,
    accentColor: '#E50914',
    statsEn: '99.4% Precision',
    statsAr: 'دقة تنبؤ 99.4%',
    featuresEn: ['ACWR Risk Algorithm', 'Voice-to-Text Injury Adjustment', 'Active Movement Breaks (+YARDX)', 'Sleep Disorder Alerts'],
    featuresAr: ['خوارزمية ACWR للسلامة', 'تعديل الخطر بالأوامر الصوتية', 'استراحات حركية بمكافآت YARDX', 'تنبيهات انقطاع أكسجين النوم']
  },
  {
    id: 'sleepStudies',
    category: 'core',
    titleEn: 'Sleep Studies & Neuromuscular Recovery Algorithm',
    titleAr: 'خوارزمية دراسات النوم وهندسة أطوار التعافي العصبي',
    subtitleEn: 'Clinical analysis of NREM Stage-3 deep sleep, REM memory consolidation, sleep debt and SpO2.',
    subtitleAr: 'تحليل دقيق لأطوار النوم العميق NREM3 ونوم حركة العين السريعة REM وحساب الدين التراكمي لهرمون النمو.',
    badgeEn: 'CLINICAL SLEEP LAB',
    badgeAr: 'مختبر النوم الرياضي',
    icon: Moon,
    accentColor: '#7000FF',
    statsEn: 'Clinical Staging',
    statsAr: 'أطوار نوم سريرية',
    featuresEn: ['Deep Sleep NREM3 %', 'Sleep Debt Calculation', 'Circadian Anchor Optimizer', 'Growth Hormone Release Estimation'],
    featuresAr: ['نسبة النوم العميق NREM3', 'حساب دين النوم التراكمي', 'تثبيت الإيقاع البيولوجي اليومي', 'تقدير ذروة هرمون النمو GH']
  },
  {
    id: 'injuryPrediction',
    category: 'core',
    titleEn: 'Biomechanical Injury Prediction & Prevention Model',
    titleAr: 'خوارزمية التنبؤ بالإصابات والوقاية الحركية ACWR',
    subtitleEn: 'Banister workload modeling, acute:chronic ratio, prior injury multiplier, and 7-day soft-tissue alerts.',
    subtitleAr: 'نموذج التنبؤ بالتمزقات العضلية وإصابات الأوتار قبل حدوثها بـ 7 أيام بناءً على إجهاد الجهاز العصبي.',
    badgeEn: 'ACWR PREVENTATIVE MODEL',
    badgeAr: 'نموذج الوقاية الذكية',
    icon: ShieldAlert,
    accentColor: '#E50914',
    statsEn: '7-Day Early Forecast',
    statsAr: 'تنبؤ استباقي 7 أيام',
    featuresEn: ['Gabbett Sweet Spot (0.8-1.3)', 'Prior Injury Hotspot Weighting', 'HRV Suppression Coefficient', 'Actionable Deload Prescriptions'],
    featuresAr: ['نطاق الحمل الآمن 0.8 - 1.3', 'معامل الإصابات السابقة', 'مؤشر هبوط تقلب ضربات القلب', 'بروتوكولات تخفيف الحمل الطبية']
  },
  {
    id: 'subscriberTiers',
    category: 'community',
    titleEn: 'Subscriber Tier Cards & Earned Merit Credentials',
    titleAr: 'بطاقات المشتركين الرقمية ونماذج الاستحقاق (المستويات 4)',
    subtitleEn: 'Interactive 3D preview of the 4 subscriber credential cards — earned exclusively through sweat and effort, NOT FOR SALE.',
    subtitleAr: 'معاينة تفاعلية ثلاثية الأبعاد لبطاقات المستويات الأربعة الممنوحة بعرق الجبين وساعات التدريب فقط وليست للبيع.',
    badgeEn: 'NOT FOR SALE // MERIT ONLY',
    badgeAr: 'استحقاق بالجهد وليست للبيع',
    icon: Award,
    accentColor: '#FFE600',
    statsEn: '4 Verified Tiers',
    statsAr: '4 مستويات موثقة',
    featuresEn: ['3D Holographic Card Specimen', 'Verified Hours & Streak Tracking', 'Digital NFC Identity Protocol', 'Strict Non-Purchasable Merit Policy'],
    featuresAr: ['نموذج بطاقة 3D هولوجرامي', 'تتبع الساعات والاستمرارية', 'هوية رقمية مشفرة بشرائح NFC', 'سياسة استحقاق صارمة غير قابلة للشراء']
  },
  {
    id: 'auraVisualizer',
    category: 'core',
    titleEn: 'Ninja Aura Visualizer & Ki Energy Shaders',
    titleAr: 'أستوديو شحن وتخصيص الهالة النيونية وتدفق الطاقة',
    subtitleEn: 'Dynamic real-time WebGL/CSS aura effects, customizable ki bursts, and fighter avatar sync.',
    subtitleAr: 'مؤثرات بصرية حركية، جزيئات طاقة نيونية متفجرة، وتخصيص هالة وأفاتار المحارب الخاص بك.',
    badgeEn: 'AURA 2050',
    badgeAr: 'شحن الهالة',
    icon: Sparkles,
    accentColor: '#00F0FF',
    statsEn: '5 Elemental Shaders',
    statsAr: '5 عناصر طاقة نيونية',
    featuresEn: ['Multi-color Plasma Aura', 'Sound FX Responsive Shaders', 'Avatar Customizer Sync', 'Ki Level Level-up'],
    featuresAr: ['بلازما طاقة متعددة الألوان', 'تأثيرات متفاعلة مع الصوت', 'مزامنة مع صورة الملف الشخصي', 'رفع رتبة الهالة S-Rank']
  },
  {
    id: 'arena',
    category: 'combat',
    titleEn: 'Live Combat & Interactive Boxing Striking Dojo',
    titleAr: 'حلبة النزالات والملاكمة واختبار ردود الأفعال اللحظية',
    subtitleEn: 'Fast-paced shadow strikes, live combo hits counters, and target reflex matrix.',
    subtitleAr: 'لكمات تفاعلية، سرعة رد الفعل اللحظية، وتحديات ملاكمة لرفع اللياقة القصوى.',
    badgeEn: 'BOXING & COMBAT',
    badgeAr: 'قتال وملاكمة',
    icon: Swords,
    accentColor: '#FFE600',
    statsEn: 'Infinite Combos',
    statsAr: 'كومبو لا نهائي',
    featuresEn: ['Live Shadow Striking Matrix', 'Heart Rate Load Simulation', 'Combo Burst Audio Engine', 'Round Ticker Counter'],
    featuresAr: ['مصفوفة اللكمات والضربات', 'محاكاة جهد القلب اللحظي', 'مؤثرات صوتية للكومبو المتتابع', 'عداد الجولات وتصاعد الصعوبة']
  },
  {
    id: 'yardCamp',
    category: 'combat',
    titleEn: '🌍 YARD 300 Global Expedition Camp (300 Athletes / Camp)',
    titleAr: '🌍 معسكر يارد 300 الدولي // 300 شخص لكل مخيم',
    subtitleEn: 'Strictly 300 athletes per camp under direct supervision of the Three Founders and our international coaching crew.',
    subtitleAr: 'معسكر يضم 300 شخص لكل مخيم تحت إشراف المؤسسين الثلاثة وباقي فريق المدربين حول العالم، لأشخاص ذوي معايير عالية يوازنون بين حياتهم العملية وأجسادهم.',
    badgeEn: '300 ATHLETES / CAMP',
    badgeAr: '300 شخص لكل مخيم',
    icon: Compass,
    accentColor: '#FFE600',
    image: '/images/yard_camp_expedition.jpg',
    statsEn: '300 / Camp',
    statsAr: '300 بكل مخيم',
    featuresEn: ['Under Supervision of 3 Founders', 'International Coaching Crew', '3 Grand Expeditions Annually', 'Strictly 300 Athletes Per Camp'],
    featuresAr: ['تحت إشراف المؤسسين الثلاثة', '3 مغامرات كبرى سنوياً', '300 شخص لكل مخيم بالتحديد']
  },
  {
    id: 'ai-coach',
    category: 'combat',
    titleEn: 'AI Sensei Ryu — Smart Interactive Combat Coach',
    titleAr: 'المدرب الذكي (السينسي ريو) — توجيهات ومهام يومية',
    subtitleEn: 'Instant adaptive workout counsel, daily quests, and personalized recovery cues.',
    subtitleAr: 'نصائح تدريب ذكية فورية، مهام يومية لكسب المكافآت، وتوجيهات تعافي مخصصة.',
    badgeEn: 'AI COACH SENSEI',
    badgeAr: 'كوتش الذكاء الاصطناعي',
    icon: Bot,
    accentColor: '#FF007A',
    statsEn: 'Gemini S-Rank',
    statsAr: 'نظام تدريب تكيفي',
    featuresEn: ['Dynamic Muscle Fatigue Q&A', 'Daily Bounty Quests', 'Hyrox & Shaolin Workout Plans', 'Recovery Timelines'],
    featuresAr: ['إجابات فورية على إجهاد العضلات', 'مهام يومية لكسب النقاط', 'خطط هايروكس وشاولين مخصصة', 'جداول استشفاء ذكية']
  },
  {
    id: 'products',
    category: 'gear',
    titleEn: 'YARD300 Luxury Store — Exclusive 300-Piece Atelier',
    titleAr: 'متجر YARD300 الفخم — إصدار حصري 300 قطعة فقط لنخبة الأبطال',
    subtitleEn: 'Ultra-luxury athletic apparel and military-grade combat equipment. Strictly 300 serialized pieces minted worldwide.',
    subtitleAr: 'علامة فخمة وحصرية بخامات فائقة الجودة. نبيع بدقة 300 قطعة فقط من كل منتج حول العالم لنخبة الرياضيين.',
    badgeEn: '300 LIMITED DROP',
    badgeAr: 'إصدار فاخر 300 قطعة',
    icon: ShoppingBag,
    accentColor: '#FFE600',
    statsEn: 'Strictly 300 Pieces / Drop',
    statsAr: '300 قطعة فقط لكل منتج',
    featuresEn: ['Pinnacle Japanese & Military Craftsmanship', 'Strictly 300 Serialized Units Globally', 'Exclusively for Elite Athletes & Champions', 'Apex Compression & Carbon Gear'],
    featuresAr: ['خامات فائقة الجودة وتيتانيوم عسكري', '300 قطعة حصرية مرقمة عالمياً', 'مخصص حصرياً لنخبة الرياضيين والأبطال', 'قمصان وشورتات ومعدات قتالية نادرة']
  },
  {
    id: 'checkout',
    category: 'gear',
    titleEn: 'Checkout & Global Payment Services',
    titleAr: 'بوابة الدفع الإلكتروني وتأكيد الطلبات',
    subtitleEn: 'Encrypted checkout supporting Visa, Apple Pay, Google Pay, PayPal, and MetaMask Web3.',
    subtitleAr: 'دفع فوري مشفر يدعم فيزا، أبل باي، جوجل باي، باي بال، ومحفظة ميتا ماسك الرقمية.',
    badgeEn: 'PAYMENT GATEWAY',
    badgeAr: 'خدمات الدفع',
    icon: CreditCard,
    accentColor: '#00F0FF',
    statsEn: '5 Secure Gateways',
    statsAr: '5 بوابات دفع معتمدة',
    featuresEn: ['Visa & Mastercard Clearance', ' Apple Pay Express', 'GPay Google Pay Tokenization', 'PayPal Protection & MetaMask Web3'],
    featuresAr: ['دفع فيزا وماستركارد آمن', 'الدفع الفوري عبر Apple Pay', 'بوابة Google Pay المشفرة', 'حماية المشتري في PayPal وميتا ماسك']
  },
  {
    id: 'tickets',
    category: 'combat',
    titleEn: 'YARD 300 Championships & Live Event Tickets',
    titleAr: 'تذاكر بطولات وفعاليات YARD 300 الكبرى',
    subtitleEn: 'Reserve official passes for YARD Cyber Grand Prix, VIP ringside seats, and athlete trials.',
    subtitleAr: 'حجز مقاعد الحلبة وتذاكر بطولة السايبر الكبرى وتجارب شاولين وهايروكس الحصرية.',
    badgeEn: 'LIVE EVENTS',
    badgeAr: 'تذاكر البطولات',
    icon: Ticket,
    accentColor: '#E50914',
    statsEn: 'Booking Schedule & Info',
    statsAr: 'مواعيد وجدول الحجز',
    featuresEn: ['Official Cyber Grand Prix Passes', 'VIP Ringside & Founders Gala Access', 'Shaolin Iron Trials Registrations', 'Encrypted Anti-Scalp Digital Badges'],
    featuresAr: ['بطولة السايبر الكبرى الرسمية', 'المنصة الملكية ولقاء المؤسسين الثلاثة', 'تسجيل المنافسين في تجارب شاولين', 'تذاكر إلكترونية مشفرة برمز QR']
  },
  {
    id: 'customClub',
    category: 'community',
    titleEn: 'My Custom Athletic Club ($30 / Level 3)',
    titleAr: 'ناديي الرياضي الخاص (30$ / المستوى 3)',
    subtitleEn: 'Own & name your athletic club, set custom badges & themes, broadcast 24h stories, and recruit followers.',
    subtitleAr: 'امتلاك وتسمية ناديك الرياضي الخاص، وضع شعار وألوان خاصة، نشر ستوريات يومية وتدريبات قتالية، واستقطاب متابعين.',
    badgeEn: '$30 · LEVEL 3 CLUB',
    badgeAr: 'نادي ونشر ستوريات (30$)',
    icon: Crown,
    accentColor: '#A855F7',
    statsEn: '$30 License · Stories',
    statsAr: 'ترخيص 30$ · ستوريات',
    featuresEn: ['Custom Club Name & Logo Studio', '24h Broadcast Story Engine', 'Unique Referral URL & QR Invite', 'Follower & Member Recruitment'],
    featuresAr: ['أستوديو تسمية وشعار النادي المخصص', 'نظام نشر الستوريات اليومية 24 ساعة', 'رابط ورمز QR دعوة حصري لناديك', 'دعوة واستقطاب المتابعين والأعضاء']
  },
  {
    id: 'leaderboard',
    category: 'community',
    titleEn: 'S-Rank Champions Hall & Global Leaderboard',
    titleAr: 'قاعة الأساطير ولوحة الصدارة العالمية',
    subtitleEn: 'Compete with elite anime athletes worldwide for weekly 10,000 YARDX bounty prizes.',
    subtitleAr: 'تنافس على مكافأة 10,000 عملة YARDX مع نخبة الأبطال والرياضيين حول العالم.',
    badgeEn: 'HALL OF FAME',
    badgeAr: 'قاعة المشاهير',
    icon: Trophy,
    accentColor: '#E50914',
    statsEn: 'Weekly Bounty Pot',
    statsAr: 'جوائز وتحديات أسبوعية',
    featuresEn: ['Real-time Regional Rankings', 'Aura Level Tier Badges', 'Weekly 10,000 YARDX Drops', 'Challenger Leader Profiles'],
    featuresAr: ['تصنيفات إقليمية وعالمية مباشرة', 'أوسمة رتب الهالة S-Rank', 'توزيعات 10,000 YARDX أسبوعياً', 'ملفات أبطال الصدارة']
  },
  {
    id: 'profile',
    category: 'core',
    titleEn: 'Champion Bio Profile & Combat Streak Tracker',
    titleAr: 'ملف البطل الحيوي وسلسلة القتال ونقاط الهالة',
    subtitleEn: 'Track your daily active combat streak, power level progression, hydration, and radar attributes.',
    subtitleAr: 'تتبع سلسلة أيامك النشطة، نقاط الهالة (Aura Points)، شرب الماء، وشجرة خصائص البطل بالرادار.',
    badgeEn: 'ATHLETE BIO',
    badgeAr: 'ملف البطل',
    icon: User,
    accentColor: '#00F0FF',
    statsEn: 'Combat Streak AP',
    statsAr: 'سلسلة القتال ومكافآت AP',
    featuresEn: ['Daily Active Combat Streak', 'Aura Points (AP) Multipliers', 'Hydration & RHR Progression', 'Radar Attribute Graph'],
    featuresAr: ['سلسلة النشاط اليومي المتتالية', 'مضاعف نقاط الهالة التراكمي', 'تتبع السوائل ونبض الراحة', 'مخطط الرادار لخصائص المقاتل']
  },
  {
    id: 'about',
    category: 'community',
    titleEn: 'Samurai Philosophy & The YARD300 Lore',
    titleAr: 'فلسفة الساموراي ورؤية براند YARD300',
    subtitleEn: 'The relentless fusion of anime fighting spirit, endurance physiology, and modern athletic science.',
    subtitleAr: 'الدمج الثوري بين روح قتال الساموراي وإصرار الأنمي وأحدث علوم اللياقة البدنية والفسيولوجيا.',
    badgeEn: 'THE LORE',
    badgeAr: 'القصة والرؤية',
    icon: BookOpen,
    accentColor: '#A855F7',
    statsEn: '2050 Vision',
    statsAr: 'رؤية 2050 الرياضية',
    featuresEn: ['The 3 Pillars of Discipline', 'Hyrox & Shaolin Synthesis', 'The Creed of YARD Champions', 'Future Cyberpunk Vision'],
    featuresAr: ['أركان الانضباط القتالي الثلاثة', 'التناغم بين الهايروكس والشاولين', 'ميثاق أبطال مجتمع يارد', 'رؤية المستقبل الرياضي 2050']
  },
  {
    id: 'championStory',
    category: 'community',
    titleEn: 'Monthly Champion Story & Video Spotlight',
    titleAr: 'قصة وفيلم بطل الشهر (المتصدّر شهرياً)',
    subtitleEn: 'Exclusive monthly documentary video and training breakdown of the reigning #1 leaderboard champion.',
    subtitleAr: 'فيلم وثائقي شهري حصري وتفاصيل تدريب وروتين البطل المتصدر للترتيب العالمي.',
    badgeEn: 'MONTHLY VIDEO',
    badgeAr: 'وثائقي شهري',
    icon: Trophy,
    accentColor: '#FFE600',
    statsEn: 'Monthly Hero Feature',
    statsAr: 'قصة بطل متجددة شهرياً',
    featuresEn: ['Exclusive 4K Champion Documentary', 'Hour-by-Hour Training Schedule', 'Nutritional & Gear Secrets', 'Monthly Champion Archives'],
    featuresAr: ['فيلم وثائقي 4K حصري للبطل', 'الجدول التدريبي اليومي بالتفصيل', 'أسرار التغذية والعتاد المعتمد', 'أرشيف أبطال الأشهر السابقة']
  }
];

export const OptionsServicesHub: React.FC<OptionsServicesHubProps> = ({
  currentLang = 'en',
  onSelectOption,
  onSelectProduct,
  onBackToHome
}) => {
  const isAr = currentLang === 'ar';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'core' | 'combat' | 'gear' | 'community'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOptions = SERVICE_OPTIONS.filter((opt) => {
    const matchesFilter = selectedFilter === 'all' || opt.category === selectedFilter;
    const matchesSearch = 
      opt.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.subtitleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.subtitleAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={`min-h-screen pt-28 pb-24 bg-[#0A0B10] text-white relative overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Background Neon Gradients & Speedlines */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1800px] mx-auto px-4 md:px-8 relative z-10">
        
        {/* Navigation back and header bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {onBackToHome && (
            <button 
              onClick={onBackToHome}
              className="group flex items-center gap-2 text-sm font-bold text-[#00F0FF] hover:text-white transition-colors cursor-pointer"
            >
              <span className="text-xl">{isAr ? '→' : '←'}</span>
              <span>{isAr ? 'العودة للرئيسية' : isFr ? "Retour à l'Accueil" : isEs ? 'Volver al Inicio' : 'Back to Home'}</span>
            </button>
          )}

          <div className="px-4 py-1.5 rounded-full bg-[#141622] border border-[#FFE600] text-xs font-black text-[#FFE600] font-anime shadow-[0_0_15px_rgba(255,230,0,0.3)]">
            ⚡ YARD300 // COMPLETE OPTIONS & SERVICES MATRIX
          </div>
        </div>

        {/* Hero Banner for Options */}
        <div className="bg-[#12131C] rounded-3xl p-8 md:p-10 border-2 border-[#E50914] shadow-[0_0_40px_rgba(229,9,20,0.3)] mb-10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl relative overflow-hidden">
          <div className="space-y-3 max-w-3xl">
            <span className="px-3 py-1 rounded-full bg-[#E50914] text-white text-[10px] font-black font-anime uppercase tracking-wider">
              🔥 ALL-IN-ONE ECOSYSTEM
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-anime text-white">
              {isAr ? 'قائمة الخيارات والخدمات والمزايا' : isFr ? 'MATRICE DES SERVICES & OPTIONS' : isEs ? 'MATRIZ DE SERVICIOS Y OPCIONES' : 'OPTIONS, SERVICES & ENGINE MATRIX'}
            </h1>
            <p className="text-sm md:text-base text-gray-300 font-bold leading-relaxed">
              {isAr
                ? 'تم نقل كافة غرف ومحركات وخدمات YARD300 إلى هذه البوابة المنظمة بدقة لتتمكن من الوصول الفوري لأي ميزة بنقرة واحدة.'
                : isFr
                ? "Toutes les chambres d'entraînement, moteurs biométriques, dojos de combat et ateliers YARD300 sont réunis ici pour un accès direct instantané."
                : isEs
                ? 'Todas las cámaras de entrenamiento, motores biométricos, dojos de combate y catálogo YARD300 están indexados aquí para un acceso inmediato.'
                : 'All YARD300 chambers, AI engines, biometric labs, and stores are indexed here for instant zero-latency access.'}
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col gap-3">
            {/* Live Search */}
            <div className="relative">
              <Search className={`w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'}`} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث في الخدمات والمحركات...' : isFr ? 'Rechercher des services et chambres...' : isEs ? 'Buscar servicios y cámaras...' : 'Search chambers & tools...'}
                className={`bg-[#0A0B10] border border-gray-700 focus:border-[#00F0FF] rounded-xl py-2.5 text-xs text-white font-bold outline-none w-full md:w-64 transition-all ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
              />
            </div>

            {/* Quick Count Badge */}
            <div className="text-center text-xs font-black font-anime text-[#FFE600] bg-[#181A28] py-1.5 px-3 rounded-xl border border-gray-800">
              {filteredOptions.length} {isAr ? 'خدمات ومحركات متاحة' : isFr ? 'Chambres & Services Actifs' : isEs ? 'Cámaras y Servicios Activos' : 'Chambers Available'}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {[
            { id: 'gear', labelEn: '🛍️ Official Gear Store (300 Units)', labelAr: '🛍️ متجر العتاد الفاخر (300 قطعة)', labelFr: '🛍️ Boutique Officielle (300 Pièces)', labelEs: '🛍️ Tienda Oficial (300 Piezas)' },
            { id: 'core', labelEn: '⚡ Core Biometrics & AI', labelAr: '⚡ المحركات الحيوية والذكاء', labelFr: '⚡ Biométrie & IA Centrale', labelEs: '⚡ Biometría e IA Central' },
            { id: 'combat', labelEn: '🥊 Combat & Boxing Dojo', labelAr: '🥊 القتال وحلبة الملاكمة', labelFr: '🥊 Dojo Combat & Boxe', labelEs: '🥊 Dojo de Combate y Boxeo' },
            { id: 'community', labelEn: '👑 Community, Hall & Tickets', labelAr: '👑 المجتمع والبطولات والتذاكر', labelFr: '👑 Communauté & Événements', labelEs: '👑 Comunidad y Eventos' },
            { id: 'all', labelEn: '🌐 All Services & Chambers', labelAr: '🌐 المنظومة الكاملة مع المتجر', labelFr: '🌐 Tous les Services & Chambres', labelEs: '🌐 Todos los Servicios y Cámaras' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playButtonClick();
                setSelectedFilter(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black font-anime transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === tab.id
                  ? 'bg-gradient-to-r from-[#E50914] to-[#FFE600] text-black shadow-[0_0_20px_rgba(229,9,20,0.5)] scale-105'
                  : 'bg-[#12131C] text-gray-300 border border-gray-800 hover:border-[#00F0FF]/50 hover:text-white'
              }`}
            >
              <span>{isAr ? tab.labelAr : isFr ? tab.labelFr : isEs ? tab.labelEs : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Services & Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.id}
                className="bg-[#12131C] border border-gray-800 hover:border-[#00F0FF]/80 rounded-3xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Card Banner Image or Cyber HUD Container */}
                  {opt.image ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img loading="lazy" decoding="async" 
                        src={opt.image} 
                        alt={opt.titleEn}
                        onError={handleImageError}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12131C] via-[#12131C]/40 to-transparent"></div>
                      
                      {/* Floating Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-anime text-black shadow-md"
                          style={{ backgroundColor: opt.accentColor }}
                        >
                          {isAr ? opt.badgeAr : opt.badgeEn}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#0A0B10]/80 text-[#00F0FF] text-[10px] font-black font-anime border border-gray-700">
                          {isAr ? opt.statsAr : opt.statsEn}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#07080D]/90 border border-gray-800 flex items-center justify-center text-gray-300 shrink-0">
                          <Icon className="w-4 h-4 text-gray-300" />
                        </div>
                        <h3 className="text-base font-black font-anime text-white line-clamp-1">
                          {isAr ? opt.titleAr : opt.titleEn}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-[#121526] via-[#0A0C16] to-[#181A2D] flex flex-col justify-between p-4">
                      {/* Floating Badges */}
                      <div className="flex justify-between items-center relative z-10">
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-anime text-black shadow-md"
                          style={{ backgroundColor: opt.accentColor }}
                        >
                          {isAr ? opt.badgeAr : opt.badgeEn}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#0A0B10]/80 text-emerald-400 text-[10px] font-black font-anime border border-gray-800">
                          {isAr ? opt.statsAr : opt.statsEn}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 relative z-10 my-auto">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shrink-0"
                          style={{ backgroundColor: `${opt.accentColor}25`, color: opt.accentColor, border: `1px solid ${opt.accentColor}40` }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black font-anime text-white line-clamp-2">
                          {isAr ? opt.titleAr : opt.titleEn}
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-gray-300 font-bold leading-relaxed">
                      {isAr ? opt.subtitleAr : opt.subtitleEn}
                    </p>

                    {/* Features List */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-800">
                      {(isAr ? opt.featuresAr : opt.featuresEn).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-gray-300 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.accentColor }}></span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Launch Action Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      soundFX.playButtonClick();
                      soundFX.playAuraBurst();
                      if (opt.id === 'products') {
                        setSelectedFilter('gear');
                        setTimeout(() => {
                          const el = document.getElementById('store-gear-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      } else {
                        onSelectOption(opt.id);
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-[#181A28] hover:bg-[#00F0FF] text-white hover:text-black font-black font-anime text-xs border border-gray-700 hover:border-[#00F0FF] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md group-hover:scale-[1.02]"
                  >
                    <span>{isAr ? 'فتح وتشغيل القسم الآن ⚡' : isFr ? 'OUVRIR LA CHAMBRE ⚡' : isEs ? 'ABRIR CÁMARA AHORA ⚡' : 'LAUNCH CHAMBER NOW ⚡'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Embedded YARD300 Luxury Store & Activewear Collection in Options Hub */}
        {(selectedFilter === 'gear' || selectedFilter === 'all') && (
          <div id="store-gear-section" className="mt-16 pt-12 border-t-2 border-[#FFE600]/30">
            <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase text-[#FFE600] font-anime tracking-wider block">
                  {isAr ? '⚡ متجر عتاد الأبطال الفاخر (إصدار محدود 300 قطعة لكل منتج)' : isFr ? '⚡ ATELIER LUXE OFFICIEL YARD300 (STRICTEMENT 300 PIÈCES)' : isEs ? '⚡ TIENDA OFICIAL DE LUJO YARD300 (ESTRICTAMENTE 300 PIEZAS)' : '⚡ OFFICIAL YARD300 LUXURY ATELIER (STRICTLY 300 PIECES PER DROP)'}
                </span>
                <h2 className="text-2xl md:text-4xl font-black font-anime text-white mt-1">
                  {isAr ? 'تصفح كافة منتجات المتجر وخياراتها مباشرة داخل الخيارات' : isFr ? "Parcourir Tout l'Équipement Directement dans les Options" : isEs ? 'Explora Todo el Equipamiento Directamente en Opciones' : 'Browse All Store Gear & Custom Options Directly in Options'}
                </h2>
                <p className="text-xs md:text-sm text-gray-300 font-bold mt-1.5">
                  {isAr 
                    ? '✨ جميع المنتجات متوفرة بإصدارين كاملين: رجالي (الأسود الليلي) ونسائي (الأبيض اللؤلؤي) مع المقاسات وتفاصيل القصات الهندسية.' 
                    : isFr
                    ? '✨ Chaque produit est disponible en deux éditions sur-mesure : Hommes (Noir Obsidienne) et Femmes (Blanc Perle) avec guide des tailles complet.'
                    : isEs
                    ? '✨ Cada producto está disponible en dos ediciones a medida: Hombres (Negro Obsidiana) y Mujeres (Blanco Perla) con tallas completas.'
                    : '✨ Every product is available in two bespoke editions: Men (Obsidian Black) and Women (Pearl White) with complete sizing.'}
                </p>
              </div>
            </div>

            <ProductGrid 
              currentLang={currentLang}
              onProductClick={(p) => {
                if (onSelectProduct) {
                  onSelectProduct(p);
                } else {
                  onSelectOption('products');
                }
              }}
            />
          </div>
        )}

      </div>

    </div>
  );
};

export default OptionsServicesHub;
