import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Award, 
  Flame, 
  Zap, 
  Calendar, 
  Clock, 
  Trophy, 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  HeartPulse
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { 
  TARIK_SAIYAN_IMAGE, 
  FOUNDER_YAM_SUW_IMAGE, 
  BOXING_VALKYRIE_IMAGE,
  handleImageError 
} from '../constants';

interface ChampionStoryHubProps {
  currentLang?: Language;
  onBackToHome?: () => void;
  onExploreLeaderboard?: () => void;
  onExploreProducts?: () => void;
}

interface MonthlyChampionData {
  id: string;
  monthEn: string;
  monthAr: string;
  year: number;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  avatar: string;
  videoThumbnail: string;
  videoDuration: string;
  powerScore: number;
  workoutHours: number;
  streakDays: number;
  acwr: string;
  country: string;
  flag: string;
  quoteEn: string;
  quoteAr: string;
  bioEn: string;
  bioAr: string;
  dailyRoutine: { time: string; activityEn: string; activityAr: string }[];
  keyDisciplinesEn: string[];
  keyDisciplinesAr: string[];
  gearEn: string[];
  gearAr: string[];
}

const MONTHLY_CHAMPIONS: MonthlyChampionData[] = [
  {
    id: 'october-2026',
    monthEn: 'October 2026 (Reigning Champion)',
    monthAr: 'أكتوبر 2026 (البطل الحالي المتصدر)',
    year: 2026,
    nameEn: 'Tarik "Super Saiyan"',
    nameAr: 'طارق "سوبر سايان"',
    titleEn: 'Global S-Rank Hyrox & Strike Champion',
    titleAr: 'بطل العالم في الهايروكس والقتال الهجومي',
    avatar: TARIK_SAIYAN_IMAGE,
    videoThumbnail: '/images/athlete_mindset_track.jpg',
    videoDuration: '12:45',
    powerScore: 48950,
    workoutHours: 78.5,
    streakDays: 42,
    acwr: '1.15',
    country: 'United Kingdom',
    flag: '🇬🇧',
    quoteEn: 'Discipline never sleeps. Your greatest adversary is the voice asking you to stop. Push through and forge your aura.',
    quoteAr: 'الانضباط لا ينام. خصمك الأكبر هو الصوت الخافت الذي يطلب منك التراجع. اخترق حواجزك واصنع هالتك الخاصة.',
    bioEn: 'Tarik dominated the global leaderboard throughout October with relentless consistency. Logging 78.5 hours of high-intensity functional athletics, 100-strike combinations, and marathon pacing, he shattered the previous power record by over 3,000 points.',
    bioAr: 'تصدّر طارق لوحة الصدارة العالمية طوال شهر أكتوبر بفضل انضباطه الفولاذي المذهل. حقق 78.5 ساعة تدريب وظيفي عالي الشدة، ومجموعات قتالية تفوق 100 لكمة متتالية، محطماً الرقم القياسي السابق لطاقة الهالة بفارق 3,000 نقطة.',
    dailyRoutine: [
      { time: '05:30', activityEn: 'Cold Plunge (3°C) & Deep Pranayama Breathing', activityAr: 'حمام جليدي (3 درجات مئوية) وتدريب تنفس عميق' },
      { time: '06:15', activityEn: 'Shaolin Core Conditioning & 10km Weighted Sprint', activityAr: 'تقوية عضلات الجذع وأسلوب شاولين مع ركض 10 كم بأوزان' },
      { time: '12:30', activityEn: 'Hyrox Sled Push (175kg) & Rowing Intervals', activityAr: 'تحدي دفع زلاجة هايروكس (175 كجم) وفترات تجديف قوية' },
      { time: '18:00', activityEn: 'Speed Sparring & 3D Reflex Shadow Boxing', activityAr: 'نزال ملاكمة سريع وتدريب ردود الأفعال القتالية ثلاثية الأبعاد' },
      { time: '21:30', activityEn: 'Infrared Sauna Recovery & Sleep Telemetry Tracking', activityAr: 'جلسة سونا بالأشعة تحت الحمراء ومراقبة بيانات النوم الحيوية' }
    ],
    keyDisciplinesEn: ['Hyrox Elite Race Pacing', 'Heavy Bag Speed Striking', 'Zone 2 Aerobic Endurance', 'Biometric HRV Tuning'],
    keyDisciplinesAr: ['إيقاع سباقات الهايروكس للنخبة', 'سرعة اللكمات على الأكياس الثقيلة', 'التحمل القلبي Zone 2', 'ضبط توازن الـ HRV الحيوي'],
    gearEn: ['YARD Nitro-Kinetic Carbon Elite Running Shoes', 'YARD Phantom Stealth Tech-Hoodie (Obsidian Black)', 'YARD Biometric Titanium Smart Recovery Ring', 'YARD Hexa-Grip Studio Socks'],
    gearAr: ['حذاء يارد نيترو كاربون إيليت للركض', 'هودي يارد فانتوم ستيلث (الأسود الليلي)', 'خاتم يارد التيتانيوم الذكي للاستشفاء', 'جوارب يارد هيكسا-جريب الحركية']
  },
  {
    id: 'september-2026',
    monthEn: 'September 2026',
    monthAr: 'سبتمبر 2026',
    year: 2026,
    nameEn: 'Yam Suw (Shaolin Fighter)',
    nameAr: 'يام سو (مقاتل شاولين)',
    titleEn: 'Shaolin Iron Body Master & YARD Co-Founder',
    titleAr: 'سيد الجسد الحديدي وشاولين والشريك المؤسس',
    avatar: FOUNDER_YAM_SUW_IMAGE,
    videoThumbnail: '/images/ticket_shaolin_trials.jpg',
    videoDuration: '14:20',
    powerScore: 47200,
    workoutHours: 82.0,
    streakDays: 60,
    acwr: '1.12',
    country: 'Global / Shaolin Tradition',
    flag: '🇯🇵',
    quoteEn: 'True power does not shout. It sits in stillness, flows like mountain water, and strikes like lightning.',
    quoteAr: 'القوة الحقيقية لا تصرخ. إنها تسكن في السكون، تتدفق كماء الجبال، وتضرب كالبرق الخاطف.',
    bioEn: 'In September, Master Yam Suw proved that traditional Shaolin discipline paired with modern kinetic telemetry creates an untouchable standard of functional conditioning.',
    bioAr: 'في سبتمبر، أثبت المعلم يام سو أن انضباط شاولين الأصيل عندما يندمج مع القياسات الحيوية الحديثة يخلق معياراً لا يمكن منافسته في القوة والتحمل.',
    dailyRoutine: [
      { time: '05:00', activityEn: 'Zen Meditation & Shaolin Horse Stance (30 Min)', activityAr: 'تأمل زن ووقفة الحصان في شاولين لمدة 30 دقيقة' },
      { time: '07:00', activityEn: 'Iron Palm Conditioning & Finger Strike Drills', activityAr: 'تقوية قبضة اليد الحديدية وتدريبات الكف الفولاذي' },
      { time: '14:00', activityEn: 'Functional Kettlebell High-Rep Snatch (32kg)', activityAr: 'خطف كيتل بيل وظيفي بتكرارات مكثفة (وزن 32 كجم)' },
      { time: '19:00', activityEn: 'Traditional Staff Flow & Joint Flexibility Mobility', activityAr: 'قتال العصا التقليدية ومرونة المفاصل الانسيابية' }
    ],
    keyDisciplinesEn: ['Shaolin Kung Fu', 'Iron Body Conditioning', 'Mental Resilience', 'Calisthenics Mastery'],
    keyDisciplinesAr: ['كونغ فو شاولين الأصيل', 'تصلب الجسد الحديدي', 'صلابة التركيز الذهني', 'إتقان الكاليستانكس'],
    gearEn: ['YARD Quantum-Kevlar Performance Strike Tee (Black)', 'YARD Apex Dual-Layer Combat Shorts', 'YARD Combat Hand Wraps'],
    gearAr: ['تي شيرت يارد كوانتوم الهجومي (أسود)', 'شورت يارد أبيكس القتالي المزدوج', 'أربطة يارد القتالية للمعصم']
  },
  {
    id: 'august-2026',
    monthEn: 'August 2026',
    monthAr: 'أغسطس 2026',
    year: 2026,
    nameEn: 'Elena Rostova',
    nameAr: 'إيلينا روستوفا',
    titleEn: 'Olympic Functional Pacer & Hyrox Pro',
    titleAr: 'بطلة الهايروكس والتحمل الأولمبي الوظيفي',
    avatar: BOXING_VALKYRIE_IMAGE,
    videoThumbnail: '/images/boxing_valkyrie_punch_1790712629802.jpg',
    videoDuration: '10:55',
    powerScore: 45800,
    workoutHours: 74.0,
    streakDays: 38,
    acwr: '1.10',
    country: 'France',
    flag: '🇫🇷',
    quoteEn: 'When lactic acid burns, that is where your transformation begins. Embrace the fire.',
    quoteAr: 'حين تشعر بحرقة حمض اللاكتيك في عضلاتك، هناك تحديداً تبدأ ولادتك الجديدة. احتضن التحدي.',
    bioEn: 'Elena set the pacing standard in August with breathtaking sprint and kettlebell endurance, inspiring hundreds of women in the YARD community.',
    bioAr: 'سجلت إيلينا أرقاماً قياسية في أغسطس في سرعة التحمل ورفع الكيتل بيل، لتكون قدوة ملهمة لمئات الرياضيات في مجتمع YARD.',
    dailyRoutine: [
      { time: '06:00', activityEn: 'Mobility & Foam Rolling Activation', activityAr: 'تمارين مرونة وتنشيط العضلات بالفوم رولر' },
      { time: '07:30', activityEn: 'Track 800m Repeats (VO2 Max Interval)', activityAr: 'تكرارات 800 متر على المضمار لرفع الـ VO2 Max' },
      { time: '13:00', activityEn: 'Reformer Pilates Core Stabilization', activityAr: 'بيلاتس ريفورمر لثبات واستقرار الجذع' },
      { time: '17:30', activityEn: 'Burpee Broad Jumps & Wall Ball Circuit', activityAr: 'دائرة بيربي وقفزات طويلة مع كرات الحائط' }
    ],
    keyDisciplinesEn: ['VO2 Max Pacing', 'Reformer Pilates Balance', 'Functional Sprints', 'Lactate Threshold'],
    keyDisciplinesAr: ['إيقاع الـ VO2 Max', 'توازن بيلاتس ريفورمر', 'سباقات السرعة الوظيفية', 'عتبة اللاكتات القصوى'],
    gearEn: ['YARD Aerocore Precision Pilates Set (White & Black)', 'YARD Silk Deodorant Mist (White)', 'YARD Studio Performance Grip Socks'],
    gearAr: ['طقم بيلاتس يارد إيروكور المبتكر (أبيض وأسود)', 'رذاذ يارد الحريري النسائي الأبيض', 'جوارب يارد جريب مانعة للانزلاق']
  }
];

