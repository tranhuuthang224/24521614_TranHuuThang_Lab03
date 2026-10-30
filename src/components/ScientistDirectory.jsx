import { useId, useState } from 'react';
import { SMART_PEOPLE } from '../data/smartPeople';

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const qId = useId();
  const iqId = useId();
  const sortId = useId();

  const [people, setPeople] = useState(initialData);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');

  // Compute derived state purely in render body (ZERO useEffect)
  const visible = people
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase()) &&
        p.iq >= minIq
    )
    .toSorted((a, b) => {
      switch (sortBy) {
        case 'iq-desc':
          return b.iq - a.iq;
        case 'iq-asc':
          return a.iq - b.iq;
        case 'age-desc':
          return b.age - a.age;
        case 'age-asc':
          return a.age - b.age;
        default:
          return b.iq - a.iq;
      }
    });

  return (
    <section aria-label="Pioneer Directory">
      <header>
        <h2>Interactive Scientist &amp; Pioneer Directory</h2>
        <p>Pure derived state pipeline with zero cascading re-renders</p>
      </header>

      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={qId}>Search Name</label>
        <input
          id={qId}
          type="search"
          placeholder="Filter by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <label htmlFor={iqId}>Min IQ</label>
        <input
          id={iqId}
          type="number"
          min="0"
          max="300"
          value={minIq}
          onChange={(e) =>
            setMinIq(
              Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber
            )
          }
        />

        <label htmlFor={sortId}>Sort By</label>
        <select
          id={sortId}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="iq-desc">IQ (Highest First)</option>
          <option value="iq-asc">IQ (Lowest First)</option>
          <option value="age-desc">Age (Oldest First)</option>
          <option value="age-asc">Age (Youngest First)</option>
        </select>
      </form>

      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            <span>{p.name}</span> — <span>Age: {p.age}</span> — <span>IQ: {p.iq}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ScientistDirectory;
