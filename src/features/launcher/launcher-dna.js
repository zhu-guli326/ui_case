const STORAGE_KEY = "ondesign:interface-dna:v3";
const LANG = () => (window.image2I18n?.language === "en" ? "en" : "zh");

const fallbackPalettes = {
  sage: { label: "鼠尾草绿", labelEn: "Sage green", colors: ["#18a957", "#e7f5ec", "#f6f5f1", "#fffefa", "#24231f", "#77746d"] },
  ink: { label: "墨黑灰", labelEn: "Ink black", colors: ["#111111", "#e8e8e4", "#f5f4f0", "#ffffff", "#252724", "#747474"] },
  blue: { label: "深海蓝", labelEn: "Deep blue", colors: ["#2457e6", "#e7edff", "#f2f5ff", "#ffffff", "#17213c", "#65708c"] },
  coral: { label: "暖珊瑚", labelEn: "Warm coral", colors: ["#e4573d", "#fff0e8", "#fff7f2", "#ffffff", "#321d18", "#8b6d63"] },
};

const FONT_PRESETS = [
  { id: "system-sans", group: "system", zh: "系统无衬线", en: "System sans", descZh: "System UI · PingFang SC", descEn: "System UI · PingFang SC", stack: 'system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif' },
  { id: "songti", group: "system", zh: "宋体", en: "Songti", descZh: "Songti SC · SimSun", descEn: "Songti SC · SimSun", stack: '"Songti SC","STSong","SimSun","Noto Serif SC",Georgia,serif' },
  { id: "mono", group: "system", zh: "等宽", en: "Monospace", descZh: "SFMono · Consolas", descEn: "SFMono · Consolas", stack: 'ui-monospace,"SFMono-Regular",Consolas,"Liberation Mono",monospace' },
  { id: "hei", group: "system", zh: "黑体", en: "Heiti", descZh: "SimHei · Microsoft YaHei", descEn: "SimHei · Microsoft YaHei", stack: '"SimHei","Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif' },
  { id: "kaiti", group: "system", zh: "楷体", en: "Kaiti", descZh: "Kaiti SC · KaiTi", descEn: "Kaiti SC · KaiTi", stack: '"Kaiti SC","STKaiti",KaiTi,"TW-Kai",cursive' },
  { id: "fangsong", group: "system", zh: "仿宋", en: "Fangsong", descZh: "STFangsong · FangSong", descEn: "STFangsong · FangSong", stack: '"Fangsong SC","STFangsong",FangSong,"SimSun",serif' },
  { id: "yuan", group: "system", zh: "圆体", en: "Rounded CJK", descZh: "Yuanti SC · YouYuan", descEn: "Yuanti SC · YouYuan", stack: '"Yuanti SC",YouYuan,"PingFang SC","Microsoft YaHei",sans-serif' },
  { id: "geometric", group: "system", zh: "几何无衬线", en: "Geometric sans", descZh: "Futura · Century Gothic", descEn: "Futura · Century Gothic", stack: 'Futura,"Century Gothic","Avenir Next","Trebuchet MS",sans-serif' },
  { id: "noto-sans-sc", group: "google-cjk", zh: "Noto Sans SC", en: "Noto Sans SC", descZh: "Google Fonts · 中文无衬线", descEn: "Google Fonts · CJK sans", stack: '"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif' },
  { id: "noto-serif-sc", group: "google-cjk", zh: "Noto Serif SC", en: "Noto Serif SC", descZh: "Google Fonts · 中文衬线", descEn: "Google Fonts · CJK serif", stack: '"Noto Serif SC","Songti SC","SimSun",serif' },
  { id: "zcool-qingke", group: "google-cjk", zh: "ZCOOL QingKe HuangYou", en: "ZCOOL QingKe HuangYou", descZh: "Google Fonts · 中文标题", descEn: "Google Fonts · CJK display", stack: '"ZCOOL QingKe HuangYou","Noto Sans SC","Microsoft YaHei",sans-serif' },
  { id: "zcool-xiaowei", group: "google-cjk", zh: "ZCOOL XiaoWei", en: "ZCOOL XiaoWei", descZh: "Google Fonts · 中文衬线", descEn: "Google Fonts · CJK serif", stack: '"ZCOOL XiaoWei","Noto Serif SC","Songti SC",serif' },
  { id: "ma-shan-zheng", group: "google-cjk", zh: "Ma Shan Zheng", en: "Ma Shan Zheng", descZh: "Google Fonts · 中文手写", descEn: "Google Fonts · CJK handwriting", stack: '"Ma Shan Zheng","Kaiti SC",KaiTi,cursive' },
  { id: "long-cang", group: "google-cjk", zh: "Long Cang", en: "Long Cang", descZh: "Google Fonts · 中文书写", descEn: "Google Fonts · CJK handwriting", stack: '"Long Cang","Kaiti SC",KaiTi,cursive' },
  { id: "liu-jian-mao-cao", group: "google-cjk", zh: "Liu Jian Mao Cao", en: "Liu Jian Mao Cao", descZh: "Google Fonts · 中文草书", descEn: "Google Fonts · CJK cursive", stack: '"Liu Jian Mao Cao","Kaiti SC",KaiTi,cursive' },
  { id: "zhi-mang-xing", group: "google-cjk", zh: "Zhi Mang Xing", en: "Zhi Mang Xing", descZh: "Google Fonts · 中文行书", descEn: "Google Fonts · CJK running script", stack: '"Zhi Mang Xing","Kaiti SC",KaiTi,cursive' },
  { id: "inter", group: "google-latin", zh: "Inter", en: "Inter", descZh: "Google Fonts · UI 无衬线", descEn: "Google Fonts · UI sans", stack: 'Inter,"Noto Sans SC",system-ui,sans-serif' },
  { id: "manrope", group: "google-latin", zh: "Manrope", en: "Manrope", descZh: "Google Fonts · 几何无衬线", descEn: "Google Fonts · geometric sans", stack: 'Manrope,"Noto Sans SC",system-ui,sans-serif' },
  { id: "space-grotesk", group: "google-latin", zh: "Space Grotesk", en: "Space Grotesk", descZh: "Google Fonts · 科技无衬线", descEn: "Google Fonts · tech sans", stack: '"Space Grotesk","Noto Sans SC",system-ui,sans-serif' },
  { id: "playfair-display", group: "google-latin", zh: "Playfair Display", en: "Playfair Display", descZh: "Google Fonts · 编辑衬线", descEn: "Google Fonts · editorial serif", stack: '"Playfair Display","Noto Serif SC",Georgia,serif' },
  { id: "ibm-plex-mono", group: "google-latin", zh: "IBM Plex Mono", en: "IBM Plex Mono", descZh: "Google Fonts · 编程等宽", descEn: "Google Fonts · developer mono", stack: '"IBM Plex Mono",ui-monospace,Consolas,monospace' },
];
window.ONDesignFontPresets = FONT_PRESETS;

