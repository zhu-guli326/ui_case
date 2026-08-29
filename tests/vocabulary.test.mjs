import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  localizeVocabularyEntry,
  vocabularyById,
  vocabularyCategories,
  vocabularyEnglishById,
  vocabularyEntries,
} from "../src/features/vocabulary/vocabulary-data.js";
import {
  DEFAULT_VOCABULARY_PREVIEW_IMAGE,
  SUPPORTED_VOCABULARY_PREVIEW_IDS,
  vocabularyPreviewMarkup,
} from "../src/features/vocabulary/vocabulary-preview.js";
import { resolveVocabularyCategoryIntent } from "../src/features/vocabulary/vocabulary-search.mjs";
import { vocabularyComponentEntries } from "../src/features/vocabulary/vocabulary-component-data.js";

const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
const vocabularyScript = read("src/features/vocabulary/vocabulary.js");
const vocabularyHtml = read("vocabulary.html");
const vocabularyCss = read("src/features/vocabulary/vocabulary.css");
const cardsCss = read("src/features/vocabulary/styles/cards.css");
const flipCss = read("src/features/vocabulary/styles/flip-card.css");
const detailCss = read("src/features/vocabulary/styles/detail.css");
const responsiveCss = read("src/features/vocabulary/styles/responsive.css");
const contentCategories = vocabularyCategories.filter((category) => !["all", "favorites"].includes(category.id));
const requiredCoverage = ["sidebar", "breadcrumbs", "data-table", "checkbox", "menu", "skeleton"];

test("illustrated vocabulary entries stay complete and internally linked", () => {
  const allCategory = vocabularyCategories.find((category) => category.id === "all");
  assert.equal(vocabularyEntries.length, 44);
  assert.equal(vocabularyEntries.length, Number(allCategory?.countLabel));
  assert.equal(new Set(vocabularyEntries.map((entry) => entry.id)).size, vocabularyEntries.length);
  assert.equal(Object.keys(vocabularyById).length, vocabularyEntries.length);
  assert.equal(Object.keys(vocabularyEnglishById).length, vocabularyEntries.length);
  assert.ok(requiredCoverage.every((id) => vocabularyById[id]));

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
    assert.match(entry.example.src, /^https:\/\//, `${entry.id} media must use HTTPS`);
    assert.equal(entry.example.source, "external-placeholder");
    assert.ok(entry.example.alt && entry.example.caption);
    assert.equal("image2" in entry, false);

    const englishEntry = localizeVocabularyEntry(entry, "en");
    for (const field of ["name", "ask", "definition", "role", "prompt", "confusedWith"]) {
      assert.ok(englishEntry[field] && englishEntry[field] !== entry[field], `${entry.id} missing distinct English ${field}`);
    }
    assert.ok(entry.related.every((id) => vocabularyById[id]), `${entry.id} has an unknown related term`);
    assert.ok(!entry.related.includes(entry.id), `${entry.id} must not relate to itself`);
  }
});

test("every base vocabulary entry has a code-rendered preview", () => {
  assert.deepEqual(new Set(SUPPORTED_VOCABULARY_PREVIEW_IDS), new Set(vocabularyEntries.map((entry) => entry.id)));
  assert.equal(SUPPORTED_VOCABULARY_PREVIEW_IDS.length, vocabularyEntries.length);

  for (const entry of vocabularyEntries) {
    const markup = vocabularyPreviewMarkup(entry, { imageUrl: entry.example.src, language: "zh" });
    assert.match(markup, new RegExp(`data-vocabulary-preview="${entry.id}"`));
    assert.doesNotMatch(markup, /<\/?(?:button|input|select|textarea)\b/i, `${entry.id} preview must not add nested controls`);
    for (const match of markup.matchAll(/\bsrc="([^"]+)"/g)) {
      assert.match(match[1], /^https:\/\//, `${entry.id} preview image must be HTTPS`);
    }
  }

  const insecureMarkup = vocabularyPreviewMarkup("hero", { imageUrl: "http://example.com/unsafe.jpg" });
  assert.ok(insecureMarkup.includes(DEFAULT_VOCABULARY_PREVIEW_IMAGE.replaceAll("&", "&amp;")));
  assert.doesNotMatch(insecureMarkup, /http:\/\/example\.com/);
});

