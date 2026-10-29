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
        <svg viewBox="0 0 130 65" className="w-22 h-11" fill="none">
          {/* Authentic Adidas 3-Stripes Performance Mountain Logo */}
          <path d="M 22 36 L 33 36 L 22 22 L 11 22 Z" fill="#FFFFFF" />
          <path d="M 38 36 L 49 36 L 33 13 L 22 13 Z" fill="#FFFFFF" />
          <path d="M 54 36 L 65 36 L 44 4 L 33 4 Z" fill="#FFFFFF" />
          {/* Official adidas wordmark */}
          <text x="38" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.06em">adidas</text>
          <text x="38" y="59" textAnchor="middle" fill="#9CA3AF" fontSize="6.2" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.16em">COMBAT SPORTS</text>
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
        <svg viewBox="0 0 140 70" className="w-24 h-12" fill="none">
          {/* Radiant Yellow Sun */}
          <circle cx="70" cy="28" r="20" fill="#FFCC00" />
          {/* Left Charging Crimson Bull */}
          <g fill="#D20A11">
            <path d="M 12 36 C 14 30 20 28 26 25 C 28 21 34 18 42 19 C 48 20 54 24 60 26 C 65 27 68 31 70 33 C 66 35 62 33 58 32 C 54 35 50 41 46 44 C 42 46 36 45 32 46 C 28 47 24 53 22 55 L 20 55 L 23 46 C 20 47 16 45 13 42 C 10 39 10 37 12 36 Z" />
            <path d="M 14 32 C 12 25 18 20 22 17 L 23 18 C 19 21 15 25 16 31 Z" />
            <path d="M 54 36 L 58 48 L 54 48 L 50 38 Z" />
          </g>
          <path d="M 62 25 C 64 21 68 18 73 17 C 71 21 68 23 65 26 Z" fill="#FFCC00" />

          {/* Right Charging Crimson Bull */}
          <g fill="#D20A11">
            <path d="M 128 36 C 126 30 120 28 114 25 C 112 21 106 18 98 19 C 92 20 86 24 80 26 C 75 27 72 31 70 33 C 74 35 78 33 82 32 C 86 35 90 41 94 44 C 98 46 104 45 108 46 C 112 47 116 53 118 55 L 120 55 L 117 46 C 120 47 124 45 127 42 C 130 39 130 37 128 36 Z" />
            <path d="M 126 32 C 128 25 122 20 118 17 L 117 18 C 121 21 125 25 124 31 Z" />
            <path d="M 86 36 L 82 48 L 86 48 L 90 38 Z" />
          </g>
          <path d="M 78 25 C 76 21 72 18 67 17 C 69 21 72 23 75 26 Z" fill="#FFCC00" />

          {/* Official Red Bull Wordmark */}
          <text x="70" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontStyle="italic" fontFamily="sans-serif" letterSpacing="0.04em">Red Bull</text>
          <text x="70" y="65" textAnchor="middle" fill="#FFE600" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.16em">ATHLETE LAB</text>
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
        <svg viewBox="0 0 135 55" className="w-24 h-11" fill="none">
          {/* Authentic WHOOP Connected Sensor Glyph */}
          <g transform="translate(18, 25)">
            <circle cx="0" cy="0" r="14" stroke="#00F0FF" strokeWidth="2.5" strokeDasharray="14 3 6 3" strokeLinecap="round" />
            <circle cx="0" cy="0" r="4.5" fill="#00F0FF" />
            <path d="M -8 0 L 8 0 M 0 -8 L 0 8" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>
          {/* Authentic WHOOP Bold Wordmark */}
          <text x="78" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="'Rajdhani', -apple-system, sans-serif" letterSpacing="0.22em">WHOOP</text>
          <text x="78" y="44" textAnchor="middle" fill="#00F0FF" fontSize="7" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.24em">4.0 BIOMETRICS</text>
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
      id: 'ufc_mma',
      name: 'UFC · WORLD MMA',
      taglineEn: 'Official Championship Octagon & Sanctioned Combat Partner',
      taglineAr: 'شريك النزالات القتالية المعتمدة والبطولات العالمية في القفص المثمن',
      taglineEs: 'Socio oficial del octágono de campeonato y combate sancionado',
      taglineFr: 'Partenaire officiel de l’octogone de championnat et du combat homologué',
      categoryEn: 'World Championship MMA',
      categoryAr: 'بطولات الفنون القتالية المختلطة العالمية (MMA)',
      categoryEs: 'Campeonato Mundial de MMA',
      categoryFr: 'Championnat Mondial de MMA',
      badge: 'OFFICIAL WORLD MMA PARTNER',
      accentColor: '#D20A0A',
      glowColor: 'rgba(210, 10, 10, 0.45)',
      logoSvg: (
        <svg viewBox="0 0 130 55" className="w-24 h-11" fill="none">
          {/* Authentic UFC Slanted Bold Geometry */}
          <g transform="skewX(-10)">
            {/* Letter U */}
            <path d="M 16 8 L 27 8 L 27 26 C 27 31 30 33 35 33 C 40 33 43 31 43 26 L 43 8 L 54 8 L 54 26 C 54 38 46 43 35 43 C 24 43 16 38 16 26 Z" fill="#D20A0A" />
            {/* Letter F */}
            <path d="M 59 8 L 90 8 L 90 17 L 70 17 L 70 23 L 86 23 L 86 31 L 70 31 L 70 43 L 59 43 Z" fill="#D20A0A" />
            {/* Letter C */}
            <path d="M 120 16 L 110 22 C 108 17 105 16 101 16 C 95 16 91 20 91 25.5 C 91 31 95 35 101 35 C 105 35 108 33 111 29 L 121 34 C 116 41 110 43 101 43 C 89 43 80 35 80 25.5 C 80 16 89 8 101 8 C 110 8 116 11 120 16 Z" fill="#D20A0A" />
          </g>
          {/* Sub-label */}
          <text x="65" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.22em">OCTAGON SANCTIONED</text>
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
        <svg viewBox="0 0 130 75" className="w-24 h-14" fill="none">
          {/* Authentic Tiger Muay Thai Shield Crest */}
          <path d="M 65 3 L 105 15 L 105 48 C 105 65 65 74 65 74 C 65 74 25 65 25 48 L 25 15 Z" fill="#0C0E18" stroke="#FF6B00" strokeWidth="2.5" />
          <path d="M 65 7 L 100 18 L 100 46 C 100 60 65 68 65 68 C 65 68 30 60 30 46 L 30 18 Z" fill="#141724" stroke="#FFE600" strokeWidth="1" opacity="0.6" />
          
          {/* Fierce Tiger Head */}
          <polygon points="38,22 46,12 52,24" fill="#FF6B00" />
          <polygon points="92,22 84,12 78,24" fill="#FF6B00" />
          <polygon points="42,21 47,15 50,22" fill="#FFFFFF" />
          <polygon points="88,21 83,15 80,22" fill="#FFFFFF" />
          
          <path d="M 40 24 Q 65 18 90 24 Q 98 38 90 50 Q 65 60 40 50 Q 32 38 40 24 Z" fill="#FF6B00" />
          
          <path d="M 65 19 L 61 28 L 69 28 Z" fill="#000000" />
          <path d="M 46 25 L 54 29 L 48 33 Z" fill="#000000" />
          <path d="M 84 25 L 76 29 L 82 33 Z" fill="#000000" />
          <path d="M 37 36 L 47 38 L 40 42 Z" fill="#000000" />
          <path d="M 93 36 L 83 38 L 90 42 Z" fill="#000000" />
          
          <polygon points="48,34 56,36 54,40 46,38" fill="#FFE600" />
          <circle cx="51" cy="37" r="1.5" fill="#000000" />
          <polygon points="82,34 74,36 76,40 84,38" fill="#FFE600" />
          <circle cx="79" cy="37" r="1.5" fill="#000000" />
          
          <ellipse cx="65" cy="45" rx="7" ry="5" fill="#FFFFFF" />
          <polygon points="62,43 68,43 65,47" fill="#000000" />
          <polygon points="58,46 61,46 59,52" fill="#FFFFFF" />
          <polygon points="72,46 69,46 71,52" fill="#FFFFFF" />
          
          {/* Official Bottom Ribbon */}
          <rect x="18" y="58" width="94" height="13" rx="3" fill="#FF6B00" stroke="#FFE600" strokeWidth="1" />
          <text x="65" y="68" textAnchor="middle" fill="#000000" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.08em">TIGER MUAY THAI</text>
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
