import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { SHOWCASE_GALLERIES, ShowcaseCategorySlug } from '../data/showcaseGalleries';

interface SpaceShowcaseCarouselProps {
  onSelectCategory: (slug: ShowcaseCategorySlug) => void;
}

const AUTO_ADVANCE_MS = 3400;

export const SpaceShowcaseCarousel: React.FC<SpaceShowcaseCarouselProps> = ({
  onSelectCategory,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(4); // Starts showcasing Washroom / center energy, cycles through all 10
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const total = SHOWCASE_GALLERIES.length;
  const activeItem = SHOWCASE_GALLERIES[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!isPlaying || isHovered || prefersReducedMotion) return;
    const timer = window.setInterval(handleNext, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [isPlaying, isHovered, prefersReducedMotion, handleNext]);

  // Signed circular shortest offset from activeIndex (-total/2 .. +total/2)
  const getOffset = (idx: number): number => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section
      id="space-showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative mb-16 md:mb-24 w-full overflow-hidden bg-[#121110] text-white py-14 md:py-20 select-none scroll-mt-24"
    >
      {/* Dramatic Studio Radial Background + Top Architectural Spotlight Cone */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 68% 58% at 50% 44%, rgba(179,149,123,0.22) 0%, rgba(42,36,32,0.55) 46%, rgba(18,17,16,0.98) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[520px] md:w-[760px] h-[420px] opacity-60 blur-2xl"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 0%, transparent 142deg, rgba(235,213,157,0.26) 174deg, rgba(255,255,255,0.28) 180deg, rgba(235,213,157,0.26) 186deg, transparent 218deg)',
        }}
      />

      {/* Overhead Studio Fixture Pill / Eyebrow */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 text-center mb-6 md:mb-8">
        <div className="mx-auto w-28 h-2 rounded-full bg-gradient-to-r from-stone-600 via-[#ebd59d] to-stone-600 shadow-[0_6px_28px_rgba(235,213,157,0.65)] mb-5 opacity-80" />
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#ebd59d] font-semibold">
          Curated Spaces · Interactive Showcase
        </p>
      </div>

      {/* 3D Curved Fanned Stage */}
      <div
        className="relative z-10 h-[360px] sm:h-[420px] md:h-[470px] w-full max-w-[1440px] mx-auto flex items-center justify-center"
        style={{ perspective: '1500px' }}
      >
        {SHOWCASE_GALLERIES.map((item, idx) => {
          const offset = getOffset(idx);
          const absOffset = Math.abs(offset);
          const isVisible = absOffset <= 4;

          if (!isVisible) return null;

          const isCenter = offset === 0;

          // Curved radial arc geometry matching the studio reference video
          const xPercent =
            offset === 0
              ? 0
              : Math.sign(offset) *
                (absOffset === 1
                  ? 98
                  : absOffset === 2
                  ? 182
                  : absOffset === 3
                  ? 254
                  : 318);

          const yPx = absOffset === 0 ? -10 : absOffset * absOffset * 9;
          const rotateZ = prefersReducedMotion ? 0 : offset * 5.2;
          const rotateY = prefersReducedMotion ? 0 : offset * -14;
          const scale =
            absOffset === 0
              ? 1.06
              : absOffset === 1
              ? 0.85
              : absOffset === 2
              ? 0.72
              : absOffset === 3
              ? 0.6
              : 0.5;
          const opacity =
            absOffset === 0
              ? 1
              : absOffset === 1
              ? 0.82
              : absOffset === 2
              ? 0.62
              : absOffset === 3
              ? 0.42
              : 0.22;
          const zIndex = 30 - absOffset * 5;

          return (
            <motion.button
              key={item.slug}
              type="button"
              onClick={() => {
                if (isCenter) {
                  onSelectCategory(item.slug);
                } else {
                  setActiveIndex(idx);
                }
              }}
              initial={false}
              animate={{
                x: `${xPercent}%`,
                y: yPx,
                scale,
                rotateZ,
                rotateY,
                opacity,
              }}
              whileHover={
                isCenter
                  ? { scale: 1.09, y: -14 }
                  : { scale: scale + 0.04, opacity: Math.min(1, opacity + 0.2) }
              }
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25,
                mass: 0.9,
              }}
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              aria-label={
                isCenter
                  ? `Open ${item.title} animated gallery`
                  : `Focus ${item.title}`
              }
              className={`absolute w-[195px] sm:w-[235px] md:w-[265px] aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ebd59d] ${
                isCenter
                  ? 'shadow-[0_30px_70px_rgba(0,0,0,0.85)] ring-1 ring-[#ebd59d]/55'
                  : 'shadow-[0_18px_40px_rgba(0,0,0,0.65)] ring-1 ring-white/10'
              }`}
            >
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {/* Lighting vignette & glossy edge highlight */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isCenter
                    ? 'bg-gradient-to-t from-black/75 via-transparent to-white/10'
                    : 'bg-gradient-to-t from-black/80 via-black/25 to-black/20'
                }`}
              />

              {isCenter && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
              )}

              {/* Subtle label on side cards & hover prompt on center */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-left">
                <p
                  className={`font-['Playfair_Display',serif] text-white tracking-wide drop-shadow transition-all ${
                    isCenter ? 'text-lg sm:text-xl font-medium' : 'text-sm opacity-90'
                  }`}
                >
                  {item.title}
                </p>
                {isCenter && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#ebd59d] mt-1 font-semibold">
                    <span>Open Animated Gallery</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}

        {/* Glowing Pedestal Disc directly under Center Showcase Card */}
        <div className="pointer-events-none absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="w-44 sm:w-56 h-5 rounded-full bg-gradient-to-r from-transparent via-[#ebd59d]/35 to-transparent blur-sm" />
          <div className="w-36 sm:w-48 h-2.5 -mt-3 rounded-full border border-white/20 bg-gradient-to-b from-white/15 to-transparent shadow-[0_0_24px_rgba(235,213,157,0.35)]" />
        </div>
      </div>

      {/* Center Active Typography & Sleek Scrubber Controls (mirrors reference bottom stage) */}
      <div className="relative z-20 max-w-2xl mx-auto px-6 mt-5 text-center space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.slug}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1.5"
          >
            <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wider uppercase text-white">
              {activeItem.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light">
              {activeItem.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Scrubber Bar + Prev / Next + Play/Pause + CTA */}
        <div className="flex flex-col items-center gap-4 pt-1">
          <div className="flex items-center justify-center gap-4 w-full max-w-md">
            <button
              type="button"
              onClick={handlePrev}
              className="w-9 h-9 rounded-full border border-white/20 hover:border-[#ebd59d] hover:bg-[#ebd59d] text-white hover:text-[#121110] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Previous space"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Sleek Track Dots */}
            <div className="flex-1 flex items-center gap-1.5 justify-center">
              {SHOWCASE_GALLERIES.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={`dot-${item.slug}`}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-8 bg-[#ebd59d]'
                        : 'w-2 bg-white/25 hover:bg-white/55'
                    }`}
                    aria-label={`Select ${item.title}`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-9 h-9 rounded-full border border-white/20 hover:border-[#ebd59d] hover:bg-[#ebd59d] text-white hover:text-[#121110] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Next space"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((v) => !v)}
              className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-stone-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label={isPlaying ? 'Pause rotation' : 'Resume rotation'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSelectCategory(activeItem.slug)}
            className="inline-flex items-center gap-2.5 bg-[#b3957b] hover:bg-[#ebd59d] text-[#121110] font-bold text-xs uppercase tracking-[0.18em] px-7 py-3.5 rounded-full transition-colors cursor-pointer shadow-[0_10px_30px_rgba(179,149,123,0.3)] min-h-[44px]"
          >
            <span>Explore {activeItem.title} Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
