# Claude Code Repository Rules

- Work only in the requested public page and its direct dependencies under `src/`.
- Search exact selectors, functions, slugs, ids, or domains before opening source files.
- Do not recursively scan the repository unless the task requires it.
- Skip `demo/**` unless the requested task names that demo or case.
- Skip `scripts/**`, `tests/**`, `.github/**`, generated reports, screenshots, build output, and binary media unless the task specifically needs tooling or QA context.
- Treat every text file over 30 KB as a context hotspot: search first and read the smallest relevant range.
- Avoid reading an entire file over 50 KB when a targeted range or exact search is enough.
- Do not create `*-fixes`, `*-overrides`, `*-hardening`, or temporary compatibility layers for normal feature changes.
- Modify the canonical implementation instead and remove obsolete code when safe.
- Never embed image binaries as base64 in HTML, CSS, or JavaScript.
- Root HTML files are deployed URL entry points. Do not place implementation JS/CSS/MJS at repository root.
- Run `npm run audit:tokens` for the current >30KB / >50KB / >100KB context hotspots and `npm run guard:repo` before repository-structure changes.

## Deleted architectures — do not search or recreate

- root `library.js`, `vocabulary.js`, `learn.js`, `launcher.js`, `i18n.js`, root CSS/JS/MJS compatibility files.
- `docs/**`, `references/**`, `src/features/learn/**`, `src/legacy/**`, and feature `legacy/**` folders.
- Launcher workspace / entry / hardening / simplified / state / URL compatibility layers.
- retired Library fix/quality/density/override/redesign compatibility layers.
- Vocabulary legacy runtime CSS and root compatibility entries.

## Hot features

- Home / Learn URL: `learn.html` is the public shell. Current implementation is `src/features/home/squarespace-home.css` and `src/features/home/editorial-home.js`.
- Skills: follow `src/features/skills/AGENTS.md`. Use `skills-data.js`, `skills-web-data.js`, `skills-filter.js`, `skills-render.js`, and the small `skills.js` runtime according to responsibility.
- Launcher: read `src/features/launcher/README.md`; use the canonical modules in `src/features/launcher/` rather than creating patch layers.
- Library: production runtime is `src/features/library/library.js`; use `library-data.js`, `library-filter.js`, `library-card.js`, `library-detail.js`, and `library-runtime.js` by responsibility.
- Vocabulary: follow `src/features/vocabulary/AGENTS.md`. Runtime is `src/features/vocabulary/vocabulary.js`; CSS production entry is split into `styles/cards.css`, `styles/flip-card.css`, `styles/detail.css`, and `styles/responsive.css`.
- Catalog: follow `catalog/AGENTS.md`. `catalog/index.js` is a generated runtime bundle; do not read or edit it for normal catalog work. Edit matching source JSON under `catalog/cases`, `catalog/styles`, `catalog/brands`, or `catalog/components`.

## Single Source of Truth

- Each public page has one current production implementation on `main`. Git history is the archive.
- Never create parallel page versions such as `*-v2`, `*-final`, `*-reference-layout`, `*-override`, `*-fix`, `*-legacy`, or `*-redesign` under `src/features/`.
- When a redesign is accepted, merge it into the canonical page CSS/JS and delete the superseded implementation in the same change.
- Split files only by stable responsibility (data, filtering, rendering, preview, i18n, detail), never by design iteration.
