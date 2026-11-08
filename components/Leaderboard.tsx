/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Zap, 
  Award, 
  Search, 
  Filter, 
  ShieldCheck, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Users,
  Calendar,
  Activity
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

interface LeaderboardProps {
  currentLang?: Language;
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
  stabilityIndex: number; // e.g. 99.8% stability
  clubName: string;
  badge: string;
  badgeAr?: string;
  isCurrentUser?: boolean;
}

// Dedicated avatar pool for Leaderboard (unique to this section)
const AVATAR_POOL = [
  '/images/tarik_saiyan_overlord_1788741682523.jpg',
  '/images/cyber_shinobi_2050_1788741122150.jpg',
  '/images/titan_brawler_2050_1788741109327.jpg',
  '/images/cyber_ronin_blade.jpg',
  '/images/anime_challenger_rookie_1788741832986.jpg',
  '/images/anime_fast_recovery_cryo_1788741758354.jpg',
  '/images/anime_hero_front_1790810814864.jpg',
  '/images/live_arena_fighters_2050_1788741135197.jpg',
  '/images/yard_brand_hero.jpg',
  '/images/aura_champions_squad.jpg'
];

const CLUB_NAMES = [
  'TITAN APEX STRIKE DOJO',
  'VALKYRIE SPRINT CLUB',
  'HAYABUSA SHADOW DOJO',
  'FIRE HASHIRA SQUAD',
  'SAIYAN HEAVYWEIGHTS',
  'SHADOW BLADE ACADEMY',
  'IRON VANGUARD GYM',
  'NEON RONIN COMBAT',
  'CYBER SHINOBI CLAN',
  'AURA BIO-METRIC DOJO',
  'HYROX ELITE BRIGADE',
  'SHAOLIN COMBAT LEGION'
];

const FIRST_NAMES = [
  'Kenji', 'Takeshi', 'Daiki', 'Hiroshi', 'Sora', 'Ren', 'Kaito', 'Riku', 'Yuto', 'Kazuki',
  'Aoi', 'Sakura', 'Yuki', 'Emi', 'Hana', 'Mei', 'Rei', 'Kira', 'Hana', 'Asuka',
  'Marcus', 'Elena', 'Viktor', 'Darius', 'Chloe', 'Zack', 'Leona', 'Tarek', 'Samir', 'Zayd',
  'Layla', 'Nour', 'Amina', 'Faris', 'Hamza', 'Karim', 'Sultan', 'Malik', 'Rayan', 'Omar'
];

const SURNAMES = [
  'Shadow', 'Vanguard', 'Blade', 'Striker', 'Titan', 'Iron', 'Flame', 'Storm', 'Cyber', 'Apex',
  'Thunder', 'Brawler', 'Ronin', 'Shinobi', 'Dragon', 'Phoenix', 'Wolf', 'Hawk', 'Stealth', 'Overdrive'
];

