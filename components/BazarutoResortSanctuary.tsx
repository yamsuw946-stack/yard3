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
  ExternalLink,
  ChevronRight,
  Flame,
  X,
  Send,
  UserCheck,
  Building2,
  Utensils,
  Stethoscope,
  Smile,
  Compass,
  BedDouble,
  Dumbbell
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { YARD_BAZARUTO_RESORT_IMAGE } from '../constants';

interface BazarutoResortSanctuaryProps {
  currentLang?: Language;
  onExploreEvents?: () => void;
}

interface ResortFacility {
  id: string;
  nameEn: string;
  nameAr: string;
  nameEs: string;
  nameFr: string;
  capacityEn: string;
  capacityAr: string;
  capacityEs: string;
  capacityFr: string;
  badgeEn: string;
  badgeAr: string;
  badgeEs: string;
  badgeFr: string;
  icon: React.ReactNode;
  accentColor: string;
  descEn: string;
  descAr: string;
  descEs: string;
  descFr: string;
  featuresEn: string[];
  featuresAr: string[];
  featuresEs: string[];
  featuresFr: string[];
}

export const BazarutoResortSanctuary: React.FC<BazarutoResortSanctuaryProps> = ({ 
  currentLang = 'en',
  onExploreEvents 
}) => {
  const isAr = currentLang === 'ar';
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';

  const [selectedFacility, setSelectedFacility] = useState<ResortFacility | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [athleteName, setAthleteName] = useState('');
  const [athleteEmail, setAthleteEmail] = useState('');
  const [interestTarget, setInterestTarget] = useState('Villas & Suites');
  const [healthMentalNotes, setHealthMentalNotes] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Official Facilities mandated by the Founder & Brief
  const facilities: ResortFacility[] = [
    {
      id: 'luxury-villas',
      nameEn: '10 Private Oceanfront Luxury Villas',
      nameAr: '10 فيلل شاطئية فاخرة ومستقلة',
      nameEs: '10 Villas de Lujo Frente al Océano',
      nameFr: '10 Villas de Luxe Privées en Bord de Mer',
      capacityEn: '10 Standalone Villas & Private Plunge Pools',
      capacityAr: '10 فيلل مستقلة مع أحواض سباحة خاصة',
      capacityEs: '10 Villas con piscinas privadas',
      capacityFr: '10 Villas avec piscines privées',
      badgeEn: 'EXCLUSIVE PRIVATE RESIDENCES',
      badgeAr: 'إقامات شاطئية حصرية وفائقة الخصوصية',
      badgeEs: 'RESIDENCIAS EXCLUSIVAS',
      badgeFr: 'RÉSIDENCES EXCLUSIVES',
      icon: <Palmtree className="w-5 h-5 text-emerald-400" />,
      accentColor: '#10B981',
      descEn: 'Architecturally sublime standalone villas nestled directly on the white sand dunes, offering uninterrupted panoramic views of turquoise Indian Ocean waters, zero-EMF sleep sanctuaries, and direct beach access.',
      descAr: 'فيلل معمارية استثنائية مستقلة تقع مباشرة على الكثبان الرملية البيضاء البكر، وتطل على المياه الفيروزية للمحيط الهندي، ومصممة بأجنحة نوم معزولة كهرومغناطيسياً لضمان أعمق درجات الاستشفاء.',
      descEs: 'Villas independientes situadas en las dunas de arena blanca con vistas al océano Índico y arquitectura de descanso sin CEM.',
      descFr: 'Villas indépendantes nichées sur les dunes de sable blanc avec vue sur l’océan Indien et sommeil protégé des ondes.',
      featuresEn: [
        'Private infinity plunge pools facing the archipelago sunset',
        'Circadian lighting and specialized recovery acoustics',
        'Dedicated butler and private performance nutrition services'
      ],
      featuresAr: [
        'أحواض سباحة إنفينيتي خاصة تطل مباشرة على مشهد غروب الشمس فوق الأرخبيل',
        'إضاءة بيولوجية يومية مدروسة وعزل صوتي كامل لتعزيز هرمون النمو',
        'خدمة ضيافة خاصة وطهاة مخصصون للتغذية الرياضية العضوية'
      ],
      featuresEs: [
        'Piscinas privadas infinitas frente al atardecer',
        'Iluminación circadiana y aislamiento acústico para el descanso',
        'Servicio de mayordomo y nutrición de rendimiento personalizada'
      ],
      featuresFr: [
        'Piscines privées à débordement face au coucher de soleil',
        'Éclairage circadien et insonorisation de pointe',
        'Service hôtelier dédié et nutrition sportive sur mesure'
      ]
    },
    {
      id: 'boutique-hotel',
      nameEn: 'Boutique Hotel: 30 Deluxe Rooms & 4 VIP Suites',
      nameAr: 'فندق بوتيك: 30 غرفة ديلوكس و 4 أجنحة VIP ملكية',
      nameEs: 'Hotel Boutique: 30 Habitaciones y 4 Suites VIP',
      nameFr: 'Hôtel Boutique : 30 Chambres Deluxe & 4 Suites VIP',
      capacityEn: '30 Deluxe Athlete Rooms • 4 VIP Sovereign Suites',
      capacityAr: '30 غرفة رياضية فاخرة • 4 أجنحة كبار الشخصيات VIP',
      capacityEs: '30 Habitaciones Deluxe • 4 Suites VIP',
      capacityFr: '30 Chambres Deluxe • 4 Suites VIP',
      badgeEn: 'PREMIUM HOSPITALITY',
      badgeAr: 'ضيافة فندقية عالمية راقية',
      badgeEs: 'HOSPEDAJE DE ÉLITE',
      badgeFr: 'HÔTELLERIE D’ÉLITE',
      icon: <BedDouble className="w-5 h-5 text-[#FFE600]" />,
      accentColor: '#FFE600',
      descEn: 'A sanctuary hotel specifically calibrated for world champions, combining minimalist organic teak architecture, high-altitude oxygen control in suites, and immediate proximity to the training lagoon.',
      descAr: 'فندق مخصص لأبطال العالم يجمع بين الخشب التيك العضوي الفاخر، والتحكم في نسبة الأكسجين داخل الغرف لمحاكاة المعسكرات المرتفعة، والقرب الفوري من حلبة النزال والممرات المائية.',
      descEs: 'Hotel calibrado para campeones mundiales con control de oxígeno en suites y proximidad a la laguna deportiva.',
      descFr: 'Hôtel conçu pour les champions avec contrôle d’oxygène en suite et accès direct à la lagune sportive.',
      featuresEn: [
        '4 Presidential VIP Suites with panoramic 360° reef terraces',
        '30 Deluxe ergonomic rooms with temperature-regulating mattresses',
        'Direct elevator access to the medical wing and training arenas'
      ],
      featuresAr: [
        '4 أجنحة VIP رئاسية مع شرفات بانورامية 360 درجة تطل على الحيد المرجاني',
        '30 غرفة ديلوكس مجهزة بمراتب ذكية منظمة للحرارة لتقليل التوتر العضلي',
        'وصول مباشر إلى الجناح الطبي المتخصص وحلبة النزالات الرياضية'
      ],
      featuresEs: [
        '4 Suites VIP con terrazas panorámicas al arrecife',
        '30 Habitaciones con colchones de regulación térmica',
        'Acceso directo al ala médica y a las zonas de combate'
      ],
      featuresFr: [
        '4 Suites VIP avec terrasses panoramiques sur le récif',
        '30 Chambres avec literie thermo-régulatrice',
        'Accès direct à l’aile médicale et aux zones d’entraînement'
      ]
    },
    {
      id: 'specialized-hospital',
      nameEn: 'Sports Injury & Mental Health Hospital',
      nameAr: 'مستشفى متخصص في علاج الإصابات الرياضية وفترات الاكتئاب',
      nameEs: 'Hospital Especializado en Lesiones y Salud Mental',
      nameFr: 'Hôpital Spécialisé Blessures Sportives et Santé Mentale',
      capacityEn: 'Clinical Sports Medicine & Psychological Restoration Wing',
      capacityAr: 'قسم الطب الرياضي السريري وإعادة التأهيل النفسي والجسدي',
      capacityEs: 'Ala de Medicina Deportiva y Restauración Psicológica',
      capacityFr: 'Pôle de Médecine du Sport et Restauration Psychologique',
      badgeEn: 'PHYSIO & PSYCHO RECOVERY',
      badgeAr: 'الشفاء الجسدي والنفسي المتكامل',
      badgeEs: 'RECUPERACIÓN INTEGRAL',
      badgeFr: 'RÉGÉNÉRATION COMPLÈTE',
      icon: <Stethoscope className="w-5 h-5 text-[#00F0FF]" />,
      accentColor: '#00F0FF',
      descEn: 'A world-leading hospital dedicated to accelerating the healing of sports injuries (ligament tears, tendonitis, concussion protocols) and treating athlete burnout and depression with complete psychological and physical restoration.',
      descAr: 'مستشفى عالمي متخصص في التشخيص والعلاج المتطور للإصابات الرياضية الحادة والمزمنة، وعلاج فترات الاكتئاب والإجهاد النفسي والاحتراق الرياضي التي يمر بها الأبطال، لتمكينهم من العودة بأفضل حالة نفسية وجسدية.',
      descEs: 'Centro hospitalario de vanguardia para lesiones deportivas y tratamiento de la depresión y el agotamiento en atletas.',
      descFr: 'Hôpital de pointe pour le traitement des blessures et la prise en charge de la dépression et du surmenage sportif.',
      featuresEn: [
        '2.0 ATA Multi-place Hyperbaric Oxygen & Targeted Cryo Suites',
        'Specialized Sports Psychiatry & Neuro-Cognitive Reset Clinic',
        'Ultrasound-guided tendon regeneration and kinematic joint therapy'
      ],
      featuresAr: [
        'غرف أكسجين عالي الضغط 2.0 ATA وغرف كرايو متقدمة عند -110° مئوية لإصلاح الخلايا',
        'عيادة متخصصة في الطب النفسي الرياضي وإعادة برمجة التوازن العصبي والانفعالي',
        'تجديد الأوتار والأنسجة بالألتراساوند الدقيق واستعادة كامل المدى الحركي للمفاصل'
      ],
      featuresEs: [
        'Cámaras hiperbáricas 2.0 ATA y crioterapia a -110°C',
        'Psiquiatría deportiva especializada y reinicio neurocognitivo',
        'Regeneración de tendones guiada por ecografía'
      ],
      featuresFr: [
        'Caissons hyperbares 2.0 ATA et cryothérapie à -110°C',
        'Psychiatrie du sport et rééquilibrage neuro-émotionnel',
        'Régénération tendineuse assistée par échographie'
      ]
    },
    {
      id: 'adventure-lagoon',
      nameEn: 'Adventure Lagoon & Waterways with Entertainment',
      nameAr: 'مسبح وممرات مائية مغامراتية ومناطق ترفيه استوائية',
      nameEs: 'Laguna de Aventura, Canales Acuáticos y Entretenimiento',
      nameFr: 'Lagune Aventure, Voies Aquatiques et Loisirs',
      capacityEn: 'Expansive Waterways, Adventure Drifts & Ocean Beach Clubs',
      capacityAr: 'ممرات مائية شاسعة وتدفق نهري ومناطق ترفيه شاطئية',
      capacityEs: 'Canales acuáticos de aventura y zonas de relax',
      capacityFr: 'Voies navigables d’aventure et espaces de détente',
      badgeEn: 'AQUATIC ADVENTURE',
      badgeAr: 'المغامرة والترفيه المائي الفريد',
      badgeEs: 'AVENTURA ACUÁTICA',
      badgeFr: 'AVENTURE AQUATIQUE',
      icon: <Waves className="w-5 h-5 text-[#00F0FF]" />,
      accentColor: '#00F0FF',
      descEn: 'A magnificent lagoon pool weaving through natural coastal dunes with adventurous lazy river currents, aquatic obstacle courses, sun decks, and vibrant athlete entertainment lounges.',
      descAr: 'مسبح ضخم بتصميم لاغون طبيعي يلتف حول الكثبان الساحلية بممرات مائية حركية تشبه المغامرة، وتيارات مائية للسباحة المقاومة، مع مناطق ترفيهية شاطئية للاسترخاء بين الحصص التدريبية.',
      descEs: 'Piscina tipo laguna con canales de corriente de aventura, zonas de recreo y áreas de relajación.',
      descFr: 'Piscine lagon spectaculaire avec canaux d’aventure, zones d’obstacles et espaces de détente.',
      featuresEn: [
        'Flowing adventure waterways connecting villas to the central reef lounge',
        'Aquatic resistance swim lanes for low-impact joint recovery',
        'Sunset entertainment pavilions with live acoustic music and chillout zones'
      ],
      featuresAr: [
        'ممرات مائية متدفقة تربط الفلل باللاغون المركزي وتوفر متعة المغامرة المائية',
        'مسارات سباحة بالمقاومة المائية لتعافي المفاصل دون أي ضغط وزني',
        'أجنحة ترفيه شاطئية لعروض الغروب ومناطق الاسترخاء الموسيقي الهادئ'
      ],
      featuresEs: [
        'Canales de corriente que conectan las villas con la laguna',
        'Pistas de natación con resistencia para recuperación articular',
        'Pabellones al atardecer con música acústica y zonas de descanso'
      ],
      featuresFr: [
        'Canaux d’eau reliant les villas au lagon central',
        'Lignes de nage à contre-courant pour rééducation articulaire',
        'Pavillons de coucher de soleil avec ambiance musicale relaxante'
      ]
    },
    {
      id: 'elite-gym',
      nameEn: 'Pinnacle Elite Athletic Gym & Combat Deck',
      nameAr: 'نادي رياضي مميز ومنصة النزالات الشاطئية',
      nameEs: 'Gimnasio Atlético de Élite y Plataforma de Combate',
      nameFr: 'Gym Athlétique d’Élite & Pont de Combat Océanique',
      capacityEn: 'State-of-the-Art Combat Gym & Open-Air Training Deck',
      capacityAr: 'نادي رياضي متكامل ومنصة قتال مفتوحة على البحر',
      capacityEs: 'Gimnasio de alto rendimiento y ring exterior',
      capacityFr: 'Salle de sport de pointe et ring en plein air',
      badgeEn: 'WORLD-CLASS TRAINING',
      badgeAr: 'أعلى معايير التدريب العالمي',
      badgeEs: 'ENTRENAMIENTO DE ÉLITE',
      badgeFr: 'ENTRAÎNEMENT DE POINTE',
      icon: <Dumbbell className="w-5 h-5 text-[#E50914]" />,
      accentColor: '#E50914',
      descEn: 'Equipped with bespoke kinematic force plates, heavy bag lines overlooking the crystal tides, Olympic lifting platforms, and an open-air arena for sanctioned international martial arts summits.',
      descAr: 'نادي رياضي رفيع المستوى مجهز بأحدث أجهزة قياس القوة الحركية، ومنصة أكياس ملاكمة مفتوحة على رذاذ المحيط، ومضمار هايروكس رملي، وحلبة فعاليات شاطئية للنزالات العالمية.',
      descEs: 'Equipamiento cinemático de fuerza, zona de sacos de boxeo frente al mar y ring para torneos internacionales.',
      descFr: 'Plateaux de force cinématiques, ligne de sacs de frappe face à l’océan et ring de compétition.',
      featuresEn: [
        'Kinematic AI motion capture for striking and sprinting form',
        'Open-air teak combat deck with ocean breeze cooling',
        'Hosting sanctioned world martial arts and Hyrox beach championships'
      ],
      featuresAr: [
        'كاميرات ذكاء اصطناعي لتحليل الكينماتيكا الحركية للكمات والركلات والسرعة',
        'منصة نزال خشبية مطلة على البحر تستفيد من هواء المحيط المنعش',
        'استضافة بطولات الفنون القتالية الدولية وسباقات هايروكس الشاطئية'
      ],
      featuresEs: [
        'Análisis cinemático por IA para golpeo y velocidad',
        'Plataforma de combate al aire libre con brisa marina',
        'Sede de torneos internacionales de artes marciales y Hyrox'
      ],
      featuresFr: [
        'Captation de mouvement IA pour technique de frappe et sprint',
        'Plateforme de combat en teck ouverte sur la brise marine',
        'Accueil de compétitions internationales d’arts martiaux et Hyrox'
      ]
    },
    {
      id: 'global-restaurants',
      nameEn: '4 World-Class Fine Dining Restaurants',
      nameAr: '4 مطاعم عالمية راقية (سيتم الإعلان عنها في حينها)',
      nameEs: '4 Restaurantes de Clase Mundial (Se anunciarán próximamente)',
      nameFr: '4 Restaurants Gastronomiques Mondiaux (Annonce prochaine)',
      capacityEn: '4 Curated International Culinary Concepts',
      capacityAr: '4 مفاهيم طهي عالمية متميزة',
      capacityEs: '4 Conceptos gastronómicos internacionales',
      capacityFr: '4 Concepts culinaires internationaux d’exception',
      badgeEn: 'ANNOUNCING SOON',
      badgeAr: 'سيتم الإعلان عنها في حينها',
      badgeEs: 'PRÓXIMO ANUNCIO',
      badgeFr: 'ANNONCE PROCHAINE',
      icon: <Utensils className="w-5 h-5 text-[#FFE600]" />,
      accentColor: '#FFE600',
      descEn: 'Four prestigious world-class restaurant concepts crafted by Michelin-starred culinary teams, fusing organic fresh seafood, circadian performance nutrition, and global fine dining. Full brand details to be revealed in due course.',
      descAr: 'أربعة مطاعم عالمية رفيعة المستوى يشرف عليها كبار الطهاة العالميين، تجمع بين المأكولات البحرية الطازجة العضوية، والتغذية الرياضية الدقيقة، والأطباق العالمية الفاخرة. سيتم الكشف عن أسماء المطاعم وشراكاتها في حينها.',
      descEs: 'Cuatro conceptos gastronómicos dirigidos por chefs de renombre mundial combinando nutrición atlética orgánica y alta cocina.',
      descFr: 'Quatre concepts gastronomiques d’élite alliant produits de la mer ultra-frais, nutrition sportive et haute cuisine.',
      featuresEn: [
        'Oceanfront fine dining with locally sourced line-caught seafood',
        'Personalized athlete metabolic nutrition menus for deep recovery',
        'Full restaurant names and celebrity chef partnerships to be revealed'
      ],
      featuresAr: [
        'إطلالات شاطئية ساحرة مع مأكولات بحرية طازجة يتم اصطيادها يومياً',
        'قوائم طعام مدروسة تمريضياً لتعزيز سرعة تجدد الخلايا ومكافحة الالتهابات',
        'الإعلان الرسمي عن أسماء المطاعم والشركاء العالميين سيعلن عنه في حينه'
      ],
      featuresEs: [
        'Alta cocina frente al océano con pesca sostenible local',
        'Menús personalizados para el metabolismo y la regeneración',
        'Nombres y chefs colaboradores se revelarán oportunamente'
      ],
      featuresFr: [
        'Haute cuisine en bord de mer avec poissons frais locaux',
        'Menus métaboliques personnalisés pour régénération cellulaire',
        'Les noms des établissements seront dévoilés prochainement'
      ]
    }
  ];

  const handleOpenFacility = (facility: ResortFacility) => {
    soundFX.playButtonClick();
    setSelectedFacility(facility);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteName || !athleteEmail) return;
    soundFX.playPowerUp();
    setInquirySubmitted(true);
  };

  return (
    <section className="relative w-full py-16 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080910] via-[#05060A] to-[#0A0B12] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-r from-[#00F0FF]/15 via-[#FFE600]/10 to-[#10B981]/15 blur-[140px] pointer-events-none" />

      <div className="relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className={`space-y-4 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black font-anime uppercase tracking-wider ${isAr ? 'flex-row-reverse' : ''}`}>
            <Palmtree className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isAr ? 'منتجع وملاذ يارد للاستشفاء الرياضي وعلاج الإصابات · أرخبيل بازاروتو' 
                : isEs ? 'SANTUARIO YARD DE BIORRECUPERACIÓN Y HOSPITAL DE LESIONES · ARCHIPIÉLAGO DE BAZARUTO' 
                : isFr ? 'SANCTUAIRE YARD DE BIORÉCUPÉRATION ET HÔPITAL DU SPORT · ARCHIPEL DE BAZARUTO' 
                : 'YARD ATHLETIC BIO-RECOVERY RESORT & INJURY HOSPITAL · BAZARUTO ARCHIPELAGO'}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-black font-anime text-white tracking-tight">
                {isAr ? (
                  <>
                    منتجع يارد الصحي ومستشفى الاستشفاء:{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FFE600] to-emerald-400">
                      يستقبل الزوار بدءاً من أكتوبر 2027
                    </span>
                  </>
                ) : (
                  <>
                    YARD Sanctuary & Sports Hospital:{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FFE600] to-emerald-400">
                      Welcoming Visitors Starting October 2027
                    </span>
                  </>
                )}
              </h2>

              <p className="text-xs md:text-sm text-gray-300 font-bold leading-relaxed">
                {isAr 
                  ? 'صُمم هذا الصرح في أرخبيل بازاروتو— إحدى أروع جزر المحيط الهندي بمياهه الفيروزية وكثبانه البيضاء العذراء. يضم المنتجع 10 فيلل شاطئية فاخرة، وفندقاً يحتوي على 30 غرفة و 4 أجنحة VIP ملكية، ومسبحاً بممرات مائية للمغامرة، ونادياً رياضياً مميزاً، و 4 مطاعم عالمية سيتم الإعلان عنها في حينها، إلى جانب مستشفى متخصص لعلاج الإصابات الرياضية وفترات الاكتئاب التي يمر بها الرياضيون للارتقاء بهم نفسياً وجسدياً.'
                  : isEs
                  ? 'Ubicado en el archipiélago de Bazaruto. Apertura en octubre de 2027 con 10 villas de lujo, hotel boutique de 30 habitaciones y 4 suites VIP, laguna con canales de aventura, gimnasio de élite, 4 restaurantes internacionales y hospital para lesiones y salud mental.'
                  : isFr
                  ? 'Niché dans l’archipel de Bazaruto. Ouverture en octobre 2027 avec 10 villas de luxe, hôtel de 30 chambres et 4 suites VIP, lagon d’aventure, salle de sport d’élite, 4 restaurants internationaux et hôpital dédié aux blessures et à la santé mentale.'
                  : 'Nestled on the white dunes of Bazaruto Archipelago. Welcoming athletes and visitors starting October 2027. Featuring 10 luxury villas, boutique hotel with 30 rooms & 4 VIP suites, adventure lagoon waterways, world-class gym, 4 fine-dining restaurants, and a specialized sports injury & depression recovery hospital.'}
              </p>
            </div>

            {/* Launch Window Badge */}
            <div className="p-4 rounded-2xl bg-[#0D0F1C] border border-emerald-500/40 text-center shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <span className="text-[10px] font-black font-mono text-emerald-400 uppercase tracking-wider block">
                {isAr ? 'موعد الافتتاح الرسمي' : 'OFFICIAL OPENING DATE'}
              </span>
              <span className="text-xl md:text-2xl font-black font-anime text-[#FFE600] block mt-0.5">
                {isAr ? 'أكتوبر 2027' : 'OCTOBER 2027'}
              </span>
              <span className="text-[10px] font-bold text-gray-400 block mt-0.5">
                {isAr ? 'قائمة التسجيل المبكر مفتوحة' : 'Priority Inquiries Open'}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Resort Panoramic Image with Key Badges */}
        <div className="relative rounded-3xl overflow-hidden border border-gray-800 shadow-[0_0_50px_rgba(0,240,255,0.15)] group">
          <div className="relative h-[340px] md:h-[480px] w-full">
            <img 
              src={YARD_BAZARUTO_RESORT_IMAGE} 
              alt="YARD Athletic Bio-Recovery Resort Bazaruto Archipelago" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Ambient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06070B]/80 via-transparent to-[#06070B]/80 pointer-events-none" />

            {/* Top Bar Location & Status */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bazaruto Archipelago, Indian Ocean</span>
              </span>

              <span className="px-3.5 py-1 rounded-full bg-emerald-500/25 backdrop-blur-md border border-emerald-400/50 text-emerald-300 font-anime font-black flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isAr ? 'الافتتاح: أكتوبر 2027' : 'LAUNCH: OCTOBER 2027'}</span>
              </span>
            </div>

            {/* Bottom Bar Info & Waitlist Button */}
            <div className={`absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="space-y-1.5 max-w-xl">
                <span className="text-[10px] font-black font-mono tracking-widest text-[#FFE600] uppercase block">
                  {isAr ? 'ملاذ متكامل للجسد والروح' : 'HOLISTIC BODY & MIND RECOVERY'}
                </span>
                <h3 className="text-2xl md:text-3xl font-black font-anime text-white">
                  {isAr ? '10 فيلل شاطئية • فندق فاخر • مستشفى تخصصي للإصابات والاكتئاب' : '10 Villas • Boutique Hotel • Injury & Mental Health Hospital'}
                </h3>
                <p className="text-xs text-gray-200 font-bold leading-relaxed line-clamp-2">
                  {isAr 
                    ? 'بيئة استوائية ساحرة مصممة خصيصاً للرياضيين؛ تجمع بين العلاج السريري للإصابات والأكسجين عالي الضغط والدعم النفسي الشامل لمواجهة الاكتئاب والضغوطات التنافسية.'
                    : 'A world-class sanctuary built to heal athletic injuries, eradicate mental depression and burnout, and elevate physical prowess.'}
                </p>
              </div>

              <button
                onClick={() => {
                  soundFX.playButtonClick();
                  setInquiryModalOpen(true);
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-[#FFE600] to-emerald-500 hover:opacity-95 text-black font-black font-anime text-xs shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{isAr ? 'التسجيل في قائمة الانتظار المبكرة (أكتوبر 2027)' : 'Join October 2027 Priority Waitlist'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6 Core Facilities Grid (Matching User Instructions Exactly - Zero Prices) */}
        <div className="space-y-4">
          <div className={`flex items-center justify-between ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div>
              <span className="text-[10px] font-black font-mono uppercase text-gray-400 tracking-wider">
                {isAr ? 'مرافق وأقسام منتجع يارد الصحي' : 'SANCTUARY RESORT & HOSPITAL FACILITIES'}
              </span>
              <h3 className="text-xl md:text-2xl font-black font-anime text-white">
                {isAr ? 'البنية التحتية والمرافق الاستشفائية والترفيهية المتكاملة' : 'Integrated Clinical, Residential & Entertainment Infrastructure'}
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold hidden sm:inline">
              BAZARUTO 2027 // ZERO COMPROMISE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                onClick={() => handleOpenFacility(fac)}
                className="rounded-2xl p-6 bg-[#0B0D18] border border-gray-800 hover:border-emerald-400/60 transition-all flex flex-col justify-between space-y-5 group hover:scale-[1.01] shadow-lg cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[9px] font-black font-mono tracking-wider px-2.5 py-0.5 rounded-full border"
                      style={{ 
                        color: fac.accentColor, 
                        borderColor: `${fac.accentColor}40`,
                        backgroundColor: `${fac.accentColor}10` 
                      }}
                    >
                      {isAr ? fac.badgeAr : isEs ? fac.badgeEs : isFr ? fac.badgeFr : fac.badgeEn}
                    </span>
                    <div className="p-2 rounded-xl bg-black/60 border border-gray-800">
                      {fac.icon}
                    </div>
                  </div>

                  {/* Title & Capacity */}
                  <div>
                    <h4 className="text-lg font-black font-anime text-white group-hover:text-emerald-300 transition-colors">
                      {isAr ? fac.nameAr : isEs ? fac.nameEs : isFr ? fac.nameFr : fac.nameEn}
                    </h4>
                    <span className="text-[11px] font-mono text-gray-400 font-bold block mt-1">
                      {isAr ? fac.capacityAr : isEs ? fac.capacityEs : isFr ? fac.capacityFr : fac.capacityEn}
                    </span>
                    <p className="text-xs text-gray-400 font-bold mt-2 leading-relaxed line-clamp-3">
                      {isAr ? fac.descAr : isEs ? fac.descEs : isFr ? fac.descFr : fac.descEn}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-3 border-t border-gray-800/80">
                    <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-wider block">
                      {isAr ? 'أبرز المزايا والمواصفات:' : 'FACILITY HIGHLIGHTS:'}
                    </span>
                    <ul className="space-y-1.5">
                      {(isAr ? fac.featuresAr : isEs ? fac.featuresEs : isFr ? fac.featuresFr : fac.featuresEn).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-300 font-bold leading-snug">
                          <span className="text-emerald-400 shrink-0 font-mono">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Trigger */}
                <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs font-black font-anime">
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    {isAr ? 'عرض التفاصيل الكاملة' : isEs ? 'Ver Detalles' : isFr ? 'Voir Détails' : 'View Facility Details'}
                  </span>
                  <span className="text-emerald-400 transform group-hover:translate-x-1 transition-transform">
                    {isAr ? '←' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Facility Detail Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0D0F1B] border border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                soundFX.playButtonClick();
                setSelectedFacility(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`space-y-2 ${isAr ? 'text-right' : 'text-left'}`}>
              <span 
                className="text-[10px] font-black font-mono px-3 py-1 rounded-full border inline-block"
                style={{
                  color: selectedFacility.accentColor,
                  borderColor: `${selectedFacility.accentColor}50`,
                  backgroundColor: `${selectedFacility.accentColor}10`
                }}
              >
                {isAr ? selectedFacility.badgeAr : selectedFacility.badgeEn}
              </span>
              <h3 className="text-2xl font-black font-anime text-white">
                {isAr ? selectedFacility.nameAr : selectedFacility.nameEn}
              </h3>
              <p className="text-xs text-gray-400 font-mono font-bold">
                {isAr ? selectedFacility.capacityAr : selectedFacility.capacityEn} &bull; Bazaruto Archipelago Sanctuary (October 2027)
              </p>
            </div>

            <div className={`p-4 rounded-2xl bg-black/60 border border-gray-800 space-y-2 ${isAr ? 'text-right' : 'text-left'}`}>
              <span className="text-[10px] font-mono font-black text-gray-400 uppercase">
                {isAr ? 'الوصف المعماري والطبي:' : 'CLINICAL & ARCHITECTURAL CHARTER:'}
              </span>
              <p className="text-xs md:text-sm text-gray-200 font-bold leading-relaxed">
                {isAr ? selectedFacility.descAr : selectedFacility.descEn}
              </p>
            </div>

            <div className={`space-y-2.5 ${isAr ? 'text-right' : 'text-left'}`}>
              <h4 className="text-xs font-black font-anime text-white">
                {isAr ? 'المواصفات والخدمات المتاحة:' : 'Facility Specifications:'}
              </h4>
              <ul className="space-y-2">
                {(isAr ? selectedFacility.featuresAr : selectedFacility.featuresEn).map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300 font-bold">
                    <span className="text-emerald-400 font-mono">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  soundFX.playButtonClick();
                  setSelectedFacility(null);
                  setInquiryModalOpen(true);
                }}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#FFE600] text-black font-black font-anime text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{isAr ? 'التسجيل في قائمة الزوار (أكتوبر 2027)' : 'Join October 2027 Priority List'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Priority Waitlist & Health Inquiry Modal (Zero Price) */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0D0F1B] border border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                soundFX.playButtonClick();
                setInquiryModalOpen(false);
                setInquirySubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!inquirySubmitted ? (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div className={`space-y-1 ${isAr ? 'text-right' : 'text-left'}`}>
                  <span className="text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    OPENING OCTOBER 2027 // REGISTRATION OPEN
                  </span>
                  <h3 className="text-2xl font-black font-anime text-white">
                    {isAr ? 'التسجيل في قائمة زوار منتجع يارد الصحي ومستشفى الإصابات' : 'Join October 2027 Sanctuary & Hospital Priority List'}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold">
                    {isAr ? 'أرخبيل بازاروتو، المحيط الهندي · استقبال الزوار بدءاً من أكتوبر 2027' : 'Bazaruto Archipelago, Indian Ocean · Welcoming Visitors from October 2027'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isAr ? 'اسم الرياضي / الزائر:' : 'Athlete / Visitor Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={athleteName}
                    onChange={(e) => setAthleteName(e.target.value)}
                    placeholder="e.g. Victor Vance"
                    className="w-full bg-[#141624] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isAr ? 'البريد الإلكتروني للإشعار والتأكيد:' : 'Email Address for Priority Notifications:'}
                  </label>
                  <input
                    type="email"
                    required
                    value={athleteEmail}
                    onChange={(e) => setAthleteEmail(e.target.value)}
                    placeholder="athlete@example.com"
                    className="w-full bg-[#141624] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isAr ? 'المرفق أو الخدمة المراد الاستفادة منها:' : 'Primary Facility of Interest:'}
                  </label>
                  <select
                    value={interestTarget}
                    onChange={(e) => setInterestTarget(e.target.value)}
                    className="w-full bg-[#141624] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Hospital & Injury Rehab">Hospital: Sports Injury Rehabilitation & Surgery (مستشفى الإصابات)</option>
                    <option value="Mental Health & Burnout">Hospital: Sports Depression & Burnout Reset (علاج الاكتئاب والإجهاد النفسي)</option>
                    <option value="Luxury Villas">10 Luxury Standalone Villas (فيلات شاطئية فاخرة)</option>
                    <option value="Boutique Hotel">Boutique Hotel & VIP Suites (فندق 30 غرفة و 4 أجنحة VIP)</option>
                    <option value="Gym & Combat Arena">Elite Gym & Ocean Combat Deck (النادي الرياضي وحلبة النزالات)</option>
                    <option value="Lagoon & Waterways">Adventure Lagoon & Waterways (المسبح والممرات المائية)</option>
                    <option value="All Facilities">Complete Holistic Athlete Retreat (البرنامج الشامل)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isAr ? 'ملاحظات الإصابات أو الحالة النفسية والبدنية (اختياري وسري بالكامل):' : 'Injury History, Mental Wellbeing or Goals (Strictly Confidential):'}
                  </label>
                  <textarea
                    rows={2}
                    value={healthMentalNotes}
                    onChange={(e) => setHealthMentalNotes(e.target.value)}
                    placeholder={isAr ? 'مثال: تمزق أربطة، إجهاد ذهني بعد البطولات، إعادة تأهيل المفاصل، استشفاء نفسي...' : 'e.g. ACL rehabilitation, post-tournament burnout, tendon therapy, mental decompression...'}
                    className="w-full bg-[#141624] border border-gray-800 focus:border-emerald-400 rounded-xl py-2 px-3 text-xs text-white outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-black font-anime text-xs cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#FFE600] text-black font-black font-anime text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'إرسال طلب التسجيل المبكر (أكتوبر 2027)' : 'Submit October 2027 Priority Registration'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    PRIORITY INTAKE CONFIRMED // OCT 2027
                  </span>
                  <h3 className="text-2xl font-black font-anime text-white">
                    {isAr ? 'تم تأكيد تسجيلك في قائمة أسبقية منتجع يارد الصحي ومستشفى الإصابات!' : 'October 2027 Priority Registration Confirmed!'}
                  </h3>
                  <p className="text-xs text-gray-300 font-bold max-w-md mx-auto leading-relaxed">
                    {isAr 
                      ? `شكراً لك يا ${athleteName}. تم حفظ طلبك وسجل اهتمامك (${interestTarget}). سيتم إرسال بطاقة الأسبقية الرسمية إلى بريدك الإلكتروني (${athleteEmail})، وسيتواصل معك الفريق الطبي واستشاريو الاستشفاء قبل موعد الافتتاح في أكتوبر 2027.`
                      : `Thank you, ${athleteName}. Your interest in ${interestTarget} has been recorded. Your official priority voucher has been sent to ${athleteEmail}. Our medical and hospitality directors will contact you in advance of the October 2027 opening.`}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-gray-800 text-left font-mono text-xs space-y-1.5 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Opening Window:</span>
                    <span className="text-emerald-400 font-bold">OCTOBER 2027</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white font-bold">Bazaruto Archipelago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Facility:</span>
                    <span className="text-[#FFE600] font-bold">{interestTarget}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFX.playButtonClick();
                    setInquiryModalOpen(false);
                    setInquirySubmitted(false);
                  }}
                  className="w-full py-3 rounded-xl bg-white text-black font-black font-anime text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {isAr ? 'العودة إلى الموقع الرئيسي' : 'Return to Arena'}
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
