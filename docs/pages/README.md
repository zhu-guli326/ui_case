# ONDesign Page Requirement Documents

This directory is the durable product context for individual public pages.

## Mandatory workflow

Before changing a public page:

1. Read root `AGENTS.md`.
2. Resolve the public route through `docs/pages/manifest.json`.
3. Read that page's requirement document before editing code.
4. Check the new request against the page goal, core user task, core functions, information structure, interaction rules, keep/remove rules and modification boundary.
5. If the request changes the page responsibility, interaction contract or product boundary, update the page requirement document before considering the code change complete.
6. Then modify only the canonical implementation listed in `AGENTS.md` and the page document.
7. Run `npm run check` before finishing.

When the current conversation has little or no page context, **do not infer the whole page from a screenshot or a short instruction**. Read the matching requirement document first.

## One page, one document

Do not merge multiple public product pages into a single requirements file. Even pages sharing CSS or navigation must keep independent product documents when their user purpose differs.

`manifest.json` is the single machine-readable route-to-document index. It contains only routing metadata; it is not a combined requirement document.

- Each full public product page must appear once under `pages`.
- Each `pages` entry must point to a unique Markdown requirement document.
- Redirect-only entries belong under `redirects` and point to the owning public product page.
- `index.html` currently redirects to `learn.html`, so its product responsibility belongs to `learn.md` rather than a duplicate document.
- When adding or removing a public page, update `manifest.json` in the same change.

Do not maintain a second hand-written route list here. The manifest is authoritative so the mapping cannot drift between documentation and validation code.

## Required sections for page documents

Every page requirement document must contain these sections:

- `Page identity`
- `Page goal`
- `Core user task`
- `Core functions`
- `Information structure`
- `Interaction rules`
- `Keep`
- `Remove / avoid`
- `Modification boundary`

Each page document must also include:

- `Last updated: YYYY-MM-DD`
- the exact public route in `Page identity`
- a canonical implementation / runtime / shared implementation reference so the Agent knows where to start reading code

`npm run check` validates the route coverage, one-page-one-document mapping and required document structure.

## When to update a page document

Update the requirement document when a change alters any durable product decision, including:

- page purpose or target user task
- core functions
- information hierarchy
- interaction rules or state model
- what the page should keep or remove
- responsibility boundaries with another page
- canonical implementation ownership

Do **not** create documentation churn for a purely cosmetic tweak that leaves all of those decisions unchanged. The document describes the current intended product contract, not every CSS adjustment.

## New page protocol

A new public product page is incomplete until all of the following exist in the same change:

1. Public route / entry.
2. Independent requirement document under `docs/pages/`.
3. Route mapping in `docs/pages/manifest.json`.
4. Canonical implementation ownership in `AGENTS.md` when the page introduces a new feature responsibility.
5. Passing `npm run check`.

The documents describe the current intended product, not historical versions. Git history remains the archive for old requirements and old implementations.
