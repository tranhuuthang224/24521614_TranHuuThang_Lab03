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
console.log('  HOMEWORK 1 VERIFICATION SUITE: Studio Drum Kit (WCAG 2.2 AA)');
console.log('======================================================\n');

const hookFile = path.join(rootDir, 'src', 'homeworks', 'DrumMachine', 'useDrumKeyboard.js');
const engineFile = path.join(rootDir, 'src', 'homeworks', 'DrumMachine', 'drumAudioEngine.js');
const compFile = path.join(rootDir, 'src', 'homeworks', 'DrumMachine', 'DrumMachine.jsx');
const cssFile = path.join(rootDir, 'src', 'homeworks', 'DrumMachine', 'DrumMachine.module.css');
const dataFile = path.join(rootDir, 'src', 'homeworks', 'DrumMachine', 'drumPadsData.js');

assert(fs.existsSync(hookFile), 'Hook useDrumKeyboard.js exists');
assert(fs.existsSync(engineFile), 'Web Audio synthesizer engine exists');
assert(fs.existsSync(compFile), 'DrumMachine component exists');
assert(fs.existsSync(dataFile), 'Drum pads data schema exists');

if (fs.existsSync(hookFile)) {
  const hookContent = fs.readFileSync(hookFile, 'utf8');

  // Invariant 1: Physical e.code used
  assert(
    /e\.code/.test(hookContent),
    'W3C physical e.code used instead of deprecated e.keyCode (Vietnamese IME safe)'
  );

  // Invariant 2: Anti-repeat guard
  assert(
    /e\.repeat/.test(hookContent),
    'Anti-repeat guard present (if (e.repeat) return) preventing OS key-hold spam'
  );

  // Invariant 3: Input focus isolation
  assert(
    /INPUT/.test(hookContent) && /TEXTAREA/.test(hookContent),
    'Input focus isolation present preventing shortcuts while typing in inputs'
  );

  // Invariant 4: Event listener cleanup
  assert(
    /removeEventListener\s*\(\s*['"]keydown['"]/.test(hookContent),
    'Deterministic window keydown cleanup return function present'
  );
}

if (fs.existsSync(dataFile)) {
  const dataContent = fs.readFileSync(dataFile, 'utf8');
  const requiredKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyJ', 'KeyK', 'KeyL'];
  const hasAllKeys = requiredKeys.every(k => dataContent.includes(k));
  assert(
    hasAllKeys,
    'All 7 slide-specified physical keys mapped (w, a, s, d, j, k, l)'
  );
}

if (fs.existsSync(compFile)) {
  const compContent = fs.readFileSync(compFile, 'utf8');

  // Invariant 5: Accessible live hit log
  assert(
    /<output[\s\S]*role=['"]status['"][\s\S]*aria-live=['"]polite['"]/i.test(compContent) ||
    /<output[\s\S]*aria-live=['"]polite['"][\s\S]*role=['"]status['"]/i.test(compContent),
    'Deaf / Hard-of-Hearing accessible visual hit log <output role="status" aria-live="polite">'
  );

  // Invariant 6: aria-pressed on buttons
  assert(
    /aria-pressed\s*=/i.test(compContent),
    'Drum pad buttons carry aria-pressed attribute for toggle/trigger state feedback'
  );

  // Invariant 7: Decibel/volume visual meter
  assert(
    /meter|decibel|visualMeter/i.test(compContent),
    'Visual decibel meter present for auditory-visual sensory substitution'
  );
}

if (fs.existsSync(engineFile)) {
  const engineContent = fs.readFileSync(engineFile, 'utf8');
  assert(
    /AudioContext/.test(engineContent),
    'Native Web Audio API AudioContext utilized for deterministic zero-dependency synthesis'
  );
}

if (fs.existsSync(cssFile)) {
  const cssContent = fs.readFileSync(cssFile, 'utf8');
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
  console.log('Status: \x1b[32mALL HW1 INVARIANTS SATISFIED\x1b[0m\n');
}
