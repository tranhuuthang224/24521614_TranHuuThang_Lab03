import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, detail = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✔\x1b[0m ${testName}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31m✘\x1b[0m ${testName}`);
    if (detail) console.error(`    \x1b[33mDetail: ${detail}\x1b[0m`);
  }
}

console.log('\n======================================================');
console.log('  CHECKPOINT 2 VERIFICATION SUITE: Scientist Directory');
console.log('======================================================\n');

const scientistDirFile = path.join(rootDir, 'src', 'components', 'ScientistDirectory.jsx');
const smartPeopleFile = path.join(rootDir, 'src', 'data', 'smartPeople.js');

if (!fs.existsSync(scientistDirFile)) {
  console.error(`Missing file: ${scientistDirFile}`);
  process.exit(1);
}

const content = fs.readFileSync(scientistDirFile, 'utf8');

// 1. Invariant: ZERO useEffect for derived state
const useEffectMatches = content.match(/\buseEffect\b/g) || [];
assert(
  useEffectMatches.length === 0,
  'ZERO useEffect anti-pattern in ScientistDirectory.jsx (Pure Derived State)',
  `Found ${useEffectMatches.length} useEffect occurrences`
);

// 2. Invariant: Normalized Schema with Stable IDs
const hasStableIds = /sp-[1-6]/.test(content) || (fs.existsSync(smartPeopleFile) && /sp-[1-6]/.test(fs.readFileSync(smartPeopleFile, 'utf8')));
assert(
  hasStableIds,
  'Normalized smartPeople dataset with stable IDs (sp-1 to sp-6)'
);

// 3. Invariant: Accessible Form Binding with useId()
const hasUseId = /useId\s*\(/i.test(content);
const hasHtmlFor = /htmlFor\s*=/i.test(content);
assert(
  hasUseId && hasHtmlFor,
  'Accessible Form Control with useId() and <label htmlFor={...}> bindings'
);

// 4. Invariant: Type-safe Numeric Filtering with valueAsNumber
const hasValueAsNumber = /valueAsNumber/.test(content);
const hasNanGuard = /isNaN/.test(content);
assert(
  hasValueAsNumber && hasNanGuard,
  'Type-safe numeric input with valueAsNumber and Number.isNaN fallback'
);

// 5. Invariant: Immutable Sorting via ES2023 .toSorted()
const hasToSorted = /\.toSorted\s*\(/.test(content);
const hasMutatingSort = /\.sort\s*\(/.test(content);
assert(
  hasToSorted && !hasMutatingSort,
  'Immutable sorting via ES2023 .toSorted() without mutating in-place'
);

// 6. Invariant: Delete & Reset Handlers
const hasDelete = /filter\s*\(\s*\(?[a-zA-Z0-9_]+\)?\s*=>\s*[a-zA-Z0-9_]+\.id\s*!==/i.test(content) || /handleDelete|onDelete/i.test(content);
const hasReset = /handleReset|onReset|SMART_PEOPLE/i.test(content);
assert(
  hasDelete && hasReset,
  'Immutable item deletion and state snapshot reset handler present'
);

// 7. Invariant: Screen-reader Live Counter
const hasLiveOutput = /<output[\s\S]*role=['"]status['"][\s\S]*aria-live=['"]polite['"]/i.test(content) ||
                      /<output[\s\S]*aria-live=['"]polite['"][\s\S]*role=['"]status['"]/i.test(content);
assert(
  hasLiveOutput,
  'Accessible live counter element <output role="status" aria-live="polite">'
);

// Summary
console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} tests passed`);
if (failedTests > 0) {
  console.log(`Status: \x1b[31mFAILED (${failedTests} tests failed)\x1b[0m`);
  process.exit(1);
} else {
  console.log('Status: \x1b[32mALL CHECKPOINT 2 INVARIANTS SATISFIED\x1b[0m\n');
}
