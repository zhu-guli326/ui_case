# UI Case Gallery

`ui_case` is the visual case library for [image2_UI_skill](https://github.com/zhu-guli326/image2_UI_skill). It owns the browsable case catalog, UI vocabulary, design-system explorer, clickable demos, screenshots, generated assets, and preview videos.

Open the published gallery:

<https://zhu-guli326.github.io/ui_case/>

## Repository map

- Root HTML files are stable GitHub Pages entry points only.
- [`src/`](./src/) contains implementation code, split into `core`, `components`, `features`, and shared `styles`.
- [`catalog/`](./catalog/) contains structured case / brand / design-system data.
- [`demo/`](./demo/) contains runnable UI cases.
- [`assets/`](./assets/) and [`references/`](./references/) contain media and source references.
- [`scripts/`](./scripts/) and [`tests/`](./tests/) contain tooling and contracts.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) defines the reuse boundaries and migration rules.

### Implementation layers

```text
src/
├─ core/          shared runtime, state, localization, analytics
├─ components/    reusable UI with one owner (DevicePreview, SiteHeader)
└─ features/      page/domain implementation (Library, Launcher, Brands, etc.)
```

New page implementation must not be added to the repository root. A regression test enforces the temporary migration allowlist while the remaining large legacy modules are moved incrementally.

## Local preview

```bash
node scripts/serve_site.mjs
```

Then open <http://127.0.0.1:4174/library.html?lang=zh>.

## Validate

```bash
npm test
npm run check
```

The site contract verifies that all 23 cases load from the catalog, every style and design-system association resolves, and every local poster, reference, video, and demo entry exists.

## Repository split

- This repository owns the gallery pages, case data, brand profiles, design-system lab, demos, and media.
- [`image2_UI_skill`](https://github.com/zhu-guli326/image2_UI_skill) owns the installable Skill, CLI, generation workflow, and validation scripts.
- The two repositories link through the public GitHub Pages URL and the versioned catalog in [`catalog/index.js`](./catalog/index.js).
