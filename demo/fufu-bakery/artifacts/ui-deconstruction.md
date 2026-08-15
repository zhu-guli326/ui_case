# FuFu Bakery UI Deconstruction

## Workflow Record

- Original reference: `../assets/reference-overview.png`.
- Generated complete effect image: `../assets/fufu-line-effect-board.png` (`1536 x 1024`).
- Effect-image review: passed. The board has three complete devices, sparse paper-white compositions, visibly uneven black linework, controlled yellow-blue accents, and enough hierarchy to guide implementation.
- Decomposition source: `fufu-line-effect-board.png` only.
- Generation channel: `youtoken-gpt-image-2` image edit.

## Screen Anatomy

### Welcome

1. iOS safe area and status bar.
2. Loose stacked wordmark, small hand-lettered note, and open white space.
3. Dog baker illustration with a baguette.
4. One thin-border entry button.

### Bakery Home

1. Compact greeting and basket icon button.
2. Loose dog-and-bread hero drawing with one navigation action.
3. Four 2x2 paper tiles: Order, Dine in, Treats, and Tiny shop.
4. Quiet feedback message and bottom tab bar.

### Member

1. Compact top app bar.
2. Blue line-art trio of dog bakers.
3. Six stamp states.
4. Two small perk cards and bottom tab bar.

## Code UI

- Phone frame, safe areas, status bar, Dynamic Island, home indicator, and all written content.
- Buttons, action tiles, menu cards, stamp states, toast feedback, and bottom tabs.
- One local SVG sprite for all status, navigation, food, shop, gift, and profile glyphs.

## Image Assets

- `fufu-line-effect-board.png`: review-only complete effect image.
- `fufu-baker.png`: reusable dog baker illustration.
- `fufu-friends-lineup.png`: member-screen blue dog trio.

Generated assets contain no final text, logos, status bar, button, or navigation glyphs.

## Interaction Map

- Welcome entry opens the home screen.
- Order, hero, and Menu tab open the menu.
- Treats and Member tab open member perks.
- Menu item presses mark the choice and update local feedback.
- Each top action and perk provides a local message.
- `?embed=1` uses a stable `390 x 844` frame for the case library.
