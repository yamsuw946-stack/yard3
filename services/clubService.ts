/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StoryComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: number;
}

export interface ClubStory {
  id: string;
  clubId: string;
  clubName: string;
  clubLogo: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  caption: string;
  mediaUrl: string;
  mediaType?: 'image' | 'video';
  badgeType: 'DRILL' | 'RECOVERY' | 'SPARRING' | 'STREAK' | 'GAUNTLET';
  durationMinutes?: number;
  burnCalories?: number;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAX OVERDRIVE';
  createdAt: number;
  expiresAt: number;
  viewsCount: number;
  reactions: {
    fire: number;
    lightning: number;
    muscle: number;
    crown: number;
    boxing: number;
  };
  userReactions: string[];
  comments?: StoryComment[];
}

export interface ClubMember {
  id: string;
  name: string;
  avatar: string;
  tier: string;
  streak: number;
  powerLevel: number;
  joinedDate: string;
  isExternal: boolean;
  status: 'online' | 'training' | 'resting';
}

export interface ClubData {
  id: string;
  name: string;
  motto: string;
  category: 'Boxing & Striking' | 'Calisthenics & Power' | 'HIIT & Endurance' | 'Pilates & Mobility' | 'Cyber Athletics';
  logoUrl: string;
  bannerUrl: string;
  accentColor: string;
  priceUSD?: number; // $30 Club Founder Pass
  ownerName: string;
  ownerAvatar: string;
  ownerMemberId: string;
  levelRequired: number; // Level 3 required
  isUnlocked: boolean;
  inviteCode: string;
  inviteUrl: string;
  createdAt: string;
  followersCount: number;
  totalAuraScore: number;
  weeklyWorkouts: number;
  members: ClubMember[];
  stories: ClubStory[];
  dailyDrill: {
    title: string;
    desc: string;
    targetReps: string;
    xpReward: number;
    completedCount: number;
  };
  announcements: {
    id: string;
    text: string;
    date: string;
    author: string;
  }[];
}

const STORAGE_KEY_CLUB = 'yard300_custom_club_data';
const STORAGE_KEY_USER_LEVEL = 'yard300_user_subscription_level';
const STORAGE_KEY_CONNECTIONS = 'yard300_connected_subscribers';
const STORAGE_KEY_USER_STORIES = 'yard300_personal_user_stories';

export const CLUB_LOGO_PRESETS = [
  { id: 'crown', name: 'Titan Sovereign', icon: '👑', bg: 'from-purple-600 to-indigo-600' },
  { id: 'phoenix', name: 'Emerald Phoenix', icon: '🦅', bg: 'from-emerald-500 to-teal-700' },
  { id: 'samurai', name: 'Violet Katana', icon: '⚔️', bg: 'from-purple-600 to-violet-900' },
  { id: 'fist', name: 'Jade Striker', icon: '🥊', bg: 'from-emerald-600 to-green-800' },
  { id: 'dragon', name: 'Cyber Dragon', icon: '🐉', bg: 'from-purple-700 to-pink-600' },
  { id: 'lion', name: 'Golden Lion', icon: '🦁', bg: 'from-amber-500 to-yellow-300' },
  { id: 'tiger', name: 'Apex Panther', icon: '🐯', bg: 'from-orange-500 to-amber-600' },
  { id: 'lightning', name: 'Overdrive Volt', icon: '⚡', bg: 'from-yellow-400 to-cyan-400' },
];

export const CLUB_THEME_COLORS = [
  { id: 'violet', name: 'Cyber Purple (Violet)', hex: '#A855F7', border: 'border-[#A855F7]', glow: 'rgba(168,85,247,0.5)' },
  { id: 'emerald', name: 'Neon Emerald (Green)', hex: '#10B981', border: 'border-[#10B981]', glow: 'rgba(16,185,129,0.5)' },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#00F0FF', border: 'border-[#00F0FF]', glow: 'rgba(0,240,255,0.5)' },
  { id: 'gold', name: 'Neon Gold', hex: '#FFE600', border: 'border-[#FFE600]', glow: 'rgba(255,230,0,0.5)' },
  { id: 'rose', name: 'Titan Rose', hex: '#FF007A', border: 'border-[#FF007A]', glow: 'rgba(255,0,122,0.5)' },
  { id: 'crimson', name: 'Crimson Red', hex: '#E50914', border: 'border-[#E50914]', glow: 'rgba(229,9,20,0.5)' },
];

