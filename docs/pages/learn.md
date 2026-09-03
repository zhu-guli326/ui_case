# Learn / Home Page Requirements

Last updated: 2026-09-03

## Page identity

- Public route: `learn.html`
- `index.html` only redirects here
- Product role: ONDesign main landing / learning entry
- Canonical implementation: `src/features/home/home.css`, `src/features/home/home.js`
- The Idea → Demo workflow may keep its dedicated `src/features/home/home-workflow.js` interaction component as long as it is the single runtime owner for that workflow and does not duplicate behavior in another Home script.
- The existing design-system explainer may keep its dedicated visual stylesheet, but new Home behavior must have one clear owner rather than parallel versioned, motion-only or override files.

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

The workflow explains the path from an idea to a runnable demo. The primary hierarchy is the action/stage, not the historical figure used as the visual metaphor.

- This section sits immediately after the lightweight discovery strip; the “看点啥” section should appear directly above the workflow.
- Section eyebrow: `image2 to ui`.
- Section heading: communicate “从一个 Idea 到一个 Demo，你需要经历这 4 步。” / equivalent English copy.
- Section heading typography should follow a restrained Ant Design-like hierarchy on white: use `rgba(0,0,0,.88)` instead of pure black, a medium Chinese weight, a looser line-height, and a smaller display scale than the generic Home H2.
- Stage 01: `DEFINE` — clarify the goal, page and references.
- Stage 02: `CREATE` — turn references into layout, typography, color and components.
- Stage 03: `BUILD` — hand Design DNA to AI Coding and produce a runnable demo.
- Stage 04: `ITERATE` — compare, adjust and validate until the demo looks right and works well.
- `DEFINE / CREATE / BUILD / ITERATE` must be more visually prominent than the names of Steve Jobs, Leonardo da Vinci, Bill Gates or Thomas Edison.
- Historical figures are supporting metaphors only; they should not become the main information users have to read.
- Approved final artwork set: purple `DEFINE / Steve Jobs`, orange `CREATE / Leonardo da Vinci`, blue `BUILD / Bill Gates`, green `ITERATE / Thomas Edison`, all using the same 3:4 halftone poster composition.
- The stage word is baked into each approved poster image. Do not render a second stage word over the poster artwork itself.
- Preserve the full upper composition of each poster so its baked stage word is not cropped. The poster image itself owns the stage-word size, position and person/background depth relationship.
- Add a compact source link aligned to the lower-right of this section pointing to `https://github.com/zhu-guli326/image2_UI_skill.git`.

#### Desktop workflow composition

Desktop uses an editorial three-part composition inspired by the React Bits Pro `about-4` pattern rather than four equal cards in one row.

- Left: show the four stage words vertically — `DEFINE`, `CREATE`, `BUILD`, `ITERATE`. Inactive stages are light gray; the current stage is near-black.
- Center: show only the current stage's approved 3:4 portrait/poster at full readable size.
- Right: show the historical figure's name first, then one large action-oriented heading describing their role, followed by one concise explanatory paragraph.
- Default state is `DEFINE / Steve Jobs`.
- Desktop vertical scrolling is a primary interaction: GSAP + ScrollTrigger pins the workflow composition for a bounded scroll distance and advances through `DEFINE → CREATE → BUILD → ITERATE` as scroll progress moves forward. The stages snap to four readable stops rather than changing on every pixel.
- Scrolling upward reverses the same sequence. Leaving the pinned range returns to normal page scrolling.
- Pointer hover over a stage may directly preview that stage. Keyboard focus must produce the same visual switch, and clicking a stage may move the scroll position to its corresponding stop.
- The right-side explanation should communicate the metaphor rather than biography:
  - Steve Jobs → judgment, focus and trade-offs; decide what is worth doing first.
  - Leonardo da Vinci → creation, synthesis and expression; organize references into a coherent visual direction.
  - Bill Gates → software, systems and implementation; turn Design DNA into runnable product code.
  - Thomas Edison → experimentation, validation and iteration; compare, adjust and keep testing until the result holds up.
- The composition should stay spacious and editorial, not turn into a dashboard or four-card catalog.
- On touch/narrow screens, do not pin the section or depend on scroll-wheel behavior. Keep the readable stacked/tabbed fallback.

