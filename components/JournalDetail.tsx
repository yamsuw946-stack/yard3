/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { JournalArticle } from '../types';
import { Language } from '../i18n';
import { handleImageError } from '../constants';

interface JournalDetailProps {
  article: JournalArticle;
  onBack: () => void;
  currentLang?: Language;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ article, onBack, currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';

  return (
    <div className={`min-h-screen bg-[#0A0B10] pt-24 ${isAr ? 'text-right' : 'text-left'}`}>
       {/* Article Hero Banner */}
       <div className="w-full h-[50vh] md:h-[65vh] relative overflow-hidden border-b-2 border-[#FF007A]">
          <img loading="lazy" decoding="async" 
             src={article.image} 
             alt={article.title} 
             onError={handleImageError}
             className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-[#0A0B10]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-speedlines opacity-20 pointer-events-none"></div>
       </div>

       {/* Main Article Container */}
       <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-36 relative z-10 pb-32">
          <div className="bg-[#12131C] p-8 md:p-16 rounded-3xl border border-[#FF007A]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
             
             {/* Nav Header */}
             <div className="flex justify-between items-center mb-10 border-b border-[#FF007A]/30 pb-6">
                <button 
                  onClick={onBack}
                  className="group flex items-center gap-2 text-sm font-bold text-[#00F0FF] hover:text-white transition-colors"
                >
                  <span className="text-xl">{isAr ? '→' : '←'}</span>
                  <span>{isAr ? 'العودة إلى مجلة التحدي' : 'Back to Journal'}</span>
                </button>
                <span className="text-xs font-bold px-3 py-1 bg-[#1A1C2B] border border-[#FFE600] text-[#FFE600] rounded-full">
                  {article.date}
                </span>
             </div>

             {/* Title */}
             <h1 className="text-3xl md:text-5xl font-black font-anime text-white mb-10 leading-tight">
               {article.title}
             </h1>

             {/* Content */}
             <div className="prose prose-invert prose-lg max-w-none font-bold leading-relaxed text-gray-200">
               {typeof article.content === 'string' ? (
                 <div className="space-y-6 text-lg leading-relaxed text-[#D0D8ED] whitespace-pre-line">
                   {article.content}
                 </div>
               ) : (
                 article.content
               )}
             </div>
             
             {/* Footer Branding */}
             <div className="mt-16 pt-10 flex flex-col items-center gap-3 text-center">
                 <span className="text-3xl font-black font-anime text-[#FFE600]">
                   AURA CHAMPION // 限界突破
                 </span>
                 <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                   {isAr ? 'استمر في التمرين وتجاوز أرقامك القياسية كل يوم!' : 'KEEP TRAINING & SURPASS YOUR PERSONAL RECORDS EVERY DAY!'}
                 </span>
             </div>

          </div>
       </div>
    </div>
  );
};

export default JournalDetail;
