import React, { useState } from 'react';
import { GameState } from '../types/game';
import { UPGRADES, GLOBAL_UPGRADES } from '../config/gameConfig';
import { formatInspiration } from '../utils/format';
import { PixelIcon } from './icons/PixelIcons';

interface UpgradesListProps {
  gameState: GameState;
  onBuyUpgrade: (upgradeId: string) => void;
  onBuyGlobalUpgrade: (globalUpgradeId: string) => void;
}

export const UpgradesList: React.FC<UpgradesListProps> = ({
  gameState,
  onBuyUpgrade,
  onBuyGlobalUpgrade,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'device' | 'global'>('all');

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-filter tabs */}
      <div className="flex gap-2 border-b border-slate-700/60 pb-3">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-slate-700 text-white border border-slate-500'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          全部升級 ({UPGRADES.length + GLOBAL_UPGRADES.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('device')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterType === 'device'
              ? 'bg-slate-700 text-white border border-slate-500'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          設備專屬升級 (16)
        </button>
        <button
          type="button"
          onClick={() => setFilterType('global')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterType === 'global'
              ? 'bg-slate-700 text-white border border-slate-500'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          全域升級 (4)
        </button>
      </div>

      {/* 全域升級區塊 */}
      {(filterType === 'all' || filterType === 'global') && (
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <PixelIcon id="creator_state" size={16} />
            <span>全域升級（影響所有設備與點擊）</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {GLOBAL_UPGRADES.map((upgrade) => {
              const isPurchased = !!gameState.purchasedGlobalUpgrades[upgrade.id];
              const canAfford = !isPurchased && gameState.inspiration >= upgrade.cost;

              return (
                <div
                  key={upgrade.id}
                  className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all ${
                    isPurchased
                      ? 'bg-slate-950/60 border-purple-900/40 opacity-75'
                      : canAfford
                      ? 'bg-slate-800/90 border-slate-600 shadow-md hover:border-amber-500/60'
                      : 'bg-slate-900/70 border-slate-800 opacity-85'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-950/80 rounded-lg border border-slate-700 p-1 flex-shrink-0">
                      <PixelIcon id={upgrade.iconId} size={28} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 text-sm truncate">
                        {upgrade.name}
                      </div>
                      <div className="text-xs text-amber-300 font-medium">
                        {upgrade.description}
                      </div>
                    </div>
                  </div>

                  {/* 購買或已購買按鈕 */}
                  {isPurchased ? (
                    <div className="w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-purple-950/60 text-purple-300 border border-purple-800/50 cursor-default select-none">
                      <span>✓ 已購買</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => onBuyGlobalUpgrade(upgrade.id)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-between transition-all select-none ${
                        canAfford
                          ? 'cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 shadow-lg'
                          : 'cursor-not-allowed bg-red-950/30 text-red-300/50 border border-red-900/30 opacity-70'
                      }`}
                    >
                      <span className="flex items-center gap-1 font-mono">
                        <PixelIcon id="inspiration" size={14} />
                        {formatInspiration(upgrade.cost)}
                      </span>
                      <span>購買</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 設備專屬升級區塊 */}
      {(filterType === 'all' || filterType === 'device') && (
        <div>
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <PixelIcon id="pro_equipment" size={16} />
            <span>設備專屬升級（永久倍增該設備產量）</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {UPGRADES.map((upgrade) => {
              const isPurchased = !!gameState.purchasedUpgrades[upgrade.id];
              const canAfford = !isPurchased && gameState.inspiration >= upgrade.cost;

              return (
                <div
                  key={upgrade.id}
                  className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all ${
                    isPurchased
                      ? 'bg-slate-950/60 border-purple-900/40 opacity-75'
                      : canAfford
                      ? 'bg-slate-800/90 border-slate-600 shadow-md hover:border-sky-500/60'
                      : 'bg-slate-900/70 border-slate-800 opacity-85'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-950/80 rounded-lg border border-slate-700 p-1 flex-shrink-0">
                      <PixelIcon id={upgrade.iconId} size={28} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 text-sm truncate">
                        {upgrade.name}
                      </div>
                      <div className="text-xs text-sky-300 font-medium">
                        {upgrade.description}
                      </div>
                    </div>
                  </div>

                  {/* 購買或已購買按鈕 */}
                  {isPurchased ? (
                    <div className="w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-purple-950/60 text-purple-300 border border-purple-800/50 cursor-default select-none">
                      <span>✓ 已購買</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => onBuyUpgrade(upgrade.id)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-between transition-all select-none ${
                        canAfford
                          ? 'cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 shadow-lg'
                          : 'cursor-not-allowed bg-red-950/30 text-red-300/50 border border-red-900/30 opacity-70'
                      }`}
                    >
                      <span className="flex items-center gap-1 font-mono">
                        <PixelIcon id="inspiration" size={14} />
                        {formatInspiration(upgrade.cost)}
                      </span>
                      <span>購買</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
