import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Flame, 
  Zap, 
  Shield, 
  Move, 
  Volume2, 
  Eye, 
  ChevronRight,
  ChevronLeft,
  Crosshair
} from 'lucide-react';
import { Language } from '../i18n';
import { 
  HERO_IMAGE, 
  VALKYRIE_NEON_IMAGE, 
  TARIK_SAIYAN_IMAGE, 
  REN_FLAME_IMAGE, 
  TITAN_BRAWLER_IMAGE, 
  CYBER_SHINOBI_IMAGE, 
  KAREM_IRON_IMAGE,
  SAMURAI_RONIN_IMAGE,
  NINJA_KUNOICHI_IMAGE,
  BOXING_STRIKER_IMAGE,
  BOXING_VALKYRIE_IMAGE,
  AI_COACH_IMAGE,
  FOUNDER_YAM_SUW_IMAGE,
  FOUNDER_MTK_IMAGE,
  FOUNDER_ARB_IMAGE,
  handleImageError 
} from '../constants';
import { soundFX } from '../services/soundFX';

interface InteractiveCharacterStageProps {
  currentLang?: Language;
  onExploreSection?: (sectionId: string) => void;
}

interface FighterProfile {
  id: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  image: string;
  themeColor: string;
  neonShadow: string;
  auraPower: number;
  combatStyleEn: string;
  combatStyleAr: string;
  specialMoveEn: string;
  specialMoveAr: string;
  targetSection: string;
}

