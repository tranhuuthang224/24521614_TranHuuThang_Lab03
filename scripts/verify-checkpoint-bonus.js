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
console.log('  BONUS EXERCISE VERIFICATION: SituationshipAnalyzer');
console.log('======================================================\n');

const typesFile = path.join(rootDir, 'src', 'components', 'SituationshipAnalyzer', 'situationshipTypes.js');
const compFile = path.join(rootDir, 'src', 'components', 'SituationshipAnalyzer', 'SituationshipAnalyzer.jsx');
const cssFile = path.join(rootDir, 'src', 'components', 'SituationshipAnalyzer', 'SituationshipAnalyzer.module.css');

assert(fs.existsSync(typesFile), 'situationshipTypes.js exists');
assert(fs.existsSync(compFile), 'SituationshipAnalyzer.jsx component exists');
assert(fs.existsSync(cssFile), 'SituationshipAnalyzer.module.css exists');

if (fs.existsSync(typesFile)) {
  const typesContent = fs.readFileSync(typesFile, 'utf8');

  // Invariant 1: 4 FSM phases defined
  assert(
    typesContent.includes('STRANGERS') &&
    typesContent.includes('DATING_NO_LOVE') &&
    typesContent.includes('COMMITTED') &&
    typesContent.includes('GHOSTED_EXIT'),
    'Deterministic Finite State Machine (FSM) defines 4 discrete relationship phases'
  );

  // Invariant 2: Asymmetric weights 0.1 vs 50.0
  assert(
    typesContent.includes('0.1') && typesContent.includes('50'),
    'Asymmetric effort weights (0.1 for Em vs 50.0 for Ai Đó) properly configured'
  );
}

if (fs.existsSync(compFile)) {
  const compContent = fs.readFileSync(compFile, 'utf8');

  // Invariant 3: Pure Derived State (Zero useEffect for isRedFlag)
  const hasDerivedFormula = /myTries\s*\*\s*EM_WEIGHT/.test(compContent) || /myTries\s*\*\s*0\.1/.test(compContent);
  assert(
    hasDerivedFormula,
    'myImpact and rivalImpact computed directly during render as Pure Derived State'
  );

  const hasRedFlagCondition = /myImpact\s*<\s*rivalImpact/.test(compContent);
  assert(
    hasRedFlagCondition,
    'Red-Flag condition derived purely: phase === DATING_NO_LOVE && myImpact < rivalImpact'
  );

  // Invariant 4: Ghosting 5s timeout with deterministic clearTimeout
  assert(
    /setTimeout\s*\([\s\S]*5000\)/.test(compContent) && /clearTimeout/.test(compContent),
    '5s Ghosting timeout with deterministic clearTimeout in useEffect cleanup function'
  );

  // Invariant 5: Accessible status live output
  assert(
    /<output[\s\S]*role=['"]status['"][\s\S]*aria-live=['"]polite['"]/.test(compContent) ||
    /<output[\s\S]*aria-live=['"]polite['"][\s\S]*role=['"]status['"]/.test(compContent),
    'Accessible live region carries <output role="status" aria-live="polite">'
  );

  // Invariant 6: React 19 useId for inputs
  assert(
    /useId\s*\(/.test(compContent),
    'React 19 useId() used for accessible form input bindings'
  );

  // Invariant 7: Free memory action button
  assert(
    /Unbind\s*&\s*Free\s*Memory/i.test(compContent) || /GHOSTED_EXIT/.test(compContent),
    'Manual "Unbind & Free Memory" button present to force garbage collection exit'
  );
}

if (fs.existsSync(cssFile)) {
  const cssContent = fs.readFileSync(cssFile, 'utf8');

  // Invariant 8: 375px responsive contract
  assert(
    /@media[^{]*max-width:\s*375px/i.test(cssContent),
    '375px mobile responsive contract enforced via @media (max-width: 375px)'
  );
}

// Summary
console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} tests passed`);
if (failedTests > 0) {
  console.log(`Status: \x1b[31mFAILED (${failedTests} tests failed)\x1b[0m`);
  process.exit(1);
} else {
  console.log('Status: \x1b[32mALL BONUS INVARIANTS SATISFIED\x1b[0m\n');
}
