import { useState, Fragment } from 'react';
import { SkillBadge } from './SkillBadge';
import styles from './DeveloperCard.module.css';

function getFallbackInitials(name) {
  if (!name) return 'DEV';
  const clean = name.replace(/["'()•]/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0][0] + parts[1][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  name,
  role = 'Senior Systems Architect • UIT S3T',
  avatarUrl = '',
  metrics = { commits: 512, vdomNodes: 0, a11yScore: 100 },
  stats,
  skills = [
    { id: 'sk-1', name: 'React 19 Fiber', tier: 'Core', category: 'systems' },
    { id: 'sk-2', name: 'Semantic HTML5', tier: 'Core', category: 'specialty' },
    { id: 'sk-3', name: 'Virtual DOM Engine', tier: 'Advanced', category: 'tech' },
    { id: 'sk-4', name: 'Distributed Systems', tier: 'Master', category: 'systems' },
    { id: 'sk-5', name: 'Pro-Gaming APM', tier: 'Top 1%', category: 'gaming' },
  ],
  theme = 'default',
  className = '',
}) {
  const displayName = fullName || name || 'Tran Vinh Khiem';
  const [imageError, setImageError] = useState(false);
  const initials = getFallbackInitials(displayName);
  const showFallback = imageError || !avatarUrl;
  const themeClass = theme === 'mint' ? styles.themeMint : '';

  // Support both metrics object (Thầy Khiêm spec) and stats array
  const entries = stats
    ? stats.map((s) => [s.label, s.value])
    : Object.entries(metrics);

  return (
    <article
      className={`${styles.card} ${themeClass} ${className}`.trim()}
      aria-labelledby="dev-heading"
    >
      <header className={styles.header}>
        <figure className={styles.avatarContainer}>
          {showFallback ? (
            <span
              className={styles.avatarFallback}
              role="img"
              aria-label={`Initials for ${displayName}`}
            >
              {initials}
            </span>
          ) : (
            <img
              src={avatarUrl}
              alt={displayName}
              width="64"
              height="64"
              loading="lazy"
              onError={() => setImageError(true)}
              className={styles.avatar}
            />
          )}
        </figure>
        <hgroup>
          <h2 id="dev-heading">{displayName}</h2>
          <p>{role}</p>
        </hgroup>
      </header>

      <dl className={styles.metrics} aria-label="System Metrics & Statistics">
        {entries.map(([k, v]) => (
          <Fragment key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </Fragment>
        ))}
      </dl>

      <ul className={styles.skills} aria-label="Engineered Skills">
        {skills.map((s) => (
          <li key={s.id || s.name}>
            <SkillBadge
              name={s.name}
              level={s.tier || s.level}
              category={s.category || 'tech'}
            />
          </li>
        ))}
      </ul>
    </article>
  );
}

export default DeveloperCard;
