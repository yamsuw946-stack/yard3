import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  Swords,
  Bot,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
  Ticket,
  ShieldCheck,
  Smartphone,
  Crown,
  Compass,
  Palmtree,
  LogIn,
  LogOut,
  User,
  CornerDownLeft,
  Trophy
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { authService, AuthUser } from '../services/authService';

export interface SideOptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => void;
  onOpenProfile: () => void;
  currentLang: Language;
}

type CategoryKey = 'all' | 'destinations' | 'labs' | 'commerce';

interface DrawerOptionItem {
  id: string;
  category: Exclude<CategoryKey, 'all'>;
  num: string;
  titleAr: string;
  titleEn: string;
  titleEs: string;
  titleFr: string;
  subAr: string;
  subEn: string;
  subEs: string;
  subFr: string;
  badgeAr: string;
  badgeEn: string;
  badgeEs: string;
  badgeFr: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const OPTION_ITEMS: DrawerOptionItem[] = [
  {
    id: 'customClub',
    category: 'destinations',
    num: '01',
    titleAr: 'النادي الرياضي الخاص',
    titleEn: 'YARD Athletic Club',
    titleEs: 'Club Atlético Privado',
    titleFr: 'Club Athlétique Privé',
    subAr: 'تأسيس ناديك وإدارة الأعضاء والستوريات اليومية',
    subEn: 'Private club setup, roster management & 24h stories',
    subEs: 'Creación de club privado, miembros e historias 24h',
    subFr: 'Création de club privé, gestion d’effectif et stories 24h',
    badgeAr: '30$',
    badgeEn: '$30',
    badgeEs: '30 $',
    badgeFr: '30 $',
    icon: Crown,
    accentColor: '#D4AF37'
  },
  {
    id: 'yardCamp',
    category: 'destinations',
    num: '02',
    titleAr: 'كامب يارد 300 الدولي',
    titleEn: 'YARD 300 Global Camp',
    titleEs: 'Campamento Global 300',
    titleFr: 'Camp Mondial 300',
    subAr: 'معسكر دولي حصري لـ 300 رياضي تحت إشراف المؤسسين',
    subEn: 'Annual 300-athlete global expedition camp',
    subEs: 'Campamento anual global para 300 atletas',
    subFr: 'Camp annuel exclusif pour 300 athlètes',
    badgeAr: '300 مقعد',
    badgeEn: '300 ONLY',
    badgeEs: 'SOLO 300',
    badgeFr: '300 PLACES',
    icon: Compass,
    accentColor: '#D4AF37'
  },
  {
    id: 'bazaruto',
    category: 'destinations',
    num: '03',
    titleAr: 'منتجع يارد · أرخبيل بازاروتو',
    titleEn: 'YARD Bazaruto Resort',
    titleEs: 'Resort Bazaruto VIP',
    titleFr: 'Resort Bazaruto VIP',
    subAr: '10 فيلل شاطئية، فندق، مركز ترفيه ومستشفى استشفاء',
    subEn: 'Oceanfront villas, hotel suites, dining & recovery sanctuary',
    subEs: 'Villas frente al mar, hotel boutique, ocio y clínica deportiva',
    subFr: 'Villas en front de mer, hôtel, loisirs et clinique du sport',
    badgeAr: 'أكتوبر 2027',
    badgeEn: 'OCT 2027',
    badgeEs: 'OCT 2027',
    badgeFr: 'OCT 2027',
    icon: Palmtree,
    accentColor: '#10B981'
  },
  {
    id: 'yardEngine',
    category: 'labs',
    num: '04',
    titleAr: 'المختبر الحيوي والنوم والإصابات',
    titleEn: 'Biometrics, Sleep & ACWR Lab',
    titleEs: 'Lab Biométrico y ACWR',
    titleFr: 'Labo Biométrique & ACWR',
    subAr: 'تحليل مراحل النوم العميق، الجاهزية، والتنبؤ بالإصابات',
    subEn: 'Deep sleep hypnogram, readiness dial & Gabbett ACWR model',
    subEs: 'Hipnograma de sueño profundo, preparación y modelo ACWR',
    subFr: 'Hypnogramme de sommeil profond, préparation et modèle ACWR',
    badgeAr: 'BIO LAB',
    badgeEn: 'BIO LAB',
    badgeEs: 'LAB BIO',
    badgeFr: 'LABO BIO',
    icon: Activity,
    accentColor: '#10B981'
  },
  {
    id: 'arena',
    category: 'labs',
    num: '05',
    titleAr: 'حلبة الأداء والنزالات والتصنيف',
    titleEn: 'Combat Arena & Rankings',
    titleEs: 'Arena y Clasificación',
    titleFr: 'Arène & Classement',
    subAr: 'تحديات قتالية مباشرة ولوحة تصنيف الأبطال S-Rank',
    subEn: 'Live kinetic conditioning & S-Rank global standings',
    subEs: 'Acondicionamiento en vivo y clasificación mundial S-Rank',
    subFr: 'Conditionnement cinétique en direct et classement mondial S-Rank',
    badgeAr: 'ARENA',
    badgeEn: 'ARENA',
    badgeEs: 'ARENA',
    badgeFr: 'ARÈNE',
    icon: Swords,
    accentColor: '#D4AF37'
  },
  {
    id: 'ai-coach',
    category: 'labs',
    num: '06',
    titleAr: 'المدرب الذكي بالذكاء الاصطناعي',
    titleEn: 'AI Performance Director',
    titleEs: 'Director Técnico IA',
    titleFr: 'Directeur Performance IA',
    subAr: 'بروتوكولات استشفاء تكيفية وتوجيه يومي مخصص',
    subEn: 'Adaptive recovery protocols & daily conditioning briefings',
    subEs: 'Protocolos adaptativos de recuperación y planes diarios',
    subFr: 'Protocoles de récupération adaptatifs et plans quotidiens',
    badgeAr: 'AI',
    badgeEn: 'AI',
    badgeEs: 'IA',
    badgeFr: 'IA',
    icon: Bot,
    accentColor: '#10B981'
  },
  {
    id: 'products',
    category: 'commerce',
    num: '07',
    titleAr: 'متجر العتاد والملابس الحصرية',
    titleEn: 'YARD 300 Luxury Store',
    titleEs: 'Tienda Oficial 300',
    titleFr: 'Boutique Officielle 300',
    subAr: 'إصدار مرقم محدود بـ 300 قطعة عالمياً بأنسجة عالية الأداء',
    subEn: 'Serialized precision athletic gear capped at 300 units',
    subEs: 'Equipamiento deportivo numerado limitado a 300 unidades',
    subFr: 'Équipement sportif numéroté limité à 300 exemplaires',
    badgeAr: '300 قطعة',
    badgeEn: '300 DROP',
    badgeEs: 'SERIE 300',
    badgeFr: 'SÉRIE 300',
    icon: ShoppingBag,
    accentColor: '#D4AF37'
  },
  {
    id: 'tickets',
    category: 'commerce',
    num: '08',
    titleAr: 'تذاكر البطولات والفعاليات الحية',
    titleEn: 'Championships & Passes',
    titleEs: 'Entradas y Eventos',
    titleFr: 'Billets & Événements',
    subAr: 'حجز المنصات، الجدول الرسمي وتذاكر البطولات العالمية',
    subEn: 'Interactive arena seating, global dates & VIP passes',
    subEs: 'Gradas interactivas, calendario mundial y pases VIP',
    subFr: 'Gradins interactifs, calendrier mondial et pass VIP',
    badgeAr: 'PASSES',
    badgeEn: 'PASSES',
    badgeEs: 'PASES',
    badgeFr: 'PASS',
    icon: Ticket,
    accentColor: '#D4AF37'
  },
  {
    id: 'leaderboard',
    category: 'labs',
    num: '09',
    titleAr: 'لوحة المتصدرين الأسبوعية والشهرية',
    titleEn: 'Weekly & Monthly Champions Board',
    titleEs: 'Clasificación Semanal y Mensual',
    titleFr: 'Classement Hebdo & Mensuel',
    subAr: 'أفضل النتائج الأسبوعية (10) والشهرية (50) وقراءات التدريب',
    subEn: 'Top Weekly (10) & Monthly (50) results & training telemetry',
    subEs: 'Mejores resultados semanales (10) y mensuales (50) y telemetría',
    subFr: 'Meilleurs résultats hebdo (10) & mensuels (50) et télémétrie',
    badgeAr: 'TOP 10/50',
    badgeEn: 'TOP 10/50',
    badgeEs: 'TOP 10/50',
    badgeFr: 'TOP 10/50',
    icon: Trophy,
    accentColor: '#10B981'
  }
];

const CATEGORIES: { id: CategoryKey; labelAr: string; labelEn: string; labelEs: string; labelFr: string }[] = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All', labelEs: 'Todo', labelFr: 'Tout' },
  { id: 'destinations', labelAr: 'الوجهات', labelEn: 'Places', labelEs: 'Sedes', labelFr: 'Lieux' },
  { id: 'labs', labelAr: 'المختبرات', labelEn: 'Labs', labelEs: 'Labs', labelFr: 'Labos' },
  { id: 'commerce', labelAr: 'المتجر', labelEn: 'Store', labelEs: 'Tienda', labelFr: 'Boutique' }
];

