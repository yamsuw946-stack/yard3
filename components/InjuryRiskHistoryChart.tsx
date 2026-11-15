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
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';

interface HistoricalDataPoint {
  dayNumber: number;
  dateStr: string;
  dayLabel: string;
  acuteLoad: number;
  chronicLoad: number;
  acwr: number;
  hrv: number;
  riskScore: number;
  zone: 'safe' | 'elevated' | 'high_danger' | 'under_trained';
  sessionNoteEn: string;
  sessionNoteAr: string;
  sessionNoteEs: string;
  sessionNoteFr: string;
}

const generate30DayHistoricalData = (): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];

  const rawPatterns: Array<{
    acute: number;
    chronic: number;
    hrv: number;
    noteEn: string;
    noteAr: string;
    noteEs: string;
    noteFr: string;
  }> = [
    { acute: 920, chronic: 980, hrv: 72, noteEn: 'Aerobic recovery & shadow boxing', noteAr: 'استشفاء هوائي وملاكمة ظل خفيفة', noteEs: 'Recuperación aeróbica y boxeo de sombra', noteFr: 'Récupération aérobie et shadow boxing' },
    { acute: 1050, chronic: 985, hrv: 70, noteEn: 'Cadence footwork & agility ladder', noteAr: 'تمارين رشاقة وسرعة القدمين', noteEs: 'Trabajo de pies y escalera de agilidad', noteFr: 'Jeu de jambes et échelle d\'agilité' },
    { acute: 1100, chronic: 990, hrv: 68, noteEn: 'Heavy bag power punch drills', noteAr: 'لكمات انفجارية على الكيس الثقيل', noteEs: 'Golpes explosivos en saco pesado', noteFr: 'Frappes explosives sur sac lourd' },
    { acute: 1180, chronic: 995, hrv: 66, noteEn: 'Functional kettlebell circuit', noteAr: 'دائرة تدريب وظيفي بأوزان الكتلبل', noteEs: 'Circuito funcional con kettlebells', noteFr: 'Circuit fonctionnel aux kettlebells' },
    { acute: 1020, chronic: 998, hrv: 71, noteEn: 'Active recovery flush & mobility', noteAr: 'جلسة مرونة واستشفاء هوائي', noteEs: 'Movilidad y descarga activa', noteFr: 'Mobilité et récupération active' },
    { acute: 1150, chronic: 1005, hrv: 69, noteEn: 'Isometric neck & core conditioning', noteAr: 'تقوية عضلات الرقبة والجذع', noteEs: 'Acondicionamiento isométrico de cuello y core', noteFr: 'Gainage isométrique cou et ceinture' },
    { acute: 1220, chronic: 1010, hrv: 67, noteEn: '5-round simulated combat sparring', noteAr: 'نزال محاكاة 5 جولات كاملة', noteEs: 'Combate simulado de 5 asaltos', noteFr: 'Sparring de simulation en 5 rounds' },
    { acute: 1450, chronic: 1015, hrv: 55, noteEn: 'Double session: Max 1RM & Sparring', noteAr: 'حمل تدريبي مضاعف: أوزان قصوى وقتال', noteEs: 'Doble sesión: 1RM máximo y sparring', noteFr: 'Double séance : 1RM max et sparring' },
    { acute: 1620, chronic: 1025, hrv: 48, noteEn: 'ACWR Spike detected — high tendon strain', noteAr: 'طفرة إجهاد حاد — تنبيه خطر الأوتار', noteEs: 'Pico ACWR detectado — tensión tendinosa alta', noteFr: 'Pic ACWR détecté — tension tendineuse élevée' },
    { acute: 1710, chronic: 1035, hrv: 44, noteEn: 'Peak acute fatigue & CNS HRV drop', noteAr: 'إجهاد عصبي مركزي حاد وانخفاض HRV', noteEs: 'Fatiga aguda máxima y caída HRV', noteFr: 'Fatigue aiguë maximale et chute HRV' },
    { acute: 1580, chronic: 1040, hrv: 49, noteEn: 'Residual soreness in knees & wrists', noteAr: 'إجهاد مفاصل وتيبس في الركبة', noteEs: 'Molestias residuales en rodillas y muñecas', noteFr: 'Douleurs résiduelles genoux et poignets' },
    { acute: 1420, chronic: 1045, hrv: 53, noteEn: 'Clinical staff flagged overload', noteAr: 'توصية الكادر الطبي بتخفيض الحمل', noteEs: 'Equipo clínico reportó sobrecarga', noteFr: 'Surcharge signalée par l\'équipe clinique' },
    { acute: 850, chronic: 1040, hrv: 68, noteEn: 'Enforced 40% deload & soft-tissue work', noteAr: 'تخفيض إجباري للحمل 40% وتدليك استشفائي', noteEs: 'Descarga del 40% y terapia tisular', noteFr: 'Décharge forcée de 40% et soins tissulaires' },
    { acute: 720, chronic: 1030, hrv: 75, noteEn: 'Hydro-therapy & Zen breath protocol', noteAr: 'علاج مائي وتنفس استرخائي زين', noteEs: 'Hidroterapia y protocolo de respiración Zen', noteFr: 'Hydrothérapie et respiration Zen' },
    { acute: 760, chronic: 1020, hrv: 78, noteEn: 'Rapid HRV restoration & joint relief', noteAr: 'انتعاش تقلب النبض واسترخاء المفاصل', noteEs: 'Rápida restauración HRV y alivio articular', noteFr: 'Restauration rapide HRV et soulagement articulaire' },
    { acute: 890, chronic: 1015, hrv: 76, noteEn: 'Light technical drills & form reset', noteAr: 'تمارين فنية خفيفة لضبط التكنيك', noteEs: 'Técnica ligera y ajuste de postura', noteFr: 'Exercices techniques légers et réajustement' },
    { acute: 1040, chronic: 1012, hrv: 74, noteEn: 'Re-entry to Gabbett sweet spot', noteAr: 'دخول منطقة التكيف المثالية', noteEs: 'Reingreso a zona óptima Gabbett', noteFr: 'Retour dans la zone optimale Gabbett' },
    { acute: 1120, chronic: 1015, hrv: 72, noteEn: 'Explosive plyometrics & sprint reps', noteAr: 'تمارين بليومتريك انفجارية وسرعة', noteEs: 'Pliometría explosiva y series de sprint', noteFr: 'Pliométrie explosive et sprints' },
    { acute: 1190, chronic: 1020, hrv: 70, noteEn: 'Target precision strikes in YARD matrix', noteAr: 'دقة اللكمات في مصفوفة YARD', noteEs: 'Precisión de golpes en matriz YARD', noteFr: 'Précision de frappes matrice YARD' },
    { acute: 1240, chronic: 1026, hrv: 69, noteEn: 'Conditioning capacity building', noteAr: 'بناء القدرة التنفسية والعضلية', noteEs: 'Desarrollo de capacidad metabólica', noteFr: 'Développement de l\'endurance métabolique' },
    { acute: 1260, chronic: 1032, hrv: 68, noteEn: 'High-velocity striking & defense drills', noteAr: 'سرعة رد الفعل والمناورات الدفاعية', noteEs: 'Golpeo de alta velocidad y defensa', noteFr: 'Frappes haute vélocité et défense' },
    { acute: 1180, chronic: 1035, hrv: 71, noteEn: 'Active aerobic flush & sleep priority', noteAr: 'استشفاء هوائي وتركيز على النوم العميق', noteEs: 'Descarga aeróbica y prioridad de sueño', noteFr: 'Drainage aérobie et priorité sommeil' },
    { acute: 1280, chronic: 1040, hrv: 67, noteEn: 'Competitive tournament simulation', noteAr: 'محاكاة كاملة لأجواء البطولات', noteEs: 'Simulación de torneo competitivo', noteFr: 'Simulation complète de tournoi' },
    { acute: 1480, chronic: 1048, hrv: 58, noteEn: 'High intensity conditioning surge', noteAr: 'تصاعد شدة التدريب وإجهاد العضلات', noteEs: 'Aumento de acondicionamiento intenso', noteFr: 'Montée en intensité métabolique' },
    { acute: 1530, chronic: 1055, hrv: 54, noteEn: 'Approaching 1.5 ACWR threshold', noteAr: 'تحذير: الاقتراب من سقف 1.5 ACWR', noteEs: 'Acercándose al umbral ACWR 1.5', noteFr: 'Approche du seuil ACWR 1,5' },
    { acute: 1390, chronic: 1058, hrv: 61, noteEn: 'Proactive workload regulation', noteAr: 'تعديل استباقي للحمل التدريبي', noteEs: 'Regulación proactiva de carga', noteFr: 'Régulation proactive de la charge' },
    { acute: 1080, chronic: 1060, hrv: 72, noteEn: 'Championship taper: Volume down 30%', noteAr: 'مرحلة التهدئة: خفض الحجم التدريبي', noteEs: 'Descarga pre-campeonato: -30% volumen', noteFr: 'Affûtage championnat : volume -30%' },
    { acute: 950, chronic: 1055, hrv: 77, noteEn: 'Neuromuscular freshness rising', noteAr: 'تصاعد الجاهزية العصبية والبدنية', noteEs: 'Frescura neuromuscular en alza', noteFr: 'Fraîcheur neuromusculaire croissante' },
    { acute: 880, chronic: 1050, hrv: 81, noteEn: 'Peak recovery index, tendons primed', noteAr: 'أعلى معدل استشفاء ومرونة الأوتار', noteEs: 'Índice de recuperación pico', noteFr: 'Indice de récupération au sommet' },
    { acute: 920, chronic: 1048, hrv: 84, noteEn: 'S-Rank Supercompensation achieved', noteAr: 'تحقيق قمة الجاهزية والتعويض الفائق', noteEs: 'Supercompensación Rango S lograda', noteFr: 'Surcompensation Rang S atteinte' }
  ];

  rawPatterns.forEach((p, idx) => {
    const day = idx + 1;
    const acwrVal = Number((p.acute / p.chronic).toFixed(2));

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
      sessionNoteAr: p.noteAr,
      sessionNoteEs: p.noteEs,
      sessionNoteFr: p.noteFr
    });
  });

  return data;
};

