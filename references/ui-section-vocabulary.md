# UI Section Vocabulary

Use this reference when turning screenshots, mockups, or app references into
clickable demos. Name what is on the screen first, then implement the layout,
copy, controls, states, and example previews as code-rendered components. Use a
replaceable external HTTPS image only when the content genuinely calls for a
photograph, product image, illustration, or other media.

For a searchable version with code-rendered component previews, anatomy,
variants, related terms, and copyable Agent prompts, open the
[interactive UI vocabulary](../vocabulary.html). It does not require generated
images; a small number of media-oriented examples may use replaceable external
HTTPS placeholders.

## Core Rule

Describe UI by role, not by vague appearance.

- Weak: "a row of boxes"
- Better: "filter chips above a card grid"
- Weak: "a floating thing"
- Better: "bottom sheet with a dimmed scrim"
- Weak: "some image cards"
- Better: "masonry gallery with media tiles and code-rendered captions"

## Page Anatomy

| Pattern name | What it means | Usually code-rendered? | Optional external media? |
| --- | --- | --- | --- |
| App shell | The persistent frame around an app: nav, content region, safe area | Yes | No |
| Top app bar | Header with title, back/menu/search/actions | Yes | No |
| Navigation bar | Website-level links and primary actions | Yes | No |
| Sidebar | Vertical navigation or workspace list | Yes | No |
| Rail navigation | Compact icon-only side nav | Yes | No |
| Breadcrumbs | Current location and its parent path | Yes | No |
| Bottom tab bar | Mobile destinations at the bottom edge | Yes | No |
| Hero section | First major page moment, often text plus media | Text and controls yes | Only for genuine media content |
| Content section | A full-width page band with one job | Yes | Only when the section contains genuine media |
| Footer | Secondary links, contact, license, legal | Yes | No |

## Controls

| Pattern name | Use it for | Notes |
| --- | --- | --- |
| Button | A direct command | Include hover, active, disabled, and loading states |
| Icon button | A compact command with an icon | Must have accessible name |
| Segmented control | Mutually exclusive view modes | Good for "Grid / List" or "Light / Dark" |
| Tabs | Switching related panels in the same context | Keep tab labels short |
| Filter chips | Narrowing a collection | Good for library, shop, search, and gallery screens |
| Search field | Querying local or remote content | Include empty and no-results states |
| Checkbox | Multiple independent binary choices | Label text sits next to the box |
| Toggle | A single on/off setting | Use for persistent settings |
| Slider | Numeric range control | Show current value when precision matters |
| Stepper | Small numeric increments | Good for quantity and spacing controls |
| Menu | Overflow actions or option sets | Avoid hiding primary actions in menus |
| Tooltip | Names unfamiliar icons | Do not put essential instructions only in a tooltip |

## Content Blocks

| Pattern name | What it looks like | Best for |
| --- | --- | --- |
| Card grid | Repeated cards in rows and columns | Products, articles, templates, examples |
| Bento grid | Mixed-size tiles with hierarchy | Feature tours, capability summaries |
| Masonry grid | Staggered cards with different heights | Visual galleries and inspiration boards |
| Feed list | Chronological or ranked rows | News, updates, activity, messages |
| Media tile | Image or video first, text second | Portfolio and visual libraries |
| Product card | Product image, name, price, action | Commerce and catalog screens |
| Stat strip | Compact numeric summary | Real metrics, counts, audits |
| Data table | Scannable, sortable, or filterable rows and columns | Admin tools, reports, audits, catalogs |
| Comparison table | Row-by-row feature comparison | Plans or technical differences |
| Detail panel | Rich information about the selected item | Inspectors, file details, product details |
| Timeline | Ordered events over time | Releases, history, onboarding |
| Stepper flow | Multi-step process with progress | Setup, checkout, forms |

## Overlays And Temporary Surfaces

