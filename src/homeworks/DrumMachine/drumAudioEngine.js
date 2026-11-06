/**
 * Web Audio API Synthesis Engine for Studio Drum Kit.
 * Pure native zero-latency algorithmic synthesis (no external MP3/WAV dependencies).
 */

class DrumAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.volume = 0.8;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  createNoiseBuffer(duration = 1) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  playKick(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  playSnare(now) {
    // Noise component
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.2);
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(800, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    // Tonal pop component
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.7, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    noise.start(now);
    osc.start(now);
    noise.stop(now + 0.21);
    osc.stop(now + 0.13);
  }

  playHiHat(now, isOpen = false) {
    const duration = isOpen ? 0.35 : 0.06;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + duration + 0.01);
  }

  playClap(now) {
    const burstCount = 3;
    const burstInterval = 0.012;

    for (let i = 0; i < burstCount; i++) {
      const burstTime = now + i * burstInterval;
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(0.02);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, burstTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, burstTime);
      gain.gain.exponentialRampToValueAtTime(0.01, burstTime + 0.02);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(burstTime);
      noise.stop(burstTime + 0.021);
    }

    // Reverberant tail
    const tail = this.ctx.createBufferSource();
    tail.buffer = this.createNoiseBuffer(0.18);
    const tailFilter = this.ctx.createBiquadFilter();
    tailFilter.type = 'bandpass';
    tailFilter.frequency.setValueAtTime(1100, now + 0.036);
    const tailGain = this.ctx.createGain();
    tailGain.gain.setValueAtTime(0.7, now + 0.036);
    tailGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    tail.connect(tailFilter);
    tailFilter.connect(tailGain);
    tailGain.connect(this.masterGain);
    tail.start(now + 0.036);
    tail.stop(now + 0.23);
  }

  playCrash(now) {
    const duration = 0.8;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5000, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + duration + 0.02);
  }

  playRide(now) {
    const duration = 0.65;
    // Metallic bell tone
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(820, now);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    // Wash shimmer
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(duration);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.start(now);
    noise.start(now);
    osc.stop(now + duration + 0.01);
    noise.stop(now + duration + 0.01);
  }

  trigger(padId) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    switch (padId) {
      case 'kick':
        this.playKick(now);
        break;
      case 'snare':
        this.playSnare(now);
        break;
      case 'hihat-closed':
        this.playHiHat(now, false);
        break;
      case 'hihat-open':
        this.playHiHat(now, true);
        break;
      case 'clap':
        this.playClap(now);
        break;
      case 'crash':
        this.playCrash(now);
        break;
      case 'ride':
        this.playRide(now);
        break;
      default:
        this.playKick(now);
    }
  }
}

export const drumAudioEngine = new DrumAudioEngine();
export default drumAudioEngine;
