/**
 * FoundersAndCommunity.tsx
 * Showcase of the three founders of YARD 300 with 4-language parity and obsidian-emerald theme.
 */

import React, { useState } from 'react';
import {
  Award,
  Brain,
  CheckCircle2
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
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

interface LocalizedText {
  en: string;
  es: string;
  fr: string;
  ar: string;
}

interface FounderProfile {
  id: string;
  name: LocalizedText;
  fullName: string;
  role: LocalizedText;
  discipline: LocalizedText;
  specialization: LocalizedText;
  elementColor: string;
  image: string;
  cardRank: LocalizedText;
  credentials: {
    en: string[];
    es: string[];
    fr: string[];
    ar: string[];
  };
}

const FOUNDERS: FounderProfile[] = [
  {
    id: 'yam-suw',
    name: {
      en: 'yam suw',
      es: 'yam suw',
      fr: 'yam suw',
      ar: 'يام سو (Yam Suw)'
    },
    fullName: 'Yam Suw',
    role: {
      en: 'Co-Founder • Shaolin Fighter & Head Coach',
      es: 'Cofundador • Luchador Shaolin y Entrenador Jefe',
      fr: 'Co-Fondateur • Combattant Shaolin & Coach Principal',
      ar: 'المؤسس المشارك • مقاتل شاولين والمدرب الرئيسي'
    },
    discipline: {
      en: 'Shaolin Martial Arts, Calisthenics & Hyrox Championships',
      es: 'Artes Marciales Shaolin, Calistenia y Campeonatos Hyrox',
      fr: 'Arts Martiaux Shaolin, Callisthénie & Championnats Hyrox',
      ar: 'فنون شاولين القتالية، الكاليستنكس وبطولات هايروكس العالمية'
    },
    specialization: {
      en: 'Shaolin combat conditioning, iron bodyweight levers, and functional race pacing',
      es: 'Acondicionamiento de combate Shaolin, palancas corporales de hierro y ritmo funcional de carrera',
      fr: 'Conditionnement martial Shaolin, leviers corporels de fer et gestion de rythme Hyrox',
      ar: 'اللياقة القتالية للشاولين، رافعات وزن الجسم الفولاذية، وتنظيم وتيرة سباقات التحمل'
    },
    elementColor: '#10B981',
    image: FOUNDER_YAM_SUW_IMAGE,
    cardRank: {
      en: 'PRO COACH',
      es: 'ENTRENADOR PRO',
      fr: 'COACH PRO',
      ar: 'المدرب الرئيسي'
    },
    credentials: {
      en: [
        'Shaolin Martial Arts Master',
        'Professional Combat & Endurance Athlete',
        'Hyrox & Calisthenics Competitor',
        'High-Performance Conditioning Architect'
      ],
      es: [
        'Maestro en Artes Marciales Shaolin',
        'Atleta Profesional de Combate y Resistencia',
        'Competidor de Hyrox y Calistenia',
        'Arquitecto de Acondicionamiento de Alto Rendimiento'
      ],
      fr: [
        'Maître en Arts Martiaux Shaolin',
        'Athlète Professionnel de Combat & Endurance',
        'Compétiteur Hyrox & Callisthénie',
        'Architecte de Préparation Haute Performance'
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
    name: {
      en: 'm t k',
      es: 'm t k',
      fr: 'm t k',
      ar: 'm t k'
    },
    fullName: 'm t k',
    role: {
      en: 'Co-Founder & Elite Conditioning & Recovery Coach',
      es: 'Cofundadora y Entrenadora de Élite en Acondicionamiento y Recuperación',
      fr: 'Co-Fondatrice & Coach Élite Conditionnement & Récupération',
      ar: 'المؤسس المشارك وكوتش النخبة للياقة الوظيفية والاستشفاء'
    },
    discipline: {
      en: 'Functional Fitness, Athletic Conditioning & Injury Recovery',
      es: 'Fitness Funcional, Acondicionamiento Atlético y Recuperación',
      fr: 'Fitness Fonctionnel, Conditionnement & Prévention des Blessures',
      ar: 'اللياقة البدنية الوظيفية، الإعداد البدني الرياضي والاستشفاء من الإصابات'
    },
    specialization: {
      en: 'Biomechanical load balance, functional athletic endurance, core stabilization, and post-match recovery',
      es: 'Equilibrio de carga biomecánica, resistencia funcional atlética, estabilidad del core y recuperación post-combate',
      fr: 'Équilibre des charges biomécaniques, endurance fonctionnelle, gainage profond et récupération post-combat',
      ar: 'توازن الأحمال الميكانيكية الحيوية، التحمل الوظيفي للرياضيين، استقرار الجذع، وبروتوكولات التعافي بعد النزالات'
    },
    elementColor: '#34D399',
    image: FOUNDER_MTK_IMAGE,
    cardRank: {
      en: 'PRO COACH',
      es: 'COACH PRO',
      fr: 'COACH PRO',
      ar: 'كوتش محترف'
    },
    credentials: {
      en: [
        'Functional Conditioning Specialist',
        'Athletic Biomechanics & Injury Rehab',
        'Endurance & Mobility Master Coach'
      ],
      es: [
        'Especialista en Acondicionamiento Funcional',
        'Biomecánica Atlética y Rehabilitación de Lesiones',
        'Master Coach de Resistencia y Movilidad'
      ],
      fr: [
        'Spécialiste en Conditionnement Fonctionnel',
        'Biomécanique Athlétique & Prévention',
        'Master Coach Endurance & Mobilité'
      ],
      ar: [
        'أخصائية الإعداد البدني والوظيفي الرياضي',
        'الميكانيكا الحيوية والوقاية من الإصابات',
        'كوتش معتمد في التحمل والمرونة الديناميكية'
      ]
    }
  },
  {
    id: 'arb',
    name: {
      en: 'A.R.B',
      es: 'A.R.B',
      fr: 'A.R.B',
      ar: 'إي آر بي (A.R.B)'
    },
    fullName: 'A.R.B',
    role: {
      en: 'Co-Founder & Combat Strategy Coach',
      es: 'Cofundador y Entrenador de Estrategia de Combate',
      fr: 'Co-Fondateur & Coach de Stratégie Martiale',
      ar: 'المؤسس المشارك ومدرب الاستراتيجيات القتالية'
    },
    discipline: {
      en: 'Shaolin Martial Arts & Fight Psychology',
      es: 'Artes Marciales Shaolin y Psicología del Combate',
      fr: 'Arts Martiaux Shaolin & Psychologie du Combat',
      ar: 'فنون شاولين القتالية وعلم النفس القتالي التنافسي'
    },
    specialization: {
      en: 'Striking mechanics, counter-angles, reaction drills, and competitive match mental toughness',
      es: 'Mecánica de golpeo, ángulos de contraataque, reflejos y fortaleza mental competitiva',
      fr: 'Mécanique de frappe, angles de contre, exercices de réaction et mental de compétition',
      ar: 'ميكانيكا اللكم والركل، زوايا الهجوم المرتد، تمارين سرعة رد الفعل، والصلابة الذهنية التنافسية'
    },
    elementColor: '#D4AF37',
    image: FOUNDER_ARB_IMAGE,
    cardRank: {
      en: 'TACTICAL COACH',
      es: 'COACH TÁCTICO',
      fr: 'COACH TACTIQUE',
      ar: 'مدرب تكتيكي'
    },
    credentials: {
      en: [
        'Tactical Fight Strategy Master',
        'Reaction Speed & Counter-Striking',
        'Zen Fighter Competitive Mindset'
      ],
      es: [
        'Maestro en Estrategia Táctica de Combate',
        'Velocidad de Reacción y Contraataque',
        'Mentalidad Competitiva Zen'
      ],
      fr: [
        'Maître en Stratégie Tactique de Combat',
        'Vitesse de Réaction & Contre-Frappe',
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
  const t = (en: string, es: string, fr: string, ar: string) => tr(currentLang, { en, es, fr, ar });
  const [activeFounderId, setActiveFounderId] = useState<string>('yam-suw');

  const [userAthleteName, setUserAthleteName] = useState<string>('');
  const [userDiscipline, setUserDiscipline] = useState<'hyrox' | 'boxing' | 'pilates' | 'crossfit'>('hyrox');
  const [userEffortLevel, setUserEffortLevel] = useState<number>(85);
  const [generatedCard, setGeneratedCard] = useState<boolean>(false);

  const handleGenerateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAthleteName.trim()) return;
    soundFX.playPowerUp();
    setGeneratedCard(true);
  };

  return (
    <section
      id="community"
      className={`relative my-10 max-w-[1800px] w-full overflow-hidden mx-auto px-4 md:px-8 ${
        isAr ? 'text-right' : 'text-left'
      }`}
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#080D0B] border border-emerald-500/30 text-[11px] font-black text-emerald-300 font-anime">
          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>
            {t(
              'YARD 300 THE THREE FOUNDERS & EXECUTIVE COACHING LEADERSHIP',
              'LOS TRES FUNDADORES DE YARD 300 Y DIRECCIÓN TÉCNICA',
              'LES TROIS FONDATEURS YARD 300 & DIRECTION SPORTIVE',
              'المؤسسون الثلاثة والقيادة التدريبية لـ YARD 300'
            )}
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-black font-anime text-white leading-tight">
          {t('THE THREE FOUNDERS ', 'LOS TRES FUNDADORES ', 'LES TROIS FONDATEURS ', 'المؤسسون الثلاثة ')}
          <span className="text-[#D4AF37]">
            {t('& ATHLETIC DISCIPLINES', 'Y DISCIPLINAS ATLÉTICAS', '& DISCIPLINES ATHLÉTIQUES', '& التخصصات الرياضية القتالية')}
          </span>
        </h2>

        <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl mx-auto">
          {t(
            'Meet the visionary leadership and founding athletes behind YARD 300: pioneering athletic performance engineering, martial arts mastery, functional conditioning, and proactive recovery.',
            'Conoce a los fundadores y atletas detrás de YARD 300: pioneros en ingeniería del rendimiento, artes marciales, acondicionamiento funcional y recuperación proactiva.',
            'Découvrez les fondateurs et athlètes visionnaires derrière YARD 300 : ingénierie de performance, maîtrise martiale, conditionnement fonctionnel et récupération active.',
            'تعرف على القيادة الملهمة والرياضيين المؤسسين الثلاثة وراء YARD 300: رواد هندسة الأداء البدني، فنون القتال للشاولين، واللياقة الوظيفية والاستشفاء.'
          )}
        </p>
      </div>

      {/* 3 Founders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-10">
        {FOUNDERS.map((founder) => {
          const isSelected = founder.id === activeFounderId;
          const creds =
            currentLang === 'ar'
              ? founder.credentials.ar
              : currentLang === 'es'
                ? founder.credentials.es
                : currentLang === 'fr'
                  ? founder.credentials.fr
                  : founder.credentials.en;

          return (
            <div
              key={founder.id}
              onClick={() => {
                soundFX.playButtonClick();
                setActiveFounderId(founder.id);
              }}
              className={`rounded-2xl p-4 bg-[#080D0B] border transition-all duration-300 flex flex-col cursor-pointer group ${
                isSelected
                  ? 'border-emerald-400/70 shadow-[0_0_25px_rgba(16,185,129,0.22)] bg-[#0C1411]'
                  : 'border-white/[0.08] hover:border-emerald-500/35 hover:bg-[#0A110E]'
              }`}
            >
              {/* Portrait */}
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3.5 bg-black">
                <img
                  loading="lazy"
                  decoding="async"
                  src={founder.image}
                  alt={tr(currentLang, founder.name)}
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-transparent to-transparent opacity-85" />

                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center">
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-black font-anime text-black shadow-md uppercase"
                    style={{ backgroundColor: founder.elementColor }}
                  >
                    {tr(currentLang, founder.cardRank)}
                  </span>
                  <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2 py-1 rounded-lg border border-emerald-500/30">
                    <span className="text-[9px] font-black text-white font-yard-logo italic tracking-wider">
                      YARD<span className="text-emerald-400">300</span>
                    </span>
                  </div>
                </div>

                <div className={`absolute bottom-2.5 left-2.5 right-2.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-xl font-black font-anime text-white">
                    {tr(currentLang, founder.name)}
                  </h3>
                  <span className="text-[11px] font-bold text-[#D4AF37] block">
                    {tr(currentLang, founder.role)}
                  </span>
                </div>
              </div>

              {/* Athletic Discipline & Specialization */}
              <div className={`space-y-2 text-xs ${isAr ? 'text-right' : 'text-left'}`}>
                <div className="p-2.5 rounded-lg bg-[#050807] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 font-anime">
                    {t('Discipline:', 'Disciplina:', 'Discipline :', 'التخصص الرياضي:')}
                  </span>
                  <span className="font-bold text-white text-[12px] block">
                    {tr(currentLang, founder.discipline)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#050807] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 font-anime">
                    {t('Specialization:', 'Especialización:', 'Spécialisation :', 'مجال الاحتراف:')}
                  </span>
                  <p className="text-slate-300 font-medium leading-relaxed text-[11px]">
                    {tr(currentLang, founder.specialization)}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#060B09] border border-emerald-500/20">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1 font-anime">
                    {t('Core Credentials:', 'Credenciales Clave:', 'Accréditations Clés :', 'الاعتمادات والإنجازات:')}
                  </span>
                  <ul className="space-y-1">
                    {creds.map((cred, idx) => (
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

      {/* Interactive Athlete Battle Card Minting Feature */}
      <div className="rounded-3xl bg-gradient-to-r from-[#080D0B] via-[#0B1410] to-[#080D0B] border border-emerald-500/25 p-6 md:p-10 shadow-xl mb-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2.5 mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-black text-emerald-300 font-anime">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>
                {t(
                  'FORGE YOUR CUSTOM ATHLETE CARD',
                  'FORJA TU TARJETA DE ATLETA',
                  'FORGEZ VOTRE CARTE ATHLÈTE',
                  'اصنع بطاقتك الرياضية المعتمدة'
                )}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black font-anime text-white">
              {t(
                'Every Athlete Earns Their Card Based on Effort & Discipline',
                'Cada Atleta Gana su Tarjeta con Esfuerzo y Disciplina',
                'Chaque Athlète Mérite sa Carte par Discipline & Effort',
                'كل رياضي يكسب بطاقته بناءً على الانضباط والجهد'
              )}
            </h3>
            <p className="text-xs md:text-sm text-slate-300 font-bold max-w-xl mx-auto">
              {t(
                'Enter your warrior handle, discipline, and training effort to forge your official personalized YARD battle card!',
                'Ingresa tu nombre de guerra, disciplina y nivel de esfuerzo semanal para generar tu tarjeta oficial YARD.',
                'Entrez votre nom d’athlète, votre discipline et votre effort hebdomadaire pour générer votre carte officielle YARD.',
                'أدخل اسمك الحركي، رياضتك، ونسبة مجهودك التدريبي لتوليد بطاقة معركة YARD رسمية خاصة بك!'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <form
              onSubmit={handleGenerateCard}
              className={`space-y-4 bg-[#050807] p-6 rounded-2xl border border-white/[0.08] ${
                isAr ? 'text-right' : 'text-left'
              }`}
            >
              <div>
                <label className="block text-xs font-black text-slate-300 mb-2 font-anime">
                  {t('Warrior Name / Handle:', 'Nombre de Guerrero / Alias:', 'Nom d’Athlète / Pseudo :', 'اسم المحارب / الاسم المستعار:')}
                </label>
                <input
                  type="text"
                  value={userAthleteName}
                  onChange={(e) => setUserAthleteName(e.target.value)}
                  placeholder={t('e.g., Shadow Striker Ken', 'ej., Shadow Striker Ken', 'ex. Shadow Striker Ken', 'مثال: Shadow Striker')}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0C1411] border border-white/[0.12] text-white font-bold text-sm focus:border-emerald-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-300 mb-2 font-anime">
                  {t('Athletic Discipline:', 'Disciplina Atlética:', 'Discipline Sportive :', 'الرياضة أو التخصص البدني:')}
                </label>
                <select
                  value={userDiscipline}
                  onChange={(e) => setUserDiscipline(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0C1411] border border-white/[0.12] text-white font-bold text-sm focus:border-emerald-400 outline-none cursor-pointer"
                >
                  <option value="hyrox">
                    {t('Hyrox Endurance Pro', 'Hyrox Resistencia Pro', 'Hyrox Endurance Pro', 'سباقات هايروكس للتحمل (Hyrox Pro)')}
                  </option>
                  <option value="boxing">
                    {t('Shaolin & Boxing Striker', 'Combate Shaolin y Boxeo', 'Combattant Shaolin & Boxe', 'ملاكمة وشاولين سترايكينج (Shaolin & Boxing)')}
                  </option>
                  <option value="pilates">
                    {t('Mobility & Functional Recovery', 'Movilidad y Recuperación Funcional', 'Mobilité & Récupération Fonctionnelle', 'مرونة واستشفاء حركي (Mobility & Functional Recovery)')}
                  </option>
                  <option value="crossfit">
                    {t('Functional Gauntlet', 'Circuito Funcional', 'Parcours Fonctionnel', 'كروس فيت وتمارين وظيفية (Functional Gauntlet)')}
                  </option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-2 font-anime">
                  <span>{t('Weekly Training Effort Level:', 'Esfuerzo Semanal de Entreno:', 'Niveau d’Effort Hebdomadaire :', 'مستوى الجهد والالتزام الأسبوعي:')}</span>
                  <span className="text-[#D4AF37] font-mono tabular-nums">{userEffortLevel}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={userEffortLevel}
                  onChange={(e) => setUserEffortLevel(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-anime text-xs shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-[1.01] transition-all cursor-pointer"
              >
                {t('GENERATE MY BATTLE CARD', 'GENERAR MI TARJETA DE COMBATE', 'GÉNÉRER MA CARTE DE COMBAT', 'توليد بطاقة المعركة الرسمية')}
              </button>
            </form>

            {/* Generated Card Display */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm rounded-3xl p-6 bg-[#050807] border border-emerald-500/35 shadow-[0_0_30px_rgba(16,185,129,0.18)] relative text-center">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black bg-emerald-500 text-black px-2 py-0.5 rounded font-anime">
                    {userEffortLevel >= 90 ? 'S-RANK GOD' : userEffortLevel >= 75 ? 'A-RANK PRO' : 'CHALLENGER'}
                  </span>
                  <span className="text-[10px] font-black text-[#D4AF37] font-mono tabular-nums" dir="ltr">
                    {Math.round(userEffortLevel * 99.5)} AP
                  </span>
                </div>

                <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 relative">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={CHALLENGER_IMAGE}
                    alt="Athlete Avatar"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-xs font-black text-white font-anime">
                    {userAthleteName || t('Future YARD Champion', 'Futuro Campeón YARD', 'Futur Champion YARD', 'بطل YARD القادم')}
                  </div>
                </div>

                <div className={`space-y-1.5 text-xs font-bold text-slate-300 ${isAr ? 'text-right' : 'text-left'}`}>
                  <div className="flex justify-between border-b border-white/[0.08] pb-1">
                    <span>{t('Discipline:', 'Disciplina:', 'Discipline :', 'التخصص:')}</span>
                    <span className="text-white uppercase font-mono">{userDiscipline}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.08] pb-1">
                    <span>{t('Effort Score:', 'Nivel de Esfuerzo:', 'Score d’Effort :', 'نقاط الجهد:')}</span>
                    <span className="text-[#D4AF37] font-mono tabular-nums">{userEffortLevel}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('YARD Registry:', 'Registro YARD:', 'Registre YARD :', 'سجل YARD:')}</span>
                    <span className="text-emerald-400 font-bold">
                      &#10003; {generatedCard
                        ? t('MINTED CREDENTIAL', 'CREDENCIAL EMITIDA', 'CARTE ÉMISE', 'تم إصدار البطاقة')
                        : t('VERIFIED WARRIOR', 'GUERRERO VERIFICADO', 'GUERRIER VÉRIFIÉ', 'محارب معتمد')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creed & Mindset */}
      <div className="rounded-3xl bg-gradient-to-r from-[#080D0B] via-[#0B1410] to-[#080D0B] border border-white/[0.08] p-6 md:p-10">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-black text-emerald-300 font-anime">
            <Brain className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {t('THE YARD MINDSET & CREED', 'MENTALIDAD Y CREDO YARD 300', 'ESPRIT & CREDO YARD 300', 'عقيدة وفلسفة YARD 300')}
            </span>
          </div>

          <h3 className="text-2xl md:text-4xl font-black text-white font-anime">
            {t(
              '“THE BODY ACHIEVES WHAT THE MIND BELIEVES”',
              '“EL CUERPO LOGRA LO QUE LA MENTE CREE”',
              '« LE CORPS ACCOMPLIT CE QUE L’ESPRIT CROIT »',
              '«الجسد يُحقق ما يؤمن به العقل»'
            )}
          </h3>

          <p className="text-xs md:text-sm text-slate-300 font-bold leading-relaxed max-w-2xl mx-auto">
            {t(
              'At YARD 300, limits are mental constructs. We merge supreme physical endurance with strategic zen composure. Discipline is the crucible that transmutes ordinary sweat into legendary S-Rank performance.',
              'En YARD 300, los límites son mentales.Combinamos resistencia física suprema con calma estratégica Zen para convertir el esfuerzo diario en rendimiento legendario.',
              'Chez YARD 300, les limites sont mentales. Nous fusionnons l’endurance physique suprême et le calme stratégique Zen pour forger des performances S-Rank.',
              'في YARD 300، الحدود ليست سوى وهم ذهني. نحن ندمج التحمل البدني الأقصى مع هدوء الزن الاستراتيجي؛ فالانضباط هو البوتقة التي تحول عرق التمارين العادي إلى أداء أسطوري برتبة S-Rank.'
            )}
          </p>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="p-4 rounded-2xl bg-[#050807] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-white font-black font-anime text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t('1. Relentless Sweat', '1. Esfuerzo Constante', '1. Effort Constant', '1. استمرارية العرق والجهد')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-bold">
                {t(
                  'Consistency over fleeting motivation. The arena calls regardless of the weather.',
                  'La constancia supera la motivación pasajera. La arena exige presencia cada día.',
                  'La régularité surpasse la motivation éphémère. L’arène appelle par tous les temps.',
                  'الانضباط يتفوق على التحفيز اللحظي؛ الحلبة تنادي في كل الظروف.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#050807] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-[#D4AF37] font-black font-anime text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>{t('2. Zen Composure', '2. Calma y Respiración Zen', '2. Maîtrise & Respiration Zen', '2. هدوء الزن والتنفس')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-bold">
                {t(
                  'Breathwork and bio-energy alchemical harmony to prevent physical and mental burnout.',
                  'Control respiratorio y armonía bioenergética para prevenir el agotamiento físico y mental.',
                  'Maîtrise du souffle et équilibre bioénergétique pour prévenir tout surmenage.',
                  'التنفس التكتيكي وتناغم الطاقة الحيوية لحماية الجسد وتفادي الاحتراق.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#050807] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-black font-anime text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{t('3. Brotherhood of 300', '3. Hermandad de los 300', '3. Fraternité des 300', '3. أخوة الـ 300 محارب')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-bold">
                {t(
                  'Every warrior elevates their comrade. We celebrate PRs and championships as one unified legion.',
                  'Cada atleta impulsa al equipo. Celebramos récords y campeonatos como una sola legión.',
                  'Chaque athlète élève ses pairs. Nous célébrons les records comme une légion unie.',
                  'كل مقاتل يرتقي برفيقه؛ نحتفل بالأرقام القياسية والبطولات كفيلق موحد.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersAndCommunity;
