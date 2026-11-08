import React, { useState, useMemo } from 'react';
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
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Info,
  Sliders,
  Layers
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';

interface HistoricalDataPoint {
  dayNumber: number;
  dateStr: string;
  dayLabel: string;
  acuteLoad: number;
  chronicLoad: number;
  acwr: number;
  hrv: number;
  riskScore: number; // 0 - 100%
  zone: 'safe' | 'elevated' | 'high_danger' | 'under_trained';
  sessionNoteEn: string;
  sessionNoteAr: string;
}

// Generate realistic 30-day clinical athlete dataset exhibiting authentic training cycles:
// - Days 1-7: Base conditioning (safe zone)
// - Days 8-12: High-intensity sparring & strike volume spike (danger spike)
// - Days 13-16: Enforced Deload / Active Recovery (restoration)
// - Days 17-23: Progressive Overload & Peak Output (optimal adaptation)
// - Days 24-27: Acute Load Spike (elevated tendon strain warning)
// - Days 28-30: Supercompensation Window before Championship
const generate30DayHistoricalData = (): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const baseChronic = 1000;

  const rawPatterns: Array<{
    acute: number;
    chronic: number;
    hrv: number;
    noteEn: string;
    noteAr: string;
  }> = [
    { acute: 920, chronic: 980, hrv: 72, noteEn: 'Aerobic recovery & shadow boxing', noteAr: 'استشفاء هوائي وملاكمة ظل خفيفة' },
    { acute: 1050, chronic: 985, hrv: 70, noteEn: 'Cadence footwork & agility ladder', noteAr: 'تمارين رشاقة وسرعة القدمين' },
    { acute: 1100, chronic: 990, hrv: 68, noteEn: 'Heavy bag power punch drills', noteAr: 'لكمات انفجارية على الكيس الثقيل' },
    { acute: 1180, chronic: 995, hrv: 66, noteEn: 'Functional kettlebell circuit', noteAr: 'دائرة تدريب وظيفي بأوزان الكتلبل' },
    { acute: 1020, chronic: 998, hrv: 71, noteEn: 'Active recovery flush & mobility', noteAr: 'جلسة مرونة واستشفاء هوائي' },
    { acute: 1150, chronic: 1005, hrv: 69, noteEn: 'Isometric neck & core conditioning', noteAr: 'تقوية عضلات الرقبة والجذع' },
    { acute: 1220, chronic: 1010, hrv: 67, noteEn: '5-round simulated combat sparring', noteAr: 'نزال محاكاة 5 جولات كاملة' },
    // Week 2: Dangerous Workload Spike (Days 8-12)
    { acute: 1450, chronic: 1015, hrv: 55, noteEn: 'Double session: Max 1RM & Sparring', noteAr: 'حمل تدريبي مضاعف: أوزان قصوى وقتال' },
    { acute: 1620, chronic: 1025, hrv: 48, noteEn: 'ACWR Spike! High tendon strain alert', noteAr: 'طفرة إجهاد حاد! تنبيه خطر الأوتار' },
    { acute: 1710, chronic: 1035, hrv: 44, noteEn: 'Peak acute fatigue, severe CNS drain', noteAr: 'إجهاد عصبي مركزي حاد وانخفاض HRV' },
    { acute: 1580, chronic: 1040, hrv: 49, noteEn: 'Residual soreness in knees & wrists', noteAr: 'إجهاد مفاصل وتيبس في الركبة' },
    { acute: 1420, chronic: 1045, hrv: 53, noteEn: 'Clinical staff flagged overload', noteAr: 'توصية الكادر الطبي بتخفيض الحمل' },
    // Deload Window (Days 13-16)
    { acute: 850, chronic: 1040, hrv: 68, noteEn: 'Enforced 40% deload & soft-tissue work', noteAr: 'تخفيض إجباري للحمل 40% وتدليك استشفائي' },
    { acute: 720, chronic: 1030, hrv: 75, noteEn: 'Hydro-therapy & Zen breath protocol', noteAr: 'علاج مائي وتنفس استرخائي زين' },
    { acute: 760, chronic: 1020, hrv: 78, noteEn: 'Rapid HRV restoration & joint relief', noteAr: 'انتعاش تقلب النبض واسترخاء المفاصل' },
    { acute: 890, chronic: 1015, hrv: 76, noteEn: 'Light technical drills & form reset', noteAr: 'تمارين فنية خفيفة لضبط التكنيك' },
    // Optimal Progressive Phase (Days 17-23)
    { acute: 1040, chronic: 1012, hrv: 74, noteEn: 'Re-entry to combat sweet spot', noteAr: 'دخول منطقة التكيف المثالية' },
    { acute: 1120, chronic: 1015, hrv: 72, noteEn: 'Explosive plyometrics & sprint reps', noteAr: 'تمارين بليومتريك انفجارية وسرعة' },
    { acute: 1190, chronic: 1020, hrv: 70, noteEn: 'Target precision strikes in YARD matrix', noteAr: 'دقة اللكمات في مصفوفة YARD' },
    { acute: 1240, chronic: 1026, hrv: 69, noteEn: 'Conditioning capacity building', noteAr: 'بناء القدرة التنفسية والعضلية' },
    { acute: 1260, chronic: 1032, hrv: 68, noteEn: 'High-velocity striking & defense drills', noteAr: 'سرعة رد الفعل والمناورات الدفاعية' },
    { acute: 1180, chronic: 1035, hrv: 71, noteEn: 'Active aerobic flush & sleep priority', noteAr: 'استشفاء هوائي وتركيز على النوم العميق' },
    { acute: 1280, chronic: 1040, hrv: 67, noteEn: 'Competitive tournament simulation', noteAr: 'محاكاة كاملة لأجواء البطولات' },
    // Moderate Spike (Days 24-26)
    { acute: 1480, chronic: 1048, hrv: 58, noteEn: 'High intensity conditioning surge', noteAr: 'تصاعد شدة التدريب وإجهاد العضلات' },
    { acute: 1530, chronic: 1055, hrv: 54, noteEn: 'Warning: Approaching 1.5 ACWR threshold', noteAr: 'تحذير: الاقتراب من سقف 1.5 ACWR' },
    { acute: 1390, chronic: 1058, hrv: 61, noteEn: 'Proactive workload regulation', noteAr: 'تعديل استباقي للحمل التدريبي' },
    // Final Taper & Supercompensation (Days 27-30)
    { acute: 1080, chronic: 1060, hrv: 72, noteEn: 'Championship taper: Volume down 30%', noteAr: 'مرحلة التهدئة: خفض الحجم التدريبي' },
    { acute: 950, chronic: 1055, hrv: 77, noteEn: 'Neuromuscular freshness rising', noteAr: 'تصاعد الجاهزية العصبية والبدنية' },
    { acute: 880, chronic: 1050, hrv: 81, noteEn: 'Peak recovery index, tendons primed', noteAr: 'أعلى معدل استشفاء ومرونة الأوتار' },
    { acute: 920, chronic: 1048, hrv: 84, noteEn: 'S-Rank Supercompensation achieved!', noteAr: 'تحقيق قمة الجاهزية والتعويض الفائق!' }
  ];

  rawPatterns.forEach((p, idx) => {
    const day = idx + 1;
    const acwrVal = Number((p.acute / p.chronic).toFixed(2));
    
    // Formula for Risk Score % (ACWR sweet spot vs spike + HRV suppression impact)
    let calculatedRisk = 8;
    if (acwrVal >= 0.85 && acwrVal <= 1.25) {
      calculatedRisk = Math.round(6 + (acwrVal - 0.85) * 15);
    } else if (acwrVal > 1.25 && acwrVal <= 1.45) {
      calculatedRisk = Math.round(18 + (acwrVal - 1.25) * 80);
    } else if (acwrVal > 1.45) {
      calculatedRisk = Math.round(48 + Math.min(38, (acwrVal - 1.45) * 90));
    } else {
      calculatedRisk = Math.round(15 + (0.85 - acwrVal) * 35);
    }

    // HRV suppression penalty
    if (p.hrv < 60) {
      calculatedRisk += Math.round((60 - p.hrv) * 0.8);
    }

    const clampedRisk = Math.min(94, Math.max(6, calculatedRisk));

    let zoneType: 'safe' | 'elevated' | 'high_danger' | 'under_trained' = 'safe';
    if (acwrVal >= 0.8 && acwrVal <= 1.3) {
      zoneType = 'safe';
    } else if (acwrVal > 1.3 && acwrVal <= 1.49) {
      zoneType = 'elevated';
    } else if (acwrVal > 1.49) {
      zoneType = 'high_danger';
    } else {
      zoneType = 'under_trained';
    }

    data.push({
      dayNumber: day,
      dateStr: `Day ${day}`,
      dayLabel: `D${day}`,
      acuteLoad: p.acute,
      chronicLoad: p.chronic,
      acwr: acwrVal,
      hrv: p.hrv,
      riskScore: clampedRisk,
      zone: zoneType,
      sessionNoteEn: p.noteEn,
      sessionNoteAr: p.noteAr
    });
  });

  return data;
};

