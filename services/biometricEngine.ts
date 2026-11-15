/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type InjuryZoneKey = 'knee' | 'ankle' | 'hamstring' | 'shoulder' | 'lowerBack';

export interface BiometricTelemetryState {
  // Workload & Strain (Injury Prediction Lab)
  acuteLoad7d: number;           // 7-day cumulative AU (400 - 2500)
  chronicLoad28d: number;        // 28-day rolling baseline AU (400 - 2500)
  trainingMonotony: number;      // Foster monotony index Mean/SD (1.0 - 2.6)
  sessionRpe: number;            // Rate of Perceived Exertion (1 - 10)
  hrvSuppressionPercent: number; // % drop below personal 30d HRV baseline (0 - 40%)
  previousInjuryZones: Record<InjuryZoneKey, boolean>;

  // Circadian & Sleep Architecture (Sleep Studies Lab)
  totalSleepHours: number;            // 4.0 - 11.0h
  deepSleepPercent: number;           // NREM3 % (5 - 35%)
  remSleepPercent: number;            // REM % (8 - 35%)
  sleepLatencyMinutes: number;        // 2 - 90 min
  nocturnalAwakenings: number;        // 0 - 8
  baselineSpo2: number;               // 88 - 100%
  nocturnalHrDipPercent: number;      // 0 - 22% nocturnal heart rate drop
  eveningScreenTimeHours: number;     // 0 - 5h
  caffeineCutoffHoursBeforeBed: number; // 1 - 14h
}

export interface SleepArchitectureEvaluation {
  overallScore: number;
  durationScore: number;
  deepScore: number;
  remScore: number;
  respiratoryScore: number;
  recoveryState: 'Optimal' | 'Good' | 'Impaired' | 'Critical';
  sleepDebt: number;
  deepMinutes: number;
  remMinutes: number;
  lightMinutes: number;
  growthHormoneEst: string;
  reflexLatencyAdjustment: string;
  sleepInjuryModifier: number; // Additive risk transferred to ACWR Injury Engine
}

export interface InjuryRiskEvaluation {
  acwr: number;
  fosterStrain: number;
  strainState: 'Safe' | 'Elevated' | 'Overload';
  totalRisk: number;
  confidencePercent: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  riskColor: string;
  injuryCount: number;
  horizonDays: string;
  attribution: {
    acwrLoad: number;
    strainMonotony: number;
    anatomicalZones: number;
    sleepAndAutonomic: number;
  };
  recommendedActionEn: string;
  recommendedActionAr: string;
  recommendedActionEs: string;
  recommendedActionFr: string;
}

const STORAGE_KEY = 'yard300_clinical_biometrics_v1';
const BIOMETRIC_EVENT = 'yard300_biometrics_updated';

export const DEFAULT_BIOMETRIC_STATE: BiometricTelemetryState = {
  acuteLoad7d: 1180,
  chronicLoad28d: 1020,
  trainingMonotony: 1.35,
  sessionRpe: 7,
  hrvSuppressionPercent: 8,
  previousInjuryZones: {
    knee: false,
    ankle: false,
    hamstring: false,
    shoulder: false,
    lowerBack: false
  },
  totalSleepHours: 8.0,
  deepSleepPercent: 22,
  remSleepPercent: 23,
  sleepLatencyMinutes: 14,
  nocturnalAwakenings: 1,
  baselineSpo2: 98,
  nocturnalHrDipPercent: 14,
  eveningScreenTimeHours: 0.5,
  caffeineCutoffHoursBeforeBed: 8
};

// Zone-specific biomechanical vulnerability weights
const ZONE_WEIGHTS: Record<InjuryZoneKey, number> = {
  hamstring: 13,
  knee: 12,
  ankle: 10,
  lowerBack: 10,
  shoulder: 8
};

