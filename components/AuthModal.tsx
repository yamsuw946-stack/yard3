/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Mail, User, ShieldCheck, Zap, LogOut, CheckCircle, 
  Eye, EyeOff, UserCheck, ExternalLink, Send, KeyRound, RefreshCw, Copy, Check, Link2
} from 'lucide-react';
import { authService, AuthUser } from '../services/authService';
import { emailService, EmailDispatchResult } from '../services/emailService';
import { soundFX } from '../services/soundFX';
import { Language } from '../i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
  onSuccess?: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
  onSuccess
}) => {
  const isAr = currentLang === 'ar';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';

  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [discipline, setDiscipline] = useState('🥊 Boxing & Explosive Striking');
  
  // Verification states
  const [verifyEmailAddress, setVerifyEmailAddress] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [currentVerificationCode, setCurrentVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Password visibility controls
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [emailDispatch, setEmailDispatch] = useState<EmailDispatchResult | null>(null);

  // Auto-verify if user opened email direct activation link with #verify=CODE&email=EMAIL
  useEffect(() => {
    const handleUrlHashVerify = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('verify=')) {
        try {
          const params = new URLSearchParams(hash.replace('#', ''));
          const code = params.get('verify');
          const emailParam = params.get('email');
          if (code && emailParam) {
            const res = authService.verifyEmailCode(emailParam, code);
            if (res.success && res.user) {
              soundFX.playSuccess();
              soundFX.playPowerUp();
              setCurrentUser(res.user);
              setSuccessMsg(
                isAr
                  ? `تم تفعيل حسابك بنجاح عبر الرابط! أهلاً بك يا ${res.user.name}.`
                  : `Account activated successfully via link! Welcome, ${res.user.name}.`
              );
              window.location.hash = '';
              setTimeout(() => {
                onSuccess?.(res.user!);
                onClose();
              }, 1400);
            }
          }
        } catch {}
      }
    };
    handleUrlHashVerify();
    window.addEventListener('hashchange', handleUrlHashVerify);
    return () => window.removeEventListener('hashchange', handleUrlHashVerify);
  }, [isAr, onClose, onSuccess]);

  // Cooldown timer for resending code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Sign In Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailDispatch(null);
    setLoading(true);
    soundFX.playButtonClick();

    if (!password.trim()) {
      soundFX.playError();
      setErrorMsg(
        isAr
          ? 'كلمة المرور مطلوبة لتسجيل الدخول.'
          : isFr 
          ? 'Le mot de passe est obligatoire.' 
          : isEs 
          ? 'La contraseña es obligatoria.' 
          : 'Password is required to sign in.'
      );
      setLoading(false);
      return;
    }

    try {
      const res = await authService.login(email, password);
      if (res.success && res.user) {
        soundFX.playSuccess();
        soundFX.playPowerUp();
        setCurrentUser(res.user);
        setSuccessMsg(
          isAr
            ? `أهلاً بعودتك يا ${res.user.name}!`
            : isFr 
            ? `Bon retour, ${res.user.name} !` 
            : isEs 
            ? `¡Bienvenido de nuevo, ${res.user.name}!` 
            : `Welcome back, ${res.user.name}!`
        );
        setTimeout(() => {
          onSuccess?.(res.user!);
          onClose();
        }, 1200);
      } else if (res.requiresVerification) {
        // Needs email verification
        soundFX.playError();
        setVerifyEmailAddress(email.trim().toLowerCase());
        setCurrentVerificationCode(res.verificationCode || '');
        setMode('verify');
        setErrorMsg(
          isAr
            ? 'يرجى تأكيد بريدك الإلكتروني برمز التحقق قبل تسجيل الدخول.'
            : isFr
            ? 'Veuillez confirmer votre e-mail avant de vous connecter.'
            : isEs
            ? 'Por favor, confirma tu correo electrónico antes de iniciar sesión.'
            : 'Please confirm your email with the 6-digit code before signing in.'
        );
        // Dispatch code
        const mailRes = await emailService.sendVerificationCode(email, email.split('@')[0], res.verificationCode || '');
        setEmailDispatch(mailRes);
      } else {
        soundFX.playError();
        setErrorMsg(
          res.error || (
            isAr
              ? 'بيانات الاعتماد أو كلمة المرور غير صحيحة.'
              : isFr 
              ? 'Identifiants ou mot de passe incorrects.' 
              : isEs 
              ? 'Credenciales o contraseña incorrectas.' 
              : 'Invalid credentials or incorrect password.'
          )
        );
      }
    } catch {
      soundFX.playError();
      setErrorMsg(
        isAr
          ? 'حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة ثانية.'
          : isFr 
          ? 'Une erreur est survenue lors de la connexion' 
          : isEs 
          ? 'Ocurrió un error al iniciar sesión' 
          : 'An error occurred during sign in'
      );
    } finally {
      setLoading(false);
    }
  };

  // Register Handler: DOES NOT log in immediately! Requires Email Confirmation Code!
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailDispatch(null);
    setLoading(true);
    soundFX.playButtonClick();

    if (!name.trim()) {
      setErrorMsg(
        isAr
          ? 'يرجى إدخال اسم الرياضي (حرفان على الأقل)'
          : isFr 
          ? "Veuillez entrer le nom de l'athlète" 
          : isEs 
          ? 'Por favor, introduce el nombre del atleta' 
          : 'Please enter athlete name'
      );
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      soundFX.playError();
      setErrorMsg(
        isAr
          ? 'يجب ألا تقل كلمة المرور عن 6 أحرف.'
          : isFr 
          ? 'Le mot de passe doit comporter au moins 6 caractères.' 
          : isEs 
          ? 'La contraseña debe tener al menos 6 caracteres.' 
          : 'Password must be at least 6 characters long.'
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      soundFX.playError();
      setErrorMsg(
        isAr
          ? 'كلمتا المرور غير متطابقتين.'
          : isFr 
          ? 'Les deux mots de passe ne correspondent pas.' 
          : isEs 
          ? 'Las dos contraseñas no coinciden.' 
          : 'Passwords do not match.'
      );
      setLoading(false);
      return;
    }

    try {
      const res = await authService.register({
        name,
        email,
        password,
        discipline
      });

      if (res.success && res.requiresVerification && res.verificationCode) {
        soundFX.playSuccess();
        const code = res.verificationCode;
        setVerifyEmailAddress(email.trim().toLowerCase());
        setCurrentVerificationCode(code);
        setMode('verify');
        setPassword('');
        setConfirmPassword('');
        setResendCooldown(60);

        // Dispatch Email Confirmation Code with native notification and direct links
        const mailRes = await emailService.sendVerificationCode(email, name, code);
        setEmailDispatch(mailRes);

        setSuccessMsg(
          isAr
            ? 'تم إرسال رابط ورمز التأكيد! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.'
            : isFr 
            ? 'Code de confirmation envoyé ! Veuillez valider votre e-mail pour activer votre compte.' 
            : isEs 
            ? '¡Código de confirmación enviado! Verifica tu correo para activar tu cuenta.' 
            : 'Confirmation code sent! Please verify your email to activate your account.'
        );
      } else {
        soundFX.playError();
        setErrorMsg(
          res.error || (
            isFr ? 'Échec de la création du compte' : isEs ? 'Fallo al crear la cuenta' : 'Failed to create account'
          )
        );
      }
    } catch {
      soundFX.playError();
      setErrorMsg(
        isFr 
          ? 'Échec de la création du compte' 
          : isEs 
          ? 'Fallo al crear la cuenta' 
          : 'Failed to create account'
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify Confirmation Code Handler
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    soundFX.playButtonClick();

    const clean = inputCode.trim();
    if (!clean || clean.length < 6) {
      soundFX.playError();
      setErrorMsg(
        isAr
          ? 'يرجى إدخال رمز التأكيد كاملاً المكون من 6 أرقام.'
          : isFr 
          ? 'Veuillez saisir le code complet à 6 chiffres.' 
          : isEs 
          ? 'Por favor, introduce el código completo de 6 dígitos.' 
          : 'Please enter the complete 6-digit code.'
      );
      setLoading(false);
      return;
    }

    const res = authService.verifyEmailCode(verifyEmailAddress, clean);
    if (res.success && res.user) {
      soundFX.playSuccess();
      soundFX.playPowerUp();
      setCurrentUser(res.user);
      setSuccessMsg(
        isAr
          ? `تم تفعيل وتأكيد الحساب بنجاح! مرحباً بك يا ${res.user.name}.`
          : isFr 
          ? `Compte activé avec succès ! Bienvenue, ${res.user.name}.` 
          : isEs 
          ? `¡Cuenta activada con éxito! Bienvenido, ${res.user.name}.` 
          : `Account verified and activated! Welcome, ${res.user.name}.`
      );
      setTimeout(() => {
        onSuccess?.(res.user!);
        onClose();
      }, 1400);
    } else {
      soundFX.playError();
      setErrorMsg(
        res.error || (
          isAr
            ? 'رمز التأكيد غير صحيح أو منتهي الصلاحية.'
            : isFr 
            ? 'Code de confirmation incorrect ou expiré.' 
            : isEs 
            ? 'Código de confirmación incorrecto o caducado.' 
            : 'Incorrect or expired confirmation code.'
        )
      );
    }
    setLoading(false);
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    soundFX.playButtonClick();
    setErrorMsg('');
    const res = authService.resendVerificationCode(verifyEmailAddress);
    if (res.success && res.verificationCode) {
      setCurrentVerificationCode(res.verificationCode);
      setResendCooldown(60);
      const mailRes = await emailService.sendVerificationCode(verifyEmailAddress, name || 'Athlete', res.verificationCode);
      setEmailDispatch(mailRes);
      setSuccessMsg(
        isAr ? 'تم إرسال رمز جديد إلى بريدك!' : isFr ? 'Nouveau code envoyé !' : isEs ? '¡Nuevo código enviado!' : 'New confirmation code sent!'
      );
    } else {
      setErrorMsg(res.error || (isAr ? 'فشل إعادة إرسال الرمز' : 'Failed to resend code'));
    }
  };

  const handleCopyCode = () => {
    if (!currentVerificationCode) return;
    navigator.clipboard.writeText(currentVerificationCode);
    setCopiedCode(true);
    soundFX.playButtonClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAutoFillCode = () => {
    if (currentVerificationCode) {
      setInputCode(currentVerificationCode);
      soundFX.playButtonClick();
    }
  };

  const handleLogout = () => {
    soundFX.playButtonClick();
    authService.logout();
    setCurrentUser(null);
    setPassword('');
    setConfirmPassword('');
    setEmailDispatch(null);
    setMode('login');
    setSuccessMsg(
      isFr 
        ? 'Déconnexion réussie' 
        : isEs 
        ? 'Sesión cerrada con éxito' 
        : 'Logged out successfully'
    );
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0C0E18] border-2 border-emerald-500/50 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative overflow-hidden text-white text-left dir-ltr max-h-[92vh] overflow-y-auto">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundFX.playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#141626] text-gray-400 hover:text-white hover:bg-red-500/20 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-[#FFE600]/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] shrink-0">
            {mode === 'verify' ? <KeyRound className="w-6 h-6 text-cyan-400" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[10px] font-black font-anime text-emerald-400 uppercase tracking-widest block">
              YARD 300 // ATHLETE IDENTITY
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-anime text-white">
              {currentUser 
                ? (isAr ? 'إدارة حساب الرياضي والجلسة' : isFr ? 'Gestion du Compte Athlète' : isEs ? 'Gestión de Cuenta' : 'Athlete Account & Session')
                : mode === 'verify'
                ? (isAr ? 'تأكيد الحساب وتفعيل البريد الإلكتروني' : isFr ? 'Validation de l’E-mail' : isEs ? 'Verificación de Correo' : 'Email Confirmation Required')
                : mode === 'login'
                ? (isAr ? 'تسجيل الدخول الآمن' : isFr ? 'Connexion Sécurisée' : isEs ? 'Iniciar Sesión Segura' : 'Secure Athlete Sign In')
                : (isAr ? 'إنشاء حساب رياضي جديد' : isFr ? 'Créer un Compte Sécurisé' : isEs ? 'Crear Cuenta Segura' : 'Register Secure Profile')}
            </h3>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold animate-fade-in">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* If user is ALREADY logged in: Show Account Status & Sign Out Button */}
        {currentUser ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-[#121526] border border-gray-800 space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-400/50 shadow-md"
                />
                <div>
                  <h4 className="font-anime font-black text-white text-base">{currentUser.name}</h4>
                  <span className="text-xs text-gray-400 font-mono block">{currentUser.email}</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black font-anime mt-1">
                    {currentUser.rankTitle}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/80 text-xs">
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[10px] text-gray-400 block">{isAr ? 'المستوى' : isFr ? 'Niveau' : isEs ? 'Nivel' : 'Level'}</span>
                  <span className="font-black text-[#FFE600] font-anime">LVL {currentUser.level}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[10px] text-gray-400 block">{isAr ? 'نقاط الهالة' : isFr ? "Points d'Aura" : isEs ? 'Puntos de Aura' : 'Aura Points'}</span>
                  <span className="font-black text-[#00F0FF] font-anime">{currentUser.totalAuraPoints} AU</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  onClose();
                  window.location.hash = '#profile';
                  window.dispatchEvent(new CustomEvent('yard300_open_profile'));
                }}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-anime text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isAr ? 'فتح ملفي الرياضي الكامل' : isFr ? 'Ouvrir Mon Profil Complet' : isEs ? 'Abrir Mi Perfil Completo' : 'Open My Complete Profile'}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 font-bold font-anime text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{isAr ? 'تسجيل الخروج من الحساب (Sign Out)' : isFr ? 'Se Déconnecter du Compte' : isEs ? 'Cerrar Sesión de la Cuenta' : 'Sign Out of Account'}</span>
              </button>
            </div>
          </div>
        ) : mode === 'verify' ? (
          /* ========================================================= */
          /* EMAIL VERIFICATION REQUIRED SCREEN                       */
          /* The user CANNOT enter until entering the 6-digit code   */
          /* ========================================================= */
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-anime font-black text-xs uppercase tracking-wider">
                <Send className="w-4 h-4" />
                <span>
                  {isFr ? 'Vérification Obligatoire' : isEs ? 'Confirmación Requerida' : 'Activation Required'}
                </span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                {isFr
                  ? 'Pour des raisons de sécurité, le site ne s’ouvre pas directement sans confirmation. Un code à 6 chiffres a été envoyé à :'
                  : isEs
                  ? 'Por seguridad, el sitio no se abre directamente sin confirmación. Se ha enviado un código de 6 dígitos a:'
                  : 'For security, accounts cannot access the platform directly without email confirmation. A 6-digit activation code was sent to:'}
              </p>
              <div className="p-2.5 bg-black/60 rounded-xl border border-cyan-500/30 font-mono text-cyan-300 font-bold text-xs break-all flex items-center justify-between">
                <span>{verifyEmailAddress}</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-black font-anime">
                  PENDING
                </span>
              </div>
            </div>

            {/* Simulated Live Inbox / Code Banner for Testing & Immediate Verification */}
            {currentVerificationCode && (
              <div className="p-4 rounded-2xl bg-[#14182E] border-2 border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.25)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black font-anime text-emerald-400 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Code de Confirmation Dispatched :' : isEs ? 'Código de Confirmación Enviado:' : 'Dispatched Confirmation Code:'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">Valid: 15m</span>
                </div>
                
                <div className="flex items-center justify-between gap-3 bg-black/70 p-3 rounded-xl border border-gray-800">
                  <span className="font-mono text-2xl font-black text-[#FFE600] tracking-[0.25em]">
                    {currentVerificationCode}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      title="Copy code"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? (isFr ? 'Copié' : isEs ? 'Copiado' : 'Copied') : (isFr ? 'Copier' : isEs ? 'Copiar' : 'Copy')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoFillCode}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-black font-anime cursor-pointer transition-all shadow-sm"
                    >
                      {isFr ? 'Remplir' : isEs ? 'Rellenar' : 'Fill In'}
                    </button>
                  </div>
                </div>

                {emailDispatch && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    <a
                      href={emailDispatch.gmailWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      <span>Gmail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={emailDispatch.directMailtoUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181A2D] hover:bg-[#20243C] text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      <span>{isAr ? 'فتح تطبيق البريد' : isFr ? 'Ouvrir Messagerie' : isEs ? 'Abrir Correo' : 'Mail Client'}</span>
                    </a>
                  </div>
                )}

                {/* Direct 1-Click Activation Link */}
                {emailDispatch?.verificationLink && (
                  <div className="mt-3 p-3 rounded-xl bg-black/70 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-black font-anime text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isAr ? 'رابط تفعيل الحساب الفوري (مُرسل للبريد):' : isEs ? 'Enlace Directo de Activación:' : isFr ? 'Lien d’Activation Directe :' : 'Direct Email Activation Link:'}</span>
                      </span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">1-CLICK</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={emailDispatch.verificationLink} 
                        className="flex-1 bg-[#090C16] border border-gray-800 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-gray-300 outline-none truncate"
                      />
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (emailDispatch?.verificationLink) {
                              navigator.clipboard.writeText(emailDispatch.verificationLink);
                              setCopiedLink(true);
                              soundFX.playButtonClick();
                              setTimeout(() => setCopiedLink(false), 2000);
                            }
                          }}
                          className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-[11px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedLink ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleAutoFillCode();
                            const res = authService.verifyEmailCode(verifyEmailAddress, currentVerificationCode);
                            if (res.success && res.user) {
                              soundFX.playSuccess();
                              soundFX.playPowerUp();
                              setCurrentUser(res.user);
                              setSuccessMsg(
                                isAr
                                  ? `تم تفعيل حسابك بنجاح! أهلاً بك يا ${res.user.name}.`
                                  : `Account activated successfully! Welcome, ${res.user.name}.`
                              );
                              setTimeout(() => {
                                onSuccess?.(res.user!);
                                onClose();
                              }, 1200);
                            }
                          }}
                          className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-[#FFE600] text-black text-[11px] font-black font-anime cursor-pointer transition-all shadow-md flex items-center justify-center gap-1"
                        >
                          <Zap className="w-3 h-3" />
                          <span>{isAr ? 'تفعيل فوري بالرابط ⚡' : 'Activate Instantly ⚡'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Code Form */}
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {isFr ? 'Saisissez le code à 6 chiffres :' : isEs ? 'Introduce el código de 6 dígitos:' : 'Enter 6-Digit Code:'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-[#121526] border-2 border-emerald-500/60 focus:border-emerald-400 rounded-xl py-3 px-4 text-center font-mono text-2xl tracking-[0.3em] font-black text-white outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading || inputCode.length < 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#FFE600] hover:opacity-95 text-black font-black font-anime text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {loading 
                    ? (isFr ? 'Vérification...' : isEs ? 'Verificando...' : 'Verifying...') 
                    : (isFr ? 'Vérifier et Activer le Compte' : isEs ? 'Verificar y Activar Cuenta' : 'Verify & Activate Account')}
                </span>
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer disabled:text-gray-500"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                  <span>
                    {resendCooldown > 0 
                      ? `${isFr ? 'Renvoyer dans' : isEs ? 'Reenviar en' : 'Resend in'} ${resendCooldown}s` 
                      : (isFr ? 'Renvoyer le Code' : isEs ? 'Reenviar Código' : 'Resend Code')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playButtonClick();
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className="text-gray-400 hover:text-white underline cursor-pointer"
                >
                  {isFr ? 'Retour à la Connexion' : isEs ? 'Volver a Iniciar Sesión' : 'Back to Sign In'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================= */
          /* SIGN IN / NEW ACCOUNT TAB FORMS                          */
          /* ========================================================= */
          <div>
            {/* Mode Toggle Tabs */}
            <div className="flex rounded-xl bg-[#121526] p-1 mb-5 border border-gray-800">
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setMode('login');
                  setErrorMsg('');
                  setEmailDispatch(null);
                }}
                className={`flex-1 py-2 text-xs font-black font-anime rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {isFr ? 'Connexion' : isEs ? 'Iniciar Sesión' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setMode('register');
                  setErrorMsg('');
                  setEmailDispatch(null);
                }}
                className={`flex-1 py-2 text-xs font-black font-anime rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {isFr ? 'Créer un Compte' : isEs ? 'Registrarse' : 'New Account'}
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isFr ? 'Adresse Email :' : isEs ? 'Correo Electrónico:' : 'Email Address:'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="athlete@example.com"
                      className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 text-xs text-white outline-none transition-colors pl-9 pr-3 text-left"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-300">
                      {isFr ? 'Mot de Passe :' : isEs ? 'Contraseña:' : 'Password:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-emerald-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? (isFr ? 'Masquer' : isEs ? 'Ocultar' : 'Hide') : (isFr ? 'Afficher' : isEs ? 'Mostrar' : 'Show')}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 text-xs text-white outline-none transition-colors pl-9 pr-10 text-left font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-anime text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {loading 
                      ? (isFr ? 'Vérification...' : isEs ? 'Verificando...' : 'Verifying...') 
                      : (isFr ? 'Se Connecter' : isEs ? 'Iniciar Sesión' : 'Sign In')}
                  </span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isFr ? 'Nom de l’Athlète :' : isEs ? 'Nombre del Atleta:' : 'Athlete Name:'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Victor Cross"
                      className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 text-xs text-white outline-none transition-colors pl-9 pr-3 text-left"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isFr ? 'Adresse Email :' : isEs ? 'Correo Electrónico:' : 'Email Address:'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="athlete@example.com"
                      className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 text-xs text-white outline-none transition-colors pl-9 pr-3 text-left"
                    />
                  </div>
                </div>

                {/* Password Field with Eye Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-300">
                      {isFr ? 'Créer un Mot de Passe :' : isEs ? 'Crear Contraseña:' : 'Create Password:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-emerald-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? (isFr ? 'Masquer' : isEs ? 'Ocultar' : 'Hide') : (isFr ? 'Afficher' : isEs ? 'Mostrar' : 'Show')}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="•••••••• (Min 6 chars)"
                      className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 text-xs text-white outline-none transition-colors pl-9 pr-10 text-left font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-300">
                      {isFr ? 'Confirmer le Mot de Passe :' : isEs ? 'Confirmar Contraseña:' : 'Confirm Password:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[10px] text-emerald-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showConfirmPassword ? (isFr ? 'Masquer' : isEs ? 'Ocultar' : 'Hide') : (isFr ? 'Afficher' : isEs ? 'Mostrar' : 'Show')}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-[#121526] border rounded-xl py-2.5 text-xs text-white outline-none transition-colors pl-9 pr-10 text-left font-mono ${
                        confirmPassword && confirmPassword !== password 
                          ? 'border-red-500/70' 
                          : confirmPassword && confirmPassword === password 
                          ? 'border-emerald-500/70' 
                          : 'border-gray-800 focus:border-emerald-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-300 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <span className="text-[10px] text-red-400 font-bold block mt-1">
                      {isFr ? 'Les mots de passe ne correspondent pas' : isEs ? 'Las contraseñas no coinciden' : 'Passwords do not match'}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isFr ? 'Discipline Principale :' : isEs ? 'Disciplina Principal:' : 'Primary Discipline:'}
                  </label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white outline-none transition-colors"
                  >
                    <option value="🥊 Boxing & Explosive Striking">🥊 Boxing & Explosive Striking</option>
                    <option value="🥋 Muay Thai & Kinetic Kicking">🥋 Muay Thai & Kinetic Kicking</option>
                    <option value="⚡ MMA & Tactical Grappling">⚡ MMA & Tactical Grappling</option>
                    <option value="🦾 Calisthenics & Functional Power">🦾 Calisthenics & Functional Power</option>
                    <option value="🏃 Sprint & High Intensity Interval">🏃 Sprint & High Intensity Interval</option>
                  </select>
                </div>

                {/* Email Confirmation Notice before submitting */}
                <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>
                    {isFr 
                      ? 'Un code de confirmation par e-mail vous sera envoyé pour activer votre profil.' 
                      : isEs 
                      ? 'Se enviará un código de confirmación por correo para activar tu perfil.' 
                      : 'An email confirmation code will be required before your profile is activated.'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-anime text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {loading 
                      ? (isFr ? 'Création...' : isEs ? 'Creando...' : 'Creating...') 
                      : (isFr ? 'S’Inscrire et Envoyer le Code' : isEs ? 'Registrarse y Enviar Código' : 'Register & Receive Code')}
                  </span>
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
