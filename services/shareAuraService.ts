/**
 * Share My Aura Service
 * Generates unique, shareable URL tokens containing athlete profile statistics
 * and Aura status, and decodes them when opened by other users.
 */

export interface SharedAuraData {
  athleteName: string;
  level: number;
  rankTitle: string;
  specialization: string;
  specializationAr?: string;
  auraScore: number;
  peakPower: number;
  calories: number;
  workoutMinutes: number;
  currentStreak: number;
  totalAuraPoints: number;
  tier: string;
  avatar: string;
  element: 'cyan' | 'flame' | 'solar' | 'void' | 'prismatic';
  attributeScores: {
    power: number;
    agility: number;
    stamina: number;
    focus: number;
    recovery: number;
    auraRank: number;
  };
  generatedAt: number;
}

/**
 * Encodes SharedAuraData into a URL-safe Base64 string
 */
export const encodeAuraData = (data: SharedAuraData): string => {
  try {
    const json = JSON.stringify(data);
    const utf8Bytes = encodeURIComponent(json);
    return btoa(utf8Bytes)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (err) {
    console.error('Failed to encode aura data:', err);
    return '';
  }
};

/**
 * Decodes a URL-safe Base64 token into SharedAuraData
 */
export const decodeAuraData = (token: string): SharedAuraData | null => {
  try {
    if (!token) return null;
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const decodedUtf8 = atob(base64);
    const json = decodeURIComponent(decodedUtf8);
    const data = JSON.parse(json);

    // Basic structure verification
    if (!data.athleteName || typeof data.level !== 'number') {
      return null;
    }
    return data as SharedAuraData;
  } catch (err) {
    console.error('Failed to decode aura data from URL:', err);
    return null;
  }
};

/**
 * Generates a full shareable URL containing the aura token
 */
export const generateShareAuraUrl = (data: SharedAuraData): string => {
  const token = encodeAuraData(data);
  if (typeof window === 'undefined') return `?aura=${token}`;
  
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}?aura=${token}#shared-aura`;
};

/**
 * Reads aura token from current URL search params or hash
 */
export const getSharedAuraFromUrl = (): SharedAuraData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // 1. Check URLSearchParams
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromQuery = searchParams.get('aura') || searchParams.get('share_aura');
    if (tokenFromQuery) {
      return decodeAuraData(tokenFromQuery);
    }

    // 2. Check hash in case query was placed in hash (e.g. #shared-aura?aura=...)
    const hash = window.location.hash;
    if (hash && hash.includes('aura=')) {
      const parts = hash.split('aura=');
      if (parts[1]) {
        const hashToken = parts[1].split('&')[0];
        return decodeAuraData(hashToken);
      }
    }
  } catch (err) {
    console.error('Error parsing shared aura from URL:', err);
  }

  return null;
};

/**
 * Copies text to clipboard with fallback
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};
