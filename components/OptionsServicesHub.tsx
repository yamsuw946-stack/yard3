/**
 * OptionsServicesHub.tsx
 * Consolidated 2026 Options Hub featuring Magnetic Horizontal Snap Coverflow Track + Grid View,
 * sliding spatial category dock, drag-to-scroll physics, and unified YARD 300 directory.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Swords,
  Bot,
  ShoppingBag,
  Search,
  ArrowRight,
  Ticket,
  Crown,
  Compass,
  Palmtree,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
  Trophy
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';
import ProductGrid from './ProductGrid';
import { Product } from '../types';
import { OwnerConfigService } from '../services/ownerConfigService';

interface OptionsServicesHubProps {
  currentLang?: Language;
  onSelectOption: (optionId: string) => void;
  onSelectProduct?: (product: Product) => void;
  onBackToHome?: () => void;
}

interface LocalizedText {
  en: string;
  es: string;
  fr: string;
  ar: string;
}

interface ServiceOption {
  id: string;
  category: 'destinations' | 'performance' | 'store';
  title: LocalizedText;
  subtitle: LocalizedText;
  badge: LocalizedText;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  image?: string;
  stats: LocalizedText;
  features: { en: string[]; es: string[]; fr: string[]; ar: string[] };
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'leaderboard',
    category: 'performance',
    title: {
      en: 'Weekly (10) & Monthly (50) Champions + Readings',
      es: 'Campeones Semanales (10) y Mensuales (50) + Lecturas',
      fr: 'Champions Hebdo (10) & Mensuels (50) + Mesures',
      ar: 'لوحة المتصدرين والأبطال (الأسبوعية والشهرية) وقراءات التدريب'
    },
    subtitle: {
      en: 'Live Weekly Top 10, Monthly Top 50, All-Time 300 Legion, and verified training readings (HRV, VO2 Max, RHR, Hours).',
      es: 'Top 10 semanal, Top 50 mensual, Legión 300 y lecturas verificadas de entrenamiento (VFC, VO2 Máx, FC reposo, horas).',
      fr: 'Top 10 hebdo, Top 50 mensuel, Légion 300 et mesures d’entraînement vérifiées (VFC, VO2 Max, FC repos, heures).',
      ar: 'التصنيف الأسبوعي (أفضل 10) والشهري (أفضل 50) وفيلق الـ 300 مع قراءات التدريب الحيوية (HRV، VO2 Max، نبض الراحة، ساعات التدريب).'
    },
    badge: {
      en: 'CHAMPIONS · TELEMETRY',
      es: 'CAMPEONES · LECTURAS',
      fr: 'CHAMPIONS · MESURES',
      ar: 'الأبطال · قراءات التدريب'
    },
    icon: Trophy,
    accentColor: '#10B981',
    image: '/images/ai_human_gulf_champion.jpg',
    stats: {
      en: 'Weekly Top 10 · Monthly Top 50 · 300 Legion',
      es: 'Top 10 Semanal · Top 50 Mensual · Legión 300',
      fr: 'Top 10 Hebdo · Top 50 Mensuel · Légion 300',
      ar: 'أفضل 10 أسبوعياً · 50 شهرياً · 300 دائم'
    },
    features: {
      en: ['HRV, VO2 Max & Training Hours', 'Weekly Top 10 & Monthly Top 50', 'Interactive Champion Dossiers'],
      es: ['VFC, VO2 Máx y Horas de Entreno', 'Top 10 Semanal y Top 50 Mensual', 'Expedientes Interactivos de Campeones'],
      fr: ['VFC, VO2 Max & Heures d’Entraînement', 'Top 10 Hebdo & Top 50 Mensuel', 'Dossiers Interactifs des Champions'],
      ar: ['قراءات HRV و VO2 Max وساعات التدريب', 'أبطال الأسبوع (10) والشهر (50)', 'ملفات فحص دقيقة لكل بطل']
    }
  },
  {
    id: 'customClub',
    category: 'destinations',
    title: {
      en: 'YARD Private Athletic Club ($30)',
      es: 'Club Atlético Privado YARD ($30)',
      fr: 'Club Athlétique Privé YARD ($30)',
      ar: 'النادي الرياضي الخاص ($30)'
    },
    subtitle: {
      en: 'Own & name your custom athletic club, broadcast 24h stories, and build your training squad.',
      es: 'Crea y nombra tu club atlético privado, publica historias de 24h y reúne a tu equipo de entrenamiento.',
      fr: 'Possédez et nommez votre club privé, diffusez des stories 24h et fédérez votre équipe.',
      ar: 'امتلاك وتسمية ناديك الرياضي الخاص، نشر الستوريات اليومية، واستقطاب الأعضاء.'
    },
    badge: {
      en: '$30 · CLUB',
      es: '$30 · CLUB',
      fr: '30 $ · CLUB',
      ar: 'النادي · 30$'
    },
    icon: Crown,
    accentColor: '#D4AF37',
    image: '/images/ai_human_arena_duo.jpg',
    stats: {
      en: 'Level 3 Ownership',
      es: 'Propiedad Nivel 3',
      fr: 'Propriété Niveau 3',
      ar: 'ملكية المستوى 3'
    },
    features: {
      en: ['Custom Club Brand & Emblem', '24h Athlete Story Broadcasts', 'Direct Member Invite Links'],
      es: ['Marca y Emblema del Club', 'Historias de Atletas 24h', 'Enlaces Directos de Invitación'],
      fr: ['Identité et Emblème du Club', 'Stories Athlètes 24h', 'Liens d’Invitation Directs'],
      ar: ['هوية وشعار نادٍ مخصص', 'نشر قصص التمرين 24 ساعة', 'روابط دعوة مباشرة للأعضاء']
    }
  },
  {
    id: 'yardCamp',
    category: 'destinations',
    title: {
      en: 'YARD 300 Global Expedition Camp',
      es: 'Campamento de Expedición Global YARD 300',
      fr: 'Camp d’Expédition Mondial YARD 300',
      ar: 'كامب يارد 300 الدولي'
    },
    subtitle: {
      en: 'Strictly 300 athletes per camp under direct supervision of the Founders and our international coaching crew.',
      es: 'Estrictamente 300 atletas por campamento bajo supervisión directa de los Fundadores y nuestro equipo internacional.',
      fr: 'Strictement 300 athlètes par camp sous la supervision directe des Fondateurs et de nos coachs internationaux.',
      ar: 'معسكر دولي لـ 300 شخص لكل مخيم تحت إشراف المؤسسين وفريق المدربين العالميين.'
    },
    badge: {
      en: '300 PER CAMP',
      es: '300 POR CAMP',
      fr: '300 PAR CAMP',
      ar: '300 لكل مخيم'
    },
    icon: Compass,
    accentColor: '#D4AF37',
    image: '/images/yard_camp_expedition.jpg',
    stats: {
      en: '3 Camps / Year',
      es: '3 Campamentos / Año',
      fr: '3 Camps / An',
      ar: '3 معسكرات سنوياً'
    },
    features: {
      en: ['Founders Supervision', 'Global Conditioning Locations', 'Strictly 300 Athletes Cap'],
      es: ['Supervisión de Fundadores', 'Sedes Globales de Preparación', 'Límite Estricto de 300 Atletas'],
      fr: ['Supervision des Fondateurs', 'Sites Internationaux d’Élite', 'Plafond Strict à 300 Athlètes'],
      ar: ['إشراف مباشر من المؤسسين', 'مواقع تدريب دولية مختارة', 'حد أقصى 300 رياضي']
    }
  },
  {
    id: 'bazaruto',
    category: 'destinations',
    title: {
      en: 'YARD Bio-Recovery Resort · Bazaruto',
      es: 'Resort de Bio-Recuperación YARD · Bazaruto',
      fr: 'Resort Bio-Récupération YARD · Bazaruto',
      ar: 'منتجع يارد الصحي · أرخبيل بازاروتو'
    },
    subtitle: {
      en: 'Opening October 2027. 10 beachfront villas, 30 hotel suites + 4 VIP suites, marine recovery pools & wellness clinic.',
      es: 'Apertura octubre 2027. 10 villas frente al mar, 30 suites + 4 suites VIP, piscinas marinas y clínica de recuperación.',
      fr: 'Ouverture octobre 2027. 10 villas en bord de mer, 30 suites + 4 suites VIP, bassins marins et clinique santé.',
      ar: 'الافتتاح أكتوبر 2027. 10 فيلل شاطئية فاخرة، 30 غرفة و4 أجنحة VIP، مسابح ومستشفى استشفاء متكامل.'
    },
    badge: {
      en: 'OCT 2027 · VIP',
      es: 'OCT 2027 · VIP',
      fr: 'OCT 2027 · VIP',
      ar: 'أكتوبر 2027 · VIP'
    },
    icon: Palmtree,
    accentColor: '#10B981',
    image: '/images/bazaruto_aerial_night_v3.jpg',
    stats: {
      en: 'Bazaruto Island',
      es: 'Isla de Bazaruto',
      fr: 'Île de Bazaruto',
      ar: 'جزيرة بازاروتو'
    },
    features: {
      en: ['Private Island Sanctuary', 'Biometric & Mental Recovery', 'Designed by Ayman .A. suwaidi'],
      es: ['Santuario en Isla Privada', 'Recuperación Biométrica y Mental', 'Diseñado por Ayman .A. suwaidi'],
      fr: ['Sanctuaire sur Île Privée', 'Récupération Biométrique & Mentale', 'Conçu par Ayman .A. suwaidi'],
      ar: ['ملاذ خاص في أرخبيل بازاروتو', 'مستشفى لعلاج الإصابات والتعافي', 'تصميم Ayman .A. suwaidi']
    }
  },
  {
    id: 'products',
    category: 'store',
    title: {
      en: 'YARD 300 Luxury Store (300 Units)',
      es: 'Tienda de Lujo YARD 300 (300 Unidades)',
      fr: 'Boutique Luxe YARD 300 (300 Unités)',
      ar: 'متجر يارد 300 الحصري (300 قطعة)'
    },
    subtitle: {
      en: 'Precision athletic wear and carbon-composite gear serialized strictly to 300 units worldwide.',
      es: 'Indumentaria atlética y equipamiento de carbono numerado estrictamente a 300 unidades en el mundo.',
      fr: 'Vêtements techniques et équipement carbone numérotés strictement à 300 exemplaires mondiaux.',
      ar: 'ملابس ومعدات رياضية عالية الجودة مرقمة بدقة بـ 300 قطعة فقط على مستوى العالم.'
    },
    badge: {
      en: '300 SERIALIZED',
      es: '300 SERIADAS',
      fr: '300 NUMÉROTÉES',
      ar: 'إصدار 300 قطعة'
    },
    icon: ShoppingBag,
    accentColor: '#D4AF37',
    stats: {
      en: 'Men & Women Editions',
      es: 'Ediciones Hombre y Mujer',
      fr: 'Éditions Homme & Femme',
      ar: 'إصدارات رجالية ونسائية'
    },
    features: {
      en: ['Strictly 300 Units / Drop', 'Technical Moisture Fabrics', 'Direct Global Checkout'],
      es: ['Solo 300 Unidades por Edición', 'Tejidos Técnicos Transpirables', 'Pago Global Directo'],
      fr: ['300 Unités Strictes / Drop', 'Tissus Techniques Haute Performance', 'Paiement Mondial Direct'],
      ar: ['300 قطعة فقط لكل تصميم', 'أنسجة تقنية عالية الأداء', 'دفع إلكتروني وشحن دولي']
    }
  },
  {
    id: 'yardEngine',
    category: 'performance',
    title: {
      en: 'Biometric, Sleep & ACWR Injury Lab',
      es: 'Laboratorio Biométrico, Sueño y ACWR',
      fr: 'Labo Biométrie, Sommeil & Blessures ACWR',
      ar: 'المختبر الحيوي والنوم والتنبؤ بالإصابات'
    },
    subtitle: {
      en: 'Unified clinical telemetry combining deep-sleep staging, HRV status, and Gabbett ACWR 7-day injury prediction.',
      es: 'Telemetría clínica unificada: fases de sueño profundo, VFC y predicción de lesiones Gabbett ACWR a 7 días.',
      fr: 'Télémétrie clinique unifiée : phases de sommeil NREM3, statut VFC et prédiction des blessures ACWR 7 jours.',
      ar: 'منظومة سريرية موحدة لتحليل أطوار النوم العميق ومعدل HRV والتنبؤ بإصابات الأوتار ACWR.'
    },
    badge: {
      en: 'CLINICAL LAB',
      es: 'LAB CLÍNICO',
      fr: 'LABO CLINIQUE',
      ar: 'المختبر الحيوي'
    },
    icon: Activity,
    accentColor: '#10B981',
    stats: {
      en: '99.4% Precision',
      es: '99.4% Precisión',
      fr: 'Précision 99,4%',
      ar: 'دقة سريرية 99.4%'
    },
    features: {
      en: ['NREM3 & REM Sleep Staging', 'Gabbett ACWR Risk Engine', 'Automated Deload Alerts'],
      es: ['Fases NREM3 y REM del Sueño', 'Motor de Riesgo Gabbett ACWR', 'Alertas Automáticas de Descarga'],
      fr: ['Analyse Sommeil NREM3 & REM', 'Moteur de Risque Gabbett ACWR', 'Alertes Préventives Automatisées'],
      ar: ['تحليل مراحل النوم العميق', 'مؤشر الحمل الحاد والمزمن', 'تنبيهات وقائية ذكية']
    }
  },
  {
    id: 'arena',
    category: 'performance',
    title: {
      en: 'Live Performance Arena & Challenges',
      es: 'Arena de Rendimiento y Desafíos en Vivo',
      fr: 'Arène de Performance & Défis en Direct',
      ar: 'حلبة الأداء والتحديات المباشرة'
    },
    subtitle: {
      en: 'Real-time striking drills, heart-rate zone calibration, and verified S-Rank athlete bouts.',
      es: 'Ejercicios de golpeo en tiempo real, calibración cardíaca por zonas y combates S-Rank verificados.',
      fr: 'Exercices de frappe en direct, calibration cardiaque par zones et duels S-Rank vérifiés.',
      ar: 'تحديات قتالية ولياقية مباشرة مع قياس نبض القلب ومعايير تصنيف S-Rank.'
    },
    badge: {
      en: 'LIVE ARENA',
      es: 'ARENA EN VIVO',
      fr: 'ARÈNE EN DIRECT',
      ar: 'حلبة الأداء'
    },
    icon: Swords,
    accentColor: '#D4AF37',
    image: '/images/athlete_italian_muaythai.jpg',
    stats: {
      en: 'S-Rank Trial Arena',
      es: 'Arena de Pruebas S-Rank',
      fr: 'Arène d’Essai S-Rank',
      ar: 'حلبة تصنيف S-Rank'
    },
    features: {
      en: ['Reactive Striking Drills', 'Heart-Rate Zone Tracking', 'Live Trial Execution'],
      es: ['Pruebas de Reflejo y Golpeo', 'Seguimiento Cardíaco por Zonas', 'Ejecución de Retos en Vivo'],
      fr: ['Exercices de Réflexes & Frappe', 'Suivi Cardiaque par Zones', 'Exécution de Défis en Direct'],
      ar: ['تمارين سرعة رد الفعل', 'متابعة نبضات القلب', 'تنفيذ التحديات مباشرة']
    }
  },
  {
    id: 'ai-coach',
    category: 'performance',
    title: {
      en: 'AI Performance Director',
      es: 'Director de Rendimiento IA',
      fr: 'Directeur de Performance IA',
      ar: 'المدرب الذكي بالذكاء الاصطناعي'
    },
    subtitle: {
      en: 'Adaptive training counsel, daily conditioning briefings, and tailored recovery guidance.',
      es: 'Asesoría de entrenamiento adaptativo, reportes diarios de preparación y guía personalizada de recuperación.',
      fr: 'Conseils d’entraînement adaptatif, bilans quotidiens de préparation et récupération personnalisée.',
      ar: 'استشارات تدريب تكيفية، خطط استشفاء ذكية، وتوجيه يومي مخصص حسب حملك العضلي.'
    },
    badge: {
      en: 'AI COACH',
      es: 'COACH IA',
      fr: 'COACH IA',
      ar: 'ذكاء اصطناعي'
    },
    icon: Bot,
    accentColor: '#10B981',
    image: '/images/ai_human_performance_coach.jpg',
    stats: {
      en: 'Dr. Soren Cole AI',
      es: 'Dr. Soren Cole IA',
      fr: 'Dr Soren Cole IA',
      ar: 'د. سورين كول'
    },
    features: {
      en: ['Daily Readiness Briefings', 'Sleep Wind-Down Timing', 'Interactive Q&A Guidance'],
      es: ['Reportes Diarios de Disposición', 'Horarios Óptimos de Sueño', 'Guía Interactiva en Directo'],
      fr: ['Bilans Quotidiens de Forme', 'Horaires Optimaux de Sommeil', 'Conseils Interactifs en Direct'],
      ar: ['توجيهات جاهزية يومية', 'مواعيد التهيئة للنوم', 'إجابات فورية مخصصة']
    }
  },
  {
    id: 'tickets',
    category: 'store',
    title: {
      en: 'Championships & Live Event Passes',
      es: 'Campeonatos y Entradas Oficiales',
      fr: 'Championnats & Billets Officiels',
      ar: 'تذاكر البطولات والفعاليات الحية'
    },
    subtitle: {
      en: 'Official schedule and verified passes for the 10-challenge YARD 300 Championship launching Jan 5, 2027.',
      es: 'Calendario oficial y pases verificados del Campeonato YARD 300 (10 desafíos) desde el 5 de enero de 2027.',
      fr: 'Calendrier officiel et billets pour le Championnat YARD 300 (10 défis) lancé le 5 janvier 2027.',
      ar: 'جدول البطولات العالمية وتذاكر بطولة الـ 10 تحديات التي تنطلق مبيعاتها في 5 يناير 2027.'
    },
    badge: {
      en: 'JAN 5, 2027',
      es: '5 ENE 2027',
      fr: '5 JAN 2027',
      ar: '5 يناير 2027'
    },
    icon: Ticket,
    accentColor: '#D4AF37',
    stats: {
      en: '10 Nature Challenges',
      es: '10 Desafíos en Naturaleza',
      fr: '10 Défis en Nature',
      ar: '10 تحديات في الطبيعة'
    },
    features: {
      en: ['VIP Ringside Seating', 'Verified Digital Passes', 'Jan 5, 2027 Global Release'],
      es: ['Asientos VIP en Primera Fila', 'Pases Digitales Verificados', 'Lanzamiento 5 de enero 2027'],
      fr: ['Places VIP Bord du Ring', 'Billets Numériques Vérifiés', 'Lancement le 5 janvier 2027'],
      ar: ['مقاعد المنصة الرئيسية', 'تذاكر رقمية موثقة', 'إطلاق التذاكر 5 يناير 2027']
    }
  }
];

const FILTER_TABS: { id: 'all' | 'destinations' | 'performance' | 'store'; label: LocalizedText }[] = [
  { id: 'all', label: { en: 'All Options (9)', es: 'Todas las Opciones (9)', fr: 'Toutes les Options (9)', ar: 'كافة الخيارات (9)' } },
  { id: 'destinations', label: { en: 'Club · Camp · Resort', es: 'Club · Camp · Resort', fr: 'Club · Camp · Resort', ar: 'النادي · الكامب · المنتجع' } },
  { id: 'performance', label: { en: 'Champions · Labs · AI', es: 'Campeones · Labs · IA', fr: 'Champions · Labos · IA', ar: 'الأبطال · المختبر · الذكاء' } },
  { id: 'store', label: { en: 'Store & Championships', es: 'Tienda y Campeonatos', fr: 'Boutique & Championnats', ar: 'المتجر والبطولات' } }
];

export const OptionsServicesHub: React.FC<OptionsServicesHubProps> = ({
  currentLang = 'en',
  onSelectOption,
  onSelectProduct,
  onBackToHome
}) => {
  const isAr = currentLang === 'ar';
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'destinations' | 'performance' | 'store'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'rail' | 'grid'>('rail');
  const [activeCardIdx, setActiveCardIdx] = useState<number>(0);
  const [ownerCfg, setOwnerCfg] = useState(() => OwnerConfigService.getConfig());

  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStateRef = useRef<{ isDown: boolean; startX: number; scrollLeft: number }>({
    isDown: false,
    startX: 0,
    scrollLeft: 0
  });

  useEffect(() => {
    return OwnerConfigService.subscribe((cfg) => setOwnerCfg(cfg));
  }, []);

  const dynamicOptions = SERVICE_OPTIONS.map((opt) => {
    if (opt.id === 'customClub') {
      const price = ownerCfg.siteSettings?.clubMembershipPrice ?? 30;
      return {
        ...opt,
        title: {
          en: `YARD Private Athletic Club ($${price})`,
          es: `Club Atlético Privado YARD ($${price})`,
          fr: `Club Athlétique Privé YARD ($${price})`,
          ar: `النادي الرياضي الخاص ($${price})`
        },
        badge: {
          en: `$${price} · CLUB`,
          es: `$${price} · CLUB`,
          fr: `${price} $ · CLUB`,
          ar: `النادي · ${price}$`
        }
      };
    }
    if (opt.id === 'yardCamp') {
      const cap = ownerCfg.siteSettings?.campCapacity ?? 300;
      return {
        ...opt,
        badge: {
          en: `${cap} PER CAMP`,
          es: `${cap} POR CAMP`,
          fr: `${cap} PAR CAMP`,
          ar: `${cap} لكل مخيم`
        }
      };
    }
    if (opt.id === 'bazaruto') {
      return {
        ...opt,
        image: ownerCfg.resort?.aerialNightImage || opt.image
      };
    }
    return opt;
  });

  const filteredOptions = dynamicOptions.filter((opt) => {
    const matchesFilter = selectedFilter === 'all' || opt.category === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      tr(currentLang, opt.title).toLowerCase().includes(q) ||
      tr(currentLang, opt.subtitle).toLowerCase().includes(q) ||
      opt.title.en.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    setActiveCardIdx(0);
  }, [selectedFilter, searchQuery]);

  const snapToCard = (idx: number) => {
    const safeIdx = Math.max(0, Math.min(idx, filteredOptions.length - 1));
    setActiveCardIdx(safeIdx);
    const el = cardRefs.current[safeIdx];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const handleTrackMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (!trackRef.current) return;
    dragStateRef.current = {
      isDown: true,
      startX: e.pageX - trackRef.current.offsetLeft,
      scrollLeft: trackRef.current.scrollLeft
    };
  };

  const handleTrackMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDown || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - dragStateRef.current.startX) * 1.35;
    trackRef.current.scrollLeft = dragStateRef.current.scrollLeft - walk;
  };

  const stopTrackDrag = () => {
    dragStateRef.current.isDown = false;
  };

  const handleOpenCard = (opt: ServiceOption) => {
    soundFX.playButtonClick();
    if (opt.id === 'products') {
      setSelectedFilter('store');
      setTimeout(() => {
        const el = document.getElementById('store-gear-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      onSelectOption(opt.id);
    }
  };

  const activeTabIndex = FILTER_TABS.findIndex((t) => t.id === selectedFilter);

  const renderCard = (opt: ServiceOption, idx: number, isRail: boolean) => {
    const Icon = opt.icon;
    const isActive = idx === activeCardIdx;
    return (
      <div
        key={opt.id}
        ref={(el) => {
          cardRefs.current[idx] = el;
        }}
        onClick={() => isRail && setActiveCardIdx(idx)}
        className={`bg-[#0C0E14] border rounded-2xl overflow-hidden transition-all duration-400 flex flex-col justify-between group ${
          isRail
            ? `snap-center shrink-0 w-[84vw] sm:w-[330px] lg:w-[340px] ${
                isActive
                  ? 'border-[#D4AF37]/65 scale-100 opacity-100 shadow-[0_20px_50px_rgba(0,0,0,0.65)]'
                  : 'border-white/[0.08] scale-[0.96] opacity-75 hover:opacity-100'
              }`
            : 'border-white/[0.08] hover:border-[#D4AF37]/50'
        }`}
      >
        <div>
          {opt.image ? (
            <div className="relative h-44 w-full overflow-hidden">
              <img
                loading="lazy"
                decoding="async"
                src={opt.image}
                alt={tr(currentLang, opt.title)}
                onError={handleImageError}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E14] via-[#0C0E14]/40 to-transparent" />
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#07080C]"
                  style={{ backgroundColor: opt.accentColor }}
                >
                  {tr(currentLang, opt.badge)}
                </span>
                <span className="text-[10px] font-mono text-white/75 bg-[#07080C]/75 px-2 py-0.5 rounded tabular-nums" dir="ltr">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 pb-2 flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{
                  backgroundColor: `${opt.accentColor}15`,
                  color: opt.accentColor,
                  borderColor: `${opt.accentColor}35`
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
                style={{
                  color: opt.accentColor,
                  borderColor: `${opt.accentColor}35`,
                  backgroundColor: `${opt.accentColor}12`
                }}
              >
                {tr(currentLang, opt.badge)}
              </span>
            </div>
          )}

          <div className="p-5 space-y-3">
            <div>
              <h3 className="text-base font-bold text-white leading-snug">
                {tr(currentLang, opt.title)}
              </h3>
              <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
                {tr(currentLang, opt.stats)}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
              {tr(currentLang, opt.subtitle)}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              {(opt.features[currentLang] || opt.features.en).map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: opt.accentColor }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenCard(opt);
            }}
            className="w-full py-2.5 rounded-xl bg-[#121622] hover:bg-[#10B981] text-white hover:text-[#050807] font-semibold text-xs border border-emerald-500/20 hover:border-[#10B981] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {tr(currentLang, {
                en: 'Open Hub',
                es: 'Abrir Sección',
                fr: 'Ouvrir la Section',
                ar: 'فتح القسم'
              })}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen pt-28 pb-24 bg-[#07080C] text-white relative overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
        {/* Back & Badge Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="group flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
            >
              <span>{isAr ? '→' : '←'}</span>
              <span>
                {tr(currentLang, {
                  en: 'Back to Home',
                  es: 'Volver al Inicio',
                  fr: "Retour à l'Accueil",
                  ar: 'العودة للرئيسية'
                })}
              </span>
            </button>
          )}

          <div className="px-3.5 py-1.5 rounded-lg bg-[#0C0E14] border border-emerald-500/25 text-xs font-mono text-[#10B981]">
            YARD 300 // SPATIAL ECOSYSTEM HUB
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-[#0C0E14] rounded-3xl p-7 md:p-10 border border-white/[0.08] mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] block">
              {tr(currentLang, {
                en: '2026–2027 SPATIAL DIRECTORY',
                es: 'DIRECTORIO ESPACIAL 2026–2027',
                fr: 'RÉPERTOIRE SPATIAL 2026–2027',
                ar: 'المنظومة المكانية 2026–2027'
              })}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              {tr(currentLang, {
                en: 'YARD 300 Options & Destinations',
                es: 'Opciones y Servicios YARD 300',
                fr: 'Services & Options YARD 300',
                ar: 'بوابة الخيارات والخدمات'
              })}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {tr(currentLang, {
                en: 'Swipe or scrub through the magnetic horizontal deck to inspect Club, Camp, Bazaruto Resort, Weekly & Monthly Champions, Biometric Labs, and Luxury drops.',
                es: 'Desliza o explora la pista magnética horizontal para abrir Club, Campamento, Resort Bazaruto, Campeones Semanales/Mensuales, Laboratorios y Tienda.',
                fr: 'Glissez sur la piste magnétique horizontale pour explorer Club, Camp, Resort Bazaruto, Champions Hebdo/Mensuels, Laboratoires et Boutique.',
                ar: 'مرّر بالسحب أو الأسهم عبر المسار المغناطيسي لاستعراض لوحة الأبطال الأسبوعية والشهرية والنادي والكامب ومنتجع بازاروتو والمختبرات الحيوية.'
              })}
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col gap-3">
            <div className="relative">
              <Search className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tr(currentLang, {
                  en: 'Search options...',
                  es: 'Buscar opciones...',
                  fr: 'Rechercher une option...',
                  ar: 'ابحث في الخيارات...'
                })}
                className={`bg-[#07080C] border border-white/[0.1] focus:border-[#10B981]/60 rounded-xl py-2.5 text-xs text-white outline-none w-full md:w-64 transition-colors ${
                  isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'
                }`}
              />
            </div>

            {/* Layout Switcher (Coverflow Rail vs Executive Grid) */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#07080C] border border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setViewMode('rail');
                }}
                className={`py-1.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'rail' ? 'bg-[#10B981] text-[#050807]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  {tr(currentLang, {
                    en: 'Coverflow',
                    es: 'Carrusel',
                    fr: 'Carrousel',
                    ar: 'مسار 2026'
                  })}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setViewMode('grid');
                }}
                className={`py-1.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#10B981] text-[#050807]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>
                  {tr(currentLang, {
                    en: 'Grid',
                    es: 'Cuadrícula',
                    fr: 'Grille',
                    ar: 'شبكة كاملة'
                  })}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Animated Spatial Category Segmented Dock */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative inline-grid grid-cols-2 sm:grid-cols-4 p-1 rounded-2xl bg-[#060908] border border-emerald-500/20">
            {FILTER_TABS.map((tab) => {
              const active = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setSelectedFilter(tab.id);
                  }}
                  className={`relative z-10 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    active
                      ? 'bg-[#10B981] text-[#050807] shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tr(currentLang, tab.label)}
                </button>
              );
            })}
          </div>

          {viewMode === 'rail' && filteredOptions.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => snapToCard(activeCardIdx - 1)}
                disabled={activeCardIdx === 0}
                className="w-9 h-9 rounded-xl bg-[#0C0E14] border border-emerald-500/25 hover:border-[#10B981] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Prev Hub"
              >
                {isAr ? <ChevronRight className="w-4 h-4 text-[#10B981]" /> : <ChevronLeft className="w-4 h-4 text-[#10B981]" />}
              </button>
              <span className="text-xs font-mono tabular-nums text-[#10B981] px-2" dir="ltr">
                {String(activeCardIdx + 1).padStart(2, '0')} / {String(filteredOptions.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => snapToCard(activeCardIdx + 1)}
                disabled={activeCardIdx >= filteredOptions.length - 1}
                className="w-9 h-9 rounded-xl bg-[#0C0E14] border border-emerald-500/25 hover:border-[#10B981] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Next Hub"
              >
                {isAr ? <ChevronLeft className="w-4 h-4 text-[#10B981]" /> : <ChevronRight className="w-4 h-4 text-[#10B981]" />}
              </button>
            </div>
          )}
        </div>

        {/* 2026 Horizontal Magnetic Snap Coverflow Track OR Grid */}
        {viewMode === 'rail' ? (
          <div className="space-y-4">
            <div
              ref={trackRef}
              onMouseDown={handleTrackMouseDown}
              onMouseMove={handleTrackMouseMove}
              onMouseUp={stopTrackDrag}
              onMouseLeave={stopTrackDrag}
              className="flex gap-5 overflow-x-auto pb-4 pt-2 px-1 yard-slim-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
            >
              {filteredOptions.map((opt, idx) => renderCard(opt, idx, true))}
            </div>

            {/* Obsidian Black + Emerald Green Illuminated Scrub Track under Coverflow Deck */}
            {filteredOptions.length > 1 && (
              <div className="max-w-md mx-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#050807] border border-emerald-500/25 shadow-[0_6px_22px_rgba(0,0,0,0.85)]">
                {filteredOptions.map((opt, idx) => {
                  const active = idx === activeCardIdx;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        soundFX.playButtonClick();
                        snapToCard(idx);
                      }}
                      aria-label={tr(currentLang, opt.title)}
                      className="flex-1 h-4 flex items-center cursor-pointer"
                    >
                      <span
                        className="block w-full h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: active ? '#10B981' : '#0E2419',
                          boxShadow: active ? '0 0 10px rgba(16,185,129,0.7)' : 'none',
                          transform: active ? 'scaleY(1.35)' : 'scaleY(1)'
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredOptions.map((opt, idx) => renderCard(opt, idx, false))}
          </div>
        )}

        {/* Store Section inside Options when All or Store selected */}
        {(selectedFilter === 'store' || selectedFilter === 'all' || activeTabIndex === 3) && (
          <div id="store-gear-section" className="mt-16 pt-10 border-t border-white/[0.08]">
            <div className="mb-8">
              <span className="text-xs font-mono uppercase text-[#D4AF37] tracking-wider block">
                {tr(currentLang, {
                  en: 'YARD 300 LUXURY ATELIER · 300 UNITS',
                  es: 'ATELIER DE LUJO YARD 300 · 300 UNIDADES',
                  fr: 'ATELIER DE LUXE YARD 300 · 300 UNITÉS',
                  ar: 'متجر يارد 300 الحصري (300 قطعة لكل إصدار)'
                })}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
                {tr(currentLang, {
                  en: 'Performance Apparel & Hardware',
                  es: 'Indumentaria Técnica y Equipamiento',
                  fr: 'Tenues de Performance & Équipement',
                  ar: 'العتاد والأزياء المعتمدة'
                })}
              </h2>
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
