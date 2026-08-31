# Learn / Home Page Requirements

Last updated: 2026-08-31

## Page identity

- Public route: `learn.html`
- `index.html` only redirects here
- Product role: ONDesign main landing / learning entry
- Canonical implementation: `src/features/home/home.css`, `src/features/home/home.js`

## Page goal

Explain the value of Design DNA for AI Coding and guide users toward understanding the workflow and starting a design.

The page should communicate the product idea visually and progressively rather than behave like a dense documentation page.

## Core user task

A visitor should quickly understand:

1. Why AI-generated UI often feels inconsistent or generic.
2. What Design DNA changes.
3. What ONDesign helps define: style, structure, components and design rules.
4. What the user can do next.

## Core functions

- Explain the Design DNA concept.
- Show before/after or without/with-rules comparisons.
- Show concrete examples of design-system decisions such as typography, spacing, color, components and layout.
- Present a clear path into `launcher.html` / Start Designing.
- Provide entry points into deeper learning or library content where appropriate.
- Support Chinese and English content with equivalent structure.

## Information structure

Preferred narrative order:

1. Hero: Design DNA for AI Coding
2. Why: the problem with unconstrained UI generation
3. Comparison: without rules vs with rules
4. What defines Design DNA: style / structure / components / specifications
5. Examples: from idea to interface
6. Start Designing CTA

The page may evolve visually, but it should preserve a clear story from problem → method → proof → action.

## Interaction rules

- Favor large visual examples over dense text.
- Keep section hierarchy strong and editorial rather than dashboard-like.
- Avoid excessive cards when a full-width composition communicates better.
- Chinese typography and English typography may use different spacing / line-height treatment where needed.
- Maintain ONDesign's green brand direction unless a global design decision changes it.
- Do not turn the page into a catalog grid; catalogs belong to Library / Vocabulary / Skills.
- Keep the primary Start Designing path obvious without adding configuration controls that belong to Launcher.

## Keep

- Strong first-screen value proposition.
- Visual storytelling.
- Clear Start Designing path.
- Bilingual support.
- Shared global App Shell.

## Remove / avoid

- Long product-manual text.
- Dense configuration controls.
- Full case-library browsing.
- Launcher configuration responsibilities.
- Duplicated navigation or page-specific global header.

## Modification boundary

Changes to `learn.html` should improve product understanding, learning progression or conversion into the next ONDesign workflow step.

If a request introduces detailed configuration, case management or a large reference directory, route that responsibility to Launcher, Library, Vocabulary or Skills instead of expanding Home without an explicit product decision.
