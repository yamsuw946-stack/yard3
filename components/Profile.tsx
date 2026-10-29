/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  Sparkles, Sliders, Share2, Copy, Check, Link2,
  Upload, Image as ImageIcon, Video as VideoIcon, PlusCircle, 
  Play, Flame, Zap, Dumbbell, X, Send, UserCheck, UserPlus, Users, Radio, MessageSquare,
  LogIn, LogOut, Edit3, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { HERO_IMAGE, CHALLENGER_IMAGE, handleImageError } from '../constants';
import { FitnessDataPoint, AttributeData } from '../types';
import { Language } from '../i18n';
import { authService, AuthUser } from '../services/authService';
import { HydrationTracker } from './HydrationTracker';
import { HeartRateLoadChart } from './HeartRateLoadChart';
import { CombatStreak } from './CombatStreak';
import { recordCombatActivity, getCombatStreakData } from '../services/combatStreak';
import { SharedAuraModal } from './SharedAuraModal';
import { SharedAuraData, generateShareAuraUrl, copyToClipboard } from '../services/shareAuraService';
import { soundFX } from '../services/soundFX';
import { 
  getUserStories, 
  publishUserStory, 
  reactToClubStory, 
  addStoryComment, 
  getConnectedSubscribers, 
  toggleConnectSubscriber,
  INITIAL_AVAILABLE_ATHLETES,
  ClubStory 
} from '../services/clubService';

const getWeeklyData = (isAr: boolean): FitnessDataPoint[] => [
  { day: isAr ? 'الأحد' : 'Sun', powerLevel: 7200, calories: 650, workoutMinutes: 60, auraScore: 82 },
  { day: isAr ? 'الإثنين' : 'Mon', powerLevel: 8100, calories: 820, workoutMinutes: 75, auraScore: 88 },
  { day: isAr ? 'الثلاثاء' : 'Tue', powerLevel: 7800, calories: 710, workoutMinutes: 65, auraScore: 85 },
  { day: isAr ? 'الأربعاء' : 'Wed', powerLevel: 8900, calories: 950, workoutMinutes: 90, auraScore: 92 },
  { day: isAr ? 'الخميس' : 'Thu', powerLevel: 9400, calories: 1100, workoutMinutes: 105, auraScore: 96 },
  { day: isAr ? 'الجمعة' : 'Fri', powerLevel: 8500, calories: 800, workoutMinutes: 70, auraScore: 90 },
  { day: isAr ? 'السبت' : 'Sat', powerLevel: 9850, calories: 1250, workoutMinutes: 120, auraScore: 99 },
];

const getMonthlyData = (isAr: boolean): FitnessDataPoint[] => [
  { day: isAr ? 'الأسبوع 1' : 'Week 1', powerLevel: 28000, calories: 4200, workoutMinutes: 380, auraScore: 84 },
  { day: isAr ? 'الأسبوع 2' : 'Week 2', powerLevel: 32000, calories: 4800, workoutMinutes: 420, auraScore: 89 },
  { day: isAr ? 'الأسبوع 3' : 'Week 3', powerLevel: 36500, calories: 5300, workoutMinutes: 470, auraScore: 94 },
  { day: isAr ? 'الأسبوع 4' : 'Week 4', powerLevel: 41200, calories: 6100, workoutMinutes: 530, auraScore: 98 },
];

const getAttributeData = (isAr: boolean): AttributeData[] => [
  { attribute: isAr ? 'القوة الانفجارية' : 'Power', score: 96, fullMark: 100 },
  { attribute: isAr ? 'السرعة والبديهة' : 'Agility', score: 92, fullMark: 100 },
  { attribute: isAr ? 'التحمل العضلي' : 'Stamina', score: 98, fullMark: 100 },
  { attribute: isAr ? 'التركيز والصلابة' : 'Focus', score: 95, fullMark: 100 },
  { attribute: isAr ? 'سرعة الاستشفاء' : 'Recovery', score: 88, fullMark: 100 },
  { attribute: isAr ? 'طاقة الهالة S-Rank' : 'Aura Rank', score: 99, fullMark: 100 },
];

