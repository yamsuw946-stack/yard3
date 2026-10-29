import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  X, 
  Layers, 
  Ticket, 
  Moon, 
  ShieldCheck, 
  ExternalLink,
  Search,
  ArrowUpRight,
  Smartphone,
  Share2,
  Crown,
  Compass,
  Palmtree,
  LogIn,
  LogOut
} from 'lucide-react';
import { Language, t as translateKey } from '../i18n';
import { soundFX } from '../services/soundFX';
import { OwnerConfigService } from '../services/ownerConfigService';
import { authService, AuthUser } from '../services/authService';

export interface SideOptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => void;
  onOpenProfile: () => void;
  currentLang: Language;
}

interface DrawerOptionItem {
  id: string;
  category: 'core' | 'combat' | 'gear' | 'lore';
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  descAr: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
}

const DRAWER_OPTIONS: DrawerOptionItem[] = [
  {
    id: 'bazaruto',
    category: 'core',
    titleAr: 'منتجع يارد الصحي · أرخبيل بازاروتو (أكتوبر 2027)',
    titleEn: 'YARD Bio-Recovery Resort · Bazaruto (Oct 2027)',
    badgeAr: 'ملاذ خاص VIP',
    badgeEn: 'VIP SANCTUARY',
    descAr: '10 فيلل شاطئية فاخرة، فندق 30 غرفة و 4 VIP، مسبح ممرات المغامرة، ومستشفى لعلاج الإصابات والاكتئاب.',
    descEn: '10 private villas, 30-room hotel + 4 VIP suites, adventure pool, and hospital for sports injury & depression recovery.',
    icon: Palmtree,
    accentColor: '#10B981',
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  },
  {
    id: 'yardEngine',
    category: 'core',
    titleAr: 'محرك YARD & التنبؤ بالإصابات',
    titleEn: 'YARD Biometric & Injury AI Engine',
    badgeAr: 'المحرك الأساسي',
    badgeEn: 'CORE ENGINE',
    descAr: 'تحليل مراحل النوم العميق، تنبؤ الإصابات بخوارزميات ACWR، واستشفاء العضلات.',
    descEn: 'Deep sleep staging, ACWR injury alert algorithms, and recovery scores.',
    icon: Activity,
    accentColor: '#E50914',
    badgeBg: 'bg-[#E50914]/20 text-[#E50914] border-[#E50914]/50',
  },
  {
    id: 'sleepStudies',
    category: 'core',
    titleAr: 'خوارزمية دراسات النوم وهندسة التعافي',
    titleEn: 'Sleep Architecture & Recovery Lab',
    badgeAr: 'مختبر سريري',
    badgeEn: 'CLINICAL LAB',
    descAr: 'تحليل أطوار النوم العميق NREM3 و REM وهرمون النمو GH.',
    descEn: 'Evaluate deep sleep stages, REM reflex consolidation, and sleep debt.',
    icon: Moon,
    accentColor: '#7000FF',
    badgeBg: 'bg-[#7000FF]/20 text-[#00F0FF] border-[#7000FF]/50',
  },
  {
    id: 'injuryPrediction',
    category: 'core',
    titleAr: 'خوارزمية ACWR وتوازن الحمل الحركي',
    titleEn: 'Gabbett ACWR Injury Prevention',
    badgeAr: 'حماية الأوتار',
    badgeEn: 'PREVENTATIVE',
    descAr: 'مراقبة الحمل الحاد والمزمن لتفادي تمزق الأوتار والمفاصل قبل 7 أيام.',
    descEn: 'Acute:chronic workload ratio analysis and tendon strain alerts.',
    icon: ShieldCheck,
    accentColor: '#E50914',
    badgeBg: 'bg-[#E50914]/20 text-[#E50914] border-[#E50914]/50',
  },
  {
    id: 'arena',
    category: 'combat',
    titleAr: 'حلبة النزالات والملاكمة التفاعلية',
    titleEn: 'Live Combat & Boxing Dojo',
    badgeAr: 'نزالات حية',
    badgeEn: 'LIVE DOJO',
    descAr: 'لكمات ظل سريعة، تفاعل نبض القلب، وتحديات كومبو الهالة.',
    descEn: 'Fast-paced shadow strikes, real-time heart rate load, and target combos.',
    icon: Swords,
    accentColor: '#FFE600',
    badgeBg: 'bg-[#FFE600]/20 text-[#FFE600] border-[#FFE600]/50',
  },
  {
    id: 'ai-coach',
    category: 'combat',
    titleAr: 'المدرب الذكي (AI Coach)',
    titleEn: 'Gemini S-Rank AI Coach',
    badgeAr: 'ذكاء فائق',
    badgeEn: 'GEMINI AI',
    descAr: 'توجيه صوتي وتكتيكي، خطط استشفاء ذكية وتغذية قتالية مخصصة.',
    descEn: 'Tactical guidance, adaptive recovery plans, and fight conditioning.',
    icon: Bot,
    accentColor: '#00F0FF',
    badgeBg: 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/50',
  },
  {
    id: 'products',
    category: 'gear',
    titleAr: 'المتجر والعتاد الحصري (300 Gear)',
    titleEn: 'Exclusive Gear & 300 Apparel',
    badgeAr: 'إصدار محدود',
    badgeEn: '300 ONLY',
    descAr: 'قميص YARD 300 المقاوم للعرق، جوارب الأداء الوردي، وعتاد التدريب.',
    descEn: 'Titan performance apparel, quantum pink socks, and combat wear.',
    icon: ShoppingBag,
    accentColor: '#FFE600',
    badgeBg: 'bg-[#FFE600]/20 text-[#FFE600] border-[#FFE600]/50',
  },
  {
    id: 'tickets',
    category: 'combat',
    titleAr: 'تذاكر البطولات والأحداث المباشرة',
    titleEn: 'Championship Tickets & Live Passes',
    badgeAr: 'تذاكر حية',
    badgeEn: 'LIVE PASS',
    descAr: 'مواعيد وجدول حجز تذاكر البطولات القادمة في كمبوديا وتايلاند.',
    descEn: 'Championship schedule and ticket release info for Cambodia & Thailand.',
    icon: Ticket,
    accentColor: '#E50914',
    badgeBg: 'bg-[#E50914]/20 text-white border-[#E50914]',
  },
  {
    id: 'customClub',
    category: 'combat',
    titleAr: 'ناديي الرياضي الخاص (30$ / المستوى 3)',
    titleEn: 'My Custom Athletic Club ($30 / Level 3)',
    badgeAr: 'نادي ونشر ستوريات (30$)',
    badgeEn: '$30 · LVL 3 CLUB',
    descAr: 'امتلاك وتسمية ناديك الخاص، وضع شعار مخصص، نشر ستوريات 24 ساعة، ودعوة متابعين.',
    descEn: 'Own & name your athletic club ($30), set custom logos, broadcast 24h stories, and recruit followers.',
    icon: Crown,
    accentColor: '#A855F7',
    badgeBg: 'bg-[#A855F7]/25 text-[#C084FC] border-[#A855F7]',
  },
  {
    id: 'yardCamp',
    category: 'combat',
    titleAr: '🌍 معسكر يارد 300 الدولي (300 شخص لكل مخيم)',
    titleEn: '🌍 YARD 300 Global Expedition Camp',
    badgeAr: '300 لكل مخيم',
    badgeEn: '300 PER CAMP',
    descAr: 'تحت إشراف المؤسسين الثلاثة وباقي فريق المدربين حول العالم، لأشخاص ذوي معايير عالية يوازنون بين حياتهم العملية وأجسادهم.',
    descEn: 'Strictly 300 athletes per camp under the Three Founders & global coaching crew, balancing demanding careers with bodily excellence.',
    icon: Compass,
    accentColor: '#FFE600',
    badgeBg: 'bg-[#FFE600]/20 text-[#FFE600] border-[#FFE600]/50',
  },
  {
    id: 'auraVisualizer',
    category: 'core',
    titleAr: 'أستوديو شحن وتوليد الهالة',
    titleEn: 'Cyber Aura Visualizer Studio',
    badgeAr: 'طاقة النيون',
    badgeEn: 'AURA FX',
    descAr: 'تفاعل حركي مع جسيمات الهالة الرقمية ونبضات الصوت الإلكترونية.',
    descEn: 'Dynamic anime particle visualizer and cybernetic kinetic charge.',
    icon: Sparkles,
    accentColor: '#00F0FF',
    badgeBg: 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/50',
  },
  {
    id: 'leaderboard',
    category: 'combat',
    titleAr: 'لوحة الصدارة وتصنيف الأبطال',
    titleEn: 'Global S-Rank Leaderboard',
    badgeAr: 'أفضل 10',
    badgeEn: 'TOP 10',
    descAr: 'ترتيب أبطال YARD 300 حول العالم، نقاط الهالة، والستريك القتالي.',
    descEn: 'Global warrior rankings, Aura AP scores, and combat streaks.',
    icon: Trophy,
    accentColor: '#FFE600',
    badgeBg: 'bg-[#FFE600]/20 text-[#FFE600] border-[#FFE600]/50',
  },
  {
    id: 'championStory',
    category: 'lore',
    titleAr: 'قصة بطل وملحمة المحارب',
    titleEn: 'Champion Story & Manga Lore',
    badgeAr: 'ملحمة الأبطال',
    badgeEn: 'EPIC LORE',
    descAr: 'رحلة الصعود من رتبة مبتدئ إلى مرتبة أسطورة S-Rank التي لا تُقهر.',
    descEn: 'The path from novice to invincible S-Rank combat transcendence.',
    icon: BookOpen,
    accentColor: '#FF007A',
    badgeBg: 'bg-[#FF007A]/20 text-[#FF007A] border-[#FF007A]/50',
  },
  {
    id: 'about',
    category: 'lore',
    titleAr: 'فلسفة YARD 300 والمؤسسون الثلاثة',
    titleEn: 'The 3 Founders & YARD Mindset',
    badgeAr: 'الفلسفة',
    badgeEn: 'MINDSET',
    descAr: 'عقلية الـ 300 مقاتل، رؤية المؤسسين، ورسالة بناء نخبة الرياضيين.',
    descEn: 'The Spartan discipline, vision of the 3 founders, and community code.',
    icon: FileText,
    accentColor: '#FFFFFF',
    badgeBg: 'bg-white/10 text-white border-white/30',
  },
  {
    id: 'ownerDashboard',
    category: 'lore',
    titleAr: '👑 لوحة تحكم مالك الموقع (Owner Dashboard)',
    titleEn: '👑 Owner Admin Dashboard (Yam Suw)',
    badgeAr: 'لوحة المالك',
    badgeEn: 'OWNER PORTAL',
    descAr: 'تحكم كامل في الصور، الأقسام، طرق الدفع، الفيديوهات ونشر مقالات المجلة.',
    descEn: 'Full control of photos, site sections, payment methods, videos, and articles.',
    icon: ShieldCheck,
    accentColor: '#E50914',
    badgeBg: 'bg-[#E50914]/20 text-[#FFE600] border-[#E50914]',
  }
];

