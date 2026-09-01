# Skills Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `skills.html`
- Product role: design Skill + Web reference discovery directory
- Canonical implementation: `src/features/skills/skills.css` and responsibility modules listed in `AGENTS.md`
- Shared knowledge-directory geometry and floating search: `src/core/app-shell/directory-page.css`
- Shared knowledge-page cleanup: `src/core/app-shell/knowledge-directory-cleanup.css`
- Supported top-level modes: `SKILL` and `WEB`

## Page goal

Help users discover reusable design Skills, websites, design systems, UI references and implementation resources that can support AI Coding and interface design.

## Core user task

A user should be able to quickly understand what a resource is, what kind of reference it provides, whether source code is available, and whether it is worth opening or reusing.

## Core functions

- Switch between Skill and Web resource modes.
- Filter / sort resources.
- Preserve URL state for shareable filtered views.
- Support source-code availability as a clear filter / attribute.
- Organize Web references with understandable, multi-select categories.
- Show useful visual previews / screenshots when available.
- Allow copyable prompt / usage guidance where appropriate.
- Support card interactions such as flipped states only when they reveal useful additional information.

## Skill classification rule

- Classify a Skill by its primary creative output or working capability, not simply because it is broadly related to design.
- Interface-focused resources use `界面设计 / Interface design`.
- Poster, editorial print, zine, risograph, monochrome print and related graphic-output resources use `海报设计 / Poster design` when poster/editorial composition is their primary capability.
- A resource-specific category should not rename unrelated Skills globally.
- Example: `yanliudesign/mono-color-skill` is a poster/editorial-print Skill. Its card and detail category should be `海报设计 / Poster design`, while its description should emphasize one-ink or controlled two-ink editorial visuals, halftone/image treatment, negative space and restrained typography rather than UI/interface design.

## Resource categories

The Web directory may support overlapping multi-select classifications such as:

- 真实网站
- 单页展示
- 组件 / Demo
- 灵感参考
- 设计系统
- 页面设计
- 组件设计
- 动效与交互
- 视觉优化
- 有源代码 / 无源代码

Category wording can be refined, but the structure should remain intuitive and should not force one resource into only one narrow bucket.

## Information structure

1. Flat mode / directory context without an enclosing hero card
2. Flat filter controls
3. Lightweight utility row for useful actions such as sort / reset / sync status
4. Resource list / visual cards
5. Focused inspector / flipped detail when useful
6. Direct action: visit, copy prompt, inspect source availability, etc.
7. Persistent bottom-centered floating search for Skill / Web resource discovery

## Interaction rules

- The knowledge-page shell is intentionally flat: page-level hero, overview and filter containers must not use card-style borders, rounded white panels or shadows.
- Skill and Web resource cards remain cards because they represent real independent resources; flattening the page shell must not remove their preview, hover, flip or direct actions.
- Filters must remain understandable and compact.
- Avoid large unused gutters; the directory should use available desktop width effectively.
- Cards should prioritize the actual resource and its visual evidence over decorative chrome.
- A flipped card state should reveal additional useful content rather than repeat the front.
- Resources that cannot meaningfully flip should not fake a flip interaction.
- Source-code availability should remain visible and filterable.
- The primary search field is detached from the content toolbar and remains centered at the bottom of the viewport.
- Useful secondary controls such as sorting, reset and sync/status indicators should remain accessible; style them as a lightweight, borderless utility row instead of hiding them or wrapping them in another card.
- Result-count-only or empty toolbar chrome should not remain after search moves to the floating dock.
- On desktop pointer devices, the floating search stays icon-sized while idle and expands only on hover or keyboard/input focus; this compact resting state must not block page content.
- Touch layouts should remain directly usable without requiring hover.
- The floating search uses the same shared geometry as Library and Vocabulary, while keeping Skills-specific placeholder text and filtering behavior.
- Chinese and English modes should expose equivalent resources and functionality.

## Keep

- `SKILL` and `WEB` modes unless explicitly changed by product requirements.
- Source-code filtering.
- Sort / reset / sync-state controls when they provide real directory functionality.
- URL state.
- Existing responsibility split between data, filtering and rendering.
- Direct links to the original resource.

## Remove / avoid

- Page-level card chrome around the hero, overview or filter sidebar.
- Duplicate filter systems.
- Task-search controls that do not improve resource discovery.
- Result-count-only or empty toolbar chrome after search moves to the floating dock.
- Large empty margins that reduce browsing efficiency.
- Repeated buttons or repeated resource metadata.
- Recreating Library or Vocabulary inside this page.
- A second inline search field in the page toolbar while the shared floating search is active.

## Modification boundary

Skills changes should improve discovery, comparison or reuse of external/internal design resources and Skills.

Case-study browsing belongs primarily to Library. UI-term learning belongs to Vocabulary. Active Design DNA configuration belongs to Launcher.
