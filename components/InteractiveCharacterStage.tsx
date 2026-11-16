import React, { useState, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  Flame,
  Zap,
  Move,
  ChevronRight,
  ChevronLeft,
  Crosshair
} from 'lucide-react';
import { Language, tr } from '../i18n';
import {
  SAMURAI_RONIN_IMAGE,
  REALISTIC_ANIME_STRIKER_IMAGE,
  REALISTIC_VALKYRIE_IMAGE,
  REALISTIC_MMA_BRAWLER_IMAGE,
  REALISTIC_TACTICAL_SHINOBI_IMAGE,
  REALISTIC_VALKYRIE_APEX_IMAGE,
  REALISTIC_FLAME_STRIKER_IMAGE,
  handleImageError
} from '../constants';
import { soundFX } from '../services/soundFX';

interface InteractiveCharacterStageProps {
  currentLang?: Language;
  onExploreSection?: (sectionId: string) => void;
}

interface LocalizedText {
  en: string;
  es: string;
  fr: string;
  ar: string;
}

interface FighterProfile {
  id: string;
  name: LocalizedText;
  title: LocalizedText;
  image: string;
  themeColor: string;
  neonShadow: string;
  auraPower: number;
  combatStyle: LocalizedText;
  specialMove: LocalizedText;
  targetSection: string;
}

