import React, { useState, useEffect, useId, useMemo, useRef } from 'react';
import {
  RELATIONSHIP_PHASES,
  PHASE_METADATA,
  EM_WEIGHT,
  RIVAL_WEIGHT,
  DEFAULT_PRESET_SCENARIOS,
} from './situationshipTypes';
import styles from './SituationshipAnalyzer.module.css';

/**
 * SituationshipAnalyzer Component (Bonus Creative Exercise - Slide 31 & 32)
 * Inspired by Wendy Thảo's hit song: "Hẹn Hò Nhưng Không Yêu"
 *
 * Demonstrates:
 * 1. Banning 'Situationship' Boolean Soup via strict Finite State Machine (FSM).
 * 2. Asymmetric Effort Reducer: Pure Derived State (myTries * 0.1 vs rivalTries * 50.0).
 * 3. 'Seen Không Rep' Ghosting 5s Timer with deterministic cleanup in useEffect.
 * 4. WCAG 2.2 AA live status output & 375px responsive contract.
 */
export function SituationshipAnalyzer() {
  const [phase, setPhase] = useState(RELATIONSHIP_PHASES.DATING_NO_LOVE);
  const [myTries, setMyTries] = useState(100); // 'Em cố trăm lần'
  const [rivalTries, setRivalTries] = useState(1); // 'Ai đó một phần'
  const [actionLogs, setActionLogs] = useState([]);
  const [ghostCountdown, setGhostCountdown] = useState(5); // 5s ghosting visual countdown

  const myTriesInputId = useId();
  const rivalTriesInputId = useId();
  const ghostIntervalRef = useRef(null);

  // [OK] DERIVED STATE: Purely computed during render without a redundant useEffect
  const myImpact = Number((myTries * EM_WEIGHT).toFixed(2));
  const rivalImpact = Number((rivalTries * RIVAL_WEIGHT).toFixed(2));
  const totalImpact = myImpact + rivalImpact;
  const myPercentage = totalImpact > 0 ? Math.round((myImpact / totalImpact) * 100) : 50;
  const rivalPercentage = totalImpact > 0 ? 100 - myPercentage : 50;

  // Red-Flag Condition: Dating without love + asymmetric effort disparity
  const isRedFlag = phase === RELATIONSHIP_PHASES.DATING_NO_LOVE && myImpact < rivalImpact;

  // Ghosting Timer with Deterministic Cleanup (Slide 32)
  // When in DATING_NO_LOVE, starts 5s unreciprocated ping timer
  useEffect(() => {
    if (phase !== RELATIONSHIP_PHASES.DATING_NO_LOVE) {
      setGhostCountdown(5);
      return undefined;
    }

    setGhostCountdown(5);

    // Visual 1-second countdown tick
    ghostIntervalRef.current = window.setInterval(() => {
      setGhostCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Auto-exit situationship after 5s of unreciprocated ping (No Memory Leak!)
    const timerId = window.setTimeout(() => {
      setPhase(RELATIONSHIP_PHASES.GHOSTED_EXIT);
      setActionLogs((prev) => [
        ...prev,
        {
          id: `ghost-${Date.now()}`,
          actor: 'SYSTEM',
          message: 'Timeout 5s không hồi đáp: Tự động Unbind & giải phóng bộ nhớ Fiber!',
          timestamp: new Date().toLocaleTimeString('vi-VN'),
        },
      ]);
    }, 5000);

    // Cleanup: clears both interval and timeout on unmount or phase/myTries change
    return () => {
      window.clearTimeout(timerId);
      if (ghostIntervalRef.current) {
        window.clearInterval(ghostIntervalRef.current);
      }
    };
  }, [phase, myTries]);

  // Handle phase change
  const handleSelectPhase = (newPhase) => {
    setPhase(newPhase);
    setActionLogs((prev) => [
      ...prev,
      {
        id: `phase-${Date.now()}`,
        actor: 'USER',
        message: `Chuyển pha quan hệ -> [${PHASE_METADATA[newPhase].label}]`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      },
    ]);
  };

  // Dispatch Effort Action
  const handleAddEffort = (actor, amount) => {
    if (actor === 'EM') {
      setMyTries((prev) => prev + amount);
      setActionLogs((prev) => [
        ...prev,
        {
          id: `act-${Date.now()}`,
          actor: 'EM',
          message: `Em nhắn tin quan tâm (+${amount} lần)`,
          timestamp: new Date().toLocaleTimeString('vi-VN'),
        },
      ]);
    } else {
      setRivalTries((prev) => prev + amount);
      setActionLogs((prev) => [
        ...prev,
        {
          id: `act-${Date.now()}`,
          actor: 'AI_DO',
          message: `Ai đó chỉ thả 1 tim vu vơ (+${amount} phần)`,
          timestamp: new Date().toLocaleTimeString('vi-VN'),
        },
      ]);
    }
  };

  // Apply Preset Scenario
  const handleApplyPreset = (preset) => {
    setMyTries(preset.myTries);
    setRivalTries(preset.rivalTries);
    setPhase(preset.phase);
    setActionLogs((prev) => [
      ...prev,
      {
        id: `preset-${Date.now()}`,
        actor: 'PRESET',
        message: `Nạp kịch bản: "${preset.title}"`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      },
    ]);
  };

  // Immediate Memory Free Action
  const handleFreeMemory = () => {
    setPhase(RELATIONSHIP_PHASES.GHOSTED_EXIT);
    setActionLogs((prev) => [
      ...prev,
      {
        id: `free-${Date.now()}`,
        actor: 'USER',
        message: 'Chủ động bấm [Unbind & Free Memory]: Cắt đứt hoàn toàn situationship!',
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      },
    ]);
  };

  const currentMetadata = PHASE_METADATA[phase] || PHASE_METADATA.DATING_NO_LOVE;

  return (
    <article
      className={styles.container}
      aria-label="Hẹn Hò Nhưng Không Yêu Analyzer"
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.songTag}>V-Pop FSM Inspired • Wendy Thảo</span>
          <span className={styles.fsmTag}>Deterministic State Machine</span>
        </div>
        <h1 className={styles.title}>Situationship Analyzer</h1>
        <p className={styles.subtitle}>
          Solving Boolean Soup &amp; Asymmetric Effort State (&quot;Em cố trăm lần chẳng bằng ai đó một
          phần&quot;) via React 19 Pure Derived State and leak-free Ghosting timeout cleanup.
        </p>
      </header>

      {/* FSM Phase Selector (Strict Enum Transitions) */}
      <section className={styles.fsmSection} aria-label="Mô hình trạng thái quan hệ">
        <h2 className={styles.fsmTitle}>
          <span>Trạng Thái Quan Hệ (FSM Phase)</span>
          <span style={{ color: currentMetadata.badgeColor, fontWeight: 700 }}>
            {currentMetadata.icon} {currentMetadata.label}
          </span>
        </h2>
        <div className={styles.phaseGrid} role="radiogroup" aria-label="Chọn giai đoạn mối quan hệ">
          {Object.entries(RELATIONSHIP_PHASES).map(([key, value]) => {
            const meta = PHASE_METADATA[value];
            const isActive = phase === value;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => handleSelectPhase(value)}
                className={`${styles.phasePill} ${isActive ? styles.phasePillActive : ''}`}
              >
                <span className={styles.phaseIcon}>{meta.icon}</span>
                <span className={styles.phaseName}>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Red-Flag & Status Live Alert Banner (WCAG 2.2 AA) */}
      <section aria-label="Cảnh báo Red-Flag trạng thái">
        <output role="status" aria-live="polite">
          {isRedFlag ? (
            <div className={styles.redFlagBanner}>
              <div>
                <h3 className={styles.bannerTitle}>
                  🚨 [RED-FLAG] Hẹn hò nhưng không yêu — Giải phóng bộ nhớ!
                </h3>
                <p className={styles.bannerDesc}>
                  Em cố {myTries} lần (Impact: {myImpact}) nhưng vẫn thua ai đó {rivalTries} phần
                  (Impact: {rivalImpact}). Situationship độc hại gây lãng phí chu kỳ re-render!
                </p>
              </div>
              <button
                type="button"
                onClick={handleFreeMemory}
                className={styles.freeMemoryBtn}
              >
                Unbind &amp; Free Memory
              </button>
            </div>
          ) : phase === RELATIONSHIP_PHASES.GHOSTED_EXIT ? (
            <div className={styles.ghostedBanner}>
              <div>
                <h3 className={styles.bannerTitle}>
                  ✨ Trạng thái: Self-Respect Exit (Bộ nhớ đã giải phóng)
                </h3>
                <p className={styles.bannerDesc}>
                  Toàn bộ event listeners, timeouts, và liên kết Fiber độc hại đã được Garbage
                  Collected. Tâm trí thanh thản!
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPhase(RELATIONSHIP_PHASES.STRANGERS)}
                className={styles.freeMemoryBtn}
                style={{ background: '#8b5cf6' }}
              >
                Reset về Bạn Bè
              </button>
            </div>
          ) : (
            <div className={styles.stableBanner}>
              <div>
                <h3 className={styles.bannerTitle}>
                  ✔ [OK] Mối quan hệ ổn định / Nỗ lực công bằng
                </h3>
                <p className={styles.bannerDesc}>
                  {phase === RELATIONSHIP_PHASES.COMMITTED
                    ? 'Tình yêu chính thức, hai chiều cam kết. Zero Red-Flags.'
                    : 'Giai đoạn bạn bè bình thường, chưa có rủi ro situationship.'}
                </p>
              </div>
            </div>
          )}
        </output>
      </section>

      {/* 'Seen Không Rep' Ghosting Countdown Bar */}
      {phase === RELATIONSHIP_PHASES.DATING_NO_LOVE && (
        <section className={styles.ghostingTimerCard} aria-label="Đồng hồ đếm ngược Ghosting">
          <div className={styles.timerHeader}>
            <span>⏱ &apos;Seen Không Rep&apos; Ghosting Timeout:</span>
            <span className={styles.countdownBadge}>
              Tự động Exit sau: {ghostCountdown}s
            </span>
          </div>
          <div className={styles.timerTrack}>
            <div
              className={styles.timerFill}
              style={{ width: `${(ghostCountdown / 5) * 100}%` }}
            />
          </div>
        </section>
      )}

      {/* Asymmetric Effort Simulator Inputs */}
      <section className={styles.simulatorGrid} aria-label="Mô phỏng nỗ lực bất cân xứng">
        {/* Card 1: Em Cố Trăm Lần */}
        <article className={`${styles.effortCard} ${styles.effortCardEm}`}>
          <div>
            <div className={styles.cardHeader}>
              <h3 className={styles.actorTitle}>Em Cố Gắng (myTries)</h3>
              <span className={styles.actorWeight}>Trọng số: x{EM_WEIGHT}</span>
            </div>
            <div className={styles.formulaDisplay}>
              {myTries} lần × {EM_WEIGHT} ={' '}
              <span className={styles.highlightImpact}>{myImpact} pts</span>
            </div>
            <div className={styles.sliderRow}>
              <div className={styles.sliderLabelRow}>
                <label htmlFor={myTriesInputId}>Số lần nỗ lực:</label>
                <span>{myTries} lần</span>
              </div>
              <input
                id={myTriesInputId}
                type="range"
                min="0"
                max="200"
                value={myTries}
                onChange={(e) => setMyTries(Number(e.target.value))}
                className={styles.effortSlider}
                aria-valuemin={0}
                aria-valuemax={200}
                aria-valuenow={myTries}
              />
            </div>
          </div>
          <div className={styles.quickButtons}>
            <button
              type="button"
              onClick={() => handleAddEffort('EM', 10)}
              className={styles.miniBtn}
            >
              +10 Nhắn tin
            </button>
            <button
              type="button"
              onClick={() => handleAddEffort('EM', 50)}
              className={styles.miniBtn}
            >
              +50 Chăm sóc
            </button>
            <button
              type="button"
              onClick={() => setMyTries(100)}
              className={styles.miniBtn}
            >
              Reset 100 lần
            </button>
          </div>
        </article>

        {/* Card 2: Ai Đó Một Phần */}
        <article className={`${styles.effortCard} ${styles.effortCardRival}`}>
          <div>
            <div className={styles.cardHeader}>
              <h3 className={styles.actorTitle}>Ai Đó (rivalTries)</h3>
              <span className={styles.actorWeight}>Trọng số: x{RIVAL_WEIGHT}</span>
            </div>
            <div className={styles.formulaDisplay}>
              {rivalTries} phần × {RIVAL_WEIGHT} ={' '}
              <span className={styles.highlightImpact} style={{ color: '#f59e0b' }}>
                {rivalImpact} pts
              </span>
            </div>
            <div className={styles.sliderRow}>
              <div className={styles.sliderLabelRow}>
                <label htmlFor={rivalTriesInputId}>Nỗ lực người ta:</label>
                <span>{rivalTries} phần</span>
              </div>
              <input
                id={rivalTriesInputId}
                type="range"
                min="0"
                max="10"
                value={rivalTries}
                onChange={(e) => setRivalTries(Number(e.target.value))}
                className={`${styles.effortSlider} ${styles.effortSliderRival}`}
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={rivalTries}
              />
            </div>
          </div>
          <div className={styles.quickButtons}>
            <button
              type="button"
              onClick={() => handleAddEffort('AI_DO', 1)}
              className={styles.miniBtn}
            >
              +1 Thả tim vu vơ
            </button>
            <button
              type="button"
              onClick={() => setRivalTries(0)}
              className={styles.miniBtn}
            >
              Không có ai khác (0)
            </button>
            <button
              type="button"
              onClick={() => setRivalTries(1)}
              className={styles.miniBtn}
            >
              1 phần (Chuẩn bài hát)
            </button>
          </div>
        </article>
      </section>

      {/* Disparity Comparison Visual Bar */}
      <section className={styles.disparitySection} aria-label="Thước đo chênh lệch nỗ lực">
        <div className={styles.disparityHeader}>
          <span>Tỷ Lệ Tác Động Nỗ Lực (Impact Disparity)</span>
          <span>
            Em: {myPercentage}% vs Ai đó: {rivalPercentage}%
          </span>
        </div>
        <div className={styles.barWrapper} role="meter" aria-label="Tỷ lệ nỗ lực">
          <div className={styles.barEm} style={{ width: `${myPercentage}%` }}>
            {myPercentage > 15 ? `Em (${myImpact})` : ''}
          </div>
          <div className={styles.barRival} style={{ width: `${rivalPercentage}%` }}>
            {rivalPercentage > 15 ? `Ai đó (${rivalImpact})` : ''}
          </div>
        </div>
      </section>

      {/* Preset Scenarios Strip */}
      <section style={{ marginBottom: '1.5rem' }} aria-label="Kịch bản mẫu">
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
          Kịch bản mẫu nhanh:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
          {DEFAULT_PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={styles.miniBtn}
              style={{ padding: '0.35rem 0.75rem' }}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </section>

      {/* Interaction Event Log History */}
      <section className={styles.logSection} aria-labelledby="action-log-heading">
        <div className={styles.logHeader}>
          <h2 id="action-log-heading" style={{ margin: 0, fontSize: '0.75rem' }}>
            Nhật Ký Tín Hiệu Tương Tác (Immutable Action Log)
          </h2>
          <span>{actionLogs.length} events</span>
        </div>
        <output className={styles.liveOutput} aria-live="polite">
          {actionLogs.length === 0 ? (
            <div style={{ color: '#64748b', fontStyle: 'italic', padding: '0.5rem 0' }}>
              Chưa có tương tác nào. Hãy kéo thanh trượt nỗ lực hoặc đổi trạng thái quan hệ.
            </div>
          ) : (
            actionLogs.map((log) => (
              <div key={log.id} className={styles.logItem}>
                <span>
                  <strong className={log.actor === 'EM' ? styles.tagEm : styles.tagRival}>
                    [{log.actor}]
                  </strong>{' '}
                  {log.message}
                </span>
                <span style={{ color: '#64748b' }}>{log.timestamp}</span>
              </div>
            ))
          )}
        </output>
      </section>
    </article>
  );
}

export default SituationshipAnalyzer;
