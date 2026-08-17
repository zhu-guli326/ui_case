from pathlib import Path
import re


def strip_phone_hardware(path):
    p = Path(path)
    text = p.read_text()
    pattern = re.compile(r"(\.phone\s*\{)(.*?)(\})", re.S)
    hardware = re.compile(
        r"(?:^|\s)(?:padding|border|border-radius|background|box-shadow)\s*:\s*[^;{}]+;?",
        re.I,
    )

    def clean(match):
        body = hardware.sub("", match.group(2))
        return match.group(1) + body + match.group(3)

    cleaned, count = pattern.subn(clean, text)
    if count == 0:
        raise SystemExit(f"no .phone rules found in {path}")
    p.write_text(cleaned)


# FuFu: the polish file existed but was never loaded.
fufu_html = Path("demo/fufu-bakery/index.html")
text = fufu_html.read_text()
if "./visual-polish.css" not in text:
    marker = '<link rel="stylesheet" href="../iphone-frame.css">'
    if marker not in text:
        raise SystemExit("FuFu shared PhoneShell link not found")
    text = text.replace(
        marker,
        marker + '\n    <link rel="stylesheet" href="./visual-polish.css">',
        1,
    )
fufu_html.write_text(text)
Path("demo/fufu-bakery/visual-polish.css").write_text(
    """/* Balanced 390x844 welcome composition. */
.welcome-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 31px 20px;
}
.welcome-brand { margin-top: 0; }
.welcome-subtitle { margin: 4px 0 0; }
.welcome-visual {
  width: 286px;
  height: 336px;
  margin-top: 0;
}
.welcome-note {
  max-width: 250px;
  margin: 0;
}
.welcome-view .primary-button {
  flex: 0 0 auto;
  min-height: 52px;
  margin-top: 14px;
}
"""
)

# Local aliases may size the component but may not draw hardware.
for css in [
    "demo/fufu-bakery/styles.css",
    "demo/fithub/styles.css",
    "demo/mimo-activities/styles.css",
]:
    strip_phone_hardware(css)

# Mimo: inset the bottom navigation so its translucent background does not read
# as a rectangular slab colliding with the rounded screen edge.
mimo_html = Path("demo/mimo-activities/index.html")
text = mimo_html.read_text()
if "./visual-polish.css" not in text:
    marker = '<link rel="stylesheet" href="../iphone-frame.css">'
    marker2 = '<link rel="stylesheet" href="../iphone-frame.css" />'
    if marker in text:
        text = text.replace(marker, marker + '\n    <link rel="stylesheet" href="./visual-polish.css">', 1)
    elif marker2 in text:
        text = text.replace(marker2, marker2 + '\n    <link rel="stylesheet" href="./visual-polish.css" />', 1)
    else:
        raise SystemExit("Mimo shared PhoneShell link not found")
mimo_html.write_text(text)
Path("demo/mimo-activities/visual-polish.css").write_text(
    """/* Keep bottom navigation visually inside the rounded screen. */
.app-view { inset-bottom: 88px; }
.tabbar {
  right: 12px;
  bottom: 14px;
  left: 12px;
  height: 60px;
  padding: 3px 18px 10px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 23px;
  background: linear-gradient(180deg, rgba(61,59,137,.68), rgba(49,47,119,.94));
  box-shadow: 0 8px 22px rgba(34,32,99,.18);
  backdrop-filter: blur(14px);
}
.tab { min-height: 46px; }
"""
)

# FitHub: use existing canonical screen-only states for the Library Demo video.
preview_config = Path("library-preview-config.mjs")
config = preview_config.read_text()
old_set = 'const sequencePreferredCaseIds = new Set(["museum", "organique"]);'
new_set = 'const sequencePreferredCaseIds = new Set(["museum", "organique", "fithub"]);'
if old_set in config:
    config = config.replace(old_set, new_set, 1)
elif new_set not in config:
    raise SystemExit("sequencePreferredCaseIds changed unexpectedly")
