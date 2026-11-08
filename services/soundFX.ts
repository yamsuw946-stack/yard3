/**
 * Neon Cyberpunk Sound Effects Engine using Web Audio API
 * Provides zero-latency, synthwave/anime audio feedback for UI clicks,
 * 'Anime Training Mode' activation, and combat interactions.
 */

class SoundFXEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private volume: number = 0.3;

  constructor() {
    // Check initial user preference from localStorage
    const storedPref = localStorage.getItem('yard300_sound_enabled');
    if (storedPref !== null) {
      this.soundEnabled = storedPref === 'true';
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(enabled?: boolean): boolean {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    localStorage.setItem('yard300_sound_enabled', String(this.soundEnabled));
    if (this.soundEnabled) {
      this.playToggle(true);
    }
    return this.soundEnabled;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Crisp Neon Cyber Button Click
   */
  public playButtonClick(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      
      // Tone 1: Cyber chirp
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.04);
      gain1.gain.setValueAtTime(this.volume * 0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.05);

      // Tone 2: Sub click tick
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(220, now);
      osc2.frequency.exponentialRampToValueAtTime(110, now + 0.03);
      gain2.gain.setValueAtTime(this.volume * 0.3, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now);
      osc2.stop(now + 0.03);
    } catch (e) {
      // Ignore audio context errors
    }
  }

  /**
   * Epic 'Anime Training Mode' Start Sequence
   * Ascending synthwave chord, power-up charge, and combat energy burst
   */
  public playStartTrainingSound(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Sub Bass Energy Drop / Charge (60Hz -> 240Hz)
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(65, now);
      bassOsc.frequency.exponentialRampToValueAtTime(260, now + 0.4);

      // Low pass filter for warm cyber rumble
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.linearRampToValueAtTime(1200, now + 0.4);

      bassGain.gain.setValueAtTime(this.volume * 0.4, now);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(ctx.destination);

      bassOsc.start(now);
      bassOsc.stop(now + 0.5);

      // 2. Anime Arpeggio Chime (C4 - E4 - G4 - B4 - C5 - E5)
      const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 1046.50];
      notes.forEach((freq, index) => {
        const noteTime = now + 0.08 * index;
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(freq, noteTime);

        noteGain.gain.setValueAtTime(this.volume * 0.2, noteTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);

        noteOsc.start(noteTime);
        noteOsc.stop(noteTime + 0.25);
      });

      // 3. Cyber Laser Target Lock Flash (High synth sweep at t + 0.45s)
      const laserTime = now + 0.45;
      const laserOsc = ctx.createOscillator();
      const laserGain = ctx.createGain();

      laserOsc.type = 'square';
      laserOsc.frequency.setValueAtTime(1200, laserTime);
      laserOsc.frequency.exponentialRampToValueAtTime(3200, laserTime + 0.15);

      laserGain.gain.setValueAtTime(this.volume * 0.2, laserTime);
      laserGain.gain.exponentialRampToValueAtTime(0.001, laserTime + 0.18);

      laserOsc.connect(laserGain);
      laserGain.connect(ctx.destination);

      laserOsc.start(laserTime);
      laserOsc.stop(laserTime + 0.18);
    } catch (e) {
      // Ignore audio errors
    }
  }

  /**
   * UI Toggle Switch Sound (On/Off)
   */
  public playToggle(isOn: boolean = true): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isOn ? 520 : 380, now);
      osc.frequency.exponentialRampToValueAtTime(isOn ? 780 : 260, now + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      // Ignore audio errors
    }
  }

  /**
   * Strike / Hit Combo Sound
   */
  public playStrikeHit(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      // Ignore audio errors
    }
  }

  /**
   * Aura Surge / Ki Energy Power-Up Sound
   * Deep sub-bass resonance with high-frequency frequency ramp
   */
  public playAuraSurge(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Deep rumble charge
      const oscBass = ctx.createOscillator();
      const gainBass = ctx.createGain();
      oscBass.type = 'sawtooth';
      oscBass.frequency.setValueAtTime(80, now);
      oscBass.frequency.exponentialRampToValueAtTime(320, now + 0.35);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.35);

      gainBass.gain.setValueAtTime(this.volume * 0.35, now);
      gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      oscBass.connect(filter);
      filter.connect(gainBass);
      gainBass.connect(ctx.destination);

      oscBass.start(now);
      oscBass.stop(now + 0.4);

      // Shimmering harmonic chime
      const oscChime = ctx.createOscillator();
      const gainChime = ctx.createGain();
      oscChime.type = 'sine';
      oscChime.frequency.setValueAtTime(660, now + 0.05);
      oscChime.frequency.exponentialRampToValueAtTime(1320, now + 0.35);

      gainChime.gain.setValueAtTime(this.volume * 0.2, now + 0.05);
      gainChime.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      oscChime.connect(gainChime);
      gainChime.connect(ctx.destination);

      oscChime.start(now + 0.05);
      oscChime.stop(now + 0.4);
    } catch (e) {
      // Ignore audio errors
    }
  }

  /**
   * Super Saiyan / God-Tier Aura Burst Explosion
   */
  public playAuraBurst(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Heavy explosion boom
      const boom = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boom.type = 'triangle';
      boom.frequency.setValueAtTime(140, now);
      boom.frequency.exponentialRampToValueAtTime(30, now + 0.5);

      boomGain.gain.setValueAtTime(this.volume * 0.5, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      boom.connect(boomGain);
      boomGain.connect(ctx.destination);

      boom.start(now);
      boom.stop(now + 0.55);

      // Triple chord synth shockwave
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const chordOsc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        chordOsc.type = 'sine';
        chordOsc.frequency.setValueAtTime(freq, now + 0.04 * i);
        chordOsc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.4);

        chordGain.gain.setValueAtTime(this.volume * 0.25, now + 0.04 * i);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        chordOsc.connect(chordGain);
        chordGain.connect(ctx.destination);

        chordOsc.start(now + 0.04 * i);
        chordOsc.stop(now + 0.45);
      });
    } catch (e) {
      // Ignore audio errors
    }
  }

  public playLevelUp(): void {
    this.playAuraBurst();
  }

  public playPowerUp(): void {
    this.playAuraBurst();
  }

  public playLaser(): void {
    this.playButtonClick();
  }

  public playSuccess(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(this.volume * 0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch (e) {
      // Ignore audio errors
    }
  }

  public playNotificationSound(): void {
    this.playButtonClick();
  }

  public playVictorySound(): void {
    this.playAuraBurst();
  }

  public playError(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }
}

export const soundFX = new SoundFXEngine();
