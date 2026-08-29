# ONDesign

Public source for <https://www.ondesign.tech/>.

- Root `*.html` files are deployed page routes.
- `src/` contains page and shared UI implementation.
- `assets/` contains site media.
- `catalog/` contains structured site data; `catalog/index.js` is generated.
- `demo/` contains runnable cases used by the Library.

Local preview: `npm run dev`

Validation: `npm run guard:repo && npm run check && npm test`
