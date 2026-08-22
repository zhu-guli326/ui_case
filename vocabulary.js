import { localizeVocabularyEntry, vocabularyCategories, vocabularyEntries as baseVocabularyEntries } from "./vocabulary-data.js?v=20260815-vocabulary-30";
import { vocabularyComponentEntries } from "./src/features/vocabulary/vocabulary-component-data.js?v=20260822-form-details-v1";
import { vocabularyPreviewMarkup } from "./vocabulary-preview.js?v=20260822-distinct-previews-v3";

const vocabularyEntries = [...baseVocabularyEntries, ...vocabularyComponentEntries];
const vocabularyById = Object.fromEntries(vocabularyEntries.map((entry) => [entry.id, entry]));

document.querySelectorAll(".reference-link").forEach((link) => link.remove());

const STORAGE_KEY = "image2-ui-vocabulary-favorites";
const i18n = window.image2I18n;
let currentLanguage = i18n?.language || "zh";

i18n?.addTranslations({
  "vocabulary.metaDescription": { zh: "UI 词典：按类别浏览页面结构、导航、内容、控件和反馈形式。", en: "A UI dictionary for browsing page structures, navigation, content, controls, and feedback patterns." },
  "vocabulary.pageTitle": { zh: "UI 词典 · IMAGE2 UI", en: "UI Vocabulary · IMAGE2 UI" },
  "vocabulary.skipResults": { zh: "跳到词条列表", en: "Skip to term list" },
  "vocabulary.backLibrary": { zh: "返回 image2 UI 案例库", en: "Back to the image2 UI library" },
  "vocabulary.mainNav": { zh: "主要导航", en: "Main navigation" },
  "vocabulary.heading": { zh: "UI 词典", en: "UI Vocabulary" },
  "vocabulary.heroEyebrow": { zh: "UI 词汇 / 从需求到代码", en: "UI WORDS / FROM REQUEST TO CODE" },
  "vocabulary.intro": { zh: "把页面基础、导航、内容、控件和反馈整理成一套可搜索的 UI 词典，先看结构，再选择适合的形式和实现方式。", en: "Browse one searchable UI dictionary covering foundations, navigation, content, controls, and feedback." },
  "vocabulary.keyTerms": { zh: "个词典条目", en: "dictionary entries" },
  "vocabulary.localExamples": { zh: "完整方案原型", en: "Complete solution prototypes" },
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
  "vocabulary.resultsEyebrow": { zh: "按界面作用浏览", en: "BROWSE BY ROLE" },
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
  "vocabulary.navigationDeepTitle": { zh: "导航不是只有一种栏", en: "Navigation is more than one bar" },
  "vocabulary.navigationEyebrow": { zh: "深入了解 / 导航模式", en: "DEEP DIVE / NAVIGATION PATTERNS" },
  "vocabulary.navigationDeepIntro": { zh: "先判断它服务的是全局、局部、层级还是临时任务，再选择位置和样式。下面 8 种模式看起来相似，但承担的导航范围完全不同。", en: "First decide whether the pattern serves global, local, hierarchical, or temporary navigation. These eight patterns may look similar, but they operate at very different scopes." },
  "vocabulary.navigationMatrixTitle": { zh: "到底该选哪一种？", en: "Which pattern should you choose?" },
  "vocabulary.matrixEyebrow": { zh: "选择判断", en: "DECISION MATRIX" },
  "vocabulary.navigationMatrixIntro": { zh: "不要从“哪种更好看”开始，先看信息范围、入口数量、设备和切换频率。", en: "Do not begin with visual preference. Start with information scope, destination count, device, and switching frequency." },
  "vocabulary.navigationSources": { zh: "参考规范", en: "Reference guidelines" },
});

const tr = (zh, en) => currentLanguage === "en" ? en : zh;
const localizedEntry = (entry, language = currentLanguage) => localizeVocabularyEntry(entry, language);
const localizedEntryById = (id) => localizedEntry(vocabularyById[id]);
const termAliasMarkup = (entry) => currentLanguage === "zh" ? ` <em>${escapeHtml(entry.en)}</em>` : "";

