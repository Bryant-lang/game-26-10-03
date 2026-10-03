import { useState, useEffect } from 'react';
import { useGameEngine } from './game/useGameEngine';
import { HeaderInfo } from './components/HeaderInfo';
import { MainClicker } from './components/MainClicker';
import { ShopArea } from './components/ShopArea';
import { LobbyArea } from './components/LobbyArea';
import { IntroModal } from './components/IntroModal';
import { OpeningAnimation } from './components/OpeningAnimation';
import { TutorialOverlay } from './components/TutorialOverlay';
import { useTutorial } from './game/useTutorial';
import { formatInspiration } from './utils/format';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const {
    gameState,
    floatingTexts,
    isBurstActive,
    handleClick,
    buyDevice,
    buyUpgrade,
    buyGlobalUpgrade,
    removeFloatingText,
    getDeviceProduction,
    getFinalProductionPerSecond,
  } = useGameEngine();

  const finalProduction = getFinalProductionPerSecond();
  const [currentView, setCurrentView] = useState<'atelier' | 'lobby'>('atelier');
  const [showFullscreenIntro, setShowFullscreenIntro] = useState(false);

  // Decoupled Tutorial System
  const {
    showIntro,
    notice,
    comboToast,
    finishIntro,
    replayIntro,
    handlePlayerClick,
    handleDeviceBought,
    handleUpgradeBought,
    handleBurstTriggered,
  } = useTutorial(gameState);

  // Track burst for tutorial notification
  useEffect(() => {
    if (isBurstActive) {
      handleBurstTriggered();
    }
  }, [isBurstActive, handleBurstTriggered]);

  const onWrappedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handlePlayerClick();
    handleClick(e);
  };

  const onWrappedBuyDevice = (deviceId: string) => {
    handleDeviceBought(deviceId);
    buyDevice(deviceId);
  };

  const onWrappedBuyUpgrade = (upgradeId: string) => {
    handleUpgradeBought(upgradeId);
    buyUpgrade(upgradeId);
  };

  // Masterwork milestones unlocked count for navigation badge
  const masterworkMilestones = [100, 1000, 10000, 50000, 250000, 1000000, 10000000, 100000000];
  const unlockedCount = masterworkMilestones.filter((req) => gameState.totalInspiration >= req).length;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] flex flex-col items-center justify-start p-3 sm:p-6 md:p-8 font-serif selection:bg-black selection:text-white bg-monochrome-lines">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 bg-black text-white px-4 py-2 font-mono text-xs uppercase tracking-widest border-2 border-white"
      >
        SAUTER VERS LE CONTENU PRINCIPAL [ TAB ]
      </a>

      {/* 25~30s Pixel Art Opening Animation (First run or replay) */}
      {showIntro && (
        <OpeningAnimation
          onFinish={finishIntro}
          onSimulateClick={() => {
            handlePlayerClick();
            handleClick();
          }}
          onSimulateBuyDraftTable={() => {
            handleDeviceBought('draft_table');
            buyDevice('draft_table');
          }}
          canBuyDraftTable={gameState.inspiration >= 15}
        />
      )}

      {/* Tutorial Guidance Overlay */}
      <TutorialOverlay notice={notice} comboToast={comboToast} />

      <main className="w-full max-w-6xl flex flex-col">
        {/* Editorial Masthead */}
        <HeaderInfo
          gameState={gameState}
          finalProduction={finalProduction}
          onOpenStory={() => setShowFullscreenIntro(true)}
          onReplayIntro={replayIntro}
        />

        {/* Minimalist Monochrome Mode Navigation Tabs */}
        <nav aria-label="工坊空間導航" className="flex border-b-2 border-black w-full mt-4 mb-2 font-mono text-xs uppercase tracking-wider">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTab();
              setCurrentView('atelier');
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className={`py-3 px-5 sm:px-8 border-b-4 -mb-[2px] transition-none cursor-pointer flex items-center gap-2 select-none ${
              currentView === 'atelier'
                ? 'border-black bg-black text-white font-bold'
                : 'border-transparent text-[#525252] hover:text-black hover:bg-[#F5F5F5]'
            }`}
          >
            <span>01 / 創作工坊</span>
            <span className="font-serif italic text-xs hidden sm:inline">· L'Atelier</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playTab();
              setCurrentView('lobby');
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className={`py-3 px-5 sm:px-8 border-b-4 -mb-[2px] transition-none cursor-pointer flex items-center gap-2 select-none ${
              currentView === 'lobby'
                ? 'border-black bg-black text-white font-bold'
                : 'border-transparent text-[#525252] hover:text-black hover:bg-[#F5F5F5]'
            }`}
          >
            <span>02 / 工坊大廳</span>
            <span className="font-serif italic text-xs hidden sm:inline">· Le Grand Hall</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 border border-current font-bold ${
                currentView === 'lobby' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
            >
              {unlockedCount}/8
            </span>
          </button>
        </nav>

        {/* View Switcher Container */}
        <div id="main-content">
          {currentView === 'atelier' ? (
            <>
              {/* Central Monolith & Oversized Hero */}
              <MainClicker
                clickPower={gameState.clickPower}
                combo={gameState.combo}
                comboCooldown={gameState.comboCooldown}
                isBurstActive={isBurstActive}
                floatingTexts={floatingTexts}
                onClick={onWrappedClick}
                onRemoveFloatingText={removeFloatingText}
              />

              {/* Equipment & Upgrades Catalog */}
              <ShopArea
                gameState={gameState}
                onBuyDevice={onWrappedBuyDevice}
                onBuyUpgrade={onWrappedBuyUpgrade}
                onBuyGlobalUpgrade={buyGlobalUpgrade}
                getDeviceProduction={getDeviceProduction}
                finalProduction={finalProduction}
              />
            </>
          ) : (
            /* Grand Hall / Lobby View */
            <LobbyArea
              gameState={gameState}
              finalProduction={finalProduction}
              onReturnToAtelier={() => setCurrentView('atelier')}
            />
          )}
        </div>

        {/* Heavy Section Divider */}
        <div className="h-1 bg-black w-full mt-6 mb-4" />

        {/* Editorial Colophon & Monograph Footer */}
        <footer className="w-full flex flex-col md:flex-row items-start md:items-center justify-between text-xs font-mono py-3 text-[#525252] border-t border-black gap-2 select-none">
          <div className="flex items-center gap-3">
            <span className="font-bold text-black uppercase">COLOPHON</span>
            <span>/</span>
            <span>TOTAL HISTORIQUE : {formatInspiration(gameState.totalInspiration)}</span>
          </div>

          <div className="font-serif italic text-black text-center md:text-right text-xs">
            “讓每一個想法，都有機會發光。” — TOUTE PENSÉE MÉRITE D'ÊTRE MISE EN LUMIÈRE.
          </div>

          <div className="text-[10px] tracking-widest uppercase text-black font-mono">
            MMXXVI · ARCHITECTURAL EDITION
          </div>
        </footer>

        {/* Fullscreen Initial Cinematic Animation & Story Background */}
        <IntroModal
          isOpen={showFullscreenIntro}
          onClose={() => setShowFullscreenIntro(false)}
        />
      </main>
    </div>
  );
}
