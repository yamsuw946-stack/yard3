/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { handleImageError } from '../constants';
import { JournalArticle } from '../types';
import { Language } from '../i18n';
import { OwnerConfigService } from '../services/ownerConfigService';

interface JournalProps {
  currentLang?: Language;
  onArticleClick: (article: JournalArticle) => void;
}

const Journal: React.FC<JournalProps> = ({ currentLang = 'en', onArticleClick }) => {
  const isAr = currentLang === 'ar';
  const [articles, setArticles] = useState<JournalArticle[]>(() => 
    OwnerConfigService.getActiveArticles(currentLang)
  );

  useEffect(() => {
    setArticles(OwnerConfigService.getActiveArticles(currentLang));
    const unsub = OwnerConfigService.subscribe(() => {
      setArticles(OwnerConfigService.getActiveArticles(currentLang));
    });
    return unsub;
  }, [currentLang]);

  return (
    <section id="journal" className="bg-[#0A0B10] py-24 px-6 md:px-12 relative overflow-hidden">
      
      <div className="max-w-[1800px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-8">
          <div>
            <span className="block text-xs font-black uppercase tracking-[0.2em] text-[#FFE600] mb-3">
              🔥 OFFICIAL YARD300 EDITORIAL // {isAr ? 'أسرار تدريب الساموراي وعقلية النخبة 2026' : 'WARRIOR JOURNAL & STRATEGY 2026'}
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-anime text-white">
              {isAr ? 'مجلة ' : 'YARD300 '}<span className="text-[#E50914] neon-text-red">{isAr ? 'المحارب والأبطال' : 'WARRIOR JOURNAL'}</span>
            </h2>
          </div>
          <p className="text-gray-300 font-bold text-sm max-w-md mt-4 md:mt-0">
            {isAr 
              ? 'مقالات حماسية واستراتيجيات تدريب رياضية قتالية متقدمة لتشغيل طاقة الهالة الشاملة وتجاوز الحدود البدنية.'
              : 'High-octane editorials and advanced combat training strategies to ignite your inner warrior and surpass limits.'}
          </p>
        </div>

        {/* Articles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className={`group cursor-pointer flex flex-col bg-[#12131C] rounded-2xl overflow-hidden transition-all duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(229,9,20,0.4)] hover:-translate-y-2 ${isAr ? 'text-right' : 'text-left'}`} 
              onClick={() => onArticleClick(article)}
            >
              <div className="w-full aspect-[16/10] overflow-hidden relative bg-[#181A28]">
                <img loading="lazy" decoding="async" 
                  src={article.image} 
                  alt={article.title} 
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} px-3 py-1 bg-[#0A0B10]/90 backdrop-blur-md rounded-full text-xs font-black text-[#FFE600] shadow-md`}>
                  {article.date}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-black font-anime text-white mb-4 group-hover:text-[#FFE600] transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-gray-300 font-bold text-sm leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto pt-4 flex items-center justify-between text-xs font-black font-anime text-[#FFE600] group-hover:text-white transition-colors">
                  <span>{isAr ? 'اقرأ المقال الكامل' : 'READ FULL ARTICLE'}</span>
                  <span className="text-[#E50914]">{isAr ? '←' : '→'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Journal;
