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

## Homework 1: Production Studio Drum Kit (Branch `HW1`)
- [x] Task HW1.1: Drum pads data schema with 7 physical W3C keys (`KeyW`, `KeyA`, `KeyS`, `KeyD`, `KeyJ`, `KeyK`, `KeyL`) and frequency mappings
- [x] Task HW1.2: Custom hook `useDrumKeyboard(padMap, onTriggerPad, isEnabled)`:
  - Hardware scancode detection via `e.code` (Vietnamese IME UniKey immunity)
  - Anti-repeat guard (`if (e.repeat) return`) preventing OS key-hold spamming
  - Input focus isolation (`['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)`)
  - Deterministic event listener registration and cleanup
- [x] Task HW1.3: Native Web Audio API synthesis engine (`drumAudioEngine.js`):
  - Zero external MP3 / CORS network dependencies
  - Synthesized Kick, Snare, Closed/Open Hi-Hats, Clap, Crash, and Ride
  - Master volume and gain automation
- [x] Task HW1.4: Production React 19 `<DrumMachine />` UI:
  - Tactile pads with active transient animation
  - Deaf / Hard-of-Hearing accessibility via `<output role="status" aria-live="polite">`
  - Visual decibel / VU meter (`role="meter"`) with smooth level decay
  - Accessible button attributes (`aria-pressed={isActive}`)
  - Live interactive input isolation test zone
- [x] Task HW1.5: Mobile 375px responsive contract (`DrumMachine.module.css`):
  - Zero horizontal scroll on iPhone SE viewport
- [x] Task HW1.6: Automated 14-point verification test suite (`scripts/verify-checkpoint-hw1.js`)
- [x] Task HW1.7: Atomic Git Commits:
  - Commit 1: `feat(hw1): implement Web Audio studio drum engine and physical key binding hook`
  - Commit 2: `feat(hw1): implement WCAG 2.2 AA DrumMachine with visual hit log and decibel meter`

---

## Invariants Verified:
1. **Physical Key Binding**: Uses `e.code` scancode (`KeyW` through `KeyL`), never deprecated `e.keyCode`.
2. **Vietnamese IME Resilience**: Typing with UniKey active does not break drum triggers or duplicate events.
3. **Anti-Repeat Guard**: Holding down keys produces exactly 1 trigger, preventing audio glitching and state flood.
4. **Input Focus Isolation**: Keystrokes inside `<input>` or `<textarea>` do not fire drum pads.
5. **Native Web Audio Synthesis**: Zero external network or asset dependencies for sound generation.
6. **WCAG 2.2 AA Compliance**: Screen reader announcements via `<output role="status" aria-live="polite">` and visual VU meter.
7. **375px Responsive Contract**: Zero horizontal scroll on mobile viewport.
