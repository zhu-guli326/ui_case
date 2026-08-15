# FuFu Bakery image2 prompt record

## Source and effect-image review

- Original visual reference: `assets/reference-overview.png`.
- Complete effect image: `assets/fufu-line-effect-board.png`, generated from the original reference as style input at `1536 x 1024`.
- Review: passed. It contains three complete screens, keeps the visual focus on uneven black pen lines and dog illustrations, leaves substantial paper-white space, and limits yellow/blue accents to small highlights. It does not bake any final UI strings or controls into implementation assets.
- Decomposition source: `assets/fufu-line-effect-board.png`.
- Channel: `youtoken-gpt-image-2` image edit, high quality.

## fufu-baker

- Purpose: reusable dog baker illustration for the welcome and bakery-home screens.
- Output: `assets/fufu-baker.png`, PNG.
- Channel: earlier `youtoken-gpt-image-2` image edit using `assets/reference-overview.png` as the style reference.
- Style tokens: warm paper white, uneven black ink outline, pale sky-blue apron, butter-yellow bread, simple friendly dog character.

## fufu-friends-lineup

- Purpose: original blue line-art dog trio for the member screen.
- Output: `assets/fufu-friends-lineup.png`, `1774 x 887` PNG.
- Derived from: `assets/fufu-line-effect-board.png` after effect-image review.
- Channel: `youtoken-gpt-image-2` image edit, high quality.
- Style tokens: cobalt-blue hand-drawn lines, slight wobble, paper-white background, tiny butter-yellow bread accent, three dog bakers with whisk, bowl, and baguette.

All implementation-image prompts explicitly excluded readable text, logos, watermarks, UI controls, status-bar glyphs, navigation symbols, arrows, buttons, and labels. Those surfaces are rendered by the webpage.
