import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Smartphone, 
  Watch, 
  Flame, 
  ShieldAlert, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Bell 
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { SAMURAI_RONIN_IMAGE, NINJA_KUNOICHI_IMAGE, YARD300_BRAND_LOGO, handleImageError } from '../constants';
import { getLaunchTargetTimestamp, calculateLaunchTimeRemaining, LaunchTimeRemaining } from '../utils/launchCountdown';

interface LaunchAnnouncementModalProps {
  currentLang?: Language;
}

export const LaunchAnnouncementModal: React.FC<LaunchAnnouncementModalProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Automatic 28-Day Real-Time Countdown logic
  const [targetMs] = useState<number>(() => getLaunchTargetTimestamp());
  const [timeLeft, setTimeLeft] = useState<LaunchTimeRemaining>(() => calculateLaunchTimeRemaining(targetMs));

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('yard300_launch_ad_dismissed');
    if (!isDismissed) {
      // Show after 1.2 seconds for realistic non-blocking entrance
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateLaunchTimeRemaining(targetMs));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetMs]);

  const handleClose = () => {
    soundFX.playButtonClick();
    setIsOpen(false);
    sessionStorage.setItem('yard300_launch_ad_dismissed', 'true');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    soundFX.playButtonClick();
    setIsSubscribed(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={handleClose}></div>

      {/* Ad Box - Blood Red & Obsidian Theme */}
      <div 
        className="relative w-full max-w-2xl bg-[#0A0B10] border-2 border-[#E50914] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(229,9,20,0.45)] z-10 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Blood Red & Gold Accent Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-[#E50914] via-[#FFE600] to-[#E50914]"></div>

        {/* Close Button - Google Ad Style */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-[#181A24] border border-gray-700 hover:border-[#E50914] text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95"
          title={isAr ? 'إغلاق الإعلان' : 'Close Ad'}
        >
          <X className="w-5 h-5 text-[#FFE600]" />
        </button>

        {/* Ad Tag Badge */}
        <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#181A24]/90 border border-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>{isAr ? 'إعلان الإطلاق الرسمي' : 'OFFICIAL ANNOUNCEMENT'}</span>
        </div>

        <div className="p-6 md:p-8 pt-12 md:pt-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Graphic with Samurai / Ninja theme */}
            <div className="md:col-span-5 relative flex items-center justify-center">
              <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden border-2 border-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.5)]">
                <img 
                  src={SAMURAI_RONIN_IMAGE} 
                  alt="YARD300 Samurai Warrior" 
                  onError={handleImageError}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="text-[10px] font-black font-anime text-[#FFE600] tracking-widest uppercase bg-black/70 px-2 py-0.5 rounded border border-[#FFE600]/40">
                    {isAr ? 'محارب الساموراي 2050' : 'CYBER SAMURAI 2050'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="md:col-span-7 space-y-4 text-start">
              
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#FFE600] shrink-0 shadow-[0_0_10px_#FFE600] bg-black">
                  <img src={YARD300_BRAND_LOGO} alt="YARD 300" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/20 border border-[#E50914] text-[#FFE600] text-xs font-black font-anime uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 fill-[#E50914] text-[#E50914] animate-bounce" />
                  <span>{isAr ? `الإطلاق الرسمي بعد ${timeLeft.days} يوماً` : `OFFICIAL LAUNCH IN ${timeLeft.days} DAYS`}</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-black font-anime text-white leading-tight">
                {isAr ? (
                  <>تطبيق <span className="text-[#E50914] neon-text-red">YARD300</span> على App Store & Google Play!</>
                ) : (
                  <>THE <span className="text-[#E50914] neon-text-red">YARD300</span> APP IS COMING TO iOS & ANDROID!</>
                )}
              </h3>

              <p className="text-xs md:text-sm text-gray-300 font-bold leading-relaxed">
                {isAr
                  ? 'اربط ساعتك الذكية (Apple Watch, Garmin, WHOOP) لمراقبة المؤشرات الحيوية بالذكاء الاصطناعي وتفادي الإصابات قبل حدوثها.'
                  : 'Sync your Apple Watch, Garmin or WHOOP to harness real-time AI injury prevention & combat bio-metrics.'
                }
              </p>

              {/* 17-Day Countdown Cards */}
              <div className="grid grid-cols-4 gap-2 text-center py-1">
                <div className="p-2 rounded-xl bg-[#141624] border border-[#E50914]/40">
                  <span className="block text-xl font-black font-anime text-[#FFE600]">{timeLeft.days}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{isAr ? 'يوم' : 'DAYS'}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#141624] border border-gray-800">
                  <span className="block text-xl font-black font-anime text-white">{timeLeft.hours}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{isAr ? 'ساعة' : 'HRS'}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#141624] border border-gray-800">
                  <span className="block text-xl font-black font-anime text-white">{timeLeft.minutes}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{isAr ? 'دقيقة' : 'MIN'}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#141624] border border-[#E50914]/40">
                  <span className="block text-xl font-black font-anime text-[#E50914]">{timeLeft.seconds}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{isAr ? 'ثانية' : 'SEC'}</span>
                </div>
              </div>

              {/* Email Early Access Subscription */}
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 pt-1">
                  <input 
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={isAr ? 'بريدك الإلكتروني للتسجيل المبكر...' : 'Enter email for VIP early access...'}
                    className="flex-1 bg-[#141624] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#b00710] text-white font-black font-anime text-xs transition-all shadow-[0_0_15px_rgba(229,9,20,0.5)] shrink-0 cursor-pointer"
                  >
                    {isAr ? 'سجّلني ⚡' : 'NOTIFY ME'}
                  </button>
                </form>
              ) : (
                <div className="p-3 rounded-xl bg-[#141624] border border-[#FFE600] flex items-center gap-2 text-xs font-bold text-[#FFE600]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#FFE600]" />
                  <span>{isAr ? 'تم تسجيل بريدك بنجاح! ستكون أول المحاربين تجربة للتطبيق.' : 'VIP Access Confirmed! You are on the priority beta list.'}</span>
                </div>
              )}

              {/* Bottom Quick Disclaimer */}
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span>{isAr ? '⚡ احصل على 500 YARDX مجانية عند التحميل' : '⚡ 500 Free YARDX on Day 1 download'}</span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white underline cursor-pointer"
                >
                  {isAr ? 'المتابعة للموقع' : 'Continue to site'}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
