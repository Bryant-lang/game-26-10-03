import React, { useState, useEffect, useRef } from 'react';
import { TUTORIAL_CONFIG } from '../config/tutorialConfig';
import { soundEngine } from '../utils/soundEngine';

interface OpeningAnimationProps {
  onFinish: () => void;
  onSimulateClick: () => void;
  onSimulateBuyDraftTable: () => void;
  canBuyDraftTable: boolean;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  onFinish,
  onSimulateClick,
  onSimulateBuyDraftTable,
  canBuyDraftTable,
}) => {
  // Current stage: 1 to 6
  const [stage, setStage] = useState<number>(1);
  const [elapsed, setElapsed] = useState<number>(0);

  // Stage 4 & 5 interaction tracking
  const [stage4Clicked, setStage4Clicked] = useState<boolean>(false);
  const [stage5Bought, setStage5Bought] = useState<boolean>(false);

  // Pencil animation progress for stage 3
  const [penStrokeStep, setPenStrokeStep] = useState<number>(0);

  const timerRef = useRef<number | null>(null);
  const hasTriggeredSoundRef = useRef<boolean>(false);

  // Main timeline progress
  useEffect(() => {
    soundEngine.ensureAudioRunning();

    const startTimestamp = performance.now();
    timerRef.current = window.setInterval(() => {
      const now = performance.now();
      const currentElapsed = (now - startTimestamp) / 1000;
      setElapsed(currentElapsed);

      // Stage 1: 0~3s
      if (currentElapsed < 3) {
        setStage(1);
        if (!hasTriggeredSoundRef.current) {
          hasTriggeredSoundRef.current = true;
          soundEngine.playClick04();
        }
      }
      // Stage 2: 3~7s
      else if (currentElapsed < 7) {
        setStage(2);
      }
      // Stage 3: 7~12s
      else if (currentElapsed < 12) {
        setStage(3);
        const strokeProgress = Math.min(4, Math.floor((currentElapsed - 7) / 1.1));
        setPenStrokeStep(strokeProgress);
      }
      // Stage 4: 12~18s (Waits for player click if not yet clicked)
      else if (currentElapsed < 18) {
        setStage(4);
      }
      // Stage 5: 18~25s (Shows Draft Table)
      else if (currentElapsed < 25) {
        setStage(5);
      }
      // Stage 6: 25~30s (Concluding Philosophy)
      else if (currentElapsed < 30) {
        setStage(6);
      }
      // Finished
      else {
        onFinish();
      }
    }, 100);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [onFinish]);

  // Stage 4: 玩家點擊主要按鈕
  const handleStage4Click = () => {
    if (stage4Clicked) return;
    setStage4Clicked(true);
    onSimulateClick();
    soundEngine.playClick();

    // 播放後稍作停頓進入 Stage 5
    setTimeout(() => {
      setStage(5);
    }, 1200);
  };

  // Stage 5: 玩家購買草稿桌
  const handleStage5Buy = () => {
    if (stage5Bought) return;
    setStage5Bought(true);
    onSimulateBuyDraftTable();
    soundEngine.playPurchase();

    // 進入 Stage 6
    setTimeout(() => {
      setStage(6);
    }, 1500);
  };

  return (
    <div
      role="dialog"
      aria-label="遊戲開場動畫"
      className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col items-center justify-center p-4 select-none font-mono overflow-hidden"
    >
      {/* Top Bar: Title & Skip Button */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-xs tracking-widest text-[#A3A3A3] z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider text-sm">
            {TUTORIAL_CONFIG.intro.title}
          </span>
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="px-3 py-1 border border-white text-white hover:bg-white hover:text-black uppercase text-xs font-bold transition-none cursor-pointer"
        >
          {TUTORIAL_CONFIG.intro.skipButton}
        </button>
      </div>

      {/* Main Canvas / Visual Stage */}
      <div className="relative w-full max-w-2xl h-[420px] sm:h-[480px] border-2 border-white flex flex-col items-center justify-center bg-[#050505] p-6 text-center">
        {/* ======================================================== */}
        {/* 階段 1: 0~3 秒 - 光點逐漸變成像素燈泡                        */}
        {/* ======================================================== */}
        {stage === 1 && (
          <div className="flex flex-col items-center justify-center space-y-6 animate-fadeIn">
            {/* Pixel Dot to Bulb SVG */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {elapsed < 1.5 ? (
                <div className="w-3 h-3 bg-white shadow-[0_0_12px_#ffffff] animate-ping" />
              ) : (
                <svg
                  className="w-20 h-20 text-white animate-pulse"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  shapeRendering="crispEdges"
                >
                  <rect x="9" y="3" width="6" height="2" fill="currentColor" />
                  <rect x="7" y="5" width="10" height="7" fill="currentColor" />
                  <rect x="8" y="12" width="8" height="4" fill="currentColor" />
                  <rect x="9" y="16" width="6" height="2" fill="currentColor" />
                  <rect x="10" y="19" width="4" height="2" fill="currentColor" />
                </svg>
              )}
            </div>

            <div className="text-xs tracking-widest text-[#A3A3A3] uppercase">
              {TUTORIAL_CONFIG.intro.stage1SoundPrompt}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 階段 2: 3~7 秒 - 工作室逐步顯現（書桌、書架、電腦、窗外城市）   */}
        {/* ======================================================== */}
        {stage === 2 && (
          <div className="w-full flex flex-col items-center justify-center space-y-6">
            {/* Atelier Pixel Illustration */}
            <div className="w-full max-w-md h-52 border border-white/40 p-3 bg-black flex flex-col justify-between relative">
              {/* Top: Window with City Lights & Bookshelf */}
              <div className="flex justify-between items-start">
                {/* Bookshelf */}
                <div className="border border-white/60 p-1 w-24 text-[9px] text-left">
                  <div className="border-b border-white/30 pb-0.5 mb-1">[ 書架 ]</div>
                  <div className="space-y-0.5 opacity-80">
                    <div className="h-1.5 bg-white/70 w-full" />
                    <div className="h-1.5 bg-white/50 w-3/4" />
                    <div className="h-1.5 bg-white/90 w-5/6" />
                  </div>
                </div>

                {/* Window with Skyline */}
                <div className="border border-white p-1 w-36 h-24 flex flex-col justify-between bg-[#111111]">
                  <span className="text-[8px] tracking-wider text-[#A3A3A3]">[ 城市夜空 ]</span>
                  {/* Skyline Silhouette */}
                  <div className="flex items-end justify-around h-12 border-b border-white/40">
                    <div className="w-4 h-8 bg-white/30" />
                    <div className="w-5 h-11 bg-white/50" />
                    <div className="w-3 h-6 bg-white/20" />
                    <div className="w-6 h-9 bg-white/40" />
                  </div>
                </div>
              </div>

              {/* Bottom: Desk, Computer, Glowing Pixel Bulb */}
              <div className="border-t-2 border-white pt-2 flex justify-between items-end">
                {/* Computer */}
                <div className="border border-white/80 p-1 w-16 text-center text-[8px]">
                  <div className="w-10 h-6 border border-white mx-auto mb-1 bg-white/10" />
                  [ 電腦 ]
                </div>

                {/* Center Glowing Lightbulb */}
                <div className="w-10 h-10 border border-white bg-white text-black flex items-center justify-center font-bold text-xs">
                  💡
                </div>

                {/* Drafting Desk */}
                <div className="border border-white/80 p-1 w-20 text-center text-[8px]">
                  [ 工作桌案 ]
                </div>
              </div>
            </div>

            <div className="text-xs uppercase tracking-widest text-[#E5E5E5]">
              工作室逐步成型 · 靈感即將萌芽
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 階段 3: 7~12 秒 - 紙張、畫出小燈泡、「+1 靈感」               */}
        {/* ======================================================== */}
        {stage === 3 && (
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Blank Sheet on Drafting Table */}
            <div className="w-64 h-44 bg-white text-black border-2 border-white p-4 flex flex-col items-center justify-center relative shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              {/* Pixel pen drawing progress */}
              <div className="w-20 h-20 border-2 border-black flex flex-col items-center justify-center relative">
                {penStrokeStep >= 1 && (
                  <div className="w-12 h-2 bg-black absolute top-2" />
                )}
                {penStrokeStep >= 2 && (
                  <div className="w-10 h-10 border-2 border-black rounded-none absolute top-4" />
                )}
                {penStrokeStep >= 3 && (
                  <div className="w-6 h-2 bg-black absolute bottom-2" />
                )}
                {penStrokeStep >= 4 && (
                  <div className="text-xl animate-bounce">💡</div>
                )}
              </div>

              {penStrokeStep >= 4 && (
                <div className="mt-3 text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 border border-black animate-pulse">
                  {TUTORIAL_CONFIG.intro.stage3InspirationGain}
                </div>
              )}
            </div>

            <div className="text-xs text-[#A3A3A3] tracking-wider">
              筆尖勾勒思緒，第一道靈感顯現
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 階段 4: 12~18 秒 - 可操作「開始創作」點擊按鈕                */}
        {/* ======================================================== */}
        {stage === 4 && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-sm font-bold tracking-wider text-white uppercase animate-pulse">
              {TUTORIAL_CONFIG.intro.stage4Prompt}
            </div>

            {/* Central Interactive Click Button */}
            <button
              type="button"
              onClick={handleStage4Click}
              disabled={stage4Clicked}
              className={`px-8 py-5 text-lg font-bold border-4 border-white tracking-widest uppercase transition-none cursor-pointer ${
                stage4Clicked
                  ? 'bg-white text-black'
                  : 'bg-black text-white hover:bg-white hover:text-black active:translate-y-1'
              }`}
            >
              {stage4Clicked ? '✓ 已觸發第一道靈感' : TUTORIAL_CONFIG.intro.stage4Button}
            </button>

            <div className="text-xs text-[#A3A3A3] tracking-widest">
              {stage4Clicked ? '很好，創作的齒輪已經轉動' : '[ 請點擊上方按鈕開始 ]'}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 階段 5: 18~25 秒 - 顯示「草稿桌」設備購買與自動化概念          */}
        {/* ======================================================== */}
        {stage === 5 && (
          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="text-xs uppercase tracking-wider text-[#A3A3A3]">
              {TUTORIAL_CONFIG.intro.stage5Prompt}
            </div>

            {/* Draft Table Card in Monochrome Pixel Style */}
            <div className="w-72 border-2 border-white bg-black p-4 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-white pb-1.5">
                <span className="font-bold text-white text-base">
                  {TUTORIAL_CONFIG.intro.stage5DeviceName}
                </span>
                <span className="text-[10px] border border-white px-1">N° 01</span>
              </div>

              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A3A3A3]">生產速率 :</span>
                <span className="font-bold text-white">
                  {TUTORIAL_CONFIG.intro.stage5DeviceRate}
                </span>
              </div>

              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A3A3A3]">採購成本 :</span>
                <span className="font-bold text-white">
                  {TUTORIAL_CONFIG.intro.stage5DeviceCost}
                </span>
              </div>

              <button
                type="button"
                onClick={handleStage5Buy}
                disabled={stage5Bought}
                className={`w-full py-2.5 text-xs font-bold border-2 border-white uppercase transition-none cursor-pointer ${
                  stage5Bought
                    ? 'bg-white text-black'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {stage5Bought ? '✓ 已成功建立草稿桌' : '購買設備 (15 靈感)'}
              </button>
            </div>

            <div className="text-xs text-[#E5E5E5] tracking-widest">
              {stage5Bought ? '草稿桌已開始持續自動產出' : '點擊購買，開啟工坊自動化生產'}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 階段 6: 25~30 秒 - 核心三位一體與總結結語                   */}
        {/* ======================================================== */}
        {stage === 6 && (
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Three Pillars */}
            <div className="border border-white p-5 bg-black/90 space-y-2 text-center w-80">
              {TUTORIAL_CONFIG.intro.stage6Pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="text-sm font-bold tracking-widest text-white border-b border-white/20 pb-1.5 last:border-b-0"
                >
                  {pillar}
                </div>
              ))}
            </div>

            <div className="text-xs tracking-wider text-[#A3A3A3] italic">
              「{TUTORIAL_CONFIG.intro.stage6Closing}」
            </div>

            <button
              type="button"
              onClick={onFinish}
              className="mt-2 px-6 py-2.5 bg-white text-black font-bold uppercase tracking-widest border-2 border-white hover:bg-black hover:text-white transition-none cursor-pointer text-xs"
            >
              進入工坊 · 開始創作 →
            </button>
          </div>
        )}
      </div>

      {/* Bottom Timeline Indicator */}
      <div className="mt-4 text-[11px] text-[#737373] tracking-widest uppercase">
        PHASE 0{stage} / 06 · TEMPS : {elapsed.toFixed(1)}S
      </div>
    </div>
  );
};
