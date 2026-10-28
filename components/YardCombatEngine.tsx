/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Language, translations } from '../i18n';
import { soundFX } from '../services/soundFX';
import { HydrationTracker } from './HydrationTracker';
import { HeartRateLoadChart } from './HeartRateLoadChart';
import { HERO_IMAGE, ABOUT_SQUAD_IMAGE, getProducts, handleImageError } from '../constants';
import { recordCombatActivity } from '../services/combatStreak';
import { CombatStreak } from './CombatStreak';

interface YardCombatEngineProps {
  currentLang: Language;
  onNavigateToProfile?: () => void;
}

// Interactive Floating Combat Badge
interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

const YardCombatEngine: React.FC<YardCombatEngineProps> = ({ currentLang, onNavigateToProfile }) => {
  const t = (key: string) => translations[currentLang]?.[key] || translations['en']?.[key] || key;

  // 1. Biometric State
  const [acuteLoad, setAcuteLoad] = useState<number>(1100);
  const [chronicLoad, setChronicLoad] = useState<number>(950);
  const [hrv, setHrv] = useState<number>(65);
  const [rhr, setRhr] = useState<number>(52);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sleepScore, setSleepScore] = useState<number>(75);
  const [deepSleepPercent, setDeepSleepPercent] = useState<number>(20);
  const [spo2, setSpo2] = useState<number>(98);
  const [minSpo2, setMinSpo2] = useState<number>(94);
  const [skinTemp, setSkinTemp] = useState<number>(36.9); // 36.6 base
  const [maxSpeed, setMaxSpeed] = useState<number>(24);
  const [totalDistance, setTotalDistance] = useState<number>(12.5);

  // Past Injury History Toggles
  const [previousInjuries, setPreviousInjuries] = useState<{
    knee: boolean;
    ankle: boolean;
    back: boolean;
    shoulder: boolean;
    hamstring: boolean;
  }>({
    knee: false,
    ankle: false,
    back: false,
    shoulder: false,
    hamstring: false,
  });

  // Expanded Body Zone State for Recovery Tips & Exercises
  const [expandedZone, setExpandedZone] = useState<'knee' | 'ankle' | 'back' | 'shoulder' | 'hamstring' | null>('knee');

  // Active Recovery Countdown Timer State
  const [recoveryTimerActive, setRecoveryTimerActive] = useState<boolean>(true);
  const [recoveryMode, setRecoveryMode] = useState<'standard' | 'demo'>('standard');
  const [recoveryTimeLeft, setRecoveryTimeLeft] = useState<number>(1800); // 30 mins initial
  const [isBreakModalOpen, setIsBreakModalOpen] = useState<boolean>(false);
  const [completedBreaks, setCompletedBreaks] = useState<number>(0);

  // Voice-to-Text Feedback State for Real-Time Injury Risk Adjustment
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [userPainScore, setUserPainScore] = useState<number>(0); // 0-10
  const [userFatigueScore, setUserFatigueScore] = useState<number>(0); // 0-10
  const [reportedZone, setReportedZone] = useState<'knee' | 'ankle' | 'back' | 'shoulder' | 'hamstring' | 'general' | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceLogs, setVoiceLogs] = useState<Array<{ text: string; time: string; pain: number; fatigue: number; zone: string }>>([]);

  const toggleInjury = (zone: keyof typeof previousInjuries) => {
    setPreviousInjuries(prev => ({ ...prev, [zone]: !prev[zone] }));
  };

  // -------------------------------------------------------------
  // ANIME TRAINING MODE STATE & ENGINE
  // -------------------------------------------------------------
  const WORKOUT_DURATION = 180; // 3 minutes = 180 seconds
  const [isTrainingActive, setIsTrainingActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(WORKOUT_DURATION);
  const [comboHits, setComboHits] = useState<number>(0);
  const [powerLevel, setPowerLevel] = useState<number>(1000);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Sound Synth Generator via Web Audio API
  const playAnimeSound = (type: 'punch' | 'burst' | 'tick' | 'victory') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'punch') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'burst') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'victory') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.type = 'triangle';
          noteOsc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
          noteGain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
          noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.25);
          noteOsc.start(ctx.currentTime + i * 0.12);
          noteOsc.stop(ctx.currentTime + i * 0.12 + 0.25);
        });
      } else if (type === 'tick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch {
      // ignore browser audio context restrictions
    }
  };

  // Workout Timer Interval
  useEffect(() => {
    let timer: any = null;
    if (isTrainingActive && !isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTrainingActive(false);
            setIsCompleted(true);
            playAnimeSound('victory');
            setAcuteLoad(load => load + 75); // Boost biometrics load by +75 AU on completion!
            recordCombatActivity(150, 'engine_workout_complete');
            return 0;
          }
          if (prev % 30 === 0) {
            playAnimeSound('burst');
          } else if (prev <= 10) {
            playAnimeSound('tick');
          }
          return prev - 1;
        });

        // Auto increment power level as time ticks
        setPowerLevel(p => Math.min(p + 35, 9001));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTrainingActive, isPaused, timeLeft]);

  // Active Recovery Timer Countdown Interval
  useEffect(() => {
    let recTimer: any = null;
    if (recoveryTimerActive && recoveryTimeLeft > 0 && !isBreakModalOpen) {
      recTimer = setInterval(() => {
        setRecoveryTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(recTimer);
            setIsBreakModalOpen(true);
            playAnimeSound('victory');
            soundFX.playNotificationSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (recTimer) clearInterval(recTimer);
    };
  }, [recoveryTimerActive, recoveryTimeLeft, isBreakModalOpen]);

  // Process Spoken Voice Text for Pain & Fatigue Levels
  const processVoiceTranscript = (rawText: string) => {
    setVoiceTranscript(rawText);
    const lower = rawText.toLowerCase();

    let foundPain = 0;
    let foundFatigue = 0;
    let foundZone: 'knee' | 'ankle' | 'back' | 'shoulder' | 'hamstring' | 'general' | null = null;

    // Detect target body zone
    if (lower.includes('knee') || lower.includes('ركبة') || lower.includes('صابونة')) foundZone = 'knee';
    else if (lower.includes('ankle') || lower.includes('كاحل') || lower.includes('أكيلس')) foundZone = 'ankle';
    else if (lower.includes('back') || lower.includes('spine') || lower.includes('ظهر') || lower.includes('فقرات')) foundZone = 'back';
    else if (lower.includes('shoulder') || lower.includes('كتف')) foundZone = 'shoulder';
    else if (lower.includes('hamstring') || lower.includes('فخذ') || lower.includes('خلفية')) foundZone = 'hamstring';
    else foundZone = 'general';

    // Parse Pain / Fatigue scale numbers (0-10)
    const digits = rawText.match(/\d+/g);
    if (digits && digits.length > 0) {
      const num1 = parseInt(digits[0], 10);
      if (num1 >= 0 && num1 <= 10) foundPain = num1;
      if (digits.length > 1) {
        const num2 = parseInt(digits[1], 10);
        if (num2 >= 0 && num2 <= 10) foundFatigue = num2;
      }
    }

    // Keyword sentiment fallback if no explicit numbers
    if (foundPain === 0) {
      if (lower.includes('sharp') || lower.includes('severe') || lower.includes('شديد') || lower.includes('قوي')) foundPain = 8;
      else if (lower.includes('pain') || lower.includes('hurt') || lower.includes('ألم') || lower.includes('تصلب')) foundPain = 6;
      else if (lower.includes('mild') || lower.includes('slight') || lower.includes('خفيف')) foundPain = 3;
    }

    if (foundFatigue === 0) {
      if (lower.includes('exhausted') || lower.includes('tired') || lower.includes('تعب') || lower.includes('إرهاق') || lower.includes('استنزاف')) foundFatigue = 7;
      else if (lower.includes('dead') || lower.includes('collapsed') || lower.includes('منهك')) foundFatigue = 9;
      else if (lower.includes('great') || lower.includes('good') || lower.includes('ممتاز') || lower.includes('لا يوجد ألم')) {
        foundPain = 0;
        foundFatigue = 0;
      }
    }

    setUserPainScore(foundPain);
    setUserFatigueScore(foundFatigue);
    setReportedZone(foundZone);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setVoiceLogs(prev => [
      { text: rawText, time: timeStr, pain: foundPain, fatigue: foundFatigue, zone: foundZone || 'general' },
      ...prev.slice(0, 3)
    ]);

    playAnimeSound('burst');
  };

  const startSpeechRecognition = () => {
    setVoiceError(null);
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setVoiceError(
        currentLang === 'ar'
          ? 'متصفحك لا يدعم التعرف الصوتي المباشر. يرجى تجربة الخيارات الجاهزة المتاحة بالأسفل.'
          : 'Web Speech API is not supported in this browser. Please use the voice presets below.'
      );
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = currentLang === 'ar' ? 'ar-SA' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript;
        processVoiceTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setVoiceError(currentLang === 'ar' ? `خطأ في الصوت: ${event.error}` : `Voice recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setVoiceError(err.message || 'Speech recognition failed to start.');
    }
  };

  const resetVoiceFeedback = () => {
    setUserPainScore(0);
    setUserFatigueScore(0);
    setReportedZone(null);
    setVoiceTranscript('');
    setVoiceError(null);
  };

  // Handle Strike Tap
  const handleStrike = (e?: React.MouseEvent) => {
    if (!isTrainingActive || isPaused) return;

    setComboHits(c => c + 1);
    setPowerLevel(p => Math.min(p + 120, 9999));
    playAnimeSound('punch');

    // Trigger Screen Shake
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 180);

    // Add floating combat text
    const phrases = [
      '+120 POWER!',
      'CRITICAL HIT! 💥',
      'ORA ORA ORA! 👊',
      'LIMIT BREAK! ⚡',
      'AURA BURST! 🔥',
      'KAMEHAMEHA! 💫',
      'S-RANK STRIKE! 🌟'
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    const colors = ['#FF007A', '#00F0FF', '#FFE600', '#22C55E'];

    let posX = 50 + (Math.random() * 40 - 20);
    let posY = 50 + (Math.random() * 20 - 10);
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      posX = ((e.clientX - rect.left) / rect.width) * 100;
      posY = ((e.clientY - rect.top) / rect.height) * 100;
    }

    const newText: FloatingText = {
      id: Date.now() + Math.random(),
      text: phrase,
      x: posX,
      y: posY,
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    setFloatingTexts(prev => [...prev.slice(-6), newText]);
  };

  // Start Training Mode
  const startWorkout = () => {
    setTimeLeft(WORKOUT_DURATION);
    setComboHits(0);
    setPowerLevel(1000);
    setIsPaused(false);
    setIsCompleted(false);
    setIsTrainingActive(true);
    soundFX.playStartTrainingSound();
  };

  // Phase Determination (3 minutes = 4 distinct phases)
  // Phase 1: 180 - 135 (0:00 - 0:45) -> Aura Ignition Warmup
  // Phase 2: 135 - 90  (0:45 - 1:30) -> Limit Break Squats
  // Phase 3: 90 - 30   (1:30 - 2:30) -> Furious Combat Strikes
  // Phase 4: 30 - 0    (2:30 - 3:00) -> Final Aura Blast & Recovery
  let phaseNumber = 1;
  let phaseTitle = currentLang === 'ar' ? 'المرحلة 1: اشتعال الهالة (اشعل طاقتك)' : 'PHASE 1: AURA IGNITION';
  let phaseExercise = currentLang === 'ar' ? 'ركض عالي بالركبتين ووضع قتالي' : 'Shadow High Knees & Combat Stance';
  let phaseQuote = currentLang === 'ar' ? '覚悟を決めろ！ جهز روحك القتالية! اشعل هالتك الداخلية!' : '覚悟を決めろ！ Prepare your spirit! Fire up your inner aura!';
  let phaseColor = '#00F0FF';

  if (timeLeft <= 30) {
    phaseNumber = 4;
    phaseTitle = currentLang === 'ar' ? 'المرحلة 4: الانفجار النهائي والتعافي' : 'PHASE 4: FINAL AURA BLAST & RECOVERY';
    phaseExercise = currentLang === 'ar' ? 'تنفس القوة والوقوف المتزن' : 'Power Isometric Breathing & Victory Stance';
    phaseQuote = currentLang === 'ar' ? '勝者！ تم تحقيق تركيز البطل! إتقان رتبة S-Rank!' : '勝者！ Champion Focus Achieved! S-Rank Mastery!';
    phaseColor = '#22C55E';
  } else if (timeLeft <= 90) {
    phaseNumber = 3;
    phaseTitle = currentLang === 'ar' ? 'المرحلة 3: ضربات القتال الضارية' : 'PHASE 3: FURIOUS COMBAT STRIKES';
    phaseExercise = currentLang === 'ar' ? 'لكمات سريعة وضربات متتالية' : 'Burst Punches & Front Kicks';
    phaseQuote = currentLang === 'ar' ? '無駄無駄無駄！ موضا موضا! أطلق وابل 100 ضربة متتالية!' : '無駄無駄無駄！ MUDA MUDA! Unleash a barrage of 100 strikes!';
    phaseColor = '#FF007A';
  } else if (timeLeft <= 135) {
    phaseNumber = 2;
    phaseTitle = currentLang === 'ar' ? 'المرحلة 2: سكوات كسر الحدود' : 'PHASE 2: LIMIT BREAK SQUATS';
    phaseExercise = currentLang === 'ar' ? 'سكوات قفز وانفجار عضلي' : 'Jump Squats & Explosive Core';
    phaseQuote = currentLang === 'ar' ? '限界突破! اكسر حدودك وتجاوز الألم!' : '限界突破! Break past your limits! No pain, no champion!';
    phaseColor = '#FFE600';
  }

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // -------------------------------------------------------------
  // BIOMETRICS CALCULATION LOGIC
  // -------------------------------------------------------------
  const acwr = chronicLoad === 0 ? 1.0 : acuteLoad / chronicLoad;
  const tempDeviation = Math.abs(skinTemp - 36.6);

  // Overall Risk Algorithm
  let riskScore = 0;
  const warnings: string[] = [];

  // ACWR Factor (35%)
  if (acwr < 0.8) {
    riskScore += 10;
    warnings.push(t('warn_acwr_low'));
  } else if (acwr <= 1.3) {
    riskScore += 5;
  } else if (acwr <= 1.5) {
    riskScore += 30;
    warnings.push(t('warn_acwr_med'));
  } else if (acwr <= 2.0) {
    riskScore += 55;
    warnings.push(t('warn_acwr_high'));
  } else {
    riskScore += 80;
    warnings.push(t('warn_acwr_max'));
  }

  // HRV Factor (20%)
  if (hrv < 40) {
    riskScore += 20;
    warnings.push(t('warn_hrv_low'));
  } else if (hrv < 55) {
    riskScore += 10;
    warnings.push(t('warn_hrv_med'));
  }

  // Sleep Factor (20%)
  if (sleepHours < 5) {
    riskScore += 20;
    warnings.push(currentLang === 'ar' ? "نوم حرج — أقل من 5 ساعات (Critical Sleep Deficit)" : "Critical Sleep Deficit (<5 hours)");
  } else if (sleepHours < 6.5) {
    riskScore += 12;
    warnings.push(currentLang === 'ar' ? "نوم غير كافٍ للتعافي العضلي (Insufficient Sleep)" : "Insufficient Sleep for Muscle Recovery");
  }
  if (sleepScore < 50) {
    riskScore += 8;
  }
  if (deepSleepPercent < 13) {
    riskScore += 5;
    warnings.push(currentLang === 'ar' ? "نقص في النوم العميق — تعافي عضلي ضعيف (Low Deep Sleep)" : "Low Deep Sleep — Impaired Muscle Recovery");
  }

  // Skin Temp Factor (10%)
  if (tempDeviation > 0.8) {
    riskScore += 15;
    warnings.push(t('warn_temp'));
  } else if (tempDeviation > 0.5) {
    riskScore += 8;
  }

  // SpO2 Factor (5%)
  if (spo2 < 94) {
    riskScore += 15;
    warnings.push(t('warn_spo2_low'));
  } else if (spo2 < 96) {
    riskScore += 7;
  }

  // Voice Feedback Real-Time Impact Factor
  const voiceRiskImpact = (userPainScore * 5) + (userFatigueScore * 3);
  riskScore += voiceRiskImpact;

  if (userPainScore >= 5 || userFatigueScore >= 6) {
    const zoneTxt = reportedZone ? ` (${reportedZone.toUpperCase()})` : '';
    warnings.push(
      currentLang === 'ar'
        ? `🎙️ إفادة صوتية مباشرة: ألم ${userPainScore}/10 وإجهاد ${userFatigueScore}/10${zoneTxt} - تم تعديل الخطورة بـ +${voiceRiskImpact}%`
        : `🎙️ Live Voice Feedback: Pain ${userPainScore}/10 & Fatigue ${userFatigueScore}/10${zoneTxt} - Risk adjusted +${voiceRiskImpact}%`
    );
  }

  const finalRisk = Math.min(Math.round(riskScore), 100);

  // Risk Badge & Recommendations
  let badgeLabel = t('risk_low');
  let badgeColor = '#00F0FF';
  let recommendation = t('rec_low');

  if (finalRisk < 25) {
    badgeLabel = t('risk_low');
    badgeColor = '#00F0FF';
    recommendation = t('rec_low');
  } else if (finalRisk < 50) {
    badgeLabel = t('risk_med');
    badgeColor = '#FFE600';
    recommendation = t('rec_med');
  } else if (finalRisk < 75) {
    badgeLabel = t('risk_high');
    badgeColor = '#FF007A';
    recommendation = t('rec_high');
  } else {
    badgeLabel = t('risk_danger');
    badgeColor = '#EF4444';
    recommendation = t('rec_danger');
  }

  // Days to Injury Prediction Algorithm
  let baseDays: number | null = null;
  let timelineMessage = t('timeline_ok');

  if (finalRisk >= 25) {
    if (finalRisk >= 75) baseDays = 1;
    else if (finalRisk >= 50) baseDays = 3;
    else baseDays = 7;

    const hasHistory = Object.values(previousInjuries).some(v => v);
    if (hasHistory && baseDays > 1) baseDays = Math.max(1, baseDays - 1);

    timelineMessage = baseDays === 1 
      ? t('timeline_1') 
      : baseDays === 3 
        ? t('timeline_3') 
        : t('timeline_7');
  }

  // Body Zone Risks
  let kneeRisk = 0;
  if (acwr > 1.3) kneeRisk += 25;
  if (totalDistance > 10) kneeRisk += 15;
  if (previousInjuries.knee) kneeRisk += 20;
  if (maxSpeed > 20 && acwr > 1.2) kneeRisk += 10;
  if (reportedZone === 'knee') kneeRisk += (userPainScore * 7);
  kneeRisk = Math.min(kneeRisk, 100);

  let ankleRisk = 0;
  if (acwr > 1.4) ankleRisk += 20;
  if (previousInjuries.ankle) ankleRisk += 25;
  if (totalDistance > 15) ankleRisk += 15;
  if (reportedZone === 'ankle') ankleRisk += (userPainScore * 7);
  ankleRisk = Math.min(ankleRisk, 100);

  let backRisk = 0;
  if (sleepHours < 6) backRisk += 20;
  if (tempDeviation > 0.5) backRisk += 15;
  if (previousInjuries.back) backRisk += 25;
  if (acwr > 1.5) backRisk += 15;
  if (reportedZone === 'back') backRisk += (userPainScore * 7);
  backRisk = Math.min(backRisk, 100);

  let shoulderRisk = 0;
  if (previousInjuries.shoulder) shoulderRisk += 30;
  if (hrv < 50) shoulderRisk += 20;
  if (rhr > 70) shoulderRisk += 10;
  if (reportedZone === 'shoulder') shoulderRisk += (userPainScore * 7);
  shoulderRisk = Math.min(shoulderRisk, 100);

  let hamstringRisk = 0;
  if (acwr > 1.3) hamstringRisk += 25;
  if (maxSpeed > 22) hamstringRisk += 20;
  if (previousInjuries.hamstring) hamstringRisk += 30;
  if (sleepHours < 6.5) hamstringRisk += 10;
  if (reportedZone === 'hamstring') hamstringRisk += (userPainScore * 7);
  hamstringRisk = Math.min(hamstringRisk, 100);

  // Dynamic AI Coach Voice Advice Generator
  const getAICoachVoiceAdvice = () => {
    if (userPainScore === 0 && userFatigueScore === 0) {
      return currentLang === 'ar'
        ? "✅ كابتن أورا: تم تأكيد الاستقرار البدني بالكامل! صمام الأمان يعمل بكفاءة والجهوزية قتالية عالية."
        : "✅ Captain Aura: Full physical stability confirmed! Safety valves green and combat readiness optimal.";
    }

    if (userPainScore >= 7) {
      return currentLang === 'ar'
        ? `🚨 تحذير حاد من كابتن أورا: تم تسجيل ألم شديد (${userPainScore}/10) في منطقة [${reportedZone?.toUpperCase() || 'الجسم'}]. تم تفعيل تقليل الحمل الفوري وتقصير فترة الاستراحة النشطة لـ 15 دقيقة.`
        : `🚨 Captain Aura Alert: Severe pain (${userPainScore}/10) detected in [${reportedZone?.toUpperCase() || 'Body'}]. Auto-reducing workout intensity and shortening active recovery interval to 15 mins.`;
    }

    if (userFatigueScore >= 7) {
      return currentLang === 'ar'
        ? `⚠️ توجيه كابتن أورا: تم الإبلاغ عن إجهاد مرتفع (${userFatigueScore}/10). يُنصح بإنهاء الجولة الحالية فوراً وتلقي استراحة الحركة.`
        : `⚠️ Captain Aura Guidance: High fatigue (${userFatigueScore}/10) reported. Terminate current round immediately and execute movement break.`;
    }

    return currentLang === 'ar'
      ? `💡 ملاحظة كابتن أورا: تم تسجيل ألم/تصلب خفيف (${userPainScore}/10) في [${reportedZone?.toUpperCase() || 'الجسم'}]. استمر بالتدريب بـ 75% مع إطالة وقائية.`
      : `💡 Captain Aura Note: Mild pain/stiffness (${userPainScore}/10) logged in [${reportedZone?.toUpperCase() || 'Body'}]. Continue at 75% load with preventative stretches.`;
  };

  // Active Recovery Interval Calculation based on finalRisk
  const getRiskBasedInterval = (risk: number) => {
    if (risk >= 75) return 900;  // 15 mins (High/Danger Risk)
    if (risk >= 50) return 1200; // 20 mins
    if (risk >= 25) return 1800; // 30 mins
    return 2700;                 // 45 mins (Low Risk)
  };

  const currentRecommendedIntervalSec = recoveryMode === 'demo' ? 30 : getRiskBasedInterval(finalRisk);
  const currentIntervalMins = Math.round(currentRecommendedIntervalSec / 60);

  // Active Recovery Timer Reset Function
  const resetRecoveryTimer = (mode?: 'standard' | 'demo') => {
    const targetMode = mode || recoveryMode;
    setRecoveryMode(targetMode);
    const newDuration = targetMode === 'demo' ? 30 : getRiskBasedInterval(finalRisk);
    setRecoveryTimeLeft(newDuration);
    setRecoveryTimerActive(true);
    setIsBreakModalOpen(false);
  };

  // Determine Suggested Movement Break based on highest risk zone & overall risk
  const getSuggestedMovementBreak = () => {
    const maxZoneRisk = Math.max(kneeRisk, ankleRisk, backRisk, shoulderRisk, hamstringRisk);
    
    if (maxZoneRisk === kneeRisk && kneeRisk > 20) {
      return {
        zone: currentLang === 'ar' ? 'الركبة' : 'Knee Joint',
        icon: '🦵',
        title: currentLang === 'ar' ? 'تمديد الركبة VMO وتفكيك وتر الصابونة' : 'Patellar VMO Extensions & Quad Release',
        duration: currentLang === 'ar' ? '45 ثانية' : '45 Seconds',
        instructions: currentLang === 'ar' 
          ? 'قم بإجراء 10 تكرارات لفرد الركبة بالرباط المطاطي (TKE) مع تدليك الفخذ ببطء لتخفيف الضغط عن الصابونة.'
          : 'Perform 10 Terminal Knee Extensions (TKE) and 30 seconds of quad foam rolling to relieve patellar pressure.',
        benefit: currentLang === 'ar' ? 'تخفيف إجهاد الوتر الصابوني بنسبة 35%' : 'Relieves patellar tendon stress by ~35%'
      };
    } else if (maxZoneRisk === ankleRisk && ankleRisk > 20) {
      return {
        zone: currentLang === 'ar' ? 'الكاحل' : 'Ankle Joint',
        icon: '🦶',
        title: currentLang === 'ar' ? 'تحريك الكاحل الدائري وإطالة وتر الأكيلس' : 'Ankle Mobility Circles & Calf Stretch',
        duration: currentLang === 'ar' ? '45 ثانية' : '45 Seconds',
        instructions: currentLang === 'ar'
          ? 'قم برسم حروف في الهواء بكل قدم مع إطالة عضلة الساق الخلفية ضد الحائط لـ 20 ثانية لكل قدم.'
          : 'Draw full alphabets with each ankle in mid-air and hold a standing wall calf stretch for 20 seconds.',
        benefit: currentLang === 'ar' ? 'حماية وتر الأكيلس وتنشيط السائل المفصلي' : 'Protects Achilles tendon & restores joint fluid'
      };
    } else if (maxZoneRisk === backRisk && backRisk > 20) {
      return {
        zone: currentLang === 'ar' ? 'أسفل الظهر' : 'Lumbar Spine',
        icon: '🔙',
        title: currentLang === 'ar' ? 'فك ضغط الفقرات وتمرين القطة والجمل' : 'Spinal Decompression & Cat-Cow Flow',
        duration: currentLang === 'ar' ? '60 ثانية' : '60 Seconds',
        instructions: currentLang === 'ar'
          ? 'نفذ 30 ثانية من تمرين القطة والجمل ببطء يعقبها التعلق الساكن على العقلة لفك ضغط أقراص الفقرات القطنية.'
          : 'Execute 30 seconds of Cat-Cow spinal flows followed by a gentle dead hang to decompress lumbar discs.',
        benefit: currentLang === 'ar' ? 'تخفيف ضغط الفقرات ومرونة العمود الفقري' : 'Decompresses spinal discs & relieves lumbar tension'
      };
    } else if (maxZoneRisk === shoulderRisk && shoulderRisk > 20) {
      return {
        zone: currentLang === 'ar' ? 'الكتف' : 'Shoulder Cuff',
        icon: '💪',
        title: currentLang === 'ar' ? 'انزلاق لوحي الكتف على الحائط والتدوير' : 'Scapular Wall Slides & Rotator Circles',
        duration: currentLang === 'ar' ? '45 ثانية' : '45 Seconds',
        instructions: currentLang === 'ar'
          ? 'ثبت ظهرك على الحائط وقم بإجراء 12 انزلاق للكتفين لأعلى ولأسفل مع دوران خفيف للذراعين.'
          : 'Keep back flat against the wall, perform 12 scapular wall slides and gentle rotator cuff circles.',
        benefit: currentLang === 'ar' ? 'توسيع القفص الصدري ومحاذاة لوح الكتف' : 'Prevents shoulder impingement & improves posture'
      };
    } else if (maxZoneRisk === hamstringRisk && hamstringRisk > 20) {
      return {
        zone: currentLang === 'ar' ? 'الفخذ الخلفي' : 'Hamstrings',
        icon: '🏃',
        title: currentLang === 'ar' ? 'مسحات الفخذ الخلفية الديناميكية RDL' : 'Standing Dynamic Hamstring Sweeps',
        duration: currentLang === 'ar' ? '45 ثانية' : '45 Seconds',
        instructions: currentLang === 'ar'
          ? 'أنجز 10 مسحات ديناميكية للفخذ الخلفي لكل ساق مع الانحناء من الورك لاستعادة مرونة الألياف العضلية.'
          : 'Perform 10 active hamstring sweeps per leg to restore tissue elasticity after high acute load.',
        benefit: currentLang === 'ar' ? 'حماية ألياف الفخذ الخلفي من التمزق' : 'Protects hamstring fibers from high-speed strain'
      };
    } else {
      return {
        zone: currentLang === 'ar' ? 'الجسم بالكامل' : 'Full Body Reset',
        icon: '🧘',
        title: currentLang === 'ar' ? 'تنفس القوة وتغطية الحركة الشاملة' : 'Champion Mobility & Diaphragmatic Reset',
        duration: currentLang === 'ar' ? '60 ثانية' : '60 Seconds',
        instructions: currentLang === 'ar'
          ? 'خذ 5 أنفاس عميقة بالبطن مع رفع اليدين لأعلى ومد الجذع لتنشيط الجهاز العصبي وتحسين مؤشر HRV.'
          : 'Take 5 deep box breaths with overhead arm reaches to release spinal tension and optimize HRV.',
        benefit: currentLang === 'ar' ? 'تحسين مؤشر HRV وتنشيط التعافي' : 'Optimizes HRV score & activates parasympathetic state'
      };
    }
  };

  const currentSuggestedBreak = getSuggestedMovementBreak();

  const formatRecoveryTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getZoneColor = (val: number) => {
    if (val < 30) return '#00F0FF';
    if (val < 55) return '#FFE600';
    if (val < 75) return '#FF007A';
    return '#EF4444';
  };

  // Muscle Recovery
  let muscleRecoveryScore = 0;
  muscleRecoveryScore += deepSleepPercent >= 20 ? 40 : (deepSleepPercent / 20) * 40;
  muscleRecoveryScore += hrv >= 65 ? 35 : (hrv / 65) * 35;
  muscleRecoveryScore += sleepHours >= 8 ? 25 : (sleepHours / 8) * 25;
  muscleRecoveryScore = Math.min(Math.round(muscleRecoveryScore), 100);

  // Sleep Disorders Detection
  const disorders: { title: string; desc: string; severity: 'high' | 'med' }[] = [];
  if (minSpo2 < 90) {
    disorders.push({
      title: currentLang === 'ar' ? '🚨 انقطاع التنفس الحاد (Severe Apnea Alert)' : '🚨 Severe Sleep Apnea Alert (SpO₂ Critical)',
      desc: currentLang === 'ar' 
        ? `انخفض SpO₂ إلى ${minSpo2}% أثناء الليل. يُنصح باستشارة طبيب فوراً.`
        : `Nighttime SpO₂ dropped to ${minSpo2}%. Immediate medical consultation is advised.`,
      severity: 'high'
    });
  } else if (minSpo2 < 94) {
    disorders.push({
      title: currentLang === 'ar' ? '🟡 تنبيه انخفاض أكسجين النوم (Low SpO₂ Alert)' : '🟡 Low Nocturnal SpO₂ Alert',
      desc: currentLang === 'ar'
        ? `وصل أدنى أكسجين إلى ${minSpo2}%. حافظ على تهوية جيدة وتجنب النوم على الظهر.`
        : `Lowest nighttime SpO₂ reached ${minSpo2}%. Ensure proper bedroom airflow and avoid supine sleep.`,
      severity: 'med'
    });
  }

  if (sleepHours < 6) {
    disorders.push({
      title: currentLang === 'ar' ? '🟠 نمط نوم متقطع ونقص الساعات (Fragmented Sleep)' : '🟠 Fragmented Sleep & Deficit',
      desc: currentLang === 'ar'
        ? `ساعات النوم ${sleepHours}h أقل من المستوى المطلوب للتعافي العضلي.`
        : `Total sleep (${sleepHours}h) is below the threshold needed for cellular muscle repair.`,
      severity: 'med'
    });
  }

  // Simulated Weekly Chart Data
  const sleepChartData = [
    { day: currentLang === 'ar' ? 'الإثنين' : 'Mon', score: 55, hrv: 58, recovery: 50 },
    { day: currentLang === 'ar' ? 'الثلاثاء' : 'Tue', score: 65, hrv: 62, recovery: 60 },
    { day: currentLang === 'ar' ? 'الأربعاء' : 'Wed', score: 82, hrv: 70, recovery: 85 },
    { day: currentLang === 'ar' ? 'الخميس' : 'Thu', score: 78, hrv: 68, recovery: 78 },
    { day: currentLang === 'ar' ? 'الجمعة' : 'Fri', score: 60, hrv: 60, recovery: 55 },
    { day: currentLang === 'ar' ? 'السبت' : 'Sat', score: 88, hrv: 74, recovery: 90 },
    { day: currentLang === 'ar' ? 'الأحد' : 'Sun', score: sleepScore, hrv: hrv, recovery: muscleRecoveryScore },
  ];

  return (
    <section id="yardEngine" className="py-16 sm:py-20 px-3 sm:px-6 md:px-12 bg-[#0D0E17] relative w-full max-w-full overflow-hidden overflow-x-hidden">
      
      {/* Dynamic Keyframes for Anime Training Effects */}
      <style>{`
        @keyframes speedLinesRadial {
          0% { transform: scale(1) rotate(0deg); opacity: 0.15; }
          50% { transform: scale(1.15) rotate(180deg); opacity: 0.35; }
          100% { transform: scale(1) rotate(360deg); opacity: 0.15; }
        }

        @keyframes auraBorderPulse {
          0%, 100% { box-shadow: 0 0 25px #FF007A, inset 0 0 15px #FF007A; border-color: #FF007A; }
          33% { box-shadow: 0 0 40px #00F0FF, inset 0 0 20px #00F0FF; border-color: #00F0FF; }
          66% { box-shadow: 0 0 45px #FFE600, inset 0 0 25px #FFE600; border-color: #FFE600; }
        }

        @keyframes strikeShakeAnim {
          0% { transform: translate(0, 0) scale(1); }
          20% { transform: translate(-8px, 6px) rotate(-1deg) scale(1.02); }
          40% { transform: translate(8px, -6px) rotate(1deg) scale(0.99); }
          60% { transform: translate(-5px, -3px) rotate(-0.5deg) scale(1.01); }
          80% { transform: translate(5px, 3px) rotate(0.5deg) scale(1); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes floatUpBadge {
          0% { transform: translateY(0) scale(0.7); opacity: 1; }
          50% { transform: translateY(-40px) scale(1.2); opacity: 0.9; }
          100% { transform: translateY(-80px) scale(1.4); opacity: 0; }
        }

        @keyframes superSaiyanPulse {
          0% { filter: drop-shadow(0 0 10px #FFE600); }
          50% { filter: drop-shadow(0 0 35px #FF007A); }
          100% { filter: drop-shadow(0 0 10px #00F0FF); }
        }

        .anim-speed-lines {
          animation: speedLinesRadial 8s linear infinite;
        }

        .anim-aura-border {
          animation: auraBorderPulse 2.5s infinite;
        }

        .anim-[#FF007A] {
          animation: superSaiyanPulse 2s infinite ease-in-out;
        }

        .anim-shake {
          animation: strikeShakeAnim 0.2s ease-in-out;
        }

        .anim-float-badge {
          animation: floatUpBadge 0.8s ease-out forwards;
        }
      `}</style>

      {/* Background Neon Grid Effect */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF007A]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1800px] w-full max-w-full overflow-x-hidden mx-auto relative z-10">
        
        {/* Header Tag */}
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141622] border-2 border-[#FF007A] text-xs font-black text-[#FF007A] font-anime shadow-[0_0_20px_#FF007A]">
            <span>⚡ YARD300 // AURA CHAMPION COMBAT ENGINE</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black font-anime text-white leading-tight">
            YARD300 — AURA CHAMPION
          </h2>

          <p className="max-w-2xl text-gray-300 font-bold text-base md:text-lg leading-relaxed">
            {currentLang === 'ar' 
              ? "محرك التنبؤ بالإصابات والتحليل الحيوي الشامل v2.0 ومدعوم بخوارزميات ACWR، HRV، والنوم العميق لضمان أداء الأبطال." 
              : "Comprehensive Biometric & Injury Prediction Engine v2.0 powered by ACWR, HRV, and Deep Sleep algorithms to guarantee champion peak performance."}
          </p>

          {/* Featured Anime Hero Champion Visual Banner */}
          <div className="w-full max-w-4xl mt-4 rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(0,240,255,0.3)] relative group">
            <img loading="lazy" decoding="async" 
              src={HERO_IMAGE} 
              alt="Aura Champion Anime Athlete" 
              onError={handleImageError}
              className="w-full h-64 md:h-80 object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-[#0A0B10]/40 to-transparent"></div>
            <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-left">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#FF007A] text-white text-[10px] font-black font-anime uppercase tracking-wider">
                  🔥 CAPTAIN AURA S-RANK ATHLETE
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white font-anime mt-1">
                  {currentLang === 'ar' ? 'كابتن أورا - قائد فريق القتال بالذكاء الاصطناعي' : 'Captain Aura — AI Combat Squad Commander'}
                </h3>
              </div>
              <span className="text-xs font-black font-anime text-[#FFE600] bg-[#181A28]/90 px-3 py-1.5 rounded-xl border border-[#FFE600]/40">
                AURA POWER: 9999+
              </span>
            </div>
          </div>
        </div>

        {/* Live Combat Streak & Aura Points Widget inside YARD300 Engine */}
        <div className="mb-12">
          <CombatStreak 
            currentLang={currentLang} 
            onNavigateToEngine={onNavigateToProfile}
          />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ANIME TRAINING MODE TRIGGER & WORKOUT HUD */}
        {/* ------------------------------------------------------------- */}
        <div className="mb-16">
          {!isTrainingActive && !isCompleted && (
            <div className="relative overflow-hidden bg-gradient-to-r from-[#181A28] via-[#12131C] to-[#181A28] border-2 border-[#FFE600] rounded-3xl p-8 shadow-[0_0_40px_rgba(255,230,0,0.25)] text-center group">
              {/* Background anime speedlines pattern */}
              <div className="absolute inset-0 bg-speedlines opacity-30 pointer-events-none"></div>
              
              <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
                <div className="inline-block px-4 py-1 rounded-full bg-[#FFE600] text-[#0A0B10] font-black font-anime text-xs uppercase tracking-widest shadow-[0_0_15px_#FFE600]">
                  🔥 NEW HIGH-INTENSITY FEATURE // WORKOUT OVERDRIVE
                </div>

                <h3 className="text-3xl md:text-5xl font-black font-anime text-white leading-tight">
                  ⚡ ANIME TRAINING MODE (3-MIN WORKOUT)
                </h3>

                <p className="text-gray-300 font-bold text-sm md:text-base leading-relaxed">
                  {currentLang === 'ar'
                    ? 'خض تجربة تدريبية حماسية لمدة 3 دقائق بنمط الأنمي القتالي! ارفع طاقتك لأكثر من 9000، سدد لكمات متتالية، وفكّر كأبطال الأنمي الخارقين مع تعزيز تلقائي لمؤشرات حمولتك اليومية (+75 AU).'
                    : 'Experience an exhilarating 3-minute anime combat workout! Break past power level 9000, land rapid punch combos, and channel supernatural warrior focus with automatic daily training load sync (+75 AU).'}
                </p>

                <div className="pt-2 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={startWorkout}
                    className="px-8 py-4 rounded-2xl bg-[#FF007A] hover:bg-[#FF007A]/80 text-white font-black font-anime text-lg shadow-[0_0_30px_#FF007A] hover:scale-105 transition-all flex items-center gap-3 border-2 border-white/20"
                  >
                    <span>⚡ STARTS ANIME TRAINING MODE (3 MINUTES)</span>
                    <span className="text-xl">➔</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE 3-MINUTE ANIME WORKOUT HUD */}
          {isTrainingActive && (
            <div className={`relative overflow-hidden bg-[#0A0B10] rounded-3xl p-6 md:p-10 border-4 transition-all duration-200 anim-aura-border ${isShaking ? 'anim-shake' : ''}`}>
              
              {/* Radial Anime Speed Lines Background */}
              <div className="absolute inset-0 anim-speed-lines pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(255,0,122,0.15)_0%,_transparent_70%)]"></div>

              {/* Floating Combat Strike Text Popups */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
                {floatingTexts.map(item => (
                  <div
                    key={item.id}
                    className="absolute font-black font-anime text-xl md:text-3xl text-stroke anim-float-badge drop-shadow-[0_0_12px_currentColor]"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      color: item.color,
                    }}
                  >
                    {item.text}
                  </div>
                ))}
              </div>

              {/* HUD Header */}
              <div className="relative z-20 flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-[#FF007A] animate-ping"></span>
                  <div>
                    <span className="text-xs font-black font-anime text-[#FF007A] block">
                      LIVE ANIME COMBAT WORKOUT // OVERDRIVE
                    </span>
                    <h3 className="text-xl md:text-2xl font-black font-anime text-white">
                      {phaseTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sound Toggle */}
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2.5 rounded-xl bg-[#181A28] border border-gray-800 hover:border-gray-600 text-sm font-bold"
                    title="Toggle Sound Effects"
                  >
                    {soundEnabled ? '🔊 SFX ON' : '🔇 SFX OFF'}
                  </button>

                  {/* Pause / Resume */}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="px-4 py-2 rounded-xl bg-[#FFE600] text-black font-black font-anime text-xs shadow-[0_0_15px_#FFE600]"
                  >
                    {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
                  </button>

                  {/* Quit */}
                  <button
                    onClick={() => {
                      setIsTrainingActive(false);
                      setIsCompleted(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-red-950 text-red-400 border border-red-800 font-bold text-xs"
                  >
                    ✕ QUIT
                  </button>
                </div>
              </div>

              {/* Main Display Grid */}
              <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
                
                {/* Left Column: Timer & Exercise Cue */}
                <div className="lg:col-span-5 bg-[#12131C]/90 p-6 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-xs font-bold text-gray-400 font-anime uppercase tracking-widest block mb-2">
                      ⏱️ WORKOUT COUNTDOWN TIMER
                    </span>
                    <div className="text-6xl md:text-8xl font-black font-anime text-[#00F0FF] neon-text-cyan tracking-wider">
                      {formatTimer(timeLeft)}
                    </div>
                  </div>

                  {/* Exercise Box */}
                  <div className="p-4 rounded-xl bg-[#181A28] border-r-4 shadow-inner" style={{ borderColor: phaseColor }}>
                    <div className="text-xs font-black font-anime mb-1" style={{ color: phaseColor }}>
                      🎯 CURRENT EXERCISE {currentLang === 'ar' ? '// الحركة الحالية' : ''}
                    </div>
                    <div className="text-lg md:text-xl font-black text-white mb-2">
                      {phaseExercise}
                    </div>
                    <p className="text-xs text-gray-300 italic font-bold">
                      "{phaseQuote}"
                    </p>
                  </div>

                  {/* Real-time In-Workout Voice Feedback Bar */}
                  <div className="p-3.5 rounded-xl bg-[#0A0B10] border border-[#FF007A]/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black font-anime text-[#FF007A] flex items-center gap-1.5">
                        <span className="animate-pulse">🎙️ VOICE COACH FEED</span>
                        <span>(SPEAK PAIN / FATIGUE)</span>
                      </span>
                      {userPainScore > 0 && (
                        <span className="text-[10px] font-anime font-black text-[#FFE600] bg-[#181A28] px-2 py-0.5 rounded border border-[#FFE600]/30">
                          PAIN: {userPainScore}/10
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={startSpeechRecognition}
                        disabled={isListening}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black font-anime flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                          isListening
                            ? 'bg-[#FF007A] text-white animate-pulse'
                            : 'bg-[#FF007A]/20 hover:bg-[#FF007A]/40 text-[#FF007A] border border-[#FF007A]/50'
                        }`}
                      >
                        <span>{isListening ? '🎙️ LISTENING...' : '🎙️ SPEAK NOW'}</span>
                      </button>

                      <div className="flex-1 text-[11px] font-bold text-gray-300 truncate bg-[#181A28] px-2.5 py-1.5 rounded-lg border border-gray-800">
                        {voiceTranscript ? `"${voiceTranscript}"` : (currentLang === 'ar' ? 'تحدث عن الألم كـ "ألم ركبة 7"' : 'Speak e.g. "Knee pain 7"')}
                      </div>
                    </div>

                    {/* Quick voice presets inside workout */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => processVoiceTranscript(currentLang === 'ar' ? 'ألم ركبة 7' : 'Knee pain 7')}
                        className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#181A28] hover:bg-[#FF007A]/30 text-gray-300 border border-gray-700"
                      >
                        🦵 Knee 7
                      </button>
                      <button
                        type="button"
                        onClick={() => processVoiceTranscript(currentLang === 'ar' ? 'ألم ظهر 8' : 'Back pain 8')}
                        className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#181A28] hover:bg-[#FF007A]/30 text-gray-300 border border-gray-700"
                      >
                        🔙 Back 8
                      </button>
                      <button
                        type="button"
                        onClick={() => processVoiceTranscript(currentLang === 'ar' ? 'تعب شديد 9' : 'High fatigue 9')}
                        className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#181A28] hover:bg-[#FF007A]/30 text-gray-300 border border-gray-700"
                      >
                        ⚡ Fatigue 9
                      </button>
                    </div>
                  </div>

                  {/* Phase Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                      <span>PHASE {phaseNumber} OF 4</span>
                      <span>{Math.round(((WORKOUT_DURATION - timeLeft) / WORKOUT_DURATION) * 100)}% COMPLETE</span>
                    </div>
                    <div className="w-full h-3 bg-[#181A28] rounded-full overflow-hidden border border-gray-800">
                      <div
                        className="h-full transition-all duration-500 shadow-[0_0_12px_currentColor]"
                        style={{
                          width: `${((WORKOUT_DURATION - timeLeft) / WORKOUT_DURATION) * 100}%`,
                          backgroundColor: phaseColor
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Interactive Strike Button & Aura Gauge */}
                <div className="lg:col-span-7 bg-[#12131C]/90 p-6 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-6 text-center">
                  
                  {/* Aura Power Gauge */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black font-anime text-[#FFE600] uppercase tracking-wider">
                        🔥 POWER LEVEL {currentLang === 'ar' ? '(مستوى الهالة):' : ':'}
                      </span>
                      <span className="text-2xl font-black font-anime text-[#FFE600] neon-text-yellow">
                        {powerLevel > 9000 ? 'OVER 9000!!' : `${powerLevel} / 9000`}
                      </span>
                    </div>
                    <div className="w-full h-4 bg-[#181A28] rounded-full overflow-hidden border border-gray-800 p-[2px]">
                      <div
                        className="h-full rounded-full transition-all duration-300 shadow-[0_0_15px_#FFE600]"
                        style={{
                          width: `${Math.min((powerLevel / 9000) * 100, 100)}%`,
                          backgroundColor: '#FFE600'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Combo Hits Count */}
                  <div className="p-4 rounded-2xl bg-[#181A28] border border-gray-800">
                    <span className="text-xs font-black font-anime text-gray-400 block mb-1">
                      🥊 COMBOS LANDED {currentLang === 'ar' ? '(الضربات المكتسبة)' : ''}
                    </span>
                    <span className="text-5xl md:text-7xl font-black font-anime text-[#FF007A] neon-text-pink">
                      {comboHits} <span className="text-2xl text-white">STRIKES</span>
                    </span>
                  </div>

                  {/* Giant Interactive Combat Strike Button - Solid Green */}
                  <button
                    onClick={handleStrike}
                    className="w-full py-8 md:py-10 rounded-2xl bg-[#10B981] hover:bg-[#059669] hover:brightness-110 active:scale-95 transition-all text-black font-black font-anime text-2xl md:text-4xl shadow-[0_0_50px_rgba(16,185,129,0.8)] border-4 border-white flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>💥 TAP TO LAND STRIKES // 拳を打て!</span>
                    <span className="text-xs text-black/80 font-mono font-bold uppercase tracking-widest">
                      (PRESS OR CLICK REPEATEDLY FOR MAX AURA COMBO)
                    </span>
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* WORKOUT VICTORY / S-RANK COMPLETION MODAL */}
          {isCompleted && (
            <div className="bg-[#12131C] border-4 border-[#FFE600] rounded-3xl p-8 md:p-12 text-center shadow-[0_0_60px_rgba(255,230,0,0.4)] relative overflow-hidden space-y-6">
              <div className="absolute inset-0 bg-speedlines opacity-20 pointer-events-none"></div>

              <div className="inline-block px-6 py-2 rounded-full bg-[#FFE600] text-black font-black font-anime text-sm shadow-[0_0_20px_#FFE600]">
                🏆 S-RANK ANIME CHAMPION CLEAR // 勝利完了
              </div>

              <h3 className="text-4xl md:text-6xl font-black font-anime text-white leading-tight">
                ANIME TRAINING MODE COMPLETE!
              </h3>

              <p className="max-w-xl mx-auto text-gray-300 font-bold text-base">
                {currentLang === 'ar' ? (
                  <>تهانينا يا بطل! لقد أكملت 3 دقائق كاملة من التدريب المكثف وحققت أقصى هالة قتالية. تمت إضافة <strong className="text-[#00F0FF]">+75 AU</strong> تلقائياً إلى حملك التدريبي.</>
                ) : (
                  <>Congratulations warrior! You crushed a full 3-minute high-intensity combat session and unlocked peak aura. <strong className="text-[#00F0FF]">+75 AU</strong> has been added to your training load.</>
                )}
              </p>

              {/* Stats Summary Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto py-4">
                <div className="bg-[#181A28] p-4 rounded-2xl border border-gray-800">
                  <span className="text-xs text-gray-400 font-bold block">{currentLang === 'ar' ? 'إجمالي الضربات' : 'Total Strikes'}</span>
                  <span className="text-2xl font-black font-anime text-[#FF007A]">{comboHits} Hits</span>
                </div>
                <div className="bg-[#181A28] p-4 rounded-2xl border border-gray-800">
                  <span className="text-xs text-gray-400 font-bold block">{currentLang === 'ar' ? 'مستوى الهالة' : 'Aura Power Level'}</span>
                  <span className="text-2xl font-black font-anime text-[#FFE600]">{powerLevel} LVL</span>
                </div>
                <div className="bg-[#181A28] p-4 rounded-2xl border border-gray-800">
                  <span className="text-xs text-gray-400 font-bold block">{currentLang === 'ar' ? 'السعرات المحروقة' : 'Calories Burned'}</span>
                  <span className="text-2xl font-black font-anime text-[#00F0FF]">~48 kcal</span>
                </div>
                <div className="bg-[#181A28] p-4 rounded-2xl border border-gray-800">
                  <span className="text-xs text-gray-400 font-bold block">{currentLang === 'ar' ? 'زيادة الحمل' : 'Load Increase'}</span>
                  <span className="text-2xl font-black font-anime text-[#22C55E]">+75 AU</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <button
                  onClick={startWorkout}
                  className="px-6 py-3 rounded-xl bg-[#00F0FF] text-black font-black font-anime text-sm shadow-[0_0_20px_#00F0FF] hover:scale-105 transition-all"
                >
                  🔄 {currentLang === 'ar' ? 'إعادة التدريب (TRAIN AGAIN)' : 'TRAIN AGAIN'}
                </button>
                <button
                  onClick={() => setIsCompleted(false)}
                  className="px-6 py-3 rounded-xl bg-[#181A28] border border-gray-700 text-white font-black font-anime text-sm hover:border-gray-500 transition-all"
                >
                  ✅ BACK TO BIOMETRIC DASHBOARD
                </button>
              </div>

            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* BIOMETRIC CONTROLLER & INJURY RISK DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-[#12131C] p-6 md:p-10 rounded-3xl border border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)] mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-800 pb-4">
            <h3 className="text-xl font-black font-anime text-[#00F0FF] flex items-center gap-2">
              <span>🎛️</span>
              <span>{currentLang === 'ar' ? 'لوحة التحكم بالمؤشرات البيومترية // BIOMETRIC ENGINE CONTROLLER' : 'Biometric Engine Controller // METRICS DASHBOARD'}</span>
            </h3>
            <span className="text-xs text-[#FFE600] font-mono font-bold bg-[#181A28] px-3 py-1.5 rounded-xl border border-[#FFE600]/30">
              ACWR Ratio: <strong className="text-white font-anime text-sm">{acwr.toFixed(2)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Acute Load */}
            <div className="bg-[#181A28] p-5 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <span className="text-gray-300">{currentLang === 'ar' ? 'الحمل التدريبي الحاد (Acute Load AU)' : 'Acute Training Load (AU)'}</span>
                <span className="text-[#FF007A] font-anime text-sm font-black">{acuteLoad} AU</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="2500" 
                step="50" 
                value={acuteLoad} 
                onChange={(e) => setAcuteLoad(parseInt(e.target.value))}
                className="w-full accent-[#FF007A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
                <span>500 ({currentLang === 'ar' ? 'خفيف' : 'Light'})</span>
                <span>1100 ({currentLang === 'ar' ? 'عادي' : 'Normal'})</span>
                <span>2500 ({currentLang === 'ar' ? 'إجهاد' : 'High'})</span>
              </div>
            </div>

            {/* Chronic Load */}
            <div className="bg-[#181A28] p-5 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <span className="text-gray-300">{currentLang === 'ar' ? 'الحمل التراكمي المزمن (Chronic Load AU)' : 'Chronic Training Load (AU)'}</span>
                <span className="text-[#00F0FF] font-anime text-sm font-black">{chronicLoad} AU</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="2000" 
                step="50" 
                value={chronicLoad} 
                onChange={(e) => setChronicLoad(parseInt(e.target.value))}
                className="w-full accent-[#00F0FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
                <span>500 AU</span>
                <span>950 AU ({currentLang === 'ar' ? 'معيار' : 'Baseline'})</span>
                <span>2000 AU</span>
              </div>
            </div>

            {/* HRV Slider */}
            <div className="bg-[#181A28] p-5 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <span className="text-gray-300">{t('sl_hrv')}</span>
                <span className="text-[#00F0FF] font-anime text-sm font-black">{hrv} ms</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="100" 
                value={hrv} 
                onChange={(e) => setHrv(parseInt(e.target.value))}
                className="w-full accent-[#00F0FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
                <span>20 ms ({currentLang === 'ar' ? 'منخفض' : 'Low'})</span>
                <span>65 ms ({currentLang === 'ar' ? 'جيد' : 'Good'})</span>
                <span>100 ms</span>
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="bg-[#181A28] p-5 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <span className="text-gray-300">{t('sl_sleep')}</span>
                <span className="text-[#FFE600] font-anime text-sm font-black">{sleepHours} h</span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="10" 
                step="0.5" 
                value={sleepHours} 
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-[#FFE600] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
                <span>3h</span>
                <span>7.5h ({currentLang === 'ar' ? 'موصى به' : 'Recommended'})</span>
                <span>10h</span>
              </div>
            </div>

            {/* Deep Sleep % */}
            <div className="bg-[#181A28] p-5 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <span className="text-gray-300">{currentLang === 'ar' ? 'نسبة النوم العميق (Deep Sleep %)' : 'Deep Sleep Ratio (%)'}</span>
                <span className="text-[#FFE600] font-anime text-sm font-black">{deepSleepPercent}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="35" 
                value={deepSleepPercent} 
                onChange={(e) => setDeepSleepPercent(parseInt(e.target.value))}
                className="w-full accent-[#FFE600] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
                <span>5% ({currentLang === 'ar' ? 'منخفض' : 'Low'})</span>
                <span>20% ({currentLang === 'ar' ? 'مثالي' : 'Optimal'})</span>
                <span>35%</span>
              </div>
            </div>

            {/* Skin Temp */}
            <div className="bg-[#181A28] p-5 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <span className="text-gray-300">{currentLang === 'ar' ? 'حرارة الجسم (Skin Temp °C)' : 'Skin Temperature (°C)'}</span>
                <span className="text-[#FF007A] font-anime text-sm font-black">{skinTemp.toFixed(1)}°C</span>
              </div>
              <input 
                type="range" 
                min="36.0" 
                max="38.0" 
                step="0.1" 
                value={skinTemp} 
                onChange={(e) => setSkinTemp(parseFloat(e.target.value))}
                className="w-full accent-[#FF007A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
                <span>36.6°C ({currentLang === 'ar' ? 'طبيعي' : 'Normal'})</span>
                <span>37.2°C ({currentLang === 'ar' ? 'إجهاد' : 'Elevated'})</span>
                <span>38.0°C</span>
              </div>
            </div>

            {/* SpO2 */}
            <div className="bg-[#181A28] p-5 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <span className="text-gray-300">{t('sl_spo2')}</span>
                <span className="text-[#00F0FF] font-anime text-sm font-black">{spo2}%</span>
              </div>
              <input 
                type="range" 
                min="85" 
                max="100" 
                value={spo2} 
                onChange={(e) => setSpo2(parseInt(e.target.value))}
                className="w-full accent-[#00F0FF] cursor-pointer"
              />
            </div>

            {/* Min Night SpO2 */}
            <div className="bg-[#181A28] p-5 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <span className="text-gray-300">{currentLang === 'ar' ? 'أدنى أكسجين ليلي (Min SpO₂ Night)' : 'Min Nighttime SpO₂ (%)'}</span>
                <span className="text-[#FF007A] font-anime text-sm font-black">{minSpo2}%</span>
              </div>
              <input 
                type="range" 
                min="85" 
                max="98" 
                value={minSpo2} 
                onChange={(e) => setMinSpo2(parseInt(e.target.value))}
                className="w-full accent-[#FF007A] cursor-pointer"
              />
            </div>

            {/* Max Speed & Distance */}
            <div className="bg-[#181A28] p-5 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <span className="text-gray-300">{currentLang === 'ar' ? 'أقصى سرعة وركض (Max Speed & Km)' : 'Max Speed & Sprint Pace (km/h)'}</span>
                <span className="text-[#00F0FF] font-anime text-sm font-black">{maxSpeed} km/h</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="35" 
                value={maxSpeed} 
                onChange={(e) => setMaxSpeed(parseInt(e.target.value))}
                className="w-full accent-[#00F0FF] cursor-pointer"
              />
            </div>

          </div>

          {/* Injury History Toggles */}
          <div className="border-t border-gray-800 pt-6">
            <h4 className="text-xs font-black font-anime text-[#FFE600] uppercase tracking-wider mb-3">
              🏥 {currentLang === 'ar' ? 'سجل الإصابات السابقة (Previous Injury History)' : 'Previous Injury History Log'}
            </h4>
            <div className="flex flex-wrap gap-3">
              {(['knee', 'ankle', 'back', 'shoulder', 'hamstring'] as const).map((zone) => (
                <button
                  key={zone}
                  onClick={() => toggleInjury(zone)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    previousInjuries[zone]
                      ? 'bg-[#FF007A]/20 border-[#FF007A] text-[#FF007A] shadow-[0_0_12px_#FF007A]'
                      : 'bg-[#181A28] border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {previousInjuries[zone] ? (currentLang === 'ar' ? '⚠️ إصابة سابقاً:' : '⚠️ Prior Injury:') : (currentLang === 'ar' ? '✅ سليم:' : '✅ Clear:')} {zone.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Daily Hydration Tracker Card */}
        <HydrationTracker currentLang={currentLang} className="mb-8" />

        {/* 7-Day Resting Heart Rate & Training Load Progression Chart */}
        <HeartRateLoadChart currentLang={currentLang} className="mb-12" />

        {/* ------------------------------------------------------------- */}
        {/* REAL-TIME VOICE-TO-TEXT AI COACH FEEDBACK CARD */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-[#12131C] p-6 md:p-8 rounded-3xl border-2 border-[#FF007A]/60 shadow-[0_0_35px_rgba(255,0,122,0.25)] mb-12 relative overflow-hidden space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181A28] border border-[#FF007A]/40 text-[#FF007A] text-xs font-black font-anime mb-1">
                <span className="animate-pulse">🎙️ REAL-TIME VOICE-TO-TEXT AI COACH</span>
              </div>
              <h3 className="text-2xl font-black font-anime text-white flex items-center gap-2">
                <span>{t('voice_feedback_title')}</span>
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-1 max-w-2xl">
                {t('voice_feedback_sub')}
              </p>
            </div>

            {(userPainScore > 0 || userFatigueScore > 0 || voiceTranscript) && (
              <button
                type="button"
                onClick={resetVoiceFeedback}
                className="px-3.5 py-1.5 rounded-xl bg-[#181A28] hover:bg-gray-800 text-gray-300 border border-gray-700 text-xs font-black font-anime transition-all shrink-0 cursor-pointer"
              >
                {t('clear_voice_data')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Captain Aura Anime Avatar & Microphone Control */}
            <div className="lg:col-span-5 bg-[#0A0B10] p-6 rounded-2xl border border-[#FF007A]/30 flex flex-col items-center justify-center text-center space-y-4 relative">
              
              {/* Captain Aura Anime Coach Avatar Card */}
              <div className="w-full flex items-center gap-3 bg-[#141622] p-2.5 rounded-xl border border-[#FF007A]/40 mb-2">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                  <img loading="lazy" decoding="async" 
                    src={HERO_IMAGE} 
                    alt="Captain Aura AI" 
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-[#FF007A] text-white text-[8px] font-black px-1 rounded-tl">S-RANK</span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black font-anime text-[#00F0FF] uppercase block">CAPTAIN AURA AI</span>
                  <span className="text-xs font-bold text-white block">
                    {currentLang === 'ar' ? 'المدرب القتالي المباشر' : 'Live Combat Coach'}
                  </span>
                </div>
              </div>

              {/* Big Interactive Glowing Microphone */}
              <button
                type="button"
                onClick={startSpeechRecognition}
                disabled={isListening}
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer border-4 relative ${
                  isListening
                    ? 'bg-[#FF007A] border-white shadow-[0_0_50px_#FF007A] scale-110 animate-pulse'
                    : 'bg-[#181A28] hover:bg-[#FF007A]/20 border-[#FF007A] text-[#FF007A] shadow-[0_0_25px_rgba(255,0,122,0.4)] hover:scale-105'
                }`}
              >
                <span className="text-4xl">{isListening ? '🔊' : '🎙️'}</span>
                <span className="text-[10px] font-black font-anime mt-1 uppercase text-white">
                  {isListening ? 'RECORDING' : 'TAP TO SPEAK'}
                </span>

                {/* Animated Pulsing Soundwave Rings */}
                {isListening && (
                  <>
                    <span className="absolute inset-0 rounded-full border-2 border-[#FF007A] animate-ping opacity-75"></span>
                    <span className="absolute -inset-3 rounded-full border-2 border-[#00F0FF] animate-ping opacity-50"></span>
                  </>
                )}
              </button>

              <div className="text-xs font-anime font-black text-gray-300">
                {isListening ? (
                  <span className="text-[#FF007A] animate-pulse flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-ping"></span>
                    <span>{t('listening_now')}</span>
                  </span>
                ) : (
                  <span>{t('start_speaking')}</span>
                )}
              </div>

              {/* Error fallback message */}
              {voiceError && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-[11px] text-red-300 font-bold leading-tight">
                  ⚠️ {voiceError}
                </div>
              )}

              {/* Preset Voice Triggers for Instant 1-Click Testing */}
              <div className="w-full pt-2 border-t border-gray-800/80">
                <span className="text-[10px] font-anime font-black text-gray-400 block mb-2 uppercase">
                  {t('simulated_voice_presets')}
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <button
                    type="button"
                    onClick={() => processVoiceTranscript(currentLang === 'ar' ? 'أشعر بألم شديد في الركبة درجة 7' : 'Sharp knee pain level 7')}
                    className="px-2.5 py-1 rounded-lg bg-[#181A28] hover:bg-[#FF007A]/30 text-gray-200 border border-gray-700 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    🦵 {currentLang === 'ar' ? 'ألم الركبة 7/10' : 'Knee Pain 7/10'}
                  </button>
                  <button
                    type="button"
                    onClick={() => processVoiceTranscript(currentLang === 'ar' ? 'تصلب شديد في أسفل الظهر درجة 8' : 'Severe lower back stiffness level 8')}
                    className="px-2.5 py-1 rounded-lg bg-[#181A28] hover:bg-[#FF007A]/30 text-gray-200 border border-gray-700 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    🔙 {currentLang === 'ar' ? 'تصلب الظهر 8/10' : 'Back Pain 8/10'}
                  </button>
                  <button
                    type="button"
                    onClick={() => processVoiceTranscript(currentLang === 'ar' ? 'إجهاد وتعب شديد درجة 9' : 'Extreme exhaustion fatigue level 9')}
                    className="px-2.5 py-1 rounded-lg bg-[#181A28] hover:bg-[#FF007A]/30 text-gray-200 border border-gray-700 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    ⚡ {currentLang === 'ar' ? 'إجهاد حاد 9/10' : 'Fatigue 9/10'}
                  </button>
                  <button
                    type="button"
                    onClick={() => processVoiceTranscript(currentLang === 'ar' ? 'ممتاز لا يوجد ألم درجة 0' : 'Feeling great zero pain level 0')}
                    className="px-2.5 py-1 rounded-lg bg-[#181A28] hover:bg-[#00F0FF]/30 text-gray-200 border border-gray-700 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    ✅ {currentLang === 'ar' ? 'لا يوجد ألم 0/10' : 'Zero Pain 0/10'}
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Parsed Metrics & AI Coach Adaptation Output */}
            <div className="lg:col-span-7 bg-[#181A28] p-6 rounded-2xl border border-gray-800 space-y-4">
              
              {/* Spoken Transcript Banner */}
              <div className="bg-[#0A0B10] p-3.5 rounded-xl border border-gray-800 flex items-start gap-3">
                <span className="text-xl shrink-0">💬</span>
                <div className="flex-1">
                  <span className="text-[10px] font-anime font-black text-gray-400 block uppercase">
                    {t('last_spoken_feedback')}
                  </span>
                  <p className="text-sm font-black text-[#FFE600] font-anime mt-0.5">
                    {voiceTranscript ? `"${voiceTranscript}"` : (currentLang === 'ar' ? 'لم يتم استلام نص صوتي بعد...' : 'No spoken audio received yet...')}
                  </p>
                </div>
              </div>

              {/* Grid of Parsed Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#0A0B10] p-3 rounded-xl border border-gray-800 text-center">
                  <span className="text-[10px] font-bold text-gray-400 block">{t('parsed_pain')}</span>
                  <span className={`text-xl font-black font-anime ${userPainScore > 6 ? 'text-[#FF007A]' : userPainScore > 0 ? 'text-[#FFE600]' : 'text-[#00F0FF]'}`}>
                    {userPainScore} / 10
                  </span>
                </div>

                <div className="bg-[#0A0B10] p-3 rounded-xl border border-gray-800 text-center">
                  <span className="text-[10px] font-bold text-gray-400 block">{t('parsed_fatigue')}</span>
                  <span className={`text-xl font-black font-anime ${userFatigueScore > 6 ? 'text-[#FF007A]' : userFatigueScore > 0 ? 'text-[#FFE600]' : 'text-[#00F0FF]'}`}>
                    {userFatigueScore} / 10
                  </span>
                </div>

                <div className="bg-[#0A0B10] p-3 rounded-xl border border-gray-800 text-center">
                  <span className="text-[10px] font-bold text-gray-400 block">{t('affected_zone')}</span>
                  <span className="text-xs font-black font-anime text-white uppercase block mt-1">
                    {reportedZone ? reportedZone : 'GENERAL'}
                  </span>
                </div>

                <div className="bg-[#0A0B10] p-3 rounded-xl border border-gray-800 text-center">
                  <span className="text-[10px] font-bold text-gray-400 block">{t('realtime_risk_adjustment')}</span>
                  <span className="text-xl font-black font-anime text-[#FF007A]">
                    +{voiceRiskImpact}%
                  </span>
                </div>
              </div>

              {/* AI Coach Voice Real-Time Guidance Box */}
              <div className="bg-[#0A0B10] p-4 rounded-xl border-2 border-[#00F0FF]/40 space-y-2">
                <span className="text-xs font-black font-anime text-[#00F0FF] uppercase flex items-center gap-1.5">
                  <span>🤖</span>
                  <span>{t('ai_coach_advice')}</span>
                </span>
                <p className="text-xs text-gray-200 font-bold leading-relaxed">
                  {getAICoachVoiceAdvice()}
                </p>
              </div>

              {/* Spoken History log */}
              {voiceLogs.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-anime font-black text-gray-400 block mb-1 uppercase">
                    📜 {currentLang === 'ar' ? 'سجل المحادثات الصوتية السابقة:' : 'Voice Session Log:'}
                  </span>
                  <div className="space-y-1">
                    {voiceLogs.map((log, idx) => (
                      <div key={idx} className="text-[11px] font-bold text-gray-400 bg-[#0A0B10] px-2.5 py-1 rounded-md flex justify-between items-center">
                        <span className="truncate max-w-[240px]">"{log.text}"</span>
                        <span className="text-[10px] text-[#00F0FF] font-anime shrink-0">{log.time} | P:{log.pain} F:{log.fatigue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Risk Calculation Results & Active Warnings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Card 1: Risk Gauge */}
          <div className="bg-[#12131C] p-8 rounded-3xl border-2 border-[#FF007A]/50 shadow-[0_0_30px_rgba(255,0,122,0.3)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-black text-gray-400 font-anime uppercase tracking-widest block mb-2">
                {t('overall_risk')} // AURA CHAMPION RISK SCORE
              </span>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl font-black font-anime text-white" style={{ color: badgeColor }}>
                  {finalRisk}%
                </span>
                <span 
                  className="px-4 py-1.5 rounded-full text-xs font-black font-anime shadow-lg"
                  style={{ backgroundColor: `${badgeColor}22`, color: badgeColor, border: `1px solid ${badgeColor}` }}
                >
                  {badgeLabel}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 bg-[#181A28] rounded-full overflow-hidden border border-gray-800 p-[2px] mb-6">
                <div 
                  className="h-full rounded-full transition-all duration-700 shadow-[0_0_15px_currentColor]"
                  style={{ width: `${finalRisk}%`, backgroundColor: badgeColor }}
                ></div>
              </div>

              <p className="text-sm font-bold text-gray-200 leading-relaxed mb-4">
                {recommendation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#181A28] border border-gray-800 text-xs font-bold text-[#FFE600] flex items-center justify-between">
              <span>⏱️ {currentLang === 'ar' ? 'التنبؤ الزمني بوقوع الإصابة:' : 'Estimated Injury Risk Timeline:'}</span>
              <span className="font-anime text-sm text-white">{timelineMessage}</span>
            </div>
          </div>

          {/* Card 2: Active Warnings */}
          <div className="bg-[#12131C] p-8 rounded-3xl border border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-black font-anime text-[#FF007A] mb-4 flex items-center gap-2">
                <span>⚠️</span>
                <span>{t('active_warnings')} ({warnings.length})</span>
              </h4>

              <ul className="space-y-3 font-bold text-sm">
                {warnings.length === 0 ? (
                  <li className="p-4 rounded-xl bg-[#181A28] border border-[#00F0FF]/30 text-[#00F0FF]">
                    {t('warn_none')}
                  </li>
                ) : (
                  warnings.map((warn, idx) => (
                    <li key={idx} className="p-3.5 rounded-xl bg-[#181A28] border-r-4 border-[#FF007A] text-gray-200 text-xs md:text-sm">
                      {warn}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="mt-6 text-xs text-gray-400 font-bold flex items-center gap-2">
              <span className="text-[#00F0FF]">AURA CHAMPION ENGINE</span> — {currentLang === 'ar' ? 'يتكيف تلقائياً مع خوارزميات الإصابات اليومية.' : 'Automatically adapts to daily injury predictive algorithms.'}
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* ACTIVE RECOVERY MOVEMENT BREAK COUNTDOWN TIMER */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-[#12131C] p-6 md:p-8 rounded-3xl border-2 border-[#00F0FF]/50 shadow-[0_0_35px_rgba(0,240,255,0.2)] mb-12 relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181A28] border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-black font-anime mb-1">
                <span>⏱️ COUNTDOWN TO RECOVERY & REST INTERVAL CALCULATOR</span>
              </div>
              <h3 className="text-2xl font-black font-anime text-white flex items-center gap-2">
                <span>{currentLang === 'ar' ? 'عداد العد التنازلي للاستشفاء وحساب فترات الراحة المثلى' : 'Countdown to Recovery: Biometric Rest Interval Engine'}</span>
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-1 max-w-2xl">
                {currentLang === 'ar' 
                  ? 'يقوم المحرك الحيوي بحساب فترة الراحة المثلى بين الجولات والتدريبات بناءً على شدة جلسة التمرين المسجلة، معدل الحمل الحاد والمزمن (ACWR)، وتوازن النبض لضمان الاستشفاء الأسرع ومنع التمزقات.'
                  : 'Calculates optimal rest intervals and full recovery countdown based on your last recorded session intensity, ACWR ratio, and autonomic nervous system readiness.'}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#181A28] p-1.5 rounded-2xl border border-gray-800">
              <button
                type="button"
                onClick={() => resetRecoveryTimer('standard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black font-anime transition-all ${
                  recoveryMode === 'standard'
                    ? 'bg-[#00F0FF] text-black shadow-[0_0_12px_#00F0FF]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ⏱️ {t('standard_interval')}
              </button>
              <button
                type="button"
                onClick={() => resetRecoveryTimer('demo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black font-anime transition-all ${
                  recoveryMode === 'demo'
                    ? 'bg-[#FF007A] text-white shadow-[0_0_12px_#FF007A]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ⚡ {t('quick_demo_mode')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Big Glowing Digital Countdown Display */}
            <div className="lg:col-span-5 bg-[#0A0B10] p-6 rounded-2xl border border-[#00F0FF]/30 flex flex-col items-center justify-center text-center relative space-y-4">
              <div className="text-[10px] font-anime font-black tracking-widest text-gray-400 uppercase">
                {t('risk_interval_rec')} <span className="text-[#FFE600]">{recoveryMode === 'demo' ? '30 SECONDS (DEMO)' : `${currentIntervalMins} MINS (${badgeLabel})`}</span>
              </div>

              {/* Countdown Numbers */}
              <div className="relative my-2">
                <span className="text-6xl sm:text-7xl font-black font-anime text-white tracking-wider neon-text-cyan">
                  {formatRecoveryTimer(recoveryTimeLeft)}
                </span>
                <div className={`w-3 h-3 rounded-full absolute -top-1 -right-4 ${recoveryTimerActive ? 'bg-[#22C55E] animate-ping' : 'bg-yellow-500'}`}></div>
              </div>

              {/* Progress Ring Bar */}
              <div className="w-full h-3 bg-[#181A28] rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-[#00F0FF] via-[#FFE600] to-[#FF007A] transition-all duration-500"
                  style={{
                    width: `${((currentRecommendedIntervalSec - recoveryTimeLeft) / currentRecommendedIntervalSec) * 100}%`
                  }}
                ></div>
              </div>

              {/* Completed Breaks Stat */}
              <div className="flex justify-between items-center w-full pt-2 text-xs font-bold text-gray-300">
                <span>🏆 {currentLang === 'ar' ? 'استراحات مكتملة اليوم:' : 'Completed Breaks:'}</span>
                <span className="font-anime font-black text-[#FFE600] bg-[#181A28] px-2.5 py-1 rounded-lg border border-[#FFE600]/30">
                  {completedBreaks} {currentLang === 'ar' ? 'استراحة' : 'Breaks'} (+{completedBreaks * 50} YARDX)
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap justify-center gap-2 pt-2 w-full">
                <button
                  type="button"
                  onClick={() => setRecoveryTimerActive(!recoveryTimerActive)}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-black font-anime text-xs border transition-all ${
                    recoveryTimerActive
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/30'
                  }`}
                >
                  {recoveryTimerActive ? `⏸️ ${t('pause_timer')}` : `▶️ ${t('start_timer')}`}
                </button>
                <button
                  type="button"
                  onClick={() => resetRecoveryTimer()}
                  className="py-2.5 px-4 bg-[#181A28] hover:bg-gray-800 text-gray-300 border border-gray-700 rounded-xl font-black font-anime text-xs transition-all"
                >
                  🔄 {t('reset_timer')}
                </button>
              </div>
            </div>

            {/* Right Column: Suggested Movement Break Preview */}
            <div className="lg:col-span-7 bg-[#181A28] p-6 rounded-2xl border border-gray-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black font-anime text-[#FFE600] uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>{currentLang === 'ar' ? 'استراحة الحركة المقترحة القادمة:' : 'NEXT SUGGESTED MOVEMENT BREAK:'}</span>
                  </span>
                  <span className="text-[10px] font-anime font-black text-[#00F0FF] bg-[#0A0B10] px-2.5 py-1 rounded-md border border-[#00F0FF]/20">
                    TARGET: {currentSuggestedBreak.zone.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl p-3 bg-[#0A0B10] border border-gray-800 rounded-2xl shrink-0">
                    {currentSuggestedBreak.icon}
                  </span>
                  <div>
                    <h4 className="text-lg font-black font-anime text-white">
                      {currentSuggestedBreak.title}
                    </h4>
                    <span className="text-xs font-anime font-black text-[#00F0FF] block mt-0.5">
                      ⏱️ {currentLang === 'ar' ? 'المدة:' : 'Duration:'} {currentSuggestedBreak.duration}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 font-bold leading-relaxed bg-[#0A0B10] p-3.5 rounded-xl border border-gray-800/80 mb-3">
                  {currentSuggestedBreak.instructions}
                </p>

                <div className="text-[11px] text-[#22C55E] font-bold flex items-center gap-1.5">
                  <span>🛡️ {currentLang === 'ar' ? 'الفائدة التراكمية:' : 'Biometric Benefit:'}</span>
                  <span>{currentSuggestedBreak.benefit}</span>
                </div>
              </div>

              {/* Trigger Now Button */}
              <button
                type="button"
                onClick={() => setIsBreakModalOpen(true)}
                className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#FFE600] hover:brightness-110 text-black font-black font-anime text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🚀 {t('trigger_break_now')}</span>
                <span className="text-sm">➔</span>
              </button>
            </div>

          </div>
        </div>

        {/* ACTIVE RECOVERY MOVEMENT BREAK MODAL POPUP */}
        {isBreakModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#12131C] border-4 border-[#00F0FF] rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-[0_0_60px_rgba(0,240,255,0.5)] relative space-y-6">
              
              <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] text-xs font-black font-anime border border-[#00F0FF]/40">
                  <span className="animate-ping w-2 h-2 rounded-full bg-[#00F0FF]"></span>
                  <span>{t('movement_break_title')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBreakModalOpen(false)}
                  className="text-gray-400 hover:text-white font-bold text-sm bg-[#181A28] px-3 py-1 rounded-lg border border-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gray-300 font-bold leading-relaxed">
                  {t('movement_break_desc')}
                </p>

                {/* Exercise Detail Card */}
                <div className="bg-[#181A28] p-5 rounded-2xl border border-[#00F0FF]/40 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2.5 bg-[#0A0B10] rounded-xl border border-gray-800">
                      {currentSuggestedBreak.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-anime font-black text-[#00F0FF] block uppercase">
                        {currentLang === 'ar' ? 'منطقة الاستهداف:' : 'TARGET ZONE:'} {currentSuggestedBreak.zone}
                      </span>
                      <h4 className="text-lg font-black font-anime text-white">
                        {currentSuggestedBreak.title}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-[#0A0B10] p-4 rounded-xl border border-gray-800">
                    <span className="text-xs font-anime font-black text-[#FFE600] block mb-1">
                      📋 {currentLang === 'ar' ? 'طريقة التنفيذ:' : 'EXECUTION STEPS:'}
                    </span>
                    <p className="text-xs text-gray-200 font-bold leading-relaxed">
                      {currentSuggestedBreak.instructions}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-1">
                    <span className="text-gray-400">⏱️ {currentLang === 'ar' ? 'المدة المطلوبة:' : 'Target Time:'} <strong className="text-white font-anime">{currentSuggestedBreak.duration}</strong></span>
                    <span className="text-[#22C55E]">✨ {currentSuggestedBreak.benefit}</span>
                  </div>
                </div>
              </div>

              {/* Complete & Reward Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playAnimeSound('victory');
                    soundFX.playVictorySound();
                    setCompletedBreaks(c => c + 1);
                    setHrv(h => Math.min(100, h + 3));
                    setAcuteLoad(l => Math.max(500, l - 15));
                    recordCombatActivity(80, 'movement_break_complete');
                    resetRecoveryTimer();
                  }}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#22C55E] via-[#00F0FF] to-[#FFE600] hover:brightness-110 text-black font-black font-anime text-sm shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all cursor-pointer text-center"
                >
                  ✅ {t('complete_break_reward')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsBreakModalOpen(false)}
                  className="py-4 px-6 rounded-2xl bg-[#181A28] text-gray-400 hover:text-white font-black font-anime text-xs border border-gray-800"
                >
                  {currentLang === 'ar' ? 'تأجيل الاستراحة' : 'Snooze Break'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Body Zone Risk Map */}
        <div className="bg-[#12131C] p-8 rounded-3xl border border-[#00F0FF]/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 border-r-4 border-[#00F0FF] pr-4">
            <div>
              <h3 className="text-2xl font-black font-anime text-white">
                {t('zone_title')} (MULTI-ZONE STRESS MATRIX)
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-1">
                {currentLang === 'ar' ? '👇 انقر على أي منطقة لعرض نصائح الاستشفاء الفورية والتمارين الموصى بها:' : '👇 Click on any body zone to reveal specific recovery tips & exercises:'}
              </p>
            </div>
            <span className="text-xs font-anime font-black text-[#00F0FF] px-3 py-1 bg-[#181A28] border border-[#00F0FF]/30 rounded-full">
              INTERACTIVE RECOVERY MATRIX
            </span>
          </div>

          {/* Zone Selector Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-6">
            
            {/* Knee */}
            <button
              type="button"
              onClick={() => setExpandedZone(expandedZone === 'knee' ? null : 'knee')}
              className={`p-5 rounded-2xl border text-center space-y-3 transition-all cursor-pointer relative ${
                expandedZone === 'knee'
                  ? 'bg-[#181A28] border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                  : 'bg-[#181A28]/80 border-gray-800 hover:border-[#00F0FF]/50 hover:bg-[#181A28]'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-3xl">🦵</span>
                <span className="text-[10px] font-anime font-black text-[#00F0FF] uppercase bg-[#0A0B10] px-2 py-0.5 rounded-md border border-[#00F0FF]/20">
                  {expandedZone === 'knee' ? 'Active ▲' : 'View Tips ▼'}
                </span>
              </div>
              <div className="text-xs font-bold text-gray-300">
                {t('z_knee')} {previousInjuries.knee && <span className="text-[#FF007A] block text-[10px]">(سابقة)</span>}
              </div>
              <span className="text-2xl font-black font-anime block" style={{ color: getZoneColor(kneeRisk) }}>
                {kneeRisk}%
              </span>
              <div className="w-full h-2 bg-[#0A0B10] rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${kneeRisk}%`, backgroundColor: getZoneColor(kneeRisk) }}></div>
              </div>
            </button>

            {/* Ankle */}
            <button
              type="button"
              onClick={() => setExpandedZone(expandedZone === 'ankle' ? null : 'ankle')}
              className={`p-5 rounded-2xl border text-center space-y-3 transition-all cursor-pointer relative ${
                expandedZone === 'ankle'
                  ? 'bg-[#181A28] border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                  : 'bg-[#181A28]/80 border-gray-800 hover:border-[#00F0FF]/50 hover:bg-[#181A28]'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-3xl">🦶</span>
                <span className="text-[10px] font-anime font-black text-[#00F0FF] uppercase bg-[#0A0B10] px-2 py-0.5 rounded-md border border-[#00F0FF]/20">
                  {expandedZone === 'ankle' ? 'Active ▲' : 'View Tips ▼'}
                </span>
              </div>
              <div className="text-xs font-bold text-gray-300">
                {t('z_ankle')} {previousInjuries.ankle && <span className="text-[#FF007A] block text-[10px]">(سابقة)</span>}
              </div>
              <span className="text-2xl font-black font-anime block" style={{ color: getZoneColor(ankleRisk) }}>
                {ankleRisk}%
              </span>
              <div className="w-full h-2 bg-[#0A0B10] rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${ankleRisk}%`, backgroundColor: getZoneColor(ankleRisk) }}></div>
              </div>
            </button>

            {/* Lower Back */}
            <button
              type="button"
              onClick={() => setExpandedZone(expandedZone === 'back' ? null : 'back')}
              className={`p-5 rounded-2xl border text-center space-y-3 transition-all cursor-pointer relative ${
                expandedZone === 'back'
                  ? 'bg-[#181A28] border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                  : 'bg-[#181A28]/80 border-gray-800 hover:border-[#00F0FF]/50 hover:bg-[#181A28]'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-3xl">🔙</span>
                <span className="text-[10px] font-anime font-black text-[#00F0FF] uppercase bg-[#0A0B10] px-2 py-0.5 rounded-md border border-[#00F0FF]/20">
                  {expandedZone === 'back' ? 'Active ▲' : 'View Tips ▼'}
                </span>
              </div>
              <div className="text-xs font-bold text-gray-300">
                {t('z_back')} {previousInjuries.back && <span className="text-[#FF007A] block text-[10px]">(سابقة)</span>}
              </div>
              <span className="text-2xl font-black font-anime block" style={{ color: getZoneColor(backRisk) }}>
                {backRisk}%
              </span>
              <div className="w-full h-2 bg-[#0A0B10] rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${backRisk}%`, backgroundColor: getZoneColor(backRisk) }}></div>
              </div>
            </button>

            {/* Shoulder */}
            <button
              type="button"
              onClick={() => setExpandedZone(expandedZone === 'shoulder' ? null : 'shoulder')}
              className={`p-5 rounded-2xl border text-center space-y-3 transition-all cursor-pointer relative ${
                expandedZone === 'shoulder'
                  ? 'bg-[#181A28] border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                  : 'bg-[#181A28]/80 border-gray-800 hover:border-[#00F0FF]/50 hover:bg-[#181A28]'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-3xl">💪</span>
                <span className="text-[10px] font-anime font-black text-[#00F0FF] uppercase bg-[#0A0B10] px-2 py-0.5 rounded-md border border-[#00F0FF]/20">
                  {expandedZone === 'shoulder' ? 'Active ▲' : 'View Tips ▼'}
                </span>
              </div>
              <div className="text-xs font-bold text-gray-300">
                {t('z_shoulder')} {previousInjuries.shoulder && <span className="text-[#FF007A] block text-[10px]">(سابقة)</span>}
              </div>
              <span className="text-2xl font-black font-anime block" style={{ color: getZoneColor(shoulderRisk) }}>
                {shoulderRisk}%
              </span>
              <div className="w-full h-2 bg-[#0A0B10] rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${shoulderRisk}%`, backgroundColor: getZoneColor(shoulderRisk) }}></div>
              </div>
            </button>

            {/* Hamstring */}
            <button
              type="button"
              onClick={() => setExpandedZone(expandedZone === 'hamstring' ? null : 'hamstring')}
              className={`p-5 rounded-2xl border text-center space-y-3 transition-all cursor-pointer relative ${
                expandedZone === 'hamstring'
                  ? 'bg-[#181A28] border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                  : 'bg-[#181A28]/80 border-gray-800 hover:border-[#00F0FF]/50 hover:bg-[#181A28]'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-3xl">🏃</span>
                <span className="text-[10px] font-anime font-black text-[#00F0FF] uppercase bg-[#0A0B10] px-2 py-0.5 rounded-md border border-[#00F0FF]/20">
                  {expandedZone === 'hamstring' ? 'Active ▲' : 'View Tips ▼'}
                </span>
              </div>
              <div className="text-xs font-bold text-gray-300">
                {t('z_ham')} {previousInjuries.hamstring && <span className="text-[#FF007A] block text-[10px]">(سابقة)</span>}
              </div>
              <span className="text-2xl font-black font-anime block" style={{ color: getZoneColor(hamstringRisk) }}>
                {hamstringRisk}%
              </span>
              <div className="w-full h-2 bg-[#0A0B10] rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${hamstringRisk}%`, backgroundColor: getZoneColor(hamstringRisk) }}></div>
              </div>
            </button>

          </div>

          {/* EXPANDED PANEL WITH DETAILED RECOVERY TIPS & EXERCISES */}
          {expandedZone && (() => {
            const currentZoneRisk = expandedZone === 'knee' ? kneeRisk : expandedZone === 'ankle' ? ankleRisk : expandedZone === 'back' ? backRisk : expandedZone === 'shoulder' ? shoulderRisk : hamstringRisk;
            
            const zoneDetails = {
              knee: {
                icon: '🦵',
                name: currentLang === 'ar' ? 'مفصل الركبة ووتر الصابونة' : 'Knee Joint & Patellar Tendon',
                tips: currentLang === 'ar' 
                  ? 'تدليك عضلات الفخذ الأمامية بالأسطوانة لمدة 3 دقائق. تطبيق الكمادات الباردة عند ارتياع الحرارة، والتركيز على تقوية عضلة VMO قبل التمارين القوية.'
                  : 'Perform quadriceps foam rolling for 3 mins. Apply cold therapy if knee temperature is elevated. Focus on VMO activation before jumping or heavy squatting.',
                exercises: [
                  {
                    name: currentLang === 'ar' ? 'تمديد الركبة النهائي بالرباط المطاطي (TKE)' : 'VMO Terminal Knee Extensions (TKE)',
                    sets: '3 sets x 15 reps',
                    desc: currentLang === 'ar' ? 'تركيز الانقباض على عضلة VMO عند الفرد الكامل للركبة مع رباط مقاومة.' : 'Focus on squeezing the VMO muscle at full lockout using a resistance band.'
                  },
                  {
                    name: currentLang === 'ar' ? 'نزول الساق المنفردة اللامركزي' : 'Eccentric Single-Leg Step Downs',
                    sets: '3 sets x 10 reps',
                    desc: currentLang === 'ar' ? 'نزول بطيء خلال 3-4 ثوانٍ لكل تكرار لتقوية وتر الركبة ضد التمزقات.' : 'Lower body over 3-4 seconds per rep to strengthen the patellar tendon eccentrically.'
                  },
                  {
                    name: currentLang === 'ar' ? 'تدليك الفخذ الأمامي والشريط الحرقفي بالأسطوانة' : 'Quadriceps & IT Band Foam Rolling',
                    sets: '3 mins per leg',
                    desc: currentLang === 'ar' ? 'تدليك بطيء على العقد العضلية لتخفيف الضغط عن صابونة الركبة.' : 'Slow rolling over tight trigger points to release friction on the patella.'
                  }
                ],
                gear: currentLang === 'ar' ? 'دعامة الركبة السيبرانية من أورا المزودة بدعامات جانبية ثلاثية' : 'Aura Cybernetic Knee Sleeve with Dual Lateral Stabilizers'
              },
              ankle: {
                icon: '🦶',
                name: currentLang === 'ar' ? 'أربطة الكاحل ووتر الأكيلس' : 'Ankle Ligaments & Achilles Tendon',
                tips: currentLang === 'ar'
                  ? 'تمارين تحريك الكاحل برسم الحروف وركض الكاحل لتقوية وتر الأكيلس وحمايته من التمزقات أثناء التوقف المفاجئ والقفز.'
                  : 'Perform ankle mobility alphabets and eccentric calf raises to protect the Achilles tendon from micro-tears under explosive deceleration.',
                exercises: [
                  {
                    name: currentLang === 'ar' ? 'إنزال الكعب اللامركزي على الدرجة' : 'Eccentric Heel Drops on Step',
                    sets: '3 sets x 12 reps',
                    desc: currentLang === 'ar' ? 'نزول بطيء في 4 ثوانٍ أسفل مستوى الدرجة لإطالة ألياف وتر الأكيلس وتقويتها.' : 'Slow 4-second lower past step height to elongate and reinforce Achilles tendon fibers.'
                  },
                  {
                    name: currentLang === 'ar' ? 'تمارين الكاحل للداخل والخارج بالرباط المطاطي' : 'Resistance Band Ankle Inversion/Eversion',
                    sets: '3 sets x 15 reps',
                    desc: currentLang === 'ar' ? 'تقوية العضلات المحيطة بالكاحل لمنع التواء المفصل أثناء القتال والركض.' : 'Strengthen peroneus and tibialis muscles to prevent lateral sprains.'
                  },
                  {
                    name: currentLang === 'ar' ? 'دوائر تحريك الكاحل ورسم الحروف' : 'Ankle Mobility Circles & Alphabets',
                    sets: '2 mins per foot',
                    desc: currentLang === 'ar' ? 'تحريك المفصل في كافة الاتجاهات لتنشيط السائل الزلالي داخل الكاحل.' : 'Full range of motion movements to restore synovial joint fluid.'
                  }
                ],
                gear: currentLang === 'ar' ? 'مشد الكاحل الضاغط من أورا مع أحزمة التثبيت الحركية' : 'Aura Ankle Compression Support Wrap with Kinetic Straps'
              },
              back: {
                icon: '🔙',
                name: currentLang === 'ar' ? 'الفقرات القطنية وعضلات الظهر السفلية' : 'Lumbar Spine & Erector Spinae',
                tips: currentLang === 'ar'
                  ? 'فك ضغط فقرات الظهر بالتعلق على العقلة وتمرين القطة والجمل. تجنب الرفعات الثقيلة عند ارتفاع نسبة الحمل التدريبي.'
                  : 'Decompress spinal discs using bar hangs and Cat-Cow mobility flows. Avoid heavy axial loading or deadlifts when ACWR ratio is elevated.',
                exercises: [
                  {
                    name: currentLang === 'ar' ? 'تمرين حشرة الميت لشد عضلات الجذع' : 'Deadbug Core Bracing Hold',
                    sets: '3 sets x 45 secs',
                    desc: currentLang === 'ar' ? 'الحفاظ على استقامة الظهر ملتصقاً بالأرض مع تمديد الأطراف لتثبيت الفقرات.' : 'Maintain flat spine against floor while extending opposing limbs to stabilize spine.'
                  },
                  {
                    name: currentLang === 'ar' ? 'تمرين القطة والجمل لليونة العمود الفقري' : 'Cat-Cow Spinal Mobility Flow',
                    sets: '3 sets x 10 cycles',
                    desc: currentLang === 'ar' ? 'تحريك مرن ومتحكم للفقرات لتخفيف الضغط عن أسفل الظهر.' : 'Gentle articulation of each spinal vertebra to relieve lumbar tension.'
                  },
                  {
                    name: currentLang === 'ar' ? 'التعلق الساكن على العقلة لفك ضغط الفقرات' : 'Passive Bar Spinal Decompression Hang',
                    sets: '3 sets x 30 secs',
                    desc: currentLang === 'ar' ? 'استغلال الجاذبية لزيادة المسافة بين الفقرات وتخفيف الألم.' : 'Allow gravity to decompress intervertebral discs safely.'
                  }
                ],
                gear: currentLang === 'ar' ? 'حزام الظهر الأرغونومي الحراري من أورا لدعم العمود الفقري' : 'Aura Ergonomic Lumbar Belt & Thermal Posture Harness'
              },
              shoulder: {
                icon: '💪',
                name: currentLang === 'ar' ? 'الكفة المدورة وعضلة الكتف الأمامية' : 'Rotator Cuff & Anterior Deltoid',
                tips: currentLang === 'ar'
                  ? 'تسخين الكفة المدورة بدوران الكابل الخارجي وانزلاق الكتف على الحائط قبل تمارين اللكم والضغط والرمي القوي.'
                  : 'Warm up rotator cuff muscles with external rotations and scapular wall slides before heavy striking, throwing, or pressing sessions.',
                exercises: [
                  {
                    name: currentLang === 'ar' ? 'الدوران الخارجي للكتف بالرباط المطاطي' : 'Banded External Rotations',
                    sets: '3 sets x 15 reps',
                    desc: currentLang === 'ar' ? 'تثبيت الكوع بجانب الجسم مع تدوير الساعد للخارج لتقوية الكفة المدورة.' : 'Keep elbow glued to ribcage while rotating forearm outward.'
                  },
                  {
                    name: currentLang === 'ar' ? 'انزلاق لوحي الكتف على الحائط' : 'Scapular Wall Slides',
                    sets: '3 sets x 12 reps',
                    desc: currentLang === 'ar' ? 'الحفاظ على ملامسة الظهر واليدين للحائط لتنشيط عضلات الكتف الخلفية.' : 'Maintain full contact with wall to activate lower traps and serratus anterior.'
                  },
                  {
                    name: currentLang === 'ar' ? 'إطالة الصدر على الباب وتدليك أعلى الظهر' : 'Pec Doorway Stretch & Thoracic Roll',
                    sets: '3 mins total',
                    desc: currentLang === 'ar' ? 'فتح عضلات الصدر وتعديل استقامة القفص الصدري لمنع انحشار عصب الكتف.' : 'Opens chest and restores thoracic extension to prevent shoulder impingement.'
                  }
                ],
                gear: currentLang === 'ar' ? 'مشد الكتف الحركي المطور لحماية الكفة المدورة من أورا' : 'Aura Kinetic Shoulder Stabilization Strap & Rotator Guard'
              },
              hamstring: {
                icon: '🏃',
                name: currentLang === 'ar' ? 'عضلات الفخذ الخلفية (الهامسترنج)' : 'Biceps Femoris & Semitendinosus',
                tips: currentLang === 'ar'
                  ? 'إضافة تمارين نورديك هامتسرنج للقوة اللامركزية مع الإطالات المتحركة للوقاية من التمزق أثناء الانطلاق السريع أو الركل.'
                  : 'Incorporate Nordic hamstring curls for eccentric strength and dynamic mobility stretches to prevent high-speed sprinting or kicking pulls.',
                exercises: [
                  {
                    name: currentLang === 'ar' ? 'تمرين نورديك الفخذ الخلفي المساعد' : 'Assisted Nordic Hamstring Curls',
                    sets: '3 sets x 6 reps',
                    desc: currentLang === 'ar' ? 'مقاومة السقوط للأمام لأطول فترة ممكنة لبناء قوة فرملة هائلة في الفخذ الخلفي.' : 'Resist forward fall as long as possible focusing on eccentric braking power.'
                  },
                  {
                    name: currentLang === 'ar' ? 'الرفعة الميتة الرومانية بساق واحدة' : 'Bodyweight Single-Leg RDL',
                    sets: '3 sets x 10 reps',
                    desc: currentLang === 'ar' ? 'الانحناء من الورك مع ظهر مستقيم لتقوية نقطة التقاء الفخذ الخلفي مع الأرداف.' : 'Hinge at hips with flat back to strengthen glute-hamstring tie-in.'
                  },
                  {
                    name: currentLang === 'ar' ? 'الإطالة العزل النشطة للفخذ الخلفي' : 'Active Isolated Hamstring Stretch',
                    sets: '3 sets x 30 secs',
                    desc: currentLang === 'ar' ? 'انقباض عضلات الفخذ الأمامية لإطالة العضلات الخلفية بمرونة وبدون إجهاد.' : 'Contract quads to actively stretch opposing hamstring muscle without strain.'
                  }
                ],
                gear: currentLang === 'ar' ? 'مشد الفخذ الضاغط الحراري للوقاية من التمزق العضلي' : 'Aura Thermal Compression Hamstring & Thigh Sleeve'
              }
            }[expandedZone];

            return (
              <div className="bg-[#181A28] border-2 border-[#00F0FF] rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.25)] animate-fadeIn space-y-6 relative">
                
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-[#0A0B10] border border-[#00F0FF]/30 rounded-xl">{zoneDetails.icon}</span>
                    <div>
                      <span className="text-xs font-black font-anime text-[#00F0FF] block">
                        {currentLang === 'ar' ? 'بروتوكول الاستشفاء المباشر للمنطقة' : 'SPECIFIC RECOVERY PROTOCOL'}
                      </span>
                      <h4 className="text-xl font-black font-anime text-white">
                        {zoneDetails.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-black font-anime"
                      style={{ 
                        backgroundColor: `${getZoneColor(currentZoneRisk)}22`, 
                        color: getZoneColor(currentZoneRisk), 
                        border: `1px solid ${getZoneColor(currentZoneRisk)}` 
                      }}
                    >
                      {currentLang === 'ar' ? 'نسبة الإجهاد:' : 'Zone Stress:'} {currentZoneRisk}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedZone(null)}
                      className="px-3 py-1 bg-[#0A0B10] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500 rounded-lg text-xs font-bold transition-all"
                    >
                      ✕ {currentLang === 'ar' ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                </div>

                {/* Specific Recovery Guidance */}
                <div className="bg-[#0A0B10] p-4 rounded-xl border border-[#00F0FF]/30">
                  <h5 className="text-xs font-black font-anime text-[#FFE600] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span>⚡</span>
                    <span>{currentLang === 'ar' ? 'توصيات أورا للتعافي السريع وتخفيف الحمل:' : 'AURA RECOVERY RECOMMENDATIONS:'}</span>
                  </h5>
                  <p className="text-sm text-gray-200 font-bold leading-relaxed">
                    {zoneDetails.tips}
                  </p>
                </div>

                {/* Target Exercises */}
                <div>
                  <h5 className="text-xs font-black font-anime text-[#00F0FF] uppercase tracking-wider mb-3">
                    🏋️ {currentLang === 'ar' ? 'التمارين العلاجية والوقائية الموصى بها:' : 'RECOMMENDED REHAB & STRENGTHENING EXERCISES:'}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {zoneDetails.exercises.map((ex, idx) => (
                      <div key={idx} className="bg-[#12131C] p-4 rounded-xl border border-gray-800 space-y-2 hover:border-[#00F0FF]/40 transition-all">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xs font-black text-white font-anime leading-tight">{ex.name}</span>
                          <span className="text-[10px] font-black font-anime text-[#FFE600] bg-[#181A28] px-2 py-0.5 rounded border border-[#FFE600]/30 shrink-0">
                            {ex.sets}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold leading-relaxed">
                          {ex.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Gear */}
                <div className="pt-2 border-t border-gray-800 flex flex-wrap justify-between items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-[#FF007A]">🛡️ {currentLang === 'ar' ? 'العتاد الوقائي المقترح:' : 'Recommended Gear:'}</span>
                    <span className="text-white font-anime">{zoneDetails.gear}</span>
                  </div>
                  <span className="text-[#00F0FF] text-[11px] font-anime">
                    AURA BIOMETRIC RECOVERY SYSTEM v2.0
                  </span>
                </div>

              </div>
            );
          })()}

        </div>

        {/* Sleep & Muscle Recovery Science Lab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-8 bg-[#12131C] p-8 rounded-3xl border border-[#FFE600]/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <span className="text-xs font-black text-[#FFE600] font-anime block mb-1">{t('sleep_tag')}</span>
                <h3 className="text-2xl font-black font-anime text-white">{t('sleep_title')}</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#181A28] px-3 py-1.5 rounded-xl border border-gray-800 text-xs font-bold">
                  <span className="text-gray-400">{currentLang === 'ar' ? 'نقاط الاستشفاء: ' : 'Recovery Score: '}</span>
                  <span className="text-[#00F0FF] font-anime">{muscleRecoveryScore}%</span>
                </div>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFE600" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FFE600" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#25283D" vertical={false} />
                  <XAxis dataKey="day" stroke="#8E93B0" fontSize={12} tickLine={false} />
                  <YAxis stroke="#8E93B0" fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#181A28', borderColor: '#FFE600', borderRadius: '12px', color: '#FFF' }} />
                  <Area type="monotone" dataKey="score" stroke="#FFE600" strokeWidth={3} fillOpacity={1} fill="url(#sleepGrad)" name={currentLang === 'ar' ? 'درجة جودة النوم' : 'Sleep Score'} />
                  <Area type="monotone" dataKey="recovery" stroke="#00F0FF" strokeWidth={2} fillOpacity={0.3} fill="#00F0FF" name={currentLang === 'ar' ? 'نسبة التعافي العضلي %' : 'Muscle Recovery %'} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#12131C] p-8 rounded-3xl border border-[#FF007A]/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-black font-anime text-[#FF007A] mb-4">{t('disorders')}</h4>
              
              <div className="space-y-4">
                {disorders.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#181A28] border border-[#00F0FF]/30 text-xs font-bold text-[#00F0FF]">
                    {t('no_disorders')}
                  </div>
                ) : (
                  disorders.map((d, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#181A28] border border-[#FF007A]/30">
                      <h5 className="font-bold text-white text-sm mb-1">{d.title}</h5>
                      <p className="text-xs text-gray-300 leading-relaxed">{d.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <h5 className="text-xs font-black text-[#00F0FF] mb-2 font-anime">{t('ai_recs')} (AURA COACH)</h5>
              <ul className="space-y-2 text-xs font-bold text-gray-300">
                <li>{t('rec1')}</li>
                <li>{t('rec2')}</li>
                <li>{t('rec3')}</li>
              </ul>
            </div>
          </div>

        </div>

        {/* ANNUAL MEMBERSHIP & YARDX REWARDS SHOWCASE */}
        <div id="pricing" className="mt-16 bg-[#12131C] p-8 md:p-12 rounded-3xl border-2 border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.25)]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="px-4 py-1.5 rounded-full bg-[#181A28] border border-[#FFE600] text-xs font-black text-[#FFE600] font-anime inline-block mb-3">
              ⚡ {t('sub_title')}
            </span>
            <h3 className="text-3xl md:text-5xl font-black font-anime text-white mb-4">
              {t('sub_title')}
            </h3>
            <p className="text-sm md:text-base text-gray-300 font-bold">
              {t('sub_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Starter Pass ($180 / year) */}
            <div className="bg-[#181A28] p-8 rounded-2xl border border-gray-700 hover:border-[#00F0FF] transition-all flex flex-col justify-between relative group">
              <div>
                <span className="text-xs font-black text-[#00F0FF] uppercase tracking-widest font-anime block mb-2">
                  STARTER PASSPORT
                </span>
                <h4 className="text-2xl font-black text-white font-anime mb-2">
                  {t('sub_starter_title')}
                </h4>
                <p className="text-xs text-gray-400 font-bold mb-6">
                  {t('sub_starter_desc')}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-black font-anime text-[#00F0FF]">
                    $180
                  </span>
                  <span className="text-xs font-bold text-gray-400 ml-2">
                    / year ($15/mo)
                  </span>
                </div>

                <ul className="space-y-3 text-xs font-bold text-gray-300 mb-8">
                  <li className="flex items-center gap-2 text-[#00F0FF]">
                    <span>✓</span> {t('yard_title')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> ACWR & HRV Load Monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> Basic YARDX Rewards (10 YARDX / session)
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> Wearable Sync (Apple Watch / Whoop)
                  </li>
                </ul>
              </div>

              <button className="w-full py-4 bg-[#12131C] hover:bg-[#00F0FF] hover:text-[#0A0B10] border border-[#00F0FF] text-[#00F0FF] font-black text-sm font-anime rounded-xl transition-all">
                SUBSCRIBE STARTER — $180 / YEAR
              </button>
            </div>

            {/* S-Rank Pro Pass ($340 / year) */}
            <div className="bg-gradient-to-b from-[#1E1735] to-[#181A28] p-8 rounded-2xl border-2 border-[#FF007A] shadow-[0_0_25px_rgba(255,0,122,0.3)] flex flex-col justify-between relative group">
              <div className="absolute -top-3 right-6 bg-[#FF007A] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-anime shadow-[0_0_10px_#FF007A]">
                ULTIMATE S-RANK
              </div>

              <div>
                <span className="text-xs font-black text-[#FFE600] uppercase tracking-widest font-anime block mb-2">
                  PRO CHAMPION PASSPORT
                </span>
                <h4 className="text-2xl font-black text-white font-anime mb-2">
                  {t('sub_pro_title')}
                </h4>
                <p className="text-xs text-gray-300 font-bold mb-6">
                  {t('sub_pro_desc')}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-black font-anime text-[#FFE600] neon-text-yellow">
                    $340
                  </span>
                  <span className="text-xs font-bold text-gray-400 ml-2">
                    / year ($28.33/mo)
                  </span>
                </div>

                <ul className="space-y-3 text-xs font-bold text-gray-200 mb-8">
                  <li className="flex items-center gap-2 text-[#FFE600]">
                    <span>⚡</span> 2x YARDX Token Multiplier (50 YARDX / session)
                  </li>
                  <li className="flex items-center gap-2 text-[#FF007A]">
                    <span>⚡</span> Captain Aura S-Rank Live AI Guidance
                  </li>
                  <li className="flex items-center gap-2 text-[#00F0FF]">
                    <span>⚡</span> Full VR Combat Matrix & Boxing HUD
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <span>⚡</span> Priority Gear Store Access & VIP Leaderboards
                  </li>
                </ul>
              </div>

              <button className="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-black font-black text-sm font-anime rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all cursor-pointer hover:scale-[1.01] active:scale-95">
                SUBSCRIBE PRO — $340 / YEAR ⚡
              </button>
            </div>

          </div>

          {/* YARDX Rewards Banner */}
          <div className="mt-10 p-6 rounded-2xl bg-[#181A28] border border-[#FFE600]/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFE600] to-[#FF007A] flex items-center justify-center text-3xl shadow-[0_0_15px_#FFE600]">
                🪙
              </div>
              <div>
                <h4 className="text-xl font-black text-white font-anime">
                  {t('yardx_currency')} Rewards Currency Engine
                </h4>
                <p className="text-xs text-[#00F0FF] font-bold">
                  {t('yardx_reward_info')}
                </p>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#12131C] border border-[#FFE600] rounded-xl text-center">
              <span className="text-xs text-gray-400 font-bold block">Current Balance:</span>
              <span className="text-2xl font-black text-[#FFE600] font-anime">1,250 YARDX</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default YardCombatEngine;
