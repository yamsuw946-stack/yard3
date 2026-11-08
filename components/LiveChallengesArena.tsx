/**
 * LiveChallengesArena.tsx
 * Heroic section for Live Arena Battles, Random Cyber-Anime Challenges,
 * and high-voltage tournament mechanics on the homepage.
 */

import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Flame, 
  Sparkles, 
  Shuffle, 
  Trophy, 
  Zap, 
  Timer, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Crosshair
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { LIVE_ARENA_CHALLENGES_IMAGE, handleImageError } from '../constants';

interface LiveChallengesArenaProps {
  currentLang?: Language;
  onEnterArena?: () => void;
}

interface RandomChallenge {
  id: string;
  titleEn: string;
  titleAr: string;
  difficulty: 'S-RANK' | 'SS-RANK' | 'GOD-TIER';
  duration: string;
  repsEn: string;
  repsAr: string;
  rewardAP: number;
  rewardYardx: number;
  animeStanceEn: string;
  animeStanceAr: string;
  color: string;
}

const RANDOM_CHALLENGES: RandomChallenge[] = [
  {
    id: 'c1',
    titleEn: '100-Strike Dragon Barrage',
    titleAr: 'عاصفة الـ 100 لكمة لتنين شاولين',
    difficulty: 'S-RANK',
    duration: '90s',
    repsEn: '100 Rapid Combat Punches + 20 Jump Squats',
    repsAr: '100 لكمة قتالية فائقة السرعة + 20 قفزة سكوات انفجارية',
    rewardAP: 250,
    rewardYardx: 120,
    animeStanceEn: 'Fierce Dragon Fist Stance',
    animeStanceAr: 'وضعية قبضة التنين الهجومية',
    color: '#FF007A'
  },
  {
    id: 'c2',
    titleEn: 'Hyrox Shadow Sprint & Burpee Storm',
    titleAr: 'سبرنت الظل الهايروكسي وعاصفة البيربي',
    difficulty: 'SS-RANK',
    duration: '120s',
    repsEn: '30 Burpee Broad Jumps + High Knees Burnout',
    repsAr: '30 بيربي مع قفزة أمامية + ركض بركبتين عاليتين حتى الإنهاك',
    rewardAP: 400,
    rewardYardx: 200,
    animeStanceEn: 'Hyrox Titan Endurance Stance',
    animeStanceAr: 'وضعية تحمل عملاق الهايروكس',
    color: '#FFE600'
  },
  {
    id: 'c3',
    titleEn: 'Zenith Pilates Core Overdrive',
    titleAr: 'شحن الطاقة الحركية ومرونة البيلاتس القاتلة',
    difficulty: 'S-RANK',
    duration: '60s',
    repsEn: '60s Hollow Body Rock + Isometric Ki Lock',
    repsAr: '60 ثانية ثبات تجويف البطن + قفل الطاقة الحيوية كي',
    rewardAP: 300,
    rewardYardx: 150,
    animeStanceEn: 'Floating Lotus Energy Core',
    animeStanceAr: 'وضعية لوتس الطاقة العائمة والتحكم العصبي',
    color: '#00F0FF'
  },
  {
    id: 'c4',
    titleEn: 'Shaolin Tactical Blindfold Defense',
    titleAr: 'دفاع شاولين التكتيكي واستشعار الهالة',
    difficulty: 'GOD-TIER',
    duration: '180s',
    repsEn: 'Reaction Striking + 50 Explosive Switch Kicks',
    repsAr: 'اختبار ردود الأفعال اللحظية + 50 ركلة شاولين متبادلة',
    rewardAP: 600,
    rewardYardx: 350,
    animeStanceEn: 'Grandmaster Strategic Guard',
    animeStanceAr: 'وضعية الحراسة التكتيكية للماستر الأعلى',
    color: '#A855F7'
  }
];

