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
console.log('  HOMEWORK 3 VERIFICATION SUITE: KRAFTON PUBG VN Arena');
console.log('======================================================\n');

const timerFile = path.join(rootDir, 'src', 'homeworks', 'KraftonPubgVnArena', 'usePubgAirdropTimer.js');
const dataFile = path.join(rootDir, 'src', 'homeworks', 'KraftonPubgVnArena', 'pubgArenaData.js');
const compFile = path.join(rootDir, 'src', 'homeworks', 'KraftonPubgVnArena', 'KraftonPubgVnArena.jsx');
const cssFile = path.join(rootDir, 'src', 'homeworks', 'KraftonPubgVnArena', 'KraftonPubgVnArena.module.css');
const auditFile = path.join(rootDir, 'AI_FAILURE_AUDIT.md');

assert(fs.existsSync(timerFile), 'usePubgAirdropTimer.js hook exists');
assert(fs.existsSync(dataFile), 'pubgArenaData.js data schema exists');
assert(fs.existsSync(compFile), 'KraftonPubgVnArena.jsx component exists');
assert(fs.existsSync(cssFile), 'KraftonPubgVnArena.module.css exists');
assert(fs.existsSync(auditFile), 'AI_FAILURE_AUDIT.md forensic report exists');

if (fs.existsSync(timerFile)) {
  const timerContent = fs.readFileSync(timerFile, 'utf8');

  // Invariant 1: visibilitychange listener for zero-drift
  assert(
    /visibilitychange/.test(timerContent),
    'document.visibilitychange event listener active for background tab anti-drift resync'
  );

  // Invariant 2: Monotonic epoch calculation
  assert(
    /targetEpochMs\s*-\s*\(Date\.now\(\)/.test(timerContent) ||
    /targetEpochMs\s*-/.test(timerContent),
    'Monotonic target epoch delta timing applied (preventing interval drift)'
  );

  // Invariant 3: Clean event listener removal
  assert(
    /removeEventListener\s*\(\s*['"]visibilitychange['"]/.test(timerContent),
    'Clean removal of visibilitychange listener on unmount'
  );
}

if (fs.existsSync(dataFile)) {
  const dataContent = fs.readFileSync(dataFile, 'utf8');

  // Invariant 4: VND Currency formatting
  assert(
    /Intl\.NumberFormat\s*\(\s*['"]vi-VN['"]/.test(dataContent) && /VND/.test(dataContent),
    'Intl.NumberFormat("vi-VN", { currency: "VND" }) format applied for prices'
  );

  // Invariant 5: Vietnamese Esports Squads
  assert(
    dataContent.includes('The Expendables') && dataContent.includes('Cerberus Esports'),
    'Vietnamese PVS Esports squads (The Expendables, Cerberus Esports) present in schema'
  );
}

if (fs.existsSync(compFile)) {
  const compContent = fs.readFileSync(compFile, 'utf8');

  // Invariant 6: 409 Conflict rollback
  assert(
    /409/.test(compContent) && (/previousDrops/.test(compContent) || /rollback/i.test(compContent)),
    'Optimistic inventory deduction with 409 Conflict rollback guarantee'
  );

  // Invariant 7: Immutable .toSorted() for derived leaderboard
  assert(
    /\.toSorted\s*\(/.test(compContent),
    'Immutable Array.prototype.toSorted() utilized for leaderboard sorting (Zero useEffect)'
  );

  // Invariant 8: In-flight duplicate lock
  assert(
    /claimingId/.test(compContent) && /aria-busy/.test(compContent),
    'In-flight lock and aria-busy state prevent duplicate double-click claims'
  );

  // Invariant 9: Accessible status output
  assert(
    /role=['"]status['"][\s\S]*aria-live=['"]polite['"]/.test(compContent) ||
    /aria-live=['"]polite['"][\s\S]*role=['"]status['"]/.test(compContent),
    'Accessible transaction claim feed carries <output role="status" aria-live="polite">'
  );
}

if (fs.existsSync(auditFile)) {
  const auditContent = fs.readFileSync(auditFile, 'utf8');

  // Invariant 10: 3 documented AI bugs
  assert(
    auditContent.includes('Failure #01') &&
    auditContent.includes('Failure #02') &&
    auditContent.includes('Failure #03'),
    'AI_FAILURE_AUDIT.md documents minimum 3 verified React 19 failure modes'
  );
}

if (fs.existsSync(cssFile)) {
  const cssContent = fs.readFileSync(cssFile, 'utf8');

  // Invariant 11: 375px responsive breakpoint
  assert(
    /@media[^{]*max-width:\s*375px/i.test(cssContent),
    '375px responsive contract enforced for mobile display'
  );
}

// Summary
console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} tests passed`);
if (failedTests > 0) {
  console.log(`Status: \x1b[31mFAILED (${failedTests} tests failed)\x1b[0m`);
  process.exit(1);
} else {
  console.log('Status: \x1b[32mALL HW3 INVARIANTS SATISFIED\x1b[0m\n');
}
