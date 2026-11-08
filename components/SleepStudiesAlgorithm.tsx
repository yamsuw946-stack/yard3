import React, { useState } from 'react';
import { 
  Moon, 
  Sparkles, 
  Clock, 
  Heart, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';

interface SleepStudiesAlgorithmProps {
  currentLang?: Language;
  onClose?: () => void;
}

export const SleepStudiesAlgorithm: React.FC<SleepStudiesAlgorithmProps> = ({
  currentLang = 'en',
  onClose
}) => {
  const isAr = currentLang === 'ar';

  // Interactive Biometric Inputs
  const [totalSleepHours, setTotalSleepHours] = useState<number>(7.5);
  const [deepSleepPercent, setDeepSleepPercent] = useState<number>(22);
  const [remSleepPercent, setRemSleepPercent] = useState<number>(24);
  const [sleepLatencyMinutes, setSleepLatencyMinutes] = useState<number>(18);
  const [nocturnalAwakenings, setNocturnalAwakenings] = useState<number>(1);
  const [baselineSpo2, setBaselineSpo2] = useState<number>(97);
  const [eveningScreenTimeHours, setEveningScreenTimeHours] = useState<number>(1.0);
  const [caffeineCutoffHoursBeforeBed, setCaffeineCutoffHoursBeforeBed] = useState<number>(7);

  // Algorithmic Calculations
  const calculateSleepArchitecture = () => {
    // 1. Duration Score (Ideal: 7.5 - 9.0 hours for combat & endurance athletes)
    let durationScore = 0;
    if (totalSleepHours >= 8.0 && totalSleepHours <= 9.0) {
      durationScore = 100;
    } else if (totalSleepHours >= 7.0 && totalSleepHours < 8.0) {
      durationScore = 88;
    } else if (totalSleepHours >= 6.0 && totalSleepHours < 7.0) {
      durationScore = 70;
    } else if (totalSleepHours > 9.0) {
      durationScore = 85;
    } else {
      durationScore = Math.max(20, Math.round((totalSleepHours / 7.0) * 60));
    }

    // 2. Deep Sleep Score (NREM Stage 3 - Physical Muscle Repair & Growth Hormone Release; Target: 18 - 25%)
    let deepScore = 0;
    if (deepSleepPercent >= 20 && deepSleepPercent <= 25) {
      deepScore = 100;
    } else if (deepSleepPercent >= 16 && deepSleepPercent < 20) {
      deepScore = 85;
    } else if (deepSleepPercent >= 12 && deepSleepPercent < 16) {
      deepScore = 65;
    } else {
      deepScore = Math.min(100, Math.round((deepSleepPercent / 20) * 80));
    }

    // 3. REM Sleep Score (Neuromuscular Memory Consolidation & Reflex Coding; Target: 20 - 25%)
    let remScore = 0;
    if (remSleepPercent >= 20 && remSleepPercent <= 25) {
      remScore = 100;
    } else if (remSleepPercent >= 16 && remSleepPercent < 20) {
      remScore = 85;
    } else {
      remScore = Math.round((remSleepPercent / 20) * 80);
    }

    // 4. Sleep Efficiency & Fragmentation Penalty
    // Latency > 30 min or awakenings > 2 reduce efficiency
    let latencyPenalty = Math.max(0, (sleepLatencyMinutes - 15) * 1.2);
    let awakeningPenalty = nocturnalAwakenings * 6;
    let screenPenalty = eveningScreenTimeHours > 1 ? (eveningScreenTimeHours - 1) * 8 : 0;
    let caffeinePenalty = caffeineCutoffHoursBeforeBed < 8 ? (8 - caffeineCutoffHoursBeforeBed) * 4 : 0;

    let overallScore = Math.round(
      (durationScore * 0.35) + 
      (deepScore * 0.30) + 
      (remScore * 0.25) + 
      (baselineSpo2 >= 95 ? 10 : 0) - 
      latencyPenalty - 
      awakeningPenalty - 
      screenPenalty - 
      caffeinePenalty
    );

    overallScore = Math.max(15, Math.min(99, overallScore));

    // Recovery Index (Athletic Ready State)
    let recoveryState: 'Optimal' | 'Good' | 'Impaired' | 'Critical' = 'Optimal';
    if (overallScore >= 85) recoveryState = 'Optimal';
    else if (overallScore >= 70) recoveryState = 'Good';
    else if (overallScore >= 50) recoveryState = 'Impaired';
    else recoveryState = 'Critical';

    // Sleep Debt (Athletic reference baseline: 8.25h)
    const sleepDebt = Number(Math.max(0, 8.25 - totalSleepHours).toFixed(1));

    return {
      overallScore,
      durationScore,
      deepScore,
      remScore,
      recoveryState,
      sleepDebt,
      growthHormoneEst: deepSleepPercent >= 18 ? 'High Peak (90-100%)' : deepSleepPercent >= 14 ? 'Moderate (65-80%)' : 'Suppressed (<50%)',
      reflexLatencyAdjustment: overallScore >= 80 ? '0 ms (Peak Reaction)' : overallScore >= 65 ? '+45 ms Delay' : '+120 ms Impaired Reflex'
    };
  };

  const results = calculateSleepArchitecture();

  return (
    <div className="bg-[#0E101A] border-2 border-[#7000FF]/50 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(112,0,255,0.25)] text-white font-sans max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-6 mb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7000FF]/20 border border-[#7000FF]/40 text-[#00F0FF] text-xs font-black font-anime uppercase tracking-wider">
            <Moon className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{isAr ? 'خوارزمية هندسة وأطوار النوم الرياضي' : 'ATHLETIC SLEEP ARCHITECTURE ALGORITHM'}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black font-anime text-white">
            {isAr ? 'محلل جودة النوم العميق والاستشفاء العصبي' : 'Circadian Rhythm & Neuromuscular Sleep Lab'}
          </h2>
          <p className="text-xs md:text-sm text-gray-300 font-bold max-w-2xl">
            {isAr 
              ? 'نموذج تحليلي متطور يقيس أطوار النوم العميق (NREM3) ونوم حركة العين السريعة (REM) لحساب هرمون النمو والجاهزية العصبية للنزالات.'
              : 'Advanced clinical biometrics modeling Stage-3 deep restorative sleep and REM neurological consolidation for elite combat readiness.'}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#181A28] border border-gray-700 text-gray-300 hover:text-white text-xs font-bold font-anime cursor-pointer transition-all shrink-0"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        )}
      </div>

      {/* Main Grid: Sliders on Left, Diagnostic Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sliders & Metric Adjustments */}
        <div className="lg:col-span-7 space-y-6 bg-[#141624] p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <span className="text-xs font-black font-anime text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00F0FF]" />
              {isAr ? 'المحددات البيومترية للمنام:' : 'BIOMETRIC SLEEP INPUTS:'}
            </span>
            <button
              onClick={() => {
                soundFX.playButtonClick();
                setTotalSleepHours(8.0);
                setDeepSleepPercent(23);
                setRemSleepPercent(22);
                setSleepLatencyMinutes(14);
                setNocturnalAwakenings(1);
                setBaselineSpo2(98);
                setEveningScreenTimeHours(0.5);
                setCaffeineCutoffHoursBeforeBed(8);
              }}
              className="text-[11px] font-bold text-[#00F0FF] hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isAr ? 'إعادة التعيين للمثالي' : 'Reset to Pro Baseline'}</span>
            </button>
          </div>

          {/* 1. Total Sleep Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300">{isAr ? 'مدة النوم الكلية (ساعات):' : 'Total Sleep Duration (Hours):'}</span>
              <span className="text-sm font-black font-anime text-[#00F0FF]">{totalSleepHours} {isAr ? 'ساعات' : 'hrs'}</span>
            </div>
            <input 
              type="range" 
              min={4.0} 
              max={11.0} 
              step={0.5} 
              value={totalSleepHours} 
              onChange={(e) => setTotalSleepHours(parseFloat(e.target.value))}
              className="w-full accent-[#00F0FF] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>4.0h</span>
              <span className="text-[#22C55E]">8.2h {isAr ? '(مثالي للرياضيين)' : '(Pro Athlete Target)'}</span>
              <span>11.0h</span>
            </div>
          </div>

          {/* 2. Deep Sleep (NREM3) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300">{isAr ? 'نسبة النوم العميق NREM3 (إصلاح الألياف والعظام):' : 'Deep Sleep Stage 3 (Muscle Repair %):'}</span>
              <span className="text-sm font-black font-anime text-[#FFE600]">{deepSleepPercent}%</span>
            </div>
            <input 
              type="range" 
              min={5} 
              max={35} 
              step={1} 
              value={deepSleepPercent} 
              onChange={(e) => setDeepSleepPercent(parseInt(e.target.value))}
              className="w-full accent-[#FFE600] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>5% (Deficient)</span>
              <span className="text-[#FFE600]">20% - 25% (Optimal)</span>
              <span>35%</span>
            </div>
          </div>

          {/* 3. REM Sleep */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300">{isAr ? 'نسبة نوم حركة العين السريعة REM (سرعة رد الفعل):' : 'REM Sleep % (Motor Reflex Coding):'}</span>
              <span className="text-sm font-black font-anime text-[#FF007A]">{remSleepPercent}%</span>
            </div>
            <input 
              type="range" 
              min={8} 
              max={35} 
              step={1} 
              value={remSleepPercent} 
              onChange={(e) => setRemSleepPercent(parseInt(e.target.value))}
              className="w-full accent-[#FF007A] cursor-pointer"
            />
          </div>

          {/* 4. Sleep Latency & Awakenings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">
                {isAr ? 'فترة الاستغراق (دقيقة):' : 'Sleep Latency (Minutes):'}
              </label>
              <input
                type="number"
                min={2}
                max={90}
                value={sleepLatencyMinutes}
                onChange={(e) => setSleepLatencyMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1C2E] border border-gray-700 text-white font-mono text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">
                {isAr ? 'مرات الاستيقاظ الليلي:' : 'Night Awakenings:'}
              </label>
              <input
                type="number"
                min={0}
                max={8}
                value={nocturnalAwakenings}
                onChange={(e) => setNocturnalAwakenings(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1C2E] border border-gray-700 text-white font-mono text-xs font-bold"
              />
            </div>
          </div>

          {/* 5. Blue Light Screen & Caffeine Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-800">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">
                {isAr ? 'الشاشات قبل النوم (ساعة):' : 'Screen Time Pre-Bed (Hrs):'}
              </label>
              <input
                type="number"
                step={0.5}
                min={0}
                max={5}
                value={eveningScreenTimeHours}
                onChange={(e) => setEveningScreenTimeHours(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1C2E] border border-gray-700 text-white font-mono text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">
                {isAr ? 'التوقف عن الكافيين قبل (ساعات):' : 'Caffeine Cutoff Pre-Bed (Hrs):'}
              </label>
              <input
                type="number"
                min={1}
                max={14}
                value={caffeineCutoffHoursBeforeBed}
                onChange={(e) => setCaffeineCutoffHoursBeforeBed(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1C2E] border border-gray-700 text-white font-mono text-xs font-bold"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Algorithmic Diagnostics */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* Composite Score Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#181A28] to-[#121422] border-2 border-[#7000FF]/60 shadow-[0_0_30px_rgba(112,0,255,0.3)] text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7000FF]/15 blur-2xl rounded-full pointer-events-none" />
            
            <span className="text-[11px] font-black font-anime text-gray-400 uppercase tracking-widest block">
              {isAr ? 'مؤشر كفاءة النوم الرياضي الشامل' : 'ATHLETIC SLEEP RECOVERY INDEX'}
            </span>

            <div className="flex items-center justify-center gap-3">
              <span className={`text-6xl md:text-7xl font-black font-anime ${
                results.overallScore >= 80 ? 'text-[#00F0FF]' : results.overallScore >= 65 ? 'text-[#FFE600]' : 'text-[#E50914]'
              }`}>
                {results.overallScore}
              </span>
              <span className="text-xl font-black text-gray-400">/ 100</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black font-anime uppercase tracking-wider bg-black/40 border border-gray-700">
              <span className={`w-2 h-2 rounded-full ${
                results.recoveryState === 'Optimal' ? 'bg-[#22C55E]' : results.recoveryState === 'Good' ? 'bg-[#00F0FF]' : 'bg-[#E50914]'
              }`} />
              <span className="text-white">
                {isAr ? `الحالة: ${results.recoveryState}` : `Status: ${results.recoveryState}`}
              </span>
            </div>

            <p className="text-xs text-gray-300 font-bold leading-relaxed pt-2">
              {results.overallScore >= 85
                ? (isAr ? '🟢 استشفاء عصبي وعضلي كامل! النظام العصبي الودي في أعلى درجات التوازن وجاهز للنزالات والسباقات.' : '🟢 Maximum restorative synthesis! Parasympathetic tone fully recharged for peak explosive output.')
                : results.overallScore >= 70
                ? (isAr ? '🟡 استشفاء متوسط وجيد. يمكنك خوض تمارين معتدلة مع تجنب التحميل الزائد على الجهاز العصبي.' : '🟡 Moderate recovery state. Optimal for technical drill work; avoid extreme max-effort testing today.')
                : (isAr ? '🔴 استشفاء منخفض ومرتفع الخطورة! يُوصى بجلسة استشفاء خفيفة أو قيلولة إضافية لتفادي الإصابات.' : '🔴 Deficit alert! High neural fatigue detected. Recommended 30-min nap and deload recovery flow.')}
            </p>
          </div>

          {/* Sub-Metrics Breakdown */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#141624] border border-gray-800 space-y-1">
              <span className="text-gray-400 text-[10px] font-bold block">{isAr ? 'الدين التراكمي للنوم' : 'Sleep Debt'}</span>
              <span className="font-black text-white font-mono text-base">{results.sleepDebt} {isAr ? 'س' : 'hrs'}</span>
              <span className="text-[10px] text-[#00F0FF] block">{results.sleepDebt === 0 ? 'Zero Debt' : 'Accumulated'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141624] border border-gray-800 space-y-1">
              <span className="text-gray-400 text-[10px] font-bold block">{isAr ? 'ذروة إفراز هرمون النمو' : 'Growth Hormone (GH)'}</span>
              <span className="font-black text-[#FFE600] font-anime text-xs">{results.growthHormoneEst}</span>
              <span className="text-[10px] text-gray-400 block">NREM3 Dependent</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141624] border border-gray-800 space-y-1 col-span-2">
              <span className="text-gray-400 text-[10px] font-bold block">{isAr ? 'تأثير ردود الأفعال الحركية' : 'Reflex & Reaction Time Impact'}</span>
              <div className="flex items-center justify-between">
                <span className="font-black text-[#00F0FF] font-anime text-sm">{results.reflexLatencyAdjustment}</span>
                <span className="text-[10px] text-gray-400">{results.overallScore >= 80 ? '100% Precision' : 'Compromised'}</span>
              </div>
            </div>
          </div>

          {/* Scientific Sleep Hygiene Recommendations */}
          <div className="p-4 rounded-xl bg-[#141624] border border-gray-800 space-y-2">
            <span className="text-[11px] font-black text-gray-300 font-anime uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
              {isAr ? 'توصيات الأداء للنوم القتالي الموجه:' : 'COMBAT PERFORMANCE SLEEP DIRECTIVES:'}
            </span>
            <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside font-bold">
              <li>{isAr ? 'تثبيت موعد النوم والاستيقاظ بفارق لا يتعدى 20 دقيقة طوال الأسبوع.' : 'Maintain a strict circadian anchor (wake & sleep within ±20 min variance).'}</li>
              <li>{isAr ? 'خفض حرارة الغرفة إلى 18.5 - 19.5 درجة مئوية لتحفيز أطوار الـ NREM3.' : 'Cool the sleep chamber to 18.5°C - 19.5°C to trigger core body thermoregulation.'}</li>
              <li>{isAr ? 'حجب الضوء الأزرق تماماً قبل 60 دقيقة من موعد النوم.' : 'Eliminate high-kelvin blue screens 60 minutes prior to sleep onset.'}</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
export default SleepStudiesAlgorithm;
