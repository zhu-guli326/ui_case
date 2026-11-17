# Library Page Requirements

Last updated: 2026-11-09

## Page identity

- Public route: `library.html`
- Product role: reusable UI case / asset library, presented as a curated case wall
- Canonical runtime: `src/features/library/library.js`
- Canonical styles: `src/features/library/library.css` for the page shell, `library-cards.css` for the spotlight and wall, `library-detail.css` for the detail viewer
- Spotlight controller: `src/features/library/library-spotlight.js`
- Supporting data / filter / card / detail / search / preview modules remain split by stable responsibility
- Shared knowledge-directory geometry: `src/core/app-shell/directory-page.css`

## Page goal

Help users browse, compare and inspect real UI cases and reusable references that can inform design decisions or AI Coding work.

## Core user task

A user should be able to find a relevant case, understand what makes it useful, inspect the visual reference and continue to the source / demo / reusable information when available.

## Core functions

- Browse a visual wall of real cases.
- Search and filter cases by scene or tag.
- Inspect one focused case with several authored screens.
- Open focused case detail or inspector content.
- Surface source, demo or reusable reference information where available.
- Preserve category and data responsibilities in the existing Library modules.

## Information structure

1. Compact light knowledge directory with four numbered columns: Design Tools, Design Skills, UI Dictionary and Case Library. Each has one short description and supporting links; no repeated destination tabs or decorative dot-pattern transition.
2. No separate page masthead — the knowledge-directory navigation already introduces the page (the 04 案例库 group is highlighted as current). There is no large hero, statistics panel or secondary headline block.
3. One sticky scene-filter bar directly below the directory: short category chips with live counts, the current result count, a clear-filters action and one inline search field. There is no category sidebar and no floating search on this route.
4. A full-width spotlight exhibit for the focused case: authored screens, a short style explanation, scene/use chips, one primary demo action, a browse-the-wall link and previous/next controls.
5. The case wall: three columns on standard desktop, four on very wide screens, two on tablet and one on mobile. Each case keeps a large authored cover inside a tinted exhibit frame with a museum-label caption beneath it.
6. Focused preview / detail.
7. Source / demo / relevant next action.

## Copy direction

- The Library page should avoid a large hero headline; users should reach the knowledge-directory navigation, the case wall and real previews quickly.
- The knowledge destinations are visible together as a light first-screen directory integrated with the page background; do not hide them in a dropdown menu.
- Global navigation exposes one Knowledge Library entry linking here. Vocabulary and Skills remain reachable from this unified entry page.
- Use `案例库` for the page heading and `案例墙 / The wall` for the collection section.
- Chinese category labels should stay short: `全部 / 文化 / 电商 / 阅读 / 旅行 / 工具 / 健康`.
- The showcase uses `此刻聚焦`, `进入界面体验`, `浏览案例墙` and `打开 Demo`. The English page mirrors the same hierarchy rather than translating older product-documentation wording literally.
- Keep `用这个风格`, copy and demo actions. Remove the action into Start Designing while Launcher is retained as an unlisted backup.
- Detail explanation should use conversational copy: `为什么它看起来舒服？` with `色彩、排版、组件、动效` as the supporting scope.
- Do not reintroduce the sidebar heading `分类筛选`, a floating search field, a result-count-only toolbar or redundant section-intro headings.

## Interaction rules

