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
import { Language, tr } from '../i18n';
import {
  HERO_IMAGE,
  FOUNDER_MTK_IMAGE,
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
    id: 'mtk',
    name: 'M.T.K · Pilates Elite',
    nameAr: 'M.T.K · نخبة البيلاتس',
    url: FOUNDER_MTK_IMAGE,
    rank: 'S-RANK #1'
  },
  {
    id: 'kenji',
    name: 'Kenji Sato · Kinetic Striker',
    nameAr: 'كينجي ساتو · القوة الحركية',
    url: '/images/ai_human_aerial_male.jpg',
    rank: 'S-RANK #2'
  },
  {
    id: 'victor',
    name: 'Victor Kael · Tactical Pro',
    nameAr: 'فيكتور كايل · التحمل التكتيكي',
    url: '/images/ai_human_tactical_male.jpg',
    rank: 'S-RANK #3'
  },
  {
    id: 'elena',
    name: 'Elena Lin · Velocity Sprint',
    nameAr: 'إيلينا لين · السرعة القصوى',
    url: '/images/ai_human_valkyrie_female.jpg',
    rank: 'A-RANK #4'
  },
  {
    id: 'darius',
    name: 'Darius Cole · Heavyweight',
    nameAr: 'داريوس كول · القوة الضاربة',
    url: '/images/ai_human_heavyweight_boxer.jpg',
    rank: 'S-RANK #5'
  }
];

