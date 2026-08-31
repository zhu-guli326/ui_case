# ONDesign Page Requirement Documents

This directory is the durable product context for individual public pages.

## Mandatory workflow

Before changing a public page:

1. Read root `AGENTS.md`.
2. Read this page's requirement document in `docs/pages/`.
3. Check the new request against the page goal, core functions, information structure, interaction rules and modification boundary.
4. If the request changes the page responsibility or boundary, update the page requirement document before considering the code change complete.
5. Then modify only the canonical implementation listed in `AGENTS.md`.

When the current conversation has little or no page context, **do not infer the whole page from a screenshot or a short instruction**. Read the matching requirement document first.

## One page, one document

Do not merge multiple pages into a single requirements file. Even pages sharing CSS or navigation must keep independent product documents when their user purpose differs.

Current documents:

- `learn.md` → `learn.html` (Home / Learn landing page)
- `vocabulary.md` → `vocabulary.html`
- `skills.md` → `skills.html`
- `skill-detail.md` → `skill-detail.html`
- `library.md` → `library.html`
- `launcher.md` → `launcher.html`
- `brands.md` → `brands.html`
- `about.md` → `about.html`
- `contact.md` → `contact.html`
- `privacy.md` → `privacy.html`

`index.html` is only a redirect to `learn.html`, so its product responsibility belongs to `learn.md` rather than a duplicate document.

## Required sections for page documents

Each page document should keep these sections current:

- Page identity / route
- Page goal
- Core user task
- Core functions
- Information structure
- Interaction rules
- Keep / remove rules
- Modification boundary
- Canonical implementation references
- Open decisions, if any

The documents describe the current intended product, not historical versions. Git history remains the archive for old requirements and old implementations.
