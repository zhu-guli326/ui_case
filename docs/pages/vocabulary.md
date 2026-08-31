# Vocabulary Page Requirements

Last updated: 2026-09-01

## Page identity

- Public route: `vocabulary.html`
- Product role: UI vocabulary / visual language learning and reference page
- Canonical runtime: `src/features/vocabulary/vocabulary.js`
- Main styles: `src/features/vocabulary/vocabulary.css` and responsibility styles under `src/features/vocabulary/styles/`
- Shared knowledge-directory geometry and floating search: `src/core/app-shell/directory-page.css`
- Supporting data / preview / i18n modules remain split by stable responsibility under `src/features/vocabulary/`

## Page goal

Help users understand, compare and reuse concrete UI design vocabulary through visual examples rather than abstract definitions alone.

The page should make design terms easier to recognize and apply in AI Coding prompts and Design DNA decisions.

## Core user task

A user should be able to:

1. Find a design term or category.
2. See a clear visual example.
3. Understand what the term changes in a real interface.
4. Copy or reuse the idea in a prompt / design workflow when appropriate.

## Core functions

- Browse UI vocabulary by category.
- Search / filter vocabulary items.
- Show visual examples or previews for each concept.
- Support category-specific data rather than one oversized data source.
- Support bilingual labels and descriptions.
- Where useful, provide copyable prompt language or reusable design descriptions.
- Support visual topics such as styles, typography, color, layout, components and motion when represented by current data.

## Information structure

Preferred structure:

1. Page title / short orientation
2. Compact secondary toolbar for sort / share controls
3. Category navigation or filtering
4. Visual vocabulary list / cards
5. Focused preview / example area
6. Optional concise explanation / reusable prompt
7. Persistent bottom-centered floating search for vocabulary discovery

The page should behave more like a visual directory + learning reference than a form-heavy editor.

## Interaction rules

- A vocabulary item should reveal its meaning primarily through visuals.
- Large example imagery / previews should receive more emphasis than long body copy.
- Search and category changes should be easy to understand and reversible.
- The primary search field is detached from the content toolbar and remains a centered floating control at the bottom of the viewport; reserve page-bottom space so it never covers the last usable content.
- The floating search uses the same shared geometry as Library and Skills, while keeping Vocabulary-specific placeholder text, keyboard behavior and search logic.
- Card behavior and preview behavior should remain consistent inside the page.
- If cards support flipped states or variants, the interaction must have a clear learning purpose rather than decorative complexity.
- Card flip and state-variant controls must remain repeatably clickable after card re-rendering, search/filter changes and language switching; interaction handling should live on a persistent parent rather than depend on one-time listeners attached to replaceable card DOM.
- Interaction reliability takes priority over decorative 3D flip effects. Avoid transform/backface-based hit testing when it makes pointer targets intermittent; a simple front/back state transition is preferred if it is more dependable.
- The visible card surface should remain a reliable toggle target, while explicit controls such as favorite, copy Prompt, state buttons and detail actions must keep their own independent behavior.
- Chinese and English content must switch through the global language system.

## Keep

- Category-based organization.
- Visual examples / preview orchestration.
- Search and focused exploration.
- Stable responsibility modules for i18n, navigation data, cards and previews.
- Copyable prompt support where it directly helps reuse a concept.

## Remove / avoid

- Full Launcher configuration workflow.
- Case-library responsibilities.
- Large blocks of generic design theory without visual evidence.
- Duplicate detail-page architecture when an inline focused preview is enough.
- Multiple overlapping navigation systems.
- A second inline search field in the page toolbar while the shared floating search is active.

## Modification boundary

Vocabulary changes should improve understanding, discovery or reuse of UI design concepts.

If a change is mainly about collecting real-world websites/cases, it belongs in Library or Skills. If it is about configuring a user's current Design DNA, it belongs in Launcher.

When new vocabulary categories materially change the page scope, update this document together with the data and UI.
