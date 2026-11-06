# Work Breakdown Structure (WBS) - Lab 03: Modern Component Architecture & Responsive Contracts

## Exercise 1: Semantic Engineer & Pro-Gamer Profile Card (Branch `Ex1`)
- [x] Task 1.1: Project Scaffolding in React 19 + Vite with zero legacy dependencies
- [x] Task 1.2: Implement semantic `<DeveloperCard />` adhering to Lab 2's Zero Div-Soup Mandate (`<article>`, `<header>`, `<hgroup>`, `<dl>`, `<dt>`, `<dd>`, `<ul>`, `<li>`, `<Fragment>`)
- [x] Task 1.3: Implement `<SkillBadge />` component with zero `<div>` tags (`<span>` and data attributes)
- [x] Task 1.4: HTTPS Security & Image Dimensions: Zero CLS with explicit `width="96"` `height="96"` and fallback initials
- [x] Task 1.5: Synthesize Elon Musk Card (Ex 4.4) and User Profile (Ex 4.5) with rich default props
- [x] Task 1.6: CSS Modules & 375px Responsive Contract (`DeveloperCard.module.css` replacing Slide 18's `#d0f0c0`)
- [x] Task 1.7: CSS Custom Properties & Design Tokens (theming, typography, zero horizontal scroll on iPhone SE 375px)
- [x] Task 1.8: Atomic Git Commits:
  - Commit 1: `feat(ex1): implement semantic DeveloperCard and SkillBadge`
  - Commit 2: `style(ex1): add responsive 375px CSS module`

---

## Homework 3: KRAFTON x PUBG Vietnam Championship & Airdrop Arena (Branch `HW3`)
- [x] Task HW3.1: Zero-Drift Airdrop Countdown Hook (`usePubgAirdropTimer.js`):
  - Monotonic target epoch time subtraction
  - `visibilitychange` listener for instantaneous background-tab resync (zero interval throttling drift)
- [x] Task HW3.2: Domain Data Schema (`pubgArenaData.js`):
  - PVS Grand Finals VIP Passes & Contraband Crates with `Intl.NumberFormat('vi-VN', { currency: 'VND' })`
  - Vietnamese Esports squads (The Expendables, Cerberus Esports, GameHome, AGG, Roy Esports)
- [x] Task HW3.3: Optimistic Inventory Claim & 409 Conflict Rollback (`KraftonPubgVnArena.jsx`):
  - In-flight lock preventing duplicate double-clicks (`claimingId`)
  - Optimistic stock deduction with state snapshot
  - Automatic rollback on 409 Conflict (simulated concurrent race condition)
- [x] Task HW3.4: Pure Derived-State PVS Leaderboard:
  - Search filter by squad name or tag
  - Multi-criteria sorting via immutable `.toSorted()` (WWCD, Placement Pts, Kill Pts, Total Pts)
  - Zero `useEffect` for sorting/filtering
- [x] Task HW3.5: Forensic AI Failure Audit (`AI_FAILURE_AUDIT.md`):
  - Failure #1: Stale closure in live auto-polling
  - Failure #2: Redundant `useEffect` for derived leaderboard state
  - Failure #3: Naive `setInterval` countdown drift in background browser tabs
- [x] Task HW3.6: Mobile 375px Responsive Contract (`KraftonPubgVnArena.module.css`):
  - Tactical military radar theme with zero horizontal overflow on iPhone SE
  - Assistive technology live transaction feed via `<output role="status" aria-live="polite">`
- [x] Task HW3.7: Automated 16-point verification suite (`scripts/verify-checkpoint-hw3.js`)
- [x] Task HW3.8: Atomic Git Commits:
  - Commit 1: `feat(hw3): implement zero-drift airdrop timer and Vietnamese esports schema`
  - Commit 2: `feat(hw3): add optimistic 409 rollback, derived leaderboard and AI failure audit`

---

## Invariants Verified:
1. **Zero-Drift Countdown**: Monotonic epoch calculation and `visibilitychange` wake resync.
2. **Optimistic Rollback**: 409 Conflict restores inventory stock snapshot safely.
3. **In-Flight Lock**: `aria-busy` and disabled state prevent duplicate concurrent requests.
4. **Pure Derived State**: Leaderboard filtering/sorting computed during render via `.toSorted()`.
5. **Currency Formatting**: Standard `vi-VN` VND formatting via `Intl.NumberFormat`.
6. **AI Failure Audit**: Forensic proof and fixes for 3 React 19 failure modes in `AI_FAILURE_AUDIT.md`.
7. **375px Viewport Contract**: Zero horizontal body overflow on mobile screens.
