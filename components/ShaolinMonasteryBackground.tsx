/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Mountain, Film, Sparkles, Wind, Eye, EyeOff } from 'lucide-react';
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
      const saved = localStorage.getItem('yard300_cinemagraph_bg');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const [cinemagraphMode, setCinemagraphMode] = useState<'cinemagraph' | 'calm'>('cinemagraph');
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';

  useEffect(() => {
    localStorage.setItem('yard300_cinemagraph_bg', String(isEnabled));
  }, [isEnabled]);

  // Canvas particle simulation for living Cinemagraph elements:
  // - Drifting mountain cloud mist layers
  // - Warm temple lantern fire flickers & micro-embers
  // - Rising golden martial aura motes
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

    // Warm lantern coordinates relative to the courtyard and pavilions (cinemagraph points of living light)
    const lanternFlickers = [
      { rx: 0.36, ry: 0.85, baseRadius: 45, color: 'rgba(255, 175, 40, ' },
      { rx: 0.46, ry: 0.74, baseRadius: 35, color: 'rgba(255, 160, 30, ' },
      { rx: 0.53, ry: 0.68, baseRadius: 30, color: 'rgba(255, 185, 50, ' },
      { rx: 0.78, ry: 0.90, baseRadius: 55, color: 'rgba(255, 170, 35, ' },
      { rx: 0.80, ry: 0.59, baseRadius: 28, color: 'rgba(255, 180, 45, ' }
    ];

    // Cinemagraph Rising Embers from Lanterns & Courtyard
    const particleCount = cinemagraphMode === 'cinemagraph' ? 50 : 25;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.35 + 0.12),
      speedX: (Math.random() - 0.45) * 0.25 + 0.08, // gentle eastward mountain draft
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      color: Math.random() > 0.4 ? 'rgba(255, 225, 60, ' : 'rgba(255, 140, 40, '
    }));

    // Volumetric Soft Mist Clouds drifting through granite valleys
    const mistLayers = Array.from({ length: 5 }, (_, i) => ({
      x: (i * width) / 5,
      y: height * 0.25 + (i * height) * 0.14,
      radius: Math.max(width, height) * 0.48,
      speedX: 0.1 + i * 0.04,
      alpha: 0.035 + i * 0.008
    }));

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Living Volumetric Mountain Mist (Cinemagraph Cloud Drift)
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
        grad.addColorStop(0, `rgba(225, 238, 255, ${mist.alpha})`);
        grad.addColorStop(0.5, `rgba(180, 205, 245, ${mist.alpha * 0.45})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mist.x, mist.y, mist.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Living Lantern Flame Pulses (Cinemagraph Warm Fire Glow)
      lanternFlickers.forEach((l, idx) => {
        const lx = l.rx * width;
        const ly = l.ry * height;
        // Natural fire flicker frequency modulation
        const flicker = Math.sin(tick * 0.08 + idx * 2.1) * 0.15 + Math.cos(tick * 0.13 + idx) * 0.1;
        const currentRadius = l.baseRadius * (1 + flicker);
        const alpha = Math.max(0.15, Math.min(0.45, 0.28 + flicker * 0.5));

        const fireGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, currentRadius);
        fireGrad.addColorStop(0, `${l.color}${alpha})`);
        fireGrad.addColorStop(0.4, `${l.color}${alpha * 0.5})`);
        fireGrad.addColorStop(1, 'rgba(255, 120, 0, 0)');

        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(lx, ly, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Rising Martial Aura & Lantern Embers
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(tick * p.pulseSpeed) * 0.015;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) {
          p.x = -10;
        } else if (p.x < -10) {
          p.x = width + 10;
        }

        const currentAlpha = Math.max(0.12, Math.min(0.85, p.opacity));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowColor = '#FFE600';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isEnabled, cinemagraphMode]);

  return (
    <>
      {/* Background Container Fixed Underneath App Content */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-1000"
        aria-hidden="true"
        style={{ opacity: isEnabled ? 1 : 0 }}
      >
        {/* Layer 1: Cinemagraph High-Definition Base Image with Seamless Living Breathing Motion */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center will-change-transform cinemagraph-breathing-layer"
          style={{
            backgroundImage: `url('/images/shaolin_mountain_monastery.jpg')`,
            backgroundPosition: 'center 22%',
            filter: 'brightness(0.36) contrast(1.18) saturate(1.12)'
          }}
        />

        {/* Layer 2: Deep Cyber-Obsidian Vignette & Atmospheric Contrast Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040508]/92 via-[#040508]/65 to-[#040508]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040508] via-transparent to-[#040508]/90" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040508]/30 to-[#040508]/95" />

        {/* Layer 3: Canvas for Living Cinemagraph Elements (Flickering Lanterns, Drifting Fog, Rising Aura Embers) */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full mix-blend-screen opacity-75"
        />

        {/* Layer 4: Authentic 35mm Motion Picture Subtle Film Grain */}
        <div className="absolute inset-0 bg-speedlines mix-blend-overlay opacity-10 pointer-events-none" />
      </div>

      {/* Floating Cinemagraph Control Pill in Bottom-Right Corner */}
      <div className="fixed bottom-4 right-4 z-40 hidden sm:flex items-center gap-1.5 p-1 rounded-2xl bg-[#0C0E18]/90 border border-emerald-500/40 backdrop-blur-xl shadow-[0_0_25px_rgba(16,185,129,0.25)] text-xs">
        <button
          type="button"
          onClick={() => setIsEnabled(!isEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-anime font-black text-[11px] transition-all cursor-pointer ${
            isEnabled 
              ? 'bg-emerald-500 text-black shadow-md' 
              : 'bg-black/60 text-gray-400 hover:text-white'
          }`}
          title="Toggle Cinemagraph Shaolin Background"
        >
          <Film className="w-3.5 h-3.5" />
          <span>
            {isEnabled 
              ? (isFr ? 'Cinemagraph Shaolin' : isEs ? 'Cinemagraph Shaolin' : 'Shaolin Cinemagraph') 
              : (isFr ? 'Noir Pur' : isEs ? 'Negro Puro' : 'Pure Obsidian')}
          </span>
        </button>

        {isEnabled && (
          <button
            type="button"
            onClick={() => setCinemagraphMode(prev => prev === 'cinemagraph' ? 'calm' : 'cinemagraph')}
            className="p-1.5 rounded-xl bg-black/60 hover:bg-black text-[#FFE600] transition-colors cursor-pointer"
            title={cinemagraphMode === 'cinemagraph' ? 'Living Cinemagraph (Active)' : 'Calm Mist Mode'}
          >
            {cinemagraphMode === 'cinemagraph' ? <Wind className="w-3.5 h-3.5 animate-pulse text-[#FFE600]" /> : <Sparkles className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        )}
      </div>
    </>
  );
};
