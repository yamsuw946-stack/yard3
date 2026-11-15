import React, { useState, useEffect } from 'react';
import { Smartphone, ShieldAlert, CheckCircle2, Clock, Zap } from 'lucide-react';
import { Language, tr } from '../i18n';
import { getLaunchTargetTimestamp, calculateLaunchTimeRemaining, LaunchTimeRemaining } from '../utils/launchCountdown';

interface MobileAppNoticeProps {
  currentLang?: Language;
}

export const MobileAppNotice: React.FC<MobileAppNoticeProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';

  const [targetMs] = useState<number>(() => getLaunchTargetTimestamp());
  const [timeLeft, setTimeLeft] = useState<LaunchTimeRemaining>(() => calculateLaunchTimeRemaining(targetMs));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateLaunchTimeRemaining(targetMs));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetMs]);

  const supportedDevices = [
    'Apple Watch',
    'Garmin',
    'WHOOP 4.0',
    'Galaxy Watch',
    'Fitbit Sense',
    'Oura Ring'
  ];

  return (
    <section className={`my-4 px-3 sm:px-5 md:px-6 max-w-[1680px] mx-auto ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="relative rounded-2xl overflow-hidden bg-[#0C0E14] border border-white/[0.08] p-4 sm:p-6 shadow-xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em]">
              <Smartphone className="w-3.5 h-3.5" />
              <span>
                {tr(currentLang, {
                  en: 'OFFICIAL MOBILE APP LAUNCH',
                  es: 'LANZAMIENTO OFICIAL DE LA APP MÓVIL',
                  fr: 'LANCEMENT OFFICIEL DE L’APPLICATION',
                  ar: 'إطلاق التطبيق الرسمي قريبًا'
                })}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-extrabold text-white leading-snug">
              {tr(currentLang, {
                en: `YARD300 AURA App Launching on iOS & Android in ${timeLeft.days} Days`,
                es: `La App YARD300 AURA llega a iOS y Android en ${timeLeft.days} días`,
                fr: `L’app YARD300 AURA arrive sur iOS & Android dans ${timeLeft.days} jours`,
                ar: `تطبيق YARD300 AURA سينطلق على Google Play و App Store خلال ${timeLeft.days} يومًا`
              })}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {tr(currentLang, {
                en: 'Syncs in real time with major wearables and smart health sensors to measure bio-indicators, aura power, and ACWR injury risk live.',
                es: 'Se conecta en tiempo real con relojes inteligentes y sensores biométricos para medir tu rendimiento y riesgo ACWR al instante.',
                fr: 'Se connecte en temps réel aux montres et capteurs biométriques pour mesurer vos indicateurs vitaux et risques ACWR.',
                ar: 'يتصل التطبيق مباشرة بكافة الأجهزة والساعات الرياضية الذكية لقياس المؤشرات الحيوية ومخاطر الإصابة لحظياً.'
              })}
            </p>

            {/* Supported Wearables Badges */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase text-[#10B981] tracking-wider block">
                {tr(currentLang, {
                  en: 'COMPATIBLE LIVE BIOMETRIC SENSORS:',
                  es: 'SENSORES BIOMÉTRICOS COMPATIBLES:',
                  fr: 'CAPTEURS BIOMÉTRIQUES COMPATIBLES :',
                  ar: 'الأجهزة والمستشعرات المعتمدة للقراءات الحيوية:'
                })}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {supportedDevices.map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#12151E] border border-white/[0.08] rounded-lg text-[11px] font-semibold text-slate-200"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Baseline Data Callout (Hairline border, no heavy border-l-4) */}
            <div className="p-3 rounded-xl bg-[#07080C] border border-[#D4AF37]/35 text-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold text-[11px] uppercase">
                <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {tr(currentLang, {
                    en: '7-DAY BIOMETRIC CALIBRATION PROTOCOL',
                    es: 'PROTOCOLO DE CALIBRACIÓN DE 7 DÍAS',
                    fr: 'PROTOCOLE DE CALIBRATION 7 JOURS',
                    ar: 'بروتوكول المعايرة الحيوية لمدة 7 أيام'
                  })}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tr(currentLang, {
                  en: 'Initial S-Rank evaluation is issued after 7 consecutive days of continuous wearable telemetry.',
                  es: 'La evaluación inicial S-Rank se emite tras 7 días consecutivos de telemetría biométrica activa.',
                  fr: 'L’évaluation initiale S-Rank est délivrée après 7 jours consécutifs de suivi biométrique.',
                  ar: 'تُصدر أول نتيجة تقييم متكاملة بعد متابعة بياناتك الحيوية لمدة 7 أيام متواصلة لضمان الدقة السريرية.'
                })}
              </p>
            </div>
          </div>

          {/* Right Column: Compact Countdown Box & Store Links */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3.5 bg-[#07080C] p-4 sm:p-5 rounded-xl border border-white/[0.08] text-center">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {tr(currentLang, {
                  en: 'OFFICIAL LAUNCH COUNTDOWN',
                  es: 'CUENTA REGRESIVA OFICIAL',
                  fr: 'COMPTE À REBOURS OFFICIEL',
                  ar: 'العد التنازلي للإطلاق'
                })}
              </span>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-2 w-full">
              <div className="bg-[#12151E] border border-white/[0.08] p-2.5 rounded-lg flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold font-mono tabular-nums text-[#D4AF37]">{timeLeft.days}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">
                  {tr(currentLang, { en: 'DAYS', es: 'DÍAS', fr: 'JOURS', ar: 'يوم' })}
                </span>
              </div>
              <div className="bg-[#12151E] border border-white/[0.08] p-2.5 rounded-lg flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold font-mono tabular-nums text-[#10B981]">{timeLeft.hours}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">
                  {tr(currentLang, { en: 'HRS', es: 'HRS', fr: 'HRS', ar: 'ساعة' })}
                </span>
              </div>
              <div className="bg-[#12151E] border border-white/[0.08] p-2.5 rounded-lg flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold font-mono tabular-nums text-white">{timeLeft.minutes}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">
                  {tr(currentLang, { en: 'MINS', es: 'MIN', fr: 'MIN', ar: 'دقيقة' })}
                </span>
              </div>
              <div className="bg-[#12151E] border border-white/[0.08] p-2.5 rounded-lg flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold font-mono tabular-nums text-slate-300">{timeLeft.seconds}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">
                  {tr(currentLang, { en: 'SECS', es: 'SEG', fr: 'SEC', ar: 'ثانية' })}
                </span>
              </div>
            </div>

            {/* Store Links */}
            <div className="w-full space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#12151E] hover:bg-[#191E2D] border border-white/[0.1] hover:border-[#D4AF37]/50 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <div className="text-start">
                    <span className="text-[9px] text-slate-400 uppercase block font-mono">App Store</span>
                    <span className="text-[11px] font-bold text-white">
                      {tr(currentLang, { en: 'Download iOS', es: 'Descargar iOS', fr: 'Télécharger iOS', ar: 'تنزيل iOS' })}
                    </span>
                  </div>
                </a>

                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#12151E] hover:bg-[#191E2D] border border-white/[0.1] hover:border-[#10B981]/50 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <div className="text-start">
                    <span className="text-[9px] text-slate-400 uppercase block font-mono">Google Play</span>
                    <span className="text-[11px] font-bold text-white">
                      {tr(currentLang, { en: 'Download Android', es: 'Descargar Android', fr: 'Télécharger Android', ar: 'تنزيل أندرويد' })}
                    </span>
                  </div>
                </a>
              </div>

              <div className="p-2.5 bg-[#12151E] rounded-lg border border-white/[0.08] flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#D4AF37]">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {tr(currentLang, {
                    en: 'Pre-register for 30-day Free S-Rank Access',
                    es: 'Pre-regístrate para 30 días gratis S-Rank',
                    fr: 'Préinscrivez-vous pour 30 jours S-Rank gratuits',
                    ar: 'سجل بريدك لتفعيل 30 يوم اشتراك تجريبي مجاني'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
