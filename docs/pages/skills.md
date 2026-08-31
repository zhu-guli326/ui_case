# Skills Page Requirements

Last updated: 2026-08-31

## Page identity

- Public route: `skills.html`
- Product role: design Skill + Web reference discovery directory
- Canonical implementation: `src/features/skills/skills.css` and responsibility modules listed in `AGENTS.md`
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

1. Mode / directory context
2. Filter controls
3. Resource list / visual cards
4. Focused inspector / flipped detail when useful
5. Direct action: visit, copy prompt, inspect source availability, etc.

## Interaction rules

- Filters must remain understandable and compact.
- Avoid large unused gutters; the directory should use available desktop width effectively.
- Cards should prioritize the actual resource and its visual evidence over decorative chrome.
- A flipped card state should reveal additional useful content rather than repeat the front.
- Resources that cannot meaningfully flip should not fake a flip interaction.
- Source-code availability should remain visible and filterable.
- Chinese and English modes should expose equivalent resources and functionality.

## Keep

- `SKILL` and `WEB` modes unless explicitly changed by product requirements.
- Source-code filtering.
- URL state.
- Existing responsibility split between data, filtering and rendering.
- Direct links to the original resource.

## Remove / avoid

- Duplicate filter systems.
- Task-search controls that do not improve resource discovery.
- Large empty margins that reduce browsing efficiency.
- Repeated buttons or repeated resource metadata.
- Recreating Library or Vocabulary inside this page.

## Modification boundary

Skills changes should improve discovery, comparison or reuse of external/internal design resources and Skills.

Case-study browsing belongs primarily to Library. UI-term learning belongs to Vocabulary. Active Design DNA configuration belongs to Launcher.
