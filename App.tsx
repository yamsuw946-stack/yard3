/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import About from './components/About';
import Journal from './components/Journal';
import Assistant from './components/Assistant';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import JournalDetail from './components/JournalDetail';
import CartDrawer from './components/CartDrawer';
import { MobileAppNotice } from './components/MobileAppNotice';
import { Leaderboard } from './components/Leaderboard';
import { AIAnimeCoach } from './components/AIAnimeCoach';
import { CombatArena } from './components/CombatArena';
import { SectionHubNav, SectionHubId } from './components/SectionHubNav';
import { InteractiveCharacterStage } from './components/InteractiveCharacterStage';
import { LaunchAnnouncementModal } from './components/LaunchAnnouncementModal';
import { CollapsibleAnimeSection } from './components/CollapsibleAnimeSection';
import { LiveChallengesArena } from './components/LiveChallengesArena';
import { MetaMaskModal } from './components/MetaMaskModal';
import AppDownloadModal from './components/AppDownloadModal';
import { SharedAuraModal } from './components/SharedAuraModal';
import { FoundersAndCommunity } from './components/FoundersAndCommunity';
import { AuthModal } from './components/AuthModal';
import { GlobalSponsorsShowcase } from './components/GlobalSponsorsShowcase';
import { BazarutoResortSanctuary } from './components/BazarutoResortSanctuary';

// High-Performance Code-Split Lazy Loaded Subviews for Ultra-Fast Mobile & Desktop Loading
const Checkout = React.lazy(() => import('./components/Checkout'));
const Profile = React.lazy(() => import('./components/Profile'));
const AuraVisualizer = React.lazy(() => import('./components/AuraVisualizer'));
const YardCombatEngine = React.lazy(() => import('./components/YardCombatEngine'));
const SleepStudiesAlgorithm = React.lazy(() => import('./components/SleepStudiesAlgorithm'));
const InjuryPredictionAlgorithm = React.lazy(() => import('./components/InjuryPredictionAlgorithm'));
const SubscriberTiersShowcase = React.lazy(() => import('./components/SubscriberTiersShowcase'));
const ChampionStoryHub = React.lazy(() => import('./components/ChampionStoryHub'));
const CreatorClubHub = React.lazy(() => import('./components/CreatorClubHub').then(m => ({ default: m.CreatorClubHub })));
const YardGlobalCamp = React.lazy(() => import('./components/YardGlobalCamp'));
const OwnerDashboard = React.lazy(() => import('./components/OwnerDashboard').then(m => ({ default: m.OwnerDashboard })));
const OptionsServicesHub = React.lazy(() => import('./components/OptionsServicesHub').then(m => ({ default: m.OptionsServicesHub })));
const TicketsEventsHub = React.lazy(() => import('./components/TicketsEventsHub').then(m => ({ default: m.TicketsEventsHub })));
import { OwnerConfigService } from './services/ownerConfigService';
import { ShaolinMonasteryBackground } from './components/ShaolinMonasteryBackground';
import { getSharedAuraFromUrl, SharedAuraData } from './services/shareAuraService';
import { 
  HERO_IMAGE, 
  SAMURAI_RONIN_IMAGE, 
  NINJA_KUNOICHI_IMAGE, 
  LIVE_ARENA_IMAGE, 
  AI_COACH_IMAGE, 
  VALKYRIE_NEON_IMAGE, 
  TARIK_SAIYAN_IMAGE, 
  ABOUT_SQUAD_IMAGE, 
  JOURNAL_GEAR_IMAGE 
} from './constants';
import { Product, JournalArticle, ViewState } from './types';
import { Language, LANGUAGES } from './i18n';
import { soundFX } from './services/soundFX';

// Sleek Cyber Chamber Loading Fallback
const CyberLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-black/80 border-2 border-emerald-500/60 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse">
      <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
    <span className="text-xs font-mono font-black text-emerald-400 tracking-widest uppercase">
      LOADING YARD 300 CHAMBER...
    </span>
  </div>
);

