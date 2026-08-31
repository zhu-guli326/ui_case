# Learn / Home Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `learn.html`
- `index.html` only redirects here.
- Product role: ONDesign main landing / learning entry.
- Canonical implementation: `learn.html`, `src/features/home/home.css`, `src/features/home/home.js`.
- Shared global navigation remains owned by the App Shell. Home must not duplicate or fork it.
- Home is a static HTML/CSS/JS page enhanced by GSAP + ScrollTrigger. Do not migrate Home to React solely for animation.

## Page goal

Make the value of Design DNA understandable through visual progression rather than long explanation.

The Home page should feel calm when stopped and expressive when scrolling: more like an interactive editorial/product demo than a stack of unrelated cards.

## Core user task

A visitor should quickly understand:

1. ONDesign starts from real visual references instead of vague prompting.
2. Those references are translated into concrete design decisions.
3. The workflow is `DEFINE → CREATE → BUILD → ITERATE`.
4. Design DNA means reusable rules for typography, color, spacing and components.
5. The next action is Start Designing.

## Information structure

The canonical Home narrative is:

1. **Hero — Design DNA for AI Coding**
2. **Proof / real cases — show visual quality before explanation**
3. **Compact proof numbers — cases / components / systems**
4. **Explore — choose App / Website / Skill / Tools / UI Vocabulary**
5. **Workflow — DEFINE → CREATE → BUILD → ITERATE**
6. **Design DNA assembly — show rules turning into one coherent interface**
7. **One final Start Designing CTA**
8. Footer

Do not add extra editorial sections between these beats unless they advance this story.

## Full-home visual direction

This page is intentionally being redesigned rather than cosmetically patched.

- Replace the old generic vertical-section rhythm with a small number of strong, visually distinct scroll scenes.
- Prefer full-bleed compositions, sticky/pinned stages, large imagery and strong typography over many bordered cards.
- Use black / off-white as structural backgrounds with ONDesign green as the primary accent. Do not add green gradient glow as a page-wide aesthetic.
- Preserve generous breathing room inside each scene, but remove empty bands that make sections feel disconnected.
- Motion should clarify hierarchy and progression. It should not feel like a component-effects demo.
- The design must still read well with JavaScript disabled or GSAP unavailable.

## Scene requirements

### 1. Hero

- Full viewport or near-full viewport.
- Primary title remains `DESIGN DNA FOR AI CODING`.
- Keep the current Design DNA background asset unless a later request changes it.
- Layout should be editorial rather than centered-template-like: large type, asymmetrical supporting copy/actions, strong image crop.
- GSAP entrance reveals title/copy/actions in sequence.
- Scroll gradually scales/parallaxes the image and lets the hero recede into the next scene.
- Desktop pointer may create a very subtle image offset / light response; no large cursor-follow effect.

### 2. Real cases

- Use the existing three real case assets already on Home.
- Replace the old floating carousel presentation with a stronger showcase scene.
- Desktop preferred behavior: a pinned horizontal gallery controlled by vertical scrolling, with one dominant case at a time and readable case labels.
- Users must still be able to click through to Library.
- Mobile falls back to normal horizontal swipe/stacked cards without pinning.

### 3. Proof numbers

- Keep `19 / 57 / 19` and their current meanings unless product data changes separately.
- Present as a compact visual bridge rather than a full standalone feature section.
- Count up once when entering view; no looping.

### 4. Explore

- Chinese heading remains `看点啥`.
- Categories remain: `App 设计`, `官网设计`, `设计 Skill`, `设计工具`, `UI 词库`.
- Categories are mutually exclusive switches.
- Use one large visual preview, not five simultaneous cards.
- Each category must use a real ONDesign project asset already associated with that destination.
- Switching category uses short GSAP blur/scale/fade transition.
- Keep one compact `查看更多 ↗` destination that updates with the active category.

### 5. Workflow

