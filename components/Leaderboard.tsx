import React, { useState, useMemo, useEffect } from 'react';
import { Trophy, Crown, Search, Award, Calendar, Users, X, ShieldCheck, Flame, Activity, HeartPulse, Clock } from 'lucide-react';
import { Language, tr } from '../i18n';
import { handleImageError } from '../constants';
import { soundFX } from '../services/soundFX';

export interface RankedAthlete {
  rank: number;
  id: string;
  name: string;
  nameAr?: string;
  avatar: string;
  tier: string;
  auraScore: number;
  streak: number;
  workouts: number;
  stabilityIndex: number;
  hrvMs: number;
  restingHr: number;
  vo2Max: number;
  trainingHours: number;
  clubName: string;
  badge: string;
  isCurrentUser?: boolean;
}

const UNIQUE_PHOTO_ROSTER: {
  name: string;
  nameAr: string;
  avatar: string;
  club: string;
}[] = [
  { name: 'Chiara Conti', nameAr: 'كيارا كونتي', avatar: '/images/woman_italian_athlete.jpg', club: 'MILAN REFORMER STUDIO' },
  { name: 'Soo-Jin Park', nameAr: 'سو-جين بارك', avatar: '/images/woman_korean_taekwondo.jpg', club: 'SEOUL TAEKWONDO LAB' },
  { name: 'Zoe Campbell', nameAr: 'زوي كامبل', avatar: '/images/woman_caribbean_power.jpg', club: 'KINGSTON HIIT APEX' },
  { name: 'Hana Takahashi', nameAr: 'هانا تاكاهاشي', avatar: '/images/athlete_japanese_judoka.jpg', club: 'TOKYO KODOKAN SQUAD' },
  { name: 'Salma Benali', nameAr: 'سلمى بنعلي', avatar: '/images/athlete_moroccan_marathoner.jpg', club: 'ATLAS ENDURANCE LAB' },
  { name: 'Camille Laurent', nameAr: 'كاميل لوران', avatar: '/images/athlete_french_fencer.jpg', club: 'PARIS BLADE ATHLETICS' },
  { name: 'Claire Gagnon', nameAr: 'كلير غانيون', avatar: '/images/athlete_canadian_cyclist.jpg', club: 'VELODROME APEX CANADA' },
  { name: 'Amara Grant', nameAr: 'أمارا غرانت', avatar: '/images/athlete_british_pentathlete.jpg', club: 'LONDON PENTATHLON CLUB' },
  { name: 'Defne Demir', nameAr: 'دفنة دمير', avatar: '/images/athlete_turkish_weightlifter.jpg', club: 'ISTANBUL IRON LIFTERS' },
  { name: 'Elena Lin', nameAr: 'إيلينا لين', avatar: '/images/ai_human_valkyrie_female.jpg', club: 'VALKYRIE SPRINT CLUB' },
  { name: 'Nadia Navarro', nameAr: 'نادية نافارو', avatar: '/images/ai_human_female_runner.jpg', club: 'IRON VANGUARD GYM' },
  { name: 'Dr. Soren Mercer', nameAr: 'د. سورين ميرسر', avatar: '/images/ai_human_performance_coach.jpg', club: 'BIOMECHANICS ACADEMY' },
  { name: 'Antonio Vega', nameAr: 'أنطونيو فيغا', avatar: '/images/hero_banderas_muscular.jpg', club: 'MARBELLA COMBAT ATELIER' },
  { name: 'Erik Lindqvist', nameAr: 'إريك ليندكفيست', avatar: '/images/athlete_nordic_runner.jpg', club: 'OSLO ULTRA TEAM' },
  { name: 'Rafael Silva', nameAr: 'رافائيل سيلفا', avatar: '/images/athlete_brazilian_bjj.jpg', club: 'AEGIS JIU-JITSU RIO' },
  { name: 'Chidi Okafor', nameAr: 'تشيدي أوكافور', avatar: '/images/athlete_nigerian_sprinter.jpg', club: 'LAGOS VELOCITY TRACK' },
  { name: 'Min-Jun Kang', nameAr: 'مين-جون كانغ', avatar: '/images/athlete_korean_calisthenics.jpg', club: 'SEOUL CALISTHENICS' },
  { name: 'Lukas Weber', nameAr: 'لوكاس فيبر', avatar: '/images/athlete_german_rower.jpg', club: 'MUNICH HYROX HEAVY' },
  { name: 'Matteo Conti', nameAr: 'ماتيو كونتي', avatar: '/images/athlete_italian_muaythai.jpg', club: 'MILAN MUAY THAI' },
  { name: 'Diego Morales', nameAr: 'دييغو موراليس', avatar: '/images/athlete_mexican_boxer.jpg', club: 'GUADALAJARA BOXING' },
  { name: 'Liam Cooper', nameAr: 'ليام كوبر', avatar: '/images/athlete_australian_triathlete.jpg', club: 'SYDNEY IRONMAN CLUB' },
  { name: 'Arjun Bajwa', nameAr: 'أرجون باجوا', avatar: '/images/athlete_indian_wrestler.jpg', club: 'PUNJAB WRESTLING PRO' },
  { name: 'Adrian Sterling', nameAr: 'أدريان ستيرلينغ', avatar: '/images/ai_human_hero_athlete.jpg', club: 'AURA BIO-METRIC CLUB' }
];

