import { useState } from 'react';
import { DeveloperCard } from './components/DeveloperCard';
import styles from './App.module.css';

export function App() {
  const [activeTab, setActiveTab] = useState('lecturer');
  const [useMintTheme, setUseMintTheme] = useState(false);

  const profiles = {
    lecturer: {
      fullName: 'Tran Vinh Khiem',
      role: 'Senior Systems Architect • UIT S3T',
      avatarUrl: '', // Uses Fallback Monogram [TVK]
      metrics: {
        commits: 512,
        vdomNodes: 0,
        a11yScore: 100,
        researchLab: 'S3T Security & Systems',
        apmRanking: '380 APM // Top 1%',
      },
      skills: [
        { id: 'sk-1', name: 'React 19 Fiber', tier: 'Core', category: 'systems' },
        { id: 'sk-2', name: 'Semantic HTML5', tier: 'Core', category: 'specialty' },
        { id: 'sk-3', name: 'Virtual DOM Engine', tier: 'Advanced', category: 'tech' },
        { id: 'sk-4', name: 'Distributed Systems', tier: 'Master', category: 'systems' },
        { id: 'sk-5', name: 'Zero Div-Soup Mandate', tier: 'Enforcer', category: 'specialty' },
      ],
    },
    student: {
      fullName: 'Trần Hữu Thắng',
      role: 'Full-Stack Systems Engineer & Esports Tactician',
      avatarUrl: '', // Uses Fallback Monogram [THT]
      metrics: {
        studentId: '24521614',
        faculty: 'Software Engineering (UIT)',
        vnodeEngine: '100% Invariant Compliant',
        esportsRank: 'Grandmaster / Top 500',
      },
      skills: [
        { id: 'st-1', name: 'React 19', tier: 'Specialist', category: 'tech' },
        { id: 'st-2', name: 'JavaScript ESNext', tier: 'Master', category: 'tech' },
        { id: 'st-3', name: 'Node.js', tier: 'Advanced', category: 'systems' },
        { id: 'st-4', name: 'Semantic Layout', tier: 'Purist', category: 'specialty' },
        { id: 'st-5', name: 'Micro-APM', tier: 'Diamond', category: 'gaming' },
      ],
    },
    photoDemo: {
      fullName: 'Senior Systems Architect',
      role: 'Testing Media Image Rendering & Zero CLS',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240',
      metrics: {
        mediaProtocol: 'HTTPS Only (Zero Insecure)',
        layoutShift: 'CLS = 0.00 (64x64 Box)',
        renderingMode: 'Native <img> with Lazy Load',
      },
      skills: [
        { id: 'ph-1', name: 'HTTPS Security', tier: 'Enforced', category: 'specialty' },
        { id: 'ph-2', name: 'Zero CLS Contract', tier: 'Strict', category: 'systems' },
      ],
    },
  };

  const currentProfile = profiles[activeTab];

  return (
    <main className={styles.appContainer}>
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>Lab 03 - Exercise 1</h1>
        <p className={styles.appSubtitle}>
          Semantic Engineer &amp; Pro-Gamer Profile Card (Zero Div-Soup Mandate)
        </p>
      </header>

      <nav className={styles.tabNavigation} aria-label="Profile Card Demonstrations">
        <button
          type="button"
          onClick={() => setActiveTab('lecturer')}
          className={`${styles.tabButton} ${
            activeTab === 'lecturer' ? styles.tabButtonActive : ''
          }`}
        >
          Giảng viên Trần Vĩnh Khiêm [TVK]
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`${styles.tabButton} ${
            activeTab === 'student' ? styles.tabButtonActive : ''
          }`}
        >
          Sinh viên Trần Hữu Thắng [THT]
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('photoDemo')}
          className={`${styles.tabButton} ${
            activeTab === 'photoDemo' ? styles.tabButtonActive : ''
          }`}
        >
          Media Photo Test (Zero CLS)
        </button>
      </nav>

      <aside className={styles.themeToggleSection}>
        <button
          type="button"
          onClick={() => setUseMintTheme(!useMintTheme)}
          className={styles.themeToggleButton}
        >
          {useMintTheme
            ? '✓ Slide 18 Mint Theme Active (#d0f0c0)'
            : 'Toggle Slide 18 Mint Theme (#d0f0c0)'}
        </button>
      </aside>

      <section className={styles.cardStage} aria-label="Card Showcase Stage">
        <DeveloperCard
          {...currentProfile}
          theme={useMintTheme ? 'mint' : 'default'}
        />
      </section>

      <section className={styles.simulatorContainer} aria-label="375px Viewport Simulator">
        <p className={styles.simulatorLabel}>
          iPhone SE Viewport Simulator (375px Width Boundary)
        </p>
        <section className={styles.simulatorFrame}>
          <DeveloperCard
            {...currentProfile}
            theme={useMintTheme ? 'mint' : 'default'}
          />
        </section>
      </section>
    </main>
  );
}

export default App;
