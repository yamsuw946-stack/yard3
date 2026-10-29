import React, { useState, useEffect } from 'react';
import { Language, LANGUAGES, t as translateKey } from '../i18n';
import { soundFX } from '../services/soundFX';
import { Yard300Logo } from './Yard300Logo';
import SideOptionsDrawer from './SideOptionsDrawer';
import { 
  Globe, 
  ChevronDown,
  ShoppingCart, 
  User, 
  Layers,
  Volume2,
  VolumeX,
  Menu,
  Crown,
  Compass,
  Palmtree,
  LogIn
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
  onYardClick,
  currentLang,
  onLanguageChange,
  onOpenAuth
}) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [scrolled, setScrolled] = useState(false);
  const [isOptionsDrawerOpen, setIsOptionsDrawerOpen] = useState(false);
  const [soundOn, setSoundOn] = useState<boolean>(() => soundFX.isEnabled());
  const isAr = currentLang === 'ar';

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
    const handleAuthChange = (e: any) => {
      const user = e.detail?.user !== undefined ? e.detail.user : authService.getCurrentUser();
      setCurrentUser(user);
    };
    window.addEventListener('yard300_auth_change', handleAuthChange);
    return () => window.removeEventListener('yard300_auth_change', handleAuthChange);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isOptionsDrawerOpen 
            ? 'bg-[#040508]/95 backdrop-blur-xl py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.95)]' 
            : 'bg-gradient-to-b from-[#040508]/95 via-[#040508]/85 to-transparent py-3'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-2 sm:px-4 md:px-8 flex items-center justify-between gap-1.5 sm:gap-2 md:gap-3 w-full overflow-hidden">
          
          {/* Authentic Combat Games Logo */}
          <a 
            href="#" 
            onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavClick(e, '');
            }}
            className="group shrink-0 relative z-50 cursor-pointer"
            title="YARD 300 Home"
          >
            <div className="hidden sm:block">
              <Yard300Logo size="md" showText={true} />
            </div>
            <div className="block sm:hidden">
              <Yard300Logo size="sm" showText={false} />
            </div>
          </a>
          
          {/* Unified Options & Club Buttons: Compact, Cyber Styled, Mobile-Friendly */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Options Button */}
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setIsOptionsDrawerOpen(true);
              }}
              className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-[#0E1018] hover:bg-[#151824] border border-[#00F0FF]/40 hover:border-[#00F0FF] text-white hover:text-[#00F0FF] transition-all duration-300 shadow-[0_0_12px_rgba(0,240,255,0.15)] flex items-center gap-1 sm:gap-1.5 cursor-pointer group"
              aria-label="Options & Services Menu"
              title="Open Options & Hubs Menu"
            >
              <div className="relative flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-[#00F0FF] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-[#FFE600] animate-ping"></span>
              </div>
              <span className="font-anime font-black text-[11px] sm:text-xs tracking-wider">
                OPTIONS
              </span>
              <span className="hidden xs:inline text-[8px] sm:text-[9px] bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/60 px-1 py-0.2 rounded font-mono font-bold leading-tight">
                ALL
              </span>
            </button>

            {/* Custom Club Button - Matching Size, Deep Dark Royal Purple with $30 Emerald Badge */}
            <button
              type="button"
              onClick={(e) => handleLinkClick(e, 'customClub')}
              className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-[#1f0933] hover:bg-[#2d0f47] border border-[#6b21a8] text-white hover:text-purple-200 transition-all duration-300 shadow-[0_0_14px_rgba(107,33,168,0.35)] flex items-center gap-1 sm:gap-1.5 cursor-pointer group"
              title="My Custom Athletic Club ($30 / Level 3)"
            >
              <Crown className="w-3.5 h-3.5 text-[#9333EA] group-hover:scale-110 transition-transform duration-300" />
              <span className="font-anime font-black text-[11px] sm:text-xs tracking-wider text-purple-100 group-hover:text-white">
                CLUB
              </span>
              <span className="text-[8px] sm:text-[9px] bg-gradient-to-r from-[#10B981] to-[#059669] text-black px-1 sm:px-1.5 py-0.2 rounded font-mono font-black shadow-[0_0_8px_rgba(16,185,129,0.5)] leading-tight">
                $30
              </span>
            </button>

            {/* YARD Global Camp Button (300 Athletes Worldwide) */}
            <button
              type="button"
              onClick={(e) => handleLinkClick(e, 'yardCamp')}
              className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-[#141208] hover:bg-[#221C0A] border border-[#FFE600]/50 hover:border-[#FFE600] text-white hover:text-[#FFE600] transition-all duration-300 shadow-[0_0_14px_rgba(255,230,0,0.2)] flex items-center gap-1 sm:gap-1.5 cursor-pointer group"
              title="YARD 300 Global Expedition Camp (300 Athletes / Year)"
            >
              <Compass className="w-3.5 h-3.5 text-[#FFE600] group-hover:scale-110 group-hover:rotate-45 transition-transform duration-300" />
              <span className="font-anime font-black text-[11px] sm:text-xs tracking-wider text-yellow-100 group-hover:text-[#FFE600]">
                CAMP
              </span>
              <span className="text-[8px] sm:text-[9px] bg-[#FFE600] text-black px-1 sm:px-1.5 py-0.2 rounded font-mono font-black shadow-md leading-tight">
                300
              </span>
            </button>

            {/* Bazaruto Bio-Recovery Resort Sanctuary */}
            <button
              type="button"
              onClick={(e) => handleLinkClick(e, 'bazaruto')}
              className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-[#071318] hover:bg-[#0c1e26] border border-emerald-500/50 hover:border-emerald-400 text-white hover:text-emerald-300 transition-all duration-300 shadow-[0_0_14px_rgba(16,185,129,0.25)] flex items-center gap-1 sm:gap-1.5 cursor-pointer group"
              title="YARD Bio-Recovery Resort & Sanctuary (Bazaruto Archipelago)"
            >
              <Palmtree className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-anime font-black text-[11px] sm:text-xs tracking-wider text-emerald-100 group-hover:text-emerald-300 hidden sm:inline">
                RESORT
              </span>
              <span className="text-[8px] sm:text-[9px] bg-emerald-400 text-black px-1 sm:px-1.5 py-0.2 rounded font-mono font-black shadow-md leading-tight">
                VIP
              </span>
            </button>
          </div>

          {/* Right Action Icons: Pure Night Obsidian & Clean Layout */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 z-50 relative">
            
            {/* Sound FX Toggle (desktop / tablet) */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? 'Disable Sound FX' : 'Enable Sound FX'}
              className={`hidden md:flex p-1.5 rounded-lg border text-xs transition-all cursor-pointer items-center justify-center ${
                soundOn
                  ? 'bg-[#12141F] text-gray-200 border-gray-700'
                  : 'bg-[#0E1018] text-gray-500 border-gray-900 hover:text-white'
              }`}
              aria-label="Toggle Sound Effects"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-gray-300" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
            </button>

            {/* Ultra-Compact Language Selector */}
            <div className="relative flex items-center">
              <div className="relative flex items-center bg-[#0E1018] border border-gray-900 hover:border-gray-700 rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 transition-all">
                <Globe className="w-3 h-3 text-gray-400 shrink-0 mr-1 hidden xs:block" />
                <select
                  value={currentLang}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  className="bg-transparent text-gray-200 font-black text-[10px] sm:text-[11px] outline-none cursor-pointer font-sans appearance-none pr-3"
                  title="Language"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#141622] text-white font-bold text-xs py-1">
                      {lang.code.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-2.5 h-2.5 text-gray-500 absolute right-1 pointer-events-none" />
              </div>
            </div>

            {/* Ultra-Compact Cart Button */}
            <button 
              onClick={handleCartClick}
              title={t('nav_cart')}
              className="relative p-1.5 bg-[#0E1018] hover:bg-[#151722] border border-gray-900 hover:border-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer text-gray-300 hover:text-white"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-gray-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E50914] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Button — Fully Responsive across Mobile & Desktop */}
            {currentUser ? (
              <button 
                onClick={() => {
                  soundFX.playButtonClick();
                  setIsOptionsDrawerOpen(false);
                  onProfileClick();
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-[#0E1018] hover:bg-[#151722] border border-emerald-500/50 hover:border-emerald-400 rounded-lg text-white font-bold text-xs transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                title={`${currentUser.name} (${currentUser.rankTitle})`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden border border-emerald-400 shrink-0 bg-black/50">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-anime font-black text-[10px] sm:text-[11px] max-w-[70px] sm:max-w-[100px] truncate hidden xs:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[8px] bg-emerald-500 text-black px-1 py-0.2 rounded font-black font-anime hidden sm:inline">
                  {currentUser.rankTitle.split(' ')[0]}
                </span>
              </button>
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
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-400/50 hover:border-emerald-400 rounded-lg text-emerald-300 hover:text-white font-black text-[10px] sm:text-[11px] font-anime transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                title={isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Register'}
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'دخول' : 'Sign In'}</span>
              </button>
            )}
            

          </div>
        </div>
      </nav>

      {/* Unified Side Options Drawer: Displays all chambers and options neatly arranged */}
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
