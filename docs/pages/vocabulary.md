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
- In the Navigation category, compare navigation and discovery patterns with visual examples, fit guidance, limits and mobile adaptations.

## Information structure

Preferred structure:

1. Persistent shared knowledge-directory navigation, followed by category navigation / filtering
2. Lightweight utility row for useful secondary actions such as sort / share when needed
3. Visual vocabulary list / cards
4. Focused preview / example area
5. Optional concise explanation / reusable prompt
6. Persistent bottom-centered floating search for vocabulary discovery

The page should behave more like a visual directory + learning reference than a form-heavy editor.

## Interaction rules

- Keep the same shared four-destination knowledge navigation visible when moving between Library, Skills (SKILL / WEB), and Vocabulary. Highlight the current destination, including changes made with the Skills mode controls. During cross-page navigation, keep the global header and knowledge navigation visually stationary; only the content below transitions. Shared implementation: src/components/knowledge-nav/knowledge-nav.js and knowledge-nav.css.

- The knowledge-page shell is intentionally flat: page-level hero, overview and filter containers must not use card-style borders, rounded white panels or shadows.
- The page no longer keeps an independent hero or hero count; the shared knowledge-directory navigation stays visible on this route above vocabulary content.
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
- Flip-capable cards should visibly communicate clickability. Use a restrained GSAP affordance: a one-time hint on newly encountered cards, subtle pointer/focus lift and tilt on desktop, and a short transition when switching front/back content. Do not use continuous pulsing or looping motion.
- The GSAP flip enhancement must animate the stable outer card / face content around the state change rather than making a persistent `rotateY(180deg)` face transform responsible for hit testing.
- Card flip and state-variant controls must remain repeatably clickable after card re-rendering, search/filter changes and language switching; interaction handling should live on a persistent parent rather than depend on one-time listeners attached to replaceable card DOM.
- Interaction reliability takes priority over decorative 3D flip effects. Avoid transform/backface-based hit testing when it makes pointer targets intermittent; a simple front/back state transition is preferred if it is more dependable.
- The visible card surface should remain a reliable toggle target, while explicit controls such as favorite, copy Prompt, state buttons and detail actions must keep their own independent behavior.
- Respect `prefers-reduced-motion`: keep the same front/back state behavior but skip GSAP movement and decorative transitions.
- Chinese and English content must switch through the global language system.
- Selecting the Navigation category without a search query reveals the navigation-and-discovery comparison before the matching vocabulary cards.

## Keep

- Category-based organization.
- Visual examples / preview orchestration.
- Search and focused exploration.
- Useful sort/share controls when they change or preserve the current view.
- Stable responsibility modules for i18n, navigation data, cards and previews.
- Copyable prompt support where it directly helps reuse a concept.
- Direct page switching from the Library knowledge-directory navigation.

## Remove / avoid

- Page-level card chrome around the hero, overview or filter sidebar.
- Independent vocabulary hero / overview section after switching from the shared knowledge-directory navigation.
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
