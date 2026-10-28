import React from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Zap,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

export interface CollapsibleAnimeSectionProps {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  badgeEn: string;
  badgeAr: string;
  badgeColor?: string; // hex color
  animeImage: string;
  currentLang?: Language;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  statEn?: string;
  statAr?: string;
}

export const CollapsibleAnimeSection: React.FC<CollapsibleAnimeSectionProps> = ({
  id,
  titleEn,
  titleAr,
  subtitleEn,
  subtitleAr,
  badgeEn,
  badgeAr,
  badgeColor = '#E50914',
  animeImage,
  currentLang = 'en',
  isOpen,
  onToggle,
  children,
  statEn,
  statAr
}) => {
  const isAr = currentLang === 'ar';

  const handleHeaderClick = () => {
    soundFX.playButtonClick();
    onToggle();
  };

  return (
    <section 
      id={id} 
      className="my-4 md:my-5 scroll-mt-24 max-w-[1700px] w-full max-w-full overflow-hidden overflow-x-hidden mx-auto px-2 sm:px-3 md:px-6 transition-all duration-300"
    >
      <div 
        className={`rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-400 ${
          isOpen 
            ? 'bg-[#0E101A] shadow-[0_15px_40px_rgba(0,0,0,0.85)]' 
            : 'bg-[#10121D]/90 shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(229,9,20,0.25)]'
        }`}
      >
        {/* Sleek, Compact Anime Header Card with Side Picture */}
        <div 
          onClick={handleHeaderClick}
          className="relative group cursor-pointer select-none p-3 sm:p-4 md:p-5 flex items-center justify-between gap-3 sm:gap-4 md:gap-6 bg-gradient-to-r from-[#121422] via-[#0E101A] to-[#141624] hover:bg-[#151728] transition-all"
        >
          {/* Subtle neon bottom accent */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity"
            style={{
              background: `linear-gradient(to right, transparent, ${badgeColor}, transparent)`
            }}
          ></div>

          {/* Left / Side Content: Anime Avatar Picture + Titles */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0 flex-1">
            
            {/* Clean Borderless High-Def Anime Avatar Image beside the section */}
            <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-lg group-hover:shadow-[0_0_20px_currentColor]"
              style={{
                color: badgeColor
              }}
            >
              <img loading="lazy" decoding="async" 
                src={animeImage} 
                alt={titleEn}
                onError={handleImageError}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              {/* Corner Pulsing Status Glow */}
              <div 
                className="absolute top-1 right-1 w-2 h-2 rounded-full animate-ping opacity-75"
                style={{ backgroundColor: badgeColor }}
              ></div>
            </div>

            {/* Section Info Text: Compact & Clean */}
            <div className="min-w-0 flex-1 text-start">
              
              {/* Badges line */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-black font-anime uppercase tracking-wider flex items-center gap-1 shadow-sm"
                  style={{
                    backgroundColor: `${badgeColor}25`,
                    color: badgeColor
                  }}
                >
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{isAr ? badgeAr : badgeEn}</span>
                </span>

                {(statEn || statAr) && (
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#181A28] text-gray-300 text-[10px] md:text-xs font-bold font-anime">
                    {isAr ? statAr : statEn}
                  </span>
                )}

                {isOpen && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#FFE600] font-bold font-anime">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="hidden md:inline">{isAr ? 'مفتوح' : 'ACTIVE'}</span>
                  </span>
                )}
              </div>

              {/* Section Main Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-black font-anime text-white group-hover:text-[#FFE600] transition-colors leading-snug truncate">
                {isAr ? titleAr : titleEn}
              </h3>

              {/* Subtitle / Description */}
              <p className="text-[11px] sm:text-xs text-gray-400 font-bold truncate max-w-xl mt-0.5">
                {isAr ? subtitleAr : subtitleEn}
              </p>
            </div>

          </div>

          {/* Right Side: Quick Compact Toggle Icon Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-black font-anime text-xs transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-md ${
                isOpen
                  ? 'bg-[#181A28] text-white border border-gray-600 hover:border-[#FFE600]'
                  : 'bg-gradient-to-r from-[#E50914] to-[#FFE600] text-black shadow-[0_0_15px_rgba(229,9,20,0.4)] group-hover:scale-105'
              }`}
            >
              {isOpen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span className="hidden sm:inline">{isAr ? 'طي القسم' : 'COLLAPSE'}</span>
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-black" />
                  <span className="hidden sm:inline">{isAr ? 'عرض القسم' : 'EXPAND'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-black animate-bounce" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Expandable Section Content Body */}
        {isOpen && (
          <div className="bg-[#0A0B10]/95 animate-fadeIn transition-all duration-300 w-full max-w-full overflow-hidden overflow-x-hidden">
            {children}
            
            {/* Quick collapse footer button at the bottom of the opened section */}
            <div className="py-3 px-4 bg-[#0A0B10] flex justify-center">
              <button
                type="button"
                onClick={handleHeaderClick}
                className="px-5 py-1.5 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-black font-anime text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5 text-[#FFE600]" />
                <span>{isAr ? 'طي هذا القسم لأعلى' : 'COLLAPSE SECTION'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
