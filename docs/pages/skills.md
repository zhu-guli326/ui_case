# Skills Page Requirements

Last updated: 2026-10-08

## Page identity

- Public route: `skills.html`
- Product role: design Skill + Web reference discovery directory
- Canonical implementation: `src/features/skills/skills.css` and responsibility modules listed in `AGENTS.md`
- Shared knowledge-directory geometry and floating search: `src/core/app-shell/directory-page.css`
- Shared knowledge-page cleanup: `src/core/app-shell/knowledge-directory-cleanup.css`
- Supported top-level modes: `SKILL` and `WEB`
- The `WEB` mode keeps its URL and runtime key, while the sidebar displays `设计网站 / Design Sites` to describe its content.

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

1. Persistent shared knowledge-directory navigation, followed by mode / filter controls
2. Lightweight sorting controls
3. Resource list / visual cards, revealed in progressive batches with an explicit load-more action in Skill mode
4. Focused inspector / flipped detail when useful
5. Direct action: visit, copy prompt, inspect source availability, etc.
6. Persistent bottom-centered floating search for Skill / Web resource discovery

## Interaction rules

- Keep the same shared four-destination knowledge navigation visible when moving between Library, Skills (SKILL / WEB), and Vocabulary. Highlight the current destination, including changes made with the Skills mode controls. During cross-page navigation, keep the global header and knowledge navigation visually stationary; only the content below transitions. Shared implementation: src/components/knowledge-nav/knowledge-nav.js and knowledge-nav.css.
- Switching between Design Tools (WEB) and Design Skills (SKILL) from the shared knowledge navigation happens within the current Skills document. Update the URL, active state, filters and results without a full-page transition.

- The knowledge-page shell is intentionally flat: page-level hero, overview and filter containers must not use card-style borders, rounded white panels or shadows.
- The page no longer keeps an independent hero / overview section; the shared knowledge-directory navigation stays visible on this route above filters and results.
- Skill and Web resource cards remain cards because they represent real independent resources; flattening the page shell must not remove their preview, hover, flip or direct actions.
- Filters must remain understandable and compact.
- The desktop filter sidebar is a narrow rail that leaves more width for visual resource cards while keeping category labels and counts readable. It stays sticky next to the results and scrolls inside its own capped height, so every filter remains reachable instead of being cropped or scrolled out of the page.
- Narrow screens keep the same categories visible without turning the rail into a full-height list: categories sit in compact multi-column rows rather than one long column.
- Avoid large unused gutters; the directory should use available desktop width effectively.
- Skill cards keep a readable minimum width. The flow drops a column before cards become too narrow, so a wider window never produces narrower cards.
- The Skill wall is a staggered column flow with free card sizes: cards keep their own media-driven height and move up independently, so the wall never reads as a set of identical boxes. Image covers keep their intrinsic ratio; a cover height cap only trims unusually tall artwork. Video covers carry the ratio recorded in the catalog data, so a card has its final height before the recording loads its metadata.
- Skill mode reveals the directory in batches, starting with 24 cards and offering an explicit load-more action with the remaining count. The revealed batch follows the query: a new search, filter or sort starts from the first batch again, while background data refreshes keep the batch the user already revealed.
- Web mode keeps its full masonry flow instead of batching, because its cards are much taller and the list is shorter.
- Skill card descriptions clamp to two lines; the remaining detail stays on the skill detail page rather than pushing the cover wall taller.
- Cards should prioritize the actual resource and its visual evidence over decorative chrome.
- Video previews play muted and loop while visible, and pause outside the viewport. Respect reduced-motion preferences by keeping automatic playback off; pointer hover or keyboard focus can explicitly preview the video.
- WEB video previews keep their source aspect ratio and use the available card width without a fixed preview height or crop. The desktop WEB list gives previews two broad columns; narrow screens use one column.
- A flipped card state should reveal additional useful content rather than repeat the front.
- Resources that cannot meaningfully flip should not fake a flip interaction.
- Source-code availability should remain visible and filterable.
- The primary search field is detached from the content toolbar and remains centered at the bottom of the viewport.
- Keep sorting accessible as a lightweight utility control at the top right of the results area, above the first card row. It stays a page-owned control row so it never competes with the search-only shared toolbar, and it must not sit inside the narrow filter rail, where its labels are forced to wrap. Do not display GitHub sync status, result fractions or a reset button here.
- Sorting applies to the Skill list only; WEB mode hides the sort control instead of showing a control that has no effect.
- The SKILL and WEB mode badges show the complete resource count of their mode, including curated groups contributed by a separate responsibility module.
- Result-count-only or empty toolbar chrome should not remain after search moves to the floating dock.
- On desktop pointer devices, the floating search stays icon-sized while idle and expands only on hover or keyboard/input focus; this compact resting state must not block page content.
- Touch layouts should remain directly usable without requiring hover.
- The floating search uses the same shared geometry as Library and Vocabulary, while keeping Skills-specific placeholder text and filtering behavior.
- Chinese and English modes should expose equivalent resources and functionality.
- The directory no longer uses a Skills-scoped black hero; shared Library navigation handles the knowledge-directory context, while Skills focuses on filters and resource results.

## Keep

- `SKILL` and `WEB` modes unless explicitly changed by product requirements.
- Source-code filtering.
- Sorting and background GitHub statistics refresh.
- URL state.
- Existing responsibility split between data, filtering and rendering.
- Direct links to the original resource.

## Remove / avoid

- Page-level card chrome around the hero, overview or filter sidebar.
- Independent Skills hero / overview section after switching from the shared knowledge-directory navigation.
- Duplicate filter systems.
- Task-search controls that do not improve resource discovery.
- Result-count-only or empty toolbar chrome after search moves to the floating dock.
- A sort control inside the filter rail or in a full-width toolbar band, or a sort control that stays visible while it cannot affect the list.
- Forcing an extra card column at the cost of readable card width or readable descriptions.
- Rendering the entire Skill cover wall at once when the curated list keeps growing.
- Large empty margins that reduce browsing efficiency.
- Repeated buttons or repeated resource metadata.
- Recreating Library or Vocabulary inside this page.
- A second inline search field in the page toolbar while the shared floating search is active.

## Modification boundary

Skills changes should improve discovery, comparison or reuse of external/internal design resources and Skills.

Case-study browsing belongs primarily to Library. UI-term learning belongs to Vocabulary. Active Design DNA configuration belongs to Launcher.
