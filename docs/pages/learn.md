# Learn / Home Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `learn.html`
- `index.html` only redirects here
- Product role: ONDesign main landing / learning entry
- Canonical implementation: `src/features/home/home.css`, `src/features/home/home.js`
- Home vertical-rhythm override: `src/features/home/home-compact-spacing.css`
- Home ending cleanup: `src/features/home/home-ending-cleanup.css`

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
4. Lightweight discovery: “看点啥”
5. Idea-to-demo workflow: image2 to ui / DEFINE → CREATE → BUILD → ITERATE
6. What defines Design DNA: style / structure / components / specifications
7. Examples: from idea to interface
8. One focused Start Designing CTA

The page may evolve visually, but it should preserve a clear story from problem → method → proof → action.

### Idea-to-demo workflow section

The four-card workflow should explain the path from an idea to a runnable demo. The primary hierarchy is the action/stage, not the historical figure used as the visual metaphor.

- This section sits immediately after the lightweight discovery strip; the “看点啥” section should appear directly above the Steve Jobs / DEFINE card row.
- Section eyebrow: `image2 to ui`.
- Section heading: communicate “从一个 Idea 到一个 Demo，你需要经历这 4 步。” / equivalent English copy.
- Stage 01: `DEFINE` — clarify the goal, page and references.
- Stage 02: `CREATE` — turn references into layout, typography, color and components.
- Stage 03: `BUILD` — hand Design DNA to AI Coding and produce a runnable demo.
- Stage 04: `ITERATE` — compare, adjust and validate until the demo looks right and works well.
- `DEFINE / CREATE / BUILD / ITERATE` must be more visually prominent than the names of Steve Jobs, Leonardo da Vinci, Bill Gates or Thomas Edison.
- Historical figures are supporting metaphors only; they should not become the main information users have to read.
- The four cards must share the same text baseline and vertical rhythm: stage title, person name, role/thinking line, and description should align across all cards.
- Add a compact source link aligned to the lower-right of this section pointing to `https://github.com/zhu-guli326/image2_UI_skill.git`.

#### Workflow card motion enhancement

The four workflow cards use the pointer-reactive motion language from React Bits `ProfileCard` (JS-CSS registry variant) while preserving the current ONDesign card content and visual hierarchy.

- Desktop pointer interaction: each card tilts in 3D toward the pointer, with a soft pointer-following glare/highlight and subtle depth response.
- Motion should interpolate smoothly rather than snap; when the pointer leaves, the card eases back to center before the active glow disappears.
- Keep the current four portrait assets, per-stage color treatment, text content, grid proportions and source-link placement. The motion is an enhancement, not a redesign into a profile/contact card.
- Do not add ProfileCard-specific user UI such as handle, online status, mini avatar or Contact button.
- Do not add mobile device-orientation tilt. Touch/mobile keeps the static card presentation.
- Do not add extra runtime dependencies solely for this effect. The current page is a static HTML/CSS/JS site, so reuse the React Bits motion math/variables in the existing vanilla-JS architecture instead of introducing React just for four cards.
- Respect `prefers-reduced-motion: reduce`: disable pointer tilt and animated glare/transform transitions for users requesting reduced motion.
- The enhancement must not alter card links, keyboard focus, bilingual rendering, image loading or layout dimensions.

### Lightweight discovery strip

The old template gallery is no longer a template catalog. It is a compact “看点啥” discovery entry that helps users choose what kind of design resource they want to explore next.

- Place this whole section immediately before the Idea-to-demo workflow / Steve Jobs card section.
- Chinese title: `看点啥`.
- Keep the supporting copy short and conversational; explain that users can jump into App, website design, Skills, tools or UI vocabulary.
- Primary tags: `App 设计`, `官网设计`, `设计 Skill`, `设计工具`, `UI 词库`.
- The five tags are mutually exclusive tabs/switches, not navigation links. Clicking a tag changes the preview content shown below and updates the active state.
- Show only the preview for the currently selected category instead of displaying all five category cards at the same time.
- The preview itself should not be the primary navigation target.
- Put a compact `查看更多 ↗` link at the lower-right of the section. This link is the navigation action and must update its destination to match the currently selected tag/category.
- On narrower screens, keep the tabs horizontally scrollable if needed; do not stack a long catalog.
- The section remains a lightweight home-page entry, not a full browsing experience.
- Every category must use a different preview image grounded in the current ONDesign project, never a generic hotel/e-commerce placeholder that is unrelated to the destination.
- `App 设计`: use a real App case screenshot from the Library/case assets; present it in a `9:16` frame.
- `官网设计`: use a real Web case screenshot already used by ONDesign; present it in a `16:9` frame.
- `设计 Skill`: use a real Skill repository/card/detail asset from the Skills library; present it in a `3:4` frame.
- `设计工具`: use a real ONDesign workflow/demo preview that represents Start Designing / Design DNA usage; present it in a `3:4` frame.
- `UI 词库`: use a real Vocabulary sheet/card asset showing actual UI terms or components; present it in a `3:4` frame.
- The preview image should use `object-fit: cover` or a controlled crop only when needed to preserve the required frame ratio; do not distort the source image.

### Final CTA

- Do not use a full-screen creator quote / self-attribution section before the final CTA.
- The old `WHY I MADE THIS / ONDesign Creator` editorial block is not part of the final home narrative and should remain removed from presentation.
- Keep only one focused final action into Start Designing.
- Do not repeat a secondary “browse more cases” button at the bottom; case browsing is already available earlier in the page.
- The final CTA should feel compact, calm and connected to the footer rather than like another oversized hero screen.

## Interaction rules

- Favor large visual examples over dense text.
- Keep section hierarchy strong and editorial rather than dashboard-like.
- Avoid excessive cards when a full-width composition communicates better.
- Chinese typography and English typography may use different spacing / line-height treatment where needed.
- Maintain ONDesign's green brand direction unless a global design decision changes it.
- Do not turn the page into a catalog grid; catalogs belong to Library / Vocabulary / Skills.
- Keep the primary Start Designing path obvious without adding configuration controls that belong to Launcher.
- Keep desktop vertical rhythm compact enough that adjacent sections feel connected. Avoid large blank bands created by section padding; default content sections should generally sit in a roughly 64–88px vertical-padding range, with only intentional hero/editorial moments allowed to exceed it.
- Section headings, supporting copy and tab/filter groups should use compact internal spacing so the page stays relaxed without feeling empty.

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
- Oversized vertical whitespace that makes each section feel disconnected from the next.
- Creator/self-quote sections that repeat the product thesis instead of advancing the user journey.
- Duplicate final CTA buttons that send users back to content already surfaced above.

## Modification boundary

Changes to `learn.html` should improve product understanding, learning progression or conversion into the next ONDesign workflow step.

If a request introduces detailed configuration, case management or a large reference directory, route that responsibility to Launcher, Library, Vocabulary or Skills instead of expanding Home without an explicit product decision.
