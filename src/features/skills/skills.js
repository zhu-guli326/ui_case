import {
  repositories,
  repositoriesEn,
  skillsTranslations,
  categoryGroups,
  categoryLabels,
  categoryVisuals,
  skillVisuals,
  skillOfficialPages
} from "./skills-data.js";
import { designReferenceGroups, designReferenceWebsites } from "./skills-web-data.js";
import {
  getRepositoryItems as filterRepositoryItems,
  getFilteredRepositories as filterRepositories,
  getFilteredWebsites as filterWebsites
} from "./skills-filter.js";
import { createSkillsRenderer } from "./skills-render.js";

const elements = {
  repoList: document.querySelector("#repoList"),
  repoSearch: document.querySelector("#repoSearch"),
  repoFacets: document.querySelector("#repoFacets"),
  repoCount: document.querySelector("#repoCount"),
  repoSyncStatus: document.querySelector("#repoSyncStatus"),
  skillsHeroCount: document.querySelector("#skillsHeroCount"),
  skillsHeroKind: document.querySelector("#skillsHeroKind"),
  skillsHeroBody: document.querySelector("#skillsHeroBody"),
  heroUpdateCount: document.querySelector("#heroUpdateCount"),
  heroUpdateLabel: document.querySelector("#heroUpdateLabel"),
  categoryCount: document.querySelector("#categoryCount"),
  repoSortButtons: document.querySelectorAll("[data-repo-sort]"),
  directoryModeButtons: document.querySelectorAll("[data-directory-mode]"),
  repoSort: document.querySelector("#repoSort"),
  repoInspector: document.querySelector("#repoInspector"),
  repoClearFilters: document.querySelector("#repoClearFilters"),
  officialSkillLink: document.querySelector("[data-official-skill-link]")
};

const track = (name, properties) => window.image2Analytics?.track(name, properties);
const state = {
  currentLanguage: "zh",
  resolvedRepositories: null,
  activeDirectoryMode: "SKILL",
  activeCategories: new Set(),
  activeSort: "CURATED",
  searchQuery: "",
  activeSourceOnly: false,
  selectedSlug: repositories[0].slug,
  repositoryStatsStatus: "loading",
  repositoryStatsUpdatedAt: null
};
const validDirectoryModes = new Set(["SKILL", "WEB"]);
const validSorts = new Set(["CURATED", "STARS", "UPDATED"]);

function restoreDirectoryStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const sort = params.get("sort");
  state.activeDirectoryMode = validDirectoryModes.has(mode) ? mode : "SKILL";
  state.activeSort = validSorts.has(sort) ? sort : "CURATED";
  state.searchQuery = params.get("q") || "";
  state.activeCategories.clear();
  (params.get("categories") || "").split(",").map((item) => item.trim()).filter(Boolean).forEach((category) => state.activeCategories.add(category));
}

function applyDirectoryStateToParams(params) {
  params.set("lang", state.currentLanguage);
  if (state.activeDirectoryMode === "WEB") params.set("mode", state.activeDirectoryMode);
  else params.delete("mode");
  if (state.activeDirectoryMode === "SKILL" && state.activeSort !== "CURATED") params.set("sort", state.activeSort);
  else params.delete("sort");
  if (state.activeCategories.size) params.set("categories", [...state.activeCategories].join(","));
  else params.delete("categories");
  const query = state.searchQuery.trim();
  if (query) params.set("q", query);
  else params.delete("q");
}

