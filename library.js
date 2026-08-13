import { getLibraryPreviewDevice, getLibraryPreviewDisplayDevice, libraryPreviewAssetVersion } from "./library-preview-config.mjs";
import { searchGuides } from "./library-search.mjs?v=20260813-search-v5";
import { styleGuides, styleProfiles } from "./catalog/index.js";

const previewImageSets = Object.freeze({
  museum: [
    { src: "./assets/cases/museum-app/home-screen.png", label: "首页" },
    { src: "./assets/cases/museum-app/exhibitions-screen.png", label: "展览列表" },
    { src: "./assets/cases/museum-app/detail-screen.png", label: "展览详情" }
  ],
  fashion: [
    { src: "./assets/cases/fashion-shopping-app/hero-screen.png", label: "品牌首页" },
    { src: "./assets/cases/fashion-shopping-app/catalog-screen.png", label: "商品目录" },
    { src: "./assets/cases/fashion-shopping-app/favorites-screen.png", label: "收藏页" }
  ],
  fufu: [
    { src: "./demo/fufu-bakery/screenshots/01-welcome.png", label: "欢迎页" },
    { src: "./demo/fufu-bakery/screenshots/02-home.png", label: "烘焙首页" },
    { src: "./demo/fufu-bakery/screenshots/04-menu.png", label: "今日菜单" },
    { src: "./demo/fufu-bakery/screenshots/03-member.png", label: "会员卡" }
  ],
  organique: [
    { src: "./demo/organique-food/screenshots/01-choose.png", label: "选择餐食" },
    { src: "./demo/organique-food/screenshots/02-plan.png", label: "配送计划" },
    { src: "./demo/organique-food/screenshots/03-confirmation.png", label: "确认页" }
  ],
  "plate-play": [
    { src: "./demo/plate-play/screenshots/library-preview-2x.png", label: "欢迎页" },
    { src: "./demo/plate-play/screenshots/recipes.png", label: "食谱列表" },
    { src: "./demo/plate-play/screenshots/detail.png", label: "食谱详情" }
  ],
  "carry-bag": [
    { src: "./demo/carry-bag/screenshots/03-hero.png", label: "品牌首页" },
    { src: "./demo/carry-bag/screenshots/01-catalog.png", label: "商品目录" },
    { src: "./demo/carry-bag/screenshots/02-detail.png", label: "商品详情" }
  ],
  fithub: [
    { src: "./demo/fithub/screenshots/01-discover.png", label: "训练发现" },
    { src: "./demo/fithub/screenshots/02-activity.png", label: "活动统计" },
    { src: "./demo/fithub/screenshots/03-focus.png", label: "目标部位" }
  ],
  "still-form": [
    { src: "./demo/still-form/screenshots/01-intro.png", label: "品牌入口" },
    { src: "./demo/still-form/screenshots/02-catalog.png", label: "系列目录" },
    { src: "./demo/still-form/screenshots/03-detail.png", label: "单品详情" }
  ],
  news: [
    { src: "./assets/cases/news-app/headlines-screen.png", label: "头条页" },
    { src: "./assets/cases/news-app/feed-screen.png", label: "新闻流" },
    { src: "./assets/cases/news-app/discover-screen.png", label: "发现页" }
  ],
  "signal-grid": [
    { src: "./demo/signal-grid/screenshots/01-scan.png", label: "扫描页" },
    { src: "./demo/signal-grid/screenshots/02-plans.png", label: "方案页" },
    { src: "./demo/signal-grid/screenshots/03-confirmation.png", label: "确认页" }
  ],
  "volt-route": [
    { src: "./demo/volt-route/screenshots/01-dashboard.png", label: "车辆状态" },
    { src: "./demo/volt-route/screenshots/02-route.png", label: "充电路线" },
    { src: "./demo/volt-route/screenshots/03-charging.png", label: "充电进度" }
  ],
  moe: [
    { src: "./demo/moe-habits/screenshots/video-2x/01-intro.png", label: "欢迎页" },
    { src: "./demo/moe-habits/screenshots/video-2x/02-home.png", label: "习惯首页" },
    { src: "./demo/moe-habits/screenshots/video-2x/03-task.png", label: "任务页" },
    { src: "./demo/moe-habits/screenshots/video-2x/04-celebration.png", label: "完成反馈" }
  ],
  loy: [
    { src: "./demo/loy-wellness/screenshots/03-welcome.png", label: "欢迎页" },
    { src: "./demo/loy-wellness/screenshots/01-home.png", label: "健康首页" },
    { src: "./demo/loy-wellness/screenshots/02-playlist.png", label: "播放列表" }
  ],
  moodly: [
    { src: "./demo/moodly-health/screenshots/01-checkin.png", label: "情绪签到" },
    { src: "./demo/moodly-health/screenshots/02-confirm.png", label: "签到完成" }
  ],
  reflect: [
    { src: "./demo/reflect-journal/screenshots/01-home.png", label: "日记首页" },
    { src: "./demo/reflect-journal/screenshots/02-detail.png", label: "日记详情" }
  ],
  mimo: [
    { src: "./demo/mimo-activities/screenshots/01-carousel.png", label: "日程轮播" },
    { src: "./demo/mimo-activities/screenshots/02-walk-focus.png", label: "步行任务" }
  ]
});

const cardPreviewImages = Object.freeze({
  notebook: "./demo/marble-note/screenshots/library-preview-reference-v2.png"
});

