/**
 * Footer.tsx
 * Ultra-sleek, compact & optimized Footer:
 * - Scaled down font sizes and icons for a refined, modern look
 * - Global Presence: Madrid, Sydney, London, Dubai, Tokyo (soon)
 * - Official Verified Channels
 * - Streamlined Club & Newsletter subscription
 * - No logo or accompanying brand text (per user request)
 * - Pure English typography
 */

import React, { useState, useEffect } from 'react';
import { Mail, ExternalLink, Sparkles, Check, UserPlus, Globe } from 'lucide-react';
import { soundFX } from '../services/soundFX';
import { OwnerConfigService } from '../services/ownerConfigService';
import { Language } from '../i18n';

interface FooterProps {
  currentLang?: Language;
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ currentLang = 'en', onLinkClick }) => {
  const isAr = currentLang === 'ar';
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';

  const [subscriptionType, setSubscriptionType] = useState<'news' | 'club'>('club');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [isOwner, setIsOwner] = useState<boolean>(() => OwnerConfigService.isOwnerLoggedIn());

  useEffect(() => {
    const checkAuth = () => {
      setIsOwner(OwnerConfigService.isOwnerLoggedIn());
    };
    window.addEventListener('yard300_owner_auth_changed', checkAuth);
    return () => window.removeEventListener('yard300_owner_auth_changed', checkAuth);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    soundFX.playPowerUp();
    setSubscribeStatus('loading');
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 4000);
    }, 1200);
  };

  return (
    <footer className={`bg-[#030406] pt-8 pb-6 px-4 md:px-8 text-gray-400 relative overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Background Subtle Cyber Grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none" />

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 relative z-10">
        
        {/* Column 1: Global Branches Presence */}
        <div className="md:col-span-4 space-y-3">
          <p className="font-semibold text-xs text-gray-300 leading-relaxed max-w-sm">
            {isAr 
              ? 'رياضات قتالية عالية الأداء، خوارزميات التنبؤ بالإصابات، ومنتجع الاستشفاء الحيوي في أرخبيل بازاروتو.'
              : 'High-performance combat athletics, injury prediction algorithms, and bio-recovery protocols.'}
          </p>

          <div className="pt-1 space-y-1.5">
            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-wider font-anime flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <span>{isAr ? 'الفروع والمراكز الرياضية العالمية:' : 'GLOBAL BRANCH LOCATIONS & SANCTUARY:'}</span>
            </h4>
            
            {/* Clean Compact Branches Card - Strictly Non-Duplicated */}
            <div className="p-2.5 rounded-xl bg-[#07080D] border border-gray-900 text-[11px] text-gray-300 space-y-1.5">
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="px-2 py-0.5 rounded bg-[#10121A] text-gray-300 text-[10px] font-anime" title="Madrid, Spain">
                  🇪🇸 Madrid
                </span>
                <span className="px-2 py-0.5 rounded bg-[#10121A] text-gray-300 text-[10px] font-anime" title="Sydney, Australia">
                  🇦🇺 Sydney
                </span>
                <span className="px-2 py-0.5 rounded bg-[#10121A] text-gray-300 text-[10px] font-anime" title="London, United Kingdom">
                  🇬🇧 London
                </span>
                <span className="px-2 py-0.5 rounded bg-[#10121A] text-[#00F0FF] text-[10px] font-anime font-bold inline-flex items-center gap-1" title="Dubai Al Quoz, UAE">
                  <span>🇦🇪 Dubai</span>
                  <span className="text-[8px] text-gray-400 font-mono font-normal tracking-normal">(Al Quoz)</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-[10px] font-anime font-bold inline-flex items-center gap-1" title="Bazaruto Archipelago Sanctuary">
                  <span>🇲🇿 Bazaruto Sanctuary</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#10121A] text-[#FFE600] text-[10px] font-anime font-bold" title="Tokyo, Japan">
                  🇯🇵 Tokyo (Soon)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Official Contacts & Verified Social Channels */}
        <div className="md:col-span-4 space-y-2.5">
          <h4 className="font-black text-white text-xs md:text-sm font-anime">
            OFFICIAL CHANNELS &amp; CONTACT
          </h4>

          <div className="space-y-2 text-[11px] text-gray-400">
            {/* Email contact */}
            <div className="p-2 rounded-xl bg-[#07080D] border border-gray-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <div>
                  <span className="text-[9px] text-gray-500 block leading-tight">Official Email:</span>
                  <a href="mailto:contact@yard300.club" className="text-gray-200 hover:text-white transition-colors font-anime text-[11px]">
                    contact@yard300.club
                  </a>
                </div>
              </div>
              <span className="text-[8px] bg-gray-900 text-gray-400 px-1.5 py-0.5 rounded font-black font-anime">
                VERIFIED
              </span>
            </div>

            {/* Official Social Links */}
            <div>
              <p className="text-[9px] font-black text-gray-500 mb-1.5 uppercase tracking-wider font-anime">
                SOCIAL CHANNELS:
              </p>
              
              <div className="grid grid-cols-2 gap-1.5">
                {/* Official Instagram Account */}
                <a 
                  href="https://www.instagram.com/yard.300" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#07080D] hover:bg-[#10121A] border border-gray-900 hover:border-gray-800 text-gray-400 hover:text-white transition-all text-[11px] font-bold group"
                  title="Official YARD 300 Account on Instagram (@yard.300)"
                >
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF007A] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>@yard.300</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-gray-600" />
                </a>

                {/* Official X / Twitter Account */}
                <a 
                  href="https://x.com/YAMSUW300" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#07080D] hover:bg-[#10121A] border border-gray-900 hover:border-gray-800 text-gray-400 hover:text-white transition-all text-[11px] font-bold group"
                  title="Official YARD 300 Account on X (@YAMSUW300)"
                >
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>@YAMSUW300</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-gray-600" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Column 3: Subscription */}
        <div className="md:col-span-4 space-y-2.5">
          <h4 className="font-black text-white text-xs md:text-sm font-anime">
            CLUB &amp; NEWSLETTER
          </h4>

          {/* Toggle Subscription Mode */}
          <div className="flex p-0.5 rounded-lg bg-[#07080D] border border-gray-900 text-[10px] font-black font-anime">
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setSubscriptionType('club');
              }}
              className={`flex-1 py-1 rounded transition-all cursor-pointer flex items-center justify-center gap-1 ${
                subscriptionType === 'club' 
                  ? 'bg-gray-800 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <UserPlus className="w-3 h-3" />
              <span>YARD Club</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setSubscriptionType('news');
              }}
              className={`flex-1 py-1 rounded transition-all cursor-pointer flex items-center justify-center gap-1 ${
                subscriptionType === 'news' 
                  ? 'bg-gray-800 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Newsletter</span>
            </button>
          </div>

          <p className="text-[10px] text-gray-500 leading-normal">
            {subscriptionType === 'club'
              ? 'Join the YARD 300 Club: Early access to limited drops, championship invites, and training.'
              : 'Subscribe to our editorial digest: recovery insights, tournament drops, and science.'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="space-y-1.5">
            <div className="flex gap-1.5">
              <input 
                type="email" 
                required
                placeholder="Enter your email..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                className="bg-[#07080D] border border-gray-900 rounded-lg py-1.5 px-2.5 text-white placeholder-gray-600 outline-none focus:border-gray-700 transition-colors text-[11px] w-full" 
              />
              <button 
                type="submit"
                disabled={subscribeStatus !== 'idle' || !email}
                className="py-1.5 px-3 bg-white text-black font-black text-[10px] font-anime rounded-lg transition-all shrink-0 cursor-pointer disabled:opacity-50 hover:bg-gray-200"
              >
                {subscribeStatus === 'loading' 
                  ? '...' 
                  : subscribeStatus === 'success' 
                    ? '✓' 
                    : (subscriptionType === 'club' ? 'Join' : 'Subscribe')}
              </button>
            </div>

            {subscribeStatus === 'success' && (
              <p className="text-emerald-400 text-[10px] font-bold flex items-center gap-1 font-anime">
                <Check className="w-3 h-3" />
                <span>Successfully registered for updates!</span>
              </p>
            )}
          </form>

        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="max-w-[1700px] mx-auto mt-6 pt-3 flex flex-col md:flex-row justify-between items-center text-[10px] font-semibold text-gray-500 gap-2">
        <div className="flex items-center gap-2">
          <p>YARD 300 &copy; 2026 &bull; Official Combat Athletics</p>
          {/* Owner Access Portal for the owner */}
          <a
            href="#owner"
            onClick={(e) => {
              if (onLinkClick) {
                onLinkClick(e, 'ownerDashboard');
              } else {
                e.preventDefault();
                window.location.hash = 'owner';
              }
            }}
            title="Owner Admin Portal (Control & Edit)"
            className="text-gray-400 hover:text-[#FFE600] transition-colors cursor-pointer text-[10px] flex items-center gap-1 font-bold ml-2 px-2 py-0.5 rounded-md bg-[#121422] border border-gray-800 hover:border-[#FFE600]/60 shadow-sm"
          >
            <span>👑</span>
            <span>Owner Portal</span>
          </a>
        </div>
        
        {isOwner && (
          <div className="flex items-center gap-3">
            <a
              href="#owner"
              onClick={(e) => {
                if (onLinkClick) {
                  onLinkClick(e, 'ownerDashboard');
                } else {
                  e.preventDefault();
                  window.location.hash = 'owner';
                }
              }}
              className="text-[#FFE600] flex items-center gap-1 font-anime text-[9px] px-2 py-0.5 rounded bg-gray-900/80 border border-[#FFE600]/40"
            >
              <span>👑</span>
              <span>OWNER COMMAND CENTER</span>
            </a>
          </div>
        )}

        <p className="mt-1 md:mt-0 text-gray-500 font-anime">
          THE LEGION OF 300 // UNBREAKABLE AURA &#9889;
        </p>
      </div>

    </footer>
  );
};

export default Footer;
