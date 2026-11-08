import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  Swords, 
  Bot, 
  ShoppingBag, 
  Trophy, 
  FileText, 
  BookOpen, 
  User, 
  Flame, 
  Zap, 
  ChevronRight,
  Eye,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Ticket,
  Crown,
  Users,
  Compass
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';

export type SectionHubId = 
  | 'yardEngine' 
  | 'auraVisualizer' 
  | 'combatArena' 
  | 'aiCoach' 
  | 'customClub'
  | 'products' 
  | 'tickets' 
  | 'yardCamp'
  | 'leaderboard' 
  | 'about' 
  | 'championStory'
  | 'journal' 
  | 'profile';

interface SectionHubNavProps {
  currentLang?: Language;
  activeSection: SectionHubId | null;
  onSelectSection: (id: SectionHubId) => void;
  onToggleAll: () => void;
  showAllSections: boolean;
}

export interface HubCardInfo {
  id: SectionHubId;
  titleEn: string;
  titleAr: string;
  badgeEn: string;
  badgeAr: string;
  descEn: string;
  descAr: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderColor: string;
  bgGlow: string;
  statEn: string;
  statAr: string;
}

export const HUB_SECTIONS: HubCardInfo[] = [
  {
    id: 'yardEngine',
    titleEn: 'Injury AI & Yard Engine',
    titleAr: 'محرك YARD & التنبؤ بالإصابات',
    badgeEn: 'CORE ENGINE',
    badgeAr: 'المحرك الحيوي',
    descEn: 'Deep sleep staging, ACWR injury alert algorithms, and recovery scores.',
    descAr: 'تحليل مراحل النوم العميق، تنبؤ الإصابات بخوارزميات ACWR، واستشفاء العضلات.',
    icon: Activity,
    accentColor: '#E50914',
    borderColor: 'border-[#E50914]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(229,9,20,0.5)]',
    statEn: '99.4% Precision',
    statAr: 'دقة تنبؤ 99.4%'
  },
  {
    id: 'combatArena',
    titleEn: 'Live Combat & Boxing Dojo',
    titleAr: 'حلبة النزالات والملاكمة التفاعلية',
    badgeEn: 'BOXING & STRIKES',
    badgeAr: 'قتال وتدريب',
    descEn: 'Fast-paced shadow strikes, real-time heart rate load, and target accuracy.',
    descAr: 'لكمات وتحديات سرعة، استجابة معدل ضربات القلب، وضرب أهداف الهالة.',
    icon: Swords,
    accentColor: '#FFE600',
    borderColor: 'border-[#FFE600]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(255,230,0,0.5)]',
    statEn: '100+ Combos',
    statAr: 'كومبو لا نهائي'
  },
  {
    id: 'auraVisualizer',
    titleEn: 'Ninja Aura Visualizer Studio',
    titleAr: 'أستوديو تفاعل وشحن الهالة',
    badgeEn: 'AURA 2050',
    badgeAr: 'شحن الهالة',
    descEn: 'Customizable cyber aura effects, dynamic anime particle flows, and audio beats.',
    descAr: 'تأثيرات هالة نيونية تفاعلية، جزيئات طاقة أنمي حركية، ونبض صوتي متفاعل.',
    icon: Sparkles,
    accentColor: '#E50914',
    borderColor: 'border-[#E50914]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(229,9,20,0.5)]',
    statEn: '5 Elements',
    statAr: '5 عناصر حيوية'
  },
  {
    id: 'aiCoach',
    titleEn: 'AI Sensei Sensei Ryu',
    titleAr: 'المدرب الذكي (السينسي ريو)',
    badgeEn: 'S-RANK AI',
    badgeAr: 'ذكاء اصطناعي',
    descEn: 'Instant adaptive workout counsel, daily quests, and personalized recovery cues.',
    descAr: 'نصائح تدريب ذكية فورية، مهام يومية للمكافآت، وتوجيهات تعافي مخصصة.',
    icon: Bot,
    accentColor: '#FFFFFF',
    borderColor: 'border-white/40',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]',
    statEn: 'Gemini Powered',
    statAr: 'مدعوم بالذكاء'
  },
  {
    id: 'products',
    titleEn: 'YARD300 Luxury Store (300 Units)',
    titleAr: 'متجر YARD300 الفخم (300 قطعة حصرية)',
    badgeEn: 'LUXURY DROP',
    badgeAr: 'إصدار فاخر حصري',
    descEn: 'Ultra-luxury athletic apparel & gear. Strictly 300 serialized pieces minted per drop for elite champions.',
    descAr: 'علامة فخمة بخامات عالية ونادرة: نبيع 300 قطعة فقط لكل منتج لنخبة الرياضيين والأبطال.',
    icon: ShoppingBag,
    accentColor: '#FFE600',
    borderColor: 'border-[#FFE600]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(255,230,0,0.5)]',
    statEn: '300 Units Only',
    statAr: '300 قطعة فقط'
  },
  {
    id: 'tickets',
    titleEn: 'Championship Tickets & Events',
    titleAr: 'تذاكر البطولات والأحداث الكبرى',
    badgeEn: 'LIVE PASS',
    badgeAr: 'حجز التذاكر',
    descEn: 'Official Championship Grand Prix passes, VIP ringside seats, and athlete trials registrations.',
    descAr: 'حجز تذاكر بطولة السايبر الكبرى، المنصة الملكية VIP، وتسجيل المشاركين في تجارب شاولين.',
    icon: Ticket,
    accentColor: '#E50914',
    borderColor: 'border-[#E50914]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(229,9,20,0.5)]',
    statEn: 'Schedule & Alerts',
    statAr: 'المواعيد والتنبيهات'
  },
  {
    id: 'leaderboard',
    titleEn: 'S-Rank Champions Hall',
    titleAr: 'قاعة الأساطير والمتصدرين',
    badgeEn: 'RANKING',
    badgeAr: 'التصنيف العالمي',
    descEn: 'Compete for 10,000 YARDX tokens with top athletes from across the globe.',
    descAr: 'تنافس على مكافأة 10,000 عملة YARDX مع نخبة أبطال الأنمي الرياضيين.',
    icon: Trophy,
    accentColor: '#E50914',
    borderColor: 'border-[#E50914]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(229,9,20,0.5)]',
    statEn: 'Weekly Prizes',
    statAr: 'جوائز أسبوعية'
  },
  {
    id: 'profile',
    titleEn: 'Champion Bio Profile',
    titleAr: 'ملف البطل والإحصائيات الحيوية',
    badgeEn: 'MY STATS',
    badgeAr: 'إحصائياتي',
    descEn: 'Track your personal calorie burns, power levels, badges, and weekly logs.',
    descAr: 'تتبع حرق السعرات، مستوى طاقة الهالة، الشارات المكتسبة، وسجلات التدريب.',
    icon: User,
    accentColor: '#FFE600',
    borderColor: 'border-[#FFE600]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(255,230,0,0.5)]',
    statEn: 'Live Radar',
    statAr: 'رادار القدرات'
  },
  {
    id: 'about',
    titleEn: 'Samurai Philosophy & Squad',
    titleAr: 'فلسفة الساموراي وفريق النخبة',
    badgeEn: 'THE LORE',
    badgeAr: 'القصة والرؤية',
    descEn: 'The revolutionary blend between anime fighting spirit and sports science.',
    descAr: 'الدمج الثوري بين روح قتال أبطال الأنمي وأحدث علوم الرياضة والفيزيولوجيا.',
    icon: BookOpen,
    accentColor: '#E50914',
    borderColor: 'border-[#E50914]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(229,9,20,0.5)]',
    statEn: '2050 Vision',
    statAr: 'رؤية 2050'
  },
  {
    id: 'championStory',
    titleEn: 'Monthly Champion Story & Video',
    titleAr: 'قصة وفيلم بطل الشهر المتصدر',
    badgeEn: 'DOCUMENTARY',
    badgeAr: 'وثائقي شهري',
    descEn: 'Exclusive monthly video documentary and workout routine of the world #1 athlete.',
    descAr: 'فيلم وثائقي شهري حصري وتفاصيل تدريب وروتين البطل المتصدر للترتيب العالمي.',
    icon: Trophy,
    accentColor: '#FFE600',
    borderColor: 'border-[#FFE600]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(255,230,0,0.5)]',
    statEn: 'Monthly Video',
    statAr: 'فيلم شهري'
  },
  {
    id: 'customClub',
    titleEn: 'My Custom Athletic Club ($30 / Level 3)',
    titleAr: 'ناديي الرياضي الخاص (30$ / المستوى 3)',
    badgeEn: '$30 · LEVEL 3 CLUB',
    badgeAr: 'نادي المستوى 3 (30$)',
    descEn: 'Own and name your athletic club, set custom logos, publish 24h stories, and recruit followers.',
    descAr: 'امتلك ناديك الرياضي الخاص، حدد اسمه وشعاره، انشر ستوريات يومية واستقطب متابعين.',
    icon: Crown,
    accentColor: '#A855F7',
    borderColor: 'border-[#A855F7]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]',
    statEn: '$30 License · Stories',
    statAr: 'ترخيص 30$ · ستوريات'
  },
  {
    id: 'yardCamp',
    titleEn: 'YARD 300 Global Expedition Camp',
    titleAr: 'معسكر يارد 300 الدولي (3 مغامرات)',
    badgeEn: '300 ATHLETES',
    badgeAr: 'نخبة 300 سنوياً',
    descEn: '10-day elite training camp across 3 global expeditions for 300 athletes worldwide.',
    descAr: 'معسكر تدريبي 10 أيام في 3 مغامرات كبرى حول العالم لـ 300 رياضي ومحترف سنوياً.',
    icon: Compass,
    accentColor: '#FFE600',
    borderColor: 'border-[#FFE600]/50',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(255,230,0,0.5)]',
    statEn: '300 Spots · 10 Days',
    statAr: '300 مقعد · 10 أيام'
  }
];

