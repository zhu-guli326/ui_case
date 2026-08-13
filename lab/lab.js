import { componentKinds, devices, findDevice, findSystem, findTemplate, findTheme, systems, templates, themes, buildCodeExport, buildTokenExport } from "./lab-data.js";

const systemTabs = document.querySelector("#systemTabs");
const settingsForm = document.querySelector("#settingsForm");
const settingsPanel = document.querySelector("#settingsPanel");
const settingsButton = document.querySelector("#settingsButton");
const settingsScrim = document.querySelector("#settingsScrim");
const previewStage = document.querySelector("#previewStage");
const matrix = document.querySelector("#componentMatrix");
const inspectorContent = document.querySelector("#inspectorContent");
const toast = document.querySelector("#toast");
const state = readState();
let activeInspector = "mapping";
let toastTimer = 0;
let previewFrameObserver = null;

initialize();

function initialize() {
  populateSelect(settingsForm.elements.template, templates);
  populateSelect(settingsForm.elements.theme, themes);
  renderSegments("view", [{ id: "single", name: "单页" }, { id: "compare", name: "对比" }, { id: "matrix", name: "组件矩阵" }]);
  renderSegments("appearance", [{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }]);
  renderDeviceOptions();
  bindEvents();
  syncControls();
  render();
}

function readState() {
  const url = new URL(window.location.href);
  return {
    template: valid(url.searchParams.get("template"), templates, "account-settings"),
    system: valid(url.searchParams.get("system"), systems, "ant"),
    theme: valid(url.searchParams.get("theme"), themes, "minimal-tech"),
    device: valid(url.searchParams.get("device"), devices, "desktop"),
    appearance: ["light", "dark"].includes(url.searchParams.get("appearance")) ? url.searchParams.get("appearance") : "light",
    view: ["single", "compare", "matrix"].includes(url.searchParams.get("view")) ? url.searchParams.get("view") : "single",
  };
}

function bindEvents() {
  systemTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-system]");
    if (!tab) return;
    state.system = tab.dataset.system;
    syncState();
  });
  document.querySelectorAll("[data-control]").forEach((group) => group.addEventListener("click", (event) => {
    const button = event.target.closest("[data-value]");
    if (!button) return;
    state[group.dataset.control] = button.dataset.value;
    syncState();
  }));
  settingsForm.addEventListener("change", (event) => {
    if (!event.target.name) return;
    state[event.target.name] = event.target.value;
    syncState();
  });
  settingsButton.addEventListener("click", () => setSettingsOpen(settingsPanel.hidden));
  document.querySelector("#settingsClose").addEventListener("click", () => setSettingsOpen(false));
  settingsScrim.addEventListener("click", () => setSettingsOpen(false));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !settingsPanel.hidden) setSettingsOpen(false); });
  document.querySelector("#resetSettings").addEventListener("click", () => {
    Object.assign(state, { template: "account-settings", theme: "minimal-tech", device: "desktop", appearance: "light" });
    syncControls();
    syncState();
  });
  document.querySelectorAll("[data-inspector]").forEach((button) => button.addEventListener("click", () => {
    activeInspector = button.dataset.inspector;
    document.querySelectorAll("[data-inspector]").forEach((item) => item.setAttribute("aria-selected", String(item === button)));
    renderInspector();
  }));
  window.addEventListener("popstate", () => { Object.assign(state, readState()); syncControls(); render(); });
}

function setSettingsOpen(open) {
  settingsPanel.hidden = !open;
  settingsScrim.hidden = !open;
  settingsButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("settings-open", open);
  if (open) document.querySelector("#settingsClose").focus(); else settingsButton.focus();
}

function syncState() {
  const url = new URL(window.location.href);
  Object.entries(state).forEach(([key, value]) => url.searchParams.set(key, value));
  window.history.replaceState({ ...state }, "", url);
  syncControls();
  render();
}

function syncControls() {
  settingsForm.elements.template.value = state.template;
  settingsForm.elements.theme.value = state.theme;
}

function render() {
  const template = findTemplate(state.template);
  const system = findSystem(state.system);
  const device = findDevice(state.device);
  const theme = findTheme(state.theme);
  document.documentElement.dataset.appearance = state.appearance;
  document.querySelector("#workspaceHeading").textContent = template.name;
  document.querySelector("#workspaceDescription").textContent = template.description;
  document.querySelector("#systemStatus").textContent = state.view === "compare" ? `${comparisonSystems().length} 套系统并排` : system.status;
  document.querySelector("#previewDimensions").textContent = `${device.width} × ${device.height}`;
  document.querySelector("#inspectorSystemName").textContent = system.shortName;
  renderSystemTabs();
  renderTheme(theme);
  updateOptionStates();
  renderPreviews();
  renderInspector();
}