const labels = {
  zh: { style: { restrained: "克制", editorial: "编辑感", vivid: "活力", future: "未来感" }, density: { loose: "宽松", balanced: "平衡", compact: "紧凑" }, radius: { "0": "直角", "14": "适中", "28": "圆润" }, spacing: { "6": "紧凑", "10": "平衡", "14": "宽松" }, unsaved: "未保存", saved: "已保存", modified: "有未保存修改", designSystem: "设计规范", fallback: "自定义基础", saveNote: "已保存到当前浏览器，可继续用于其他页面。", copied: "提示词已复制", copyFail: "复制失败，请重试", savedToast: "界面 DNA 已保存" },
  en: { style: { restrained: "Restrained", editorial: "Editorial", vivid: "Vivid", future: "Futuristic" }, density: { loose: "Loose", balanced: "Balanced", compact: "Compact" }, radius: { "0": "Sharp", "14": "Moderate", "28": "Rounded" }, spacing: { "6": "Compact", "10": "Balanced", "14": "Relaxed" }, unsaved: "Not saved", saved: "Saved", modified: "Unsaved changes", designSystem: "Design system", fallback: "Custom foundation", saveNote: "Saved in this browser, ready to reuse on other pages.", copied: "Prompt copied", copyFail: "Copy failed, please retry", savedToast: "Interface DNA saved" },
};
const L = () => labels[LANG()];
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const fontById = (id) => FONT_PRESETS.find((font) => font.id === id) || FONT_PRESETS[0];
const fontName = (id) => LANG() === "en" ? fontById(id).en : fontById(id).zh;
const paletteName = (key) => LANG() === "en" ? fallbackPalettes[key].labelEn : fallbackPalettes[key].label;
const px = (value, fallback) => { const match = String(value || "").match(/-?\d+(?:\.\d+)?/); return match ? Number(match[0]) : fallback; };

