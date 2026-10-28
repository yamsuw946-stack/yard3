import React, { useState } from 'react';
import { handleImageError } from '../constants';

interface Yard300LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  showSubtitle?: boolean;
  customSubtitle?: string;
  customBadge?: string;
}

/**
 * Yard300Logo:
 * Official YARD 300 geometric vector speed emblem (Monochrome Pure Black & Platinum White).
 * Stylized dual chevron wings with sharp 45-degree negative-space slash and "300" racing typography.
 */
export const Yard300Logo: React.FC<Yard300LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = false,
  showSubtitle = false,
  customSubtitle,
  customBadge
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Sizing definitions tailored for responsive viewports
  const sizeMap = {
    sm: {
      emblem: 'w-8 h-8',
      text: 'text-sm',
      subtext: 'text-[9px]',
    },
    md: {
      emblem: 'w-10 h-10 md:w-11 md:h-11',
      text: 'text-base md:text-lg',
      subtext: 'text-[10px]',
    },
    lg: {
      emblem: 'w-16 h-16 md:w-20 md:h-20',
      text: 'text-2xl',
      subtext: 'text-xs',
    },
    hero: {
      emblem: 'w-24 h-24 md:w-28 md:h-28',
      text: 'text-3xl md:text-4xl',
      subtext: 'text-sm',
    }
  };

  const currentSize = sizeMap[size];

  return (
    <div 
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none group cursor-pointer ${className}`}
      aria-label="YARD 300 Official Geometric Logo"
    >
      {/* Official Geometric Chevron Emblem */}
      <div 
        className={`relative ${currentSize.emblem} rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105 active:scale-95 bg-black flex items-center justify-center overflow-hidden`}
        title="YARD 300 Official Emblem"
      >
        {/* Crisp Vector SVG Emblem (100% vector accuracy to user upload) */}
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full p-0.5 object-contain"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Solid Pure Black Background */}
          <rect width="500" height="500" fill="#000000"/>
          
          {/* Left Geometric Wing / Wedge */}
          <path 
            d="M 40 168 L 275 168 L 160 278 C 152 286 142 284 136 276 L 40 168 Z" 
            fill="#FFFFFF"
          />
          
          {/* Right Diagonal Mecha Bar / Wing */}
          <path 
            d="M 332 168 L 460 168 L 305 368 L 246 368 C 234 368 224 358 220 348 L 192 315 C 188 308 190 298 198 290 L 332 168 Z" 
            fill="#FFFFFF"
          />
          
          {/* "300" Inscription Cutout on Lower-Left of Right Bar */}
          <g transform="translate(208, 308) skewX(-16)">
            {/* 3 */}
            <path 
              d="M 6 4 L 38 4 C 44 4 48 8 48 14 C 48 18 45 21 41 23 C 46 25 49 29 49 35 C 49 42 44 46 37 46 L 6 46 L 6 36 L 34 36 C 36 36 38 35 38 33 C 38 31 36 30 34 30 L 20 30 L 20 22 L 33 22 C 35 22 37 21 37 19 C 37 17 35 15 33 15 L 6 15 Z" 
              fill="#000000"
            />
            {/* First 0 */}
            <path 
              d="M 54 14 C 54 6 60 4 70 4 C 80 4 86 6 86 14 L 86 36 C 86 44 80 46 70 46 C 60 46 54 44 54 36 Z M 65 34 C 65 37 67 38 70 38 C 73 38 75 37 75 34 L 75 16 C 75 13 73 12 70 12 C 67 12 65 13 65 16 Z" 
              fill="#000000"
            />
            {/* Second 0 */}
            <path 
              d="M 92 14 C 92 6 98 4 108 4 C 118 4 124 6 124 14 L 124 36 C 124 44 118 46 108 46 C 98 46 92 44 92 36 Z M 103 34 C 103 37 105 38 108 38 C 111 38 113 37 113 34 L 113 16 C 113 13 111 12 108 12 C 105 12 103 13 103 16 Z" 
              fill="#000000"
            />
          </g>
        </svg>
      </div>

      {/* Brand Typography Block */}
      {showText && (
        <div className="flex flex-col items-start leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-anime font-black text-white tracking-wider ${currentSize.text} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
              YARD
            </span>
            <span className={`font-anime font-black text-white tracking-widest ${currentSize.text}`}>
              300
            </span>
          </div>

          {(showSubtitle || customSubtitle) && (
            <span className={`font-anime font-bold text-gray-300 tracking-widest uppercase mt-0.5 ${currentSize.subtext}`}>
              {customSubtitle || 'COMBAT HEALTH & PERFORMANCE'}
            </span>
          )}

          {customBadge && (
            <span className="mt-0.5 px-1.5 py-0.5 rounded bg-white/10 text-white text-[8px] font-mono font-bold tracking-wider">
              {customBadge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Yard300Logo;
