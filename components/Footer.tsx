import React, { useState, useEffect } from 'react';
import { Mail, ExternalLink, Sparkles, Check, UserPlus, Globe } from 'lucide-react';
import { soundFX } from '../services/soundFX';
import { OwnerConfigService } from '../services/ownerConfigService';
import { Language, tr } from '../i18n';

interface FooterProps {
  currentLang?: Language;
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';

  const [subscriptionType, setSubscriptionType] = useState<'news' | 'club'>('club');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [siteSettings, setSiteSettings] = useState(() => OwnerConfigService.getConfig().siteSettings);

  useEffect(() => {
    const unsub = OwnerConfigService.subscribe((cfg) => {
      setSiteSettings(cfg.siteSettings);
    });
    return unsub;
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
    <footer className={`bg-[#050609] border-t border-white/[0.06] pt-6 pb-5 px-4 md:px-8 text-gray-400 relative overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-[1680px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 relative z-10">
        {/* Column 1: Global Branches Presence */}
        <div className="md:col-span-4 space-y-2.5">
          <p className="font-semibold text-xs text-gray-300 leading-relaxed max-w-sm">
            {tr(currentLang, {
              en: siteSettings.footerTaglineEn,
              es: 'YARD 300 — Plataforma Atlética Internacional, Entrenamiento Funcional y Santuario Bazaruto.',
              fr: 'YARD 300 — Plateforme Athlétique Internationale, Entraînement & Sanctuaire Bazaruto.',
              ar: siteSettings.footerTaglineAr
            })}
          </p>

          <div className="pt-0.5 space-y-1.5">
            <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <span>
                {tr(currentLang, {
                  en: 'GLOBAL BRANCH LOCATIONS & SANCTUARY:',
                  es: 'SEDES GLOBALES Y SANTUARIO:',
                  fr: 'IMPLANTATIONS MONDIALES & SANCTUAIRE :',
                  ar: 'الفروع والمراكز الرياضية العالمية:'
                })}
              </span>
            </h4>

            <div className="p-2 rounded-xl bg-[#07080D] border border-gray-900 text-[10px] text-gray-300">
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-[#10121A] text-gray-300">🇪🇸 Madrid</span>
                <span className="px-2 py-0.5 rounded bg-[#10121A] text-gray-300">🇦🇺 Sydney</span>
                <span className="px-2 py-0.5 rounded bg-[#10121A] text-gray-300">🇬🇧 London</span>
                <span className="px-2 py-0.5 rounded bg-[#10121A] text-[#00F0FF] font-bold inline-flex items-center gap-1">
                  <span>🇦🇪 Dubai</span>
                  <span className="text-[8px] text-gray-400 font-mono font-normal">(Al Quoz)</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 font-bold">
                  🇲🇿 Bazaruto Sanctuary
                </span>
                <span className="px-2 py-0.5 rounded bg-[#10121A] text-[#D4AF37] font-bold">
                  🇯🇵 Tokyo ({tr(currentLang, { en: 'Soon', es: 'Pronto', fr: 'Bientôt', ar: 'قريباً' })})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Official Contacts & Verified Social Channels */}
        <div className="md:col-span-4 space-y-2">
          <h4 className="font-bold text-white text-xs">
            {tr(currentLang, {
              en: 'OFFICIAL CHANNELS & CONTACT',
              es: 'CANALES OFICIALES Y CONTACTO',
              fr: 'CANAUX OFFICIELS & CONTACT',
              ar: 'القنوات الرسمية والتواصل'
            })}
          </h4>

          <div className="space-y-2 text-[11px] text-gray-400">
            <div className="p-2 rounded-xl bg-[#07080D] border border-gray-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <div>
                  <span className="text-[9px] text-gray-500 block leading-tight">
                    {tr(currentLang, {
                      en: 'Official Email:',
                      es: 'Correo Oficial:',
                      fr: 'E-mail Officiel :',
                      ar: 'البريد الرسمي:'
                    })}
                  </span>
                  <a href={`mailto:${siteSettings.contactEmail}`} className="text-gray-200 hover:text-white transition-colors text-[11px]">
                    {siteSettings.contactEmail}
                  </a>
                </div>
              </div>
              <span className="text-[8px] bg-gray-900 text-gray-400 px-1.5 py-0.5 rounded font-bold uppercase">
                {tr(currentLang, { en: 'VERIFIED', es: 'VERIFICADO', fr: 'VÉRIFIÉ', ar: 'موثق' })}
              </span>
            </div>

            <div>
              <p className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                {tr(currentLang, {
                  en: 'SOCIAL CHANNELS:',
                  es: 'REDES SOCIALES:',
                  fr: 'RÉSEAUX SOCIAUX :',
                  ar: 'الحسابات الرسمية:'
                })}
              </p>

              <div className="grid grid-cols-2 gap-1.5">
                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#07080D] hover:bg-[#10121A] border border-gray-900 hover:border-gray-800 text-gray-400 hover:text-white transition-all text-[11px] font-bold group"
                  title={`Official YARD 300 Account on Instagram (${siteSettings.instagramHandle})`}
                >
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF007A] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>{siteSettings.instagramHandle}</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-gray-600" />
                </a>

                <a
                  href={siteSettings.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#07080D] hover:bg-[#10121A] border border-gray-900 hover:border-gray-800 text-gray-400 hover:text-white transition-all text-[11px] font-bold group"
                  title={`Official YARD 300 Account on X (${siteSettings.xHandle})`}
                >
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>{siteSettings.xHandle}</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-gray-600" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Club & Newsletter */}
        <div className="md:col-span-4 space-y-2">
          <h4 className="font-bold text-white text-xs">
            {tr(currentLang, {
              en: 'CLUB & NEWSLETTER',
              es: 'CLUB Y BOLETÍN',
              fr: 'CLUB & NEWSLETTER',
              ar: 'النادي والنشرة البريدية'
            })}
          </h4>

          <div className="flex p-0.5 rounded-lg bg-[#07080D] border border-gray-900 text-[10px] font-bold">
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
              <span>{tr(currentLang, { en: 'YARD Club', es: 'Club YARD', fr: 'Club YARD', ar: 'نادي يارد' })}</span>
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
              <span>{tr(currentLang, { en: 'Newsletter', es: 'Boletín', fr: 'Bulletin', ar: 'النشرة' })}</span>
            </button>
          </div>

          <p className="text-[10px] text-gray-500 leading-normal">
            {subscriptionType === 'club'
              ? tr(currentLang, {
                  en: 'Join the YARD 300 Club: Early access to limited drops, championship invites, and training.',
                  es: 'Únete al Club YARD 300: acceso anticipado a lanzamientos limitados e invitaciones.',
                  fr: 'Rejoignez le Club YARD 300 : accès anticipé aux éditions limitées et invitations.',
                  ar: 'انضم لنادي يارد 300: وصول مبكر للإصدارات المحدودة ودعوات البطولات.'
                })
              : tr(currentLang, {
                  en: 'Subscribe to our editorial digest: recovery insights, tournament drops, and sports science.',
                  es: 'Suscríbete a nuestro boletín: recuperación, lanzamientos y ciencia del rendimiento.',
                  fr: 'Abonnez-vous à notre bulletin : récupération, tournois et science du sport.',
                  ar: 'اشترك في النشرة الشهرية: أبحاث الاستشفاء وأخبار البطولات العالمية.'
                })}
          </p>

          <form onSubmit={handleSubscribe} className="space-y-1.5">
            <div className="flex gap-1.5">
              <input
                type="email"
                required
                placeholder={tr(currentLang, {
                  en: 'Enter your email...',
                  es: 'Tu correo electrónico...',
                  fr: 'Votre e-mail...',
                  ar: 'أدخل بريدك الإلكتروني...'
                })}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                className="bg-[#07080D] border border-gray-900 rounded-lg py-1.5 px-2.5 text-white placeholder-gray-600 outline-none focus:border-gray-700 transition-colors text-[11px] w-full"
              />
              <button
                type="submit"
                disabled={subscribeStatus !== 'idle' || !email}
                className="py-1.5 px-3 bg-white text-black font-bold text-[10px] rounded-lg transition-all shrink-0 cursor-pointer disabled:opacity-50 hover:bg-gray-200"
              >
                {subscribeStatus === 'loading'
                  ? '...'
                  : subscribeStatus === 'success'
                    ? '✓'
                    : subscriptionType === 'club'
                      ? tr(currentLang, { en: 'Join', es: 'Unirse', fr: 'Rejoindre', ar: 'انضم' })
                      : tr(currentLang, { en: 'Subscribe', es: 'Suscribir', fr: 'S’abonner', ar: 'اشترك' })}
              </button>
            </div>

            {subscribeStatus === 'success' && (
              <p className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>
                  {tr(currentLang, {
                    en: 'Successfully registered for updates!',
                    es: '¡Registrado con éxito!',
                    fr: 'Inscription confirmée !',
                    ar: 'تم التسجيل بنجاح!'
                  })}
                </span>
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-[1680px] mx-auto mt-5 pt-3 flex flex-col md:flex-row justify-between items-center text-[10px] font-semibold text-gray-500 gap-2 border-t border-white/[0.04]">
        <p>
          {tr(currentLang, {
            en: 'YARD 300 © 2026–2027 • Official Combat Athletics',
            es: 'YARD 300 © 2026–2027 • Atletismo y Combate Oficial',
            fr: 'YARD 300 © 2026–2027 • Athlétisme & Combat Officiel',
            ar: 'YARD 300 © 2026–2027 • المنصة الرياضية الرسمية'
          })}
        </p>

        <p className="mt-1 md:mt-0 text-slate-500 font-mono text-[10px] tracking-wider uppercase">
          YARD 300 // AYMAN AL SUWAIDI · GLOBAL PERFORMANCE ATELIER
        </p>
      </div>
    </footer>
  );
};

export default Footer;
