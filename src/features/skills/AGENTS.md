# Skills Feature Agent Rules

`skills.js` is currently a large legacy entry file. Do not read it from top to bottom unless a task truly spans the whole Skills feature.

## Read by task

- Add or edit a Skill repository: search the exact repository slug inside `const repositories = [` and `const repositoriesEn = [`.
- Add or edit a design website: search the exact domain inside `const designReferenceWebsites = [`.
- Change Skill categories: search `categoryGroups`, `categoryLabels`, and `renderRepositoryFilters`.
- Change Web categories or source-code filtering: search `designReferenceGroups`, `getFilteredWebsites`, and `renderRepositoryFilters`.
- Change search behavior: search `getFilteredRepositories`, `getFilteredWebsites`, and the `repoSearch` event listener.
- Change sorting: search `getStarValue`, `getFilteredRepositories`, and `repoSortButtons`.
- Change card/list rendering: search `renderRepositories` or `renderDesignReferences`; do not load catalog data unless the markup needs data-field changes.
- Change the selected Skill inspector: search `renderInspector`.
- Change URL state: search `restoreDirectoryStateFromUrl`, `applyDirectoryStateToParams`, and `syncDirectoryStateToUrl`.
- Change GitHub Stars syncing: search `repositoryStatsCacheKey`, `fetchRepositoryStats`, and `loadRepositoryData`.
- Change translations: search the exact `skills.*` translation key inside `skillsTranslations`.
- Change cover media: search the exact slug/domain plus `getSkillCoverMarkup` or `getWebsitePreviewMarkup`.

## Scope rules

- Use exact slug/domain/function searches before opening source ranges.
- Read the smallest relevant range around a match first.
- Do not load `skills.js` in full for a local visual, copy, filter, or catalog-entry change.
- Do not create `skills-fixes.js`, `skills-overrides.js`, or other patch layers.
- Keep catalog data separate from runtime logic when future refactoring touches this file.
- Preserve `window.image2SkillsCatalog` compatibility because the detail page may consume it.
- Preserve both `SKILL` and `WEB` directory modes and URL state when editing filters.
