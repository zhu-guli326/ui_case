import { labThemes } from "../../../catalog/color-themes.js";

const STORAGE_KEY = "ondesign:interface-dna:v1";
const basePalettes = {
  sage: { label: "鼠尾草绿", colors: ["#18a957", "#e7f5ec", "#f6f5f1", "#24231f"] },
  ink: { label: "墨黑灰", colors: ["#111111", "#e8e8e4", "#f5f4f0", "#252724"] },
  blue: { label: "深海蓝", colors: ["#2457e6", "#e7edff", "#f2f5ff", "#17213c"] },
  coral: { label: "暖珊瑚", colors: ["#e4573d", "#fff0e8", "#fff7f2", "#321d18"] },
};
const extraPalettes = {};
const paletteFor = (key) => basePalettes[key] || extraPalettes[key] || basePalettes.sage;
const catalogPresets = labThemes.map((theme) => ({
  kind: "palette",
  id: `lab:${theme.id}`,
  label: theme.name,
  desc: theme.description,
  tags: theme.tags || [],
  paletteKey: `lab:${theme.id}`,
  colors: [theme.colors.accent, theme.colors.accentSoft, theme.colors.canvas, theme.colors.ink],
}));
const labels = {
  style: { restrained: "克制", editorial: "编辑感", vivid: "活力", future: "未来感" },
  density: { loose: "宽松", balanced: "平衡", compact: "紧凑" },
  font: { sans: "简洁无衬线", serif: "编辑衬线", mono: "几何等宽", hei: "浓黑标题", kai: "楷书人文", fangsong: "仿宋文献", yuan: "圆润亲和", geometric: "几何西文" },
  radius: { "0": "直角", "14": "适中", "28": "圆润" },
  spacing: { "6": "紧凑", "10": "平衡", "14": "宽松" },
};
const state = { style: "restrained", density: "balanced", palette: "sage", font: "sans", radius: "14", spacing: "10", device: "desktop" };
const presets = [
  { id: "restrained", label: "克制 · 鼠尾草绿", desc: "留白、秩序、柔和。绿色点缀的中性界面，适合内容型产品。", style: "restrained", palette: "sage", font: "sans", radius: "14", spacing: "10", density: "balanced" },
  { id: "editorial", label: "编辑感 · 墨黑灰", desc: "字体、网格、对比。衬线标题与直角卡片，内容感强。", style: "editorial", palette: "ink", font: "serif", radius: "0", spacing: "6", density: "compact" },
  { id: "vivid", label: "活力 · 暖珊瑚", desc: "高对比、丰富、直接。大圆角与暖色调，消费与营销场景。", style: "vivid", palette: "coral", font: "sans", radius: "28", spacing: "10", density: "compact" },
  { id: "future", label: "未来感 · 深海蓝", desc: "深邃、精致、氛围。等宽字体与宽松间距，工具型产品。", style: "future", palette: "blue", font: "mono", radius: "14", spacing: "14", density: "balanced" },
  { id: "atelier", label: "工坊 · 墨黑灰", desc: "无衬线排版配大圆角与宽松节奏，作品集与工作室气质。", style: "editorial", palette: "ink", font: "sans", radius: "28", spacing: "14", density: "loose" },
  { id: "editorial-coral", label: "柑橘 · 暖珊瑚", desc: "衬线文字与适中圆角，编辑感与暖色并存的杂志界面。", style: "vivid", palette: "coral", font: "serif", radius: "14", spacing: "6", density: "balanced" },
];
let activePresetId = "restrained";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function selectInGroup(group, button) {
  const value = button.dataset.value;
  if (!value) return;
  state[group] = value;
  $$(`[data-choice-group="${group}"] button`).forEach((item) => {
    const selected = item === button;
    item.classList.toggle("is-selected", selected);
    if (item.getAttribute("role") === "radio") item.setAttribute("aria-checked", String(selected));
  });
  applyPreview();
  setPresetLabel(null);
}

function selectStyle(button) {
  const preset = presets.find((item) => item.style === button.dataset.style);
  if (preset) { applyPreset(preset, { silent: true }); return; }
  state.style = button.dataset.style;
  syncDirectionCards();
  syncChoiceGroups();
  applyPreview();
  setPresetLabel(null);
}