preview_config.write_text(config)

library = Path("library.js")
source = library.read_text()
old_import = 'import { getLibraryPreviewDevice, libraryPreviewAssetVersion } from "./library-preview-config.mjs";'
new_import = 'import { getLibraryPreviewDevice, getLibraryPreviewProfile, libraryPreviewAssetVersion } from "./library-preview-config.mjs";'
if old_import in source:
    source = source.replace(old_import, new_import, 1)
elif new_import not in source:
    raise SystemExit("Library preview config import changed unexpectedly")

old_function = """function getVideoSequence(guide) {
  const sequence = guide?.videoSequence;
  if (!sequence || !Number.isFinite(sequence.duration) || sequence.duration <= 0 || !sequence.frames?.length) return null;
  return sequence;
}"""
new_function = """function getVideoSequence(guide) {
  const sequence = guide?.videoSequence;
  if (sequence && Number.isFinite(sequence.duration) && sequence.duration > 0 && sequence.frames?.length) return sequence;

  const profile = getLibraryPreviewProfile(guide?.id);
  const screenFrames = previewImageSets[guide?.id];
  if (profile?.motionKind !== \"screen-sequence\" || !screenFrames?.length) return null;

  const secondsPerFrame = 2;
  return {
    duration: screenFrames.length * secondsPerFrame,
    frames: screenFrames.map((frame, index) => ({ ...frame, at: index * secondsPerFrame })),
  };
}"""
if old_function in source:
    source = source.replace(old_function, new_function, 1)
elif new_function not in source:
    raise SystemExit("getVideoSequence changed unexpectedly")
library.write_text(source)

Path("tests/visual-regressions.test.mjs").write_text(
    """import assert from \"node:assert/strict\";
import { readFileSync } from \"node:fs\";
import path from \"node:path\";
import test from \"node:test\";
import { fileURLToPath } from \"node:url\";
import { getLibraryPreviewProfile } from \"../library-preview-config.mjs\";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), \"..\");
const read = (file) => readFileSync(path.join(root, file), \"utf8\");

function primaryPhoneRule(css) {
  return css.match(/\\.phone\\s*\\{([^}]*)\\}/s)?.[1] || \"\";
}

test(\"FuFu loads its balanced welcome composition\", () => {
  const html = read(\"demo/fufu-bakery/index.html\");
  const polish = read(\"demo/fufu-bakery/visual-polish.css\");
  assert.match(html, /visual-polish\\.css/);
  assert.match(polish, /justify-content:\\s*center/);
  assert.match(polish, /height:\\s*336px/);
  assert.doesNotMatch(polish, /margin-top:\\s*auto/);
});

test(\"FitHub derives Demo video from canonical screen frames\", () => {
  const profile = getLibraryPreviewProfile(\"fithub\");
  const library = read(\"library.js\");
  assert.equal(profile?.motionKind, \"screen-sequence\");
  assert.match(library, /screenFrames = previewImageSets\\[guide\\?\\.id\\]/);
  assert.match(library, /secondsPerFrame = 2/);
});

test(\"Mimo bottom navigation is inset from the rounded screen edge\", () => {
  const html = read(\"demo/mimo-activities/index.html\");
  const polish = read(\"demo/mimo-activities/visual-polish.css\");
  assert.match(html, /visual-polish\\.css/);
  assert.match(polish, /right:\\s*12px/);
  assert.match(polish, /left:\\s*12px/);
  assert.match(polish, /border-radius:\\s*23px/);
});

test(\"these case-local phone aliases no longer own device hardware\", () => {
  for (const file of [
    \"demo/fufu-bakery/styles.css\",
    \"demo/fithub/styles.css\",
    \"demo/mimo-activities/styles.css\",
  ]) {
    const rule = primaryPhoneRule(read(file));
    assert.doesNotMatch(rule, /(?:padding|border|border-radius|background|box-shadow)\\s*:/, `${file} must leave device chrome to PhoneShell`);
  }
});
"""
)