const state = {
  style: "restrained",
  density: "balanced",
  palette: "sage",
  font: "system-sans",
  radius: "14",
  spacing: "10",
  device: "desktop",
  designSystem: null,
  designSystemBase: null,
  overrides: { font: false, radius: false, spacing: false },
};

const directionDefaults = {
  restrained: { palette: "sage", font: "system-sans", radius: "14", spacing: "10", density: "balanced" },
  editorial: { palette: "ink", font: "noto-serif-sc", radius: "0", spacing: "6", density: "compact" },
  vivid: { palette: "coral", font: "noto-sans-sc", radius: "28", spacing: "10", density: "compact" },
  future: { palette: "blue", font: "ibm-plex-mono", radius: "14", spacing: "14", density: "balanced" },
};
const directionCases = { restrained: "fithub", editorial: "organique", vivid: "plate-play", future: "volt-route" };

function currentRootToken(name, fallback = "") {
  return document.documentElement.style.getPropertyValue(name).trim() || getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function fallbackBase() {
  const palette = fallbackPalettes[state.palette] || fallbackPalettes.sage;
  return {
    name: paletteName(state.palette),
    accent: palette.colors[0],
    accentSoft: palette.colors[1],
    canvas: palette.colors[2],
    surface: palette.colors[3],
    ink: palette.colors[4],
    muted: palette.colors[5],
    fontStack: fontById(state.font).stack,
    fontName: fontName(state.font),
    radius: Number(state.radius),
    spacing: Number(state.spacing),
  };
}

function effectiveTokens() {
  const base = state.designSystemBase || fallbackBase();
  const densityScale = { loose: 1.2, balanced: 1, compact: .82 }[state.density] || 1;
  return {
    ...base,
    fontStack: state.designSystemBase && !state.overrides.font ? base.fontStack : fontById(state.font).stack,
    fontName: state.designSystemBase && !state.overrides.font ? base.fontName : fontName(state.font),
    radius: state.designSystemBase && !state.overrides.radius ? base.radius : Number(state.radius),
    spacing: (state.designSystemBase && !state.overrides.spacing ? base.spacing : Number(state.spacing)) * densityScale,
  };
}

function applyTokens() {
  const token = effectiveTokens();
  const root = document.documentElement;
  root.style.setProperty("--dna-accent", token.accent);
  root.style.setProperty("--dna-accent-soft", token.accentSoft || `color-mix(in srgb, ${token.accent} 12%, ${token.surface})`);
  root.style.setProperty("--dna-canvas", token.canvas);
  root.style.setProperty("--dna-surface", token.surface);
  root.style.setProperty("--dna-ink", token.ink);
  root.style.setProperty("--dna-muted", token.muted);
  root.style.setProperty("--dna-radius", `${Math.max(0, token.radius)}px`);
  root.style.setProperty("--ds-radius", `${Math.max(0, token.radius)}px`);
  root.style.setProperty("--dna-space", `${Math.max(4, token.spacing)}px`);
  root.style.setProperty("--dna-display", token.fontStack);
  root.style.setProperty("--dna-body", token.fontStack);
  root.style.setProperty("--ant-primary", token.accent);
  root.style.setProperty("--ant-primary-hover", `color-mix(in srgb, ${token.accent} 82%, black)`);
  root.style.setProperty("--ant-primary-bg", token.accentSoft || `color-mix(in srgb, ${token.accent} 10%, ${token.surface})`);
  root.style.setProperty("--ant-bg-layout", token.canvas);
  root.style.setProperty("--ant-bg-container", token.surface);
  root.style.setProperty("--ant-text", token.ink);
  root.style.setProperty("--ant-text-secondary", token.muted);
  root.style.setProperty("--ant-border", `color-mix(in srgb, ${token.ink} 16%, ${token.surface})`);
  root.style.setProperty("--ant-border-secondary", `color-mix(in srgb, ${token.ink} 8%, ${token.surface})`);
  root.style.setProperty("--ant-radius", `${Math.max(0, token.radius)}px`);
  document.body.dataset.style = state.style;
  if (state.designSystem?.slug) document.body.dataset.designSystem = state.designSystem.slug;
  renderAll();
}

function syncDirectionCards() {
  $$(".direction-card").forEach((item) => {
    const selected = item.dataset.style === state.style;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-checked", String(selected));
  });
}

function syncChoiceGroups() {
  ["density", "radius", "spacing"].forEach((group) => {
    $$(`[data-choice-group="${group}"] button`).forEach((item) => {
      let selected = item.dataset.value === state[group];
      if (state.designSystemBase && (group === "radius" || group === "spacing") && !state.overrides[group]) selected = false;
      item.classList.toggle("is-selected", selected);
      if (item.getAttribute("role") === "radio") item.setAttribute("aria-checked", String(selected));
    });
  });
  const select = $("[data-font-select]");
  if (select && state.designSystemBase && !state.overrides.font) {
    let option = select.querySelector('option[value="__design-system__"]');
    if (!option) {
      option = document.createElement("option");
      option.value = "__design-system__";
      select.prepend(option);
    }
    option.textContent = `${LANG() === "en" ? "Design System" : "设计规范"} · ${state.designSystemBase.fontName}`;
    select.value = "__design-system__";
  } else if (select && [...select.options].some((option) => option.value === state.font)) {
    select.value = state.font;
  }
}

function renderFontDescription() {
  const node = $("[data-font-description]");
  if (!node) return;
  if (state.designSystemBase && !state.overrides.font) node.textContent = `${state.designSystem?.name || L().designSystem} · ${state.designSystemBase.fontName}`;
  else node.textContent = LANG() === "en" ? fontById(state.font).descEn : fontById(state.font).descZh;
}

function renderSectionValues() {
  const direction = $('[data-section-value="direction"]');
  const rules = $('[data-section-value="rules"]');
  if (direction) direction.textContent = `${L().style[state.style]} · ${L().density[state.density]}`;
  if (rules) {
    const token = effectiveTokens();
    rules.textContent = state.designSystem
      ? `${state.designSystem.name} · ${token.fontName}`
      : `${paletteName(state.palette)} · ${token.fontName}`;
  }
  const saveChip = $("#dna-save .dna-section-value");
  if (saveChip && !saveChip.dataset.state) saveChip.dataset.state = "unsaved";
  if (saveChip) saveChip.textContent = L()[saveChip.dataset.state] || L().unsaved;
}

function renderSummary() {
  const summary = $("#dnaSummary");
  if (!summary) return;
  const token = effectiveTokens();
  const rows = LANG() === "en"
    ? [["Design system", state.designSystem?.name || "Custom foundation"], ["Direction", L().style[state.style]], ["Typography", token.fontName], ["Radius", `${Math.round(token.radius)}px${state.overrides.radius ? " · override" : ""}`], ["Spacing", `${Math.round(token.spacing)}px${state.overrides.spacing ? " · override" : ""}`], ["Density", L().density[state.density]]]
    : [["设计规范", state.designSystem?.name || "自定义基础"], ["设计方向", L().style[state.style]], ["字体", token.fontName], ["圆角", `${Math.round(token.radius)}px${state.overrides.radius ? " · 已微调" : ""}`], ["间距", `${Math.round(token.spacing)}px${state.overrides.spacing ? " · 已微调" : ""}`], ["密度", L().density[state.density]]];
  summary.replaceChildren(...rows.map(([term, value]) => {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = value;
    row.append(dt, dd);
    return row;
  }));
}

function dnaText() {
  const token = effectiveTokens();
  const name = $("#dnaName")?.value.trim() || (LANG() === "en" ? "Untitled interface DNA" : "未命名界面 DNA");
  if (LANG() === "en") return [
    `Interface DNA: ${name}`,
    `Design system: ${state.designSystem?.name || "Custom foundation"}`,
    `Direction: ${L().style[state.style]}`,
    `Colors: accent ${token.accent}; canvas ${token.canvas}; surface ${token.surface}; ink ${token.ink}; muted ${token.muted}`,
    `Typography: ${token.fontName}${state.overrides.font ? " (override)" : ""}`,
    `Radius: ${Math.round(token.radius)}px${state.overrides.radius ? " (override)" : ""}`,
    `Spacing: ${Math.round(token.spacing)}px${state.overrides.spacing ? " (override)" : ""}`,
    `Density: ${L().density[state.density]}`,
    "Reuse rule: treat the selected Design System as the base token source. Manual typography, radius and spacing choices are explicit overrides only.",
  ].join("\n");
  return [
    `界面设计 DNA：${name}`,
    `设计规范：${state.designSystem?.name || "自定义基础"}`,
    `设计方向：${L().style[state.style]}`,
    `颜色：主色 ${token.accent}；画布 ${token.canvas}；表面 ${token.surface}；文字 ${token.ink}；次级文字 ${token.muted}`,
    `字体：${token.fontName}${state.overrides.font ? "（已微调）" : ""}`,
    `圆角：${Math.round(token.radius)}px${state.overrides.radius ? "（已微调）" : ""}`,
    `间距：${Math.round(token.spacing)}px${state.overrides.spacing ? "（已微调）" : ""}`,
    `界面密度：${L().density[state.density]}`,
    "复用要求：以选中的 Design System 作为基础 Token 来源；字体、圆角和间距仅在用户主动调整时作为 Override。",
  ].join("\n");
}

function renderPrompt() {
  const node = $("#dnaPrompt");
  if (node) node.textContent = dnaText();
}

function renderDock() {
  const token = effectiveTokens();
  const colors = [token.accent, token.surface, token.canvas, token.ink];
  $$("#dockPalette i").forEach((item, index) => { item.style.background = colors[index]; });
  if ($("#dockFont")) $("#dockFont").textContent = token.fontName;
  if ($("#dockRadius")) $("#dockRadius").textContent = `${Math.round(token.radius)}px ${LANG() === "en" ? "radius" : "圆角"}`;
  if ($("#dockDensity")) $("#dockDensity").textContent = `${L().density[state.density]}${LANG() === "en" ? " density" : "密度"}`;
}

function renderAll() {
  syncDirectionCards();
  syncChoiceGroups();
  renderFontDescription();
  renderSectionValues();
  renderSummary();
  renderPrompt();
  renderDock();
}

function markModified() {
  const chip = $("#dna-save .dna-section-value");
  if (chip) chip.dataset.state = "modified";
}

function selectStyle(button) {
  const style = button.dataset.style;
  if (!style) return;
  state.style = style;
  const defaults = directionDefaults[style];
  if (!state.designSystemBase && defaults) Object.assign(state, defaults);
  markModified();
  applyTokens();
  updateDirectionCaseLink();
}

function selectInGroup(group, button) {
  const value = button.dataset.value;
  if (!value) return;
  state[group] = value;
  if (state.designSystemBase && (group === "radius" || group === "spacing")) state.overrides[group] = true;
  markModified();
  applyTokens();
}

function updateDirectionCaseLink() {
  const caseId = directionCases[state.style];
  const language = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
  const link = $("[data-direction-case-link]");
  if (link && caseId) link.href = `./library.html?case=${caseId}&lang=${language}`;
  $$("[data-direction-card-case]").forEach((caseLink) => { caseLink.href = `./library.html?case=${caseLink.dataset.directionCardCase}&lang=${language}`; });
}

function captureDesignSystem(event) {
  const detail = event.detail || {};
  const triggerSmall = $("[data-ds-trigger] small")?.textContent || "";
  const parts = triggerSmall.split("·").map((part) => part.trim()).filter(Boolean);
  const root = document.documentElement;
  state.designSystem = { slug: detail.slug || document.body.dataset.designSystem || "", name: detail.name || $("[data-ds-trigger] strong")?.textContent || L().designSystem };
  state.designSystemBase = {
    name: state.designSystem.name,
    accent: currentRootToken("--dna-accent", "#18a957"),
    accentSoft: currentRootToken("--dna-accent-soft", "#e7f5ec"),
    canvas: currentRootToken("--dna-canvas", "#f5f5f5"),
    surface: currentRootToken("--dna-surface", "#ffffff"),
    ink: currentRootToken("--dna-ink", "#202020"),
    muted: currentRootToken("--dna-muted", "#737373"),
    fontStack: currentRootToken("--dna-display", 'system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif'),
    fontName: parts.length >= 3 ? parts[1] : (parts[0] && parts[0] !== state.designSystem.name ? parts[0] : "Design System"),
    radius: Number(detail.radius ?? px(currentRootToken("--dna-radius"), 8)),
    spacing: px(currentRootToken("--dna-space"), 16),
  };
  state.overrides = { font: false, radius: false, spacing: false };
  if ($("#dnaName") && (!$("#dnaName").value || /Web DNA|克制绿/.test($("#dnaName").value))) $("#dnaName").value = `${state.designSystem.name} · Web DNA`;
  markModified();
  applyTokens();
}

function toast(message) {
  const node = $("#dnaToast");
  if (!node) return;
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { node.hidden = true; }, 2200);
}

