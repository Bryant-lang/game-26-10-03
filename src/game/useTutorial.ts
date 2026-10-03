import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../types/game';
import { TUTORIAL_CONFIG } from '../config/tutorialConfig';

const STORAGE_KEY_TUTORIAL = 'atelier_tutorial_completed_v1';
const STORAGE_KEY_INTRO = 'atelier_intro_seen_v1';

export type TutorialStepKey =
  | 'idle'
  | 'click'
  | 'accumulate'
  | 'first_device'
  | 'passive_production'
  | 'upgrade'
  | 'done';

export interface TutorialNotice {
  text: string;
  subText?: string;
  targetId?: string;
  arrow?: 'up' | 'down' | 'left' | 'right';
  badge?: string;
}

export function useTutorial(gameState: GameState) {
  // 開場動畫狀態
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY_INTRO);
      return !seen; // 第一次進入時為 true
    } catch {
      return true;
    }
  });

  // 教學完成狀態
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_TUTORIAL) === 'true';
    } catch {
      return false;
    }
  });

  // 當前教學步驟
  const [currentStep, setCurrentStep] = useState<TutorialStepKey>('idle');
  const [notice, setNotice] = useState<TutorialNotice | null>(null);
  const [comboToast, setComboToast] = useState<string | null>(null);

  // 教學歷程標記
  const flagsRef = useRef({
    hasClickedFirst: false,
    hasSeenAccumulate: false,
    hasBoughtFirstDevice: false,
    hasSeenPassive: false,
    hasBoughtFirstUpgrade: false,
    hasSeenCombo4: false,
    hasSeenCombo5: false,
    hasSeenCombo10: false,
  });

  // 定時器參考
  const noticeTimerRef = useRef<number | null>(null);
  const comboTimerRef = useRef<number | null>(null);

  // 清除計時器
  const clearNoticeTimer = () => {
    if (noticeTimerRef.current !== null) {
      clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = null;
    }
  };

  const clearComboTimer = () => {
    if (comboTimerRef.current !== null) {
      clearTimeout(comboTimerRef.current);
      comboTimerRef.current = null;
    }
  };

  // 顯示臨時提示
  const showTemporaryNotice = useCallback((newNotice: TutorialNotice, durationMs = 3000) => {
    clearNoticeTimer();
    setNotice(newNotice);
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null);
    }, durationMs);
  }, []);

  // 顯示 Combo 提示
  const showComboToast = useCallback((message: string, durationMs = 2500) => {
    clearComboTimer();
    setComboToast(message);
    comboTimerRef.current = window.setTimeout(() => {
      setComboToast(null);
    }, durationMs);
  }, []);

  // 初始化步驟（開場動畫結束後或首次進入遊戲）
  useEffect(() => {
    if (showIntro || tutorialCompleted) {
      return;
    }

    if (!flagsRef.current.hasClickedFirst && gameState.totalInspiration === 0) {
      setCurrentStep('click');
      setNotice({
        text: TUTORIAL_CONFIG.steps.click.message,
        targetId: TUTORIAL_CONFIG.steps.click.targetId,
        arrow: TUTORIAL_CONFIG.steps.click.arrowDirection,
        badge: 'TUTORIAL 01',
      });
    }
  }, [showIntro, tutorialCompleted, gameState.totalInspiration]);

  // 監聽遊戲數值觸發教學階段
  useEffect(() => {
    if (showIntro || tutorialCompleted) return;

    const draftTableCount = gameState.devices['draft_table']?.owned || 0;
    const hasDraftUpgrade = !!gameState.purchasedUpgrades['draft_table_up1'];

    // Tutorial 02: 累積 (inspiration >= 5 且尚未擁有第一台設備)
    if (
      flagsRef.current.hasClickedFirst &&
      !flagsRef.current.hasSeenAccumulate &&
      gameState.inspiration >= 5 &&
      draftTableCount === 0
    ) {
      flagsRef.current.hasSeenAccumulate = true;
      setCurrentStep('accumulate');
      showTemporaryNotice(
        {
          text: TUTORIAL_CONFIG.steps.accumulate.message,
          targetId: TUTORIAL_CONFIG.steps.accumulate.targetId,
          arrow: TUTORIAL_CONFIG.steps.accumulate.arrowDirection,
          badge: 'TUTORIAL 02',
        },
        4000
      );
      return;
    }

    // Tutorial 03: 第一台設備 (inspiration >= 15 且尚未擁有草稿桌)
    if (
      !flagsRef.current.hasBoughtFirstDevice &&
      gameState.inspiration >= 15 &&
      draftTableCount === 0
    ) {
      setCurrentStep('first_device');
      setNotice({
        text: TUTORIAL_CONFIG.steps.firstDevice.message,
        targetId: TUTORIAL_CONFIG.steps.firstDevice.targetId,
        arrow: TUTORIAL_CONFIG.steps.firstDevice.arrowDirection,
        badge: 'TUTORIAL 03',
      });
      return;
    }

    // Tutorial 04: 被動生產 (購買草稿桌後)
    if (
      draftTableCount >= 1 &&
      !flagsRef.current.hasSeenPassive &&
      flagsRef.current.hasBoughtFirstDevice
    ) {
      flagsRef.current.hasSeenPassive = true;
      setCurrentStep('passive_production');
      setNotice({
        text: TUTORIAL_CONFIG.steps.passiveProduction.message,
        badge: 'TUTORIAL 04',
      });

      // 玩家看到自動生產至少 2 秒後顯示進一步解說
      setTimeout(() => {
        showTemporaryNotice(
          {
            text: TUTORIAL_CONFIG.steps.passiveProduction.followUpMessage,
            targetId: TUTORIAL_CONFIG.steps.passiveProduction.targetId,
            arrow: TUTORIAL_CONFIG.steps.passiveProduction.arrowDirection,
            badge: 'TUTORIAL 04',
          },
          4500
        );
      }, 2200);
      return;
    }

    // Tutorial 05: 升級 (玩家擁有草稿桌，且靈感達到 250，尚未購買高級紙材)
    if (
      flagsRef.current.hasSeenPassive &&
      !hasDraftUpgrade &&
      !flagsRef.current.hasBoughtFirstUpgrade &&
      gameState.inspiration >= 250
    ) {
      setCurrentStep('upgrade');
      setNotice({
        text: TUTORIAL_CONFIG.steps.upgrade.message,
        subText: `${TUTORIAL_CONFIG.steps.upgrade.upgradeName} · ${TUTORIAL_CONFIG.steps.upgrade.upgradeEffect} (${TUTORIAL_CONFIG.steps.upgrade.upgradeCost})`,
        targetId: TUTORIAL_CONFIG.steps.upgrade.targetId,
        arrow: TUTORIAL_CONFIG.steps.upgrade.arrowDirection,
        badge: 'TUTORIAL 05',
      });
    }
  }, [
    showIntro,
    tutorialCompleted,
    gameState.inspiration,
    gameState.devices,
    gameState.purchasedUpgrades,
    showTemporaryNotice,
  ]);

  // 監聽 Combo 教學
  useEffect(() => {
    if (showIntro) return;

    if (gameState.combo >= 4 && gameState.combo < 5 && !flagsRef.current.hasSeenCombo4) {
      flagsRef.current.hasSeenCombo4 = true;
      showComboToast(TUTORIAL_CONFIG.combo.combo4, 3000);
    } else if (gameState.combo >= 5 && gameState.combo < 10 && !flagsRef.current.hasSeenCombo5) {
      flagsRef.current.hasSeenCombo5 = true;
      showComboToast(TUTORIAL_CONFIG.combo.combo5, 3000);
    }
  }, [showIntro, gameState.combo, showComboToast]);

  // 玩家點擊動作回饋
  const handlePlayerClick = useCallback(() => {
    if (currentStep === 'click' && !flagsRef.current.hasClickedFirst) {
      flagsRef.current.hasClickedFirst = true;
      showTemporaryNotice(
        {
          text: TUTORIAL_CONFIG.steps.click.successMessage,
          badge: 'TUTORIAL 01',
        },
        2200
      );
    }
  }, [currentStep, showTemporaryNotice]);

  // 玩家購買設備動作回饋
  const handleDeviceBought = useCallback((deviceId: string) => {
    if (deviceId === 'draft_table') {
      flagsRef.current.hasBoughtFirstDevice = true;
    }
  }, []);

  // 玩家購買升級動作回饋
  const handleUpgradeBought = useCallback(
    (upgradeId: string) => {
      if (upgradeId === 'draft_table_up1') {
        flagsRef.current.hasBoughtFirstUpgrade = true;
        setCurrentStep('done');
        setTutorialCompleted(true);
        try {
          localStorage.setItem(STORAGE_KEY_TUTORIAL, 'true');
        } catch {
          // localStorage error handled
        }

        showTemporaryNotice(
          {
            text: TUTORIAL_CONFIG.steps.upgrade.successMessage,
            badge: 'TUTORIAL TERMINÉ',
          },
          4000
        );
      }
    },
    [showTemporaryNotice]
  );

  // 玩家觸發靈感爆發動作回饋
  const handleBurstTriggered = useCallback(() => {
    if (!flagsRef.current.hasSeenCombo10) {
      flagsRef.current.hasSeenCombo10 = true;
      showComboToast(TUTORIAL_CONFIG.combo.combo10, 3500);
    }
  }, [showComboToast]);

  // 結束開場動畫
  const finishIntro = useCallback(() => {
    setShowIntro(false);
    try {
      localStorage.setItem(STORAGE_KEY_INTRO, 'true');
    } catch {
      // storage error
    }
  }, []);

  // 重新播放開場動畫
  const replayIntro = useCallback(() => {
    setShowIntro(true);
  }, []);

  return {
    showIntro,
    tutorialCompleted,
    currentStep,
    notice,
    comboToast,
    finishIntro,
    replayIntro,
    handlePlayerClick,
    handleDeviceBought,
    handleUpgradeBought,
    handleBurstTriggered,
  };
}