function renderSystemTabs() {
  systemTabs.innerHTML = systems.map((system) => `<button role="tab" type="button" data-system="${system.id}" aria-selected="${system.id === state.system}" class="${system.id === state.system ? "is-selected" : ""}">${escapeHtml(system.shortName)}</button>`).join("");
  systemTabs.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function renderTheme(theme) {
  document.querySelector("#activeThemeName").textContent = theme.name;
  document.querySelector("#activeThemeDescription").textContent = theme.description;
  document.querySelector("#activeThemeSwatches").innerHTML = Object.entries(theme.colors).slice(0, 5).map(([name, color]) => `<i style="--swatch:${escapeHtml(color)}" title="${escapeHtml(name)} ${escapeHtml(color)}"></i>`).join("");
}

function renderPreviews() {
  const device = findDevice(state.device);
  previewFrameObserver?.disconnect();
  previewFrameObserver = null;
  matrix.hidden = state.view !== "matrix";
  previewStage.hidden = state.view === "matrix";
  if (state.view === "matrix") { renderMatrix(); return; }
  const previewSystems = state.view === "compare" ? comparisonSystems() : [findSystem(state.system)];
  previewStage.className = `preview-stage is-${state.view} device-${state.device}`;
  previewStage.innerHTML = previewSystems.map((system) => `<article class="preview-column"><header><div><strong>${escapeHtml(system.name)}</strong><span>${escapeHtml(system.status)}</span></div><a href="${escapeHtml(system.sourceUrl)}" target="_blank" rel="noopener noreferrer">规范来源 ↗</a></header><div class="device-frame" data-preview-width="${device.width}" data-preview-height="${device.height}" style="--preview-width:${device.width}px;--preview-height:${device.height}px"><iframe title="${escapeHtml(system.name)} ${escapeHtml(findTemplate(state.template).name)}预览" src="${previewUrl(system.id)}"></iframe></div></article>`).join("");
  fitPreviewFrames();
}

function fitPreviewFrames() {
  const frames = [...previewStage.querySelectorAll(".device-frame")];
  const resize = (frame) => {
    const sourceWidth = Number(frame.dataset.previewWidth);
    const sourceHeight = Number(frame.dataset.previewHeight);
    const scale = Math.min(1, Math.max(1, frame.clientWidth) / sourceWidth);
    frame.style.setProperty("--preview-scale", String(scale));
    // Keep the complete canvas visible when the device frame adds a thick bezel.
    const styles = getComputedStyle(frame);
    const verticalBorder = Number.parseFloat(styles.borderTopWidth) + Number.parseFloat(styles.borderBottomWidth);
    frame.style.height = `${Math.round(sourceHeight * scale + verticalBorder)}px`;
  };
  frames.forEach(resize);
  previewFrameObserver = new ResizeObserver((entries) => entries.forEach(({ target }) => resize(target)));
  frames.forEach((frame) => previewFrameObserver.observe(frame));
}

function previewUrl(systemId) {
  const url = new URL("./preview.html", window.location.href);
  Object.entries({ ...state, system: systemId }).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.href;
}

function renderMatrix() {
  const compared = comparisonSystems();
  matrix.innerHTML = `<header><div><h2 id="matrixHeading">组件矩阵</h2><p>同一语义在不同体系中的映射和基础形态。</p></div><span>8 个组件角色</span></header><div class="matrix-table"><div class="matrix-row matrix-head"><b>组件角色</b>${compared.map((system) => `<b>${escapeHtml(system.name)}</b>`).join("")}</div>${componentKinds.map((kind) => `<div class="matrix-row"><strong>${componentLabel(kind)}</strong>${compared.map((system) => `<div><span>${escapeHtml(system.mapping[kind])}</span>${matrixSample(kind, system.id)}</div>`).join("")}</div>`).join("")}</div>`;
}

function comparisonSystems() { return [...new Set([state.system, "apple", "material", "ant", "carbon"])].slice(0, 4).map(findSystem); }
function matrixSample(kind, id) {
  if (kind === "button") return `<button class="matrix-button system-${id}" type="button">保存</button>`;
  if (kind === "input") return `<input class="matrix-input system-${id}" value="示例内容" aria-label="输入框示例">`;
  if (kind === "select") return `<select class="matrix-input system-${id}" aria-label="选择器示例"><option>选项</option></select>`;
  if (kind === "notification") return `<span class="matrix-toast system-${id}">✓ 已保存</span>`;
  return `<span class="matrix-shape system-${id}" aria-hidden="true"><i></i><i></i><i></i></span>`;
}

function renderInspector() {
  const system = findSystem(state.system);
  const theme = findTheme(state.theme);
  if (activeInspector === "tokens") {
    inspectorContent.innerHTML = `<section><header><h3>Design Tokens</h3><button type="button" data-copy="tokens">复制 JSON</button></header>${tokenRows(system, theme)}<button class="inspector-primary" type="button" data-download>下载 Token JSON</button></section>`;
  } else if (activeInspector === "guide") {
    inspectorContent.innerHTML = `<section><h3>${escapeHtml(system.name)}</h3><p class="status-line">${escapeHtml(system.status)}</p><p>${escapeHtml(system.note)}</p><a class="source-link" href="${escapeHtml(system.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看公开规范来源 ↗</a><hr><h3>${escapeHtml(theme.name)}</h3><p>${escapeHtml(theme.description)}</p><p>${escapeHtml(theme.voice)}</p></section>`;
  } else if (activeInspector === "export") {
    inspectorContent.innerHTML = `<section><h3>代码导出</h3><p>${escapeHtml(exportDescription(system))}</p><pre class="code-preview">${escapeHtml(buildCodeExport(state))}</pre><button class="inspector-primary" type="button" data-copy="code">复制 ${escapeHtml(system.platform)} 代码</button><button class="inspector-secondary" type="button" data-copy="prompt">复制生成 Prompt</button></section>`;
  } else {
    inspectorContent.innerHTML = `<section><header><h3>组件映射</h3><span>${escapeHtml(system.shortName)}</span></header><div class="mapping-list">${componentKinds.map((kind) => `<div><span>${componentLabel(kind)}</span><strong>${escapeHtml(system.mapping[kind])}</strong></div>`).join("")}</div><button class="inspector-primary" type="button" data-view-matrix>打开组件矩阵</button></section>`;
  }
  bindInspectorActions();
}

function bindInspectorActions() {
  inspectorContent.querySelector('[data-copy="tokens"]')?.addEventListener("click", () => copyText(JSON.stringify(buildTokenExport(state), null, 2), "Token JSON 已复制"));
  inspectorContent.querySelector('[data-copy="code"]')?.addEventListener("click", () => copyText(buildCodeExport(state), "实现代码已复制"));
  inspectorContent.querySelector('[data-copy="prompt"]')?.addEventListener("click", () => copyText(buildPrompt(), "生成 Prompt 已复制"));
  inspectorContent.querySelector("[data-download]")?.addEventListener("click", () => downloadJson(`${state.template}-${state.system}-${state.theme}-tokens.json`, buildTokenExport(state)));
  inspectorContent.querySelector("[data-view-matrix]")?.addEventListener("click", () => { state.view = "matrix"; syncState(); });
}

function tokenRows(system, theme) { return `<dl class="token-list">${[...Object.entries(system.tokens), ...Object.entries(theme.colors).map(([key, value]) => [`color.${key}`, value])].map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}${String(value).startsWith("#") ? `<i style="--swatch:${value}"></i>` : ""}</dd></div>`).join("")}</dl>`; }
function renderSegments(name, options) { document.querySelector(`[data-control="${name}"]`).innerHTML = options.map((option) => `<button type="button" data-value="${option.id}">${option.name}</button>`).join(""); }
function renderDeviceOptions() { document.querySelector('[data-control="device"]').innerHTML = devices.map((device) => `<button type="button" data-value="${device.id}"><i class="device-icon device-${device.id}" aria-hidden="true"></i><span>${device.name}</span></button>`).join(""); }
function updateOptionStates() { document.querySelectorAll("[data-control]").forEach((group) => group.querySelectorAll("[data-value]").forEach((button) => { const selected = state[group.dataset.control] === button.dataset.value; button.classList.toggle("is-selected", selected); button.setAttribute("aria-pressed", String(selected)); })); }
function populateSelect(select, options) { select.innerHTML = options.map((option) => `<option value="${option.id}">${option.name}</option>`).join(""); }
function valid(id, collection, fallback) { return collection.some((item) => item.id === id) ? id : fallback; }
function componentLabel(kind) { return ({ navigation: "导航", button: "按钮", input: "输入框", select: "选择器", card: "卡片", list: "列表", dialog: "弹窗", notification: "通知" })[kind] || kind; }
function exportDescription(system) { return system.id === "apple" ? "生成 SwiftUI 原生实现起点。当前网页仅为 HIG 模拟预览。" : system.id === "material" ? "生成 Material Web 示例，并保留依赖维护状态提示。" : `生成 ${system.name} 的适配器蓝图，并标注公开规范来源。`; }
function buildPrompt() { const template = findTemplate(state.template); const system = findSystem(state.system); const theme = findTheme(state.theme); return `使用页面蓝图 ${template.id} 构建“${template.name}”。\n设计系统：${system.name}（${system.status}）\n品牌主题：${theme.name}\n设备：${findDevice(state.device).name}\n外观：${state.appearance}\n组件映射：${Object.entries(system.mapping).map(([key, value]) => `${key}=${value}`).join("；")}\n必须保留键盘操作、可见焦点、WCAG AA 对比度和 reduced-motion。`; }
async function copyText(value, message) { try { await navigator.clipboard.writeText(value); } catch { const area = document.createElement("textarea"); area.value = value; area.style.cssText = "position:fixed;opacity:0"; document.body.append(area); area.select(); document.execCommand("copy"); area.remove(); } showToast(message); }
function downloadJson(filename, value) { const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url); showToast("Token JSON 已下载"); }
function showToast(message) { window.clearTimeout(toastTimer); toast.textContent = message; toast.hidden = false; toastTimer = window.setTimeout(() => { toast.hidden = true; }, 1800); }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]); }

window.image2DesignSystemLab = { state, systems, templates, themes, buildCodeExport, buildTokenExport };
