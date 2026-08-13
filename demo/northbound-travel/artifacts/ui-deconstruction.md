# NORTHBOUND UI Deconstruction

## 1. Overall Visual Direction

- Product type: premium mobile travel discovery and itinerary app.
- Presentation: three staggered 9:16 phone screens on a charcoal-navy board.
- Visual tension: near-black interface chrome versus immersive cool-toned landscape photography.
- Typography: oversized uppercase grotesk headlines, compact neutral sans-serif metadata, thin rules, and restrained labels.
- Interaction language: outlined circular icon buttons, outlined pills, one dominant white booking CTA, and minimal bottom navigation.

The style should be derived as a system, not reproduced as one baked screenshot. The final implementation should use separate pages, real text, code-rendered controls, and local photography assets.

## 2. Layer Model

### Presentation Board

- Full-width charcoal-navy background: `#202c36`.
- Three phone frames arranged on a horizontal stage.
- Center phone is the primary visual anchor and sits 6-10% higher than the side phones.
- Side phones are slightly smaller to establish hierarchy.
- Device shadows stay soft and low-opacity; no floating cards behind the phones.

### Phone Frame

- Internal design canvas: `390 x 693` (9:16).
- Dark metallic outer frame with a thin cool-gray highlight.
- Screen clipping radius: approximately 30-34px at the design canvas size.
- Status bar, Dynamic Island, signal, Wi-Fi, battery, and home indicator are code-rendered UI chrome.

### App Screens

Each screen uses the same tokens, icon system, touch target sizes, and typography scale. The screens differ through image treatment and information density, not through unrelated component styles.

## 3. Screen Structure

### Screen A: Discover

1. Status bar.
2. Top row with greeting and 44x44 search button.
3. Oversized two-line headline: `FIND YOUR EDGE`.
4. Horizontal category rail with one outlined selected pill.
5. Layered destination carousel.
6. Active destination card with title, duration, price label, and arrow action.
7. Bottom tab bar with four code icons.

Implementation notes:

- The active photo card is code UI over a single generated landscape photo.
- Background cards are the same component with scale, rotation, and offset transforms.
- Text must remain code-rendered and should not be part of the photo.
- The card stack is the only controlled overlap on this screen.

### Screen B: Journey Hero

1. Full-bleed photographic background.
2. Dark blue overlay gradient for text contrast.
3. Status bar and two circular icon buttons.
4. Large centered headline: `BEYOND THE NORTH`.
5. Three trip facts in a two-column definition list with horizontal rules.
6. Bottom outlined CTA: `EXPLORE ROUTE`.

Implementation notes:

- Use one stable full-screen image slot with `object-fit: cover`.
- Preserve the horizon and main cliff silhouette with `object-position` tokens.
- The overlay should be code CSS, not baked into the image.
- The trip facts should use a real `dl`, not independent decorative labels.

### Screen C: Itinerary

1. Status bar.
2. Centered app bar with back and favorite buttons.
3. Edge-to-edge photo carousel with partial neighboring slides.
4. Pagination dots.
5. Oversized heading: `THE ROUTE`.
6. Itinerary list with thumbnail, day label, date, and short summary.
7. Fixed-width primary CTA: `RESERVE JOURNEY`.

Implementation notes:

- Carousel photos and itinerary thumbnails are image assets.
- Pagination dots, buttons, list dividers, labels, and CTA are code UI.
- Limit each itinerary summary to three lines on the 390px canvas.
- The CTA remains visible without covering list content.

## 4. Design Tokens

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--board` | `#202c36` | Presentation background |
| `--surface` | `#050505` | Main app background |
| `--ink` | `#ffffff` | Headlines and primary actions |
| `--muted` | `#999da2` | Secondary labels |
| `--line` | `rgba(255,255,255,.42)` | Dividers and outlined controls |
| `--ocean` | `#1f5278` | Photo overlay bias |
| `--focus` | `#cceafa` | Focus ring and selected feedback |

### Typography

