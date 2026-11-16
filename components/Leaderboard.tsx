/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Crown,
  Flame,
  Award,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Activity,
  HeartPulse,
  Timer
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

interface LeaderboardProps {
  currentLang?: Language;
  compactHome?: boolean;
  onExpandFull?: () => void;
}

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
  restingHrBpm: number;
  vo2Max: number;
  trainingHours: number;
  clubName: string;
  badge: string;
  isCurrentUser?: boolean;
}

const AVATAR_POOL = [
  '/images/ai_human_gulf_champion.jpg',
  '/images/athlete_moroccan_marathoner.jpg',
  '/images/athlete_german_rower.jpg',
  '/images/athlete_korean_calisthenics.jpg',
  '/images/athlete_mexican_boxer.jpg',
  '/images/athlete_nordic_runner.jpg',
  '/images/ai_human_female_runner.jpg',
  '/images/athlete_brazilian_bjj.jpg',
  '/images/ai_human_arena_duo.jpg',
  '/images/athlete_british_pentathlete.jpg'
];

const CLUB_NAMES = [
  'TITAN APEX ATHLETICS',
  'VALKYRIE SPRINT CLUB',
  'YARD ENDURANCE ACADEMY',
  'DUBAI COMBAT HOUSE',
  'MADRID IRON CLUB',
  'PARIS PERFORMANCE LAB',
  'IRON VANGUARD GYM',
  'BAZARUTO BIO-SQUAD',
  'HYROX ELITE BRIGADE',
  'AURA BIOMETRIC LAB',
  'TOKYO CALISTHENICS PRO',
  'SHAOLIN STRENGTH LEGION'
];

const FIRST_NAMES = [
  'Kenji', 'Takeshi', 'Daiki', 'Hiroshi', 'Sora', 'Ren', 'Kaito', 'Riku', 'Yuto', 'Kazuki',
  'Aoi', 'Sakura', 'Yuki', 'Emi', 'Hana', 'Mei', 'Rei', 'Kira', 'Asuka', 'Kenta',
  'Marcus', 'Elena', 'Viktor', 'Darius', 'Chloe', 'Mateo', 'Leona', 'Tarek', 'Samir', 'Zayd',
  'Layla', 'Nour', 'Amina', 'Faris', 'Hamza', 'Karim', 'Sultan', 'Malik', 'Rayan', 'Omar'
];

const SURNAMES = [
  'Al-Mansoor', 'Vanguard', 'Sato', 'Keller', 'Silva', 'Moreau', 'Morales', 'Larsson', 'Ferreira', 'Bennett',
  'Navarro', 'Okafor', 'Takahashi', 'Kowalski', 'Haddad', 'Diallo', 'Hassan', 'Rossi', 'Park', 'Sterling'
];