const FIGHTERS: FighterProfile[] = [
  {
    id: 'realistic_kenji',
    nameEn: 'Kenji "Dragon Striker"',
    nameAr: 'كينجي "ضارب التنين"',
    titleEn: 'Semi-Human Martial Champion (Shaolin Courtyard)',
    titleAr: 'بطل الفنون القتالية شبه البشري (فناء معبد الشاولين)',
    image: '/images/realistic_anime_striker.jpg',
    themeColor: '#FFE600',
    neonShadow: '0 0 45px rgba(255, 230, 0, 0.85)',
    auraPower: 9999,
    combatStyleEn: 'Shaolin Iron Fist & Kinetic Muay Thai Striking',
    combatStyleAr: 'قبضة الشاولين الفولاذية والمواي تاي الانفجاري',
    specialMoveEn: 'Meteor Dragon Impact',
    specialMoveAr: 'صدمة التنين النيزكية الخارقة',
    targetSection: 'yardEngine'
  },
  {
    id: 'realistic_valkyrie',
    nameEn: 'Valkyrie "Apex Phoenix"',
    nameAr: 'فالكييري "طائر الفينيق الأسمى"',
    titleEn: 'Semi-Human Combat Champion (Temple Mountain)',
    titleAr: 'بطلة القتال شبه البشرية (جبال المعبد)',
    image: '/images/realistic_valkyrie_fighter.jpg',
    themeColor: '#FF007A',
    neonShadow: '0 0 45px rgba(255, 0, 122, 0.85)',
    auraPower: 9980,
    combatStyleEn: 'Precision Kickboxing & Biomechanical Power',
    combatStyleAr: 'كيك بوكسينغ دقيق وتوافق بيوميكانيكي',
    specialMoveEn: 'Crimson Phoenix Axe Cleave',
    specialMoveAr: 'فأس الفينيق القرمزي الساحق',
    targetSection: 'products'
  },
  {
    id: 'samurai',
    nameEn: 'Cyber Samurai Ronin',
    nameAr: 'ساموراي السايبر رونين',
    titleEn: 'Crimson Katana Blade Master',
    titleAr: 'سيد نصل الكاتانا القرمزي وسرعة البرق',
    image: '/images/cyber_samurai_unique.jpg',
    themeColor: '#E50914',
    neonShadow: '0 0 45px rgba(229, 9, 20, 0.85)',
    auraPower: 9990,
    combatStyleEn: 'Iaijutsu Quickdraw & Kenjutsu Slashing',
    combatStyleAr: 'سحب الكاتانا الخاطف وضربات الكينجوتسو',
    specialMoveEn: 'Crimson Dragon Severance',
    specialMoveAr: 'بتر التنين القرمزي الحاسم',
    targetSection: 'yardEngine'
  },
  {
    id: 'kunoichi',
    nameEn: 'Ninja Kunoichi Shadow',
    nameAr: 'كونويتشي النينجا كاجي',
    titleEn: 'Silent Kunai & Stealth Assassin',
    titleAr: 'مقاتلة النينجا الشبحية وخناجر الكوناي',
    image: NINJA_KUNOICHI_IMAGE,
    themeColor: '#FFE600',
    neonShadow: '0 0 45px rgba(255, 230, 0, 0.85)',
    auraPower: 9680,
    combatStyleEn: 'Acrobatic Ninjutsu & Kunai Flurry',
    combatStyleAr: 'نينجوتسو الرشاقة ورمي خناجر الكوناي النارية',
    specialMoveEn: 'Golden Mirage Thousand Strikes',
    specialMoveAr: 'ألف ضربة لسراب الذهب',
    targetSection: 'auraVisualizer'
  },
  {
    id: 'ren_flame',
    nameEn: 'Ren Flame Hashira',
    nameAr: 'رين هاشيرا اللهب المقدس',
    titleEn: 'Blazing Sword Dual Master',
    titleAr: 'سيد سيوف اللهب والسرعة الخارقة',
    image: REN_FLAME_IMAGE,
    themeColor: '#E50914',
    neonShadow: '0 0 45px rgba(229, 9, 20, 0.85)',
    auraPower: 9890,
    combatStyleEn: 'Flame Breathing & High Velocity Slash',
    combatStyleAr: 'تنفس اللهب والضربات المقطعية فائقة السرعة',
    specialMoveEn: 'Inferno Sunburst Slash',
    specialMoveAr: 'ضربة شروق الشمس الجحيمية',
    targetSection: 'combatArena'
  },
  {
    id: 'valkyrie_strike',
    nameEn: 'Valkyrie Strike Champion',
    nameAr: 'فالكييري بطلة الضربات القاضية',
    titleEn: 'Apex High-Agility Striker',
    titleAr: 'ملكة اللكمات الخاطفة والرشاقة القتالية',
    image: '/images/boxing_valkyrie_punch_1790712629802.jpg',
    themeColor: '#FFE600',
    neonShadow: '0 0 45px rgba(255, 230, 0, 0.85)',
    auraPower: 9780,
    combatStyleEn: 'Lethal Precision Strikes & Kinetic Agility',
    combatStyleAr: 'لكمات دقيقة قاتلة وتوافق حركي انفجاري',
    specialMoveEn: 'Phoenix Rising Lightning Punch',
    specialMoveAr: 'لكمة طائر الفينيق الصاعقة',
    targetSection: 'products'
  },
  {
    id: 'iron_vanguard',
    nameEn: 'Karem Iron Vanguard',
    nameAr: 'كريم الحرس الحديدي',
    titleEn: 'Titan Armored Heavyweight',
    titleAr: 'عملاق الدفاع الفولاذي والضربات الساحقة',
    image: '/images/karem_iron_vanguard_1788741709635.jpg',
    themeColor: '#10B981',
    neonShadow: '0 0 45px rgba(16, 185, 129, 0.85)',
    auraPower: 9850,
    combatStyleEn: 'Iron Shielding & Heavy Counter Strikes',
    combatStyleAr: 'الدرع الفولاذي واللكمات المرتدة الساحقة',
    specialMoveEn: 'Titan Shockwave Breaker',
    specialMoveAr: 'موجة كسر العمالقة الصادمة',
    targetSection: 'arena'
  }
];

