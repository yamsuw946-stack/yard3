import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Sparkles, Bot, Zap, Flame, ShieldAlert, Award, RefreshCw, Send, CheckCircle, Volume2, VolumeX, MessageSquare, Heart, Dumbbell, Activity, Trophy, Moon, Clock, Bell, BellOff, Sliders, Play, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { Language } from '../i18n';
import { AI_COACH_IMAGE, HERO_IMAGE, handleImageError } from '../constants';
import { getCoachAdviceFromGemini, sendMessageToGemini, CoachProgressContext } from '../services/geminiService';
import { soundFX } from '../services/soundFX';

interface ChatMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  time: string;
}

interface AIAnimeCoachProps {
  currentLang?: Language;
}

export const AIAnimeCoach: React.FC<AIAnimeCoachProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';

  // 1. Progress State (Synced with YardCombatEngine defaults or local storage)
  const [metrics, setMetrics] = useState({
    acuteLoad: 1175,
    chronicLoad: 950,
    hrv: 68,
    rhr: 52,
    sleepScore: 82,
    comboHits: 48,
    powerLevel: 8900,
    streakDays: 14
  });

  // Persona State
  const [persona, setPersona] = useState<'hype' | 'zen' | 'speed'>('hype');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Automated Sleep Wind-down Notification State
  const [autoNotifyEnabled, setAutoNotifyEnabled] = useState<boolean>(() => {
    return localStorage.getItem('yard300_auto_sleep_notify') !== 'false';
  });
  const [intensityOverride, setIntensityOverride] = useState<number | null>(null);
  const [showNotificationToast, setShowNotificationToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; body: string; time: string } | null>(null);
  const [isWindDownActive, setIsWindDownActive] = useState<boolean>(false);
  const [windDownProgress, setWindDownProgress] = useState<number>(0);

  // AI Advice State
  const [adviceText, setAdviceText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Daily Missions State
  const [missions, setMissions] = useState([
    { id: 1, titleIsAr: 'إكمال جولة قتال 3 دقائق في محرك YARD300', titleEn: 'Complete 3-min YARD300 Combat Workout', completed: true, reward: '+50 YARDX' },
    { id: 2, titleIsAr: 'الوصول إلى 50 لكمة متتالية (Combo)', titleEn: 'Reach 50 Combo Hits in Combat Mode', completed: false, reward: '+30 YARDX' },
    { id: 3, titleIsAr: 'شرب 3 لتر ماء مع زجاجة Hydro Aura', titleEn: 'Drink 3L Hydration with Hydro Aura', completed: true, reward: '+20 YARDX' },
    { id: 4, titleIsAr: 'تسجيل 8 ساعات نوم واستعادة معدل HRV', titleEn: 'Log 8 Hours Sleep & Restore HRV', completed: false, reward: '+40 YARDX' },
  ]);

  // Audio Synth FX
  const playPowerUpSound = () => {
    if (!soundEnabled) return;
    soundFX.playButtonClick();
  };

  // Automated Wind-down calculation engine based on recorded training load
  const activeLoad = intensityOverride ?? metrics.acuteLoad;

  const calculateWindDown = (load: number) => {
    if (load >= 1300) {
      return {
        intensityLevel: 'EXTREME S-RANK',
        intensityColor: 'text-[#FF007A]',
        intensityBg: 'bg-[#FF007A]/15 border-[#FF007A]',
        windDownTime: '21:15', // 9:15 PM
        sleepTarget: '22:30', // 10:30 PM
        durationMinutes: 75,
        cnsStatusAr: 'تنبيه: إجهاد عصبي وقوة هالة فائقة! يتطلب الجسد 75 دقيقة تهيئة قبل النوم لخفض الكورتيزول واستعادة HRV.',
        cnsStatusEn: 'CRITICAL: Ultra High CNS arousal detected! Body requires 75 min wind-down to lower cortisol & reset HRV.',
        protocolAr: [
          'تعتيم الإضاءة بنسبة 80% وإطفاء الشاشات الزرقاء',
          'شرب إلكتروليتات بوعاء Hydro Aura لاستعادة السوائل',
          '15 دقيقة إطالات استرخائية وتنفس زين بطيء (4-7-8)'
        ],
        protocolEn: [
          'Dim lighting by 80% & disable blue-light screens',
          'Replenish electrolytes with Hydro Aura water bottle',
          '15-min light static stretching & Zen 4-7-8 breathing'
        ]
      };
    } else if (load >= 1000) {
      return {
        intensityLevel: 'HIGH INTENSITY',
        intensityColor: 'text-[#FFE600]',
        intensityBg: 'bg-[#FFE600]/15 border-[#FFE600]',
        windDownTime: '21:45', // 9:45 PM
        sleepTarget: '22:45', // 10:45 PM
        durationMinutes: 60,
        cnsStatusAr: 'تحذير: شدة تدريب عالية اليوم. يوصى ببدء التهيئة الساعة 9:45 مساءً للحصول على 8 ساعات نوم عميق.',
        cnsStatusEn: 'ADVISORY: High workout intensity logged. Begin wind-down at 9:45 PM for 8 hours optimal REM recovery.',
        protocolAr: [
          'استخدام الإضاءة الدافئة الخافتة بدلاً من القوية',
          'تناول وجبة استشفاء خفيفة بها مغنيسيوم وتفاح',
          '10 دقائق تنفس بطني هادئ لتهدئة ضربات القلب'
        ],
        protocolEn: [
          'Switch to ambient amber warm lighting',
          'Light post-workout recovery snack with magnesium',
          '10-min diaphragmatic breathing to stabilize RHR'
        ]
      };
    } else {
      return {
        intensityLevel: 'MODERATE / RECOVERY',
        intensityColor: 'text-[#00F0FF]',
        intensityBg: 'bg-[#00F0FF]/15 border-[#00F0FF]',
        windDownTime: '22:15', // 10:15 PM
        sleepTarget: '23:00', // 11:00 PM
        durationMinutes: 45,
        cnsStatusAr: 'شدة تدريب خفيفة إلى معتدلة. تهيئة قياسية لمدة 45 دقيقة تضمن لك استرخاء العضلات والصفاء الذهني.',
        cnsStatusEn: 'Moderate training load logged. Standard 45-min wind-down window to ensure complete muscle relaxation.',
        protocolAr: [
          'مراجعة الإنجازات اليومية في محرك YARD300',
          'شرب كوب ماء دافئ أو مشروب هادئ',
          'جلسة استرخاء ذهني قصيرة وتجهيز عتاد الغد'
        ],
        protocolEn: [
          'Review daily progress in YARD300 engine',
          'Warm hydration and soothing ambiance',
          'Short mental meditation and gear prep for tomorrow'
        ]
      };
    }
  };

  const currentWindDown = useMemo(() => calculateWindDown(activeLoad), [activeLoad]);

  // Trigger automated notification whenever training load updates or user requests alert
  const triggerAutomatedNotification = (manual: boolean = false) => {
    if (!autoNotifyEnabled && !manual) return;

    soundFX.playStartTrainingSound();

    const title = isAr
      ? `⏰ تنبيه كابتن أورا: وقت التهيئة للنوم (${currentWindDown.windDownTime})`
      : `⏰ Captain Aura Alert: Optimal Sleep Wind-Down (${currentWindDown.windDownTime})`;

    const body = isAr
      ? `تم تسجيل شدة تدريب (${activeLoad} AU). ابدأ بروتوكول التهيئة الآن لضمان 8 ساعات استشفاء عضلاتي وحصاد XP!`
      : `Logged Training Intensity (${activeLoad} AU). Start your ${currentWindDown.durationMinutes}-min wind-down now for full recovery!`;

    setToastMessage({ title, body, time: currentWindDown.windDownTime });
    setShowNotificationToast(true);

    // Try Web Browser native Notification if available and permitted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, { body, icon: AI_COACH_IMAGE });
        } catch {
          // Fallback to in-app toast
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };

  // Toggle Auto Notify
  const handleToggleAutoNotify = () => {
    const nextVal = !autoNotifyEnabled;
    setAutoNotifyEnabled(nextVal);
    localStorage.setItem('yard300_auto_sleep_notify', String(nextVal));
    soundFX.playToggle(nextVal);
    if (nextVal) {
      triggerAutomatedNotification(true);
    }
  };

  // Wind down timer simulation effect
  useEffect(() => {
    let interval: any;
    if (isWindDownActive) {
      interval = setInterval(() => {
        setWindDownProgress(prev => {
          if (prev >= 100) {
            setIsWindDownActive(false);
            return 0;
          }
          return prev + 5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isWindDownActive]);

  // Local component-level memoization cache for rapid question queries
  const localQueryCache = useRef<Map<string, string>>(new Map());

  // Memoized calculations to prevent redundant re-computations
  const acwr = useMemo(() => (metrics.acuteLoad / Math.max(1, metrics.chronicLoad)).toFixed(2), [metrics.acuteLoad, metrics.chronicLoad]);

  // Memoized fetchAdvice handler
  const fetchAdvice = useCallback(async (promptMsg?: string) => {
    setIsLoading(true);
    playPowerUpSound();

    const cacheKey = `briefing_${persona}_${currentLang}_${Math.round(metrics.acuteLoad / 50)}_${promptMsg || 'none'}`;
    if (localQueryCache.current.has(cacheKey)) {
      setAdviceText(localQueryCache.current.get(cacheKey)!);
      setIsLoading(false);
      return;
    }

    const context: CoachProgressContext = {
      ...metrics,
      persona,
      currentLang,
      userPrompt: promptMsg
    };

    const response = await getCoachAdviceFromGemini(context);
    localQueryCache.current.set(cacheKey, response);
    setAdviceText(response);
    setIsLoading(false);
  }, [metrics, persona, currentLang, soundEnabled]);

  // Memoized Ask Question Response Handler
  const handleAskQuestion = useCallback(async (userQuery: string) => {
    if (!userQuery.trim() || isLoading) return;
    const query = userQuery.trim();
    setCustomQuestion('');
    playPowerUpSound();

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setIsLoading(true);

    const queryCacheKey = `${currentLang}_${query.toLowerCase()}`;
    if (localQueryCache.current.has(queryCacheKey)) {
      const cachedReply = localQueryCache.current.get(queryCacheKey)!;
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: cachedReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, replyMsg]);
      soundFX.playSuccess();
      setIsLoading(false);
      return;
    }

    try {
      const history = chatMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const reply = await sendMessageToGemini(history, query, currentLang);
      localQueryCache.current.set(queryCacheKey, reply);

      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, replyMsg]);
      soundFX.playSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [chatMessages, currentLang, isLoading, soundEnabled]);

  // Load initial advice on mount or persona change
  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  // Toggle mission
  const toggleMission = (id: number) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
    playPowerUpSound();
  };

  // Quick Prompt Pills memoized to eliminate rebuilds on every render
  const quickPrompts = useMemo(() => {
    if (isAr) {
      return [
        { label: '🔥 كيف أرفع طاقة الهالة اليوم؟', text: 'كيف أرفع طاقة الهالة اليوم لأعلى مستوى في التمرين؟' },
        { label: '🧘 معدل HRV منخفض، ماذا أفعل؟', text: 'معدل HRV لدي منخفض اليوم، ما هو بروتوكول الاستشفاء المناسب؟' },
        { label: '⚡ كيف أطور ميكانيكا وسرعة اللكمات؟', text: 'كيف أطور السلسلة الحركية وسرعة اللكمات ودوران الحوض في الملاكمة؟' },
        { label: '🍎 ما هي الوجبة الرياضية المثالية قبل التمرين؟', text: 'ما هي الوجبة الرياضية المثالية ونسبة البروتين للوصول لرتبة S-Rank؟' },
        { label: '🌍 حدثني عن معسكر YARD 300 وفريق المغامرة', text: 'حدثني عن معسكر YARD 300 الدولي وفلسفة المؤسسين الثلاثة وفريق التدريب.' }
      ];
    }
    if (isFr) {
      return [
        { label: "🔥 Maximiser ma puissance aujourd'hui ?", text: "Comment maximiser ma puissance et mon endurance à l'entraînement aujourd'hui ?" },
        { label: '🧘 VRC bas, quel protocole ?', text: "Mon VRC/HRV est bas aujourd'hui, quel protocole de récupération dois-je suivre ?" },
        { label: '⚡ Perfectionner la chaîne de frappe ?', text: 'Comment perfectionner ma rotation de hanche et vitesse de frappe en boxe ?' },
        { label: '🍎 Nutrition idéale pré-entraînement ?', text: "Quelle est la répartition idéale en glucides et protéines avant l'entraînement ?" },
        { label: '🌍 Détails du Camp Mondial YARD 300 ?', text: 'Quels sont les détails du camp mondial YARD 300 et son encadrement ?' }
      ];
    }
    if (isEs) {
      return [
        { label: '🔥 ¿Cómo maximizar mi potencia hoy?', text: '¿Cómo puedo maximizar mi potencia y resistencia para el entrenamiento de hoy?' },
        { label: '🧘 VRC bajo, ¿qué protocolo aplicar?', text: 'Mi variabilidad cardíaca HRV está baja hoy, ¿cuál es el protocolo ideal de recuperación?' },
        { label: '⚡ ¿Cadena cinética de golpeo óptima?', text: '¿Cómo puedo mejorar la rotación de cadera y la velocidad de mis golpes en boxeo?' },
        { label: '🍎 ¿Nutrición previa al combate?', text: '¿Cuál es la combinación óptima de carbohidratos y proteínas antes de entrenar?' },
        { label: '🌍 ¿Detalles del Campamento YARD 300?', text: '¿Cuáles son los detalles del campamento global YARD 300 y su supervisión?' }
      ];
    }
    return [
      { label: '🔥 Maximize Aura Power today?', text: "How do I maximize my combat aura power and output in today's training?" },
      { label: '🧘 Low HRV, recovery protocol?', text: 'My HRV is low today, what is the best recovery protocol to restore CNS balance?' },
      { label: '⚡ Master striking kinetic chain?', text: 'How can I optimize ground force transfer and hip rotation for explosive boxing speed?' },
      { label: '🍎 Optimal pre-workout nutrition?', text: 'What is the optimal macronutrient timing and protein intake for peak performance?' },
      { label: '🌍 YARD 300 Global Camp details?', text: 'What are the details, standards, and leadership behind the YARD 300 Global Camp?' }
    ];
  }, [isAr, isFr, isEs]);

  return (
    <section id="ai-coach" className={`py-12 sm:py-16 md:py-20 px-3 sm:px-6 md:px-12 bg-[#0A0B10] relative overflow-hidden overflow-x-hidden w-full max-w-full ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Background Cyber Glow */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#FF007A]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1800px] w-full max-w-full overflow-x-hidden mx-auto">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1128] border border-[#FF007A] text-xs font-black text-[#FF007A] uppercase tracking-widest mb-3">
              <Bot className="w-4 h-4 text-[#FFE600] animate-pulse" />
              <span>{isAr ? 'المدرب الشخصي بالذكاء الاصطناعي S-RANK' : isFr ? 'COACH PERSONNEL IA S-RANK' : isEs ? 'ENTRENADOR PERSONAL IA S-RANK' : 'AI ANIME COACH S-RANK'}</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black font-anime text-white">
              {isAr ? (
                <>
                  كابتن أورا <span className="text-[#FFE600]">توجيه وحماس يومي مخصص</span>
                </>
              ) : isFr ? (
                <>
                  CAPTAIN AURA <span className="text-[#FFE600]">BRIEFING STRATÉGIQUE PERSONNALISÉ</span>
                </>
              ) : isEs ? (
                <>
                  CAPTAIN AURA <span className="text-[#FFE600]">ORIENTACIÓN ESTRATÉGICA DIARIA</span>
                </>
              ) : (
                <>
                  CAPTAIN AURA <span className="text-[#FFE600]">PERSONALIZED DAILY BRIEFING</span>
                </>
              )}
            </h2>
            <p className="text-gray-300 font-bold text-sm md:text-base mt-2">
              {isAr 
                ? 'تحليل مباشر لبياناتك الحيوية من محرك YARD300 وإعطاؤك توجيهات الشونين اليومية لتجاوز حدودك البدنية.'
                : 'Real-time biometric analysis from YARD300 engine providing tailored shonen training & recovery guidance.'}
            </p>
          </div>

          {/* Persona Selector Buttons */}
          <div className="flex items-center gap-2 bg-[#121422] p-2 rounded-2xl border border-gray-800">
            <button
              onClick={() => setPersona('hype')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                persona === 'hype' 
                  ? 'bg-gradient-to-r from-emerald-500 to-[#FFE600] text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-[#FFE600]" />
              <span>{isAr ? '🔥 الحماس الشديد' : isFr ? '🔥 Motivation Pure' : isEs ? '🔥 Motivación Total' : '🔥 All-Out Hype'}</span>
            </button>

            <button
              onClick={() => setPersona('zen')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                persona === 'zen' 
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#7000FF] text-[#0A0B10] shadow-[0_0_20px_#00F0FF]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-black" />
              <span>{isAr ? '🧘 حكيم الاستشفاء' : isFr ? '🧘 Maître Récupération' : isEs ? '🧘 Sabio de Recuperación' : '🧘 Zen Recovery'}</span>
            </button>

            <button
              onClick={() => setPersona('speed')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                persona === 'speed' 
                  ? 'bg-gradient-to-r from-[#FFE600] to-[#FF007A] text-[#0A0B10] shadow-[0_0_20px_#FFE600]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-black" />
              <span>{isAr ? '⚡ بطل السرعة' : isFr ? '⚡ Vitesse Éclair' : isEs ? '⚡ Demonio de Velocidad' : '⚡ Speed Demon'}</span>
            </button>

            {/* Sound Toggle */}
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className="p-2.5 rounded-xl bg-[#1A1C2C] text-gray-300 hover:text-white border border-gray-700"
              title={soundEnabled ? 'Disable Audio' : 'Enable Audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00F0FF]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-full">
          
          {/* Left / Top Column: Live Biometric Stats Dashboard & Sleep Wind-Down & Daily Missions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Yard Metrics Card */}
            <div className="bg-[#121422] border-2 border-[#FF007A]/50 p-6 rounded-3xl shadow-xl space-y-5 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#00F0FF]" />
                  <h3 className="font-black font-anime text-white text-lg">
                    {isAr ? 'مؤشرات YARD300 الحيوية' : isFr ? 'BIOMÉTRIE YARD300 EN DIRECT' : isEs ? 'BIOMETRÍA YARD300 EN VIVO' : 'YARD300 BIOMETRICS'}
                  </h3>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 bg-[#1E2135] text-[#FFE600] rounded-full border border-[#FFE600]/40">
                  LIVE TRACKING
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#181A2A] p-3 rounded-2xl border border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 block">{isAr ? 'طاقة الهالة القصوى' : isFr ? 'AURA MAXIMALE' : isEs ? 'AURA MÁXIMA' : 'PEAK AURA'}</span>
                  <span className="text-xl font-black font-anime text-[#FFE600]">{metrics.powerLevel} AU</span>
                </div>

                <div className="bg-[#181A2A] p-3 rounded-2xl border border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 block">{isAr ? 'نسبة الإجهاد ACWR' : 'ACWR LOAD'}</span>
                  <span className="text-xl font-black font-anime text-[#00F0FF]">{acwr}</span>
                </div>

                <div className="bg-[#181A2A] p-3 rounded-2xl border border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 block">{isAr ? 'استعادة HRV' : 'HRV RECOVERY'}</span>
                  <span className="text-xl font-black font-anime text-[#FF007A]">{metrics.hrv} ms</span>
                </div>

                <div className="bg-[#181A2A] p-3 rounded-2xl border border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 block">{isAr ? 'لكمات المتتالية Combo' : 'MAX COMBO'}</span>
                  <span className="text-xl font-black font-anime text-white">{metrics.comboHits} 🥊</span>
                </div>
              </div>

              {/* Training Streak Bar */}
              <div className="bg-[#181A2A] p-4 rounded-2xl border border-[#FFE600]/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-[#FFE600] animate-bounce" />
                  <div>
                    <span className="text-xs font-black text-white block">{isAr ? 'سلسلة التدريب المتواصل' : 'ACTIVE STREAK'}</span>
                    <span className="text-xs font-bold text-gray-400">{metrics.streakDays} {isAr ? 'أيام متتالية' : 'Days Strong'}</span>
                  </div>
                </div>
                <span className="text-lg font-black font-anime text-[#FFE600]">+1400 XP</span>
              </div>
            </div>

            {/* AUTOMATED SLEEP & WIND-DOWN ADVISORY CARD */}
            <div className="bg-[#121422] border-2 border-[#7000FF]/60 p-6 rounded-3xl shadow-[0_0_25px_rgba(112,0,255,0.25)] space-y-5 relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-[#FFE600] animate-pulse" />
                  <h3 className="font-black font-anime text-white text-base">
                    {isAr ? 'توصيات التهيئة التلقائية للنوم' : 'AUTO SLEEP WIND-DOWN'}
                  </h3>
                </div>

                {/* Auto Notifications Toggle Switch */}
                <button
                  onClick={handleToggleAutoNotify}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer border ${
                    autoNotifyEnabled
                      ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}
                  title={autoNotifyEnabled ? 'Auto-Notifications ON' : 'Auto-Notifications OFF'}
                >
                  {autoNotifyEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                  <span>{autoNotifyEnabled ? (isAr ? 'التنبيه التلقائي مفعل' : 'AUTO NOTIFY ON') : (isAr ? 'التنبيه معطل' : 'NOTIFY OFF')}</span>
                </button>
              </div>

              {/* Dynamic Wind-Down Banner */}
              <div className={`p-4 rounded-2xl border ${currentWindDown.intensityBg} space-y-3`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FFE600]" />
                    <span className="text-xs font-black text-white font-anime uppercase">
                      {isAr ? 'موعد التهيئة الموصى به:' : 'RECOMMENDED WIND-DOWN:'}
                    </span>
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded ${currentWindDown.intensityColor} border border-current`}>
                    {currentWindDown.intensityLevel}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-3xl font-black font-anime text-[#FFE600] tracking-wider block">
                      {currentWindDown.windDownTime}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300">
                      {isAr ? `مدة التهيئة: ${currentWindDown.durationMinutes} دقيقة` : `${currentWindDown.durationMinutes} min wind-down phase`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-400 block">{isAr ? 'وقت النوم المستهدف:' : 'Sleep Target:'}</span>
                    <span className="text-lg font-black font-anime text-[#00F0FF]">{currentWindDown.sleepTarget}</span>
                  </div>
                </div>

                <p className="text-xs font-bold text-gray-200 leading-relaxed pt-2 border-t border-white/10">
                  {isAr ? currentWindDown.cnsStatusAr : currentWindDown.cnsStatusEn}
                </p>
              </div>

              {/* Training Load Simulator / Override Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  {isAr ? 'محاكاة شدة التمرين لتعديل وقت التهيئة:' : 'TEST TRAINING INTENSITY LOAD:'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setIntensityOverride(750);
                      soundFX.playButtonClick();
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all ${
                      activeLoad === 750
                        ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]'
                        : 'bg-[#181A2A] text-gray-400 border-gray-800 hover:text-white'
                    }`}
                  >
                    {isAr ? 'خفيف (750 AU)' : 'Light (750 AU)'}
                  </button>

                  <button
                    onClick={() => {
                      setIntensityOverride(1175);
                      soundFX.playButtonClick();
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all ${
                      activeLoad === 1175
                        ? 'bg-[#FFE600]/20 text-[#FFE600] border-[#FFE600]'
                        : 'bg-[#181A2A] text-gray-400 border-gray-800 hover:text-white'
                    }`}
                  >
                    {isAr ? 'مسجّل (1175 AU)' : 'Logged (1175 AU)'}
                  </button>

                  <button
                    onClick={() => {
                      setIntensityOverride(1450);
                      soundFX.playButtonClick();
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all ${
                      activeLoad === 1450
                        ? 'bg-[#FF007A]/20 text-[#FF007A] border-[#FF007A]'
                        : 'bg-[#181A2A] text-gray-400 border-gray-800 hover:text-white'
                    }`}
                  >
                    {isAr ? 'خارق (1450 AU)' : 'Extreme (1450 AU)'}
                  </button>
                </div>
              </div>

              {/* Step-by-Step Wind-down Protocol checklist */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-black text-[#FFE600] uppercase tracking-wider block">
                  {isAr ? 'بروتوكول التهيئة للنوم اليومي:' : 'DAILY WIND-DOWN CHECKLIST:'}
                </span>
                <div className="space-y-1.5">
                  {(isAr ? currentWindDown.protocolAr : currentWindDown.protocolEn).map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trigger Notification & Wind-down Mode Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => triggerAutomatedNotification(true)}
                  className="px-3 py-2.5 rounded-xl bg-[#181A2A] hover:bg-[#20243C] border border-[#FFE600]/60 text-[#FFE600] font-black text-xs font-anime flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تأكيد التنبيه 🔔' : 'TEST ALERT 🔔'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsWindDownActive(true);
                    setWindDownProgress(0);
                    soundFX.playStartTrainingSound();
                  }}
                  className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#7000FF] to-[#00F0FF] text-white font-black text-xs font-anime flex items-center justify-center gap-1.5 shadow-[0_0_15px_#00F0FF] transition-all cursor-pointer"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>{isAr ? 'بدء التهيئة 🌙' : 'START NOW 🌙'}</span>
                </button>
              </div>

            </div>

            {/* Daily Missions Card */}
            <div className="bg-[#121422] border border-gray-800 p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <Award className="w-5 h-5 text-[#FFE600]" />
                <h3 className="font-black font-anime text-white text-lg">
                  {isAr ? 'مهام البطل اليومية' : 'DAILY WARRIOR MISSIONS'}
                </h3>
              </div>

              <div className="space-y-3">
                {missions.map(m => (
                  <div 
                    key={m.id}
                    onClick={() => toggleMission(m.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      m.completed 
                        ? 'bg-[#182622] border-[#22C55E]/50 text-gray-200' 
                        : 'bg-[#181A2A] border-gray-800 hover:border-[#00F0FF] text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${m.completed ? 'text-[#22C55E]' : 'text-gray-600'}`} />
                      <span className={`text-xs font-bold ${m.completed ? 'line-through text-gray-400' : ''}`}>
                        {isAr ? m.titleIsAr : m.titleEn}
                      </span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#0A0B10] text-[#FFE600]">
                      {m.reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right / Main Column: AI Coach Interactive Dialogue Box */}
          <div className="lg:col-span-8 bg-[#121422] border-2 border-[#00F0FF]/40 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,240,255,0.2)] flex flex-col justify-between space-y-6 relative overflow-hidden">
            
            {/* Top Coach Header Avatar & Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,0,122,0.4)] relative bg-[#181A2A]">
                  <img loading="lazy" decoding="async" 
                    src={AI_COACH_IMAGE} 
                    alt="Captain Aura AI Coach" 
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-1 right-1 text-[9px] font-black bg-[#FF007A] text-white px-1.5 py-0.2 rounded">
                    S-RANK
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black font-anime text-white flex items-center gap-2">
                    <span>{isAr ? 'كابتن أورا (Captain Aura AI)' : 'Captain Aura AI'}</span>
                    <Sparkles className="w-5 h-5 text-[#FFE600] animate-spin" />
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[10px] font-black text-[#00F0FF] font-anime">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse"></span>
                      <span>{isAr ? '⚡ متصل بمحرك Google Gemini AI' : '⚡ POWERED BY GOOGLE GEMINI'}</span>
                    </span>
                    <span className="text-xs font-bold text-gray-300">
                      {persona === 'hype' && (isAr ? '🔥 وضع الشونين' : '🔥 Hype Mode')}
                      {persona === 'zen' && (isAr ? '🧘 وضع الاستشفاء' : '🧘 Zen Mode')}
                      {persona === 'speed' && (isAr ? '⚡ وضع السرعة' : '⚡ Speed Mode')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Generate Advice & Clear Chat */}
              <div className="flex items-center gap-2">
                {chatMessages.length > 0 && (
                  <button 
                    onClick={() => setChatMessages([])}
                    className="px-3 py-2.5 rounded-xl bg-[#1A1C2C] hover:bg-gray-800 border border-gray-700 text-gray-400 hover:text-white text-xs font-bold transition-all"
                  >
                    {isAr ? 'مسح المحادثة' : 'Clear Chat'}
                  </button>
                )}
                <button 
                  onClick={() => fetchAdvice()}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#A855F7] hover:brightness-110 text-white font-black text-xs font-anime flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isAr ? 'توجيهات جديدة ⚡' : 'NEW BRIEFING ⚡'}</span>
                </button>
              </div>

            </div>

            {/* AI Response & Chat Dialogue Box */}
            <div className="bg-[#0E0F1A] border border-gray-800 p-6 rounded-2xl min-h-[260px] max-h-[460px] overflow-y-auto flex flex-col justify-between space-y-4 shadow-inner relative">
              
              <div className="absolute top-3 right-3 text-2xl opacity-10 font-anime text-[#00F0FF]">
                GEMINI // AI
              </div>

              {chatMessages.length === 0 ? (
                /* Initial Daily Briefing State */
                isLoading ? (
                  <div className="space-y-4 py-2 w-full animate-pulse">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-800/80">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-[#00F0FF]/30 animate-pulse" />
                        <div className="h-4 w-44 rounded-md bg-gradient-to-r from-[#00F0FF]/30 via-[#FFE600]/30 to-[#FF007A]/30" />
                      </div>
                      <div className="h-4 w-28 rounded-full bg-[#1F2438]" />
                    </div>

                    {/* Neural telemetry scanning simulation */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141626] border border-[#00F0FF]/40 text-xs font-mono text-[#00F0FF]">
                      <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                      <span>{isAr ? 'جاري الاتصال السريع بمحرك Gemini وتحليل الحمل الحركي...' : 'TELEMETRY STREAM ACTIVE // CALIBRATING S-RANK DIRECTIVE...'}</span>
                    </div>

                    {/* Shimmer skeleton bars */}
                    <div className="space-y-3 pt-2">
                      <div className="h-4 bg-gradient-to-r from-[#181D30] via-[#2A3150] to-[#181D30] rounded-md w-11/12 animate-pulse" />
                      <div className="h-4 bg-gradient-to-r from-[#181D30] via-[#2A3150] to-[#181D30] rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-gradient-to-r from-[#181D30] via-[#2A3150] to-[#181D30] rounded-md w-4/5 animate-pulse" />
                      <div className="h-4 bg-gradient-to-r from-[#181D30] via-[#2A3150] to-[#181D30] rounded-md w-2/3 animate-pulse" />
                    </div>

                    <div className="flex items-center gap-2 pt-3">
                      <div className="h-7 w-28 rounded-xl bg-[#181D30]" />
                      <div className="h-7 w-32 rounded-xl bg-[#181D30]" />
                      <div className="h-7 w-24 rounded-xl bg-[#181D30]" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#FFE600] font-anime">
                      <Zap className="w-3.5 h-3.5 text-[#FFE600]" />
                      <span>{isAr ? 'توجيه كابتن أورا اليومي (Google Gemini):' : isFr ? 'BRIEFING QUOTIDIEN DE CAPTAIN AURA (GEMINI AI) :' : isEs ? 'ORIENTACIÓN DIARIA DE CAPTAIN AURA (GEMINI AI):' : 'CAPTAIN AURA DAILY BRIEFING (GEMINI AI):'}</span>
                    </div>
                    <div className="prose prose-invert max-w-none text-gray-200 text-sm md:text-base font-bold leading-relaxed whitespace-pre-line">
                      {adviceText}
                    </div>
                  </div>
                )
              ) : (
                /* Interactive Conversation Stream */
                <div className="space-y-4 flex-1">
                  {chatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1 font-mono">
                        <span>{msg.sender === 'user' ? (isAr ? 'أنت' : 'You') : (isAr ? 'كابتن أورا ⚡ (Gemini)' : 'Captain Aura ⚡ (Gemini)')}</span>
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>
                      <div 
                        className={`max-w-[85%] rounded-2xl p-4 text-sm font-bold leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-[#182038] to-[#1E2748] border border-[#00F0FF]/40 text-white'
                            : 'bg-[#151726] border border-[#FF007A]/40 text-gray-200 whitespace-pre-line shadow-[0_0_15px_rgba(255,0,122,0.15)]'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="space-y-3 p-4 bg-[#151726] rounded-2xl border border-gray-800 text-xs text-[#FFE600] font-bold animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-mono">{isAr ? 'كابتن أورا يحلل البيانات عبر محرك Google Gemini...' : 'Captain Aura is thinking via Google Gemini...'}</span>
                      </div>
                      {/* Chat response skeleton bar */}
                      <div className="space-y-2 pt-1">
                        <div className="h-3 bg-gradient-to-r from-[#1F253D] to-[#2B3454] rounded w-3/4"></div>
                        <div className="h-3 bg-gradient-to-r from-[#1F253D] to-[#2B3454] rounded w-1/2"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Prompt Suggestions */}
              <div className="pt-4 border-t border-gray-800/80">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">
                  {isAr ? '💡 أسئلة سريعة للكابتن أورا:' : isFr ? '💡 SUGGESTIONS DE QUESTIONS RAPIDES :' : isEs ? '💡 PREGUNTAS RÁPIDAS SUGERIDAS:' : '💡 QUICK QUESTION SUGGESTIONS:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskQuestion(q.text)}
                      className="px-3 py-1.5 bg-[#181A2A] hover:bg-[#20243C] border border-gray-700 hover:border-[#00F0FF] rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-all text-left"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Live Question Input Box (Connected to Gemini) */}
            <div className="flex gap-3">
              <input 
                type="text" 
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customQuestion.trim()) {
                    handleAskQuestion(customQuestion);
                  }
                }}
                placeholder={isAr ? 'اسأل كابتن أورا عن تمرينك، تغذيتك، أو المنتجات (رد فوري عبر Gemini)...' : isFr ? "Posez vos questions d'entraînement, de biomécanique ou d'équipement à Captain Aura..." : isEs ? 'Pregunta a Captain Aura sobre entrenamiento, biomecánica o equipamiento...' : 'Ask Captain Aura about training, nutrition, or gear (instant Gemini response)...'}
                className="flex-1 bg-[#181A2A] border border-gray-700 rounded-2xl px-5 py-4 text-white text-sm font-bold focus:border-[#00F0FF] focus:outline-none transition-all placeholder:text-gray-500"
              />

              <button
                onClick={() => handleAskQuestion(customQuestion)}
                disabled={isLoading || !customQuestion.trim()}
                className="px-6 py-4 bg-[#00F0FF] hover:bg-[#FFE600] text-[#0A0B10] font-black rounded-2xl transition-all shadow-[0_0_15px_#00F0FF] flex items-center justify-center disabled:opacity-50 cursor-pointer"
                title={isAr ? 'إرسال إلى Gemini' : isFr ? 'Envoyer à Gemini' : isEs ? 'Enviar a Gemini' : 'Send to Gemini'}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Automated Notification Toast */}
      {showNotificationToast && toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#121422] border-2 border-[#FFE600] p-5 rounded-2xl shadow-[0_0_30px_rgba(255,230,0,0.35)] animate-bounce flex items-start gap-3">
          <div className="p-2.5 bg-[#FFE600]/20 rounded-xl text-[#FFE600] shrink-0">
            <Moon className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-start">
              <h4 className="font-anime font-black text-white text-sm">{toastMessage.title}</h4>
              <button
                onClick={() => setShowNotificationToast(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-bold text-gray-300 leading-relaxed">{toastMessage.body}</p>
            <div className="pt-2 flex justify-between items-center">
              <span className="text-[10px] font-black text-[#00F0FF] font-anime">AURA SLEEP ENGINE // ACTIVE</span>
              <button
                onClick={() => {
                  setShowNotificationToast(false);
                  setIsWindDownActive(true);
                  setWindDownProgress(0);
                  soundFX.playStartTrainingSound();
                }}
                className="px-3 py-1 bg-[#FFE600] text-black font-black text-[10px] font-anime rounded-lg hover:bg-white transition-all"
              >
                {isAr ? 'بدء التهيئة الان' : 'START WIND-DOWN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guided Wind-Down Protocol Modal Overlay */}
      {isWindDownActive && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121422] border-2 border-[#00F0FF] rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-[0_0_50px_rgba(0,240,255,0.4)] relative">
            <button
              onClick={() => setIsWindDownActive(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-[#181A2A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-[#00F0FF]/15 rounded-2xl text-[#00F0FF] mb-1">
                <Moon className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <h3 className="text-2xl font-black font-anime text-white">
                {isAr ? 'جلسة تهيئة وسكون العضلات (Zen Mode)' : 'ZEN WIND-DOWN SESSION'}
              </h3>
              <p className="text-xs font-bold text-gray-300">
                {isAr ? 'تهدئة الحواس وتجهيز الجهاز العصبي للنوم العميق' : 'Calming CNS arousal & preparing for deep recovery sleep'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black font-anime">
                <span className="text-[#00F0FF]">{isAr ? 'تقدم الجلسة الاسترخائية:' : 'Wind-Down Progress:'}</span>
                <span className="text-[#FFE600]">{windDownProgress}%</span>
              </div>
              <div className="w-full bg-[#181A2A] h-3 rounded-full overflow-hidden border border-gray-800">
                <div
                  className="bg-gradient-to-r from-[#7000FF] via-[#00F0FF] to-[#FFE600] h-full transition-all duration-500 shadow-[0_0_15px_#00F0FF]"
                  style={{ width: `${windDownProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Step-by-step guidance */}
            <div className="bg-[#181A2A] p-4 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#FFE600] font-anime">
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'توجيه كابتن أورا المباشر:' : 'CAPTAIN AURA LIVE GUIDANCE:'}</span>
              </div>
              <p className="text-sm font-bold text-gray-200 leading-relaxed">
                {windDownProgress < 35 && (isAr ? 'خذ نفساً عميقاً من الأنف (4 ثوانٍ)، ثم احبس أنفاسك (7 ثوانٍ)، ثم أخرج الهواء ببطء (8 ثوانٍ).' : 'Inhale deeply through your nose for 4s, hold for 7s, and exhale slowly for 8s.')}
                {windDownProgress >= 35 && windDownProgress < 75 && (isAr ? 'قم بإرخاء الكتفين، إغلاق الشاشات البراقة، والتأكد من إطفاء الأنوار القوية.' : 'Drop shoulders, dim all high-intensity blue light screens, and sip hydration.')}
                {windDownProgress >= 75 && (isAr ? 'ممتاز! جسدك الآن مستعد تماماً لدخول مرحلة النوم العميق وحصاد أقصى استشفاء.' : 'Excellent! Your CNS is calibrated for maximum muscle recovery and deep sleep.')}
              </p>
            </div>

            <button
              onClick={() => setIsWindDownActive(false)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-[#A855F7] rounded-2xl text-white font-black text-sm font-anime shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              {isAr ? 'إغلاق ومتابعة الاسترخاء' : 'CLOSE & ENTER RECOVERY'}
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default AIAnimeCoach;
