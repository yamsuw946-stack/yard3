/**
 * TicketsEventsHub.tsx
 * YARD 300 Official Championships, Tournaments & Live Events Ticketing Portal
 * 
 * Strict User-Specified Color Palette:
 * - Pure Black (#000000 / #0A0B10)
 * - Pure White (#FFFFFF)
 * - Cyber Emerald Green (#10B981)
 * - Electric Yellow (#FFE600)
 * - Royal Cyber Purple (#A855F7)
 */

import React, { useState } from 'react';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Trophy, 
  Flame, 
  Check, 
  Clock, 
  Users, 
  ExternalLink, 
  ChevronRight, 
  Zap, 
  ArrowRight,
  Tv,
  MonitorPlay,
  Radio,
  Bell,
  Crown
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

interface TicketsEventsHubProps {
  currentLang?: Language;
  onBackToHome?: () => void;
  onProceedToCheckout?: (eventTitle: string, price: number) => void;
}

interface TournamentEvent {
  id: string;
  titleEn: string;
  titleAr: string;
  taglineEn: string;
  taglineAr: string;
  dateEn: string;
  dateAr: string;
  time: string;
  locationEn: string;
  locationAr: string;
  price: number;
  originalPrice?: number;
  badgeEn: string;
  badgeAr: string;
  badgeColor: string;
  badgeTextColor: string;
  tier: 'VIP RINGSIDE' | 'CHAMPION PASS' | 'ATHLETE ENTRY' | 'GENERAL SPECTATOR';
  status: 'opens_nov_15' | 'not_open_2027';
  statusNoticeEn: string;
  statusNoticeAr: string;
  perksEn: string[];
  perksAr: string[];
  image: string;
}

