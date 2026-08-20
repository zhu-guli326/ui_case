/**
 * brands.js — 设计系统探索器入口
 * 职责仅限协调：初始化、事件绑定、UI 渲染编排
 * 状态管理 → brands-state.js
 * 预览渲染 → brands-preview.js
 * 扩展 CSS/UI 层 → brands.css
 */
import { brandReferences, changeIntensities, devices, findBrandReference, findChangeIntensity, findDevice, findSystem, findTemplate, findTheme, systems, templates, themes } from "./lab/lab-data.js";
import { bootstrapState, readState, persist, writeUrl, normalizeTheme } from "./src/features/brands/brands-state.js";
import { renderPreview, renderDifferences, fitFrames, previewUrl } from "./src/features/brands/brands-preview.js";

const $ = (selector) => document.querySelector(selector);
let state = {};
let frameObserver = null;
let previewLoadObserver = null;
let toastTimer = null;

// ---- 初始化 ----
bootstrapState();
state = readState();
initialize();

function initialize() {
  const isEn = window.image2I18n?.language === "en";
  fillSelect("#templateSelect", templates.map((t) => localizeItem(t, "template")));
  fillSelect("#systemSelect", systems);
  fillSelect("#brandSelect", brandReferences.map((b) => localizeItem(b, "brand")));
  fillSelect("#themeSelect", themes);
  $("#intensityOptions").innerHTML = changeIntensities
    .map((item) => {
      const localized = localizeItem(item, "intensity");
      return `<button type="button" data-intensity="${localized.id}" title="${escapeHtml(localized.description)}">${localized.name}</button>`;
    })
    .join("");
  $("#deviceOptions").innerHTML = devices
    .map((item) => {
      const localized = localizeItem(item, "device");
      return `<button type="button" data-device="${localized.id}">${localized.name}</button>`;
    })
    .join("");
  $("#appearanceOptions").innerHTML = `<button type="button" data-appearance="light">Light</button><button type="button" data-appearance="dark">Dark</button>`;
  $("#compareSystems").innerHTML = systems
    .slice(0, 7)
    .map((item) => `<button type="button" data-compare-system="${item.id}">${item.shortName}</button>`)
    .join("");
  bindEvents();
  syncControls();
  render();
  persist(state);
  writeUrl(state);
}

// ---- 事件绑定 ----
function bindEvents() {
  ["template", "system", "brand", "theme"].forEach((key) => {
    $(`#${key}Select`).addEventListener("change", (event) => {
      state[key] = key === "theme" ? normalizeTheme(event.target.value) : event.target.value;
      update(true);
    });
  });
  $("#projectName").addEventListener("change", (event) => {
    state.name = event.target.value.trim() || "Atlas Dashboard";
    update(true);
  });
  document.addEventListener("click", (event) => {
    const intensity = event.target.closest("[data-intensity]");
    if (intensity) {
      state.intensity = intensity.dataset.intensity;
      update(true);
      return;
    }
    const device = event.target.closest("[data-device]");
    if (device) {
      state.device = device.dataset.device;
      update(true);
      return;
    }
    const appearance = event.target.closest("[data-appearance]");
    if (appearance) {
      state.appearance = appearance.dataset.appearance;
      update(true);
      return;
    }
    const view = event.target.closest("[data-view]");
    if (view) {
      state.view = view.dataset.view;
      update(false);
      return;
    }
    const compare = event.target.closest("[data-compare-system]");
    if (compare) {
      toggleCompare(compare.dataset.compareSystem);
      return;
    }
    const quick = event.target.closest("[data-theme-quick]");
    if (quick) {
      state.theme = normalizeTheme(quick.dataset.themeQuick);
      update(true);
      showToast(`已应用 ${findTheme(state.theme).name}`);
      return;
    }
    const explain = event.target.closest("[data-explain]");
    if (explain) openExplanation(explain.dataset.explain);
  });
  $("#saveProject").addEventListener("click", () => {
    persist(state);
    showToast("当前设计项目已保存");
  });
  $("#generateDemo").addEventListener("click", () => {
    persist(state);
    const url = previewUrl(state, state.system);
    window.open(url, "_blank", "noopener");
    showToast("已打开可点击 Demo");
  });
  const applyToTask = $("#applyToTask");
  if (applyToTask && applyToTask.dataset.bound !== "1") {
    applyToTask.dataset.bound = "1";
    applyToTask.addEventListener("click", () => {
      state.lastStep = "brands";
      persist(state);
    });
  }
  addEventListener("resize", fitFrames);
}

