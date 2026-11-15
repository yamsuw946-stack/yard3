/**
 * LiveAnimeHeroStage.tsx
 *
 * Interactive AI Bio-Enhanced Athlete Showcase (2026 Kinetic Edition):
 * - 6 unique photorealistic AI-enhanced human champions
 * - GPU-composited stacked depth-glide slides, pointer/touch swipe, wheel filmstrip scrub
 * - Smooth 3D parallax tilt, ambient gold particle canvas, and interactive biomechanics pulse
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Zap,
  Volume2,
  VolumeX,
  Play,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';
import { KineticMediaStage, KineticSlide } from './KineticMediaStage';

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
  strikePhrasesEn: string[];
  strikePhrasesAr: string[];
}

export const ANIME_FIGHTERS: UniqueAnimeFighter[] = [
  {
    id: 'isabella_valkyrie',
    nameEn: 'Isabella Silva',
    nameAr: 'إيزابيلا سيلفا',
    gender: 'female',
    genderLabelEn: 'Sovereign Combat & Power Champion',
    genderLabelAr: 'بطلة القتال والقوة البدنية الفائقة',
    badgeEn: 'SOVEREIGN WOMEN · SERIES 01',
    badgeAr: 'نخبة السيدات · الفئة 01',
    physiqueEn: 'Sculpted high-velocity striking core, titanium wrist stabilizers & explosive Hyrox conditioning',
    physiqueAr: 'جذع رياضي منحوت بسرعة ضربات عالية وأربطة تيتانيوم ولياقة هايروكس متفجرة',
    image: '/images/woman_brazilian_fitness.jpg',
    impactImage: '/images/woman_latina_sprinter.jpg',
    videoUrl: '',
    themeColor: '#D4AF37',
    accentColor: '#EF4444',
    auraPower: 9990,
    combatMoveNameEn: 'Sovereign Golden Knee Strike',
    combatMoveNameAr: 'ضربة الركبة الذهبية السيادية',
    combatMoveType: 'flying_knee',
    strikePhrasesEn: [
      'SOVEREIGN STRIKE · +1,350 AU',
      'EXPLOSIVE CORE SURGE · 99.7%',
      'VALKYRIE COMBO · x{n}',
      'APEX FORM LOCKED'
    ],
    strikePhrasesAr: [
      'ضربة سيادية فائقة · +1,350 AU',
      'قوة جذع متفجرة · 99.7%',
      'كومبو فالكيري · x{n}',
      'أداء قمة متكامل'
    ]
  },
  {
    id: 'marcus_striker',
    nameEn: 'Marcus Vance',
    nameAr: 'ماركوس فانس',
    gender: 'male',
    genderLabelEn: 'AI Bio-Enhanced Striker',
    genderLabelAr: 'مقاتل بشري معزز بالذكاء الاصطناعي',
    badgeEn: 'BIO-ENGINEERED · SERIES 02',
    badgeAr: 'بشري معزز حيوياً · الفئة 02',
    physiqueEn: 'Subdermal gold neuromuscular telemetry conduits, carbon wrist wraps & peak kinetic force',
    physiqueAr: 'موصلات قياس حيوي عصبية مطعمة بالذهب الدقيق وأربطة كربونية لأقصى عزم هجومي',
    image: '/images/ai_human_striker_male.jpg',
    impactImage: '/images/athlete_mexican_boxer.jpg',
    videoUrl: '',
    themeColor: '#D4AF37',
    accentColor: '#10B981',
    auraPower: 9975,
    combatMoveNameEn: 'Kinetic Overdrive Cross',
    combatMoveNameAr: 'الضربة الحركية المعززة فائقة العزم',
    combatMoveType: 'punch',
    strikePhrasesEn: [
      'KINETIC IMPACT · +1,250 AU',
      'PEAK FORCE TRANSFER · 99.4%',
      'NEURAL SYNC SURGE · x{n}',
      'BIOMECHANICAL LOCKOUT'
    ],
    strikePhrasesAr: [
      'صدمة حركية فائقة · +1,250 AU',
      'نقل القوة القصوى · 99.4%',
      'ذروة التزامن العصبي · x{n}',
      'تحكم بيوميكانيكي كامل'
    ]
  },
  {
    id: 'anastasia_boxer',
    nameEn: 'Anastasia Volkov',
    nameAr: 'أناستازيا فولكوف',
    gender: 'female',
    genderLabelEn: 'Pro Boxing & Tactical Conditioning Lead',
    genderLabelAr: 'بطلة الملاكمة المحترفة والتحمل القتالي',
    badgeEn: 'PRO BOXING · SERIES 03',
    badgeAr: 'ملاكمة النخبة · الفئة 03',
    physiqueEn: 'Lightning counter-punch reflexes, reinforced shoulder rotation & relentless stamina pacing',
    physiqueAr: 'سرعة استجابة مرتدة خاطفة ودوران كتف قوي وتحمل لا ينكسر في الجولات',
    image: '/images/woman_slavic_boxer.jpg',
    impactImage: '/images/woman_nordic_valkyrie.jpg',
    videoUrl: '',
    themeColor: '#EF4444',
    accentColor: '#D4AF37',
    auraPower: 9955,
    combatMoveNameEn: 'Crimson Meteor Uppercut',
    combatMoveNameAr: 'لكمة النيزك الصاعدة الحاسمة',
    combatMoveType: 'punch',
    strikePhrasesEn: [
      'METEOR UPPERCUT · +1,310 AU',
      'COUNTER VELOCITY · 99.5%',
      'IRON GUARD BROKEN · x{n}',
      'UNSTOPPABLE MOMENTUM'
    ],
    strikePhrasesAr: [
      'لكمة النيزك الصاعدة · +1,310 AU',
      'سرعة الضربة المرتدة · 99.5%',
      'اختراق الدفاع الكامل · x{n}',
      'زخم قتالي لا يتوقف'
    ]
  },
  {
    id: 'noura_striker',
    nameEn: 'Noura Al-Rashid',
    nameAr: 'نورة الراشد',
    gender: 'female',
    genderLabelEn: 'Kickboxing & Reformer Power Elite',
    genderLabelAr: 'بطلة الكيك بوكسينغ والقوة الرشيقة',
    badgeEn: 'APEX STRIKE · SERIES 04',
    badgeAr: 'قمة القتال · الفئة 04',
    physiqueEn: 'Razor-sharp crescent kicks, balanced pelvic alignment & high-altitude oxygen discipline',
    physiqueAr: 'ركلات هلالية حادة وتوازن حركي مثالي وانضباط تنفسي فائق تحت الضغط',
    image: '/images/woman_levantine_striker.jpg',
    impactImage: '/images/woman_italian_athlete.jpg',
    videoUrl: '',
    themeColor: '#10B981',
    accentColor: '#D4AF37',
    auraPower: 9940,
    combatMoveNameEn: 'Emerald Crescent Kick',
    combatMoveNameAr: 'الركلة الهلالية الزمردية الدقيقة',
    combatMoveType: 'crescent_kick',
    strikePhrasesEn: [
      'CRESCENT STRIKE · +1,290 AU',
      'PRECISION ARC · 99.6%',
      'AGILITY SURGE · x{n}',
      'FLAWLESS BALANCE'
    ],
    strikePhrasesAr: [
      'الركلة الهلالية الدقيقة · +1,290 AU',
      'قوس هجومي متقن · 99.6%',
      'ذروة الرشاقة · x{n}',
      'توازن عضلي مثالي'
    ]
  },
  {
    id: 'kenji_endurance',
    nameEn: 'Kenji Sato',
    nameAr: 'كينجي ساتو',
    gender: 'male',
    genderLabelEn: 'AI Bio-Enhanced Sprinter',
    genderLabelAr: 'عداء ومقاتل معزز بالذكاء الاصطناعي',
    badgeEn: 'VO2-MAX LAB · SERIES 05',
    badgeAr: 'مختبر التحمل الأقصى · الفئة 05',
    physiqueEn: 'Micro-biometric clavicle pacing node, zero-drag compression weave & anaerobic sprint core',
    physiqueAr: 'عقدة قياس حيوي مدمجة في الترقوة ونسيج انسيابي عالي التحمل اللاهوائي',
    image: '/images/ai_human_aerial_male.jpg',
    impactImage: '/images/athlete_korean_calisthenics.jpg',
    videoUrl: '',
    themeColor: '#10B981',
    accentColor: '#D4AF37',
    auraPower: 9890,
    combatMoveNameEn: 'Aero-Kinetic Knee Drive',
    combatMoveNameAr: 'اندفاع الركبة الهوائي فائق السرعة',
    combatMoveType: 'flying_knee',
    strikePhrasesEn: [
      'AERO KNEE DRIVE · +1,180 AU',
      'VELOCITY THRESHOLD · 98.9%',
      'VO2 PEAK ACTIVATION · x{n}',
      'EXPLOSIVE ACCELERATION'
    ],
    strikePhrasesAr: [
      'اندفاع الركبة الهوائي · +1,180 AU',
      'تجاوز عتبة السرعة · 98.9%',
      'تفعيل ذروة الأكسجين · x{n}',
      'تسارع انفجاري دقيق'
    ]
  },
  {
    id: 'elena_valkyrie',
    nameEn: 'Elena Lin',
    nameAr: 'إيلينا لين',
    gender: 'female',
    genderLabelEn: 'AI Bio-Enhanced Champion',
    genderLabelAr: 'بطلة بشرية معززة بالذكاء الاصطناعي',
    badgeEn: 'NEURAL APEX · SERIES 06',
    badgeAr: 'القمة العصبية · الفئة 06',
    physiqueEn: 'Ocular micro-telemetry interface, sculpted core equilibrium & high-velocity kickboxing output',
    physiqueAr: 'واجهة قياس حيوي دقيقة عند الصدغ مع توازن عضلي متكامل وسرعة ركلات فائقة',
    image: '/images/ai_human_valkyrie_female.jpg',
    impactImage: '/images/athlete_french_fencer.jpg',
    videoUrl: '',
    themeColor: '#38BDF8',
    accentColor: '#D4AF37',
    auraPower: 9920,
    combatMoveNameEn: 'Tidal Velocity Crescent',
    combatMoveNameAr: 'الركلة المائية عالية السرعة',
    combatMoveType: 'crescent_kick',
    strikePhrasesEn: [
      'TIDAL VELOCITY · +1,320 AU',
      'CORE EQUILIBRIUM · 99.6%',
      'APEX REFLEX WINDOW · x{n}',
      'OPTIMAL KINETIC ARC'
    ],
    strikePhrasesAr: [
      'سرعة مائية فائقة · +1,320 AU',
      'توازن الجذع المثالي · 99.6%',
      'نافذة رد الفعل الفائق · x{n}',
      'قوس حركي متقن'
    ]
  }
];

export const LiveAnimeHeroStage: React.FC<LiveAnimeHeroStageProps> = ({
  currentLang = 'en',
  onExploreGear,
  compact = false,
  className = ''
}) => {
  const isAr = currentLang === 'ar';
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isExecutingMove, setIsExecutingMove] = useState<boolean>(false);
  const [comboCount, setComboCount] = useState<number>(0);
  const [lastStrikeText, setLastStrikeText] = useState<string>('');
  const [strikeKey, setStrikeKey] = useState<number>(0);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stripRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const railContainerRef = useRef<HTMLDivElement | null>(null);

  const activeFighter = ANIME_FIGHTERS[selectedIdx];

  const slides: KineticSlide[] = ANIME_FIGHTERS.map((f, idx) => ({
    id: f.id,
    src: isExecutingMove && idx === selectedIdx ? f.impactImage : f.image,
    alt: isAr ? f.nameAr : f.nameEn,
    accentColor: f.themeColor
  }));

  useEffect(() => {
    const activeBtn = stripRefs.current[selectedIdx];
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedIdx]);

  const handleSelectFighter = (idx: number) => {
    if (!isSoundMuted && idx !== selectedIdx) soundFX.playButtonClick();
    setSelectedIdx(idx);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 4.5;
    const rotY = (x / (rect.width / 2)) * 5.5;
    setTilt({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleExecuteSignatureMove = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!isSoundMuted) {
      soundFX.playStrikeHit();
      setTimeout(() => soundFX.playPowerUp(), 90);
    }

    const newCombo = comboCount + 1;
    setComboCount(newCombo);
    setIsExecutingMove(true);
    setStrikeKey(Date.now());

    const list = isAr ? activeFighter.strikePhrasesAr : activeFighter.strikePhrasesEn;
    const template = list[newCombo % list.length];
    const phrase = template.replace('{n}', String(newCombo));
    setLastStrikeText(phrase);

    setTimeout(() => {
      setIsExecutingMove(false);
    }, 1000);
  };

  // Subtle ambient telemetry dust particles in gold & platinum
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

    interface Particle {
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

    const particles: Particle[] = [];
    const maxParticles = isExecutingMove ? 32 : 16;

    const createParticle = (): Particle => {
      const colors = isExecutingMove
        ? ['#D4AF37', '#10B981', '#F8FAFC']
        : ['#D4AF37', '#94A3B8'];
      return {
        x: Math.random() * width,
        y: height - Math.random() * 60,
        radius: Math.random() * 1.8 + 0.6,
        vy: -(Math.random() * 1.4 + (isExecutingMove ? 2.0 : 0.5)),
        vx: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.45 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 90 + 50
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
      className={`relative w-full max-w-full rounded-2xl overflow-hidden bg-[#0C0E14] border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.75)] select-none transition-colors duration-500 ${
        isExecutingMove ? 'border-[#D4AF37]/60' : ''
      } ${compact ? 'max-w-sm mx-auto aspect-[4/4.5]' : 'h-[390px] sm:h-[430px] md:h-[470px]'} ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Subtle architectural gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 transition-colors duration-700"
          style={{ backgroundColor: activeFighter.themeColor }}
        />
      </div>

      {/* Ambient dust canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none w-full h-full"
      />

      {/* Top HUD */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#07080C]/90 backdrop-blur-md border border-white/[0.08] flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-semibold tracking-wider text-slate-200 uppercase">
              {isAr ? activeFighter.badgeAr : activeFighter.badgeEn}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {comboCount > 0 && (
            <div className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-[#07080C] text-[10px] font-bold tracking-wider font-mono tabular-nums">
              SYNC x{comboCount}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            className="w-8 h-8 rounded-lg bg-[#07080C]/85 border border-white/[0.08] hover:border-white/25 text-slate-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
            title={isSoundMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label="Sound Toggle"
          >
            {isSoundMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
          </button>
        </div>
      </div>

      {/* 2026 Kinetic Stacked Viewport with Pointer/Touch Swipe & Parallax */}
      <div className="absolute inset-0 z-20">
        <KineticMediaStage
          slides={slides}
          activeIndex={selectedIdx}
          onChangeIndex={handleSelectFighter}
          isAr={isAr}
          aspectClassName="w-full h-full"
          objectPosition="top"
          perspectiveTilt={tilt}
          scaleBoost={isExecutingMove ? 1.03 : 1}
          showControls={true}
          showScrubBar={false}
          onTapSlide={() => handleExecuteSignatureMove()}
          renderOverlay={() => (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/38 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#07080C]/65 via-transparent to-transparent pointer-events-none z-10" />

              {isExecutingMove && (
                <div
                  key={strikeKey}
                  className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-0 border-2 border-[#D4AF37]/40 rounded-2xl" />
                  <div className="px-5 py-2.5 rounded-xl bg-[#07080C]/95 backdrop-blur-md border border-[#D4AF37]/60 text-[#D4AF37] text-xs md:text-sm font-semibold tracking-wider font-mono tabular-nums shadow-2xl flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#10B981]" />
                    <span>{lastStrikeText}</span>
                  </div>
                </div>
              )}

              <div className="absolute bottom-32 inset-x-0 flex justify-center pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-3 py-1 rounded-lg bg-[#07080C]/90 backdrop-blur-md border border-white/15 text-[11px] font-medium text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>
                    {tr(currentLang, {
                      en: 'Swipe to switch · Click for telemetry pulse',
                      es: 'Desliza para cambiar · Clic para pulso biométrico',
                      fr: 'Glissez pour changer · Clic pour télémétrie',
                      ar: 'اسحب للتبديل أو اضغط لقياس الذروة'
                    })}
                  </span>
                </div>
              </div>
            </>
          )}
        />
      </div>

      {/* Compact Bottom Interactive Panel */}
      <div className="absolute bottom-3 inset-x-3 z-30 space-y-2 pointer-events-auto">
        <div className="p-2.5 sm:p-3 rounded-xl bg-[#0C0E14]/92 backdrop-blur-xl border border-white/[0.08] flex items-center justify-between gap-2.5">
          <div className="space-y-0.5 text-start min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
                {isAr ? activeFighter.nameAr : activeFighter.nameEn}
              </h4>
              <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[9px] font-medium text-slate-300 font-mono">
                {activeFighter.gender === 'male'
                  ? tr(currentLang, { en: 'Pro Striker', es: 'Atleta Pro', fr: 'Combattant Pro', ar: 'بطل محترف' })
                  : tr(currentLang, { en: 'Elite Champion', es: 'Campeona Élite', fr: 'Championne Élite', ar: 'بطلة النخبة' })}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 line-clamp-1">
              {isAr ? activeFighter.physiqueAr : activeFighter.physiqueEn}
            </p>

            <p className="text-[10px] font-semibold text-[#D4AF37] line-clamp-1 font-mono tabular-nums">
              {isAr ? activeFighter.combatMoveNameAr : activeFighter.combatMoveNameEn} · {activeFighter.auraPower.toLocaleString('en-US')} AU
            </p>
          </div>

          <button
            type="button"
            onClick={handleExecuteSignatureMove}
            className={`px-3 py-2 rounded-lg text-[11px] font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${
              isExecutingMove
                ? 'bg-[#10B981] text-[#07080C]'
                : 'bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C]'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>
              {tr(currentLang, {
                en: 'TELEMETRY',
                es: 'TELEMETRÍA',
                fr: 'TÉLÉMÉTRIE',
                ar: 'قياس النبض'
              })}
            </span>
          </button>
        </div>

        {/* Continuous Progress Scrub + Magnetic Athlete Filmstrip Rail */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 px-0.5">
            {ANIME_FIGHTERS.map((f, idx) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleSelectFighter(idx)}
                aria-label={`Select ${f.nameEn}`}
                className="flex-1 h-1 rounded-full bg-white/[0.12] overflow-hidden cursor-pointer"
              >
                <span
                  className="block h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: idx === selectedIdx ? '100%' : idx < selectedIdx ? '100%' : '0%',
                    opacity: idx === selectedIdx ? 1 : idx < selectedIdx ? 0.45 : 0,
                    backgroundColor: activeFighter.themeColor
                  }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => handleSelectFighter((selectedIdx - 1 + ANIME_FIGHTERS.length) % ANIME_FIGHTERS.length)}
              className="w-7 h-7 rounded-lg bg-[#0C0E14]/90 border border-white/[0.08] hover:border-[#D4AF37]/50 text-slate-300 hover:text-[#D4AF37] hidden sm:flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              aria-label="Prev Athlete"
            >
              {isAr ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>

            <div
              ref={railContainerRef}
              onWheel={(e) => {
                if (railContainerRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                  railContainerRef.current.scrollLeft += e.deltaY;
                }
              }}
              className="flex-1 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {ANIME_FIGHTERS.map((fighter, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <button
                    key={fighter.id}
                    ref={(el) => {
                      stripRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => handleSelectFighter(idx)}
                    className={`snap-center flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all duration-300 cursor-pointer relative shrink-0 ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[#12151E] shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                        : 'border-white/[0.08] bg-[#0C0E14]/85 opacity-70 hover:opacity-100 hover:border-white/20'
                    }`}
                    title={isAr ? fighter.nameAr : fighter.nameEn}
                  >
                    <div className="w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={fighter.image}
                        alt={fighter.nameEn}
                        onError={handleImageError}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="text-start">
                      <span className="text-[10px] font-semibold text-white block leading-tight">
                        {isAr ? fighter.nameAr : fighter.nameEn}
                      </span>
                      <span className="text-[9px] text-slate-400 block leading-tight">
                        {fighter.gender === 'male'
                          ? tr(currentLang, { en: 'Male Athlete', es: 'Atleta (M)', fr: 'Athlète (H)', ar: 'رياضي معزز' })
                          : tr(currentLang, { en: 'Female Athlete', es: 'Atleta (F)', fr: 'Athlète (F)', ar: 'رياضية معززة' })}
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
                className="px-2.5 py-1.5 rounded-lg bg-[#12151E] hover:bg-[#191D29] border border-white/[0.1] hover:border-[#D4AF37]/50 text-slate-200 hover:text-white text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>{tr(currentLang, { en: 'GEAR', es: 'EQUIPO', fr: 'ÉQUIPEMENT', ar: 'المتجر' })}</span>
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
