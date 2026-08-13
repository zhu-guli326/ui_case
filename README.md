# UI Case Gallery

`ui_case` is the visual case library for [image2_UI_skill](https://github.com/zhu-guli326/image2_UI_skill). It contains the browsable case catalog, brand profiles, clickable demos, screenshots, generated assets, and preview videos.

Open the published gallery:

<https://zhu-guli326.github.io/ui_case/>

## Local preview

```bash
python3 -m http.server 4173
```

Then open <http://127.0.0.1:4173/>.

## Validate

```bash
npm test
npm run check
```

The site contract verifies that all 23 cases load from the catalog, every brand association resolves, and every local poster, reference, video, and demo entry exists.

## Repository split

- This repository owns the gallery, case data, brand profiles, demos, and media.
- [`image2_UI_skill`](https://github.com/zhu-guli326/image2_UI_skill) owns the installable Skill, CLI, generation workflow, and validation scripts.
- The two repositories link through the public GitHub Pages URL and the versioned catalog in [`catalog/index.js`](./catalog/index.js).
