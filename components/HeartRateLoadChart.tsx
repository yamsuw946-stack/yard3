/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Language, tr } from '../i18n';
import { Activity, Heart, Zap, TrendingDown, Award, Info, RefreshCw } from 'lucide-react';
import { soundFX } from '../services/soundFX';

interface HeartRateLoadDataPoint {
  dayAr: string;
  dayEn: string;
  dayEs: string;
  dayFr: string;
  rhr: number;
  load: number;
  hrv: number;
  calories: number;
}

const DEFAULT_7DAY_DATA: HeartRateLoadDataPoint[] = [
  { dayAr: 'الإثنين', dayEn: 'Mon', dayEs: 'Lun', dayFr: 'Lun', rhr: 66, load: 420, hrv: 62, calories: 510 },
  { dayAr: 'الثلاثاء', dayEn: 'Tue', dayEs: 'Mar', dayFr: 'Mar', rhr: 64, load: 680, hrv: 68, calories: 720 },
  { dayAr: 'الأربعاء', dayEn: 'Wed', dayEs: 'Mié', dayFr: 'Mer', rhr: 63, load: 550, hrv: 74, calories: 610 },
  { dayAr: 'الخميس', dayEn: 'Thu', dayEs: 'Jue', dayFr: 'Jeu', rhr: 61, load: 840, hrv: 79, calories: 890 },
  { dayAr: 'الجمعة', dayEn: 'Fri', dayEs: 'Vie', dayFr: 'Ven', rhr: 60, load: 490, hrv: 85, calories: 530 },
  { dayAr: 'السبت', dayEn: 'Sat', dayEs: 'Sáb', dayFr: 'Sam', rhr: 58, load: 910, hrv: 91, calories: 960 },
  { dayAr: 'الأحد', dayEn: 'Sun', dayEs: 'Dom', dayFr: 'Dim', rhr: 57, load: 630, hrv: 95, calories: 680 }
];

interface HeartRateLoadChartProps {
  currentLang?: Language;
  className?: string;
}