const githubApiUrl = "https://api.github.com/repos/zhu-guli326/image2_UI_skill";
const githubStarsFallbackUrl = "https://img.shields.io/github/stars/zhu-guli326/image2_UI_skill.json";
const gallery = document.querySelector("#demoGallery");
const searchInput = document.querySelector("#styleSearch");
const categoryNav = document.querySelector("#categoryNav");
const catalogHeading = document.querySelector("#catalogHeading");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const githubStars = document.querySelector("#githubStars");
const previewDialog = document.querySelector("#previewDialog");
const previewDialogTitle = document.querySelector("#previewDialogTitle");
const previewDialogDetails = document.querySelector("#previewDialogDetails");
const previewDialogImage = document.querySelector("#previewDialogImage");
const previewImageNavigation = document.querySelector("#previewImageNavigation");
const previewImagePrevious = document.querySelector("#previewImagePrevious");
const previewImageNext = document.querySelector("#previewImageNext");
const previewImageLabel = document.querySelector("#previewImageLabel");
const previewImageCount = document.querySelector("#previewImageCount");
const previewDialogVideo = document.querySelector("#previewDialogVideo");
const previewDialogDemo = document.querySelector("#previewDialogDemo");
const previewCursor = document.querySelector("#previewCursor");
const previewMediaFrame = document.querySelector("#previewMediaFrame");
const previewModeSwitch = document.querySelector("#previewModeSwitch");
const previewDialogCopy = document.querySelector("#previewDialogCopy");
const previewDialogComponents = document.querySelector("#previewDialogComponents");
const previewDialogOpenLive = document.querySelector("#previewDialogOpenLive");
const previewMediaStatus = document.querySelector("#previewMediaStatus");
const previewMediaStatusText = document.querySelector("#previewMediaStatusText");
const previewMediaRetry = document.querySelector("#previewMediaRetry");
const infoDialog = document.querySelector("#infoDialog");
const infoDialogContent = document.querySelector("#infoDialogContent");
let activeCategory = "all";
let activeTag = "";
let activePreviewGuide = null;
let previewLoadTimer = 0;
let activePreviewMode = null;
let activePreviewImages = [];
let activePreviewImageIndex = 0;
let activeInfoPanelId = "";
const track = (name, properties) => window.image2Analytics?.track(name, properties);
// Keep the opening catalog row aligned with the visual reference while leaving
// category and search results in their data-defined order.
const featuredCaseOrder = Object.freeze(["museum", "news", "notebook"]);

const libraryCopy = Object.freeze({
  zh: {
    modes: { image: "效果图", video: "Demo 视频", live: "可点击 Demo" },
    categories: { all: "全部案例", culture: "文化内容", commerce: "零售电商", editorial: "新闻阅读", travel: "旅行体验", creative: "创意工具", wellness: "健康陪伴" },
    title: "image2 UI 风格案例库", description: "image2 UI 风格案例库。", skip: "跳到案例列表", sidebarLabel: "案例类型", localDemo: "本地演示", realCases: (count) => `${count} 个真实 UI 案例`, allSkills: "全部浏览", guides: [["使用指南", "从选择到交付"], ["项目原理", "Image2 UI"]], author: "作者动态", profile: "查看主页",
    heroTitle: "界面风格案例库", heroIntro: "从已有的真实 App 演示中提炼画面、排版与交互方向。选择一个案例，复制它的风格配置，再开始做下一张界面。", heroAuthor: "作者主页", cases: "案例", styles: "风格", search: "搜索案例名称、使用场景或风格...", featured: "精选案例", searchResults: "搜索结果", startVisual: "从画面开始", searchTitle: "匹配的界面方向", count: (count) => `${count} 个案例`, empty: "没有找到匹配的案例。",
    imagePreview: "效果图预览", video: "视频", clickable: "可点击", details: "查看要点", copyConfig: "复制配置", localReference: "本地参考图", styleKeywords: "风格关键词", brands: "适用风格档案", openDetails: "查看案例详情", openPreview: "打开预览", unavailable: "效果图不可用",
    previous: "上一张效果图", next: "下一张效果图", loadDemo: "正在加载可点击 Demo...", timeout: "Demo 加载超时，请重试或在新窗口打开。", failed: "Demo 加载失败，请重试或使用下方链接在新窗口打开。", openLive: "新窗口打开可点击 Demo", retry: "重试", previewTitle: "案例预览", previewType: "预览方式",
    facts: ["画面色彩", "页面节奏", "参考方向", "适用场景"], recipe: ["图片", "排版", "组件"], brandProfiles: "适用风格档案", componentLibrary: "另选品牌组件", copyFull: "复制图片与提示词配置", viewImage: "查看效果图", playVideo: "播放 Demo 视频", openDemo: "打开可点击 Demo", copied: "已复制", generated: "已生成",
  },
  en: {
    modes: { image: "Screens", video: "Demo video", live: "Interactive demo" },
    categories: { all: "All cases", culture: "Culture", commerce: "Commerce", editorial: "Editorial", travel: "Travel", creative: "Creative tools", wellness: "Wellness" },
    title: "image2 UI Style Library", description: "A visual style library of image2 UI cases.", skip: "Skip to case list", sidebarLabel: "Case types", localDemo: "Local demos", realCases: (count) => `${count} real UI cases`, allSkills: "Browse all", guides: [["How to use", "From selection to delivery"], ["Principles", "Image2 UI"]], author: "Creator", profile: "View profile",
    heroTitle: "Interface style library", heroIntro: "Explore visual, typographic, and interaction directions drawn from working app demos. Choose a case, copy its style configuration, and start your next interface.", heroAuthor: "Creator profiles", cases: "Cases", styles: "Styles", search: "Search by case, use case, or visual style...", featured: "Featured cases", searchResults: "Search results", startVisual: "Start with the visual", searchTitle: "Matching interface directions", count: (count) => `${count} cases`, empty: "No matching cases found.",
    imagePreview: "Screen preview", video: "Video", clickable: "Interactive", details: "View notes", copyConfig: "Copy config", localReference: "Local reference", styleKeywords: "Style keywords", brands: "Compatible style profiles", openDetails: "View case details", openPreview: "Open preview", unavailable: "Screen unavailable",
    previous: "Previous screen", next: "Next screen", loadDemo: "Loading interactive demo...", timeout: "The demo timed out. Retry or open it in a new window.", failed: "The demo failed to load. Retry or use the link below to open it in a new window.", openLive: "Open interactive demo in a new window", retry: "Retry", previewTitle: "Case preview", previewType: "Preview type",
    facts: ["Palette", "Page rhythm", "Reference direction", "Best for"], recipe: ["Image", "Typography", "Components"], brandProfiles: "Compatible style profiles", componentLibrary: "Choose brand components", copyFull: "Copy image and prompt config", viewImage: "View screens", playVideo: "Play demo video", openDemo: "Open interactive demo", copied: "Copied", generated: "Generated",
  },
});

