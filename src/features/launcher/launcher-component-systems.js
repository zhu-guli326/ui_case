const STORAGE_KEY = "ondesign:component-system:v3";

const SYSTEMS = [
  { id:"antd", name:"Ant Design", short:"Ant", domain:"ant.design", docs:"https://ant.design/components/overview/", metaZh:"React · 企业级", metaEn:"React · Enterprise", descZh:"表单、表格、反馈与复杂业务组件覆盖完整。", descEn:"Complete forms, tables, feedback and enterprise patterns.", radius:"6px", height:"38px", weight:"500", shadow:"none" },
  { id:"shadcn", name:"shadcn/ui", short:"sh", domain:"ui.shadcn.com", docs:"https://ui.shadcn.com/docs/components", metaZh:"React · 开放源码", metaEn:"React · Open code", descZh:"源码直接进入项目，组合自由，适合 AI Coding。", descEn:"Open-code components that compose freely in your project.", radius:"7px", height:"40px", weight:"500", shadow:"0 1px 2px rgba(0,0,0,.08)" },
  { id:"arco", name:"Arco Design", short:"Arco", domain:"arco.design", docs:"https://arco.design/react/components/overview", metaZh:"React · 企业后台", metaEn:"React · Enterprise", descZh:"高密度中后台，表格、筛选和数据录入完整。", descEn:"Dense enterprise patterns for tables, filters and data entry.", radius:"2px", height:"34px", weight:"500", shadow:"none" },
  { id:"semi", name:"Semi Design", short:"Semi", domain:"semi.design", docs:"https://semi.design/zh-CN/start/overview", docsEn:"https://semi.design/en-US/start/overview", metaZh:"React · 80+ 组件", metaEn:"React · 80+ components", descZh:"覆盖 AI、数据展示、表单和复杂桌面交互。", descEn:"Broad desktop coverage across AI, data and forms.", radius:"8px", height:"40px", weight:"600", shadow:"none" },
  { id:"tdesign", name:"TDesign", short:"TD", domain:"tdesign.tencent.com", docs:"https://tdesign.tencent.com/react/overview", metaZh:"React · 腾讯企业级", metaEn:"React · Tencent enterprise", descZh:"组件状态和中文业务场景规范完整。", descEn:"Comprehensive states and enterprise product patterns.", radius:"4px", height:"34px", weight:"500", shadow:"none" },
  { id:"mui", name:"Material UI", short:"MUI", domain:"mui.com", docs:"https://mui.com/material-ui/all-components/", metaZh:"React · Material", metaEn:"React · Material", descZh:"生产级 React 组件，主题、行为和无障碍成熟。", descEn:"Production React components with mature theming and accessibility.", radius:"4px", height:"42px", weight:"600", shadow:"0 2px 5px rgba(0,0,0,.18)" },
  { id:"element", name:"Element Plus", short:"EP", domain:"element-plus.org", docs:"https://element-plus.org/en-US/component/overview", metaZh:"Vue 3 · 企业后台", metaEn:"Vue 3 · Enterprise", descZh:"Vue 3 表单、数据、导航与反馈组件覆盖全面。", descEn:"Vue 3 coverage for forms, data, navigation and feedback.", radius:"4px", height:"40px", weight:"500", shadow:"none" },
  { id:"radix", name:"Radix UI", short:"Rx", domain:"radix-ui.com", docs:"https://www.radix-ui.com/primitives/docs/components", metaZh:"React · 无样式原语", metaEn:"React · Unstyled primitives", descZh:"无样式、可访问的交互原语，视觉自由度最高。", descEn:"Accessible unstyled primitives with maximum visual freedom.", radius:"6px", height:"36px", weight:"500", shadow:"none" },
];

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const isEn = () => document.documentElement.lang.startsWith("en") || window.image2I18n?.language === "en";
const t = (zh, en) => isEn() ? en : zh;
const byId = (id) => SYSTEMS.find((item) => item.id === id) || SYSTEMS[0];
const docsFor = (item) => isEn() && item.docsEn ? item.docsEn : item.docs;
const logoFor = (item) => `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(`https://${item.domain}`)}&sz=128`;
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));

let current = byId(localStorage.getItem(STORAGE_KEY) || "antd");
let field;
let trigger;
let menu;
let promptObserver;
let summaryObserver;

