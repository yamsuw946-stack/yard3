/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { JournalArticle } from '../types';
import { Language, tr } from '../i18n';
import { handleImageError } from '../constants';

interface JournalDetailProps {
  article: JournalArticle;
  onBack: () => void;
  currentLang?: Language;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ article, onBack, currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';

  return (
    <div className={`min-h-screen bg-[#07080C] pt-24 ${isAr ? 'text-right' : 'text-left'}`}>
      {/* Article Hero Banner */}
      <div className="w-full h-[50vh] md:h-[65vh] relative overflow-hidden border-b border-white/[0.08]">
        <img
          loading="lazy"
          decoding="async"
          src={article.image}
          alt={article.title}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/60 to-transparent" />
      </div>

      {/* Main Article Container */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-36 relative z-10 pb-32">
        <div className="bg-[#0C0E14] p-8 md:p-16 rounded-3xl border border-white/[0.1] shadow-2xl backdrop-blur-xl">
          {/* Nav Header */}
          <div className="flex justify-between items-center mb-10 border-b border-white/[0.08] pb-6">
            <button
              onClick={onBack}
              className="group flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
            >
              <span>{isAr ? '→' : '←'}</span>
              <span>{tr(currentLang, { en: 'Back to Journal', es: 'Volver al Diario', fr: 'Retour au Journal', ar: 'العودة إلى مجلة التحدي' })}</span>
            </button>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-[#121622] border border-[#D4AF37]/40 text-[#D4AF37] rounded-lg">
              {article.date}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-10 leading-tight">
            {article.title}
          </h1>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none leading-relaxed text-slate-200">
            {typeof article.content === 'string' ? (
              <div className="space-y-6 text-base md:text-lg leading-relaxed text-slate-300 whitespace-pre-line">
                {article.content}
              </div>
            ) : (
              article.content
            )}
          </div>

          {/* Footer Branding */}
          <div className="mt-16 pt-10 border-t border-white/[0.08] flex flex-col items-center gap-3 text-center">
            <span className="text-2xl font-extrabold font-mono text-[#D4AF37] tracking-wide">
              YARD 300 // PERFORMANCE JOURNAL
            </span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              {tr(currentLang, {
                en: 'PRECISION ENDURANCE & BIO-RECOVERY EXCELLENCE',
                es: 'EXCELENCIA EN RESISTENCIA Y BIORRECUPERACIÓN',
                fr: 'EXCELLENCE EN ENDURANCE ET BIO-RÉCUPÉRATION',
                ar: 'استمر في التمرين وتجاوز أرقامك القياسية كل يوم',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
