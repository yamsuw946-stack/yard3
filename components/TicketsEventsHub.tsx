import React, { useState } from 'react';
import {
  Ticket,
  Calendar,
  MapPin,
  ShieldCheck,
  Check,
  Tv,
  MonitorPlay,
  Radio,
  Bell,
  QrCode
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

interface TicketsEventsHubProps {
  currentLang?: Language;
  onBackToHome?: () => void;
  onProceedToCheckout?: (eventTitle: string, price: number) => void;
}

interface TournamentEvent {
  id: string;
  code: string;
  title: { en: string; es: string; fr: string; ar: string };
  tagline: { en: string; es: string; fr: string; ar: string };
  date: { en: string; es: string; fr: string; ar: string };
  time: string;
  location: { en: string; es: string; fr: string; ar: string };
  price: number;
  originalPrice?: number;
  tier: 'ATHLETE ENTRY' | 'CHAMPION PASS' | 'VIP RINGSIDE';
  status: 'opens_jan_5' | 'not_open_2027';
  statusNotice: { en: string; es: string; fr: string; ar: string };
  perks: { en: string[]; es: string[]; fr: string[]; ar: string[] };
  image: string;
}

const TOURNAMENT_EVENTS: TournamentEvent[] = [
  {
    id: 'wilderness-10-trials-2027',
    code: 'Y300-NAT-10',
    title: {
      en: 'Wilderness 10-Challenge Endurance Open',
      es: 'Abierto de Resistencia: 10 Desafíos en la Naturaleza',
      fr: 'Open d’Endurance : 10 Défis en Pleine Nature',
      ar: 'بطولة التحديات العشرة للقدرة واللياقة في الطبيعة'
    },
    tagline: {
      en: 'A 10-challenge natural-terrain endurance championship testing raw stamina, agility, and power outdoors.',
      es: 'Campeonato de 10 desafíos en entorno natural para probar fuerza, resistencia y capacidad atlética real.',
      fr: 'Championnat en 10 épreuves en pleine nature testant l’endurance, la puissance et la résilience mentale.',
      ar: 'بطولة كبرى تضم 10 تحديات ميدانية متكاملة لاختبار القدرة واللياقة البدنية والتحمل الشاق في أحضان الطبيعة.'
    },
    date: {
      en: 'January 5, 2027',
      es: '5 de enero de 2027',
      fr: '5 janvier 2027',
      ar: '5 يناير 2027'
    },
    time: '07:00 – 17:00 ICT',
    location: {
      en: 'Wilderness Circuit · Cambodia',
      es: 'Circuito Natural · Camboya',
      fr: 'Circuit Nature · Cambodge',
      ar: 'مسار الطبيعة المفتوح · كمبوديا'
    },
    price: 80,
    originalPrice: 110,
    tier: 'ATHLETE ENTRY',
    status: 'opens_jan_5',
    statusNotice: {
      en: 'Ticket sales officially open January 5, 2027 — 10-Challenge Nature Endurance Championship.',
      es: 'Venta de entradas abre oficialmente el 5 de enero de 2027 — Campeonato de 10 Desafíos en Naturaleza.',
      fr: 'Ouverture officielle des billets le 5 janvier 2027 — Championnat des 10 Défis Nature.',
      ar: 'تُفتح التذاكر رسمياً في 5 يناير 2027 — بطولة الـ 10 تحديات في الطبيعة.'
    },
    perks: {
      en: [
        'Official 10-Challenge Nature Bib & RFID Timing Chip',
        'Live ACWR Heart & Terrain Telemetry Display',
        'Serialized YARD 300 10-Trial Finisher Medal',
        'Field Electrolyte & Recovery Nutrition Pack'
      ],
      es: [
        'Dorsal oficial de 10 desafíos y chip de cronometraje RFID',
        'Lectura en vivo de carga ACWR y frecuencia cardíaca',
        'Medalla numerada YARD 300 de los 10 Desafíos',
        'Kit de hidratación y recuperación en circuito'
      ],
      fr: [
        'Dossard officiel 10 épreuves et puce chrono RFID',
        'Télémétrie ACWR et suivi cardiaque en direct',
        'Médaille Finisher numérotée YARD 300',
        'Pack électrolytes et récupération sur le terrain'
      ],
      ar: [
        'رقم المتسابق للـ 10 تحديات وشريحة التوقيت الذكية',
        'شاشة قياس مباشرة للنبض والحمل العضلي ACWR',
        'ميدالية إنهاء التحديات العشرة المرقمة من YARD',
        'حقيبة ترطيب وتغذية للاستشفاء الميداني الفوري'
      ]
    },
    image: '/images/ticket_shaolin_trials.jpg'
  },
  {
    id: 'cyber-grand-prix-2027',
    code: 'Y300-BKK-2027',
    title: {
      en: 'YARD 300 Grand Prix 2027',
      es: 'Gran Premio YARD 300 · 2027',
      fr: 'Grand Prix YARD 300 · 2027',
      ar: 'بطولة YARD 300 الكبرى 2027'
    },
    tagline: {
      en: 'Flagship international arena showdown uniting 300 Hyrox and martial athletics specialists.',
      es: 'Gran espectáculo internacional de arena que reúne a 300 atletas de Hyrox y combate.',
      fr: 'Rendez-vous international d’élite réunissant 300 spécialistes Hyrox et arts martiaux.',
      ar: 'النزال الدولي الأضخم بمشاركة 300 بطل من نخبة الهايروكس والفنون القتالية العالمية.'
    },
    date: {
      en: 'January 30, 2027',
      es: '30 de enero de 2027',
      fr: '30 janvier 2027',
      ar: '30 يناير 2027'
    },
    time: '18:00 – 23:00 ICT',
    location: {
      en: 'Bangkok · Thailand',
      es: 'Bangkok · Tailandia',
      fr: 'Bangkok · Thaïlande',
      ar: 'بانكوك · تايلاند'
    },
    price: 100,
    originalPrice: 150,
    tier: 'CHAMPION PASS',
    status: 'not_open_2027',
    statusNotice: {
      en: '2027 Championship — Tickets have not opened for sale yet.',
      es: 'Campeonato 2027 — Las entradas aún no están a la venta.',
      fr: 'Championnat 2027 — Billetterie pas encore ouverte.',
      ar: 'بطولة 2027 — لم يتم فتح التذاكر للبيع بعد.'
    },
    perks: {
      en: [
        'Full Tournament Arena Seating Access',
        'Official YARD 300 Championship Jersey',
        'Fighter Warm-Up Paddock & Recovery Lounge',
        'Live Biometric Telemetry App Sync'
      ],
      es: [
        'Acceso completo a gradas principales del torneo',
        'Camiseta oficial del Campeonato YARD 300',
        'Acceso a zona de calentamiento y recuperación',
        'Sincronización biométrica en directo en la app'
      ],
      fr: [
        'Accès complet aux places de l’arène officielle',
        'Maillot officiel du Championnat YARD 300',
        'Salon récupération et paddock d’échauffement',
        'Synchronisation télémétrique en direct sur l’app'
      ],
      ar: [
        'دخول كامل لجميع نزالات البطولة والمقاعد الرئيسية',
        'قميص البطولة الرسمي الحصري YARD 300',
        'دخول مناطق الإحماء وصالات الاستشفاء',
        'مزامنة فورية للإحصائيات الحيوية عبر التطبيق'
      ]
    },
    image: '/images/ticket_tokyo_cyber.jpg'
  },
  {
    id: 'vip-masters-showdown-2027',
    code: 'Y300-REP-2027',
    title: {
      en: 'YARD VIP Ringside & Founders Gala',
      es: 'Pase VIP Ringside y Gala de Fundadores',
      fr: 'VIP Ringside & Gala des Fondateurs',
      ar: 'تذكرة المنصة الملكية VIP ولقاء المؤسسين'
    },
    tagline: {
      en: 'Front-row ringside combat vantage, private founders clinic, and serialized titanium keepsake.',
      es: 'Primera fila frente al ring, clínica privada con fundadores y placa de titanio numerada.',
      fr: 'Premier rang au bord du ring, masterclass privée des fondateurs et trophée en titane.',
      ar: 'مقاعد الصف الأول المباشر مع جلسة ماستركلاس مع المؤسسين ودرع تيتانيوم مرقم.'
    },
    date: {
      en: 'March 15, 2027',
      es: '15 de marzo de 2027',
      fr: '15 mars 2027',
      ar: '15 مارس 2027'
    },
    time: '17:00 – 00:00 ICT',
    location: {
      en: 'Siem Reap · Cambodia',
      es: 'Siem Reap · Camboya',
      fr: 'Siem Reap · Cambodge',
      ar: 'سيم ريب · كمبوديا'
    },
    price: 180,
    originalPrice: 250,
    tier: 'VIP RINGSIDE',
    status: 'not_open_2027',
    statusNotice: {
      en: '2027 Championship — Tickets have not opened for sale yet.',
      es: 'Campeonato 2027 — Las entradas aún no están a la venta.',
      fr: 'Championnat 2027 — Billetterie pas encore ouverte.',
      ar: 'بطولة 2027 — لم يتم فتح التذاكر للبيع بعد.'
    },
    perks: {
      en: [
        'Front-Row Ringside Hospitality Seating',
        'Private Masterclass with Founding Coaches',
        'Engraved Titanium YARD 300 Plaque',
        'Gourmet Athletic Nutrition & Lounge'
      ],
      es: [
        'Asientos VIP en primera fila con hospitalidad',
        'Masterclass privada con los entrenadores fundadores',
        'Placa de titanio YARD 300 grabada y numerada',
        'Lounge VIP con nutrición atlética gourmet'
      ],
      fr: [
        'Places d’honneur premier rang avec hospitalité',
        'Masterclass privée avec les coachs fondateurs',
        'Plaque commémorative en titane gravée YARD 300',
        'Lounge gastronomique de nutrition sportive'
      ],
      ar: [
        'مقاعد الصف الأول المباشر مع ضيافة المنصة',
        'ماستركلاس خاص مع المدربين المؤسسين',
        'درع تذكاري محفور ومرقم من التيتانيوم',
        'بوفيه تغذية رياضية متكامل وصالة VIP'
      ]
    },
    image: '/images/ticket_vip_showdown.jpg'
  }
];

interface ArenaZone {
  id: 'ringside' | 'lower' | 'paddock' | 'broadcast';
  label: { en: string; es: string; fr: string; ar: string };
  distance: string;
  capacity: string;
  telemetry: { en: string; es: string; fr: string; ar: string };
  desc: { en: string; es: string; fr: string; ar: string };
}

const ARENA_ZONES: ArenaZone[] = [
  {
    id: 'ringside',
    label: { en: 'Ringside VIP', es: 'Ringside VIP', fr: 'Ringside VIP', ar: 'الصف الأول VIP' },
    distance: '2.5 m',
    capacity: '40 Seats',
    telemetry: {
      en: 'HUD Wristband + Acoustic Feed',
      es: 'Pulsera HUD + Audio Táctico',
      fr: 'Bracelet HUD + Flux Acoustique',
      ar: 'سوار HUD + بث صوتي محيطي'
    },
    desc: {
      en: 'Unobstructed mat-level view directly alongside corner coaches and medical ring staff.',
      es: 'Visión directa a ras de tatami junto a entrenadores y equipo médico del combate.',
      fr: 'Vue directe au niveau du ring aux côtés des coachs et de l’équipe médicale.',
      ar: 'رؤية مباشرة على مستوى الحلبة بجانب زوايا المدربين والكادر الطبي.'
    }
  },
  {
    id: 'lower',
    label: { en: 'Champion Bowl', es: 'Grada Dorada', fr: 'Tribune Or', ar: 'المدرج الذهبي' },
    distance: '9 m',
    capacity: '180 Seats',
    telemetry: {
      en: 'Live Jumbotron ACWR Matrix',
      es: 'Matriz ACWR en Pantalla Gigante',
      fr: 'Matrice ACWR Écran Géant',
      ar: 'شاشات عملاقة لمؤشرات ACWR'
    },
    desc: {
      en: 'Elevated panoramic bowl angled at 24° for crystal oversight across all functional obstacle lanes.',
      es: 'Grada panorámica a 24° con visión total de todos los carriles de obstáculos y desafíos.',
      fr: 'Tribune panoramique inclinée à 24° couvrant l’ensemble des couloirs d’épreuves.',
      ar: 'مدرج بانورامي مرتفع بزاوية 24° يكشف كامل مسارات الحلبة والعقبات.'
    }
  },
  {
    id: 'paddock',
    label: { en: 'Athlete Floor', es: 'Pista Atletas', fr: 'Piste Athlètes', ar: 'أرضية المتنافسين' },
    distance: '0 m',
    capacity: '300 Slots',
    telemetry: {
      en: 'Live Chest/Ring Biometrics',
      es: 'Biometría en Vivo Pecho/Anillo',
      fr: 'Biométrie Direct Bague/Bande',
      ar: 'نقل حي لنبض الصدر والخاتم'
    },
    desc: {
      en: 'Direct competition lane access with heated calibration zones and post-heat contrast recovery.',
      es: 'Acceso directo a carriles de competición con zonas de activación y recuperación térmica.',
      fr: 'Accès direct aux couloirs avec zones de calibration et récupération contrastée.',
      ar: 'وصول مباشر إلى مسار المنافسة مع مناطق الإحماء وحمامات الاستشفاء بعد الجولات.'
    }
  },
  {
    id: 'broadcast',
    label: { en: 'Global 4K Stream', es: 'Streaming 4K', fr: 'Stream 4K Mondial', ar: 'البث العالمي 4K' },
    distance: 'Remote',
    capacity: 'Unlimited',
    telemetry: {
      en: 'Multi-Cam 60FPS + Telemetry HUD',
      es: 'Multi-Cámara 60FPS + HUD en Vivo',
      fr: 'Multi-Cam 60FPS + HUD Télémétrie',
      ar: 'كاميرات متعددة 60FPS + بيانات حية'
    },
    desc: {
      en: 'Switch dynamically between mat cams, coach corner audio, and real-time heart-rate overlays.',
      es: 'Alterna entre cámaras de tatami, audio de esquina y pulso cardíaco en tiempo real.',
      fr: 'Basculez entre caméras au sol, audio des coins et superposition cardiaque en direct.',
      ar: 'التبديل المباشر بين الكاميرات وصوت المدربين مع قراءات نبض القلب على الشاشة.'
    }
  }
];

export const TicketsEventsHub: React.FC<TicketsEventsHubProps> = ({
  currentLang = 'en',
  onBackToHome,
  onProceedToCheckout
}) => {
  const isAr = currentLang === 'ar';
  const [selectedZoneId, setSelectedZoneId] = useState<ArenaZone['id']>('ringside');
  const [remindedIds, setRemindedIds] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeZone = ARENA_ZONES.find((z) => z.id === selectedZoneId) || ARENA_ZONES[0];

  const getLangKey = (): 'en' | 'es' | 'fr' | 'ar' => {
    if (currentLang === 'ar' || currentLang === 'es' || currentLang === 'fr') return currentLang;
    return 'en';
  };
  const lKey = getLangKey();

  const handleToggleAlert = (event: TournamentEvent) => {
    soundFX.playSuccess();
    setRemindedIds((prev) => ({ ...prev, [event.id]: true }));
    if (event.status === 'opens_jan_5') {
      setStatusMessage(
        tr(currentLang, {
          en: 'Alert confirmed for the 10-Challenge Nature Championship — Ticket sales open January 5, 2027.',
          es: 'Alerta confirmada para el Campeonato de 10 Desafíos en Naturaleza — Venta abre el 5 de enero de 2027.',
          fr: 'Alerte activée pour les 10 Défis Nature — Ouverture des billets le 5 janvier 2027.',
          ar: 'تم ضبط التذكير بنجاح لبطولة التحديات العشرة في الطبيعة — بيع التذاكر في 5 يناير 2027.'
        })
      );
    } else {
      setStatusMessage(
        tr(currentLang, {
          en: `Early-release alert active for ${event.title.en} (Season 2027).`,
          es: `Alerta anticipada activa para ${event.title.es} (Temporada 2027).`,
          fr: `Alerte prioritaire active pour ${event.title.fr} (Saison 2027).`,
          ar: `تم تسجيلك في قائمة التنبيه المبكر لبطولة ${event.title.ar} (موسم 2027).`
        })
      );
    }
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className={`min-h-screen pt-24 pb-16 bg-[#07080D] text-white relative w-full max-w-full overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 space-y-8">
        {/* Top Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="px-4 py-2 rounded-lg bg-[#0B0E16] hover:bg-white text-white hover:text-[#07080D] border border-white/[0.1] text-xs font-semibold cursor-pointer transition-colors"
            >
              {tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}
            </button>
          )}
          <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>
              {tr(currentLang, {
                en: 'OFFICIAL CHAMPIONSHIPS · TICKETING DESK',
                es: 'CAMPEONATOS OFICIALES · TAQUILLA',
                fr: 'CHAMPIONNATS OFFICIELS · BILLETTERIE',
                ar: 'بوابة التذاكر والبطولات الرسمية'
              })}
            </span>
          </span>
        </div>

        {/* Hero Schedule Summary */}
        <div className="rounded-2xl bg-[#0B0E16] border border-white/[0.08] p-5 sm:p-7 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                {tr(currentLang, {
                  en: 'Championship Schedule & Passes: ',
                  es: 'Calendario y Pases de Campeonato: ',
                  fr: 'Calendrier & Pass Championnat : ',
                  ar: 'جدول بطولات وحلبات '
                })}
                <span className="text-[#D4AF37]">YARD 300</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {tr(currentLang, {
                  en: 'Official Release Schedule: Ticket sales for the 10-Challenge Nature Endurance & Fitness Championship open January 5, 2027. Championships in Bangkok & Siem Reap (2027) have not opened for sale yet.',
                  es: 'Calendario oficial: la venta de entradas para el Campeonato de 10 Desafíos de Resistencia en la Naturaleza abre el 5 de enero de 2027. Bangkok y Siem Reap (2027) aún no abren venta.',
                  fr: 'Calendrier officiel : ouverture de la billetterie pour le Championnat des 10 Défis Nature le 5 janvier 2027. Bangkok et Siem Reap (2027) ouvriront ultérieurement.',
                  ar: 'تنويه رسمي: موعد فتح بيع تذاكر بطولة التحديات العشرة في الطبيعة (التي تضم 10 تحديات لاختبار القدرة واللياقة في الطبيعة) هو 5 يناير 2027. أما بطولات بانكوك وسيم ريب لعام 2027 فلم تُفتح للبيع بعد.'
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#07080D] border border-[#10B981]/35">
                <span className="text-[10px] text-slate-400 block">
                  {tr(currentLang, { en: '10 NATURE TRIALS', es: '10 DESAFÍOS NATURA', fr: '10 DÉFIS NATURE', ar: '10 تحديات بالطبيعة' })}
                </span>
                <span className="text-sm font-bold text-[#10B981]">
                  {tr(currentLang, { en: 'Opens Jan 5, 2027', es: 'Abre 5 Ene 2027', fr: 'Ouvre 5 Jan 2027', ar: 'يفتح 5 يناير 2027' })}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#07080D] border border-white/[0.1]">
                <span className="text-[10px] text-slate-400 block">2027 CIRCUIT</span>
                <span className="text-sm font-bold text-[#D4AF37]">
                  {tr(currentLang, { en: 'Pre-Release', es: 'Prelanzamiento', fr: 'Pré-Sortie', ar: 'قيد الطرح' })}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Arena Vantage Blueprint Bar */}
          <div className="pt-4 border-t border-white/[0.07] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {tr(currentLang, {
                  en: 'ARENA VANTAGE & TELEMETRY ZONES',
                  es: 'ZONAS DE VISIÓN Y TELEMETRÍA',
                  fr: 'ZONES DE VISION & TÉLÉMÉTRIE',
                  ar: 'استعراض مناطق الحلبة والرؤية'
                })}
              </span>
              <div className="flex flex-wrap gap-1.5 bg-[#07080D] p-1 rounded-xl border border-white/[0.08]">
                {ARENA_ZONES.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => {
                      soundFX.playButtonClick();
                      setSelectedZoneId(z.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      selectedZoneId === z.id
                        ? 'bg-[#D4AF37] text-[#07080D]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {z.label[lKey]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#07080D] border border-white/[0.06] text-xs">
              <div className="md:col-span-2">
                <span className="font-bold text-white block mb-1">{activeZone.label[lKey]}</span>
                <p className="text-slate-400 leading-relaxed">{activeZone.desc[lKey]}</p>
              </div>
              <div className="font-mono tabular-nums">
                <span className="text-[10px] text-slate-500 block">
                  {tr(currentLang, { en: 'PROXIMITY / CAP', es: 'DISTANCIA / AFORO', fr: 'DISTANCE / CAP.', ar: 'القرب / السعة' })}
                </span>
                <span className="text-[#D4AF37] font-bold">{activeZone.distance} · {activeZone.capacity}</span>
              </div>
              <div className="font-mono">
                <span className="text-[10px] text-slate-500 block">
                  {tr(currentLang, { en: 'TELEMETRY FEED', es: 'FLUJO BIOMÉTRICO', fr: 'FLUX TÉLÉMÉTRIQUE', ar: 'التغطية الحيوية' })}
                </span>
                <span className="text-[#10B981] font-semibold">{activeZone.telemetry[lKey]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Banner */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] font-semibold text-xs text-center">
            ✓ {statusMessage}
          </div>
        )}

        {/* 3 Boarding-Pass Style Championship Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {TOURNAMENT_EVENTS.map((event) => {
            const isReminded = Boolean(remindedIds[event.id]);
            const isJan5 = event.status === 'opens_jan_5';

            return (
              <div
                key={event.id}
                className="rounded-2xl bg-[#0B0E16] border border-white/[0.08] hover:border-[#D4AF37]/45 transition-colors overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={event.image}
                      alt={event.title[lKey]}
                      onError={handleImageError}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16] via-[#0B0E16]/30 to-transparent" />

                    <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#D4AF37] font-bold bg-[#07080D]/85 px-2.5 py-1 rounded-md border border-white/10">
                        {event.code}
                      </span>
                      <span className="text-white bg-[#07080D]/85 px-2.5 py-1 rounded-md border border-white/10">
                        {event.tier}
                      </span>
                    </div>

                    <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs font-mono">
                      <span className={isJan5 ? 'text-[#10B981] font-semibold' : 'text-[#D4AF37] font-semibold'}>
                        {isJan5
                          ? tr(currentLang, { en: 'Opens Jan 5, 2027', es: 'Abre 5 Ene 2027', fr: 'Ouvre 5 Jan 2027', ar: 'تفتح 5 يناير 2027' })
                          : tr(currentLang, { en: '2027 · Not Open Yet', es: '2027 · Aún Cerrado', fr: '2027 · Pas Encore Ouvert', ar: 'موسم 2027 · مغلق حالياً' })}
                      </span>
                      <span className="text-slate-300 tabular-nums">{event.date[lKey]}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{event.location[lKey]}</span>
                        <span>·</span>
                        <span>{event.time}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug">{event.title[lKey]}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{event.tagline[lKey]}</p>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-white/[0.06]">
                      {event.perks[lKey].map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="relative border-t border-dashed border-white/[0.16] bg-[#07080D]/80 p-5 space-y-3">
                  <span className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-[#07080D] border border-white/[0.08]" />
                  <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-[#07080D] border border-white/[0.08]" />

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        {tr(currentLang, { en: 'ESTIMATED PASS RATE', es: 'TARIFA ESTIMADA', fr: 'TARIF ESTIMÉ', ar: 'السعر المقدر عند الطرح' })}
                      </span>
                      <div className="flex items-baseline gap-2 font-mono tabular-nums">
                        <span className="text-2xl font-bold text-[#D4AF37]" dir="ltr">${event.price}</span>
                        {event.originalPrice && (
                          <span className="text-xs line-through text-slate-500" dir="ltr">${event.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <QrCode className="w-7 h-7 text-slate-400" />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">{event.statusNotice[lKey]}</p>

                  <button
                    type="button"
                    onClick={() => handleToggleAlert(event)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      isReminded
                        ? 'bg-[#10B981] text-[#07080D]'
                        : isJan5
                        ? 'bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080D]'
                        : 'bg-[#141824] hover:bg-[#1E2436] text-white border border-white/[0.12]'
                    }`}
                  >
                    {isReminded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{tr(currentLang, { en: 'Alert Active', es: 'Alerta Activa', fr: 'Alerte Active', ar: 'تم تفعيل التنبيه بنجاح' })}</span>
                      </>
                    ) : isJan5 ? (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>
                          {tr(currentLang, {
                            en: 'Opens Jan 5, 2027 — Remind Me',
                            es: 'Abre 5 Ene 2027 — Recordarme',
                            fr: 'Ouvre 5 Jan 2027 — M’alerter',
                            ar: 'يفتح 5 يناير 2027 — ذكّرني'
                          })}
                        </span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        <span>
                          {tr(currentLang, {
                            en: 'Notify Me at Launch',
                            es: 'Notificarme en Apertura',
                            fr: 'M’alerter au Lancement',
                            ar: '2027 لم يُفتح بعد — أبلغني'
                          })}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global 4K Livestream Passes */}
        <div className="rounded-2xl bg-[#0B0E16] border border-white/[0.08] p-5 md:p-7 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5" />
                <span>{tr(currentLang, { en: 'GLOBAL 4K 60FPS BROADCAST', es: 'TRANSMISIÓN MUNDIAL 4K 60FPS', fr: 'DIFFUSION MONDIALE 4K 60FPS', ar: 'البث المباشر 4K Ultra HD' })}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {tr(currentLang, {
                  en: 'Stream Every Championship Bout Live in 4K',
                  es: 'Sigue Cada Combate y Desafío en Vivo en 4K',
                  fr: 'Suivez Chaque Épreuve et Combat en Direct 4K',
                  ar: 'تابع نزالات الحلبة مباشرة من أي مكان'
                })}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {tr(currentLang, {
                  en: 'Multi-angle mat cameras with corner coach feeds and real-time biometric overlays.',
                  es: 'Cámaras multiángulo con audio de entrenadores y telemetría cardíaca en pantalla.',
                  fr: 'Caméras multi-angles, flux audio des coachs et biométrie en temps réel.',
                  ar: 'تغطية تفاعلية متعددة الزوايا مع قراءات نبض القلب وأوزان اللكمات مباشرة على الشاشة.'
                })}
              </p>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#07080D] border border-white/[0.08] text-xs font-mono shrink-0">
              <Tv className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <span className="block font-bold text-white">4K 60FPS HDR</span>
                <span className="text-slate-400">Web · iOS · Smart TV</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Single Match PPV ($10) */}
            <div className="p-5 rounded-xl bg-[#07080D] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300 font-bold">SINGLE MATCH PPV</span>
                  <span className="text-slate-500">48h Replay</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {tr(currentLang, { en: 'Single Match Stream Pass', es: 'Pase de Transmisión Individual', fr: 'Pass Diffusion Match Unique', ar: 'تذكرة البث لمباراة واحدة' })}
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{tr(currentLang, { en: 'Full HD 60fps livestream access', es: 'Acceso Full HD 60fps en vivo', fr: 'Accès direct Full HD 60fps', ar: 'بث Full HD مباشر للنزال المختار' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{tr(currentLang, { en: '48-hour on-demand replay', es: 'Repetición bajo demanda 48h', fr: 'Replay à la demande 48h', ar: 'إعادة مشاهدة لمدة 48 ساعة' })}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between">
                <span className="text-2xl font-bold font-mono tabular-nums text-white" dir="ltr">$10</span>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playSuccess();
                    if (onProceedToCheckout) onProceedToCheckout('Single Match Stream Pass', 10);
                  }}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-[#D4AF37] text-[#07080D] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MonitorPlay className="w-4 h-4" />
                  <span>{tr(currentLang, { en: 'Get Match Pass ($10)', es: 'Obtener Pase ($10)', fr: 'Pass Match ($10)', ar: 'حجز البث ($10)' })}</span>
                </button>
              </div>
            </div>

            {/* Full Championship Pass ($120) */}
            <div className="p-5 rounded-xl bg-[#07080D] border border-[#D4AF37]/45 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#D4AF37] font-bold">FULL TOURNAMENT PASS</span>
                  <span className="text-[#10B981]">{tr(currentLang, { en: 'Save 57%', es: 'Ahorra 57%', fr: '-57%', ar: 'وفر 57%' })}</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {tr(currentLang, { en: 'All-Access Championship Pass', es: 'Pase Completo de Campeonato 4K', fr: 'Pass Championnat Accès Total', ar: 'تذكرة البطولة الكاملة 4K' })}
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{tr(currentLang, { en: '4K Ultra HD for every tournament bout', es: '4K Ultra HD en todos los combates', fr: '4K Ultra HD sur tout le tournoi', ar: 'بث 4K لكافة النزالات والتصفيات' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{tr(currentLang, { en: 'Lifetime archive + backstage warmup feeds', es: 'Archivo permanente + backstage en vivo', fr: 'Archive à vie + coulisses d’échauffement', ar: 'أرشيف دائم وكواليس غرف الإحماء' })}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between">
                <div className="flex items-baseline gap-2 font-mono tabular-nums" dir="ltr">
                  <span className="text-2xl font-bold text-[#D4AF37]">$120</span>
                  <span className="text-xs line-through text-slate-500">$280</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playSuccess();
                    if (onProceedToCheckout) onProceedToCheckout('Full Tournament Stream Pass', 120);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080D] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Tv className="w-4 h-4" />
                  <span>{tr(currentLang, { en: 'Get Full Pass ($120)', es: 'Pase Completo ($120)', fr: 'Pass Intégral ($120)', ar: 'حجز البطولة ($120)' })}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>
              {tr(currentLang, {
                en: 'Every badge uses dynamic serialized anti-scalp QR encryption validated directly at arena entry gates.',
                es: 'Cada pase usa cifrado QR dinámico anti-reventa validado directamente en puertas del recinto.',
                fr: 'Chaque billet utilise un QR crypté anti-fraude validé directement aux portes de l’arène.',
                ar: 'جميع التذاكر مشفرة برمز QR متجدد يمنع التزوير وإعادة البيع غير المصرح به عند البوابات.'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsEventsHub;
