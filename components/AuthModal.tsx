/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Zap,
  LogOut,
  CheckCircle,
  Eye,
  EyeOff,
  UserCheck,
  ExternalLink,
  Send,
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  Link2,
  ArrowLeft
} from 'lucide-react';
import { authService, AuthUser } from '../services/authService';
import { emailService, EmailDispatchResult } from '../services/emailService';
import { soundFX } from '../services/soundFX';
import { Language, tr } from '../i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
  initialMode?: 'login' | 'register';
  onSuccess?: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
  initialMode = 'login',
  onSuccess
}) => {
  const isAr = currentLang === 'ar';
  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot'>(initialMode);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [discipline, setDiscipline] = useState('🥊 Boxing & Explosive Striking');

  const [verifyEmailAddress, setVerifyEmailAddress] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [currentVerificationCode, setCurrentVerificationCode] = useState('');
  const [currentVerificationToken, setCurrentVerificationToken] = useState<string | undefined>(undefined);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Forgot password states
  const [resetRequested, setResetRequested] = useState(false);
  const [resetCodeDisplay, setResetCodeDisplay] = useState('');
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [emailDispatch, setEmailDispatch] = useState<EmailDispatchResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentUser(authService.getCurrentUser());
      setErrorMsg('');
      setSuccessMsg('');
      if (mode !== 'verify') {
        setMode(initialMode);
      }
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    const syncUser = (e: CustomEvent<{ user?: AuthUser | null }>) => {
      const user = e.detail?.user !== undefined ? e.detail.user : authService.getCurrentUser();
      setCurrentUser(user);
    };
    window.addEventListener('yard300_auth_change', syncUser as EventListener);
    return () => window.removeEventListener('yard300_auth_change', syncUser as EventListener);
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const disciplines = [
    {
      value: '🥊 Boxing & Explosive Striking',
      label: tr(currentLang, {
        en: 'Boxing & Explosive Striking',
        es: 'Boxeo y Golpeo Explosivo',
        fr: 'Boxe et Frappe Explosive',
        ar: 'الملاكمة والضرب الانفجاري'
      })
    },
    {
      value: '🥋 Muay Thai & Kinetic Kicking',
      label: tr(currentLang, {
        en: 'Muay Thai & Kinetic Kicking',
        es: 'Muay Thai y Pateo Cinético',
        fr: 'Muay Thaï & Coups Cinétiques',
        ar: 'المواي تاي والركل الحركي'
      })
    },
    {
      value: '⚡ MMA & Tactical Grappling',
      label: tr(currentLang, {
        en: 'MMA & Tactical Grappling',
        es: 'MMA y Lucha Táctica',
        fr: 'MMA & Grappling Tactique',
        ar: 'فنون القتال المختلطة MMA'
      })
    },
    {
      value: '🦾 Calisthenics & Functional Power',
      label: tr(currentLang, {
        en: 'Calisthenics & Functional Power',
        es: 'Calistenia y Fuerza Funcional',
        fr: 'Callisthénie & Puissance Fonctionnelle',
        ar: 'الكاليستنكس والقوة الوظيفية'
      })
    },
    {
      value: '🏃 Sprint & High Intensity Interval',
      label: tr(currentLang, {
        en: 'Sprint & High Intensity Interval',
        es: 'Sprint e Intervalos HIIT',
        fr: 'Sprint et Haute Intensité HIIT',
        ar: 'العدو السريع والتحمل العالي'
      })
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setEmailDispatch(null);
    setLoading(true);
    soundFX.playButtonClick();

    if (!password.trim()) {
      soundFX.playError();
      setErrorMsg(
        tr(currentLang, {
          en: 'Password is required to sign in.',
          es: 'La contraseña es obligatoria.',
          fr: 'Le mot de passe est obligatoire.',
          ar: 'كلمة المرور مطلوبة لتسجيل الدخول.'
        })
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
          tr(currentLang, {
            en: `Welcome back, ${res.user.name}!`,
            es: `¡Bienvenido de nuevo, ${res.user.name}!`,
            fr: `Bon retour, ${res.user.name} !`,
            ar: `أهلاً بعودتك يا ${res.user.name}!`
          })
        );
        setTimeout(() => {
          onSuccess?.(res.user!);
          onClose();
        }, 900);
      } else if (res.requiresVerification) {
        soundFX.playError();
        const targetEmail = email.trim().toLowerCase();
        setVerifyEmailAddress(targetEmail);
        setCurrentVerificationCode(res.verificationCode || '');
        setCurrentVerificationToken(res.verificationToken);
        setMode('verify');
        setErrorMsg(
          tr(currentLang, {
            en: 'Please confirm your email via the link or 6-digit code before signing in.',
            es: 'Confirma tu correo con el enlace o código de 6 dígitos antes de iniciar sesión.',
            fr: 'Veuillez confirmer votre e-mail avec le lien ou le code à 6 chiffres avant de continuer.',
            ar: 'يرجى تأكيد بريدك الإلكتروني عبر رابط التفعيل أو الرمز قبل تسجيل الدخول.'
          })
        );
        const mailRes = await emailService.sendVerificationCode(
          targetEmail,
          targetEmail.split('@')[0],
          res.verificationCode || '',
          res.verificationToken,
          currentLang
        );
        setEmailDispatch(mailRes);
      } else {
        soundFX.playError();
        setErrorMsg(
          res.lockedSeconds
            ? tr(currentLang, {
                en: `Too many failed attempts. Locked for ${res.lockedSeconds}s for your security.`,
                es: `Demasiados intentos fallidos. Bloqueado por ${res.lockedSeconds}s por seguridad.`,
                fr: `Trop de tentatives échouées. Verrouillé pendant ${res.lockedSeconds}s pour votre sécurité.`,
                ar: `تم تجاوز عدد المحاولات المسموح بها. تم القفل لمدة ${res.lockedSeconds} ثانية لحماية حسابك.`
              })
            : res.error ||
                tr(currentLang, {
                  en: 'Invalid credentials or incorrect password.',
                  es: 'Credenciales o contraseña incorrectas.',
                  fr: 'Identifiants ou mot de passe incorrects.',
                  ar: 'بيانات الاعتماد أو كلمة المرور غير صحيحة.'
                })
        );
      }
    } catch {
      soundFX.playError();
      setErrorMsg(
        tr(currentLang, {
          en: 'An error occurred during sign in.',
          es: 'Ocurrió un error al iniciar sesión.',
          fr: 'Une erreur est survenue lors de la connexion.',
          ar: 'حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة ثانية.'
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setEmailDispatch(null);
    setLoading(true);
    soundFX.playButtonClick();

    if (name.trim().length < 2) {
      setErrorMsg(
        tr(currentLang, {
          en: 'Please enter your athlete name (min 2 chars).',
          es: 'Introduce tu nombre de atleta (mínimo 2 caracteres).',
          fr: 'Veuillez saisir votre nom d’athlète (2 caractères min.).',
          ar: 'يرجى إدخال اسم الرياضي (حرفان على الأقل).'
        })
      );
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      soundFX.playError();
      setErrorMsg(
        tr(currentLang, {
          en: 'Password must be at least 6 characters long.',
          es: 'La contraseña debe tener al menos 6 caracteres.',
          fr: 'Le mot de passe doit contenir au moins 6 caractères.',
          ar: 'يجب ألا تقل كلمة المرور عن 6 أحرف.'
        })
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      soundFX.playError();
      setErrorMsg(
        tr(currentLang, {
          en: 'Passwords do not match.',
          es: 'Las dos contraseñas no coinciden.',
          fr: 'Les deux mots de passe ne correspondent pas.',
          ar: 'كلمتا المرور غير متطابقتين.'
        })
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
        const token = res.verificationToken;
        const cleanTarget = email.trim().toLowerCase();
        setVerifyEmailAddress(cleanTarget);
        setCurrentVerificationCode(code);
        setCurrentVerificationToken(token);
        setMode('verify');
        setPassword('');
        setConfirmPassword('');
        setResendCooldown(60);

        const mailRes = await emailService.sendVerificationCode(cleanTarget, name, code, token, currentLang);
        setEmailDispatch(mailRes);

        setSuccessMsg(
          tr(currentLang, {
            en: 'Confirmation link & code generated! Open your link or enter the 6-digit code to activate.',
            es: '¡Enlace y código de confirmación listos! Abre tu enlace o ingresa el código de 6 dígitos.',
            fr: 'Lien et code de confirmation prêts ! Ouvrez votre lien ou saisissez le code à 6 chiffres.',
            ar: 'تم تجهيز رابط التفعيل ورمز التأكيد! اضغط على الرابط أو أدخل الرمز لتفعيل الحساب فوراً.'
          })
        );
      } else {
        soundFX.playError();
        setErrorMsg(
          res.error ||
            tr(currentLang, {
              en: 'Failed to create account.',
              es: 'Fallo al crear la cuenta.',
              fr: 'Échec de la création du compte.',
              ar: 'تعذر إنشاء الحساب.'
            })
        );
      }
    } catch {
      soundFX.playError();
      setErrorMsg(
        tr(currentLang, {
          en: 'Failed to create account.',
          es: 'Fallo al crear la cuenta.',
          fr: 'Échec de la création du compte.',
          ar: 'تعذر إنشاء الحساب.'
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    soundFX.playButtonClick();

    const clean = inputCode.trim();
    if (!clean || clean.length < 6) {
      soundFX.playError();
      setErrorMsg(
        tr(currentLang, {
          en: 'Please enter the complete 6-digit confirmation code.',
          es: 'Introduce el código completo de 6 dígitos.',
          fr: 'Veuillez saisir le code complet à 6 chiffres.',
          ar: 'يرجى إدخال رمز التأكيد كاملاً المكون من 6 أرقام.'
        })
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
        tr(currentLang, {
          en: `Account verified and activated! Welcome, ${res.user.name}.`,
          es: `¡Cuenta verificada y activada! Bienvenido, ${res.user.name}.`,
          fr: `Compte vérifié et activé ! Bienvenue, ${res.user.name}.`,
          ar: `تم تفعيل وتأكيد الحساب بنجاح! مرحباً بك يا ${res.user.name}.`
        })
      );
      setTimeout(() => {
        onSuccess?.(res.user!);
        onClose();
      }, 1000);
    } else {
      soundFX.playError();
      setErrorMsg(
        res.error ||
          tr(currentLang, {
            en: 'Incorrect or expired confirmation code.',
            es: 'Código de confirmación incorrecto o caducado.',
            fr: 'Code de confirmation incorrect ou expiré.',
            ar: 'رمز التأكيد غير صحيح أو منتهي الصلاحية.'
          })
      );
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    soundFX.playButtonClick();
    setErrorMsg('');
    const res = authService.resendVerificationCode(verifyEmailAddress);
    if (res.success && res.verificationCode) {
      setCurrentVerificationCode(res.verificationCode);
      setCurrentVerificationToken(res.verificationToken);
      setResendCooldown(60);
      const mailRes = await emailService.sendVerificationCode(
        verifyEmailAddress,
        name || verifyEmailAddress.split('@')[0],
        res.verificationCode,
        res.verificationToken,
        currentLang
      );
      setEmailDispatch(mailRes);
      setSuccessMsg(
        tr(currentLang, {
          en: 'A fresh confirmation link & code has been generated!',
          es: '¡Nuevo enlace y código de confirmación enviado!',
          fr: 'Un nouveau lien et code de confirmation ont été envoyés !',
          ar: 'تم إرسال رابط ورمز تأكيد جديد إلى بريدك!'
        })
      );
    } else {
      setErrorMsg(
        res.error ||
          tr(currentLang, {
            en: 'Failed to resend confirmation link.',
            es: 'No se pudo reenviar el código.',
            fr: 'Impossible de renvoyer le code.',
            ar: 'فشل إعادة إرسال الرابط.'
          })
      );
    }
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    soundFX.playButtonClick();
    const res = authService.requestPasswordReset(email);
    if (!res.success || !res.resetCode) {
      soundFX.playError();
      setErrorMsg(
        res.error ||
          tr(currentLang, {
            en: 'No registered account matches this email.',
            es: 'No existe cuenta con este correo.',
            fr: 'Aucun compte enregistré avec cet e-mail.',
            ar: 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.'
          })
      );
      return;
    }
    setResetRequested(true);
    setResetCodeDisplay(res.resetCode);
    const mailRes = await emailService.sendVerificationCode(
      email,
      email.split('@')[0],
      res.resetCode,
      res.resetToken,
      currentLang
    );
    setEmailDispatch(mailRes);
    setSuccessMsg(
      tr(currentLang, {
        en: 'Reset code issued! Enter the 6-digit code and choose a new password.',
        es: '¡Código emitido! Ingresa el código y elige tu nueva contraseña.',
        fr: 'Code généré ! Saisissez le code et choisissez votre nouveau mot de passe.',
        ar: 'تم إنشاء رمز الاستعادة! أدخل الرمز واختر كلمة مرور جديدة.'
      })
    );
  };

  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    soundFX.playButtonClick();
    const res = await authService.confirmPasswordReset(email, resetCodeInput, newPasswordInput);
    if (res.success && res.user) {
      soundFX.playSuccess();
      setCurrentUser(res.user);
      setResetRequested(false);
      setSuccessMsg(
        tr(currentLang, {
          en: `Password updated and signed in as ${res.user.name}.`,
          es: `Contraseña actualizada e inicio de sesión como ${res.user.name}.`,
          fr: `Mot de passe mis à jour et connecté en tant que ${res.user.name}.`,
          ar: `تم تحديث كلمة المرور والدخول باسم ${res.user.name}.`
        })
      );
      setTimeout(() => {
        onSuccess?.(res.user!);
        onClose();
      }, 1000);
    } else {
      soundFX.playError();
      setErrorMsg(res.error || 'Failed to reset password');
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
      tr(currentLang, {
        en: 'Logged out successfully',
        es: 'Sesión cerrada con éxito',
        fr: 'Déconnexion réussie',
        ar: 'تم تسجيل الخروج بنجاح'
      })
    );
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`bg-[#0C0E18] border border-emerald-500/45 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.25)] relative overflow-hidden text-white max-h-[92vh] overflow-y-auto ${
          isAr ? 'text-right' : 'text-left'
        }`}
      >
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

        <button
          onClick={() => {
            soundFX.playButtonClick();
            onClose();
          }}
          className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 rounded-xl bg-[#141626] text-gray-400 hover:text-white hover:bg-red-500/20 transition-colors cursor-pointer`}
          aria-label={tr(currentLang, { en: 'Close', es: 'Cerrar', fr: 'Fermer', ar: 'إغلاق' })}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-[#D4AF37]/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0">
            {mode === 'verify' ? <KeyRound className="w-5 h-5 text-cyan-400" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-widest block">
              {tr(currentLang, {
                en: 'YARD 300 // ATHLETE SECURITY',
                es: 'YARD 300 // SEGURIDAD DEL ATLETA',
                fr: 'YARD 300 // SÉCURITÉ ATHLÈTE',
                ar: 'YARD 300 // بوابة الأمان والهوية'
              })}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {currentUser
                ? tr(currentLang, {
                    en: 'Athlete Account & Session',
                    es: 'Cuenta y Sesión del Atleta',
                    fr: 'Compte & Session Athlète',
                    ar: 'إدارة حساب الرياضي والجلسة'
                  })
                : mode === 'verify'
                ? tr(currentLang, {
                    en: 'Email Confirmation Required',
                    es: 'Confirmación de Correo',
                    fr: 'Validation de l’E-mail',
                    ar: 'تأكيد الحساب وتفعيل البريد'
                  })
                : mode === 'forgot'
                ? tr(currentLang, {
                    en: 'Reset Athlete Password',
                    es: 'Restablecer Contraseña',
                    fr: 'Réinitialiser le Mot de Passe',
                    ar: 'استعادة كلمة المرور'
                  })
                : mode === 'login'
                ? tr(currentLang, {
                    en: 'Secure Athlete Sign In',
                    es: 'Iniciar Sesión Segura',
                    fr: 'Connexion Sécurisée',
                    ar: 'تسجيل الدخول الآمن'
                  })
                : tr(currentLang, {
                    en: 'Create Athlete Account',
                    es: 'Crear Cuenta de Atleta',
                    fr: 'Créer un Compte Athlète',
                    ar: 'إنشاء حساب رياضي جديد'
                  })}
            </h3>
          </div>
        </div>

        {/* Feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Logged-in Dashboard Card */}
        {currentUser ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-[#121526] border border-gray-800 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-400/50"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-base truncate">{currentUser.name}</h4>
                  <span className="text-xs text-gray-400 font-mono block truncate" dir="ltr">{currentUser.email}</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold mt-1">
                    {currentUser.rankTitle}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/80 text-xs">
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[10px] text-gray-400 block">
                    {tr(currentLang, { en: 'Level', es: 'Nivel', fr: 'Niveau', ar: 'المستوى' })}
                  </span>
                  <span className="font-bold text-[#D4AF37] font-mono">LVL {currentUser.level}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[10px] text-gray-400 block">
                    {tr(currentLang, { en: 'Aura Points', es: 'Puntos de Aura', fr: "Points d'Aura", ar: 'نقاط الهالة' })}
                  </span>
                  <span className="font-bold text-[#10B981] font-mono">{currentUser.totalAuraPoints} AU</span>
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
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {tr(currentLang, {
                    en: 'Open My Complete Profile',
                    es: 'Abrir Mi Perfil Completo',
                    fr: 'Ouvrir Mon Profil Complet',
                    ar: 'فتح ملفي الرياضي الكامل'
                  })}
                </span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>
                  {tr(currentLang, {
                    en: 'Sign Out of Account',
                    es: 'Cerrar Sesión de la Cuenta',
                    fr: 'Se Déconnecter du Compte',
                    ar: 'تسجيل الخروج من الحساب'
                  })}
                </span>
              </button>
            </div>
          </div>
        ) : mode === 'verify' ? (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Send className="w-4 h-4" />
                <span>
                  {tr(currentLang, {
                    en: 'Activation Required',
                    es: 'Confirmación Requerida',
                    fr: 'Vérification Obligatoire',
                    ar: 'مطلوب تأكيد وتفعيل البريد'
                  })}
                </span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                {tr(currentLang, {
                  en: 'For account security, activate your profile via the direct confirmation link or the 6-digit code sent to:',
                  es: 'Por seguridad, activa tu perfil usando el enlace directo de confirmación o el código de 6 dígitos enviado a:',
                  fr: 'Par sécurité, activez votre profil via le lien direct de confirmation ou le code à 6 chiffres envoyé à :',
                  ar: 'لأمان حسابك، قم بتفعيل ملفك عبر رابط التأكيد المباشر أو رمز التحقق المرسل إلى:'
                })}
              </p>
              <div className="p-2.5 bg-black/60 rounded-xl border border-cyan-500/30 font-mono text-cyan-300 font-bold text-xs break-all flex items-center justify-between" dir="ltr">
                <span>{verifyEmailAddress}</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-bold shrink-0">
                  {tr(currentLang, { en: 'PENDING', es: 'PENDIENTE', fr: 'EN ATTENTE', ar: 'بانتظار التفعيل' })}
                </span>
              </div>
            </div>

            {currentVerificationCode && (
              <div className="p-4 rounded-2xl bg-[#14182E] border border-emerald-400/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>
                      {tr(currentLang, {
                        en: 'Confirmation Code & Link:',
                        es: 'Código y Enlace de Confirmación:',
                        fr: 'Code et Lien de Confirmation :',
                        ar: 'رمز ورابط التأكيد:'
                      })}
                    </span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    {tr(currentLang, { en: 'Valid 15m', es: 'Válido 15m', fr: 'Valide 15m', ar: 'صالح 15 دقيقة' })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 bg-black/70 p-2.5 rounded-xl border border-gray-800" dir="ltr">
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#D4AF37] tracking-[0.22em]">
                    {currentVerificationCode}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>
                        {copiedCode
                          ? tr(currentLang, { en: 'Copied', es: 'Copiado', fr: 'Copié', ar: 'نُسخ' })
                          : tr(currentLang, { en: 'Copy', es: 'Copiar', fr: 'Copier', ar: 'نسخ' })}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoFillCode}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold cursor-pointer"
                    >
                      {tr(currentLang, { en: 'Auto-Fill', es: 'Rellenar', fr: 'Remplir', ar: 'تعبئة' })}
                    </button>
                  </div>
                </div>

                {emailDispatch && (
                  <div className="flex flex-wrap gap-1.5">
                    <a
                      href={emailDispatch.gmailWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-[11px] font-bold cursor-pointer"
                    >
                      <span>Gmail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={emailDispatch.outlookWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold cursor-pointer"
                    >
                      <span>Outlook</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={emailDispatch.directMailtoUrl}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181A2D] hover:bg-[#20243C] text-cyan-300 border border-cyan-500/30 text-[11px] font-bold cursor-pointer"
                    >
                      <span>
                        {tr(currentLang, {
                          en: 'Send via Mail App',
                          es: 'Enviar por Correo',
                          fr: 'Ouvrir Messagerie',
                          ar: 'إرسال عبر البريد'
                        })}
                      </span>
                    </a>
                  </div>
                )}

                {emailDispatch?.verificationLink && (
                  <div className="p-3 rounded-xl bg-black/70 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {tr(currentLang, {
                            en: 'Direct 1-Click Activation Link:',
                            es: 'Enlace Directo de Activación:',
                            fr: 'Lien d’Activation en 1 Clic :',
                            ar: 'رابط التفعيل المباشر بنقرة واحدة:'
                          })}
                        </span>
                      </span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                        1-CLICK
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2" dir="ltr">
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
                          className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1"
                        >
                          {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>
                            {copiedLink
                              ? tr(currentLang, { en: 'Copied', es: 'Copiado', fr: 'Copié', ar: 'تم النسخ' })
                              : tr(currentLang, { en: 'Copy Link', es: 'Copiar', fr: 'Copier', ar: 'نسخ الرابط' })}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleAutoFillCode();
                            const tokenOrCode = currentVerificationToken || currentVerificationCode;
                            const res = authService.verifyEmailCode(verifyEmailAddress, tokenOrCode);
                            if (res.success && res.user) {
                              soundFX.playSuccess();
                              soundFX.playPowerUp();
                              setCurrentUser(res.user);
                              setSuccessMsg(
                                tr(currentLang, {
                                  en: `Account activated successfully! Welcome, ${res.user.name}.`,
                                  es: `¡Cuenta activada con éxito! Bienvenido, ${res.user.name}.`,
                                  fr: `Compte activé avec succès ! Bienvenue, ${res.user.name}.`,
                                  ar: `تم تفعيل حسابك بنجاح! أهلاً بك يا ${res.user.name}.`
                                })
                              );
                              setTimeout(() => {
                                onSuccess?.(res.user!);
                                onClose();
                              }, 900);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-[#D4AF37] text-black text-[11px] font-bold cursor-pointer flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3" />
                          <span>
                            {tr(currentLang, {
                              en: 'Activate Now',
                              es: 'Activar Ahora',
                              fr: 'Activer',
                              ar: 'تفعيل فوري'
                            })}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {tr(currentLang, {
                    en: 'Enter 6-Digit Code:',
                    es: 'Introduce el código de 6 dígitos:',
                    fr: 'Saisissez le code à 6 chiffres :',
                    ar: 'أدخل رمز التأكيد المكون من 6 أرقام:'
                  })}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  dir="ltr"
                  className="w-full bg-[#121526] border-2 border-emerald-500/60 focus:border-emerald-400 rounded-xl py-2.5 px-4 text-center font-mono text-2xl tracking-[0.3em] font-black text-white outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading || inputCode.length < 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-[#D4AF37] text-black font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {loading
                    ? tr(currentLang, { en: 'Verifying...', es: 'Verificando...', fr: 'Vérification...', ar: 'جاري التحقق...' })
                    : tr(currentLang, {
                        en: 'Verify & Activate Account',
                        es: 'Verificar y Activar Cuenta',
                        fr: 'Vérifier et Activer le Compte',
                        ar: 'تأكيد وتفعيل الحساب'
                      })}
                </span>
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer disabled:text-gray-500"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {resendCooldown > 0
                      ? tr(currentLang, {
                          en: `Resend in ${resendCooldown}s`,
                          es: `Reenviar en ${resendCooldown}s`,
                          fr: `Renvoyer dans ${resendCooldown}s`,
                          ar: `إعادة الإرسال خلال ${resendCooldown} ث`
                        })
                      : tr(currentLang, {
                          en: 'Resend Link & Code',
                          es: 'Reenviar Enlace y Código',
                          fr: 'Renvoyer Lien & Code',
                          ar: 'إعادة إرسال الرابط والرمز'
                        })}
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
                  {tr(currentLang, {
                    en: 'Back to Sign In',
                    es: 'Volver a Iniciar Sesión',
                    fr: 'Retour à la Connexion',
                    ar: 'العودة لتسجيل الدخول'
                  })}
                </button>
              </div>
            </form>
          </div>
        ) : mode === 'forgot' ? (
          <div className="space-y-4 animate-fade-in">
            {!resetRequested ? (
              <form onSubmit={handleRequestPasswordReset} className="space-y-3.5">
                <p className="text-xs text-slate-300">
                  {tr(currentLang, {
                    en: 'Enter your registered email to receive a single-use password reset code and link.',
                    es: 'Ingresa tu correo registrado para recibir un código único de recuperación.',
                    fr: 'Saisissez votre e-mail pour recevoir un code unique de réinitialisation.',
                    ar: 'أدخل بريدك الإلكتروني المسجل لاستلام رمز استعادة كلمة المرور.'
                  })}
                </p>
                <div className="relative" dir="ltr">
                  <Mail className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@example.com"
                    className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 text-xs text-white outline-none pl-9 pr-3 text-left"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer"
                >
                  {tr(currentLang, {
                    en: 'Send Reset Code',
                    es: 'Enviar Código de Recuperación',
                    fr: 'Envoyer le Code',
                    ar: 'إرسال رمز الاستعادة'
                  })}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmPasswordReset} className="space-y-3.5">
                {resetCodeDisplay && (
                  <div className="p-2.5 rounded-xl bg-black/60 border border-emerald-500/40 flex items-center justify-between" dir="ltr">
                    <span className="font-mono font-bold text-[#D4AF37] text-sm tracking-widest">{resetCodeDisplay}</span>
                    <button
                      type="button"
                      onClick={() => setResetCodeInput(resetCodeDisplay)}
                      className="px-2 py-1 rounded bg-emerald-500 text-black text-[10px] font-bold cursor-pointer"
                    >
                      {tr(currentLang, { en: 'Use Code', es: 'Usar Código', fr: 'Utiliser', ar: 'استخدام الرمز' })}
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {tr(currentLang, { en: '6-Digit Reset Code:', es: 'Código de 6 dígitos:', fr: 'Code à 6 chiffres :', ar: 'رمز الاستعادة:' })}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={resetCodeInput}
                    onChange={(e) => setResetCodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    dir="ltr"
                    className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-center font-mono text-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {tr(currentLang, { en: 'New Password:', es: 'Nueva Contraseña:', fr: 'Nouveau Mot de Passe :', ar: 'كلمة المرور الجديدة:' })}
                  </label>
                  <input
                    type="password"
                    minLength={6}
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white font-mono outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer"
                >
                  {tr(currentLang, {
                    en: 'Update Password & Sign In',
                    es: 'Actualizar Contraseña y Entrar',
                    fr: 'Mettre à Jour & Se Connecter',
                    ar: 'تحديث كلمة المرور والدخول'
                  })}
                </button>
              </form>
            )}
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setResetRequested(false);
                setErrorMsg('');
              }}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>
                {tr(currentLang, {
                  en: 'Back to Sign In',
                  es: 'Volver a Iniciar Sesión',
                  fr: 'Retour à la Connexion',
                  ar: 'العودة لتسجيل الدخول'
                })}
              </span>
            </button>
          </div>
        ) : (
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
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tr(currentLang, { en: 'Sign In', es: 'Iniciar Sesión', fr: 'Connexion', ar: 'تسجيل الدخول' })}
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setMode('register');
                  setErrorMsg('');
                  setEmailDispatch(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tr(currentLang, { en: 'New Account', es: 'Registrarse', fr: 'Créer un Compte', ar: 'حساب جديد' })}
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {tr(currentLang, { en: 'Email Address:', es: 'Correo Electrónico:', fr: 'Adresse Email :', ar: 'البريد الإلكتروني:' })}
                  </label>
                  <div className="relative" dir="ltr">
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
                      {tr(currentLang, { en: 'Password:', es: 'Contraseña:', fr: 'Mot de Passe :', ar: 'كلمة المرور:' })}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-emerald-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>
                        {showPassword
                          ? tr(currentLang, { en: 'Hide', es: 'Ocultar', fr: 'Masquer', ar: 'إخفاء' })
                          : tr(currentLang, { en: 'Show', es: 'Mostrar', fr: 'Afficher', ar: 'إظهار' })}
                      </span>
                    </button>
                  </div>
                  <div className="relative" dir="ltr">
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
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                  >
                    {tr(currentLang, {
                      en: 'Forgot password?',
                      es: '¿Olvidaste tu contraseña?',
                      fr: 'Mot de passe oublié ?',
                      ar: 'نسيت كلمة المرور؟'
                    })}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {loading
                      ? tr(currentLang, { en: 'Verifying...', es: 'Verificando...', fr: 'Vérification...', ar: 'جاري التحقق...' })
                      : tr(currentLang, { en: 'Sign In', es: 'Iniciar Sesión', fr: 'Se Connecter', ar: 'دخول آمن' })}
                  </span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {tr(currentLang, { en: 'Athlete Name:', es: 'Nombre del Atleta:', fr: 'Nom de l’Athlète :', ar: 'اسم الرياضي:' })}
                  </label>
                  <div className="relative" dir="ltr">
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
                    {tr(currentLang, { en: 'Email Address:', es: 'Correo Electrónico:', fr: 'Adresse Email :', ar: 'البريد الإلكتروني:' })}
                  </label>
                  <div className="relative" dir="ltr">
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
                      {tr(currentLang, { en: 'Create Password:', es: 'Crear Contraseña:', fr: 'Créer un Mot de Passe :', ar: 'إنشاء كلمة مرور:' })}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-emerald-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>
                        {showPassword
                          ? tr(currentLang, { en: 'Hide', es: 'Ocultar', fr: 'Masquer', ar: 'إخفاء' })
                          : tr(currentLang, { en: 'Show', es: 'Mostrar', fr: 'Afficher', ar: 'إظهار' })}
                      </span>
                    </button>
                  </div>
                  <div className="relative" dir="ltr">
                    <Lock className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 text-xs text-white outline-none transition-colors pl-9 pr-10 text-left font-mono"
                    />
                  </div>
                  {password.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="flex-1 h-1 rounded bg-gray-800 overflow-hidden flex gap-0.5">
                        {[1, 2, 3, 4].map((lvl) => (
                          <div
                            key={lvl}
                            className={`flex-1 h-full transition-colors ${
                              passwordStrength >= lvl
                                ? passwordStrength <= 1
                                  ? 'bg-red-500'
                                  : passwordStrength === 2
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                                : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        {passwordStrength <= 1
                          ? tr(currentLang, { en: 'Weak', es: 'Débil', fr: 'Faible', ar: 'ضعيفة' })
                          : passwordStrength === 2
                          ? tr(currentLang, { en: 'Good', es: 'Media', fr: 'Moyenne', ar: 'جيدة' })
                          : tr(currentLang, { en: 'Strong', es: 'Fuerte', fr: 'Forte', ar: 'قوية' })}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-300">
                      {tr(currentLang, { en: 'Confirm Password:', es: 'Confirmar Contraseña:', fr: 'Confirmer le Mot de Passe :', ar: 'تأكيد كلمة المرور:' })}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[10px] text-emerald-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="relative" dir="ltr">
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
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {tr(currentLang, { en: 'Primary Discipline:', es: 'Disciplina Principal:', fr: 'Discipline Principale :', ar: 'التخصص الرياضي:' })}
                  </label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full bg-[#121526] border border-gray-800 focus:border-emerald-400 rounded-xl py-2.5 px-3 text-xs text-white outline-none transition-colors"
                  >
                    {disciplines.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>
                    {tr(currentLang, {
                      en: 'An instant activation link & code will be issued to confirm your email.',
                      es: 'Se emitirá un enlace de activación y código para confirmar tu correo.',
                      fr: 'Un lien d’activation instantané et un code seront envoyés pour valider votre e-mail.',
                      ar: 'سيتم إرسال رابط تفعيل مباشر ورمز تأكيد لتنشيط حسابك فوراً.'
                    })}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {loading
                      ? tr(currentLang, { en: 'Creating...', es: 'Creando...', fr: 'Création...', ar: 'جاري الإنشاء...' })
                      : tr(currentLang, {
                          en: 'Register & Send Activation Link',
                          es: 'Registrarse y Enviar Enlace',
                          fr: 'S’Inscrire et Recevoir le Lien',
                          ar: 'إنشاء الحساب وإرسال رابط التأكيد'
                        })}
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