// 1. Weekly Top 10 Champions with verified Training Telemetry
export const WEEKLY_CHAMPIONS: RankedAthlete[] = [
  { rank: 1, id: 'w-1', name: 'Tarik Al-Mansoor', nameAr: 'طارق المنصور', avatar: '/images/ai_human_gulf_champion.jpg', tier: 'S-RANK ELITE', auraScore: 9980, streak: 30, workouts: 18, stabilityIndex: 99.8, hrvMs: 118, restingHrBpm: 44, vo2Max: 68.4, trainingHours: 24.5, clubName: 'DUBAI COMBAT HOUSE', badge: 'WEEKLY #1', isCurrentUser: true },
  { rank: 2, id: 'w-2', name: 'Hayate Kenji', nameAr: 'هاياتي كينجي', avatar: '/images/athlete_moroccan_marathoner.jpg', tier: 'S-RANK ELITE', auraScore: 9910, streak: 28, workouts: 16, stabilityIndex: 99.4, hrvMs: 114, restingHrBpm: 45, vo2Max: 66.9, trainingHours: 22.8, clubName: 'TOKYO CALISTHENICS PRO', badge: 'WEEKLY #2' },
  { rank: 3, id: 'w-3', name: 'Lukas Weber', nameAr: 'لوكاس فيبر', avatar: '/images/athlete_german_rower.jpg', tier: 'TIER 3 TITAN', auraScore: 9840, streak: 25, workouts: 15, stabilityIndex: 99.1, hrvMs: 109, restingHrBpm: 47, vo2Max: 65.2, trainingHours: 21.4, clubName: 'TITAN APEX ATHLETICS', badge: 'WEEKLY #3' },
  { rank: 4, id: 'w-4', name: 'Min-Jun Park', nameAr: 'مين جون بارك', avatar: '/images/athlete_korean_calisthenics.jpg', tier: 'TIER 3 TITAN', auraScore: 9780, streak: 22, workouts: 14, stabilityIndex: 98.8, hrvMs: 106, restingHrBpm: 48, vo2Max: 64.1, trainingHours: 20.2, clubName: 'YARD ENDURANCE ACADEMY', badge: 'TOP 5' },
  { rank: 5, id: 'w-5', name: 'Mateo Morales', nameAr: 'ماتيو موراليس', avatar: '/images/athlete_mexican_boxer.jpg', tier: 'TIER 3 TITAN', auraScore: 9720, streak: 21, workouts: 14, stabilityIndex: 98.5, hrvMs: 104, restingHrBpm: 48, vo2Max: 63.5, trainingHours: 19.6, clubName: 'MADRID IRON CLUB', badge: 'TOP 5' },
  { rank: 6, id: 'w-6', name: 'Erik Lindqvist', nameAr: 'إريك ليندكفيست', avatar: '/images/athlete_nordic_runner.jpg', tier: 'TIER 2 KINETIC', auraScore: 9650, streak: 19, workouts: 13, stabilityIndex: 98.2, hrvMs: 101, restingHrBpm: 49, vo2Max: 62.7, trainingHours: 18.5, clubName: 'HYROX ELITE BRIGADE', badge: 'RECOVERY' },
  { rank: 7, id: 'w-7', name: 'Freya Lindholm', nameAr: 'فريا ليندهولم', avatar: '/images/ai_human_female_runner.jpg', tier: 'TIER 2 KINETIC', auraScore: 9590, streak: 18, workouts: 12, stabilityIndex: 97.9, hrvMs: 99, restingHrBpm: 50, vo2Max: 61.8, trainingHours: 17.9, clubName: 'VALKYRIE SPRINT CLUB', badge: 'VANGUARD' },
  { rank: 8, id: 'w-8', name: 'Rafael Silva', nameAr: 'رافائيل سيلفا', avatar: '/images/athlete_brazilian_bjj.jpg', tier: 'TIER 2 KINETIC', auraScore: 9520, streak: 16, workouts: 12, stabilityIndex: 97.6, hrvMs: 97, restingHrBpm: 51, vo2Max: 60.9, trainingHours: 17.1, clubName: 'IRON VANGUARD GYM', badge: 'PRO ATHLETE' },
  { rank: 9, id: 'w-9', name: 'Amir Hassan', nameAr: 'أمير حسن', avatar: '/images/ai_human_striker_male.jpg', tier: 'TIER 2 KINETIC', auraScore: 9470, streak: 15, workouts: 11, stabilityIndex: 97.3, hrvMs: 94, restingHrBpm: 52, vo2Max: 60.1, trainingHours: 16.4, clubName: 'AURA BIOMETRIC LAB', badge: 'TITAN' },
  { rank: 10, id: 'w-10', name: 'Oliver Bennett', nameAr: 'أوليفر بينيت', avatar: '/images/athlete_british_pentathlete.jpg', tier: 'TIER 2 KINETIC', auraScore: 9410, streak: 14, workouts: 10, stabilityIndex: 97.0, hrvMs: 92, restingHrBpm: 52, vo2Max: 59.4, trainingHours: 15.8, clubName: 'PARIS PERFORMANCE LAB', badge: 'TOP 10' }
];

