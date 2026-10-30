import { useId, useState } from 'react';
import { SMART_PEOPLE } from '../data/smartPeople';
import styles from './ScientistDirectory.module.css';

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const qId = useId();
  const iqId = useId();
  const sortId = useId();

  const [people, setPeople] = useState(initialData);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');

  // Compute derived data in 1 pure pass during render (Derived State Contract)
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

  // Immutable deletion preserving remaining item keys and DOM focus
  const handleDelete = (id) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  // State snapshot restoration cleanly resetting to SMART_PEOPLE
  const handleReset = () => {
    setPeople(initialData);
    setQuery('');
    setMinIq(160);
    setSortBy('iq-desc');
  };

  return (
    <section className={styles.directorySection} aria-label="Pioneer Directory">
      <header className={styles.header}>
        <h2 className={styles.title}>Interactive Scientist &amp; Pioneer Directory</h2>
        <p className={styles.subtitle}>
          Derived state data explorer (.filter + .toSorted) with zero cascading renders
        </p>
      </header>

      <form
        role="search"
        className={styles.searchForm}
        onSubmit={(e) => e.preventDefault()}
      >
        <section className={styles.fieldGroup}>
          <label htmlFor={qId} className={styles.label}>
            Search Name
          </label>
          <input
            id={qId}
            type="search"
            placeholder="Search by pioneer name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
          />
        </section>

        <section className={styles.fieldGroup}>
          <label htmlFor={iqId} className={styles.label}>
            Min IQ ({minIq})
          </label>
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
            className={styles.input}
          />
        </section>

        <section className={styles.fieldGroup}>
          <label htmlFor={sortId} className={styles.label}>
            Sort By
          </label>
          <select
            id={sortId}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.select}
          >
            <option value="iq-desc">IQ (Highest First)</option>
            <option value="iq-asc">IQ (Lowest First)</option>
            <option value="age-desc">Age (Oldest First)</option>
            <option value="age-asc">Age (Youngest First)</option>
          </select>
        </section>
      </form>

      <section className={styles.toolbar} aria-label="Directory Status and Actions">
        <output
          role="status"
          aria-live="polite"
          className={styles.liveCounter}
        >
          Found {visible.length} of {people.length} pioneers
        </output>

        <button
          type="button"
          onClick={handleReset}
          className={styles.resetButton}
          title="Restore original SMART_PEOPLE dataset"
        >
          Reset Directory Snapshot
        </button>
      </section>

      {visible.length === 0 ? (
        <p className={styles.emptyState}>
          No pioneers match &quot;{query}&quot; with IQ &ge; {minIq}. Click Reset to restore.
        </p>
      ) : (
        <ul className={styles.peopleList} aria-label="Matched Pioneers">
          {visible.map((p) => (
            <li key={p.id} className={styles.personItem}>
              <section className={styles.personInfo}>
                <span className={styles.personName}>{p.name}</span>
                <span className={styles.personMeta}>
                  <span>Age: {p.age}</span>
                  <span>•</span>
                  <span className={styles.iqBadge}>IQ: {p.iq}</span>
                </span>
              </section>

              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className={styles.deleteButton}
                aria-label={`Delete ${p.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ScientistDirectory;
