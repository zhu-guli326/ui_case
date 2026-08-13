# Museum Explorer Asset Plan

## Code UI

- App shell: desktop rail navigation, responsive mobile top app bar, top toolbar, toast.
- Discover screen: editorial introduction, featured exhibition, program day tabs, program list, artwork filter chips, collection grid.
- Detail drawer: scrim, close control, metadata, audio-guide command.
- States: selected day, selected artwork category, saved program item, opened artwork detail, transient confirmation.

## Image Assets

No new `image2` asset is required for this version. The supplied artwork thumbnails are preserved as existing local source assets rather than regenerated:

| asset | purpose | source | crop | negative constraints |
| --- | --- | --- | --- | --- |
| `starry-night.svg` | featured exhibition and collection artwork | `demo/museum-explorer/assets/` | `object-fit: cover/contain` by placement | Preserve source artwork; no generated UI glyphs or text |
| `memory.svg` | collection artwork thumbnail | `demo/museum-explorer/assets/` | `object-fit: cover` | Preserve source artwork; no generated UI glyphs or text |
| `pearl.svg` | collection artwork thumbnail | `demo/museum-explorer/assets/` | `object-fit: cover` | Preserve source artwork; no generated UI glyphs or text |

The UI is code-rendered; only the supplied artwork content remains bitmap/vector media.
