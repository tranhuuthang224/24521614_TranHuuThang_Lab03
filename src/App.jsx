import { GrandPiano88 } from './homeworks/GrandPiano88/GrandPiano88';
import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.appContainer}>
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>Lab 03 - Production React 19</h1>
        <p className={styles.appSubtitle}>
          Student: Trần Hữu Thắng (24521614) • Branch: <code>HW2</code>
        </p>
      </header>

      <section style={{ width: '100%', maxWidth: '1080px' }} aria-label="Homework 2 Module">
        <GrandPiano88 />
      </section>
    </main>
  );
}

export default App;
