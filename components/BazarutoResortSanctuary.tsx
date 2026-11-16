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
  Moon,
  Anchor,
  Navigation
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import {
  YARD_ARCH_BOARD_IMAGE,
  YARD_BAZARUTO_VILLA_IMAGE,
  YARD_BAZARUTO_VILLA_BEDROOM_IMAGE,
  YARD_BAZARUTO_VILLA_LIVING_IMAGE,
  YARD_BAZARUTO_VILLA_BATHROOM_IMAGE,
  YARD_BAZARUTO_VILLA_DINING_IMAGE,
  YARD_BAZARUTO_ENTERTAINMENT_MALL_IMAGE,
  YARD_SPORTS_HOSPITAL_IMAGE,
  YARD_ROOFTOP_VIEW_IMAGE,
  YARD_MARINA_HELIPAD_IMAGE
} from '../constants';
import { emailService } from '../services/emailService';
import { OwnerConfigService, DEFAULT_RESORT_CONFIG } from '../services/ownerConfigService';
import { KineticMediaStage, KineticSlide } from './KineticMediaStage';

interface BazarutoResortSanctuaryProps {
  currentLang?: Language;
  onExploreEvents?: () => void;
}

const ENTERTAINMENT_ZONES = [
  {
    id: 'mall',
    icon: ShoppingBag,
    titleAr: 'مول من دورين · 26 براند عالمي',
    titleEn: '2-Story Mall · 26 Global Luxury Brands',
    titleEs: 'Mall de 2 Pisos · 26 Marcas Globales',
    titleFr: 'Mall 2 Niveaux · 26 Marques Mondiales'
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
    id: 'cafes',
    icon: Store,
    titleAr: '4 كافيهات (أحدها مع تراس روف)',
    titleEn: '4 Cafés (1 Open-Air Rooftop Café)',
    titleEs: '4 Cafés (1 con Terraza Rooftop)',
    titleFr: '4 Cafés (1 avec Terrasse Rooftop)'
  },
  {
    id: 'nightclub',
    icon: Music,
    titleAr: 'نادي ليلي VIP ولاونج مسائي',
    titleEn: 'VIP Nightclub & Rooftop Evening Lounge',
    titleEs: 'Club Nocturno VIP y Lounge Azotea',
    titleFr: 'Nightclub VIP & Lounge Nocturne'
  },
  {
    id: 'theater',
    icon: Stars,
    titleAr: 'مسرح العروض والترفيه البحري',
    titleEn: 'Live Entertainment Ocean Stage Theater',
    titleEs: 'Teatro de Espectáculos Frente al Mar',
    titleFr: 'Théâtre Scénique & Spectacles Live'
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
    id: 'market',
    icon: ShoppingCart,
    titleAr: 'سوبرماركت عضوي ومخبز',
    titleEn: 'Organic Supermarket & Bakery',
    titleEs: 'Supermercado Orgánico y Panadería',
    titleFr: 'Supermarché Bio & Boulangerie'
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
    id: 'pool',
    icon: Waves,
    titleAr: 'المسبح الأيقوني وقنوات السباحة',
    titleEn: 'Iconic Horizon Lagoon Pool',
    titleEs: 'Piscina Laguna Horizonte Central',
    titleFr: 'Piscine Lagon Horizon Centrale'
  },
  {
    id: 'arcade',
    icon: Gamepad2,
    titleAr: 'صالة الألعاب الترفيهية وتراس النجوم',
    titleEn: 'Interactive Gaming Lounge & Stargazing',
    titleEs: 'Sala Interactiva VR y Mirador Estelar',
    titleFr: 'Espace Jeux VR & Observatoire Stellaire'
  },
  {
    id: 'marina',
    icon: Anchor,
    titleAr: 'مرسى يخوت عميق يتسع حتى 30 يختاً',
    titleEn: '30-Berth Deep-Water Yacht Marina',
    titleEs: 'Marina Privada para hasta 30 Yates',
    titleFr: 'Marina Privée jusqu’à 30 Yachts'
  },
  {
    id: 'helipad',
    icon: Navigation,
    titleAr: 'مهبط هليكوبتر VIP لوصول خاص ومباشر',
    titleEn: 'Private VIP Oceanfront Helipad',
    titleEs: 'Helipuerto VIP Privado Frente al Mar',
    titleFr: 'Héliport VIP Privé Face à l’Océan'
  }
];

