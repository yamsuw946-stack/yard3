/**
 * YARD 300 Official Launch Countdown Engine
 * Automatically counts down in real-time from 28 days across sessions.
 */

const LAUNCH_STORAGE_KEY = 'yard300_official_launch_timestamp_v28';
const DURATION_28_DAYS_MS = 28 * 24 * 60 * 60 * 1000;

export interface LaunchTimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export const getLaunchTargetTimestamp = (): number => {
  if (typeof window === 'undefined') {
    return Date.now() + DURATION_28_DAYS_MS;
  }
  try {
    const stored = localStorage.getItem(LAUNCH_STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed > Date.now()) {
        return parsed;
      }
    }
    const newTarget = Date.now() + DURATION_28_DAYS_MS;
    localStorage.setItem(LAUNCH_STORAGE_KEY, newTarget.toString());
    return newTarget;
  } catch {
    return Date.now() + DURATION_28_DAYS_MS;
  }
};

export const calculateLaunchTimeRemaining = (targetMs: number): LaunchTimeRemaining => {
  const diff = Math.max(0, targetMs - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, totalMs: diff };
};
