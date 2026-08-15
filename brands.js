<<<<<<< HEAD
import { brandReferences, changeIntensities, devices, findBrandReference, findChangeIntensity, findDevice, findSystem, findTemplate, findTheme, systems, templates, themes } from "./lab/lab-data.js";

const $ = (selector) => document.querySelector(selector);
const storageKey = "image2-ui-current-project";
const defaults = { name:"Atlas Dashboard", template:"dashboard", system:"ant", brand:"linear", theme:"minimal-tech", intensity:"standard", device:"desktop", appearance:"light", view:"single", compare:["ant","material","apple"] };
const state = readState();
let frameObserver;
let previewLoadObserver;
let toastTimer;

initialize();

function initialize(){
  fillSelect("#templateSelect", templates);
  fillSelect("#systemSelect", systems);
  fillSelect("#brandSelect", brandReferences);
  fillSelect("#themeSelect", themes);
  $("#intensityOptions").innerHTML = changeIntensities.map(item=>`<button type="button" data-intensity="${item.id}" title="${escapeHtml(item.description)}">${item.name}</button>`).join("");
  $("#deviceOptions").innerHTML = devices.map(item=>`<button type="button" data-device="${item.id}">${item.name}</button>`).join("");
  $("#appearanceOptions").innerHTML = `<button type="button" data-appearance="light">Light</button><button type="button" data-appearance="dark">Dark</button>`;
  $("#compareSystems").innerHTML = systems.slice(0,7).map(item=>`<button type="button" data-compare-system="${item.id}">${item.shortName}</button>`).join("");
  bindEvents(); syncControls(); render(); persist(); writeUrl();
}

function readState(){
  let stored={}; try{stored=JSON.parse(localStorage.getItem(storageKey)||"{}")||{};}catch{}
  const url=new URL(location.href); const compare=url.searchParams.get("compare")?.split(",").filter(Boolean);
  return { ...defaults, ...stored, ...Object.fromEntries(["template","system","brand","theme","intensity","device","appearance","view"].map(key=>[key,url.searchParams.get(key)]).filter(([,value])=>value)), compare:compare?.length?compare:(stored.compare||defaults.compare) };
}

function bindEvents(){
  ["template","system","brand","theme"].forEach(key=>$("#"+key+"Select").addEventListener("change",event=>{state[key]=event.target.value; update(true);}));
  $("#projectName").addEventListener("change",event=>{state.name=event.target.value.trim()||defaults.name;update(true);});
  document.addEventListener("click",event=>{
    const intensity=event.target.closest("[data-intensity]"); if(intensity){state.intensity=intensity.dataset.intensity;update(true);return;}
    const device=event.target.closest("[data-device]"); if(device){state.device=device.dataset.device;update(true);return;}
    const appearance=event.target.closest("[data-appearance]"); if(appearance){state.appearance=appearance.dataset.appearance;update(true);return;}
    const view=event.target.closest("[data-view]"); if(view){state.view=view.dataset.view;update(false);return;}
    const compare=event.target.closest("[data-compare-system]"); if(compare){toggleCompare(compare.dataset.compareSystem);return;}
    const quick=event.target.closest("[data-theme-quick]"); if(quick){state.theme=quick.dataset.themeQuick;update(true);showToast(`已应用 ${findTheme(state.theme).name}`);return;}
    const explain=event.target.closest("[data-explain]"); if(explain)openExplanation(explain.dataset.explain);
  });
  $("#saveProject").addEventListener("click",()=>{persist();showToast("当前设计项目已保存");});
  $("#generateDemo").addEventListener("click",()=>{persist();const url=previewUrl(state.system);window.open(url,"_blank","noopener");showToast("已生成可点击 Demo");});
  addEventListener("resize",fitFrames);
}