function toggleCompare(id) {
  if (state.compare.includes(id)) {
    if (state.compare.length <= 2) {
      showToast("对比模式至少保留 2 个系统");
      return;
    }
    state.compare = state.compare.filter((item) => item !== id);
  } else {
    if (state.compare.length >= 3) {
      showToast("一次最多比较 3 个系统");
      return;
    }
    state.compare = [...state.compare, id];
  }
  update(false);
}

// ---- 渲染编排 ----
function render() {
  const template = findTemplate(state.template);
  const system = findSystem(state.system);
  const brand = findBrandReference(state.brand);
  const theme = findTheme(state.theme);
  const intensity = findChangeIntensity(state.intensity);
  const device = findDevice(state.device);

  $("#systemHelp").textContent = system.id === "apple"
    ? brandsT("Apple HIG 的 Web 模拟预览，并非官方 Web 组件库", "Web simulation of Apple HIG, not an official web component library")
    : brandsT("决定组件、状态与交互规范", "Defines components, states, and interaction specs");
  $("#selectionSentence").textContent = `${template.name} · ${system.name} · ${brandsT(brand.name + " 品牌参考", brand.name + " brand")} · ${theme.name} · ${device.name} · ${intensity.name}`;
  $("#comparePicker").hidden = state.view !== "compare";
  $("#differencePanel").hidden = state.view !== "differences";
  $("#previewStage").hidden = state.view === "differences";

  renderProjectOrigin();
  renderTaskActions();
  renderOverview(template, system, brand, theme, intensity, device);
  const result = renderPreview($("#previewStage"), state, { fitFrames, observer: frameObserver, previewLoaderObserver: previewLoadObserver });
  frameObserver = result.observer;
  previewLoadObserver = result.previewLoaderObserver;
  renderDifferences($("#differencePanel"), state);
  renderSummary();
}

function renderProjectOrigin() {
  const origin = $("#projectOrigin");
  const hasTaskCase = state.taskReferenceMode === "case" && Boolean(state.taskReferenceCaseId);
  const libraryUrl = new URL("./library.html", location.href);
  if (hasTaskCase) libraryUrl.searchParams.set("case", state.taskReferenceCaseId);
  const taskUrl = new URL("./launcher.html", location.href);
  taskUrl.searchParams.set("intent", state.taskIntent || "create");
  if (hasTaskCase) {
    taskUrl.searchParams.set("source", "library");
    taskUrl.searchParams.set("case", state.taskReferenceCaseId);
  }
  const source = hasTaskCase
    ? `${state.taskReferenceCaseName || state.taskReferenceCaseId}${state.taskReferenceCaseStyle ? ` / ${state.taskReferenceCaseStyle}` : ""}`
    : state.taskReferenceMode === "upload"
      ? brandsT("本次任务使用本地图片", "This task uses a local image")
      : state.taskReferenceMode === "none"
        ? brandsT("本次任务不使用参考", "This task does not use a reference")
        : brandsT("尚未选择任务参考", "No task reference selected");
  const localize = (value) => window.image2I18n?.localizeUrl?.(value) || value;
  origin.innerHTML = `<span>${brandsT("任务参考", "Task reference")}</span><strong>${escapeHtml(source)}</strong><div><a href="${localize(libraryUrl.href)}">${hasTaskCase ? brandsT("查看任务案例", "View case") : brandsT("选择案例", "Select case")}</a><a href="${localize(taskUrl.href)}">${state.taskIntent ? brandsT("调整任务", "Adjust task") : brandsT("定义任务", "Define task")}</a></div>`;
}

