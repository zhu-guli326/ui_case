import { labThemes } from "../../../catalog/color-themes.js";

const STORAGE_KEY = "ondesign:interface-dna:v1";
const LANG = () => (window.image2I18n?.language === "en" ? "en" : "zh");

const basePalettes = {
  sage: { label: "鼠尾草绿", colors: ["#18a957", "#e7f5ec", "#f6f5f1", "#24231f"] },
  ink: { label: "墨黑灰", colors: ["#111111", "#e8e8e4", "#f5f4f0", "#252724"] },
  blue: { label: "深海蓝", colors: ["#2457e6", "#e7edff", "#f2f5ff", "#17213c"] },
  coral: { label: "暖珊瑚", colors: ["#e4573d", "#fff0e8", "#fff7f2", "#321d18"] },
};
const enPaletteNames = { sage: "Sage green", ink: "Ink black", blue: "Deep blue", coral: "Warm coral" };
const extraPalettes = {};
const paletteFor = (key) => basePalettes[key] || extraPalettes[key] || basePalettes.sage;
const paletteName = (key) => {
  const palette = paletteFor(key);
  if (LANG() === "en") {
    if (basePalettes[key]) return enPaletteNames[key] || palette.label;
    if (extraPalettes[key]?.labelEn) return extraPalettes[key].labelEn;
  }
  return palette.label;
};

const catalogEnNames = {
  airbnb: "Airbnb Coral", claude: "Claude Warm Coral", cursor: "Cursor Orange", binance: "Binance Yellow & Black",
  "bmw-m": "BMW M Tri-color", coinbase: "Coinbase Blue & White", "apple-hig": "Apple System Blue",
  "google-material-3": "Material 3 Purple", "ant-design": "Ant Design Blue", "fluent-2": "Fluent 2 Blue",
  tdesign: "TDesign Blue", "carbon-design": "Carbon Blue", "adobe-spectrum": "Spectrum Blue", "github-primer": "Primer Developer Blue",
};
const catalogPresets = labThemes.map((theme) => ({
  kind: "palette",
  id: `lab:${theme.id}`,
  label: theme.name,
  labelEn: catalogEnNames[theme.id] || theme.name,
  desc: theme.description,
  tags: theme.tags || [],
  paletteKey: `lab:${theme.id}`,
  colors: [theme.colors.accent, theme.colors.accentSoft, theme.colors.canvas, theme.colors.ink],
}));

const labelSets = {
  zh: {
    style: { restrained: "克制", editorial: "编辑感", vivid: "活力", future: "未来感" },
    density: { loose: "宽松", balanced: "平衡", compact: "紧凑" },
    font: { sans: "简洁无衬线", serif: "编辑衬线", mono: "几何等宽", hei: "浓黑标题", kai: "楷书人文", fangsong: "仿宋文献", yuan: "圆润亲和", geometric: "几何西文" },
    radius: { "0": "直角", "14": "适中", "28": "圆润" },
    spacing: { "6": "紧凑", "10": "平衡", "14": "宽松" },
  },
  en: {
    style: { restrained: "Restrained", editorial: "Editorial", vivid: "Vivid", future: "Futuristic" },
    density: { loose: "Loose", balanced: "Balanced", compact: "Compact" },
    font: { sans: "Clean sans", serif: "Editorial serif", mono: "Geometric mono", hei: "Bold display", kai: "Brush humanist", fangsong: "Fangsong classic", yuan: "Rounded friendly", geometric: "Geometric latin" },
    radius: { "0": "Sharp", "14": "Moderate", "28": "Rounded" },
    spacing: { "6": "Compact", "10": "Balanced", "14": "Relaxed" },
  },
};
const L = () => labelSets[LANG()];
const fontDescriptionSets = {
  zh: { sans: "现代、清晰、通用", serif: "内容感、文化感", mono: "理性、工具感", hei: "浓重、醒目、主张", kai: "人文、书法、温度", fangsong: "规范、文献、报刊", yuan: "亲和、轻松、消费", geometric: "几何、现代、品牌" },
  en: { sans: "Modern, clear and universal", serif: "Editorial and cultural", mono: "Rational and tool-like", hei: "Heavy and striking", kai: "Humanist and warm", fangsong: "Formal and documentary", yuan: "Friendly and relaxed", geometric: "Geometric and brand-led" },
};

