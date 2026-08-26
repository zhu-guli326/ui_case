import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(path.join(root, "src/features/skills/skills.js"), "utf8");
const detailSource = readFileSync(path.join(root, "src/features/skills/skill-detail.js"), "utf8");

function recordsBetween(start, end) {
  const block = source.slice(source.indexOf(start), source.indexOf(end));
  return [...block.matchAll(/\{\s*([^\n]+?)\s*\},?/g)].map((match) => match[1]);
}

function value(record, key) {
  return record.match(new RegExp(`${key}:\\s*"([^"]+)"`))?.[1] || "";
}

function localPath(assetPath) {
  return path.join(root, assetPath.replace(/^\.\//, ""));
}

test("a replacement skill asset removes its superseded canonical screenshot", () => {
  const records = recordsBetween("const repositories = [", "const repositoriesEn = [");
  for (const record of records) {
    const slug = value(record, "slug");
    const replacement = value(record, "coverSrc") || value(record, "coverImage");
    if (!slug || !replacement) continue;
    const canonical = `./assets/skills/repositories/${slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.jpg`;
    assert.ok(existsSync(localPath(replacement)), `missing replacement for ${slug}: ${replacement}`);
    if (replacement === canonical) continue;
    assert.equal(existsSync(localPath(canonical)), false, `obsolete skill asset still exists: ${canonical}`);
  }
});

test("a replacement website asset removes its superseded canonical screenshot", () => {
  const records = recordsBetween("const designReferenceWebsites = [", "const skillsTranslations = {");
  for (const record of records) {
    const domain = value(record, "domain");
    const replacement = value(record, "previewSrc") || value(record, "previewImage");
    if (!domain || !replacement) continue;
    const canonical = `./assets/skills/web/${domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.jpg`;
    assert.ok(existsSync(localPath(replacement)), `missing replacement for ${domain}: ${replacement}`);
    if (replacement === canonical) continue;
    assert.equal(existsSync(localPath(canonical)), false, `obsolete website asset still exists: ${canonical}`);
  }
});

test("video replacements never fall back to an implicit legacy poster", () => {
  assert.doesNotMatch(source, /poster="\$\{escapeHtml\(poster\)\}"/);
  assert.doesNotMatch(detailSource, /repositories\/\$\{skill\.slug[\s\S]*?\.jpg/);
  assert.match(source, /item\.coverImage \? ` poster=/);
  assert.match(source, /item\.previewImage \? ` poster=/);
});

test("the curated skill view puts cards with replacement media first", () => {
  assert.match(source, /function hasReplacementCover\(item\)/);
  assert.match(source, /return items\.sort\(\(a, b\) => Number\(hasReplacementCover\(b\)\) - Number\(hasReplacementCover\(a\)\)\)/);
  assert.ok(
    source.indexOf('if (activeSort === "UPDATED")') < source.indexOf("return items.sort((a, b) => Number(hasReplacementCover(b))"),
    "fresh-media priority must only apply after explicit sort modes",
  );
});