export const AuraVisualizer: React.FC<AuraVisualizerProps> = ({ 
  currentLang: propLang = 'en',
  onNavigateToProfile 
}) => {
  const currentLang = propLang as Language;
  const isAr = currentLang === 'ar';

  // State
  const [auraLevel, setAuraLevel] = useState<number>(85);
  const [element, setElement] = useState<AuraElement>('prismatic');
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    const saved = localStorage.getItem('aura_custom_avatar');
    if (!saved || /anime_|cyber_|boxing_|tarik_|ninja_|ren_flame/.test(saved)) {
      return HERO_IMAGE;
    }
    return saved;
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
    const text = tr(currentLang, {
      en: `⚡ My Aura Energy Level on YARD 300 reached ${auraLevel}% (${getRankTitle(auraLevel, currentLang)})!`,
      es: `⚡ ¡Mi Nivel de Energía Aura en YARD 300 alcanzó el ${auraLevel}% (${getRankTitle(auraLevel, currentLang)})!`,
      fr: `⚡ Mon Niveau d’Énergie Aura sur YARD 300 a atteint ${auraLevel}% (${getRankTitle(auraLevel, currentLang)}) !`,
      ar: `⚡ هالة طاقتي القتالية في YARD 300 بلغت المستوى ${auraLevel}% (${getRankTitle(auraLevel, currentLang)})!`
    });
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2500);
    }
  };

  // Color mappings for elements
  const elementStyles: Record<AuraElement, {
    name: string;
    nameEs: string;
    nameFr: string;
    nameAr: string;
    glowColor: string;
    borderGlow: string;
    gradient: string;
    bgRing: string;
    badgeColor: string;
  }> = {
    cyan: {
      name: 'Bio-Cyan Lightning',
      nameEs: 'Rayo Bio-Cian',
      nameFr: 'Éclair Bio-Cyan',
      nameAr: 'برق النيون الحيوي',
      glowColor: 'rgba(0, 240, 255, 0.8)',
      borderGlow: '#00F0FF',
      gradient: 'from-[#00F0FF] via-[#0077FF] to-[#7000FF]',
      bgRing: 'rgba(0, 240, 255, 0.25)',
      badgeColor: 'text-[#00F0FF] border-[#00F0FF]'
    },
    flame: {
      name: 'Titan Crimson Flame',
      nameEs: 'Llama Carmesí Titán',
      nameFr: 'Flamme Pourpre Titan',
      nameAr: 'لهب التيتان القرمزي',
      glowColor: 'rgba(255, 0, 122, 0.85)',
      borderGlow: '#FF007A',
      gradient: 'from-[#FF007A] via-[#FF3300] to-[#7000FF]',
      bgRing: 'rgba(255, 0, 122, 0.25)',
      badgeColor: 'text-[#FF007A] border-[#FF007A]'
    },
    solar: {
      name: 'Solar Gold Overdrive',
      nameEs: 'Oro Solar Overdrive',
      nameFr: 'Or Solaire Overdrive',
      nameAr: 'الذهب الشمسي الخارق',
      glowColor: 'rgba(255, 230, 0, 0.9)',
      borderGlow: '#FFE600',
      gradient: 'from-[#FFE600] via-[#FF9900] to-[#FF0055]',
      bgRing: 'rgba(255, 230, 0, 0.3)',
      badgeColor: 'text-[#FFE600] border-[#FFE600]'
    },
    void: {
      name: 'Cosmic Void Recovery',
      nameEs: 'Recuperación Vacío Cósmico',
      nameFr: 'Récupération Néant Cosmique',
      nameAr: 'فراغ السديم الكوني',
      glowColor: 'rgba(112, 0, 255, 0.85)',
      borderGlow: '#7000FF',
      gradient: 'from-[#7000FF] via-[#9D00FF] to-[#00F0FF]',
      bgRing: 'rgba(112, 0, 255, 0.3)',
      badgeColor: 'text-[#9D00FF] border-[#9D00FF]'
    },
    prismatic: {
      name: 'Prismatic Overdrive',
      nameEs: 'Sobrecarga Prismática',
      nameFr: 'Overdrive Prismatique',
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
      className="py-20 px-3 sm:px-4 md:px-10 bg-[#07080C] relative w-full max-w-full overflow-hidden overflow-x-hidden"
    >

      {/* Atmospheric Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-20"
        style={{ backgroundColor: currentTheme.borderGlow }}
      ></div>

      <div className="max-w-[1600px] w-full max-w-full overflow-x-hidden mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141622] text-xs font-black text-[#00F0FF] font-anime shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Sparkles className="w-4 h-4 text-[#FFE600]" />
            <span>
              {tr(currentLang, {
                en: '⚡ INTERACTIVE AURA VISUALIZER',
                es: '⚡ VISUALIZADOR INTERACTIVO DE AURA',
                fr: '⚡ VISUALISEUR D’AURA INTERACTIF',
                ar: '⚡ محرك تحليل وتجسيد الهالة'
              })}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black font-anime text-white tracking-tight">
            {tr(currentLang, {
              en: 'DYNAMIC AURA VISUALIZER',
              es: 'VISUALIZADOR DINÁMICO DE AURA',
              fr: 'VISUALISEUR D’AURA DYNAMIQUE',
              ar: 'مُحلل هالة الطاقة الحيوية'
            })}
          </h2>

          <p className="max-w-2xl text-gray-300 font-bold text-base md:text-lg leading-relaxed">
            {tr(currentLang, {
              en: 'Upload your character or avatar to overlay a dynamic, color-shifting energy field engineered to represent your real-time fitness Aura Level!',
              es: 'Sube tu avatar para proyectar un campo energético dinámico que refleja en tiempo real tu nivel físico Aura.',
              fr: 'Importez votre avatar pour projeter un champ énergétique dynamique reflétant en direct votre niveau de puissance Aura.',
              ar: 'ارفع شخصيتك المفضلة وشاهد مجال الطاقة الحركي وهو يتحول ويتوهج بألوان طيفية ديناميكية تعكس مستوى لياقتك وقوتك القتالية!'
            })}
          </p>
        </div>

        {/* Main Grid: Visualizer Stage + Interactive Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-full">
          
          {/* ============================================================== */}
          {/* LEFT: THE AURA VISUALIZER STAGE (COL 7) */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div className={`w-full max-w-[620px] aspect-square rounded-3xl bg-[#0C0E14] border border-white/[0.08] p-6 md:p-10 relative flex flex-col items-center justify-center overflow-hidden shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
              isIgnited ? 'shadow-[0_0_50px_rgba(212,175,55,0.45)]' : ''
            }`}>

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
                  className="px-3.5 py-1.5 rounded-xl bg-[#1D1F30]/90 hover:bg-[#FF007A] text-white border border-gray-700 hover:border-[#FF007A] text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md shadow-lg cursor-pointer"
                  title={tr(currentLang, { en: 'Upload New Character', es: 'Subir Avatar', fr: 'Importer Avatar', ar: 'رفع صورة جديدة' })}
                >
                  <Camera className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>{tr(currentLang, { en: 'Change Avatar', es: 'Cambiar Avatar', fr: 'Changer Avatar', ar: 'تغيير الصورة' })}</span>
                </button>

                <button
                  onClick={handleIgniteAura}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-anime text-white transition-all flex items-center gap-1.5 shadow-[0_0_20px_#FF007A] cursor-pointer ${
                    isIgnited 
                      ? 'bg-[#FFE600] text-black scale-110 shadow-[0_0_30px_#FFE600]' 
                      : 'bg-gradient-to-r from-[#FF007A] to-[#7000FF] hover:from-[#FF007A] hover:to-[#00F0FF]'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${isIgnited ? 'animate-bounce text-black' : 'text-[#FFE600]'}`} />
                  <span>{tr(currentLang, { en: 'IGNITE AURA! ⚡', es: '¡ACTIVAR AURA! ⚡', fr: 'ACTIVER L’AURA ! ⚡', ar: 'تفجير الهالة! ⚡' })}</span>
                </button>

                <button
                  onClick={() => {
                    const toggled = soundFX.toggleSound();
                    setSoundEnabled(toggled);
                  }}
                  className="p-2 rounded-xl bg-[#1D1F30]/90 text-gray-300 hover:text-white border border-gray-700 hover:border-[#00F0FF] transition-all backdrop-blur-md cursor-pointer"
                  title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00F0FF]" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
                </button>
              </div>

            </div>

            {/* Stage Footer Status */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="text-slate-300">{tr(currentLang, { en: 'Resonance:', es: 'Resonancia:', fr: 'Résonance :', ar: 'تردد الرنين:' })}</span>
                <span className="text-[#D4AF37] font-mono">{pulseSpeed.toFixed(1)}s</span>
              </span>
              <span>•</span>
              <span className="text-gray-300">{tr(currentLang, { en: 'Element:', es: 'Elemento:', fr: 'Élément :', ar: 'عنصر الهالة:' })}</span>
              <span className="text-[#FFE600] font-anime">
                {tr(currentLang, { en: currentTheme.name, es: currentTheme.nameEs, fr: currentTheme.nameFr, ar: currentTheme.nameAr })}
              </span>
            </div>

          </div>

          {/* RIGHT: INTERACTIVE DASHBOARD & CONTROLS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Aura Level Slider & Presets Card */}
            <div className="bg-[#12131C] rounded-2xl p-6 border border-gray-800 hover:border-[#00F0FF]/40 transition-all shadow-xl space-y-5">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#FFE600]" />
                  <h3 className="text-lg font-black font-anime text-white">
                    {tr(currentLang, { en: 'Aura Power Level', es: 'Nivel de Poder Aura', fr: 'Niveau de Puissance Aura', ar: 'مستوى شحن الهالة' })}
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
                  className="w-full h-3 bg-[#1D1F30] rounded-lg appearance-none cursor-pointer accent-[#10B981] transition-all"
                />
                <div className="flex justify-between text-[11px] font-bold text-gray-500">
                  <span>1% {tr(currentLang, { en: 'Awakened', es: 'Despierto', fr: 'Éveillé', ar: 'يقظة' })}</span>
                  <span>50% {tr(currentLang, { en: 'Warrior', es: 'Guerrero', fr: 'Guerrier', ar: 'محارب' })}</span>
                  <span>75% {tr(currentLang, { en: 'Champion', es: 'Campeón', fr: 'Champion', ar: 'بطل' })}</span>
                  <span className="text-[#FFE600]">100% {tr(currentLang, { en: 'Overdrive', es: 'Sobrecarga', fr: 'Overdrive', ar: 'أوفر درايف' })}</span>
                </div>
              </div>

              {/* Quick Level Presets */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { lvl: 25, label: '25% AWK' },
                  { lvl: 50, label: '50% SURG' },
                  { lvl: 75, label: '75% S-RANK' },
                  { lvl: 100, label: '100% APEX' },
                ].map(preset => (
                  <button
                    key={preset.lvl}
                    onClick={() => handleLevelChange(preset.lvl)}
                    className={`py-2 rounded-xl text-xs font-black font-anime transition-all cursor-pointer ${
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
                  <span className="text-[10px] text-gray-400 block font-bold">{tr(currentLang, { en: 'Power (Watts)', es: 'Potencia (W)', fr: 'Puissance (W)', ar: 'الطاقة الحركية' })}</span>
                  <span className="text-sm font-black font-anime text-[#00F0FF]">{Math.floor(auraLevel * 9.5)}W</span>
                </div>
                <div className="bg-[#181A28] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 block font-bold">{tr(currentLang, { en: 'Strike (PSI)', es: 'Impacto (PSI)', fr: 'Frappe (PSI)', ar: 'قوة اللكمة' })}</span>
                  <span className="text-sm font-black font-anime text-[#FF007A]">{Math.floor(auraLevel * 12.8)}</span>
                </div>
                <div className="bg-[#181A28] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 block font-bold">{tr(currentLang, { en: 'HRV Recovery', es: 'Recuperación VFC', fr: 'Récupération VFC', ar: 'مؤشر التعافي' })}</span>
                  <span className="text-sm font-black font-anime text-[#FFE600]">{Math.min(99, Math.floor(auraLevel * 0.95))}%</span>
                </div>
              </div>

            </div>

            {/* 2. Aura Element Selector Card */}
            <div className="bg-[#12131C] rounded-2xl p-6 border border-gray-800 hover:border-[#FF007A]/40 transition-all shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FF007A]" />
                <h3 className="text-lg font-black font-anime text-white">
                  {tr(currentLang, { en: 'Aura Energy Element', es: 'Elemento de Energía', fr: 'Élément d’Énergie', ar: 'طيف وعنصر الطاقة' })}
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
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
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
                        {tr(currentLang, { en: item.name, es: item.nameEs, fr: item.nameFr, ar: item.nameAr })}
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
                    {tr(currentLang, { en: 'Character & Avatar', es: 'Atleta y Avatar', fr: 'Athlète & Avatar', ar: 'شخصية البطل / الأفتار' })}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-gray-400">
                  {tr(currentLang, { en: 'Drag & drop ready', es: 'Arrastrar y soltar', fr: 'Glisser-déposer prêt', ar: 'يدعم السحب والإفلات' })}
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
                  <span>{tr(currentLang, { en: 'Click to browse image', es: 'Clic para subir imagen', fr: 'Cliquer pour importer', ar: 'اضغط لرفع صورة من جهازك' })}</span>
                  <span className="text-gray-500 block text-[10px] mt-0.5">PNG, JPG, WEBP</span>
                </div>
              </div>

              {/* Preset Characters */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-400 block">
                  {tr(currentLang, { en: 'Or choose from Aura Champion presets:', es: 'O elige entre nuestros campeones:', fr: 'Ou choisissez un champion YARD :', ar: 'أو اختر من أبطال أورا المعتمدين:' })}
                </span>

                <div className="grid grid-cols-5 gap-2">
                  {PRESET_AVATARS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => updateAvatar(preset.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all group cursor-pointer ${
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
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#1D1F30] hover:bg-[#00F0FF] hover:text-black border border-[#00F0FF]/50 text-[#00F0FF] text-xs font-black font-anime transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Activity className="w-4 h-4" />
                  <span>{tr(currentLang, { en: 'Sync Fitness Stats', es: 'Sincronizar Datos', fr: 'Synchroniser Stats', ar: 'مزامنة مع مؤشرات القتال' })}</span>
                </button>

                <button
                  onClick={handleShareBadge}
                  className="px-4 py-2.5 rounded-xl bg-[#181A28] hover:bg-[#FF007A] text-white border border-gray-700 hover:border-[#FF007A] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>
                    {showCopied
                      ? tr(currentLang, { en: 'Copied! ✓', es: '¡Copiado! ✓', fr: 'Copié ! ✓', ar: 'تم النسخ! ✓' })
                      : tr(currentLang, { en: 'Share Aura', es: 'Compartir Aura', fr: 'Partager Aura', ar: 'مشاركة الهالة' })}
                  </span>
                </button>
              </div>

              {/* Link to Athlete Profile */}
              {onNavigateToProfile && (
                <div className="pt-1 text-center">
                  <button
                    onClick={onNavigateToProfile}
                    className="text-xs font-bold text-[#FFE600] hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {tr(currentLang, {
                        en: 'View Full Athlete Profile with Aura',
                        es: 'Ver Perfil Atlético Completo con Aura',
                        fr: 'Voir le Profil Athlète Complet avec Aura',
                        ar: 'عرض ملف الرياضي الكامل وتطبيق الهالة'
                      })}
                    </span>
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
function getRankTitle(level: number, lang: Language): string {
  if (level >= 95) return tr(lang, { en: 'Cosmic Overdrive (SSS-Rank)', es: 'Sobrecarga Cósmica (SSS)', fr: 'Overdrive Cosmique (SSS)', ar: 'أوفر درايف الأسطوري (SSS-Rank)' });
  if (level >= 80) return tr(lang, { en: 'S-Rank Champion', es: 'Campeón S-Rank', fr: 'Champion S-Rank', ar: 'بطل خارق (S-Rank)' });
  if (level >= 60) return tr(lang, { en: 'Elite Warrior (A-Rank)', es: 'Guerrero Élite (A-Rank)', fr: 'Guerrier d’Élite (A-Rank)', ar: 'محارب متمرس (A-Rank)' });
  if (level >= 35) return tr(lang, { en: 'Kinetic Surge (B-Rank)', es: 'Impulso Cinético (B-Rank)', fr: 'Élan Cinétique (B-Rank)', ar: 'طاقة متفجرة (B-Rank)' });
  return tr(lang, { en: 'Awakened Neophyte (D-Rank)', es: 'Despierto Inicial (D-Rank)', fr: 'Éveillé Initial (D-Rank)', ar: 'مبتدئ يقظ (D-Rank)' });
}

function getRankBadge(level: number): string {
  if (level >= 95) return 'SSS-RANK OVERDRIVE';
  if (level >= 80) return 'S-RANK CHAMPION';
  if (level >= 60) return 'A-RANK WARRIOR';
  if (level >= 35) return 'B-RANK SURGE';
  return 'D-RANK AWAKENED';
}

export default AuraVisualizer;
