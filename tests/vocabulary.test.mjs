import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { localizeVocabularyEntry, vocabularyById, vocabularyCategories, vocabularyEnglishById, vocabularyEntries } from "../vocabulary-data.js";
import { DEFAULT_VOCABULARY_PREVIEW_IMAGE, SUPPORTED_VOCABULARY_PREVIEW_IDS, vocabularyPreviewMarkup } from "../vocabulary-preview.js";
import { vocabularyComponentEntries } from "../src/features/vocabulary/vocabulary-component-data.js";

const contentCategories = vocabularyCategories.filter((category) => !["all", "favorites"].includes(category.id));
const requiredCoverage = ["sidebar", "breadcrumbs", "data-table", "checkbox", "menu", "skeleton"];
const vocabularyCss = readFileSync(new URL("../src/features/vocabulary/vocabulary.css", import.meta.url), "utf8");
const vocabularyScript = readFileSync(new URL("../vocabulary.js", import.meta.url), "utf8");
const vocabularyHtml = readFileSync(new URL("../vocabulary.html", import.meta.url), "utf8");

test("illustrated vocabulary entries stay complete and internally linked", () => {
  const allCategory = vocabularyCategories.find((category) => category.id === "all");
  assert.equal(vocabularyEntries.length, 37);
  assert.equal(vocabularyEntries.length, Number(allCategory?.countLabel));
  assert.equal(new Set(vocabularyEntries.map((entry) => entry.id)).size, vocabularyEntries.length);
  assert.equal(Object.keys(vocabularyById).length, vocabularyEntries.length);
  assert.equal(Object.keys(vocabularyEnglishById).length, vocabularyEntries.length);
  assert.ok(requiredCoverage.every((id) => vocabularyById[id]), "high-value vocabulary gaps must stay covered");

  for (const category of contentCategories) {
    const entries = vocabularyEntries.filter((entry) => entry.category === category.id);
    assert.equal(entries.length, Number(category.countLabel), `${category.id} count`);
  }

  for (const entry of vocabularyEntries) {
    for (const field of ["name", "en", "ask", "definition", "role", "prompt", "confusedWith", "source"]) {
      assert.ok(entry[field], `${entry.id} missing ${field}`);
    }
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
  assert.deepEqual(new Set(SUPPORTED_VOCABULARY_PREVIEW_IDS), new Set(vocabularyEntries.map((entry) => entry.id)));
  assert.equal(SUPPORTED_VOCABULARY_PREVIEW_IDS.length, vocabularyEntries.length);

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

test("vocabulary has no separate detail-page route", () => {
  assert.doesNotMatch(vocabularyHtml, /termDialog|term-dialog/);
  assert.doesNotMatch(vocabularyScript, /data-open-navigation-term|打开详情|Open related term/);
});

test("category filtering has one visible navigation owner", () => {
  assert.doesNotMatch(vocabularyHtml, /categoryChips|category-chips/);
  assert.doesNotMatch(vocabularyScript, /categoryChips|category-chip/);
  assert.match(vocabularyHtml, /id="taxonomyNav"/);
  assert.match(vocabularyScript, /taxonomyNav\.innerHTML = html/);
});

test("navigation deep dive is owned by the navigation category", () => {
  assert.match(vocabularyHtml, /id="navigationDeepDive"[^>]*hidden/);
  assert.match(
    vocabularyHtml,
    /<section class="results-column"[^>]*>[\s\S]*?<section class="navigation-deep-dive"[^>]*>[\s\S]*?<div class="entry-grid"/,
    "the navigation guide must stay embedded in the results column before the regular term grid",
  );
  assert.match(vocabularyScript, /const showsNavigationDeepDive = \(\) => false;/);
  assert.match(vocabularyScript, /navigationDeepDive\.hidden = !showsNavigationDeepDive\(\)/);
  assert.match(vocabularyScript, /entryGrid\.innerHTML = navigationMode \? "" : list\.map\(cardMarkup\)\.join\(""\);/);
  assert.match(vocabularyScript, /const displayedCount = list\.length;/);
  assert.match(vocabularyScript, /return vocabularyEntries\.filter\(\(entry\) => entry\.category === id\)\.length;/);
});

test("component cards render copy before their visual specimen", () => {
  const cardFunction = vocabularyScript.slice(vocabularyScript.indexOf("function cardMarkup"), vocabularyScript.indexOf("function renderEntries"));
  const metaIndex = cardFunction.indexOf("entry-card-meta");
  const titleIndex = cardFunction.indexOf("<h3>");
  const askIndex = cardFunction.indexOf("entry-ask");
  const previewIndex = cardFunction.indexOf("${previewMarkup(entry)}");

  assert.ok(metaIndex >= 0 && metaIndex < titleIndex, "category and favorite must appear before the title");
  assert.ok(titleIndex < askIndex, "title must appear before the plain-language request");
  assert.ok(askIndex < previewIndex, "copy must appear before the visual specimen");
  assert.ok(previewIndex >= 0, "the visual specimen must be rendered on the card");
});

test("every component card exposes an accessible two-sided flip interaction", () => {
  const cardFunction = vocabularyScript.slice(vocabularyScript.indexOf("function cardMarkup"), vocabularyScript.indexOf("function setCardFlipped"));
  assert.match(cardFunction, /entry-card-front/);
  assert.match(cardFunction, /entry-card-back/);
  assert.match(cardFunction, /entry-flip-tag/);
  assert.doesNotMatch(cardFunction, /visual-label/);
  assert.match(cardFunction, /entry-card-back-insight/);
  assert.match(cardFunction, /entry-card-back-visual/);
  assert.match(cardFunction, /detailPreviewMarkup\(entry\)/);
  assert.match(cardFunction, /data-copy-prompt/);
  assert.doesNotMatch(cardFunction, /entry-open-button|data-open-term|打开详情/);
  assert.match(cardFunction, /data-flip-card/g);
  assert.doesNotMatch(cardFunction, /entry-flip-hint|entry-flip-button|完整方案 · 已翻转/);
  assert.match(cardFunction, /aria-pressed="false"/);
  assert.match(cardFunction, /entry-card-back[^>]*aria-hidden="true"[^>]*inert/);
  assert.match(vocabularyScript, /function setCardFlipped/);
  assert.match(vocabularyScript, /front\.inert = flipped/);
  assert.match(vocabularyScript, /back\.querySelector\("\.entry-flip-hitarea"\)/);
  assert.match(vocabularyScript, /back\.inert = !flipped/);
  assert.match(vocabularyCss, /\.entry-card\.is-flipped \.entry-card-inner\s*\{[^}]*rotateY\(180deg\)/s);
  assert.match(vocabularyCss, /\.entry-card-front\s*\{[^}]*linear-gradient/s);
  assert.match(vocabularyCss, /\.entry-card-back-insight/);
  assert.match(vocabularyCss, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]{0,240}\.entry-card-inner/);
});

test("flipped cards expose a one-click prompt copy action", () => {
  const renderEntriesFunction = vocabularyScript.slice(vocabularyScript.indexOf("function renderEntries"), vocabularyScript.indexOf("function render()"));
  assert.match(renderEntriesFunction, /\[data-copy-prompt\]/);
  assert.match(renderEntriesFunction, /copyPrompt\(button\.dataset\.copyPrompt\)/);
});

test("navigation terms use their own distinct preview factories", () => {
  assert.doesNotMatch(vocabularyScript, /entry\.category === "navigation" && !entry\.componentKind/g);

  const navigationPreviews = vocabularyEntries
    .filter((entry) => entry.category === "navigation")
    .map((entry) => vocabularyPreviewMarkup(entry, { language: "zh" }));
  assert.equal(new Set(navigationPreviews).size, navigationPreviews.length, "navigation terms must not share one generic preview");

  for (const kind of ["hero", "card", "tabs"]) {
    const entries = vocabularyComponentEntries.filter((entry) => entry.componentKind === kind);
    const previews = entries.map((entry) => vocabularyPreviewMarkup(entry, { language: "zh" }));
    assert.equal(new Set(previews).size, entries.length, `${kind} component previews must be distinct`);
  }

  const tabPreviews = vocabularyComponentEntries
    .filter((entry) => entry.componentKind === "tabs")
    .map((entry) => vocabularyPreviewMarkup(entry, { language: "zh" }));
  assert.ok(tabPreviews.some((markup) => markup.includes("vp-variant-scene--vertical")), "vertical tabs need a vertical specimen");
  assert.ok(tabPreviews.some((markup) => markup.includes("vp-variant-scene--scroll")), "scrollable tabs need a scrolling specimen");
  assert.ok(tabPreviews.every((markup) => !markup.includes("让复杂界面变得清楚")), "tab specimens must not fall back to the navigation marketing page");
});

test("page foundation includes seven distinct layout choices", () => {
  const layoutIds = ["layout-single-column", "layout-landing-page", "layout-masonry", "layout-fullscreen", "layout-split-pane", "layout-dashboard", "layout-modular"];
  const entries = layoutIds.map((id) => vocabularyById[id]);
  assert.ok(entries.every(Boolean), "all seven layout terms must exist");
  assert.ok(entries.every((entry) => entry.category === "foundation"), "layout terms belong to page foundations");
  assert.equal(new Set(entries.map((entry) => entry.prompt)).size, layoutIds.length, "every layout needs a distinct prompt");
  const previews = entries.map((entry) => vocabularyPreviewMarkup(entry, { language: "zh" }));
  assert.equal(new Set(previews).size, layoutIds.length, "every layout needs a distinct visual specimen");
});
