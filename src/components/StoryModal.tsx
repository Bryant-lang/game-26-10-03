import React, { useState, useEffect, useRef } from 'react';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'cinematic' | 'lore'>('cinematic');
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 1
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const TOTAL_DURATION = 9000; // 9 seconds animation

  // Sound effect synthesizer (subtle mechanical click via Web Audio API)
  const playMechanicalClick = (freq = 800) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext may be restricted by browser policy
    }
  };

  // Canvas Architectural Drafting Animation Loop
  useEffect(() => {
    if (!isOpen || activeTab !== 'cinematic') {
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

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Background: Pure White
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // ----------------------------------------------------
      // LAYER 1: ARCHITECTURAL DRAFTING GRID (Subtle Lines)
      // ----------------------------------------------------
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';

      const gridSize = 32;
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

      // Corner technical marks
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      const markLen = 12;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(16, 16 + markLen);
      ctx.lineTo(16, 16);
      ctx.lineTo(16 + markLen, 16);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(width - 16 - markLen, 16);
      ctx.lineTo(width - 16, 16);
      ctx.lineTo(width - 16, 16 + markLen);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(16, height - 16 - markLen);
      ctx.lineTo(16, height - 16);
      ctx.lineTo(16 + markLen, height - 16);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(width - 16 - markLen, height - 16);
      ctx.lineTo(width - 16, height - 16);
      ctx.lineTo(width - 16, height - 16 - markLen);
      ctx.stroke();

      // Technical coordinates watermark
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#525252';
      ctx.textAlign = 'left';
      ctx.fillText(`ATELIER DRAFTING // LAT: 25.0330° N / LON: 121.5654° E`, 24, 28);
      ctx.textAlign = 'right';
      ctx.fillText(`T+${(currentProgress * 9).toFixed(2)}S · PH. ${currentProgress < 0.33 ? '01_VIDE' : currentProgress < 0.66 ? '02_TRAIT' : '03_MONUMENT'}`, width - 24, 28);

      // ----------------------------------------------------
      // PHASE 1 (0.0 - 0.35): THE VOID & THE INK POINT (虛空與墨跡)
      // ----------------------------------------------------
      if (currentProgress < 0.4) {
        const p1 = Math.min(currentProgress / 0.35, 1);

        // Crosshairs tracking into center
        const crosshairDist = (1 - p1) * (width * 0.4);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        // Horizontal hairline
        ctx.beginPath();
        ctx.moveTo(centerX - crosshairDist - 40, centerY);
        ctx.lineTo(centerX + crosshairDist + 40, centerY);
        ctx.stroke();

        // Vertical hairline
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - crosshairDist - 40);
        ctx.lineTo(centerX, centerY + crosshairDist + 40);
        ctx.stroke();

        // Expanding concentric compass pulses
        const radius = p1 * 90;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Central ink droplet point
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3 + p1 * 5, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Typographic Subtitle
        ctx.font = '12px "Source Serif 4", Georgia, serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText('「起初，紙面唯有一片無垠的虛白。」', centerX, centerY + 80);
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#737373';
        ctx.fillText('ACTE I : LE VIDE PRIMITIF', centerX, centerY + 100);
      }

      // ----------------------------------------------------
      // PHASE 2 (0.3 - 0.7): THE COMPASS, CUBE & GOLDEN RATIO (規矩與立方體)
      // ----------------------------------------------------
      if (currentProgress >= 0.25 && currentProgress < 0.75) {
        const p2 = (currentProgress - 0.25) / 0.45;

        // Rotating Drafting Geometric Compass
        const angle = p2 * Math.PI * 2;
        const outerR = 120;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;

        // Main drafting circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerR, 0, p2 * Math.PI * 2);
        ctx.stroke();

        // Degree ticks on circle
        for (let i = 0; i < 12; i++) {
          const tickAngle = (i / 12) * Math.PI * 2;
          if (tickAngle <= p2 * Math.PI * 2) {
            const x1 = centerX + Math.cos(tickAngle) * (outerR - 6);
            const y1 = centerY + Math.sin(tickAngle) * (outerR - 6);
            const x2 = centerX + Math.cos(tickAngle) * (outerR + 6);
            const y2 = centerY + Math.sin(tickAngle) * (outerR + 6);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }

        // Isometric 3D Drafting Cube Wireframe
        const cubeSize = 50 * Math.sin(p2 * Math.PI);
        const rot = p2 * 0.5;

        const isoX = (x: number, y: number, z: number) =>
          centerX + (x * Math.cos(rot) - z * Math.sin(rot)) * 0.866;
        const isoY = (x: number, y: number, z: number) =>
          centerY + (x * Math.sin(rot) + z * Math.cos(rot)) * 0.5 - y;

        const vertices = [
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
          [0, 1], [1, 2], [2, 3], [3, 0], // Back Face
          [4, 5], [5, 6], [6, 7], [7, 4], // Front Face
          [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
        ];

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        edges.forEach(([i, j]) => {
          const [x1, y1, z1] = vertices[i];
          const [x2, y2, z2] = vertices[j];
          ctx.beginPath();
          ctx.moveTo(isoX(x1, y1, z1), isoY(x1, y1, z1));
          ctx.lineTo(isoX(x2, y2, z2), isoY(x2, y2, z2));
          ctx.stroke();
        });

        // Golden Ratio Spiral Line
        ctx.beginPath();
        for (let t = 0; t < p2 * 6 * Math.PI; t += 0.1) {
          const r = Math.pow(1.15, t) * 4;
          const sx = centerX + Math.cos(t + angle) * r;
          const sy = centerY + Math.sin(t + angle) * r;
          if (t === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.stroke();

        // Typographic Subtitle
        ctx.font = '12px "Source Serif 4", Georgia, serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText('「規尺落定，線條交織成思緒的幾何建築。」', centerX, centerY + 110);
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#737373';
        ctx.fillText('ACTE II : LE TRAIT ET LA STRUCTURE', centerX, centerY + 130);
      }

      // ----------------------------------------------------
      // PHASE 3 (0.65 - 1.0): THE MONUMENT & THE SPARK (豐碑凝結與靈感誕生)
      // ----------------------------------------------------
      if (currentProgress >= 0.6) {
        const p3 = (currentProgress - 0.6) / 0.4;

        // Monumental Frame Snapping In
        const frameW = 280;
        const frameH = 130;
        const currentW = frameW * Math.min(p3 * 1.5, 1);
        const currentH = frameH * Math.min(p3 * 1.5, 1);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - currentW / 2, centerY - currentH / 2, currentW, currentH);

        // Thin inner secondary rule
        if (p3 > 0.3) {
          ctx.lineWidth = 1;
          ctx.strokeRect(centerX - currentW / 2 + 6, centerY - currentH / 2 + 6, currentW - 12, currentH - 12);
        }

        // Particle Burst Lines emanating from borders
        if (p3 > 0.4) {
          const burstProgress = (p3 - 0.4) / 0.6;
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          for (let b = 0; b < 16; b++) {
            const bAngle = (b / 16) * Math.PI * 2;
            const startDist = 150;
            const endDist = 150 + burstProgress * 60;
            ctx.beginPath();
            ctx.moveTo(centerX + Math.cos(bAngle) * startDist, centerY + Math.sin(bAngle) * startDist);
            ctx.lineTo(centerX + Math.cos(bAngle) * endDist, centerY + Math.sin(bAngle) * endDist);
            ctx.stroke();
          }
        }

        // Monument Typography
        if (p3 > 0.25) {
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
          ctx.fillText('靈感工坊', centerX, centerY - 6);

          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.fillText("ATELIER D'INSPIRATION", centerX, centerY + 24);

          ctx.font = 'italic 10px "Source Serif 4", Georgia, serif';
          ctx.fillStyle = '#525252';
          ctx.fillText('MMXXVI · ARCHITECTURAL ENGINE', centerX, centerY + 42);
        }

        // Final Thesis
        if (p3 > 0.7) {
          ctx.font = '12px "Source Serif 4", Georgia, serif';
          ctx.fillStyle = '#000000';
          ctx.fillText('「從虛白之紙，築不朽之廈。」', centerX, centerY + 110);
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#525252';
          ctx.fillText("DE LA PAGE BLANCHE NAÎT L'ÉDIFICE PERPÉTUEL.", centerX, centerY + 130);
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
  }, [isOpen, activeTab, isPlaying, progress]);

  // Restart Animation
  const handleReplay = () => {
    setProgress(0);
    setIsPlaying(true);
    startTimeRef.current = null;
    playMechanicalClick(1200);
  };

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    playMechanicalClick(900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-none p-3 sm:p-6">
      <div className="bg-[#FFFFFF] border-4 border-black w-full max-w-4xl shadow-none text-black flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header Masthead */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-black p-4 bg-[#FFFFFF]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block">
              DOSSIER ARCHITECTURAL · ARCHIVES OFFICIELLES
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-black flex items-center gap-2">
              <span>工坊創立原點與序章動畫</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 mt-3 sm:mt-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('cinematic')}
              className={`px-3 py-1.5 border-2 border-black transition-none cursor-pointer uppercase ${
                activeTab === 'cinematic' ? 'bg-black text-white font-bold' : 'bg-white text-black hover:bg-[#F5F5F5]'
              }`}
            >
              [ 序章動畫 CINÉMATIQUE ]
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lore')}
              className={`px-3 py-1.5 border-2 border-black transition-none cursor-pointer uppercase ${
                activeTab === 'lore' ? 'bg-black text-white font-bold' : 'bg-white text-black hover:bg-[#F5F5F5]'
              }`}
            >
              [ 故事史冊 HISTOIRE ]
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white transition-none cursor-pointer uppercase font-bold"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab 1: Cinematic Drafting Animation */}
        {activeTab === 'cinematic' && (
          <div className="flex flex-col flex-1 overflow-hidden bg-white">
            {/* Canvas Viewport */}
            <div className="relative w-full h-[360px] sm:h-[460px] bg-white border-b-2 border-black flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-full block cursor-crosshair"
              />

              {/* Progress bar line right above control bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10">
                <div
                  className="h-full bg-black transition-none"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            {/* Animation Controls Ribbon */}
            <div className="p-3 sm:p-4 bg-[#F5F5F5] flex flex-wrap justify-between items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
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
                  ↺ REJOUER / 重播
                </button>
                <span className="text-[#525252] text-[11px] ml-2">
                  DURÉE : {(progress * 9).toFixed(1)}S / 9.0S
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('lore')}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-black hover:text-white transition-none cursor-pointer uppercase font-bold"
                >
                  LIRE LE DOSSIER ÉCRIT →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Story & Lore Dossier */}
        {activeTab === 'lore' && (
          <div className="p-4 sm:p-8 overflow-y-auto max-h-[70vh] custom-scrollbar bg-white font-serif">
            {/* Editorial Kicker */}
            <div className="border-b-2 border-black pb-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
                ORIGINES DE LA CRÉATION MONOCHROME
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1">
                從虛白之紙，築起思維的永恆神殿
              </h3>
              <p className="font-serif italic text-xs text-[#525252] mt-1">
                L'Épopée de l'Atelier d'Inspiration et la Quête de la Forme Parfaite.
              </p>
            </div>

            {/* 4 Story Chapters */}
            <div className="space-y-8 text-black leading-relaxed">
              {/* Chapter 1 */}
              <div className="border-l-4 border-black pl-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase text-[#525252] mb-1">
                  <span className="font-bold text-black">ACTE I</span>
                  <span>/</span>
                  <span>LE VIDE PRIMITIF · 虛空之白</span>
                </div>
                <h4 className="font-display font-bold text-lg uppercase mb-2">
                  無垠紙面與第一道靜默
                </h4>
                <p className="text-sm">
                  在一切架構、草圖與精密儀器誕生之前，工坊僅存在一張無垠的特級羊皮棉紙。深邃的寂靜籠罩著這片尚未被觸及的疆域，指尖懸在半空，等待著刺穿混沌的第一記微光。
                </p>
                <p className="text-xs font-serif italic text-[#525252] mt-1.5">
                  « Avant le trait, il n'y a que le souffle et l'attente silencieuse. »
                </p>
              </div>

              {/* Chapter 2 */}
              <div className="border-l-4 border-black pl-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase text-[#525252] mb-1">
                  <span className="font-bold text-black">ACTE II</span>
                  <span>/</span>
                  <span>LE PREMIER TRAIT · 墨點與規矩</span>
                </div>
                <h4 className="font-display font-bold text-lg uppercase mb-2">
                  第一道墨痕的降臨
                </h4>
                <p className="text-sm">
                  當純黑墨水親吻白紙，秩序在此凝結。單純的「點擊」不再只是機械的重複，而是創作者向虛無索取存在的宣告。規尺劃出垂直水平的坐標，圓規刻劃出黃金比例的軌跡。靈感不再是不可捉摸的情緒，而是可被衡量、疊加與昇華的純粹能量。
                </p>
                <p className="text-xs font-serif italic text-[#525252] mt-1.5">
                  « Chaque clic est une affirmation : nous arrachons la forme au néant. »
                </p>
              </div>

              {/* Chapter 3 */}
              <div className="border-l-4 border-black pl-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase text-[#525252] mb-1">
                  <span className="font-bold text-black">ACTE III</span>
                  <span>/</span>
                  <span>LA MACHINE D'IDÉES · 機械共振</span>
                </div>
                <h4 className="font-display font-bold text-lg uppercase mb-2">
                  八大典藏設備與連擊風暴
                </h4>
                <p className="text-sm">
                  工坊的邊界開始向外延展——從簡約的「草稿桌」到工業級量產的「創意工廠」，十六項精密模組與四大宏觀典範相繼並聯運轉。當創作者達成 10 單位極限連擊，「靈感爆發」破空而至，賦予整座工坊百倍的狂暴產能。這是一場理性與心流交織的工業詩篇。
                </p>
                <p className="text-xs font-serif italic text-[#525252] mt-1.5">
                  « Quand le rythme s'accélère, la matière pensante devient infinie. »
                </p>
              </div>

              {/* Chapter 4 */}
              <div className="border-l-4 border-black pl-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase text-[#525252] mb-1">
                  <span className="font-bold text-black">ACTE IV</span>
                  <span>/</span>
                  <span>L'ÉDIFICE PERPÉTUEL · 不朽豐碑</span>
                </div>
                <h4 className="font-display font-bold text-lg uppercase mb-2">
                  永恆的極簡黑白帝國
                </h4>
                <p className="text-sm">
                  拋棄一切浮誇雜色，回歸純粹的黑、白、字體與直線。這座《靈感工坊》不再僅僅是一款遊戲，而是一座由創作者與時間共同鑄造的建築學豐碑。只要那份創造的渴望仍在跳動，這座工坊的指針便永不停歇。
                </p>
                <p className="text-xs font-serif italic text-[#525252] mt-1.5">
                  « Bâtir pour durer, créer pour transcender. »
                </p>
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center">
              <span className="font-mono text-xs text-[#525252]">ATELIER D'INSPIRATION · EDITION 2026</span>
              <button
                type="button"
                onClick={() => setActiveTab('cinematic')}
                className="bg-black text-white px-5 py-2 font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-none cursor-pointer"
              >
                REVOIR L'ANIMATION ↺
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
