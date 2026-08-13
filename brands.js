import { brandProfiles, componentReferences } from "./catalog/index.js";

const filters = document.querySelector("#catalogFilters");
const searchInput = document.querySelector('.catalog-search input[name="query"]');
const grid = document.querySelector("#systemCardGrid");
const empty = document.querySelector("#catalogEmpty");
const dialog = document.querySelector("#referenceDialog");
const toast = document.querySelector("#toast");
let toastTimer = 0;

initialize();

function initialize() {
  const platforms = [...new Set(componentReferences.flatMap((component) => component.platforms))].sort();
  const categories = [...new Set(componentReferences.map((component) => component.category))].sort();
  filters.elements.platform.insertAdjacentHTML("beforeend", platforms.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(platformName(value))}</option>`).join(""));
  filters.elements.category.insertAdjacentHTML("beforeend", categories.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(categoryName(value))}</option>`).join(""));
  bindEvents();
  renderCatalog();
  const requestedComponent = new URL(window.location.href).searchParams.get("component");
  if (componentReferences.some((component) => component.id === requestedComponent)) openComponentReference(requestedComponent, { updateUrl: false });
}

function bindEvents() {
  searchInput.addEventListener("input", renderCatalog);
  filters.addEventListener("change", renderCatalog);
  empty.querySelector("button").addEventListener("click", () => {
    filters.reset();
    searchInput.value = "";
    renderCatalog();
    searchInput.focus();
  });
  grid.addEventListener("click", (event) => {
    const reference = event.target.closest("[data-component-reference]");
    if (reference) openComponentReference(reference.dataset.componentReference);
  });
  dialog.addEventListener("click", (event) => {
    const reference = event.target.closest("[data-component-reference]");
    if (reference) { openComponentReference(reference.dataset.componentReference); return; }
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", clearComponentUrl);
  window.addEventListener("image2:languagechange", renderCatalog);
}

function renderCatalog() {
  const data = new FormData(filters);
  const query = searchInput.value.trim().toLowerCase();
  const platform = data.get("platform");
  const category = data.get("category");
  const matches = brandProfiles.map((brand) => {
    const allComponents = componentReferences.filter((component) => component.brandProfileId === brand.id);
    const filteredComponents = allComponents.filter((component) => (!platform || component.platforms.includes(platform)) && (!category || component.category === category));
    const haystack = [brand.name, brand.organization, brand.description, ...allComponents.flatMap((component) => [component.name, component.summary, component.category])].join(" ").toLowerCase();
    return { brand, components: filteredComponents, matchesQuery: !query || haystack.includes(query) };
  }).filter(({ components, matchesQuery }) => components.length && matchesQuery);

  grid.innerHTML = matches.map(({ brand, components }) => systemCard(brand, components)).join("");
  empty.hidden = matches.length !== 0;
  grid.hidden = matches.length === 0;
  document.querySelector("#catalogSystemCount").textContent = matches.length;
  document.querySelector("#catalogComponentCount").textContent = matches.reduce((total, { components }) => total + components.length, 0);
  updateFilterAvailability(platform, category);
}

function updateFilterAvailability(platform, category) {
  [...filters.elements.platform.options].forEach((option) => {
    option.disabled = Boolean(option.value) && option.value !== platform && !componentReferences.some((component) => component.platforms.includes(option.value) && (!category || component.category === category));
  });
  [...filters.elements.category.options].forEach((option) => {
    option.disabled = Boolean(option.value) && option.value !== category && !componentReferences.some((component) => component.category === option.value && (!platform || component.platforms.includes(platform)));
  });
}

function systemCard(brand, components) {
  const system = catalogToLabSystem(brand.id);
  const platforms = brand.platforms.slice(0, 3);
  return `<article class="system-card">
    <header class="system-card-title">
      <span class="system-mark" aria-hidden="true">${escapeHtml(systemInitials(brand.name))}</span>
      <div><h2>${escapeHtml(brand.name)}</h2><p>${escapeHtml(brand.organization)}</p></div>
    </header>
    <p class="system-positioning">${escapeHtml(brand.description)}</p>
    <div class="system-platforms">${platforms.map((item) => `<span>${escapeHtml(platformName(item))}</span>`).join("")}</div>
    ${miniPreview(brand.id)}
    <footer>
      <button class="reference-button" type="button" data-component-reference="${escapeHtml(components[0].id)}" aria-label="查看 ${escapeHtml(brand.name)} 的 ${components.length} 个组件参考">组件参考 · ${components.length}</button>
      <a class="preview-button" href="${escapeHtml(labUrl(system))}" aria-label="在实验室预览 ${escapeHtml(brand.name)}">预览<span aria-hidden="true">→</span></a>
    </footer>
  </article>`;
}

function labUrl(system) {
  const href = `./lab/?system=${encodeURIComponent(system)}&view=single`;
  return window.image2I18n ? window.image2I18n.localizeUrl(href) : href;
}

function miniPreview(id) {
  const variant = ({
    "apple-hig": "apple", "google-material-3": "material", "carbon-design": "carbon", "fluent-2": "fluent",
    "shopify-polaris": "polaris", "github-primer": "primer", "adobe-spectrum": "spectrum", "radix-ui": "radix",
  })[id] || "standard";
  if (variant === "apple") return '<div class="mini-preview mini-apple" aria-hidden="true"><span class="mini-button">Button</span><span>▤</span><span>▥</span><i></i></div>';
  if (variant === "material") return '<div class="mini-preview mini-material" aria-hidden="true"><span class="mini-button">Button</span><span class="mini-field">Top App Bar⌄</span><i></i></div>';
  if (variant === "carbon") return '<div class="mini-preview mini-carbon" aria-hidden="true"><span class="mini-button">Button</span><span class="mini-field">Data table⌄</span><i></i><i></i></div>';
  if (variant === "fluent") return '<div class="mini-preview mini-fluent" aria-hidden="true"><span class="mini-button">Button</span><span class="mini-field">Select⌄</span><span>□</span></div>';
  if (variant === "polaris") return '<div class="mini-preview mini-polaris" aria-hidden="true"><span class="mini-button">Button</span><span class="mini-field">Orders</span><i></i></div>';
  if (variant === "primer") return '<div class="mini-preview mini-primer" aria-hidden="true"><span class="mini-button">Button</span><span class="mini-field">Search</span><span>◉</span></div>';
  if (variant === "spectrum") return '<div class="mini-preview mini-spectrum" aria-hidden="true"><span class="mini-button">Button</span><span class="mini-field">Dialog</span><i></i><i></i></div>';
  if (variant === "radix") return '<div class="mini-preview mini-radix" aria-hidden="true"><span class="mini-button">Button</span><span class="mini-field">Dialog</span><span>○</span></div>';
  return '<div class="mini-preview mini-standard" aria-hidden="true"><span class="mini-button">Button</span><span class="mini-field">Input</span><i></i><span>○</span></div>';
}

function openComponentReference(id, { updateUrl = true } = {}) {
  const component = componentReferences.find((item) => item.id === id);
  const brand = brandProfiles.find((item) => item.id === component?.brandProfileId);
  if (!component || !brand) return;
  const siblings = componentReferences.filter((item) => item.brandProfileId === brand.id);
  document.querySelector("#referenceDialogLabel").textContent = `${brand.name.toUpperCase()} / ${categoryName(component.category).toUpperCase()}`;
  document.querySelector("#referenceDialogTitle").textContent = component.name;
  document.querySelector("#referenceDialogContent").innerHTML = `<article class="component-reference-detail">
    ${siblings.length > 1 ? `<nav class="reference-switch" aria-label="${escapeHtml(brand.name)} 的组件参考">${siblings.map((item) => `<button type="button" data-component-reference="${escapeHtml(item.id)}" aria-current="${item.id === component.id}">${escapeHtml(item.name)}<small>${escapeHtml(categoryName(item.category))}</small></button>`).join("")}</nav>` : ""}
    <p class="component-summary">${escapeHtml(component.summary)}</p>
    <div class="component-reference-grid">
      ${referenceSection("结构", component.anatomy)}
      ${referenceSection("状态", component.states)}
      ${referenceSection("行为", component.behavior)}
      ${referenceSection("可访问性", component.accessibility)}
    </div>
    <section class="reference-tokens"><h3>Tokens / API 参考值</h3><dl>${Object.entries(component.tokens).map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl></section>
    <p class="reference-disclaimer">${escapeHtml(brand.disclaimer)}</p>
    <footer><a href="${escapeHtml(component.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看官方组件文档 ↗</a><button type="button" data-copy-component>复制组件 Prompt</button></footer>
  </article>`;
  dialog.querySelector("[data-copy-component]").addEventListener("click", () => copyText(buildComponentPrompt(component, brand), "组件 Prompt 已复制"));
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("component", component.id);
    url.searchParams.set("brand", brand.id);
    window.history.replaceState({}, "", url);
  }
  if (!dialog.open) dialog.showModal();
  else dialog.querySelector('.reference-switch [aria-current="true"]')?.focus();
}

function clearComponentUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("component");
  url.searchParams.delete("brand");
  window.history.replaceState({}, "", url);
}