const navigationPrinciples = [
  { number: "01", title: ["先分导航层级", "Define the scope"], body: ["全局导航连接产品主要区域；局部导航只切换当前对象或内容。", "Global navigation connects product areas; local navigation switches views within the current context."] },
  { number: "02", title: ["再看入口数量", "Count destinations"], body: ["3–5 个移动端一级入口适合底部标签；大量桌面入口更适合分组侧栏。", "Three to five mobile destinations fit a bottom bar; many desktop destinations need a grouped sidebar."] },
  { number: "03", title: ["最后决定位置", "Choose placement last"], body: ["位置由设备、切换频率和内容密度决定，不是由视觉偏好决定。", "Placement follows device, switching frequency, and content density—not visual taste."] },
];

const navigationPatterns = [
  {
    number: "01", preview: "top", termId: "top-nav", name: ["顶部导航", "Top navigation"], en: "Navbar",
    scope: ["全局一级", "Global primary"], count: "3–7",
    fit: ["品牌官网、内容站和入口较少的桌面产品。横向空间充足，用户需要频繁跨主栏目。", "Marketing sites, content sites, and desktop products with a small number of primary areas."],
    avoid: ["入口超过一行，或高频工作台需要展示多级目录时。", "Avoid when destinations wrap or a dense workspace needs multiple levels."],
    mobile: ["折叠为抽屉，或将 3–5 个最高频入口改成底部标签。", "Collapse into a drawer, or move the top three to five destinations into a bottom bar."],
  },
  {
    number: "02", preview: "side", termId: "sidebar", name: ["侧边导航", "Side navigation"], en: "Sidebar",
    scope: ["全局 / 工作区", "Global / workspace"], count: "5–20+",
    fit: ["后台、创作工具和企业工作台。需要分组、二级入口和持续可见的工作区上下文。", "Admin panels, creation tools, and enterprise workspaces that need groups and nested destinations."],
    avoid: ["内容需要全宽沉浸，或产品只有三四个简单页面时。", "Avoid for immersive full-width content or products with only a few simple pages."],
    mobile: ["转成可关闭抽屉；不要把整条桌面侧栏硬压窄。", "Convert it into a dismissible drawer instead of squeezing the desktop sidebar."],
  },
  {
    number: "03", preview: "rail", termId: "sidebar", name: ["导航轨道", "Navigation rail"], en: "Navigation Rail",
    scope: ["全局一级", "Global primary"], count: "3–7",
    fit: ["平板、宽屏移动设备或需要给内容让出空间的桌面工具。图标入口高频且稳定。", "Tablets, wide mobile layouts, and desktop tools that need compact, persistent navigation."],
    avoid: ["图标含义不熟悉、入口经常变化或需要多级分组时。", "Avoid when icons are unfamiliar, destinations change often, or nested groups are required."],
    mobile: ["窄屏切换为底部标签；宽屏时可扩展成带文字的侧栏。", "Become a bottom bar on narrow screens or expand into a labeled sidebar on wider screens."],
  },
  {
    number: "04", preview: "bottom", termId: "bottom-tabs", name: ["底部标签栏", "Bottom tab bar"], en: "Bottom Navigation",
    scope: ["移动端全局一级", "Mobile global primary"], count: "3–5",
    fit: ["移动 App 的最高频目的地。入口必须长期稳定，用户需要单手快速切换。", "The most frequent, stable destinations in a mobile app, optimized for one-handed switching."],
    avoid: ["超过 5 个入口、临时操作，或把“发布”之外的普通按钮混入导航。", "Avoid more than five destinations, temporary actions, or mixing ordinary actions into navigation."],
    mobile: ["保持图标和短标签，适配安全区；选中态不能只依赖颜色。", "Keep icons and short labels above the safe area; selection cannot rely on color alone."],
  },
  {
    number: "05", preview: "drawer", termId: "drawer", name: ["抽屉导航", "Navigation drawer"], en: "Navigation Drawer",
    scope: ["全局补充 / 临时", "Global overflow / temporary"], count: "5–20",
    fit: ["移动端入口较多，但不需要持续展示；也适合放账户、设置等低频入口。", "Mobile products with many destinations that do not need to remain visible, plus low-frequency account areas."],
    avoid: ["最高频的 3–5 个核心页面全部藏进去，会降低发现和切换效率。", "Avoid hiding every high-frequency primary destination because discoverability and switching suffer."],
    mobile: ["从屏幕边缘覆盖出现，保留明确关闭方式、焦点管理和背景遮罩。", "Open from an edge with a clear close action, focus management, and backdrop."],
  },
  {
    number: "06", preview: "tabs", termId: "tabs", name: ["标签页导航", "Tab navigation"], en: "Tabs",
    scope: ["当前对象的局部导航", "Local object navigation"], count: "2–6",
    fit: ["同一页面、同一对象下的并列内容，例如概览、评论、版本和设置。", "Peer views within the same page or object, such as overview, comments, versions, and settings."],
    avoid: ["用它连接完全不同的产品区域，或标签多到需要记忆和滚动寻找。", "Avoid connecting unrelated product areas or creating more tabs than users can scan."],
    mobile: ["标签可横向滚动，但当前项必须可见；不要让整个页面横向溢出。", "Tabs may scroll horizontally, but the active tab must remain visible without page-level overflow."],
  },
  {
    number: "07", preview: "crumbs", termId: "breadcrumbs", name: ["面包屑导航", "Breadcrumb navigation"], en: "Breadcrumbs",
    scope: ["层级定位", "Hierarchy and location"], count: "2–5 层",
    fit: ["文档、文件系统、电商分类和后台详情。用户可能从搜索或深链接直接进入。", "Documentation, file systems, commerce categories, and deep admin pages entered from search or links."],
    avoid: ["线性步骤、浏览历史返回，或本来只有一层内容时。", "Avoid for linear steps, browser-history back behavior, or flat information structures."],
    mobile: ["折叠中间层级，至少保留父级返回和当前页面位置。", "Collapse middle ancestors while preserving the parent path and current location."],
  },
  {
    number: "08", preview: "mega", termId: "top-nav", name: ["大型菜单", "Mega menu"], en: "Mega Menu",
    scope: ["全局分类发现", "Global category discovery"], count: "20–100+",
    fit: ["电商、教育、媒体等栏目很多的站点。需要同时展示分组、层级和精选入口。", "Commerce, education, and media sites with many grouped destinations and highlighted entry points."],
    avoid: ["产品入口少、分类不稳定，或仅靠 hover 才能操作时。", "Avoid for small or unstable taxonomies, and never make hover the only way to operate it."],
    mobile: ["改成分层抽屉或手风琴列表，不要缩小桌面大面板。", "Convert it into a layered drawer or accordion instead of shrinking the desktop panel."],
  },
];
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
const taxonomyNav = $("#taxonomyNav");
const entryGrid = $("#entryGrid");
const resultsHeading = $(".results-heading");
const resultsEyebrow = $("#resultsEyebrow");
const resultCount = $("#resultCount");
const resultsSummary = $("#resultsSummary");
const emptyState = $("#emptyState");
const navigationDeepDive = $("#navigationDeepDive");
const toast = $("#toast");

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
const navText = (pair) => tr(pair[0], pair[1]);
const showsNavigationDeepDive = () => false;

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
  const category = vocabularyCategories.find((item) => item.id === id);
  return category ? tr(category.label, category.en) : tr("词条", "Term");
}

