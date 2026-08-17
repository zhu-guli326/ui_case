import { brandReferences, changeIntensities, devices, findBrandReference, findChangeIntensity, findDevice, findSystem, findTemplate, findTheme, systems, templates, themes } from "./lab/lab-data.js";

const $ = (selector) => document.querySelector(selector);
const storageKey = "image2-ui-current-project";
const themeAliases = {
  "minimal-tech":"ant-design",
  "editorial-commerce":"adobe-spectrum",
  "soft-lifestyle":"apple-hig",
  "future-tech":"google-material-3",
  "neo-brutal":"tdesign",
  glass:"fluent-2",
  retro:"github-primer"
};
const defaults = { name:"Atlas Dashboard", template:"dashboard", system:"ant", brand:"linear", theme:"ant-design", intensity:"standard", device:"desktop", appearance:"light", view:"single", compare:["ant","material","apple"] };
const state = readState();
let frameObserver;
let previewLoadObserver;
let toastTimer;

initialize();

function normalizeTheme(value){
  const normalized=themeAliases[value]||value;
  return themes.some(item=>item.id===normalized)?normalized:defaults.theme;
}

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
  const incoming={ ...defaults, ...stored, ...Object.fromEntries(["template","system","brand","theme","intensity","device","appearance","view"].map(key=>[key,url.searchParams.get(key)]).filter(([,value])=>value)), compare:compare?.length?compare:(stored.compare||defaults.compare) };
  incoming.theme=normalizeTheme(incoming.theme);
  if(!templates.some(item=>item.id===incoming.template)) incoming.template=defaults.template;
  if(!systems.some(item=>item.id===incoming.system)) incoming.system=defaults.system;
  if(!brandReferences.some(item=>item.id===incoming.brand)) incoming.brand=defaults.brand;
  if(!changeIntensities.some(item=>item.id===incoming.intensity)) incoming.intensity=defaults.intensity;
  if(!devices.some(item=>item.id===incoming.device)) incoming.device=defaults.device;
  if(!["light","dark"].includes(incoming.appearance)) incoming.appearance=defaults.appearance;
  if(!["single","compare","differences"].includes(incoming.view)) incoming.view=defaults.view;
  incoming.compare=(incoming.compare||defaults.compare).filter(id=>systems.some(system=>system.id===id));
  if(incoming.compare.length<2) incoming.compare=["ant","material","apple"];
  return incoming;
}

function bindEvents(){
  ["template","system","brand","theme"].forEach(key=>$("#"+key+"Select").addEventListener("change",event=>{state[key]=key==="theme"?normalizeTheme(event.target.value):event.target.value; update(true);}));
  $("#projectName").addEventListener("change",event=>{state.name=event.target.value.trim()||defaults.name;update(true);});
  document.addEventListener("click",event=>{
    const intensity=event.target.closest("[data-intensity]"); if(intensity){state.intensity=intensity.dataset.intensity;update(true);return;}
    const device=event.target.closest("[data-device]"); if(device){state.device=device.dataset.device;update(true);return;}
    const appearance=event.target.closest("[data-appearance]"); if(appearance){state.appearance=appearance.dataset.appearance;update(true);return;}
    const view=event.target.closest("[data-view]"); if(view){state.view=view.dataset.view;update(false);return;}
    const compare=event.target.closest("[data-compare-system]"); if(compare){toggleCompare(compare.dataset.compareSystem);return;}
    const quick=event.target.closest("[data-theme-quick]"); if(quick){state.theme=normalizeTheme(quick.dataset.themeQuick);update(true);showToast(`已应用 ${findTheme(state.theme).name}`);return;}
    const explain=event.target.closest("[data-explain]"); if(explain)openExplanation(explain.dataset.explain);
  });
  $("#saveProject").addEventListener("click",()=>{persist();showToast("当前设计项目已保存");});
  $("#generateDemo").addEventListener("click",()=>{persist();const url=previewUrl(state.system);window.open(url,"_blank","noopener");showToast("已打开可点击 Demo");});
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
  $("#systemHelp").textContent=system.id==="apple"?"Apple HIG 的 Web 模拟预览，并非官方 Web 组件库":"决定组件、状态与交互规范";
  $("#selectionSentence").textContent=`${template.name} · ${system.name} · ${brand.name} 品牌参考 · ${theme.name} · ${device.name} · ${intensity.name}`;
  $("#comparePicker").hidden=state.view!=="compare";
  $("#differencePanel").hidden=state.view!=="differences";
  $("#previewStage").hidden=state.view==="differences";
  renderProjectOrigin(); renderOverview(template,system,brand,theme,intensity,device); renderPreview(); renderDifferences(); renderSummary();
}

