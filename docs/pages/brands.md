# Brands / Design System Explorer Page Requirements

Last updated: 2026-08-31

## Page identity

- Public route: `brands.html`
- Product role: Design System Explorer
- Canonical implementation: `src/features/brands/brands.css`, `src/features/brands/brands.js`

## Page goal

Let users compare how different design systems, brand-expression references and color themes change the same page target, so they can make a more informed design-system decision.

## Core user task

A user should be able to hold the project goal constant, change the design system / brand reference / theme, and clearly see what changed in components, hierarchy and visual character.

## Core functions

- Configure the current design project context.
- Select page type / template.
- Select a design system.
- Select a brand-expression reference.
- Select a color theme.
- Adjust transformation depth, device size and appearance where supported.
- Show a live preview.
- Compare 2–3 design systems side by side where supported.
- Show a concise difference explanation.
- Apply the chosen direction back to the current Launcher task.

## Product distinctions

- **Design system** controls component rules, spacing, states and interaction conventions.
- **Brand reference** informs expression, tone and typography tendency without pretending to reuse proprietary brand components.
- **Color theme** controls palette, contrast and surface relationships.

These concepts should remain visibly distinct instead of being collapsed into one ambiguous “style” setting.

## Information structure

1. Page introduction / concept explanation
2. Project configuration
3. Selection overview
4. Live preview workspace
5. Single / compare / differences views
6. Why it changed / decision summary
7. Apply to current task

## Interaction rules

- The same page goal should remain stable while comparison inputs change.
- Comparison mode should isolate the variable being compared as much as practical.
- Explanations should help users understand the design consequence, not only name the selected system.
- The page should link back to Launcher for applying the decision rather than turning into a second full Launcher implementation.
- Chinese and English versions should expose equivalent comparison functionality.

## Keep

- Design system / brand reference / color theme separation.
- Live preview.
- Compare mode and difference summary when they help decision-making.
- Apply-to-task path back to Launcher.

## Remove / avoid

- Duplicating the entire Launcher workflow.
- Case-library browsing.
- Generic brand galleries with no comparison function.
- Misrepresenting brand references as official component libraries when they are only visual references.

## Modification boundary

Brands changes should improve comparison and decision-making between design-system / brand-expression / theme choices.

Actual Design DNA assembly and final AI Coding prompt output belong in Launcher.
