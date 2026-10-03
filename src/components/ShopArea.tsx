import React, { useState } from 'react';
import { GameState } from '../types/game';
import {
  DEVICES,
  UPGRADES,
  GLOBAL_UPGRADES,
  calculateDeviceCost,
} from '../config/gameConfig';
import { formatInspiration } from '../utils/format';
import { Tooltip } from './Tooltip';
import { soundEngine } from '../utils/soundEngine';

interface ShopAreaProps {
  gameState: GameState;
  onBuyDevice: (deviceId: string) => void;
  onBuyUpgrade: (upgradeId: string) => void;
  onBuyGlobalUpgrade: (globalUpgradeId: string) => void;
  getDeviceProduction: (deviceId: string) => number;
  finalProduction?: number;
}

type SkillFilter = 'all' | 'global' | 'equipment' | 'affordable' | 'purchased';

export const ShopArea: React.FC<ShopAreaProps> = ({
  gameState,
  onBuyDevice,
  onBuyUpgrade,
  onBuyGlobalUpgrade,
  getDeviceProduction,
  finalProduction = 0,
}) => {
  // Filter state for skills/upgrades
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all');

  // Device Map for quick lookup
  const deviceMap = React.useMemo(() => {
    return new Map(DEVICES.map((d) => [d.id, d]));
  }, []);

  // Total skill counts
  const totalSkillsCount = UPGRADES.length + GLOBAL_UPGRADES.length;
  const purchasedEquipmentUpgradesCount = Object.keys(gameState.purchasedUpgrades).length;
  const purchasedGlobalUpgradesCount = Object.keys(gameState.purchasedGlobalUpgrades).length;
  const totalPurchasedSkills = purchasedEquipmentUpgradesCount + purchasedGlobalUpgradesCount;

  // Filtered Equipment Upgrades
  const filteredEquipmentUpgrades = UPGRADES.filter((u) => {
    const isPurchased = !!gameState.purchasedUpgrades[u.id];
    const canAfford = !isPurchased && gameState.inspiration >= u.cost;

    if (skillFilter === 'global') return false;
    if (skillFilter === 'affordable') return canAfford;
    if (skillFilter === 'purchased') return isPurchased;
    return true; // 'all' or 'equipment'
  });

  // Filtered Global Canons
  const filteredGlobalCanons = GLOBAL_UPGRADES.filter((gu) => {
    const isPurchased = !!gameState.purchasedGlobalUpgrades[gu.id];
    const canAfford = !isPurchased && gameState.inspiration >= gu.cost;

    if (skillFilter === 'equipment') return false;
    if (skillFilter === 'affordable') return canAfford;
    if (skillFilter === 'purchased') return isPurchased;
    return true; // 'all' or 'global'
  });

  // Render 8 Equipment Cards
  const renderDeviceGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {DEVICES.map((device, index) => {
        const devState = gameState.devices[device.id] || { owned: 0, productionMultiplier: 1 };
        const currentCost = calculateDeviceCost(device.baseCost, devState.owned);
        const canAfford = gameState.inspiration >= currentCost;
        const totalProduction = getDeviceProduction(device.id);
        const indexStr = String(index + 1).padStart(2, '0');

        // Stats for Tooltip
        const unitBase = device.baseProduction;
        const deviceMultiplier = devState.productionMultiplier;
        const globalMultiplier = gameState.globalProductionMultiplier;
        const effectiveUnitProd = unitBase * deviceMultiplier * globalMultiplier;
        const sharePercent =
          finalProduction > 0
            ? ((totalProduction / finalProduction) * 100).toFixed(1)
            : '0.0';

        const tooltipContent = (
          <div
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
            className="space-y-2 text-xs font-mono text-black"
          >
            {/* Editorial Monograph Header */}
            <div className="border-b border-black pb-1.5 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#525252] block font-mono">
                  SPÉCIFICATIONS TECHNIQUES
                </span>
                <span className="font-display font-bold uppercase tracking-tight text-black text-sm">
                  {device.name}
                </span>
              </div>
              <span className="text-[10px] font-mono border border-black px-1.5 py-0.5 bg-[#F5F5F5]">
                N° {indexStr}
              </span>
            </div>

            {/* Production Stats Breakdown: Base Production, Current Efficiency Modifiers, Total Contribution */}
            <div className="border border-black p-2.5 bg-[#F5F5F5] space-y-2">
              <div className="text-[9px] font-bold uppercase tracking-widest text-[#525252] border-b border-black/20 pb-1">
                PRODUCTION STATS BREAKDOWN // JBM-01
              </div>

              {/* 1. Base Production */}
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#525252] uppercase font-bold text-[10px] tracking-wider">
                  BASE PRODUCTION :
                </span>
                <span className="font-bold text-black font-mono">
                  +{formatInspiration(unitBase)}/S
                </span>
              </div>

              {/* 2. Current Efficiency Modifiers */}
              <div className="space-y-0.5 border-t border-black/15 pt-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#525252] uppercase font-bold text-[10px] tracking-wider">
                    CURRENT EFFICIENCY MODIFIERS :
                  </span>
                  <span className="font-bold text-black font-mono">
                    ×{formatInspiration(deviceMultiplier * globalMultiplier)}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-[#525252] pl-2 font-mono">
                  <span>↳ DEVICE MODIFIER :</span>
                  <span className="font-medium text-black">×{formatInspiration(deviceMultiplier)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#525252] pl-2 font-mono">
                  <span>↳ GLOBAL MODIFIER :</span>
                  <span className="font-medium text-black">×{formatInspiration(globalMultiplier)}</span>
                </div>
              </div>

              {/* 3. Total Contribution */}
              <div className="flex justify-between items-center text-[11px] border-t border-black/30 pt-1.5 bg-black/5 px-2 py-1">
                <span className="text-black uppercase font-bold text-[10px] tracking-wider">
                  TOTAL CONTRIBUTION :
                </span>
                <span className="font-bold text-black font-mono">
                  +{formatInspiration(totalProduction)}/S ({sharePercent}%)
                </span>
              </div>
            </div>

            {/* Technical Operational Details */}
            <div className="space-y-1 text-[11px] font-mono text-black pt-0.5">
              <div className="flex justify-between">
                <span className="text-[#525252]">EFFECTIVE UNIT RATE :</span>
                <span className="font-bold font-mono">+{formatInspiration(effectiveUnitProd)}/S</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#525252]">UNITS OPERATIONAL :</span>
                <span className="font-bold font-mono">× {formatInspiration(devState.owned)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#525252]">GLOBAL OUTPUT SHARE :</span>
                <span className="font-bold font-mono">{sharePercent}%</span>
              </div>
            </div>

            {/* Next Cost Footer */}
            <div className="border-t border-black pt-1.5 flex justify-between items-center text-[9px] font-mono uppercase text-[#525252]">
              <span>COÛT PROCHAIN ÉCHELON</span>
              <span className="font-bold text-black font-mono">{formatInspiration(currentCost)} INSPIRATION</span>
            </div>
          </div>
        );

        return (
          <Tooltip key={device.id} content={tooltipContent} position="top" className="w-full block">
            <div
              id={`device-card-${device.id}`}
              onMouseEnter={() => soundEngine.playHover()}
              className={`shop-device-card group border border-black p-0 rounded-none grid grid-rows-[auto_auto_1fr_auto] transition-none w-full ${
                canAfford
                  ? 'bg-white text-black hover:bg-black hover:text-white'
                  : 'bg-[#F5F5F5] text-[#525252] border-[#525252] opacity-80'
              }`}
            >
              {/* Grid Row 1: Header Meta Bar with thin border */}
              <div className="grid grid-cols-12 items-center px-3 py-2 border-b border-current text-[10px] font-mono tracking-widest uppercase">
                <div className="col-span-5 flex items-center gap-1.5 font-bold">
                  <span>N° {indexStr}</span>
                </div>
                <div className="col-span-7 flex items-center justify-end gap-2">
                  <span>QTY × {formatInspiration(devState.owned)}</span>
                  <span
                    className="px-1 border border-current text-[9px] uppercase font-bold hover:bg-white hover:text-black group-hover:hover:bg-black group-hover:hover:text-white select-none"
                    title="Spécifications détaillées"
                  >
                    [ ⓘ ]
                  </span>
                </div>
              </div>

              {/* Grid Row 2: Title Cell with Playfair Display and thin border */}
              <div className="p-3.5 border-b border-current cursor-help">
                <h4 className="font-display font-bold text-lg sm:text-xl tracking-tight uppercase leading-snug flex items-center justify-between">
                  <span>{device.name}</span>
                  <span className="text-[10px] font-mono opacity-60">FICHE ↗</span>
                </h4>
                <div className="text-[10px] font-mono tracking-wider opacity-70 mt-1 uppercase flex justify-between">
                  <span>MATÉRIEL AUTOMATISÉ</span>
                  <span>STAND-ALONE</span>
                </div>
              </div>

              {/* Grid Row 3: Editorial Vertical Rhythm Metrics Grid with thin borders */}
              <div className="grid grid-rows-[auto_auto] border-b border-current cursor-help">
                {/* Dual-column rates */}
                <div className="grid grid-cols-2 divide-x divide-current font-mono text-[11px]">
                  <div className="p-2.5">
                    <span className="text-[9px] uppercase tracking-wider block opacity-70">
                      DÉBIT BASE
                    </span>
                    <span className="font-bold block mt-0.5">
                      +{formatInspiration(device.baseProduction)}/S
                    </span>
                  </div>
                  <div className="p-2.5">
                    <span className="text-[9px] uppercase tracking-wider block opacity-70">
                      EFFECTIF
                    </span>
                    <span className="font-bold block mt-0.5">
                      +{formatInspiration(effectiveUnitProd)}/S
                    </span>
                  </div>
                </div>

                {/* Total contribution row */}
                <div className="px-3 py-2 border-t border-current flex justify-between items-center font-mono text-xs bg-current/5">
                  <span className="text-[10px] uppercase tracking-wider opacity-80">
                    CONTRIBUTION :
                  </span>
                  <span className="font-bold">
                    +{formatInspiration(totalProduction)}/S
                  </span>
                </div>
              </div>

              {/* Grid Row 4: Action Cell (Zero-radius button flush to bottom) */}
              <div className="p-0 m-0">
                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuyDevice(device.id);
                  }}
                  className={`w-full py-3 px-3.5 font-mono text-xs font-bold uppercase tracking-wider transition-none min-h-[40px] flex items-center justify-between select-none ${
                    canAfford
                      ? 'cursor-pointer bg-black text-white group-hover:bg-white group-hover:text-black'
                      : 'cursor-not-allowed bg-transparent text-[#525252] opacity-60'
                  }`}
                >
                  <span>ACQUÉRIR</span>
                  <span>{formatInspiration(currentCost)}</span>
                </button>
              </div>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );

  return (
    <section className="w-full my-6">
      {/* ======================================================== */}
      {/* SECTION 01: MATÉRIEL D'ATELIER (8 設備典藏)                */}
      {/* ======================================================== */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 border-b-2 border-black pb-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block">
              SECTION 01 · MATÉRIEL DE PRODUCTION (8)
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black">
              設備典藏矩陣
            </h3>
          </div>
          <div className="font-mono text-xs text-[#525252] mt-1 sm:mt-0">
            AUTOPRODUCTION ACTIVE
          </div>
        </div>

        {renderDeviceGrid()}
      </div>

      {/* Heavy 4px Section Divider */}
      <div className="h-1 bg-black w-full mb-8" />

      {/* ======================================================== */}
      {/* SECTION 02: SYSTÈME DE COMPÉTENCES & RECHERCHE (技能研發體系) */}
      {/* ======================================================== */}
      <div className="mb-10">
        {/* Section Header & Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 border-b-2 border-black pb-3 gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block">
              SECTION 02 · ARBRE DES COMPÉTENCES & MODULES (20)
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black">
              技能與模組研發體系
            </h3>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-[#525252]">
            <span>MAÎTRISE :</span>
            <span className="font-bold text-black border border-black px-2 py-0.5 bg-white">
              {totalPurchasedSkills} / {totalSkillsCount} ACQUIS
            </span>
          </div>
        </div>

        {/* Filter Bar for Skills */}
        <div className="flex flex-wrap gap-2 mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTab();
              setSkillFilter('all');
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className={`px-3 py-1.5 border-2 border-black transition-none cursor-pointer uppercase ${
              skillFilter === 'all'
                ? 'bg-black text-white font-bold'
                : 'bg-white text-black hover:bg-[#F5F5F5]'
            }`}
          >
            TOUTES / 全部 (20)
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTab();
              setSkillFilter('global');
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className={`px-3 py-1.5 border-2 border-black transition-none cursor-pointer uppercase ${
              skillFilter === 'global'
                ? 'bg-black text-white font-bold'
                : 'bg-white text-black hover:bg-[#F5F5F5]'
            }`}
          >
            CANONS GLOBAUX / 全域典範 (4)
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTab();
              setSkillFilter('equipment');
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className={`px-3 py-1.5 border-2 border-black transition-none cursor-pointer uppercase ${
              skillFilter === 'equipment'
                ? 'bg-black text-white font-bold'
                : 'bg-white text-black hover:bg-[#F5F5F5]'
            }`}
          >
            MODULES D'ÉQUIPEMENT / 設備專屬模組 (16)
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTab();
              setSkillFilter('affordable');
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className={`px-3 py-1.5 border-2 border-black transition-none cursor-pointer uppercase ${
              skillFilter === 'affordable'
                ? 'bg-black text-white font-bold'
                : 'bg-white text-black hover:bg-[#F5F5F5]'
            }`}
          >
            DISPONIBLES / 可研發
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTab();
              setSkillFilter('purchased');
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className={`px-3 py-1.5 border-2 border-black transition-none cursor-pointer uppercase ${
              skillFilter === 'purchased'
                ? 'bg-black text-white font-bold'
                : 'bg-white text-black hover:bg-[#F5F5F5]'
            }`}
          >
            DÉJÀ ACQUIS / 已解鎖
          </button>
        </div>

        {/* Global Canons Sub-section (4 Canons) */}
        {filteredGlobalCanons.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-[#525252] border-b border-black pb-1.5 mb-3">
              <span>CANONS GLOBAUX · RÈGLES FONDAMENTALES</span>
              <span>EFFET PERMANENT SUR TOUTE L'ACTIVITÉ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredGlobalCanons.map((gu, index) => {
                const isPurchased = !!gameState.purchasedGlobalUpgrades[gu.id];
                const canAfford = !isPurchased && gameState.inspiration >= gu.cost;
                const roman = ['CANON I', 'CANON II', 'CANON III', 'CANON IV'][index] || `CANON ${index + 1}`;

                return (
                  <div
                    key={gu.id}
                    className={`group p-4 border-2 border-black flex flex-col justify-between transition-none ${
                      isPurchased
                        ? 'bg-black text-white'
                        : canAfford
                        ? 'bg-white text-black hover:bg-black hover:text-white'
                        : 'bg-[#F5F5F5] text-[#525252] border-[#525252]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase border-b border-current pb-1.5 mb-2">
                        <span className="font-bold">{roman}</span>
                        <span className="border border-current px-1.5 py-0.2">GLOBAL</span>
                      </div>

                      <h4 className="font-display font-bold text-base uppercase tracking-tight leading-snug">
                        {gu.name}
                      </h4>

                      <p className="font-serif italic text-xs mt-1.5 opacity-90 leading-relaxed">
                        {gu.description}
                      </p>

                      <div className="mt-3">
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-current font-bold">
                          {gu.clickMultiplier
                            ? `CLIC : ×${gu.clickMultiplier}`
                            : `PRODUCTION : ×${gu.productionMultiplier}`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-current flex justify-end">
                      {isPurchased ? (
                        <span className="w-full text-center py-2 font-mono text-xs tracking-widest uppercase border border-white bg-black text-white select-none">
                          ✓ CANON MAÎTRISÉ
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => onBuyGlobalUpgrade(gu.id)}
                          className={`w-full py-2 px-3 font-mono text-xs font-bold uppercase tracking-wider border-2 border-current transition-none min-h-[36px] flex items-center justify-between select-none ${
                            canAfford
                              ? 'cursor-pointer bg-black text-white group-hover:bg-white group-hover:text-black group-hover:border-white'
                              : 'cursor-not-allowed text-[#525252] opacity-60'
                          }`}
                        >
                          <span>INSTALLER</span>
                          <span>{formatInspiration(gu.cost)}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Equipment Modules Sub-section (16 Upgrades) */}
        {filteredEquipmentUpgrades.length > 0 && (
          <div>
            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-[#525252] border-b border-black pb-1.5 mb-3">
              <span>MODULES DE SPÉCIALISATION MATÉRIELLE (16)</span>
              <span>MULTIPLICATEURS ×2.0 CUMULATIFS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {filteredEquipmentUpgrades.map((upgrade, index) => {
                const isPurchased = !!gameState.purchasedUpgrades[upgrade.id];
                const canAfford = !isPurchased && gameState.inspiration >= upgrade.cost;
                const indexStr = String(index + 1).padStart(2, '0');
                const targetDevice = deviceMap.get(upgrade.deviceId);

                return (
                  <div
                    id={`upgrade-card-${upgrade.id}`}
                    key={upgrade.id}
                    className={`group p-3.5 border-2 border-black flex flex-col justify-between transition-none ${
                      isPurchased
                        ? 'bg-black text-white'
                        : canAfford
                        ? 'bg-white text-black hover:bg-black hover:text-white'
                        : 'bg-[#F5F5F5] text-[#525252] border-[#525252]'
                    }`}
                  >
                    <div>
                      {/* Top Bar: Code and Target Device */}
                      <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase border-b border-current pb-1.5 mb-2">
                        <span className="font-bold">MOD {indexStr}</span>
                        <span className="border border-current px-1 py-0.2 text-[9px] font-bold">
                          {targetDevice ? targetDevice.name : upgrade.deviceId}
                        </span>
                      </div>

                      <h5 className="font-display font-bold text-sm uppercase tracking-tight leading-snug">
                        {upgrade.name}
                      </h5>

                      <p className="font-serif text-xs mt-1 opacity-90 leading-relaxed">
                        {upgrade.description}
                      </p>

                      <div className="mt-2.5">
                        <span className="font-mono text-[10px] px-2 py-0.5 border border-current font-bold uppercase tracking-wider">
                          EFFET : ×{upgrade.multiplier}.0
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2 border-t border-current">
                      {isPurchased ? (
                        <div className="w-full text-center py-1.5 font-mono text-[11px] tracking-widest uppercase border border-white bg-black text-white select-none">
                          ✓ ACQUIS
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => onBuyUpgrade(upgrade.id)}
                          className={`w-full py-2 px-3 font-mono text-xs font-bold uppercase tracking-wider border-2 border-current transition-none min-h-[34px] flex items-center justify-between select-none ${
                            canAfford
                              ? 'cursor-pointer bg-black text-white group-hover:bg-white group-hover:text-black group-hover:border-white'
                              : 'cursor-not-allowed text-[#525252] opacity-60'
                          }`}
                        >
                          <span>RECHERCHER</span>
                          <span>{formatInspiration(upgrade.cost)}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state when filtering */}
        {filteredGlobalCanons.length === 0 && filteredEquipmentUpgrades.length === 0 && (
          <div className="p-8 border-2 border-black text-center font-mono text-xs text-[#525252] bg-[#F5F5F5]">
            AUCUNE COMPÉTENCE NE CORRESPOND AUX CRITÈRES SÉLECTIONNÉS.
          </div>
        )}

        {/* Overall Skills Progress Ribbon */}
        <div className="mt-6 border-2 border-black p-4 bg-[#F5F5F5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-black uppercase">
              RÉSUMÉ DE RECHERCHE ARCHITECTURALE :
            </span>
            <span className="text-[#525252]">
              {totalPurchasedSkills} / {totalSkillsCount} COMPÉTENCES MAÎTRISÉES ({((totalPurchasedSkills / totalSkillsCount) * 100).toFixed(0)}%)
            </span>
          </div>

          <div className="w-full sm:w-48 h-3 border border-black bg-white p-[1px]">
            <div
              className="h-full bg-black transition-none"
              style={{ width: `${(totalPurchasedSkills / totalSkillsCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 03: REGISTRE DE PRODUCTION GLOBALE (全域產能綜覽)     */}
      {/* ======================================================== */}
      <div className="mt-8 border-4 border-black bg-black text-white p-6 sm:p-8 bg-inverted-lines">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[#A3A3A3] block">
              REGISTRE DE PRODUCTION GLOBALE
            </span>
            <h4 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight mt-1">
              工坊全域產能綜覽
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 font-mono text-xs border-t md:border-t-0 md:border-l-2 border-[#525252] pt-4 md:pt-0 md:pl-8">
            <div>
              <span className="text-[10px] text-[#A3A3A3] uppercase block">MULTIPLICATEUR</span>
              <span className="text-xl font-bold text-white">×{formatInspiration(gameState.globalProductionMultiplier)}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#A3A3A3] uppercase block">PUISSANCE CLIC</span>
              <span className="text-xl font-bold text-white">×{formatInspiration(gameState.globalClickMultiplier)}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#A3A3A3] uppercase block">ÉQUIPEMENTS</span>
              <span className="text-xl font-bold text-white">
                {formatInspiration(DEVICES.reduce((sum, d) => sum + (gameState.devices[d.id]?.owned || 0), 0))}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#A3A3A3] uppercase block">TOTAL HISTORIQUE</span>
              <span className="text-xl font-bold text-white">
                {formatInspiration(gameState.totalInspiration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
