import React, { useState } from 'react';
import { DeveloperCard } from './components/DeveloperCard';

export function App() {
  const [activeTab, setActiveTab] = useState('synthesized');

  const profiles = {
    synthesized: {
      name: 'Elon "Technoking" Musk',
      role: 'Chief Systems Architect & Pro Gamer',
      handle: '@elonmusk',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'Architecting orbital launch vehicles and multi-planetary compute infrastructure. Top-tier speedrunner, min-maxing latency from silicon to orbit.',
      stats: [
        { label: 'Guild / Organization', value: 'SpaceX // xAI // Tesla' },
        { label: 'Competitive Tier', value: 'Grandmaster (Top 0.1%)' },
        { label: 'Primary Weapon Stack', value: 'React 19 / Rust / C++' },
        { label: 'Latency / APM Spec', value: '12ms Starlink // 380 APM' },
        { label: 'Deployment Status', value: 'Active on Mainnet' },
      ],
      skills: [
        { name: 'React 19', level: 'Expert', category: 'tech' },
        { name: 'Rust', level: 'Advanced', category: 'systems' },
        { name: 'TypeScript', level: 'Master', category: 'tech' },
        { name: 'Distributed Systems', level: 'Architect', category: 'systems' },
        { name: 'Micro-APM', level: 'Grandmaster', category: 'gaming' },
        { name: 'Aim Tracking', level: 'Predator', category: 'gaming' },
        { name: 'Starship Avionics', level: 'Technoking', category: 'specialty' },
      ],
      isAvailable: true,
    },
    student: {
      name: 'Trần Hữu Thắng',
      role: 'Full-Stack Systems Engineer & Esports Tactician',
      handle: '@thangtran224',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'UIT Software Engineering student crafting high-performance, deterministic web systems with zero div-soup and mathematically verified state machines.',
      stats: [
        { label: 'University / Guild', value: 'UIT - VNUHCM (MSSV: 24521614)' },
        { label: 'Esports Specialty', value: 'Tactical FPS & High-APM RTS' },
        { label: 'Core Competency', value: 'React 19, VNode Engine, Node' },
        { label: 'Verification Standard', value: '100% Invariant Compliance' },
        { label: 'Availability', value: 'Open for High-Impact Projects' },
      ],
      skills: [
        { name: 'React 19', level: 'Specialist', category: 'tech' },
        { name: 'JavaScript ESNext', level: 'Master', category: 'tech' },
        { name: 'Node.js', level: 'Advanced', category: 'systems' },
        { name: 'Semantic HTML5', level: 'Purist', category: 'specialty' },
        { name: 'Clutch Decision-Making', level: 'Diamond', category: 'gaming' },
        { name: 'Zero Div-Soup Architecture', level: 'Enforcer', category: 'specialty' },
      ],
      isAvailable: true,
    },
    fallbackTest: {
      name: 'Phantom Developer',
      role: 'Stealth Security Researcher',
      handle: '@phantom_dev',
      avatarUrl: 'https://invalid-non-existent-domain.internal/broken-image.png',
      bio: 'Testing resilient image fallback handling under network failure. When the avatar fails to load, fallback initials render without layout shift.',
      stats: [
        { label: 'Operation Mode', value: 'Air-Gapped Sandbox' },
        { label: 'Security Clearance', value: 'Level 5 (Classified)' },
        { label: 'CLS Invariant', value: 'Cumulative Shift = 0.00' },
        { label: 'Fallback State', value: 'Deterministic Initials [PD]' },
      ],
      skills: [
        { name: 'Penetration Testing', level: 'Lead', category: 'systems' },
        { name: 'Zero-Day Auditing', level: 'Expert', category: 'systems' },
        { name: 'Network Sandbox', level: 'Architect', category: 'specialty' },
      ],
      isAvailable: false,
    },
  };

  const currentProfile = profiles[activeTab];

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>Lab 03 - Exercise 1</h1>
        <p className="app-subtitle">
          Semantic Engineer & Pro-Gamer Profile Card (Zero Div-Soup Mandate)
        </p>
      </header>

      <nav className="tab-navigation" aria-label="Profile Card Demonstrations">
        <button
          type="button"
          onClick={() => setActiveTab('synthesized')}
          className={`tab-button ${activeTab === 'synthesized' ? 'is-active' : ''}`}
        >
          Synthesized Card (Elon Musk Ex 4.4 + Ex 4.5)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`tab-button ${activeTab === 'student' ? 'is-active' : ''}`}
        >
          Student Engineer Profile (Ex 4.1 Reusability)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('fallbackTest')}
          className={`tab-button ${activeTab === 'fallbackTest' ? 'is-active' : ''}`}
        >
          Avatar Fallback Resilience Test
        </button>
      </nav>

      <section className="card-stage" aria-label="Card Showcase Stage">
        <DeveloperCard {...currentProfile} />
      </section>
    </main>
  );
}

export default App;
