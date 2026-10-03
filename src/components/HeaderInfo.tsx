import React, { useState } from 'react';
import { GameState } from '../types/game';
import { formatInspiration } from '../utils/format';
import { IntroModal } from './IntroModal';
import { AudioSettingsModal } from './AudioSettingsModal';
import { soundEngine } from '../utils/soundEngine';

interface HeaderInfoProps {
  gameState: GameState;
  finalProduction: number;
  onOpenStory?: () => void;
  onReplayIntro?: () => void;
}

export const HeaderInfo: React.FC<HeaderInfoProps> = ({
  gameState,
  finalProduction,
  onOpenStory,
  onReplayIntro,
}) => {
  const isCooldownActive = gameState.comboCooldown > 0;
  const [showManifesto, setShowManifesto] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  const handleOpenStory = () => {
    soundEngine.playTab();
    if (onOpenStory) {
      onOpenStory();
    } else {
      setShowStory(true);
    }
  };

  return (
    <>
      <header className="w-full bg-[#FFFFFF] border-b-4 border-black pb-4 pt-2">
        {/* Top Editorial Kicker & Date Line */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-mono tracking-widest text-[#525252] border-b border-black pb-2 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-black uppercase">ATELIER D'INSPIRATION</span>
            <span>/</span>
            <span>VOL. 01 — ÉDITION MONOCHROME</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-0 flex-wrap">
            <span>TAIWAN · 2026</span>
            <span>/</span>
            {onReplayIntro && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTab();
                    onReplayIntro();
                  }}
                  className="text-black uppercase hover:bg-black hover:text-white px-2 py-0.5 border border-black transition-none cursor-pointer font-bold select-none"
                >
                  [ 開場動畫 / INTRO ]
                </button>
                <span>/</span>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTab();
                setShowAudio(true);
              }}
              className="text-black uppercase hover:bg-black hover:text-white px-2 py-0.5 border border-black transition-none cursor-pointer font-bold select-none"
            >
              [ 🔊 AUDIO / 音效 ]
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={handleOpenStory}
              className="text-black uppercase hover:bg-black hover:text-white px-2 py-0.5 border border-black transition-none cursor-pointer font-bold select-none"
            >
              [ 故事與序章動畫 / HISTOIRE ]
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playTab();
                setShowManifesto(true);
              }}
              className="text-black underline uppercase hover:bg-black hover:text-white px-1 transition-none cursor-pointer select-none"
            >
              [ MANIFESTO / 說明 ]
            </button>
          </div>
        </div>

        {/* Main Masthead Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Masthead Title */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-black uppercase leading-none">
              靈感工坊
            </h1>
            <p className="font-serif italic text-xs text-[#525252] mt-1.5 tracking-wide">
              An Architectural & Typographic Incremental Engine.
            </p>
          </div>

          {/* Central Monumental Metric: Inspiration */}
          <div
            id="tutorial-inspiration-display"
            className="lg:col-span-5 border-2 border-black p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FFFFFF]"
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#525252] block">
                TOTAL INSPIRATION EN COURS
              </span>
              <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-black leading-none mt-1">
                {formatInspiration(gameState.inspiration)}
              </div>
            </div>

            <div
              id="tutorial-production-rate"
              className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l-2 border-black pt-2 sm:pt-0 sm:pl-4 flex flex-row sm:flex-col justify-between sm:justify-center gap-1 font-mono text-xs"
            >
              <div>
                <span className="text-[10px] text-[#525252] uppercase block">DÉBIT</span>
                <span className="font-bold text-black">+{formatInspiration(finalProduction)} / SEC</span>
              </div>
              <div>
                <span className="text-[10px] text-[#525252] uppercase block">PUISSANCE</span>
                <span className="font-bold text-black">+{formatInspiration(gameState.clickPower)} / CLIC</span>
              </div>
            </div>
          </div>

          {/* Right Section: Architectural Combo Gauge */}
          <div className="lg:col-span-3 border-2 border-black p-3 flex flex-col justify-between bg-[#F5F5F5]">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="uppercase tracking-widest text-black">
                RYTHME (COMBO)
              </span>
              <span className="text-black font-mono">
                {formatInspiration(gameState.combo)} / 10
              </span>
            </div>

            {/* Segmented 10-Unit Rule Meter */}
            <div className="grid grid-cols-10 gap-1 my-2">
              {Array.from({ length: 10 }).map((_, index) => {
                const isActive = index < gameState.combo;
                return (
                  <div
                    key={index}
                    className={`h-4 border border-black transition-none ${
                      isActive ? 'bg-black' : 'bg-white'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-[#525252]">
              <span>ÉCLAIR DE CRÉATION</span>
              <span>
                {isCooldownActive
                  ? `COOLING [ ${formatInspiration(Math.ceil(gameState.comboCooldown))}S ]`
                  : gameState.combo >= 9
                  ? 'BURST IMMINENT'
                  : 'READY'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Editorial Manifesto Modal */}
      {showManifesto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-none p-4">
          <div className="bg-[#FFFFFF] border-4 border-black p-6 sm:p-8 max-w-lg w-full shadow-none text-black relative">
            <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
                MANIFESTE DE L'ATELIER
              </h2>
              <button
                type="button"
                onClick={() => setShowManifesto(false)}
                className="font-mono text-sm border-2 border-black px-2 py-0.5 hover:bg-black hover:text-white transition-none cursor-pointer"
              >
                ✕ FERMER
              </button>
            </div>

            <div className="font-serif text-sm leading-relaxed space-y-3 text-[#000000]">
              <p>
                <strong>《靈感工坊》極簡黑白典藏版</strong> 旨在拋棄多餘的裝飾色彩與圓角浮誇效果，回歸本質：純黑白對比、精準襯線字體與幾何線條秩序。
              </p>
              <div className="border-l-4 border-black pl-3 py-1 font-mono text-xs space-y-1 text-[#525252]">
                <p>• 點擊中央「COMMENCER / 開始創作」累積靈感與連擊節奏。</p>
                <p>• 達成 10 連擊觸發「靈感爆發」，賦予 100 倍爆發產能。</p>
                <p>• 添購經典設備與升級項目，永續倍增工坊產出。</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-black flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowManifesto(false);
                  handleOpenStory();
                }}
                className="font-mono text-xs border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-none cursor-pointer uppercase font-bold"
              >
                ▶ 觀看全螢幕序幕動畫與典藏史冊
              </button>
              <button
                type="button"
                onClick={() => setShowManifesto(false)}
                className="bg-black text-white px-6 py-2 font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-none cursor-pointer"
              >
                ENTRER DANS L'ATELIER →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fallback Fullscreen Story Modal if not controlled at root */}
      {!onOpenStory && (
        <IntroModal isOpen={showStory} onClose={() => setShowStory(false)} />
      )}

      {/* 16-bit Pixel Art Sound & Music Mixer Modal */}
      <AudioSettingsModal isOpen={showAudio} onClose={() => setShowAudio(false)} />
    </>
  );
};
