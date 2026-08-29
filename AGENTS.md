# ONDesign Agent Development Rules

This file is the single source of truth for AI-assisted website development in this repository. Read it before changing the site.

## 1. Core rule: replace, do not accumulate

`main` contains only the current production version of ONDesign. Git history is the archive and rollback mechanism.

When the user asks to modify, redesign, replace, optimize, restructure, or update an existing page or feature, treat the request as a **replacement of the current implementation by default**, not as permission to keep another version beside it.

Required behavior:

- Identify the current canonical HTML/CSS/JS/data implementation first.
- Modify the canonical files in place whenever the responsibility is unchanged.
- If the new implementation supersedes old code, delete the old code in the same change.
- Delete obsolete selectors, functions, DOM blocks, data fields, modules, assets, imports and event handlers once the replacement is active.
- Delete files that become unused after the replacement.
- Remove old references from HTML, JS, CSS, manifests, tests/checks and generated inputs.
- If code moves into a better stable responsibility module, migrate it and delete the old location in the same change.
- Never keep the previous design as commented code, hidden DOM, `display:none`, disabled feature flags, fallback branches, compatibility bridges, backup constants or unused assets just in case.
- Do not create parallel files such as `*-v2`, `*-v3`, `*-new`, `*-old`, `*-backup`, `*-final`, `*-reference-layout`, `*-override`, `*-fix`, `*-hardening`, `*-legacy`, `*-compat` or `*-redesign`.
- A reference website or screenshot is guidance for replacing the current design, not a reason to preserve both designs in source.
- If the user explicitly asks for two persistent product variants, then two implementations may exist; otherwise assume there should be only one.

### Replacement completion checklist

Before considering a requested replacement complete:

1. Confirm the new implementation is wired to the public route.
2. Search for the superseded selector/function/file/import/asset names.
3. Remove dead code and dead files revealed by that search.
4. Remove temporary migration scripts or workflows used only to perform the change.
5. Run the relevant repository checks.
6. Confirm the working tree represents only the current product, while the previous version exists only in Git history.

## 2. Global framework / App Shell contract

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

## 3. Single Source of Truth

- Each public page has one current production implementation on `main`.
- Split files only by stable responsibility such as data, filtering, rendering, preview, i18n, detail or reusable components — never by design iteration.
- Avoid inline page `<style>` patches for normal feature work. Put accepted styles into the canonical feature stylesheet.
- Do not introduce a compatibility layer merely to avoid updating callers. Update callers and remove the obsolete interface when the product no longer needs it.
- Do not keep duplicate data in an override file when the canonical source can be corrected instead.

## 4. Default development workflow

For every website change:

1. Read this file.
2. Identify the public route and canonical feature files from the map below.
3. Search the exact selector, function, id, slug or domain involved before reading large files.
4. Edit only the current implementation and genuinely shared dependencies.
5. Replace old implementation rather than layering on top of it.
6. Delete superseded code/files/assets immediately after the new implementation is connected.
7. Run targeted checks.
8. Re-scan for stale version files, old imports, dead references and temporary tooling.

## 5. Default scope

- Work only in the requested public page, its direct feature implementation, and shared dependencies that are genuinely required.
- Search exact selectors, functions, slugs, ids, or domains before opening large files.
- Do not recursively scan the repository for a local page change.
- Root HTML files are deployed URL entries, not implementation locations.
- Do not add root JS/CSS/MJS implementations.

## 6. Do not load by default

- `demo/**` unless the task names that demo or case.
- `scripts/**` and `.github/**` unless the task concerns build, deployment, repository structure or CI.
- generated reports, audit output, screenshots, caches or temporary migration files.
- binary media (`*.png`, `*.jpg`, `*.jpeg`, `*.webp`, `*.gif`, `*.mp4`) unless the visual asset itself is the task.
- generated `catalog/index.js` unless validating the catalog build.

## 7. Context efficiency

- Treat tracked text files over 30 KB as context hotspots: search first and read only the relevant range.
- Avoid reading an entire file over 50 KB unless the task requires the full file.
- For CSS, locate the relevant selector first.
- For JS, locate the relevant export, handler, data object or renderer first.
- For catalog changes, edit exact source JSON under `catalog/cases`, `catalog/styles`, `catalog/brands` or `catalog/components`; do not edit generated `catalog/index.js` directly.

