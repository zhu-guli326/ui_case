# ONDesign

Public source for <https://www.ondesign.tech/>.

- Root `*.html` files are deployed page routes.
- `src/` contains page and shared UI implementation.
- `assets/` contains site media.
- `catalog/` contains structured site data; `catalog/index.js` is generated.
- `demo/` contains runnable cases used by the Library.

## Required design system

**Every new public page, component, feature surface, and future visual refactor must follow the ONDesign global design system.**

- Canonical tokens: `src/core/app-shell/design-tokens.css`
- Design rules and new-page checklist: `docs/DESIGN_SYSTEM.md`
- New code should consume the canonical `--ds-*` tokens directly.
- Do not introduce a second page-level palette, spacing scale, radius system, control-height system, shadow system, or typography scale.
- Chinese pages follow Ant Design hierarchy/density with ONDesign green as the primary brand color.
- English pages use the same component geometry and tokens; language-specific differences are limited primarily to typography/density.

Local preview: `npm run dev`

Validation: `npm run guard:repo && npm run check && npm test`