export const HeartRateLoadChart: React.FC<HeartRateLoadChartProps> = ({
  currentLang = 'en',
  className = ''
}) => {
  const isAr = currentLang === 'ar';
  const t = (en: string, es: string, fr: string, ar: string) => tr(currentLang, { en, es, fr, ar });
  const [data, setData] = useState<HeartRateLoadDataPoint[]>(DEFAULT_7DAY_DATA);
  const [selectedMetric, setSelectedMetric] = useState<'both' | 'rhr' | 'load'>('both');

  const initialRhr = data[0]?.rhr || 66;
  const currentRhr = data[data.length - 1]?.rhr || 57;
  const rhrImprovement = initialRhr - currentRhr;

  const totalLoad = data.reduce((acc, d) => acc + d.load, 0);
  const avgHrv = Math.round(data.reduce((acc, d) => acc + d.hrv, 0) / data.length);

  const dayKey = isAr ? 'dayAr' : currentLang === 'es' ? 'dayEs' : currentLang === 'fr' ? 'dayFr' : 'dayEn';

  const handleRefreshData = () => {
    soundFX.playButtonClick();
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        rhr: Math.max(50, Math.min(75, item.rhr + Math.floor(Math.random() * 3) - 1)),
        load: Math.max(300, Math.min(1000, item.load + Math.floor(Math.random() * 80) - 40)),
        hrv: Math.max(50, Math.min(110, item.hrv + Math.floor(Math.random() * 4) - 2))
      }))
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as HeartRateLoadDataPoint;
      const dayLabel = dataPoint[dayKey];
      return (
        <div className="bg-[#080D0B] border border-emerald-500/50 rounded-2xl p-4 shadow-2xl space-y-2 text-xs">
          <p className="font-anime font-black text-[#D4AF37] text-sm border-b border-white/10 pb-1">
            {dayLabel}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Heart className="w-3.5 h-3.5" />
              {t('Resting HR:', 'Pulso Reposo:', 'FC Repos :', 'نبض الراحة RHR:')}
            </span>
            <span className="font-anime font-black text-white text-sm tabular-nums">{dataPoint.rhr} bpm</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
              <Zap className="w-3.5 h-3.5" />
              {t('Training Load:', 'Carga Entreno:', 'Charge Entraînement :', 'الحمل التدريبي:')}
            </span>
            <span className="font-anime font-black text-white text-sm tabular-nums">{dataPoint.load} AU</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <Activity className="w-3.5 h-3.5" />
              {t('HRV Recovery:', 'Recuperación HRV:', 'Récupération VFC :', 'تقلب النبض HRV:')}
            </span>
            <span className="font-anime font-black text-emerald-300 text-sm tabular-nums">{dataPoint.hrv} ms</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`bg-[#080D0B] rounded-3xl p-6 md:p-8 border border-emerald-500/25 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/35">
              <Heart className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-black font-anime text-white">
              {t(
                '7-Day Resting Heart Rate & Load Progression',
                'Progresión de Pulso en Reposo y Carga (7 Días)',
                'Évolution FC Repos & Charge (7 Jours)',
                'تطور نبض الراحة والحمل التدريبي (7 أيام)'
              )}
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-bold">
            {t(
              'Track RHR reduction alongside training load to visualize cardiovascular adaptation.',
              'Controla el descenso del pulso en reposo junto con la carga de entrenamiento.',
              'Suivez la baisse de la FC au repos par rapport à la charge d’entraînement.',
              'متابعة انخفاض معدل ضربات القلب أثناء الراحة كمؤشر لارتفاع لياقة القلب وتكيف الجسد مع الحمل.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="bg-[#050807] p-1 rounded-xl border border-white/[0.08] flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setSelectedMetric('both')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'both' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Both', 'Ambos', 'Les deux', 'الكل')}
            </button>
            <button
              onClick={() => setSelectedMetric('rhr')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'rhr' ? 'bg-emerald-400 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('RHR', 'Pulso', 'FC', 'النبض RHR')}
            </button>
            <button
              onClick={() => setSelectedMetric('load')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'load' ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Load', 'Carga', 'Charge', 'الحمل Load')}
            </button>
          </div>

          <button
            onClick={handleRefreshData}
            title={t('Simulate Live Sync', 'Simular Sincronización', 'Actualiser Synchro', 'تحديث البيانات الحيوية')}
            className="p-2 bg-[#0C1411] hover:bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-slate-300 hover:text-emerald-400 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative z-10">
        <div className="bg-[#050807] p-4 rounded-2xl border border-emerald-500/25 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
              {t('Current Resting HR', 'Pulso en Reposo Actual', 'FC au Repos Actuelle', 'معدل نبض الراحة الحالي')}
            </span>
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-2xl font-black font-anime text-emerald-400">
                {currentRhr} <span className="text-xs font-normal text-slate-400">bpm</span>
              </span>
              <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                -{rhrImprovement} bpm
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
            <Heart className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#050807] p-4 rounded-2xl border border-[#D4AF37]/25 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
              {t('7-Day Total Load', 'Carga Total (7 Días)', 'Charge Totale (7 Jours)', 'إجمالي الحمل التدريبي (7 أيام)')}
            </span>
            <span className="text-2xl font-black font-anime text-[#D4AF37] block tabular-nums">
              {totalLoad.toLocaleString('en-US')} <span className="text-xs font-normal text-slate-400">AU</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-[#050807] p-4 rounded-2xl border border-emerald-500/25 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
              {t('Avg HRV Recovery', 'Promedio HRV', 'Moyenne VFC', 'متوسط الاستشفاء HRV')}
            </span>
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-2xl font-black font-anime text-white">
                {avgHrv} <span className="text-xs font-normal text-slate-400">ms</span>
              </span>
              <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/35">
                S-RANK
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px] w-full relative z-10 bg-[#050807] p-4 rounded-2xl border border-white/[0.08]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#18221D" vertical={false} />
            <XAxis dataKey={dayKey} stroke="#94A3B8" fontSize={12} tickLine={false} />

            {(selectedMetric === 'both' || selectedMetric === 'rhr') && (
              <YAxis yAxisId="rhr" orientation="left" domain={[50, 75]} stroke="#10B981" fontSize={11} tickLine={false} unit=" bpm" />
            )}

            {(selectedMetric === 'both' || selectedMetric === 'load') && (
              <YAxis yAxisId="load" orientation="right" domain={[300, 1000]} stroke="#D4AF37" fontSize={11} tickLine={false} unit=" AU" />
            )}

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value: string) => {
                if (value === 'rhr') return t('Resting Heart Rate (bpm)', 'Pulso en Reposo (bpm)', 'FC au Repos (bpm)', 'نبض الراحة (RHR bpm)');
                if (value === 'load') return t('Daily Training Load (AU)', 'Carga Diaria (AU)', 'Charge Quotidienne (AU)', 'الحمل التدريبي اليومي (Load AU)');
                return value;
              }}
            />

            {(selectedMetric === 'both' || selectedMetric === 'load') && (
              <Bar yAxisId="load" dataKey="load" fill="#D4AF37" opacity={0.28} radius={[6, 6, 0, 0]} barSize={24} />
            )}

            {(selectedMetric === 'both' || selectedMetric === 'rhr') && (
              <Line
                yAxisId="rhr"
                type="monotone"
                dataKey="rhr"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5, fill: '#050807', stroke: '#10B981', strokeWidth: 3 }}
                activeDot={{ r: 8, fill: '#10B981', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {(selectedMetric === 'both' || selectedMetric === 'load') && (
              <Line
                yAxisId="load"
                type="monotone"
                dataKey="load"
                stroke="#D4AF37"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#050807', stroke: '#D4AF37', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#D4AF37', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Footer */}
      <div className="mt-5 p-4 rounded-2xl bg-[#0C1411] border border-emerald-500/25 flex items-start gap-3 text-xs relative z-10">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-anime font-black text-emerald-400 block mb-0.5">
            {t('YARD Cardiac Adaptation Insight:', 'Análisis de Adaptación Cardíaca:', 'Analyse d’Adaptation Cardiaque :', 'تحليل كفاءة أورا للتكيف القلبي:')}
          </span>
          <p className="text-slate-300 leading-relaxed">
            {t(
              `Your RHR drop of ${rhrImprovement} bpm alongside ${totalLoad.toLocaleString('en-US')} AU weekly training load reflects strong parasympathetic recovery and conditioning.`,
              `La bajada de ${rhrImprovement} bpm en reposo junto a ${totalLoad.toLocaleString('en-US')} AU de carga semanal refleja excelente recuperación cardiovascular.`,
              `Votre baisse de ${rhrImprovement} bpm au repos associée à ${totalLoad.toLocaleString('en-US')} AU de charge confirme une adaptation cardiaque optimale.`,
              `انخفاض نبض الراحة بمقدار ${rhrImprovement} bpm مع المحافظة على حمل تدريبي مرتفع (${totalLoad.toLocaleString('en-US')} AU) يمثل استجابة قلبية وبدنية ممتازة.`
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeartRateLoadChart;
