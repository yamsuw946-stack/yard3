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
  Dumbbell,
  Stethoscope,
  Compass,
  Crown
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
  const [preferredWindow, setPreferredWindow] = useState('October 2027 (Grand Opening)');
  const [healthAndInjuryNotes, setHealthAndInjuryNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  // The 6 Signature Facilities with Realistic, Elegant Architectural & Luxury Descriptions
  const facilities: FacilityHighlight[] = [
    {
      id: 'hospital',
      numberKey: '01',
      titleEn: 'Specialized Sports Hospital & Mental Wellness Pavilion',
      titleAr: 'مستشفى الطب الرياضي وجناح التأهيل النفسي والبدني',
      titleEs: 'Hospital de Medicina Deportiva y Pabellón de Bienestar Mental',
      titleFr: 'Hôpital de Médecine du Sport & Pavillon de Santé Mentale',
      badgeEn: 'SPORTS MEDICINE & REHABILITATION',
      badgeAr: 'طب رياضي وتأهيل متقدم',
      badgeEs: 'MEDICINA DEPORTIVA Y REHABILITACIÓN',
      badgeFr: 'MÉDECINE DU SPORT ET RÉÉDUCATION',
      descEn: 'A specialized clinical pavilion designed with serene biophilic architecture, offering advanced diagnostic suites for acute sports injuries and musculoskeletal rehabilitation, alongside a dedicated mental wellness division treating athletic burnout, stress, and depression under leading medical consultants to restore full mind and body harmony.',
      descAr: 'مركز سريري متكامل صُمم بهندسة معمارية هادئة تعزز الاستشفاء، يضم عيادات متطورة لتشخيص وعلاج الإصابات الرياضية وتأهيل العضلات والأوتار، بالإضافة إلى جناح استشاري مخصص للصحة النفسية لمعالجة حالات الإجهاد والاحتراق النفسي والاكتئاب التي يمر بها الرياضيون، تحت إشراف نخبة من الأطباء والاستشاريين لاستعادة كامل الحضور البدني والذهني.',
      descEs: 'Pabellón clínico especializado en diagnóstico y tratamiento de lesiones deportivas, tendones y un área dedicada al bienestar mental y recuperación de la fatiga psicológica de los atletas.',
      descFr: 'Pavillon médical de pointe dédié au traitement des traumatismes du sport, à la rééducation musculo-squelettique et à l’accompagnement du bien-être mental et du surmenage des sportifs.',
      statsEn: 'Advanced Orthopedic & Mental Restoration Suites',
      statsAr: 'أجنحة طب رياضي متقدمة وتأهيل نفسي متكامل',
      icon: Stethoscope,
      accentColor: '#00F0FF',
      featuresEn: [
        'Dedicated Department for Athlete Mental Health & Depression Recovery',
        'Advanced Musculoskeletal Diagnostic & Physical Rehabilitation Suites',
        'Modern Hydro-Rehabilitation & Restorative Hyperbaric Wellness Suites',
        'Multidisciplinary Team of Sports Medicine Specialists & Clinical Psychologists'
      ],
      featuresAr: [
        'قسم استشاري متخصص للصحة النفسية ومعالجة الاحتراق النفسي والاكتئاب للرياضيين',
        'عيادات تشخيص وتأهيل متطورة لعلاج إصابات المفاصل والأوتار والعضلات',
        'بروتوكولات علاج مائي وتبريد حديثة واستشفاء بالأكسجين الطبي',
        'فريق طبي متكامل من استشاريي جراحة العظام والطب الرياضي والعلاج النفسي'
      ]
    },
    {
      id: 'villas',
      numberKey: '02',
      titleEn: '10 Standalone Oceanfront Luxury Villas',
      titleAr: '10 فيلل شاطئية فاخرة مستقلة',
      titleEs: '10 Villas de Lujo Frente al Océano',
      titleFr: '10 Villas d’Exception en Front de Mer',
      badgeEn: 'EXCLUSIVE PRIVATE VILLAS',
      badgeAr: 'فيلات شاطئية خاصة',
      badgeEs: 'VILLAS PRIVADAS EXCLUSIVAS',
      badgeFr: 'VILLAS PRIVÉES EXCLUSIVES',
      descEn: 'Ten standalone architectural residences built in harmony with the coastal sand dunes, utilizing natural teak, stone, and floor-to-ceiling glass pavilions. Each villa features a private plunge pool, shaded outdoor living verandas, and discreet private pathways to the pristine white-sand shoreline.',
      descAr: 'عشر فيلل شاطئية مستقلة صُممت بعناية لتندمج مع التدرجات الطبيعية للكثبان الساحلية، تعتمد في بنائها على خشب الساج والأحجار المحلية والواجهات الزجاجية الممتدة من الأرض إلى السقف، وتضم كل فيلا حوض سباحة خاص (Plunge Pool)، ومساحات معيشة خارجية مظللة، ومدخلاً خاصاً إلى الشاطئ الرملي النقي.',
      descEs: 'Diez villas privadas en sintonía con las dunas costeras, con piscina privada, terrazas de madera noble y acceso directo a la playa.',
      descFr: 'Dix villas d’exception intégrées aux dunes côtières, dotées de piscines privées, varangues ombragées et accès exclusif à la plage.',
      statsEn: '10 Standalone Coastal Pavilions // Private Plunge Pools',
      statsAr: '10 فيلات ساحلية مستقلة // أحواض سباحة خاصة',
      icon: Palmtree,
      accentColor: '#10B981',
      featuresEn: [
        'Sustainable Open-Plan Architecture Offering Absolute Coastal Seclusion',
        'Private Plunge Pools and Shaded Outdoor Living Pavilions',
        'Acoustically Refined Master Suites Engineered for Restful Sleep',
        'Bespoke Private Butler & Personalized Hospitality Service'
      ],
      featuresAr: [
        'تصميم معماري مستدام مفتوح على المحيط يوفر أقصى درجات الخصوصية',
        'أحواض سباحة خاصة ومجالس شاطئية مظللة لكل فيلا',
        'غرف نوم فندقية صُممت بعزل صوتي وهندسي فائق لنوم هادئ وعميق',
        'خدمة كونسيرج وضيافة خاصة على مدار الساعة'
      ]
    },
    {
      id: 'hotel',
      numberKey: '03',
      titleEn: 'Boutique Hotel: 30 Deluxe Rooms & 4 VIP Suites',
      titleAr: 'فندق بوتيكي: 30 غرفة راقية و 4 أجنحة VIP',
      titleEs: 'Hotel Boutique: 30 Habitaciones Deluxe y 4 Suites VIP',
      titleFr: 'Hôtel Boutique : 30 Chambres Deluxe & 4 Suites VIP',
      badgeEn: 'BOUTIQUE LUXURY STAY',
      badgeAr: 'إقامة فندقية فاخرة',
      badgeEs: 'HOTEL BOUTIQUE DE LUJO',
      badgeFr: 'SÉJOUR BOUTIQUE RAFFINÉ',
      descEn: 'An intimate boutique hotel embracing warm minimalism and refined coastal elegance, offering 30 spacious deluxe rooms and 4 grand VIP suites with panoramic Indian Ocean views, private sunset verandas, bespoke artisan finishes, and intuitive 24/7 guest service.',
      descAr: 'مبنى فندقي بوتيكي أنيق يجمع بين الدفء العصري والفخامة الهادئة، يتضمن 30 غرفة ديلوكس فسيحة صُممت بمواد طبيعية مهدئة، إلى جانب 4 أجنحة VIP رحبة تتميز بإطلالات بانورامية خلابة على مياه المحيط الهندي وتراسات خاصة للاسترخاء مع خدمات ضيافة متكاملة على مدار الساعة.',
      descEs: 'Hotel boutique que combina calidez y sofisticación, con 30 amplias habitaciones y 4 suites VIP con vistas panorámicas al océano.',
      descFr: 'Hôtel boutique intimiste alliant élégance côtière et matériaux nobles, proposant 30 chambres spacieuses et 4 suites VIP face à l’océan.',
      statsEn: '30 Deluxe Ocean Rooms & 4 Panoramic VIP Suites',
      statsAr: '30 غرفة ديلوكس مطلة على المحيط + 4 أجنحة VIP بانورامية',
      icon: Building2,
      accentColor: '#FFE600',
      featuresEn: [
        '30 Spacious Rooms with Ergonomic Orthopedic Bedding & Soothing Natural Textures',
        '4 Grand VIP Suites with Panoramic Ocean Verandas & Private Lounge Salons',
        'Filtered Fresh Air Systems & Circadian Lighting for Natural Relaxation',
        '24/7 Dedicated Concierge & Personalized In-Room Services'
      ],
      featuresAr: [
        '30 غرفة فندقية رحبة مجهزة بأسرّة طبية وتصاميم داخلية مريحة ومهدئة',
        '4 أجنحة VIP واسعة بتراسات خاصة وإطلالات بانورامية مفتوحة على الأفق',
        'أنظمة تكييف منقاة وإضاءة طبيعية مصممة للتناغم مع الساعة البيولوجية',
        'خدمة غرف مميزة ومكتب استقبال وكونسيرج على مدار الساعة'
      ]
    },
    {
      id: 'pool',
      numberKey: '04',
      titleEn: 'Lagoon Pool with Adventure Waterways & Relaxation Decks',
      titleAr: 'مسبح بحيرة بممرات وقنوات مائية ومساحات استرخاء',
      titleEs: 'Piscina Laguna con Canales de Aventura y Terrazas de Descanso',
      titleFr: 'Piscine Lagon à Parcours Aquatique & Espaces de Détente',
      badgeEn: 'LAGOON POOL & LEISURE',
      badgeAr: 'مسبح بحيرة وترفيه راقٍ',
      badgeEs: 'PISCINA LAGUNA Y DESCANSO',
      badgeFr: 'PISCINE LAGON ET DÉTENTE',
      descEn: 'An organic lagoon pool architecture winding through coastal gardens, featuring gently flowing watercourses, dedicated lap and hydro-resistance swim channels, shaded poolside daybed cabanas, and sun terraces designed for peaceful leisure and restorative swimming.',
      descAr: 'تصميم مائي فريد مستوحى من طبيعة الأرخبيل، يضم مسبحاً فسيحاً على شكل بحيرة متدرجة بممرات وقنوات مائية انسيابية، وتيارات سباحة لطيفة لممارسة الرياضة المائية، ومناطق استجمام هادئة مع كبائن شاطئية خاصة ومساحات ترفيهية أنيقة مطلة على مياه البحر.',
      descEs: 'Arquitectura de piscina tipo laguna con canales de nado, corrientes de hidroresistencia y cabañas privadas.',
      descFr: 'Bassin lagon paysager serpentant entre les jardins côtiers, avec canaux de nage à contre-courant et cabanas privées.',
      statsEn: 'Meandering Waterways // Hydrotherapy Currents',
      statsAr: 'قنوات مائية انسيابية // تيارات سباحة وعلاج مائي',
      icon: Waves,
      accentColor: '#00F0FF',
      featuresEn: [
        'Meandering Interconnected Waterways & Hydro-Resistance Swim Currents',
        'Shaded Private Daybed Cabanas & Sunken Pool Lounges',
        'Temperature-Controlled Contrast Plunge Pools for Circulation & Recovery',
        'Serene Beachside Decks for Sunset Gatherings & Organic Refreshments'
      ],
      featuresAr: [
        'ممرات مائية انسيابية متصلة ومسارات سباحة مقاومة لطيفة',
        'كبائن شاطئية مظللة ومقاعد استرخاء مائية بين الصخور الطبيعية',
        'أحواض تباين دافئة وباردة لتنشيط الدورة الدموية والاسترخاء',
        'مساحات ترفيهية شاطئية هادئة لتناول المشروبات المنعشة والاستمتاع بالغروب'
      ]
    },
    {
      id: 'gym',
      numberKey: '05',
      titleEn: 'Elite Athletic Gym & Oceanfront Training Deck',
      titleAr: 'نادي رياضي مميز ومنصة تدريب شاطئية مفتوحة',
      titleEs: 'Gimnasio de Rendimiento y Plataforma Frente al Mar',
      titleFr: 'Centre de Fitness d’Élite & Terrasse d’Entraînement Maritime',
      badgeEn: 'ELITE FITNESS & MOVEMENT',
      badgeAr: 'لياقة وتدريب متطور',
      badgeEs: 'ENTRENAMIENTO DE ÉLITE',
      badgeFr: 'CONDITION PHYSIQUE D’ÉLITE',
      descEn: 'A light-filled state-of-the-art gym pavilion housing premium strength, conditioning, and functional movement equipment, complemented by a covered open-air beachfront deck for martial arts, boxing drills, yoga, and mobility facing the soothing ocean breeze.',
      descAr: 'صالة تدريب رياضية حديثة تجمع بين أحدث أجهزة اللياقة البدنية والتمارين الوظيفية، متصلة بمنصة تدريب شاطئية مفتوحة ومظللة تطل مباشرة على الشاطئ لتدريبات الفنون القتالية، والملاكمة، واليوغا، وتطوير المرونة وسط أجواء بحرية منعشة ومحفزة.',
      descEs: 'Gimnasio de entrenamiento funcional con plataforma al aire libre sobre la playa para deportes de combate y yoga.',
      descFr: 'Pavillon de fitness moderne et terrasse d’entraînement face au lagon pour la préparation physique, les arts martiaux et le yoga.',
      statsEn: 'Covered Ocean Deck // Premium Athletic Equipment',
      statsAr: 'منصة شاطئية مفتوحة // أجهزة لياقة وقوة متطورة',
      icon: Dumbbell,
      accentColor: '#E50914',
      featuresEn: [
        'Open-Air Beachfront Training Deck with Direct Indian Ocean Views',
        'State-of-the-Art Ergonomic Strength, Cardio & Biomechanical Equipment',
        'Dedicated Oceanfront Zones for Yoga, Breathwork & Mobility Stretching',
        'Private Coaching Sessions with Internationally Certified Fitness Coaches'
      ],
      featuresAr: [
        'منصة تدريب شاطئية مفتوحة في الهواء الطلق تطل على مياه المحيط الصافية',
        'أحدث أجهزة القوة البدنية واللياقة الوظيفية ومعدات التدريب المتطورة',
        'مساحات مخصصة لليوغا والاستطالة وحركات المرونة الحركية',
        'جلسات تدريب خاصة بإشراف مدربين محترفين ومعتمدين دولياً'
      ]
    },
    {
      id: 'dining',
      numberKey: '06',
      titleEn: '4 Signature Gourmet Restaurants (To Be Announced)',
      titleAr: '4 مطاعم عالمية راقية (سيتم الإعلان عنها في حينها)',
      titleEs: '4 Restaurantes Gourmet de Alta Cocina (Por Anunciar)',
      titleFr: '4 Tables Gastronomiques Internationales (Annoncées Prochainement)',
      badgeEn: 'FINE DINING & NUTRITION',
      badgeAr: 'تجارب طهي استثنائية',
      badgeEs: 'GASTRONOMÍA REFINADA',
      badgeFr: 'HAUTE GASTRONOMIE & NUTRITION',
      descEn: 'Four distinctive fine-dining concepts curated by celebrated culinary figures, celebrating ocean-fresh seafood, farm-to-table organic produce, and nourishing wellness gastronomy. Specific restaurant names and culinary themes will be unveiled ahead of the grand opening.',
      descAr: 'أربعة مطاعم عالمية ستقدم تجارب طهي راقية ومتنوعة بإشراف طهاة عالميين مرموقين؛ تركز على المأكولات البحرية الطازجة القادمة مباشرة من المحيط، والمكونات العضوية المنتقاة بعناية لدعم صحة وحيوية الجسم، وسيتم الكشف عن أسماء وهوية المطاعم رسمياً قبل الافتتاح.',
      descEs: 'Cuatro conceptos gastronómicos liderados por chefs reconocidos, centrados en mariscos frescos y cocina orgánica.',
      descFr: 'Quatre concepts de haute cuisine dirigés par des chefs de renom, mettant à l’honneur les trésors marins et une alimentation saine.',
      statsEn: '4 Signature Culinary Destinations // Organic Coastal Cuisine',
      statsAr: '4 وجهات طعام عالمية // مأكولات بحرية وعضوية طازجة',
      icon: Utensils,
      accentColor: '#FFE600',
      featuresEn: [
        'Four Distinct Concepts: Coastal Seafood, Healthy Grill, Plant-Based & Contemporary Cuisine',
        'Dishes Prepared with 100% Organic, Locally Sourced Coastal Ingredients',
        'Alfresco Beachfront Seating & Intimate Dining Terraces Over the Lagoon',
        'Curated Tasting Previews for October 2027 Priority Pass Guests'
      ],
      featuresAr: [
        'أربعة مفاهيم طهي عالمية تشمل المأكولات البحرية، والمشويات، والأطباق النباتية والصحية',
        'أطباق محضرة بمكونات عضوية طازجة تدمج بين المذاق الرفيع والقيمة الغذائية المتوازنة',
        'جلسات شاطئية وإطلالات ساحرة على مياه البحر لتجربة طعام لا تُنسى',
        'قوائم طعام وتجارب تذوق خاصة سيتم الإعلان عنها لضيوف قائمة الانتظار'
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-emerald-500/10 via-[#00F0FF]/10 to-[#FFE600]/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className={`space-y-4 ${isAr ? 'text-right' : 'text-left'}`}>
          
          {/* Grand Opening Badge: October 2027 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-[#00F0FF]/20 to-[#FFE600]/20 border border-emerald-400/50 text-emerald-300 text-xs font-black font-anime uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.25)] ${isAr ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="w-3.5 h-3.5 text-[#FFE600] animate-spin" />
              <span>
                {isAr 
                  ? 'منتجع وملاذ يارد الصحي · يستقبل الزوار بدءاً من أكتوبر 2027' 
                  : isEs 
                  ? 'SANTUARIO YARD DE BIORRECUPERACIÓN · APERTURA EN OCTUBRE 2027' 
                  : isFr 
                  ? 'SANCTUAIRE YARD DE BIORÉCUPÉRATION · OUVERTURE EN OCTOBRE 2027' 
                  : 'YARD RESORT & RECOVERY SANCTUARY · OPENING OCTOBER 2027'}
              </span>
            </div>

            <span className="px-3 py-1 rounded-full bg-black/60 border border-gray-700 text-gray-300 text-[11px] font-mono font-bold">
              🇲🇿 BAZARUTO ARCHIPELAGO // INDIAN OCEAN
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-black font-anime text-white tracking-tight leading-tight">
                {isAr ? (
                  <>
                    منتجع يارد الاستشفائي —{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FFE600] to-emerald-400">
                      تحفة معمارية ساحلية وتجربة فندقية استثنائية
                    </span>
                  </>
                ) : (
                  <>
                    YARD Sanctuary —{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FFE600] to-emerald-400">
                      Coastal Architectural Masterpiece & Restorative Retreat
                    </span>
                  </>
                )}
              </h2>

              <p className="text-xs md:text-sm text-gray-300 font-medium leading-relaxed">
                {isAr 
                  ? 'على امتداد الكثبان البيضاء البكر في أرخبيل بازاروتو المطل على مياه المحيط الهندي الصافية، يفتح منتجع يارد الصحي أبوابه رسمياً لاستقبال رواده بدءاً من أكتوبر 2027. يجسد المنتجع رؤية معمارية بيئية راقية تعتمد على الخطوط البسيطة والمواد الطبيعية المستدامة لتوفير واحة من الهدوء والاستجمام التام. يضم المنتجع 10 فيلل شاطئية مستقلة بمسابح خاصة، وفندقاً بوتيكياً راقياً يضم 30 غرفة و 4 أجنحة VIP رحبة، ومسبح بحيرة بممرات وقنوات مائية مغامراتية ومناطق ترفيهية، ونادياً رياضياً عصرياً متكاملاً، و 4 مطاعم عالمية رفيعة المستوى سيتم الإعلان عنها في حينها، إلى جانب مستشفى متخصص لعلاج الإصابات الرياضية وفترات الإجهاد والاحتراق النفسي والاكتئاب لتقديم تجربة استشفائية متوازنة ترتقي بالصحة والجسد والروح.'
                  : isEs
                  ? 'En el paradisíaco archipiélago de Bazaruto en el océano Índico, el resort YARD abrirá sus puertas a partir de octubre de 2027. Diseñado con una refinada arquitectura biofílica, cuenta con 10 villas privadas frente a la playa, hotel boutique con 30 habitaciones y 4 suites VIP, piscina laguna con canales de agua de aventura, gimnasio de élite, 4 restaurantes gastronómicos internacionales (por anunciar), y un hospital clínico especializado en rehabilitación de lesiones deportivas y recuperación de la fatiga mental y depresión de los atletas.'
                  : isFr
                  ? 'Sur les dunes immaculées de l’archipel de Bazaruto dans l’océan Indien, le sanctuaire YARD accueillera ses premiers visiteurs dès octobre 2027. Avec une architecture éco-conçue épurée, il réunit 10 villas privées en front de mer avec piscines privées, un hôtel boutique de 30 chambres et 4 suites VIP, une piscine lagon à canaux d’aventure, un gym d’élite, 4 tables gastronomiques internationales (annoncées prochainement), et un hôpital spécialisé dans la rééducation des blessures et le bien-être mental des athlètes.'
                  : 'Nestled amidst the untouched dunes of the Bazaruto Archipelago in the Indian Ocean, the YARD Sanctuary redefines luxury wellness through contemporary biophilic architecture and bespoke hospitality. Welcoming guests from October 2027, the development features 10 private oceanfront villas, an intimate boutique hotel with 30 rooms & 4 VIP suites, an adventure lagoon pool with flowing waterways, an elite athletic training gym, 4 signature fine-dining restaurants (to be announced), and a specialized sports hospital for acute injury rehabilitation and athletic depression & burnout recovery.'}
              </p>
            </div>

            {/* Quick Metrics: Opening Date & Scale (Zero Prices) */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-[#0D0F1C] border border-emerald-500/30 text-center shadow-lg">
                <span className="text-base font-black font-mono text-emerald-400 block" dir="ltr">OCT 2027</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? 'الافتتاح الرسمي' : 'Grand Opening'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0D0F1C] border border-cyan-500/30 text-center shadow-lg">
                <span className="text-base font-black font-mono text-[#00F0FF] block" dir="ltr">10 Villas</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? '10 فيلل مستقلة' : 'Private Villas'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0D0F1C] border border-purple-500/30 text-center shadow-lg">
                <span className="text-base font-black font-mono text-purple-400 block" dir="ltr">30 + 4 VIP</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? 'غرفة وجناح' : 'Hotel Rooms'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0D0F1C] border border-yellow-500/30 text-center shadow-lg">
                <span className="text-base font-black font-mono text-[#FFE600] block" dir="ltr">Hospital</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? 'مستشفى الإصابات' : 'Recovery Lab'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Resort Panoramic Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] group">
          <div className="relative h-[360px] md:h-[480px] w-full">
            <img 
              src={YARD_BAZARUTO_RESORT_IMAGE} 
              alt="YARD Athletic Bio-Recovery Resort Bazaruto Archipelago" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Ambient Lighting Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06070B]/85 via-transparent to-[#06070B]/85 pointer-events-none" />

            {/* Top Info Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
              <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white font-mono font-bold flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bazaruto Archipelago, Indian Ocean</span>
              </span>

              <span className="px-4 py-1.5 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-400/60 text-emerald-300 font-anime font-black flex items-center gap-2 shadow-lg">
                <span className="w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isAr ? 'يستقبل الزوار بدءاً من أكتوبر 2027' : 'OPENING OCTOBER 2027 // PRIORITY PASS'}</span>
              </span>
            </div>

            {/* Bottom Content on Hero Banner */}
            <div className={`absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-black font-mono tracking-widest text-[#FFE600] uppercase block">
                  {isAr ? 'عمارة ساحلية فاخرة وبيئة استشفائية متكاملة' : 'COASTAL LUXURY ARCHITECTURE & RECOVERY SANCTUARY'}
                </span>
                <h3 className="text-2xl md:text-3xl font-black font-anime text-white leading-tight">
                  {isAr 
                    ? '10 فيلل · فندق 30 غرفة و 4 أجنحة VIP · مسبح مغامرات · نادي رياضي · 4 مطاعم · مستشفى لعلاج الإصابات والاكتئاب' 
                    : '10 Private Villas · 30-Room Hotel & 4 VIP Suites · Adventure Pool · High-Performance Gym · Hospital'}
                </h3>
                <p className="text-xs text-gray-200 font-medium leading-relaxed line-clamp-2">
                  {isAr 
                    ? 'وجهة استثنائية تمزج بين الخصوصية الشاطئية المطلقة وأحدث بروتوكولات الطب الرياضي والرعاية النفسية لمساعدة الرياضيين على استعادة حيويتهم ونشاطهم بالكامل.' 
                    : 'A world-class convergence of barefoot coastal elegance, specialized sports injury rehabilitation, and dedicated mental burnout restoration.'}
                </p>
              </div>

              <button
                onClick={() => handleOpenWaitlist()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-[#FFE600] to-emerald-500 hover:opacity-95 text-black font-black font-anime text-xs shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
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
                {isAr ? 'المخطط المعماري ومرافق المنتجع' : 'RESORT ARCHITECTURAL BLUEPRINT'}
              </span>
              <h3 className="text-xl md:text-2xl font-black font-anime text-white">
                {isAr ? 'المرافق الستة الرئيسية لمنتجع يارد (أكتوبر 2027)' : 'The 6 Signature Sanctuary Facilities (Opening Oct 2027)'}
              </h3>
            </div>
            
            <span className="text-xs font-mono text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              {isAr ? 'تسجيل أولوية مجاني · قائمة الانتظار الذهبية' : 'No Upfront Fees · Priority Waiting List'}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[
              { id: 'all', labelAr: 'كافة المرافق (6)', labelEn: 'All Facilities (6)' },
              { id: 'hospital', labelAr: '🏥 مستشفى الإصابات والاكتئاب', labelEn: '🏥 Sports Hospital & Mental Lab' },
              { id: 'villas', labelAr: '🏝️ 10 فيلل شاطئية', labelEn: '🏝️ 10 Ocean Villas' },
              { id: 'hotel', labelAr: '🏨 فندق 30 غرفة و 4 VIP', labelEn: '🏨 Hotel: 30 Rooms & 4 VIP Suites' },
              { id: 'pool', labelAr: '🌊 مسبح ممرات المغامرة والترفيه', labelEn: '🌊 Adventure Lagoon Pool' },
              { id: 'gym', labelAr: '🥊 نادي رياضي ومنصة شاطئية', labelEn: '🥊 Athletic Gym & Ocean Deck' },
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
                  className="rounded-3xl p-6 bg-[#0B0D1A] border border-gray-800 hover:border-emerald-400/60 transition-all flex flex-col justify-between space-y-6 group hover:scale-[1.01] shadow-xl relative overflow-hidden"
                >
                  {/* Subtle Accent Glow */}
                  <div 
                    className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-15 pointer-events-none"
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
                        <span className="font-mono text-xs font-black text-gray-400">
                          FACILITY #{fac.numberKey}
                        </span>
                      </div>

                      <span 
                        className="text-[9px] font-black font-mono tracking-wider px-2 py-0.5 rounded-full border"
                        style={{ 
                          color: fac.accentColor, 
                          borderColor: `${fac.accentColor}40`,
                          backgroundColor: `${fac.accentColor}10`
                        }}
                      >
                        {isAr ? fac.badgeAr : fac.badgeEn}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black font-anime text-white group-hover:text-[#FFE600] transition-colors mb-2">
                        {isAr ? fac.titleAr : fac.titleEn}
                      </h4>
                      <p className="text-xs text-gray-300 font-medium leading-relaxed">
                        {isAr ? fac.descAr : fac.descEn}
                      </p>
                    </div>

                    {/* Architectural Feature Bullets */}
                    <div className="p-3.5 rounded-2xl bg-black/50 border border-gray-800/80 space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        {isAr ? 'أبرز المزايا المعمارية والخدمية:' : 'KEY ARCHITECTURAL HIGHLIGHTS:'}
                      </span>
                      <ul className="space-y-1.5">
                        {(isAr ? fac.featuresAr : fac.featuresEn).map((feat, i) => (
                          <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                            <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-800/70 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400">
                      {isAr ? fac.statsAr : fac.statsEn}
                    </span>
                    <button
                      onClick={() => handleOpenWaitlist(fac)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-400 hover:text-black text-white text-[11px] font-black font-anime transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>{isAr ? 'طلب أولوية' : 'Priority Pass'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Founding Philosophy & Quiet Luxury Statement */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C0E1B] via-[#080912] to-[#0C0E1B] border border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'فلسفة العمارة والضيافة الاستشفائية' : 'ARCHITECTURAL INTEGRITY & WELLNESS ETHOS'}</span>
            </div>
            <h4 className="text-xl md:text-2xl font-black font-anime text-white">
              {isAr ? 'عمارة هادئة وخصوصية مطلقة لراحة الجسد والذهن' : 'Quiet Luxury & Holistic Seclusion for Peak Restoration'}
            </h4>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              {isAr 
                ? 'صُمم كل تفصيل في منتجع بازاروتو ليمنح الضيوف والرياضيين تجربة استجمام راقية؛ بعيداً عن صخب الحياة اليومية وفي انسجام تام مع الطبيعة البكر للمحيط الهندي، مع توافر أعلى معايير الرعاية الصحية والنفسية المتخصصة.' 
                : 'Every space within the Bazaruto sanctuary is composed to deliver tranquility, discrete seclusion, and comprehensive physical & psychological restoration in balance with the wild marine environment.'}
            </p>
          </div>

          <button
            onClick={() => handleOpenWaitlist()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#FFE600] text-black font-black font-anime text-xs shadow-lg hover:opacity-95 transition-all cursor-pointer shrink-0"
          >
            {isAr ? 'الانضمام لقائمة الحجز المبكر (أكتوبر 2027)' : 'Join Priority Allocation List (Oct 2027)'}
          </button>
        </div>

      </div>

      {/* Priority Waitlist Modal */}
      {isWaitlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0E101D] border border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsWaitlistModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-black">
                    <Sparkles className="w-3 h-3" />
                    <span>OCTOBER 2027 // ZERO UPFRONT COST</span>
                  </div>
                  <h3 className="text-2xl font-black font-anime text-white">
                    {isAr 
                      ? 'طلب بطاقة الأولوية وقائمة الانتظار التأسيسية — منتجع بازاروتو 2027' 
                      : 'VIP Priority Founding Pass Application — Bazaruto 2027'}
                  </h3>
                  <p className="text-xs text-gray-300 font-medium">
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
                        {isAr ? 'التخصص الرياضي أو صفة الضيف:' : 'Athletic Discipline or Guest Profile:'}
                      </label>
                      <select
                        value={athleteDiscipline}
                        onChange={(e) => setAthleteDiscipline(e.target.value)}
                        className="w-full bg-[#14172B] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="Combat Sports / MMA & Boxing">Combat Sports / MMA & Boxing 🥊</option>
                        <option value="Endurance & Athletic Training">Endurance & Athletic Training ⚡</option>
                        <option value="Football / Team Sport Pro">Football / Professional Athlete ⚽</option>
                        <option value="Executive & Wellness Seeker">Executive & Wellness Seeker 🌿</option>
                        <option value="VIP Private Guest">VIP Private Guest 👑</option>
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
                        <option value="October 2027 (Grand Opening)">October 2027 (Grand Opening)</option>
                        <option value="November 2027 (Autumn Wellness Retreat)">November 2027 (Autumn Wellness Retreat)</option>
                        <option value="December 2027 (Holiday Sanctuary Season)">December 2027 (Holiday Sanctuary Season)</option>
                        <option value="Q1 2028 (Winter Coastal Camp)">Q1 2028 (Winter Coastal Camp)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      {isAr ? 'ملاحظات الإقامة، أهداف الاستشفاء البدني أو الدعم النفسي (اختياري):' : 'Stay Preferences or Recovery Goals (Optional):'}
                    </label>
                    <textarea
                      rows={2}
                      value={healthAndInjuryNotes}
                      onChange={(e) => setHealthAndInjuryNotes(e.target.value)}
                      placeholder={isAr ? 'مثال: رغبة في الإقامة بفيلا شاطئية مستقلة، تأهيل إصابة في الركبة، استجمام وتخفيف إجهاد ذهني...' : 'e.g. Private beachfront villa preference, joint rehabilitation, burnout recovery retreat...'}
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
                  <p className="text-xs text-gray-300 font-medium max-w-md mx-auto leading-relaxed">
                    {isAr 
                      ? `شكراً لك يا ${athleteName}. تم إرسال ميثاق الأولوية التأسيسي ورقم عضويتك (${confirmationNumber}) إلى بريدك الإلكتروني (${athleteEmail}). سيستقبل منتجع يارد الصحي زواره رسمياً بدءاً من أكتوبر 2027، وسيتواصل معك المنسق الخاص مبكراً لترتيب كافة التفاصيل.` 
                      : `Thank you, ${athleteName}. Your priority founding clearance #${confirmationNumber} has been dispatched to ${athleteEmail}. YARD Resort officially welcomes guests starting October 2027.`}
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
