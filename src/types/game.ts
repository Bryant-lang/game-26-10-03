export interface DeviceConfig {
  id: string;
  name: string;
  baseCost: number;
  baseProduction: number;
  positionDesc: string;
  iconId: string;
}

export interface UpgradeConfig {
  id: string;
  deviceId: string;
  name: string;
  cost: number;
  multiplier: number;
  description: string;
  iconId: string;
}

export interface GlobalUpgradeConfig {
  id: string;
  name: string;
  cost: number;
  description: string;
  iconId: string;
  clickMultiplier?: number;
  productionMultiplier?: number;
}

export interface DeviceState {
  owned: number;
  productionMultiplier: number;
}

export interface GameState {
  inspiration: number;
  totalInspiration: number;
  clickPower: number;
  combo: number;
  comboCooldown: number;
  globalProductionMultiplier: number;
  globalClickMultiplier: number;
  devices: Record<string, DeviceState>;
  purchasedUpgrades: Record<string, boolean>;
  purchasedGlobalUpgrades: Record<string, boolean>;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  isBurst?: boolean;
}
