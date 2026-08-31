# Library Page Requirements

Last updated: 2026-08-31

## Page identity

- Public route: `library.html`
- Product role: reusable UI case / asset library
- Canonical runtime: `src/features/library/library.js`
- Canonical styles: `src/features/library/library.css`, `library-cards.css`, `library-detail.css`
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

1. Library orientation / context
2. Search and filtering
3. Visual case grid / collection
4. Focused preview / detail
5. Source / demo / relevant next action

## Interaction rules

- Visual evidence should dominate over metadata.
- Cards should be easy to scan and should not all be forced into an identical media ratio when that harms the source material.
- Detail views should add information rather than repeat the card.
- Avoid excessive blank space on desktop browsing views.
- Search and filter interactions must remain predictable and reversible.
- Chinese and English versions should preserve equivalent functionality.

## Keep

- Search / filtering.
- Visual case cards.
- Detail / preview responsibility modules.
- Direct source or demo paths when data provides them.
- Current canonical Library data model.

## Remove / avoid

- Vocabulary-style teaching definitions as the main content.
- Skills directory responsibilities.
- Launcher configuration workflow.
- Duplicate historical card implementations or redesign layers.

## Modification boundary

Library changes should improve discovery, inspection or reuse of cases and visual assets.

If a request is mainly about explaining a UI term, use Vocabulary. If it is about configuring a user's design direction, use Launcher. If it is about discovering Skills or external design-resource directories, use Skills.