| Role | Suggested size | Weight | Line height |
| --- | --- | --- | --- |
| Display headline | 46-54px | 800-900 | .88-.95 |
| Section headline | 40-46px | 800-900 | .92 |
| Card title | 28-32px | 700-800 | 1.0 |
| Body | 16px | 400-500 | 1.35 |
| Metadata | 12-14px | 600-700 | 1.2 |
| Button | 15-16px | 700-800 | 1 |

Use one grotesk sans-serif family for the final product. Do not bake typography into image assets.

### Spacing And Shape

- Base spacing unit: 4px.
- Screen horizontal inset: 24px.
- Main section gaps: 28-36px.
- Related control gaps: 8-12px.
- Icon button hit area: 44x44px.
- Pill height: 40-44px.
- Card radius: 0-8px except for the phone screen and pill controls.
- Border width: 1-1.5px.

## 5. Code UI Versus Image Assets

### Code-rendered

- Every readable label, price, date, title, and CTA.
- Status bar and Dynamic Island.
- Search, back, favorite, arrow, home, calendar, grid, and profile icons.
- Category pills, buttons, rules, carousel dots, tab states, and list layout.
- Phone frame, screen clipping, presentation-board layout, shadows, and overlays.

### Image-generated

- Discover destination landscape.
- Journey full-screen coastal hero.
- Three itinerary carousel photographs.
- Two or more itinerary thumbnails, preferably cropped from the same photo family.

Generated photos must contain no text, logo, phone hardware, UI glyph, status bar, button, arrow, or navigation element.

## 6. Icon Coverage

Use one icon system only. For a new React build, prefer `@phosphor-icons/react`.

| Semantic name | Suggested icon | Size | Container | States |
| --- | --- | --- | --- | --- |
| `search` | `MagnifyingGlass` | 22px | 44x44 circle | default, pressed |
| `back` | `ArrowLeft` | 20px | 44x44 circle | default, pressed |
| `favorite` | `Heart` | 22px | 44x44 circle | off, on |
| `open` | `ArrowUpRight` | 18px | inline/card action | default, pressed |
| `down` | `ArrowDown` | 18px | CTA | default, pressed |
| `home` | `House` | 22px | bottom tab | default, selected |
| `calendar` | `CalendarBlank` | 22px | bottom tab | default, selected |
| `saved` | `Heart` | 22px | bottom tab | default, selected |
| `grid` | `SquaresFour` | 22px | bottom tab | default, selected |
| `signal` | `CellSignalHigh` | 14px | status bar | static |
| `wifi` | `WifiHigh` | 14px | status bar | static |
| `battery` | `BatteryHigh` | 18px | status bar | static |

All icon-only controls require an accessible name. The icon may be 18-22px while the touch target remains at least 44x44px.

## 7. Interaction Map

- Category pill: changes the active destination stack.
- Destination card: opens the Journey Hero screen.
- Favorite button: toggles `aria-pressed` and fill state.
- `EXPLORE ROUTE`: opens the Itinerary screen.
- Carousel: supports swipe, previous/next buttons, and pagination state.
- Itinerary row: expands a short detail panel or navigates to a day detail.
- `RESERVE JOURNEY`: opens a local confirmation state; no real purchase is submitted.
- Bottom tabs: switch between Discover, Calendar, Saved, and Profile states.

## 8. Implementation Order

1. Build the 390x693 fixed design canvas and scalable phone frame.
2. Establish color, type, spacing, and icon tokens.
3. Implement all three screens with placeholder photo slots.
4. Generate the six photography assets from the manifest.
5. Integrate images with stable aspect ratios and crop tokens.
6. Connect the primary navigation path: Discover -> Journey -> Itinerary -> Confirmation.
7. Add the three-phone presentation board as a separate showcase route.
8. Verify desktop, mobile, 9:16 canvas integrity, touch targets, and icon alignment.

## 9. Main Risks

- Generated mockups can contain attractive but structurally inconsistent spacing. The implementation must normalize everything to one token system.
- Oversized headlines can collide with the photo focal point; validate long text and narrow containers.
- Microcopy in itinerary rows can become unreadable; keep body text at 16px and cap line count.
- Full-screen photos need separate crop positions for each screen.
- Phone hardware and UI chrome must remain code-rendered in the final app, even though the concept board presents them as one image.
