/**
 * 16-bit Pixel Art Sound & Music Engine for 《靈感工坊》
 * Direction: 16-bit Pixel Art, Warm, Creative Atelier, Light Chiptune / Lo-fi
 *
 * Implements:
 * - 4 Click variants: click_01 (wood/mech), click_02 (crisp), click_03 (paper/pencil), click_04 (electro)
 * - Combo sounds: combo_01 (4-6), combo_05 (7-9), combo_10 (10) with rising pitch
 * - Inspiration Burst: Charge -> Pitch rise -> Bright 8-bit -> Burst
 * - Purchase, Upgrade, Unlock, Error
 * - UI Hover, UI Tab
 * - Seamless Lo-fi 16-bit BGM (85 BPM loop)
 * - Ambient Room Studio atmosphere (gentle tape/air hum + typewriter/pencil/paper events)
 * - Volume hierarchy: Burst > Upgrade > Purchase > Click > UI > Ambient
 */

export interface AudioSettings {
  masterVolume: number; // 0 to 1
  sfxVolume: number; // 0 to 1
  bgmVolume: number; // 0 to 1
  ambientVolume: number; // 0 to 1
  isMuted: boolean;
  isBgmEnabled: boolean;
  isAmbientEnabled: boolean;
}

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 0.8,
  sfxVolume: 0.85,
  bgmVolume: 0.5,
  ambientVolume: 0.35,
  isMuted: false,
  isBgmEnabled: true,
  isAmbientEnabled: true,
};

