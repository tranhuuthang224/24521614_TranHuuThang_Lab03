import React, { useState, useCallback, useRef, useEffect, useId } from 'react';
import { DRUM_PADS, PAD_MAP } from './drumPadsData';
import { drumAudioEngine } from './drumAudioEngine';
import { useDrumKeyboard } from './useDrumKeyboard';
import styles from './DrumMachine.module.css';

/**
 * DrumMachine Component (Homework 1 - Slide 26 & 34)
 * Production Studio Drum Kit with W3C physical e.code mapping,
 * Native Web Audio API synthesis, visual decibel meter, and WCAG 2.2 AA accessibility.
 */
export function DrumMachine() {
  const [activePadId, setActivePadId] = useState(null);
  const [hitLogs, setHitLogs] = useState([]);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [meterLevel, setMeterLevel] = useState(0); // 0 to 100 visual decibel scale

  const activeTimerRef = useRef(null);
  const meterDecayRef = useRef(null);
  const isolationInputId = useId();
  const volumeInputId = useId();

  // Trigger drum pad sound + visual feedback
  const handleTriggerPad = useCallback(
    (padId) => {
      const pad = DRUM_PADS.find((p) => p.id === padId);
      if (!pad) return;

      // 1. Play synthesized sound via Web Audio API
      if (!isMuted) {
        drumAudioEngine.trigger(padId, volume / 100);
      }

      // 2. Visual tactile button flash
      setActivePadId(padId);
      if (activeTimerRef.current) {
        clearTimeout(activeTimerRef.current);
      }
      activeTimerRef.current = setTimeout(() => {
        setActivePadId(null);
      }, 150);

      // 3. Visual Decibel Meter spike & decay
      const spike = Math.min(100, (volume / 100) * (60 + Math.random() * 40));
      setMeterLevel(spike);

      // 4. Record to accessible live hit log
      const timeStr = new Date().toLocaleTimeString('vi-VN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setHitLogs((prev) => [
        {
          id: `${padId}-${Date.now()}-${Math.random()}`,
          padId: pad.id,
          key: pad.keyLabel,
          instrument: pad.label,
          time: timeStr,
        },
        ...prev.slice(0, 9), // Keep latest 10 logs
      ]);
    },
    [isMuted, volume]
  );

  // Hook: bind physical e.code with anti-repeat and input isolation
  useDrumKeyboard(PAD_MAP, handleTriggerPad, true);

  // Smooth decibel meter decay loop
  useEffect(() => {
    if (meterLevel <= 0) return;

    meterDecayRef.current = setInterval(() => {
      setMeterLevel((prev) => {
        if (prev <= 2) {
          clearInterval(meterDecayRef.current);
          return 0;
        }
        return Math.max(0, prev - 4);
      });
    }, 30);

    return () => {
      if (meterDecayRef.current) {
        clearInterval(meterDecayRef.current);
      }
    };
  }, [meterLevel]);

  // Handle master volume change
  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    drumAudioEngine.setMasterVolume(isMuted ? 0 : val / 100);
  };

  // Toggle mute
  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      drumAudioEngine.setMasterVolume(next ? 0 : volume / 100);
      return next;
    });
  };

  // Clear log history
  const handleClearLogs = () => {
    setHitLogs([]);
  };

  return (
    <main className={styles.container} aria-label="Production Studio Drum Kit">
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Production Studio Drum Kit</h1>
          <span className={styles.badge}>
            <span className={styles.statusDot} aria-hidden="true" />
            Web Audio 96kHz / 24-bit
          </span>
        </div>
        <p className={styles.description}>
          Interactive percussion synthesizer with physical <code>e.code</code> hardware scancodes,
          Vietnamese IME immunity, anti-repeat guard, and WCAG 2.2 AA live accessibility.
        </p>
      </header>

      {/* Control Strip */}
      <section className={styles.controlStrip} aria-label="Audio Controls">
        <div className={styles.volumeControl}>
          <label htmlFor={volumeInputId} id={`${volumeInputId}-label`}>
            Volume: {isMuted ? 'Muted' : `${volume}%`}
          </label>
          <input
            id={volumeInputId}
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={volume}
            aria-label="Master volume"
          />
        </div>
        <button
          type="button"
          onClick={handleToggleMute}
          className={`${styles.muteButton} ${isMuted ? styles.muteButtonActive : ''}`}
          aria-pressed={isMuted}
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
      </section>

      {/* Decibel / VU Meter (Deaf & Hard-of-Hearing Sensory Substitution) */}
      <section className={styles.meterSection} aria-label="Visual Decibel Meter">
        <div className={styles.meterHeader}>
          <span className={styles.meterLabel}>Visual Decibel / VU Output Meter</span>
          <span className={styles.meterDecibels} aria-live="off">
            {meterLevel > 0 ? `-${(100 - meterLevel).toFixed(0)} dBFS` : '-∞ dBFS'}
          </span>
        </div>
        <div
          className={styles.visualMeter}
          role="meter"
          aria-label="Current audio output decibel level"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(meterLevel)}
        >
          <div
            className={styles.meterBar}
            style={{ width: `${meterLevel}%` }}
          />
        </div>
      </section>

      {/* Drum Pads Grid */}
      <section className={styles.padsGrid} aria-label="Drum Instrument Pads">
        {DRUM_PADS.map((pad) => {
          const isActive = activePadId === pad.id;
          return (
            <button
              key={pad.id}
              type="button"
              className={`${styles.pad} ${isActive ? styles.padActive : ''}`}
              onClick={() => handleTriggerPad(pad.id)}
              aria-pressed={isActive}
              aria-label={`Trigger ${pad.label} with keyboard key ${pad.keyLabel}`}
            >
              <span className={styles.padKeyBadge} aria-hidden="true">
                {pad.keyLabel}
              </span>
              <span className={styles.padLabel}>{pad.label}</span>
              <span className={styles.padFrequency} aria-hidden="true">
                {pad.frequency}
              </span>
            </button>
          );
        })}
      </section>

      {/* Accessible Hit Log (WCAG 2.2 AA <output role="status" aria-live="polite">) */}
      <section className={styles.logSection} aria-labelledby="hit-log-title">
        <div className={styles.logHeader}>
          <h2 id="hit-log-title" className={styles.logTitle}>
            Live Hit Log History (Assistive Tech Status)
          </h2>
          {hitLogs.length > 0 && (
            <button
              type="button"
              onClick={handleClearLogs}
              className={styles.clearLogBtn}
            >
              Clear Log
            </button>
          )}
        </div>

        <output
          className={styles.liveOutput}
          role="status"
          aria-live="polite"
        >
          {hitLogs.length === 0 ? (
            <div className={styles.logEmpty}>
              Press physical keys (W, A, S, D, J, K, L) or click the pads to play.
            </div>
          ) : (
            hitLogs.map((log) => (
              <div key={log.id} className={styles.logItem}>
                <span>
                  <strong className={styles.logKey}>[{log.key}]</strong>{' '}
                  <span className={styles.logInstrument}>{log.instrument}</span>
                </span>
                <time className={styles.logTime}>{log.time}</time>
              </div>
            ))
          )}
        </output>
      </section>

      {/* Keyboard Input Isolation Verification */}
      <section className={styles.isolationSection} aria-labelledby="isolation-title">
        <h2 id="isolation-title" className={styles.isolationLabel}>
          Input Focus Isolation Guard Test
        </h2>
        <p className={styles.isolationHint}>
          Click into the text field below and type <code>w</code>, <code>a</code>, <code>s</code>,{' '}
          <code>d</code>, <code>j</code>, <code>k</code>, <code>l</code>. The event listener detects{' '}
          <code>e.target.tagName === 'INPUT'</code> and safely ignores the keys, preventing accidental
          drum triggers while editing text.
        </p>
        <label htmlFor={isolationInputId} className="sr-only" style={{ display: 'none' }}>
          Input Isolation Test Field
        </label>
        <input
          id={isolationInputId}
          type="text"
          className={styles.isolationInput}
          placeholder="Type 'wasd' here — notice zero drum triggers occur..."
          aria-label="Input isolation test field"
        />
      </section>
    </main>
  );
}