// 2. Monthly Top 50 Champions with Training Telemetry
export const MONTHLY_CHAMPIONS: RankedAthlete[] = Array.from({ length: 50 }, (_, i) => {
  const rank = i + 1;
  if (rank <= 10) {
    const base = WEEKLY_CHAMPIONS[rank - 1];
    return {
      ...base,
      workouts: base.workouts * 4,
      trainingHours: +(base.trainingHours * 4.1).toFixed(1),
      badge: rank === 1 ? 'MONTHLY #1' : rank <= 5 ? 'S-RANK MONTHLY' : 'TOP 50',
      auraScore: 9990 - rank * 12
    };
  }
  const fName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lName = SURNAMES[(i * 3) % SURNAMES.length];
  const avatar = AVATAR_POOL[i % AVATAR_POOL.length];
  const club = CLUB_NAMES[i % CLUB_NAMES.length];
  const score = Math.round(9800 - (rank - 10) * 18);
  const streak = Math.max(12, 35 - Math.floor(rank * 0.4));
  const workouts = Math.max(25, 60 - Math.floor(rank * 0.5));
  const stability = Math.max(94.0, +(98.0 - rank * 0.08).toFixed(1));

  return {
    rank,
    id: `m-${rank}`,
    name: `${fName} ${lName}`,
    avatar,
    tier: rank <= 15 ? 'S-RANK ELITE' : rank <= 30 ? 'TIER 3 TITAN' : 'TIER 2 KINETIC',
    auraScore: score,
    streak,
    workouts,
    stabilityIndex: stability,
    hrvMs: Math.max(76, Math.round(108 - rank * 0.55)),
    restingHrBpm: Math.min(58, Math.round(45 + rank * 0.22)),
    vo2Max: Math.max(54.0, +(65.8 - rank * 0.18).toFixed(1)),
    trainingHours: Math.max(42.0, +(96.0 - rank * 0.85).toFixed(1)),
    clubName: club,
    badge: rank <= 20 ? 'MONTHLY TOP 20' : 'TOP 50 ATHLETE'
  };
});

