# 23-case Visual Quality Review

This review is the second layer after structural Visual QA. Structural QA answers **“is the demo technically valid?”**. This document answers **“does the first screen look complete, intentional, and presentation-ready?”**.

The scores below are manual relative scores from the canonical 390 × 844 rendered state and the 780 × 1688 Library preview. They are **not CI gates** and must not be optimized blindly.

## Review dimensions

Each dimension is scored from 1–5.

1. **Composition** — visual balance, focal point, whitespace distribution.
2. **Hierarchy** — whether the eye knows what to read / do first.
3. **First-screen completeness** — whether the first 844px feels intentionally complete rather than accidentally empty or clipped.
4. **Image treatment** — crop, scale, quality, and relationship to UI.
5. **Typography** — scale rhythm, line lengths, display/body relationship.
6. **Controls** — button size, hit-area presence, CTA emphasis, component consistency.
7. **Navigation** — bottom/top navigation spacing, hierarchy, and visual integration.
8. **Library consistency** — card, video, and live demo represent the same visual system and initial state.

## Current review

| Case | Type | Comp. | Hier. | Complete | Image | Type | Controls | Nav | Consistency | Tier | Decision |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| buddy | live | 3 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | B | Keep concept; improve spacing relationship between floating travel cluster, title, and CTA. |
| carry-bag | live | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | A- | Keep. Dense editorial-commerce composition is intentional and readable. |
| cleanbite | live | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | A | Keep. Strong focal image, data hierarchy, CTA, and bottom navigation. |
| fashion | static | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 4 | A- | Keep as static reference; no live-demo quality claim. |
| fithub | live | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | A- | Keep. Slightly dense, but the training hierarchy remains clear. |
| fufu | live | 3 | 4 | 3 | 5 | 4 | 4 | 3 | 5 | B | Intentional welcome screen; bottom half is visually underused. Improve stage balance before adding content. |
| itinerary | live | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | A | Keep. Best-in-library example of information density with clear hierarchy. |
| journal | live | 5 | 5 | 4 | 5 | 4 | 4 | 5 | 5 | A | Keep repaired state. Hero and discoveries now form one complete first screen. |
| loy | live | 3 | 3 | 3 | 4 | 3 | 4 | 4 | 5 | B- | P1. Large dead zone after Today Playlist; illustration, metric tiles, and CTA still need stronger rhythm. |
| mimo | live | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | A- | Keep. Side-card peeking is intentional carousel behavior. |
| moe | live | 4 | 5 | 4 | 5 | 4 | 4 | 4 | 5 | A- | Keep. Strong headline and character focal point. |
| moodly | live | 3 | 4 | 3 | 5 | 4 | 4 | 3 | 5 | B | P1. Primary card is good, but lower third becomes inert and navigation controls feel detached. |
| museum | static | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | A- | Keep as static reference; video sequence is the canonical preview path. |
| news | static | 4 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | A- | Keep as static editorial reference. |
| notebook | live | 3 | 4 | 4 | 4 | 4 | 3 | 3 | 5 | B | P1. Card density is good but bottom navigation is cramped and the first screen feels unevenly weighted. |
| organique | live | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | A | P0 repaired. Live screen is strong; Demo video now uses canonical screen frames instead of the mismatched baked video canvas. |
| plate-play | live | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | A | Keep. Strongest high-color example in the library. |
| reflect | live | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | A | Keep. Balanced calm hierarchy and strong photographic rhythm. |
| relay-music | live | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | A | Keep. Cohesive artwork, playback controls, and saturated color system. |
| signal-grid | live | 5 | 5 | 5 | 4 | 5 | 4 | 5 | 5 | A | Keep. Clear brutal/editorial hierarchy with useful empty space. |
| softly-reflections | live | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 5 | A | Keep. Card-stack composition and navigation are visually coherent. |
| still-form | live | 5 | 5 | 5 | 5 | 4 | 5 | 4 | 5 | A | Keep. Strong fashion hero, CTA, and image/text balance. |
| volt-route | live | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | A | Keep. Strong dark automotive dashboard with clear primary metric. |

## Repair queue

### P0 — presentation mismatch

- **Organique** — repaired in this branch. The existing MP4 contains a presentation canvas that looks visually undersized inside the shared phone bezel even though the file metadata is 780 × 1688. The Library `Demo video` path now uses the three canonical screen frames (`choose → plan → confirmation`) as a timed video sequence. The original MP4 remains in the repository as source material.

### P1 — technically correct, visibly under-finished

- **Loy** — reduce the dead zone after the playlist without stuffing the screen with unrelated content; strengthen spacing and CTA rhythm.
- **Moodly** — make the lower third feel intentional; improve relationship between mood card, navigation arrows, and progress indicator.
- **Notebook** — clean up bottom-navigation compression and rebalance the recent-note grid vertically.

### P2 — intentional sparse screens that can be staged better

- **Buddy** — improve vertical relationship of travel bubbles, title, and CTA; keep the playful onboarding concept.
- **FuFu** — keep the welcome-screen simplicity but vertically stage the illustration / copy / CTA so the bottom half does not feel abandoned.

## Rules for future changes

- Do not redesign A-tier cases merely to make all demos look stylistically similar.
- A large whitespace area is not automatically a defect; fix it only when it breaks visual balance or makes the first state feel unfinished.
- Do not add fake dashboard content solely to fill 844px.
- Preserve each case's own visual language.
- When a live first state changes, regenerate the canonical `library-preview-2x.png` from the actual rendered demo.
- When a Demo video does not visually fill its device shell, repair the media source / sequence rather than hiding the mismatch with crop or scale hacks.
