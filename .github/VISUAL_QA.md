# Visual QA Policy

The case library is reviewed as 23 individual UI products. Global compatibility CSS must not be used to hide case-specific defects.

## Canonical viewport

- Embedded mobile demo viewport: `390 × 844`
- Canonical library card screenshot: `780 × 1688`
- A live demo owns the app screen; the Library owns the outer device chrome.

## Hard failures

A case fails visual QA when the browser audit detects any of the following:

- first-screen shell offset from the 390 × 844 viewport
- horizontal document overflow
- outer-document vertical scrolling instead of an intentional internal scroll owner
- duplicate phone/device frame
- clipped bottom navigation
- fixed UI outside the viewport
- an in-viewport interactive hit area crossing the viewport boundary
- an excessive internal scrolling region
- unreadable/missing card preview or video metadata
- material video/card aspect-ratio mismatch
- severe card/live first-state mismatch

Hard failures must be fixed in the affected demo or its case data, not covered by a global CSS override.

## Human-review signals

These are review prompts, not automatic failures:

- partial carousel cards intentionally peeking outside the viewport
- large lower whitespace that may be intentional onboarding/single-task composition
- pixel-level card/live drift caused by font rasterization, screenshot scaling, or antialiasing

The reviewer must decide whether the visual state is semantically the same before changing a demo.

## Current 23-case review

| Case | Type | Decision | Notes |
|---|---|---|---|
| buddy | live | pass | No structural viewport issue. |
| carry-bag | live | pass | No structural viewport issue. |
| cleanbite | live | pass / manual accept | Automated pixel drift signal reviewed; card and live demo represent the same initial state. Do not redesign to satisfy raw pixel delta. |
| fashion | static | pass | Canonical card/media contract passes. |
| fithub | live | pass | No structural viewport issue. |
| fufu | live | pass / intentional whitespace | Sparse welcome composition is intentional onboarding, not missing content. |
| itinerary | live | pass / manual accept | Automated pixel drift signal reviewed; card and live demo represent the same initial state. |
| journal | live | repaired | The discovery list existed in markup but the mobile media query hid it at the 390px embed width. `embed.css` restores the intended discovery list only for the embedded demo. Canonical card preview must be generated from the repaired live state. |
| loy | live | repaired | The case contract called for a playlist on the dashboard but the home view ended after the date strip. A compact Today Playlist card now links to the existing playlist view. Canonical card preview must be generated from the repaired live state. |
| mimo | live | pass / intentional carousel | Side activity cards intentionally peek beyond the viewport. Their off-screen hit boxes are review-only; the document itself does not horizontally overflow. |
| moe | live | pass | Video catalog path is filesystem-safe; no structural viewport issue. |
| moodly | live | pass / intentional whitespace | One-question check-in screen is intentionally sparse. |
| museum | static | pass | Video catalog path is filesystem-safe; canonical media contract passes. |
| news | static | pass | Canonical card/media contract passes. |
| notebook | live | pass | Uses canonical `library-preview-2x.png` at 780 × 1688; the 1024 × 1536 reference artboard remains reference material only. |
| organique | live | pass | No structural viewport issue. |
| plate-play | live | pass | No structural viewport issue. |
| reflect | live | pass | No structural viewport issue. |
| relay-music | live | pass | No structural viewport issue. |
| signal-grid | live | pass | No structural viewport issue. |
| softly-reflections | live | pass | No structural viewport issue. |
| still-form | live | pass | No structural viewport issue. |
| volt-route | live | pass | No structural viewport issue. |

## Screenshot ownership

`demo/*/screenshots/library-preview-2x.png` is a controlled case-library asset. Other ad-hoc screenshots remain ignored. When a repaired live demo changes its intended first state, regenerate its canonical Library preview from the actual `?embed=1` rendered state rather than manually recreating a similar image.

## Gate

Before merging visual changes:

1. `npm test` must pass.
2. `npm run check` must pass.
3. `npm run audit:visual` must report zero hard failures across all 23 cases.
4. Human-review signals must be explicitly accepted or repaired.
5. Any repaired initial state must have its canonical Library preview synchronized.
