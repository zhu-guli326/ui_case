# Launcher Page Requirements

Last updated: 2026-09-02

## Page identity

- Public route: `launcher.html`
- Product role: Start Designing / Design DNA configurator
- Canonical implementation: `src/features/launcher/launcher-dna.css`, `src/features/launcher/launcher-dna.js`
- `src/features/launcher/launcher-dna.css` is the single static style entry point. It imports the base Launcher chrome, Design System picker, Foundation refinement and workspace/Preview boundary styles.
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
- Chinese and English versions must follow the global language state and keep equivalent functionality and geometry.

### Global App Shell and workspace boundary

- The shared Site Header, Footer, language switch and Launcher editor/workspace always use ONDesign global typography and ONDesign interaction-state rules.
- The Launcher page background, left configuration column, page title and Preview toolbar stay on ONDesign's light application chrome even when a dark external Design System is selected.
- A selected Design System must **never** recolor or re-font the global Header, Footer, Launcher controls, section headers, Design System picker chrome or Preview toolbar.
- External typography tokens such as `--dna-display` and `--dna-body` are scoped to `[data-preview-stage]`; do not apply them to `body.dna-page`, `.dna-app`, `.dna-controls` or any ancestor of shared chrome.
- The left editor may display the selected system's logo/name/metadata, but its own surface, text, borders, controls and focus states remain ONDesign UI.

### Live Preview system

- The live Preview is the place where the selected external Design System is expressed visually.
- Preview consumes the active system's semantic color, typography, radius and spacing values; the editor controls define/change those values without inheriting the system's page theme.
- External colors must be normalized into semantic `canvas / surface / ink / muted / accent` roles before they are applied. Never fall back to an arbitrary first/brand color for a missing surface token.
- Launcher must infer a Light or Dark preview mode from normalized canvas/surface tokens, then choose the matching text hierarchy.
- Preview text contrast must remain readable after normalization: primary text should target at least 4.5:1 against the active surface and muted/supporting text at least 3:1, with contrast-safe fallbacks when upstream tokens are incomplete or mismatched.
- A selected Design System must remain visually recognizable through semantic accent and surface language. Brand accent colors are functional signals (primary actions, active states, selected tabs, links, highlights), not arbitrary full-page fills.
- Spotify: near-black surfaces + Spotify Green functional accent.
- Shopify: light neutral product/admin surfaces + Shopify Green functional accent. Do not inherit dark storefront/marketing tokens into the generic Launcher product preview.
- When an upstream `DESIGN.md` is prose-only or marketing-oriented and does not expose reliable product semantic keys, Launcher may provide a documented product-safe override.
- Design-system picker chrome must be styled on first paint through the static Launcher CSS entry point; do not rely on JavaScript-only stylesheet injection for required visual correctness.
- Empty palette placeholders that resemble missing-glyph boxes must not appear in the Design System trigger. Real palette previews belong in the opened option list or after a meaningful selection.

### Foundation panel visual contract

- `02 Foundation / 基础规范` is one continuous configuration surface, not a stack of nested cards.
- The outer section owns the panel boundary. Inner groups (`Design system`, `Typography`, `Radius`, `Spacing`) use spacing and subtle separators for hierarchy rather than each drawing its own container card.
- Only interactive controls receive a visible control boundary: the Design System selector, typography select and segmented controls.
- The selected Design System is the visual focal control: logo, system name, concise metadata and selected state must read as one polished row; ONDesign green remains the editor interaction color.
- Source/normalization notes are tertiary information: smaller, quieter and visually separated from the primary selector.
- Typography is one clean select plus one short helper line.
- Radius and Spacing form one balanced two-column row on desktop and stack on narrow screens. Segmented controls use equal-width options and a restrained selected state.
- Step headers (`01 / 02 / 03`) use the same compact badge geometry and alignment. Open/closed state is communicated by the chevron and subtle section treatment, not a heavy colored strip.
- The final `Save & reuse` row visually belongs to the same continuous control column.

## Keep

- Design-system selection when it supports Design DNA definition.
- ONDesign light editor/workspace chrome independent from the selected Preview theme.
- One active Design System state feeding Preview, summary and Prompt output.
- Global ONDesign typography for App Shell and Launcher editor controls.
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
- Any rule that allows selected Design System colors or typography to leak from Preview into Launcher editor/App Shell chrome.
- JavaScript-only loading of required Launcher chrome styles.
- Placeholder swatch bars that can be mistaken for tofu / missing glyphs.

## Modification boundary

A Launcher change should answer this question:

**Does this help the user define, preview or confirm Design DNA faster or more clearly?**

If not, the feature probably belongs on another page.

Do not expand Launcher into Explore, Library, Learn, a full component editor or project-management dashboard.
