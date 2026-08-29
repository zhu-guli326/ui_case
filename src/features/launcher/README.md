# Launcher architecture

The production Launcher is the Design DNA page served by `launcher.html`.

## Production entry points

- `launcher.html` — semantic page shell and Design DNA controls.
- `launcher-dna.css` — all Launcher page, control, preview, and responsive styling.
- `launcher-dna.js` — Design DNA state, presets, localization, live preview, persistence, and prompt generation.
- `../../../catalog/color-themes.js` — shared color-theme data imported by `launcher-dna.js`.

## Rules

1. Treat `launcher-dna.css` and `launcher-dna.js` as the canonical Launcher implementation.
2. Do not reintroduce the retired workspace / entry / hardening / merge / compatibility layers.
3. Do not create `launcher-*-fixes`, `launcher-*-override`, or temporary compatibility modules for normal feature work.
4. For a local change, search the relevant selector, state key, preset, or handler before reading either canonical file in full.
5. Keep visual changes in `launcher-dna.css` and behavior/state changes in `launcher-dna.js`.
6. Preserve Design DNA persistence and Chinese/English switching when editing controls.
7. Keep preview assets as normal paths; never embed image binaries as base64.

## Context-efficient editing

- Presets / palette behavior: search `basePalettes`, `catalogPresets`, or the preset handlers in `launcher-dna.js`.
- Copy / localization: search the exact key in `STR` or `labelSets`.
- Design-direction behavior: search `data-style` and the direction handlers.
- Live preview: search `data-preview-picker`, `data-preview-stage`, or the relevant renderer.
- Layout / spacing: search the exact class from `launcher.html` in `launcher-dna.css`.
- Responsive behavior: inspect only the matching media-query block.