function categoryEyebrow(id) {
  const labels = {
    all: ["按界面作用浏览", "BROWSE BY ROLE"],
    foundation: ["页面基础", "PAGE FOUNDATIONS"],
    navigation: ["导航与发现", "NAVIGATION & DISCOVERY"],
    content: ["内容展示", "CONTENT & MEDIA"],
    controls: ["控件与表单", "CONTROLS & FORMS"],
    feedback: ["反馈与浮层", "FEEDBACK & OVERLAYS"],
    visual: ["视觉与实现", "VISUAL DESIGN"],
    favorites: ["我的收藏", "MY FAVORITES"],
  };
  const pair = labels[id] || labels.all;
  return tr(pair[0], pair[1]);
}

function categoryDisplayCount(id) {
  if (id === "favorites") return state.favorites.size;
  if (id === "all") return vocabularyEntries.length;
  return vocabularyEntries.filter((entry) => entry.category === id).length;
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
    const count = categoryDisplayCount(category.id);
    return `<button class="taxonomy-link${selected ? " is-selected" : ""}" type="button" data-category="${category.id}" aria-pressed="${selected}"><span>${escapeHtml(tr(category.label, category.en))}</span><b>${count}</b></button>`;
  }).join("");
  taxonomyNav.innerHTML = html;
  [...document.querySelectorAll("[data-category]")].forEach((button) => button.addEventListener("click", () => {
    const category = button.dataset.category;
    state.category = category;
    render();
    focusCategory(category, ".taxonomy-link");
  }));
}

