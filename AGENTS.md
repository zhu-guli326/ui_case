# ONDesign Agent Rules

## Product source of truth

- `main` contains the one current production version of ONDesign.
- Git history is the archive. Do not keep old visual versions, abandoned experiments, or parallel implementations in the working tree.
- When the user asks to modify a page, edit the current canonical implementation. Do not create another page/CSS/JS version to show an alternative unless the user explicitly asks for a separate persistent variant.
- A visual reference is guidance for the current page, not a reason to create `v2`, `final`, `reference-layout`, `redesign`, `fix`, or override files.

## Global framework / App Shell contract

The global framework is fixed across public pages. Page features own page content; they do not own site chrome.

### Shared shell owns

- ONDesign brand/logo.
- Primary navigation and all navigation item ordering/copy.
- Library dropdown navigation.
- GitHub / X / Xiaohongshu links and GitHub star display.
- `Start Designing` global entry.
- Chinese / English language switch.
- Shared header geometry, spacing, responsive behavior, active state, hover state and sticky behavior.
- Shared footer styling and global design tokens.

Canonical shared files:

- `src/core/app-shell/site-shell.css` — the only public-page stylesheet entry for shared chrome.
- `src/core/app-shell/app-shell.js` — the only source of global navigation markup, navigation items, language behavior and shared shell runtime.
- `src/components/site-header/site-header.css` — header/navigation implementation used through `site-shell.css`.
- `src/components/site-header/site-footer.css` — footer implementation used through `site-shell.css`.

### Public-page rules

- Every full public page must load `src/core/app-shell/site-shell.css` exactly once and `src/core/app-shell/app-shell.js` exactly once.
- Every full public page must use `<image2-site-header data-site-header></image2-site-header>` for the global header. Do not hand-write a second page-specific navigation bar.
- Do not directly load `design-tokens.css`, `language-switch.css`, `site-header.css`, or `site-footer.css` from an individual public page; `site-shell.css` owns those imports.
- Feature CSS under `src/features/**` must not style `.site-header`, `.site-nav`, `.site-brand`, `.global-language-switch`, `.site-footer`, or `image2-site-header`.
- Feature JS must not render its own global navigation or mutate global navigation items.
- If navigation needs to change, change the shared shell once so the change applies to every page.
- When the user asks to redesign one page, do not change the shared header/navigation/footer unless they explicitly ask for a global framework change.
- Page-specific headers, toolbars, tabs and sidebars are allowed inside `<main>` when they are part of that page's content; they must not masquerade as or replace the global navigation.

## Single Source of Truth

- Each public page has one current production implementation on `main`.
- Never create parallel feature files such as `*-v2`, `*-v3`, `*-new`, `*-old`, `*-backup`, `*-final`, `*-reference-layout`, `*-override`, `*-fix`, `*-hardening`, `*-legacy`, `*-compat`, or `*-redesign`.
- When a redesign is accepted, merge it into the canonical page CSS/JS and delete the superseded implementation in the same change.
- Split files only by stable responsibility such as data, filtering, rendering, preview, i18n, detail, or reusable components — never by design iteration.
- Avoid inline page `<style>` patches for normal feature work. Put accepted styles into the canonical feature stylesheet.

## Default scope

- Work only in the requested public page, its direct feature implementation, and shared dependencies that are genuinely required.
- Search exact selectors, functions, slugs, ids, or domains before opening large files.
- Do not recursively scan the repository for a local page change.
- Root HTML files are deployed URL entries, not implementation locations.
- Do not add root JS/CSS/MJS implementations.

## Do not load by default

- `demo/**` unless the task names that demo or case.
- `scripts/**` and `.github/**` unless the task concerns build, deployment, repository structure, or CI.
- generated reports, audit output, screenshots, caches or temporary migration files.
- binary media (`*.png`, `*.jpg`, `*.jpeg`, `*.webp`, `*.gif`, `*.mp4`) unless the visual asset itself is the task.
- generated `catalog/index.js` unless validating the catalog build.

## Context efficiency

