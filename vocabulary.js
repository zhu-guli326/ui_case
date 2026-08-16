import { localizeVocabularyEntry, vocabularyCategories, vocabularyEntries, vocabularyById } from "./vocabulary-data.js?v=20260815-vocabulary-30";
import { vocabularyPreviewMarkup } from "./vocabulary-preview.js?v=20260815-vocabulary-30";

document.querySelectorAll(".reference-link").forEach((link) => link.remove());

const STORAGE_KEY = "image2-ui-vocabulary-favorites";
const i18n = window.image2I18n;
let currentLanguage = i18n?.language || "zh";

i18n?.addTranslations({
  "vocabulary.metaDescription": { zh: "图文 UI 词典：用人话、真实案例和可复制提示词看懂界面结构。", en: "An illustrated UI vocabulary for understanding interface structure through plain-language requests, real examples, and copyable prompts." },
  "vocabulary.pageTitle": { zh: "图文 UI 词典 · IMAGE2 UI", en: "Illustrated UI Vocabulary · IMAGE2 UI" },
  "vocabulary.skipResults": { zh: "跳到词条列表", en: "Skip to term list" },
  "vocabulary.backLibrary": { zh: "返回 image2 UI 案例库", en: "Back to the image2 UI library" },
  "vocabulary.mainNav": { zh: "主要导航", en: "Main navigation" },
  "vocabulary.heading": { zh: "图文 UI 词典", en: "Illustrated UI Vocabulary" },
  "vocabulary.intro": { zh: "像看图鉴一样认识界面：先用大白话描述需求，再看它在屏幕上长什么样、由哪些部件组成，以及应该怎样交给 AI 实现。", en: "Learn interfaces like a visual field guide: start with a plain-language request, see how the pattern appears on screen, inspect its parts, and hand it to an AI agent for implementation." },
  "vocabulary.keyTerms": { zh: "个重点词条", en: "key terms" },
  "vocabulary.localExamples": { zh: "代码组件预览", en: "Code-rendered component previews" },
  "vocabulary.copyablePrompts": { zh: "可复制 Agent prompt", en: "Copyable agent prompts" },
  "vocabulary.diagramLabel": { zh: "从用户需求到界面实现的三步示意", en: "Three steps from a user request to interface implementation" },
  "vocabulary.plainRequest": { zh: "人话需求", en: "Plain request" },
  "vocabulary.plainRequestExample": { zh: "“帮我加个按钮”", en: "\"Add a button for me\"" },
  "vocabulary.visualRole": { zh: "视觉角色", en: "UI role" },
  "vocabulary.implementationSplit": { zh: "实现分工", en: "Implementation split" },
  "vocabulary.searchAndFilter": { zh: "词条搜索和筛选", en: "Search and filter terms" },
  "vocabulary.searchLabel": { zh: "搜索 UI 词条", en: "Search UI terms" },
  "vocabulary.searchPlaceholder": { zh: "搜索术语、英文名或你想说的话…", en: "Search a term or describe what you need…" },
  "vocabulary.filterByCategory": { zh: "按分类筛选", en: "Filter by category" },
  "vocabulary.termDirectory": { zh: "词条目录", en: "Term directory" },
  "vocabulary.termHelpTitle": { zh: "看不懂一个词？", en: "Not sure what a term means?" },
  "vocabulary.termHelpBody": { zh: "先点开卡片看“你可能会说”，再对照组成结构和容易混淆。", en: "Open a card and start with the plain-language request, then compare its anatomy and commonly confused patterns." },
  "vocabulary.openGuide": { zh: "打开规范长文", en: "Open the full guide" },
  "vocabulary.allTerms": { zh: "所有词条", en: "All terms" },
  "vocabulary.sort": { zh: "排序", en: "Sort" },
  "vocabulary.sortRecommended": { zh: "推荐顺序", en: "Recommended" },
  "vocabulary.sortName": { zh: "中文名称", en: "Term name" },
  "vocabulary.sortCategory": { zh: "分类", en: "Category" },
  "vocabulary.sortFavorites": { zh: "我的收藏", en: "Favorites first" },
  "vocabulary.resultsIntro": { zh: "从页面基础开始，逐步看到控件、内容和反馈状态。", en: "Start with page foundations, then move through navigation, content, controls, and feedback." },
  "vocabulary.noMatches": { zh: "暂时没有匹配的词条", en: "No matching terms" },
  "vocabulary.noMatchesHint": { zh: "试试更短的关键词，或清除当前分类筛选。", en: "Try a shorter query or clear the current category filter." },
  "vocabulary.clearFilters": { zh: "清除筛选", en: "Clear filters" },
  "vocabulary.fullGuide": { zh: "完整规范：", en: "Full guide: " },
  "vocabulary.fullGuideBody": { zh: "保留了原来的 Markdown 版词典，适合复制到项目文档和 code review。", en: "The original Markdown vocabulary remains available for project documentation and code reviews." },
  "vocabulary.readGuide": { zh: "阅读规范版", en: "Read the guide" },
  "vocabulary.closeDetails": { zh: "关闭词条详情", en: "Close term details" },
});