function fieldMarkup() {
  return `<fieldset class="cs-field" data-component-system-field>
    <legend>${t("组件规范", "Component system")}</legend>
    <button class="cs-trigger" type="button" aria-expanded="false" data-cs-trigger>
      <span class="cs-logo"><img alt="" loading="lazy"><b aria-hidden="true"></b></span>
      <span class="cs-trigger-copy"><strong></strong><small></small></span>
      <span class="cs-trigger-arrow" aria-hidden="true"></span>
    </button>
    <div class="cs-menu" data-cs-menu hidden>
      <div class="cs-menu-head"><strong>${t("选择组件规范", "Choose component system")}</strong><span>8</span></div>
      <div class="cs-list" data-cs-list role="radiogroup"></div>
    </div>
    <div class="cs-live">
      <div class="cs-live-head"><a target="_blank" rel="noopener noreferrer" data-cs-docs>${t("查看官方组件 ↗", "Official components ↗")}</a></div>
      <div class="cs-live-row">
        <button class="cs-demo-button" type="button">${t("主按钮", "Primary")}</button>
        <label class="cs-demo-input"><span>${t("输入框", "Input")}</span><input type="text" value="ONDesign" aria-label="Component input preview"></label>
        <span class="cs-demo-tag">${t("标签", "Tag")}</span>
        <label class="cs-demo-switch" aria-label="Switch preview"><input type="checkbox" checked><i></i></label>
      </div>
    </div>
    <p class="cs-note">${t("组件规范负责组件结构、状态与交互；颜色和字体继续跟随上方视觉规范。", "The component system controls structure, states and interaction; color and typography continue to follow the visual system.")}</p>
  </fieldset>`;
}

function ensureField() {
  const visual = $("[data-design-system-field]");
  if (!visual) return false;
  visual.classList.add("visual-system-field");
  const visualLegend = $("legend", visual);
  if (visualLegend) visualLegend.textContent = t("视觉规范", "Visual system");
  const rulesDesc = $('[data-i18n="dna.rulesDesc"]');
  if (rulesDesc) rulesDesc.textContent = t("视觉规范 + 组件规范，再微调字体、圆角与间距。", "Visual system + component system, then fine-tune typography, radius and spacing.");
  if (!$("[data-component-system-field]")) visual.insertAdjacentHTML("afterend", fieldMarkup());
  field = $("[data-component-system-field]");
  trigger = $("[data-cs-trigger]", field);
  menu = $("[data-cs-menu]", field);
  return Boolean(field && trigger && menu);
}

function optionMarkup(item) {
  const selected = item.id === current.id;
  return `<div class="cs-option${selected ? " is-selected" : ""}" role="radio" aria-checked="${selected}">
    <button class="cs-option-select" type="button" data-cs-select="${esc(item.id)}">
      <span class="cs-logo"><img src="${esc(logoFor(item))}" alt="${esc(item.name)} logo" loading="lazy"><b>${esc(item.short)}</b></span>
      <span class="cs-option-copy"><strong>${esc(item.name)}</strong><small>${esc(isEn()?item.metaEn:item.metaZh)}</small><em>${esc(isEn()?item.descEn:item.descZh)}</em></span>
      <span class="cs-option-check">✓</span>
    </button>
    <a class="cs-option-docs" href="${esc(docsFor(item))}" target="_blank" rel="noopener noreferrer">${t("官方组件", "Docs")} ↗</a>
  </div>`;
}

function renderOptions() {
  const list = $("[data-cs-list]", field);
  if (!list) return;
  list.innerHTML = SYSTEMS.map(optionMarkup).join("");
  $$('[data-cs-select]', list).forEach((button) => button.addEventListener("click", () => select(button.dataset.csSelect)));
  $$(".cs-logo img", list).forEach((img) => img.addEventListener("error", () => img.closest(".cs-logo")?.classList.add("is-fallback"), { once:true }));
}

function applySystem() {
  const root = document.documentElement;
  root.style.setProperty("--cs-radius", current.radius);
  root.style.setProperty("--cs-control-height", current.height);
  root.style.setProperty("--cs-font-weight", current.weight);
  root.style.setProperty("--cs-shadow", current.shadow);
  document.body.dataset.componentSystem = current.id;
}

function updateField() {
  if (!field) return;
  $("legend", field).textContent = t("组件规范", "Component system");
  $(".cs-trigger strong", field).textContent = current.name;
  $(".cs-trigger small", field).textContent = `${isEn()?current.metaEn:current.metaZh} · ${t("结构 / 状态 / 交互", "structure / states / interaction")}`;
  const image = $(".cs-trigger .cs-logo img", field);
  const logo = image.closest(".cs-logo");
  image.src = logoFor(current);
  image.alt = `${current.name} logo`;
  $(".cs-trigger .cs-logo b", field).textContent = current.short;
  logo.classList.remove("is-fallback");
  image.addEventListener("error", () => logo.classList.add("is-fallback"), { once:true });
  const docs = $("[data-cs-docs]", field);
  docs.href = docsFor(current);
  docs.textContent = t("查看官方组件 ↗", "Official components ↗");
  $(".cs-demo-button", field).textContent = t("主按钮", "Primary");
  $(".cs-demo-input span", field).textContent = t("输入框", "Input");
  $(".cs-demo-tag", field).textContent = t("标签", "Tag");
  $(".cs-note", field).textContent = t("组件规范负责组件结构、状态与交互；颜色和字体继续跟随上方视觉规范。", "The component system controls structure, states and interaction; color and typography continue to follow the visual system.");
  renderOptions();
}

