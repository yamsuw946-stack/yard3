/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Flame, Zap, Trophy, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../i18n';
import { getCombatStreakData, recordCombatActivity, CombatStreakData } from '../services/combatStreak';
import { soundFX } from '../services/soundFX';

interface CombatStreakProps {
  currentLang?: Language;
  onNavigateToEngine?: () => void;
  className?: string;
}

export const CombatStreak: React.FC<CombatStreakProps> = ({
  currentLang = 'en',
  onNavigateToEngine,
  className = ''
}) => {
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';
  const isAr = currentLang === 'ar';

  const [streakData, setStreakData] = useState<CombatStreakData>(() => getCombatStreakData());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setStreakData(e.detail);
      } else {
        setStreakData(getCombatStreakData());
      }
    };
    window.addEventListener('yard300_streak_updated', handleUpdate);
    return () => window.removeEventListener('yard300_streak_updated', handleUpdate);
  }, []);

  const handleClaimDaily = () => {
    soundFX.playPowerUp();
    const updated = recordCombatActivity(100);
    setStreakData(updated);
  };

  return (
    <div className={`p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#1E1128] via-[#150F22] to-[#0A0D18] border-2 border-[#FF007A]/40 shadow-[0_0_35px_rgba(255,0,122,0.2)] relative overflow-hidden ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF007A] text-xs font-black font-anime">
            <Flame className="w-4 h-4 text-[#FFE600] animate-bounce" />
            <span>{isEs ? 'RACHA DE COMBATE Y PUNTOS DE AURA' : isFr ? 'SÉRIE DE COMBAT & POINTS D\'AURA' : isAr ? 'سلسلة التدريب القتالي المتواصل' : 'DAILY COMBAT STREAK & AURA PROTOCOL'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black font-anime text-white">
            {isEs 
              ? `${streakData.currentStreak} Días Consecutivos en el Dojo` 
              : isFr 
              ? `${streakData.currentStreak} Jours Consécutifs au Dojo` 
              : isAr 
              ? `${streakData.currentStreak} يوماً متواصلاً من التدريب الشاق` 
              : `${streakData.currentStreak}-Day Combat Unbroken Streak`}
          </h3>
          <p className="text-xs text-gray-300 max-w-xl font-bold">
            {isEs
              ? 'Entrena a diario con el motor YARD300 para mantener tu racha activa y multiplicar tus recompensas en tokens YARDX.'
              : isFr
              ? 'Entraînez-vous quotidiennement pour maintenir votre série et multiplier vos récompenses de jetons YARDX.'
              : isAr
              ? 'حافظ على وتيرة تدريب يومية دون انقطاع لرفع مستوى تصنيفك ومضاعفة مكافآت عملة YARDX.'
              : 'Log daily combat drills to maintain streak momentum and multiply your YARDX token staked earnings.'}
          </p>
        </div>

        {/* Streak Metrics Cards */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="p-4 rounded-2xl bg-black/60 border border-[#FF007A]/50 text-center font-mono">
            <span className="block text-[10px] text-gray-400 uppercase">TIER LEVEL</span>
            <span className="text-base font-black font-anime text-[#FFE600]">{streakData.tier}</span>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 border border-[#00F0FF]/50 text-center font-mono">
            <span className="block text-[10px] text-gray-400 uppercase">AURA POINTS</span>
            <span className="text-base font-black font-anime text-[#00F0FF]">{streakData.totalAuraPoints} AP</span>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span>Best Streak: <strong className="text-white">{streakData.bestStreak}d</strong></span>
          <span>•</span>
          <span>Active Days: <strong className="text-white">{streakData.totalActiveDays}d</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClaimDaily}
            className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-black font-anime text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>{isEs ? 'Completar Día (+100 AP)' : isFr ? 'Valider le Jour (+100 AP)' : isAr ? 'تسجيل نشاط اليوم (+100 AP)' : 'Claim Daily Bonus (+100 AP)'}</span>
          </button>

          {onNavigateToEngine && (
            <button
              onClick={onNavigateToEngine}
              className="px-4 py-2 rounded-xl bg-[#141624] hover:bg-[#1E2238] border border-gray-700 text-white text-xs font-black font-anime transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{isEs ? 'Ir al Motor YARD' : isFr ? 'Aller au Moteur' : isAr ? 'فتح محرك YARD' : 'Open Engine'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombatStreak;