const tr = (zh, en) => currentLanguage === "en" ? en : zh;
const localizedEntry = (entry, language = currentLanguage) => localizeVocabularyEntry(entry, language);
const localizedEntryById = (id) => localizedEntry(vocabularyById[id]);
const termAliasMarkup = (entry) => currentLanguage === "zh" ? ` <em>${escapeHtml(entry.en)}</em>` : "";
const componentCaption = (entry) => currentLanguage === "en"
  ? `${entry.en} is rendered as a reusable UI component; external imagery is used only as replaceable media.`
  : `${entry.name}由可复用 UI 组件渲染；外部图片只作为可替换的媒体占位。`;

function readStoredValue(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function writeStoredValue(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Storage can be unavailable in privacy mode. */ }
}

function readFavorites() {
  try {
    const parsed = JSON.parse(readStoredValue(STORAGE_KEY) || "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string" && vocabularyById[id]) : []);
  } catch { return new Set(); }
}

const state = {
  query: "",
  category: "all",
  sort: "recommended",
  favorites: readFavorites(),
};

const $ = (selector) => document.querySelector(selector);
const categoryChips = $("#categoryChips");
const taxonomyNav = $("#taxonomyNav");
const entryGrid = $("#entryGrid");
const resultCount = $("#resultCount");
const resultsSummary = $("#resultsSummary");
const emptyState = $("#emptyState");
const termDialog = $("#termDialog");
const termDialogContent = $("#termDialogContent");
const toast = $("#toast");
let dialogReturnEntryId = null;

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));

function persistFavorites() {
  writeStoredValue(STORAGE_KEY, JSON.stringify([...state.favorites]));
}

function focusCategory(id, selector = "[data-category]") {
  [...document.querySelectorAll(selector)].find((button) => button.dataset.category === id)?.focus();
}

function focusDataAttribute(attribute, value) {
  [...document.querySelectorAll(`[${attribute}]`)].find((element) => element.getAttribute(attribute) === value)?.focus();
}

function categoryLabel(id) {
  const category = vocabularyCategories.find((item) => item.id === id);
  return category ? tr(category.label, category.en) : tr("词条", "Term");
}

function matches(entry) {
  if (state.category === "favorites" && !state.favorites.has(entry.id)) return false;
  if (state.category !== "all" && state.category !== "favorites" && entry.category !== state.category) return false;
  const query = state.query.trim().toLocaleLowerCase();
  if (!query) return true;
  const localized = localizedEntry(entry);
  const alternate = currentLanguage === "en" ? entry : localizedEntry(entry, "en");
  const haystack = [localized.name, localized.en, localized.ask, localized.definition, localized.role, localized.tags.join(" "), localized.anatomy.flat().join(" "), alternate.name, alternate.ask, alternate.definition, alternate.tags.join(" ")].join(" ").toLocaleLowerCase();
  return haystack.includes(query);
}

