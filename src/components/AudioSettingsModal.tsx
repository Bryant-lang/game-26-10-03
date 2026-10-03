import React, { useState, useEffect } from 'react';
import { soundEngine, AudioSettings } from '../utils/soundEngine';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AudioSettings>(soundEngine.getSettings());

  useEffect(() => {
    if (isOpen) {
      setSettings(soundEngine.getSettings());
      soundEngine.ensureAudioRunning();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateSetting = (key: keyof AudioSettings, value: number | boolean) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    soundEngine.saveSettings({ [key]: value });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 overflow-y-auto selection:bg-black selection:text-white"
    >
      <div className="bg-[#FFFFFF] border-4 border-black w-full max-w-xl text-black shadow-none flex flex-col my-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black p-4 bg-[#FFFFFF]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block">
              16-BIT PIXEL ART SOUND ENGINE // MIXER
            </span>
            <h2
              id="audio-settings-title"
              className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-black"
            >
              音效與音樂調音室
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border-2 border-black hover:bg-black hover:text-white transition-none cursor-pointer font-mono font-bold text-xs uppercase"
            aria-label="關閉"
          >
            ✕ FERMER
          </button>
        </div>

        {/* Mixer Sliders & Toggles */}
        <div className="p-4 sm:p-6 space-y-6 font-mono text-xs max-h-[75vh] overflow-y-auto">
          {/* Master Mute & Volume */}
          <div className="border border-black p-3.5 bg-[#F5F5F5] space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-black uppercase tracking-wider block">
                  主音量 (MASTER VOLUME)
                </span>
                <span className="text-[10px] text-[#525252]">優先級最高，主控全體聲道輸出</span>
              </div>
              <button
                type="button"
                onClick={() => updateSetting('isMuted', !settings.isMuted)}
                className={`px-3 py-1 border border-black font-bold uppercase cursor-pointer ${
                  settings.isMuted ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {settings.isMuted ? '🔇 已靜音 (MUTED)' : '🔊 聲音開啟 (ACTIVE)'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.masterVolume}
                disabled={settings.isMuted}
                onChange={(e) => updateSetting('masterVolume', parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <span className="w-12 text-right font-bold text-black">
                {Math.round(settings.masterVolume * 100)}%
              </span>
            </div>
          </div>

          {/* Individual Channels: BGM, SFX, Ambient */}
          <div className="space-y-4">
            {/* 1. BGM: Cozy 16-bit / Lo-fi */}
            <div className="border border-black p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black uppercase">背景音樂 (BGM MAIN)</span>
                    <span className="text-[9px] px-1 border border-black bg-[#F5F5F5]">85 BPM LO-FI</span>
                  </div>
                  <span className="text-[10px] text-[#525252]">溫暖 16-bit 和弦循環，不搶走操作專注</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateSetting('isBgmEnabled', !settings.isBgmEnabled)}
                  className={`px-2.5 py-0.5 border border-black text-[11px] font-bold uppercase cursor-pointer ${
                    settings.isBgmEnabled ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#E5E5E5]'
                  }`}
                >
                  {settings.isBgmEnabled ? '播放中' : '關閉'}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.bgmVolume}
                  disabled={!settings.isBgmEnabled || settings.isMuted}
                  onChange={(e) => updateSetting('bgmVolume', parseFloat(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <span className="w-12 text-right text-black font-bold">
                  {Math.round(settings.bgmVolume * 100)}%
                </span>
              </div>
            </div>

            {/* 2. SFX: 16-bit Interactions & Burst */}
            <div className="border border-black p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-black uppercase">遊戲互動音效 (SFX / PIXEL)</span>
                  <span className="text-[10px] text-[#525252] block">
                    點擊、Combo、靈感爆發、採購與升級回饋
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.sfxVolume}
                  disabled={settings.isMuted}
                  onChange={(e) => updateSetting('sfxVolume', parseFloat(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <span className="w-12 text-right text-black font-bold">
                  {Math.round(settings.sfxVolume * 100)}%
                </span>
              </div>
            </div>

            {/* 3. Ambient Room: Studio Atmosphere */}
            <div className="border border-black p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black uppercase">工作室環境聲 (AMBIENT ROOM)</span>
                    <span className="text-[9px] px-1 border border-black bg-[#F5F5F5]">ATMOSPHERE</span>
                  </div>
                  <span className="text-[10px] text-[#525252]">低音量房間底噪、翻頁、鉛筆刷、微機械鍵盤</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateSetting('isAmbientEnabled', !settings.isAmbientEnabled)}
                  className={`px-2.5 py-0.5 border border-black text-[11px] font-bold uppercase cursor-pointer ${
                    settings.isAmbientEnabled ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#E5E5E5]'
                  }`}
                >
                  {settings.isAmbientEnabled ? '播放中' : '關閉'}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.ambientVolume}
                  disabled={!settings.isAmbientEnabled || settings.isMuted}
                  onChange={(e) => updateSetting('ambientVolume', parseFloat(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <span className="w-12 text-right text-black font-bold">
                  {Math.round(settings.ambientVolume * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Sound Audition Panel (試聽所有 16-bit 音效) */}
          <div className="border border-black p-3.5 bg-[#F5F5F5] space-y-2.5">
            <div className="flex justify-between items-center border-b border-black/20 pb-1">
              <span className="font-bold uppercase tracking-wider text-[11px]">
                音效試聽矩陣 (AUDITION 16-BIT SFX)
              </span>
              <span className="text-[9px] text-[#525252]">CLICK TO AUDITION</span>
            </div>

            {/* Click Variants */}
            <div>
              <span className="text-[10px] text-[#525252] uppercase block mb-1">
                【主要點擊互動 (4 VARIANTS)】
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => soundEngine.playClick01()}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  CLICK 01 (木質)
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playClick02()}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  CLICK 02 (清脆)
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playClick03()}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  CLICK 03 (筆觸)
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playClick04()}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  CLICK 04 (電子)
                </button>
              </div>
            </div>

            {/* Combos & Flagship Burst */}
            <div>
              <span className="text-[10px] text-[#525252] uppercase block mb-1">
                【COMBO 連擊與旗艦靈感爆發】
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => soundEngine.playCombo01(5)}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  COMBO 01 (4~6)
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playCombo05(8)}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  COMBO 05 (7~9)
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playCombo10()}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  COMBO 10 (極限)
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playInspirationBurst()}
                  className="border-2 border-black bg-black text-white hover:bg-white hover:text-black p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  ⚡ 靈感爆發 (BURST)
                </button>
              </div>
            </div>

            {/* Shop & UI */}
            <div>
              <span className="text-[10px] text-[#525252] uppercase block mb-1">
                【交易回饋與 UI 操作】
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => soundEngine.playPurchase()}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  PURCHASE (購買)
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playUpgrade()}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  UPGRADE (升級)
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playUnlock()}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  UNLOCK (解鎖)
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playError()}
                  className="border border-black bg-white hover:bg-black hover:text-white p-1.5 text-[10px] uppercase font-bold text-center cursor-pointer transition-none"
                >
                  ERROR (不足)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black flex justify-between items-center bg-white font-mono text-xs">
          <span className="text-[#525252]">ATELIER D'INSPIRATION · AUDIO v1.0</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-black text-white px-5 py-2 uppercase font-bold tracking-wider hover:bg-white hover:text-black border-2 border-black transition-none cursor-pointer"
          >
            CONFIRMER / 確認完成
          </button>
        </div>
      </div>
    </div>
  );
};
