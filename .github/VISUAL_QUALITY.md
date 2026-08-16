# 23-case Visual Quality Review

This review is the second layer after structural Visual QA. Structural QA answers **“is the demo technically valid?”**. This document answers **“does the first screen look complete, intentional, and presentation-ready?”**.

The scores below are manual relative scores from the canonical 390 × 844 rendered state and the 780 × 1688 Library preview. They are **not CI gates** and must not be optimized blindly.

## Single-frame preview standard

All phone-shaped detail previews follow one presentation standard:

- the source screen is always **390 × 844**;
- the desktop detail-dialog device footprint uses **300px** as its preferred width and only shrinks when the viewport cannot fit it;
- **Library owns the only visible device bezel**;
- embedded live demos must render as screen-only sources: no padding, border, device radius, or device shadow;
- screenshot / sequence media used inside that bezel must also be screen-only and must not contain a baked phone chassis;
- image, Demo video, and interactive Demo modes use the same device footprint so switching modes does not resize the phone.

Organique is the regression case for this rule. Its old effect images contained a second rounded phone shell. The three effect states are now regenerated directly from the 390 × 844 embed source before being scaled to the canonical 780 × 1688 Library assets.

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

## Final review

| Case | Type | Comp. | Hier. | Complete | Image | Type | Controls | Nav | Consistency | Tier | Decision |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| buddy | live | 3 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | B+ | Accept. Sparse onboarding is intentional; travel bubbles, title and CTA still form a clear vertical story. Do not add fake content. |
| carry-bag | live | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | A- | Keep. Dense editorial-commerce composition is intentional and readable. |
| cleanbite | live | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | A | Keep. Strong focal image, data hierarchy, CTA, and bottom navigation. |
| fashion | static | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 4 | A- | Keep as static reference; no live-demo quality claim. |
| fithub | live | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | A- | Keep. Slightly dense, but the training hierarchy remains clear. |
| fufu | live | 4 | 4 | 4 | 5 | 4 | 4 | 4 | 5 | A- | Repaired. Welcome art remains simple, while the CTA is now anchored low enough that the whitespace reads as deliberate staging rather than an unfinished lower screen. |
| itinerary | live | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | A | Keep. Best-in-library example of information density with clear hierarchy. |
| journal | live | 5 | 5 | 4 | 5 | 4 | 4 | 5 | 5 | A | Keep repaired state. Hero and discoveries now form one complete first screen. |
| loy | live | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 5 | B+ | Repaired. The larger Today Playlist now carries the lower visual weight and removes the abrupt empty break before the tab bar without adding unrelated modules. |
| mimo | live | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | A- | Keep. Side-card peeking is intentional carousel behavior. |
| moe | live | 4 | 5 | 4 | 5 | 4 | 4 | 4 | 5 | A- | Keep. Strong headline and character focal point. |
| moodly | live | 4 | 4 | 4 | 5 | 4 | 5 | 4 | 5 | A- | Repaired. The only navigation control is anchored to the lower screen, turning the open lower field into deliberate breathing space. |
| museum | static | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | A- | Keep as static reference; video sequence is the canonical preview path. |
| news | static | 4 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | A- | Keep as static editorial reference. |
| notebook | live | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | A- | Repaired. Watermark removed, dock enlarged, and Daily Goals spans the grid so the recent-note composition no longer ends with an accidental empty cell. |
| organique | live | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | A | Repaired. Live screen is strong; Demo video and effect images now use screen-only canonical frames instead of the mismatched baked device canvas. |
| plate-play | live | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | A | Keep. Strongest high-color example in the library. |
| reflect | live | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | A | Keep. Balanced calm hierarchy and strong photographic rhythm. |
| relay-music | live | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | A | Keep. Cohesive artwork, playback controls, and saturated color system. |
| signal-grid | live | 5 | 5 | 5 | 4 | 5 | 4 | 5 | 5 | A | Keep. Clear brutal/editorial hierarchy with useful empty space. |
| softly-reflections | live | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 5 | A | Keep. Card-stack composition and navigation are visually coherent. |
| still-form | live | 5 | 5 | 5 | 5 | 4 | 5 | 4 | 5 | A | Keep. Strong fashion hero, CTA, and image/text balance. |
| volt-route | live | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | A | Keep. Strong dark automotive dashboard with clear primary metric. |

## Completed repair queue

### P0 — presentation mismatch

- **Organique — complete.** The existing MP4 and old effect images contained presentation/device chrome that looked visually undersized or double-framed inside the shared phone bezel. The Library `Demo video` path now uses the three canonical screen frames (`choose → plan → confirmation`) as a timed video sequence, and those three effect images are regenerated from the screen-only 390 × 844 embed source. The original MP4 remains in the repository as source material. Automated checks lock both the sequence behavior and the zero-chrome embed source.

### P1 — technically correct, visibly under-finished

- **Loy — complete.** Rebalanced the existing Today Playlist rather than inventing another dashboard module.
- **Moodly — complete.** Anchored the existing step controls to the lower screen so whitespace reads as intentional.
- **Notebook — complete.** Removed the unrelated watermark, expanded the dock, and repaired the asymmetric recent-note grid.

### P2 — intentional sparse screens

- **FuFu — complete.** Kept the welcome-screen simplicity but anchored the CTA and enlarged the hero staging so the lower field has a clear purpose.
- **Buddy — accepted unchanged.** The sparse screen already has a coherent focal cluster, title, CTA, and bottom navigation. Filling it further would weaken the onboarding concept.

## Current quality conclusion

- No case has an open visual-quality blocker.
- B+ does **not** mean “must be redesigned”; it means the case is intentionally more idiosyncratic or sparse than the A-tier references.
- The three structural review-only signals remain `cleanbite` and `itinerary` rasterization drift plus `mimo` intentional carousel peeking. They are not visual defects.
- A-tier cases should remain visually diverse; the Library is a reference collection, not one unified product UI.
- The final structural browser pass remains 23 / 23 hard passes with zero hard visual failures; the repository contract suite remains green.

## Rules for future changes

- Do not redesign A-tier cases merely to make all demos look stylistically similar.
- A large whitespace area is not automatically a defect; fix it only when it breaks visual balance or makes the first state feel unfinished.
- Do not add fake dashboard content solely to fill 844px.
- Preserve each case's own visual language.
- Keep phone detail previews on the 300px / 390 × 844 single-frame standard.
- When a live first state changes, regenerate the canonical `library-preview-2x.png` from the actual rendered demo.
- When a Demo video or effect image contains device chrome, regenerate a screen-only source rather than hiding the mismatch with crop or scale hacks.
