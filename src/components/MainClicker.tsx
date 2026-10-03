import React, { useState } from 'react';
import { FloatingText } from '../types/game';

interface MainClickerProps {
  clickPower: number;
  combo: number;
  comboCooldown: number;
  isBurstActive: boolean;
  floatingTexts: FloatingText[];
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onRemoveFloatingText: (id: number) => void;
}

export const MainClicker: React.FC<MainClickerProps> = ({
  clickPower,
  combo,
  comboCooldown,
  isBurstActive,
  floatingTexts,
  onClick,
  onRemoveFloatingText,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 90);
    onClick(e);
  };

  return (
    <section className="relative w-full border-4 border-black bg-white my-4 p-6 sm:p-10 md:p-12 overflow-hidden select-none bg-monochrome-lines">
      {/* Editorial Decorative Corner Markers */}
      <div className="absolute top-2 left-2 text-[10px] font-mono tracking-widest text-[#525252]">
        ┌ FIG. 01 / ACTE CRÉATIF
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono tracking-widest text-[#525252]">
        MODÈLE ARCHITECTURAL ┐
      </div>
      <div className="absolute bottom-2 left-2 text-[10px] font-mono tracking-widest text-[#525252]">
        └ N° 3F706FDA
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] font-mono tracking-widest text-[#525252]">
        PARIS · TAIPEI ┘
      </div>

      {/* Burst State Editorial Banner */}
      {isBurstActive && (
        <div className="absolute inset-0 bg-black text-white z-30 flex flex-col items-center justify-center p-6 animate-pulse">
          <div className="border-4 border-white p-6 sm:p-10 text-center max-w-xl">
            <span className="font-mono text-xs tracking-widest uppercase block mb-2">
              BURST MOMENTUM × 100
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight">
              ÉCLAIR D'INSPIRATION
            </h2>
            <p className="font-serif italic text-sm mt-3 text-[#E5E5E5]">
              +{clickPower * 100} UNITES D'INSPIRATION DÉCUPLÉES
            </p>
          </div>
        </div>
      )}

      {/* Central Content Canvas */}
      <div className="flex flex-col items-center justify-center text-center relative z-10 py-6 sm:py-10">
        
        {/* Editorial Pull Quote */}
        <div className="max-w-xl mb-4 text-center">
          <span className="font-display text-4xl leading-none text-black">“</span>
          <p className="font-serif italic text-base sm:text-lg text-black -mt-4 leading-relaxed px-4">
            大大的夢想，皆始於紙上一記純粹而果決的靈感筆觸。
          </p>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252] mt-1 block">
            — PROVERBE DE L'ATELIER
          </span>
        </div>

        {/* Non-Negotiable: Hero Decorative Elements (Thick rule with small bordered square) */}
        <div className="flex items-center justify-center my-4 w-full max-w-md">
          <div className="h-[2px] bg-black flex-1" />
          <div className="w-3.5 h-3.5 border-2 border-black bg-white mx-4 rotate-45" />
          <div className="h-[2px] bg-black flex-1" />
        </div>

        {/* Non-Negotiable: Oversized Hero Typography (8xl to 9xl display word) */}
        <div className="my-2 sm:my-4 select-none">
          <span className="font-display text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter text-black leading-none block">
            INSPIRER
          </span>
        </div>

        {/* Minimalist Monolith Interactive Button */}
        <div className="mt-4 sm:mt-6">
          <button
            id="tutorial-main-clicker"
            type="button"
            onClick={handleButtonClick}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            className={`group cursor-pointer select-none uppercase font-mono tracking-widest text-xs sm:text-sm font-bold px-8 sm:px-14 py-4 sm:py-5 border-2 border-black transition-none touch-manipulation min-h-[48px] flex items-center gap-3 ${
              isPressed
                ? 'bg-white text-black ring-4 ring-black ring-offset-2'
                : 'bg-black text-white hover:bg-white hover:text-black'
            }`}
          >
            <span>COMMENCER LA CRÉATION</span>
            <span className="font-serif italic text-base sm:text-lg">/</span>
            <span>開始創作 →</span>
          </button>
        </div>

        {/* Technical Sub-metadata */}
        <div className="mt-4 flex items-center gap-4 font-mono text-[11px] text-[#525252]">
          <span>RENDEMENT : +{clickPower} / CLIC</span>
          <span>·</span>
          <span>SÉRIE ACTIVE : {combo} / 10</span>
        </div>
      </div>

      {/* Sharp Floating Editorial Serif Numbers */}
      {floatingTexts.map((ft) => (
        <span
          key={ft.id}
          onAnimationEnd={() => onRemoveFloatingText(ft.id)}
          className={`absolute pointer-events-none font-display font-bold select-none animate-float-fade z-40 ${
            ft.isBurst
              ? 'text-white bg-black border-2 border-white px-2 py-0.5 text-lg'
              : 'text-black bg-white border border-black px-1.5 py-0.5 text-sm font-mono'
          }`}
          style={{
            left: `${ft.x}px`,
            top: `${ft.y}px`,
          }}
        >
          {ft.text}
        </span>
      ))}
    </section>
  );
};
