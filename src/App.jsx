import { DrumMachine } from './homeworks/DrumMachine/DrumMachine';
import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.appContainer}>
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>Lab 03 - Production React 19</h1>
        <p className={styles.appSubtitle}>
          Student: Trần Hữu Thắng (24521614) • Branch: <code>HW1</code>
        </p>
      </header>

      <section style={{ width: '100%', maxWidth: '860px' }} aria-label="Homework 1 Module">
        <DrumMachine />
      </section>
    </main>
  );
}

export default App;
