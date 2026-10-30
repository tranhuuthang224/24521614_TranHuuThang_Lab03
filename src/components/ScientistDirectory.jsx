import { useState } from 'react';
import { SMART_PEOPLE } from '../data/smartPeople';

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const [people, setPeople] = useState(initialData);

  return (
    <section aria-label="Pioneer Directory">
      <header>
        <h2>Interactive Scientist &amp; Pioneer Directory</h2>
        <p>Normalized schema with stable IDs for deterministic reconciliation</p>
      </header>

      <ul>
        {people.map((p) => (
          <li key={p.id}>
            <span>{p.name}</span> — <span>Age: {p.age}</span> — <span>IQ: {p.iq}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ScientistDirectory;