interface InjuryRiskHistoryChartProps {
  currentLang?: Language;
}

export const InjuryRiskHistoryChart: React.FC<InjuryRiskHistoryChartProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const data = useMemo(() => generate30DayHistoricalData(), []);

  // Metric View Mode Switcher
  type MetricMode = 'risk' | 'acwr' | 'workload' | 'all';
  const [metricMode, setMetricMode] = useState<MetricMode>('risk');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(data.length - 1);

  // Performance Pattern Analytics derived from the 30-day dataset
  const stats = useMemo(() => {
    const scores = data.map(d => d.riskScore);
    const acwrs = data.map(d => d.acwr);
    const avgRisk = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const maxRiskPoint = data.reduce((max, curr) => curr.riskScore > max.riskScore ? curr : max, data[0]);
    const minRiskPoint = data.reduce((min, curr) => curr.riskScore < min.riskScore ? curr : min, data[0]);
    
    // Days in optimal sweet spot (0.8 - 1.3)
    const sweetSpotDays = data.filter(d => d.acwr >= 0.8 && d.acwr <= 1.3).length;
    const sweetSpotPercentage = Math.round((sweetSpotDays / data.length) * 100);

    // High danger spike days (> 1.49)
    const spikeDays = data.filter(d => d.acwr > 1.49).length;

    // Trend comparison: First 7 days average vs last 7 days average
    const first7Avg = data.slice(0, 7).reduce((acc, curr) => acc + curr.riskScore, 0) / 7;
    const last7Avg = data.slice(-7).reduce((acc, curr) => acc + curr.riskScore, 0) / 7;
    const trendDiff = Number((last7Avg - first7Avg).toFixed(1));

    return {
      avgRisk,
      maxRiskPoint,
      minRiskPoint,
      sweetSpotDays,
      sweetSpotPercentage,
      spikeDays,
      trendDiff,
      currentDay: data[selectedDayIndex] || data[data.length - 1]
    };
  }, [data, selectedDayIndex]);

  const activePoint = data[selectedDayIndex] || data[data.length - 1];

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pt: HistoricalDataPoint = payload[0].payload;
      return (
        <div className="bg-[#0B0D17]/95 border-2 border-[#00F0FF] p-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.95)] text-xs space-y-2 backdrop-blur-xl max-w-xs z-50">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 gap-3">
            <span className="font-anime font-black text-white text-sm flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>{isAr ? `اليوم التدريبي ${pt.dayNumber}` : `Training Day ${pt.dayNumber}`}</span>
            </span>
            <span 
              className="px-2 py-0.5 rounded text-[10px] font-black font-anime uppercase"
              style={{
                backgroundColor: pt.riskScore > 50 ? 'rgba(229,9,20,0.2)' : pt.riskScore > 25 ? 'rgba(255,230,0,0.2)' : 'rgba(34,197,94,0.2)',
                color: pt.riskScore > 50 ? '#E50914' : pt.riskScore > 25 ? '#FFE600' : '#22C55E'
              }}
            >
              {pt.riskScore > 50 ? (isAr ? 'خطر حاد' : 'Severe Danger') : pt.riskScore > 25 ? (isAr ? 'إجهاد متوسط' : 'Elevated') : (isAr ? 'منطقة آمنة' : 'Optimal')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-gray-400 block font-bold">{isAr ? 'مؤشر الإصابة:' : 'Injury Risk:'}</span>
              <span className="font-black text-sm font-anime" style={{
                color: pt.riskScore > 50 ? '#E50914' : pt.riskScore > 25 ? '#FFE600' : '#22C55E'
              }}>
                {pt.riskScore}%
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-bold">ACWR Ratio:</span>
              <span className="font-black text-sm font-anime text-[#00F0FF]">{pt.acwr}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-bold">{isAr ? 'الحمل الحاد:' : 'Acute Workload:'}</span>
              <span className="font-bold text-gray-200">{pt.acuteLoad} AU</span>
            </div>
            <div>
              <span className="text-gray-400 block font-bold">{isAr ? 'استشفاء HRV:' : 'HRV Status:'}</span>
              <span className="font-bold text-purple-300">{pt.hrv} ms</span>
            </div>
          </div>

          <p className="text-[10px] text-gray-300 border-t border-gray-800/80 pt-2 font-bold leading-tight">
            {isAr ? pt.sessionNoteAr : pt.sessionNoteEn}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#10121F] border-2 border-[#00F0FF]/40 rounded-3xl p-3 sm:p-6 md:p-8 shadow-[0_0_40px_rgba(0,240,255,0.15)] text-white font-sans space-y-6 w-full max-w-full overflow-hidden overflow-x-hidden">
      
      {/* Component Header & Mode Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-[11px] font-black font-anime uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{isAr ? 'سجل الـ 30 يوماً التاريخي لاحتمالية الإصابة (RECHARTS)' : '30-DAY INJURY RISK HISTORICAL TELEMETRY'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black font-anime text-white">
            {isAr ? 'مخطط التنبؤ الحركي ورصد أنماط الأداء الرياضي' : 'Biomechanical Risk Trajectory & Performance Patterns'}
          </h3>
          <p className="text-xs text-gray-400 font-bold max-w-2xl">
            {isAr 
              ? 'تتبع المسار التراكمي لاحتمالية التمزقات العضلية وإجهاد الأوتار على مدار شهر كامل، مع تمييز مناطق التكيف الفائقة وطفرات الإجهاد المفاجئ.' 
              : 'Interactive 30-day time-series telemetry highlighting Gabbett sweet spots, dangerous workload spikes, and deload supercompensation windows.'}
          </p>
        </div>

        {/* View Mode Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#161828] rounded-2xl border border-gray-800 self-start md:self-auto flex-wrap">
          <button
            onClick={() => {
              soundFX.playButtonClick();
              setMetricMode('risk');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black font-anime transition-all cursor-pointer ${
              metricMode === 'risk'
                ? 'bg-gradient-to-r from-[#FF007A] to-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isAr ? 'نسبة الخطر %' : 'Injury Risk %'}
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setMetricMode('acwr');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black font-anime transition-all cursor-pointer ${
              metricMode === 'acwr'
                ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ACWR Ratio
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setMetricMode('workload');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black font-anime transition-all cursor-pointer ${
              metricMode === 'workload'
                ? 'bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isAr ? 'الحمل التدريبي' : 'Workload AU'}
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setMetricMode('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black font-anime transition-all cursor-pointer ${
              metricMode === 'all'
                ? 'bg-gradient-to-r from-[#7000FF] to-[#00F0FF] text-white shadow-[0_0_15px_rgba(112,0,255,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isAr ? 'عرض شامل' : 'Composite View'}
          </button>
        </div>
      </div>

      {/* 4 Performance Pattern Diagnostic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-full">
        {/* Card 1: 30-Day Avg Risk */}
        <div className="bg-[#141624] p-3.5 rounded-2xl border border-gray-800 space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {isAr ? 'متوسط خطر الـ 30 يوماً' : '30-DAY AVERAGE RISK'}
            </span>
            <Activity className="w-3.5 h-3.5 text-[#00F0FF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-anime text-[#00F0FF]">{stats.avgRisk}%</span>
            <span className="text-[10px] text-emerald-400 font-bold">
              {stats.avgRisk < 25 ? (isAr ? 'تحت السيطرة' : 'Controlled') : (isAr ? 'معدل متوسط' : 'Moderate')}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block truncate">
            {isAr ? 'مبني على 30 حصة تدريبية' : 'Calculated over 30 sessions'}
          </span>
        </div>

        {/* Card 2: Sweet Spot Consistency */}
        <div className="bg-[#141624] p-3.5 rounded-2xl border border-gray-800 space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {isAr ? 'أيام منطقة الأمان المثالية' : 'SWEET SPOT CONSISTENCY'}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-anime text-emerald-400">{stats.sweetSpotDays} / 30</span>
            <span className="text-[10px] text-emerald-300 font-bold">({stats.sweetSpotPercentage}%)</span>
          </div>
          <span className="text-[10px] text-gray-400 block truncate">
            {isAr ? 'نسبة ACWR بين 0.8 و 1.3' : 'ACWR 0.8–1.3 Safe Window'}
          </span>
        </div>

        {/* Card 3: Detected Overload Spike */}
        <div className="bg-[#141624] p-3.5 rounded-2xl border border-gray-800 space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {isAr ? 'ذروة طفرة الخطر المسجلة' : 'PEAK DANGER SPIKE'}
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#E50914]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-anime text-[#E50914]">{stats.maxRiskPoint.riskScore}%</span>
            <span className="text-[10px] text-red-300 font-bold font-mono">
              Day {stats.maxRiskPoint.dayNumber}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block truncate">
            {isAr ? `طفرة ACWR: ${stats.maxRiskPoint.acwr}` : `ACWR peaked at ${stats.maxRiskPoint.acwr}`}
          </span>
        </div>

        {/* Card 4: Trajectory & Supercompensation */}
        <div className="bg-[#141624] p-3.5 rounded-2xl border border-gray-800 space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {isAr ? 'اتجاه التعافي والجاهزية' : 'ADAPTATION TRAJECTORY'}
            </span>
            {stats.trendDiff <= 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-anime ${stats.trendDiff <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {stats.trendDiff <= 0 ? `${stats.trendDiff}% ↓` : `+${stats.trendDiff}% ↑`}
            </span>
            <span className="text-[10px] text-gray-300 font-bold">
              {stats.trendDiff <= 0 ? (isAr ? 'جاهزية تصاعدية' : 'Primed & Fresh') : (isAr ? 'حمل متراكم' : 'Accumulating')}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block truncate">
            {isAr ? 'مقارنة آخر أسبوع مع البداية' : 'Last 7 vs First 7 days delta'}
          </span>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="bg-[#090B14] p-3 sm:p-5 rounded-2xl border border-gray-800 relative w-full max-w-full overflow-hidden overflow-x-hidden">
        
        {/* Visual Zone Legend Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3 text-[10px] font-mono px-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded bg-emerald-500/30 border border-emerald-500" />
              <span className="text-gray-300">{isAr ? 'منطقة الأمان المثالية (0.8 - 1.3 ACWR)' : 'Gabbett Sweet Spot (0.8 - 1.3)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded bg-amber-500/30 border border-amber-500" />
              <span className="text-gray-300">{isAr ? 'منطقة إجهاد مرتفع (1.3 - 1.5 ACWR)' : 'Elevated Strain (1.3 - 1.5)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded bg-red-600/30 border border-red-500" />
              <span className="text-gray-300">{isAr ? 'منطقة الخطر الحاد (> 1.5 ACWR)' : 'Danger Spike Zone (> 1.5)'}</span>
            </div>
          </div>
          <span className="text-gray-400">
            {isAr ? 'انقر على أي نقطة لفحص الحصة التدريبية' : 'Click/Hover any point for session breakdown'}
          </span>
        </div>

        {/* Responsive Container for Recharts */}
        <div className="w-full max-w-full min-w-0 h-72 sm:h-80 md:h-96 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
              onClick={(e: any) => {
                if (e && e.activeTooltipIndex !== undefined) {
                  soundFX.playButtonClick();
                  setSelectedDayIndex(e.activeTooltipIndex);
                }
              }}
            >
              <defs>
                {/* Risk Area Gradient */}
                <linearGradient id="riskScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E50914" stopOpacity={0.65} />
                  <stop offset="50%" stopColor="#FFE600" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.05} />
                </linearGradient>

                {/* Acute Workload Gradient */}
                <linearGradient id="acuteWorkloadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1F2338" opacity={0.7} />

              <XAxis 
                dataKey="dayLabel" 
                stroke="#6B7280" 
                tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                interval={window.innerWidth < 640 ? 4 : 2}
              />

              <YAxis 
                stroke="#6B7280" 
                tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                domain={metricMode === 'acwr' ? [0.4, 2.0] : metricMode === 'workload' ? [400, 2000] : [0, 100]}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Sweet Spot Reference Boundaries on ACWR or Composite */}
              {(metricMode === 'acwr' || metricMode === 'all') && (
                <>
                  <ReferenceLine 
                    y={1.3} 
                    stroke="#22C55E" 
                    strokeDasharray="3 3" 
                    strokeWidth={1.5}
                    label={{ value: isAr ? 'سقف الأمان 1.3' : 'Sweet Spot Upper 1.3', fill: '#22C55E', fontSize: 10, position: 'insideTopLeft' }} 
                  />
                  <ReferenceLine 
                    y={0.8} 
                    stroke="#22C55E" 
                    strokeDasharray="3 3" 
                    strokeWidth={1.5}
                    label={{ value: isAr ? 'قاع الأمان 0.8' : 'Sweet Spot Lower 0.8', fill: '#22C55E', fontSize: 10, position: 'insideBottomLeft' }} 
                  />
                </>
              )}

              {/* Risk Danger Threshold Line (50% Risk) */}
              {(metricMode === 'risk' || metricMode === 'all') && (
                <ReferenceLine 
                  y={50} 
                  stroke="#E50914" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  label={{ value: isAr ? 'عتبة الخطر الحاد 50%' : 'High Danger 50%', fill: '#E50914', fontSize: 10, position: 'insideTopLeft' }} 
                />
              )}

              {/* ACWR Danger Threshold Line (1.5) */}
              {metricMode === 'acwr' && (
                <ReferenceLine 
                  y={1.5} 
                  stroke="#E50914" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  label={{ value: 'Spike Danger 1.5', fill: '#E50914', fontSize: 10, position: 'insideTopLeft' }} 
                />
              )}

              {/* Primary Visual Element based on Mode */}
              {(metricMode === 'risk' || metricMode === 'all') && (
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  name={isAr ? 'احتمالية الإصابة %' : 'Injury Risk %'}
                  stroke="#E50914"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskScoreGrad)"
                  activeDot={{ r: 6, fill: '#FFE600', stroke: '#E50914', strokeWidth: 2 }}
                />
              )}

              {(metricMode === 'workload' || metricMode === 'all') && (
                <Area
                  type="monotone"
                  dataKey="acuteLoad"
                  name={isAr ? 'الحمل الحاد (AU)' : 'Acute Workload (AU)'}
                  stroke="#00F0FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#acuteWorkloadGrad)"
                />
              )}

              {metricMode === 'workload' && (
                <Line
                  type="monotone"
                  dataKey="chronicLoad"
                  name={isAr ? 'الحمل المزمن (AU)' : 'Chronic Base (AU)'}
                  stroke="#FFE600"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}

              {(metricMode === 'acwr' || metricMode === 'all') && (
                <Line
                  type="monotone"
                  dataKey="acwr"
                  name="ACWR Ratio"
                  stroke="#FFE600"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#FFE600' }}
                  activeDot={{ r: 7, fill: '#00F0FF', stroke: '#FFE600' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Selected Day Diagnostic Drilldown Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#141624] via-[#121422] to-[#181A2A] border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#090B14] border border-[#00F0FF]/40 flex flex-col items-center justify-center shrink-0">
            <span className="text-[9px] font-mono text-gray-400">DAY</span>
            <span className="text-base font-black font-anime text-[#00F0FF]">{activePoint.dayNumber}</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-anime font-black text-white text-sm">
                {isAr ? `تفاصيل اليوم التدريبي ${activePoint.dayNumber}:` : `Training Day ${activePoint.dayNumber} Biometric Breakdown:`}
              </h4>
              <span 
                className="px-2 py-0.2 rounded text-[10px] font-black font-anime uppercase"
                style={{
                  backgroundColor: activePoint.riskScore > 50 ? '#E5091420' : activePoint.riskScore > 25 ? '#FFE60020' : '#22C55E20',
                  color: activePoint.riskScore > 50 ? '#E50914' : activePoint.riskScore > 25 ? '#FFE600' : '#22C55E',
                  border: `1px solid ${activePoint.riskScore > 50 ? '#E5091450' : activePoint.riskScore > 25 ? '#FFE60050' : '#22C55E50'}`
                }}
              >
                {activePoint.riskScore > 50 ? (isAr ? 'خطر حاد' : 'Severe Danger') : activePoint.riskScore > 25 ? (isAr ? 'إجهاد مرتفع' : 'Elevated Load') : (isAr ? 'جاهزية مثالية' : 'Optimal Adaptation')}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-bold">
              {isAr ? activePoint.sessionNoteAr : activePoint.sessionNoteEn}
            </p>
          </div>
        </div>

        {/* Quick Day Metrics Pill */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs font-mono self-stretch sm:self-auto justify-between sm:justify-start pt-2 md:pt-0 border-t md:border-t-0 border-gray-800">
          <div>
            <span className="text-[9px] text-gray-400 block">{isAr ? 'الخطر' : 'Risk'}</span>
            <span className="font-black font-anime text-sm" style={{
              color: activePoint.riskScore > 50 ? '#E50914' : activePoint.riskScore > 25 ? '#FFE600' : '#22C55E'
            }}>
              {activePoint.riskScore}%
            </span>
          </div>

          <div>
            <span className="text-[9px] text-gray-400 block">ACWR</span>
            <span className="font-black font-anime text-sm text-[#00F0FF]">{activePoint.acwr}</span>
          </div>

          <div>
            <span className="text-[9px] text-gray-400 block">{isAr ? 'الحمل الحاد' : 'Acute'}</span>
            <span className="font-black font-anime text-sm text-gray-200">{activePoint.acuteLoad} AU</span>
          </div>

          <div>
            <span className="text-[9px] text-gray-400 block">HRV</span>
            <span className="font-black font-anime text-sm text-purple-400">{activePoint.hrv} ms</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default InjuryRiskHistoryChart;