const CLUB_NAMES = [
  'TITAN APEX STRIKE CLUB',
  'VALKYRIE SPRINT CLUB',
  'HAYABUSA TACTICAL LAB',
  'KINETIC ENDURANCE SQUAD',
  'APEX HEAVYWEIGHTS',
  'BIOMECHANICS ACADEMY',
  'IRON VANGUARD GYM',
  'OBSIDIAN COMBAT LAB',
  'GLOBAL HYROX BRIGADE',
  'AURA BIO-METRIC CLUB',
  'ELITE PERFORMANCE UNIT',
  'YARD 300 PERFORMANCE'
];

const FIRST_NAMES = [
  'Kenji', 'Takeshi', 'Daiki', 'Hiroshi', 'Sora', 'Ren', 'Kaito', 'Riku', 'Yuto', 'Kazuki',
  'Aoi', 'Sakura', 'Yuki', 'Emi', 'Hana', 'Mei', 'Rei', 'Kira', 'Elena', 'Nadia',
  'Marcus', 'Leona', 'Viktor', 'Darius', 'Chloe', 'Zack', 'Farah', 'Tarek', 'Samir', 'Zayd',
  'Layla', 'Nour', 'Amina', 'Faris', 'Hamza', 'Karim', 'Sultan', 'Malik', 'Rayan', 'Yasmin'
];

const SURNAMES = [
  'Vance', 'Vanguard', 'Cole', 'Striker', 'Kael', 'Sato', 'Mercer', 'Storm', 'Cross', 'Apex',
  'Sterling', 'Brooks', 'Hayes', 'Lin', 'Rostova', 'Navarro', 'Al-Mansoor', 'Khoury', 'Steele', 'Overdrive'
];

export const WEEKLY_CHAMPIONS: RankedAthlete[] = [
  { rank: 1, id: 'w-1', name: 'Tarik Al-Mansoor', nameAr: 'طارق المنصور', avatar: '/images/ai_human_gulf_champion.jpg', tier: 'S-RANK OVERDRIVE', auraScore: 9980, streak: 30, workouts: 18, stabilityIndex: 99.8, hrvMs: 112, restingHr: 42, vo2Max: 68.4, trainingHours: 24.5, clubName: 'APEX HEAVYWEIGHTS', badge: 'WEEKLY #1', isCurrentUser: true },
  { rank: 2, id: 'w-2', name: 'Isabella Silva', nameAr: 'إيزابيلا سيلفا', avatar: '/images/woman_brazilian_fitness.jpg', tier: 'S-RANK OVERDRIVE', auraScore: 9940, streak: 29, workouts: 17, stabilityIndex: 99.6, hrvMs: 108, restingHr: 44, vo2Max: 66.8, trainingHours: 23.0, clubName: 'RIO APEX COMBAT', badge: 'VALKYRIE #1' },
  { rank: 3, id: 'w-3', name: 'Victor Kael', nameAr: 'فيكتور كايل', avatar: '/images/ai_human_tactical_male.jpg', tier: 'S-RANK OVERDRIVE', auraScore: 9890, streak: 27, workouts: 16, stabilityIndex: 99.4, hrvMs: 104, restingHr: 45, vo2Max: 65.5, trainingHours: 21.8, clubName: 'OBSIDIAN COMBAT LAB', badge: 'S-RANK ELITE' },
  { rank: 4, id: 'w-4', name: 'Anastasia Volkov', nameAr: 'أناستازيا فولكوف', avatar: '/images/woman_slavic_boxer.jpg', tier: 'TIER 3 TITAN', auraScore: 9840, streak: 25, workouts: 15, stabilityIndex: 99.1, hrvMs: 101, restingHr: 46, vo2Max: 64.9, trainingHours: 20.5, clubName: 'MOSCOW STRIKE CLUB', badge: 'BOXING ELITE' },
  { rank: 5, id: 'w-5', name: 'Darius Cole', nameAr: 'داريوس كول', avatar: '/images/ai_human_heavyweight_boxer.jpg', tier: 'TIER 3 TITAN', auraScore: 9780, streak: 23, workouts: 14, stabilityIndex: 98.8, hrvMs: 98, restingHr: 47, vo2Max: 63.7, trainingHours: 19.6, clubName: 'TITAN APEX STRIKE CLUB', badge: 'HEAVYWEIGHT PRO' },
  { rank: 6, id: 'w-6', name: 'Noura Al-Rashid', nameAr: 'نورة الراشد', avatar: '/images/woman_levantine_striker.jpg', tier: 'TIER 3 TITAN', auraScore: 9730, streak: 22, workouts: 14, stabilityIndex: 98.5, hrvMs: 96, restingHr: 47, vo2Max: 63.1, trainingHours: 19.0, clubName: 'YARD COMBAT QUEENS', badge: 'STRIKE ELITE' },
  { rank: 7, id: 'w-7', name: 'Marcus Vance', nameAr: 'ماركوس فانس', avatar: '/images/ai_human_striker_male.jpg', tier: 'TIER 2 KINETIC', auraScore: 9660, streak: 20, workouts: 13, stabilityIndex: 98.2, hrvMs: 93, restingHr: 48, vo2Max: 62.4, trainingHours: 18.2, clubName: 'HAYABUSA TACTICAL LAB', badge: 'PRECISION PRO' },
  { rank: 8, id: 'w-8', name: 'Valeria Gomez', nameAr: 'فاليريا غوميز', avatar: '/images/woman_latina_sprinter.jpg', tier: 'TIER 2 KINETIC', auraScore: 9590, streak: 18, workouts: 12, stabilityIndex: 97.9, hrvMs: 91, restingHr: 49, vo2Max: 61.9, trainingHours: 17.5, clubName: 'MEDELLIN HYROX PRO', badge: 'VELOCITY LEAD' },
  { rank: 9, id: 'w-9', name: 'Kenji Sato', nameAr: 'كينجي ساتو', avatar: '/images/ai_human_aerial_male.jpg', tier: 'TIER 2 KINETIC', auraScore: 9520, streak: 16, workouts: 12, stabilityIndex: 97.6, hrvMs: 89, restingHr: 49, vo2Max: 61.2, trainingHours: 16.8, clubName: 'KINETIC ENDURANCE SQUAD', badge: 'AERO MASTER' },
  { rank: 10, id: 'w-10', name: 'Freya Lindholm', nameAr: 'فريا ليندهولم', avatar: '/images/woman_nordic_valkyrie.jpg', tier: 'TIER 2 KINETIC', auraScore: 9460, streak: 15, workouts: 11, stabilityIndex: 97.3, hrvMs: 87, restingHr: 50, vo2Max: 60.6, trainingHours: 16.0, clubName: 'STOCKHOLM IRON', badge: 'NORDIC STRENGTH' }
];

