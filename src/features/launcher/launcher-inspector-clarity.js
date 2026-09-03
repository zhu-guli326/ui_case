const $ = (selector, root = document) => root.querySelector(selector);

const isEn = () => document.documentElement.lang.startsWith("en") || window.image2I18n?.language === "en";

let cleaning = false;

function cleanFontOptionLabels() {
  const select = $("[data-font-select]");
  if (!select || cleaning) return;
  cleaning = true;

  for (const option of select.options) {
    const original = option.textContent || "";
    const cleaned = original
      .replace(/^(设计规范|视觉规范)\s*[·・:：—-]\s*/u, "")
      .replace(/^(Design system|Visual system)\s*[·:—-]\s*/iu, "")
      .trim();
    if (cleaned && cleaned !== original) option.textContent = cleaned;
  }

  cleaning = false;
}

function clarifyComponentDocs() {
  const docs = $("[data-cs-docs]");
  if (!docs) return;
  docs.textContent = isEn() ? "Docs ↗" : "官方文档 ↗";
}

function clarify() {
  cleanFontOptionLabels();
  clarifyComponentDocs();
}

function observeFontOptions() {
  const select = $("[data-font-select]");
  if (!select) return;
  const observer = new MutationObserver(() => cleanFontOptionLabels());
  observer.observe(select, { childList: true, subtree: true, characterData: true });
}

clarify();
observeFontOptions();
window.addEventListener("image2:languagechange", () => queueMicrotask(clarify));
window.addEventListener("ondesign:componentsystemchange", () => queueMicrotask(clarifyComponentDocs));
