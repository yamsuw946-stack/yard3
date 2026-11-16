import React from 'react';

interface Yard300LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  variant?: 'full' | 'badge';
  showText?: boolean;
  showSubtitle?: boolean;
  showSubtext?: boolean;
  customSubtitle?: string;
  customBadge?: string;
}

/**
 * Yard300Logo:
 * Official YARD 300 geometric vector speed emblem (preserves the exact dual chevron wings & "300" cutout geometry)
 * paired with architectural wide-geometric YARD + precision Orbitron 300 wordmark typography.
 */
export const Yard300Logo: React.FC<Yard300LogoProps> = ({
  className = '',
  size = 'md',
  variant,
  showText = false,
  showSubtitle = false,
  showSubtext,
  customSubtitle,
  customBadge
}) => {
  const sizeMap = {
    xs: {
      emblem: 'w-6 h-5 rounded-md p-0.5',
      text: 'text-[11px]',
      num: 'text-[10px]',
      subtext: 'text-[7px]',
      gap: 'gap-1.5'
    },
    sm: {
      emblem: 'w-10 h-8',
      text: 'text-[15px]',
      num: 'text-[14px]',
      subtext: 'text-[8.5px]',
      gap: 'gap-2'
    },
    md: {
      emblem: 'w-12 h-9 md:w-14 md:h-10',
      text: 'text-lg md:text-[21px]',
      num: 'text-[17px] md:text-[19px]',
      subtext: 'text-[9.5px]',
      gap: 'gap-2.5 sm:gap-3'
    },
    lg: {
      emblem: 'w-20 h-14 md:w-24 md:h-16',
      text: 'text-2xl md:text-3xl',
      num: 'text-2xl md:text-[28px]',
      subtext: 'text-[11px]',
      gap: 'gap-3.5'
    },
    hero: {
      emblem: 'w-28 h-20 md:w-32 md:h-24',
      text: 'text-3xl md:text-4xl',
      num: 'text-3xl md:text-4xl',
      subtext: 'text-xs',
      gap: 'gap-4'
    }
  };

  const currentSize = sizeMap[size] || sizeMap.sm;
  const shouldShowText = showText || variant === 'badge';
  const shouldShowSubtitle = showSubtext !== undefined ? showSubtext : showSubtitle;

  return (
    <div
      dir="ltr"
      className={`inline-flex items-center ${currentSize.gap} select-none group cursor-pointer ${className}`}
      aria-label="YARD 300 Official Logo"
    >
      {/* Official Geometric Chevron Emblem — exact original vector geometry framed cleanly for crisp edge clarity */}
      <div
        className={`relative ${currentSize.emblem} rounded-xl shrink-0 transition-all duration-300 group-hover:scale-105 active:scale-95 bg-[#050608] border border-white/25 group-hover:border-[#D4AF37]/75 shadow-[0_4px_16px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)_inset] flex items-center justify-center overflow-hidden p-1`}
        title="YARD 300 Official Emblem"
      >
        <svg
          viewBox="24 148 452 240"
          className="w-full h-full object-contain drop-shadow-[0_1px_4px_rgba(255,255,255,0.22)]"
          fill="none"
          shapeRendering="geometricPrecision"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Geometric Wing / Wedge (unchanged path geometry) */}
          <path
            d="M 40 168 L 275 168 L 160 278 C 152 286 142 284 136 276 L 40 168 Z"
            fill="#FFFFFF"
          />

          {/* Right Diagonal Mecha Bar / Wing (unchanged path geometry) */}
          <path
            d="M 332 168 L 460 168 L 305 368 L 246 368 C 234 368 224 358 220 348 L 192 315 C 188 308 190 298 198 290 L 332 168 Z"
            fill="#FFFFFF"
          />

          {/* "300" Inscription Cutout on Lower-Left of Right Bar (high-contrast cutout) */}
          <g transform="translate(208, 308) skewX(-16)">
            <path
              d="M 6 4 L 38 4 C 44 4 48 8 48 14 C 48 18 45 21 41 23 C 46 25 49 29 49 35 C 49 42 44 46 37 46 L 6 46 L 6 36 L 34 36 C 36 36 38 35 38 33 C 38 31 36 30 34 30 L 20 30 L 20 22 L 33 22 C 35 22 37 21 37 19 C 37 17 35 15 33 15 L 6 15 Z"
              fill="#050608"
            />
            <path
              d="M 54 14 C 54 6 60 4 70 4 C 80 4 86 6 86 14 L 86 36 C 86 44 80 46 70 46 C 60 46 54 44 54 36 Z M 65 34 C 65 37 67 38 70 38 C 73 38 75 37 75 34 L 75 16 C 75 13 73 12 70 12 C 67 12 65 13 65 16 Z"
              fill="#050608"
            />
            <path
              d="M 92 14 C 92 6 98 4 108 4 C 118 4 124 6 124 14 L 124 36 C 124 44 118 46 108 46 C 98 46 92 44 92 36 Z M 103 34 C 103 37 105 38 108 38 C 111 38 113 37 113 34 L 113 16 C 113 13 111 12 108 12 C 105 12 103 13 103 16 Z"
              fill="#050608"
            />
          </g>
        </svg>
      </div>

      {/* Architectural YARD / 300 Wordmark Lockup */}
      {shouldShowText && (
        <div className="flex flex-col items-start leading-none">
          <div className="inline-flex items-baseline gap-1">
            <span
              className={`font-yard-brand font-extrabold uppercase tracking-[0.14em] bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent ${currentSize.text}`}
            >
              YARD
            </span>
            <span className={`${size === 'xs' ? 'h-2.5' : 'h-3.5'} w-[1.5px] bg-[#D4AF37]/75 -skew-x-[18deg] self-center`} aria-hidden="true" />
            <span
              className={`font-yard-num font-black tracking-[0.12em] text-[#D4AF37] group-hover:text-[#F0CF61] transition-colors ${currentSize.num}`}
            >
              300
            </span>
          </div>

          {size !== 'xs' && (
            <div className="w-full h-[1px] mt-1 bg-gradient-to-r from-[#D4AF37]/65 via-white/25 to-transparent" aria-hidden="true" />
          )}

          {(shouldShowSubtitle || customSubtitle) && (
            <span className={`font-mono font-semibold text-slate-400 tracking-[0.22em] uppercase mt-1 ${currentSize.subtext}`}>
              {customSubtitle || 'COMBAT HEALTH & PERFORMANCE'}
            </span>
          )}

          {customBadge && (
            <span className="mt-1 px-1.5 py-0.5 rounded bg-white/10 text-white text-[8px] font-mono font-bold tracking-wider">
              {customBadge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Yard300Logo;