const FIGHTERS: FighterProfile[] = [
  {
    id: 'realistic_kenji',
    name: {
      en: 'Kenji "Dragon Striker"',
      es: 'Kenji "Golpe del Dragón"',
      fr: 'Kenji "Frappe du Dragon"',
      ar: 'كينجي "ضارب التنين"'
    },
    title: {
      en: 'Combat Striking Strategist (High-Altitude Camp)',
      es: 'Estratega de Golpeo (Campamento de Altura)',
      fr: 'Stratège de Frappe (Camp d’Altitude)',
      ar: 'استراتيجي القتال والضربات التكتيكية (معسكر الارتفاعات)'
    },
    image: REALISTIC_ANIME_STRIKER_IMAGE,
    themeColor: '#D4AF37',
    neonShadow: '0 0 40px rgba(212, 175, 55, 0.55)',
    auraPower: 9999,
    combatStyle: {
      en: 'Shaolin Iron Fist & Kinetic Muay Thai Striking',
      es: 'Puño de Hierro Shaolin y Muay Thai Cinético',
      fr: 'Poing de Fer Shaolin & Muay Thaï Cinétique',
      ar: 'قبضة الشاولين الفولاذية والمواي تاي الانفجاري'
    },
    specialMove: {
      en: 'Meteor Dragon Impact',
      es: 'Impacto Meteoro del Dragón',
      fr: 'Impact Météore du Dragon',
      ar: 'صدمة التنين النيزكية الخارقة'
    },
    targetSection: 'yardEngine'
  },
  {
    id: 'realistic_valkyrie',
    name: {
      en: 'Valkyrie "Apex Phoenix"',
      es: 'Valquiria "Fénix Ápex"',
      fr: 'Valkyrie "Phénix Apex"',
      ar: 'فالكييري "طائر الفينيق الأسمى"'
    },
    title: {
      en: 'Combat Champion (Temple Mountain)',
      es: 'Campeona de Combate (Montaña del Templo)',
      fr: 'Championne de Combat (Montagne du Temple)',
      ar: 'بطلة القتال (جبال المعبد)'
    },
    image: REALISTIC_VALKYRIE_IMAGE,
    themeColor: '#10B981',
    neonShadow: '0 0 40px rgba(16, 185, 129, 0.55)',
    auraPower: 9980,
    combatStyle: {
      en: 'Precision Kickboxing & Biomechanical Power',
      es: 'Kickboxing de Precisión y Potencia Biomecánica',
      fr: 'Kickboxing de Précision & Puissance Biomécanique',
      ar: 'كيك بوكسينغ دقيق وتوافق بيوميكانيكي'
    },
    specialMove: {
      en: 'Emerald Phoenix Axe Cleave',
      es: 'Tajo Hacha Fénix Esmeralda',
      fr: 'Coupe Hache Phénix Émeraude',
      ar: 'ضربة الفينيق الزمردية الساحقة'
    },
    targetSection: 'products'
  },
  {
    id: 'realistic_brawler',
    name: {
      en: 'Jin "Titan Brawler"',
      es: 'Jin "Púgil Titán"',
      fr: 'Jin "Colosse Titan"',
      ar: 'جين "الملاكم العملاق"'
    },
    title: {
      en: 'Heavyweight Striker & Tactical Combatant',
      es: 'Golpeador Peso Pesado y Combatiente Táctico',
      fr: 'Poids Lourd & Combattant Tactique',
      ar: 'مقاتل الوزن الثقيل ونقوش الشاولين الحيوية'
    },
    image: REALISTIC_MMA_BRAWLER_IMAGE,
    themeColor: '#D4AF37',
    neonShadow: '0 0 40px rgba(212, 175, 55, 0.55)',
    auraPower: 9940,
    combatStyle: {
      en: 'Heavyweight Hooks & Kinetic Ground Strike',
      es: 'Ganchos Peso Pesado y Golpeo Cinético',
      fr: 'Crochets Poids Lourd & Frappe Cinétique',
      ar: 'لكمات الوزن الثقيل الساحقة والقتال التكتيكي المتقدم'
    },
    specialMove: {
      en: 'Golden Titan Thunderhook',
      es: 'Gancho Trueno del Titán Dorado',
      fr: 'Crochet Tonnerre du Titan d’Or',
      ar: 'خطاف التايتان الذهبي الرعدي'
    },
    targetSection: 'arena'
  },
  {
    id: 'realistic_tactical_shinobi',
    name: {
      en: 'Kage "Night Agility"',
      es: 'Kage "Agilidad Nocturna"',
      fr: 'Kage "Agilité Nocturne"',
      ar: 'كاجي "الرشاقة الليلية"'
    },
    title: {
      en: 'Tactical Endurance & Night Sprint Specialist',
      es: 'Especialista en Resistencia Táctica y Sprint Nocturno',
      fr: 'Spécialiste Endurance Tactique & Sprint Nocturne',
      ar: 'أخصائي المناورات التكتيكية والسرعة الليلية'
    },
    image: REALISTIC_TACTICAL_SHINOBI_IMAGE,
    themeColor: '#34D399',
    neonShadow: '0 0 40px rgba(52, 211, 153, 0.55)',
    auraPower: 9890,
    combatStyle: {
      en: 'Nano-Weave Agility & Lightning Quickdraw',
      es: 'Agilidad Nano-Weave y Desenfunde Relámpago',
      fr: 'Agilité Nano-Weave & Dégainé Éclair',
      ar: 'رشاقة النانو وسحب النصل الخاطف'
    },
    specialMove: {
      en: 'Emerald Tempest Blade Flash',
      es: 'Destello Tempestad Esmeralda',
      fr: 'Éclair Tempête Émeraude',
      ar: 'وميض عاصفة النصل الزمردية'
    },
    targetSection: 'yardEngine'
  },
  {
    id: 'realistic_valkyrie_apex',
    name: {
      en: 'Aoi "Muay Thai Valkyrie"',
      es: 'Aoi "Valquiria Muay Thai"',
      fr: 'Aoi "Valkyrie Muay Thaï"',
      ar: 'أوي "فالكييري المواي تاي"'
    },
    title: {
      en: 'Precision Kickboxer & Lightning Striker',
      es: 'Kickboxer de Precisión y Relámpago',
      fr: 'Kickboxeuse de Précision & Foudre',
      ar: 'بطلة الكيك بوكسينغ والبرق السريع'
    },
    image: REALISTIC_VALKYRIE_APEX_IMAGE,
    themeColor: '#10B981',
    neonShadow: '0 0 40px rgba(16, 185, 129, 0.55)',
    auraPower: 9910,
    combatStyle: {
      en: 'High Roundhouse & Tactical Surge',
      es: 'Patada Circular Alta y Oleada Táctica',
      fr: 'High Kick Circulaire & Vague Tactique',
      ar: 'ركلات عالية سريعة وتدفق حركي فائق'
    },
    specialMove: {
      en: 'Crescent Lightning Kick',
      es: 'Patada Creciente Relámpago',
      fr: 'Coup de Pied Croissant Éclair',
      ar: 'ركلة الهلال الصاعقة'
    },
    targetSection: 'products'
  },
  {
    id: 'realistic_flame_striker',
    name: {
      en: 'Soren "Apex Endurance"',
      es: 'Soren "Resistencia Ápex"',
      fr: 'Soren "Endurance Apex"',
      ar: 'سورن "قمة التحمل"'
    },
    title: {
      en: 'High-Altitude Endurance & Conditioning Specialist',
      es: 'Especialista en Resistencia y Acondicionamiento en Altura',
      fr: 'Spécialiste Endurance & Préparation Haute Altitude',
      ar: 'أخصائي التحمل البدني وتدريب الارتفاعات'
    },
    image: REALISTIC_FLAME_STRIKER_IMAGE,
    themeColor: '#D4AF37',
    neonShadow: '0 0 40px rgba(212, 175, 55, 0.55)',
    auraPower: 9950,
    combatStyle: {
      en: 'Explosive Plyometrics & High-Output Conditioning',
      es: 'Pliometría Explosiva y Acondicionamiento de Alta Potencia',
      fr: 'Pliométrie Explosive & Conditionnement Haute Puissance',
      ar: 'القفز الانفجاري واللياقة البدنية عالية الجهد'
    },
    specialMove: {
      en: 'Solar Burst Interval Protocol',
      es: 'Protocolo de Intervalos de Potencia Solar',
      fr: 'Protocole Intervalles Puissance Solaire',
      ar: 'بروتوكول الجهد الانفجاري المتكامل'
    },
    targetSection: 'combatArena'
  },
  {
    id: 'samurai',
    name: {
      en: 'Liam "Triathlon Vanguard"',
      es: 'Liam "Vanguardia Triatlón"',
      fr: 'Liam "Avant-Garde Triathlon"',
      ar: 'ليام "طليعة الترايثلون"'
    },
    title: {
      en: 'Precision Endurance & VO2 Max Master',
      es: 'Maestro de Precisión y VO2 Máx',
      fr: 'Maître de Précision & VO2 Max',
      ar: 'بطل التحمل الأولمبي وقياسات الأكسجين VO2 Max'
    },
    image: SAMURAI_RONIN_IMAGE,
    themeColor: '#10B981',
    neonShadow: '0 0 40px rgba(16, 185, 129, 0.55)',
    auraPower: 9870,
    combatStyle: {
      en: 'Threshold Pacing & Multi-Terrain Dominance',
      es: 'Ritmo Umbral y Dominio Multi-Terreno',
      fr: 'Allure Seuil & Maîtrise Multi-Terrain',
      ar: 'التوازن الإيقاعي والسيطرة متعددة التضاريس'
    },
    specialMove: {
      en: 'Jade Horizon Sprint Breakaway',
      es: 'Escapada Sprint Horizonte Jade',
      fr: 'Échappée Sprint Horizon Émeraude',
      ar: 'انطلاقة الأفق الزمردية الحاسمة'
    },
    targetSection: 'yardEngine'
  }
];