#### Workflow motion enhancement

The current-stage poster keeps the pointer-reactive motion language from React Bits `ProfileCard` while using the editorial composition.

- Desktop pointer interaction: the active center poster tilts in 3D toward the pointer, with a soft pointer-following glare/highlight and subtle depth response.
- Stage changes use a short GSAP fade/vertical handoff for the poster and right-side copy rather than abrupt DOM swaps.
- The progress ring reflects the pinned workflow's actual scroll progress; it is not an unrelated autoplay spinner.
- Motion should interpolate smoothly rather than snap; when the pointer leaves, the poster eases back to center before the active glow disappears.
- Keep the approved four poster assets and per-stage color treatment. The motion is an enhancement, not a redesign into a profile/contact card.
- Do not add ProfileCard-specific user UI such as handle, online status, mini avatar or Contact button.
- Do not add mobile device-orientation tilt. Touch/mobile keeps the static card presentation.
- Do not add React solely for this effect. The current page is a static HTML/CSS/JS site, so preserve the React Bits motion model in the existing vanilla-JS architecture.
- Respect `prefers-reduced-motion: reduce`: disable scroll pinning, pointer tilt and animated handoffs for users requesting reduced motion.
- The enhancement must not alter keyboard focus, bilingual rendering, image loading or layout dimensions.

### Lightweight discovery strip

The old template gallery is no longer a template catalog. It is a compact “看点啥” discovery entry that helps users choose what kind of design resource they want to explore next.

- Place this whole section immediately before the Idea-to-demo workflow / Steve Jobs section.
- Chinese title: `看点啥`.
- Do not show an `EXPLORE` eyebrow/label above the `看点啥` title; the heading should start directly with the title.
- Keep the supporting copy short and conversational; explain that users can jump into App, website design, Skills, tools or UI vocabulary.
- Primary tags: `App 设计`, `官网设计`, `设计 Skill`, `设计工具`, `UI 词库`.
- The five tags are mutually exclusive tabs/switches, not navigation links. Clicking a tag changes the preview content shown below and updates the active state.
- Show only the preview for the currently selected category instead of displaying all five category cards at the same time.
- Preview cards are normally non-navigation surfaces; the current exception is `App 设计`, whose four image previews are clickable and all enter the case library.
- Put a compact `查看更多 ↗` link at the lower-right of the section. This link is the navigation action and must update its destination to match the currently selected tag/category.
- On narrower screens, keep the tabs horizontally scrollable if needed; do not stack a long catalog.
- The section remains a lightweight home-page entry, not a full browsing experience.
- Every category must use a different preview image grounded in the current ONDesign project, never a generic hotel/e-commerce placeholder that is unrelated to the destination.
- `App 设计`: show four approved App UI visual previews at once, each in a `9:16` frame. Desktop keeps all four visible in one row; narrow screens use a compact `2×2` arrangement.
- Approved Home App references for this four-screen group: habit/routine tracker, bright recipe/cooking app, dark EV charging dashboard, and illustrated bakery app.
- All four App preview images click through to `library.html`, preserving the current `lang` query parameter (`zh` / `en`).
- Preserve each App source image without distortion or extra copy/overlay additions; the four-screen group remains a lightweight preview rather than a second App catalog.
- `官网设计`: use a real Web case screenshot already used by ONDesign; present it in a `16:9` frame.
- `设计 Skill`: show four real Skill visual previews at once, each in a `3:4` frame. Desktop keeps all four visible in one row; narrow screens may use a compact `2×2` arrangement.
- Approved Home Skill examples for this four-card group: `frontend-slides`, `react-three-fiber`, `video-shotcraft`, and `mono-color`.
- Preserve each Skill source image without distortion or extra copy/overlay additions; the four-card group remains a lightweight preview rather than a second Skills catalog.
- `设计工具`: use a real ONDesign workflow/demo preview that represents Start Designing / Design DNA usage; present it in a `3:4` frame.
- `UI 词库`: use a real Vocabulary sheet/card asset showing actual UI terms or components; present it in a `3:4` frame.
- The preview image should use `object-fit: cover` or a controlled crop only when needed to preserve the required frame ratio; do not distort the source image.

