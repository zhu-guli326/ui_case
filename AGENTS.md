# Agent Scope Rules

## Default scope
- Work only in the requested public page and its direct implementation under `src/`.
- Use targeted search before opening files; do not recursively scan the whole repository unless required.
- Prefer the smallest relevant code range first.
- Root HTML files are public URL entry points, not implementation locations.

## Do not load by default
- `demo/**` unless the task names that demo or case.
- `scripts/**`, `tests/**`, and `.github/**` unless the task is specifically about tooling, QA, or CI.
- generated audit, compare, patch, coverage, build, cache, and screenshot outputs.
- binary media such as `*.png`, `*.jpg`, `*.jpeg`, `*.webp`, `*.gif`, `*.mp4`.
- `node_modules/**`, `dist/**`, `build/**`, `coverage/**`.
- generated `catalog/index.js` unless validating build output.

## Never search for retired implementations
The following architectures are deleted and must not be recreated or searched as fallback sources:
- root implementation files such as `library.js`, `vocabulary.js`, `learn.js`, `launcher.js`, `i18n.js`, or root CSS/JS/MJS.
- `docs/**`, `references/**`, `src/features/learn/**`, `src/legacy/**`, and any feature `legacy/**` folder.
- Launcher workspace / entry / hardening / simplified / state / URL compatibility layers.
- historical Library `*-fixes`, density-fix, quality-fix, override, redesign, and compatibility entries.
- Vocabulary legacy runtime CSS and root compatibility entries.

## Generated visual artifacts
- Keep screenshot and audit outputs untracked.
- Never embed image binaries as base64 in HTML, JS, or CSS.
- Reference normal asset paths instead.

## Refactoring
- Modify canonical implementation files instead of adding `*-fixes`, `*-overrides`, `*-hardening`, or compatibility wrappers.
- When a patch supersedes an old rule, merge it into the canonical implementation and remove obsolete rules when safe.

## Context efficiency
- Treat every tracked text file over 30 KB as a context hotspot: search first, then read only the relevant range.
- Avoid opening an entire file over 50 KB unless the task genuinely requires the whole file.
- For CSS, locate the relevant selector before reading the full stylesheet.
- For JS, locate relevant exports, handlers, data, or render functions before reading full modules.
- For catalog changes, edit the exact source JSON under `catalog/cases`, `catalog/styles`, `catalog/brands`, or `catalog/components`; do not inspect the generated catalog bundle by default.
- Run `npm run audit:tokens` to list current >30KB / >50KB / >100KB text hotspots.
- Run `npm run guard:repo` before pushing repository-structure changes.

## Canonical feature locations
- Home / Learn URL: `learn.html` is the public page; implementation is `src/features/home/squarespace-home.css` + `src/features/home/editorial-home.js`.
- Vocabulary: `src/features/vocabulary/` — follow its local `AGENTS.md`; runtime is `vocabulary.js`; CSS is split into cards / flip-card / detail / responsive entries.
- Skills: `src/features/skills/` — follow its local `AGENTS.md`; data, web data, filters, rendering, and runtime are separate modules.
- Library: `src/features/library/library.js` plus responsibility modules in the same folder; `library.html` is only the public entry shell.
- Launcher: `src/features/launcher/` contains the canonical launcher modules; read its `README.md` first for architecture rules.
- Catalog: `catalog/` — follow `catalog/AGENTS.md`; `catalog/index.js` is generated output.

## Root contract
- Keep implementation JavaScript, CSS, and MJS out of the repository root.
- Keep root public HTML filenames stable because they are deployed URLs.
