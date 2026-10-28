import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Camera, 
  CameraOff, 
  Volume2, 
  VolumeX, 
  Flame, 
  Heart, 
  Zap, 
  Trophy, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Crosshair, 
  Award, 
  Shield, 
  Activity,
  History,
  Swords,
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  UserCheck
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { 
  LIVE_ARENA_IMAGE, 
  FOUNDER_YAM_SUW_IMAGE, 
  FOUNDER_MTK_IMAGE, 
  FOUNDER_ARB_IMAGE, 
  YARD300_BRAND_LOGO,
  CYBER_RONIN_BLADE_IMAGE,
  TITAN_BRAWLER_IMAGE,
  REALISTIC_MMA_BRAWLER_IMAGE,
  CYBER_SHINOBI_IMAGE,
  BOXING_VALKYRIE_IMAGE,
  handleImageError 
} from '../constants';

interface CombatArenaProps {
  currentLang?: Language;
}

export interface BattleLogEntry {
  id: string;
  fighterName: string;
  opponentName: string;
  fighterAvatar: string;
  opponentAvatar: string;
  outcome: 'VICTORY' | 'DEFEAT' | 'DRAW';
  duration: string;
  caloriesBurned: number;
  maxHeartRate: number;
  combosLanded: number;
  powerAuraEarned: number;
  yardxReward: number;
  dateStr: string;
  divisionEn: string;
  divisionAr: string;
  specialMoveEn: string;
  specialMoveAr: string;
}

const INITIAL_BATTLE_LOGS: BattleLogEntry[] = [
  {
    id: 'b-01',
    fighterName: 'yam suw',
    opponentName: 'Titan Mecha Brawler',
    fighterAvatar: FOUNDER_YAM_SUW_IMAGE,
    opponentAvatar: TITAN_BRAWLER_IMAGE,
    outcome: 'VICTORY',
    duration: '04:45',
    caloriesBurned: 312.4,
    maxHeartRate: 174,
    combosLanded: 88,
    powerAuraEarned: 450,
    yardxReward: 120,
    dateStr: 'Oct 2, 2026 // 15:42',
    divisionEn: 'Hyrox Endurance Heavyweight Grand Prix',
    divisionAr: 'بطولة الهايروكس والتحمل للوزن الثقيل',
    specialMoveEn: 'Elemental Dragon Rush Knockout',
    specialMoveAr: 'اندفاع التنين العنصري القاضي'
  },
  {
    id: 'b-02',
    fighterName: 'A.R.B',
    opponentName: 'Cyber Ronin Blade',
    fighterAvatar: FOUNDER_ARB_IMAGE,
    opponentAvatar: CYBER_RONIN_BLADE_IMAGE,
    outcome: 'VICTORY',
    duration: '03:15',
    caloriesBurned: 245.8,
    maxHeartRate: 168,
    combosLanded: 94,
    powerAuraEarned: 520,
    yardxReward: 150,
    dateStr: 'Oct 2, 2026 // 14:10',
    divisionEn: 'Shaolin Tactical & Reflex Master League',
    divisionAr: 'دوري شاولين التكتيكي وسرعة البديهة',
    specialMoveEn: 'Tactical Checkmate Counter-Parry',
    specialMoveAr: 'هجمة كش ملك التكتيكية المرتدة'
  },
  {
    id: 'b-03',
    fighterName: 'm.t.k',
    opponentName: 'Cyber Shinobi Ghost',
    fighterAvatar: FOUNDER_MTK_IMAGE,
    opponentAvatar: CYBER_SHINOBI_IMAGE,
    outcome: 'VICTORY',
    duration: '05:30',
    caloriesBurned: 260.0,
    maxHeartRate: 152,
    combosLanded: 72,
    powerAuraEarned: 410,
    yardxReward: 95,
    dateStr: 'Oct 1, 2026 // 18:25',
    divisionEn: 'Zenith Pilates Core & Neuro-Recovery Cup',
    divisionAr: 'كأس استقرار الجذع والاستشفاء العصبي',
    specialMoveEn: 'Lotus Kinetic Energy Barrier',
    specialMoveAr: 'حاجز اللوتس الحركي لامتصاص الصدمات'
  },
  {
    id: 'b-04',
    fighterName: 'yam suw',
    opponentName: 'Jin Titan Brawler',
    fighterAvatar: FOUNDER_YAM_SUW_IMAGE,
    opponentAvatar: REALISTIC_MMA_BRAWLER_IMAGE,
    outcome: 'VICTORY',
    duration: '06:12',
    caloriesBurned: 420.5,
    maxHeartRate: 178,
    combosLanded: 110,
    powerAuraEarned: 600,
    yardxReward: 200,
    dateStr: 'Sep 30, 2026 // 20:04',
    divisionEn: 'Open 300 Iron Fist Championship',
    divisionAr: 'بطولة القبضة الحديدية المفتوحة 300',
    specialMoveEn: 'Four Elements Heavy Quake Strike',
    specialMoveAr: 'ضربة زلزال العناصر الأربعة الثقيلة'
  },
  {
    id: 'b-05',
    fighterName: 'A.R.B',
    opponentName: 'Boxing Valkyrie Champion',
    fighterAvatar: FOUNDER_ARB_IMAGE,
    opponentAvatar: BOXING_VALKYRIE_IMAGE,
    outcome: 'VICTORY',
    duration: '04:02',
    caloriesBurned: 298.2,
    maxHeartRate: 171,
    combosLanded: 86,
    powerAuraEarned: 480,
    yardxReward: 130,
    dateStr: 'Sep 29, 2026 // 19:15',
    divisionEn: 'Tactical Striking Invitational',
    divisionAr: 'بطولة القتال التكتيكي الدولية',
    specialMoveEn: 'Mindset Reflex Lockdown',
    specialMoveAr: 'شل حركة الخصم بالتنبؤ النفسي'
  }
];

