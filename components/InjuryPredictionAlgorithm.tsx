import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip as RechartsTooltip
} from 'recharts';
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  RotateCcw,
  Moon,
  Crosshair
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { InjuryRiskHistoryChart } from './InjuryRiskHistoryChart';
import {
  BiometricEngineService,
  BiometricTelemetryState,
  InjuryZoneKey,
  evaluateInjuryRisk,
  evaluateSleepArchitecture
} from '../services/biometricEngine';

interface InjuryPredictionAlgorithmProps {
  currentLang?: Language;
  onClose?: () => void;
}

export const InjuryPredictionAlgorithm: React.FC<InjuryPredictionAlgorithmProps> = ({
  currentLang = 'en',
  onClose
}) => {
  const t = (texts: { en: string; es: string; fr: string; ar: string }) => tr(currentLang, texts);
  const [state, setState] = useState<BiometricTelemetryState>(() => BiometricEngineService.getState());

  useEffect(() => {
    return BiometricEngineService.subscribe(setState);
  }, []);

  const updateField = <K extends keyof BiometricTelemetryState>(key: K, value: BiometricTelemetryState[K]) => {
    const next = BiometricEngineService.updateState({ [key]: value });
    setState(next);
  };

  const toggleZone = (zone: InjuryZoneKey) => {
    soundFX.playButtonClick();
    BiometricEngineService.updateState({
      previousInjuryZones: {
        ...state.previousInjuryZones,
        [zone]: !state.previousInjuryZones[zone]
      }
    });
  };

  const applyScenario = (scenario: 'optimal' | 'spikeAlert' | 'rehab') => {
    soundFX.playButtonClick();
    if (scenario === 'optimal') {
      BiometricEngineService.updateState({
        acuteLoad7d: 1120,
        chronicLoad28d: 1020,
        trainingMonotony: 1.25,
        sessionRpe: 7,
        hrvSuppressionPercent: 5,
        previousInjuryZones: { knee: false, ankle: false, hamstring: false, shoulder: false, lowerBack: false }
      });
    } else if (scenario === 'spikeAlert') {
      BiometricEngineService.updateState({
        acuteLoad7d: 1850,
        chronicLoad28d: 1050,
        trainingMonotony: 2.15,
        sessionRpe: 9,
        hrvSuppressionPercent: 24,
        previousInjuryZones: { knee: false, ankle: false, hamstring: true, shoulder: false, lowerBack: false }
      });
    } else {
      BiometricEngineService.updateState({
        acuteLoad7d: 780,
        chronicLoad28d: 1050,
        trainingMonotony: 1.15,
        sessionRpe: 5,
        hrvSuppressionPercent: 9,
        previousInjuryZones: { knee: true, ankle: true, hamstring: false, shoulder: false, lowerBack: false }
      });
    }
  };

  const risk = evaluateInjuryRisk(state);
  const sleepEval = evaluateSleepArchitecture(state);

  // Dynamic Biomechanical Vulnerability Radar Dataset across 6 vectors
  const radarData = useMemo(() => {
    const acwrFactor = Math.max(0, (risk.acwr - 1.0) * 45);
    const monotonyFactor = Math.max(0, (state.trainingMonotony - 1.1) * 28);
    const sleepPenalty = Math.max(0, 100 - sleepEval.overallScore) * 0.7;

    return [
      {
        axis: t({ en: 'Hamstring', es: 'Isquios', fr: 'Ischios', ar: 'الأوتار' }),
        strain: Math.min(98, Math.round(14 + acwrFactor * 0.9 + (state.previousInjuryZones.hamstring ? 42 : 0))),
        baseline: 28
      },
      {
        axis: t({ en: 'Knee ACL', es: 'Rodilla LCA', fr: 'Genou LCA', ar: 'الركبة' }),
        strain: Math.min(98, Math.round(12 + acwrFactor * 0.8 + monotonyFactor * 0.5 + (state.previousInjuryZones.knee ? 40 : 0))),
        baseline: 26
      },
      {
        axis: t({ en: 'Achilles', es: 'Aquiles', fr: 'Achille', ar: 'الكاحل' }),
        strain: Math.min(98, Math.round(10 + acwrFactor * 0.75 + (state.previousInjuryZones.ankle ? 38 : 0))),
        baseline: 24
      },
      {
        axis: t({ en: 'Lumbar', es: 'Lumbar', fr: 'Lombaire', ar: 'الظهر' }),
        strain: Math.min(98, Math.round(11 + monotonyFactor * 0.7 + sleepPenalty * 0.35 + (state.previousInjuryZones.lowerBack ? 36 : 0))),
        baseline: 25
      },
      {
        axis: t({ en: 'Shoulder', es: 'Hombro', fr: 'Épaule', ar: 'الكتف' }),
        strain: Math.min(98, Math.round(9 + state.sessionRpe * 2.4 + (state.previousInjuryZones.shoulder ? 34 : 0))),
        baseline: 24
      },
      {
        axis: t({ en: 'CNS / HRV', es: 'SNC / HRV', fr: 'SNC / HRV', ar: 'الجهاز العصبي' }),
        strain: Math.min(98, Math.round(8 + state.hrvSuppressionPercent * 1.9 + sleepPenalty * 0.65)),
        baseline: 30
      }
    ];
  }, [risk.acwr, state, sleepEval.overallScore, currentLang]);

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (risk.totalRisk / 100) * circumference;

  return (
    <div className="bg-[#07080D] border border-white/[0.09] rounded-2xl p-4 sm:p-6 md:p-9 shadow-2xl text-white font-sans max-w-6xl mx-auto space-y-8 w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#D4AF37] uppercase tracking-[0.18em]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
            <span>
              {t({
                en: 'CLINICAL MULTI-FACTOR INJURY ENGINE',
                es: 'MOTOR CLÍNICO MULTIFACTORIAL DE LESIONES',
                fr: 'MOTEUR CLINIQUE MULTIFACTEUR DE BLESSURES',
                ar: 'محرك التنبؤ الوقائي ACWR + FOSTER STRAIN'
              })}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            {t({
              en: 'Gabbett ACWR & Anatomical Strain Model',
              es: 'Modelo Gabbett ACWR y Tensión Anatómica',
              fr: 'Modèle Gabbett ACWR & Charge Anatomique',
              ar: 'خوارزمية التنبؤ بالإصابات وتوزيع الإجهاد المفصلي'
            })}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {t({
              en: 'Precision sports-medicine model integrating Gabbett ACWR, Foster Strain, weighted joint hotspots, HRV suppression, and synced sleep debt.',
              es: 'Modelo de medicina deportiva que integra Gabbett ACWR, tensión de Foster, zonas articulares, supresión de HRV y déficit de sueño sincronizado.',
              fr: 'Modèle de médecine du sport intégrant ACWR Gabbett, tension Foster, zones articulaires, suppression HRV et dette de sommeil synchronisée.',
              ar: 'نموذج سريري يربط نسبة الحمل الحاد والمزمن مع إجهاد Foster، ومصفوفة المفاصل التشريحية، ومعدل هبوط HRV وعجز النوم اللحظي.'
            })}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => applyScenario('optimal')}
            className="px-3.5 py-2 rounded-lg bg-[#111521] hover:bg-[#171C2B] border border-white/[0.1] text-xs font-medium text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{t({ en: 'Reset', es: 'Reiniciar', fr: 'Réinitialiser', ar: 'إعادة ضبط' })}</span>
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

      {/* Scenario Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 me-1">
            {t({ en: 'Simulate Scenarios:', es: 'Simular Escenarios:', fr: 'Simuler Scénarios :', ar: 'اختبار استجابة الخوارزمية:' })}
          </span>
          <button
            type="button"
            onClick={() => applyScenario('optimal')}
            className="px-3 py-1.5 rounded-lg bg-[#10B981]/12 hover:bg-[#10B981]/22 border border-[#10B981]/35 text-[#10B981] text-xs font-semibold cursor-pointer"
          >
            {t({ en: 'Optimal (~1.10)', es: 'Óptimo (~1.10)', fr: 'Optimal (~1.10)', ar: 'النطاق المثالي (~1.10)' })}
          </button>
          <button
            type="button"
            onClick={() => applyScenario('spikeAlert')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/12 hover:bg-rose-500/22 border border-rose-500/35 text-rose-400 text-xs font-semibold cursor-pointer"
          >
            {t({ en: 'Overload Spike (>1.75)', es: 'Pico de Sobrecarga (>1.75)', fr: 'Pic de Surcharge (>1.75)', ar: 'طفرة خطرة (>1.75)' })}
          </button>
          <button
            type="button"
            onClick={() => applyScenario('rehab')}
            className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/12 hover:bg-[#D4AF37]/22 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold cursor-pointer"
          >
            {t({ en: 'Rehab Return', es: 'Retorno de Rehab', fr: 'Retour Rééducation', ar: 'تأهيل المفاصل' })}
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-400">
          <span>
            {t({
              en: `Confidence: ${risk.confidencePercent}%`,
              es: `Confianza: ${risk.confidencePercent}%`,
              fr: `Confiance : ${risk.confidencePercent}%`,
              ar: `الدقة: ${risk.confidencePercent}%`
            })}
          </span>
          <span>·</span>
          <span className="text-[#00F0FF]">{risk.horizonDays}</span>
        </div>
      </div>

      {/* Diagnostic Readout Row: Radial Risk Dial + 6-Axis Anatomical Strain Radar + Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Risk Radial Dial & ACWR Corridor (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B0E16] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between space-y-5">
          <div className="flex flex-col items-center text-center pt-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-[0.16em] mb-3">
              {t({ en: '7-DAY SOFT-TISSUE RISK', es: 'RIESGO TEJIDO BLANDO (7D)', fr: 'RISQUE TISSUS MOUS (7J)', ar: 'احتمالية الإصابة (7 أيام)' })}
            </span>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={radius} fill="none" stroke="#171C2B" strokeWidth="10" />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={risk.riskColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono tabular-nums">
                <span className="text-3xl font-extrabold" style={{ color: risk.riskColor }}>
                  {risk.totalRisk}%
                </span>
                <span className="text-[10px] text-slate-400 uppercase">{risk.riskLevel}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/[0.07]">
            <div className="flex justify-between items-center text-xs font-mono tabular-nums">
              <span className="text-slate-400">ACWR Ratio</span>
              <span className="text-base font-bold text-[#00F0FF]">{risk.acwr}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-500 w-[30%]" />
              <div className="h-full bg-emerald-500 w-[35%]" />
              <div className="h-full bg-amber-500 w-[15%]" />
              <div className="h-full bg-rose-600 w-[20%]" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>&lt;0.8</span>
              <span className="text-emerald-400">0.85–1.25</span>
              <span className="text-rose-400">&gt;1.5</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#07080D] border border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>{t({ en: 'Synced Sleep Index', es: 'Índice de Sueño Sincronizado', fr: 'Indice Sommeil Synchronisé', ar: 'مختبر النوم الحي' })}</span>
            </span>
            <span className="font-mono tabular-nums font-bold text-[#00F0FF]">
              {sleepEval.overallScore}/100 · {state.totalSleepHours}h
            </span>
          </div>
        </div>

        {/* Center: Live Recharts 6-Axis Anatomical Vulnerability Radar (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B0E16] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t({ en: 'ANATOMICAL STRAIN RADAR', es: 'RADAR DE TENSIÓN ANATÓMICA', fr: 'RADAR DE CHARGE ANATOMIQUE', ar: 'خريطة الإجهاد التشريحي' })}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">0–100%</span>
          </div>

          <div className="w-full h-56 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                <PolarGrid stroke="#1E293B" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#07090F',
                    borderColor: 'rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    fontSize: '11px'
                  }}
                />
                <Radar
                  name={t({ en: 'Safe Baseline', es: 'Base Segura', fr: 'Référence Sûre', ar: 'الحد الآمن' })}
                  dataKey="baseline"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.12}
                  strokeWidth={1.5}
                />
                <Radar
                  name={t({ en: 'Live Tissue Load', es: 'Carga Tisular en Vivo', fr: 'Charge Tissulaire Directe', ar: 'الحمل الفعلي' })}
                  dataKey="strain"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.28}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-5 text-[10px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
            <span className="text-rose-400">● {t({ en: 'Live Strain', es: 'Tensión Activa', fr: 'Charge Active', ar: 'الحمل الفعلي' })}</span>
            <span className="text-[#10B981]">● {t({ en: 'Baseline', es: 'Base Segura', fr: 'Base Sûre', ar: 'الحد الآمن' })}</span>
          </div>
        </div>

        {/* Right: Factor Attribution Breakdown & Medical Directive (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B0E16] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
              {t({ en: 'RISK ATTRIBUTION WEIGHTS', es: 'PESOS DE ATRIBUCIÓN DE RIESGO', fr: 'PONDÉRATION DU RISQUE', ar: 'تفكيك أوزان الخطر (Attribution)' })}
            </span>

            {[
              { label: t({ en: 'ACWR Load', es: 'Carga ACWR', fr: 'Charge ACWR', ar: 'حمل ACWR' }), val: risk.attribution.acwrLoad, color: '#FFFFFF' },
              { label: t({ en: 'Foster Strain', es: 'Tensión Foster', fr: 'Charge Foster', ar: 'إجهاد Foster' }), val: risk.attribution.strainMonotony, color: '#D4AF37' },
              { label: t({ en: 'Anatomical Zones', es: 'Zonas Anatómicas', fr: 'Zones Anatomiques', ar: 'المفاصل المصابة' }), val: risk.attribution.anatomicalZones, color: '#EF4444' },
              { label: t({ en: 'Sleep & HRV', es: 'Sueño y HRV', fr: 'Sommeil & HRV', ar: 'النوم و HRV' }), val: risk.attribution.sleepAndAutonomic, color: '#00F0FF' }
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs font-mono tabular-nums">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-bold" style={{ color: item.color }}>+{item.val}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#151A28] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, item.val * 2.2)}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[#07080D] border border-white/[0.07] space-y-1.5">
            <span className="text-[11px] font-bold text-[#00F0FF] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t({ en: 'CLINICAL DIRECTIVE', es: 'DIRECTIVA CLÍNICA', fr: 'DIRECTIVE CLINIQUE', ar: 'التوجيه الطبي الوقائي' })}</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t({
                en: risk.recommendedActionEn,
                es: risk.recommendedActionEs || risk.recommendedActionEn,
                fr: risk.recommendedActionFr || risk.recommendedActionEn,
                ar: risk.recommendedActionAr
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Workload Parameters & Anatomical Hotspots Grid */}
      <div className="bg-[#0B0E16] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00F0FF]" />
            <span>{t({ en: 'WORKLOAD & ANATOMICAL HOTSPOT CONTROLS', es: 'CONTROLES DE CARGA Y PUNTOS CRÍTICOS', fr: 'CONTRÔLES DE CHARGE & ZONES SENSIBLES', ar: 'ضوابط الحمل التدريبي ونقاط الضعف' })}</span>
          </span>
          <span className="text-xs font-mono tabular-nums text-[#D4AF37]">
            Foster Strain: {risk.fosterStrain} AU ({risk.strainState})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{t({ en: 'Acute Load (7d)', es: 'Carga Aguda (7d)', fr: 'Charge Aiguë (7j)', ar: 'الحمل الحاد (7 أيام)' })}</span>
              <span className="font-mono tabular-nums text-rose-400 font-bold">{state.acuteLoad7d} AU</span>
            </div>
            <input
              type="range"
              min={400}
              max={2500}
              step={25}
              value={state.acuteLoad7d}
              onChange={(e) => updateField('acuteLoad7d', parseInt(e.target.value, 10))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{t({ en: 'Chronic Load (28d)', es: 'Carga Crónica (28d)', fr: 'Charge Chronique (28j)', ar: 'الحمل المزمن (28 يوم)' })}</span>
              <span className="font-mono tabular-nums text-[#00F0FF] font-bold">{state.chronicLoad28d} AU</span>
            </div>
            <input
              type="range"
              min={400}
              max={2500}
              step={25}
              value={state.chronicLoad28d}
              onChange={(e) => updateField('chronicLoad28d', parseInt(e.target.value, 10))}
              className="w-full accent-[#00F0FF] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{t({ en: 'Foster Monotony', es: 'Monotonía Foster', fr: 'Monotonie Foster', ar: 'رتابة Foster' })}</span>
              <span className="font-mono tabular-nums text-[#D4AF37] font-bold">{state.trainingMonotony.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={2.6}
              step={0.05}
              value={state.trainingMonotony}
              onChange={(e) => updateField('trainingMonotony', parseFloat(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{t({ en: 'Session RPE', es: 'RPE de Sesión', fr: 'RPE de Séance', ar: 'شدة الجهد RPE' })}</span>
              <span className="font-mono tabular-nums text-[#D4AF37] font-bold">{state.sessionRpe}/10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={state.sessionRpe}
              onChange={(e) => updateField('sessionRpe', parseInt(e.target.value, 10))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{t({ en: 'HRV Suppression', es: 'Supresión de HRV', fr: 'Suppression HRV', ar: 'هبوط HRV العصبي' })}</span>
              <span className="font-mono tabular-nums text-[#00F0FF] font-bold">{state.hrvSuppressionPercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={state.hrvSuppressionPercent}
              onChange={(e) => updateField('hrvSuppressionPercent', parseInt(e.target.value, 10))}
              className="w-full accent-[#00F0FF] cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 items-center content-start">
            {[
              { key: 'hamstring' as InjuryZoneKey, labelEn: 'Hamstring +13%', labelEs: 'Isquios +13%', labelFr: 'Ischios +13%', labelAr: 'أوتار +13%' },
              { key: 'knee' as InjuryZoneKey, labelEn: 'Knee +12%', labelEs: 'Rodilla +12%', labelFr: 'Genou +12%', labelAr: 'ركبة +12%' },
              { key: 'ankle' as InjuryZoneKey, labelEn: 'Ankle +10%', labelEs: 'Tobillo +10%', labelFr: 'Cheville +10%', labelAr: 'كاحل +10%' },
              { key: 'lowerBack' as InjuryZoneKey, labelEn: 'Lumbar +10%', labelEs: 'Lumbar +10%', labelFr: 'Lombaire +10%', labelAr: 'ظهر +10%' },
              { key: 'shoulder' as InjuryZoneKey, labelEn: 'Shoulder +8%', labelEs: 'Hombro +8%', labelFr: 'Épaule +8%', labelAr: 'كتف +8%' }
            ].map((zone) => {
              const active = state.previousInjuryZones[zone.key];
              return (
                <button
                  key={zone.key}
                  type="button"
                  onClick={() => toggleZone(zone.key)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer transition-colors ${
                    active
                      ? 'bg-rose-500/20 border-rose-500 text-white'
                      : 'bg-[#07080D] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  {t({ en: zone.labelEn, es: zone.labelEs, fr: zone.labelFr, ar: zone.labelAr })}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 30-Day Telemetry Chart */}
      <InjuryRiskHistoryChart currentLang={currentLang} />
    </div>
  );
};

export default InjuryPredictionAlgorithm;
