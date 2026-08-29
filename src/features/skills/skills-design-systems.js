const SOURCE_URL = "https://github.com/alexpate/awesome-design-systems";
const LANG = () => (window.image2I18n?.language === "en" || document.documentElement.lang.startsWith("en") ? "en" : "zh");
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value) => String(value || "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

const designSystems = [
  { name: "Adobe Spectrum", domain: "spectrum.adobe.com", url: "https://spectrum.adobe.com/", sourceCode: true, sample: "Sp", zh: "Adobe 的跨产品设计系统，覆盖基础规范、组件、内容与无障碍。", en: "Adobe's cross-product design system covering foundations, components, content and accessibility.", focusZh: "企业产品 / 组件规范 / 无障碍", focusEn: "Enterprise UI / components / accessibility" },
  { name: "Ant Design", domain: "ant.design", url: "https://ant.design/", sourceCode: true, sample: "Ant", zh: "面向企业级产品的成熟设计体系，组件、模式和工程实现都很完整。", en: "A mature enterprise design system with extensive components, patterns and production-ready implementation.", focusZh: "后台 / 企业产品 / React", focusEn: "Dashboards / enterprise products / React" },
  { name: "Atlassian Design System", domain: "atlassian.design", url: "https://atlassian.design/", sourceCode: true, sample: "At", zh: "覆盖产品基础、组件、内容语言与交互模式的完整企业设计系统。", en: "A comprehensive enterprise system spanning foundations, components, content language and interaction patterns.", focusZh: "复杂产品 / 内容规范 / 组件", focusEn: "Complex products / content guidelines / components" },
  { name: "AWS Cloudscape", domain: "cloudscape.design", url: "https://cloudscape.design/", sourceCode: true, sample: "AWS", zh: "AWS 面向复杂云产品与管理后台的设计系统，特别适合高信息密度界面。", en: "AWS's design system for complex cloud products and admin experiences, especially strong for dense interfaces.", focusZh: "云产品 / 管理后台 / 高密度 UI", focusEn: "Cloud products / admin UI / dense interfaces" },
  { name: "Fluent 2", domain: "fluent2.microsoft.design", url: "https://fluent2.microsoft.design/", sourceCode: true, sample: "Fl", zh: "微软的跨平台设计体系，覆盖 Web、桌面与多种生产力产品场景。", en: "Microsoft's cross-platform system for web, desktop and productivity experiences.", focusZh: "跨平台 / 办公产品 / 组件", focusEn: "Cross-platform / productivity / components" },
  { name: "GitHub Primer", domain: "primer.style", url: "https://primer.style/", sourceCode: true, sample: "Pr", zh: "GitHub 的设计系统，适合研究开发者工具、信息层级和高效工作流界面。", en: "GitHub's design system, useful for studying developer tools, hierarchy and workflow-heavy interfaces.", focusZh: "开发者工具 / 工作流 / 信息层级", focusEn: "Developer tools / workflows / hierarchy" },
  { name: "Material Design 3", domain: "m3.material.io", url: "https://m3.material.io/", sourceCode: true, sample: "M3", zh: "Google 的 Material 设计体系，覆盖颜色、排版、组件、动效与自适应界面。", en: "Google's Material system covering color, typography, components, motion and adaptive layouts.", focusZh: "移动端 / 自适应 / 组件规范", focusEn: "Mobile / adaptive UI / component guidance" },
  { name: "IBM Carbon", domain: "carbondesignsystem.com", url: "https://carbondesignsystem.com/", sourceCode: true, sample: "C", zh: "IBM 的开源设计系统，适合大型 B2B、数据密集型与复杂业务产品。", en: "IBM's open-source design system for large B2B, data-heavy and complex business products.", focusZh: "B2B / 数据产品 / 企业组件", focusEn: "B2B / data products / enterprise components" },
  { name: "GOV.UK Design System", domain: "design-system.service.gov.uk", url: "https://design-system.service.gov.uk/", sourceCode: true, sample: "GOV", zh: "英国政府设计系统，以可读性、无障碍和任务完成效率为核心。", en: "The UK government design system, centered on readability, accessibility and task completion.", focusZh: "无障碍 / 公共服务 / 表单", focusEn: "Accessibility / public services / forms" },
  { name: "HashiCorp Helios", domain: "helios.hashicorp.design", url: "https://helios.hashicorp.design/", sourceCode: true, sample: "H", zh: "HashiCorp 的产品设计系统，适合开发工具、云基础设施与复杂配置界面。", en: "HashiCorp's product design system for developer tooling, cloud infrastructure and complex configuration UI.", focusZh: "开发工具 / 云基础设施 / 配置界面", focusEn: "Developer tools / cloud infrastructure / configuration" },
  { name: "Apple HIG", domain: "developer.apple.com/design", url: "https://developer.apple.com/design/human-interface-guidelines/", sourceCode: false, sample: "", zh: "Apple Human Interface Guidelines，适合研究平台一致性、交互原则与原生体验。", en: "Apple Human Interface Guidelines for platform consistency, interaction principles and native experiences.", focusZh: "原生体验 / 平台规范 / 交互原则", focusEn: "Native UX / platform guidance / interaction principles" }
];

let designSystemsOnly = false;
let rendering = false;
let scheduled = 0;

function isWebMode() {
  return $("[data-directory-mode='WEB']")?.classList.contains("is-active");
}

function sourceOnlyActive() {
  return $("[data-source-filter='OPEN']")?.classList.contains("is-active");
}

function activeCoreCategory() {
  return $$("#topTaskFilters [data-repo-filter].is-active").some((button) => button.dataset.repoFilter !== "ALL");
}

function visibleSystems() {
  const query = ($("#repoSearch")?.value || "").trim().toLowerCase();
  return designSystems.filter((item) => {
    if (sourceOnlyActive() && !item.sourceCode) return false;
    if (!query) return true;
    return [item.name, item.domain, item.zh, item.en, item.focusZh, item.focusEn].join(" ").toLowerCase().includes(query);
  });
}

function installStyle() {
  if ($("#awesome-design-systems-style")) return;
  const style = document.createElement("style");
  style.id = "awesome-design-systems-style";
  style.textContent = `
    .web-reference-system-preview{position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(145deg,var(--surface,#fff),color-mix(in srgb,var(--accent,#18a957) 9%,#fff));color:var(--text,#1b1b1b);overflow:hidden}
    .web-reference-system-preview::after{content:"";position:absolute;inset:12%;border:1px solid color-mix(in srgb,currentColor 12%,transparent);border-radius:28px}
    .web-reference-system-preview strong{position:relative;z-index:1;font-size:clamp(30px,5vw,64px);font-weight:760;letter-spacing:-.05em}
    .web-reference-system-preview span{position:absolute;left:18px;bottom:16px;z-index:1;font-size:11px;font-weight:760;letter-spacing:.12em;text-transform:uppercase;opacity:.55}
    .awesome-design-systems-group header p a{color:inherit;text-underline-offset:3px}
    .repo-filter[data-awesome-design-systems],.repo-subfilter[data-awesome-design-systems]{white-space:nowrap}
  `;
  document.head.appendChild(style);
}

function cardMarkup(item, index, groupLabel) {
  const lang = LANG();
  const description = lang === "en" ? item.en : item.zh;
  const focus = lang === "en" ? item.focusEn : item.focusZh;
  return `
    <article class="web-reference-card">
      <a class="web-reference-visual" href="${esc(item.url)}" target="_blank" rel="noreferrer" data-design-reference="${esc(item.domain)}" aria-label="${esc(item.name)}" style="--preview-ratio:3 / 2">
        <div class="web-reference-system-preview"><strong>${esc(item.sample)}</strong><span>${esc(item.name)}</span></div>
        <span class="web-reference-top"><span>${esc(groupLabel)}</span><b>${String(index + 1).padStart(2, "0")}</b></span>
      </a>
      <div class="web-reference-body">
        <a class="web-reference-title" href="${esc(item.url)}" target="_blank" rel="noreferrer" data-design-reference="${esc(item.domain)}"><span>${esc(item.name)}</span><i aria-hidden="true">↗</i></a>
        <p class="web-reference-domain">${esc(item.domain)}${item.sourceCode ? `<span class="web-source-badge">${lang === "en" ? "Source code" : "有源代码"}</span>` : ""}</p>
        <p class="web-reference-description">${esc(description)}</p>
        <footer><span>${lang === "en" ? "Best for" : "适合用于"}</span><strong>${esc(focus)}</strong></footer>
      </div>
    </article>`;
}

function ensureFilterButtons() {
  if (!isWebMode()) return;
  const lang = LANG();
  const top = $("#topTaskFilters");
  if (top && !$("[data-awesome-design-systems]", top)) {
    const button = document.createElement("button");
    button.className = `repo-filter${designSystemsOnly ? " is-active" : ""}`;
    button.type = "button";
    button.dataset.awesomeDesignSystems = "top";
    button.setAttribute("aria-pressed", String(designSystemsOnly));
    button.innerHTML = `<span>${lang === "en" ? "Design systems" : "设计系统"}</span><b>${designSystems.length}</b>`;
    top.appendChild(button);
  }
  const facetList = $("#repoFacets .facet-group .repo-subfilters");
  if (facetList && !$("[data-awesome-design-systems]", facetList)) {
    const button = document.createElement("button");
    button.className = `repo-subfilter${designSystemsOnly ? " is-active" : ""}`;
    button.type = "button";
    button.dataset.awesomeDesignSystems = "side";
    button.setAttribute("aria-pressed", String(designSystemsOnly));
    button.innerHTML = `<span>${lang === "en" ? "Design systems" : "设计系统"}</span><b>${designSystems.length}</b>`;
    facetList.appendChild(button);
  }
  const count = $("#categoryCount");
  const coreCount = $$("#topTaskFilters [data-repo-filter]").filter((button) => button.dataset.repoFilter !== "ALL").length;
  if (count && coreCount) count.textContent = String(coreCount + 1);
}

function syncFilterVisuals() {
  $$("[data-awesome-design-systems]").forEach((button) => {
    button.classList.toggle("is-active", designSystemsOnly);
    button.setAttribute("aria-pressed", String(designSystemsOnly));
  });
  if (designSystemsOnly) {
    $$("#topTaskFilters [data-repo-filter], #repoFacets [data-repo-filter]").forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });
  }
}

