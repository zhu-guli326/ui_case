const STORAGE_KEY = "ondesign:component-system:v1";
const STYLE_HREF = "./src/features/launcher/launcher-component-systems.css";

const SYSTEMS = [
  ["antd","Ant Design","Ant","ant.design","https://ant.design/components/overview/","React · 企业级","React · Enterprise","成熟的企业级组件体系，表单、表格、反馈与复杂业务组件覆盖完整。","A mature enterprise component system with broad coverage for forms, tables, feedback and complex product UI.","6px","34px","500","none"],
  ["shadcn","shadcn/ui","sh","ui.shadcn.com","https://ui.shadcn.com/docs/components","React · Open Code","React · Open Code","组件源码直接进入项目，组合自由、可修改，尤其适合 AI Coding。","Open-code components that live in your project, ideal for composition and AI-assisted customization.","7px","36px","500","0 1px 2px rgba(0,0,0,.06)"],
  ["arco","Arco Design","Arco","arco.design","https://arco.design/react/components/overview","React · 企业后台","React · Enterprise","偏高密度中后台场景，表格、筛选与数据录入体验完整。","A dense enterprise system with strong table, filter and data-entry patterns.","3px","34px","500","none"],
  ["semi","Semi Design","Semi","semi.design","https://semi.design/zh-CN/start/overview","React · 80+ 组件","React · 80+ components","桌面端 React 组件丰富，并覆盖 AI、数据展示、表单和复杂交互。","A broad desktop React system spanning AI, data display, forms and advanced interactions.","6px","36px","600","none","https://semi.design/en-US/start/overview"],
  ["tdesign","TDesign","TD","tdesign.tencent.com","https://tdesign.tencent.com/react/overview","React · 腾讯企业级","React · Tencent enterprise","腾讯企业级设计体系，组件状态与业务场景规范完整，适合中文中后台产品。","Tencent's enterprise design system with comprehensive component states and business patterns.","4px","34px","500","none"],
  ["mui","Material UI","MUI","mui.com","https://mui.com/material-ui/all-components/","React · Material","React · Material","基于 Material Design 的生产级 React 组件库，主题、行为和无障碍体系成熟。","A production-ready React library implementing Material Design with mature theming and accessibility.","4px","36px","500","0 2px 5px rgba(0,0,0,.16)"],
  ["element","Element Plus","EP","element-plus.org","https://element-plus.org/en-US/component/overview","Vue 3 · 企业后台","Vue 3 · Enterprise","Vue 3 常用企业后台组件库，表单、数据、导航与反馈组件覆盖全面。","A widely used Vue 3 enterprise library covering forms, data, navigation and feedback.","4px","34px","500","none"],
  ["radix","Radix UI","Rx","radix-ui.com","https://www.radix-ui.com/primitives/docs/components","React · Unstyled Primitives","React · Unstyled primitives","无样式、可访问的底层组件原语，保留视觉自由度同时继承可靠交互。","Unstyled accessible primitives that keep visual freedom while providing reliable interaction behavior.","4px","34px","500","none"],
].map(([id,name,short,domain,docs,stackZh,stackEn,descZh,descEn,radius,height,weight,shadow,docsEn]) => ({ id,name,short,domain,docs,stackZh,stackEn,descZh,descEn,radius,height,weight,shadow,docsEn }));

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const en = () => document.documentElement.lang.startsWith("en") || window.image2I18n?.language === "en";
const t = (zh, english) => en() ? english : zh;
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId = (id) => SYSTEMS.find(x => x.id === id) || SYSTEMS[0];
const docs = (s) => en() && s.docsEn ? s.docsEn : s.docs;
const logo = (s) => `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(`https://${s.domain}`)}&sz=128`;

let current = SYSTEMS[0];
let field;
let trigger;
let menu;
let promptObserver;
let summaryObserver;