// 1. Exactly 10 Weekly Champions (each with a unique image dedicated to this ranking)
export const WEEKLY_CHAMPIONS: RankedAthlete[] = [
  { rank: 1, id: 'w-1', name: 'Tarik Saiyan', nameAr: 'طارق سايان', avatar: '/images/tarik_saiyan_overlord_1788741682523.jpg', tier: 'GOD-TIER OVERDRIVE', auraScore: 9980, streak: 30, workouts: 18, stabilityIndex: 99.8, clubName: 'SAIYAN HEAVYWEIGHTS', badge: '👑 WEEKLY #1', isCurrentUser: true },
  { rank: 2, id: 'w-2', name: 'Shinobi Hayate', nameAr: 'شينوبي هاياتي', avatar: '/images/cyber_shinobi_2050_1788741122150.jpg', tier: 'GOD-TIER OVERDRIVE', auraScore: 9910, streak: 28, workouts: 16, stabilityIndex: 99.4, clubName: 'CYBER SHINOBI CLAN', badge: '⚡ S-RANK ELITE' },
  { rank: 3, id: 'w-3', name: 'Goliath Titan', nameAr: 'جولياث تايتان', avatar: '/images/titan_brawler_2050_1788741109327.jpg', tier: 'TIER 3 TITAN', auraScore: 9840, streak: 25, workouts: 15, stabilityIndex: 99.1, clubName: 'TITAN APEX STRIKE DOJO', badge: '🥊 STRIKE MASTER' },
  { rank: 4, id: 'w-4', name: 'Ronin Kage', nameAr: 'رونين كاجي', avatar: '/images/cyber_ronin_blade.jpg', tier: 'TIER 3 TITAN', auraScore: 9780, streak: 22, workouts: 14, stabilityIndex: 98.8, clubName: 'NEON RONIN COMBAT', badge: '🔥 BLADE MASTER' },
  { rank: 5, id: 'w-5', name: 'Challenger Jin', nameAr: 'المتحدي جين', avatar: '/images/anime_challenger_rookie_1788741832986.jpg', tier: 'TIER 3 TITAN', auraScore: 9720, streak: 21, workouts: 14, stabilityIndex: 98.5, clubName: 'HAYABUSA SHADOW DOJO', badge: '⚡ OVERLORD' },
  { rank: 6, id: 'w-6', name: 'Cryo Phoenix', nameAr: 'فينيكس كرايو', avatar: '/images/anime_fast_recovery_cryo_1788741758354.jpg', tier: 'TIER 2 KINETIC', auraScore: 9650, streak: 19, workouts: 13, stabilityIndex: 98.2, clubName: 'SHADOW BLADE ACADEMY', badge: '❄️ RECOVERY ELITE' },
  { rank: 7, id: 'w-7', name: 'Mia Valkyrie', nameAr: 'ميا فالكيري', avatar: '/images/anime_hero_front_1790810814864.jpg', tier: 'TIER 2 KINETIC', auraScore: 9590, streak: 18, workouts: 12, stabilityIndex: 97.9, clubName: 'VALKYRIE SPRINT CLUB', badge: '🛡️ VANGUARD' },
  { rank: 8, id: 'w-8', name: 'Apex Striker', nameAr: 'أبيكس سترايكر', avatar: '/images/live_arena_fighters_2050_1788741135197.jpg', tier: 'TIER 2 KINETIC', auraScore: 9520, streak: 16, workouts: 12, stabilityIndex: 97.6, clubName: 'IRON VANGUARD GYM', badge: '🥋 COMBAT DOJO' },
  { rank: 9, id: 'w-9', name: 'Brand Champion', nameAr: 'بطل البراند', avatar: '/images/yard_brand_hero.jpg', tier: 'TIER 2 KINETIC', auraScore: 9470, streak: 15, workouts: 11, stabilityIndex: 97.3, clubName: 'AURA BIO-METRIC DOJO', badge: '⚡ TITAN' },
  { rank: 10, id: 'w-10', name: 'Squad Legion', nameAr: 'كتيبة السكواد', avatar: '/images/aura_champions_squad.jpg', tier: 'TIER 2 KINETIC', auraScore: 9410, streak: 14, workouts: 10, stabilityIndex: 97.0, clubName: 'HYROX ELITE BRIGADE', badge: '👑 SQUAD LEADER' }
];

// 2. Exactly 50 Monthly Champions
export const MONTHLY_CHAMPIONS: RankedAthlete[] = Array.from({ length: 50 }, (_, i) => {
  const rank = i + 1;
  if (rank <= 10) {
    const base = WEEKLY_CHAMPIONS[rank - 1];
    return {
      ...base,
      workouts: base.workouts * 4,
      badge: rank === 1 ? '👑 MONTHLY CHAMPION #1' : rank <= 5 ? '⚡ S-RANK MONTHLY' : '🔥 TITAN 50',
      auraScore: 9990 - (rank * 12)
    };
  }
  const fName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lName = SURNAMES[(i * 3) % SURNAMES.length];
  const avatar = AVATAR_POOL[i % AVATAR_POOL.length];
  const club = CLUB_NAMES[i % CLUB_NAMES.length];
  const score = Math.round(9800 - ((rank - 10) * 18));
  const streak = Math.max(12, 35 - Math.floor(rank * 0.4));
  const workouts = Math.max(25, 60 - Math.floor(rank * 0.5));
  const stability = Math.max(94.0, +(98.0 - (rank * 0.08)).toFixed(1));

  return {
    rank,
    id: `m-${rank}`,
    name: `${fName} ${lName}`,
    avatar,
    tier: rank <= 15 ? 'GOD-TIER OVERDRIVE' : rank <= 30 ? 'TIER 3 TITAN' : 'TIER 2 KINETIC',
    auraScore: score,
    streak,
    workouts,
    stabilityIndex: stability,
    clubName: club,
    badge: rank <= 20 ? '⚡ MONTHLY TOP 20' : '🥊 TOP 50 WARRIOR'
  };
});

