/**
 * FoundersAndCommunity.tsx
 * Heroic showcase of the visionary founders of YARD 300:
 * 1. The Three Founders — Leaders, High-Standard Athletes & Entrepreneurs
 * 2. m.t.k — Co-Founder & Mobility Director (Pilates & Recovery)
 * 3. A.R.B — Co-Founder & Combat Strategy Coach (Shaolin Martial Arts & Fight Psychology)
 */

import React, { useState } from 'react';
import { 
  Award, 
  Brain, 
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Flame,
  Zap,
  Crown
} from 'lucide-react';
import { Language } from '../i18n';
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

interface FounderProfile {
  id: string;
  name: string;
  nameAr: string;
  fullName: string;
  role: string;
  roleAr: string;
  discipline: string;
  disciplineAr: string;
  specialization: string;
  specializationAr: string;
  badge: string;
  badgeAr: string;
  elementColor: string;
  image: string;
  cardRank: string;
  cardRankAr: string;
  credentials: string[];
  credentialsAr: string[];
}

const FOUNDERS: FounderProfile[] = [
  {
    id: 'yam-suw',
    name: 'yam suw',
    nameAr: 'يام سو (Yam Suw)',
    fullName: 'Yam Suw',
    role: 'Co-Founder • Shaolin Fighter & Head Coach',
    roleAr: 'المؤسس المشارك • مقاتل شاولين والمدرب الرئيسي',
    discipline: 'Shaolin Martial Arts, Calisthenics & Hyrox Championships',
    disciplineAr: 'فنون شاولين القتالية، الكاليستنكس وبطولات هايروكس العالمية',
    specialization: 'Shaolin combat conditioning, iron bodyweight levers, and functional race pacing',
    specializationAr: 'اللياقة القتالية للشاولين، رافعات وزن الجسم الفولاذية، وتنظيم وتيرة سباقات التحمل',
    badge: 'PRO COACH',
    badgeAr: 'كوتش محترف',
    elementColor: '#FF007A',
    image: FOUNDER_YAM_SUW_IMAGE,
    cardRank: 'PRO COACH',
    cardRankAr: 'المدرب الرئيسي',
    credentials: [
      'Shaolin Martial Arts Master',
      'Professional Combat & Endurance Athlete',
      'Hyrox & Calisthenics Competitor',
      'High-Performance Conditioning Architect'
    ],
    credentialsAr: [
      'معلم فنون شاولين القتالية',
      'رياضي قتالي ومحترف سباقات تحمل',
      'منافس وبطل في الكاليستنكس والهايروكس',
      'مهندس اللياقة البدنية عالية الأداء'
    ]
  },
  {
    id: 'mtk',
    name: 'm.t.k',
    nameAr: 'إم تي كي (m.t.k)',
    fullName: 'M.T.K',
    role: 'Co-Founder & Mobility Director',
    roleAr: 'المؤسس المشارك ومديرة المرونة والاستشفاء',
    discipline: 'Pilates, Reformer Biomechanics & Yoga Flow',
    disciplineAr: 'البيلاتس، الميكانيكا الحيوية للريفرمر، وتدفق اليوغا الحركي',
    specialization: 'Deep core stabilization, neuromuscular alignment, diaphragmatic breathwork & rapid athletic recovery',
    specializationAr: 'استقرار العضلات العميقة، التوافق العصبي العضلي، التنفس الحجابي والتعافي الرياضي السريع',
    badge: 'CO-FOUNDER',
    badgeAr: 'مؤسس مشارك',
    elementColor: '#FF69B4',
    image: FOUNDER_MTK_IMAGE,
    cardRank: 'PRO COACH',
    cardRankAr: 'أخصائية بيلاتس',
    credentials: [
      'Master Pilates & Reformer Specialist',
      'Neuromuscular Movement Calibration',
      'Athletic Spinal & Joint Longevity'
    ],
    credentialsAr: [
      'أخصائية بيلاتس وريفرمر معتمدة',
      'معايرة الحركة العصبية العضلية',
      'صحة ومرونة العمود الفقري والمفاصل الرياضية'
    ]
  },
  {
    id: 'arb',
    name: 'A.R.B',
    nameAr: 'إي آر بي (A.R.B)',
    fullName: 'A.R.B',
    role: 'Co-Founder & Combat Strategy Coach',
    roleAr: 'المؤسس المشارك ومدرب الاستراتيجيات القتالية',
    discipline: 'Shaolin Martial Arts & Fight Psychology',
    disciplineAr: 'فنون شاولين القتالية وعلم النفس القتالي التنافسي',
    specialization: 'Striking mechanics, counter-angles, reaction drills, and competitive match mental toughness',
    specializationAr: 'ميكانيكا اللكم والركل، زوايا الهجوم المرتد، تمارين سرعة رد الفعل، والصلابة الذهنية التنافسية',
    badge: 'CO-FOUNDER',
    badgeAr: 'مؤسس مشارك',
    elementColor: '#FFE600',
    image: FOUNDER_ARB_IMAGE,
    cardRank: 'PRO COACH',
    cardRankAr: 'مدرب تكتيكي',
    credentials: [
      'Tactical Fight Strategy Master',
      'Reaction Speed & Counter-Striking',
      'Zen Fighter Competitive Mindset'
    ],
    credentialsAr: [
      'خبير الاستراتيجيات التكتيكية في الحلبة',
      'سرعة رد الفعل والضربات المرتدة الحاسمة',
      'عقلية محارب الزن والتركيز التنافسي'
    ]
  }
];