export const HUB_TRANSLATIONS: Record<SectionHubId, {
  titleEs: string;
  titleFr: string;
  badgeEs: string;
  badgeFr: string;
  descEs: string;
  descFr: string;
  statEs: string;
  statFr: string;
}> = {
  yardCamp: {
    titleEs: 'Campamento Global YARD 300',
    titleFr: 'Camp d\'Expédition Mondial YARD 300',
    badgeEs: '300 ATLETAS',
    badgeFr: '300 ATHLÈTES',
    descEs: 'Campamento de 10 días en 3 expediciones globales para 300 atletas seleccionados.',
    descFr: 'Camp de 10 jours à travers 3 expéditions mondiales pour 300 athlètes d\'élite.',
    statEs: '300 Plazas · 10 Días',
    statFr: '300 Places · 10 Jours',
  },
  yardEngine: {
    titleEs: 'IA de Lesiones y Motor YARD',
    titleFr: 'IA de Blessures & Moteur YARD',
    badgeEs: 'MOTOR CENTRAL',
    badgeFr: 'MOTEUR CENTRAL',
    descEs: 'Fases de sueño profundo, algoritmo ACWR de prevención de lesiones y recuperación.',
    descFr: 'Phases de sommeil profond, algorithme ACWR d\'alerte de blessure et récupération.',
    statEs: '99.4% Precisión',
    statFr: '99.4% Précision',
  },
  combatArena: {
    titleEs: 'Arena de Combate y Dojo de Boxeo',
    titleFr: 'Arène de Combat et Dojo de Boxe',
    badgeEs: 'BOXEO Y GOLPES',
    badgeFr: 'BOXE ET COMBAT',
    descEs: 'Golpes de sombra a ritmo rápido, carga cardíaca en tiempo real y precisión.',
    descFr: 'Frappes d\'ombre rythmées, charge cardiaque en direct et précision de frappe.',
    statEs: '100+ Combos',
    statFr: '100+ Combos',
  },
  auraVisualizer: {
    titleEs: 'Estudio Visualizador de Aura Ninja',
    titleFr: 'Studio Visualiseur d\'Aura Ninja',
    badgeEs: 'AURA 2050',
    badgeFr: 'AURA 2050',
    descEs: 'Efectos cibernéticos de aura personalizables, flujos de partículas anime y sonido.',
    descFr: 'Effets d\'aura cyber personnalisables, particules animées et rythme sonore.',
    statEs: '5 Elementos',
    statFr: '5 Éléments',
  },
  aiCoach: {
    titleEs: 'Sensei IA Sensei Ryu',
    titleFr: 'Sensei IA Sensei Ryu',
    badgeEs: 'IA RANGO S',
    badgeFr: 'IA RANG S',
    descEs: 'Consejos de entrenamiento adaptativo, misiones diarias y recuperación personalizada.',
    descFr: 'Conseils d\'entraînement adaptatifs, quêtes journalières et récupération sur mesure.',
    statEs: 'Potenciado por IA',
    statFr: 'Propulsé par IA',
  },
  products: {
    titleEs: 'Tienda de Lujo YARD300 (300 Unidades)',
    titleFr: 'Boutique Luxe YARD300 (300 Pièces)',
    badgeEs: 'EDICIÓN DE LUJO',
    badgeFr: 'ÉDITION LIMITÉE',
    descEs: 'Ropa y equipamiento atlético de ultra lujo. Solo 300 piezas numeradas por lanzamiento.',
    descFr: 'Vêtements et équipements athlétiques de luxe. Strictement 300 pièces numérotées.',
    statEs: 'Solo 300 Unidades',
    statFr: '300 Pièces Seulement',
  },
  tickets: {
    titleEs: 'Entradas y Eventos de Campeonato',
    titleFr: 'Billets et Événements de Championnat',
    badgeEs: 'PASE EN VIVO',
    badgeFr: 'PASS EN DIRECT',
    descEs: 'Pases para los campeonatos de Cyber Grand Prix en Tailandia y Camboya, asientos VIP y pruebas.',
    descFr: 'Pass pour les championnats Cyber Grand Prix en Thaïlande et Cambodge, sièges VIP et épreuves.',
    statEs: 'Fechas y Reservas',
    statFr: 'Dates et Réservations',
  },
  leaderboard: {
    titleEs: 'Salón de Campeones Rango S',
    titleFr: 'Hall des Champions Rang S',
    badgeEs: 'CLASIFICACIÓN',
    badgeFr: 'CLASSEMENT',
    descEs: 'Compite por 10,000 tokens YARDX con los mejores atletas de todo el mundo.',
    descFr: 'Affrontez les meilleurs athlètes mondiaux pour 10 000 jetons YARDX.',
    statEs: 'Premios Semanales',
    statFr: 'Prix Hebdomadaires',
  },
  profile: {
    titleEs: 'Perfil Biométrico de Campeón',
    titleFr: 'Profil Biométrique du Champion',
    badgeEs: 'MIS STATS',
    badgeFr: 'MES STATS',
    descEs: 'Sigue tus calorías quemadas, niveles de poder, insignias y registros semanales.',
    descFr: 'Suivez vos calories brûlées, niveaux de puissance, badges et journaux d\'entraînement.',
    statEs: 'Radar en Vivo',
    statFr: 'Radar en Direct',
  },
  about: {
    titleEs: 'Filosofía Samurai y Escuadrón',
    titleFr: 'Philosophie Samouraï & Escouade',
    badgeEs: 'HISTORIA',
    badgeFr: 'HISTOIRE',
    descEs: 'La fusión revolucionaria entre el espíritu de combate anime y la ciencia deportiva.',
    descFr: 'La fusion révolutionnaire entre l\'esprit de combat anime et la science du sport.',
    statEs: 'Visión 2050',
    statFr: 'Vision 2050',
  },
  championStory: {
    titleEs: 'Historia y Vídeo del Campeón del Mes',
    titleFr: 'Histoire & Vidéo du Champion du Mois',
    badgeEs: 'DOCUMENTAL',
    badgeFr: 'DOCUMENTAIRE',
    descEs: 'Documental exclusivo en vídeo y rutina del atleta número 1 mundial.',
    descFr: 'Documentaire vidéo exclusif et routine d\'entraînement de l\'athlète mondial N°1.',
    statEs: 'Vídeo Mensual',
    statFr: 'Vidéo Mensuelle',
  },
  customClub: {
    titleEs: 'Mi Club Atlético Personalizado ($30 / Nivel 3)',
    titleFr: 'Mon Club Athlétique Personnalisé (30 $ / Niveau 3)',
    badgeEs: '$30 · CLUB NIVEL 3',
    badgeFr: '30 $ · CLUB NIVEAU 3',
    descEs: 'Crea tu club, personaliza logo y colores, publica historias de 24h y añade amigos.',
    descFr: 'Créez votre club, personnalisez logos et couleurs, diffusez des stories et ajoutez des amis.',
    statEs: 'Licencia $30 · Stories',
    statFr: 'Licence 30 $ · Stories',
  },
  journal: {
    titleEs: 'Diario y Laboratorio de Rendimiento',
    titleFr: 'Journal & Laboratoire de Performance',
    badgeEs: 'CIENCIA Y GEAR',
    badgeFr: 'SCIENCE & GEAR',
    descEs: 'Artículos científicos, protocolos de recuperación y guías atléticas.',
    descFr: 'Articles scientifiques, protocoles de récupération et guides athlétiques.',
    statEs: 'Artículos Pro',
    statFr: 'Articles Pro',
  }
};

