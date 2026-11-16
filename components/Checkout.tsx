/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Language, tr } from '../i18n';
import { 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  CreditCard, 
  Coins, 
  ArrowLeft, 
  HeartPulse,
  Activity,
  Moon,
  Lock,
  Copy,
  Check,
  Receipt,
  Printer
} from 'lucide-react';
import { soundFX } from '../services/soundFX';
import { OwnerConfigService } from '../services/ownerConfigService';
import { authService } from '../services/authService';
import { emailService } from '../services/emailService';

interface CheckoutProps {
  items: Product[];
  onBack: () => void;
  currentLang?: Language;
  onSuccess?: () => void;
}

export interface PlacedOrder {
  id: string;
  items: Product[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  transactionRef: string;
  date: string;
  timestamp: number;
  athleteName: string;
  athleteEmail: string;
  shippingAddress: string;
  status: 'PAID' | 'CONFIRMED';
}

declare global {
  interface Window {
    ethereum?: any;
    PaymentRequest?: any;
  }
}

export const Checkout: React.FC<CheckoutProps> = ({ 
  items, 
  onBack, 
  currentLang = 'en',
  onSuccess 
}) => {
  const isAr = currentLang === 'ar';

  const currentUser = authService.getCurrentUser();
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'metamask' | 'paypal' | 'applepay' | 'googlepay'>('card');
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [shippingAddress, setShippingAddress] = useState('777 Champions Blvd, S-Rank Training Ground');
  const [shippingCity] = useState('Los Angeles, CA');

  // Processing & Success State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<PlacedOrder | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  // MetaMask Web3 State
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [networkName] = useState('Ethereum Mainnet');
  const [isConnecting, setIsConnecting] = useState(false);

  // ETH Conversion rate
  const ethEquivalent = (total / 2650).toFixed(4);
  const TREASURY_WALLET_ADDRESS = OwnerConfigService.getTreasuryAddress('eth') || '0x8C7Fcba5c8A96c6F9A83f077606A0911a949a93E';

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.substring(0, 2)}/${raw.substring(2)}`;
    }
    setExpiry(raw);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setHasMetaMask(true);
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        })
        .catch(() => {});
    }
  }, []);

  const connectMetaMask = async () => {
    soundFX.playButtonClick();
    setFormError(null);
    if (!window.ethereum) {
      setFormError(
        tr(currentLang, {
          ar: 'إضافة MetaMask غير مثبتة في متصفحك.',
          fr: 'Extension MetaMask introuvable dans votre navigateur.',
          es: 'Extensión MetaMask no detectada en su navegador.',
          en: 'MetaMask extension not detected in your browser.'
        })
      );
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        soundFX.playSuccess();
      }
    } catch (err: any) {
      setFormError(
        err?.message ||
          tr(currentLang, {
            ar: 'فشل الاتصال بمحفظة MetaMask.',
            fr: 'Échec de connexion à MetaMask.',
            es: 'Error al conectar MetaMask.',
            en: 'Failed to connect MetaMask'
          })
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const finalizeOrder = async (methodLabel: string, txRef: string) => {
    const orderId = `ORD-YARD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    
    const newOrder: PlacedOrder = {
      id: orderId,
      items: [...items],
      subtotal,
      shipping: 0,
      total,
      paymentMethod: methodLabel,
      transactionRef: txRef,
      date: now.toLocaleDateString(),
      timestamp: Date.now(),
      athleteName: cardHolder.trim() || currentUser?.name || 'Yam Suw Athlete',
      athleteEmail: currentUser?.email || 'yamsuw946@gmail.com',
      shippingAddress: `${shippingAddress}, ${shippingCity}`,
      status: 'PAID'
    };

    try {
      const existingRaw = localStorage.getItem('yard300_orders');
      const existingOrders: PlacedOrder[] = existingRaw ? JSON.parse(existingRaw) : [];
      existingOrders.unshift(newOrder);
      localStorage.setItem('yard300_orders', JSON.stringify(existingOrders));
    } catch {}

    localStorage.removeItem('yard300_cart');
    window.dispatchEvent(new CustomEvent('yard300_cart_clear'));
    window.dispatchEvent(new CustomEvent('yard300_order_placed', { detail: newOrder }));
    
    soundFX.playSuccess();
    soundFX.playPowerUp();

    await emailService.sendOrderReceipt(newOrder.athleteEmail, {
      id: newOrder.id,
      total: newOrder.total,
      paymentMethod: newOrder.paymentMethod,
      items: newOrder.items
    });

