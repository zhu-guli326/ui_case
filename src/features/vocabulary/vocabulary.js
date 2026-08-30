import { vocabularyTranslations } from "./vocabulary-i18n.js";
import { navigationPatterns, navigationPrinciples } from "./vocabulary-navigation-data.js";
import { cardMediaPool, interactiveVariantIds, layoutCardMedia } from "./vocabulary-card-config.js";
import { localizeVocabularyEntry, vocabularyCategories, vocabularyEntries as baseVocabularyEntries } from "./data/index.js";
import { vocabularyComponentEntries } from "./vocabulary-component-data.js";
import { vocabularyPreviewMarkup } from "./vocabulary-preview.js";
import { resolveVocabularyCategoryIntent } from "./vocabulary-search.mjs";

const vocabularyEntries = [...baseVocabularyEntries, ...vocabularyComponentEntries];
const vocabularyById = Object.fromEntries(vocabularyEntries.map((entry) => [entry.id, entry]));
const taxonomyCategories = [
  ...vocabularyCategories.slice(0, -1),
  { id: "styles", label: "设计风格", en: "Design styles" },
  vocabularyCategories.at(-1),
];

document.querySelectorAll(".reference-link").forEach((link) => link.remove());

const STORAGE_KEY = "image2-ui-vocabulary-favorites";
const i18n = window.image2I18n;
let currentLanguage = i18n?.language || "zh";

i18n?.addTranslations(vocabularyTranslations);

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

const urlState = new URLSearchParams(window.location.search);
const validCategories = new Set(taxonomyCategories.map((category) => category.id));
const validSorts = new Set(["recommended", "az", "category", "favorites"]);
const initialTermId = urlState.get("term");

const state = {
  query: urlState.get("q") || "",
  category: validCategories.has(urlState.get("category")) ? urlState.get("category") : "all",
  sort: validSorts.has(urlState.get("sort")) ? urlState.get("sort") : "recommended",
  favorites: readFavorites(),
};

const $ = (selector) => document.querySelector(selector);
const taxonomyNav = $("#taxonomyNav");
const entryGrid = $("#entryGrid");
const resultsHeading = $(".results-heading");
const resultsEyebrow = $("#resultsEyebrow");
const resultsTitle = $("#resultsTitle");
const resultCount = $("#resultCount");
const resultsSummary = $("#resultsSummary");
const styleCoverGallery = $("#styleCoverGallery");
const emptyState = $("#emptyState");
const navigationDeepDive = $("#navigationDeepDive");
const toast = $("#toast");
const termDialog = $("#termDialog");
const termDialogContent = $("#termDialogContent");
let dialogReturnEntryId = null;

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
const navText = (pair) => tr(pair[0], pair[1]);
const showsNavigationDeepDive = () => false;

function syncUrlState({ term = undefined, historyMode = "replace" } = {}) {
  const params = new URLSearchParams(window.location.search);
  if (state.query.trim()) params.set("q", state.query.trim()); else params.delete("q");
  if (state.category !== "all") params.set("category", state.category); else params.delete("category");
  if (state.sort !== "recommended") params.set("sort", state.sort); else params.delete("sort");
  if (term !== undefined) {
    if (term) params.set("term", term); else params.delete("term");
  }
  const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (current === next) return;
  window.history[historyMode === "push" ? "pushState" : "replaceState"]({}, "", next);
}