function syncDirectionCards() {
  $$(".direction-card").forEach((item) => { const selected = item.dataset.style === state.style; item.classList.toggle("is-selected", selected); item.setAttribute("aria-checked", String(selected)); });
}

function applyPreset(preset, { silent = false } = {}) {
  activePresetId = preset.id;
  Object.assign(state, { style: preset.style, density: preset.density, palette: preset.palette, font: preset.font, radius: preset.radius, spacing: preset.spacing });
  syncDirectionCards();
  syncChoiceGroups();
  setPresetLabel(preset.label);
  applyPreview();
  if (!silent) { renderPresetList(); toast(`已应用预设：${preset.label}`); }
}

function syncChoiceGroups() {
  ["density", "palette", "font", "radius", "spacing"].forEach((group) => {
    $$(`[data-choice-group="${group}"] button`).forEach((item) => {
      const selected = item.dataset.value === state[group];
      item.classList.toggle("is-selected", selected);
      if (item.getAttribute("role") === "radio") item.setAttribute("aria-checked", String(selected));
    });
  });
}

function applyPreview() {
  const root = document.documentElement;
  const palette = paletteFor(state.palette);
  const densityScale = { loose: 1.28, balanced: 1, compact: .78 }[state.density];
  const displayFont = {
    sans: 'system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif',
    serif: '"Noto Serif SC","Songti SC","SimSun",Georgia,serif',
    mono: 'ui-monospace,"SFMono-Regular",Consolas,"Liberation Mono",monospace',
    hei: '"Noto Sans SC","Source Han Sans SC","SimHei","Microsoft YaHei",sans-serif',
    kai: '"Kaiti SC","STKaiti",KaiTi,"TW-Kai",cursive',
    fangsong: '"Fangsong SC","STFangsong",FangSong,"SimSun",serif',
    yuan: '"Yuanti SC",YouYuan,"PingFang SC","Microsoft YaHei",sans-serif',
    geometric: 'Futura,"Century Gothic","Avenir Next","Trebuchet MS",sans-serif',
  }[state.font];
  root.style.setProperty("--dna-accent", palette.colors[0]);
  root.style.setProperty("--dna-accent-soft", palette.colors[1]);
  root.style.setProperty("--dna-canvas", palette.colors[2]);
  root.style.setProperty("--dna-ink", palette.colors[3]);
  root.style.setProperty("--dna-radius", `${state.radius}px`);
  root.style.setProperty("--dna-space", `${Number(state.spacing) * densityScale}px`);
  root.style.setProperty("--dna-display", displayFont);
  document.body.dataset.style = state.style;
  const styleRadius = { restrained: state.radius, editorial: "0", vivid: String(Math.max(16, Number(state.radius))), future: String(Math.max(4, Number(state.radius))) }[state.style];
  $(".sample-visual")?.style.setProperty("border-radius", `${styleRadius}px`);
  $$("#dockPalette i").forEach((item, index) => { item.style.background = palette.colors[index]; });
  $("#dockFont").textContent = labels.font[state.font];
  $("#dockRadius").textContent = `${state.radius}px 圆角`;
  $("#dockDensity").textContent = `${labels.density[state.density]}密度`;
  renderSummary();
  renderPrompt();
}

function renderSummary() {
  const summary = $("#dnaSummary");
  if (!summary) return;
  const rows = [["设计方向", labels.style[state.style]], ["颜色", paletteFor(state.palette).label], ["字体", labels.font[state.font]], ["圆角", `${labels.radius[state.radius]} · ${state.radius}px`], ["间距", `${labels.spacing[state.spacing]} · ${state.spacing}px`], ["密度", labels.density[state.density]]];
  summary.replaceChildren(...rows.map(([term, value]) => {
    const row = document.createElement("div"); const dt = document.createElement("dt"); const dd = document.createElement("dd");
    dt.textContent = term; dd.textContent = value; row.append(dt, dd); return row;
  }));
}

function renderPrompt() {
  const node = $("#dnaPrompt");
  if (node) node.textContent = dnaText();
}