function taskUrl() {
  const url = new URL("./launcher.html", location.href);
  url.searchParams.set("intent", state.taskIntent || "create");
  ["template", "system", "brand", "theme", "intensity", "device", "appearance"].forEach((key) => {
    if (state[key]) url.searchParams.set(key, state[key]);
  });
  if (state.taskReferenceMode === "case" && state.taskReferenceCaseId) {
    url.searchParams.set("source", "library");
    url.searchParams.set("case", state.taskReferenceCaseId);
  }
  return window.image2I18n?.localizeUrl?.(url.href) || url.href;
}

function renderTaskActions() {
  const href = taskUrl();
  ["#backToTask", "#applyToTask"].forEach((selector) => {
    const link = $(selector);
    if (link) link.href = href;
  });
}

function renderOverview(template, system, brand, theme, intensity, device) {
  const colors = theme.colors || {};
  const isEn = window.image2I18n?.language === "en";
  $("#selectionOverview").innerHTML = `
    <article><span>PAGE</span><strong>${escapeHtml(template.name)}</strong><small>${escapeHtml(template.description)}</small></article>
    <article><span>SYSTEM</span><strong>${escapeHtml(system.name)}</strong><small>${escapeHtml(system.tokens.controlHeight)} ${isEn ? "controls" : "控件"} · ${escapeHtml(system.tokens.spacing)} ${isEn ? "spacing" : "间距"}</small></article>
    <article><span>BRAND</span><strong>${escapeHtml(brand.name)}</strong><small>${escapeHtml(brand.description)}</small></article>
    <article class="theme-overview"><span>COLOR</span><strong>${escapeHtml(theme.name)}</strong><div class="theme-swatches" aria-label="${isEn ? "Current palette" : "当前配色"}"><i style="--swatch:${escapeHtml(colors.accent || "#168143")}"></i><i style="--swatch:${escapeHtml(colors.surface || "#ffffff")}"></i><i style="--swatch:${escapeHtml(colors.canvas || "#f2f4ef")}"></i><i style="--swatch:${escapeHtml(colors.ink || "#151816")}"></i></div><small>${escapeHtml(device.name)} · ${escapeHtml(intensity.name)}${isEn ? " modification" : "改造"}</small></article>`;
}

function renderSummary() {
  const system = findSystem(state.system);
  const brand = findBrandReference(state.brand);
  const theme = findTheme(state.theme);
  const intensity = findChangeIntensity(state.intensity);
  const rows = [
    [brandsT("组件规范", "Component specs"), `${system.shortName} · ${system.tokens.controlHeight} · ${system.tokens.radiusControl}`],
    [brandsT("品牌表达", "Brand expression"), brand.description],
    [brandsT("配色与表面", "Color & surface"), theme.description],
    [brandsT("改造边界", "Modification scope"), intensity.description],
  ];
  $("#differenceSummary").innerHTML = rows
    .map((row) => `<div><dt>${row[0]}</dt><dd>${escapeHtml(row[1])}</dd></div>`)
    .join("");
}

const explainCopy = {
  system: { kicker: "DESIGN SYSTEM", title: "设计系统决定组件怎么工作", body: "它定义按钮、输入框、卡片、导航等组件的结构、尺寸、间距、状态和可访问性。切换它，应该看到真正的组件规范差异，而不是只换颜色。", items: ["Material 3：强调状态层级与跨平台一致性", "Ant Design：适合信息密集的企业级 Web 产品", "Apple HIG：此处是规则模拟预览，不是苹果官方 Web 组件库"] },
  brand: { kicker: "BRAND REFERENCE", title: "品牌参考决定页面怎么说话", body: "它用于表达气质、强调方式和排版倾向，不会替换当前设计系统的组件。", items: ["Linear：冷静、精确、效率优先", "Stripe：明亮、技术可信、商业表达强", "Airbnb：温暖、人本、生活方式感更强"] },
  theme: { kicker: "COLOR THEME", title: "配色主题只负责色彩与表面", body: "这里的主题来自公开设计规范中的色彩体系，用来改变画布、表面、文字、强调色与状态色。", items: ["可以让 Ant Design 组件使用 Apple HIG 配色做实验", "可以固定品牌参考，只比较不同配色系统", "不会因为换配色而改变按钮或表单组件结构"] },
};

