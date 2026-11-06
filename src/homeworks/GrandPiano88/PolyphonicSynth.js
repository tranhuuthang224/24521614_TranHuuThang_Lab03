/**
 * PolyphonicSynth.js - HW 2 Web Audio Voice Pool & FIFO Stealing (Slide 28)
 * Concurrency & Memory Hygiene Rules:
 * - O(1) Active Voice Tracking via ES6 Map (FIFO insertion order).
 * - Max 8 simultaneous voices; 9th note steals the oldest voice in FIFO order.
 * - Click-Free ADSR Envelope: exponentialRampToValueAtTime to eliminate audio pop.
 */

export class PolyphonicSynth {
  constructor(maxVoices = 8) {
    this.ctx = null;
    this.maxVoices = maxVoices;
    this.voices = new Map(); // FIFO insertion order: midi -> { osc, gain, masterGain }
    this.masterGainNode = null;
    this.masterVolume = 0.5;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  noteOn(midi, freqHz) {
    this.initContext();

    // Prevent duplicate voice for the same MIDI note
    if (this.voices.has(midi)) {
      this.noteOff(midi);
    }

    // FIFO Voice Stealing: Release oldest voice if limit reached
    if (this.voices.size >= this.maxVoices) {
      const oldestMidi = this.voices.keys().next().value;
      this.noteOff(oldestMidi);
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Harmonic richness: Triangle wave mimics warm grand piano body
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freqHz, now);

    // Initial attack envelope: Smooth linear attack to prevent clicks
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.015);
    // Gentle natural decay
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGainNode);

    osc.start(now);
    this.voices.set(midi, { osc, gain });

    return this.getActiveVoiceMidis();
  }

  noteOff(midi) {
    if (!this.voices.has(midi) || !this.ctx) return;

    const voice = this.voices.get(midi);
    this.voices.delete(midi);

    const now = this.ctx.currentTime;
    const releaseTime = 0.05;

    try {
      // Click-Free ADSR Release Ramp
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
      voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);
      voice.osc.stop(now + releaseTime);

      setTimeout(() => {
        try {
          voice.osc.disconnect();
          voice.gain.disconnect();
        } catch {
          // Nodes already cleaned up
        }
      }, (releaseTime + 0.02) * 1000);
    } catch {
      // AudioContext state exception safety
    }

    return this.getActiveVoiceMidis();
  }

  allNotesOff() {
    const midis = Array.from(this.voices.keys());
    midis.forEach((m) => this.noteOff(m));
  }

  getActiveVoiceMidis() {
    return Array.from(this.voices.keys());
  }

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  dispose() {
    this.allNotesOff();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {});
    }
  }
}