export const LiveChallengesArena: React.FC<LiveChallengesArenaProps> = ({
  currentLang = 'en',
  onEnterArena
}) => {
  const isAr = currentLang === 'ar';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [activeFightersCount, setActiveFightersCount] = useState<number>(1429);
  const [livePot, setLivePot] = useState<number>(45800);

  // Live fighters pulse simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFightersCount(prev => prev + (Math.random() > 0.4 ? 1 : -1));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const currentChallenge = RANDOM_CHALLENGES[challengeIdx];

  const rollRandomChallenge = () => {
    soundFX.playButtonClick();
    soundFX.playAuraSurge();
    setIsRolling(true);

    let rolls = 0;
    const maxRolls = 6;
    const interval = setInterval(() => {
      setChallengeIdx(prev => (prev + 1) % RANDOM_CHALLENGES.length);
      rolls++;
      if (rolls >= maxRolls) {
        clearInterval(interval);
        setIsRolling(false);
        soundFX.playAuraBurst();
      }
    }, 90);
  };

  return (
    <section className="relative my-12 rounded-3xl overflow-hidden bg-[#0E101A] shadow-[0_0_50px_rgba(16,185,129,0.2)]">
      
      {/* Background Graphic Asset with Cyber Neon Overlays */}
      <div className="absolute inset-0 z-0">
        <img loading="lazy" decoding="async" 
          src={LIVE_ARENA_CHALLENGES_IMAGE} 
          alt="Live Cyber Tournament Arena & Random Challenges" 
          onError={handleImageError}
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter saturate-150 animate-aura"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-[#0A0B10]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B10] via-[#0A0B10]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-30 mix-blend-screen pointer-events-none"></div>
      </div>

      <div className="relative z-10 p-6 md:p-10 lg:p-12">
        
        {/* Top Live Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shrink-0 shadow-md">
              <Swords className="w-5 h-5 text-gray-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black font-anime text-gray-400 uppercase tracking-wider">
                  LIVE CYBER ARENA
                </span>
                <span className="flex items-center gap-1 text-[11px] font-black text-[#00F0FF] font-anime">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping"></span>
                  {activeFightersCount.toLocaleString()} {isAr ? 'مقاتل متصل الآن' : isFr ? 'Combattants en direct' : isEs ? 'Luchadores en vivo' : 'Fighters Online'}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black font-anime text-white mt-1">
                {isAr ? 'المنافسات الحية والتحديات العشوائية 🔥' : isFr ? 'Combats d\'Arène & Défis Aléatoires 🔥' : isEs ? 'Combates en Vivo y Desafíos Aleatorios 🔥' : 'Live Arena Combat & Random Daily Trials 🔥'}
              </h2>
            </div>
          </div>

          {/* Tournament Bounty Pot */}
          <div className="flex items-center gap-4 bg-[#141622]/90 border border-[#FFE600]/50 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(255,230,0,0.25)]">
            <Trophy className="w-7 h-7 text-[#FFE600] animate-bounce" style={{ animationDuration: '2s' }} />
            <div>
              <span className="text-[10px] font-black text-gray-400 font-anime uppercase tracking-wider block">
                {isAr ? 'جائزة بطولات اليوم الكبرى' : isFr ? 'CAGNOTTE DU JOUR' : isEs ? 'GRAN BOTE DEL DÍA' : 'TODAY GRAND BOUNTY POT'}
              </span>
              <span className="text-xl md:text-2xl font-black font-anime text-[#FFE600] neon-text-yellow">
                {livePot.toLocaleString()} <span className="text-xs text-white">YARDX</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Grid: Random Challenge Generator & Live HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          
          {/* Left Column: Interactive Random Challenge HUD */}
          <div className="lg:col-span-7 bg-[#121422]/95 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,240,255,0.2)] relative space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-[#00F0FF]/20 text-xs font-black font-anime text-[#00F0FF]">
                  {currentChallenge.difficulty}
                </span>
                <span className="px-3 py-1 rounded-xl bg-gray-800 text-xs font-bold text-gray-300 font-anime flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-[#FFE600]" />
                  {currentChallenge.duration}
                </span>
              </div>

              {/* Reroll Random Button - Solid Green */}
              <button
                onClick={rollRandomChallenge}
                disabled={isRolling}
                className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-black font-anime text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer disabled:opacity-50"
              >
                <Shuffle className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
                <span>{isAr ? 'تحدي عشوائي جديد 🎲' : isFr ? 'Nouveau Défi 🎲' : isEs ? 'Girar Desafío 🎲' : 'Reroll Random Trial 🎲'}</span>
              </button>
            </div>

            {/* Challenge Title & Stance */}
            <div className={`transition-all duration-300 ${isRolling ? 'opacity-30 blur-xs scale-98' : 'opacity-100 scale-100'}`}>
              <span className="text-xs font-black font-anime text-[#FFE600] uppercase tracking-wider block mb-1">
                🥋 {isAr ? currentChallenge.animeStanceAr : currentChallenge.animeStanceEn}
              </span>
              <h3 className="text-2xl md:text-3xl font-black font-anime text-white">
                {isAr ? currentChallenge.titleAr : currentChallenge.titleEn}
              </h3>
              <p className="text-sm font-bold text-gray-200 mt-2 bg-[#0A0B10] p-4 rounded-2xl">
                ⚡ <strong className="text-[#00F0FF]">{isAr ? 'المهمة المطلوبة:' : isFr ? 'Objectif :' : isEs ? 'Objetivo:' : 'Objective:'}</strong> {isAr ? currentChallenge.repsAr : currentChallenge.repsEn}
              </p>
            </div>

            {/* Rewards Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0A0B10] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-gray-400 font-anime block">
                    {isAr ? 'نقاط الهالة المكتسبة' : isFr ? 'POINTS D\'AURA (AP)' : isEs ? 'PUNTOS DE AURA (AP)' : 'AURA POINTS (AP)'}
                  </span>
                  <span className="text-2xl font-black font-anime text-[#10B981]">
                    +{currentChallenge.rewardAP}
                  </span>
                </div>
                <Sparkles className="w-6 h-6 text-[#10B981]" />
              </div>

              <div className="bg-[#0A0B10] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-gray-400 font-anime block">
                    {isAr ? 'عملات يارد بلس' : isFr ? 'JETONS YARDX' : isEs ? 'TOKENS YARDX' : 'YARDX TOKENS'}
                  </span>
                  <span className="text-2xl font-black font-anime text-[#FFE600] neon-text-yellow">
                    +{currentChallenge.rewardYardx}
                  </span>
                </div>
                <Zap className="w-6 h-6 text-[#FFE600]" />
              </div>
            </div>

            {/* Launch CTA - Single Solid Green Color */}
            {onEnterArena && (
              <button
                onClick={() => {
                  soundFX.playButtonClick();
                  soundFX.playAuraBurst();
                  onEnterArena();
                }}
                className="w-full py-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-black font-anime text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <span>{isAr ? 'دخول حلبة المنافسة الآن ⚔️' : isFr ? 'ENTRER DANS L\'ARÈNE EN DIRECT ⚔️' : isEs ? 'ENTRAR A LA ARENA EN VIVO ⚔️' : 'ENTER LIVE ARENA NOW ⚔️'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            )}

          </div>

          {/* Right Column: Live Combat Features & Mindset */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-5 rounded-2xl bg-[#141622]/90 border border-gray-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black font-anime text-[#FFE600]">
                <Flame className="w-4 h-4 text-[#10B981]" />
                <span>{isAr ? 'نزالات ملاكمة تفاعلية عشوائية' : isFr ? 'Shadow Boxing Aléatoire en Direct' : isEs ? 'Shadow Boxing Aleatorio en Vivo' : 'Random Real-time Shadow Boxing'}</span>
              </div>
              <p className="text-xs text-gray-300 font-bold leading-relaxed">
                {isAr 
                  ? 'خوارزميات ذكاء اصطناعي تولد تحديات غير متوقعة لكسر روتين التمرين وتفعيل أعلى استجابة للألياف العضلية السريعة.'
                  : isFr
                  ? 'Moteur IA générant des défis imprévisibles pour stimuler la puissance explosive et briser la routine.'
                  : isEs
                  ? 'Motor de IA que genera desafíos tácticos repentinos para romper la rutina y elevar la velocidad reactiva.'
                  : 'Adaptive AI engine rolls sudden tactical challenges testing cardiovascular output, raw speed, and twitch reflexes.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141622]/90 border border-gray-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black font-anime text-[#00F0FF]">
                <TrendingUp className="w-4 h-4 text-[#00F0FF]" />
                <span>{isAr ? 'مضاعف مكافآت العملات YARDX' : isFr ? 'Multiplicateur de Récompenses YARDX' : isEs ? 'Multiplicador de Tokens YARDX' : 'YARDX Token Yield Multiplier'}</span>
              </div>
              <p className="text-xs text-gray-300 font-bold leading-relaxed">
                {isAr
                  ? 'كلما زادت وتيرة الحركات واللكمات المتتالية، كلما تضاعفت نقاط الهالة ورصيد عملاتك الرقمية في المنصة.'
                  : isFr
                  ? 'Plus ta cadence de frappe est élevée, plus ton multiplicateur de jetons YARDX augmente dans l\'écosystème.'
                  : isEs
                  ? 'A mayor cadencia y racha de combos continuos, mayor será la multiplicación de tus recompensas YARDX.'
                  : 'Sustained combo pacing accelerates your reward yield, minting YARDX tokens directly to your athlete profile.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141622]/90 border border-gray-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black font-anime text-[#FFE600]">
                <Crosshair className="w-4 h-4 text-[#FFE600]" />
                <span>{isAr ? 'تحديات السايبر للأبطال حول العالم' : isFr ? 'Tournois Cyber Mondiaux 24/7' : isEs ? 'Torneos Mundiales Cyber 24/7' : 'Global 24/7 Cyber Arena Matches'}</span>
              </div>
              <p className="text-xs text-gray-300 font-bold leading-relaxed">
                {isAr
                  ? 'تنافس ضد أبطال من مختلف دول العالم لحظياً واصعد في لوحة الشرف الأسبوعية لتخليد اسمك.'
                  : isFr
                  ? 'Défie des athlètes du monde entier en temps réel et hisse-toi au sommet du classement mondial.'
                  : isEs
                  ? 'Compite contra atletas de todo el mundo en tiempo real y escala en la tabla de clasificación semanal.'
                  : 'Compete against elite martial artists worldwide in real time and ascend the weekly hall of fame.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141622]/90 border border-gray-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black font-anime text-[#00F0FF]">
                <Crosshair className="w-4 h-4 text-[#00F0FF]" />
                <span>{isAr ? 'مستشعر دقة الأهداف وحرق السعرات' : 'Precision Target Matrix & Calorie Surge'}</span>
              </div>
              <p className="text-xs text-gray-300 font-bold leading-relaxed">
                {isAr
                  ? 'تتبع لحظي للنبض، الحمل الحركي، ودقة اللكمات مع مزامنة كاملة لنقاط الهالة (Aura Points) وسلسلة القتال.'
                  : 'Live biometric tracking maps cardiac load, strike velocity, and synchronizes Aura Points directly to your combat streak.'}
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