function showComponentPreview() {
  const picker = $("[data-preview-picker]");
  if (!picker) return;
  if (picker.value !== "form") {
    picker.value = "form";
    picker.dispatchEvent(new Event("change", { bubbles:true }));
  }
  const browser = $("[data-preview-browser]");
  browser?.classList.remove("is-component-system-changing");
  requestAnimationFrame(() => browser?.classList.add("is-component-system-changing"));
}

function componentPromptLines() {
  return isEn() ? [
    `Component system: ${current.name}`,
    `Component docs: ${docsFor(current)}`,
    `Component rule: follow ${current.name} for structure, variants, states, interaction and accessibility.`,
  ] : [
    `组件规范：${current.name}`,
    `组件文档：${docsFor(current)}`,
    `组件要求：组件结构、变体、状态、交互与可访问性优先遵循 ${current.name}。`,
  ];
}

function decoratePrompt() {
  const node = $("#dnaPrompt");
  if (!node) return;
  const prefixes = ["组件规范：","组件文档：","组件要求：","Component system:","Component docs:","Component rule:"];
  let lines = node.textContent.split("\n").filter((line) => !prefixes.some((prefix) => line.startsWith(prefix)));
  lines = lines.map((line) => line.startsWith("设计规范：") ? line.replace("设计规范：", "视觉规范：") : line.startsWith("Design system:") ? line.replace("Design system:", "Visual system:") : line);
  let index = lines.findIndex((line) => line.startsWith("视觉规范：") || line.startsWith("Visual system:"));
  if (index < 0) index = Math.min(1, lines.length - 1);
  lines.splice(index + 1, 0, ...componentPromptLines());
  const next = lines.join("\n");
  if (node.textContent !== next) node.textContent = next;
}

function decorateSummary() {
  const summary = $("#dnaSummary");
  if (!summary) return;
  const first = $("dt", summary);
  if (first && ["设计规范", "Design system"].includes(first.textContent)) first.textContent = t("视觉规范", "Visual system");
  let row = $("[data-component-system-summary]", summary);
  if (!row) {
    row = document.createElement("div");
    row.dataset.componentSystemSummary = "true";
    row.innerHTML = `<dt></dt><dd></dd>`;
    summary.insertBefore(row, summary.children[1] || null);
  }
  $("dt", row).textContent = t("组件规范", "Component system");
  $("dd", row).textContent = current.name;
}

function select(id, { preview=true } = {}) {
  current = byId(id);
  localStorage.setItem(STORAGE_KEY, current.id);
  applySystem();
  updateField();
  menu.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
  decoratePrompt();
  decorateSummary();
  if (preview) showComponentPreview();
  window.dispatchEvent(new CustomEvent("ondesign:componentsystemchange", { detail:{ id:current.id, name:current.name, docs:docsFor(current) } }));
}

function observeGeneratedOutput() {
  const prompt = $("#dnaPrompt");
  const summary = $("#dnaSummary");
  if (prompt) {
    promptObserver?.disconnect();
    promptObserver = new MutationObserver(() => { promptObserver.disconnect(); decoratePrompt(); promptObserver.observe(prompt, { childList:true, subtree:true, characterData:true }); });
    promptObserver.observe(prompt, { childList:true, subtree:true, characterData:true });
  }
  if (summary) {
    summaryObserver?.disconnect();
    summaryObserver = new MutationObserver(() => { summaryObserver.disconnect(); decorateSummary(); summaryObserver.observe(summary, { childList:true, subtree:true, characterData:true }); });
    summaryObserver.observe(summary, { childList:true, subtree:true, characterData:true });
  }
}

function bind() {
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = menu.hidden;
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (open) renderOptions();
  });
  document.addEventListener("click", (event) => {
    if (!field.contains(event.target)) {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }
  });
  window.addEventListener("image2:languagechange", () => { ensureField(); updateField(); decoratePrompt(); decorateSummary(); });
}

function init() {
  if (!ensureField()) return;
  bind();
  select(current.id, { preview:false });
  observeGeneratedOutput();
  decoratePrompt();
  decorateSummary();
}

init();
