/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  RefreshCw, 
  Zap, 
  Flame, 
  ShieldAlert, 
  Trophy, 
  Activity, 
  Sliders, 
  Camera, 
  Volume2, 
  VolumeX, 
  Check, 
  Share2, 
  ArrowRight,
  Sun,
  Eye
} from 'lucide-react';
import { Language } from '../i18n';
import { 
  HERO_IMAGE,
  NINJA_KUNOICHI_IMAGE, 
  SAMURAI_RONIN_IMAGE, 
  VALKYRIE_NEON_IMAGE, 
  TARIK_SAIYAN_IMAGE, 
  handleImageError 
} from '../constants';
import { soundFX } from '../services/soundFX';

export interface AuraVisualizerProps {
  currentLang?: Language;
  onNavigateToProfile?: () => void;
}

type AuraElement = 'cyan' | 'flame' | 'solar' | 'void' | 'prismatic';

interface PresetAvatar {
  id: string;
  name: string;
  nameAr: string;
  url: string;
  rank: string;
}

const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'kunoichi',
    name: 'Ninja Kunoichi Shadow',
    nameAr: 'كونويتشي النينجا كاجي',
    url: NINJA_KUNOICHI_IMAGE,
    rank: 'S-RANK #1'
  },
  {
    id: 'samurai',
    name: 'Cyber Samurai Ronin',
    nameAr: 'ساموراي السايبر رونين',
    url: SAMURAI_RONIN_IMAGE,
    rank: 'S-RANK #2'
  },
  {
    id: 'valkyrie_muay',
    name: 'Valkyrie Blade Striker',
    nameAr: 'فالكييري المحاربة السريعة',
    url: VALKYRIE_NEON_IMAGE,
    rank: 'A-RANK #3'
  },
  {
    id: 'tarik',
    name: 'Tarik Saiyan Overlord',
    nameAr: 'طارق السايان الخارق',
    url: TARIK_SAIYAN_IMAGE,
    rank: 'S-RANK #4'
  }
];

