import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the site shell exposes one offline-safe CJK font policy", async () => {
  const typography = await read("src/core/app-shell/typography.css");
  assert.match(typography, /--font-sans-cjk:\s*system-ui,/);
  assert.match(typography, /"PingFang SC"/);
  assert.match(typography, /"Microsoft YaHei"/);
  assert.match(typography, /html\[lang\^="zh"\]\s*\{[^}]*font-synthesis:\s*none/s);
  assert.match(typography, /:where\(h1, h2, h3, h4, h5, h6, p, blockquote\)\s*\{[^}]*letter-spacing:\s*0/s);
});

test("shared shell styles import typography before component rules", async () => {
  for (const path of [
    "src/components/site-header/site-header.css",
    "src/components/site-header/site-footer.css",
  ]) {
    const css = await read(path);
    assert.match(css, /^@import url\("\.\.\/\.\.\/core\/app-shell\/typography\.css"\);/);
  }
});

test("primary site pages consume shared font variables", async () => {
  const paths = [
    "learn.css",
    "src/features/brands/brands.css",
    "src/features/library/library.css",
    "src/features/markdown/markdown.css",
    "src/features/skills/skills.css",
    "src/features/skills/skill-detail.css",
    "src/features/vocabulary/vocabulary.css",
    "src/features/launcher/launcher.css",
    "src/features/launcher/launcher-workspace.css",
    "lab/lab.css",
  ];
  for (const path of paths) {
    const css = await read(path);
    assert.match(css, /var\(--font-(?:sans|display)-cjk\)/, `${path} should use the shared CJK tokens`);
  }
});

test("Learn removes Latin tracking and synthetic weights from Chinese display copy", async () => {
  const css = await read("learn.css");
  assert.match(css, /html\[lang="zh-CN"\] \.sample-hero h3,/);
  assert.match(css, /html\[lang="zh-CN"\] \.prompt-step p,/);
  assert.match(css, /font-weight:\s*700;/);
  assert.match(css, /font-weight:\s*600;/);
  assert.doesNotMatch(css, /font-family:[^;}]*\bInter\b/);
});
