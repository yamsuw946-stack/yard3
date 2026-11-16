import React, { useState } from 'react';
import { ShieldCheck, Activity, CheckCircle2, X } from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';

interface GlobalSponsorsShowcaseProps {
  currentLang?: Language;
}

interface LText {
  en: string;
  es: string;
  fr: string;
  ar: string;
}

interface Partner {
  id: string;
  name: string;
  tagline: LText;
  category: LText;
  badge: string;
  accentColor: string;
  glowColor: string;
  logoSvg: React.ReactNode;
  mandate: LText;
  perks: { en: string[]; es: string[]; fr: string[]; ar: string[] };
  metrics: { label: LText; value: string }[];
}

export const GlobalSponsorsShowcase: React.FC<GlobalSponsorsShowcaseProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const [activePartner, setActivePartner] = useState<Partner | null>(null);

  const pick = (text: LText) => tr(currentLang, text);
  const pickList = (perks: { en: string[]; es: string[]; fr: string[]; ar: string[] }) => {
    if (currentLang === 'ar') return perks.ar;
    if (currentLang === 'es') return perks.es;
    if (currentLang === 'fr') return perks.fr;
    return perks.en;
  };

  const partners: Partner[] = [
    {
      id: 'adidas',
      name: 'ADIDAS COMBAT SPORTS',
      tagline: {
        en: 'Official Technical Fightwear',
        es: 'Indumentaria Técnica de Combate',
        fr: 'Tenue Technique de Combat',
        ar: 'شريك الملابس القتالية المعتمد'
      },
      category: {
        en: 'Technical Apparel',
        es: 'Ropa Técnica',
        fr: 'Équipement Technique',
        ar: 'الملابس القتالية التقنية'
      },
      badge: 'PARTNER #1',
      accentColor: '#FFFFFF',
      glowColor: 'rgba(255, 255, 255, 0.2)',
      logoSvg: (
        <svg viewBox="0 0 130 65" className="w-16 h-8" fill="none">
          <path d="M 22 36 L 33 36 L 22 22 L 11 22 Z" fill="#FFFFFF" />
          <path d="M 38 36 L 49 36 L 33 13 L 22 13 Z" fill="#FFFFFF" />
          <path d="M 54 36 L 65 36 L 44 4 L 33 4 Z" fill="#FFFFFF" />
          <text x="38" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.06em">adidas</text>
          <text x="38" y="59" textAnchor="middle" fill="#9CA3AF" fontSize="6.2" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.16em">COMBAT SPORTS</text>
        </svg>
      ),
      mandate: {
        en: 'Engineered with tensile compression fibers supporting YARD 300 athletes across high-output endurance and combat camps.',
        es: 'Diseñado con compresión de nanotextil de alta resistencia para potenciar a los atletas de YARD 300.',
        fr: 'Conçu avec une compression haute résistance pour équiper les athlètes de YARD 300.',
        ar: 'صُنعت خصيصاً بنسيج ضاغط عالي المتانة لدعم أبطال YARD 300 في التحديات والمعسكرات القتالية.'
      },
      perks: {
        en: ['25% discount on pro rashguards & fightwear', 'ISO impact-tested wraps & shin guards', 'Thermal dissipation athletic fiber'],
        es: ['25% de descuento en ropa de combate YARD 300', 'Vendas y espinilleras certificadas', 'Tejido térmico de máxima intensidad'],
        fr: ['25 % de réduction sur les tenues de combat', 'Bandes et protections certifiées', 'Fibre thermo-régulatrice haute intensité'],
        ar: ['خصم 25% على ملابس النزال لأعضاء YARD', 'أربطة يد معتمدة لامتصاص الصدمات', 'ألياف تبريد حركية عالية الكفاءة']
      },
      metrics: [
        { label: { en: 'Tensile Strength', es: 'Tracción', fr: 'Résistance', ar: 'قوة الشد' }, value: '450 N/cm²' },
        { label: { en: 'Cooling Delta', es: 'Enfriamiento', fr: 'Refroidissement', ar: 'معامل التبريد' }, value: '-3.8 °C' },
        { label: { en: 'Standard', es: 'Estándar', fr: 'Norme', ar: 'المعيار' }, value: 'ISO Pro' }
      ]
    },
    {
      id: 'redbull',
      name: 'RED BULL ATHLETE LAB',
      tagline: {
        en: 'Cognitive Reflex & Endurance',
        es: 'Reflejos y Resistencia Física',
        fr: 'Réflexes & Endurance',
        ar: 'شريك التحمل وسرعة رد الفعل'
      },
      category: {
        en: 'Endurance Lab',
        es: 'Lab Resistencia',
        fr: 'Labo Endurance',
        ar: 'التحمل والأداء العصبي'
      },
      badge: 'PARTNER #2',
      accentColor: '#D4AF37',
      glowColor: 'rgba(212, 175, 55, 0.25)',
      logoSvg: (
        <svg viewBox="0 0 140 70" className="w-18 h-9" fill="none">
          <circle cx="70" cy="28" r="20" fill="#FFCC00" />
          <g fill="#D20A11">
            <path d="M 12 36 C 14 30 20 28 26 25 C 28 21 34 18 42 19 C 48 20 54 24 60 26 C 65 27 68 31 70 33 C 66 35 62 33 58 32 C 54 35 50 41 46 44 C 42 46 36 45 32 46 C 28 47 24 53 22 55 L 20 55 L 23 46 C 20 47 16 45 13 42 C 10 39 10 37 12 36 Z" />
          </g>
          <g fill="#D20A11">
            <path d="M 128 36 C 126 30 120 28 114 25 C 112 21 106 18 98 19 C 92 20 86 24 80 26 C 75 27 72 31 70 33 C 74 35 78 33 82 32 C 86 35 90 41 94 44 C 98 46 104 45 108 46 C 112 47 116 53 118 55 L 120 55 L 117 46 C 120 47 124 45 127 42 C 130 39 130 37 128 36 Z" />
          </g>
          <text x="70" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontStyle="italic" fontFamily="sans-serif" letterSpacing="0.04em">Red Bull</text>
          <text x="70" y="65" textAnchor="middle" fill="#D4AF37" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.16em">ATHLETE LAB</text>
        </svg>
      ),
      mandate: {
        en: 'Collaborating on reaction-speed telemetry and lactic acid threshold performance under high-intensity combat workloads.',
        es: 'Colaboración científica en reflejos neuronales y umbral láctico bajo fatiga extrema.',
        fr: 'Partenariat scientifique pour la vitesse réflexe sous acidose lactique.',
        ar: 'تعاون في اختبارات سرعة الاستجابة العصبية وعتبة التحمل البدني تحت الجهد العالي.'
      },
      perks: {
        en: ['Cognitive reaction protocols', 'Electrolyte hydration research', 'VO2 efficiency testing'],
        es: ['Protocolos de reacción cognitiva', 'Nutrición y electrolitos de élite', 'Pruebas de eficiencia VO2'],
        fr: ['Protocoles de réflexes cognitifs', 'Support en électrolytes', 'Tests d’efficacité VO2'],
        ar: ['بروتوكولات سرعة رد الفعل', 'تركيبات الترطيب والأملاح', 'اختبارات كفاءة VO2']
      },
      metrics: [
        { label: { en: 'Reaction Latency', es: 'Latencia Refleja', fr: 'Latence Réflexe', ar: 'زمن الاستجابة' }, value: '142 ms' },
        { label: { en: 'Lactate Gain', es: 'Umbral Láctico', fr: 'Seuil Lactique', ar: 'عتبة اللاكتات' }, value: '+18.4%' },
        { label: { en: 'VO2 Max Delta', es: 'VO2 Max', fr: 'VO2 Max', ar: 'الأكسجين VO2' }, value: '+11.2%' }
      ]
    },
    {
      id: 'whoop',
      name: 'WHOOP 4.0',
      tagline: {
        en: 'Continuous Biometric Telemetry',
        es: 'Telemetría Biométrica Continua',
        fr: 'Télémétrie Biométrique Directe',
        ar: 'شريك القياسات الحيوية و HRV'
      },
      category: {
        en: 'Wearable Sensors',
        es: 'Sensores Biométricos',
        fr: 'Capteurs Biométriques',
        ar: 'المستشعرات البيومترية'
      },
      badge: 'PARTNER #3',
      accentColor: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      logoSvg: (
        <svg viewBox="0 0 135 55" className="w-18 h-9" fill="none">
          <g transform="translate(18, 25)">
            <circle cx="0" cy="0" r="14" stroke="#10B981" strokeWidth="2.5" strokeDasharray="14 3 6 3" strokeLinecap="round" />
            <circle cx="0" cy="0" r="4.5" fill="#10B981" />
          </g>
          <text x="78" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.2em">WHOOP</text>
          <text x="78" y="44" textAnchor="middle" fill="#10B981" fontSize="7" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.22em">4.0 TELEMETRY</text>
        </svg>
      ),
      mandate: {
        en: 'Continuous HRV, resting heart rate, skin temperature & NREM3 deep sleep sync directly powering the YARD ACWR injury model.',
        es: 'Sincronización en vivo de VFC, sueño profundo NREM3 y temperatura cutánea con el motor YARD.',
        fr: 'Synchronisation directe du VRC, sommeil profond NREM3 et température avec le moteur YARD.',
        ar: 'مزامنة مباشرة لتقلب نبض القلب HRV وحرارة الجلد وأطوار النوم العميق مع خوارزميات YARD.'
      },
      perks: {
        en: ['100 Hz continuous HRV feed', 'Automated NREM3 sleep calculation', 'Acute overload injury alerts'],
        es: ['Muestreo continuo de VFC', 'Cálculo automático del sueño', 'Alertas tempranas de sobrecarga'],
        fr: ['Flux VRC continu 100 Hz', 'Calcul auto du sommeil profond', 'Alertes de surcharge aiguë'],
        ar: ['بث مستمر لمعدل HRV بدقة 100 Hz', 'حساب تلقائي لساعات النوم العميق', 'تنبيهات وقائية قبل الإصابات']
      },
      metrics: [
        { label: { en: 'Sample Rate', es: 'Frecuencia', fr: 'Fréquence', ar: 'معدل العينات' }, value: '100 Hz' },
        { label: { en: 'HRV Accuracy', es: 'Precisión VFC', fr: 'Précision VRC', ar: 'دقة HRV' }, value: '99.4%' },
        { label: { en: 'Sync Latency', es: 'Sincronización', fr: 'Latence Synchro', ar: 'زمن المزامنة' }, value: '0.25 s' }
      ]
    },
    {
      id: 'ufc_mma',
      name: 'UFC · WORLD MMA',
      tagline: {
        en: 'Official Championship Standard',
        es: 'Estándar Mundial de Combate',
        fr: 'Standard Mondial Homologué',
        ar: 'شريك معايير النزالات الدولية'
      },
      category: {
        en: 'Combat Federation',
        es: 'Federación MMA',
        fr: 'Fédération MMA',
        ar: 'معايير النزالات العالمية'
      },
      badge: 'PARTNER #4',
      accentColor: '#D20A0A',
      glowColor: 'rgba(210, 10, 10, 0.25)',
      logoSvg: (
        <svg viewBox="0 0 130 55" className="w-18 h-9" fill="none">
          <g transform="skewX(-10)">
            <path d="M 16 8 L 27 8 L 27 26 C 27 31 30 33 35 33 C 40 33 43 31 43 26 L 43 8 L 54 8 L 54 26 C 54 38 46 43 35 43 C 24 43 16 38 16 26 Z" fill="#D20A0A" />
            <path d="M 59 8 L 90 8 L 90 17 L 70 17 L 70 23 L 86 23 L 86 31 L 70 31 L 70 43 L 59 43 Z" fill="#D20A0A" />
            <path d="M 120 16 L 110 22 C 108 17 105 16 101 16 C 95 16 91 20 91 25.5 C 91 31 95 35 101 35 C 105 35 108 33 111 29 L 121 34 C 116 41 110 43 101 43 C 89 43 80 35 80 25.5 C 80 16 89 8 101 8 C 110 8 116 11 120 16 Z" fill="#D20A0A" />
          </g>
          <text x="65" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.2em">OCTAGON SANCTIONED</text>
        </svg>
      ),
      mandate: {
        en: 'Unified athletic safety standards, competition division scoring, and clean WADA anti-doping pathways across YARD trials.',
        es: 'Estándares unificados de seguridad, puntuación y cumplimiento antidopaje WADA.',
        fr: 'Standards unifiés de sécurité, arbitrage homologué et conformité antidopage WADA.',
        ar: 'تطبيق أعلى معايير السلامة الدولية وتحكيم المنافسات الرياضية النظيفة المعتمدة.'
      },
      perks: {
        en: ['Unified scoring protocols', 'WADA-compliant athletic integrity', 'Leaderboard division integration'],
        es: ['Puntuación oficial unificada', 'Protocolos antidopaje WADA', 'Integración en el ranking'],
        fr: ['Notation officielle unifiée', 'Protocoles WADA intègres', 'Points intégrés au classement'],
        ar: ['بروتوكولات تحكيم معتمدة', 'التزام كامل بمعايير السلامة WADA', 'دمج نقاط التحديات في التصنيف']
      },
      metrics: [
        { label: { en: 'Verified Bouts', es: 'Combates', fr: 'Combats', ar: 'نزالات معتمدة' }, value: '1,450+' },
        { label: { en: 'Safety Standard', es: 'Seguridad', fr: 'Sécurité', ar: 'معيار السلامة' }, value: '100% WADA' },
        { label: { en: 'Divisions', es: 'Divisiones', fr: 'Divisions', ar: 'الفئات' }, value: '12 Classes' }
      ]
    },
    {
      id: 'tiger_muay_thai',
      name: 'TIGER MUAY THAI',
      tagline: {
        en: 'Elite Striking & Camp Academy',
        es: 'Academia Élite de Combate',
        fr: 'Académie Élite de Combat',
        ar: 'أكاديمية التدريب والمعسكرات القتالية'
      },
      category: {
        en: 'Training Academy',
        es: 'Academia de Campo',
        fr: 'Académie Sportive',
        ar: 'أكاديمية التدريب القتالي'
      },
      badge: 'PARTNER #5',
      accentColor: '#FF6B00',
      glowColor: 'rgba(255, 107, 0, 0.25)',
      logoSvg: (
        <svg viewBox="0 0 130 75" className="w-16 h-9" fill="none">
          <path d="M 65 3 L 105 15 L 105 48 C 105 65 65 74 65 74 C 65 74 25 65 25 48 L 25 15 Z" fill="#0C0E18" stroke="#FF6B00" strokeWidth="2.5" />
          <path d="M 40 24 Q 65 18 90 24 Q 98 38 90 50 Q 65 60 40 50 Q 32 38 40 24 Z" fill="#FF6B00" />
          <ellipse cx="65" cy="45" rx="7" ry="5" fill="#FFFFFF" />
          <rect x="18" y="58" width="94" height="13" rx="3" fill="#FF6B00" stroke="#FFE600" strokeWidth="1" />
          <text x="65" y="68" textAnchor="middle" fill="#000000" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.08em">TIGER MUAY THAI</text>
        </svg>
      ),
      mandate: {
        en: 'Hosting striking, endurance conditioning, and cross-training seminars for YARD 300 international expedition camps.',
        es: 'Sede asociada para campamentos intensivos de resistencia y artes marciales.',
        fr: 'Académie partenaire pour les stages intensifs de frappe et d’endurance YARD 300.',
        ar: 'شراكة مع معسكرات YARD 300 لتطوير مهارات اللكم واللياقة القتالية والتحمل الميداني.'
      },
      perks: {
        en: ['Priority camp booking access', 'Masterclasses with world coaches', 'Direct championship draft trials'],
        es: ['Acceso prioritario a campamentos', 'Masterclasses con técnicos de élite', 'Pruebas de clasificación directas'],
        fr: ['Accès prioritaire aux camps', 'Masterclass avec coachs mondiaux', 'Sélections directes aux tournois'],
        ar: ['أولوية الحجز في المعسكرات', 'دروس مع مدربي أبطال العالم', 'تجارب تأهيل مباشرة للبطولات']
      },
      metrics: [
        { label: { en: 'Champions', es: 'Campeones', fr: 'Champions', ar: 'أبطال متخرجون' }, value: '45+ Pro' },
        { label: { en: 'Campus Area', es: 'Área Campo', fr: 'Superficie', ar: 'مساحة المعسكر' }, value: '11,000 m²' },
        { label: { en: 'Tier', es: 'Categoría', fr: 'Niveau', ar: 'الاعتماد' }, value: 'Global' }
      ]
    }
  ];

  return (
    <section className="relative w-full py-5">
      <div className="relative z-10 space-y-4">
        {/* Compact Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-emerald-500/15 pb-3 ${
            isAr ? 'text-right' : 'text-left'
          }`}
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black font-anime tracking-wider text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {tr(currentLang, {
                  en: 'OFFICIAL GLOBAL PARTNERS & SPONSORS',
                  es: 'PATROCINADORES Y SOCIOS GLOBALES OFICIALES',
                  fr: 'PARTENAIRES ET SPONSORS MONDIAUX OFFICIELS',
                  ar: 'الشركاء والرعاة العالميون المعتمدون'
                })}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-anime tracking-tight text-white">
              {tr(currentLang, {
                en: 'Global Combat & Bio-Telemetry Alliance',
                es: 'Alianza Global de Combate y Telemetría',
                fr: 'Alliance Mondiale Performance & Biométrie',
                ar: 'تحالف الأداء القتالي والقياسات الحيوية العالمي'
              })}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 shrink-0">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-bold tabular-nums">5</span>
            <span>
              {tr(currentLang, {
                en: 'Official Tier-1 Partners',
                es: 'Socios Oficiales',
                fr: 'Partenaires Officiels',
                ar: 'شركاء دوليون معتمدون'
              })}
            </span>
          </div>
        </div>

        {/* Compact 5-Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                className={`group text-start rounded-xl p-3 bg-[#080D0B] border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'border-emerald-500/20 hover:border-emerald-400/60'
                }`}
              >
                <div className="h-10 flex items-center justify-center p-1.5 rounded-lg bg-[#050807] border border-white/5">
                  {partner.logoSvg}
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-xs font-black font-anime text-white group-hover:text-emerald-300 transition-colors truncate">
                    {partner.name}
                  </h3>
                  <p className="text-[10px] font-medium text-gray-400 line-clamp-1">
                    {pick(partner.tagline)}
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[10px] font-black font-anime text-emerald-400">
                  <span>
                    {tr(currentLang, {
                      en: 'Protocol',
                      es: 'Detalles',
                      fr: 'Protocole',
                      ar: 'التفاصيل'
                    })}
                  </span>
                  <span>{isAr ? '←' : '→'}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Compact Integration Strip */}
        <div className="px-3.5 py-2 rounded-xl bg-[#070B09] border border-emerald-500/15 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-gray-400">
          <span className="text-emerald-400 font-mono">
            {tr(currentLang, {
              en: 'ACTIVE IN ARENA, LABS & EXPEDITION CAMPS',
              es: 'ACTIVO EN ARENA, LABS Y CAMPAMENTOS',
              fr: 'ACTIF EN ARÈNE, LABOS ET CAMPS',
              ar: 'شراكة فعالة في الحلبة والمختبرات والمعسكرات'
            })}
          </span>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] text-gray-400">
            <span>ADIDAS</span>
            <span>RED BULL LAB</span>
            <span>WHOOP 4.0</span>
            <span>UFC · MMA</span>
            <span>TIGER MUAY THAI</span>
          </div>
        </div>
      </div>

      {/* Partner Detail Modal */}
      {activePartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#080D0B] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setActivePartner(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <div className="p-2.5 rounded-xl bg-black border border-emerald-500/20 shrink-0">
                {activePartner.logoSvg}
              </div>
              <div>
                <span className="text-[10px] font-black font-mono text-emerald-400 block mb-0.5">
                  {activePartner.badge} · {pick(activePartner.category)}
                </span>
                <h3 className="text-xl font-black font-anime text-white">{activePartner.name}</h3>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl bg-[#050807] border border-emerald-500/20 space-y-1 ${isAr ? 'text-right' : 'text-left'}`}>
              <span className="text-[10px] font-black uppercase text-emerald-400 font-mono block">
                {tr(currentLang, {
                  en: 'PARTNERSHIP PROTOCOL',
                  es: 'PROTOCOLO DE ASOCIACIÓN',
                  fr: 'PROTOCOLE PARTENARIAT',
                  ar: 'ميثاق الشراكة التقنية'
                })}
              </span>
              <p className="text-xs text-gray-200 font-semibold leading-relaxed">
                {pick(activePartner.mandate)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {activePartner.metrics.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#050807] border border-emerald-500/15 text-center">
                  <span className="text-sm font-black font-mono text-emerald-400 tabular-nums block">
                    {m.value}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 block truncate">
                    {pick(m.label)}
                  </span>
                </div>
              ))}
            </div>

            <div className={`space-y-2 ${isAr ? 'text-right' : 'text-left'}`}>
              <h4 className="text-xs font-black font-anime text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {tr(currentLang, {
                    en: 'YARD 300 Athlete Benefits:',
                    es: 'Beneficios para Atletas YARD 300:',
                    fr: 'Avantages Athlètes YARD 300 :',
                    ar: 'امتيازات مشتركي YARD 300:'
                  })}
                </span>
              </h4>
              <ul className="space-y-1.5">
                {pickList(activePartner.perks).map((perk, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300 font-medium">
                    <span className="text-emerald-400 font-mono shrink-0">✓</span>
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
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-anime text-xs transition-colors cursor-pointer"
            >
              {tr(currentLang, {
                en: 'Close Protocol',
                es: 'Cerrar Protocolo',
                fr: 'Fermer le Protocole',
                ar: 'إغلاق التفاصيل'
              })}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GlobalSponsorsShowcase;