function dnaPayload() {
  return { name: $("#dnaName")?.value.trim() || "未命名界面 DNA", updatedAt: new Date().toISOString(), ...Object.fromEntries(Object.entries(state).filter(([key]) => !["device"].includes(key))), paletteLabel: paletteFor(state.palette).label, colors: paletteFor(state.palette).colors };
}
function dnaText() {
  const data = dnaPayload();
  return [`界面设计 DNA：${data.name}`, `设计方向：${labels.style[data.style]}`, `颜色：${paletteFor(data.palette).label}（${data.colors.join(" / ")}）`, `字体：${labels.font[data.font]}`, `圆角：${data.radius}px`, `基础间距：${data.spacing}px`, `界面密度：${labels.density[data.density]}`, "复用要求：新页面应继承以上视觉规则，仅根据页面任务调整内容结构。"].join("\n");
}
function toast(message) { const node = $("#dnaToast"); if (!node) return; node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; }, 2200); }
async function copyDna() { try { await navigator.clipboard.writeText(dnaText()); toast("提示词已复制，去 AI 工具里粘贴吧"); } catch { toast("复制失败，请重试"); } }
function saveDna() { localStorage.setItem(STORAGE_KEY, JSON.stringify(dnaPayload())); $("#saveNote").textContent = "已保存到当前浏览器，可继续用于其他页面。"; toast("界面 DNA 已保存"); }

function restoreDna() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); if (!saved) return;
    ["style", "density", "palette", "font", "radius", "spacing"].forEach((key) => { if (saved[key] != null) state[key] = String(saved[key]); });
    if (state.palette && !basePalettes[state.palette] && Array.isArray(saved.colors)) {
      extraPalettes[state.palette] = { label: saved.paletteLabel || "自定义配色", colors: saved.colors };
    }
    if (saved.name) $("#dnaName").value = saved.name;
    $$(".direction-card").forEach((item) => { const selected = item.dataset.style === state.style; item.classList.toggle("is-selected", selected); item.setAttribute("aria-checked", String(selected)); });
  } catch { localStorage.removeItem(STORAGE_KEY); }
}