- Treat tracked text files over 30 KB as context hotspots: search first and read only the relevant range.
- Avoid reading an entire file over 50 KB unless the task requires the full file.
- For CSS, locate the relevant selector first.
- For JS, locate the relevant export, handler, data object, or renderer first.
- For catalog changes, edit exact source JSON under `catalog/cases`, `catalog/styles`, `catalog/brands`, or `catalog/components`; do not edit generated `catalog/index.js` directly.

## Current canonical feature map

### Home

- Public URL: `learn.html` (`index.html` only redirects to it).
- CSS: `src/features/home/home.css`.
- JS: `src/features/home/home.js`.
- Do not create alternate Home styles or runtimes.

### Info pages

- `about.html`, `contact.html`, `privacy.html` share `src/features/info/info.css`.
- These pages still use the same global App Shell as every other full page.

### Vocabulary

- Public URL: `vocabulary.html`.
- Runtime: `src/features/vocabulary/vocabulary.js`.
- Main CSS entry: `src/features/vocabulary/vocabulary.css` plus responsibility styles under `src/features/vocabulary/styles/`.
- Data is split under `src/features/vocabulary/data/`; edit the category-specific module, not the whole data set.
- `vocabulary-component-data.js`, `vocabulary-search.mjs`, and `vocabulary-preview.js` are responsibility modules, not alternate versions.

### Skills

- Public URLs: `skills.html`, `skill-detail.html`.
- `skills.css` — current Skills directory styling.
- `skills.js` — directory runtime state, URL sync, media helpers, clipboard, GitHub stats and event wiring.
- `skills-data.js` — Skill catalog, translations, category labels, visual copy and official URLs.
- `skills-web-data.js` — design-reference website groups and catalog.
- `skills-filter.js` — pure filtering, source-code filtering and sorting helpers.
- `skills-render.js` — DOM rendering for filters, Skill cards, Web cards and inspector.
- `skills-design-systems.js` — design-system-specific data/behavior only.
- `skill-detail.js` / `skill-detail.css` — Skill detail page only.
- Add/edit a Skill repository in `skills-data.js`; add/edit a website in `skills-web-data.js`; change filtering in `skills-filter.js`; change markup in `skills-render.js`; change visual styling in `skills.css`.
- Preserve `window.image2SkillsCatalog`, `SKILL` and `WEB` modes, source-code filtering and URL state unless the requested product change explicitly changes that contract.

### Library

- Public URL: `library.html`.
- Page runtime: `src/features/library/library.js`.
- Base styles: `src/features/library/library.css`.
- Card styles: `src/features/library/library-cards.css`.
- Detail styles: `src/features/library/library-detail.css`.
- Use `library-data.js`, `library-filter.js`, `library-card.js`, `library-detail.js`, `library-search.mjs`, `library-preview-config.mjs`, and `library-runtime.js` by responsibility.
- Do not recreate historical fixes, overrides, redesigns or compatibility layers.

### Launcher

- Public URL: `launcher.html`.
- Canonical core: `src/features/launcher/launcher-dna.css` and `src/features/launcher/launcher-dna.js`.
- Other Launcher files are allowed only when they own a distinct stable responsibility (for example design-system catalog or preview i18n), not another Launcher version.
- Do not recreate workspace/state/url/hardening/simplified compatibility architectures.

### Brands

- Public URL: `brands.html`.
- Canonical implementation: `src/features/brands/brands.css` and `src/features/brands/brands.js`.

### Catalog

- Source data: `catalog/cases/*.json`, `catalog/styles/*.json`, `catalog/brands/*.json`, `catalog/components/*.json`.
- `catalog/index.js` is generated output; do not hand-edit it.

## Repository cleanliness

- Do not keep one-shot migration scripts, temporary workflows, screenshots, process notes, benchmark dumps, or abandoned experiments after a migration is complete.
- Do not embed image binaries as base64 in HTML, CSS, or JS.
- Do not recreate deleted `docs/**`, `references/**`, `tests/**`, `lab/**`, `src/legacy/**`, or feature `legacy/**` process structures unless the user explicitly requests a new product feature that genuinely needs them.

## Validation

For normal repository changes, use the current lightweight checks:

- `npm run build:catalog -- --check` when catalog/source data is affected.
- `npm run check` for public paths, shared shell contract and canonical feature naming.
- Keep CI green before considering a structural refactor complete.