const DRAWER_I18N: Record<string, { titleEs: string; titleFr: string; badgeEs: string; badgeFr: string; descEs: string; descFr: string }> = {
  ownerDashboard: {
    titleEs: 'Panel del Propietario (Owner Dashboard)',
    titleFr: 'Tableau de Bord du Propriétaire',
    badgeEs: 'PORTAL PROPIETARIO',
    badgeFr: 'PORTAIL PROPRIÉTAIRE',
    descEs: 'Gestione fotos, secciones, métodos de pago, videos y artículos.',
    descFr: 'Gérez photos, sections, paiements, vidéos et articles.',
  },
  yardEngine: {
    titleEs: 'Motor YARD y Prevención de Lesiones',
    titleFr: 'Moteur YARD & Prédiction des Blessures',
    badgeEs: 'MOTOR CENTRAL',
    badgeFr: 'MOTEUR CENTRAL',
    descEs: 'Fases de sueño profundo, algoritmo ACWR de prevención y recuperación.',
    descFr: 'Phases de sommeil profond, algorithme ACWR et récupération.',
  },
  sleepStudies: {
    titleEs: 'Laboratorio de Sueño y Recuperación',
    titleFr: 'Labo Architecture du Sommeil',
    badgeEs: 'LAB CLÍNICO',
    badgeFr: 'LAB CLINIQUE',
    descEs: 'Evalúa etapas de sueño profundo NREM3, REM y deuda de sueño.',
    descFr: 'Évaluez les phases de sommeil profond NREM3, REM et dette de sommeil.',
  },
  injuryPrediction: {
    titleEs: 'Prevención de Lesiones Gabbett ACWR',
    titleFr: 'Prévention des Blessures Gabbett ACWR',
    badgeEs: 'PREVENTIVO',
    badgeFr: 'PRÉVENTIF',
    descEs: 'Ratio de carga de trabajo aguda y crónica para proteger tendones.',
    descFr: 'Ratio de charge d\'entraînement aiguë/chronique et alertes tendineuses.',
  },
  arena: {
    titleEs: 'Arena de Combate y Dojo de Boxeo',
    titleFr: 'Arène de Combat et Dojo de Boxe',
    badgeEs: 'DOJO EN VIVO',
    badgeFr: 'DOJO EN DIRECT',
    descEs: 'Golpes de sombra rápidos, carga cardíaca en vivo y combos.',
    descFr: 'Frappes d\'ombre rythmées, charge cardiaque et combos d\'entraînement.',
  },
  'ai-coach': {
    titleEs: 'Entrenador IA Gemini Rango S',
    titleFr: 'Coach IA Gemini Rang S',
    badgeEs: 'IA GEMINI',
    badgeFr: 'IA GEMINI',
    descEs: 'Orientación táctica, planes adaptativos de recuperación y fuerza.',
    descFr: 'Conseils tactiques, plans adaptatifs et conditionnement physique.',
  },
  products: {
    titleEs: 'Tienda y Ropa Exclusiva (300 Unidades)',
    titleFr: 'Boutique et Équipement Exclusif (300 Pièces)',
    badgeEs: 'SOLO 300',
    badgeFr: '300 SEULEMENT',
    descEs: 'Ropa de alto rendimiento Titan, calcetines rosa cuántico y equipo.',
    descFr: 'Vêtements de performance Titan, chaussettes rose quantique et tenue combat.',
  },
  tickets: {
    titleEs: 'Entradas de Campeonato y Pases en Vivo',
    titleFr: 'Billets de Championnat & Pass en Direct',
    badgeEs: 'PASE EN VIVO',
    badgeFr: 'PASS EN DIRECT',
    descEs: 'Asientos de primera fila, acceso VIP y torneos en vivo.',
    descFr: 'Sièges au premier rang, accès VIP et entrée aux championnats.',
  },
  customClub: {
    titleEs: 'Mi Club Atlético Personalizado ($30 / Nivel 3)',
    titleFr: 'Mon Club Athlétique Personnalisé (30 $ / Niveau 3)',
    badgeEs: '$30 · CLUB NIVEL 3',
    badgeFr: '30 $ · CLUB NIVEAU 3',
    descEs: 'Posee y nombra tu club, historias de 24h y añade compañeros.',
    descFr: 'Possédez et nommez votre club, diffusez des stories et ajoutez des membres.',
  },
  auraVisualizer: {
    titleEs: 'Estudio Visualizador de Aura Cyber',
    titleFr: 'Studio Visualiseur d\'Aura Cyber',
    badgeEs: 'AURA FX',
    badgeFr: 'AURA FX',
    descEs: 'Visualizador dinámico de partículas anime y carga cinética.',
    descFr: 'Visualiseur de particules anime et charge cinétique cybernétique.',
  },
  leaderboard: {
    titleEs: 'Salón de Campeones Rango S',
    titleFr: 'Hall des Champions Rang S',
    badgeEs: 'RANGO S',
    badgeFr: 'RANG S',
    descEs: 'Clasificaciones globales, puntos de aura y torneos semanales.',
    descFr: 'Classements mondiaux, scores d\'aura et tournois hebdomadaires.',
  },
  profile: {
    titleEs: 'Perfil de Atleta y Telemetría',
    titleFr: 'Profil Athlète & Télémétrie',
    badgeEs: 'MIS STATS',
    badgeFr: 'MES STATS',
    descEs: 'Calorías quemadas, radar de atributos y horas de entrenamiento.',
    descFr: 'Calories brûlées, radar d\'attributs et heures d\'entraînement.',
  },
  championStory: {
    titleEs: 'Vídeo y Documental del Campeón',
    titleFr: 'Histoire et Vidéo du Champion',
    badgeEs: 'VÍDEO 4K',
    badgeFr: 'VIDÉO 4K',
    descEs: 'Documental mensual del mejor atleta y rutina de combate.',
    descFr: 'Documentaire mensuel du meilleur athlète et routine de combat.',
  },
  journal: {
    titleEs: 'Revista de Investigación Científica',
    titleFr: 'Journal Scientifique du Défi',
    badgeEs: 'CIENCIA',
    badgeFr: 'SCIENCE',
    descEs: 'Artículos sobre ACWR, sueño profundo, zonas de frecuencia cardíaca.',
    descFr: 'Articles sur l\'ACWR, le sommeil profond et les zones cardiaques.',
  },
  about: {
    titleEs: 'Los 3 Fundadores y Filosofía YARD',
    titleFr: 'Les 3 Fondateurs et Philosophie YARD',
    badgeEs: 'FILOSOFÍA',
    badgeFr: 'PHILOSOPHIE',
    descEs: 'Disciplina espartana, visión de los 3 fundadores y código de honor.',
    descFr: 'Discipline spartiate, vision des 3 fondateurs et code d\'honneur.',
  }
};

