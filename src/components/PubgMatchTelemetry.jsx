import { useEffect, useState } from 'react';
import { fetchKraftonPubgTelemetry } from '../services/pubgTelemetry';
import { PUBG_VN_SQUADS } from '../data/pubgSquads';
import styles from './PubgMatchTelemetry.module.css';

export function PubgMatchTelemetry({ squadId: initialSquadId = 'te' }) {
  const [selectedSquadId, setSelectedSquadId] = useState(initialSquadId);
  const [view, setView] = useState({ status: 'IDLE', data: null, error: null });
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setView({ status: 'LOADING', data: null, error: null });

    fetchKraftonPubgTelemetry(selectedSquadId, { signal: controller.signal })
      .then((payload) => {
        setView({ status: 'SUCCESS', data: payload, error: null });
      })
      .catch((err) => {
        // Critical: Do not trigger ERROR state on intentional user abort
        if (err.name === 'AbortError') return;
        setView({ status: 'ERROR', data: null, error: err.message });
      });

    // Cleanup: cancels in-flight HTTP request when squad changes or component unmounts
    return () => controller.abort();
  }, [selectedSquadId, retryTick]);

  return (
    <section className={styles.widgetContainer} aria-label="KRAFTON PUBG VN Radar Widget">
      <nav className={styles.squadNav} aria-label="Select Pro Squad">
        {PUBG_VN_SQUADS.map((squad) => (
          <button
            key={squad.id}
            type="button"
            onClick={() => setSelectedSquadId(squad.id)}
            className={`${styles.squadButton} ${
              selectedSquadId === squad.id ? styles.squadButtonActive : ''
            }`}
            aria-pressed={selectedSquadId === squad.id}
          >
            [{squad.tag}] {squad.name}
          </button>
        ))}
      </nav>

      {view.status === 'LOADING' && (
        <section aria-busy="true" className={styles.skeletonCard}>
          <section className={styles.skeletonPulse} />
          <header className={styles.skeletonHeader} />
          <section className={styles.skeletonGrid}>
            <section className={styles.skeletonBox} />
            <section className={styles.skeletonBox} />
            <section className={styles.skeletonBox} />
          </section>
          <footer className={styles.skeletonFooter}>
            <span className={styles.radarPulseDot} />
            <span>Syncing KRAFTON Blue-Zone Radar...</span>
          </footer>
        </section>
      )}

      {view.status === 'ERROR' && (
        <section role="alert" className={styles.errorCard}>
          <h4 className={styles.errorTitle}>Blue-Zone Satellite Link Lost</h4>
          <p className={styles.errorMessage}>{view.error}</p>
          <button
            type="button"
            onClick={() => setRetryTick((t) => t + 1)}
            className={styles.retryButton}
          >
            Reconnect Satellite (Retry)
          </button>
        </section>
      )}

      {view.status === 'SUCCESS' && view.data && (
        <article aria-live="polite" className={styles.telemetryCard}>
          <header className={styles.cardHeader}>
            <section>
              <h3 className={styles.squadTitle}>
                {view.data.name}
                <span className={styles.tagBadge}>{view.data.tag}</span>
              </h3>
              <p className={styles.mapBadge}>
                Map: <strong>{view.data.map}</strong> •{' '}
                <span className={styles.phasePill}>{view.data.phase}</span>
              </p>
            </section>
          </header>

          <section className={styles.telemetryGrid}>
            <section className={styles.statBox}>
              <p className={styles.statLabel}>Alive</p>
              <p className={`${styles.statValue} ${styles.statValueCyan}`}>
                {view.data.alive} / 4
              </p>
            </section>

            <section className={styles.statBox}>
              <p className={styles.statLabel}>Total Kills</p>
              <p className={styles.statValue}>{view.data.kills}</p>
            </section>

            <section className={styles.statBox}>
              <p className={styles.statLabel}>WWCD Win Rate</p>
              <p className={`${styles.statValue} ${styles.statValueGold}`}>
                {view.data.wwcdProb}
              </p>
            </section>
          </section>

          <footer className={styles.cardFooter}>
            <span className={styles.statusText}>● {view.data.status}</span>
            <span>Ping: {view.data.latencyMs}ms • {view.data.timestamp}</span>
          </footer>
        </article>
      )}
    </section>
  );
}

export default PubgMatchTelemetry;