function fillSelect(selector,items){$(selector).innerHTML=items.map(item=>`<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("");}
function syncControls(){
  $("#projectName").value=state.name;
  ["template","system","brand","theme"].forEach(key=>$("#"+key+"Select").value=state[key]);
  document.querySelectorAll("[data-intensity]").forEach(button=>button.classList.toggle("is-active",button.dataset.intensity===state.intensity));
  document.querySelectorAll("[data-device]").forEach(button=>button.classList.toggle("is-active",button.dataset.device===state.device));
  document.querySelectorAll("[data-appearance]").forEach(button=>button.classList.toggle("is-active",button.dataset.appearance===state.appearance));
  document.querySelectorAll("[data-view]").forEach(button=>button.classList.toggle("is-active",button.dataset.view===state.view));
  document.querySelectorAll("[data-compare-system]").forEach(button=>button.classList.toggle("is-selected",state.compare.includes(button.dataset.compareSystem)));
}

function update(save){syncControls();if(save)persist();writeUrl();render();}
function persist(){state.lastStep="brands";try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{} window.dispatchEvent(new CustomEvent("image2:projectchange",{detail:{...state}}));}
function writeUrl(){const url=new URL(location.href);["template","system","brand","theme","intensity","device","appearance","view"].forEach(key=>url.searchParams.set(key,state[key]));url.searchParams.set("compare",state.compare.join(","));history.replaceState({...state},"",url);}

function render(){
  const template=findTemplate(state.template), system=findSystem(state.system), brand=findBrandReference(state.brand), theme=findTheme(state.theme), intensity=findChangeIntensity(state.intensity), device=findDevice(state.device);
  $("#systemHelp").textContent=system.id==="apple"?"Apple HIG 风格实现，并非官方 Web 组件库":"决定组件、状态与交互规范";
  $("#selectionSentence").textContent=`${template.name} + ${system.name} + ${brand.name} 品牌参考 + ${theme.name} / ${device.name} / ${intensity.name}改造`;
  $("#comparePicker").hidden=state.view!=="compare";
  $("#differencePanel").hidden=state.view!=="differences";
  $("#previewStage").hidden=state.view==="differences";
  renderProjectOrigin(); renderPreview(); renderDifferences(); renderSummary();
}

function renderProjectOrigin(){
  const origin=$("#projectOrigin");
  const hasTaskCase=state.taskReferenceMode==="case"&&Boolean(state.taskReferenceCaseId);
  const libraryUrl=new URL("./library.html",location.href);
  if(hasTaskCase)libraryUrl.searchParams.set("case",state.taskReferenceCaseId);
  const taskUrl=new URL("./launcher.html",location.href);
  taskUrl.searchParams.set("intent",state.taskIntent||"create");
  if(hasTaskCase){taskUrl.searchParams.set("source","library");taskUrl.searchParams.set("case",state.taskReferenceCaseId);}
  const source=hasTaskCase
    ? `${state.taskReferenceCaseName||state.taskReferenceCaseId}${state.taskReferenceCaseStyle?` / ${state.taskReferenceCaseStyle}`:""}`
    : state.taskReferenceMode==="upload"
      ? "本次任务使用本地图片"
      : state.taskReferenceMode==="none"
        ? "本次任务不使用参考"
        : "尚未选择任务参考";
  const localize=value=>window.image2I18n?.localizeUrl?.(value)||value;
  origin.innerHTML=`<span>任务参考</span><strong>${escapeHtml(source)}</strong><div><a href="${localize(libraryUrl.href)}">${hasTaskCase?"查看任务案例":"选择案例"}</a><a href="${localize(taskUrl.href)}">${state.taskIntent?"调整任务":"定义任务"}</a></div>`;
}

function renderPreview(){
  frameObserver?.disconnect();
  previewLoadObserver?.disconnect();
  const stage=$("#previewStage"); const device=findDevice(state.device); const ids=state.view==="compare"?state.compare.slice(0,3):[state.system];
  stage.className=`preview-stage is-${state.view} device-${state.device}`;
  stage.innerHTML=ids.map((id,index)=>{const system=findSystem(id);return `<article class="preview-column"><header><div><strong>${escapeHtml(system.name)}</strong><span>${escapeHtml(findBrandReference(state.brand).name)} · ${escapeHtml(findTheme(state.theme).name)}</span></div><b>${escapeHtml(system.tokens.controlHeight)}</b></header><div class="device-frame" data-width="${device.width}" data-height="${device.height}" style="--preview-width:${device.width}px;--preview-height:${device.height}px"><iframe title="${escapeHtml(system.name)} ${escapeHtml(findTemplate(state.template).name)}预览" loading="${index===0?"eager":"lazy"}" data-preview-src="${escapeHtml(previewUrl(id))}" srcdoc="<!doctype html><meta charset='utf-8'><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f9f6;color:#657067;font:600 14px system-ui}span:after{content:'…';animation:dots 1.2s steps(4,end) infinite}@keyframes dots{0%{content:''}25%{content:'.'}50%{content:'..'}75%,100%{content:'...'}}</style><span>正在加载预览</span>"></iframe></div></article>`;}).join("");
  fitFrames(); frameObserver=new ResizeObserver(fitFrames);stage.querySelectorAll(".device-frame").forEach(frame=>frameObserver.observe(frame));
  observePreviewFrames();
}

function observePreviewFrames(){
  const frames=[...document.querySelectorAll("iframe[data-preview-src]")];
  const load=frame=>{if(!frame.dataset.previewSrc)return;frame.src=frame.dataset.previewSrc;delete frame.dataset.previewSrc;previewLoadObserver?.unobserve(frame);};
  if(frames[0])load(frames[0]);
  if(!("IntersectionObserver" in window)){frames.forEach(load);return;}
  previewLoadObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)load(entry.target);}),{rootMargin:"320px 0px"});
  frames.slice(1).forEach(frame=>previewLoadObserver.observe(frame));
  window.setTimeout(()=>frames.forEach(frame=>{if(frame.dataset.previewSrc&&document.visibilityState!=="hidden")load(frame);}),900);
}

function fitFrames(){document.querySelectorAll(".device-frame").forEach(frame=>{const width=Number(frame.dataset.width),height=Number(frame.dataset.height);const scale=Math.min(1,frame.clientWidth/width);frame.style.setProperty("--preview-scale",scale);const border=parseFloat(getComputedStyle(frame).borderTopWidth)*2;frame.style.height=`${Math.round(height*scale+border)}px`;});}
function previewUrl(systemId){const url=new URL("./lab/preview.html",location.href);Object.entries({...state,system:systemId}).forEach(([key,value])=>{if(!Array.isArray(value))url.searchParams.set(key,value)});return url.href;}

function toggleCompare(id){
  if(state.compare.includes(id)){if(state.compare.length<=2){showToast("对比模式至少保留 2 个系统");return;}state.compare=state.compare.filter(item=>item!==id);}else{if(state.compare.length>=3){showToast("一次最多比较 3 个系统");return;}state.compare=[...state.compare,id];}
  update(false);
}

function renderDifferences(){
  const ids=(state.compare.length>=2?state.compare:[state.system,"material"]).slice(0,3).map(findSystem); const rows=[["字体与语气",...ids.map(s=>s.id==="apple"?"系统字体 / 内容优先":s.id==="material"?"Roboto 倾向 / 清晰分层":"中性无衬线 / 效率优先")],["圆角",...ids.map(s=>`${s.tokens.radiusControl} 控件 · ${s.tokens.radiusPanel} 面板`)],["按钮高度",...ids.map(s=>s.tokens.controlHeight)],["间距基准",...ids.map(s=>s.tokens.spacing)],["焦点反馈",...ids.map(s=>s.tokens.focus)],["卡片结构",...ids.map(s=>s.mapping.card)],["导航模式",...ids.map(s=>s.mapping.navigation)],["表单反馈",...ids.map(s=>s.mapping.notification)]];
  $("#differencePanel").innerHTML=`<table><thead><tr><th>差异项</th>${ids.map(s=>`<th>${escapeHtml(s.name)}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,index)=>`<td>${index?escapeHtml(cell):`<strong>${escapeHtml(cell)}</strong>`}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function renderSummary(){const system=findSystem(state.system),brand=findBrandReference(state.brand),theme=findTheme(state.theme),intensity=findChangeIntensity(state.intensity);const rows=[["组件规范",`${system.shortName} · ${system.tokens.controlHeight}`],["品牌语言",brand.description],["视觉氛围",theme.description],["改动边界",intensity.description]];$("#differenceSummary").innerHTML=rows.map(row=>`<div><dt>${row[0]}</dt><dd>${escapeHtml(row[1])}</dd></div>`).join("");}

const explainCopy={system:{kicker:"DESIGN SYSTEM",title:"设计系统不是视觉滤镜",body:"它定义组件结构、交互状态、间距规则和可访问性。切换系统后，按钮、输入框、卡片与导航会遵循不同的几何和反馈方式。",items:["Material 3：强调层级、状态与跨平台一致性","Ant Design：适合信息密集的企业级 Web 产品","Apple HIG：这里是风格实现，不是苹果官方 Web 组件"]},brand:{kicker:"BRAND REFERENCE",title:"品牌参考决定说话方式",body:"品牌参考用于提取气质、排版倾向与强调方式，不代表使用该品牌的官方组件或完整视觉资产。",items:["Linear：冷静、精确、效率优先","Stripe：技术可信度与明亮表达","Notion：中性、内容优先、自然工具感"]},theme:{kicker:"VISUAL THEME",title:"视觉主题决定页面氛围",body:"它控制色彩、材质、对比和装饰语言，可以与任何设计系统和品牌参考组合。",items:["Editorial：强调内容层级与留白","Glassmorphism：用半透明和模糊建立空间","Neo Brutalism：强对比、硬边框和直接表达"]}};
function openExplanation(id){const copy=explainCopy[id];if(!copy)return;$("#explainContent").innerHTML=`<p class="eyebrow">${copy.kicker}</p><h2>${copy.title}</h2><p>${copy.body}</p><ul>${copy.items.map(item=>`<li>${item}</li>`).join("")}</ul>`;$("#explainDialog").showModal();}
function showToast(message){const toast=$("#toast");clearTimeout(toastTimer);toast.textContent=message;toast.hidden=false;toastTimer=setTimeout(()=>toast.hidden=true,1800);}
function escapeHtml(value){return String(value??"").replace(/[&<>\"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[char]);}
=======
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
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