function syncDirectoryStateToUrl() {
  if (!window.history?.replaceState) return;
  const url = new URL(window.location.href);
  applyDirectoryStateToParams(url.searchParams);
  window.history.replaceState(null, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
}

function buildSkillDetailHref(slug) {
  const params = new URLSearchParams();
  params.set("repo", slug);
  applyDirectoryStateToParams(params);
  return `./skill-detail.html?${params.toString()}`;
}

restoreDirectoryStateFromUrl();

function getCategoryLabel(category) {
  return categoryLabels[category]?.[state.currentLanguage] || category;
}

function getCategoryVisual(category) {
  return categoryVisuals[category]?.[state.currentLanguage] || (state.currentLanguage === "en" ? "Make work\nclearer" : "让工作\n更清晰");
}

function getSkillVisual(item) {
  return skillVisuals[item.slug]?.[state.currentLanguage] || getCategoryVisual(item.category);
}

function getSkillOfficialPage(item) {
  return skillOfficialPages[item.slug] || `https://github.com/${item.slug}`;
}

function getSkillBrowserLabel(item) {
  return getSkillOfficialPage(item).replace(/^https?:\/\/(?:www\.)?/, "").replace(/\/$/, "");
}

function getSkillCover(item) {
  if (item.coverImage) return item.coverImage;
  const filename = item.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `./assets/skills/repositories/${filename}.jpg`;
}

function getSkillCoverMarkup(item) {
  const poster = getSkillCover(item);
  if (item.coverType === "video" && item.coverSrc) {
    const posterAttribute = item.coverImage ? ` poster="${escapeHtml(item.coverImage)}"` : "";
    return `<video class="repo-cover-image" src="${escapeHtml(item.coverSrc)}"${posterAttribute} autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>`;
  }
  return `<img class="repo-cover-image" src="${escapeHtml(poster)}" alt="" loading="lazy" decoding="async">`;
}

function getWebsitePreviewPath(item) {
  if (item.previewImage) return item.previewImage;
  const filename = item.domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `./assets/skills/web/${filename}.jpg`;
}

function getWebsitePreviewMarkup(item) {
  const poster = getWebsitePreviewPath(item);
  if (item.previewType === "video" && item.previewSrc) {
    const posterAttribute = item.previewImage ? ` poster="${escapeHtml(item.previewImage)}"` : "";
    return `<video src="${escapeHtml(item.previewSrc)}"${posterAttribute} autoplay muted loop playsinline preload="metadata" aria-label="${escapeHtml(item.name)} ${state.currentLanguage === "en" ? "official website video preview" : "官网视频预览"}" data-web-preview></video>`;
  }
  return `<img src="${escapeHtml(poster)}" alt="${escapeHtml(item.name)} ${state.currentLanguage === "en" ? "official website preview" : "官网页面预览"}" loading="lazy" decoding="async" data-web-preview>`;
}

window.image2SkillsCatalog = { repositories, repositoriesEn, categoryLabels, skillVisuals };

function formatNumber(value) {
  if (typeof value !== "number") return "…";
  return value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value);
}

