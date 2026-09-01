# Vocabulary Page Requirements

Last updated: 2026-09-02

## Page identity

- Public route: `vocabulary.html`
- Product role: UI vocabulary / visual language learning and reference page
- Canonical runtime: `src/features/vocabulary/vocabulary.js`
- Main styles: `src/features/vocabulary/vocabulary.css` and responsibility styles under `src/features/vocabulary/styles/`
- Shared knowledge-directory geometry and floating search: `src/core/app-shell/directory-page.css`
- Shared knowledge-page cleanup: `src/core/app-shell/knowledge-directory-cleanup.css`
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

1. Flat page title / short orientation without an enclosing hero card
2. A compact vocabulary count as the only hero overview statistic
3. Flat category navigation or filtering
4. Lightweight utility row for useful secondary actions such as sort / share when needed
5. Visual vocabulary list / cards
6. Focused preview / example area
7. Optional concise explanation / reusable prompt
8. Persistent bottom-centered floating search for vocabulary discovery

The page should behave more like a visual directory + learning reference than a form-heavy editor.

## Interaction rules

- The knowledge-page shell is intentionally flat: page-level hero, overview and filter containers must not use card-style borders, rounded white panels or shadows.
- The hero overview should stay minimal. Keep the vocabulary count (`71 / UI 词条`) but do not show the former three-column metadata row for browsing method, learning path and purpose; that information is already covered by the intro and page interactions.
- Vocabulary items themselves may remain cards when the card represents a real interactive learning object or visual example.
- A vocabulary item should reveal its meaning primarily through visuals.
- Large example imagery / previews should receive more emphasis than long body copy.
- Search and category changes should be easy to understand and reversible.
- The primary search field is detached from the content toolbar and remains centered at the bottom of the viewport.
- Useful secondary actions such as sorting or copying the current filtered view must remain available when they provide real functionality; present them as a lightweight, borderless utility row rather than another card container.
- Do not keep result-count-only or empty toolbar chrome above the vocabulary content.
- On desktop pointer devices, the floating search stays icon-sized while idle and expands only on hover or keyboard/input focus; this compact resting state must not block page content.
- Touch layouts should remain directly usable without requiring hover.
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
- Useful sort/share controls when they change or preserve the current view.
- Stable responsibility modules for i18n, navigation data, cards and previews.
- Copyable prompt support where it directly helps reuse a concept.
- Compact hero count (`71 / UI 词条`).

## Remove / avoid

- Page-level card chrome around the hero, overview or filter sidebar.
- The hero metadata trio: `浏览方式 / 搜索 + 筛选`, `学习路径 / 结构 → 形式 → 实现`, `用途 / 从需求到代码`.
- Full Launcher configuration workflow.
- Case-library responsibilities.
- Large blocks of generic design theory without visual evidence.
- Duplicate detail-page architecture when an inline focused preview is enough.
- Multiple overlapping navigation systems.
- Result-count-only or empty toolbar chrome after search moves to the floating dock.
- A second inline search field in the page toolbar while the shared floating search is active.

## Modification boundary

Vocabulary changes should improve understanding, discovery or reuse of UI design concepts.

If a change is mainly about collecting real-world websites/cases, it belongs in Library or Skills. If it is about configuring a user's current Design DNA, it belongs in Launcher.

When new vocabulary categories materially change the page scope, update this document together with the data and UI.