function addStyles() {
  if ($(`link[href="${STYLE_HREF}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = STYLE_HREF;
  document.head.append(link);
}

function syncVisualCopy() {
  const visual = $("[data-design-system-field]");
  if (!visual) return;
  visual.classList.add("visual-system-field");
  const legend = $("legend", visual);
  const note = $(".ds-note", visual);
  const search = $(".ds-search", visual);
  const strong = $("[data-ds-trigger] strong", visual);
  const small = $("[data-ds-trigger] small", visual);
  const rulesDesc = $('[data-i18n="dna.rulesDesc"]');
  const inheritedFont = $('option[value="__design-system__"]');

  if (legend) legend.textContent = t("视觉规范", "Visual system");
  if (rulesDesc) rulesDesc.textContent = t("视觉规范、组件规范、字体、圆角与间距。", "Visual system, component system, typography, radius and spacing.");
  if (search) search.setAttribute("aria-label", t("搜索视觉规范", "Search visual systems"));
  if (strong && !document.body.dataset.designSystem) strong.textContent = t("选择视觉规范", "Choose a visual system");
  if (small && !document.body.dataset.designSystem) small.textContent = t("从真实产品与品牌中提取可复用的视觉语言", "Reuse visual language extracted from real products and brands");
  if (note) note.textContent = t("视觉规范负责颜色、字体、圆角、间距和整体气质；选择后仍可继续微调。来源：VoltAgent/awesome-design-md（MIT）。", "The visual system controls color, typography, radius, spacing and overall character, while remaining editable. Source: VoltAgent/awesome-design-md (MIT).");
  if (inheritedFont) inheritedFont.textContent = `${t("视觉规范", "Visual system")} · ${inheritedFont.textContent.split("·").slice(1).join("·").trim()}`;
}

function fieldHtml() {
  return `<fieldset class="cs-field" data-component-system-field>
    <legend>${t("组件规范", "Component system")}</legend>
    <button class="cs-trigger" type="button" aria-expanded="false" data-cs-trigger>
      <span class="cs-logo"><img alt="" loading="lazy"><b aria-hidden="true"></b></span>
      <span class="cs-trigger-copy"><strong></strong><small></small></span><span class="cs-trigger-arrow" aria-hidden="true"></span>
    </button>
    <div class="cs-menu" data-cs-menu hidden><div class="cs-menu-head"><strong>${t("选择组件骨架与交互规则", "Choose component structure and interaction rules")}</strong><span>8</span></div><div class="cs-list" data-cs-list role="radiogroup"></div></div>
    <div class="cs-live"><div class="cs-live-head"><span>${t("组件效果", "Component preview")}</span><a target="_blank" rel="noopener noreferrer" data-cs-docs>${t("查看官方组件 ↗", "Official components ↗")}</a></div>
      <div class="cs-live-row"><button class="cs-demo-button" type="button">${t("主按钮", "Primary")}</button><label class="cs-demo-input"><span>${t("输入框", "Input")}</span><input type="text" value="ONDesign" aria-label="Component input preview"></label><span class="cs-demo-tag">${t("标签", "Tag")}</span><label class="cs-demo-switch" aria-label="Switch preview"><input type="checkbox" checked><i></i></label></div>
    </div>
    <p class="cs-note">${t("组件规范决定组件结构、状态与交互；颜色、字体和整体视觉仍跟随上方视觉规范。", "The component system defines structure, states and interaction; color, typography and overall visual character still follow the visual system above.")}</p>
  </fieldset>`;
}

function optionHtml(s) {
  return `<div class="cs-option${current.id===s.id?" is-selected":""}" role="radio" aria-checked="${current.id===s.id}">
    <button class="cs-option-select" type="button" data-cs-select="${esc(s.id)}"><span class="cs-logo"><img src="${esc(logo(s))}" alt="${esc(s.name)} logo" loading="lazy"><b>${esc(s.short)}</b></span><span class="cs-option-copy"><strong>${esc(s.name)}</strong><small>${esc(en()?s.stackEn:s.stackZh)}</small><em>${esc(en()?s.descEn:s.descZh)}</em></span><span class="cs-option-check">✓</span></button>
    <a class="cs-option-docs" href="${esc(docs(s))}" target="_blank" rel="noopener noreferrer">${t("官方组件", "Docs")} ↗</a>
  </div>`;
}

function renderOptions() {
  const list = $("[data-cs-list]", field);
  if (!list) return;
  list.innerHTML = SYSTEMS.map(optionHtml).join("");
  $$('[data-cs-select]', list).forEach(btn => btn.addEventListener("click", () => select(btn.dataset.csSelect)));
  $$(".cs-logo img", list).forEach(img => img.addEventListener("error", () => img.closest(".cs-logo")?.classList.add("is-fallback"), { once:true }));
}

function applyTokens() {
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
  $(".cs-trigger small", field).textContent = `${en()?current.stackEn:current.stackZh} · ${t("组件结构 / 状态 / 交互", "structure / states / interaction")}`;
  const img = $(".cs-trigger .cs-logo img", field);
  img.src = logo(current);
  img.alt = `${current.name} logo`;
  img.closest(".cs-logo")?.classList.remove("is-fallback");
  $(".cs-trigger .cs-logo b", field).textContent = current.short;
  $("[data-cs-docs]", field).href = docs(current);
  $(".cs-live-head span", field).textContent = t("组件效果", "Component preview");
  $("[data-cs-docs]", field).textContent = t("查看官方组件 ↗", "Official components ↗");
  $(".cs-demo-button", field).textContent = t("主按钮", "Primary");
  $(".cs-demo-input span", field).textContent = t("输入框", "Input");
  $(".cs-demo-tag", field).textContent = t("标签", "Tag");
  $(".cs-note", field).textContent = t("组件规范决定组件结构、状态与交互；颜色、字体和整体视觉仍跟随上方视觉规范。", "The component system defines structure, states and interaction; color, typography and overall visual character still follow the visual system above.");
  renderOptions();
}

function componentLines() {
  return en() ? [
    `Component system: ${current.name}`,
    `Component docs: ${docs(current)}`,
    `Component rule: use ${current.name} for component structure, variants, states, interaction and accessibility. Keep color, typography and brand expression controlled by the selected visual system.`,
  ] : [
    `组件规范：${current.name}`,
    `组件文档：${docs(current)}`,
    `组件要求：组件结构、变体、状态、交互与可访问性优先遵循 ${current.name}；颜色、字体与品牌视觉继续由所选视觉规范控制。`,
  ];
}

function decoratePrompt() {
  const node = $("#dnaPrompt");
  if (!node) return;
  const prefixes = ["组件规范：","组件文档：","组件要求：","Component system:","Component docs:","Component rule:"];
  let base = node.textContent.split("\n").filter(line => !prefixes.some(p => line.startsWith(p)));
  base = base.map(line => line.startsWith("设计规范：") ? line.replace("设计规范：","视觉规范：") : line.startsWith("Design system:") ? line.replace("Design system:","Visual system:") : line);
  let index = base.findIndex(line => line.startsWith("视觉规范：") || line.startsWith("Visual system:"));
  if (index < 0) index = Math.min(1, base.length - 1);
  base.splice(index + 1, 0, ...componentLines());
  const next = base.join("\n");
  if (node.textContent !== next) node.textContent = next;
}

function decorateSummary() {
  const summary = $("#dnaSummary");
  if (!summary) return;
  const firstTerm = $("dt", summary);
  if (firstTerm && (firstTerm.textContent === "设计规范" || firstTerm.textContent === "Design system")) firstTerm.textContent = t("视觉规范", "Visual system");
  let row = $("[data-component-system-summary]", summary);
  if (!row) {
    row = document.createElement("div");
    row.dataset.componentSystemSummary = "true";
    row.innerHTML = "<dt></dt><dd></dd>";
    const first = summary.firstElementChild;
    if (first?.nextSibling) summary.insertBefore(row, first.nextSibling); else summary.append(row);
  }
  const dt = $("dt", row), dd = $("dd", row);
  const term = t("组件规范", "Component system");
  if (dt.textContent !== term) dt.textContent = term;
  if (dd.textContent !== current.name) dd.textContent = current.name;
}

function installObservers() {
  const prompt = $("#dnaPrompt");
  if (prompt && !promptObserver) { promptObserver = new MutationObserver(decoratePrompt); promptObserver.observe(prompt,{childList:true,subtree:true,characterData:true}); }
  const summary = $("#dnaSummary");
  if (summary && !summaryObserver) { summaryObserver = new MutationObserver(decorateSummary); summaryObserver.observe(summary,{childList:true,subtree:true,characterData:true}); }
  decoratePrompt(); decorateSummary();
}

function toast(message) {
  const node = $("#dnaToast"); if (!node) return;
  node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => node.hidden = true, 2200);
}

function installCopyOverride() {
  const copy = $("#copyDna"); if (!copy || copy.dataset.componentCopyBound) return;
  copy.dataset.componentCopyBound = "true";
  copy.addEventListener("click", async event => {
    event.preventDefault(); event.stopImmediatePropagation(); decoratePrompt();
    try { await navigator.clipboard.writeText($("#dnaPrompt")?.textContent || componentLines().join("\n")); toast(t("提示词已复制", "Prompt copied")); }
    catch { toast(t("复制失败，请重试", "Copy failed, please retry")); }
  }, true);
}

function close() { if (menu && trigger) { menu.hidden = true; trigger.setAttribute("aria-expanded","false"); } }

function select(id, {silent=false}={}) {
  current = byId(id); applyTokens();
  try { localStorage.setItem(STORAGE_KEY,current.id); } catch {}
  updateField(); close(); decoratePrompt(); decorateSummary();
  if (!silent) { window.dispatchEvent(new CustomEvent("ondesign:componentsystemchange",{detail:{id:current.id,name:current.name,docs:docs(current)}})); toast(t(`组件规范已切换为 ${current.name}`,`Component system: ${current.name}`)); }
}

function initField() {
  const visual = $("[data-design-system-field]"); if (!visual) return;
  visual.insertAdjacentHTML("afterend", fieldHtml());
  field = $("[data-component-system-field]"); trigger = $("[data-cs-trigger]",field); menu = $("[data-cs-menu]",field);
  trigger.addEventListener("click", event => { event.stopPropagation(); const open = menu.hidden; menu.hidden = !open; trigger.setAttribute("aria-expanded",String(open)); });
  $(".cs-trigger .cs-logo img",field).addEventListener("error", event => event.currentTarget.closest(".cs-logo")?.classList.add("is-fallback"));
  document.addEventListener("click", event => { if (!event.target.closest("[data-component-system-field]")) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
}

function syncLanguage() { syncVisualCopy(); updateField(); decoratePrompt(); decorateSummary(); }

function init() {
  addStyles(); syncVisualCopy(); initField(); if (!field) return;
  let saved = ""; try { saved = localStorage.getItem(STORAGE_KEY) || ""; } catch {}
  select(saved || "antd",{silent:true}); installObservers(); installCopyOverride();
  window.addEventListener("image2:languagechange",syncLanguage);
  window.addEventListener("ondesign:designsystemapply",() => { syncVisualCopy(); decoratePrompt(); decorateSummary(); });
  window.addEventListener("ondesign:designsystemchange",() => { syncVisualCopy(); decoratePrompt(); decorateSummary(); });
  window.addEventListener("ondesign:fontchange",() => { decoratePrompt(); decorateSummary(); });
  window.ONDesignComponentSystems = { entries:SYSTEMS, select, current:() => current };
}

init();
