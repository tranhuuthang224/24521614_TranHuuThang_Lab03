import React from 'react';

export function SkillBadge({
  name,
  level = 'Proficient',
  category = 'tech',
  className = '',
}) {
  return (
    <span
      className={`skill-badge skill-badge--${category} ${className}`.trim()}
      data-category={category}
      data-level={level}
    >
      <span className="skill-badge__name">{name}</span>
      {level && (
        <span className="skill-badge__level" aria-label={`Proficiency: ${level}`}>
          {level}
        </span>
      )}
    </span>
  );
}

export default SkillBadge;
