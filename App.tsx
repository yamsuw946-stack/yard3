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
import { Leaderboard, WEEKLY_CHAMPIONS, MONTHLY_CHAMPIONS } from './components/Leaderboard';
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
import { authService } from './services/authService';
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
import { Language, LANGUAGES, tr } from './i18n';
import { soundFX } from './services/soundFX';
import {
  BiometricEngineService,
  evaluateSleepArchitecture,
  evaluateInjuryRisk,
  BiometricTelemetryState
} from './services/biometricEngine';

// Executive Chamber Loading Fallback
const CyberLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-[#0C0E14] border border-[#D4AF37]/40 flex items-center justify-center shadow-lg">
      <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
    <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-widest uppercase">
      LOADING YARD 300 CHAMBER...
    </span>
  </div>
);

function App() {
  const [view, setView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const section = (params.get('section') || '').toLowerCase();
      const target = section || hash.replace('#', '');
      if (target.includes('club')) return { type: 'customClub' };
      if (target === 'owner' || target === 'admin' || target === 'dashboard') return { type: 'ownerDashboard' };
      if (target === 'yardengine' || target === 'engine') return { type: 'yardEngine' };
      if (target === 'sleepstudies' || target === 'sleep') return { type: 'sleepStudies' };
      if (target === 'injuryprediction' || target === 'injury') return { type: 'injuryPrediction' };
      if (target === 'leaderboard') return { type: 'leaderboard' };
      if (target === 'ticketsevents' || target === 'tickets') return { type: 'ticketsEvents' };
      if (target === 'bazarutoresort' || target === 'resort') return { type: 'bazarutoResort' };
      if (target === 'options') return { type: 'options' };
      if (target === 'camp') return { type: 'camp' };
      if (target === 'founders') return { type: 'founders' };
      if (target === 'tiers' || target === 'subscribertier' || target === 'subscribertiers') return { type: 'subscriberTiers' };
      if (target === 'arena') return { type: 'arena' };
      if (target === 'aicoach') return { type: 'aiCoach' };
    }
    return { type: 'home' };
  });
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAppDownloadOpen, setIsAppDownloadOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [verificationToast, setVerificationToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const urlLang = new URLSearchParams(window.location.search).get('lang')?.toLowerCase();
      if (urlLang === 'en' || urlLang === 'es' || urlLang === 'fr' || urlLang === 'ar') {
        localStorage.setItem('yard300_lang', urlLang);
        return urlLang as Language;
      }
    }
    const saved = localStorage.getItem('yard300_lang');
    if (saved === 'en' || saved === 'es' || saved === 'fr' || saved === 'ar') {
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
  const [leaderboardTab, setLeaderboardTab] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [liveTelemetry, setLiveTelemetry] = useState<BiometricTelemetryState>(() =>
    BiometricEngineService.getState()
  );

  useEffect(() => {
    return BiometricEngineService.subscribe((next) => setLiveTelemetry(next));
  }, []);

  // Process 1-click email verification links on load & hash/url changes + listen for auth events
  useEffect(() => {
    const runUrlVerification = () => {
      const verifyResult = authService.checkAndProcessUrlVerification();
      if (verifyResult.success && verifyResult.user) {
        soundFX.playSuccess();
        soundFX.playPowerUp();
        setVerificationToast({
          type: 'success',
          text: tr(currentLang, {
            en: `Email confirmed! Welcome, ${verifyResult.user.name}.`,
            es: `¡Correo confirmado! Bienvenido, ${verifyResult.user.name}.`,
            fr: `E-mail confirmé ! Bienvenue, ${verifyResult.user.name}.`,
            ar: `تم تأكيد البريد وتفعيل الحساب! أهلاً بك يا ${verifyResult.user.name}.`
          })
        });
      } else if (verifyResult.error) {
        setVerificationToast({ type: 'error', text: verifyResult.error });
      }
    };

    const checkAuraInUrl = () => {
      const data = getSharedAuraFromUrl();
      if (data) {
        setSharedAuraGuestData(data);
      }
      runUrlVerification();
    };
    const handleAuthChange = () => {
      setIsOwner(OwnerConfigService.isOwnerLoggedIn());
      setOwnerInfo(OwnerConfigService.getOwnerInfo());
    };
    const handleOpenAuth = (e: Event) => {
      const detail = (e as CustomEvent<{ mode?: 'login' | 'register' }>).detail;
      setAuthModalMode(detail?.mode === 'register' ? 'register' : 'login');
      setIsAuthModalOpen(true);
    };
    const handleCartClear = () => {
      setCartItems([]);
    };

    runUrlVerification();
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
  }, [currentLang]);

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
    const dir = langInfo?.dir || (currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;

    const seoTitle = tr(currentLang, {
      en: 'YARD 300 – Combat Health, Bio-Performance & Ayman Alsuwaidi',
      es: 'YARD 300 – Salud de Combate, Biometría y Ayman Alsuwaidi',
      fr: 'YARD 300 – Santé de Combat, Biométrie & Ayman Alsuwaidi',
      ar: 'YARD 300 – الأداء الرياضي والصحة القتالية — أيمن السويدي'
    });
    const seoDesc = tr(currentLang, {
      en: 'YARD 300 by Ayman Alsuwaidi (Yam Suw): AI biometric injury prediction, sleep lab, athletic performance gear & Jan 5, 2027 10-challenge nature championship.',
      es: 'YARD 300 por Ayman Alsuwaidi (Yam Suw): predicción biométrica de lesiones, laboratorio del sueño, equipamiento élite y campeonato del 5 de enero de 2027.',
      fr: 'YARD 300 par Ayman Alsuwaidi (Yam Suw) : prédiction biométrique des blessures, laboratoire du sommeil, équipement élite et championnat du 5 janvier 2027.',
      ar: 'منصة YARD 300 بقيادة أيمن السويدي (Yam Suw): التنبؤ بالإصابات بالذكاء الاصطناعي، مختبر النوم، عتاد الأبطال وبطولة التحديات الـ 10 في 5 يناير 2027.'
    });

    document.title = seoTitle;
    const updateMeta = (selector: string, val: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', val);
    };
    updateMeta('meta[name="description"]', seoDesc);
    updateMeta('meta[property="og:title"]', seoTitle);
    updateMeta('meta[property="og:description"]', seoDesc);
    updateMeta('meta[name="twitter:title"]', seoTitle);
    updateMeta('meta[name="twitter:description"]', seoDesc);
  }, [currentLang, view]);

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
        if (rawHash === 'owner' || rawHash === 'admin' || rawHash === 'dashboard') {
          setView({ type: 'ownerDashboard' });
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

  // Mobile App Download Modal Event Listener + Ctrl/Cmd+Shift+Y Owner Control Shortcut
  useEffect(() => {
    const handleOpenAppDownload = () => {
      setIsAppDownloadOpen(true);
    };
    const handleControlShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setView({ type: 'ownerDashboard' });
      }
    };
    window.addEventListener('open-app-download', handleOpenAppDownload);
    window.addEventListener('keydown', handleControlShortcut);
    return () => {
      window.removeEventListener('open-app-download', handleOpenAppDownload);
      window.removeEventListener('keydown', handleControlShortcut);
    };
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

      {verificationToast && (
        <div
          role="status"
          className={`fixed top-16 left-1/2 -translate-x-1/2 z-[130] px-4 py-2.5 rounded-xl border shadow-xl flex items-center gap-3 text-xs font-semibold backdrop-blur-md ${
            verificationToast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-400/60 text-emerald-200'
              : 'bg-red-950/90 border-red-400/60 text-red-200'
          }`}
        >
          <span>{verificationToast.text}</span>
          <button
            type="button"
            onClick={() => setVerificationToast(null)}
            className="text-white/70 hover:text-white font-bold cursor-pointer"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

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
            onOpenAuth={(mode = 'login') => {
              setAuthModalMode(mode);
              setIsAuthModalOpen(true);
            }}
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
                else if (target === 'leaderboard') {
                  setLeaderboardTab('weekly');
                  setView({ type: 'leaderboard' });
                } else if (target === 'subscriberTiers') {
                  const el = document.getElementById('subscriber-tiers');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            
            {/* Visual Anchor & Interactive Experience Container */}
            <div className="max-w-[1680px] w-full max-w-full overflow-x-hidden mx-auto px-3 sm:px-5 md:px-8 space-y-6 md:space-y-8">
              
              {/* 1. Subscriber Tiers & Earned Credentials Showcase (4 Levels) */}
              <SubscriberTiersShowcase
                currentLang={currentLang}
                onNavigateToClub={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'customClub' });
                }}
              />

              {/* Official Global Sponsors & Sports Performance Partners */}
              <GlobalSponsorsShowcase currentLang={currentLang} />

              {/* 2. Interactive Clinical Algorithms Launcher (Sleep Studies & ACWR Injury Prediction) */}
              {(() => {
                const sleepEval = evaluateSleepArchitecture(liveTelemetry);
                const injuryEval = evaluateInjuryRisk(liveTelemetry);
                return (
                  <div className="p-4 sm:p-6 md:p-7 rounded-2xl bg-[#0C0E14] border border-white/[0.08] shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
                      <div className="max-w-3xl space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-[0.18em] block">
                          {tr(currentLang, {
                            en: 'LIVE CLINICAL ALGORITHMIC LABS',
                            es: 'LABORATORIOS CLÍNICOS ALGORÍTMICOS EN VIVO',
                            fr: 'LABORATOIRES CLINIQUES ALGORITHMIQUES EN DIRECT',
                            ar: 'الخوارزميات السريرية والبيومترية الحية'
                          })}
                        </span>
                        <h3 className="text-xl md:text-2xl font-extrabold text-white">
                          {tr(currentLang, {
                            en: 'Sleep Studies & Biomechanical Injury Prediction',
                            es: 'Estudios del Sueño y Predicción Biomecánica de Lesiones',
                            fr: 'Études du Sommeil et Prédiction Biomécanique des Blessures',
                            ar: 'خوارزمية دراسات النوم ونموذج التنبؤ بالإصابات'
                          })}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {tr(currentLang, {
                            en: 'Interactive precision algorithms calculating Stage-3 deep sleep GH synthesis, sleep debt, and 7-day predictive soft-tissue strain risk.',
                            es: 'Algoritmos de precisión que calculan la síntesis de GH en sueño profundo NREM3, deuda de sueño y riesgo de sobrecarga a 7 días.',
                            fr: 'Algorithmes de précision calculant la synthèse GH en sommeil profond NREM3, la dette de sommeil et le risque musculaire sur 7 jours.',
                            ar: 'أدوات حسابية تفاعلية تحلل دورات النوم العميق واستشفاء هرمون النمو، وتتنبأ بمخاطر التمزقات العضلية وفق معيار الحمل الحاد والمزمن (ACWR).'
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#121622] border border-white/[0.08] font-mono text-[11px] tabular-nums shrink-0" dir="ltr">
                        <span className="text-slate-400">
                          {tr(currentLang, { en: 'READINESS', es: 'LISTO', fr: 'PRÉPA', ar: 'READINESS' })}
                        </span>
                        <span className="text-[#D4AF37] font-bold">{sleepEval.overallScore}%</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400">ACWR</span>
                        <span className="text-[#10B981] font-bold">{injuryEval.acwr.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sleep Studies Live Card */}
                      <div className="p-4 sm:p-5 rounded-xl bg-[#121622] border border-white/[0.07] hover:border-[#D4AF37]/45 transition-all flex flex-col justify-between space-y-3.5">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                              {tr(currentLang, {
                                en: 'CLINICAL SLEEP LAB',
                                es: 'LAB DE SUEÑO',
                                fr: 'LABO SOMMEIL',
                                ar: 'مختبر النوم'
                              })} · {sleepEval.recoveryState.includes('Optimal')
                                ? tr(currentLang, { en: 'OPTIMAL ANABOLIC', es: 'ANABÓLICO ÓPTIMO', fr: 'ANABOLIQUE OPTIMAL', ar: 'ذروة التعافي البنائي' })
                                : sleepEval.recoveryState.includes('Balanced')
                                ? tr(currentLang, { en: 'BALANCED RECOVERY', es: 'RECUPERACIÓN EQUILIBRADA', fr: 'RÉCUPÉRATION ÉQUILIBRÉE', ar: 'تعافٍ متوازن' })
                                : tr(currentLang, { en: 'SUPPRESSED / DEBT', es: 'DÉFICIT DE SUEÑO', fr: 'DETTE DE SOMMEIL', ar: 'نقص وتعافٍ منخفض' })}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-white tabular-nums" dir="ltr">
                              {liveTelemetry.totalSleepHours.toFixed(1)}h · NREM3 {liveTelemetry.deepSleepPercent}%
                            </span>
                          </div>

                          <div>
                            <h4 className="text-base md:text-lg font-bold text-white">
                              {tr(currentLang, {
                                en: 'Sleep Architecture & Recovery Lab',
                                es: 'Arquitectura del Sueño y Recuperación',
                                fr: 'Architecture du Sommeil et Récupération',
                                ar: 'خوارزمية دراسات النوم وهندسة التعافي'
                              })}
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed mt-1">
                              {tr(currentLang, {
                                en: 'Evaluate deep sleep stages, REM reflex consolidation, and athletic sleep debt.',
                                es: 'Evalúa las fases de sueño profundo, consolidación REM y deuda de sueño atlética.',
                                fr: 'Évaluez les phases NREM3, la consolidation REM et la dette de sommeil athlétique.',
                                ar: 'تحليل أطوار النوم العميق NREM3 و REM والدين التراكمي وجاهزية الجهاز العصبي.'
                              })}
                            </p>
                          </div>

                          {/* Live Hypnogram Micro-Preview */}
                          <div className="p-2.5 rounded-xl bg-[#07080C] border border-white/[0.06] flex items-center justify-between gap-3">
                            <svg viewBox="0 0 180 38" className="w-32 sm:w-36 h-9 shrink-0" aria-hidden="true">
                              <polyline
                                fill="none"
                                stroke="#D4AF37"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points="2,8 22,8 26,31 52,31 58,18 76,18 82,10 100,10 106,30 132,30 138,14 162,14 176,8"
                              />
                            </svg>
                            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono tabular-nums" dir="ltr">
                              <div>
                                <span className="text-slate-500 block text-[9px]">
                                  {tr(currentLang, { en: 'GH SYNTH', es: 'SÍNTESIS GH', fr: 'SYNTHÈSE GH', ar: 'GH SYNTH' })}
                                </span>
                                <span className="text-[#D4AF37] font-bold">
                                  {sleepEval.growthHormoneEst.includes('Peak')
                                    ? tr(currentLang, { en: 'Peak Release', es: 'Pico Máximo', fr: 'Pic Maximal', ar: 'إفراز ذروي' })
                                    : sleepEval.growthHormoneEst.includes('Moderate')
                                    ? tr(currentLang, { en: 'Moderate', es: 'Moderado', fr: 'Modéré', ar: 'متوسط' })
                                    : tr(currentLang, { en: 'Blunted', es: 'Reducido', fr: 'Réduit', ar: 'منخفض' })}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[9px]">SPO2</span>
                                <span className="text-[#10B981] font-bold">{liveTelemetry.baselineSpo2}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setView({ type: 'sleepStudies' });
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>
                            {tr(currentLang, {
                              en: 'Open Sleep Lab Telemetry',
                              es: 'Abrir Telemetría del Sueño',
                              fr: 'Ouvrir le Labo Sommeil',
                              ar: 'تشغيل مختبر النوم الحي'
                            })}
                          </span>
                          <span>→</span>
                        </button>
                      </div>

                      {/* Injury Prediction Live Card */}
                      <div className="p-4 sm:p-5 rounded-xl bg-[#121622] border border-white/[0.07] hover:border-[#10B981]/45 transition-all flex flex-col justify-between space-y-3.5">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider">
                              {tr(currentLang, {
                                en: 'GABBETT ACWR ENGINE',
                                es: 'MOTOR GABBETT ACWR',
                                fr: 'MOTEUR GABBETT ACWR',
                                ar: 'محرك ACWR الوقائي'
                              })} · {injuryEval.horizonDays.includes('Optimal')
                                ? tr(currentLang, { en: '7D+ OPTIMAL', es: '7D+ ÓPTIMO', fr: '7J+ OPTIMAL', ar: 'آمن +7 أيام' })
                                : injuryEval.horizonDays.includes('4–7')
                                ? tr(currentLang, { en: '4-7D HORIZON', es: '4-7 DÍAS', fr: '4-7 JOURS', ar: 'أفق 4-7 أيام' })
                                : injuryEval.horizonDays.includes('48–72')
                                ? tr(currentLang, { en: '48-72H WATCH', es: '48-72 HORAS', fr: '48-72 HEURES', ar: 'مراقبة 72 ساعة' })
                                : tr(currentLang, { en: '24H ALERT', es: 'ALERTA 24H', fr: 'ALERTE 24H', ar: 'تنبيه 24 ساعة' })}
                            </span>
                            <span className="text-[11px] font-mono font-bold tabular-nums" style={{ color: injuryEval.riskColor }} dir="ltr">
                              {tr(currentLang, { en: 'RISK', es: 'RIESGO', fr: 'RISQUE', ar: 'RISK' })} {injuryEval.totalRisk}% · ACWR {injuryEval.acwr.toFixed(2)}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-base md:text-lg font-bold text-white">
                              {tr(currentLang, {
                                en: 'Biomechanical Injury Prediction',
                                es: 'Predicción Biomecánica de Lesiones',
                                fr: 'Prédiction Biomécanique des Blessures',
                                ar: 'خوارزمية التنبؤ بالإصابات وتوازن الحمل'
                              })}
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed mt-1">
                              {tr(currentLang, {
                                en: 'Acute:chronic workload ratio analysis, tendon strain alerts, and preventative conditioning.',
                                es: 'Análisis de carga aguda/crónica, alertas de tensión tendinosa y acondicionamiento preventivo.',
                                fr: 'Analyse du ratio charge aiguë/chronique, alertes tendineuses et préparation préventive.',
                                ar: 'تتبع الحمل الحاد والمزمن، إجهاد الأوتار، ومعامل الإصابات السابقة لحماية مفاصل الأبطال.'
                              })}
                            </p>
                          </div>

                          {/* Live 7-Day Strain Risk Sparkline */}
                          <div className="p-2.5 rounded-xl bg-[#07080C] border border-white/[0.06] flex items-center justify-between gap-3">
                            <svg viewBox="0 0 180 38" className="w-32 sm:w-36 h-9 shrink-0" aria-hidden="true">
                              <rect x="0" y="12" width="180" height="14" fill="#10B981" fillOpacity="0.1" rx="2" />
                              <polyline
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points="2,28 30,24 58,26 86,19 114,22 144,16 176,14"
                              />
                            </svg>
                            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono tabular-nums" dir="ltr">
                              <div>
                                <span className="text-slate-500 block text-[9px]">
                                  {tr(currentLang, { en: 'STRAIN', es: 'CARGA', fr: 'CHARGE', ar: 'STRAIN' })}
                                </span>
                                <span className="text-white font-bold">{injuryEval.fosterStrain}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[9px]">
                                  {tr(currentLang, { en: 'CONFIDENCE', es: 'CONFIANZA', fr: 'FIABILITÉ', ar: 'CONFIDENCE' })}
                                </span>
                                <span className="text-[#10B981] font-bold">{injuryEval.confidencePercent}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setView({ type: 'injuryPrediction' });
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#07080C] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>
                            {tr(currentLang, {
                              en: 'Open Injury Radar Engine',
                              es: 'Abrir Radar de Lesiones',
                              fr: 'Ouvrir le Radar Blessures',
                              ar: 'تشغيل محرك التنبؤ بالإصابات'
                            })}
                          </span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 2B. Weekly (Top 10) & Monthly (Top 50) Champions + Training Telemetry Readings Preview */}
              <div className="p-4 sm:p-6 md:p-7 rounded-2xl bg-[#0C0E14] border border-emerald-500/25 shadow-xl space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-[0.18em] block">
                      {tr(currentLang, {
                        en: 'VERIFIED TRAINING TELEMETRY & STANDINGS',
                        es: 'CLASIFICACIÓN Y LECTURAS DE ENTRENAMIENTO VERIFICADAS',
                        fr: 'CLASSEMENTS & MESURES D’ENTRAÎNEMENT VÉRIFIÉES',
                        ar: 'لوحة المتصدرين والأبطال · قراءات التدريب الحيوية'
                      })}
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-white">
                      {tr(currentLang, {
                        en: 'Weekly (Top 10) & Monthly (Top 50) Champions Board',
                        es: 'Campeones Semanales (Top 10) y Mensuales (Top 50)',
                        fr: 'Champions Hebdomadaires (Top 10) & Mensuels (Top 50)',
                        ar: 'أبطال الأسبوع (Top 10) وأبطال الشهر (Top 50) — أفضل النتائج'
                      })}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playButtonClick();
                        setLeaderboardTab('weekly');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setView({ type: 'leaderboard' });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-bold text-xs cursor-pointer transition-colors"
                    >
                      {tr(currentLang, { en: 'Weekly Top 10 →', es: 'Top 10 Semanal →', fr: 'Top 10 Hebdo →', ar: 'أبطال الأسبوع (10) →' })}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playButtonClick();
                        setLeaderboardTab('monthly');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setView({ type: 'leaderboard' });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#050807] font-bold text-xs cursor-pointer transition-colors"
                    >
                      {tr(currentLang, { en: 'Monthly Top 50 →', es: 'Top 50 Mensual →', fr: 'Top 50 Mensuel →', ar: 'أبطال الشهر (50) →' })}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playButtonClick();
                        setLeaderboardTab('allTime');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setView({ type: 'leaderboard' });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#07080C] hover:bg-white/10 text-white border border-white/[0.12] font-semibold text-xs cursor-pointer transition-colors"
                    >
                      {tr(currentLang, { en: '300 Legion', es: 'Legión 300', fr: 'Légion 300', ar: 'فيلق 300' })}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Weekly Leaders Card */}
                  <div className="p-4 rounded-xl bg-[#07080C] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#D4AF37] font-bold">
                        {tr(currentLang, { en: 'WEEKLY TOP 3 · TRAINING READINGS', es: 'TOP 3 SEMANAL · LECTURAS', fr: 'TOP 3 HEBDO · MESURES', ar: 'صدارة الأسبوع · قراءات التدريب' })}
                      </span>
                      <span className="text-slate-400 tabular-nums" dir="ltr">HRV · VO2 · HRS</span>
                    </div>
                    <div className="space-y-2">
                      {WEEKLY_CHAMPIONS.slice(0, 3).map((ath) => (
                        <div key={ath.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#10131C] border border-white/[0.05]">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xs font-mono font-bold text-[#D4AF37] w-5 shrink-0" dir="ltr">#{ath.rank}</span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">
                                {currentLang === 'ar' && ath.nameAr ? ath.nameAr : ath.name}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400 truncate">{ath.clubName}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono tabular-nums shrink-0" dir="ltr">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[#10B981]">HRV {ath.hrvMs}ms</span>
                            <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-200">VO2 {ath.vo2Max}</span>
                            <span className="font-bold text-[#D4AF37]">{ath.auraScore.toLocaleString('en-US')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Leaders Card */}
                  <div className="p-4 rounded-xl bg-[#07080C] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#10B981] font-bold">
                        {tr(currentLang, { en: 'MONTHLY TOP 50 · VOLUME & STABILITY', es: 'TOP 50 MENSUAL · VOLUMEN Y ESTABILIDAD', fr: 'TOP 50 MENSUEL · VOLUME & STABILITÉ', ar: 'أبطال الشهر (50) · الثبات وساعات التدريب' })}
                      </span>
                      <span className="text-slate-400 tabular-nums" dir="ltr">RHR · STAB · HRS</span>
                    </div>
                    <div className="space-y-2">
                      {MONTHLY_CHAMPIONS.slice(0, 3).map((ath) => (
                        <div key={`m-${ath.id}`} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#10131C] border border-white/[0.05]">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xs font-mono font-bold text-[#10B981] w-5 shrink-0" dir="ltr">#{ath.rank}</span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">
                                {currentLang === 'ar' && ath.nameAr ? ath.nameAr : ath.name}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400 truncate">{ath.clubName}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono tabular-nums shrink-0" dir="ltr">
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-200">{ath.trainingHours}h</span>
                            <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-white/[0.05] text-[#00F0FF]">{ath.restingHr}bpm</span>
                            <span className="font-bold text-[#10B981]">{ath.stabilityIndex}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Live Challenges & Trials Arena Showcase */}
              <LiveChallengesArena 
                currentLang={currentLang}
                onEnterArena={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'arena' });
                }}
              />

              {/* 4. AI Bio-Enhanced Athlete Roster */}
              <InteractiveCharacterStage 
                currentLang={currentLang} 
                onExploreSection={(secId) => handleSelectHubSection(secId as SectionHubId)}
              />

              {/* 5. The Visionary Founders Showcase (Yam Suw, M.T.K, ARB) */}
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
              </button>
            </div>
            <Leaderboard currentLang={currentLang} initialTimeframe={leaderboardTab} />
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
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
                camp: { type: 'yardCamp' },
                bazaruto: { type: 'bazaruto' },
                resort: { type: 'bazaruto' }
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
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
                <span>{tr(currentLang, { en: '← Back to Home', es: '← Volver al Inicio', fr: "← Retour à l'Accueil", ar: '→ العودة للرئيسية' })}</span>
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
                about: { type: 'about' },
                bazaruto: { type: 'bazaruto' },
                yardCamp: { type: 'yardCamp' },
                home: { type: 'home' }
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
        initialMode={authModalMode}
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
            className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate max-w-[130px]">👑 {ownerInfo.name}</span>
            <span className="text-[10px] text-gray-300 font-bold px-2 py-0.5 rounded-lg bg-black/60 border border-gray-800">
              {tr(currentLang, { en: 'Dashboard', es: 'Panel', fr: 'Tableau', ar: 'لوحة المالك' })}
            </span>
          </button>
          <button 
            type="button"
            onClick={() => {
              OwnerConfigService.logoutOwner();
              setIsOwner(false);
            }}
            className="p-1 px-1.5 rounded-xl bg-red-950/50 hover:bg-red-900 text-red-400 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
            title={tr(currentLang, { en: 'Logout Owner', es: 'Salir del Panel', fr: 'Déconnexion Propriétaire', ar: 'تسجيل الخروج من حساب المالك' })}
          >
            ✕
          </button>
        </aside>
      )}
    </div>
  );
}

export default App;