export const INITIAL_AVAILABLE_ATHLETES: ClubMember[] = [
  {
    id: 'ath-1',
    name: 'Kenji Sato',
    avatar: '/images/ai_human_aerial_male.jpg',
    tier: 'Tier 3 Titan',
    streak: 18,
    powerLevel: 9420,
    joinedDate: '2026-03-12',
    isExternal: false,
    status: 'training',
  },
  {
    id: 'ath-2',
    name: 'M.T.K',
    avatar: '/images/mtk_anime_pink_pilates.jpg',
    tier: 'Tier 4 Overdrive',
    streak: 24,
    powerLevel: 9880,
    joinedDate: '2026-03-15',
    isExternal: false,
    status: 'online',
  },
  {
    id: 'ath-3',
    name: 'Isabella Silva',
    avatar: '/images/woman_brazilian_fitness.jpg',
    tier: 'Tier 4 Sovereign',
    streak: 21,
    powerLevel: 9690,
    joinedDate: '2026-03-20',
    isExternal: false,
    status: 'training',
  },
  {
    id: 'ath-4',
    name: 'Noura Al-Rashid',
    avatar: '/images/woman_levantine_striker.jpg',
    tier: 'Tier 3 Titan',
    streak: 17,
    powerLevel: 9380,
    joinedDate: '2026-04-01',
    isExternal: false,
    status: 'online',
  },
  {
    id: 'ath-5',
    name: 'Anastasia Volkov',
    avatar: '/images/woman_slavic_boxer.jpg',
    tier: 'Tier 3 Titan',
    streak: 19,
    powerLevel: 9540,
    joinedDate: '2026-04-04',
    isExternal: false,
    status: 'training',
  },
  {
    id: 'ath-6',
    name: 'Dr. Soren Mercer',
    avatar: '/images/ai_human_performance_coach.jpg',
    tier: 'Tier 3 Titan',
    streak: 15,
    powerLevel: 9300,
    joinedDate: '2026-04-06',
    isExternal: false,
    status: 'online',
  },
];

export const PRESET_COMMUNITY_CLUBS = [
  {
    id: 'club-valkyrie',
    name: 'YARD PILATES & MOBILITY LAB',
    motto: 'Precision core alignment, emerald focus, and kinetic breathwork.',
    logoUrl: '🦅',
    accentColor: '#D4AF37',
    followersCount: 342,
    ownerName: 'M.T.K',
  },
  {
    id: 'club-flame',
    name: 'APEX CONDITIONING ATELIER',
    motto: 'Relentless power output engineered beyond standard thresholds.',
    logoUrl: '🔥',
    accentColor: '#10B981',
    followersCount: 512,
    ownerName: 'Kenji Sato',
  },
  {
    id: 'club-shadow',
    name: 'NORDIC TACTICAL STRIKE',
    motto: 'Precision speed drills, tactical footwork, and explosive recovery.',
    logoUrl: '⚔️',
    accentColor: '#D4AF37',
    followersCount: 289,
    ownerName: 'Victor Kael',
  },
];

