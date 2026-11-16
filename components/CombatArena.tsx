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
  Crosshair, 
  Award, 
  Activity,
  History,
  Clock,
  Filter
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { 
  LIVE_ARENA_IMAGE, 
  FOUNDER_YAM_SUW_IMAGE, 
  FOUNDER_MTK_IMAGE,
  FOUNDER_ARB_IMAGE, 
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
  divisionEs: string;
  divisionFr: string;
  divisionAr: string;
  specialMoveEn: string;
  specialMoveEs: string;
  specialMoveFr: string;
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
    divisionEs: 'Gran Premio Hyrox Resistencia Peso Pesado',
    divisionFr: 'Grand Prix Hyrox Endurance Poids Lourd',
    divisionAr: 'بطولة الهايروكس والتحمل للوزن الثقيل',
    specialMoveEn: 'Elemental Dragon Rush Knockout',
    specialMoveEs: 'Embestida Elemental del Dragón (KO)',
    specialMoveFr: 'Ruée Élémentaire du Dragon (KO)',
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
    divisionEs: 'Liga Maestra Shaolin de Táctica y Reflejos',
    divisionFr: 'Ligue Maître Shaolin Tactique & Réflexes',
    divisionAr: 'دوري شاولين التكتيكي وسرعة البديهة',
    specialMoveEn: 'Tactical Checkmate Counter-Parry',
    specialMoveEs: 'Contraataque Táctico Jaque Mate',
    specialMoveFr: 'Contre-Parade Tactique Échec et Mat',
    specialMoveAr: 'هجمة كش ملك التكتيكية المرتدة'
  },
  {
    id: 'b-03',
    fighterName: 'm t k',
    opponentName: 'Ninja Kunoichi Apex',
    fighterAvatar: FOUNDER_MTK_IMAGE,
    opponentAvatar: CYBER_SHINOBI_IMAGE,
    outcome: 'VICTORY',
    duration: '05:20',
    caloriesBurned: 380.6,
    maxHeartRate: 172,
    combosLanded: 104,
    powerAuraEarned: 580,
    yardxReward: 180,
    dateStr: 'Oct 1, 2026 // 18:30',
    divisionEn: 'Functional Mobility & Conditioning Grand Slam',
    divisionEs: 'Grand Slam de Movilidad y Acondicionamiento Funcional',
    divisionFr: 'Grand Chelem Mobilité & Conditionnement Fonctionnel',
    divisionAr: 'بطولة اللياقة الوظيفية والاستشفاء القتالي الكبرى',
    specialMoveEn: 'Valkyrie Core Kinetic Surge',
    specialMoveEs: 'Impulso Cinético Núcleo Valquiria',
    specialMoveFr: 'Déferlante Cinétique Valkyrie',
    specialMoveAr: 'اندفاع طاقة الجذع الحركية الشاملة'
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
    divisionEs: 'Campeonato Abierto Puño de Hierro 300',
    divisionFr: 'Championnat Open Poing de Fer 300',
    divisionAr: 'بطولة القبضة الحديدية المفتوحة 300',
    specialMoveEn: 'Four Elements Heavy Quake Strike',
    specialMoveEs: 'Golpe Sísmico de los Cuatro Elementos',
    specialMoveFr: 'Frappe Sismique des Quatre Éléments',
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
    divisionEs: 'Invitacional de Golpeo Táctico',
    divisionFr: 'Tournoi d’Élite de Frappe Tactique',
    divisionAr: 'بطولة القتال التكتيكي الدولية',
    specialMoveEn: 'Mindset Reflex Lockdown',
    specialMoveEs: 'Bloqueo Mental de Reflejos',
    specialMoveFr: 'Verrouillage Mental des Réflexes',
    specialMoveAr: 'شل حركة الخصم بالتنبؤ النفسي'
  }
];

