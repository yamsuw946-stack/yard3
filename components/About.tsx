/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { 
  ABOUT_SQUAD_IMAGE, 
  handleImageError 
} from '../constants';
import { Language } from '../i18n';

interface AboutProps {
  currentLang?: Language;
}

const About: React.FC<AboutProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';

  return (
    <section id="about" className="bg-[#0D0E17] py-24 relative w-full max-w-full overflow-hidden overflow-x-hidden">
      
      {/* Background Speedlines */}
      <div className="absolute inset-0 bg-speedlines opacity-10 pointer-events-none"></div>

      {/* Story Intro */}
      <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-12">
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-20 w-full max-w-full">
          
          <div className={`lg:w-1/2 flex flex-col items-start space-y-6 ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="px-4 py-1.5 rounded-full bg-[#141622] text-xs font-black text-[#FFE600] shadow-md">
              ⚡ {isAr ? 'فلسفة الفوز' : 'CHAMPION PHILOSOPHY'} — YARD300 AURA
            </div>

            <h2 className="text-4xl md:text-6xl font-black font-anime text-white leading-tight">
              {isAr ? (
                <>
                  ولدت من <span className="text-[#FF007A]">الإصرار الشرس،</span> <br/>
                  بنيت لكسر <span className="text-[#00F0FF]">الأرقام القياسية.</span>
                </>
              ) : (
                <>
                  FORGED IN <span className="text-[#FF007A]">FIERCE WILL,</span> <br/>
                  BUILT TO <span className="text-[#00F0FF]">SMASH RECORDS!</span>
                </>
              )}
            </h2>

            <p className="text-lg md:text-xl text-gray-300 font-bold leading-relaxed">
              {isAr 
                ? 'في عالم AURA CHAMPION، نحن لا نؤمن بالتراجع أو الأسباب الواهية. نحن نصنع العتاد الرياضي للشغوفين الذين يتدربون حتى تتساقط قطرات العرق، والذين ينظرون إلى كل تحدٍ بصقورة الأبطال.'
                : 'In the realm of AURA CHAMPION & YARD300, excuses do not exist. We engineer athletic combat gear for relentless athletes who train past fatigue with unwavering focus.'}
            </p>

            <p className="text-lg text-gray-400 leading-relaxed font-light">
              {isAr 
                ? 'تصاميمنا مستوحاة من أبطال أنمي الشونين الخارقين، مدمجة بأحدث تقنيات تتبع الأداء الرياضي والهندسة الميكانيكية للأنشطة العضلية العالية الكثافة.'
                : 'Our aesthetics are inspired by shonen anime superheroes, fused with high-tech biometric load algorithms and biomechanical engineering.'}
            </p>

            <div className="p-6 rounded-2xl bg-[#141622] w-full shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <span className="text-sm font-black text-[#FFE600] block mb-2 font-anime">
                {isAr ? 'مبدأ البطل رقم 1:' : 'CHAMPION PRINCIPLE #1:'}
              </span>
              <p className="text-white font-bold text-lg italic">
                {isAr 
                  ? '"المنافسة الحقيقية ليست ضد الآخرين، بل ضد من كنت عليه بالأمس!"'
                  : '"True competition is never against others — it is against who you were yesterday!"'}
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 relative w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(255,0,122,0.3)] group">
              <img 
                src={ABOUT_SQUAD_IMAGE} 
                alt="Aura Champion Squad" 
                onError={handleImageError}
                loading="lazy"
                decoding="async"
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-6 right-6 left-6 flex justify-between items-end backdrop-blur-md bg-[#0A0B10]/70 p-4 rounded-xl shadow-lg">
                <div>
                  <h4 className="text-xl font-black text-white font-anime">
                    {isAr ? 'فريق أبطال أورا NIKKE & S-RANK' : 'AURA CHAMPIONS SQUAD // TOKYO 2026'}
                  </h4>
                  <p className="text-xs text-[#00F0FF] font-bold">
                    {isAr ? 'حلبة التدريب المركزية - طوكيو 2026' : 'Central Arena Training Grounds'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-[#FF007A] text-white text-xs font-black rounded-lg">
                  POWER LEVEL 9999
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Philosophy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-full">
          
          <div className="p-8 rounded-2xl bg-[#141622] hover:bg-[#181a29] transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF007A] to-[#7000FF] flex items-center justify-center text-3xl mb-6 shadow-[0_0_15px_#FF007A]">
              🏋️‍♂️
            </div>
            <h3 className="text-2xl font-black text-white font-anime mb-4">
              {isAr ? 'التدريب المستمر' : 'RELENTLESS TRAINING'}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-bold">
              {isAr 
                ? 'لا وجود لأيام الراحة السلبية لدى البطل. التدريب الذكي والاستشفاء الموجه هما السر لإبقاء عضلتك وطاقتك في قمة الجاهزية.'
                : 'No passive rest days. Smart targeted recovery and biometric tracking keep muscle fibers primed for maximum load.'}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#141622] hover:bg-[#181a29] transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#7000FF] flex items-center justify-center text-3xl mb-6 shadow-[0_0_15px_#00F0FF]">
              ⚡
            </div>
            <h3 className="text-2xl font-black text-white font-anime mb-4">
              {isAr ? 'ألوان نيون صارخة' : 'GLOWING CYBER NEON'}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-bold">
              {isAr 
                ? 'تصلك شحنة الأدرينالين بمجرد ارتداء العتاد بمظهره المستقبلي الجريء وألوانه المشعة في أحلك الظروف.'
                : 'Instant adrenaline charge the second you suit up. Glowing anime phosphors light up even the darkest training dungeons.'}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#141622] hover:bg-[#181a29] transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFE600] to-[#FF007A] flex items-center justify-center text-3xl mb-6 shadow-[0_0_15px_#FFE600]">
              🔥
            </div>
            <h3 className="text-2xl font-black text-white font-anime mb-4">
              {isAr ? 'عقلية الفوز القهّار' : 'UNSTOPPABLE VICTORY'}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-bold">
              {isAr 
                ? 'كل نغمة، وكل حزام، وكل شاشة تم إنتاجها لتذكرك دائماً بتركيز الأبطال وعدم الرضا بغير الصدارة.'
                : 'Every display, audio cue, and strap is engineered to keep your aura locked onto #1 rank status.'}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
