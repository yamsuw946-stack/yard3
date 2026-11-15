import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip as RechartsTooltip
} from 'recharts';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Award,
  Flame,
  Zap,
  Clock,
  Trophy,
  Share2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Language, tr } from '../i18n';
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
  radarProfile: { power: number; endurance: number; agility: number; recovery: number; precision: number };
}

const MONTHLY_CHAMPIONS: MonthlyChampionData[] = [
  {
    id: 'october-2026',
    monthEn: 'October 2026 · Reigning Champion',
    monthAr: 'أكتوبر 2026 · البطل الحالي',
    year: 2026,
    nameEn: 'Tarik Al-Mansoor',
    nameAr: 'طارق المنصور',
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
    bioEn: 'Tarik dominated the global leaderboard throughout October with relentless consistency. Logging 78.5 hours of high-intensity functional athletics, 100-strike combinations, and marathon pacing, he shattered the previous record by 3,000 points.',
    bioAr: 'تصدّر طارق لوحة الصدارة العالمية طوال شهر أكتوبر بفضل انضباطه الفولاذي. حقق 78.5 ساعة تدريب وظيفي عالي الشدة ومجموعات قتالية تفوق 100 لكمة متتالية محطماً الرقم القياسي السابق.',
    dailyRoutine: [
      { time: '05:30', activityEn: 'Cold Plunge (3°C) & Deep Pranayama Breathing', activityAr: 'حمام جليدي (3 درجات مئوية) وتدريب تنفس عميق' },
      { time: '06:15', activityEn: 'Shaolin Core Conditioning & 10km Weighted Sprint', activityAr: 'تقوية الجذع وأسلوب شاولين مع ركض 10 كم بأوزان' },
      { time: '12:30', activityEn: 'Hyrox Sled Push (175kg) & Rowing Intervals', activityAr: 'دفع زلاجة هايروكس (175 كجم) وفترات تجديف قوية' },
      { time: '18:00', activityEn: 'Speed Sparring & 3D Reflex Shadow Boxing', activityAr: 'نزال ملاكمة سريع وتدريب ردود الأفعال القتالية' },
      { time: '21:30', activityEn: 'Infrared Sauna Recovery & Sleep Telemetry Tracking', activityAr: 'استشفاء بالأشعة تحت الحمراء ومراقبة النوم الحيوي' }
    ],
    keyDisciplinesEn: ['Hyrox Elite Race Pacing', 'Heavy Bag Speed Striking', 'Zone 2 Aerobic Endurance', 'Biometric HRV Tuning'],
    keyDisciplinesAr: ['إيقاع سباقات الهايروكس للنخبة', 'سرعة اللكمات على الأكياس الثقيلة', 'التحمل القلبي Zone 2', 'ضبط توازن الـ HRV الحيوي'],
    gearEn: ['YARD Nitro-Kinetic Carbon Elite Running Shoes', 'YARD Phantom Stealth Tech-Hoodie', 'YARD Biometric Titanium Smart Recovery Ring', 'YARD Hexa-Grip Studio Socks'],
    gearAr: ['حذاء يارد نيترو كاربون إيليت', 'هودي يارد فانتوم ستيلث الأسود', 'خاتم يارد التيتانيوم الذكي', 'جوارب يارد هيكسا-جريب الحركية'],
    radarProfile: { power: 96, endurance: 94, agility: 89, recovery: 95, precision: 92 }
  },
  {
    id: 'september-2026',
    monthEn: 'September 2026',
    monthAr: 'سبتمبر 2026',
    year: 2026,
    nameEn: 'Yam Suw · Shaolin Fighter',
    nameAr: 'يام سو · مقاتل شاولين',
    titleEn: 'Shaolin Iron Body Master & YARD Co-Founder',
    titleAr: 'سيد الجسد الحديدي والشريك المؤسس',
    avatar: FOUNDER_YAM_SUW_IMAGE,
    videoThumbnail: '/images/ticket_shaolin_trials.jpg',
    videoDuration: '14:20',
    powerScore: 47200,
    workoutHours: 82.0,
    streakDays: 60,
    acwr: '1.12',
    country: 'Global · Shaolin Tradition',
    flag: '🇯🇵',
    quoteEn: 'True power does not shout. It sits in stillness, flows like mountain water, and strikes like lightning.',
    quoteAr: 'القوة الحقيقية لا تصرخ. إنها تسكن في السكون، تتدفق كماء الجبال، وتضرب كالبرق الخاطف.',
    bioEn: 'In September, Master Yam Suw proved that traditional Shaolin discipline paired with modern kinetic telemetry creates an untouchable standard of functional conditioning.',
    bioAr: 'في سبتمبر، أثبت المعلم يام سو أن انضباط شاولين الأصيل عندما يندمج مع القياسات الحيوية الحديثة يخلق معياراً لا يُنافس في القوة والتحمل.',
    dailyRoutine: [
      { time: '05:00', activityEn: 'Zen Meditation & Shaolin Horse Stance (30 Min)', activityAr: 'تأمل زن ووقفة الحصان في شاولين 30 دقيقة' },
      { time: '07:00', activityEn: 'Iron Palm Conditioning & Finger Strike Drills', activityAr: 'تقوية قبضة اليد الحديدية وتدريبات الكف الفولاذي' },
      { time: '14:00', activityEn: 'Functional Kettlebell High-Rep Snatch (32kg)', activityAr: 'خطف كيتل بيل وظيفي بتكرارات مكثفة 32 كجم' },
      { time: '19:00', activityEn: 'Traditional Staff Flow & Joint Mobility', activityAr: 'قتال العصا التقليدية ومرونة المفاصل' }
    ],
    keyDisciplinesEn: ['Shaolin Kung Fu', 'Iron Body Conditioning', 'Mental Resilience', 'Calisthenics Mastery'],
    keyDisciplinesAr: ['كونغ فو شاولين الأصيل', 'تصلب الجسد الحديدي', 'صلابة التركيز الذهني', 'إتقان الكاليستنكس'],
    gearEn: ['YARD Quantum-Kevlar Strike Tee', 'YARD Apex Combat Shorts', 'YARD Combat Hand Wraps'],
    gearAr: ['تي شيرت يارد كوانتوم الهجومي', 'شورت يارد أبيكس القتالي', 'أربطة يارد القتالية للمعصم'],
    radarProfile: { power: 98, endurance: 91, agility: 93, recovery: 96, precision: 97 }
  },
  {
    id: 'august-2026',
    monthEn: 'August 2026',
    monthAr: 'أغسطس 2026',
    year: 2026,
    nameEn: 'Camille Laurent',
    nameAr: 'كاميل لوران',
    titleEn: 'Olympic Functional Pacer & Hyrox Pro',
    titleAr: 'بطلة الهايروكس والتحمل الأولمبي الوظيفي',
    avatar: BOXING_VALKYRIE_IMAGE,
    videoThumbnail: '/images/ai_human_female_runner.jpg',
    videoDuration: '10:55',
    powerScore: 45800,
    workoutHours: 74.0,
    streakDays: 38,
    acwr: '1.10',
    country: 'France',
    flag: '🇫🇷',
    quoteEn: 'When lactic acid burns, that is where your transformation begins. Embrace the fire.',
    quoteAr: 'حين تشعر بحرقة حمض اللاكتيك في عضلاتك، هناك تحديداً تبدأ ولادتك الجديدة. احتضن التحدي.',
    bioEn: 'Camille set the pacing standard in August with breathtaking sprint and kettlebell endurance, inspiring athletes across the global YARD circuit.',
    bioAr: 'سجلت كاميل أرقاماً قياسية في أغسطس في سرعة التحمل ورفع الكيتل بيل، لتكون قدوة ملهمة لرياضيي YARD حول العالم.',
    dailyRoutine: [
      { time: '06:00', activityEn: 'Mobility & Foam Rolling Activation', activityAr: 'تمارين مرونة وتنشيط العضلات' },
      { time: '07:30', activityEn: 'Track 800m Repeats (VO2 Max Interval)', activityAr: 'تكرارات 800 متر لرفع الـ VO2 Max' },
      { time: '13:00', activityEn: 'Reformer Pilates Core Stabilization', activityAr: 'بيلاتس ريفورمر لثبات واستقرار الجذع' },
      { time: '17:30', activityEn: 'Burpee Broad Jumps & Wall Ball Circuit', activityAr: 'دائرة بيربي وقفزات مع كرات الحائط' }
    ],
    keyDisciplinesEn: ['VO2 Max Pacing', 'Reformer Pilates Balance', 'Functional Sprints', 'Lactate Threshold'],
    keyDisciplinesAr: ['إيقاع الـ VO2 Max', 'توازن بيلاتس ريفورمر', 'سباقات السرعة', 'عتبة اللاكتات القصوى'],
    gearEn: ['YARD Aerocore Pilates Set', 'YARD Silk Moisture Mist', 'YARD Grip Studio Socks'],
    gearAr: ['طقم بيلاتس يارد إيروكور', 'رذاذ يارد الحريري', 'جوارب يارد جريب'],
    radarProfile: { power: 88, endurance: 97, agility: 95, recovery: 92, precision: 93 }
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
  const [videoProgress, setVideoProgress] = useState<number>(28);
  const [sharedToast, setSharedToast] = useState<boolean>(false);

  const champion = MONTHLY_CHAMPIONS[selectedChampionIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setVideoProgress((p) => (p >= 100 ? 0 : p + 1.2));
    }, 600);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const radarData = useMemo(
    () => [
      { metric: tr(currentLang, { en: 'Power', es: 'Potencia', fr: 'Puissance', ar: 'القوة' }), val: champion.radarProfile.power },
      { metric: tr(currentLang, { en: 'Endurance', es: 'Resistencia', fr: 'Endurance', ar: 'التحمل' }), val: champion.radarProfile.endurance },
      { metric: tr(currentLang, { en: 'Agility', es: 'Agilidad', fr: 'Agilité', ar: 'الرشاقة' }), val: champion.radarProfile.agility },
      { metric: tr(currentLang, { en: 'Recovery', es: 'Recuperación', fr: 'Récupération', ar: 'الاستشفاء' }), val: champion.radarProfile.recovery },
      { metric: tr(currentLang, { en: 'Precision', es: 'Precisión', fr: 'Précision', ar: 'الدقة' }), val: champion.radarProfile.precision }
    ],
    [champion, currentLang]
  );

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
    const text = tr(currentLang, {
      en: `Watch the Champion Documentary: ${champion.nameEn} (${champion.monthEn}) on YARD 300 — ${champion.powerScore} AU`,
      es: `Mira el Documental del Campeón: ${champion.nameEn} (${champion.monthEn}) en YARD 300 — ${champion.powerScore} AU`,
      fr: `Regardez le Documentaire du Champion : ${champion.nameEn} (${champion.monthEn}) sur YARD 300 — ${champion.powerScore} AU`,
      ar: `شاهد وثائقي بطل الشهر: ${champion.nameAr} (${champion.monthAr}) على YARD 300 — ${champion.powerScore} AU`
    });
    navigator.clipboard?.writeText(text);
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2500);
  };

  return (
    <div className={`min-h-screen pt-28 pb-24 bg-[#07080D] text-white relative overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-10">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="px-4 py-2 rounded-lg bg-[#0B0E16] hover:bg-white text-white hover:text-[#07080D] border border-white/[0.1] text-xs font-semibold cursor-pointer transition-colors"
            >
              {tr(currentLang, {
                en: '← Back to Home',
                es: '← Volver al Inicio',
                fr: "← Retour à l'Accueil",
                ar: '→ العودة للرئيسية'
              })}
            </button>
          )}
          <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
            {tr(currentLang, {
              en: 'CHAMPION OF THE MONTH · DOCUMENTARY SERIES',
              es: 'CAMPEÓN DEL MES · SERIE DOCUMENTAL',
              fr: 'CHAMPION DU MOIS · SÉRIE DOCUMENTAIRE',
              ar: 'السجل الوثائقي لأبطال الشهر'
            })}
          </span>
        </div>

        {/* Title & Month Segmented Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              {tr(currentLang, {
                en: 'Documentary & Blueprint: ',
                es: 'Documental y Protocolo: ',
                fr: 'Documentaire & Protocole : ',
                ar: 'وثائقي وبرتوكول '
              })}
              <span className="text-[#D4AF37]">
                {tr(currentLang, { en: 'Monthly #1', es: '#1 del Mes', fr: '#1 du Mois', ar: 'بطل الشهر' })}
              </span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              {tr(currentLang, {
                en: 'Exclusive performance dossier featuring the reigning global #1 athlete, daily training timeline, biometric split, and certified gear kit.',
                es: 'Expediente exclusivo con el atleta #1 global, cronograma diario de entrenamiento, perfil biométrico y equipamiento oficial.',
                fr: 'Dossier exclusif présentant le #1 mondial, son programme quotidien, son profil biométrique et son équipement certifié.',
                ar: 'توثيق حصري لروتين الأبطال المتصدرين، بياناتهم البيومترية، ومعداتهم المعتمدة في YARD 300.'
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 bg-[#0B0E16] p-1 rounded-xl border border-white/[0.08]">
            {MONTHLY_CHAMPIONS.map((champ, idx) => (
              <button
                key={champ.id}
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setSelectedChampionIndex(idx);
                  setIsPlaying(false);
                  setVideoProgress(28);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                  selectedChampionIndex === idx
                    ? 'bg-[#D4AF37] text-[#07080D]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{champ.flag}</span>
                <span>{isAr ? champ.nameAr : champ.nameEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Documentary Theater + Athlete Performance Radar */}
        <div className="bg-[#0B0E16] border border-white/[0.08] rounded-2xl p-5 md:p-7 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Cinema Screening Frame (8 Cols) */}
            <div className="lg:col-span-8 relative rounded-xl overflow-hidden bg-black aspect-[16/9] border border-white/[0.08] group">
              <img
                src={champion.videoThumbnail}
                alt={champion.nameEn}
                onError={handleImageError}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  isPlaying ? 'scale-105 brightness-90' : 'scale-100 brightness-75'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080D] via-[#07080D]/30 to-[#07080D]/55" />

              <div className="absolute top-4 inset-x-4 flex items-center justify-between text-xs font-mono">
                <span className="text-[#D4AF37] font-semibold">
                  {isPlaying
                    ? tr(currentLang, { en: 'PLAYING DOCUMENTARY', es: 'REPRODUCIENDO', fr: 'LECTURE EN COURS', ar: 'جاري العرض الوثائقي' })
                    : isAr ? champion.monthAr : champion.monthEn}
                </span>
                <span className="text-slate-300 tabular-nums">{champion.videoDuration} · 4K 60FPS</span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handlePlayToggle}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#D4AF37] hover:bg-white text-[#07080D] flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer"
                  aria-label={isPlaying ? 'Pause Documentary' : 'Play Documentary'}
                >
                  {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
                </button>
              </div>

              {/* Scrubber & Controls Footer */}
              <div className="absolute bottom-0 inset-x-0 p-4 space-y-2.5">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">
                    {isAr ? champion.nameAr : champion.nameEn}
                  </h2>
                  <p className="text-xs text-slate-300">{isAr ? champion.titleAr : champion.titleEn}</p>
                </div>

                <div
                  className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
                    setVideoProgress(ratio);
                  }}
                >
                  <div className="h-full bg-[#D4AF37] transition-all duration-300" style={{ width: `${videoProgress}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-300 tabular-nums">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={handlePlayToggle} className="hover:text-[#D4AF37] cursor-pointer">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button type="button" onClick={handleMuteToggle} className="hover:text-[#D4AF37] cursor-pointer">
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span>{champion.videoDuration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={handleShareStory} className="hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{tr(currentLang, { en: 'Share', es: 'Compartir', fr: 'Partager', ar: 'مشاركة' })}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Champion Telemetry & Radar Fingerprint (4 Cols) */}
            <div className="lg:col-span-4 bg-[#07080D] border border-white/[0.07] rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3.5 border-b border-white/[0.07] pb-4">
                <img
                  src={champion.avatar}
                  alt={champion.nameEn}
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover object-top border border-[#D4AF37]/40 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[11px] font-mono text-[#D4AF37] block">
                    {champion.flag} {champion.country}
                  </span>
                  <h3 className="text-base font-bold text-white truncate">
                    {isAr ? champion.nameAr : champion.nameEn}
                  </h3>
                </div>
              </div>

              <div className="w-full h-48 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid stroke="#1E293B" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#07080D', borderColor: 'rgba(255,255,255,0.1)', fontSize: '11px' }}
                    />
                    <Radar dataKey="val" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.28} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {onExploreLeaderboard && (
                <button
                  type="button"
                  onClick={onExploreLeaderboard}
                  className="w-full py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080D] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  <span>
                    {tr(currentLang, {
                      en: 'Open Champions Board',
                      es: 'Abrir Tabla de Campeones',
                      fr: 'Ouvrir le Classement',
                      ar: 'لوحة الشامبيونز'
                    })}
                  </span>
                </button>
              )}
            </div>
          </div>

          {sharedToast && (
            <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-medium text-center">
              ✓ {tr(currentLang, {
                en: 'Champion documentary link copied to clipboard',
                es: 'Enlace del documental copiado al portapapeles',
                fr: 'Lien du documentaire copié dans le presse-papiers',
                ar: 'تم نسخ رابط قصة البطل إلى الحافظة'
              })}
            </div>
          )}

          {/* 4 KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#07080D] border border-white/[0.06]">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                {tr(currentLang, { en: 'PEAK SCORE', es: 'PUNTUACIÓN MÁX', fr: 'SCORE MAX', ar: 'مجموع نقاط الأداء' })}
              </span>
              <div className="flex items-center gap-2 font-mono tabular-nums">
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xl font-bold text-[#D4AF37]">{champion.powerScore.toLocaleString('en-US')} AU</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#07080D] border border-white/[0.06]">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                {tr(currentLang, { en: 'MONTHLY HOURS', es: 'HORAS MENSUALES', fr: 'HEURES / MOIS', ar: 'ساعات التدريب' })}
              </span>
              <div className="flex items-center gap-2 font-mono tabular-nums">
                <Clock className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-xl font-bold text-white">{champion.workoutHours}h</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#07080D] border border-white/[0.06]">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                {tr(currentLang, { en: 'STREAK', es: 'RACHA', fr: 'SÉRIE', ar: 'سلسلة الانتصارات' })}
              </span>
              <div className="flex items-center gap-2 font-mono tabular-nums">
                <Flame className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xl font-bold text-white">{champion.streakDays}d</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#07080D] border border-white/[0.06]">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                {tr(currentLang, { en: 'ACWR STABILITY', es: 'ESTABILIDAD ACWR', fr: 'STABILITÉ ACWR', ar: 'جاهزية ACWR' })}
              </span>
              <div className="flex items-center gap-2 font-mono tabular-nums">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span className="text-xl font-bold text-[#10B981]">{champion.acwr}</span>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="p-5 rounded-xl bg-[#07080D] border border-white/[0.07] space-y-1.5">
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider block">
              {tr(currentLang, { en: 'CHAMPION PHILOSOPHY', es: 'FILOSOFÍA DEL CAMPEÓN', fr: 'PHILOSOPHIE DU CHAMPION', ar: 'عقيدة البطل' })}
            </span>
            <p className="text-sm md:text-base italic text-slate-200 leading-relaxed">
              “{isAr ? champion.quoteAr : champion.quoteEn}”
            </p>
          </div>

          {/* Bio, Daily Schedule & Gear */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>{tr(currentLang, { en: 'Path to #1', es: 'Camino al #1', fr: 'En Route vers le #1', ar: 'رحلة الصعود إلى #1' })}</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{isAr ? champion.bioAr : champion.bioEn}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    {tr(currentLang, { en: 'CERTIFIED GEAR KIT', es: 'EQUIPO CERTIFICADO', fr: 'ÉQUIPEMENT CERTIFIÉ', ar: 'العتاد المعتمد' })}
                  </span>
                  {onExploreProducts && (
                    <button
                      type="button"
                      onClick={onExploreProducts}
                      className="text-xs font-semibold text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      {tr(currentLang, { en: 'Explore Gear →', es: 'Explorar Tienda →', fr: 'Voir la Boutique →', ar: 'تسوق المجموعة ←' })}
                    </button>
                  )}
                </div>
                <div className="divide-y divide-white/[0.06] rounded-xl bg-[#07080D] border border-white/[0.07]">
                  {(isAr ? champion.gearAr : champion.gearEn).map((g, i) => (
                    <div key={i} className="px-4 py-2.5 text-xs text-slate-200 flex items-center justify-between">
                      <span>{g}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00F0FF]" />
                <span>{tr(currentLang, { en: 'Daily Protocol Schedule', es: 'Agenda Diaria del Protocolo', fr: 'Programme Quotidien', ar: 'الجدول اليومي بالساعة' })}</span>
              </h3>
              <div className="divide-y divide-white/[0.06] rounded-xl bg-[#07080D] border border-white/[0.07]">
                {champion.dailyRoutine.map((step, idx) => (
                  <div key={idx} className="p-3.5 flex items-start gap-4 text-xs">
                    <span className="font-mono tabular-nums font-bold text-[#D4AF37] shrink-0">{step.time}</span>
                    <p className="text-slate-300 leading-relaxed">{isAr ? step.activityAr : step.activityEn}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionStoryHub;
