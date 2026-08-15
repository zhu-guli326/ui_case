<<<<<<< HEAD
# Historical UI vocabulary effect-board review

> Historical reference only. The live vocabulary page does not load this board,
> crop it into covers, or require generated images. Its canonical previews are
> code-rendered components. Where an example genuinely needs photographic or
> illustrative content, it may use a replaceable external HTTPS image.
=======
# UI vocabulary effect-board review and decomposition
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074

## Effect image

- Path: `artifacts/vocabulary-effect-board.png`
- Channel: `youtoken-gpt-image-2`
<<<<<<< HEAD
- Historical review: passed at the time it was produced
- Fidelity notes: preserves the reference's compact desktop shell, search/filter stack,
  sticky taxonomy, and dense three-column vocabulary grid. OS overlays and screenshot
  annotations were intentionally excluded. Entry counts and card content shown in this
  image are not authoritative; the live dataset and rendered components are the source of
  truth.

## Live component contract

- Semantic HTML, CSS, and JavaScript render the app shell, navigation, search, filters,
  sidebar, breadcrumbs, cards, data tables, controls, loading skeletons, overlays, and
  feedback states.
- Every vocabulary card and detail view uses a code-rendered component preview.
- Text, icons, states, focus behavior, and responsive layout remain editable code.
- Optional external media uses HTTPS and remains replaceable independently of the
  component. It never substitutes for component structure or readable UI text.

## Archived generated assets

The former contact sheets and cropped covers are retained only as historical design
exploration. They are not runtime dependencies, are not required for builds or tests, and
should not be extended when new vocabulary entries are added. New entries need a component
preview; add an external HTTPS image only when the example's actual content is visual media.

The archived prompt notes remain in `artifacts/vocabulary-image2-prompts.md` for provenance.
They are not instructions for the current implementation.
=======
- Review: passed
- Fidelity notes: preserves the reference's compact desktop shell, search/filter stack,
  sticky taxonomy, and dense three-column vocabulary grid. OS overlays and screenshot
  annotations are intentionally excluded. The generated mockup says 30 entries, but the
  implementation keeps the repository's real 24-entry dataset.

## Code UI

- desktop app shell and top navigation
- full-width search field with Command-K shortcut
- horizontal category filter chips
- sticky taxonomy sidebar and guidance callout
- result heading, summary, and sort control
- responsive three-column media card grid
- real card titles, descriptions, tags, favorite controls, and footer links
- no-results state, term detail dialog, copy action, and toast feedback

## Image2 assets

- `page-foundations-sheet.png`: five architectural/editorial thumbnails
- `navigation-discovery-sheet.png`: six wayfinding/discovery thumbnails
- `content-display-sheet.png`: five publishing/media thumbnails
- `controls-forms-sheet.png`: three tactile control/form thumbnails
- `feedback-overlay-sheet.png`: four layered feedback/overlay thumbnails
- `visual-realization-sheet.png`: one abstract visual-realization thumbnail

Generated assets contain no readable UI text, product logos, watermarks, status bars,
buttons, or small UI glyphs. They are cropped into 24 local card covers at build time.
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
