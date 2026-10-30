import React from 'react';
import styles from './SkillBadge.module.css';

export function SkillBadge({
  name,
  level = 'Proficient',
  category = 'tech',
  className = '',
}) {
  const categoryClass = styles[category] || styles.tech;

  return (
    <span
      className={`${styles.badge} ${categoryClass} ${className}`.trim()}
      data-category={category}
      data-level={level}
    >
      <span className={styles.skillName}>{name}</span>
      {level && (
        <span
          className={styles.skillLevel}
          aria-label={`Proficiency: ${level}`}
        >
          [{level}]
        </span>
      )}
    </span>
  );
}

export default SkillBadge;