interface InjuryRiskHistoryChartProps {
  currentLang?: Language;
}

export const InjuryRiskHistoryChart: React.FC<InjuryRiskHistoryChartProps> = ({ currentLang = 'en' }) => {
  const t = (texts: { en: string; es: string; fr: string; ar: string }) => tr(currentLang, texts);
  const data = useMemo(() => generate30DayHistoricalData(), []);

  type MetricMode = 'risk' | 'acwr' | 'workload' | 'hrv' | 'all';
  const [metricMode, setMetricMode] = useState<MetricMode>('risk');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(data.length - 1);

  const stats = useMemo(() => {
    const scores = data.map(d => d.riskScore);
    const avgRisk = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const maxRiskPoint = data.reduce((max, curr) => curr.riskScore > max.riskScore ? curr : max, data[0]);
    const sweetSpotDays = data.filter(d => d.acwr >= 0.8 && d.acwr <= 1.3).length;
    const sweetSpotPercentage = Math.round((sweetSpotDays / data.length) * 100);
    const first7Avg = data.slice(0, 7).reduce((acc, curr) => acc + curr.riskScore, 0) / 7;
    const last7Avg = data.slice(-7).reduce((acc, curr) => acc + curr.riskScore, 0) / 7;
    const trendDiff = Number((last7Avg - first7Avg).toFixed(1));

    return {
      avgRisk,
      maxRiskPoint,
      sweetSpotDays,
      sweetSpotPercentage,
      trendDiff
    };
  }, [data]);

  const activePoint = data[selectedDayIndex] || data[data.length - 1];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const pt: HistoricalDataPoint = payload[0].payload;
    const riskColor = pt.riskScore > 50 ? '#EF4444' : pt.riskScore > 25 ? '#F59E0B' : '#10B981';

    return (
      <div className="bg-[#07090F]/95 border border-white/[0.15] p-3.5 rounded-xl shadow-2xl text-xs space-y-2 backdrop-blur-xl max-w-[260px]">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 gap-3 font-mono">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{t({ en: `Day ${pt.dayNumber}`, es: `Día ${pt.dayNumber}`, fr: `Jour ${pt.dayNumber}`, ar: `اليوم ${pt.dayNumber}` })}</span>
          </span>
          <span className="font-bold" style={{ color: riskColor }}>
            {pt.riskScore > 50
              ? t({ en: 'Critical', es: 'Crítico', fr: 'Critique', ar: 'خطر حاد' })
              : pt.riskScore > 25
              ? t({ en: 'Elevated', es: 'Elevado', fr: 'Élevé', ar: 'مرتفع' })
              : t({ en: 'Optimal', es: 'Óptimo', fr: 'Optimal', ar: 'آمن' })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono tabular-nums text-[11px]">
          <span className="text-slate-400">{t({ en: 'Risk:', es: 'Riesgo:', fr: 'Risque :', ar: 'الإصابة:' })}</span>
          <span className="font-bold text-end" style={{ color: riskColor }}>{pt.riskScore}%</span>
          <span className="text-slate-400">ACWR:</span>
          <span className="font-bold text-[#00F0FF] text-end">{pt.acwr}</span>
          <span className="text-slate-400">{t({ en: 'Acute:', es: 'Aguda:', fr: 'Aiguë :', ar: 'الحمل الحاد:' })}</span>
          <span className="font-semibold text-white text-end">{pt.acuteLoad} AU</span>
          <span className="text-slate-400">HRV:</span>
          <span className="font-semibold text-[#D4AF37] text-end">{pt.hrv} ms</span>
        </div>

        <p className="text-[11px] text-slate-300 border-t border-white/[0.06] pt-1.5 leading-snug">
          {t({ en: pt.sessionNoteEn, es: pt.sessionNoteEs, fr: pt.sessionNoteFr, ar: pt.sessionNoteAr })}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-[#0B0E16] border border-white/[0.08] rounded-2xl p-4 sm:p-6 md:p-7 text-white font-sans space-y-6 w-full max-w-full overflow-hidden">
      {/* Header & Precision Channel Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#00F0FF] uppercase tracking-[0.16em]">
            <Activity className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>
              {t({
                en: '30-DAY BIOMETRIC SERIES · ACWR & AUTONOMIC HRV',
                es: 'SERIE BIOMÉTRICA 30 DÍAS · ACWR Y HRV AUTÓNOMO',
                fr: 'SÉRIE BIOMÉTRIQUE 30 JOURS · ACWR & HRV AUTONOME',
                ar: 'التسلسل الزمني 30 يوماً — مؤشر ACWR و HRV'
              })}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {t({
              en: 'Workload Trajectory & Injury Risk Corridor',
              es: 'Trayectoria de Carga y Corredor de Riesgo',
              fr: 'Trajectoire de Charge & Corridor de Risque',
              ar: 'المسار التاريخي لمخاطر الإجهاد والتعويض الفائق'
            })}
          </h3>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#07080D] rounded-lg border border-white/[0.08] self-start lg:self-auto flex-wrap text-xs">
          {[
            { id: 'risk' as MetricMode, en: 'Risk %', es: 'Riesgo %', fr: 'Risque %', ar: 'الخطر %' },
            { id: 'acwr' as MetricMode, en: 'ACWR Sweet Spot', es: 'Zona Óptima ACWR', fr: 'Zone Optimale ACWR', ar: 'معامل ACWR' },
            { id: 'workload' as MetricMode, en: 'Acute / Chronic', es: 'Aguda / Crónica', fr: 'Aiguë / Chronique', ar: 'الحمل AU' },
            { id: 'hrv' as MetricMode, en: 'HRV (ms)', es: 'HRV (ms)', fr: 'HRV (ms)', ar: 'نبض HRV' },
            { id: 'all' as MetricMode, en: 'Composite', es: 'Compuesto', fr: 'Global', ar: 'شامل' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setMetricMode(tab.id);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                metricMode === tab.id
                  ? 'bg-[#D4AF37] text-[#07080D] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t({ en: tab.en, es: tab.es, fr: tab.fr, ar: tab.ar })}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#07080D] border border-white/[0.06]">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            {t({ en: '30D MEAN RISK', es: 'RIESGO MEDIO 30D', fr: 'RISQUE MOYEN 30J', ar: 'متوسط خطر 30 يوم' })}
          </span>
          <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
            <span className="text-2xl font-bold text-[#00F0FF]">{stats.avgRisk}%</span>
            <span className="text-xs text-[#10B981]">
              {stats.avgRisk < 25
                ? t({ en: 'Nominal', es: 'Estable', fr: 'Nominal', ar: 'منضبط' })
                : t({ en: 'Monitored', es: 'Vigilado', fr: 'Surveillé', ar: 'مراقب' })}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#07080D] border border-white/[0.06]">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            {t({ en: 'SWEET SPOT DAYS', es: 'DÍAS ÓPTIMOS', fr: 'JOURS OPTIMAUX', ar: 'أيام الأمان 0.8–1.3' })}
          </span>
          <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
            <span className="text-2xl font-bold text-[#10B981]">{stats.sweetSpotDays}/30</span>
            <span className="text-xs text-slate-400">{stats.sweetSpotPercentage}%</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#07080D] border border-white/[0.06]">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            {t({ en: 'PEAK SPIKE', es: 'PICO MÁXIMO', fr: 'PIC MAXIMAL', ar: 'أعلى ذروة حمل' })}
          </span>
          <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
            <span className="text-2xl font-bold text-rose-400">{stats.maxRiskPoint.riskScore}%</span>
            <span className="text-xs text-slate-400">D{stats.maxRiskPoint.dayNumber} · {stats.maxRiskPoint.acwr}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#07080D] border border-white/[0.06]">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            {t({ en: '7D DELTA TREND', es: 'TENDENCIA 7 DÍAS', fr: 'TENDANCE 7 JOURS', ar: 'اتجاه الاستشفاء' })}
          </span>
          <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
            <span className={`text-2xl font-bold flex items-center gap-1 ${stats.trendDiff <= 0 ? 'text-[#10B981]' : 'text-amber-400'}`}>
              {stats.trendDiff <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {stats.trendDiff <= 0 ? `${stats.trendDiff}%` : `+${stats.trendDiff}%`}
            </span>
            <span className="text-xs text-slate-400">
              {stats.trendDiff <= 0
                ? t({ en: 'Fresh', es: 'Fresco', fr: 'Frais', ar: 'تصاعد الجاهزية' })
                : t({ en: 'Loading', es: 'En Carga', fr: 'En Charge', ar: 'حمل صاعد' })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Telemetry Viewport */}
      <div className="bg-[#07080D] p-4 rounded-xl border border-white/[0.06] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[#10B981]">■ {t({ en: 'Gabbett Corridor (0.8–1.3)', es: 'Corredor Gabbett (0.8–1.3)', fr: 'Corridor Gabbett (0.8–1.3)', ar: 'نطاق الأمان (0.8–1.3)' })}</span>
            <span className="text-rose-400">■ {t({ en: 'Overload Zone (>1.5)', es: 'Zona de Sobrecarga (>1.5)', fr: 'Zone de Surcharge (>1.5)', ar: 'منطقة الحمل الزائد (>1.5)' })}</span>
          </div>
          <span>{t({ en: 'Click any point to inspect session', es: 'Haz clic en cualquier punto para ver detalles', fr: 'Cliquez sur un point pour inspecter la séance', ar: 'انقر على أي يوم لاستعراض التفاصيل' })}</span>
        </div>

        <div className="w-full h-72 sm:h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 12, right: 12, left: -18, bottom: 0 }}
              onClick={(e: any) => {
                if (e && e.activeTooltipIndex !== undefined) {
                  soundFX.playButtonClick();
                  setSelectedDayIndex(e.activeTooltipIndex);
                }
              }}
            >
              <defs>
                <linearGradient id="riskScoreGradClean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5} />
                  <stop offset="55%" stopColor="#D4AF37" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="acuteLoadClean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="hrvAreaClean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.04} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#161D2F" />
              <XAxis
                dataKey="dayLabel"
                stroke="#475569"
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#475569"
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
                domain={
                  metricMode === 'acwr'
                    ? [0.4, 2.0]
                    : metricMode === 'workload'
                    ? [400, 2000]
                    : metricMode === 'hrv'
                    ? [35, 95]
                    : [0, 100]
                }
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Safe Corridor Bounds on ACWR */}
              {metricMode === 'acwr' && (
                <>
                  <ReferenceLine y={0.8} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.55} strokeWidth={1.1} />
                  <ReferenceLine y={1.3} stroke="#10B981" strokeDasharray="3 3" strokeWidth={1.3} />
                  <ReferenceLine y={1.5} stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.3} />
                </>
              )}

              {(metricMode === 'risk' || metricMode === 'all') && (
                <>
                  <ReferenceLine y={25} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.45} strokeWidth={1.1} />
                  <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.2} />
                  <Area
                    type="monotone"
                    dataKey="riskScore"
                    name={t({ en: 'Injury Risk %', es: 'Riesgo Lesión %', fr: 'Risque Blessure %', ar: 'مؤشر الخطورة %' })}
                    stroke="#EF4444"
                    strokeWidth={2.2}
                    fill="url(#riskScoreGradClean)"
                    activeDot={{ r: 5, fill: '#D4AF37', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </>
              )}

              {(metricMode === 'workload' || metricMode === 'all') && (
                <>
                  <Area
                    type="monotone"
                    dataKey="acuteLoad"
                    name={t({ en: 'Acute Load (AU)', es: 'Carga Aguda (AU)', fr: 'Charge Aiguë (AU)', ar: 'الحمل الحاد (AU)' })}
                    stroke="#00F0FF"
                    strokeWidth={2}
                    fill="url(#acuteLoadClean)"
                  />
                  {metricMode === 'workload' && (
                    <Line
                      type="monotone"
                      dataKey="chronicLoad"
                      name={t({ en: 'Chronic Base (AU)', es: 'Base Crónica (AU)', fr: 'Base Chronique (AU)', ar: 'القاعدة المزمنة (AU)' })}
                      stroke="#D4AF37"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  )}
                </>
              )}

              {metricMode === 'hrv' && (
                <>
                  <ReferenceLine y={60} stroke="#D4AF37" strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="hrv"
                    name="HRV (ms)"
                    stroke="#10B981"
                    strokeWidth={2.4}
                    fill="url(#hrvAreaClean)"
                    activeDot={{ r: 5, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </>
              )}

              {(metricMode === 'acwr' || metricMode === 'all') && (
                <Line
                  type="monotone"
                  dataKey="acwr"
                  name="ACWR Ratio"
                  stroke="#D4AF37"
                  strokeWidth={2.4}
                  dot={{ r: 2.5, fill: '#D4AF37' }}
                  activeDot={{ r: 6, fill: '#00F0FF', stroke: '#D4AF37' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Day Stepper & Session Inspector */}
      <div className="p-4 rounded-xl bg-[#07080D] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setSelectedDayIndex((prev) => Math.max(0, prev - 1));
              }}
              className="p-2 rounded-lg bg-[#111521] hover:bg-[#191E2E] border border-white/[0.08] text-slate-300 cursor-pointer"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1.5 rounded-lg bg-[#111521] border border-[#00F0FF]/30 text-center font-mono tabular-nums min-w-[68px]">
              <span className="text-[9px] text-slate-400 block">DAY</span>
              <span className="text-sm font-bold text-[#00F0FF]">{activePoint.dayNumber}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setSelectedDayIndex((prev) => Math.min(data.length - 1, prev + 1));
              }}
              className="p-2 rounded-lg bg-[#111521] hover:bg-[#191E2E] border border-white/[0.08] text-slate-300 cursor-pointer"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-white font-bold">
                {t({
                  en: `Training Day ${activePoint.dayNumber}`,
                  es: `Día de Entreno ${activePoint.dayNumber}`,
                  fr: `Jour d'Entraînement ${activePoint.dayNumber}`,
                  ar: `تقرير اليوم ${activePoint.dayNumber}`
                })}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className={activePoint.riskScore > 50 ? 'text-rose-400' : activePoint.riskScore > 25 ? 'text-amber-400' : 'text-[#10B981]'}>
                {activePoint.riskScore > 50
                  ? t({ en: 'Severe Danger', es: 'Peligro Severo', fr: 'Danger Sévère', ar: 'خطر حاد' })
                  : activePoint.riskScore > 25
                  ? t({ en: 'Elevated', es: 'Elevado', fr: 'Élevé', ar: 'إجهاد مرتفع' })
                  : t({ en: 'Optimal', es: 'Óptimo', fr: 'Optimal', ar: 'جاهزية مثالية' })}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {t({
                en: activePoint.sessionNoteEn,
                es: activePoint.sessionNoteEs,
                fr: activePoint.sessionNoteFr,
                ar: activePoint.sessionNoteAr
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 font-mono tabular-nums text-xs border-t md:border-t-0 border-white/[0.06] pt-3 md:pt-0">
          <div>
            <span className="text-[10px] text-slate-400 block">{t({ en: 'Risk', es: 'Riesgo', fr: 'Risque', ar: 'الخطر' })}</span>
            <span className="font-bold text-white">{activePoint.riskScore}%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">ACWR</span>
            <span className="font-bold text-[#00F0FF]">{activePoint.acwr}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">{t({ en: 'Acute', es: 'Aguda', fr: 'Aiguë', ar: 'الحمل' })}</span>
            <span className="font-bold text-white">{activePoint.acuteLoad} AU</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">HRV</span>
            <span className="font-bold text-[#10B981]">{activePoint.hrv} ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjuryRiskHistoryChart;
