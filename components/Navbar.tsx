import React, { useState, useEffect } from 'react';
import { Language, LANGUAGES, t as translateKey, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { Yard300Logo } from './Yard300Logo';
import SideOptionsDrawer from './SideOptionsDrawer';
import {
  Globe,
  ChevronDown,
  ShoppingCart,
  Layers,
  Volume2,
  VolumeX,
  LogIn,
  LogOut
} from 'lucide-react';
import { authService, AuthUser } from '../services/authService';

interface NavbarProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onProfileClick: () => void;
  onYardClick: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenMetaMask?: () => void;
  walletAddress?: string | null;
  onOpenAuth?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onNavClick,
  cartCount,
  onOpenCart,
  onProfileClick,
  currentLang,
  onLanguageChange,
  onOpenAuth
}) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [scrolled, setScrolled] = useState(false);
  const [isOptionsDrawerOpen, setIsOptionsDrawerOpen] = useState(false);
  const [soundOn, setSoundOn] = useState<boolean>(() => soundFX.isEnabled());

  const handleToggleSound = () => {
    const updated = soundFX.toggleSound();
    setSoundOn(updated);
  };

  const t = (key: string) => translateKey(currentLang, key);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleAuthChange = (e: CustomEvent<{ user?: AuthUser | null }>) => {
      const user = e.detail?.user !== undefined ? e.detail.user : authService.getCurrentUser();
      setCurrentUser(user);
    };
    window.addEventListener('yard300_auth_change', handleAuthChange as EventListener);
    return () => window.removeEventListener('yard300_auth_change', handleAuthChange as EventListener);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    setIsOptionsDrawerOpen(false);
    onNavClick(e, targetId);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOptionsDrawerOpen(false);
    onOpenCart();
  };

  const handleQuickLogout = () => {
    soundFX.playButtonClick();
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isOptionsDrawerOpen
            ? 'bg-[#050807]/95 backdrop-blur-xl py-2 border-b border-emerald-500/15 shadow-[0_10px_35px_rgba(0,0,0,0.95)]'
            : 'bg-gradient-to-b from-[#050807]/95 via-[#050807]/85 to-transparent py-2.5'
        }`}
      >
        <div className="max-w-[1700px] mx-auto px-2 sm:px-4 md:px-8 flex items-center justify-between gap-2 md:gap-3 w-full overflow-hidden">
          {/* Official YARD 300 Geometric Emblem & Architectural Wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onNavClick(e, '');
            }}
            className="group shrink-0 relative z-50 cursor-pointer"
            title={tr(currentLang, {
              en: 'YARD 300 Home',
              es: 'Inicio YARD 300',
              fr: 'Accueil YARD 300',
              ar: 'الرئيسية YARD 300'
            })}
          >
            <div className="hidden sm:block">
              <Yard300Logo size="md" showText={true} />
            </div>
            <div className="block sm:hidden">
              <Yard300Logo size="sm" showText={false} />
            </div>
          </a>

          {/* Single Unified Navigation Button: OPTIONS (houses every section & leaderboard) */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setIsOptionsDrawerOpen(true);
              }}
              className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-[#0A0F0D] hover:bg-[#101915] border border-emerald-500/40 hover:border-emerald-400 text-white hover:text-emerald-300 transition-all duration-300 shadow-[0_0_14px_rgba(16,185,129,0.16)] flex items-center gap-1.5 sm:gap-2 cursor-pointer group"
              aria-label="Options & Services Menu"
              title={tr(currentLang, {
                en: 'Open Options & Hubs Menu',
                es: 'Abrir Menú de Opciones',
                fr: 'Ouvrir le Menu Options',
                ar: 'فتح قائمة الخيارات والخدمات'
              })}
            >
              <div className="relative flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="font-anime font-black text-xs sm:text-sm tracking-wider">
                {tr(currentLang, { en: 'OPTIONS', es: 'OPCIONES', fr: 'OPTIONS', ar: 'الخيارات' })}
              </span>
              <span className="hidden xs:inline text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.5 rounded font-mono font-bold leading-tight">
                {tr(currentLang, { en: 'ALL', es: 'TODO', fr: 'TOUT', ar: 'الكل' })}
              </span>
            </button>
          </div>

          {/* Right Utility & Account Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 z-50 relative">
            <button
              onClick={handleToggleSound}
              title={
                soundOn
                  ? tr(currentLang, { en: 'Disable Sound FX', es: 'Silenciar Sonido', fr: 'Couper le Son', ar: 'كتم المؤثرات' })
                  : tr(currentLang, { en: 'Enable Sound FX', es: 'Activar Sonido', fr: 'Activer le Son', ar: 'تفعيل المؤثرات' })
              }
              className={`hidden md:flex p-1.5 rounded-lg border text-xs transition-all cursor-pointer items-center justify-center ${
                soundOn
                  ? 'bg-[#0C1210] text-emerald-300 border-emerald-500/30'
                  : 'bg-[#080B0A] text-gray-500 border-gray-800 hover:text-white'
              }`}
              aria-label="Toggle Sound Effects"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <div className="relative flex items-center bg-[#0A0F0D] border border-emerald-500/25 hover:border-emerald-400/60 rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 transition-all">
                <Globe className="w-3 h-3 text-emerald-400 shrink-0 mr-1 hidden xs:block" />
                <select
                  value={LANGUAGES.some(l => l.code === currentLang) ? currentLang : 'en'}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  className="bg-transparent text-gray-200 font-black text-[10px] sm:text-[11px] outline-none cursor-pointer font-sans appearance-none pr-3"
                  title="Language"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#0B100E] text-white font-bold text-xs py-1">
                      {lang.code.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-2.5 h-2.5 text-emerald-400/80 absolute right-1 pointer-events-none" />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              title={t('nav_cart')}
              className="relative p-1.5 bg-[#0A0F0D] hover:bg-[#111916] border border-emerald-500/20 hover:border-emerald-400/50 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer text-gray-300 hover:text-white"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-gray-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Profile + Quick Sign Out */}
            {currentUser ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    soundFX.playButtonClick();
                    setIsOptionsDrawerOpen(false);
                    onProfileClick();
                  }}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-[#0A0F0D] hover:bg-[#111916] border border-emerald-500/50 hover:border-emerald-400 rounded-lg text-white font-bold text-xs transition-all cursor-pointer"
                  title={`${currentUser.name} (${currentUser.rankTitle})`}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-emerald-400 shrink-0 bg-black/50">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-anime font-black text-[10px] sm:text-[11px] max-w-[70px] sm:max-w-[100px] truncate hidden xs:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickLogout}
                  title={tr(currentLang, {
                    en: 'Sign Out',
                    es: 'Cerrar Sesión',
                    fr: 'Déconnexion',
                    ar: 'تسجيل الخروج'
                  })}
                  className="p-1.5 bg-[#0A0F0D] hover:bg-red-950/60 border border-gray-800 hover:border-red-500/50 rounded-lg text-gray-400 hover:text-red-300 transition-all cursor-pointer"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  soundFX.playButtonClick();
                  setIsOptionsDrawerOpen(false);
                  if (onOpenAuth) {
                    onOpenAuth();
                  } else {
                    window.dispatchEvent(new CustomEvent('yard300_open_auth'));
                  }
                }}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/50 hover:border-emerald-400 rounded-lg text-emerald-300 hover:text-white font-black text-[10px] sm:text-[11px] font-anime transition-all cursor-pointer"
                title={tr(currentLang, {
                  en: 'Sign In / Register',
                  es: 'Iniciar Sesión / Registro',
                  fr: 'Connexion / Inscription',
                  ar: 'تسجيل الدخول / إنشاء حساب'
                })}
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tr(currentLang, { en: 'Sign In', es: 'Entrar', fr: 'Connexion', ar: 'دخول' })}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <SideOptionsDrawer
        isOpen={isOptionsDrawerOpen}
        onClose={() => setIsOptionsDrawerOpen(false)}
        onNavigate={handleLinkClick}
        onOpenProfile={onProfileClick}
        currentLang={currentLang}
      />
    </>
  );
};

export default Navbar;
