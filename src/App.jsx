import { SituationshipAnalyzer } from './components/SituationshipAnalyzer/SituationshipAnalyzer';
import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.appContainer}>
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>Lab 03 - Production React 19</h1>
        <p className={styles.appSubtitle}>
          Student: Trần Hữu Thắng (24521614) • Branch: <code>bonus</code>
        </p>
      </header>

      <section style={{ width: '100%', maxWidth: '820px' }} aria-label="Bonus Exercise Module">
        <SituationshipAnalyzer />
      </section>
    </main>
  );
}

export default App;
