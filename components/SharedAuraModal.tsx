import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Share2, Zap } from 'lucide-react';
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
  onOpenMyProfile
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
      `¡Mira mi estado S-Rank en YARD300! ${data.athleteName} • Nivel ${data.level} • Aura: ${data.auraScore}% • Potencia: ${data.peakPower} AU! 🔥`,
      `Découvrez mon statut S-Rank sur YARD300 ! ${data.athleteName} • Niveau ${data.level} • Aura : ${data.auraScore}% • Puissance : ${data.peakPower} AU ! 🔥`,
      `تحقق من مستوى هالتي الرياضية وإحصائياتي في YARD300! الرتبة: ${data.tier} • شحن الهالة: ${data.auraScore}% • أقصى قوة: ${data.peakPower} AU! 🔥`
    );

    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}&via=YAMSUW300`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto yard-slim-scrollbar">
      <div
        className={`bg-[#080D0B] border border-emerald-500/50 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-[0_0_60px_rgba(16,185,129,0.25)] relative my-8 ${
          isAr ? 'text-right' : 'text-left'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-[#0C1411] border border-white/10 transition-colors z-20 cursor-pointer"
          title={t('Close', 'Cerrar', 'Fermer', 'إغلاق')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C1411] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-black font-anime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isGuestView
                ? t('SHARED CHAMPION AURA PASSPORT', 'PASAPORTE DE CAMPEÓN COMPARTIDO', 'PASSEPORT CHAMPION PARTAGÉ', 'معاينة هالة البطل المشاركة')
                : t('SHARE MY AURA · DIGITAL PASSPORT', 'COMPARTIR MI AURA · PASAPORTE DIGITAL', 'PARTAGER MON AURA · PASSEPORT DIGITAL', 'مشاركة الهالة الشخصية · جواز السفر الرقمي')}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-black font-anime text-white">
            {isGuestView
              ? t(`${data.athleteName}’s S-Rank Aura`, `Aura S-Rank de ${data.athleteName}`, `Aura S-Rank de ${data.athleteName}`, `هالة البطل: ${data.athleteName}`)
              : t('Broadcast Your Aura Status', 'Comparte tu Estado y Energía', 'Partagez Votre Statut Aura', 'شارك طاقتك وهالتك مع العالم')}
          </h3>

          <p className="text-xs text-slate-300 font-bold max-w-md mx-auto">
            {isGuestView
              ? t(
                  'Biometrically verified profile statistics and dynamic kinetic aura charge.',
                  'Estadísticas de perfil verificadas biométricamente y carga cinética activa.',
                  'Statistiques biométriques vérifiées et charge énergétique cinétique.',
                  'تم التحقق من هذه البيانات بيومترياً عبر محرك YARD300 القتالي.'
                )
              : t(
                  'Generate a unique encrypted link with your verified stats, rank, and live aura charge.',
                  'Genera un enlace único con tus estadísticas verificadas y rango deportivo.',
                  'Générez un lien unique chiffré avec vos statistiques vérifiées et votre rang.',
                  'رابط فريد مشفر يحتوي على رتبتك، طاقتك الحيوية، وأرقامك الرياضية الحالية.'
                )}
          </p>
        </div>

        {/* Athlete Card */}
        <div className="bg-gradient-to-br from-[#0C1411] via-[#080D0B] to-[#050807] p-6 rounded-3xl border border-emerald-500/35 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-black shrink-0">
              <img
                loading="lazy"
                decoding="async"
                src={data.avatar}
                alt={data.athleteName}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-black text-[9px] font-black text-center py-0.5 uppercase tracking-wider font-anime">
                {data.tier}
              </div>
            </div>

            <div className="space-y-1.5 text-center sm:text-start flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="text-xl md:text-2xl font-black font-anime text-white">{data.athleteName}</h4>
                <span className="px-2.5 py-0.5 rounded-lg bg-[#D4AF37] text-black text-[11px] font-black font-anime">
                  {t('LVL', 'NIV', 'NIV', 'مستوى')} {data.level}
                </span>
              </div>
              <p className="text-xs font-bold text-emerald-400">
                {isAr ? data.specializationAr || data.specialization : data.specialization}
              </p>

              <div className="pt-1">
                <div className="flex justify-between text-[11px] font-bold mb-1">
                  <span className="text-[#D4AF37]">{t('Aura Kinetic Charge', 'Carga Cinética Aura', 'Charge Cinétique Aura', 'شحن الهالة الحركية')}</span>
                  <span className="text-emerald-400 font-mono font-black tabular-nums">{data.auraScore}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#050807] rounded-full overflow-hidden p-[1px] border border-emerald-500/30">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#D4AF37] rounded-full" style={{ width: `${data.auraScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-5 mt-5 border-t border-white/[0.08] text-center relative z-10 tabular-nums">
            <div className="p-2.5 rounded-xl bg-[#050807] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block font-bold">{t('Peak Power', 'Potencia', 'Puissance', 'أقصى قوة')}</span>
              <span className="text-xs md:text-sm font-black font-mono text-emerald-400">{data.peakPower.toLocaleString('en-US')} AU</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050807] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block font-bold">{t('Streak', 'Racha', 'Série', 'ستريك قتالي')}</span>
              <span className="text-xs md:text-sm font-black font-mono text-[#D4AF37]">{data.currentStreak}D</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050807] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block font-bold">{t('Calories', 'Calorías', 'Calories', 'حرق السعرات')}</span>
              <span className="text-xs md:text-sm font-black font-mono text-white">{data.calories.toLocaleString('en-US')}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050807] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block font-bold">{t('Aura AP', 'Puntos AP', 'Points AP', 'نقاط الهالة')}</span>
              <span className="text-xs md:text-sm font-black font-mono text-emerald-400">{data.totalAuraPoints.toLocaleString('en-US')}</span>
            </div>
          </div>
        </div>

        {/* Shareable Link Box */}
        <div className="space-y-3">
          <label className="text-xs font-black font-anime text-slate-300 uppercase tracking-wider block">
            {t('UNIQUE SHAREABLE AURA LINK:', 'ENLACE ÚNICO PARA COMPARTIR:', 'LIEN DE PARTAGE UNIQUE :', 'الرابط الفريد المخصص للمشاركة:')}
          </label>

          <div className="flex items-center gap-2 bg-[#050807] p-2 rounded-2xl border border-white/10">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs font-mono text-slate-300 px-2 flex-1 outline-none select-all truncate"
            />

            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-4 py-2.5 rounded-xl font-anime font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                copied ? 'bg-emerald-500 text-black' : 'bg-emerald-500 hover:bg-[#D4AF37] text-black'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>
                {copied
                  ? t('Copied ✓', 'Copiado ✓', 'Copié ✓', 'تم النسخ ✓')
                  : t('Copy Link', 'Copiar', 'Copier', 'نسخ الرابط')}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleShareOnX}
              className="py-3 px-4 rounded-xl bg-[#0C1411] hover:bg-white/10 border border-white/10 text-white font-anime font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-anime font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Zap className="w-4 h-4 text-black" />
                <span>{t('Build Your Aura ⚡', 'Crea tu Aura ⚡', 'Créer Mon Aura ⚡', 'أنشئ هالتك الخاصة ⚡')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-3 px-4 rounded-xl bg-[#0C1411] hover:border-emerald-400 border border-emerald-500/35 text-emerald-400 font-anime font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('Instant Share', 'Compartir Ahora', 'Partage Instantané', 'مشاركة الرابط فوراً')}</span>
              </button>
            )}
          </div>
        </div>

        {copied && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>
              {t(
                'Unique Aura link copied! Share it with friends.',
                '¡Enlace copiado! Compártelo con tu equipo.',
                'Lien Aura copié ! Partagez-le avec vos partenaires.',
                'تم نسخ رابط هالتك الفريد بنجاح! شاركه الآن مع زملائك ومنافسيك.'
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedAuraModal;
