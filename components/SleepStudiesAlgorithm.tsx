import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import {
  Moon,
  Activity,
  CheckCircle2,
  RefreshCw,
  HeartPulse,
  ShieldAlert,
  Clock,
  Sun,
  Waves
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import {
  BiometricEngineService,
  BiometricTelemetryState,
  evaluateSleepArchitecture
} from '../services/biometricEngine';

interface SleepStudiesAlgorithmProps {
  currentLang?: Language;
  onClose?: () => void;
}

interface HypnogramPoint {
  slotIndex: number;
  timeLabel: string;
  stageCode: number; // 0 = Awake, 1 = REM, 2 = Light N1/N2, 3 = Deep NREM3 (inverted visual depth scale: 4=Deep Peak, 3=REM, 2=Light, 1=Awake)
  depthScore: number; // 95=Deep, 72=REM, 45=Light, 12=Awake
  stageLabelEn: string;
  stageLabelAr: string;
  stageLabelEs: string;
  stageLabelFr: string;
  nocturnalHr: number;
  spo2: number;
  ghReleaseRate: number;
}

export const SleepStudiesAlgorithm: React.FC<SleepStudiesAlgorithmProps> = ({
  currentLang = 'en',
  onClose
}) => {
  const t = (texts: { en: string; es: string; fr: string; ar: string }) => tr(currentLang, texts);
  const [state, setState] = useState<BiometricTelemetryState>(() => BiometricEngineService.getState());
  const [chartTab, setChartTab] = useState<'hypnogram' | 'cardio'>('hypnogram');

  useEffect(() => {
    return BiometricEngineService.subscribe(setState);
  }, []);

  const updateField = <K extends keyof BiometricTelemetryState>(key: K, value: BiometricTelemetryState[K]) => {
    const next = BiometricEngineService.updateState({ [key]: value });
    setState(next);
  };

  const applyPreset = (preset: 'optimal' | 'campFatigue' | 'sleepDebt') => {
    soundFX.playButtonClick();
    if (preset === 'optimal') {
      BiometricEngineService.updateState({
        totalSleepHours: 8.5,
        deepSleepPercent: 23,
        remSleepPercent: 24,
        sleepLatencyMinutes: 12,
        nocturnalAwakenings: 0,
        baselineSpo2: 99,
        nocturnalHrDipPercent: 16,
        eveningScreenTimeHours: 0.5,
        caffeineCutoffHoursBeforeBed: 9
      });
    } else if (preset === 'campFatigue') {
      BiometricEngineService.updateState({
        totalSleepHours: 6.5,
        deepSleepPercent: 15,
        remSleepPercent: 17,
        sleepLatencyMinutes: 26,
        nocturnalAwakenings: 2,
        baselineSpo2: 95,
        nocturnalHrDipPercent: 8,
        eveningScreenTimeHours: 1.5,
        caffeineCutoffHoursBeforeBed: 5
      });
    } else {
      BiometricEngineService.updateState({
        totalSleepHours: 5.0,
        deepSleepPercent: 10,
        remSleepPercent: 13,
        sleepLatencyMinutes: 42,
        nocturnalAwakenings: 4,
        baselineSpo2: 93,
        nocturnalHrDipPercent: 5,
        eveningScreenTimeHours: 3.0,
        caffeineCutoffHoursBeforeBed: 3
      });
    }
  };

  const results = evaluateSleepArchitecture(state);
  const totalStageMins = Math.max(1, results.deepMinutes + results.remMinutes + results.lightMinutes);
  const deepPctBar = Math.round((results.deepMinutes / totalStageMins) * 100);
  const remPctBar = Math.round((results.remMinutes / totalStageMins) * 100);
  const lightPctBar = Math.max(0, 100 - deepPctBar - remPctBar);

  // Dynamically synthesize an ultra-realistic ~30-minute epoch Hypnogram & Cardiorespiratory nocturnal trace
  const hypnogramData: HypnogramPoint[] = useMemo(() => {
    const totalSlots = Math.max(10, Math.round(state.totalSleepHours * 2));
    const wakeSet = new Set<number>();
    for (let w = 0; w < state.nocturnalAwakenings; w++) {
      const slot = Math.min(totalSlots - 2, Math.max(2, Math.floor(((w + 1) / (state.nocturnalAwakenings + 1)) * totalSlots)));
      wakeSet.add(slot);
    }

    const deepBias = (state.deepSleepPercent - 15) / 15;
    const remBias = (state.remSleepPercent - 18) / 15;
    const wakeHourStart = 22.5; // 22:30 bedtime baseline
    const restingDayHr = 56;
    const targetDipBpm = restingDayHr * (1 - state.nocturnalHrDipPercent / 100);

    const pts: HypnogramPoint[] = [];
    for (let i = 0; i <= totalSlots; i++) {
      const hrsElapsed = i * 0.5;
      const clock = (wakeHourStart + hrsElapsed) % 24;
      const hh = Math.floor(clock);
      const mm = Math.round((clock - hh) * 60);
      const timeLabel = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
      const progress = i / totalSlots;
      const cyclePos = (hrsElapsed % 1.5) / 1.5; // 90-minute ultradian sleep cycle

      let depthScore = 48;
      let stageCode = 2;
      let stageLabelEn = 'Light NREM2';
      let stageLabelAr = 'نوم خفيف NREM2';
      let stageLabelEs = 'Sueño Ligero NREM2';
      let stageLabelFr = 'Sommeil Léger NREM2';

      if (i === 0 && state.sleepLatencyMinutes > 20) {
        depthScore = 15;
        stageCode = 0;
        stageLabelEn = 'Sleep Onset Latency';
        stageLabelAr = 'فترة الاستغراق في النوم';
        stageLabelEs = 'Latencia de Inicio del Sueño';
        stageLabelFr = 'Latence d\'Endormissement';
      } else if (wakeSet.has(i)) {
        depthScore = 14;
        stageCode = 0;
        stageLabelEn = 'Micro-Arousal / Awake';
        stageLabelAr = 'استيقاظ ليلي مؤقت';
        stageLabelEs = 'Microdespertar / Vigilia';
        stageLabelFr = 'Micro-Éveil / Éveillé';
      } else if (cyclePos < 0.45 && progress < 0.68 + deepBias * 0.15 && state.deepSleepPercent >= 11) {
        depthScore = 94 - progress * 8;
        stageCode = 3;
        stageLabelEn = 'Deep NREM3 (GH Peak)';
        stageLabelAr = 'نوم عميق NREM3 (إفراز GH)';
        stageLabelEs = 'NREM3 Profundo (Pico GH)';
        stageLabelFr = 'NREM3 Profond (Pic GH)';
      } else if (cyclePos >= 0.65 - remBias * 0.12 && (progress > 0.25 || state.remSleepPercent > 20)) {
        depthScore = 72;
        stageCode = 1;
        stageLabelEn = 'REM Reflex Consolidation';
        stageLabelAr = 'طور الأحلام REM العصبي';
        stageLabelEs = 'Consolidación Refleja REM';
        stageLabelFr = 'Consolidation Réflexe REM';
      } else {
        depthScore = 46;
        stageCode = 2;
        stageLabelEn = 'Light NREM1/2 Restoration';
        stageLabelAr = 'نوم انتقالي NREM1/2';
        stageLabelEs = 'Restauración Ligera NREM1/2';
        stageLabelFr = 'Restauration Légère NREM1/2';
      }

      const hrMod = stageCode === 3 ? -3.5 : stageCode === 1 ? 4.2 : stageCode === 0 ? 11 : 0;
      const nocturnalHr = Math.round(
        Math.max(41, Math.min(78, targetDipBpm + (restingDayHr - targetDipBpm) * Math.abs(progress - 0.55) * 0.45 + hrMod))
      );

      const spo2Drop = stageCode === 3 ? -0.4 : stageCode === 0 ? 0.2 : -0.2;
      const spo2 = Number(Math.min(100, Math.max(88, state.baselineSpo2 + spo2Drop)).toFixed(1));
      const ghReleaseRate = stageCode === 3 ? Math.round(78 + state.deepSleepPercent * 0.8) : stageCode === 1 ? 28 : 16;

      pts.push({
        slotIndex: i,
        timeLabel,
        stageCode,
        depthScore: Math.round(depthScore),
        stageLabelEn,
        stageLabelAr,
        stageLabelEs,
        stageLabelFr,
        nocturnalHr,
        spo2,
        ghReleaseRate
      });
    }
    return pts;
  }, [state]);

  // SVG Circular Gauge math
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (results.overallScore / 100) * circumference;
  const scoreAccent =
    results.overallScore >= 85 ? '#10B981' : results.overallScore >= 70 ? '#D4AF37' : '#EF4444';

  // Efficiency calculation
  const sleepEfficiency = Math.min(
    99,
    Math.max(64, Math.round(100 - (state.sleepLatencyMinutes / (state.totalSleepHours * 60)) * 100 - state.nocturnalAwakenings * 2.4))
  );

  // Recommended wake target label (from 22:30 baseline)
  const wakeTotalMins = Math.round((22.5 + state.totalSleepHours) * 60) % (24 * 60);
  const wakeClockLabel = `${String(Math.floor(wakeTotalMins / 60)).padStart(2, '0')}:${String(wakeTotalMins % 60).padStart(2, '0')}`;
  const caffeineStopClock = `${String((22 - state.caffeineCutoffHoursBeforeBed + 24) % 24).padStart(2, '0')}:30`;

  const CustomSleepTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const pt: HypnogramPoint = payload[0].payload;
    return (
      <div className="bg-[#07090F]/95 border border-white/[0.15] rounded-xl p-3.5 shadow-2xl text-xs space-y-2 backdrop-blur-xl min-w-[210px]">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 font-mono tabular-nums">
          <span className="text-[#D4AF37] font-bold">{pt.timeLabel}</span>
          <span className="text-slate-300 font-semibold">
            {t({ en: pt.stageLabelEn, es: pt.stageLabelEs, fr: pt.stageLabelFr, ar: pt.stageLabelAr })}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono tabular-nums text-[11px]">
          <span className="text-slate-400">{t({ en: 'Nocturnal HR:', es: 'FC Nocturna:', fr: 'FC Nocturne :', ar: 'النبض الليلي:' })}</span>
          <span className="text-white font-bold text-end">{pt.nocturnalHr} bpm</span>
          <span className="text-slate-400">{t({ en: 'SpO2:', es: 'SpO2:', fr: 'SpO2 :', ar: 'الأكسجة:' })}</span>
          <span className="text-[#10B981] font-bold text-end">{pt.spo2}%</span>
          <span className="text-slate-400">{t({ en: 'GH Synthesis:', es: 'Síntesis GH:', fr: 'Synthèse GH :', ar: 'تخليق GH:' })}</span>
          <span className="text-[#00F0FF] font-bold text-end">{pt.ghReleaseRate}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#07080D] border border-white/[0.09] rounded-2xl p-4 sm:p-6 md:p-9 shadow-2xl text-white font-sans max-w-6xl mx-auto space-y-8">
      {/* Precision Laboratory Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#00F0FF] uppercase tracking-[0.18em]">
            <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {t({
                en: 'CIRCADIAN SLEEP & RECOVERY TELEMETRY LAB',
                es: 'LABORATORIO TELEMÉTRICO DE SUEÑO CIRCADIANO Y RECUPERACIÓN',
                fr: 'LABO DE TÉLÉMÉTRIE SOMMEIL CIRCADIEN & RÉCUPÉRATION',
                ar: 'مختبر هندسة النوم والإيقاع اليومي'
              })}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            {t({
              en: 'Circadian Architecture & Nocturnal Telemetry',
              es: 'Arquitectura Circadiana y Telemetría Nocturna',
              fr: 'Architecture Circadienne & Télémétrie Nocturne',
              ar: 'محلل أطوار النوم والاستشفاء العصبي'
            })}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {t({
              en: 'Real-time polysomnography-style modeling across NREM3 deep repair, REM neural consolidation, nocturnal SpO2, and HR dipping coupled directly with ACWR.',
              es: 'Modelado en tiempo real tipo polisomnografía para sueño profundo NREM3, consolidación REM, SpO2 nocturno y descenso de FC vinculado al ACWR.',
              fr: 'Modélisation temps réel de type polysomnographie sur les phases NREM3 profondes, consolidation REM, SpO2 nocturne et chute de FC couplée à l\'ACWR.',
              ar: 'رسم تخطيطي ديناميكي لأطوار النوم (NREM3 و REM) وتشبع الأكسجين SpO2 وانخفاض النبض الليلي مع مزامنة فورية لمحرك الإصابات ACWR.'
            })}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => applyPreset('optimal')}
            className="px-3.5 py-2 rounded-lg bg-[#111521] hover:bg-[#171C2B] border border-white/[0.1] text-xs font-medium text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{t({ en: 'Reset Optimal', es: 'Restablecer Óptimo', fr: 'Réinitialiser Optimal', ar: 'استعادة المثالي' })}</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white text-[#07080D] hover:bg-[#D4AF37] text-xs font-bold cursor-pointer transition-colors"
            >
              {t({ en: 'Close', es: 'Cerrar', fr: 'Fermer', ar: 'إغلاق' })}
            </button>
          )}
        </div>
      </div>

      {/* Scenario Quick Controls + Chronobiology Clocks */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 me-1">
            {t({ en: 'Calibration Presets:', es: 'Preajustes de Calibración:', fr: 'Préréglages de Calibration :', ar: 'سيناريوهات المعايرة:' })}
          </span>
          <button
            type="button"
            onClick={() => applyPreset('optimal')}
            className="px-3 py-1.5 rounded-lg bg-[#10B981]/12 hover:bg-[#10B981]/22 border border-[#10B981]/35 text-[#10B981] text-xs font-semibold cursor-pointer transition-colors"
          >
            {t({ en: 'S-Rank Taper (8.5h)', es: 'Descarga Rango S (8.5h)', fr: 'Affûtage Rang S (8,5h)', ar: 'جاهزية القمة (8.5س)' })}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('campFatigue')}
            className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/12 hover:bg-[#D4AF37]/22 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold cursor-pointer transition-colors"
          >
            {t({ en: 'Camp Strain (6.5h)', es: 'Carga Campamento (6.5h)', fr: 'Charge de Camp (6,5h)', ar: 'ضغط معسكر (6.5س)' })}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sleepDebt')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/12 hover:bg-rose-500/22 border border-rose-500/35 text-rose-400 text-xs font-semibold cursor-pointer transition-colors"
          >
            {t({ en: 'Acute Deficit (5.0h)', es: 'Déficit Agudo (5.0h)', fr: 'Déficit Aigu (5,0h)', ar: 'عجز نوم حاد (5.0س)' })}
          </button>
        </div>

        {/* Chronobiology Target Times (clean inline metrics) */}
        <div className="flex flex-wrap items-center gap-5 text-xs font-mono tabular-nums text-slate-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-slate-400">{t({ en: 'Lights Out:', es: 'Al Dormir:', fr: 'Coucher :', ar: 'وقت النوم:' })}</span>
            <span className="text-white font-bold">22:30</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-slate-400">{t({ en: 'Wake Window:', es: 'Despertar:', fr: 'Réveil :', ar: 'الاستيقاظ:' })}</span>
            <span className="text-[#10B981] font-bold">{wakeClockLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="text-slate-400">{t({ en: 'Caffeine Stop:', es: 'Corte Cafeína:', fr: 'Arrêt Caféine :', ar: 'قطع الكافيين:' })}</span>
            <span className="text-[#00F0FF] font-bold">{caffeineStopClock}</span>
          </div>
        </div>
      </div>

      {/* Top Precision KPI Strip (4 Columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D1018] border border-white/[0.07]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            {t({ en: 'SLEEP EFFICIENCY', es: 'EFICIENCIA DEL SUEÑO', fr: 'EFFICACITÉ DU SOMMEIL', ar: 'كفاءة النوم الصافية' })}
          </span>
          <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
            <span className="text-2xl font-bold text-white">{sleepEfficiency}%</span>
            <span className="text-xs text-[#10B981]">
              {sleepEfficiency >= 88
                ? t({ en: 'Nominal', es: 'Óptimo', fr: 'Optimal', ar: 'مثالي' })
                : t({ en: 'Fragmented', es: 'Fragmentado', fr: 'Fragmenté', ar: 'تقطّع' })}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1018] border border-white/[0.07]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            {t({ en: 'DEEP NREM3 WINDOW', es: 'SUEÑO PROFUNDO NREM3', fr: 'SOMMEIL PROFOND NREM3', ar: 'النوم العميق NREM3' })}
          </span>
          <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
            <span className="text-2xl font-bold text-[#D4AF37]">{results.deepMinutes}</span>
            <span className="text-xs text-slate-400">min · {state.deepSleepPercent}%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1018] border border-white/[0.07]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            {t({ en: 'REM CONSOLIDATION', es: 'CONSOLIDACIÓN REM', fr: 'CONSOLIDATION REM', ar: 'مرحلة REM العصبية' })}
          </span>
          <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
            <span className="text-2xl font-bold text-[#00F0FF]">{results.remMinutes}</span>
            <span className="text-xs text-slate-400">min · {state.remSleepPercent}%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1018] border border-white/[0.07]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            {t({ en: 'SLEEP DEBT DELTA', es: 'DÉFICIT DE SUEÑO', fr: 'DETTE DE SOMMEIL', ar: 'الدين التراكمي للنوم' })}
          </span>
          <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
            <span className={`text-2xl font-bold ${results.sleepDebt > 1 ? 'text-rose-400' : 'text-[#10B981]'}`}>
              {results.sleepDebt}h
            </span>
            <span className="text-xs text-slate-400">
              SpO2 {state.baselineSpo2}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Workspace: Live Hypnogram Chart + Readiness Ring + Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Live Polysomnography Hypnogram & Cardiorespiratory Trace (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B0E16] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                {t({
                  en: 'Live Ultradian Hypnogram & Nocturnal Physiology',
                  es: 'Hipnograma Ultradiano y Fisiología Nocturna en Vivo',
                  fr: 'Hypnogramme Ultradien & Physiologie Nocturne en Direct',
                  ar: 'المخطط الليلي التفاعلي لأطوار النوم والنبض'
                })}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {t({
                  en: 'Cycles recalibrate dynamically as duration, stages, and awakenings adjust',
                  es: 'Los ciclos se recalibran dinámicamente según duración, fases y despertares',
                  fr: 'Les cycles s\'ajustent dynamiquement selon la durée, les phases et les éveils',
                  ar: 'يتحدث المخطط لحظياً عند تعديل ساعات النوم أو نسبة العميق والأكسجة'
                })}
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#07080D] border border-white/[0.07] text-xs">
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setChartTab('hypnogram');
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  chartTab === 'hypnogram'
                    ? 'bg-[#D4AF37] text-[#07080D] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t({ en: 'Sleep Hypnogram', es: 'Hipnograma', fr: 'Hypnogramme', ar: 'أطوار النوم' })}
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setChartTab('cardio');
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  chartTab === 'cardio'
                    ? 'bg-[#00F0FF] text-[#07080D] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t({ en: 'HR Dip & SpO2', es: 'FC y SpO2', fr: 'FC & SpO2', ar: 'النبض والأكسجة' })}
              </button>
            </div>
          </div>

          <div className="w-full h-64 sm:h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {chartTab === 'hypnogram' ? (
                <ComposedChart data={hypnogramData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hypnoDepthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.55} />
                      <stop offset="55%" stopColor="#00F0FF" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#0B0E16" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182032" vertical={false} />
                  <ReferenceLine y={82} stroke="#D4AF37" strokeDasharray="3 3" strokeOpacity={0.45} strokeWidth={1.1} />
                  <ReferenceLine y={65} stroke="#00F0FF" strokeDasharray="3 3" strokeOpacity={0.35} strokeWidth={1.1} />
                  <XAxis
                    dataKey="timeLabel"
                    stroke="#475569"
                    tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[15, 46, 72, 92]}
                    tickFormatter={(v) => (v >= 88 ? 'N3' : v >= 68 ? 'REM' : v >= 40 ? 'N2' : 'WK')}
                    stroke="#475569"
                    tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <Tooltip content={<CustomSleepTooltip />} />
                  <Area
                    type="stepAfter"
                    dataKey="depthScore"
                    stroke="#D4AF37"
                    strokeWidth={2.5}
                    fill="url(#hypnoDepthGrad)"
                    activeDot={{ r: 5, fill: '#D4AF37', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ghReleaseRate"
                    stroke="#10B981"
                    strokeWidth={1.75}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </ComposedChart>
              ) : (
                <ComposedChart data={hypnogramData} margin={{ top: 10, right: 12, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spo2Fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182032" vertical={false} />
                  <XAxis
                    dataKey="timeLabel"
                    stroke="#475569"
                    tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    yAxisId="hr"
                    domain={[38, 82]}
                    stroke="#00F0FF"
                    tick={{ fill: '#00F0FF', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    yAxisId="spo2"
                    orientation="right"
                    domain={[88, 100]}
                    stroke="#10B981"
                    tick={{ fill: '#10B981', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <Tooltip content={<CustomSleepTooltip />} />
                  <ReferenceLine yAxisId="spo2" y={95} stroke="#F59E0B" strokeDasharray="3 3" />
                  <Area
                    yAxisId="spo2"
                    type="monotone"
                    dataKey="spo2"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#spo2Fill)"
                  />
                  <Line
                    yAxisId="hr"
                    type="monotone"
                    dataKey="nocturnalHr"
                    stroke="#00F0FF"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: '#07080D', stroke: '#00F0FF', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#D4AF37' }}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Hypnogram Distribution Legend Bar */}
          <div className="space-y-2 pt-3 border-t border-white/[0.06]">
            <div className="flex justify-between items-center text-[11px] font-mono tabular-nums text-slate-400">
              <span>NREM3 Deep: {results.deepMinutes}m ({deepPctBar}%)</span>
              <span>REM: {results.remMinutes}m ({remPctBar}%)</span>
              <span>Light: {results.lightMinutes}m ({lightPctBar}%)</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#161B28]">
              <div className="h-full bg-[#D4AF37]" style={{ width: `${deepPctBar}%` }} />
              <div className="h-full bg-[#00F0FF]" style={{ width: `${remPctBar}%` }} />
              <div className="h-full bg-slate-500" style={{ width: `${lightPctBar}%` }} />
            </div>
          </div>
        </div>

        {/* Right: Circular Composite Gauge & ACWR Sync Status (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B0E16] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between space-y-5">
          <div className="flex flex-col items-center text-center pt-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-[0.16em] mb-3">
              {t({
                en: 'ATHLETIC SLEEP RECOVERY INDEX',
                es: 'ÍNDICE DE RECUPERACIÓN DEL SUEÑO ATLÉTICO',
                fr: 'INDICE DE RÉCUPÉRATION DU SOMMEIL ATHLÉTIQUE',
                ar: 'مؤشر جاهزية التعافي الليلي'
              })}
            </span>

            {/* SVG Radial Telemetry Dial */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#171C2B"
                  strokeWidth="10"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={scoreAccent}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono tabular-nums">
                <span className="text-4xl font-extrabold" style={{ color: scoreAccent }}>
                  {results.overallScore}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">/ 100 PTS</span>
              </div>
            </div>

            <div className="mt-3 text-xs font-semibold text-white">
              {t({
                en: `Status: ${results.recoveryState}`,
                es: `Estado: ${results.recoveryState}`,
                fr: `Statut : ${results.recoveryState}`,
                ar: `التشخيص: ${results.recoveryState}`
              })}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5 tabular-nums">
              GH Peak: {results.growthHormoneEst} · {results.reflexLatencyAdjustment}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/[0.07]">
            <div className="flex items-start gap-2.5 text-xs">
              <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${results.sleepInjuryModifier > 5 ? 'text-rose-400' : 'text-[#10B981]'}`} />
              <div className="space-y-0.5">
                <span className="font-semibold text-white block">
                  {t({
                    en: `ACWR Coupling Modifier: ${results.sleepInjuryModifier > 0 ? `+${results.sleepInjuryModifier}% strain load` : '0% sleep penalty'}`,
                    es: `Modificador ACWR: ${results.sleepInjuryModifier > 0 ? `+${results.sleepInjuryModifier}% carga` : '0% penalización'}`,
                    fr: `Modificateur ACWR : ${results.sleepInjuryModifier > 0 ? `+${results.sleepInjuryModifier}% charge` : '0% pénalité'}`,
                    ar: `مزامنة خوارزمية الإصابات ACWR: ${results.sleepInjuryModifier > 0 ? `+${results.sleepInjuryModifier}% خطر` : '0% عقوبة نوم'}`
                  })}
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t({
                    en: 'Cumulative sleep deficit and SpO2 stream continuously into the 7-day injury forecasting engine.',
                    es: 'El déficit acumulado de sueño y SpO2 alimentan continuamente al motor predictivo de lesiones a 7 días.',
                    fr: 'Le déficit de sommeil cumulé et la SpO2 alimentent en continu le moteur de prédiction à 7 jours.',
                    ar: 'يُرحّل عجز النوم وتشبع SpO2 آلياً إلى نموذج التنبؤ بالإصابات لحساب الجاهزية الصباحية.'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs pt-3 border-t border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t({
                  en: 'Anchor wake schedule within ±20 min, maintain 18.5–19.5°C room temperature, and cease bright screens 60 min pre-sleep.',
                  es: 'Fija la hora de despertar con margen de ±20 min, mantén la habitación a 18.5–19.5°C y apaga pantallas 60 min antes.',
                  fr: 'Stabilisez le réveil à ±20 min, gardez la pièce à 18,5–19,5°C et coupez les écrans 60 min avant de dormir.',
                  ar: 'ثبّت موعد الاستيقاظ بفارق ±20 دقيقة، واضبط حرارة الغرفة عند 18.8°م مع قطع الإضاءة الزرقاء قبل 60 دقيقة.'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Calibration Sliders & Inputs */}
      <div className="bg-[#0B0E16] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {t({
                en: 'CLINICAL SLEEP TELEMETRY CONTROLS',
                es: 'CONTROLES CLÍNICOS DE TELEMETRÍA DEL SUEÑO',
                fr: 'CONTRÔLES CLINIQUES DE TÉLÉMÉTRIE DU SOMMEIL',
                ar: 'مدخلات المعايرة السريرية للنوم'
              })}
            </span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 tabular-nums">
            Resp Score: {results.respiratoryScore}% · HR Dip: {state.nocturnalHrDipPercent}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{t({ en: 'Total Sleep Duration', es: 'Duración Total de Sueño', fr: 'Durée Totale du Sommeil', ar: 'ساعات النوم الكلية' })}</span>
              <span className="font-mono tabular-nums text-[#00F0FF] font-bold">{state.totalSleepHours}h</span>
            </div>
            <input
              type="range"
              min={4.0}
              max={11.0}
              step={0.5}
              value={state.totalSleepHours}
              onChange={(e) => updateField('totalSleepHours', parseFloat(e.target.value))}
              className="w-full accent-[#00F0FF] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{t({ en: 'Deep NREM3 Share', es: 'Porcentaje NREM3 Profundo', fr: 'Part Profonde NREM3', ar: 'النوم العميق NREM3' })}</span>
              <span className="font-mono tabular-nums text-[#D4AF37] font-bold">{state.deepSleepPercent}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={35}
              step={1}
              value={state.deepSleepPercent}
              onChange={(e) => updateField('deepSleepPercent', parseInt(e.target.value, 10))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{t({ en: 'REM Sleep Share', es: 'Porcentaje Sueño REM', fr: 'Part Sommeil REM', ar: 'نوم الأحلام REM' })}</span>
              <span className="font-mono tabular-nums text-[#00F0FF] font-bold">{state.remSleepPercent}%</span>
            </div>
            <input
              type="range"
              min={8}
              max={35}
              step={1}
              value={state.remSleepPercent}
              onChange={(e) => updateField('remSleepPercent', parseInt(e.target.value, 10))}
              className="w-full accent-[#00F0FF] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{t({ en: 'Nocturnal SpO2', es: 'SpO2 Nocturno', fr: 'SpO2 Nocturne', ar: 'تشبع الأكسجين SpO2' })}</span>
              </span>
              <span className="font-mono tabular-nums text-[#10B981] font-bold">{state.baselineSpo2}%</span>
            </div>
            <input
              type="range"
              min={88}
              max={100}
              step={1}
              value={state.baselineSpo2}
              onChange={(e) => updateField('baselineSpo2', parseInt(e.target.value, 10))}
              className="w-full accent-[#10B981] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{t({ en: 'Nocturnal HR Dip', es: 'Descenso FC Nocturno', fr: 'Chute FC Nocturne', ar: 'انخفاض النبض الليلي' })}</span>
              <span className="font-mono tabular-nums text-[#D4AF37] font-bold">{state.nocturnalHrDipPercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={22}
              step={1}
              value={state.nocturnalHrDipPercent}
              onChange={(e) => updateField('nocturnalHrDipPercent', parseInt(e.target.value, 10))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                {t({ en: 'Latency (min)', es: 'Latencia (min)', fr: 'Latence (min)', ar: 'الاستغراق (د)' })}
              </label>
              <input
                type="number"
                min={2}
                max={90}
                value={state.sleepLatencyMinutes}
                onChange={(e) => updateField('sleepLatencyMinutes', Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-1.5 rounded-lg bg-[#07080D] border border-white/[0.1] text-white font-mono text-xs tabular-nums outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                {t({ en: 'Awakenings', es: 'Despertares', fr: 'Éveils', ar: 'الاستيقاظ' })}
              </label>
              <input
                type="number"
                min={0}
                max={8}
                value={state.nocturnalAwakenings}
                onChange={(e) => updateField('nocturnalAwakenings', Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-1.5 rounded-lg bg-[#07080D] border border-white/[0.1] text-white font-mono text-xs tabular-nums outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepStudiesAlgorithm;
