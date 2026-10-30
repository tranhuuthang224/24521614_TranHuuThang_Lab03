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
console.log('  CHECKPOINT 1 VERIFICATION SUITE: Semantic DeveloperCard');
console.log('======================================================\n');

// 1. Verify Zero Div-Soup
const devCardPath = path.join(rootDir, 'src', 'components', 'DeveloperCard.jsx');
const skillBadgePath = path.join(rootDir, 'src', 'components', 'SkillBadge.jsx');

if (!fs.existsSync(devCardPath)) {
  console.error(`Missing file: ${devCardPath}`);
  process.exit(1);
}

const devCardContent = fs.readFileSync(devCardPath, 'utf8');
const divMatches = devCardContent.match(/<div[\s>]/gi) || [];
assert(
  divMatches.length === 0,
  'ZERO <div> soup in DeveloperCard.jsx',
  `Found ${divMatches.length} <div> tags`
);

if (fs.existsSync(skillBadgePath)) {
  const skillContent = fs.readFileSync(skillBadgePath, 'utf8');
  const skillDivs = skillContent.match(/<div[\s>]/gi) || [];
  assert(
    skillDivs.length === 0,
    'ZERO <div> soup in SkillBadge.jsx',
    `Found ${skillDivs.length} <div> tags`
  );
}

// 2. Verify HTTPS-Only Media Origins
const httpMatches = devCardContent.match(/http:\/\//gi) || [];
assert(
  httpMatches.length === 0,
  'ZERO insecure http:// origins in DeveloperCard.jsx (HTTPS only)',
  `Found ${httpMatches.length} http:// occurrences`
);

// 3. Verify Required Semantic Tags
const requiredTags = ['article', 'header', 'hgroup', 'dl', 'dt', 'dd', 'ul', 'li'];
requiredTags.forEach((tag) => {
  const tagRegex = new RegExp(`<${tag}[\\s>]`, 'i');
  assert(
    tagRegex.test(devCardContent),
    `Semantic element <${tag}> present in DeveloperCard.jsx`
  );
});

// 4. Verify Zero CLS Image Dimensions & Fallback
const hasWidthAttr = /width=["']?\d+["']?/i.test(devCardContent) || /width=\{?\d+\}?/i.test(devCardContent);
const hasHeightAttr = /height=["']?\d+["']?/i.test(devCardContent) || /height=\{?\d+\}?/i.test(devCardContent);
assert(
  hasWidthAttr && hasHeightAttr,
  'Explicit width and height attributes present on avatar img (Zero CLS)',
  'Missing explicit width/height attribute on avatar image'
);

const hasFallback = /fallback|initials|onError/i.test(devCardContent);
assert(
  hasFallback,
  'Fallback initials / onError handler present for avatar loading resilience'
);

// Summary
console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} tests passed`);
if (failedTests > 0) {
  console.log(`Status: \x1b[31mFAILED (${failedTests} tests failed)\x1b[0m`);
  process.exit(1);
} else {
  console.log('Status: \x1b[32mALL INVARIANTS SATISFIED\x1b[0m\n');
}
