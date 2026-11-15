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
  Tooltip
} from 'recharts';
import { Language, tr } from '../i18n';
import { Activity, Heart, Zap, TrendingDown, Award, Info, RefreshCw } from 'lucide-react';
import { soundFX } from '../services/soundFX';

interface HeartRateLoadDataPoint {
  day: string;
  dayShort: string;
  dayEs: string;
  dayFr: string;
  rhr: number;
  load: number;
  hrv: number;
  calories: number;
}

const DEFAULT_7DAY_DATA: HeartRateLoadDataPoint[] = [
  { day: 'اليوم 1', dayShort: 'Mon', dayEs: 'Lun', dayFr: 'Lun', rhr: 66, load: 420, hrv: 62, calories: 510 },
  { day: 'اليوم 2', dayShort: 'Tue', dayEs: 'Mar', dayFr: 'Mar', rhr: 64, load: 680, hrv: 68, calories: 720 },
  { day: 'اليوم 3', dayShort: 'Wed', dayEs: 'Mié', dayFr: 'Mer', rhr: 63, load: 550, hrv: 74, calories: 610 },
  { day: 'اليوم 4', dayShort: 'Thu', dayEs: 'Jue', dayFr: 'Jeu', rhr: 61, load: 840, hrv: 79, calories: 890 },
  { day: 'اليوم 5', dayShort: 'Fri', dayEs: 'Vie', dayFr: 'Ven', rhr: 60, load: 490, hrv: 85, calories: 530 },
  { day: 'اليوم 6', dayShort: 'Sat', dayEs: 'Sáb', dayFr: 'Sam', rhr: 58, load: 910, hrv: 91, calories: 960 },
  { day: 'اليوم 7', dayShort: 'Sun', dayEs: 'Dom', dayFr: 'Dim', rhr: 57, load: 630, hrv: 95, calories: 680 }
];

interface HeartRateLoadChartProps {
  currentLang?: Language;
  className?: string;
}

