# Work Breakdown Structure (WBS) - Lab 03: Modern Component Architecture & Responsive Contracts

## Exercise 1: Semantic Engineer & Pro-Gamer Profile Card
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

## Exercise 2: Interactive Scientist & Pioneer Directory (Derived State Engine)
- [x] Task 2.1: Normalize Slide 20's `smartPeople` schema with stable entity IDs (`sp-1` to `sp-6`)
- [ ] Task 2.2: Implement case-insensitive search, min-IQ filter (`valueAsNumber`), and immutable `.toSorted()` without `useEffect`
- [ ] Task 2.3: Implement immutable delete (`prev.filter(p => p.id !== id)`), reset snapshot, and `<output role="status" aria-live="polite">`
- [ ] Task 2.4: Atomic Git Commits:
  - Commit 1: `feat(ex2): normalize smartPeople schema with stable IDs`
  - Commit 2: `feat(ex2): add search, IQ filter & toSorted`
  - Commit 3: `feat(ex2): add delete/reset & live status`

## Invariants Verified:
1. **Zero Div-Soup (Ex 1)**: Exactly 0 `<div>` elements inside `DeveloperCard.jsx` and `SkillBadge.jsx`.
2. **HTTPS Only (Ex 1)**: 0 insecure `http://` origins in component media.
3. **Zero CLS (Ex 1)**: Explicit width and height attributes preventing Cumulative Layout Shift.
4. **Zero useEffect (Ex 2)**: Exactly 0 `useEffect` hooks for filtering/sorting; 100% pure derived state.
5. **Form A11y & Number Safety (Ex 2)**: All controls bound via `useId()` and `<label htmlFor>`; numeric parsing via `e.target.valueAsNumber`.
6. **Immutable Operations (Ex 2)**: Sorting via ES2023 `.toSorted()` and deletions via pure array filtering.
7. **Single Render Pass**: Keystrokes trigger exactly 1 render cycle with zero cascading re-renders.
