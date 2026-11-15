import React, { useState } from 'react';
import {
  ShieldCheck,
  Activity,
  CheckCircle2,
  ArrowUpRight,
  X
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';

interface GlobalSponsorsShowcaseProps {
  currentLang?: Language;
}

interface Partner {
  id: string;
  name: string;
  tagline: { en: string; es: string; fr: string; ar: string };
  category: { en: string; es: string; fr: string; ar: string };
  tierLabel: { en: string; es: string; fr: string; ar: string };
  accentColor: string;
  logoSvg: React.ReactNode;
  mandate: { en: string; es: string; fr: string; ar: string };
  perks: { en: string[]; es: string[]; fr: string[]; ar: string[] };
  metrics: { label: { en: string; es: string; fr: string; ar: string }; value: string }[];
}

export const GlobalSponsorsShowcase: React.FC<GlobalSponsorsShowcaseProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const lKey: 'en' | 'es' | 'fr' | 'ar' =
    currentLang === 'ar' || currentLang === 'es' || currentLang === 'fr' ? currentLang : 'en';

  const [activePartner, setActivePartner] = useState<Partner | null>(null);

  const partners: Partner[] = [
    {
      id: 'adidas',
      name: 'adidas Combat Sports',
      tagline: {
        en: 'Official Kinetic Apparel & Fightwear',
        es: 'Indumentaria Oficial de Combate',
        fr: 'Équipement Officiel de Combat',
        ar: 'شريك الملابس القتالية والأزياء الحركية'
      },
      category: {
        en: 'Technical Apparel',
        es: 'Ropa Técnica',
        fr: 'Tenue Technique',
        ar: 'الملابس التقنية'
      },
      tierLabel: {
        en: 'APPAREL PARTNER',
        es: 'SOCIO TEXTIL',
        fr: 'PARTENAIRE TEXTILE',
        ar: 'شريك الأزياء'
      },
      accentColor: '#F8FAFC',
      logoSvg: (
        <svg viewBox="0 0 180 72" className="h-11 w-auto" role="img" aria-label="adidas official logo">
          {/* Iconic 3-Bar Performance Mountain */}
          <g fill="#FFFFFF">
            <polygon points="58,34 71,34 62,21 49,21" />
            <polygon points="76,34 89,34 73,12 60,12" />
            <polygon points="94,34 107,34 84,3 71,3" />
          </g>
          {/* Authentic Geometric adidas Wordmark */}
          <text
            x="90"
            y="54"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="19"
            fontWeight="800"
            fontFamily="'Plus Jakarta Sans', 'Arial Black', sans-serif"
            letterSpacing="-0.03em"
          >
            adidas
          </text>
          <text
            x="90"
            y="66"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="6.5"
            fontWeight="700"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.22em"
          >
            COMBAT SPORTS
          </text>
        </svg>
      ),
      mandate: {
        en: 'Engineered with nano-weave tensile compression supporting YARD 300 athletes across high-output martial camps and wilderness endurance trials.',
        es: 'Diseñado con compresión de nanotextil de alta resistencia para apoyar a los atletas de YARD 300 en campamentos y pruebas de resistencia.',
        fr: 'Conçu avec une compression nano-tissée haute résistance équipant les athlètes YARD 300 lors des camps et épreuves d’endurance.',
        ar: 'صُنعت بنسيج نانو ضاغط عالي المتانة لدعم أبطال YARD 300 في معسكرات النزال وسباقات التحمل الشاقة.'
      },
      perks: {
        en: [
          '25% member privilege on YARD 300 Pro Rashguards & Fight Shorts',
          'Impact-certified hand wraps and compression shin guards',
          'Thermal-dissipation fiber for high-intensity conditioning'
        ],
        es: [
          '25% de beneficio exclusivo en ropa oficial de combate YARD 300',
          'Vendas y espinilleras con absorción de impacto certificada',
          'Fibra de disipación térmica para máxima intensidad'
        ],
        fr: [
          '25% d’avantage membre sur les tenues officielles YARD 300',
          'Bandages et protège-tibias certifiés absorption des chocs',
          'Fibre thermo-régulatrice haute intensité'
        ],
        ar: [
          'امتياز خصم 25% على أزياء النزال الاحترافية لأعضاء YARD',
          'أربطة يد وواقيات معتمدة لامتصاص الصدمات القصوى',
          'ألياف تبريد حركي متطورة أثناء الجولات العالية'
        ]
      },
      metrics: [
        {
          label: { en: 'Tensile Strength', es: 'Resistencia', fr: 'Résistance', ar: 'قوة الشد' },
          value: '450 N/cm²'
        },
        {
          label: { en: 'Cooling Delta', es: 'Enfriamiento', fr: 'Refroidissement', ar: 'معامل التبريد' },
          value: '-3.8 °C'
        },
        {
          label: { en: 'Clearance', es: 'Certificación', fr: 'Certification', ar: 'الاعتماد' },
          value: '100% Pro'
        }
      ]
    },
    {
      id: 'redbull',
      name: 'Red Bull Athlete Lab',
      tagline: {
        en: 'Cognitive Reflex & Peak Stamina Lab',
        es: 'Laboratorio de Reflejos y Resistencia',
        fr: 'Laboratoire Réflexe & Endurance',
        ar: 'شريك الطاقة والتحمل ورد الفعل العصبي'
      },
      category: {
        en: 'Performance Diagnostics',
        es: 'Diagnóstico Deportivo',
        fr: 'Diagnostic Performance',
        ar: 'التشخيص البدني'
      },
      tierLabel: {
        en: 'PERFORMANCE LAB',
        es: 'LAB RENDIMIENTO',
        fr: 'LABO PERFORMANCE',
        ar: 'مختبر الأداء'
      },
      accentColor: '#FACC15',
      logoSvg: (
        <svg viewBox="0 0 180 72" className="h-11 w-auto" role="img" aria-label="Red Bull official logo">
          {/* Sun Disc */}
          <circle cx="90" cy="23" r="15" fill="#FFCC00" />
          {/* Left Charging Bull */}
          <path
            d="M 41 29 C 44 23 50 22 55 19 C 59 15 65 14 71 16 C 77 18 82 21 88 24 C 84 26 80 25 76 24 C 72 27 68 32 63 34 C 58 35 53 34 48 35 C 44 36 41 38 39 40 L 42 32 C 39 32 39 30 41 29 Z"
            fill="#DC2626"
          />
          <path d="M 43 24 C 41 18 46 14 50 12 L 51 13 C 47 16 44 19 45 24 Z" fill="#DC2626" />
          {/* Right Charging Bull */}
          <path
            d="M 139 29 C 136 23 130 22 125 19 C 121 15 115 14 109 16 C 103 18 98 21 92 24 C 96 26 100 25 104 24 C 108 27 112 32 117 34 C 122 35 127 34 132 35 C 136 36 139 38 141 40 L 138 32 C 141 32 141 30 139 29 Z"
            fill="#DC2626"
          />
          <path d="M 137 24 C 139 18 134 14 130 12 L 129 13 C 133 16 136 19 135 24 Z" fill="#DC2626" />
          <text
            x="90"
            y="55"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="900"
            fontStyle="italic"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            Red Bull
          </text>
          <text
            x="90"
            y="66"
            textAnchor="middle"
            fill="#FACC15"
            fontSize="6.5"
            fontWeight="700"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.2em"
          >
            ATHLETE LAB
          </text>
        </svg>
      ),
      mandate: {
        en: 'Scientific diagnostics collaboration measuring neural reaction latencies and lactate clearance under severe metabolic stress.',
        es: 'Colaboración científica para medir latencia neuronal y tolerancia láctica bajo esfuerzo máximo.',
        fr: 'Partenariat scientifique évaluant les latences réflexes et le seuil lactique sous haute intensité.',
        ar: 'شراكة تشخيص رياضي لاختبار سرعة الاستجابة العصبية وعتبة اللاكتيك تحت أقصى حمل بدني.'
      },
      perks: {
        en: [
          'Cognitive reaction benchmarks integrated into YARD Arena',
          'High-altitude electrolyte & hydration dosing protocols',
          'Direct biomechanics research laboratory access'
        ],
        es: [
          'Pruebas de reacción cognitiva integradas en YARD Arena',
          'Protocolos avanzados de electrolitos e hidratación',
          'Acceso a estudios de biomecánica de élite'
        ],
        fr: [
          'Tests de réflexes cognitifs intégrés à l’Arène YARD',
          'Protocoles d’hydratation et d’électrolytes haute altitude',
          'Accès aux recherches biomécaniques de pointe'
        ],
        ar: [
          'بروتوكولات سرعة رد الفعل المدمجة في حلبة YARD',
          'أنظمة ترطيب وإلكترولايتس مدروسة لسباقات التحمل',
          'الوصول لأبحاث ومختبرات الميكانيكا الحيوية'
        ]
      },
      metrics: [
        {
          label: { en: 'Reaction Time', es: 'Tiempo Reacción', fr: 'Temps Réflexe', ar: 'زمن الاستجابة' },
          value: '142 ms'
        },
        {
          label: { en: 'Lactate Gain', es: 'Umbral Láctico', fr: 'Seuil Lactique', ar: 'عتبة اللاكتيك' },
          value: '+18.4%'
        },
        {
          label: { en: 'VO2 Max Delta', es: 'Mejora VO2 Max', fr: 'Gain VO2 Max', ar: 'تحسن VO2' },
          value: '+11.2%'
        }
      ]
    },
    {
      id: 'whoop',
      name: 'WHOOP 4.0 Biometrics',
      tagline: {
        en: 'Continuous HRV & Sleep Telemetry',
        es: 'Telemetría Continua de VFC y Sueño',
        fr: 'Télémétrie Continue VRC & Sommeil',
        ar: 'شريك القياسات الحيوية والنوم المستمر'
      },
      category: {
        en: 'Wearable Telemetry',
        es: 'Telemetría Corporal',
        fr: 'Télémétrie Biométrique',
        ar: 'المستشعرات الحيوية'
      },
      tierLabel: {
        en: 'TELEMETRY SENSOR',
        es: 'SENSOR BIOMÉTRICO',
        fr: 'CAPTEUR BIOMÉTRIQUE',
        ar: 'مستشعر حيوي'
      },
      accentColor: '#38BDF8',
      logoSvg: (
        <svg viewBox="0 0 180 72" className="h-11 w-auto" role="img" aria-label="WHOOP official logo">
          {/* Precision Hardware Badge */}
          <rect x="28" y="13" width="124" height="32" rx="6" fill="#090D16" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1.4" />
          <text
            x="90"
            y="35"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="19"
            fontWeight="900"
            fontFamily="'Barlow Condensed', sans-serif"
            letterSpacing="0.28em"
          >
            WHOOP
          </text>
          {/* Biometric Pulse Line */}
          <polyline
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="44,56 68,56 75,49 82,63 90,46 98,60 105,56 136,56"
          />
          <text
            x="90"
            y="68"
            textAnchor="middle"
            fill="#38BDF8"
            fontSize="6"
            fontWeight="700"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.2em"
          >
            4.0 BIOMETRICS
          </text>
        </svg>
      ),
      mandate: {
        en: 'Direct 100 Hz streaming of HRV, nocturnal temperature deviations, and sleep stages into YARD 300 ACWR injury models.',
        es: 'Transmisión directa a 100 Hz de VFC, temperatura nocturna y sueño profundo hacia el motor preventivo ACWR.',
        fr: 'Flux continu 100 Hz de VRC, température nocturne et stades de sommeil vers les modèles préventifs ACWR.',
        ar: 'مزامنة حية لتباين نبض القلب HRV وحرارة الجلد وأطوار النوم مباشرة مع خوارزميات YARD الوقائية.'
      },
      perks: {
        en: [
          'Real-time BLE telemetry sync with YARD Combat Engine',
          'Automated Stage-3 NREM & REM hormonal synthesis feed',
          'Pre-strain muscle overload alerts before injury thresholds'
        ],
        es: [
          'Sincronización BLE en tiempo real con el motor YARD',
          'Cálculo automático de sueño NREM3 y síntesis hormonal',
          'Alertas preventivas de sobrecarga muscular'
        ],
        fr: [
          'Synchronisation BLE en direct avec le moteur YARD',
          'Analyse automatique sommeil profond NREM3 et REM',
          'Alertes précoces de surcharge tendineuse et musculaire'
        ],
        ar: [
          'ربط بلوتوث مباشر بالمحرك السريري YARD 300',
          'قراءة آلية للنوم العميق وإفراز هرمون النمو الليلي',
          'تنبيهات استباقية قبل الوصول لحدود تمزق الأوتار'
        ]
      },
      metrics: [
        {
          label: { en: 'Sample Rate', es: 'Muestreo', fr: 'Fréquence', ar: 'تردد العينة' },
          value: '100 Hz'
        },
        {
          label: { en: 'HRV Accuracy', es: 'Precisión VFC', fr: 'Précision VRC', ar: 'دقة HRV' },
          value: '99.4%'
        },
        {
          label: { en: 'Sync Latency', es: 'Latencia', fr: 'Latence', ar: 'زمن المزامنة' },
          value: '0.25 s'
        }
      ]
    },
    {
      id: 'ufc_mma',
      name: 'UFC · Octagon Sanctioned',
      tagline: {
        en: 'Unified Rules & Championship Safety',
        es: 'Reglas Unificadas y Seguridad MMA',
        fr: 'Règles Unifiées & Sécurité MMA',
        ar: 'شريك التحكيم ومعايير السلامة الدولية'
      },
      category: {
        en: 'Championship Body',
        es: 'Organismo Oficial',
        fr: 'Fédération Officielle',
        ar: 'الهيئة التنظيمية'
      },
      tierLabel: {
        en: 'SANCTIONED MMA',
        es: 'MMA OFICIAL',
        fr: 'MMA HOMOLOGUÉ',
        ar: 'اعتماد قتالي'
      },
      accentColor: '#EF4444',
      logoSvg: (
        <svg viewBox="0 0 180 72" className="h-11 w-auto" role="img" aria-label="UFC official octagon logo">
          {/* Subtle Octagon Outline */}
          <polygon
            points="66,5 114,5 138,20 138,44 114,59 66,59 42,44 42,20"
            fill="#14090A"
            stroke="#DC2626"
            strokeOpacity="0.65"
            strokeWidth="1.5"
          />
          {/* Authentic Slanted Bold UFC Geometry */}
          <g transform="translate(52, 16) skewX(-12)">
            <path
              d="M 4 0 L 13 0 L 13 17 C 13 21 15 23 19 23 C 23 23 25 21 25 17 L 25 0 L 34 0 L 34 18 C 34 27 28 31 19 31 C 10 31 4 27 4 18 Z"
              fill="#E11D48"
            />
            <path d="M 38 0 L 62 0 L 62 7 L 47 7 L 47 12 L 59 12 L 59 19 L 47 19 L 47 30 L 38 30 Z" fill="#E11D48" />
            <path
              d="M 88 7 L 80 11 C 78 8 76 7 73 7 C 68 7 65 10 65 15 C 65 20 68 23 73 23 C 76 23 79 21 81 18 L 89 22 C 85 28 80 31 73 31 C 63 31 56 24 56 15 C 56 6 63 0 73 0 C 80 0 85 2 88 7 Z"
              fill="#E11D48"
            />
          </g>
          <text
            x="90"
            y="68"
            textAnchor="middle"
            fill="#CBD5E1"
            fontSize="6"
            fontWeight="700"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.22em"
          >
            OCTAGON SANCTIONED
          </text>
        </svg>
      ),
      mandate: {
        en: 'Unified regulatory framework ensuring all YARD 300 combat tournaments uphold international medical safety and scoring integrity.',
        es: 'Marco normativo unificado que garantiza seguridad médica internacional y arbitraje íntegro en YARD 300.',
        fr: 'Cadre réglementaire garantissant la sécurité médicale internationale et l’arbitrage officiel YARD 300.',
        ar: 'إطار تنظيمي معتمد يضمن تطبيق أعلى معايير السلامة الطبية والتحكيم الدولي في بطولات YARD 300.'
      },
      perks: {
        en: [
          'Certified refereeing & algorithmic bout scoring',
          'Full WADA-aligned athletic integrity standards',
          'Official cross-division championship ranking sync'
        ],
        es: [
          'Arbitraje certificado y puntuación algorítmica oficial',
          'Estándares completos de integridad deportiva WADA',
          'Sincronización con clasificaciones internacionales'
        ],
        fr: [
          'Arbitrage certifié et notation officielle des combats',
          'Conformité stricte aux normes d’intégrité WADA',
          'Synchronisation des classements par catégorie'
        ],
        ar: [
          'تحكيم معتمد ونظام تقييم رقمي دقيق للنزالات',
          'الالتزام الكامل بمعايير السلامة ومكافحة المنشطات WADA',
          'اعتماد نقاط التصنيف العالمي في لوحة الأبطال'
        ]
      },
      metrics: [
        {
          label: { en: 'Sanctioned Bouts', es: 'Combates', fr: 'Combats', ar: 'نزالات معتمدة' },
          value: '1,450+'
        },
        {
          label: { en: 'Safety Code', es: 'Seguridad', fr: 'Sécurité', ar: 'معيار السلامة' },
          value: '100% WADA'
        },
        {
          label: { en: 'Weight Classes', es: 'Categorías', fr: 'Catégories', ar: 'الأوزان' },
          value: '12 Classes'
        }
      ]
    },
    {
      id: 'tiger_muay_thai',
      name: 'Tiger Muay Thai & MMA',
      tagline: {
        en: 'Phuket World Champion Forge',
        es: 'Forja Mundial de Campeones Phuket',
        fr: 'Forge Mondiale des Champions Phuket',
        ar: 'أكاديمية معسكرات الأبطال العالمية'
      },
      category: {
        en: 'Combat Academy',
        es: 'Academia de Combate',
        fr: 'Académie de Combat',
        ar: 'الأكاديمية القتالية'
      },
      tierLabel: {
        en: 'WORLD ACADEMY',
        es: 'ACADEMIA ÉLITE',
        fr: 'ACADÉMIE ÉLITE',
        ar: 'أكاديمية دولية'
      },
      accentColor: '#F97316',
      logoSvg: (
        <svg viewBox="0 0 180 72" className="h-11 w-auto" role="img" aria-label="Tiger Muay Thai official shield logo">
          {/* Shield Frame */}
          <path
            d="M 90 4 L 122 14 L 122 38 C 122 52 90 60 90 60 C 90 60 58 52 58 38 L 58 14 Z"
            fill="#0D1017"
            stroke="#F97316"
            strokeWidth="2"
          />
          {/* Stylized Bengal Tiger Head Geometry */}
          <polygon points="69,20 75,11 80,21" fill="#F97316" />
          <polygon points="111,20 105,11 100,21" fill="#F97316" />
          <path d="M 70 22 Q 90 16 110 22 Q 116 33 110 43 Q 90 51 70 43 Q 64 33 70 22 Z" fill="#F97316" />
          {/* Tiger Stripes */}
          <path d="M 90 18 L 87 25 L 93 25 Z" fill="#0D1017" />
          <path d="M 74 25 L 82 28 L 76 31 Z" fill="#0D1017" />
          <path d="M 106 25 L 98 28 L 104 31 Z" fill="#0D1017" />
          {/* Eyes & Muzzle */}
          <polygon points="78,30 85,32 83,35 76,33" fill="#FACC15" />
          <polygon points="102,30 95,32 97,35 104,33" fill="#FACC15" />
          <ellipse cx="90" cy="40" rx="6" ry="4" fill="#FFFFFF" />
          <polygon points="88,38 92,38 90,41" fill="#0D1017" />
          <text
            x="90"
            y="69"
            textAnchor="middle"
            fill="#F97316"
            fontSize="6.5"
            fontWeight="800"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.16em"
          >
            TIGER MUAY THAI
          </text>
        </svg>
      ),
      mandate: {
        en: 'Official Phuket training sanctuary partner hosting YARD 300 intensive Muay Thai, wrestling, and high-heat expedition camps.',
        es: 'Sede asociada oficial en Phuket para campamentos intensivos de Muay Thai, lucha y preparación YARD 300.',
        fr: 'Partenaire officiel à Phuket accueillant les camps intensifs Muay Thai, lutte et expéditions YARD 300.',
        ar: 'الشريك الرسمي لمعسكرات التدريب المكثف للمواي تاي والمصارعة وإعداد أبطال YARD 300 في بوكيت.'
      },
      perks: {
        en: [
          'Priority seasonal booking in YARD x Phuket Fighter Camps',
          'Masterclass striking & clinching with world champion coaches',
          'Direct invitation pathway to live YARD 300 tournaments'
        ],
        es: [
          'Reserva prioritaria en campamentos YARD x Phuket',
          'Clases magistrales con entrenadores de campeones mundiales',
          'Vía directa de invitación a torneos YARD 300'
        ],
        fr: [
          'Réservation prioritaire pour les camps YARD x Phuket',
          'Masterclass de striking avec coachs champions du monde',
          'Accès direct aux sélections des tournois YARD 300'
        ],
        ar: [
          'أولوية حجز VIP لمعسكرات القتال الدولية في بوكيت',
          'حصص تدريبية مع نخبة مدربي أبطال العالم',
          'ترشيح مباشر للمنافسة في بطولات YARD 300 الحية'
        ]
      },
      metrics: [
        {
          label: { en: 'World Champs', es: 'Campeones', fr: 'Champions', ar: 'أبطال العالم' },
          value: '45+ UFC/ONE'
        },
        {
          label: { en: 'Campus Size', es: 'Superficie', fr: 'Surface', ar: 'مساحة المعسكر' },
          value: '11,000 m²'
        },
        {
          label: { en: 'Standard', es: 'Nivel', fr: 'Standard', ar: 'التصنيف' },
          value: 'Global Elite'
        }
      ]
    }
  ];

  return (
    <section className={`relative w-full py-2.5 md:py-3 ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="rounded-xl bg-[#0A0C12] border border-white/[0.08] px-3.5 py-3 sm:px-4 sm:py-3.5 space-y-3">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/[0.07]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.16em] text-[#D4AF37]">
              <ShieldCheck className="w-3 h-3" />
              <span>
                {tr(currentLang, {
                  en: 'OFFICIAL SPONSORS',
                  es: 'PATROCINADORES OFICIALES',
                  fr: 'SPONSORS OFFICIELS',
                  ar: 'الرعاة الرسميون'
                })}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              {tr(currentLang, {
                en: 'Global Combat Alliance',
                es: 'Alianza Global de Combate',
                fr: 'Alliance Mondiale Combat',
                ar: 'تحالف الأداء القتالي العالمي'
              })}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 tabular-nums shrink-0">
            <Activity className="w-3 h-3 text-[#10B981]" />
            <span>
              05{' '}
              {tr(currentLang, {
                en: 'VERIFIED',
                es: 'VERIFICADOS',
                fr: 'VÉRIFIÉS',
                ar: 'معتمدين'
              })}
            </span>
          </div>
        </div>

        {/* Ultra-Compact 5-Partner Plates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {partners.map((partner) => {
            const isSelected = activePartner?.id === partner.id;
            return (
              <button
                key={partner.id}
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setActivePartner(partner);
                }}
                className={`group text-start rounded-lg p-2 bg-[#0F121B] border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-[#D4AF37] bg-[#141824]'
                    : 'border-white/[0.08] hover:border-white/25 hover:bg-[#131722]'
                }`}
              >
                <div className="flex items-center justify-between text-[8px] font-mono tracking-wider uppercase w-full">
                  <span style={{ color: partner.accentColor }} className="truncate">{partner.tierLabel[lKey]}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                </div>

                {/* Slim Brand Logo Plate */}
                <div className="h-11 w-full rounded-md bg-[#07080C] border border-white/[0.07] flex items-center justify-center px-1.5 group-hover:border-white/20 transition-colors [&>svg]:h-8 [&>svg]:w-auto">
                  {partner.logoSvg}
                </div>

                <div className="flex items-center justify-between gap-1 w-full">
                  <h3 className="text-[11px] font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                    {partner.name}
                  </h3>
                  <span className="text-[9px] text-slate-400 group-hover:text-white shrink-0">
                    {isAr ? '←' : '→'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Partner Details Modal */}
      {activePartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#0C0E14] border border-white/[0.14] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setActivePartner(null);
              }}
              className="p-2 rounded-lg bg-[#141722] hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer float-end"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#07080C] border border-white/[0.08] shrink-0">
                {activePartner.logoSvg}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider block" style={{ color: activePartner.accentColor }}>
                  {activePartner.tierLabel[lKey]}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white truncate">{activePartner.name}</h3>
                <p className="text-xs text-slate-400">{activePartner.category[lKey]}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121622] border border-white/[0.07] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                {tr(currentLang, {
                  en: 'TECHNICAL PARTNERSHIP MANDATE',
                  es: 'MANDATO TÉCNICO DE ASOCIACIÓN',
                  fr: 'MANDAT TECHNIQUE DU PARTENARIAT',
                  ar: 'ميثاق الشراكة التقنية'
                })}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">{activePartner.mandate[lKey]}</p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {activePartner.metrics.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#07080C] border border-white/[0.07] text-center">
                  <span className="text-sm sm:text-base font-bold font-mono tabular-nums block" style={{ color: activePartner.accentColor }}>
                    {m.value}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">{m.label[lKey]}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>
                  {tr(currentLang, {
                    en: 'YARD 300 Athlete Benefits',
                    es: 'Beneficios para Atletas YARD 300',
                    fr: 'Avantages Athlètes YARD 300',
                    ar: 'مزايا أبطال YARD 300 المعتمدة'
                  })}
                </span>
              </h4>
              <ul className="space-y-1.5">
                {activePartner.perks[lKey].map((perk, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-[#10B981] font-mono shrink-0">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setActivePartner(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-bold text-xs transition-colors cursor-pointer"
            >
              {tr(currentLang, {
                en: 'Close Protocol',
                es: 'Cerrar Protocolo',
                fr: 'Fermer le Protocole',
                ar: 'إغلاق البروتوكول'
              })}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GlobalSponsorsShowcase;