const DEFAULT_CLUB: ClubData = {
  id: 'club-titan-apex-300',
  name: 'TITAN APEX PERFORMANCE CLUB',
  motto: 'Precision speed, unbroken endurance, engineered daily discipline.',
  category: 'Boxing & Striking',
  logoUrl: '👑',
  bannerUrl: '/images/ai_human_arena_duo.jpg',
  accentColor: '#D4AF37',
  priceUSD: 30,
  ownerName: 'YAM SUW',
  ownerAvatar: '/images/yam_suw_athlete.jpg',
  ownerMemberId: 'YD-300-8842',
  levelRequired: 3,
  isUnlocked: true,
  inviteCode: 'TITAN-300-VIP',
  inviteUrl: typeof window !== 'undefined' ? window.location.origin + '/#club=TITAN-300-VIP' : '/#club=TITAN-300-VIP',
  createdAt: '2026-04-01',
  followersCount: 148,
  totalAuraScore: 84250,
  weeklyWorkouts: 412,
  members: [
    {
      id: 'owner-yam',
      name: 'YAM SUW (Club Founder)',
      avatar: '/images/yam_suw_athlete.jpg',
      tier: 'Tier 3 Titan Apex',
      streak: 30,
      powerLevel: 9950,
      joinedDate: '2026-04-01',
      isExternal: false,
      status: 'online',
    },
    ...INITIAL_AVAILABLE_ATHLETES.slice(0, 4),
  ],
  stories: [
    {
      id: 'story-1',
      clubId: 'club-titan-apex-300',
      clubName: 'TITAN APEX PERFORMANCE CLUB',
      clubLogo: '👑',
      authorName: 'YAM SUW',
      authorAvatar: '/images/yam_suw_athlete.jpg',
      title: 'Dawn Heavy Bag 500 Combos',
      caption: 'Completed morning neuromuscular conditioning. 500 power hooks & jabs. Heart rate peaked at 178 BPM.',
      mediaUrl: '/images/ai_human_striker_male.jpg',
      mediaType: 'image',
      badgeType: 'SPARRING',
      durationMinutes: 45,
      burnCalories: 620,
      intensity: 'HIGH',
      createdAt: Date.now() - 3600000 * 2,
      expiresAt: Date.now() + 3600000 * 22,
      viewsCount: 184,
      reactions: { fire: 42, lightning: 29, muscle: 55, crown: 18, boxing: 63 },
      userReactions: ['fire', 'muscle'],
      comments: [
        { id: 'c-1', authorName: 'M.T.K', authorAvatar: '/images/mtk_anime_pink_pilates.jpg', text: 'Refined form and velocity today. Pilates session locked in.', createdAt: Date.now() - 3000000 },
        { id: 'c-2', authorName: 'Kenji Sato', authorAvatar: '/images/ai_human_aerial_male.jpg', text: 'Strong output. Keep pacing consistent.', createdAt: Date.now() - 1500000 },
      ]
    },
    {
      id: 'story-2',
      clubId: 'club-titan-apex-300',
      clubName: 'TITAN APEX PERFORMANCE CLUB',
      clubLogo: '👑',
      authorName: 'M.T.K',
      authorAvatar: '/images/mtk_anime_pink_pilates.jpg',
      title: 'Morning Pilates & HRV 98ms Recovery',
      caption: 'Post-sprint Pilates alignment and deep parasympathetic nervous system reboot.',
      mediaUrl: '/images/mtk_anime_pink_pilates.jpg',
      mediaType: 'image',
      badgeType: 'RECOVERY',
      durationMinutes: 25,
      burnCalories: 140,
      intensity: 'LOW',
      createdAt: Date.now() - 3600000 * 5,
      expiresAt: Date.now() + 3600000 * 19,
      viewsCount: 215,
      reactions: { fire: 31, lightning: 17, muscle: 38, crown: 25, boxing: 12 },
      userReactions: ['lightning'],
      comments: []
    },
    {
      id: 'story-3',
      clubId: 'club-titan-apex-300',
      clubName: 'TITAN APEX PERFORMANCE CLUB',
      clubLogo: '👑',
      authorName: 'Isabella Silva',
      authorAvatar: '/images/woman_brazilian_fitness.jpg',
      title: '1,000 Calisthenics Gauntlet Completed',
      caption: 'Unbroken sets of 50. Total time 32 minutes. Level 3 club athletes pushing telemetry standards.',
      mediaUrl: '/images/woman_latina_sprinter.jpg',
      mediaType: 'image',
      badgeType: 'GAUNTLET',
      durationMinutes: 32,
      burnCalories: 480,
      intensity: 'MAX OVERDRIVE',
      createdAt: Date.now() - 3600000 * 8,
      expiresAt: Date.now() + 3600000 * 16,
      viewsCount: 304,
      reactions: { fire: 89, lightning: 64, muscle: 112, crown: 47, boxing: 88 },
      userReactions: [],
      comments: []
    },
  ],
  dailyDrill: {
    title: 'Titan Rapid Combat Interval (300 Reps)',
    desc: '100 Jab-Cross Combinations + 100 Jump Squats + 100 Core Knee Tucks. Complete before midnight.',
    targetReps: '300 Total Reps',
    xpReward: 350,
    completedCount: 68,
  },
  announcements: [
    {
      id: 'ann-1',
      text: 'Club Tournament gauntlet registration opens this Friday. Exclusive for all active followers.',
      date: '2026-04-08',
      author: 'YAM SUW',
    },
    {
      id: 'ann-2',
      text: 'New club t-shirt & training gear batch available in store with 25% club member discount.',
      date: '2026-04-06',
      author: 'YAM SUW',
    },
  ],
};

