# ArtMuse iOS Demo

Three-screen iOS-style museum app prototype based on the provided reference image.

## Run

```powershell
cd demo/artmuse-ios
python -m http.server 4183 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:4183/
```

## Interactions

- Home -> Exhibitions via the Visit arrow or Exhibitions card.
- Exhibitions -> Detail via any brown arrow button.
- Detail -> Home via the bottom home button.
- Other buttons show local feedback states.

## Screenshots

- `screenshots/artmuse-desktop.png`
- `screenshots/artmuse-mobile.png`

## Render the library video

```bash
node demo/artmuse-ios/render-video.mjs
```

The renderer records the three-screen interaction at a `390x844` CSS viewport
and writes a full-frame `780x1688` H.264 video to the case-library asset path.

## Validate

```powershell
powershell -ExecutionPolicy Bypass -File demo/artmuse-ios/validate.ps1
```

## Asset Notes

The featured night painting and exhibition-card illustrations are local PNG assets generated through YouToken Image. UI text, controls, arrows, device chrome, and status symbols remain code-rendered. Supporting artwork thumbnails remain local SVG assets so the demo runs without remote image loading.