export const InteractiveCharacterStage: React.FC<InteractiveCharacterStageProps> = ({
  currentLang = 'en',
  onExploreSection
}) => {
  const t = (en: string, es: string, fr: string, ar: string) => tr(currentLang, { en, es, fr, ar });
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [characterOffset, setCharacterOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPoweringUp, setIsPoweringUp] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeFighter = FIGHTERS[selectedIdx];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setCharacterOffset((prev) => ({
        x: Math.max(-120, Math.min(120, prev.x + deltaX * 0.4)),
        y: Math.max(-80, Math.min(80, prev.y + deltaY * 0.4))
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - (rect.left + rect.width / 2);
    const mouseY = e.clientY - (rect.top + rect.height / 2);
    setRotation({
      x: -(mouseY / (rect.height / 2)) * 14,
      y: (mouseX / (rect.width / 2)) * 18
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    setCharacterOffset((prev) => ({
      x: Math.max(-100, Math.min(100, prev.x + deltaX * 0.5)),
      y: Math.max(-60, Math.min(60, prev.y + deltaY * 0.5))
    }));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleResetPosition = () => {
    soundFX.playButtonClick();
    setRotation({ x: 0, y: 0 });
    setCharacterOffset({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  const triggerPowerStrike = () => {
    soundFX.playButtonClick();
    setIsPoweringUp(true);
    setZoomLevel(1.15);
    setTimeout(() => {
      setZoomLevel(1);
      setIsPoweringUp(false);
    }, 900);
  };

  const handleSelectFighter = (idx: number) => {
    soundFX.playButtonClick();
    setSelectedIdx(idx);
    handleResetPosition();
  };

  const handleNextFighter = () => {
    soundFX.playButtonClick();
    setSelectedIdx((prev) => (prev + 1) % FIGHTERS.length);
    handleResetPosition();
  };

  const handlePrevFighter = () => {
    soundFX.playButtonClick();
    setSelectedIdx((prev) => (prev - 1 + FIGHTERS.length) % FIGHTERS.length);
    handleResetPosition();
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#080D0B] via-[#050807] to-[#080D0B] border border-emerald-500/20 p-4 md:p-8 shadow-2xl overflow-hidden my-6">
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C1411] border border-emerald-500/30 text-[#D4AF37] text-xs font-black font-anime uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>
              {t(
                'INTERACTIVE ATHLETIC CHAMPIONS DOJO',
                'DOJO INTERACTIVO DE CAMPEONES Y FUNDADORES',
                'DOJO INTERACTIF DES CHAMPIONS & FONDATEURS',
                'ساحة أبطال يارد التفاعلية (حرك واسحب)'
              )}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-anime text-white">
            {tr(currentLang, activeFighter.name)}
          </h2>
          <p className="text-xs md:text-sm font-bold text-slate-400">
            {tr(currentLang, activeFighter.title)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerPowerStrike}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-anime text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>
              {t('BURST KINETIC STRIKE! ⚡', '¡GOLPE CINÉTICO! ⚡', 'FRAPPE CINÉTIQUE ! ⚡', 'إطلاق الضربة الانفجارية! ⚡')}
            </span>
          </button>

          <button
            onClick={handleResetPosition}
            title={t('Reset Position', 'Restablecer Posición', 'Réinitialiser Position', 'إعادة ضبط الوضعية')}
            className="p-2.5 rounded-xl bg-[#0C1411] border border-white/[0.12] hover:border-emerald-400 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Dojo Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative w-full max-w-[520px] aspect-[4/5] rounded-3xl bg-[#050807] border border-white/[0.08] ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            } overflow-hidden flex items-center justify-center select-none shadow-[0_15px_45px_rgba(0,0,0,0.9)]`}
            style={{ perspective: '1000px' }}
          >
            <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-[#050807]/90 backdrop-blur-md px-3 py-1 rounded-xl border border-emerald-500/30 text-[11px] font-bold text-slate-300">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>
                {t(
                  'Drag or hover to rotate 3D champion',
                  'Arrastra o pasa el ratón para rotar en 3D',
                  'Glissez ou survolez pour pivoter en 3D',
                  'اسحب بالماوس أو الإصبع لتحريك البطل في الفضاء 3D'
                )}
              </span>
            </div>

            <div
              className={`relative w-[88%] h-[88%] rounded-2xl overflow-hidden transition-transform duration-150 ease-out pointer-events-none`}
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translate(${characterOffset.x}px, ${characterOffset.y}px) scale(${zoomLevel})`,
                boxShadow: `0 10px 30px rgba(0,0,0,0.85), ${activeFighter.neonShadow}`
              }}
            >
              <img
                loading="lazy"
                decoding="async"
                src={activeFighter.image}
                alt={tr(currentLang, activeFighter.name)}
                onError={handleImageError}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center scale-105 transition-all duration-300 ${
                  isPoweringUp ? 'brightness-125 contrast-125' : ''
                }`}
                draggable={false}
              />

              {isPoweringUp && (
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-emerald-300/20 to-transparent animate-pulse pointer-events-none" />
              )}

              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#050807]/90 backdrop-blur-md border border-white/10 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeFighter.themeColor }} />
                  <span className="text-xs font-black font-anime text-white">
                    {tr(currentLang, activeFighter.combatStyle)}
                  </span>
                </div>
                <span className="text-xs font-black font-mono tabular-nums" style={{ color: activeFighter.themeColor }}>
                  {activeFighter.auraPower} AU
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevFighter();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#080D0B]/90 border border-emerald-500/50 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title={t('Previous Champion', 'Campeón Anterior', 'Champion Précédent', 'البطل السابق')}
            >
              <ChevronLeft className="w-5 h-5 text-emerald-400" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextFighter();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#080D0B]/90 border border-emerald-500/50 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title={t('Next Champion', 'Siguiente Campeón', 'Champion Suivant', 'البطل التالي')}
            >
              <ChevronRight className="w-5 h-5 text-emerald-400" />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-bold tabular-nums">
            <span className="flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-[#D4AF37]" />
              {t('Offset:', 'Desplazamiento:', 'Décalage :', 'الإزاحة:')} X: {Math.round(characterOffset.x)} | Y: {Math.round(characterOffset.y)}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {t('Tilt:', 'Inclinación:', 'Inclinaison :', 'زاوية الدوران:')} {Math.round(rotation.y)}°
            </span>
          </div>
        </div>

        {/* Right Side: Stats & Direct Hub */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0C1411] border border-white/[0.08]">
            <h4 className="text-xs font-black font-anime text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>
                {t(
                  'SELECT ACTIVE CHAMPION TO INTERACT:',
                  'SELECCIONA UN CAMPEÓN PARA INTERACTUAR:',
                  'SÉLECTIONNEZ UN CHAMPION POUR INTERAGIR :',
                  'اختر البطل المفضل للتحريك والتفاعل:'
                )}
              </span>
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {FIGHTERS.map((f, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleSelectFighter(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all cursor-pointer border ${
                      isSelected
                        ? 'scale-105 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : 'opacity-65 hover:opacity-100 border-white/10'
                    }`}
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={f.image}
                      alt={tr(currentLang, f.name)}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0C1411] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                {t('Maximum Aura Output:', 'Potencia Máxima Aura:', 'Puissance Aura Maximale :', 'طاقة الهالة القصوى:')}
              </span>
              <span className="text-base font-black font-anime text-[#D4AF37] tabular-nums">
                {activeFighter.auraPower} / 10,000 AU
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-black/70 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(activeFighter.auraPower / 10000) * 100}%`,
                  backgroundColor: activeFighter.themeColor
                }}
              />
            </div>

            <div className="pt-2 border-t border-white/[0.08] space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 font-bold">
                  {t('Combat Style:', 'Estilo de Combate:', 'Style de Combat :', 'أسلوب القتال:')}
                </span>
                <span className="text-white font-bold text-end">{tr(currentLang, activeFighter.combatStyle)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 font-bold">
                  {t('Special Strike:', 'Ataque Especial:', 'Frappe Spéciale :', 'الحركة الخاصة:')}
                </span>
                <span className="font-bold text-[#D4AF37] text-end">{tr(currentLang, activeFighter.specialMove)}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1411] to-[#080D0B] border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-black font-anime text-white uppercase tracking-wider">
                {t(
                  "CHAMPION'S CORRESPONDING HUB",
                  'SECCIÓN DEDICADA DEL CAMPEÓN',
                  'SECTION DÉDIÉE DU CHAMPION',
                  'بوابة القسم الخاص بهذا البطل'
                )}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-bold leading-relaxed">
              {t(
                'Enter the dedicated training and biometric chamber tailored to this warrior.',
                'Accede a la sala de entrenamiento y análisis biométrico adaptada a este campeón.',
                'Accédez à la chambre d’entraînement et d’analyse biométrique dédiée à ce guerrier.',
                'اضغط هنا لفتح قسم التدريب والتحليل المرتبط بقدرات هذا المحارب مباشرة.'
              )}
            </p>
            {onExploreSection && (
              <button
                onClick={() => onExploreSection(activeFighter.targetSection)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-anime text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {t('ENTER CHAMBER NOW ⚡', 'ENTRAR AHORA ⚡', 'ENTRER MAINTENANT ⚡', 'دخول القسم الآن ⚡')}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