test("Vocabulary page loads the canonical feature runtime", () => {
  assert.match(vocabularyHtml, /src\/features\/vocabulary\/vocabulary\.css/);
  assert.match(vocabularyHtml, /src\/features\/vocabulary\/vocabulary\.js/);
  assert.doesNotMatch(vocabularyHtml, /src="\.\/vocabulary\.js/);
  assert.doesNotMatch(vocabularyHtml, /href="\.\/vocabulary\.css/);
});

test("Vocabulary stylesheet is split by responsibility", () => {
  assert.match(vocabularyCss, /styles\/cards\.css/);
  assert.match(vocabularyCss, /styles\/flip-card\.css/);
  assert.match(vocabularyCss, /styles\/detail\.css/);
  assert.match(vocabularyCss, /styles\/responsive\.css/);
  assert.match(cardsCss, /cards-01\.css/);
  assert.match(flipCss, /flip-01\.css/);
  assert.match(detailCss, /detail-01\.css/);
  assert.match(responsiveCss, /responsive-01\.css/);
});

test("vocabulary opens details in an accessible same-page dialog", () => {
  assert.match(vocabularyHtml, /<dialog[^>]+id="termDialog"/);
  assert.match(vocabularyHtml, /id="termDialogContent"/);
  assert.match(vocabularyScript, /function openTerm/);
  assert.match(vocabularyScript, /initialTermId/);
  assert.match(vocabularyScript, /function detailGuideMarkup/);
  assert.match(vocabularyScript, /detail-decision-grid/);
  assert.match(vocabularyScript, /detail-brief-options/);
});

test("category filtering has one visible navigation owner", () => {
  assert.doesNotMatch(vocabularyHtml, /categoryChips|category-chips/);
  assert.doesNotMatch(vocabularyScript, /categoryChips|category-chip/);
  assert.match(vocabularyHtml, /id="taxonomyNav"/);
  assert.match(vocabularyScript, /taxonomyNav\.innerHTML = html/);
});

test("only cards with dedicated state experiences expose flip behavior", () => {
  const cardFunction = vocabularyScript.slice(vocabularyScript.indexOf("function cardMarkup"), vocabularyScript.indexOf("function setCardFlipped"));
  assert.match(vocabularyScript, /const interactiveVariantIds = new Set/);
  assert.match(cardFunction, /const hasVariants = interactiveVariantIds\.has\(entry\.id\)/);
  assert.match(cardFunction, /entry-card-front/);
  assert.match(cardFunction, /entry-card-back/);
  assert.match(cardFunction, /entry-flip-tag/);
  assert.match(cardFunction, /data-copy-prompt/);
  assert.match(vocabularyScript, /function setCardFlipped/);
  assert.match(vocabularyScript, /front\.inert = flipped/);
  assert.match(vocabularyScript, /back\.inert = !flipped/);
});

test("flipped cards expose a one-click prompt copy action", () => {
  const renderEntriesFunction = vocabularyScript.slice(vocabularyScript.indexOf("function renderEntries"), vocabularyScript.indexOf("function render()"));
  assert.match(renderEntriesFunction, /\[data-copy-prompt\]/);
  assert.match(renderEntriesFunction, /copyPrompt\(button\.dataset\.copyPrompt\)/);
});

test("navigation terms use distinct preview factories", () => {
  const navigationPreviews = vocabularyEntries
    .filter((entry) => entry.category === "navigation")
    .map((entry) => vocabularyPreviewMarkup(entry, { language: "zh" }));
  assert.equal(new Set(navigationPreviews).size, navigationPreviews.length);

  for (const kind of ["hero", "card", "tabs"]) {
    const entries = vocabularyComponentEntries.filter((entry) => entry.componentKind === kind);
    const previews = entries.map((entry) => vocabularyPreviewMarkup(entry, { language: "zh" }));
    assert.equal(new Set(previews).size, entries.length, `${kind} component previews must be distinct`);
  }
});

test("category words resolve to the matching vocabulary category", () => {
  assert.equal(resolveVocabularyCategoryIntent("导航", vocabularyCategories), "navigation");
  assert.equal(resolveVocabularyCategoryIntent("导航与发现", vocabularyCategories), "navigation");
  assert.equal(resolveVocabularyCategoryIntent("navigation", vocabularyCategories), "navigation");
  assert.equal(resolveVocabularyCategoryIntent("导航栏", vocabularyCategories), null);
  assert.match(vocabularyScript, /resolveVocabularyCategoryIntent\(query, vocabularyCategories\)/);
});

test("page foundation includes seven distinct layout choices", () => {
  const layoutIds = ["layout-single-column", "layout-landing-page", "layout-masonry", "layout-fullscreen", "layout-split-pane", "layout-dashboard", "layout-modular"];
  const entries = layoutIds.map((id) => vocabularyById[id]);
  assert.ok(entries.every(Boolean));
  assert.ok(entries.every((entry) => entry.category === "layout"));
  assert.equal(new Set(entries.map((entry) => entry.prompt)).size, layoutIds.length);
  const previews = entries.map((entry) => vocabularyPreviewMarkup(entry, { language: "zh" }));
  assert.equal(new Set(previews).size, layoutIds.length);
});
