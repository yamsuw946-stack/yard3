/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Crown, 
  Users, 
  Sparkles, 
  Share2, 
  PlusCircle, 
  Play, 
  Flame, 
  Zap, 
  Dumbbell, 
  Trophy, 
  Check, 
  Copy, 
  ExternalLink, 
  QrCode, 
  X, 
  Heart, 
  MessageSquare, 
  Clock, 
  Edit3, 
  ArrowRight, 
  ChevronRight, 
  Eye, 
  Activity, 
  Lock,
  Swords,
  Radio,
  Award,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Send,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { 
  ClubData, 
  ClubStory, 
  ClubMember, 
  CLUB_LOGO_PRESETS, 
  CLUB_THEME_COLORS, 
  INITIAL_AVAILABLE_ATHLETES, 
  PRESET_COMMUNITY_CLUBS,
  getCustomClubData, 
  saveCustomClubData, 
  getUserSubscriptionLevel, 
  setUserSubscriptionLevel, 
  publishClubStory, 
  reactToClubStory, 
  addClubMember, 
  removeClubMember,
  addStoryComment,
  getConnectedSubscribers,
  toggleConnectSubscriber
} from '../services/clubService';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

interface CreatorClubHubProps {
  currentLang?: Language;
  onNavigateToTiers?: () => void;
  onBack?: () => void;
}

