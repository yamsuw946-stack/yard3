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
  LogOut,
  Sliders
} from 'lucide-react';
import { authService, AuthUser } from '../services/authService';
import { OwnerConfigService } from '../services/ownerConfigService';

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
  onOpenAuth?: (mode?: 'login' | 'register') => void;
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
  const [isOwner, setIsOwner] = useState<boolean>(() => OwnerConfigService.isOwnerLoggedIn());
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
      setIsOwner(OwnerConfigService.isOwnerLoggedIn() || user?.role === 'owner');
    };
    const handleOwnerAuth = () => {
      setIsOwner(OwnerConfigService.isOwnerLoggedIn() || authService.getCurrentUser()?.role === 'owner');
    };
    window.addEventListener('yard300_auth_change', handleAuthChange as EventListener);
    window.addEventListener('yard300_owner_auth_changed', handleOwnerAuth);
    return () => {
      window.removeEventListener('yard300_auth_change', handleAuthChange as EventListener);
      window.removeEventListener('yard300_owner_auth_changed', handleOwnerAuth);
    };
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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOptionsDrawerOpen
            ? 'bg-[#07080C]/92 backdrop-blur-xl py-2.5 border-b border-white/[0.06] shadow-[0_12px_32px_rgba(0,0,0,0.7)]'
            : 'bg-gradient-to-b from-[#07080C]/90 via-[#07080C]/65 to-transparent py-3'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-3 sm:px-6 md:px-10 flex items-center justify-between gap-2 sm:gap-3 w-full overflow-hidden">
          {/* Brand Logo */}
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
              es: 'YARD 300 Inicio',
              fr: 'YARD 300 Accueil',
              ar: 'YARD 300 الرئيسية'
            })}
          >
            <div className="hidden sm:block">
              <Yard300Logo size="md" showText={true} />
            </div>
            <div className="block sm:hidden">
              <Yard300Logo size="sm" showText={false} />
            </div>
          </a>

          {/* Single Unified Options Entry */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setIsOptionsDrawerOpen(true);
              }}
              className="h-9 px-3 sm:px-4 rounded-xl bg-[#0C0E14] hover:bg-[#141722] border border-white/[0.12] hover:border-[#D4AF37]/60 text-slate-100 hover:text-white transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
              aria-label={tr(currentLang, {
                en: 'Options Menu',
                es: 'Menú de Opciones',
                fr: 'Menu des Options',
                ar: 'قائمة الخيارات'
              })}
              title={tr(currentLang, {
                en: 'Open YARD 300 Menu (Club, Camp, Resort & Core Hubs)',
                es: 'Abrir Menú YARD 300 (Club, Campamento, Resort y Laboratorios)',
                fr: 'Ouvrir le Menu YARD 300 (Club, Camp, Resort & Labos)',
                ar: 'فتح القائمة الرئيسية (النادي، الكامب، المنتجع والخدمات)'
              })}
            >
              <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold text-xs tracking-wider uppercase">
                {tr(currentLang, {
                  en: 'OPTIONS',
                  es: 'OPCIONES',
                  fr: 'OPTIONS',
                  ar: 'الخيارات'
                })}
              </span>
            </button>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 z-50 relative">
            <button
              onClick={handleToggleSound}
              title={soundOn
                ? tr(currentLang, { en: 'Disable Sound FX', es: 'Desactivar Sonidos', fr: 'Désactiver le Son', ar: 'إيقاف المؤثرات الصوتية' })
                : tr(currentLang, { en: 'Enable Sound FX', es: 'Activar Sonidos', fr: 'Activer le Son', ar: 'تفعيل المؤثرات الصوتية' })}
              className={`hidden md:flex h-8 w-8 rounded-lg border text-xs transition-colors cursor-pointer items-center justify-center ${
                soundOn
                  ? 'bg-[#0C0E14] text-slate-200 border-white/[0.1] hover:border-white/25'
                  : 'bg-[#0C0E14] text-slate-500 border-white/[0.06] hover:text-white'
              }`}
              aria-label={tr(currentLang, {
                en: 'Toggle Sound Effects',
                es: 'Alternar Efectos de Sonido',
                fr: 'Activer/Désactiver le Son',
                ar: 'تبديل المؤثرات الصوتية'
              })}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-slate-300" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <div className="relative flex items-center h-8 bg-[#0C0E14] border border-white/[0.1] hover:border-white/25 rounded-lg px-2 transition-colors">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1.5 hidden xs:block" />
                <select
                  value={currentLang}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  className="bg-transparent text-slate-200 font-semibold text-[11px] outline-none cursor-pointer appearance-none pr-3.5"
                  title={tr(currentLang, { en: 'Language', es: 'Idioma', fr: 'Langue', ar: 'اللغة' })}
                  aria-label={tr(currentLang, { en: 'Select Language', es: 'Seleccionar Idioma', fr: 'Choisir la Langue', ar: 'اختر اللغة' })}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#0C0E14] text-white font-semibold text-xs py-1">
                      {lang.code.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              title={t('nav_cart')}
              className="relative h-8 w-8 bg-[#0C0E14] hover:bg-[#141722] border border-white/[0.1] hover:border-white/25 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-slate-300 hover:text-white"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#07080C] text-[9px] font-bold font-mono tabular-nums w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Direct Control Dashboard Button (Visible when authenticated as Owner) */}
            {(isOwner || currentUser?.role === 'owner') && (
              <button
                type="button"
                onClick={(e) => {
                  soundFX.playButtonClick();
                  handleLinkClick(e, 'ownerDashboard');
                }}
                className="flex items-center gap-1.5 h-8 px-2.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37] border border-[#D4AF37]/45 text-[#D4AF37] hover:text-[#07080C] rounded-lg font-bold text-[11px] transition-all cursor-pointer shrink-0"
                title={tr(currentLang, {
                  en: 'Full Site Control Dashboard',
                  es: 'Panel de Control Total',
                  fr: 'Panneau de Contrôle Total',
                  ar: 'لوحة التحكم والتعديل الشامل'
                })}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {tr(currentLang, {
                    en: 'Control Hub',
                    es: 'Control',
                    fr: 'Contrôle',
                    ar: 'لوحة التحكم'
                  })}
                </span>
              </button>
            )}

            {/* User Account / Quick Sign In & 1-Click Sign Out */}
            {currentUser ? (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    soundFX.playButtonClick();
                    setIsOptionsDrawerOpen(false);
                    onProfileClick();
                  }}
                  className="flex items-center gap-1.5 h-8 px-2.5 bg-[#0C0E14] hover:bg-[#141722] border border-white/[0.12] hover:border-[#10B981]/50 rounded-lg text-white font-semibold text-xs transition-colors cursor-pointer shrink-0"
                  title={`${currentUser.name} (${currentUser.rankTitle})`}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-[#D4AF37]/60 shrink-0 bg-black/50">
                    <img src={currentUser.avatar} alt={currentUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] max-w-[80px] truncate hidden xs:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] bg-[#10B981]/15 text-[#10B981] px-1.5 py-0.5 rounded font-mono font-bold hidden sm:inline leading-none">
                    {currentUser.rankTitle.split(' ')[0]}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setIsOptionsDrawerOpen(false);
                    authService.logout();
                  }}
                  className="h-8 px-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  title={tr(currentLang, {
                    en: 'Sign Out',
                    es: 'Cerrar Sesión',
                    fr: 'Déconnexion',
                    ar: 'تسجيل الخروج'
                  })}
                  aria-label={tr(currentLang, {
                    en: 'Sign Out',
                    es: 'Cerrar Sesión',
                    fr: 'Déconnexion',
                    ar: 'تسجيل الخروج'
                  })}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">
                    {tr(currentLang, {
                      en: 'Sign Out',
                      es: 'Salir',
                      fr: 'Quitter',
                      ar: 'خروج'
                    })}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  soundFX.playButtonClick();
                  setIsOptionsDrawerOpen(false);
                  if (onOpenAuth) {
                    onOpenAuth('login');
                  } else {
                    window.dispatchEvent(new CustomEvent('yard300_open_auth', { detail: { mode: 'login' } }));
                  }
                }}
                className="flex items-center gap-1.5 h-8 px-3 bg-[#D4AF37] hover:bg-[#E5C158] rounded-lg text-[#07080C] font-semibold text-[11px] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title={tr(currentLang, {
                  en: 'Sign In / Register',
                  es: 'Iniciar Sesión / Registro',
                  fr: 'Connexion / Inscription',
                  ar: 'تسجيل الدخول / إنشاء حساب'
                })}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>
                  {tr(currentLang, {
                    en: 'Sign In',
                    es: 'Entrar',
                    fr: 'Connexion',
                    ar: 'دخول'
                  })}
                </span>
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