export const MONTHLY_CHAMPIONS: RankedAthlete[] = Array.from({ length: 50 }, (_, i) => {
  const rank = i + 1;
  if (rank <= 10) {
    const base = WEEKLY_CHAMPIONS[rank - 1];
    return {
      ...base,
      workouts: base.workouts * 4,
      trainingHours: Number((base.trainingHours * 4).toFixed(1)),
      badge: rank === 1 ? 'MONTHLY #1' : rank <= 5 ? 'S-RANK MONTHLY' : 'TITAN 50'
    };
  }
  const rosterIdx = rank - 11;
  const fName = FIRST_NAMES[(i * 3) % FIRST_NAMES.length];
  const lName = SURNAMES[(i * 5) % SURNAMES.length];
  const club = CLUB_NAMES[i % CLUB_NAMES.length];
  const photoEntry = rosterIdx < UNIQUE_PHOTO_ROSTER.length ? UNIQUE_PHOTO_ROSTER[rosterIdx] : null;
  const stability = Number((97.0 - i * 0.08).toFixed(1));
  const score = 9400 - i * 45;

  return {
    rank,
    id: `m-${rank}`,
    name: photoEntry ? photoEntry.name : `${fName} ${lName}`,
    nameAr: photoEntry ? photoEntry.nameAr : undefined,
    avatar: photoEntry ? photoEntry.avatar : '',
    tier: rank <= 20 ? 'S-RANK TITAN' : 'A-RANK PRO',
    auraScore: score,
    streak: Math.max(5, 30 - Math.floor(i / 2)),
    workouts: Math.max(20, 68 - i),
    stabilityIndex: stability,
    hrvMs: Math.max(66, 92 - Math.floor(i / 2)),
    restingHr: Math.min(58, 48 + Math.floor(i / 6)),
    vo2Max: Number(Math.max(52.0, 61.5 - i * 0.16).toFixed(1)),
    trainingHours: Number(Math.max(38.0, 92.0 - i * 0.9).toFixed(1)),
    clubName: photoEntry ? photoEntry.club : club,
    badge: rank <= 20 ? 'S-RANK PRO' : 'ELITE 50'
  };
});

const ALL_TIME_UNIQUE_ROSTER = [
  ...WEEKLY_CHAMPIONS.map((w) => ({
    name: w.name,
    nameAr: w.nameAr || w.name,
    avatar: w.avatar,
    club: w.clubName
  })),
  ...UNIQUE_PHOTO_ROSTER
];

