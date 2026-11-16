/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import About from './components/About';
import Assistant from './components/Assistant';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import JournalDetail from './components/JournalDetail';
import CartDrawer from './components/CartDrawer';
import { MobileAppNotice } from './components/MobileAppNotice';
import { Leaderboard } from './components/Leaderboard';
import { AIAnimeCoach } from './components/AIAnimeCoach';
import { CombatArena } from './components/CombatArena';
import { InteractiveCharacterStage } from './components/InteractiveCharacterStage';
import { LaunchAnnouncementModal } from './components/LaunchAnnouncementModal';
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
import { authService } from './services/authService';
import { ShaolinMonasteryBackground } from './components/ShaolinMonasteryBackground';
import { getSharedAuraFromUrl, SharedAuraData } from './services/shareAuraService';
import { Product, ViewState } from './types';
import { Language, LANGUAGES, tr } from './i18n';
import { soundFX } from './services/soundFX';

// Sleek Cyber Chamber Loading Fallback
const CyberLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-[#050807] border border-emerald-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">
      <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
    <span className="text-xs font-mono font-black text-emerald-400 tracking-widest uppercase">
      LOADING YARD 300 CHAMBER...
    </span>
  </div>
);

const VALID_LANGS: Language[] = ['en', 'es', 'fr', 'ar'];

const SECTION_VIEW_MAP: Record<string, ViewState> = {
  yardengine: { type: 'yardEngine' },
  sleepstudies: { type: 'sleepStudies' },
  injuryprediction: { type: 'injuryPrediction' },
  leaderboard: { type: 'leaderboard' },
  tickets: { type: 'tickets' },
  ticketsevents: { type: 'tickets' },
  bazaruto: { type: 'bazaruto' },
  bazarutoresort: { type: 'bazaruto' },
  resort: { type: 'bazaruto' },
  options: { type: 'options' },
  yardcamp: { type: 'yardCamp' },
  camp: { type: 'yardCamp' },
  customclub: { type: 'customClub' },
  club: { type: 'customClub' },
  products: { type: 'products' },
  store: { type: 'products' },
  arena: { type: 'arena' },
  combatarena: { type: 'arena' },
  auravisualizer: { type: 'auraVisualizer' },
  aicoach: { type: 'aiCoach' },
  subscribertiers: { type: 'subscriberTiers' },
  subscriberties: { type: 'subscriberTiers' },
  subscribetiers: { type: 'subscriberTiers' },
  tiers: { type: 'subscriberTiers' },
  championstory: { type: 'championStory' },
  journal: { type: 'championStory' },
  about: { type: 'about' },
  profile: { type: 'profile' },
  founders: { type: 'home' },
  community: { type: 'home' },
};

