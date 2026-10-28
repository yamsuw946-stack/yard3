/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, Download, X, QrCode, Check, ShieldCheck, Apple, Play, Sparkles } from 'lucide-react';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en'
}) => {
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';
  const isAr = currentLang === 'ar';

  const [downloadedPlatform, setDownloadedPlatform] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (platform: string) => {
    soundFX.playPowerUp();
    setDownloadedPlatform(platform);
    setTimeout(() => setDownloadedPlatform(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D0F1B] border-2 border-[#00F0FF] rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-[0_0_60px_rgba(0,240,255,0.4)] text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-black font-anime">
            <Smartphone className="w-4 h-4" />
            <span>YARD 300 MOBILE APP (IOS & ANDROID)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-anime text-white">
            {isEs 
              ? 'DESCARGAR APLICACIÓN OFICIAL' 
              : isFr 
              ? 'TÉLÉCHARGER L\'APPLICATION OFFICIELLE' 
              : isAr 
              ? 'تحميل تطبيق YARD 300 الرسمي' 
              : 'DOWNLOAD THE OFFICIAL MOBILE APP'}
          </h2>
          <p className="text-xs text-gray-300 max-w-sm mx-auto">
            {isEs
              ? 'Sincronización biométrica en tiempo real, historias de club 24h y HUD de combate en tu smartphone.'
              : isFr
              ? 'Synchronisation biométrique en direct, stories 24h et HUD de combat sur smartphone.'
              : isAr
              ? 'مزامنة حيوية فورية مع الساعات الذكية، تتبع مخاطر الإصابات، ونشر الستوريات 24 ساعة.'
              : 'Real-time biometric wearable sync, 24h club stories, and combat HUD right on your smartphone.'}
          </p>
        </div>

        {/* QR Code Card */}
        <div className="p-4 rounded-2xl bg-black/60 border border-gray-800 flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://yard300.app&color=000000" 
              alt="YARD 300 QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-black font-anime text-[#FFE600] block">
              {isEs ? 'ESCANEAR CON LA CÁMARA' : isFr ? 'SCANNER AVEC L\'APPAREIL' : isAr ? 'امسح بكاميرا الهاتف' : 'SCAN WITH SMARTPHONE CAMERA'}
            </span>
            <p className="text-[11px] text-gray-400 leading-tight">
              {isEs 
                ? 'Apunta tu cámara para instalar instantáneamente la PWA o versión nativa.' 
                : isFr 
                ? 'Pointez votre caméra pour installer instantanément l\'application.' 
                : isAr 
                ? 'وجّه كاميرا هاتفك لتثبيت التطبيق مباشرة على جهازك دون متجر.' 
                : 'Point your camera to instantly install the PWA or native test package.'}
            </p>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleDownload('ios')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#141624] hover:bg-[#1E2138] border border-gray-700 hover:border-[#00F0FF] transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍏</span>
              <div className="text-left">
                <span className="block text-[10px] text-gray-400 font-mono">APPLE TESTFLIGHT / APP STORE</span>
                <span className="block text-xs font-black font-anime text-white">YARD300 for iOS (iPhone & Apple Watch)</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#00F0FF] group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => handleDownload('android')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#141624] hover:bg-[#1E2138] border border-gray-700 hover:border-[#00F0FF] transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div className="text-left">
                <span className="block text-[10px] text-gray-400 font-mono">GOOGLE PLAY STORE & APK</span>
                <span className="block text-xs font-black font-anime text-white">YARD300 for Android (Wear OS Ready)</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#00F0FF] group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Success confirmation notification */}
        {downloadedPlatform && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/60 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-pulse">
            <Check className="w-4 h-4" />
            <span>
              {isEs 
                ? '¡Instalador iniciado! Revisa las descargas de tu dispositivo.' 
                : isFr 
                ? 'Téléchargement lancé avec succès !' 
                : isAr 
                ? 'تم بدء التثبيت بنجاح على جهازك!' 
                : 'Installer package initiated! Check your device notifications.'}
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default AppDownloadModal;
