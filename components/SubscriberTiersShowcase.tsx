import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Zap, 
  RotateCw, 
  Download, 
  Check, 
  CheckCircle2, 
  Crown,
  Eye,
  X,
  CreditCard,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { YARD300_BRAND_LOGO, handleImageError } from '../constants';

interface SubscriberTiersShowcaseProps {
  currentLang?: Language;
  onNavigateToClub?: () => void;
}

interface TierCardModel {
  level: number;
  id: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  cardRank: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  holographicClass: string;
  auraScore: string;
  yardxTokens: string;
  privilegesEn: string[];
  privilegesAr: string[];
  quoteEn: string;
  quoteAr: string;
}

const TIERS: TierCardModel[] = [
  {
    level: 1,
    id: 'tier-iron',
    nameEn: 'IRON INITIATE',
    nameAr: 'محارب الحديد — المستوى 1',
    titleEn: 'Foundational Endurance & Habit Formation',
    titleAr: 'تأسيس التحمل وبناء الانضباط القتالي',
    cardRank: 'TIER 1 // VERIFIED INITIATE',
    accentColor: '#00F0FF',
    borderColor: '#00F0FF',
    bgGradient: 'from-[#0B0D15] via-[#101424] to-[#181D33]',
    holographicClass: 'hover:shadow-[0_0_50px_rgba(0,240,255,0.4)]',
    auraScore: '4,200',
    yardxTokens: '4,200 YARDX',
    privilegesEn: [
      'Official YARD Digital Identity & Biometric Record',
      'Instant 4,200 YARDX Combat Tokens Welcome Drop',
      'Access to Level 1 Combat Conditioning Library',
      'Live Leaderboard Weekly Qualification',
      'Exclusive Physical Iron Tier Patch (Delivered on Milestone)'
    ],
    privilegesAr: [
      'هوية رياضية رقمية موثقة وسجل بيومتري دائم',
      'منحة فورية بقيمة 4,200 عملة YARDX قتالية لحسابك',
      'دخول مكتبة التمارين الوظيفية والتأسيس البدني',
      'التصنيف الأسبوعي المعتمد في لوحة الأبطال',
      'شارة حديدية مطرزة تُرسل للمشترك عند إتمام أول شهر'
    ],
    quoteEn: '“Discipline is choosing between what you want now and what you want most.”',
    quoteAr: '«الانضباط هو الاختيار بين ما تريده الآن، وما تريده أكثر من أي شيء آخر.»'
  },
  {
    level: 2,
    id: 'tier-kinetic',
    nameEn: 'KINETIC STRIKER',
    nameAr: 'المقاتل الحركي — المستوى 2',
    titleEn: 'High Velocity Aerobic Power & ACWR Mastery',
    titleAr: 'السرعة الانفجارية والتحكم بمؤشرات الحمل',
    cardRank: 'TIER 2 // KINETIC PRO',
    accentColor: '#FFE600',
    borderColor: '#FFE600',
    bgGradient: 'from-[#111218] via-[#1C180C] to-[#2B2308]',
    holographicClass: 'hover:shadow-[0_0_55px_rgba(255,230,0,0.45)]',
    auraScore: '7,450',
    yardxTokens: '7,450 YARDX',
    privilegesEn: [
      'All Tier 1 Privileges + Automated ACWR Injury Alerts',
      'Grant of 7,450 YARDX Tokens & 2x Multiplier on Gauntlets',
      'Access to Advanced Hyrox & Calisthenics Gauntlets',
      'Priority Seating Access for Tournament Arena Tickets',
      'Exclusive Gold Kinetic Foil Holographic Digital Credential'
    ],
    privilegesAr: [
      'جميع مزايا المستوى 1 + تنبيهات خوارزمية ACWR الذكية لتفادي الإصابات',
      'رصيد 7,450 عملة YARDX ومضاعف مكافآت 2x في النزالات',
      'دخول حصري لتحديات الهايروكس والكاليستنكس المتقدمة',
      'أولوية المقاعد في بطولات النزالات الحية ومدرجات التذاكر',
      'بطاقة ذهبية حركية ثلاثية الأبعاد مشفرة'
    ],
    quoteEn: '“Velocity without precision is chaos. True power is controlled fire.”',
    quoteAr: '«السرعة بلا دقة فوضى، والقوة الحقيقية نار موجهة بدقة متناهية.»'
  },
  {
    level: 3,
    id: 'tier-titan',
    nameEn: 'TITAN APEX',
    nameAr: 'تيتان القمة — المستوى 3',
    titleEn: 'Neuromuscular Mastery & Competition Ready',
    titleAr: 'القمة العصبية والجاهزية التنافسية الدولية',
    cardRank: 'TIER 3 // TITAN APEX MASTER',
    accentColor: '#FF007A',
    borderColor: '#FF007A',
    bgGradient: 'from-[#150912] via-[#210D1D] to-[#330A2A]',
    holographicClass: 'hover:shadow-[0_0_60px_rgba(255,0,122,0.5)]',
    auraScore: '9,120',
    yardxTokens: '9,120 YARDX',
    privilegesEn: [
      '👑 Exclusive Custom Athletic Club Ownership (Name, Custom Logo & Colors)',
      '📱 Broadcast 24-Hour Club Stories & Daily Squad Combat Drills',
      '🔗 Recruit Followers Inside & Outside App with Unique URL & QR Code',
      'All Tier 2 Privileges + 1-on-1 AI Biometric Prescription',
      'Direct 9,120 YARDX Staked Combat Currency Allocation',
      'Serialized Metallic Titanium Member Pass with NFC Chip'
    ],
    privilegesAr: [
      '👑 امتلاك وإدارة ناديك الرياضي الخاص (اسم مخصص، شعار وألوان خاصة)',
      '📱 نشر ستوريات يومية 24 ساعة وتحديات تمارين قتالية للأعضاء',
      '🔗 إضافة متابعين لناديك من داخل وخارج التطبيق عبر رابط ودعوات QR',
      'جميع مزايا المستوى 2 + بروتوكولات استشفاء بيومتري ذكية مخصصة',
      'رصيد 9,120 عملة YARDX موثقة ومربوطة بمحفظتك',
      'بطاقة تيتانيوم حقيقية مرقمة بشريحة NFC مشفرة'
    ],
    quoteEn: '“The apex is reserved only for those who endure what others refuse to feel.”',
    quoteAr: '«لا يصعد القمة إلا من تحمل ما عجز الآخرون عن مجرد مواجهته.»'
  },
  {
    level: 4,
    id: 'tier-overdrive',
    nameEn: 'GOD-TIER OVERDRIVE',
    nameAr: 'أوفر درايف الأساطير — المستوى 4',
    titleEn: 'Living Legend • Supreme Athletic Sovereignty',
    titleAr: 'الأسطورة الحية • السيادة الرياضية المطلقة',
    cardRank: 'TIER 4 // GOD-TIER OVERDRIVE',
    accentColor: '#E50914',
    borderColor: '#E50914',
    bgGradient: 'from-[#180507] via-[#27090C] to-[#3D080E]',
    holographicClass: 'hover:shadow-[0_0_70px_rgba(229,9,20,0.65)]',
    auraScore: '9,999',
    yardxTokens: '9,999 YARDX',
    privilegesEn: [
      'Permanent Induction into the All-Time Hall of Fame',
      'Maximum 9,999 YARDX Sovereign Token Treasury Allocation',
      'VIP Lifetime Access to All Global YARD Combat Events',
      'Co-Design Input on Next-Gen Limited Edition Drops',
      'Heavyweight Serialized Obsidian & Gold Emblem Plaque'
    ],
    privilegesAr: [
      'تخليد دائم في لوحة شرف أبطال كل الأوقات (Hall of Fame)',
      'تخصيص خزينة 9,999 عملة YARDX سيادية الأعلى في المنظومة',
      'تذاكر VIP ملكية دائمة لجميع بطولات ومهرجانات YARD العالمية',
      'المشاركة في اختبار واعتماد تصاميم العتاد المحدود الجديد',
      'درع تذكاري أسود مرصع بالذهب الخالص يحمل اسم البطل'
    ],
    quoteEn: '“Beyond human boundaries lies the realm of relentless will.”',
    quoteAr: '«خلف حدود المستحيل يقبع عالم الإرادة التي لا تنكسر.»'
  }
];