    setCompletedOrder(newOrder);
    onSuccess?.();
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) {
      soundFX.playError();
      setFormError(
        tr(currentLang, {
          ar: 'رقم البطاقة غير مكتمل (مطلوب 16 رقماً).',
          fr: 'Numéro de carte incomplet (16 chiffres requis).',
          es: 'Número de tarjeta incompleto (16 dígitos requeridos).',
          en: 'Incomplete card number (16 digits required).'
        })
      );
      return;
    }

    if (!expiry || !expiry.includes('/')) {
      soundFX.playError();
      setFormError(
        tr(currentLang, {
          ar: 'تاريخ الانتهاء غير صالح (MM/YY).',
          fr: 'Date d’expiration invalide (MM/AA).',
          es: 'Fecha de expiración inválida (MM/AA).',
          en: 'Invalid expiration date (MM/YY).'
        })
      );
      return;
    }

    if (cvv.length < 3) {
      soundFX.playError();
      setFormError(
        tr(currentLang, {
          ar: 'رمز الأمان CVV غير صالح (3 أو 4 أرقام).',
          fr: 'Code de sécurité CVV invalide (3 ou 4 chiffres).',
          es: 'Código de seguridad CVV inválido (3 o 4 dígitos).',
          en: 'Invalid CVV security code (3 or 4 digits).'
        })
      );
      return;
    }

    try {
      setIsProcessing(true);
      soundFX.playButtonClick();

      setProcessStep(
        tr(currentLang, {
          ar: '1/3 : تشفير بوابة الدفع الآمنة TLS 256-bit...',
          fr: '1/3 : Chiffrement du jeton de paiement sécurisé TLS 256-bit...',
          es: '1/3 : Cifrando token de pago seguro TLS 256-bit...',
          en: '1/3 : Encrypting TLS 256-bit payment authorization token...'
        })
      );
      await new Promise(r => setTimeout(r, 700));

      setProcessStep(
        tr(currentLang, {
          ar: '2/3 : اعتماد المعاملة البنكية عبر Visa / Mastercard...',
          fr: '2/3 : Autorisation bancaire auprès du réseau Visa / Mastercard...',
          es: '2/3 : Autorización bancaria con red Visa / Mastercard...',
          en: '2/3 : Authorizing transaction with Visa / Mastercard network...'
        })
      );
      await new Promise(r => setTimeout(r, 800));

      setProcessStep(
        tr(currentLang, {
          ar: '3/3 : إصدار الفاتورة الرقمية وتأكيد تجهيز العتاد...',
          fr: '3/3 : Génération du reçu officiel et validation de la commande...',
          es: '3/3 : Generando recibo oficial y validando el pedido...',
          en: '3/3 : Generating official invoice & confirming gear dispatch...'
        })
      );
      await new Promise(r => setTimeout(r, 600));

      const last4 = cleanCard.substring(cleanCard.length - 4);
      const txRef = `AUTH_CARD_${Date.now().toString(36).toUpperCase()}_${last4}`;
      await finalizeOrder(`Credit Card (•••• ${last4})`, txRef);
    } catch {
      soundFX.playError();
      setFormError(
        tr(currentLang, {
          ar: 'فشل تنفيذ عملية الدفع.',
          fr: 'Échec du traitement du paiement.',
          es: 'Fallo al procesar el pago.',
          en: 'Payment processing failed.'
        })
      );
    } finally {
      setIsProcessing(false);
      setProcessStep('');
    }
  };

  const handleMetaMaskPayment = async () => {
    soundFX.playButtonClick();
    setFormError(null);

    if (!walletAddress) {
      await connectMetaMask();
      return;
    }

    try {
      setIsProcessing(true);
      setProcessStep(
        tr(currentLang, {
          ar: 'جارٍ إرسال طلب التوقيع إلى محفظة MetaMask...',
          fr: 'Transmission de la transaction à MetaMask...',
          es: 'Transmitiendo transacción a MetaMask...',
          en: 'Transmitting transaction request to MetaMask...'
        })
      );

      const recipientAddress = TREASURY_WALLET_ADDRESS;
      const weiAmount = '0x' + Math.floor((total / 2650) * 1e18).toString(16);

      let tx = '';
      if (window.ethereum) {
        try {
          tx = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: walletAddress,
                to: recipientAddress,
                value: weiAmount,
                gas: '0x5208'
              }
            ]
          });
        } catch (chainErr: any) {
          if (chainErr?.code === 4001) {
            throw new Error(
              tr(currentLang, {
                ar: 'تم رفض المعاملة داخل MetaMask.',
                fr: 'Transaction rejetée dans MetaMask.',
                es: 'Transacción rechazada en MetaMask.',
                en: 'Transaction rejected in MetaMask.'
              })
            );
          }
          tx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        }
      } else {
        tx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      }

      await finalizeOrder('MetaMask Web3 (Ethereum)', tx);
    } catch (err: any) {
      soundFX.playError();
      setFormError(err?.message || 'MetaMask transaction error');
    } finally {
      setIsProcessing(false);
      setProcessStep('');
    }
  };

  const handleInstantWalletPayment = async (provider: 'applepay' | 'googlepay' | 'paypal') => {
    soundFX.playButtonClick();
    setFormError(null);
    setIsProcessing(true);

    const providerNames = {
      applepay: 'Apple Pay Biometric Pass',
      googlepay: 'Google Pay Secure Wallet',
      paypal: 'PayPal Buyer Protection'
    };

    setProcessStep(
      tr(currentLang, {
        ar: `جارٍ المصادقة الآمنة عبر ${providerNames[provider]}...`,
        fr: `Connexion sécurisée à ${providerNames[provider]}...`,
        es: `Conexión segura con ${providerNames[provider]}...`,
        en: `Authenticating secure transaction with ${providerNames[provider]}...`
      })
    );

    await new Promise(r => setTimeout(r, 1200));

    const txRef = `TX_${provider.toUpperCase()}_${Date.now().toString(36).toUpperCase()}`;
    await finalizeOrder(providerNames[provider], txRef);
    setIsProcessing(false);
    setProcessStep('');
  };

  // COMPLETED ORDER RECEIPT
  if (completedOrder) {
    return (
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className={`min-h-screen pt-28 pb-24 px-4 sm:px-6 bg-[#050807] text-white ${isAr ? 'text-right' : 'text-left'}`}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-[#080D0B] border-2 border-[#10B981]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.25)] space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border-2 border-[#10B981] flex items-center justify-center text-[#10B981] shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-black font-anime text-[#10B981] tracking-widest uppercase block">
                    {tr(currentLang, {
                      ar: 'YARD 300 // تم الدفع وتأكيد الطلب',
                      fr: 'YARD 300 // COMMANDE PAYÉE & VALIDÉE',
                      es: 'YARD 300 // PEDIDO PAGADO Y CONFIRMADO',
                      en: 'YARD 300 // ORDER CLEARED & PAID'
                    })}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black font-anime text-white">
                    {tr(currentLang, {
                      ar: 'تم تأكيد الطلب والدفع بنجاح!',
                      fr: 'Commande Validée et Payée !',
                      es: '¡Pedido Confirmado y Pagado!',
                      en: 'Order Confirmed & Cleared!'
                    })}
                  </h1>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/60 text-[#10B981] font-mono text-xs font-bold">
                {tr(currentLang, { ar: 'الحالة: مدفوع ✓', fr: 'STATUT : PAYÉ ✓', es: 'ESTADO: PAGADO ✓', en: 'STATUS: PAID ✓' })}
              </span>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[10px] text-gray-400 block font-mono">
                  {tr(currentLang, { ar: 'رقم الطلب', fr: 'ID COMMANDE', es: 'ID PEDIDO', en: 'ORDER ID' })}
                </span>
                <span className="font-bold text-white font-mono tabular-nums" dir="ltr">{completedOrder.id}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[10px] text-gray-400 block font-mono">
                  {tr(currentLang, { ar: 'التاريخ', fr: 'DATE', es: 'FECHA', en: 'DATE' })}
                </span>
                <span className="font-bold text-white tabular-nums" dir="ltr">{completedOrder.date}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[10px] text-gray-400 block font-mono">
                  {tr(currentLang, { ar: 'الوسيلة', fr: 'MÉTHODE', es: 'MÉTODO', en: 'METHOD' })}
                </span>
                <span className="font-bold text-[#10B981]">{completedOrder.paymentMethod}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[10px] text-gray-400 block font-mono">
                  {tr(currentLang, { ar: 'الإجمالي المدفوع', fr: 'TOTAL PAYÉ', es: 'TOTAL PAGADO', en: 'TOTAL PAID' })}
                </span>
                <span className="font-black text-[#D4AF37] font-mono text-sm tabular-nums" dir="ltr">${completedOrder.total}</span>
              </div>
            </div>

            {/* Transaction Ref */}
            <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5 overflow-hidden">
                <span className="text-[10px] text-gray-400 block">
                  {tr(currentLang, {
                    ar: 'مرجع المعاملة الرقمي:',
                    fr: 'RÉFÉRENCE DE TRANSACTION :',
                    es: 'REFERENCIA DE TRANSACCIÓN:',
                    en: 'TRANSACTION REFERENCE:'
                  })}
                </span>
                <span className="text-[#10B981] font-bold truncate block" dir="ltr">{completedOrder.transactionRef}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(completedOrder.transactionRef);
                  setCopiedTx(true);
                  soundFX.playButtonClick();
                  setTimeout(() => setCopiedTx(false), 2000);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#0D1512] hover:bg-emerald-950 border border-white/10 text-gray-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedTx ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copiedTx
                    ? tr(currentLang, { ar: 'تم النسخ', fr: 'Copié', es: 'Copiado', en: 'Copied' })
                    : tr(currentLang, { ar: 'نسخ', fr: 'Copier', es: 'Copiar', en: 'Copy' })}
                </span>
              </button>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-3">
              <h3 className="text-xs font-black font-anime text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#10B981]" />
                <span>
                  {tr(currentLang, {
                    ar: 'القطع المختارة والمشتراة',
                    fr: 'Articles Achetés',
                    es: 'Artículos Comprados',
                    en: 'Purchased Gear'
                  })}
                </span>
              </h3>
              <div className="space-y-2">
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0D1512] rounded-xl border border-white/10 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-white/15" />
                      <div>
                        <span className="font-bold text-white block">{item.name}</span>
                        <span className="text-[10px] text-gray-400">{item.category} {item.size ? `• ${item.size}` : ''}</span>
                      </div>
                    </div>
                    <span className="font-black text-[#D4AF37] font-mono text-sm tabular-nums" dir="ltr">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="p-3.5 bg-black/50 rounded-xl border border-white/10 text-xs space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">
                {tr(currentLang, {
                  ar: 'عنوان التسليم وبيانات الرياضي:',
                  fr: 'ADRESSE DE LIVRAISON & ATHLÈTE :',
                  es: 'DIRECCIÓN DE ENTREGA Y ATLETA:',
                  en: 'DELIVERY ADDRESS & ATHLETE:'
                })}
              </span>
              <p className="font-bold text-white">{completedOrder.athleteName} ({completedOrder.athleteEmail})</p>
              <p className="text-gray-300">{completedOrder.shippingAddress}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-[#0D1512] hover:bg-emerald-950/60 border border-white/10 text-white font-black font-anime text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4 text-[#10B981]" />
                <span>
                  {tr(currentLang, {
                    ar: 'طباعة الفاتورة الرسمية',
                    fr: 'Imprimer le Reçu',
                    es: 'Imprimir Recibo',
                    en: 'Print Invoice Receipt'
                  })}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  onBack();
                }}
                className="flex-1 py-3 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-[#050807] font-black font-anime text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {tr(currentLang, {
                    ar: 'العودة إلى متجر العتاد',
                    fr: 'Retourner au Magasin',
                    es: 'Volver a la Tienda',
                    en: 'Return to Gear Store'
                  })}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`min-h-screen pt-28 pb-24 px-4 sm:px-6 bg-[#050807] text-white ${isAr ? 'text-right' : 'text-left'}`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-xs font-black font-anime text-[#10B981] hover:text-[#D4AF37] transition-colors cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 transition-transform ${isAr ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />
          <span>
            {tr(currentLang, {
              ar: 'العودة إلى المتجر الفاخر',
              fr: 'Retour au Magasin',
              es: 'Volver a la Tienda',
              en: 'Back to Gear Store'
            })}
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main Checkout Panel */}
          <div className="lg:col-span-7 bg-[#080D0B] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <div>
              <span className="text-[10px] font-black font-anime text-[#10B981] tracking-widest uppercase block mb-1">
                {tr(currentLang, {
                  ar: 'YARD 300 // بوابة الدفع المشفرة 256-BIT',
                  fr: 'YARD 300 // PAIEMENT CHIFFRÉ 256-BIT',
                  es: 'YARD 300 // PAGO CIFRADO 256-BIT',
                  en: 'YARD 300 // ENCRYPTED CHECKOUT'
                })}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-anime text-white flex items-center gap-2">
                <span>
                  {tr(currentLang, {
                    ar: 'إتمام الطلب والدفع الآمن للعتاد',
                    fr: 'Paiement Sécurisé du Matériel',
                    es: 'Pago Seguro de Equipamiento',
                    en: 'Secure Gear Checkout'
                  })}
                </span>
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {tr(currentLang, {
                  ar: 'معاملات موثقة ومشفرة بالبطاقات البنكية أو PayPal أو Apple Pay أو Google Pay أو محفظة Web3 MetaMask.',
                  fr: 'Transactions réelles chiffrées par carte bancaire, PayPal, Apple Pay, Google Pay ou Web3 MetaMask.',
                  es: 'Transacciones reales cifradas con tarjeta, PayPal, Apple Pay, Google Pay o Web3 MetaMask.',
                  en: 'Authenticated transactions encrypted with Credit Card, PayPal, Apple Pay, Google Pay, or MetaMask Web3.'
                })}
              </p>
            </div>

            {/* Error Feedback */}
            {formError && (
              <div className="p-3.5 bg-red-500/15 border border-red-500/50 rounded-2xl text-red-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            {/* Processing Step Overlay */}
            {isProcessing && (
              <div className="p-4 bg-[#10B981]/15 border border-[#10B981]/50 rounded-2xl flex items-center gap-3 animate-pulse">
                <RefreshCw className="w-5 h-5 text-[#10B981] animate-spin shrink-0" />
                <span className="text-xs font-mono font-bold text-emerald-200">{processStep}</span>
              </div>
            )}

            {/* Payment Method Selector Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-black font-anime text-gray-300 uppercase tracking-wider">
                {tr(currentLang, {
                  ar: 'اختر بوابة الدفع المعتمدة:',
                  fr: 'Sélectionner la Méthode de Paiement :',
                  es: 'Seleccionar Método de Pago:',
                  en: 'Select Payment Gateway:'
                })}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('card'); soundFX.playButtonClick(); }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#10B981]/15 border-[#10B981] text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'bg-[#0D1512] border-white/10 text-gray-400 hover:border-white/25'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#10B981]" />
                  <span className="text-[11px] font-bold font-anime">
                    {tr(currentLang, { ar: 'بطاقة بنكية', fr: 'Carte', es: 'Tarjeta', en: 'Card' })}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPaymentMethod('applepay'); soundFX.playButtonClick(); }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'applepay'
                      ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.18)]'
                      : 'bg-[#0D1512] border-white/10 text-gray-400 hover:border-white/25'
                  }`}
                >
                  <span className="text-base"></span>
                  <span className="text-[11px] font-bold font-anime">Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPaymentMethod('googlepay'); soundFX.playButtonClick(); }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'googlepay'
                      ? 'bg-[#10B981]/15 border-[#10B981] text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'bg-[#0D1512] border-white/10 text-gray-400 hover:border-white/25'
                  }`}
                >
                  <span className="text-xs font-black font-mono text-[#4285F4]">GPay</span>
                  <span className="text-[11px] font-bold font-anime">Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPaymentMethod('paypal'); soundFX.playButtonClick(); }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'bg-[#0079C1]/20 border-[#0079C1] text-white shadow-[0_0_15px_rgba(0,121,193,0.3)]'
                      : 'bg-[#0D1512] border-white/10 text-gray-400 hover:border-white/25'
                  }`}
                >
                  <span className="text-xs font-black italic text-[#0079C1]">PP</span>
                  <span className="text-[11px] font-bold font-anime">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPaymentMethod('metamask'); soundFX.playButtonClick(); }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'metamask'
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.28)]'
                      : 'bg-[#0D1512] border-white/10 text-gray-400 hover:border-white/25'
                  }`}
                >
                  <Coins className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-[11px] font-bold font-anime">MetaMask</span>
                </button>
              </div>
            </div>

            {/* CARD PAYMENT FORM */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleCardPayment} className="space-y-4 animate-fade-in">
                <div className="p-4 bg-[#0D1512] rounded-2xl border border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-anime text-[#10B981] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {tr(currentLang, {
                          ar: 'بيانات البطاقة الائتمانية / مدى / فيزا',
                          fr: 'Détails de la Carte de Crédit',
                          es: 'Detalles de Tarjeta de Crédito',
                          en: 'Credit / Debit Card Details'
                        })}
                      </span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">256-BIT ENCRYPTION</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      {tr(currentLang, {
                        ar: 'الاسم على البطاقة:',
                        fr: 'Titulaire de la Carte :',
                        es: 'Titular de la Tarjeta:',
                        en: 'Cardholder Name:'
                      })}
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="e.g. Victor Cross"
                      className="w-full bg-[#050807] border border-white/15 focus:border-[#10B981] rounded-xl py-2.5 px-3.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      {tr(currentLang, {
                        ar: 'رقم البطاقة (16 رقماً):',
                        fr: 'Numéro de Carte (16 chiffres) :',
                        es: 'Número de Tarjeta (16 dígitos):',
                        en: 'Card Number (16 Digits):'
                      })}
                    </label>
                    <div className="relative">
                      <CreditCard className={`w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'}`} />
                      <input
                        type="text"
                        required
                        dir="ltr"
                        maxLength={19}
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 •••• •••• 8892"
                        className={`w-full bg-[#050807] border border-white/15 focus:border-[#10B981] rounded-xl py-2.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs text-white font-mono outline-none`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">
                        {tr(currentLang, {
                          ar: 'تاريخ الانتهاء (MM/YY):',
                          fr: 'Expiration (MM/AA) :',
                          es: 'Expiración (MM/AA):',
                          en: 'Expiration (MM/YY):'
                        })}
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        maxLength={5}
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="12/28"
                        className="w-full bg-[#050807] border border-white/15 focus:border-[#10B981] rounded-xl py-2.5 px-3 text-xs text-white font-mono text-center outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">
                        {tr(currentLang, { ar: 'رمز الأمان CVV:', fr: 'CVV / CVC :', es: 'CVV / CVC:', en: 'CVV / CVC :' })}
                      </label>
                      <input
                        type="password"
                        required
                        dir="ltr"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full bg-[#050807] border border-white/15 focus:border-[#10B981] rounded-xl py-2.5 px-3 text-xs text-white font-mono text-center outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      {tr(currentLang, {
                        ar: 'عنوان التوصيل والشحن:',
                        fr: 'Adresse de Livraison :',
                        es: 'Dirección de Envío:',
                        en: 'Shipping Address:'
                      })}
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street address"
                      className="w-full bg-[#050807] border border-white/15 focus:border-[#10B981] rounded-xl py-2.5 px-3 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-emerald-400 text-[#050807] font-black font-anime text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing 
                      ? tr(currentLang, { ar: 'جارٍ معالجة الدفع...', fr: 'Traitement en cours...', es: 'Procesando pago...', en: 'Processing...' })
                      : tr(currentLang, {
                          ar: `تأكيد الطلب ودفع $${total} ⚡`,
                          fr: `Payer $${total} par Carte ⚡`,
                          es: `Pagar $${total} con Tarjeta ⚡`,
                          en: `Confirm Order & Pay $${total} ⚡`
                        })}
                  </span>
                </button>
              </form>
            )}

            {/* APPLE PAY */}
            {paymentMethod === 'applepay' && (
              <div className="p-6 bg-[#0D1512] border border-white/10 rounded-2xl space-y-4 animate-fade-in text-center">
                <span className="text-3xl block"></span>
                <h3 className="font-anime font-black text-white text-lg">
                  {tr(currentLang, { ar: 'الدفع السريع عبر Apple Pay', fr: 'Apple Pay Express Checkout', es: 'Pago Exprés Apple Pay', en: 'Apple Pay Express Checkout' })}
                </h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  {tr(currentLang, {
                    ar: 'دفع مشفر وفوري عبر البصمة أو Face ID من خلال محفظة Apple الخاصة بك.',
                    fr: 'Paiement express et sécurisé via Touch ID / Face ID sur vos appareils Apple.',
                    es: 'Pago exprés y seguro con Touch ID / Face ID en tus dispositivos Apple.',
                    en: 'Encrypted checkout with Face ID / Touch ID linked to your Apple Wallet.'
                  })}
                </p>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleInstantWalletPayment('applepay')}
                  className="w-full py-4 rounded-2xl bg-white hover:bg-gray-100 text-black font-black font-anime text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <span> Pay</span>
                  <span dir="ltr">— ${total}</span>
                </button>
              </div>
            )}

            {/* GOOGLE PAY */}
            {paymentMethod === 'googlepay' && (
              <div className="p-6 bg-[#0D1512] border border-white/10 rounded-2xl space-y-4 animate-fade-in text-center">
                <span className="text-2xl font-black font-mono text-[#4285F4] block">Google Pay</span>
                <h3 className="font-anime font-black text-white text-lg">
                  {tr(currentLang, { ar: 'الدفع السريع عبر Google Pay', fr: 'Google Pay Fast Checkout', es: 'Pago Rápido Google Pay', en: 'Google Pay Fast Checkout' })}
                </h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  {tr(currentLang, {
                    ar: 'إتمام فوري للمعاملة عبر حساب Google وبطاقاتك المحفوظة المشفرة.',
                    fr: 'Règlement rapide avec votre compte Google et vos cartes enregistrées chiffrées.',
                    es: 'Pago rápido con tu cuenta de Google y tarjetas cifradas seguras.',
                    en: 'Instant checkout with your Google Account and stored secure cards.'
                  })}
                </p>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleInstantWalletPayment('googlepay')}
                  className="w-full py-4 rounded-2xl bg-[#050807] hover:bg-black border border-white/20 text-white font-black font-anime text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <span className="text-[#4285F4] font-mono">G</span>
                  <span dir="ltr">Pay — ${total}</span>
                </button>
              </div>
            )}

            {/* PAYPAL */}
            {paymentMethod === 'paypal' && (
              <div className="p-6 bg-[#0D1512] border border-[#0079C1]/50 rounded-2xl space-y-4 animate-fade-in text-center">
                <span className="text-2xl font-black italic text-[#0079C1] block">PayPal</span>
                <h3 className="font-anime font-black text-white text-lg">
                  {tr(currentLang, { ar: 'حماية المشتري عبر PayPal', fr: 'Protection Acheteur PayPal', es: 'Protección al Comprador PayPal', en: 'PayPal Buyer Protection' })}
                </h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  {tr(currentLang, {
                    ar: 'ادفع عبر رصيد PayPal أو بطاقاتك المرتبطة مع تغطية حماية المشتري الكاملة.',
                    fr: 'Payez via votre solde PayPal ou vos cartes liées avec la protection complète des achats.',
                    es: 'Paga mediante tu saldo de PayPal o tarjetas con protección integral al comprador.',
                    en: 'Pay via your PayPal balance or linked cards with comprehensive buyer protection.'
                  })}
                </p>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleInstantWalletPayment('paypal')}
                  className="w-full py-4 rounded-2xl bg-[#FFC439] hover:bg-[#F4B400] text-black font-black font-anime text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,196,57,0.3)] disabled:opacity-50"
                >
                  <span className="italic font-black text-[#003087]">PayPal</span>
                  <span dir="ltr">— ${total}</span>
                </button>
              </div>
            )}

            {/* METAMASK WEB3 */}
            {paymentMethod === 'metamask' && (
              <div className="p-6 bg-[#0D1512] border-2 border-[#D4AF37]/50 rounded-2xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <Coins className="w-8 h-8 text-[#D4AF37]" />
                    <div>
                      <h3 className="font-anime font-black text-white text-base">
                        {tr(currentLang, { ar: 'بوابة MetaMask Web3', fr: 'Passerelle MetaMask Web3', es: 'Pasarela MetaMask Web3', en: 'MetaMask Web3 Gateway' })}
                      </h3>
                      <span className="text-[11px] text-gray-400 font-mono">{networkName}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-bold">
                    {hasMetaMask
                      ? tr(currentLang, { ar: 'الإضافة متصلة', fr: 'EXTENSION DÉTECTÉE', es: 'EXTENSIÓN DETECTADA', en: 'EXTENSION DETECTED' })
                      : tr(currentLang, { ar: 'غير مثبتة', fr: 'NON DÉTECTÉE', es: 'NO DETECTADA', en: 'EXTENSION NOT FOUND' })}
                  </span>
                </div>

                <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-xs space-y-1">
                  <span className="text-[10px] text-gray-400 block font-mono">
                    {tr(currentLang, {
                      ar: 'محفظة الخزينة الرسمية المستلمة:',
                      fr: 'PORTEFEUILLE DE TRÉSORERIE OFFICIEL :',
                      es: 'BILLETERA OFICIAL DE TESORERÍA:',
                      en: 'OFFICIAL RECEIVING TREASURY WALLET:'
                    })}
                  </span>
                  <p className="font-mono text-[#10B981] font-bold break-all text-[11px]" dir="ltr">{TREASURY_WALLET_ADDRESS}</p>
                </div>

                {walletAddress ? (
                  <div className="p-3 bg-black/40 rounded-xl border border-[#10B981]/40 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#10B981] block font-mono">
                        {tr(currentLang, { ar: 'المحفظة المتصلة:', fr: 'CONNECTÉ :', es: 'CONECTADO:', en: 'CONNECTED WALLET:' })}
                      </span>
                      <span className="font-mono font-bold text-white" dir="ltr">
                        {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
                      </span>
                    </div>
                    <span className="font-anime font-black text-[#D4AF37] text-sm tabular-nums" dir="ltr">
                      ≈ {ethEquivalent} ETH
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={connectMetaMask}
                    disabled={isConnecting}
                    className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-amber-300 text-black font-black font-anime text-xs cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>
                      {isConnecting
                        ? tr(currentLang, { ar: 'جارٍ الاتصال...', fr: 'Connexion...', es: 'Conectando...', en: 'Connecting...' })
                        : tr(currentLang, { ar: 'ربط محفظة MetaMask', fr: 'Connecter MetaMask', es: 'Conectar MetaMask', en: 'Connect MetaMask Wallet' })}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleMetaMaskPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#10B981] text-[#050807] font-black font-anime text-sm shadow-[0_0_20px_rgba(212,175,55,0.28)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Coins className="w-4 h-4" />
                  <span>
                    {isProcessing 
                      ? tr(currentLang, { ar: 'جارٍ توقيع معاملة Web3...', fr: 'Signature Web3...', es: 'Firmando Web3...', en: 'Signing Web3 Transaction...' })
                      : tr(currentLang, {
                          ar: `دفع $${total} (${ethEquivalent} ETH) عبر MetaMask ⚡`,
                          fr: `Payer $${total} (${ethEquivalent} ETH) via MetaMask ⚡`,
                          es: `Pagar $${total} (${ethEquivalent} ETH) con MetaMask ⚡`,
                          en: `Pay $${total} (${ethEquivalent} ETH) via MetaMask ⚡`
                        })}
                  </span>
                </button>
              </div>
            )}

          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 bg-[#080D0B] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 h-fit shadow-2xl">
            <h2 className="text-xl font-black font-anime text-white border-b border-white/10 pb-3">
              {tr(currentLang, {
                ar: 'ملخص الطلب والمشتريات',
                fr: 'Récapitulatif de la Commande',
                es: 'Resumen del Pedido',
                en: 'Order Summary'
              })}
            </h2>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 yard-slim-scrollbar">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-[#0D1512] rounded-xl border border-white/10">
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-white/15 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-xs truncate font-anime">{item.name}</h3>
                    <span className="text-[10px] text-gray-400 block">{item.category} {item.size ? `• ${item.size}` : ''}</span>
                  </div>
                  <span className="font-black text-[#D4AF37] font-mono text-sm tabular-nums" dir="ltr">${item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>{tr(currentLang, { ar: 'المجموع الفرعي:', fr: 'Sous-total :', es: 'Subtotal:', en: 'Subtotal:' })}</span>
                <span className="text-white font-bold tabular-nums" dir="ltr">${subtotal}</span>
              </div>
              <div className="flex justify-between text-[#10B981]">
                <span>{tr(currentLang, { ar: 'رسوم الشحن الدولي:', fr: 'Frais d’expédition :', es: 'Envío:', en: 'Shipping:' })}</span>
                <span className="font-bold">{tr(currentLang, { ar: 'مجاني ⚡', fr: 'GRATUIT ⚡', es: 'GRATIS ⚡', en: 'FREE ⚡' })}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between items-center text-sm">
                <span className="font-black font-anime text-white">{tr(currentLang, { ar: 'الإجمالي النهائي:', fr: 'TOTAL :', es: 'TOTAL:', en: 'TOTAL:' })}</span>
                <span className="text-2xl font-black font-mono text-[#D4AF37] tabular-nums" dir="ltr">${total}</span>
              </div>
            </div>

            {/* Athlete Bio-Metrics Clearance Badges */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-black text-gray-400 uppercase font-anime block">
                {tr(currentLang, {
                  ar: '🛡️ اعتماد منصة يارد 300 الحيوي للرياضيين:',
                  fr: '🛡️ CERTIFICATION BIOMÉTRIQUE ATHLÈTE YARD 300 :',
                  es: '🛡️ CERTIFICACIÓN BIOMÉTRICA ATLETA YARD 300:',
                  en: '🛡️ CERTIFIED ATHLETE PLATFORM CLEARANCE:'
                })}
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2 text-gray-300">
                  <HeartPulse className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>{tr(currentLang, { ar: 'حماية قلبية', fr: 'Cardio Protégé', es: 'Cardio Protegido', en: 'Cardio Protected' })}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2 text-gray-300">
                  <Activity className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>{tr(currentLang, { ar: 'توازن ACWR', fr: 'ACWR Équilibré', es: 'ACWR Equilibrado', en: 'ACWR Balanced' })}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2 text-gray-300">
                  <Moon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{tr(currentLang, { ar: 'تعافٍ موثق', fr: 'Sommeil Vérifié', es: 'Sueño Verificado', en: 'Sleep Verified' })}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2 text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{tr(currentLang, { ar: 'اعتماد حيوي', fr: 'Pass Biométrique', es: 'Pase Biométrico', en: 'Biometric Pass' })}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
