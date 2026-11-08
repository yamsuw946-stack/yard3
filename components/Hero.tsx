/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { HERO_IMAGE, handleImageError } from '../constants';
import { Language, translations } from '../i18n';
import { soundFX } from '../services/soundFX';
import { Crown } from 'lucide-react';
import { OwnerConfigService } from '../services/ownerConfigService';

import { LiveAnimeHeroStage } from './LiveAnimeHeroStage';

interface HeroProps {
  currentLang?: Language;
  onYardClick?: () => void;
  onNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  onSelectView?: (viewId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ currentLang = 'en', onYardClick, onNavClick, onSelectView }) => {
  const [heroImage, setHeroImage] = useState<string>(() => 
    OwnerConfigService.getConfig().media.heroImage || HERO_IMAGE
  );

  useEffect(() => {
    const unsub = OwnerConfigService.subscribe((cfg) => {
      setHeroImage(cfg.media.heroImage || HERO_IMAGE);
    });
    return unsub;
  }, []);

  const t = (key: string) => translations[currentLang]?.[key] || translations['en']?.[key] || key;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(e, targetId);
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth"
      });
      
      try {
        window.history.pushState(null, '', `#${targetId}`);
      } catch (err) {
        // Ignore SecurityError in restricted environments
      }
    }
  };

  return (
    <section className="relative w-full max-w-full min-h-[90vh] lg:min-h-screen overflow-hidden overflow-x-hidden bg-transparent flex items-center pt-24 pb-16">
      
      {/* Background Anime Hero Character Asset & Shaolin Monastery Ambient Blend */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <img 
          src={heroImage} 
          alt="Superpowered Anime Warrior with Muscular Back and Japanese Strength Kanji Neck Tattoo" 
          onError={handleImageError}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-[70%_25%] md:object-[65%_30%] lg:object-[65%_35%] scale-105 animate-aura opacity-35 mix-blend-luminosity"
        />
        {/* Subtle Gradients to let the Shaolin Monastery shine through */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040508]/95 via-[#040508]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#040508] via-transparent to-[#040508]/80"></div>
        <div className="absolute inset-0 bg-speedlines mix-blend-overlay opacity-20"></div>
      </div>

      {/* Hero Content Grid: Left Text + Right Live Animated Anime Stage */}
      <div className="relative z-10 max-w-[1800px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-full">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
          
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622]/90 border border-gray-800 text-xs md:text-sm font-black text-white tracking-widest uppercase font-anime mb-6 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-ping"></span>
            <span>{t('hero_badge')}</span>
          </div>

          {/* Screaming Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-anime text-white leading-tight mb-6">
            {t('hero_title_1')}<span className="bg-gradient-to-r from-[#E50914] via-[#FFE600] to-white bg-clip-text text-transparent neon-text-red">{t('hero_title_2')}</span> <br />
            {t('hero_title_3')}<span className="text-[#FFE600] neon-text-yellow">{t('hero_title_4')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl text-[#D0D8ED] font-bold leading-relaxed mb-8 max-w-2xl">
            {t('hero_sub')}
          </p>

          {/* Stat Badges */}
          <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-xl">
            <div className="p-3 rounded-xl bg-[#141622]/80 border border-[#E50914]/40 backdrop-blur-md text-center">
              <span className="block text-2xl font-black text-[#E50914] font-anime">+9999</span>
              <span className="text-xs font-bold text-gray-300">{t('stat_power')}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#141622]/80 border border-white/30 backdrop-blur-md text-center">
              <span className="block text-2xl font-black text-white font-anime">100%</span>
              <span className="text-xs font-bold text-gray-300">{t('stat_focus')}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#141622]/80 border border-[#FFE600]/40 backdrop-blur-md text-center">
              <span className="block text-2xl font-black text-[#FFE600] font-anime">S-RANK</span>
              <span className="text-xs font-bold text-gray-300">{t('stat_rank')}</span>
            </div>
          </div>
          
          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <a 
              href="#products" 
              onClick={(e) => handleNavClick(e, 'products')}
              className="px-6 py-3.5 bg-gradient-to-r from-[#E50914] via-[#A8000A] to-[#FFE600] hover:from-[#FFE600] hover:to-[#E50914] text-white hover:text-black rounded-2xl text-base font-black font-anime shadow-[0_0_25px_#E50914] hover:shadow-[0_0_35px_#FFE600] transition-all duration-500 hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            >
              <span>{t('hero_btn_gear')}</span>
            </a>

            {onYardClick ? (
              <button 
                onClick={onYardClick}
                className="px-6 py-3.5 bg-[#141622]/90 hover:bg-[#1a1c2e] text-[#FFE600] border border-[#FFE600]/80 hover:border-[#FFE600] rounded-2xl text-base font-black font-anime shadow-[0_0_15px_rgba(255,230,0,0.3)] transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>{t('hero_btn_yard')}</span>
              </button>
            ) : (
              <a 
                href="#yardEngine" 
                onClick={(e) => handleNavClick(e, 'yardEngine')}
                className="px-6 py-3.5 bg-[#141622]/90 hover:bg-[#1a1c2e] text-[#FFE600] border border-[#FFE600]/80 hover:border-[#FFE600] rounded-2xl text-base font-black font-anime shadow-[0_0_15px_rgba(255,230,0,0.3)] transition-all duration-300 backdrop-blur-md"
              >
                <span>{t('hero_btn_yard')}</span>
              </a>
            )}

            {/* Direct Prominent Custom Athletic Club Gateway ($30 / Level 3) */}
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                if (onSelectView) {
                  onSelectView('customClub');
                } else {
                  window.location.hash = '#club';
                }
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-[#2c084f] via-[#480d7a] to-[#20053a] hover:from-[#480d7a] hover:to-[#2c084f] border border-[#6b21a8] text-white rounded-2xl text-base font-black font-anime shadow-[0_0_25px_rgba(76,29,149,0.7)] hover:shadow-[0_0_35px_rgba(107,33,168,0.9)] transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              title="My Custom Athletic Club ($30 / Level 3)"
            >
              <Crown className="w-4 h-4 text-[#FFE600] animate-pulse" />
              <span>MY ATHLETIC CLUB ($30)</span>
              <span className="text-[10px] bg-emerald-400 text-black px-1.5 py-0.5 rounded-full font-mono font-black">
                LVL 3
              </span>
            </button>
          </div>

          {/* Quick App Store & Google Play Download Shortcuts */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-black font-anime text-gray-400 uppercase tracking-wider block">
              📲 GET THE APP:
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  window.dispatchEvent(new CustomEvent('open-app-download'));
                }}
                className="px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black border border-white/20 hover:border-[#00F0FF] text-white flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <span className="text-sm"></span>
                <span>App Store</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  window.dispatchEvent(new CustomEvent('open-app-download'));
                }}
                className="px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black border border-white/20 hover:border-[#22C55E] text-white flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <span className="text-xs text-[#22C55E]">▶</span>
                <span>Google Play</span>
              </button>
            </div>
          </div>

          {/* Cyber HUD Direct Algorithm & Currency Quick-Access Dock */}
          <div className="mt-8 pt-6 w-full">
            <span className="text-[11px] font-black font-anime text-[#00F0FF] uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE600] animate-ping" />
              <span>CLINICAL ALGORITHMS &amp; PERFORMANCE HUBS:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Sleep Studies Launcher */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  if (onSelectView) onSelectView('sleepStudies');
                  else window.location.hash = '#sleepStudies';
                }}
                className="px-3 py-2.5 rounded-xl bg-[#141624]/90 hover:bg-[#1A1C30] border border-[#7000FF]/60 hover:border-[#7000FF] text-white flex items-center justify-center gap-2 text-xs font-black font-anime cursor-pointer transition-all shadow-[0_0_15px_rgba(112,0,255,0.3)] hover:scale-105 active:scale-95 group text-center"
              >
                <span className="text-sm">🌙</span>
                <span className="group-hover:text-[#00F0FF] transition-colors">
                  Sleep Lab
                </span>
              </button>

              {/* Injury Prediction Launcher */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  if (onSelectView) onSelectView('injuryPrediction');
                  else window.location.hash = '#injuryPrediction';
                }}
                className="px-3 py-2.5 rounded-xl bg-[#141624]/90 hover:bg-[#1A1C30] border border-[#E50914]/60 hover:border-[#E50914] text-white flex items-center justify-center gap-2 text-xs font-black font-anime cursor-pointer transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:scale-105 active:scale-95 group text-center"
              >
                <span className="text-sm">🛡️</span>
                <span className="group-hover:text-[#FFE600] transition-colors">
                  Injury ACWR
                </span>
              </button>

              {/* Exceptional Credential 4,200 YARDX */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  if (onSelectView) onSelectView('subscriberTiers');
                  else {
                    const el = document.getElementById('subscriber-tiers');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-3 py-2.5 rounded-xl bg-[#141624]/90 hover:bg-[#1A1C30] border border-[#FFE600]/60 hover:border-[#FFE600] text-[#FFE600] flex items-center justify-center gap-2 text-xs font-black font-anime cursor-pointer transition-all shadow-[0_0_15px_rgba(255,230,0,0.3)] hover:scale-105 active:scale-95 group text-center"
              >
                <span className="text-sm">🪙</span>
                <span className="group-hover:text-white transition-colors">
                  4,200 YARDX Card
                </span>
              </button>

              {/* Live Combat Arena */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  if (onSelectView) onSelectView('arena');
                  else window.location.hash = '#arena';
                }}
                className="px-3 py-2.5 rounded-xl bg-[#141624]/90 hover:bg-[#1A1C30] border border-[#00F0FF]/60 hover:border-[#00F0FF] text-white flex items-center justify-center gap-2 text-xs font-black font-anime cursor-pointer transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95 group text-center"
              >
                <span className="text-sm">⚔️</span>
                <span className="group-hover:text-[#00F0FF] transition-colors">
                  Combat Arena
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Live Animated Anime Champion Stage */}
        <div className="lg:col-span-5 w-full flex flex-col items-center">
          <LiveAnimeHeroStage 
            currentLang={currentLang}
            onExploreGear={() => {
              const el = document.getElementById('products');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full max-w-lg lg:max-w-none shadow-[0_0_50px_rgba(229,9,20,0.25)]"
          />
        </div>

      </div>
    </div>

  </section>
  );
};

export default Hero;
