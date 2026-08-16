# UI Case architecture

The repository is organized around four implementation layers:

```text
Public entry HTML
      ↓
features
      ↓
components
      ↓
core / shared styles
```

Data and runnable examples live beside, not inside, those layers:

```text
catalog/      structured case / brand / system data
demo/         runnable UI cases
assets/       media and generated visual assets
references/   source references
scripts/      build / QA / maintenance tooling
tests/        contracts and regressions
```

## Public entry points

Root-level HTML (`library.html`, `launcher.html`, `brands.html`, `learn.html`, `skills.html`, `vocabulary.html`, `markdown.html`) stays at the repository root so GitHub Pages URLs do not change.

Page implementation should not accumulate beside those entry points. CSS and JS move into `src/features/<feature>/`.

## Reuse boundaries

### Core
Cross-page runtime only: localization, state, analytics, navigation and routing. Core must not import a page feature.

### Components
Reusable UI with one visual owner. Examples: `device-preview`, site header, modal, tabs and buttons.

### Features
Page/domain behavior. A feature may import `core`, `components` and catalog helpers.

### DevicePreview
The Library preview frame is the first extracted shared component. It owns the single visible phone bezel and the 390 × 844 screen contract. Screen media must be edge-to-edge; explicit artboards are the only `contain` presentation.

## Migration policy

Move incrementally: copy implementation into the new layer, update entry-point references, run tests/QA, then remove the old root file. Avoid compatibility files unless an external URL genuinely depends on that file path.