### Interactive design-system canvas

The live design-system explainer keeps the central product workspace and the four core rule cards visible together: typography, color, spacing, and component states.

- Keep the black stage and central workspace shell.
- The four core design-system callouts must remain present in the default desktop state; users should never have to hover to discover that the section contains four rule cards.
- Scroll/GSAP may still introduce the four callouts in a readable sequence as the section enters view, but after the entrance completes they remain visible.
- Pointer movement/hover may progressively reveal more of the central workspace structure/content and may enhance the rule cards, but it must not be the only mechanism that makes those cards visible.
- The visual should communicate that typography, color, spacing and component states are concrete rules applied to the same product canvas.
- More small design-system signals may appear (grid, radius, state, surface, layout/token references), but they must support the main idea rather than become a dense card wall.
- Touch/mobile shows the complete explainer without depending on hover.
- `prefers-reduced-motion: reduce` shows a complete static explainer.

### Final CTA

- Do not use a full-screen creator quote / self-attribution section before the final CTA unless an explicit later content decision restores it.
- Keep only one focused final action into Start Designing unless an explicit later content decision changes the CTA structure.
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

### Home motion system

The Home page should feel calm while static and expressive while scrolling. Motion is part of the page narrative, not decorative noise.

- Page-level scroll choreography uses GSAP + ScrollTrigger in the existing static architecture; do not migrate the Home page to React solely to obtain animation.
- GSAP must be progressive enhancement: if the CDN/library is unavailable, the page must remain fully visible, navigable and functional.
- Do not add site-wide smooth-scroll hijacking. Native scrolling remains the baseline; the bounded pinned Idea → Demo section is the explicit exception.
- Hero: staged entrance for eyebrow, title, supporting copy and actions; the Hero title may use a one-shot hand-typed/typewriter reveal on first load, ending in the complete stable title without looping. The effect must not shift layout, and `prefers-reduced-motion` skips it.
- Featured cases: preserve the existing draggable carousel mechanics, but add a restrained entrance/depth reveal around the carousel UI without fighting its card transforms.
- Stats: count up once when the section first enters view; do not loop.
- Discovery: changing tabs should feel like a visual transition, using short blur/scale/fade handoffs instead of a hard image swap. The underlying tab semantics and destinations stay unchanged.
- Idea → Demo: desktop pins the three-column workflow for a bounded distance; scroll progress advances the current stage `DEFINE → CREATE → BUILD → ITERATE`, and the center poster/right explanation animate together. Pointer tilt/glow remains a second interaction layer.
- Design-system cards: the typography/color/spacing/surface/component cards should assemble into view with staggered depth rather than appear as a static pile.
- Design-system live explainer: the central product UI establishes first, then the four surrounding typography/spacing/color/state callouts enter in a readable order and remain visible after entry.
- CTA/footer: finish with a restrained reveal; do not keep adding increasingly loud effects at the bottom of the page.
- Micro-interactions may include subtle magnetic response on primary links/buttons and pointer-following light in the Hero, but movement must stay small enough that text remains easy to target and read.
- Avoid permanent looping particles, continuous bouncing, scroll-jacking outside the explicit workflow pin, excessive blur or simultaneous animation of every element.
- Motion should use opacity/filter/clip/transform properties that stay performant and should avoid layout-thrashing animation.
- Mobile/touch uses reduced motion complexity: no pinned workflow, pointer-follow effects or 3D tilt, and scroll reveals should be shorter/subtler.
- `prefers-reduced-motion: reduce` disables non-essential scroll choreography, workflow pinning, pointer-follow, magnetic movement and 3D card tilt while preserving all content and controls.
- General Home motion remains in `src/features/home/home.js` and `src/features/home/home.css`; workflow-specific stage switching, pinning and poster tilt are owned only by `src/features/home/home-workflow.js` and the workflow styles in `home.css`.

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
- Duplicate parallel Home motion/style/runtime files.

## Modification boundary

Changes to `learn.html` should improve product understanding, learning progression or conversion into the next ONDesign workflow step.

If a request introduces detailed configuration, case management or a large reference directory, route that responsibility to Launcher, Library, Vocabulary or Skills instead of expanding Home without an explicit product decision.