function previewMarkup(entry) {
  const localized = localizedEntry(entry);
  const preview = vocabularyPreviewMarkup(entry, { imageUrl: entry.example.src, language: currentLanguage });
  return `<div class="entry-visual" role="img" aria-label="${escapeHtml(tr(`${localized.name}的界面缩略图`, `Thumbnail for ${localized.name}`))}">${preview}<span class="visual-label"><span>${escapeHtml(tr("快速识别", "QUICK LOOK"))}</span><span>${escapeHtml(tr("点击翻转", "FLIP"))} ↻</span></span></div>`;
}

function detailPreviewMarkup(entry) {
  return vocabularyPreviewMarkup(entry, { imageUrl: entry.example.src, language: currentLanguage });
}

function cardMarkup(entry) {
  const localized = localizedEntry(entry);
  const favorite = state.favorites.has(entry.id);
  const useWhen = localized.useWhen?.[0] || localized.role;
  const tags = (localized.tags || []).slice(0, 2);
  return `<article class="entry-card" data-entry-id="${escapeHtml(entry.id)}">
    <div class="entry-card-inner">
      <section class="entry-card-face entry-card-front" aria-hidden="false">
        <button class="entry-flip-hitarea" type="button" data-flip-card aria-pressed="false" aria-label="${escapeHtml(tr(`翻转 ${localized.name}，查看样式`, `Flip ${localized.name} to see the pattern`))}"></button>
        <div class="entry-card-body">
          <div class="entry-card-meta"><span>${escapeHtml(categoryLabel(entry.category))}</span><button class="favorite-button${favorite ? " is-favorite" : ""}" type="button" data-favorite="${escapeHtml(entry.id)}" aria-pressed="${favorite}" aria-label="${escapeHtml(favorite ? `${tr("取消收藏", "Remove from favorites")} ${localized.name}` : `${tr("收藏", "Add to favorites")} ${localized.name}`)}" title="${escapeHtml(favorite ? tr("取消收藏", "Remove from favorites") : tr("收藏", "Add to favorites"))}">${favorite ? "★" : "☆"}</button></div>
          <h3>${escapeHtml(localized.name)}${termAliasMarkup(entry)}</h3>
          <p class="entry-ask">“${escapeHtml(localized.ask)}”</p>
          ${previewMarkup(entry)}
        </div>
      </section>
      <section class="entry-card-face entry-card-back" aria-hidden="true" inert>
        <button class="entry-flip-hitarea entry-flip-hitarea--back" type="button" data-flip-card aria-pressed="false" aria-label="${escapeHtml(tr(`翻回 ${localized.name} 的介绍`, `Flip back to the ${localized.name} introduction`))}"></button>
        <div class="entry-card-back-shell">
          <div class="entry-card-back-visual"><img class="entry-card-back-media" src="${escapeHtml(entry.example.src || "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80")}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div>
          <div class="entry-card-back-insight"><span>${escapeHtml(tr("适用场景", "BEST FOR"))}</span><p>${escapeHtml(useWhen)}</p><div>${tags.map((tag) => `<i>${escapeHtml(tag)}</i>`).join("")}</div></div>
          <div class="entry-card-back-actions"><button class="entry-copy-prompt-button" type="button" data-copy-prompt="${escapeHtml(entry.id)}"><span>${escapeHtml(tr("复制 Prompt", "Copy prompt"))}</span><b aria-hidden="true">⧉</b></button></div>
        </div>
      </section>
    </div>
  </article>`;
}

function setCardFlipped(card, flipped, { moveFocus = true } = {}) {
  const front = card.querySelector(".entry-card-front");
  const back = card.querySelector(".entry-card-back");
  card.classList.toggle("is-flipped", flipped);
  front.setAttribute("aria-hidden", String(flipped));
  back.setAttribute("aria-hidden", String(!flipped));
  front.inert = flipped;
  back.inert = !flipped;
  card.querySelectorAll("[data-flip-card]").forEach((button) => button.setAttribute("aria-pressed", String(flipped)));
  if (!moveFocus) return;
  requestAnimationFrame(() => {
    const target = flipped
      ? back.querySelector(".entry-flip-hitarea")
      : front.querySelector(".entry-flip-hitarea");
    target?.focus({ preventScroll: true });
  });
}