const isLegacyImage = (url?: string): boolean => {
  if (!url) return true;
  return /anime_|boxing_striker|tarik_saiyan|ninja_kunoichi|ren_flame|live_arena_|realistic_mma_brawler/.test(url);
};

export const getCustomClubData = (): ClubData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CLUB);
    if (saved) {
      const parsed: ClubData = JSON.parse(saved);
      return {
        ...parsed,
        bannerUrl: isLegacyImage(parsed.bannerUrl) ? DEFAULT_CLUB.bannerUrl : parsed.bannerUrl,
        ownerAvatar: isLegacyImage(parsed.ownerAvatar) ? DEFAULT_CLUB.ownerAvatar : parsed.ownerAvatar,
        members: (parsed.members || []).map((m, idx) => ({
          ...m,
          avatar: isLegacyImage(m.avatar)
            ? INITIAL_AVAILABLE_ATHLETES[idx % INITIAL_AVAILABLE_ATHLETES.length].avatar
            : m.avatar,
        })),
        stories: (parsed.stories || []).map((st, idx) => ({
          ...st,
          authorAvatar: isLegacyImage(st.authorAvatar) ? DEFAULT_CLUB.ownerAvatar : st.authorAvatar,
          mediaUrl: isLegacyImage(st.mediaUrl)
            ? (DEFAULT_CLUB.stories[idx % DEFAULT_CLUB.stories.length]?.mediaUrl || '/images/ai_human_arena_duo.jpg')
            : st.mediaUrl,
        })),
      };
    }
  } catch {}
  return DEFAULT_CLUB;
};

export const saveCustomClubData = (data: ClubData): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CLUB, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('yard300_club_updated', { detail: { club: data } }));
  } catch {}
};

export const getUserSubscriptionLevel = (): number => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER_LEVEL);
    if (saved) return parseInt(saved, 10);
  } catch {}
  return 3; // Default Tier 3 Titan so user can test and manage clubs immediately
};

export const setUserSubscriptionLevel = (level: number): void => {
  try {
    localStorage.setItem(STORAGE_KEY_USER_LEVEL, level.toString());
    window.dispatchEvent(new CustomEvent('yard300_level_updated', { detail: { level } }));
  } catch {}
};

export const publishClubStory = (storyData: Omit<ClubStory, 'id' | 'createdAt' | 'expiresAt' | 'viewsCount' | 'reactions' | 'userReactions' | 'comments'>): ClubStory => {
  const club = getCustomClubData();
  const newStory: ClubStory = {
    id: `story-${Date.now()}`,
    ...storyData,
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000,
    viewsCount: 1,
    reactions: { fire: 0, lightning: 0, muscle: 0, crown: 0, boxing: 0 },
    userReactions: [],
    comments: [],
  };
  const updatedStories = [newStory, ...club.stories];
  const updatedClub = { ...club, stories: updatedStories };
  saveCustomClubData(updatedClub);
  return newStory;
};

