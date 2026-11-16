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
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
  Ticket,
  Moon,
  ShieldCheck,
  Search,
  Crown,
  Compass,
  Palmtree
} from 'lucide-react';
import { Language, tr } from '../i18n';
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

interface LocalizedString {
  en: string;
  es: string;
  fr: string;
  ar: string;
}

interface DrawerOptionItem {
  id: string;
  category: 'flagship' | 'labs' | 'clubs' | 'editorial';
  title: LocalizedString;
  badge: LocalizedString;
  desc: LocalizedString;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: 'gold' | 'emerald' | 'slate';
}

const DRAWER_OPTIONS: DrawerOptionItem[] = [
  {
    id: 'leaderboard',
    category: 'flagship',
    title: {
      en: 'Weekly (10) & Monthly (50) Champions + Readings',
      es: 'Campeones Semanales (10) y Mensuales (50) + Lecturas',
      fr: 'Champions Hebdo (10) & Mensuels (50) + Mesures',
      ar: 'لوحة الأبطال (10 أسبوعياً و 50 شهرياً) وقراءات التدريب'
    },
    badge: {
      en: 'TOP 10 · 50',
      es: 'TOP 10 · 50',
      fr: 'TOP 10 · 50',
      ar: 'الأبطال 10/50'
    },
    desc: {
      en: 'Weekly Top 10, Monthly Top 50, All-Time 300 Legion & verified training telemetry (HRV, VO2 Max, RHR, Hours).',
      es: 'Top 10 semanal, Top 50 mensual, Legión 300 y telemetría de entrenamiento (VFC, VO2 Máx, horas).',
      fr: 'Top 10 hebdo, Top 50 mensuel, Légion 300 et télémétrie sportive vérifiée (VFC, VO2 Max, heures).',
      ar: 'التصنيف الأسبوعي (10) والشهري (50) وفيلق الـ 300 مع قراءات التدريب الحيوية HRV و VO2 Max.'
    },
    icon: Trophy,
    accent: 'gold'
  },
  {
    id: 'products',
    category: 'flagship',
    title: {
      en: 'Luxury Serialized Store (300 Units)',
      es: 'Tienda de Lujo Seriada (300 Unidades)',
      fr: 'Boutique Luxe Numérotée (300 Pièces)',
      ar: 'المتجر والعتاد الحصري (300 قطعة فقط)'
    },
    badge: {
      en: '300 UNITS',
      es: '300 UNIDADES',
      fr: '300 PIÈCES',
      ar: '300 قطعة'
    },
    desc: {
      en: 'Titan performance apparel, biometric rings, smartbands, and serialized athletic equipment.',
      es: 'Indumentaria de rendimiento Titan, anillos biométricos, bandas inteligentes y equipo seriado.',
      fr: 'Tenues techniques Titan, bagues biométriques, bracelets intelligents et équipement numéroté.',
      ar: 'أزياء يارد 300 التقنية، خواتم وأساور القياس الحيوي، وعتاد التدريب المرقم حصرياً.'
    },
    icon: ShoppingBag,
    accent: 'gold'
  },
  {
    id: 'bazaruto',
    category: 'flagship',
    title: {
      en: 'YARD Bio-Recovery Resort · Bazaruto (Oct 2027)',
      es: 'Resort YARD Bio-Recuperación · Bazaruto (Oct 2027)',
      fr: 'Resort YARD Bio-Récupération · Bazaruto (Oct 2027)',
      ar: 'منتجع يارد الصحي · أرخبيل بازاروتو (أكتوبر 2027)'
    },
    badge: {
      en: 'OCT 2027 · VIP',
      es: 'OCT 2027 · VIP',
      fr: 'OCT 2027 · VIP',
      ar: 'أكتوبر 2027'
    },
    desc: {
      en: '10 beachfront villas, 30-room hotel + 4 VIP suites, adventure lagoon pool, and sports injury recovery hospital.',
      es: '10 villas frente al mar, hotel de 30 habitaciones + 4 suites VIP, piscina laguna y hospital deportivo.',
      fr: '10 villas en bord de mer, hôtel 30 chambres + 4 suites VIP, piscine lagon et hôpital du sport.',
      ar: '10 فيلل شاطئية فاخرة، فندق 30 غرفة و 4 أجنحة VIP، مسبح ممرات المغامرة، ومستشفى الاستشفاء.'
    },
    icon: Palmtree,
    accent: 'emerald'
  },
  {
    id: 'customClub',
    category: 'clubs',
    title: {
      en: 'YARD Private Athletic Club ($30 · Level 3)',
      es: 'Club Atlético Privado YARD ($30 · Nivel 3)',
      fr: 'Club Athlétique Privé YARD (30 $ · Niveau 3)',
      ar: 'ناديي الرياضي الخاص (30$ · المستوى 3)'
    },
    badge: {
      en: '$30 · CLUB',
      es: '$30 · CLUB',
      fr: '30 $ · CLUB',
      ar: 'النادي · 30$'
    },
    desc: {
      en: 'Own & name your private athletic club, design your crest, broadcast 24h stories, and recruit members.',
      es: 'Crea y nombra tu club privado, diseña tu emblema, publica historias 24h y recluta atletas.',
      fr: 'Créez et nommez votre club privé, personnalisez le blason, publiez des stories 24h et recrutez.',
      ar: 'امتلاك وتسمية ناديك الخاص، تصميم الشعار، نشر ستوريات 24 ساعة، واستقطاب الأعضاء.'
    },
    icon: Crown,
    accent: 'gold'
  },
  {
    id: 'yardCamp',
    category: 'clubs',
    title: {
      en: 'YARD 300 Global Expedition Camp',
      es: 'Campamento de Expedición Global YARD 300',
      fr: 'Camp d’Expédition Mondial YARD 300',
      ar: 'معسكر يارد 300 الدولي (300 شخص لكل مخيم)'
    },
    badge: {
      en: '300 / CAMP',
      es: '300 / CAMP',
      fr: '300 / CAMP',
      ar: '300 رياضي'
    },
    desc: {
      en: 'Strictly 300 athletes per camp under direct Founders supervision, uniting career discipline & physical peak.',
      es: 'Estrictamente 300 atletas por campamento bajo los Fundadores, uniendo disciplina y cumbre física.',
      fr: 'Strictement 300 athlètes par camp sous les Fondateurs, alliant exigence de vie et sommet physique.',
      ar: 'معسكر حصري لـ 300 رياضي تحت إشراف المؤسسين والمدربين العالميين في وجهات طبيعية مختارة.'
    },
    icon: Compass,
    accent: 'emerald'
  },
  {
    id: 'tickets',
    category: 'flagship',
    title: {
      en: '10-Challenge Championship Passes · Jan 5, 2027',
      es: 'Entradas Campeonato 10 Desafíos · 5 Ene 2027',
      fr: 'Billets Championnat 10 Défis · 5 Jan 2027',
      ar: 'تذاكر بطولة التحديات الـ 10 · 5 يناير 2027'
    },
    badge: {
      en: 'JAN 5, 2027',
      es: '5 ENE 2027',
      fr: '5 JAN 2027',
      ar: '5 يناير 2027'
    },
    desc: {
      en: 'Nature Endurance Championship official tickets & 4K broadcast passes launching January 5, 2027.',
      es: 'Entradas oficiales del Campeonato de Resistencia en la Naturaleza y acceso 4K desde el 5 de enero 2027.',
      fr: 'Billetterie officielle du Championnat d’Endurance en Nature et accès 4K dès le 5 janvier 2027.',
      ar: 'تذاكر بطولة الطبيعة الكبرى للتحمل وبث 4K المباشر — تنطلق المبيعات في 5 يناير 2027.'
    },
    icon: Ticket,
    accent: 'gold'
  },
  {
    id: 'yardEngine',
    category: 'labs',
    title: {
      en: 'YARD Biometric & Injury AI Engine',
      es: 'Motor Biométrico e IA de Lesiones YARD',
      fr: 'Moteur Biométrique & Prédiction IA YARD',
      ar: 'محرك يارد البيومتري والوقاية من الإصابات'
    },
    badge: {
      en: 'CORE ENGINE',
      es: 'MOTOR IA',
      fr: 'MOTEUR IA',
      ar: 'المحرك الحيوي'
    },
    desc: {
      en: 'Integrated readiness telemetry, deep recovery scoring, and workload calibration.',
      es: 'Telemetría integrada de preparación, índices de recuperación profunda y calibración de carga.',
      fr: 'Télémétrie de forme intégrée, scores de récupération profonde et calibration de charge.',
      ar: 'تحليل الجاهزية البدنية، مراحل الاستشفاء العميق، ومعايرة الحمل التدريبي بدقة سريرية.'
    },
    icon: Activity,
    accent: 'emerald'
  },
  {
    id: 'sleepStudies',
    category: 'labs',
    title: {
      en: 'Sleep Architecture & Recovery Lab',
      es: 'Laboratorio de Arquitectura del Sueño',
      fr: 'Laboratoire Architecture du Sommeil',
      ar: 'مختبر دراسات النوم وهندسة التعافي'
    },
    badge: {
      en: 'CLINICAL LAB',
      es: 'LAB CLÍNICO',
      fr: 'LABO CLINIQUE',
      ar: 'مختبر النوم'
    },
    desc: {
      en: 'Evaluate NREM3 deep sleep cycles, REM neural consolidation, and cumulative sleep debt.',
      es: 'Evalúa fases profundas NREM3, consolidación neuronal REM y deuda de sueño atlética.',
      fr: 'Évaluez les cycles profonds NREM3, la consolidation REM et la dette de sommeil.',
      ar: 'تقييم أطوار النوم العميق NREM3 و REM وإفراز هرمون النمو وتعافي الجهاز العصبي.'
    },
    icon: Moon,
    accent: 'emerald'
  },
  {
    id: 'injuryPrediction',
    category: 'labs',
    title: {
      en: 'Gabbett ACWR Injury Prevention',
      es: 'Prevención de Lesiones Gabbett ACWR',
      fr: 'Prévention des Blessures Gabbett ACWR',
      ar: 'خوارزمية ACWR للتنبؤ بالإصابات'
    },
    badge: {
      en: '7-DAY SHIELD',
      es: 'ESCUDO 7D',
      fr: 'BOUCLIER 7J',
      ar: 'حماية 7 أيام'
    },
    desc: {
      en: 'Acute:chronic workload ratio modeling to prevent tendon and joint overload 7 days ahead.',
      es: 'Modelado de carga aguda:crónica para prevenir lesiones tendinosas con 7 días de antelación.',
      fr: 'Modélisation du ratio aigu/chronique pour prévenir les blessures tendineuses à 7 jours.',
      ar: 'تحليل الحمل الحاد والمزمن لتفادي إجهاد الأوتار والمفاصل وحماية الأبطال قبل 7 أيام.'
    },
    icon: ShieldCheck,
    accent: 'gold'
  },
  {
    id: 'arena',
    category: 'clubs',
    title: {
      en: 'Live Performance & Combat Arena',
      es: 'Arena de Rendimiento y Combate en Vivo',
      fr: 'Arène de Performance & Combat en Direct',
      ar: 'حلبة الأداء والتحديات التفاعلية المباشرة'
    },
    badge: {
      en: 'LIVE ARENA',
      es: 'ARENA VIVA',
      fr: 'ARÈNE DIRECT',
      ar: 'حلبة الأداء'
    },
    desc: {
      en: 'Real-time heart-rate zone execution, explosive strike speed, and verified S-Rank trials.',
      es: 'Ejecución cardíaca por zonas en tiempo real, velocidad explosiva y pruebas S-Rank verificadas.',
      fr: 'Exécution par zones cardiaques en direct, vitesse explosive et épreuves S-Rank vérifiées.',
      ar: 'تمارين سرعة رد الفعل، متابعة نبضات القلب المباشرة، وتحديات تصنيف النخبة.'
    },
    icon: Swords,
    accent: 'gold'
  },
  {
    id: 'ai-coach',
    category: 'labs',
    title: {
      en: 'AI Performance Director',
      es: 'Director de Rendimiento IA',
      fr: 'Directeur de Performance IA',
      ar: 'المدرب التكتيكي بالذكاء الاصطناعي'
    },
    badge: {
      en: 'AI COACH',
      es: 'COACH IA',
      fr: 'COACH IA',
      ar: 'المدرب الذكي'
    },
    desc: {
      en: 'Adaptive daily briefings, tactical conditioning counsel, and recovery nutrition protocols.',
      es: 'Reportes diarios adaptativos, asesoría táctica y protocolos nutricionales de recuperación.',
      fr: 'Bilans quotidiens adaptatifs, conseils tactiques et protocoles nutritionnels de récupération.',
      ar: 'توجيهات تدريب يومية ذكية، خطط استشفاء تكيفية، وتوصيات تغذية دقيقة للرياضيين.'
    },
    icon: Bot,
    accent: 'emerald'
  },
  {
    id: 'auraVisualizer',
    category: 'clubs',
    title: {
      en: 'Bio-Kinetic Aura Studio',
      es: 'Estudio Bio-Cinético Aura',
      fr: 'Studio Bio-Cinétique Aura',
      ar: 'مرسم الهالة الحيوية والطاقة البدنية'
    },
    badge: {
      en: 'BIO AURA',
      es: 'BIO AURA',
      fr: 'BIO AURA',
      ar: 'الطاقة الحيوية'
    },
    desc: {
      en: 'Visualize biometric intensity, kinetic energy indices, and export your Aura Passport.',
      es: 'Visualiza tu intensidad biométrica, carga cinética y genera tu Pasaporte Aura.',
      fr: 'Visualisez votre intensité biométrique, votre charge cinétique et votre Passeport Aura.',
      ar: 'تصور بيومتري تفاعلي لطاقة الأداء ومؤشرات الجهد مع جواز الهالة الرقمي.'
    },
    icon: Sparkles,
    accent: 'slate'
  },
  {
    id: 'championStory',
    category: 'editorial',
    title: {
      en: 'Champion Stories & Athlete Profiles',
      es: 'Historias de Campeones y Perfiles',
      fr: 'Histoires de Champions & Profils',
      ar: 'قصص الأبطال وملفات النخبة الموثقة'
    },
    badge: {
      en: 'ATHLETE LORE',
      es: 'PERFILES',
      fr: 'DOSSIERS',
      ar: 'قصص الأبطال'
    },
    desc: {
      en: 'Documented athletic progressions and sports science research breakthroughs across the roster.',
      es: 'Trayectorias documentadas de campeones e investigaciones en ciencias del deporte.',
      fr: 'Parcours documentés des champions et avancées en sciences de la performance.',
      ar: 'توثيق مسيرة صعود الأبطال والأبحاث العلمية المتقدمة في الطب الرياضي.'
    },
    icon: BookOpen,
    accent: 'slate'
  },
  {
    id: 'about',
    category: 'editorial',
    title: {
      en: 'Philosophy & Global Standards',
      es: 'Filosofía y Estándares Globales',
      fr: 'Philosophie & Standards Mondiaux',
      ar: 'فلسفة يارد 300 ومعايير النخبة'
    },
    badge: {
      en: 'MANIFESTO',
      es: 'MANIFIESTO',
      fr: 'MANIFESTE',
      ar: 'الفلسفة'
    },
    desc: {
      en: 'The Spartan meritocratic ethos uniting global athletes, discipline, and high standards.',
      es: 'La filosofía meritocrática que une disciplina, atletas internacionales y excelencia.',
      fr: 'La philosophie méritocratique réunissant discipline, athlètes mondiaux et excellence.',
      ar: 'ميثاق الانضباط والجهد الحقيقي ورؤية يارد في بناء مجتمع رياضي استثنائي.'
    },
    icon: FileText,
    accent: 'slate'
  },
  {
    id: 'ownerDashboard',
    category: 'editorial',
    title: {
      en: 'Owner Management Portal',
      es: 'Portal de Administración del Propietario',
      fr: 'Portail d’Administration Propriétaire',
      ar: 'لوحة تحكم وإدارة المالك'
    },
    badge: {
      en: 'EXECUTIVE',
      es: 'EJECUTIVO',
      fr: 'EXÉCUTIF',
      ar: 'الإدارة'
    },
    desc: {
      en: 'Manage imagery, site sections, payment methods, camp settings, and editorial publications.',
      es: 'Gestiona imágenes, secciones, pagos, campamentos y publicaciones editoriales.',
      fr: 'Gérez médias, sections, moyens de paiement, paramètres des camps et articles.',
      ar: 'تحكم كامل بالصور والأقسام ووسائل الدفع وإعدادات المعسكرات والمقالات.'
    },
    icon: ShieldCheck,
    accent: 'gold'
  }
];

