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
| Design-system controller | `launcher-design-system.js` | Target-platform state, Design System tabs, source preview device/profile synchronization |
| Final live preview | `launcher-live-preview.js` + `launcher-live-preview.css` | One stable full-page preview after the workspace; mirrors the source preview without moving Design System panels or changing task-mode layout |
| Accessibility / feedback | `launcher-hardening.js` | ARIA synchronization, blocked-submit feedback, focus, contrast, reduced motion |
| Compatibility boundary | `launcher-stability.js` | Narrow guards around legacy controller behavior that still needs isolation |
| Preview renderers | `launcher-preview-templates.js`, `launcher-preview-modern-cases.js`, `launcher-preview-editorial-images.js` | Render page/template content into the source preview device used by the final live preview |
| Retired compatibility path | `launcher-preview-lab.js` | Safe forwarder only; the former Create-only layout rewrite must never return |

## Rules

1. Do not load launcher features from analytics, the site header, or another global shell file. `launcher-entry.js` is the only production feature entry point.
2. Do not put application `<script>` or page `<style>` blocks back into `launcher.html`.
3. Keep the user flow task-first: **Define task → Set design constraints → Review & output**.
4. All task modes use the same shell, task-mode card component, design stage, output panel, and final Live Preview. An intent may change only the task fields it requires; it must not rewrite the surrounding information architecture.
5. `launcher.js` owns task state and prompt readiness. Secondary modules may observe or decorate that state, but should not create a second workspace store.
6. `launcher-design-system.js` is the only owner of platform-selection and Design System workbench interaction state.
7. `launcher-live-preview.js` owns the final page preview. It may mirror source preview content, but it must not move a `.ds-panel`, remove Design System tabs, or mutate task form structure.
8. `launcher-hardening.js` owns accessibility synchronization, not product behavior. Avoid duplicating keyboard behavior already owned by the relevant controller.
9. `launcher-preview-lab.js` is a retired compatibility path and `launcher-platform-merge.js` remains experimental; neither may own production layout behavior.
10. Preserve stable DOM IDs used by `launcher.js`; architecture and browser tests protect this contract while the remaining legacy core is gradually decomposed.

## Refactoring seam

The remaining large file is `/launcher.js`. Future extraction should move one responsibility at a time behind the existing contract, starting with intent form renderers and case-picker rendering. Avoid a full rewrite of state migration, persistence, and prompt generation in the same change.
