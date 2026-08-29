# Agent Scope Rules

## Default scope
- Work only in the requested page or feature and its direct imports.
- Use targeted search before opening files; do not recursively scan the whole repository unless required.
- Prefer reading the smallest relevant code range first.

## Do not load by default
- `artifacts/**`
- `screenshots/**`
- `demo/**/screenshots/**`
- generated audit, compare, patch, coverage, build, and cache outputs
- binary media such as `*.png`, `*.jpg`, `*.jpeg`, `*.webp`, `*.gif`, `*.mp4`
- `node_modules/**`, `dist/**`, `build/**`, `coverage/**`
- generated `catalog/index.js` unless validating build output

## Generated visual artifacts
- Keep screenshot and audit outputs untracked.
- Keep generated `artifacts/*.png` and provenance files untracked.
- Never embed image binaries as base64 in HTML, JS, or CSS.
- Reference normal asset paths instead.

## Refactoring
- Modify canonical implementation files instead of adding new `*-fixes`, `*-overrides`, or `*-hardening` layers.
- When a patch supersedes an old rule, merge it into the canonical implementation and remove obsolete rules when safe.

## Context efficiency
- Avoid opening entire files over 50 KB unless necessary.
- For CSS, locate relevant selectors before reading full stylesheets.
- For JS, locate relevant exports, handlers, data, or render functions before reading full modules.
- For catalog changes, edit the exact source JSON under `catalog/cases`, `catalog/styles`, `catalog/brands`, or `catalog/components`; do not inspect the 232KB generated bundle.

## Main feature locations
- Vocabulary: `src/features/vocabulary/` — follow its local `AGENTS.md`; CSS is split into cards / flip-card / detail / responsive entries.
- Skills: `src/features/skills/` — follow its local `AGENTS.md`; data, web data, filters, rendering, and runtime are separate modules.
- Library: root `library.js` plus `src/features/library/` responsibility modules.
- Launcher: `src/features/launcher/launcher-dna.css` and `launcher-dna.js`.
- Catalog: `catalog/` — follow `catalog/AGENTS.md`; `catalog/index.js` is generated output.
