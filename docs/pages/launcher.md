# Launcher Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `launcher.html`
- Product role: Start Designing / Design DNA configurator
- Canonical implementation: `src/features/launcher/launcher-dna.css`, `src/features/launcher/launcher-dna.js`
- `src/features/launcher/launcher-dna.css` is the single static style entry point. It imports `launcher-dna-core.css` and `launcher-design-systems.css`; Design System chrome must not depend on JavaScript running successfully before it is styled.
- Related responsibilities: `launcher-design-systems.js`, `design-systems-catalog.js`, `design-system-usage.js`, `launcher-preview-i18n.js`

## Page goal

Help a user turn a vague design direction into a clear, reusable Design DNA that can be used for AI Coding.

The page should guide the user through:

**Describe project → choose visual direction → see preview → adjust configuration → confirm Design DNA → continue to AI Coding / Prompt output**

The primary product principle is: **preview first, Prompt second.**

## Core functions

1. Collect a lightweight project requirement.
2. Choose a visual direction.
3. Choose typography, color, radius, spacing and a Design System/reference.
4. Show a real live Web UI preview.
5. Summarize the selected Design DNA.
6. Generate / copy the AI Coding Prompt only after the visual direction is confirmed.

## Information structure

1. Project requirement
2. Design DNA settings
3. Large live preview
4. Design DNA summary
5. Start Coding / Prompt output

The preview should have more visual weight than configuration controls.

## Interaction rules

- Configuration changes should create immediate or clearly triggered visual feedback in the preview.
- Avoid equal visual weight for every settings block.
- Dropdowns, segmented controls, tabs, tooltips and drawers may reference Ant Design interaction patterns when useful.
- Referencing Ant Design does **not** mean redesigning Launcher as an admin dashboard.
- Keep the shared ONDesign App Shell unchanged unless the user explicitly requests a global navigation change.
- Chinese and English versions must follow the global language state and keep equivalent functionality.

### Global App Shell boundary

- The shared Site Header, Footer, language switch and other App Shell chrome always use ONDesign global typography and global interaction-state rules.
- A selected Design System must **never** change the font family, size, line-height, tracking or state typography of the global Header / Footer.
- Page-specific Design System typography is scoped to `.dna-app` only: Launcher controls, working canvas and live Preview may reflect the selected Design System.
- Do not apply `--dna-display`, `--dna-body` or other selected-system font tokens to `body.dna-page` or any ancestor of the global App Shell.

### Launcher workspace / Preview system

- Launcher working controls and live Preview consume the same active Design System token source for typography, color, radius, spacing, border and surface relationships.
- Structural responsibilities remain separated: Launcher controls define/edit the system while Preview demonstrates it, but this separation must not create a second Design System inside the workspace.
- `launcher-design-systems.js` may dynamically write active `--dna-*` variables; those variables must be scoped so they affect Launcher workspace content without leaking into shared site chrome.
- External Design System colors must be normalized into semantic `canvas / surface / ink / muted` roles before they are applied. Never fall back to an arbitrary first/brand color for a missing surface token.
- Launcher must infer a Light or Dark preview mode from the normalized base surface/canvas, then choose the matching text hierarchy. Dark references should prefer on-dark text tokens when present; light references should prefer normal ink tokens.
- Preview text contrast must remain readable after normalization: primary text should target at least 4.5:1 against the active surface and muted/supporting text at least 3:1, with contrast-safe fallbacks when upstream tokens are incomplete or mismatched.
- A selected Design System must remain visually recognizable in Preview through its semantic accent and surface language. Brand accent colors are functional signals (primary actions, active states, selected tabs, links, highlights), not decorative page fills. For example, Spotify uses near-black surfaces with Spotify Green as the functional accent rather than a green page background.
- When an upstream `DESIGN.md` is prose-only and does not expose structured semantic color keys, Launcher may provide a documented product-safe override so the Preview does not collapse into a generic fallback palette.
- Design-system picker chrome must be styled on first paint through the static Launcher CSS entry point; do not rely on JavaScript-only stylesheet injection for required visual correctness.
- Empty palette placeholders that resemble missing-glyph boxes must not appear in the Design System trigger. Real palette previews belong in the opened option list or after a meaningful selection.

## Keep

- Design-system selection when it supports Design DNA definition.
- One shared active Design System token set across Launcher workspace controls and Preview.
- Global ONDesign typography for the App Shell.
- Real visual preview.
- Existing stable Launcher responsibility modules.
- Required `DESIGN_SYSTEMS_NOTICE.md` attribution while its source remains in use.
- Clear path back into AI Coding / Prompt usage.

## Remove / avoid

- Repeated cards and repeated explanatory headings.
- Excessive borders and panel nesting.
- Large blocks of instructional prose inside the working area.
- Project management, account management or cloud workspace features.
- Full code editor.
- AI chat as a separate major product inside Launcher.
- Case-library browsing responsibilities.
- Duplicate design-system runtimes or alternate Launcher implementations.
- Any page-level rule that allows selected Design System typography to leak into the global App Shell.
- JavaScript-only loading of required Launcher chrome styles.
- Placeholder swatch bars that can be mistaken for tofu / missing glyphs.

## Modification boundary

A Launcher change should answer this question:

**Does this help the user define, preview or confirm Design DNA faster or more clearly?**

If not, the feature probably belongs on another page.

Do not expand Launcher into Explore, Library, Learn, a full component editor or project-management dashboard.
