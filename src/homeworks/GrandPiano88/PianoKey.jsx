import { memo } from 'react';
import styles from './GrandPiano88.module.css';

/**
 * PianoKey Component (Slide 27)
 * Memoized Key: Only re-renders when its own boolean isPressed flips!
 * Zero re-render cascade across the 88-key piano bed.
 */
export const PianoKey = memo(
  function PianoKey({
    midi,
    noteName,
    isBlack,
    isPressed,
    onNoteOn,
    onNoteOff,
    style,
  }) {
    const handlePointerDown = (e) => {
      e.preventDefault();
      onNoteOn(midi);
    };

    const handlePointerUp = (e) => {
      e.preventDefault();
      onNoteOff(midi);
    };

    const handlePointerLeave = (e) => {
      if (isPressed) {
        onNoteOff(midi);
      }
    };

    const keyClassName = `${styles.key} ${
      isBlack ? styles.keyBlack : styles.keyWhite
    } ${isPressed ? styles.keyPressed : ''}`;

    return (
      <button
        type="button"
        className={keyClassName}
        style={style}
        aria-pressed={isPressed}
        aria-label={`Piano key ${noteName} (MIDI ${midi})`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerUp}
      >
        <span className={styles.keyLabel}>{noteName}</span>
      </button>
    );
  },
  (prevProps, nextProps) => {
    // Strict memo comparison: only re-render if isPressed changes or style.left changes
    return (
      prevProps.isPressed === nextProps.isPressed &&
      prevProps.midi === nextProps.midi &&
      prevProps.noteName === nextProps.noteName &&
      prevProps.style?.left === nextProps.style?.left
    );
  }
);
