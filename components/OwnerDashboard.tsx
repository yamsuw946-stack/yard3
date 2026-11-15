/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  Layers, 
  CreditCard, 
  Video, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RefreshCw, 
  Download, 
  Upload, 
  ExternalLink, 
  Eye, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  DollarSign,
  Play,
  Key,
  Globe,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Crown,
  Type,
  Tag,
  Palmtree,
  Users
} from 'lucide-react';
import { 
  OwnerConfigService, 
  OwnerSiteConfig, 
  SiteSectionConfig, 
  PaymentGatewayConfig, 
  SiteVideoItem, 
  CustomArticleData,
  DEFAULT_RESORT_CONFIG,
  DEFAULT_BRAND_SITE_SETTINGS
} from '../services/ownerConfigService';
import { PRODUCTS, YARD_BAZARUTO_RESORT_IMAGE, YARD_ISLAND_AERIAL_NIGHT_IMAGE, handleImageError } from '../constants';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';

export type OwnerDashboardTab =
  | 'photos'
  | 'siteCopy'
  | 'catalogPricing'
  | 'resortBrand'
  | 'sections'
  | 'payments'
  | 'videos'
  | 'articles';

interface OwnerDashboardProps {
  currentLang: Language;
  onBackToStore: () => void;
  onNavigateToView?: (viewId: string) => void;
  initialTab?: OwnerDashboardTab;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  currentLang,
  onBackToStore,
  onNavigateToView,
  initialTab = 'photos'
}) => {
  const isAr = currentLang === 'ar';
  const [config, setConfig] = useState<OwnerSiteConfig>(() => OwnerConfigService.getConfig());
  
  // Security / Email & Secret Password protection
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return OwnerConfigService.isOwnerLoggedIn();
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [ownerInfo, setOwnerInfo] = useState(() => OwnerConfigService.getOwnerInfo());
  const [ownerName, setOwnerName] = useState<string>(() => {
    return localStorage.getItem('yard300_owner_name') || 'Yam Suw';
  });
  const [ownerEmail, setOwnerEmail] = useState<string>(() => {
    return localStorage.getItem('yard300_custom_owner_email') || localStorage.getItem('yard300_owner_email') || 'yamsuw946@gmail.com';
  });
  const [ownerPassword, setOwnerPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<OwnerDashboardTab>(initialTab);
  const [catalogLangEdit, setCatalogLangEdit] = useState<string>(currentLang);

  // Status notifications
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Articles state
  const [isEditingArticle, setIsEditingArticle] = useState<boolean>(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [articleForm, setArticleForm] = useState<CustomArticleData>({
    id: Date.now(),
    titleEn: '',
    titleAr: '',
    dateEn: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    dateAr: new Date().toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', year: 'numeric' }),
    excerptEn: '',
    excerptAr: '',
    contentEn: '',
    contentAr: '',
    image: '/images/athlete_mindset_track.jpg',
    category: 'Mindset & Combat',
    author: 'Yam Suw (Founder)'
  });

  // Videos state
  const [isAddingVideo, setIsAddingVideo] = useState<boolean>(false);
  const [videoForm, setVideoForm] = useState<SiteVideoItem>({
    id: `v_${Date.now()}`,
    titleEn: '',
    titleAr: '',
    url: '',
    posterUrl: '/images/ai_human_striker_male.jpg',
    type: 'mp4',
    tag: 'COMBAT',
    featuredIn: 'arena'
  });

  // Selected product image override state
  const [selectedProductForImg, setSelectedProductForImg] = useState<string>(PRODUCTS[0]?.id || '');
  const [productImgInput, setProductImgInput] = useState<string>('');

  // Subscribe to config changes and auth changes
  useEffect(() => {
    const unsub = OwnerConfigService.subscribe((newCfg) => {
      setConfig(newCfg);
    });
    const handleAuthChange = () => {
      setIsAuthenticated(OwnerConfigService.isOwnerLoggedIn());
      setOwnerInfo(OwnerConfigService.getOwnerInfo());
    };
    window.addEventListener('yard300_owner_auth_changed', handleAuthChange);
    return () => {
      unsub();
      window.removeEventListener('yard300_owner_auth_changed', handleAuthChange);
    };
  }, []);

  const triggerToast = (msg: string) => {
    soundFX.playPowerUp();
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast(null);
    }, 3500);
  };

  const handleOwnerLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (OwnerConfigService.loginOwner(ownerEmail, ownerPassword)) {
      soundFX.playSuccess();
      setIsAuthenticated(true);
      setOwnerInfo(OwnerConfigService.getOwnerInfo());
      setAuthError(null);
      triggerToast(tr(currentLang, {
        en: `Welcome ${OwnerConfigService.getOwnerInfo().name}!`,
        es: `¡Bienvenido ${OwnerConfigService.getOwnerInfo().name}!`,
        fr: `Bienvenue ${OwnerConfigService.getOwnerInfo().name} !`,
        ar: `أهلاً بك يا ${OwnerConfigService.getOwnerInfo().name}! تم الدخول بنجاح.`
      }));
    } else {
      soundFX.playLaser();
      setAuthError(tr(currentLang, {
        en: 'Invalid credentials. Access is restricted strictly to the verified store owner.',
        es: 'Credenciales inválidas. Acceso restringido al propietario verificado.',
        fr: 'Identifiants invalides. Accès strictement réservé au propriétaire vérifié.',
        ar: 'بيانات الدخول غير مطابقة. تأكد من إيميل المالك وكلمة السر.'
      }));
    }
  };

  const handleOwnerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerEmail.trim()) {
      setAuthError(tr(currentLang, { en: 'Please enter an email', es: 'Ingresa un correo electrónico', fr: 'Veuillez saisir un e-mail', ar: 'يرجى إدخال البريد الإلكتروني' }));
      return;
    }
    if (!ownerPassword.trim()) {
      setAuthError(tr(currentLang, { en: 'Please enter a secret password', es: 'Ingresa una contraseña secreta', fr: 'Veuillez saisir un mot de passe secret', ar: 'يرجى كتابة رقم سري خاص' }));
      return;
    }
    if (ownerPassword.length < 4) {
      setAuthError(tr(currentLang, { en: 'Password must be at least 4 characters', es: 'La contraseña debe tener al menos 4 caracteres', fr: 'Le mot de passe doit comporter au moins 4 caractères', ar: 'يجب أن لا يقل الرقم السري عن 4 خانات' }));
      return;
    }
    if (ownerPassword !== confirmPassword) {
      setAuthError(tr(currentLang, { en: 'Passwords do not match', es: 'Las contraseñas no coinciden', fr: 'Les mots de passe ne correspondent pas', ar: 'الرقم السري وتأكيد الرقم السري غير متطابقين' }));
      return;
    }

    const regName = ownerName.trim() || 'Yam Suw';
    const success = OwnerConfigService.registerOwner(regName, ownerEmail, ownerPassword);
    if (success) {
      soundFX.playLevelUp();
      setIsAuthenticated(true);
      setOwnerInfo({ name: regName, email: ownerEmail.trim().toLowerCase() });
      setAuthError(null);
      const createdMsg = tr(currentLang, {
        en: `Owner account registered for ${regName}!`,
        es: `¡Cuenta de propietario registrada para ${regName}!`,
        fr: `Compte propriétaire enregistré pour ${regName} !`,
        ar: `تم تسجيل وتفعيل حسابك كمالك رسمي (${regName}) بنجاح!`
      });
      setAuthSuccessMsg(createdMsg);
      triggerToast(createdMsg);
    }
  };

  const handleLogout = () => {
    soundFX.playButtonClick();
    OwnerConfigService.logoutOwner();
    setIsAuthenticated(false);
    onBackToStore();
  };

  const persistConfig = (updated: OwnerSiteConfig, toastMsg?: string) => {
    setConfig(updated);
    OwnerConfigService.saveConfig(updated);
    triggerToast(toastMsg || tr(currentLang, {
      en: 'Changes saved & applied live!',
      es: '¡Cambios guardados y aplicados en vivo!',
      fr: 'Modifications enregistrées et appliquées en direct !',
      ar: 'تم حفظ وتطبيق التعديلات بنجاح!'
    }));
  };

  // Section Toggles
  const handleToggleSection = (sectionId: string) => {
    soundFX.playButtonClick();
    const updatedSections = config.sections.map(s => 
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    persistConfig({ ...config, sections: updatedSections }, tr(currentLang, {
      en: 'Section status updated live',
      es: 'Estado de sección actualizado en vivo',
      fr: 'Statut de la section mis à jour en direct',
      ar: 'تم تحديث حالة القسم مباشرة'
    }));
  };

  // Payment Gateway Toggles
  const handleToggleGateway = (gatewayId: string) => {
    soundFX.playButtonClick();
    const updatedGateways = config.payments.gateways.map(g => 
      g.id === gatewayId ? { ...g, enabled: !g.enabled } : g
    );
    const updatedPayments = { ...config.payments, gateways: updatedGateways };
    persistConfig({ ...config, payments: updatedPayments }, tr(currentLang, {
      en: 'Payment gateways updated live',
      es: 'Pasarelas de pago actualizadas en vivo',
      fr: 'Passerelles de paiement mises à jour en direct',
      ar: 'تم تحديث بوابات الدفع في المتجر'
    }));
  };

  // Update Treasury Addresses
  const handleSaveTreasury = (eth: string, trc: string, sol: string, discount: number) => {
    soundFX.playButtonClick();
    const updatedPayments = {
      ...config.payments,
      treasuryEthAddress: eth,
      treasuryTrc20Address: trc,
      treasurySolanaAddress: sol,
      cryptoDiscountPercent: discount
    };
    persistConfig({ ...config, payments: updatedPayments }, tr(currentLang, {
      en: 'Treasury addresses & discount saved',
      es: 'Direcciones de tesorería y descuento guardados',
      fr: 'Adresses de trésorerie et remise enregistrées',
      ar: 'تم حفظ عناوين الخزينة والخصومات'
    }));
  };

  // Media Saves
  const handleSaveMedia = (heroImg: string, heroBanner: string, brandLogo: string) => {
    soundFX.playButtonClick();
    const updatedMedia = {
      ...config.media,
      heroImage: heroImg,
      heroBanner: heroBanner,
      brandLogo: brandLogo
    };
    persistConfig({ ...config, media: updatedMedia }, isAr ? 'تم تحديث صور الهيرو والشعار مباشرة' : 'Hero & Logo images updated live');
  };

  const handleSetProductImageOverride = () => {
    if (!selectedProductForImg || !productImgInput) return;
    soundFX.playButtonClick();
    const updatedOverrides = {
      ...config.media.productImageOverrides,
      [selectedProductForImg]: productImgInput
    };
    const updatedMedia = {
      ...config.media,
      productImageOverrides: updatedOverrides
    };
    persistConfig({ ...config, media: updatedMedia }, isAr ? 'تم تحديث صورة المنتج في المتجر' : 'Product image updated in store');
    setProductImgInput('');
  };

  const handleClearProductOverride = (prodId: string) => {
    soundFX.playButtonClick();
    const updatedOverrides = { ...config.media.productImageOverrides };
    delete updatedOverrides[prodId];
    persistConfig({
      ...config,
      media: { ...config.media, productImageOverrides: updatedOverrides }
    }, isAr ? 'تمت استعادة الصورة الأصلية للمنتج' : 'Restored original product photo');
  };

  // Video Management
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.titleEn && !videoForm.titleAr) return;
    if (!videoForm.url) return;
    soundFX.playPowerUp();

    let updatedVideos = [...config.videos];
    const existingIndex = updatedVideos.findIndex(v => v.id === videoForm.id);
    if (existingIndex >= 0) {
      updatedVideos[existingIndex] = videoForm;
    } else {
      updatedVideos.unshift(videoForm);
    }

    persistConfig({ ...config, videos: updatedVideos }, isAr ? 'تم نشر الفيديو في الموقع!' : 'Video published to live site!');
    setIsAddingVideo(false);
    setVideoForm({
      id: `v_${Date.now()}`,
      titleEn: '',
      titleAr: '',
      url: '',
      posterUrl: '/images/ai_human_striker_male.jpg',
      type: 'mp4',
      tag: 'COMBAT',
      featuredIn: 'arena'
    });
  };

  const handleDeleteVideo = (videoId: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا الفيديو؟' : 'Are you sure you want to delete this video?')) return;
    soundFX.playButtonClick();
    const updated = config.videos.filter(v => v.id !== videoId);
    persistConfig({ ...config, videos: updated }, isAr ? 'تم حذف الفيديو' : 'Video deleted');
  };

  // Article Management
  const handleOpenNewArticle = () => {
    soundFX.playButtonClick();
    setSelectedArticleId(null);
    setArticleForm({
      id: Date.now(),
      titleEn: '',
      titleAr: '',
      dateEn: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      dateAr: new Date().toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', year: 'numeric' }),
      excerptEn: '',
      excerptAr: '',
      contentEn: '',
      contentAr: '',
      image: '/images/athlete_mindset_track.jpg',
      category: 'Combat Mindset',
      author: 'Yam Suw (Founder)'
    });
    setIsEditingArticle(true);
  };

  const handleEditArticle = (article: CustomArticleData) => {
    soundFX.playButtonClick();
    setSelectedArticleId(article.id);
    setArticleForm(article);
    setIsEditingArticle(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.titleEn && !articleForm.titleAr) return;
    soundFX.playPowerUp();

    let updatedArticles = [...config.articles];
    if (selectedArticleId !== null) {
      updatedArticles = updatedArticles.map(a => a.id === selectedArticleId ? articleForm : a);
    } else {
      updatedArticles.unshift(articleForm);
    }

    persistConfig({ ...config, articles: updatedArticles }, isAr ? 'تم نشر المقال في مجلة YARD300!' : 'Article published to live Journal!');
    setIsEditingArticle(false);
  };

  const handleDeleteArticle = (articleId: number) => {
    if (!confirm(isAr ? 'هل تريد بالتأكيد حذف هذا المقال من المجلة؟' : 'Are you sure you want to delete this article?')) return;
    soundFX.playButtonClick();
    const updated = config.articles.filter(a => a.id !== articleId);
    persistConfig({ ...config, articles: updated }, isAr ? 'تم حذف المقال' : 'Article removed');
  };

  // Announcement Banner
  const handleToggleAnnouncement = () => {
    soundFX.playButtonClick();
    persistConfig({
      ...config,
      announcement: {
        ...config.announcement,
        enabled: !config.announcement.enabled
      }
    }, isAr ? 'تم تحديث شريط الإعلانات العلوي' : 'Top announcement bar updated');
  };

  const handleSaveAnnouncement = (textEn: string, textAr: string, link: string) => {
    soundFX.playButtonClick();
    persistConfig({
      ...config,
      announcement: {
        ...config.announcement,
        textEn,
        textAr,
        link
      }
    }, isAr ? 'تم حفظ نص الإعلان العلوي' : 'Top announcement banner text saved');
  };

  // Export / Import
  const handleExportJSON = () => {
    soundFX.playButtonClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `yard300_owner_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast(isAr ? 'تم تصدير نسخة احتياطية من الإعدادات!' : 'Configuration backup exported!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && (imported.sections || imported.payments || imported.media)) {
          persistConfig(imported, isAr ? 'تم استيراد وتطبيق الإعدادات بنجاح!' : 'Configuration imported successfully!');
        } else {
          alert(isAr ? 'ملف التكوين غير صالح' : 'Invalid configuration file');
        }
      } catch (err) {
        alert(isAr ? 'فشل قراءة الملف' : 'Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetFactory = () => {
    if (confirm(isAr ? '⚠️ هل أنت متأكد من إعادة ضبط كل شيء إلى الإعدادات الافتراضية للبراند؟' : '⚠️ Reset all site settings to factory defaults?')) {
      soundFX.playButtonClick();
      const fresh = OwnerConfigService.resetToDefaults();
      setConfig(fresh);
      triggerToast(isAr ? 'تمت استعادة الإعدادات الافتراضية بنجاح' : 'Reset to default factory settings');
    }
  };

  // If not authenticated, show Owner Authentication Lock Screen
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-[#07080C] text-white pt-28 pb-16 px-4 md:px-8 flex flex-col items-center justify-center relative ${isAr ? 'text-right' : 'text-left'}`}>
        <div className="w-full max-w-lg bg-[#0C0E14] border border-white/[0.1] rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <div className="text-center mb-6">
            <span className="text-[10px] font-black font-anime text-[#FFE600] tracking-widest uppercase block mb-1">
              EXCLUSIVE PRIVATE OWNER PORTAL // بوابة المالك المعتمد
            </span>
            <h1 className="text-2xl md:text-3xl font-black font-anime text-white">
              {authMode === 'login' 
                ? tr(currentLang, { en: 'Owner Secure Sign-In', es: 'Acceso Seguro del Propietario', fr: 'Connexion Sécurisée Propriétaire', ar: 'تسجيل دخول المالك' })
                : tr(currentLang, { en: 'Register Owner Account', es: 'Registrar Cuenta de Propietario', fr: 'Créer un Compte Propriétaire', ar: 'تسجيل / ضبط حساب المالك' })}
            </h1>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              {tr(currentLang, {
                en: 'Restricted strictly to the verified store owner. Opens under your personal name & secret password, completely hidden from public visitors.',
                es: 'Acceso exclusivo para el propietario verificado. Se abre con tu nombre y contraseña secreta, oculto al público.',
                fr: 'Strictement réservé au propriétaire vérifié. Accessible uniquement avec votre nom et mot de passe secret, caché au public.',
                ar: 'هذه البوابة مشفرة ومخصصة لك حصراً لتفتح باسمك وبرقمك السري الخاص، ولا تظهر إطلاقاً للجمهور أو زوار المتجر.'
              })}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#141624] p-1 rounded-2xl border border-gray-800 mb-6 text-xs font-anime">
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setAuthMode('login');
                setAuthError(null);
                setAuthSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all font-black text-center cursor-pointer ${
                authMode === 'login' 
                  ? 'bg-[#E50914] text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{tr(currentLang, { en: 'Sign In', es: 'Iniciar Sesión', fr: 'Connexion', ar: 'تسجيل الدخول' })}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setAuthMode('register');
                setAuthError(null);
                setAuthSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all font-black text-center cursor-pointer ${
                authMode === 'register' 
                  ? 'bg-[#FFE600] text-black shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{tr(currentLang, { en: 'Register / Custom Name', es: 'Registrar / Nombre', fr: 'Créer / Nom Perso', ar: 'تسجيل / ضبط الحساب باسمك' })}</span>
            </button>
          </div>

          {authSuccessMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-[#FF007A] text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#FF007A]" />
              <span>{authError}</span>
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleOwnerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider font-anime">
                  {tr(currentLang, { en: 'Registered Owner Email:', es: 'Correo del Propietario:', fr: 'E-mail du Propriétaire :', ar: 'البريد الإلكتروني المسجل:' })}
                </label>
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => {
                    setOwnerEmail(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="yamsuw946@gmail.com"
                  className="w-full bg-[#141624] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono text-xs outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider font-anime">
                  {tr(currentLang, { en: 'Secret Owner Password:', es: 'Contraseña Secreta:', fr: 'Mot de Passe Secret :', ar: 'الرقم السري الخاص بك:' })}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={ownerPassword}
                    onChange={(e) => {
                      setOwnerPassword(e.target.value);
                      setAuthError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm tracking-[0.2em] outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all"
                    autoFocus
                  />
                  <Key className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-400">
                  <span>{tr(currentLang, { en: 'Default Owner PIN: 300 or yard300', es: 'PIN por defecto: 300 o yard300', fr: 'PIN par défaut : 300 ou yard300', ar: 'الرقم الافتراضي للمالك: 300 أو yard300' })}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOwnerEmail('yamsuw946@gmail.com');
                      setOwnerPassword('300');
                      setAuthError(null);
                    }}
                    className="text-[#FFE600] hover:underline cursor-pointer font-bold"
                  >
                    {tr(currentLang, { en: 'Auto-fill (Yam Suw)', es: 'Autocompletar (Yam Suw)', fr: 'Auto-remplir (Yam Suw)', ar: 'تعبئة تلقائية (Yam Suw)' })}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#E50914] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#E50914] text-white font-black font-anime text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{tr(currentLang, { en: 'Sign In as Verified Owner', es: 'Acceder como Propietario', fr: 'Connexion Propriétaire Vérifié', ar: 'دخول لوحة تحكم وتعديل المالك' })}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleOwnerRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider font-anime">
                  {tr(currentLang, { en: 'Owner Display Name:', es: 'Nombre del Propietario:', fr: 'Nom d’Affichage Propriétaire :', ar: 'اسم المالك (يظهر في أعلى اللوحة):' })}
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => {
                    setOwnerName(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="Yam Suw"
                  className="w-full bg-[#141624] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-sans text-xs outline-none focus:border-[#FFE600] focus:ring-1 focus:ring-[#FFE600] transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider font-anime">
                  {tr(currentLang, { en: 'Personal Owner Email:', es: 'Correo Personal:', fr: 'E-mail Personnel :', ar: 'البريد الإلكتروني الخاص بك:' })}
                </label>
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => {
                    setOwnerEmail(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="yamsuw946@gmail.com"
                  className="w-full bg-[#141624] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono text-xs outline-none focus:border-[#FFE600] focus:ring-1 focus:ring-[#FFE600] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider font-anime">
                    {tr(currentLang, { en: 'Secret Password:', es: 'Contraseña:', fr: 'Mot de passe :', ar: 'الرقم السري الجديد:' })}
                  </label>
                  <input
                    type="password"
                    required
                    value={ownerPassword}
                    onChange={(e) => {
                      setOwnerPassword(e.target.value);
                      setAuthError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono text-xs tracking-wider outline-none focus:border-[#FFE600] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider font-anime">
                    {tr(currentLang, { en: 'Confirm Password:', es: 'Confirmar Contraseña:', fr: 'Confirmer :', ar: 'تأكيد الرقم السري:' })}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setAuthError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono text-xs tracking-wider outline-none focus:border-[#FFE600] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#FFE600] to-[#FFB700] hover:from-[#FFB700] hover:to-[#FFE600] text-black font-black font-anime text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,230,0,0.4)] cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Check className="w-4 h-4 text-black" />
                <span>{tr(currentLang, { en: 'Register & Launch Owner Dashboard', es: 'Registrar y Abrir Panel', fr: 'Enregistrer et Ouvrir le Tableau', ar: 'تسجيل وحفظ حساب المالك وتفعيل اللوحة فوراً' })}</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-gray-800 text-center">
            <button
              type="button"
              onClick={onBackToStore}
              className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 font-anime"
            >
              <span>{tr(currentLang, { en: '← Return to Public Store', es: '← Volver a la Tienda', fr: '← Retour à la Boutique', ar: '← العودة إلى المتجر العام' })}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Live Authenticated Dashboard
  return (
    <div className={`min-h-screen bg-[#07080C] text-white pt-24 pb-20 px-4 md:px-8 relative ${isAr ? 'text-right' : 'text-left'}`}>
      {/* Floating Save Confirmation Toast */}
      {saveToast && (
        <div className={`fixed top-20 ${isAr ? 'left-6' : 'right-6'} z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-black font-black text-xs shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      <div className="max-w-[1700px] mx-auto relative z-10 space-y-8">
        
        {/* Top Command Bar */}
        <div className="bg-[#0C0E14] border border-white/[0.08] rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-xl backdrop-blur-xl">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-mono font-bold text-[#D4AF37] tracking-widest uppercase">
                {tr(currentLang, {
                  en: 'FULL-SITE CONTROL STUDIO // VERIFIED EXCLUSIVE',
                  es: 'ESTUDIO DE CONTROL TOTAL // EXCLUSIVO VERIFICADO',
                  fr: 'STUDIO DE CONTRÔLE COMPLET // EXCLUSIF VÉRIFIÉ',
                  ar: 'لوحة التحكم والتعديل الشامل للموقع // جلسة خاصة ومحمية'
                })}
              </span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Crown className="w-3 h-3 text-[#D4AF37]" />
                <span>{ownerInfo.name}</span>
                <span className="opacity-75">({ownerInfo.email})</span>
              </span>
              <span className="text-[10px] bg-white/[0.05] text-slate-300 border border-white/[0.1] px-2.5 py-0.5 rounded-full font-mono">
                Ctrl+Shift+Y · #admin
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              {tr(currentLang, { en: 'YARD 300 ', es: 'YARD 300 ', fr: 'YARD 300 ', ar: 'لوحة التحكم الشاملة · ' })}
              <span className="text-[#D4AF37]">{isAr ? ownerInfo.name : `CONTROL: ${ownerInfo.name}`}</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm max-w-2xl font-medium">
              {tr(currentLang, {
                en: 'Live full-site editor: customize Hero texts & KPIs, products & pricing, Bazaruto Resort & Founders, photos, sections, payments, videos, and editorial articles.',
                es: 'Editor integral en vivo: personaliza textos Hero y KPIs, productos y precios, Bazaruto Resort y Fundadores, fotos, secciones, pagos, videos y artículos.',
                fr: 'Éditeur complet en direct : personnalisez textes Hero et KPIs, produits et prix, Bazaruto Resort et Fondateurs, photos, sections, paiements, vidéos et articles.',
                ar: 'تحكم وتعديل مباشر وفوري على كل شيء في الموقع: النصوص والعناوين، المنتجات والأسعار، المنتجع والمؤسسون، الصور، الأقسام، الدفع، الفيديوهات، والمقالات.'
              })}
            </p>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onBackToStore}
              className="px-4 py-2.5 bg-[#141624] hover:bg-[#1E2238] border border-gray-700 hover:border-gray-500 text-white rounded-xl text-xs font-black font-anime transition-all flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#00F0FF]" />
              <span>{tr(currentLang, { en: 'View Live Store', es: 'Ver Tienda en Vivo', fr: 'Voir la Boutique', ar: 'معاينة المتجر المباشر' })}</span>
            </button>

            <button
              onClick={handleExportJSON}
              title={tr(currentLang, { en: 'Export Backup JSON', es: 'Exportar Respaldo JSON', fr: 'Exporter Sauvegarde JSON', ar: 'تصدير نسخة احتياطية' })}
              className="p-2.5 bg-[#141624] hover:bg-[#1E2238] border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl text-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              title={tr(currentLang, { en: 'Import Backup JSON', es: 'Importar Respaldo JSON', fr: 'Importer Sauvegarde JSON', ar: 'استيراد نسخة احتياطية' })}
              className="p-2.5 bg-[#141624] hover:bg-[#1E2238] border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl text-xs transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleResetFactory}
              title={tr(currentLang, { en: 'Reset to Default', es: 'Restablecer Fábrica', fr: 'Réinitialiser', ar: 'استعادة ضبط المصنع' })}
              className="p-2.5 bg-[#1A1215] hover:bg-[#2B151B] border border-red-900/60 text-red-400 hover:text-red-300 rounded-xl text-xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 inline mr-1" />
              <span>{tr(currentLang, { en: 'Lock', es: 'Bloquear', fr: 'Verrouiller', ar: 'قفل' })}</span>
            </button>
          </div>
        </div>

        {/* Global Stats Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-[#090B12] border border-gray-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#E50914]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black font-anime text-white">
                {Object.keys(config.media.productImageOverrides).length + 2}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-anime">{tr(currentLang, { en: 'Custom Media', es: 'Medios Propios', fr: 'Médias Perso', ar: 'الصور المخصصة' })}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090B12] border border-gray-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7000FF]/20 border border-[#7000FF]/40 flex items-center justify-center text-[#00F0FF]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black font-anime text-white">
                {config.sections.filter(s => s.enabled).length} / {config.sections.length}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-anime">{tr(currentLang, { en: 'Active Sections', es: 'Secciones Activas', fr: 'Sections Actives', ar: 'الأقسام النشطة' })}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090B12] border border-gray-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black font-anime text-white">
                {config.payments.gateways.filter(g => g.enabled).length} / {config.payments.gateways.length}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-anime">{tr(currentLang, { en: 'Payment Methods', es: 'Métodos de Pago', fr: 'Paiements', ar: 'بوابات الدفع' })}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090B12] border border-gray-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black font-anime text-white">
                {config.videos.length}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-anime">{tr(currentLang, { en: 'Live Videos', es: 'Videos en Vivo', fr: 'Vidéos en Direct', ar: 'الفيديوهات الحية' })}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090B12] border border-gray-800/80 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-[#00F0FF]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black font-anime text-white">
                {config.articles.length}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-anime">{tr(currentLang, { en: 'Journal Articles', es: 'Artículos', fr: 'Articles Journal', ar: 'مقالات المجلة' })}</span>
            </div>
          </div>
        </div>

        {/* Tab Selector Navigation */}
        <div className="flex border-b border-gray-800 overflow-x-auto gap-2 pb-3">
          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('siteCopy');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black font-anime text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'siteCopy'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>{tr(currentLang, { en: 'Hero & Copy', es: 'Hero y Textos', fr: 'Hero & Textes', ar: 'النصوص والعناوين' })}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('catalogPricing');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black font-anime text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'catalogPricing'
                ? 'bg-gradient-to-r from-[#E50914] to-[#B91C1C] text-white shadow-[0_0_20px_rgba(229,9,20,0.45)]'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>{tr(currentLang, { en: 'Products & Pricing', es: 'Productos y Precios', fr: 'Produits & Prix', ar: 'المنتجات والأسعار' })}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('resortBrand');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black font-anime text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'resortBrand'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-black shadow-[0_0_20px_rgba(16,185,129,0.45)]'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <Palmtree className="w-4 h-4" />
            <span>{tr(currentLang, { en: 'Resort, Founders & Footer', es: 'Resort, Fundadores y Pie', fr: 'Resort, Fondateurs & Pied', ar: 'المنتجع، المؤسسون والفوتر' })}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('photos');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black font-anime text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'photos'
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.35)]'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{tr(currentLang, { en: 'Photos & Logo', es: 'Fotos y Logo', fr: 'Photos & Logo', ar: 'الصور والشعار' })}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('sections');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black font-anime text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sections'
                ? 'bg-gradient-to-r from-[#7000FF] to-[#4F46E5] text-white shadow-[0_0_20px_rgba(112,0,255,0.45)]'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{tr(currentLang, { en: 'Sections & Banner', es: 'Secciones y Banner', fr: 'Sections & Bannière', ar: 'الأقسام والإعلانات' })}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('payments');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black font-anime text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'payments'
                ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-black shadow-[0_0_20px_rgba(16,185,129,0.45)]'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{tr(currentLang, { en: 'Payments', es: 'Pagos', fr: 'Paiements', ar: 'بوابات الدفع' })}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('videos');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black font-anime text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black shadow-[0_0_20px_rgba(245,158,11,0.45)]'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{tr(currentLang, { en: 'Videos', es: 'Videos', fr: 'Vidéos', ar: 'الفيديوهات' })}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('articles');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black font-anime text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'articles'
                ? 'bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black shadow-[0_0_20px_rgba(0,240,255,0.45)]'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'المجلة والمقالات' : 'Journal CMS'}</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: PHOTOS & MEDIA (صور الموقع والمنتجات)
        ========================================================================= */}
        {activeTab === 'photos' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Hero & Brand Images Card */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#E50914]" />
                    <span>{isAr ? 'صور الهيرو والشعار الرئيسي' : 'Hero Image & Official Logo'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAr 
                      ? 'يمكنك تغيير صورة الخلفية الرئيسية للهيرو، أو شعار البراند، وستنعكس فوراً على المتجر.'
                      : 'Customize the main hero anime warrior background, banner, and brand logo.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Hero Image Control */}
                <div className="p-4 rounded-2xl bg-[#10121C] border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-300 font-anime uppercase">
                      {isAr ? 'صورة الهيرو الرئيسية (Hero Character):' : 'Main Hero Image URL:'}
                    </label>
                    <span className="text-[10px] text-[#FFE600] font-mono">Live Sync</span>
                  </div>

                  <div className="w-full h-44 rounded-xl overflow-hidden bg-black relative border border-gray-800">
                    <img 
                      src={config.media.heroImage} 
                      alt="Hero Preview" 
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <input
                    type="text"
                    value={config.media.heroImage}
                    onChange={(e) => {
                      const updated = { ...config.media, heroImage: e.target.value };
                      setConfig({ ...config, media: updated });
                    }}
                    placeholder="/images/hero_banderas_muscular.jpg"
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37] font-mono"
                  />

                  {/* Preset Quick Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-gray-400 font-bold self-center mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config.media, heroImage: '/images/hero_banderas_muscular.jpg' };
                        persistConfig({ ...config, media: updated });
                      }}
                      className="px-2 py-0.5 rounded bg-[#1D2032] hover:bg-gray-700 text-[10px] text-gray-300 font-mono"
                    >
                      Hero Muscular
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config.media, heroImage: '/images/ai_human_tactical_male.jpg' };
                        persistConfig({ ...config, media: updated });
                      }}
                      className="px-2 py-0.5 rounded bg-[#1D2032] hover:bg-gray-700 text-[10px] text-gray-300 font-mono"
                    >
                      Tactical Athlete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config.media, heroImage: '/images/ai_human_arena_duo.jpg' };
                        persistConfig({ ...config, media: updated });
                      }}
                      className="px-2 py-0.5 rounded bg-[#1D2032] hover:bg-gray-700 text-[10px] text-gray-300 font-mono"
                    >
                      Performance Arena
                    </button>
                  </div>
                </div>

                {/* Brand Logo Control */}
                <div className="p-4 rounded-2xl bg-[#10121C] border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-300 font-anime uppercase">
                      {isAr ? 'شعار البراند (YARD 300 Brand Shield Logo):' : 'Brand Shield Logo URL:'}
                    </label>
                    <span className="text-[10px] text-[#00F0FF] font-mono">Navbar &amp; Badge</span>
                  </div>

                  <div className="w-full h-44 rounded-xl bg-black border border-gray-800 flex items-center justify-center p-4">
                    <img 
                      src={config.media.brandLogo} 
                      alt="Logo Preview" 
                      onError={handleImageError}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    />
                  </div>

                  <input
                    type="text"
                    value={config.media.brandLogo}
                    onChange={(e) => {
                      const updated = { ...config.media, brandLogo: e.target.value };
                      setConfig({ ...config, media: updated });
                    }}
                    placeholder="/images/yard_red_black_white_logo.jpg"
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#E50914] font-mono"
                  />

                  {/* Preset Quick Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-gray-400 font-bold self-center mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config.media, brandLogo: '/images/yard_red_black_white_logo.jpg' };
                        persistConfig({ ...config, media: updated });
                      }}
                      className="px-2 py-0.5 rounded bg-[#1D2032] hover:bg-gray-700 text-[10px] text-[#E50914] font-black font-anime"
                    >
                      Red/Black/White Combat Shield (Official)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config.media, brandLogo: '/images/yard300_logo_pro_1791632938803.jpg' };
                        persistConfig({ ...config, media: updated });
                      }}
                      className="px-2 py-0.5 rounded bg-[#1D2032] hover:bg-gray-700 text-[10px] text-gray-300 font-anime"
                    >
                      Pro Emblem
                    </button>
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveMedia(config.media.heroImage, config.media.heroBanner, config.media.brandLogo)}
                  className="px-5 py-2.5 bg-white hover:bg-gray-200 text-black font-black font-anime text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? 'حفظ وتطبيق صور الهيرو' : 'Save Hero & Logo Settings'}</span>
                </button>
              </div>
            </div>

            {/* Product Image Overrides */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-800 pb-4">
                <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#FFE600]" />
                  <span>{isAr ? 'تغيير صور أي منتج في المتجر' : 'Product Photo Customizer'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {isAr 
                    ? 'اختر أي منتج من كتالوج YARD 300 وحدد صورة جديدة له؛ ستتغير فوراً في شبكة المنتجات وصفحة التفاصيل.'
                    : 'Select any product in the catalog and override its display photo in real time.'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Product Selector Column */}
                <div className="lg:col-span-5 space-y-3">
                  <label className="text-xs font-bold text-gray-300 font-anime uppercase block">
                    {isAr ? 'اختر المنتج المراد تعديل صورته:' : 'Select Target Product:'}
                  </label>
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {PRODUCTS.map(p => {
                      const isOverridden = Boolean(config.media.productImageOverrides[p.id]);
                      const currentImg = config.media.productImageOverrides[p.id] || p.imageUrl;
                      const isSelected = selectedProductForImg === p.id;

                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedProductForImg(p.id);
                            setProductImgInput(currentImg);
                          }}
                          className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#181C2E] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)] text-white'
                              : 'bg-[#0E1018] border-gray-800 hover:border-gray-700 text-gray-400'
                          }`}
                        >
                          <img 
                            src={currentImg} 
                            alt={p.name} 
                            onError={handleImageError}
                            className="w-12 h-12 rounded-lg object-cover bg-black shrink-0"
                          />
                          <div className="overflow-hidden flex-1">
                            <span className="font-anime font-black text-xs block text-white truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-2">
                              <span>${p.price}</span>
                              {isOverridden && (
                                <span className="text-[#FFE600] font-bold text-[9px] bg-[#FFE600]/10 px-1.5 rounded">
                                  Custom Photo
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Editor Column */}
                <div className="lg:col-span-7 bg-[#10121C] border border-gray-800 rounded-2xl p-5 space-y-4">
                  {(() => {
                    const selProd = PRODUCTS.find(p => p.id === selectedProductForImg) || PRODUCTS[0];
                    const activeImg = config.media.productImageOverrides[selProd.id] || selProd.imageUrl;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-black font-anime text-[#00F0FF]">
                              EDITING: {selProd.name}
                            </span>
                            <span className="text-[10px] text-gray-400 block font-mono">
                              ID: {selProd.id} &bull; Cat: {selProd.category}
                            </span>
                          </div>
                          {config.media.productImageOverrides[selProd.id] && (
                            <button
                              type="button"
                              onClick={() => handleClearProductOverride(selProd.id)}
                              className="text-[10px] text-red-400 hover:text-red-300 font-bold cursor-pointer"
                            >
                              {isAr ? 'استعادة الصورة الافتراضية' : 'Revert to Default'}
                            </button>
                          )}
                        </div>

                        <div className="w-full h-48 rounded-xl bg-black border border-gray-800 overflow-hidden relative">
                          <img 
                            src={productImgInput || activeImg} 
                            alt="Product Preview" 
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-gray-300 mb-1 block font-anime">
                            {isAr ? 'رابط الصورة الجديد (URL / Path):' : 'New Image URL or Asset Path:'}
                          </label>
                          <input
                            type="text"
                            value={productImgInput || activeImg}
                            onChange={(e) => setProductImgInput(e.target.value)}
                            className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00F0FF] font-mono"
                            placeholder="/images/yard_... or https://..."
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleSetProductImageOverride}
                          className="w-full py-2.5 bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black font-black font-anime text-xs rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>{isAr ? 'تطبيق وحفظ صورة هذا المنتج' : 'Apply & Save Product Image'}</span>
                        </button>
                      </>
                    );
                  })()}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: SECTIONS & PAGES (أقسام الموقع والترتيب)
        ========================================================================= */}
        {activeTab === 'sections' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Announcement Bar Controller */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FFE600]" />
                    <span>{isAr ? 'شريط الإعلانات الترويجي العلوي' : 'Top Promotional Announcement Bar'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAr ? 'تفعيل أو تعديل شريط الإعلان المنزلق في أعلى الموقع لترويج العروض أو نزالات الأبطال.' : 'Display a global marquee banner at the top of the site for drops, updates, and events.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleAnnouncement}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-black font-anime cursor-pointer transition-all ${
                    config.announcement.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-gray-900 text-gray-500 border-gray-800'
                  }`}
                >
                  {config.announcement.enabled ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{config.announcement.enabled ? (isAr ? 'مفعل' : 'ENABLED') : (isAr ? 'معطل' : 'DISABLED')}</span>
                </button>
              </div>

              {config.announcement.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      {isAr ? 'النص الإنجليزي للإعلان:' : 'English Announcement Text:'}
                    </label>
                    <input
                      type="text"
                      value={config.announcement.textEn}
                      onChange={(e) => {
                        const updated = { ...config.announcement, textEn: e.target.value };
                        setConfig({ ...config, announcement: updated });
                      }}
                      className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FFE600]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      {isAr ? 'النص العربي للإعلان:' : 'Arabic Announcement Text:'}
                    </label>
                    <input
                      type="text"
                      value={config.announcement.textAr}
                      onChange={(e) => {
                        const updated = { ...config.announcement, textAr: e.target.value };
                        setConfig({ ...config, announcement: updated });
                      }}
                      className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FFE600]"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveAnnouncement(config.announcement.textEn, config.announcement.textAr, config.announcement.link || '#')}
                      className="px-4 py-2 bg-[#FFE600] text-black font-black font-anime text-xs rounded-xl cursor-pointer hover:bg-yellow-300 transition-all flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isAr ? 'حفظ نص الإعلان' : 'Save Banner Text'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* All Site Sections Controller */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-800 pb-4">
                <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#7000FF]" />
                  <span>{isAr ? 'التحكم في ظهور وترتيب أقسام الموقع' : 'Site Sections Visibility & Layout'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {isAr 
                    ? 'يمكنك بنقرة واحدة إظهار أو إخفاء أي قسم في الموقع بالكامل (مثل محرك المؤشرات، حلبة القتال، كوتش الذكاء الاصطناعي، المجلة، الخ).'
                    : 'Toggle any section on or off. Disabled sections will be smoothly hidden from the main view and navigation.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.sections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      section.enabled
                        ? 'bg-[#101322] border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                        : 'bg-[#0A0B10] border-gray-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">
                          ID: #{section.id} &bull; {section.category}
                        </span>
                        <h4 className="font-anime font-black text-sm text-white mt-0.5">
                          {isAr ? section.nameAr : section.nameEn}
                        </h4>
                        <span className="text-xs text-gray-400 block font-sans">
                          {isAr ? section.nameEn : section.nameAr}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleSection(section.id)}
                        className={`p-2 rounded-xl cursor-pointer transition-all ${
                          section.enabled
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                            : 'bg-gray-800 text-gray-500 border border-gray-700'
                        }`}
                        title={section.enabled ? 'Click to Disable' : 'Click to Enable'}
                      >
                        {section.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px]">
                      <span className={`font-bold font-anime ${section.enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {section.enabled ? (isAr ? '✓ القسم معروض في الموقع' : '✓ LIVE ON SITE') : (isAr ? '✕ القسم مخفي' : '✕ HIDDEN')}
                      </span>

                      {onNavigateToView && section.enabled && (
                        <button
                          type="button"
                          onClick={() => onNavigateToView(section.id)}
                          className="text-[#00F0FF] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <span>{isAr ? 'فتح' : 'Open'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: PAYMENT GATEWAYS & TREASURY (طرق الدفع والخزينة)
        ========================================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Merchant Treasury Wallets Configuration */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-800 pb-4">
                <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>{isAr ? 'عناوين محافظ الخزينة المعتمدة (Merchant Crypto Treasury)' : 'Official Merchant Crypto Treasury'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {isAr 
                    ? 'عناوين المحافظ الرقمية التي تستقبل مدفوعات العملاء لطلبات المتجر وترخيص نوادي الأبطال ($30).'
                    : 'The official merchant blockchain addresses receiving client payments for gear and $30 athletic club licenses.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Ethereum / USDT ERC20 */}
                <div className="p-4 rounded-2xl bg-[#10121C] border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-300 font-anime">
                      ETH / Polygon (USDT ERC20):
                    </label>
                    <span className="text-[10px] text-purple-400 font-mono">MetaMask Ready</span>
                  </div>
                  <input
                    type="text"
                    value={config.payments.treasuryEthAddress}
                    onChange={(e) => {
                      const updated = { ...config.payments, treasuryEthAddress: e.target.value };
                      setConfig({ ...config, payments: updated });
                    }}
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                  />
                  <span className="text-[10px] text-gray-500 block">Used by MetaMask & Web3 direct contracts</span>
                </div>

                {/* TRON / USDT TRC20 */}
                <div className="p-4 rounded-2xl bg-[#10121C] border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-300 font-anime">
                      TRON Network (USDT TRC20):
                    </label>
                    <span className="text-[10px] text-red-400 font-mono">Low Gas ($1)</span>
                  </div>
                  <input
                    type="text"
                    value={config.payments.treasuryTrc20Address}
                    onChange={(e) => {
                      const updated = { ...config.payments, treasuryTrc20Address: e.target.value };
                      setConfig({ ...config, payments: updated });
                    }}
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                  />
                  <span className="text-[10px] text-gray-500 block">Fast transfer with instant QR code</span>
                </div>

                {/* Solana Address */}
                <div className="p-4 rounded-2xl bg-[#10121C] border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-300 font-anime">
                      Solana Pay (SOL / USDT):
                    </label>
                    <span className="text-[10px] text-[#00F0FF] font-mono">Sub-second</span>
                  </div>
                  <input
                    type="text"
                    value={config.payments.treasurySolanaAddress}
                    onChange={(e) => {
                      const updated = { ...config.payments, treasurySolanaAddress: e.target.value };
                      setConfig({ ...config, payments: updated });
                    }}
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                  />
                  <span className="text-[10px] text-gray-500 block">Phantom & Solflare instant clearance</span>
                </div>

              </div>

              {/* Crypto Incentive Discount */}
              <div className="p-4 rounded-2xl bg-[#10121C] border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="font-anime font-black text-sm text-white block">
                    {isAr ? 'نسبة الخصم التشجيعي للدفع بالعملات الرقمية (Crypto Discount):' : 'Crypto Incentive Discount Percentage:'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {isAr ? 'خصم فوري يُطبق على إجمالي الفاتورة عند اختيار MetaMask أو USDT.' : 'Instant discount applied automatically in Checkout when paying via Crypto.'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={config.payments.cryptoDiscountPercent}
                    onChange={(e) => {
                      const updated = { ...config.payments, cryptoDiscountPercent: Number(e.target.value) };
                      setConfig({ ...config, payments: updated });
                    }}
                    className="w-20 bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-center text-sm font-black font-anime text-emerald-400 outline-none"
                  />
                  <span className="font-black text-white text-base">% OFF</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveTreasury(
                    config.payments.treasuryEthAddress,
                    config.payments.treasuryTrc20Address,
                    config.payments.treasurySolanaAddress,
                    config.payments.cryptoDiscountPercent
                  )}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-black font-anime text-xs rounded-xl cursor-pointer hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? 'حفظ إعدادات الخزينة والخصومات' : 'Save Treasury & Discount Settings'}</span>
                </button>
              </div>
            </div>

            {/* Payment Gateways List */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-800 pb-4">
                <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>{isAr ? 'تفعيل وتعطيل بوابات الدفع في سلة الشراء' : 'Payment Methods Enabled at Checkout'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {isAr 
                    ? 'تحكم في الخيارات المتاحة للعملاء عند إنهاء الطلب؛ أي خيار تعطل هنا يختفي تلقائياً من صفحة الدفع.'
                    : 'Toggle accepted gateways. Disabled payment options will not appear in the checkout drawer.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.payments.gateways.map((gw) => (
                  <div
                    key={gw.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      gw.enabled
                        ? 'bg-[#101422] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'bg-[#0A0B10] border-gray-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono font-bold block">
                          ID: {gw.id}
                        </span>
                        <h4 className="font-anime font-black text-sm text-white mt-0.5">
                          {isAr ? gw.nameAr : gw.nameEn}
                        </h4>
                        <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                          {isAr ? (gw.feeOrDiscountNoteAr || gw.badgeAr) : (gw.feeOrDiscountNoteEn || gw.badgeEn)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleGateway(gw.id)}
                        className={`p-2 rounded-xl cursor-pointer transition-all ${
                          gw.enabled
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                            : 'bg-gray-800 text-gray-500 border border-gray-700'
                        }`}
                        title={gw.enabled ? 'Click to Disable' : 'Click to Enable'}
                      >
                        {gw.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-gray-800 text-[10px] font-bold font-anime">
                      {gw.enabled ? (
                        <span className="text-emerald-400">{isAr ? '✓ مفعل في الدفع' : '✓ ACTIVE AT CHECKOUT'}</span>
                      ) : (
                        <span className="text-gray-500">{isAr ? '✕ معطل' : '✕ INACTIVE'}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: VIDEOS & DEMOS (الفيديوهات والعروض الترويجية)
        ========================================================================= */}
        {activeTab === 'videos' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-400" />
                    <span>{isAr ? 'إدارة فيديوهات الأبطال والتدريب' : 'Promotional & Combat Videos'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAr 
                      ? 'أضف فيديوهات سينمائية، حركات قتالية، أو عروض للمنتجات (تدعم ملفات MP4 وروابط YouTube المباشرة).'
                      : 'Manage cinematic combat clips, training walkthroughs, and gear trailers.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingVideo(!isAddingVideo)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black font-anime text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingVideo ? (isAr ? 'إلغاء' : 'Cancel') : (isAr ? 'إضافة فيديو جديد' : 'Add New Video')}</span>
                </button>
              </div>

              {/* Add / Edit Video Modal Form */}
              {isAddingVideo && (
                <form onSubmit={handleSaveVideo} className="bg-[#121422] border border-amber-500/40 rounded-2xl p-6 space-y-4">
                  <h4 className="font-anime font-black text-sm text-amber-300">
                    {isAr ? 'معلومات الفيديو الجديد:' : 'New Video Details:'}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">
                        {isAr ? 'عنوان الفيديو بالإنجليزية:' : 'English Video Title:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={videoForm.titleEn}
                        onChange={(e) => setVideoForm({ ...videoForm, titleEn: e.target.value })}
                        placeholder="e.g. S-Rank Shadow Boxing Drill"
                        className="w-full bg-[#1A1D2E] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">
                        {isAr ? 'عنوان الفيديو بالعربية:' : 'Arabic Video Title:'}
                      </label>
                      <input
                        type="text"
                        value={videoForm.titleAr}
                        onChange={(e) => setVideoForm({ ...videoForm, titleAr: e.target.value })}
                        placeholder="مثال: تمرين الملاكمة السريعة لـ S-Rank"
                        className="w-full bg-[#1A1D2E] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">
                        {isAr ? 'رابط الفيديو (Direct MP4 URL or Path):' : 'Video URL (MP4 / WebM):'}
                      </label>
                      <input
                        type="text"
                        required
                        value={videoForm.url}
                        onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                        placeholder="/videos/ryu_combat_move.mp4 or https://..."
                        className="w-full bg-[#1A1D2E] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">
                        {isAr ? 'صورة الغلاف (Poster Image):' : 'Cover Poster Image URL:'}
                      </label>
                      <input
                        type="text"
                        value={videoForm.posterUrl || ''}
                        onChange={(e) => setVideoForm({ ...videoForm, posterUrl: e.target.value })}
                        placeholder="/images/ai_human_striker_male.jpg"
                        className="w-full bg-[#1A1D2E] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingVideo(false)}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-xs font-bold"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-400 text-black rounded-xl text-xs font-black font-anime hover:bg-amber-300"
                    >
                      {isAr ? 'نشر الفيديو في الموقع' : 'Publish Video'}
                    </button>
                  </div>
                </form>
              )}

              {/* Videos Grid with Live Player Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {config.videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-[#10121C] border border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-400/50 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <video
                        src={vid.url}
                        poster={vid.posterUrl}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-amber-400/60 text-amber-300 text-[9px] font-black font-anime pointer-events-none">
                        {vid.tag}
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-anime font-black text-sm text-white group-hover:text-amber-300 transition-colors">
                          {isAr ? vid.titleAr || vid.titleEn : vid.titleEn}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-mono block mt-1 truncate">
                          {vid.url}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                        <span className="text-[10px] text-emerald-400 font-bold font-anime">
                          LIVE IN {vid.featuredIn.toUpperCase()}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 5: WARRIOR JOURNAL CMS (كتابة ونشر المقالات)
        ========================================================================= */}
        {activeTab === 'articles' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#00F0FF]" />
                    <span>{isAr ? 'نظام إدارة ونشر مقالات مجلة YARD300' : 'Warrior Journal Editorial CMS'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAr 
                      ? 'اكتب مقالات حصرية في التمارين، علوم الاستشفاء، التغذية، والمعدات، وانشرها فوراً لتظهر في قسم المجلة لجميع الزوار.'
                      : 'Author high-impact athletic articles, mindset editorials, and science briefings published immediately to the Journal.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewArticle}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black font-black font-anime text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'كتابة مقال جديد' : 'Write New Article'}</span>
                </button>
              </div>

              {/* Rich Article Authoring Form */}
              {isEditingArticle && (
                <form onSubmit={handleSaveArticle} className="bg-[#101322] border-2 border-[#00F0FF]/40 rounded-2xl p-6 md:p-8 space-y-5 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h4 className="font-anime font-black text-base text-[#00F0FF]">
                      {selectedArticleId !== null ? (isAr ? 'تعديل المقال' : 'Edit Article') : (isAr ? 'كتابة مقال جديد' : 'Compose New Article')}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Author: {articleForm.author}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Title EN */}
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1 font-anime">
                        Article Title (English): *
                      </label>
                      <input
                        type="text"
                        required
                        value={articleForm.titleEn}
                        onChange={(e) => setArticleForm({ ...articleForm, titleEn: e.target.value })}
                        placeholder="e.g. Gabbett ACWR: How Elite Strikers Prevent Hamstring Strains"
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#00F0FF]"
                      />
                    </div>

                    {/* Title AR */}
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1 font-anime">
                        عنوان المقال (باللغة العربية): *
                      </label>
                      <input
                        type="text"
                        required
                        value={articleForm.titleAr}
                        onChange={(e) => setArticleForm({ ...articleForm, titleAr: e.target.value })}
                        placeholder="مثال: خوارزمية جابيت للوقاية من تمزق الأوتار للمقاتلين"
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#00F0FF] text-right"
                      />
                    </div>

                    {/* Category & Cover */}
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1 font-anime">
                        Category &amp; Author:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={articleForm.category}
                          onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                          className="bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                        >
                          <option value="Mindset & Combat">Mindset &amp; Combat</option>
                          <option value="Gear Tech">Gear Tech</option>
                          <option value="Biometrics & Recovery">Biometrics &amp; Recovery</option>
                          <option value="Sleep Architecture">Sleep Architecture</option>
                          <option value="Nutrition & Fuel">Nutrition &amp; Fuel</option>
                        </select>
                        <input
                          type="text"
                          value={articleForm.author}
                          onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                          placeholder="Author Name"
                          className="bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1 font-anime">
                        Cover Image URL:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={articleForm.image}
                          onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })}
                          placeholder="/images/athlete_mindset_track.jpg"
                          className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                        />
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-black shrink-0 border border-gray-700">
                          <img src={articleForm.image} alt="Thumb" onError={handleImageError} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                    {/* Excerpt EN */}
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1 font-anime">
                        Short Summary / Excerpt (English):
                      </label>
                      <textarea
                        rows={2}
                        value={articleForm.excerptEn}
                        onChange={(e) => setArticleForm({ ...articleForm, excerptEn: e.target.value })}
                        placeholder="Brief teaser for the article cards..."
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00F0FF]"
                      />
                    </div>

                    {/* Excerpt AR */}
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1 font-anime">
                        نبذة مختصرة (باللغة العربية):
                      </label>
                      <textarea
                        rows={2}
                        value={articleForm.excerptAr}
                        onChange={(e) => setArticleForm({ ...articleForm, excerptAr: e.target.value })}
                        placeholder="نبذة تشويقية تظهر في كروت المجلة..."
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00F0FF] text-right"
                      />
                    </div>

                    {/* Full Content EN */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-300 block mb-1 font-anime">
                        Full Article Content (English):
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={articleForm.contentEn}
                        onChange={(e) => setArticleForm({ ...articleForm, contentEn: e.target.value })}
                        placeholder="Write the full in-depth body of the article here..."
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00F0FF] leading-relaxed"
                      />
                    </div>

                    {/* Full Content AR */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-300 block mb-1 font-anime">
                        المحتوى الكامل للمقال (باللغة العربية):
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={articleForm.contentAr}
                        onChange={(e) => setArticleForm({ ...articleForm, contentAr: e.target.value })}
                        placeholder="اكتب تفاصيل المقال الكاملة هنا باللغة العربية..."
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00F0FF] leading-relaxed text-right"
                      />
                    </div>

                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setIsEditingArticle(false)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black font-black font-anime text-xs rounded-xl cursor-pointer hover:opacity-90 shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isAr ? 'نشر المقال فوراً في المجلة' : 'Publish Article to Live Journal'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Published Articles List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {config.articles.map((art) => (
                  <div
                    key={art.id}
                    className="bg-[#10121C] border border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#00F0FF]/50 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                  >
                    <div className="aspect-[16/10] bg-black overflow-hidden relative">
                      <img 
                        src={art.image} 
                        alt={art.titleEn} 
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-gray-700 text-gray-300 text-[9px] font-anime">
                        {isAr ? art.dateAr : art.dateEn}
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-[#00F0FF] font-black font-anime uppercase tracking-wider block mb-1">
                          {art.category}
                        </span>
                        <h4 className="font-anime font-black text-sm text-white line-clamp-2 leading-tight">
                          {isAr ? art.titleAr : art.titleEn}
                        </h4>
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                          {isAr ? art.excerptAr : art.excerptEn}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-bold">
                          By: {art.author}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditArticle(art)}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            TAB: HERO COPY & KPI NUMBERS (نصوص الواجهة والأرقام الرئيسية)
        ========================================================================= */}
        {activeTab === 'siteCopy' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                    <Type className="w-5 h-5 text-[#D4AF37]" />
                    <span>{isAr ? 'تعديل نصوص الواجهة الرئيسية والأرقام' : 'Hero Banner Texts & Live KPI Metrics'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAr
                      ? 'أي تعديل هنا ينعكس فوراً في الواجهة الرئيسية للموقع (اتركه فارغاً لاستخدام النص الافتراضي).'
                      : 'Edit hero headline segments, eyebrow badge, subtitle, and telemetry numbers. Leave blank to keep defaults.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      persistConfig(
                        { ...config, heroText: { kpi1Value: '+9,999', kpi2Value: '100%', kpi3Value: 'S-RANK' } },
                        isAr ? 'تمت استعادة نصوص الهيرو الافتراضية' : 'Hero texts reset to defaults'
                      );
                    }}
                    className="px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-xs text-gray-300 font-bold cursor-pointer"
                  >
                    {isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}
                  </button>
                  <button
                    type="button"
                    onClick={() => persistConfig({ ...config, heroText: config.heroText }, isAr ? 'تم حفظ نصوص الهيرو بنجاح!' : 'Hero copy saved live!')}
                    className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e5c14a] text-black font-black font-anime text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isAr ? 'حفظ النصوص الآن' : 'Save Hero Copy'}</span>
                  </button>
                </div>
              </div>

              {/* KPI Numbers Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#10121C] border border-gray-800">
                <div>
                  <label className="text-[11px] font-bold text-[#D4AF37] block mb-1">KPI 1 (e.g. +9,999)</label>
                  <input
                    type="text"
                    value={config.heroText?.kpi1Value || ''}
                    onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, kpi1Value: e.target.value } })}
                    placeholder="+9,999"
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#D4AF37] block mb-1">KPI 2 (e.g. 100%)</label>
                  <input
                    type="text"
                    value={config.heroText?.kpi2Value || ''}
                    onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, kpi2Value: e.target.value } })}
                    placeholder="100%"
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#D4AF37] block mb-1">KPI 3 (e.g. S-RANK)</label>
                  <input
                    type="text"
                    value={config.heroText?.kpi3Value || ''}
                    onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, kpi3Value: e.target.value } })}
                    placeholder="S-RANK"
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Bilingual Copy Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Copy */}
                <div className="p-5 rounded-2xl bg-[#10121C] border border-gray-800 space-y-3" dir="ltr">
                  <span className="text-xs font-black text-[#D4AF37] uppercase tracking-wider block">English Hero Copy</span>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Eyebrow Badge (EN)</label>
                    <input
                      type="text"
                      value={config.heroText?.badgeEn || ''}
                      onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, badgeEn: e.target.value } })}
                      placeholder="ATHLETIC PERFORMANCE & RECOVERY"
                      className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Line 1 Part A (White)</label>
                      <input
                        type="text"
                        value={config.heroText?.title1En || ''}
                        onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, title1En: e.target.value } })}
                        placeholder="FORGE YOUR "
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#D4AF37] block mb-1">Line 1 Part B (Gold)</label>
                      <input
                        type="text"
                        value={config.heroText?.title2En || ''}
                        onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, title2En: e.target.value } })}
                        placeholder="LIMITLESS "
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Line 2 Part A (White)</label>
                      <input
                        type="text"
                        value={config.heroText?.title3En || ''}
                        onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, title3En: e.target.value } })}
                        placeholder="ATHLETIC "
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-300 block mb-1">Line 2 Part B (Light)</label>
                      <input
                        type="text"
                        value={config.heroText?.title4En || ''}
                        onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, title4En: e.target.value } })}
                        placeholder="LEGACY"
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Hero Subtitle (EN)</label>
                    <textarea
                      rows={3}
                      value={config.heroText?.subtitleEn || ''}
                      onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, subtitleEn: e.target.value } })}
                      placeholder="Custom athletic gear, AI performance analytics, and private bio-recovery sanctuary..."
                      className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Arabic Copy */}
                <div className="p-5 rounded-2xl bg-[#10121C] border border-gray-800 space-y-3" dir="rtl">
                  <span className="text-xs font-black text-[#D4AF37] uppercase tracking-wider block">النصوص العربية للواجهة</span>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">الشارة العلوية (عربي)</label>
                    <input
                      type="text"
                      value={config.heroText?.badgeAr || ''}
                      onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, badgeAr: e.target.value } })}
                      placeholder="الأداء الرياضي الفائق والاستشفاء الحيوي"
                      className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">السطر 1 (أبيض)</label>
                      <input
                        type="text"
                        value={config.heroText?.title1Ar || ''}
                        onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, title1Ar: e.target.value } })}
                        placeholder="اصنع "
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#D4AF37] block mb-1">السطر 1 (ذهبي)</label>
                      <input
                        type="text"
                        value={config.heroText?.title2Ar || ''}
                        onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, title2Ar: e.target.value } })}
                        placeholder="إرثك القتالي "
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">السطر 2 (أبيض)</label>
                      <input
                        type="text"
                        value={config.heroText?.title3Ar || ''}
                        onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, title3Ar: e.target.value } })}
                        placeholder="بلا "
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-300 block mb-1">السطر 2 (تكميلي)</label>
                      <input
                        type="text"
                        value={config.heroText?.title4Ar || ''}
                        onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, title4Ar: e.target.value } })}
                        placeholder="حدود"
                        className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">النص الفرعي تحت العنوان (عربي)</label>
                    <textarea
                      rows={3}
                      value={config.heroText?.subtitleAr || ''}
                      onChange={(e) => setConfig({ ...config, heroText: { ...config.heroText, subtitleAr: e.target.value } })}
                      placeholder="عتاد رياضي فاخر، تحليلات ذكاء اصطناعي للأداء، ومنتجع استشفاء متكامل..."
                      className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: PRODUCTS, PRICING & CLUB/CAMP LIMITS (المنتجات والأسعار والاشتراكات)
        ========================================================================= */}
        {activeTab === 'catalogPricing' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Club & Camp Global Numbers */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#D4AF37]" />
                    <span>{isAr ? 'أسعار النادي الخاص وسعة الكامب الدولي' : 'Club Membership Price & Global Camp Capacity'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAr ? 'تعديل سعر اشتراك النادي الرياضي وسعة كل معسكر عالمي فوراً.' : 'Configure Club ownership license pricing and global camp athlete limit.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => persistConfig({ ...config }, isAr ? 'تم حفظ إعدادات النادي والكامب!' : 'Club & Camp settings saved!')}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? 'حفظ الإعدادات' : 'Save Limits'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#10121C] border border-gray-800">
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    {isAr ? 'سعر اشتراك النادي الرياضي الخاص ($ USD):' : 'Private Athletic Club Fee ($ USD):'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={config.siteSettings?.clubMembershipPrice ?? 30}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        siteSettings: { ...config.siteSettings, clubMembershipPrice: Number(e.target.value) }
                      })
                    }
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-4 py-2.5 text-sm font-mono text-[#D4AF37] outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-[#10121C] border border-gray-800">
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">
                    {isAr ? 'السعة القصوى لكل معسكر دولي (رياضي):' : 'Global Camp Capacity Limit (Athletes):'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.siteSettings?.campCapacity ?? 300}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        siteSettings: { ...config.siteSettings, campCapacity: Number(e.target.value) }
                      })
                    }
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-4 py-2.5 text-sm font-mono text-[#10B981] outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>
            </div>

            {/* Full Store Catalog Editor */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#E50914]" />
                    <span>{isAr ? 'تحرير جميع منتجات المتجر والأسعار والإخفاء' : 'Full Product Catalog: Names, Prices, Copy & Visibility'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAr
                      ? 'عدّل اسم أو سعر أو وصف أو صورة أي منتج أو قم بإخفائه من المتجر بضغطة واحدة.'
                      : 'Edit any item name, live price, compare-at price, tagline, description, image URL, or toggle visibility.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={catalogLangEdit}
                    onChange={(e) => setCatalogLangEdit(e.target.value)}
                    className="bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="en">Base Catalog: English</option>
                    <option value="ar">الكتالوج الأساسي: العربية</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => persistConfig({ ...config }, isAr ? 'تم حفظ جميع تعديلات المنتجات والأسعار!' : 'All product catalog edits saved live!')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B91C1C] text-white font-black text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isAr ? 'حفظ كل المنتجات' : 'Save All Products'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {OwnerConfigService.getConfiguredProducts(catalogLangEdit, true).map((prod) => {
                  const ov = config.productOverrides?.[prod.id] || {};
                  const isDisabled = Boolean(ov.disabled);

                  const updateProdField = (patch: Record<string, unknown>) => {
                    setConfig({
                      ...config,
                      productOverrides: {
                        ...config.productOverrides,
                        [prod.id]: { ...ov, ...patch }
                      }
                    });
                  };

                  return (
                    <div
                      key={prod.id}
                      className={`p-5 rounded-2xl border space-y-4 transition-all ${
                        isDisabled
                          ? 'bg-[#08090F] border-gray-900 opacity-65'
                          : 'bg-[#10121C] border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                            className="w-14 h-14 rounded-xl object-cover bg-black border border-gray-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-gray-500 block">
                              {prod.id} · {prod.category}
                            </span>
                            <h4 className="font-bold text-sm text-white truncate">{prod.name}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const nextOv = {
                                ...config.productOverrides,
                                [prod.id]: { ...ov, disabled: !isDisabled }
                              };
                              persistConfig(
                                { ...config, productOverrides: nextOv },
                                !isDisabled ? (isAr ? 'تم إخفاء المنتج' : 'Product hidden') : (isAr ? 'تم إظهار المنتج' : 'Product visible')
                              );
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                              isDisabled
                                ? 'bg-gray-800 text-gray-400 border border-gray-700'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isDisabled ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                            <span>{isDisabled ? (isAr ? 'مخفي' : 'Hidden') : (isAr ? 'ظاهر' : 'Visible')}</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-3">
                          <label className="text-[10px] text-gray-400 block mb-1">{isAr ? 'اسم المنتج:' : 'Product Name:'}</label>
                          <input
                            type="text"
                            value={ov.name !== undefined ? ov.name : prod.name}
                            onChange={(e) => updateProdField({ name: e.target.value })}
                            className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-emerald-400 block mb-1">{isAr ? 'السعر ($):' : 'Price ($):'}</label>
                          <input
                            type="number"
                            min="0"
                            value={ov.price !== undefined ? ov.price : prod.price}
                            onChange={(e) => updateProdField({ price: Number(e.target.value) })}
                            className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">{isAr ? 'السعر قبل الخصم ($):' : 'Original Price ($):'}</label>
                          <input
                            type="number"
                            min="0"
                            value={ov.originalPrice !== undefined ? ov.originalPrice : (prod.originalPrice || '')}
                            onChange={(e) => updateProdField({ originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                            placeholder="Optional"
                            className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">{isAr ? 'رابط الصورة:' : 'Image URL:'}</label>
                          <input
                            type="text"
                            value={config.media.productImageOverrides?.[prod.id] ?? prod.imageUrl}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                media: {
                                  ...config.media,
                                  productImageOverrides: {
                                    ...config.media.productImageOverrides,
                                    [prod.id]: e.target.value
                                  }
                                }
                              })
                            }
                            className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-[10px] text-gray-400 block mb-1">{isAr ? 'السطر التسويقي (Tagline):' : 'Tagline:'}</label>
                          <input
                            type="text"
                            value={ov.tagline !== undefined ? ov.tagline : prod.tagline}
                            onChange={(e) => updateProdField({ tagline: e.target.value })}
                            className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-[10px] text-gray-400 block mb-1">{isAr ? 'الوصف:' : 'Description:'}</label>
                          <textarea
                            rows={2}
                            value={ov.description !== undefined ? ov.description : prod.description}
                            onChange={(e) => updateProdField({ description: e.target.value })}
                            className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-800/80">
                        <button
                          type="button"
                          onClick={() => {
                            const nextOverrides = { ...config.productOverrides };
                            delete nextOverrides[prod.id];
                            const nextImgs = { ...config.media.productImageOverrides };
                            delete nextImgs[prod.id];
                            persistConfig(
                              {
                                ...config,
                                productOverrides: nextOverrides,
                                media: { ...config.media, productImageOverrides: nextImgs }
                              },
                              isAr ? 'تمت استعادة المنتج الافتراضي' : 'Restored product defaults'
                            );
                          }}
                          className="text-[11px] text-gray-400 hover:text-red-400 cursor-pointer font-semibold"
                        >
                          {isAr ? 'استعادة الافتراضي' : 'Reset Item'}
                        </button>

                        <button
                          type="button"
                          onClick={() => persistConfig({ ...config }, isAr ? `تم حفظ: ${prod.name}` : `Saved: ${prod.name}`)}
                          className="px-4 py-1.5 rounded-xl bg-white hover:bg-gray-200 text-black text-xs font-black flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isAr ? 'تطبيق التعديل' : 'Apply Changes'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: RESORT, FOUNDERS & FOOTER (منتجع بازاروتو، المؤسسون، ومعلومات التواصل)
        ========================================================================= */}
        {activeTab === 'resortBrand' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Bazaruto Resort Sanctuary Controls */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                    <Palmtree className="w-5 h-5 text-emerald-400" />
                    <span>{isAr ? 'إعدادات منتجع يارد بازاروتو (النصوص، التوقيع والصور)' : 'YARD Bazaruto Sanctuary — Copy, Signature & Visuals'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAr
                      ? 'تحكم في تاريخ الافتتاح، النبذة المكتوبة، اسم المصمم المعماري، وصور المنتجع والجزيرة الليلية.'
                      : 'Edit opening date badge, overview text, architectural signature credit, panorama and night aerial island photos.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      persistConfig(
                        { ...config, resort: { ...DEFAULT_RESORT_CONFIG } },
                        isAr ? 'تمت استعادة إعدادات المنتجع الافتراضية' : 'Resort settings reset to defaults'
                      )
                    }
                    className="px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-xs text-gray-300 font-bold cursor-pointer"
                  >
                    {isAr ? 'افتراضي' : 'Reset'}
                  </button>
                  <button
                    type="button"
                    onClick={() => persistConfig({ ...config }, isAr ? 'تم حفظ تعديلات المنتجع بنجاح!' : 'Bazaruto Resort settings saved live!')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isAr ? 'حفظ المنتجع' : 'Save Resort'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Opening Date Badge (EN)</label>
                  <input
                    type="text"
                    value={config.resort?.openingDateEn || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, openingDateEn: e.target.value } })}
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">شارة الافتتاح (عربي)</label>
                  <input
                    type="text"
                    value={config.resort?.openingDateAr || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, openingDateAr: e.target.value } })}
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Title (EN)</label>
                  <input
                    type="text"
                    value={config.resort?.titleEn || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, titleEn: e.target.value } })}
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">العنوان (عربي)</label>
                  <input
                    type="text"
                    value={config.resort?.titleAr || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, titleAr: e.target.value } })}
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Gold Subtitle Highlight (EN)</label>
                  <input
                    type="text"
                    value={config.resort?.subtitleHighlightEn || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, subtitleHighlightEn: e.target.value } })}
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">العنوان الفرعي المميز (عربي)</label>
                  <input
                    type="text"
                    value={config.resort?.subtitleHighlightAr || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, subtitleHighlightAr: e.target.value } })}
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-[#D4AF37] block mb-1">
                    {isAr ? 'التوقيع المعماري أسفل النبذة:' : 'Architectural Signature Name:'}
                  </label>
                  <input
                    type="text"
                    value={config.resort?.architectName || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, architectName: e.target.value } })}
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Overview Paragraph (EN)</label>
                  <textarea
                    rows={3}
                    value={config.resort?.overviewEn || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, overviewEn: e.target.value } })}
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">النبذة التعريفية (عربي)</label>
                  <textarea
                    rows={3}
                    value={config.resort?.overviewAr || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, overviewAr: e.target.value } })}
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                {/* Resort Imagery */}
                <div className="p-4 rounded-2xl bg-[#10121C] border border-gray-800 space-y-2">
                  <label className="text-xs font-bold text-gray-300 block">
                    {isAr ? 'صورة المنتجع الأولى (Panorama):' : 'Resort Primary Panorama URL:'}
                  </label>
                  <img
                    src={config.resort?.heroPanoramaImage || YARD_BAZARUTO_RESORT_IMAGE}
                    alt="Resort Panorama"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-full h-36 object-cover rounded-xl bg-black border border-gray-800"
                  />
                  <input
                    type="text"
                    value={config.resort?.heroPanoramaImage || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, heroPanoramaImage: e.target.value } })}
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#10121C] border border-gray-800 space-y-2">
                  <label className="text-xs font-bold text-gray-300 block">
                    {isAr ? 'صورة الجزيرة الليلية من الأعلى:' : 'Island Aerial Night View URL:'}
                  </label>
                  <img
                    src={config.resort?.aerialNightImage || YARD_ISLAND_AERIAL_NIGHT_IMAGE}
                    alt="Aerial Night"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-full h-36 object-cover rounded-xl bg-black border border-gray-800"
                  />
                  <input
                    type="text"
                    value={config.resort?.aerialNightImage || ''}
                    onChange={(e) => setConfig({ ...config, resort: { ...config.resort, aerialNightImage: e.target.value } })}
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Founders Profile Editor */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    <span>{isAr ? 'تعديل بيانات وصور المؤسسين' : 'Founders Leadership Profiles'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAr ? 'تعديل أسماء، أدوار، وصور المؤسسين الثلاثة في الواجهة.' : 'Customize founder display names, roles, and portraits across the site.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => persistConfig({ ...config }, isAr ? 'تم حفظ بيانات المؤسسين!' : 'Founder profiles saved live!')}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? 'حفظ المؤسسين' : 'Save Founders'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {['yam-suw', 'mtk', 'arb'].map((fid) => {
                  const fData = config.siteSettings?.founderOverrides?.[fid] || DEFAULT_BRAND_SITE_SETTINGS.founderOverrides[fid] || {};
                  const updateFounder = (patch: Record<string, string>) => {
                    setConfig({
                      ...config,
                      siteSettings: {
                        ...config.siteSettings,
                        founderOverrides: {
                          ...config.siteSettings.founderOverrides,
                          [fid]: { ...fData, ...patch }
                        }
                      }
                    });
                  };

                  return (
                    <div key={fid} className="p-4 rounded-2xl bg-[#10121C] border border-gray-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={fData.image || '/images/founder_yam_suw_suit.jpg'}
                          alt={fData.name || fid}
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          className="w-12 h-12 rounded-xl object-cover object-top bg-black border border-gray-700"
                        />
                        <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase">{fid}</span>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Display Name (EN)</label>
                        <input
                          type="text"
                          value={fData.name || ''}
                          onChange={(e) => updateFounder({ name: e.target.value })}
                          className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">الاسم (عربي)</label>
                        <input
                          type="text"
                          value={fData.nameAr || ''}
                          onChange={(e) => updateFounder({ nameAr: e.target.value })}
                          className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Role / Title (EN)</label>
                        <input
                          type="text"
                          value={fData.role || ''}
                          onChange={(e) => updateFounder({ role: e.target.value })}
                          className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">الدور القيادي (عربي)</label>
                        <input
                          type="text"
                          value={fData.roleAr || ''}
                          onChange={(e) => updateFounder({ roleAr: e.target.value })}
                          className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Portrait URL</label>
                        <input
                          type="text"
                          value={fData.image || ''}
                          onChange={(e) => updateFounder({ image: e.target.value })}
                          className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer, Contact & Social Settings */}
            <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-black font-anime text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#00F0FF]" />
                    <span>{isAr ? 'معلومات الفوتر والتواصل والحسابات الرسمية' : 'Footer Copy, Contact Email & Official Social Links'}</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => persistConfig({ ...config }, isAr ? 'تم حفظ إعدادات الفوتر والتواصل!' : 'Footer & contact settings saved!')}
                  className="px-5 py-2.5 rounded-xl bg-[#00F0FF] text-black font-black text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? 'حفظ بيانات التواصل' : 'Save Footer & Social'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Footer Brand Tagline (EN)</label>
                  <input
                    type="text"
                    value={config.siteSettings?.footerTaglineEn || ''}
                    onChange={(e) =>
                      setConfig({ ...config, siteSettings: { ...config.siteSettings, footerTaglineEn: e.target.value } })
                    }
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">نبذة الفوتر أسفل الموقع (عربي)</label>
                  <input
                    type="text"
                    value={config.siteSettings?.footerTaglineAr || ''}
                    onChange={(e) =>
                      setConfig({ ...config, siteSettings: { ...config.siteSettings, footerTaglineAr: e.target.value } })
                    }
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Official Contact Email</label>
                  <input
                    type="email"
                    value={config.siteSettings?.contactEmail || ''}
                    onChange={(e) =>
                      setConfig({ ...config, siteSettings: { ...config.siteSettings, contactEmail: e.target.value } })
                    }
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Instagram Handle</label>
                    <input
                      type="text"
                      value={config.siteSettings?.instagramHandle || ''}
                      onChange={(e) =>
                        setConfig({ ...config, siteSettings: { ...config.siteSettings, instagramHandle: e.target.value } })
                      }
                      className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={config.siteSettings?.instagramUrl || ''}
                      onChange={(e) =>
                        setConfig({ ...config, siteSettings: { ...config.siteSettings, instagramUrl: e.target.value } })
                      }
                      className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">X / Twitter Handle</label>
                  <input
                    type="text"
                    value={config.siteSettings?.xHandle || ''}
                    onChange={(e) =>
                      setConfig({ ...config, siteSettings: { ...config.siteSettings, xHandle: e.target.value } })
                    }
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">X / Twitter URL</label>
                  <input
                    type="text"
                    value={config.siteSettings?.xUrl || ''}
                    onChange={(e) =>
                      setConfig({ ...config, siteSettings: { ...config.siteSettings, xUrl: e.target.value } })
                    }
                    className="w-full bg-[#141624] border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default OwnerDashboard;