| Pattern name | What it does | Notes |
| --- | --- | --- |
| Modal | Interrupts with a focused task | Needs focus trap and close behavior |
| Drawer | Slides from the side for navigation or detail | Good for responsive layouts |
| Bottom sheet | Mobile-friendly panel from bottom edge | Often paired with a scrim |
| Popover | Small contextual surface near a trigger | Good for lightweight options |
| Command palette | Keyboard-first action/search overlay | Usually opens with Command K |
| Toast | Transient feedback | Do not use for persistent errors |
| Banner | Persistent message near page top | Good for warnings, trials, or sync state |

## State Vocabulary

| State name | When it appears | Implementation hint |
| --- | --- | --- |
| Loading skeleton | Before content arrives | Match the final layout shape |
| Empty state | A collection has no items yet | Offer one clear next action |
| No-results state | Search or filters match nothing | Keep current query visible |
| Error state | A request or action failed | Explain recovery, add retry when possible |
| Disabled state | An action is unavailable | Explain why when it is not obvious |
| Selected state | One item is active | Use contrast, not only color |
| Hover state | Pointer is over an interactive element | Use transform or color, not layout shift |
| Pressed state | Button is being activated | Small physical feedback works well |
| Focus state | Keyboard focus is present | Must be visible and high contrast |
| Success state | Action completed | Keep it brief and reversible when needed |

## Component And Media Split Names

Use these labels in `code-ui` and `external-media` inventories. Every interface
structure stays in code; external media is content and must not carry navigation,
controls, state, or required readable text.

| Label | Goes to | Examples |
| --- | --- | --- |
| `code-text` | Code | Headings, body copy, labels, prices |
| `code-control` | Code | Buttons, tabs, inputs, sliders |
| `code-icon` | Code | Search, back, close, menu, heart, play |
| `code-status` | Code | Battery, Wi-Fi, signal, progress, badges |
| `layout-chrome` | Code | Device frame, safe area, app shell |
| `external-photo` | External HTTPS image | Lifestyle photo, hero photo, editorial cover |
| `external-product-image` | External HTTPS image | Object on transparent or clean background |
| `external-texture` | External HTTPS image | Paper, glass, fabric, wall, or other real material |
| `external-illustration` | External HTTPS image | Character, map, complex scene |
| `external-thumbnail` | External HTTPS image | Card cover, article image, gallery tile |

External media must use HTTPS, include suitable alternative text, and remain
replaceable without changing the component structure. Loading, fallback, crop,
overlay, and caption behavior still belong to the code component.

## Pattern Recipes

### Library Screen

Use when the reference has many examples, assets, lessons, or templates.

- Top app bar
- Sidebar or category rail
- Breadcrumbs
- Search field
- Filter chips or category buttons
- Stat strip
- Card grid, masonry grid, or media tiles
- Detail drawer or preview modal
- Empty state and no-results state

### Mobile Product Detail

Use when one object or place is the focus.

- Device frame and safe area
- Top app bar with back action
- Hero media or product cutout
- Title block
- Price or metadata row
- Segmented detail tabs
- Sticky bottom action bar
- Related card rail

### Editorial Feed

Use when the screen is about reading and discovery.

- Top app bar
- Topic tabs
- Featured story card
- Feed list
- Media tiles
- Bookmark and share icon buttons
- Loading skeleton
- No-results state

### Dashboard-Lite Overview

Use when the screen needs metrics but is not a dense admin tool.

- App shell
- Header toolbar
- Stat strip
- Insight cards
- Chart panel
- Activity feed
- Filters
- Data table when dense records are needed
- Empty, loading, and error states

## Naming Checklist

Before implementation, write a short inventory:

```text
code-ui:
- app shell
- top app bar
- sidebar and breadcrumbs
- search field
- filter chips
- masonry card grid
- data table
- checkbox and menu
- detail drawer
- loading skeleton and empty state

external-media (only when the content needs it):
- hero media: replaceable HTTPS photo, 1600x900
- card covers: 4 replaceable HTTPS thumbnails, 4:3 crop
- product image: replaceable HTTPS image with a transparent background
```

If the inventory includes "image with text," split it again. Text belongs in
code unless it is part of a real photograph, scanned document, or artwork. This
page does not require image generation, and component screenshots are not the
canonical previews.
