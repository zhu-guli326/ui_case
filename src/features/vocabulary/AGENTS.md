# Vocabulary agent rules

The production page is `vocabulary.html`.

## Read scope

- Start from `vocabulary.html`, `vocabulary.js`, and the exact selector/function named by the task.
- `vocabulary.css` is the small stylesheet entry point. Do not recursively read the full preserved cascade under `legacy/`.
- `legacy/vocabulary-runtime.css` is the current visual baseline. Search for an exact selector first and read only the surrounding lines needed for that selector.
- Do not scan `assets/`, generated screenshots, videos, or unrelated demos unless the task explicitly needs them.

## Editing rules

- Preserve the current visual result unless the task explicitly asks for a redesign.
- Do not create `*-fix`, `*-override`, `*-patch`, or `*-hardening` files.
- Do not append blind overrides to the end of the legacy stylesheet.
- When a touched area is refactored, move one coherent responsibility at a time into a clearly named canonical stylesheet (for example `cards.css`, `detail.css`, or `responsive.css`) while preserving source order.
- Before changing a selector, search for all occurrences of that selector so older declarations are not accidentally left authoritative.
- Keep flip-card behavior, detail dialogs, bilingual layout, and mobile breakpoints intact unless the task specifically changes them.
- Never embed base64 images in CSS, HTML, or JS.