function filteredEntries() {
  const list = vocabularyEntries.filter(matches);
  const locale = currentLanguage === "en" ? "en" : "zh-CN";
  if (state.sort === "az") return [...list].sort((a, b) => localizedEntry(a).name.localeCompare(localizedEntry(b).name, locale));
  if (state.sort === "category") return [...list].sort((a, b) => `${categoryLabel(a.category)}${localizedEntry(a).name}`.localeCompare(`${categoryLabel(b.category)}${localizedEntry(b).name}`, locale));
  if (state.sort === "favorites") return [...list].sort((a, b) => Number(state.favorites.has(b.id)) - Number(state.favorites.has(a.id)) || localizedEntry(a).name.localeCompare(localizedEntry(b).name, locale));
  return list;
}

function renderCategories() {
  const html = vocabularyCategories.map((category) => {
    const selected = state.category === category.id;
    const count = category.id === "favorites" ? state.favorites.size : category.id === "all" ? vocabularyEntries.length : vocabularyEntries.filter((entry) => entry.category === category.id).length;
    return `<button class="category-chip${selected ? " is-selected" : ""}" type="button" data-category="${category.id}" aria-pressed="${selected}"><span>${escapeHtml(tr(category.label, category.en))}</span><b>${count}</b></button>`;
  }).join("");
  categoryChips.innerHTML = html;
  taxonomyNav.innerHTML = html.replaceAll("category-chip", "taxonomy-link");
  [...document.querySelectorAll("[data-category]")].forEach((button) => button.addEventListener("click", () => {
    const category = button.dataset.category;
    const selector = button.classList.contains("taxonomy-link") ? ".taxonomy-link" : ".category-chip";
    state.category = category;
    render();
    focusCategory(category, selector);
  }));
}

function previewMarkup(entry) {
  const localized = localizedEntry(entry);
  const preview = vocabularyPreviewMarkup(entry, { imageUrl: entry.example.src, language: currentLanguage });
  return `<div class="entry-visual" role="img" aria-label="${escapeHtml(tr(`${localized.name}的代码组件预览`, `Code-rendered component preview for ${localized.name}`))}">${preview}<div class="visual-label"><span>${escapeHtml(entry.en)}</span><span>${escapeHtml(entry.category === "visual" ? tr("视觉", "VISUAL") : tr("UI 角色", "UI ROLE"))}</span></div></div>`;
}

function cardMarkup(entry) {
  const localized = localizedEntry(entry);
  const favorite = state.favorites.has(entry.id);
  return `<article class="entry-card" data-entry-id="${escapeHtml(entry.id)}">
    <button class="entry-card-hitarea" type="button" data-open-term="${escapeHtml(entry.id)}" aria-label="${escapeHtml(tr("查看", "View"))} ${escapeHtml(localized.name)} ${escapeHtml(tr("详情", "details"))}"></button>
    ${previewMarkup(entry)}
    <div class="entry-card-body">
      <div class="entry-card-meta"><span>${escapeHtml(categoryLabel(entry.category))}</span><button class="favorite-button${favorite ? " is-favorite" : ""}" type="button" data-favorite="${escapeHtml(entry.id)}" aria-pressed="${favorite}" aria-label="${escapeHtml(favorite ? `${tr("取消收藏", "Remove from favorites")} ${localized.name}` : `${tr("收藏", "Add to favorites")} ${localized.name}`)}" title="${escapeHtml(favorite ? tr("取消收藏", "Remove from favorites") : tr("收藏", "Add to favorites"))}">${favorite ? "★" : "☆"}</button></div>
      <h3>${escapeHtml(localized.name)}${termAliasMarkup(entry)}</h3>
      <p class="entry-ask">“${escapeHtml(localized.ask)}”</p>
      <p class="entry-definition">${escapeHtml(localized.definition)}</p>
      <div class="entry-tags">${localized.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="entry-card-footer"><button class="entry-open-button" type="button" data-open-term="${escapeHtml(entry.id)}">${escapeHtml(tr("打开词条详情", "Open term details"))}<span aria-hidden="true">↗</span></button></div>
    </div>
  </article>`;
}

