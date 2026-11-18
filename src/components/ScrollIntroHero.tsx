import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface ScrollIntroHeroProps {
  onBookConsultation: () => void;
  onExploreCalculator: () => void;
}

const TOTAL_FRAMES = 105; // Frames 001..105 cover the complete bare-room to finished-room transformation

const getFrameSrc = (index: number): string => {
  const num = String(index + 1).padStart(3, '0');
  return `/intro-frames/frame_${num}.webp`;
};

const STAGES = [
  { threshold: 0, code: '01', label: 'Bare Shell & Daylight' },
  { threshold: 0.25, code: '02', label: 'Walls, Panelling & False Ceiling' },
  { threshold: 0.52, code: '03', label: 'Marble Feature Wall & Joinery' },
  { threshold: 0.78, code: '04', label: 'Furniture, Lighting & Final Styling' },
];

export const ScrollIntroHero: React.FC<ScrollIntroHeroProps> = ({
  onBookConsultation,
  onExploreCalculator,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const currentFrameRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  const [uiProgress, setUiProgress] = useState<number>(0);
  const [firstFrameReady, setFirstFrameReady] = useState<boolean>(false);

  // Draw a specific frame with crisp object-cover aspect-ratio math
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pick requested frame or nearest loaded frame so scrubbing never flashes blank
    let chosenIndex = frameIndex;
    if (!loadedRef.current[chosenIndex]) {
      let bestDist = Infinity;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (loadedRef.current[i]) {
          const dist = Math.abs(i - frameIndex);
          if (dist < bestDist) {
            bestDist = dist;
            chosenIndex = i;
          }
        }
      }
    }

    const img = imagesRef.current[chosenIndex];
    if (!img || !loadedRef.current[chosenIndex] || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawW = width;
    let drawH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawW = width;
      drawH = width / imgRatio;
      offsetY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgRatio;
      offsetX = (width - drawW) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  };

  // Progressive keyframe-first preloading + resize observer
  useEffect(() => {
    let cancelled = false;

    const loadFrame = (idx: number) => {
      if (imagesRef.current[idx]) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = getFrameSrc(idx);
      imagesRef.current[idx] = img;
      img.onload = () => {
        if (cancelled) return;
        loadedRef.current[idx] = true;
        if (idx === 0) {
          setFirstFrameReady(true);
          drawFrame(currentFrameRef.current);
        } else if (Math.abs(idx - currentFrameRef.current) <= 4) {
          drawFrame(currentFrameRef.current);
        }
      };
    };

    // Pass 1: Load frame 0 + coarse keyframes (every 8th frame) immediately
    loadFrame(0);
    for (let i = 0; i < TOTAL_FRAMES; i += 8) {
      loadFrame(i);
    }
    loadFrame(TOTAL_FRAMES - 1);

    // Pass 2: Fill intermediate frames in gentle batches so scroll scrubbing is ultra-dense
    const remaining: number[] = [];
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      if (i % 8 !== 0 && i !== TOTAL_FRAMES - 1) remaining.push(i);
    }

    let cursor = 0;
    const batchTimer = window.setInterval(() => {
      if (cancelled || cursor >= remaining.length) {
        window.clearInterval(batchTimer);
        return;
      }
      const end = Math.min(cursor + 8, remaining.length);
      for (let j = cursor; j < end; j++) {
        loadFrame(remaining[j]);
      }
      cursor = end;
    }, 60);

    const canvas = canvasRef.current;
    const resizeObserver = canvas
      ? new ResizeObserver(() => {
          drawFrame(currentFrameRef.current);
        })
      : null;
    if (canvas && resizeObserver) {
      resizeObserver.observe(canvas);
    }

    return () => {
      cancelled = true;
      window.clearInterval(batchTimer);
      resizeObserver?.disconnect();
    };
  }, []);

  // Scroll listener + damped RAF interpolation loop
  useEffect(() => {
    let rafId = 0;
    let lastUiUpdate = 0;

    const updateTargetFromScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollable = Math.max(1, container.offsetHeight - window.innerHeight);
      const raw = -rect.top / scrollable;
      targetProgressRef.current = Math.max(0, Math.min(1, raw));
    };

    const tick = (now: number) => {
      const target = targetProgressRef.current;
      const prev = currentProgressRef.current;
      const diff = target - prev;

      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current = prev + diff * 0.16;
      } else {
        currentProgressRef.current = target;
      }

      const nextFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)))
      );

      if (nextFrame !== currentFrameRef.current) {
        currentFrameRef.current = nextFrame;
        drawFrame(nextFrame);
      }

      if (now - lastUiUpdate > 50) {
        lastUiUpdate = now;
        setUiProgress(currentProgressRef.current);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    updateTargetFromScroll();
    window.addEventListener('scroll', updateTargetFromScroll, { passive: true });
    window.addEventListener('resize', updateTargetFromScroll, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', updateTargetFromScroll);
      window.removeEventListener('resize', updateTargetFromScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const activeStage =
    [...STAGES].reverse().find((s) => uiProgress >= s.threshold) || STAGES[0];

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-[270vh] md:h-[300vh] bg-[#1a1817]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Instant base frame so first paint never shows a blank screen */}
        <img
          src={getFrameSrc(0)}
          alt="NRB DESIGN Living Space Transformation"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            firstFrameReady ? 'opacity-100' : 'opacity-95'
          }`}
        />

        {/* High-DPI Scroll-Scrubbed Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          aria-hidden="true"
        />

        {/* Left & Bottom Edge Contrast Scrims (leaves center & right room open and bright) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35 pointer-events-none" />

        {/* Editorial Left-Aligned Hero Overlay */}
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-end md:justify-center pb-28 md:pb-10">
          <div className="max-w-md lg:max-w-lg space-y-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#ebd59d] font-bold">
              NRB DESIGN · KOLKATA
            </p>

            <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-[58px] font-medium leading-[1.08] tracking-tight text-white text-balance">
              Artistry around your life.
            </h1>

            <p className="text-sm sm:text-base text-stone-200/95 leading-relaxed max-w-md font-light">
              Your design best friend. Thoughtfully planned residential interiors, bespoke cabinetry, and turnkey execution built around the way you live.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onBookConsultation}
                className="inline-flex items-center justify-center bg-[#b3957b] hover:bg-[#c5a46d] text-[#1a1817] font-bold text-xs uppercase tracking-[0.16em] px-6 py-3.5 rounded-lg transition-colors cursor-pointer min-h-[46px] shadow-lg"
              >
                Book a Consultation
              </button>

              <button
                type="button"
                onClick={onExploreCalculator}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-white/95 hover:text-[#ebd59d] px-3 py-3 transition-colors cursor-pointer"
              >
                <span>Plan Your Budget</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Transformation Progress & Hint */}
        <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 lg:left-16 lg:right-16 z-10 flex items-end justify-between gap-4 pointer-events-none">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-stone-200 font-semibold">
              <span className="text-[#ebd59d] tabular-nums">{activeStage.code}</span>
              <span className="text-white/40">/</span>
              <span>{activeStage.label}</span>
            </div>
            <div className="w-44 sm:w-64 h-[2px] bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ebd59d] transition-[width] duration-75"
                style={{ width: `${Math.max(4, Math.round(uiProgress * 100))}%` }}
              />
            </div>
          </div>

          <div
            className={`hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/90 font-medium transition-opacity duration-500 ${
              uiProgress > 0.85 ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span>Scroll to transform</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#ebd59d] animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
