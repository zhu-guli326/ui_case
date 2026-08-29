# Design System Catalog / Lab Split

## Effect Image

- Source reference: the supplied desktop screenshot of the combined design-system page.
- Generated effect image: `artifacts/design-system-split-effect.png`
- Channel: Youtoken image API, `gpt-image-2`, synchronous edit flow.
- Output: 2048 x 1152 PNG.
- Review: passed. The image establishes two separate screens, a compact catalog and a canvas-first laboratory. It removes the old six-control toolbar and keeps the product's neutral, restrained visual language.

## UI Decomposition

The effect image is a planning artifact only and is not embedded in either page.

### Code UI

- Catalog: site navigation, title row, search field, platform/category filters, metadata, card grid, miniature system previews, component-reference dialog, empty state.
- Laboratory: site navigation, design-system tabs, view segmented control, settings drawer, preview canvas, isolated iframe previews, inspector tabs, component matrix, toast feedback.
- All text, controls, icons, states, and mini previews are rendered by HTML/CSS/JavaScript.

### Image Assets

- None required for implementation. This is an operational interface whose visual content is the live component preview itself.

## Interaction Contract

- `brands.html` owns discovery and selection only.
- `lab/index.html` owns preview, comparison, settings, inspection, and export.
- Catalog preview links carry the selected `system` into the laboratory URL.
- Low-frequency template, theme, device, and appearance controls live in the settings drawer.