const STORAGE_KEY = 'atelier_sound_settings_v1';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private settings: AudioSettings = DEFAULT_SETTINGS;

  // Master Gain Nodes
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  // Background Music Sequencer State
  private bgmIntervalId: number | null = null;
  private bgmStep = 0;
  private isBgmPlaying = false;

  // Ambient Room Generator State
  private ambientSourceNode: AudioNode | null = null;
  private ambientTimerId: number | null = null;
  private isAmbientPlaying = false;

  // Debounce for hover sound to avoid acoustic clutter
  private lastHoverTime = 0;

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Use defaults
    }
  }

  public saveSettings(newSettings: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Storage error
    }
    this.updateGains();
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);

      // SFX Bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.connect(this.masterGain);

      // BGM Bus
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.connect(this.masterGain);

      // Ambient Bus
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.connect(this.masterGain);

      this.updateGains();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private updateGains() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const isMuted = this.settings.isMuted;

    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(isMuted ? 0 : this.settings.masterVolume, now);
    }
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(this.settings.sfxVolume, now);
    }
    if (this.bgmGain) {
      const vol = this.settings.isBgmEnabled ? this.settings.bgmVolume * 0.35 : 0;
      this.bgmGain.gain.setValueAtTime(vol, now);
    }
    if (this.ambientGain) {
      const vol = this.settings.isAmbientEnabled ? this.settings.ambientVolume * 0.18 : 0;
      this.ambientGain.gain.setValueAtTime(vol, now);
    }
  }

  // ==========================================
  // 【主要互動】4 個普通點擊音效
  // ==========================================

  /**
   * 隨機播放 4 個點擊變體之一
   */
  public playClick() {
    const r = Math.random();
    if (r < 0.25) {
      this.playClick01();
    } else if (r < 0.5) {
      this.playClick02();
    } else if (r < 0.75) {
      this.playClick03();
    } else {
      this.playClick04();
    }
  }

  /**
   * click_01.wav: 輕微木質／機械按鍵感 (約 0.08~0.12s)
   */
  public playClick01() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.09);

    // Warm wood body filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.09);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * click_02.wav: 較清脆的像素微按鍵 (約 0.08~0.12s)
   */
  public playClick02() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(310, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * click_03.wav: 紙張／筆觸感 (約 0.09~0.14s)
   */
  public playClick03() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    // Buffer noise for paper friction
    const bufferSize = ctx.sampleRate * 0.11;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(3.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + 0.12);
  }

  /**
   * click_04.wav: 輕微 16-bit 電子感 (約 0.08~0.12s)
   */
  public playClick04() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // ==========================================
  // 【Combo 音效】隨 Combo 增加而提高音高
  // ==========================================

  public playCombo(combo: number) {
    if (combo < 4) return;
    if (combo >= 4 && combo <= 6) {
      this.playCombo01(combo);
    } else if (combo >= 7 && combo <= 9) {
      this.playCombo05(combo);
    } else if (combo >= 10) {
      this.playCombo10();
    }
  }

  /**
   * combo_01.wav: Combo 進入 4～6
   */
  public playCombo01(combo = 4) {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    // Pitch increases with combo level
    const pitchOffset = (combo - 4) * 35;
    const f1 = 330 + pitchOffset; // E4
    const f2 = 440 + pitchOffset; // A4

    [f1, f2].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.4, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.1);
    });
  }

  /**
   * combo_05.wav: Combo 進入 7～9
   */
  public playCombo05(combo = 7) {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    const pitchOffset = (combo - 7) * 45;
    const notes = [440 + pitchOffset, 554 + pitchOffset, 659 + pitchOffset]; // A4, C#5, E5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.5, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.11);
    });
  }

  /**
   * combo_10.wav: Combo 達到 10
   */
  public playCombo10() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    // 4-note ascending high chord trigger
    const notes = [587, 740, 880, 1174]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.045);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.55, now + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.13);
    });
  }

  // ==========================================
  // 【靈感爆發】inspiration_burst.wav
  // 充能 → 音高上升 → 高亮 8-bit 聲音 → 短暫爆發
  // ==========================================

  public playInspirationBurst() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    // Stage 1: Charge-up low-to-mid sweep (0.0s - 0.22s)
    const sweepOsc = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    const sweepFilter = ctx.createBiquadFilter();

    sweepOsc.type = 'sawtooth';
    sweepOsc.frequency.setValueAtTime(140, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(880, now + 0.22);

    sweepFilter.type = 'bandpass';
    sweepFilter.frequency.setValueAtTime(250, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(2200, now + 0.22);
    sweepFilter.Q.setValueAtTime(4.0, now);

    sweepGain.gain.setValueAtTime(0.2, now);
    sweepGain.gain.linearRampToValueAtTime(0.85, now + 0.22);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    sweepOsc.connect(sweepFilter);
    sweepFilter.connect(sweepGain);
    sweepGain.connect(this.sfxGain);

    sweepOsc.start(now);
    sweepOsc.stop(now + 0.26);

    // Stage 2: Rapid ascending bright 8-bit fanfare arpeggio (0.18s - 0.45s)
    const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    arpeggio.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now + 0.18 + idx * 0.04);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.75, now + 0.18 + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18 + idx * 0.04 + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + 0.18 + idx * 0.04);
      osc.stop(now + 0.18 + idx * 0.04 + 0.15);
    });

    // Stage 3: Brief retro explosive burst (0.35s - 0.65s)
    const bufSize = ctx.sampleRate * 0.3;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1600, now + 0.35);
    noiseFilter.frequency.exponentialRampToValueAtTime(250, now + 0.65);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.setValueAtTime(0.9, now + 0.35);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start(now + 0.35);
    noise.stop(now + 0.66);
  }

  // ==========================================
  // 【購買與反饋音效】
  // ==========================================

  /**
   * purchase.wav: 購買設備 (清脆 16-bit 交易音)
   */
  public playPurchase() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    const notes = [659.25, 987.77]; // E5 -> B5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.65, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.11);
    });
  }

  /**
   * upgrade.wav: 購買升級 (溫暖上揚的雙音和弦)
   */
  public playUpgrade() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    const notes = [587.33, 880.0, 1174.66]; // D5 -> A5 -> D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.75, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.16);
    });
  }

  /**
   * unlock.wav: 達成重要解鎖或首次取得高階設備
   */
  public playUnlock() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    // Triumphant 16-bit fanfare arpeggio
    const fanfare = [523.25, 659.25, 783.99, 1046.5]; // C5 -> E5 -> G5 -> C6
    fanfare.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.8, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + (idx === 3 ? 0.35 : 0.12));

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }

  /**
   * error.wav: 資源不足、無法購買 (悶鈍低音雙聲，不刺耳)
   */
  public playError() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.setValueAtTime(95, now + 0.06);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // ==========================================
  // 【UI 音效】
  // ==========================================

  /**
   * hover.wav: 滑鼠移到可互動 UI 元件 (極短微弱像素 tick)
   */
  public playHover() {
    const nowMs = performance.now();
    if (nowMs - this.lastHoverTime < 60) return; // Prevent audio burst during rapid pointer move
    this.lastHoverTime = nowMs;

    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(960, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * tab.wav: 設備／升級頁籤切換 (乾脆俐落的機械/紙質翻頁喀噠聲)
   */
  public playTab() {
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // ==========================================
  // 【背景音樂 BGM】bgm_main.mp3
  // 風格：Cozy 16-bit / Lo-fi (85 BPM 無縫循環)
  // ==========================================

  public startBGM() {
    if (this.isBgmPlaying) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.isBgmPlaying = true;
    this.bgmStep = 0;

    // 85 BPM -> 16th note duration = 60 / (85 * 4) = 0.1764s
    const stepDuration = (60 / (85 * 4)) * 1000;

    // 16-step Lo-Fi progression: Fmaj7 -> Em7 -> Dm7 -> Cmaj7
    const bassline = [
      174.61, 0, 174.61, 0, // F3
      164.81, 0, 164.81, 0, // E3
      146.83, 0, 146.83, 0, // D3
      130.81, 0, 196.0, 0,  // C3 -> G3
    ];

    const chords = [
      // Fmaj7 (A3, C4, E4)
      [220.0, 261.63, 329.63],
      [],
      [261.63, 329.63],
      [],
      // Em7 (G3, B3, D4)
      [196.0, 246.94, 293.66],
      [],
      [246.94, 293.66],
      [],
      // Dm7 (F3, A3, C4)
      [174.61, 220.0, 261.63],
      [],
      [220.0, 261.63],
      [],
      // Cmaj7 (E3, G3, B3)
      [164.81, 196.0, 246.94],
      [],
      [196.0, 246.94, 329.63],
      [],
    ];

    this.bgmIntervalId = window.setInterval(() => {
      if (!this.settings.isBgmEnabled || this.settings.isMuted) return;
      if (!this.ctx || !this.bgmGain) return;
      const now = this.ctx.currentTime;

      const step = this.bgmStep % 16;
      this.bgmStep++;

      // Play bass note
      const bassFreq = bassline[step];
      if (bassFreq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bassFreq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + 0.29);
      }

      // Play Lo-fi chord arpeggio
      const chordNotes = chords[step];
      if (chordNotes && chordNotes.length > 0) {
        chordNotes.forEach((f, idx) => {
          if (!this.ctx || !this.bgmGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'square';
          osc.frequency.setValueAtTime(f, now + idx * 0.02);

          // Warm lo-fi lowpass filtering to eliminate harshness
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(750, now);

          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.bgmGain);

          osc.start(now);
          osc.stop(now + 0.27);
        });
      }

      // Subtle Lo-fi percussive brush tap on 2 and 4 (steps 4 and 12)
      if (step === 4 || step === 12) {
        const bufSize = this.ctx.sampleRate * 0.04;
        const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buf;
        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'highpass';
        nFilter.frequency.setValueAtTime(4500, now);

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.07, now);
        nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(this.bgmGain);

        noise.start(now);
        noise.stop(now + 0.04);
      }
    }, stepDuration);
  }

  public stopBGM() {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.isBgmPlaying = false;
  }

  // ==========================================
  // 【環境音效】ambient_room.mp3
  // 工作室溫暖微弱環境聲（風扇微風、翻頁、鉛筆刷、機械鍵盤）
  // ==========================================

  public startAmbient() {
    if (this.isAmbientPlaying) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.isAmbientPlaying = true;

    // 1. Continuous ultra-low room / tape airiness hum
    try {
      const bufSize = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown/pink noise simulation
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      const roomHum = ctx.createBufferSource();
      roomHum.buffer = buf;
      roomHum.loop = true;

      const humFilter = ctx.createBiquadFilter();
      humFilter.type = 'lowpass';
      humFilter.frequency.setValueAtTime(260, ctx.currentTime);

      const humGain = ctx.createGain();
      humGain.gain.setValueAtTime(0.2, ctx.currentTime);

      roomHum.connect(humFilter);
      humFilter.connect(humGain);
      if (this.ambientGain) {
        humGain.connect(this.ambientGain);
      }

      roomHum.start(0);
      this.ambientSourceNode = roomHum;
    } catch {
      // Audio buffer initialization error
    }

    // 2. Sporadic subtle atelier sounds (keyboard click, pencil stroke, page turn)
    const scheduleNextEvent = () => {
      if (!this.isAmbientPlaying) return;
      const delay = 4000 + Math.random() * 5000; // Every 4~9 seconds

      this.ambientTimerId = window.setTimeout(() => {
        this.triggerStudioMicroEvent();
        scheduleNextEvent();
      }, delay);
    };

    scheduleNextEvent();
  }

  private triggerStudioMicroEvent() {
    if (!this.ctx || !this.ambientGain || !this.settings.isAmbientEnabled || this.settings.isMuted) return;
    const now = this.ctx.currentTime;
    const eventType = Math.random();

    if (eventType < 0.4) {
      // Subtle mechanical typewriter / keyboard tap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180 + Math.random() * 60, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ambientGain);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (eventType < 0.75) {
      // Soft pencil scratch on cotton paper
      const bufSize = Math.floor(this.ctx.sampleRate * 0.08);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(2.0, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      src.start(now);
      src.stop(now + 0.085);
    } else {
      // Delicate paper page turn
      const bufSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      src.start(now);
      src.stop(now + 0.13);
    }
  }

  public stopAmbient() {
    if (this.ambientTimerId !== null) {
      clearTimeout(this.ambientTimerId);
      this.ambientTimerId = null;
    }
    if (this.ambientSourceNode) {
      try {
        (this.ambientSourceNode as AudioScheduledSourceNode).stop();
        this.ambientSourceNode.disconnect();
      } catch {
        // Source already stopped
      }
      this.ambientSourceNode = null;
    }
    this.isAmbientPlaying = false;
  }

  /**
   * 啟動所有背景聲音 (於使用者首次點擊或互動時調用，遵循瀏覽器自動播放政策)
   */
  public ensureAudioRunning() {
    this.initContext();
    if (!this.isBgmPlaying && this.settings.isBgmEnabled && !this.settings.isMuted) {
      this.startBGM();
    }
    if (!this.isAmbientPlaying && this.settings.isAmbientEnabled && !this.settings.isMuted) {
      this.startAmbient();
    }
  }
}

export const soundEngine = new SoundEngine();