function renderOverview(template,system,brand,theme,intensity,device){
  const colors=theme.colors||{};
  $("#selectionOverview").innerHTML=`
    <article><span>PAGE</span><strong>${escapeHtml(template.name)}</strong><small>${escapeHtml(template.description)}</small></article>
    <article><span>SYSTEM</span><strong>${escapeHtml(system.name)}</strong><small>${escapeHtml(system.tokens.controlHeight)} 控件 · ${escapeHtml(system.tokens.spacing)} 间距</small></article>
    <article><span>BRAND</span><strong>${escapeHtml(brand.name)}</strong><small>${escapeHtml(brand.description)}</small></article>
    <article class="theme-overview"><span>COLOR</span><strong>${escapeHtml(theme.name)}</strong><div class="theme-swatches" aria-label="当前配色"><i style="--swatch:${escapeHtml(colors.accent||'#168143')}"></i><i style="--swatch:${escapeHtml(colors.surface||'#ffffff')}"></i><i style="--swatch:${escapeHtml(colors.canvas||'#f2f4ef')}"></i><i style="--swatch:${escapeHtml(colors.ink||'#151816')}"></i></div><small>${escapeHtml(device.name)} · ${escapeHtml(intensity.name)}改造</small></article>`;
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
  stage.innerHTML=ids.map((id,index)=>{const system=findSystem(id);return `<article class="preview-column"><header><div><strong>${escapeHtml(system.name)}</strong><span>${escapeHtml(findBrandReference(state.brand).name)} · ${escapeHtml(findTheme(state.theme).name)}</span></div><b>${escapeHtml(system.tokens.controlHeight)}</b></header><div class="device-frame" data-width="${device.width}" data-height="${device.height}" style="--preview-width:${device.width}px;--preview-height:${device.height}px"><iframe title="${escapeHtml(system.name)} ${escapeHtml(findTemplate(state.template).name)}预览" loading="${index===0?"eager":"lazy"}" data-preview-src="${escapeHtml(previewUrl(id))}" srcdoc="<!doctype html><meta charset='utf-8'><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f9f6;color:#657067;font:600 14px system-ui}.loader{display:grid;gap:12px;text-align:center}.bar{width:120px;height:4px;background:#e4e8e2;overflow:hidden}.bar:after{display:block;width:45%;height:100%;background:#168143;content:'';animation:load 1s ease-in-out infinite alternate}@keyframes load{to{transform:translateX(122px)}}</style><div class='loader'><span>正在生成页面预览</span><div class='bar'></div></div>"></iframe></div></article>`;}).join("");
  fitFrames(); frameObserver=new ResizeObserver(fitFrames);stage.querySelectorAll(".device-frame").forEach(frame=>frameObserver.observe(frame));
  observePreviewFrames();
}

function observePreviewFrames(){
  const frames=[...document.querySelectorAll("iframe[data-preview-src]")];
  const load=frame=>{
    if(!frame.dataset.previewSrc)return;
    const src=frame.dataset.previewSrc;
    frame.removeAttribute("srcdoc");
    frame.src=src;
    delete frame.dataset.previewSrc;
    previewLoadObserver?.unobserve(frame);
  };
  if(frames[0])load(frames[0]);
  if(!("IntersectionObserver" in window)){frames.forEach(load);return;}
  previewLoadObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)load(entry.target);}),{rootMargin:"320px 0px"});
  frames.slice(1).forEach(frame=>previewLoadObserver.observe(frame));
  window.setTimeout(()=>frames.forEach(frame=>{if(frame.dataset.previewSrc&&document.visibilityState!=="hidden")load(frame);}),700);
}

function fitFrames(){document.querySelectorAll(".device-frame").forEach(frame=>{const width=Number(frame.dataset.width),height=Number(frame.dataset.height);const scale=Math.min(1,frame.clientWidth/width);frame.style.setProperty("--preview-scale",scale);const border=parseFloat(getComputedStyle(frame).borderTopWidth)*2;frame.style.height=`${Math.round(height*scale+border)}px`;});}
function previewUrl(systemId){const url=new URL("./lab/preview.html",location.href);Object.entries({...state,system:systemId}).forEach(([key,value])=>{if(!Array.isArray(value))url.searchParams.set(key,value)});url.searchParams.set("theme",normalizeTheme(state.theme));return url.href;}

