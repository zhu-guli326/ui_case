# Learn / Home Page Requirements

Last updated: 2026-09-01

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

### Idea-to-demo workflow section

The four-card workflow should explain the path from an idea to a runnable demo. The primary hierarchy is the action/stage, not the historical figure used as the visual metaphor.

- Section heading: communicate “从一个 Idea 到一个 Demo，你需要经历这 4 步。” / equivalent English copy.
- Stage 01: `DEFINE` — clarify the goal, page and references.
- Stage 02: `CREATE` — turn references into layout, typography, color and components.
- Stage 03: `BUILD` — hand Design DNA to AI Coding and produce a runnable demo.
- Stage 04: `ITERATE` — compare, adjust and validate until the demo looks right and works well.
- `DEFINE / CREATE / BUILD / ITERATE` must be more visually prominent than the names of Steve Jobs, Leonardo da Vinci, Bill Gates or Thomas Edison.
- Historical figures are supporting metaphors only; they should not become the main information users have to read.

### Lightweight discovery strip

The old template gallery is no longer a template catalog. It is a compact “看点啥” discovery entry that helps users choose what kind of design resource they want to explore next.

- Chinese title: `看点啥`.
- Keep the supporting copy short and conversational; explain that users can jump into App, Web, Skills, tools or UI vocabulary.
- Primary tags: `App 设计`, `Web 设计`, `设计 Skill`, `设计工具`, `UI 词库`.
- Show the category entries in a single horizontal row on desktop; do not expand into a multi-row catalog grid.
- On narrower screens, allow horizontal scrolling rather than stacking a long catalog.
- Each category entry should act as a navigation doorway into the relevant ONDesign resource area, not as a full browsing experience on the home page.

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
