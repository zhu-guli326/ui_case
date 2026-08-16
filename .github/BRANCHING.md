# Branching Policy

This repository intentionally keeps branch management simple.

## Long-lived branch

- `main` is the only long-lived branch.
- `main` must stay deployable and must pass CI.

## Working branches

Use a working branch only for an active change.

Preferred names:

- `fix/<short-topic>` for bug fixes
- `feat/<short-topic>` for features
- `refactor/<short-topic>` for structural cleanup
- `chore/<short-topic>` for repository maintenance

Tool-created branches such as `agent/*` or `codex/*` are temporary working branches only. They must not be treated as permanent branches.

## Merge rules

1. Start from the latest `main`.
2. Keep one branch focused on one task.
3. Open one PR for that task.
4. Run `npm test` and `npm run check` through CI.
5. Prefer squash merge for completed work.
6. Delete the working branch after merge.
7. Never reuse an already-merged branch for a new task.

## Repository hygiene

At normal steady state, the branch list should contain only:

- `main`
- optionally one or a small number of currently active working branches

If an `agent/*`, `codex/*`, `fix/*`, `feat/*`, `refactor/*`, or `chore/*` branch has already been merged, delete it instead of keeping it around as history. Git history and the merged PR already preserve the work.
