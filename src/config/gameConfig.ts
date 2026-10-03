import { DeviceConfig, UpgradeConfig, GlobalUpgradeConfig, GameState } from '../types/game';

// ==========================================
// 設備配置 (8 種設備)
// ==========================================
export const DEVICES: DeviceConfig[] = [
  {
    id: 'draft_table',
    name: '草稿桌',
    baseCost: 15,
    baseProduction: 1,
    positionDesc: '最基礎的自動生產設備。',
    iconId: 'draft_table',
  },
  {
    id: 'bookshelf',
    name: '靈感書架',
    baseCost: 100,
    baseProduction: 5,
    positionDesc: '第二階段自動生產設備。',
    iconId: 'bookshelf',
  },
  {
    id: 'computer',
    name: '創作電腦',
    baseCost: 500,
    baseProduction: 20,
    positionDesc: '中期主要生產來源。',
    iconId: 'computer',
  },
  {
    id: 'workstation',
    name: '專業工作站',
    baseCost: 2500,
    baseProduction: 100,
    positionDesc: '專業級生產工作站。',
    iconId: 'workstation',
  },
  {
    id: 'studio',
    name: '創意工作室',
    baseCost: 12000,
    baseProduction: 450,
    positionDesc: '獨立空間的創意工作室。',
    iconId: 'studio',
  },
  {
    id: 'research_center',
    name: '研究中心',
    baseCost: 60000,
    baseProduction: 2000,
    positionDesc: '高科技研發與概念孵化中心。',
    iconId: 'research_center',
  },
  {
    id: 'creation_base',
    name: '大型創作基地',
    baseCost: 300000,
    baseProduction: 9000,
    positionDesc: '規模龐大的集體創作基地。',
    iconId: 'creation_base',
  },
  {
    id: 'creative_factory',
    name: '創意工廠',
    baseCost: 1500000,
    baseProduction: 45000,
    positionDesc: '自動化工業級靈感量產工廠。',
    iconId: 'creative_factory',
  },
];

// ==========================================
// 設備專屬升級 (每種設備 2 個升級，共 16 個)
// ==========================================
export const UPGRADES: UpgradeConfig[] = [
  // 草稿桌升級
  {
    id: 'draft_table_up1',
    deviceId: 'draft_table',
    name: '高級紙材',
    cost: 250,
    multiplier: 2,
    description: '草稿桌產量 ×2',
    iconId: 'high_grade_paper',
  },
  {
    id: 'draft_table_up2',
    deviceId: 'draft_table',
    name: '快速構思',
    cost: 1000,
    multiplier: 2,
    description: '草稿桌產量再 ×2',
    iconId: 'quick_concept',
  },

  // 靈感書架升級
  {
    id: 'bookshelf_up1',
    deviceId: 'bookshelf',
    name: '分類整理',
    cost: 1500,
    multiplier: 2,
    description: '靈感書架產量 ×2',
    iconId: 'categorize',
  },
  {
    id: 'bookshelf_up2',
    deviceId: 'bookshelf',
    name: '靈感索引',
    cost: 6000,
    multiplier: 2,
    description: '靈感書架產量再 ×2',
    iconId: 'inspiration_index',
  },

  // 創作電腦升級
  {
    id: 'computer_up1',
    deviceId: 'computer',
    name: '高速處理器',
    cost: 8000,
    multiplier: 2,
    description: '創作電腦產量 ×2',
    iconId: 'fast_cpu',
  },
  {
    id: 'computer_up2',
    deviceId: 'computer',
    name: '多工創作',
    cost: 30000,
    multiplier: 2,
    description: '創作電腦產量再 ×2',
    iconId: 'multitasking',
  },

  // 專業工作站升級
  {
    id: 'workstation_up1',
    deviceId: 'workstation',
    name: '專業設備',
    cost: 40000,
    multiplier: 2,
    description: '專業工作站產量 ×2',
    iconId: 'pro_equipment',
  },
  {
    id: 'workstation_up2',
    deviceId: 'workstation',
    name: '最佳化流程',
    cost: 150000,
    multiplier: 2,
    description: '專業工作站產量再 ×2',
    iconId: 'optimized_flow',
  },

  // 創意工作室升級
  {
    id: 'studio_up1',
    deviceId: 'studio',
    name: '完整工具組',
    cost: 180000,
    multiplier: 2,
    description: '創意工作室產量 ×2',
    iconId: 'full_toolset',
  },
  {
    id: 'studio_up2',
    deviceId: 'studio',
    name: '高效率流程',
    cost: 700000,
    multiplier: 2,
    description: '創意工作室產量再 ×2',
    iconId: 'efficient_process',
  },

  // 研究中心升級
  {
    id: 'research_center_up1',
    deviceId: 'research_center',
    name: '資料中心',
    cost: 900000,
    multiplier: 2,
    description: '研究中心產量 ×2',
    iconId: 'data_center',
  },
  {
    id: 'research_center_up2',
    deviceId: 'research_center',
    name: '高速研究',
    cost: 3500000,
    multiplier: 2,
    description: '研究中心產量再 ×2',
    iconId: 'highspeed_research',
  },

  // 大型創作基地升級
  {
    id: 'creation_base_up1',
    deviceId: 'creation_base',
    name: '模組化生產',
    cost: 5000000,
    multiplier: 2,
    description: '大型創作基地產量 ×2',
    iconId: 'modular_production',
  },
  {
    id: 'creation_base_up2',
    deviceId: 'creation_base',
    name: '智慧管理',
    cost: 20000000,
    multiplier: 2,
    description: '大型創作基地產量再 ×2',
    iconId: 'smart_management',
  },

  // 創意工廠升級
  {
    id: 'creative_factory_up1',
    deviceId: 'creative_factory',
    name: '自動化生產',
    cost: 25000000,
    multiplier: 2,
    description: '創意工廠產量 ×2',
    iconId: 'automation',
  },
  {
    id: 'creative_factory_up2',
    deviceId: 'creative_factory',
    name: '全面最佳化',
    cost: 100000000,
    multiplier: 2,
    description: '創意工廠產量再 ×2',
    iconId: 'total_optimization',
  },
];

