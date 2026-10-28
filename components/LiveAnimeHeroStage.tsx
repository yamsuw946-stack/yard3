/**
 * LiveAnimeHeroStage.tsx
 * 
 * Interactive Live Animated Anime Champions Showcase:
 * - 3 distinct champions (2 Men & 1 Woman) unique to this section:
 *   1. Ryu (Male 1): Dragon Meteor Flame Punch
 *   2. Ren (Male 2): Tornado Thunder Flying Knee
 *   3. Kira (Female): Cosmic Crescent Axe Kick
 * - Ripped, deeply defined athletic physiques with minimal clothing (visible six-pack abs & combat physique)
 * - 1-Second Cinematic Combat Video Clip for each fighter (`.mp4`) with instant playback, looping mode, and impact frames
 * - Real-time canvas particle aura simulation, 3D tilt, visual FX & sound FX
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  Zap, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Sword,
  Play,
  RotateCcw,
  Film
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

interface LiveAnimeHeroStageProps {
  currentLang?: Language;
  onExploreGear?: () => void;
  onEnterDojo?: () => void;
  compact?: boolean;
  className?: string;
}

export interface UniqueAnimeFighter {
  id: string;
  nameEn: string;
  nameAr: string;
  gender: 'male' | 'female';
  genderLabelEn: string;
  genderLabelAr: string;
  badgeEn: string;
  badgeAr: string;
  physiqueEn: string;
  physiqueAr: string;
  image: string;
  impactImage: string;
  videoUrl: string;
  themeColor: string;
  accentColor: string;
  auraPower: number;
  combatMoveNameEn: string;
  combatMoveNameAr: string;
  combatMoveType: 'punch' | 'flying_knee' | 'crescent_kick';
  kanjiRune: string;
  strikePhrasesEn: string[];
  strikePhrasesAr: string[];
}

export const ANIME_FIGHTERS: UniqueAnimeFighter[] = [
  {
    id: 'ryu_dragon_fist',
    nameEn: 'Kenji "Dragon Striker"',
    nameAr: 'كينجي "ضارب التنين"',
    gender: 'male',
    genderLabelEn: 'Semi-Human Male Striker',
    genderLabelAr: 'مقاتل شبه بشري (ضارب اللهب)',
    badgeEn: '🔥 SEMI-HUMAN HYBRID // SHREDDED 6-PACK',
    badgeAr: '🔥 بطل شبه بشري · عضلات بطن مقسمة 6-PACK',
    physiqueEn: 'Semi-human realistic warrior with photorealistic skin texture, defined six-pack abs, chiseled athletic jaw and black hand wraps',
    physiqueAr: 'مقاتل واقعي شبه بشري ببنية عضلية حقيقية وأربطة قتالية في فناء المعبد',
    image: '/images/realistic_anime_striker.jpg',
    impactImage: '/images/realistic_anime_striker.jpg',
    videoUrl: '/videos/ryu_combat_move.mp4',
    themeColor: '#FF3B30',
    accentColor: '#FF9500',
    auraPower: 9995,
    combatMoveNameEn: 'Dragon Meteor Flame Punch',
    combatMoveNameAr: 'قبضة نيزك التنين القاضية',
    combatMoveType: 'punch',
    kanjiRune: '昇龍',
    strikePhrasesEn: [
      'DRAGON METEOR PUNCH! +1,250',
      'INFERNO IMPACT STRIKE!',
      'DRAGON FLAME BURST! x{n}',
      'CRITICAL METEOR KNOCKOUT!'
    ],
    strikePhrasesAr: [
      'قبضة نيزك التنين القاضية! +1,250',
      'صدمة الجحيم المتفجرة!',
      'انفجار لهب التنين! x{n}',
      'الضربة النيزكية القاضية!'
    ]
  },
  {
    id: 'ren_thunder_knee',
    nameEn: 'Ren "Thunder Tempest"',
    nameAr: 'رين "عاصفة الرعد"',
    gender: 'male',
    genderLabelEn: 'Male Fighter 2 (Aerial Striker)',
    genderLabelAr: 'مقاتل رجل 2 (سيد الضربات الهوائية)',
    badgeEn: '⚡ CHISELED BRAWLER // AERIAL STRIKER',
    badgeAr: '⚡ بنية عضلية مفتولة · ركبة الرعد الطائرة',
    physiqueEn: 'Shirtless sculpted athletic build, chiseled core muscles & combat ankle wraps',
    physiqueAr: 'عضلات بطن وصدر منحوتة بدقة بدون ملابس علوية مع أربطة الكاحل للركلات الهوائية',
    image: '/images/anime_fighter_ren.jpg',
    impactImage: '/images/anime_fighter_ren_impact.jpg',
    videoUrl: '/videos/ren_combat_move.mp4',
    themeColor: '#00F0FF',
    accentColor: '#007AFF',
    auraPower: 9890,
    combatMoveNameEn: 'Tornado Thunder Flying Knee',
    combatMoveNameAr: 'ركبة الإعصار الرعدية الطائرة',
    combatMoveType: 'flying_knee',
    kanjiRune: '迅雷',
    strikePhrasesEn: [
      'THUNDER FLYING KNEE! +1,180',
      'LIGHTNING TEMPEST BURST!',
      'CYAN VOLTAGE IMPACT! x{n}',
      'AERIAL CRACKLE KNOCKOUT!'
    ],
    strikePhrasesAr: [
      'ركبة الإعصار الرعدية الطائرة! +1,180',
      'عاصفة الصواعق الزرقاء!',
      'صدمة الفولت الخارقة! x{n}',
      'قاضية الركبة الصاعقة!'
    ]
  },
  {
    id: 'kira_crescent_kick',
    nameEn: 'Valkyrie "Cosmic Crescent"',
    nameAr: 'فالكييري "هلال الأفق الكوني"',
    gender: 'female',
    genderLabelEn: 'Semi-Human Female Champion',
    genderLabelAr: 'بطلة مقاتلة شبه بشرية (سيدة ركلة الهلال)',
    badgeEn: '✨ SEMI-HUMAN APEX // TONED CHAMPION',
    badgeAr: '✨ مقاتلة شبه بشرية · عضلات بطن مقسمة',
    physiqueEn: 'Semi-human athletic female combat champion with photorealistic skin tone, shredded six-pack abs and tactical combat gear',
    physiqueAr: 'بطلة شبه بشرية ذات لياقة وبنية حقيقية وأربطة يد قتالية',
    image: '/images/realistic_valkyrie_fighter.jpg',
    impactImage: '/images/realistic_valkyrie_fighter.jpg',
    videoUrl: '/videos/kira_combat_move.mp4',
    themeColor: '#D946EF',
    accentColor: '#8B5CF6',
    auraPower: 9940,
    combatMoveNameEn: 'Cosmic Crescent Axe Kick',
    combatMoveNameAr: 'ركلة الهلال الكونية الساحقة',
    combatMoveType: 'crescent_kick',
    kanjiRune: '覇月',
    strikePhrasesEn: [
      'COSMIC CRESCENT AXE KICK! +1,320',
      'VIOLET NOVA ARC CLEAVE!',
      'STELLAR CRESCENT FLAME! x{n}',
      'SUPREME AXE OVERDRIVE!'
    ],
    strikePhrasesAr: [
      'ركلة الهلال الكونية الساحقة! +1,320',
      'قوس النوفا البنفسجي القاطع!',
      'لهب الهلال النجمي! x{n}',
      'الركلة الفأسية الأعظم!'
    ]
  }
];

export const LiveAnimeHeroStage: React.FC<LiveAnimeHeroStageProps> = ({
  currentLang = 'en',
  onExploreGear,
  onEnterDojo,
  compact = false,
  className = ''
}) => {
  const isAr = currentLang === 'ar';
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isExecutingMove, setIsExecutingMove] = useState<boolean>(false);
  const [isVideoLoopMode, setIsVideoLoopMode] = useState<boolean>(true);
  const [comboCount, setComboCount] = useState<number>(0);
  const [lastStrikeText, setLastStrikeText] = useState<string>('');
  const [strikeKey, setStrikeKey] = useState<number>(0);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  
  // 3D Parallax Tilt state
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeFighter = ANIME_FIGHTERS[selectedIdx];

  // Reset video on character switch
  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [selectedIdx]);

  // Mouse move parallax calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth responsive tilt
    const rotX = -(y / (rect.height / 2)) * 8;
    const rotY = (x / (rect.width / 2)) * 10;
    setTilt({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Execute Fighter's Single Signature Combat Move (Plays 1s Video Clip with Strike Impact)
  const handleExecuteSignatureMove = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!isSoundMuted) {
      if (activeFighter.combatMoveType === 'punch') {
        soundFX.playStrikeHit();
        setTimeout(() => soundFX.playAuraBurst(), 90);
      } else if (activeFighter.combatMoveType === 'flying_knee') {
        soundFX.playPowerUp();
        setTimeout(() => soundFX.playStrikeHit(), 100);
      } else {
        soundFX.playStrikeHit();
        setTimeout(() => soundFX.playPowerUp(), 90);
      }
    }
    
    const newCombo = comboCount + 1;
    setComboCount(newCombo);
    setIsExecutingMove(true);
    setStrikeKey(Date.now());
    
    // Rewind and trigger video clip instantly
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    const list = isAr ? activeFighter.strikePhrasesAr : activeFighter.strikePhrasesEn;
    const template = list[newCombo % list.length];
    const phrase = template.replace('{n}', String(newCombo));
    setLastStrikeText(phrase);

    setTimeout(() => {
      setIsExecutingMove(false);
    }, 1100);
  };

  // Particle Canvas Engine for dynamic rising aura embers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 550);

    const resizeHandler = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resizeHandler);

    interface Ember {
      x: number;
      y: number;
      radius: number;
      vy: number;
      vx: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: Ember[] = [];
    const maxParticles = isExecutingMove ? 75 : 30;

    const createParticle = (): Ember => {
      const colors = isExecutingMove 
        ? ['#FFE600', activeFighter.themeColor, activeFighter.accentColor, '#FFFFFF'] 
        : [activeFighter.themeColor, activeFighter.accentColor, '#FFFFFF'];
      return {
        x: Math.random() * width,
        y: height - Math.random() * 50,
        radius: Math.random() * 3 + 1,
        vy: -(Math.random() * 2.8 + (isExecutingMove ? 3.5 : 1)),
        vx: (Math.random() - 0.5) * 2,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 80 + 40
      };
    };

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const currentAlpha = p.alpha * (1 - p.life / p.maxLife);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife || p.y < 0) {
          particles[i] = createParticle();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationId);
    };
  }, [activeFighter, isExecutingMove]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-full rounded-3xl overflow-hidden overflow-x-hidden bg-gradient-to-b from-[#0F111D] via-[#0A0C14] to-[#05060A] shadow-[0_0_40px_rgba(0,0,0,0.8)] select-none transition-all duration-300 ${
        isExecutingMove ? 'shadow-[0_0_55px_rgba(255,230,0,0.45)] animate-combat-shake' : ''
      } ${compact ? 'max-w-md mx-auto aspect-[4/5]' : 'h-[600px] md:h-[660px]'} ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* 1. Background Magic Combat Rings, Kanji & Speedlines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid opacity-25"></div>
        <div className="absolute inset-0 bg-speedlines mix-blend-overlay opacity-30"></div>

        {/* Dynamic Pulsing Aura Behind Character */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-45 transition-colors duration-700 pointer-events-none"
          style={{ 
            backgroundColor: activeFighter.themeColor,
            boxShadow: `0 0 120px ${activeFighter.themeColor}`
          }}
        ></div>

        {/* Sacred Combat Runic Circle */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[430px] h-[340px] md:h-[430px] rounded-full border border-dashed border-white/15 animate-anime-ring pointer-events-none flex items-center justify-center"
        >
          <div className="w-[85%] h-[85%] rounded-full border border-white/10 flex items-center justify-center">
            <span 
              className="text-8xl md:text-9xl font-black font-yard-logo opacity-15 select-none tracking-widest"
              style={{ color: activeFighter.themeColor }}
            >
              {activeFighter.kanjiRune}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Particle Canvas (Living Embers) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10 pointer-events-none w-full h-full"
      />

      {/* 3. Top HUD: Fighter Identity, Video Mode Switch & Stats */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Badge & Muscle Definition Indicator */}
          <div className="px-3 py-1.5 rounded-xl bg-[#07080E]/95 backdrop-blur-md border border-gray-700/80 shadow-lg flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: activeFighter.themeColor }}
            ></span>
            <span className="text-[11px] font-black font-yard-logo italic tracking-wider text-white">
              {isAr ? activeFighter.badgeAr : activeFighter.badgeEn}
            </span>
          </div>

          {/* 1-Second Video Clip Indicator */}
          <button
            type="button"
            onClick={() => setIsVideoLoopMode(!isVideoLoopMode)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold font-mono transition-all cursor-pointer ${
              isVideoLoopMode 
                ? 'bg-[#E50914]/20 border-[#E50914] text-[#FFE600] shadow-[0_0_10px_rgba(229,9,20,0.4)]' 
                : 'bg-black/70 border-white/10 text-gray-400 hover:text-white'
            }`}
            title={isAr ? 'تبديل تشغيل مقطع الفيديو التلقائي' : 'Toggle 1-Second Combat Video Loop'}
          >
            <Film className="w-3 h-3 text-[#FFE600] animate-pulse" />
            <span>{isAr ? 'مقطع 1 ثانية (LIVE)' : '1S VIDEO (LIVE)'}</span>
          </button>
        </div>

        {/* Audio Toggle & Combo Badge */}
        <div className="flex items-center gap-2">
          {comboCount > 0 && (
            <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#E50914] to-[#FFE600] text-black text-[10px] font-black font-yard-logo shadow-[0_0_15px_rgba(255,230,0,0.5)] animate-pulse">
              COMBO x{comboCount}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            className="w-8 h-8 rounded-xl bg-[#0D0F18]/90 border border-gray-700 hover:border-white text-gray-300 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-md"
            title={isSoundMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label="Sound Toggle"
          >
            {isSoundMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#00F0FF]" />}
          </button>
        </div>
      </div>

      {/* 4. Living Animated Anime Character with 1-Second Combat Video Clip */}
      <div 
        onClick={handleExecuteSignatureMove}
        className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer group"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
        title={isAr 
          ? `اضغط لتشغيل مقطع الفيديو والحركة القتالية: ${activeFighter.combatMoveNameAr} ⚡` 
          : `Click to play 1s combat clip: ${activeFighter.combatMoveNameEn} ⚡`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* Real 1-Second Video Clip Player for Combat Action */}
          {!videoError && (
            <div className={`relative w-[85%] max-w-[420px] h-[80%] max-h-[520px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              isExecutingMove ? 'scale-105 ring-4 ring-[#FFE600] shadow-[0_0_40px_#FFE600]' : 'group-hover:scale-[1.02]'
            }`}>
              <video
                ref={videoRef}
                key={activeFighter.videoUrl}
                src={activeFighter.videoUrl}
                poster={activeFighter.image}
                autoPlay={isVideoLoopMode}
                loop={isVideoLoopMode}
                muted
                playsInline
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover object-center filter contrast-105"
              />

              {/* 1s Video Watermark Badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-red-500/60 text-[9px] font-mono font-bold text-red-400 flex items-center gap-1 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                <span>1.0s REAL CLIP</span>
              </div>
            </div>
          )}

          {/* High-definition Fallback / Overlay Image if video is inactive or errored */}
          {videoError && (
            <img 
              src={isExecutingMove ? activeFighter.impactImage : activeFighter.image}
              alt={activeFighter.nameEn}
              onError={handleImageError}
              loading="eager"
              decoding="async"
              className={`w-[85%] max-w-[420px] h-auto max-h-[82%] object-contain drop-shadow-[0_18px_38px_rgba(0,0,0,0.95)] animate-anime-breathe transition-all duration-300 ${
                isExecutingMove ? 'scale-105 filter brightness-125' : 'group-hover:scale-[1.02]'
              }`}
            />
          )}

          {/* Screaming Fiery/Lightning Aura Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50 animate-anime-flame"
            style={{
              background: `radial-gradient(circle at 50% 55%, ${activeFighter.themeColor}33 0%, transparent 70%)`
            }}
          ></div>

          {/* Dynamic Signature Move Sakuga Impact Overlay (Fires on Move Execution) */}
          {isExecutingMove && (
            <div 
              key={strikeKey} 
              className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden"
            >
              {/* Ryu's Dragon Meteor Punch Effect */}
              {activeFighter.combatMoveType === 'punch' && (
                <>
                  <div className="absolute inset-0 bg-radial from-[#FF3B30]/35 via-transparent to-transparent animate-pulse"></div>
                  <div 
                    className="w-[140%] h-5 bg-gradient-to-r from-transparent via-[#FFE600] to-transparent shadow-[0_0_45px_#FF3B30] animate-anime-slash"
                    style={{ transform: 'rotate(-15deg)' }}
                  ></div>
                  <div className="absolute w-72 h-72 rounded-full border-4 border-[#FF3B30] animate-ping opacity-80"></div>
                </>
              )}

              {/* Ren's Tornado Thunder Flying Knee Effect */}
              {activeFighter.combatMoveType === 'flying_knee' && (
                <>
                  <div className="absolute inset-0 animate-aura-lightning opacity-95">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#00F0FF] stroke-[2.5] filter drop-shadow-[0_0_14px_#00F0FF]">
                      <path d="M 48 5 L 56 32 L 49 38 L 62 70 L 52 76 L 65 98" />
                      <path d="M 35 15 L 42 45 L 36 50 L 48 85" stroke="#FFE600" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="absolute w-80 h-80 rounded-full border-2 border-dashed border-[#00F0FF] animate-spin"></div>
                </>
              )}

              {/* Kira's Cosmic Crescent Axe Kick Effect */}
              {activeFighter.combatMoveType === 'crescent_kick' && (
                <>
                  <div 
                    className="w-[150%] h-6 bg-gradient-to-r from-transparent via-[#D946EF] to-transparent shadow-[0_0_50px_#8B5CF6] animate-anime-slash"
                    style={{ transform: 'rotate(35deg)' }}
                  ></div>
                  <div className="absolute w-80 h-80 rounded-full border-4 border-[#D946EF] animate-ping opacity-85"></div>
                  <div className="absolute inset-0 bg-radial from-[#D946EF]/30 via-transparent to-transparent"></div>
                </>
              )}

              {/* Move Announcement Banner */}
              <div className="absolute top-1/3 z-40 px-5 py-2.5 rounded-2xl bg-black/95 border-2 border-[#FFE600] text-[#FFE600] text-sm md:text-base font-black font-yard-logo italic tracking-wider shadow-[0_0_30px_rgba(255,230,0,0.8)] animate-anime-combo flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF3B30] animate-bounce" />
                <span>{lastStrikeText}</span>
              </div>
            </div>
          )}

          {/* Interactive Click Cue Badge on Hover */}
          <div className="absolute bottom-28 z-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-[#FFE600]/80 shadow-xl text-xs font-black font-yard-logo text-[#FFE600] flex items-center gap-1.5">
            <Sword className="w-3.5 h-3.5 animate-spin" />
            <span>
              {isAr 
                ? `اضغط لتشغيل مقطع ثانية واحدة: ${activeFighter.combatMoveNameAr} ⚔️` 
                : `CLICK TO PLAY 1S CLIP: ${activeFighter.combatMoveNameEn} ⚔️`}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Bottom Interactive Panel: Character Selector & Attack Actions */}
      <div className="absolute bottom-4 inset-x-4 z-30 space-y-2.5 pointer-events-auto">
        {/* Fighter Info Card (Title, Muscle Description & Single Move) */}
        <div className="p-3.5 rounded-2xl bg-[#090B14]/95 backdrop-blur-md border border-gray-800/90 shadow-xl flex items-center justify-between gap-3">
          <div className="space-y-1 text-left rtl:text-right min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base md:text-lg font-black font-yard-logo italic tracking-wide text-white truncate">
                {isAr ? activeFighter.nameAr : activeFighter.nameEn}
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-bold text-gray-300 font-mono">
                {isAr ? activeFighter.genderLabelAr : activeFighter.genderLabelEn}
              </span>
            </div>
            
            {/* Muscular Physique Description */}
            <p className="text-[10px] text-gray-400 font-bold line-clamp-1">
              💪 {isAr ? activeFighter.physiqueAr : activeFighter.physiqueEn}
            </p>

            {/* Signature Single Move Highlight */}
            <p className="text-[11px] font-black text-[#FFE600] line-clamp-1 font-yard-logo italic">
              ⚡ {isAr ? `الحركة القتالية (مقطع ثانية واحدة): ${activeFighter.combatMoveNameAr}` : `1s Combat Move: ${activeFighter.combatMoveNameEn}`}
            </p>
          </div>

          {/* Trigger 1-Second Combat Move Button */}
          <button
            type="button"
            onClick={handleExecuteSignatureMove}
            className={`px-4 py-2.5 rounded-xl text-xs font-black font-yard-logo italic transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg ${
              isExecutingMove
                ? 'bg-gradient-to-r from-[#FFE600] to-white text-black shadow-[0_0_25px_#FFE600] scale-105'
                : 'bg-gradient-to-r from-[#E50914] via-[#FF3B30] to-[#FF9500] hover:from-[#FFE600] hover:to-[#E50914] text-white hover:text-black shadow-[0_0_18px_rgba(229,9,20,0.6)] active:scale-95'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>{isAr ? 'تشغيل مقطع الحركة (1ث)' : 'PLAY 1S MOVE'}</span>
          </button>
        </div>

        {/* 3 Fighters Switcher Icons Bar (2 Men & 1 Woman) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {ANIME_FIGHTERS.map((fighter, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={fighter.id}
                  type="button"
                  onClick={() => {
                    if (!isSoundMuted) soundFX.playButtonClick();
                    setSelectedIdx(idx);
                  }}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border-2 transition-all cursor-pointer relative shrink-0 ${
                    isSelected 
                      ? 'border-[#FFE600] bg-[#141624] scale-105 shadow-[0_0_18px_rgba(255,230,0,0.5)]' 
                      : 'border-gray-800 bg-[#0A0C14]/80 opacity-70 hover:opacity-100 hover:border-gray-600'
                  }`}
                  title={isAr ? fighter.nameAr : fighter.nameEn}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/20">
                    <img 
                      src={fighter.image} 
                      alt={fighter.nameEn} 
                      onError={handleImageError}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="text-left rtl:text-right">
                    <span className="text-[11px] font-black font-yard-logo italic text-white block leading-tight">
                      {isAr ? fighter.nameAr.split(' ')[0] : fighter.nameEn.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 block leading-tight">
                      {fighter.gender === 'male' ? (isAr ? 'رجل' : 'Male') : (isAr ? 'امرأة' : 'Female')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Action Navigation CTA */}
          <div className="flex items-center gap-2 shrink-0">
            {onExploreGear && (
              <button
                type="button"
                onClick={onExploreGear}
                className="px-3 py-2 rounded-xl bg-[#141624] hover:bg-[#1E2135] border border-gray-700 hover:border-[#00F0FF] text-white text-[10px] font-black font-yard-logo italic transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? 'متجر YARD' : 'YARD GEAR'}</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAnimeHeroStage;
