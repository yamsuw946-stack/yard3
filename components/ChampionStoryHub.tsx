import React, { useState } from 'react';
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
  Sparkles,
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
  monthEs: string;
  monthFr: string;
  monthAr: string;
  year: number;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleEs: string;
  titleFr: string;
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
  quoteEs: string;
  quoteFr: string;
  quoteAr: string;
  bioEn: string;
  bioEs: string;
  bioFr: string;
  bioAr: string;
  dailyRoutine: {
    time: string;
    activityEn: string;
    activityEs: string;
    activityFr: string;
    activityAr: string;
  }[];
  keyDisciplinesEn: string[];
  keyDisciplinesEs: string[];
  keyDisciplinesFr: string[];
  keyDisciplinesAr: string[];
  gearEn: string[];
  gearEs: string[];
  gearFr: string[];
  gearAr: string[];
}

const MONTHLY_CHAMPIONS: MonthlyChampionData[] = [
  {
    id: 'october-2026',
    monthEn: 'October 2026 (Reigning Champion)',
    monthEs: 'Octubre 2026 (Campeón Reinante)',
    monthFr: 'Octobre 2026 (Champion en Titre)',
    monthAr: 'أكتوبر 2026 (البطل الحالي المتصدر)',
    year: 2026,
    nameEn: 'Tarik Al-Mansoor',
    nameAr: 'طارق المنصور',
    titleEn: 'Global S-Rank Hyrox & Strike Champion',
    titleEs: 'Campeón Mundial Hyrox y Combate Rango S',
    titleFr: 'Champion Mondial Hyrox & Combat Rang S',
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
    quoteEs: 'La disciplina nunca duerme. Tu mayor rival es la voz que te pide parar. Supera tus límites y forja tu aura.',
    quoteFr: 'La discipline ne dort jamais. Votre plus grand adversaire est la voix qui vous demande de vous arrêter.',
    quoteAr: 'الانضباط لا ينام. خصمك الأكبر هو الصوت الخافت الذي يطلب منك التراجع. اخترق حواجزك واصنع هالتك الخاصة.',
    bioEn: 'Tarik dominated the global leaderboard throughout October with relentless consistency. Logging 78.5 hours of high-intensity functional athletics, 100-strike combinations, and marathon pacing, he shattered the previous power record by over 3,000 points.',
    bioEs: 'Tarik dominó la clasificación global durante octubre con una constancia imparable: 78.5 horas de atletismo funcional de alta intensidad y combinaciones de 100 golpes.',
    bioFr: 'Tarik a dominé le classement mondial tout au long du mois d’octobre avec 78,5 heures d’athlétisme fonctionnel de haute intensité et des enchaînements à 100 frappes.',
    bioAr: 'تصدّر طارق لوحة الصدارة العالمية طوال شهر أكتوبر بفضل انضباطه الفولاذي المذهل. حقق 78.5 ساعة تدريب وظيفي عالي الشدة ومجموعات قتالية تفوق 100 لكمة متتالية.',
    dailyRoutine: [
      {
        time: '05:30',
        activityEn: 'Cold Plunge (3°C) & Deep Pranayama Breathing',
        activityEs: 'Inmersión en frío (3°C) y respiración profunda Pranayama',
        activityFr: 'Bain glacé (3°C) & Respiration profonde Pranayama',
        activityAr: 'حمام جليدي (3 درجات مئوية) وتدريب تنفس عميق'
      },
      {
        time: '06:15',
        activityEn: 'Shaolin Core Conditioning & 10km Weighted Sprint',
        activityEs: 'Acondicionamiento Shaolin y sprint de 10km con lastre',
        activityFr: 'Conditionnement Core Shaolin & Sprint lesté 10 km',
        activityAr: 'تقوية عضلات الجذع وأسلوب شاولين مع ركض 10 كم بأوزان'
      },
      {
        time: '12:30',
        activityEn: 'Hyrox Sled Push (175kg) & Rowing Intervals',
        activityEs: 'Empuje de trineo Hyrox (175kg) e intervalos de remo',
        activityFr: 'Poussée de traîneau Hyrox (175 kg) & Intervalles rameur',
        activityAr: 'تحدي دفع زلاجة هايروكس (175 كجم) وفترات تجديف قوية'
      },
      {
        time: '18:00',
        activityEn: 'Speed Sparring & 3D Reflex Shadow Boxing',
        activityEs: 'Sparring rápido y boxeo de sombra de reflejos 3D',
        activityFr: 'Sparring rapide & Shadow boxing réflexes 3D',
        activityAr: 'نزال ملاكمة سريع وتدريب ردود الأفعال القتالية ثلاثية الأبعاد'
      },
      {
        time: '21:30',
        activityEn: 'Infrared Sauna Recovery & Sleep Telemetry Tracking',
        activityEs: 'Sauna infrarroja y telemetría avanzada del sueño',
        activityFr: 'Sauna infrarouge & Télémétrie avancée du sommeil',
        activityAr: 'جلسة سونا بالأشعة تحت الحمراء ومراقبة بيانات النوم الحيوية'
      }
    ],
    keyDisciplinesEn: ['Hyrox Elite Race Pacing', 'Heavy Bag Speed Striking', 'Zone 2 Aerobic Endurance', 'Biometric HRV Tuning'],
    keyDisciplinesEs: ['Ritmo Élite Hyrox', 'Golpeo Rápido en Saco Pesado', 'Resistencia Aeróbica Zona 2', 'Calibración Biométrica HRV'],
    keyDisciplinesFr: ['Allure Course Élite Hyrox', 'Frappe Rapide Sac Lourd', 'Endurance Aérobie Zone 2', 'Réglage Biométrique VFC'],
    keyDisciplinesAr: ['إيقاع سباقات الهايروكس للنخبة', 'سرعة اللكمات على الأكياس الثقيلة', 'التحمل القلبي Zone 2', 'ضبط توازن الـ HRV الحيوي'],
    gearEn: ['YARD Nitro-Kinetic Carbon Elite Running Shoes', 'YARD Phantom Stealth Tech-Hoodie', 'YARD Biometric Titanium Smart Recovery Ring', 'YARD Hexa-Grip Studio Socks'],
    gearEs: ['Zapatillas YARD Nitro-Kinetic Carbon Elite', 'Sudadera Táctica YARD Phantom Stealth', 'Anillo Biométrico YARD Titanio', 'Calcetines YARD Hexa-Grip'],
    gearFr: ['Chaussures YARD Nitro-Kinetic Carbon Elite', 'Hoodie Technique YARD Phantom Stealth', 'Bague Biométrique Titane YARD', 'Chaussettes YARD Hexa-Grip'],
    gearAr: ['حذاء يارد نيترو كاربون إيليت للركض', 'هودي يارد فانتوم ستيلث (الأسود الليلي)', 'خاتم يارد التيتانيوم الذكي للاستشفاء', 'جوارب يارد هيكسا-جريب الحركية']
  },
  {
    id: 'september-2026',
    monthEn: 'September 2026',
    monthEs: 'Septiembre 2026',
    monthFr: 'Septembre 2026',
    monthAr: 'سبتمبر 2026',
    year: 2026,
    nameEn: 'Yam Suw (Shaolin Fighter)',
    nameAr: 'يام سو (مقاتل شاولين)',
    titleEn: 'Shaolin Iron Body Master & YARD Co-Founder',
    titleEs: 'Maestro Cuerpo de Hierro Shaolin y Cofundador de YARD',
    titleFr: 'Maître Corps de Fer Shaolin & Cofondateur YARD',
    titleAr: 'سيد الجسد الحديدي وشاولين والشريك المؤسس',
    avatar: FOUNDER_YAM_SUW_IMAGE,
    videoThumbnail: '/images/shaolin_mountain_monastery.jpg',
    videoDuration: '14:20',
    powerScore: 47200,
    workoutHours: 82.0,
    streakDays: 60,
    acwr: '1.12',
    country: 'Global / Shaolin Tradition',
    flag: '🇯🇵',
    quoteEn: 'True power does not shout. It sits in stillness, flows like mountain water, and strikes like lightning.',
    quoteEs: 'El verdadero poder no grita: reposa en la calma, fluye como agua de montaña y golpea como un relámpago.',
    quoteFr: 'La vraie puissance ne crie pas : elle demeure calme, coule comme l’eau des montagnes et frappe comme la foudre.',
    quoteAr: 'القوة الحقيقية لا تصرخ. إنها تسكن في السكون، تتدفق كماء الجبال، وتضرب كالبرق الخاطف.',
    bioEn: 'In September, Master Yam Suw proved that traditional Shaolin discipline paired with modern kinetic telemetry creates an untouchable standard of functional conditioning.',
    bioEs: 'En septiembre, el Maestro Yam Suw demostró que la disciplina tradicional Shaolin unida a la telemetría cinética moderna crea un estándar insuperable.',
    bioFr: 'En septembre, Maître Yam Suw a prouvé que la discipline Shaolin alliée à la télémétrie cinétique moderne établit un standard inégalé.',
    bioAr: 'في سبتمبر، أثبت المعلم يام سو أن انضباط شاولين الأصيل عندما يندمج مع القياسات الحيوية الحديثة يخلق معياراً لا يمكن منافسته في القوة والتحمل.',
    dailyRoutine: [
      {
        time: '05:00',
        activityEn: 'Zen Meditation & Shaolin Horse Stance (30 Min)',
        activityEs: 'Meditación Zen y Postura del Caballo Shaolin (30 Min)',
        activityFr: 'Méditation Zen & Posture du Cavalier Shaolin (30 min)',
        activityAr: 'تأمل زن ووقفة الحصان في شاولين لمدة 30 دقيقة'
      },
      {
        time: '07:00',
        activityEn: 'Iron Palm Conditioning & Finger Strike Drills',
        activityEs: 'Acondicionamiento Palma de Hierro y precisión de impacto',
        activityFr: 'Conditionnement Paume de Fer & Précision de frappe',
        activityAr: 'تقوية قبضة اليد الحديدية وتدريبات الكف الفولاذي'
      },
      {
        time: '14:00',
        activityEn: 'Functional Kettlebell High-Rep Snatch (32kg)',
        activityEs: 'Arrancadas funcionales de Kettlebell (32kg)',
        activityFr: 'Arrachés fonctionnels Kettlebell haute intensité (32 kg)',
        activityAr: 'خطف كيتل بيل وظيفي بتكرارات مكثفة (وزن 32 كجم)'
      },
      {
        time: '19:00',
        activityEn: 'Traditional Staff Flow & Joint Flexibility Mobility',
        activityEs: 'Flujo tradicional con bastón y movilidad articular',
        activityFr: 'Enchaînements bâton traditionnel & mobilité articulaire',
        activityAr: 'قتال العصا التقليدية ومرونة المفاصل الانسيابية'
      }
    ],
    keyDisciplinesEn: ['Shaolin Kung Fu', 'Iron Body Conditioning', 'Mental Resilience', 'Calisthenics Mastery'],
    keyDisciplinesEs: ['Kung Fu Shaolin', 'Cuerpo de Hierro', 'Resiliencia Mental', 'Maestría Calistenia'],
    keyDisciplinesFr: ['Kung-Fu Shaolin', 'Corps de Fer', 'Résilience Mentale', 'Maîtrise Callisthénie'],
    keyDisciplinesAr: ['كونغ فو شاولين الأصيل', 'تصلب الجسد الحديدي', 'صلابة التركيز الذهني', 'إتقان الكاليستانكس'],
    gearEn: ['YARD Quantum-Kevlar Performance Strike Tee (Black)', 'YARD Apex Dual-Layer Combat Shorts', 'YARD Combat Hand Wraps'],
    gearEs: ['Camiseta YARD Quantum-Kevlar Negra', 'Shorts de Combate YARD Apex', 'Vendas de Combate YARD'],
    gearFr: ['T-Shirt YARD Quantum-Kevlar Noir', 'Short de Combat YARD Apex', 'Bandages de Combat YARD'],
    gearAr: ['تي شيرت يارد كوانتوم الهجومي (أسود)', 'شورت يارد أبيكس القتالي المزدوج', 'أربطة يارد القتالية للمعصم']
  },
  {
    id: 'august-2026',
    monthEn: 'August 2026',
    monthEs: 'Agosto 2026',
    monthFr: 'Août 2026',
    monthAr: 'أغسطس 2026',
    year: 2026,
    nameEn: 'Elena Rostova',
    nameAr: 'إيلينا روستوفا',
    titleEn: 'Olympic Functional Pacer & Hyrox Pro',
    titleEs: 'Atleta Funcional Olímpica y Hyrox Pro',
    titleFr: 'Athlète Fonctionnelle Olympique & Hyrox Pro',
    titleAr: 'بطلة الهايروكس والتحمل الأولمبي الوظيفي',
    avatar: BOXING_VALKYRIE_IMAGE,
    videoThumbnail: '/images/woman_slavic_boxer.jpg',
    videoDuration: '10:55',
    powerScore: 45800,
    workoutHours: 74.0,
    streakDays: 38,
    acwr: '1.10',
    country: 'France',
    flag: '🇫🇷',
    quoteEn: 'When lactic acid burns, that is where your transformation begins. Embrace the fire.',
    quoteEs: 'Cuando el ácido láctico arde, ahí comienza tu transformación. Abraza el fuego.',
    quoteFr: 'Quand l’acide lactique brûle, c’est là que commence votre transformation. Embrassez le feu.',
    quoteAr: 'حين تشعر بحرقة حمض اللاكتيك في عضلاتك، هناك تحديداً تبدأ ولادتك الجديدة. احتضن التحدي.',
    bioEn: 'Elena set the pacing standard in August with breathtaking sprint and kettlebell endurance, inspiring athletes across the YARD 300 community.',
    bioEs: 'Elena marcó la referencia de ritmo en agosto con sprints y resistencia con kettlebells de nivel olímpico.',
    bioFr: 'Elena a établi la référence en août avec des sprints et une endurance kettlebell de niveau olympique.',
    bioAr: 'سجلت إيلينا أرقاماً قياسية في أغسطس في سرعة التحمل ورفع الكيتل بيل، لتكون قدوة ملهمة في مجتمع YARD 300.',
    dailyRoutine: [
      {
        time: '06:00',
        activityEn: 'Mobility & Foam Rolling Activation',
        activityEs: 'Movilidad articular y activación miofascial',
        activityFr: 'Mobilité & Activation rouleau myofascial',
        activityAr: 'تمارين مرونة وتنشيط العضلات بالفوم رولر'
      },
      {
        time: '07:30',
        activityEn: 'Track 800m Repeats (VO2 Max Interval)',
        activityEs: 'Series de 800m en pista (Intervalo VO2 Max)',
        activityFr: 'Répétitions 800m sur piste (Intervalle VO2 Max)',
        activityAr: 'تكرارات 800 متر على المضمار لرفع الـ VO2 Max'
      },
      {
        time: '13:00',
        activityEn: 'Reformer Pilates Core Stabilization',
        activityEs: 'Estabilización del core en Pilates Reformer',
        activityFr: 'Stabilisation du tronc Pilates Reformer',
        activityAr: 'بيلاتس ريفورمر لثبات واستقرار الجذع'
      },
      {
        time: '17:30',
        activityEn: 'Burpee Broad Jumps & Wall Ball Circuit',
        activityEs: 'Circuito de saltos burpee y balones medicinales',
        activityFr: 'Circuit Burpee Broad Jumps & Wall Balls',
        activityAr: 'دائرة بيربي وقفزات طويلة مع كرات الحائط'
      }
    ],
    keyDisciplinesEn: ['VO2 Max Pacing', 'Reformer Pilates Balance', 'Functional Sprints', 'Lactate Threshold'],
    keyDisciplinesEs: ['Ritmo VO2 Max', 'Equilibrio Pilates Reformer', 'Sprints Funcionales', 'Umbral de Lactato'],
    keyDisciplinesFr: ['Allure VO2 Max', 'Équilibre Pilates Reformer', 'Sprints Fonctionnels', 'Seuil Lactique'],
    keyDisciplinesAr: ['إيقاع الـ VO2 Max', 'توازن بيلاتس ريفورمر', 'سباقات السرعة الوظيفية', 'عتبة اللاكتات القصوى'],
    gearEn: ['YARD Aerocore Precision Pilates Set (White & Black)', 'YARD Silk Deodorant Mist', 'YARD Studio Performance Grip Socks'],
    gearEs: ['Conjunto Pilates YARD Aerocore Precisión', 'Bruma Deodorante Seda YARD', 'Calcetines Studio YARD Grip'],
    gearFr: ['Ensemble Pilates YARD Aerocore Précision', 'Brume Déodorante Soie YARD', 'Chaussettes Studio YARD Grip'],
    gearAr: ['طقم بيلاتس يارد إيروكور المبتكر (أبيض وأسود)', 'رذاذ يارد الحريري', 'جوارب يارد جريب مانعة للانزلاق']
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
  const [videoProgress] = useState<number>(38);
  const [sharedToast, setSharedToast] = useState<boolean>(false);

  const champion = MONTHLY_CHAMPIONS[selectedChampionIndex];

  const monthText = tr(currentLang, {
    en: champion.monthEn,
    es: champion.monthEs,
    fr: champion.monthFr,
    ar: champion.monthAr
  });
  const nameText = isAr ? champion.nameAr : champion.nameEn;
  const titleText = tr(currentLang, {
    en: champion.titleEn,
    es: champion.titleEs,
    fr: champion.titleFr,
    ar: champion.titleAr
  });
  const quoteText = tr(currentLang, {
    en: champion.quoteEn,
    es: champion.quoteEs,
    fr: champion.quoteFr,
    ar: champion.quoteAr
  });
  const bioText = tr(currentLang, {
    en: champion.bioEn,
    es: champion.bioEs,
    fr: champion.bioFr,
    ar: champion.bioAr
  });
  const disciplines =
    currentLang === 'ar'
      ? champion.keyDisciplinesAr
      : currentLang === 'fr'
      ? champion.keyDisciplinesFr
      : currentLang === 'es'
      ? champion.keyDisciplinesEs
      : champion.keyDisciplinesEn;
  const gearList =
    currentLang === 'ar'
      ? champion.gearAr
      : currentLang === 'fr'
      ? champion.gearFr
      : currentLang === 'es'
      ? champion.gearEs
      : champion.gearEn;

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
      ar: `👑 شاهد فيلم وقصة بطل شهر ${champion.monthAr}: ${champion.nameAr} على منصة YARD 300! طاقة الهالة: ${champion.powerScore} AU 🔥`,
      fr: `👑 Regardez le documentaire du Champion du Mois : ${champion.nameEn} (${champion.monthFr}) sur YARD 300 ! Score : ${champion.powerScore} AU 🔥`,
      es: `👑 Mira el documental del Campeón del Mes: ${champion.nameEn} (${champion.monthEs}) en YARD 300. Poder: ${champion.powerScore} AU 🔥`,
      en: `👑 Watch the Champion of the Month Documentary: ${champion.nameEn} (${champion.monthEn}) on YARD 300! Peak Aura: ${champion.powerScore} AU 🔥`
    });
    navigator.clipboard.writeText(text);
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2500);
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`min-h-screen pt-28 pb-24 bg-[#050807] text-white relative overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}
    >
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#080D0B] hover:bg-[#0D1512] text-white border border-white/10 text-xs font-black font-anime cursor-pointer transition-all"
            >
              <span>
                {tr(currentLang, {
                  ar: '→ العودة للرئيسية',
                  fr: '← Retour à l’Accueil',
                  es: '← Volver al Inicio',
                  en: '← Back to Home'
                })}
              </span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080D0B] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-black font-anime">
            <Trophy className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {tr(currentLang, {
                ar: 'فيلم وقصة بطل الشهر // وثائقي شهري حصري',
                fr: 'DOCUMENTAIRE MENSUEL DU CHAMPION',
                es: 'DOCUMENTAL MENSUAL DEL CAMPEÓN',
                en: 'MONTHLY CHAMPION DOCUMENTARY & STORY'
              })}
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/40 text-[#10B981] text-xs font-black font-anime uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {tr(currentLang, {
                ar: 'شهرياً: فيديو وقصة المتصدر لذلك الشهر',
                fr: 'PROJETEUR SUR LE LEADER MENSUEL',
                es: 'FOCO EN EL LÍDER MENSUAL RANGO S',
                en: 'MONTHLY S-RANK LEADER SPOTLIGHT'
              })}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-anime text-white">
            {tr(currentLang, { ar: 'قصة ', fr: 'HISTOIRE DU ', es: 'HISTORIA DEL ', en: 'STORY OF ' })}
            <span className="text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              {tr(currentLang, { ar: 'بطل الشهر', fr: 'CHAMPION', es: 'CAMPEÓN', en: 'THE CHAMPION' })}
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 font-bold max-w-2xl mx-auto leading-relaxed">
            {tr(currentLang, {
              ar: 'نكرم شهرياً البطل الرياضي المتصدر للائحة العالمية بنشر فيلم وثائقي يستعرض رحلته، بروتوكوله التدريبي، وأسرار كسر الحواجز.',
              fr: 'Chaque mois, nous célébrons l’athlète N°1 mondial avec un documentaire exclusif, son protocole d’entraînement et son mental.',
              es: 'Cada mes celebramos al atleta número 1 del ranking mundial con un documental exclusivo y su protocolo de entrenamiento.',
              en: 'Each month, we celebrate the world #1 athlete on our global leaderboard with an exclusive documentary, workout breakdown, and mental blueprint.'
            })}
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
                    ? 'bg-[#D4AF37] text-[#050807] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105' 
                    : 'bg-[#080D0B] text-gray-300 hover:text-white border-white/10 hover:border-white/25'
                }`}
              >
                <span>{champ.flag}</span>
                <span>
                  {tr(currentLang, { en: champ.monthEn, es: champ.monthEs, fr: champ.monthFr, ar: champ.monthAr })}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Video Player & Documentary Showcase */}
        <div className="bg-[#080D0B] rounded-3xl border-2 border-white/10 hover:border-[#10B981]/50 p-6 md:p-8 mb-16 shadow-2xl relative overflow-hidden transition-all">
          <div className="relative w-full h-72 md:h-[460px] rounded-2xl overflow-hidden bg-black mb-6 group border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050807] via-[#080D0B] to-[#0D1A15] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-cyber-grid opacity-25" />
              <div className="absolute inset-0 bg-speedlines opacity-20" />
              
              <div className="flex items-end gap-1.5 sm:gap-2 h-36 opacity-35 px-8">
                {[35, 65, 85, 50, 95, 40, 75, 100, 60, 90, 45, 80, 70, 95, 30, 85, 60, 40, 90, 55].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 sm:w-2.5 rounded-t-full bg-gradient-to-t from-[#10B981] via-[#D4AF37] to-white transition-all duration-300"
                    style={{ 
                      height: isPlaying ? `${Math.min(100, (h * 1.3) % 100 + 15)}%` : `${h * 0.7}%`
                    }}
                  />
                ))}
              </div>

              <div className={`absolute bottom-16 left-6 right-6 flex flex-col ${isAr ? 'items-end text-right' : 'items-start text-left'} pointer-events-none`}>
                <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-widest bg-black/70 px-2 py-0.5 rounded">
                  DOCUMENTARY EPISODE // {champion.id.toUpperCase()}
                </span>
                <span className="text-xl sm:text-3xl font-black font-anime text-white drop-shadow-md">
                  {nameText}: {titleText}
                </span>
              </div>
            </div>

            {isPlaying && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981] text-[#050807] text-xs font-black font-anime shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#050807] animate-ping"></span>
                <span>
                  {tr(currentLang, {
                    ar: 'قيد التشغيل — وثائقي 4K',
                    fr: 'LECTURE — ULTRA HD 4K',
                    es: 'REPRODUCIENDO — 4K ULTRA HD',
                    en: 'NOW PLAYING — 4K ULTRA HD'
                  })}
                </span>
              </div>
            )}

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-sm border border-white/15 text-xs font-black text-[#D4AF37]">
                {champion.videoDuration}
              </span>
              <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-sm border border-white/15 text-xs font-black text-white">
                4K 60FPS
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayToggle}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#D4AF37] hover:bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 md:w-10 md:h-10 fill-current" />
                ) : (
                  <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />
                )}
              </button>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
              <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#10B981] h-full transition-all duration-300"
                  style={{ width: `${isPlaying ? 65 : videoProgress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-gray-300 pt-1">
                <div className="flex items-center gap-3">
                  <button onClick={handlePlayToggle} className="text-white hover:text-[#10B981] cursor-pointer">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={handleMuteToggle} className="text-white hover:text-[#10B981] cursor-pointer">
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="tabular-nums" dir="ltr">{isPlaying ? '08:14' : '04:32'} / {champion.videoDuration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#D4AF37] font-black font-anime">{nameText}</span>
                  <span className="text-gray-500">•</span>
                  <span>{champion.flag}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Documentary Title & Athlete Summary Card */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shrink-0 bg-[#050807] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
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
                  <h2 className="text-2xl md:text-3xl font-black font-anime text-white">{nameText}</h2>
                </div>
                <p className="text-xs md:text-sm font-bold text-[#D4AF37]">{titleText}</p>
                <span className="text-xs text-gray-400 font-medium">{monthText}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleShareStory}
                className="px-4 py-2.5 rounded-xl bg-[#0D1512] hover:bg-emerald-950 border border-white/10 text-xs font-black font-anime text-white flex items-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {tr(currentLang, {
                    ar: 'مشاركة قصة البطل',
                    fr: 'Partager le Documentaire',
                    es: 'Compartir Historia',
                    en: 'Share Documentary'
                  })}
                </span>
              </button>

              {onExploreLeaderboard && (
                <button
                  onClick={onExploreLeaderboard}
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-[#050807] font-black font-anime text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>
                    {tr(currentLang, {
                      ar: 'عرض لوحة الصدارة',
                      fr: 'Voir le Classement',
                      es: 'Ver Clasificación',
                      en: 'View Leaderboard'
                    })}
                  </span>
                </button>
              )}
            </div>
          </div>

          {sharedToast && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950 border border-[#10B981] text-white font-black text-xs text-center animate-bounce">
              ✓ {tr(currentLang, {
                ar: 'تم نسخ رابط ورسالة قصة البطل بنجاح!',
                fr: 'Lien du documentaire copié !',
                es: '¡Enlace de la historia copiado!',
                en: 'Champion story link copied to clipboard!'
              })}
            </div>
          )}

          {/* 4 Performance Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
            <div className="bg-[#0D1512] p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] text-gray-400 uppercase font-black block mb-1">
                {tr(currentLang, { ar: 'طاقة الهالة القصوى', fr: 'SCORE AURA MAX', es: 'PUNTUACIÓN MÁXIMA', en: 'PEAK AURA SCORE' })}
              </span>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-2xl font-black font-anime text-[#D4AF37] tabular-nums" dir="ltr">
                  {champion.powerScore.toLocaleString('en-US')} AU
                </span>
              </div>
            </div>

            <div className="bg-[#0D1512] p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] text-gray-400 uppercase font-black block mb-1">
                {tr(currentLang, { ar: 'ساعات التمرين الشهرية', fr: 'HEURES MENSUELLES', es: 'HORAS MENSUALES', en: 'MONTHLY WORKOUT HRS' })}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#10B981]" />
                <span className="text-2xl font-black font-anime text-white tabular-nums" dir="ltr">{champion.workoutHours} hrs</span>
              </div>
            </div>

            <div className="bg-[#0D1512] p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] text-gray-400 uppercase font-black block mb-1">
                {tr(currentLang, { ar: 'سلسلة الانتصارات', fr: 'SÉRIE EN COURS', es: 'RACHA ACTIVA', en: 'TRAINING STREAK' })}
              </span>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-2xl font-black font-anime text-white tabular-nums">
                  {champion.streakDays} {tr(currentLang, { ar: 'يوماً', fr: 'Jours', es: 'Días', en: 'Days' })}
                </span>
              </div>
            </div>

            <div className="bg-[#0D1512] p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] text-gray-400 uppercase font-black block mb-1">
                {tr(currentLang, { ar: 'مؤشر الجاهزية ACWR', fr: 'PRÉPARATION ACWR', es: 'PREPARACIÓN ACWR', en: 'READINESS ACWR' })}
              </span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span className="text-2xl font-black font-anime text-[#10B981] tabular-nums" dir="ltr">{champion.acwr}</span>
              </div>
            </div>
          </div>

          {/* Inspirational Champion Quote */}
          <div className={`p-6 rounded-2xl bg-gradient-to-r from-[#0D1512] to-[#080D0B] ${isAr ? 'border-r-4' : 'border-l-4'} border-[#D4AF37] my-6`}>
            <span className="text-xs text-[#D4AF37] font-black uppercase tracking-wider block mb-2">
              {tr(currentLang, { ar: 'كلمة البطل للمجتمع', fr: 'PHILOSOPHIE DU CHAMPION', es: 'FILOSOFÍA DEL CAMPEÓN', en: 'CHAMPION PHILOSOPHY' })}
            </span>
            <p className="text-base md:text-lg italic font-bold text-gray-200 leading-relaxed">
              &ldquo;{quoteText}&rdquo;
            </p>
          </div>

          {/* Documentary Bio & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black font-anime text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                  <span>{tr(currentLang, { ar: 'رحلة البطل إلى القمة', fr: 'La Route vers le N°1', es: 'El Camino al #1', en: 'The Path to #1' })}</span>
                </h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">{bioText}</p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase text-gray-400 mb-3">
                  {tr(currentLang, {
                    ar: 'التخصصات القتالية والرياضية الأساسية',
                    fr: 'DISCIPLINES ATHLÉTIQUES CLÉS',
                    es: 'DISCIPLINAS ATLÉTICAS CLAVE',
                    en: 'CORE ATHLETIC DISCIPLINES'
                  })}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {disciplines.map((d, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 rounded-xl bg-[#0D1512] border border-white/10 text-xs font-bold text-white flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{d}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase text-gray-400">
                    {tr(currentLang, {
                      ar: 'العتاد المعتمد في تدريب البطل',
                      fr: 'ARSENAL D’ÉQUIPEMENT DU CHAMPION',
                      es: 'ARSENAL DE EQUIPAMIENTO DEL CAMPEÓN',
                      en: 'CHAMPION GEAR ARSENAL'
                    })}
                  </h4>
                  {onExploreProducts && (
                    <button
                      onClick={onExploreProducts}
                      className="text-xs text-[#D4AF37] hover:underline font-black cursor-pointer"
                    >
                      {tr(currentLang, { ar: 'تسوق العتاد ←', fr: 'Voir la Boutique →', es: 'Ir a la Tienda →', en: 'Shop Gear →' })}
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {gearList.map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#0D1512] border border-white/10 text-xs font-bold text-gray-200">
                      <span>{g}</span>
                      <span className="text-[10px] text-[#10B981] bg-[#050807] border border-[#10B981]/30 px-2 py-0.5 rounded">YARD CERTIFIED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black font-anime text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#10B981]" />
                <span>
                  {tr(currentLang, {
                    ar: 'الجدول اليومي الدقيق للبطل',
                    fr: 'Programme Quotidien du Champion',
                    es: 'Rutina Diaria y Horario',
                    en: 'Daily Blueprint & Schedule'
                  })}
                </span>
              </h3>

              <div className="space-y-3">
                {champion.dailyRoutine.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#0D1512] border border-white/10 flex items-start gap-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[#050807] border border-[#10B981]/30 text-[#D4AF37] text-xs font-black font-anime shrink-0 tabular-nums" dir="ltr">
                      {step.time}
                    </span>
                    <p className="text-xs font-bold text-gray-300 leading-relaxed pt-0.5">
                      {tr(currentLang, {
                        en: step.activityEn,
                        es: step.activityEs,
                        fr: step.activityFr,
                        ar: step.activityAr
                      })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#0D1A14] via-[#080D0B] to-[#050807] border-2 border-[#D4AF37]/40 text-center space-y-3">
                <Sparkles className="w-6 h-6 text-[#D4AF37] mx-auto animate-bounce" />
                <h4 className="text-base font-black font-anime text-white">
                  {tr(currentLang, {
                    ar: 'هل تطمح لأن تكون بطل الشهر القادم؟',
                    fr: 'VOULEZ-VOUS ÊTRE LE PROCHAIN HÉROS ?',
                    es: '¿QUIERES SER EL PRÓXIMO HÉROE DEL MES?',
                    en: 'WANT TO BE NEXT MONTH’S HERO?'
                  })}
                </h4>
                <p className="text-xs text-gray-300 font-medium">
                  {tr(currentLang, {
                    ar: 'تدرب في صالة يارد، سجّل نقاطك الحيوية وتصدّر الترتيب العالمي. سنقوم بتصوير قصتك وبثها للعالم أجمع.',
                    fr: 'Entraînez-vous avec le moteur YARD, enregistrez vos données biométriques et atteignez la 1ère place.',
                    es: 'Entrena en el motor YARD, registra tus métricas biométricas y alcanza el puesto #1 mundial.',
                    en: 'Train in the Yard Engine, record your biometric stats, and climb to #1. We will officially produce and feature your documentary next month.'
                  })}
                </p>
                {onExploreLeaderboard && (
                  <button
                    onClick={onExploreLeaderboard}
                    className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-[#050807] font-black font-anime text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    {tr(currentLang, {
                      ar: 'ادخل حلبة المنافسة وتصدّر الآن',
                      fr: 'ENTRER DANS L’ARÈNE & VISER LE #1',
                      es: 'ENTRAR A LA ARENA Y COMPETIR POR EL #1',
                      en: 'ENTER ARENA & COMPETE FOR #1'
                    })}
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