async function copyDna() {
  try { await navigator.clipboard.writeText(dnaText()); toast(L().copied); }
  catch { toast(L().copyFail); }
}

function saveDna() {
  const payload = {
    name: $("#dnaName")?.value.trim() || "",
    updatedAt: new Date().toISOString(),
    style: state.style,
    density: state.density,
    palette: state.palette,
    font: state.font,
    radius: state.radius,
    spacing: state.spacing,
    designSystem: state.designSystem,
    overrides: state.overrides,
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
  if ($("#saveNote")) $("#saveNote").textContent = L().saveNote;
  const chip = $("#dna-save .dna-section-value");
  if (chip) { chip.dataset.state = "saved"; chip.textContent = L().saved; }
  toast(L().savedToast);
}

function restoreDna() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return;
    ["style", "density", "palette", "font", "radius", "spacing"].forEach((key) => { if (saved[key] != null) state[key] = String(saved[key]); });
    if (saved.name && $("#dnaName")) $("#dnaName").value = saved.name;
  } catch { try { localStorage.removeItem(STORAGE_KEY); } catch {} }
}

function installEvents() {
  $$(".direction-card").forEach((button) => button.addEventListener("click", () => selectStyle(button)));
  $$('[data-choice-group]').forEach((group) => group.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-value]");
    if (button) selectInGroup(group.dataset.choiceGroup, button);
  }));
  $("[data-font-select]")?.addEventListener("change", (event) => {
    if (event.target.value === "__design-system__") return;
    state.font = event.target.value;
    if (state.designSystemBase) state.overrides.font = true;
    markModified();
    applyTokens();
    window.dispatchEvent(new CustomEvent("ondesign:fontchange", { detail: { id: state.font, name: fontName(state.font) } }));
  });
  $$("[data-scroll]").forEach((button) => button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    if (!target) return;
    if (target.tagName === "DETAILS") target.open = true;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  $$("[data-device]").forEach((button) => button.addEventListener("click", () => {
    state.device = button.dataset.device;
    $$("[data-device]").forEach((item) => item.classList.toggle("is-selected", item === button));
    $("[data-preview-stage]")?.classList.toggle("is-mobile", state.device === "mobile");
  }));
  $('[data-preview-picker]')?.addEventListener("change", (event) => {
    $$(".sample-view").forEach((view) => {
      const active = view.dataset.view === event.target.value;
      view.hidden = !active;
      view.classList.toggle("is-active", active);
    });
  });
  $("#saveDna")?.addEventListener("click", saveDna);
  $("#copyDna")?.addEventListener("click", copyDna);
  window.addEventListener("ondesign:designsystemapply", captureDesignSystem);
  window.addEventListener("ondesign:designsystemchange", captureDesignSystem);
  window.addEventListener("image2:languagechange", () => { applyTokens(); updateDirectionCaseLink(); });
}