## 8. Current canonical feature map

### Home

- Public URL: `learn.html` (`index.html` only redirects to it).
- CSS: `src/features/home/home.css`.
- JS: `src/features/home/home.js`.
- Do not create alternate Home styles or runtimes.

### Info pages

- `about.html`, `contact.html`, `privacy.html` share `src/features/info/info.css`.
- These pages use the same global App Shell as every other full page.

### Vocabulary

- Public URL: `vocabulary.html`.
- Runtime: `src/features/vocabulary/vocabulary.js`.
- Main CSS entry: `src/features/vocabulary/vocabulary.css` plus responsibility styles under `src/features/vocabulary/styles/`.
- Data is split under `src/features/vocabulary/data/`; edit the category-specific module, not the whole data set.
- `vocabulary-i18n.js` owns Vocabulary page translations.
- `vocabulary-navigation-data.js` owns navigation deep-dive data.
- `vocabulary-card-config.js` owns card variants and media configuration.
- `vocabulary-preview.js` owns preview orchestration; `vocabulary-preview-media.js` owns preview media configuration.
- `vocabulary-component-data.js` and `vocabulary-search.mjs` are responsibility modules, not alternate versions.

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
- Other Launcher files are allowed only when they own a distinct stable responsibility, not another Launcher version.
- Do not recreate workspace/state/url/hardening/simplified compatibility architectures.

### Brands

- Public URL: `brands.html`.
- Canonical implementation: `src/features/brands/brands.css` and `src/features/brands/brands.js`.

### Catalog

- Source data: `catalog/cases/*.json`, `catalog/styles/*.json`, `catalog/brands/*.json`, `catalog/components/*.json`.
- `catalog/index.js` is generated output; do not hand-edit it.

## 9. Repository cleanliness

The repository should contain product source and durable development infrastructure, not development history.

- Git history is the only default archive for replaced source.
- Do not keep one-shot migration scripts, temporary workflows, screenshots, process notes, benchmark dumps or abandoned experiments after a migration is complete.
- Do not keep source files whose only purpose is to preserve how the site used to work.
- Do not keep unused visual assets after their last production reference has been removed.
- Do not embed image binaries as base64 in HTML, CSS or JS.
- Do not recreate deleted `docs/**`, `references/**`, `tests/**`, `lab/**`, `src/legacy/**`, or feature `legacy/**` process structures unless the user explicitly requests a new product feature that genuinely needs them.
- Do not create extra agent documentation under feature folders. Update this root `AGENTS.md` instead.

## 10. Validation

For normal repository changes, use the current lightweight checks:

- `npm run build:catalog -- --check` when catalog/source data is affected.
- `npm run check` for public paths, shared shell contract and canonical feature naming.
- Keep CI green before considering a structural refactor complete.

## 11. Final self-check for the Agent

Before reporting a website update as complete, answer these questions internally:

- Did I change the canonical implementation rather than create a second version?
- Is any part of the old implementation still present only because I was afraid to delete it?
- Are there stale imports, selectors, event handlers, data fields or media references left behind?
- Did I leave a temporary migration workflow/script or compatibility bridge?
- Did I accidentally modify the global App Shell for a page-only request?
- Does the public route load the new implementation and only the new implementation?
- Can every old production version now be recovered from Git history instead of the current source tree?

If any answer indicates leftover historical source, clean it up before finishing.

## Cache and inline-style hygiene

- Do not append hand-maintained local asset query versions such as `?v=20260830`, `?v=v2`, or descriptive migration tags. Normal static delivery relies on HTTP cache validators; if immutable hashed assets are introduced later, they must come from a real build step rather than manual HTML edits.
- Accepted page CSS must live in the canonical feature stylesheet. Do not leave normal production styling in inline `<style>` blocks as a patch layer.
- A refactor that reduces an AI context hotspot should split by stable responsibility and keep orchestration entry files below roughly 50 KB when practical.