export const ALL_TIME_300_CHAMPIONS: RankedAthlete[] = Array.from({ length: 300 }, (_, i) => {
  const rank = i + 1;
  if (rank === 1) {
    return {
      rank: 1,
      id: 'legion-1',
      name: 'yam suw (Founder)',
      nameAr: 'يام سو (المؤسس)',
      avatar: '/images/yam_suw_athlete.jpg',
      tier: 'GRANDMASTER',
      auraScore: 49800,
      streak: 365,
      workouts: 412,
      stabilityIndex: 99.9,
      hrvMs: 118,
      restingHr: 39,
      vo2Max: 71.2,
      trainingHours: 685.0,
      clubName: 'YARD SHAOLIN DOJO',
      badge: 'LEGEND #1'
    };
  }
  if (rank === 2) {
    return {
      rank: 2,
      id: 'legion-2',
      name: 'M.T.K · Pilates Elite',
      nameAr: 'M.T.K · نخبة البيلاتس',
      avatar: '/images/mtk_anime_pink_pilates.jpg',
      tier: 'CO-FOUNDER ELITE',
      auraScore: 48650,
      streak: 340,
      workouts: 398,
      stabilityIndex: 99.8,
      hrvMs: 114,
      restingHr: 41,
      vo2Max: 69.8,
      trainingHours: 642.0,
      clubName: 'YARD PILATES STUDIO',
      badge: 'PILATES MASTER'
    };
  }
  if (rank === 3) {
    return {
      rank: 3,
      id: 'legion-3',
      name: 'A.R.B (Tactical)',
      nameAr: 'إي آر بي (تكتيك)',
      avatar: '/images/arb_athlete.jpg',
      tier: 'GRANDMASTER',
      auraScore: 47900,
      streak: 320,
      workouts: 385,
      stabilityIndex: 99.7,
      hrvMs: 111,
      restingHr: 42,
      vo2Max: 68.5,
      trainingHours: 618.5,
      clubName: 'YARD TACTICAL UNIT',
      badge: 'STRATEGIST'
    };
  }

  const stability = Number(Math.max(85.0, 99.6 - i * 0.045).toFixed(1));
  const score = Math.max(12500, 47200 - i * 112);
  const streak = Math.max(30, 310 - i);
  const workouts = Math.max(95, 380 - i);
  const hrvMs = Math.max(62, 108 - Math.floor(i / 6));
  const restingHr = Math.min(60, 43 + Math.floor(i / 18));
  const vo2Max = Number(Math.max(49.5, 67.5 - i * 0.055).toFixed(1));
  const trainingHours = Number(Math.max(160.0, 595.0 - i * 1.35).toFixed(1));

  let tier = '300 LEGION';
  if (rank <= 25) tier = 'GRANDMASTER';
  else if (rank <= 75) tier = 'S-RANK SOVEREIGN';
  else if (rank <= 150) tier = 'TIER 3 TITAN';
  else tier = 'TIER 2 STABLE';

  const badge = rank <= 10 ? 'TOP 10 ALL-TIME' : rank <= 50 ? 'GOLDEN 50' : rank <= 100 ? '300 VANGUARD' : 'STABLE 300';
  const rosterIdx = rank - 4;
  if (rosterIdx < ALL_TIME_UNIQUE_ROSTER.length) {
    const p = ALL_TIME_UNIQUE_ROSTER[rosterIdx];
    return {
      rank,
      id: `legion-${rank}`,
      name: p.name,
      nameAr: p.nameAr,
      avatar: p.avatar,
      tier,
      auraScore: score,
      streak,
      workouts,
      stabilityIndex: stability,
      hrvMs,
      restingHr,
      vo2Max,
      trainingHours,
      clubName: p.club,
      badge
    };
  }

  const fName = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
  const lName = SURNAMES[(i * 11) % SURNAMES.length];
  const club = CLUB_NAMES[(i * 3) % CLUB_NAMES.length];

  return {
    rank,
    id: `legion-${rank}`,
    name: `${fName} ${lName}`,
    avatar: '',
    tier,
    auraScore: score,
    streak,
    workouts,
    stabilityIndex: stability,
    hrvMs,
    restingHr,
    vo2Max,
    trainingHours,
    clubName: club,
    badge
  };
});