export const ChampionStoryHub: React.FC<ChampionStoryHubProps> = ({
  currentLang = 'en',
  onBackToHome,
  onExploreLeaderboard,
  onExploreProducts
}) => {
  const isAr = currentLang === 'ar';
  const [selectedChampionIndex, setSelectedChampionIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(38);
  const [sharedToast, setSharedToast] = useState<boolean>(false);

  const champion = MONTHLY_CHAMPIONS[selectedChampionIndex];

  const handlePlayToggle = () => {
    soundFX.playButtonClick();
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    soundFX.playButtonClick();
    setIsMuted(!isMuted);
  };

  const handleShareStory = () => {
    soundFX.playSuccess();
    const text = isAr 
      ? `👑 شاهد فيلم وقصة بطل شهر ${champion.monthAr}: ${champion.nameAr} على منصة YARD 300! طاقة الهالة: ${champion.powerScore} AU 🔥`
      : `👑 Watch the Champion of the Month Documentary: ${champion.nameEn} (${champion.monthEn}) on YARD 300! Peak Aura: ${champion.powerScore} AU 🔥`;
    navigator.clipboard.writeText(text);
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2500);
  };

  return (
    <div className={`min-h-screen pt-28 pb-24 bg-[#0A0B10] text-white relative overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#FFE600]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141624] hover:bg-[#1C1F32] text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all"
            >
              <span>{isAr ? '→ العودة للرئيسية' : '← Back to Home'}</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181A28] border border-[#FFE600]/50 text-[#FFE600] text-xs font-black font-anime">
            <Trophy className="w-4 h-4 text-[#FFE600]" />
            <span>{isAr ? 'فيلم وقصة بطل الشهر // وثائقي شهري حصري' : 'MONTHLY CHAMPION DOCUMENTARY & STORY'}</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/40 text-[#FFE600] text-xs font-black font-anime uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'شهرياً: فيديو وقصة المتصدر لذلك الشهر' : 'MONTHLY S-RANK LEADER SPOTLIGHT'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-anime text-white">
            {isAr ? 'قصة ' : 'STORY OF '}<span className="text-[#FFE600] drop-shadow-[0_0_15px_rgba(255,230,0,0.4)]">{isAr ? 'بطل الشهر' : 'THE CHAMPION'}</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 font-bold max-w-2xl mx-auto leading-relaxed">
            {isAr 
              ? 'نكرم شهرياً البطل الرياضي المتصدر للائحة العالمية بنشر فيلم وثائقي يستعرض رحلته، بروتوكوله التدريبي، وأسرار كسر الحواجز.' 
              : 'Each month, we celebrate the world #1 athlete on our global leaderboard with an exclusive documentary, workout breakdown, and mental blueprint.'}
          </p>
        </div>

        {/* Month Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {MONTHLY_CHAMPIONS.map((champ, idx) => {
            const isSelected = selectedChampionIndex === idx;
            return (
              <button
                key={champ.id}
                onClick={() => {
                  soundFX.playButtonClick();
                  setSelectedChampionIndex(idx);
                  setIsPlaying(false);
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black font-anime transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected 
                    ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-[0_0_20px_rgba(255,230,0,0.4)] scale-105' 
                    : 'bg-[#141624] text-gray-300 hover:text-white border-gray-800 hover:border-gray-700'
                }`}
              >
                <span>{champ.flag}</span>
                <span>{isAr ? champ.monthAr : champ.monthEn}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Video Player & Documentary Showcase */}
        <div className="bg-[#121422] rounded-3xl border-2 border-gray-800 hover:border-[#FFE600]/60 p-6 md:p-8 mb-16 shadow-2xl relative overflow-hidden transition-all">
          
          {/* Main Video Viewport Mockup */}
          <div className="relative w-full h-72 md:h-[460px] rounded-2xl overflow-hidden bg-black mb-6 group border border-gray-800">
            {/* Cinematic Cyber Documentary Screen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#080910] via-[#05060A] to-[#12162A] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-cyber-grid opacity-25" />
              <div className="absolute inset-0 bg-speedlines opacity-20" />
              
              {/* Dynamic Soundwave & Kinetic Equalizer */}
              <div className="flex items-end gap-1.5 sm:gap-2 h-36 opacity-35 px-8">
                {[35, 65, 85, 50, 95, 40, 75, 100, 60, 90, 45, 80, 70, 95, 30, 85, 60, 40, 90, 55].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 sm:w-2.5 rounded-t-full bg-gradient-to-t from-emerald-500 via-[#FFE600] to-[#E50914] transition-all duration-300"
                    style={{ 
                      height: isPlaying ? `${Math.min(100, (h * 1.3) % 100 + 15)}%` : `${h * 0.7}%`
                    }}
                  />
                ))}
              </div>

              {/* Title Overlay in Viewport */}
              <div className="absolute bottom-16 left-6 right-6 flex flex-col items-start text-left pointer-events-none">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-black/70 px-2 py-0.5 rounded">
                  DOCUMENTARY EPISODE // {champion.id.toUpperCase()}
                </span>
                <span className="text-xl sm:text-3xl font-black font-anime text-white drop-shadow-md">
                  {isAr ? champion.nameAr : champion.nameEn}: {isAr ? champion.titleAr : champion.titleEn}
                </span>
              </div>
            </div>

            {/* Live Playing State Indicator */}
            {isPlaying && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914] text-white text-xs font-black font-anime shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>{isAr ? 'قيد التشغيل — وثائقي 4K' : 'NOW PLAYING — 4K ULTRA HD'}</span>
              </div>
            )}

            {/* Top Right Badges */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-sm border border-gray-700 text-xs font-black text-[#FFE600]">
                {champion.videoDuration}
              </span>
              <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-sm border border-gray-700 text-xs font-black text-white">
                4K 60FPS
              </span>
            </div>

            {/* Center Big Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayToggle}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#FFE600] hover:bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,230,0,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer group-hover:scale-105"
                title={isPlaying ? 'Pause Documentary' : 'Play Documentary'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 md:w-10 md:h-10 fill-current" />
                ) : (
                  <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />
                )}
              </button>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
              {/* Progress Slider */}
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden cursor-pointer">
                <div 
                  className="bg-[#FFE600] h-full transition-all duration-300"
                  style={{ width: `${isPlaying ? 65 : videoProgress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-gray-300 pt-1">
                <div className="flex items-center gap-3">
                  <button onClick={handlePlayToggle} className="text-white hover:text-[#FFE600]">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={handleMuteToggle} className="text-white hover:text-[#FFE600]">
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span>{isPlaying ? '08:14' : '04:32'} / {champion.videoDuration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#FFE600] font-black font-anime">
                    {isAr ? champion.nameAr : champion.nameEn}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span>{champion.flag}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Documentary Title & Athlete Summary Card */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#FFE600] shrink-0 bg-[#0A0B10] shadow-[0_0_20px_rgba(255,230,0,0.3)]">
                <img loading="lazy" decoding="async" 
                  src={champion.avatar} 
                  alt={champion.nameEn}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{champion.flag}</span>
                  <h2 className="text-2xl md:text-3xl font-black font-anime text-white">
                    {isAr ? champion.nameAr : champion.nameEn}
                  </h2>
                </div>
                <p className="text-xs md:text-sm font-bold text-[#FFE600]">
                  {isAr ? champion.titleAr : champion.titleEn}
                </p>
                <span className="text-xs text-gray-400 font-medium">
                  {isAr ? champion.monthAr : champion.monthEn}
                </span>
              </div>
            </div>

            {/* Quick Share and Stats Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleShareStory}
                className="px-4 py-2.5 rounded-xl bg-[#1A1D2E] hover:bg-[#252942] border border-gray-700 text-xs font-black font-anime text-white flex items-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#FFE600]" />
                <span>{isAr ? 'مشاركة قصة البطل' : 'Share Documentary'}</span>
              </button>

              {onExploreLeaderboard && (
                <button
                  onClick={onExploreLeaderboard}
                  className="px-5 py-2.5 rounded-xl bg-[#FFE600] hover:bg-white text-black font-black font-anime text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,230,0,0.3)] cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>{isAr ? 'عرض لوحة الصدارة' : 'View Leaderboard'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Toast Notification */}
          {sharedToast && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-white font-black text-xs text-center animate-bounce">
              ✓ {isAr ? 'تم نسخ رابط ورسالة قصة البطل بنجاح!' : 'Champion story link copied to clipboard!'}
            </div>
          )}

          {/* 4 Performance Metrics Grid (Pure colors: Yellow for Power, Red for Hours, Green for ACWR, White for Streak) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
            <div className="bg-[#0A0B10] p-4 rounded-2xl border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase font-black block mb-1">
                {isAr ? 'طاقة الهالة القصوى' : 'PEAK AURA SCORE'}
              </span>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFE600]" />
                <span className="text-2xl font-black font-anime text-[#FFE600]">{champion.powerScore.toLocaleString()} AU</span>
              </div>
            </div>

            <div className="bg-[#0A0B10] p-4 rounded-2xl border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase font-black block mb-1">
                {isAr ? 'ساعات التمرين الشهرية' : 'MONTHLY WORKOUT HRS'}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E50914]" />
                <span className="text-2xl font-black font-anime text-white">{champion.workoutHours} hrs</span>
              </div>
            </div>

            <div className="bg-[#0A0B10] p-4 rounded-2xl border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase font-black block mb-1">
                {isAr ? 'سلسلة الانتصارات' : 'TRAINING STREAK'}
              </span>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FFE600]" />
                <span className="text-2xl font-black font-anime text-white">{champion.streakDays} {isAr ? 'يوماً' : 'Days'}</span>
              </div>
            </div>

            <div className="bg-[#0A0B10] p-4 rounded-2xl border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase font-black block mb-1">
                {isAr ? 'مؤشر الجاهزية ACWR' : 'READINESS ACWR'}
              </span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-2xl font-black font-anime text-emerald-400">{champion.acwr}</span>
              </div>
            </div>
          </div>

          {/* Inspirational Champion Quote */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#181A28] to-[#121422] border-l-4 border-[#FFE600] my-6">
            <span className="text-xs text-[#FFE600] font-black uppercase tracking-wider block mb-2">
              {isAr ? 'كلمة البطل للمجتمع' : 'CHAMPION PHILOSOPHY'}
            </span>
            <p className="text-base md:text-lg italic font-bold text-gray-200 leading-relaxed">
              "{isAr ? champion.quoteAr : champion.quoteEn}"
            </p>
          </div>

          {/* Documentary Bio & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            
            {/* Left: Biography and Disciplines */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black font-anime text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FFE600]" />
                  <span>{isAr ? 'رحلة البطل إلى القمة' : 'The Path to #1'}</span>
                </h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                  {isAr ? champion.bioAr : champion.bioEn}
                </p>
              </div>

              {/* Key Disciplines */}
              <div>
                <h4 className="text-xs font-black uppercase text-gray-400 mb-3">
                  {isAr ? 'التخصصات القتالية والرياضية الأساسية' : 'CORE ATHLETIC DISCIPLINES'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(isAr ? champion.keyDisciplinesAr : champion.keyDisciplinesEn).map((d, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 rounded-xl bg-[#0A0B10] border border-gray-800 text-xs font-bold text-white flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{d}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred YARD Gear Arsenal */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase text-gray-400">
                    {isAr ? 'العتاد المعتمد في تدريب البطل' : 'CHAMPION GEAR ARSENAL'}
                  </h4>
                  {onExploreProducts && (
                    <button
                      onClick={onExploreProducts}
                      className="text-xs text-[#FFE600] hover:underline font-black cursor-pointer"
                    >
                      {isAr ? 'تسوق العتاد ←' : 'Shop Gear →'}
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {(isAr ? champion.gearAr : champion.gearEn).map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#0A0B10] border border-gray-800 text-xs font-bold text-gray-200">
                      <span>{g}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-900 px-2 py-0.5 rounded">YARD CERTIFIED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Daily Hour-by-Hour Regimen */}
            <div>
              <h3 className="text-lg font-black font-anime text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E50914]" />
                <span>{isAr ? 'الجدول اليومي الدقيق للبطل' : 'Daily Blueprint & Schedule'}</span>
              </h3>

              <div className="space-y-3">
                {champion.dailyRoutine.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#0A0B10] border border-gray-800 flex items-start gap-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[#181A28] border border-gray-700 text-[#FFE600] text-xs font-black font-anime shrink-0">
                      {step.time}
                    </span>
                    <p className="text-xs font-bold text-gray-300 leading-relaxed pt-0.5">
                      {isAr ? step.activityAr : step.activityEn}
                    </p>
                  </div>
                ))}
              </div>

              {/* Callout box to challenge next month */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#1C170A] via-[#121422] to-[#0A0B10] border-2 border-[#FFE600]/40 text-center space-y-3">
                <Sparkles className="w-6 h-6 text-[#FFE600] mx-auto animate-bounce" />
                <h4 className="text-base font-black font-anime text-white">
                  {isAr ? 'هل تطمح لأن تكون بطل الشهر القادم؟' : 'WANT TO BE NEXT MONTH’S HERO?'}
                </h4>
                <p className="text-xs text-gray-300 font-medium">
                  {isAr 
                    ? 'تدرب في صالة يارد، سجّل نقاطك الحيوية وتصدّر الترتيب العالمي. سنقوم بتصوير قصتك وبثها للعالم أجمع.'
                    : 'Train in the Yard Engine, record your biometric stats, and climb to #1. We will officially produce and feature your documentary next month.'}
                </p>
                {onExploreLeaderboard && (
                  <button
                    onClick={onExploreLeaderboard}
                    className="w-full py-3 rounded-xl bg-[#FFE600] hover:bg-white text-black font-black font-anime text-xs transition-all shadow-[0_0_15px_rgba(255,230,0,0.3)] cursor-pointer"
                  >
                    {isAr ? 'ادخل حلبة المنافسة وتصدّر الآن' : 'ENTER ARENA & COMPETE FOR #1'}
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ChampionStoryHub;