- Section label: `image2 to ui`.
- Heading communicates: `从一个 Idea 到一个 Demo，你需要经历这 4 步。`
- Stages:
  - `01 DEFINE` — goal / page / references
  - `02 CREATE` — layout / type / color / components
  - `03 BUILD` — Design DNA / AI Coding / runnable demo
  - `04 ITERATE` — compare / refine / validate
- Keep the four current portrait assets and their stage colors.
- Historical figures are supporting visual metaphors; stage/action remains primary.
- Desktop should read as a deliberate scroll sequence, not four equal static cards appearing at once.
- The current React Bits ProfileCard-inspired pointer tilt/glow may remain as a second interaction layer on desktop.
- Touch/mobile keeps cards stable and simpler.
- Keep the compact `image2_UI_skill` source link.

### 6. Design DNA assembly

This replaces the previous duplicated pair of sections (`Design system, without the fluff` card pile + separate large live explainer).

- There must be only one Design DNA teaching scene.
- The scene contains one central product UI / interface mockup and four rule groups around or beside it:
  - Typography
  - Color
  - Spacing
  - Components / states
- Desktop preferred behavior: pin the stage and progressively assemble the interface as the user scrolls.
- The central interface establishes first, then each rule group becomes active in a readable order.
- Each rule group must visually demonstrate the rule rather than explain it with long paragraphs.
- The final state should clearly communicate that one rule system can drive many pages consistently.
- Remove the old five-card floating design-system collage once this scene replaces it.

### 7. Final CTA

- One focused CTA only.
- Chinese direction: `别只收藏喜欢的设计。让它成为下一次设计的起点。`
- Primary action: `建立你的 Design DNA →` / equivalent English.
- Do not add a second `再看看案例` button here.
- Keep the ending visually calm and connected to the footer.

## Motion system

Page-level choreography uses GSAP + ScrollTrigger in the existing static architecture.

- GSAP is progressive enhancement. If CDN loading fails, all content remains visible, clickable and readable.
- Native scrolling remains the baseline; do not add Lenis or scroll hijacking in this refactor.
- Preferred motion vocabulary:
  - reveal: opacity + y/clip
  - depth: restrained scale/parallax
  - build: staged assembly tied to scroll progress
- Use pinned sections only where the content benefits from sequencing (real cases, workflow, Design DNA assembly). Do not pin every section.
- Avoid permanent loops, particles, bouncing indicators, excessive blur, oversized magnetic motion or continuous animations after the user stops scrolling.
- Avoid animating layout properties when transform/opacity can do the job.
- Do not let GSAP fight component transforms: wrap or target inner elements when a component already uses transform for its own interaction.
- Mobile/touch reduces pin duration and 3D complexity; content must remain easy to swipe/read.
- `prefers-reduced-motion: reduce` disables non-essential scroll choreography, pointer parallax, magnetic movement and 3D tilt.

## Interaction / accessibility rules

- Preserve bilingual rendering and `?lang=zh|en` URL behavior.
- Preserve shared App Shell header/navigation behavior.
- Preserve keyboard focus visibility and semantic links/buttons.
- Do not make preview-only surfaces fake navigation; use explicit links for actual navigation.
- Images must retain useful alt text and stable dimensions/aspect ratios.
- Home must not introduce detailed Launcher configuration controls.

## Keep

- Strong first-screen Design DNA proposition.
- Current real case assets.
- Current four workflow portrait assets.
- Real ONDesign discovery preview assets.
- Shared global App Shell.
- Bilingual support.
- Clear Start Designing path.

## Remove / avoid

- The old floating five-card Design System collage after the new assembly scene is active.
- Duplicate Design System explanation sections.
- `WHY I MADE THIS / ONDesign Creator` quote block.
- Duplicate final CTA buttons.
- Dense product-manual copy.
- Grid-after-grid presentation.
- Page-specific global navigation.
- Alternate Home implementations, override files, `*-v2`, `*-motion`, `*-animation`, or compatibility copies.

## Modification boundary

Changes to `learn.html` should improve product understanding, visual storytelling, learning progression or conversion into Start Designing.

Library browsing, Skill directory behavior, Vocabulary deep dives and detailed Design DNA configuration stay in their respective product pages.