function navigationPreviewMarkup(type) {
  const image = (src, alt) => `<img class="nav-demo-image" src="${src}" alt="${alt}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
  const media = "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=640&q=80";
  const portrait = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=80";
  if (type === "top") return `<div class="nav-demo nav-demo--top"><div class="nav-demo-topbar"><b>ON</b><span class="is-active">产品</span><span>案例</span><span>方法</span><span>词典</span><em aria-label="用户头像">林</em></div><div class="nav-demo-content"><small>本周精选</small><h4>让复杂界面变得清楚</h4><p>从真实案例开始学习 UI 结构。</p><button>浏览词典 →</button>${image(media, "桌面上的设计资料与界面草图")}</div></div>`;
  if (type === "side") return `<div class="nav-demo nav-demo--side"><aside><b>ON DESIGN</b><strong>工作区</strong><span class="is-active">⌂ 总览</span><span>▣ 项目</span><span>◇ 资源库</span><small>团队</small><span>○ 成员</span><span>⚙ 设置</span></aside><div class="nav-demo-content"><small>工作区 / 总览</small><h4>产品团队本周进展</h4><p>8 个项目正在进行，3 个需要关注。</p><div class="nav-demo-stat-row"><b>24</b><span>活跃项目</span><b>92%</b><span>按时交付</span></div></div></div>`;
  if (type === "rail") return `<div class="nav-demo nav-demo--rail"><aside><b>+</b><span class="is-active">⌂</span><span>▣</span><span>◇</span><span>○</span><small>帮助</small></aside><div class="nav-demo-content"><small>项目 / Atlas</small><h4>设计系统更新</h4><p>组件、令牌和发布记录集中在这里。</p><div class="nav-demo-progress"><span style="width:72%"></span></div><small>72% 已完成</small></div></div>`;
  if (type === "bottom") return `<div class="nav-demo nav-demo--bottom"><div class="nav-demo-phone"><div class="nav-demo-content"><small>今日推荐</small><h4>沿海慢旅行</h4>${image(portrait, "海边旅行照片") }<p>6 个安静、适合散步的目的地。</p></div><nav><span class="is-active">●<small>首页</small></span><span>◇<small>探索</small></span><span>□<small>收藏</small></span><span>○<small>我的</small></span></nav></div></div>`;
  if (type === "drawer") return `<div class="nav-demo nav-demo--drawer"><div class="nav-demo-content"><small>设置</small><h4>通知偏好</h4><p>选择你希望收到的更新。</p><div class="nav-demo-toggle-row"><span>产品更新</span><b>开</b></div><div class="nav-demo-toggle-row"><span>每周摘要</span><b>关</b></div></div><div class="nav-demo-backdrop"></div><aside><b>菜单</b><span class="is-active">⌂ 首页</span><span>▣ 项目</span><span>◇ 收藏</span><span>⚙ 设置</span></aside></div>`;
  if (type === "tabs") return `<div class="nav-demo nav-demo--tabs"><b>Atlas 项目</b><nav><span class="is-active">概览</span><span>动态</span><span>文件</span><span>设置</span></nav><div class="nav-demo-content"><small>本月访问</small><strong class="nav-demo-number">12,480</strong><p>较上月增长 18.4%</p><div class="nav-demo-chart"><i></i><i></i><i></i><i></i><i></i></div></div></div>`;
  if (type === "crumbs") return `<div class="nav-demo nav-demo--crumbs"><nav><span>工作区</span><i>›</i><span>项目</span><i>›</i><b>Atlas</b></nav><h4>设计系统更新</h4><div class="nav-demo-content"><p>组件库与页面规范</p><div class="nav-demo-file-row"><span>▤</span><b>release-notes.md</b><small>刚刚更新</small></div><div class="nav-demo-file-row"><span>▤</span><b>tokens.css</b><small>昨天</small></div></div></div>`;
  return `<div class="nav-demo nav-demo--mega"><div class="nav-demo-topbar"><b>ON</b><span class="is-active">产品</span><span>资源</span><span>学习</span></div><div class="nav-demo-mega-panel"><div><b>按团队</b><span>设计团队</span><span>产品团队</span><span>工程团队</span></div><div><b>按场景</b><span>建立品牌</span><span>做工作台</span><span>优化移动端</span></div><div><b>精选案例</b>${image(media, "设计团队在桌面前协作")}</div></div></div>`;
}

function renderNavigationDeepDive() {
  const principles = $("#navigationPrinciples");
  const grid = $("#navigationPatternGrid");
  const matrix = $("#navigationMatrixTable");
  if (!navigationDeepDive || !principles || !grid || !matrix) return;

  navigationDeepDive.hidden = !showsNavigationDeepDive();
  if (navigationDeepDive.hidden) return;

  principles.innerHTML = navigationPrinciples.map((item) => `<article><span>${item.number}</span><div><h3>${escapeHtml(navText(item.title))}</h3><p>${escapeHtml(navText(item.body))}</p></div></article>`).join("");
  grid.innerHTML = navigationPatterns.map((pattern) => `<article class="navigation-pattern-card">
    <div class="navigation-pattern-preview">${navigationPreviewMarkup(pattern.preview)}<span>${pattern.number}</span></div>
    <div class="navigation-pattern-body">
      <div class="navigation-pattern-title"><div><p>${escapeHtml(navText(pattern.scope))}</p><h3>${escapeHtml(navText(pattern.name))} <em>${escapeHtml(pattern.en)}</em></h3></div><strong>${escapeHtml(pattern.count)}</strong></div>
      <p class="navigation-pattern-fit"><b>${escapeHtml(tr("适合：", "Use when: "))}</b>${escapeHtml(navText(pattern.fit))}</p>
      <dl><div><dt>${escapeHtml(tr("不要这样用", "Avoid"))}</dt><dd>${escapeHtml(navText(pattern.avoid))}</dd></div><div><dt>${escapeHtml(tr("移动端变化", "On mobile"))}</dt><dd>${escapeHtml(navText(pattern.mobile))}</dd></div></dl>
    </div>
  </article>`).join("");

  matrix.innerHTML = `<table><thead><tr><th>${escapeHtml(tr("模式", "Pattern"))}</th><th>${escapeHtml(tr("导航范围", "Scope"))}</th><th>${escapeHtml(tr("入口数量", "Destinations"))}</th><th>${escapeHtml(tr("最适合", "Best for"))}</th><th>${escapeHtml(tr("移动端策略", "Mobile strategy"))}</th></tr></thead><tbody>${navigationPatterns.map((pattern) => `<tr><th><span>${pattern.number}</span>${escapeHtml(navText(pattern.name))}</th><td>${escapeHtml(navText(pattern.scope))}</td><td>${escapeHtml(pattern.count)}</td><td>${escapeHtml(navText(pattern.fit).split("。")[0].split(".")[0])}</td><td>${escapeHtml(navText(pattern.mobile))}</td></tr>`).join("")}</tbody></table>`;

}

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
  const category = taxonomyCategories.find((item) => item.id === id);
  return category ? tr(category.label, category.en) : tr("词条", "Term");
}

function categoryEyebrow(id) {
  const labels = {
    all: ["按界面作用浏览", "BROWSE BY ROLE"],
    foundation: ["页面基础", "PAGE FOUNDATIONS"],
    layout: ["页面布局", "PAGE LAYOUTS"],
    navigation: ["导航与发现", "NAVIGATION & DISCOVERY"],
    content: ["内容展示", "CONTENT & MEDIA"],
    controls: ["控件与表单", "CONTROLS & FORMS"],
    feedback: ["反馈与浮层", "FEEDBACK & OVERLAYS"],
    visual: ["视觉与实现", "VISUAL DESIGN"],
    styles: ["设计风格", "DESIGN STYLES"],
    favorites: ["我的收藏", "MY FAVORITES"],
  };
  const pair = labels[id] || labels.all;
  return tr(pair[0], pair[1]);
}

function categoryDisplayCount(id) {
  if (id === "styles") return 20;
  if (id === "favorites") return state.favorites.size;
  if (id === "all") return vocabularyEntries.length;
  return vocabularyEntries.filter((entry) => entry.category === id).length;
}

function matches(entry) {
  if (state.category === "styles") return false;
  if (state.category === "favorites" && !state.favorites.has(entry.id)) return false;
  if (state.category !== "all" && state.category !== "favorites" && entry.category !== state.category) return false;
  const query = state.query.trim().toLocaleLowerCase();
  if (!query) return true;
  const categoryIntent = resolveVocabularyCategoryIntent(query, vocabularyCategories);
  if (categoryIntent) return entry.category === categoryIntent;
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
  return [...list].sort((a, b) => Number(interactiveVariantIds.has(b.id)) - Number(interactiveVariantIds.has(a.id)));
}

function renderCategories() {
  const html = taxonomyCategories.map((category) => {
    const selected = state.category === category.id;
    const count = categoryDisplayCount(category.id);
    return `<button class="taxonomy-link${selected ? " is-selected" : ""}" type="button" data-category="${category.id}" aria-pressed="${selected}"><span>${escapeHtml(tr(category.label, category.en))}</span><b>${count}</b></button>`;
  }).join("");
  taxonomyNav.innerHTML = html;
  [...document.querySelectorAll("[data-category]")].forEach((button) => button.addEventListener("click", () => {
    const category = button.dataset.category;
    state.category = category;
    syncUrlState({ historyMode: "push" });
    render();
    focusCategory(category, ".taxonomy-link");
  }));
}

function previewMarkup(entry) {
  const localized = localizedEntry(entry);
  const preview = vocabularyPreviewMarkup(entry, { imageUrl: entry.example.src, language: currentLanguage });
  return `<div class="entry-visual" role="img" aria-label="${escapeHtml(tr(`${localized.name}的界面缩略图`, `Thumbnail for ${localized.name}`))}">${preview}</div>`;
}

function detailPreviewMarkup(entry) {
  return vocabularyPreviewMarkup(entry, { imageUrl: entry.example.src, language: currentLanguage });
}

function variantStateMarkup(entry) {
  const localized = localizedEntry(entry);
  const states = localized.states || [];
  return `<div class="entry-variant-panel" data-variant-panel data-entry-variant="${escapeHtml(entry.id)}" data-variant-index="0">
    <div class="entry-variant-heading"><div class="entry-variant-title"><span>${escapeHtml(tr("状态变体", "State variants"))}</span><strong>${escapeHtml(localized.name)}</strong></div><button class="entry-variant-back" type="button" data-flip-card aria-pressed="true">${escapeHtml(tr("返回介绍", "Back to intro"))} ↶</button></div>
    <div class="entry-state-controls"><span class="entry-state-label">${escapeHtml(tr("选择要预览的状态", "Choose a state to preview"))}</span><div class="entry-state-tabs" role="group" aria-label="${escapeHtml(tr(`${localized.name}状态`, `${localized.name} states`))}">${states.slice(0, 4).map((state, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button" data-variant-state="${index}" data-variant-copy="${escapeHtml(state[1])}" aria-pressed="${index === 0}">${escapeHtml(state[0])}</button>`).join("")}</div><div class="entry-variant-active" data-variant-active aria-live="polite">${escapeHtml(states[0]?.[1] || localized.role)}</div></div>
    <div class="entry-state-preview" data-variant-preview>${detailPreviewMarkup(entry)}</div>
    <div class="entry-context-row"><span>${escapeHtml(tr("适用标签", "Pattern tags"))}</span><div class="entry-context-tags" aria-label="${escapeHtml(tr("词条标签", "Term tags"))}">${(localized.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>
  </div>`;
}

function guidanceBackMarkup(entry) {
  const localized = localizedEntry(entry);
  return `<div class="entry-variant-panel entry-guidance-panel">
    <div class="entry-variant-heading"><div class="entry-variant-title"><span>${escapeHtml(tr("设计说明", "Design guidance"))}</span><strong>${escapeHtml(localized.name)}</strong></div><button class="entry-variant-back" type="button" data-flip-card aria-pressed="true">${escapeHtml(tr("返回介绍", "Back to intro"))} ↶</button></div>
    <div class="entry-state-preview">${detailPreviewMarkup(entry)}</div>
    <div class="entry-variant-active">${escapeHtml(`${localized.definition} ${localized.role}`.trim())}</div>
    <div class="entry-context-row"><span>${escapeHtml(tr("适用标签", "Pattern tags"))}</span><div class="entry-context-tags" aria-label="${escapeHtml(tr("词条标签", "Term tags"))}">${(localized.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>
  </div>`;
}

const cardMediaUrl = (entry) => layoutCardMedia[entry.id] || cardMediaPool[[...entry.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % cardMediaPool.length];

function cardMarkup(entry) {
  const localized = localizedEntry(entry);
  const favorite = state.favorites.has(entry.id);
  const hasVariants = interactiveVariantIds.has(entry.id);
  const flipLabel = hasVariants
    ? tr(`翻转 ${localized.name}，查看状态变体`, `Flip ${localized.name} to see state variants`)
    : tr(`翻转 ${localized.name}，查看设计说明`, `Flip ${localized.name} to see design guidance`);
  const flipTag = hasVariants ? tr("状态变体", "STATE VARIANTS") : tr("翻转查看", "FLIP FOR MORE");
  return `<article class="entry-card has-variants ${hasVariants ? "has-state-variants" : "has-guidance-back"}" data-entry-id="${escapeHtml(entry.id)}">
    <div class="entry-card-inner">
      <section class="entry-card-face entry-card-front" aria-hidden="false">
        <button class="entry-flip-hitarea" type="button" data-flip-card aria-pressed="false" aria-label="${escapeHtml(flipLabel)}"></button>
        <div class="entry-card-body">
          <div class="entry-card-meta"><span>${escapeHtml(categoryLabel(entry.category))}</span><button class="entry-flip-tag" type="button" data-flip-card aria-pressed="false" aria-label="${escapeHtml(flipLabel)}">${escapeHtml(flipTag)} ↻</button><button class="favorite-button${favorite ? " is-favorite" : ""}" type="button" data-favorite="${escapeHtml(entry.id)}" aria-pressed="${favorite}" aria-label="${escapeHtml(favorite ? `${tr("取消收藏", "Remove from favorites")} ${localized.name}` : `${tr("收藏", "Add to favorites")} ${localized.name}`)}" title="${escapeHtml(favorite ? tr("取消收藏", "Remove from favorites") : tr("收藏", "Add to favorites"))}">${favorite ? "★" : "☆"}</button></div>
          <h3>${escapeHtml(localized.name)}${termAliasMarkup(entry)}</h3>
          <p class="entry-ask">“${escapeHtml(localized.ask)}”</p>
          ${previewMarkup(entry)}
          <div class="entry-tags" aria-label="${escapeHtml(tr("词条标签", "Term tags"))}">${(localized.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          <button class="entry-detail-button" type="button" data-copy-prompt="${escapeHtml(entry.id)}"><span>${escapeHtml(tr("复制 Prompt", "Copy prompt"))}</span><b aria-hidden="true">⧉</b></button>
        </div>
      </section>
      <section class="entry-card-face entry-card-back" aria-hidden="true" inert>
        <button class="entry-flip-hitarea entry-flip-hitarea--back" type="button" data-flip-card aria-pressed="false" aria-label="${escapeHtml(tr(`翻回 ${localized.name} 的介绍`, `Flip back to the ${localized.name} introduction`))}"></button>
        <div class="entry-card-back-shell">
          ${hasVariants ? variantStateMarkup(entry) : guidanceBackMarkup(entry)}
          <div class="entry-card-back-actions"><button class="entry-copy-prompt-button" type="button" data-term-detail="${escapeHtml(entry.id)}"><span>${escapeHtml(tr("查看完整详情", "View full details"))}</span><b aria-hidden="true">↗</b></button></div>
        </div>
      </section>
    </div>
  </article>`;
}

function setCardFlipped(card, flipped, { moveFocus = true } = {}) {
  if (!card) return;
  const front = card.querySelector(".entry-card-front");
  const back = card.querySelector(".entry-card-back");
  if (!front || !back) return;
  card.classList.toggle("is-flipped", flipped);
  front.setAttribute("aria-hidden", String(flipped));
  back.setAttribute("aria-hidden", String(!flipped));
  front.inert = flipped;
  back.inert = !flipped;
  card.querySelectorAll("[data-flip-card]").forEach((button) => button.setAttribute("aria-pressed", String(flipped)));
  if (!moveFocus) return;
  requestAnimationFrame(() => {
    const target = flipped
      ? back.querySelector("[data-flip-card]")
      : front.querySelector("[data-flip-card]");
    target?.focus({ preventScroll: true });
  });
}

function handleEntryGridClick(event) {
  const flipButton = event.target.closest("[data-flip-card]");
  if (!flipButton || !entryGrid.contains(flipButton)) return;
  event.stopPropagation();
  const card = flipButton.closest(".entry-card");
  setCardFlipped(card, !card?.classList.contains("is-flipped"));
}

function renderEntries() {
  const list = filteredEntries();
  const navigationMode = showsNavigationDeepDive();
  const stylesMode = state.category === "styles";
  const displayedCount = stylesMode ? 20 : list.length;
  resultsEyebrow.textContent = categoryEyebrow(state.category);
  resultsTitle.textContent = state.query
    ? currentLanguage === "en" ? "Search results" : "搜索结果"
    : state.category === "all"
      ? tr("所有词条", "All terms")
      : categoryLabel(state.category);
  resultsHeading.hidden = navigationMode;
  resultsSummary.hidden = navigationMode || stylesMode;
  if (styleCoverGallery) styleCoverGallery.hidden = !stylesMode || Boolean(state.query.trim());
  entryGrid.hidden = navigationMode || stylesMode;
  entryGrid.innerHTML = navigationMode || stylesMode ? "" : list.map(cardMarkup).join("");
  emptyState.hidden = navigationMode || stylesMode || list.length > 0;
  resultCount.textContent = stylesMode
    ? tr("20 种", "20 styles")
    : currentLanguage === "en" ? `${displayedCount} ${displayedCount === 1 ? "term" : "terms"}` : `${displayedCount} 条`;
  resultsSummary.textContent = state.query
    ? currentLanguage === "en" ? `${list.length} ${list.length === 1 ? "term matches" : "terms match"} “${state.query}”` : `“${state.query}”匹配 ${list.length} 个词条`
    : stylesMode
      ? tr("从 20 张视觉封面中选择接近的设计方向。", "Choose a direction from 20 visual style covers.")
    : state.category === "favorites"
      ? currentLanguage === "en" ? `You saved ${list.length} ${list.length === 1 ? "term" : "terms"}` : `你收藏了 ${list.length} 个词条`
      : currentLanguage === "en" ? `${categoryLabel(state.category)} · ${list.length} ${list.length === 1 ? "term" : "terms"}` : `${categoryLabel(state.category)} · ${list.length} 个词条`;
  document.querySelectorAll("[data-copy-prompt]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    copyPrompt(button.dataset.copyPrompt);
  }));
  document.querySelectorAll("[data-term-detail]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    openTerm(button.dataset.termDetail);
  }));
  document.querySelectorAll("[data-variant-state]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const panel = button.closest("[data-variant-panel]");
    const tone = [...button.classList].find((name) => name.startsWith("is-") && name !== "is-active")?.replace("is-", "") || "info";
    panel?.setAttribute("data-variant-tone", tone);
    panel?.setAttribute("data-variant-index", button.dataset.variantState || "0");
    panel?.querySelectorAll("[data-variant-state]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    const activeCopy = button.dataset.variantCopy;
    const output = panel.querySelector("[data-variant-active]");
    if (output && activeCopy) output.textContent = activeCopy;
  }));
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
  renderNavigationDeepDive();
  renderCategories();
  renderEntries();
}

function listMarkup(items, className = "detail-list") {
  return `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function relatedEntries(entry) {
  const ids = new Set(entry.related);
  for (const candidate of vocabularyEntries) {
    if (candidate.related.includes(entry.id)) ids.add(candidate.id);
  }
  ids.delete(entry.id);
  return [...ids].map(localizedEntryById).filter(Boolean).slice(0, 8);
}

function detailGuideMarkup(entry) {
  const anatomy = entry.anatomy.map(([title]) => `<span>${escapeHtml(title)}</span>`).join("");
  const states = entry.states.map(([title]) => `<span>${escapeHtml(title)}</span>`).join("");
  const variants = entry.variants.map(([title, body]) => `<article><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></article>`).join("");

  return `<div class="detail-quick-guide">
    <section class="detail-decision" aria-labelledby="detailDecisionTitle">
      <header><span>${escapeHtml(tr("快速判断", "QUICK DECISION"))}</span><h3 id="detailDecisionTitle">${escapeHtml(tr("先确认它是不是你要找的", "First, check whether this is the right pattern"))}</h3></header>
      <div class="detail-decision-grid"><article class="is-positive"><span aria-hidden="true">✓</span><div><h4>${escapeHtml(tr("适合", "Use it"))}</h4>${listMarkup(entry.useWhen)}</div></article><article class="is-negative"><span aria-hidden="true">×</span><div><h4>${escapeHtml(tr("不适合", "Skip it"))}</h4>${listMarkup(entry.avoidWhen)}</div></article></div>
    </section>
    <section class="detail-brief" aria-labelledby="detailBriefTitle">
      <header><span>${escapeHtml(tr("开始设计前", "BEFORE YOU BUILD"))}</span><div><h3 id="detailBriefTitle">${escapeHtml(tr("只需要确定三件事", "You only need to decide three things"))}</h3><p>${escapeHtml(tr("不必阅读完整规格表。把下面三项选清楚，就足够生成第一版方案。", "Skip the full specification sheet. Clarifying these three decisions is enough for a strong first draft."))}</p></div></header>
      <ol>
        <li><div class="detail-brief-label"><b>01</b><span>${escapeHtml(tr("放什么内容", "CONTENT"))}</span></div><div class="detail-brief-chips">${anatomy}</div></li>
        <li><div class="detail-brief-label"><b>02</b><span>${escapeHtml(tr("选哪种形式", "FORM"))}</span></div><div class="detail-brief-options">${variants}</div></li>
        <li><div class="detail-brief-label"><b>03</b><span>${escapeHtml(tr("覆盖哪些状态", "STATES"))}</span></div><div class="detail-brief-chips">${states}</div></li>
      </ol>
    </section>
  </div>`;
}

function tabsDetailMarkup(entry, related, favorite) {
  const variants = [
    {
      className: "line",
      number: "01",
      name: tr("下划线标签", "Underline tabs"),
      fit: tr("内容阅读与对象详情", "Content and object details"),
      labels: [tr("概览", "Overview"), tr("动态", "Activity"), tr("文件", "Files")],
    },
    {
      className: "pill",
      number: "02",
      name: tr("胶囊标签", "Pill tabs"),
      fit: tr("筛选与轻量视图切换", "Filters and lightweight views"),
      labels: [tr("全部", "All"), tr("设计", "Design"), tr("研究", "Research")],
    },
    {
      className: "segment",
      number: "03",
      name: tr("分段标签", "Segmented tabs"),
      fit: tr("少量互斥模式", "A few exclusive modes"),
      labels: [tr("日", "Day"), tr("周", "Week"), tr("月", "Month")],
    },
    {
      className: "scroll",
      number: "04",
      name: tr("滚动标签", "Scrollable tabs"),
      fit: tr("移动端多分类内容", "Many mobile categories"),
      labels: [tr("推荐", "For you"), tr("设计", "Design"), "AI", tr("商业", "Business"), tr("文化", "Culture")],
    },
  ];

  const variantMarkup = variants.map((variant, index) => `<article class="tabs-variant-card${index === 0 ? " is-recommended" : ""}">
    <div class="tabs-variant-preview tabs-variant-preview--${variant.className}">
      <div class="tabs-variant-bar">${variant.labels.map((label, labelIndex) => `<span class="${labelIndex === 0 ? "is-active" : ""}">${escapeHtml(label)}</span>`).join("")}</div>
      <div class="tabs-variant-content"><small>${escapeHtml(tr("本月表现", "This month"))}</small><strong>${index === 1 ? "24" : index === 2 ? "12,480" : index === 3 ? tr("设计团队如何使用 AI", "How design teams use AI") : tr("项目概览", "Project overview")}</strong>${index < 3 ? `<div class="tabs-mini-chart"><i></i><i></i><i></i><i></i><i></i></div>` : `<p>${escapeHtml(tr("真实内容摘要会跟随当前分类切换。", "Real article content follows the selected category."))}</p>`}</div>
    </div>
    <div class="tabs-variant-copy"><span>${variant.number}${index === 0 ? ` · ${escapeHtml(tr("推荐", "Recommended"))}` : ""}</span><h3>${escapeHtml(variant.name)}</h3><p>${escapeHtml(variant.fit)}</p></div>
  </article>`).join("");

  return `<div class="term-detail tabs-solution-detail">
    <div class="detail-topline"><span>${escapeHtml(categoryLabel(entry.category))} · ${escapeHtml(entry.level)}</span><button class="favorite-detail-button" type="button" data-detail-favorite="${escapeHtml(entry.id)}" aria-pressed="${favorite}">${favorite ? tr("★ 已收藏", "★ Saved") : tr("☆ 收藏词条", "☆ Save term")}</button></div>
    <header class="tabs-solution-hero">
      <div class="tabs-solution-intro"><p class="tabs-kicker">${escapeHtml(tr("UI 模式 / 标签页", "UI PATTERN / TABS"))}</p><h2 id="termDialogTitle" tabindex="-1">${escapeHtml(entry.name)} <em>Tabs</em></h2><blockquote>“${escapeHtml(entry.ask)}”</blockquote><p>${escapeHtml(entry.definition)} ${escapeHtml(entry.role)}</p><div class="detail-tags">${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>
      <div class="tabs-solution-example" role="img" aria-label="${escapeHtml(tr("标签页完整产品示例", "Complete tabs product example"))}"><div class="tabs-product-head"><span><i></i>ATLAS</span><b>Mei Lin</b></div><div class="tabs-product-title"><div><small>${escapeHtml(tr("工作区 / 产品团队", "Workspace / Product team"))}</small><strong>${escapeHtml(tr("项目概览", "Project overview"))}</strong></div><span class="tabs-product-action">${escapeHtml(tr("新建报告", "New report"))}</span></div><div class="tabs-product-tabs"><span class="is-active">${escapeHtml(tr("概览", "Overview"))}</span><span>${escapeHtml(tr("动态", "Activity"))}</span><span>${escapeHtml(tr("文件", "Files"))}</span></div><div class="tabs-product-panel"><div><small>${escapeHtml(tr("本月访问", "Monthly visits"))}</small><strong>12,480</strong><em>+18.4%</em></div><div class="tabs-product-graph"><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div>
    </header>

    <section class="tabs-choice-section"><div class="tabs-section-heading"><div><span>01 / ${escapeHtml(tr("选择类型", "Choose a type"))}</span><h2>${escapeHtml(tr("先看样式，再决定用哪一种", "See the patterns before choosing"))}</h2></div><p>${escapeHtml(tr("四种常见 Tabs 都给出完整内容场景。重点不是哪个更好看，而是哪一种匹配你的信息结构。", "Each common Tabs pattern is shown in a complete content scenario. Choose by information structure, not decoration."))}</p></div><div class="tabs-variant-grid">${variantMarkup}</div></section>

    <section class="tabs-decision-section"><div class="tabs-section-heading"><div><span>02 / ${escapeHtml(tr("快速判断", "Quick decision"))}</span><h2>${escapeHtml(tr("什么时候应该使用 Tabs？", "When should you use Tabs?"))}</h2></div></div><div class="tabs-decision-grid"><article class="is-positive"><span>✓</span><div><h3>${escapeHtml(tr("适合使用", "Use Tabs"))}</h3><ul><li>${escapeHtml(tr("同一个对象下有 2–5 组并列内容", "Two to five peer views of the same object"))}</li><li>${escapeHtml(tr("用户需要在同一语境内快速对比", "Users compare content within one context"))}</li><li>${escapeHtml(tr("切换后保留标题、操作和页面位置", "The page title and actions stay in place"))}</li></ul></div></article><article class="is-negative"><span>×</span><div><h3>${escapeHtml(tr("不要使用", "Avoid Tabs"))}</h3><ul><li>${escapeHtml(tr("每一项其实是完全独立的任务", "Each destination is a separate task"))}</li><li>${escapeHtml(tr("分类超过 5 个且用户必须逐个扫描", "More than five categories must be scanned"))}</li><li>${escapeHtml(tr("需要表达前后步骤或完成进度", "The flow represents ordered steps or progress"))}</li></ul></div></article></div></section>

    <section class="tabs-build-section"><div class="tabs-section-heading"><div><span>03 / ${escapeHtml(tr("落地规则", "Build rules"))}</span><h2>${escapeHtml(tr("交给设计与开发的必要信息", "What design and engineering need"))}</h2></div></div><div class="tabs-build-grid"><article><b>01</b><h3>${escapeHtml(tr("标签与面板一一对应", "One tab, one panel"))}</h3><p>${escapeHtml(tr("选中状态、aria-controls 和面板内容必须同步。", "Selected state, aria-controls, and panel content stay synchronized."))}</p></article><article><b>02</b><h3>${escapeHtml(tr("保留键盘操作", "Keep keyboard support"))}</h3><p>${escapeHtml(tr("左右键移动焦点，Tab 键进入当前面板。", "Arrow keys move focus; Tab enters the active panel."))}</p></article><article><b>03</b><h3>${escapeHtml(tr("移动端允许横向滚动", "Allow horizontal scroll"))}</h3><p>${escapeHtml(tr("不要把标签压成两行，也不要隐藏当前选中项。", "Do not wrap tabs or hide the active item."))}</p></article></div></section>

    <section class="prompt-panel tabs-prompt-panel"><div class="prompt-heading"><div><span>04 / AGENT PROMPT</span><h3>${tr("把选中的方案直接交给 AI", "Give the chosen pattern to AI")}</h3></div><button class="copy-prompt-button" type="button" data-copy-prompt="${escapeHtml(entry.id)}">${tr("复制 prompt", "Copy prompt")}</button></div><pre id="prompt-${escapeHtml(entry.id)}"><code>${escapeHtml(entry.prompt)}</code></pre></section>
    <section class="confusion-panel tabs-related-panel"><h3>${tr("容易混淆", "Commonly confused")}</h3><p>${escapeHtml(entry.confusedWith)}</p><p class="related-terms"><strong>${tr("相关词：", "Related terms: ")}</strong>${related.map((relatedEntry) => `<button type="button" data-related-term="${escapeHtml(relatedEntry.id)}">${escapeHtml(relatedEntry.name)}</button>`).join(" ")}</p></section>
    <footer class="detail-footer"><a href="${escapeHtml(entry.source)}" target="_blank" rel="noreferrer">${tr("查看权威出处 ↗", "View authoritative source ↗")}</a><span>${tr("标签页详情 · 完整样式与选择方案", "Tabs detail · complete patterns and selection guidance")}</span></footer>
  </div>`;
}

function formDetailMarkup(entry, baseEntry, related, favorite) {
  const anatomy = entry.anatomy.map(([title, body], index) => `<article><b>${String(index + 1).padStart(2, "0")}</b><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div></article>`).join("");
  const states = entry.states.map(([title, body]) => `<article><span></span><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div></article>`).join("");
  const variants = entry.variants.map(([title, body]) => `<article><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`).join("");
  const relatedMarkup = related.length ? `<p class="related-terms"><strong>${tr("相关词：", "Related terms: ")}</strong>${related.map((relatedEntry) => `<button type="button" data-related-term="${escapeHtml(relatedEntry.id)}">${escapeHtml(relatedEntry.name)}</button>`).join(" ")}</p>` : "";

  return `<div class="term-detail form-solution-detail">
    <div class="detail-topline"><span>${escapeHtml(categoryLabel(entry.category))} · ${escapeHtml(entry.level)}</span><button class="favorite-detail-button" type="button" data-detail-favorite="${escapeHtml(entry.id)}" aria-pressed="${favorite}">${favorite ? tr("★ 已收藏", "★ Saved") : tr("☆ 收藏词条", "☆ Save term")}</button></div>
    <header class="form-solution-hero">
      <div class="form-solution-intro"><p class="form-kicker">${escapeHtml(tr("UI 模式 / 表单", "UI PATTERN / FORM"))}</p><h2 id="termDialogTitle" tabindex="-1">${escapeHtml(entry.name)}${termAliasMarkup(baseEntry)}</h2><blockquote>“${escapeHtml(entry.ask)}”</blockquote><p><strong>${escapeHtml(entry.definition)}</strong> ${escapeHtml(entry.role)}</p><div class="detail-tags">${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>
      <figure class="form-solution-preview"><div class="detail-preview" role="img" aria-label="${escapeHtml(tr(`${entry.name}完整界面示例`, `Complete ${entry.name} example`))}">${detailPreviewMarkup(baseEntry)}</div><figcaption>${escapeHtml(tr("先看真实任务结构，再决定字段数量、校验和响应式规则。", "Start from the task structure, then decide fields, validation, and responsive rules."))}</figcaption></figure>
    </header>

    <section class="form-decision-section"><div class="form-section-heading"><span>01 / ${escapeHtml(tr("使用判断", "DECISION"))}</span><h2>${escapeHtml(tr("先确认它是否匹配任务", "Check whether it fits the task"))}</h2></div><div class="form-decision-grid"><article class="is-positive"><span>✓</span><div><h3>${escapeHtml(tr("适合使用", "Use when"))}</h3>${listMarkup(entry.useWhen)}</div></article><article class="is-negative"><span>×</span><div><h3>${escapeHtml(tr("不要这样用", "Avoid when"))}</h3>${listMarkup(entry.avoidWhen)}</div></article></div></section>

    <section class="form-blueprint-section"><div class="form-section-heading"><span>02 / ${escapeHtml(tr("信息结构", "ANATOMY"))}</span><h2>${escapeHtml(tr("表单应该由什么组成", "What the form needs"))}</h2></div><div class="form-blueprint-grid">${anatomy}</div></section>

    <section class="form-behavior-section"><div class="form-section-heading"><span>03 / ${escapeHtml(tr("形式与状态", "PATTERNS & STATES"))}</span><h2>${escapeHtml(tr("把正常填写和出错都设计完整", "Design the happy path and recovery"))}</h2></div><div class="form-behavior-layout"><div><h3>${escapeHtml(tr("常见形式", "Common forms"))}</h3><div class="form-variant-list">${variants}</div></div><div><h3>${escapeHtml(tr("必须覆盖的状态", "Required states"))}</h3><div class="form-state-list">${states}</div></div></div></section>

    <section class="form-build-section"><div class="form-section-heading"><span>04 / ${escapeHtml(tr("实现规则", "BUILD RULES"))}</span><h2>${escapeHtml(tr("交给设计和开发的检查项", "Checks for design and engineering"))}</h2></div><div class="form-build-grid"><article><h3>${escapeHtml(tr("代码与交互", "Code and interaction"))}</h3>${listMarkup(entry.codeUI, "compact-list")}</article><article><h3>${escapeHtml(tr("内容与媒体", "Content and media"))}</h3>${listMarkup(entry.media, "compact-list")}</article></div></section>

    <section class="prompt-panel form-prompt-panel"><div class="prompt-heading"><div><span>05 / AGENT PROMPT</span><h3>${tr("这段可以直接交给 AI", "Give this directly to AI")}</h3></div><button class="copy-prompt-button" type="button" data-copy-prompt="${escapeHtml(entry.id)}">${tr("复制提示词", "Copy prompt")}</button></div><pre id="prompt-${escapeHtml(entry.id)}"><code>${escapeHtml(entry.prompt)}</code></pre></section>
    <section class="confusion-panel form-related-panel"><h3>${tr("容易混淆", "Commonly confused")}</h3><p>${escapeHtml(entry.confusedWith)}</p>${relatedMarkup}</section>
    <footer class="detail-footer"><a href="${escapeHtml(entry.source)}" target="_blank" rel="noreferrer">${tr("查看权威出处 ↗", "View authoritative source ↗")}</a><span>${tr("表单详情 · 任务、结构、状态与实现", "Form detail · task, structure, states, and implementation")}</span></footer>
  </div>`;
}

function openTerm(id, { focusTitle = false } = {}) {
  const baseEntry = vocabularyById[id];
  if (!baseEntry) return;
  const entry = localizedEntry(baseEntry);
  syncUrlState({ term: id, historyMode: "push" });
  const related = relatedEntries(baseEntry);
  if (!termDialog.open) dialogReturnEntryId = id;
  const favorite = state.favorites.has(entry.id);
  const isFormComponent = baseEntry.componentKind === "form";
  termDialog.classList.toggle("term-dialog--tabs", entry.id === "tabs");
  termDialog.classList.toggle("term-dialog--form", isFormComponent);
  termDialogContent.innerHTML = entry.id === "tabs" ? tabsDetailMarkup(entry, related, favorite) : isFormComponent ? formDetailMarkup(entry, baseEntry, related, favorite) : `<div class="term-detail">
    <div class="detail-topline"><span>${escapeHtml(categoryLabel(entry.category))} · ${escapeHtml(entry.level)}</span><button class="favorite-detail-button" type="button" data-detail-favorite="${escapeHtml(entry.id)}" aria-pressed="${favorite}">${favorite ? tr("★ 已收藏", "★ Saved") : tr("☆ 收藏词条", "☆ Save term")}</button></div>
    <h2 id="termDialogTitle" tabindex="-1">${escapeHtml(entry.name)}${termAliasMarkup(baseEntry)}</h2>
    <div class="detail-tags">${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    <blockquote class="detail-ask">“${escapeHtml(entry.ask)}”</blockquote>
    <p class="detail-definition"><strong>${escapeHtml(entry.definition)}</strong> ${escapeHtml(entry.role)}</p>
    <figure class="detail-figure"><div class="detail-preview" role="img" aria-label="${escapeHtml(tr(`${entry.name}的完整解决方案原型`, `Complete solution prototype for ${entry.name}`))}">${detailPreviewMarkup(baseEntry)}</div><figcaption>${escapeHtml(componentCaption(entry))}</figcaption></figure>
    ${detailGuideMarkup(entry)}
    <section class="prompt-panel"><div class="prompt-heading"><h3>${tr("你可以这样告诉 AI Agent", "Tell your AI agent this")}</h3><button class="copy-prompt-button" type="button" data-copy-prompt="${escapeHtml(entry.id)}">${tr("复制提示词", "Copy prompt")}</button></div><pre id="prompt-${escapeHtml(entry.id)}"><code>${escapeHtml(entry.prompt)}</code></pre></section>
    <section class="confusion-panel"><h3>${tr("容易混淆", "Commonly confused")}</h3><p>${escapeHtml(entry.confusedWith)}</p><p class="related-terms"><strong>${tr("相关词：", "Related terms: ")}</strong>${related.map((relatedEntry) => `<button type="button" data-related-term="${escapeHtml(relatedEntry.id)}">${escapeHtml(relatedEntry.name)}</button>`).join(" ")}</p></section>
    <footer class="detail-footer"><a href="${escapeHtml(entry.source)}" target="_blank" rel="noreferrer">${tr("查看权威出处 ↗", "View authoritative source ↗")}</a><span>${tr("完整方案由代码渲染 · 使用真实内容与项目图片", "Complete code-rendered solution · real content and project media")}</span></footer>
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
  termDialogContent.querySelectorAll("[data-copy-prompt]").forEach((button) => button.addEventListener("click", () => copyPrompt(button.dataset.copyPrompt)));
  termDialogContent.querySelectorAll("[data-related-term]").forEach((button) => button.addEventListener("click", () => openTerm(button.dataset.relatedTerm, { focusTitle: true })));
}

async function copyPrompt(id) {
  const prompt = localizedEntryById(id)?.prompt;
  if (!prompt) return;
  try { await navigator.clipboard.writeText(prompt); } catch { const area = document.createElement("textarea"); area.value = prompt; document.body.append(area); area.select(); document.execCommand("copy"); area.remove(); }
  showToast(tr("Agent prompt 已复制", "Agent prompt copied"));
}

async function copyCurrentView() {
  const url = window.location.href;
  try { await navigator.clipboard.writeText(url); } catch { const area = document.createElement("textarea"); area.value = url; document.body.append(area); area.select(); document.execCommand("copy"); area.remove(); }
  showToast(tr("当前浏览链接已复制", "Current view link copied"));
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
}

$("#vocabularySearch").value = state.query;
$("#sortSelect").value = state.sort;
entryGrid.addEventListener("click", handleEntryGridClick);
$("#vocabularySearch").addEventListener("input", (event) => { state.query = event.target.value; syncUrlState(); renderNavigationDeepDive(); renderEntries(); });
$("#sortSelect").addEventListener("change", (event) => { state.sort = event.target.value; syncUrlState({ historyMode: "push" }); renderEntries(); });
$("#clearSearch").addEventListener("click", () => { state.query = ""; state.category = "all"; $("#vocabularySearch").value = ""; syncUrlState({ historyMode: "push" }); render(); $("#vocabularySearch").focus(); });
$("#shareView").addEventListener("click", copyCurrentView);
termDialog.addEventListener("close", () => {
  document.documentElement.classList.remove("term-dialog-open");
  syncUrlState({ term: null });
  if (dialogReturnEntryId) focusDataAttribute("data-term-detail", dialogReturnEntryId);
  if (!document.activeElement || document.activeElement === document.body) focusCategory(state.category);
  dialogReturnEntryId = null;
});
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#vocabularySearch").focus(); $("#vocabularySearch").select(); }
  if (event.key === "/" && !isTyping && !termDialog.open) { event.preventDefault(); $("#vocabularySearch").focus(); }
  if (event.key === "Escape" && !termDialog.open && state.query) { state.query = ""; $("#vocabularySearch").value = ""; syncUrlState(); renderNavigationDeepDive(); renderEntries(); }
});
window.addEventListener("popstate", () => {
  const params = new URLSearchParams(window.location.search);
  state.query = params.get("q") || "";
  state.category = validCategories.has(params.get("category")) ? params.get("category") : "all";
  state.sort = validSorts.has(params.get("sort")) ? params.get("sort") : "recommended";
  $("#vocabularySearch").value = state.query;
  $("#sortSelect").value = state.sort;
  render();
  const nextTerm = params.get("term");
  if (nextTerm && vocabularyById[nextTerm]) openTerm(nextTerm);
  else if (termDialog.open) termDialog.close();
});
window.addEventListener("image2:languagechange", (event) => {
  currentLanguage = event.detail?.language === "en" ? "en" : "zh";
  render();
});

render();
if (initialTermId && vocabularyById[initialTermId]) openTerm(initialTermId);
