import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  Award, 
  Flame, 
  Zap, 
  Activity, 
  Trophy, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { SharedAuraData, generateShareAuraUrl, copyToClipboard } from '../services/shareAuraService';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { handleImageError } from '../constants';

interface SharedAuraModalProps {
  data: SharedAuraData;
  onClose: () => void;
  currentLang?: Language;
  isGuestView?: boolean;
  onOpenMyProfile?: () => void;
  onNavigateToEngine?: () => void;
}

export const SharedAuraModal: React.FC<SharedAuraModalProps> = ({
  data,
  onClose,
  currentLang = 'en',
  isGuestView = false,
  onOpenMyProfile,
  onNavigateToEngine
}) => {
  const isAr = currentLang === 'ar';
  const t = (en: string, es: string, fr: string, ar: string) => tr(currentLang, { en, es, fr, ar });
  const [copied, setCopied] = useState<boolean>(false);
  const shareUrl = generateShareAuraUrl(data);

  const handleCopyLink = async () => {
    soundFX.playButtonClick();
    const success = await copyToClipboard(shareUrl);
    if (success) {
      soundFX.playSuccess();
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShareOnX = () => {
    soundFX.playButtonClick();
    const tweetText = t(
      `Check out my S-Rank Aura status on YARD300! ${data.athleteName} • Level ${data.level} • Aura Charge: ${data.auraScore}% • Peak Power: ${data.peakPower} AU! 🔥`,
      `¡Mira mi estado Aura S-Rank en YARD300! ${data.athleteName} • Nivel ${data.level} • Carga Aura: ${data.auraScore}% • Potencia: ${data.peakPower} AU! 🔥`,
      `Découvrez mon statut Aura S-Rank sur YARD300 ! ${data.athleteName} • Niveau ${data.level} • Charge Aura : ${data.auraScore}% • Puissance : ${data.peakPower} AU ! 🔥`,
      `تحقق من مستوى هالتي الرياضية وإحصائياتي في YARD300! الرتبة: ${data.tier} • شحن الهالة: ${data.auraScore}% • أقصى قوة: ${data.peakPower} AU! 🔥`
    );
    
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}&via=YAMSUW300`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className={`bg-[#0E101A] border-2 border-[#00F0FF] rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-[0_0_60px_rgba(0,240,255,0.4)] relative my-8 animate-in fade-in zoom-in-95 duration-200 ${
          isAr ? 'text-right' : 'text-left'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-[#181A2A] border border-gray-700 transition-colors z-20"
          title={t('Close', 'Cerrar', 'Fermer', 'إغلاق')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16192A] border border-[#FFE600] text-[#FFE600] text-xs font-black font-anime shadow-[0_0_15px_rgba(255,230,0,0.3)]">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>
              {isGuestView
                ? t('SHARED CHAMPION AURA PASSPORT', 'PASAPORTE AURA DE CAMPEÓN COMPARTIDO', 'PASSEPORT AURA PARTAGÉ DU CHAMPION', 'معاينة هالة البطل المشاركة')
                : t('SHARE MY AURA // DIGITAL PASSPORT', 'COMPARTIR MI AURA // PASAPORTE DIGITAL', 'PARTAGER MON AURA // PASSEPORT DIGITAL', 'مشاركة الهالة الشخصية // SHARE MY AURA')}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-black font-anime text-white">
            {isGuestView 
              ? t(`${data.athleteName}’s S-Rank Aura`, `Aura S-Rank de ${data.athleteName}`, `Aura S-Rank de ${data.athleteName}`, `هالة البطل: ${data.athleteName}`)
              : t('Broadcast Your Aura Status', 'Comparte tu Estado Aura', 'Diffusez Votre Statut Aura', 'شارك طاقتك وهالتك مع العالم')}
          </h3>

          <p className="text-xs text-gray-300 font-bold max-w-md mx-auto">
            {isGuestView
              ? t('Biometrically verified profile statistics and dynamic kinetic aura charge.', 'Estadísticas de perfil verificadas biométricamente y carga cinética dinámica.', 'Statistiques de profil vérifiées biométriquement et charge cinétique dynamique.', 'تم التحقق من هذه البيانات بيومترياً عبر محرك YARD300 القتالي.')
              : t('Generate a unique encrypted link with your verified stats, rank, and live aura charge.', 'Genera un enlace único cifrado con tus estadísticas verificadas y nivel de aura.', 'Générez un lien chiffré unique avec vos statistiques vérifiées et votre charge aura.', 'رابط فريد مشفر يحتوي على رتبتك، طاقتك الحيوية، وأرقامك الرياضية الحالية.')}
          </p>
        </div>

        {/* The Holographic Athlete Aura Card */}
        <div className="bg-gradient-to-br from-[#121422] via-[#1A1C30] to-[#0A0B14] p-6 rounded-3xl border-2 border-[#FF007A]/60 shadow-[0_0_35px_rgba(255,0,122,0.25)] relative overflow-hidden">
          
          {/* Animated Energy Glow Shimmer */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#00F0FF]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#FF007A]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
            
            {/* Avatar with Energy Halo */}
            <div className="relative group shrink-0">
              <div 
                className="absolute -inset-2.5 rounded-2xl blur-md opacity-80 animate-aura-hue pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(0,240,255,0.9) 0%, rgba(255,0,122,0.9) 50%, rgba(255,230,0,0.8) 100%)'
                }}
              />
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#00F0FF] shadow-[0_0_20px_#00F0FF] bg-black">
                <img loading="lazy" decoding="async" 
                  src={data.avatar} 
                  alt={data.athleteName} 
                  onError={handleImageError}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-0 inset-x-0 bg-[#FF007A] text-white text-[9px] font-black text-center py-0.5 uppercase tracking-wider font-anime">
                  {data.tier}
                </div>
              </div>
            </div>

            {/* Athlete Identity */}
            <div className="space-y-1.5 text-center sm:text-left rtl:sm:text-right flex-1">
              <div className="flex items-center justify-center sm:justify-start rtl:sm:justify-end gap-2">
                <h4 className="text-xl md:text-2xl font-black font-anime text-white">
                  {data.athleteName}
                </h4>
                <span className="px-2.5 py-0.5 rounded-lg bg-[#FF007A] text-white text-[11px] font-black font-anime">
                  LVL {data.level}
                </span>
              </div>
              <p className="text-xs font-bold text-[#00F0FF]">
                {isAr ? (data.specializationAr || data.specialization) : data.specialization}
              </p>
              
              {/* Aura Kinetic Charge Gauge */}
              <div className="pt-1">
                <div className="flex justify-between text-[11px] font-bold mb-1">
                  <span className="text-[#FFE600]">{t('Aura Kinetic Charge', 'Carga Cinética de Aura', 'Charge Cinétique Aura', 'شحن الهالة الحركية')}</span>
                  <span className="text-[#00F0FF] font-mono font-black">{data.auraScore}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#141624] rounded-full overflow-hidden p-[1px] border border-[#00F0FF]/40">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF007A] via-[#7000FF] to-[#00F0FF] rounded-full shadow-[0_0_10px_#00F0FF]"
                    style={{ width: `${data.auraScore}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Key Verified Performance Metrics */}
          <div className="grid grid-cols-4 gap-2 pt-5 mt-5 border-t border-gray-800 text-center relative z-10">
            <div className="p-2.5 rounded-xl bg-[#0F111D] border border-gray-800">
              <span className="text-[10px] text-gray-400 block font-bold">{t('Peak Power', 'Potencia Máx', 'Puissance Max', 'أقصى قوة')}</span>
              <span className="text-xs md:text-sm font-black font-mono text-[#00F0FF]">{data.peakPower.toLocaleString('en-US')} AU</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0F111D] border border-gray-800">
              <span className="text-[10px] text-gray-400 block font-bold">{t('Streak', 'Racha', 'Série', 'ستريك قتالي')}</span>
              <span className="text-xs md:text-sm font-black font-mono text-[#FFE600]">{data.currentStreak}D</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0F111D] border border-gray-800">
              <span className="text-[10px] text-gray-400 block font-bold">{t('Calories', 'Calorías', 'Calories', 'حرق السعرات')}</span>
              <span className="text-xs md:text-sm font-black font-mono text-[#FF007A]">{data.calories.toLocaleString('en-US')}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0F111D] border border-gray-800">
              <span className="text-[10px] text-gray-400 block font-bold">{t('Aura AP', 'Puntos AP', 'Points AP', 'نقاط الهالة')}</span>
              <span className="text-xs md:text-sm font-black font-mono text-emerald-400">{data.totalAuraPoints.toLocaleString('en-US')}</span>
            </div>
          </div>

        </div>

        {/* Shareable Link Box & One-Click Copy */}
        <div className="space-y-3">
          <label className="text-xs font-black font-anime text-gray-300 uppercase tracking-wider block">
            {t('UNIQUE SHAREABLE AURA LINK:', 'ENLACE ÚNICO PARA COMPARTIR:', 'LIEN DE PARTAGE UNIQUE :', 'الرابط الفريد المخصص للمشاركة:')}
          </label>

          <div className="flex items-center gap-2 bg-[#141624] p-2 rounded-2xl border border-gray-700">
            <input 
              type="text" 
              readOnly 
              value={shareUrl} 
              className="bg-transparent text-xs font-mono text-gray-300 px-2 flex-1 outline-none select-all truncate"
            />
            
            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-4 py-2.5 rounded-xl font-anime font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md ${
                copied
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_#10B981]'
                  : 'bg-[#00F0FF] hover:bg-[#FFE600] text-black shadow-[0_0_15px_#00F0FF]'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t('Copied ✓', 'Copiado ✓', 'Copié ✓', 'تم النسخ ✓') : t('Copy Link', 'Copiar Enlace', 'Copier le Lien', 'نسخ الرابط')}</span>
            </button>
          </div>

          {/* Social Share & Direct Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleShareOnX}
              className="py-3 px-4 rounded-xl bg-[#161828] hover:bg-[#20243C] border border-gray-700 hover:border-[#FF007A] text-white font-anime font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <svg className="w-3.5 h-3.5 text-[#FF007A] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>{t('Share on 𝕏', 'Compartir en 𝕏', 'Partager sur 𝕏', 'مشاركة عبر 𝕏')}</span>
            </button>

            {isGuestView ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenMyProfile) onOpenMyProfile();
                }}
                className="py-3 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-anime font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              >
                <Zap className="w-4 h-4 text-black" />
                <span>{t('Build Your Aura ⚡', 'Crea tu Aura ⚡', 'Créer Votre Aura ⚡', 'أنشئ هالتك الخاصة ⚡')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#181A28] to-[#252A44] hover:border-[#00F0FF] border border-gray-700 text-[#00F0FF] font-anime font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('Instant Share', 'Compartir Ya', 'Partage Instantané', 'مشاركة الرابط فوراً')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Feedback Notification Banner */}
        {copied && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in duration-150">
            <Check className="w-4 h-4 shrink-0" />
            <span>{t('Unique Aura link copied! Share it on social media or with friends.', '¡Enlace único copiado! Compártelo con tus amigos.', 'Lien Aura unique copié ! Partagez-le avec vos amis.', 'تم نسخ رابط هالتك الفريد بنجاح! شاركه الآن مع زملائك ومنافسيك.')}</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default SharedAuraModal;
