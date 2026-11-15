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

interface RandomChallenge {
  id: string;
  title: { en: string; es: string; fr: string; ar: string };
  difficulty: 'S-RANK' | 'SS-RANK' | 'GOD-TIER';
  duration: string;
  reps: { en: string; es: string; fr: string; ar: string };
  rewardAP: number;
  rewardYardx: number;
  stance: { en: string; es: string; fr: string; ar: string };
  color: string;
}

const RANDOM_CHALLENGES: RandomChallenge[] = [
  {
    id: 'c1',
    title: {
      en: '100-Strike Dragon Barrage',
      es: 'Ráfaga de 100 Golpes del Dragón',
      fr: 'Barrage 100 Frappes du Dragon',
      ar: 'عاصفة الـ 100 لكمة لتنين شاولين'
    },
    difficulty: 'S-RANK',
    duration: '90s',
    reps: {
      en: '100 Rapid Combat Punches + 20 Jump Squats',
      es: '100 Golpes Rápidos de Combate + 20 Sentadillas con Salto',
      fr: '100 Frappes Rapides + 20 Squats Sautés',
      ar: '100 لكمة قتالية فائقة السرعة + 20 قفزة سكوات انفجارية'
    },
    rewardAP: 250,
    rewardYardx: 120,
    stance: {
      en: 'Fierce Dragon Fist Stance',
      es: 'Postura Puño del Dragón Feroz',
      fr: 'Posture Poing du Dragon Féroce',
      ar: 'وضعية قبضة التنين الهجومية'
    },
    color: '#D4AF37'
  },
  {
    id: 'c2',
    title: {
      en: 'Hyrox Shadow Sprint & Burpee Storm',
      es: 'Sprint Sombra Hyrox y Tormenta Burpee',
      fr: 'Sprint Hyrox & Tempête Burpee',
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
    color: '#10B981'
  },
  {
    id: 'c3',
    title: {
      en: 'Zenith Pilates Core Overdrive',
      es: 'Sobrecarga Central Zenith Pilates',
      fr: 'Surcharge Core Zenith Pilates',
      ar: 'شحن الطاقة الحركية ومرونة البيلاتس القاتلة'
    },
    difficulty: 'S-RANK',
    duration: '60s',
    reps: {
      en: '60s Hollow Body Rock + Isometric Ki Lock',
      es: '60s Hollow Body Rock + Bloqueo Isométrico Ki',
      fr: '60s Hollow Body Rock + Verrouillage Isométrique Ki',
      ar: '60 ثانية ثبات تجويف البطن + قفل الطاقة الحيوية كي'
    },
    rewardAP: 300,
    rewardYardx: 150,
    stance: {
      en: 'Floating Lotus Energy Core',
      es: 'Núcleo de Energía Loto Flotante',
      fr: 'Cœur d’Énergie Lotus Flottant',
      ar: 'وضعية لوتس الطاقة العائمة والتحكم العصبي'
    },
    color: '#38BDF8'
  },
  {
    id: 'c4',
    title: {
      en: 'Shaolin Tactical Defense Gauntlet',
      es: 'Defensa Táctica Shaolín 10 Estaciones',
      fr: 'Défense Tactique Shaolin',
      ar: 'دفاع شاولين التكتيكي واستشعار الهالة'
    },
    difficulty: 'GOD-TIER',
    duration: '180s',
    reps: {
      en: 'Reaction Striking + 50 Explosive Switch Kicks',
      es: 'Golpeo Reactivo + 50 Patadas Switch Explosivas',
      fr: 'Frappes Réactives + 50 Coups de Pied Switch Explosifs',
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
    color: '#A855F7'
  }
];

export const LiveChallengesArena: React.FC<LiveChallengesArenaProps> = ({
  currentLang = 'en',
  onEnterArena
}) => {
  const isAr = currentLang === 'ar';
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
    const maxRolls = 5;
    const interval = setInterval(() => {
      setChallengeIdx((prev) => (prev + 1) % RANDOM_CHALLENGES.length);
      rolls++;
      if (rolls >= maxRolls) {
        clearInterval(interval);
        setIsRolling(false);
        soundFX.playAuraBurst();
      }
    }, 85);
  };

  return (
    <section className={`relative my-4 rounded-2xl overflow-hidden bg-[#0C0E14] border border-white/[0.08] shadow-xl ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="absolute inset-0 z-0">
        <img
          loading="lazy"
          decoding="async"
          src={LIVE_ARENA_CHALLENGES_IMAGE}
          alt="Live Performance Arena & Daily Trials"
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080C] via-[#07080C]/80 to-transparent" />
      </div>

      <div className="relative z-10 p-4 sm:p-5 md:p-6">
        {/* Top Live Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#121622] border border-white/[0.08] flex items-center justify-center shrink-0">
              <Swords className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {tr(currentLang, {
                    en: 'LIVE PERFORMANCE ARENA',
                    es: 'ARENA DE RENDIMIENTO EN VIVO',
                    fr: 'ARÈNE DE PERFORMANCE EN DIRECT',
                    ar: 'حلبة الأداء الحية'
                  })}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#10B981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span className="tabular-nums">{activeFightersCount.toLocaleString('en-US')}</span>{' '}
                  {tr(currentLang, {
                    en: 'Athletes Active',
                    es: 'Atletas activos',
                    fr: 'Athlètes actifs',
                    ar: 'رياضي نشط'
                  })}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white mt-0.5">
                {tr(currentLang, {
                  en: 'Live Arena Combat & Daily Trials',
                  es: 'Arena en Vivo y Desafíos Diarios',
                  fr: 'Combats d’Arène & Défis Quotidiens',
                  ar: 'المنافسات الحية والتحديات اليومية'
                })}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#121622]/90 border border-[#D4AF37]/30 px-4 py-2 rounded-xl">
            <Trophy className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                {tr(currentLang, {
                  en: 'TODAY BOUNTY POT',
                  es: 'BOTE DEL DÍA',
                  fr: 'CAGNOTTE DU JOUR',
                  ar: 'مجموع جوائز اليوم'
                })}
              </span>
              <span className="text-base md:text-lg font-bold font-mono tabular-nums text-[#D4AF37]">
                {livePot.toLocaleString('en-US')} <span className="text-[10px] text-white">YARDX</span>
              </span>
            </div>
          </div>
        </div>

        {/* Compact Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left: Random Challenge HUD */}
          <div className="lg:col-span-7 bg-[#121422]/95 rounded-2xl p-4 sm:p-5 border border-white/[0.08] space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[10px] font-mono font-bold text-[#D4AF37]">
                  {currentChallenge.difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#0A0B10] border border-white/[0.08] text-[10px] font-mono font-bold text-slate-300 flex items-center gap-1 tabular-nums">
                  <Timer className="w-3 h-3 text-[#10B981]" />
                  {currentChallenge.duration}
                </span>
              </div>

              <button
                type="button"
                onClick={rollRandomChallenge}
                disabled={isRolling}
                className="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-black font-bold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>
                  {tr(currentLang, {
                    en: 'Reroll Random Trial',
                    es: 'Girar Desafío',
                    fr: 'Nouveau Défi',
                    ar: 'تحدي عشوائي جديد'
                  })}
                </span>
              </button>
            </div>

            <div className={`transition-opacity duration-200 ${isRolling ? 'opacity-40' : 'opacity-100'}`}>
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider block mb-0.5">
                {tr(currentLang, currentChallenge.stance)}
              </span>
              <h3 className="text-lg md:text-xl font-extrabold text-white">
                {tr(currentLang, currentChallenge.title)}
              </h3>
              <p className="text-xs font-medium text-slate-200 mt-1.5 bg-[#0A0B10] border border-white/[0.06] p-3 rounded-xl">
                <strong className="text-[#10B981]">
                  {tr(currentLang, {
                    en: 'Objective:',
                    es: 'Objetivo:',
                    fr: 'Objectif :',
                    ar: 'المهمة المطلوبة:'
                  })}
                </strong>{' '}
                {tr(currentLang, currentChallenge.reps)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0A0B10] border border-white/[0.06] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 block">
                    {tr(currentLang, {
                      en: 'AURA POINTS (AP)',
                      es: 'PUNTOS DE AURA (AP)',
                      fr: 'POINTS D’AURA (AP)',
                      ar: 'نقاط الهالة المكتسبة'
                    })}
                  </span>
                  <span className="text-lg font-bold font-mono tabular-nums text-[#10B981]">
                    +{currentChallenge.rewardAP}
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-[#10B981]" />
              </div>

              <div className="bg-[#0A0B10] border border-white/[0.06] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 block">
                    {tr(currentLang, {
                      en: 'YARDX TOKENS',
                      es: 'TOKENS YARDX',
                      fr: 'JETONS YARDX',
                      ar: 'عملات يارد بلس'
                    })}
                  </span>
                  <span className="text-lg font-bold font-mono tabular-nums text-[#D4AF37]">
                    +{currentChallenge.rewardYardx}
                  </span>
                </div>
                <Zap className="w-4 h-4 text-[#D4AF37]" />
              </div>
            </div>

            {onEnterArena && (
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  soundFX.playAuraBurst();
                  onEnterArena();
                }}
                className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {tr(currentLang, {
                    en: 'ENTER LIVE ARENA NOW',
                    es: 'ENTRAR A LA ARENA EN VIVO',
                    fr: 'ENTRER DANS L’ARÈNE EN DIRECT',
                    ar: 'دخول حلبة المنافسة الآن'
                  })}
                </span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            )}
          </div>

          {/* Right: Compact 4 Feature Cards Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            <div className="p-3 rounded-xl bg-[#141622]/90 border border-white/[0.07] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                <Flame className="w-3.5 h-3.5 text-[#10B981]" />
                <span>
                  {tr(currentLang, {
                    en: 'Random Real-time Shadow Boxing',
                    es: 'Shadow Boxing Aleatorio en Vivo',
                    fr: 'Shadow Boxing Aléatoire en Direct',
                    ar: 'نزالات ملاكمة تفاعلية عشوائية'
                  })}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tr(currentLang, {
                  en: 'Adaptive AI rolls tactical drills testing cardiovascular output and twitch reflexes.',
                  es: 'Motor de IA que genera desafíos tácticos repentinos para elevar tu velocidad reactiva.',
                  fr: 'Moteur IA générant des défis imprévisibles pour stimuler la puissance explosive.',
                  ar: 'خوارزميات ذكاء اصطناعي تولد تحديات غير متوقعة لتفعيل استجابة الألياف السريعة.'
                })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#141622]/90 border border-white/[0.07] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#10B981]">
                <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                <span>
                  {tr(currentLang, {
                    en: 'YARDX Token Yield Multiplier',
                    es: 'Multiplicador de Tokens YARDX',
                    fr: 'Multiplicateur de Récompenses YARDX',
                    ar: 'مضاعف مكافآت العملات YARDX'
                  })}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tr(currentLang, {
                  en: 'Sustained combo pacing accelerates reward yield directly to your athlete profile.',
                  es: 'A mayor cadencia de combos continuos, mayor será la multiplicación de tus recompensas.',
                  fr: 'Plus ta cadence de frappe est élevée, plus ton multiplicateur de jetons augmente.',
                  ar: 'كلما زادت وتيرة اللكمات المتتالية تضاعفت نقاط الهالة ورصيد عملاتك الرقمية.'
                })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#141622]/90 border border-white/[0.07] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                <Crosshair className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {tr(currentLang, {
                    en: 'Global 24/7 Cyber Arena Matches',
                    es: 'Torneos Mundiales 24/7',
                    fr: 'Tournois Mondiaux 24/7',
                    ar: 'تحديات السايبر للأبطال حول العالم'
                  })}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tr(currentLang, {
                  en: 'Compete against martial artists worldwide in real time and ascend the hall of fame.',
                  es: 'Compite contra atletas de todo el mundo en tiempo real y escala en la clasificación.',
                  fr: 'Défie des athlètes du monde entier en temps réel et hisse-toi au sommet du classement.',
                  ar: 'تنافس ضد أبطال من مختلف دول العالم لحظياً واصعد في لوحة الشرف الأسبوعية.'
                })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#141622]/90 border border-white/[0.07] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8]">
                <Crosshair className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>
                  {tr(currentLang, {
                    en: 'Precision Target Matrix & Calorie Surge',
                    es: 'Matriz de Precisión y Quema Calórica',
                    fr: 'Matrice de Précision & Dépense Calorique',
                    ar: 'مستشعر دقة الأهداف وحرق السعرات'
                  })}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tr(currentLang, {
                  en: 'Live biometrics map cardiac load, strike velocity, and sync Aura Points automatically.',
                  es: 'La biometría en vivo mide carga cardíaca y velocidad, sincronizando Aura Points al instante.',
                  fr: 'La biométrie mesure la charge cardiaque et synchronise les Points d’Aura en direct.',
                  ar: 'تتبع لحظي للنبض والحمل الحركي ودقة اللكمات مع مزامنة كاملة لنقاط الهالة.'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
