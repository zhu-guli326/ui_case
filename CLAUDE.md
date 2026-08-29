# Claude Code Repository Rules

## Core product rule

- `main` contains the one current production version of ONDesign. Git history is the archive.
- When asked to modify a page, update its canonical implementation instead of creating a second version.
- Never create `*-v2`, `*-v3`, `*-new`, `*-old`, `*-backup`, `*-final`, `*-reference-layout`, `*-override`, `*-fix`, `*-hardening`, `*-legacy`, `*-compat`, or `*-redesign` feature files.
- Split files only by stable responsibility (data, filtering, rendering, preview, i18n, detail, reusable components), never by design iteration.

## Global App Shell is fixed

Page features do not own the global framework.

Shared shell owns the ONDesign brand, primary navigation, Library menu, external social/GitHub links, Start Designing entry, language switch, header geometry/states/responsiveness, footer styling and global design tokens.

Canonical shell files:

- `src/core/app-shell/site-shell.css` — one shared stylesheet entry for public-page chrome.
- `src/core/app-shell/app-shell.js` — one global navigation/runtime source.
- `src/components/site-header/site-header.css` — shared header/nav implementation.
- `src/components/site-header/site-footer.css` — shared footer implementation.

Rules:

- Every full public page loads `site-shell.css` exactly once and `app-shell.js` exactly once.
- Every full public page uses `<image2-site-header data-site-header></image2-site-header>`; never hand-write a page-specific global nav.
- Individual pages must not directly load `design-tokens.css`, `language-switch.css`, `site-header.css`, or `site-footer.css`.
- Feature CSS under `src/features/**` must not style `.site-header`, `.site-nav`, `.site-brand`, `.global-language-switch`, `.site-footer`, or `image2-site-header`.
- Feature JS must not render or reorder global navigation.
- If global navigation changes, change the shared shell once so every page changes together.
- If the user asks to redesign one page, do not change the shared header/nav/footer unless they explicitly ask for a global framework change.
- Avoid inline `<style>` patches for accepted page designs; merge accepted styling into the canonical feature stylesheet.

## Scope and context

- Work only in the requested public page, its direct feature implementation, and shared dependencies genuinely required by the task.
- Search exact selectors, functions, slugs, ids, or domains before opening large files.
- Do not recursively scan the repository for a local page change.
- Root HTML files are deployed URL entries; keep implementation JS/CSS/MJS under `src/`.
- Skip `demo/**`, `scripts/**`, `.github/**`, generated reports, screenshots and binary media unless the task specifically needs them.
- Treat text files over 30 KB as context hotspots; search first and read the smallest relevant range.
- Avoid reading an entire file over 50 KB when a targeted range is enough.
- Do not read or edit generated `catalog/index.js` for normal catalog work.

## Canonical feature map

- Home: `learn.html` -> `src/features/home/home.css` + `src/features/home/home.js`. `index.html` only redirects.
- Info: `about.html`, `contact.html`, `privacy.html` -> `src/features/info/info.css`.
- Vocabulary: `vocabulary.html` -> `src/features/vocabulary/vocabulary.js`, `vocabulary.css`, category data under `src/features/vocabulary/data/`, and stable responsibility modules beside them.
- Skills: `skills.html` -> `skills.css`, `skills.js`, `skills-data.js`, `skills-web-data.js`, `skills-filter.js`, `skills-render.js`, `skills-design-systems.js`; `skill-detail.html` -> `skill-detail.js` + `skill-detail.css`.
- Library: `library.html` -> `library.js`, `library.css`, `library-cards.css`, `library-detail.css` plus data/filter/card/detail/search/preview/runtime responsibility modules.
- Launcher: `launcher.html` -> `launcher-dna.css` + `launcher-dna.js`; other Launcher modules are allowed only for distinct stable responsibilities, never alternate Launcher versions.
- Brands: `brands.html` -> `src/features/brands/brands.css` + `brands.js`.
- Catalog: edit source JSON under `catalog/cases`, `catalog/styles`, `catalog/brands`, `catalog/components`; `catalog/index.js` is generated.

## Skills responsibility map

- Add/edit a Skill repository: `skills-data.js`.
- Add/edit a design-reference website: `skills-web-data.js`.
- Filtering/sorting/source-code filter: `skills-filter.js`.
- Card/filter/Web-group/inspector markup: `skills-render.js`.
- Runtime state, URL sync, GitHub stats, clipboard/event wiring: `skills.js`.
- Styling: search the exact selector in `skills.css`.
- Skill detail behavior/styling: `skill-detail.js` / `skill-detail.css`.
- Preserve `window.image2SkillsCatalog`, `SKILL` + `WEB` modes, source-code filtering and URL state unless the requested product change explicitly replaces them.

## Repository cleanliness

- Do not keep one-shot migration scripts, temporary workflows, screenshots, process notes, benchmark dumps or abandoned experiments after completion.
- Do not embed image binaries as base64 in HTML, CSS or JS.
- Do not recreate deleted `docs/**`, `references/**`, `tests/**`, `lab/**`, `src/legacy/**`, feature `legacy/**`, Launcher workspace/state/url/hardening layers, or retired Library fix/override/redesign layers.

## Validation

- Run `npm run build:catalog -- --check` when catalog/source data changes.
- Run `npm run check` for public paths, shared shell contract and canonical feature naming.
- Keep CI green before completing structural work.
