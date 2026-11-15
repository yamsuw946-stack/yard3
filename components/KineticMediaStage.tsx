import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { handleImageError } from '../constants';

export interface KineticSlide {
  id: string;
  src: string;
  alt: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  accentColor?: string;
}

interface KineticMediaStageProps {
  slides: KineticSlide[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  isAr?: boolean;
  currentLang?: string;
  aspectClassName?: string;
  objectPosition?: 'top' | 'center';
  objectFit?: 'cover' | 'contain';
  onTapSlide?: (slide: KineticSlide, index: number) => void;
  renderOverlay?: (slide: KineticSlide, index: number) => React.ReactNode;
  showControls?: boolean;
  showScrubBar?: boolean;
  className?: string;
  perspectiveTilt?: { x: number; y: number };
  scaleBoost?: number;
}

export const KineticMediaStage: React.FC<KineticMediaStageProps> = ({
  slides,
  activeIndex,
  onChangeIndex,
  isAr = false,
  currentLang,
  aspectClassName = 'aspect-[16/9]',
  objectPosition = 'center',
  objectFit = 'cover',
  onTapSlide,
  renderOverlay,
  showControls = true,
  showScrubBar = true,
  className = '',
  perspectiveTilt,
  scaleBoost = 1
}) => {
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number; active: boolean; moved: boolean }>({
    x: 0,
    y: 0,
    active: false,
    moved: false
  });
  const stageRef = useRef<HTMLDivElement | null>(null);

  const count = slides.length;
  const safeIdx = Math.max(0, Math.min(activeIndex, count - 1));

  const goToNext = useCallback(() => {
    if (count <= 1) return;
    onChangeIndex((safeIdx + 1) % count);
  }, [count, onChangeIndex, safeIdx]);

  const goToPrev = useCallback(() => {
    if (count <= 1) return;
    onChangeIndex((safeIdx - 1 + count) % count);
  }, [count, onChangeIndex, safeIdx]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, input, select')) return;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      active: true,
      moved: false
    };
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if capture is unsupported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current.active) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      pointerStartRef.current.moved = true;
    }
    // Dampened horizontal drag feedback
    const width = stageRef.current?.clientWidth || 400;
    const clamped = Math.max(-width * 0.45, Math.min(width * 0.45, dx));
    setDragOffsetX(clamped);
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current.active) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const wasMoved = pointerStartRef.current.moved;
    pointerStartRef.current.active = false;
    setIsDragging(false);
    setDragOffsetX(0);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore release failures
    }

    const threshold = 48;
    if (Math.abs(dx) >= threshold && count > 1) {
      const goForward = isAr ? dx > 0 : dx < 0;
      if (goForward) {
        goToNext();
      } else {
        goToPrev();
      }
    } else if (!wasMoved && onTapSlide) {
      onTapSlide(slides[safeIdx], safeIdx);
    }
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isAr) goToPrev();
        else goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isAr) goToNext();
        else goToPrev();
      }
    };
    el.addEventListener('keydown', onKeyDown);
    return () => el.removeEventListener('keydown', onKeyDown);
  }, [goToNext, goToPrev, isAr]);

  const activeSlide = slides[safeIdx];
  const progressPercent = count > 0 ? ((safeIdx + 1) / count) * 100 : 100;

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      className={`relative overflow-hidden select-none touch-pan-y outline-none group ${aspectClassName} ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
    >
      {/* Stacked GPU-Composited Depth Slides */}
      <div
        className="relative w-full h-full"
        style={
          perspectiveTilt
            ? {
                transform: `rotateX(${perspectiveTilt.x}deg) rotateY(${perspectiveTilt.y}deg) scale(${scaleBoost})`,
                transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
              }
            : undefined
        }
      >
        {slides.map((slide, idx) => {
          const offset = idx - safeIdx;
          const isCurrent = offset === 0;
          const dir = isAr ? -1 : 1;
          const translatePct = offset * 100 * dir;
          const slideOpacity = isCurrent ? 1 : Math.abs(offset) === 1 ? 0.35 : 0;
          const slideScale = isCurrent ? 1 : 0.94;
          const blurPx = isCurrent ? 0 : 4;

          return (
            <div
              key={slide.id}
              aria-hidden={!isCurrent}
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(calc(${translatePct}% + ${dragOffsetX}px), 0, 0) scale(${slideScale})`,
                opacity: slideOpacity,
                filter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
                zIndex: isCurrent ? 2 : 1,
                transition: isDragging
                  ? 'none'
                  : 'transform 620ms cubic-bezier(0.22, 1, 0.36, 1), opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), filter 520ms ease'
              }}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                onError={handleImageError}
                referrerPolicy="no-referrer"
                draggable={false}
                loading={isCurrent || Math.abs(offset) <= 1 ? 'eager' : 'lazy'}
                decoding="async"
                className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} ${
                  objectPosition === 'top' ? 'object-top' : 'object-center'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Custom Stage Overlay */}
      {renderOverlay && activeSlide && renderOverlay(activeSlide, safeIdx)}

      {/* Magnetic Prev / Next Glass Controls */}
      {showControls && count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isAr) goToNext();
              else goToPrev();
            }}
            aria-label={isAr || currentLang === 'ar' ? 'التالي' : currentLang === 'es' ? 'Anterior' : currentLang === 'fr' ? 'Précédent' : 'Previous'}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-[#07080C]/85 backdrop-blur-md border border-white/[0.14] hover:border-[#D4AF37] text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all hover:scale-105 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-4 h-4 text-[#D4AF37]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isAr) goToPrev();
              else goToNext();
            }}
            aria-label={isAr || currentLang === 'ar' ? 'السابق' : currentLang === 'es' ? 'Siguiente' : currentLang === 'fr' ? 'Suivant' : 'Next'}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-[#07080C]/85 backdrop-blur-md border border-white/[0.14] hover:border-[#D4AF37] text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all hover:scale-105 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </>
      )}

      {/* 2026 Continuous Illuminated Scrub Track */}
      {showScrubBar && count > 1 && (
        <div className="absolute bottom-0 inset-x-0 z-30 px-4 pb-2.5 pt-6 bg-gradient-to-t from-[#07080C]/90 via-[#07080C]/35 to-transparent pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {slides.map((s, idx) => {
              const active = idx === safeIdx;
              const passed = idx < safeIdx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeIndex(idx);
                  }}
                  aria-label={`${idx + 1}`}
                  className="relative flex-1 h-4 flex items-center cursor-pointer group/tick"
                >
                  <span className="w-full h-[3px] rounded-full bg-white/[0.16] overflow-hidden block">
                    <span
                      className="block h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: active ? '100%' : passed ? '100%' : '0%',
                        opacity: active ? 1 : passed ? 0.45 : 0,
                        backgroundColor: activeSlide?.accentColor || '#D4AF37'
                      }}
                    />
                  </span>
                </button>
              );
            })}
            <span
              className="text-[10px] font-mono tabular-nums text-[#D4AF37] ms-2 shrink-0"
              dir="ltr"
              style={{ opacity: progressPercent > 0 ? 1 : 0.8 }}
            >
              {String(safeIdx + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KineticMediaStage;
