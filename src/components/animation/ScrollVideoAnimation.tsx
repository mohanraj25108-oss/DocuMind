import React, { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 270;
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 720;

export const ScrollVideoAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // 1. Preload all 270 frames
  useEffect(() => {
    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let count = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const padIndex = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${padIndex}.jpg`;

      img.onload = () => {
        if (isCancelled) return;
        count++;
        setLoadedCount(count);

        if (i === 1) {
          // As soon as the first frame is ready, draw it immediately
          setIsReady(true);
        }
      };

      loadedImages[i - 1] = img;
    }

    imagesRef.current = loadedImages;

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Canvas drawing function with high-DPI and aspect-ratio cover
  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Fallback: search backwards for nearest loaded frame
      for (let f = frameIndex - 1; f >= 0; f--) {
        const fallbackImg = imagesRef.current[f];
        if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth > 0) {
          drawScaledImage(ctx, canvas, fallbackImg);
          return;
        }
      }
      return;
    }

    drawScaledImage(ctx, canvas, img);
  };

  const drawScaledImage = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgRatio = FRAME_WIDTH / FRAME_HEIGHT;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    // Cover: fill entire viewport with no empty borders
    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // 3. Resize listener with High-DPI support
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      renderFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isReady]);

  // 4. Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollFraction = Math.max(0, Math.min(1, window.scrollY / scrollHeight));
      const targetIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(scrollFraction * TOTAL_FRAMES));
      targetFrameRef.current = targetIndex;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 5. Smooth animation loop with requestAnimationFrame interpolation
  useEffect(() => {
    const loop = () => {
      // Lerp for butter-smooth transition between frames
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.25;
        renderFrame(Math.round(currentFrameRef.current));
      }

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Initial draw when ready
  useEffect(() => {
    if (isReady) {
      renderFrame(0);
    }
  }, [isReady]);

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-black">
      {/* Sticky Fullscreen Canvas */}
      <div className="sticky top-0 left-0 w-screen h-screen overflow-hidden flex items-center justify-center bg-black">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block"
          style={{ width: '100vw', height: '100vh' }}
        />

        {/* Minimal loading indicator until initial frames are cached */}
        {!isReady && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50">
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