- Keep the same shared four-destination knowledge navigation visible when moving between Library, Skills (SKILL / WEB), and Vocabulary. Highlight the current destination, including changes made with the Skills mode controls. During cross-page navigation, keep the global header and knowledge navigation visually stationary; only the content below transitions.
- The scene-filter bar is sticky beneath the shared header. It uses a solid page-colored surface so scrolling artwork never shows through it.
- Category chips are mutually exclusive filters with pressed state and live counts. Hide categories with no cases. The active chip uses the ink fill; the brand green remains the primary action color.
- The inline search is the only Library search field. `/` focuses it when the user is not typing and no dialog is open. Escape clears the query outside a dialog.
- `清除筛选` is visible whenever a category, tag or query is active, and resets all three. It returns focus to the search field without scrolling the page.
- Clicking a wall tag filters by that tag, keeps the category on `全部`, updates the URL query, and scrolls the case wall into view. Clicking the active tag again clears it.
- Visual evidence should dominate over metadata.
- The spotlight uses the same filtered list as the wall. It keeps the selected case when that case is still in the results, otherwise selects the first result, and hides on empty results.
- Spotlight navigation supports previous/next buttons, Left/Right/Home/End when the stage has focus, and horizontal touch swipes. It wraps within the filtered list and never auto-advances.
- The selected case is remembered in session storage for refresh continuity. Storage failures are tolerated. Rapid switching must not apply an earlier image to the current case; decode the incoming cover before swapping.
- The spotlight shows up to three authored screens of the focused case. Cases without a multi-screen set use their single representative cover. A failed preview shows an unavailable state while retaining the demo action.
- Clicking any spotlight screen or its primary action opens the canonical detail/demo for the focused case.
- Fine-pointer hover lifts wall artwork and its phone; touch does not depend on hover. Reduced motion disables the lift, tilt and screen-switch animation.
- Cards show the case name, visual direction, two concise use cases and at most two clickable style tags. Each card has one explicit preview action visible without hover; do not repeat the same availability status in the metadata.
- The whole wall frame is the primary open target. Tag links inside the caption keep independent filter behavior.
- Card covers show the matching interface at a readable scale. Reference boards and multi-phone compositions belong in reference/detail content and must not be used as silent fallbacks for missing single-screen covers. A failed cover shows an unavailable state while retaining the demo action.
- Each case's catalog `previewImage` explicitly identifies its representative single-screen cover. Production covers must be included in Git and the published files; never infer their paths from a demo URL.
- FuFu Bakery and Moe card covers show their functional home screens, so browsing reveals the bakery actions and habit list rather than only onboarding artwork.
- Detail views should add information rather than repeat the card.
- The knowledge-page shell is intentionally flat: filter bar and wall heading must not use card-style borders, rounded white panels or shadows. The tinted exhibit frames and wall cards are content objects, not page chrome.
- Avoid excessive blank space on desktop browsing views. The wall may use four columns on very wide screens instead of stretching three oversized cards.
- The desktop knowledge directory stays compact (roughly 220–250px tall) so real case previews appear in the first viewport. On small screens it uses two columns with clearly differentiated destination titles.
- On mobile the filter bar keeps its inline search and the wall becomes one column.
- Touch layouts should remain directly usable without requiring hover and must not overflow horizontally.
- Chinese and English versions preserve equivalent functionality and component geometry.
- A case with a working local interactive demo must keep `可点击 Demo / Interactive demo` as a selectable preview mode in the detail dialog. Adding a video or generated screenshot must not silently remove the interactive state.
- Opening a case with a working local interactive demo defaults to that clickable demo. Cases without one open in the screenshot preview; users can still select screenshots or video explicitly.
- Interactive demos retain their authored 390×844 iframe viewport and scale uniformly to fit the visible preview, including on narrow screens and in fullscreen. Do not shrink the iframe document to the displayed frame or enlarge it beyond the available screen: fixed-position content and bottom navigation must stay visible and clickable.
- Shared phone chrome must preserve each demo's authored status-bar positioning. An overlay must not become an extra layout row that pushes full-height content and bottom actions outside the screen.
- Multi-screen embedded demos display their current active screen rather than pinning one named screen. RELAY supports player/discovery/artist navigation, SOFTLY supports reflection/mood navigation, and CleanBite supports analysis/membership navigation.
- The embedded FuFu Bakery demo opens on its browsable shop home rather than its welcome screen; the standalone demo may still show the welcome screen.
- The embedded Plate Play demo lets users open the recipe list from the home call to action or illustration, open the matching recipe detail, and return through visible navigation or browser history.
- If a legacy case stores its video/screenshots outside the live-demo folder, Library runtime may restore the canonical `liveDemo` route explicitly. `ArtMuse / 当代美术馆导览` must point to `./demo/artmuse-ios/index.html` and remain clickable in the embedded phone preview.

## Keep

- Search / filtering.
- Visual case cards and the case wall.
- Spotlight selection and session continuity.
- Detail / preview responsibility modules.
- Direct source or demo paths when data provides them.
- Current canonical Library data model.
- Existing interactive demos and the `可点击 Demo` preview mode for cases that have runnable local demos.

## Remove / avoid

- Retired `brands.html` design-lab and comparison actions. Keep the existing Launcher entry for starting from a case.

- Category sidebar, floating search and result-count-only toolbars.
- Page-level card chrome around the filters or wall heading.
- A knowledge-library dropdown in the global header.
- Style-count and GitHub-Star statistics in the page heading.
- Redundant section-intro headings such as “精选案例 / 从画面开始”.
- Vocabulary-style teaching definitions as the main content.
- Skills directory responsibilities.
- Launcher configuration workflow.
- Duplicate historical card implementations or redesign layers.
- Duplicate search fields and repeated availability labels.
- Spotlight auto-advance or an always-onscreen control that blocks the artwork.
- Replacing an existing interactive demo with video-only preview metadata when the runnable demo still exists in `demo/`.

## Modification boundary

Library changes should improve discovery, inspection or reuse of cases and visual assets.

If a request is mainly about explaining a UI term, use Vocabulary. If it is about configuring a user's design direction, use Launcher. If it is about discovering Skills or external design-resource directories, use Skills.
