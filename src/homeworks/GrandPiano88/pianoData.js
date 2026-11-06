/**
 * pianoData.js - Algorithmic 88-Key Generator (Slide 27)
 * Generates 88 piano keys from A0 (MIDI 21) to C8 (MIDI 108).
 * Mathematically derived: f = 440 * 2^((midi - 69) / 12)
 * Hardcoding 88 tags is banned!
 */

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BLACK_KEY_INDICES = new Set([1, 3, 6, 8, 10]); // C#, D#, F#, G#, A#

export function generate88Keys() {
  const keys = [];
  const startMidi = 21;  // A0
  const endMidi = 108;  // C8

  let whiteKeyIndex = 0;

  for (let midi = startMidi; midi <= endMidi; midi++) {
    const noteIndex = midi % 12;
    const noteNameWithoutOctave = NOTE_NAMES[noteIndex];
    const octave = Math.floor(midi / 12) - 1;
    const noteName = `${noteNameWithoutOctave}${octave}`;
    const isBlack = BLACK_KEY_INDICES.has(noteIndex);
    const frequencyHz = 440 * Math.pow(2, (midi - 69) / 12);

    const key = {
      midi,
      noteName,
      noteIndex,
      octave,
      isBlack,
      frequencyHz: Number(frequencyHz.toFixed(3)),
      whiteIndex: isBlack ? -1 : whiteKeyIndex,
      previousWhiteIndex: isBlack ? whiteKeyIndex - 1 : -1,
    };

    if (!isBlack) {
      whiteKeyIndex++;
    }

    keys.push(key);
  }

  return keys;
}

export const PIANO_KEYS = generate88Keys();
export const WHITE_KEYS_COUNT = PIANO_KEYS.filter((k) => !k.isBlack).length; // 52
export const BLACK_KEYS_COUNT = PIANO_KEYS.filter((k) => k.isBlack).length; // 36

// Sample Song: Fur Elise (Beethoven) opening theme for variable-speed FIFO sequencer demo
export const SAMPLE_SONG_FUR_ELISE = [
  { midi: 76, durationMs: 250, deltaMs: 0 },   // E5
  { midi: 75, durationMs: 250, deltaMs: 250 }, // D#5
  { midi: 76, durationMs: 250, deltaMs: 250 }, // E5
  { midi: 75, durationMs: 250, deltaMs: 250 }, // D#5
  { midi: 76, durationMs: 250, deltaMs: 250 }, // E5
  { midi: 71, durationMs: 250, deltaMs: 250 }, // B4
  { midi: 74, durationMs: 250, deltaMs: 250 }, // D5
  { midi: 72, durationMs: 250, deltaMs: 250 }, // C5
  { midi: 69, durationMs: 500, deltaMs: 250 }, // A4
];