function render() {
  if (rendering) return;
  rendering = true;
  installStyle();
  const repoList = $("#repoList");
  if (!repoList || !isWebMode()) {
    $(".awesome-design-systems-group")?.remove();
    rendering = false;
    return;
  }

  ensureFilterButtons();
  syncFilterVisuals();

  const coreHasCategory = activeCoreCategory();
  const items = visibleSystems();
  const shouldShow = designSystemsOnly || !coreHasCategory;
  const signature = `${LANG()}|${designSystemsOnly}|${sourceOnlyActive()}|${$("#repoSearch")?.value || ""}|${items.map((item) => item.name).join(";")}`;
  let section = $(".awesome-design-systems-group", repoList);

  if (!shouldShow || !items.length) {
    section?.remove();
  } else if (!section || section.dataset.signature !== signature) {
    section?.remove();
    const lang = LANG();
    const groupLabel = lang === "en" ? "Design systems" : "设计系统";
    section = document.createElement("section");
    section.className = "web-reference-group awesome-design-systems-group";
    section.dataset.signature = signature;
    section.innerHTML = `
      <header>
        <div><span>DESIGN_SYSTEM</span><h3>${groupLabel}</h3></div>
        <p>${lang === "en" ? "Curated from the Awesome Design Systems list indexed by Awesome." : "参考 Awesome 收录的 Awesome Design Systems 清单，精选成熟且可直接查规范的设计系统。"} <a href="${SOURCE_URL}" target="_blank" rel="noreferrer">${lang === "en" ? "Source" : "来源"} ↗</a></p>
        <b>${String(items.length).padStart(2, "0")}</b>
      </header>
      <div class="web-reference-grid">${items.map((item, index) => cardMarkup(item, index, groupLabel)).join("")}</div>`;
    repoList.prepend(section);
  }

  $$(":scope > .web-reference-group", repoList).forEach((group) => {
    if (!group.classList.contains("awesome-design-systems-group")) group.hidden = designSystemsOnly;
  });
  rendering = false;
}

function scheduleRender() {
  clearTimeout(scheduled);
  scheduled = window.setTimeout(render, 0);
}

function installEvents() {
  document.addEventListener("click", (event) => {
    const awesomeButton = event.target.closest("[data-awesome-design-systems]");
    if (awesomeButton) {
      designSystemsOnly = !designSystemsOnly;
      if (!designSystemsOnly) $("#topTaskFilters [data-repo-filter='ALL']")?.click();
      scheduleRender();
      return;
    }
    if (event.target.closest("[data-repo-filter], [data-directory-mode], [data-source-filter]")) {
      designSystemsOnly = false;
      scheduleRender();
    }
  });
  $("#repoSearch")?.addEventListener("input", scheduleRender);
  window.addEventListener("image2:languagechange", scheduleRender);

  const target = $(".skills-page") || document.body;
  new MutationObserver(scheduleRender).observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden"] });
}

function init() {
  installEvents();
  scheduleRender();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