// 3. All-Time 300 Champions Legion
export const ALL_TIME_300_CHAMPIONS: RankedAthlete[] = Array.from({ length: 300 }, (_, i) => {
  const rank = i + 1;

  if (rank === 1) {
    return {
      rank: 1,
      id: 'legion-1',
      name: 'Yam Suw',
      nameAr: 'يام سو (Yam Suw)',
      avatar: '/images/yam_suw_athlete.jpg',
      tier: 'SUPREME 300',
      auraScore: 9999,
      streak: 365,
      workouts: 420,
      stabilityIndex: 99.9,
      hrvMs: 124,
      restingHrBpm: 42,
      vo2Max: 71.2,
      trainingHours: 612.0,
      clubName: 'YARD 300 FOUNDERS CLUB',
      badge: 'LEGION #1',
      isCurrentUser: true
    };
  }
  if (rank === 2) {
    return {
      rank: 2,
      id: 'legion-2',
      name: 'Freya Lindholm',
      nameAr: 'فريا ليندهولم',
      avatar: '/images/woman_nordic_valkyrie.jpg',
      tier: 'SUPREME 300',
      auraScore: 9980,
      streak: 340,
      workouts: 395,
      stabilityIndex: 99.7,
      hrvMs: 119,
      restingHrBpm: 43,
      vo2Max: 69.5,
      trainingHours: 580.4,
      clubName: 'VALKYRIE SPRINT CLUB',
      badge: 'S-RANK 300'
    };
  }
  if (rank === 3) {
    return {
      rank: 3,
      id: 'legion-3',
      name: 'Kenji Sato',
      nameAr: 'كينجي ساتو',
      avatar: '/images/ai_human_striker_male.jpg',
      tier: 'SUPREME 300',
      auraScore: 9950,
      streak: 320,
      workouts: 380,
      stabilityIndex: 99.5,
      hrvMs: 115,
      restingHrBpm: 44,
      vo2Max: 68.1,
      trainingHours: 548.2,
      clubName: 'TOKYO CALISTHENICS PRO',
      badge: 'S-RANK 300'
    };
  }

  const fName = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
  const lName = SURNAMES[(i * 11) % SURNAMES.length];
  const avatar = AVATAR_POOL[(i * 5) % AVATAR_POOL.length];
  const club = CLUB_NAMES[(i * 3) % CLUB_NAMES.length];
  const score = Math.round(9940 - (rank - 3) * 4.8);
  const streak = Math.max(45, 310 - Math.floor(rank * 0.8));
  const workouts = Math.max(90, 360 - Math.floor(rank * 0.85));
  const stability = Math.max(92.5, +(99.3 - rank * 0.022).toFixed(1));

  const tier = rank <= 50 ? 'SUPREME 300' : rank <= 150 ? 'TITAN STABLE' : 'KINETIC STABLE';
  const badge =
    rank <= 10 ? 'LEGION TOP 10' : rank <= 50 ? 'LEGION TOP 50' : rank <= 100 ? '300 VANGUARD' : 'STABLE 300';

  return {
    rank,
    id: `legion-${rank}`,
    name: `${fName} ${lName}`,
    avatar,
    tier,
    auraScore: score,
    streak,
    workouts,
    stabilityIndex: stability,
    hrvMs: Math.max(74, Math.round(115 - rank * 0.13)),
    restingHrBpm: Math.min(58, Math.round(44 + rank * 0.045)),
    vo2Max: Math.max(54.2, +(68.0 - rank * 0.042).toFixed(1)),
    trainingHours: Math.max(140.0, +(540.0 - rank * 1.25).toFixed(1)),
    clubName: club,
    badge
  };
});

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentLang = 'en',
  compactHome = false,
  onExpandFull
}) => {
  const isAr = currentLang === 'ar';

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = compactHome ? 10 : 25;
  const [rangeFilter, setRangeFilter] = useState<'all' | '1-50' | '51-100' | '101-200' | '201-300'>('all');

  const athletes = useMemo(() => {
    if (timeframe === 'weekly') return WEEKLY_CHAMPIONS;
    if (timeframe === 'monthly') return MONTHLY_CHAMPIONS;
    return ALL_TIME_300_CHAMPIONS;
  }, [timeframe]);

  // Real telemetry averages for the active pool
  const telemetryAverages = useMemo(() => {
    const count = athletes.length || 1;
    const avgHrv = Math.round(athletes.reduce((sum, a) => sum + a.hrvMs, 0) / count);
    const avgRhr = Math.round(athletes.reduce((sum, a) => sum + a.restingHrBpm, 0) / count);
    const avgVo2 = (athletes.reduce((sum, a) => sum + a.vo2Max, 0) / count).toFixed(1);
    const avgStability = (athletes.reduce((sum, a) => sum + a.stabilityIndex, 0) / count).toFixed(1);
    const totalHours = Math.round(athletes.reduce((sum, a) => sum + a.trainingHours, 0));
    return { avgHrv, avgRhr, avgVo2, avgStability, totalHours };
  }, [athletes]);

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

  return (
    <div
      id={compactHome ? 'home-leaderboard' : undefined}
      className={`${compactHome ? 'py-4' : 'max-w-6xl mx-auto px-4 md:px-8 py-6'} space-y-5 text-white ${
        isAr ? 'text-right' : 'text-left'
      }`}
    >
      {/* Header & Controls Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#080D0B] border border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.12)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-black font-anime text-emerald-400 uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>
                {timeframe === 'weekly'
                  ? tr(currentLang, {
                      en: 'WEEKLY TOP 10 COMBATANTS · LIVE TRAINING TELEMETRY',
                      es: 'TOP 10 SEMANAL · TELEMETRÍA DE ENTRENAMIENTO',
                      fr: 'TOP 10 HEBDOMADAIRE · TÉLÉMÉTRIE SPORTIVE',
                      ar: 'لوحة المتصدرين الأسبوعية (أفضل 10) · قراءات التدريب المباشرة'
                    })
                  : timeframe === 'monthly'
                  ? tr(currentLang, {
                      en: 'MONTHLY TOP 50 CHAMPIONS · BIOMETRIC READINGS',
                      es: 'TOP 50 MENSUAL · LECTURAS BIOMÉTRICAS',
                      fr: 'TOP 50 MENSUEL · LECTURES BIOMÉTRIQUES',
                      ar: 'لوحة المتصدرين الشهرية (أفضل 50 بطل) · القراءات الحيوية'
                    })
                  : tr(currentLang, {
                      en: 'THE 300 LEGION · LONG-TERM STABILITY MASTERS',
                      es: 'LA LEGIÓN DE LOS 300 · MAESTROS EN ESTABILIDAD',
                      fr: 'LA LÉGION DES 300 · MAÎTRES DE STABILITÉ',
                      ar: 'فيلق الـ 300 بطل · أصحاب الأداء المستقر طويل الأمد'
                    })}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black font-anime text-white leading-tight">
              {tr(currentLang, {
                en: 'Weekly & Monthly Champions Leaderboard',
                es: 'Tabla de Campeones Semanal y Mensual',
                fr: 'Tableau des Champions Hebdo & Mensuel',
                ar: 'لوحة المتصدرين والأبطال الأسبوعية والشهرية وقراءات التدريب'
              })}
            </h2>

            <p className="text-xs md:text-sm text-gray-300 font-medium leading-relaxed">
              {tr(currentLang, {
                en: 'Verified rankings of the Top 10 weekly athletes, Top 50 monthly titans, and All-Time 300 Legion tracked via HRV recovery, resting HR, VO2 Max, and training hours.',
                es: 'Clasificación verificada de los 10 mejores semanales, 50 mensuales y 300 históricos medidos por HRV, pulso, VO2 Max y horas.',
                fr: 'Classement vérifié du Top 10 hebdo, Top 50 mensuel et Légion des 300 suivi par VRC, FC repos, VO2 Max et heures.',
                ar: 'ترتيب معتمد لأفضل 10 أبطال أسبوعياً و 50 بطلاً شهرياً مع قراءات التدريب الحقيقية: تباين نبض القلب HRV، نبض الراحة، VO2 Max، وساعات التدريب.'
              })}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#050807] border border-[#D4AF37]/40 text-center shrink-0">
            <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">
              {timeframe === 'allTime'
                ? tr(currentLang, { en: 'LEGION CAP', es: 'CUPO LEGIÓN', fr: 'CAP LÉGION', ar: 'سقف الفيلق' })
                : tr(currentLang, { en: 'CIRCUIT PRIZE POOL', es: 'PREMIO DEL CIRCUITO', fr: 'CAGNOTTE CIRCUIT', ar: 'جوائز الدورة' })}
            </span>
            <span className="text-xl md:text-2xl font-black font-mono text-[#D4AF37] tabular-nums block">
              {timeframe === 'allTime' ? '300 TITANS' : '10,000 YARDX'}
            </span>
            <span className="block text-[10px] text-emerald-400 font-mono mt-0.5">
              {tr(currentLang, {
                en: 'Verified Training Metrics',
                es: 'Métricas Verificadas',
                fr: 'Métriques Vérifiées',
                ar: 'قراءات تدريب موثقة'
              })}
            </span>
          </div>
        </div>

        {/* Telemetry Group Summary Strip (Real Training Readings) */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4 border-t border-emerald-500/15">
          <div className="p-3 rounded-xl bg-[#050807] border border-emerald-500/20">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">
              {tr(currentLang, { en: 'AVG HRV RECOVERY', es: 'PROMEDIO VFC', fr: 'VRC MOYEN', ar: 'متوسط HRV الليلي' })}
            </span>
            <span className="text-lg font-black font-mono text-emerald-400 tabular-nums">
              {telemetryAverages.avgHrv} ms
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#050807] border border-emerald-500/20">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">
              {tr(currentLang, { en: 'AVG RESTING HR', es: 'FC REPOSO MEDIA', fr: 'FC REPOS MOY.', ar: 'معدل نبض الراحة' })}
            </span>
            <span className="text-lg font-black font-mono text-white tabular-nums">
              {telemetryAverages.avgRhr} bpm
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#050807] border border-emerald-500/20">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">
              {tr(currentLang, { en: 'AVG VO2 MAX', es: 'VO2 MAX MEDIO', fr: 'VO2 MAX MOYEN', ar: 'كفاءة الأكسجين VO2' })}
            </span>
            <span className="text-lg font-black font-mono text-[#D4AF37] tabular-nums">
              {telemetryAverages.avgVo2}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#050807] border border-emerald-500/20">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">
              {tr(currentLang, { en: 'STABILITY INDEX', es: 'ÍNDICE ESTABILIDAD', fr: 'INDICE STABILITÉ', ar: 'مؤشر الاستقرار' })}
            </span>
            <span className="text-lg font-black font-mono text-emerald-400 tabular-nums">
              {telemetryAverages.avgStability}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#050807] border border-emerald-500/20 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">
              {tr(currentLang, { en: 'LOGGED HOURS', es: 'HORAS TOTALES', fr: 'HEURES LOGGÉES', ar: 'ساعات التدريب' })}
            </span>
            <span className="text-lg font-black font-mono text-white tabular-nums">
              {telemetryAverages.totalHours.toLocaleString('en-US')} h
            </span>
          </div>
        </div>

        {/* Timeframe Switcher + Search */}
        <div className="mt-5 pt-4 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center bg-[#050807] p-1 rounded-xl border border-emerald-500/20 text-xs font-anime gap-1">
            <button
              type="button"
              onClick={() => handleTimeframeChange('weekly')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer font-black flex items-center gap-1.5 whitespace-nowrap ${
                timeframe === 'weekly' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {tr(currentLang, {
                  en: 'WEEKLY (TOP 10)',
                  es: 'SEMANAL (TOP 10)',
                  fr: 'HEBDO (TOP 10)',
                  ar: 'الأسبوعية (أفضل 10)'
                })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTimeframeChange('monthly')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer font-black flex items-center gap-1.5 whitespace-nowrap ${
                timeframe === 'monthly' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>
                {tr(currentLang, {
                  en: 'MONTHLY (TOP 50)',
                  es: 'MENSUAL (TOP 50)',
                  fr: 'MENSUEL (TOP 50)',
                  ar: 'الشهرية (أفضل 50)'
                })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTimeframeChange('allTime')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer font-black flex items-center gap-1.5 whitespace-nowrap ${
                timeframe === 'allTime' ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-500/50' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>
                {tr(currentLang, {
                  en: 'LEGION (300)',
                  es: 'LEGIÓN (300)',
                  fr: 'LÉGION (300)',
                  ar: 'الفيلق (300 بطل)'
                })}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                className={`w-4 h-4 text-gray-500 absolute ${
                  isAr ? 'right-3' : 'left-3'
                } top-1/2 -translate-y-1/2 pointer-events-none`}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={tr(currentLang, {
                  en: 'Search athlete, dojo, rank...',
                  es: 'Buscar atleta, club o puesto...',
                  fr: 'Rechercher athlète, club, rang...',
                  ar: 'ابحث عن بطل أو نادٍ أو ترتيب...'
                })}
                className={`w-full ${
                  isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
                } py-2 rounded-xl bg-[#050807] border border-emerald-500/25 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-400`}
              />
            </div>

            {compactHome && onExpandFull && (
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  onExpandFull();
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black font-anime cursor-pointer shrink-0 whitespace-nowrap"
              >
                {tr(currentLang, {
                  en: 'Full Board',
                  es: 'Ver Completa',
                  fr: 'Vue Complète',
                  ar: 'عرض اللوحة كاملة'
                })}
              </button>
            )}
          </div>
        </div>

        {/* All-Time 300 Range Jumps */}
        {timeframe === 'allTime' && (
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-emerald-500/10">
            <span className="text-[11px] text-gray-400 font-anime font-black uppercase">
              {tr(currentLang, { en: 'Range:', es: 'Rango:', fr: 'Plage :', ar: 'نطاق الترتيب:' })}
            </span>
            {[
              { id: 'all', label: tr(currentLang, { en: 'All 300', es: 'Todos 300', fr: 'Tous 300', ar: 'الكل (300)' }) },
              { id: '1-50', label: '#1 – 50' },
              { id: '51-100', label: '#51 – 100' },
              { id: '101-200', label: '#101 – 200' },
              { id: '201-300', label: '#201 – 300' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setRangeFilter(r.id as any);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  rangeFilter === r.id
                    ? 'bg-emerald-500 text-black'
                    : 'bg-[#050807] text-gray-400 hover:text-white border border-emerald-500/20'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {athletes.slice(0, 3).map((ath, idx) => (
          <div
            key={ath.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between bg-[#080D0B] ${
              idx === 0
                ? 'border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.18)]'
                : 'border-emerald-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-black font-mono text-xs tabular-nums ${
                  idx === 0
                    ? 'bg-[#D4AF37] text-black'
                    : idx === 1
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white text-black'
                }`}
              >
                #{ath.rank}
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                {ath.clubName}
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-3.5">
              <img
                src={ath.avatar}
                alt={ath.name}
                onError={handleImageError}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-emerald-500/30"
              />
              <div className="min-w-0">
                <h3 className="text-base font-black font-anime text-white truncate">
                  {isAr && ath.nameAr ? ath.nameAr : ath.name}
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 block tabular-nums">
                  HRV {ath.hrvMs}ms · RHR {ath.restingHrBpm}bpm · VO2 {ath.vo2Max}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-[#050807] border border-emerald-500/15 text-center font-mono tabular-nums">
              <div>
                <span className="block text-[9px] text-gray-400">
                  {tr(currentLang, { en: 'AURA', es: 'AURA', fr: 'AURA', ar: 'الهالة' })}
                </span>
                <span className="text-sm font-black text-[#D4AF37]">{ath.auraScore}</span>
              </div>
              <div>
                <span className="block text-[9px] text-gray-400">
                  {tr(currentLang, { en: 'STREAK', es: 'RACHA', fr: 'SÉRIE', ar: 'سلسلة' })}
                </span>
                <span className="text-sm font-black text-white">{ath.streak}d</span>
              </div>
              <div>
                <span className="block text-[9px] text-gray-400">
                  {tr(currentLang, { en: 'HOURS', es: 'HORAS', fr: 'HEURES', ar: 'ساعات' })}
                </span>
                <span className="text-sm font-black text-emerald-400">{ath.trainingHours}h</span>
              </div>
              <div>
                <span className="block text-[9px] text-gray-400">
                  {tr(currentLang, { en: 'STAB', es: 'ESTAB', fr: 'STAB', ar: 'ثبات' })}
                </span>
                <span className="text-sm font-black text-white">{ath.stabilityIndex}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Telemetry Table */}
      <div className="bg-[#080D0B] border border-emerald-500/25 rounded-2xl overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-emerald-500/15">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm md:text-base font-black font-anime text-white">
              {timeframe === 'weekly'
                ? tr(currentLang, {
                    en: 'TOP 10 ATHLETES THIS WEEK',
                    es: 'TOP 10 ATLETAS DE LA SEMANA',
                    fr: 'TOP 10 ATHLÈTES CETTE SEMAINE',
                    ar: 'أفضل 10 أبطال هذا الأسبوع وقراءاتهم'
                  })
                : timeframe === 'monthly'
                ? tr(currentLang, {
                    en: 'TOP 50 ATHLETES THIS MONTH',
                    es: 'TOP 50 ATLETAS DEL MES',
                    fr: 'TOP 50 ATHLÈTES DU MOIS',
                    ar: 'أفضل 50 بطلاً هذا الشهر وقراءاتهم'
                  })
                : tr(currentLang, {
                    en: 'THE 300 ALL-TIME LEGION',
                    es: 'LA LEGIÓN HISTÓRICA DE LOS 300',
                    fr: 'LA LÉGION HISTORIQUE DES 300',
                    ar: 'فيلق الـ 300 بطل الكلي'
                  })}
            </h3>
          </div>

          <span className="text-xs text-gray-400 font-mono font-bold tabular-nums">
            {filteredAthletes.length}{' '}
            {tr(currentLang, { en: 'Athletes', es: 'Atletas', fr: 'Athlètes', ar: 'بطل' })}
          </span>
        </div>

        <div className="overflow-x-auto yard-slim-scrollbar">
          <table className={`w-full border-collapse ${isAr ? 'text-right' : 'text-left'}`}>
            <thead>
              <tr className="border-b border-emerald-500/15 bg-[#050807] text-[10px] font-anime font-black text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4 text-center w-14">#</th>
                <th className="py-3 px-4">
                  {tr(currentLang, { en: 'ATHLETE & CLUB', es: 'ATLETA Y CLUB', fr: 'ATHLÈTE & CLUB', ar: 'البطل والنادي' })}
                </th>
                <th className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>HRV / RHR</span>
                  </span>
                </th>
                <th className="py-3 px-3 text-center hidden sm:table-cell">VO2 MAX</th>
                <th className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1">
                    <Timer className="w-3 h-3 text-gray-400" />
                    <span>{tr(currentLang, { en: 'HOURS', es: 'HORAS', fr: 'HEURES', ar: 'الساعات' })}</span>
                  </span>
                </th>
                <th className="py-3 px-3 text-center hidden md:table-cell">
                  {tr(currentLang, { en: 'STREAK', es: 'RACHA', fr: 'SÉRIE', ar: 'الالتزام' })}
                </th>
                <th className="py-3 px-4 text-right">
                  {tr(currentLang, { en: 'AURA SCORE', es: 'PUNTOS AURA', fr: 'SCORE AURA', ar: 'نقاط الأداء' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-xs font-bold">
              {paginatedAthletes.map((ath) => (
                <tr
                  key={ath.id}
                  className={`hover:bg-[#0D1713] transition-colors ${
                    ath.isCurrentUser ? 'bg-emerald-500/10' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-mono font-black text-xs tabular-nums ${
                        ath.rank === 1
                          ? 'bg-[#D4AF37] text-black'
                          : ath.rank === 2
                          ? 'bg-emerald-500 text-black'
                          : ath.rank === 3
                          ? 'bg-white text-black'
                          : 'bg-[#050807] text-gray-300 border border-emerald-500/20'
                      }`}
                    >
                      {ath.rank}
                    </span>
                  </td>

                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={ath.avatar}
                        alt={ath.name}
                        onError={handleImageError}
                        className="w-9 h-9 rounded-lg object-cover bg-black shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-anime font-black text-xs sm:text-sm text-white block truncate">
                          {isAr && ath.nameAr ? ath.nameAr : ath.name}
                        </span>
                        <span className="text-[10px] text-gray-400 block truncate font-mono">
                          {ath.clubName} · {ath.stabilityIndex}%
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                    <span className="text-emerald-400 font-black block">{ath.hrvMs} ms</span>
                    <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                      <HeartPulse className="w-3 h-3 text-emerald-500" />
                      {ath.restingHrBpm} bpm
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-center hidden sm:table-cell font-mono tabular-nums text-white">
                    {ath.vo2Max}
                  </td>

                  <td className="py-2.5 px-3 text-center font-mono tabular-nums text-gray-200">
                    {ath.trainingHours}h
                  </td>

                  <td className="py-2.5 px-3 text-center hidden md:table-cell font-mono tabular-nums">
                    <span className="inline-flex items-center gap-1 text-[#D4AF37]">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{ath.streak}d</span>
                    </span>
                  </td>

                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                    <span className="font-black text-sm text-emerald-400 block">
                      {ath.auraScore.toLocaleString('en-US')}
                    </span>
                    <span className="text-[9px] text-gray-500">{ath.workouts} BOUTS</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-3.5 bg-[#050807] border-t border-emerald-500/15 flex items-center justify-between text-xs font-bold text-gray-400">
            <span className="font-mono tabular-nums">
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
                className="p-2 rounded-lg bg-[#090E0C] hover:bg-[#111C17] text-white disabled:opacity-30 cursor-pointer border border-emerald-500/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 rounded-lg bg-[#090E0C] border border-emerald-500/20 text-emerald-400 font-mono tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => {
                  soundFX.playButtonClick();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className="p-2 rounded-lg bg-[#090E0C] hover:bg-[#111C17] text-white disabled:opacity-30 cursor-pointer border border-emerald-500/20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
