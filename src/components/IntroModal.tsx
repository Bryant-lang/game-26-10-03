import React, { useState, useEffect, useRef } from 'react';

interface IntroModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const STORAGE_KEY = 'atelier_intro_seen_v1';

export const IntroModal: React.FC<IntroModalProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [showStoryDossier, setShowStoryDossier] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const TOTAL_DURATION = 9500; // 9.5 seconds full cinematic

  // Check first load on mount
  useEffect(() => {
    if (controlledIsOpen !== undefined) return;
    try {
      const hasSeen = localStorage.getItem(STORAGE_KEY);
      if (!hasSeen) {
        setInternalIsOpen(true);
      }
    } catch {
      setInternalIsOpen(true);
    }
  }, [controlledIsOpen]);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore storage error
    }
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  // Sound synthesizer for crisp mechanical drafting clicks
  const playClickSound = (freq = 800) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext policy
    }
  };

  // Fullscreen Canvas Architectural Drafting Animation
  useEffect(() => {
    if (!isOpen) {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localStartTime: number | null = null;

    const render = (timestamp: number) => {
      if (!localStartTime) localStartTime = timestamp - progress * TOTAL_DURATION;
      startTimeRef.current = localStartTime;

      const elapsed = timestamp - localStartTime;
      const currentProgress = Math.min(elapsed / TOTAL_DURATION, 1);
      setProgress(currentProgress);

      // Auto-show story dossier towards the end if not yet shown
      if (currentProgress >= 0.98 && !showStoryDossier) {
        setShowStoryDossier(true);
      }

      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Background: Pure Architectural Paper White
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 2. Fullscreen Architectural Grid & Coordinate Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Outer border guidelines
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      const margin = 24;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      // Corner technical crosshairs
      const crossSize = 14;
      const drawCross = (cx: number, cy: number) => {
        ctx.beginPath();
        ctx.moveTo(cx - crossSize, cy);
        ctx.lineTo(cx + crossSize, cy);
        ctx.moveTo(cx, cy - crossSize);
        ctx.lineTo(cx, cy + crossSize);
        ctx.stroke();
      };
      drawCross(margin, margin);
      drawCross(width - margin, margin);
      drawCross(margin, height - margin);
      drawCross(width - margin, height - margin);

      // ----------------------------------------------------
      // PHASE 1 (0.0 - 0.35): THE VOID & INK CROSSHAIRS
      // ----------------------------------------------------
      if (currentProgress < 0.4) {
        const p1 = Math.min(currentProgress / 0.35, 1);

        // Fullscreen dynamic tracking crosshairs
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        const hSpan = (1 - p1) * (width * 0.45);
        ctx.beginPath();
        ctx.moveTo(centerX - hSpan - 60, centerY);
        ctx.lineTo(centerX + hSpan + 60, centerY);
        ctx.stroke();

        const vSpan = (1 - p1) * (height * 0.45);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - vSpan - 60);
        ctx.lineTo(centerX, centerY + vSpan + 60);
        ctx.stroke();

        // Pulsing compass rings
        const r1 = p1 * Math.min(width, height) * 0.22;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Central ink drop
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3 + p1 * 7, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Centered Chapter Title
        ctx.font = 'bold 18px "Playfair Display", Georgia, serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText('ACTE I : LE VIDE PRIMITIF', centerX, centerY + r1 + 45);
        ctx.font = '14px "Source Serif 4", Georgia, serif';
        ctx.fillStyle = '#525252';
        ctx.fillText('「起初，紙面唯有一片無垠的虛白。」', centerX, centerY + r1 + 70);
      }

      // ----------------------------------------------------
      // PHASE 2 (0.3 - 0.72): DRAFTING COMPASS, GOLDEN RATIO & WIREFRAME CUBE
      // ----------------------------------------------------
      if (currentProgress >= 0.28 && currentProgress < 0.76) {
        const p2 = (currentProgress - 0.28) / 0.44;
        const outerR = Math.min(width, height) * 0.28;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;

        // Drafting Compass Circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerR, 0, p2 * Math.PI * 2);
        ctx.stroke();

        // 24 Radial tick marks
        for (let i = 0; i < 24; i++) {
          const tAngle = (i / 24) * Math.PI * 2;
          if (tAngle <= p2 * Math.PI * 2) {
            const x1 = centerX + Math.cos(tAngle) * (outerR - 8);
            const y1 = centerY + Math.sin(tAngle) * (outerR - 8);
            const x2 = centerX + Math.cos(tAngle) * (outerR + 8);
            const y2 = centerY + Math.sin(tAngle) * (outerR + 8);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }

        // Golden Ratio Logarithmic Spiral across full screen
        ctx.beginPath();
        for (let t = 0; t < p2 * 7 * Math.PI; t += 0.08) {
          const r = Math.pow(1.16, t) * 5;
          const sx = centerX + Math.cos(t + p2 * Math.PI) * r;
          const sy = centerY + Math.sin(t + p2 * Math.PI) * r;
          if (t === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.stroke();

        // 3D Isometric Rotating Drafting Cube
        const cubeBase = Math.min(width, height) * 0.12;
        const cubeSize = cubeBase * Math.sin(p2 * Math.PI);
        const rot = p2 * 1.2;

        const isoX = (x: number, y: number, z: number) =>
          centerX + (x * Math.cos(rot) - z * Math.sin(rot)) * 0.866;
        const isoY = (x: number, y: number, z: number) =>
          centerY + (x * Math.sin(rot) + z * Math.cos(rot)) * 0.5 - y;

        const v = [
          [-cubeSize, -cubeSize, -cubeSize],
          [cubeSize, -cubeSize, -cubeSize],
          [cubeSize, cubeSize, -cubeSize],
          [-cubeSize, cubeSize, -cubeSize],
          [-cubeSize, -cubeSize, cubeSize],
          [cubeSize, -cubeSize, cubeSize],
          [cubeSize, cubeSize, cubeSize],
          [-cubeSize, cubeSize, cubeSize],
        ];

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        edges.forEach(([i, j]) => {
          const [x1, y1, z1] = v[i];
          const [x2, y2, z2] = v[j];
          ctx.beginPath();
          ctx.moveTo(isoX(x1, y1, z1), isoY(x1, y1, z1));
          ctx.lineTo(isoX(x2, y2, z2), isoY(x2, y2, z2));
          ctx.stroke();
        });

        // Centered Chapter Title
        ctx.font = 'bold 18px "Playfair Display", Georgia, serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText('ACTE II : LE TRAIT ET LA GÉOMÉTRIE', centerX, centerY + outerR + 40);
        ctx.font = '14px "Source Serif 4", Georgia, serif';
        ctx.fillStyle = '#525252';
        ctx.fillText('「規尺落定，線條交織成思緒的幾何殿堂。」', centerX, centerY + outerR + 65);
      }

      // ----------------------------------------------------
      // PHASE 3 (0.68 - 1.0): MONUMENTAL MANIFESTATION
      // ----------------------------------------------------
      if (currentProgress >= 0.65) {
        const p3 = (currentProgress - 0.65) / 0.35;

        // Monumental Frame Box
        const baseBoxW = Math.min(width * 0.75, 460);
        const baseBoxH = 170;
        const currentW = baseBoxW * Math.min(p3 * 1.4, 1);
        const currentH = baseBoxH * Math.min(p3 * 1.4, 1);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeRect(centerX - currentW / 2, centerY - currentH / 2, currentW, currentH);

        // Inner hairline border
        if (p3 > 0.25) {
          ctx.lineWidth = 1;
          ctx.strokeRect(centerX - currentW / 2 + 8, centerY - currentH / 2 + 8, currentW - 16, currentH - 16);
        }

        // Fullscreen Radial Particle Shockwaves
        if (p3 > 0.3) {
          const burstProg = (p3 - 0.3) / 0.7;
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          const numRays = 32;
          for (let r = 0; r < numRays; r++) {
            const rayAngle = (r / numRays) * Math.PI * 2;
            const startDist = Math.max(currentW, currentH) * 0.55;
            const endDist = startDist + burstProg * (Math.min(width, height) * 0.35);
            ctx.beginPath();
            ctx.moveTo(centerX + Math.cos(rayAngle) * startDist, centerY + Math.sin(rayAngle) * startDist);
            ctx.lineTo(centerX + Math.cos(rayAngle) * endDist, centerY + Math.sin(rayAngle) * endDist);
            ctx.stroke();
          }
        }

        // Monumental Typography Reveal
        if (p3 > 0.2) {
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000000';

          const titleSize = Math.min(width * 0.08, 48);
          ctx.font = `900 ${titleSize}px "Playfair Display", Georgia, serif`;
          ctx.fillText('靈感工坊', centerX, centerY - 10);

          ctx.font = 'bold 13px "JetBrains Mono", monospace';
          ctx.fillText("ATELIER D'INSPIRATION · MMXXVI", centerX, centerY + 28);

          ctx.font = 'italic 12px "Source Serif 4", Georgia, serif';
          ctx.fillStyle = '#525252';
          ctx.fillText('ARCHITECTURAL INCREMENTAL ENGINE', centerX, centerY + 50);
        }

        // Core Thesis Epigraph
        if (p3 > 0.6) {
          ctx.font = 'italic 16px "Source Serif 4", Georgia, serif';
          ctx.fillStyle = '#000000';
          ctx.fillText('« De la page blanche naît l\'édifice perpétuel. »', centerX, centerY + 130);
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#525252';
          ctx.fillText('從虛白之紙，築起思維的不朽神殿', centerX, centerY + 155);
        }
      }

      ctx.restore();

      if (currentProgress < 1 && isPlaying) {
        animationFrameId.current = requestAnimationFrame(render);
      }
    };

    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(render);
    }

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isOpen, isPlaying, progress, showStoryDossier]);

  // Handle Keyboard shortcuts (Esc/Enter to dismiss or toggle)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      } else if (e.key === 'Enter') {
        if (!showStoryDossier) {
          setShowStoryDossier(true);
        } else {
          handleDismiss();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showStoryDossier]);

  const handleReplay = () => {
    setProgress(0);
    setIsPlaying(true);
    setShowStoryDossier(false);
    startTimeRef.current = null;
    playClickSound(1200);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    playClickSound(800);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="全螢幕開場序幕與故事背景"
      className="fixed inset-0 z-50 w-screen h-screen bg-white text-black overflow-hidden flex flex-col justify-between select-none"
    >
      {/* 1. Fullscreen Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-crosshair z-0"
      />

      {/* 2. Top Architectural HUD Navigation Bar */}
      <header className="relative z-10 w-full p-4 sm:p-6 flex justify-between items-center bg-white/80 backdrop-blur-none border-b border-black">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#525252]">
          <span className="font-bold text-black border border-black px-1.5 py-0.5 bg-black text-white">
            PROLOGUE
          </span>
          <span className="hidden sm:inline">ATELIER D'INSPIRATION</span>
          <span>/</span>
          <span>CINÉMATIQUE PLEIN ÉCRAN</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs uppercase">
          <button
            type="button"
            onClick={() => setShowStoryDossier((prev) => !prev)}
            className="px-3 py-1.5 border border-black bg-white hover:bg-black hover:text-white transition-none cursor-pointer font-bold"
          >
            {showStoryDossier ? 'MASQUER LE TEXTE ✕' : 'LIRE LE DOSSIER / 閱讀史冊 📖'}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-1.5 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-none cursor-pointer font-bold tracking-wider"
          >
            PASSER L'INTRO / 跳過 [ ESC ] →
          </button>
        </div>
      </header>

      {/* 3. Center Narrative Story Overlay (When toggled or at conclusion) */}
      {showStoryDossier && (
        <div className="relative z-20 my-auto mx-auto w-full max-w-2xl px-4 py-6 max-h-[75vh] overflow-y-auto">
          <div className="bg-[#FFFFFF] border-4 border-black p-6 sm:p-10 shadow-none text-center">
            {/* Corner Crosshairs */}
            <div className="border border-black p-6 sm:p-8 relative">
              <span className="absolute top-2 left-2 font-mono text-xs text-[#525252]">+</span>
              <span className="absolute top-2 right-2 font-mono text-xs text-[#525252]">+</span>
              <span className="absolute bottom-2 left-2 font-mono text-xs text-[#525252]">+</span>
              <span className="absolute bottom-2 right-2 font-mono text-xs text-[#525252]">+</span>

              <div className="font-mono text-[10px] tracking-widest uppercase text-[#525252] mb-2">
                ORIGINE & HISTOIRE // VOL. 01
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mb-1">
                靈感工坊
              </h2>
              <div className="font-mono text-xs uppercase text-[#525252] mb-4">
                ATELIER D'INSPIRATION · MMXXVI
              </div>

              <blockquote className="font-serif italic text-sm text-[#525252] border-y border-black py-2 mb-4">
                « De la page blanche naît l'édifice perpétuel. »
                <span className="block text-xs font-normal not-italic text-[#737373] mt-0.5 font-mono">
                  — 從虛白之紙，築起思維的不朽神殿
                </span>
              </blockquote>

              <div className="space-y-3 text-left sm:text-center text-xs sm:text-sm leading-relaxed text-[#171717] font-serif mb-6">
                <p>
                  在第一道墨痕劃破虛空之前，世間唯有一片無垠的特級羊皮棉紙與深沉的靜默。沒有坐標，沒有規尺，亦沒有時間的流淌。
                </p>
                <p>
                  創作者懸腕於虛白之上，將意志化作指尖的第一記扣擊——剎那間，黑墨落定，幾何的秩序自混沌中破土而出；線條交織成立柱，圓規劃出天頂，齒輪與心流在黑白交錯的律動中轟然共振。
                </p>
                <p className="font-semibold text-black">
                  向虛無索取存在的永恆營造。現在，執起你的規尺與刻刀，奠定這座由靈感鑄就的理性帝國。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="bg-black text-white hover:bg-white hover:text-black border-2 border-black font-mono text-xs sm:text-sm font-bold uppercase tracking-widest py-3 px-8 transition-none cursor-pointer w-full sm:w-auto"
                >
                  ENTRER DANS L'ATELIER · 步入工坊 →
                </button>
                <button
                  type="button"
                  onClick={handleReplay}
                  className="bg-white text-black hover:bg-black hover:text-white border-2 border-black font-mono text-xs font-bold uppercase tracking-wider py-3 px-5 transition-none cursor-pointer w-full sm:w-auto"
                >
                  ↺ REJOUER / 重播動畫
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Controls & Timeline Bar */}
      <footer className="relative z-10 w-full p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/80 backdrop-blur-none border-t border-black font-mono text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="px-3 py-1.5 border border-black bg-white hover:bg-black hover:text-white transition-none cursor-pointer uppercase font-bold"
          >
            {isPlaying ? '⏸ PAUSE' : '▶ LECTURE'}
          </button>
          <button
            type="button"
            onClick={handleReplay}
            className="px-3 py-1.5 border border-black bg-white hover:bg-black hover:text-white transition-none cursor-pointer uppercase font-bold"
          >
            ↺ REJOUER
          </button>
          <span className="text-[#525252] text-[11px] ml-1">
            CODE : {(progress * 9.5).toFixed(1)}S / 9.5S
          </span>
        </div>

        {/* Live Timeline Line */}
        <div className="w-full sm:w-1/3 h-1.5 bg-black/10 border border-black overflow-hidden">
          <div
            className="h-full bg-black transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#525252]">
          <span>PHASE : {progress < 0.35 ? '01 / LE VIDE' : progress < 0.7 ? '02 / LE TRAIT' : '03 / LE MONUMENT'}</span>
          <span>·</span>
          <span className="font-bold text-black uppercase">FULLSCREEN 100VW</span>
        </div>
      </footer>
    </div>
  );
};