export const CreatorClubHub: React.FC<CreatorClubHubProps> = ({
  currentLang = 'en',
  onNavigateToTiers,
  onBack
}) => {
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';
  const isAr = currentLang === 'ar';

  const fileInputRef = useRef<HTMLInputElement>(null);

  // User subscription level (1 to 4). Level 3 is required to own a club.
  const [userLevel, setUserLevel] = useState<number>(() => getUserSubscriptionLevel());
  const [club, setClub] = useState<ClubData>(() => getCustomClubData());
  const [activeTab, setActiveTab] = useState<'stories' | 'members' | 'drills' | 'explore'>('stories');
  const [memberFilter, setMemberFilter] = useState<'all' | 'connected'>('all');

  // Modals
  const [isEditClubOpen, setIsEditClubOpen] = useState(false);
  const [isNewStoryOpen, setIsNewStoryOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeStoryViewer, setActiveStoryViewer] = useState<ClubStory | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  // Edit Club form states
  const [editName, setEditName] = useState(club.name);
  const [editMotto, setEditMotto] = useState(club.motto);
  const [editCategory, setEditCategory] = useState(club.category);
  const [editLogo, setEditLogo] = useState(club.logoUrl);
  const [editColor, setEditColor] = useState(club.accentColor);

  // New Story form states
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryCaption, setNewStoryCaption] = useState('');
  const [newStoryType, setNewStoryType] = useState<ClubStory['badgeType']>('DRILL');
  const [newStoryIntensity, setNewStoryIntensity] = useState<ClubStory['intensity']>('HIGH');
  const [newStoryDuration, setNewStoryDuration] = useState<number>(30);
  const [newStoryCalories, setNewStoryCalories] = useState<number>(450);
  const [newStoryMedia, setNewStoryMedia] = useState('/images/boxing_striker_kenji_1790712616545.jpg');
  
  // Device upload states (Mobile Camera or PC File)
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileType, setUploadedFileType] = useState<'image' | 'video'>('image');
  const [uploadedMediaPreview, setUploadedMediaPreview] = useState<string>('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Subscriber Mutual Connections (Adding Friends)
  const [connectedSubscribers, setConnectedSubscribers] = useState<string[]>(() => getConnectedSubscribers());

  // Story Comment Input state
  const [storyCommentInput, setStoryCommentInput] = useState<string>('');

  const handleToggleSubscriber = (subId: string) => {
    soundFX.playButtonClick();
    toggleConnectSubscriber(subId);
    setConnectedSubscribers(getConnectedSubscribers());
  };

  const handleMediaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    soundFX.playPowerUp();
    const isVideo = file.type.startsWith('video');
    setUploadedFileType(isVideo ? 'video' : 'image');
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setUploadedMediaPreview(res);
      setNewStoryMedia(res);
    };
    reader.readAsDataURL(file);
  };

  const handleAddStoryComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStoryViewer || !storyCommentInput.trim()) return;
    soundFX.playButtonClick();
    const updated = addStoryComment(
      activeStoryViewer.id, 
      storyCommentInput.trim(), 
      club.ownerName || 'Athlete S-Rank',
      club.ownerAvatar || '/images/boxing_striker_kenji_1790712616545.jpg'
    );
    if (updated) {
      setActiveStoryViewer(updated);
    }
    setStoryCommentInput('');
  };

  // Daily drill complete state
  const [drillCompleted, setDrillCompleted] = useState(false);

  // Sync club updates
  useEffect(() => {
    const handleClubUpdate = (e: any) => {
      if (e.detail?.club) {
        setClub(e.detail.club);
      }
    };
    const handleLevelUpdate = (e: any) => {
      if (e.detail?.level) {
        setUserLevel(e.detail.level);
      }
    };
    const handleConnectionsUpdate = (e: any) => {
      if (e.detail?.connections) {
        setConnectedSubscribers(e.detail.connections);
      }
    };
    window.addEventListener('yard300_club_updated', handleClubUpdate);
    window.addEventListener('yard300_level_updated', handleLevelUpdate);
    window.addEventListener('yard300_connections_updated', handleConnectionsUpdate);
    return () => {
      window.removeEventListener('yard300_club_updated', handleClubUpdate);
      window.removeEventListener('yard300_level_updated', handleLevelUpdate);
      window.removeEventListener('yard300_connections_updated', handleConnectionsUpdate);
    };
  }, []);

  // Story progress timer
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

  const handleLevelUpgrade = (newLevel: number) => {
    soundFX.playPowerUp();
    setUserSubscriptionLevel(newLevel);
    setUserLevel(newLevel);
  };

  const handleSaveClubInfo = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playButtonClick();
    const updated: ClubData = {
      ...club,
      name: editName.trim() || club.name,
      motto: editMotto.trim() || club.motto,
      category: editCategory as any,
      logoUrl: editLogo,
      accentColor: editColor,
    };
    saveCustomClubData(updated);
    setIsEditClubOpen(false);
  };

  const handlePublishStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle.trim()) return;
    soundFX.playStrikeHit();

    publishClubStory({
      clubId: club.id,
      clubName: club.name,
      clubLogo: club.logoUrl,
      authorName: club.ownerName,
      authorAvatar: club.ownerAvatar,
      title: newStoryTitle.trim(),
      caption: newStoryCaption.trim(),
      mediaUrl: newStoryMedia,
      mediaType: uploadedFileType,
      badgeType: newStoryType,
      durationMinutes: newStoryDuration,
      burnCalories: newStoryCalories,
      intensity: newStoryIntensity,
    });

    setNewStoryTitle('');
    setNewStoryCaption('');
    setUploadedMediaPreview('');
    setUploadedFileName('');
    setIsNewStoryOpen(false);
  };

  const handleReactStory = (reaction: 'fire' | 'lightning' | 'muscle' | 'crown' | 'boxing') => {
    if (!activeStoryViewer) return;
    soundFX.playAuraSurge();
    const updated = reactToClubStory(activeStoryViewer.id, reaction);
    if (updated) {
      setActiveStoryViewer(updated);
    }
  };

  const handleCopyInviteLink = () => {
    soundFX.playButtonClick();
    const url = window.location.origin + `/#club=${club.inviteCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const handleAddAthlete = (ath: ClubMember) => {
    soundFX.playSuccess();
    addClubMember(ath);
  };

  const isLevel3OrAbove = userLevel >= 3;

  return (
    <div className="min-h-screen bg-[#07080D] text-white py-12 px-4 md:px-8 relative overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 bg-cyber-grid opacity-15 pointer-events-none"></div>
      <div 
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ backgroundColor: club.accentColor }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button 
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-[#121422] border border-gray-800 text-gray-300 hover:text-white hover:border-gray-600 transition-all text-xs font-bold font-anime cursor-pointer flex items-center gap-2"
              >
                ← {isEs ? 'VOLVER' : isFr ? 'RETOUR' : 'BACK'}
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121424] border border-gray-800 text-xs font-black font-anime text-[#FFE600]">
              <span className="w-2 h-2 rounded-full bg-[#E50914] animate-ping"></span>
              <span>{isEs ? 'SISTEMA DE CLUBES YARD300' : isFr ? 'SYSTÈME DE CLUBS YARD300' : 'YARD300 CREATOR CLUBS'}</span>
            </div>
          </div>

          {/* Level Status & Quick Upgrade Toggle */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-[#111320] border border-gray-800 text-xs font-mono flex items-center gap-2">
              <span className="text-gray-400">{isEs ? 'Tu Nivel:' : isFr ? 'Votre Niveau:' : 'Your Level:'}</span>
              <span className={`font-black font-anime ${userLevel >= 3 ? 'text-[#C084FC]' : 'text-[#FFE600]'}`}>
                {userLevel === 1 && 'LEVEL 1 (Iron Initiate)'}
                {userLevel === 2 && 'LEVEL 2 (Kinetic Striker)'}
                {userLevel === 3 && 'LEVEL 3 (Titan Apex Master)'}
                {userLevel === 4 && 'LEVEL 4 (God-Tier Overdrive)'}
              </span>
            </div>

            {/* Price Tag Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1E1130] to-[#0A261A] border border-[#A855F7]/50 text-xs font-mono">
              <span className="text-gray-400">CLUB FEE:</span>
              <span className="text-[#10B981] font-black font-anime">$30 USD</span>
            </div>

            {/* Quick Level 3 Demo Switcher so the user can test the club features immediately */}
            {!isLevel3OrAbove ? (
              <button
                onClick={() => handleLevelUpgrade(3)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2c084f] via-[#480d7a] to-[#047857] border border-[#6b21a8] text-white text-xs font-black font-anime shadow-[0_0_20px_rgba(76,29,149,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{isEs ? 'COMPRAR CLUB ($30 USD)' : isFr ? 'ACHETER CLUB (30 $)' : 'PURCHASE CLUB ($30 USD)'}</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-[#9333EA]/20 border border-[#A855F7] text-[#C084FC] text-xs font-black font-anime flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
                <Crown className="w-3.5 h-3.5 text-[#10B981]" />
                <span>VERIFIED OWNER ($30 LICENSE)</span>
              </div>
            )}
          </div>
        </div>

        {/* Official Tribe Champions Banner (BUILD YOUR TRIBE) */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#0C121E] via-[#090B14] to-[#120D1F] shadow-[0_15px_50px_rgba(0,0,0,0.8)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 relative h-72 sm:h-80 lg:h-full min-h-[300px] overflow-hidden">
            <img 
              src="/images/yard_tribe_champions.png" 
              alt="YARD 300 Tribe Champions - Build Your Tribe" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-transparent to-[#090B14]/90" />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-black font-anime text-emerald-400 border border-emerald-500/40">
              BUILD YOUR TRIBE // 2050
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black font-anime border border-emerald-500/40">
                STRONGER TOGETHER // TRIBE SYSTEM
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFE600]/20 text-[#FFE600] text-xs font-black font-mono">
                DISCIPLINE • COMMUNITY • PROGRESS • FREEDOM
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-anime text-white leading-tight">
              {isAr 
                ? 'أنشئ ناديك الخاص واجمع قبيلتك الرياضية (BUILD YOUR TRIBE)' 
                : 'Build Your Tribe & Lead Your Elite Athletic Squad'}
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
              {isAr 
                ? 'النخبة لا تتدرب بمفردها. مع اشتراك المستوى 3 (Titan Apex)، تفتح صلاحية امتلاك وإدارة ناديك الرياضي الخاص داخل YARD 300، تعيين اسم وشعار خاص، ونشر ستوريات تدريبك على مدار 24 ساعة لجذب ومتابعة نخبة الرياضيين.' 
                : 'True champions forge unbreakable tribes. Unlock the ability to own and brand your athletic club, broadcast 24h stories, and command your squad alongside global warriors.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {!isLevel3OrAbove ? (
                <button
                  onClick={() => handleLevelUpgrade(3)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-[#FFE600] text-black font-black font-anime text-sm shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Crown className="w-4 h-4 text-black" />
                  <span>{isAr ? 'ترقية وشراء رخصة النادي ($30 USD) ⚡' : 'Unlock Club License ($30 USD) ⚡'}</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-black font-anime text-xs border border-emerald-500/50">
                  <Crown className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'رخصة النادي مفعلة ومملوكة لك بالكامل ✓' : 'Club License Active & Verified ✓'}</span>
                </div>
              )}

              {onNavigateToTiers && (
                <button
                  onClick={onNavigateToTiers}
                  className="px-5 py-3 rounded-2xl bg-[#141624] hover:bg-[#1A1C30] text-gray-300 hover:text-white font-black font-anime text-xs transition-all cursor-pointer"
                >
                  <span>{isAr ? 'استعراض مستويات الاشتراك' : 'View Subscriber Tiers'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Club Banner & Header Card */}
        <div 
          className="rounded-3xl p-6 md:p-10 border-2 relative overflow-hidden transition-all shadow-2xl"
          style={{ 
            borderColor: club.accentColor,
            background: `linear-gradient(135deg, #0D0E17 0%, #121422 60%, #1A0D15 100%)`,
            boxShadow: `0 0 45px ${club.accentColor}33`
          }}
        >
          {/* Subtle Top Accent Glow */}
          <div 
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: club.accentColor }}
          ></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            
            {/* Club Identity (Logo + Name + Tagline) */}
            <div className="flex items-start md:items-center gap-6">
              {/* Club Emblem / Logo Badge */}
              <div 
                className="w-20 h-20 md:w-28 md:h-28 rounded-3xl flex items-center justify-center shrink-0 text-4xl md:text-6xl border-2 shadow-2xl relative group"
                style={{ 
                  borderColor: club.accentColor,
                  background: `radial-gradient(circle, ${club.accentColor}22 0%, #0A0B12 90%)`,
                  boxShadow: `0 0 30px ${club.accentColor}66`
                }}
              >
                <span>{club.logoUrl}</span>
                <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-black/90 border border-gray-700 text-[10px] font-black font-anime text-[#FFE600]">
                  CLUB DOJO
                </div>
              </div>

              {/* Title & Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span 
                    className="px-3 py-1 rounded-xl text-xs font-black font-anime uppercase tracking-wider"
                    style={{ backgroundColor: `${club.accentColor}25`, color: club.accentColor }}
                  >
                    {club.category}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[#141728] border border-gray-800 text-gray-400 text-xs font-mono">
                    ID: {club.id}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-black/60 border border-[#FFE600]/40 text-[#FFE600] text-xs font-black font-anime flex items-center gap-1">
                    <Crown className="w-3 h-3 text-[#FFE600]" />
                    <span>FOUNDER: {club.ownerName}</span>
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#9333EA]/30 to-[#10B981]/20 border border-[#A855F7]/60 text-emerald-300 text-xs font-black font-anime flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
                    <span>PRICE: $30 USD (CLUB PASS)</span>
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black font-anime tracking-wide text-white drop-shadow-md">
                  {club.name}
                </h1>
                
                <p className="text-sm md:text-base text-gray-300 font-medium max-w-2xl leading-relaxed">
                  “{club.motto}”
                </p>
              </div>
            </div>

            {/* Quick Action Buttons for Owner */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setIsNewStoryOpen(true)}
                className="flex-1 lg:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-[#9333EA] to-[#A855F7] text-white font-black font-anime text-xs shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#10B981]" />
                <span>{isEs ? 'PUBLICAR HISTORIA' : isFr ? 'PUBLIER STORY' : 'POST CLUB STORY'}</span>
              </button>

              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="flex-1 lg:flex-none px-5 py-3 rounded-2xl bg-[#141624] border border-gray-700 hover:border-[#10B981] text-white font-black font-anime text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-[#10B981]" />
                <span>{isEs ? 'INVITAR SEGUIDORES' : isFr ? 'INVITER MEMBRES' : 'RECRUIT FOLLOWERS'}</span>
              </button>

              <button
                onClick={() => setIsEditClubOpen(true)}
                className="p-3 rounded-2xl bg-[#141624] border border-gray-700 hover:border-[#A855F7] text-gray-300 hover:text-[#C084FC] transition-all cursor-pointer"
                title="Edit Club Branding & Logo"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Direct Club Test Link & Share HUD */}
          <div className="mt-8 pt-6 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/50 border border-[#A855F7]/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-2.5 rounded-xl bg-[#9333EA]/20 border border-[#A855F7] text-[#C084FC] shrink-0">
                <ExternalLink className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black font-mono uppercase text-[#C084FC]">
                    {isEs ? 'ENLACE DIRECTO DEL CLUB' : isFr ? 'LIEN DIRECT DU CLUB' : 'DIRECT CLUB ACCESS LINK'}
                  </span>
                  <span className="text-[9px] bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 px-1.5 rounded font-mono font-bold">
                    $30 ACTIVE PASS
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-300 truncate select-all mt-0.5">
                  {typeof window !== 'undefined' ? `${window.location.origin}/#club=${club.inviteCode}` : `/#club=${club.inviteCode}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-anime font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer active:scale-95"
                title="Copy Test Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'LINK COPIED ✓' : 'COPY TEST LINK'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  window.location.hash = `club=${club.inviteCode}`;
                }}
                className="px-3 py-2 rounded-xl bg-[#121422] border border-gray-700 hover:border-[#10B981] text-gray-300 hover:text-white font-anime font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Test Link Directly In Page"
              >
                <Play className="w-3.5 h-3.5 text-[#10B981]" />
                <span>TEST IN URL</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="p-2 rounded-xl bg-[#121422] border border-gray-700 hover:border-[#A855F7] text-gray-300 hover:text-white transition-all cursor-pointer"
                title="Display QR Code"
              >
                <QrCode className="w-4 h-4 text-[#C084FC]" />
              </button>
            </div>
          </div>

          {/* Club Key Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800/80">
            <div className="p-4 rounded-2xl bg-black/40 border border-gray-800/70">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-1">
                <Users className="w-4 h-4 text-[#00F0FF]" />
                <span>{isEs ? 'Seguidores y Miembros' : isFr ? 'Followers & Membres' : 'Followers & Members'}</span>
              </div>
              <span className="text-2xl md:text-3xl font-black font-anime text-white">
                {club.followersCount.toLocaleString()}
              </span>
              <span className="block text-[11px] text-emerald-400 font-mono mt-0.5">
                +{club.members.length} verified roster
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-gray-800/70">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-1">
                <Sparkles className="w-4 h-4 text-[#FFE600]" />
                <span>{isEs ? 'Puntos de Aura del Club' : isFr ? 'Points d\'Aura du Club' : 'Total Club Aura XP'}</span>
              </div>
              <span className="text-2xl md:text-3xl font-black font-anime text-[#FFE600]">
                {club.totalAuraScore.toLocaleString()}
              </span>
              <span className="block text-[11px] text-gray-400 font-mono mt-0.5">
                Top 1% Global Ranking
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-gray-800/70">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-1">
                <Dumbbell className="w-4 h-4 text-[#E50914]" />
                <span>{isEs ? 'Entrenamientos Semanales' : isFr ? 'Entraînements Semaine' : 'Weekly Workouts'}</span>
              </div>
              <span className="text-2xl md:text-3xl font-black font-anime text-white">
                {club.weeklyWorkouts}
              </span>
              <span className="block text-[11px] text-gray-400 font-mono mt-0.5">
                Target: 500 completed
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-gray-800/70">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-1">
                <Radio className="w-4 h-4 text-[#A855F7]" />
                <span>{isEs ? 'Historias Activas (24h)' : isFr ? 'Stories Actives (24h)' : 'Live Stories (24h)'}</span>
              </div>
              <span className="text-2xl md:text-3xl font-black font-anime text-[#A855F7]">
                {club.stories.length} Live
              </span>
              <span className="block text-[11px] text-gray-400 font-mono mt-0.5">
                Updates from squad
              </span>
            </div>
          </div>
        </div>

        {/* 24-HOUR CLUB STORIES REEL (Instagram / WhatsApp Style) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-anime text-white">
                {isEs ? 'HISTORIAS DEL CLUB (24H)' : isFr ? 'STORIES DU CLUB (24H)' : 'CLUB STORIES & DRILLS (24H)'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E50914]/20 border border-[#E50914] text-[#E50914] text-[10px] font-black font-anime animate-pulse">
                LIVE
              </span>
            </div>

            <button
              onClick={() => setIsNewStoryOpen(true)}
              className="text-xs font-bold font-anime text-[#00F0FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isEs ? '+ Nueva Historia' : isFr ? '+ Nouvelle Story' : '+ Post Story'}</span>
            </button>
          </div>

          {/* Stories Horizontal Scrolling Reel */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin">
            
            {/* Create New Story Bubble */}
            <button
              onClick={() => setIsNewStoryOpen(true)}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
            >
              <div className="w-18 h-18 md:w-20 md:h-20 rounded-full p-1 bg-gradient-to-tr from-gray-700 to-gray-800 group-hover:from-[#E50914] group-hover:to-[#FFE600] transition-all">
                <div className="w-full h-full rounded-full bg-[#121422] border-2 border-dashed border-gray-600 group-hover:border-[#FFE600] flex items-center justify-center text-white">
                  <PlusCircle className="w-6 h-6 text-[#FFE600] group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="text-[11px] font-black font-anime text-gray-300 group-hover:text-white max-w-[80px] text-center truncate">
                {isEs ? 'Añadir' : isFr ? 'Ajouter' : 'New Story'}
              </span>
            </button>

            {/* List of Active Stories */}
            {club.stories.map((story) => {
              const hasUnseen = !story.userReactions.length;
              return (
                <button
                  key={story.id}
                  onClick={() => {
                    soundFX.playButtonClick();
                    setActiveStoryViewer(story);
                  }}
                  className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
                >
                  <div className={`w-18 h-18 md:w-20 md:h-20 rounded-full p-1 transition-all ${
                    hasUnseen 
                      ? 'bg-gradient-to-tr from-[#E50914] via-[#A855F7] to-[#FFE600] animate-pulse shadow-[0_0_15px_rgba(229,9,20,0.5)]' 
                      : 'bg-gradient-to-tr from-gray-700 to-gray-500'
                  } group-hover:scale-105`}>
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-black relative">
                      <img 
                        src={story.mediaUrl} 
                        alt={story.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="text-xs">{story.clubLogo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center max-w-[85px]">
                    <span className="block text-[11px] font-black font-anime text-white truncate">
                      {story.authorName.split(' ')[0]}
                    </span>
                    <span className="block text-[9px] text-[#FFE600] font-mono">
                      {story.badgeType}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Navigation Tabs */}
        <div className="flex border-b border-gray-800 gap-2 md:gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-5 py-3 rounded-t-2xl font-black font-anime text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'stories'
                ? 'bg-[#141624] text-white border-b-2 border-[#E50914] shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-[#E50914]" />
            <span>{isEs ? 'HISTORIAS Y PUBLICACIONES' : isFr ? 'STORIES & PUBLICATIONS' : 'STORIES & FEED'}</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-5 py-3 rounded-t-2xl font-black font-anime text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'members'
                ? 'bg-[#141624] text-white border-b-2 border-[#00F0FF] shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-[#00F0FF]" />
            <span>{isEs ? 'SEGUIDORES Y ATLETAS' : isFr ? 'FOLLOWERS & ATHLÈTES' : 'FOLLOWERS & ATHLETES'} ({club.followersCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('drills')}
            className={`px-5 py-3 rounded-t-2xl font-black font-anime text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'drills'
                ? 'bg-[#141624] text-white border-b-2 border-[#FFE600] shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-[#FFE600]" />
            <span>{isEs ? 'DESAFÍO DIARIO DEL CLUB' : isFr ? 'DÉFI QUOTIDIEN DU CLUB' : 'DAILY SQUAD DRILL'}</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`px-5 py-3 rounded-t-2xl font-black font-anime text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'explore'
                ? 'bg-[#141624] text-white border-b-2 border-[#A855F7] shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4 text-[#A855F7]" />
            <span>{isEs ? 'EXPLORAR OTROS CLUBES' : isFr ? 'EXPLORER AUTRES CLUBS' : 'EXPLORE COMMUNITY CLUBS'}</span>
          </button>
        </div>

        {/* TAB 1: STORIES & FEED */}
        {activeTab === 'stories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {club.stories.map((story) => (
              <div 
                key={story.id} 
                className="rounded-3xl bg-[#0F101A] border border-gray-800 hover:border-gray-600 transition-all overflow-hidden flex flex-col group shadow-lg"
              >
                {/* Story Image & Overlay */}
                <div className="relative h-56 overflow-hidden bg-black">
                  {story.mediaType === 'video' || story.mediaUrl.startsWith('data:video') || story.mediaUrl.endsWith('.mp4') ? (
                    <video 
                      src={story.mediaUrl} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <img 
                      src={story.mediaUrl} 
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F101A] via-transparent to-black/60 pointer-events-none"></div>
                  
                  {/* Top author info */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700/60">
                      <span className="text-base">{story.clubLogo}</span>
                      <span className="text-xs font-black font-anime text-white">{story.authorName}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#E50914] text-white text-[10px] font-black font-anime">
                      {story.badgeType}
                    </span>
                  </div>

                  {/* Workout metrics overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-gray-300">
                    <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl">
                      {story.durationMinutes && <span>⏱️ {story.durationMinutes} min</span>}
                      {story.burnCalories && <span>🔥 {story.burnCalories} kcal</span>}
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#A855F7] text-[10px] font-black font-anime">
                      {story.intensity}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black font-anime text-white group-hover:text-[#FFE600] transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                      {story.caption}
                    </p>
                  </div>

                  {/* Footer & Reactions */}
                  <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          soundFX.playAuraSurge();
                          reactToClubStory(story.id, 'fire');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-[#E50914]/20 border border-gray-800 hover:border-[#E50914] text-xs font-mono text-gray-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>🔥</span>
                        <span>{story.reactions.fire}</span>
                      </button>
                      <button 
                        onClick={() => {
                          soundFX.playAuraSurge();
                          reactToClubStory(story.id, 'muscle');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-[#FFE600]/20 border border-gray-800 hover:border-[#FFE600] text-xs font-mono text-gray-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>💪</span>
                        <span>{story.reactions.muscle}</span>
                      </button>
                      <button 
                        onClick={() => {
                          soundFX.playAuraSurge();
                          reactToClubStory(story.id, 'boxing');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-[#00F0FF]/20 border border-gray-800 hover:border-[#00F0FF] text-xs font-mono text-gray-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>🥊</span>
                        <span>{story.reactions.boxing}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        soundFX.playButtonClick();
                        setActiveStoryViewer(story);
                      }}
                      className="text-xs font-black font-anime text-[#FFE600] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>VIEW 24H</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: MEMBERS & MUTUAL SUBSCRIBER CONNECTIONS */}
        {activeTab === 'members' && (
          <div className="space-y-8">
            
            {/* External Invite Link Section (Direct Web & Mobile URL) */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#111322] to-[#1A1C30] border-2 border-[#00F0FF]/50 shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-black font-anime">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isEs ? 'INVITACIÓN EXTERNA (WEB Y MÓVIL)' : isFr ? 'INVITATION EXTERNE (WEB & MOBILE)' : 'EXTERNAL INVITE LINK (WEB & MOBILE)'}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black font-anime text-white">
                  {isEs ? 'Invita a Amigos y Compañeros de Gimnasio a Seguir Tu Club' : isFr ? 'Invitez vos Amis et Partenaires d\'Entraînement' : 'Invite Friends & Gym Buddies to Follow Your Club'}
                </h3>
                <p className="text-xs md:text-sm text-gray-300 max-w-xl">
                  {isEs 
                    ? 'Comparte el enlace exclusivo o el código QR de tu club a través de WhatsApp, redes sociales o email para que otros se unan a tus entrenamientos y vean tus historias.' 
                    : isFr 
                    ? 'Partagez le lien direct de votre club ou votre QR code via WhatsApp ou réseaux sociaux pour permettre à quiconque de suivre vos stories et entraînements.' 
                    : 'Share your club\'s unique URL or QR code across WhatsApp, Instagram, or Telegram. Anyone who taps the link follows your club and joins your squad routines.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleCopyInviteLink}
                  className="px-6 py-3.5 rounded-2xl bg-[#00F0FF] text-black font-black font-anime text-xs shadow-[0_0_20px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? (isEs ? '¡ENLACE COPIADO!' : isFr ? 'LIEN COPIÉ !' : 'LINK COPIED!') : (isEs ? 'COPIAR ENLACE DE INVITACIÓN' : isFr ? 'COPIER LE LIEN D\'INVITATION' : 'COPY CLUB INVITE LINK')}</span>
                </button>

                <button
                  onClick={() => setShowQrModal(true)}
                  className="px-5 py-3.5 rounded-2xl bg-[#141624] border border-gray-700 hover:border-white text-white font-black font-anime text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-[#FFE600]" />
                  <span>{isEs ? 'VER CÓDIGO QR' : isFr ? 'VOIR QR CODE' : 'SHOW QR CODE'}</span>
                </button>
              </div>
            </div>

            {/* Current Active Roster with Mutual Friend Adding */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#0F101A] border border-gray-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black font-anime text-white">
                    {isEs ? 'ROSTER OFICIAL Y CONEXIÓN DE MIEMBROS' : isFr ? 'EFFECTIF ET CONNEXIONS ENTRE MEMBRES' : 'OFFICIAL SQUAD ATHLETES & SUBSCRIBER NETWORK'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isEs 
                      ? 'Todos los suscriptores pueden añadirse como amigos, compartir rutinas e interactuar con historias.' 
                      : isFr 
                      ? 'Tous les abonnés peuvent s\'ajouter en amis, partager des routines et interagir avec les stories.' 
                      : 'All subscribers can add each other as squad friends, broadcast workouts, and interact with 24h stories.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Mutual Connections Filter */}
                  <div className="flex items-center bg-[#141624] border border-gray-800 rounded-xl p-1 text-xs font-anime">
                    <button
                      onClick={() => setMemberFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        memberFilter === 'all' ? 'bg-[#00F0FF] text-black font-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {isEs ? 'Todos los Atletas' : isFr ? 'Tous les Athlètes' : 'All Roster'} ({club.members.length})
                    </button>
                    <button
                      onClick={() => setMemberFilter('connected')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        memberFilter === 'connected' ? 'bg-[#10B981] text-black font-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isEs ? 'Mis Amigos' : isFr ? 'Mes Amis' : 'My Friends'}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-mono">
                        {club.members.filter(m => connectedSubscribers.includes(m.id)).length}
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-[#FFE600] text-black font-black font-anime text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isEs ? '+ Reclutar Atleta' : isFr ? '+ Recruter Athlète' : '+ Add Community Athlete'}</span>
                  </button>
                </div>
              </div>

              {/* Roster Cards Grid with Add Friend Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {club.members
                  .filter(member => memberFilter === 'all' || connectedSubscribers.includes(member.id))
                  .map((member) => {
                    const isConnected = connectedSubscribers.includes(member.id);
                    const isOwner = member.id === 'owner-yam';

                    return (
                      <div 
                        key={member.id}
                        className={`p-4 rounded-2xl bg-[#141624] border transition-all flex flex-col justify-between gap-4 ${
                          isConnected 
                            ? 'border-[#10B981]/60 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-gradient-to-br from-[#141624] to-[#0A1A12]' 
                            : 'border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-700 shrink-0 relative">
                              <img 
                                src={member.avatar} 
                                alt={member.name} 
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                              />
                              {isConnected && (
                                <div className="absolute top-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border border-black" title="Connected Squad Friend" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="block text-sm font-black font-anime text-white">
                                  {member.name}
                                </span>
                                {isOwner && (
                                  <Crown className="w-3.5 h-3.5 text-[#FFE600] shrink-0" />
                                )}
                              </div>
                              <span className="block text-[11px] text-[#FFE600] font-mono">
                                {member.tier}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mt-0.5">
                                <span>⚡ {member.streak}d streak</span>
                                <span>•</span>
                                <span className={member.status === 'training' ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
                                  {member.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {!isOwner && (
                            <button
                              onClick={() => {
                                soundFX.playButtonClick();
                                removeClubMember(member.id);
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                              title="Remove from Roster"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Interactive Add Friend / Connection Action for Subscribers */}
                        {!isOwner && (
                          <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-gray-400">
                              {isConnected 
                                ? (isEs ? 'Amigo Conectado ✓' : isFr ? 'Ami Connecté ✓' : 'Squad Friend ✓')
                                : (isEs ? 'No conectado' : isFr ? 'Non connecté' : 'Not Connected')}
                            </span>

                            <button
                              onClick={() => handleToggleSubscriber(member.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black font-anime transition-all cursor-pointer flex items-center gap-1.5 ${
                                isConnected
                                  ? 'bg-[#10B981]/20 border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/30'
                                  : 'bg-[#121422] hover:bg-[#1A1D2E] border border-gray-700 hover:border-[#00F0FF] text-gray-300 hover:text-white'
                              }`}
                            >
                              {isConnected ? (
                                <>
                                  <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />
                                  <span>{isEs ? 'CONECTADO ✓' : isFr ? 'CONNECTÉ ✓' : 'CONNECTED ✓'}</span>
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-3.5 h-3.5 text-[#00F0FF]" />
                                  <span>{isEs ? '+ AÑADIR AMIGO' : isFr ? '+ AJOUTER AMI' : '+ ADD FRIEND'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DAILY SQUAD DRILL */}
        {activeTab === 'drills' && (
          <div className="p-6 md:p-10 rounded-3xl bg-[#0F101A] border-2 border-[#FFE600]/40 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/20 text-[#FFE600] text-xs font-black font-anime border border-[#FFE600]/40 mb-2">
                  <Flame className="w-3.5 h-3.5" />
                  <span>DAILY CLUB MANDATE // 24H DRILL</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black font-anime text-white">
                  {club.dailyDrill.title}
                </h2>
                <p className="text-sm text-gray-300 max-w-2xl mt-1">
                  {club.dailyDrill.desc}
                </p>
              </div>

              <div className="text-right">
                <span className="block text-2xl font-black font-anime text-[#FFE600]">
                  +{club.dailyDrill.xpReward} YARDX
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {club.dailyDrill.completedCount} members completed today
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/50 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFE600]/20 border border-[#FFE600] flex items-center justify-center text-3xl">
                  🥊
                </div>
                <div>
                  <span className="block text-base font-black font-anime text-white">
                    {club.dailyDrill.targetReps}
                  </span>
                  <span className="text-xs text-gray-400">
                    Log your completion to boost club ranking and earn bonus aura tokens.
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFX.playSuccess();
                  setDrillCompleted(true);
                }}
                disabled={drillCompleted}
                className={`px-8 py-4 rounded-2xl font-black font-anime text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  drillCompleted
                    ? 'bg-emerald-600 text-white cursor-default shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                    : 'bg-gradient-to-r from-[#FFE600] to-[#E50914] text-black shadow-[0_0_25px_rgba(255,230,0,0.5)] hover:scale-105 active:scale-95'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{drillCompleted ? 'DRILL COMPLETED (+350 YARDX) ✅' : 'EXECUTE & LOG DRILL NOW ⚡'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: EXPLORE COMMUNITY CLUBS */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black font-anime text-white">
                {isEs ? 'CLUBES ACTIVOS EN LA COMUNIDAD YARD300' : isFr ? 'CLUBS ACTIFS DE LA COMMUNAUTÉ YARD300' : 'EXPLORE YARD300 COMMUNITY SQUADS'}
              </h3>
              <p className="text-xs text-gray-400">
                {isEs ? 'Descubre otros clubes creados por atletas de Nivel 3 y 4 y sigue sus rutinas.' : isFr ? 'Découvrez d\'autres clubs créés par des athlètes de Niveau 3 et 4.' : 'Discover clubs founded by elite Level 3 and Level 4 warriors.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRESET_COMMUNITY_CLUBS.map((c) => (
                <div 
                  key={c.id} 
                  className="rounded-3xl bg-[#0F101A] border border-gray-800 p-6 flex flex-col justify-between space-y-4 hover:border-gray-600 transition-all shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border"
                        style={{ borderColor: c.accentColor, backgroundColor: `${c.accentColor}20` }}
                      >
                        {c.logoUrl}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-black/60 border border-gray-800 text-xs font-mono text-gray-300">
                        👥 {c.followersCount}
                      </span>
                    </div>

                    <h4 className="text-lg font-black font-anime text-white">{c.name}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">“{c.motto}”</p>
                  </div>

                  <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">
                      Founder: <strong className="text-white">{c.ownerName}</strong>
                    </span>
                    <button
                      onClick={() => {
                        soundFX.playSuccess();
                        alert(`Following ${c.name}! You will now receive their daily stories.`);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#141624] border border-gray-700 hover:border-white text-xs font-black font-anime text-white hover:scale-105 transition-all cursor-pointer"
                    >
                      + FOLLOW SQUAD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: EDIT CLUB BRANDING & LOGO */}
      {isEditClubOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0F111E] border-2 border-[#E50914] p-6 md:p-8 space-y-6 relative shadow-[0_0_50px_rgba(229,9,20,0.5)]">
            <button
              onClick={() => setIsEditClubOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-2xl font-black font-anime text-white">
                {isEs ? 'PERSONALIZAR TU CLUB' : isFr ? 'PERSONNALISER VOTRE CLUB' : 'CUSTOMIZE YOUR CLUB BRAND'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isEs ? 'Edita el nombre, el lema y el logotipo que verán tus seguidores.' : isFr ? 'Modifiez le nom, la devise et le blason de votre club.' : 'Choose the custom badge, title, and theme of your athletic club.'}
              </p>
            </div>

            <form onSubmit={handleSaveClubInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                  Club Name
                </label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-gray-700 text-white font-anime text-sm focus:border-[#E50914] outline-none"
                  placeholder="e.g. TOKYO CYBER STRIKE"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                  Club Motto / Bio
                </label>
                <textarea 
                  value={editMotto}
                  onChange={(e) => setEditMotto(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs focus:border-[#E50914] outline-none"
                  placeholder="e.g. Relentless speed, unbroken endurance."
                />
              </div>

              {/* Logo / Badge Selection */}
              <div>
                <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-2">
                  Select Club Emblem / Logo
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CLUB_LOGO_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setEditLogo(p.icon)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        editLogo === p.icon
                          ? 'border-[#FFE600] bg-[#FFE600]/20 scale-105 shadow-[0_0_15px_rgba(255,230,0,0.4)]'
                          : 'border-gray-800 bg-black/40 hover:border-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{p.icon}</span>
                      <span className="text-[9px] font-anime text-gray-300">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Accent Color */}
              <div>
                <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-2">
                  Accent Color Glow
                </label>
                <div className="flex items-center gap-3">
                  {CLUB_THEME_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setEditColor(c.hex)}
                      className={`w-9 h-9 rounded-xl transition-all cursor-pointer ${
                        editColor === c.hex ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditClubOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-anime text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E50914] text-white font-black font-anime text-xs shadow-[0_0_20px_rgba(229,9,20,0.6)] cursor-pointer"
                >
                  Save Changes ⚡
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PUBLISH NEW 24H STORY */}
      {isNewStoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0F111E] border-2 border-[#A855F7] p-6 md:p-8 space-y-6 relative shadow-[0_0_50px_rgba(255,0,122,0.5)]">
            <button
              onClick={() => setIsNewStoryOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A855F7]/20 text-[#A855F7] text-[10px] font-black font-anime border border-[#A855F7]/40 mb-1">
                <Radio className="w-3 h-3" />
                <span>24-HOUR BROADCAST</span>
              </div>
              <h2 className="text-2xl font-black font-anime text-white">
                {isEs ? 'PUBLICAR HISTORIA EN EL CLUB' : isFr ? 'PUBLIER UNE STORY AU CLUB' : 'BROADCAST CLUB STORY (24H)'}
              </h2>
              <p className="text-xs text-gray-400">
                {isEs ? 'Comparte tu entrenamiento diario, un desafío o un hito de recuperación con todos tus seguidores.' : isFr ? 'Partagez votre entraînement ou défi du jour avec tous vos followers.' : 'Post your daily workout drill, sparring combo, or recovery log to your followers.'}
              </p>
            </div>

            <form onSubmit={handlePublishStory} className="space-y-4">
              {/* DEVICE UPLOAD SECTION (MOBILE CAMERA / PC FILES) */}
              <div className="space-y-2">
                <label className="block text-xs font-black font-anime text-[#FFE600] uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isEs ? 'SUBIR FOTO O VÍDEO DESDE TU DISPOSITIVO (MÓVIL / PC)' : isFr ? 'TÉLÉVERSER PHOTO OU VIDÉO DEPUIS L\'APPAREIL' : 'UPLOAD PHOTO OR VIDEO FROM DEVICE (MOBILE / PC)'}</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">JPG, PNG, MP4, WEBM</span>
                </label>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={handleMediaFileUpload}
                  className="hidden"
                />

                {/* Upload Trigger Area */}
                {!uploadedMediaPreview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const fakeEvent = { target: { files: [file] } } as any;
                        handleMediaFileUpload(fakeEvent);
                      }
                    }}
                    className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
                      isDraggingFile 
                        ? 'border-[#FFE600] bg-[#FFE600]/10 scale-[1.02]' 
                        : 'border-[#A855F7]/50 bg-black/50 hover:border-[#A855F7] hover:bg-black/80'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl mx-auto bg-gradient-to-tr from-[#A855F7]/30 to-[#FFE600]/30 border border-[#A855F7]/50 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,0,122,0.3)]">
                      <Upload className="w-7 h-7 text-[#FFE600] animate-bounce" />
                    </div>
                    <div>
                      <span className="block text-sm font-black font-anime text-white">
                        {isEs ? 'Toca para Elegir Archivo o Tomar Foto / Vídeo' : isFr ? 'Touchez pour Choisir ou Filmer' : 'Tap to Choose File or Capture Video / Photo'}
                      </span>
                      <span className="block text-xs text-gray-400 mt-1">
                        {isEs ? 'Compatible con cámara de móvil o archivos de ordenador' : isFr ? 'Compatible caméra smartphone ou fichiers PC' : 'Compatible with smartphone camera roll & computer storage'}
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
                  /* Media Live Preview Card */
                  <div className="p-3 rounded-2xl bg-black/80 border-2 border-[#10B981] relative overflow-hidden space-y-2">
                    <div className="h-44 rounded-xl overflow-hidden bg-black relative flex items-center justify-center">
                      {uploadedFileType === 'video' ? (
                        <video 
                          src={uploadedMediaPreview} 
                          controls 
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src={uploadedMediaPreview} 
                          alt="Story Preview" 
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        {uploadedFileType === 'video' ? 'VIDEO READY' : 'PHOTO READY'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono px-1">
                      <span className="text-gray-300 truncate max-w-[220px]">
                        📁 {uploadedFileName || 'Uploaded device media'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedMediaPreview('');
                          setUploadedFileName('');
                          fileInputRef.current?.click();
                        }}
                        className="text-[#00F0FF] hover:underline font-anime font-black text-xs cursor-pointer"
                      >
                        {isEs ? 'Cambiar archivo' : isFr ? 'Changer' : 'Change File'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                  {isEs ? 'Título de la Historia / Ejercicio' : isFr ? 'Titre de la Story / Défi' : 'Story Title / Drill Name'}
                </label>
                <input 
                  type="text" 
                  value={newStoryTitle}
                  onChange={(e) => setNewStoryTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-gray-700 text-white font-anime text-sm focus:border-[#A855F7] outline-none"
                  placeholder="e.g. Dawn Gauntlet: 500 Heavy Bag Strikes 🥊"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                  {isEs ? 'Notas y Descripción del Entrenamiento' : isFr ? 'Notes & Description de Séance' : 'Story Notes & Workout Caption'}
                </label>
                <textarea 
                  value={newStoryCaption}
                  onChange={(e) => setNewStoryCaption(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs focus:border-[#A855F7] outline-none"
                  placeholder="e.g. 5 rounds of high-intensity hooks & cross combos. Squad, let's complete today's quota!"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                    {isEs ? 'Categoría' : isFr ? 'Catégorie' : 'Story Category'}
                  </label>
                  <select
                    value={newStoryType}
                    onChange={(e) => setNewStoryType(e.target.value as any)}
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
                    {isEs ? 'Intensidad' : isFr ? 'Intensité' : 'Intensity Level'}
                  </label>
                  <select
                    value={newStoryIntensity}
                    onChange={(e) => setNewStoryIntensity(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs font-anime outline-none"
                  >
                    <option value="LOW">LOW INTENSITY</option>
                    <option value="MEDIUM">MEDIUM INTENSITY</option>
                    <option value="HIGH">HIGH INTENSITY</option>
                    <option value="MAX OVERDRIVE">MAX OVERDRIVE ⚡</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                    {isEs ? 'Duración (Minutos)' : isFr ? 'Durée (Minutes)' : 'Duration (Minutes)'}
                  </label>
                  <input 
                    type="number" 
                    value={newStoryDuration}
                    onChange={(e) => setNewStoryDuration(Number(e.target.value))}
                    min={5}
                    max={180}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black font-anime text-gray-300 uppercase mb-1">
                    {isEs ? 'Calorías Quemadas (kcal)' : isFr ? 'Calories Estimées (kcal)' : 'Estimated Calories (kcal)'}
                  </label>
                  <input 
                    type="number" 
                    value={newStoryCalories}
                    onChange={(e) => setNewStoryCalories(Number(e.target.value))}
                    min={50}
                    max={2000}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewStoryOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-anime text-xs cursor-pointer"
                >
                  {isEs ? 'Cancelar' : isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#E50914] text-white font-black font-anime text-xs shadow-[0_0_20px_rgba(255,0,122,0.6)] cursor-pointer"
                >
                  {isEs ? 'Publicar Historia (24h) ⚡' : isFr ? 'Diffuser la Story (24h) ⚡' : 'Broadcast Story (24h) ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FULLSCREEN 24H STORY VIEWER WITH VIDEO PLAYBACK & COMMENTS */}
      {activeStoryViewer && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-2 md:p-4">
          <div className="w-full max-w-md h-[92vh] max-h-[780px] rounded-3xl bg-black border-2 border-gray-800 relative overflow-hidden flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.9)]">
            
            {/* Story Background Media (Video or Image) */}
            <div className="absolute inset-0">
              {activeStoryViewer.mediaType === 'video' || activeStoryViewer.mediaUrl.startsWith('data:video') || activeStoryViewer.mediaUrl.endsWith('.mp4') ? (
                <video 
                  src={activeStoryViewer.mediaUrl} 
                  autoPlay
                  loop
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={activeStoryViewer.mediaUrl} 
                  alt={activeStoryViewer.title} 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none"></div>
            </div>

            {/* Top Bar with Timer Progress */}
            <div className="relative z-10 p-4 space-y-3">
              {/* Animated Progress Bar */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#E50914] to-[#FFE600] transition-all duration-100 ease-linear"
                  style={{ width: `${storyProgress}%` }}
                ></div>
              </div>

              {/* Author & Close */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black/60 border border-white/40 flex items-center justify-center text-lg">
                    {activeStoryViewer.clubLogo}
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
                  className="p-2 rounded-full bg-black/60 text-white hover:text-gray-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bottom Content, Reactions & Comments */}
            <div className="relative z-10 p-4 md:p-6 space-y-3 bg-gradient-to-t from-black via-black/95 to-transparent">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E50914] text-white text-[10px] font-black font-anime">
                    {activeStoryViewer.badgeType}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px] font-mono">
                    ⏱️ {activeStoryViewer.durationMinutes} min
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px] font-mono">
                    🔥 {activeStoryViewer.burnCalories} kcal
                  </span>
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
                    onClick={() => handleReactStory('fire')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-[#E50914]/30 border border-gray-700 hover:border-[#E50914] text-sm hover:scale-110 transition-all cursor-pointer"
                    title="Fire"
                  >
                    🔥 <span className="text-[10px] font-mono">{activeStoryViewer.reactions.fire}</span>
                  </button>
                  <button
                    onClick={() => handleReactStory('lightning')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-[#FFE600]/30 border border-gray-700 hover:border-[#FFE600] text-sm hover:scale-110 transition-all cursor-pointer"
                    title="Volt"
                  >
                    ⚡ <span className="text-[10px] font-mono">{activeStoryViewer.reactions.lightning}</span>
                  </button>
                  <button
                    onClick={() => handleReactStory('muscle')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-emerald-600/30 border border-gray-700 hover:border-emerald-500 text-sm hover:scale-110 transition-all cursor-pointer"
                    title="Strength"
                  >
                    💪 <span className="text-[10px] font-mono">{activeStoryViewer.reactions.muscle}</span>
                  </button>
                  <button
                    onClick={() => handleReactStory('boxing')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-[#00F0FF]/30 border border-gray-700 hover:border-[#00F0FF] text-sm hover:scale-110 transition-all cursor-pointer"
                    title="Strike"
                  >
                    🥊 <span className="text-[10px] font-mono">{activeStoryViewer.reactions.boxing}</span>
                  </button>
                  <button
                    onClick={() => handleReactStory('crown')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-purple-600/30 border border-gray-700 hover:border-purple-500 text-sm hover:scale-110 transition-all cursor-pointer"
                    title="Crown"
                  >
                    👑 <span className="text-[10px] font-mono">{activeStoryViewer.reactions.crown || 0}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    soundFX.playStrikeHit();
                    alert(`Workout drill added to your training log! +75 AP earned.`);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-[#FFE600] text-black text-[11px] font-black font-anime shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  JOIN DRILL ⚡
                </button>
              </div>

              {/* Story Comments List & Input */}
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
                <form onSubmit={handleAddStoryComment} className="flex items-center gap-1.5">
                  <input 
                    type="text"
                    value={storyCommentInput}
                    onChange={(e) => setStoryCommentInput(e.target.value)}
                    placeholder={isEs ? 'Escribe un comentario...' : isFr ? 'Écrire un commentaire...' : 'Type a cheer / reaction...'}
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

      {/* MODAL 4: QR CODE PREVIEW MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#0F111E] border-2 border-[#00F0FF] p-6 space-y-6 text-center relative shadow-[0_0_40px_rgba(0,240,255,0.4)]">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-3xl">{club.logoUrl}</span>
              <h3 className="text-xl font-black font-anime text-white">{club.name}</h3>
              <p className="text-xs text-gray-400">Scan to follow club & view daily stories</p>
            </div>

            {/* Stylized QR Box */}
            <div className="w-56 h-56 mx-auto bg-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-2xl">
              <div className="w-full h-full border-4 border-black p-2 flex flex-col items-center justify-center space-y-2">
                <QrCode className="w-32 h-32 text-black" />
                <span className="text-[10px] font-mono font-black text-black">
                  CODE: {club.inviteCode}
                </span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-gray-300">
              {window.location.origin}/#club={club.inviteCode}
            </p>

            <button
              onClick={handleCopyInviteLink}
              className="w-full py-3 rounded-xl bg-[#00F0FF] text-black font-black font-anime text-xs shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'COPIED TO CLIPBOARD!' : 'COPY DIRECT LINK'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: RECRUIT INTERNAL ATHLETES */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#0F111E] border-2 border-[#00F0FF] p-6 md:p-8 space-y-6 relative shadow-[0_0_50px_rgba(0,240,255,0.4)]">
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-2xl font-black font-anime text-white">
                {isEs ? 'RECLUTAR ATLETAS DE LA COMUNIDAD' : isFr ? 'RECRUTER DES ATHLÈTES DE LA COMMUNAUTÉ' : 'RECRUIT COMMUNITY ATHLETES'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isEs ? 'Invita a los mejores guerreros de la plataforma a unirse al roster de tu club.' : isFr ? 'Invitez les meilleurs combattants de la plateforme à rejoindre votre club.' : 'Add verified fighters from YARD300 to train together in your squad.'}
              </p>
            </div>

            {/* List of candidates */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {INITIAL_AVAILABLE_ATHLETES.map((ath) => {
                const isAlreadyIn = club.members.some((m) => m.name === ath.name);
                return (
                  <div 
                    key={ath.id}
                    className="p-3.5 rounded-2xl bg-black/40 border border-gray-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-gray-700 shrink-0">
                        <img 
                          src={ath.avatar} 
                          alt={ath.name}
                          className="w-full h-full object-cover" 
                          onError={handleImageError}
                        />
                      </div>
                      <div>
                        <span className="block text-sm font-black font-anime text-white">{ath.name}</span>
                        <span className="block text-[11px] text-[#FFE600] font-mono">{ath.tier} • {ath.streak}d streak</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddAthlete(ath)}
                      disabled={isAlreadyIn}
                      className={`px-4 py-2 rounded-xl text-xs font-black font-anime transition-all cursor-pointer flex items-center gap-1.5 ${
                        isAlreadyIn
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95'
                      }`}
                    >
                      {isAlreadyIn ? (
                        <span>ALREADY IN SQUAD</span>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>RECRUIT TO CLUB</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-gray-800 flex items-center justify-end">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-anime text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
