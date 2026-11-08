/**
 * Combat Streak Tracker Service
 * Tracks active daily combat days in the YARD300 Biometric Engine,
 * manages current & best streaks, and rewards users with Aura Points (AP).
 */

export interface StreakDayRecord {
  date: string; // YYYY-MM-DD
  active: boolean;
  pointsEarned: number;
  activityCount: number;
}

export interface CombatStreakData {
  currentStreak: number;
  bestStreak: number;
  totalActiveDays: number;
  totalAuraPoints: number;
  lastActiveDate: string; // YYYY-MM-DD
  history: Record<string, StreakDayRecord>;
  tier: 'NOVICE' | 'WARRIOR' | 'CHAMPION' | 'S-RANK MASTER' | 'DEITY';
}

const STORAGE_KEY = 'yard300_combat_streak_v1';

export const getTodayKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayKey = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate Tier based on streak length & aura points
export const calculateTier = (streak: number, auraPoints: number): CombatStreakData['tier'] => {
  if (streak >= 30 || auraPoints >= 5000) return 'DEITY';
  if (streak >= 14 || auraPoints >= 2500) return 'S-RANK MASTER';
  if (streak >= 7 || auraPoints >= 1000) return 'CHAMPION';
  if (streak >= 3 || auraPoints >= 300) return 'WARRIOR';
  return 'NOVICE';
};

// Seed realistic initial streak for an exciting starting experience
const getDefaultStreakData = (): CombatStreakData => {
  const today = getTodayKey();
  const d = new Date();
  const history: Record<string, StreakDayRecord> = {};

  // Seed last 6 days as active
  for (let i = 6; i >= 1; i--) {
    const past = new Date(d);
    past.setDate(past.getDate() - i);
    const y = past.getFullYear();
    const m = String(past.getMonth() + 1).padStart(2, '0');
    const day = String(past.getDate()).padStart(2, '0');
    const k = `${y}-${m}-${day}`;
    history[k] = {
      date: k,
      active: true,
      pointsEarned: 100 + (6 - i) * 20,
      activityCount: 2 + ((6 - i) % 2)
    };
  }

  // Today is active as well
  history[today] = {
    date: today,
    active: true,
    pointsEarned: 150,
    activityCount: 1
  };

  const currentStreak = 7;
  const bestStreak = 12;
  const totalActiveDays = 24;
  const totalAuraPoints = 2350;

  return {
    currentStreak,
    bestStreak,
    totalActiveDays,
    totalAuraPoints,
    lastActiveDate: today,
    history,
    tier: calculateTier(currentStreak, totalAuraPoints)
  };
};

export const getCombatStreakData = (): CombatStreakData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultStreakData();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      } catch (_) {}
      return initial;
    }
    const data: CombatStreakData = JSON.parse(raw);
    
    // Check if streak was broken (lastActive was before yesterday)
    const today = getTodayKey();
    const yesterday = getYesterdayKey();
    if (data.lastActiveDate && data.lastActiveDate !== today && data.lastActiveDate !== yesterday) {
      // Streak broken!
      data.currentStreak = 0;
      data.tier = calculateTier(data.currentStreak, data.totalAuraPoints);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (_) {}
    }
    return data;
  } catch (e) {
    console.error('Failed to read combat streak data:', e);
    return getDefaultStreakData();
  }
};

export const saveCombatStreakData = (data: CombatStreakData, notify: boolean = true): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (notify && typeof window !== 'undefined') {
      // Defer event dispatch to the next event loop tick so it NEVER triggers setState during React's render phase
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('yard300_streak_updated', { detail: data }));
      }, 0);
    }
  } catch (e) {
    console.error('Failed to save combat streak data:', e);
  }
};

export interface RecordActivityResult {
  data: CombatStreakData;
  pointsAdded: number;
  streakIncremented: boolean;
  isFirstActivityToday: boolean;
  multiplier: number;
}

/**
 * Record an active combat activity in YARD300 (e.g. workout completed, biometric sync, movement break)
 * Rewards base Aura Points multiplied by current streak multiplier!
 */
export const recordCombatActivity = (baseReward: number = 50, activityType: string = 'general'): RecordActivityResult => {
  const current = getCombatStreakData();
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  
  const isFirstActivityToday = !current.history[today] || !current.history[today].active;
  let streakIncremented = false;

  // Streak multiplier: e.g. 7 day streak = 1.7x points!
  const multiplier = Math.min(3.0, 1.0 + (current.currentStreak * 0.1));
  const pointsAdded = Math.round(baseReward * multiplier);

  if (isFirstActivityToday) {
    if (current.lastActiveDate === yesterday) {
      current.currentStreak += 1;
      streakIncremented = true;
    } else if (current.lastActiveDate === today) {
      // Already active today
    } else {
      // Starting new streak
      current.currentStreak = 1;
      streakIncremented = true;
    }

    if (current.currentStreak > current.bestStreak) {
      current.bestStreak = current.currentStreak;
    }

    current.totalActiveDays += 1;
    current.lastActiveDate = today;

    current.history[today] = {
      date: today,
      active: true,
      pointsEarned: pointsAdded,
      activityCount: 1
    };
  } else {
    // Add points to existing today record
    current.history[today].pointsEarned += pointsAdded;
    current.history[today].activityCount += 1;
  }

  current.totalAuraPoints += pointsAdded;
  current.tier = calculateTier(current.currentStreak, current.totalAuraPoints);

  saveCombatStreakData(current);

  return {
    data: current,
    pointsAdded,
    streakIncremented,
    isFirstActivityToday,
    multiplier
  };
};

/**
 * Quick claim daily active check-in
 */
export const claimDailyCheckIn = (): RecordActivityResult => {
  return recordCombatActivity(100, 'daily_checkin');
};