function toggleCompare(id){
  if(state.compare.includes(id)){if(state.compare.length<=2){showToast("对比模式至少保留 2 个系统");return;}state.compare=state.compare.filter(item=>item!==id);}else{if(state.compare.length>=3){showToast("一次最多比较 3 个系统");return;}state.compare=[...state.compare,id];}
  update(false);
}

function renderDifferences(){
  const ids=(state.compare.length>=2?state.compare:[state.system,"material"]).slice(0,3).map(findSystem); const rows=[["字体与语气",...ids.map(s=>s.id==="apple"?"系统字体 / 内容优先":s.id==="material"?"Roboto 倾向 / 清晰分层":"中性无衬线 / 效率优先")],["圆角",...ids.map(s=>`${s.tokens.radiusControl} 控件 · ${s.tokens.radiusPanel} 面板`)],["按钮高度",...ids.map(s=>s.tokens.controlHeight)],["间距基准",...ids.map(s=>s.tokens.spacing)],["焦点反馈",...ids.map(s=>s.tokens.focus)],["卡片结构",...ids.map(s=>s.mapping.card)],["导航模式",...ids.map(s=>s.mapping.navigation)],["反馈模式",...ids.map(s=>s.mapping.notification)]];
  $("#differencePanel").innerHTML=`<table><thead><tr><th>差异项</th>${ids.map(s=>`<th>${escapeHtml(s.name)}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,index)=>`<td>${index?escapeHtml(cell):`<strong>${escapeHtml(cell)}</strong>`}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function renderSummary(){const system=findSystem(state.system),brand=findBrandReference(state.brand),theme=findTheme(state.theme),intensity=findChangeIntensity(state.intensity);const rows=[["组件规范",`${system.shortName} · ${system.tokens.controlHeight} · ${system.tokens.radiusControl}`],["品牌表达",brand.description],["配色与表面",theme.description],["改造边界",intensity.description]];$("#differenceSummary").innerHTML=rows.map(row=>`<div><dt>${row[0]}</dt><dd>${escapeHtml(row[1])}</dd></div>`).join("");}

const explainCopy={system:{kicker:"DESIGN SYSTEM",title:"设计系统决定组件怎么工作",body:"它定义按钮、输入框、卡片、导航等组件的结构、尺寸、间距、状态和可访问性。切换它，应该看到真正的组件规范差异，而不是只换颜色。",items:["Material 3：强调状态层级与跨平台一致性","Ant Design：适合信息密集的企业级 Web 产品","Apple HIG：此处是规则模拟预览，不是苹果官方 Web 组件库"]},brand:{kicker:"BRAND REFERENCE",title:"品牌参考决定页面怎么说话",body:"它用于表达气质、强调方式和排版倾向，不会替换当前设计系统的组件。",items:["Linear：冷静、精确、效率优先","Stripe：明亮、技术可信、商业表达强","Airbnb：温暖、人本、生活方式感更强"]},theme:{kicker:"COLOR THEME",title:"配色主题只负责色彩与表面",body:"这里的主题来自公开设计规范中的色彩体系，用来改变画布、表面、文字、强调色与状态色，不再把它伪装成独立的“视觉风格”。",items:["可以让 Ant Design 组件使用 Apple HIG 配色做实验","可以固定品牌参考，只比较不同配色系统","不会因为换配色而改变按钮或表单组件结构"]}};
function openExplanation(id){const copy=explainCopy[id];if(!copy)return;$("#explainContent").innerHTML=`<p class="eyebrow">${copy.kicker}</p><h2>${copy.title}</h2><p>${copy.body}</p><ul>${copy.items.map(item=>`<li>${item}</li>`).join("")}</ul>`;$("#explainDialog").showModal();}
function showToast(message){const toast=$("#toast");clearTimeout(toastTimer);toast.textContent=message;toast.hidden=false;toastTimer=setTimeout(()=>toast.hidden=true,1800);}
function escapeHtml(value){return String(value??"").replace(/[&<>\"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[char]);}