interface LeaderboardProps {
  currentLang?: Language;
  initialTimeframe?: 'weekly' | 'monthly' | 'allTime';
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentLang = 'en', initialTimeframe = 'weekly' }) => {
  const isAr = currentLang === 'ar';

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>(initialTimeframe);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rangeFilter, setRangeFilter] = useState<'all' | '1-50' | '51-100' | '101-200' | '201-300'>('all');
  const [selectedAthlete, setSelectedAthlete] = useState<RankedAthlete | null>(null);
  const pageSize = 25;

  useEffect(() => {
    setTimeframe(initialTimeframe);
    setPage(1);
  }, [initialTimeframe]);

  const athletes = useMemo(() => {
    if (timeframe === 'weekly') return WEEKLY_CHAMPIONS;
    if (timeframe === 'monthly') return MONTHLY_CHAMPIONS;
    return ALL_TIME_300_CHAMPIONS;
  }, [timeframe]);

  const filteredAthletes = useMemo(() => {
    return athletes.filter((a) => {
      if (timeframe === 'allTime' && rangeFilter !== 'all') {
        if (rangeFilter === '1-50' && (a.rank < 1 || a.rank > 50)) return false;
        if (rangeFilter === '51-100' && (a.rank < 51 || a.rank > 100)) return false;
        if (rangeFilter === '101-200' && (a.rank < 101 || a.rank > 200)) return false;
        if (rangeFilter === '201-300' && (a.rank < 201 || a.rank > 300)) return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        a.name.toLowerCase().includes(q) ||
        (a.nameAr && a.nameAr.toLowerCase().includes(q)) ||
        a.clubName.toLowerCase().includes(q) ||
        String(a.rank) === q
      );
    });
  }, [athletes, timeframe, rangeFilter, search]);

  const totalPages = Math.ceil(filteredAthletes.length / pageSize) || 1;
  const paginatedAthletes = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAthletes.slice(start, start + pageSize);
  }, [filteredAthletes, page, pageSize]);

  const handleTimeframeChange = (tf: 'weekly' | 'monthly' | 'allTime') => {
    soundFX.playButtonClick();
    setTimeframe(tf);
    setPage(1);
    setSearch('');
    setRangeFilter('all');
  };

  // Architectural podium order on desktop: #2 left, #1 raised center, #3 right
  const podiumTop3 = athletes.slice(0, 3);
  const podiumOrder = podiumTop3.length === 3 ? [podiumTop3[1], podiumTop3[0], podiumTop3[2]] : podiumTop3;

  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10 text-white ${isAr ? 'text-right' : 'text-left'}`}>
      {/* Executive Championship Header */}
      <div className="rounded-2xl bg-[#0B0E16] border border-white/[0.08] p-6 sm:p-8 md:p-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#D4AF37] uppercase tracking-[0.18em]">
              <Trophy className="w-3.5 h-3.5" />
              <span>
                {timeframe === 'weekly'
                  ? tr(currentLang, {
                      en: 'WEEKLY CIRCUIT · TOP 10 STANDINGS',
                      es: 'CIRCUITO SEMANAL · TOP 10 LÍDERES',
                      fr: 'CIRCUIT HEBDO · TOP 10 CLASSEMENT',
                      ar: 'التصنيف الأسبوعي — أفضل 10 أبطال'
                    })
                  : timeframe === 'monthly'
                  ? tr(currentLang, {
                      en: 'MONTHLY TITAN SERIES · TOP 50',
                      es: 'SERIE MENSUAL TITAN · TOP 50',
                      fr: 'SÉRIE MENSUELLE TITAN · TOP 50',
                      ar: 'التصنيف الشهري — أفضل 50 بطلاً'
                    })
                  : tr(currentLang, {
                      en: 'THE 300 ALL-TIME LEGION · STABILITY INDEX',
                      es: 'LA LEGIÓN HISTÓRICA DE LOS 300 · ÍNDICE DE ESTABILIDAD',
                      fr: 'LA LÉGION HISTORIQUE DES 300 · INDICE DE STABILITÉ',
                      ar: 'فيلق الـ 300 الدائم — مؤشر الثبات'
                    })}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              {tr(currentLang, {
                en: 'Global S-Rank Champions & Training Telemetry',
                es: 'Campeones Globales S-Rank y Lecturas de Entreno',
                fr: 'Champions Mondiaux S-Rank & Mesures d’Entraînement',
                ar: 'لوحة الشامبيونز العالمية وقراءات التدريب'
              })}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              {tr(currentLang, {
                en: 'Verified athletic rankings scored on neuromuscular stability index, HRV recovery, VO2 Max, training volume, and unbroken conditioning discipline.',
                es: 'Clasificación atlética verificada mediante estabilidad neuromuscular, VFC, VO2 Máx, volumen de entrenamiento y racha de disciplina.',
                fr: 'Classement athlétique vérifié selon l’indice de stabilité, la VFC, le VO2 Max, le volume horaire et la régularité.',
                ar: 'تصنيف شفاف يعتمد على ثبات الجاهزية الحيوية، قراءات HRV و VO2 Max، ساعات التدريب، وسلاسل الانضباط المستمر.'
              })}
            </p>
          </div>

          <div className="flex items-center gap-6 px-5 py-4 rounded-xl bg-[#07080D] border border-emerald-500/30 shrink-0 font-mono tabular-nums">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                {timeframe === 'allTime'
                  ? tr(currentLang, { en: 'LEGION CAP', es: 'CUPO LEGIÓN', fr: 'PLAFOND LÉGION', ar: 'السعة القصوى' })
                  : tr(currentLang, { en: 'CIRCUIT PURSE', es: 'PREMIO CIRCUITO', fr: 'DOTATION', ar: 'صندوق الجوائز' })}
              </span>
              <span className="text-2xl font-bold text-[#D4AF37]">
                {timeframe === 'allTime' ? '300 TITANS' : '10,000 YARDX'}
              </span>
            </div>
            <div className="h-9 w-px bg-white/[0.08]" />
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                {tr(currentLang, { en: 'VERIFICATION', es: 'VERIFICACIÓN', fr: 'VÉRIFICATION', ar: 'التوثيق' })}
              </span>
              <span className="text-xs font-semibold text-[#10B981]">ACWR · HRV · VO2</span>
            </div>
          </div>
        </div>

        {/* Controls Bar: Timeframe Segmented Switcher + Search */}
        <div className="pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center bg-[#07080D] p-1 rounded-xl border border-white/[0.08] text-xs w-fit">
            <button
              type="button"
              onClick={() => handleTimeframeChange('weekly')}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-semibold flex items-center gap-1.5 whitespace-nowrap ${
                timeframe === 'weekly' ? 'bg-[#D4AF37] text-[#07080D]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{tr(currentLang, { en: 'Weekly (10)', es: 'Semanal (10)', fr: 'Hebdo (10)', ar: 'أسبوعي (10)' })}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTimeframeChange('monthly')}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-semibold flex items-center gap-1.5 whitespace-nowrap ${
                timeframe === 'monthly' ? 'bg-[#00F0FF] text-[#07080D]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{tr(currentLang, { en: 'Monthly (50)', es: 'Mensual (50)', fr: 'Mensuel (50)', ar: 'شهري (50)' })}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTimeframeChange('allTime')}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-semibold flex items-center gap-1.5 whitespace-nowrap ${
                timeframe === 'allTime' ? 'bg-[#10B981] text-[#07080D]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{tr(currentLang, { en: 'All-Time 300', es: 'Legión 300', fr: 'Légion 300', ar: 'فيلق 300' })}</span>
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className={`w-4 h-4 text-slate-500 absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={tr(currentLang, {
                en: 'Search champion, club, or rank #...',
                es: 'Buscar campeón, club o puesto #...',
                fr: 'Rechercher champion, club ou rang #...',
                ar: 'ابحث باسم البطل أو النادي أو الترتيب...'
              })}
              className={`w-full ${isAr ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'} py-2.5 rounded-xl bg-[#07080D] border border-white/[0.1] text-xs text-white placeholder-slate-500 outline-none focus:border-[#10B981]`}
            />
          </div>
        </div>

        {/* All-Time Bracket Jump */}
        {timeframe === 'allTime' && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06] text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              {tr(currentLang, { en: 'Rank Bracket:', es: 'Rango:', fr: 'Tranche :', ar: 'تصفية المراتب:' })}
            </span>
            {[
              { id: 'all', label: tr(currentLang, { en: 'All 300', es: 'Todos 300', fr: 'Tous 300', ar: 'الكل (300)' }) },
              { id: '1-50', label: '#1–50' },
              { id: '51-100', label: '#51–100' },
              { id: '101-200', label: '#101–200' },
              { id: '201-300', label: '#201–300' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setRangeFilter(r.id as any);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                  rangeFilter === r.id
                    ? 'bg-[#10B981] text-[#050807]'
                    : 'bg-[#07080D] text-slate-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sovereign Architectural Podium (#2 Left, #1 Center Elevated, #3 Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        {podiumOrder.map((ath) => {
          const isFirst = ath.rank === 1;
          const isSecond = ath.rank === 2;
          const accent = isFirst ? '#D4AF37' : isSecond ? '#CBD5E1' : '#10B981';

          return (
            <button
              key={ath.id}
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setSelectedAthlete(ath);
              }}
              className={`text-start rounded-2xl bg-[#0B0E16] border p-5 transition-all duration-200 cursor-pointer hover:bg-[#101420] flex flex-col justify-between space-y-4 ${
                isFirst ? 'border-[#D4AF37]/60 md:pb-7 shadow-[0_20px_50px_rgba(212,175,55,0.12)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold tracking-wider" style={{ color: accent }}>
                  {tr(currentLang, { en: 'RANK', es: 'PUESTO', fr: 'RANG', ar: 'المركز' })} #{ath.rank}
                </span>
                <span className="text-[11px] text-slate-400 uppercase">{ath.badge}</span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border"
                  style={{ borderColor: `${accent}60` }}
                >
                  <img
                    src={ath.avatar}
                    alt={ath.name}
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-base font-bold text-white truncate">
                    {isAr && ath.nameAr ? ath.nameAr : ath.name}
                  </h3>
                  <span className="text-[11px] text-[#D4AF37] font-medium block truncate">{ath.clubName}</span>
                  <span className="text-[11px] text-slate-400 font-mono block tabular-nums">
                    {ath.tier} · {ath.stabilityIndex}%
                  </span>
                </div>
              </div>

              {/* Training Telemetry Summary Row */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#07080D] border border-emerald-500/20 text-[10px] font-mono tabular-nums" dir="ltr">
                <span className="text-[#10B981]">HRV {ath.hrvMs}ms</span>
                <span className="text-slate-300">RHR {ath.restingHr}bpm</span>
                <span className="text-[#00F0FF]">VO2 {ath.vo2Max}</span>
                <span className="text-[#D4AF37]">{ath.trainingHours}h</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.07] font-mono tabular-nums text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">{tr(currentLang, { en: 'SCORE', es: 'PUNTOS', fr: 'SCORE', ar: 'النقاط' })}</span>
                  <span className="font-bold text-white">{ath.auraScore.toLocaleString('en-US')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{tr(currentLang, { en: 'STREAK', es: 'RACHA', fr: 'SÉRIE', ar: 'السلسلة' })}</span>
                  <span className="font-bold text-[#D4AF37]">{ath.streak}d</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{tr(currentLang, { en: 'BOUTS', es: 'SESIONES', fr: 'SÉANCES', ar: 'الحصص' })}</span>
                  <span className="font-bold text-[#10B981]">{ath.workouts}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Leaderboard Precision Table */}
      <div className="bg-[#0B0E16] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              {timeframe === 'weekly'
                ? tr(currentLang, { en: 'Weekly Champions Standing (10)', es: 'Clasificación Semanal (10)', fr: 'Classement Hebdomadaire (10)', ar: 'قائمة أبطال الأسبوع (10)' })
                : timeframe === 'monthly'
                ? tr(currentLang, { en: 'Monthly Titans Standing (50)', es: 'Clasificación Mensual (50)', fr: 'Classement Mensuel (50)', ar: 'قائمة أبطال الشهر (50)' })
                : tr(currentLang, { en: 'All-Time 300 Legion', es: 'Legión Histórica 300', fr: 'Légion Historique 300', ar: 'قائمة فيلق الـ 300 الكلي' })}
            </h2>
          </div>

          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {filteredAthletes.length} {tr(currentLang, { en: 'Athletes', es: 'Atletas', fr: 'Athlètes', ar: 'بطل' })} ·{' '}
            {tr(currentLang, { en: 'Click row to inspect', es: 'Pulsa para ver lecturas', fr: 'Cliquer pour inspecter', ar: 'انقر لفحص القراءات' })}
          </span>
        </div>

        <div className="overflow-x-auto yard-slim-scrollbar">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] bg-[#07080D] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-16">#</th>
                <th className="py-3.5 px-4 text-start">{tr(currentLang, { en: 'ATHLETE & CLUB', es: 'ATLETA Y CLUB', fr: 'ATHLÈTE & CLUB', ar: 'الرياضي والنادي' })}</th>
                <th className="py-3.5 px-4 text-start hidden sm:table-cell">{tr(currentLang, { en: 'TIER & STABILITY', es: 'NIVEL Y ESTABILIDAD', fr: 'NIVEAU & STABILITÉ', ar: 'الفئة والثبات' })}</th>
                <th className="py-3.5 px-4 text-start hidden lg:table-cell">{tr(currentLang, { en: 'TRAINING READINGS', es: 'LECTURAS DE ENTRENO', fr: 'MESURES D’ENTRAÎNEMENT', ar: 'قراءات التدريب' })}</th>
                <th className="py-3.5 px-4 text-center">{tr(currentLang, { en: 'STREAK', es: 'RACHA', fr: 'SÉRIE', ar: 'السلسلة' })}</th>
                <th className="py-3.5 px-4 text-center hidden md:table-cell">{tr(currentLang, { en: 'BOUTS', es: 'SESIONES', fr: 'SÉANCES', ar: 'الحصص' })}</th>
                <th className="py-3.5 px-4 text-end">{tr(currentLang, { en: 'AURA SCORE', es: 'PUNTUACIÓN', fr: 'SCORE AURA', ar: 'نقاط الأداء' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-xs">
              {paginatedAthletes.map((ath) => (
                <tr
                  key={ath.id}
                  onClick={() => {
                    soundFX.playButtonClick();
                    setSelectedAthlete(ath);
                  }}
                  className={`cursor-pointer transition-colors hover:bg-white/[0.03] ${
                    ath.isCurrentUser ? 'bg-[#D4AF37]/[0.06]' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center font-mono tabular-nums font-bold">
                    <span className={ath.rank <= 3 ? 'text-[#D4AF37]' : 'text-slate-400'}>{ath.rank}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {ath.avatar ? (
                        <img
                          src={ath.avatar}
                          alt={ath.name}
                          onError={handleImageError}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover object-top bg-[#07080D] shrink-0 border border-white/[0.08]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#111521] border border-[#D4AF37]/25 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-[#D4AF37]">
                          {ath.name
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white truncate">
                            {isAr && ath.nameAr ? ath.nameAr : ath.name}
                          </span>
                          {ath.isCurrentUser && (
                            <span className="text-[10px] font-mono text-[#10B981]">
                              · {tr(currentLang, { en: 'YOU', es: 'TÚ', fr: 'VOUS', ar: 'أنت' })}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate">{ath.clubName}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 hidden sm:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
                        <span className="text-slate-300">{ath.tier}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[#10B981] font-semibold">{ath.stabilityIndex}%</span>
                      </div>
                      <div className="w-28 h-1 rounded-full bg-[#161B28] overflow-hidden">
                        <div className="h-full bg-[#10B981]" style={{ width: `${ath.stabilityIndex}%` }} />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 hidden lg:table-cell font-mono tabular-nums" dir="ltr">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[#10B981] border border-emerald-500/20">
                        HRV {ath.hrvMs}ms
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[#00F0FF]">
                        VO2 {ath.vo2Max}
                      </span>
                      <span className="text-slate-400">
                        {ath.restingHr}bpm · {ath.trainingHours}h
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center font-mono tabular-nums text-[#D4AF37] font-semibold">
                    {ath.streak}d
                  </td>

                  <td className="py-3 px-4 text-center hidden md:table-cell font-mono tabular-nums text-slate-300">
                    {ath.workouts}
                  </td>

                  <td className="py-3 px-4 text-end font-mono tabular-nums font-bold text-white">
                    {ath.auraScore.toLocaleString('en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clean Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-white/[0.07] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              {tr(currentLang, {
                en: `Page ${page} of ${totalPages}`,
                es: `Página ${page} de ${totalPages}`,
                fr: `Page ${page} sur ${totalPages}`,
                ar: `صفحة ${page} من ${totalPages}`
              })}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => {
                  soundFX.playButtonClick();
                  setPage((p) => Math.max(1, p - 1));
                }}
                className="px-3 py-1.5 rounded-lg bg-[#07080D] border border-white/[0.08] disabled:opacity-40 cursor-pointer text-white"
              >
                {tr(currentLang, { en: 'Prev', es: 'Anterior', fr: 'Préc.', ar: 'السابق' })}
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => {
                  soundFX.playButtonClick();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className="px-3 py-1.5 rounded-lg bg-[#07080D] border border-white/[0.08] disabled:opacity-40 cursor-pointer text-white"
              >
                {tr(currentLang, { en: 'Next', es: 'Siguiente', fr: 'Suiv.', ar: 'التالي' })}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Athlete Telemetry Dossier Modal */}
      {selectedAthlete && (
        <div
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedAthlete(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#0B0E16] border border-emerald-500/30 p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
                {tr(currentLang, {
                  en: `CHAMPION TELEMETRY DOSSIER · #${selectedAthlete.rank}`,
                  es: `EXPEDIENTE DE TELEMETRÍA · #${selectedAthlete.rank}`,
                  fr: `DOSSIER TÉLÉMÉTRIQUE · #${selectedAthlete.rank}`,
                  ar: `ملف قراءات البطل #${selectedAthlete.rank}`
                })}
              </span>
              <button
                type="button"
                onClick={() => setSelectedAthlete(null)}
                className="p-1.5 rounded-lg bg-[#07080D] text-slate-400 hover:text-white cursor-pointer"
                aria-label="Close dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {selectedAthlete.avatar ? (
                <img
                  src={selectedAthlete.avatar}
                  alt={selectedAthlete.name}
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover object-top border border-[#D4AF37]/40 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#111521] border border-[#D4AF37]/40 flex items-center justify-center font-mono text-lg font-bold text-[#D4AF37] shrink-0">
                  {selectedAthlete.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="space-y-1 min-w-0">
                <h3 className="text-xl font-bold text-white truncate">
                  {isAr && selectedAthlete.nameAr ? selectedAthlete.nameAr : selectedAthlete.name}
                </h3>
                <p className="text-xs text-[#D4AF37] font-medium truncate">{selectedAthlete.clubName}</p>
                <p className="text-[11px] font-mono text-slate-400">{selectedAthlete.tier} · {selectedAthlete.badge}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono tabular-nums text-xs">
              <div className="p-3 rounded-xl bg-[#07080D] border border-white/[0.07]">
                <span className="text-[10px] text-slate-400 block mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#00F0FF]" />
                  <span>{tr(currentLang, { en: 'AURA SCORE', es: 'PUNTUACIÓN', fr: 'SCORE AURA', ar: 'النقاط' })}</span>
                </span>
                <span className="text-lg font-bold text-white">{selectedAthlete.auraScore.toLocaleString('en-US')}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#07080D] border border-white/[0.07]">
                <span className="text-[10px] text-slate-400 block mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                  <span>{tr(currentLang, { en: 'STABILITY', es: 'ESTABILIDAD', fr: 'STABILITÉ', ar: 'الثبات' })}</span>
                </span>
                <span className="text-lg font-bold text-[#10B981]">{selectedAthlete.stabilityIndex}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#07080D] border border-emerald-500/25">
                <span className="text-[10px] text-slate-400 block mb-1 flex items-center gap-1">
                  <HeartPulse className="w-3 h-3 text-[#10B981]" />
                  <span>HRV RECOVERY</span>
                </span>
                <span className="text-lg font-bold text-[#10B981]">{selectedAthlete.hrvMs} ms</span>
              </div>
              <div className="p-3 rounded-xl bg-[#07080D] border border-white/[0.07]">
                <span className="text-[10px] text-slate-400 block mb-1">VO2 MAX · RHR</span>
                <span className="text-base font-bold text-[#00F0FF]">{selectedAthlete.vo2Max} · {selectedAthlete.restingHr}bpm</span>
              </div>
              <div className="p-3 rounded-xl bg-[#07080D] border border-white/[0.07]">
                <span className="text-[10px] text-slate-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#D4AF37]" />
                  <span>{tr(currentLang, { en: 'TRAINING HRS', es: 'HORAS ENTRENO', fr: 'HEURES', ar: 'ساعات التدريب' })}</span>
                </span>
                <span className="text-lg font-bold text-white">{selectedAthlete.trainingHours}h</span>
              </div>
              <div className="p-3 rounded-xl bg-[#07080D] border border-white/[0.07]">
                <span className="text-[10px] text-slate-400 block mb-1 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#D4AF37]" />
                  <span>{tr(currentLang, { en: 'STREAK / BOUTS', es: 'RACHA / SES.', fr: 'SÉRIE / SÉANCES', ar: 'السلسلة / الحصص' })}</span>
                </span>
                <span className="text-lg font-bold text-[#D4AF37]">{selectedAthlete.streak}d · {selectedAthlete.workouts}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
