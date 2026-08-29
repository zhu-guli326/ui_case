# Skills Feature Agent Rules

## File map

- `skills-data.js` — Skill catalog, translations, category labels, visual copy and official URLs.
- `skills-web-data.js` — design-reference website groups and website catalog.
- `skills-filter.js` — pure filtering, source-code filtering and sorting helpers.
- `skills-render.js` — DOM rendering for filters, Skill cards, Web cards and the inspector.
- `skills.js` — runtime state, URL sync, media helpers, clipboard, GitHub stats and event wiring.
- `skills.css` — current Skills page styling.
- `skill-detail.js` / `skill-detail.css` — Skill detail page only.

## Read by task

- Add or edit a Skill repository: open `skills-data.js` and search the exact repository slug.
- Add or edit a design website: open `skills-web-data.js` and search the exact domain.
- Change Skill or Web filtering/sorting: open `skills-filter.js` first.
- Change filter, card, Web-group or inspector markup: open `skills-render.js` first.
- Change URL state, language runtime, GitHub Stars syncing or event wiring: open `skills.js` first.
- Change translations, category labels, visual captions or official URLs: open `skills-data.js`.
- Change visual styling: search the exact selector in `skills.css`; do not read JS catalog files unless data fields must change.
- Change Skill detail behavior: use `skill-detail.js` / `skill-detail.css`; do not read the directory runtime unless the contract changes.

## Scope rules

- Use an exact slug, domain, selector or function search before opening a whole file.
- Do not recursively read the whole Skills feature for a local change.
- Do not create `skills-fixes.*`, `skills-overrides.*`, `skills-hardening.*` or other patch layers.
- Put new Skill data in `skills-data.js`, not `skills.js`.
- Put new Web reference data in `skills-web-data.js`, not `skills.js`.
- Keep pure filter/sort logic in `skills-filter.js` and DOM rendering in `skills-render.js`.
- Preserve `window.image2SkillsCatalog` compatibility because the detail page consumes the catalog.
- Preserve both `SKILL` and `WEB` directory modes, source-code filtering and URL state.
- Keep `skills.html` loading `skills.js` as `type="module"`.
