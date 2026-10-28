import React, { useState, useEffect } from 'react';
import { Smartphone, Watch, ShieldAlert, Sparkles, Activity, CheckCircle2, Clock, Zap } from 'lucide-react';
import { Language } from '../i18n';
import { getLaunchTargetTimestamp, calculateLaunchTimeRemaining, LaunchTimeRemaining } from '../utils/launchCountdown';

interface MobileAppNoticeProps {
  currentLang?: Language;
}

export const MobileAppNotice: React.FC<MobileAppNoticeProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';

  // 28 days automatic real-time countdown
  const [targetMs] = useState<number>(() => getLaunchTargetTimestamp());
  const [timeLeft, setTimeLeft] = useState<LaunchTimeRemaining>(() => calculateLaunchTimeRemaining(targetMs));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateLaunchTimeRemaining(targetMs));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetMs]);

  const supportedDevices = [
    { name: 'Apple Watch', icon: '⌚' },
    { name: 'Garmin', icon: '📡' },
    { name: 'WHOOP 4.0', icon: '⚡' },
    { name: 'Galaxy Watch', icon: '🌌' },
    { name: 'Fitbit Sense', icon: '💚' },
    { name: 'Aura / Oura Ring', icon: '💍' },
  ];

  return (
    <section className={`my-12 px-6 md:px-12 max-w-[1800px] mx-auto ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#121422] via-[#0A0B10] to-[#180A22] border-2 border-[#00F0FF]/50 p-8 md:p-12 shadow-[0_0_50px_rgba(0,240,255,0.25)]">
        
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF007A]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00F0FF]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141622] border border-[#FF007A] text-xs font-black text-[#FF007A] uppercase tracking-widest">
              <Sparkles className="w-4 h-4 animate-spin text-[#FFE600]" />
              <span>{isAr ? 'إطلاق التطبيق الرسمي قريبًا' : 'OFFICIAL MOBILE APP LAUNCH'}</span>
            </div>

            <h3 className="text-3xl md:text-5xl font-black font-anime text-white leading-tight">
              {isAr ? (
                <>
                  تطبيق <span className="text-[#FFE600] font-black">YARD300 AURA</span> سينطلق على Google Play و App Store خلال {timeLeft.days} يومًا!
                </>
              ) : (
                <>
                  <span className="text-[#FFE600] font-black">YARD300 AURA</span> App Launching on Google Play & App Store in {timeLeft.days} Days!
                </>
              )}
            </h3>

            <p className="text-gray-300 font-bold text-base md:text-lg leading-relaxed">
              {isAr 
                ? 'يتصل التطبيق مباشرة وبشكل لحظي بكافة الأجهزة والساعات الرياضية الذكية لقياس المؤشرات الحيوية وحساب طاقة الهالة ومخاطر الإصابة أثناء القتال والتمارين.'
                : 'Connects directly and in real-time with all major wearables and smart health devices to measure bio-indicators, aura power, and injury risks live.'}
            </p>

            {/* Supported Wearables Badges */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black uppercase text-[#00F0FF] tracking-wider block">
                {isAr ? '🌐 الأجهزة والمستشعرات المعتمدة للقراءات الحيوية المباشرة:' : '🌐 Compatible Live Biometric Devices & Sensors:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {supportedDevices.map((dev, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1D2E] border border-gray-700 hover:border-[#00F0FF] rounded-xl text-xs font-bold text-white transition-all shadow-sm">
                    <span>{dev.icon}</span>
                    <span>{dev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Baseline Data Warning Callout */}
            <div className="p-5 rounded-2xl bg-[#1A1024] border-l-4 border-[#FFE600] text-gray-200 space-y-2 shadow-lg">
              <div className="flex items-center gap-2 text-[#FFE600] font-black text-sm uppercase">
                <ShieldAlert className="w-5 h-5 text-[#FFE600]" />
                <span>{isAr ? 'ملاحظة هامة لحساب النتائج والدقة الحيوية:' : 'CRITICAL BIOMETRIC NOTICE:'}</span>
              </div>
              <p className="text-xs md:text-sm font-bold text-gray-300 leading-relaxed">
                {isAr
                  ? 'لا يمكن إعطاء أول نتيجة تقييم وتحديد طاقة الهالة الحيوية الخاصة بك إلا بعد متابعة وتحليل بياناتك الحيوية بشكل مستمر لمدة 7 أيام متواصلة لضمان دقة خوارزمية الذكاء الاصطناعي.'
                  : 'Your initial S-Rank aura evaluation & baseline performance analysis can only be issued after 7 consecutive days of active biometric data tracking.'}
              </p>
            </div>
          </div>

          {/* Right Column: Countdown Box & App Store Badges */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 bg-[#0E0F1A] p-6 md:p-8 rounded-2xl border border-gray-800 shadow-2xl text-center">
            
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#00F0FF]">
              <Clock className="w-4 h-4 text-[#FF007A]" />
              <span>{isAr ? 'العد التنازلي للإطلاق' : 'OFFICIAL COUNTDOWN TO LAUNCH'}</span>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-3 w-full">
              <div className="bg-[#181A2A] border border-[#FF007A]/50 p-3 rounded-xl flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-black font-anime text-[#FFE600]">{timeLeft.days}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{isAr ? 'يوم' : 'DAYS'}</span>
              </div>
              <div className="bg-[#181A2A] border border-[#FF007A]/50 p-3 rounded-xl flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-black font-anime text-[#00F0FF]">{timeLeft.hours}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{isAr ? 'ساعة' : 'HRS'}</span>
              </div>
              <div className="bg-[#181A2A] border border-[#FF007A]/50 p-3 rounded-xl flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-black font-anime text-[#FF007A]">{timeLeft.minutes}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{isAr ? 'دقيقة' : 'MINS'}</span>
              </div>
              <div className="bg-[#181A2A] border border-[#FF007A]/50 p-3 rounded-xl flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-black font-anime text-white animate-pulse">{timeLeft.seconds}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{isAr ? 'ثانية' : 'SECS'}</span>
              </div>
            </div>

            {/* Store Buttons Links */}
            <div className="w-full space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://apps.apple.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#1B1D2E] hover:bg-[#25283E] border border-gray-700 hover:border-[#00F0FF] rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all group"
                >
                  <span className="text-2xl">🍏</span>
                  <div className="text-left">
                    <span className="text-[10px] text-gray-400 uppercase block font-bold">App Store</span>
                    <span className="text-xs font-black text-white group-hover:text-[#00F0FF]">Download iOS</span>
                  </div>
                </a>

                <a 
                  href="https://play.google.com/store" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#1B1D2E] hover:bg-[#25283E] border border-gray-700 hover:border-[#00F0FF] rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all group"
                >
                  <span className="text-2xl">🤖</span>
                  <div className="text-left">
                    <span className="text-[10px] text-gray-400 uppercase block font-bold">Google Play</span>
                    <span className="text-xs font-black text-white group-hover:text-[#00F0FF]">Download Android</span>
                  </div>
                </a>
              </div>

              <div className="p-3 bg-[#141624] rounded-xl border border-[#00F0FF]/30 flex items-center justify-center gap-2 text-xs font-bold text-[#00F0FF]">
                <Zap className="w-4 h-4 text-[#FFE600]" />
                <span>{isAr ? 'سجل بريدك الآن لتفعيل اشتراك الأبطال التجريبي!' : 'Pre-register now for 30-day Free S-Rank Access!'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