function installSectionDropdowns() {
  const sections = $$(".dna-controls > details");
  sections.forEach((section) => section.addEventListener("toggle", () => {
    if (!section.open) return;
    sections.forEach((other) => { if (other !== section) other.open = false; });
  }));
}

window.image2I18n?.addTranslations({
  "dna.heroTitle": { zh: "界面设计 DNA", en: "Interface DNA" },
  "dna.heroLede": { zh: "先选一个设计方向，再按需调整规范。每次只处理一组决定，右侧同步看到真实页面效果。", en: "Pick a design direction, then adjust the foundation as needed — one decision at a time, with the real page effect syncing on the right." },
  "dna.directionTitle": { zh: "视觉方向", en: "Visual direction" },
  "dna.directionDesc": { zh: "先确定整体气质，密度随之匹配。", en: "Set the overall temperament first; density follows." },
  "dna.dirRestrained": { zh: "克制", en: "Restrained" }, "dna.dirRestrainedDesc": { zh: "留白、秩序、柔和 · 案例「极简训练规划」", en: "Whitespace, order, softness · Case: FitHub" },
  "dna.dirEditorial": { zh: "编辑感", en: "Editorial" }, "dna.dirEditorialDesc": { zh: "字体、网格、对比 · 案例「编辑式有机餐食」", en: "Typography, grid, contrast · Case: Organique Food" },
  "dna.dirVivid": { zh: "活力", en: "Vivid" }, "dna.dirVividDesc": { zh: "高对比、丰富、直接 · 案例「高彩插画食谱」", en: "High contrast, rich, direct · Case: Plate Play" },
  "dna.dirFuture": { zh: "未来感", en: "Futuristic" }, "dna.dirFutureDesc": { zh: "深邃、精致、氛围 · 案例「暗色电车充电导航」", en: "Deep, precise, atmospheric · Case: Volt Route" },
  "dna.densityLegend": { zh: "界面密度", en: "Density" }, "dna.densityLoose": { zh: "宽松", en: "Loose" }, "dna.densityBalanced": { zh: "平衡", en: "Balanced" }, "dna.densityCompact": { zh: "紧凑", en: "Compact" },
  "dna.rulesTitle": { zh: "基础规范", en: "Foundation" }, "dna.rulesDesc": { zh: "设计规范、字体、圆角与间距。", en: "Design system, typography, radius and spacing." }, "dna.fontLegend": { zh: "字体", en: "Typography" },
  "dna.radiusLegend": { zh: "圆角", en: "Radius" }, "dna.radiusSharp": { zh: "直角", en: "Sharp" }, "dna.radiusModerate": { zh: "适中", en: "Moderate" }, "dna.radiusRounded": { zh: "圆润", en: "Rounded" },
  "dna.spacingLegend": { zh: "间距", en: "Spacing" }, "dna.spacingCompact": { zh: "紧凑", en: "Compact" }, "dna.spacingBalanced": { zh: "平衡", en: "Balanced" }, "dna.spacingRelaxed": { zh: "宽松", en: "Relaxed" },
  "dna.saveTitle": { zh: "保存并复用", en: "Save & reuse" }, "dna.saveDesc": { zh: "命名、检查并复制这套 DNA。", en: "Name, review and copy this DNA." }, "dna.nameField": { zh: "规范名称", en: "Preset name" }, "dna.promptLabel": { zh: "生成的提示词", en: "Generated prompt" }, "dna.saveThis": { zh: "保存这套 DNA", en: "Save this DNA" }, "dna.copyPrompt": { zh: "复制提示词", en: "Copy prompt" },
  "dna.previewTitle": { zh: "实时预览", en: "Live preview" }, "dna.deviceDesktop": { zh: "桌面", en: "Desktop" }, "dna.deviceMobile": { zh: "移动", en: "Mobile" }, "dna.pickerLabel": { zh: "预览内容", en: "Preview" },
  "dna.compLanding": { zh: "落地页", en: "Landing" }, "dna.compNav": { zh: "导航", en: "Nav" }, "dna.compCards": { zh: "卡片组", en: "Cards" }, "dna.compForm": { zh: "表单", en: "Form" }, "dna.compPricing": { zh: "定价", en: "Pricing" }, "dna.compDash": { zh: "数据后台", en: "Dashboard" }, "dna.pageArticle": { zh: "文章页", en: "Article" }, "dna.pageProduct": { zh: "商品详情", en: "Product" }, "dna.pageSettings": { zh: "设置页", en: "Settings" }, "dna.groupPages": { zh: "页面", en: "Pages" }, "dna.groupComponents": { zh: "组件", en: "Components" },
  "dna.unsaved": { zh: "未保存", en: "Not saved" }, "dna.saved": { zh: "已保存", en: "Saved" }, "dna.modified": { zh: "有未保存修改", en: "Unsaved changes" },
  "dna.hintPre": { zh: "方向已绑定案例库真实案例效果，", en: "Each direction is bound to a real case-library demo — " }, "dna.hintLink": { zh: "在案例库中打开当前方向的案例", en: "open the current direction's case in the library" },
  "footer.learn": { zh: "学习路径", en: "Learning path" }, "footer.vocabulary": { zh: "UI 词典", en: "UI vocabulary" }, "footer.library": { zh: "案例库", en: "Case library" },
});

restoreDna();
installEvents();
installSectionDropdowns();
applyTokens();
updateDirectionCaseLink();
