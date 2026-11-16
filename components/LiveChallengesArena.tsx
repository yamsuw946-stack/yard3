/**
 * LiveChallengesArena.tsx
 * Live Arena Battles and Random Tactical Challenges with 4-language parity and obsidian-emerald design.
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
  ArrowRight,
  TrendingUp,
  Crosshair
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { LIVE_ARENA_CHALLENGES_IMAGE, handleImageError } from '../constants';

interface LiveChallengesArenaProps {
  currentLang?: Language;
  onEnterArena?: () => void;
}

interface Localized {
  en: string;
  es: string;
  fr: string;
  ar: string;
}

interface RandomChallenge {
  id: string;
  title: Localized;
  difficulty: 'S-RANK' | 'SS-RANK' | 'GOD-TIER';
  duration: string;
  reps: Localized;
  rewardAP: number;
  rewardYardx: number;
  stance: Localized;
  color: string;
}

const RANDOM_CHALLENGES: RandomChallenge[] = [
  {
    id: 'c1',
    title: {
      en: '100-Strike Dragon Barrage',
      es: 'Ráfaga de 100 Golpes del Dragón',
      fr: 'Rafale des 100 Frappes du Dragon',
      ar: 'عاصفة الـ 100 لكمة لتنين شاولين'
    },
    difficulty: 'S-RANK',
    duration: '90s',
    reps: {
      en: '100 Rapid Combat Punches + 20 Jump Squats',
      es: '100 Golpes Rápidos de Combate + 20 Sentadillas con Salto',
      fr: '100 Coups Rapides + 20 Squats Sautés Explosifs',
      ar: '100 لكمة قتالية فائقة السرعة + 20 قفزة سكوات انفجارية'
    },
    rewardAP: 250,
    rewardYardx: 120,
    stance: {
      en: 'Fierce Dragon Fist Stance',
      es: 'Postura Puño del Dragón',
      fr: 'Posture Poing du Dragon',
      ar: 'وضعية قبضة التنين الهجومية'
    },
    color: '#10B981'
  },
  {
    id: 'c2',
    title: {
      en: 'Hyrox Shadow Sprint & Burpee Storm',
      es: 'Sprint Hyrox Sombra y Tormenta Burpee',
      fr: 'Sprint Hyrox Ombre & Tempête de Burpees',
      ar: 'سبرنت الظل الهايروكسي وعاصفة البيربي'
    },
    difficulty: 'SS-RANK',
    duration: '120s',
    reps: {
      en: '30 Burpee Broad Jumps + High Knees Burnout',
      es: '30 Burpees con Salto Largo + Rodillas Altas al Máximo',
      fr: '30 Burpees Sauts en Longueur + Montées de Genoux',
      ar: '30 بيربي مع قفزة أمامية + ركض بركبتين عاليتين حتى الإنهاك'
    },
    rewardAP: 400,
    rewardYardx: 200,
    stance: {
      en: 'Hyrox Titan Endurance Stance',
      es: 'Postura Resistencia Titán Hyrox',
      fr: 'Posture Endurance Titan Hyrox',
      ar: 'وضعية تحمل عملاق الهايروكس'
    },
    color: '#D4AF37'
  },
  {
    id: 'c3',
    title: {
      en: 'Zenith Pilates Core Overdrive',
      es: 'Sobrecarga Core Pilates Cenit',
      fr: 'Surcharge Core Pilates Zénith',
      ar: 'شحن الطاقة الحركية ومرونة البيلاتس القاتلة'
    },
    difficulty: 'S-RANK',
    duration: '60s',
    reps: {
      en: '60s Hollow Body Rock + Isometric Ki Lock',
      es: '60s Balanceo Hollow Body + Bloqueo Isométrico',
      fr: '60s Hollow Body + Gainage Isométrique Profond',
      ar: '60 ثانية ثبات تجويف البطن + قفل الطاقة الحيوية كي'
    },
    rewardAP: 300,
    rewardYardx: 150,
    stance: {
      en: 'Floating Lotus Energy Core',
      es: 'Núcleo Energético Loto Flotante',
      fr: 'Noyau Énergétique Lotus Flottant',
      ar: 'وضعية لوتس الطاقة العائمة والتحكم العصبي'
    },
    color: '#34D399'
  },
  {
    id: 'c4',
    title: {
      en: 'Shaolin Tactical Reflex Defense',
      es: 'Defensa Táctica de Reflejos Shaolin',
      fr: 'Défense Tactique & Réflexes Shaolin',
      ar: 'دفاع شاولين التكتيكي واستشعار الهالة'
    },
    difficulty: 'GOD-TIER',
    duration: '180s',
    reps: {
      en: 'Reaction Striking + 50 Explosive Switch Kicks',
      es: 'Golpeo Reactivo + 50 Patadas Alternas Explosivas',
      fr: 'Frappe Réactive + 50 Coups de Pied Sautés',
      ar: 'اختبار ردود الأفعال اللحظية + 50 ركلة شاولين متبادلة'
    },
    rewardAP: 600,
    rewardYardx: 350,
    stance: {
      en: 'Grandmaster Strategic Guard',
      es: 'Guardia Estratégica Gran Maestro',
      fr: 'Garde Stratégique Grand Maître',
      ar: 'وضعية الحراسة التكتيكية للماستر الأعلى'
    },
    color: '#D4AF37'
  }
];

export const LiveChallengesArena: React.FC<LiveChallengesArenaProps> = ({
  currentLang = 'en',
  onEnterArena
}) => {
  const t = (en: string, es: string, fr: string, ar: string) => tr(currentLang, { en, es, fr, ar });
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [activeFightersCount, setActiveFightersCount] = useState<number>(1429);
  const [livePot] = useState<number>(45800);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFightersCount((prev) => prev + (Math.random() > 0.4 ? 1 : -1));
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
      setChallengeIdx((prev) => (prev + 1) % RANDOM_CHALLENGES.length);
      rolls++;
      if (rolls >= maxRolls) {
        clearInterval(interval);
        setIsRolling(false);
        soundFX.playAuraBurst();
      }
    }, 90);
  };

  return (
    <section className="relative my-8 rounded-3xl overflow-hidden bg-[#080D0B] border border-emerald-500/25 shadow-[0_0_50px_rgba(16,185,129,0.14)]">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <img
          loading="lazy"
          decoding="async"
          src={LIVE_ARENA_CHALLENGES_IMAGE}
          alt="Live Tactical Combat Arena & Random Challenges"
          onError={handleImageError}
          className="w-full h-full object-cover object-center opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-[#050807]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050807] via-[#050807]/75 to-transparent" />
      </div>

      <div className="relative z-10 p-6 md:p-10">
        {/* Top Live Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0C1411] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black font-anime text-slate-400 uppercase tracking-wider">
                  LIVE COMBAT ARENA
                </span>
                <span className="flex items-center gap-1 text-[11px] font-black text-emerald-400 font-anime tabular-nums">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {activeFightersCount.toLocaleString('en-US')}{' '}
                  {t('Fighters Online', 'Luchadores en vivo', 'Combattants en direct', 'مقاتل متصل الآن')}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black font-anime text-white mt-1">
                {t(
                  'Live Arena Combat & Random Daily Trials 🔥',
                  'Combates en Vivo y Desafíos Aleatorios 🔥',
                  'Combats d’Arène & Défis Aléatoires 🔥',
                  'المنافسات الحية والتحديات العشوائية 🔥'
                )}
              </h2>
            </div>
          </div>

          {/* Tournament Bounty Pot */}
          <div className="flex items-center gap-4 bg-[#050807]/90 border border-[#D4AF37]/40 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.16)]">
            <Trophy className="w-7 h-7 text-[#D4AF37]" />
            <div>
              <span className="text-[10px] font-black text-slate-400 font-anime uppercase tracking-wider block">
                {t('TODAY GRAND BOUNTY POT', 'GRAN BOTE DEL DÍA', 'CAGNOTTE DU JOUR', 'جائزة بطولات اليوم الكبرى')}
              </span>
              <span className="text-xl md:text-2xl font-black font-anime text-[#D4AF37] tabular-nums">
                {livePot.toLocaleString('en-US')} <span className="text-xs text-white">YARDX</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 bg-[#050807]/95 border border-emerald-500/25 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl relative space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-xs font-black font-anime text-emerald-300">
                  {currentChallenge.difficulty}
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#0C1411] border border-white/[0.08] text-xs font-bold text-slate-300 font-anime flex items-center gap-1.5 tabular-nums">
                  <Timer className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {currentChallenge.duration}
                </span>
              </div>

              <button
                onClick={rollRandomChallenge}
                disabled={isRolling}
                className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-black font-black font-anime text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer disabled:opacity-50"
              >
                <Shuffle className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
                <span>
                  {t('Reroll Random Trial 🎲', 'Girar Desafío 🎲', 'Nouveau Défi 🎲', 'تحدي عشوائي جديد 🎲')}
                </span>
              </button>
            </div>

            <div className={`transition-all duration-300 ${isRolling ? 'opacity-30 scale-98' : 'opacity-100 scale-100'}`}>
              <span className="text-xs font-black font-anime text-[#D4AF37] uppercase tracking-wider block mb-1">
                🥋 {tr(currentLang, currentChallenge.stance)}
              </span>
              <h3 className="text-2xl md:text-3xl font-black font-anime text-white">
                {tr(currentLang, currentChallenge.title)}
              </h3>
              <p className="text-sm font-bold text-slate-200 mt-2 bg-[#0C1411] border border-white/[0.06] p-4 rounded-2xl">
                ⚡ <strong className="text-emerald-400">{t('Objective:', 'Objetivo:', 'Objectif :', 'المهمة المطلوبة:')}</strong>{' '}
                {tr(currentLang, currentChallenge.reps)}
              </p>
            </div>

            {/* Rewards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0C1411] border border-white/[0.06] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-slate-400 font-anime block">
                    {t('AURA POINTS (AP)', 'PUNTOS DE AURA (AP)', 'POINTS D’AURA (AP)', 'نقاط الهالة المكتسبة')}
                  </span>
                  <span className="text-2xl font-black font-anime text-[#10B981] tabular-nums">
                    +{currentChallenge.rewardAP}
                  </span>
                </div>
                <Sparkles className="w-6 h-6 text-[#10B981]" />
              </div>

              <div className="bg-[#0C1411] border border-white/[0.06] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-slate-400 font-anime block">
                    {t('YARDX TOKENS', 'TOKENS YARDX', 'JETONS YARDX', 'عملات يارد بلس')}
                  </span>
                  <span className="text-2xl font-black font-anime text-[#D4AF37] tabular-nums">
                    +{currentChallenge.rewardYardx}
                  </span>
                </div>
                <Zap className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>

            {onEnterArena && (
              <button
                onClick={() => {
                  soundFX.playButtonClick();
                  soundFX.playAuraBurst();
                  onEnterArena();
                }}
                className="w-full py-4 rounded-2xl bg-[#10B981] hover:bg-emerald-400 text-black font-black font-anime text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.45)] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>
                  {t('ENTER LIVE ARENA NOW ⚔️', 'ENTRAR A LA ARENA EN VIVO ⚔️', 'ENTRER DANS L’ARÈNE EN DIRECT ⚔️', 'دخول حلبة المنافسة الآن ⚔️')}
                </span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="p-4 rounded-2xl bg-[#050807]/90 border border-white/[0.08] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black font-anime text-[#D4AF37]">
                <Flame className="w-4 h-4 text-[#10B981]" />
                <span>
                  {t(
                    'Random Real-time Shadow Boxing',
                    'Shadow Boxing Aleatorio en Vivo',
                    'Shadow Boxing Aléatoire en Direct',
                    'نزالات ملاكمة تفاعلية عشوائية'
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                {t(
                  'Adaptive AI engine rolls sudden tactical challenges testing cardiovascular output, raw speed, and twitch reflexes.',
                  'Motor de IA que genera desafíos tácticos repentinos para romper la rutina y elevar la velocidad reactiva.',
                  'Moteur IA générant des défis imprévisibles pour stimuler la puissance explosive et briser la routine.',
                  'خوارزميات ذكاء اصطناعي تولد تحديات غير متوقعة لكسر روتين التمرين وتفعيل أعلى استجابة للألياف العضلية السريعة.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#050807]/90 border border-white/[0.08] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black font-anime text-emerald-400">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>
                  {t(
                    'YARDX Token Yield Multiplier',
                    'Multiplicador de Tokens YARDX',
                    'Multiplicateur de Récompenses YARDX',
                    'مضاعف مكافآت العملات YARDX'
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                {t(
                  'Sustained combo pacing accelerates your reward yield, minting YARDX tokens directly to your athlete profile.',
                  'A mayor cadencia y racha de combos continuos, mayor será la multiplicación de tus recompensas YARDX.',
                  'Plus ta cadence de frappe est élevée, plus ton multiplicateur de jetons YARDX augmente dans l’écosystème.',
                  'كلما زادت وتيرة الحركات واللكمات المتتالية، كلما تضاعفت نقاط الهالة ورصيد عملاتك الرقمية في المنصة.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#050807]/90 border border-white/[0.08] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black font-anime text-[#D4AF37]">
                <Crosshair className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {t(
                    'Global 24/7 Cyber Arena Matches',
                    'Torneos Mundiales 24/7',
                    'Tournois Mondiaux 24/7',
                    'تحديات السايبر للأبطال حول العالم'
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                {t(
                  'Compete against elite martial artists worldwide in real time and ascend the weekly hall of fame.',
                  'Compite contra atletas de todo el mundo en tiempo real y escala en la tabla de clasificación semanal.',
                  'Défie des athlètes du monde entier en temps réel et hisse-toi au sommet du classement mondial.',
                  'تنافس ضد أبطال من مختلف دول العالم لحظياً واصعد في لوحة الشرف الأسبوعية لتخليد اسمك.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#050807]/90 border border-white/[0.08] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black font-anime text-emerald-400">
                <Crosshair className="w-4 h-4 text-emerald-400" />
                <span>
                  {t(
                    'Precision Target Matrix & Calorie Surge',
                    'Matriz de Precisión y Quema Calórica',
                    'Matrice de Précision & Dépense Calorique',
                    'مستشعر دقة الأهداف وحرق السعرات'
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                {t(
                  'Live biometric tracking maps cardiac load, strike velocity, and synchronizes Aura Points directly to your combat streak.',
                  'El seguimiento biométrico en tiempo real mapea la carga cardíaca y sincroniza puntos Aura con tu racha de combate.',
                  'Le suivi biométrique en direct mesure la charge cardiaque et synchronise les points Aura avec votre série.',
                  'تتبع لحظي للنبض، الحمل الحركي، ودقة اللكمات مع مزامنة كاملة لنقاط الهالة (Aura Points) وسلسلة القتال.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