export const BazarutoResortSanctuary: React.FC<BazarutoResortSanctuaryProps> = ({
  currentLang = 'en'
}) => {
  const isAr = currentLang === 'ar';

  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
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
    },
    {
      src: resortCfg.heroPanoramaImage || YARD_ARCH_BOARD_IMAGE,
      title: tr(currentLang, {
        en: 'Architectural Competition Presentation Board (Scale 1:2000)',
        es: 'Lámina de Presentación Arquitectónica (Escala 1:2000)',
        fr: 'Planche de Présentation Architecturale (Échelle 1:2000)',
        ar: 'لوحة العرض المعماري الاحترافية والمنظور العام (مقياس 1:2000)'
      })
    },
    {
      src: resortCfg.aerialNightImage,
      title: tr(currentLang, {
        en: 'Twilight Island Masterplan & Lagoon Waterways',
        es: 'Plan Maestro al Atardecer y Canales de Laguna',
        fr: 'Plan Directeur au Crépuscule et Canaux du Lagon',
        ar: 'المخطط الهيكلي العام للجزيرة ومسارات البحيرة عند الغروب'
      })
    },
    {
      src: YARD_SPORTS_HOSPITAL_IMAGE,
      title: tr(currentLang, {
        en: 'Oceanfront Sports Medicine & Injury Rehabilitation Hospital Wing',
        es: 'Ala Hospitalaria de Medicina Deportiva y Rehabilitación Frente al Mar',
        fr: 'Aile Hospitalière de Médecine du Sport et Rééducation Face à l’Océan',
        ar: 'جناح مستشفى الإصابات الرياضية والتأهيل الحركي المطل على المحيط'
      })
    },
    {
      src: YARD_ROOFTOP_VIEW_IMAGE,
      title: tr(currentLang, {
        en: '2-Story Boutique Hotel Rooftop Deck — View Over Lagoon & Entertainment Mall',
        es: 'Azotea del Hotel Boutique de 2 Pisos — Vista a la Laguna y Mall',
        fr: 'Rooftop de l’Hôtel Boutique 2 Niveaux — Vue Lagon & Mall',
        ar: 'إطلالة روف الفندق البوتيكي (طابقين) بجانب المول ومنطقة الترفيه'
      })
    },
    {
      src: YARD_MARINA_HELIPAD_IMAGE,
      title: tr(currentLang, {
        en: '30-Berth Deep-Water Superyacht Marina & Private VIP Helipad',
        es: 'Marina para 30 Yates de Lujo y Helipuerto VIP Privado',
        fr: 'Marina 30 Yachts en Eau Profonde & Héliport VIP Privé',
        ar: 'مرسى اليخوت الفاخر (يتسع حتى 30 يختاً) ومهبط الهليكوبتر الخاص VIP'
      })
    }
  ];

  const handleOpenWaitlist = () => {
    soundFX.playButtonClick();
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
                      es: 'Un santuario costero en el Archipiélago de Bazaruto que abre en octubre de 2027: 10 villas privadas, hotel boutique de 2 pisos, paseo comercial, piscina laguna, marina para hasta 30 yates, helipuerto VIP privado, gimnasio en la arena y hospital deportivo.',
                      fr: 'Un sanctuaire côtier dans l’Archipel de Bazaruto ouvrant en octobre 2027 : 10 villas privées, hôtel boutique 2 niveaux, promenade commerciale, piscine lagon, marina 30 yachts, héliport VIP, salle sur sable et hôpital du sport.'
                    })}
              </p>

              {/* Artistic Architectural Signature Seal (Calligraphic Monogram Only) */}
              <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
                  <PenTool className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>
                    {tr(currentLang, {
                      en: 'Concept & Masterplan Architecture',
                      es: 'Concepto y Arquitectura Maestra',
                      fr: 'Concept & Architecture Directrice',
                      ar: 'تصميم وتخطيط المنتجع بالكامل'
                    })}
                  </span>
                </span>

                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0C0E14] border border-[#D4AF37]/30"
                  title={tr(currentLang, {
                    en: 'Lead Architect Calligraphic Signature',
                    es: 'Firma Caligráfica del Arquitecto',
                    fr: 'Signature Calligraphique de l’Architecte',
                    ar: 'التوقيع المعماري الحصري للمنتجع'
                  })}
                >
                  <svg
                    viewBox="0 0 132 34"
                    className="h-5 w-auto text-[#D4AF37]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label={tr(currentLang, {
                      en: 'Architectural Designer Signature',
                      es: 'Firma del Diseñador Arquitectónico',
                      fr: 'Signature du Concepteur Architectural',
                      ar: 'التوقيع المعماري'
                    })}
                  >
                    <path
                      d="M8 25C14 14 21 6 24 6C26 6 22 21 20 26C19 28 24 22 29 17C32 14 33 24 38 22C42 20 46 11 50 9C52 8 49 23 54 22C59 21 66 13 73 12C76 12 73 20 79 19C85 18 93 8 98 6C101 5 94 25 100 24C106 23 115 16 124 15"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 20.5C34 18.5 54 16 74 16.5"
                      stroke="currentColor"
                      strokeWidth="1.15"
                      strokeLinecap="round"
                      strokeOpacity="0.65"
                    />
                    <path
                      d="M42 28.5C69 27 98 25 123 23.5"
                      stroke="#10B981"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeOpacity="0.85"
                    />
                  </svg>
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase border-s border-white/10 ps-2">
                    {tr(currentLang, {
                      en: 'Architect Signature',
                      es: 'Firma Arquitecto',
                      fr: 'Signature Architecte',
                      ar: 'توقيع المعماري'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Compact Scale Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 shrink-0">
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
                  label: tr(currentLang, { en: 'Hotel Suites', es: 'Suites Hotel', fr: 'Suites Hôtel', ar: 'فندق طابقين' }),
                  accent: '#D4AF37'
                },
                {
                  val: tr(currentLang, { en: '30 Yachts', es: '30 Yates', fr: '30 Yachts', ar: '30 يختاً' }),
                  label: tr(currentLang, { en: 'Marina + Heli', es: 'Marina + Heli', fr: 'Marina + Héli', ar: 'مرسى + مهبط' }),
                  accent: '#10B981'
                },
                {
                  val: tr(currentLang, { en: 'Hospital', es: 'Hospital', fr: 'Hôpital', ar: 'مستشفى' }),
                  label: tr(currentLang, { en: 'Sports Med', es: 'Med. Deportiva', fr: 'Méd. Sport', ar: 'طب رياضي' }),
                  accent: '#D4AF37'
                }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-3 rounded-2xl bg-[#0C0E14] border border-white/[0.08] text-center"
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

        {/* 2. Architectural Presentation Sheets: Board + Aerial Masterplan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="relative rounded-3xl overflow-hidden bg-[#0C0E14] border border-white/[0.08] group">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={resortCfg.heroPanoramaImage || YARD_ARCH_BOARD_IMAGE}
                alt={tr(currentLang, {
                  en: 'Architectural Presentation Board — Bazaruto Bio-Recovery Resort',
                  es: 'Lámina de Presentación Arquitectónica — Resort Bazaruto',
                  fr: 'Planche de Présentation Architecturale — Resort Bazaruto',
                  ar: 'لوحة العرض المعماري الاحترافية — منتجع بازاروتو'
                })}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/20 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 text-[11px]">
                <span className="px-3 py-1 rounded-full bg-[#07080C]/85 border border-white/15 text-slate-200 font-mono">
                  {tr(currentLang, {
                    en: 'SHEET A-01 · ARCHITECTURAL BOARD',
                    es: 'LÁMINA A-01 · DISEÑO MAESTRO',
                    fr: 'PLANCHE A-01 · ARCHITECTURE',
                    ar: 'لوحة A-01 · البرزنتيشن المعماري'
                  })}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playButtonClick();
                      setActiveVillaImage(6);
                      setIsVillaGalleryModalOpen(true);
                    }}
                    className="p-1.5 rounded-full bg-[#07080C]/85 border border-white/20 text-white hover:border-[#D4AF37] transition-colors cursor-pointer"
                    aria-label={tr(currentLang, { en: 'Expand sheet', es: 'Ampliar lámina', fr: 'Agrandir', ar: 'تكبير اللوحة' })}
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
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
              </div>

              <div className={`absolute bottom-4 left-4 right-4 ${isAr ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-white">
                  {tr(currentLang, {
                    en: 'Architectural Presentation Board · Elevation & Masterplan',
                    es: 'Lámina de Presentación Arquitectónica · Alzado y Plan Maestro',
                    fr: 'Planche de Concours Architectural · Coupe & Plan Directeur',
                    ar: 'لوحة البرزنتيشن المعماري · المخطط الهيكلي والمقطع العرضي للفلل'
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
                  en: 'Golden hour aerial masterplan view of the Bazaruto sanctuary island',
                  es: 'Vista aérea al atardecer del plan maestro en Bazaruto',
                  fr: 'Vue aérienne crépusculaire du plan directeur de l’île Bazaruto',
                  ar: 'الجزيرة من الأعلى عند الغروب والممرات المائية المضيئة'
                })}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/20 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px]">
                <span className="px-3 py-1 rounded-full bg-[#07080C]/85 border border-[#10B981]/40 text-[#10B981] font-mono inline-flex items-center gap-1.5">
                  <Moon className="w-3 h-3 text-[#D4AF37]" />
                  <span>
                    {tr(currentLang, {
                      en: 'SHEET A-02 · TWILIGHT MASTERPLAN',
                      es: 'LÁMINA A-02 · VISTA AÉREA',
                      fr: 'PLANCHE A-02 · PLAN DIRECTEUR',
                      ar: 'لوحة A-02 · المنظور الجوي عند الغروب'
                    })}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setActiveVillaImage(7);
                    setIsVillaGalleryModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-full bg-[#07080C]/85 border border-white/15 text-slate-200 font-mono inline-flex items-center gap-1.5 hover:border-[#D4AF37] cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 text-[#D4AF37]" />
                  <span>{tr(currentLang, { en: 'Inspect', es: 'Ver', fr: 'Voir', ar: 'معاينة' })}</span>
                </button>
              </div>

              <div className={`absolute bottom-4 left-4 right-4 ${isAr ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-white">
                  {tr(currentLang, {
                    en: 'Island Masterplan · 30-Yacht Marina, VIP Helipad & Lagoon',
                    es: 'Plan Maestro · Marina 30 Yates, Helipuerto VIP y Laguna',
                    fr: 'Plan Directeur · Marina 30 Yachts, Héliport VIP & Lagon',
                    ar: 'المخطط الجوي للجزيرة · مرسى 30 يختاً، مهبط هليكوبتر وميدان القتال'
                  })}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 2B. Resort Promotional Architectural Showcase: Sports Hospital, 2-Story Hotel Rooftop & 30-Yacht Marina + Helipad */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card A: Sports Medicine & Injury Rehabilitation Hospital Wing */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0C0E14] border border-[#10B981]/25 group flex flex-col">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={YARD_SPORTS_HOSPITAL_IMAGE}
                alt={tr(currentLang, {
                  en: 'Oceanfront Sports Injury Rehabilitation Hospital Wing',
                  es: 'Ala Hospitalaria de Rehabilitación de Lesiones Deportivas',
                  fr: 'Aile Hospitalière de Rééducation des Blessures Sportives',
                  ar: 'مستشفى الإصابات الرياضية والتأهيل الحركي المطل على المحيط'
                })}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/15 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 text-[11px]">
                <span className="px-3 py-1 rounded-full bg-[#07080C]/85 border border-[#10B981]/45 text-[#10B981] font-mono font-bold inline-flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>
                    {tr(currentLang, {
                      en: 'SHEET H-03 · SPORTS INJURY HOSPITAL',
                      es: 'LÁMINA H-03 · HOSPITAL DEPORTIVO',
                      fr: 'PLANCHE H-03 · CLINIQUE SPORT',
                      ar: 'لوحة H-03 · مستشفى الإصابات الرياضية'
                    })}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setActiveVillaImage(8);
                    setIsVillaGalleryModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-full bg-[#07080C]/85 border border-white/20 text-white font-mono inline-flex items-center gap-1.5 hover:border-[#10B981] cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 text-[#10B981]" />
                  <span>{tr(currentLang, { en: 'Expand', es: 'Ampliar', fr: 'Agrandir', ar: 'تكبير' })}</span>
                </button>
              </div>

              <div className={`absolute bottom-4 left-4 right-4 ${isAr ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-white">
                  {tr(currentLang, {
                    en: 'Sports Injury & Hydro-Rehab Hospital Wing',
                    es: 'Ala Clínica de Medicina Deportiva e Hidroterapia',
                    fr: 'Aile Clinique du Sport & Hydrothérapie Océanique',
                    ar: 'جناح مستشفى الإصابات الرياضية والتأهيل المائي على المحيط'
                  })}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {tr(currentLang, {
                    en: 'Curved travertine clinical wing with sea-view hydrotherapy plunge pool, gait biomechanics track & orthopedic rehab suites.',
                    es: 'Ala clínica de travertino frente al mar con piscina de hidroterapia, pista biomecánica y fisioterapia avanzada.',
                    fr: 'Aile clinique en travertin face à la mer avec bassin d’hydrothérapie, piste biomécanique et physiothérapie de pointe.',
                    ar: 'تصميم معماري زجاجي وحجر ترافرتين يضم حوض استشفاء مائي، مسار تحليل الميكانيكا الحيوية للمفاصل، وعيادات علاج طبيعي بإطلالة بحرية مباشرة.'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Card B: Boutique Hotel Rooftop Horizon View */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0C0E14] border border-[#D4AF37]/25 group flex flex-col">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={YARD_ROOFTOP_VIEW_IMAGE}
                alt={tr(currentLang, {
                  en: '2-Story Boutique Hotel Rooftop Terrace Overlooking Lagoon & Entertainment Mall',
                  es: 'Terraza en la Azotea del Hotel Boutique de 2 Pisos con Vista al Mall y Laguna',
                  fr: 'Terrasse Rooftop de l’Hôtel Boutique 2 Niveaux Face au Mall et au Lagon',
                  ar: 'إطلالة روف الفندق البوتيكي من ارتفاع طابقين بجانب المول ومنطقة الترفيه والفلل'
                })}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/15 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 text-[11px]">
                <span className="px-3 py-1 rounded-full bg-[#07080C]/85 border border-[#D4AF37]/45 text-[#D4AF37] font-mono font-bold inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>
                    {tr(currentLang, {
                      en: 'SHEET V-04 · HOTEL ROOFTOP VISTA',
                      es: 'LÁMINA V-04 · VISTA ROOFTOP HOTEL',
                      fr: 'PLANCHE V-04 · VUE ROOFTOP HÔTEL',
                      ar: 'لوحة V-04 · الفيو من روف الفندق'
                    })}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setActiveVillaImage(9);
                    setIsVillaGalleryModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-full bg-[#07080C]/85 border border-white/20 text-white font-mono inline-flex items-center gap-1.5 hover:border-[#D4AF37] cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 text-[#D4AF37]" />
                  <span>{tr(currentLang, { en: 'Expand', es: 'Ampliar', fr: 'Agrandir', ar: 'تكبير' })}</span>
                </button>
              </div>

              <div className={`absolute bottom-4 left-4 right-4 ${isAr ? 'text-right' : 'text-left'}`}>
                <h3 className="text-base md:text-lg font-bold text-white">
                  {tr(currentLang, {
                    en: '2-Story Hotel Rooftop · Lagoon & Mall Vista',
                    es: 'Azotea Hotel (2 Pisos) · Vista Mall y Laguna',
                    fr: 'Rooftop Hôtel (2 Niveaux) · Vue Lagon',
                    ar: 'روف الفندق (طابقين) · إطلالة المول واللاجون'
                  })}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {tr(currentLang, {
                    en: 'Intimate 2-story palm-height terrace across the lagoon from the entertainment mall, overlooking the beach villas, sand arena & ocean sunset.',
                    es: 'Terraza íntima de 2 pisos frente al mall de entretenimiento y la laguna, con vista directa a las villas de playa, arena de combate y ocaso marino.',
                    fr: 'Terrasse intime de 2 niveaux face au mall et au lagon, donnant sur les villas côtières, l’arène sur sable et le coucher de soleil.',
                    ar: 'منظور واقعي من روف الفندق ذي الطابقين بجانب المول ومنطقة الترفيه، يطل عبر اللاغون على الفلل الشاطئية وميدان القتال الرملي.'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Card C: 30-Berth Yacht Marina & Private VIP Helipad */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0C0E14] border border-[#10B981]/25 group flex flex-col md:col-span-2 lg:col-span-1">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={YARD_MARINA_HELIPAD_IMAGE}
                alt={tr(currentLang, {
                  en: '30-Berth Deep-Water Yacht Marina & Private VIP Helipad at Bazaruto',
                  es: 'Marina para 30 Yates y Helipuerto VIP Privado en Bazaruto',
                  fr: 'Marina 30 Yachts & Héliport VIP Privé à Bazaruto',
                  ar: 'مرسى يخوت يتسع حتى 30 يختاً ومهبط هليكوبتر خاص في منتجع بازاروتو'
                })}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/15 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 text-[11px]">
                <span className="px-3 py-1 rounded-full bg-[#07080C]/85 border border-[#10B981]/45 text-[#10B981] font-mono font-bold inline-flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5" />
                  <span>
                    {tr(currentLang, {
                      en: 'SHEET M-05 · 30-YACHT MARINA & HELIPAD',
                      es: 'LÁMINA M-05 · MARINA 30 YATES Y HELIPUERTO',
                      fr: 'PLANCHE M-05 · MARINA 30 YACHTS & HÉLIPORT',
                      ar: 'لوحة M-05 · مرسى 30 يختاً ومهبط الهليكوبتر'
                    })}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setActiveVillaImage(10);
                    setIsVillaGalleryModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-full bg-[#07080C]/85 border border-white/20 text-white font-mono inline-flex items-center gap-1.5 hover:border-[#10B981] cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 text-[#10B981]" />
                  <span>{tr(currentLang, { en: 'Expand', es: 'Ampliar', fr: 'Agrandir', ar: 'تكبير' })}</span>
                </button>
              </div>

              <div className={`absolute bottom-4 left-4 right-4 ${isAr ? 'text-right' : 'text-left'}`}>
                <h3 className="text-base md:text-lg font-bold text-white">
                  {tr(currentLang, {
                    en: '30-Berth Yacht Marina & VIP Helipad',
                    es: 'Marina para 30 Yates y Helipuerto VIP',
                    fr: 'Marina 30 Yachts & Héliport VIP Privé',
                    ar: 'مرسى 30 يختاً ومهبط هليكوبتر VIP'
                  })}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {tr(currentLang, {
                    en: 'Private deep-water berths accommodating up to 30 superyachts plus an oceanfront VIP helipad for seamless direct island arrival.',
                    es: 'Amarres de aguas profundas con capacidad para hasta 30 yates y helipuerto VIP privado para llegadas directas a la isla.',
                    fr: 'Postes d’amarrage en eau profonde pour 30 yachts et héliport VIP privé pour un accès aérien direct sur l’île.',
                    ar: 'أرصفة بحرية عميقة مجهزة لاستقبال حتى 30 يختاً فاخراً مع مهبط هليكوبتر خاص بإضاءة ليلية لوصول جوي وبحري مباشر للجزيرة.'
                  })}
                </p>
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
                onClick={() => handleOpenWaitlist()}
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
                    en: '2-STORY ENTERTAINMENT MALL · 26 BRANDS · 4 RESTAURANTS · 4 CAFÉS (1 ROOFTOP) · NIGHTCLUB · CINEMA & THEATER',
                    es: 'MALL 2 PISOS · 26 MARCAS · 4 RESTAURANTES · 4 CAFÉS (1 ROOFTOP) · CLUB NOCTURNO · CINE Y TEATRO',
                    fr: 'MALL 2 ÉTAGES · 26 MARQUES · 4 RESTAURANTS · 4 CAFÉS (1 ROOFTOP) · NIGHTCLUB · CINÉMA & THÉÂTRE',
                    ar: 'مول من دورين · 26 براند عالمي · 4 مطاعم · 4 كافيهات (أحدها روف) · نادي ليلي · سينما ومسرح ترفيه'
                  })}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5">
                  {tr(currentLang, {
                    en: 'Two-Story Mall & Entertainment District',
                    es: 'Centro Comercial de Dos Pisos y Distrito de Ocio',
                    fr: 'Centre Commercial 2 Niveaux & Quartier Loisirs',
                    ar: 'المول ذو الدورين ومنطقة الترفيه المتكاملة'
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

        {/* 5. 7-Star Editorial Hospitality Prospectus (Booking-Caliber Narrative) */}
        <div className="rounded-3xl p-6 md:p-10 bg-gradient-to-br from-[#0C0E14] via-[#090C11] to-[#0B1014] border border-[#D4AF37]/25 space-y-6">
          <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.08] ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                <span aria-hidden="true">★★★★★★★</span>
                <span>
                  {tr(currentLang, {
                    en: '7-STAR ULTRA-LUXURY PRIVATE ISLAND SANCTUARY',
                    es: 'SANTUARIO EN ISLA PRIVADA ULTRA-LUJO · 7 ESTRELLAS',
                    fr: 'SANCTUAIRE SUR ÎLE PRIVÉE ULTRA-LUXE · 7 ÉTOILES',
                    ar: 'منتجع وجزيرة فاخرة بمواصفات 7 نجوم عالمية'
                  })}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {tr(currentLang, {
                  en: 'Where Sovereign Island Serenity Meets World-Class Athletic Recovery',
                  es: 'Donde la Serenidad de una Isla Privada se Une a la Recuperación de Élite',
                  fr: 'Où la Sérénité d’une Île Privée Rencontre la Récupération Sportive de Pointe',
                  ar: 'حيث تلتقي فخامة الضيافة العالمية ذات الـ 7 نجوم بأرقى معايير الاستشفاء والأداء'
                })}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => handleOpenWaitlist()}
              className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-bold text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-2 self-start lg:self-auto whitespace-nowrap"
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

          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="lg:col-span-8 space-y-4 text-sm md:text-[15px] text-slate-300 leading-[1.85]">
              <p>
                {tr(currentLang, {
                  en: 'Set across a secluded coral peninsula in the untouched waters of the Bazaruto Archipelago and opening October 2027, YARD Bazaruto Sanctuary redefines seven-star ultra-luxury island hospitality. Guests arrive to ten standalone oceanfront villas sculpted from organic bent timber and seamless panoramic glass — each complete with its own private horizon plunge pool, sun deck, and direct white-sand lagoon access — alongside an intimate thirty-room boutique hotel crowned by four ultra-private VIP rooftop suites with twenty-four-hour bespoke butler and concierge service.',
                  es: 'Enclavado en una península coralina aislada en las aguas cristalinas del Archipiélago de Bazaruto y con apertura en octubre de 2027, YARD Bazaruto Sanctuary redefine la hospitalidad de siete estrellas. Sus huéspedes disfrutan de diez villas privadas frente al mar diseñadas en madera natural y cristal panorámico con piscina infinita propia, junto a un exclusivo hotel boutique de treinta habitaciones y cuatro suites VIP con vistas desde la azotea y mayordomo privado las 24 horas.',
                  fr: 'Niché sur une presqu’île corallienne préservée de l’Archipel de Bazaruto et ouvrant en octobre 2027, YARD Bazaruto Sanctuary réinvente l’hôtellerie insulaire sept étoiles. Le domaine accueille dix villas océaniques indépendantes en bois cintré et verre panoramique avec piscine privée à débordement, complétées par un hôtel boutique confidentiel de trente chambres et quatre suites VIP en rooftop dotées d’un service de majordome dédié 24h/24.',
                  ar: 'على شبه جزيرة ساحرة وسط المياه الفيروزية البكر في أرخبيل بازاروتو، يُعيد منتجع وملاذ يارد — الذي يفتتح أبوابه في أكتوبر 2027 — صياغة مفهوم الضيافة الفندقية ذات الـ 7 نجوم. يجمع المنتجع بين الخصوصية المطلقة لعشر فيلل شاطئية مستقلة مبنية من الخشب الطبيعي والزجاج البانورامي لكل منها مسبح إنفينيتي خاص وإطلالة مباشرة على الشاطئ، إلى جانب فندق بوتيكي راقٍ يضم 30 غرفة فاخرة و4 أجنحة VIP بإطلالات شاهقة وخدمة كونسيرج وضيافة شخصية على مدار 24 ساعة.'
                })}
              </p>

              <p>
                {tr(currentLang, {
                  en: 'Every corner of the estate balances indulgent resort living with restorative science. Arrive seamlessly by private yacht at our deep-water 30-berth marina or touch down directly on the oceanfront VIP helipad before gliding past the meandering turquoise lagoon waterways into a two-story coastal luxury promenade featuring twenty-six international maisons, four signature waterfront fine-dining restaurants serving ocean-to-table seafood and organic culinary programmes, four artisan cafés — topped by a sunset rooftop lounge and VIP late-night club — an acoustic 4K boutique cinema, and a seaside live amphitheater. On the serene ocean wing stands a world-class sports medicine and mental-wellness hospital offering hydrotherapy rehabilitation and deep psychological restoration, while the island’s distant opposing shoreline hosts an uncompromising sand and combat conditioning academy.',
                  es: 'Cada espacio equilibra el máximo placer vacacional con la ciencia de la recuperación. Llegue por mar a nuestra marina de aguas profundas con capacidad para 30 yates o aterrice en el helipuerto VIP privado junto a la costa antes de recorrer la piscina laguna y el bulevar de dos pisos con veintiséis firmas internacionales, cuatro restaurantes frente al mar, cuatro cafés de autor — incluido un rooftop al atardecer y club nocturno VIP —, cine acústico boutique 4K y teatro marino. El ala clínica costera alberga un hospital de medicina deportiva, hidroterapia y bienestar mental, mientras la costa opuesta acoge un complejo de entrenamiento intensivo sobre arena y combate.',
                  fr: 'Chaque espace conjugue l’art de vivre insulaire et la science du rétablissement. Arrivez en yacht privé à notre marina en eau profonde de 30 places ou posez-vous directement sur l’héliport VIP privé avant de passer des canaux lagon à la promenade de luxe sur deux niveaux réunissant vingt-six maisons internationales, quatre restaurants gastronomiques, quatre cafés — dont un rooftop panoramique et un club privé nocturne —, un cinéma acoustique 4K et un théâtre face aux vagues. L’aile clinique abrite un hôpital de médecine du sport et de santé mentale avec hydrothérapie océanique, tandis qu’à l’autre bout de l’île s’étend le complexe d’entraînement sur sable.',
                  ar: 'وتتكامل تجربة الإقامة هنا في تناغم استثنائي بين الرفاهية المترفة والاستشفاء العلمي المتقدم؛ حيث يستقبلك المنتجع بوصولٍ خاص ومباشر عبر مرسى اليخوت العميق الذي يتسع حتى 30 يختاً أو عبر مهبط الهليكوبتر الشخصي VIP المطل على المحيط، لتنساب بعدها الممرات المائية ومسبح البحيرة الأيقوني وصولاً إلى بوليفارد التسوق والترفيه ذي الدورين الذي يحتضن 26 علامة عالمية فاخرة، و4 مطاعم بحرية رفيعة المستوى، و4 كافيهات مختارة أحدها في تراس الروف العلوي المتصل بنادٍ ليلي VIP، إلى جانب سينما بوتيكية بتقنية 4K ومسرح عروض شاطئي. كما يحتضن الجناح الطبي الهادئ مستشفى متخصصاً في الطب الرياضي وعلاج الإصابات والتأهيل النفسي العميق بإطلالات بحرية مباشرة، فيما تتمركز في الطرف المقابل من الجزيرة صالة رياضية بمواصفات عالمية مخصصة للتدريبات القاسية على الرمال والرياضات القتالية.'
                })}
              </p>
            </div>

            {/* Clean Booking-Style Property Highlights Column */}
            <div className="lg:col-span-4 p-5 md:p-6 rounded-2xl bg-[#07090D] border border-white/[0.08] space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#10B981] block">
                {tr(currentLang, {
                  en: 'ESTATE SIGNATURES · 7-STAR STANDARD',
                  es: 'DISTINTIVOS DE LA PROPIEDAD · 7 ESTRELLAS',
                  fr: 'SIGNATURES DU DOMAINE · 7 ÉTOILES',
                  ar: 'أبرز مزايا الإقامة · تصنيف 7 نجوم'
                })}
              </span>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="pb-2.5 border-b border-white/[0.06]">
                  <strong className="text-white block">
                    {tr(currentLang, {
                      en: '7-Star Private Villas & 2-Story Hotel',
                      es: 'Villas Privadas y Hotel Boutique 7 Estrellas',
                      fr: 'Villas Privées & Hôtel Boutique 7 Étoiles',
                      ar: '10 فيلل شاطئية وفندق طابقين (30 غرفة + 4 أجنحة VIP)'
                    })}
                  </strong>
                  <span className="text-slate-400">
                    {tr(currentLang, {
                      en: 'Private oceanfront plunge pools, lagoon access & 24/7 concierge',
                      es: 'Piscinas privadas frente al mar y conserjería 24/7',
                      fr: 'Bassins privés face à l’océan & majordome 24h/24',
                      ar: 'مسابح خاصة وإطلالات بانورامية وخدمة كونسيرج على مدار الساعة'
                    })}
                  </span>
                </li>
                <li className="pb-2.5 border-b border-white/[0.06]">
                  <strong className="text-white block">
                    {tr(currentLang, {
                      en: '30-Berth Yacht Marina & VIP Helipad',
                      es: 'Marina para 30 Yates y Helipuerto VIP',
                      fr: 'Marina 30 Yachts & Héliport VIP Privé',
                      ar: 'مرسى 30 يختاً ومهبط هليكوبتر خاص'
                    })}
                  </strong>
                  <span className="text-slate-400">
                    {tr(currentLang, {
                      en: 'Deep-water superyacht slips for 30 vessels + private helicopter pad',
                      es: 'Amarres privados para 30 yates de lujo + pista privada de helicóptero',
                      fr: '30 postes en eau profonde pour superyachts + hélisurface privée',
                      ar: 'مرسى بحري عميق يتسع حتى 30 يختاً مع مهبط هليكوبتر لوصول مباشر للجزيرة'
                    })}
                  </span>
                </li>
                <li className="pb-2.5 border-b border-white/[0.06]">
                  <strong className="text-white block">
                    {tr(currentLang, {
                      en: 'Culinary Promenade, Cinema & Nightlife',
                      es: 'Gastronomía, Mall 26 Firmas, Cine y Nightclub',
                      fr: 'Gastronomie, Mall 26 Maisons, Cinéma & Club',
                      ar: 'مول من دورين · 26 براند · 4 مطاعم و4 كافيهات'
                    })}
                  </strong>
                  <span className="text-slate-400">
                    {tr(currentLang, {
                      en: '4 global restaurants, 4 cafés (1 rooftop), theater & VIP club',
                      es: '4 restaurantes de autor, 4 cafés, cine 4K y teatro',
                      fr: '4 restaurants de chef, 4 cafés, cinéma 4K et théâtre',
                      ar: 'تراس روف ونادٍ ليلي VIP، سينما 4K ومسرح عروض مباشر'
                    })}
                  </span>
                </li>
                <li className="pb-2.5 border-b border-white/[0.06]">
                  <strong className="text-white block">
                    {tr(currentLang, {
                      en: 'Hospital, Lagoon Pools & Island Training',
                      es: 'Hospital Deportivo, Piscina Laguna y Arena',
                      fr: 'Hôpital du Sport, Lagon & Complexe Sable',
                      ar: 'مستشفى استشفاء، مسبح البحيرة، وصالة تدريب شاطئية'
                    })}
                  </strong>
                  <span className="text-slate-400">
                    {tr(currentLang, {
                      en: 'Hydrotherapy injury & mental wellness wing + remote sand combat gym',
                      es: 'Hidroterapia médica, bienestar mental y gimnasio en la arena',
                      fr: 'Hydrothérapie clinique, santé mentale et salle sur sable isolée',
                      ar: 'علاج الإصابات والاكتئاب، مسابح استشفاء، وتدريب قتالي على الرمال'
                    })}
                  </span>
                </li>
                <li>
                  <strong className="text-[#D4AF37] block">
                    {tr(currentLang, {
                      en: 'Inaugural Season: October 2027',
                      es: 'Temporada Inaugural: Octubre 2027',
                      fr: 'Saison Inaugurale : Octobre 2027',
                      ar: 'الافتتاح الرسمي: أكتوبر 2027'
                    })}
                  </strong>
                  <span className="text-slate-400">
                    {tr(currentLang, {
                      en: 'Bazaruto Archipelago, Indian Ocean — Priority access open',
                      es: 'Archipiélago de Bazaruto — Registro prioritario abierto',
                      fr: 'Archipel de Bazaruto — Liste prioritaire ouverte',
                      ar: 'أرخبيل بازاروتو، المحيط الهندي — قائمة الأولوية مفتوحة'
                    })}
                  </span>
                </li>
              </ul>
            </div>
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

                <div className="grid grid-cols-6 sm:grid-cols-11 gap-2 md:gap-2.5 shrink-0">
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