export const CombatArena: React.FC<CombatArenaProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';

  // Live Workout State
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Real-time Metrics
  const [heartRate, setHeartRate] = useState<number>(142);
  const [calories, setCalories] = useState<number>(124.5);
  const [combos, setCombos] = useState<number>(36);
  const [powerAura, setPowerAura] = useState<number>(7400);
  const [workoutSeconds, setWorkoutSeconds] = useState<number>(245); // 04:05
  const [activeZone, setActiveZone] = useState<'FAT_BURN' | 'CARDIO' | 'LIMIT_BREAK'>('CARDIO');

  // Interactive Target Hits
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; active: boolean }[]>([
    { id: 1, x: 25, y: 35, active: true },
    { id: 2, x: 75, y: 30, active: true },
    { id: 3, x: 50, y: 65, active: true },
  ]);

  // Battle Log State
  const [battleLogs, setBattleLogs] = useState<BattleLogEntry[]>(INITIAL_BATTLE_LOGS);
  const [logFilter, setLogFilter] = useState<'ALL' | 'YAM_SUW' | 'ARB' | 'MTK'>('ALL');
  const [selectedLog, setSelectedLog] = useState<BattleLogEntry | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const arenaContainerRef = useRef<HTMLDivElement | null>(null);

  // Web Audio Synth Helper for Icon Sounds & Strikes
  const playSynthSound = (type: 'punch' | 'heartbeat' | 'click' | 'powerup' | 'camera') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'punch') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'powerup') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Workout Timer & Live Heart Rate / Calorie Engine
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setWorkoutSeconds(prev => prev + 1);

        // Fluctuate Heart Rate dynamically (135 - 175 BPM)
        setHeartRate(prev => {
          const delta = Math.floor(Math.random() * 5) - 2;
          const nextBpm = Math.min(Math.max(prev + delta, 130), 178);
          if (nextBpm > 165) setActiveZone('LIMIT_BREAK');
          else if (nextBpm > 145) setActiveZone('CARDIO');
          else setActiveZone('FAT_BURN');
          return nextBpm;
        });

        // Calories burn rate (~0.22 kcal per sec)
        setCalories(prev => Number((prev + 0.22).toFixed(1)));

        // Power level increase
        setPowerAura(prev => Math.min(prev + 15, 9999));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Handle Webcam Stream Toggle
  useEffect(() => {
    if (cameraActive) {
      playSynthSound('camera');
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(() => {
          setCameraActive(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [cameraActive]);

  // Handle Punch Target Hit
  const handleHitTarget = (id: number) => {
    playSynthSound('punch');
    setCombos(prev => prev + 1);
    setPowerAura(prev => Math.min(prev + 120, 9999));

    // Relocate target
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          x: Math.floor(Math.random() * 60) + 20,
          y: Math.floor(Math.random() * 50) + 25
        };
      }
      return t;
    }));
  };

  // Finish Round & Save to Battle Log
  const handleFinishRound = () => {
    soundFX.playPowerUp();
    const newEntry: BattleLogEntry = {
      id: `b-${Date.now()}`,
      fighterName: 'yam suw',
      opponentName: 'Cyber Ronin S-Rank',
      fighterAvatar: FOUNDER_YAM_SUW_IMAGE,
      opponentAvatar: LIVE_ARENA_IMAGE,
      outcome: 'VICTORY',
      duration: formatTime(workoutSeconds),
      caloriesBurned: calories,
      maxHeartRate: heartRate,
      combosLanded: combos,
      powerAuraEarned: 350,
      yardxReward: 100,
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' // LIVE',
      divisionEn: 'Hyrox Endurance Grand Prix',
      divisionAr: 'بطولة الهايروكس والتحمل الكبرى',
      specialMoveEn: 'Elemental Dragon Strike Finish',
      specialMoveAr: 'ضربة التنين العنصري القاضية'
    };
    setBattleLogs(prev => [newEntry, ...prev]);
    setIsActive(false);
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    playSynthSound('click');
    if (!arenaContainerRef.current) return;
    if (!document.fullscreenElement) {
      arenaContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const filteredLogs = battleLogs.filter(log => {
    if (logFilter === 'YAM_SUW') return log.fighterName.toLowerCase().includes('yam suw');
    if (logFilter === 'ARB') return log.fighterName.toLowerCase().includes('a.r.b');
    if (logFilter === 'MTK') return log.fighterName.toLowerCase().includes('m.t.k');
    return true;
  });

  return (
    <section id="arena" className={`py-16 px-3 sm:px-4 md:px-12 bg-[#08090E] relative w-full max-w-full overflow-hidden overflow-x-hidden ${isAr ? 'text-right' : 'text-left'}`}>
      
      <div className="max-w-[1800px] w-full max-w-full overflow-x-hidden mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181126] border border-[#00F0FF] text-xs font-black text-[#00F0FF] uppercase tracking-widest mb-3 shadow-[0_0_15px_#00F0FF]">
              <Activity className="w-4 h-4 text-[#FFE600] animate-pulse" />
              <span>{isAr ? 'حلبة القتال المباشرة HUD' : 'LIVE COMBAT ARENA HUD'}</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black font-anime text-white">
              {isAr ? (
                <>
                  حلبة القتال الحية <span className="bg-gradient-to-r from-[#00F0FF] via-[#FF007A] to-[#FFE600] bg-clip-text text-transparent">وسجل المعارك التاريخي</span>
                </>
              ) : (
                <>
                  LIVE COMBAT ARENA <span className="bg-gradient-to-r from-[#00F0FF] via-[#FF007A] to-[#FFE600] bg-clip-text text-transparent">& BATTLE LOG HISTORY</span>
                </>
              )}
            </h2>
            <p className="text-gray-300 font-bold text-sm md:text-base mt-2">
              {isAr 
                ? 'عرض حي لمعدل نبضات القلب واستهلاك السعرات الحرارية وسجل تفاعلي كامل ومتحرك لنتائج وإحصائيات النزالات السابقة للمؤسسين والأبطال.'
                : 'Real-time heart rate & calorie burn overlay with complete scrolling Battle Log history recording past fight results, combos, and biometric stats.'}
            </p>
          </div>

          {/* Top Control Bar with Audio Feedback on Icons */}
          <div className="flex items-center gap-2.5 bg-[#090A10] p-2 rounded-2xl border border-gray-900">
            
            {/* Start/Pause Workout */}
            <button
              onClick={() => {
                if (!isActive) {
                  soundFX.playStartTrainingSound();
                } else {
                  soundFX.playButtonClick();
                }
                setIsActive(!isActive);
              }}
              className={`px-5 py-2.5 rounded-xl font-black text-xs font-anime flex items-center gap-2 transition-all ${
                isActive 
                  ? 'bg-red-700 text-white' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? (isAr ? 'إيقاف مؤقت' : 'PAUSE ARENA') : (isAr ? 'بدء الجولة الحية ⚡' : 'START LIVE ARENA ⚡')}</span>
            </button>

            {/* Save Round to Log */}
            {isActive && (
              <button
                onClick={handleFinishRound}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-black text-xs font-anime flex items-center gap-1.5 transition-all"
                title={isAr ? 'حفظ الجولة في سجل المعارك' : 'Finish Round & Save to Battle Log'}
              >
                <Award className="w-4 h-4" />
                <span>{isAr ? 'إنهاء وحفظ' : 'FINISH ROUND'}</span>
              </button>
            )}

            {/* Reset Stats */}
            <button
              onClick={() => {
                playSynthSound('click');
                setCalories(0);
                setCombos(0);
                setWorkoutSeconds(0);
              }}
              className="p-2.5 rounded-xl bg-[#121420] border border-gray-900 text-gray-300 hover:text-white hover:border-gray-700 transition-all"
              title={isAr ? 'إعادة تعيين العداد' : 'Reset Workout'}
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Toggle Webcam Camera */}
            <button
              onClick={() => setCameraActive(!cameraActive)}
              className={`p-2.5 rounded-xl border transition-all ${
                cameraActive 
                  ? 'bg-red-900 text-white border-red-800' 
                  : 'bg-[#121420] border-gray-900 text-gray-400 hover:text-white'
              }`}
              title={cameraActive ? (isAr ? 'إيقاف الكاميرا' : 'Disable Camera') : (isAr ? 'تشغيل كاميرا النزال' : 'Enable Camera Feed')}
            >
              {cameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled 
                  ? 'bg-[#121420] text-white border-gray-800' 
                  : 'bg-[#121420] border-gray-900 text-gray-500'
              }`}
              title={soundEnabled ? 'Mute Arena SFX' : 'Enable Arena SFX'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-[#121420] border border-gray-900 text-gray-400 hover:text-white transition-all"
              title="Fullscreen Mode"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

          </div>
        </div>

        {/* HUD ARENA CANVAS CONTAINER */}
        <div 
          ref={arenaContainerRef}
          className="relative w-full aspect-video md:aspect-[21/9] min-h-[500px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.4)] bg-[#0A0B10] flex flex-col justify-between p-4 md:p-8 select-none"
        >
          {/* Background Layer: Real Webcam or Cinematic Anime Combat Dojo */}
          {cameraActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover -scale-x-100 filter contrast-125 brightness-90"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <img loading="lazy" decoding="async" 
                src={LIVE_ARENA_IMAGE} 
                alt="Live Cyberpunk Combat Arena"
                onError={handleImageError}
                className="w-full h-full object-cover object-center filter saturate-150 contrast-125 opacity-70 scale-105 animate-aura"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090E] via-transparent to-[#08090E]/60"></div>
              <div className="absolute inset-0 bg-cyber-grid opacity-30 mix-blend-screen pointer-events-none"></div>
            </div>
          )}

          {/* Interactive Punch Targets (Click or strike to simulate punch detection) */}
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {targets.map(target => (
              <div
                key={target.id}
                onClick={() => handleHitTarget(target.id)}
                style={{ top: `${target.y}%`, left: `${target.x}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair group p-2"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-dashed border-[#FFE600] flex items-center justify-center animate-ping-slow group-hover:scale-125 transition-transform duration-200">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#E50914] flex items-center justify-center shadow-[0_0_20px_#E50914] group-active:scale-90">
                    <Crosshair className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="block text-[10px] font-black text-[#FFE600] font-anime bg-black/80 px-2 py-0.5 rounded text-center mt-1 shadow-md border border-[#FFE600]/40">
                  {isAr ? 'الكم هنا!' : 'HIT!'}
                </span>
              </div>
            ))}
          </div>

          {/* HUD LAYER TOP: Round Info, Active Heart Rate Zone, Power Level */}
          <div className="relative z-10 flex items-center justify-between gap-4 backdrop-blur-md bg-black/50 p-3 md:p-4 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1 rounded-xl bg-[#E50914] text-white font-black font-anime text-sm md:text-base flex items-center gap-1.5 shadow-[0_0_15px_#E50914]">
                <Flame className="w-4 h-4 fill-white" />
                <span>ROUND 01</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-xl md:text-2xl font-black font-anime text-white">{formatTime(workoutSeconds)}</span>
              </div>
            </div>

            {/* Heart Rate Intensity Zone Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300 hidden sm:inline">{isAr ? 'نطاق الجهد:' : 'AURA ZONE:'}</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-black font-anime uppercase tracking-wider shadow-md ${
                activeZone === 'LIMIT_BREAK'
                  ? 'bg-[#E50914] text-white shadow-[0_0_20px_#E50914] animate-pulse'
                  : activeZone === 'CARDIO'
                    ? 'bg-[#FFE600] text-black shadow-[0_0_15px_#FFE600]'
                    : 'bg-[#00F0FF] text-black shadow-[0_0_15px_#00F0FF]'
              }`}>
                {activeZone === 'LIMIT_BREAK' ? '⚡ LIMIT BREAK (ANAEROBIC)' : activeZone === 'CARDIO' ? '🔥 HIGH CARDIO' : '💧 FAT BURN FLOW'}
              </span>
            </div>

            {/* Total Power Aura Gauge */}
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FFE600] fill-[#FFE600] animate-bounce" />
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'طاقة الهالة' : 'POWER LEVEL'}</span>
                <span className="text-base md:text-xl font-black font-anime text-[#FFE600] neon-text-yellow">{powerAura} AP</span>
              </div>
            </div>

          </div>

          {/* HUD LAYER MIDDLE: Center Crosshair Target System */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto pointer-events-none">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-dashed border-[#00F0FF]/60 flex items-center justify-center relative animate-spin-slow">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border border-[#FF007A]/60 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#FFE600] shadow-[0_0_20px_#FFE600]"></div>
              </div>
            </div>
            <span className="mt-4 px-4 py-1 rounded-full bg-[#0A0B10]/80 border border-[#00F0FF] text-xs font-black font-anime text-[#00F0FF] tracking-widest backdrop-blur-md">
              {isAr ? '🎯 حرك جسدك والكم الأهداف المضيئة' : '🎯 TARGET ACQUISITION SYSTEM'}
            </span>
          </div>

          {/* HUD LAYER BOTTOM: Real-time Heart Rate & Calorie Overlay */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 backdrop-blur-md bg-black/50 p-4 md:p-6 rounded-2xl border border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            
            {/* Real-time Heart Rate Monitor Overlay */}
            <div className="bg-[#121422]/80 border border-[#FF007A]/60 p-4 rounded-xl flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#FF007A] animate-ping" />
                  <span className="text-xs font-black text-gray-300 uppercase">{isAr ? 'نبضات القلب MHR' : 'HEART RATE'}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-anime text-[#FF007A] neon-text-pink">{heartRate}</span>
                  <span className="text-xs font-bold text-gray-400">BPM</span>
                </div>
              </div>
              
              {/* Wave pulse animation */}
              <div className="flex items-end gap-1 h-10">
                <span className="w-1.5 bg-[#FF007A] rounded-full animate-bounce h-6"></span>
                <span className="w-1.5 bg-[#FF007A] rounded-full animate-bounce h-10 delay-100"></span>
                <span className="w-1.5 bg-[#FF007A] rounded-full animate-bounce h-4 delay-200"></span>
                <span className="w-1.5 bg-[#FF007A] rounded-full animate-bounce h-8 delay-300"></span>
              </div>
            </div>

            {/* Real-time Calorie Burn Overlay */}
            <div className="bg-[#121422]/80 border border-[#FFE600]/60 p-4 rounded-xl flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#FFE600] animate-bounce" />
                  <span className="text-xs font-black text-gray-300 uppercase">{isAr ? 'السعرات المحروقة' : 'CALORIES BURNED'}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-anime text-[#FFE600] neon-text-yellow">{calories}</span>
                  <span className="text-xs font-bold text-gray-400">KCAL</span>
                </div>
              </div>

              <span className="text-xs font-black px-2.5 py-1 bg-[#1E1C0A] text-[#FFE600] rounded-lg border border-[#FFE600]/40">
                ~18.5/min
              </span>
            </div>

            {/* Combo Hits & Strike Multiplier Overlay */}
            <div className="bg-[#121422]/80 border border-[#00F0FF]/60 p-4 rounded-xl flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#00F0FF]" />
                  <span className="text-xs font-black text-gray-300 uppercase">{isAr ? 'اللكمات المتتالية' : 'STRIKE COMBOS'}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-anime text-[#00F0FF] neon-text-cyan">{combos}</span>
                  <span className="text-xs font-bold text-gray-400">HITS</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-[#00F0FF] block">3x MULTIPLIER</span>
                <span className="text-[10px] font-bold text-gray-400">{isAr ? 'مضاعف السرعة' : 'Overdrive Speed'}</span>
              </div>
            </div>

          </div>

        </div>

        {/* SCROLLING BATTLE LOG HISTORY SECTION */}
        <div className="rounded-3xl bg-[#0E101A] border-2 border-gray-800 p-6 md:p-8 space-y-6 shadow-2xl relative">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#FFE600] flex items-center justify-center text-black font-black shadow-[0_0_15px_#E50914]">
                <History className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black font-anime text-white flex items-center gap-2">
                  <span>{isAr ? 'سجل المعارك والنزالات السابقة' : 'ARENA BATTLE LOG & FIGHT HISTORY'}</span>
                  <span className="text-xs bg-[#E50914] text-white px-2 py-0.5 rounded-full font-sans font-bold">
                    {filteredLogs.length} LOGS
                  </span>
                </h3>
                <p className="text-xs text-gray-400 font-bold">
                  {isAr 
                    ? 'أرشيف تفصيلي يسجل إحصائيات المعارك السابقة: النبض، السعرات، الكومبو، ومكافآت YARDX' 
                    : 'Historical fight telemetry: duration, max heart rate, strike accuracy, and token rewards.'}
                </p>
              </div>
            </div>

            {/* Filter by Fighter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex gap-1.5 p-1 bg-[#141624] rounded-xl border border-gray-800 text-xs font-bold font-anime">
                <button
                  onClick={() => setLogFilter('ALL')}
                  className={`px-3 py-1 rounded-lg transition-all ${logFilter === 'ALL' ? 'bg-[#FFE600] text-black font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  {isAr ? 'الكل' : 'ALL'}
                </button>
                <button
                  onClick={() => setLogFilter('YAM_SUW')}
                  className={`px-3 py-1 rounded-lg transition-all ${logFilter === 'YAM_SUW' ? 'bg-[#FF007A] text-white font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  yam suw
                </button>
                <button
                  onClick={() => setLogFilter('ARB')}
                  className={`px-3 py-1 rounded-lg transition-all ${logFilter === 'ARB' ? 'bg-[#FFE600] text-black font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  A.R.B
                </button>
                <button
                  onClick={() => setLogFilter('MTK')}
                  className={`px-3 py-1 rounded-lg transition-all ${logFilter === 'MTK' ? 'bg-[#00F0FF] text-black font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  m.t.k
                </button>
              </div>
            </div>
          </div>

          {/* Scrolling Battle Logs Grid */}
          <div className="max-h-[460px] overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
            {filteredLogs.map((log) => (
              <div 
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="p-4 md:p-5 rounded-2xl bg-[#141624] border border-gray-800/80 hover:border-[#00F0FF]/60 hover:bg-[#181a2e] transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                
                {/* Left: Fighters Encounter & Division */}
                <div className="flex items-center gap-4">
                  
                  {/* Avatars Collision */}
                  <div className="flex items-center -space-x-3 shrink-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_12px_rgba(255,230,0,0.5)] bg-black z-10">
                      <img loading="lazy" decoding="async" 
                        src={log.fighterAvatar} 
                        alt={log.fighterName} 
                        onError={handleImageError}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-black opacity-80">
                      <img loading="lazy" decoding="async" 
                        src={log.opponentAvatar} 
                        alt={log.opponentName} 
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Fighter Details */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black font-anime text-white group-hover:text-[#00F0FF] transition-colors">
                        {log.fighterName}
                      </span>
                      <span className="text-xs font-black text-[#E50914] font-anime">VS</span>
                      <span className="text-xs font-bold text-gray-400">
                        {log.opponentName}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#FFE600]">
                      {isAr ? log.divisionAr : log.divisionEn}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                      <span>{log.dateStr}</span>
                      <span>•</span>
                      <span className="text-[#00F0FF] font-bold">
                        {isAr ? `الحركة القاضية: ${log.specialMoveAr}` : `Finish: ${log.specialMoveEn}`}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Right: Key Battle Metrics */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 border-t md:border-t-0 border-gray-800 pt-3 md:pt-0">
                  
                  {/* Outcome Badge */}
                  <div className="text-center">
                    <span className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs font-black font-anime">
                      {log.outcome}
                    </span>
                    <span className="block text-[10px] text-gray-400 mt-1 font-mono">{log.duration}</span>
                  </div>

                  {/* Calories */}
                  <div className="text-center min-w-[70px]">
                    <span className="block text-sm font-black font-anime text-[#FFE600]">{log.caloriesBurned}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">{isAr ? 'سعرة' : 'KCAL'}</span>
                  </div>

                  {/* Max Heart Rate */}
                  <div className="text-center min-w-[70px]">
                    <span className="block text-sm font-black font-anime text-[#FF007A]">{log.maxHeartRate}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">BPM</span>
                  </div>

                  {/* Combos */}
                  <div className="text-center min-w-[70px]">
                    <span className="block text-sm font-black font-anime text-[#00F0FF]">{log.combosLanded}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">{isAr ? 'ضربة' : 'HITS'}</span>
                  </div>

                  {/* Reward */}
                  <div className="text-center bg-[#0A0B10] px-3 py-1.5 rounded-xl border border-gray-800 min-w-[80px]">
                    <span className="block text-xs font-black font-anime text-white">+{log.yardxReward} YARDX</span>
                    <span className="text-[9px] text-[#FFE600] font-black">+{log.powerAuraEarned} AP</span>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Modal / Detail Inspection on Click */}
          {selectedLog && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLog(null)}
            >
              <div 
                className="w-full max-w-lg bg-[#0E101A] rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_0_50px_rgba(0,240,255,0.4)] text-white relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <img loading="lazy" decoding="async" src={selectedLog.fighterAvatar} alt={selectedLog.fighterName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black font-anime text-white">{selectedLog.fighterName}</h4>
                      <span className="text-xs text-emerald-400 font-bold">✓ {selectedLog.outcome} — {selectedLog.duration}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedLog(null)}
                    className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-[#141624] rounded-xl border border-gray-800">
                    <span className="text-xs text-gray-400 block font-bold">{isAr ? 'السعرات المحروقة' : 'Calories Burned'}</span>
                    <span className="text-2xl font-black text-[#FFE600] font-anime">{selectedLog.caloriesBurned} KCAL</span>
                  </div>
                  <div className="p-3 bg-[#141624] rounded-xl border border-gray-800">
                    <span className="text-xs text-gray-400 block font-bold">{isAr ? 'أقصى نبض MHR' : 'Max Heart Rate'}</span>
                    <span className="text-2xl font-black text-[#FF007A] font-anime">{selectedLog.maxHeartRate} BPM</span>
                  </div>
                  <div className="p-3 bg-[#141624] rounded-xl border border-gray-800">
                    <span className="text-xs text-gray-400 block font-bold">{isAr ? 'اللكمات الناجحة' : 'Combos Landed'}</span>
                    <span className="text-2xl font-black text-[#00F0FF] font-anime">{selectedLog.combosLanded} HITS</span>
                  </div>
                  <div className="p-3 bg-[#141624] rounded-xl border border-gray-800">
                    <span className="text-xs text-gray-400 block font-bold">{isAr ? 'مكافأة النزال' : 'Reward Bounty'}</span>
                    <span className="text-xl font-black text-white font-anime">+{selectedLog.yardxReward} YARDX</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141624] border border-[#FFE600]/30 text-xs font-bold text-gray-300 space-y-1">
                  <span className="text-[#FFE600] font-anime block uppercase tracking-wider">
                    ⚡ {isAr ? 'الحركة القاضية الخاصة' : 'SIGNATURE SPECIAL MOVE'}:
                  </span>
                  <p className="text-white text-sm">
                    {isAr ? selectedLog.specialMoveAr : selectedLog.specialMoveEn}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#FFE600] text-black font-black font-anime text-xs shadow-md"
                >
                  {isAr ? 'إغلاق السجل' : 'CLOSE RECORD'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default CombatArena;
