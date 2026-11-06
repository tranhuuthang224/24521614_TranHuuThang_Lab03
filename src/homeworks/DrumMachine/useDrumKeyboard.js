import { useEffect } from 'react';

/**
 * Custom Hook: useDrumKeyboard (Slide 26 Reference Contract).
 *
 * Guarantees:
 * 1. Physical Key Codes (e.code): 'KeyW'..'KeyL' resilient to Vietnamese UniKey IME.
 * 2. Anti-Repeat Guard: if (e.repeat) return; prevents OS auto-repeat flood.
 * 3. Input Focus Isolation: Ignores shortcuts while user is typing in forms.
 * 4. Deterministic Event Cleanup: Removes window listener on unmount.
 */
export function useDrumKeyboard(padMap, onTriggerPad, isEnabled = true) {
  useEffect(() => {
    if (!isEnabled) return undefined;

    const onKeyDown = (e) => {
      // 1. Prevent OS auto-repeat flood on hold
      if (e.repeat) return;

      // 2. Isolate form inputs so typing won't trigger drum sounds
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // 3. W3C physical e.code ('KeyW'), never deprecated keyCode
      const pad = padMap.get(e.code);
      if (pad) {
        e.preventDefault();
        onTriggerPad(pad.id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [padMap, onTriggerPad, isEnabled]);
}

export default useDrumKeyboard;