export const AuraVisualizer: React.FC<AuraVisualizerProps> = ({ 
  currentLang = 'en',
  onNavigateToProfile 
}) => {
  const isAr = currentLang === 'ar';

  // State
  const [auraLevel, setAuraLevel] = useState<number>(85);
  const [element, setElement] = useState<AuraElement>('prismatic');
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('aura_custom_avatar') || HERO_IMAGE;
  });
  const [isIgnited, setIsIgnited] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showCopied, setShowCopied] = useState<boolean>(false);
  const [particlesCount, setParticlesCount] = useState<number>(14);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with sound engine
  useEffect(() => {
    setSoundEnabled(soundFX.isEnabled());
  }, []);

  // Sync avatar to localStorage and profile
  const updateAvatar = (newUrl: string) => {
    setAvatarUrl(newUrl);
    try {
      localStorage.setItem('aura_custom_avatar', newUrl);
      localStorage.setItem('aura_profile_avatar', newUrl);
      // Dispatch storage event so other components update if needed
      window.dispatchEvent(new Event('aura_avatar_updated'));
    } catch (e) {
      console.warn('Could not persist avatar to localStorage:', e);
    }
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        updateAvatar(result);
        if (soundEnabled) soundFX.playLevelUp();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Ignite Aura burst
  const handleIgniteAura = () => {
    setIsIgnited(true);
    if (soundEnabled) {
      soundFX.playAuraBurst();
    }
    setTimeout(() => {
      setIsIgnited(false);
    }, 1200);
  };

  // Level slider change
  const handleLevelChange = (newVal: number) => {
    setAuraLevel(newVal);
    if (soundEnabled && Math.abs(newVal - auraLevel) >= 5) {
      soundFX.playAuraSurge();
    }
  };

  // Sync with live fitness stats
  const handleSyncFitness = () => {
    // Generate an elevated power level based on combat engine stats
    const simulatedAura = Math.min(100, Math.floor(75 + Math.random() * 25));
    setAuraLevel(simulatedAura);
    if (soundEnabled) soundFX.playLevelUp();
    handleIgniteAura();
  };

  // Share / Copy badge
  const handleShareBadge = () => {
    const text = isAr 
      ? `⚡ هالة طاقتي القتالية في YARD 300 بلغت المستوى ${auraLevel}% (${getRankTitle(auraLevel, isAr)})! هل تجرؤ على منافستي؟`
      : `⚡ My Aura Energy Level on YARD 300 reached ${auraLevel}% (${getRankTitle(auraLevel, isAr)})! Can you match my power?`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2500);
    }
  };

  // Color mappings for elements
  const elementStyles: Record<AuraElement, {
    name: string;
    nameAr: string;
    glowColor: string;
    borderGlow: string;
    gradient: string;
    bgRing: string;
    badgeColor: string;
  }> = {
    cyan: {
      name: 'Bio-Cyan Lightning',
      nameAr: 'برق النيون الحيوي',
      glowColor: 'rgba(0, 240, 255, 0.8)',
      borderGlow: '#00F0FF',
      gradient: 'from-[#00F0FF] via-[#0077FF] to-[#7000FF]',
      bgRing: 'rgba(0, 240, 255, 0.25)',
      badgeColor: 'text-[#00F0FF] border-[#00F0FF]'
    },
    flame: {
      name: 'Titan Crimson Flame',
      nameAr: 'لهب التيتان القرمزي',
      glowColor: 'rgba(255, 0, 122, 0.85)',
      borderGlow: '#FF007A',
      gradient: 'from-[#FF007A] via-[#FF3300] to-[#7000FF]',
      bgRing: 'rgba(255, 0, 122, 0.25)',
      badgeColor: 'text-[#FF007A] border-[#FF007A]'
    },
    solar: {
      name: 'Solar Gold Saiyan',
      nameAr: 'الذهب الشمسي السايان',
      glowColor: 'rgba(255, 230, 0, 0.9)',
      borderGlow: '#FFE600',
      gradient: 'from-[#FFE600] via-[#FF9900] to-[#FF0055]',
      bgRing: 'rgba(255, 230, 0, 0.3)',
      badgeColor: 'text-[#FFE600] border-[#FFE600]'
    },
    void: {
      name: 'Cosmic Void Recovery',
      nameAr: 'فراغ السديم الكوني',
      glowColor: 'rgba(112, 0, 255, 0.85)',
      borderGlow: '#7000FF',
      gradient: 'from-[#7000FF] via-[#9D00FF] to-[#00F0FF]',
      bgRing: 'rgba(112, 0, 255, 0.3)',
      badgeColor: 'text-[#9D00FF] border-[#9D00FF]'
    },
    prismatic: {
      name: 'Prismatic Overdrive',
      nameAr: 'الطيف الكروماتي الخارق',
      glowColor: 'rgba(0, 240, 255, 0.95)',
      borderGlow: '#00F0FF',
      gradient: 'from-[#FF007A] via-[#FFE600] to-[#00F0FF]',
      bgRing: 'rgba(255, 0, 122, 0.35)',
      badgeColor: 'text-white border-[#FFE600]'
    }
  };

  const currentTheme = elementStyles[element];

  // Dynamic calculations based on aura level
  const energyIntensity = auraLevel / 100;
  const pulseSpeed = Math.max(0.8, 3 - energyIntensity * 1.8); // faster pulse at high level
  const shockwaveCount = auraLevel > 70 ? 3 : auraLevel > 40 ? 2 : 1;

  // Render particles
  const particles = Array.from({ length: particlesCount }).map((_, i) => {
    const angle = (i / particlesCount) * 360;
    const driftX = Math.sin(angle) * (30 + Math.random() * 40);
    const delay = (i * 0.2).toFixed(1);
    const size = Math.floor(4 + (i % 4) * 3);
    return (
      <span
        key={i}
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: '20%',
          left: `${40 + (i % 5) * 5}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: i % 2 === 0 ? currentTheme.borderGlow : '#FFFFFF',
          boxShadow: `0 0 10px ${currentTheme.borderGlow}`,
          animation: `aura-ember-rise ${1.6 + (i % 3) * 0.4}s ease-in infinite ${delay}s`,
          ['--ember-drift' as any]: `${driftX}px`,
          opacity: 0.85
        }}
      />
    );
  });

  return (
    <section 
      id="aura-visualizer" 
      className="py-20 px-3 sm:px-4 md:px-10 bg-[#0A0B10] relative w-full max-w-full overflow-hidden overflow-x-hidden"
    >
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-cyber-grid opacity-15 pointer-events-none"></div>

      {/* Atmospheric Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-20"
        style={{ backgroundColor: currentTheme.borderGlow }}
      ></div>

      <div className="max-w-[1600px] w-full max-w-full overflow-x-hidden mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141622] text-xs font-black text-[#00F0FF] font-anime shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Sparkles className="w-4 h-4 animate-spin text-[#FFE600]" style={{ animationDuration: '6s' }} />
            <span>{isAr ? '⚡ محرك تحليل وتجسيد الهالة' : '⚡ INTERACTIVE AURA VISUALIZER'}</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black font-anime text-white tracking-tight">
            {isAr ? 'مُحلل ' : 'DYNAMIC '}<span className="text-[#FFE600]">{isAr ? 'هالة الطاقة الحيوية' : 'AURA VISUALIZER'}</span>
          </h2>

          <p className="max-w-2xl text-gray-300 font-bold text-base md:text-lg leading-relaxed">
            {isAr
              ? 'ارفع شخصيتك المفضلة وشاهد مجال الطاقة الحركي وهو يتحول ويتوهج بألوان طيفية ديناميكية تعكس مستوى لياقتك وقوتك القتالية!'
              : 'Upload your character or avatar to overlay a dynamic, color-shifting energy field engineered with CSS animations representing your real-time fitness Aura Level!'}
          </p>
        </div>

        {/* Main Grid: Visualizer Stage + Interactive Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-full">
          
          {/* ============================================================== */}
          {/* LEFT: THE AURA VISUALIZER STAGE (COL 7) */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Visualizer Canvas Card - Borderless */}
            <div className={`w-full max-w-[620px] aspect-square rounded-3xl bg-[#12131C] p-6 md:p-10 relative flex flex-col items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 ${
              isIgnited ? 'animate-combat-shake shadow-[0_0_60px_#FFE600]' : ''
            }`}>
              
              {/* Speedlines Overlay */}
              <div className="absolute inset-0 bg-speedlines opacity-20 pointer-events-none"></div>

              {/* Ambient Circular Aura Gradients */}
              <div 
                className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-[70px] pointer-events-none transition-all duration-500 opacity-60 ${
                  element === 'prismatic' ? 'animate-aura-hue' : ''
                }`}
                style={{
                  background: `radial-gradient(circle, ${currentTheme.glowColor} 0%, rgba(0,0,0,0) 70%)`
                }}
              ></div>

              {/* Shockwave Rings (CSS Animation) */}
              <div 
                className="absolute w-72 h-72 md:w-88 md:h-88 rounded-full border-2 pointer-events-none animate-aura-shockwave-1"
                style={{ borderColor: currentTheme.borderGlow }}
              ></div>

              {shockwaveCount >= 2 && (
                <div 
                  className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full border pointer-events-none animate-aura-shockwave-2"
                  style={{ borderColor: currentTheme.borderGlow }}
                ></div>
              )}

              {/* Rotating Rune Ring (Clockwise) */}
              <div 
                className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-dashed pointer-events-none opacity-40 animate-aura-spin-cw"
                style={{ 
                  borderColor: currentTheme.borderGlow,
                  animationDuration: `${Math.max(4, 14 - energyIntensity * 8)}s`
                }}
              ></div>

              {/* Rotating Rune Ring (Counter-Clockwise Inner) */}
              <div 
                className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full border border-dotted pointer-events-none opacity-50 animate-aura-spin-ccw"
                style={{ 
                  borderColor: '#FFFFFF',
                  animationDuration: `${Math.max(3, 10 - energyIntensity * 6)}s`
                }}
              ></div>

              {/* Organic Morphing Plasma Flame Shield */}
              <div 
                className={`absolute w-64 h-64 md:w-80 md:h-80 pointer-events-none animate-aura-plasma transition-all ${
                  element === 'prismatic' ? 'animate-aura-hue' : ''
                }`}
                style={{
                  background: `radial-gradient(circle, ${currentTheme.glowColor} 20%, rgba(255,255,255,0.15) 50%, rgba(0,0,0,0) 75%)`,
                  filter: `blur(${12 - energyIntensity * 4}px) brightness(${1 + energyIntensity * 0.6})`,
                  animationDuration: `${pulseSpeed * 1.5}s`,
                  opacity: 0.75 + energyIntensity * 0.25
                }}
              ></div>

              {/* Rising Energy Embers */}
              {particles}

              {/* Electric Strike Flash (when Level > 50) */}
              {auraLevel >= 50 && (
                <div 
                  className="absolute inset-0 pointer-events-none animate-aura-lightning opacity-60"
                  style={{
                    background: `radial-gradient(circle, transparent 40%, ${currentTheme.borderGlow} 90%)`,
                    mixBlendMode: 'screen'
                  }}
                ></div>
              )}

              {/* Burst Shockwave Effect upon Ignite */}
              {isIgnited && (
                <div 
                  className="absolute inset-0 rounded-full border-8 border-white pointer-events-none animate-burst-flare z-30"
                  style={{ borderColor: currentTheme.borderGlow }}
                ></div>
              )}

              {/* ========================================================== */}
              {/* THE CHARACTER / AVATAR CONTAINER */}
              {/* ========================================================== */}
              <div 
                className={`relative z-20 w-44 h-44 md:w-60 md:h-60 rounded-3xl overflow-hidden p-1 transition-transform duration-300 ${
                  auraLevel >= 90 ? 'scale-105' : 'scale-100'
                }`}
                style={{
                  boxShadow: `0 0 ${25 + energyIntensity * 35}px ${currentTheme.glowColor}, inset 0 0 15px rgba(255,255,255,0.3)`
                }}
              >
                {/* Clean Borderless Character Avatar Container */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden bg-[#0A0B10]">
                  <div className="w-full h-full rounded-3xl overflow-hidden relative">
                    
                    {/* Character Avatar Image */}
                    <img loading="lazy" decoding="async" 
                      src={avatarUrl} 
                      alt="Uploaded Character Avatar" 
                      onError={handleImageError}
                      className={`w-full h-full object-cover object-center transition-all duration-500 ${
                        isIgnited ? 'brightness-125 contrast-125 scale-105' : 'hover:scale-105'
                      }`}
                    />

                    {/* Aura Energy Glow Overlay on Avatar Silhouette */}
                    <div 
                      className={`absolute inset-0 pointer-events-none mix-blend-screen opacity-40 transition-opacity duration-300 ${
                        element === 'prismatic' ? 'animate-aura-hue' : ''
                      }`}
                      style={{
                        background: `linear-gradient(to top, ${currentTheme.borderGlow} 0%, transparent 60%)`
                      }}
                    ></div>

                    {/* S-Rank Tier Badge in Avatar */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center z-10 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-md bg-[#0A0B10]/90 backdrop-blur-md text-[10px] font-black text-[#FFE600] border border-[#FFE600]/40 font-anime shadow-[0_0_10px_#FFE600]">
                        {getRankBadge(auraLevel)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#FF007A]/90 backdrop-blur-md text-[9px] font-black text-white font-anime">
                        LVL {auraLevel}
                      </span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Bottom Quick Controls over Stage */}
              <div className="absolute bottom-4 inset-x-6 flex items-center justify-between z-20">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1D1F30]/90 hover:bg-[#FF007A] text-white border border-gray-700 hover:border-[#FF007A] text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md shadow-lg"
                  title="Upload New Character"
                >
                  <Camera className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>{isAr ? 'تغيير الصورة' : 'Change Avatar'}</span>
                </button>

                <button
                  onClick={handleIgniteAura}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-anime text-white transition-all flex items-center gap-1.5 shadow-[0_0_20px_#FF007A] ${
                    isIgnited 
                      ? 'bg-[#FFE600] text-black scale-110 shadow-[0_0_30px_#FFE600]' 
                      : 'bg-gradient-to-r from-[#FF007A] to-[#7000FF] hover:from-[#FF007A] hover:to-[#00F0FF]'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${isIgnited ? 'animate-bounce text-black' : 'text-[#FFE600]'}`} />
                  <span>{isAr ? 'تفجير الهالة! ⚡' : 'IGNITE AURA! ⚡'}</span>
                </button>

                <button
                  onClick={() => {
                    const toggled = soundFX.toggleSound();
                    setSoundEnabled(toggled);
                  }}
                  className="p-2 rounded-xl bg-[#1D1F30]/90 text-gray-300 hover:text-white border border-gray-700 hover:border-[#00F0FF] transition-all backdrop-blur-md"
                  title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00F0FF]" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
                </button>
              </div>

            </div>

            {/* Stage Footer Status */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-ping bg-[#00F0FF]"></span>
                <span className="text-gray-300">{isAr ? 'تردد التذبذب:' : 'Resonance:'}</span>
                <span className="text-[#00F0FF] font-anime">{pulseSpeed.toFixed(1)}s CSS Loop</span>
              </span>
              <span>•</span>
              <span className="text-gray-300">{isAr ? 'عنصر الهالة:' : 'Element:'}</span>
              <span className="text-[#FFE600] font-anime">{isAr ? currentTheme.nameAr : currentTheme.name}</span>
            </div>

          </div>

          {/* ============================================================== */}
          {/* RIGHT: INTERACTIVE DASHBOARD & CONTROLS (COL 5) */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Aura Level Slider & Presets Card */}
            <div className="bg-[#12131C] rounded-2xl p-6 border border-gray-800 hover:border-[#00F0FF]/40 transition-all shadow-xl space-y-5">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#FFE600]" />
                  <h3 className="text-lg font-black font-anime text-white">
                    {isAr ? 'مستوى شحن الهالة' : 'Aura Power Level'}
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#1D1F30] border border-[#00F0FF] text-sm font-black font-anime text-[#00F0FF]">
                  {auraLevel}%
                </div>
              </div>

              {/* Slider Track */}
              <div className="space-y-2">
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={auraLevel}
                  onChange={(e) => handleLevelChange(parseInt(e.target.value, 10))}
                  className="w-full h-3 bg-[#1D1F30] rounded-lg appearance-none cursor-pointer accent-[#FF007A] transition-all"
                />
                <div className="flex justify-between text-[11px] font-bold text-gray-500">
                  <span>1% {isAr ? 'يقظة' : 'Awakened'}</span>
                  <span>50% {isAr ? 'محارب' : 'Warrior'}</span>
                  <span>75% {isAr ? 'بطل' : 'Champion'}</span>
                  <span className="text-[#FFE600]">100% {isAr ? 'أوفر درايف' : 'Overdrive'}</span>
                </div>
              </div>

              {/* Quick Level Presets */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { lvl: 25, label: '25% AWK' },
                  { lvl: 50, label: '50% SURG' },
                  { lvl: 75, label: '75% S-RANK' },
                  { lvl: 100, label: '100% GOD' },
                ].map(preset => (
                  <button
                    key={preset.lvl}
                    onClick={() => handleLevelChange(preset.lvl)}
                    className={`py-2 rounded-xl text-xs font-black font-anime transition-all ${
                      auraLevel === preset.lvl
                        ? 'bg-[#10B981] text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : 'bg-[#181A28] text-gray-400 hover:text-white hover:bg-[#202236]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Calculated Kinetic Output Stats */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800">
                <div className="bg-[#181A28] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'الطاقة الحركية' : 'Power (Watts)'}</span>
                  <span className="text-sm font-black font-anime text-[#00F0FF]">{Math.floor(auraLevel * 9.5)}W</span>
                </div>
                <div className="bg-[#181A28] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'قوة اللكمة' : 'Strike (PSI)'}</span>
                  <span className="text-sm font-black font-anime text-[#FF007A]">{Math.floor(auraLevel * 12.8)}</span>
                </div>
                <div className="bg-[#181A28] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'مؤشر التعافي' : 'HRV Recovery'}</span>
                  <span className="text-sm font-black font-anime text-[#FFE600]">{Math.min(99, Math.floor(auraLevel * 0.95))}%</span>
                </div>
              </div>

            </div>

            {/* 2. Aura Element Selector Card */}
            <div className="bg-[#12131C] rounded-2xl p-6 border border-gray-800 hover:border-[#FF007A]/40 transition-all shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FF007A]" />
                <h3 className="text-lg font-black font-anime text-white">
                  {isAr ? 'طيف وعنصر الطاقة' : 'Aura Energy Element'}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(Object.keys(elementStyles) as AuraElement[]).map((elemKey) => {
                  const item = elementStyles[elemKey];
                  const isSelected = element === elemKey;
                  return (
                    <button
                      key={elemKey}
                      onClick={() => {
                        setElement(elemKey);
                        if (soundEnabled) soundFX.playButtonClick();
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        isSelected 
                          ? 'bg-[#181A28] border-2 shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-102' 
                          : 'bg-[#141622] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                      }`}
                      style={{
                        borderColor: isSelected ? item.borderGlow : undefined
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span 
                          className="w-3.5 h-3.5 rounded-full shadow-md"
                          style={{ backgroundColor: item.borderGlow }}
                        ></span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-xs font-black text-white font-anime truncate">
                        {isAr ? item.nameAr : item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Upload & Preset Character Gallery */}
            <div className="bg-[#12131C] rounded-2xl p-6 border border-gray-800 hover:border-[#FFE600]/40 transition-all shadow-xl space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#00F0FF]" />
                  <h3 className="text-lg font-black font-anime text-white">
                    {isAr ? 'شخصية البطل / الأفتار' : 'Character & Avatar'}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-gray-400">
                  {isAr ? 'يدعم السحب والإفلات' : 'Drag & drop ready'}
                </span>
              </div>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              {/* Dropzone Area */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex items-center justify-center gap-3 ${
                  isDragging 
                    ? 'border-[#00F0FF] bg-[#00F0FF]/10 scale-102' 
                    : 'border-gray-700 hover:border-[#FF007A] bg-[#141622]/60 hover:bg-[#141622]'
                }`}
              >
                <Upload className="w-5 h-5 text-[#FF007A]" />
                <div className="text-xs text-gray-300 font-bold">
                  <span>{isAr ? 'اضغط لرفع صورة من جهازك' : 'Click to browse image'}</span>
                  <span className="text-gray-500 block text-[10px] mt-0.5">{isAr ? 'PNG أو JPG أو WEBP' : 'PNG, JPG, or WEBP'}</span>
                </div>
              </div>

              {/* Preset Characters */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-400 block">
                  {isAr ? 'أو اختر من أبطال أورا المعتمدين:' : 'Or choose from Aura Champion presets:'}
                </span>

                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => updateAvatar(preset.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all group ${
                        avatarUrl === preset.url 
                          ? 'shadow-[0_0_15px_#00F0FF] scale-105' 
                          : 'opacity-85 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <img loading="lazy" decoding="async" 
                        src={preset.url} 
                        alt={preset.name} 
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                        <span className="text-[9px] font-black text-white truncate font-anime w-full text-center">
                          {isAr ? preset.nameAr : preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Sync Fitness & Share */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSyncFitness}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#1D1F30] hover:bg-[#00F0FF] hover:text-black border border-[#00F0FF]/50 text-[#00F0FF] text-xs font-black font-anime transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Activity className="w-4 h-4" />
                  <span>{isAr ? 'مزامنة مع مؤشرات القتال' : 'Sync Fitness Stats'}</span>
                </button>

                <button
                  onClick={handleShareBadge}
                  className="px-4 py-2.5 rounded-xl bg-[#181A28] hover:bg-[#FF007A] text-white border border-gray-700 hover:border-[#FF007A] text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{showCopied ? (isAr ? 'تم النسخ! ✓' : 'Copied! ✓') : (isAr ? 'مشاركة الهالة' : 'Share Aura')}</span>
                </button>
              </div>

              {/* Link to Athlete Profile */}
              {onNavigateToProfile && (
                <div className="pt-1 text-center">
                  <button
                    onClick={onNavigateToProfile}
                    className="text-xs font-bold text-[#FFE600] hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'عرض ملف الرياضي الكامل وتطبيق الهالة' : 'View Full Athlete Profile with Aura'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

// Helper to determine Rank title based on level
function getRankTitle(level: number, isAr: boolean): string {
  if (level >= 95) return isAr ? 'أوفر درايف الأسطوري (SSS-Rank)' : 'Cosmic Overdrive (SSS-Rank)';
  if (level >= 80) return isAr ? 'بطل خارق إلهي (S-Rank)' : 'God-Tier Champion (S-Rank)';
  if (level >= 60) return isAr ? 'محارب متمرس (A-Rank)' : 'Elite Warrior (A-Rank)';
  if (level >= 35) return isAr ? 'طاقة متفجرة (B-Rank)' : 'Kinetic Surge (B-Rank)';
  return isAr ? 'مبتدئ يقظ (D-Rank)' : 'Awakened Neophyte (D-Rank)';
}

function getRankBadge(level: number): string {
  if (level >= 95) return 'SSS-RANK OVERDRIVE';
  if (level >= 80) return 'S-RANK CHAMPION';
  if (level >= 60) return 'A-RANK WARRIOR';
  if (level >= 35) return 'B-RANK SURGE';
  return 'D-RANK AWAKENED';
}

export default AuraVisualizer;
