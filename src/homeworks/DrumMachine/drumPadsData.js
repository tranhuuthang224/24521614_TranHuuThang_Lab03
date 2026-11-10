/**
 * HW1 Production Studio Drum Kit (Slide 26).
 * Physical key mappings (e.code) for W/A/S/D/J/K/L resilient to Vietnamese IME (UniKey).
 */

export const DRUM_PADS = [
  {
    id: 'crash',
    name: 'Crash Cymbal',
    label: 'Crash Cymbal',
    shortcut: 'W',
    keyLabel: 'W',
    code: 'KeyW',
    color: '#38bdf8',
    category: 'cymbal',
    frequency: '9.2 kHz Wash',
    description: 'High-frequency metallic shimmer crash',
  },
  {
    id: 'clap',
    name: 'Hand Clap',
    label: 'Hand Clap',
    shortcut: 'A',
    keyLabel: 'A',
    code: 'KeyA',
    color: '#a855f7',
    category: 'percussion',
    frequency: '1.2 kHz Burst',
    description: 'Triple burst 808-style studio clap',
  },
  {
    id: 'hihat-closed',
    name: 'Closed Hi-Hat',
    label: 'Closed Hi-Hat',
    shortcut: 'S',
    keyLabel: 'S',
    code: 'KeyS',
    color: '#22c55e',
    category: 'hihat',
    frequency: '7.5 kHz Choke',
    description: 'Crisp, tight bandpass filtered hi-hat',
  },
  {
    id: 'kick',
    name: 'Punch Kick',
    label: 'Punch Kick',
    shortcut: 'D',
    keyLabel: 'D',
    code: 'KeyD',
    color: '#ef4444',
    category: 'bass',
    frequency: '55 Hz Sub-bass',
    description: 'Deep sine sub-bass transient punch',
  },
  {
    id: 'snare',
    name: 'Snare Drum',
    label: 'Snare Drum',
    shortcut: 'J',
    keyLabel: 'J',
    code: 'KeyJ',
    color: '#f59e0b',
    category: 'snare',
    frequency: '220 Hz + Noise',
    description: 'Dual tone acoustic & noise burst snare',
  },
  {
    id: 'hihat-open',
    name: 'Open Hi-Hat',
    label: 'Open Hi-Hat',
    shortcut: 'K',
    keyLabel: 'K',
    code: 'KeyK',
    color: '#10b981',
    category: 'hihat',
    frequency: '6.8 kHz Ring',
    description: 'Long ring sustaining open cymbal',
  },
  {
    id: 'ride',
    name: 'Ride Cymbal',
    label: 'Ride Cymbal',
    shortcut: 'L',
    keyLabel: 'L',
    code: 'KeyL',
    color: '#ec4899',
    category: 'cymbal',
    frequency: '8.4 kHz Ping',
    description: 'Bright harmonic bell & wash ride',
  },
];

// Map lookup by W3C e.code for O(1) keydown routing
export const PAD_MAP = new Map(DRUM_PADS.map((pad) => [pad.code, pad]));

export default DRUM_PADS;