export const HeartRateLoadChart: React.FC<HeartRateLoadChartProps> = ({
  currentLang = 'en',
  className = ''
}) => {
  const t = (texts: { en: string; es: string; fr: string; ar: string }) => tr(currentLang, texts);
  const [data, setData] = useState<HeartRateLoadDataPoint[]>(DEFAULT_7DAY_DATA);
  const [selectedMetric, setSelectedMetric] = useState<'both' | 'rhr' | 'load'>('both');

  const initialRhr = data[0]?.rhr || 66;
  const currentRhr = data[data.length - 1]?.rhr || 57;
  const rhrImprovement = initialRhr - currentRhr;
  const totalLoad = data.reduce((acc, d) => acc + d.load, 0);
  const avgHrv = Math.round(data.reduce((acc, d) => acc + d.hrv, 0) / data.length);

  const handleRefreshData = () => {
    soundFX.playButtonClick();
    setData(prev =>
      prev.map((item) => ({
        ...item,
        rhr: Math.max(50, Math.min(75, item.rhr + Math.floor(Math.random() * 3) - 1)),
        load: Math.max(300, Math.min(1000, item.load + Math.floor(Math.random() * 80) - 40)),
        hrv: Math.max(50, Math.min(110, item.hrv + Math.floor(Math.random() * 4) - 2))
      }))
    );
  };

  const dayKey = currentLang === 'ar' ? 'day' : currentLang === 'es' ? 'dayEs' : currentLang === 'fr' ? 'dayFr' : 'dayShort';

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const pt = payload[0].payload as HeartRateLoadDataPoint;
    return (
      <div className="bg-[#07090F]/95 border border-white/[0.14] rounded-xl p-3.5 shadow-2xl space-y-1.5 text-xs min-w-[200px]">
        <div className="font-mono font-bold text-[#D4AF37] border-b border-white/[0.08] pb-1">
          {t({ en: pt.dayShort, es: pt.dayEs, fr: pt.dayFr, ar: pt.day })}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono tabular-nums text-[11px]">
          <span className="text-slate-400">{t({ en: 'Resting HR:', es: 'FC en Reposo:', fr: 'FC au Repos :', ar: 'نبض الراحة:' })}</span>
          <span className="text-[#00F0FF] font-bold text-end">{pt.rhr} bpm</span>
          <span className="text-slate-400">{t({ en: 'Training Load:', es: 'Carga Entreno:', fr: 'Charge :', ar: 'الحمل التدريبي:' })}</span>
          <span className="text-[#D4AF37] font-bold text-end">{pt.load} AU</span>
          <span className="text-slate-400">HRV:</span>
          <span className="text-[#10B981] font-bold text-end">{pt.hrv} ms</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-[#0B0E16] rounded-2xl p-5 md:p-7 border border-white/[0.08] space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/[0.07] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#D4AF37] uppercase tracking-[0.16em]">
            <Heart className="w-3.5 h-3.5 text-[#10B981]" />
            <span>
              {t({
                en: '7-DAY CARDIOVASCULAR ADAPTATION',
                es: 'ADAPTACIÓN CARDIOVASCULAR DE 7 DÍAS',
                fr: 'ADAPTATION CARDIOVASCULAIRE SUR 7 JOURS',
                ar: 'التكيّف القلبي وتقلب النبض 7 أيام'
              })}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {t({
              en: 'Resting Heart Rate vs Training Load Telemetry',
              es: 'Telemetría: FC en Reposo vs Carga de Entrenamiento',
              fr: 'Télémétrie : FC au Repos vs Charge d\'Entraînement',
              ar: 'مسار نبض الراحة RHR مع الحمل اليومي'
            })}
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="bg-[#07080D] p-1 rounded-lg border border-white/[0.08] flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setSelectedMetric('both');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedMetric === 'both' ? 'bg-[#D4AF37] text-[#07080D] font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t({ en: 'Combined', es: 'Combinado', fr: 'Combiné', ar: 'مزدوج' })}
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setSelectedMetric('rhr');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedMetric === 'rhr' ? 'bg-[#00F0FF] text-[#07080D] font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              RHR
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setSelectedMetric('load');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedMetric === 'load' ? 'bg-[#10B981] text-[#07080D] font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t({ en: 'Load', es: 'Carga', fr: 'Charge', ar: 'الحمل' })}
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefreshData}
            title={t({ en: 'Sync telemetry', es: 'Sincronizar telemetría', fr: 'Synchroniser la télémétrie', ar: 'محاكاة المزامنة اللحظية' })}
            className="p-2 bg-[#111521] hover:bg-[#191E2E] border border-white/[0.1] rounded-lg text-slate-300 hover:text-[#00F0FF] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Telemetry Summary Readouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#07080D] p-4 rounded-xl border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">
              {t({ en: 'CURRENT RESTING HR', es: 'FC EN REPOSO ACTUAL', fr: 'FC AU REPOS ACTUELLE', ar: 'نبض الراحة الحالي' })}
            </span>
            <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
              <span className="text-2xl font-bold text-[#00F0FF]">{currentRhr}</span>
              <span className="text-xs text-slate-400">bpm</span>
              <span className="text-xs text-[#10B981] flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                {rhrImprovement >= 0 ? `-${rhrImprovement}` : `+${Math.abs(rhrImprovement)}`}
              </span>
            </div>
          </div>
          <Heart className="w-5 h-5 text-[#00F0FF]" />
        </div>

        <div className="bg-[#07080D] p-4 rounded-xl border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">
              {t({ en: '7D CUMULATIVE LOAD', es: 'CARGA ACUMULADA 7D', fr: 'CHARGE CUMULÉE 7J', ar: 'الحمل التراكمي 7 أيام' })}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1 font-mono tabular-nums">
              <span className="text-2xl font-bold text-[#D4AF37]">{totalLoad.toLocaleString('en-US')}</span>
              <span className="text-xs text-slate-400">AU</span>
            </div>
          </div>
          <Zap className="w-5 h-5 text-[#D4AF37]" />
        </div>

        <div className="bg-[#07080D] p-4 rounded-xl border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">
              {t({ en: 'MEAN HRV RECOVERY', es: 'MEDIA RECUPERACIÓN HRV', fr: 'RÉCUPÉRATION HRV MOYENNE', ar: 'متوسط الاستشفاء HRV' })}
            </span>
            <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
              <span className="text-2xl font-bold text-[#10B981]">{avgHrv}</span>
              <span className="text-xs text-slate-400">ms · S-Rank</span>
            </div>
          </div>
          <Award className="w-5 h-5 text-[#10B981]" />
        </div>
      </div>

      {/* Main Chart Viewport */}
      <div className="h-[310px] w-full bg-[#07080D] p-4 rounded-xl border border-white/[0.06]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 14, right: 10, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#161D2F" vertical={false} />
            <XAxis
              dataKey={dayKey}
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
            />

            {(selectedMetric === 'both' || selectedMetric === 'rhr') && (
              <YAxis
                yAxisId="rhr"
                orientation="left"
                domain={[50, 75]}
                stroke="#00F0FF"
                tick={{ fill: '#00F0FF', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
              />
            )}

            {(selectedMetric === 'both' || selectedMetric === 'load') && (
              <YAxis
                yAxisId="load"
                orientation="right"
                domain={[300, 1000]}
                stroke="#D4AF37"
                tick={{ fill: '#D4AF37', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            {(selectedMetric === 'both' || selectedMetric === 'load') && (
              <Bar yAxisId="load" dataKey="load" fill="#D4AF37" opacity={0.25} radius={[4, 4, 0, 0]} barSize={24} />
            )}

            {(selectedMetric === 'both' || selectedMetric === 'rhr') && (
              <Line
                yAxisId="rhr"
                type="monotone"
                dataKey="rhr"
                stroke="#00F0FF"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#07080D', stroke: '#00F0FF', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#D4AF37' }}
              />
            )}

            {(selectedMetric === 'both' || selectedMetric === 'load') && (
              <Line
                yAxisId="load"
                type="monotone"
                dataKey="load"
                stroke="#D4AF37"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#07080D', stroke: '#D4AF37', strokeWidth: 1.5 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Banner */}
      <div className="p-4 rounded-xl bg-[#07080D] border border-white/[0.06] flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">
          {t({
            en: `Resting HR reduction of ${rhrImprovement} bpm alongside ${totalLoad.toLocaleString('en-US')} AU weekly workload indicates strong parasympathetic rebound and aerobic stroke efficiency.`,
            es: `Una reducción de ${rhrImprovement} bpm en FC en reposo junto con ${totalLoad.toLocaleString('en-US')} AU semanales demuestra un fuerte rebote parasimpático y eficiencia aeróbica.`,
            fr: `Une baisse de ${rhrImprovement} bpm de FC au repos combinée à ${totalLoad.toLocaleString('en-US')} AU hebdomadaires confirme un fort rebond parasympathique et une excellente efficacité cardiaque.`,
            ar: `انخفاض نبض الراحة بمقدار ${rhrImprovement} bpm بالتزامن مع حمل تراكمي (${totalLoad.toLocaleString('en-US')} AU) يثبت ارتفاع كفاءة الضخ القلبي والاستشفاء العصبي.`
          })}
        </p>
      </div>
    </div>
  );
};

export default HeartRateLoadChart;
