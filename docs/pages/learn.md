# Learn / Home Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `learn.html`.
- Product role: ONDesign main landing / learning entry.
- Canonical implementation: `learn.html`, `src/features/home/home.css`, `src/features/home/home.js`.
- Shared global navigation remains owned by the App Shell.
- Home stays static HTML/CSS/JS with GSAP + ScrollTrigger progressive enhancement; do not migrate to React solely for animation.

## Page goal

Make Design DNA understandable through a composed editorial/product-demo experience. The page should feel designed as one continuous visual system, not like screenshots and cards stacked vertically.

## Core user task

A visitor should understand that ONDesign starts from references, extracts concrete visual rules, moves through `DEFINE → CREATE → BUILD → ITERATE`, and turns those decisions into reusable Design DNA for AI Coding.

## Canonical information structure

1. Hero — `DESIGN DNA FOR AI CODING`
2. Real cases — visual proof before explanation
3. Compact proof numbers
4. Explore — App / Website / Skill / Tools / UI Vocabulary
5. Workflow — DEFINE → CREATE → BUILD → ITERATE
6. Design DNA 0 → 1 builder — Typography / Color / Spacing / Components
7. One Start Designing CTA
8. Footer

## 2026-09-01 visual reconstruction

This pass is a full visual reconstruction, not another decorative-motion pass.

### Primary visual rule

**Never present a source screenshot as an untouched screenshot pasted into the page.** Every source asset must be editorially composed before it becomes a Home visual.

Allowed treatments include:

- viewport crops instead of full-page screenshots;
- detail crops and zoomed fragments;
- wide horizontal crops from tall/mobile source material;
- masked windows and offset layers;
- two or three coordinated fragments from one source;
- context frames that make the asset feel like part of the ONDesign composition;
- restrained scale/parallax between foreground and background fragments.

Avoid:

- full tall mobile screenshots centered inside a large empty frame;
- device mockups used only to hide an untouched screenshot;
- screenshot cards floating with heavy shadows;
- repeated bordered cards with identical proportions;
- screenshot-in-card-in-card nesting.

### Visual language

- Editorial + product demo, not dashboard UI.
- Black, warm paper and one ONDesign green accent.
- Large typography, image crops, lines, labels and spatial rhythm carry the design.
- Reduce rounded rectangles; use radius only when the represented UI genuinely needs it.
- Avoid glassmorphism, neon gradients, generic glow, thick shadows and decorative UI chrome.
- Prefer asymmetry and large crop relationships over centered card grids.
- Static frame must already look good; GSAP should enhance composition, not rescue it.

## Scene requirements

### Hero

- Keep the Design DNA visual concept but compose it like a magazine cover / product campaign frame.
- Strong typographic hierarchy and one clear action cluster.
- No unnecessary UI card decorations.
- GSAP entrance is restrained: type reveal, subtle crop movement, no large cursor-follow glow.

### Real cases

- Keep the current real case assets, but never show them as untouched screenshots.
- Each case becomes a wide editorial canvas made from crop + detail + label.
- Desktop may use a horizontal sequence, but each panel should feel like a designed spread rather than a screenshot carousel.
- One image fragment dominates; secondary crop/label provides context.
- Mobile falls back to stacked wide crops, not tall screenshot cards.

### Proof numbers

- Keep `19 / 57 / 19` and current meanings unless product data changes separately.
- Present as a compact editorial bridge.

### Explore

- Chinese heading stays `看点啥`.
- Categories remain `App 设计`, `官网设计`, `设计 Skill`, `设计工具`, `UI 词库`.
- Never show the raw full source image directly.
- The preview is a composed canvas: one dominant crop plus one secondary detail crop and small metadata.
- Tall/mobile source images must be cropped into horizontal/partial windows; do not display the full phone-height screenshot.
- Switching uses a short GSAP crop/opacity handoff.

### Workflow

- Label: `image2 to ui`.
- Stages remain DEFINE / CREATE / BUILD / ITERATE.
- Keep current portrait assets, but reduce the “four card” feeling.
- Desktop should read as one staged sequence: one large active portrait/visual field plus a compact stage rail.
- Historical figures are visual metaphors; stage/action remains primary.
- Profile-style pointer tilt is optional and secondary; remove it if it makes the section feel gimmicky.
- Mobile uses clean stable stage panels without stacked-card effects.

### Design DNA 0 → 1 builder

- Keep the click/tap-controlled four-step interaction.
- Step order: `01 Typography → 02 Color → 03 Spacing → 04 Components`.
- Left side acts as a build rail. Earlier steps stay “built”, current step is active, later steps remain quiet.
- Right side is one clean product workspace that visibly evolves from step to step.
- Do not place explanatory cards on top of important UI.
- One annotation region may sit beneath or beside the product workspace, never overlap it.
- Lighting is optional and restrained; hierarchy should come primarily from composition and contrast.
- ScrollTrigger may reveal the scene, but must not overwrite user selection.

### Final CTA

- Keep one focused Start Designing action.
- Chinese message: `别只收藏喜欢的设计。让它成为下一次设计的起点。`
- Treat as a decisive graphic ending, not another feature card.

## Motion system

- Page-level choreography uses GSAP + ScrollTrigger.
- Native scrolling is the baseline; no smooth-scroll hijacking.
- Prefer transforms, clip-path and opacity.
- Do not pin every section; reserve pinning for moments where it improves understanding.
- Avoid looping motion, bouncing, excessive blur, particle backgrounds and simultaneous movement everywhere.
- `prefers-reduced-motion: reduce` keeps content usable and preserves click/tap interactions.
- Resize must rebuild ScrollTriggers without duplicates.

## Keep

- Existing App Shell and URL structure.
- Existing bilingual behavior.
- Existing case and workflow source assets where useful.
- Explore categories and destinations.
- Design DNA click/tap state logic.
- Clear path to Start Designing.

## Remove / avoid

- Generic section + card-grid repetition.
- Full-height raw mobile screenshots used as hero visuals.
- Untouched website screenshots pasted into large cards.
- Multiple floating annotation cards around the Design DNA workspace.
- Full creator quote section.
- Duplicate CTA buttons.
- Excessive green glow, glassmorphism, heavy drop shadows or novelty animation.
- Changes leaking into Library / Vocabulary / Skills / Launcher.

## Modification boundary

Home changes should improve product understanding, visual storytelling and the path into Start Designing. Catalog browsing and detailed configuration remain responsibilities of Library, Vocabulary, Skills and Launcher.