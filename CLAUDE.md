# Claude Code Repository Rules

- Work only in the requested page or feature and its direct dependencies.
- Search exact selectors, functions, slugs, or domains before opening source files.
- Do not recursively scan the repository unless the task requires it.
- Do not read `artifacts/**`, screenshot outputs, generated reports, patches, build output, or binary media by default.
- Avoid reading an entire file over 50 KB when a targeted range or exact search is enough.
- Do not create `*-fixes`, `*-overrides`, `*-hardening`, or temporary compatibility layers for normal feature changes.
- Modify the canonical implementation instead and remove obsolete code when safe.
- Never embed image binaries as base64 in HTML, CSS, or JavaScript.

## Hot features

- Skills: follow `src/features/skills/AGENTS.md`; `skills.js` is a large legacy entry, so use targeted searches.
- Launcher: production code is only `src/features/launcher/launcher-dna.css` and `launcher-dna.js` plus their direct shared imports.
- Library: use `library.css`, `library-cards.css`, `library-runtime.js`, and the detail modules; do not recreate retired fix layers.
- Vocabulary: locate the exact selector/component before reading `src/features/vocabulary/vocabulary.css` in full.
