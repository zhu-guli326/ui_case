# Library Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `library.html`
- Product role: reusable UI case / asset library
- Canonical runtime: `src/features/library/library.js`
- Canonical styles: `src/features/library/library.css`, `library-cards.css`, `library-detail.css`
- Shared knowledge-directory geometry and floating search: `src/core/app-shell/directory-page.css`
- Library hero continuity override: `src/features/library/library-hero-continuous.css`
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

1. Library orientation / context + case count in one continuous hero container
2. Category filtering + visual case grid / collection
3. Focused preview / detail
4. Source / demo / relevant next action
5. Persistent bottom-centered floating search for global case discovery

## Interaction rules

- Visual evidence should dominate over metadata.
- The hero should read as one continuous container rather than two detached cards; use a subtle internal divider only.
- Hero statistics show only the total case count. Do not show style count or GitHub Stars in this area.
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

## Keep

- Search / filtering.
- Visual case cards.
- Detail / preview responsibility modules.
- Direct source or demo paths when data provides them.
- Current canonical Library data model.

## Remove / avoid

- Detached hero cards with a large gap between copy and statistics.
- Style-count and GitHub-Star statistics in the hero.
- Result-count-only toolbars above the content list.
- Redundant section-intro headings such as “精选案例 / 从画面开始”.
- Vocabulary-style teaching definitions as the main content.
- Skills directory responsibilities.
- Launcher configuration workflow.
- Duplicate historical card implementations or redesign layers.
- A second inline search field in the page toolbar while the shared floating search is active.

## Modification boundary

Library changes should improve discovery, inspection or reuse of cases and visual assets.

If a request is mainly about explaining a UI term, use Vocabulary. If it is about configuring a user's design direction, use Launcher. If it is about discovering Skills or external design-resource directories, use Skills.
