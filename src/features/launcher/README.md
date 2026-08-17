# Launcher architecture

`launcher.html` is intentionally a semantic page shell. It should not contain feature CSS, inline application state, or inline interaction controllers.

## Runtime layers

| Layer | Owner | Responsibility |
| --- | --- | --- |
| Page shell | `launcher.html` | Stable DOM mount points, landmarks, dialogs, and the three-stage information architecture |
| Layout / page chrome | `launcher-workspace.css` | Workspace composition, stage hierarchy, responsive shell, design-workbench presentation |
| Entry / orchestration | `launcher-entry.js` | Loads the core controller first, then independent enhancement modules |
| Core task controller | `/launcher.js` | Workspace state, intent-specific fields, readiness, prompt generation, case picker data, persistence |
| Static shell | `launcher-shell.js` | Shell localization and Define → Constrain → Output navigation |
| Design-system controller | `launcher-design-system.js` | Target-platform state, Design System tabs, preview device/profile synchronization |
| Accessibility / feedback | `launcher-hardening.js` | ARIA synchronization, blocked-submit feedback, focus, contrast, reduced motion |
| Compatibility boundary | `launcher-stability.js` | Narrow guards around legacy controller behavior that still needs isolation |
| Preview adapters | `launcher-preview-*.js` | Optional visual preview enrichment loaded after the core is ready |

## Rules

1. Do not load launcher features from analytics, the site header, or another global shell file. `launcher-entry.js` is the only feature entry point.
2. Do not put application `<script>` or page `<style>` blocks back into `launcher.html`.
3. Keep the user flow task-first: **Define task → Set design constraints → Review & output**.
4. `launcher.js` owns task state and prompt readiness. Secondary modules may observe or decorate that state, but should not create a second workspace store.
5. `launcher-design-system.js` is the only owner of platform-selection and Design System workbench interaction state.
6. `launcher-hardening.js` owns accessibility synchronization, not product behavior. Avoid duplicating keyboard behavior already owned by the relevant controller.
7. `launcher-preview-lab.js` and `launcher-platform-merge.js` are experimental/legacy modules and are deliberately not loaded by the production entry.
8. Preserve stable DOM IDs used by `launcher.js`; architecture tests protect this contract while the remaining legacy core is gradually decomposed.

## Refactoring seam

The remaining large file is `/launcher.js`. Future extraction should move one responsibility at a time behind the existing contract, starting with intent form renderers and case-picker rendering. Avoid a full rewrite of state migration, persistence, and prompt generation in the same change.
