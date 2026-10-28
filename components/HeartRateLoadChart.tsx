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
import { Language } from '../i18n';
import { Activity, Heart, Zap, TrendingDown, Award, Info, RefreshCw } from 'lucide-react';
import { soundFX } from '../services/soundFX';

interface HeartRateLoadDataPoint {
  day: string;
  dayShort: string;
  rhr: number;      // Resting Heart Rate (bpm)
  load: number;     // Daily Training Load (AU)
  hrv: number;      // Heart Rate Variability (ms)
  calories: number;
}

const DEFAULT_7DAY_DATA: HeartRateLoadDataPoint[] = [
  { day: 'اليوم 1', dayShort: 'Mon', rhr: 66, load: 420, hrv: 62, calories: 510 },
  { day: 'اليوم 2', dayShort: 'Tue', rhr: 64, load: 680, hrv: 68, calories: 720 },
  { day: 'اليوم 3', dayShort: 'Wed', rhr: 63, load: 550, hrv: 74, calories: 610 },
  { day: 'اليوم 4', dayShort: 'Thu', rhr: 61, load: 840, hrv: 79, calories: 890 },
  { day: 'اليوم 5', dayShort: 'Fri', rhr: 60, load: 490, hrv: 85, calories: 530 },
  { day: 'اليوم 6', dayShort: 'Sat', rhr: 58, load: 910, hrv: 91, calories: 960 },
  { day: 'اليوم 7', dayShort: 'Sun', rhr: 57, load: 630, hrv: 95, calories: 680 },
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
  const [data, setData] = useState<HeartRateLoadDataPoint[]>(DEFAULT_7DAY_DATA);
  const [selectedMetric, setSelectedMetric] = useState<'both' | 'rhr' | 'load'>('both');

  // Calculations
  const initialRhr = data[0]?.rhr || 66;
  const currentRhr = data[data.length - 1]?.rhr || 57;
  const rhrImprovement = initialRhr - currentRhr;
  
  const avgRhr = Math.round(data.reduce((acc, d) => acc + d.rhr, 0) / data.length);
  const totalLoad = data.reduce((acc, d) => acc + d.load, 0);
  const avgHrv = Math.round(data.reduce((acc, d) => acc + d.hrv, 0) / data.length);

  const handleRefreshData = () => {
    soundFX.playButtonClick();
    // Slightly randomize for realistic biometric simulation
    setData(prev => prev.map((item) => ({
      ...item,
      rhr: Math.max(50, Math.min(75, item.rhr + Math.floor(Math.random() * 3) - 1)),
      load: Math.max(300, Math.min(1000, item.load + Math.floor(Math.random() * 80) - 40)),
      hrv: Math.max(50, Math.min(110, item.hrv + Math.floor(Math.random() * 4) - 2)),
    })));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as HeartRateLoadDataPoint;
      return (
        <div className="bg-[#181A28] border-2 border-[#00F0FF] rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.9)] space-y-2 text-xs">
          <p className="font-anime font-black text-[#FFE600] text-sm border-b border-gray-700 pb-1">
            {isAr ? dataPoint.day : `Day: ${dataPoint.dayShort}`}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#00F0FF] font-bold">
              <Heart className="w-3.5 h-3.5 text-[#00F0FF] fill-[#00F0FF]/30" />
              {isAr ? 'نبض الراحة (RHR):' : 'Resting HR:'}
            </span>
            <span className="font-anime font-black text-white text-sm">{dataPoint.rhr} bpm</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#FF007A] font-bold">
              <Zap className="w-3.5 h-3.5 text-[#FF007A]" />
              {isAr ? 'الحمل التدريبي (Load):' : 'Training Load:'}
            </span>
            <span className="font-anime font-black text-white text-sm">{dataPoint.load} AU</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#FFE600] font-bold">
              <Activity className="w-3.5 h-3.5 text-[#FFE600]" />
              {isAr ? 'تقلب النبض (HRV):' : 'HRV Recovery:'}
            </span>
            <span className="font-anime font-black text-[#FFE600] text-sm">{dataPoint.hrv} ms</span>
          </div>
          <p className="text-[10px] text-gray-400 italic pt-1 border-t border-gray-800">
            {isAr ? 'تطور كفاءة عضلة القلب والتكيف الحركي' : 'Cardiovascular efficiency & recovery score'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-[#12131C] rounded-3xl p-6 md:p-8 border-2 border-[#7000FF]/50 shadow-[0_10px_30px_rgba(112,0,255,0.2)] relative overflow-hidden backdrop-blur-xl ${className}`}>
      
      {/* Background Neon Aura */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#7000FF]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#FF007A]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#7000FF] via-[#FF007A] to-[#00F0FF] p-[2px] shadow-[0_0_12px_#7000FF]">
              <div className="bg-[#0A0B10] p-1.5 rounded-[10px]">
                <Heart className="w-5 h-5 text-[#FF007A] animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black font-anime text-white">
              {isAr ? 'تطور نبض الراحة والحمل التدريبي (7 أيام)' : '7-Day Resting Heart Rate & Load Progression'}
            </h3>
          </div>
          <p className="text-xs text-gray-400 font-bold">
            {isAr 
              ? 'متابعة انخفاض معدل ضربات القلب أثناء الراحة كمؤشر لارتفاع لياقة القلب وتكيف الجسد مع الحمل' 
              : 'Track RHR reduction alongside training load to visualize cardiovascular adaptation'}
          </p>
        </div>

        {/* View Switcher & Simulate Button */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="bg-[#0A0B10] p-1 rounded-xl border border-gray-800 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setSelectedMetric('both')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'both' ? 'bg-[#7000FF] text-white shadow-[0_0_10px_#7000FF]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isAr ? 'الكل' : 'Both'}
            </button>
            <button
              onClick={() => setSelectedMetric('rhr')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'rhr' ? 'bg-[#00F0FF] text-black shadow-[0_0_10px_#00F0FF]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isAr ? 'النبض RHR' : 'RHR'}
            </button>
            <button
              onClick={() => setSelectedMetric('load')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'load' ? 'bg-[#FF007A] text-white shadow-[0_0_10px_#FF007A]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isAr ? 'الحمل Load' : 'Load'}
            </button>
          </div>

          <button
            onClick={handleRefreshData}
            title={isAr ? 'تحديث البيانات الحيوية' : 'Simulate Live Sync'}
            className="p-2 bg-[#1A1C2C] hover:bg-[#25283F] border border-[#7000FF]/50 rounded-xl text-gray-300 hover:text-[#00F0FF] transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Key Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
        
        {/* RHR Improvement Badge */}
        <div className="bg-[#0A0B10]/80 p-4 rounded-2xl border border-[#00F0FF]/40 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <span className="text-[11px] font-bold text-gray-400 block mb-0.5">
              {isAr ? 'معدل نبض الراحة الحالي' : 'Current Resting HR'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-anime text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                {currentRhr} <span className="text-xs font-normal text-gray-400">bpm</span>
              </span>
              <span className="text-xs font-bold text-[#FFE600] flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5 text-[#FFE600]" />
                -{rhrImprovement} bpm
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-[#00F0FF]" />
          </div>
        </div>

        {/* Weekly Load Cumulative */}
        <div className="bg-[#0A0B10]/80 p-4 rounded-2xl border border-[#FF007A]/40 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <span className="text-[11px] font-bold text-gray-400 block mb-0.5">
              {isAr ? 'إجمالي الحمل التدريبي (7 أيام)' : '7-Day Total Load'}
            </span>
            <span className="text-2xl font-black font-anime text-[#FF007A] drop-shadow-[0_0_10px_rgba(255,0,122,0.4)] block">
              {totalLoad.toLocaleString()} <span className="text-xs font-normal text-gray-400">AU</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF007A]/10 border border-[#FF007A]/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#FF007A]" />
          </div>
        </div>

        {/* Recovery Adaptability Score */}
        <div className="bg-[#0A0B10]/80 p-4 rounded-2xl border border-[#FFE600]/40 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <span className="text-[11px] font-bold text-gray-400 block mb-0.5">
              {isAr ? 'متوسط الاستشفاء HRV' : 'Avg HRV Recovery'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-anime text-[#FFE600] drop-shadow-[0_0_10px_rgba(255,230,0,0.4)]">
                {avgHrv} <span className="text-xs font-normal text-gray-400">ms</span>
              </span>
              <span className="text-[10px] font-black bg-[#FFE600]/20 text-[#FFE600] px-1.5 py-0.5 rounded border border-[#FFE600]/40">
                S-RANK
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/30 flex items-center justify-center">
            <Award className="w-5 h-5 text-[#FFE600]" />
          </div>
        </div>

      </div>

      {/* Main 7-Day Progression Chart */}
      <div className="h-[340px] w-full relative z-10 bg-[#0A0B10]/90 p-4 rounded-2xl border border-gray-800">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2235" vertical={false} />
            <XAxis 
              dataKey={isAr ? 'day' : 'dayShort'} 
              stroke="#8E93B0" 
              fontSize={12} 
              tickLine={false} 
            />
            
            {/* Left Y-Axis for RHR (bpm) */}
            {(selectedMetric === 'both' || selectedMetric === 'rhr') && (
              <YAxis 
                yAxisId="rhr" 
                orientation="left" 
                domain={[50, 75]} 
                stroke="#00F0FF" 
                fontSize={11} 
                tickLine={false}
                unit=" bpm"
              />
            )}

            {/* Right Y-Axis for Load (AU) */}
            {(selectedMetric === 'both' || selectedMetric === 'load') && (
              <YAxis 
                yAxisId="load" 
                orientation="right" 
                domain={[300, 1000]} 
                stroke="#FF007A" 
                fontSize={11} 
                tickLine={false}
                unit=" AU"
              />
            )}

            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value: string) => {
                if (value === 'rhr') return isAr ? 'نبض الراحة (RHR bpm)' : 'Resting Heart Rate (bpm)';
                if (value === 'load') return isAr ? 'الحمل التدريبي اليومي (Load AU)' : 'Daily Training Load (AU)';
                return value;
              }}
            />

            {/* Daily Load Bar Representation */}
            {(selectedMetric === 'both' || selectedMetric === 'load') && (
              <Bar 
                yAxisId="load" 
                dataKey="load" 
                fill="#FF007A" 
                opacity={0.3} 
                radius={[6, 6, 0, 0]} 
                barSize={24}
              />
            )}

            {/* Resting Heart Rate Progression Line */}
            {(selectedMetric === 'both' || selectedMetric === 'rhr') && (
              <Line 
                yAxisId="rhr" 
                type="monotone" 
                dataKey="rhr" 
                stroke="#00F0FF" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#0A0B10', stroke: '#00F0FF', strokeWidth: 3 }}
                activeDot={{ r: 8, fill: '#00F0FF', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {/* Daily Load Progression Line */}
            {(selectedMetric === 'both' || selectedMetric === 'load') && (
              <Line 
                yAxisId="load" 
                type="monotone" 
                dataKey="load" 
                stroke="#FF007A" 
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#0A0B10', stroke: '#FF007A', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#FF007A', stroke: '#FFE600', strokeWidth: 2 }}
              />
            )}

          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Footer Banner */}
      <div className="mt-6 p-4 rounded-2xl bg-[#181A28] border border-[#7000FF]/40 flex items-start gap-3 text-xs relative z-10">
        <Info className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
        <div>
          <span className="font-anime font-black text-[#00F0FF] block mb-0.5">
            {isAr ? 'تحليل كفاءة أورا للتكيف القلبي:' : 'AURA Cardiac Adaptation Insight:'}
          </span>
          <p className="text-gray-300 leading-relaxed">
            {isAr 
              ? `انخفاض نبض الراحة بمقدار ${rhrImprovement} bpm مع المحافظة على حمل تدريبي مرتفع (${totalLoad.toLocaleString()} AU) يمثل استجابة قلبية وبدنية ممتازة وتكيفاً مع التدريبات الشديدة.`
              : `Your RHR drop of ${rhrImprovement} bpm despite sustained high training load (${totalLoad.toLocaleString()} AU) demonstrates superior stroke volume adaptation and parasympathetic nervous system recovery.`}
          </p>
        </div>
      </div>

    </div>
  );
};

export default HeartRateLoadChart;