const STR = {
  zh: {
    copyPrompt: "复制提示词", saveDna: "保存 DNA",
    presetPrefix: "预设", presetCustom: "预设 · 自定义",
    searchPlaceholder: "搜索设计 DNA", clear: "清除",
    groupDna: "DNA 预设", groupCatalog: "配色体系 · 案例库", noMatch: "没有匹配的预设",
    directionTitle: "方向", directionDesc: "先确定整体气质，密度随之匹配。",
    rulesTitle: "规范", rulesDesc: "只保留会持续影响所有页面的四项设置。",
    saveTitle: "保存并复用", saveDesc: "给这套 DNA 命名，之后可以应用到新页面。",
    densityLegend: "界面密度",
    hintPre: "方向已绑定案例库真实案例效果，", hintLink: "在案例库中打开当前方向的案例",
    colorLegend: "颜色", fontLegend: "字体气质", radiusLegend: "圆角", spacingLegend: "间距",
    nameField: "规范名称", promptLabel: "生成的提示词",
    saveThis: "保存这套 DNA",
    saveNote: "已保存到当前浏览器，可继续用于其他页面。",
    previewTitle: "实时预览", desktop: "桌面", mobile: "移动",
    toastCopied: "提示词已复制，去 AI 工具里粘贴吧", toastCopyFail: "复制失败，请重试", toastSaved: "界面 DNA 已保存",
    summaryTerms: ["设计方向", "颜色", "字体", "圆角", "间距", "密度"],
    swatchRoles: ["主色", "浅底", "画布", "墨色"],
    unsaved: "未保存", saved: "已保存", modified: "有未保存修改",
    radiusText: (r) => `${r}px 圆角`,
    densityText: (name) => `${name}密度`,
    presetMeta: (font, radius, spacing, density) => `字体 ${font} · 圆角 ${radius}px · 间距 ${spacing}px · ${density}密度`,
    toastPreset: (name) => `已应用预设：${name}`,
    toastPalette: (name) => `已应用配色：${name}`,
    untitled: "未命名界面 DNA",
  },
  en: {
    copyPrompt: "Copy prompt", saveDna: "Save DNA",
    presetPrefix: "Preset", presetCustom: "Preset · Custom",
    searchPlaceholder: "Search design DNA", clear: "Clear",
    groupDna: "DNA presets", groupCatalog: "Color systems · case library", noMatch: "No matching presets",
    directionTitle: "Direction", directionDesc: "Set the overall temperament first; density follows.",
    rulesTitle: "Foundation", rulesDesc: "Only the four settings that shape every page.",
    saveTitle: "Save & reuse", saveDesc: "Name this DNA so you can apply it to new pages.",
    densityLegend: "Density",
    hintPre: "Each direction is bound to a real case-library demo — ", hintLink: "open the current direction's case in the library",
    colorLegend: "Colors", fontLegend: "Typography", radiusLegend: "Radius", spacingLegend: "Spacing",
    nameField: "Preset name", promptLabel: "Generated prompt",
    saveThis: "Save this DNA",
    saveNote: "Saved in this browser, ready to reuse on other pages.",
    previewTitle: "Live preview", desktop: "Desktop", mobile: "Mobile",
    toastCopied: "Prompt copied — paste it into your AI tool", toastCopyFail: "Copy failed, please retry", toastSaved: "Interface DNA saved",
    summaryTerms: ["Direction", "Colors", "Typography", "Radius", "Spacing", "Density"],
    swatchRoles: ["Accent", "Soft", "Canvas", "Ink"],
    unsaved: "Not saved", saved: "Saved", modified: "Unsaved changes",
    radiusText: (r) => `${r}px radius`,
    densityText: (name) => `${name} density`,
    presetMeta: (font, radius, spacing, density) => `Font ${font} · Radius ${radius}px · Spacing ${spacing}px · ${density} density`,
    toastPreset: (name) => `Preset applied: ${name}`,
    toastPalette: (name) => `Palette applied: ${name}`,
    untitled: "Untitled interface DNA",
  },
};
const t = (key) => STR[LANG()][key] ?? STR.zh[key];