function App() {
  const [view, setView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('club') || search.includes('club')) {
        return { type: 'customClub' };
      }
      if (hash === '#owner' || hash === '#admin') {
        return { type: 'ownerDashboard' };
      }
    }
    return { type: 'home' };
  });
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAppDownloadOpen, setIsAppDownloadOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('yard300_lang');
    if (saved === 'en' || saved === 'es' || saved === 'fr') {
      return saved as Language;
    }
    // Official language is English by default (English, Español, Français)
    localStorage.setItem('yard300_lang', 'en');
    return 'en';
  });
  // Permanent Cyber Night Black Mode - Day/Night toggle disabled per user request
  const theme: 'dark' = 'dark';

  // Focused Interactive Hub Section State
  const [activeSection, setActiveSection] = useState<SectionHubId | null>('yardEngine');
  const [showAllSections, setShowAllSections] = useState<boolean>(false);
  const [isMetaMaskOpen, setIsMetaMaskOpen] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(() => {
    return localStorage.getItem('yard300_wallet_address');
  });
  const [sharedAuraGuestData, setSharedAuraGuestData] = useState<SharedAuraData | null>(() => {
    return getSharedAuraFromUrl();
  });
  const [isOwner, setIsOwner] = useState<boolean>(() => OwnerConfigService.isOwnerLoggedIn());
  const [ownerInfo, setOwnerInfo] = useState(() => OwnerConfigService.getOwnerInfo());

  // Listen for url changes that may contain shared aura tokens or owner auth changes
  useEffect(() => {
    const checkAuraInUrl = () => {
      const data = getSharedAuraFromUrl();
      if (data) {
        setSharedAuraGuestData(data);
      }
    };
    const handleAuthChange = () => {
      setIsOwner(OwnerConfigService.isOwnerLoggedIn());
      setOwnerInfo(OwnerConfigService.getOwnerInfo());
    };
    const handleOpenAuth = () => {
      setIsAuthModalOpen(true);
    };
    const handleCartClear = () => {
      setCartItems([]);
    };
    window.addEventListener('hashchange', checkAuraInUrl);
    window.addEventListener('popstate', checkAuraInUrl);
    window.addEventListener('yard300_owner_auth_changed', handleAuthChange);
    window.addEventListener('yard300_open_auth', handleOpenAuth);
    window.addEventListener('yard300_cart_clear', handleCartClear);
    return () => {
      window.removeEventListener('hashchange', checkAuraInUrl);
      window.removeEventListener('popstate', checkAuraInUrl);
      window.removeEventListener('yard300_owner_auth_changed', handleAuthChange);
      window.removeEventListener('yard300_open_auth', handleOpenAuth);
      window.removeEventListener('yard300_cart_clear', handleCartClear);
    };
  }, []);

  // Collapsible state for each individual section: default open active section (yardEngine), others neat & collapsed to eliminate clutter
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    yardEngine: true,
    'aura-visualizer': false,
    arena: false,
    'ai-coach': false,
    products: false,
    leaderboard: false,
    about: false,
    journal: false,
  });

  const toggleSection = (secId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  const handleToggleAllSections = () => {
    const anyClosed = Object.values(openSections).some(v => !v);
    const newTarget = anyClosed; // if any closed, expand all; otherwise collapse all except core
    setOpenSections({
      yardEngine: true,
      'aura-visualizer': newTarget,
      arena: newTarget,
      'ai-coach': newTarget,
      products: newTarget,
      leaderboard: newTarget,
      about: newTarget,
      journal: newTarget,
    });
    setShowAllSections(newTarget);
  };

  useEffect(() => {
    localStorage.setItem('yard300_lang', currentLang);
    const langInfo = LANGUAGES.find(l => l.code === currentLang);
    const dir = langInfo?.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Enforce pure obsidian cyber night mode permanently
  useEffect(() => {
    localStorage.setItem('yard300_theme', 'dark');
    document.documentElement.classList.remove('light-theme');
    document.body.classList.remove('light-theme');
  }, []);

  // Initial Hash Detection & Hash Change Navigation (e.g., #club, #yardEngine)
  useEffect(() => {
    const handleHashNav = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (rawHash) {
        if (rawHash.toLowerCase().includes('club')) {
          setView({ type: 'customClub' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (rawHash === 'tiers' || rawHash === 'subscriberTiers') {
          setView({ type: 'subscriberTiers' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (rawHash === 'options') {
          setView({ type: 'options' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (view.type !== 'home') {
          setView({ type: 'home' });
          setTimeout(() => scrollToSection(rawHash), 150);
        } else {
          scrollToSection(rawHash);
        }
      }
    };

    const timer = setTimeout(handleHashNav, 150);
    window.addEventListener('hashchange', handleHashNav);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleHashNav);
    };
  }, []);

  // Global click sound effects for all interactive elements
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const interactive = target.closest('button, a[href], select, [role="button"], input[type="button"], input[type="submit"]');
      if (interactive) {
        soundFX.playButtonClick();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Mobile App Download Modal Event Listener
  useEffect(() => {
    const handleOpenAppDownload = () => {
      setIsAppDownloadOpen(true);
    };
    window.addEventListener('open-app-download', handleOpenAppDownload);
    return () => window.removeEventListener('open-app-download', handleOpenAppDownload);
  }, []);

  // Handle navigation (clicks on Navbar or Footer links)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!targetId || targetId === 'home') {
      setView({ type: 'home' });
      return;
    }

    // Map targetId directly to its dedicated page view
    const viewMap: Record<string, ViewState> = {
      yardEngine: { type: 'yardEngine' },
      'aura-visualizer': { type: 'auraVisualizer' },
      auraVisualizer: { type: 'auraVisualizer' },
      arena: { type: 'arena' },
      combatArena: { type: 'arena' },
      'ai-coach': { type: 'aiCoach' },
      aiCoach: { type: 'aiCoach' },
      products: { type: 'products' },
      leaderboard: { type: 'leaderboard' },
      about: { type: 'about' },
      tickets: { type: 'tickets' },
      championStory: { type: 'championStory' },
      journal: { type: 'championStory' },
      profile: { type: 'profile' },
      options: { type: 'options' },
      sleepStudies: { type: 'sleepStudies' },
      injuryPrediction: { type: 'injuryPrediction' },
      subscriberTiers: { type: 'subscriberTiers' },
      customClub: { type: 'customClub' },
      creatorClub: { type: 'customClub' },
      club: { type: 'customClub' },
      yardCamp: { type: 'yardCamp' },
      camp: { type: 'yardCamp' },
      bazaruto: { type: 'bazaruto' },
      resort: { type: 'bazaruto' },
      owner: { type: 'ownerDashboard' },
      admin: { type: 'ownerDashboard' },
      dashboard: { type: 'ownerDashboard' },
      ownerDashboard: { type: 'ownerDashboard' }
    };

    if (targetId === 'founders' || targetId === 'community') {
      setView({ type: 'home' });
      setTimeout(() => {
        const el = document.getElementById('community');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    if (viewMap[targetId]) {
      setView(viewMap[targetId]);
      return;
    }

    setView({ type: 'home' });
    setTimeout(() => scrollToSection(targetId), 100);
  };

  const handleSelectHubSection = (id: SectionHubId | string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (id === 'customClub') {
      setView({ type: 'customClub' });
      return;
    }
    if (id === 'yardCamp') {
      setView({ type: 'yardCamp' });
      return;
    }
    if (id === 'bazaruto' || id === 'resort') {
      setView({ type: 'bazaruto' });
      return;
    }
    if (id === 'profile') {
      setView({ type: 'profile' });
      return;
    }
    if (id === 'sleepStudies') {
      setView({ type: 'sleepStudies' });
      return;
    }
    if (id === 'injuryPrediction') {
      setView({ type: 'injuryPrediction' });
      return;
    }
    if (id === 'subscriberTiers') {
      setView({ type: 'subscriberTiers' });
      return;
    }
    if (id === 'yardEngine') {
      setView({ type: 'yardEngine' });
      return;
    }
    if (id === 'auraVisualizer') {
      setView({ type: 'auraVisualizer' });
      return;
    }
    if (id === 'combatArena') {
      setView({ type: 'arena' });
      return;
    }
    if (id === 'aiCoach') {
      setView({ type: 'aiCoach' });
      return;
    }
    if (id === 'products') {
      if (view.type !== 'home') {
        setView({ type: 'home' });
        setTimeout(() => scrollToSection('products'), 150);
      } else {
        scrollToSection('products');
      }
      return;
    }
    if (id === 'tickets') {
      setView({ type: 'tickets' });
      return;
    }
    if (id === 'leaderboard') {
      setView({ type: 'leaderboard' });
      return;
    }
    if (id === 'about') {
      setView({ type: 'about' });
      return;
    }
    if (id === 'championStory' || id === 'journal') {
      setView({ type: 'championStory' });
      return;
    }

    setActiveSection(id as SectionHubId);
  };

  const scrollToSection = (targetId: string) => {
    if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    const element = document.getElementById(targetId);
    if (element) {
      // Manual scroll calculation to account for fixed header
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

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
  };

  const handleYardClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView({ type: 'yardEngine' });
  };

  const isRTL = currentLang === 'ar';

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden bg-[#000000] font-sans text-[#F0F4FF] selection:bg-[#E50914] selection:text-white relative ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      
      {/* Dynamic Animated Shaolin Training Monastery Background */}
      <ShaolinMonasteryBackground currentLang={currentLang} />

      {/* 20-Day Official Launch Announcement Google-Style Dismissible Popup Ad */}
      <LaunchAnnouncementModal currentLang={currentLang} />

      {view.type !== 'checkout' && (
        <Navbar 
            onNavClick={handleNavClick} 
            cartCount={cartItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            onProfileClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'profile' });
            }}
            onYardClick={handleYardClick}
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            onOpenMetaMask={() => setIsMetaMaskOpen(true)}
            walletAddress={walletAddress}
            onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}
      
      <main className="w-full max-w-full overflow-x-hidden">
        {view.type === 'home' && (
          <>
            <Hero 
              currentLang={currentLang} 
              onYardClick={handleYardClick} 
              onNavClick={handleNavClick}
              onSelectView={(target) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (target === 'customClub' || target === 'club') setView({ type: 'customClub' });
                else if (target === 'sleepStudies') setView({ type: 'sleepStudies' });
                else if (target === 'injuryPrediction') setView({ type: 'injuryPrediction' });
                else if (target === 'arena') setView({ type: 'arena' });
                else if (target === 'subscriberTiers') {
                  const el = document.getElementById('subscriber-tiers');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            
            {/* Visual Anchor & Interactive Experience Container */}
            <div className="max-w-[1800px] w-full max-w-full overflow-x-hidden mx-auto px-4 md:px-8 space-y-16">
              
              {/* 1. Subscriber Tiers & Earned Credentials Showcase (4 Levels) */}
              <SubscriberTiersShowcase currentLang={currentLang} />

              {/* Official Global Sponsors & Sports Performance Partners (Adidas, Red Bull, WHOOP, MMA Federation, Tiger Muay Thai) */}
              <GlobalSponsorsShowcase currentLang={currentLang} />

              {/* 2. Interactive Clinical Algorithms Launcher (Sleep Studies & ACWR Injury Prediction) */}
              <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#121422] via-[#0E101A] to-[#161826] shadow-[0_0_40px_rgba(0,240,255,0.2)]">
                <div className="max-w-3xl mb-8 space-y-2">
                  <span className="px-3 py-1 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] text-xs font-black font-anime uppercase tracking-wider">
                    ⚡ {currentLang === 'ar' ? 'الخوارزميات السريرية والبيومترية' : 'CLINICAL ALGORITHMIC LABS'}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black font-anime text-white">
                    {currentLang === 'ar' ? 'خوارزمية دراسات النوم ونموذج التنبؤ بالإصابات' : 'Sleep Studies & Biomechanical Injury Prediction'}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-300 font-bold leading-relaxed">
                    {currentLang === 'ar' 
                      ? 'أدوات حسابية تفاعلية تحلل دورات النوم العميق واستشفاء هرمون النمو، وتتنبأ بمخاطر التمزقات العضلية وفق معيار الحمل الحاد والمزمن (ACWR).'
                      : 'Interactive precision algorithms calculating Stage-3 deep sleep GH synthesis, sleep debt, and 7-day predictive soft-tissue strain risk.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sleep Studies Launcher Card */}
                  <div className="p-6 rounded-2xl bg-[#141624] transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black font-anime text-[#00F0FF] uppercase tracking-wider block">
                        CLINICAL SLEEP LAB
                      </span>
                      <h4 className="text-xl font-black font-anime text-white">
                        {currentLang === 'ar' ? 'خوارزمية دراسات النوم وهندسة التعافي' : 'Sleep Architecture & Recovery Lab'}
                      </h4>
                      <p className="text-xs text-gray-300 font-bold">
                        {currentLang === 'ar' ? 'تحليل أطوار النوم العميق NREM3 و REM والدين التراكمي وجاهزية الجهاز العصبي.' : 'Evaluate deep sleep stages, REM reflex consolidation, and athletic sleep debt.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setView({ type: 'sleepStudies' });
                      }}
                      className="w-full py-3 rounded-xl bg-[#7000FF] hover:bg-[#8519ff] text-white font-black font-anime text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(112,0,255,0.4)]"
                    >
                      <span>{currentLang === 'ar' ? 'تشغيل خوارزمية النوم' : 'Launch Sleep Algorithm'}</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Injury Prediction Launcher Card */}
                  <div className="p-6 rounded-2xl bg-[#141624] transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black font-anime text-[#E50914] uppercase tracking-wider block">
                        GABBETT ACWR ENGINE
                      </span>
                      <h4 className="text-xl font-black font-anime text-white">
                        {currentLang === 'ar' ? 'خوارزمية التنبؤ بالإصابات وتوازن الحمل' : 'Biomechanical Injury Prediction'}
                      </h4>
                      <p className="text-xs text-gray-300 font-bold">
                        {currentLang === 'ar' ? 'تتبع الحمل الحاد والمزمن، إجهاد الأوتار، ومعامل الإصابات السابقة لحماية مفاصل الأبطال.' : 'Acute:chronic workload ratio analysis, tendon strain alerts, and preventative conditioning.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setView({ type: 'injuryPrediction' });
                      }}
                      className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#ff1a26] text-white font-black font-anime text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                    >
                      <span>{currentLang === 'ar' ? 'تشغيل خوارزمية الإصابات' : 'Launch Injury Algorithm'}</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Live Challenges & Randomized Trials Arena Showcase */}
              <LiveChallengesArena 
                currentLang={currentLang}
                onEnterArena={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'arena' });
                }}
              />

              {/* 4. Captivating Character Dojo & Hero Roster (Displaying Supreme Anime Artistry) */}
              <InteractiveCharacterStage 
                currentLang={currentLang} 
                onExploreSection={(secId) => handleSelectHubSection(secId as SectionHubId)}
              />

              {/* 5. YARD Bio-Recovery & Injury Therapy Resort (Bazaruto Archipelago Sanctuary) */}
              <BazarutoResortSanctuary 
                currentLang={currentLang} 
                onExploreEvents={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'tickets' });
                }}
              />

              {/* 6. The Visionary Founders Showcase (Yam Suw, MTK, ARB) */}
              <FoundersAndCommunity currentLang={currentLang} />

            </div>

            <MobileAppNotice currentLang={currentLang} />
          </>
        )}

<React.Suspense fallback={<CyberLoadingFallback />}>
        {view.type === 'yardEngine' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] text-[#00F0FF] hover:text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <YardCombatEngine 
              currentLang={currentLang} 
              onNavigateToProfile={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'profile' });
              }}
            />
          </div>
        )}

        {view.type === 'arena' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] text-[#00F0FF] hover:text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <CombatArena currentLang={currentLang} />
          </div>
        )}

        {view.type === 'aiCoach' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] text-[#00F0FF] hover:text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <AIAnimeCoach currentLang={currentLang} />
          </div>
        )}

        {view.type === 'products' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] text-[#00F0FF] hover:text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all shadow-md"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : currentLang === 'fr' ? "← Retour à l'Accueil" : currentLang === 'es' ? '← Volver al Inicio' : '← Back to Home'}</span>
              </button>
            </div>
            <ProductGrid 
              currentLang={currentLang}
              onProductClick={(p) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'product', product: p, previousView: 'products' });
              }} 
            />
          </div>
        )}

        {view.type === 'leaderboard' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] text-[#00F0FF] hover:text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <Leaderboard currentLang={currentLang} />
          </div>
        )}

        {view.type === 'about' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] text-[#00F0FF] hover:text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <About currentLang={currentLang} />
          </div>
        )}

        {view.type === 'auraVisualizer' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] text-[#00F0FF] hover:text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <AuraVisualizer 
              currentLang={currentLang}
              onNavigateToProfile={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'profile' });
              }}
            />
          </div>
        )}

        {view.type === 'product' && (
          <ProductDetail 
            product={view.product} 
            currentLang={currentLang}
            onBack={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              if (view.previousView === 'options') {
                setView({ type: 'options' });
              } else {
                setView({ type: 'products' });
              }
            }}
            onAddToCart={addToCart}
          />
        )}

        {view.type === 'journal' && (
          <JournalDetail 
            article={view.article} 
            currentLang={currentLang}
            onBack={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'home' });
              setTimeout(() => scrollToSection('journal'), 50);
            }}
          />
        )}

        {view.type === 'profile' && (
          <Profile 
            currentLang={currentLang}
            onBack={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'home' });
            }}
            onOpenAuraVisualizer={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'auraVisualizer' });
            }}
            onNavigateToEngine={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'yardEngine' });
            }}
            onNavigateToClub={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'customClub' });
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {view.type === 'options' && (
          <OptionsServicesHub 
            currentLang={currentLang}
            onBackToHome={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'home' });
            }}
            onSelectProduct={(p) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'product', product: p, previousView: 'options' });
            }}
            onSelectOption={(optionId) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              const viewMap: Record<string, ViewState> = {
                yardEngine: { type: 'yardEngine' },
                auraVisualizer: { type: 'auraVisualizer' },
                arena: { type: 'arena' },
                'ai-coach': { type: 'aiCoach' },
                aiCoach: { type: 'aiCoach' },
                products: { type: 'products' },
                tickets: { type: 'tickets' },
                checkout: { type: 'checkout' },
                leaderboard: { type: 'leaderboard' },
                about: { type: 'about' },
                championStory: { type: 'championStory' },
                journal: { type: 'championStory' },
                profile: { type: 'profile' },
                sleepStudies: { type: 'sleepStudies' },
                injuryPrediction: { type: 'injuryPrediction' },
                subscriberTiers: { type: 'subscriberTiers' },
                customClub: { type: 'customClub' },
                creatorClub: { type: 'customClub' },
                club: { type: 'customClub' },
                yardCamp: { type: 'yardCamp' },
                camp: { type: 'yardCamp' }
              };
              if (viewMap[optionId]) {
                setView(viewMap[optionId]);
              } else {
                setView({ type: 'home' });
              }
            }}
          />
        )}

        {view.type === 'championStory' && (
          <ChampionStoryHub 
            currentLang={currentLang}
            onBackToHome={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'home' });
            }}
            onExploreLeaderboard={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'leaderboard' });
            }}
            onExploreProducts={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'products' });
            }}
          />
        )}

        {view.type === 'sleepStudies' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] text-[#00F0FF] hover:text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <SleepStudiesAlgorithm 
              currentLang={currentLang} 
              onClose={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'home' });
              }}
            />
          </div>
        )}

        {view.type === 'injuryPrediction' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] text-[#E50914] hover:text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <InjuryPredictionAlgorithm 
              currentLang={currentLang} 
              onClose={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'home' });
              }}
            />
          </div>
        )}

        {view.type === 'subscriberTiers' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-[#1a1c2e] text-[#FFE600] hover:text-white border border-gray-800 text-xs font-black font-anime cursor-pointer transition-all"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <SubscriberTiersShowcase 
              currentLang={currentLang} 
              onNavigateToClub={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'customClub' });
              }}
            />
          </div>
        )}

        {view.type === 'customClub' && (
          <div className="pt-20 w-full max-w-full overflow-x-hidden">
            <CreatorClubHub 
              currentLang={currentLang}
              onNavigateToTiers={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'subscriberTiers' });
              }}
              onBack={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'home' });
              }}
            />
          </div>
        )}

        {view.type === 'yardCamp' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden bg-black min-h-screen">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-white text-white hover:text-black text-xs font-black font-anime cursor-pointer transition-all shadow-md"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <YardGlobalCamp 
              currentLang={currentLang} 
              onExploreGear={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'products' });
              }} 
            />
          </div>
        )}

        {view.type === 'bazaruto' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden bg-black min-h-screen">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141622] hover:bg-white text-white hover:text-black text-xs font-black font-anime cursor-pointer transition-all shadow-md"
              >
                <span>{currentLang === 'ar' ? '→ العودة للرئيسية' : '← Back to Home'}</span>
              </button>
            </div>
            <div className="max-w-[1800px] mx-auto px-4 md:px-8">
              <BazarutoResortSanctuary 
                currentLang={currentLang}
                onExploreEvents={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'tickets' });
                }}
              />
            </div>
          </div>
        )}

        {view.type === 'tickets' && (
          <TicketsEventsHub 
            currentLang={currentLang}
            onBackToHome={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'home' });
            }}
            onProceedToCheckout={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'checkout' });
            }}
          />
        )}

        {view.type === 'checkout' && (
            <Checkout 
                items={cartItems}
                currentLang={currentLang}
                onSuccess={() => setCartItems([])}
                onBack={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'home' });
                }}
            />
        )}

        {view.type === 'ownerDashboard' && (
          <OwnerDashboard 
            currentLang={currentLang}
            initialTab={view.initialTab}
            onBackToStore={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'home' });
            }}
            onNavigateToView={(viewId) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              const map: Record<string, ViewState> = {
                yardEngine: { type: 'yardEngine' },
                sleepStudies: { type: 'sleepStudies' },
                injuryPrediction: { type: 'injuryPrediction' },
                arena: { type: 'arena' },
                'ai-coach': { type: 'aiCoach' },
                aiCoach: { type: 'aiCoach' },
                products: { type: 'products' },
                customClub: { type: 'customClub' },
                leaderboard: { type: 'leaderboard' },
                journal: { type: 'championStory' },
                tickets: { type: 'tickets' },
                about: { type: 'about' }
              };
              if (map[viewId]) setView(map[viewId]);
            }}
          />
        )}
        </React.Suspense>
      </main>

      {view.type !== 'checkout' && <Footer currentLang={currentLang} onLinkClick={handleNavClick} />}
      
      <Assistant currentLang={currentLang} />
      
      <CartDrawer 
        currentLang={currentLang}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
            setIsCartOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setView({ type: 'checkout' });
        }}
      />

      <MetaMaskModal 
        isOpen={isMetaMaskOpen}
        onClose={() => setIsMetaMaskOpen(false)}
        currentLang={currentLang}
        onWalletConnected={(addr) => setWalletAddress(addr)}
      />

      <AppDownloadModal 
        isOpen={isAppDownloadOpen}
        onClose={() => setIsAppDownloadOpen(false)}
        currentLang={currentLang}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentLang={currentLang}
      />

      {sharedAuraGuestData && (
        <SharedAuraModal
          data={sharedAuraGuestData}
          isGuestView={true}
          onClose={() => setSharedAuraGuestData(null)}
          currentLang={currentLang}
          onOpenMyProfile={() => {
            setSharedAuraGuestData(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setView({ type: 'profile' });
          }}
          onNavigateToEngine={() => {
            setSharedAuraGuestData(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setView({ type: 'yardEngine' });
          }}
        />
      )}

      {/* Exclusive Floating Quick Access Badge - VISIBLE ONLY TO AUTHENTICATED OWNER */}
      {isOwner && view.type !== 'ownerDashboard' && (
        <aside 
          aria-label="Owner Quick Access"
          className={`fixed bottom-5 ${currentLang === 'ar' ? 'left-5' : 'right-5'} z-50 flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-[#0B0D17]/95 border-2 border-[#FFE600]/70 shadow-[0_0_35px_rgba(255,230,0,0.35)] backdrop-blur-xl animate-fade-in`}
        >
          <button 
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'ownerDashboard' });
            }}
            className="flex items-center gap-2 text-xs font-black font-anime text-[#FFE600] hover:text-white transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="truncate max-w-[130px]">👑 {ownerInfo.name}</span>
            <span className="text-[10px] text-gray-300 font-bold px-2 py-0.5 rounded-lg bg-black/60 border border-gray-800">
              {currentLang === 'ar' ? 'لوحة المالك' : 'Dashboard'}
            </span>
          </button>
          <button 
            type="button"
            onClick={() => {
              OwnerConfigService.logoutOwner();
              setIsOwner(false);
            }}
            className="p-1 px-1.5 rounded-xl bg-red-950/50 hover:bg-red-900 text-red-400 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
            title={currentLang === 'ar' ? 'تسجيل الخروج من حساب المالك' : 'Logout Owner'}
          >
            ✕
          </button>
        </aside>
      )}
    </div>
  );
}

export default App;
