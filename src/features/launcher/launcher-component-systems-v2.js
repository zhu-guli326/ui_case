const STORAGE_KEY = "ondesign:component-system:v2";

const SYSTEMS = [
  { id:"antd", name:"Ant Design", short:"Ant", domain:"ant.design", docs:"https://ant.design/components/overview/", metaZh:"React · 企业级", metaEn:"React · Enterprise", descZh:"表单、表格、反馈和复杂业务组件覆盖完整。", descEn:"Complete forms, tables, feedback and complex enterprise patterns.", radius:"6px", height:"34px", weight:"500", shadow:"none" },
  { id:"shadcn", name:"shadcn/ui", short:"sh", domain:"ui.shadcn.com", docs:"https://ui.shadcn.com/docs/components", metaZh:"React · 开放源码", metaEn:"React · Open code", descZh:"源码直接进入项目，组合自由，适合 AI Coding。", descEn:"Open-code components that live in your project and compose freely.", radius:"7px", height:"36px", weight:"500", shadow:"0 1px 2px rgba(0,0,0,.06)" },
  { id:"arco", name:"Arco Design", short:"Arco", domain:"arco.design", docs:"https://arco.design/react/components/overview", metaZh:"React · 企业后台", metaEn:"React · Enterprise", descZh:"高密度中后台，表格、筛选和数据录入完整。", descEn:"Dense enterprise patterns for tables, filters and data entry.", radius:"3px", height:"34px", weight:"500", shadow:"none" },
  { id:"semi", name:"Semi Design", short:"Semi", domain:"semi.design", docs:"https://semi.design/zh-CN/start/overview", docsEn:"https://semi.design/en-US/start/overview", metaZh:"React · 80+ 组件", metaEn:"React · 80+ components", descZh:"覆盖 AI、数据展示、表单和复杂桌面交互。", descEn:"Broad desktop coverage across AI, data, forms and interactions.", radius:"6px", height:"36px", weight:"600", shadow:"none" },
  { id:"tdesign", name:"TDesign", short:"TD", domain:"tdesign.tencent.com", docs:"https://tdesign.tencent.com/react/overview", metaZh:"React · 腾讯企业级", metaEn:"React · Tencent enterprise", descZh:"组件状态和中文业务场景规范完整。", descEn:"Comprehensive component states and enterprise product patterns.", radius:"4px", height:"34px", weight:"500", shadow:"none" },
  { id:"mui", name:"Material UI", short:"MUI", domain:"mui.com", docs:"https://mui.com/material-ui/all-components/", metaZh:"React · Material", metaEn:"React · Material", descZh:"生产级 React 组件，主题、行为和无障碍成熟。", descEn:"Production React components with mature theming and accessibility.", radius:"4px", height:"36px", weight:"500", shadow:"0 2px 5px rgba(0,0,0,.16)" },
  { id:"element", name:"Element Plus", short:"EP", domain:"element-plus.org", docs:"https://element-plus.org/en-US/component/overview", metaZh:"Vue 3 · 企业后台", metaEn:"Vue 3 · Enterprise", descZh:"Vue 3 表单、数据、导航与反馈组件覆盖全面。", descEn:"Vue 3 coverage for forms, data, navigation and feedback.", radius:"4px", height:"34px", weight:"500", shadow:"none" },
  { id:"radix", name:"Radix UI", short:"Rx", domain:"radix-ui.com", docs:"https://www.radix-ui.com/primitives/docs/components", metaZh:"React · 无样式原语", metaEn:"React · Unstyled primitives", descZh:"无样式、可访问的交互原语，视觉自由度最高。", descEn:"Accessible unstyled primitives with maximum visual freedom.", radius:"4px", height:"34px", weight:"500", shadow:"none" },
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const isEn = () => document.documentElement.lang.startsWith("en") || window.image2I18n?.language === "en";
const text = (zh, en) => isEn() ? en : zh;
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const byId = (id) => SYSTEMS.find((item) => item.id === id) || SYSTEMS[0];
const docsFor = (item) => isEn() && item.docsEn ? item.docsEn : item.docs;
const logoFor = (item) => `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(`https://${item.domain}`)}&sz=128`;

let current = SYSTEMS[0];
let field = null;
let trigger = null;
let menu = null;
let promptObserver = null;
let summaryObserver = null;

function syncVisualCopy() {
  const visual = $("[data-design-system-field]");
  if (!visual) return;
  visual.classList.add("visual-system-field");
  const legend = $("legend", visual);
  const note = $(".ds-note", visual);
  const search = $(".ds-search", visual);
  const rulesDesc = $('[data-i18n="dna.rulesDesc"]');
  const inheritedFont = $('option[value="__design-system__"]');

  if (legend) legend.textContent = text("视觉规范", "Visual system");
  if (rulesDesc) rulesDesc.textContent = text("视觉规范 + 组件规范，再微调字体、圆角与间距。", "Visual system + component system, then fine-tune typography, radius and spacing.");
  if (search) {
    search.placeholder = text("搜索 Linear、Apple、Figma…", "Search Linear, Apple, Figma…");
    search.setAttribute("aria-label", text("搜索视觉规范", "Search visual systems"));
  }
  if (note) note.textContent = text(
    "视觉规范决定颜色、字体、圆角、间距与整体气质；选择后仍可继续微调。来源：VoltAgent/awesome-design-md（MIT）。",
    "The visual system controls color, typography, radius, spacing and overall character. Source: VoltAgent/awesome-design-md (MIT)."
  );
  if (inheritedFont) {
    const tail = inheritedFont.textContent.split("·").slice(1).join("·").trim();
    inheritedFont.textContent = `${text("视觉规范", "Visual system")} · ${tail}`;
  }
}

function fieldMarkup() {
  return `<fieldset class="cs-field" data-component-system-field>
    <legend>${text("组件规范", "Component system")}</legend>
    <button class="cs-trigger" type="button" aria-expanded="false" data-cs-trigger>
      <span class="cs-logo"><img alt="" loading="lazy"><b aria-hidden="true"></b></span>
      <span class="cs-trigger-copy"><strong></strong><small></small></span>
      <span class="cs-trigger-arrow" aria-hidden="true"></span>
    </button>
    <div class="cs-menu" data-cs-menu hidden>
      <div class="cs-menu-head"><strong>${text("选择组件骨架与交互规则", "Choose component structure and interaction rules")}</strong><span>8</span></div>
      <div class="cs-list" data-cs-list role="radiogroup"></div>
    </div>
    <div class="cs-live">
      <div class="cs-live-head"><span>${text("组件效果", "Component preview")}</span><a target="_blank" rel="noopener noreferrer" data-cs-docs>${text("查看官方组件 ↗", "Official components ↗")}</a></div>
      <div class="cs-live-row">
        <button class="cs-demo-button" type="button">${text("主按钮", "Primary")}</button>
        <label class="cs-demo-input"><span>${text("输入框", "Input")}</span><input type="text" value="ONDesign" aria-label="Component input preview"></label>
        <span class="cs-demo-tag">${text("标签", "Tag")}</span>
        <label class="cs-demo-switch" aria-label="Switch preview"><input type="checkbox" checked><i></i></label>
      </div>
    </div>
    <p class="cs-note">${text("组件规范只负责组件结构、状态和交互；颜色与字体继续跟随上方视觉规范。", "The component system controls structure, states and interaction; color and typography continue to follow the visual system.")}</p>
  </fieldset>`;
}

function ensureField() {
  const visual = $("[data-design-system-field]");
  if (!visual) return false;
  if (!$("[data-component-system-field]")) visual.insertAdjacentHTML("afterend", fieldMarkup());
  field = $("[data-component-system-field]");
  trigger = $("[data-cs-trigger]", field);
  menu = $("[data-cs-menu]", field);
  return Boolean(field && trigger && menu);
}

function optionMarkup(item) {
  const selected = item.id === current.id;
  return `<div class="cs-option${selected ? " is-selected" : ""}" role="radio" aria-checked="${selected}">
    <button class="cs-option-select" type="button" data-cs-select="${escapeHtml(item.id)}">
      <span class="cs-logo"><img src="${escapeHtml(logoFor(item))}" alt="${escapeHtml(item.name)} logo" loading="lazy"><b>${escapeHtml(item.short)}</b></span>
      <span class="cs-option-copy"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(isEn()?item.metaEn:item.metaZh)}</small><em>${escapeHtml(isEn()?item.descEn:item.descZh)}</em></span>
      <span class="cs-option-check">✓</span>
    </button>
    <a class="cs-option-docs" href="${escapeHtml(docsFor(item))}" target="_blank" rel="noopener noreferrer">${text("官方组件", "Docs")} ↗</a>
  </div>`;
}

function renderOptions() {
  const list = $("[data-cs-list]", field);
  if (!list) return;
  list.innerHTML = SYSTEMS.map(optionMarkup).join("");
  $$('[data-cs-select]', list).forEach((button) => button.addEventListener("click", () => select(button.dataset.csSelect)));
  $$(".cs-logo img", list).forEach((img) => img.addEventListener("error", () => img.closest(".cs-logo")?.classList.add("is-fallback"), { once:true }));
}

function applyGeometry() {
  const root = document.documentElement;
  root.style.setProperty("--cs-radius", current.radius);
  root.style.setProperty("--cs-control-height", current.height);
  root.style.setProperty("--cs-font-weight", current.weight);
  root.style.setProperty("--cs-shadow", current.shadow);
  document.body.dataset.componentSystem = current.id;
  document.body.dataset.componentSystemReady = "true";
}

function updateField() {
  if (!field) return;
  $("legend", field).textContent = text("组件规范", "Component system");
  $(".cs-trigger strong", field).textContent = current.name;
  $(".cs-trigger small", field).textContent = `${isEn()?current.metaEn:current.metaZh} · ${text("结构 / 状态 / 交互", "structure / states / interaction")}`;
  const image = $(".cs-trigger .cs-logo img", field);
  image.src = logoFor(current);
  image.alt = `${current.name} logo`;
  image.closest(".cs-logo")?.classList.remove("is-fallback");
  $(".cs-trigger .cs-logo b", field).textContent = current.short;
  image.addEventListener("error", () => image.closest(".cs-logo")?.classList.add("is-fallback"), { once:true });
  const docsLink = $("[data-cs-docs]", field);
  docsLink.href = docsFor(current);
  docsLink.textContent = text("查看官方组件 ↗", "Official components ↗");
  $(".cs-live-head span", field).textContent = text("组件效果", "Component preview");
  $(".cs-demo-button", field).textContent = text("主按钮", "Primary");
  $(".cs-demo-input span", field).textContent = text("输入框", "Input");
  $(".cs-demo-tag", field).textContent = text("标签", "Tag");
  $(".cs-note", field).textContent = text("组件规范只负责组件结构、状态和交互；颜色与字体继续跟随上方视觉规范。", "The component system controls structure, states and interaction; color and typography continue to follow the visual system.");
  renderOptions();
}

function componentPromptLines() {
  return isEn() ? [
    `Component system: ${current.name}`,
    `Component docs: ${docsFor(current)}`,
    `Component rule: follow ${current.name} for structure, variants, states, interaction and accessibility; keep visual styling controlled by the selected visual system.`,
  ] : [
    `组件规范：${current.name}`,
    `组件文档：${docsFor(current)}`,
    `组件要求：组件结构、变体、状态、交互与可访问性优先遵循 ${current.name}；颜色、字体与整体视觉继续由视觉规范控制。`,
  ];
}

function decoratePrompt() {
  const node = $("#dnaPrompt");
  if (!node) return;
  const componentPrefixes = ["组件规范：","组件文档：","组件要求：","Component system:","Component docs:","Component rule:"];
  let lines = node.textContent.split("\n").filter((line) => !componentPrefixes.some((prefix) => line.startsWith(prefix)));
  lines = lines.map((line) => line.startsWith("设计规范：") ? line.replace("设计规范：", "视觉规范：") : line.startsWith("Design system:") ? line.replace("Design system:", "Visual system:") : line);
  let visualIndex = lines.findIndex((line) => line.startsWith("视觉规范：") || line.startsWith("Visual system:"));
  if (visualIndex < 0) visualIndex = Math.min(1, Math.max(0, lines.length - 1));
  lines.splice(visualIndex + 1, 0, ...componentPromptLines());
  const next = lines.join("\n");
  if (node.textContent !== next) node.textContent = next;
}

function decorateSummary() {
  const summary = $("#dnaSummary");
  if (!summary) return;
  const firstTerm = $("dt", summary);
  if (firstTerm && ["设计规范","Design system"].includes(firstTerm.textContent)) firstTerm.textContent = text("视觉规范", "Visual system");
  let row = $("[data-component-system-summary]", summary);
  if (!row) {
    row = document.createElement("div");
    row.dataset.componentSystemSummary = "true";
    row.innerHTML = "<dt></dt><dd></dd>";
    const first = summary.firstElementChild;
    if (first?.nextSibling) summary.insertBefore(row, first.nextSibling); else summary.append(row);
  }
  $("dt", row).textContent = text("组件规范", "Component system");
  $("dd", row).textContent = current.name;
}

function installObservers() {
  const prompt = $("#dnaPrompt");
  if (prompt && !promptObserver) {
    promptObserver = new MutationObserver(decoratePrompt);
    promptObserver.observe(prompt, { childList:true, subtree:true, characterData:true });
  }
  const summary = $("#dnaSummary");
  if (summary && !summaryObserver) {
    summaryObserver = new MutationObserver(decorateSummary);
    summaryObserver.observe(summary, { childList:true, subtree:true, characterData:true });
  }
  decoratePrompt();
  decorateSummary();
}

function toast(message) {
  const node = $("#dnaToast");
  if (!node) return;
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { node.hidden = true; }, 2000);
}