const currentCopy = () => libraryCopy[window.image2I18n?.language === "en" ? "en" : "zh"];
const localizeRecord = (record) => {
  if (window.image2I18n?.language !== "en" || !record?.locales?.en) return record;
  return { ...record, ...record.locales.en, recipe: { ...record.recipe, ...record.locales.en.recipe }, foundations: { ...record.foundations, ...record.locales.en.foundations }, components: { ...record.components, ...record.locales.en.components }, visualLanguage: { ...record.visualLanguage, ...record.locales.en.visualLanguage } };
};
const previewModeLabels = new Proxy({}, { get: (_, key) => currentCopy().modes[key] });

function updateCatalogCounts() {
  const copy = currentCopy();
  const counts = {};
  for (const guide of styleGuides) counts[guide.category] = (counts[guide.category] || 0) + 1;
  categoryNav.querySelector('[data-filter="all"] b').textContent = styleGuides.length;
  categoryNav.querySelectorAll("[data-filter]:not([data-filter=all])").forEach((item) => { item.querySelector("b").textContent = counts[item.dataset.filter] || 0; });
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

function getCardPoster(guide) {
  if (guide.liveDemo) return `${guide.liveDemo.replace(/index\.html$/, "screenshots/library-preview-2x.png")}?v=${libraryPreviewAssetVersion}`;
  return guide.previewImage || guide.poster;
}

function getReferenceMatchedCardPoster(guide) {
  const matchedPreview = cardPreviewImages[guide.id];
  return matchedPreview ? `${matchedPreview}?v=${libraryPreviewAssetVersion}` : getCardPoster(guide);
}

function getPreviewPoster(guide) {
  if (guide.previewImage) return guide.previewImage;
  if (guide.liveDemo) return getCardPoster(guide);
  return guide.poster;
}

function withPreviewVersion(src) {
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}v=${libraryPreviewAssetVersion}`;
}

function getPreviewImages(guide) {
  guide = localizeRecord(guide);
  const images = previewImageSets[guide.id];
  if (images?.length) return images.map((image) => ({
    ...image,
    label: window.image2I18n?.language === "en" ? currentCopy().modes.image : image.label,
    alt: image.alt || `${guide.style}: ${image.label}`,
    src: withPreviewVersion(image.src)
  }));
  return [{ src: getPreviewPoster(guide), label: currentCopy().modes.image, alt: window.image2I18n?.language === "en" ? `${guide.style} mobile screen` : `${guide.style} 手机效果图` }];
}

function showPreviewImage(index) {
  if (!activePreviewImages.length) return;
  activePreviewImageIndex = (index + activePreviewImages.length) % activePreviewImages.length;
  const image = activePreviewImages[activePreviewImageIndex];
  previewDialogImage.src = image.src;
  previewDialogImage.alt = image.alt;
  previewImageLabel.textContent = image.label;
  previewImageCount.textContent = `${activePreviewImageIndex + 1} / ${activePreviewImages.length}`;
  previewImageNavigation.hidden = activePreviewImages.length < 2 || activePreviewMode !== "image";
  previewImagePrevious.setAttribute("aria-label", `${currentCopy().previous}: ${image.label}`);
  previewImageNext.setAttribute("aria-label", `${currentCopy().next}: ${image.label}`);
}

function showPreviewImageError(image, guide) {
  image.hidden = true;
  previewMediaStatus.hidden = false;
  previewMediaStatusText.textContent = window.image2I18n?.language === "en" ? `${guide.name} screens are unavailable. Switch to the interactive demo.` : `${guide.name} 效果图不可用，请切换到可点击 Demo。`;
  previewMediaRetry.hidden = true;
  previewMediaStatus.classList.add("is-error");
}

function normalizeTag(value) {
  return String(value || "").trim().toLocaleLowerCase();
}

function readTagFromUrl() {
  return new URL(window.location.href).searchParams.get("tag") || "";
}

function setTagFilter(tag, { push = true } = {}) {
  activeTag = tag;
  activeCategory = "all";
  categoryNav.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  const url = new URL(window.location.href);
  if (tag) url.searchParams.set("tag", tag);
  else url.searchParams.delete("tag");
  if (push) window.history.pushState({ tag }, "", url);
  renderDemoGallery();
  document.querySelector("#demoGallery")?.scrollIntoView({ block: "start" });
}

function getEmbeddedDemoUrl(guide) {
  const url = new URL(guide.liveDemo, window.location.href);
  url.searchParams.set("embed", "1");
  return url.href;
}

function updateEmbeddedPreviewScale() {
  if (!activePreviewGuide || previewDialogDemo.hidden) return;
  const { width, height } = getPreviewDevice(activePreviewGuide, "live");
  const scale = Math.min(previewMediaFrame.clientWidth / width, previewMediaFrame.clientHeight / height);
  previewMediaFrame.style.setProperty("--preview-embed-scale", String(scale));
}

const previewFrameObserver = new ResizeObserver(updateEmbeddedPreviewScale);
previewFrameObserver.observe(previewMediaFrame);

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
  return (guide.styleProfileIds || []).map((id) => styleProfiles.find((profile) => profile.id === id)).filter(Boolean).map(localizeRecord);
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

function getFilteredGuides() {
  const guides = searchGuides(styleGuides, searchInput.value).filter((guide) => {
    const localized = localizeRecord(guide);
    const tags = [...(guide.tags || []), ...(localized.tags || [])];
    const matchesTag = !activeTag || tags.some((tag) => normalizeTag(tag) === normalizeTag(activeTag));
    return (activeCategory === "all" || guide.category === activeCategory) && matchesTag;
  });
  if (activeCategory !== "all" || activeTag || searchInput.value.trim()) return guides;
  const rank = new Map(featuredCaseOrder.map((id, index) => [id, index]));
  return [...guides].sort((a, b) => (rank.get(a.id) ?? featuredCaseOrder.length) - (rank.get(b.id) ?? featuredCaseOrder.length));
}

function updateCatalogHeadingVisibility() {
  catalogHeading.hidden = activeCategory !== "all" || Boolean(activeTag) || Boolean(searchInput.value.trim());
}

function renderDemoGallery() {
  updateCatalogHeadingVisibility();
  const copy = currentCopy();
  const guides = getFilteredGuides();
  const isSearch = Boolean(searchInput.value.trim());
  document.querySelector(".catalog-bar .kicker").textContent = isSearch ? copy.searchResults : copy.featured;
  document.querySelector("#catalogTitle").textContent = isSearch ? copy.searchTitle : copy.startVisual;
  gallery.innerHTML = guides.map((sourceGuide) => {
    const guide = localizeRecord(sourceGuide);
    const mediaMode = guide.video ? "video" : "image";
    const openMode = guide.defaultPreviewMode || mediaMode;
    const openLabel = previewModeLabels[openMode];
    const poster = getCardPoster(guide);
    const referenceMatchedPoster = cardPreviewImages[guide.id] ? getReferenceMatchedCardPoster(guide) : poster;
    const previewActionButtons = [
      guide.video ? `<button class="style-details-button" type="button" data-preview-id="${guide.id}" data-preview-mode="video">${copy.video}</button>` : "",
      guide.liveDemo ? `<button class="style-details-button" type="button" data-preview-id="${guide.id}" data-preview-mode="live">${copy.clickable}</button>` : ""
    ].join("");
    return `
    <article class="demo-card" data-case-id="${guide.id}">
      <div class="demo-card-preview" style="--preview: ${guide.preview}">
        <div class="phone-preview-media${cardPreviewImages[guide.id] ? " is-effect-image" : ""}"><img src="${referenceMatchedPoster}" alt="${window.image2I18n?.language === "en" ? `${guide.style} mobile interface thumbnail` : `${guide.style} 手机界面缩略图`}" decoding="async"><span class="media-hint">${copy.imagePreview}</span></div>
        <button class="preview-open-button" type="button" data-preview-id="${guide.id}" data-preview-mode="${openMode}" aria-label="${copy.openPreview}: ${guide.style}, ${openLabel}"><span>${openLabel}</span></button>
      </div>
      <div class="demo-card-body">
        <button class="demo-card-details-hitarea" type="button" data-style-details="${guide.id}" aria-label="${copy.openDetails}: ${guide.style}"></button>
        <div class="demo-card-meta"><span>${guide.name}</span><span>${guide.bestFor}</span></div>
        <h3>${guide.style}</h3>
        <p class="demo-card-summary">${guide.summary}</p>
        <div class="style-tags" aria-label="${copy.styleKeywords}">${guide.tags.map((tag, index) => { const stableTag = sourceGuide.tags[index] || tag; return `<a class="style-tag${normalizeTag(stableTag) === normalizeTag(activeTag) ? " is-active" : ""}" href="./library.html?tag=${encodeURIComponent(stableTag)}" data-tag="${stableTag}" aria-pressed="${normalizeTag(stableTag) === normalizeTag(activeTag)}">${tag}</a>`; }).join("")}</div>
        <div class="brand-links" aria-label="${copy.brands}">${getStyleProfiles(sourceGuide).map((profile) => `<span>${profile.name}</span>`).join("")}</div>
        <div class="demo-card-footer"><small title="${copy.localReference}: ${guide.referenceImage}">${copy.localReference}: ${guide.reference}</small><div class="demo-card-actions">${previewActionButtons}<button class="style-details-button" type="button" data-style-details="${guide.id}">${copy.details}</button><button class="copy-style-button" type="button" data-copy-style="${guide.id}" title="${copy.copyFull}">${copy.copyConfig}</button></div></div>
      </div>
    </article>
  `;
  }).join("");
  resultCount.textContent = copy.count(guides.length);
  emptyState.hidden = guides.length !== 0;
  gallery.querySelectorAll(".phone-preview-media img").forEach((image) => image.addEventListener("error", () => {
    const media = image.closest(".phone-preview-media");
    media?.classList.add("is-unavailable");
    image.remove();
  }, { once: true }));
  gallery.querySelectorAll("[data-copy-style]").forEach((button) => button.addEventListener("click", () => copyStyleMode(button)));
  gallery.querySelectorAll("[data-style-details]").forEach((button) => button.addEventListener("click", () => openPreview(button.dataset.styleDetails)));
  gallery.querySelectorAll("[data-preview-id]").forEach((button) => button.addEventListener("click", () => openPreview(button.dataset.previewId, button.dataset.previewMode)));
  gallery.querySelectorAll("[data-tag]").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setTagFilter(link.dataset.tag);
    track("tag_filter", { tag: link.dataset.tag, resultCount: getFilteredGuides().length });
  }));
}

function setPreviewMode(mode, shouldTrack = true) {
  const guide = localizeRecord(activePreviewGuide);
  if (!guide) return;
  const modes = getPreviewModes(guide);
  const nextMode = modes.includes(mode) ? mode : (guide.video ? "video" : "image");
  const isImage = nextMode === "image";
  const isVideo = nextMode === "video";
  const isLiveDemo = nextMode === "live";
  const { width: phoneWidth, height: phoneHeight } = getPreviewDevice(guide, nextMode);
  const { width: displayWidth, height: displayHeight } = getLibraryPreviewDisplayDevice();
  activePreviewMode = nextMode;

  previewMediaFrame.style.setProperty("--preview-phone-ratio", `${displayWidth} / ${displayHeight}`);
  previewMediaFrame.style.setProperty("--preview-phone-ratio-value", displayWidth / displayHeight);
  previewMediaFrame.style.setProperty("--preview-source-width", `${phoneWidth}px`);
  previewMediaFrame.style.setProperty("--preview-source-height", `${phoneHeight}px`);
  [previewDialogVideo, previewDialogDemo].forEach((element) => {
    element.width = phoneWidth;
    element.height = phoneHeight;
  });

  previewDialogImage.hidden = !isImage;
  previewDialogVideo.hidden = !isVideo;
  previewDialogDemo.hidden = !isLiveDemo;
  previewMediaStatus.hidden = !isLiveDemo;
  previewMediaRetry.hidden = true;
  previewCursor.hidden = !isVideo;
  previewImageNavigation.hidden = !isImage || activePreviewImages.length < 2;
  previewCursor.classList.toggle("is-running", isVideo && !previewDialogVideo.paused);
  previewModeSwitch.querySelectorAll("button").forEach((button) => {
    const active = button.dataset.previewView === nextMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (isImage) {
    previewDialogVideo.pause();
    previewDialogDemo.src = "about:blank";
    previewDialogImage.hidden = false;
    previewMediaStatus.hidden = true;
    previewMediaStatus.classList.remove("is-error");
    showPreviewImage(activePreviewImageIndex);
  } else if (isVideo) {
    previewDialogDemo.src = "about:blank";
    previewDialogVideo.poster = getCardPoster(guide);
    previewDialogVideo.src = guide.video;
    previewDialogVideo.load();
    previewDialogVideo.play().catch(() => {});
  } else {
    previewDialogVideo.pause();
    window.clearTimeout(previewLoadTimer);
    previewMediaStatusText.textContent = currentCopy().loadDemo;
    previewMediaStatus.classList.remove("is-error");
    previewDialogDemo.title = `${guide.style} 可点击 Demo`;
    previewDialogDemo.src = getEmbeddedDemoUrl(guide);
    previewLoadTimer = window.setTimeout(() => {
      if (!activePreviewGuide || previewDialogDemo.hidden) return;
      previewMediaStatus.hidden = false;
      previewMediaStatusText.textContent = currentCopy().timeout;
      previewMediaRetry.hidden = false;
      previewMediaStatus.classList.add("is-error");
    }, 8000);
    window.requestAnimationFrame(updateEmbeddedPreviewScale);
  }

  if (shouldTrack) track("preview_mode_change", { caseId: guide.id, mode: nextMode });
}

function openPreview(id, mode = "auto") {
  const sourceGuide = styleGuides.find((item) => item.id === id);
  if (!sourceGuide) return;
  const guide = localizeRecord(sourceGuide);
  const copy = currentCopy();
  activePreviewGuide = sourceGuide;
  activePreviewImages = getPreviewImages(guide);
  activePreviewImageIndex = 0;
  const modes = getPreviewModes(guide);
  const initialMode = mode === "auto" ? (guide.defaultPreviewMode || (guide.video ? "video" : (guide.liveDemo ? "live" : "image"))) : (modes.includes(mode) ? mode : modes[0]);

  previewDialogTitle.textContent = `${guide.name} / ${guide.style}`;
  const applicableStyles = getStyleProfiles(sourceGuide);
  previewDialogDetails.innerHTML = `
    <p class="preview-dialog-summary">${guide.summary}</p>
    <dl class="preview-dialog-facts">
      <div><dt>${copy.facts[0]}</dt><dd>${guide.palette}</dd></div>
      <div><dt>${copy.facts[1]}</dt><dd>${guide.layout}</dd></div>
      <div><dt>${copy.facts[2]}</dt><dd>${guide.reference}</dd></div>
      <div><dt>${copy.facts[3]}</dt><dd>${guide.bestFor}</dd></div>
    </dl>
    <p class="preview-dialog-principle">${guide.recipe.principle}</p>
    <div class="preview-dialog-recipe">
      <p><strong>${copy.recipe[0]}:</strong> ${guide.recipe.image}</p>
      <p><strong>${copy.recipe[1]}:</strong> ${guide.recipe.type}</p>
      <p><strong>${copy.recipe[2]}:</strong> ${guide.recipe.components}</p>
    </div>
    <div class="preview-dialog-profiles"><strong>${copy.brandProfiles}</strong><div>${applicableStyles.map((profile) => `<span>${profile.name}</span>`).join("")}</div></div>`;
  previewDialogCopy.dataset.copyStyle = guide.id;
  previewDialogCopy.textContent = copy.copyFull;
  previewDialogComponents.textContent = copy.componentLibrary;
  previewMediaFrame.style.setProperty("--preview-media-bg", guide.preview);
  previewDialogOpenLive.hidden = !guide.liveDemo;
  if (guide.liveDemo) previewDialogOpenLive.href = guide.liveDemo;
  previewDialogOpenLive.textContent = currentCopy().openLive;
  previewModeSwitch.innerHTML = modes.map((item) => `<button type="button" data-preview-view="${item}" aria-pressed="false">${previewModeLabels[item]}</button>`).join("");
  previewModeSwitch.hidden = modes.length < 2;
  previewModeSwitch.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setPreviewMode(button.dataset.previewView)));

  if (!previewDialog.open) previewDialog.showModal();
  setPreviewMode(initialMode, false);
  track(initialMode === "live" ? "live_demo_open" : "demo_preview_open", { caseId: guide.id, caseName: guide.name, mode: initialMode });
}

const infoPanels = {
  guide: {
    eyebrow: "IMAGE2 UI / GUIDE",
    title: "使用指南",
    intro: "从真实参考开始，把风格选择、图片资产与可点击界面连成一条可复用的工作流。",
    steps: [
      ["选择案例", "在案例库中查看统一 390×844 外框的效果图或 Demo 视频，打开风格详情，确认最接近的视觉方向。"],
      ["复制配置", "复制按钮会带出本地参考图路径、图像提示词、排版和组件原则。"],
      ["拆分实现", "把文字、按钮、导航、状态与常规图标放进代码；把照片、插画、纹理和产品图作为图片资产。"],
      ["连接本地资产", "把生成或选择的图片保存到项目目录，再接回页面中对应的视觉槽位。"],
      ["验证交付", "打开本地预览，检查点击路径、图片加载、移动端布局和 reduced-motion。"]
    ],
    callout: "开始时不需要写“做得更高级”。先选一个案例，再复制配置，沟通会准确得多。"
  },
  principles: {
    eyebrow: "IMAGE2 UI / PRINCIPLES",
    title: "项目原理",
    intro: "Image2 UI 的目标不是把截图压成一张图片，而是把可编辑、可交互的界面和真实视觉资产重新组合起来。",
    steps: [
      ["代码负责界面", "真实文本、按钮、输入、导航、状态栏、筛选控件和常规图标全部由代码渲染。"],
      ["图片负责视觉", "照片、产品、人物、插画、纹理、背景和缩略图使用真实本地图片资产。"],
      ["提示词可追溯", "每套风格保留本地参考图路径和提示词，避免下次又从模糊形容词开始。"],
      ["结构先于装饰", "先命名 top app bar、card grid、filter chips、detail dialog 等区域，再确定视觉表现。"],
      ["输出必须可用", "最终交付不是静态截图，而是可以打开、点击、修改并继续迭代的页面。"]
    ],
    callout: "图片不承担可读文字、导航或功能图标。这样界面才能保持清楚、可访问并且便于修改。"
  }
};

const infoPanelsEnglish = {
  guide: {
    eyebrow: "IMAGE2 UI / GUIDE",
    title: "How to use it",
    intro: "Start from a real reference and connect style selection, image assets, and a clickable interface in one reusable workflow.",
    steps: [
      ["Choose a case", "Compare screens and demo videos in the library, then open the closest visual direction."],
      ["Copy the configuration", "The copy action includes the local reference path, image prompt, typography, and component principles."],
      ["Split the implementation", "Keep copy, buttons, navigation, state, and ordinary icons in code. Use image assets for photos, illustration, texture, and products."],
      ["Connect local assets", "Save generated or selected images in the project and connect them to the matching visual slots."],
      ["Verify delivery", "Open the local preview and check click paths, image loading, mobile layout, and reduced motion."]
    ],
    callout: "Do not start with 'make it more premium.' Choose a case and copy its configuration so the direction is concrete."
  },
  principles: {
    eyebrow: "IMAGE2 UI / PRINCIPLES",
    title: "Principles",
    intro: "Image2 UI does not flatten a screenshot into one image. It recombines editable, interactive UI with real visual assets.",
    steps: [
      ["Code owns interface", "Render real copy, buttons, inputs, navigation, status bars, filters, and ordinary icons in code."],
      ["Images own visual material", "Use real local assets for photography, products, people, illustration, texture, backgrounds, and thumbnails."],
      ["Prompts stay traceable", "Each style keeps its local reference path and prompt so the next project does not restart from vague adjectives."],
      ["Structure before decoration", "Name regions such as top app bar, card grid, filter chips, and detail dialog before styling them."],
      ["Output must work", "The deliverable is a page that opens, responds, can be edited, and supports another iteration, not a static screenshot."]
    ],
    callout: "Images must not carry readable copy, navigation, or functional icons. Keeping those in code preserves clarity, accessibility, and editability."
  }
};

function openInfoPanel(id) {
  activeInfoPanelId = id;
  const panel = (window.image2I18n?.language === "en" ? infoPanelsEnglish : infoPanels)[id];
  if (!panel) return;
  infoDialogContent.innerHTML = `<p class="kicker">${panel.eyebrow}</p><h2 id="infoDialogTitle">${panel.title}</h2><p>${panel.intro}</p><ol class="info-steps">${panel.steps.map((step, index) => `<li><b>0${index + 1}</b><div><strong>${step[0]}</strong><span>${step[1]}</span></div></li>`).join("")}</ol><p class="info-callout">${panel.callout}</p>`;
  if (!infoDialog.open) infoDialog.showModal();
  track("info_panel_open", { panel: id });
}

window.image2StyleCatalog = { styleProfiles, buildStylePrompt, buildStyleTokens };

async function copyTextWithFeedback(text, button, feedback) {
  const label = button.textContent;
  try { await navigator.clipboard.writeText(text); } catch { fallbackCopy(text); }
  button.textContent = feedback;
  window.setTimeout(() => { button.textContent = label; }, 1500);
}

async function copyStyleMode(button) {
  const guide = styleGuides.find((item) => item.id === button.dataset.copyStyle);
  if (!guide) return;
  const label = button.textContent;
  try { await navigator.clipboard.writeText(buildStyleMode(guide)); button.textContent = currentCopy().copied; track("style_copy", { caseId: guide.id, caseName: guide.name }); }
  catch { fallbackCopy(buildStyleMode(guide)); button.textContent = currentCopy().copied; track("style_copy", { caseId: guide.id, caseName: guide.name, method: "fallback" }); }
  window.setTimeout(() => { button.textContent = label; }, 1500);
}

function fallbackCopy(text) {
  const area = document.createElement("textarea"); area.value = text; area.style.position = "fixed"; area.style.opacity = "0"; document.body.append(area); area.select();
  if (!document.execCommand("copy")) throw new Error("Clipboard copy was blocked");
  area.remove();
}

categoryNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeCategory = button.dataset.filter;
  activeTag = "";
  const url = new URL(window.location.href);
  url.searchParams.delete("tag");
  window.history.pushState({ tag: "" }, "", url);
  categoryNav.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
  track("category_filter", { category: activeCategory });
  renderDemoGallery();
});
let searchTimer;
searchInput.addEventListener("input", () => {
  // A typed query searches the whole catalog; category/tag filters are useful
  // for browsing, but silently narrowing a search makes valid cases look lost.
  if (searchInput.value.trim() && (activeCategory !== "all" || activeTag)) {
    activeCategory = "all";
    activeTag = "";
    const url = new URL(window.location.href);
    url.searchParams.delete("tag");
    window.history.replaceState({ tag: "" }, "", url);
    categoryNav.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  }
  renderDemoGallery();
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    const query = searchInput.value.trim();
    if (query) track("library_search", { query, resultCount: getFilteredGuides().length });
  }, 600);
});
document.addEventListener("keydown", (event) => {
  if (previewDialog.open && activePreviewMode === "image" && activePreviewImages.length > 1) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreviewImage(activePreviewImageIndex - 1);
      track("preview_image_change", { caseId: activePreviewGuide.id, direction: "previous", index: activePreviewImageIndex });
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showPreviewImage(activePreviewImageIndex + 1);
      track("preview_image_change", { caseId: activePreviewGuide.id, direction: "next", index: activePreviewImageIndex });
    }
    return;
  }
  if (event.key === "Escape" && !document.querySelector("dialog[open]")) {
    searchInput.value = "";
    searchInput.blur();
    renderDemoGallery();
  }
});
document.querySelectorAll("a[href*='github.com']").forEach((link) => link.addEventListener("click", () => track("github_click", { location: link.className || "stats" })));
document.querySelectorAll("[data-info-panel]").forEach((button) => button.addEventListener("click", () => openInfoPanel(button.dataset.infoPanel)));
previewDialog.addEventListener("close", () => {
  window.clearTimeout(previewLoadTimer);
  previewDialogVideo.pause();
  previewDialogVideo.currentTime = 0;
  previewDialogVideo.removeAttribute("src");
  previewDialogImage.removeAttribute("src");
  previewDialogDemo.src = "about:blank";
  previewMediaStatus.hidden = true;
  previewMediaStatusText.textContent = "";
  previewMediaRetry.hidden = true;
  previewMediaStatus.classList.remove("is-error");
  previewCursor.hidden = true;
  previewCursor.classList.remove("is-running");
  previewImageNavigation.hidden = true;
  activePreviewMode = null;
  activePreviewImages = [];
  activePreviewImageIndex = 0;
  activePreviewGuide = null;
});
previewImagePrevious.addEventListener("click", () => {
  showPreviewImage(activePreviewImageIndex - 1);
  track("preview_image_change", { caseId: activePreviewGuide.id, direction: "previous", index: activePreviewImageIndex });
});
previewImageNext.addEventListener("click", () => {
  showPreviewImage(activePreviewImageIndex + 1);
  track("preview_image_change", { caseId: activePreviewGuide.id, direction: "next", index: activePreviewImageIndex });
});
previewDialogVideo.addEventListener("loadedmetadata", () => {
  previewMediaFrame.style.setProperty("--cursor-duration", `${Math.max(6, previewDialogVideo.duration)}s`);
});
previewDialogVideo.addEventListener("play", () => previewCursor.classList.add("is-running"));
previewDialogVideo.addEventListener("pause", () => previewCursor.classList.remove("is-running"));
previewDialogImage.addEventListener("error", () => {
  if (activePreviewGuide) showPreviewImageError(previewDialogImage, activePreviewGuide);
});
previewDialogDemo.addEventListener("load", () => {
  window.clearTimeout(previewLoadTimer);
  if (activePreviewGuide && !previewDialogDemo.hidden) previewMediaStatus.hidden = true;
});
previewDialogDemo.addEventListener("error", () => {
  window.clearTimeout(previewLoadTimer);
  previewMediaStatus.hidden = false;
  previewMediaStatusText.textContent = currentCopy().failed;
  previewMediaRetry.hidden = false;
  previewMediaStatus.classList.add("is-error");
});
previewMediaRetry.addEventListener("click", () => {
  if (activePreviewGuide) setPreviewMode("live", false);
});
previewDialogCopy.addEventListener("click", () => {
  if (activePreviewGuide) copyStyleMode(previewDialogCopy);
});

[previewDialog, infoDialog].forEach((dialog) => dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
}));

window.addEventListener("popstate", () => {
  activeTag = readTagFromUrl();
  activeCategory = "all";
  categoryNav.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  renderDemoGallery();
});

function updateGitHubStars(count) {
  if (!Number.isFinite(count)) return false;
  const stars = new Intl.NumberFormat(window.image2I18n?.language === "en" ? "en" : "zh-CN").format(count);
  githubStars.textContent = stars;
  document.querySelectorAll(".site-nav-stars").forEach((element) => { element.textContent = stars; });
  return true;
}

function applyLibraryLanguage() {
  const copy = currentCopy();
  document.title = copy.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", copy.description);
  document.documentElement.style.setProperty("--unavailable-label", `"${copy.unavailable}"`);
  document.querySelector(".skip-link").textContent = copy.skip;
  document.querySelector(".sidebar").setAttribute("aria-label", copy.sidebarLabel);
  document.querySelector(".sidebar-label").textContent = copy.sidebarLabel;
  categoryNav.querySelectorAll("[data-filter]").forEach((button) => { button.querySelector("span").textContent = copy.categories[button.dataset.filter]; });
  document.querySelector(".sidebar-skills-heading a").textContent = copy.allSkills;
  document.querySelectorAll(".sidebar-resources button").forEach((button, index) => {
    button.querySelector("span").textContent = copy.guides[index][0];
    button.querySelector("small").textContent = copy.guides[index][1];
  });
  document.querySelector(".sidebar-social p").textContent = copy.author;
  const socialProfile = document.querySelector(".sidebar-social a:last-child small");
  if (socialProfile) socialProfile.textContent = copy.profile;
  document.querySelector(".sidebar-note span").textContent = copy.localDemo;
  document.querySelector("#pageTitle").textContent = copy.heroTitle;
  document.querySelector(".catalog-heading .intro").textContent = copy.heroIntro;
  const heroAuthor = document.querySelector(".hero-social > span");
  if (heroAuthor) heroAuthor.textContent = copy.heroAuthor;
  document.querySelector(".stats-panel span:first-child small").textContent = copy.cases;
  document.querySelector(".stats-panel span:nth-child(2) small").textContent = copy.styles;
  searchInput.placeholder = copy.search;
  document.querySelector(".search-section").setAttribute("aria-label", copy.search);
  document.querySelector(".catalog-bar .kicker").textContent = copy.featured;
  document.querySelector("#catalogTitle").textContent = copy.startVisual;
  emptyState.textContent = copy.empty;
  previewDialogTitle.textContent = copy.previewTitle;
  previewModeSwitch.setAttribute("aria-label", copy.previewType);
  previewImagePrevious.setAttribute("aria-label", copy.previous);
  previewImagePrevious.title = copy.previous;
  previewImageNext.setAttribute("aria-label", copy.next);
  previewImageNext.title = copy.next;
  previewMediaRetry.textContent = copy.retry;
  previewDialogOpenLive.textContent = copy.openLive;
  document.querySelectorAll(".dialog-close").forEach((button) => button.setAttribute("aria-label", window.image2I18n?.language === "en" ? "Close dialog" : "关闭弹窗"));
  updateCatalogCounts();
  renderDemoGallery();
  if (infoDialog.open && activeInfoPanelId) openInfoPanel(activeInfoPanelId);
  if (previewDialog.open && activePreviewGuide) openPreview(activePreviewGuide.id, activePreviewMode || "auto");
}

window.image2I18n?.registerPage(applyLibraryLanguage);

async function loadGitHubStars() {
  try {
    const response = await fetch(githubApiUrl, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    if (!updateGitHubStars(Number((await response.json()).stargazers_count))) throw new Error("Missing star count");
  } catch {
    try {
      const response = await fetch(githubStarsFallbackUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`Star fallback returned ${response.status}`);
      if (!updateGitHubStars(Number((await response.json()).value))) throw new Error("Missing fallback star count");
    } catch {
      githubStars.textContent = "--";
      document.querySelectorAll(".site-nav-stars").forEach((element) => { element.textContent = "--"; });
    }
  }
}

updateCatalogCounts();
activeTag = readTagFromUrl();
renderDemoGallery();
loadGitHubStars();
track("library_view", { referrer: document.referrer || "direct" });
