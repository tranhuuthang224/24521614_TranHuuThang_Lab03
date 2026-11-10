import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { PIANO_KEYS, SAMPLE_SONG_FUR_ELISE } from './pianoData';
import { PolyphonicSynth } from './PolyphonicSynth';
import { PianoKey } from './PianoKey';
import styles from './GrandPiano88.module.css';

/**
 * Computer keyboard bindings for the Middle Octave (C4 - C5)
 * Allows testing polyphony and chords on laptop/desktop without touch screen
 */
const KEYBOARD_MAP = {
  KeyA: 60, // C4
  KeyW: 61, // C#4
  KeyS: 62, // D4
  KeyE: 63, // D#4
  KeyD: 64, // E4
  KeyF: 65, // F4
  KeyT: 66, // F#4
  KeyG: 67, // G4
  KeyY: 68, // G#4
  KeyH: 69, // A4 (440Hz reference)
  KeyU: 70, // A#4
  KeyJ: 71, // B4
  KeyK: 72, // C5
};

/**
 * GrandPiano88 Component (Homework 2 - Slide 27 & 28)
 * 88-Key Polyphonic Piano & Concurrent FIFO Sequencer
 * Features:
 * - 88 algorithmic keys (52 white, 36 black)
 * - 8-voice polyphony with O(1) Map-based FIFO voice stealing
 * - Click-free ADSR exponential release ramp
 * - React.memo render isolation per key
 * - FIFO recorder & replay with AbortController cancellation and 0.5x/1.0x/2.0x speed
 * - Octave filtering with adaptive black-key CSS variable alignment
 */
