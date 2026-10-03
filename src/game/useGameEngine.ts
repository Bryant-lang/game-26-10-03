import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, FloatingText } from '../types/game';
import {
  DEVICES,
  UPGRADES,
  GLOBAL_UPGRADES,
  INITIAL_STATE,
  calculateDeviceCost,
} from '../config/gameConfig';
import { formatInspiration } from '../utils/format';
import { soundEngine } from '../utils/soundEngine';

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isBurstActive, setIsBurstActive] = useState<boolean>(false);

  // References for requestAnimationFrame loop to ensure precise delta time
  const stateRef = useRef<GameState>(gameState);
  stateRef.current = gameState;

  const lastTimeRef = useRef<number>(performance.now());
  const comboDecayAccRef = useRef<number>(0);
  const nextTextIdRef = useRef<number>(1);

  // 計算每種設備當前每秒生產量
  const getDeviceProduction = useCallback(
    (deviceId: string, state: GameState = stateRef.current) => {
      const config = DEVICES.find((d) => d.id === deviceId);
      if (!config) return 0;
      const devState = state.devices[deviceId] || { owned: 0, productionMultiplier: 1 };
      return devState.owned * config.baseProduction * devState.productionMultiplier;
    },
    []
  );

  // 計算所有設備基礎每秒生產量總和
  const getBaseProductionTotal = useCallback((state: GameState = stateRef.current) => {
    return DEVICES.reduce((total, dev) => {
      const devState = state.devices[dev.id] || { owned: 0, productionMultiplier: 1 };
      return total + devState.owned * dev.baseProduction * devState.productionMultiplier;
    }, 0);
  }, []);

  // 計算最終每秒生產量（含全域倍率）
  const getFinalProductionPerSecond = useCallback((state: GameState = stateRef.current) => {
    const baseTotal = getBaseProductionTotal(state);
    return baseTotal * state.globalProductionMultiplier;
  }, [getBaseProductionTotal]);

  // 主要點擊「開始創作」
  const handleClick = useCallback((event?: React.MouseEvent) => {
    soundEngine.ensureAudioRunning();

    setGameState((prev) => {
      const clickAmount = prev.clickPower;
      const newInspiration = prev.inspiration + clickAmount;
      const newTotalInspiration = prev.totalInspiration + clickAmount;

      let newCombo = Math.min(10, prev.combo + 1);
      let burstOccurred = false;
      let burstAmount = 0;
      let newCooldown = prev.comboCooldown;

      // 檢查靈感爆發條件：
      // 當 Combo 達到 10 且不在冷卻中時觸發
      if (newCombo >= 10) {
        if (prev.comboCooldown <= 0) {
          burstOccurred = true;
          burstAmount = 100 * clickAmount;
          newCombo = 0;
          newCooldown = 5; // 5 秒冷卻
        } else {
          // 冷卻期間無法再次觸發靈感爆發，但仍然可以累積 Combo
          newCombo = 10;
        }
      }

      // 播放 16-bit 音效系統
      if (burstOccurred) {
        soundEngine.playInspirationBurst();
      } else if (newCombo >= 10) {
        soundEngine.playCombo10();
      } else if (newCombo >= 7) {
        soundEngine.playCombo05(newCombo);
      } else if (newCombo >= 4) {
        soundEngine.playCombo01(newCombo);
      } else {
        soundEngine.playClick();
      }

      const finalInspiration = newInspiration + burstAmount;
      const finalTotalInspiration = newTotalInspiration + burstAmount;

      // 浮動文字效果
      const textX = event ? event.clientX : window.innerWidth / 2;
      const textY = event ? event.clientY : window.innerHeight / 2;

      setFloatingTexts((texts) => [
        ...texts.slice(-15),
        {
          id: nextTextIdRef.current++,
          text: `+${formatInspiration(clickAmount)}`,
          x: textX + (Math.random() * 40 - 20),
          y: textY - 20,
          isBurst: false,
        },
        ...(burstOccurred
          ? [
              {
                id: nextTextIdRef.current++,
                text: `+${formatInspiration(burstAmount)} ÉCLAIR`,
                x: textX,
                y: textY - 60,
                isBurst: true,
              },
            ]
          : []),
      ]);

      if (burstOccurred) {
        setIsBurstActive(true);
        setTimeout(() => setIsBurstActive(false), 1200);
      }

      return {
        ...prev,
        inspiration: finalInspiration,
        totalInspiration: finalTotalInspiration,
        combo: newCombo,
        comboCooldown: newCooldown,
      };
    });
  }, []);

  // 購買設備
  const buyDevice = useCallback((deviceId: string) => {
    soundEngine.ensureAudioRunning();
    const config = DEVICES.find((d) => d.id === deviceId);
    if (!config) return;

    setGameState((prev) => {
      const devState = prev.devices[deviceId] || { owned: 0, productionMultiplier: 1 };
      const cost = calculateDeviceCost(config.baseCost, devState.owned);

      if (prev.inspiration < cost) {
        soundEngine.playError();
        return prev; // 靈感不足，不能讓靈感變成負數
      }

      // 首次購買高級設備播放解鎖音效，其餘播放標準購買音效
      if (devState.owned === 0 && config.baseProduction >= 50) {
        soundEngine.playUnlock();
      } else {
        soundEngine.playPurchase();
      }

      return {
        ...prev,
        inspiration: prev.inspiration - cost,
        devices: {
          ...prev.devices,
          [deviceId]: {
            ...devState,
            owned: devState.owned + 1,
          },
        },
      };
    });
  }, []);

  // 購買設備專屬升級
  const buyUpgrade = useCallback((upgradeId: string) => {
    soundEngine.ensureAudioRunning();
    const upgrade = UPGRADES.find((u) => u.id === upgradeId);
    if (!upgrade) return;

    setGameState((prev) => {
      if (prev.purchasedUpgrades[upgradeId]) return prev; // 只能購買一次
      if (prev.inspiration < upgrade.cost) {
        soundEngine.playError();
        return prev; // 靈感不足
      }

      soundEngine.playUpgrade();
      const devState = prev.devices[upgrade.deviceId] || { owned: 0, productionMultiplier: 1 };

      return {
        ...prev,
        inspiration: prev.inspiration - upgrade.cost,
        purchasedUpgrades: {
          ...prev.purchasedUpgrades,
          [upgradeId]: true,
        },
        devices: {
          ...prev.devices,
          [upgrade.deviceId]: {
            ...devState,
            productionMultiplier: devState.productionMultiplier * upgrade.multiplier,
          },
        },
      };
    });
  }, []);

  // 購買全域升級
  const buyGlobalUpgrade = useCallback((globalUpgradeId: string) => {
    soundEngine.ensureAudioRunning();
    const upgrade = GLOBAL_UPGRADES.find((u) => u.id === globalUpgradeId);
    if (!upgrade) return;

    setGameState((prev) => {
      if (prev.purchasedGlobalUpgrades[globalUpgradeId]) return prev; // 只能購買一次
      if (prev.inspiration < upgrade.cost) {
        soundEngine.playError();
        return prev; // 靈感不足
      }

      soundEngine.playUnlock();
      const newGlobalClickMultiplier =
        prev.globalClickMultiplier * (upgrade.clickMultiplier ?? 1);
      const newGlobalProdMultiplier =
        prev.globalProductionMultiplier * (upgrade.productionMultiplier ?? 1);

      // 點擊力量由基礎 1 乘上全域點擊倍率
      const newClickPower = 1 * newGlobalClickMultiplier;

      return {
        ...prev,
        inspiration: prev.inspiration - upgrade.cost,
        clickPower: newClickPower,
        globalClickMultiplier: newGlobalClickMultiplier,
        globalProductionMultiplier: newGlobalProdMultiplier,
        purchasedGlobalUpgrades: {
          ...prev.purchasedGlobalUpgrades,
          [globalUpgradeId]: true,
        },
      };
    });
  }, []);

  // 清除浮動文字
  const removeFloatingText = useCallback((id: number) => {
    setFloatingTexts((texts) => texts.filter((t) => t.id !== id));
  }, []);

  // 遊戲主循環（高精度時間差更新被動生產、Combo 衰減、冷卻時間）
  useEffect(() => {
    let animationFrameId: number;
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const deltaSeconds = Math.min((now - lastTimeRef.current) / 1000, 0.5); // 防止切換分頁產生巨大突波
      lastTimeRef.current = now;

      if (deltaSeconds > 0) {
        setGameState((prev) => {
          // 1. 被動生產計算
          const baseProdTotal = DEVICES.reduce((total, dev) => {
            const devState = prev.devices[dev.id] || { owned: 0, productionMultiplier: 1 };
            return total + devState.owned * dev.baseProduction * devState.productionMultiplier;
          }, 0);
          const currentProductionPerSec = baseProdTotal * prev.globalProductionMultiplier;
          const passiveGain = currentProductionPerSec * deltaSeconds;

          // 2. 冷卻時間遞減
          const newCooldown = Math.max(0, prev.comboCooldown - deltaSeconds);

          // 3. Combo 衰減（每 1 秒減少 1，不低於 0）
          comboDecayAccRef.current += deltaSeconds;
          let newCombo = prev.combo;
          if (comboDecayAccRef.current >= 1.0) {
            const decaySteps = Math.floor(comboDecayAccRef.current);
            comboDecayAccRef.current -= decaySteps;
            newCombo = Math.max(0, prev.combo - decaySteps);
          }

          return {
            ...prev,
            inspiration: prev.inspiration + passiveGain,
            totalInspiration: prev.totalInspiration + passiveGain,
            comboCooldown: newCooldown,
            combo: newCombo,
          };
        });
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return {
    gameState,
    floatingTexts,
    isBurstActive,
    handleClick,
    buyDevice,
    buyUpgrade,
    buyGlobalUpgrade,
    removeFloatingText,
    getDeviceProduction,
    getBaseProductionTotal,
    getFinalProductionPerSecond,
  };
}