function renderEntries() {
  const list = filteredEntries();
  entryGrid.innerHTML = list.map(cardMarkup).join("");
  emptyState.hidden = list.length > 0;
  resultCount.textContent = currentLanguage === "en" ? `${list.length} ${list.length === 1 ? "term" : "terms"}` : `${list.length} 条`;
  resultsSummary.textContent = state.query
    ? currentLanguage === "en" ? `${list.length} ${list.length === 1 ? "term matches" : "terms match"} “${state.query}”` : `“${state.query}”匹配 ${list.length} 个词条`
    : state.category === "favorites"
      ? currentLanguage === "en" ? `You saved ${list.length} ${list.length === 1 ? "term" : "terms"}` : `你收藏了 ${list.length} 个词条`
      : currentLanguage === "en" ? `${categoryLabel(state.category)} · ${list.length} ${list.length === 1 ? "term" : "terms"}` : `${categoryLabel(state.category)} · ${list.length} 个词条`;
  document.querySelectorAll("[data-open-term]").forEach((button) => button.addEventListener("click", () => openTerm(button.dataset.openTerm)));
  document.querySelectorAll("[data-favorite]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const id = button.dataset.favorite;
    const adding = !state.favorites.has(id);
    if (adding) state.favorites.add(id); else state.favorites.delete(id);
    persistFavorites();
    render();
    focusDataAttribute("data-favorite", id);
    if (!document.activeElement || document.activeElement === document.body) focusCategory(state.category);
    showToast(adding ? tr("已加入收藏", "Added to favorites") : tr("已取消收藏", "Removed from favorites"));
  }));
}

function render() {
  renderCategories();
  renderEntries();
  $("#entryCount").textContent = vocabularyEntries.length;
}

