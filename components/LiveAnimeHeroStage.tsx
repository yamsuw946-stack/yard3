/**
 * LiveAnimeHeroStage.tsx
 * Interactive Live Combat Champions Showcase with 4-language parity and obsidian-emerald visuals.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  Sword,
  Play,
  Film
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

interface LiveAnimeHeroStageProps {
  currentLang?: Language;
  onExploreGear?: () => void;
  onEnterDojo?: () => void;
  compact?: boolean;
  className?: string;
}

interface LocalizedText {
  en: string;
  es: string;
  fr: string;
  ar: string;
}

export interface UniqueAnimeFighter {
  id: string;
  name: LocalizedText;
  gender: 'male' | 'female';
  genderLabel: LocalizedText;
  badge: LocalizedText;
  physique: LocalizedText;
  image: string;
  impactImage: string;
  videoUrl: string;
  themeColor: string;
  accentColor: string;
  auraPower: number;
  combatMoveName: LocalizedText;
  combatMoveType: 'punch' | 'flying_knee' | 'crescent_kick';
  kanjiRune: string;
  strikePhrases: {
    en: string[];
    es: string[];
    fr: string[];
    ar: string[];
  };
}

export const ANIME_FIGHTERS: UniqueAnimeFighter[] = [
  {
    id: 'ryu_dragon_fist',
    name: {
      en: 'Kenji "Iron Striker"',
      es: 'Kenji "Golpe de Hierro"',
      fr: 'Kenji "Frappe de Fer"',
      ar: 'كينجي "الضارب الفولاذي"'
    },
    gender: 'male',
    genderLabel: {
      en: 'Combat Male Striker',
      es: 'Luchador Masculino',
      fr: 'Combattant Masculin',
      ar: 'مقاتل محترف (ضارب القوة)'
    },
    badge: {
      en: '🔥 ELITE HYBRID · SHREDDED 6-PACK',
      es: '🔥 ÉLITE HÍBRIDO · FÍSICO DEFINIDO',
      fr: '🔥 ÉLITE HYBRIDE · ATHLÈTE SCULPTÉ',
      ar: '🔥 بطل نخبة · لياقة قتالية فائقة'
    },
    physique: {
      en: 'Athletic striker with defined core, combat stance and black hand wraps',
      es: 'Atleta de combate con abdomen marcado y vendajes negros tácticos',
      fr: 'Combattant athlétique au buste sculpté avec bandages noirs',
      ar: 'بطل واقعي ببنية عضلية متناسقة وأربطة قتالية عالية التحمل'
    },
    image: '/images/ai_human_striker_male.jpg',
    impactImage: '/images/ai_human_heavyweight_boxer.jpg',
    videoUrl: '/videos/ryu_combat_move.mp4',
    themeColor: '#D4AF37',
    accentColor: '#10B981',
    auraPower: 9995,
    combatMoveName: {
      en: 'Heavy Kinetic Power Hook',
      es: 'Gancho Cinético de Potencia',
      fr: 'Crochet Cinétique Haute Puissance',
      ar: 'اللكمة الحركية القاضية'
    },
    combatMoveType: 'punch',
    kanjiRune: '01',
    strikePhrases: {
      en: ['KINETIC POWER HOOK! +1,250', 'HIGH-IMPACT STRIKE!', 'VELOCITY BURST! x{n}', 'PEAK TELEMETRY KNOCKOUT!'],
      es: ['¡GANCHO DE POTENCIA! +1,250', '¡IMPACTO DE ÉLITE!', '¡RÁFAGA DE VELOCIDAD! x{n}', '¡NOCAUT DE MÁXIMA PRECISIÓN!'],
      fr: ['CROCHET PUISSANCE ! +1,250', 'IMPACT HAUTE VITESSE !', 'VAGUE CINÉTIQUE ! x{n}', 'K.O. TÉLÉMÉTRIQUE !'],
      ar: ['اللكمة الحركية القاضية! +1,250', 'ضربة دقيقة عالية السرعة!', 'دفعة طاقة متفجرة! x{n}', 'أداء قتالي استثنائي!']
    }
  },
  {
    id: 'soren_apex_stride',
    name: {
      en: 'Soren "Apex Stride"',
      es: 'Soren "Impulso Ápex"',
      fr: 'Soren "Élan Apex"',
      ar: 'سورن "الاندفاع الأولمبي"'
    },
    gender: 'male',
    genderLabel: {
      en: 'Aerial Athlete',
      es: 'Atleta Aéreo',
      fr: 'Athlète Aérien',
      ar: 'بطل اللياقة والحركة السريعة'
    },
    badge: {
      en: '⚡ CHISELED ATHLETE · AERIAL STRIKER',
      es: '⚡ ATLETA ESCULPIDO · GOLPE AÉREO',
      fr: '⚡ ATHLÈTE SCULPTÉ · FRAPPE AÉRIENNE',
      ar: '⚡ بنية رياضية متقنة · سرعة رد فعل'
    },
    physique: {
      en: 'Sculpted athletic build, chiseled core muscles & combat ankle wraps',
      es: 'Físico atlético esculpido, abdomen definido y vendajes de tobillo',
      fr: 'Physique sculpté, sangle abdominale définie & bandages aux chevilles',
      ar: 'عضلات بطن وصدر متناسقة مع أربطة الكاحل للوثب والحركة'
    },
    image: '/images/ai_human_aerial_male.jpg',
    impactImage: '/images/ai_human_tactical_male.jpg',
    videoUrl: '/videos/ren_combat_move.mp4',
    themeColor: '#10B981',
    accentColor: '#34D399',
    auraPower: 9890,
    combatMoveName: {
      en: 'Explosive Flying Knee Strike',
      es: 'Rodilla Voladora Explosiva',
      fr: 'Genou Volant Explosif',
      ar: 'ركبة الاندفاع الطائرة'
    },
    combatMoveType: 'flying_knee',
    kanjiRune: '02',
    strikePhrases: {
      en: ['EXPLOSIVE FLYING KNEE! +1,180', 'RAPID AGILITY BURST!', 'EMERALD OUTPUT SURGE! x{n}', 'AERIAL PRECISION STRIKE!'],
      es: ['¡RODILLA VOLADORA! +1,180', '¡RÁFAGA DE AGILIDAD!', '¡IMPACTO ESMERALDA! x{n}', '¡PRECISIÓN AÉREA!'],
      fr: ['GENOU VOLANT ! +1,180', 'ÉCLAIR D’AGILITÉ !', 'IMPACT ÉMERAUDE ! x{n}', 'FRAPPE AÉRIENNE !'],
      ar: ['ركبة الاندفاع الطائرة! +1,180', 'رشاقة وسرعة فائقة!', 'انفجار أداء زمردي! x{n}', 'ضربة جوية دقيقة!']
    }
  },
  {
    id: 'kira_crescent_kick',
    name: {
      en: 'Valeria "Apex Striker"',
      es: 'Valeria "Golpeadora Ápex"',
      fr: 'Valeria "Attaquante Apex"',
      ar: 'فاليريا "بطلة النخبة"'
    },
    gender: 'female',
    genderLabel: {
      en: 'Female Champion',
      es: 'Campeona Femenina',
      fr: 'Championne Féminine',
      ar: 'بطلة مقاتلة محترفة'
    },
    badge: {
      en: '✨ APEX STRIKER · TONED CHAMPION',
      es: '✨ CAMPEONA ÁPEX · FÍSICO TONIFICADO',
      fr: '✨ CHAMPIONNE APEX · ATHLÈTE TONIQUE',
      ar: '✨ بطلة نخبة · قوة ولياقة متكاملة'
    },
    physique: {
      en: 'Athletic female combat champion with toned physique and tactical wraps',
      es: 'Campeona atlética femenina con físico tonificado y vendajes tácticos',
      fr: 'Championne athlétique au physique affûté avec bandages tactiques',
      ar: 'بطلة ذات لياقة وبنية متقنة وأربطة يد قتالية'
    },
    image: '/images/ai_human_valkyrie_female.jpg',
    impactImage: '/images/ai_human_female_runner.jpg',
    videoUrl: '/videos/kira_combat_move.mp4',
    themeColor: '#34D399',
    accentColor: '#D4AF37',
    auraPower: 9940,
    combatMoveName: {
      en: 'High Crescent Roundhouse Kick',
      es: 'Patada Circular Creciente Alta',
      fr: 'Coup de Pied Circulaire Haut',
      ar: 'ركلة الهلال الدائرية السريعة'
    },
    combatMoveType: 'crescent_kick',
    kanjiRune: '03',
    strikePhrases: {
      en: ['CRESCENT ROUNDHOUSE KICK! +1,320', 'EMERALD VELOCITY ARC!', 'PEAK AGILITY SURGE! x{n}', 'CHAMPIONSHIP FINISH!'],
      es: ['¡PATADA CIRCULAR ALTA! +1,320', '¡ARCO DE VELOCIDAD!', '¡POTENCIA DE ÉLITE! x{n}', '¡REMATE CAMPEÓN!'],
      fr: ['COUP DE PIED CIRCULAIRE ! +1,320', 'ARC DE VITESSE ÉMERAUDE !', 'PUISSANCE D’ÉLITE ! x{n}', 'FINITION CHAMPIONNE !'],
      ar: ['ركلة الهلال السريعة! +1,320', 'قوس سرعة فائقة الدقة!', 'ذروة الرشاقة البدنية! x{n}', 'إنهاء بطولي متكامل!']
    }
  }
];

export const LiveAnimeHeroStage: React.FC<LiveAnimeHeroStageProps> = ({
  currentLang = 'en',
  onExploreGear,
  compact = false,
  className = ''
}) => {
  const t = (en: string, es: string, fr: string, ar: string) => tr(currentLang, { en, es, fr, ar });
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isExecutingMove, setIsExecutingMove] = useState<boolean>(false);
  const [isVideoLoopMode, setIsVideoLoopMode] = useState<boolean>(true);
  const [comboCount, setComboCount] = useState<number>(0);
  const [lastStrikeText, setLastStrikeText] = useState<string>('');
  const [strikeKey, setStrikeKey] = useState<number>(0);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeFighter = ANIME_FIGHTERS[selectedIdx];

  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [selectedIdx]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / (rect.height / 2)) * 8,
      y: (x / (rect.width / 2)) * 10
    });
  };

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

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    const list =
      currentLang === 'ar'
        ? activeFighter.strikePhrases.ar
        : currentLang === 'es'
          ? activeFighter.strikePhrases.es
          : currentLang === 'fr'
            ? activeFighter.strikePhrases.fr
            : activeFighter.strikePhrases.en;
    const phrase = list[newCombo % list.length].replace('{n}', String(newCombo));
    setLastStrikeText(phrase);

    setTimeout(() => {
      setIsExecutingMove(false);
    }, 1100);
  };

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

    const particles = Array.from({ length: isExecutingMove ? 60 : 24 }, () => {
      const colors = isExecutingMove
        ? ['#D4AF37', activeFighter.themeColor, activeFighter.accentColor, '#FFFFFF']
        : [activeFighter.themeColor, activeFighter.accentColor, '#FFFFFF'];
      return {
        x: Math.random() * width,
        y: height - Math.random() * 50,
        radius: Math.random() * 2.5 + 1,
        vy: -(Math.random() * 2.5 + (isExecutingMove ? 3.2 : 1)),
        vx: (Math.random() - 0.5) * 1.8,
        alpha: Math.random() * 0.65 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 80 + 40
      };
    });

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
        ctx.fill();
        ctx.restore();
        if (p.life >= p.maxLife || p.y < 0) {
          p.x = Math.random() * width;
          p.y = height;
          p.life = 0;
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
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className={`relative w-full max-w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#080D0B] via-[#050807] to-[#040706] border border-emerald-500/25 shadow-2xl select-none transition-all duration-300 ${
        compact ? 'max-w-md mx-auto aspect-[4/5]' : 'h-[600px] md:h-[660px]'
      } ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-35 transition-colors duration-700 pointer-events-none"
          style={{ backgroundColor: activeFighter.themeColor }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[430px] h-[340px] md:h-[430px] rounded-full border border-dashed border-white/10 animate-anime-ring pointer-events-none flex items-center justify-center">
          <span className="text-8xl md:text-9xl font-black opacity-15 select-none" style={{ color: activeFighter.themeColor }}>
            {activeFighter.kanjiRune}
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none w-full h-full" />

      {/* Top HUD */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#050807]/95 backdrop-blur-md border border-emerald-500/35 shadow-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeFighter.themeColor }} />
            <span className="text-[11px] font-black font-yard-logo italic tracking-wider text-white">
              {tr(currentLang, activeFighter.badge)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsVideoLoopMode(!isVideoLoopMode)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold font-mono transition-all cursor-pointer ${
              isVideoLoopMode
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                : 'bg-black/70 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3 h-3 text-[#D4AF37]" />
            <span>{t('1S VIDEO (LIVE)', 'VIDEO 1S (VIVO)', 'VIDÉO 1S (DIRECT)', 'مقطع 1 ثانية (LIVE)')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {comboCount > 0 && (
            <div className="px-2.5 py-1 rounded-xl bg-emerald-500 text-black text-[10px] font-black font-mono tabular-nums">
              COMBO x{comboCount}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            className="w-8 h-8 rounded-xl bg-[#080D0B]/90 border border-white/[0.12] hover:border-emerald-400 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer"
            aria-label="Sound Toggle"
          >
            {isSoundMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Character Clip */}
      <div
        onClick={handleExecuteSignatureMove}
        className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer group"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {!videoError && (
            <div
              className={`relative w-[85%] max-w-[420px] h-[80%] max-h-[520px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                isExecutingMove ? 'scale-105 ring-2 ring-[#D4AF37]' : 'group-hover:scale-[1.02]'
              }`}
            >
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

              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-emerald-500/50 text-[9px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>1.0s LIVE CLIP</span>
              </div>
            </div>
          )}

          {videoError && (
            <img
              src={isExecutingMove ? activeFighter.impactImage : activeFighter.image}
              alt={tr(currentLang, activeFighter.name)}
              onError={handleImageError}
              loading="eager"
              decoding="async"
              className={`w-[85%] max-w-[420px] h-auto max-h-[82%] object-contain drop-shadow-[0_18px_38px_rgba(0,0,0,0.95)] transition-all duration-300 ${
                isExecutingMove ? 'scale-105 brightness-125' : 'group-hover:scale-[1.02]'
              }`}
            />
          )}

          {isExecutingMove && (
            <div key={strikeKey} className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
              <div className="absolute top-1/3 z-40 px-5 py-2.5 rounded-2xl bg-black/95 border-2 border-[#D4AF37] text-[#D4AF37] text-sm md:text-base font-black font-yard-logo italic tracking-wider shadow-xl flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>{lastStrikeText}</span>
              </div>
            </div>
          )}

          <div className="absolute bottom-28 z-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-[#D4AF37]/70 shadow-xl text-xs font-black text-[#D4AF37] flex items-center gap-1.5">
            <Sword className="w-3.5 h-3.5" />
            <span>
              {t('CLICK TO PLAY 1S CLIP', 'CLIC PARA REPRODUCIR 1S', 'CLIQUER POUR LIRE 1S', 'اضغط لتشغيل المقطع')}:{' '}
              {tr(currentLang, activeFighter.combatMoveName)} ⚔️
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Panel */}
      <div className="absolute bottom-4 inset-x-4 z-30 space-y-2.5 pointer-events-auto">
        <div className="p-3.5 rounded-2xl bg-[#050807]/95 backdrop-blur-md border border-white/[0.08] shadow-xl flex items-center justify-between gap-3">
          <div className="space-y-1 text-left rtl:text-right min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base md:text-lg font-black font-yard-logo italic tracking-wide text-white truncate">
                {tr(currentLang, activeFighter.name)}
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-bold text-slate-300 font-mono">
                {tr(currentLang, activeFighter.genderLabel)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold line-clamp-1">
              💪 {tr(currentLang, activeFighter.physique)}
            </p>
            <p className="text-[11px] font-black text-[#D4AF37] line-clamp-1">
              ⚡ {t('1s Combat Move', 'Movimiento 1s', 'Coup Spécial 1s', 'الحركة القتالية (1ث)')}:{' '}
              {tr(currentLang, activeFighter.combatMoveName)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleExecuteSignatureMove}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.4)] active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t('PLAY 1S MOVE', 'REPRODUCIR 1S', 'JOUER 1S', 'تشغيل الحركة (1ث)')}</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 yard-slim-scrollbar">
            {ANIME_FIGHTERS.map((fighter, idx) => {
              const isSelected = selectedIdx === idx;
              const fName = tr(currentLang, fighter.name);
              return (
                <button
                  key={fighter.id}
                  type="button"
                  onClick={() => {
                    if (!isSoundMuted) soundFX.playButtonClick();
                    setSelectedIdx(idx);
                  }}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'border-emerald-400 bg-[#0C1411] scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'border-white/10 bg-[#050807]/85 opacity-70 hover:opacity-100 hover:border-white/25'
                  }`}
                  title={fName}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/20">
                    <img
                      src={fighter.image}
                      alt={fName}
                      onError={handleImageError}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="text-left rtl:text-right">
                    <span className="text-[11px] font-black text-white block leading-tight">
                      {fName.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 block leading-tight">
                      {fighter.gender === 'male'
                        ? t('Male', 'Hombre', 'Homme', 'رجل')
                        : t('Female', 'Mujer', 'Femme', 'امرأة')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {onExploreGear && (
            <button
              type="button"
              onClick={onExploreGear}
              className="px-3 py-2 rounded-xl bg-[#0C1411] hover:bg-emerald-500/15 border border-emerald-500/30 text-white text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>{t('YARD GEAR', 'TIENDA YARD', 'BOUTIQUE YARD', 'متجر YARD')}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveAnimeHeroStage;