function formatDate(date) {
  if (!date) return state.currentLanguage === "en" ? "Recently updated" : "近期更新";
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000));
  if (state.currentLanguage === "en") {
    if (days === 0) return "Updated today";
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) === 1 ? "" : "s"} ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? "" : "s"} ago`;
  }
  if (days === 0) return "今天更新";
  if (days < 7) return `${days} 天前更新`;
  if (days < 30) return `${Math.floor(days / 7)} 周前更新`;
  return `${Math.floor(days / 30)} 个月前更新`;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function skillIcon(name, className = "") {
  const safeName = String(name).replace(/[^a-z-]/g, "");
  const safeClassName = String(className).replace(/[^a-z0-9 _-]/gi, "").trim();
  return `<svg class="skills-icon${safeClassName ? ` ${safeClassName}` : ""}" aria-hidden="true"><use href="#ondesign-icon-${safeName}"></use></svg>`;
}

function getRepositoryItems() {
  return filterRepositoryItems({
    repositories,
    repositoriesEn,
    resolvedRepositories: state.resolvedRepositories,
    currentLanguage: state.currentLanguage
  });
}

function getFilteredRepositories() {
  return filterRepositories({
    items: getRepositoryItems(),
    activeCategories: state.activeCategories,
    searchQuery: state.searchQuery,
    activeSort: state.activeSort
  });
}

function getFilteredWebsites() {
  return filterWebsites({
    items: designReferenceWebsites,
    activeCategories: state.activeCategories,
    searchQuery: state.searchQuery,
    activeSourceOnly: state.activeSourceOnly,
    currentLanguage: state.currentLanguage
  });
}

function formatSyncTime(timestamp) {
  if (!timestamp) return state.currentLanguage === "en" ? "Live data" : "实时数据";
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (state.currentLanguage === "en") {
    if (elapsedMinutes < 1) return "just synced";
    if (elapsedMinutes < 60) return `synced ${elapsedMinutes}m ago`;
    return `synced ${Math.floor(elapsedMinutes / 60)}h ago`;
  }
  if (elapsedMinutes < 1) return "刚刚同步";
  if (elapsedMinutes < 60) return `${elapsedMinutes} 分钟前同步`;
  return `${Math.floor(elapsedMinutes / 60)} 小时前同步`;
}

function copyToClipboard(button, value) {
  const span = button.querySelector("span");
  const originalLabel = span ? span.textContent : "";
  const doneLabel = state.currentLanguage === "en" ? "Copied!" : "已复制";
  const failLabel = state.currentLanguage === "en" ? "Failed" : "复制失败";
  const succeed = () => {
    button.classList.add("is-copied");
    if (span) span.textContent = doneLabel;
    window.setTimeout(() => {
      button.classList.remove("is-copied");
      if (span) span.textContent = originalLabel;
    }, 1800);
  };
  const fail = () => { if (span) span.textContent = failLabel; };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).then(succeed).catch(fail);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand("copy"); succeed(); } catch { fail(); }
    textarea.remove();
  }
}

function copyCloneCommand(button) {
  const slug = button.dataset.copyInvoke;
  const repoName = slug.split("/").pop();
  copyToClipboard(button, `git clone https://github.com/${slug}.git ~/.codex/skills/${repoName}`);
}

const renderer = createSkillsRenderer({
  elements,
  data: { categoryGroups, designReferenceGroups, designReferenceWebsites },
  state,
  helpers: {
    getRepositoryItems,
    getFilteredRepositories,
    getFilteredWebsites,
    escapeHtml,
    skillIcon,
    getCategoryLabel,
    getSkillBrowserLabel,
    getSkillCoverMarkup,
    getSkillVisual,
    formatNumber,
    formatDate,
    formatSyncTime,
    buildSkillDetailHref,
    getWebsitePreviewMarkup
  },
  actions: { track, copyCloneCommand, syncDirectoryStateToUrl }
});

const repositoryStatsCacheKey = "ondesign-skill-repository-stats-v1";
const repositoryStatsCacheTtl = 6 * 60 * 60 * 1000;

function readRepositoryStatsCache() {
  try { return JSON.parse(localStorage.getItem(repositoryStatsCacheKey) || "null"); } catch { return null; }
}

function applyRepositoryStats(items, cachedItems = {}) {
  return items.map((item) => ({ ...item, ...(cachedItems[item.slug] || {}) }));
}

