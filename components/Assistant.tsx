/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Language } from '../i18n';
import { soundFX } from '../services/soundFX';
import { Bot, Sparkles, Send, X, Shield, Zap } from 'lucide-react';

interface AssistantProps {
  currentLang?: Language;
}

const Assistant: React.FC<AssistantProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    let initialGreeting = 'Welcome Champion! I am Captain Aura S-Rank ⚡ Ready to assist you in gearing up, structuring workouts, and surpassing your limits today. What are you training today?';
    if (isAr) {
      initialGreeting = 'أهلاً بك يا بطل! أنا كابتن أورا (Captain Aura S-Rank) ⚡ مستعد لمساعدتك في تكتيكات التدريب، اختيار العتاد القتالي، وتحطيم أرقامك القياسية اليوم. ما هو تدريبك اليوم؟';
    } else if (isEs) {
      initialGreeting = '¡Bienvenido Campeón! Soy Captain Aura S-Rank ⚡ Listo para guiarte en tu equipamiento y superar tus límites. ¿Qué entrenas hoy?';
    } else if (isFr) {
      initialGreeting = 'Bienvenue Champion ! Je suis Captain Aura S-Rank ⚡ Prêt à t\'équiper et repousser tes limites. Quel est ton entraînement du jour ?';
    }

    setMessages([
      { 
        role: 'model', 
        text: initialGreeting,
        timestamp: Date.now() 
      }
    ]);
  }, [currentLang]);

  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    soundFX.playButtonClick();
    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendMessageToGemini(history, userMsg.text, currentLang);
      
      const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
      soundFX.playPowerUp();
    } catch (error) {
      console.warn("Assistant response error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const titleText = isAr ? 'كابتن أورا // AI Coach' : 'Captain Aura // AI Coach';
  const subtitleText = isAr ? 'مدعوم بنموذج Google Gemini الذكي' : 'Powered by Google Gemini AI';
  const thinkingText = isAr ? 'كابتن أورا يحلل بـ Gemini AI...' : isEs ? 'Captain Aura analizando...' : isFr ? 'Captain Aura analyse...' : 'Captain Aura analyzing with Gemini AI...';
  const placeholderText = isAr 
    ? 'اسأل كابتن أورا عن التمرين، التغذية، العتاد...' 
    : isEs 
      ? 'Pregunta a Captain Aura sobre entrenamiento, nutrición o equipo...' 
      : isFr 
        ? 'Pose une question sur l\'entraînement, la nutrition ou l\'équipement...' 
        : 'Ask Captain Aura about workouts, recovery, nutrition, gear...';

  return (
    <div className={`fixed bottom-6 ${isAr ? 'left-6' : 'right-6'} z-50 flex flex-col items-start font-sans ${isAr ? 'text-right' : 'text-left'}`}>
      {isOpen && (
        <div className="bg-[#0A0C16] rounded-3xl shadow-[0_15px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.25)] w-[92vw] sm:w-[410px] h-[560px] mb-4 flex flex-col overflow-hidden border border-emerald-500/30 animate-fade-in-up backdrop-blur-2xl">
          
          {/* Header */}
          <div className="bg-[#101322] p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-[#10B981] to-[#A855F7] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-black font-anime text-white text-sm sm:text-base">{titleText}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
                    ONLINE
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {subtitleText}
                </span>
              </div>
            </div>
            <button 
              onClick={() => {
                soundFX.playButtonClick();
                setIsOpen(false);
              }} 
              className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-[#07080E]" ref={scrollRef}>
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={idx} 
                  className={`flex ${
                    isUser 
                      ? (isAr ? 'justify-start' : 'justify-end') 
                      : (isAr ? 'justify-end' : 'justify-start')
                  }`}
                >
                  <div 
                    className={`max-w-[88%] p-3.5 md:p-4 rounded-2xl text-xs md:text-sm font-semibold leading-relaxed shadow-lg whitespace-pre-line ${
                      isUser 
                        ? 'bg-[#1C1736] text-white border border-[#A855F7]/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                        : 'bg-[#121524] text-gray-100 border border-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            
            {isThinking && (
               <div className={`flex ${isAr ? 'justify-end' : 'justify-start'}`}>
                 <div className="bg-[#121524] border border-emerald-500/30 p-3.5 rounded-2xl flex gap-2 items-center">
                   <span className="text-xs font-bold text-[#FFE600] font-anime">{thinkingText}</span>
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                 </div>
               </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 pt-2 pb-1 bg-[#0A0C16] border-t border-gray-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setInputValue(isAr ? 'ما هي أفضل خطة تغذية قتالية لبناء العضلات؟' : 'What is the best combat nutrition for muscle?');
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-300 hover:text-emerald-300 transition-colors shrink-0"
            >
              🥗 {isAr ? 'تغذية قتالية' : 'Nutrition'}
            </button>
            <button
              type="button"
              onClick={() => {
                setInputValue(isAr ? 'كيف أزيد قوة لكمتي وسرعة رد الفعل؟' : 'How do I increase punch speed and reflexes?');
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-300 hover:text-yellow-300 transition-colors shrink-0"
            >
              🥊 {isAr ? 'قوة اللكمات' : 'Punch Speed'}
            </button>
            <button
              type="button"
              onClick={() => {
                setInputValue(isAr ? 'ما هي مزايا خاتم وسوار YARD 300 البيومتري؟' : 'What are YARD 300 biometric tracker perks?');
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-300 hover:text-purple-300 transition-colors shrink-0"
            >
              💍 {isAr ? 'عتاد YARD' : 'Gear Specs'}
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 md:p-4 bg-[#0D0F1C]">
            <div className="flex gap-2 relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholderText} 
                className="flex-1 bg-[#141728] border border-gray-700 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs md:text-sm outline-none transition-colors placeholder-gray-500 text-white font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isThinking}
                className="bg-gradient-to-r from-emerald-400 to-[#FFE600] hover:brightness-110 text-black px-4 md:px-5 rounded-xl font-black font-anime text-xs transition-all disabled:opacity-40 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer flex items-center justify-center gap-1"
                title={isAr ? 'إرسال' : 'Send'}
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Modern High-End Floating Coach Icon & Trigger */}
      <button 
        onClick={() => {
          soundFX.playButtonClick();
          setIsOpen(!isOpen);
        }}
        className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#090B13]/95 hover:bg-[#101322] border-2 border-emerald-500/70 hover:border-emerald-400 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-xl"
        aria-label="Toggle AI Coach Assistant"
      >
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black">
              <X className="w-5 h-5" />
            </div>
            <span className="text-xs font-black font-anime text-white">
              {isAr ? 'إغلاق' : 'CLOSE'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            {/* Coach Cyber Avatar */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-[#10B981] to-[#A855F7] flex items-center justify-center text-black font-black shadow-[0_0_12px_rgba(16,185,129,0.6)]">
              <Bot className="w-5 h-5 text-black" />
              {/* Active Green Beacon Pulse */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>

            {/* Coach Label & Status */}
            <div className="flex flex-col text-left items-start">
              <span className="text-[11px] font-black font-anime text-white tracking-wider flex items-center gap-1 group-hover:text-emerald-300 transition-colors">
                <span>{isAr ? 'الكوتش الذكي' : 'AI COACH'}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-[#FFE600] text-black font-black">
                  S-RANK
                </span>
              </span>
              <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {isAr ? 'مستشارك الرياضي' : 'Aura Coach Online'}
              </span>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default Assistant;