const state = { style: "restrained", density: "balanced", palette: "sage", font: "sans", radius: "14", spacing: "10", device: "desktop" };
const presets = [
  { id: "restrained", label: "克制 · 鼠尾草绿", labelEn: "Restrained · Sage green", desc: "留白、秩序、柔和。绿色点缀的中性界面，适合内容型产品。", descEn: "Whitespace, order and softness. A neutral interface with green accents for content products.", style: "restrained", palette: "sage", font: "sans", radius: "14", spacing: "10", density: "balanced" },
  { id: "editorial", label: "编辑感 · 墨黑灰", labelEn: "Editorial · Ink black", desc: "字体、网格、对比。衬线标题与直角卡片，内容感强。", descEn: "Typography, grid and contrast. Serif headlines with sharp cards for content-heavy sites.", style: "editorial", palette: "ink", font: "serif", radius: "0", spacing: "6", density: "compact" },
  { id: "vivid", label: "活力 · 暖珊瑚", labelEn: "Vivid · Warm coral", desc: "高对比、丰富、直接。大圆角与暖色调，消费与营销场景。", descEn: "High contrast, rich and direct. Big radii with warm tones for consumer and marketing sites.", style: "vivid", palette: "coral", font: "sans", radius: "28", spacing: "10", density: "compact" },
  { id: "future", label: "未来感 · 深海蓝", labelEn: "Futuristic · Deep blue", desc: "深邃、精致、氛围。等宽字体与宽松间距，工具型产品。", descEn: "Deep, precise and atmospheric. Mono type with relaxed spacing for tool products.", style: "future", palette: "blue", font: "mono", radius: "14", spacing: "14", density: "balanced" },
  { id: "atelier", label: "工坊 · 墨黑灰", labelEn: "Atelier · Ink black", desc: "无衬线排版配大圆角与宽松节奏，作品集与工作室气质。", descEn: "Sans typography with big radii and a relaxed rhythm for studios and portfolios.", style: "editorial", palette: "ink", font: "sans", radius: "28", spacing: "14", density: "loose" },
  { id: "editorial-coral", label: "柑橘 · 暖珊瑚", labelEn: "Citrus · Warm coral", desc: "衬线文字与适中圆角，编辑感与暖色并存的杂志界面。", descEn: "Serif type with moderate radii — a magazine interface where editorial meets warm color.", style: "vivid", palette: "coral", font: "serif", radius: "14", spacing: "6", density: "balanced" },
];
const directionCases = { restrained: "fithub", editorial: "organique", vivid: "plate-play", future: "volt-route" };
let activePresetId = "restrained";
let currentPresetRef = null;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const presetLabel = (preset) => (LANG() === "en" ? preset.labelEn || preset.label : preset.label);

function setPresetLabelRef(ref) {
  currentPresetRef = ref;
  refreshPresetButtonLabel();
  renderPresetList($("[data-preset-search]")?.value || "");
}

function refreshPresetButtonLabel() {
  const node = $("[data-preset-label]");
  if (!node) return;
  const prefix = t("presetPrefix");
  if (!currentPresetRef) { node.textContent = `${prefix} · ${LANG() === "en" ? "Custom" : "自定义"}`; return; }
  if (currentPresetRef.kind === "bundle") {
    const preset = presets.find((item) => item.id === currentPresetRef.id);
    node.textContent = `${prefix} · ${(presetLabel(preset) || "").split(" · ")[0]}`;
    return;
  }
  const palette = paletteFor(currentPresetRef.key);
  node.textContent = `${prefix} · ${paletteName(currentPresetRef.key) || palette.label}`;
}

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
  setPresetLabelRef(null);
}

function selectStyle(button) {
  const preset = presets.find((item) => item.style === button.dataset.style);
  if (preset) { applyPreset(preset, { silent: true }); return; }
  state.style = button.dataset.style;
  syncDirectionCards();
  syncChoiceGroups();
  applyPreview();
  setPresetLabelRef(null);
}

function syncDirectionCards() {
  $$(".direction-card").forEach((item) => { const selected = item.dataset.style === state.style; item.classList.toggle("is-selected", selected); item.setAttribute("aria-checked", String(selected)); });
}

function applyPreset(preset, { silent = false } = {}) {
  activePresetId = preset.id;
  Object.assign(state, { style: preset.style, density: preset.density, palette: preset.palette, font: preset.font, radius: preset.radius, spacing: preset.spacing });
  syncDirectionCards();
  syncChoiceGroups();
  setPresetLabelRef({ kind: "bundle", id: preset.id });
  applyPreview();
  updateDirectionCaseLink();
  if (!silent) { renderPresetList(); toast(t("toastPreset")(presetLabel(preset))); }
}