export const SectionHubNav: React.FC<SectionHubNavProps> = ({
  currentLang = 'en',
  activeSection,
  onSelectSection,
  onToggleAll,
  showAllSections
}) => {
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';
  const isAr = currentLang === 'ar';

  const handleCardClick = (id: SectionHubId) => {
    soundFX.playButtonClick();
    onSelectSection(id);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden my-8">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141622] border border-[#00F0FF]/50 text-[#00F0FF] text-xs font-black font-anime uppercase tracking-wider mb-2 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <Zap className="w-3.5 h-3.5 text-[#FFE600] animate-bounce" />
            <span>
              {isEs 
                ? 'TODOS LOS CENTROS DE OPCIONES Y SERVICIOS' 
                : isFr 
                ? 'TOUS LES HUBS D\'OPTIONS ET SERVICES' 
                : isAr 
                ? 'الخيارات والمزايا والمحركات الكاملة' 
                : 'ALL OPTIONS & SERVICES HUBS'}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black font-anime text-white">
            {isEs 
              ? 'DIRECTORIO DE SERVICIOS — EXPANSIÓN INMEDIATA' 
              : isFr 
              ? 'RÉPERTOIRE DES SERVICES — ACCÈS DIRECT' 
              : isAr 
              ? 'دليل الخيارات والمزايا — تحكم فوري بكافة الخدمات' 
              : 'OPTIONS & SERVICES DIRECTORY — ONE-CLICK EXPANSION'}
          </h2>
          <p className="text-xs md:text-sm font-bold text-gray-300 mt-1 max-w-2xl">
            {isEs 
              ? 'Todos los servicios de YARD300 reunidos aquí para una navegación limpia y activación instantánea.' 
              : isFr 
              ? 'Tous les services YARD300 réunis pour une navigation fluide et une activation en un clic.' 
              : isAr 
              ? 'تم جمع كافة الخدمات والمحركات والمزايا هنا لتصفحها وتشغيلها بضغطة زر دون ازدحام الواجهة الرئيسية.'
              : 'All YARD300 services, combat engines, and features are gathered here for clean, instant one-click activation.'
            }
          </p>
        </div>

        {/* View mode toggle */}
        <button
          onClick={() => {
            soundFX.playButtonClick();
            onToggleAll();
          }}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border font-black font-anime text-xs transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            showAllSections 
              ? 'bg-[#181A28] text-[#FFE600] border-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.5)]'
              : 'bg-[#141622] text-gray-300 border-gray-700 hover:text-white hover:border-[#FFE600]'
          }`}
        >
          {showAllSections ? (
            <>
              <Minimize2 className="w-4 h-4 text-[#FFE600]" />
              <span>{isEs ? 'CONTRAER TODO' : isFr ? 'RÉDUIRE TOUT' : isAr ? 'طي كافة الأقسام (تقليل الزحمة)' : 'COLLAPSE ALL (CLEAN VIEW)'}</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 text-[#E50914]" />
              <span>{isEs ? 'EXPANDIR TODAS LAS SECCIONES' : isFr ? 'DÉVELOPPER TOUTES LES SECTIONS' : isAr ? 'فتح واستعراض كافة الأقسام' : 'EXPAND ALL SECTIONS'}</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of Interactive Hub Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 w-full max-w-full">
        {HUB_SECTIONS.map((hub) => {
          const Icon = hub.icon;
          const isActive = activeSection === hub.id;

          return (
            <button
              key={hub.id}
              onClick={() => handleCardClick(hub.id)}
              className={`relative text-start p-4 md:p-5 rounded-2xl transition-all duration-300 group cursor-pointer overflow-hidden border ${
                isActive
                  ? `bg-gradient-to-br from-[#181A28] to-[#141622] border-2 shadow-[0_0_25px_rgba(255,230,0,0.3)] scale-[1.02]`
                  : `bg-[#0E101A]/90 hover:bg-[#151726] border-gray-800 ${hub.borderColor} ${hub.bgGlow}`
              }`}
              style={{
                borderColor: isActive ? hub.accentColor : undefined
              }}
            >
              {/* Subtle neon gradient backlight */}
              <div 
                className="absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-10 group-hover:opacity-30 blur-2xl transition-all"
                style={{ backgroundColor: hub.accentColor }}
              ></div>

              <div className="flex items-start justify-between gap-2 mb-3">
                {/* Icon Capsule */}
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
                  style={{
                    backgroundColor: `${hub.accentColor}18`,
                    border: `1px solid ${hub.accentColor}50`
                  }}
                >
                  <Icon 
                    className="w-5 h-5 md:w-6 md:h-6" 
                    style={{ color: hub.accentColor }} 
                  />
                </div>

                {/* Badge Tag */}
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-black font-anime uppercase tracking-wider"
                  style={{
                    backgroundColor: `${hub.accentColor}20`,
                    color: hub.accentColor,
                    border: `1px solid ${hub.accentColor}40`
                  }}
                >
                  {isEs ? HUB_TRANSLATIONS[hub.id]?.badgeEs : isFr ? HUB_TRANSLATIONS[hub.id]?.badgeFr : isAr ? hub.badgeAr : hub.badgeEn}
                </span>
              </div>

              {/* Hub Title */}
              <h3 className="text-sm md:text-base font-black font-anime text-white group-hover:text-[#FFE600] transition-colors mb-1 line-clamp-1">
                {isEs ? HUB_TRANSLATIONS[hub.id]?.titleEs : isFr ? HUB_TRANSLATIONS[hub.id]?.titleFr : isAr ? hub.titleAr : hub.titleEn}
              </h3>

              {/* Hub Description */}
              <p className="text-[11px] md:text-xs text-gray-400 font-bold line-clamp-2 leading-relaxed mb-3">
                {isEs ? HUB_TRANSLATIONS[hub.id]?.descEs : isFr ? HUB_TRANSLATIONS[hub.id]?.descFr : isAr ? hub.descAr : hub.descEn}
              </p>

              {/* Bottom Quick Stat & Click Indicator */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-[11px]">
                <span className="font-bold text-gray-300">
                  {isEs ? HUB_TRANSLATIONS[hub.id]?.statEs : isFr ? HUB_TRANSLATIONS[hub.id]?.statFr : isAr ? hub.statAr : hub.statEn}
                </span>
                <span 
                  className="inline-flex items-center gap-1 font-black font-anime text-[11px] transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: hub.accentColor }}
                >
                  <span>{isEs ? 'ENTRAR ⚡' : isFr ? 'ENTRER ⚡' : isAr ? 'دخول الصفحة ⚡' : 'ENTER PAGE ⚡'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