function openExplanation(id) {
  const copy = explainCopy[id];
  if (!copy) return;
  $("#explainContent").innerHTML = `<p class="eyebrow">${copy.kicker}</p><h2>${copy.title}</h2><p>${copy.body}</p><ul>${copy.items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  $("#explainDialog").showModal();
}

// ---- 工具函数 ----
function fillSelect(selector, items) {
  $(selector).innerHTML = items
    .map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`)
    .join("");
}

function syncControls() {
  $("#projectName").value = state.name;
  ["template", "system", "brand", "theme"].forEach((key) => ($(`#${key}Select`).value = state[key]));
  document.querySelectorAll("[data-intensity]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.intensity === state.intensity));
  document.querySelectorAll("[data-device]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.device === state.device));
  document.querySelectorAll("[data-appearance]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.appearance === state.appearance));
  document.querySelectorAll("[data-view]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.view === state.view));
  document.querySelectorAll("[data-compare-system]").forEach((btn) => btn.classList.toggle("is-selected", state.compare.includes(btn.dataset.compareSystem)));
}

function update(save) {
  syncControls();
  if (save) persist(state);
  writeUrl(state);
  render();
}

function showToast(message) {
  const toast = $("#toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => (toast.hidden = true), 1800);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}

// ---- i18n ----
function brandsT(zh, en) {
  return window.image2I18n?.language === "en" ? en : zh;
}

function localizeItem(item, type) {
  const isEn = window.image2I18n?.language === "en";
  if (!isEn) return item;
  const table = {
    template: {
      dashboard: { name: "SaaS Dashboard", description: "Metrics overview, project progress, and team collaboration" },
      commerce: { name: "E-commerce", description: "Product discovery, filtering, details, and purchase actions" },
      landing: { name: "Landing page", description: "Value proposition, feature highlights, and conversion actions" },
      social: { name: "Social app", description: "Activity feed, content interaction, and personal connections" },
      login: { name: "Login", description: "Authentication, input validation, and login feedback" },
      "account-settings": { name: "Account settings", description: "Profile editing, preferences, and save feedback" },
      "list-detail": { name: "List detail", description: "Data browsing, status filtering, and detail dialogs" },
    },
    intensity: {
      light: { name: "Light", description: "Adjust colors, fonts, and corner radius only" },
      standard: { name: "Standard", description: "Replace components and partial layout details" },
      deep: { name: "Deep", description: "Reorganize the page for the target system" },
      strict: { name: "Strict", description: "Follow the specified system as closely as possible" },
    },
    device: {
      iphone: { name: "iPhone" },
      android: { name: "Android" },
      desktop: { name: "Desktop" },
    },
    brand: {
      linear: { description: "Calm, precise, built for efficient software teams" },
      apple: { description: "Clear, restrained, with content and whitespace establishing order" },
      stripe: { description: "Bright gradients, technical credibility, and business expression" },
      notion: { description: "Neutral, content-first, with a natural tool feel" },
      airbnb: { description: "Warm, human-centered, suited for lifestyle products" },
    },
  };
  const row = table[type]?.[item.id];
  return row ? { ...item, ...row } : item;
}

const brandsTranslations = {
  "brands.metaDescription": { zh: "比较设计系统、品牌参考和配色主题，并将选择应用到当前设计任务。", en: "Compare design systems, brand references, and color themes, then apply a choice to the current design task." },
  "brands.pageTitle": { zh: "设计系统探索器 · ONDesign", en: "Design System Explorer · ONDesign" },
  "brands.skipLink": { zh: "跳转到实时预览", en: "Skip to live preview" },
  "brands.heroTitle": { zh: "比较设计系统，", en: "Compare systems," },
  "brands.heroEm": { zh: "看清每一种选择。", en: "see what changes." },
  "brands.heroIntro": { zh: "固定同一个页面目标，比较不同设计系统、品牌表达和配色主题。变化会直接反映到组件、信息层级与视觉气质上。", en: "Keep one page goal fixed while comparing design systems, brand expression, and color themes. Changes appear directly in components, hierarchy, and visual tone." },
  "brands.backToTask": { zh: "返回设计任务", en: "Back to design task" },
  "brands.applyToTask": { zh: "应用到当前任务", en: "Use in current task" },
  "brands.conceptSystem": { zh: "设计系统", en: "Design system" },
  "brands.conceptSystemSmall": { zh: "组件 · 间距 · 状态", en: "Components · Spacing · States" },
  "brands.conceptBrand": { zh: "品牌参考", en: "Brand reference" },
  "brands.conceptBrandSmall": { zh: "语气 · 排版倾向", en: "Tone · Typography" },
  "brands.conceptTheme": { zh: "配色主题", en: "Color theme" },
  "brands.conceptThemeSmall": { zh: "色彩 · 对比 · 表面", en: "Color · Contrast · Surface" },
  "brands.composerTitle": { zh: "设置比较基准", en: "Set comparison baseline" },
  "brands.projectName": { zh: "项目名称", en: "Project name" },
  "brands.selectorTemplate": { zh: "页面类型", en: "Page type" },
  "brands.selectorTemplateSmall": { zh: "决定内容骨架与任务流程", en: "Defines the content skeleton and task flow" },
  "brands.selectorSystem": { zh: "设计系统", en: "Design system" },
  "brands.selectorSystemSmall": { zh: "决定组件、状态与交互规范", en: "Defines components, states, and interaction specs" },
  "brands.selectorBrand": { zh: "品牌参考", en: "Brand reference" },
  "brands.selectorBrandSmall": { zh: "只参考表达气质，不调用品牌组件", en: "References brand expression only, not brand components" },
  "brands.selectorTheme": { zh: "配色主题", en: "Color theme" },
  "brands.selectorThemeSmall": { zh: "控制页面色彩、表面与对比关系", en: "Controls page colors, surfaces, and contrast" },
  "brands.fieldsetIntensity": { zh: "改造深度", en: "Transformation depth" },
  "brands.fieldsetDevice": { zh: "设备尺寸", en: "Device size" },
  "brands.fieldsetAppearance": { zh: "外观", en: "Appearance" },
  "brands.previewTitle": { zh: "实时预览", en: "Live preview" },
  "brands.viewControlsLabel": { zh: "预览模式", en: "Preview mode" },
  "brands.viewSingle": { zh: "单页", en: "Single" },
  "brands.viewCompare": { zh: "并排对比", en: "Compare" },
  "brands.viewDifferences": { zh: "差异清单", en: "Differences" },
  "brands.saveProject": { zh: "保存当前比较", en: "Save comparison" },
  "brands.generateDemo": { zh: "打开比较 Demo", en: "Open comparison demo" },
  "brands.compareTitle": { zh: "选择 2–3 个设计系统进行比较", en: "Choose 2–3 design systems to compare" },
  "brands.compareIntro": { zh: "页面内容、品牌参考和配色保持一致，只比较组件规范差异", en: "Same content, brand, and colors; compare only component specs" },
  "brands.decisionTitle": { zh: "当前选择改变了什么", en: "What your choices changed" },
  "brands.quickColorLabel": { zh: "快速换配色", en: "Quick color swap" },
  "brands.quickColorIntro": { zh: "这些按钮只改变页面的配色与表面关系，不会更换设计系统组件。", en: "These buttons only change the color scheme and surface, not the design system components." },
};

function applyBrandsLanguage() {
  document.documentElement.lang = window.image2I18n?.language === "en" ? "en" : "zh-CN";
  initialize();
}

window.image2I18n?.addTranslations?.(brandsTranslations);
window.image2I18n?.registerPage?.(applyBrandsLanguage);
