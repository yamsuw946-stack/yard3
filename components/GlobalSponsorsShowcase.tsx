import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  Zap, 
  Activity, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';

interface GlobalSponsorsShowcaseProps {
  currentLang?: Language;
}

interface Partner {
  id: string;
  name: string;
  taglineEn: string;
  taglineAr: string;
  taglineEs: string;
  taglineFr: string;
  categoryEn: string;
  categoryAr: string;
  categoryEs: string;
  categoryFr: string;
  badge: string;
  accentColor: string;
  glowColor: string;
  logoSvg: React.ReactNode;
  mandateEn: string;
  mandateAr: string;
  mandateEs: string;
  mandateFr: string;
  perksEn: string[];
  perksAr: string[];
  perksEs: string[];
  perksFr: string[];
  metrics: { labelEn: string; labelAr: string; value: string }[];
}

export const GlobalSponsorsShowcase: React.FC<GlobalSponsorsShowcaseProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';

  const [activePartner, setActivePartner] = useState<Partner | null>(null);

  const partners: Partner[] = [
    {
      id: 'adidas',
      name: 'ADIDAS COMBAT SPORTS',
      taglineEn: 'Official High-Performance Kinetic Apparel & Fightwear',
      taglineAr: 'شريك الملابس القتالية والأزياء الرياضية الحركية المعتمد',
      taglineEs: 'Indumentaria de combate cinético de alto rendimiento oficial',
      taglineFr: 'Équipement de combat cinétique haute performance officiel',
      categoryEn: 'Technical Fightwear & Apparel',
      categoryAr: 'الملابس والمعدات القتالية التقنية',
      categoryEs: 'Ropa y Equipo Técnico de Combate',
      categoryFr: 'Tenue et Équipement de Combat Technique',
      badge: 'TIER 1 GLOBAL PARTNER',
      accentColor: '#FFFFFF',
      glowColor: 'rgba(255, 255, 255, 0.35)',
      logoSvg: (
        <svg viewBox="0 0 100 65" className="w-16 h-10 fill-current text-white">
          <polygon points="5,60 25,60 38,36 18,36" />
          <polygon points="35,60 55,60 70,22 50,22" />
          <polygon points="65,60 85,60 100,5 80,5" />
        </svg>
      ),
      mandateEn: 'Engineered in Herzogenaurach with custom nano-weave tensile compression, powering YARD 300 fighters across grueling Shaolin striking camps and multi-stage endurance gauntlets.',
      mandateAr: 'صُنعت خصيصاً بنسيج نانو ضاغط عالي المتانة لدعم أبطال YARD 300 في معسكرات النزال القاسية وسباقات التحمل متعددة المراحل.',
      mandateEs: 'Diseñado con compresión de nanotextil de alta resistencia para potenciar a los atletas de YARD 300.',
      mandateFr: 'Conçu avec une compression nano-tissée haute résistance pour équiper les combattants de YARD 300.',
      perksEn: [
        'Exclusive 25% discount on YARD 300 Pro Rashguards & Fight Shorts',
        'ISO-9001 Impact-tested combat hand wraps and shin guards',
        'Custom thermal dissipation fiber for hyper-intensity training'
      ],
      perksAr: [
        'خصم حصري 25% على شورتات وقمصان النزال الاحترافية لأعضاء YARD',
        'أربطة يد وواقيات قصبة معتمدة ومختبرة لامتصاص الصدمات القصوى',
        'ألياف عزل حراري متطورة للمحافظة على برودة العضلات أثناء النزال'
      ],
      perksEs: [
        '25% de descuento en ropa de combate YARD 300',
        'Vendas y espinilleras con absorción de impacto certificada',
        'Tejido con disipación térmica para máxima intensidad'
      ],
      perksFr: [
        '26% de réduction sur les tenues de combat officielles YARD 300',
        'Bandes et protège-tibias testés pour absorption des impacts',
        'Fibre thermo-régulatrice pour entraînements extrêmes'
      ],
      metrics: [
        { labelEn: 'Tensile Strength', labelAr: 'قوة الشد النسيجي', value: '450 N/cm²' },
        { labelEn: 'Thermal Cool Factor', labelAr: 'معامل التبريد الحركي', value: '-3.8 °C' },
        { labelEn: 'Roster Clearance', labelAr: 'تصريح الرياضيين', value: '100% Pro' }
      ]
    },
    {
      id: 'redbull',
      name: 'RED BULL ATHLETE LAB',
      taglineEn: 'High-Performance Energy, Cognitive Reflex & Endurance',
      taglineAr: 'شريك الطاقة الاستثنائية والتحمل وسرعة رد الفعل الذهني',
      taglineEs: 'Laboratorio de alto rendimiento, energía y reflejos cognitivos',
      taglineFr: 'Laboratoire haute performance, énergie et réflexes cognitifs',
      categoryEn: 'Cognitive & Physical Endurance',
      categoryAr: 'التحمل البدني واستجابة رد الفعل العصبي',
      categoryEs: 'Resistencia Física y Cognitiva',
      categoryFr: 'Endurance Physique et Cognitive',
      badge: 'OFFICIAL PERFORMANCE LAB',
      accentColor: '#FFE600',
      glowColor: 'rgba(255, 230, 0, 0.45)',
      logoSvg: (
        <svg viewBox="0 0 120 70" className="w-20 h-10">
          <circle cx="60" cy="35" r="24" fill="#FFE600" />
          {/* Left Bull Silhouette */}
          <path d="M12 44 Q 25 22 42 32 Q 52 38 58 35 Q 52 46 40 48 Q 28 50 12 44 Z" fill="#E50914" />
          <path d="M22 28 Q 15 18 10 22 Q 18 26 24 32 Z" fill="#E50914" />
          {/* Right Bull Silhouette */}
          <path d="M108 44 Q 95 22 78 32 Q 68 38 62 35 Q 68 46 80 48 Q 92 50 108 44 Z" fill="#E50914" />
          <path d="M98 28 Q 105 18 110 22 Q 102 26 96 32 Z" fill="#E50914" />
        </svg>
      ),
      mandateEn: 'Collaborating through the Red Bull Diagnostics & Training Center to test neural reaction latencies under severe lactic acidosis in live combat sparring.',
      mandateAr: 'شراكة مع مركز رد بول للتشخيص الرياضي لاختبار سرعة الاستجابة العصبية تحت إجهاد حامض اللاكتيك العالي في حلبة القتال المباشر.',
      mandateEs: 'Colaboración científica en reflejos neuronales bajo fatiga extrema.',
      mandateFr: 'Partenariat scientifique pour tester la vitesse réflexe sous acidose lactique.',
      perksEn: [
        'Cognitive reaction protocols integrated in YARD Arena Trials',
        'Official electrolyte & stamina formulation support',
        'Access to Red Bull High Performance bio-mechanic research'
      ],
      perksAr: [
        'بروتوكولات سرعة رد الفعل مدمجة في تحديات أرينا YARD 300',
        'دعم تركيبات الإلكترولايتس والتحمل أثناء تدريبات الشاولين',
        'الوصول لأبحاث بيوميكانيكا الحركة والتحمل القصوى'
      ],
      perksEs: [
        'Protocolos de reacción integrados en la Arena YARD',
        'Nutrición y electrolitos para entrenamientos de choque',
        'Acceso a investigación biomecánica de élite'
      ],
      perksFr: [
        'Protocoles de réflexes intégrés dans les défis de l’Arène',
        'Support en électrolytes et endurance pour séances intenses',
        'Accès aux études de recherche biomécanique Red Bull'
      ],
      metrics: [
        { labelEn: 'Reaction Latency', labelAr: 'زمن رد الفعل الحركي', value: '142 ms' },
        { labelEn: 'Lactate Threshold', labelAr: 'عتبة اللاكتات القصوى', value: '+18.4%' },
        { labelEn: 'VO2 Max Boost', labelAr: 'تحسن استهلاك الأكسجين', value: '+11.2%' }
      ]
    },
    {
      id: 'whoop',
      name: 'WHOOP 4.0 BIOMETRICS',
      taglineEn: 'Official Continuous Biometric Telemetry & Real-Time HRV Partner',
      taglineAr: 'شريك القياسات البيومترية وتتبع نبضات القلب والاستشفاء العصبي',
      taglineEs: 'Socio oficial de telemetría biométrica continua y VFC en tiempo real',
      taglineFr: 'Partenaire officiel de télémétrie biométrique et VRC en temps réel',
      categoryEn: 'Biometric Telemetry & Recovery',
      categoryAr: 'القياسات الحيوية والاستشفاء العصبي',
      categoryEs: 'Telemetría Biométrica y Recuperación',
      categoryFr: 'Télémétrie Biométrique et Récupération',
      badge: 'OFFICIAL WEARABLE SENSOR',
      accentColor: '#00F0FF',
      glowColor: 'rgba(0, 240, 255, 0.45)',
      logoSvg: (
        <svg viewBox="0 0 110 50" className="w-18 h-9 fill-none stroke-current text-[#00F0FF]" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          {/* WHOOP Signature Connected Waves */}
          <path d="M10 25 C 20 10, 25 40, 35 25 C 45 10, 50 40, 60 25 C 70 10, 75 40, 85 25 C 95 10, 100 35, 105 25" />
          <circle cx="60" cy="25" r="3" fill="#00F0FF" />
        </svg>
      ),
      mandateEn: 'Syncing live Heart Rate Variability (HRV), skin temperature, and sleep staging directly into the YARD 300 ACWR & Clinical Algorithm engine for real-time injury prevention.',
      mandateAr: 'مزامنة حية لتقلب معدل ضربات القلب (HRV)، وحرارة الجلد، ومراحل النوم العميق مع خوارزميات YARD 300 السريرية لمنع الإصابات قبل حدوثها.',
      mandateEs: 'Sincronización en vivo de VFC y arquitectura del sueño con el motor clínico de YARD.',
      mandateFr: 'Synchronisation en direct du VRC et de l’architecture du sommeil avec le moteur YARD.',
      perksEn: [
        'Direct Bluetooth live streaming to YARD Combat Arena telemetry',
        'Automated Stage-3 Deep Sleep and GH recovery calculation',
        'Predictive acute strain alerts before muscle tear threshold'
      ],
      perksAr: [
        'بث فوري مباشر عبر البلوتوث لبيانات النبض في حلبة نزالات YARD',
        'حساب تلقائي لساعات النوم العميق المرحلة الثالثة وإفراز هرمون النمو',
        'تنبيهات فورية عند وصول العضلة إلى حد الإجهاد المرتفع لمنع التمزق'
      ],
      perksEs: [
        'Transmisión en vivo de telemetría a la Arena de Combate',
        'Cálculo automático de sueño profundo y hormona de crecimiento',
        'Alertas de sobrecarga aguda antes de riesgo de lesión'
      ],
      perksFr: [
        'Diffusion en direct vers l’Arène de combat YARD',
        'Calcul du sommeil profond NREM3 et récupération hormonale',
        'Alertes prédictives contre les déchirures musculaires'
      ],
      metrics: [
        { labelEn: 'Sample Frequency', labelAr: 'معدل أخذ العينات', value: '100 Hz' },
        { labelEn: 'HRV Accuracy', labelAr: 'دقة تباين النبض', value: '99.4%' },
        { labelEn: 'API Sync Latency', labelAr: 'زمن مزامنة السحابة', value: '0.25 s' }
      ]
    },
    {
      id: 'immaf_mma',
      name: 'WORLD MMA FEDERATION',
      taglineEn: 'Sanctioned Combat Sports Testing & Title Arena Partner',
      taglineAr: 'شريك ترخيص النزالات القتالية واختبارات الأداء الدولية الرسمية',
      taglineEs: 'Pruebas de deportes de combate autorizadas y socio de arena de títulos',
      taglineFr: 'Homologation des sports de combat et partenaire d’arène de titre',
      categoryEn: 'Sanctioned Combat Sports',
      categoryAr: 'رياضات القتال المعتمدة والتصنيف الدولي',
      categoryEs: 'Deportes de Combate Sancionados',
      categoryFr: 'Sports de Combat Homologués',
      badge: 'OFFICIAL SANCTIONING BODY',
      accentColor: '#E50914',
      glowColor: 'rgba(229, 9, 20, 0.45)',
      logoSvg: (
        <svg viewBox="0 0 90 90" className="w-12 h-12">
          {/* Octagon Combat Cage Emblem */}
          <polygon points="27,5 63,5 85,27 85,63 63,85 27,85 5,63 5,27" fill="#141624" stroke="#E50914" strokeWidth="4" />
          <polygon points="30,14 60,14 76,30 76,60 60,76 30,76 14,60 14,30" fill="none" stroke="#FFE600" strokeWidth="2" strokeDasharray="4,2" />
          <text x="45" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">MMA</text>
          <text x="45" y="58" textAnchor="middle" fill="#E50914" fontSize="9" fontWeight="900" fontFamily="sans-serif">GLOBAL</text>
        </svg>
      ),
      mandateEn: 'Official sanctioning body ensuring YARD 300 combat tournaments adhere to international unified MMA safety codes, standardized judging, and professional division criteria.',
      mandateAr: 'الهيئة المشرفة الرسمية التي تضمن خضوع نزالات وبطولات YARD 300 لمعايير السلامة الدولية، والتحكيم المعتمد، وتصنيف الأوزان التنافسي.',
      mandateEs: 'Organismo regulador oficial que garantiza estándares de seguridad y arbitraje profesional.',
      mandateFr: 'Organisme régulateur assurant le respect des règles de sécurité et de l’arbitrage international.',
      perksEn: [
        'Sanctioned refereeing & scoring algorithms for YARD tournaments',
        'Official WADA-compliant anti-doping educational pathways',
        'Global rankings integration into YARD 300 Leaderboards'
      ],
      perksAr: [
        'خوارزميات تحكيم وتقييم النقاط المعتمدة في بطولات YARD الرسمية',
        'مسارات توعية معتمدة للسلامة ومكافحة المنشطات وفق كود WADA الدولي',
        'دمج التصنيف العالمي للأبطال في لوحات شرف YARD 300'
      ],
      perksEs: [
        'Arbitraje homologado y puntuación unificada en torneos',
        'Conformidad con directrices antidopaje WADA',
        'Puntos de ranking internacional para competidores de YARD'
      ],
      perksFr: [
        'Arbitrage homologué et notation officielle pour les tournois',
        'Conformité aux standards antidopage internationaux',
        'Intégration du classement mondial dans YARD 300'
      ],
      metrics: [
        { labelEn: 'Sanctioned Bouts', labelAr: 'النزالات المعتمدة', value: '1,450+' },
        { labelEn: 'Safety Compliance', labelAr: 'معيار السلامة المعتمد', value: '100% WADA' },
        { labelEn: 'Global Divisions', labelAr: 'الفئات والأوزان', value: '12 Classes' }
      ]
    },
    {
      id: 'tiger_muay_thai',
      name: 'TIGER MUAY THAI & MMA',
      taglineEn: 'World-Renowned Champion Forge & Elite Training Camp Partner',
      taglineAr: 'الأكاديمية الرياضية العالمية المعتمدة لمعسكرات النزال وصناعة الأبطال',
      taglineEs: 'Forja mundial de campeones y campamento de entrenamiento de élite',
      taglineFr: 'Forge mondiale de champions et camp d’entraînement d’élite',
      categoryEn: 'Premier Combat Sports Academy',
      categoryAr: 'أكاديمية الفنون القتالية والنخبة العالمية',
      categoryEs: 'Academia Premier de Deportes de Combate',
      categoryFr: 'Académie Premier de Sports de Combat',
      badge: 'OFFICIAL WORLD ACADEMY',
      accentColor: '#FF6B00',
      glowColor: 'rgba(255, 107, 0, 0.45)',
      logoSvg: (
        <svg viewBox="0 0 100 85" className="w-14 h-12">
          {/* Stylized Roaring Tiger Head Emblem */}
          <path d="M50 10 Q 75 5 85 28 Q 90 55 65 75 Q 50 82 35 75 Q 10 55 15 28 Q 25 5 50 10 Z" fill="#181410" stroke="#FF6B00" strokeWidth="3" />
          <path d="M35 32 Q 40 40 32 45 Q 26 40 35 32 Z" fill="#FFE600" />
          <path d="M65 32 Q 60 40 68 45 Q 74 40 65 32 Z" fill="#FFE600" />
          <path d="M50 48 L 44 58 L 56 58 Z" fill="#E50914" />
          <path d="M38 65 Q 50 72 62 65" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="22" y1="52" x2="10" y2="52" stroke="#FF6B00" strokeWidth="2" />
          <line x1="78" y1="52" x2="90" y2="52" stroke="#FF6B00" strokeWidth="2" />
        </svg>
      ),
      mandateEn: 'The world-famous Phuket academy where UFC, ONE Championship, and Bellator champions forge their striking, clinching, and high-altitude endurance. Partnered with YARD 300 to host exclusive fighter camp programs and cross-training certifications.',
      mandateAr: 'الأكاديمية الأشهر عالمياً في بوكيت حيث يصقل أبطال UFC و ONE Championship مهارات اللكم والركل والكلينش والتحمل الاستوائي. توفر شراكة رسمية مع YARD 300 لمعسكرات التدريب وشهادات المقاتلين المعتمدة.',
      mandateEs: 'El campamento de Muay Thai y MMA más prestigioso del mundo, socio oficial de YARD 300 en campamentos de combate.',
      mandateFr: 'L’académie de Muay Thai et MMA la plus prestigieuse au monde, partenaire officiel de YARD 300.',
      perksEn: [
        'Exclusive VIP booking priority for YARD 300 Shaolin & Muay Thai camps',
        'Masterclass curriculums taught by world champion head coaches',
        'Direct fighter draft invitations for YARD 300 Live Tournaments'
      ],
      perksAr: [
        'أولوية حجز VIP حصرية لأعضاء YARD في معسكرات المواي تاي والشاولين',
        'مناهج ماستركلاس تدريبية يشرف عليها كبار مدربي أبطال العالم',
        'دعوات مباشرة لاختيار وانتداب المقاتلين لبطولات YARD 300 المباشرة'
      ],
      perksEs: [
        'Acceso prioritario a campamentos intensivos en Tailandia',
        'Clases magistrales impartidas por entrenadores de campeones UFC',
        'Invitaciones directas a torneos oficiales YARD'
      ],
      perksFr: [
        'Accès VIP prioritaire aux camps intensifs en Thaïlande',
        'Masterclass dirigées par des entraîneurs de champions mondiaux',
        'Invitations directes aux tournois officiels YARD'
      ],
      metrics: [
        { labelEn: 'World Champions Trained', labelAr: 'أبطال عالم تخرجوا', value: '45+ UFC/ONE' },
        { labelEn: 'Camp Surface Area', labelAr: 'مساحة المعسكر التدريبي', value: '11,000 m²' },
        { labelEn: 'Accreditation', labelAr: 'الاعتماد الدولي', value: 'Global Elite' }
      ]
    }
  ];

  return (
    <section className="relative w-full py-12">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0C14]/80 to-transparent pointer-events-none" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-[#00F0FF]/10 via-[#FFE600]/10 to-[#E50914]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        
        {/* Header Bar */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800/80 pb-6 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black font-anime tracking-wider text-gray-300 ${isAr ? 'flex-row-reverse' : ''}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>
                {isAr ? 'الشركاء والرعاة العالميون الرسميون' 
                  : isEs ? 'SOCIOS Y PATROCINADORES GLOBALES OFICIALES' 
                  : isFr ? 'PARTENAIRES ET SPONSORS MONDIAUX OFFICIELS' 
                  : 'OFFICIAL GLOBAL SPONSORS & ELITE PARTNERS'}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-black font-anime tracking-tight text-white flex items-center gap-3">
              <span>
                {isAr ? 'تحالف الأداء القتالي العالمي' 
                  : isEs ? 'Alianza Global de Rendimiento de Combate' 
                  : isFr ? 'Alliance Mondiale de Performance de Combat' 
                  : 'GLOBAL COMBAT PERFORMANCE ALLIANCE'}
              </span>
              <span className="hidden sm:inline-block w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-pulse" />
            </h2>
            
            <p className="text-xs md:text-sm text-gray-400 font-bold max-w-2xl">
              {isAr 
                ? 'تعاون استراتيجي مع عمالقة الرياضة والتكنولوجيا الحيوية والأكاديميات الرياضية العالمية لتزويد مجتمع YARD 300 بأعلى معايير التجهيز والقياسات والتدريب الميداني.'
                : isEs
                ? 'Cooperación estratégica con líderes mundiales en equipamiento, telemetría y academias de combate para los atletas de YARD 300.'
                : isFr
                ? 'Coopération stratégique avec les leaders mondiaux de l’équipement, de la biométrie et des académies de combat pour YARD 300.'
                : 'Strategic integration with world-leading athletic apparel, continuous telemetry, sanctioning federations, and premier martial arts academies powering YARD 300.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black font-mono text-gray-400">
            <Activity className="w-4 h-4 text-[#00F0FF]" />
            <span className="text-white">5</span> {isAr ? 'شركاء معتمدون دولياً' : 'OFFICIAL TIER 1 PARTNERS'}
          </div>
        </div>

        {/* Sponsors Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {partners.map((partner) => {
            const isSelected = activePartner?.id === partner.id;

            return (
              <div
                key={partner.id}
                onClick={() => {
                  soundFX.playButtonClick();
                  setActivePartner(partner);
                }}
                className={`group relative rounded-2xl p-5 bg-[#0D0E18] border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:scale-[1.02] ${
                  isSelected 
                    ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.25)]' 
                    : 'border-gray-800/90 hover:border-gray-600'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 25px ${partner.glowColor}` : undefined
                }}
              >
                {/* Glow accent pill */}
                <div 
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none"
                  style={{ backgroundColor: partner.accentColor }}
                />

                <div className="space-y-4">
                  {/* Top Bar: Badge & Category */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[9px] font-black font-mono tracking-wider px-2 py-0.5 rounded-full border"
                      style={{ 
                        color: partner.accentColor, 
                        borderColor: `${partner.accentColor}40`,
                        backgroundColor: `${partner.accentColor}10` 
                      }}
                    >
                      {partner.badge}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                  </div>

                  {/* Official Brand Logo */}
                  <div className="h-14 flex items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-white/20 transition-all">
                    {partner.logoSvg}
                  </div>

                  {/* Brand Name & Category */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-black font-anime text-white group-hover:text-[#FFE600] transition-colors">
                      {partner.name}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 line-clamp-1">
                      {isAr ? partner.categoryAr : isEs ? partner.categoryEs : isFr ? partner.categoryFr : partner.categoryEn}
                    </p>
                  </div>

                  {/* Tagline / Sponsorship Type */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-gray-800/80">
                    <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">
                      {isAr ? 'نوع الرعاية والشراكة:' : isEs ? 'TIPO DE ASOCIACIÓN:' : isFr ? 'TYPE DE PARTENARIAT:' : 'SPONSORSHIP MANDATE:'}
                    </span>
                    <p className="text-[11px] font-bold text-gray-200 leading-snug">
                      {isAr ? partner.taglineAr : isEs ? partner.taglineEs : isFr ? partner.taglineFr : partner.taglineEn}
                    </p>
                  </div>
                </div>

                {/* Bottom Trigger */}
                <div className="mt-4 pt-3 border-t border-gray-800/70 flex items-center justify-between text-[11px] font-black font-anime">
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    {isAr ? 'تفاصيل الرعاية' : isEs ? 'Ver Detalles' : isFr ? 'Voir Détails' : 'View Protocol'}
                  </span>
                  <span className="text-white transform group-hover:translate-x-1 transition-transform">
                    {isAr ? '←' : '→'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Partner Ticker / Assurance Strip */}
        <div className="p-3.5 rounded-xl bg-[#090A12] border border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-mono font-black">
              {isAr ? 'حالة الشراكات الدولية:' : 'GLOBAL FEDERATION INTEGRATION:'}
            </span>
            <span className="text-emerald-400 font-mono">
              {isAr ? 'فعالة 100% في الحلبة والمعسكرات' : 'ACTIVE IN LIVE ARENA & CAMPS'}
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] text-gray-400">
            <span>✓ ADIDAS KINETIC GEAR</span>
            <span>✓ RED BULL ATHLETE LAB</span>
            <span>✓ WHOOP 4.0 TELEMETRY</span>
            <span>✓ IMMAF SANCTIONED</span>
            <span>✓ TIGER MUAY THAI FORGE</span>
          </div>
        </div>

      </div>

      {/* Modal / Detailed Partnership Drawer */}
      {activePartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div 
            className="relative w-full max-w-2xl bg-[#0E101A] border border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
            style={{ boxShadow: `0 0 50px ${activePartner.glowColor}` }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                soundFX.playButtonClick();
                setActivePartner(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <div className="p-3 rounded-2xl bg-black border border-gray-700 shrink-0">
                {activePartner.logoSvg}
              </div>
              <div>
                <span 
                  className="text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full border inline-block mb-1"
                  style={{
                    color: activePartner.accentColor,
                    borderColor: `${activePartner.accentColor}50`,
                    backgroundColor: `${activePartner.accentColor}10`
                  }}
                >
                  {activePartner.badge}
                </span>
                <h3 className="text-2xl font-black font-anime text-white">
                  {activePartner.name}
                </h3>
                <p className="text-xs text-gray-400 font-bold">
                  {isAr ? activePartner.categoryAr : isEs ? activePartner.categoryEs : isFr ? activePartner.categoryFr : activePartner.categoryEn}
                </p>
              </div>
            </div>

            {/* Mandate Description */}
            <div className={`p-4 rounded-2xl bg-[#141624] border border-gray-800 space-y-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
              <span className="text-[10px] font-black uppercase text-gray-400 block font-mono">
                {isAr ? 'ميثاق الرعاية والبروتوكول التقني:' : isEs ? 'MANDATO DE ASOCIACIÓN:' : isFr ? 'MANDAT DU PARTENARIAT:' : 'PARTNERSHIP MANDATE & TECHNICAL PROTOCOL:'}
              </span>
              <p className="text-xs md:text-sm text-gray-200 font-bold leading-relaxed">
                {isAr ? activePartner.mandateAr : isEs ? activePartner.mandateEs : isFr ? activePartner.mandateFr : activePartner.mandateEn}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3">
              {activePartner.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-black/60 border border-gray-800 text-center">
                  <span className="text-base md:text-lg font-black font-mono text-white block" style={{ color: activePartner.accentColor }}>
                    {m.value}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 block truncate">
                    {isAr ? m.labelAr : m.labelEn}
                  </span>
                </div>
              ))}
            </div>

            {/* Athlete Perks & Privileges */}
            <div className={`space-y-2.5 ${isAr ? 'text-right' : 'text-left'}`}>
              <h4 className="text-xs font-black font-anime text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {isAr ? 'امتيازات أبطال ومشتركي YARD 300:' : isEs ? 'Beneficios para Atletas YARD:' : isFr ? 'Avantages pour les Athlètes YARD:' : 'Exclusive YARD 300 Athlete Privileges:'}
                </span>
              </h4>
              <ul className="space-y-2">
                {(isAr ? activePartner.perksAr : isEs ? activePartner.perksEs : isFr ? activePartner.perksFr : activePartner.perksEn).map((perk, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300 font-bold">
                    <span className="text-emerald-400 font-mono text-sm leading-none shrink-0">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  soundFX.playButtonClick();
                  setActivePartner(null);
                }}
                className="w-full py-3 rounded-xl bg-white text-black font-black font-anime text-xs hover:bg-gray-200 transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                {isAr ? 'إغلاق بروتوكول الرعاية' : isEs ? 'Cerrar Protocolo' : isFr ? 'Fermer le Protocole' : 'CLOSE PROTOCOL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GlobalSponsorsShowcase;
