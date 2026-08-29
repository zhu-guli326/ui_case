# Vocabulary agent rules

The production page is `vocabulary.html`.

## Read scope

- Start from `vocabulary.html`, `vocabulary.js`, and the exact selector/function named by the task.
- `vocabulary.css` is the small stylesheet entry point.
- The canonical style boundaries are `styles/cards.css`, `styles/flip-card.css`, `styles/detail.css`, and `styles/responsive.css`. Read the matching boundary first, then only the imported slice that contains the selector you need.
- Do not scan `assets/`, generated screenshots, videos, or unrelated demos unless the task explicitly needs them.

## Editing rules

- Preserve the current visual result unless the task explicitly asks for a redesign.
- Do not create `*-fix`, `*-override`, `*-patch`, or `*-hardening` files.
- Do not reintroduce a monolithic `legacy/` stylesheet.
- Keep source-order authority clear: edit the canonical responsibility that owns the selector instead of appending a late override.
- Before changing a selector, search for all occurrences of that selector so older declarations are not accidentally left authoritative.
- Keep flip-card behavior, detail dialogs, bilingual layout, and mobile breakpoints intact unless the task specifically changes them.
- Never embed base64 images in CSS, HTML, or JS.
