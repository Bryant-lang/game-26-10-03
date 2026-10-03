import React from 'react';
import { GameState } from '../types/game';
import { DEVICES, calculateDeviceCost } from '../config/gameConfig';
import { formatInspiration, formatRate } from '../utils/format';
import { PixelIcon } from './icons/PixelIcons';

interface EquipmentListProps {
  gameState: GameState;
  onBuyDevice: (deviceId: string) => void;
  getDeviceProduction: (deviceId: string) => number;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({
  gameState,
  onBuyDevice,
  getDeviceProduction,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {DEVICES.map((device) => {
        const devState = gameState.devices[device.id] || { owned: 0, productionMultiplier: 1 };
        const currentCost = calculateDeviceCost(device.baseCost, devState.owned);
        const canAfford = gameState.inspiration >= currentCost;
        const currentProduction = getDeviceProduction(device.id);

        return (
          <div
            key={device.id}
            className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all ${
              canAfford
                ? 'bg-slate-800/90 border-slate-600 shadow-md hover:border-emerald-500/60'
                : 'bg-slate-900/70 border-slate-800 opacity-85'
            }`}
          >
            {/* Header: Icon, Name & Owned count */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-950/70 rounded-lg border border-slate-700 p-1 flex-shrink-0">
                <PixelIcon id={device.iconId} size={36} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-100 text-sm truncate">{device.name}</div>
                <div className="text-xs text-slate-400 font-mono">
                  目前擁有：<span className="font-bold text-amber-300 font-mono">× {devState.owned}</span>
                </div>
              </div>
            </div>

            {/* Production details */}
            <div className="text-xs space-y-1 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 mb-3">
              <div className="flex justify-between text-slate-400">
                <span>每台產量：</span>
                <span className="text-emerald-400 font-mono font-medium">
                  +{formatRate(device.baseProduction * devState.productionMultiplier)} / 秒
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>當前總產：</span>
                <span className="text-emerald-300 font-mono font-semibold">
                  +{formatRate(currentProduction)} / 秒
                </span>
              </div>
              {devState.productionMultiplier > 1 && (
                <div className="flex justify-between text-purple-400 font-medium text-[11px]">
                  <span>升級加成：</span>
                  <span className="font-mono">×{devState.productionMultiplier}</span>
                </div>
              )}
            </div>

            {/* Purchase button with price */}
            <button
              type="button"
              disabled={!canAfford}
              onClick={() => onBuyDevice(device.id)}
              className={`w-full py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-between transition-all select-none ${
                canAfford
                  ? 'cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 shadow-lg'
                  : 'cursor-not-allowed bg-red-950/30 text-red-300/50 border border-red-900/30 opacity-70'
              }`}
            >
              <span className="flex items-center gap-1 font-mono">
                <PixelIcon id="inspiration" size={16} />
                {formatInspiration(currentCost)}
              </span>
              <span>購買</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
