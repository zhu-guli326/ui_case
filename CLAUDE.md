# Claude Code Repository Rules

- Work only in the requested public page and its direct dependencies under `src/`.
- Search exact selectors, functions, slugs, ids, or domains before opening source files.
- Do not recursively scan the repository unless the task requires it.
- Avoid screenshot outputs, generated reports, patches, build output, binary media, and `references/ui-reference-benchmark/**` unless explicitly relevant.
- Avoid reading an entire file over 50 KB when a targeted range or exact search is enough.
- Do not create `*-fixes`, `*-overrides`, `*-hardening`, or temporary compatibility layers for normal feature changes.
- Modify the canonical implementation instead and remove obsolete code when safe.
- Never embed image binaries as base64 in HTML, CSS, or JavaScript.
- Root HTML files are deployed URL entry points. Do not place implementation JS/CSS/MJS at repository root.

## Deleted architectures — do not search or recreate

- root `library.js`, `vocabulary.js`, `learn.js`, `launcher.js`, `i18n.js`, root CSS/JS/MJS compatibility files
- `src/features/learn/**`
- `src/legacy/**`
- Launcher workspace / entry / hardening / simplified / state / URL layers
- retired Library fix/quality/density compatibility layers
- Vocabulary legacy runtime CSS and root compatibility entries

## Hot features

- Home / Learn URL: `learn.html` is the public shell. Current implementation is `src/features/home/squarespace-home.css` and `src/features/home/editorial-home.js`.
- Skills: follow `src/features/skills/AGENTS.md`. Use `skills-data.js`, `skills-web-data.js`, `skills-filter.js`, `skills-render.js`, and the small `skills.js` runtime according to responsibility.
- Launcher: read `src/features/launcher/README.md`. Production code is only `launcher-dna.css` and `launcher-dna.js` plus direct shared imports.
- Library: production runtime is `src/features/library/library.js`; use `library-data.js`, `library-filter.js`, `library-card.js`, `library-detail.js`, `library-runtime.js`, and the existing detail enhancer by responsibility.
- Vocabulary: follow `src/features/vocabulary/AGENTS.md`. Runtime is `src/features/vocabulary/vocabulary.js`; CSS production entry is split into `styles/cards.css`, `styles/flip-card.css`, `styles/detail.css`, and `styles/responsive.css`.
- Catalog: follow `catalog/AGENTS.md`. `catalog/index.js` is a generated runtime bundle; do not read or edit it for normal catalog work. Edit matching source JSON under `catalog/cases`, `catalog/styles`, `catalog/brands`, or `catalog/components`.
