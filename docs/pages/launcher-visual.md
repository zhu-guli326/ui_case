# Launcher Visual Lab Page Requirements

Last updated: 2026-09-05

## Page identity

- Public route: `launcher-visual.html`
- Product role: local-review visual control prototype for Start Designing / Design DNA
- Canonical implementation: `src/features/launcher-visual/launcher-visual.css`, `src/features/launcher-visual/launcher-visual.js`

## Page goal

Let users shape a Design DNA through controls that are immediately recognizable, tactile and visually connected to the large live preview.

## Core user task

Choose a design direction, tune the visible parameters, compare the result in a real page preview and copy a reusable DNA summary.

## Core functions

1. Select a visual direction with illustrated option buttons.
2. Select visual and component specifications from the same canonical catalogs used by the production Launcher.
3. Tune color, density, radius and spacing through visible controls.
4. Switch preview content and viewport.
5. Update the live preview immediately.
6. Randomize a coherent configuration.
7. Copy the resulting Design DNA summary.

## Information structure

1. Compact page identity and current state.
2. Left-side visual control rail with logo-led visual and component specification pickers.
3. Dominant live preview canvas with preview-content and viewport controls grouped at its upper right.
4. Bottom status strip with active DNA tokens and copy action.

## Interaction rules

- Every control change must update the preview without a separate submit step.
- Visual and component specification choices must reuse the production Launcher catalogs rather than maintain copied option lists.
- Specification pickers must expose recognizable logos in the selected value and option list; do not fall back to an unstyled native long menu as the primary interaction.
- Preview-content controls remain in the upper-right preview toolbar beside viewport controls rather than consuming another section in the left rail.
- Control shape must communicate its purpose before the label is read.
- Selection uses ONDesign green plus clear geometry, never color alone.
- Native controls follow a consistent shadcn-inspired component language: neutral surfaces, compact radii, restrained borders, clear focus rings and semantic primary/secondary actions.
- The preview must retain more visual weight than the controls.
- Keyboard focus, touch targets and reduced-motion preferences must be supported.
- The global ONDesign header remains unchanged.
- The visual language blends ONDesign green with a restrained Nothing-inspired dot-matrix system: dotted display accents, technical labels, modular grid lines and green status signals. Dot texture must remain secondary to readability and control clarity.

## Keep

- Design direction, color, typography, radius, spacing and density decisions.
- Large real UI preview.
- Chinese and English language compatibility through the global language query.
- Copyable Design DNA output.

## Remove / avoid

- Deep accordion stacks.
- Repeated explanatory copy.
- Small text-only buttons for primary settings.
- Hidden effects that require trial and error.
- Project management, accounts, chat or code-editor features.

## Modification boundary

This page is a reviewable interaction prototype for making Launcher controls more visual. It must not change the production `launcher.html` until the user explicitly approves promotion.
