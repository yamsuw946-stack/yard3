import React, { useState, useRef } from 'react';
import {
  Activity,
  RotateCcw,
  Zap,
  ChevronRight,
  Crosshair,
  ShieldCheck,
  Hand
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { handleImageError } from '../constants';
import { soundFX } from '../services/soundFX';
import { KineticMediaStage, KineticSlide } from './KineticMediaStage';

interface InteractiveCharacterStageProps {
  currentLang?: Language;
  onExploreSection?: (sectionId: string) => void;
}

interface FighterProfile {
  id: string;
  name: { en: string; es: string; fr: string; ar: string };
  title: { en: string; es: string; fr: string; ar: string };
  image: string;
  themeColor: string;
  auraPower: number;
  combatStyle: { en: string; es: string; fr: string; ar: string };
  specialMove: { en: string; es: string; fr: string; ar: string };
  targetSection: string;
}

const FIGHTERS: FighterProfile[] = [
  {
    id: 'ai_human_soojin',
    name: { en: 'Soo-Jin Park', es: 'Soo-Jin Park', fr: 'Soo-Jin Park', ar: 'سو-جين بارك' },
    title: {
      en: 'Taekwondo Agility & Reflex Specialist · Unit 01',
      es: 'Especialista en Agilidad Taekwondo · Unidad 01',
      fr: 'Spécialiste Agilité Taekwondo · Unité 01',
      ar: 'متخصصة التايكوندو وردود الفعل الحركية · الفئة 01'
    },
    image: '/images/woman_korean_taekwondo.jpg',
    themeColor: '#10B981',
    auraPower: 9990,
    combatStyle: {
      en: 'Rapid Switch Kicks & Neuromuscular Balance',
      es: 'Patadas Rápidas y Equilibrio Neuromuscular',
      fr: 'Coups de Pied Rapides & Équilibre Neuromusculaire',
      ar: 'ركلات متتالية خاطفة وتوازن عصبي حركي دقيق'
    },
    specialMove: {
      en: 'Emerald Tornado Crescent',
      es: 'Tornado Esmeralda Creciente',
      fr: 'Tornade Émeraude Croissante',
      ar: 'الركلة الهلالية الدوارة السريعة'
    },
    targetSection: 'yardEngine'
  },
  {
    id: 'ai_human_rafael',
    name: { en: 'Rafael Silva', es: 'Rafael Silva', fr: 'Rafael Silva', ar: 'رافائيل سيلفا' },
    title: {
      en: 'Brazilian Jiu-Jitsu & Core Architect · Unit 02',
      es: 'Jiu-Jitsu Brasileño y Potencia Central · Unidad 02',
      fr: 'Jiu-Jitsu Brésilien & Puissance Core · Unité 02',
      ar: 'مقاتل الجوجيتسو ومهندس القوة المركزية · الفئة 02'
    },
    image: '/images/athlete_brazilian_bjj.jpg',
    themeColor: '#D4AF37',
    auraPower: 9975,
    combatStyle: {
      en: 'Isometric Grappling & Grip Telemetry',
      es: 'Grappling Isométrico y Telemetría de Agarre',
      fr: 'Grappling Isométrique & Télémétrie de Prise',
      ar: 'ثبات الاشتباك الأرضي وقياس قوة القبضة اللحظية'
    },
    specialMove: {
      en: 'Sovereign Apex Lock',
      es: 'Bloqueo Soberano Ápex',
      fr: 'Verrouillage Souverain Apex',
      ar: 'السيطرة القتالية السيادية الكاملة'
    },
    targetSection: 'arena'
  },
  {
    id: 'ai_human_zoe',
    name: { en: 'Zoe Campbell', es: 'Zoe Campbell', fr: 'Zoe Campbell', ar: 'زوي كامبل' },
    title: {
      en: 'Power HIIT & Explosive Track Champion · Unit 03',
      es: 'Campeona HIIT y Pista Explosiva · Unidad 03',
      fr: 'Championne HIIT & Sprint Explosif · Unité 03',
      ar: 'بطلة الشدة العالية والسرعة الانفجارية · الفئة 03'
    },
    image: '/images/woman_caribbean_power.jpg',
    themeColor: '#D4AF37',
    auraPower: 9960,
    combatStyle: {
      en: 'Peak Sprint Mechanics & Power-to-Weight',
      es: 'Mecánica Máxima de Sprint y Relación Potencia',
      fr: 'Mécanique Sprint Max & Ratio Puissance-Poids',
      ar: 'ميكانيكا السبرنت القصوى وتناسب القوة والوزن'
    },
    specialMove: {
      en: 'Solar Velocity Burst',
      es: 'Explosión de Velocidad Solar',
      fr: 'Accélération Vélocité Solaire',
      ar: 'اندفاع السرعة الذهبية القصوى'
    },
    targetSection: 'products'
  },
  {
    id: 'ai_human_salma',
    name: { en: 'Salma Benali', es: 'Salma Benali', fr: 'Salma Benali', ar: 'سلمى بنعلي' },
    title: {
      en: 'High-Altitude Marathon Lead · Unit 04',
      es: 'Líder de Maratón en Alta Altitud · Unidad 04',
      fr: 'Spécialiste Marathon Haute Altitude · Unité 04',
      ar: 'بطلة الماراثون والتحمل على المرتفعات · الفئة 04'
    },
    image: '/images/athlete_moroccan_marathoner.jpg',
    themeColor: '#10B981',
    auraPower: 9945,
    combatStyle: {
      en: 'Lactate Threshold & Aerobic Capacity',
      es: 'Umbral de Lactato y Capacidad Aeróbica',
      fr: 'Seuil Lactique & Capacité Aérobie',
      ar: 'التحكم في عتبة اللاكتات والسعة الهوائية الفائقة'
    },
    specialMove: {
      en: 'Atlas Endurance Overdrive',
      es: 'Sobremarcha de Resistencia Atlas',
      fr: 'Endurance Extrême Atlas',
      ar: 'تجاوز التحمل الأقصى في السباقات الطويلة'
    },
    targetSection: 'yardEngine'
  },
  {
    id: 'ai_human_erik',
    name: { en: 'Erik Lindqvist', es: 'Erik Lindqvist', fr: 'Erik Lindqvist', ar: 'إريك ليندكفيست' },
    title: {
      en: 'Nordic Ultra-Endurance & Recovery · Unit 05',
      es: 'Ultra-Resistencia Nórdica y Recuperación · Unidad 05',
      fr: 'Ultra-Endurance Nordique & Récupération · Unité 05',
      ar: 'أخصائي التحمل القطبي والاستشفاء البدني · الفئة 05'
    },
    image: '/images/athlete_nordic_runner.jpg',
    themeColor: '#38BDF8',
    auraPower: 9930,
    combatStyle: {
      en: 'Cold-Exposure HRV Adaptation & Pacing',
      es: 'Adaptación HRV al Frío y Ritmo de Fondo',
      fr: 'Adaptation VFC au Froid & Gestion d’Allure',
      ar: 'تكيّف نبض الاستشفاء وتنظيم إيقاع المسافات الطويلة'
    },
    specialMove: {
      en: 'Glacial Recovery Cadence',
      es: 'Cadencia de Recuperación Glacial',
      fr: 'Cadence Récupération Glaciale',
      ar: 'إيقاع الاستشفاء الجليدي المستقر'
    },
    targetSection: 'ai-coach'
  },
  {
    id: 'ai_human_claire',
    name: { en: 'Claire Gagnon', es: 'Claire Gagnon', fr: 'Claire Gagnon', ar: 'كلير غانيون' },
    title: {
      en: 'Track Cycling & Anaerobic Power · Unit 06',
      es: 'Ciclismo en Pista y Potencia Anaeróbica · Unidad 06',
      fr: 'Cyclisme sur Piste & Puissance Anaérobie · Unité 06',
      ar: 'بطلة سباقات المضمار والطاقة اللاهوائية · الفئة 06'
    },
    image: '/images/athlete_canadian_cyclist.jpg',
    themeColor: '#D4AF37',
    auraPower: 9950,
    combatStyle: {
      en: 'Maximal Quad Torque & ACWR Balancing',
      es: 'Torque Máximo y Equilibrio ACWR',
      fr: 'Couple Quadriceps Max & Équilibre ACWR',
      ar: 'أقصى عزم عضلي وتوازن حمل التدريب ACWR'
    },
    specialMove: {
      en: 'Aero Track Surge',
      es: 'Impulso Aero en Pista',
      fr: 'Relance Aéro Piste',
      ar: 'تسارع المضمار الهوائي الكامل'
    },
    targetSection: 'arena'
  }
];

export const InteractiveCharacterStage: React.FC<InteractiveCharacterStageProps> = ({
  currentLang = 'en',
  onExploreSection
}) => {
  const isAr = currentLang === 'ar';
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPoweringUp, setIsPoweringUp] = useState<boolean>(false);

  const stageWrapRef = useRef<HTMLDivElement | null>(null);
  const activeFighter = FIGHTERS[selectedIdx];

  const slides: KineticSlide[] = FIGHTERS.map((f) => ({
    id: f.id,
    src: f.image,
    alt: tr(currentLang, f.name),
    accentColor: f.themeColor
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageWrapRef.current) return;
    const rect = stageWrapRef.current.getBoundingClientRect();
    const mouseX = e.clientX - (rect.left + rect.width / 2);
    const mouseY = e.clientY - (rect.top + rect.height / 2);
    const rotX = -(mouseY / (rect.height / 2)) * 5.5;
    const rotY = (mouseX / (rect.width / 2)) * 6.5;
    setRotation({ x: rotX, y: rotY });
  };

  const handleResetPosition = () => {
    soundFX.playButtonClick();
    setRotation({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  const triggerPowerStrike = () => {
    soundFX.playButtonClick();
    setIsPoweringUp(true);
    setZoomLevel(1.05);
    setTimeout(() => {
      setZoomLevel(1);
      setIsPoweringUp(false);
    }, 800);
  };

  const handleSelectFighter = (idx: number) => {
    if (idx !== selectedIdx) soundFX.playButtonClick();
    setSelectedIdx(idx);
    setRotation({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  return (
    <div className={`relative w-full rounded-2xl bg-[#0C0E14] border border-white/[0.08] p-4 sm:p-5 shadow-xl overflow-hidden my-4 ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-4 border-b border-white/[0.06]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {tr(currentLang, {
                en: 'AI BIO-ENHANCED ATHLETE ROSTER',
                es: 'PLANTEL DE ATLETAS BIO-MEJORADOS POR IA',
                fr: 'ROSTER D’ATHLÈTES BIO-OPTIMISÉS PAR IA',
                ar: 'وحدة الرياضيين المعززين بالذكاء الاصطناعي'
              })}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {tr(currentLang, activeFighter.name)}
          </h2>
          <p className="text-xs text-slate-400">
            {tr(currentLang, activeFighter.title)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerPowerStrike}
            className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>
              {tr(currentLang, {
                en: 'CALIBRATE TELEMETRY',
                es: 'CALIBRAR TELEMETRÍA',
                fr: 'CALIBRER TÉLÉMÉTRIE',
                ar: 'تحليل الأداء اللحظي'
              })}
            </span>
          </button>

          <button
            type="button"
            onClick={handleResetPosition}
            title={tr(currentLang, {
              en: 'Reset Perspective',
              es: 'Reiniciar Vista',
              fr: 'Réinitialiser Vue',
              ar: 'إعادة ضبط المنظور'
            })}
            className="p-2 rounded-lg bg-[#12151E] border border-white/[0.1] hover:border-white/25 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Compact Viewport */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div
            ref={stageWrapRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setRotation({ x: 0, y: 0 })}
            className="relative w-full max-w-[330px] sm:max-w-[360px] rounded-2xl bg-[#07080C] border border-white/[0.08] overflow-hidden shadow-xl"
            style={{ perspective: '1000px' }}
          >
            <KineticMediaStage
              slides={slides}
              activeIndex={selectedIdx}
              onChangeIndex={handleSelectFighter}
              isAr={isAr}
              aspectClassName="aspect-[4/4.2]"
              objectPosition="top"
              perspectiveTilt={rotation}
              scaleBoost={zoomLevel}
              showControls={true}
              showScrubBar={true}
              onTapSlide={() => triggerPowerStrike()}
              renderOverlay={() => (
                <>
                  <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 bg-[#0C0E14]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/[0.08] text-[10px] font-medium text-slate-200">
                      <Hand className="w-3 h-3 text-[#D4AF37]" />
                      <span>
                        {tr(currentLang, {
                          en: 'Swipe or drag · Tap to calibrate',
                          es: 'Desliza para cambiar · Toca',
                          fr: 'Glissez pour changer · Touchez',
                          ar: 'اسحب للتمرير أو اضغط للقياس'
                        })}
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 bg-[#0C0E14]/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/[0.08] text-[10px] font-mono tabular-nums text-slate-300">
                      <Crosshair className="w-3 h-3 text-[#10B981]" />
                      <span>{Math.round(rotation.y)}°</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-transparent to-transparent pointer-events-none z-10" />

                  <div
                    className={`absolute bottom-8 left-3 right-3 p-2.5 rounded-xl bg-[#0C0E14]/92 backdrop-blur-md border transition-colors duration-300 flex items-center justify-between pointer-events-none z-20 ${
                      isPoweringUp ? 'border-[#D4AF37]/60' : 'border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: activeFighter.themeColor }} />
                      <span className="text-[11px] font-medium text-slate-200 truncate">
                        {tr(currentLang, activeFighter.combatStyle)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold font-mono tabular-nums shrink-0 ms-2" style={{ color: activeFighter.themeColor }}>
                      {activeFighter.auraPower.toLocaleString('en-US')} AU
                    </span>
                  </div>
                </>
              )}
            />
          </div>
        </div>

        {/* Athlete Selector Rail & Telemetry Readout */}
        <div className="lg:col-span-6 space-y-3">
          <div className="p-3.5 rounded-xl bg-[#12151E] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {tr(currentLang, {
                    en: 'SELECT AI BIO-ENHANCED ATHLETE',
                    es: 'SELECCIONAR ATLETA BIO-MEJORADO',
                    fr: 'SÉLECTIONNER ATHLÈTE BIO-OPTIMISÉ',
                    ar: 'اختر الرياضي المعزز للاستعراض:'
                  })}
                </span>
              </h4>
              <span className="text-[10px] font-mono text-[#D4AF37] tabular-nums" dir="ltr">
                {String(selectedIdx + 1).padStart(2, '0')} / {String(FIGHTERS.length).padStart(2, '0')}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {FIGHTERS.map((f, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelectFighter(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/60 scale-[1.03]'
                        : 'border-white/[0.08] opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={f.image}
                      alt={tr(currentLang, f.name)}
                      onError={handleImageError}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#12151E] border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                {tr(currentLang, {
                  en: 'Peak Bio-Kinetic Output:',
                  es: 'Rendimiento Biocinético Máximo:',
                  fr: 'Puissance Biocinétique Maximale :',
                  ar: 'ذروة المخرج الحيوي:'
                })}
              </span>
              <span className="text-sm font-bold font-mono tabular-nums text-[#D4AF37]">
                {activeFighter.auraPower.toLocaleString('en-US')} / 10,000 AU
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(activeFighter.auraPower / 10000) * 100}%`,
                  backgroundColor: activeFighter.themeColor
                }}
              />
            </div>

            <div className="pt-2.5 border-t border-white/[0.06] space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">
                  {tr(currentLang, { en: 'Discipline:', es: 'Disciplina:', fr: 'Discipline :', ar: 'التخصص:' })}
                </span>
                <span className="text-white font-medium text-end">{tr(currentLang, activeFighter.combatStyle)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">
                  {tr(currentLang, { en: 'Primary Protocol:', es: 'Protocolo Principal:', fr: 'Protocole Principal :', ar: 'البروتوكول المميز:' })}
                </span>
                <span className="font-semibold text-[#D4AF37] text-end">{tr(currentLang, activeFighter.specialMove)}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#12151E] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-[#10B981] uppercase tracking-wider block">
                {tr(currentLang, {
                  en: 'CORRESPONDING LAB CHAMBER',
                  es: 'MÓDULO DE LABORATORIO',
                  fr: 'CHAMBRE DE LABORATOIRE',
                  ar: 'القسم المختبري المرتبط'
                })}
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                {tr(currentLang, {
                  en: 'Open the dedicated biometric analysis & training chamber.',
                  es: 'Abre el módulo de análisis biométrico y entrenamiento.',
                  fr: 'Ouvrez le module d’analyse biométrique dédié.',
                  ar: 'انتقل مباشرة إلى وحدة القياس الحيوي والتدريب المتخصصة.'
                })}
              </p>
            </div>
            {onExploreSection && (
              <button
                type="button"
                onClick={() => onExploreSection(activeFighter.targetSection)}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>
                  {tr(currentLang, {
                    en: 'OPEN LAB',
                    es: 'ABRIR LAB',
                    fr: 'OUVRIR LAB',
                    ar: 'دخول الوحدة'
                  })}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCharacterStage;
