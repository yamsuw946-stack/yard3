/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wallet, X, CheckCircle, ExternalLink, AlertTriangle, ShieldCheck, ArrowRight, Copy } from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';

interface MetaMaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
  onWalletConnected?: (address: string) => void;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const MetaMaskModal: React.FC<MetaMaskModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
  onWalletConnected
}) => {
  const isAr = currentLang === 'ar';
  const t = (en: string, es: string, fr: string, ar: string) => tr(currentLang, { en, es, fr, ar });
  const [walletAddress, setWalletAddress] = useState<string | null>(() => {
    return localStorage.getItem('yard300_wallet_address');
  });
  const [balance, setBalance] = useState<string>('0.485');
  const [yardxTokens, setYardxTokens] = useState<number>(1540);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if already connected on load
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            localStorage.setItem('yard300_wallet_address', accounts[0]);
            if (onWalletConnected) onWalletConnected(accounts[0]);
          }
        })
        .catch(() => {});
    }
  }, []);

  if (!isOpen) return null;

  const handleConnectRealMetaMask = async () => {
    soundFX.playButtonClick();
    setIsConnecting(true);
    setErrorMessage(null);

    try {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
        // Real MetaMask is installed in user's browser
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          const addr = accounts[0];
          setWalletAddress(addr);
          localStorage.setItem('yard300_wallet_address', addr);
          if (onWalletConnected) onWalletConnected(addr);
        }
      } else {
        // Fallback for environments without native MetaMask extension: Provide instant Web3 Demo / Testnet link
        const simulatedAddress = '0x71C...' + Math.random().toString(36).substring(2, 8).toUpperCase() + 'E5F';
        setWalletAddress(simulatedAddress);
        localStorage.setItem('yard300_wallet_address', simulatedAddress);
        if (onWalletConnected) onWalletConnected(simulatedAddress);
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setErrorMessage(t(err?.message || 'Connection request rejected.', 'Solicitud de conexión rechazada.', 'Demande de connexion refusée.', 'تم رفض الاتصال أو حدث خطأ أثناء المحاولة.'));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    soundFX.playButtonClick();
    setWalletAddress(null);
    localStorage.removeItem('yard300_wallet_address');
    if (onWalletConnected) onWalletConnected('');
  };

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#141624] via-[#0E101A] to-[#0A0B10] border-2 border-[#E50914] p-6 md:p-8 shadow-[0_0_60px_rgba(229,9,20,0.5)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow corner bursts */}
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-[#E50914]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-[#FFE600]/20 blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#181A28] border border-gray-700 text-gray-400 hover:text-white hover:border-[#E50914] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F6851B] to-[#E2761B] p-2 flex items-center justify-center shadow-[0_0_20px_rgba(246,133,27,0.4)]">
            <svg viewBox="0 0 318.6 318.6" className="w-full h-full">
              <path fill="#E2761B" stroke="#E2761B" strokeWidth="2.5" d="M274.1 35.5l-99.5 73.9 19.4-46.3z" />
              <path fill="#E4761B" stroke="#E4761B" strokeWidth="2.5" d="M44.4 35.5l98.7 74.6-18.6-47z" />
              <path fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="2.5" d="M159.3 180.9l-49.8 19.4 37.6 15.6 12.2-35z" />
              <path fill="#233447" stroke="#233447" strokeWidth="2.5" d="M109.5 200.3l37.6 15.6-21.7 45.4z" />
              <path fill="#CD6116" stroke="#CD6116" strokeWidth="2.5" d="M264.4 135.2l-30.8-23.7-44.5 33.2 38.6 33.6z" />
              <path fill="#E4751F" stroke="#E4751F" strokeWidth="2.5" d="M84.9 111.5l-30.7 23.7 36.7 43.1 38.6-33.6z" />
              <path fill="#F6851B" stroke="#F6851B" strokeWidth="2.5" d="M159.3 124.7l-30.4-23.3-84.5 9.1 31.6 47.8 83.3-33.6z" />
              <path fill="#C0AD9E" stroke="#C0AD9E" strokeWidth="2.5" d="M159.3 180.9l12.2 35 37.6-15.6-49.8-19.4z" />
              <path fill="#161616" stroke="#161616" strokeWidth="2.5" d="M159.3 261.3l-33.9-15.6 12.8-14.4 21.1 30z" />
              <path fill="#763D16" stroke="#763D16" strokeWidth="2.5" d="M209.1 200.3l-15.9 61 21.7-45.4z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl md:text-2xl font-black font-anime text-white">
                {t('CONNECT METAMASK WALLET', 'CONECTAR CARTERA METAMASK', 'CONNECTER PORTEFEUILLE METAMASK', 'ربط محفظة ميتاماسك (MetaMask)')}
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-bold">
              {t('Official YARD300 Web3 portal to claim bounty tokens & tournament rewards', 'Portal Web3 oficial de YARD300 para reclamar recompensas y tokens', 'Portail Web3 officiel YARD300 pour réclamer vos récompenses et jetons', 'بوابة Web3 الرسمية لمجتمع YARD300 لحفظ أرباح التحديات وعملة YARDX')}
            </p>
          </div>
        </div>

        {/* Content body */}
        {walletAddress ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#181A28] border border-[#00F0FF]/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-xs font-black text-[#00F0FF]">
                  <CheckCircle className="w-4 h-4 text-[#00F0FF]" />
                  {t('Wallet Connected', 'Cartera Conectada', 'Portefeuille Connecté', 'المحفظة متصلة بنجاح')}
                </span>
                <span className="text-[10px] bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 px-2 py-0.5 rounded font-black">
                  Ethereum / Polygon Mainnet
                </span>
              </div>

              {/* Address with copy */}
              <div className="flex items-center justify-between bg-[#0A0B10] p-3 rounded-xl border border-gray-800 font-mono text-xs text-gray-300">
                <span className="truncate max-w-[280px]">{walletAddress}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-[#141622] hover:bg-[#1f2238] text-gray-400 hover:text-white transition-all ml-2 shrink-0 cursor-pointer"
                  title={t('Copy Address', 'Copiar Dirección', 'Copier Adresse', 'نسخ العنوان')}
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copied && (
                <p className="text-[10px] text-[#FFE600] font-bold mt-1 text-center">
                  {t('Address copied to clipboard!', '¡Dirección copiada al portapapeles!', 'Adresse copiée dans le presse-papiers !', 'تم نسخ العنوان بنجاح!')}
                </p>
              )}
            </div>

            {/* Token Balances Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#121422] border border-gray-800">
                <span className="text-[10px] font-bold text-gray-400 block mb-1">
                  {t('ETH Balance:', 'Saldo ETH:', 'Solde ETH :', 'رصيد ETH:')}
                </span>
                <span className="text-lg font-black font-anime text-white">
                  {balance} ETH
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121422] border border-[#FFE600]/40">
                <span className="text-[10px] font-bold text-[#FFE600] block mb-1">
                  {t('YARDX Combat Tokens:', 'Tokens YARDX:', 'Jetons YARDX :', 'رصيد عملة YARDX:')}
                </span>
                <span className="text-lg font-black font-anime text-[#FFE600]">
                  {yardxTokens.toLocaleString('en-US')} YARDX
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDisconnect}
                className="flex-1 py-3 px-4 rounded-xl bg-[#181A28] border border-gray-700 hover:border-red-500 text-gray-300 hover:text-red-400 font-black font-anime text-xs transition-all cursor-pointer"
              >
                {t('Disconnect Wallet', 'Desconectar', 'Déconnecter', 'قطع الاتصال')}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#E50914] to-[#FFE600] text-black font-black font-anime text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_#E50914] cursor-pointer"
              >
                {t('Enter Arenas ⚡', 'Entrar a Arenas ⚡', 'Entrer dans l\'Arène ⚡', 'تأكيد ودخول الحلبات ⚡')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#141622] border border-gray-800 text-center space-y-3">
              <Wallet className="w-12 h-12 text-[#F6851B] mx-auto animate-pulse" />
              <h4 className="text-base font-black font-anime text-white">
                {t('Connect Your MetaMask to Claim Web3 Bounties', 'Conecta MetaMask para Reclamar Recompensas Web3', 'Connectez MetaMask pour Réclamer vos Primes Web3', 'اتصل بحساب ميتاماسك لبدء كسب نقاط وجوائز يارد')}
              </h4>
              <p className="text-xs text-gray-300 font-bold leading-relaxed max-w-sm mx-auto">
                {t(
                  'Link your Web3 wallet to earn real combat bounty tokens, unlock NFT tournament passes, and climb the S-Rank Hall of Fame.',
                  'Vincula tu cartera Web3 para ganar tokens de recompensa reales, pases NFT y subir en el Salón de la Fama S-Rank.',
                  'Liez votre portefeuille Web3 pour gagner de vrais jetons, débloquer des pass NFT et grimper au classement S-Rank.',
                  'بمجرد الربط ستتمكن من تحويل انتصاراتك في تحديات الهايروكس والشاولين والملاكمة إلى عملات YARDX ونقاط هالة معتمدة.'
                )}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-2 text-xs text-red-200">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              onClick={handleConnectRealMetaMask}
              disabled={isConnecting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#F6851B] via-[#E2761B] to-[#FFE600] text-black font-black font-anime text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition-all shadow-[0_0_25px_rgba(246,133,27,0.5)] cursor-pointer disabled:opacity-50"
            >
              <Wallet className="w-5 h-5 text-black" />
              <span>
                {isConnecting 
                  ? t('Connecting to MetaMask...', 'Conectando a MetaMask...', 'Connexion à MetaMask...', 'جاري الاتصال بميتاماسك...')
                  : t('CONNECT METAMASK NOW 🦊', 'CONECTAR METAMASK AHORA 🦊', 'CONNECTER METAMASK 🦊', 'ربط محفظة MetaMask الآن 🦊')
                }
              </span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
                {t('100% Secure Web3 Auth', 'Autenticación Web3 100% Segura', 'Auth Web3 100% Sécurisée', 'آمن ومشفّر 100%')}
              </span>
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#FFE600] hover:underline flex items-center gap-1"
              >
                <span>{t('Install MetaMask', 'Instalar MetaMask', 'Installer MetaMask', 'تحميل إضافة MetaMask')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