export const SideOptionsDrawer: React.FC<SideOptionsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenProfile,
  currentLang
}) => {
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';
  const isAr = currentLang === 'ar';
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'core' | 'combat' | 'gear' | 'lore'>('all');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

  useEffect(() => {
    const handleAuthChange = (e: any) => {
      const user = e.detail?.user !== undefined ? e.detail.user : authService.getCurrentUser();
      setCurrentUser(user);
    };
    window.addEventListener('yard300_auth_change', handleAuthChange);
    return () => window.removeEventListener('yard300_auth_change', handleAuthChange);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = DRAWER_OPTIONS.filter((item) => {
    const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;
    const itemI18n = DRAWER_I18N[item.id];
    const matchesSearch = 
      item.titleAr.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      (itemI18n?.titleEs && itemI18n.titleEs.toLowerCase().includes(q)) ||
      (itemI18n?.titleFr && itemI18n.titleFr.toLowerCase().includes(q)) ||
      item.descAr.toLowerCase().includes(q) ||
      item.descEn.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleSelect = (targetId: string, e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    soundFX.playButtonClick();
    onClose();
    onNavigate(e, targetId);
  };

  const handleProfileClick = () => {
    soundFX.playButtonClick();
    onClose();
    onOpenProfile();
  };

  return (
    <>
      {/* Dark Blur Backdrop */}
      <div 
        className={`fixed inset-0 bg-[#040508]/85 backdrop-blur-md z-[70] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          soundFX.playButtonClick();
          onClose();
        }}
      />

      {/* Side Options Drawer */}
      <aside 
        aria-label={isAr ? 'خيارات وأقسام YARD 300' : isFr ? 'Options et Hubs YARD 300' : isEs ? 'Opciones y Hubs YARD 300' : 'YARD 300 Options & Hubs'}
        className={`fixed top-0 bottom-0 ${
          isAr ? 'right-0 border-l border-[#00F0FF]/30' : 'left-0 border-r border-[#00F0FF]/30'
        } w-full sm:w-[460px] max-w-[95vw] bg-gradient-to-b from-[#080912] via-[#0A0B14] to-[#040508] text-white z-[80] shadow-[0_0_60px_rgba(0,240,255,0.25)] transform transition-transform duration-400 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : (isAr ? 'translate-x-full' : '-translate-x-full')
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-800/80 bg-[#0D0F1B]/90 backdrop-blur-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#E50914]/20 border border-[#00F0FF]/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Layers className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black font-anime text-white tracking-wide">
                  {isAr ? 'خيارات وأقسام YARD 300' : isFr ? 'OPTIONS & HUBS YARD 300' : isEs ? 'OPCIONES Y HUBS YARD 300' : 'YARD 300 OPTIONS & HUBS'}
                </h2>
                <span className="text-[9px] bg-[#E50914] text-white px-1.5 py-0.5 rounded font-black tracking-wider shadow-[0_0_6px_#E50914]">
                  ALL
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-bold">
                {isAr ? 'جميع الخدمات والأدوات الحيوية في مكان واحد' : isFr ? 'Toutes les chambres biométriques et de combat' : isEs ? 'Todas las cámaras biométricas y de combate' : 'All biometrics & combat chambers'}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => {
              soundFX.playButtonClick();
              onClose();
            }} 
            className="p-2 rounded-xl bg-[#141624] border border-gray-800 text-gray-400 hover:text-white hover:border-[#E50914] hover:bg-[#1C1F32] transition-colors cursor-pointer"
            aria-label={isAr ? 'إغلاق القائمة' : isFr ? 'Fermer le menu' : isEs ? 'Cerrar menú' : 'Close Menu'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Hub Jump CTA */}
        <div className="p-4 bg-gradient-to-r from-[#141628] via-[#101220] to-[#141628] border-b border-gray-900 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-[#00F0FF] font-black font-anime block text-[11px]">
              {isAr ? '⚡ بوابة الخيارات الموسعة' : isFr ? '⚡ HUB COMPLET DES OPTIONS' : isEs ? '⚡ HUB COMPLETO DE OPCIONES' : '⚡ FULL OPTIONS HUB'}
            </span>
            <span className="text-gray-400 text-[11px]">
              {isAr ? 'تصفح صفحة الخدمات بتفاصيلها الكاملة' : isFr ? 'Catalogue détaillé multi-services' : isEs ? 'Catálogo detallado de servicios' : 'Detailed multi-card showcase'}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => handleSelect('options', e)}
            className="px-3 py-1.5 rounded-lg bg-[#00F0FF] hover:bg-[#33f3ff] text-black font-black font-anime text-xs transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)] flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>{isAr ? 'عرض الكل' : isFr ? 'VOIR TOUT' : isEs ? 'VER TODO' : 'VIEW ALL'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search className={`w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في الخيارات والأقسام...' : isFr ? 'Rechercher des options et hubs...' : isEs ? 'Buscar opciones y cámaras...' : 'Search options & chambers...'}
              className={`w-full bg-[#121422] border border-gray-800 focus:border-[#00F0FF] rounded-xl py-2 text-xs text-white placeholder-gray-500 outline-none transition-colors ${
                isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
              }`}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-gray-900/80">
          <button
            type="button"
            onClick={() => {
              soundFX.playButtonClick();
              setSelectedFilter('all');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black font-anime transition-all shrink-0 cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#00F0FF] text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'bg-[#141624] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {isAr ? 'الكل' : isFr ? 'TOUT' : isEs ? 'TODO' : 'ALL'}
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playButtonClick();
              setSelectedFilter('core');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black font-anime transition-all shrink-0 cursor-pointer ${
              selectedFilter === 'core'
                ? 'bg-[#E50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.4)]'
                : 'bg-[#141624] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {isAr ? 'المحرك والنوم' : isFr ? 'IA & BIO' : isEs ? 'IA Y BIO' : 'AI & BIO'}
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playButtonClick();
              setSelectedFilter('combat');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black font-anime transition-all shrink-0 cursor-pointer ${
              selectedFilter === 'combat'
                ? 'bg-[#FFE600] text-black shadow-[0_0_10px_rgba(255,230,0,0.4)]'
                : 'bg-[#141624] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {isAr ? 'القتال والتذاكر' : isFr ? 'COMBAT' : isEs ? 'COMBATE' : 'COMBAT'}
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playButtonClick();
              setSelectedFilter('gear');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black font-anime transition-all shrink-0 cursor-pointer ${
              selectedFilter === 'gear'
                ? 'bg-[#FF007A] text-white shadow-[0_0_10px_rgba(255,0,122,0.4)]'
                : 'bg-[#141624] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {isAr ? 'المتجر والعتاد' : isFr ? 'BOUTIQUE' : isEs ? 'EQUIPO' : 'GEAR'}
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playButtonClick();
              setSelectedFilter('lore');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black font-anime transition-all shrink-0 cursor-pointer ${
              selectedFilter === 'lore'
                ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                : 'bg-[#141624] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {isAr ? 'الفلسفة والقصة' : isFr ? 'LORE' : isEs ? 'HISTORIA' : 'LORE'}
          </button>
        </div>

        {/* Scrollable Option List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          {filteredOptions.length === 0 ? (
            <div className="py-12 text-center text-gray-500 font-bold text-xs">
              {isAr ? 'لا توجد خيارات مطابقة لبحثك' : isFr ? 'Aucune option ne correspond à votre recherche.' : isEs ? 'Ninguna opción coincide con su búsqueda.' : 'No options match your search.'}
            </div>
          ) : (
            filteredOptions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleSelect(item.id, e)}
                  className="w-full text-start p-3.5 rounded-2xl bg-[#0E101D] hover:bg-[#15182B] border border-gray-800/90 hover:border-[#00F0FF]/50 transition-all duration-200 group flex items-start gap-3 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:translate-x-1"
                >
                  {/* Icon Box */}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-md"
                    style={{
                      backgroundColor: `${item.accentColor}15`,
                      borderColor: `${item.accentColor}50`
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.accentColor }} />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-anime font-black text-xs md:text-sm text-white group-hover:text-[#00F0FF] transition-colors truncate">
                        {isAr ? item.titleAr : item.titleEn}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black border uppercase tracking-wider shrink-0 ${item.badgeBg}`}>
                        {isAr ? item.badgeAr : item.badgeEn}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {isAr ? item.descAr : item.descEn}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="self-center text-gray-600 group-hover:text-[#00F0FF] transition-colors shrink-0">
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-[#0A0B14] border-t border-gray-800/90 space-y-2.5">
          {/* Athlete Profile & Share My Aura Shortcut */}
          <button
            type="button"
            onClick={handleProfileClick}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-[#141628] via-[#1A1D33] to-[#141628] hover:border-[#FFE600] border border-gray-800 flex items-center justify-between gap-3 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFE600]/20 border border-[#FFE600]/50 flex items-center justify-center overflow-hidden">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Athlete" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#FFE600]" />
                )}
              </div>
              <div className="text-start">
                <span className="block font-anime font-black text-white text-xs">
                  {currentUser ? (isAr ? `الملف الرياضي: ${currentUser.name}` : `Athlete Profile: ${currentUser.name}`) : (isAr ? 'الملف الرياضي وجواز الهالة' : isFr ? 'Profil Athlète & Passeport Aura' : isEs ? 'Perfil de Atleta y Pasaporte de Aura' : 'Athlete Profile & Aura Passport')}
                </span>
                <span className="text-[10px] text-gray-400">
                  {currentUser ? currentUser.email : (isAr ? 'مشاركة رابط الهالة ومعدل الطاقة S-Rank' : 'Share My Aura & Combat Stats')}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-[#FFE600] text-black px-1.5 py-0.5 rounded font-black font-anime">
              {currentUser ? currentUser.rankTitle.split(' ')[0] : 'S-RANK'}
            </span>
          </button>

          {/* Quick Login / Sign Out Row */}
          {currentUser ? (
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                authService.logout();
              }}
              className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold font-anime text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isAr ? 'تسجيل الخروج (Sign Out)' : 'Sign Out of Account'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                onClose();
                window.dispatchEvent(new CustomEvent('yard300_open_auth'));
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-400/50 text-emerald-300 hover:text-white font-black font-anime text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'تسجيل الدخول / إنشاء حساب رياضي' : 'Sign In / Register Athlete'}</span>
            </button>
          )}

          {/* Official Instagram Link (@yard.300) */}
          <a
            href="https://www.instagram.com/yard.300"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-2 rounded-xl bg-[#0C0E1A] hover:bg-[#121528] border border-gray-800 hover:border-[#FF007A]/50 flex items-center justify-between text-xs text-gray-300 hover:text-white transition-all group"
            title="Follow YARD 300 on Instagram @yard.300"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FF007A]/15 border border-[#FF007A]/40 flex items-center justify-center text-[#FF007A]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className="font-anime font-black text-xs text-white">
                Instagram <span className="text-[#FF007A]">@yard.300</span>
              </span>
            </div>
            <span className="text-[10px] text-[#00F0FF] group-hover:underline flex items-center gap-1 font-bold">
              {isAr ? 'متابعة الحساب' : isFr ? 'Suivre' : isEs ? 'Seguir' : 'Follow'} →
            </span>
          </a>

          {/* Quick App Store Modal trigger */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                onClose();
                window.dispatchEvent(new CustomEvent('open-app-download'));
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#121422] hover:bg-[#1A1D30] border border-[#00F0FF]/30 hover:border-[#00F0FF] text-[11px] font-anime font-black text-[#00F0FF] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.15)]"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>{isAr ? 'تحميل تطبيق الهاتف (iOS & Android)' : isFr ? 'APPLICATION MOBILE (iOS & Android)' : isEs ? 'DESCARGAR APP (iOS y Android)' : 'GET MOBILE APP (iOS & Android)'}</span>
            </button>
          </div>

          {/* Quick Direct Owner Dashboard Access */}
          <button
            type="button"
            onClick={(e) => handleSelect('ownerDashboard', e)}
            className="w-full py-2 px-3 rounded-xl bg-[#14101A] hover:bg-[#1E162B] border border-[#FFE600]/40 hover:border-[#FFE600] text-[11px] font-anime font-black text-[#FFE600] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(255,230,0,0.15)]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>{isAr ? '👑 لوحة تحكم وتعديل المالك (Owner Portal)' : isFr ? "👑 PORTAIL D'ADMINISTRATION PROPRIÉTAIRE" : isEs ? '👑 PORTAL DE ADMINISTRACIÓN PROPIETARIO' : '👑 OWNER ADMIN PORTAL'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideOptionsDrawer;