function applyCatalogPreset(preset) {
  extraPalettes[preset.paletteKey] = { label: preset.label, labelEn: preset.labelEn, colors: preset.colors };
  state.palette = preset.paletteKey;
  syncChoiceGroups();
  setPresetLabelRef({ kind: "palette", key: preset.paletteKey });
  applyPreview();
  renderPresetList($("[data-preset-search]")?.value || "");
  toast(t("toastPalette")(presetName(preset.paletteKey)));
}

function updateDirectionCaseLink() {
  const link = $("[data-direction-case-link]");
  const caseId = directionCases[state.style];
  if (link && caseId) link.href = `./library.html?case=${caseId}&lang=${document.documentElement.lang.startsWith("zh") ? "zh" : "en"}`;
}

function scaleDirectionDemos() {
  $$(".direction-live").forEach((wrap) => {
    const frame = wrap.querySelector("iframe");
    if (!frame || !wrap.clientWidth) return;
    wrap.style.setProperty("--demo-scale", String(wrap.clientWidth / 1180));
  });
}
window.addEventListener("resize", scaleDirectionDemos);

function syncChoiceGroups() {
  ["density", "palette", "font", "radius", "spacing"].forEach((group) => {
    $$(`[data-choice-group="${group}"] button`).forEach((item) => {
      const selected = item.dataset.value === state[group];
      item.classList.toggle("is-selected", selected);
      if (item.getAttribute("role") === "radio") item.setAttribute("aria-checked", String(selected));
    });
  });
  $$('[data-choice-select]').forEach((select) => { select.value = state[select.dataset.choiceSelect]; });
}

function renderFontDescription() {
  const node = $("[data-font-description]");
  if (node) node.textContent = fontDescriptionSets[LANG()][state.font];
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
  $("#dockFont").textContent = L().font[state.font];
  $("#dockRadius").textContent = t("radiusText")(state.radius);
  $("#dockDensity").textContent = t("densityText")(L().density[state.density]);
  renderFontDescription();
  renderSummary();
  renderPrompt();
  renderSectionValues();
}

function renderSectionValues() {
  const direction = $('[data-section-value="direction"]');
  const rules = $('[data-section-value="rules"]');
  if (direction) direction.textContent = `${L().style[state.style]} · ${L().density[state.density]}`;
  if (rules) rules.textContent = `${paletteName(state.palette)} · ${L().font[state.font]}`;
  const saveChip = $("#dna-save .dna-section-value");
  if (saveChip) {
    if (saveChip.dataset.state === "saved") saveChip.textContent = t("saved");
    else if (saveChip.dataset.state === "modified") saveChip.textContent = t("modified");
    else saveChip.textContent = t("unsaved");
  }
}

