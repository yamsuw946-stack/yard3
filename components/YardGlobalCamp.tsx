/**
 * YardGlobalCamp.tsx
 * Official YARD 300 Global Expedition & Training Camp Portal
 * 
 * Core Features per User Instructions:
 * - Strictly 300 athletes per camp (300 شخص لكل مخيم)
 * - 3 Grand Expeditions annually (3 مغامرات سنوية استثنائية حول العالم)
 * - Under the direct supervision of the Three Founders and the Global Coaching Crew
 * - Engaging, cinematic, and compelling copy about the expedition squad
 * - No 10-day day-by-day timeline (خطة الـ 10 أيام ملغية حسب الطلب)
 * - No fixed calendar dates (المواعيد تعلن للمقبولين فقط)
 * - No coach photos in the camp section
 * - 100% borderless obsidian cyber aesthetic
 */

import React, { useState } from 'react';
import { 
  Compass, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Mountain, 
  Flame, 
  ArrowRight, 
  Send, 
  X,
  Award,
  HeartPulse,
  Crown,
  Zap,
  Target,
  Swords,
  ChevronRight,
  EyeOff,
  ShieldAlert
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

interface YardGlobalCampProps {
  currentLang?: Language;
  onExploreGear?: () => void;
}

interface CampExpeditionPlan {
  id: string;
  seasonEn: string;
  seasonAr: string;
  seasonFr: string;
  seasonEs: string;
  phaseEn: string;
  phaseAr: string;
  phaseFr: string;
  phaseEs: string;
  titleEn: string;
  titleAr: string;
  titleFr: string;
  titleEs: string;
  spotsTotal: number;
  taglineEn: string;
  taglineAr: string;
  taglineFr: string;
  taglineEs: string;
  highlightEn: string;
  highlightAr: string;
  highlightFr: string;
  highlightEs: string;
  trainingFocusEn: string[];
  trainingFocusAr: string[];
  accentColor: string;
  atmosphereEn: string;
  atmosphereAr: string;
  atmosphereFr: string;
  atmosphereEs: string;
  image: string;
  imageCaptionEn: string;
  imageCaptionAr: string;
  imageCaptionFr: string;
  imageCaptionEs: string;
}

const EXPEDITION_PLANS: CampExpeditionPlan[] = [
  {
    id: 'expedition-01',
    seasonEn: 'EXPEDITION 01 // UNCHARTED HIGHLANDS',
    seasonAr: 'المغامرة 01 // قمم المرتفعات المجهولة',
    seasonFr: 'EXPÉDITION 01 // HAUTES CRÊTES SAUVAGES',
    seasonEs: 'EXPEDICIÓN 01 // CUMBRES VÍRGENES',
    phaseEn: 'Annual Expedition 01 (300 Athletes)',
    phaseAr: 'المغامرة الأولى للعام (300 رياضي)',
    phaseFr: 'Première Expédition Annuelle (300 Athlètes)',
    phaseEs: 'Primera Expedición Anual (300 Atletas)',
    titleEn: 'Highland Ridge Traverses & Hypoxic Combat Gauntlet',
    titleAr: 'تضاريس برية وعرة وتدريب قتالي في نقص الأكسجين',
    titleFr: 'Traversée des Crêtes & Combat en Hypoxie',
    titleEs: 'Travesía de Crestas y Combate en Hipoxia',
    spotsTotal: 300,
    taglineEn: 'An intense expedition ascending into uncharted, raw mountain ridges untouched by tourism. High-altitude striking gauntlets in thin air, steep incline traverses testing oxygen uptake, and the 100-strike ridge challenge against wild winds under misty skies.',
    taglineAr: 'رحلة استكشافية تصعد بك إلى قمم برية بكر نائية لم تطأها أقدام السياح. تدريب قتالي مكثف على تسديد الضربات في الهواء الخفيف، وركض صعودي شاق يختبر ضخ الأكسجين، وتحدي تسديد 100 لكمة متتالية ضد الرياح العاتية ومسير ليلي في الضباب لصقل الصلابة الذهنية وأخوة السلاح بين الـ 300.',
    taglineFr: "Une expédition ascendant vers des crêtes sauvages et préservées. Frappes martiales intenses en air raréfié, montées raides repoussant l'endurance pulmonaire et l'épreuve des 100 frappes consécutives face au vent dans la brume.",
    taglineEs: 'Una expedición hacia cumbres vírgenes e inexploradas. Golpeo marcial en altitud con aire ligero, ascensos pronunciados que desafían la oxigenación y el reto de los 100 golpes continuos contra el viento entre la niebla.',
    highlightEn: 'The 100-Strike Ridge Gauntlet & Midnight Summit Pacing',
    highlightAr: 'تحدي الـ 100 لكمة على حواف القمم والمسير الليلي الصامت في الضباب',
    highlightFr: 'Défi des 100 Frappes sur Crêtes & Marche Nocturne',
    highlightEs: 'Reto de los 100 Golpes en Crestas y Marcha Nocturna',
    trainingFocusEn: ['Hypoxic Power Transfer', 'Explosive Bodyweight Levers', 'Ridge Trail Endurance', 'Unbreakable Mental Grit'],
    trainingFocusAr: ['نقل القوة في نقص الأكسجين', 'كاليستنكس القوة الانفجارية', 'تحمل التضاريس الصخرية', 'صلابة ذهنية لا تتزحزح'],
    accentColor: '#FFE600',
    atmosphereEn: 'Thin Air • Mist & Forest • Raw Earth',
    atmosphereAr: 'هواء نقي نادر • غابات وضباب • أرض حرة',
    atmosphereFr: 'Air Pur Raréfié • Brume & Forêts • Terre Sauvage',
    atmosphereEs: 'Aire Puro Ligero • Niebla y Bosque • Tierra Virgen',
    image: '/images/yard_camp_expedition.jpg',
    imageCaptionEn: 'Alpine Ridge Sprints & Hypoxic Gauntlet',
    imageCaptionAr: 'المسير الجبلي الشاق وركض التضاريس الوعرة على قمم الضباب',
    imageCaptionFr: 'Sprint sur Crêtes & Frappes dans la Brume',
    imageCaptionEs: 'Carrera en Crestas y Boxeo en la Niebla'
  },
  {
    id: 'expedition-02',
    seasonEn: 'EXPEDITION 02 // SUB-ZERO SANCTUARY',
    seasonAr: 'المغامرة 02 // ملاذ الأنهار والمياه الجليدية',
    seasonFr: 'EXPÉDITION 02 // EAUX GLACIAIRES',
    seasonEs: 'EXPEDICIÓN 02 // AGUAS GLACIARES',
    phaseEn: 'Annual Expedition 02 (300 Athletes)',
    phaseAr: 'المغامرة الثانية للعام (300 رياضي)',
    phaseFr: 'Deuxième Expédition Annuelle (300 Athlètes)',
    phaseEs: 'Segunda Expedición Anual (300 Atletas)',
    titleEn: 'Glacial Waters, Kinetic Agility & Cold Flow Resilience',
    titleAr: 'مياه جليدية جامحة، خفة الحركة وسرعة رد الفعل',
    titleFr: 'Eaux Glaciaires, Agilité & Résilience au Froid',
    titleEs: 'Aguas Glaciares, Agilidad y Resiliencia al Frío',
    spotsTotal: 300,
    taglineEn: 'A transformative wild immersion: navigating roaring cold water currents, aquatic resistance striking to forge blistering punch velocity, and sub-zero thermogenesis resetting the central nervous system for total physical restoration.',
    taglineAr: 'مغامرة استثنائية لم تفكر فيها يوماً: عبور التيارات النهرية الباردة، ومواجهة تدفق المياه لزيادة مقاومة وسرعة اللكمات، والانغماس الكامل في المياه الجليدية لتحفيز الجهاز العصبي الودي، وتسريع التعافي العضلي ومحاذاة القوام الفولاذي.',
    taglineFr: "Une immersion sauvage transformatrice : traversée de cours d'eau vifs, frappes contre la résistance aquatique pour booster la vitesse, et immersion glacée réinitialisant le système nerveux central.",
    taglineEs: 'Una inmersión indómita: cruce de corrientes frías, golpeo contra la resistencia del agua para maximizar la velocidad y choque térmico que resetea el sistema nervioso central.',
    highlightEn: 'Glacial Sprints, Ice Immersion Reset & Kinetic Posture Matrix',
    highlightAr: 'سباقات الركض المائي، استشفاء الصدمة الباردة ومحاذاة القوام الفولاذي',
    highlightFr: 'Course Aquatique & Récupération par Choc Thermique',
    highlightEs: 'Carrera Acuática y Recuperación por Choque Térmico',
    trainingFocusEn: ['Cold Water Adaptation', 'Neuromuscular Realignment', 'Tendon Elasticity Flow', 'Systemic HRV Recovery'],
    trainingFocusAr: ['التكيف مع المياه الجليدية', 'إعادة موازنة الجهاز العصبي', 'مرونة الأوتار والأربطة', 'تسريع نبض التعافي العميق'],
    accentColor: '#10B981',
    atmosphereEn: 'Glacial Roar • Sub-Zero Crispness • Deep Wilderness',
    atmosphereAr: 'هدير الأنهار • برودة طبيعية منعشة • عزلة تامة',
    atmosphereFr: 'Grondement des Rivières • Fraîcheur Polaire • Silence Sauvage',
    atmosphereEs: 'Rugido de Ríos • Frescura Glaciar • Aislamiento Total',
    image: '/images/camp_glacial_waterfall.jpg',
    imageCaptionEn: 'Glacial River Combat & Sub-Zero Thermogenesis',
    imageCaptionAr: 'التدريب المائي في الأنهار الجليدية واستشفاء المياه الباردة',
    imageCaptionFr: 'Combat Aquatique & Choc Thermique',
    imageCaptionEs: 'Combate Acuático y Resiliencia Fría'
  },
  {
    id: 'expedition-03',
    seasonEn: 'EXPEDITION 03 // THE DUNE CRUCIBLE',
    seasonAr: 'المغامرة 03 // معسكر الكثبان والتحدي الحراري الأقصى',
    seasonFr: 'EXPÉDITION 03 // LE DÉFI DES DUNES',
    seasonEs: 'EXPEDICIÓN 03 // EL CRISOL DE DUNAS',
    phaseEn: 'Annual Expedition 03 (300 Athletes)',
    phaseAr: 'المغامرة الثالثة للعام (300 رياضي)',
    phaseFr: 'Troisième Expédition Annuelle (300 Athlètes)',
    phaseEs: 'Tercera Expedición Anual (300 Atletas)',
    titleEn: 'Desert Dune Sleds, Heat Adaptation & Starlit Endurance',
    titleAr: 'سحب الأوزان الثقيلة، التكيف الحراري والملاكمة تحت النجوم',
    titleFr: 'Dunes Extrêmes, Traction de Charge & Nuit Étoilée',
    titleEs: 'Dunas Extremas, Arrastre Pesado y Marcha Nocturna',
    spotsTotal: 300,
    taglineEn: 'A relentless endurance crucible beneath an endless sky: heavy sled drags across shifting sands building posterior chain explosion, starlit tactical shadow boxing, culminating in the united 42km endurance traverse in complete wilderness solitude.',
    taglineAr: 'تحدٍ بدني مهيب تحت قبة السماء المفتوحة: سحب المزالج والأوزان الثقيلة على الكثبان الرملية لبناء القوة الانفجارية لعضلات الفخذ والظهر، تليها جولات ملاكمة الظل الليلية، ومسير التحمل المتواصل لمسافة 42 كم تحت النجوم في صمت البرية.',
    taglineFr: "Une épreuve d'endurance majeure sous une voûte céleste infinie : traction de traîneaux lourds sur le sable pour forger des jambes d'acier, boxe sous les étoiles et grande marche de 42 km dans le silence de la nuit.",
    taglineEs: 'Un crisol de resistencia implacable: arrastre de trineos pesados en arena para construir potencia pura de piernas, golpeo bajo las estrellas y la legendaria marcha nocturna de 42 km en soledad salvaje.',
    highlightEn: 'The 300 Sand Crucible & 42km Starlit Endurance March',
    highlightAr: 'تحدي الكثبان الشامل ومسير التحمل الليلي الموحد لمسافة 42 كم',
    highlightFr: 'Défi des Sables & Marche Nocturne de 42 km',
    highlightEs: 'Reto de Dunas y Marcha Nocturna de 42 km',
    trainingFocusEn: ['Thermal Resilience Training', 'Deep Sand Traction Power', 'Starlit Shadow Striking', '42km Ultra Brotherhood Traverse'],
    trainingFocusAr: ['بناء المقاومة للحرارة الشديدة', 'قوة الجر على الرمال المتحركة', 'ملاكمة الظل والنزالات الليلية', 'مسير الـ 42 كم التضامني'],
    accentColor: '#9333EA',
    atmosphereEn: 'Crimson Dunes • Starlit Infinity • Primal Silence',
    atmosphereAr: 'كثبان ذهبية حمراء • سماء مرصعة بالنجوم • صمت مهيب',
    atmosphereFr: 'Dunes Rouges Flamboyantes • Ciel Étoilé • Silence Pur',
    atmosphereEs: 'Dunas Rojas • Cielo Infinito • Silencio Puro',
    image: '/images/camp_desert_dunes.jpg',
    imageCaptionEn: 'Desert Dune Sled Drag & 42km Starlit March',
    imageCaptionAr: 'سحب المزالج والأوزان الثقيلة على الكثبان الذهبية الشاسعة',
    imageCaptionFr: 'Traction de Charge & Marche Nocturne 42km',
    imageCaptionEs: 'Arrastre de Carga y Marcha Nocturna 42km'
  }
];

export const YardGlobalCamp: React.FC<YardGlobalCampProps> = ({ currentLang = 'en', onExploreGear }) => {
  const isAr = currentLang === 'ar';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const [selectedPlan, setSelectedPlan] = useState<string>('expedition-01');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState<boolean>(false);

  // Form State
  const [athleteName, setAthleteName] = useState<string>('');
  const [athleteEmail, setAthleteEmail] = useState<string>('');
  const [athletePhone, setAthletePhone] = useState<string>('');
  const [athleteSport, setAthleteSport] = useState<string>('combat');
  const [yearsExperience, setYearsExperience] = useState<string>('3-5');
  const [motivationNote, setMotivationNote] = useState<string>('');

  const currentPlanData = EXPEDITION_PLANS.find(p => p.id === selectedPlan) || EXPEDITION_PLANS[0];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteName.trim() || !athleteEmail.trim()) return;
    soundFX.playPowerUp();
    setApplicationSubmitted(true);
  };

  const handleCloseModal = () => {
    setIsApplyModalOpen(false);
    setApplicationSubmitted(false);
  };

  return (
    <div className={`py-12 md:py-20 px-4 sm:px-6 md:px-12 bg-black text-white relative w-full max-w-full overflow-hidden ${
      isAr ? 'text-right' : 'text-left'
    }`}>
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-white/5 via-[#FFE600]/5 to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-[1700px] mx-auto relative z-10 space-y-16">
        
        {/* ==================================================================== */}
        {/* SECTION HERO HEADER                                                  */}
        {/* ==================================================================== */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white font-anime text-xs font-black tracking-widest uppercase shadow-md">
            <Compass className="w-4 h-4 text-[#FFE600] animate-spin" style={{ animationDuration: '10s' }} />
            <span>{isAr ? '🌍 معسكر يارد 300 الدولي // 300 شخص لكل مخيم' : isFr ? '🌍 CAMP MONDIAL YARD 300 // 300 ATHLÈTES PAR CAMP' : isEs ? '🌍 CAMPAMENTO GLOBAL YARD 300 // 300 ATLETAS POR CAMP' : '🌍 YARD 300 EXPEDITION CAMP // 300 ATHLETES PER CAMP'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-anime text-white tracking-tight leading-tight">
            {isAr ? 'معسكر التدريب والمغامرة ' : isFr ? 'LE GRAND CAMP ' : isEs ? 'EL GRAN CAMPAMENTO ' : 'THE GLOBAL '}
            <span className="text-[#FFE600]">
              {isAr ? 'حول العالم' : isFr ? 'MONDIAL 300' : isEs ? 'GLOBAL 300' : '300 CRUCIBLE'}
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 font-bold leading-relaxed max-w-3xl">
            {isAr
              ? 'معسكر حصري واستثنائي يضم 300 شخص في كل مخيم، تحت الإشراف المباشر للمؤسسين الثلاثة وباقي فريق المدربين حول العالم، في 3 مغامرات كبرى سنوياً لخوض تجربة تدريب فريدة وقاسية تحطم كل سقف للقدرة البشرية!'
              : isFr
              ? "Strictement 300 athlètes par camp sous la supervision directe des 3 fondateurs et de l'équipe internationale de coachs. 3 grandes expéditions annuelles en pleine nature sauvage pour des sportifs aux standards d'élite !"
              : isEs
              ? 'Exactamente 300 atletas por campamento bajo la supervisión directa de los 3 fundadores y el equipo global de entrenadores. 3 grandes expediciones anuales en parajes indómitos para una experiencia única y exigente.'
              : 'Strictly 300 verified athletes per camp, under direct supervision of the three visionary founders and our international coaching crew. 3 grand expeditions annually across uncharted lands for a unique, relentlessly demanding training crucible!'}
          </p>

          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full pt-4">
            <div className="p-5 rounded-2xl bg-[#0D0E14] shadow-lg text-center space-y-1">
              <span className="block text-3xl md:text-5xl font-black font-anime text-[#FFE600]">300</span>
              <span className="text-xs font-bold text-gray-300 block">
                {isAr ? 'رياضي لكل مخيم بالتحديد' : isFr ? 'Athlètes par camp' : isEs ? 'Atletas por campamento' : 'Athletes Per Camp'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D0E14] shadow-lg text-center space-y-1">
              <span className="block text-3xl md:text-5xl font-black font-anime text-[#10B981]">3</span>
              <span className="text-xs font-bold text-gray-300 block">
                {isAr ? 'مغامرات استثنائية سنوياً' : isFr ? 'Grandes expéditions / an' : isEs ? 'Grandes expediciones / año' : 'Grand Annual Expeditions'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D0E14] shadow-lg text-center space-y-1">
              <span className="block text-3xl md:text-5xl font-black font-anime text-white">3</span>
              <span className="text-xs font-bold text-gray-300 block">
                {isAr ? 'مؤسسون يشرفون مباشرة' : isFr ? 'Fondateurs superviseurs' : isEs ? 'Fundadores supervisores' : 'Visionary Founders'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D0E14] shadow-lg text-center space-y-1">
              <span className="block text-3xl md:text-5xl font-black font-mono text-[#10B981]" dir="ltr">100%</span>
              <span className="text-xs font-bold text-gray-300 block">
                {isAr ? 'شامل الإقامة والعتاد والتغذية' : isFr ? 'Séjour & équipement inclus' : isEs ? 'Estancia y equipo incluido' : 'All-Inclusive Elite Villa'}
              </span>
            </div>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* MOTIVATIONAL CAMP PANORAMA HERO BANNER                               */}
        {/* ==================================================================== */}
        <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.25)] border border-white/10 group">
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full min-h-[260px] max-h-[460px] overflow-hidden">
            <img 
              src="/images/yard_camp_expedition.jpg"
              alt="YARD 300 Global Camp Wild Ridge Expedition"
              onError={handleImageError}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60" />

            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="px-3 py-1 rounded-full bg-[#10B981] text-black text-[10px] sm:text-xs font-black font-anime uppercase tracking-wider inline-flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>{isAr ? 'معايشة واقعية وتدريب قاسي في الطبيعة الحرة' : isFr ? 'IMMERSION RÉELLE EN PLEINE NATURE SAUVAGE' : isEs ? 'INMERSIÓN REAL EN LA NATURALEZA SALVAJE' : 'RAW WILD UNCHARTED TERRAIN & ENDURANCE RETREAT'}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-anime text-white">
                  {isAr ? 'حيث يلتقي التدريب القاسي مع الطبيعة الحرة' : isFr ? 'Où la Rigueur du Combat Rencontre la Nature Libre' : isEs ? 'Donde la Disciplina del Combate Encuentra la Libertad' : 'Where Brutal Combat Training Meets Untamed Wilderness'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-bold leading-relaxed hidden sm:block">
                  {isAr
                    ? '300 شخص فقط لكل مخيم، تحت الإشراف المباشر للمؤسسين الثلاثة وباقي فريق المدربين حول العالم.'
                    : isFr
                    ? "Strictement 300 athlètes par camp sous la supervision directe des 3 fondateurs et de l'équipe internationale."
                    : isEs
                    ? "Exactamente 300 atletas por campamento supervisados por los 3 fundadores y el equipo global."
                    : 'Strictly 300 athletes per camp under direct supervision of the 3 founders, led by the 3 founders and the global coaching team.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-[#FFE600]/40 text-[#FFE600] font-mono text-xs font-black">
                  300 ATHLETES / CAMP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* PHILOSOPHY & SUPERVISION OF THE THREE FOUNDERS & GLOBAL CREW        */}
        {/* ==================================================================== */}
        <div className="rounded-3xl p-6 sm:p-10 md:p-14 bg-gradient-to-br from-[#121422] via-[#0A0C14] to-[#181A2A] shadow-2xl space-y-8 relative overflow-hidden">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/20 text-[#FFE600] text-xs font-black font-anime uppercase tracking-wider">
                <Crown className="w-4 h-4 text-[#FFE600]" />
                <span>
                  {isAr ? 'فلسفة القيادة ومعايير النخبة' : isFr ? 'PHILOSOPHIE & HAUTS STANDARDS' : isEs ? 'FILOSOFÍA Y ALTOS ESTÁNDARES' : 'LEADERSHIP ETHOS & HIGH STANDARDS'}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-anime text-white">
                {isAr ? 'المؤسسون الثلاثة وفريق المغامرة والتدريب حول العالم' : isFr ? "Les 3 Fondateurs & l'Équipe Internationale" : isEs ? 'Los 3 Fundadores y el Equipo Global de Expedición' : 'The 3 Founders & Global Adventure Crew'}
              </h2>
            </div>
            
            <span className="text-xs font-mono font-bold text-gray-400 bg-black/70 px-3 py-1.5 rounded-xl">
              {isAr ? 'معايير عالية • انضباط واقعي • 300 مقعد' : isFr ? 'STANDARDS ÉLEVÉS • DISCIPLINE RÉELLE • 300 PLACES' : isEs ? 'ALTOS ESTÁNDARES • DISCIPLINA REAL • 300 PLAZAS' : 'HIGH STANDARDS • REAL-WORLD DISCIPLINE • 300 SLOTS'}
            </span>
          </div>

          {/* Compelling & Realistic Story about the Founders and Global Adventure Team */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black/75 shadow-inner space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-black font-black font-anime text-xl shadow-lg shrink-0">
                3F
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-anime text-white">
                  {isAr ? 'المؤسسون الثلاثة وطاقم التدريب العالمي' : isFr ? "LES 3 FONDATEURS & L'ÉQUIPE MONDIALE" : isEs ? 'LOS 3 FUNDADORES Y EL EQUIPO GLOBAL' : 'THE 3 FOUNDERS & THE GLOBAL COACHING SQUAD'}
                </h3>
                <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider block">
                  {isAr ? 'حياة مهنية حافلة بالمسؤوليات، والتزام لا يتنازل عن معايير الجسد والروح' : isFr ? "Carrières professionnelles intenses, dévouement absolu au corps et à l'esprit" : isEs ? 'Carreras profesionales exigentes y un compromiso innegociable con el cuerpo' : 'Demanding Executive Careers Balanced with Uncompromising Bodily Standards'}
                </span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-gray-200 font-bold leading-relaxed">
              {isAr 
                ? 'المؤسسون الثلاثة وفريق المغامرة حول العالم ليسوا متفرغين بمعزل عن ضغوط العالم الحقيقي؛ بل هم قادة ورواد أعمال يمتلكون حياتهم المهنية والعملية اليومية المليئة بالمسؤوليات والارتباطات الجادة. ومع ذلك، لم تكن ضغوط العمل يوماً عائقاً أمام شغفهم الحقيقي؛ فهم يقتطعون دائماً وقتاً مقدساً لا يتنازلون عنه للاهتمام بأجسادهم، وصقل لياقتهم، وخوض المغامرات البرية القاسية. هذا الالتزام نابع من قناعة راسخة بأنهم أشخاص ذوو معايير عالية يرفضون الأعذار، ويؤمنون بأن الجسد القوي والعقل الصافي هما المحرك الأساسي لاتخاذ القرارات الحاسمة والنجاح في العالم الحقيقي.'
                : isFr
                ? "Les 3 Fondateurs et notre collectif international d'entraîneurs et d'aventuriers mènent tous des carrières professionnelles et entrepreneuriales particulièrement exigeantes. Pourtant, malgré des agendas surchargés et de lourdes responsabilités, ils ne négocient jamais avec leur santé : ils sanctuarisent chaque jour un temps précieux pour fortifier leur corps, affûter leur discipline et s'élancer dans des aventures sauvages. Pourquoi ? Parce qu'ils cultivent des standards personnels très élevés, convaincus que la vitalité physique et la clarté mentale constituent le moteur fondamental pour triompher dans la vie réelle."
                : isEs
                ? 'Los 3 Fundadores y el equipo global de expedición dirigen vidas laborales y empresariales sumamente demandantes en el mundo real. Sin embargo, a pesar de sus intensas responsabilidades diarias, jamás sacrifican el cuidado de su cuerpo ni su pasión por la aventura; siempre encuentran y protegen ese tiempo dedicado a forjar su fuerza física y mental. Esta disciplina proviene de una convicción inquebrantable: son personas con estándares excepcionalmente altos que entienden que un cuerpo vigoroso y una mente templada son el motor esencial para liderar y triunfar en cualquier ámbito.'
                : 'The Three Founders and our global adventure coaching team are not detached athletes living in isolation; they lead demanding professional careers and executive obligations in the real world. Yet, despite hectic schedules and high-stakes responsibilities, they consistently carve out sacred, non-negotiable time for bodily conditioning, combat training, and wild expeditions. This unwavering discipline is born from a singular truth: they are high-standard individuals who reject excuses, knowing that peak physical power and sharp mental clarity are the ultimate catalyst for extraordinary execution in real life.'}
            </p>

            <div className="p-5 rounded-xl bg-[#141624] space-y-2">
              <div className="flex items-center gap-2 text-[#FFE600]">
                <Flame className="w-5 h-5 text-[#E50914] animate-pulse" />
                <h4 className="text-sm font-black font-anime uppercase tracking-wider text-white">
                  {isAr ? 'تجربة 300 شخص لكل مخيم: لقاء النخبة في تضاريس مجهولة' : isFr ? "EXPÉRIENCE DE 300 ATHLÈTES PAR CAMP : L'ALLIANCE DES STANDARDS D'ÉLITE" : isEs ? 'EXPERIENCIA DE 300 ATLETAS POR CAMPAMENTO: EL ENCUENTRO DE LA ÉLITE' : 'THE 300 ATHLETES CRUCIBLE: WHERE HIGH STANDARDS CONVERGE'}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
                {isAr
                  ? 'من هذه الفلسفة الواقعية والصلبة وُلد معسكر YARD 300: تجربة تدريبية ومغامرة حقيقية تضم 300 شخص فقط لكل مخيم، تحت إشراف المؤسسين الثلاثة وباقي فريق المدربين المحترفين المنتشرين حول العالم. ستتدرب معهم بأسلوب علمي وقاسٍ في تضاريس سرية لم تفكر فيها يوماً، حيث تتبدد الأعذار وتُصقل العزائم، لتكتشف كيف يعيش أصحاب المعايير العالية ويصنعون التوازن الأسطوري بين العمل والحياة والجسد.'
                  : isFr
                  ? "C'est de cette philosophie pragmatique et intransigeante qu'est né le camp YARD 300 : une immersion rassemblant strictement 300 participants par camp, sous la houlette directe des 3 fondateurs et de nos coachs d'élite à travers le monde. Vous vous entraînerez dans des contrées secrètes et spectaculaires, apprenant à maîtriser le temps, à détruire les excuses et à intégrer cette haute exigence dans votre propre quotidien."
                  : isEs
                  ? 'De esta filosofía realista y sólida nace el campamento YARD 300: una experiencia rigurosa limitada estrictamente a 300 participantes por edición, bajo la dirección directa de los 3 fundadores y el equipo global de entrenadores especializados. Entrenarás en geografías remotas e inexploradas, derribando barreras mentales y aprendiendo de primera mano cómo las personas con altos estándares dominan el equilibrio entre carrera, disciplina física y vida.'
                  : 'From this grounded, uncompromising ethos, the YARD 300 Camp was born: an authentic expedition limited strictly to 300 participants per camp, supervised directly by the Three Founders alongside our international roster of elite coaches. Training across secret planetary terrains, you will dissolve excuses, sharpen your biology, and adopt the operating standards of leaders who refuse to compromise on either their careers or their physical power.'}
              </p>
            </div>

            {/* Three Foundational Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-black/50 space-y-1 text-center md:text-right">
                <span className="text-xs font-black font-anime text-[#FFE600] uppercase block">
                  {isAr ? '• الركيزة الأولى: المؤسسون الثلاثة' : isFr ? '1. LES 3 FONDATEURS' : isEs ? '1. LOS 3 FUNDADORES' : '1. THE THREE FOUNDERS'}
                </span>
                <span className="text-xs font-bold text-white block">
                  {isAr ? 'القيادة التنفيذية ومعايير الانضباط' : isFr ? 'Leadership Exécutif & Standards Élevés' : isEs ? 'Liderazgo Ejecutivo y Altos Estándares' : 'Executive Leadership & High Standards'}
                </span>
                <p className="text-[11px] text-gray-400">
                  {isAr ? 'التجسيد العملي لكيفية الموازنة الصارمة بين الحياة المهنية المليئة بالمسؤوليات وبناء جسد استثنائي دون أعذار.' : isFr ? "L'incarnation vivante de l'équilibre parfait entre carrières professionnelles exigeantes et condition physique souveraine." : isEs ? 'El modelo real de equilibrio entre agendas laborales intensas y la construcción de un cuerpo fuerte sin excusas.' : 'The living blueprint of balancing high-stakes professional careers with uncompromising physical mastery.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 space-y-1 text-center md:text-right">
                <span className="text-xs font-black font-anime text-[#10B981] uppercase block">
                  {isAr ? '• الركيزة الثانية: فريق المدربين حول العالم' : isFr ? "2. L'ÉQUIPE MONDIALE DE COACHS" : isEs ? '2. EL EQUIPO GLOBAL DE ENTRENADORES' : '2. GLOBAL COACHING CREW'}
                </span>
                <span className="text-xs font-bold text-white block">
                  {isAr ? 'الميكانيكا الحيوية والفسيولوجيا والقتال' : isFr ? 'Biomécanique, Physiologie & Combat' : isEs ? 'Biomecánica, Fisiología y Combate' : 'Biomechanics, Physiology & Combat'}
                </span>
                <p className="text-[11px] text-gray-400">
                  {isAr ? 'نخبة مختارة من مدربي الفنون القتالية والفسيولوجيا الرياضية لضمان تدريب قاسي وآمن ومحسوب بدقة لحماية المفاصل.' : isFr ? 'Experts mondiaux en biomécanique, arts martiaux et physiologie sportive pour un entraînement à haute intensité sans blessure.' : isEs ? 'Especialistas internacionales en combate y fisiología para asegurar una exigencia brutal con óptima protección articular.' : 'Elite international combat trainers and exercise physiologists ensuring ruthless intensity coupled with joint longevity.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 space-y-1 text-center md:text-right">
                <span className="text-xs font-black font-anime text-[#00F0FF] uppercase block">
                  {isAr ? '• الركيزة الثالثة: مجتمع الـ 300 رياضي' : isFr ? '3. LA COMMUNAUTÉ DES 300' : isEs ? '3. LA COMUNIDAD DE LOS 300' : '3. THE 300 ATHLETES COHORT'}
                </span>
                <span className="text-xs font-bold text-white block">
                  {isAr ? 'البيئة المحفزة والتناغم الفكري' : isFr ? "Synergie d'Élite & Esprit de Corps" : isEs ? 'Sinergia de Élite y Espíritu de Superación' : 'Elite Synergy & Shared Ambition'}
                </span>
                <p className="text-[11px] text-gray-400">
                  {isAr ? '300 مشارك لكل معسكر يحملون نفس الشغف والمعايير العالية، يتبادلون الخبرات ويتحدون الصعاب معاً في البرية.' : isFr ? '300 passionnés partageant les mêmes exigences absolues, forgeant des liens indéfectibles au cœur de la nature sauvage.' : isEs ? '300 atletas con la misma mentalidad y exigencia, compartiendo superación y camaradería en parajes indómitos.' : '300 verified peers who refuse mediocrity, bonding and testing their spirits together across uncharted wilderness.'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================================== */}
        {/* THE 3 ANNUAL EXPEDITIONS — STRICTLY 300 PER CAMP                    */}
        {/* ==================================================================== */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black font-anime text-[#10B981] uppercase tracking-wider block">
                {isAr ? 'مغامرات العام الثلاث // 300 مقعد لكل مغامرة' : 'THE 3 GRAND ANNUAL EXPEDITIONS // 300 SPOTS EACH'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-anime text-white">
                {isAr ? 'المغامرات الثلاث حول العالم (300 شخص لكل مخيم)' : 'The 3 Annual Expeditions (300 Athletes Per Camp)'}
              </h2>
              <p className="text-xs text-gray-400 font-bold mt-1">
                {isAr ? 'المواعيد والإحداثيات تعلن رسمياً للمشاركين المقبولين فقط بعد اجتياز الفحص البيومتري' : 'Exact timing and secret coordinates revealed strictly to accepted athletes post-screening'}
              </p>
            </div>
            
            <span className="text-xs font-mono font-bold text-[#FFE600] bg-black px-3 py-1.5 rounded-xl">
              {isAr ? '300 مقعد لكل مخيم' : '300 SPOTS / CAMP'}
            </span>
          </div>

          {/* Cards for the 3 Expeditions - Compact, Clean, Unique Photos & No Duplication */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXPEDITION_PLANS.map((exp) => {
              const isSelected = selectedPlan === exp.id;
              const seasonLabel = isAr ? exp.seasonAr : isFr ? exp.seasonFr : isEs ? exp.seasonEs : exp.seasonEn;
              const phaseLabel = isAr ? exp.phaseAr : isFr ? exp.phaseFr : isEs ? exp.phaseEs : exp.phaseEn;
              const titleLabel = isAr ? exp.titleAr : isFr ? exp.titleFr : isEs ? exp.titleEs : exp.titleEn;
              const taglineLabel = isAr ? exp.taglineAr : isFr ? exp.taglineFr : isEs ? exp.taglineEs : exp.taglineEn;
              const highlightLabel = isAr ? exp.highlightAr : isFr ? exp.highlightFr : isEs ? exp.highlightEs : exp.highlightEn;
              const atmosphereLabel = isAr ? exp.atmosphereAr : isFr ? exp.atmosphereFr : isEs ? exp.atmosphereEs : exp.atmosphereEn;
              const captionLabel = isAr ? exp.imageCaptionAr : isFr ? exp.imageCaptionFr : isEs ? exp.imageCaptionEs : exp.imageCaptionEn;

              return (
                <div 
                  key={exp.id}
                  onClick={() => {
                    soundFX.playButtonClick();
                    setSelectedPlan(exp.id);
                  }}
                  className={`rounded-3xl p-6 bg-[#0D0E17] transition-all duration-300 cursor-pointer flex flex-col justify-between group border border-white/5 ${isSelected ? "shadow-[0_0_35px_rgba(255,255,255,0.15)] bg-[#121422] border-[#FFE600]/40 scale-[1.01]" : "hover:bg-[#10121D] hover:border-white/20"}`}
                >
                  <div className="space-y-4">
                    {/* Header badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span 
                        className="px-3 py-1 rounded-xl text-[10px] font-black font-anime text-black shadow-md uppercase tracking-wide"
                        style={{ backgroundColor: exp.accentColor }}
                      >
                        {seasonLabel}
                      </span>
                      <span className="text-[11px] font-mono font-black text-white bg-black/80 px-2.5 py-1 rounded-lg border border-white/10">
                        300 ATHLETES
                      </span>
                    </div>

                    {/* Dedicated Motivational Camp Image (Single Occurrence) */}
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-white/10 group-hover:border-[#FFE600]/40 transition-all">
                      <img 
                        src={exp.image} 
                        alt={captionLabel} 
                        onError={handleImageError}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E17] via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-gray-200 truncate border border-white/10 flex items-center gap-1.5">
                        <span className="text-[#FFE600]">📷</span>
                        <span className="truncate">{captionLabel}</span>
                      </div>
                    </div>

                    {/* Title & Phase */}
                    <div>
                      <span className="text-[10px] font-anime font-black text-[#10B981] block mb-1 uppercase tracking-wider">
                        {phaseLabel}
                      </span>
                      <h3 className="text-xl font-black font-anime text-white group-hover:text-[#FFE600] transition-colors leading-snug">
                        {titleLabel}
                      </h3>
                      <p className="text-[11px] text-[#00F0FF] font-mono font-bold mt-1.5 flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>{isAr ? 'وجهة سرية غير متوقعة // إحداثيات خاصة' : isFr ? 'Coordonnées Secrètes // Territoire Sauvage' : isEs ? 'Coordenadas Secretas // Territorio Virgen' : 'Secret Coordinates // Uncharted Territory'}</span>
                      </p>
                    </div>

                    {/* Atmosphere capsule */}
                    <div className="px-3 py-1.5 rounded-xl bg-black/60 text-[10px] font-mono text-gray-300 border border-white/5">
                      ⚡ {atmosphereLabel}
                    </div>

                    {/* Attractive Blurb */}
                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                      {taglineLabel}
                    </p>

                    {/* Highlight Box */}
                    <div className="p-3.5 rounded-2xl bg-black/60 text-xs font-bold text-gray-200 space-y-1 border border-white/5">
                      <span className="text-[#FFE600] block text-[10px] uppercase font-anime tracking-wider">
                        {isAr ? 'التحدي الأكبر والمغامرة الحاسمة:' : isFr ? 'Défi Sommet & Épreuve Majeure :' : isEs ? 'Desafío Cumbre :' : 'The Pinnacle Crucible Challenge:'}
                      </span>
                      <span className="text-[11px] text-gray-200">{highlightLabel}</span>
                    </div>

                    {/* Focus Points */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">
                        {isAr ? 'محاور التدريب القاسي:' : isFr ? "Modules d'entraînement :" : isEs ? 'Módulos de entrenamiento :' : 'Rigorous Training Modules:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(isAr ? exp.trainingFocusAr : exp.trainingFocusEn).map((tag, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white/5 text-gray-300 text-[10px] font-bold border border-white/5">
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom selection button - Fixed 300 athletes cap, no booked counters or dates */}
                  <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono font-black text-[#FFE600] block">
                        {isAr ? '300 مقعد للمخيم' : isFr ? '300 Places / Camp' : isEs ? '300 Plazas / Campamento' : '300 Spots / Camp'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium block">
                        {isAr ? 'اختيار دقيق حسب المعايير' : isFr ? 'Sélection selon critères' : isEs ? 'Selección por estándares' : 'Merit-Based Selection'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFX.playButtonClick();
                        setSelectedPlan(exp.id);
                        setIsApplyModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white text-black font-black font-anime text-xs hover:bg-[#FFE600] transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                    >
                      {isAr ? 'ترشح للمخيم' : isFr ? 'Postuler' : isEs ? 'Postularse' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* WHAT IS INCLUDED IN THE ALL-INCLUSIVE CAMP RETREAT                   */}
        {/* ==================================================================== */}
        <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-r from-[#0E1018] via-[#10121C] to-[#0E1018] shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black font-anime text-[#A855F7] uppercase tracking-wider">
              {isAr ? 'امتيازات معسكر الـ 300 الملكية الشاملة' : 'THE 300 ROYAL PRIVILEGES'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-anime text-white">
              {isAr ? 'ما الذي تتضمنه باقة المعسكر الاستثنائية؟' : 'What is Included in Your 300 Camp Retreat?'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-bold">
              {isAr ? 'إقامة ملكية وتجربة تدريب فريدة دون أي عناء لوجستي لـ 300 رياضي في كل مخيم' : 'A 5-star athletic and wild retreat engineered for the top 300 athletes per camp'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-black/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFE600]/15 flex items-center justify-center text-[#FFE600]">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="font-anime font-black text-base text-white">
                {isAr ? 'إقامة 5 نجوم في منتجع سري' : 'Private 5-Star Wilderness Retreat'}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isAr ? 'أجنحة فاخرة مجهزة ببيئة هادئة ومولدات أكسجين لضمان أقصى درجات النوم العميق NREM3.' : 'Luxury private suites with sound-dampened acoustics and recovery sleep design.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 flex items-center justify-center text-[#10B981]">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="font-anime font-black text-base text-white">
                {isAr ? 'تغذية قتالية وطهاة متخصصون' : 'Chef-Prepared Performance Fuel'}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isAr ? '4 وجبات يومية عالية البروتين ومضادات الأكسدة مصممة طبقاً لبيانات حرق السعرات.' : '4 daily gourmet meals and customized macros tailored to your biometric strain.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#A855F7]/15 flex items-center justify-center text-[#A855F7]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-anime font-black text-base text-white">
                {isAr ? 'عتاد وأجهزة YARD 300 الكاملة' : 'Full Serialized Gear & Ring'}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isAr ? 'خاتم التيتانيوم الذكي المرقم، السوار النسيجي، قمصان القتال، ووعاء الترطيب الهندسي.' : 'YARD biometric ring, screenless band, combat compression apparel, and hydration vessel.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-anime font-black text-base text-white">
                {isAr ? 'إشراف مباشر من المؤسسين الثلاثة' : 'Direct Leadership by 3 Founders'}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isAr ? 'مرافقة تدريبية وتوجيه استراتيجي مباشر من المؤسسين الثلاثة وباقي فريق المدربين حول العالم.' : isFr ? "Accompagnement intensif et masterclasses dirigés par les 3 fondateurs et l'équipe internationale de coachs." : isEs ? 'Acompañamiento cercano y clases magistrales dirigidas por los 3 fundadores y el equipo global de entrenadores.' : 'Intensive daily masterclasses and mentorship directly led by the 3 founders and the international coaching crew.'}
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* APPLICATION CALL TO ACTION (300 SPOTS PER CAMP)                      */}
        {/* ==================================================================== */}
        <div className="p-8 sm:p-14 rounded-3xl bg-black text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black font-anime text-[#FFE600] uppercase tracking-wider block">
              {isAr ? 'بوابة الترشح لمعسكر الـ 300 رياضي' : 'MERIT-BASED SELECTION // 300 PER CAMP'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-anime text-white">
              {isAr ? 'هل تمتلك الشجاعة لخوض المغامرة مع فريقنا؟' : 'Ready to Step Into the 300 Crucible?'}
            </h2>
            <p className="text-sm text-gray-300 font-bold leading-relaxed">
              {isAr
                ? 'يتم اختيار المشاركين بناءً على اللياقة، الانضباط، والروح القتالية. يتم قبول 300 شخص فقط لكل مخيم لتأكيد تجربة فريدة وتدريب قاسي ومركز تحت إشراف المؤسسين الثلاثة.'
                : 'Candidates are screened based on fitness, commitment, and martial spirit. Exactly 300 athletes per camp to guarantee personal, intense coaching under the three founders.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setIsApplyModalOpen(true);
              }}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-[#FFE600] text-black font-black font-anime text-sm transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4 text-black" />
              <span>{isAr ? 'تقديم طلب الترشح الآن (300 مقعد للمخيم)' : 'SUBMIT CANDIDATE APPLICATION NOW'}</span>
            </button>

            {onExploreGear && (
              <button
                type="button"
                onClick={onExploreGear}
                className="px-6 py-4 rounded-2xl bg-[#141624] hover:bg-[#1E2135] text-gray-300 hover:text-white font-anime font-black text-sm transition-all cursor-pointer"
              >
                {isAr ? 'استعراض عتاد المعسكر في المتجر' : 'Browse Official Camp Gear'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* ATHLETE APPLICATION MODAL                                            */}
      {/* ==================================================================== */}
      {isApplyModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div 
            className="w-full max-w-xl bg-[#0D0F1A] rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,230,0,0.3)] relative text-white my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#161828] text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!applicationSubmitted ? (
              <form onSubmit={handleApplySubmit} className="space-y-5">
                <div>
                  <span className="text-xs font-black font-anime text-[#FFE600] uppercase tracking-wider block">
                    {isAr ? 'استمارة الترشح الرسمية // 300 شخص لكل مخيم' : 'OFFICIAL CANDIDATE REGISTRATION // 300 PER CAMP'}
                  </span>
                  <h3 className="text-2xl font-black font-anime text-white mt-1">
                    {isAr ? 'طلب الانضمام لمعسكر YARD 300 الدولي' : 'Apply for YARD 300 Global Camp'}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    {isAr 
                      ? `المغامرة المختارة: ${currentPlanData.titleAr} (300 مقعد)` 
                      : `Selected: ${currentPlanData.titleEn} (300 spots)`}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      {isAr ? 'الاسم الكامل للرياضي:' : 'Athlete Full Name:'}
                    </label>
                    <input 
                      type="text"
                      required
                      value={athleteName}
                      onChange={(e) => setAthleteName(e.target.value)}
                      placeholder={isAr ? 'مثال: أسامة المحارب' : 'e.g. Alexander Vance'}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141624] text-white text-xs font-bold outline-none focus:ring-2 focus:ring-[#FFE600]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        {isAr ? 'البريد الإلكتروني:' : 'Email Address:'}
                      </label>
                      <input 
                        type="email"
                        required
                        value={athleteEmail}
                        onChange={(e) => setAthleteEmail(e.target.value)}
                        placeholder="athlete@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#141624] text-white text-xs font-bold outline-none focus:ring-2 focus:ring-[#FFE600]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        {isAr ? 'رقم الهاتف / الواتساب:' : 'Phone / WhatsApp:'}
                      </label>
                      <input 
                        type="tel"
                        value={athletePhone}
                        onChange={(e) => setAthletePhone(e.target.value)}
                        placeholder="+1 555 019 300"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#141624] text-white text-xs font-bold outline-none focus:ring-2 focus:ring-[#FFE600]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        {isAr ? 'التخصص الرياضي:' : 'Primary Sport / Discipline:'}
                      </label>
                      <select
                        value={athleteSport}
                        onChange={(e) => setAthleteSport(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#141624] text-white text-xs font-bold outline-none focus:ring-2 focus:ring-[#FFE600]"
                      >
                        <option value="combat">{isAr ? 'فنون قتالية وملاكمة' : 'Combat Sports & Boxing'}</option>
                        <option value="hyrox">{isAr ? 'سباقات هايروكس ولياقة' : 'Hyrox & Functional Fitness'}</option>
                        <option value="calisthenics">{isAr ? 'كاليستنكس ووزن الجسم' : 'Calisthenics & Gymnastics'}</option>
                        <option value="running">{isAr ? 'ماراثون وتحمل طويل' : 'Marathon & Trail Endurance'}</option>
                        <option value="crossfit">{isAr ? 'كروس فيت ورفع أثقال' : 'CrossFit & Olympic Lifting'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        {isAr ? 'سنوات الخبرة في التدريب:' : 'Years of Training Experience:'}
                      </label>
                      <select
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#141624] text-white text-xs font-bold outline-none focus:ring-2 focus:ring-[#FFE600]"
                      >
                        <option value="1-2">{isAr ? '1 - 2 سنة (مبتدئ جاد)' : '1 - 2 Years'}</option>
                        <option value="3-5">{isAr ? '3 - 5 سنوات (مستوى متقدم)' : '3 - 5 Years'}</option>
                        <option value="5+">{isAr ? '+5 سنوات (رياضي محترف)' : '5+ Years (Pro Athlete)'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      {isAr ? 'لماذا ترغب في الانضمام إلى معسكر الـ 300؟' : 'Why Do You Want to Join the 300 Crucible?'}
                    </label>
                    <textarea 
                      rows={3}
                      value={motivationNote}
                      onChange={(e) => setMotivationNote(e.target.value)}
                      placeholder={isAr ? 'أذكر أهدافك البدنية وأهم تطلعاتك مع فريق التدريب تحت إشراف المؤسسين الثلاثة...' : 'Describe your athletic goals, achievements, and mindset...'}
                      className="w-full px-4 py-2 rounded-xl bg-[#141624] text-white text-xs font-bold outline-none focus:ring-2 focus:ring-[#FFE600] resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFE600] to-[#FFD700] hover:from-white hover:to-white text-black font-black font-anime text-sm transition-all shadow-[0_0_20px_rgba(255,230,0,0.4)] cursor-pointer"
                  >
                    {isAr ? 'إرسال طلب الترشح الرسمي (300 مقعد)' : 'SUBMIT CANDIDATE APPLICATION'}
                  </button>
                  <p className="text-[10px] text-gray-500 text-center font-bold mt-2">
                    {isAr ? 'سيقوم طاقم المعسكر والمدربين بمراجعة أرقامك الحيوية والرد خلال 48 ساعة.' : 'Your profile and biometrics will be screened within 48 hours.'}
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 flex items-center justify-center text-[#10B981] mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-black font-anime text-white">
                    {isAr ? 'تم استلام طلب ترشحك بنجاح! ⚡' : 'Candidate Application Received! ⚡'}
                  </h3>
                  <p className="text-sm text-gray-300 font-bold mt-2 max-w-md mx-auto leading-relaxed">
                    {isAr
                      ? `شكراً لك يا ${athleteName}، تم تسجيل بياناتك في قائمة ترشيحات معسكر الـ 300. تم حجز رقم أولوية برقم #YARD-CAMP وسيتم التواصل عبر بريدك ${athleteEmail}.`
                      : `Thank you ${athleteName}. Your dossier has been logged under priority #YARD-CAMP. Our team will contact you at ${athleteEmail}.`}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black text-xs font-mono text-[#FFE600] text-center">
                  <span>{isAr ? 'حالة الطلب: قيد المراجعة البيومترية (300 مقعد لكل مخيم)' : 'Status: Under Biometric Review (Strictly 300 Per Camp)'}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-black font-anime text-xs cursor-pointer hover:bg-gray-200"
                >
                  {isAr ? 'تم، إغلاق النافذة' : 'Done, Close Window'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default YardGlobalCamp;
