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

## Invariants Verified:
1. **Zero Div-Soup**: Exactly 0 `<div>` elements inside `DeveloperCard.jsx` and `SkillBadge.jsx`.
2. **HTTPS Only**: 0 insecure `http://` origins in component media.
3. **Zero CLS**: Explicit `width="96"` and `height="96"` attributes preventing Cumulative Layout Shift.
4. **Accessibility Tree**: Semantic hierarchy matches `<article>` -> `<header>` + `<dl>` + `<ul>`.
5. **375px Responsive Contract**: Zero horizontal scroll on iPhone SE viewport (fluid layout with zero overflow).
6. **Atomic Git Log**: 2 commits adhering strictly to Conventional Commits specification.
