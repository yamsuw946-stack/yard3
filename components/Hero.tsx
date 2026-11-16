/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HERO_IMAGE, YARD_COMMUNITY_TRIO_IMAGE, handleImageError } from '../constants';
import { Language, translations, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { Crown, Moon, ShieldCheck, Award, Swords, ArrowUpRight, Trophy } from 'lucide-react';
import { OwnerConfigService } from '../services/ownerConfigService';

interface HeroProps {
  currentLang?: Language;
  onYardClick?: () => void;
  onNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  onSelectView?: (viewId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ currentLang = 'en', onYardClick, onNavClick, onSelectView }) => {
  const isAr = currentLang === 'ar';
  const [heroImage, setHeroImage] = useState<string>(() => {
    const saved = OwnerConfigService.getConfig().media.heroImage;
    if (!saved || saved.includes('anime_') || saved.includes('cyber_') || saved.includes('live_arena_') || saved.includes('ai_human_hero_athlete')) {
      return HERO_IMAGE;
    }
    return saved;
  });
  const [heroText, setHeroText] = useState(() => OwnerConfigService.getConfig().heroText || {});

  useEffect(() => {
    const unsub = OwnerConfigService.subscribe((cfg) => {
      const next = cfg.media.heroImage;
      if (!next || next.includes('anime_') || next.includes('cyber_') || next.includes('live_arena_') || next.includes('ai_human_hero_athlete')) {
        setHeroImage(HERO_IMAGE);
      } else {
        setHeroImage(next);
      }
      setHeroText(cfg.heroText || {});
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
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });

      try {
        window.history.pushState(null, '', `#${targetId}`);
      } catch {
        // Ignore SecurityError in restricted environments
      }
    }
  };

  return (
    <section className="relative w-full max-w-full overflow-hidden overflow-x-hidden bg-transparent flex items-center pt-20 pb-8 md:pt-24 md:pb-10">
      {/* Ambient Background Portrait of AI Bio-Enhanced Athlete */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <img
          src={heroImage}
          alt="YARD 300 AI Bio-Enhanced Elite Athlete"
          onError={handleImageError}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-top scale-105 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080C] via-[#07080C]/80 to-[#07080C]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-transparent to-[#07080C]/85" />
      </div>

      {/* Compact Editorial Grid: Left Executive Copy & Telemetry + Right AI Athlete Stage */}
      <div className="relative z-10 max-w-[1680px] w-full max-w-full mx-auto px-3 sm:px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full max-w-full">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            {/* Clean Eyebrow */}
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] mb-3">
              <span className="w-4 h-px bg-[#D4AF37]" />
              <span>{(isAr ? heroText.badgeAr : currentLang === 'en' ? heroText.badgeEn : undefined) || t('hero_badge')}</span>
            </div>

            {/* Compact Executive Display Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold font-anime text-white leading-[1.08] tracking-tight mb-3">
              {(isAr ? heroText.title1Ar : currentLang === 'en' ? heroText.title1En : undefined) || t('hero_title_1')}
              <span className="text-[#D4AF37]">{(isAr ? heroText.title2Ar : currentLang === 'en' ? heroText.title2En : undefined) || t('hero_title_2')}</span>
              <br />
              {(isAr ? heroText.title3Ar : currentLang === 'en' ? heroText.title3En : undefined) || t('hero_title_3')}
              <span className="text-slate-200">{(isAr ? heroText.title4Ar : currentLang === 'en' ? heroText.title4En : undefined) || t('hero_title_4')}</span>
            </h1>

            {/* Compact Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed mb-2.5 max-w-xl">
              {(isAr ? heroText.subtitleAr : currentLang === 'en' ? heroText.subtitleEn : undefined) || t('hero_sub')}
            </p>
            <p className="text-[11px] font-mono text-slate-400 leading-relaxed mb-4 max-w-xl">
              {tr(currentLang, {
                en: 'YARD 300 · ACWR Injury Lab · Sleep Recovery Science · Jan 5, 2027 10-Challenge Championship · Bazaruto Resort',
                es: 'YARD 300 · Lab Lesiones ACWR · Ciencia del Sueño · Campeonato 5 Ene 2027 · Resort Bazaruto',
                fr: 'YARD 300 · Labo Blessures ACWR · Science du Sommeil · Championnat 5 Jan 2027 · Resort Bazaruto',
                ar: 'YARD 300 · مختبر إصابات ACWR · علوم النوم والاستشفاء · بطولة التحديات الـ 10 (5 يناير 2027) · منتجع بازاروتو'
              })}
            </p>

            {/* Clean Hairline KPI Telemetry Strip */}
            <div className="grid grid-cols-3 gap-3 mb-5 w-full max-w-lg border-y border-white/[0.08] py-2.5">
              <div className="text-start">
                <span className="block text-lg sm:text-xl md:text-2xl font-bold text-[#D4AF37] font-mono tabular-nums">
                  {heroText.kpi1Value || '+9,999'}
                </span>
                <span className="text-[11px] font-medium text-slate-400 block truncate">
                  {t('stat_power')}
                </span>
              </div>
              <div className="text-start border-x border-white/[0.08] px-3">
                <span className="block text-lg sm:text-xl md:text-2xl font-bold text-white font-mono tabular-nums">
                  {heroText.kpi2Value || '100%'}
                </span>
                <span className="text-[11px] font-medium text-slate-400 block truncate">
                  {t('stat_focus')}
                </span>
              </div>
              <div className="text-start ps-2">
                <span className="block text-lg sm:text-xl md:text-2xl font-bold text-[#10B981] font-mono">
                  {heroText.kpi3Value || 'S-RANK'}
                </span>
                <span className="text-[11px] font-medium text-slate-400 block truncate">
                  {t('stat_rank')}
                </span>
              </div>
            </div>

            {/* Compact Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <a
                href="#products"
                onClick={(e) => handleNavClick(e, 'products')}
                className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all inline-flex items-center gap-1.5 shadow-md whitespace-nowrap"
              >
                <span>{t('hero_btn_gear')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {onYardClick ? (
                <button
                  onClick={onYardClick}
                  className="px-4 py-2.5 bg-[#0C0E14]/90 hover:bg-[#141722] text-white border border-white/[0.14] hover:border-[#D4AF37]/60 rounded-xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>{t('hero_btn_yard')}</span>
                </button>
              ) : (
                <a
                  href="#yardEngine"
                  onClick={(e) => handleNavClick(e, 'yardEngine')}
                  className="px-4 py-2.5 bg-[#0C0E14]/90 hover:bg-[#141722] text-white border border-white/[0.14] hover:border-[#D4AF37]/60 rounded-xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-md whitespace-nowrap"
                >
                  <span>{t('hero_btn_yard')}</span>
                </a>
              )}

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
                className="px-3.5 py-2.5 bg-[#12151E] hover:bg-[#191D29] border border-white/[0.12] hover:border-[#10B981]/50 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                title={tr(currentLang, {
                  en: 'My Custom Athletic Club ($30 / Level 3)',
                  es: 'Mi Club Atlético ($30 / Nivel 3)',
                  fr: 'Mon Club Athlétique ($30 / Niveau 3)',
                  ar: 'نادي الرياضيين الخاص ($30 / المستوى 3)'
                })}
              >
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {tr(currentLang, {
                    en: 'MY ATHLETIC CLUB ($30)',
                    es: 'MI CLUB ATLÉTICO ($30)',
                    fr: 'MON CLUB ATHLÉTIQUE ($30)',
                    ar: 'نادي الرياضيين ($30)'
                  })}
                </span>
                <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 px-1.5 py-0.5 rounded font-mono font-bold">
                  LVL 3
                </span>
              </button>
            </div>

            {/* App Store & Google Play Compact Links */}
            <div className="pt-0.5 flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {tr(currentLang, {
                  en: 'MOBILE ECOSYSTEM:',
                  es: 'ECOSISTEMA MÓVIL:',
                  fr: 'ÉCOSYSTÈME MOBILE :',
                  ar: 'تطبيق الجوال:'
                })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    window.dispatchEvent(new CustomEvent('open-app-download'));
                  }}
                  className="px-3 py-1 rounded-lg bg-[#0C0E14] hover:bg-[#141722] border border-white/[0.1] hover:border-white/25 text-slate-200 flex items-center gap-1.5 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <span className="text-xs leading-none"></span>
                  <span>App Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    window.dispatchEvent(new CustomEvent('open-app-download'));
                  }}
                  className="px-3 py-1 rounded-lg bg-[#0C0E14] hover:bg-[#141722] border border-white/[0.1] hover:border-white/25 text-slate-200 flex items-center gap-1.5 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <span className="text-[10px] text-[#10B981]">▶</span>
                  <span>Google Play</span>
                </button>
              </div>
            </div>

            {/* Clinical Algorithms Quick-Access Dock */}
            <div className="mt-5 pt-4 border-t border-white/[0.06] w-full">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.14em] block mb-2.5">
                {tr(currentLang, {
                  en: 'CLINICAL ALGORITHMS & PERFORMANCE HUBS',
                  es: 'ALGORITMOS CLÍNICOS Y CENTROS DE RENDIMIENTO',
                  fr: 'ALGORITHMES CLINIQUES & PÔLES DE PERFORMANCE',
                  ar: 'المختبرات السريرية ومراكز الأداء'
                })}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    if (onSelectView) onSelectView('sleepStudies');
                    else window.location.hash = '#sleepStudies';
                  }}
                  className="px-2.5 py-2 rounded-xl bg-[#0C0E14]/90 hover:bg-[#141722] border border-white/[0.08] hover:border-[#D4AF37]/50 text-slate-200 hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                >
                  <Moon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span className="truncate">
                    {tr(currentLang, {
                      en: 'Sleep Lab',
                      es: 'Lab Sueño',
                      fr: 'Labo Sommeil',
                      ar: 'مختبر النوم'
                    })}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    if (onSelectView) onSelectView('injuryPrediction');
                    else window.location.hash = '#injuryPrediction';
                  }}
                  className="px-2.5 py-2 rounded-xl bg-[#0C0E14]/90 hover:bg-[#141722] border border-white/[0.08] hover:border-[#10B981]/50 text-slate-200 hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span className="truncate">
                    {tr(currentLang, {
                      en: 'Injury ACWR',
                      es: 'Riesgo ACWR',
                      fr: 'Risque ACWR',
                      ar: 'مؤشر الإصابات'
                    })}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    if (onSelectView) onSelectView('leaderboard');
                    else window.location.hash = '#leaderboard';
                  }}
                  className="px-2.5 py-2 rounded-xl bg-[#0C0E14]/90 hover:bg-[#141722] border border-[#10B981]/30 hover:border-[#10B981] text-[#10B981] hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                >
                  <Trophy className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span className="truncate">
                    {tr(currentLang, {
                      en: 'Champions',
                      es: 'Campeones',
                      fr: 'Champions',
                      ar: 'المتصدرون'
                    })}
                  </span>
                </button>

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
                  className="px-2.5 py-2 rounded-xl bg-[#0C0E14]/90 hover:bg-[#141722] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[#D4AF37] hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all font-mono tabular-nums whitespace-nowrap"
                >
                  <Award className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>4,200 YARDX</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    if (onSelectView) onSelectView('arena');
                    else window.location.hash = '#arena';
                  }}
                  className="col-span-2 sm:col-span-1 px-2.5 py-2 rounded-xl bg-[#0C0E14]/90 hover:bg-[#141722] border border-white/[0.08] hover:border-white/30 text-slate-200 hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                >
                  <Swords className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="truncate">
                    {tr(currentLang, {
                      en: 'Combat Arena',
                      es: 'Arena Viva',
                      fr: 'Arène Combat',
                      ar: 'حلبة الأداء'
                    })}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Bespoke YARD Athletic Community Trio Showcase */}
          <div className="lg:col-span-5 w-full flex flex-col">
            <div
              className={`w-full rounded-2xl bg-[#0B0E14]/95 border border-white/[0.1] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.75)] backdrop-blur-xl ${
                isAr ? 'text-right' : 'text-left'
              }`}
            >
              {/* Crisp 4:3 Photorealistic Community Trio Portrait */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#07080C]">
                <img
                  src={YARD_COMMUNITY_TRIO_IMAGE}
                  alt={tr(currentLang, {
                    en: 'YARD 300 Athletic Community — Built on Real Effort',
                    es: 'Comunidad Atlética YARD 300 — Basada en el Esfuerzo Real',
                    fr: 'Communauté Athlétique YARD 300 — Fondée sur l’Effort Réel',
                    ar: 'مجتمع يارد الرياضي — جميع المستويات تعتمد على الجهد المبذول'
                  })}
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/25 to-transparent" />
              </div>

              {/* Executive Community Manifesto Panel */}
              <div className="p-5 sm:p-6 space-y-3.5 -mt-6 relative z-10">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                  <span className="w-4 h-px bg-[#D4AF37]" />
                  <span>
                    {tr(currentLang, {
                      en: 'YARD COMMUNITY · EFFORT-DRIVEN MERITOCRACY',
                      es: 'COMUNIDAD YARD · MÉRITO POR ESFUERZO REAL',
                      fr: 'COMMUNAUTÉ YARD · MÉRITE PAR L’EFFORT RÉEL',
                      ar: 'مجتمع يارد · جميع المستويات تعتمد على الجهد المبذول'
                    })}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {tr(currentLang, {
                    en: 'Built for Athletes & Driven Achievers Seeking Peak Energy',
                    es: 'Creado para Atletas y Apasionados por Su Máxima Energía',
                    fr: 'Conçu pour les Athlètes & Passionnés Visant leur Plein Potentiel',
                    ar: 'مجتمع يارد الفريد — للرياضيين والشغوفين بالوصول لأعلى طاقتهم'
                  })}
                </h2>

                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                  {tr(currentLang, {
                    en: 'YARD is a one-of-a-kind community where every level is earned strictly through real effort — uniting sport, adventure, luxury, digital investment, and live athletic events for dedicated athletes striving toward peak energy and capability.',
                    es: 'YARD es una comunidad única en su clase donde todos los niveles dependen del esfuerzo real; reúne deporte, aventura, lujo, inversión digital y eventos deportivos para atletas y apasionados por alcanzar su máxima energía y capacidad.',
                    fr: 'YARD est une communauté unique où chaque niveau repose exclusivement sur l’effort fourni — réunissant sport, aventure, luxe, investissement numérique et événements sportifs pour les athlètes et passionnés visant leur plus haute énergie et capacité physique.',
                    ar: 'مجتمع يارد مجتمع فريد من نوعه، كل المستويات فيه تعتمد على الجهد المبذول؛ يجمع بين الرياضة والمغامرة والفخامة والاستثمار الرقمي والفعاليات الرياضية، وهو مكان مخصص للرياضيين والشغوفين بالوصول إلى أعلى طاقتهم وقدرتهم الرياضية.'
                  })}
                </p>

                {/* Clean Architectural Pillars */}
                <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-mono text-slate-300">
                  <span className="text-[#D4AF37] font-semibold">
                    {tr(currentLang, { en: 'Sport', es: 'Deporte', fr: 'Sport', ar: 'الرياضة' })}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span>
                    {tr(currentLang, { en: 'Adventure', es: 'Aventura', fr: 'Aventure', ar: 'المغامرة' })}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-[#10B981] font-semibold">
                    {tr(currentLang, { en: 'Luxury', es: 'Lujo', fr: 'Luxe', ar: 'الفخامة' })}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span>
                    {tr(currentLang, { en: 'Digital Investment', es: 'Inversión Digital', fr: 'Investissement Digital', ar: 'الاستثمار الرقمي' })}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span>
                    {tr(currentLang, { en: 'Athletic Events', es: 'Eventos', fr: 'Événements', ar: 'الفعاليات الرياضية' })}
                  </span>
                </div>

                {/* Single-line Clean Action Buttons */}
                <div className="pt-1 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playButtonClick();
                      if (onSelectView) {
                        onSelectView('subscriberTiers');
                      } else {
                        const el = document.getElementById('subscriber-tiers');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>
                      {tr(currentLang, {
                        en: 'Membership Levels',
                        es: 'Ver Niveles',
                        fr: 'Voir les Niveaux',
                        ar: 'استعراض المستويات'
                      })}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playButtonClick();
                      if (onSelectView) onSelectView('tickets');
                      else window.location.hash = '#tickets';
                    }}
                    className="py-2.5 px-4 rounded-xl bg-[#121622] hover:bg-[#191E2E] text-white border border-white/[0.12] hover:border-[#10B981]/50 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {tr(currentLang, {
                      en: 'Championships',
                      es: 'Campeonatos',
                      fr: 'Championnats',
                      ar: 'الفعاليات'
                    })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