async function fetchRepositoryStats(item, previous = {}) {
  try {
    const response = await fetch(`https://api.github.com/repos/${item.slug}`, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const repo = await response.json();
    return { ...item, description: repo.description, stars: repo.stargazers_count, starsLabel: "", forks: repo.forks_count, updatedAt: repo.pushed_at };
  } catch {
    try {
      const response = await fetch(`https://img.shields.io/github/stars/${item.slug}.json`, { cache: "no-store" });
      if (!response.ok) throw new Error("Shields request failed");
      const badge = await response.json();
      return { ...item, ...previous, starsLabel: badge.message || previous.starsLabel || "" };
    } catch {
      return { ...item, ...previous };
    }
  }
}

async function loadRepositoryData() {
  const cache = readRepositoryStatsCache();
  const cachedItems = cache?.items || {};
  const cacheIsComplete = repositories.every((item) => Boolean(cachedItems[item.slug]));
  const cacheIsFresh = Boolean(cacheIsComplete && cache?.savedAt && Date.now() - cache.savedAt < repositoryStatsCacheTtl);
  state.resolvedRepositories = applyRepositoryStats(repositories, cachedItems);
  state.repositoryStatsUpdatedAt = cache?.savedAt || null;
  state.repositoryStatsStatus = cacheIsFresh ? "ready" : "loading";
  renderer.renderRepositories();
  if (cacheIsFresh) return;

  const resolved = await Promise.all(repositories.map((item) => fetchRepositoryStats(item, cachedItems[item.slug])));
  state.resolvedRepositories = resolved;
  const hasStats = resolved.some((item) => typeof item.stars === "number" || Boolean(item.starsLabel));
  state.repositoryStatsStatus = hasStats ? "ready" : "unavailable";
  state.repositoryStatsUpdatedAt = hasStats ? Date.now() : (cache?.savedAt || null);
  const items = Object.fromEntries(resolved.map((item) => [item.slug, {
    description: item.description,
    stars: item.stars,
    starsLabel: item.starsLabel,
    forks: item.forks,
    updatedAt: item.updatedAt
  }]));
  if (hasStats) {
    try { localStorage.setItem(repositoryStatsCacheKey, JSON.stringify({ savedAt: state.repositoryStatsUpdatedAt, items })); } catch {}
  }
  renderer.renderRepositories();
}

function renderPage(language = "zh") {
  state.currentLanguage = language === "en" ? "en" : "zh";
  document.title = state.currentLanguage === "en" ? "Design Skill Directory · ONDesign" : "设计 Skill 观察 · ONDesign";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = state.currentLanguage === "en"
    ? "A curated directory of open-source design Skills and tools."
    : "设计 Skill 观察与可复制提示词。";
  if (elements.skillsHeroCount) elements.skillsHeroCount.textContent = String(getRepositoryItems().length);
  renderer.renderRepositories();
}

if (elements.repoSearch) elements.repoSearch.addEventListener("input", () => {
  state.searchQuery = elements.repoSearch.value;
  renderer.renderRepositories();
});

if (elements.repoClearFilters) elements.repoClearFilters.addEventListener("click", () => {
  state.activeCategories.clear();
  state.activeSourceOnly = false;
  state.activeSort = "CURATED";
  state.searchQuery = "";
  renderer.renderRepositories();
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-source-filter]");
  if (!button) return;
  state.activeSourceOnly = !state.activeSourceOnly;
  track(state.activeDirectoryMode === "WEB" ? "source_filter_select" : "skill_filter_select", { sourceOnly: state.activeSourceOnly });
  renderer.renderRepositories();
});

elements.repoSortButtons.forEach((button) => button.addEventListener("click", () => {
  state.activeSort = button.dataset.repoSort;
  track("skill_sort_select", { sort: state.activeSort });
  renderer.renderRepositories();
}));

elements.directoryModeButtons.forEach((button) => button.addEventListener("click", () => {
  state.activeDirectoryMode = button.dataset.directoryMode;
  state.activeCategories.clear();
  state.activeSourceOnly = false;
  state.activeSort = "CURATED";
  state.searchQuery = "";
  track("directory_mode_select", { mode: state.activeDirectoryMode });
  renderer.renderRepositories();
}));

if (elements.officialSkillLink) elements.officialSkillLink.addEventListener("click", () => track("official_skill_open", { repository: "zhu-guli326/image2_UI_skill" }));

if (elements.repoList) {
  if (window.image2I18n) {
    window.image2I18n.addTranslations(skillsTranslations);
    window.image2I18n.registerPage(renderPage);
    window.image2I18n.refresh();
  } else {
    renderPage("zh");
  }
  loadRepositoryData();
  track("skills_page_view");
}