export function evaluateSleepArchitecture(state: BiometricTelemetryState): SleepArchitectureEvaluation {
  // 1. Duration (Athlete ideal 7.8 - 9.0h)
  let durationScore = 0;
  if (state.totalSleepHours >= 7.8 && state.totalSleepHours <= 9.2) {
    durationScore = 100;
  } else if (state.totalSleepHours >= 7.0 && state.totalSleepHours < 7.8) {
    durationScore = 88;
  } else if (state.totalSleepHours >= 6.0 && state.totalSleepHours < 7.0) {
    durationScore = 68;
  } else if (state.totalSleepHours > 9.2) {
    durationScore = 86;
  } else {
    durationScore = Math.max(18, Math.round((state.totalSleepHours / 7.0) * 58));
  }

  // 2. Deep NREM3 (Tissue repair & GH release; optimal 19 - 25%)
  let deepScore = 0;
  if (state.deepSleepPercent >= 19 && state.deepSleepPercent <= 26) {
    deepScore = 100;
  } else if (state.deepSleepPercent >= 15 && state.deepSleepPercent < 19) {
    deepScore = 84;
  } else if (state.deepSleepPercent >= 11 && state.deepSleepPercent < 15) {
    deepScore = 64;
  } else {
    deepScore = Math.min(96, Math.round((state.deepSleepPercent / 19) * 76));
  }

  // 3. REM Sleep (Neuromuscular & tactical motor consolidation; optimal 20 - 26%)
  let remScore = 0;
  if (state.remSleepPercent >= 20 && state.remSleepPercent <= 26) {
    remScore = 100;
  } else if (state.remSleepPercent >= 16 && state.remSleepPercent < 20) {
    remScore = 84;
  } else {
    remScore = Math.min(94, Math.round((state.remSleepPercent / 20) * 78));
  }

  // 4. Respiratory Oxygenation & Nocturnal Autonomic Dipping
  const spo2Component =
    state.baselineSpo2 >= 97 ? 100 :
    state.baselineSpo2 >= 95 ? 85 :
    state.baselineSpo2 >= 92 ? 55 : 25;

  const dipComponent =
    state.nocturnalHrDipPercent >= 10 && state.nocturnalHrDipPercent <= 20 ? 100 :
    state.nocturnalHrDipPercent >= 6 ? 78 : 48;

  const respiratoryScore = Math.round((spo2Component * 0.6) + (dipComponent * 0.4));

  // 5. Fragmentation & Circadian Disruptors
  const latencyPenalty = Math.max(0, (state.sleepLatencyMinutes - 15) * 0.9);
  const awakeningPenalty = state.nocturnalAwakenings * 4.5;
  const screenPenalty = state.eveningScreenTimeHours > 1 ? (state.eveningScreenTimeHours - 1) * 6.5 : 0;
  const caffeinePenalty = state.caffeineCutoffHoursBeforeBed < 8 ? (8 - state.caffeineCutoffHoursBeforeBed) * 3.2 : 0;

  let overallScore = Math.round(
    (durationScore * 0.30) +
    (deepScore * 0.28) +
    (remScore * 0.24) +
    (respiratoryScore * 0.18) -
    latencyPenalty -
    awakeningPenalty -
    screenPenalty -
    caffeinePenalty
  );

  overallScore = Math.max(15, Math.min(99, overallScore));

  let recoveryState: 'Optimal' | 'Good' | 'Impaired' | 'Critical' = 'Optimal';
  if (overallScore >= 85) recoveryState = 'Optimal';
  else if (overallScore >= 70) recoveryState = 'Good';
  else if (overallScore >= 52) recoveryState = 'Impaired';
  else recoveryState = 'Critical';

  const sleepDebt = Number(Math.max(0, 8.25 - state.totalSleepHours).toFixed(1));
  const totalMinutes = Math.round(state.totalSleepHours * 60);
  const deepMinutes = Math.round(totalMinutes * (state.deepSleepPercent / 100));
  const remMinutes = Math.round(totalMinutes * (state.remSleepPercent / 100));
  const lightMinutes = Math.max(0, totalMinutes - deepMinutes - remMinutes);

  // Coupled Injury Risk Multiplier transferred to the ACWR model
  let sleepInjuryModifier = 0;
  if (overallScore < 55) sleepInjuryModifier = 18;
  else if (overallScore < 70) sleepInjuryModifier = 11;
  else if (overallScore < 82) sleepInjuryModifier = 5;

  if (state.baselineSpo2 < 94) sleepInjuryModifier += 5;

  return {
    overallScore,
    durationScore,
    deepScore,
    remScore,
    respiratoryScore,
    recoveryState,
    sleepDebt,
    deepMinutes,
    remMinutes,
    lightMinutes,
    growthHormoneEst: state.deepSleepPercent >= 18 ? 'High Peak (90–100%)' : state.deepSleepPercent >= 14 ? 'Moderate (65–80%)' : 'Suppressed (<50%)',
    reflexLatencyAdjustment: overallScore >= 82 ? '0 ms (Peak Reaction)' : overallScore >= 68 ? '+35 ms Delay' : '+110 ms Impaired Reflex',
    sleepInjuryModifier
  };
}