export const reactToClubStory = (storyId: string, reaction: 'fire' | 'lightning' | 'muscle' | 'crown' | 'boxing'): ClubStory | null => {
  const club = getCustomClubData();
  let updatedStory: ClubStory | null = null;
  const updatedStories = club.stories.map((st) => {
    if (st.id === storyId) {
      const alreadyReacted = st.userReactions.includes(reaction);
      const newCount = alreadyReacted ? Math.max(0, st.reactions[reaction] - 1) : st.reactions[reaction] + 1;
      const newUserReactions = alreadyReacted 
        ? st.userReactions.filter(r => r !== reaction) 
        : [...st.userReactions, reaction];
      updatedStory = {
        ...st,
        reactions: { ...st.reactions, [reaction]: newCount },
        userReactions: newUserReactions,
      };
      return updatedStory;
    }
    return st;
  });
  saveCustomClubData({ ...club, stories: updatedStories });
  return updatedStory;
};

export const addStoryComment = (storyId: string, text: string, authorName: string, authorAvatar: string): ClubStory | null => {
  const club = getCustomClubData();
  let updatedStory: ClubStory | null = null;
  const updatedStories = club.stories.map((st) => {
    if (st.id === storyId) {
      const newComment: StoryComment = {
        id: `c-${Date.now()}`,
        authorName,
        authorAvatar,
        text,
        createdAt: Date.now(),
      };
      const existingComments = st.comments || [];
      updatedStory = {
        ...st,
        comments: [...existingComments, newComment]
      };
      return updatedStory;
    }
    return st;
  });
  saveCustomClubData({ ...club, stories: updatedStories });
  return updatedStory;
};

export const addClubMember = (member: ClubMember): void => {
  const club = getCustomClubData();
  if (club.members.some(m => m.id === member.id)) return;
  const updatedMembers = [...club.members, member];
  saveCustomClubData({ ...club, members: updatedMembers, followersCount: club.followersCount + 1 });
};

export const removeClubMember = (memberId: string): void => {
  const club = getCustomClubData();
  const updatedMembers = club.members.filter(m => m.id !== memberId);
  saveCustomClubData({ ...club, members: updatedMembers, followersCount: Math.max(0, club.followersCount - 1) });
};

// Subscriber Mutual Connections (Friends / Squad Network)
export const getConnectedSubscribers = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
    if (saved) return JSON.parse(saved);
  } catch {}
  return ['ath-1', 'ath-2']; // Default connected friends
};

export const toggleConnectSubscriber = (subscriberId: string): boolean => {
  try {
    const list = getConnectedSubscribers();
    let updated: string[];
    let isConnectedNow: boolean;
    if (list.includes(subscriberId)) {
      updated = list.filter(id => id !== subscriberId);
      isConnectedNow = false;
    } else {
      updated = [...list, subscriberId];
      isConnectedNow = true;
    }
    localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('yard300_connections_updated', { detail: { connections: updated } }));
    return isConnectedNow;
  } catch {
    return false;
  }
};

// Personal Subscriber User Stories
export const getUserStories = (): ClubStory[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER_STORIES);
    if (saved) return JSON.parse(saved);
  } catch {}
  // Default user stories from custom club
  const club = getCustomClubData();
  return club.stories;
};

export const publishUserStory = (storyData: Omit<ClubStory, 'id' | 'createdAt' | 'expiresAt' | 'viewsCount' | 'reactions' | 'userReactions' | 'comments'>): ClubStory => {
  // Publish both to custom club and personal user stories
  const published = publishClubStory(storyData);
  try {
    const existing = getUserStories();
    const updated = [published, ...existing.filter(s => s.id !== published.id)];
    localStorage.setItem(STORAGE_KEY_USER_STORIES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('yard300_user_stories_updated', { detail: { stories: updated } }));
  } catch {}
  return published;
};