function renderSummary() {
  const summary = $("#dnaSummary");
  if (!summary) return;
  const terms = t("summaryTerms");
  const rows = [[terms[0], L().style[state.style]], [terms[1], paletteName(state.palette)], [terms[2], L().font[state.font]], [terms[3], `${L().radius[state.radius]} · ${state.radius}px`], [terms[4], `${L().spacing[state.spacing]} · ${state.spacing}px`], [terms[5], L().density[state.density]]];
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
  return { name: $("#dnaName")?.value.trim() || t("untitled"), updatedAt: new Date().toISOString(), ...Object.fromEntries(Object.entries(state).filter(([key]) => !["device"].includes(key))), paletteLabel: paletteName(state.palette), colors: paletteFor(state.palette).colors };
}
function dnaText() {
  const en = LANG() === "en";
  const data = dnaPayload();
  if (en) {
    return [`Interface DNA: ${data.name}`, `Direction: ${L().style[data.style]}`, `Colors: ${paletteName(data.palette)} (${data.colors.join(" / ")})`, `Typography: ${L().font[data.font]}`, `Radius: ${data.radius}px`, `Base spacing: ${data.spacing}px`, `Density: ${L().density[data.density]}`, "Reuse rule: new pages should inherit these visual rules and only adjust content structure per task."].join("\n");
  }
  return [`界面设计 DNA：${data.name}`, `设计方向：${L().style[data.style]}`, `颜色：${paletteName(data.palette)}（${data.colors.join(" / ")}）`, `字体：${L().font[data.font]}`, `圆角：${data.radius}px`, `基础间距：${data.spacing}px`, `界面密度：${L().density[data.density]}`, "复用要求：新页面应继承以上视觉规则，仅根据页面任务调整内容结构。"].join("\n");
}
function toast(message) { const node = $("#dnaToast"); if (!node) return; node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; }, 2200); }
async function copyDna() { try { await navigator.clipboard.writeText(dnaText()); toast(t("toastCopied")); } catch { toast(t("toastCopyFail")); } }
function saveDna() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dnaPayload()));
  $("#saveNote").textContent = t("saveNote");
  const saveChip = $("#dna-save .dna-section-value");
  if (saveChip) { saveChip.dataset.state = "saved"; saveChip.textContent = t("saved"); }
  toast(t("toastSaved"));
}

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
  $$('[data-choice-select]').forEach((select) => select.addEventListener("change", () => {
    state[select.dataset.choiceSelect] = select.value;
    applyPreview();
    setPresetLabelRef(null);
  }));
  $$("[data-scroll]").forEach((button) => button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    if (target) {
      if (target.tagName === "DETAILS") target.open = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }));
  $$("[data-device]").forEach((button) => button.addEventListener("click", () => { state.device = button.dataset.device; $$("[data-device]").forEach((item) => item.classList.toggle("is-selected", item === button)); $("[data-preview-stage]").classList.toggle("is-mobile", state.device === "mobile"); }));
  $('[data-preview-picker]')?.addEventListener("change", (event) => {
    $$(".sample-view").forEach((view) => {
      const active = view.dataset.view === event.target.value;
      view.hidden = !active;
      view.classList.toggle("is-active", active);
    });
  });
  $("#saveDna")?.addEventListener("click", saveDna); $("#copyDna")?.addEventListener("click", copyDna);
}

function installSectionDropdowns() {
  const sections = $$(".dna-controls > details");
  sections.forEach((section) => section.addEventListener("toggle", () => {
    if (!section.open) return;
    sections.forEach((other) => { if (other !== section) other.open = false; });
  }));
}


function renderPresetDetail(preset) {
  const detail = $("[data-preset-detail]");
  if (!detail) return;
  const roles = t("swatchRoles");
  const swatches = (preset.kind === "palette" ? preset.colors : paletteFor(preset.palette).colors).map((color, index) => `<figure><i style="background:${color}"></i><figcaption><b>${color}</b><small>${roles[index] || ""}</small></figcaption></figure>`).join("");
  if (preset.kind === "palette") {
    const tags = preset.tags.length ? `<p class="dna-preset-tags">${preset.tags.map((tag) => `<span>${tag}</span>`).join("")}</p>` : "";
    detail.innerHTML = `<h3>${presetLabel(preset)}</h3><p>${preset.desc}</p>${tags}<div class="dna-preset-swatches">${swatches}</div>`;
    return;
  }
  detail.innerHTML = `<h3>${presetLabel(preset)}</h3><p>${LANG() === "en" ? preset.descEn : preset.desc}</p><p class="dna-preset-meta">${t("presetMeta")(L().font[preset.font], preset.radius, preset.spacing, L().density[preset.density])}</p><div class="dna-preset-swatches">${swatches}</div>`;
}