export function evaluateInjuryRisk(state: BiometricTelemetryState): InjuryRiskEvaluation {
  const acwr = Number((state.acuteLoad7d / Math.max(1, state.chronicLoad28d)).toFixed(2));
  const sleepEval = evaluateSleepArchitecture(state);

  // 1. Gabbett ACWR Sweet-Spot Nonlinear Risk Curve
  let acwrContribution = 6;
  if (acwr >= 0.85 && acwr <= 1.25) {
    acwrContribution = 6;
  } else if (acwr > 1.25 && acwr <= 1.45) {
    acwrContribution = 18 + Math.round((acwr - 1.25) * 65);
  } else if (acwr > 1.45) {
    acwrContribution = 36 + Math.round(Math.min(42, (acwr - 1.45) * 68));
  } else {
    // Under-trained fragility (< 0.85)
    acwrContribution = 14 + Math.round((0.85 - acwr) * 28);
  }

  // 2. Foster Training Strain (Acute Load * Monotony)
  const fosterStrain = Math.round(state.acuteLoad7d * state.trainingMonotony);
  let strainContribution = 0;
  let strainState: 'Safe' | 'Elevated' | 'Overload' = 'Safe';
  if (fosterStrain >= 2800 || state.trainingMonotony >= 2.0) {
    strainContribution = 14;
    strainState = 'Overload';
  } else if (fosterStrain >= 2000 || state.trainingMonotony >= 1.65) {
    strainContribution = 7;
    strainState = 'Elevated';
  }

  // 3. Weighted Prior Anatomical Hotspots
  const activeZones = (Object.keys(state.previousInjuryZones) as InjuryZoneKey[])
    .filter((k) => state.previousInjuryZones[k]);
  const zoneContribution = activeZones.reduce((sum, key) => sum + ZONE_WEIGHTS[key], 0);

  // 4. Autonomic (HRV suppression + RPE) + Cross-Linked Sleep Deficit
  const hrvPenalty = state.hrvSuppressionPercent > 9 ? Math.round((state.hrvSuppressionPercent - 9) * 1.25) : 0;
  const rpePenalty = state.sessionRpe >= 8 ? (state.sessionRpe - 7) * 3 : 0;
  const sleepAndAutonomic = hrvPenalty + rpePenalty + sleepEval.sleepInjuryModifier;

  const rawTotal = acwrContribution + strainContribution + zoneContribution + sleepAndAutonomic;
  const totalRisk = Math.min(97, Math.max(4, Math.round(rawTotal)));

  // Confidence increases with multi-signal convergence (normal ~94-97%)
  const confidencePercent = Math.min(98, 91 + (activeZones.length > 0 ? 2 : 0) + (state.baselineSpo2 >= 90 ? 3 : 0) + (state.trainingMonotony > 1 ? 2 : 0));

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let riskColor = '#22C55E';
  let horizonDays = '7+ Days Safe';

  if (totalRisk < 20) {
    riskLevel = 'Low';
    riskColor = '#22C55E';
    horizonDays = '7+ Days Safe';
  } else if (totalRisk < 42) {
    riskLevel = 'Moderate';
    riskColor = '#FFE600';
    horizonDays = '5–7 Days Watch';
  } else if (totalRisk < 68) {
    riskLevel = 'High';
    riskColor = '#FF007A';
    horizonDays = '3–4 Days Window';
  } else {
    riskLevel = 'Severe';
    riskColor = '#E50914';
    horizonDays = '24–72 Hours Critical';
  }

  const recommendedActionEn =
    totalRisk >= 68
      ? `Enforce immediate 40% volume deload (${sleepEval.sleepDebt > 0.5 ? 'recover ' + sleepEval.sleepDebt + 'h sleep debt + ' : ''}soft-tissue cryo & zero max-effort sprints).`
      : totalRisk >= 42
      ? `Hold acute workload steady, reduce session monotony (<1.5), prioritize NREM3 sleep (${state.deepSleepPercent}%), and clear anaerobic threshold flushes only.`
      : 'Cleared for full combat & sprint conditioning inside the 0.85–1.25 Gabbett sweet spot.';

  const recommendedActionAr =
    totalRisk >= 68
      ? `تطبيق خفض فوري للحمل بنسبة 40% (${sleepEval.sleepDebt > 0.5 ? 'مع تعويض ' + sleepEval.sleepDebt + ' ساعة نقص نوم + ' : ''}استشفاء بالبرودة وإيقاف السرعات القصوى مؤقتاً).`
      : totalRisk >= 42
      ? `تثبيت الحمل التدريبي اليوم وتنويع شدة الجلسات (خفض الرتابة <1.5) مع دعم النوم العميق (${state.deepSleepPercent}%) وتجنب محاولات الأوزان القصوى.`
      : 'جاهزية سريرية مثالية 100% لخوض التمارين القتالية والانفجارية ضمن النطاق الآمن (0.85–1.25 ACWR).';

  const recommendedActionEs =
    totalRisk >= 68
      ? `Aplicar descarga inmediata del 40% de volumen (${sleepEval.sleepDebt > 0.5 ? 'recuperar ' + sleepEval.sleepDebt + 'h de sueño + ' : ''}crioterapia y cero sprints máximos).`
      : totalRisk >= 42
      ? `Mantener la carga aguda estable, reducir monotonía (<1.5) y priorizar el sueño profundo NREM3 (${state.deepSleepPercent}%).`
      : 'Autorizado para entrenamiento completo de combate y sprint dentro de la zona segura Gabbett (0.85–1.25).';

  const recommendedActionFr =
    totalRisk >= 68
      ? `Appliquer une décharge immédiate de 40% du volume (${sleepEval.sleepDebt > 0.5 ? 'récupérer ' + sleepEval.sleepDebt + 'h de dette + ' : ''}cryothérapie et aucun sprint maximal).`
      : totalRisk >= 42
      ? `Maintenir la charge aiguë stable, réduire la monotonie (<1.5) et prioriser le sommeil profond NREM3 (${state.deepSleepPercent}%).`
      : 'Autorisé pour l’entraînement complet de combat et de sprint dans la zone optimale Gabbett (0.85–1.25).';

  return {
    acwr,
    fosterStrain,
    strainState,
    totalRisk,
    confidencePercent,
    riskLevel,
    riskColor,
    injuryCount: activeZones.length,
    horizonDays,
    attribution: {
      acwrLoad: acwrContribution,
      strainMonotony: strainContribution,
      anatomicalZones: zoneContribution,
      sleepAndAutonomic
    },
    recommendedActionEn,
    recommendedActionAr,
    recommendedActionEs,
    recommendedActionFr
  };
}

