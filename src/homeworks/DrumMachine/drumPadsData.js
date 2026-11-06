/**
 * HW1 Production Studio Drum Kit (Slide 26).
 * Physical key mappings (e.code) for W/A/S/D/J/K/L resilient to Vietnamese IME (UniKey).
 */

export const DRUM_PADS = [
  {
    id: 'crash',
    name: 'Crash Cymbal',
    shortcut: 'W',
    code: 'KeyW',
    color: '#38bdf8',
    category: 'cymbal',
    description: 'High-frequency metallic shimmer crash',
  },
  {
    id: 'clap',
    name: 'Hand Clap',
    shortcut: 'A',
    code: 'KeyA',
    color: '#a855f7',
    category: 'percussion',
    description: 'Triple burst 808-style studio clap',
  },
  {
    id: 'hihat-closed',
    name: 'Closed Hi-Hat',
    shortcut: 'S',
    code: 'KeyS',
    color: '#22c55e',
    category: 'hihat',
    description: 'Crisp, tight bandpass filtered hi-hat',
  },
  {
    id: 'kick',
    name: 'Punch Kick',
    shortcut: 'D',
    code: 'KeyD',
    color: '#ef4444',
    category: 'bass',
    description: 'Deep sine sub-bass transient punch',
  },
  {
    id: 'snare',
    name: 'Snare Drum',
    shortcut: 'J',
    code: 'KeyJ',
    color: '#f59e0b',
    category: 'snare',
    description: 'Dual tone acoustic & noise burst snare',
  },
  {
    id: 'hihat-open',
    name: 'Open Hi-Hat',
    shortcut: 'K',
    code: 'KeyK',
    color: '#10b981',
    category: 'hihat',
    description: 'Long ring sustaining open cymbal',
  },
  {
    id: 'ride',
    name: 'Ride Cymbal',
    shortcut: 'L',
    code: 'KeyL',
    color: '#ec4899',
    category: 'cymbal',
    description: 'Bright harmonic bell & wash ride',
  },
];

// Map lookup by W3C e.code for O(1) keydown routing
export const PAD_MAP = new Map(DRUM_PADS.map((pad) => [pad.code, pad]));

export default DRUM_PADS;