interface ProfileProps {
  onBack: () => void;
  currentLang?: Language;
  onOpenAuraVisualizer?: () => void;
  onNavigateToEngine?: () => void;
  onNavigateToClub?: () => void;
  onOpenAuth?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  onBack, 
  currentLang = 'en', 
  onOpenAuraVisualizer, 
  onNavigateToEngine,
  onNavigateToClub,
  onOpenAuth
}) => {
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';
  const isAr = currentLang === 'ar';

  // Synchronized User Auth Profile State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editSpecialization, setEditSpecialization] = useState<string>('');
  const [editAvatar, setEditAvatar] = useState<string>('');
  const [editSuccess, setEditSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleAuthChange = () => {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      if (user?.avatar) {
        setProfileAvatar(user.avatar);
      }
    };
    window.addEventListener('yard300_auth_change', handleAuthChange);
    return () => window.removeEventListener('yard300_auth_change', handleAuthChange);
  }, []);

  const storyFileInputRef = useRef<HTMLInputElement>(null);
  const [userStories, setUserStories] = useState<ClubStory[]>(() => getUserStories());
  const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useState(false);
  const [activeStoryViewer, setActiveStoryViewer] = useState<ClubStory | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [connectedSubscribers, setConnectedSubscribers] = useState<string[]>(() => getConnectedSubscribers());

  // Form states for profile story upload
  const [storyTitle, setStoryTitle] = useState('');
  const [storyCaption, setStoryCaption] = useState('');
  const [storyBadge, setStoryBadge] = useState<ClubStory['badgeType']>('DRILL');
  const [storyIntensity, setStoryIntensity] = useState<ClubStory['intensity']>('HIGH');
  const [storyDuration, setStoryDuration] = useState<number>(30);
  const [storyCalories, setStoryCalories] = useState<number>(450);
  const [uploadedStoryMedia, setUploadedStoryMedia] = useState<string>('');
  const [uploadedStoryType, setUploadedStoryType] = useState<'image' | 'video'>('image');
  const [uploadedStoryName, setUploadedStoryName] = useState<string>('');
  const [storyCommentInput, setStoryCommentInput] = useState<string>('');

  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [profileAvatar, setProfileAvatar] = useState<string>(() => {
    return localStorage.getItem('aura_profile_avatar') || localStorage.getItem('aura_custom_avatar') || CHALLENGER_IMAGE;
  });

  // Story Timer
  useEffect(() => {
    if (!activeStoryViewer) {
      setStoryProgress(0);
      return;
    }
    setStoryProgress(0);
    const interval = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setActiveStoryViewer(null);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [activeStoryViewer]);

  // Sync user stories update
  useEffect(() => {
    const handleStoriesUpdate = () => {
      setUserStories(getUserStories());
    };
    const handleConnectionsUpdate = (e: any) => {
      if (e.detail?.connections) {
        setConnectedSubscribers(e.detail.connections);
      }
    };
    window.addEventListener('yard300_user_stories_updated', handleStoriesUpdate);
    window.addEventListener('yard300_connections_updated', handleConnectionsUpdate);
    return () => {
      window.removeEventListener('yard300_user_stories_updated', handleStoriesUpdate);
      window.removeEventListener('yard300_connections_updated', handleConnectionsUpdate);
    };
  }, []);

  const handleStoryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    soundFX.playPowerUp();
    const isVideo = file.type.startsWith('video');
    setUploadedStoryType(isVideo ? 'video' : 'image');
    setUploadedStoryName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setUploadedStoryMedia(res);
    };
    reader.readAsDataURL(file);
  };

  const handlePublishStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim()) return;
    soundFX.playStrikeHit();
    const media = uploadedStoryMedia || profileAvatar || '';
    publishUserStory({
      clubId: 'club-titan-apex-300',
      clubName: 'TITAN APEX SQUAD',
      clubLogo: '👑',
      authorName: athleteName,
      authorAvatar: profileAvatar,
      title: storyTitle.trim(),
      caption: storyCaption.trim(),
      mediaUrl: media,
      mediaType: uploadedStoryType,
      badgeType: storyBadge,
      durationMinutes: storyDuration,
      burnCalories: storyCalories,
      intensity: storyIntensity
    });
    setUserStories(getUserStories());
    setStoryTitle('');
    setStoryCaption('');
    setUploadedStoryMedia('');
    setUploadedStoryName('');
    setIsNewStoryModalOpen(false);
  };

  const handleToggleFriend = (athId: string) => {
    soundFX.playButtonClick();
    toggleConnectSubscriber(athId);
    setConnectedSubscribers(getConnectedSubscribers());
  };

  const handleReactToViewerStory = (reaction: 'fire' | 'lightning' | 'muscle' | 'crown' | 'boxing') => {
    if (!activeStoryViewer) return;
    soundFX.playAuraSurge();
    const updated = reactToClubStory(activeStoryViewer.id, reaction);
    if (updated) {
      setActiveStoryViewer(updated);
      setUserStories(getUserStories());
    }
  };

  const handleAddStoryCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStoryViewer || !storyCommentInput.trim()) return;
    soundFX.playButtonClick();
    const updated = addStoryComment(
      activeStoryViewer.id, 
      storyCommentInput.trim(), 
      athleteName, 
      profileAvatar
    );
    if (updated) {
      setActiveStoryViewer(updated);
      setUserStories(getUserStories());
    }
    setStoryCommentInput('');
  };

  useEffect(() => {
    const handleAvatarUpdate = () => {
      const saved = localStorage.getItem('aura_profile_avatar') || localStorage.getItem('aura_custom_avatar');
      if (saved) setProfileAvatar(saved);
    };
    window.addEventListener('aura_avatar_updated', handleAvatarUpdate);
    return () => window.removeEventListener('aura_avatar_updated', handleAvatarUpdate);
  }, []);
  const [fitnessData, setFitnessData] = useState<FitnessDataPoint[]>(() => getWeeklyData(isAr));
  const [showLogModal, setShowLogModal] = useState(false);
  
  // Update data when language toggles
  useEffect(() => {
    setFitnessData(getWeeklyData(isAr));
  }, [isAr]);

  // New session state
  const [newDay, setNewDay] = useState(isAr ? 'الجولة القادمة' : 'Next Session');
  const [newCalories, setNewCalories] = useState<number>(850);
  const [newMinutes, setNewMinutes] = useState<number>(80);
  const [newPower, setNewPower] = useState<number>(9500);

  const activeData = timeframe === 'week' ? fitnessData : getMonthlyData(isAr);
  const attributeData = getAttributeData(isAr);

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPoint: FitnessDataPoint = {
      day: newDay,
      powerLevel: Number(newPower),
      calories: Number(newCalories),
      workoutMinutes: Number(newMinutes),
      auraScore: Math.min(100, Math.round((Number(newPower) / 10000) * 100)),
    };

    setFitnessData(prev => [...prev, updatedPoint]);
    // Reward combat streak & Aura Points for logging workout session!
    recordCombatActivity(75, 'workout_log');
    setShowLogModal(false);
  };

  // Calculate totals
  const totalCalories = activeData.reduce((acc, d) => acc + d.calories, 0);
  const totalMinutes = activeData.reduce((acc, d) => acc + d.workoutMinutes, 0);
  const peakPower = Math.max(...activeData.map(d => d.powerLevel));
  const avgAura = Math.round(activeData.reduce((acc, d) => acc + d.auraScore, 0) / activeData.length);

  // Share My Aura State & Data Construction
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [directCopied, setDirectCopied] = useState<boolean>(false);
  const [streakData, setStreakData] = useState(() => getCombatStreakData());

  useEffect(() => {
    const handleStreakUpdate = (e: any) => {
      if (e.detail) {
        setStreakData(e.detail);
      } else {
        setStreakData(getCombatStreakData());
      }
    };
    window.addEventListener('yard300_streak_updated', handleStreakUpdate);
    return () => window.removeEventListener('yard300_streak_updated', handleStreakUpdate);
  }, []);

  const athleteName = currentUser?.name || (isAr ? 'رياضي YARD 300' : 'YARD 300 ATHLETE');
  const athleteRank = currentUser?.rankTitle || (isAr ? 'المستوى الأول (ضيف)' : 'A-RANK WARRIOR');
  const athleteLevel = currentUser?.level || 45;
  const athleteSpec = isAr 
    ? (currentUser?.specializationAr || currentUser?.specialization || 'الملاكمة الحركية والتحمل العضلي 🥊') 
    : (currentUser?.specialization || 'Kinetic Striking & Endurance 🥊');
  const athleteRole = currentUser?.role || 'athlete';

  const currentAuraData: SharedAuraData = {
    athleteName,
    level: athleteLevel,
    rankTitle: athleteRank,
    specialization: currentUser?.specialization || 'Kinetic Striking & Endurance 🥊',
    specializationAr: currentUser?.specializationAr || 'الملاكمة الحركية والتحمل العضلي 🥊',
    auraScore: avgAura,
    peakPower: peakPower,
    calories: totalCalories,
    workoutMinutes: totalMinutes,
    currentStreak: streakData.currentStreak || (currentUser?.streakDays ?? 14),
    totalAuraPoints: streakData.totalAuraPoints || (currentUser?.totalAuraPoints ?? 6420),
    tier: streakData.tier || athleteRank,
    avatar: profileAvatar,
    element: 'cyan',
    attributeScores: {
      power: 96,
      agility: 92,
      stamina: 98,
      focus: 95,
      recovery: 88,
      auraRank: athleteLevel
    },
    generatedAt: Date.now()
  };

  const handleDirectCopyLink = async () => {
    soundFX.playButtonClick();
    const shareUrl = generateShareAuraUrl(currentAuraData);
    const success = await copyToClipboard(shareUrl);
    if (success) {
      soundFX.playSuccess();
      soundFX.playAuraBurst();
      setDirectCopied(true);
      setTimeout(() => setDirectCopied(false), 3000);
    }
  };

  return (
    <div className={`min-h-screen pt-28 pb-24 bg-[#0A0B10] text-white relative overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Background Neon Gradients & Speedlines */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Mecha Cockpit Top Telemetry Bar & Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-3 rounded-2xl bg-[#0D0F1A]/80 border border-[#00F0FF]/40 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-xs md:text-sm font-black font-anime text-[#00F0FF] hover:text-white transition-colors hover-cyber-glitch cursor-pointer"
          >
            <span className="text-xl">{isAr ? '→' : '←'}</span>
            <span>{isAr ? 'العودة للرئيسية // COCKPIT EXIT' : 'RETURN TO BASE // COCKPIT EXIT'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 border border-gray-700 text-[10px] font-mono text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-hud-blink" />
              <span>SYS.SYNC: 99.8%</span>
              <span className="text-[#00F0FF]">FREQ: 142.80 MHz</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-[#141622] border border-[#FFE600] text-xs font-black text-[#FFE600] font-anime neon-border-yellow flex items-center gap-1.5">
              <span>⚡</span>
              <span>{currentUser ? `${athleteName} // ${athleteRank}` : (isAr ? 'وضع الضيف // GUEST' : 'GUEST // RECRUIT')}</span>
            </div>

            {/* Profile Action Buttons: Edit Profile, Sign In / Sign Out */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setEditName(currentUser.name);
                    setEditSpecialization(currentUser.specialization);
                    setEditAvatar(currentUser.avatar);
                    setEditSuccess(false);
                    setIsEditingProfile(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/60 hover:border-[#00F0FF] text-[#00F0FF] hover:text-white text-xs font-anime font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  title={isAr ? 'تعديل الملف الرياضي' : 'Edit Profile'}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تعديل' : 'Edit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    authService.logout();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 hover:border-red-500 text-red-300 hover:text-white text-xs font-anime font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                  title={isAr ? 'تسجيل الخروج' : 'Sign Out'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isAr ? 'خروج' : 'Sign Out'}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  if (onOpenAuth) onOpenAuth();
                  else window.dispatchEvent(new CustomEvent('yard300_open_auth'));
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#00F0FF] hover:from-emerald-400 hover:to-[#00F0FF] text-black text-xs font-anime font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Register'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Guest Mode Alert Banner */}
        {!currentUser && (
          <div className="mb-8 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-[#00F0FF]/15 via-emerald-500/10 to-[#A855F7]/15 border-2 border-[#00F0FF]/50 shadow-[0_0_25px_rgba(0,240,255,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-3.5 text-center sm:text-right">
              <div className="w-12 h-12 rounded-2xl bg-black/60 border-2 border-[#00F0FF] flex items-center justify-center shrink-0 text-2xl shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                🥋
              </div>
              <div>
                <h4 className="text-sm md:text-base font-black font-anime text-white flex items-center gap-2 justify-center sm:justify-start">
                  <span>{isAr ? 'أنت تتصفح حالياً كضيف (Guest Mode)' : 'Browsing in Athlete Guest Mode'}</span>
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                </h4>
                <p className="text-xs text-gray-300 font-bold mt-0.5">
                  {isAr 
                    ? 'سجل دخولك أو أنشئ ملفك الرياضي الخاص لتخصيص اسمك، حفظ سلاسل التدريب القتالية، وربط نقاط الهالة!' 
                    : 'Sign in or create your personal athlete profile to customize your name, save combat streaks, and claim rank XP!'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                if (onOpenAuth) onOpenAuth();
                else window.dispatchEvent(new CustomEvent('yard300_open_auth'));
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#00F0FF] hover:from-emerald-400 hover:to-[#00F0FF] text-black font-black font-anime text-xs shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              {isAr ? 'تسجيل الدخول / إنشاء حساب ←' : 'Sign In / Register Profile →'}
            </button>
          </div>
        )}

        {/* Hero Athlete Cockpit HUD Card */}
        <div className="bg-[#10121C]/90 rounded-3xl p-8 md:p-10 border-2 border-[#A855F7] neon-border-purple mb-12 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl relative overflow-hidden group">
          {/* Tactical Mecha Corner Brackets */}
          <div className="hud-corner-bracket hud-corner-bracket-tl !w-5 !h-5 !border-t-2 !border-l-2 !border-[#00F0FF]" />
          <div className="hud-corner-bracket hud-corner-bracket-tr !w-5 !h-5 !border-t-2 !border-r-2 !border-[#00F0FF]" />
          <div className="hud-corner-bracket hud-corner-bracket-bl !w-5 !h-5 !border-b-2 !border-l-2 !border-[#00F0FF]" />
          <div className="hud-corner-bracket hud-corner-bracket-br !w-5 !h-5 !border-b-2 !border-r-2 !border-[#00F0FF]" />

          {/* CRT Scanline */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF]/30 to-transparent pointer-events-none animate-scanline" />

          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right relative z-10">
            {/* Dynamic CSS Aura Field surrounding the Athlete Avatar with HUD Targeting Frame */}
            <div className="relative group/avatar cursor-crosshair">
              {/* Outer Pulsing Glow Aura */}
              <div 
                className="absolute -inset-3 rounded-3xl blur-xl opacity-75 animate-aura-hue pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(0,240,255,0.8) 0%, rgba(255,0,122,0.8) 50%, rgba(255,230,0,0.6) 100%)'
                }}
              ></div>

              {/* Plasma Morphing Energy Shield */}
              <div 
                className="absolute -inset-2 rounded-2xl pointer-events-none animate-aura-plasma opacity-85"
                style={{
                  background: 'linear-gradient(45deg, #00F0FF, #A855F7, #FFE600)',
                  filter: 'blur(4px)'
                }}
              ></div>

              {/* Inner Avatar Container with Targeting Reticles */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-[#00F0FF] neon-border-cyan bg-[#0A0B10] z-10 hover-card-glitch">
                {/* HUD Crosshairs Overlay */}
                <div className="absolute top-2 left-2 text-[8px] font-mono text-[#00F0FF] font-black z-20 pointer-events-none">[+]</div>
                <div className="absolute top-2 right-2 text-[8px] font-mono text-[#00F0FF] font-black z-20 pointer-events-none">[+]</div>
                <div className="absolute bottom-6 left-2 text-[8px] font-mono text-[#00F0FF] font-black z-20 pointer-events-none">TARGET_LOCK</div>

                <img loading="lazy" decoding="async" 
                  src={profileAvatar} 
                  alt="Champion Athlete Avatar" 
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" 
                />
                <div className="absolute bottom-0 inset-x-0 bg-[#A855F7] text-white text-[10px] font-black text-center py-0.5 uppercase tracking-widest font-anime shadow-[0_0_10px_#A855F7]">
                  {athleteRank}
                </div>

                {/* Energy Overlay Filter */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#A855F7]/20 via-transparent to-[#00F0FF]/20 pointer-events-none animate-aura-hue"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-[10px] font-mono text-[#00F0FF] font-bold">
                  [PILOT ID: {currentUser ? currentUser.id.slice(-6).toUpperCase() : 'GUEST'}]
                </span>
                <h1 className="text-3xl md:text-4xl font-black font-anime text-white hover-cyber-glitch inline-block cursor-default">
                  {athleteName}
                </h1>
                <span className="px-3 py-1 rounded-lg bg-[#A855F7] text-white text-xs font-black font-anime neon-border-purple">
                  LVL {athleteLevel} {athleteLevel >= 90 ? 'OVERDRIVE' : athleteLevel >= 40 ? 'WARRIOR' : 'RECRUIT'}
                </span>
              </div>
              <p className="text-base font-bold text-[#00F0FF] flex items-center justify-center md:justify-start gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                <span>{isAr ? `تخصص: ${athleteSpec}` : `Spec: ${athleteSpec}`}</span>
              </p>
              <p className="text-xs text-gray-400 font-bold font-mono">
                {isAr 
                  ? `عضوية أبطال أورا المعتمدة // تاريخ التسجيل: ${currentUser?.memberSince || '2026'}` 
                  : `Aura Champion Pass Certified // Member Since: ${currentUser?.memberSince || '2026'} // EVA-CORE ACTIVE`}
              </p>

              {/* Creator Club Ownership Badge & Owner Command Center (Visible only when appropriate) */}
              <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
                {onNavigateToClub && (
                  <button
                    onClick={onNavigateToClub}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#A855F7]/20 via-[#E50914]/20 to-[#FFE600]/20 border border-[#A855F7]/60 text-white hover:border-[#A855F7] text-xs font-black font-anime shadow-[0_0_15px_rgba(255,0,122,0.3)] hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>⚔️</span>
                    <span>TITAN APEX STRIKE DOJO (LEVEL 3 CLUB)</span>
                    <span className="text-[10px] bg-[#A855F7] text-white px-1.5 py-0.2 rounded font-mono">EXPLORE</span>
                  </button>
                )}

                {athleteRole === 'owner' && (
                  <a
                    href="#owner"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = 'owner';
                      window.location.reload();
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E50914]/20 border border-[#E50914]/60 text-white hover:border-[#E50914] text-xs font-black font-anime shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>👑</span>
                    <span>{isAr ? 'لوحة تحكم المالك' : 'OWNER DASHBOARD'}</span>
                    <span className="text-[10px] bg-[#E50914] text-white px-1.5 py-0.2 rounded font-mono">PORTAL</span>
                  </a>
                )}
              </div>
              
              {/* Mecha Reactor Power Gauge Bar */}
              <div className="pt-2 max-w-md">
                <div className="flex justify-between text-xs font-bold mb-1 font-mono">
                  <span className="text-[#FFE600] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#FFE600] rounded-full animate-hud-blink" />
                    {isAr ? 'مستوى شحن الهالة الحيوية // REACTOR CHARGE' : 'AURA REACTOR KINETIC CHARGE'}
                  </span>
                  <span className="text-[#00F0FF] font-anime">{avgAura}% / 100% [MAX]</span>
                </div>
                <div className="w-full h-4 bg-[#0A0B12] rounded-lg overflow-hidden p-[2px] border-2 border-[#00F0FF]/60 shadow-[0_0_15px_rgba(0,240,255,0.3)] relative">
                  {/* Gauge ticks */}
                  <div className="absolute inset-0 flex justify-between px-2 pointer-events-none z-10">
                    <span className="w-px h-full bg-white/20" />
                    <span className="w-px h-full bg-white/20" />
                    <span className="w-px h-full bg-white/20" />
                    <span className="w-px h-full bg-white/20" />
                  </div>
                  <div 
                    className="h-full bg-gradient-to-r from-[#A855F7] via-[#7000FF] to-[#00F0FF] rounded-md transition-all duration-1000 shadow-[0_0_15px_#00F0FF] relative" 
                    style={{ width: `${avgAura}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 w-full md:w-auto relative z-10">
            {/* Open Aura Visualizer Button */}
            {onOpenAuraVisualizer && (
              <button 
                onClick={onOpenAuraVisualizer}
                className="flex-1 md:flex-none px-6 py-3.5 bg-[#141622] hover:bg-[#1E1735] border-2 border-[#00F0FF] neon-border-cyan text-[#00F0FF] hover:text-white font-black text-sm font-anime rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 hover-cyber-glitch cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#FFE600] animate-spin" style={{ animationDuration: '4s' }} />
                <span>{isAr ? 'تخصيص الهالة والأفتار' : 'Customize Aura & Avatar'}</span>
              </button>
            )}

            {/* Share My Aura & Direct Copy Link Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="py-3 px-3 bg-[#181A2A] hover:bg-[#22253B] border border-[#A855F7] neon-border-purple text-[#A855F7] hover:text-white font-black text-xs font-anime rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover-cyber-glitch active:scale-95"
                title={isAr ? 'مشاركة بطاقة الهالة الرقمية' : 'Share My Aura Passport'}
              >
                <Share2 className="w-3.5 h-3.5 shrink-0" />
                <span>{isAr ? 'مشاركة الهالة' : 'Share My Aura'}</span>
              </button>

              <button
                type="button"
                onClick={handleDirectCopyLink}
                className={`py-3 px-3 border font-black text-xs font-anime rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover-cyber-glitch active:scale-95 ${
                  directCopied
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_#10B981]'
                    : 'bg-[#181A2A] hover:bg-[#22253B] border-[#00F0FF] neon-border-cyan text-[#00F0FF] hover:text-white'
                }`}
                title={isAr ? 'نسخ رابط الهالة الفريد' : 'Copy Shareable Link'}
              >
                {directCopied ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>{directCopied ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
              </button>
            </div>

            <button 
              onClick={() => setShowLogModal(true)}
              className="flex-1 md:flex-none px-6 py-4 bg-[#10B981] hover:bg-[#059669] text-black font-black text-sm font-anime rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{isAr ? 'تسجيل جولة تدريبية جديدة' : 'Log New Combat Session'}</span>
              <span className="text-lg">⚡</span>
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => setTimeframe('week')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black font-anime transition-all hover-cyber-glitch ${
                  timeframe === 'week' 
                    ? 'bg-[#00F0FF] text-[#0A0B10] neon-border-cyan' 
                    : 'bg-[#181A28] text-gray-400 border border-gray-700 hover:text-white'
                }`}
              >
                {isAr ? 'عرض أسبوعي' : 'Weekly'}
              </button>
              <button 
                onClick={() => setTimeframe('month')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black font-anime transition-all hover-cyber-glitch ${
                  timeframe === 'month' 
                    ? 'bg-[#00F0FF] text-[#0A0B10] neon-border-cyan' 
                    : 'bg-[#181A28] text-gray-400 border border-gray-700 hover:text-white'
                }`}
              >
                {isAr ? 'عرض شهري' : 'Monthly'}
              </button>
            </div>
          </div>

        </div>

        {/* KPI Stats Cards Styled as Mecha Cockpit Sensor Telemetry Pods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Pod 1: Calories */}
          <div className="bg-[#10121C]/90 p-6 rounded-2xl border-2 border-[#A855F7] neon-border-purple hover-card-glitch relative overflow-hidden group">
            <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-tr !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-bl !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-br !border-[#A855F7]" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono font-bold text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-hud-blink" />
                {isAr ? '🔥 السعرات المحروقة [POD-01]' : '🔥 BURN SENSOR [POD-01]'}
              </span>
              <span className="text-2xl group-hover:scale-125 transition-transform">⚡</span>
            </div>
            <span className="text-3xl font-black font-anime text-[#A855F7] neon-text-purple block mb-1">
              {totalCalories.toLocaleString()} <span className="text-xs text-gray-300 font-mono">kcal</span>
            </span>
            <span className="text-[11px] font-bold text-[#00F0FF] font-mono">{isAr ? '+18% مقارنة بالأسبوع الماضي' : '+18% vs Last Week // OVERLOAD'}</span>
          </div>

          {/* Pod 2: Intensive Training */}
          <div className="bg-[#10121C]/90 p-6 rounded-2xl border-2 border-[#00F0FF] neon-border-cyan hover-card-glitch relative overflow-hidden group">
            <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#00F0FF]" />
            <div className="hud-corner-bracket hud-corner-bracket-tr !border-[#00F0FF]" />
            <div className="hud-corner-bracket hud-corner-bracket-bl !border-[#00F0FF]" />
            <div className="hud-corner-bracket hud-corner-bracket-br !border-[#00F0FF]" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono font-bold text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-hud-blink" />
                {isAr ? '⏱️ ساعات التدريب [POD-02]' : '⏱️ CHRONO LOAD [POD-02]'}
              </span>
              <span className="text-2xl group-hover:scale-125 transition-transform">🥊</span>
            </div>
            <span className="text-3xl font-black font-anime text-[#00F0FF] neon-text-cyan block mb-1">
              {(totalMinutes / 60).toFixed(1)} <span className="text-xs text-gray-300 font-mono">{isAr ? 'ساعة' : 'hrs'}</span>
            </span>
            <span className="text-[11px] font-bold text-[#FFE600] font-mono">{totalMinutes} {isAr ? 'دقيقة تركيز شديد' : 'mins extreme combat focus'}</span>
          </div>

          {/* Pod 3: YARDX Tokens */}
          <div className="bg-[#10121C]/90 p-6 rounded-2xl border-2 border-[#FFE600] neon-border-yellow hover-card-glitch relative overflow-hidden group">
            <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#FFE600]" />
            <div className="hud-corner-bracket hud-corner-bracket-tr !border-[#FFE600]" />
            <div className="hud-corner-bracket hud-corner-bracket-bl !border-[#FFE600]" />
            <div className="hud-corner-bracket hud-corner-bracket-br !border-[#FFE600]" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono font-bold text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600] animate-hud-blink" />
                {isAr ? '🪙 مكافآت عملة YARDX [POD-03]' : '🪙 YARDX PROTOCOL [POD-03]'}
              </span>
              <span className="text-2xl group-hover:scale-125 transition-transform">🏆</span>
            </div>
            <span className="text-3xl font-black font-anime text-[#FFE600] neon-text-yellow block mb-1">
              1,250 <span className="text-xs text-gray-300 font-mono">YARDX</span>
            </span>
            <span className="text-[11px] font-bold text-[#A855F7] font-mono">{isAr ? 'قابل للاستبدال بمنتجات العتاد!' : 'Redeemable for Combat Gear!'}</span>
          </div>

          {/* Pod 4: Aura Score */}
          <div className="bg-[#10121C]/90 p-6 rounded-2xl border-2 border-[#A855F7] neon-border-purple hover-card-glitch relative overflow-hidden group">
            <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-tr !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-bl !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-br !border-[#A855F7]" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono font-bold text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-hud-blink" />
                {isAr ? '🔮 مؤشر الهالة العام [POD-04]' : '🔮 AURA TELEMETRY [POD-04]'}
              </span>
              <span className="text-2xl group-hover:scale-125 transition-transform">✨</span>
            </div>
            <span className="text-3xl font-black font-anime text-white block mb-1">
              {avgAura} / 100
            </span>
            <span className="text-[11px] font-bold text-[#00F0FF] font-mono">{isAr ? 'جاهزية كاملة للنزول للحلبة' : 'Combat Ready // S-RANK ONLINE'}</span>
          </div>

        </div>

        {/* Share My Aura Banner Styled as an Encrypted Mecha Data Transmission Deck */}
        <div className="bg-gradient-to-r from-[#10121E] via-[#171A2C] to-[#10121E] rounded-3xl p-6 md:p-8 border-2 border-[#00F0FF] neon-border-cyan mb-12 relative overflow-hidden">
          <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#00F0FF]" />
          <div className="hud-corner-bracket hud-corner-bracket-tr !border-[#00F0FF]" />
          <div className="hud-corner-bracket hud-corner-bracket-bl !border-[#00F0FF]" />
          <div className="hud-corner-bracket hud-corner-bracket-br !border-[#00F0FF]" />

          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#A855F7]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left rtl:lg:text-right flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161828] border border-[#FFE600] text-[#FFE600] text-xs font-black font-anime shadow-[0_0_15px_rgba(255,230,0,0.3)]">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                <span>{isAr ? 'جواز سفر الهالة الرقمي المعتمد // SHARE MY AURA HUD' : 'VERIFIED DIGITAL AURA PASSPORT // SHARE MY AURA HUD'}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black font-anime text-white hover-cyber-glitch inline-block cursor-default">
                {isAr ? 'شارك هالتك وإحصائياتك الرياضية مع أصدقائك ومنافسيك' : 'Broadcast Your Live Aura & Athletic Statistics'}
              </h3>
              <p className="text-xs text-gray-300 font-bold max-w-2xl font-mono">
                {isAr
                  ? `قم بإنشاء رابط فريد مشفر يحتوي على رتبتك (${currentAuraData.tier})، أقصى قوة (${peakPower.toLocaleString()} AU)، ستريك القتال (${streakData.currentStreak || 14} يوم)، ومستوى شحن هالتك (${avgAura}%).`
                  : `Generate a unique encrypted passport link embedding your live S-Rank tier (${currentAuraData.tier}), peak power (${peakPower.toLocaleString()} AU), streak (${streakData.currentStreak || 14}D), and aura charge (${avgAura}%).`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              {/* Copy Link Button */}
              <button
                type="button"
                onClick={handleDirectCopyLink}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-anime font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover-cyber-glitch active:scale-95 ${
                  directCopied
                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_#10B981]'
                    : 'bg-[#00F0FF] hover:bg-[#FFE600] text-black shadow-[0_0_20px_#00F0FF]'
                }`}
              >
                {directCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{directCopied ? (isAr ? 'تم نسخ الرابط الفريد بنجاح ✓' : 'Link Copied to Clipboard ✓') : (isAr ? 'نسخ الرابط // Copy Link' : 'Copy Link')}</span>
              </button>

              {/* Share My Aura Modal Trigger */}
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#2c084f] via-[#480d7a] to-[#10B981] hover:opacity-90 text-white font-anime font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(76,29,149,0.7)] hover-cyber-glitch active:scale-95 border border-[#6b21a8]"
              >
                <Share2 className="w-4 h-4" />
                <span>{isAr ? 'عرض بطاقة المشاركة ⚡' : 'Share My Aura ⚡'}</span>
              </button>
            </div>
          </div>

          {/* Quick URL Preview Input */}
          <div className="mt-4 pt-4 border-t border-gray-800/80 flex items-center gap-3 relative z-10">
            <Link2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
            <span className="text-[11px] font-mono text-gray-300 truncate select-all">
              {generateShareAuraUrl(currentAuraData)}
            </span>
          </div>
        </div>

        {/* SUBSCRIBER 24H STORIES & HIGHLIGHTS REEL */}
        <div className="mb-12 p-6 md:p-8 rounded-3xl bg-[#0F101A] border-2 border-[#A855F7]/40 shadow-[0_0_35px_rgba(255,0,122,0.15)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-[#A855F7] animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-[#A855F7] uppercase tracking-wider">
                  {isEs ? 'HISTORIAS Y TRANSMISIÓN DEL SUSCRIPTOR' : isFr ? 'STORIES 24H & DIFFUSION' : isAr ? 'ستوريات المشترك وبث التدريب 24H' : 'SUBSCRIBER 24H STORIES & BROADCAST'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#E50914] text-white text-[9px] font-black font-anime">LIVE</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black font-anime text-white">
                {isEs ? 'Tus Historias Diarias y Registros de Entrenamiento' : isFr ? 'Vos Stories d\'Entraînement 24H' : isAr ? 'قصصك اليومية وتحديات التدريب النشطة' : 'Your 24-Hour Stories & Workout Logs'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isEs 
                  ? 'Sube fotos o vídeos desde tu móvil o PC, comparte tus marcas e interactúa con otros suscriptores.' 
                  : isFr 
                  ? 'Téléversez des photos ou vidéos depuis mobile ou PC et partagez vos records.' 
                  : isAr
                  ? 'ارفع صور وفيديوهات مباشرة من جهازك (موبايل أو كمبيوتر)، شارك إنجازاتك وتفاعل مع المشتركين.'
                  : 'Upload photos or videos directly from mobile camera or PC, share drill milestones, and interact with fellow subscribers.'}
              </p>
            </div>

            <button
              onClick={() => setIsNewStoryModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#E50914] text-white font-black font-anime text-xs shadow-[0_0_20px_rgba(255,0,122,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Upload className="w-4 h-4 text-[#FFE600]" />
              <span>{isEs ? '+ Subir Historia (Móvil / PC)' : isFr ? '+ Publier Story (Mobile / PC)' : isAr ? '+ رفع ستوري (موبايل / كمبيوتر)' : '+ Upload Story (Mobile / PC)'}</span>
            </button>
          </div>

          {/* Stories Reel (Instagram Style) */}
          <div className="flex items-center gap-5 overflow-x-auto pb-4 scrollbar-thin">
            {/* New Story Add Ring */}
            <button
              onClick={() => setIsNewStoryModalOpen(true)}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
            >
              <div className="w-18 h-18 md:w-20 md:h-20 rounded-full p-1 bg-gradient-to-tr from-gray-700 to-gray-800 group-hover:from-[#A855F7] group-hover:to-[#FFE600] transition-all">
                <div className="w-full h-full rounded-full bg-[#141624] border-2 border-dashed border-gray-600 group-hover:border-[#FFE600] flex items-center justify-center text-white">
                  <PlusCircle className="w-6 h-6 text-[#FFE600] group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="text-[11px] font-black font-anime text-gray-300 group-hover:text-white max-w-[80px] text-center truncate">
                {isEs ? 'Subir' : isFr ? 'Ajouter' : isAr ? 'رفع جديد' : '+ Post Story'}
              </span>
            </button>

            {/* User Active Stories */}
            {userStories.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  soundFX.playButtonClick();
                  setActiveStoryViewer(st);
                }}
                className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
              >
                <div className="w-18 h-18 md:w-20 md:h-20 rounded-full p-1 bg-gradient-to-tr from-[#A855F7] via-[#E50914] to-[#FFE600] shadow-[0_0_15px_rgba(255,0,122,0.4)] group-hover:scale-105 transition-all animate-pulse">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-black relative">
                    {st.mediaType === 'video' || st.mediaUrl.startsWith('data:video') || st.mediaUrl.endsWith('.mp4') ? (
                      <video src={st.mediaUrl} className="w-full h-full object-cover" />
                    ) : (
                      <img 
                        src={st.mediaUrl} 
                        alt={st.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="text-xs">{st.clubLogo}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center max-w-[85px]">
                  <span className="block text-[11px] font-black font-anime text-white truncate">
                    {st.title.split(' ')[0]}
                  </span>
                  <span className="block text-[9px] text-[#FFE600] font-mono">
                    {st.badgeType}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MUTUAL SUBSCRIBER SQUAD & FRIENDS NETWORK */}
        <div className="mb-12 p-6 md:p-8 rounded-3xl bg-[#0F101A] border-2 border-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-[10px] font-mono font-bold text-[#00F0FF] uppercase tracking-wider">
                  {isEs ? 'RED DE AMIGOS Y SUSCRIPTORES' : isFr ? 'RÉSEAU D\'AMIS & ABONNÉS' : isAr ? 'شبكة أصدقاء المشتركين' : 'MUTUAL SUBSCRIBER FRIENDS NETWORK'}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black font-anime text-white">
                {isEs ? 'Conecta con Otros Atletas Suscriptores' : isFr ? 'Connectez-vous avec d\'autres Abonnés' : isAr ? 'إضافة وتواصل مع زملائك المشتركين' : 'Connect & Train with Fellow Subscribers'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isEs 
                  ? 'Añade amigos para compartir rachas, comentar historias y entrenar juntos.' 
                  : isFr 
                  ? 'Ajoutez des amis pour partager vos séries et encouragements.' 
                  : isAr
                  ? 'أضف أصدقاءك من المشتركين لتبادل التشجيع والتفاعل مع ستورياتهم اليومية.'
                  : 'Add fellow subscribers as squad friends to share streaks, comment on stories, and motivate each other.'}
              </p>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-[#141624] border border-[#00F0FF]/40 text-xs font-mono text-[#00F0FF]">
              <span>{isEs ? 'Amigos Conectados:' : isFr ? 'Amis Connectés:' : isAr ? 'الأصدقاء المضافون:' : 'Connected Friends:'} </span>
              <strong className="text-white font-bold">{connectedSubscribers.length}</strong>
            </div>
          </div>

          {/* Subscribers Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_AVAILABLE_ATHLETES.map((ath) => {
              const isConnected = connectedSubscribers.includes(ath.id);
              return (
                <div 
                  key={ath.id}
                  className={`p-4 rounded-2xl bg-[#141624] border transition-all flex items-center justify-between gap-4 ${
                    isConnected 
                      ? 'border-[#10B981]/60 bg-gradient-to-br from-[#141624] to-[#0A1A12] shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-700 shrink-0 relative">
                      <img 
                        src={ath.avatar} 
                        alt={ath.name} 
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                      {isConnected && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border border-black" />
                      )}
                    </div>
                    <div>
                      <span className="block text-sm font-black font-anime text-white">
                        {ath.name}
                      </span>
                      <span className="block text-[11px] text-[#FFE600] font-mono">
                        {ath.tier}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mt-0.5">
                        <span>⚡ {ath.streak}d streak</span>
                        <span>•</span>
                        <span className={ath.status === 'training' ? 'text-emerald-400' : 'text-gray-400'}>
                          {ath.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFriend(ath.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-black font-anime transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isConnected
                        ? 'bg-[#10B981]/20 border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/30'
                        : 'bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{isEs ? 'AMIGO ✓' : isFr ? 'AMI ✓' : isAr ? 'مضاف ✓' : 'FRIEND ✓'}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{isEs ? '+ AÑADIR' : isFr ? '+ AJOUTER' : isAr ? '+ إضافة' : '+ ADD'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Combat Streak & Aura Points Tracker Component */}
        <CombatStreak 
          currentLang={currentLang} 
          onNavigateToEngine={onNavigateToEngine}
          className="mb-8" 
        />

        {/* Daily Hydration Tracker Card */}
        <HydrationTracker currentLang={currentLang} className="mb-8" />

        {/* 7-Day Resting Heart Rate & Training Load Progression Chart Section */}
        <HeartRateLoadChart currentLang={currentLang} className="mb-12" />

        {/* Charts Grid: Mecha Tactical HUD Telemetry Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Area Chart: Power Level & Aura Score over time */}
          <div className="lg:col-span-8 bg-[#10121C]/90 p-6 md:p-8 rounded-3xl border-2 border-[#00F0FF] neon-border-cyan shadow-[0_10px_35px_rgba(0,0,0,0.9)] relative overflow-hidden group">
            {/* Corner Brackets */}
            <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#00F0FF]" />
            <div className="hud-corner-bracket hud-corner-bracket-tr !border-[#00F0FF]" />
            <div className="hud-corner-bracket hud-corner-bracket-bl !border-[#00F0FF]" />
            <div className="hud-corner-bracket hud-corner-bracket-br !border-[#00F0FF]" />

            {/* Top Telemetry Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-hud-blink" />
                  <span className="text-[10px] font-mono font-bold text-[#00F0FF] tracking-widest">[ OSCILLOSCOPE CH-A // 433.92 MHz ]</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black font-anime text-white flex items-center gap-2 hover-cyber-glitch inline-block cursor-default">
                  <span>⚡ {isAr ? 'مسار الطاقة وحماس البطل' : 'Power & Combat Intensity'}</span>
                </h3>
                <p className="text-xs text-gray-400 font-bold font-mono">{isAr ? 'تتبع تصاعد الطاقة الحركية ومؤشر الهالة خلال الجولات' : 'Kinetic power surges & aura score telemetry across combat sessions'}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold font-mono">
                <span className="flex items-center gap-1.5 text-[#A855F7]">
                  <span className="w-3 h-3 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7]"></span>
                  {isAr ? 'مستوى القوة' : 'Power Level'}
                </span>
                <span className="flex items-center gap-1.5 text-[#00F0FF]">
                  <span className="w-3 h-3 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]"></span>
                  {isAr ? 'مؤشر الهالة' : 'Aura Score'}
                </span>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="auraGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#25283D" vertical={false} />
                  <XAxis dataKey="day" stroke="#8E93B0" fontSize={12} tickLine={false} />
                  <YAxis stroke="#8E93B0" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#10121C', 
                      borderColor: '#00F0FF', 
                      borderRadius: '12px',
                      color: '#FFF',
                      boxShadow: '0 0 20px rgba(0,240,255,0.4)',
                      fontWeight: 'bold',
                      fontFamily: 'monospace'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="powerLevel" 
                    stroke="#A855F7" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#powerGradient)" 
                    name={isAr ? "مستوى القوة" : "Power Level"}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="auraScore" 
                    stroke="#00F0FF" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#auraGradient)" 
                    name={isAr ? "مؤشر الهالة" : "Aura Score"}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart: Champion Attributes (Mecha Combat Matrix HUD) */}
          <div className="lg:col-span-4 bg-[#10121C]/90 p-6 md:p-8 rounded-3xl border-2 border-[#A855F7] neon-border-purple shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex flex-col justify-between relative overflow-hidden group">
            <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-tr !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-bl !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-br !border-[#A855F7]" />

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-hud-blink" />
                <span className="text-[10px] font-mono font-bold text-[#A855F7] tracking-widest">[ HEX-RADAR MATRIX ]</span>
              </div>
              <h3 className="text-xl font-black font-anime text-white mb-1 flex items-center gap-2 hover-cyber-glitch inline-block cursor-default">
                <span>🎯 {isAr ? 'شجرة خصائص البطل' : 'Champion Attribute Tree'}</span>
              </h3>
              <p className="text-xs text-[#FFE600] font-bold mb-4 font-mono">{isAr ? 'توزع الخصائص البدنية والقتالية' : 'Pilot combat & physical attribute polygon'}</p>
            </div>

            <div className="h-[280px] w-full relative">
              {/* Radar center reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-48 h-48 rounded-full border border-dashed border-[#00F0FF] animate-reticle-spin" />
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={attributeData}>
                  <PolarGrid stroke="#2A2D45" />
                  <PolarAngleAxis dataKey="attribute" stroke="#D0D8ED" fontSize={10} tick={{ fill: '#00F0FF', fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#2A2D45" />
                  <Radar 
                    name={isAr ? "الخصائص البدنية" : "Attributes"} 
                    dataKey="score" 
                    stroke="#FFE600" 
                    fill="#A855F7" 
                    fillOpacity={0.65} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-[#151726] border border-[#FFE600]/40 text-center text-xs font-bold text-[#FFE600] font-mono shadow-[0_0_15px_rgba(255,230,0,0.2)]">
              🔥 {isAr ? 'أعلى ميزة: طاقة الهالة S-Rank (99/100)' : 'TOP TRAIT: S-RANK AURA POWER (99/100) // PEAK'}
            </div>
          </div>

        </div>

        {/* Bar Chart: Calories vs Workout Minutes with Mecha Diagnostics */}
        <div className="bg-[#10121C]/90 p-6 md:p-8 rounded-3xl border-2 border-[#FFE600] neon-border-yellow shadow-[0_10px_35px_rgba(0,0,0,0.9)] mb-12 relative overflow-hidden group">
          <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#FFE600]" />
          <div className="hud-corner-bracket hud-corner-bracket-tr !border-[#FFE600]" />
          <div className="hud-corner-bracket hud-corner-bracket-bl !border-[#FFE600]" />
          <div className="hud-corner-bracket hud-corner-bracket-br !border-[#FFE600]" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#FFE600] animate-hud-blink" />
                <span className="text-[10px] font-mono font-bold text-[#FFE600] tracking-widest">[ THERMAL DISPERSION & WORKLOAD TELEMETRY ]</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black font-anime text-white flex items-center gap-2 hover-cyber-glitch inline-block cursor-default">
                <span>🔥 {isAr ? 'حرق السعرات ودقائق التمرين المكثف' : 'Calorie Burn & Workout Minutes'}</span>
              </h3>
              <p className="text-xs text-gray-400 font-bold font-mono">{isAr ? 'مقارنة بين الجهد العضلي واستهلاك السعرات الحرارية' : 'Muscle output compared to caloric expenditure per session'}</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#25283D" vertical={false} />
                <XAxis dataKey="day" stroke="#8E93B0" fontSize={12} tickLine={false} />
                <YAxis stroke="#8E93B0" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#10121C', 
                    borderColor: '#FFE600', 
                    borderRadius: '12px',
                    color: '#FFF',
                    fontWeight: 'bold',
                    boxShadow: '0 0 15px rgba(255,230,0,0.4)',
                    fontFamily: 'monospace'
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }} />
                <Bar dataKey="calories" name={isAr ? "السعرات المحروقة (kcal)" : "Calories Burned (kcal)"} fill="#FFE600" radius={[6, 6, 0, 0]} />
                <Bar dataKey="workoutMinutes" name={isAr ? "دقائق التمرين (دقيقة)" : "Workout Minutes (min)"} fill="#A855F7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Champion Badges & Achievements with Mecha Pilot Feats */}
        <div>
          <h3 className={`text-2xl font-black font-anime text-white mb-6 ${isAr ? 'border-r-4 pr-4' : 'border-l-4 pl-4'} border-[#00F0FF] flex items-center gap-2`}>
            <span>{isAr ? 'وسامات وألقاب البطل المُنجزة 🏆' : 'Champion Badges & Feats 🏆'}</span>
            <span className="text-xs font-mono text-[#00F0FF]">[PILOT_ACCREDITATION]</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-2xl bg-[#10121C]/90 border-2 border-[#A855F7] neon-border-purple flex items-center gap-4 hover-card-glitch relative overflow-hidden group">
              <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#A855F7]" />
              <div className="hud-corner-bracket hud-corner-bracket-br !border-[#A855F7]" />
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7000FF] flex items-center justify-center text-3xl shadow-[0_0_15px_#A855F7] group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <div>
                <h4 className="font-black text-white font-anime text-sm hover-cyber-glitch">{isAr ? 'تجاوز 100%' : 'Beyond 100%'}</h4>
                <p className="text-xs text-[#00F0FF] font-bold font-mono">{isAr ? 'إتمام 10 جولات قاسية متتالية' : 'Completed 10 brutal rounds'}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#10121C]/90 border-2 border-[#00F0FF] neon-border-cyan flex items-center gap-4 hover-card-glitch relative overflow-hidden group">
              <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#00F0FF]" />
              <div className="hud-corner-bracket hud-corner-bracket-br !border-[#00F0FF]" />
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#7000FF] flex items-center justify-center text-3xl shadow-[0_0_15px_#00F0FF] group-hover:scale-110 transition-transform">
                🔥
              </div>
              <div>
                <h4 className="font-black text-white font-anime text-sm hover-cyber-glitch">{isAr ? 'حارق السعرات الخارق' : 'Calorie Inferno'}</h4>
                <p className="text-xs text-[#FFE600] font-bold font-mono">{isAr ? 'حرق أكثر من 1,000 kcal في يوم' : 'Burned 1,000+ kcal in 1 day'}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#10121C]/90 border-2 border-[#FFE600] neon-border-yellow flex items-center gap-4 hover-card-glitch relative overflow-hidden group">
              <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#FFE600]" />
              <div className="hud-corner-bracket hud-corner-bracket-br !border-[#FFE600]" />
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFE600] to-[#A855F7] flex items-center justify-center text-3xl shadow-[0_0_15px_#FFE600] group-hover:scale-110 transition-transform">
                🥋
              </div>
              <div>
                <h4 className="font-black text-white font-anime text-sm hover-cyber-glitch">{isAr ? 'سيد الملاكمة والبديهة' : 'Reflex Master'}</h4>
                <p className="text-xs text-[#A855F7] font-bold font-mono">{isAr ? 'استخدام نظارة VR 50 مرة' : '50 VR Combat Sessions'}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#10121C]/90 border-2 border-[#A855F7] neon-border-purple flex items-center gap-4 hover-card-glitch relative overflow-hidden group">
              <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#A855F7]" />
              <div className="hud-corner-bracket hud-corner-bracket-br !border-[#A855F7]" />
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7000FF] to-[#00F0FF] flex items-center justify-center text-3xl shadow-[0_0_15px_#7000FF] group-hover:scale-110 transition-transform">
                👑
              </div>
              <div>
                <h4 className="font-black text-white font-anime text-sm hover-cyber-glitch">{isAr ? 'أسطورة أورا S-Rank' : 'S-Rank Aura Legend'}</h4>
                <p className="text-xs text-white font-bold font-mono">{isAr ? 'الصدارة على مستوى المنطقة' : 'Rank #1 Regional Leader'}</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modal to Log New Workout: Mecha Diagnostic Console */}
      {showLogModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`bg-[#0E101C] border-2 border-[#A855F7] neon-border-purple rounded-3xl p-8 max-w-lg w-full shadow-[0_0_60px_#A855F7] relative ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="hud-corner-bracket hud-corner-bracket-tl !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-tr !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-bl !border-[#A855F7]" />
            <div className="hud-corner-bracket hud-corner-bracket-br !border-[#A855F7]" />
            
            <div className="flex justify-between items-center mb-6 border-b border-[#A855F7]/40 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#00F0FF] block">[ PILOT LOG ENTRY CONSOLE ]</span>
                <h3 className="text-2xl font-black font-anime text-white">{isAr ? 'تسجيل جولة تدريبية جديدة ⚡' : 'Log New Workout Session ⚡'}</h3>
              </div>
              <button onClick={() => setShowLogModal(false)} className="text-[#A855F7] text-xl font-bold hover-cyber-glitch p-1 cursor-pointer">✖</button>
            </div>

            <form onSubmit={handleAddWorkout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-mono text-gray-300 mb-1">{isAr ? 'اسم الجولة / اليوم:' : 'Session / Day Name:'}</label>
                <input 
                  type="text" 
                  value={newDay} 
                  onChange={(e) => setNewDay(e.target.value)}
                  className="w-full bg-[#151726] border border-gray-700 rounded-xl py-3 px-4 text-white font-bold outline-none focus:border-[#00F0FF] focus:shadow-[0_0_15px_#00F0FF]"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-mono text-gray-300 mb-1">{isAr ? 'السعرات المحروقة (kcal):' : 'Calories Burned (kcal):'}</label>
                  <input 
                    type="number" 
                    value={newCalories} 
                    onChange={(e) => setNewCalories(Number(e.target.value))}
                    className="w-full bg-[#151726] border border-gray-700 rounded-xl py-3 px-4 text-white font-bold outline-none focus:border-[#00F0FF] focus:shadow-[0_0_15px_#00F0FF]"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono text-gray-300 mb-1">{isAr ? 'دقائق التمرين (min):' : 'Workout Minutes (min):'}</label>
                  <input 
                    type="number" 
                    value={newMinutes} 
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="w-full bg-[#151726] border border-gray-700 rounded-xl py-3 px-4 text-white font-bold outline-none focus:border-[#00F0FF] focus:shadow-[0_0_15px_#00F0FF]"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono text-gray-300 mb-1">{isAr ? 'طاقة الهالة الناتجة (Power Level):' : 'Aura Power Level Output:'}</label>
                <input 
                  type="number" 
                  value={newPower} 
                  onChange={(e) => setNewPower(Number(e.target.value))}
                  className="w-full bg-[#151726] border border-gray-700 rounded-xl py-3 px-4 text-white font-bold outline-none focus:border-[#00F0FF] focus:shadow-[0_0_15px_#00F0FF]"
                  required 
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-6 bg-gradient-to-r from-[#2c084f] via-[#480d7a] to-[#10B981] text-white font-black text-base font-anime rounded-xl shadow-[0_0_25px_rgba(76,29,149,0.7)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all hover-cyber-glitch cursor-pointer active:scale-95 border border-[#6b21a8]"
              >
                {isAr ? 'تأكيد وإضافة للرسم البياني ⚡' : 'Confirm & Add to Telemetry ⚡'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Shared Aura Modal */}
      {showShareModal && (
        <SharedAuraModal
          data={currentAuraData}
          onClose={() => setShowShareModal(false)}
          currentLang={currentLang}
          onNavigateToEngine={onNavigateToEngine}
        />
      )}

      {/* NEW STORY MODAL: DEVICE UPLOAD (MOBILE CAMERA / PC FILES) */}
      {isNewStoryModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F101A] border-2 border-[#A855F7] rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(255,0,122,0.5)] relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
              <div>
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider block">
                  [ 24H COMMUNITY SQUAD BROADCAST ]
                </span>
                <h3 className="text-xl md:text-2xl font-black font-anime text-white">
                  {isEs ? 'PUBLICAR HISTORIA (24H)' : isFr ? 'PUBLIER UNE STORY (24H)' : isAr ? 'نشر ستوري رياضي جديد (24 ساعة)' : 'POST 24H ATHLETE STORY'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewStoryModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-full bg-gray-800/80 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishStory} className="space-y-4">
              {/* Device Upload Field */}
              <div className="space-y-2">
                <label className="block text-xs font-black font-anime text-[#FFE600] uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isEs ? 'SUBIR DESDE MÓVIL O PC' : isFr ? 'TÉLÉVERSER DEPUIS SMARTPHONE OU PC' : isAr ? 'رفع ملف أو فيديو من الهاتف / الكمبيوتر' : 'UPLOAD FROM MOBILE / PC'}</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">JPG, PNG, MP4, WEBM</span>
                </label>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={storyFileInputRef}
                  accept="image/*,video/*"
                  onChange={handleStoryFileUpload}
                  className="hidden"
                />

                {!uploadedStoryMedia ? (
                  <div 
                    onClick={() => storyFileInputRef.current?.click()}
                    className="p-6 rounded-2xl border-2 border-dashed border-[#A855F7]/50 bg-black/50 hover:border-[#A855F7] hover:bg-black/80 transition-all cursor-pointer text-center space-y-3"
                  >
                    <div className="w-14 h-14 rounded-2xl mx-auto bg-gradient-to-tr from-[#A855F7]/30 to-[#FFE600]/30 border border-[#A855F7]/50 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,0,122,0.3)]">
                      <Upload className="w-7 h-7 text-[#FFE600] animate-bounce" />
                    </div>
                    <div>
                      <span className="block text-sm font-black font-anime text-white">
                        {isEs ? 'Toca para Elegir Archivo o Tomar Foto / Vídeo' : isFr ? 'Touchez pour Choisir ou Filmer' : isAr ? 'انقر لاختيار ملف أو التقاط فيديو / صورة' : 'Tap to Choose File or Capture Video / Photo'}
                      </span>
                      <span className="block text-xs text-gray-400 mt-1">
                        {isEs ? 'Compatible con cámara de móvil o archivos de ordenador' : isFr ? 'Compatible caméra smartphone ou fichiers PC' : isAr ? 'متوافق مع كاميرا الهاتف وملفات الكمبيوتر' : 'Compatible with smartphone camera roll & computer storage'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <span className="px-2.5 py-1 rounded-full bg-[#141624] border border-gray-700 text-[10px] font-mono text-[#00F0FF] flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> Image
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#141624] border border-gray-700 text-[10px] font-mono text-[#FFE600] flex items-center gap-1">
                        <VideoIcon className="w-3 h-3" /> Video (MP4)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-black/80 border-2 border-[#10B981] relative overflow-hidden space-y-2">
                    <div className="h-44 rounded-xl overflow-hidden bg-black relative flex items-center justify-center">
                      {uploadedStoryType === 'video' || uploadedStoryMedia.startsWith('data:video') ? (
                        <video 
                          src={uploadedStoryMedia} 
                          controls 
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src={uploadedStoryMedia} 
                          alt="Story Preview" 
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        {uploadedStoryType === 'video' ? 'VIDEO READY' : 'PHOTO READY'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono px-1">
                      <span className="text-gray-300 truncate max-w-[220px]">
                        📁 {uploadedStoryName || 'Device media uploaded'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedStoryMedia('');
                          setUploadedStoryName('');
                          storyFileInputRef.current?.click();
                        }}
                        className="text-[#00F0FF] hover:underline font-anime font-black text-xs cursor-pointer"
                      >
                        {isEs ? 'Cambiar archivo' : isFr ? 'Changer' : isAr ? 'تغيير الملف' : 'Change File'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                  {isEs ? 'Título de la Historia' : isFr ? 'Titre de la Story' : isAr ? 'عنوان الستوري / التمرين' : 'Story Title / Drill Name'}
                </label>
                <input 
                  type="text" 
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-gray-700 text-white font-anime text-sm focus:border-[#A855F7] outline-none"
                  placeholder="e.g. Dawn 500 Heavy Bag Combos 🥊"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                  {isEs ? 'Descripción y Notas' : isFr ? 'Description et Notes' : isAr ? 'ملاحظات ووصف التمرين' : 'Caption / Workout Notes'}
                </label>
                <textarea 
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs focus:border-[#A855F7] outline-none"
                  placeholder="e.g. 5 rounds sparring + cryo recovery. Squad streak active!"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                    {isEs ? 'Categoría' : isFr ? 'Catégorie' : isAr ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={storyBadge}
                    onChange={(e) => setStoryBadge(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs font-anime outline-none"
                  >
                    <option value="DRILL">DRILL (Training)</option>
                    <option value="SPARRING">SPARRING (Combat)</option>
                    <option value="RECOVERY">RECOVERY (Sleep/Cryo)</option>
                    <option value="GAUNTLET">GAUNTLET (Challenge)</option>
                    <option value="STREAK">STREAK (Milestone)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                    {isEs ? 'Intensidad' : isFr ? 'Intensité' : isAr ? 'الشدة' : 'Intensity'}
                  </label>
                  <select
                    value={storyIntensity}
                    onChange={(e) => setStoryIntensity(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs font-anime outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MAX OVERDRIVE">MAX OVERDRIVE ⚡</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                    {isEs ? 'Duración (min)' : isFr ? 'Durée (min)' : isAr ? 'المدة (دقيقة)' : 'Duration (min)'}
                  </label>
                  <input 
                    type="number" 
                    value={storyDuration}
                    onChange={(e) => setStoryDuration(Number(e.target.value))}
                    min={5}
                    max={180}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                    {isEs ? 'Calorías (kcal)' : isFr ? 'Calories (kcal)' : isAr ? 'السعرات (kcal)' : 'Calories (kcal)'}
                  </label>
                  <input 
                    type="number" 
                    value={storyCalories}
                    onChange={(e) => setStoryCalories(Number(e.target.value))}
                    min={50}
                    max={2000}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewStoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-anime text-xs cursor-pointer"
                >
                  {isEs ? 'Cancelar' : isFr ? 'Annuler' : isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#E50914] text-white font-black font-anime text-xs shadow-[0_0_20px_rgba(255,0,122,0.6)] cursor-pointer"
                >
                  {isEs ? 'Publicar Historia (24h) ⚡' : isFr ? 'Diffuser la Story (24h) ⚡' : isAr ? 'نشر الستوري (24 ساعة) ⚡' : 'Broadcast Story (24h) ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN 24H STORY VIEWER WITH REACTION & COMMENTS */}
      {activeStoryViewer && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveStoryViewer(null);
          }}
          className="fixed inset-0 z-[140] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 touch-none animate-fadeIn"
        >
          <div className="relative w-full max-w-[390px] h-[90dvh] sm:h-[86vh] max-h-[760px] rounded-3xl bg-[#07080E] border-2 border-gray-800 overflow-hidden flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.9)] mx-auto my-auto">
            
            {/* Story Background Media - Perfectly contained for mobile */}
            <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center p-0">
              {/* Ambient blurred backdrop so portrait/landscape media looks seamless */}
              <img 
                src={activeStoryViewer.mediaUrl} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none" 
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              {activeStoryViewer.mediaType === 'video' || activeStoryViewer.mediaUrl.startsWith('data:video') || activeStoryViewer.mediaUrl.endsWith('.mp4') ? (
                <video 
                  src={activeStoryViewer.mediaUrl} 
                  autoPlay
                  loop
                  playsInline
                  controls={false}
                  className="relative z-10 max-w-full max-h-full object-contain pointer-events-none"
                />
              ) : (
                <img 
                  src={activeStoryViewer.mediaUrl} 
                  alt={activeStoryViewer.title} 
                  className="relative z-10 max-w-full max-h-full object-contain pointer-events-none select-none"
                  onError={handleImageError}
                />
              )}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07080E] via-transparent to-[#07080E]/80 pointer-events-none"></div>
            </div>

            {/* Top Bar with Timer Progress */}
            <div className="relative z-20 p-3 sm:p-4 space-y-2.5">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#A855F7] to-[#FFE600] transition-all duration-100 ease-linear"
                  style={{ width: `${storyProgress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-black/70 border border-white/40 flex items-center justify-center text-base shrink-0">
                    {activeStoryViewer.clubLogo || '👑'}
                  </div>
                  <div>
                    <span className="block text-xs font-black font-anime text-white">
                      {activeStoryViewer.authorName}
                    </span>
                    <span className="block text-[10px] text-gray-300 font-mono">
                      {activeStoryViewer.clubName} • 24h Story
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStoryViewer(null)}
                  className="p-1.5 rounded-full bg-black/70 text-white hover:text-gray-300 cursor-pointer hover:bg-black/90 transition-colors"
                  aria-label="Close story"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bottom Content, Reactions & Comments */}
            <div className="relative z-20 p-3 sm:p-5 space-y-2.5 bg-gradient-to-t from-[#07080E] via-[#07080E]/95 to-transparent">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E50914] text-white text-[10px] font-black font-anime">
                    {activeStoryViewer.badgeType}
                  </span>
                  {activeStoryViewer.durationMinutes && (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px] font-mono">
                      ⏱️ {activeStoryViewer.durationMinutes} min
                    </span>
                  )}
                  {activeStoryViewer.burnCalories && (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px] font-mono">
                      🔥 {activeStoryViewer.burnCalories} kcal
                    </span>
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-black font-anime text-white leading-tight">
                  {activeStoryViewer.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed max-h-16 overflow-y-auto">
                  {activeStoryViewer.caption}
                </p>
              </div>

              {/* Interactive Reactions Bar */}
              <div className="flex items-center justify-between gap-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleReactToViewerStory('fire')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-[#E50914]/30 border border-gray-700 hover:border-[#E50914] text-sm hover:scale-110 transition-all cursor-pointer"
                    title="Fire"
                  >
                    🔥 <span className="text-[10px] font-mono">{activeStoryViewer.reactions.fire}</span>
                  </button>
                  <button
                    onClick={() => handleReactToViewerStory('lightning')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-[#FFE600]/30 border border-gray-700 hover:border-[#FFE600] text-sm hover:scale-110 transition-all cursor-pointer"
                    title="Volt"
                  >
                    ⚡ <span className="text-[10px] font-mono">{activeStoryViewer.reactions.lightning}</span>
                  </button>
                  <button
                    onClick={() => handleReactToViewerStory('muscle')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-emerald-600/30 border border-gray-700 hover:border-emerald-500 text-sm hover:scale-110 transition-all cursor-pointer"
                    title="Strength"
                  >
                    💪 <span className="text-[10px] font-mono">{activeStoryViewer.reactions.muscle}</span>
                  </button>
                  <button
                    onClick={() => handleReactToViewerStory('boxing')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-[#00F0FF]/30 border border-gray-700 hover:border-[#00F0FF] text-sm hover:scale-110 transition-all cursor-pointer"
                    title="Strike"
                  >
                    🥊 <span className="text-[10px] font-mono">{activeStoryViewer.reactions.boxing}</span>
                  </button>
                  <button
                    onClick={() => handleReactToViewerStory('crown')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-purple-600/30 border border-gray-700 hover:border-purple-500 text-sm hover:scale-110 transition-all cursor-pointer"
                    title="Crown"
                  >
                    👑 <span className="text-[10px] font-mono">{activeStoryViewer.reactions.crown || 0}</span>
                  </button>
                </div>
              </div>

              {/* Real-time Comments List */}
              <div className="pt-2 border-t border-gray-800/80 space-y-2">
                {activeStoryViewer.comments && activeStoryViewer.comments.length > 0 && (
                  <div className="max-h-20 overflow-y-auto space-y-1.5 pr-1">
                    {activeStoryViewer.comments.map((comm) => (
                      <div key={comm.id} className="text-[11px] bg-black/50 rounded-lg p-1.5 border border-gray-800/60 flex items-start gap-1.5">
                        <span className="font-anime font-black text-[#FFE600] shrink-0">{comm.authorName}:</span>
                        <span className="text-gray-300 font-medium">{comm.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment input form */}
                <form onSubmit={handleAddStoryCommentSubmit} className="flex items-center gap-1.5">
                  <input 
                    type="text" 
                    value={storyCommentInput}
                    onChange={(e) => setStoryCommentInput(e.target.value)}
                    placeholder={isEs ? 'Escribe un comentario...' : isFr ? 'Écrire un commentaire...' : isAr ? 'أضف تعليقاً على الستوري...' : 'Type a cheer / reaction...'}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#00F0FF] text-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Send comment"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0E1018] border-2 border-[#00F0FF] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.3)] overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#00F0FF]" />
                <h3 className="font-anime font-black text-xl text-white">
                  {isFr ? 'Modifier le Profil Athlète' : isEs ? 'Editar Perfil de Atleta' : 'Edit Athlete Profile'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="p-1 rounded-xl bg-gray-900 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-white font-anime font-black text-lg">
                  {isFr ? 'Profil mis à jour avec succès ! ⚡' : isEs ? '¡Perfil actualizado con éxito! ⚡' : 'Profile Updated Successfully! ⚡'}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editName.trim()) return;
                  authService.updateProfile({
                    name: editName.trim(),
                    specialization: editSpecialization.trim(),
                    avatar: editAvatar || currentUser.avatar
                  });
                  setEditSuccess(true);
                  setTimeout(() => {
                    setIsEditingProfile(false);
                    setEditSuccess(false);
                  }, 800);
                }}
                className="pt-5 space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
                    {isFr ? 'Nom de l’Athlète / Indicatif' : isEs ? 'Nombre del Atleta / Indicativo' : 'Athlete Name / Call-Sign'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white font-anime font-black focus:border-[#00F0FF] outline-none"
                    placeholder="Yam Suw, Cyber Striker..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
                    {isFr ? 'Discipline & Spécialisation' : isEs ? 'Disciplina y Especialización' : 'Discipline & Combat Specialization'}
                  </label>
                  <input
                    type="text"
                    value={editSpecialization}
                    onChange={(e) => setEditSpecialization(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white font-bold text-sm focus:border-[#00F0FF] outline-none"
                    placeholder="Boxing, Sprinting, Hyrox, Jiu-Jitsu..."
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-anime font-black text-xs cursor-pointer transition-all"
                  >
                    {isFr ? 'Annuler' : isEs ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00D0DF] text-black font-anime font-black text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  >
                    {isFr ? 'Enregistrer' : isEs ? 'Guardar Cambios' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
