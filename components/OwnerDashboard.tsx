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
  Crown
} from 'lucide-react';
import { 
  OwnerConfigService, 
  OwnerSiteConfig, 
  SiteSectionConfig, 
  PaymentGatewayConfig, 
  SiteVideoItem, 
  CustomArticleData 
} from '../services/ownerConfigService';
import { PRODUCTS, handleImageError } from '../constants';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';

interface OwnerDashboardProps {
  currentLang: Language;
  onBackToStore: () => void;
  onNavigateToView?: (viewId: string) => void;
  initialTab?: 'photos' | 'sections' | 'payments' | 'videos' | 'articles';
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
  const [activeTab, setActiveTab] = useState<'photos' | 'sections' | 'payments' | 'videos' | 'articles'>(initialTab);

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
    posterUrl: '/images/anime_fighter_ryu_impact.jpg',
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
      triggerToast(isAr ? `أهلاً بك يا ${OwnerConfigService.getOwnerInfo().name}! تم الدخول بنجاح.` : `Welcome ${OwnerConfigService.getOwnerInfo().name}!`);
    } else {
      soundFX.playLaser();
      setAuthError(isAr 
        ? 'بيانات الدخول غير مطابقة. تأكد من إيميل المالك وكلمة السر.'
        : 'Invalid credentials. Access is restricted strictly to the verified store owner.'
      );
    }
  };

  const handleOwnerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerEmail.trim()) {
      setAuthError(isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter an email');
      return;
    }
    if (!ownerPassword.trim()) {
      setAuthError(isAr ? 'يرجى كتابة رقم سري خاص' : 'Please enter a secret password');
      return;
    }
    if (ownerPassword.length < 4) {
      setAuthError(isAr ? 'يجب أن لا يقل الرقم السري عن 4 خانات' : 'Password must be at least 4 characters');
      return;
    }
    if (ownerPassword !== confirmPassword) {
      setAuthError(isAr ? 'الرقم السري وتأكيد الرقم السري غير متطابقين' : 'Passwords do not match');
      return;
    }

    const regName = ownerName.trim() || 'Yam Suw';
    const success = OwnerConfigService.registerOwner(regName, ownerEmail, ownerPassword);
    if (success) {
      soundFX.playLevelUp();
      setIsAuthenticated(true);
      setOwnerInfo({ name: regName, email: ownerEmail.trim().toLowerCase() });
      setAuthError(null);
      setAuthSuccessMsg(isAr ? `تم تسجيل وتفعيل حسابك كمالك رسمي (${regName}) بنجاح!` : `Owner account registered for ${regName}!`);
      triggerToast(isAr ? `تم تسجيل وتفعيل حسابك كمالك رسمي (${regName})` : `Owner account created for ${regName}`);
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
    triggerToast(toastMsg || (isAr ? 'تم حفظ وتطبيق التعديلات بنجاح!' : 'Changes saved & applied live!'));
  };

  // Section Toggles
  const handleToggleSection = (sectionId: string) => {
    soundFX.playButtonClick();
    const updatedSections = config.sections.map(s => 
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    persistConfig({ ...config, sections: updatedSections }, isAr ? 'تم تحديث حالة القسم مباشرة' : 'Section status updated live');
  };

  // Payment Gateway Toggles
  const handleToggleGateway = (gatewayId: string) => {
    soundFX.playButtonClick();
    const updatedGateways = config.payments.gateways.map(g => 
      g.id === gatewayId ? { ...g, enabled: !g.enabled } : g
    );
    const updatedPayments = { ...config.payments, gateways: updatedGateways };
    persistConfig({ ...config, payments: updatedPayments }, isAr ? 'تم تحديث بوابات الدفع في المتجر' : 'Payment gateways updated live');
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
    persistConfig({ ...config, payments: updatedPayments }, isAr ? 'تم حفظ عناوين الخزينة والخصومات' : 'Treasury addresses & discount saved');
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
      posterUrl: '/images/anime_fighter_ryu_impact.jpg',
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
      <div className={`min-h-screen bg-[#040508] text-white pt-28 pb-16 px-4 md:px-8 flex flex-col items-center justify-center relative ${isAr ? 'text-right' : 'text-left'}`}>
        <div className="absolute inset-0 bg-cyber-grid opacity-15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#E50914]/10 via-transparent to-[#040508] pointer-events-none" />

        <div className="w-full max-w-lg bg-[#0C0E16] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(229,9,20,0.25)] relative z-10 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E50914] via-[#7000FF] to-[#00F0FF] flex items-center justify-center mx-auto mb-5 shadow-[0_0_25px_rgba(229,9,20,0.5)]">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>

          <div className="text-center mb-6">
            <span className="text-[10px] font-black font-anime text-[#FFE600] tracking-widest uppercase block mb-1">
              EXCLUSIVE PRIVATE OWNER PORTAL // بوابة المالك المعتمد
            </span>
            <h1 className="text-2xl md:text-3xl font-black font-anime text-white">
              {authMode === 'login' 
                ? (isAr ? 'تسجيل دخول المالك' : 'Owner Secure Sign-In') 
                : (isAr ? 'تسجيل / ضبط حساب المالك' : 'Register Owner Account')}
            </h1>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              {isAr 
                ? 'هذه البوابة مشفرة ومخصصة لك حصراً لتفتح باسمك وبرقمك السري الخاص، ولا تظهر إطلاقاً للجمهور أو زوار المتجر.'
                : 'Restricted strictly to the verified store owner. Opens under your personal name & secret password, completely hidden from public visitors.'}
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
              <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
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
              <span>{isAr ? 'تسجيل / ضبط الحساب باسمك' : 'Register / Custom Name'}</span>
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
                  {isAr ? 'البريد الإلكتروني المسجل:' : 'Registered Owner Email:'}
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
                  {isAr ? 'الرقم السري الخاص بك:' : 'Secret Owner Password:'}
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
                  <span>{isAr ? 'الرقم الافتراضي للمالك: 300 أو yard300' : 'Default Owner PIN: 300 or yard300'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOwnerEmail('yamsuw946@gmail.com');
                      setOwnerPassword('300');
                      setAuthError(null);
                    }}
                    className="text-[#FFE600] hover:underline cursor-pointer font-bold"
                  >
                    {isAr ? 'تعبئة تلقائية (Yam Suw)' : 'Auto-fill (Yam Suw)'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#E50914] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#E50914] text-white font-black font-anime text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{isAr ? 'دخول لوحة تحكم وتعديل المالك' : 'Sign In as Verified Owner'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleOwnerRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider font-anime">
                  {isAr ? 'اسم المالك (يظهر في أعلى اللوحة):' : 'Owner Display Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => {
                    setOwnerName(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="Yam Suw (أو اسمك المفضل)"
                  className="w-full bg-[#141624] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-sans text-xs outline-none focus:border-[#FFE600] focus:ring-1 focus:ring-[#FFE600] transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider font-anime">
                  {isAr ? 'البريد الإلكتروني الخاص بك:' : 'Personal Owner Email:'}
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
                    {isAr ? 'الرقم السري الجديد:' : 'Secret Password:'}
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
                    {isAr ? 'تأكيد الرقم السري:' : 'Confirm Password:'}
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
                <span>{isAr ? 'تسجيل وحفظ حساب المالك وتفعيل اللوحة فوراً' : 'Register & Launch Owner Dashboard'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-gray-800 text-center">
            <button
              type="button"
              onClick={onBackToStore}
              className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 font-anime"
            >
              <span>{isAr ? '← العودة إلى المتجر العام' : '← Return to Public Store'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Live Authenticated Dashboard
  return (
    <div className={`min-h-screen bg-[#040508] text-white pt-24 pb-20 px-4 md:px-8 relative ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#E50914]/15 via-transparent to-transparent pointer-events-none" />

      {/* Floating Save Toast */}
      {saveToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#10B981] text-black font-black font-anime px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.8)] flex items-center gap-2 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>{saveToast}</span>
        </div>
      )}

      <div className="max-w-[1700px] mx-auto relative z-10 space-y-8">
        
        {/* Top Command Bar */}
        <div className="bg-[#0A0C14] border border-gray-800 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-black font-anime text-[#FFE600] tracking-widest uppercase">
                {isAr ? 'مركز قيادة المالك المعتمد // جلسة خاصة ومحمية' : 'OWNER COMMAND CENTER // VERIFIED EXCLUSIVE'}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Crown className="w-3 h-3 text-[#FFE600]" />
                <span>{ownerInfo.name}</span>
                <span className="opacity-75">({ownerInfo.email})</span>
              </span>
              <span className="text-[10px] bg-red-950/40 text-red-300 border border-red-800/40 px-2 py-0.5 rounded-full font-bold">
                {isAr ? 'مخفية عن الجمهور' : 'Hidden from Public'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-anime text-white">
              {isAr ? 'لوحة تحكم ' : 'YARD 300 '}<span className="text-[#E50914] neon-text-red">{isAr ? `المالك: ${ownerInfo.name}` : `OWNER: ${ownerInfo.name}`}</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm max-w-2xl font-medium">
              {isAr 
                ? 'تحكم كامل وشامل في صور الموقع والمنتجات، تفعيل وتعطيل الأقسام، إدارة بوابات الدفع والخزينة، رفع وتحديث الفيديوهات، وكتابة ونشر المقالات في المجلة الرياضية.'
                : 'Complete control over site photos & product media, toggling sections, configuring payment gateways & crypto treasury, managing promotional videos, and publishing articles to the Warrior Journal.'}
            </p>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onBackToStore}
              className="px-4 py-2.5 bg-[#141624] hover:bg-[#1E2238] border border-gray-700 hover:border-gray-500 text-white rounded-xl text-xs font-black font-anime transition-all flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#00F0FF]" />
              <span>{isAr ? 'معاينة المتجر المباشر' : 'View Live Store'}</span>
            </button>

            <button
              onClick={handleExportJSON}
              title={isAr ? 'تصدير نسخة احتياطية' : 'Export Backup JSON'}
              className="p-2.5 bg-[#141624] hover:bg-[#1E2238] border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl text-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              title={isAr ? 'استيراد نسخة احتياطية' : 'Import Backup JSON'}
              className="p-2.5 bg-[#141624] hover:bg-[#1E2238] border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl text-xs transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleResetFactory}
              title={isAr ? 'استعادة ضبط المصنع' : 'Reset to Default'}
              className="p-2.5 bg-[#1A1215] hover:bg-[#2B151B] border border-red-900/60 text-red-400 hover:text-red-300 rounded-xl text-xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 inline mr-1" />
              <span>{isAr ? 'قفل' : 'Lock'}</span>
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
              <span className="text-[10px] text-gray-400 uppercase font-anime">{isAr ? 'الصور المخصصة' : 'Custom Media'}</span>
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
              <span className="text-[10px] text-gray-400 uppercase font-anime">{isAr ? 'الأقسام النشطة' : 'Active Sections'}</span>
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
              <span className="text-[10px] text-gray-400 uppercase font-anime">{isAr ? 'بوابات الدفع' : 'Payment Methods'}</span>
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
              <span className="text-[10px] text-gray-400 uppercase font-anime">{isAr ? 'الفيديوهات الحية' : 'Live Videos'}</span>
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
              <span className="text-[10px] text-gray-400 uppercase font-anime">{isAr ? 'مقالات المجلة' : 'Journal Articles'}</span>
            </div>
          </div>
        </div>

        {/* Tab Selector Navigation */}
        <div className="flex border-b border-gray-800 overflow-x-auto gap-2 pb-2">
          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('photos');
            }}
            className={`px-5 py-3 rounded-2xl font-black font-anime text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'photos'
                ? 'bg-gradient-to-r from-[#E50914] to-[#B91C1C] text-white shadow-[0_0_20px_rgba(229,9,20,0.5)]'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{isAr ? '1. الصور والوسائط' : '1. Photos & Media'}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('sections');
            }}
            className={`px-5 py-3 rounded-2xl font-black font-anime text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sections'
                ? 'bg-gradient-to-r from-[#7000FF] to-[#4F46E5] text-white shadow-[0_0_20px_rgba(112,0,255,0.5)]'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isAr ? '2. أقسام الموقع' : '2. Site Sections'}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('payments');
            }}
            className={`px-5 py-3 rounded-2xl font-black font-anime text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'payments'
                ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] font-black'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{isAr ? '3. طرق وبوابات الدفع' : '3. Payment Gateways'}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('videos');
            }}
            className={`px-5 py-3 rounded-2xl font-black font-anime text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] font-black'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{isAr ? '4. الفيديوهات والعروض' : '4. Videos & Demos'}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playButtonClick();
              setActiveTab('articles');
            }}
            className={`px-5 py-3 rounded-2xl font-black font-anime text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'articles'
                ? 'bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-black shadow-[0_0_20px_rgba(0,240,255,0.5)] font-black'
                : 'bg-[#0E1018] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? '5. كتابة وإدارة المقالات' : '5. Warrior Journal CMS'}</span>
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
                    placeholder="/images/anime_hero_demon_back_1788742125215.jpg"
                    className="w-full bg-[#181B28] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#E50914] font-mono"
                  />

                  {/* Preset Quick Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-gray-400 font-bold self-center mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config.media, heroImage: '/images/anime_hero_demon_back_1788742125215.jpg' };
                        persistConfig({ ...config, media: updated });
                      }}
                      className="px-2 py-0.5 rounded bg-[#1D2032] hover:bg-gray-700 text-[10px] text-gray-300 font-anime"
                    >
                      Demon Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config.media, heroImage: '/images/cyber_ronin_blade.jpg' };
                        persistConfig({ ...config, media: updated });
                      }}
                      className="px-2 py-0.5 rounded bg-[#1D2032] hover:bg-gray-700 text-[10px] text-gray-300 font-anime"
                    >
                      Samurai Ronin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config.media, heroImage: '/images/live_arena_fighters_2050_1788741135197.jpg' };
                        persistConfig({ ...config, media: updated });
                      }}
                      className="px-2 py-0.5 rounded bg-[#1D2032] hover:bg-gray-700 text-[10px] text-gray-300 font-anime"
                    >
                      Live Arena
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
                        placeholder="/images/anime_fighter_ryu_impact.jpg"
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

      </div>
    </div>
  );
};
export default OwnerDashboard;
