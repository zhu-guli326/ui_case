# Learn / Home Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `learn.html`.
- Product role: ONDesign main landing / learning entry.
- Canonical implementation: `learn.html`, `src/features/home/home.css`, `src/features/home/home.js`.
- Shared global navigation remains owned by the App Shell.
- Home stays static HTML/CSS/JS with GSAP + ScrollTrigger progressive enhancement; do not migrate to React solely for animation.

## Page goal

Make Design DNA understandable through visual progression rather than long explanation. The page should feel calm when stopped and expressive while scrolling: closer to an editorial/product demo than a stack of independent cards.

## Core user task

A visitor should understand that ONDesign starts from real references, translates those references into concrete design decisions, moves through `DEFINE → CREATE → BUILD → ITERATE`, and finally turns the decisions into reusable Design DNA for AI Coding.

## Canonical information structure

1. Hero — `DESIGN DNA FOR AI CODING`
2. Real cases — visual proof before explanation
3. Compact proof numbers — cases / components / systems
4. Explore — App / Website / Skill / Tools / UI Vocabulary
5. Workflow — DEFINE → CREATE → BUILD → ITERATE
6. Design DNA assembly — Typography / Color / Spacing / Components
7. One Start Designing CTA
8. Footer

Do not add extra editorial or creator sections between these beats unless they advance this story.

## Full-home visual direction

- Use a small number of strong scenes rather than many generic sections.
- Prefer full-bleed compositions, pinned stages, large imagery and strong typography over bordered card grids.
- Structural palette: black / warm off-white; ONDesign green is the accent, not a page-wide gradient-glow treatment.
- Keep content relaxed but remove dead vertical bands.
- Motion must clarify hierarchy and progression instead of showing off effects.
- The page must remain readable and navigable if GSAP fails or JavaScript is unavailable.

## Scene requirements

### Hero

- Near-full viewport with the current Design DNA background asset.
- Editorial, asymmetric composition: large two-line title plus supporting copy/actions.
- GSAP entrance reveals kicker, title lines, copy and actions in sequence.
- Scroll adds slow image scale/parallax and gently recedes the content.
- Pointer response is subtle; no large cursor-follow glow.
- Second-pass refinement: title should feel more composed and less oversized, supporting copy should sit closer to the visual hierarchy, and the transition into cases should feel continuous rather than like a hard section cut.

### Real cases

- Keep the three current real case assets.
- Desktop: vertical scroll drives a pinned horizontal gallery; one case should dominate visually at a time.
- Mobile: normal horizontal swipe/stack; no pinning.
- Keep case labels readable and preserve links to Library.
- Second-pass refinement: reduce empty black space, increase image dominance, use calmer captions, and add subtle per-panel depth while moving horizontally.

### Proof numbers

- Keep `19 / 57 / 19` and current meanings unless product data changes separately.
- Present as a compact bridge, not a feature section.
- Count up once; never loop.

### Explore

- Chinese heading stays `看点啥`.
- Categories remain `App 设计`, `官网设计`, `设计 Skill`, `设计工具`, `UI 词库`.
- Mutually exclusive switches with one large preview and one dynamic `查看更多 ↗` link.
- Each preview uses a real ONDesign asset tied to its destination.
- Switching uses short GSAP blur/scale/fade handoff.
- Second-pass refinement: make the preview feel less like a generic bordered card and more like a framed visual canvas; tabs should read more like editorial navigation.

### Workflow

- Label: `image2 to ui`.
- Heading communicates `从一个 Idea 到一个 Demo，你需要经历这 4 步。`
- Stages: DEFINE / CREATE / BUILD / ITERATE.
- Keep the four current portrait assets and stage colors.
- Historical figures remain supporting visual metaphors; stage/action is primary.
- Desktop uses a pinned sequence; mobile uses stable cards.
- Keep ProfileCard-inspired pointer tilt/glow as a secondary desktop interaction.
- Keep the `image2_UI_skill` source link.
- Second-pass refinement: only one card should feel fully active; outgoing cards should recede cleanly rather than pile up. The stage index must visibly track scroll progress.

### Design DNA assembly

- Keep only one teaching scene; do not restore the old duplicated card pile / live explainer pair.
- One central product interface plus four rule groups: Typography, Color, Spacing, Components / states.
- Desktop pins and progresses through the four rules; mobile stacks naturally.
- Each rule visually demonstrates itself rather than relying on long text.
- Second-pass refinement: central UI stays visually dominant, overlays should be quieter, and the active rule should affect the central interface enough that the user can see the system being assembled.
- Third-pass focus treatment: use light/dark contrast as the primary attention mechanism. The central product UI is the brightest/highest-contrast object; inactive rules and overlays recede noticeably.
- Add a restrained warm-white spotlight / vignette across the Design DNA stage. The spotlight follows the active rule position as the scroll step changes, but must not become a green page-wide glow.
- Inactive rule rows should sit around low visual emphasis; the active row becomes fully legible and gains one small ONDesign-green focus marker.
- Only the active floating rule card should read as fully illuminated. Other floating cards stay visible enough to preserve spatial context but should not compete for attention.
- The active rule should also change emphasis inside the central UI: Typography favors the heading area, Color favors branded/green controls, Spacing favors the project layout, and Components favors the bottom component-state row.
- Lighting transitions must remain soft and editorial rather than theatrical flashing. No pulsing, looping glow, or high-saturation neon treatment.

### Final CTA

- Keep one focused Start Designing action.
- Chinese message: `别只收藏喜欢的设计。让它成为下一次设计的起点。`
- CTA should feel like a decisive ending, not another large feature section.

## Motion system

- Page-level choreography uses GSAP + ScrollTrigger.
- GSAP is progressive enhancement loaded from CDN; static fallback must remain functional.
- Native scrolling is the baseline; no smooth-scroll hijacking in this pass.
- Do not animate layout properties when transform/opacity can do the job.
- Avoid permanent loops, bouncing, excessive blur, particle backgrounds or simultaneous motion everywhere.
- Desktop can use pin/scrub where it advances the story; mobile uses simpler entrance motion.
- `prefers-reduced-motion: reduce` disables non-essential choreography and pointer tilt.
- Resize must cleanly rebuild ScrollTriggers without duplicates.

## Second-pass refinement priorities

1. Stronger hierarchy: fewer equally loud sections.
2. Tighter spacing: reduce empty vertical gaps and unnecessary black/off-white bands.
3. More image-led composition: case imagery and workflow portraits dominate over decoration.
4. Cleaner pinned transitions: no stacked-card clutter, no abrupt pin releases.
5. Better continuity: colors/backgrounds should transition naturally between adjacent scenes.
6. Less UI-card feeling: remove decorative borders/shadows where they make Home look like a dashboard.
7. Mobile must still feel intentionally designed, not merely a desktop layout collapsed into one column.

## Keep

- Strong first-screen value proposition.
- Existing real case assets.
- Current workflow portrait assets.
- Explore categories and real previews.
- Shared App Shell and bilingual behavior.
- Clear Start Designing path.

## Remove / avoid

- Generic section + card-grid repetition.
- Duplicate Home motion/style/runtime files.
- Full creator quote section.
- Duplicate bottom CTA buttons.
- Excessive green glow, glassmorphism, heavy drop shadows or novelty animation.
- Page-wide redesign responsibilities leaking into Library / Vocabulary / Skills / Launcher.

## Modification boundary

Home changes should improve product understanding, visual storytelling or the path into Start Designing. Detailed configuration and catalog browsing remain responsibilities of Launcher, Library, Vocabulary and Skills.