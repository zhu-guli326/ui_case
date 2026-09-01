# Learn / Home Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `learn.html`.
- Product role: ONDesign main landing / learning entry.
- Canonical implementation: `learn.html`, `src/features/home/home.css`, `src/features/home/home.js`.
- Shared global navigation remains owned by the App Shell.
- Keep static HTML/CSS/JS with GSAP + ScrollTrigger progressive enhancement.

## Page goal

Rebuild the entire Learn/Home page as one coherent editorial product story. The page must not look like a collection of UI cards, screenshots or demo widgets. Every screen should feel intentionally composed even before animation runs.

## Core story

`Reference → Extract rules → Define/Create/Build/Iterate → Build Design DNA → Start Designing`

The page should communicate that ONDesign does not simply collect screenshots. It helps turn visual references into reusable design rules AI Coding can execute.

## Canonical information structure

1. Hero — Design DNA for AI Coding
2. Real cases — three composed visual references
3. Compact proof strip — 19 / 57 / 19
4. Explore — App / Website / Skill / Tools / UI Vocabulary
5. Workflow — DEFINE / CREATE / BUILD / ITERATE
6. Design DNA 0 → 1 builder — Typography / Color / Spacing / Components
7. Start Designing CTA
8. Footer

## 2026-09-01 full-page reconstruction rules

This pass replaces the previous Home visual system. Do not preserve a previous section merely because it already exists.

### Visual direction

- Editorial + product demo, not SaaS dashboard.
- Strong asymmetry, oversized type, crop relationships, thin rules and negative space.
- Structural palette: warm paper, deep charcoal, white, ONDesign green accent.
- Reduce rounded cards, detached floating boxes, soft-glow panels and generic shadows.
- Do not create card grids as the default information pattern.
- Avoid repeating the same two-column section layout through the whole page.
- Static composition must work without GSAP; motion only adds pacing and emphasis.

### Absolute screenshot rule

**Never paste a raw source screenshot into Home as the final composition.**

Every source asset shown on Home must be recomposed using at least one of:

- wide viewport crop;
- detail crop;
- oversized zoom fragment;
- masked strip;
- offset crop pair;
- editorial contact-sheet arrangement;
- one dominant crop plus one contextual detail;
- partial-window framing where only the useful part of the source is visible.

Specifically forbidden:

- full-height mobile screenshots centered inside a large frame;
- untouched website screenshots inside generic cards;
- device mockups used only to disguise a full raw screenshot;
- screenshot-in-card-in-card nesting;
- long portrait images shown at their original proportions on desktop.

## Scene requirements

### 1. Hero

- Full-width opening scene.
- Large typographic statement is primary; image supports it rather than becoming a screenshot hero.
- Use the current Design DNA image as cropped atmosphere / spatial texture.
- Composition should feel closer to a magazine cover or campaign landing page than a centered SaaS hero.
- One primary CTA and one secondary text link only.
- Entrance motion: restrained type reveal + crop drift.

### 2. Real cases

- Keep three real case sources.
- Each case is a designed spread, not a screenshot card.
- Use one dominant wide crop and one secondary detail fragment from the same source.
- Case label and observation explain what to learn from it.
- Desktop may use one horizontal GSAP sequence; mobile stacks wide compositions.
- No full raw screenshot is visible at once.

### 3. Proof strip

- Keep `19 / 57 / 19` values and meanings.
- Compact bridge only; do not make this another feature section.

### 4. Explore

- Heading remains `看点啥`.
- Categories remain `App 设计`, `官网设计`, `设计 Skill`, `设计工具`, `UI 词库`.
- Interaction is click/tap controlled.
- Right-side preview is always a composed canvas, never a raw screenshot.
- For tall/mobile assets, crop into horizontal windows and details.
- Switching uses a short GSAP crop/opacity transition.
- Category navigation should feel like an editorial index, not pills or dashboard tabs.

### 5. Workflow

- Keep four stages: DEFINE / CREATE / BUILD / ITERATE.
- Keep existing portrait assets as supporting metaphors.
- Remove the old four-card composition.
- Use one large active visual stage with a compact stage rail.
- Clicking a stage updates the portrait crop, stage color, stage word and explanation.
- Stage text is primary; historical figure is secondary.
- No profile-card tilt unless a future pass explicitly asks for it.

### 6. Design DNA 0 → 1 builder

- Click/tap controlled, never auto-overridden by ScrollTrigger.
- Steps: `Typography → Color → Spacing → Components`.
- Earlier steps remain visibly built; current step is active; future steps are quiet.
- Right side is one evolving workspace.
- The workspace should visibly gain rules as steps advance.
- One annotation line/panel may sit outside the workspace; never cover product UI.
- No floating annotation pile.
- Do not rely on glow to communicate hierarchy; use contrast, layout and state.

### 7. Final CTA

- One decisive graphic ending.
- Chinese copy remains: `别只收藏喜欢的设计。让它成为下一次设计的起点。`
- One Start Designing action only.

## Motion system

- GSAP + ScrollTrigger for page-level choreography.
- Native scrolling remains baseline.
- Reserve pinning for the cases sequence only if it materially improves reading.
- Workflow and Design DNA interactions are user-controlled, not scroll-controlled.
- Prefer transform / opacity / clip-path.
- No looping particles, bouncing, large blur clouds or page-wide glow.
- Respect `prefers-reduced-motion` while keeping click/tap interactions functional.
- Resize must not create duplicate ScrollTriggers.

## Responsive rules

- Desktop target checks: 1366, 1440, 1920 widths.
- Mobile must be intentionally recomposed, not simply collapse desktop columns.
- Long mobile screenshots still cannot appear full-height on mobile Home; crop them into useful windows.
- Interactive rails become compact horizontal selectors where appropriate.

## Keep

- Global App Shell/navigation.
- Existing URL and bilingual behavior.
- Existing case and workflow assets where useful.
- Explore destinations.
- Clear Start Designing path.

## Remove / avoid

- Generic section + card-grid repetition.
- Full raw screenshots.
- Four-card workflow layout.
- Floating Design DNA annotation pile.
- Excessive green glow.
- Glassmorphism.
- Thick drop shadows.
- Creator quote section.
- Duplicate CTA actions.
- Any redesign spilling into Library / Vocabulary / Skills / Launcher.

## Modification boundary

This reconstruction is limited to Learn/Home. Library, Vocabulary, Skills and Launcher retain their existing responsibilities and page structures.