export const CombatArena: React.FC<CombatArenaProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';

  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [heartRate, setHeartRate] = useState<number>(142);
  const [calories, setCalories] = useState<number>(124.5);
  const [combos, setCombos] = useState<number>(36);
  const [powerAura, setPowerAura] = useState<number>(7400);
  const [workoutSeconds, setWorkoutSeconds] = useState<number>(245);
  const [activeZone, setActiveZone] = useState<'FAT_BURN' | 'CARDIO' | 'LIMIT_BREAK'>('CARDIO');

  const [targets, setTargets] = useState<{ id: number; x: number; y: number; active: boolean }[]>([
    { id: 1, x: 25, y: 35, active: true },
    { id: 2, x: 75, y: 30, active: true },
    { id: 3, x: 50, y: 65, active: true },
  ]);

  const [battleLogs, setBattleLogs] = useState<BattleLogEntry[]>(INITIAL_BATTLE_LOGS);
  const [logFilter, setLogFilter] = useState<'ALL' | 'YAM_SUW' | 'MTK' | 'ARB'>('ALL');
  const [selectedLog, setSelectedLog] = useState<BattleLogEntry | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const arenaContainerRef = useRef<HTMLDivElement | null>(null);

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
    } catch {}
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setWorkoutSeconds(prev => prev + 1);
        setHeartRate(prev => {
          const delta = Math.floor(Math.random() * 5) - 2;
          const nextBpm = Math.min(Math.max(prev + delta, 130), 178);
          if (nextBpm > 165) setActiveZone('LIMIT_BREAK');
          else if (nextBpm > 145) setActiveZone('CARDIO');
          else setActiveZone('FAT_BURN');
          return nextBpm;
        });
        setCalories(prev => Number((prev + 0.22).toFixed(1)));
        setPowerAura(prev => Math.min(prev + 15, 9999));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

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

  const handleHitTarget = (id: number) => {
    playSynthSound('punch');
    setCombos(prev => prev + 1);
    setPowerAura(prev => Math.min(prev + 120, 9999));

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

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
      divisionEs: 'Gran Premio Hyrox Resistencia',
      divisionFr: 'Grand Prix Hyrox Endurance',
      divisionAr: 'بطولة الهايروكس والتحمل الكبرى',
      specialMoveEn: 'Elemental Dragon Strike Finish',
      specialMoveEs: 'Remate Golpe Elemental del Dragón',
      specialMoveFr: 'Finition Frappe du Dragon Élémentaire',
      specialMoveAr: 'ضربة التنين العنصري القاضية'
    };
    setBattleLogs(prev => [newEntry, ...prev]);
    setIsActive(false);
  };

  const toggleFullscreen = () => {
    playSynthSound('click');
    if (!arenaContainerRef.current) return;
    if (!document.fullscreenElement) {
      arenaContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const filteredLogs = battleLogs.filter(log => {
    if (logFilter === 'YAM_SUW') return log.fighterName.toLowerCase().includes('yam suw');
    if (logFilter === 'MTK') return log.fighterName.toLowerCase().includes('m t k') || log.fighterName.toLowerCase().includes('m.t.k');
    if (logFilter === 'ARB') return log.fighterName.toLowerCase().includes('a.r.b');
    return true;
  });

  const getDivision = (log: BattleLogEntry) =>
    currentLang === 'ar' ? log.divisionAr : currentLang === 'fr' ? log.divisionFr : currentLang === 'es' ? log.divisionEs : log.divisionEn;

  const getSpecialMove = (log: BattleLogEntry) =>
    currentLang === 'ar' ? log.specialMoveAr : currentLang === 'fr' ? log.specialMoveFr : currentLang === 'es' ? log.specialMoveEs : log.specialMoveEn;

  return (
    <section
      id="arena"
      dir={isAr ? 'rtl' : 'ltr'}
      className={`py-16 px-3 sm:px-4 md:px-12 bg-[#050807] relative w-full max-w-full overflow-hidden overflow-x-hidden ${isAr ? 'text-right' : 'text-left'}`}
    >
      <div className="max-w-[1800px] w-full max-w-full overflow-x-hidden mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#080D0B] border border-[#10B981]/60 text-xs font-black text-[#10B981] uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Activity className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span>
                {tr(currentLang, {
                  ar: 'حلبة القتال والبيانات الحية HUD',
                  fr: 'HUD ARÈNE DE COMBAT EN DIRECT',
                  es: 'HUD ARENA DE COMBATE EN VIVO',
                  en: 'LIVE COMBAT ARENA HUD'
                })}
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black font-anime text-white">
              {tr(currentLang, {
                ar: 'حلبة القتال الحية ',
                fr: 'ARÈNE DE COMBAT EN DIRECT ',
                es: 'ARENA DE COMBATE EN VIVO ',
                en: 'LIVE COMBAT ARENA '
              })}
              <span className="bg-gradient-to-r from-[#10B981] via-[#D4AF37] to-white bg-clip-text text-transparent">
                {tr(currentLang, {
                  ar: 'وسجل المعارك التاريخي',
                  fr: '& HISTORIQUE DES COMBATS',
                  es: 'E HISTORIAL DE BATALLAS',
                  en: '& BATTLE LOG HISTORY'
                })}
              </span>
            </h2>
            <p className="text-gray-300 font-bold text-sm md:text-base mt-2 max-w-3xl">
              {tr(currentLang, {
                ar: 'عرض حي لمعدل نبضات القلب واستهلاك السعرات الحرارية وسجل تفاعلي كامل لنتائج وإحصائيات النزالات للمؤسسين والأبطال.',
                fr: 'Suivi en temps réel de la fréquence cardiaque et des calories avec historique interactif des combats et statistiques biométriques.',
                es: 'Superposición en vivo de pulso y quema calórica con historial completo de combates, combos y estadísticas biométricas.',
                en: 'Real-time heart rate & calorie burn overlay with complete scrolling Battle Log history recording past fight results, combos, and biometric stats.'
              })}
            </p>
          </div>

          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center gap-2.5 bg-[#080D0B] p-2 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                if (!isActive) soundFX.playStartTrainingSound();
                else soundFX.playButtonClick();
                setIsActive(!isActive);
              }}
              className={`px-5 py-2.5 rounded-xl font-black text-xs font-anime flex items-center gap-2 transition-all cursor-pointer ${
                isActive ? 'bg-red-700 text-white' : 'bg-[#10B981] text-[#050807] hover:bg-emerald-400'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>
                {isActive
                  ? tr(currentLang, { ar: 'إيقاف مؤقت', fr: 'PAUSE ARÈNE', es: 'PAUSAR ARENA', en: 'PAUSE ARENA' })
                  : tr(currentLang, { ar: 'بدء الجولة الحية ⚡', fr: 'DÉMARRER L’ARÈNE ⚡', es: 'INICIAR ARENA EN VIVO ⚡', en: 'START LIVE ARENA ⚡' })}
              </span>
            </button>

            {isActive && (
              <button
                onClick={handleFinishRound}
                className="px-4 py-2.5 rounded-xl bg-[#0D1512] hover:bg-emerald-950 text-white border border-white/10 font-black text-xs font-anime flex items-center gap-1.5 transition-all cursor-pointer"
                title={tr(currentLang, { ar: 'حفظ الجولة في السجل', fr: 'Terminer et Enregistrer', es: 'Finalizar y Guardar', en: 'Finish Round & Save' })}
              >
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>{tr(currentLang, { ar: 'إنهاء وحفظ', fr: 'TERMINER', es: 'FINALIZAR', en: 'FINISH ROUND' })}</span>
              </button>
            )}

            <button
              onClick={() => {
                playSynthSound('click');
                setCalories(0);
                setCombos(0);
                setWorkoutSeconds(0);
              }}
              className="p-2.5 rounded-xl bg-[#0D1512] border border-white/10 text-gray-300 hover:text-white hover:border-[#10B981]/50 transition-all cursor-pointer"
              title={tr(currentLang, { ar: 'إعادة التعيين', fr: 'Réinitialiser', es: 'Reiniciar', en: 'Reset Workout' })}
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCameraActive(!cameraActive)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                cameraActive ? 'bg-red-900 text-white border-red-700' : 'bg-[#0D1512] border-white/10 text-gray-400 hover:text-white'
              }`}
              title={tr(currentLang, {
                ar: cameraActive ? 'إيقاف الكاميرا' : 'تشغيل كاميرا النزال',
                fr: cameraActive ? 'Désactiver Caméra' : 'Activer Caméra',
                es: cameraActive ? 'Apagar Cámara' : 'Activar Cámara',
                en: cameraActive ? 'Disable Camera' : 'Enable Camera Feed'
              })}
            >
              {cameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundEnabled ? 'bg-[#0D1512] text-[#10B981] border-white/10' : 'bg-[#0D1512] border-white/10 text-gray-500'
              }`}
              title={soundEnabled ? 'Mute Arena SFX' : 'Enable Arena SFX'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-[#0D1512] border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* HUD ARENA CANVAS CONTAINER */}
        <div 
          ref={arenaContainerRef}
          className="relative w-full aspect-video md:aspect-[21/9] min-h-[500px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.22)] border border-[#10B981]/30 bg-[#050807] flex flex-col justify-between p-4 md:p-8 select-none"
        >
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
                alt="Live YARD 300 Combat Arena"
                onError={handleImageError}
                className="w-full h-full object-cover object-center filter saturate-125 contrast-115 opacity-70 scale-105 animate-aura"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-transparent to-[#050807]/60"></div>
              <div className="absolute inset-0 bg-cyber-grid opacity-30 mix-blend-screen pointer-events-none"></div>
            </div>
          )}

          {/* Interactive Punch Targets */}
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {targets.map(target => (
              <div
                key={target.id}
                onClick={() => handleHitTarget(target.id)}
                style={{ top: `${target.y}%`, left: `${target.x}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair group p-2"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-dashed border-[#D4AF37] flex items-center justify-center animate-ping-slow group-hover:scale-125 transition-transform duration-200">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#10B981] flex items-center justify-center shadow-[0_0_20px_#10B981] group-active:scale-90">
                    <Crosshair className="w-5 h-5 text-[#050807]" />
                  </div>
                </div>
                <span className="block text-[10px] font-black text-[#D4AF37] font-anime bg-black/80 px-2 py-0.5 rounded text-center mt-1 shadow-md border border-[#D4AF37]/40">
                  {tr(currentLang, { ar: 'الكم هنا!', fr: 'FRAPPE !', es: '¡GOLPEA!', en: 'HIT!' })}
                </span>
              </div>
            ))}
          </div>

          {/* HUD LAYER TOP */}
          <div className="relative z-10 flex items-center justify-between gap-4 backdrop-blur-md bg-black/55 p-3 md:p-4 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1 rounded-xl bg-[#E50914] text-white font-black font-anime text-sm md:text-base flex items-center gap-1.5 shadow-[0_0_15px_#E50914]">
                <Flame className="w-4 h-4 fill-white" />
                <span>{tr(currentLang, { ar: 'الجولة 01', fr: 'ROUND 01', es: 'RONDA 01', en: 'ROUND 01' })}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#10B981]" />
                <span className="text-xl md:text-2xl font-black font-anime text-white tabular-nums" dir="ltr">{formatTime(workoutSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300 hidden sm:inline">
                {tr(currentLang, { ar: 'نطاق الجهد:', fr: 'ZONE :', es: 'ZONA:', en: 'AURA ZONE:' })}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-black font-anime uppercase tracking-wider shadow-md ${
                activeZone === 'LIMIT_BREAK'
                  ? 'bg-[#E50914] text-white shadow-[0_0_20px_#E50914] animate-pulse'
                  : activeZone === 'CARDIO'
                    ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_#D4AF37]'
                    : 'bg-[#10B981] text-black shadow-[0_0_15px_#10B981]'
              }`}>
                {activeZone === 'LIMIT_BREAK'
                  ? tr(currentLang, { ar: '⚡ كسر الحدود (لاهوائي)', fr: '⚡ LIMIT BREAK (ANAÉROBIE)', es: '⚡ LÍMITE MÁXIMO (ANAERÓBICO)', en: '⚡ LIMIT BREAK (ANAEROBIC)' })
                  : activeZone === 'CARDIO'
                  ? tr(currentLang, { ar: '🔥 كارديو مكثف', fr: '🔥 CARDIO INTENSE', es: '🔥 CARDIO ALTO', en: '🔥 HIGH CARDIO' })
                  : tr(currentLang, { ar: '💧 حرق الدهون المتوازن', fr: '💧 FLUX BRÛLE-GRAISSES', es: '💧 QUEMA DE GRASA', en: '💧 FAT BURN FLOW' })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37] animate-bounce" />
              <div className={isAr ? 'text-left' : 'text-right'}>
                <span className="text-[10px] text-gray-400 block font-bold">
                  {tr(currentLang, { ar: 'طاقة الهالة', fr: 'PUISSANCE', es: 'NIVEL PODER', en: 'POWER LEVEL' })}
                </span>
                <span className="text-base md:text-xl font-black font-anime text-[#D4AF37] tabular-nums" dir="ltr">{powerAura} AP</span>
              </div>
            </div>
          </div>

          {/* HUD LAYER MIDDLE */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto pointer-events-none">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-dashed border-[#10B981]/60 flex items-center justify-center relative animate-spin-slow">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border border-[#D4AF37]/60 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]"></div>
              </div>
            </div>
            <span className="mt-4 px-4 py-1 rounded-full bg-[#050807]/85 border border-[#10B981] text-xs font-black font-anime text-[#10B981] tracking-widest backdrop-blur-md">
              {tr(currentLang, {
                ar: '🎯 حرك جسدك والكم الأهداف المضيئة',
                fr: '🎯 SYSTÈME DE CIBLAGE TACTIQUE',
                es: '🎯 SISTEMA DE OBJETIVOS EN VIVO',
                en: '🎯 TARGET ACQUISITION SYSTEM'
              })}
            </span>
          </div>

          {/* HUD LAYER BOTTOM */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 backdrop-blur-md bg-black/55 p-4 md:p-6 rounded-2xl border border-[#10B981]/40 shadow-[0_0_30px_rgba(16,185,129,0.18)]">
            <div className="bg-[#080D0B]/90 border border-[#FF007A]/50 p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#FF007A] animate-ping" />
                  <span className="text-xs font-black text-gray-300 uppercase">
                    {tr(currentLang, { ar: 'نبضات القلب MHR', fr: 'FRÉQUENCE', es: 'PULSO MHR', en: 'HEART RATE' })}
                  </span>
                </div>
                <div className="flex items-baseline gap-2" dir="ltr">
                  <span className="text-3xl font-black font-anime text-[#FF007A] tabular-nums">{heartRate}</span>
                  <span className="text-xs font-bold text-gray-400">BPM</span>
                </div>
              </div>
              <div className="flex items-end gap-1 h-10">
                <span className="w-1.5 bg-[#FF007A] rounded-full animate-bounce h-6"></span>
                <span className="w-1.5 bg-[#FF007A] rounded-full animate-bounce h-10 delay-100"></span>
                <span className="w-1.5 bg-[#FF007A] rounded-full animate-bounce h-4 delay-200"></span>
                <span className="w-1.5 bg-[#FF007A] rounded-full animate-bounce h-8 delay-300"></span>
              </div>
            </div>

            <div className="bg-[#080D0B]/90 border border-[#D4AF37]/50 p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#D4AF37] animate-bounce" />
                  <span className="text-xs font-black text-gray-300 uppercase">
                    {tr(currentLang, { ar: 'السعرات المحروقة', fr: 'CALORIES', es: 'CALORÍAS', en: 'CALORIES BURNED' })}
                  </span>
                </div>
                <div className="flex items-baseline gap-2" dir="ltr">
                  <span className="text-3xl font-black font-anime text-[#D4AF37] tabular-nums">{calories}</span>
                  <span className="text-xs font-bold text-gray-400">KCAL</span>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-[#1A1608] text-[#D4AF37] rounded-lg border border-[#D4AF37]/40" dir="ltr">
                ~18.5/min
              </span>
            </div>

            <div className="bg-[#080D0B]/90 border border-[#10B981]/50 p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#10B981]" />
                  <span className="text-xs font-black text-gray-300 uppercase">
                    {tr(currentLang, { ar: 'اللكمات المتتالية', fr: 'COMBOS', es: 'COMBOS', en: 'STRIKE COMBOS' })}
                  </span>
                </div>
                <div className="flex items-baseline gap-2" dir="ltr">
                  <span className="text-3xl font-black font-anime text-[#10B981] tabular-nums">{combos}</span>
                  <span className="text-xs font-bold text-gray-400">HITS</span>
                </div>
              </div>
              <div className={isAr ? 'text-left' : 'text-right'}>
                <span className="text-xs font-black text-[#10B981] block">3x MULTIPLIER</span>
                <span className="text-[10px] font-bold text-gray-400">
                  {tr(currentLang, { ar: 'مضاعف السرعة', fr: 'Vitesse Overdrive', es: 'Velocidad Turbo', en: 'Overdrive Speed' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLLING BATTLE LOG HISTORY SECTION */}
        <div className="rounded-3xl bg-[#080D0B] border border-white/10 p-6 md:p-8 space-y-6 shadow-2xl relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#D4AF37] flex items-center justify-center text-[#050807] font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black font-anime text-white flex items-center gap-2">
                  <span>
                    {tr(currentLang, {
                      ar: 'سجل المعارك والنزالات السابقة',
                      fr: 'JOURNAL DES COMBATS & HISTORIQUE',
                      es: 'REGISTRO DE BATALLAS E HISTORIAL',
                      en: 'ARENA BATTLE LOG & FIGHT HISTORY'
                    })}
                  </span>
                  <span className="text-xs bg-[#10B981] text-[#050807] px-2 py-0.5 rounded-full font-sans font-bold">
                    {filteredLogs.length} LOGS
                  </span>
                </h3>
                <p className="text-xs text-gray-400 font-bold">
                  {tr(currentLang, {
                    ar: 'أرشيف تفصيلي يسجل إحصائيات المعارك السابقة: النبض، السعرات، الكومبو، ومكافآت YARDX',
                    fr: 'Archive détaillée : durée, BPM max, précision des frappes et récompenses YARDX.',
                    es: 'Archivo histórico: duración, pulso máximo, combos y recompensas YARDX.',
                    en: 'Historical fight telemetry: duration, max heart rate, strike accuracy, and token rewards.'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex gap-1.5 p-1 bg-[#0D1512] rounded-xl border border-white/10 text-xs font-bold font-anime">
                <button
                  onClick={() => setLogFilter('ALL')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${logFilter === 'ALL' ? 'bg-[#D4AF37] text-black font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  {tr(currentLang, { ar: 'الكل', fr: 'TOUS', es: 'TODOS', en: 'ALL' })}
                </button>
                <button
                  onClick={() => setLogFilter('YAM_SUW')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${logFilter === 'YAM_SUW' ? 'bg-[#10B981] text-[#050807] font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  yam suw
                </button>
                <button
                  onClick={() => setLogFilter('MTK')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${logFilter === 'MTK' ? 'bg-[#10B981] text-[#050807] font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  m t k
                </button>
                <button
                  onClick={() => setLogFilter('ARB')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${logFilter === 'ARB' ? 'bg-[#D4AF37] text-black font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  A.R.B
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[460px] overflow-y-auto space-y-3.5 pr-2 yard-slim-scrollbar">
            {filteredLogs.map((log) => (
              <div 
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="p-4 md:p-5 rounded-2xl bg-[#0D1512] border border-white/10 hover:border-[#10B981]/60 hover:bg-[#111C17] transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center -space-x-3 shrink-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_12px_rgba(212,175,55,0.4)] bg-black z-10">
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

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black font-anime text-white group-hover:text-[#10B981] transition-colors">
                        {log.fighterName}
                      </span>
                      <span className="text-xs font-black text-[#D4AF37] font-anime">VS</span>
                      <span className="text-xs font-bold text-gray-400">{log.opponentName}</span>
                    </div>

                    <p className="text-xs font-bold text-[#D4AF37]">{getDivision(log)}</p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 font-mono">
                      <span>{log.dateStr}</span>
                      <span>•</span>
                      <span className="text-[#10B981] font-bold">
                        {tr(currentLang, { ar: 'الحركة القاضية:', fr: 'Finition :', es: 'Remate:', en: 'Finish:' })} {getSpecialMove(log)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                  <div className="text-center">
                    <span className="px-3 py-1 rounded-lg bg-emerald-950 border border-[#10B981] text-[#10B981] text-xs font-black font-anime">
                      {log.outcome}
                    </span>
                    <span className="block text-[10px] text-gray-400 mt-1 font-mono tabular-nums">{log.duration}</span>
                  </div>

                  <div className="text-center min-w-[70px]">
                    <span className="block text-sm font-black font-anime text-[#D4AF37] tabular-nums">{log.caloriesBurned}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">KCAL</span>
                  </div>

                  <div className="text-center min-w-[70px]">
                    <span className="block text-sm font-black font-anime text-[#FF007A] tabular-nums">{log.maxHeartRate}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">BPM</span>
                  </div>

                  <div className="text-center min-w-[70px]">
                    <span className="block text-sm font-black font-anime text-[#10B981] tabular-nums">{log.combosLanded}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">HITS</span>
                  </div>

                  <div className="text-center bg-[#050807] px-3 py-1.5 rounded-xl border border-white/10 min-w-[80px]">
                    <span className="block text-xs font-black font-anime text-white tabular-nums">+{log.yardxReward} YARDX</span>
                    <span className="text-[9px] text-[#D4AF37] font-black tabular-nums">+{log.powerAuraEarned} AP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedLog && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLog(null)}
            >
              <div 
                className="w-full max-w-lg bg-[#080D0B] border border-[#10B981]/50 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.28)] text-white relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <img loading="lazy" decoding="async" src={selectedLog.fighterAvatar} alt={selectedLog.fighterName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black font-anime text-white">{selectedLog.fighterName}</h4>
                      <span className="text-xs text-[#10B981] font-bold">✓ {selectedLog.outcome} — {selectedLog.duration}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedLog(null)}
                    className="p-2 rounded-xl bg-[#0D1512] hover:bg-emerald-950 text-gray-300 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-[#0D1512] rounded-xl border border-white/10">
                    <span className="text-xs text-gray-400 block font-bold">
                      {tr(currentLang, { ar: 'السعرات المحروقة', fr: 'Calories Brûlées', es: 'Calorías Quemadas', en: 'Calories Burned' })}
                    </span>
                    <span className="text-2xl font-black text-[#D4AF37] font-anime tabular-nums">{selectedLog.caloriesBurned} KCAL</span>
                  </div>
                  <div className="p-3 bg-[#0D1512] rounded-xl border border-white/10">
                    <span className="text-xs text-gray-400 block font-bold">
                      {tr(currentLang, { ar: 'أقصى نبض MHR', fr: 'Fréquence Max MHR', es: 'Pulso Máximo MHR', en: 'Max Heart Rate' })}
                    </span>
                    <span className="text-2xl font-black text-[#FF007A] font-anime tabular-nums">{selectedLog.maxHeartRate} BPM</span>
                  </div>
                  <div className="p-3 bg-[#0D1512] rounded-xl border border-white/10">
                    <span className="text-xs text-gray-400 block font-bold">
                      {tr(currentLang, { ar: 'اللكمات الناجحة', fr: 'Combos Réussis', es: 'Combos Conectados', en: 'Combos Landed' })}
                    </span>
                    <span className="text-2xl font-black text-[#10B981] font-anime tabular-nums">{selectedLog.combosLanded} HITS</span>
                  </div>
                  <div className="p-3 bg-[#0D1512] rounded-xl border border-white/10">
                    <span className="text-xs text-gray-400 block font-bold">
                      {tr(currentLang, { ar: 'مكافأة النزال', fr: 'Prime du Combat', es: 'Recompensa', en: 'Reward Bounty' })}
                    </span>
                    <span className="text-xl font-black text-white font-anime tabular-nums">+{selectedLog.yardxReward} YARDX</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0D1512] border border-[#D4AF37]/30 text-xs font-bold text-gray-300 space-y-1">
                  <span className="text-[#D4AF37] font-anime block uppercase tracking-wider">
                    ⚡ {tr(currentLang, { ar: 'الحركة القاضية الخاصة:', fr: 'COUP SPÉCIAL SIGNATURE :', es: 'MOVIMIENTO ESPECIAL:', en: 'SIGNATURE SPECIAL MOVE:' })}
                  </span>
                  <p className="text-white text-sm">{getSpecialMove(selectedLog)}</p>
                </div>

                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#D4AF37] text-[#050807] font-black font-anime text-xs shadow-md cursor-pointer"
                >
                  {tr(currentLang, { ar: 'إغلاق السجل', fr: 'FERMER LE DOSSIER', es: 'CERRAR REGISTRO', en: 'CLOSE RECORD' })}
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
