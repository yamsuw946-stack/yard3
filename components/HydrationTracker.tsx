/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, RotateCcw, Sparkles, Check, Flame } from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';

interface HydrationTrackerProps {
  currentLang?: Language;
  className?: string;
}

export const HydrationTracker: React.FC<HydrationTrackerProps> = ({
  currentLang = 'en',
  className = ''
}) => {
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';
  const isAr = currentLang === 'ar';

  const TARGET_ML = 3000;
  const [currentMl, setCurrentMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('yard300_hydration_ml');
      return saved ? parseInt(saved, 10) : 1750;
    } catch {
      return 1750;
    }
  });

  const percentage = Math.min(100, Math.round((currentMl / TARGET_ML) * 100));

  const handleAdd = (amount: number) => {
    soundFX.playPowerUp();
    setCurrentMl((prev) => {
      const next = Math.min(5000, prev + amount);
      localStorage.setItem('yard300_hydration_ml', next.toString());
      return next;
    });
  };

  const handleReset = () => {
    soundFX.playButtonClick();
    setCurrentMl(0);
    localStorage.setItem('yard300_hydration_ml', '0');
  };

  return (
    <div className={`p-6 md:p-8 rounded-3xl bg-[#0F101A] border-2 border-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-black font-anime">
            <Droplets className="w-3.5 h-3.5" />
            <span>{isEs ? 'CONTROL DE HIDRATACIÓN DIARIA' : isFr ? 'HYDRATATION CELLULAIRE EN DIRECT' : isAr ? 'مؤشر الترطيب الحيوي اليومي' : 'BIOMETRIC HYDRATION TRACKER'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black font-anime text-white">
            {isEs 
              ? 'YARD 300 Vasija Geométrica de Hidratación' 
              : isFr 
              ? 'Gourde Géométrique Innovante YARD 300' 
              : isAr 
              ? 'متابعة ترطيب الجسم ووعاء YARD 300 المبتكر' 
              : 'YARD 300 Next-Gen Geometric Hydration'}
          </h3>
          <p className="text-xs text-gray-300 max-w-xl font-bold">
            {isEs
              ? 'Mantén la hidratación celular para prevenir calambres y acelerar la recuperación neuromuscular.'
              : isFr
              ? 'Maintenez l\'hydratation cellulaire pour prévenir les crampes et accélérer la récupération.'
              : isAr
              ? 'يحافظ على توازن كهرليات العضلات ويمنع التشنجات أثناء التمارين القتالية الشاقة.'
              : 'Maintain cellular electrolyte balance to eliminate muscle cramps and accelerate neural recovery.'}
          </p>
        </div>

        {/* Level Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right font-mono">
            <span className="block text-2xl font-black text-[#00F0FF] font-anime">{currentMl} / {TARGET_ML} ml</span>
            <span className="text-xs text-gray-400 font-bold">{percentage}% {isEs ? 'Completado' : isFr ? 'Atteint' : isAr ? 'مكتمل' : 'Quota Achieved'}</span>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-black/60 border border-[#00F0FF] flex items-center justify-center relative overflow-hidden">
            <div 
              className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#00F0FF] to-[#0099FF] transition-all duration-500 opacity-60"
              style={{ height: `${percentage}%` }}
            />
            <span className="relative z-10 font-black font-anime text-sm text-white">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAdd(250)}
            className="px-4 py-2 rounded-xl bg-[#141624] hover:bg-[#1E2238] border border-gray-700 hover:border-[#00F0FF] text-white text-xs font-black font-anime transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>+250 ml (1 Cup)</span>
          </button>
          <button
            onClick={() => handleAdd(500)}
            className="px-4 py-2 rounded-xl bg-[#141624] hover:bg-[#1E2238] border border-gray-700 hover:border-[#00F0FF] text-white text-xs font-black font-anime transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>+500 ml (1 Bottle)</span>
          </button>
          <button
            onClick={() => handleAdd(750)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF]/20 to-[#0099FF]/20 border border-[#00F0FF]/60 text-[#00F0FF] text-xs font-black font-anime transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>+750 ml (YARD Vessel)</span>
          </button>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-mono text-gray-500 hover:text-gray-300 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Day</span>
        </button>
      </div>
    </div>
  );
};

export default HydrationTracker;
