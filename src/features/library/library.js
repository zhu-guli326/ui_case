import { getLibraryPreviewDevice, getLibraryPreviewProfile, libraryPreviewAssetVersion } from "./library-preview-config.mjs";
import { searchGuides } from "./library-search.mjs";
import { styleGuides as catalogStyleGuides, styleProfiles } from "../../../catalog/index.js";
import {
  previewImageSets,
  canonicalCardScreens,
  fittedCardPreviewIds,
  featuredCaseOrder,
  libraryCopy,
  infoPanels,
  infoPanelsEnglish
} from "./library-data.js";
import { normalizeTag, getFilteredGuides as filterGuides } from "./library-filter.js";
import { createLibraryCards } from "./library-card.js";
import { createLibraryDetailController } from "./library-detail.js";

const libraryMedia = Object.freeze({
  fashion: Object.freeze({ liveDemo: "./demo/fashion/index.html" }),
  news: Object.freeze({ liveDemo: "./demo/news/index.html" }),
  "signal-grid": Object.freeze({
    previewImage: "./demo/signal-grid/screenshots/library-preview-2x.png",
    poster: "./demo/signal-grid/screenshots/library-preview-2x.png"
  })
});

const styleGuides = catalogStyleGuides.map((guide) => ({
  ...guide,
  ...libraryMedia[guide.id],
  defaultPreviewMode: "image"
}));

const elements = {
  gallery: document.querySelector("#demoGallery"),
  searchInput: document.querySelector("#styleSearch"),
  categoryNav: document.querySelector("#categoryNav"),
  catalogHeading: document.querySelector("#catalogHeading"),
  resultCount: document.querySelector("#resultCount"),
  emptyState: document.querySelector("#emptyState"),
  previewDialog: document.querySelector("#previewDialog"),
  previewDialogContent: document.querySelector("#previewDialog .preview-dialog-content"),
  previewDialogTitle: document.querySelector("#previewDialogTitle"),
  previewDialogDetails: document.querySelector("#previewDialogDetails"),
  previewDialogImage: document.querySelector("#previewDialogImage"),
  previewDialogSequence: document.querySelector("#previewDialogSequence"),
  previewImageNavigation: document.querySelector("#previewImageNavigation"),
  previewImagePrevious: document.querySelector("#previewImagePrevious"),
  previewImageNext: document.querySelector("#previewImageNext"),
  previewImageLabel: document.querySelector("#previewImageLabel"),
  previewImageCount: document.querySelector("#previewImageCount"),
  previewDialogVideo: document.querySelector("#previewDialogVideo"),
  previewDialogDemo: document.querySelector("#previewDialogDemo"),
  previewCursor: document.querySelector("#previewCursor"),
  previewMediaStage: document.querySelector("#previewMediaStage"),
  previewMediaFrame: document.querySelector("#previewMediaFrame"),
  previewPhoneScreen: document.querySelector("#previewPhoneScreen"),
  previewModeSwitch: document.querySelector("#previewModeSwitch"),
  previewVideoToggle: document.querySelector("#previewVideoToggle"),
  previewVideoProgress: document.querySelector("#previewVideoProgress"),
  previewVideoTime: document.querySelector("#previewVideoTime"),
  previewExpand: document.querySelector("#previewExpand"),
  previewDialogCopy: document.querySelector("#previewDialogCopy"),
  previewDialogApply: document.querySelector("#previewDialogApply"),
  previewDialogStartTask: document.querySelector("#previewDialogStartTask"),
  previewDialogMoreActionsSummary: document.querySelector("#previewDialogMoreActionsSummary"),
  previewDialogComponents: document.querySelector("#previewDialogComponents"),
  previewDialogCompare: document.querySelector("#previewDialogCompare"),
  previewDialogOpenLive: document.querySelector("#previewDialogOpenLive"),
  previewMediaStatus: document.querySelector("#previewMediaStatus"),
  previewMediaStatusText: document.querySelector("#previewMediaStatusText"),
  previewMediaRetry: document.querySelector("#previewMediaRetry"),
  infoDialog: document.querySelector("#infoDialog"),
  infoDialogContent: document.querySelector("#infoDialogContent"),
  toast: document.querySelector("#projectToast")
};

