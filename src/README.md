# Source architecture

`src/` contains reusable implementation code. Root-level HTML files remain stable public entry points for GitHub Pages.

## Layers

- `core/` — cross-page runtime, state, analytics, i18n, routing.
- `components/` — reusable UI primitives with one owner and one visual contract.
- `features/` — page/domain implementation grouped by capability (`library`, `launcher`, `skills`, `markdown`, etc.).
- `styles/` — shared design tokens, resets, layout primitives and utilities.

## Rules

1. Root is for public HTML entry points and repository metadata only.
2. New page-specific CSS/JS belongs in `src/features/<feature>/`.
3. Shared UI belongs in `src/components/<component>/`; do not copy component CSS into pages.
4. Shared behavior belongs in `src/core/`; feature code may depend on core/components, not the reverse.
5. `catalog/` is data/domain content, `demo/` is runnable case content, `assets/` is media, and `scripts/` / `tests/` are tooling.
6. Existing public URLs such as `/library.html` and `/launcher.html` must remain stable during refactors.