function renderEntries() {
  const list = filteredEntries();
  const navigationMode = showsNavigationDeepDive();
  const displayedCount = list.length;
  resultsEyebrow.textContent = categoryEyebrow(state.category);
  resultsHeading.hidden = navigationMode;
  resultsSummary.hidden = navigationMode;
  entryGrid.hidden = navigationMode;
  entryGrid.innerHTML = navigationMode ? "" : list.map(cardMarkup).join("");
  emptyState.hidden = navigationMode || list.length > 0;
  resultCount.textContent = currentLanguage === "en" ? `${displayedCount} ${displayedCount === 1 ? "term" : "terms"}` : `${displayedCount} 条`;
  resultsSummary.textContent = state.query
    ? currentLanguage === "en" ? `${list.length} ${list.length === 1 ? "term matches" : "terms match"} “${state.query}”` : `“${state.query}”匹配 ${list.length} 个词条`
    : state.category === "favorites"
      ? currentLanguage === "en" ? `You saved ${list.length} ${list.length === 1 ? "term" : "terms"}` : `你收藏了 ${list.length} 个词条`
      : currentLanguage === "en" ? `${categoryLabel(state.category)} · ${list.length} ${list.length === 1 ? "term" : "terms"}` : `${categoryLabel(state.category)} · ${list.length} 个词条`;
  document.querySelectorAll("[data-flip-card]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const card = button.closest(".entry-card");
    setCardFlipped(card, !card.classList.contains("is-flipped"));
  }));
  document.querySelectorAll("[data-copy-prompt]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    copyPrompt(button.dataset.copyPrompt);
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

function tableMarkup(rows, headings) {
  const visibleRows = rows;
  return `<div class="detail-table-wrap"><table><thead><tr>${headings.map((heading) => `<th>${escapeHtml(heading)}</th>`).join("")}</tr></thead><tbody>${visibleRows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function relatedEntries(entry) {
  const ids = new Set(entry.related);
  for (const candidate of vocabularyEntries) {
    if (candidate.related.includes(entry.id)) ids.add(candidate.id);
  }
  ids.delete(entry.id);
  return [...ids].map(localizedEntryById).filter(Boolean).slice(0, 8);
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
    <section class="prompt-panel"><div class="prompt-heading"><h3>${tr("你可以这样告诉 AI Agent", "Tell your AI agent this")}</h3><button class="copy-prompt-button" type="button" data-copy-prompt="${escapeHtml(entry.id)}">${tr("复制提示词", "Copy prompt")}</button></div><pre id="prompt-${escapeHtml(entry.id)}"><code>${escapeHtml(entry.prompt)}</code></pre></section>
    <div class="detail-columns">
      <section><h3>${tr("组成结构 · Anatomy", "Anatomy")}</h3>${tableMarkup(entry.anatomy, [tr("部件", "Part"), tr("它负责什么", "Responsibility")])}</section>
      <section><h3>${tr("常见形式 · Forms", "Common forms")}</h3>${tableMarkup(entry.variants, [tr("形式", "Form"), tr("什么时候用", "When to use")])}</section>
    </div>
    <div class="detail-columns">
      <section><h3>${tr("状态与响应式", "States and responsive behavior")}</h3>${tableMarkup(entry.states, [tr("状态", "State"), tr("实现提示", "Implementation hint")])}</section>
      <section><h3>${tr("什么时候用 / 不用", "When to use or avoid")}</h3><h4>${tr("适合", "Use when")}</h4>${listMarkup(entry.useWhen)}<h4>${tr("不要硬用", "Avoid when")}</h4>${listMarkup(entry.avoidWhen)}</section>
    </div>
    <section class="split-panel"><div><h3>${tr("代码界面", "Code UI")}</h3>${listMarkup(entry.codeUI, "compact-list")}</div><div><h3>${tr("真实媒体建议", "Real media guidance")}</h3>${listMarkup(entry.media, "compact-list")}</div></section>
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

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
}

$("#vocabularySearch").addEventListener("input", (event) => { state.query = event.target.value; renderNavigationDeepDive(); renderEntries(); });
$("#sortSelect").addEventListener("change", (event) => { state.sort = event.target.value; renderEntries(); });
$("#clearSearch").addEventListener("click", () => { state.query = ""; state.category = "all"; $("#vocabularySearch").value = ""; render(); $("#vocabularySearch").focus(); });
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#vocabularySearch").focus(); } if (event.key === "Escape") { state.query = ""; $("#vocabularySearch").value = ""; renderNavigationDeepDive(); renderEntries(); } });
window.addEventListener("image2:languagechange", (event) => {
  currentLanguage = event.detail?.language === "en" ? "en" : "zh";
  render();
});

render();