let activeCategory = "all";
let activeTag = "";
let activeInfoPanelId = "";
let toastTimer = 0;
const track = (name, properties) => window.image2Analytics?.track(name, properties);

const currentCopy = () => libraryCopy[window.image2I18n?.language === "en" ? "en" : "zh"];
const localizeRecord = (record) => {
  if (window.image2I18n?.language !== "en" || !record?.locales?.en) return record;
  return {
    ...record,
    ...record.locales.en,
    recipe: { ...record.recipe, ...record.locales.en.recipe },
    foundations: { ...record.foundations, ...record.locales.en.foundations },
    components: { ...record.components, ...record.locales.en.components },
    visualLanguage: { ...record.visualLanguage, ...record.locales.en.visualLanguage }
  };
};

function updateCatalogCounts() {
  const copy = currentCopy();
  const counts = {};
  for (const guide of styleGuides) counts[guide.category] = (counts[guide.category] || 0) + 1;
  elements.categoryNav.querySelector('[data-filter="all"] b').textContent = styleGuides.length;
  elements.categoryNav.querySelectorAll("[data-filter]:not([data-filter=all])").forEach((item) => {
    item.querySelector("b").textContent = counts[item.dataset.filter] || 0;
  });
  document.querySelector(".stats-panel span:first-child strong").textContent = styleGuides.length;
  document.querySelector(".stats-panel span:nth-child(2) strong").textContent = styleGuides.length;
  document.querySelector(".sidebar-note strong").textContent = copy.realCases(styleGuides.length);
}

function getPreviewDevice(guide, mode) {
  return getLibraryPreviewDevice(guide.id, mode);
}

function getPreviewModes(guide) {
  return ["image", guide.video && "video", guide.liveDemo && "live"].filter(Boolean);
}

function getCanonicalLivePreview(guide) {
  if (!guide?.liveDemo) return "";
  return guide.liveDemo.replace(/index\.html$/, "screenshots/library-preview-2x.png");
}

function getCardPoster(guide) {
  const canonicalScreen = canonicalCardScreens[guide?.id];
  if (canonicalScreen) return `${canonicalScreen}?v=${libraryPreviewAssetVersion}`;
  const livePreview = getCanonicalLivePreview(guide);
  if (livePreview) return `${livePreview}?v=${libraryPreviewAssetVersion}`;
  return guide.previewImage || guide.poster;
}

function getPreviewPoster(guide) {
  const livePreview = getCanonicalLivePreview(guide);
  if (livePreview) return `${livePreview}?v=${libraryPreviewAssetVersion}`;
  if (guide.previewImage) return guide.previewImage;
  return guide.poster;
}

