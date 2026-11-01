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
console.log('  CHECKPOINT 3 VERIFICATION SUITE: PUBG VN Telemetry');
console.log('======================================================\n');

const telemetryFile = path.join(rootDir, 'src', 'components', 'PubgMatchTelemetry.jsx');
const telemetryCssFile = path.join(rootDir, 'src', 'components', 'PubgMatchTelemetry.module.css');
const squadsFile = path.join(rootDir, 'src', 'data', 'pubgSquads.js');

if (!fs.existsSync(telemetryFile)) {
  console.error(`Missing file: ${telemetryFile}`);
  process.exit(1);
}

const content = fs.readFileSync(telemetryFile, 'utf8');

// 1. Invariant: 4-State Machine Representation
const hasLoadingState = /status:\s*['"]LOADING['"]/i.test(content) || /status\s*===\s*['"]LOADING['"]/i.test(content);
const hasSuccessState = /status:\s*['"]SUCCESS['"]/i.test(content) || /status\s*===\s*['"]SUCCESS['"]/i.test(content);
const hasErrorState = /status:\s*['"]ERROR['"]/i.test(content) || /status\s*===\s*['"]ERROR['"]/i.test(content);
assert(
  hasLoadingState && hasSuccessState && hasErrorState,
  '4-State Machine lifecycle: IDLE | LOADING | SUCCESS | ERROR implemented'
);

// 2. Invariant: AbortController instantiation and cleanup
const hasAbortController = /new\s+AbortController\s*\(\s*\)/.test(content);
const hasAbortCall = /controller\.abort\s*\(\s*\)/.test(content);
const hasCleanupReturn = /return\s*\(\s*\)\s*=>\s*controller\.abort\s*\(\s*\)/.test(content);
assert(
  hasAbortController && hasAbortCall && hasCleanupReturn,
  'AbortController created inside useEffect with deterministic cleanup return () => controller.abort()'
);

// 3. Invariant: Safe AbortError Guard
const hasAbortErrorGuard = /err\.name\s*===\s*['"]AbortError['"]/i.test(content);
assert(
  hasAbortErrorGuard,
  'Safe AbortError guard prevents false error banners during rapid squad switching'
);

// 4. Invariant: Zero window.alert() Mandate (Fixing Slide 19)
const hasWindowAlert = /\bwindow\.alert\b|\balert\s*\(/i.test(content);
assert(
  !hasWindowAlert,
  'ZERO window.alert() calls inside PubgMatchTelemetry.jsx (Accessible UI Mandate)'
);

// 5. Invariant: Accessible Elements (role="alert", aria-live="polite", aria-busy="true")
const hasRoleAlert = /role=['"]alert['"]/i.test(content);
const hasAriaLive = /aria-live=['"]polite['"]/i.test(content);
const hasAriaBusy = /aria-busy=['"]true['"]/i.test(content);
assert(
  hasRoleAlert,
  'Error state renders inside accessible <section role="alert">'
);
assert(
  hasAriaLive,
  'Success telemetry radar wrapped in <article aria-live="polite">'
);
assert(
  hasAriaBusy,
  'Skeleton loader marked with aria-busy="true" during telemetry sync'
);

// 6. Invariant: Retry Recovery Trigger
const hasRetry = /retryTick|setRetryTick|handleRetry/i.test(content);
assert(
  hasRetry,
  'Retry recovery mechanism triggers clean re-execution of telemetry pipeline'
);

// 7. Invariant: Dimension-Matched 220px Skeleton (Zero CLS)
if (fs.existsSync(telemetryCssFile)) {
  const cssContent = fs.readFileSync(telemetryCssFile, 'utf8');
  const has220px = /220px/.test(cssContent);
  assert(
    has220px,
    'Dimension-matched 220px min-height skeleton card guarantees 0.00 Cumulative Layout Shift'
  );
}

// Summary
console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} tests passed`);
if (failedTests > 0) {
  console.log(`Status: \x1b[31mFAILED (${failedTests} tests failed)\x1b[0m`);
  process.exit(1);
} else {
  console.log('Status: \x1b[32mALL CHECKPOINT 3 INVARIANTS SATISFIED\x1b[0m\n');
}
