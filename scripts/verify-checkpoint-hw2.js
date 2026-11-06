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
console.log('  HOMEWORK 2 VERIFICATION SUITE: 88-Key Polyphonic Piano (FIFO)');
console.log('======================================================\n');

const dataFile = path.join(rootDir, 'src', 'homeworks', 'GrandPiano88', 'pianoData.js');
const synthFile = path.join(rootDir, 'src', 'homeworks', 'GrandPiano88', 'PolyphonicSynth.js');
const keyFile = path.join(rootDir, 'src', 'homeworks', 'GrandPiano88', 'PianoKey.jsx');
const compFile = path.join(rootDir, 'src', 'homeworks', 'GrandPiano88', 'GrandPiano88.jsx');
const cssFile = path.join(rootDir, 'src', 'homeworks', 'GrandPiano88', 'GrandPiano88.module.css');

assert(fs.existsSync(dataFile), 'pianoData.js algorithmic generator exists');
assert(fs.existsSync(synthFile), 'PolyphonicSynth.js voice pool engine exists');
assert(fs.existsSync(keyFile), 'PianoKey.jsx memoized component exists');
assert(fs.existsSync(compFile), 'GrandPiano88.jsx component exists');
assert(fs.existsSync(cssFile), 'GrandPiano88.module.css exists');

if (fs.existsSync(dataFile)) {
  const dataContent = fs.readFileSync(dataFile, 'utf8');

  // Invariant 1: Mathematical formula 440 * 2^((midi - 69) / 12)
  assert(
    /440\s*\*\s*Math\.pow\s*\(\s*2\s*,\s*\(\s*midi\s*-\s*69\s*\)\s*\/\s*12\s*\)/.test(dataContent) ||
    /440\s*\*\s*2\s*\*\*\s*\(\s*\(\s*midi\s*-\s*69\s*\)\s*\/\s*12\s*\)/.test(dataContent),
    'Standard equal temperament frequency formula f = 440 * 2^((midi - 69) / 12) applied'
  );

  // Invariant 2: Range 21 to 108 (A0 to C8)
  assert(
    dataContent.includes('21') && dataContent.includes('108'),
    'Full 88-key piano range defined from A0 (MIDI 21) to C8 (MIDI 108)'
  );
}

if (fs.existsSync(synthFile)) {
  const synthContent = fs.readFileSync(synthFile, 'utf8');

  // Invariant 3: Max 8 voices
  assert(
    /maxVoices\s*=\s*8/.test(synthContent) || /this\.maxVoices\s*=\s*8/.test(synthContent),
    '8-Voice polyphony limit enforced (maxVoices = 8)'
  );

  // Invariant 4: Map FIFO voice stealing
  assert(
    /new\s+Map/.test(synthContent) && /keys\(\)\.next\(\)\.value/.test(synthContent),
    'O(1) Map insertion-order FIFO voice stealing present (oldest voice release)'
  );

  // Invariant 5: Click-free ADSR exponential release ramp
  assert(
    /exponentialRampToValueAtTime/.test(synthContent),
    'Click-free ADSR release envelope using exponentialRampToValueAtTime'
  );
}

if (fs.existsSync(keyFile)) {
  const keyContent = fs.readFileSync(keyFile, 'utf8');

  // Invariant 6: React.memo wrapper
  assert(
    /memo\s*\(/.test(keyContent),
    'React.memo render isolation wraps PianoKey component (preventing 88-key re-renders)'
  );

  // Invariant 7: aria-pressed on keys
  assert(
    /aria-pressed\s*=/.test(keyContent),
    'aria-pressed accessibility attribute on key button elements'
  );
}

if (fs.existsSync(compFile)) {
  const compContent = fs.readFileSync(compFile, 'utf8');

  // Invariant 8: AbortController in sequencer
  assert(
    /AbortController/.test(compContent),
    'AbortController signal utilized for deterministic playback cancellation'
  );

  // Invariant 9: Accessible live region
  assert(
    /role=['"]status['"][\s\S]*aria-live=['"]polite['"]/.test(compContent) ||
    /aria-live=['"]polite['"][\s\S]*role=['"]status['"]/.test(compContent),
    'Live performance output monitor carries role="status" and aria-live="polite"'
  );
}

if (fs.existsSync(cssFile)) {
  const cssContent = fs.readFileSync(cssFile, 'utf8');

  // Invariant 10: 375px responsive contract
  assert(
    /@media[^{]*max-width:\s*375px/i.test(cssContent),
    '375px responsive contract enforced with mobile layout'
  );
}

// Summary
console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} tests passed`);
if (failedTests > 0) {
  console.log(`Status: \x1b[31mFAILED (${failedTests} tests failed)\x1b[0m`);
  process.exit(1);
} else {
  console.log('Status: \x1b[32mALL HW2 INVARIANTS SATISFIED\x1b[0m\n');
}