export const InteractiveCharacterStage: React.FC<InteractiveCharacterStageProps> = ({ 
  currentLang = 'en', 
  onExploreSection 
}) => {
  const isAr = currentLang === 'ar';
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  
  // Interactive 3D tilt and position state
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [characterOffset, setCharacterOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPoweringUp, setIsPoweringUp] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showSpecialAura, setShowSpecialAura] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeFighter = FIGHTERS[selectedIdx];

  // Mouse move 3D parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setCharacterOffset(prev => ({
        x: Math.max(-120, Math.min(120, prev.x + deltaX * 0.4)),
        y: Math.max(-80, Math.min(80, prev.y + deltaY * 0.4))
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate subtle 3D tilt
    const rotX = -(mouseY / (rect.height / 2)) * 14;
    const rotY = (mouseX / (rect.width / 2)) * 18;

    setRotation({ x: rotX, y: rotY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile interactive moving
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
    setCharacterOffset(prev => ({
      x: Math.max(-100, Math.min(100, prev.x + deltaX * 0.5)),
      y: Math.max(-60, Math.min(60, prev.y + deltaY * 0.5))
    }));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

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
    setSelectedIdx(prev => (prev + 1) % FIGHTERS.length);
    handleResetPosition();
  };

  const handlePrevFighter = () => {
    soundFX.playButtonClick();
    setSelectedIdx(prev => (prev - 1 + FIGHTERS.length) % FIGHTERS.length);
    handleResetPosition();
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#121422] via-[#0A0B10] to-[#12070A] p-4 md:p-8 shadow-[0_0_55px_rgba(229,9,20,0.35)] overflow-hidden my-6">
      
      {/* Anime Background Grids & Speed Aura Lines */}
      <div className="absolute inset-0 bg-cyber-grid opacity-15 pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#E50914]/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#FFE600]/15 blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181A28] text-[#FFE600] text-xs font-black font-anime uppercase tracking-wider mb-1.5 shadow-[0_0_15px_rgba(255,0,122,0.4)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#FF007A]" />
            <span>{isAr ? 'روعة وإبداع شخصيات الأنمي والأبطال الثلاثة (حرك واسحب)' : 'CHARISMATIC ANIME HEROES & FOUNDERS DOJO'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-anime text-white">
            {isAr ? activeFighter.nameAr : activeFighter.nameEn}
          </h2>
          <p className="text-xs md:text-sm font-bold text-gray-400">
            {isAr ? activeFighter.titleAr : activeFighter.titleEn}
          </p>
        </div>

        {/* Action Controls for Interactive Character */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerPowerStrike}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-[#FFE600] text-black font-black font-anime text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_#E50914] flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-current animate-bounce" />
            <span>{isAr ? 'إطلاق ضربة الساموراي! ⚡' : 'BURST BLADE STRIKE! ⚡'}</span>
          </button>

          <button
            onClick={handleResetPosition}
            title={isAr ? 'إعادة ضبط الوضعية' : 'Reset Position'}
            className="p-2.5 rounded-xl bg-[#141622] border border-gray-700 hover:border-[#E50914] text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Dojo Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Interactive Character Viewport */}
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
            className={`relative w-full max-w-[520px] aspect-[4/5] rounded-3xl bg-[#080910] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} overflow-hidden flex items-center justify-center select-none shadow-[0_15px_45px_rgba(0,0,0,0.9)] transition-colors duration-300`}
            style={{ perspective: '1000px' }}
          >
            {/* Interactive instruction watermark */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-[#0A0B10]/85 backdrop-blur-md px-3 py-1 rounded-xl border border-gray-800 text-[11px] font-bold text-gray-300">
              <Crosshair className="w-3.5 h-3.5 text-[#E50914] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{isAr ? 'اسحب بالماوس أو الإصبع لتحريك البطل في الفضاء 3D' : 'Drag or hover to rotate & move 3D hero'}</span>
            </div>

            {/* Glowing Anime Aura Background Disc */}
            <div 
              className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full transition-all duration-700 pointer-events-none ${isPoweringUp ? 'scale-125 opacity-90' : 'scale-100 opacity-60'}`}
              style={{
                background: `radial-gradient(circle, ${activeFighter.themeColor} 0%, transparent 70%)`,
                boxShadow: showSpecialAura ? activeFighter.neonShadow : 'none'
              }}
            ></div>

            {/* Character Graphic with Dynamic 3D Transform */}
            <div 
              className="relative w-[88%] h-[88%] rounded-2xl overflow-hidden transition-transform duration-150 ease-out pointer-events-none"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translate(${characterOffset.x}px, ${characterOffset.y}px) scale(${zoomLevel})`,
                boxShadow: `0 10px 30px rgba(0,0,0,0.8), ${activeFighter.neonShadow}`
              }}
            >
              <img loading="lazy" decoding="async" 
                src={activeFighter.image} 
                alt={activeFighter.nameEn}
                onError={handleImageError}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center scale-105 transition-all duration-300 ${isPoweringUp ? 'brightness-125 contrast-125' : ''}`}
                draggable={false}
              />

              {/* Dynamic Aura energy flares on trigger */}
              {isPoweringUp && (
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-pulse pointer-events-none"></div>
              )}

              {/* Bottom Character Tag inside frame */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#0A0B10]/85 backdrop-blur-md border border-white/10 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeFighter.themeColor }}></span>
                  <span className="text-xs font-black font-anime text-white">
                    {isAr ? activeFighter.combatStyleAr : activeFighter.combatStyleEn}
                  </span>
                </div>
                <span className="text-xs font-black font-anime" style={{ color: activeFighter.themeColor }}>
                  {activeFighter.auraPower} AU
                </span>
              </div>
            </div>

            {/* Prev / Next Hero Switchers overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevFighter();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#141622]/90 border border-[#E50914]/60 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] cursor-pointer"
              title="Previous Champion"
            >
              <ChevronLeft className="w-5 h-5 text-[#FFE600]" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextFighter();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#141622]/90 border border-[#E50914]/60 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] cursor-pointer"
              title="Next Champion"
            >
              <ChevronRight className="w-5 h-5 text-[#FFE600]" />
            </button>
          </div>

          {/* Interactive Zoom & Position Hint */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-bold">
            <span className="flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-[#FFE600]" />
              {isAr ? 'الإزاحة: ' : 'Offset: '} X: {Math.round(characterOffset.x)} | Y: {Math.round(characterOffset.y)}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
              {isAr ? 'زاوية الدوران: ' : 'Tilt: '} {Math.round(rotation.y)}°
            </span>
          </div>
        </div>

        {/* Right Side: Fighter Stats & Direct Section Portal */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Champion Selector Avatars */}
          <div className="p-4 rounded-2xl bg-[#121422] border border-gray-800">
            <h4 className="text-xs font-black font-anime text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>{isAr ? 'اختر البطل المفضل للتحريك والتفاعل:' : 'SELECT ACTIVE CHAMPION TO INTERACT:'}</span>
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
              {FIGHTERS.map((f, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleSelectFighter(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all cursor-pointer ${
                      isSelected 
                        ? 'scale-105 shadow-[0_0_15px_#FFE600]' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img loading="lazy" decoding="async" 
                      src={f.image} 
                      alt={f.nameEn}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#FFE600]/20 pointer-events-none"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fighter Battle Stats Card */}
          <div className="p-5 rounded-2xl bg-[#121422] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">{isAr ? 'طاقة الهالة القصوى:' : 'Maximum Aura Output:'}</span>
              <span className="text-base font-black font-anime text-[#FFE600]">{activeFighter.auraPower} / 10,000 AU</span>
            </div>

            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${(activeFighter.auraPower / 10000) * 100}%`,
                  backgroundColor: activeFighter.themeColor,
                  boxShadow: `0 0 10px ${activeFighter.themeColor}`
                }}
              ></div>
            </div>

            <div className="pt-2 border-t border-gray-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-bold">{isAr ? 'أسلوب القتال:' : 'Combat Style:'}</span>
                <span className="text-white font-bold">{isAr ? activeFighter.combatStyleAr : activeFighter.combatStyleEn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-bold">{isAr ? 'الحركة الخاصة:' : 'Special Strike:'}</span>
                <span className="font-bold text-[#FFE600]">{isAr ? activeFighter.specialMoveAr : activeFighter.specialMoveEn}</span>
              </div>
            </div>
          </div>

          {/* Quick Portal into Champion's Domain */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#181A28] to-[#141622] border border-[#E50914]/40 space-y-3 shadow-[0_0_20px_rgba(229,9,20,0.25)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFE600] animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-xs font-black font-anime text-white uppercase tracking-wider">
                {isAr ? 'بوابة القسم الخاص بهذا البطل' : "CHAMPION'S CORRESPONDING HUB"}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-bold leading-relaxed">
              {isAr 
                ? 'اضغط هنا لفتح قسم التدريب والتحليل المرتبط بقدرات هذا المحارب مباشرة.'
                : 'Enter the dedicated training and biometric chamber tailored to this warrior.'
              }
            </p>
            {onExploreSection && (
              <button
                onClick={() => onExploreSection(activeFighter.targetSection)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E50914] to-[#FFE600] hover:from-[#FFE600] hover:to-[#E50914] text-black font-black font-anime text-xs tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.5)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isAr ? 'دخول القسم الآن ⚡' : 'ENTER CHAMBER NOW ⚡'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
