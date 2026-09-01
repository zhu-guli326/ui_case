# Library Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `library.html`
- Product role: reusable UI case / asset library
- Canonical runtime: `src/features/library/library.js`
- Canonical styles: `src/features/library/library.css`, `library-cards.css`, `library-detail.css`
- Shared knowledge-directory geometry and floating search: `src/core/app-shell/directory-page.css`
- Library hero override: `src/features/library/library-hero-continuous.css`
- Shared knowledge-page cleanup: `src/core/app-shell/knowledge-directory-cleanup.css`
- Supporting data / filter / card / detail / search / preview modules remain split by stable responsibility

## Page goal

Help users browse, compare and inspect real UI cases and reusable references that can inform design decisions or AI Coding work.

## Core user task

A user should be able to find a relevant case, understand what makes it useful, inspect the visual reference and continue to the source / demo / reusable information when available.

## Core functions

- Browse case and asset collections.
- Search / filter cases.
- Show meaningful visual previews.
- Open focused case detail or inspector content.
- Surface source, demo or reusable reference information where available.
- Preserve category and data responsibilities in the existing Library modules.

## Information structure

1. Flat page orientation / context + case-count overview, without enclosing hero cards
2. Flat category filtering + visual case grid / collection
3. Focused preview / detail
4. Source / demo / relevant next action
5. Persistent bottom-centered floating search for global case discovery

## Interaction rules

- Visual evidence should dominate over metadata.
- The knowledge-page shell is intentionally flat: page-level hero, overview and filter containers must not use card-style borders, rounded white panels or shadows.
- Real case cards remain cards. Do not remove the visual case-card structure, hover state, preview, detail or source actions when flattening the page shell.
- Hero statistics show only the total case count. Do not show style count or GitHub Stars in this area.
- The case-count number uses the global numeric typography tokens (`--font-number`, tabular numerals).
- Cards should be easy to scan and should not all be forced into an identical media ratio when that harms the source material.
- Detail views should add information rather than repeat the card.
- Avoid excessive blank space on desktop browsing views.
- Search and filter interactions must remain predictable and reversible.
- The primary search field is detached from the content toolbar and remains centered at the bottom of the viewport.
- Once search is detached, do not leave an inline result-count toolbar or a secondary “精选案例 / 从画面开始” heading between the hero and the case grid.
- On desktop pointer devices, the floating search stays icon-sized while idle and expands only on hover or keyboard/input focus; this compact resting state must not block page content.
- Touch layouts should remain directly usable without requiring hover.
- The floating search uses the same shared geometry as Vocabulary and Skills, while keeping Library-specific placeholder text and search behavior.
- Chinese and English versions should preserve equivalent functionality.
- A case with a working local interactive demo must keep `可点击 Demo / Interactive demo` as a selectable preview mode in the detail dialog. Adding a video or generated screenshot must not silently remove the interactive state.
- If a legacy case stores its video/screenshots outside the live-demo folder, Library runtime may restore the canonical `liveDemo` route explicitly. `ArtMuse / 当代美术馆导览` must point to `./demo/artmuse-ios/index.html` and remain clickable in the embedded phone preview.

## Keep

- Search / filtering.
- Visual case cards.
- Detail / preview responsibility modules.
- Direct source or demo paths when data provides them.
- Current canonical Library data model.
- Existing interactive demos and the `可点击 Demo` preview mode for cases that have runnable local demos.

## Remove / avoid

- Page-level card chrome around the hero, overview or filter sidebar.
- Style-count and GitHub-Star statistics in the hero.
- Result-count-only toolbars above the content list.
- Redundant section-intro headings such as “精选案例 / 从画面开始”.
- Vocabulary-style teaching definitions as the main content.
- Skills directory responsibilities.
- Launcher configuration workflow.
- Duplicate historical card implementations or redesign layers.
- A second inline search field in the page toolbar while the shared floating search is active.
- Replacing an existing interactive demo with video-only preview metadata when the runnable demo still exists in `demo/`.

## Modification boundary

Library changes should improve discovery, inspection or reuse of cases and visual assets.

If a request is mainly about explaining a UI term, use Vocabulary. If it is about configuring a user's design direction, use Launcher. If it is about discovering Skills or external design-resource directories, use Skills.
