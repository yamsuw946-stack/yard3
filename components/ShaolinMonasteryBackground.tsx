/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Mountain, Sparkles, Wind, Eye, EyeOff } from 'lucide-react';
import { Language } from '../i18n';

interface ShaolinMonasteryBackgroundProps {
  currentLang?: Language;
}

export const ShaolinMonasteryBackground: React.FC<ShaolinMonasteryBackgroundProps> = ({ 
  currentLang = 'en' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yard300_shaolin_bg');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const [intensity, setIntensity] = useState<'calm' | 'dynamic'>('dynamic');
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';

  useEffect(() => {
    localStorage.setItem('yard300_shaolin_bg', String(isEnabled));
  }, [isEnabled]);

  // Canvas particle simulation for atmospheric golden embers and drifting mountain mist
  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Motes & Golden Temple Embers
    const particleCount = intensity === 'dynamic' ? 45 : 20;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.3 + 0.1, // subtle eastward breeze
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.4 ? 'rgba(255, 230, 0, ' : 'rgba(255, 120, 40, '
    }));

    // Soft drifting clouds / mist layers
    const mistLayers = Array.from({ length: 4 }, (_, i) => ({
      x: (i * width) / 4,
      y: height * 0.3 + (i * height) * 0.15,
      radius: Math.max(width, height) * 0.45,
      speedX: 0.12 * (i + 1),
      alpha: 0.04
    }));

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw drifting misty cloud patches
      mistLayers.forEach((mist) => {
        mist.x += mist.speedX;
        if (mist.x - mist.radius > width) {
          mist.x = -mist.radius;
        }

        const grad = ctx.createRadialGradient(
          mist.x,
          mist.y,
          0,
          mist.x,
          mist.y,
          mist.radius
        );
        grad.addColorStop(0, `rgba(220, 235, 255, ${mist.alpha})`);
        grad.addColorStop(0.6, `rgba(180, 200, 240, ${mist.alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mist.x, mist.y, mist.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw rising martial monastery embers & aura motes
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(tick * p.pulseSpeed) * 0.01;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) {
          p.x = -10;
        } else if (p.x < -10) {
          p.x = width + 10;
        }

        const currentAlpha = Math.max(0.1, Math.min(0.9, p.opacity));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowColor = '#FFE600';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isEnabled, intensity]);

  return (
    <>
      {/* Background Container Fixed Underneath App Content */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-1000"
        aria-hidden="true"
        style={{ opacity: isEnabled ? 1 : 0 }}
      >
        {/* Layer 1: High-Resolution Shaolin Mountain Sanctuary Image with subtle breathing pan */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[20000ms] ease-out will-change-transform"
          style={{
            backgroundImage: `url('/images/shaolin_mountain_monastery.jpg')`,
            backgroundPosition: 'center 20%',
            filter: 'brightness(0.38) contrast(1.15) saturate(1.1)',
            transform: isEnabled ? 'scale(1.06)' : 'scale(1.0)'
          }}
        />

        {/* Layer 2: Deep Cyber-Obsidian Vignette & Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040508]/90 via-[#040508]/70 to-[#040508]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040508] via-transparent to-[#040508]/90" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040508]/40 to-[#040508]/95" />

        {/* Layer 3: Canvas for floating mist clouds & rising temple embers */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full mix-blend-screen opacity-70"
        />
      </div>

      {/* Floating Aesthetic Control Pill in Bottom-Right Corner */}
      <div className="fixed bottom-4 right-4 z-40 hidden sm:flex items-center gap-1.5 p-1 rounded-2xl bg-[#0C0E18]/90 border border-emerald-500/40 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.25)] text-xs">
        <button
          type="button"
          onClick={() => setIsEnabled(!isEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-anime font-black text-[11px] transition-all cursor-pointer ${
            isEnabled 
              ? 'bg-emerald-500 text-black shadow-md' 
              : 'bg-black/60 text-gray-400 hover:text-white'
          }`}
          title="Toggle Shaolin Training Monastery Background"
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>
            {isEnabled 
              ? (isFr ? 'Monastère Shaolin' : isEs ? 'Monasterio Shaolin' : 'Shaolin Monastery') 
              : (isFr ? 'Fond Noir Pur' : isEs ? 'Fondo Negro' : 'Obsidian Pure')}
          </span>
        </button>

        {isEnabled && (
          <button
            type="button"
            onClick={() => setIntensity(prev => prev === 'dynamic' ? 'calm' : 'dynamic')}
            className="p-1.5 rounded-xl bg-black/60 hover:bg-black text-[#FFE600] transition-colors cursor-pointer"
            title={intensity === 'dynamic' ? 'Calm Mist' : 'Dynamic Mist & Embers'}
          >
            {intensity === 'dynamic' ? <Wind className="w-3.5 h-3.5 animate-pulse" /> : <Sparkles className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </>
  );
};
