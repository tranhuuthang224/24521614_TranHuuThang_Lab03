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

## Applied Creative Exercise: 'Hẹn Hò Nhưng Không Yêu' State Machine (Branch `bonus`)
- [x] Task Bonus.1: Discrete FSM Domain Modeling (`situationshipTypes.js`):
  - Strict enum phases: `STRANGERS`, `DATING_NO_LOVE`, `COMMITTED`, `GHOSTED_EXIT`
  - Banning contradictory boolean soup (`isDating && !isLoved`)
  - Asymmetric weight constants (0.1 for Em vs 50.0 for Ai Đó)
- [x] Task Bonus.2: Pure Derived State Compatibility Engine (`SituationshipAnalyzer.jsx`):
  - Pure computation of `myImpact`, `rivalImpact`, `myPercentage`, `rivalPercentage`
  - Derived Red-Flag condition: `phase === DATING_NO_LOVE && myImpact < rivalImpact`
  - Zero `useEffect` for derived values
- [x] Task Bonus.3: 'Seen Không Rep' Ghosting Timer & Memory Deallocation:
  - 5-second automatic ghosting timeout when in `DATING_NO_LOVE`
  - Visual 5s countdown progress indicator
  - Deterministic `clearTimeout` / `clearInterval` in `useEffect` cleanup return function
  - Manual "Unbind & Free Memory" button to simulate Fiber garbage collection
- [x] Task Bonus.4: WCAG 2.2 AA Accessibility & Responsive 375px Contract (`SituationshipAnalyzer.module.css`):
  - Screen reader announcement via `<output role="status" aria-live="polite">`
  - Accessible form input controls bound via React 19 `useId()` and `<label htmlFor>`
  - Mobile layout with zero horizontal scroll on iPhone SE 375px
- [x] Task Bonus.5: Automated Invariant Test Suite (`scripts/verify-checkpoint-bonus.js`):
  - Verified 15/15 invariants via `npm run test:verify:bonus`
- [x] Task Bonus.6: Atomic Git Commits:
  - Commit 1: `feat(bonus): model HenHoKhongYeu FSM & asymmetric effort engine`
  - Commit 2: `feat(bonus): add derived red-flag meter, ghosting timer cleanup & 375px UI`

---

## Invariants Verified:
1. **Deterministic FSM**: 4 discrete states replace illegal boolean combinations.
2. **Pure Derived State**: Zero `useEffect` for calculating effort scores or red-flag status.
3. **Ghosting Timer Cleanup**: Clean `clearTimeout` prevents memory leaks and background interval execution.
4. **WCAG 2.2 AA Status**: Live regions announce warnings and phase transitions to screen readers.
5. **375px Responsive Viewport**: Zero horizontal body overflow on mobile devices.
