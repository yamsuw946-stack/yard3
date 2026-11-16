/**
 * TicketsEventsHub.tsx
 * YARD 300 10-Challenge Nature Endurance & Fitness Championship (Tickets Open Jan 5, 2027)
 * Obsidian & Emerald visual palette + full EN, ES, FR, AR localization.
 */

import React, { useState } from 'react';
import {
  Ticket,
  Calendar,
  MapPin,
  ShieldCheck,
  Check,
  Clock,
  Tv,
  MonitorPlay,
  Radio,
  Bell
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

interface TicketsEventsHubProps {
  currentLang?: Language;
  onBackToHome?: () => void;
  onProceedToCheckout?: (eventTitle: string, price: number) => void;
}

interface LText {
  en: string;
  es: string;
  fr: string;
  ar: string;
}

interface TournamentEvent {
  id: string;
  title: LText;
  tagline: LText;
  date: LText;
  time: string;
  location: LText;
  price: number;
  originalPrice?: number;
  badge: LText;
  tier: string;
  statusNotice: LText;
  perks: { en: string[]; es: string[]; fr: string[]; ar: string[] };
  image: string;
}

const TOURNAMENT_EVENTS: TournamentEvent[] = [
  {
    id: 'nature-10-challenges-2027',
    title: {
      en: 'YARD 300 — 10-Challenge Nature Endurance & Fitness Championship',
      es: 'YARD 300 — Campeonato de 10 Desafíos de Resistencia en la Naturaleza',
      fr: 'YARD 300 — Championnat des 10 Défis d’Endurance en Pleine Nature',
      ar: 'بطولة YARD 300 للتحديات الـ 10 — اختبار القدرة واللياقة في الطبيعة'
    },
    tagline: {
      en: '10 outdoor nature trials testing stamina, terrain carries, speed climbing & recovery control.',
      es: '10 pruebas al aire libre para medir resistencia extrema, carga natural, velocidad y recuperación.',
      fr: '10 épreuves en pleine nature mesurant endurance, force brute, agilité et contrôle physiologique.',
      ar: '10 تحديات ميدانية قاسية في الطبيعة المفتوحة لاختبار أقصى درجات القدرة والتحمل واللياقة البدنية.'
    },
    date: {
      en: 'Ticket Sales Open: January 5, 2027',
      es: 'Venta de Entradas: 5 de Enero de 2027',
      fr: 'Ouverture Billetterie : 5 Janvier 2027',
      ar: 'بدء بيع التذاكر: 5 يناير 2027'
    },
    time: '06:00 - 18:00 LOCAL',
    location: {
      en: 'Wild Terrain & Mountain Coast Sanctuary',
      es: 'Terreno Natural y Costa de Montaña',
      fr: 'Sanctuaire Naturel Terre & Littoral',
      ar: 'مسارات الطبيعة الجبلية والساحلية المفتوحة'
    },
    price: 100,
    originalPrice: 150,
    badge: {
      en: 'OPENS JAN 5, 2027',
      es: 'ABRE 5 ENE 2027',
      fr: 'OUVRE 5 JANV 2027',
      ar: 'يبدأ البيع 5 يناير 2027'
    },
    tier: '10-CHALLENGE PASS',
    statusNotice: {
      en: '10-Challenge Championship: Ticket sales officially open on January 5, 2027.',
      es: 'Campeonato de 10 Desafíos: La venta oficial de entradas abrirá el 5 de enero de 2027.',
      fr: 'Championnat 10 Défis : Ouverture officielle de la billetterie le 5 janvier 2027.',
      ar: 'بطولة التحديات الـ 10 في الطبيعة: سيبدأ بيع التذاكر رسمياً في 5 يناير 2027.'
    },
    perks: {
      en: [
        'Full Access to All 10 Nature Endurance Challenges',
        'Live Biometric ACWR & HRV Field Telemetry Sync',
        'Official YARD 300 Limited Jersey & Finisher Medal',
        'Hydration & Bio-Recovery Field Station Support'
      ],
      es: [
        'Acceso Completo a los 10 Desafíos en la Naturaleza',
        'Telemetría Biométrica ACWR y VFC en Vivo',
        'Camiseta Oficial YARD 300 y Medalla Finisher',
        'Estaciones de Hidratación y Recuperación Deportiva'
      ],
      fr: [
        'Accès Complet aux 10 Défis Nature & Endurance',
        'Télémétrie Biométrique ACWR & VRC en Direct',
        'Maillot Officiel YARD 300 & Médaille Finisher',
        'Stations d’Hydratation et de Récupération Terrain'
      ],
      ar: [
        'مشاركة كاملة في كافة التحديات الـ 10 في الطبيعة',
        'شريحة تتبع حيوي لنبض القلب ومؤشر الإجهاد ACWR',
        'قميص البطولة الرسمي المحدود وميدالية الإنهاء',
        'محطات تغذية واستشفاء ميدانية طوال المسار'
      ]
    },
    image: '/images/athlete_mindset_track.jpg'
  },
  {
    id: 'grand-finals-pro-division-2027',
    title: {
      en: '10-Challenge Pro Division & S-Rank Endurance Qualifier',
      es: 'División Pro 10 Desafíos y Clasificatoria S-Rank 2027',
      fr: 'Division Pro 10 Défis & Qualifications S-Rank 2027',
      ar: 'التصفيات الاحترافية الـ 10 وتحدي النخبة S-Rank 2027'
    },
    tagline: {
      en: 'Top-tier competitive heat for Leaderboard Top 50 qualifiers and Combat Camp veterans.',
      es: 'Serie competitiva élite para atletas del Top 50 y veteranos de campamento YARD.',
      fr: 'Vague élite dédiée aux qualifiés du Top 50 et vétérans des camps YARD 300.',
      ar: 'فئة المنافسة القصوى لنخبة لوحة المتصدرين والأبطال الدوليين عبر المسارات الصعبة.'
    },
    date: {
      en: 'Ticket Sales Open: January 5, 2027',
      es: 'Venta de Entradas: 5 de Enero de 2027',
      fr: 'Ouverture Billetterie : 5 Janvier 2027',
      ar: 'بدء بيع التذاكر: 5 يناير 2027'
    },
    time: '07:00 - 20:00 LOCAL',
    location: {
      en: 'YARD Endurance Highland Arena',
      es: 'Arena de Resistencia en Tierras Altas',
      fr: 'Arène d’Endurance des Hautes Terres',
      ar: 'حلبة المرتفعات الطبيعية الكبرى'
    },
    price: 150,
    originalPrice: 210,
    badge: {
      en: 'OPENS JAN 5, 2027',
      es: 'ABRE 5 ENE 2027',
      fr: 'OUVRE 5 JANV 2027',
      ar: 'يبدأ البيع 5 يناير 2027'
    },
    tier: 'PRO QUALIFIER',
    statusNotice: {
      en: 'Pro Qualifier wave tickets release on January 5, 2027 alongside the main 10-challenge drop.',
      es: 'Las entradas Pro Qualifier salen a la venta el 5 de enero de 2027.',
      fr: 'Les billets Division Pro seront disponibles dès le 5 janvier 2027.',
      ar: 'تذاكر فئة المحترفين تفتح بالتزامن مع البطولة في 5 يناير 2027.'
    },
    perks: {
      en: [
        'Pro Timing Wave & Official Leaderboard Points',
        '10-Stage Biometric Data Export for Performance Verification',
        'Private Warm-up & Mobility Zone Access',
        'Direct Qualification Toward 10,000 YARDX Championship Pot'
      ],
      es: [
        'Salida Cronometrada Pro y Puntos de Ranking',
        'Exportación Completa de Datos de las 10 Etapas',
        'Acceso Privado a Zona de Calentamiento',
        'Clasificación Directa al Premio de 10,000 YARDX'
      ],
      fr: [
        'Vague Chronométrée Pro & Points Classement',
        'Export Complet des Données sur les 10 Épreuves',
        'Accès Privé Zone d’Échauffement & Mobilité',
        'Qualification Directe pour les 10 000 YARDX'
      ],
      ar: [
        'انطلاقة احترافية معتمدة ونقاط في لوحة المتصدرين',
        'تقرير بيانات حيوي شامل للتحديات الـ 10 كاملة',
        'دخول منطقة الإحماء والاستشفاء الخاصة بالأبطال',
        'تأهل مباشر لجوائز الـ 10,000 YARDX'
      ]
    },
    image: '/images/ai_human_arena_duo.jpg'
  },
  {
    id: 'vip-founders-pass-2027',
    title: {
      en: 'VIP Founders Gallery & Nature Sanctuary Retreat Pass',
      es: 'Pase VIP Fundadores y Acceso Integral al Circuito 2027',
      fr: 'Pass VIP Fondateurs & Accès Privilège Sanctuaire 2027',
      ar: 'تذكرة VIP الخاصة ولقاء المؤسسين ومسار البطولة 2027'
    },
    tagline: {
      en: 'All-access hospitality across the 10-challenge nature zones, cryo suites & Founders briefing.',
      es: 'Hospitalidad integral en los 10 desafíos naturales, zonas de recuperación y reunión VIP.',
      fr: 'Hospitalité intégrale sur les 10 zones d’épreuves, cryo-récupération et briefing VIP.',
      ar: 'ضيافة VIP شاملة عبر مواقع التحديات الـ 10 في الطبيعة وجلسات الاستشفاء ولقاء المؤسسين.'
    },
    date: {
      en: 'Ticket Sales Open: January 5, 2027',
      es: 'Venta de Entradas: 5 de Enero de 2027',
      fr: 'Ouverture Billetterie : 5 Janvier 2027',
      ar: 'بدء بيع التذاكر: 5 يناير 2027'
    },
    time: 'ALL-DAY VIP ACCESS',
    location: {
      en: 'YARD 300 Founding Lounge & Observation Decks',
      es: 'Salón VIP de Fundadores y Miradores',
      fr: 'Salon Fondateurs & Terrasses Panoramiques',
      ar: 'المنصة الملكية ونقاط المشاهدة الطبيعية'
    },
    price: 220,
    originalPrice: 290,
    badge: {
      en: 'VIP · JAN 5, 2027',
      es: 'VIP · 5 ENE 2027',
      fr: 'VIP · 5 JANV 2027',
      ar: 'VIP · 5 يناير 2027'
    },
    tier: 'VIP FOUNDERS PASS',
    statusNotice: {
      en: 'Limited 300 VIP Passes open for sale exclusively on January 5, 2027.',
      es: 'Los 300 Pases VIP saldrán exclusivamente a la venta el 5 de enero de 2027.',
      fr: 'Les 300 Pass VIP exclusifs ouvriront à la vente le 5 janvier 2027.',
      ar: '300 تذكرة VIP مرقمة فقط — يبدأ بيعها حصرياً في 5 يناير 2027.'
    },
    perks: {
      en: [
        'All-Stage Nature Observation Access & VIP Lounges',
        'Private Masterclass & Briefing with Founders',
        'Serialized Titanium YARD 300 Credential Plaque',
        'Gourmet Organic Athlete Nutrition & Cryo Suite Access'
      ],
      es: [
        'Acceso VIP a Todas las Etapas en la Naturaleza',
        'Masterclass Privada con los Fundadores',
        'Placa de Titanio YARD 300 Numerada',
        'Nutrición Orgánica de Élite y Crioterapia'
      ],
      fr: [
        'Accès VIP à Toutes les Zones Naturelles',
        'Masterclass Privée avec les Fondateurs',
        'Plaque Titane YARD 300 Numérotée',
        'Gastronomie Sportive & Suites de Cryothérapie'
      ],
      ar: [
        'دخول جميع منصات المشاهدة في مسارات الطبيعة',
        'جلسة تدريبية ولقاء خاص مع المؤسسين',
        'درع تيتانيوم تذكاري مرقم ومخصص باسمك',
        'ضيافة غذائية عضوية وأجنحة تبريد استشفائية'
      ]
    },
    image: '/images/ticket_vip_showdown.jpg'
  }
];

export const TicketsEventsHub: React.FC<TicketsEventsHubProps> = ({
  currentLang = 'en',
  onBackToHome,
  onProceedToCheckout
}) => {
  const isAr = currentLang === 'ar';
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const pick = (text: LText) => tr(currentLang, text);
  const pickList = (perks: { en: string[]; es: string[]; fr: string[]; ar: string[] }) => {
    if (currentLang === 'ar') return perks.ar;
    if (currentLang === 'es') return perks.es;
    if (currentLang === 'fr') return perks.fr;
    return perks.en;
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-16 bg-[#050807] text-white relative w-full max-w-full overflow-hidden ${
        isAr ? 'text-right' : 'text-left'
      }`}
    >
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A110E] hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/30 text-xs font-black font-anime cursor-pointer transition-all"
            >
              <span>{isAr ? '→' : '←'}</span>
              <span>
                {tr(currentLang, {
                  en: 'Back to Home',
                  es: 'Volver al Inicio',
                  fr: "Retour à l'Accueil",
                  ar: 'العودة للرئيسية'
                })}
              </span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0A110E] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black font-anime">
            <Ticket className="w-4 h-4" />
            <span>
              {tr(currentLang, {
                en: '10-CHALLENGE CHAMPIONSHIP TICKETING · OPENS JAN 5, 2027',
                es: 'ENTRADAS CAMPEONATO 10 DESAFÍOS · ABRE 5 ENERO 2027',
                fr: 'BILLETTERIE CHAMPIONNAT 10 DÉFIS · OUVRE 5 JANV 2027',
                ar: 'بوابة تذاكر بطولة التحديات الـ 10 · البيع يبدأ 5 يناير 2027'
              })}
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-black font-anime text-emerald-400 uppercase tracking-wider block">
            {tr(currentLang, {
              en: 'OFFICIAL 2027 CHAMPIONSHIP RELEASE SCHEDULE',
              es: 'CALENDARIO OFICIAL DE LANZAMIENTO 2027',
              fr: 'CALENDRIER OFFICIEL DES BILLETS 2027',
              ar: 'الموعد الرسمي لفتح بيع تذاكر البطولة 2027'
            })}
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-anime text-white leading-tight">
            {tr(currentLang, {
              en: '10-Challenge Nature Endurance Championship',
              es: 'Campeonato de 10 Desafíos en la Naturaleza',
              fr: 'Championnat des 10 Défis en Pleine Nature',
              ar: 'بطولة التحديات الـ 10 لاختبار القدرة واللياقة في الطبيعة'
            })}
          </h1>
          <p className="text-sm md:text-base text-gray-300 font-semibold max-w-2xl mx-auto leading-relaxed">
            {tr(currentLang, {
              en: 'Official Notice: Ticket sales for the 10-Challenge Nature Endurance & Fitness Championship will officially open on January 5, 2027.',
              es: 'Aviso Oficial: La venta de entradas para el campeonato de los 10 desafíos físicos en la naturaleza abrirá oficialmente el 5 de enero de 2027.',
              fr: 'Avis Officiel : La vente des billets pour le championnat des 10 défis d’endurance en nature ouvrira officiellement le 5 janvier 2027.',
              ar: 'تنويه رسمي: يبدأ بيع تذاكر بطولة التحديات الـ 10 لاختبار القدرة واللياقة البدنية في الطبيعة رسمياً في تاريخ 5 يناير 2027.'
            })}
          </p>
        </div>

        {/* Official Opening Banner */}
        <div className="p-6 rounded-2xl bg-[#080E0B] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-black font-anime text-[#D4AF37] uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5" />
              <span>
                {tr(currentLang, {
                  en: 'OFFICIAL TICKET RELEASE: JANUARY 5, 2027',
                  es: 'LANZAMIENTO OFICIAL: 5 DE ENERO DE 2027',
                  fr: 'OUVERTURE OFFICIELLE : 5 JANVIER 2027',
                  ar: 'الافتتاح الرسمي لبيع التذاكر: 5 يناير 2027'
                })}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-black font-anime text-white">
              {tr(currentLang, {
                en: '10 Outdoor Challenges Testing Stamina, Grit & Athletic Readiness',
                es: '10 Pruebas Naturales de Resistencia, Potencia y Preparación',
                fr: '10 Défis Nature Testant Endurance, Force et Préparation',
                ar: '10 تحديات متتالية في الطبيعة لاختبار التحمل والقوة البدنية'
              })}
            </h2>
          </div>

          <span className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-black font-mono shrink-0">
            {tr(currentLang, {
              en: 'SALES OPEN: JAN 5, 2027',
              es: 'VENTA: 5 ENE 2027',
              fr: 'VENTE : 5 JANV 2027',
              ar: 'بدء البيع: 5 يناير 2027'
            })}
          </span>
        </div>

        {purchaseSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-black font-anime text-center text-sm">
            {purchaseSuccess}
          </div>
        )}

        {/* 3 Ticket Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOURNAMENT_EVENTS.map((event) => {
            const isSelected = selectedTicketId === event.id;
            return (
              <div
                key={event.id}
                onClick={() => {
                  soundFX.playButtonClick();
                  setSelectedTicketId(event.id);
                }}
                className={`rounded-2xl p-6 bg-[#080E0B] border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                    : 'border-emerald-500/25 hover:border-emerald-400/60'
                }`}
              >
                <div>
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-5 bg-black group">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={event.image}
                      alt={pick(event.title)}
                      onError={handleImageError}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-[10px] font-black font-mono">
                      <span className="px-2.5 py-1 rounded bg-emerald-500 text-black">
                        {pick(event.badge)}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-black/85 text-[#D4AF37] border border-[#D4AF37]/40">
                        {event.tier}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] font-bold text-gray-300 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{pick(event.date)}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 text-gray-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{event.time}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-black font-anime text-white mb-2 leading-snug">
                    {pick(event.title)}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed mb-4">
                    {pick(event.tagline)}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-bold text-gray-200 mb-4 bg-[#050807] border border-emerald-500/15 p-2.5 rounded-xl">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{pick(event.location)}</span>
                  </div>

                  <ul className="space-y-1.5 text-xs font-semibold text-gray-300 mb-5">
                    {pickList(event.perks).map((perk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-bold text-gray-200 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{pick(event.statusNotice)}</span>
                  </div>

                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-2xl font-black text-[#D4AF37] font-mono tabular-nums" dir="ltr">
                        ${event.price}
                      </span>
                      {event.originalPrice && (
                        <span className="text-xs line-through text-gray-500 ml-2 font-mono tabular-nums" dir="ltr">
                          ${event.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-black font-mono text-emerald-400">
                      {tr(currentLang, {
                        en: 'JAN 5, 2027 LAUNCH',
                        es: '5 ENE 2027',
                        fr: '5 JANV 2027',
                        ar: '5 يناير 2027'
                      })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playSuccess();
                      setPurchaseSuccess(
                        tr(currentLang, {
                          en: 'Reminder registered! Ticket sales officially open on January 5, 2027.',
                          es: '¡Recordatorio guardado! Las entradas saldrán a la venta el 5 de enero de 2027.',
                          fr: 'Rappel enregistré ! La billetterie ouvrira officiellement le 5 janvier 2027.',
                          ar: 'تم تسجيل التذكير بنجاح! سيبدأ بيع التذاكر رسمياً في 5 يناير 2027.'
                        })
                      );
                      setTimeout(() => setPurchaseSuccess(null), 4500);
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-anime text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-black" />
                    <span>
                      {tr(currentLang, {
                        en: 'Remind Me · Opens Jan 5, 2027',
                        es: 'Notificarme · Abre 5 Ene 2027',
                        fr: 'Me Prévenir · 5 Janv 2027',
                        ar: 'تذكيري عند فتح البيع (5 يناير 2027)'
                      })}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Livestream Options */}
        <div className="rounded-2xl p-6 md:p-8 bg-[#080E0B] border border-emerald-500/25 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-black font-anime text-emerald-400 uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5" />
                <span>
                  {tr(currentLang, {
                    en: 'GLOBAL 4K LIVESTREAM PASSES',
                    es: 'STREAMING GLOBAL 4K ULTRA HD',
                    fr: 'DIFFUSION MONDIALE 4K ULTRA HD',
                    ar: 'البث المباشر العالمي 4K للتحديات الـ 10'
                  })}
                </span>
              </div>
              <h2 className="text-xl md:text-3xl font-black font-anime text-white">
                {tr(currentLang, {
                  en: 'Stream All 10 Challenges Live Worldwide',
                  es: 'Sigue los 10 Desafíos en Directo Desde Cualquier Lugar',
                  fr: 'Suivez les 10 Défis en Direct Partout dans le Monde',
                  ar: 'شاهد البث المباشر لكافة التحديات الـ 10 بدقة 4K'
                })}
              </h2>
            </div>

            <div className="flex items-center gap-2.5 bg-[#050807] border border-emerald-500/20 px-4 py-2.5 rounded-xl">
              <Tv className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white">1080p / 4K · 60 FPS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl p-5 bg-[#050807] border border-emerald-500/20 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-black font-anime text-white mb-1.5">
                  {tr(currentLang, {
                    en: 'Single Stage Live Stream',
                    es: 'Pase de Retransmisión por Etapa',
                    fr: 'Pass Diffusion Étape Unique',
                    ar: 'تذكرة بث تحدٍ واحد مباشر'
                  })}
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  {tr(currentLang, {
                    en: 'Live coverage of any single nature challenge plus 48-hour on-demand replay.',
                    es: 'Acceso en directo a cualquier desafío individual y repetición durante 48 horas.',
                    fr: 'Diffusion en direct d’une épreuve au choix plus replay 48 heures.',
                    ar: 'بث مباشر للتحدي الذي تختاره مع إعادة كاملة لمدة 48 ساعة.'
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-emerald-500/10">
                <span className="text-2xl font-black text-white font-mono tabular-nums" dir="ltr">
                  $10
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playSuccess();
                    if (onProceedToCheckout) onProceedToCheckout('Single Stage Stream Pass', 10);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-400 text-black font-black font-anime text-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MonitorPlay className="w-4 h-4" />
                  <span>
                    {tr(currentLang, {
                      en: 'Get Stage Pass ($10)',
                      es: 'Obtener Pase ($10)',
                      fr: 'Pass Étape ($10)',
                      ar: 'حجز بث التحدي ($10)'
                    })}
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-xl p-5 bg-[#050807] border border-[#D4AF37]/40 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-black font-anime text-[#D4AF37] mb-1.5">
                  {tr(currentLang, {
                    en: 'Full 10-Challenge Season Pass',
                    es: 'Pase Completo Temporada 10 Desafíos',
                    fr: 'Pass Saison Complet 10 Défis',
                    ar: 'تذكرة البث الشاملة لجميع التحديات الـ 10'
                  })}
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  {tr(currentLang, {
                    en: 'All-access 4K coverage across all 10 challenges, multi-angle athlete telemetry & lifetime archive.',
                    es: 'Cobertura total 4K de los 10 desafíos, telemetría en vivo y archivo permanente.',
                    fr: 'Accès total 4K aux 10 défis, télémétrie multi-caméras et archives à vie.',
                    ar: 'متابعة حية 4K للتحديات الـ 10 كاملة مع قراءات النبض المباشرة وأرشيف دائم.'
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-emerald-500/10">
                <span className="text-2xl font-black text-[#D4AF37] font-mono tabular-nums" dir="ltr">
                  $120
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playSuccess();
                    if (onProceedToCheckout) onProceedToCheckout('Full Championship Stream Pass', 120);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-white text-black font-black font-anime text-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Tv className="w-4 h-4" />
                  <span>
                    {tr(currentLang, {
                      en: 'Get Full Pass ($120)',
                      es: 'Pase Completo ($120)',
                      fr: 'Pass Complet ($120)',
                      ar: 'حجز البطولة كاملة ($120)'
                    })}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Guarantee */}
        <div className="p-5 rounded-2xl bg-[#080E0B] border border-emerald-500/20 text-center max-w-3xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-white font-black font-anime text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>
              {tr(currentLang, {
                en: 'OFFICIAL YARD 300 ENCRYPTED TICKET GUARANTEE',
                es: 'GARANTÍA OFICIAL YARD 300 DE ENTRADAS CIFRADAS',
                fr: 'GARANTIE OFFICIELLE DES BILLETS CRYPTÉS YARD 300',
                ar: 'ضمان التذاكر الإلكترونية المشفرة YARD 300'
              })}
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            {tr(currentLang, {
              en: 'All competitor and spectator passes are serialized with encrypted QR anti-scalp verification.',
              es: 'Todas las credenciales están seriadas con verificación QR cifrada.',
              fr: 'Tous les pass sont sérialisés avec vérification QR cryptée.',
              ar: 'جميع التذاكر مرقمة ومشفرة برمز QR ديناميكي لمنع التزوير عند بوابات البطولة.'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketsEventsHub;