function referenceSection(title, items) { return `<section><h3>${title}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`; }
function buildComponentPrompt(component, brand) { return [`组件参考：${brand.name} / ${component.name}`, `来源状态：${component.sourceStatus}`, `官方来源：${component.sourceUrl}`, `平台：${component.platforms.join(" / ")}`, `结构：${component.anatomy.join("；")}`, `状态：${component.states.join("；")}`, `行为：${component.behavior.join("；")}`, `可访问性：${component.accessibility.join("；")}`, `Tokens：${Object.entries(component.tokens).map(([key, value]) => `${key}=${value}`).join("；")}`, "边界：不得自动生成、仿制或添加品牌 Logo、商标、品牌文字、商业字体或专属素材，也不得暗示品牌背书。"].join("\n"); }
function catalogToLabSystem(id) { return ({ "adobe-spectrum": "spectrum", "ant-design": "ant", "apple-hig": "apple", "arco-design": "arco", "atlassian-design": "atlassian", "carbon-design": "carbon", "chakra-ui": "chakra", "element-plus": "element-plus", "fluent-2": "fluent", "github-primer": "primer", "google-material-3": "material", "headless-ui": "headless", mantine: "mantine", mui: "mui", "radix-ui": "radix", "semi-design": "semi", "shadcn-ui": "shadcn", "shopify-polaris": "polaris", tdesign: "tdesign" })[id] || "ant"; }
function systemInitials(name) { return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 3).toUpperCase(); }
function platformName(value) { return ({ web: "Web", react: "React", vue: "Vue", angular: "Angular", ios: "iOS", ipados: "iPadOS", macos: "macOS", android: "Android", windows: "Windows", mobile: "Mobile", miniprogram: "小程序" })[value] || value; }
function categoryName(value) { return ({ action: "操作", input: "输入", navigation: "导航", data: "数据", overlay: "浮层", feedback: "反馈", "date-time": "日期时间" })[value] || value; }
async function copyText(value, message) { try { await navigator.clipboard.writeText(value); } catch { const area = document.createElement("textarea"); area.value = value; area.style.cssText = "position:fixed;opacity:0"; document.body.append(area); area.select(); document.execCommand("copy"); area.remove(); } showToast(message); }
function showToast(message) { window.clearTimeout(toastTimer); toast.textContent = message; toast.hidden = false; toastTimer = window.setTimeout(() => { toast.hidden = true; }, 1800); }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]); }