export const BiometricEngineService = {
  getState(): BiometricTelemetryState {
    if (typeof window === 'undefined') return { ...DEFAULT_BIOMETRIC_STATE };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_BIOMETRIC_STATE,
          ...parsed,
          previousInjuryZones: {
            ...DEFAULT_BIOMETRIC_STATE.previousInjuryZones,
            ...(parsed.previousInjuryZones || {})
          }
        };
      }
    } catch {
      // Ignore storage failures
    }
    return { ...DEFAULT_BIOMETRIC_STATE };
  },

  updateState(patch: Partial<BiometricTelemetryState>): BiometricTelemetryState {
    const current = this.getState();
    const next: BiometricTelemetryState = {
      ...current,
      ...patch,
      previousInjuryZones: patch.previousInjuryZones
        ? { ...current.previousInjuryZones, ...patch.previousInjuryZones }
        : current.previousInjuryZones
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(BIOMETRIC_EVENT, { detail: next }));
      }
    } catch {
      // Ignore storage errors
    }
    return next;
  },

  resetToOptimal(): BiometricTelemetryState {
    return this.updateState({ ...DEFAULT_BIOMETRIC_STATE });
  },

  subscribe(callback: (state: BiometricTelemetryState) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<BiometricTelemetryState>;
      callback(customEvent.detail || this.getState());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener(BIOMETRIC_EVENT, handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(BIOMETRIC_EVENT, handler);
      }
    };
  }
};