function withPreviewVersion(src) {
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}v=${libraryPreviewAssetVersion}`;
}

function readTagFromUrl() {
  return new URL(window.location.href).searchParams.get("tag") || "";
}

function getEmbeddedDemoUrl(guide) {
  const url = new URL(guide.liveDemo, window.location.href);
  url.searchParams.set("embed", "1");
  return url.href;
}

function projectPatchForGuide(guide) {
  const template = guide.category === "commerce" ? "commerce" : guide.category === "creative" ? "dashboard" : guide.category === "wellness" ? "social" : "landing";
  const brand = guide.category === "commerce" ? "airbnb" : guide.category === "creative" ? "linear" : guide.category === "editorial" ? "notion" : "stripe";
  const normalizedTags = (guide.tags || []).map(normalizeTag).join(" ");
  const theme = /editorial|编辑|magazine/.test(normalizedTags) ? "editorial-commerce" : /glass|玻璃/.test(normalizedTags) ? "glass" : /brutal|粗野/.test(normalizedTags) ? "neo-brutal" : guide.category === "wellness" ? "soft-lifestyle" : "minimal-tech";
  return {
    name: `${guide.name} / ${guide.style}`,
    template,
    brand,
    theme,
    sourceCaseId: guide.id,
    sourceCaseName: guide.name,
    sourceCaseStyle: guide.style,
    sourceCaseImage: guide.poster || guide.referenceImage || "",
    sourceCaseDemo: guide.liveDemo || "",
    lastStep: "library"
  };
}

function labUrlForGuide(guide, view = "single") {
  const project = { ...(window.image2Project?.read?.() || {}), ...projectPatchForGuide(guide), view };
  const url = new URL("./brands.html", window.location.href);
  ["template", "system", "brand", "theme", "device", "view"].forEach((key) => project[key] && url.searchParams.set(key, project[key]));
  return window.image2I18n?.localizeUrl?.(url.href) || url.href;
}

function taskUrlForGuide(guide) {
  const url = new URL("./launcher.html", window.location.href);
  url.searchParams.set("intent", "rebuild");
  url.searchParams.set("source", "library");
  url.searchParams.set("case", guide.id);
  return window.image2I18n?.localizeUrl?.(url.href) || url.href;
}

function applyCaseToProject(id, announce = false) {
  const guide = styleGuides.find((item) => item.id === id);
  if (!guide) return;
  window.image2Project?.save?.(projectPatchForGuide(guide));
  if (announce) showProjectToast(`已把 ${guide.style} 应用到当前项目`);
}

function showProjectToast(message) {
  window.clearTimeout(toastTimer);
  const host = elements.previewDialog.open ? elements.previewDialog : document.body;
  if (elements.toast.parentElement !== host) host.append(elements.toast);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => { elements.toast.hidden = true; }, 1800);
}

function buildStyleMode(guide) {
  guide = localizeRecord(guide);
  if (window.image2I18n?.language === "en") return [
    `Style configuration: ${guide.name} / ${guide.style}`,
    `Reference direction: ${guide.reference}`,
    `Best for: ${guide.bestFor}`,
    "",
    "Default visual reference (local image)",
    `Reference path: ${guide.referenceImage}`,
    "Usage: treat this local image as the image reference. Preserve its composition, whitespace, color, and information density first.",
    `Image prompt: ${guide.prompt}`,
    "",
    `Core principle: ${guide.recipe.principle}`,
    `Image: ${guide.recipe.image}`,
    `Typography: ${guide.recipe.type}`,
    `Components: ${guide.recipe.components}`,
    `Motion: ${guide.recipe.motion}`,
    `Avoid: ${guide.recipe.avoid}`
  ].join("\n");
  return [
    `设计风格配置：${guide.name} / ${guide.style}`,
    `参考方向：${guide.reference}`,
    `适用场景：${guide.bestFor}`,
    "",
    "默认视觉参考（本地图片）",
    `参考图路径：${guide.referenceImage}`,
    "调用方式：生成或复刻界面时，将这张本地图片作为 image reference，优先保持它的构图、留白、色彩和信息密度。",
    `图像提示词：${guide.prompt}`,
    "",
    `核心原则：${guide.recipe.principle}`,
    `图片：${guide.recipe.image}`,
    `排版：${guide.recipe.type}`,
    `组件：${guide.recipe.components}`,
    `动效：${guide.recipe.motion}`,
    `避免：${guide.recipe.avoid}`
  ].join("\n");
}

function getStyleProfiles(guide) {
  return (guide.styleProfileIds || [])
    .map((id) => styleProfiles.find((profile) => profile.id === id))
    .filter(Boolean)
    .map(localizeRecord);
}

function buildStylePrompt(brand) {
  const colors = Object.entries(brand.foundations.colors).map(([name, value]) => `${name} ${value}`).join("; ");
  return [
    `风格档案：${brand.name}（${brand.sourceStatus}）`,
    `平台：${brand.platforms.join(" / ")}`,
    `色彩：${colors}`,
    `字体：${brand.foundations.typography.display}；${brand.foundations.typography.body}`,
    `间距与圆角：${brand.foundations.spacing}；${brand.foundations.radius}`,
    `组件：按钮 ${brand.components.button}；卡片 ${brand.components.card}；导航 ${brand.components.navigation}`,
    `视觉：${brand.visualLanguage.photography}`,
    `内容语气：${brand.contentVoice}`,
    `限制：${brand.donts.join("；")}。不得生成、仿制或添加品牌 Logo、商标、品牌文字、商业字体或专属素材，除非用户已经提供并确认授权。`
  ].join("\n");
}

function buildStyleTokens(brand) {
  const { colors, typography, spacing, radius, elevation, grid, motion } = brand.foundations;
  return JSON.stringify({
    styleProfileId: brand.id,
    sourceStatus: brand.sourceStatus,
    color: colors,
    typography,
    spacing,
    radius,
    elevation,
    grid,
    motion,
    components: brand.components
  }, null, 2);
}

window.image2StyleCatalog = { styleProfiles, buildStylePrompt, buildStyleTokens };

async function copyStyleMode(button) {
  const guide = styleGuides.find((item) => item.id === button.dataset.copyStyle);
  if (!guide) return;
  const label = button.textContent;
  try {
    await navigator.clipboard.writeText(buildStyleMode(guide));
    button.textContent = currentCopy().copied;
    track("style_copy", { caseId: guide.id, caseName: guide.name });
  } catch {
    fallbackCopy(buildStyleMode(guide));
    button.textContent = currentCopy().copied;
    track("style_copy", { caseId: guide.id, caseName: guide.name, method: "fallback" });
  }
  window.setTimeout(() => { button.textContent = label; }, 1500);
}

function fallbackCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  if (!document.execCommand("copy")) throw new Error("Clipboard copy was blocked");
  area.remove();
}

function getFilteredGuides() {
  return filterGuides({
    styleGuides,
    searchGuides,
    query: elements.searchInput.value,
    activeCategory,
    activeTag,
    localizeRecord,
    featuredCaseOrder
  });
}

const detail = createLibraryDetailController({
  elements,
  styleGuides,
  previewImageSets,
  helpers: {
    currentCopy,
    localizeRecord,
    getPreviewDevice,
    getPreviewProfile: getLibraryPreviewProfile,
    getPreviewModes,
    getPreviewPoster,
    getCardPoster,
    withPreviewVersion,
    getEmbeddedDemoUrl,
    getStyleProfiles,
    labUrlForGuide,
    taskUrlForGuide
  },
  actions: { track, copyStyleMode, applyCaseToProject, projectPatchForGuide }
});

const cards = createLibraryCards({
  elements,
  getState: () => ({ activeCategory, activeTag }),
  helpers: {
    currentCopy,
    localizeRecord,
    getFilteredGuides,
    getCardPoster,
    fittedCardPreviewIds,
    getStyleProfiles,
    normalizeTag
  },
  actions: {
    applyCaseToProject,
    openPreview: detail.openPreview,
    setTagFilter,
    track
  }
});

function setTagFilter(tag, { push = true } = {}) {
  activeTag = tag;
  activeCategory = "all";
  elements.categoryNav.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  const url = new URL(window.location.href);
  if (tag) url.searchParams.set("tag", tag);
  else url.searchParams.delete("tag");
  if (push) window.history.pushState({ tag }, "", url);
  cards.renderDemoGallery();
  elements.gallery?.scrollIntoView({ block: "start" });
}

function openInfoPanel(id) {
  activeInfoPanelId = id;
  const panel = (window.image2I18n?.language === "en" ? infoPanelsEnglish : infoPanels)[id];
  if (!panel) return;
  elements.infoDialogContent.innerHTML = `<p class="kicker">${panel.eyebrow}</p><h2 id="infoDialogTitle">${panel.title}</h2><p>${panel.intro}</p><ol class="info-steps">${panel.steps.map((step, index) => `<li><b>0${index + 1}</b><div><strong>${step[0]}</strong><span>${step[1]}</span></div></li>`).join("")}</ol><p class="info-callout">${panel.callout}</p>`;
  if (!elements.infoDialog.open) elements.infoDialog.showModal();
  track("info_panel_open", { panel: id });
}

elements.categoryNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeCategory = button.dataset.filter;
  activeTag = "";
  const url = new URL(window.location.href);
  url.searchParams.delete("tag");
  window.history.pushState({ tag: "" }, "", url);
  elements.categoryNav.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
  track("category_filter", { category: activeCategory });
  cards.renderDemoGallery();
});

let searchTimer;
elements.searchInput.addEventListener("input", () => {
  if (elements.searchInput.value.trim() && (activeCategory !== "all" || activeTag)) {
    activeCategory = "all";
    activeTag = "";
    const url = new URL(window.location.href);
    url.searchParams.delete("tag");
    window.history.replaceState({ tag: "" }, "", url);
    elements.categoryNav.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  }
  cards.renderDemoGallery();
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    const query = elements.searchInput.value.trim();
    if (query) track("library_search", { query, resultCount: getFilteredGuides().length });
  }, 600);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !document.querySelector("dialog[open]")) {
    elements.searchInput.value = "";
    elements.searchInput.blur();
    cards.renderDemoGallery();
  }
});

document.querySelectorAll("a[href*='github.com']").forEach((link) => link.addEventListener("click", () => track("github_click", { location: link.className || "stats" })));
document.querySelectorAll("[data-info-panel]").forEach((button) => button.addEventListener("click", () => openInfoPanel(button.dataset.infoPanel)));
elements.infoDialog.addEventListener("click", (event) => { if (event.target === elements.infoDialog) elements.infoDialog.close(); });

window.addEventListener("popstate", () => {
  activeTag = readTagFromUrl();
  activeCategory = "all";
  elements.categoryNav.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  cards.renderDemoGallery();
});

function applyLibraryLanguage() {
  const copy = currentCopy();
  document.title = copy.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", copy.description);
  document.documentElement.style.setProperty("--unavailable-label", `"${copy.unavailable}"`);
  document.querySelector(".skip-link").textContent = copy.skip;
  document.querySelector(".sidebar").setAttribute("aria-label", copy.sidebarLabel);
  document.querySelector(".filter-sidebar-head p").textContent = copy.sidebarLabel;
  elements.categoryNav.querySelectorAll("[data-filter]").forEach((button) => { button.querySelector("span").textContent = copy.categories[button.dataset.filter]; });
  document.querySelector(".sidebar-skills-heading a").textContent = copy.allSkills;
  document.querySelectorAll(".sidebar-skills > a").forEach((link, index) => {
    const skill = copy.skills[index];
    if (!skill) return;
    link.querySelector("span").textContent = skill[0];
    link.querySelector("small").textContent = skill[1];
  });
  document.querySelectorAll(".sidebar-resources button").forEach((button, index) => {
    button.querySelector("span").textContent = copy.guides[index][0];
    button.querySelector("small").textContent = copy.guides[index][1];
  });
  document.querySelector(".sidebar-social p").textContent = copy.author;
  const socialName = document.querySelector(".sidebar-social a:last-child span");
  if (socialName) socialName.textContent = window.image2I18n?.language === "en" ? "Xiaohongshu" : "小红书";
  const socialProfile = document.querySelector(".sidebar-social a:last-child small");
  if (socialProfile) socialProfile.textContent = copy.profile;
  document.querySelector(".sidebar-note span").textContent = copy.localDemo;
  document.querySelector("#pageTitle").textContent = copy.heroTitle;
  document.querySelector(".catalog-heading .intro").textContent = copy.heroIntro;
  const heroAuthor = document.querySelector(".hero-social > span");
  if (heroAuthor) heroAuthor.textContent = copy.heroAuthor;
  document.querySelector(".stats-panel span:first-child small").textContent = copy.cases;
  document.querySelector(".stats-panel span:nth-child(2) small").textContent = copy.styles;
  elements.searchInput.placeholder = copy.search;
  document.querySelector(".search-section").setAttribute("aria-label", copy.search);
  document.querySelector(".catalog-bar .kicker").textContent = copy.featured;
  document.querySelector("#catalogTitle").textContent = copy.startVisual;
  elements.emptyState.textContent = copy.empty;
  document.querySelectorAll(".dialog-close").forEach((button) => button.setAttribute("aria-label", window.image2I18n?.language === "en" ? "Close dialog" : "关闭弹窗"));
  updateCatalogCounts();
  detail.applyLanguage();
  cards.renderDemoGallery();
  if (elements.infoDialog.open && activeInfoPanelId) openInfoPanel(activeInfoPanelId);
}

window.image2I18n?.registerPage(applyLibraryLanguage);

updateCatalogCounts();
activeTag = readTagFromUrl();
cards.renderDemoGallery();
const linkedCaseId = new URL(window.location.href).searchParams.get("case");
if (linkedCaseId && styleGuides.some((guide) => guide.id === linkedCaseId)) window.setTimeout(() => detail.openPreview(linkedCaseId), 0);
track("library_view", { referrer: document.referrer || "direct" });
