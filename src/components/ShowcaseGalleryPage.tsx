import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  X,
} from 'lucide-react';
import {
  GalleryPhotoItem,
  SHOWCASE_GALLERIES,
  ShowcaseCategorySlug,
  ShowcaseGalleryCategory,
} from '../data/showcaseGalleries';

interface ShowcaseGalleryPageProps {
  category: ShowcaseGalleryCategory;
  onBackHome: () => void;
  onSelectCategory: (slug: ShowcaseCategorySlug) => void;
  onBookConsultation: (subject: string) => void;
}

const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
  title?: string;
}> = ({ src, alt, className = '', title }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#2a2623] via-[#3a3532] to-[#1a1817] flex flex-col items-center justify-center p-6 text-center text-[#f7f5f2]">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#ebd59d] mb-2">
          NRB DESIGN
        </span>
        <p className="font-['Playfair_Display',serif] text-lg text-white">
          {title || alt}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

/* Interactive 3D perspective tilt card for the curated collection grid */
const TiltGalleryCard: React.FC<{
  photo: GalleryPhotoItem;
  index: number;
  isLead: boolean;
  slug: string;
  prefersReducedMotion: boolean | null;
  onOpen: () => void;
}> = ({ photo, index, isLead, slug, prefersReducedMotion, onOpen }) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 24 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1000 }}
      className={isLead ? 'md:col-span-2 lg:col-span-2' : ''}
    >
      <motion.button
        ref={cardRef}
        key={`${slug}-tilt-${index}`}
        type="button"
        onClick={onOpen}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="w-full h-full group text-left bg-white rounded-2xl overflow-hidden border border-[#eae6df] shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col cursor-pointer"
      >
        <div
          className={`relative overflow-hidden bg-[#1a1817] w-full ${
            isLead ? 'aspect-[16/10]' : 'aspect-[4/3]'
          }`}
        >
          <ImageWithFallback
            src={photo.url}
            alt={photo.title}
            title={photo.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Subtle shimmer sweep on hover */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 w-10 h-10 rounded-full bg-white/95 text-[#1a1817] flex items-center justify-center shadow-lg">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#8c735d] font-medium">
              <span className="tabular-nums">{formattedIndex}</span>
              <span aria-hidden="true">·</span>
              <span>{photo.finish}</span>
            </div>
            <h3 className="font-['Playfair_Display',serif] text-xl text-[#1a1817] group-hover:text-[#8c735d] transition-colors">
              {photo.title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">{photo.caption}</p>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};

const SLIDE_INTERVAL_MS = 3800;

export const ShowcaseGalleryPage: React.FC<ShowcaseGalleryPageProps> = ({
  category,
  onBackHome,
  onSelectCategory,
  onBookConsultation,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPausedByHover, setIsPausedByHover] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxDirection, setLightboxDirection] = useState(1);

  const photos = category.photos;
  const total = photos.length;
  const currentPhoto = photos[activeIndex] || photos[0];
  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  // Reset state cleanly when switching categories
  useEffect(() => {
    setActiveIndex(0);
    setDirection(1);
    setLightboxIndex(null);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category.slug]);

  const goToSlide = useCallback(
    (targetIdx: number) => {
      if (targetIdx === activeIndex) return;
      const forwardDist = (targetIdx - activeIndex + total) % total;
      const backwardDist = (activeIndex - targetIdx + total) % total;
      setDirection(forwardDist <= backwardDist ? 1 : -1);
      setActiveIndex(targetIdx);
    },
    [activeIndex, total]
  );

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Continuous auto-advance for live animated carousel
  useEffect(() => {
    if (!isPlaying || isPausedByHover || lightboxIndex !== null || prefersReducedMotion || total <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % total);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPlaying, isPausedByHover, lightboxIndex, prefersReducedMotion, total]);

  // Keyboard navigation in fullscreen lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxDirection(1);
        setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % total));
      } else if (e.key === 'ArrowLeft') {
        setLightboxDirection(-1);
        setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + total) % total));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, total]);

  const formatIndex = (num: number) => String(num + 1).padStart(2, '0');

  // Double photos array for seamless infinite continuous marquee reels
  const reelPhotos = [...photos, ...photos, ...photos];

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#3a3532] font-['Lato',sans-serif] font-light pb-24 overflow-x-hidden">
      {/* Top 3-Zone Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#1a1817]/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-14 h-16 md:h-20 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-white/90 hover:text-[#ebd59d] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="hidden md:flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-stone-300 whitespace-nowrap shrink-0">
            <button
              type="button"
              onClick={onBackHome}
              className="font-['Playfair_Display',serif] text-[#ebd59d] hover:text-white transition-colors cursor-pointer"
            >
              NRB DESIGN
            </button>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <span className="text-white font-medium">{category.title} Gallery</span>
          </div>

          <button
            type="button"
            onClick={() => onBookConsultation(category.title)}
            className="inline-flex items-center justify-center bg-[#b3957b] hover:bg-[#c5a46d] text-[#1a1817] font-bold text-[11px] uppercase tracking-[0.14em] px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
          >
            Book a Consultation
          </button>
        </div>

        {/* Category Switcher Ribbon */}
        <div className="border-t border-white/10 bg-[#221f1d]">
          <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-14 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {SHOWCASE_GALLERIES.map((item) => {
              const active = item.slug === category.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => onSelectCategory(item.slug)}
                  className={`relative px-3.5 py-2 rounded-md text-xs tracking-wide whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active ? 'text-[#1a1817] font-bold' : 'text-stone-300 hover:text-white font-normal'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="category-ribbon-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 bg-[#b3957b] rounded-md"
                    />
                  )}
                  <span className="relative z-10">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Dark Architectural Cinematic Theater & 3D Coverflow Stage */}
      <section className="bg-[#161413] text-white pt-10 md:pt-14 pb-14 md:pb-20 overflow-hidden">
        {/* Masked Staggered Editorial Header */}
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-8 md:mb-12">
          <motion.div
            key={`hdr-${category.slug}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            <div className="max-w-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-[#ebd59d] font-semibold">
                <span>Live Animated Showcase</span>
                <span aria-hidden="true" className="text-white/30">
                  ·
                </span>
                <span className="tabular-nums text-stone-300">
                  {formatIndex(photos.length - 1)} Curated Looks
                </span>
              </div>

              <div className="overflow-hidden">
                <motion.h1
                  key={`title-${category.slug}`}
                  initial={prefersReducedMotion ? false : { y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.08] text-balance"
                >
                  {category.title}
                </motion.h1>
              </div>

              <motion.div
                key={`rule-${category.slug}`}
                initial={prefersReducedMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="w-24 h-px bg-[#b3957b] origin-left"
              />

              <p className="font-['Playfair_Display',serif] text-lg md:text-xl text-stone-300 italic">
                {category.subtitle}
              </p>
            </div>

            <p className="text-sm md:text-base text-stone-300/90 leading-relaxed max-w-md">
              {category.overview}
            </p>
          </motion.div>
        </div>

        {/* 3D Coverflow Animated Stage */}
        <div
          onMouseEnter={() => setIsPausedByHover(true)}
          onMouseLeave={() => setIsPausedByHover(false)}
          className="relative max-w-[1440px] mx-auto px-4 md:px-10"
        >
          <div
            className="relative h-[340px] sm:h-[440px] md:h-[540px] flex items-center justify-center"
            style={{ perspective: '1400px' }}
          >
            {/* Left Side 3D Peeking Card (Previous) */}
            {total > 1 && (
              <motion.button
                key={`prev-${category.slug}-${prevIndex}`}
                type="button"
                onClick={handlePrev}
                initial={false}
                animate={
                  prefersReducedMotion
                    ? { x: '-62%', scale: 0.84, opacity: 0.45 }
                    : { x: '-62%', scale: 0.84, rotateY: 20, opacity: 0.45 }
                }
                whileHover={{ opacity: 0.75, scale: 0.87 }}
                transition={{ type: 'spring', stiffness: 210, damping: 26 }}
                className="hidden md:block absolute w-[68%] lg:w-[60%] h-[82%] rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer z-0"
                style={{ transformStyle: 'preserve-3d' }}
                aria-label={`View previous ${category.title} photo`}
              >
                <ImageWithFallback
                  src={photos[prevIndex].url}
                  alt={photos[prevIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
              </motion.button>
            )}

            {/* Right Side 3D Peeking Card (Next) */}
            {total > 1 && (
              <motion.button
                key={`next-${category.slug}-${nextIndex}`}
                type="button"
                onClick={handleNext}
                initial={false}
                animate={
                  prefersReducedMotion
                    ? { x: '62%', scale: 0.84, opacity: 0.45 }
                    : { x: '62%', scale: 0.84, rotateY: -20, opacity: 0.45 }
                }
                whileHover={{ opacity: 0.75, scale: 0.87 }}
                transition={{ type: 'spring', stiffness: 210, damping: 26 }}
                className="hidden md:block absolute w-[68%] lg:w-[60%] h-[82%] rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer z-0"
                style={{ transformStyle: 'preserve-3d' }}
                aria-label={`View next ${category.title} photo`}
              >
                <ImageWithFallback
                  src={photos[nextIndex].url}
                  alt={photos[nextIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
              </motion.button>
            )}

            {/* Active Center Hero Slide with Live Ken Burns Motion */}
            <div className="relative w-full md:w-[74%] lg:w-[66%] h-full rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] border border-white/15 z-10 bg-[#221f1d]">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={`center-${category.slug}-${activeIndex}`}
                  custom={direction}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: direction > 0 ? 110 : -110, scale: 0.94 }
                  }
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: direction > 0 ? -110 : 110, scale: 0.94 }
                  }
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {/* Continuous living Ken Burns camera drift */}
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? false
                        : { scale: 1, x: direction > 0 ? '-1.2%' : '1.2%' }
                    }
                    animate={
                      prefersReducedMotion
                        ? false
                        : { scale: 1.11, x: direction > 0 ? '1.2%' : '-1.2%' }
                    }
                    transition={{ duration: 4.5, ease: 'linear' }}
                    className="w-full h-full"
                  >
                    <ImageWithFallback
                      src={currentPhoto.url}
                      alt={currentPhoto.title}
                      title={currentPhoto.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Measured Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/35 pointer-events-none" />

              {/* Top Overlay Bar: Live Slide Counter + Play/Pause + Expand */}
              <div className="absolute top-4 left-4 right-4 md:top-5 md:left-6 md:right-6 flex items-center justify-between gap-4 z-20">
                <div className="text-xs uppercase tracking-[0.2em] text-white/95 font-semibold tabular-nums">
                  <span className="text-[#ebd59d]">{formatIndex(activeIndex)}</span>
                  <span className="mx-1.5 text-white/40">/</span>
                  <span>{formatIndex(total - 1)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((v) => !v)}
                    className="w-10 h-10 rounded-lg bg-black/55 hover:bg-[#b3957b] text-white hover:text-[#1a1817] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause animated showcase' : 'Play animated showcase'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(activeIndex)}
                    className="w-10 h-10 rounded-lg bg-black/55 hover:bg-[#b3957b] text-white hover:text-[#1a1817] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                    aria-label="Open fullscreen lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Left / Right Controls inside stage */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-[#b3957b] text-white hover:text-[#1a1817] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-[#b3957b] text-white hover:text-[#1a1817] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Caption & Live Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 z-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`cap-${category.slug}-${activeIndex}`}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-1.5 max-w-2xl"
                  >
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#ebd59d] font-semibold">
                      {currentPhoto.finish}
                    </p>
                    <h2 className="font-['Playfair_Display',serif] text-xl sm:text-2xl md:text-3xl font-medium text-white">
                      {currentPhoto.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-200/95 leading-relaxed line-clamp-2">
                      {currentPhoto.caption}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Live Animated Timing Bar */}
                <div className="mt-4 h-[2px] w-full bg-white/20 rounded-full overflow-hidden">
                  {isPlaying && !isPausedByHover && !prefersReducedMotion ? (
                    <motion.div
                      key={`bar-${category.slug}-${activeIndex}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: SLIDE_INTERVAL_MS / 1000, ease: 'linear' }}
                      className="h-full w-full bg-[#ebd59d] origin-left"
                    />
                  ) : (
                    <div className="h-full w-1/3 bg-[#ebd59d]/80 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Selector Strip with Spring Active Frame */}
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            {photos.map((photo, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={`${category.slug}-thumb-${idx}`}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden transition-all cursor-pointer ${
                    isActive ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-85'
                  }`}
                  aria-label={`Jump to ${photo.title}`}
                >
                  <ImageWithFallback
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  {isActive && (
                    <motion.div
                      layoutId="active-stage-thumb-ring"
                      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                      className="absolute inset-0 border-2 border-[#ebd59d] rounded-lg pointer-events-none"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dual-Track Live Moving Filmstrip Reel (Continuous Live Visual Motion) */}
      <section className="py-12 md:py-16 bg-[#eae4dc] border-b border-[#dfd7cc] overflow-hidden reel-track">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-7 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8c735d] font-semibold">
              Continuous Motion Reel
            </p>
            <h2 className="font-['Playfair_Display',serif] text-2xl md:text-3xl text-[#1a1817] mt-1">
              {category.title} In Motion
            </h2>
          </div>
          <p className="text-xs text-stone-600">
            Hover to pause · Click any frame to inspect fullscreen
          </p>
        </div>

        {/* Row 1 — Glides Left */}
        <div className="flex w-max animate-reel-forward mb-4 md:mb-5">
          {[0, 1].map((dup) => (
            <div key={`row1-${dup}`} className="flex gap-4 md:gap-5 pr-4 md:pr-5">
              {reelPhotos.map((photo, idx) => {
                const origIdx = idx % total;
                return (
                  <button
                    key={`r1-${dup}-${idx}`}
                    type="button"
                    onClick={() => setLightboxIndex(origIdx)}
                    className="relative w-[240px] sm:w-[300px] md:w-[340px] aspect-[16/10] shrink-0 rounded-xl overflow-hidden shadow-md group/reel cursor-pointer text-left"
                  >
                    <ImageWithFallback
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover/reel:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover/reel:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <p className="font-['Playfair_Display',serif] text-sm md:text-base font-medium truncate">
                        {photo.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Row 2 — Glides Right */}
        <div className="flex w-max animate-reel-reverse">
          {[0, 1].map((dup) => (
            <div key={`row2-${dup}`} className="flex gap-4 md:gap-5 pr-4 md:pr-5">
              {[...reelPhotos].reverse().map((photo, idx) => {
                const origIdx = (total - 1 - (idx % total) + total) % total;
                return (
                  <button
                    key={`r2-${dup}-${idx}`}
                    type="button"
                    onClick={() => setLightboxIndex(origIdx)}
                    className="relative w-[220px] sm:w-[270px] md:w-[310px] aspect-[16/10] shrink-0 rounded-xl overflow-hidden shadow-md group/reel cursor-pointer text-left"
                  >
                    <ImageWithFallback
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover/reel:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover/reel:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#ebd59d] truncate">
                        {photo.finish}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* Craftsmanship & Material Highlights */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12 pt-14 mb-16">
        <div className="border-y border-[#e3ddd5] py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {category.highlights.map((highlight, idx) => (
            <motion.div
              key={highlight}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-start gap-3"
            >
              <Check className="w-4 h-4 text-[#8c735d] shrink-0 mt-1" />
              <p className="text-sm text-[#3a3532] font-normal leading-snug">{highlight}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive 3D Tilt Bento Gallery Grid */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12 mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8c735d] font-semibold mb-2">
              Interactive Lookbook
            </p>
            <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl text-[#1a1817]">
              {category.title} Looks &amp; Details
            </h2>
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
            Hover to tilt · Click to expand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {photos.map((photo, idx) => (
            <TiltGalleryCard
              key={`${category.slug}-card-${idx}`}
              photo={photo}
              index={idx}
              isLead={idx === 0}
              slug={category.slug}
              prefersReducedMotion={prefersReducedMotion}
              onOpen={() => setLightboxIndex(idx)}
            />
          ))}
        </div>
      </section>

      {/* Bottom Consultation Call to Action */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-12">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#24211f] text-[#f7f5f2] rounded-2xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
        >
          <div className="max-w-xl text-center md:text-left space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[#ebd59d] font-semibold">
              Tailored For Your Home
            </p>
            <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl text-white text-balance">
              Plan your custom {category.title} with NRB DESIGN
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              Share your floor plan and material preferences with Soham and our team for a personalized layout and execution consultation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onBookConsultation(category.title)}
            className="inline-flex items-center gap-2.5 bg-[#b3957b] hover:bg-[#c5a46d] text-[#1a1817] font-bold text-xs uppercase tracking-[0.16em] px-7 py-4 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[46px]"
          >
            <span>Discuss Your {category.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* Animated Fullscreen Lightbox Viewer */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-[#12100f]/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
          >
            <div
              className="flex items-center justify-between text-white gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em]">
                <span className="text-[#ebd59d] font-semibold tabular-nums">
                  {formatIndex(lightboxIndex)} / {formatIndex(total - 1)}
                </span>
                <span aria-hidden="true" className="text-white/30">
                  ·
                </span>
                <span className="text-stone-300 truncate">{photos[lightboxIndex].title}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close fullscreen gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative flex-1 flex items-center justify-center my-4 min-h-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setLightboxDirection(-1);
                  setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + total) % total));
                }}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#b3957b] text-white hover:text-[#1a1817] flex items-center justify-center transition-colors shrink-0 mr-2 md:mr-6 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait" custom={lightboxDirection}>
                <motion.div
                  key={`lb-${lightboxIndex}`}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, x: lightboxDirection > 0 ? 60 : -60, scale: 0.96 }
                  }
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, x: lightboxDirection > 0 ? -60 : 60, scale: 0.96 }
                  }
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-5xl max-h-[70vh] w-full h-full flex items-center justify-center"
                >
                  <ImageWithFallback
                    src={photos[lightboxIndex].url}
                    alt={photos[lightboxIndex].title}
                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                  />
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => {
                  setLightboxDirection(1);
                  setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % total));
                }}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#b3957b] text-white hover:text-[#1a1817] flex items-center justify-center transition-colors shrink-0 ml-2 md:ml-6 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div
              className="max-w-3xl mx-auto text-center text-white space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#ebd59d]">
                  {photos[lightboxIndex].finish}
                </p>
                <p className="text-sm text-stone-300">{photos[lightboxIndex].caption}</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                {photos.map((p, idx) => (
                  <button
                    key={`lb-dot-${idx}`}
                    type="button"
                    onClick={() => {
                      setLightboxDirection(idx >= lightboxIndex ? 1 : -1);
                      setLightboxIndex(idx);
                    }}
                    className={`relative w-12 h-9 rounded-md overflow-hidden transition-opacity cursor-pointer ${
                      idx === lightboxIndex ? 'opacity-100' : 'opacity-45 hover:opacity-80'
                    }`}
                    aria-label={`View ${p.title}`}
                  >
                    <ImageWithFallback
                      src={p.url}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    {idx === lightboxIndex && (
                      <motion.span
                        layoutId="lb-active-ring"
                        className="absolute inset-0 border-2 border-[#ebd59d] rounded-md pointer-events-none"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