const ACCENT_STYLES: Record<'gold' | 'emerald' | 'slate', { color: string; bg: string; border: string; badgeClass: string }> = {
  gold: {
    color: '#D4AF37',
    bg: 'rgba(212, 175, 55, 0.1)',
    border: 'rgba(212, 175, 55, 0.3)',
    badgeClass: 'bg-[#D4AF37]/12 text-[#D4AF37] border-[#D4AF37]/30'
  },
  emerald: {
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    badgeClass: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/30'
  },
  slate: {
    color: '#E2E8F0',
    bg: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.14)',
    badgeClass: 'bg-white/[0.06] text-slate-300 border-white/[0.14]'
  }
};

export const SideOptionsDrawer: React.FC<SideOptionsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenProfile,
  currentLang
}) => {
  const isAr = currentLang === 'ar';
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'flagship' | 'labs' | 'clubs' | 'editorial'>('all');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [ownerCfg, setOwnerCfg] = useState(() => OwnerConfigService.getConfig());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleAuthChange = (e: CustomEvent<{ user?: AuthUser | null }>) => {
      const user = e.detail?.user !== undefined ? e.detail.user : authService.getCurrentUser();
      setCurrentUser(user);
    };
    window.addEventListener('yard300_auth_change', handleAuthChange as EventListener);
    const unsubOwner = OwnerConfigService.subscribe((cfg) => setOwnerCfg(cfg));
    return () => {
      window.removeEventListener('yard300_auth_change', handleAuthChange as EventListener);
      unsubOwner();
    };
  }, []);

  const clubPrice = ownerCfg.siteSettings?.clubMembershipPrice ?? 30;
  const campCap = ownerCfg.siteSettings?.campCapacity ?? 300;

  const localizedOptions = DRAWER_OPTIONS.map((item) => {
    if (item.id === 'customClub') {
      return {
        ...item,
        title: {
          en: `YARD Private Athletic Club ($${clubPrice} · Level 3)`,
          es: `Club Atlético Privado YARD ($${clubPrice} · Nivel 3)`,
          fr: `Club Athlétique Privé YARD (${clubPrice} $ · Niveau 3)`,
          ar: `ناديي الرياضي الخاص (${clubPrice}$ · المستوى 3)`
        },
        badge: {
          en: `$${clubPrice} · CLUB`,
          es: `$${clubPrice} · CLUB`,
          fr: `${clubPrice} $ · CLUB`,
          ar: `النادي · ${clubPrice}$`
        }
      };
    }
    if (item.id === 'yardCamp') {
      return {
        ...item,
        badge: {
          en: `${campCap} / CAMP`,
          es: `${campCap} / CAMP`,
          fr: `${campCap} / CAMP`,
          ar: `${campCap} رياضي`
        }
      };
    }
    return item;
  });

  const filteredOptions = localizedOptions.filter((item) => {
    const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;
    const matchesSearch =
      item.title.ar.toLowerCase().includes(q) ||
      item.title.en.toLowerCase().includes(q) ||
      item.title.es.toLowerCase().includes(q) ||
      item.title.fr.toLowerCase().includes(q) ||
      item.desc.ar.toLowerCase().includes(q) ||
      item.desc.en.toLowerCase().includes(q) ||
      item.desc.es.toLowerCase().includes(q) ||
      item.desc.fr.toLowerCase().includes(q);
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

  const filterTabs: { id: 'all' | 'flagship' | 'labs' | 'clubs' | 'editorial'; label: LocalizedString }[] = [
    { id: 'all', label: { en: 'Directory', es: 'Directorio', fr: 'Répertoire', ar: 'الدليل' } },
    { id: 'flagship', label: { en: 'Champions · Store · Resort', es: 'Campeones · Tienda · Resort', fr: 'Champions · Boutique · Resort', ar: 'الأبطال · المتجر · المنتجع' } },
    { id: 'clubs', label: { en: 'Club · Camp · Arena', es: 'Club · Camp · Arena', fr: 'Club · Camp · Arène', ar: 'النادي · الكامب · الحلبة' } },
    { id: 'labs', label: { en: 'Biometrics & AI', es: 'Biometría e IA', fr: 'Biométrie & IA', ar: 'المختبر والذكاء' } },
    { id: 'editorial', label: { en: 'Stories & Control', es: 'Historias y Gestión', fr: 'Dossiers & Gestion', ar: 'القصص والإدارة' } }
  ];

  return (
    <>
      {/* Obsidian Backdrop */}
      <div
        className={`fixed inset-0 bg-[#040507]/85 backdrop-blur-md z-[70] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          soundFX.playButtonClick();
          onClose();
        }}
      />

      {/* Executive Side Options Drawer */}
      <aside
        aria-label={tr(currentLang, {
          en: 'YARD 300 Options & Services',
          es: 'Opciones y Servicios YARD 300',
          fr: 'Options et Services YARD 300',
          ar: 'بوابة خيارات وخدمات YARD 300'
        })}
        className={`fixed top-0 bottom-0 ${
          isAr ? 'right-0 border-l border-white/[0.1]' : 'left-0 border-r border-white/[0.1]'
        } w-full sm:w-[460px] max-w-[95vw] bg-gradient-to-b from-[#080A0F] via-[#06080C] to-[#040507] text-white z-[80] shadow-[0_24px_80px_rgba(0,0,0,0.85)] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : isAr ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        {/* Minimal Executive Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] bg-[#0B0E14]/95 backdrop-blur-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/35 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] block">
                {tr(currentLang, {
                  en: 'YARD 300 · OPTIONS',
                  es: 'YARD 300 · OPCIONES',
                  fr: 'YARD 300 · OPTIONS',
                  ar: 'YARD 300 · الخيارات'
                })}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {tr(currentLang, {
                  en: 'Destinations, Store & Performance Labs',
                  es: 'Destinos, Tienda y Laboratorios',
                  fr: 'Destinations, Boutique & Laboratoires',
                  ar: 'لوحة الأبطال، المتجر، المنتجع والمختبرات'
                })}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFX.playButtonClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#11151E] border border-white/[0.1] text-slate-400 hover:text-white hover:border-[#D4AF37]/50 transition-colors cursor-pointer shrink-0"
            aria-label={tr(currentLang, {
              en: 'Close Options Menu',
              es: 'Cerrar Menú',
              fr: 'Fermer le Menu',
              ar: 'إغلاق القائمة'
            })}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-4 pt-3.5 pb-2">
          <div className="relative">
            <Search className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr(currentLang, {
                en: 'Search destinations, labs, or services...',
                es: 'Buscar destinos, tienda o laboratorios...',
                fr: 'Rechercher destinations, boutique ou labos...',
                ar: 'ابحث في المنتجع، المتجر، الأبطال أو المختبرات...'
              })}
              className={`w-full bg-[#0C0F16] border border-white/[0.1] focus:border-[#D4AF37]/60 rounded-xl py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors ${
                isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
              }`}
            />
          </div>
        </div>

        {/* Clean Hairline Filter Tabs */}
        <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-white/[0.06]">
          {filterTabs.map((tab) => {
            const active = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setSelectedFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#D4AF37] text-[#07080C]'
                    : 'bg-[#0C0F16] text-slate-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {tr(currentLang, tab.label)}
              </button>
            );
          })}
        </div>

        {/* Numbered Luxury Directory List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 yard-slim-scrollbar">
          {filteredOptions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-medium text-xs">
              {tr(currentLang, {
                en: 'No matching services found.',
                es: 'No se encontraron resultados.',
                fr: 'Aucun service correspondant.',
                ar: 'لا توجد خيارات مطابقة لبحثك.'
              })}
            </div>
          ) : (
            filteredOptions.map((item, idx) => {
              const Icon = item.icon;
              const style = ACCENT_STYLES[item.accent];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleSelect(item.id, e)}
                  className="w-full text-start p-3.5 rounded-2xl bg-[#0B0E14] hover:bg-[#111620] border border-white/[0.08] hover:border-[#D4AF37]/45 transition-all duration-200 group flex items-start gap-3 cursor-pointer"
                >
                  {/* Editorial Index + Minimal Icon */}
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105"
                      style={{
                        backgroundColor: style.bg,
                        borderColor: style.border
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: style.color }} />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 tabular-nums" dir="ltr">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs sm:text-[13px] text-white group-hover:text-[#D4AF37] transition-colors truncate">
                        {tr(currentLang, item.title)}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold border uppercase tracking-wider shrink-0 whitespace-nowrap ${style.badgeClass}`}>
                        {tr(currentLang, item.badge)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {tr(currentLang, item.desc)}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="self-center text-slate-600 group-hover:text-[#D4AF37] transition-colors shrink-0">
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Clean Executive Footer (Profile & Owner Portal Only) */}
        <div className="p-4 bg-[#07090D] border-t border-white/[0.08] space-y-2">
          <button
            type="button"
            onClick={handleProfileClick}
            className="w-full p-2.5 rounded-xl bg-[#0C0F16] hover:bg-[#121722] border border-white/[0.08] hover:border-[#D4AF37]/45 flex items-center justify-between gap-3 text-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/12 border border-[#D4AF37]/35 flex items-center justify-center overflow-hidden shrink-0">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-[#D4AF37]" />
                )}
              </div>
              <div className="text-start min-w-0">
                <span className="block font-semibold text-white text-xs truncate group-hover:text-[#D4AF37] transition-colors">
                  {currentUser
                    ? tr(currentLang, {
                        en: `Athlete Profile · ${currentUser.name}`,
                        es: `Perfil Atleta · ${currentUser.name}`,
                        fr: `Profil Athlète · ${currentUser.name}`,
                        ar: `ملف البطل · ${currentUser.name}`
                      })
                    : tr(currentLang, {
                        en: 'Athlete Profile & Aura Passport',
                        es: 'Perfil de Atleta y Pasaporte Aura',
                        fr: 'Profil Athlète & Passeport Aura',
                        ar: 'الملف الرياضي وجواز الهالة'
                      })}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {currentUser
                    ? currentUser.email
                    : tr(currentLang, {
                        en: 'Performance telemetry & connected wearables',
                        es: 'Telemetría deportiva y relojes conectados',
                        fr: 'Télémétrie sportive et montres connectées',
                        ar: 'القراءات الحيوية وربط الساعات والأجهزة الذكية'
                      })}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-[#D4AF37] text-[#07080C] px-2 py-0.5 rounded font-mono font-bold shrink-0">
              {currentUser ? currentUser.rankTitle.split(' ')[0] : 'S-RANK'}
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => handleSelect('ownerDashboard', e)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#0C0F16] hover:bg-[#131824] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 text-[11px] font-semibold text-[#D4AF37] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {tr(currentLang, {
                en: 'Owner Management Portal',
                es: 'Portal de Gestión del Propietario',
                fr: 'Portail d’Administration Propriétaire',
                ar: 'لوحة تحكم وإدارة المالك'
              })}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideOptionsDrawer;
