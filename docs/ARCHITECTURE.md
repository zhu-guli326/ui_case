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

### PhoneShell
`src/components/device-preview/phone-shell.css` is the **only canonical owner of phone hardware chrome**.

It owns:

- the 390 × 844 screen ratio;
- bezel and outer edge;
- screen / chassis radii;
- device shadow;
- side-button decoration;
- direct-demo shell presentation;
- the screen-only flattening rules used when a Demo is embedded in Library.

A case does **not** implement a phone shell. A case supplies screen content and may invoke the shared component through the existing `.iphone-frame` hook. Case-local CSS must not redefine `.iphone-frame`, PhoneShell hardware tokens, bezel, device edge, or hardware shadow.

`demo/iphone-frame.css` is now only a compatibility import for old Demo URLs. It contains no device implementation. New shell work belongs in `PhoneShell`, not in `demo/`, `features/`, or individual cases.

### DevicePreview
`DevicePreview` consumes `PhoneShell` and owns preview-media behavior only: media classification, image/video/iframe fit, artboard handling, and detail-preview sizing. It does not own phone hardware.

For Library, the case data supplies screen media; Library creates one shared frame around that media. For embedded live demos, the Demo is flattened to a 390 × 844 screen-only source so Library never renders a phone inside another phone.

## New case contract

Adding case 24, 25, or 100 must not require designing another device chassis. The case contract is:

```text
Case
  └─ 390 × 844 screen content
        ↓
    PhoneShell (shared once)
        ↓
    Library card / detail / direct Demo
```

If a case needs a different visual treatment inside the screen, style the screen content. If the hardware itself must change for the whole system, change `PhoneShell` once and every consuming case inherits it.

## Migration policy

Move incrementally: copy implementation into the new layer, update entry-point references, run tests/QA, then remove the old root file. Avoid compatibility files unless an external URL genuinely depends on that file path.
