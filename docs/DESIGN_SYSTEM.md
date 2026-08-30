# ONDesign Global Design System

> **Required rule:** every new public page, component, feature surface, and future visual refactor MUST follow this design system first. Do not introduce a second palette, spacing scale, radius system, control-height system, shadow system, or page-local typography scale unless there is a documented exception.

## Source of truth

The canonical implementation lives in:

`src/core/app-shell/design-tokens.css`

New code should consume the `--ds-*` tokens directly.

Existing aliases such as `--page`, `--surface`, `--accent`, and `--ant-*` remain only for backward compatibility with older pages. Do not use those aliases as the starting point for new implementations.

## Language policy

ONDesign uses one shared component system across Chinese and English.

- **Chinese (`zh-CN`)**: follows Ant Design hierarchy, density, typography rhythm, control sizing, neutral surfaces, border treatment, and interaction states. ONDesign green remains the primary brand color instead of Ant blue.
- **English (`en`)**: uses the same colors, component geometry, spacing, radius, controls, elevation, and states. Only typography can be slightly more editorial: larger body copy, tighter heading line-height, and modest negative heading tracking.

Language switching must not change component geometry or create a different visual system.

## Canonical token groups

### Color

Use semantic tokens instead of hard-coded values:

- `--ds-color-primary`
- `--ds-color-primary-hover`
- `--ds-color-primary-active`
- `--ds-color-primary-soft`
- `--ds-color-text`
- `--ds-color-text-secondary`
- `--ds-color-text-tertiary`
- `--ds-color-bg-page`
- `--ds-color-bg-container`
- `--ds-color-bg-subtle`
- `--ds-color-border`
- `--ds-color-border-subtle`

### Spacing

4px base rhythm only:

`--ds-space-1` through `--ds-space-24`

Prefer 8 / 12 / 16 / 24 / 32 / 40 / 48px for common UI composition.

### Radius

Use only:

- `--ds-radius-sm` = 4px
- `--ds-radius-md` = 6px
- `--ds-radius-lg` = 8px
- `--ds-radius-xl` = 12px
- `--ds-radius-2xl` = 16px
- `--ds-radius-pill` for pills only

### Controls

- Small: `--ds-control-height-sm` = 24px
- Default: `--ds-control-height-md` = 32px
- Large: `--ds-control-height-lg` = 40px
- Hero / primary large CTA: `--ds-control-height-xl` = 48px

### Elevation

Use `--ds-shadow-sm`, `--ds-shadow-md`, and `--ds-shadow-lg` only. Avoid custom large decorative shadows for ordinary UI cards.

### Typography

Use the shared semantic scale:

- `--ds-font-size-xs`
- `--ds-font-size-sm`
- `--ds-font-size-body`
- `--ds-font-size-body-lg`
- `--ds-font-size-title-sm`
- `--ds-font-size-title`
- `--ds-font-size-heading-sm`
- `--ds-font-size-heading`
- `--ds-font-size-display-sm`
- `--ds-font-size-display`

Chinese headings should use strong, clear hierarchy and no artificial letter spacing. English headings may use modest negative tracking through the language tokens.

### Layout

- Page gutter: `--ds-page-gutter`
- Content max width: `--ds-content-max`
- Readable copy width: `--ds-content-readable`
- Directory/sidebar width: `--ds-sidebar-width`

Do not create page-specific horizontal gutter systems unless the page is a deliberate immersive/edge-to-edge experience.

## New page checklist

Before merging a new page, verify:

1. `site-shell.css` is loaded, so global tokens and shared navigation are inherited.
2. All primary colors come from `--ds-color-*`.
3. All spacing comes from `--ds-space-*`.
4. Radius, controls, shadows and focus states use the canonical tokens.
5. Chinese and English share the same DOM/component geometry.
6. Chinese follows Ant Design density and typography rhythm.
7. English differences are limited to language-specific typography/density tokens.
8. No page-local `:root` block creates another design system.
9. No new feature stylesheet redefines `--accent`, `--page`, or `--surface` as a separate brand system.
10. Focus, hover, active, disabled and selected states are visible and consistent.

## Allowed exceptions

Immersive editorial sections, full-screen art direction, demos, and reference reproductions may intentionally depart from ordinary card/component geometry. Even then, navigation, controls, forms, focus states, and surrounding application chrome should still use global tokens.

If an exception is necessary, document it in the feature stylesheet with a short comment explaining why it cannot use the global token value.