const TOURNAMENT_EVENTS: TournamentEvent[] = [
  {
    id: 'shaolin-december-trials',
    titleEn: 'Shaolin Iron Trials & Functional Open (December 2026)',
    titleAr: 'بطولة شاولين وتحديات اللياقة الوظيفية (ديسمبر 2026)',
    taglineEn: 'High-intensity obstacle gauntlet, 100-strike punch speed trials, and heavy kettlebell drags.',
    taglineAr: 'نزال القوة البدنية وسباق العقبات الزمني، تحدي الـ 100 لكمة، واختبارات التحمل الصارمة.',
    dateEn: 'December 20, 2026',
    dateAr: '20 ديسمبر 2026',
    time: '09:00 - 17:00 ICT',
    locationEn: 'Held in Phnom Penh (Cambodia)',
    locationAr: 'تقام في مدينة بنوم بنه (كمبوديا)',
    price: 80,
    originalPrice: 110,
    badgeEn: 'DECEMBER // OPENS NOV 15',
    badgeAr: 'ديسمبر // تفتح 15 نوفمبر',
    badgeColor: '#10B981', // Green
    badgeTextColor: '#000000',
    tier: 'ATHLETE ENTRY',
    status: 'opens_nov_15',
    statusNoticeEn: 'December Tournament: Ticket booking has not opened yet. Tickets will officially open on November 15, 2026.',
    statusNoticeAr: 'المسابقة المقامة في ديسمبر: لم يتم فتح الحجز بعد، سيتم فتح التذاكر في 15 نوفمبر.',
    perksEn: [
      'Official Competitor Bib & Timing Chip',
      'Live Biometric ACWR Heart Monitoring Display',
      'Official YARD 300 Finisher Medal & Certificate',
      'Hydration & Protein Recovery Pack'
    ],
    perksAr: [
      'رقم المتسابق الرسمي وشريحة التوقيت الإلكتروني',
      'شاشة عرض مباشرة للنبض والضغط العضلي ACWR',
      'ميدالية إنهاء السباق وشهادة معتمدة من YARD',
      'حقيبة ترطيب وبروتين مخصصة للاستشفاء الفوري'
    ],
    image: '/images/ticket_shaolin_trials.jpg'
  },
  {
    id: 'cyber-grand-prix-2027',
    titleEn: 'YARD 300 Cyber Grand Prix 2027',
    titleAr: 'بطولة YARD 300 الكبرى للسايبر والملاكمة 2027',
    taglineEn: 'The supreme international arena battle where 300 elite Hyrox & Shaolin athletes collide.',
    taglineAr: 'نزال الحلبة الدولي الأضخم بمشاركة 300 بطل من نخبة الهايروكس والشاولين والملاكمة العالمية.',
    dateEn: 'January 30, 2027',
    dateAr: '30 يناير 2027',
    time: '18:00 - 23:00 ICT',
    locationEn: 'Held in Bangkok (Thailand)',
    locationAr: 'تقام في مدينة بانكوك (تايلاند)',
    price: 100,
    originalPrice: 150,
    badgeEn: '2027 // NOT OPEN FOR SALE YET',
    badgeAr: 'بطولات 2027 // لم يُفتح البيع بعد',
    badgeColor: '#A855F7', // Purple
    badgeTextColor: '#FFFFFF',
    tier: 'CHAMPION PASS',
    status: 'not_open_2027',
    statusNoticeEn: '2027 Championship: Tickets have not opened for sale yet.',
    statusNoticeAr: 'المسابقة المقامة في 2027: لم يتم فتح التذاكر للبيع بعد.',
    perksEn: [
      'Full Tournament Arena Admission & Seating',
      'Exclusive Official YARD 300 Championship Jersey',
      'Access to Fighter Warm-up Chambers & Recovery Pods',
      'Live Biometric Telemetry App Sync'
    ],
    perksAr: [
      'دخول كامل لجميع نزالات البطولة ومقاعد الحلبة',
      'قميص البطولة الرسمي الحصري YARD 300 Apex',
      'دخول مناطق إحماء المقاتلين وغرف الاستشفاء',
      'مزامنة فورية للإحصائيات الحيوية عبر التطبيق'
    ],
    image: '/images/ticket_tokyo_cyber.jpg'
  },
  {
    id: 'vip-masters-showdown-2027',
    titleEn: 'YARD VIP Ringside & Founders Gala 2027',
    titleAr: 'تذكرة المنصة الملكية VIP ولقاء المؤسسين 2027',
    taglineEn: 'Front-row ringside combat access, masterclass access, and custom serialized gear.',
    taglineAr: 'مقاعد الصف الأول في حلبة النزال، حضور ماستركلاس خاص مع الكادر التدريبي وتذكار مرقم.',
    dateEn: 'March 15, 2027',
    dateAr: '15 مارس 2027',
    time: '17:00 - 00:00 ICT',
    locationEn: 'Held in Siem Reap (Cambodia)',
    locationAr: 'تقام في مدينة سيم ريب (كمبوديا)',
    price: 180,
    originalPrice: 250,
    badgeEn: '2027 // NOT OPEN FOR SALE YET',
    badgeAr: 'بطولات 2027 // لم يُفتح البيع بعد',
    badgeColor: '#FFE600', // Yellow
    badgeTextColor: '#000000',
    tier: 'VIP RINGSIDE',
    status: 'not_open_2027',
    statusNoticeEn: '2027 Championship: Tickets have not opened for sale yet.',
    statusNoticeAr: 'المسابقة المقامة في 2027: لم يتم فتح التذاكر للبيع بعد.',
    perksEn: [
      'Front-Row Ringside Seating with Holographic Audio',
      'Private Masterclass Session with Founding Coaches',
      'Personalized Titanium YARD 300 Serialized Plaque',
      'Gourmet High-Protein Nutrition & Refreshments'
    ],
    perksAr: [
      'مقاعد الصف الأول المباشر أمام الحلبة مع صوت مجسم',
      'جلسة ماستركلاس خاصة مع المدربين المؤسسين',
      'درع تذكاري محفور ومرقم من التيتانيوم',
      'بوفيه تغذية قتالية متكامل ومشروبات طاقة طبيعية'
    ],
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
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const handleSelectTicket = (event: TournamentEvent) => {
    soundFX.playButtonClick();
    setSelectedTicketId(event.id);
  };

  return (
    <div className={`min-h-screen pt-28 pb-24 bg-black text-white relative w-full max-w-full overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Background Gradients: Strict White, Black, Green, Yellow, Purple */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#FFE600]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-8 relative z-10 space-y-12">
        
        {/* Navigation Back & Portal Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12131C] hover:bg-white text-white hover:text-black text-xs font-black font-anime cursor-pointer transition-all shadow-md"
            >
              <span>{isAr ? '→ العودة للرئيسية' : '← Back to Home'}</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12131C] text-[#FFE600] text-xs font-black font-anime shadow-md">
            <Ticket className="w-4 h-4 text-[#FFE600]" />
            <span>{isAr ? 'بوابة تذاكر البطولات والأحداث الرسمية' : 'OFFICIAL CHAMPIONSHIPS & EVENTS TICKETING'}</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="px-4 py-1 rounded-full bg-[#12131C] text-[#10B981] text-xs font-black font-anime uppercase tracking-wider inline-block">
            OFFICIAL CHAMPIONSHIPS & EVENTS SCHEDULE
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-anime text-white">
            {isAr ? 'جدول بطولات وحجز تذاكر ' : 'CHAMPIONSHIP SCHEDULE & TICKETS '}
            <span className="text-[#FFE600]">YARD 300</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 font-bold max-w-2xl mx-auto leading-relaxed">
            {isAr 
              ? 'تنويه رسمي: لم يتم فتح بيع التذاكر حالياً. سيتم فتح حجز التذاكر للمسابقة المقامة في ديسمبر رسمياً في 15 نوفمبر. أما بالنسبة للبطولات المقامة في عام 2027، فلم يتم فتح التذاكر للبيع بعد. تقام البطولات في مدن كمبوديا وتايلاند.' 
              : 'Official Notice: Ticket booking is currently closed. For the tournament held in December, ticket booking will open on November 15, 2026. For 2027 championships, tickets have not opened for sale yet. Tournaments will be held in Cambodia and Thailand.'}
          </p>
        </div>

        {/* Official Ticket Schedule Notice Banner (Green & Purple & Yellow) */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0E101C] via-[#10141C] to-[#0E101C] shadow-[0_0_40px_rgba(168,85,247,0.2)] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/20 text-[#FFE600] text-xs font-black font-anime uppercase tracking-wider">
                <Bell className="w-3.5 h-3.5 text-[#FFE600]" />
                <span>{isAr ? 'تنبيه رسمي بشأن مواعيد حجز التذاكر' : 'OFFICIAL TICKET RELEASE SCHEDULE'}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black font-anime text-white">
                {isAr ? 'حالة حجز التذاكر للبطولات القادمة' : 'Championship Ticket Booking Status'}
              </h2>
              <p className="text-xs md:text-sm text-gray-200 font-bold leading-relaxed">
                {isAr 
                  ? 'لم يتم فتح الحجز للتذاكر حالياً. بالنسبة للمسابقة المقامة في ديسمبر، سيتم فتح التذاكر في 15 نوفمبر. أما بالنسبة للبطولات المقامة في عام 2027، فلم يتم فتح التذاكر للبيع بعد. تقام البطولات في كمبوديا وتايلاند.'
                  : 'Ticket booking is currently not open. For the tournament held in December, tickets will officially open on November 15. As for the championships held in 2027, tickets have not opened for sale yet. Tournaments will take place in Cambodia and Thailand.'}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="px-4 py-2 rounded-xl bg-[#10B981]/20 text-[#10B981] text-xs font-black font-anime">
                {isAr ? 'ديسمبر: تفتح 15 نوفمبر' : 'DEC: OPENS NOV 15'}
              </span>
              <span className="px-4 py-2 rounded-xl bg-[#A855F7]/20 text-[#A855F7] text-xs font-black font-anime">
                {isAr ? '2027: لم تفتح بعد' : '2027: NOT OPEN YET'}
              </span>
            </div>
          </div>
        </div>

        {/* Success notification banner */}
        {purchaseSuccess && (
          <div className="p-4 rounded-2xl bg-[#10B981]/20 text-[#10B981] font-black font-anime text-center shadow-lg">
            ✓ {purchaseSuccess}
          </div>
        )}

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TOURNAMENT_EVENTS.map((event) => {
            const isSelected = selectedTicketId === event.id;

            return (
              <div 
                key={event.id}
                onClick={() => handleSelectTicket(event)}
                className={`rounded-3xl p-6 md:p-8 bg-[#0D0E17] transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
                  isSelected 
                    ? 'shadow-[0_0_35px_rgba(255,230,0,0.35)] scale-[1.02] bg-[#121320]' 
                    : 'hover:bg-[#121320]'
                }`}
              >
                <div>
                  
                  {/* Event Thumbnail & Status Badge */}
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6 bg-black group">
                    <img loading="lazy" decoding="async" 
                      src={event.image} 
                      alt={event.titleEn}
                      onError={handleImageError}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <span 
                        className="px-3 py-1 rounded-xl text-[10px] font-black font-anime shadow-lg"
                        style={{ backgroundColor: event.badgeColor, color: event.badgeTextColor }}
                      >
                        {isAr ? event.badgeAr : event.badgeEn}
                      </span>
                      <span className="text-[10px] font-black font-anime text-[#FFE600] bg-black/90 px-2.5 py-1 rounded-lg">
                        {event.tier}
                      </span>
                    </div>

                    {/* Under the photo: Clear Booking Status Notice */}
                    {event.status === 'opens_nov_15' ? (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-bold bg-black/95 px-3 py-2 rounded-xl backdrop-blur-md shadow-lg">
                        <div className="flex items-center gap-2 text-[#10B981]">
                          <Calendar className="w-4 h-4 text-[#10B981] animate-pulse shrink-0" />
                          <span className="font-anime font-bold text-[11px] sm:text-xs">
                            {isAr ? 'لم يفتح الحجز بعد — يفتح 15 نوفمبر' : 'Booking Not Open Yet — Opens Nov 15'}
                          </span>
                        </div>
                        <span className="text-[10px] font-anime font-black text-[#FFE600] bg-[#141624] px-2 py-0.5 rounded">
                          {isAr ? 'ديسمبر 2026' : 'DEC 2026'}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-bold bg-black/95 px-3 py-2 rounded-xl backdrop-blur-md shadow-lg">
                        <div className="flex items-center gap-2 text-[#A855F7]">
                          <Clock className="w-4 h-4 text-[#A855F7] shrink-0" />
                          <span className="font-anime font-bold text-[11px] sm:text-xs text-gray-200">
                            {isAr ? 'لم يتم فتح التذاكر للبيع بعد' : 'Tickets Not Open For Sale Yet'}
                          </span>
                        </div>
                        <span className="text-[10px] font-anime font-black text-white bg-[#A855F7]/30 px-2 py-0.5 rounded">
                          {isAr ? 'موسم 2027' : 'SEASON 2027'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Date & Location Capsule */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-bold text-gray-400 mb-3">
                    <div className="flex items-center gap-1 bg-black px-2.5 py-1 rounded-lg text-[#10B981]">
                      <Calendar className="w-3 h-3" />
                      <span>{isAr ? event.dateAr : event.dateEn}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black px-2.5 py-1 rounded-lg text-gray-300">
                      <Clock className="w-3 h-3 text-[#FFE600]" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-black font-anime text-white mb-2 leading-tight">
                    {isAr ? event.titleAr : event.titleEn}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold leading-relaxed mb-4">
                    {isAr ? event.taglineAr : event.taglineEn}
                  </p>

                  {/* City and Country only */}
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-200 mb-6 bg-black p-3 rounded-xl">
                    <MapPin className="w-4 h-4 text-[#A855F7] shrink-0" />
                    <span>{isAr ? event.locationAr : event.locationEn}</span>
                  </div>

                  {/* Perks List */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-black text-[#FFE600] uppercase font-anime">
                      {isAr ? 'مميزات وحزمة التذكرة عند فتح البيع:' : 'TICKET PRIVILEGES (UPON RELEASE):'}
                    </span>
                    <ul className="space-y-1.5 text-xs font-bold text-gray-300">
                      {(isAr ? event.perksAr : event.perksEn).map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Status Notice Banner */}
                <div className="mb-4">
                  {event.status === 'not_open_2027' ? (
                    <div className="p-3 rounded-xl bg-[#A855F7]/10 flex items-center gap-2 text-xs font-bold text-white">
                      <Clock className="w-4 h-4 text-[#A855F7] shrink-0" />
                      <span>{isAr ? event.statusNoticeAr : event.statusNoticeEn}</span>
                    </div>
                  ) : event.status === 'opens_nov_15' ? (
                    <div className="p-3 rounded-xl bg-[#10B981]/10 flex items-center gap-2 text-xs font-bold text-white">
                      <Calendar className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>{isAr ? event.statusNoticeAr : event.statusNoticeEn}</span>
                    </div>
                  ) : null}
                </div>

                {/* Price and Action Button */}
                <div className="pt-4">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-[#FFE600] font-mono tracking-tight" dir="ltr">${event.price}</span>
                      {event.originalPrice && (
                        <span className="text-sm line-through text-gray-500 ml-2">${event.originalPrice}</span>
                      )}
                      <span className="text-[10px] text-gray-400 block font-bold mt-0.5">
                        {isAr ? 'السعر التقديري عند فتح البيع' : 'ESTIMATED PRICE AT LAUNCH'}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-[#10B981] bg-black px-2.5 py-1 rounded-lg">
                      {event.status === 'opens_nov_15' 
                        ? (isAr ? 'يفتح في 15 نوفمبر' : 'OPENS NOV 15')
                        : (isAr ? 'لم يفتح البيع بعد' : 'NOT OPEN YET')}
                    </span>
                  </div>

                  {event.status === 'opens_nov_15' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFX.playSuccess();
                        setPurchaseSuccess(isAr 
                          ? `تم ضبط التذكير بنجاح! لم يتم فتح الحجز بعد، وسيتم فتح التذاكر لمسابقة ديسمبر في 15 نوفمبر 2026.`
                          : `Reminder registered! Tickets are not open yet — December tournament booking opens November 15, 2026.`);
                        setTimeout(() => setPurchaseSuccess(null), 4000);
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#10B981] hover:bg-white text-black font-black font-anime text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-black" />
                      <span>{isAr ? 'تفتح التذاكر في 15 نوفمبر — ضبط تذكير' : 'OPENS NOVEMBER 15 — REMIND ME'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFX.playSuccess();
                        setPurchaseSuccess(isAr 
                          ? `تم تسجيلك في قائمة التنبيهات! بطولات 2027 لم يتم فتح التذاكر للبيع بعد وسنبلغك فور إطلاقها.`
                          : `Alert registered! Tickets for 2027 championships have not opened for sale yet. You will be notified the instant they launch.`);
                        setTimeout(() => setPurchaseSuccess(null), 4000);
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#3b0764] hover:bg-[#581c87] border border-[#7e22ce] text-white font-black font-anime text-xs shadow-[0_0_20px_rgba(88,28,135,0.6)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Bell className="w-4 h-4 text-white" />
                      <span>{isAr ? 'لم يتم فتح التذاكر للبيع بعد — أبلغني' : 'TICKETS NOT OPEN FOR SALE YET — NOTIFY ME'}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Global Online Livestream Section: White, Black, Purple & Yellow */}
        <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[#0F0D1A] via-[#0A0B10] to-[#120F20] shadow-[0_0_40px_rgba(168,85,247,0.25)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8 pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A855F7]/20 text-[#A855F7] text-xs font-black font-anime uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 text-[#A855F7] animate-pulse" />
                <span>{isAr ? 'بث مباشر عالمي 4K // للجمهور عبر الإنترنت' : 'GLOBAL 4K ULTRA HD LIVESTREAM'}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black font-anime text-white leading-tight">
                {isAr ? (
                  <>
                    غير قادر على الحضور في الحلبة؟ <br />
                    <span className="text-[#A855F7]">تابع البث المباشر بدقة فائقة من أي مكان</span>
                  </>
                ) : (
                  <>
                    CANNOT ATTEND IN PERSON? <br />
                    <span className="text-[#A855F7]">STREAM THE ACTION LIVE FROM ANYWHERE</span>
                  </>
                )}
              </h2>
              <p className="text-xs md:text-sm text-gray-300 font-medium leading-relaxed">
                {isAr 
                  ? 'بث مباشر بزوايا كاميرا تفاعلية متعددة، تعليق رياضي احترافي، وإحصائيات النبض الحية لمقاتلي الحلبة لحظة بلحظة.' 
                  : 'Live multi-angle camera coverage, professional sports commentary, and real-time biometric athlete telemetry directly on your screen.'}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black px-4 py-3 rounded-2xl shrink-0">
              <Tv className="w-6 h-6 text-[#A855F7]" />
              <div className="text-xs">
                <span className="block font-black text-white font-anime">1080p / 4K 60FPS</span>
                <span className="text-gray-400 font-bold">{isAr ? 'متاح على الهاتف والكمبيوتر والشاشات الذكية' : 'Mobile, Desktop & Smart TVs'}</span>
              </div>
            </div>
          </div>

          {/* Two Online Stream Options: $10 Per Match vs $120 Full Season Pass */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Option 1: Single Match Pass ($10) */}
            <div className="rounded-2xl p-6 bg-black flex flex-col justify-between space-y-4 shadow-lg">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black font-anime bg-gray-800 text-gray-200">
                    SINGLE MATCH PPV
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    {isAr ? 'تذكرة نزال واحد' : 'Per Match Access'}
                  </span>
                </div>

                <h3 className="text-xl font-black font-anime text-white mb-2">
                  {isAr ? 'تذكرة البث لمباراة واحدة' : 'Single Match Stream Pass'}
                </h3>
                <p className="text-xs text-gray-400 font-medium mb-4 leading-relaxed">
                  {isAr 
                    ? 'اختر النزال الذي ترغب بمشاهدته على الهواء مباشرة مع إعادة كاملة متاحة لمدة 48 ساعة.' 
                    : 'Stream any individual match of your choice with 48-hour on-demand replay access.'}
                </p>

                <ul className="space-y-1.5 text-xs text-gray-300 font-medium mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>{isAr ? 'بث مباشر بدقة Full HD للنزال المختار' : 'Full HD 60fps livestream of chosen match'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>{isAr ? 'إعادة مشاهدة غير محدودة لمدة 48 ساعة' : '48-hour unlimited replay access'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>{isAr ? 'عرض إحصائيات اللكمات والنبض المباشرة' : 'Live punch counters & telemetry'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-3xl font-black text-white font-mono tracking-tight" dir="ltr">$10</span>
                  <span className="text-xs text-gray-400 block font-bold">{isAr ? 'للمباراة الواحدة' : 'per single match'}</span>
                </div>
                <button
                  onClick={() => {
                    soundFX.playSuccess();
                    setPurchaseSuccess(isAr ? 'تم الاشتراك في تذكرة البث المباشر للمباراة ($10)!' : 'Single Match Live Stream Pass Purchased ($10)!');
                    setTimeout(() => {
                      setPurchaseSuccess(null);
                      if (onProceedToCheckout) {
                        onProceedToCheckout('Single Match Stream Pass', 10);
                      }
                    }, 1200);
                  }}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-[#FFE600] text-black font-black font-anime text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <MonitorPlay className="w-4 h-4 text-black" />
                  <span>{isAr ? 'حجز بث المباراة ($10)' : 'GET MATCH PASS ($10)'}</span>
                </button>
              </div>
            </div>

            {/* Option 2: Full Championship Season Pass ($120) */}
            <div className="rounded-2xl p-6 bg-black shadow-[0_0_35px_rgba(255,230,0,0.2)] flex flex-col justify-between space-y-4 relative">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#FFE600] text-black text-[9px] font-black font-anime tracking-wider">
                {isAr ? 'القيمة الأفضل // كامل البطولة' : 'BEST VALUE // ALL-ACCESS'}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black font-anime bg-[#FFE600]/20 text-[#FFE600]">
                    FULL TOURNAMENT PASS
                  </span>
                </div>

                <h3 className="text-xl font-black font-anime text-white mb-2">
                  {isAr ? 'تذكرة البث لجميع نزالات البطولة كاملة' : 'Full Championship All-Access Pass'}
                </h3>
                <p className="text-xs text-gray-400 font-medium mb-4 leading-relaxed">
                  {isAr 
                    ? 'اشتراك شامل لكافة مباريات وجولات البطولة من الافتتاح وحتى النزال النهائي مع أرشيف كامل وتصوير الكواليس.' 
                    : 'Unlimited access to every single match from preliminaries to the Grand Final, plus full tournament replay archive.'}
                </p>

                <ul className="space-y-1.5 text-xs text-gray-300 font-medium mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FFE600] shrink-0" />
                    <span>{isAr ? 'بث 4K فائق الوضوح لكافة نزالات وأيام البطولة' : '4K Ultra HD for all tournament matches'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FFE600] shrink-0" />
                    <span>{isAr ? 'أرشيف دائم وتنزيل النزالات بدون انقطاع' : 'Lifetime replay archive & match downloads'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FFE600] shrink-0" />
                    <span>{isAr ? 'مشاهدة كواليس التدريب واللقاءات الحصرية' : 'Exclusive backstage warmup & coach cams'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>{isAr ? 'توفير أكثر من 60% مقارنة بشراء كل مباراة منفردة' : 'Save over 60% vs single match tickets'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#FFE600] font-mono tracking-tight neon-text-yellow" dir="ltr">$120</span>
                    <span className="text-xs line-through text-gray-500 font-bold">$280</span>
                  </div>
                  <span className="text-xs text-[#10B981] block font-bold">{isAr ? 'للبطولة كاملة بجميع مبارياتها' : 'all matches included'}</span>
                </div>
                <button
                  onClick={() => {
                    soundFX.playSuccess();
                    setPurchaseSuccess(isAr ? 'تم الاشتراك في تذكرة البطولة كاملة ($120)!' : 'Full Championship Pass Purchased ($120)!');
                    setTimeout(() => {
                      setPurchaseSuccess(null);
                      if (onProceedToCheckout) {
                        onProceedToCheckout('Full Tournament Stream Pass', 120);
                      }
                    }, 1200);
                  }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FFE600] to-[#FFD700] hover:from-white hover:to-white text-black font-black font-anime text-xs transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,230,0,0.4)] hover:scale-105"
                >
                  <Tv className="w-4 h-4 text-black" />
                  <span>{isAr ? 'حجز البطولة كاملة ($120)' : 'GET FULL PASS ($120)'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Security Guarantee Box */}
        <div className="p-8 rounded-3xl bg-[#0D0E17] text-center max-w-3xl mx-auto space-y-3 shadow-lg">
          <div className="flex items-center justify-center gap-2 text-white font-black font-anime text-sm">
            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            <span>{isAr ? 'ضمان التذاكر وحقوق حضور البطولات' : 'OFFICIAL YARD 300 TICKET GUARANTEE'}</span>
          </div>
          <p className="text-xs text-gray-400 font-bold leading-relaxed">
            {isAr 
              ? 'كافة التذاكر مرقمة إلكترونياً ومشفرة بتقنية الـ QR الذكية لمنع التزوير وإعادة البيع غير المصرح به. يمكنك إبراز التذكرة عبر هاتفك المحمول عند بوابات الدخول للصالة الرسمية.' 
              : 'All tournament badges are serialized and encrypted with smart anti-scalp dynamic QR codes. Show your digital badge directly on your mobile device at the official championship arena gates.'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default TicketsEventsHub;