export const FoundersAndCommunity: React.FC<FoundersAndCommunityProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const [activeFounderId, setActiveFounderId] = useState<string>('yam-suw');

  // User Custom Card Generator Simulator State
  const [userAthleteName, setUserAthleteName] = useState<string>('');
  const [userDiscipline, setUserDiscipline] = useState<'hyrox' | 'boxing' | 'pilates' | 'crossfit'>('hyrox');
  const [userEffortLevel, setUserEffortLevel] = useState<number>(85);
  const [generatedCard, setGeneratedCard] = useState<boolean>(false);

  const selectedFounder = FOUNDERS.find(f => f.id === activeFounderId) || FOUNDERS[0];

  const handleGenerateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAthleteName.trim()) return;
    soundFX.playPowerUp();
    setGeneratedCard(true);
  };

  return (
    <section id="community" className={`relative my-16 max-w-[1800px] w-full max-w-full overflow-hidden overflow-x-hidden mx-auto px-4 md:px-8 ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Grand Title and Community Lore Hook */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181A28] border border-gray-800 text-xs font-black text-gray-300 font-anime">
          <Award className="w-3.5 h-3.5 text-[#FFE600]" />
          <span>{isAr ? 'المؤسسون الثلاثة والإدارة التدريبية لـ YARD 300' : 'YARD 300 FOUNDERS & EXECUTIVE COACHING STAFF'}</span>
        </div>

        <h2 className="text-2xl md:text-4xl font-black font-anime text-white leading-tight">
          {isAr ? 'المؤسسون ' : 'THE FOUNDERS '}
          <span className="text-[#FFE600] neon-text-yellow">{isAr ? '& التخصصات الرياضية القتالية' : '& ATHLETIC DISCIPLINES'}</span>
        </h2>

        <p className="text-xs md:text-sm text-gray-400 font-medium max-w-2xl mx-auto">
          {isAr 
            ? 'تعرف على القيادة الملهمة والرياضيين المؤسسين وراء YARD 300: رواد هندسة الأداء البدني، فنون القتال للشاولين، والبيلاتس، والتنبؤ الاستباقي بالإصابات.'
            : 'Meet the visionary leadership and founding athletes behind YARD 300: pioneering athletic performance engineering, martial arts mastery, pilates, and proactive injury prediction.'}
        </p>
      </div>

      {/* 3 Founders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
        {FOUNDERS.map((founder) => {
          const isSelected = founder.id === activeFounderId;

          return (
            <div
              key={founder.id}
              onClick={() => {
                soundFX.playButtonClick();
                setActiveFounderId(founder.id);
              }}
              className={`rounded-2xl p-4 bg-[#11131E] transition-all duration-300 flex flex-col cursor-pointer group ${
                isSelected 
                  ? 'shadow-[0_0_25px_rgba(255,255,255,0.25)] bg-[#171a28]' 
                  : 'hover:bg-[#141724]'
              }`}
            >
              {/* Full-length Portrait Container */}
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3.5 bg-black">
                <img 
                  loading="lazy" 
                  decoding="async" 
                  src={founder.image} 
                  alt={isAr ? founder.nameAr : founder.fullName}
                  onError={handleImageError}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center">
                  <span 
                    className="px-2 py-0.5 rounded text-[9px] font-black font-anime text-black shadow-md uppercase"
                    style={{ backgroundColor: founder.elementColor }}
                  >
                    {isAr ? founder.cardRankAr : founder.cardRank}
                  </span>
                  <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2 py-1 rounded-lg shadow-md">
                    <img 
                      src="/images/yard_red_black_white_logo.jpg" 
                      alt="YARD 300 Logo" 
                      className="w-4 h-4 rounded object-cover shadow-[0_0_6px_rgba(229,9,20,0.8)]"
                    />
                    <span className="text-[9px] font-black text-white font-yard-logo italic tracking-wider">
                      YARD<span className="text-[#E50914]">300</span>
                    </span>
                  </div>
                </div>

                <div className={`absolute bottom-2.5 left-2.5 right-2.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-xl font-black font-anime text-white">
                    {isAr ? founder.nameAr : founder.name}
                  </h3>
                  <span className="text-[11px] font-bold text-[#FFE600] block">
                    {isAr ? founder.roleAr : founder.role}
                  </span>
                </div>
              </div>

              {/* Athletic Discipline & Specialization */}
              <div className={`space-y-2 text-xs ${isAr ? 'text-right' : 'text-left'}`}>
                <div className="p-2.5 rounded-lg bg-[#0A0B10] border border-gray-800/80">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5 font-anime">
                    {isAr ? 'التخصص الرياضي:' : 'Discipline:'}
                  </span>
                  <span className="font-bold text-white text-[12px] block">
                    {isAr ? founder.disciplineAr : founder.discipline}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0A0B10] border border-gray-800/80">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5 font-anime">
                    {isAr ? 'مجال الاحتراف:' : 'Specialization:'}
                  </span>
                  <p className="text-gray-300 font-medium leading-relaxed text-[11px]">
                    {isAr ? founder.specializationAr : founder.specialization}
                  </p>
                </div>

                {/* Credentials Bullets */}
                <div className="p-2.5 rounded-lg bg-[#0E101A] border border-gray-800/60">
                  <span className="text-[10px] uppercase font-bold text-[#00F0FF] block mb-1 font-anime">
                    {isAr ? 'الاعتمادات والإنجازات:' : 'Core Credentials:'}
                  </span>
                  <ul className="space-y-1">
                    {(isAr ? founder.credentialsAr : founder.credentials).map((cred, idx) => (
                      <li key={idx} className="text-[10px] text-gray-300 flex items-center gap-1.5">
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
      <div className="rounded-3xl bg-gradient-to-r from-[#181A28] via-[#121422] to-[#181A28] p-8 md:p-12 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-16">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/30 text-xs font-black text-white font-anime">
              <Award className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>{isAr ? 'اصنع بطاقتك الرياضية المعتمدة' : 'FORGE YOUR CUSTOM ATHLETE CARD'}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black font-anime text-white">
              {isAr ? 'كل رياضي يكسب بطاقته بناءً على الانضباط والجهد' : 'Every Athlete Earns Their Card Based on Effort & Discipline'}
            </h3>
            <p className="text-xs md:text-sm text-gray-300 font-bold max-w-xl mx-auto">
              {isAr 
                ? 'أدخل اسمك الحركي، رياضتك، ونسبة مجهودك التدريبي لتوليد بطاقة معركة YARD رسمية خاصة بك!'
                : 'Enter your warrior handle, discipline, and training effort to forge your official personalized YARD battle card!'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Form */}
            <form onSubmit={handleGenerateCard} className={`space-y-4 bg-[#0A0B10] p-6 rounded-2xl border border-gray-800 ${isAr ? 'text-right' : 'text-left'}`}>
              <div>
                <label className="block text-xs font-black text-gray-300 mb-2 font-anime">
                  {isAr ? 'اسم المحارب / الاسم المستعار:' : 'Warrior Name / Handle:'}
                </label>
                <input 
                  type="text" 
                  value={userAthleteName}
                  onChange={(e) => setUserAthleteName(e.target.value)}
                  placeholder={isAr ? 'مثال: Shadow Striker' : 'e.g., Shadow Striker Ken'} 
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141622] border border-gray-700 text-white font-bold text-sm focus:border-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-300 mb-2 font-anime">
                  {isAr ? 'الرياضة أو التخصص البدني:' : 'Athletic Discipline:'}
                </label>
                <select 
                  value={userDiscipline}
                  onChange={(e) => setUserDiscipline(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141622] border border-gray-700 text-white font-bold text-sm focus:border-white outline-none cursor-pointer"
                >
                  <option value="hyrox">{isAr ? 'سباقات هايروكس للتحمل (Hyrox Pro)' : 'Hyrox Endurance Pro'}</option>
                  <option value="boxing">{isAr ? 'ملاكمة وشاولين سترايكينج (Shaolin & Boxing)' : 'Shaolin & Boxing Striker'}</option>
                  <option value="pilates">{isAr ? 'بيلاتس واستشفاء حركي (Bio-Energy Pilates)' : 'Bio-Energy Pilates & Yoga'}</option>
                  <option value="crossfit">{isAr ? 'كروس فيت وتمارين وظيفية (Functional Gauntlet)' : 'Functional Gauntlet'}</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-300 mb-2 font-anime">
                  <span>{isAr ? 'مستوى الجهد والالتزام الأسبوعي:' : 'Weekly Training Effort Level:'}</span>
                  <span className="text-[#FFE600] font-mono">{userEffortLevel}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={userEffortLevel}
                  onChange={(e) => setUserEffortLevel(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black font-black font-anime text-xs shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
              >
                {isAr ? 'توليد بطاقة المعركة الرسمية' : 'GENERATE MY BATTLE CARD'}
              </button>
            </form>

            {/* Generated Card Display */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm rounded-3xl p-6 bg-[#0E101A] shadow-[0_0_35px_rgba(255,255,255,0.15)] relative text-center">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black bg-white text-black px-2 py-0.5 rounded font-anime">
                    {userEffortLevel >= 90 ? 'S-RANK GOD' : userEffortLevel >= 75 ? 'A-RANK PRO' : 'CHALLENGER'}
                  </span>
                  <span className="text-[10px] font-black text-[#FFE600] font-anime">
                    {Math.round(userEffortLevel * 99.5)} AP
                  </span>
                </div>

                <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    loading="lazy" 
                    decoding="async" 
                    src={CHALLENGER_IMAGE} 
                    alt="Athlete Avatar" 
                    onError={handleImageError}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E101A] via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-xs font-black text-white font-anime">
                    {userAthleteName || (isAr ? 'بطل YARD القادم' : 'Future YARD Champion')}
                  </div>
                </div>

                <div className={`space-y-1.5 text-xs font-bold text-gray-300 ${isAr ? 'text-right' : 'text-left'}`}>
                  <div className="flex justify-between border-b border-gray-800 pb-1">
                    <span>{isAr ? 'التخصص:' : 'Discipline:'}</span>
                    <span className="text-white uppercase font-mono">{userDiscipline}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-1">
                    <span>{isAr ? 'نقاط الجهد:' : 'Effort Score:'}</span>
                    <span className="text-[#FFE600] font-mono">{userEffortLevel}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isAr ? 'سجل YARD:' : 'YARD Registry:'}</span>
                    <span className="text-emerald-400 font-bold">&#10003; {isAr ? 'محارب معتمد' : 'VERIFIED WARRIOR'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Creed & Mindset */}
      <div className="rounded-3xl bg-gradient-to-r from-[#181A28] via-[#12131C] to-[#181A28] p-8 md:p-12 shadow-[0_0_35px_rgba(255,255,255,0.1)]">
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-black text-white font-anime">
            <Brain className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>{isAr ? 'عقيدة وفلسفة YARD 300' : 'THE YARD MINDSET & CREED'}</span>
          </div>

          <h3 className="text-2xl md:text-4xl font-black text-white font-anime">
            {isAr ? '«الجسد يُحقق ما يؤمن به العقل»' : '“THE BODY ACHIEVES WHAT THE MIND BELIEVES”'}
          </h3>

          <p className="text-xs md:text-sm text-gray-300 font-bold leading-relaxed max-w-2xl mx-auto">
            {isAr 
              ? 'في YARD 300، الحدود ليست سوى وهم ذهني. نحن ندمج التحمل البدني الأقصى مع هدوء الزن الاستراتيجي؛ فالانضباط هو البوتقة التي تحول عرق التمارين العادي إلى أداء أسطوري برتبة S-Rank.'
              : 'At YARD 300, limits are mental constructs. We merge supreme physical endurance with strategic zen composure. Discipline is the crucible that transmutes ordinary sweat into legendary S-Rank performance.'}
          </p>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 ${isAr ? 'text-right' : 'text-left'}`}>
            
            <div className="p-4 rounded-2xl bg-[#0A0B10] border border-gray-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-black font-anime text-xs">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{isAr ? '1. استمرارية العرق والجهد' : '1. Relentless Sweat'}</span>
              </div>
              <p className="text-[11px] text-gray-400 font-bold">
                {isAr ? 'الانضباط يتفوق على التحفيز اللحظي؛ الحلبة تنادي في كل الظروف.' : 'Consistency over fleeting motivation. The arena calls regardless of the weather.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0B10] border border-gray-800 space-y-2">
              <div className="flex items-center gap-2 text-[#FFE600] font-black font-anime text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#FFE600]" />
                <span>{isAr ? '2. هدوء الزن والتنفس' : '2. Zen Composure'}</span>
              </div>
              <p className="text-[11px] text-gray-400 font-bold">
                {isAr ? 'التنفس التكتيكي وتناغم الطاقة الحيوية لحماية الجسد وتفادي الاحتراق.' : 'Breathwork and bio-energy alchemical harmony to prevent physical and mental burnout.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0B10] border border-gray-800 space-y-2">
              <div className="flex items-center gap-2 text-zinc-200 font-black font-anime text-xs">
                <CheckCircle2 className="w-4 h-4 text-zinc-200" />
                <span>{isAr ? '3. أخوة الـ 300 محارب' : '3. Brotherhood of 300'}</span>
              </div>
              <p className="text-[11px] text-gray-400 font-bold">
                {isAr ? 'كل مقاتل يرتقي برفيقه؛ نحتفل بالأرقام القياسية والبطولات كفيلق موحد.' : 'Every warrior elevates their comrade. We celebrate PRs and championships as one unified legion.'}
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default FoundersAndCommunity;
