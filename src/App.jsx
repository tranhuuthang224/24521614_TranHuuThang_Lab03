import { KraftonPubgVnArena } from './homeworks/KraftonPubgVnArena/KraftonPubgVnArena';
import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.appContainer}>
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>Lab 03 - Production React 19</h1>
        <p className={styles.appSubtitle}>
          Student: Trần Hữu Thắng (24521614) • Branch: <code>HW3</code>
        </p>
      </header>

      <section style={{ width: '100%', maxWidth: '920px' }} aria-label="Homework 3 Module">
        <KraftonPubgVnArena />
      </section>
    </main>
  );
}

export default App;