// ==========================================
// 全域升級 (4 個)
// ==========================================
export const GLOBAL_UPGRADES: GlobalUpgradeConfig[] = [
  {
    id: 'global_habit',
    name: '創作習慣',
    cost: 5000,
    description: '所有點擊力量 ×2',
    iconId: 'inspiration',
    clickMultiplier: 2,
  },
  {
    id: 'global_thinking',
    name: '高效率思考',
    cost: 50000,
    description: '所有自動生產 ×1.25',
    iconId: 'gear',
    productionMultiplier: 1.25,
  },
  {
    id: 'global_environment',
    name: '創作環境改善',
    cost: 500000,
    description: '所有自動生產 ×1.5',
    iconId: 'up_arrow',
    productionMultiplier: 1.5,
  },
  {
    id: 'global_creator_state',
    name: '創作者狀態',
    cost: 5000000,
    description: '所有點擊力量 ×2、所有自動生產 ×2',
    iconId: 'star',
    clickMultiplier: 2,
    productionMultiplier: 2,
  },
];

// ==========================================
// 價格計算公式
// current_cost = floor(base_cost × 1.15 ^ owned)
// ==========================================
export function calculateDeviceCost(baseCost: number, owned: number): number {
  return Math.floor(baseCost * Math.pow(1.15, owned));
}

// ==========================================
// 數值顯示規則
// 靈感小於 1000：顯示整數
// 靈感達到 1000：可以使用 K、M、B、T 等簡化格式
// ==========================================
export { formatInspiration, formatRate } from '../utils/format';
export { formatInspiration as formatNumber } from '../utils/format';

// 初始遊戲狀態
export const INITIAL_STATE: GameState = {
  inspiration: 0,
  totalInspiration: 0,
  clickPower: 1,
  combo: 0,
  comboCooldown: 0,
  globalProductionMultiplier: 1.0,
  globalClickMultiplier: 1.0,
  devices: {
    draft_table: { owned: 0, productionMultiplier: 1 },
    bookshelf: { owned: 0, productionMultiplier: 1 },
    computer: { owned: 0, productionMultiplier: 1 },
    workstation: { owned: 0, productionMultiplier: 1 },
    studio: { owned: 0, productionMultiplier: 1 },
    research_center: { owned: 0, productionMultiplier: 1 },
    creation_base: { owned: 0, productionMultiplier: 1 },
    creative_factory: { owned: 0, productionMultiplier: 1 },
  },
  purchasedUpgrades: {},
  purchasedGlobalUpgrades: {},
};
