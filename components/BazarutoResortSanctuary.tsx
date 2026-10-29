import React, { useState } from 'react';
import { 
  Palmtree, 
  Sparkles, 
  Waves, 
  Activity, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Clock, 
  Award, 
  HeartPulse, 
  Sun, 
  Droplets, 
  CheckCircle2, 
  ChevronRight,
  Flame,
  X,
  Send,
  Building2,
  Utensils,
  BrainCircuit,
  Compass,
  Crown,
  Dumbbell,
  Stethoscope,
  Smile
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { YARD_BAZARUTO_RESORT_IMAGE } from '../constants';
import { emailService } from '../services/emailService';

interface BazarutoResortSanctuaryProps {
  currentLang?: Language;
  onExploreEvents?: () => void;
}

interface FacilityHighlight {
  id: string;
  numberKey: string;
  titleEn: string;
  titleAr: string;
  titleEs: string;
  titleFr: string;
  badgeEn: string;
  badgeAr: string;
  badgeEs: string;
  badgeFr: string;
  descEn: string;
  descAr: string;
  descEs: string;
  descFr: string;
  statsEn: string;
  statsAr: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  featuresEn: string[];
  featuresAr: string[];
}

export const BazarutoResortSanctuary: React.FC<BazarutoResortSanctuaryProps> = ({ 
  currentLang = 'en',
  onExploreEvents 
}) => {
  const isAr = currentLang === 'ar';
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';

  const [activeTab, setActiveTab] = useState<'all' | 'hospital' | 'villas' | 'hotel' | 'pool' | 'gym' | 'dining'>('all');
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [selectedFacilityForModal, setSelectedFacilityForModal] = useState<FacilityHighlight | null>(null);

  // Registration Form States
  const [athleteName, setAthleteName] = useState('');
  const [athleteEmail, setAthleteEmail] = useState('');
  const [athleteDiscipline, setAthleteDiscipline] = useState('Combat Athlete / Striker 🥊');
  const [preferredWindow, setPreferredWindow] = useState('October 2027 (Grand Opening Inauguration)');
  const [healthAndInjuryNotes, setHealthAndInjuryNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  // The 6 Signature Facilities requested by user
  const facilities: FacilityHighlight[] = [
    {
      id: 'hospital',
      numberKey: '01',
      titleEn: 'Specialized Sports Hospital & Depression Recovery Center',
      titleAr: 'مستشفى متخصص في علاج الإصابات وفترات الاكتئاب والتأهيل النفسي والجسدي',
      titleEs: 'Hospital Especializado en Lesiones y Recuperación de Depresión',
      titleFr: 'Hôpital Spécialisé des Blessures et Dépression des Athlètes',
      badgeEn: 'SPORTS MEDICINE & MENTAL WELLNESS',
      badgeAr: 'طب رياضي متكامل وصحة نفسية',
      badgeEs: 'MEDICINA DEPORTIVA Y SALUD MENTAL',
      badgeFr: 'MÉDECINE DU SPORT ET BIEN-ÊTRE MENTAL',
      descEn: 'Comprehensive clinical institute dedicated to acute sports trauma, kinematic tendon repair, and a specialized division treating athlete depression, psychological burnout, and emotional fatigue, providing everything required to restore physical resilience and mental vitality.',
      descAr: 'مستشفى سريري متكامل مخصص للرياضيين لعلاج الإصابات الرياضية الحادة وإعادة تأهيل الأوتار والأربطة، مع قسم متخصص لعلاج فترات الاكتئاب والإجهاد النفسي والاحتراق الذهني التي يمر بها الأبطال، وتوفير كل ما يلزم لنهضتهم نفسياً وجسدياً.',
      descEs: 'Clínica avanzada para traumatismos deportivos, tendones y una unidad especializada en depresión atlética y agotamiento mental, devolviendo el bienestar integral.',
      descFr: 'Clinique de pointe dédiée aux traumatismes du sport, rééducation tendineuse et prise en charge de la dépression et du surmenage mental des athlètes.',
      statsEn: 'Clinical Hospital Suite // Full Mind & Body Restoration',
      statsAr: 'مستشفى سريري متكامل // علاج بدني ونفسي شامل',
      icon: Stethoscope,
      accentColor: '#00F0FF',
      featuresEn: [
        'Dedicated Department for Athlete Mental Health & Depression Rehabilitation',
        'Kinematic ACWR Ultrasound & Musculoskeletal Soft-Tissue Regeneration',
        'Hyperbaric Oxygen Chambers (2.0 ATA) & Whole-Body Cryotherapy (-110°C)',
        'Cognitive Neuro-feedback, Sleep Therapy & High-Altitude Breathing Labs',
        'Holistic Psychiatric & Physical Physiotherapy under World-Class Specialists'
      ],
      featuresAr: [
        'قسم سريري متخصص لعلاج فترات الاكتئاب والإرهاق النفسي والاحتراق العصبي للرياضيين',
        'فحص حركي شامل بالألتراساوند لمتابعة التئام العضلات، الأربطة والأوتار المتضررة',
        'غرف أكسجين عالي الضغط 2.0 ATA مع تبريد فائق للجسم بالكامل عند -110° مئوية',
        'مختبرات تنظيم النوم العميق NREM3 وتغذية الجهاز العصبي المركزي وتخفيف القلق',
        'فريق طبي متكامل من استشاريي الطب الرياضي والعلاج النفسي السريري'
      ]
    },
    {
      id: 'villas',
      numberKey: '02',
      titleEn: '10 Private Oceanfront Luxury Villas',
      titleAr: '10 فيلل شاطئية فاخرة مستقلة',
      titleEs: '10 Villas Privadas de Lujo Frente al Océano',
      titleFr: '10 Villas Privées de Luxe Face à l’Océan',
      badgeEn: 'EXCLUSIVE PRIVATE RESIDENCES',
      badgeAr: 'خصوصية ملكية مطلقة',
      badgeEs: 'RESIDENCIAS EXCLUSIVAS',
      badgeFr: 'RÉSIDENCES ULTRA EXCLUSIVES',
      descEn: 'Ten architectural sanctuaries built directly upon the untouched dunes, featuring private ocean plunge pools, dedicated circadian circadian lighting, zero-EMF sleep architecture, and direct white-sand beach access.',
      descAr: 'عشر فيلل مستقلة معمارية فاخرة مشيدة مباشرة فوق الكثبان الرملية العذراء، تضم كل فيلا مسبحاً خاصاً، وأجنحة نوم معزولة من الإشعاعات الكهرومغناطيسية لتعميق النوم، وإطلالة مباشرة على المياه الفيروزية.',
      descEs: 'Diez villas privadas construidas sobre dunas vírgenes con piscina privada y arquitectura de sueño sin ondas electromagnéticas.',
      descFr: 'Dix villas d’exception sur les dunes vierges avec piscines privées et architecture de sommeil sans ondes face aux lagons.',
      statsEn: '10 Standalone Beachfront Villas // Private Plunge Pools',
      statsAr: '10 فيلل مستقلة بالكامل // أحواض سباحة خاصة',
      icon: Palmtree,
      accentColor: '#10B981',
      featuresEn: [
        'Standalone Beachfront Villas with Private Infinity Plunge Pools',
        'Zero-EMF Shielded Master Suites for Deep NREM-3 Sleep Induction',
        'Dedicated Butler & Biomechanics Physiotherapy Attendant',
        'Direct Private Access to the White Dune Coastline of the Archipelago'
      ],
      featuresAr: [
        'فيلات مستقلة على شاطئ المحيط مع مسابح إنفينيتي خاصة لكل فيلا',
        'أجنحة نوم معزولة تماماً كهرومغناطيسياً لتعميق مراحل النوم الحيوية NREM3',
        'مساعد شخصي وأخصائي تأهيل حركي مخصص لكل فيلا على مدار الساعة',
        'مدخل خاص مباشر لكثبان وشواطئ الأرخبيل البحرية العذراء'
      ]
    },
    {
      id: 'hotel',
      numberKey: '03',
      titleEn: 'Boutique Hotel: 30 Athletic Rooms & 4 VIP Executive Suites',
      titleAr: 'فندق بوتيكي: 30 غرفة راقية و 4 أجنحة VIP للمشاهير والأبطال',
      titleEs: 'Hotel Boutique: 30 Habitaciones y 4 Suites VIP',
      titleFr: 'Hôtel Boutique : 30 Chambres & 4 Suites VIP Exécutives',
      badgeEn: '30 ROOMS + 4 VIP SUITES',
      badgeAr: '30 غرفة فندقية + 4 أجنحة VIP',
      badgeEs: '30 HABITACIONES + 4 SUITES VIP',
      badgeFr: '30 CHAMBRES + 4 SUITES VIP',
      descEn: 'A state-of-the-art boutique hotel engineered specifically for visiting athletes, featuring 30 high-spec ergonomic recovery rooms, plus 4 expansive VIP suites with private clinical therapy setups and panoramic ocean sunrise terraces.',
      descAr: 'فندق استثنائي صُمم خصيصاً للرياضيين وكبار الزوار، يضم 30 غرفة مجهزة بأحدث أدوات قياس العلامات الحيوية، إلى جانب 4 أجنحة VIP ملكية للأبطال العالميين مجهزة بوحدات استشفاء خاصة وشرفات بانورامية.',
      descEs: 'Hotel boutique de alto nivel con 30 habitaciones ergonómicas y 4 suites VIP con equipos de biorrecuperación integrados.',
      descFr: 'Hôtel boutique de prestige avec 30 chambres ergonomiques et 4 suites VIP avec équipements de soins intégrés.',
      statsEn: '30 High-Spec Rooms & 4 Luxury VIP Suites',
      statsAr: '30 غرفة فندقية فائقة التجهيز + 4 أجنحة VIP ملكية',
      icon: Building2,
      accentColor: '#FFE600',
      featuresEn: [
        '30 Bio-optimized Guest Rooms with Orthopedic Athletic Bedding',
        '4 Presidential VIP Suites with In-Room Cryo & Hydrotherapy Options',
        'Biometric Check-in & Real-Time ACWR Health Monitoring Integration',
        'Panoramic Rooftop Terraces Overlooking the Indian Ocean Lagoon'
      ],
      featuresAr: [
        '30 غرفة فندقية مجهزة بأسرة طبية رياضية وأنظمة تهوية هيبا المنقاة',
        '4 أجنحة VIP رئاسية تضم وحدات استشفاء مائي وكرايو داخل الجناح',
        'ربط ذكي لحظي لمؤشرات الأداء الحيوي والتعافي اليومي مع أجهزة الرياضي',
        'تراسات بانورامية علوية تطل على شروق الشمس والبحيرات الفيروزية'
      ]
    },
    {
      id: 'pool',
      numberKey: '04',
      titleEn: 'Adventure Watercourses Pool & Entertainment Sanctuary',
      titleAr: 'مسبح متطور بممرات وقنوات مائية مغامراتية ومناطق ترفيهية',
      titleEs: 'Piscina de Aventura con Corrientes de Agua y Zonas de Ocio',
      titleFr: 'Piscine à Parcours d’Aventure et Zones de Divertissement',
      badgeEn: 'AQUATIC ADVENTURE & LEISURE',
      badgeAr: 'مغامرات مائية وترفيه فاخر',
      badgeEs: 'AVENTURA ACUÁTICA Y OCIO',
      badgeFr: 'AVENTURE AQUATIQUE ET DÉTENTE',
      descEn: 'Expansive multi-tier swimming complex designed with thrilling adventure watercourses, natural hydro-resistance river trails, subterranean cavern lounges, and open-air athletic entertainment decks.',
      descAr: 'مجمع مائي استثنائي متعدد المستويات مزود بممرات وقنوات مائية تشبه المغامرة وتيارات سباحة عكسية، وكهوف مائية للاسترخاء، ومناطق ترفيهية شاطئية للاحتفال وتجديد النشاط.',
      descEs: 'Complejo de piscinas con canales de agua de aventura, corrientes contracorriente y áreas de entretenimiento al aire libre.',
      descFr: 'Complexe aquatique spectaculaire avec couloirs d’aventure aquatique, contre-courant et espaces de divertissement.',
      statsEn: 'Adventure River Trails // Hydrotherapy Currents',
      statsAr: 'ممرات مائية مغامراتية // تيارات مقاومة وعلاج مائي',
      icon: Waves,
      accentColor: '#00F0FF',
      featuresEn: [
        'Thrilling Adventure Watercourses & Resistance Training River Channels',
        'Subterranean Ocean-Salt Cavern Pools with Circadian Mood Lighting',
        'Sunken Lounge Cabanas & Open-Air Sunset Entertainment Pavilion',
        'Contrast Hot-Cold Plunge Cascades for Rapid Lymphatic Drainage'
      ],
      featuresAr: [
        'ممرات وقنوات مائية مغامراتية تحاكي الأنهار الطبيعية لتدريبات السباحة والمقاومة',
        'كهوف مياه بحرية دافئة مزودة بإضاءة عضوية لتهدئة الأعصاب وإزالة التوتر',
        'جلسات ترفيهية مظللة وأجنحة كابانا مائية ومسرح شاطئي مفتوح للفعاليات',
        'شلالات تباين حراري دافئ وبارد لتنشيط الدورة الدموية والتصريف اللمفاوي'
      ]
    },
    {
      id: 'gym',
      numberKey: '05',
      titleEn: 'Elite High-Performance & Combat Training Gym',
      titleAr: 'نادي رياضي مميز وتجهيزات قتالية عالمية',
      titleEs: 'Gimnasio de Alto Rendimiento y Combate',
      titleFr: 'Gym d’Élite et Dojo de Combat Océanique',
      badgeEn: 'WORLD-CLASS ATHLETIC FACILITY',
      badgeAr: 'نادي رياضي مميز بمعايير عالمية',
      badgeEs: 'INSTALACIONES DEPORTIVAS DE ÉLITE',
      badgeFr: 'CENTRE D’ENTRAÎNEMENT DE HAUT NIVEAU',
      descEn: 'World-class strength & conditioning institute featuring Olympic platforms, biomechanics kinematic labs, sand-dune anaerobic gauntlets, and an open-air oceanfront combat deck for boxing, Muay Thai, and grappling.',
      descAr: 'نادي رياضي عالمي مميز مجهز بأحدث منصات القوة الأولمبية، وأجهزة التحليل البيوميكانيكي، وحلبة نزال خشبية مفتوحة فوق مياه الشاطئ لتدريبات الملاكمة، الجودو، والمواي تاي، ومسارات تدريب على الكثبان الرملية.',
      descEs: 'Gimnasio de fuerza con plataforma de combate sobre la playa, análisis biomecánico y circuitos en dunas.',
      descFr: 'Centre de musculation d’élite avec ring océanique en plein air, analyse biomécanique et pistes de sable.',
      statsEn: 'Ocean Combat Deck // Biomechanical Motion Trackers',
      statsAr: 'حلبة نزالات شاطئية // أجهزة قياس حركة متقدمة',
      icon: Dumbbell,
      accentColor: '#E50914',
      featuresEn: [
        'Open-Air Oceanfront Combat Sparring Ring & Heavy Bag Gantry',
        'Olympic Lifting Stations with Smart Velocity-Based Training Sensors',
        'Pneumatic Resistance Power Cages & Dune Sprint Track',
        'Daily Masterclasses by Global MMA, Boxing & Strength Champions'
      ],
      featuresAr: [
        'حلبة قتال شاطئية مفتوحة ومظلات أكياس ملاكمة ثقيلة تطل مباشرة على المحيط',
        'محطات رفع أثقال أولمبية مزودة بحساسات قياس سرعة الحركة البارومترية (VBT)',
        'أجهزة مقاومة هوائية متطورة ومسار ركض رملي صاعد على كثبان الأرخبيل',
        'ورش تدريبية وتدريبات مشتركة مع أبطال عالميين في الفنون القتالية والقوة'
      ]
    },
    {
      id: 'dining',
      numberKey: '06',
      titleEn: '4 World-Class Gourmet Restaurants (To Be Announced)',
      titleAr: '4 مطاعم عالمية رفيعة المستوى (سيتم الإعلان عنها في حينها)',
      titleEs: '4 Restaurantes Gourmet Internacionales (Por Anunciar)',
      titleFr: '4 Restaurants Gastronomiques Mondiaux (Annoncés Prochainement)',
      badgeEn: '4 GOURMET DINING CONCEPTS',
      badgeAr: '4 مطاعم عالمية راقية',
      badgeEs: '4 CONCEPTOS GASTRONÓMICOS',
      badgeFr: '4 EXPÉRIENCES GASTRONOMIQUES',
      descEn: 'Four signature international fine-dining culinary destinations curated by globally celebrated chefs, dedicated to organic athletic gastronomy, ocean-to-table seafood, and circadian nutrition. Specific brand identities to be officially revealed closer to launch.',
      descAr: 'أربعة مطاعم عالمية استثنائية تحت إشراف نخبة من الطهاة العالميين تقدم تجارب طهي راقية تركز على التغذية الرياضية العضوية والمأكولات البحرية الطازجة القادمة مباشرة من المحيط، وسيتم الإعلان عن أسمائها وقوائمها رسمياً في حينها.',
      descEs: 'Cuatro restaurantes de clase mundial dirigidos por chefs de renombre, con gastronomía deportiva orgánica.',
      descFr: 'Quatre concepts gastronomiques raffinés par des chefs étoilés, alliant haute nutrition du sport et délices marins.',
      statsEn: '4 International Culinary Venues // Circadian Athletic Menus',
      statsAr: '4 مطاعم راقية // قوائم تغذية عضوية تزامنية',
      icon: Utensils,
      accentColor: '#FFE600',
      featuresEn: [
        'Four Bespoke Dining Venues: Seafood Coastal, Japanese Fusion, Farm Grill & Plant Bio-Bar',
        'Full Macro & Micronutrient Profile on Every Dish Designed for Athletic Recovery',
        '100% Organic Ocean-Caught Seafood & Locally Harvested Tropical Ingredients',
        'Exclusive Founding Pre-Opening Tastings for October 2027 VIP Pass Holders'
      ],
      featuresAr: [
        'أربعة وجهات طعام راقية: مأكولات بحرية، نكهات يابانية فيوجن، شواء عضوي، وبار تغذية حيوية',
        'تفصيل دقيق لجميع المغذيات الكبرى والدقيقة لكل طبق صُممت لتسريع تعافي العضلات',
        'مأكولات بحرية عضوية 100% ومكونات طازجة من مزارع الجزر الاستوائية المستدامة',
        'جلسات تذوق حصرية خاصة لرواد قائمة الانتظار الذهبية VIP قبل موعد الافتتاح الرسمي'
      ]
    }
  ];

  const filteredFacilities = activeTab === 'all' 
    ? facilities 
    : facilities.filter(f => f.id === activeTab);

  const handleOpenWaitlist = (facility?: FacilityHighlight) => {
    soundFX.playButtonClick();
    setSelectedFacilityForModal(facility || null);
    setIsWaitlistModalOpen(true);
    setBookingConfirmed(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteName.trim() || !athleteEmail.trim()) return;

    setFormSubmitting(true);
    soundFX.playButtonClick();

    const code = `VIP-BAZ-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmationNumber(code);

    try {
      // Dispatch email notification packet
      await emailService.sendVerificationCode(
        athleteEmail, 
        athleteName, 
        `BAZARUTO-${code}`
      );
    } catch {}

    soundFX.playPowerUp();
    setFormSubmitting(false);
    setBookingConfirmed(true);
  };

  return (
    <section id="bazaruto-sanctuary" className="relative w-full py-16 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080912] via-[#05060B] to-[#0A0B14] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#00F0FF]/15 via-[#10B981]/15 to-[#FFE600]/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className={`space-y-4 ${isAr ? 'text-right' : 'text-left'}`}>
          
          {/* Grand Opening Badge: Starting October 2027 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-[#00F0FF]/20 to-[#FFE600]/20 border border-emerald-400/50 text-emerald-300 text-xs font-black font-anime uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] ${isAr ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="w-3.5 h-3.5 text-[#FFE600] animate-spin" />
              <span>
                {isAr 
                  ? 'منتجع وملاذ يارد للاستشفاء الرياضي · يستقبل الزوار بدءاً من أكتوبر 2027' 
                  : isEs 
                  ? 'SANTUARIO YARD DE BIORRECUPERACIÓN · APERTURA EN OCTUBRE 2027' 
                  : isFr 
                  ? 'SANCTUAIRE YARD DE BIORÉCUPÉRATION · OUVERTURE EN OCTOBRE 2027' 
                  : 'YARD ATHLETIC BIO-RECOVERY RESORT & SANCTUARY · OPENING OCTOBER 2027'}
              </span>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 text-[#FFE600] text-[11px] font-mono font-black">
              🇲🇿 BAZARUTO ARCHIPELAGO // INDIAN OCEAN
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-black font-anime text-white tracking-tight leading-tight">
                {isAr ? (
                  <>
                    منتجع يارد الصحي في أرخبيل بازاروتو —{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FFE600] to-emerald-400">
                      ملاذ التعافي البدني والنفسي للأبطال
                    </span>
                  </>
                ) : (
                  <>
                    YARD Bio-Recovery Resort & Sanctuary —{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FFE600] to-emerald-400">
                      Pinnacle Mind & Body Elevation
                    </span>
                  </>
                )}
              </h2>

              <p className="text-xs md:text-sm text-gray-300 font-bold leading-relaxed">
                {isAr 
                  ? 'في واحدة من أجمل جزر المحيط الهندي العذراء في أرخبيل بازاروتو، يفتح منتجع يارد الصحي أبوابه رسمياً لاستقبال الزوار والرياضيين بدءاً من أكتوبر 2027. صُمم الملاذ كمنظومة متكاملة لا مثيل لها: 10 فيلل شاطئية فاخرة مستقلة، فندق بوتيكي يتضمن 30 غرفة و 4 أجنحة VIP للمشاهير، مسبح بممرات وقنوات مائية مغامراتية ومناطق ترفيه، نادي رياضي مميز وقتالي، 4 مطاعم عالمية رفيعة المستوى سيتم الإعلان عنها في حينها، ومستشفى سريري متخصص في علاج وتأهيل الإصابات الرياضية وفترات الاكتئاب والإرهاق النفسي ليعود المقاتل إلى قمة حضوره الذهني والبدني.'
                  : isEs
                  ? 'En el paradisíaco archipiélago de Bazaruto en el océano Índico, el resort YARD abrirá sus puertas a partir de octubre de 2027. Cuenta con 10 villas privadas frente a la playa, hotel boutique con 30 habitaciones y 4 suites VIP, piscina de aventura con canales de agua, gimnasio de élite, 4 restaurantes internacionales (por anunciar), y un hospital clínico especializado en rehabilitación de lesiones deportivas y depresión o agotamiento psicológico de los atletas.'
                  : isFr
                  ? 'Niché dans le cadre sublime de l’archipel de Bazaruto dans l’océan Indien, le sanctuaire YARD accueillera ses premiers visiteurs dès octobre 2027. Il réunit 10 villas privées en front de mer, un hôtel boutique de 30 chambres et 4 suites VIP, une piscine à parcours d’aventure aquatique, un gym d’élite, 4 restaurants gastronomiques internationaux (annoncés prochainement), ainsi qu’un hôpital spécialisé dans le traitement des blessures et des phases de dépression et surmenage des athlètes.'
                  : 'Nestled on the pristine white sand dunes of the Bazaruto Archipelago in the Indian Ocean, the YARD Bio-Recovery Sanctuary officially welcomes athletes and guests starting October 2027. The development features 10 private oceanfront villas, a boutique hotel with 30 rooms & 4 VIP executive suites, an adventure watercourses swimming pool with entertainment decks, a signature high-performance combat gym, 4 world-class gourmet restaurants (to be announced in due course), and a specialized sports hospital for acute injury rehabilitation and athlete mental depression & psychological burnout recovery.'}
              </p>
            </div>

            {/* Quick Metrics (Zero Prices, Only Facilities & Date) */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-[#0D0F1C] border border-emerald-500/30 text-center shadow-lg">
                <span className="text-base font-black font-mono text-emerald-400 block">OCT 2027</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? 'موعد الافتتاح' : 'Grand Opening'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0D0F1C] border border-cyan-500/30 text-center shadow-lg">
                <span className="text-base font-black font-mono text-[#00F0FF] block">10 Villas</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? '10 فيلل شاطئية' : 'Private Villas'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0D0F1C] border border-purple-500/30 text-center shadow-lg">
                <span className="text-base font-black font-mono text-purple-400 block">30 + 4 VIP</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? 'غرفة وجناح' : 'Hotel Rooms'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0D0F1C] border border-yellow-500/30 text-center shadow-lg">
                <span className="text-base font-black font-mono text-[#FFE600] block">Hospital</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? 'مستشفى الإصابات' : 'Depression Lab'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Resort Panoramic Banner with October 2027 Badge */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.2)] group">
          <div className="relative h-[360px] md:h-[500px] w-full">
            <img 
              src={YARD_BAZARUTO_RESORT_IMAGE} 
              alt="YARD Athletic Bio-Recovery Resort Bazaruto Archipelago" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Atmospheric Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06070B]/85 via-transparent to-[#06070B]/85 pointer-events-none" />

            {/* Top Info Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
              <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white font-mono font-bold flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bazaruto Archipelago, Indian Ocean</span>
              </span>

              <span className="px-4 py-1.5 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-400/60 text-emerald-300 font-anime font-black flex items-center gap-2 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{isAr ? 'يستقبل الزوار بدءاً من أكتوبر 2027' : 'OPENING OCTOBER 2027 // PRIORITY PASS'}</span>
              </span>
            </div>

            {/* Bottom Content on Hero Banner */}
            <div className={`absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-black font-mono tracking-widest text-[#FFE600] uppercase block">
                  {isAr ? 'الملاذ الرياضي الأكثر تقدماً في العالم' : 'THE WORLD’S PINNACLE ATHLETIC RECOVERY SANCTUARY'}
                </span>
                <h3 className="text-2xl md:text-4xl font-black font-anime text-white leading-tight">
                  {isAr 
                    ? '10 فيلل · فندق 30 غرفة و 4 أجنحة VIP · مسبح مغامرات · نادي قتالي · 4 مطاعم · مستشفى لعلاج الإصابات والاكتئاب' 
                    : '10 Ocean Villas · 30-Room Hotel & 4 VIP Suites · Adventure Pool · Hospital for Injuries & Depression'}
                </h3>
                <p className="text-xs text-gray-200 font-bold leading-relaxed line-clamp-2">
                  {isAr 
                    ? 'أول منتجع رياضي متكامل يجمع بين أرقى درجات الفخامة الشاطئية، وأحدث بروتوكولات الطب الرياضي السريري وإعادة التأهيل النفسي لتجاوز فترات الإحباط والاكتئاب الرياضي واستعادة كامل العنفوان.' 
                    : 'A world-first convergence of barefoot island luxury, clinical sports trauma rehabilitation, and dedicated psychological burnout restoration.'}
                </p>
              </div>

              <button
                onClick={() => handleOpenWaitlist()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-[#FFE600] to-emerald-500 hover:opacity-95 text-black font-black font-anime text-xs shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{isAr ? 'حجز بطاقة الأولوية VIP (أكتوبر 2027)' : 'Request Priority Founding Pass (Oct 2027)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Filter Tabs for the 6 Facilities */}
        <div className="space-y-4">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isAr ? 'text-right' : 'text-left'}`}>
            <div>
              <span className="text-[10px] font-black font-mono text-emerald-400 uppercase tracking-wider block">
                {isAr ? 'مرافق ومكونات منتجع يارد الصحي في بازاروتو' : 'SANCTUARY ARCHITECTURAL BLUEPRINT'}
              </span>
              <h3 className="text-xl md:text-2xl font-black font-anime text-white">
                {isAr ? 'استكشف المرافق الستة الرئيسية للمنتجع (افتتاح أكتوبر 2027)' : 'Explore the 6 Pinnacle Facilities (Opening October 2027)'}
              </h3>
            </div>
            
            <span className="text-xs font-mono text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              {isAr ? 'حجز بدون رسوم مسبقة · قائمة الانتظار الذهبية' : 'No Upfront Fees · Priority Waiting List'}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[
              { id: 'all', labelAr: 'كافة المرافق (6)', labelEn: 'All Facilities (6)' },
              { id: 'hospital', labelAr: '🏥 مستشفى الإصابات والاكتئاب', labelEn: '🏥 Sports Hospital & Mental Lab' },
              { id: 'villas', labelAr: '🏝️ 10 فيلل شاطئية', labelEn: '🏝️ 10 Ocean Villas' },
              { id: 'hotel', labelAr: '🏨 فندق 30 غرفة و 4 VIP', labelEn: '🏨 Hotel: 30 Rooms & 4 VIP Suites' },
              { id: 'pool', labelAr: '🌊 مسبح ممرات المغامرة والترفيه', labelEn: '🌊 Adventure Watercourses Pool' },
              { id: 'gym', labelAr: '🥊 نادي رياضي وقتالي مميز', labelEn: '🥊 Elite Athletic Gym' },
              { id: 'dining', labelAr: '🍽️ 4 مطاعم عالمية', labelEn: '🍽️ 4 Gourmet Restaurants' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundFX.playButtonClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-anime font-black text-xs transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-[#FFE600] text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-[#0E101D] text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700'
                }`}
              >
                {isAr ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Cards Grid for the Facilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredFacilities.map((fac) => {
              const IconComp = fac.icon;
              return (
                <div 
                  key={fac.id}
                  className="rounded-3xl p-6 bg-[#0B0D1A] border-2 border-gray-800 hover:border-emerald-400/60 transition-all flex flex-col justify-between space-y-6 group hover:scale-[1.01] shadow-xl relative overflow-hidden"
                >
                  {/* Subtle Accent Glow */}
                  <div 
                    className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: fac.accentColor }}
                  />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${fac.accentColor}18`, color: fac.accentColor }}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono font-black text-gray-500">
                          FACILITY #{fac.numberKey}
                        </span>
                      </div>

                      <span 
                        className="text-[9px] font-black font-mono tracking-wider px-2.5 py-1 rounded-full border uppercase"
                        style={{ 
                          backgroundColor: `${fac.accentColor}15`, 
                          borderColor: `${fac.accentColor}40`,
                          color: fac.accentColor 
                        }}
                      >
                        {isAr ? fac.badgeAr : isEs ? fac.badgeEs : isFr ? fac.badgeFr : fac.badgeEn}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg md:text-xl font-black font-anime text-white group-hover:text-emerald-300 transition-colors leading-tight">
                        {isAr ? fac.titleAr : isEs ? fac.titleEs : isFr ? fac.titleFr : fac.titleEn}
                      </h4>
                      <p className="text-xs text-gray-300 font-bold mt-2 leading-relaxed">
                        {isAr ? fac.descAr : isEs ? fac.descEs : isFr ? fac.descFr : fac.descEn}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 pt-3 border-t border-gray-800/80">
                      <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-wider block">
                        {isAr ? 'أهم التجهيزات والخصائص:' : 'KEY SPECIFICATIONS:'}
                      </span>
                      <ul className="space-y-1.5">
                        {(isAr ? fac.featuresAr : fac.featuresEn).map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-gray-300 font-bold leading-snug">
                            <span className="text-emerald-400 shrink-0 font-mono">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Action (NO PRICES!) */}
                  <div className="pt-4 border-t border-gray-800 flex items-center justify-between relative z-10">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-black block">
                        {isAr ? 'الافتتاح الرسمي:' : 'Grand Opening:'}
                      </span>
                      <span className="text-xs font-black font-anime text-white">
                        {isAr ? 'أكتوبر 2027' : 'October 2027'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenWaitlist(fac)}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-200 text-black font-black font-anime text-xs transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <span>{isAr ? 'طلب بطاقة VIP' : 'VIP Priority Pass'}</span>
                      <span>{isAr ? '←' : '→'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Spotlight Banner on Sports Hospital & Athlete Depression Clinic */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0C1024] via-[#0D1432] to-[#0A0D1E] border-2 border-cyan-500/40 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className={`relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>{isAr ? 'مستشفى يارد للطب الرياضي والعلاج النفسي السريري' : 'YARD SPORTS MEDICINE & MENTAL SANCTUARY'}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black font-anime text-white">
                {isAr 
                  ? 'بروتوكول متكامل لعلاج الإصابات الرياضية وتجاوز فترات الاكتئاب والاحتراق النفسي' 
                  : 'Integrated Protocol for Sports Injuries, Tendon Repair & Mental Depression Relief'}
              </h3>
              <p className="text-xs md:text-sm text-gray-300 font-bold leading-relaxed">
                {isAr 
                  ? 'يمر الرياضيون والأبطال بفترات عصيبة من الإحباط والاكتئاب والضغط العصبي جراء الإصابات أو فترات التوقف. يوفر مستشفانا المتخصص في أرخبيل بازاروتو أحدث تقنيات التشخيص الحركي، غرف الأكسجين عالي الضغط، مع رعاية نفسية وسريرية خاصة لإعادة شحن العزيمة والارتقاء بالمقاتل إلى أعلى مستويات القوة النفسية والجسدية.' 
                  : 'Athletes encounter profound mental exhaustion, injury trauma, and depressive valleys throughout their careers. Our specialized hospital delivers kinesthetic regenerative care, hyperbaric cellular oxygen, and compassionate psychiatric coaching to elevate athletes back to supreme emotional and physical dominance.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => handleOpenWaitlist(facilities[0])}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black font-anime text-xs shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                <span>{isAr ? 'التسجيل في القائمة السريرية VIP' : 'Register for Clinical Priority'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* October 2027 VIP Founding Priority Waiting List Modal (Zero Price, Instant Email Confirmation) */}
      {isWaitlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0D0F1E] border-2 border-emerald-500/50 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(16,185,129,0.3)] space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => {
                soundFX.playButtonClick();
                setIsWaitlistModalOpen(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-black uppercase">
                    <Sparkles className="w-3 h-3 text-[#FFE600]" />
                    <span>OCTOBER 2027 // VIP FOUNDING PASS</span>
                  </div>
                  <h3 className="text-2xl font-black font-anime text-white">
                    {isAr 
                      ? 'طلب بطاقة الأولوية وقائمة الانتظار التأسيسية — منتجع بازاروتو 2027' 
                      : 'VIP Priority Founding Pass Application — Bazaruto 2027'}
                  </h3>
                  <p className="text-xs text-gray-300 font-bold">
                    {isAr 
                      ? 'التسجيل مجاني بالكامل بدون أي دفع مسبق. ستحصل على ميثاق الأولوية لتأكيد حجزك مع بداية استقبال الزوار في أكتوبر 2027.' 
                      : 'Free priority registration with zero upfront cost. Receive your guaranteed VIP allocation for the October 2027 inaugural season.'}
                  </p>
                </div>

                {selectedFacilityForModal && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <selectedFacilityForModal.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                        {isAr ? 'المرفق المختار:' : 'Selected Facility Interest:'}
                      </span>
                      <span className="text-xs font-black font-anime text-white">
                        {isAr ? selectedFacilityForModal.titleAr : selectedFacilityForModal.titleEn}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      {isAr ? 'الاسم الكامل للرياضي / الضيف:' : 'Full Name of Athlete / Guest:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={athleteName}
                      onChange={(e) => setAthleteName(e.target.value)}
                      placeholder="e.g. Victor Stone"
                      className="w-full bg-[#14172B] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      {isAr ? 'البريد الإلكتروني لإرسال بطاقة VIP ورابط المتابعة:' : 'Email Address for VIP Packet & Direct Link:'}
                    </label>
                    <input
                      type="email"
                      required
                      value={athleteEmail}
                      onChange={(e) => setAthleteEmail(e.target.value)}
                      placeholder="athlete@example.com"
                      className="w-full bg-[#14172B] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        {isAr ? 'التخصص الرياضي:' : 'Athletic Discipline:'}
                      </label>
                      <select
                        value={athleteDiscipline}
                        onChange={(e) => setAthleteDiscipline(e.target.value)}
                        className="w-full bg-[#14172B] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="Combat Sports / MMA & Boxing">Combat Sports / MMA & Boxing 🥊</option>
                        <option value="Endurance & Hyrox Athlete">Endurance & Hyrox Athlete ⚡</option>
                        <option value="Football / Team Sport Pro">Football / Team Sport Pro ⚽</option>
                        <option value="Elite Fitness & Body Recovery">Elite Fitness & Body Recovery 🧘</option>
                        <option value="Executive / VIP Visitor">Executive / VIP Visitor 👑</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        {isAr ? 'الفترة الزمنية المفضلة (بدءاً من أكتوبر 2027):' : 'Preferred Window (Starting Oct 2027):'}
                      </label>
                      <select
                        value={preferredWindow}
                        onChange={(e) => setPreferredWindow(e.target.value)}
                        className="w-full bg-[#14172B] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="October 2027 (Grand Opening Inauguration)">October 2027 (Grand Opening Inauguration)</option>
                        <option value="November 2027 (Post-Season Bio-Reboot)">November 2027 (Post-Season Bio-Reboot)</option>
                        <option value="December 2027 (Archipelago Grand Prix)">December 2027 (Archipelago Grand Prix)</option>
                        <option value="Q1 2028 (Winter High-Altitude & Marine Camp)">Q1 2028 (Winter Marine Camp)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      {isAr ? 'ملاحظات الإصابات، أهداف التأهيل أو التعافي النفسي والبدني:' : 'Injury History / Mental Wellness Goals (Optional):'}
                    </label>
                    <textarea
                      rows={2}
                      value={healthAndInjuryNotes}
                      onChange={(e) => setHealthAndInjuryNotes(e.target.value)}
                      placeholder={isAr ? 'مثال: تمزق رباط صليبي، إجهاد نفسي واكتئاب ما بعد الموسم، رغبة في الإقامة بفيلا شاطئية...' : 'e.g. ACL rehabilitation, post-competition mental burnout relief, private villa preference...'}
                      className="w-full bg-[#14172B] border border-gray-800 focus:border-emerald-400 rounded-xl py-2 px-3 text-xs text-white outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWaitlistModalOpen(false)}
                    className="py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-black font-anime text-xs cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-[#FFE600] to-emerald-400 text-black font-black font-anime text-xs shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{formSubmitting ? (isAr ? 'جاري التسجيل...' : 'Dispatching...') : (isAr ? 'تأكيد التسجيل في قائمة الأولوية الذهبية (مجاناً)' : 'Confirm VIP Priority Pass (Free)')}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    VIP FOUNDING PASS GRANTED
                  </span>
                  <h3 className="text-2xl font-black font-anime text-white">
                    {isAr ? 'تم تأكيد تسجيلك في قائمة الشرف لمنتجع بازاروتو 2027!' : 'Your VIP Founding Pass is Confirmed!'}
                  </h3>
                  <p className="text-xs text-gray-300 font-bold max-w-md mx-auto leading-relaxed">
                    {isAr 
                      ? `شكراً لك يا ${athleteName}. تم إرسال ميثاق الأولوية التأسيسي ورقم عضويتك (${confirmationNumber}) إلى بريدك الإلكتروني (${athleteEmail}). سيستقبل منتجع يارد الصحي زواره رسمياً بدءاً من أكتوبر 2027، وسيتواصل معك المنسق السريري مبكراً لترتيب كافة التفاصيل.` 
                      : `Thank you, ${athleteName}. Your priority founding clearance #${confirmationNumber} has been dispatched to ${athleteEmail}. YARD Resort officially welcomes athletes starting October 2027.`}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-gray-800 text-left font-mono text-xs space-y-1.5 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sanctuary:</span>
                    <span className="text-white font-bold">Bazaruto Archipelago, 2027</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Opening Window:</span>
                    <span className="text-emerald-400 font-bold">{preferredWindow.split(' ')[0]} 2027</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Facilities:</span>
                    <span className="text-cyan-400 font-bold">10 Villas · 34 Rooms · Hospital</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">VIP Pass:</span>
                    <span className="text-[#FFE600] font-bold">{confirmationNumber}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsWaitlistModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-white text-black font-black font-anime text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {isAr ? 'إغلاق والعودة' : 'Close and Return'}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default BazarutoResortSanctuary;
