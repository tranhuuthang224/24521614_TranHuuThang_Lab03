import React, { useState, Fragment } from 'react';
import { SkillBadge } from './SkillBadge';

function getFallbackInitials(name) {
  if (!name) return 'DEV';
  const clean = name.replace(/["'()]/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DeveloperCard({
  name = 'Elon "Technoking" Musk',
  role = 'Chief Systems Architect & Pro Gamer',
  handle = '@elonmusk',
  avatarUrl = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&h=256&q=80',
  bio = 'Architecting orbital launch vehicles and multi-planetary compute infrastructure. Top-tier speedrunner, min-maxing latency from silicon to orbit.',
  stats = [
    { label: 'Guild / Organization', value: 'SpaceX // xAI // Tesla' },
    { label: 'Competitive Tier', value: 'Grandmaster (Top 0.1%)' },
    { label: 'Primary Weapon Stack', value: 'React 19 / Rust / C++' },
    { label: 'Latency / APM Spec', value: '12ms Starlink // 380 APM' },
    { label: 'Deployment Status', value: 'Active on Mainnet' },
  ],
  skills = [
    { name: 'React 19', level: 'Expert', category: 'tech' },
    { name: 'Rust', level: 'Advanced', category: 'systems' },
    { name: 'TypeScript', level: 'Master', category: 'tech' },
    { name: 'Distributed Systems', level: 'Architect', category: 'systems' },
    { name: 'Micro-APM', level: 'Grandmaster', category: 'gaming' },
    { name: 'Aim Tracking', level: 'Predator', category: 'gaming' },
    { name: 'Starship Avionics', level: 'Technoking', category: 'specialty' },
  ],
  isAvailable = true,
  className = '',
}) {
  const [imageError, setImageError] = useState(false);
  const initials = getFallbackInitials(name);
  const showFallback = imageError || !avatarUrl;

  return (
    <article
      className={`developer-card ${className}`.trim()}
      aria-labelledby="developer-card-name"
    >
      <header className="developer-card__header">
        <figure className="developer-card__avatar-container">
          {showFallback ? (
            <span
              className="developer-card__avatar-fallback"
              role="img"
              aria-label={`Initials for ${name}`}
            >
              {initials}
            </span>
          ) : (
            <img
              src={avatarUrl}
              alt={name}
              width="96"
              height="96"
              loading="lazy"
              onError={() => setImageError(true)}
              className="developer-card__avatar-image"
            />
          )}
          <span
            className={`developer-card__status-indicator ${
              isAvailable ? 'is-available' : 'is-busy'
            }`}
            title={isAvailable ? 'Online / Ready for Deploy' : 'In Deep Focus'}
            aria-label={isAvailable ? 'Status: Available' : 'Status: In Match'}
          />
        </figure>

        <hgroup className="developer-card__identity">
          <h2 id="developer-card-name" className="developer-card__name">
            {name}
          </h2>
          <p className="developer-card__handle">{handle}</p>
          <p className="developer-card__role">{role}</p>
          <p className="developer-card__bio">{bio}</p>
        </hgroup>
      </header>

      <dl className="developer-card__stats" aria-label="Engineer & Gamer Statistics">
        {stats.map((stat) => (
          <Fragment key={stat.label}>
            <dt className="developer-card__stat-term">{stat.label}</dt>
            <dd className="developer-card__stat-detail">{stat.value}</dd>
          </Fragment>
        ))}
      </dl>

      <ul className="developer-card__skills" aria-label="Skills & Proficiencies">
        {skills.map((skill) => (
          <li key={skill.name} className="developer-card__skill-item">
            <SkillBadge
              name={skill.name}
              level={skill.level}
              category={skill.category}
            />
          </li>
        ))}
      </ul>
    </article>
  );
}

export default DeveloperCard;