export const SideOptionsDrawer: React.FC<SideOptionsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenProfile,
  currentLang
}) => {
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';
  const isAr = currentLang === 'ar';
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [focusedIdx, setFocusedIdx] = useState<number>(0);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleAuthChange = (e: CustomEvent<{ user?: AuthUser | null }>) => {
      const user = e.detail?.user !== undefined ? e.detail.user : authService.getCurrentUser();
      setCurrentUser(user);
    };
    window.addEventListener('yard300_auth_change', handleAuthChange as EventListener);
    return () => window.removeEventListener('yard300_auth_change', handleAuthChange as EventListener);
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return OPTION_ITEMS;
    return OPTION_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    setFocusedIdx(0);
  }, [activeCategory, isOpen]);

  const activeCategoryIndex = CATEGORIES.findIndex((c) => c.id === activeCategory);
  const focusedItem = filteredItems[focusedIdx] || filteredItems[0];

  const getLocalizedTitle = (item: DrawerOptionItem) =>
    tr(currentLang, { en: item.titleEn, es: item.titleEs, fr: item.titleFr, ar: item.titleAr });

  const getLocalizedSub = (item: DrawerOptionItem) =>
    tr(currentLang, { en: item.subEn, es: item.subEs, fr: item.subFr, ar: item.subAr });

  const getLocalizedBadge = (item: DrawerOptionItem) =>
    tr(currentLang, { en: item.badgeEn, es: item.badgeEs, fr: item.badgeFr, ar: item.badgeAr });

  const triggerOption = (targetId: string, syntheticEvent?: React.MouseEvent<HTMLButtonElement>) => {
    soundFX.playButtonClick();
    onClose();
    const evt = syntheticEvent || ({ preventDefault: () => {} } as unknown as React.MouseEvent<HTMLButtonElement>);
    onNavigate(evt, targetId);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIdx((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIdx((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextCat = CATEGORIES[(activeCategoryIndex + (isAr ? -1 : 1) + CATEGORIES.length) % CATEGORIES.length];
        setActiveCategory(nextCat.id);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevCat = CATEGORIES[(activeCategoryIndex + (isAr ? 1 : -1) + CATEGORIES.length) % CATEGORIES.length];
        setActiveCategory(prevCat.id);
      } else if (e.key === 'Enter' && focusedItem) {
        e.preventDefault();
        triggerOption(focusedItem.id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, filteredItems.length, activeCategoryIndex, focusedItem, isAr, onClose]);

  const handleDrawerTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleDrawerTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      const step = dx < 0 ? (isAr ? -1 : 1) : (isAr ? 1 : -1);
      const next = CATEGORIES[(activeCategoryIndex + step + CATEGORIES.length) % CATEGORIES.length];
      soundFX.playButtonClick();
      setActiveCategory(next.id);
    }
  };

  const handleProfileClick = () => {
    soundFX.playButtonClick();
    onClose();
    onOpenProfile();
  };

  const FocusedIcon = focusedItem?.icon || Layers;

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#05060A]/85 backdrop-blur-md z-[70] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          soundFX.playButtonClick();
          onClose();
        }}
      />

      <aside
        aria-label={tr(currentLang, {
          en: 'YARD 300 Spatial Options',
          es: 'Opciones YARD 300',
          fr: 'Options YARD 300',
          ar: 'خيارات YARD 300'
        })}
        onTouchStart={handleDrawerTouchStart}
        onTouchEnd={handleDrawerTouchEnd}
        className={`fixed top-0 bottom-0 ${
          isAr ? 'right-0 border-l border-white/[0.08]' : 'left-0 border-r border-white/[0.08]'
        } w-full sm:w-[420px] max-w-[94vw] bg-[#07080C] text-white z-[80] shadow-[0_0_60px_rgba(0,0,0,0.92)] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : isAr ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        {/* Top Deck Header + Spatial Category Segmented Rail */}
        <div className="px-5 pt-4 pb-3 border-b border-white/[0.07] bg-[#0C0E14] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/12 border border-[#D4AF37]/40 flex items-center justify-center">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wider uppercase">
                  {tr(currentLang, {
                    en: 'YARD 300 COMMAND DECK',
                    es: 'PANEL DE NAVEGACIÓN YARD 300',
                    fr: 'MENU PRINCIPAL YARD 300',
                    ar: 'خيارات YARD 300'
                  })}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {tr(currentLang, {
                    en: 'Spatial directory · Arrow keys & swipe',
                    es: 'Directorio rápido · Flechas y deslizamiento',
                    fr: 'Navigation rapide · Flèches & balayage',
                    ar: 'التنقل المكاني السريع (الأسهم أو السحب)'
                  })}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#12151F] border border-white/[0.08] text-slate-400 hover:text-white hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
              aria-label={tr(currentLang, {
                en: 'Close Menu',
                es: 'Cerrar Menú',
                fr: 'Fermer le Menu',
                ar: 'إغلاق القائمة'
              })}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative grid grid-cols-4 p-1 rounded-xl bg-[#07080C] border border-white/[0.07]">
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-[#D4AF37] transition-transform duration-300 ease-out pointer-events-none"
              style={{
                width: 'calc(25% - 4px)',
                insetInlineStart: '4px',
                transform: `translateX(${(isAr ? -activeCategoryIndex : activeCategoryIndex) * 100}%)`
              }}
            />
            {CATEGORIES.map((cat) => {
              const selected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`relative z-10 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    selected ? 'text-[#07080C]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? cat.labelAr : isEs ? cat.labelEs : isFr ? cat.labelFr : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spatial Option Tracks */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 yard-slim-scrollbar">
          {filteredItems.map((item, idx) => {
            const Icon = item.icon;
            const isFocused = idx === focusedIdx;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setFocusedIdx(idx)}
                onFocus={() => setFocusedIdx(idx)}
                onClick={(e) => triggerOption(item.id, e)}
                className={`w-full text-start px-3.5 py-3 rounded-2xl border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                  isFocused
                    ? 'bg-[#121622] border-[#D4AF37]/55 shadow-[0_8px_24px_rgba(0,0,0,0.45)] translate-x-0.5'
                    : 'bg-[#0C0E14]/70 border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200"
                  style={{
                    backgroundColor: `${item.accentColor}${isFocused ? '22' : '12'}`,
                    borderColor: `${item.accentColor}${isFocused ? '60' : '30'}`,
                    transform: isFocused ? 'scale(1.06)' : 'scale(1)'
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: item.accentColor }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold text-[13px] truncate transition-colors ${isFocused ? 'text-[#D4AF37]' : 'text-white'}`}>
                      {getLocalizedTitle(item)}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider shrink-0 border tabular-nums"
                      style={{
                        color: item.accentColor,
                        borderColor: `${item.accentColor}35`,
                        backgroundColor: `${item.accentColor}10`
                      }}
                    >
                      {getLocalizedBadge(item)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {getLocalizedSub(item)}
                  </p>
                </div>

                <div className={`transition-all shrink-0 ${isFocused ? 'text-[#D4AF37] scale-110' : 'text-slate-600'}`}>
                  {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Spatial Inspector Preview + Account Footer */}
        <div className="p-4 bg-[#0C0E14] border-t border-white/[0.07] space-y-2.5">
          {focusedItem && (
            <div className="p-3 rounded-xl bg-[#07080C] border border-[#D4AF37]/25 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${focusedItem.accentColor}15` }}
                >
                  <FocusedIcon className="w-3.5 h-3.5" style={{ color: focusedItem.accentColor }} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block tabular-nums">
                    #{focusedItem.num} · {getLocalizedBadge(focusedItem)}
                  </span>
                  <span className="text-[11px] text-slate-300 truncate block">
                    {getLocalizedSub(focusedItem)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => triggerOption(focusedItem.id, e)}
                className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37] text-[#07080C] text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>{tr(currentLang, { en: 'Open', es: 'Ir', fr: 'Ouvrir', ar: 'دخول' })}</span>
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleProfileClick}
            className="w-full p-2.5 rounded-xl bg-[#12151F] hover:border-[#D4AF37]/45 border border-white/[0.08] flex items-center justify-between gap-3 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center overflow-hidden shrink-0">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                )}
              </div>
              <div className="text-start min-w-0">
                <span className="block font-bold text-white text-xs truncate">
                  {currentUser
                    ? currentUser.name
                    : tr(currentLang, {
                        en: 'Athlete Profile',
                        es: 'Perfil del Atleta',
                        fr: 'Profil Athlète',
                        ar: 'الملف الرياضي'
                      })}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {currentUser
                    ? currentUser.email
                    : tr(currentLang, {
                        en: 'Performance ID & Telemetry',
                        es: 'ID de Rendimiento y Telemetría',
                        fr: 'ID Performance & Télémétrie',
                        ar: 'جواز الهوية والإحصائيات'
                      })}
                </span>
              </div>
            </div>
            <span className="text-[9px] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
              {currentUser ? currentUser.rankTitle.split(' ')[0] : 'S-RANK'}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  authService.logout();
                }}
                className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{tr(currentLang, { en: 'Sign Out', es: 'Cerrar Sesión', fr: 'Déconnexion', ar: 'خروج' })}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  onClose();
                  window.dispatchEvent(new CustomEvent('yard300_open_auth', { detail: { mode: 'login' } }));
                }}
                className="py-2 px-3 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 text-[#10B981] font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{tr(currentLang, { en: 'Sign In', es: 'Iniciar Sesión', fr: 'Connexion', ar: 'تسجيل الدخول' })}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                onClose();
                window.dispatchEvent(new CustomEvent('open-app-download'));
              }}
              className="py-2 px-3 rounded-xl bg-[#12151F] hover:bg-[#181C2A] border border-white/[0.08] text-[11px] font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{tr(currentLang, { en: 'Mobile App', es: 'App Móvil', fr: 'App Mobile', ar: 'تطبيق الجوال' })}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => triggerOption('ownerDashboard', e)}
            className="w-full py-2 px-3 rounded-xl bg-[#12151F] hover:bg-[#181C2A] border border-white/[0.08] hover:border-[#D4AF37]/40 text-[11px] font-semibold text-[#D4AF37] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {tr(currentLang, {
                en: 'Control & Edit Dashboard',
                es: 'Panel de Control y Edición',
                fr: 'Panneau de Contrôle',
                ar: 'لوحة التحكم والتعديل الشامل'
              })}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideOptionsDrawer;
