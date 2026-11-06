import React, { useState, useMemo, useId, useTransition } from 'react';
import {
  getInitialCrateDrops,
  INITIAL_SQUAD_STANDINGS,
  formatVnd,
} from './pubgArenaData';
import { usePubgAirdropTimer } from './usePubgAirdropTimer';
import styles from './KraftonPubgVnArena.module.css';

/**
 * KraftonPubgVnArena Component (Homework 3 - Slide 29 & 30)
 * KRAFTON x PUBG Vietnam Championship & Airdrop Arena
 * Features:
 * - Anti-drift airdrop countdown hook with visibilitychange resync
 * - Optimistic VIP Ticket & G-Coin Crate claim with 409 Conflict rollback
 * - Pure derived-state PVS Grand Finals leaderboard with .toSorted()
 * - WCAG 2.2 AA live region status and 375px responsive contract
 */
export function KraftonPubgVnArena() {
  const [drops, setDrops] = useState(getInitialCrateDrops);
  const [claimingId, setClaimingId] = useState(null);
  const [simulate409, setSimulate409] = useState(false);
  const [rollbackAlert, setRollbackAlert] = useState(null);
  const [claimLogs, setClaimLogs] = useState([]);

  // Leaderboard filter & sort state (Strict Derived State - Zero useEffect)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('total'); // 'total' | 'wwcd' | 'kill' | 'placement'

  const searchInputId = useId();
  const simCheckboxId = useId();

  // Primary Airdrop Countdown Timer using Slide 30 monotonic target epoch hook
  const primaryDrop = drops[0];
  const { isLive, formattedTime } = usePubgAirdropTimer(
    primaryDrop ? primaryDrop.targetEpochMs : Date.now() + 180000
  );

  // Optimistic Inventory Claim & 409 Conflict Rollback Pipeline
  const handleClaimDrop = async (dropId) => {
    if (claimingId) return; // Prevent duplicate clicks (in-flight lock)

    const targetDrop = drops.find((d) => d.id === dropId);
    if (!targetDrop || targetDrop.stock <= 0) return;

    setRollbackAlert(null);

    // 1. Snapshot previous state for rollback guarantee
    const previousDrops = drops;

    // 2. Optimistic Update: Immediately decrement stock in UI
    setDrops((prev) =>
      prev.map((item) =>
        item.id === dropId ? { ...item, stock: item.stock - 1 } : item
      )
    );
    setClaimingId(dropId);

    // 3. Simulated Network Call (400ms delay)
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (simulate409) {
            // Simulated 409 Conflict: another user grabbed the last unit!
            reject(
              new Error(
                `409 Conflict: [${targetDrop.title}] concurrently claimed by another gamer in Erangel Blue-Zone!`
              )
            );
          } else {
            resolve({ success: true, claimedAt: Date.now() });
          }
        }, 450);
      });

      // Successful Claim Log
      const timeStr = new Date().toLocaleTimeString('vi-VN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setClaimLogs((prev) => [
        {
          id: `${dropId}-${Date.now()}`,
          title: targetDrop.title,
          price: formatVnd(targetDrop.priceVnd),
          time: timeStr,
          status: 'SUCCESS',
        },
        ...prev.slice(0, 9),
      ]);
    } catch (err) {
      // Rollback optimistic deduction on 409 Conflict!
      setDrops(previousDrops);
      setRollbackAlert(err.message);

      // Record Rollback to live log
      setClaimLogs((prev) => [
        {
          id: `err-${Date.now()}`,
          title: `ROLLBACK: ${targetDrop.title}`,
          price: '0 ₫',
          time: new Date().toLocaleTimeString('vi-VN'),
          status: 'ROLLED_BACK',
        },
        ...prev.slice(0, 9),
      ]);
    } finally {
      setClaimingId(null);
    }
  };

  // Pure Derived State: Squad Leaderboard with .toSorted() (Zero useEffect)
  const filteredAndSortedSquads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // 1. Filter
    const filtered = INITIAL_SQUAD_STANDINGS.filter(
      (squad) =>
        squad.squadName.toLowerCase().includes(query) ||
        squad.tag.toLowerCase().includes(query)
    );

    // 2. Compute Total Points and Sort via immutable .toSorted()
    return filtered
      .map((s) => ({
        ...s,
        totalPts: s.placementPts + s.killPts,
      }))
      .toSorted((a, b) => {
        if (sortBy === 'wwcd') return b.wwcdCount - a.wwcdCount;
        if (sortBy === 'kill') return b.killPts - a.killPts;
        if (sortBy === 'placement') return b.placementPts - a.placementPts;
        return b.totalPts - a.totalPts; // Default 'total'
      });
  }, [searchQuery, sortBy]);

  return (
    <main
      className={styles.container}
      aria-label="KRAFTON PUBG Vietnam Championship Arena"
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.badgeRow}>
            <span className={styles.badgePvs}>PVS 2026 Grand Finals</span>
            <span className={styles.badgeServer}>Server: VN-HCMC-01</span>
          </div>
          <h1 className={styles.title}>KRAFTON x PUBG VN Championship</h1>
          <p className={styles.subtitle}>
            Official PVS Finals Ticket &amp; G-Coin Contraband Arena with zero-drift anti-tab
            throttling timer and optimistic 409 Conflict rollback.
          </p>
        </div>
      </header>

      {/* Master Anti-Drift Airdrop Timer Card */}
      <section className={styles.airdropCard} aria-label="Live Airdrop Countdown">
        <div className={styles.airdropInfo}>
          <span className={styles.airdropTag}>Next Erangel Supply Drop</span>
          <span className={styles.airdropName}>{primaryDrop?.title}</span>
        </div>
        <div className={styles.airdropClock}>
          <time className={styles.clockDisplay} aria-live="off">
            {formattedTime}
          </time>
          <span
            className={`${styles.clockStatus} ${
              isLive ? styles.statusLive : styles.statusWarmup
            }`}
          >
            {isLive ? 'AIRDROP LIVE' : 'SYNCING VIA VISIBILITY'}
          </span>
        </div>
      </section>

      {/* 409 Conflict Simulation Bar */}
      <section className={styles.simBar} aria-label="Conflict Simulation Controls">
        <label htmlFor={simCheckboxId} className={styles.simLabel}>
          <input
            id={simCheckboxId}
            type="checkbox"
            checked={simulate409}
            onChange={(e) => setSimulate409(e.target.checked)}
          />
          <span>Simulate 409 Conflict (Concurrent Race / Sold Out)</span>
        </label>
        {simulate409 && (
          <span className={styles.simBadge}>
            [TEST MODE] Claim attempts will trigger HTTP 409 &amp; roll back inventory!
          </span>
        )}
      </section>

      {/* Rollback Alert Banner */}
      {rollbackAlert && (
        <aside role="alert" className={styles.alertBanner}>
          <p className={styles.alertText}>{rollbackAlert}</p>
          <button
            type="button"
            onClick={() => setRollbackAlert(null)}
            className={styles.dismissAlertBtn}
          >
            Dismiss
          </button>
        </aside>
      )}

      {/* VIP Tickets & G-Coin Drops Grid */}
      <section aria-labelledby="drops-heading">
        <h2 id="drops-heading" className={styles.sectionTitle}>
          PVS Grand Finals Passes &amp; Contraband Crates
        </h2>
        <div className={styles.dropsGrid}>
          {drops.map((drop) => {
            const isClaiming = claimingId === drop.id;
            const isSoldOut = drop.stock <= 0;
            const rarityClass =
              drop.rarity === 'Mythic'
                ? styles.rarityMythic
                : drop.rarity === 'Legendary'
                ? styles.rarityLegendary
                : styles.rarityRare;

            return (
              <article key={drop.id} className={styles.dropCard}>
                <div>
                  <div className={styles.dropHeader}>
                    <span className={`${styles.rarityBadge} ${rarityClass}`}>
                      {drop.rarity}
                    </span>
                  </div>
                  <h3 className={styles.dropTitle}>{drop.title}</h3>
                  <div className={styles.dropPrice}>{formatVnd(drop.priceVnd)}</div>
                </div>

                <div>
                  <div className={styles.stockRow}>
                    <span>Remaining Stock:</span>
                    <span className={styles.stockCount}>
                      {isSoldOut ? 'SOLD OUT' : `${drop.stock} units`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleClaimDrop(drop.id)}
                    disabled={isSoldOut || claimingId !== null}
                    aria-busy={isClaiming}
                    className={`${styles.claimButton} ${
                      isClaiming ? styles.claimButtonBusy : ''
                    }`}
                  >
                    {isClaiming
                      ? '⚡ Locking Inventory...'
                      : isSoldOut
                      ? 'Sold Out'
                      : 'Claim with G-Coin'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Live PVS Leaderboard (Pure Derived State) */}
      <section className={styles.leaderboardSection} aria-labelledby="leaderboard-heading">
        <div className={styles.leaderboardFilters}>
          <h2 id="leaderboard-heading" className={styles.sectionTitle} style={{ margin: 0 }}>
            PVS 2026 Live Standings ({filteredAndSortedSquads.length} Teams)
          </h2>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <label htmlFor={searchInputId} className="sr-only" style={{ display: 'none' }}>
              Search Squad
            </label>
            <input
              id={searchInputId}
              type="search"
              placeholder="Filter squad name or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />

            <div className={styles.sortTabs} role="group" aria-label="Sort Standings">
              {[
                { id: 'total', label: 'Total Pts' },
                { id: 'wwcd', label: 'WWCD' },
                { id: 'kill', label: 'Kills' },
                { id: 'placement', label: 'Placement' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSortBy(tab.id)}
                  className={`${styles.sortTabBtn} ${
                    sortBy === tab.id ? styles.sortTabActive : ''
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <figure className={styles.tableWrapper}>
          <table className={styles.leaderboardTable} aria-label="PVS Standings Table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Squad Name</th>
                <th scope="col">WWCD</th>
                <th scope="col">Placement</th>
                <th scope="col">Kills</th>
                <th scope="col">Total Pts</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSquads.map((squad, index) => (
                <tr key={squad.squadId}>
                  <td className={styles.rankBadge}>#{index + 1}</td>
                  <td className={styles.squadName}>
                    [{squad.tag}] {squad.squadName}
                  </td>
                  <td>{squad.wwcdCount} 🍗</td>
                  <td>{squad.placementPts}</td>
                  <td>{squad.killPts}</td>
                  <td className={styles.pointsBold}>{squad.totalPts} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      </section>

      {/* Accessible Claim Log Output (<output role="status" aria-live="polite">) */}
      <section className={styles.claimLogSection} aria-labelledby="claim-log-heading">
        <div className={styles.claimLogHeader}>
          <h2 id="claim-log-heading" style={{ margin: 0, fontSize: '0.75rem' }}>
            Live Inventory Claim Feed (WCAG 2.2 AA Status)
          </h2>
          <span>{claimLogs.length} transactions</span>
        </div>

        <output role="status" aria-live="polite" className={styles.claimOutput}>
          {claimLogs.length === 0 ? (
            <div style={{ color: '#8b949e', fontStyle: 'italic', padding: '0.5rem 0' }}>
              No transactions yet. Click &quot;Claim with G-Coin&quot; above to acquire passes.
            </div>
          ) : (
            claimLogs.map((log) => (
              <div key={log.id} className={styles.claimLogItem}>
                <span style={{ color: log.status === 'SUCCESS' ? '#3fb950' : '#f85149' }}>
                  {log.status === 'SUCCESS' ? '✔ CLAIMED:' : '✖ ROLLBACK:'} {log.title}
                </span>
                <span style={{ color: '#8b949e' }}>{log.time}</span>
              </div>
            ))
          )}
        </output>
      </section>
    </main>
  );
}
