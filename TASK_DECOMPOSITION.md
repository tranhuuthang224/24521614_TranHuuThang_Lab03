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

## Homework 2: 88-Key Polyphonic Piano & Concurrent FIFO Sequencer (Branch `HW2`)
- [x] Task HW2.1: Algorithmic 88-Key Mathematical Generator (`pianoData.js`):
  - Derives exact 88 keys (A0 to C8, 52 white, 36 black) via $f = 440 \times 2^{(midi - 69) / 12}$
  - Zero hardcoded button tags
- [x] Task HW2.2: Polyphonic Voice Pool & FIFO Voice Stealing (`PolyphonicSynth.js`):
  - O(1) active voice tracking with ES6 Map (FIFO insertion order)
  - 8-voice polyphonic limit with automatic voice stealing on 9th concurrent note
  - Click-free ADSR envelope release with `exponentialRampToValueAtTime`
- [x] Task HW2.3: Memoized Key Component (`PianoKey.jsx`):
  - `React.memo` isolation: pressing 1 key only re-renders that exact key
  - Multi-touch pointer events: `onPointerDown`, `onPointerUp`, `onPointerLeave`
  - Accessible `aria-pressed={isPressed}` state
- [x] Task HW2.4: Concurrent FIFO Sequencer & Replay:
  - Performance recording with delta timestamps
  - Variable-speed playback (0.5x, 1.0x, 2.0x)
  - Deterministic `AbortController` cancellation on Stop or unmount
  - Integrated Ludwig van Beethoven's *Für Elise* demo playback
- [x] Task HW2.5: Octave Navigation & 375px Mobile Responsive Layout (`GrandPiano88.module.css`):
  - Octave band quick-jump selector (Bass, Mid, Treble, All 88)
  - Fluid horizontal scroll keyboard bed
  - Assistive technology performance status via `<output role="status" aria-live="polite">`
- [x] Task HW2.6: Automated 15-point verification suite (`scripts/verify-checkpoint-hw2.js`)
- [x] Task HW2.7: Atomic Git Commits:
  - Commit 1: `feat(hw2): implement algorithmic 88-key generator and polyphonic FIFO synth engine`
  - Commit 2: `feat(hw2): implement memoized PianoKey and variable-speed sequencer with AbortController`

---

## Invariants Verified:
1. **Algorithmic 88 Keys**: Mathematically computed across 7+ octaves, hardcoding banned.
2. **Polyphonic Limit**: Maximum 8 concurrent voices, 9th note steals oldest in FIFO order.
3. **Click-Free Audio**: ADSR exponential ramp to $0.0001$ before oscillator cutoff.
4. **React.memo Render Isolation**: Single keypress re-renders exactly 1 key component.
5. **Abortable Sequencer**: `AbortController` safely halts in-flight playback promises.
6. **375px Viewport Contract**: Zero horizontal body overflow on mobile screens.