// 3. Exactly 300 All-Time Champions with Stable High-Level Mastery ("The Legion of 300")
export const ALL_TIME_300_CHAMPIONS: RankedAthlete[] = Array.from({ length: 300 }, (_, i) => {
  const rank = i + 1;

  if (rank === 1) {
    return {
      rank: 1,
      id: 'legion-1',
      name: 'YAM SUW (AURA FOUNDER)',
      nameAr: 'يام سو (مؤسس أورا)',
      avatar: '/images/yam_suw_athlete.jpg',
      tier: 'S-RANK SUPREME 300',
      auraScore: 9999,
      streak: 365,
      workouts: 420,
      stabilityIndex: 99.9,
      clubName: 'TITAN APEX STRIKE DOJO',
      badge: '👑 LEGION SUPREME #1',
      isCurrentUser: true
    };
  }
  if (rank === 2) {
    return {
      rank: 2,
      id: 'legion-2',
      name: 'Mia Valkyrie',
      nameAr: 'ميا فالكيري',
      avatar: '/images/anime_hero_front_1790810814864.jpg',
      tier: 'S-RANK SUPREME 300',
      auraScore: 9980,
      streak: 340,
      workouts: 395,
      stabilityIndex: 99.7,
      clubName: 'VALKYRIE SPRINT CLUB',
      badge: '⚡ S-RANK 300'
    };
  }
  if (rank === 3) {
    return {
      rank: 3,
      id: 'legion-3',
      name: 'Ryu Hayabusa',
      nameAr: 'ريو هايابوسا',
      avatar: '/images/boxing_striker_kenji_1790712616545.jpg',
      tier: 'S-RANK SUPREME 300',
      auraScore: 9950,
      streak: 320,
      workouts: 380,
      stabilityIndex: 99.5,
      clubName: 'HAYABUSA SHADOW DOJO',
      badge: '🥊 S-RANK 300'
    };
  }

  const fName = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
  const lName = SURNAMES[(i * 11) % SURNAMES.length];
  const avatar = AVATAR_POOL[(i * 5) % AVATAR_POOL.length];
  const club = CLUB_NAMES[(i * 3) % CLUB_NAMES.length];
  
  // Power score scales gently from 9940 down to 8500
  const score = Math.round(9940 - ((rank - 3) * 4.8));
  const streak = Math.max(45, 310 - Math.floor(rank * 0.8));
  const workouts = Math.max(90, 360 - Math.floor(rank * 0.85));
  // Stable power performance maintained over long periods
  const stability = Math.max(92.5, +(99.3 - (rank * 0.022)).toFixed(1));

  let tier = 'TIER 2 KINETIC STABLE';
  if (rank <= 50) tier = 'S-RANK SUPREME 300';
  else if (rank <= 150) tier = 'TIER 3 TITAN STABLE';

  let badge = `LEGION #${rank}`;
  if (rank <= 10) badge = '👑 LEGION TOP 10';
  else if (rank <= 50) badge = '⚡ LEGION TOP 50';
  else if (rank <= 100) badge = '🔥 300 VANGUARD';
  else badge = '🛡️ STABLE 300';

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
    clubName: club,
    badge
  };
});

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Range jump for the 300 champions
  const [rangeFilter, setRangeFilter] = useState<'all' | '1-50' | '51-100' | '101-200' | '201-300'>('all');

  const athletes = useMemo(() => {
    if (timeframe === 'weekly') return WEEKLY_CHAMPIONS;
    if (timeframe === 'monthly') return MONTHLY_CHAMPIONS;
    return ALL_TIME_300_CHAMPIONS;
  }, [timeframe]);

  const filteredAthletes = useMemo(() => {
    return athletes.filter(a => {
      // Range filter in allTime mode
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

  // Paginated slice for smooth rendering
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
    <div className={`max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8 text-white ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Header Banner */}
      <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#140F22] via-[#1A112C] to-[#0A0D1A] border-2 border-[#FFE600]/40 shadow-[0_0_50px_rgba(255,230,0,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFE600]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/20 border border-[#FFE600]/40 text-[#FFE600] text-xs font-black font-anime uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>
                {timeframe === 'weekly' 
                  ? (isAr ? 'أفضل 10 أبطال للأسبوع الحالي (TOP 10)' : 'TOP 10 COMBATANTS OF THE WEEK')
                  : timeframe === 'monthly'
                  ? (isAr ? 'أفضل 50 بطلاً للشهر (TOP 50)' : 'TOP 50 TITANS OF THE MONTH')
                  : (isAr ? 'فيلق الـ 300 بطل // أصحاب المستويات المستقرة (THE 300 LEGION)' : 'THE 300 LEGION // LONG-TERM STABILITY MASTERS')}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black font-anime text-white">
              {isAr 
                ? 'لوحة المتصدرين ' 
                : 'GLOBAL '}<span className="text-[#FFE600] neon-text-yellow">{isAr ? 'وأساطير الهالة S-Rank' : 'S-RANK CHAMPIONS'}</span>
            </h1>

            <p className="text-xs md:text-sm text-gray-300 max-w-xl font-bold leading-relaxed">
              {isAr 
                ? '10 أبطال يتصدرون كل أسبوع، 50 بطلاً كل شهر، ونخبة الـ 300 بطل الأقوى الذين حافظوا على استقرار مستوياتهم وأدائهم البدني لفترات طويلة في التصنيف الكلي (All-Time).'
                : '10 champions weekly, 50 titans monthly, and the elite 300 combatants who maintained unwavering stability and power metrics over long periods in the All-Time Legion.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/60 border border-[#FFE600]/50 text-center shrink-0 shadow-[0_0_20px_rgba(255,230,0,0.2)]">
            <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">
              {timeframe === 'allTime' ? 'LEGION CAP' : 'CIRCUIT PRIZE POOL'}
            </span>
            <span className="text-2xl md:text-3xl font-black font-anime text-[#FFE600]">
              {timeframe === 'allTime' ? '300 TITANS' : '10,000 YARDX'}
            </span>
            <span className="block text-[10px] text-emerald-400 font-mono mt-1">
              {timeframe === 'allTime' ? '✓ Long-Term Stable Metrics' : '✓ Smart Contract Verified'}
            </span>
          </div>
        </div>

        {/* Timeframe Selector & Search Bar */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center bg-[#0C0E1A] p-1 rounded-2xl border border-gray-800 text-xs font-anime">
            <button
              onClick={() => handleTimeframeChange('weekly')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-black flex items-center gap-1.5 ${
                timeframe === 'weekly' ? 'bg-[#FFE600] text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isAr ? 'أسبوعي (10 أبطال)' : 'WEEKLY (10)'}</span>
            </button>

            <button
              onClick={() => handleTimeframeChange('monthly')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-black flex items-center gap-1.5 ${
                timeframe === 'monthly' ? 'bg-[#00F0FF] text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isAr ? 'شهري (50 بطلاً)' : 'MONTHLY (50)'}</span>
            </button>

            <button
              onClick={() => handleTimeframeChange('allTime')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-black flex items-center gap-1.5 ${
                timeframe === 'allTime' ? 'bg-[#E50914] text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{isAr ? 'الكلي (أفضل 300 بطل مستقر)' : 'ALL-TIME (300 LEGION)'}</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className={`w-4 h-4 text-gray-500 absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={isAr ? 'ابحث عن اسم البطل أو النادي أو الترتيب...' : 'Search athlete, dojo, or rank #...'}
              className={`w-full ${isAr ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'} py-2 rounded-xl bg-[#0C0E1A] border border-gray-800 text-xs text-white placeholder-gray-500 outline-none focus:border-[#FFE600]`}
            />
          </div>
        </div>

        {/* Range Jump Quick Buttons for the 300 Champions in All-Time Mode */}
        {timeframe === 'allTime' && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-800/60">
            <span className="text-[11px] text-gray-400 font-anime font-black uppercase">
              {isAr ? 'القفز السريع للترتيب:' : 'Quick Rank Filter:'}
            </span>
            {[
              { id: 'all', label: isAr ? 'الكل (300)' : 'All 300' },
              { id: '1-50', label: '#1 - 50' },
              { id: '51-100', label: '#51 - 100' },
              { id: '101-200', label: '#101 - 200' },
              { id: '201-300', label: '#201 - 300' },
            ].map(r => (
              <button
                key={r.id}
                onClick={() => {
                  soundFX.playButtonClick();
                  setRangeFilter(r.id as any);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  rangeFilter === r.id
                    ? 'bg-[#E50914] text-white shadow-sm'
                    : 'bg-[#121524] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {athletes.slice(0, 3).map((ath, idx) => (
          <div
            key={ath.id}
            className={`p-6 rounded-3xl border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
              idx === 0
                ? 'bg-gradient-to-b from-[#221800] to-[#120E05] border-[#FFE600] shadow-[0_0_40px_rgba(255,230,0,0.3)] md:-translate-y-3'
                : idx === 1
                ? 'bg-gradient-to-b from-[#1A1A24] to-[#0E0F16] border-[#00F0FF]/60 shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                : 'bg-gradient-to-b from-[#1F1518] to-[#100C0E] border-[#FF007A]/60 shadow-[0_0_30px_rgba(255,0,122,0.2)]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`w-9 h-9 rounded-full flex items-center justify-center font-black font-anime text-sm shadow-md ${
                idx === 0 ? 'bg-[#FFE600] text-black ring-2 ring-[#FFE600]' : idx === 1 ? 'bg-[#00F0FF] text-black' : 'bg-[#FF007A] text-white'
              }`}>
                #{ath.rank}
              </span>
              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 uppercase">
                {ath.badge}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src={ath.avatar}
                  alt={ath.name}
                  onError={handleImageError}
                  className="w-16 h-16 rounded-2xl object-cover shadow-md"
                />
                {ath.rank === 1 && (
                  <Crown className="w-5 h-5 text-[#FFE600] absolute -top-2.5 -right-2.5 animate-bounce drop-shadow-[0_0_10px_#FFE600]" />
                )}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-lg font-black font-anime text-white truncate flex items-center gap-1.5">
                  <span>{isAr && ath.nameAr ? ath.nameAr : ath.name}</span>
                  {ath.isCurrentUser && (
                    <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.2 rounded font-sans font-bold">YOU</span>
                  )}
                </h3>
                <span className="text-[11px] text-[#FFE600] font-bold block truncate">{ath.clubName}</span>
                <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                  {ath.tier} &bull; {ath.stabilityIndex}% Stability
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
              <div>
                <span className="block text-[9px] text-gray-400 font-mono">{isAr ? 'الهالة' : 'AURA'}</span>
                <span className="text-base font-black font-anime text-[#00F0FF]">{ath.auraScore}</span>
              </div>
              <div>
                <span className="block text-[9px] text-gray-400 font-mono">{isAr ? 'السلسلة' : 'STREAK'}</span>
                <span className="text-base font-black font-anime text-[#FFE600]">{ath.streak}d</span>
              </div>
              <div>
                <span className="block text-[9px] text-gray-400 font-mono">{isAr ? 'التمارين' : 'BOUTS'}</span>
                <span className="text-base font-black font-anime text-emerald-400">{ath.workouts}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Leaderboard Table */}
      <div className="bg-[#0A0D18] rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <div className="p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FFE600]" />
            <h2 className="text-lg md:text-xl font-black font-anime text-white">
              {timeframe === 'weekly' 
                ? (isAr ? 'قائمة الـ 10 أبطال لهذا الأسبوع' : 'TOP 10 ATHLETES THIS WEEK')
                : timeframe === 'monthly'
                ? (isAr ? 'قائمة الـ 50 بطلاً لهذا الشهر' : 'TOP 50 ATHLETES THIS MONTH')
                : (isAr ? 'قائمة الـ 300 بطل الأقوى كلياً (فيلق YARD 300)' : 'THE 300 ALL-TIME STABLE LEGION')}
            </h2>
          </div>

          <span className="text-xs text-gray-400 font-mono font-bold">
            {isAr 
              ? `عرض ${filteredAthletes.length} محارب` 
              : `Showing ${filteredAthletes.length} Champions`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800/80 bg-[#060810] text-[11px] font-anime font-black text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-16">#</th>
                <th className="py-3.5 px-4">{isAr ? 'المقاتل والنادي' : 'FIGHTER & DOJO'}</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">{isAr ? 'الرتبة ومؤشر الثبات' : 'TIER & STABILITY'}</th>
                <th className="py-3.5 px-4 text-center">{isAr ? 'السلسلة' : 'STREAK'}</th>
                <th className="py-3.5 px-4 text-center hidden md:table-cell">{isAr ? 'التمارين' : 'BOUTS'}</th>
                <th className="py-3.5 px-4 text-right">{isAr ? 'نقاط الهالة' : 'AURA SCORE'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/60 text-xs font-bold">
              {paginatedAthletes.map((ath) => {
                const isTop3 = ath.rank <= 3;
                return (
                  <tr 
                    key={ath.id}
                    className={`hover:bg-[#121626] transition-colors ${
                      ath.isCurrentUser ? 'bg-[#FFE600]/10 border-l-4 border-l-[#FFE600]' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-anime font-black text-xs ${
                        ath.rank === 1 ? 'bg-[#FFE600] text-black shadow-md' :
                        ath.rank === 2 ? 'bg-[#00F0FF] text-black' :
                        ath.rank === 3 ? 'bg-[#FF007A] text-white' :
                        ath.rank <= 10 ? 'bg-gray-800 text-yellow-300' :
                        ath.rank <= 50 ? 'bg-gray-900 text-cyan-300' :
                        'bg-gray-900/60 text-gray-400 font-mono'
                      }`}>
                        {ath.rank}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={ath.avatar} 
                          alt={ath.name} 
                          onError={handleImageError}
                          className="w-10 h-10 rounded-xl object-cover bg-black shrink-0 shadow-sm"
                        />
                        <div className="overflow-hidden">
                          <span className="font-anime font-black text-sm text-white block truncate flex items-center gap-1.5">
                            <span>{isAr && ath.nameAr ? ath.nameAr : ath.name}</span>
                            {ath.isCurrentUser && (
                              <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.2 rounded font-sans font-black">YOU</span>
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400 block truncate font-sans">
                            {ath.clubName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 hidden sm:table-cell">
                      <div>
                        <span className="text-[11px] font-anime font-black text-gray-200 block">
                          {ath.tier}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono block">
                          ⚡ {isAr ? `${ath.stabilityIndex}% استقرار مستمر طويل الأمد` : `${ath.stabilityIndex}% Long-Term Stability`}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-anime font-black text-amber-400">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{ath.streak}d</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center hidden md:table-cell font-mono text-gray-300">
                      {ath.workouts}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-anime font-black text-sm text-[#00F0FF] block">
                        {ath.auraScore.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono block">
                        AU POINTS
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar for All-Time 300 & Monthly 50 */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#070912] flex items-center justify-between text-xs font-bold text-gray-400">
            <span>
              {isAr 
                ? `صفحة ${page} من ${totalPages}` 
                : `Page ${page} of ${totalPages}`}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => {
                  soundFX.playButtonClick();
                  setPage(p => Math.max(1, p - 1));
                }}
                className="p-2 rounded-xl bg-[#121524] hover:bg-[#1A1E32] text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 rounded-xl bg-black border border-gray-800 text-white font-mono">
                {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => {
                  soundFX.playButtonClick();
                  setPage(p => Math.min(totalPages, p + 1));
                }}
                className="p-2 rounded-xl bg-[#121524] hover:bg-[#1A1E32] text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-gray-800"
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