export function GrandPiano88() {
  const synthRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [activeMidis, setActiveMidis] = useState(new Set());
  const [selectedOctaveFilter, setSelectedOctaveFilter] = useState('ALL');
  const [volume, setVolume] = useState(0.6);

  // Sequencer state
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const recordStartTimeRef = useRef(0);
  const lastNoteTimeRef = useRef(0);

  // Initialize synth singleton on mount
  useEffect(() => {
    synthRef.current = new PolyphonicSynth(8);
    synthRef.current.setMasterVolume(volume);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  // Update volume
  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (synthRef.current) {
      synthRef.current.setMasterVolume(val);
    }
  };

  // Note On handler (Triggered by pointer down or keyboard)
  const handleNoteOn = useCallback((midi) => {
    if (!synthRef.current) return;
    const key = PIANO_KEYS.find((k) => k.midi === midi);
    if (!key) return;

    // Trigger audio oscillator in voice pool & sync active voices (handles FIFO voice stealing)
    const activeVoiceList = synthRef.current.noteOn(midi, key.frequencyHz);
    setActiveMidis(new Set(activeVoiceList));

    // Record note if recording is active
    if (isRecording) {
      const now = Date.now();
      const deltaMs = lastNoteTimeRef.current ? now - lastNoteTimeRef.current : 0;
      lastNoteTimeRef.current = now;
      setRecordedNotes((prev) => [
        ...prev,
        {
          midi,
          freqHz: key.frequencyHz,
          noteName: key.noteName,
          deltaMs: Math.max(50, Math.min(2000, deltaMs || 250)),
          durationMs: 350,
        },
      ]);
    }
  }, [isRecording]);

  // Note Off handler (Triggered by pointer up or leave)
  const handleNoteOff = useCallback((midi) => {
    if (!synthRef.current) return;
    const activeVoiceList = synthRef.current.noteOff(midi);
    setActiveMidis(new Set(activeVoiceList));
  }, []);

  // Computer Keyboard Listener (A..K keys for C4..C5)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return; // Anti-repeat guard
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return; // Input isolation
      const midi = KEYBOARD_MAP[e.code];
      if (midi) {
        e.preventDefault();
        handleNoteOn(midi);
      }
    };

    const handleKeyUp = (e) => {
      const midi = KEYBOARD_MAP[e.code];
      if (midi) {
        e.preventDefault();
        handleNoteOff(midi);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleNoteOn, handleNoteOff]);

  // Toggle Recording
  const handleToggleRecord = () => {
    if (isPlaying) return;

    if (!isRecording) {
      setRecordedNotes([]);
      recordStartTimeRef.current = Date.now();
      lastNoteTimeRef.current = 0;
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }
  };

  // Stop Replay or Recording
  const handleStopAll = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.allNotesOff();
    }
    setIsPlaying(false);
    setIsRecording(false);
    setActiveMidis(new Set());
  };

  // Playback FIFO Recorded Sequence with AbortController & Variable Speed
  const handlePlaySequence = async (sequenceToPlay) => {
    const seq = sequenceToPlay || recordedNotes;
    if (!seq || seq.length === 0 || isPlaying) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsPlaying(true);
    setIsRecording(false);

    try {
      const speed = playbackSpeed;
      for (let i = 0; i < seq.length; i++) {
        if (controller.signal.aborted) break;

        const note = seq[i];
        const waitBefore = i === 0 ? 0 : (note.deltaMs || 250) / speed;
        const noteDuration = (note.durationMs || 300) / speed;

        if (waitBefore > 0) {
          await new Promise((resolve) => {
            const timer = setTimeout(resolve, waitBefore);
            controller.signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
          });
        }

        if (controller.signal.aborted) break;

        // Play note
        handleNoteOn(note.midi);

        // Schedule note off
        setTimeout(() => {
          handleNoteOff(note.midi);
        }, noteDuration);
      }
    } catch {
      // Abort handled safely
    } finally {
      if (!controller.signal.aborted) {
        setIsPlaying(false);
        abortControllerRef.current = null;
      }
    }
  };

  // Load and play sample song (Fur Elise)
  const handlePlaySampleSong = () => {
    handleStopAll();
    handlePlaySequence(SAMPLE_SONG_FUR_ELISE);
  };

  // Filter keys based on selected octave band
  const visibleKeys = useMemo(() => {
    if (selectedOctaveFilter === 'ALL') return PIANO_KEYS;
    if (selectedOctaveFilter === 'LOW') return PIANO_KEYS.filter((k) => k.octave <= 2);
    if (selectedOctaveFilter === 'MID') return PIANO_KEYS.filter((k) => k.octave >= 3 && k.octave <= 5);
    if (selectedOctaveFilter === 'HIGH') return PIANO_KEYS.filter((k) => k.octave >= 6);
    return PIANO_KEYS;
  }, [selectedOctaveFilter]);

  // Separate white and black keys for proper keyboard layering
  const whiteKeys = useMemo(() => visibleKeys.filter((k) => !k.isBlack), [visibleKeys]);
  const blackKeys = useMemo(() => visibleKeys.filter((k) => k.isBlack), [visibleKeys]);

  // Active voice slots (up to 8 voices)
  const activeVoiceSlots = useMemo(() => {
    const slots = [];
    const activeCount = Math.min(8, activeMidis.size);
    for (let i = 0; i < 8; i++) {
      slots.push(i < activeCount);
    }
    return slots;
  }, [activeMidis]);

  // Active note names
  const activeNoteNames = useMemo(() => {
    return Array.from(activeMidis)
      .map((m) => PIANO_KEYS.find((k) => k.midi === m)?.noteName)
      .filter(Boolean);
  }, [activeMidis]);

  return (
    <main className={styles.container} aria-label="88-Key Polyphonic Piano">
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>88-Key Polyphonic Grand Piano</h1>
          <p className={styles.subtitle}>
            Algorithmic 88-key bed (A0–C8), 8-voice FIFO voice stealing, click-free ADSR release,
            and React.memo per-key render isolation.
          </p>
        </div>
        <div className={styles.statusPill}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span>8-Voice FIFO Polyphony</span>
        </div>
      </header>

      {/* Control Dashboard */}
      <section className={styles.dashboard} aria-label="Synthesizer & Sequencer Dashboard">
        {/* Panel 1: Voice Pool & Stealing */}
        <article className={styles.panel}>
          <h2 className={styles.panelTitle}>
            <span>Active Voices ({activeMidis.size}/8)</span>
            <span>FIFO Map</span>
          </h2>
          <div className={styles.voiceMeter} aria-label="Voice allocation meter">
            {activeVoiceSlots.map((isActive, idx) => (
              <div
                key={idx}
                className={`${styles.voiceSlot} ${isActive ? styles.voiceSlotActive : ''}`}
                title={`Voice slot ${idx + 1}`}
              />
            ))}
          </div>
          <div className={styles.voiceStats}>
            <span>Limit: 8 Voices</span>
            <span>9th note steals oldest</span>
          </div>
        </article>

        {/* Panel 2: Sequencer & Replay */}
        <article className={styles.panel}>
          <h2 className={styles.panelTitle}>
            <span>FIFO Sequencer</span>
            <span>{recordedNotes.length} Notes</span>
          </h2>
          <div className={styles.sequencerRow}>
            <button
              type="button"
              onClick={handleToggleRecord}
              disabled={isPlaying}
              className={`${styles.seqBtn} ${isRecording ? styles.seqBtnRecordActive : ''}`}
              aria-pressed={isRecording}
            >
              {isRecording ? '⏹ Stop Rec' : '⏺ Record'}
            </button>
            <button
              type="button"
              onClick={() => handlePlaySequence()}
              disabled={recordedNotes.length === 0 || isPlaying}
              className={styles.seqBtn}
            >
              ▶ Play
            </button>
            <button
              type="button"
              onClick={handleStopAll}
              disabled={!isPlaying && !isRecording && activeMidis.size === 0}
              className={styles.seqBtn}
            >
              ⏹ Stop
            </button>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className={styles.speedSelect}
              aria-label="Playback speed"
            >
              <option value={0.5}>0.5x Speed</option>
              <option value={1.0}>1.0x Normal</option>
              <option value={2.0}>2.0x Fast</option>
            </select>
          </div>
        </article>

        {/* Panel 3: Octave Navigator & Volume */}
        <article className={styles.panel}>
          <h2 className={styles.panelTitle}>
            <span>Octave View & Volume</span>
          </h2>
          <div className={styles.octaveButtons} style={{ marginBottom: '0.6rem' }}>
            {['ALL', 'LOW', 'MID', 'HIGH'].map((band) => (
              <button
                key={band}
                type="button"
                onClick={() => setSelectedOctaveFilter(band)}
                className={`${styles.octaveBtn} ${
                  selectedOctaveFilter === band ? styles.octaveBtnActive : ''
                }`}
              >
                {band === 'ALL' ? 'All 88 Keys' : band === 'LOW' ? 'A0–B2 (Bass)' : band === 'MID' ? 'C3–B5 (Mid)' : 'C6–C8 (Treble)'}
              </button>
            ))}
          </div>
          <div className={styles.volumeRow}>
            <label htmlFor="master-volume">Vol:</label>
            <input
              id="master-volume"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className={styles.volumeSlider}
              aria-label="Master volume"
            />
            <button
              type="button"
              onClick={handlePlaySampleSong}
              className={styles.seqBtn}
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
            >
              Demo: Für Elise
            </button>
          </div>
        </article>
      </section>

      {/* The 88-Key Piano Bed */}
      <section
        ref={scrollWrapperRef}
        className={styles.keyboardScrollWrapper}
        aria-label="88 Piano Keys Bed"
      >
        <div className={styles.pianoBed}>
          {/* Layer 1: White Keys */}
          <div className={styles.whiteKeysContainer}>
            {whiteKeys.map((key) => (
              <PianoKey
                key={key.midi}
                midi={key.midi}
                noteName={key.noteName}
                isBlack={false}
                isPressed={activeMidis.has(key.midi)}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
              />
            ))}
          </div>

          {/* Layer 2: Black Keys (Positioned adaptively relative to visible white keys) */}
          {blackKeys.map((key) => {
            // Calculate relative horizontal offset based on the first visible white key
            const firstWhiteIndex = whiteKeys[0]?.whiteIndex ?? 0;
            const relativeWhiteIndex = key.previousWhiteIndex - firstWhiteIndex;
            return (
              <PianoKey
                key={key.midi}
                midi={key.midi}
                noteName={key.noteName}
                isBlack={true}
                isPressed={activeMidis.has(key.midi)}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
                style={{
                  left: `calc((${relativeWhiteIndex} + 1) * var(--white-key-width) - (var(--black-key-width) / 2))`,
                }}
              />
            );
          })}
        </div>
      </section>

      {/* Live Active Notes Output Screen (Assistive Tech Status) */}
      <section className={styles.screenSection} aria-labelledby="live-notes-title">
        <div className={styles.liveScreen}>
          <span id="live-notes-title" style={{ color: '#94a3b8', fontWeight: 600 }}>
            Live Performance Monitor:
          </span>
          <output role="status" aria-live="polite" className={styles.notesActiveList}>
            {activeNoteNames.length === 0 ? (
              <span className={styles.noNotesText}>
                Press or click piano keys (or keyboard A..K for C4..C5) to play chords...
              </span>
            ) : (
              activeNoteNames.map((name) => (
                <span key={name} className={styles.noteBadge}>
                  {name}
                </span>
              ))
            )}
          </output>
        </div>
      </section>
    </main>
  );
}
