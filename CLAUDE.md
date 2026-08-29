# Claude Code Entry Point

Read `AGENTS.md` before making any website change. `AGENTS.md` is the single source of truth for ONDesign development rules and repository architecture.

Do not maintain a second copy of those rules in this file. If the development workflow or architecture changes, update `AGENTS.md` only.

Critical default behavior:

- Modify the current canonical implementation instead of creating a new version beside it.
- When new code/design replaces old code/design, delete the superseded source in the same change.
- Do not keep old CSS, JS, DOM, assets, hidden fallbacks, commented backups, compatibility bridges, `v2/final/fix/override/legacy` files, or temporary migration tooling after the replacement is complete.
- Git history is the archive and rollback mechanism.
- Page-only changes must not create or restyle a page-specific global navigation; the shared App Shell remains global.
- Before finishing, follow the replacement completion checklist and final Agent self-check in `AGENTS.md`.