function closeMenu() {
  if (!menu || !trigger) return;
  menu.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
}

function select(id, { silent=false }={}) {
  current = byId(id);
  applyGeometry();
  try { localStorage.setItem(STORAGE_KEY, current.id); } catch {}
  updateField();
  closeMenu();
  decoratePrompt();
  decorateSummary();
  if (!silent) {
    window.dispatchEvent(new CustomEvent("ondesign:componentsystemchange", { detail:{ id:current.id, name:current.name, docs:docsFor(current) } }));
    toast(text(`组件规范已切换为 ${current.name}`, `Component system: ${current.name}`));
  }
}

function bindField() {
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = menu.hidden;
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (event) => { if (!event.target.closest("[data-component-system-field]")) closeMenu(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
}

function syncLanguage() {
  syncVisualCopy();
  updateField();
  decoratePrompt();
  decorateSummary();
}

function init() {
  syncVisualCopy();
  if (!ensureField()) return;
  bindField();
  let saved = "";
  try { saved = localStorage.getItem(STORAGE_KEY) || ""; } catch {}
  select(saved || "antd", { silent:true });
  installObservers();

  window.addEventListener("image2:languagechange", syncLanguage);
  window.addEventListener("ondesign:designsystemapply", () => { syncVisualCopy(); decoratePrompt(); decorateSummary(); });
  window.addEventListener("ondesign:designsystemchange", () => { syncVisualCopy(); decoratePrompt(); decorateSummary(); });
  window.addEventListener("ondesign:fontchange", () => { decoratePrompt(); decorateSummary(); });

  window.ONDesignComponentSystems = { entries:SYSTEMS, select, current:() => current };
}

init();