function installEvents() {
  $$(".direction-card").forEach((button) => button.addEventListener("click", () => selectStyle(button)));
  $$('[data-choice-group]').forEach((group) => group.addEventListener("click", (event) => { const button = event.target.closest("button[data-value]"); if (button) selectInGroup(group.dataset.choiceGroup, button); }));
  $$("[data-scroll]").forEach((button) => button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  $$("[data-device]").forEach((button) => button.addEventListener("click", () => { state.device = button.dataset.device; $$("[data-device]").forEach((item) => item.classList.toggle("is-selected", item === button)); $("[data-preview-stage]").classList.toggle("is-mobile", state.device === "mobile"); }));
  $("#saveDna")?.addEventListener("click", saveDna); $("#copyDna")?.addEventListener("click", copyDna);
}

function setPresetLabel(label) {
  activePresetId = label ? activePresetId : null;
  const node = $("[data-preset-label]");
  if (node) node.textContent = label ? `预设 · ${label.split(" · ")[0]}` : "预设 · 自定义";
  renderPresetList();
}

function renderPresetDetail(preset) {
  const detail = $("[data-preset-detail]");
  if (!detail) return;
  if (preset.kind === "palette") {
    const swatches = preset.colors.map((color, index) => `<figure><i style="background:${color}"></i><figcaption><b>${color}</b><small>${["主色", "浅底", "画布", "墨色"][index] || ""}</small></figcaption></figure>`).join("");
    const tags = preset.tags.length ? `<p class="dna-preset-tags">${preset.tags.map((tag) => `<span>${tag}</span>`).join("")}</p>` : "";
    detail.innerHTML = `<h3>${preset.label}</h3><p>${preset.desc}</p>${tags}<div class="dna-preset-swatches">${swatches}</div>`;
    return;
  }
  const palette = paletteFor(preset.palette);
  const swatches = palette.colors.map((color, index) => `<figure><i style="background:${color}"></i><figcaption><b>${color}</b><small>${["主色", "浅底", "画布", "墨色"][index] || ""}</small></figcaption></figure>`).join("");
  detail.innerHTML = `<h3>${preset.label}</h3><p>${preset.desc}</p><p class="dna-preset-meta">字体 ${labels.font[preset.font]} · 圆角 ${preset.radius}px · 间距 ${preset.spacing}px · ${labels.density[preset.density]}密度</p><div class="dna-preset-swatches">${swatches}</div>`;
}

function applyCatalogPreset(preset) {
  extraPalettes[preset.paletteKey] = { label: preset.label, colors: preset.colors };
  state.palette = preset.paletteKey;
  syncChoiceGroups();
  setPresetLabel(preset.label);
  applyPreview();
  renderPresetList($("[data-preset-search]")?.value || "");
  toast(`已应用配色：${preset.label}`);
}

function renderPresetList(filter = "") {
  const list = $("[data-preset-list]");
  if (!list) return;
  const query = filter.trim().toLowerCase();
  const matches = (preset) => !query || `${preset.label}${preset.desc}${preset.tags ? preset.tags.join("") : ""}`.toLowerCase().includes(query);
  const bundleItems = presets.filter(matches);
  const catalogItems = catalogPresets.filter(matches);
  const currentLabel = $("[data-preset-label]")?.textContent || "";
  const bundleHtml = bundleItems.map((preset) => {
    const selected = currentLabel.includes(preset.label.split(" · ")[0]);
    return `<button type="button" role="option" aria-selected="${selected}" class="dna-preset-item${selected ? " is-selected" : ""}" data-preset-kind="bundle" data-preset-id="${preset.id}"><span>${preset.label}</span><small>${labels.font[preset.font]} · ${preset.radius}px</small></button>`;
  }).join("");
  const catalogHtml = catalogItems.map((preset) => {
    const selected = state.palette === preset.paletteKey;
    return `<button type="button" role="option" aria-selected="${selected}" class="dna-preset-item${selected ? " is-selected" : ""}" data-preset-kind="palette" data-preset-id="${preset.id}"><span>${preset.label}</span><small>${preset.colors[0]}</small></button>`;
  }).join("");
  list.innerHTML = (bundleItems.length ? `<p class="dna-preset-group">DNA 预设</p>${bundleHtml}` : "")
    + (catalogItems.length ? `<p class="dna-preset-group">配色体系 · 案例库</p>${catalogHtml}` : "")
    + (!bundleItems.length && !catalogItems.length ? '<p class="dna-preset-empty">没有匹配的预设</p>' : "");
  list.querySelectorAll("[data-preset-id]").forEach((button) => {
    const pool = button.dataset.presetKind === "palette" ? catalogPresets : presets;
    const preset = pool.find((item) => item.id === button.dataset.presetId);
    button.addEventListener("click", () => { button.dataset.presetKind === "palette" ? applyCatalogPreset(preset) : applyPreset(preset); });
    button.addEventListener("mouseenter", () => renderPresetDetail(preset));
  });
  const shown = bundleItems.find((item) => item.id === activePresetId) || catalogItems.find((item) => item.paletteKey === state.palette) || bundleItems[0] || catalogItems[0];
  if (shown) renderPresetDetail(shown);
}

function installPresetDropdown() {
  const root = $("[data-preset-root]");
  const toggle = $("[data-preset-toggle]");
  const panel = $("[data-preset-panel]");
  if (!root || !toggle || !panel) return;
  const close = () => { panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); };
  const open = () => { panel.hidden = false; toggle.setAttribute("aria-expanded", "true"); renderPresetList($("[data-preset-search]")?.value || ""); };
  toggle.addEventListener("click", () => { panel.hidden ? open() : close(); });
  $("[data-preset-search]")?.addEventListener("input", (event) => renderPresetList(event.target.value));
  $("[data-preset-clear]")?.addEventListener("click", () => { applyPreset(presets[0]); close(); });
  document.addEventListener("click", (event) => { if (!event.target.closest("[data-preset-root]")) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !panel.hidden) close(); });
}

restoreDna(); installEvents(); installPresetDropdown();
const matchedPreset = presets.find((item) => item.style === state.style && item.palette === state.palette && item.font === state.font && item.radius === state.radius && item.spacing === state.spacing && item.density === state.density);
setPresetLabel(matchedPreset ? matchedPreset.label : state.palette?.startsWith("lab:") ? paletteFor(state.palette).label : null);
syncChoiceGroups(); applyPreview(); renderPrompt();
