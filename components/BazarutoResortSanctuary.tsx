import React, { useState, useEffect } from 'react';
import {
  Palmtree,
  Waves,
  Calendar,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Send,
  Building2,
  Utensils,
  Dumbbell,
  Stethoscope,
  Crown,
  Maximize2,
  Film,
  ShoppingBag,
  Store,
  PenTool,
  ShoppingCart,
  Music,
  Gamepad2,
  Stars,
  Moon
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import {
  YARD_BAZARUTO_VILLA_IMAGE,
  YARD_BAZARUTO_VILLA_BEDROOM_IMAGE,
  YARD_BAZARUTO_VILLA_LIVING_IMAGE,
  YARD_BAZARUTO_VILLA_BATHROOM_IMAGE,
  YARD_BAZARUTO_VILLA_DINING_IMAGE,
  YARD_BAZARUTO_ENTERTAINMENT_MALL_IMAGE
} from '../constants';
import { emailService } from '../services/emailService';
import { OwnerConfigService, DEFAULT_RESORT_CONFIG } from '../services/ownerConfigService';
import { KineticMediaStage, KineticSlide } from './KineticMediaStage';

interface BazarutoResortSanctuaryProps {
  currentLang?: Language;
  onExploreEvents?: () => void;
}

interface ConciseFacility {
  id: string;
  num: string;
  titleAr: string;
  titleEn: string;
  titleEs: string;
  titleFr: string;
  summaryAr: string;
  summaryEn: string;
  summaryEs: string;
  summaryFr: string;
  badgeAr: string;
  badgeEn: string;
  badgeEs: string;
  badgeFr: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const CORE_FACILITIES: ConciseFacility[] = [
  {
    id: 'hospital',
    num: '01',
    titleAr: 'مستشفى الطب الرياضي والتأهيل النفسي',
    titleEn: 'Sports Medicine & Mental Wellness Hospital',
    titleEs: 'Hospital de Medicina Deportiva y Bienestar',
    titleFr: 'Hôpital de Médecine du Sport & Bien-être',
    summaryAr: 'تشخيص وتأهيل الإصابات الرياضية وعلاج الإجهاد والاكتئاب.',
    summaryEn: 'Orthopedic injury rehab and dedicated athlete mental restoration.',
    summaryEs: 'Rehabilitación de lesiones ortopédicas y bienestar mental del atleta.',
    summaryFr: 'Rééducation orthopédique et restauration mentale dédiée aux athlètes.',
    badgeAr: 'رعاية متخصصة',
    badgeEn: 'CLINICAL LAB',
    badgeEs: 'LAB CLÍNICO',
    badgeFr: 'CLINIQUE SPORT',
    icon: Stethoscope,
    accent: '#10B981'
  },
  {
    id: 'villas',
    num: '02',
    titleAr: '10 فيلل شاطئية مستقلة',
    titleEn: '10 Standalone Oceanfront Villas',
    titleEs: '10 Villas Privadas Frente al Mar',
    titleFr: '10 Villas Privées en Front de Mer',
    summaryAr: 'تصميم خشب طبيعي وزجاج بانورامي مع مسبح خاص.',
    summaryEn: 'Curved timber & panoramic glass with private plunge pools.',
    summaryEs: 'Madera curva, cristal panorámico y piscina privada inmersiva.',
    summaryFr: 'Bois courbé, verre panoramique et bassin privé face à l’océan.',
    badgeAr: '10 فيلل',
    badgeEn: '10 VILLAS',
    badgeEs: '10 VILLAS',
    badgeFr: '10 VILLAS',
    icon: Palmtree,
    accent: '#D4AF37'
  },
  {
    id: 'hotel',
    num: '03',
    titleAr: 'فندق بوتيكي · 30 غرفة و 4 أجنحة VIP',
    titleEn: 'Boutique Hotel · 30 Rooms & 4 VIP Suites',
    titleEs: 'Hotel Boutique · 30 Habitaciones y 4 Suites VIP',
    titleFr: 'Hôtel Boutique · 30 Chambres & 4 Suites VIP',
    summaryAr: 'إطلالات مباشرة على المحيط الهندي وخدمة ضيافة 24/7.',
    summaryEn: 'Panoramic Indian Ocean views with 24/7 private concierge.',
    summaryEs: 'Vistas panorámicas al Océano Índico con conserjería privada 24/7.',
    summaryFr: 'Vues panoramiques sur l’Océan Indien avec conciergerie 24h/24.',
    badgeAr: '34 وحدة',
    badgeEn: '30 + 4 VIP',
    badgeEs: '30 + 4 VIP',
    badgeFr: '30 + 4 VIP',
    icon: Building2,
    accent: '#D4AF37'
  },
  {
    id: 'pool',
    num: '04',
    titleAr: 'مسبح البحيرة وقنوات السباحة',
    titleEn: 'Lagoon Pool & Leisure Waterways',
    titleEs: 'Piscina Laguna y Canales',
    titleFr: 'Piscine Lagon & Bassins',
    summaryAr: 'قنوات مائية انسيابية، كبائن شاطئية، وأحواض استشفاء.',
    summaryEn: 'Meandering swim channels, private cabanas & contrast plunges.',
    summaryEs: 'Canales de nado fluidos, cabañas privadas e inmersión térmica.',
    summaryFr: 'Canaux de nage fluides, cabanas privées et bains contrastés.',
    badgeAr: 'مسبح أيقوني',
    badgeEn: 'LAGOON POOL',
    badgeEs: 'LAGUNA VIP',
    badgeFr: 'LAGON VIP',
    icon: Waves,
    accent: '#10B981'
  },
  {
    id: 'dining',
    num: '05',
    titleAr: '4 مطاعم عالمية فاخرة',
    titleEn: '4 Signature Global Restaurants',
    titleEs: '4 Restaurantes Internacionales',
    titleFr: '4 Tables Gastronomiques',
    summaryAr: 'مأكولات بحرية طازجة وتغذية عضوية (تُعلن الأسماء لاحقاً).',
    summaryEn: 'Coastal seafood & organic fine dining (concepts TBA).',
    summaryEs: 'Alta cocina marina y nutrición orgánica de autor (próximamente).',
    summaryFr: 'Cuisine côtière raffinée et nutrition organique (bientôt dévoilé).',
    badgeAr: '4 مطاعم',
    badgeEn: 'FINE DINING',
    badgeEs: 'GASTRONOMÍA',
    badgeFr: 'GASTRONOMIE',
    icon: Utensils,
    accent: '#D4AF37'
  },
  {
    id: 'gym',
    num: '06',
    titleAr: 'صالة التدريب القاسي والقتال على الرمال',
    titleEn: 'Hardcore Sand & Combat Gym Wing',
    titleEs: 'Gimnasio de Combate y Arena',
    titleFr: 'Complexe Combat & Sable',
    summaryAr: 'في الجزء الآخر من الجزيرة؛ مخصصة للتدريبات القاسية على الرمال والألعاب القتالية.',
    summaryEn: 'On the island’s opposite wing for brutal sand conditioning & combat sports.',
    summaryEs: 'En el ala opuesta de la isla para acondicionamiento extremo en arena y combate.',
    summaryFr: 'À l’autre extrémité de l’île pour le conditionnement sur sable et le combat.',
    badgeAr: 'قتال ورمال',
    badgeEn: 'SAND & COMBAT',
    badgeEs: 'ARENA Y COMBATE',
    badgeFr: 'SABLE & COMBAT',
    icon: Dumbbell,
    accent: '#10B981'
  }
];

const ENTERTAINMENT_ZONES = [
  {
    id: 'mall',
    icon: ShoppingBag,
    titleAr: 'مول بوتيكي (+20 براند عالمي)',
    titleEn: 'Boutique Mall (20+ Global Brands)',
    titleEs: 'Galería Boutique (+20 Marcas)',
    titleFr: 'Galerie Boutique (+20 Marques)'
  },
  {
    id: 'market',
    icon: ShoppingCart,
    titleAr: 'سوبرماركت عضوي ومخبز',
    titleEn: 'Organic Supermarket & Deli',
    titleEs: 'Supermercado Orgánico y Delicatessen',
    titleFr: 'Supermarché Bio & Épicerie Fine'
  },
  {
    id: 'restaurants',
    icon: Utensils,
    titleAr: '4 مطاعم عالمية شاطئية',
    titleEn: '4 Global Waterfront Restaurants',
    titleEs: '4 Restaurantes Frente al Mar',
    titleFr: '4 Restaurants en Front de Mer'
  },
  {
    id: 'gym',
    icon: Dumbbell,
    titleAr: 'جيم رياضي بمواصفات عالمية',
    titleEn: 'Global Standards Athletic Gym',
    titleEs: 'Gimnasio Atlético Internacional',
    titleFr: 'Complexe Sportif de Haut Niveau'
  },
  {
    id: 'cinema',
    icon: Film,
    titleAr: 'سينما بوتيكية 4K',
    titleEn: '4K Boutique Acoustic Cinema',
    titleEs: 'Cine Acústico Boutique 4K',
    titleFr: 'Cinéma Acoustique Boutique 4K'
  },
  {
    id: 'theater',
    icon: Music,
    titleAr: 'مسرح العروض البحري المفتوح',
    titleEn: 'Open-Air Ocean Stage Theater',
    titleEs: 'Anfiteatro Escénico al Aire Libre',
    titleFr: 'Théâtre Scénique Face à l’Océan'
  },
  {
    id: 'pool',
    icon: Waves,
    titleAr: 'المسبح الأيقوني المفتوح',
    titleEn: 'Iconic Central Horizon Pool',
    titleEs: 'Piscina Horizonte Central Icónica',
    titleFr: 'Piscine Horizon Centrale Iconique'
  },
  {
    id: 'arcade',
    icon: Gamepad2,
    titleAr: 'صالة الألعاب الترفيهية و VR',
    titleEn: 'Interactive Gaming & VR Arcade',
    titleEs: 'Zona Interactiva de Juegos y VR',
    titleFr: 'Espace Jeux Interactifs & VR'
  },
  {
    id: 'rooftop',
    icon: Store,
    titleAr: 'روف كافيه بانورامي 360°',
    titleEn: '360° Panoramic Rooftop Café',
    titleEs: 'Café Azotea Panorámico 360°',
    titleFr: 'Café Rooftop Panoramique 360°'
  },
  {
    id: 'stargazing',
    icon: Stars,
    titleAr: 'مرصد النجوم وتراس الاسترخاء',
    titleEn: 'Stargazing & Relaxation Terrace',
    titleEs: 'Observatorio Estelar y Terraza Zen',
    titleFr: 'Observatoire Stellaire & Terrasse Zen'
  }
];

export const BazarutoResortSanctuary: React.FC<BazarutoResortSanctuaryProps> = ({
  currentLang = 'en'
}) => {
  const isAr = currentLang === 'ar';

  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [selectedFacilityForModal, setSelectedFacilityForModal] = useState<ConciseFacility | null>(null);
  const [activeVillaImage, setActiveVillaImage] = useState<number>(0);
  const [isVillaGalleryModalOpen, setIsVillaGalleryModalOpen] = useState(false);
  const [resortCfg, setResortCfg] = useState(() => OwnerConfigService.getConfig().resort);

  useEffect(() => {
    return OwnerConfigService.subscribe((cfg) => {
      setResortCfg(cfg.resort);
    });
  }, []);

  const [athleteName, setAthleteName] = useState('');
  const [athleteEmail, setAthleteEmail] = useState('');
  const [athleteDiscipline, setAthleteDiscipline] = useState('Combat Sports / MMA & Boxing');
  const [preferredWindow, setPreferredWindow] = useState('October 2027 (Grand Opening)');
  const [healthAndInjuryNotes, setHealthAndInjuryNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const getFacilityTitle = (fac: ConciseFacility) =>
    tr(currentLang, { en: fac.titleEn, es: fac.titleEs, fr: fac.titleFr, ar: fac.titleAr });

  const getFacilitySummary = (fac: ConciseFacility) =>
    tr(currentLang, { en: fac.summaryEn, es: fac.summaryEs, fr: fac.summaryFr, ar: fac.summaryAr });

  const getFacilityBadge = (fac: ConciseFacility) =>
    tr(currentLang, { en: fac.badgeEn, es: fac.badgeEs, fr: fac.badgeFr, ar: fac.badgeAr });

  const hasCustomTitle = resortCfg.titleEn !== DEFAULT_RESORT_CONFIG.titleEn;
  const hasCustomOverview = resortCfg.overviewEn !== DEFAULT_RESORT_CONFIG.overviewEn;

  const villaPhotos = [
    {
      id: 'exterior',
      src: YARD_BAZARUTO_VILLA_IMAGE,
      tag: tr(currentLang, { en: 'EXTERIOR & POOL', es: 'EXTERIOR Y PISCINA', fr: 'EXTÉRIEUR & PISCINE', ar: 'الواجهة والمسبح' }),
      label: tr(currentLang, {
        en: 'Fluid Wood & Glass Facade with Lagoon Plunge Pool',
        es: 'Fachada de Madera y Cristal con Piscina Privada en Laguna',
        fr: 'Façade Bois & Verre avec Bassin Privé sur le Lagon',
        ar: 'الواجهة الخارجية والمسبح الخاص فوق اللاغون'
      })
    },
    {
      id: 'bedroom',
      src: YARD_BAZARUTO_VILLA_BEDROOM_IMAGE,
      tag: tr(currentLang, { en: 'MASTER SUITE', es: 'SUITE PRINCIPAL', fr: 'SUITE PARENTALE', ar: 'غرفة النوم' }),
      label: tr(currentLang, {
        en: 'Master Ocean Suite with Bent-Teak Ceiling',
        es: 'Suite Principal Frente al Mar con Techo de Teca',
        fr: 'Suite Océan avec Plafond en Teck Cintré',
        ar: 'جناح النوم الرئيسي بإطلالة المحيط'
      })
    },
    {
      id: 'living',
      src: YARD_BAZARUTO_VILLA_LIVING_IMAGE,
      tag: tr(currentLang, { en: 'LIVING SALON', es: 'SALÓN PRINCIPAL', fr: 'SALON DE VIE', ar: 'منطقة المعيشة' }),
      label: tr(currentLang, {
        en: 'Curved Living Lounge Overlooking Horizon',
        es: 'Salón Curvo Abierto con Vista al Horizonte',
        fr: 'Salon Panoramique Courbé Face à l’Horizon',
        ar: 'صالون الجلوس المقوس المطل على المسبح'
      })
    },
    {
      id: 'dining',
      src: YARD_BAZARUTO_VILLA_DINING_IMAGE,
      tag: tr(currentLang, { en: 'DINING PAVILION', es: 'PABELLÓN GASTRONÓMICO', fr: 'PAVILLON REPAS', ar: 'جناح الطعام' }),
      label: tr(currentLang, {
        en: 'Oceanfront Alfresco Dining Pavilion',
        es: 'Pabellón de Comedor al Aire Libre Frente al Océano',
        fr: 'Pavillon de Restauration en Plein Air Face à l’Océan',
        ar: 'منطقة الطعام الشاطئية بأقواس خشبية'
      })
    },
    {
      id: 'bathroom',
      src: YARD_BAZARUTO_VILLA_BATHROOM_IMAGE,
      tag: tr(currentLang, { en: 'SPA BATHROOM', es: 'BAÑO SPA PRIVADO', fr: 'SALLE DE BAIN SPA', ar: 'السبا والحمام' }),
      label: tr(currentLang, {
        en: 'Wellness Spa Suite & Stone Soaking Tub',
        es: 'Suite Spa de Bienestar con Bañera de Piedra Natural',
        fr: 'Suite Spa Bien-être & Baignoire en Pierre Naturelle',
        ar: 'حمام السبا الخاص بالحوض الحجري الطبيعي'
      })
    }
  ];

  const allLightboxPhotos = [
    ...villaPhotos.map((p) => ({
      src: p.src,
      title: p.label
    })),
    {
      src: YARD_BAZARUTO_ENTERTAINMENT_MALL_IMAGE,
      title: tr(currentLang, {
        en: 'Grand Lifestyle & Entertainment Promenade',
        es: 'Gran Paseo Comercial y de Entretenimiento Costero',
        fr: 'Grande Promenade Commerciale et de Loisirs',
        ar: 'منطقة الترفيه والمول الساحلي المتكامل'
      })
    }
  ];

  const handleOpenWaitlist = (facility?: ConciseFacility) => {
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
      await emailService.sendVerificationCode(athleteEmail, athleteName, `BAZARUTO-${code}`, undefined, currentLang);
    } catch {}

    soundFX.playPowerUp();
    setFormSubmitting(false);
    setBookingConfirmed(true);
  };

  const currentPhoto = villaPhotos[activeVillaImage] || villaPhotos[0];

  return (
    <section id="bazaruto-sanctuary" className="relative w-full py-10 overflow-hidden">
      <div className="relative z-10 space-y-8">

        {/* 1. Header + Overview + Architectural Signature */}
        <div className={`space-y-4 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/35 text-[#10B981] text-[11px] font-mono font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {isAr
                  ? resortCfg.openingDateAr
                  : tr(currentLang, {
                      en: resortCfg.openingDateEn,
                      es: 'GRAN APERTURA · OCTUBRE 2027',
                      fr: 'GRANDE OUVERTURE · OCTOBRE 2027'
                    })}
              </span>
            </span>

            <span className="px-3 py-1 rounded-full bg-[#0C0E14] border border-white/[0.08] text-slate-300 text-[11px] font-mono inline-flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span>
                {tr(currentLang, {
                  en: 'Bazaruto Archipelago, Indian Ocean',
                  es: 'Archipiélago de Bazaruto, Océano Índico',
                  fr: 'Archipel de Bazaruto, Océan Indien',
                  ar: 'أرخبيل بازاروتو، المحيط الهندي'
                })}
              </span>
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                {isAr ? (
                  <>
                    {resortCfg.titleAr}{' '}
                    <span className="text-[#D4AF37]">{resortCfg.subtitleHighlightAr}</span>
                  </>
                ) : hasCustomTitle ? (
                  <>
                    {resortCfg.titleEn}{' '}
                    <span className="text-[#D4AF37]">{resortCfg.subtitleHighlightEn}</span>
                  </>
                ) : (
                  <>
                    {tr(currentLang, {
                      en: 'YARD Bazaruto Sanctuary —',
                      es: 'Santuario YARD Bazaruto —',
                      fr: 'Sanctuaire YARD Bazaruto —'
                    })}{' '}
                    <span className="text-[#D4AF37]">
                      {tr(currentLang, {
                        en: 'Luxury Recovery & Coastal Hospitality',
                        es: 'Recuperación de Lujo y Hospitalidad Costera',
                        fr: 'Récupération de Luxe & Hospitalité Côtière'
                      })}
                    </span>
                  </>
                )}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {isAr
                  ? resortCfg.overviewAr
                  : hasCustomOverview
                  ? resortCfg.overviewEn
                  : tr(currentLang, {
                      en: resortCfg.overviewEn,
                      es: 'Un santuario costero en el Archipiélago de Bazaruto que abre en octubre de 2027: 10 villas privadas, hotel boutique, paseo de entretenimiento, piscina laguna, 4 restaurantes globales, gimnasio de combate en la arena y hospital especializado en medicina deportiva.',
                      fr: 'Un sanctuaire côtier dans l’Archipel de Bazaruto ouvrant en octobre 2027 : 10 villas privées, hôtel boutique, promenade de loisirs, piscine lagon, 4 restaurants internationaux, salle de combat sur sable et hôpital de médecine du sport.'
                    })}
              </p>

              {/* Inline Architectural Credit */}
              <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
                  <PenTool className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>
                    {tr(currentLang, {
                      en: 'Designed entirely by Chief Architect',
                      es: 'Diseñado íntegramente por el Arquitecto Principal',
                      fr: 'Conçu intégralement par l’Architecte Principal',
                      ar: 'المنتجع بالكامل من تصميم المعماري'
                    })}
                  </span>
                </span>
                <span className="font-mono font-bold text-[#D4AF37] tracking-wide" dir="ltr">
                  {resortCfg.architectName || 'Ayman .A. suwaidi'}
                </span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="text-[11px] font-mono text-slate-500">
                  {tr(currentLang, {
                    en: 'Architectural Signature',
                    es: 'Firma Arquitectónica',
                    fr: 'Signature Architecturale',
                    ar: 'التوقيع المعماري المعتمد'
                  })}
                </span>
              </div>
            </div>

            {/* Compact Scale Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
              {[
                {
                  val: tr(currentLang, { en: 'OCT 2027', es: 'OCT 2027', fr: 'OCT 2027', ar: 'أكتوبر 2027' }),
                  label: tr(currentLang, { en: 'Opening', es: 'Apertura', fr: 'Ouverture', ar: 'الافتتاح' }),
                  accent: '#10B981'
                },
                {
                  val: tr(currentLang, { en: '10 Villas', es: '10 Villas', fr: '10 Villas', ar: '10 فيلل' }),
                  label: tr(currentLang, { en: 'Ocean Villas', es: 'Villas Mar', fr: 'Villas Mer', ar: 'فيلل شاطئية' }),
                  accent: '#D4AF37'
                },
                {
                  val: '30 + 4 VIP',
                  label: tr(currentLang, { en: 'Hotel Suites', es: 'Suites Hotel', fr: 'Suites Hôtel', ar: 'فندق بوتيكي' }),
                  accent: '#D4AF37'
                },
                {
                  val: tr(currentLang, { en: 'Hospital', es: 'Hospital', fr: 'Hôpital', ar: 'مستشفى' }),
                  label: tr(currentLang, { en: 'Sports Med', es: 'Med. Deportiva', fr: 'Méd. Sport', ar: 'طب رياضي' }),
                  accent: '#10B981'
                }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 rounded-2xl bg-[#0C0E14] border border-white/[0.08] text-center"
                >
                  <span
                    className="text-sm font-bold font-mono block tabular-nums"
                    style={{ color: stat.accent }}
                    dir="ltr"
                  >
                    {stat.val}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Visual Pair: Coastal Panorama + Aerial Night View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="relative rounded-3xl overflow-hidden bg-[#0C0E14] border border-white/[0.08] group">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={resortCfg.heroPanoramaImage}
                alt="YARD Bazaruto Resort Sanctuary"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/25 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px]">
                <span className="px-3 py-1 rounded-full bg-[#07080C]/80 border border-white/15 text-slate-200 font-mono">
                  {tr(currentLang, {
                    en: 'COASTAL ARCHITECTURE',
                    es: 'ARQUITECTURA COSTERA',
                    fr: 'ARCHITECTURE CÔTIÈRE',
                    ar: 'الواجهة الساحلية للمنتجع'
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenWaitlist()}
                  className="px-3.5 py-1 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-bold transition-colors cursor-pointer"
                >
                  {tr(currentLang, {
                    en: 'VIP Priority Pass',
                    es: 'Pase Prioritario VIP',
                    fr: 'Pass Prioritaire VIP',
                    ar: 'طلب أولوية VIP'
                  })}
                </button>
              </div>

              <div className={`absolute bottom-4 left-4 right-4 ${isAr ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-white">
                  {tr(currentLang, {
                    en: 'Sand Combat Arena Wing · Resort Villas & Mall',
                    es: 'Ala Arena de Combate · Villas y Paseo Comercial',
                    fr: 'Aile Combat sur Sable · Villas & Galerie',
                    ar: 'ساحة القتال والتدريب على الرمال · فيلل ومول المنتجع'
                  })}
                </h3>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-[#0C0E14] border border-white/[0.08] group">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={resortCfg.aerialNightImage}
                alt={tr(currentLang, {
                  en: 'Aerial night view of the island surrounded by luminous lagoon water',
                  es: 'Vista aérea nocturna de la isla iluminada sobre la laguna',
                  fr: 'Vue aérienne nocturne de l’île entourée d’eau lumineuse',
                  ar: 'الجزيرة من الأعلى ليلاً والإضاءة المائية المحيطة بها'
                })}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/25 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px]">
                <span className="px-3 py-1 rounded-full bg-[#07080C]/80 border border-[#10B981]/40 text-[#10B981] font-mono inline-flex items-center gap-1.5">
                  <Moon className="w-3 h-3 text-[#D4AF37]" />
                  <span>
                    {tr(currentLang, {
                      en: 'AERIAL NIGHT VIEW',
                      es: 'VISTA AÉREA NOCTURNA',
                      fr: 'VUE AÉRIENNE NOCTURNE',
                      ar: 'الجزيرة من الأعلى ليلاً'
                    })}
                  </span>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#07080C]/80 border border-white/15 text-slate-200 font-mono" dir="ltr">
                  {resortCfg.architectName || 'Ayman .A. suwaidi'}
                </span>
              </div>

              <div className={`absolute bottom-4 left-4 right-4 ${isAr ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-white">
                  {tr(currentLang, {
                    en: 'Luminous Night Perimeter Water Illumination',
                    es: 'Iluminación Acuática Perimetral Nocturna',
                    fr: 'Illumination Aquatique Périphérique Nocturne',
                    ar: 'الإضاءة المائية المحيطة بالجزيرة ليلاً'
                  })}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Villa Gallery Tour */}
        <div className="rounded-3xl p-5 md:p-6 bg-[#0C0E14] border border-white/[0.08] space-y-5">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isAr ? 'text-right' : 'text-left'}`}>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest block">
                {tr(currentLang, {
                  en: 'PRIVATE OCEANFRONT VILLAS (10 UNITS)',
                  es: 'VILLAS PRIVADAS FRENTE AL MAR (10 UNIDADES)',
                  fr: 'VILLAS PRIVÉES SUR L’OCÉAN (10 UNITÉS)',
                  ar: 'معاينة الفلل الشاطئية (10 فيلل مستقلة)'
                })}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {tr(currentLang, {
                  en: 'Villa Interior & Pool Tour',
                  es: 'Recorrido Interior y Piscina de la Villa',
                  fr: 'Visite Intérieure & Piscine de la Villa',
                  ar: 'جولة أركان الفيلا الداخلية والخارجية'
                })}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setIsVillaGalleryModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#12151F] hover:border-[#D4AF37]/50 text-slate-200 font-mono text-xs border border-white/[0.08] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {tr(currentLang, {
                    en: 'Fullscreen',
                    es: 'Pantalla Completa',
                    fr: 'Plein Écran',
                    ar: 'تكبير المعرض'
                  })}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenWaitlist(CORE_FACILITIES[1])}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>
                  {tr(currentLang, {
                    en: 'Reserve Pass',
                    es: 'Reservar Pase',
                    fr: 'Réserver un Pass',
                    ar: 'حجز الأولوية'
                  })}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-8">
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#07080C]">
                <KineticMediaStage
                  slides={villaPhotos.map((p): KineticSlide => ({
                    id: p.id,
                    src: p.src,
                    alt: p.label,
                    accentColor: '#D4AF37'
                  }))}
                  activeIndex={Math.min(activeVillaImage, villaPhotos.length - 1)}
                  onChangeIndex={(idx) => {
                    soundFX.playButtonClick();
                    setActiveVillaImage(idx);
                  }}
                  isAr={isAr}
                  aspectClassName="aspect-[16/9]"
                  showControls={true}
                  showScrubBar={true}
                  renderOverlay={() => (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07080C]/90 via-transparent to-transparent pointer-events-none z-10" />
                      <div className={`absolute bottom-10 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-none ${isAr ? 'text-right' : 'text-left'}`}>
                        <span className="text-sm font-bold text-white drop-shadow">
                          {currentPhoto.label}
                        </span>
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#07080C]/80 border border-white/15 text-[#D4AF37]">
                          {currentPhoto.tag}
                        </span>
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-2">
              {villaPhotos.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setActiveVillaImage(idx);
                  }}
                  className={`w-full p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                    activeVillaImage === idx
                      ? 'bg-[#D4AF37]/12 border-[#D4AF37]/70 text-white translate-x-0.5'
                      : 'bg-[#12151F]/70 border-white/[0.06] text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.tag}
                    referrerPolicy="no-referrer"
                    className="w-14 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                  />
                  <div className="flex-1 text-start min-w-0">
                    <span className="text-xs font-bold block truncate">
                      {photo.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {photo.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Entertainment Zone Directory */}
        <div className="rounded-3xl p-5 md:p-6 bg-[#0C0E14] border border-white/[0.08] space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-white/[0.08]">
              <div className="aspect-[16/10] w-full">
                <img
                  src={YARD_BAZARUTO_ENTERTAINMENT_MALL_IMAGE}
                  alt="YARD Entertainment & Mall Promenade"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080C]/85 via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setActiveVillaImage(5);
                    setIsVillaGalleryModalOpen(true);
                  }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#07080C]/85 border border-white/20 text-white text-[11px] font-mono flex items-center gap-1.5 cursor-pointer hover:border-[#D4AF37]"
                >
                  <Maximize2 className="w-3 h-3 text-[#D4AF37]" />
                  <span>{tr(currentLang, { en: 'Expand', es: 'Ampliar', fr: 'Agrandir', ar: 'تكبير' })}</span>
                </button>
              </div>
            </div>

            <div className={`lg:col-span-7 space-y-4 ${isAr ? 'text-right' : 'text-left'}`}>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-widest block">
                  {tr(currentLang, {
                    en: 'ENTERTAINMENT & LIFESTYLE DISTRICT · 10 ZONES',
                    es: 'DISTRITO DE OCIO Y ESTILO DE VIDA · 10 ZONAS',
                    fr: 'QUARTIER LOISIRS & ART DE VIVRE · 10 ZONES',
                    ar: 'منطقة الترفيه والمول الساحلي · 10 أقسام'
                  })}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5">
                  {tr(currentLang, {
                    en: 'Entertainment District Directory',
                    es: 'Directorio del Distrito de Entretenimiento',
                    fr: 'Répertoire du Quartier de Loisirs',
                    ar: 'أقسام منطقة الترفيه المتكاملة'
                  })}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ENTERTAINMENT_ZONES.map((zone, idx) => {
                  const ZoneIcon = zone.icon;
                  return (
                    <div
                      key={zone.id}
                      className="px-3.5 py-2.5 rounded-xl bg-[#12151F] border border-white/[0.06] flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center shrink-0">
                        <ZoneIcon className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <span className="text-xs font-semibold text-slate-100 truncate">
                        {tr(currentLang, {
                          en: zone.titleEn,
                          es: zone.titleEs,
                          fr: zone.titleFr,
                          ar: zone.titleAr
                        })}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 ms-auto tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Core Facilities */}
        <div className="space-y-4">
          <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 ${isAr ? 'text-right' : 'text-left'}`}>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest block">
                {tr(currentLang, {
                  en: 'CORE SANCTUARY FACILITIES',
                  es: 'INSTALACIONES PRINCIPALES DEL SANTUARIO',
                  fr: 'INFRASTRUCTURES CLÉS DU SANCTUAIRE',
                  ar: 'المرافق الرئيسية المختصرة'
                })}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {tr(currentLang, {
                  en: 'Hospital, Villas, Hotel, Pool, Dining & Gym',
                  es: 'Hospital, Villas, Hotel, Piscina, Gastronomía y Gimnasio',
                  fr: 'Hôpital, Villas, Hôtel, Lagon, Tables & Complexe Sportif',
                  ar: 'المستشفى، الفلل، الفندق، المسبح، المطاعم والجيم'
                })}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => handleOpenWaitlist()}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-bold text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-2 self-start sm:self-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>
                {tr(currentLang, {
                  en: 'Join Priority List (Oct 2027)',
                  es: 'Lista Prioritaria (Oct 2027)',
                  fr: 'Liste Prioritaire (Oct 2027)',
                  ar: 'الانضمام لقائمة الأولوية (أكتوبر 2027)'
                })}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CORE_FACILITIES.map((fac) => {
              const IconComp = fac.icon;
              return (
                <div
                  key={fac.id}
                  className="rounded-2xl p-5 bg-[#0C0E14] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center border"
                          style={{
                            backgroundColor: `${fac.accent}12`,
                            borderColor: `${fac.accent}35`
                          }}
                        >
                          <IconComp className="w-4 h-4" style={{ color: fac.accent }} />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-500 tabular-nums">
                          {fac.num}
                        </span>
                      </div>

                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                        style={{
                          color: fac.accent,
                          borderColor: `${fac.accent}35`,
                          backgroundColor: `${fac.accent}10`
                        }}
                      >
                        {getFacilityBadge(fac)}
                      </span>
                    </div>

                    <div className={isAr ? 'text-right' : 'text-left'}>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {getFacilityTitle(fac)}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {getFacilitySummary(fac)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      {tr(currentLang, { en: 'OCT 2027', es: 'OCT 2027', fr: 'OCT 2027', ar: 'أكتوبر 2027' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenWaitlist(fac)}
                      className="text-xs font-semibold text-[#D4AF37] hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>
                        {tr(currentLang, {
                          en: 'Priority Pass',
                          es: 'Pase Prioritario',
                          fr: 'Accès Prioritaire',
                          ar: 'طلب أولوية'
                        })}
                      </span>
                      {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Priority Waitlist Modal */}
      {isWaitlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#0C0E14] border border-white/[0.12] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsWaitlistModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label={tr(currentLang, { en: 'Close', es: 'Cerrar', fr: 'Fermer', ar: 'إغلاق' })}
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className={`space-y-1 ${isAr ? 'text-right' : 'text-left'}`}>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/35 text-[10px] font-mono font-bold">
                    {tr(currentLang, {
                      en: 'OCTOBER 2027 · PRIORITY PASS',
                      es: 'OCTUBRE 2027 · PASE PRIORITARIO',
                      fr: 'OCTOBRE 2027 · PASS PRIORITAIRE',
                      ar: 'أكتوبر 2027 · بطاقة الأولوية'
                    })}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {tr(currentLang, {
                      en: 'VIP Founding Pass — Bazaruto 2027',
                      es: 'Pase Fundador VIP — Bazaruto 2027',
                      fr: 'Pass Fondateur VIP — Bazaruto 2027',
                      ar: 'طلب بطاقة الأولوية — منتجع بازاروتو 2027'
                    })}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {tr(currentLang, {
                      en: 'Free priority registration for the October 2027 inaugural season.',
                      es: 'Registro prioritario gratuito para la temporada inaugural de octubre 2027.',
                      fr: 'Inscription prioritaire gratuite pour la saison inaugurale d’octobre 2027.',
                      ar: 'تسجيل مجاني بالكامل لتأكيد أولوية الحجز مع بداية الاستقبال في أكتوبر 2027.'
                    })}
                  </p>
                </div>

                {selectedFacilityForModal && (
                  <div className="p-3 rounded-2xl bg-[#12151F] border border-[#10B981]/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                      <selectedFacilityForModal.icon className="w-4 h-4" />
                    </div>
                    <div className={isAr ? 'text-right' : 'text-left'}>
                      <span className="text-[10px] text-[#10B981] font-mono font-bold block">
                        {tr(currentLang, {
                          en: 'Selected Facility',
                          es: 'Instalación Seleccionada',
                          fr: 'Installation Sélectionnée',
                          ar: 'المرفق المختار'
                        })}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {getFacilityTitle(selectedFacilityForModal)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {tr(currentLang, { en: 'Full Name:', es: 'Nombre Completo:', fr: 'Nom Complet :', ar: 'الاسم الكامل:' })}
                    </label>
                    <input
                      type="text"
                      required
                      value={athleteName}
                      onChange={(e) => setAthleteName(e.target.value)}
                      placeholder="e.g. Victor Stone"
                      className="w-full bg-[#12151F] border border-white/[0.1] focus:border-[#D4AF37] rounded-xl py-2.5 px-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {tr(currentLang, { en: 'Email Address:', es: 'Correo Electrónico:', fr: 'Adresse Email :', ar: 'البريد الإلكتروني:' })}
                    </label>
                    <input
                      type="email"
                      required
                      value={athleteEmail}
                      onChange={(e) => setAthleteEmail(e.target.value)}
                      placeholder="athlete@example.com"
                      dir="ltr"
                      className="w-full bg-[#12151F] border border-white/[0.1] focus:border-[#D4AF37] rounded-xl py-2.5 px-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {tr(currentLang, { en: 'Guest Profile:', es: 'Perfil de Huésped:', fr: 'Profil Invité :', ar: 'الصفة أو التخصص:' })}
                      </label>
                      <select
                        value={athleteDiscipline}
                        onChange={(e) => setAthleteDiscipline(e.target.value)}
                        className="w-full bg-[#12151F] border border-white/[0.1] focus:border-[#D4AF37] rounded-xl py-2.5 px-3 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="Combat Sports / MMA & Boxing">
                          {tr(currentLang, { en: 'Combat Sports / MMA & Boxing', es: 'Deportes de Combate / MMA y Boxeo', fr: 'Sports de Combat / MMA & Boxe', ar: 'رياضات قتالية / MMA وملاكمة' })}
                        </option>
                        <option value="Endurance & Athletic Training">
                          {tr(currentLang, { en: 'Endurance & Athletic Training', es: 'Resistencia y Entrenamiento Atlético', fr: 'Endurance & Préparation Physique', ar: 'التحمل والتدريب الرياضي' })}
                        </option>
                        <option value="Executive & Wellness Seeker">
                          {tr(currentLang, { en: 'Executive & Wellness Seeker', es: 'Bienestar Ejecutivo y Recuperación', fr: 'Bien-être Exécutif & Récupération', ar: 'استشفاء ورفاهية تنفيذية' })}
                        </option>
                        <option value="VIP Private Guest">
                          {tr(currentLang, { en: 'VIP Private Guest', es: 'Huésped Privado VIP', fr: 'Invité Privé VIP', ar: 'ضيف خاص VIP' })}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {tr(currentLang, { en: 'Preferred Window:', es: 'Fecha Preferida:', fr: 'Période Souhaitée :', ar: 'الفترة المفضلة:' })}
                      </label>
                      <select
                        value={preferredWindow}
                        onChange={(e) => setPreferredWindow(e.target.value)}
                        className="w-full bg-[#12151F] border border-white/[0.1] focus:border-[#D4AF37] rounded-xl py-2.5 px-3 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="October 2027 (Grand Opening)">
                          {tr(currentLang, { en: 'October 2027 (Grand Opening)', es: 'Octubre 2027 (Gran Apertura)', fr: 'Octobre 2027 (Ouverture)', ar: 'أكتوبر 2027 (الافتتاح الرسمي)' })}
                        </option>
                        <option value="November 2027">
                          {tr(currentLang, { en: 'November 2027', es: 'Noviembre 2027', fr: 'Novembre 2027', ar: 'نوفمبر 2027' })}
                        </option>
                        <option value="December 2027">
                          {tr(currentLang, { en: 'December 2027', es: 'Diciembre 2027', fr: 'Décembre 2027', ar: 'ديسمبر 2027' })}
                        </option>
                        <option value="Q1 2028">Q1 2028</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {tr(currentLang, { en: 'Preferences (Optional):', es: 'Preferencias (Opcional):', fr: 'Préférences (Optionnel) :', ar: 'ملاحظات (اختياري):' })}
                    </label>
                    <textarea
                      rows={2}
                      value={healthAndInjuryNotes}
                      onChange={(e) => setHealthAndInjuryNotes(e.target.value)}
                      placeholder={tr(currentLang, {
                        en: 'e.g. Private beachfront villa, sports rehab...',
                        es: 'Ej. Villa privada en primera línea, rehabilitación deportiva...',
                        fr: 'Ex. Villa privée sur la plage, rééducation sportive...',
                        ar: 'مثال: فيلا خاصة، تأهيل رياضي...'
                      })}
                      className="w-full bg-[#12151F] border border-white/[0.1] focus:border-[#D4AF37] rounded-xl py-2 px-3 text-xs text-white outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWaitlistModalOpen(false)}
                    className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer"
                  >
                    {tr(currentLang, { en: 'Cancel', es: 'Cancelar', fr: 'Annuler', ar: 'إلغاء' })}
                  </button>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {formSubmitting
                        ? tr(currentLang, { en: 'Submitting...', es: 'Enviando...', fr: 'Envoi...', ar: 'جاري التسجيل...' })
                        : tr(currentLang, { en: 'Confirm Priority Pass', es: 'Confirmar Pase Prioritario', fr: 'Confirmer le Pass Prioritaire', ar: 'تأكيد التسجيل مجاناً' })}
                    </span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/35 font-bold">
                    {tr(currentLang, { en: 'VIP PASS GRANTED', es: 'PASE VIP CONCEDIDO', fr: 'PASS VIP ACCORDÉ', ar: 'تم إصدار بطاقة الأولوية' })}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {tr(currentLang, {
                      en: 'Your VIP Priority Pass is Confirmed',
                      es: 'Tu Pase Prioritario VIP está Confirmado',
                      fr: 'Votre Pass Prioritaire VIP est Confirmé',
                      ar: 'تم تأكيد تسجيلك لقائمة أولوية بازاروتو 2027'
                    })}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    {tr(currentLang, {
                      en: `Thank you, ${athleteName}. Confirmation #${confirmationNumber} has been sent to ${athleteEmail}.`,
                      es: `Gracias, ${athleteName}. La confirmación #${confirmationNumber} ha sido enviada a ${athleteEmail}.`,
                      fr: `Merci, ${athleteName}. La confirmation #${confirmationNumber} a été envoyée à ${athleteEmail}.`,
                      ar: `شكراً يا ${athleteName}. تم إرسال رقم بطاقتك (${confirmationNumber}) إلى ${athleteEmail}.`
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsWaitlistModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-white text-[#07080C] font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {tr(currentLang, { en: 'Close', es: 'Cerrar', fr: 'Fermer', ar: 'إغلاق' })}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isVillaGalleryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 md:p-6"
          onClick={() => setIsVillaGalleryModalOpen(false)}
        >
          <div
            className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-white font-bold text-sm md:text-base">
              {tr(currentLang, {
                en: 'Resort & Villas Gallery (Oct 2027)',
                es: 'Galería del Resort y Villas (Oct 2027)',
                fr: 'Galerie du Resort & Villas (Oct 2027)',
                ar: 'معرض صور المنتجع والفلل (أكتوبر 2027)'
              })}
            </h4>
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setIsVillaGalleryModalOpen(false);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label={tr(currentLang, { en: 'Close', es: 'Cerrar', fr: 'Fermer', ar: 'إغلاق' })}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {(() => {
            const activePhotoObj = allLightboxPhotos[activeVillaImage] || allLightboxPhotos[0];
            return (
              <div
                className="flex-1 flex flex-col justify-between py-4 space-y-4 max-w-6xl mx-auto w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-1 min-h-[280px] md:min-h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <KineticMediaStage
                    slides={allLightboxPhotos.map((p, idx): KineticSlide => ({
                      id: `lb-${idx}`,
                      src: p.src,
                      alt: p.title,
                      accentColor: '#D4AF37'
                    }))}
                    activeIndex={activeVillaImage}
                    onChangeIndex={(idx) => {
                      soundFX.playButtonClick();
                      setActiveVillaImage(idx);
                    }}
                    isAr={isAr}
                    aspectClassName="w-full h-full min-h-[280px] md:min-h-[460px]"
                    objectFit="contain"
                    showControls={true}
                    showScrubBar={true}
                    renderOverlay={() => (
                      <div className="absolute bottom-9 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 text-center pointer-events-none z-20">
                        <h5 className="text-base md:text-lg font-bold text-white">
                          {activePhotoObj.title}
                        </h5>
                      </div>
                    )}
                  />
                </div>

                <div className="grid grid-cols-6 gap-2 md:gap-3 shrink-0">
                  {allLightboxPhotos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundFX.playButtonClick();
                        setActiveVillaImage(idx);
                      }}
                      className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeVillaImage === idx
                          ? 'border-[#D4AF37] scale-[1.03]'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={p.src}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
};

export default BazarutoResortSanctuary;