export const SubscriberTiersShowcase: React.FC<SubscriberTiersShowcaseProps> = ({
  currentLang = 'en',
  onNavigateToClub
}) => {
  const isAr = currentLang === 'ar';
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [athleteName, setAthleteName] = useState<string>('YAM SUW');
  const [memberId, setMemberId] = useState<string>('YD-300-8842');
  const [cardEdition, setCardEdition] = useState<'men' | 'women'>('men');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [showPrivilegesModal, setShowPrivilegesModal] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const activeTier = TIERS.find(t => t.level === selectedLevel) || TIERS[0];
  const isWomen = cardEdition === 'women';

  const handleSelectLevel = (level: number) => {
    soundFX.playButtonClick();
    setSelectedLevel(level);
    setIsFlipped(false);
  };

  const handleFlipCard = () => {
    soundFX.playButtonClick();
    setIsFlipped(!isFlipped);
  };

  const handleDownloadCard = () => {
    soundFX.playButtonClick();
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      soundFX.playSuccess();
      setTimeout(() => setDownloadSuccess(false), 3500);
    }, 1000);
  };

  const handleCopyId = () => {
    soundFX.playButtonClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(memberId).catch(() => {});
    }
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleShareOnX = () => {
    soundFX.playButtonClick();
    const text = isAr 
      ? `تحققت من بطاقتي الاستثنائية في YARD300 (${isWomen ? 'إصدار بطلات يارد' : 'إصدار أبطال يارد'}) — المستوى ${activeTier.level}: ${activeTier.nameAr.split('—')[0]}! 🔥`
      : `My YARD300 Elite Digital Credential (${isWomen ? 'Women’s Edition' : 'Men’s Edition'}) — Tier ${activeTier.level}: ${activeTier.nameEn}! 🔥`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&via=YAMSUW300`, '_blank', 'noopener,noreferrer');
  };

  const handleSubscribeToggle = () => {
    soundFX.playStartTrainingSound();
    setIsSubscribed(true);
    setShowPrivilegesModal(true);
  };

  return (
    <section id="subscriber-tiers" className="py-16 sm:py-20 px-3 sm:px-4 md:px-8 max-w-[1400px] w-full max-w-full mx-auto relative overflow-hidden overflow-x-hidden">
      
      {/* Background Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] blur-[150px] rounded-full pointer-events-none transition-colors duration-700 ${
        isWomen ? 'bg-[#FF007A]/12' : 'bg-[#00F0FF]/10'
      }`} />

      {/* Sleek Minimalist Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3 relative z-10">
        {/* Mecha HUD Telemetry Bar */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E111C] shadow-[0_0_20px_rgba(0,240,255,0.35)] relative overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-hud-blink" />
          <Sparkles className="w-3.5 h-3.5 text-[#FFE600] animate-pulse" />
          <span className="text-[10px] md:text-[11px] font-black font-mono tracking-widest text-[#00F0FF] uppercase">
            {isAr ? 'بروتوكول الهوية القتالية // YARD300 MECHA SUBSCRIBER HUD' : 'TAC.PROTOCOL // YARD300 MECHA SUBSCRIBER HUD'}
          </span>
          <span className="hidden sm:inline-block text-[9px] font-mono text-gray-400 border-l border-gray-700 pl-2">
            GRID://TOKYO-CYBER-01
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black font-anime text-white tracking-tight relative">
          <span className="inline-block hover-cyber-glitch cursor-default">
            {isAr ? 'بطاقة النخبة ' : 'THE EXCEPTIONAL '}
            <span className="text-[#FFE600] neon-text-yellow">{isAr ? 'الاستثنائية' : 'CREDENTIAL'}</span>
          </span>
        </h2>
        
        <p className="text-xs md:text-sm text-gray-300 font-bold max-w-xl mx-auto leading-relaxed">
          {isAr 
            ? 'تصميم قتالي ميكا مستقبلي يجسد هيبة الأبطال. واجهة HUD تفاعلية ومزايا استثنائية تُكشف للمشتركين فقط عند الانضمام.' 
            : 'Futuristic Mecha-HUD credential engineered for elite athletes. Interactive biometric display with unlocked privileges revealed upon activation.'}
        </p>

        {/* Division Switcher (Men vs Women) */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={() => {
              soundFX.playButtonClick();
              setCardEdition('men');
            }}
            className={`px-4 py-2 rounded-xl border font-anime font-black text-xs transition-all cursor-pointer flex items-center gap-2 hover-cyber-glitch relative ${
              cardEdition === 'men'
                ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-white neon-border-cyan scale-105'
                : 'border-gray-800 bg-[#10121C] text-gray-400 hover:text-white hover:border-[#00F0FF]/50'
            }`}
          >
            <span>⚔️</span>
            <span>{isAr ? 'أوبسيديان وتيتانيوم (رجالي)' : 'OBSIDIAN TITANIUM (MEN)'}</span>
            {cardEdition === 'men' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playButtonClick();
              setCardEdition('women');
            }}
            className={`px-3.5 py-1.5 rounded-xl border font-anime font-black text-xs transition-all cursor-pointer flex items-center gap-2 hover-cyber-glitch relative ${
              cardEdition === 'women'
                ? 'border-[#A855F7] bg-[#A855F7]/25 text-white scale-105 shadow-[0_0_15px_rgba(168,85,247,0.45)]'
                : 'border-gray-800 bg-[#10121C] text-gray-400 hover:text-white hover:border-[#A855F7]/50'
            }`}
          >
            <span>💜</span>
            <span>{isAr ? 'أسود وبنفسجي ملكي (نسائي)' : 'OBSIDIAN & PURPLE (WOMEN)'}</span>
            {cardEdition === 'women' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-ping" />
            )}
          </button>
        </div>

        {/* Minimalist 4 Tiers Level Selector with glowing neon anime currency badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5">
          {TIERS.map(tier => (
            <button
              key={tier.level}
              type="button"
              onClick={() => handleSelectLevel(tier.level)}
              className={`px-3 py-1.5 rounded-xl border font-anime font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 hover-cyber-glitch ${
                selectedLevel === tier.level
                  ? 'bg-[#181A28] scale-105 ' + (isWomen ? 'border-[#A855F7] text-[#C084FC] shadow-[0_0_12px_rgba(168,85,247,0.4)]' : 'neon-border-yellow text-[#FFE600]')
                  : 'bg-[#0E1018] border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
              }`}
              style={{
                borderColor: selectedLevel === tier.level ? (isWomen ? '#A855F7' : tier.borderColor) : undefined,
                color: selectedLevel === tier.level ? (isWomen ? '#C084FC' : tier.accentColor) : undefined
              }}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>LVL {tier.level}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-white/20 text-[#FFE600] font-black">
                {tier.yardxTokens}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Focus: The Exceptional Compact Card Display in Mecha Cockpit HUD Frame */}
      <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3.5 relative">
        
        {/* Mecha HUD Reticle Frame Surrounding The Card */}
        <div className="w-full relative p-2.5 md:p-3.5 rounded-2xl bg-[#090A12]/85 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          {/* Tactical Mecha Corner Brackets */}
          <div className="hud-corner-bracket hud-corner-bracket-tl !w-3.5 !h-3.5 !border-t-2 !border-l-2" style={{ borderColor: isWomen ? '#A855F7' : '#00F0FF' }} />
          <div className="hud-corner-bracket hud-corner-bracket-tr !w-3.5 !h-3.5 !border-t-2 !border-r-2" style={{ borderColor: isWomen ? '#A855F7' : '#00F0FF' }} />
          <div className="hud-corner-bracket hud-corner-bracket-bl !w-3.5 !h-3.5 !border-b-2 !border-l-2" style={{ borderColor: isWomen ? '#A855F7' : '#00F0FF' }} />
          <div className="hud-corner-bracket hud-corner-bracket-br !w-3.5 !h-3.5 !border-b-2 !border-r-2" style={{ borderColor: isWomen ? '#A855F7' : '#00F0FF' }} />

          {/* Top Mecha HUD Telemetry Bar */}
          <div className="flex items-center justify-between pb-2 px-1 border-b border-white/10 text-[9px] font-mono font-bold text-gray-400">
            <span className="flex items-center gap-1.5" style={{ color: isWomen ? '#C084FC' : '#00F0FF' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              [ HUD.TARGET // LOCKED ]
            </span>
            <span className="text-gray-400 hidden sm:inline">
              SYS.SYNC: 99.8% • ARMOR: COMPOSITE TITANIUM
            </span>
            <span className="text-[#FFE600] font-anime flex items-center gap-1">
              <span>🪙 {activeTier.yardxTokens}</span>
              <span className="text-gray-500">|</span>
              <span>LVL {activeTier.level}</span>
            </span>
          </div>

          {/* Flip Hint & Status */}
          <div className="flex items-center justify-between w-full px-1 py-1.5 text-xs">
            <button
              type="button"
              onClick={handleFlipCard}
              className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white font-black font-anime cursor-pointer transition-colors hover-cyber-glitch"
            >
              <RotateCw className={`w-3 h-3 ${isWomen ? 'text-[#A855F7]' : 'text-[#00F0FF]'}`} />
              <span>{isAr ? (isFlipped ? 'عرض وجه البطاقة' : 'اقلب البطاقة للظهر') : (isFlipped ? 'Show Front Side' : 'Flip to Back')}</span>
            </button>

            <span className="font-mono text-[10px] text-gray-400 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isSubscribed ? 'bg-emerald-400 animate-ping' : 'bg-[#FFE600]'}`}></span>
              <span className="font-bold">{isSubscribed ? (isAr ? 'عضوية مفعلة ✓' : 'ACTIVE MEMBER ✓') : (isAr ? 'جاهزة للاشتراك' : 'READY TO ACTIVATE')}</span>
            </span>
          </div>

          {/* 3D Exceptional Compact Card Canvas with Hover Glitch & Glowing Neon Borders */}
          <div 
            className={`w-full aspect-[1.586/1] rounded-2xl p-4 md:p-5 relative overflow-hidden transition-all duration-700 transform border-2 cursor-pointer select-none hover-card-glitch group ${
              isWomen 
                ? 'bg-gradient-to-br from-[#0B0714] via-[#1B0B33] to-[#0A0416] border-[#A855F7] shadow-[0_0_30px_rgba(168,85,247,0.45),inset_0_0_15px_rgba(168,85,247,0.2)]' 
                : `bg-gradient-to-br ${activeTier.bgGradient} shadow-[0_0_35px_rgba(0,240,255,0.4),inset_0_0_15px_rgba(0,240,255,0.18)]`
            }`}
            style={{ 
              borderColor: isWomen ? '#A855F7' : activeTier.borderColor,
              boxShadow: isWomen 
                ? '0 0 25px rgba(168,85,247,0.45), inset 0 0 15px rgba(168,85,247,0.2)' 
                : `0 0 25px ${activeTier.accentColor}80, inset 0 0 15px ${activeTier.accentColor}33`
            }}
            onClick={handleFlipCard}
          >
            {/* Holographic Iridescent Sheen & CRT Scanline */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none opacity-60 mix-blend-overlay" />
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-scanline opacity-50" />
            
            <div 
              className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-35 animate-neon-pulse" 
              style={{ backgroundColor: isWomen ? '#A855F7' : activeTier.accentColor }} 
            />

            {!isFlipped ? (
              /* CARD FRONT */
              <div className="h-full flex flex-col justify-between relative z-10">
                
                {/* Card Top: Brand Emblem & Prestige Badge */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <img loading="lazy" decoding="async" 
                      src={YARD300_BRAND_LOGO} 
                      alt="YARD300" 
                      onError={handleImageError} 
                      className="w-8 h-8 rounded-lg border border-white/30 object-cover shadow-lg group-hover:rotate-3 transition-transform" 
                    />
                    <div>
                      <span className="font-black font-anime text-xs md:text-sm tracking-wider text-white flex items-center gap-1.5">
                        <span>YARD300 {isWomen ? 'OBSIDIAN PURPLE' : 'TITANIUM BLACK'}</span>
                        <Sparkles className={`w-3 h-3 ${isWomen ? 'text-[#C084FC]' : 'text-[#FFE600]'}`} />
                      </span>
                      <span className="text-[8px] font-mono text-gray-300 uppercase tracking-widest block font-bold">
                        {isWomen ? '💜 S-RANK WOMEN’S CREDENTIAL' : '⚔️ S-RANK TITANIUM CREDENTIAL'}
                      </span>
                    </div>
                  </div>

                  {/* Metallic Seal */}
                  <div className={`px-2 py-0.5 rounded-lg border text-[8px] font-black font-anime tracking-wider flex items-center gap-1 backdrop-blur-md ${
                    isWomen 
                      ? 'border-[#A855F7] bg-black/70 text-[#C084FC] shadow-[0_0_10px_#A855F7]' 
                      : 'border-[#FFE600] bg-black/60 text-[#FFE600] shadow-[0_0_10px_#FFE600]'
                  }`}>
                    <Crown className="w-2.5 h-2.5" />
                    <span>VIP MERIT</span>
                  </div>
                </div>

                {/* Card Middle: Gold Smart Chip, NFC & Anime 4,200 YARDX Currency Pod */}
                <div className="my-auto flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Metallic Holographic EMV Chip */}
                    <div className={`w-9 h-6 rounded-md border-2 relative overflow-hidden shadow-xl flex items-center justify-center shrink-0 ${
                      isWomen 
                        ? 'bg-gradient-to-br from-[#2D0652] via-[#6B21A8] to-[#A855F7] border-purple-300/60 shadow-[0_0_12px_rgba(168,85,247,0.5)]' 
                        : 'bg-gradient-to-br from-[#FFE600] via-[#C9A227] to-[#7A5B00] border-amber-200/60 shadow-[0_0_15px_rgba(255,230,0,0.35)]'
                    }`}>
                      <div className="w-full h-px bg-black/40" />
                      <div className="absolute w-px h-full bg-black/40" />
                      <div className="absolute w-3.5 h-3.5 rounded-full border border-black/30" />
                    </div>

                    {/* Contactless NFC Waves */}
                    <div className="flex flex-col items-center gap-0.5 opacity-90 shrink-0">
                      <svg className="w-3 h-3 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M8.5 16.5a5 5 0 0 1 0-9" strokeLinecap="round" />
                        <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
                        <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                      </svg>
                      <span className="text-[6px] font-mono text-gray-300 font-black">NFC</span>
                    </div>

                    <div>
                      <span className="text-[8px] font-bold text-gray-300 block font-mono">
                        {isWomen ? 'DIVISION: OBSIDIAN PURPLE' : 'DIVISION: TITANIUM WARRIOR'}
                      </span>
                      <span className="text-xs md:text-sm font-black font-anime tracking-wide text-white block group-hover:neon-text-cyan transition-all" style={{ color: isWomen ? '#C084FC' : activeTier.accentColor }}>
                        {isAr ? activeTier.nameAr.split('—')[0] : activeTier.nameEn}
                      </span>
                    </div>
                  </div>

                  {/* Anime Cyber Currency Pod (Prominently displaying 4,200 YARDX) */}
                  <div className="text-right shrink-0">
                    <div className="px-2.5 py-1 rounded-lg bg-black/75 border border-[#FFE600]/80 shadow-[0_0_15px_rgba(255,230,0,0.4)] backdrop-blur-md group-hover:scale-105 transition-all text-right">
                      <div className="flex items-center justify-end gap-1 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600] animate-ping" />
                        <span className="text-[7px] font-mono text-[#00F0FF] uppercase font-black tracking-wider">
                          OFFICIAL CURRENCY
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs">🪙</span>
                        <span className="text-xs md:text-sm font-black font-anime text-[#FFE600] tracking-wider drop-shadow-[0_0_8px_rgba(255,230,0,0.9)]">
                          {activeTier.yardxTokens}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-0.5 flex items-center justify-end gap-1.5 text-[8px] font-mono">
                      <span className="text-white/50 font-black font-anime">LVL {activeTier.level}</span>
                      <span className="text-[#00F0FF] font-bold">AURA {activeTier.auraScore}</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Athlete Name & Serial */}
                <div className="pt-2 border-t border-white/15 flex justify-between items-end">
                  <div>
                    <span className="text-[7px] font-mono text-gray-400 block tracking-widest">AUTHORIZED ATHLETE</span>
                    <span className="font-mono font-black text-[11px] md:text-xs text-white tracking-widest drop-shadow-md">
                      {athleteName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[7px] font-mono text-gray-400 block tracking-widest">SERIAL NUMBER</span>
                    <span className={`font-mono text-[11px] md:text-xs font-black tracking-wider ${isWomen ? 'text-[#C084FC]' : 'text-[#00F0FF]'}`}>
                      {memberId}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              /* CARD BACK */
              <div className="h-full flex flex-col justify-between relative z-10">
                {/* Magnetic Strip */}
                <div className="-mx-4 md:-mx-5 -mt-2 h-9 bg-black/95 border-y border-white/10 flex items-center px-3 justify-between">
                  <span className="text-[7px] font-mono text-gray-400 tracking-widest">
                    YARD300 BIOMETRIC PASS • ISO/IEC 7810 • 2026
                  </span>
                  <span className="text-[7px] font-mono text-emerald-400 font-bold">● ACTIVE CHIP</span>
                </div>

                {/* Anime Cryptographic Vault & 4,200 YARDX Ledger */}
                <div className="px-3 py-2 rounded-xl bg-black/70 border border-[#FFE600]/40 flex items-center justify-between">
                  <div>
                    <span className="text-[7px] font-mono text-gray-400 block tracking-widest uppercase">
                      {isAr ? 'خزينة العملة المودعة' : 'STAKED COMBAT TREASURY'}
                    </span>
                    <span className="text-xs md:text-sm font-black font-anime text-[#FFE600] flex items-center gap-1.5">
                      <span>🪙 {activeTier.yardxTokens}</span>
                      <span className="text-[8px] font-mono text-[#00F0FF]">
                        ≈ ${(parseInt(activeTier.yardxTokens.replace(/\D/g, '')) * 0.15).toFixed(0)} USD
                      </span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[7px] font-mono text-gray-400 block tracking-widest uppercase">
                      CONTRACT STATUS
                    </span>
                    <span className="text-[8px] font-mono text-emerald-400 font-black">
                      VAULT VERIFIED ✓
                    </span>
                  </div>
                </div>

                {/* Back Center Engraved Quote */}
                <div className="my-auto p-2.5 rounded-xl bg-black/50 border border-white/10 text-center">
                  <span className="text-[8px] font-black font-anime text-[#FFE600] uppercase block">
                    {isAr ? 'عزيمة البطل الاستثنائية' : 'WARRIOR CODE OF MERIT'}
                  </span>
                  <p className="text-[10px] md:text-[11px] text-gray-300 font-bold leading-relaxed mt-0.5">
                    {isAr ? activeTier.quoteAr : activeTier.quoteEn}
                  </p>
                </div>

                {/* Signature Strip */}
                <div className="pt-2 border-t border-white/15 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="text-[9px] font-mono text-gray-300 font-bold">
                      BIOMETRIC CERTIFIED
                    </span>
                  </div>
                  <span className="text-[9px] font-black font-anime text-[#FFE600]">
                    YARD300 OFFICIAL
                  </span>
                </div>

              </div>
            )}

          </div>

          {/* Bottom Mecha HUD Status Telemetry */}
          <div className="flex items-center justify-between pt-3 px-1 border-t border-white/10 text-[8px] font-mono text-gray-400">
            <span>COORDINATES: LAT 35.6762 / LON 139.6503</span>
            <span className="text-[#00F0FF]">CORE STABILITY: 100%</span>
            <span>SEC-ID: #YD300-TAC-MK4</span>
          </div>
        </div>

        {/* Minimalist Interactive Action Suite with Cyber-Sci-Fi Neon Borders & Glitch Effects */}
        <div className="w-full space-y-3">
          
          {/* Inline Name Customizer with Cyber HUD styling */}
          <div className="flex items-center justify-between gap-3 bg-[#10121C] px-4 py-2.5 rounded-2xl border border-[#00F0FF]/40 text-xs shadow-[0_0_15px_rgba(0,240,255,0.15)] relative">
            <span className="text-gray-300 font-bold font-mono text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#FFE600] rounded-full animate-ping" />
              {isAr ? 'اسم البطل المنقوش على البطاقة:' : 'Athlete Name on Card:'}
            </span>
            <input
              type="text"
              value={athleteName}
              onChange={(e) => setAthleteName(e.target.value.toUpperCase())}
              maxLength={18}
              className="bg-transparent text-[#FFE600] font-mono font-bold text-xs outline-none w-36 uppercase text-right rtl:text-left border-b border-[#00F0FF]/40 focus:border-[#FFE600] focus:shadow-[0_0_10px_#FFE600]"
            />
          </div>

          {/* Clean Action Buttons with Glowing Neon Borders and Glitch Animations on Hover */}
          <div className="grid grid-cols-2 gap-3">
            {/* Discover Privileges Trigger */}
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setShowPrivilegesModal(true);
              }}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#181A28] to-[#1E2238] hover:from-[#1E2238] hover:to-[#282E4E] border border-[#FFE600] neon-border-yellow text-[#FFE600] font-anime font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover-cyber-glitch active:scale-95"
            >
              <Eye className="w-4 h-4 text-[#FFE600]" />
              <span>{isAr ? 'اكشف مزايا وأسرار البطاقة ⚡' : 'REVEAL TIER PRIVILEGES ⚡'}</span>
            </button>

            {/* Subscribe / Activate Button */}
            <button
              type="button"
              onClick={handleSubscribeToggle}
              className="py-3.5 px-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-anime font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95"
            >
              <CreditCard className="w-4 h-4 text-black" />
              <span>{isAr ? (isSubscribed ? 'تم الاشتراك وتفعيل البطاقة ✓' : 'اشترك واكتشف المزايا فوراً') : (isSubscribed ? 'Membership Active ✓' : 'Subscribe & Unlock Now')}</span>
            </button>
          </div>

          {/* Quick Utility Actions: Wallet, Copy ID, Share to X with HUD Borders */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadCard}
              disabled={downloading}
              className="py-2.5 px-2 rounded-xl bg-[#121422] hover:bg-[#1A1D2E] border border-gray-700 hover:border-[#00F0FF] text-gray-300 hover:text-white text-[10px] font-black font-anime flex items-center justify-center gap-1.5 cursor-pointer transition-all hover-cyber-glitch"
            >
              {downloading ? <span className="animate-spin text-xs">⚡</span> : <Download className="w-3.5 h-3.5 text-[#00F0FF]" />}
              <span>{isAr ? (downloadSuccess ? 'تم الحفظ ✓' : 'حفظ بالمحفظة') : (downloadSuccess ? 'Saved ✓' : 'Save to Wallet')}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyId}
              className="py-2.5 px-2 rounded-xl bg-[#121422] hover:bg-[#1A1D2E] border border-gray-700 hover:border-[#FFE600] text-gray-300 hover:text-white text-[10px] font-black font-anime flex items-center justify-center gap-1.5 cursor-pointer transition-all hover-cyber-glitch"
            >
              <Check className={`w-3.5 h-3.5 ${copiedId ? 'text-emerald-400' : 'text-[#FFE600]'}`} />
              <span>{isAr ? (copiedId ? 'تم النسخ ✓' : 'نسخ الرمز') : (copiedId ? 'Copied ✓' : 'Copy ID')}</span>
            </button>

            <button
              type="button"
              onClick={handleShareOnX}
              className="py-2.5 px-2 rounded-xl bg-[#121422] hover:bg-[#1A1D2E] border border-gray-700 hover:border-[#FF007A] text-gray-300 hover:text-white text-[10px] font-black font-anime flex items-center justify-center gap-1.5 cursor-pointer transition-all hover-cyber-glitch"
            >
              <svg className="w-3 h-3 text-[#FF007A] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>{isAr ? 'مشاركة عبر 𝕏' : 'Share on 𝕏'}</span>
            </button>
          </div>

          {/* Level 3 Custom Club Direct Shortcut Button */}
          {selectedLevel >= 3 && onNavigateToClub && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onNavigateToClub}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#A855F7] via-emerald-400 to-[#FFE600] text-black font-black font-anime text-xs shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4 text-black" />
                <span>{isAr ? 'إدارة ناديك الخاص ونشر الستوريات ⚡' : 'OPEN MY CUSTOM CLUB & BROADCAST STORIES ⚡'}</span>
              </button>
            </div>
          )}

          {/* Success Banner */}
          {downloadSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-[0_0_15px_#10B981]">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'تمت إضافة بطاقة YARD300 الرقمية لمحفظتك بنجاح!' : 'YARD300 Digital Pass added to your electronic wallet!'}</span>
            </div>
          )}

        </div>

      </div>

      {/* Discovery Modal / Drawer: Mecha Cockpit Privileges HUD */}
      {showPrivilegesModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F111D] border-2 border-[#FFE600] neon-border-yellow rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-[0_0_60px_rgba(255,230,0,0.4)] relative animate-in fade-in zoom-in-95 duration-200">
            {/* Corner brackets */}
            <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#FFE600]" />
            <div className="hud-corner-bracket hud-corner-bracket-tr !border-[#FFE600]" />
            <div className="hud-corner-bracket hud-corner-bracket-bl !border-[#FFE600]" />
            <div className="hud-corner-bracket hud-corner-bracket-br !border-[#FFE600]" />
            
            <button
              onClick={() => setShowPrivilegesModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-[#181A2A] hover-cyber-glitch cursor-pointer"
            >
              <X className="w-5 h-5 text-[#FFE600]" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-[#FFE600]/15 rounded-2xl text-[#FFE600] mb-1 neon-border-yellow">
                <Crown className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black font-anime text-white">
                {isAr ? 'أسرار وامتيازات العضوية الحصرية' : 'EXCLUSIVE SUBSCRIBER PRIVILEGES'}
              </h3>
              <p className="text-xs font-bold text-gray-300 font-mono">
                {isAr ? `امتيازات المستوى ${activeTier.level}: ${activeTier.nameAr.split('—')[0]}` : `Privileges for Tier ${activeTier.level}: ${activeTier.nameEn}`}
              </p>
            </div>

            {/* List of Privileges Revealed Upon Subscription */}
            <div className="space-y-3">
              {(isAr ? activeTier.privilegesAr : activeTier.privilegesEn).map((priv, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#151828] border border-[#00F0FF]/30 text-xs font-bold text-gray-200 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{priv}</span>
                </div>
              ))}
            </div>

            {/* Status confirmation */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1E2338] to-[#121526] border border-[#00F0FF]/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black font-mono text-[#00F0FF] uppercase block">
                  {isAr ? 'حالة البطاقة البيومترية' : 'BIOMETRIC CREDENTIAL STATUS'}
                </span>
                <span className="text-sm font-black font-mono text-white">
                  {isSubscribed ? (isAr ? 'مفعلة ونشطة ⚡' : 'VERIFIED & ACTIVE ⚡') : (isAr ? 'جاهزة للتأكيد' : 'READY TO CONFIRM')}
                </span>
              </div>
              <button
                onClick={() => {
                  soundFX.playSuccess();
                  setIsSubscribed(true);
                  setShowPrivilegesModal(false);
                }}
                className="px-5 py-2.5 bg-[#FFE600] hover:bg-white text-black font-black font-anime text-xs rounded-xl transition-all shadow-[0_0_20px_#FFE600] hover-cyber-glitch cursor-pointer"
              >
                {isAr ? 'تأكيد وحفظ البطاقة' : 'CONFIRM & SAVE'}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default SubscriberTiersShowcase;
