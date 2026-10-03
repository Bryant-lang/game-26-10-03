/**
 * 《靈感工坊》新手教學與提示集中管理設定檔
 * 集中管理所有教學文字、觸發條件與目標元件 ID，方便後續微調與多語系維護。
 */

export interface TutorialStepConfig {
  id: string;
  triggerCondition: string;
  message: string;
  subMessage?: string;
  targetId?: string;
  arrowDirection?: 'up' | 'down' | 'left' | 'right';
  actionRequired?: string;
}

export const TUTORIAL_CONFIG = {
  // 開場動畫各階段文字
  intro: {
    title: '靈感工坊',
    stage1SoundPrompt: '啟動思考...',
    stage3InspirationGain: '+1 靈感',
    stage4Prompt: '點一下，開始你的第一個想法。',
    stage4Button: '開始創作',
    stage5DeviceName: '草稿桌',
    stage5DeviceRate: '+1 / 秒',
    stage5DeviceCost: '價格 15',
    stage5Prompt: '有了靈感，就能讓工作室自己運轉。',
    stage6Pillars: [
      '點擊　獲得靈感',
      '購買　生產設備',
      '升級　提高效率',
    ],
    stage6Closing: '剩下的，就交給你自己發現。',
    skipButton: '略過動畫 [ SKIP ]',
  },

  // 新手教學 5 大主要步驟
  steps: {
    // Tutorial 01: 點擊
    click: {
      id: 'step_click',
      triggerCondition: '遊戲第一次開始',
      message: '點一下燈泡。',
      successMessage: '很好，靈感從這裡開始。',
      targetId: 'tutorial-main-clicker',
      arrowDirection: 'down' as const,
    },
    // Tutorial 02: 累積
    accumulate: {
      id: 'step_accumulate',
      triggerCondition: 'inspiration >= 5',
      message: '靈感可以累積，繼續創作吧。',
      targetId: 'tutorial-inspiration-display',
      arrowDirection: 'up' as const,
    },
    // Tutorial 03: 第一台設備
    firstDevice: {
      id: 'step_first_device',
      triggerCondition: 'inspiration >= 15',
      message: '有足夠的靈感，就能建立設備。',
      targetId: 'device-card-draft_table',
      arrowDirection: 'down' as const,
    },
    // Tutorial 04: 被動生產
    passiveProduction: {
      id: 'step_passive_production',
      triggerCondition: '玩家成功購買第一台草稿桌',
      message: '草稿桌會自己工作。',
      followUpMessage: '現在，即使不點擊，也能獲得靈感。',
      targetId: 'tutorial-production-rate',
      arrowDirection: 'up' as const,
    },
    // Tutorial 05: 升級
    upgrade: {
      id: 'step_upgrade',
      triggerCondition: 'inspiration >= 250 且尚未購買高級紙材',
      message: '工作室還能變得更有效率。',
      upgradeName: '高級紙材',
      upgradeEffect: '草稿桌產量 ×2',
      upgradeCost: '價格 250',
      successMessage: '升級會永久提升生產效率。',
      targetId: 'upgrade-card-draft_table_up1',
      arrowDirection: 'down' as const,
    },
  },

  // Combo 教學回饋文字
  combo: {
    combo4: '連續點擊可以累積 Combo。',
    combo5: 'Combo 越高，距離靈感爆發越近。',
    combo10: '靈感爆發！',
  },
};
