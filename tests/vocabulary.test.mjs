import test from "node:test";
import assert from "node:assert/strict";
<<<<<<< HEAD
import { readFileSync } from "node:fs";

import { localizeVocabularyEntry, vocabularyById, vocabularyCategories, vocabularyEnglishById, vocabularyEntries } from "../vocabulary-data.js";
import { DEFAULT_VOCABULARY_PREVIEW_IMAGE, SUPPORTED_VOCABULARY_PREVIEW_IDS, vocabularyPreviewMarkup } from "../vocabulary-preview.js";

const contentCategories = vocabularyCategories.filter((category) => !["all", "favorites"].includes(category.id));
const requiredCoverage = ["sidebar", "breadcrumbs", "data-table", "checkbox", "menu", "skeleton"];
const vocabularyCss = readFileSync(new URL("../vocabulary.css", import.meta.url), "utf8");
const vocabularyScript = readFileSync(new URL("../vocabulary.js", import.meta.url), "utf8");

test("illustrated vocabulary entries stay complete and internally linked", () => {
  const allCategory = vocabularyCategories.find((category) => category.id === "all");
  assert.equal(vocabularyEntries.length, 30);
  assert.equal(vocabularyEntries.length, Number(allCategory?.countLabel));
  assert.equal(new Set(vocabularyEntries.map((entry) => entry.id)).size, vocabularyEntries.length);
  assert.equal(Object.keys(vocabularyById).length, vocabularyEntries.length);
  assert.equal(Object.keys(vocabularyEnglishById).length, vocabularyEntries.length);
  assert.ok(requiredCoverage.every((id) => vocabularyById[id]), "high-value vocabulary gaps must stay covered");
=======
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { vocabularyById, vocabularyCategories, vocabularyEntries } from "../vocabulary-data.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentCategories = vocabularyCategories.filter((category) => !["all", "favorites"].includes(category.id));

test("illustrated vocabulary entries stay complete and internally linked", () => {
  assert.equal(vocabularyEntries.length, 24);
  assert.equal(new Set(vocabularyEntries.map((entry) => entry.id)).size, vocabularyEntries.length);
  assert.equal(Object.keys(vocabularyById).length, vocabularyEntries.length);
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074

  for (const category of contentCategories) {
    const entries = vocabularyEntries.filter((entry) => entry.category === category.id);
    assert.equal(entries.length, Number(category.countLabel), `${category.id} count`);
  }

  for (const entry of vocabularyEntries) {
    for (const field of ["name", "en", "ask", "definition", "role", "prompt", "confusedWith", "source"]) {
      assert.ok(entry[field], `${entry.id} missing ${field}`);
    }
<<<<<<< HEAD
    for (const field of ["tags", "anatomy", "variants", "states", "useWhen", "avoidWhen", "codeUI", "media", "related"]) {
      assert.ok(Array.isArray(entry[field]) && entry[field].length > 0, `${entry.id} missing ${field}`);
    }
    for (const field of ["anatomy", "variants", "states"]) {
      assert.ok(entry[field].every((row) => Array.isArray(row) && row.length === 2 && row.every(Boolean)), `${entry.id} ${field} rows must be complete pairs`);
    }

    assert.match(entry.example.src, /^https:\/\//, `${entry.id} must use an external HTTPS placeholder`);
    assert.equal(entry.example.source, "external-placeholder", `${entry.id} image source contract`);
    assert.ok(entry.example.alt && entry.example.caption, `${entry.id} image needs alt text and a caption`);
    assert.equal("image2" in entry, false, `${entry.id} should expose media guidance instead of image generation instructions`);
    const englishEntry = localizeVocabularyEntry(entry, "en");
    for (const field of ["name", "ask", "definition", "role", "prompt", "confusedWith"]) {
      assert.ok(englishEntry[field] && englishEntry[field] !== entry[field], `${entry.id} missing distinct English ${field}`);
    }
    for (const field of ["tags", "anatomy", "variants", "states", "useWhen", "avoidWhen", "codeUI", "media"]) {
      assert.ok(Array.isArray(englishEntry[field]) && englishEntry[field].length > 0, `${entry.id} missing English ${field}`);
    }
    assert.match(englishEntry.example.src, /^https:\/\//, `${entry.id} English media must use an external HTTPS placeholder`);
    assert.ok(Array.isArray(englishEntry.media) && englishEntry.media.length > 0, `${entry.id} English media guidance`);
    assert.equal("image2" in englishEntry, false, `${entry.id} English copy should not expose image generation instructions`);
    assert.ok(entry.related.every((id) => vocabularyById[id]), `${entry.id} has an unknown related term`);
    assert.ok(!entry.related.includes(entry.id), `${entry.id} must not relate to itself`);
  }

  for (const entry of vocabularyEntries) {
    assert.ok(vocabularyEntries.some((candidate) => candidate.related.includes(entry.id)), `${entry.id} must be discoverable from another term`);
  }
});

test("every vocabulary entry has a code-rendered component preview", () => {
  assert.deepEqual(SUPPORTED_VOCABULARY_PREVIEW_IDS, vocabularyEntries.map((entry) => entry.id));

  for (const entry of vocabularyEntries) {
    const markup = vocabularyPreviewMarkup(entry, { imageUrl: entry.example.src, language: "zh" });
    assert.match(markup, new RegExp(`data-vocabulary-preview="${entry.id}"`));
    assert.doesNotMatch(markup, /<\/?(?:button|input|select|textarea)\b/i, `${entry.id} preview must not add nested controls`);
    assert.doesNotMatch(markup, /(?:generated-v2|\.\/assets\/)/i, `${entry.id} preview must not reference generated or local images`);
    for (const match of markup.matchAll(/\bsrc="([^"]+)"/g)) {
      assert.match(match[1], /^https:\/\//, `${entry.id} preview image must be external HTTPS media`);
    }
  }

  const insecureMarkup = vocabularyPreviewMarkup("hero", { imageUrl: "http://example.com/unsafe.jpg" });
  assert.ok(insecureMarkup.includes(DEFAULT_VOCABULARY_PREVIEW_IMAGE.replaceAll("&", "&amp;")));
  assert.doesNotMatch(insecureMarkup, /http:\/\/example\.com/);
  assert.match(insecureMarkup, /referrerpolicy="no-referrer"/);
});

test("term details keep exactly one vertical scroll owner", () => {
  assert.match(vocabularyCss, /\.term-dialog\s*\{[^}]*overflow:\s*hidden;/s);
  assert.match(vocabularyCss, /\.term-dialog-shell\s*\{[^}]*overflow:\s*hidden;/s);
  assert.match(vocabularyCss, /\.term-dialog-content\s*\{[^}]*overflow-y:\s*auto;/s);
  assert.match(vocabularyCss, /html\.term-dialog-open\s*\{[^}]*overflow:\s*hidden;/s);
  assert.match(vocabularyScript, /classList\.add\("term-dialog-open"\)/);
  assert.match(vocabularyScript, /classList\.remove\("term-dialog-open"\)/);
});
=======
    for (const field of ["tags", "anatomy", "variants", "states", "useWhen", "avoidWhen", "codeUI", "image2", "related"]) {
      assert.ok(Array.isArray(entry[field]) && entry[field].length > 0, `${entry.id} missing ${field}`);
    }

    const imagePath = path.resolve(repoRoot, entry.example.src.replace(/^\.\//, ""));
    assert.ok(fs.existsSync(imagePath), `${entry.id} missing image ${entry.example.src}`);
    const generatedCoverPath = path.resolve(repoRoot, "assets/vocabulary/generated-v2/covers", `${entry.id}.webp`);
    assert.ok(fs.existsSync(generatedCoverPath), `${entry.id} missing generated cover`);
    assert.equal(entry.example.src, `./assets/vocabulary/generated-v2/covers/${entry.id}.webp`, `${entry.id} must use its paired cover`);
    assert.ok(entry.example.alt && entry.example.caption, `${entry.id} image needs alt text and a caption`);
    assert.ok(entry.related.every((id) => vocabularyById[id]), `${entry.id} has an unknown related term`);
  }
});
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
