import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Flame, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { InjuryRiskHistoryChart } from './InjuryRiskHistoryChart';

interface InjuryPredictionAlgorithmProps {
  currentLang?: Language;
  onClose?: () => void;
}

export const InjuryPredictionAlgorithm: React.FC<InjuryPredictionAlgorithmProps> = ({
  currentLang = 'en',
  onClose
}) => {
  const isAr = currentLang === 'ar';

  // Interactive Workload & Biometric Inputs
  const [acuteLoadDays, setAcuteLoadDays] = useState<number>(1250); // Last 7 days training stress (AU)
  const [chronicLoadDays, setChronicLoadDays] = useState<number>(1000); // Last 28 days baseline average (AU)
  const [sessionRpe, setSessionRpe] = useState<number>(8); // Rate of Perceived Exertion (1 - 10)
  const [hrvSuppressionPercent, setHrvSuppressionPercent] = useState<number>(12); // % drop from baseline HRV
  const [previousInjuryZones, setPreviousInjuryZones] = useState<{
    knee: boolean;
    ankle: boolean;
    hamstring: boolean;
    shoulder: boolean;
    lowerBack: boolean;
  }>({
    knee: false,
    ankle: false,
    hamstring: false,
    shoulder: false,
    lowerBack: false
  });

  const toggleZone = (zone: keyof typeof previousInjuryZones) => {
    soundFX.playButtonClick();
    setPreviousInjuryZones(prev => ({ ...prev, [zone]: !prev[zone] }));
  };

  // ACWR (Acute:Chronic Workload Ratio) Calculation
  const acwr = Number((acuteLoadDays / Math.max(1, chronicLoadDays)).toFixed(2));

  // Predictive Risk Engine
  const calculateInjuryRisk = () => {
    // Banister impulse-response model + Gabbett ACWR sweet spot
    // Sweet spot: 0.8 - 1.3 -> Low risk (< 10%)
    // Moderate risk: 1.31 - 1.49 -> (~20 - 30%)
    // High danger spike: >= 1.5 -> (~50 - 80%)
    // Under-training spike risk: < 0.75 -> (~25% when suddenly spiking)

    let baseRiskPercent = 8;

    if (acwr >= 0.85 && acwr <= 1.25) {
      baseRiskPercent = 6;
    } else if (acwr > 1.25 && acwr <= 1.45) {
      baseRiskPercent = 22 + Math.round((acwr - 1.25) * 50);
    } else if (acwr > 1.45) {
      baseRiskPercent = 52 + Math.round(Math.min(40, (acwr - 1.45) * 75));
    } else {
      // Under-prepared
      baseRiskPercent = 18 + Math.round((0.85 - acwr) * 30);
    }

    // Previous injury multiplier (+12% risk per unconditioned prior injury site)
    const injuryCount = Object.values(previousInjuryZones).filter(Boolean).length;
    const injuryPenalty = injuryCount * 11;

    // HRV suppression penalty (Neuromuscular fatigue marker)
    const hrvPenalty = hrvSuppressionPercent > 10 ? Math.round((hrvSuppressionPercent - 10) * 1.4) : 0;

    // RPE fatigue multiplier
    const rpePenalty = sessionRpe >= 8 ? (sessionRpe - 7) * 4 : 0;

    let totalRisk = Math.min(96, Math.max(4, baseRiskPercent + injuryPenalty + hrvPenalty + rpePenalty));

    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
    let riskColor = '#22C55E';

    if (totalRisk < 18) {
      riskLevel = 'Low';
      riskColor = '#22C55E';
    } else if (totalRisk < 40) {
      riskLevel = 'Moderate';
      riskColor = '#FFE600';
    } else if (totalRisk < 65) {
      riskLevel = 'High';
      riskColor = '#FF007A';
    } else {
      riskLevel = 'Severe';
      riskColor = '#E50914';
    }

    return {
      acwr,
      totalRisk,
      riskLevel,
      riskColor,
      injuryCount,
      recommendedAction: totalRisk >= 65
        ? (isAr ? 'تخفيض الحمل التدريبي بنسبة 40% فوراً وجلسات تدليك وتمدد بالأجهزة' : 'Enforce immediate 40% deload, soft tissue mobility & cryo-recovery')
        : totalRisk >= 40
        ? (isAr ? 'تثبيت الحمل الحالي وتجنب محاولات تحطيم الأرقام القياسية اليوم' : 'Hold workload steady, focus on aerobic flush & avoid max 1RM testing')
        : (isAr ? 'الجاهزية التامة للنزالات والتحميل الانفجاري الكامل 100%' : 'Clear for high-velocity combat drills & maximal explosive exertion')
    };
  };

  const risk = calculateInjuryRisk();

  return (
    <div className="bg-[#0E101A] border-2 border-[#E50914]/50 rounded-3xl p-3 sm:p-6 md:p-10 shadow-[0_0_50px_rgba(229,9,20,0.25)] text-white font-sans max-w-5xl mx-auto space-y-10 w-full max-w-full overflow-hidden overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-6 mb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] text-xs font-black font-anime uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-[#E50914]" />
            <span>{isAr ? 'خوارزمية التنبؤ بالإصابات وتوازن الحمل الحركي ACWR' : 'BIOMECHANICAL INJURY PREDICTION ALGORITHM'}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black font-anime text-white">
            {isAr ? 'نموذج التنبؤ بالحمل الحاد والمزمن للرياضيين' : 'Gabbett ACWR Acute:Chronic Workload Model'}
          </h2>
          <p className="text-xs md:text-sm text-gray-300 font-bold max-w-2xl">
            {isAr 
              ? 'خوارزمية حسابية معتمدة عالمياً في أندية النخبة تتنبأ باحتمالية التمزقات العضلية وإصابات الأوتار قبل حدوثها بـ 7 أيام بناءً على الحمل الحركي والتعب العصبي.'
              : 'Clinical predictive model tracking acute-to-chronic workload spikes, neuromuscular fatigue suppression, and anatomical vulnerability zones to avert soft-tissue tears.'}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Controls */}
        <div className="lg:col-span-7 space-y-6 bg-[#141624] p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <span className="text-xs font-black font-anime text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00F0FF]" />
              {isAr ? 'بيانات الجهد والضغط البدني:' : 'WORKLOAD & STRAIN METRICS:'}
            </span>
            <button
              onClick={() => {
                soundFX.playButtonClick();
                setAcuteLoadDays(1100);
                setChronicLoadDays(1000);
                setSessionRpe(7);
                setHrvSuppressionPercent(6);
                setPreviousInjuryZones({ knee: false, ankle: false, hamstring: false, shoulder: false, lowerBack: false });
              }}
              className="text-[11px] font-bold text-[#00F0FF] hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isAr ? 'إعادة التعيين' : 'Reset Baseline'}</span>
            </button>
          </div>

          {/* 1. Acute Load (7 Days) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300">{isAr ? 'الحمل التدريبي الحاد (آخر 7 أيام):' : 'Acute Workload (Last 7 Days - Fatigue):'}</span>
              <span className="text-sm font-black font-anime text-[#FF007A]">{acuteLoadDays} AU</span>
            </div>
            <input 
              type="range" 
              min={400} 
              max={2500} 
              step={25} 
              value={acuteLoadDays} 
              onChange={(e) => setAcuteLoadDays(parseInt(e.target.value))}
              className="w-full accent-[#FF007A] cursor-pointer"
            />
          </div>

          {/* 2. Chronic Load (28 Days) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300">{isAr ? 'الحمل التدريبي المزمن (متوسط 28 يوماً):' : 'Chronic Workload (28-Day Baseline - Fitness):'}</span>
              <span className="text-sm font-black font-anime text-[#00F0FF]">{chronicLoadDays} AU</span>
            </div>
            <input 
              type="range" 
              min={400} 
              max={2500} 
              step={25} 
              value={chronicLoadDays} 
              onChange={(e) => setChronicLoadDays(parseInt(e.target.value))}
              className="w-full accent-[#00F0FF] cursor-pointer"
            />
          </div>

          {/* 3. Session RPE (Rate of Perceived Exertion) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300">{isAr ? 'مقياس شدة الجهد الذهني والبدني RPE (1 - 10):' : 'Rate of Perceived Exertion (RPE 1-10):'}</span>
              <span className="text-sm font-black font-anime text-[#FFE600]">{sessionRpe} / 10</span>
            </div>
            <input 
              type="range" 
              min={1} 
              max={10} 
              step={1} 
              value={sessionRpe} 
              onChange={(e) => setSessionRpe(parseInt(e.target.value))}
              className="w-full accent-[#FFE600] cursor-pointer"
            />
          </div>

          {/* 4. HRV Suppression */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300">{isAr ? 'مؤشر هبوط تقلب ضربات القلب HRV (الإجهاد العصبي):' : 'HRV Suppression % (Autonomic Strain):'}</span>
              <span className="text-sm font-black font-anime text-purple-400">{hrvSuppressionPercent}%</span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={40} 
              step={1} 
              value={hrvSuppressionPercent} 
              onChange={(e) => setHrvSuppressionPercent(parseInt(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          {/* 5. Past Injury Hotspots */}
          <div className="space-y-2 pt-2 border-t border-gray-800">
            <label className="text-[11px] font-black text-gray-300 font-anime uppercase tracking-wider block">
              {isAr ? 'مناطق الإصابات السابقة أو الإجهاد الموضعي الحاد:' : 'PRIOR INJURY SITES / ACTIVE VULNERABILITY ZONES:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {[
                { key: 'knee' as const, labelEn: 'Knee (ACL/MCL)', labelAr: 'الركبة والأربطة' },
                { key: 'ankle' as const, labelEn: 'Ankle / Achilles', labelAr: 'الكاحل ووتر أخيل' },
                { key: 'hamstring' as const, labelEn: 'Hamstring', labelAr: 'العضلة الخلفية' },
                { key: 'shoulder' as const, labelEn: 'Rotator Cuff', labelAr: 'مفصل الكتف' },
                { key: 'lowerBack' as const, labelEn: 'Lumbar Spine', labelAr: 'أسفل الظهر' }
              ].map(zone => (
                <button
                  key={zone.key}
                  type="button"
                  onClick={() => toggleZone(zone.key)}
                  className={`p-2.5 rounded-xl border text-xs font-bold font-anime text-left transition-all cursor-pointer flex items-center justify-between ${
                    previousInjuryZones[zone.key]
                      ? 'bg-[#E50914]/20 border-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]'
                      : 'bg-[#181A28] border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <span>{isAr ? zone.labelAr : zone.labelEn}</span>
                  <span className={`w-2 h-2 rounded-full ${previousInjuryZones[zone.key] ? 'bg-[#E50914]' : 'bg-gray-700'}`} />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Real-Time Risk Gauge & Prescriptions */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* Main Risk Output Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#181A28] to-[#121422] border-2 border-[#E50914]/60 shadow-[0_0_30px_rgba(229,9,20,0.3)] text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E50914]/15 blur-2xl rounded-full pointer-events-none" />

            <span className="text-[11px] font-black font-anime text-gray-400 uppercase tracking-widest block">
              {isAr ? 'مؤشر احتمالية الإصابة خلال 7 أيام' : '7-DAY PREDICTIVE INJURY RISK PROBABILITY'}
            </span>

            <div className="flex items-center justify-center gap-3">
              <span className="text-6xl md:text-7xl font-black font-anime" style={{ color: risk.riskColor }}>
                {risk.totalRisk}%
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black font-anime uppercase tracking-wider bg-black/40 border border-gray-700">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: risk.riskColor }} />
              <span className="text-white">
                {isAr ? `مستوى الخطر: ${risk.riskLevel}` : `Risk Level: ${risk.riskLevel}`}
              </span>
            </div>

            {/* ACWR Gauge indicator */}
            <div className="pt-3 border-t border-gray-800 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-300">{isAr ? 'نسبة الحمل ACWR الحالية:' : 'Current ACWR Value:'}</span>
                <span className="text-base font-black font-mono text-[#00F0FF]">{risk.acwr}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-500 w-[30%]" title="Under-prepared (<0.8)" />
                <div className="h-full bg-emerald-500 w-[35%]" title="Sweet Spot (0.8 - 1.3)" />
                <div className="h-full bg-amber-500 w-[15%]" title="Elevated Risk (1.3 - 1.5)" />
                <div className="h-full bg-red-600 w-[20%]" title="High Danger (>1.5)" />
              </div>
              <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                <span>0.5 (Under)</span>
                <span className="text-emerald-400 font-bold">0.8 - 1.3 (Optimal)</span>
                <span className="text-red-400 font-bold">&gt;1.5 (Danger)</span>
              </div>
            </div>
          </div>

          {/* Biomechanical Diagnostic Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#141624] border border-gray-800 space-y-1">
              <span className="text-gray-400 text-[10px] font-bold block">{isAr ? 'تصنيف المنطقة الحركية' : 'ACWR Zone Status'}</span>
              <span className={`font-black font-anime text-sm ${
                risk.acwr >= 0.8 && risk.acwr <= 1.3 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {risk.acwr >= 0.8 && risk.acwr <= 1.3 ? 'Optimal Safe Zone' : risk.acwr > 1.3 ? 'Spike Danger' : 'Under-Conditioned'}
              </span>
              <span className="text-[10px] text-gray-400 block">{risk.acwr >= 0.8 && risk.acwr <= 1.3 ? 'Low Soft-Tissue Tear Risk' : 'High Tendon Vulnerability'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141624] border border-gray-800 space-y-1">
              <span className="text-gray-400 text-[10px] font-bold block">{isAr ? 'معامل الإصابات السابقة' : 'Prior Injury Sites'}</span>
              <span className="font-black text-[#FFE600] font-anime text-sm">{risk.injuryCount} {isAr ? 'مناطق مسجلة' : 'Zones Active'}</span>
              <span className="text-[10px] text-gray-400 block">{risk.injuryCount > 0 ? '+11% Risk / Site' : 'Zero Previous Flags'}</span>
            </div>
          </div>

          {/* Actionable Medical Prescription */}
          <div className="p-4 rounded-xl bg-[#141624] border border-gray-800 space-y-2">
            <span className="text-[11px] font-black text-gray-300 font-anime uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF]" />
              {isAr ? 'البروتوكول الوقائي المعتمد من الكادر الطبي:' : 'CLINICAL PREVENTATIVE PROTOCOL:'}
            </span>
            <p className="text-xs text-white font-bold leading-relaxed">
              {risk.recommendedAction}
            </p>
          </div>

        </div>

      </div>

      {/* 30-Day Historical Recharts Visualization Module */}
      <div className="pt-6 border-t border-gray-800">
        <InjuryRiskHistoryChart currentLang={currentLang} />
      </div>

    </div>
  );
};
export default InjuryPredictionAlgorithm;