function renderPresetList(filter = "") {
  const list = $("[data-preset-list]");
  if (!list) return;
  const query = filter.trim().toLowerCase();
  const matches = (preset) => !query || `${preset.label}${preset.labelEn || ""}${preset.desc}${preset.descEn || ""}${preset.tags ? preset.tags.join("") : ""}`.toLowerCase().includes(query);
  const bundleItems = presets.filter(matches);
  const catalogItems = catalogPresets.filter(matches);
  const bundleHtml = bundleItems.map((preset) => {
    const selected = currentPresetRef?.kind === "bundle" ? currentPresetRef.id === preset.id : false;
    return `<button type="button" role="option" aria-selected="${selected}" class="dna-preset-item${selected ? " is-selected" : ""}" data-preset-kind="bundle" data-preset-id="${preset.id}"><span>${presetLabel(preset)}</span><small>${L().font[preset.font]} · ${preset.radius}px</small></button>`;
  }).join("");
  const catalogHtml = catalogItems.map((preset) => {
    const selected = state.palette === preset.paletteKey;
    return `<button type="button" role="option" aria-selected="${selected}" class="dna-preset-item${selected ? " is-selected" : ""}" data-preset-kind="palette" data-preset-id="${preset.id}"><span>${presetLabel(preset)}</span><small>${preset.colors[0]}</small></button>`;
  }).join("");
  list.innerHTML = (bundleItems.length ? `<p class="dna-preset-group">${t("groupDna")}</p>${bundleHtml}` : "")
    + (catalogItems.length ? `<p class="dna-preset-group">${t("groupCatalog")}</p>${catalogHtml}` : "")
    + (!bundleItems.length && !catalogItems.length ? `<p class="dna-preset-empty">${t("noMatch")}</p>` : "");
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

window.image2I18n?.addTranslations({
  "dna.heroTitle": { zh: "界面设计 DNA", en: "Interface DNA" },
  "dna.heroLede": { zh: "先选一个设计方向，再按需调整规范。每次只处理一组决定，右侧同步看到真实页面效果。", en: "Pick a design direction, then adjust the foundation as needed — one decision at a time, with the real page effect syncing on the right." },
  "dna.copyPrompt": { zh: "复制提示词", en: "Copy prompt" },
  "dna.saveDna": { zh: "保存 DNA", en: "Save DNA" },
  "dna.searchPlaceholder": { zh: "搜索设计 DNA", en: "Search design DNA" },
  "dna.clear": { zh: "清除", en: "Clear" },
  "dna.directionTitle": { zh: "视觉方向", en: "Visual direction" },
  "dna.directionDesc": { zh: "先确定整体气质，密度随之匹配。", en: "Set the overall temperament first; density follows." },
  "dna.dirRestrained": { zh: "克制", en: "Restrained" },
  "dna.dirRestrainedDesc": { zh: "留白、秩序、柔和 · 案例「极简训练规划」", en: "Whitespace, order, softness · Case: FitHub" },
  "dna.dirEditorial": { zh: "编辑感", en: "Editorial" },
  "dna.dirEditorialDesc": { zh: "字体、网格、对比 · 案例「编辑式有机餐食」", en: "Typography, grid, contrast · Case: Organique Food" },
  "dna.dirVivid": { zh: "活力", en: "Vivid" },
  "dna.dirVividDesc": { zh: "高对比、丰富、直接 · 案例「高彩插画食谱」", en: "High contrast, rich, direct · Case: Plate Play" },
  "dna.dirFuture": { zh: "未来感", en: "Futuristic" },
  "dna.dirFutureDesc": { zh: "深邃、精致、氛围 · 案例「暗色电车充电导航」", en: "Deep, precise, atmospheric · Case: Volt Route" },
  "dna.densityLegend": { zh: "界面密度", en: "Density" },
  "dna.densityLoose": { zh: "宽松", en: "Loose" },
  "dna.densityBalanced": { zh: "平衡", en: "Balanced" },
  "dna.densityCompact": { zh: "紧凑", en: "Compact" },
  "dna.hintPre": { zh: "方向已绑定案例库真实案例效果，", en: "Each direction is bound to a real case-library demo — " },
  "dna.hintLink": { zh: "在案例库中打开当前方向的案例", en: "open the current direction's case in the library" },
  "dna.rulesTitle": { zh: "基础规范", en: "Foundation" },
  "dna.rulesDesc": { zh: "颜色、字体、圆角与间距。", en: "Colors, typography, radius and spacing." },
  "dna.colorLegend": { zh: "颜色", en: "Colors" },
  "dna.paletteSage": { zh: "鼠尾草绿", en: "Sage green" },
  "dna.paletteInk": { zh: "墨黑灰", en: "Ink black" },
  "dna.paletteBlue": { zh: "深海蓝", en: "Deep blue" },
  "dna.paletteCoral": { zh: "暖珊瑚", en: "Warm coral" },
  "dna.fontLegend": { zh: "字体气质", en: "Typography" },
  "dna.radiusLegend": { zh: "圆角", en: "Radius" },
  "dna.spacingLegend": { zh: "间距", en: "Spacing" },
  "dna.fontSans": { zh: "简洁无衬线", en: "Clean sans" },
  "dna.fontSansDesc": { zh: "现代、清晰、通用", en: "Modern, clear, universal" },
  "dna.fontSerif": { zh: "编辑衬线", en: "Editorial serif" },
  "dna.fontSerifDesc": { zh: "内容感、文化感", en: "Content and culture" },
  "dna.fontMono": { zh: "几何等宽", en: "Geometric mono" },
  "dna.fontMonoDesc": { zh: "理性、工具感", en: "Rational, tool-like" },
  "dna.fontHei": { zh: "浓黑标题", en: "Bold display" },
  "dna.fontHeiDesc": { zh: "浓重、醒目、主张", en: "Heavy, striking, opinionated" },
  "dna.fontKai": { zh: "楷书人文", en: "Brush humanist" },
  "dna.fontKaiDesc": { zh: "人文、书法、温度", en: "Humanist, calligraphic, warm" },
  "dna.fontFangsong": { zh: "仿宋文献", en: "Fangsong classic" },
  "dna.fontFangsongDesc": { zh: "规范、文献、报刊", en: "Formal, documentary, press" },
  "dna.fontYuan": { zh: "圆润亲和", en: "Rounded friendly" },
  "dna.fontYuanDesc": { zh: "亲和、轻松、消费", en: "Friendly, relaxed, consumer" },
  "dna.fontGeometric": { zh: "几何西文", en: "Geometric latin" },
  "dna.fontGeometricDesc": { zh: "几何、现代、品牌", en: "Geometric, modern, brand" },
  "dna.radiusSharp": { zh: "直角", en: "Sharp" },
  "dna.radiusModerate": { zh: "适中", en: "Moderate" },
  "dna.radiusRounded": { zh: "圆润", en: "Rounded" },
  "dna.spacingCompact": { zh: "紧凑", en: "Compact" },
  "dna.spacingBalanced": { zh: "平衡", en: "Balanced" },
  "dna.spacingRelaxed": { zh: "宽松", en: "Relaxed" },
  "dna.saveTitle": { zh: "保存并复用", en: "Save & reuse" },
  "dna.saveDesc": { zh: "命名、检查并复制这套 DNA。", en: "Name, review and copy this DNA." },
  "dna.nameField": { zh: "规范名称", en: "Preset name" },
  "dna.promptLabel": { zh: "生成的提示词", en: "Generated prompt" },
  "dna.saveThis": { zh: "保存这套 DNA", en: "Save this DNA" },
  "dna.previewTitle": { zh: "实时预览", en: "Live preview" },
  "dna.deviceDesktop": { zh: "桌面", en: "Desktop" },
  "dna.deviceMobile": { zh: "移动", en: "Mobile" },
  "dna.compLanding": { zh: "落地页", en: "Landing" },
  "dna.compNav": { zh: "导航", en: "Nav" },
  "dna.compCards": { zh: "卡片组", en: "Cards" },
  "dna.compForm": { zh: "表单", en: "Form" },
  "dna.compPricing": { zh: "定价", en: "Pricing" },
  "dna.compDash": { zh: "数据后台", en: "Dashboard" },
  "footer.learn": { zh: "学习路径", en: "Learning path" },
  "footer.vocabulary": { zh: "UI 词典", en: "UI vocabulary" },
  "footer.library": { zh: "案例库", en: "Case library" },
  "dna.pageArticle": { zh: "文章页", en: "Article" },
  "dna.pageProduct": { zh: "商品详情", en: "Product" },
  "dna.pageSettings": { zh: "设置页", en: "Settings" },
  "dna.pickerLabel": { zh: "预览内容", en: "Preview" },
  "dna.groupPages": { zh: "页面", en: "Pages" },
  "dna.groupComponents": { zh: "组件", en: "Components" },
  "dna.unsaved": { zh: "未保存", en: "Not saved" },
  "dna.saved": { zh: "已保存", en: "Saved" },
  "dna.modified": { zh: "有未保存修改", en: "Unsaved changes" },
});

restoreDna(); installEvents(); installSectionDropdowns(); installPresetDropdown();
const matchedPreset = presets.find((item) => item.style === state.style && item.palette === state.palette && item.font === state.font && item.radius === state.radius && item.spacing === state.spacing && item.density === state.density);
setPresetLabelRef(matchedPreset ? { kind: "bundle", id: matchedPreset.id } : state.palette?.startsWith("lab:") ? { kind: "palette", key: state.palette } : null);
syncChoiceGroups(); applyPreview(); renderPrompt(); updateDirectionCaseLink(); scaleDirectionDemos();

// Re-render every language-dependent surface when the site language changes.
window.addEventListener("image2:languagechange", () => {
  applyPreview();
  renderPresetList($("[data-preset-search]")?.value || "");
  refreshPresetButtonLabel();
  updateDirectionCaseLink();
});
