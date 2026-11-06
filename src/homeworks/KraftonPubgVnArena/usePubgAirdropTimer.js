import { useEffect, useState } from 'react';

/**
 * usePubgAirdropTimer Hook (Slide 30)
 * Monotonic target epoch timer evolved from Lab 2 HW 3 createAntiDriftTimer.
 * Solves background tab throttling drift via window setInterval + document visibilitychange resync.
 */
export function usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0) {
  const calcRemaining = () =>
    Math.max(0, targetEpochMs - (Date.now() + serverOffsetMs));

  const [remainingMs, setRemainingMs] = useState(calcRemaining);

  useEffect(() => {
    const syncClock = () => setRemainingMs(calcRemaining());
    syncClock();

    const timerId = window.setInterval(syncClock, 200);

    const onWake = () => {
      if (document.visibilityState === 'visible') {
        syncClock();
      }
    };

    document.addEventListener('visibilitychange', onWake);

    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', onWake);
    };
  }, [targetEpochMs, serverOffsetMs]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((remainingMs % 1000) / 100);

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}.${tenths}`;

  return {
    remainingMs,
    isLive: remainingMs === 0,
    formattedTime,
  };
}
