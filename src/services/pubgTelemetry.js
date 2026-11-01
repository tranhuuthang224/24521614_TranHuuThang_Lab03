import { PUBG_VN_SQUADS } from '../data/pubgSquads';

/**
 * Simulates real-time KRAFTON PUBG VN satellite telemetry stream.
 * Fully supports AbortSignal for deterministic cleanup and simulates
 * 35% Blue-Zone satellite packet loss (Slide 22).
 */
export function fetchKraftonPubgTelemetry(
  squadId = 'te',
  { signal, simulatedDelayMs = 950, failureRate = 0.35 } = {}
) {
  return new Promise((resolve, reject) => {
    // Check if signal is already aborted before starting
    if (signal?.aborted) {
      const abortError = new Error('Satellite telemetry fetch aborted');
      abortError.name = 'AbortError';
      return reject(abortError);
    }

    let timerId = null;

    const cleanup = () => {
      if (timerId) clearTimeout(timerId);
      if (signal) signal.removeEventListener('abort', onAbort);
    };

    const onAbort = () => {
      cleanup();
      const abortError = new Error('Satellite telemetry fetch aborted');
      abortError.name = 'AbortError';
      reject(abortError);
    };

    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }

    timerId = setTimeout(() => {
      cleanup();

      // Check if aborted during wait
      if (signal?.aborted) {
        const abortError = new Error('Satellite telemetry fetch aborted');
        abortError.name = 'AbortError';
        return reject(abortError);
      }

      // Simulate 35% Satellite Packet Loss
      const isPacketLost = Math.random() < failureRate;
      if (isPacketLost) {
        return reject(
          new Error('Satellite link degraded: 35% Erangel/Miramar packet timeout')
        );
      }

      const squad = PUBG_VN_SQUADS.find((s) => s.id === squadId) || PUBG_VN_SQUADS[0];
      resolve({
        ...squad,
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: Math.floor(Math.random() * 20) + 12,
      });
    }, simulatedDelayMs);
  });
}

export default fetchKraftonPubgTelemetry;
