import React, { useState, useEffect } from 'react';
import {
  Award,
  Brain,
  CheckCircle2
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { OwnerConfigService } from '../services/ownerConfigService';
import {
  FOUNDER_YAM_SUW_IMAGE,
  FOUNDER_MTK_IMAGE,
  FOUNDER_ARB_IMAGE,
  CHALLENGER_IMAGE,
  handleImageError
} from '../constants';

interface FoundersAndCommunityProps {
  currentLang?: Language;
  onExploreCommunity?: () => void;
}

interface FounderProfile {
  id: string;
  name: string;
  nameAr: string;
  fullName: string;
  role: { en: string; es: string; fr: string; ar: string };
  discipline: { en: string; es: string; fr: string; ar: string };
  specialization: { en: string; es: string; fr: string; ar: string };
  cardRank: { en: string; es: string; fr: string; ar: string };
  elementColor: string;
  image: string;
  credentials: { en: string[]; es: string[]; fr: string[]; ar: string[] };
}

const FOUNDERS: FounderProfile[] = [
  {
    id: 'yam-suw',
    name: 'yam suw',
    nameAr: 'يام سو (Yam Suw)',
    fullName: 'Yam Suw',
    role: {
      en: 'Co-Founder · Shaolin Fighter & Head Coach',
      es: 'Cofundador · Luchador Shaolín y Entrenador Principal',
      fr: 'Co-Fondateur · Combattant Shaolin & Coach Principal',
      ar: 'المؤسس المشارك • مقاتل شاولين والمدرب الرئيسي'
    },
    discipline: {
      en: 'Shaolin Martial Arts, Calisthenics & Hyrox Championships',
      es: 'Artes Marciales Shaolín, Calistenia y Campeonatos Hyrox',
      fr: 'Arts Martiaux Shaolin, Callisthénie & Championnats Hyrox',
      ar: 'فنون شاولين القتالية، الكاليستنكس وبطولات هايروكس العالمية'
    },
    specialization: {
      en: 'Shaolin combat conditioning, iron bodyweight levers, and functional race pacing',
      es: 'Acondicionamiento de combate Shaolín, palancas de peso corporal y ritmo funcional',
      fr: 'Conditionnement martial Shaolin, figures poids de corps et gestion de course',
      ar: 'اللياقة القتالية للشاولين، رافعات وزن الجسم الفولاذية، وتنظيم وتيرة السباقات'
    },
    elementColor: '#D4AF37',
    image: FOUNDER_YAM_SUW_IMAGE,
    cardRank: { en: 'PRO COACH', es: 'ENTRENADOR PRO', fr: 'COACH PRO', ar: 'المدرب الرئيسي' },
    credentials: {
      en: [
        'Shaolin Martial Arts Master',
        'Professional Combat & Endurance Athlete',
        'Hyrox & Calisthenics Competitor',
        'High-Performance Conditioning Architect'
      ],
      es: [
        'Maestro en Artes Marciales Shaolín',
        'Atleta Profesional de Combate y Resistencia',
        'Competidor de Hyrox y Calistenia',
        'Arquitecto de Alto Rendimiento'
      ],
      fr: [
        'Maître en Arts Martiaux Shaolin',
        'Athlète Professionnel Combat & Endurance',
        'Compétiteur Hyrox & Callisthénie',
        'Architecte de Haute Performance'
      ],
      ar: [
        'معلم فنون شاولين القتالية',
        'رياضي قتالي ومحترف سباقات تحمل',
        'منافس وبطل في الكاليستنكس والهايروكس',
        'مهندس اللياقة البدنية عالية الأداء'
      ]
    }
  },
  {
    id: 'mtk',
    name: 'M.T.K',
    nameAr: 'M.T.K',
    fullName: 'M.T.K · Elite Pilates & Functional Conditioning Architect',
    role: {
      en: 'Co-Founder · Pilates, Functional Flow & Recovery Lead',
      es: 'Cofundadora · Pilates, Flujo Funcional y Recuperación',
      fr: 'Co-Fondatrice · Pilates, Flow Fonctionnel & Récupération',
      ar: 'المؤسس المشارك · قيادة البيلاتس واللياقة الوظيفية والاستشفاء'
    },
    discipline: {
      en: 'Reformer Pilates, Core Biomechanics & Injury Recovery',
      es: 'Pilates Reformer, Biomecánica Central y Recuperación',
      fr: 'Pilates Reformer, Biomécanique Core & Récupération',
      ar: 'بيلاتس ريفورمر، الميكانيكا الحيوية للجذع والاستشفاء الرياضي'
    },
    specialization: {
      en: 'Core stabilization, muscular alignment, functional flexibility, and post-session recovery',
      es: 'Estabilización central, alineación muscular, flexibilidad y recuperación neurológica',
      fr: 'Stabilisation du tronc, alignement musculaire, souplesse et récupération post-séance',
      ar: 'استقرار عضلات الجذع، التناسق العضلي، المرونة الوظيفية وبروتوكولات الاستشفاء'
    },
    elementColor: '#F472B6',
    image: FOUNDER_MTK_IMAGE,
    cardRank: { en: 'PILATES ARCHITECT', es: 'ARQUITECTA PILATES', fr: 'ARCHITECTE PILATES', ar: 'قيادة البيلاتس' },
    credentials: {
      en: [
        'Reformer Pilates & Core Flow Architect',
        'Athletic Biomechanics & Injury Rehab',
        'Endurance & Mobility Master Coach'
      ],
      es: [
        'Arquitecta de Pilates Reformer y Core Flow',
        'Biomecánica Atlética y Rehabilitación',
        'Maestra Entrenadora de Movilidad'
      ],
      fr: [
        'Architecte Pilates Reformer & Core Flow',
        'Biomécanique Athlétique & Rééducation',
        'Coach Maître Endurance & Mobilité'
      ],
      ar: [
        'مصممة برامج البيلاتس والتوازن الحركي المتكامل',
        'الميكانيكا الحيوية والوقاية من الإصابات',
        'كوتش معتمد في المرونة الديناميكية والاستشفاء'
      ]
    }
  },
  {
    id: 'arb',
    name: 'A.R.B',
    nameAr: 'إي آر بي (A.R.B)',
    fullName: 'A.R.B',
    role: {
      en: 'Co-Founder & Combat Strategy Coach',
      es: 'Cofundador y Entrenador de Estrategia de Combate',
      fr: 'Co-Fondateur & Coach Stratégie de Combat',
      ar: 'المؤسس المشارك ومدرب الاستراتيجيات القتالية'
    },
    discipline: {
      en: 'Shaolin Martial Arts & Fight Psychology',
      es: 'Artes Marciales Shaolín y Psicología del Combate',
      fr: 'Arts Martiaux Shaolin & Psychologie du Combat',
      ar: 'فنون شاولين القتالية وعلم النفس القتالي التنافسي'
    },
    specialization: {
      en: 'Striking mechanics, counter-angles, reaction drills, and competitive mental toughness',
      es: 'Mecánica de golpeo, ángulos de contraataque, reflejos y fortaleza mental competitiva',
      fr: 'Mécanique de frappe, angles de contre, réflexes et force mentale compétitive',
      ar: 'ميكانيكا اللكم والركل، زوايا الهجوم المرتد، سرعة رد الفعل والصلابة الذهنية'
    },
    elementColor: '#D4AF37',
    image: FOUNDER_ARB_IMAGE,
    cardRank: { en: 'TACTICAL COACH', es: 'COACH TÁCTICO', fr: 'COACH TACTIQUE', ar: 'مدرب تكتيكي' },
    credentials: {
      en: [
        'Tactical Fight Strategy Master',
        'Reaction Speed & Counter-Striking',
        'Zen Fighter Competitive Mindset'
      ],
      es: [
        'Maestro de Estrategia Táctica de Combate',
        'Velocidad de Reacción y Contragolpe',
        'Mentalidad Competitiva Zen'
      ],
      fr: [
        'Maître en Stratégie Tactique de Combat',
        'Vitesse de Réaction & Contre-Attaque',
        'Mentalité Compétitive Zen'
      ],
      ar: [
        'خبير الاستراتيجيات التكتيكية في الحلبة',
        'سرعة رد الفعل والضربات المرتدة الحاسمة',
        'عقلية محارب الزن والتركيز التنافسي'
      ]
    }
  }
];

export const FoundersAndCommunity: React.FC<FoundersAndCommunityProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const [activeFounderId, setActiveFounderId] = useState<string>('yam-suw');
  const [founderOverrides, setFounderOverrides] = useState(() => OwnerConfigService.getConfig().siteSettings?.founderOverrides || {});

  useEffect(() => {
    return OwnerConfigService.subscribe((cfg) => {
      setFounderOverrides(cfg.siteSettings?.founderOverrides || {});
    });
  }, []);

  const configuredFounders = FOUNDERS.map((f) => {
    const ov = founderOverrides[f.id];
    if (!ov) return f;
    return {
      ...f,
      name: ov.name || f.name,
      nameAr: ov.nameAr || f.nameAr,
      role: {
        ...f.role,
        en: ov.role || f.role.en,
        ar: ov.roleAr || f.role.ar
      },
      image: ov.image || f.image
    };
  });

  const [userAthleteName, setUserAthleteName] = useState<string>('');
  const [userDiscipline, setUserDiscipline] = useState<'hyrox' | 'boxing' | 'pilates' | 'crossfit'>('hyrox');
  const [userEffortLevel, setUserEffortLevel] = useState<number>(85);
  const [, setGeneratedCard] = useState<boolean>(false);

  const handleGenerateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAthleteName.trim()) return;
    soundFX.playPowerUp();
    setGeneratedCard(true);
  };

  const getCredentialsList = (creds: { en: string[]; es: string[]; fr: string[]; ar: string[] }) => {
    if (currentLang === 'ar') return creds.ar;
    if (currentLang === 'es') return creds.es;
    if (currentLang === 'fr') return creds.fr;
    return creds.en;
  };

  return (
    <section id="community" className={`relative my-5 max-w-[1680px] w-full overflow-hidden mx-auto px-3 sm:px-5 md:px-6 ${isAr ? 'text-right' : 'text-left'}`}>
      {/* Compact Header */}
      <div className="text-center max-w-2xl mx-auto mb-5 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em]">
          <Award className="w-3 h-3" />
          <span>
            {tr(currentLang, {
              en: 'YARD 300 EXECUTIVE COACHING LEADERSHIP',
              es: 'LIDERAZGO EJECUTIVO Y ENTRENAMIENTO YARD 300',
              fr: 'DIRECTION SPORTIVE & COACHING YARD 300',
              ar: 'القيادة التأسيسية والخبرات التدريبية لـ YARD 300'
            })}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
          {tr(currentLang, {
            en: 'THE THREE FOUNDERS ',
            es: 'LOS TRES FUNDADORES ',
            fr: 'LES TROIS FONDATEURS ',
            ar: 'المؤسسون الثلاثة '
          })}
          <span className="text-[#D4AF37]">
            {tr(currentLang, {
              en: '& ATHLETIC DISCIPLINES',
              es: 'Y DISCIPLINAS ATLÉTICAS',
              fr: '& DISCIPLINES ATHLÉTIQUES',
              ar: 'والتخصصات القيادية'
            })}
          </span>
        </h2>

        <p className="text-[11px] md:text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          {tr(currentLang, {
            en: 'Meet the leadership behind YARD 300: athletic performance engineering, martial mastery, Reformer Pilates, and proactive recovery.',
            es: 'Conoce a los fundadores de YARD 300: ingeniería de rendimiento, maestría marcial, Pilates Reformer y recuperación proactiva.',
            fr: 'Découvrez la direction de YARD 300 : ingénierie de performance, maîtrise martiale, Pilates Reformer et récupération.',
            ar: 'تعرف على القيادة المؤسسة لـ YARD 300: رواد هندسة الأداء البدني، فنون الشاولين، البيلاتس المتكامل، والاستشفاء.'
          })}
        </p>
      </div>

      {/* 3 Compact Founders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-6">
        {configuredFounders.map((founder) => {
          const isSelected = founder.id === activeFounderId;

          return (
            <div
              key={founder.id}
              onClick={() => {
                soundFX.playButtonClick();
                setActiveFounderId(founder.id);
              }}
              className={`rounded-xl p-3 bg-[#0C0E14] border transition-all duration-200 flex flex-col cursor-pointer group ${
                isSelected
                  ? 'border-[#D4AF37]/60 bg-[#12151E]'
                  : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="relative w-full aspect-[4/4] rounded-lg overflow-hidden mb-3 bg-[#07080C]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={founder.image}
                  alt={isAr ? founder.nameAr : founder.fullName}
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-transparent to-transparent opacity-85" />

                <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider text-[#07080C] uppercase"
                    style={{ backgroundColor: founder.elementColor }}
                  >
                    {tr(currentLang, founder.cardRank)}
                  </span>
                  <div className="flex items-center gap-1 bg-[#07080C]/85 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
                    <img
                      src="/images/yard_red_black_white_logo.jpg"
                      alt="YARD 300 Logo"
                      referrerPolicy="no-referrer"
                      className="w-3 h-3 rounded object-cover"
                    />
                    <span className="text-[9px] font-bold text-white tracking-wider">
                      YARD<span className="text-[#D4AF37]">300</span>
                    </span>
                  </div>
                </div>

                <div className={`absolute bottom-2.5 left-2.5 right-2.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {isAr ? founder.nameAr : founder.name}
                  </h3>
                  <span className="text-[10px] font-medium text-[#D4AF37] block">
                    {tr(currentLang, founder.role)}
                  </span>
                </div>
              </div>

              <div className={`space-y-1.5 text-[11px] ${isAr ? 'text-right' : 'text-left'}`}>
                <div className="p-2 rounded-lg bg-[#0A0B10] border border-white/[0.06]">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">
                    {tr(currentLang, { en: 'Discipline:', es: 'Disciplina:', fr: 'Discipline :', ar: 'التخصص الرياضي:' })}
                  </span>
                  <span className="font-semibold text-white text-[11px] block">
                    {tr(currentLang, founder.discipline)}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[#0A0B10] border border-white/[0.06]">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">
                    {tr(currentLang, { en: 'Specialization:', es: 'Especialización:', fr: 'Spécialisation :', ar: 'مجال الاحتراف:' })}
                  </span>
                  <p className="text-slate-300 leading-snug text-[10px]">
                    {tr(currentLang, founder.specialization)}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-[#0E101A] border border-white/[0.05]">
                  <span className="text-[9px] uppercase font-bold text-[#D4AF37] block mb-1">
                    {tr(currentLang, { en: 'Core Credentials:', es: 'Credenciales:', fr: 'Qualifications :', ar: 'الاعتمادات والإنجازات:' })}
                  </span>
                  <ul className="space-y-0.5">
                    {getCredentialsList(founder.credentials).slice(0, 3).map((cred, idx) => (
                      <li key={idx} className="text-[10px] text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{cred}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Interactive Athlete Battle Card Forge */}
      <div className="rounded-2xl bg-[#0C0E14] border border-white/[0.08] p-4 sm:p-6 mb-5 max-w-5xl mx-auto">
        <div className="text-center space-y-1.5 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white/[0.06] border border-white/15 text-[10px] font-mono text-[#D4AF37]">
            <Award className="w-3 h-3" />
            <span>
              {tr(currentLang, {
                en: 'FORGE YOUR CUSTOM ATHLETE CARD',
                es: 'FORJA TU TARJETA ATLÉTICA PERSONALIZADA',
                fr: 'CRÉEZ VOTRE CARTE ATHLÈTE PERSONNALISÉE',
                ar: 'اصنع بطاقتك الرياضية المعتمدة'
              })}
            </span>
          </div>
          <h3 className="text-lg md:text-2xl font-extrabold text-white">
            {tr(currentLang, {
              en: 'Every Athlete Earns Their Card Based on Effort & Discipline',
              es: 'Cada Atleta Gana su Tarjeta Mediante Esfuerzo y Disciplina',
              fr: 'Chaque Athlète Mérite Sa Carte Par l’Effort et la Discipline',
              ar: 'كل رياضي يكسب بطاقته بناءً على الانضباط والجهد'
            })}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <form onSubmit={handleGenerateCard} className={`space-y-3 bg-[#07080C] p-4 rounded-xl border border-white/[0.08] ${isAr ? 'text-right' : 'text-left'}`}>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {tr(currentLang, {
                  en: 'Warrior Name / Handle:',
                  es: 'Nombre de Atleta:',
                  fr: 'Nom d’Athlète :',
                  ar: 'اسم المحارب / الاسم المستعار:'
                })}
              </label>
              <input
                type="text"
                value={userAthleteName}
                onChange={(e) => setUserAthleteName(e.target.value)}
                placeholder={tr(currentLang, {
                  en: 'e.g., Shadow Striker Ken',
                  es: 'ej., Shadow Striker Ken',
                  fr: 'ex., Shadow Striker Ken',
                  ar: 'مثال: Shadow Striker'
                })}
                className="w-full px-3 py-2 rounded-lg bg-[#12151E] border border-white/[0.1] text-white text-xs focus:border-[#D4AF37] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {tr(currentLang, {
                  en: 'Athletic Discipline:',
                  es: 'Disciplina Atlética:',
                  fr: 'Discipline Athlétique :',
                  ar: 'الرياضة أو التخصص البدني:'
                })}
              </label>
              <select
                value={userDiscipline}
                onChange={(e) => setUserDiscipline(e.target.value as 'hyrox' | 'boxing' | 'pilates' | 'crossfit')}
                className="w-full px-3 py-2 rounded-lg bg-[#12151E] border border-white/[0.1] text-white text-xs focus:border-[#D4AF37] outline-none cursor-pointer"
              >
                <option value="hyrox">
                  {tr(currentLang, { en: 'Hyrox Endurance Pro', es: 'Hyrox Resistencia Pro', fr: 'Hyrox Endurance Pro', ar: 'سباقات هايروكس للتحمل (Hyrox Pro)' })}
                </option>
                <option value="boxing">
                  {tr(currentLang, { en: 'Shaolin & Boxing Striker', es: 'Boxeo y Shaolín', fr: 'Boxe & Shaolin Striker', ar: 'ملاكمة وشاولين سترايكينج' })}
                </option>
                <option value="pilates">
                  {tr(currentLang, { en: 'Mobility & Functional Recovery', es: 'Movilidad y Recuperación', fr: 'Mobilité & Récupération', ar: 'مرونة واستشفاء حركي' })}
                </option>
                <option value="crossfit">
                  {tr(currentLang, { en: 'Functional Gauntlet', es: 'Circuito Funcional', fr: 'Circuit Fonctionnel', ar: 'كروس فيت وتمارين وظيفية' })}
                </option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                <span>
                  {tr(currentLang, {
                    en: 'Weekly Training Effort:',
                    es: 'Nivel de Esfuerzo Semanal:',
                    fr: 'Niveau d’Effort Hebdomadaire :',
                    ar: 'مستوى الجهد والالتزام الأسبوعي:'
                  })}
                </span>
                <span className="text-[#D4AF37] font-mono tabular-nums">{userEffortLevel}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={userEffortLevel}
                onChange={(e) => setUserEffortLevel(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-extrabold text-xs transition-colors cursor-pointer"
            >
              {tr(currentLang, {
                en: 'GENERATE MY BATTLE CARD',
                es: 'GENERAR MI TARJETA',
                fr: 'GÉNÉRER MA CARTE',
                ar: 'توليد بطاقة المعركة الرسمية'
              })}
            </button>
          </form>

          {/* Compact Card Preview */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs rounded-2xl p-4 bg-[#07080C] border border-white/[0.1] text-center space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono font-bold bg-[#D4AF37] text-[#07080C] px-2 py-0.5 rounded">
                  {userEffortLevel >= 90 ? 'S-RANK GOD' : userEffortLevel >= 75 ? 'A-RANK PRO' : 'CHALLENGER'}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#D4AF37] tabular-nums" dir="ltr">
                  {Math.round(userEffortLevel * 99.5)} AP
                </span>
              </div>

              <div className="w-full h-36 rounded-xl overflow-hidden relative">
                <img
                  loading="lazy"
                  decoding="async"
                  src={CHALLENGER_IMAGE}
                  alt="Athlete Avatar"
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-xs font-bold text-white">
                  {userAthleteName || tr(currentLang, {
                    en: 'Future YARD Champion',
                    es: 'Futuro Campeón YARD',
                    fr: 'Futur Champion YARD',
                    ar: 'بطل YARD القادم'
                  })}
                </div>
              </div>

              <div className={`space-y-1 text-[11px] font-medium text-slate-300 ${isAr ? 'text-right' : 'text-left'}`}>
                <div className="flex justify-between border-b border-white/[0.06] pb-1">
                  <span>{tr(currentLang, { en: 'Discipline:', es: 'Disciplina:', fr: 'Discipline :', ar: 'التخصص:' })}</span>
                  <span className="text-white uppercase font-mono">{userDiscipline}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-1">
                  <span>{tr(currentLang, { en: 'Effort Score:', es: 'Puntaje Esfuerzo:', fr: 'Score Effort :', ar: 'نقاط الجهد:' })}</span>
                  <span className="text-[#D4AF37] font-mono tabular-nums">{userEffortLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span>{tr(currentLang, { en: 'YARD Registry:', es: 'Registro YARD:', fr: 'Registre YARD :', ar: 'سجل YARD:' })}</span>
                  <span className="text-emerald-400 font-bold">
                    ✓ {tr(currentLang, { en: 'VERIFIED WARRIOR', es: 'VERIFICADO', fr: 'VÉRIFIÉ', ar: 'محارب معتمد' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Creed & Mindset */}
      <div className="rounded-2xl bg-[#0C0E14] border border-white/[0.08] p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white/[0.06] border border-white/15 text-[10px] font-mono text-[#D4AF37]">
            <Brain className="w-3.5 h-3.5" />
            <span>
              {tr(currentLang, {
                en: 'THE YARD MINDSET & CREED',
                es: 'MENTALIDAD Y CREDO YARD',
                fr: 'ESPRIT & CREDO YARD',
                ar: 'عقيدة وفلسفة YARD 300'
              })}
            </span>
          </div>

          <h3 className="text-lg md:text-2xl font-extrabold text-white">
            {tr(currentLang, {
              en: '“THE BODY ACHIEVES WHAT THE MIND BELIEVES”',
              es: '“EL CUERPO LOGRA LO QUE LA MENTE CREE”',
              fr: '« LE CORPS ACCOMPLIT CE QUE L’ESPRIT CROIT »',
              ar: '«الجسد يُحقق ما يؤمن به العقل»'
            })}
          </h3>

          <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {tr(currentLang, {
              en: 'At YARD 300, limits are mental constructs. We merge endurance with strategic composure—discipline transmutes ordinary sweat into S-Rank performance.',
              es: 'En YARD 300, los límites son mentales. Fusionamos resistencia extrema con serenidad estratégica para forjar rendimiento S-Rank.',
              fr: 'Chez YARD 300, les limites sont mentales. Nous unissons endurance suprême et calme stratégique pour atteindre le rang S-Rank.',
              ar: 'في YARD 300، الحدود مجرد وهم ذهني. ندمج التحمل البدني مع هدوء الزن الاستراتيجي لتحويل العرق إلى أداء أسطوري S-Rank.'
            })}
          </p>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="p-3 rounded-xl bg-[#07080C] border border-white/[0.07] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>
                  {tr(currentLang, {
                    en: '1. Relentless Sweat',
                    es: '1. Esfuerzo Constante',
                    fr: '1. Effort Constant',
                    ar: '1. استمرارية العرق والجهد'
                  })}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {tr(currentLang, {
                  en: 'Consistency beats fleeting motivation every single day.',
                  es: 'La constancia supera siempre a la motivación pasajera.',
                  fr: 'La régularité surpasse la motivation passagère.',
                  ar: 'الانضباط يتفوق على التحفيز اللحظي في كل الظروف.'
                })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#07080C] border border-white/[0.07] space-y-1">
              <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {tr(currentLang, {
                    en: '2. Zen Composure',
                    es: '2. Serenidad Táctica',
                    fr: '2. Calme Stratégique',
                    ar: '2. هدوء الزن والتنفس'
                  })}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {tr(currentLang, {
                  en: 'Breathwork and bio-energy balance prevent burnout.',
                  es: 'Respiración táctica y equilibrio bioenergético contra el agotamiento.',
                  fr: 'Respiration tactique et équilibre bio-énergétique anti-épuisement.',
                  ar: 'التنفس التكتيكي لحماية الجسد وتفادي الاحتراق البدني.'
                })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#07080C] border border-white/[0.07] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>
                  {tr(currentLang, {
                    en: '3. Brotherhood of 300',
                    es: '3. Hermandad de los 300',
                    fr: '3. Fraternité des 300',
                    ar: '3. أخوة الـ 300 محارب'
                  })}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {tr(currentLang, {
                  en: 'Every warrior elevates their comrade toward new records.',
                  es: 'Cada guerrero impulsa a su compañero hacia nuevos récords.',
                  fr: 'Chaque guerrier élève son camarade vers de nouveaux records.',
                  ar: 'كل مقاتل يرتقي برفيقه ونحتفل بالإنجازات كفيلق موحد.'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersAndCommunity;
