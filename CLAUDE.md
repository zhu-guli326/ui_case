# Claude Code Repository Rules

- Work only in the requested page or feature and its direct dependencies.
- Search exact selectors, functions, slugs, ids, or domains before opening source files.
- Do not recursively scan the repository unless the task requires it.
- Do not read `artifacts/**`, screenshot outputs, generated reports, patches, build output, or binary media by default.
- Avoid reading an entire file over 50 KB when a targeted range or exact search is enough.
- Do not create `*-fixes`, `*-overrides`, `*-hardening`, or temporary compatibility layers for normal feature changes.
- Modify the canonical implementation instead and remove obsolete code when safe.
- Never embed image binaries as base64 in HTML, CSS, or JavaScript.

## Hot features

- Skills: follow `src/features/skills/AGENTS.md`. Use `skills-data.js`, `skills-web-data.js`, `skills-filter.js`, `skills-render.js`, and the small `skills.js` runtime according to the requested responsibility.
- Launcher: production code is `src/features/launcher/launcher-dna.css` and `launcher-dna.js` plus direct shared imports.
- Library: root `library.js` is the page runtime; use `src/features/library/library-data.js`, `library-filter.js`, `library-card.js`, `library-detail.js`, `library-runtime.js`, and the existing detail enhancer by responsibility. Do not recreate retired fix layers.
- Vocabulary: follow `src/features/vocabulary/AGENTS.md`. CSS production entry is split into `styles/cards.css`, `styles/flip-card.css`, `styles/detail.css`, and `styles/responsive.css`; locate the exact selector before opening fragments.
- Catalog: follow `catalog/AGENTS.md`. `catalog/index.js` is a generated runtime bundle (~232 KB); do not read or edit it for normal catalog work. Edit the matching source JSON under `catalog/cases`, `catalog/styles`, `catalog/brands`, or `catalog/components`.