function App() {
  const [view, setView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const sectionParam = params.get('section')?.toLowerCase();
      if (sectionParam && SECTION_VIEW_MAP[sectionParam]) {
        return SECTION_VIEW_MAP[sectionParam];
      }
      if (hash.includes('club') || window.location.search.toLowerCase().includes('club')) {
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
    if (typeof window !== 'undefined') {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang && VALID_LANGS.includes(urlLang as Language)) {
        localStorage.setItem('yard300_lang', urlLang);
        return urlLang as Language;
      }
    }
    const saved = localStorage.getItem('yard300_lang');
    if (saved && VALID_LANGS.includes(saved as Language)) {
      return saved as Language;
    }
    localStorage.setItem('yard300_lang', 'en');
    return 'en';
  });
  // Permanent Obsidian Emerald Mode
  const theme: 'dark' = 'dark';

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

  const [urlVerifyBanner, setUrlVerifyBanner] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('yard300_lang', currentLang);
    const langInfo = LANGUAGES.find(l => l.code === currentLang);
    const dir = langInfo?.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Dynamic Google Search SEO Title & Description sync per View and Language
  useEffect(() => {
    const viewTitles: Record<string, { en: string; es: string; fr: string; ar: string }> = {
      home: {
        en: 'YARD 300 | Combat Health, Bio-Performance & Bazaruto Sanctuary',
        es: 'YARD 300 | Rendimiento Atlético, Prevención ACWR y Santuario Bazaruto',
        fr: 'YARD 300 | Performance Biométrique, Prévention ACWR & Sanctuaire Bazaruto',
        ar: 'YARD 300 | منصة الذكاء البيومتري، المتجر الفاخر ومنتجع بازاروتو'
      },
      products: {
        en: 'Luxury Combat Store (300 Serialized Units) | YARD 300',
        es: 'Tienda Exclusiva (300 Unidades) | YARD 300',
        fr: 'Boutique Luxe (300 Pièces) | YARD 300',
        ar: 'متجر عتاد الأبطال الفاخر (300 قطعة) | YARD 300'
      },
      bazaruto: {
        en: 'Bazaruto Bio-Recovery Island Resort (Oct 2027) | YARD 300',
        es: 'Resort de Biorrecuperación Bazaruto (Oct 2027) | YARD 300',
        fr: 'Sanctuaire & Resort Bazaruto (Oct 2027) | YARD 300',
        ar: 'منتجع وملاذ يارد الصحي · أرخبيل بازاروتو (أكتوبر 2027) | YARD 300'
      },
      leaderboard: {
        en: 'Weekly Top 10 & Monthly Top 50 Champions Leaderboard | YARD 300',
        es: 'Clasificación Semanal (10) y Mensual (50) de Campeones | YARD 300',
        fr: 'Classement Hebdo (10) & Mensuel (50) des Champions | YARD 300',
        ar: 'لوحة المتصدرين والأبطال الأسبوعية والشهرية وقراءات التدريب | YARD 300'
      },
      tickets: {
        en: '10-Challenge Nature Endurance Championship (Jan 5, 2027) | YARD 300',
        es: 'Campeonato de Resistencia 10 Desafíos (5 Ene 2027) | YARD 300',
        fr: 'Championnat d’Endurance 10 Défis (5 Jan 2027) | YARD 300',
        ar: 'تذاكر بطولة الطبيعة للتحمل (5 يناير 2027) | YARD 300'
      },
      options: {
        en: 'Options & Performance Services Hub | YARD 300',
        es: 'Centro de Opciones y Servicios | YARD 300',
        fr: 'Pôle Options & Services | YARD 300',
        ar: 'بوابة الخيارات والخدمات الشاملة | YARD 300'
      },
      yardEngine: {
        en: 'YARD 300 Biometric & ACWR Injury Engine | YARD 300',
        es: 'Motor Biométrico ACWR y Sueño | YARD 300',
        fr: 'Moteur Biométrique ACWR & Sommeil | YARD 300',
        ar: 'محرك YARD 300 للذكاء البيومتري والتدريب | YARD 300'
      },
      sleepStudies: {
        en: 'Sleep Studies & Deep Recovery Algorithm | YARD 300',
        es: 'Algoritmo de Estudios del Sueño y Recuperación | YARD 300',
        fr: 'Algorithme Études du Sommeil & Récupération | YARD 300',
        ar: 'خوارزمية دراسات النوم والاستشفاء العميق | YARD 300'
      },
      injuryPrediction: {
        en: 'ACWR Injury Prediction Algorithm (7-Day Risk) | YARD 300',
        es: 'Algoritmo Predictivo de Lesiones ACWR | YARD 300',
        fr: 'Algorithme Prédictif de Blessures ACWR | YARD 300',
        ar: 'خوارزمية التنبؤ بالإصابات وتحليل الحمل ACWR | YARD 300'
      },
      customClub: {
        en: 'Build Your 3D Elite Athletic Club ($30/yr) | YARD 300',
        es: 'Crea Tu Club Atlético 3D ($30/año) | YARD 300',
        fr: 'Créez Votre Club Athlétique 3D (30 $/an) | YARD 300',
        ar: 'أنشئ ناديك الرياضي المخصص ثلاثي الأبعاد | YARD 300'
      },
      yardCamp: {
        en: 'YARD 300 Global Nature Training Camp | YARD 300',
        es: 'Campamento Global de Entrenamiento en la Naturaleza | YARD 300',
        fr: 'Camp Mondial d’Entraînement Nature YARD 300',
        ar: 'معسكر YARD العالمي للتحدي والتدريب | YARD 300'
      },
      aiCoach: {
        en: 'Biometric Tactical AI Coach | YARD 300',
        es: 'Entrenador Táctico Biométrico IA | YARD 300',
        fr: 'Coach Tactique Biométrique IA | YARD 300',
        ar: 'المدرب التكتيكي الذكي وتحليلات الجهد | YARD 300'
      },
      arena: {
        en: 'Live Combat & Performance Telemetry Arena | YARD 300',
        es: 'Arena de Combate y Telemetría en Vivo | YARD 300',
        fr: 'Arène de Combat & Télémétrie en Direct | YARD 300',
        ar: 'حلبة القتال والتدريب التفاعلي المباشر | YARD 300'
      },
      auraVisualizer: {
        en: 'Bio-Kinetic Aura Visualizer Studio | YARD 300',
        es: 'Estudio Visualizador Bio-Cinético Aura | YARD 300',
        fr: 'Studio Visualiseur Bio-Cinétique Aura | YARD 300',
        ar: 'مرسم الهالة الحيوية والطاقة البدنية | YARD 300'
      },
      subscriberTiers: {
        en: 'Membership Tiers & YARDX Credentials | YARD 300',
        es: 'Niveles de Membresía y Credenciales YARDX | YARD 300',
        fr: 'Niveaux d’Abonnement & Certificats YARDX | YARD 300',
        ar: 'مستويات العضوية وجوائز YARDX | YARD 300'
      },
      championStory: {
        en: 'Champion Stories & Sports Science Journal | YARD 300',
        es: 'Historias de Campeones y Ciencia Deportiva | YARD 300',
        fr: 'Histoires de Champions & Science du Sport | YARD 300',
        ar: 'قصص الأبطال وأبحاث الطب الرياضي | YARD 300'
      },
      about: {
        en: 'Philosophy & Global Standards | YARD 300',
        es: 'Filosofía y Estándares Globales | YARD 300',
        fr: 'Philosophie & Standards Mondiaux | YARD 300',
        ar: 'فلسفة YARD 300 ومعايير النخبة | YARD 300'
      },
      profile: {
        en: 'Athlete Profile & Wearables Telemetry | YARD 300',
        es: 'Perfil del Atleta y Telemetría de Relojes | YARD 300',
        fr: 'Profil Athlète & Télémétrie Connectée | YARD 300',
        ar: 'الملف الشخصي للبطل وربط الأجهزة الذكية | YARD 300'
      }
    };
    const fallbackTitle = {
      en: 'YARD 300 | Elite Combat Performance & Biometrics',
      es: 'YARD 300 | Rendimiento de Combate y Biometría',
      fr: 'YARD 300 | Performance de Combat & Biométrie',
      ar: 'YARD 300 | منصة الأداء القتالي والقياسات الحيوية'
    };
    document.title = tr(currentLang, viewTitles[view.type] || fallbackTitle);

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        tr(currentLang, {
          en: 'YARD 300 by Ayman Alsuwaidi & Amal Belnour — ACWR injury prediction, sleep recovery architecture, Weekly & Monthly Champions telemetry, 300-unit luxury apparel, 10-Challenge Championship (Jan 5, 2027), and Bazaruto Bio-Recovery Resort.',
          es: 'YARD 300 — Predicción de lesiones ACWR, laboratorio del sueño, clasificación de campeones, tienda exclusiva de 300 unidades, Campeonato del 5 de enero 2027 y Resort Bazaruto.',
          fr: 'YARD 300 — Prédiction des blessures ACWR, laboratoire du sommeil, classement des champions, boutique luxe 300 pièces, Championnat du 5 janvier 2027 et Resort Bazaruto.',
          ar: 'منصة YARD 300 (أيمن السويدي وأمل بالنور) — خوارزميات التنبؤ بالإصابات ACWR، دراسات النوم، لوحة المتصدرين والأبطال، المتجر الفاخر (300 قطعة)، بطولة 5 يناير 2027، ومنتجع بازاروتو.'
        })
      );
    }
  }, [view.type, currentLang]);

  // Process 1-click cryptographic URL email verification token (?verifyToken=...&email=...) on launch
  useEffect(() => {
    const checkUrlVerify = () => {
      const res = authService.checkAndProcessUrlVerification();
      if (res.success && res.user) {
        soundFX.playSuccess();
        setUrlVerifyBanner(
          tr(currentLang, {
            en: `Account verified & signed in as ${res.user.name}!`,
            es: `¡Cuenta verificada e iniciada como ${res.user.name}!`,
            fr: `Compte vérifié et connecté pour ${res.user.name} !`,
            ar: `تم تأكيد وتفعيل حسابك بنجاح! أهلاً بك يا ${res.user.name}.`
          })
        );
        setTimeout(() => setUrlVerifyBanner(null), 5500);
      }
    };
    checkUrlVerify();
    window.addEventListener('popstate', checkUrlVerify);
    return () => window.removeEventListener('popstate', checkUrlVerify);
  }, [currentLang]);

  // Enforce pure obsidian cyber night mode permanently
  useEffect(() => {
    localStorage.setItem('yard300_theme', 'dark');
    document.documentElement.classList.remove('light-theme');
    document.body.classList.remove('light-theme');
  }, []);

  // Initial Hash & ?section=founders Detection + Open-Profile Listener
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section')?.toLowerCase();
    if (section === 'founders' || section === 'community') {
      setTimeout(() => {
        const el = document.getElementById('community');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }

    const handleOpenProfileEvt = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setView({ type: 'profile' });
    };
    window.addEventListener('yard300_open_profile', handleOpenProfileEvt);

    const handleHashNav = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (rawHash && !rawHash.includes('verify=')) {
        const low = rawHash.toLowerCase();
        if (low.includes('club')) {
          setView({ type: 'customClub' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (SECTION_VIEW_MAP[low]) {
          setView(SECTION_VIEW_MAP[low]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (low === 'subscribertier' || low === 'subscribertier' || low === 'subscribertiers') {
          setView({ type: 'subscriberTiers' });
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
      window.removeEventListener('yard300_open_profile', handleOpenProfileEvt);
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

  const handleSelectHubSection = (id: string) => {
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
    if (id === 'combatArena' || id === 'arena') {
      setView({ type: 'arena' });
      return;
    }
    if (id === 'aiCoach') {
      setView({ type: 'aiCoach' });
      return;
    }
    if (id === 'products') {
      setView({ type: 'products' });
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

    setView({ type: 'options' });
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
  const backLabel = tr(currentLang, {
    en: '← Back to Home',
    es: '← Volver al Inicio',
    fr: "← Retour à l'Accueil",
    ar: '→ العودة للرئيسية'
  });
  const backBtnClass =
    'inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#080D0B] hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 text-xs font-black font-anime cursor-pointer transition-all shadow-md';

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden bg-[#050807] font-sans text-[#F0F4FF] selection:bg-emerald-500 selection:text-black relative ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      
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
        {urlVerifyBanner && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] px-5 py-3 rounded-2xl bg-[#080D0B] border-2 border-emerald-400 text-emerald-300 font-bold text-xs shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2.5 animate-fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{urlVerifyBanner}</span>
          </div>
        )}
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
                else if (target === 'leaderboard') setView({ type: 'leaderboard' });
                else if (target === 'tickets') setView({ type: 'tickets' });
                else if (target === 'products') setView({ type: 'products' });
                else if (target === 'bazaruto') setView({ type: 'bazaruto' });
                else if (target === 'subscriberTiers') {
                  const el = document.getElementById('subscriber-tiers');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            
            {/* Compact Visual Anchor & Interactive Experience Container */}
            <div className="max-w-[1800px] w-full max-w-full overflow-x-hidden mx-auto px-4 md:px-8 space-y-8 md:space-y-10">
              
              {/* 1. Subscriber Tiers & Earned Credentials Showcase (4 Levels) */}
              <SubscriberTiersShowcase currentLang={currentLang} />

              {/* 2. Official Global Sponsors (Compact Obsidian Strip) */}
              <GlobalSponsorsShowcase currentLang={currentLang} />

              {/* 4. Interactive Clinical Algorithms Launcher (Sleep Studies & ACWR Injury Prediction) */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#080D0B] via-[#050807] to-[#0A110E] border border-emerald-500/25 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                <div className="max-w-3xl mb-6 space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black font-anime uppercase tracking-wider">
                    ⚡ {tr(currentLang, {
                      en: 'CLINICAL ALGORITHMIC LABS',
                      es: 'LABORATORIOS ALGORÍTMICOS CLÍNICOS',
                      fr: 'LABORATOIRES ALGORITHMIQUES CLINIQUES',
                      ar: 'الخوارزميات السريرية والبيومترية'
                    })}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black font-anime text-white">
                    {tr(currentLang, {
                      en: 'Sleep Studies & Biomechanical Injury Prediction',
                      es: 'Estudios del Sueño y Predicción Biomecánica de Lesiones',
                      fr: 'Études du Sommeil & Prédiction Biomécanique des Blessures',
                      ar: 'خوارزمية دراسات النوم ونموذج التنبؤ بالإصابات'
                    })}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-300 font-bold leading-relaxed">
                    {tr(currentLang, {
                      en: 'Interactive precision algorithms calculating Stage-3 deep sleep GH synthesis, sleep debt, and 7-day predictive soft-tissue strain risk.',
                      es: 'Algoritmos de precisión interactivos que calculan la síntesis de GH en sueño profundo, deuda de sueño y riesgo de sobrecarga a 7 días.',
                      fr: 'Algorithmes interactifs mesurant la synthèse GH en sommeil profond NREM3, la dette de sommeil et le risque tendineux à 7 jours.',
                      ar: 'أدوات حسابية تفاعلية تحلل دورات النوم العميق واستشفاء هرمون النمو، وتتنبأ بمخاطر التمزقات العضلية وفق معيار الحمل الحاد والمزمن (ACWR).'
                    })}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Sleep Studies Launcher Card */}
                  <div className="p-5 rounded-2xl bg-[#0A100D] border border-emerald-500/20 hover:border-emerald-400/50 transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black font-mono text-emerald-400 uppercase tracking-wider block">
                        CLINICAL SLEEP LAB // NREM3 + REM
                      </span>
                      <h4 className="text-lg font-black font-anime text-white">
                        {tr(currentLang, {
                          en: 'Sleep Architecture & Recovery Lab',
                          es: 'Arquitectura del Sueño y Recuperación',
                          fr: 'Architecture du Sommeil & Récupération',
                          ar: 'خوارزمية دراسات النوم وهندسة التعافي'
                        })}
                      </h4>
                      <p className="text-xs text-gray-300 font-bold">
                        {tr(currentLang, {
                          en: 'Evaluate deep sleep stages, REM reflex consolidation, and athletic sleep debt.',
                          es: 'Evalúa fases de sueño profundo, consolidación REM y deuda de sueño atlética.',
                          fr: 'Évaluez les phases profondes, la consolidation REM et la dette de sommeil.',
                          ar: 'تحليل أطوار النوم العميق NREM3 و REM والدين التراكمي وجاهزية الجهاز العصبي.'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setView({ type: 'sleepStudies' });
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-anime text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      <span>{tr(currentLang, { en: 'Launch Sleep Algorithm', es: 'Iniciar Algoritmo de Sueño', fr: 'Lancer Algorithme Sommeil', ar: 'تشغيل خوارزمية النوم' })}</span>
                      <span>{isRTL ? '←' : '→'}</span>
                    </button>
                  </div>

                  {/* Injury Prediction Launcher Card */}
                  <div className="p-5 rounded-2xl bg-[#0A100D] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black font-mono text-[#D4AF37] uppercase tracking-wider block">
                        GABBETT ACWR ENGINE // 7-DAY HORIZON
                      </span>
                      <h4 className="text-lg font-black font-anime text-white">
                        {tr(currentLang, {
                          en: 'Biomechanical Injury Prediction',
                          es: 'Predicción Biomecánica de Lesiones',
                          fr: 'Prédiction Biomécanique des Blessures',
                          ar: 'خوارزمية التنبؤ بالإصابات وتوازن الحمل'
                        })}
                      </h4>
                      <p className="text-xs text-gray-300 font-bold">
                        {tr(currentLang, {
                          en: 'Acute:chronic workload ratio analysis, tendon strain alerts, and preventative conditioning.',
                          es: 'Análisis de carga aguda:crónica, alertas de tendones y prevención de sobrecarga.',
                          fr: 'Analyse du ratio de charge aiguë:chronique et prévention des blessures.',
                          ar: 'تتبع الحمل الحاد والمزمن، إجهاد الأوتار، ومعامل الإصابات السابقة لحماية مفاصل الأبطال.'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setView({ type: 'injuryPrediction' });
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-400 hover:opacity-95 text-black font-black font-anime text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    >
                      <span>{tr(currentLang, { en: 'Launch Injury Algorithm', es: 'Iniciar Algoritmo ACWR', fr: 'Lancer Algorithme ACWR', ar: 'تشغيل خوارزمية الإصابات' })}</span>
                      <span>{isRTL ? '←' : '→'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Live Challenges & Randomized Trials Arena Showcase */}
              <LiveChallengesArena 
                currentLang={currentLang}
                onEnterArena={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setView({ type: 'arena' });
                }}
              />

              {/* 5. Interactive Athletic Champions Stage */}
              <InteractiveCharacterStage 
                currentLang={currentLang} 
                onExploreSection={(secId) => handleSelectHubSection(secId)}
              />

              {/* 6. The Visionary Founders Showcase */}
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
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }}
                className={backBtnClass}
              >
                <span>{backLabel}</span>
              </button>
            </div>
            <YardCombatEngine 
              currentLang={currentLang} 
              onNavigateToProfile={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'profile' }); }}
            />
          </div>
        )}

        {view.type === 'arena' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }}
                className={backBtnClass}
              >
                <span>{backLabel}</span>
              </button>
            </div>
            <CombatArena currentLang={currentLang} />
          </div>
        )}

        {view.type === 'aiCoach' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }}
                className={backBtnClass}
              >
                <span>{backLabel}</span>
              </button>
            </div>
            <AIAnimeCoach currentLang={currentLang} />
          </div>
        )}

        {view.type === 'products' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }}
                className={backBtnClass}
              >
                <span>{backLabel}</span>
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
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }}
                className={backBtnClass}
              >
                <span>{backLabel}</span>
              </button>
            </div>
            <Leaderboard currentLang={currentLang} />
          </div>
        )}

        {view.type === 'about' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }}
                className={backBtnClass}
              >
                <span>{backLabel}</span>
              </button>
            </div>
            <About currentLang={currentLang} />
          </div>
        )}

        {view.type === 'auraVisualizer' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }}
                className={backBtnClass}
              >
                <span>{backLabel}</span>
              </button>
            </div>
            <AuraVisualizer 
              currentLang={currentLang}
              onNavigateToProfile={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'profile' }); }}
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
                resort: { type: 'bazaruto' },
                ownerDashboard: { type: 'ownerDashboard' }
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
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }} className={backBtnClass}>
                <span>{backLabel}</span>
              </button>
            </div>
            <SleepStudiesAlgorithm 
              currentLang={currentLang} 
              onClose={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }}
            />
          </div>
        )}

        {view.type === 'injuryPrediction' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }} className={backBtnClass}>
                <span>{backLabel}</span>
              </button>
            </div>
            <InjuryPredictionAlgorithm 
              currentLang={currentLang} 
              onClose={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }}
            />
          </div>
        )}

        {view.type === 'subscriberTiers' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }} className={backBtnClass}>
                <span>{backLabel}</span>
              </button>
            </div>
            <SubscriberTiersShowcase 
              currentLang={currentLang} 
              onNavigateToClub={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'customClub' }); }}
            />
          </div>
        )}

        {view.type === 'customClub' && (
          <div className="pt-20 w-full max-w-full overflow-x-hidden">
            <CreatorClubHub 
              currentLang={currentLang}
              onNavigateToTiers={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'subscriberTiers' }); }}
              onBack={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }}
            />
          </div>
        )}

        {view.type === 'yardCamp' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden bg-[#050807] min-h-screen">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }} className={backBtnClass}>
                <span>{backLabel}</span>
              </button>
            </div>
            <YardGlobalCamp 
              currentLang={currentLang} 
              onExploreGear={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'products' }); }} 
            />
          </div>
        )}

        {view.type === 'bazaruto' && (
          <div className="pt-24 pb-20 w-full max-w-full overflow-x-hidden bg-[#050807] min-h-screen">
            <div className="max-w-[1800px] w-full max-w-full mx-auto px-4 md:px-8 mb-4">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'home' }); }} className={backBtnClass}>
                <span>{backLabel}</span>
              </button>
            </div>
            <div className="max-w-[1800px] mx-auto px-4 md:px-8">
              <BazarutoResortSanctuary 
                currentLang={currentLang}
                onExploreEvents={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView({ type: 'tickets' }); }}
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
                yardCamp: { type: 'yardCamp' },
                bazaruto: { type: 'bazaruto' },
                resort: { type: 'bazaruto' },
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
          className={`fixed bottom-5 ${currentLang === 'ar' ? 'left-5' : 'right-5'} z-50 flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-[#080D0B]/95 border border-[#D4AF37]/60 shadow-[0_0_25px_rgba(212,175,55,0.25)] backdrop-blur-xl animate-fade-in`}
        >
          <button 
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'ownerDashboard' });
            }}
            className="flex items-center gap-2 text-xs font-black font-anime text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="truncate max-w-[130px]">👑 {ownerInfo.name}</span>
            <span className="text-[10px] text-gray-300 font-bold px-2 py-0.5 rounded-lg bg-black/60 border border-emerald-500/30">
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
            title={tr(currentLang, { en: 'Logout Owner', es: 'Cerrar Propietario', fr: 'Déconnexion', ar: 'تسجيل الخروج من حساب المالك' })}
          >
            ✕
          </button>
        </aside>
      )}
    </div>
  );
}

export default App;
