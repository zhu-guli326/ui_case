# Launcher Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `launcher.html`
- Product role: Start Designing / Design DNA configurator
- Canonical implementation: `src/features/launcher/launcher-dna.css`, `src/features/launcher/launcher-dna.js`
- Related responsibilities: `launcher-design-systems.js`, `design-systems-catalog.js`, `launcher-preview-i18n.js`

## Page goal

Help a user turn a vague design direction into a clear, reusable Design DNA that can be used for AI Coding.

The page should guide the user through:

**Describe project → choose visual direction → see preview → adjust configuration → confirm Design DNA → continue to AI Coding / Prompt output**

## Core user task

The user should be able to answer: **“Is this the website style I want?”** before receiving a final coding prompt.

The primary product principle is: **preview first, Prompt second.**

## Core functions

### 1. Project requirement

Collect a lightweight description of what the user wants to make, such as product type, page type and rough visual direction.

Do not turn this into a long questionnaire.

### 2. Style

Allow the user to choose an overall visual language. Options should be understandable visually, not only as text labels.

Each style option should ideally provide:

- Name
- Short label / explanation
- Real Web UI example or thumbnail

### 3. Typography

Allow selection of title and body typography where relevant.

The UI must show the actual type appearance, not only font names. Chinese and English typography need independent visual consideration.

### 4. Color

Support quick selection of a usable palette, including primary, background, text and accent relationships.

Prefer curated combinations over forcing users to build a palette from zero.

### 5. Layout / component tendency

Let the user choose high-level structural tendencies such as Hero emphasis, card grid, sidebar, dashboard, editorial layout or full-screen sections.

This section defines design direction; it must not become a full component library.

### 6. Design system selection

The page may allow the user to select a design system/reference where it helps define component behavior and visual consistency.

The design-system catalog remains a stable responsibility of the existing Launcher modules and must not be duplicated elsewhere in Launcher.

### 7. Live preview

The preview is the most important part of the page.

Changes to Design DNA should be reflected in a real Web UI preview so users can judge typography, color, radius, spacing, buttons, cards, layout and general visual hierarchy.

Do not replace this with an abstract swatch-only preview.

### 8. Design DNA summary

After configuration, summarize the selected system as a readable Design DNA card before exposing the long coding prompt.

Possible summary fields include:

- Style
- Typography
- Color
- Radius
- Spacing
- Layout
- Components
- Motion

### 9. Final actions

Keep the final actions focused:

- Generate / update preview
- Confirm Design DNA
- Copy AI Coding Prompt / Start Coding

Prompt output is a final deliverable, not the visual center of the page.

## Information structure

Recommended hierarchy:

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
- Launcher chrome typography must inherit the single global typography system from `src/core/app-shell/typography.css`. Do not add a separate Launcher-wide font-family, font-smoothing, text-rendering or synthetic-weight override layer. Design-system font choices may affect preview/specimen content only, not the Launcher control UI.

## Keep

- Design-system selection when it supports Design DNA definition.
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
- Duplicate Launcher typography guard stylesheets or page-wide `!important` font overrides that compete with the global typography layer.

## Modification boundary

A Launcher change should answer this question:

**Does this help the user define, preview or confirm Design DNA faster or more clearly?**

If not, the feature probably belongs on another page.

Do not expand Launcher into:

- Explore / inspiration discovery
- Library / case management
- Learn / design education
- Full component editor
- Project management dashboard

If a future request intentionally changes this boundary, update this document before treating the implementation change as complete.