function listMarkup(items, className = "detail-list") {
  return `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function tableMarkup(rows, headings) {
  return `<div class="detail-table-wrap"><table><thead><tr>${headings.map((heading) => `<th>${escapeHtml(heading)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function relatedEntries(entry) {
  const ids = new Set(entry.related);
  for (const candidate of vocabularyEntries) {
    if (candidate.related.includes(entry.id)) ids.add(candidate.id);
  }
  ids.delete(entry.id);
  return [...ids].map(localizedEntryById).filter(Boolean).slice(0, 8);
}

function openTerm(id, { focusTitle = false } = {}) {
  const baseEntry = vocabularyById[id];
  if (!baseEntry) return;
  const entry = localizedEntry(baseEntry);
  const related = relatedEntries(baseEntry);
  if (!termDialog.open) dialogReturnEntryId = id;
  const favorite = state.favorites.has(entry.id);
  termDialogContent.innerHTML = `<div class="term-detail">
    <div class="detail-topline"><span>${escapeHtml(categoryLabel(entry.category))} · ${escapeHtml(entry.level)}</span><button class="favorite-detail-button" type="button" data-detail-favorite="${escapeHtml(entry.id)}" aria-pressed="${favorite}">${favorite ? tr("★ 已收藏", "★ Saved") : tr("☆ 收藏词条", "☆ Save term")}</button></div>
    <h2 id="termDialogTitle" tabindex="-1">${escapeHtml(entry.name)}${termAliasMarkup(baseEntry)}</h2>
    <div class="detail-tags">${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    <blockquote class="detail-ask">“${escapeHtml(entry.ask)}”</blockquote>
    <p class="detail-definition"><strong>${escapeHtml(entry.definition)}</strong> ${escapeHtml(entry.role)}</p>
    <figure class="detail-figure"><div class="detail-preview" role="img" aria-label="${escapeHtml(tr(`${entry.name}的代码组件预览`, `Code-rendered component preview for ${entry.name}`))}">${vocabularyPreviewMarkup(entry, { imageUrl: entry.example.src, language: currentLanguage })}</div><figcaption>${escapeHtml(componentCaption(entry))}</figcaption></figure>
    <div class="detail-columns">
      <section><h3>${tr("组成结构 · Anatomy", "Anatomy")}</h3>${tableMarkup(entry.anatomy, [tr("部件", "Part"), tr("它负责什么", "Responsibility")])}</section>
      <section><h3>${tr("常见变体 · Variants", "Common variants")}</h3>${tableMarkup(entry.variants, [tr("变体", "Variant"), tr("什么时候用", "When to use")])}</section>
    </div>
    <div class="detail-columns">
      <section><h3>${tr("状态与响应式", "States and responsive behavior")}</h3>${tableMarkup(entry.states, [tr("状态", "State"), tr("实现提示", "Implementation hint")])}</section>
      <section><h3>${tr("什么时候用 / 不用", "When to use or avoid")}</h3><h4>${tr("适合", "Use when")}</h4>${listMarkup(entry.useWhen)}<h4>${tr("不要硬用", "Avoid when")}</h4>${listMarkup(entry.avoidWhen)}</section>
    </div>
    <section class="split-panel"><div><h3>code-ui</h3>${listMarkup(entry.codeUI, "compact-list")}</div><div><h3>${tr("外部媒体占位", "External media placeholders")}</h3>${listMarkup(entry.media, "compact-list")}</div></section>
    <section class="prompt-panel"><div class="prompt-heading"><h3>${tr("你可以这样告诉 AI Agent", "Tell your AI agent this")}</h3><button class="copy-prompt-button" type="button" data-copy-prompt="${escapeHtml(entry.id)}">${tr("复制 prompt", "Copy prompt")}</button></div><pre id="prompt-${escapeHtml(entry.id)}"><code>${escapeHtml(entry.prompt)}</code></pre></section>
    <section class="confusion-panel"><h3>${tr("容易混淆", "Commonly confused")}</h3><p>${escapeHtml(entry.confusedWith)}</p><p class="related-terms"><strong>${tr("相关词：", "Related terms: ")}</strong>${related.map((relatedEntry) => `<button type="button" data-related-term="${escapeHtml(relatedEntry.id)}">${escapeHtml(relatedEntry.name)}</button>`).join(" ")}</p></section>
    <footer class="detail-footer"><a href="${escapeHtml(entry.source)}" target="_blank" rel="noreferrer">${tr("查看权威出处 ↗", "View authoritative source ↗")}</a><span>${tr("组件由代码渲染 · 图片使用外部占位", "Code-rendered components · external image placeholders")}</span></footer>
  </div>`;
  termDialogContent.scrollTop = 0;
  if (!termDialog.open) {
    document.documentElement.classList.add("term-dialog-open");
    termDialog.showModal();
  }
  if (focusTitle) $("#termDialogTitle")?.focus({ preventScroll: true });
  $("[data-detail-favorite]").addEventListener("click", () => {
    if (state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
    persistFavorites();
    openTerm(id);
    render();
    $("[data-detail-favorite]")?.focus({ preventScroll: true });
  });
  document.querySelectorAll("[data-copy-prompt]").forEach((button) => button.addEventListener("click", () => copyPrompt(button.dataset.copyPrompt)));
  document.querySelectorAll("[data-related-term]").forEach((button) => button.addEventListener("click", () => openTerm(button.dataset.relatedTerm, { focusTitle: true })));
}

async function copyPrompt(id) {
  const prompt = localizedEntryById(id)?.prompt;
  if (!prompt) return;
  try { await navigator.clipboard.writeText(prompt); } catch { const area = document.createElement("textarea"); area.value = prompt; document.body.append(area); area.select(); document.execCommand("copy"); area.remove(); }
  showToast(tr("Agent prompt 已复制", "Agent prompt copied"));
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
}

$("#vocabularySearch").addEventListener("input", (event) => { state.query = event.target.value; renderEntries(); });
$("#sortSelect").addEventListener("change", (event) => { state.sort = event.target.value; renderEntries(); });
$("#clearSearch").addEventListener("click", () => { state.query = ""; state.category = "all"; $("#vocabularySearch").value = ""; render(); $("#vocabularySearch").focus(); });
termDialog.addEventListener("close", () => {
  document.documentElement.classList.remove("term-dialog-open");
  if (dialogReturnEntryId) focusDataAttribute("data-open-term", dialogReturnEntryId);
  if (!document.activeElement || document.activeElement === document.body) focusCategory(state.category);
  dialogReturnEntryId = null;
});
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#vocabularySearch").focus(); } if (event.key === "Escape" && !termDialog.open) { state.query = ""; $("#vocabularySearch").value = ""; renderEntries(); } });
window.addEventListener("image2:languagechange", (event) => {
  currentLanguage = event.detail?.language === "en" ? "en" : "zh";
  render();
  if (termDialog.open && dialogReturnEntryId) openTerm(dialogReturnEntryId);
});

render();
