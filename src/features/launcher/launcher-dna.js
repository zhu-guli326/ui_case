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
    saveNote: "已保存到当前浏览器，可继续用于其他页面。",
    toastCopied: "提示词已复制，去 AI 工具里粘贴吧",
    toastCopyFail: "复制失败，请重试",
    toastSaved: "界面 DNA 已保存",
    summaryTerms: ["设计方向", "颜色", "字体", "圆角", "间距", "密度"],
    unsaved: "未保存",
    saved: "已保存",
    modified: "有未保存修改",
    radiusText: (r) => `${r}px 圆角`,
    densityText: (name) => `${name}密度`,
    untitled: "未命名界面 DNA",
  },
  en: {
    saveNote: "Saved in this browser, ready to reuse on other pages.",
    toastCopied: "Prompt copied — paste it into your AI tool",
    toastCopyFail: "Copy failed, please retry",
    toastSaved: "Interface DNA saved",
    summaryTerms: ["Direction", "Colors", "Typography", "Radius", "Spacing", "Density"],
    unsaved: "Not saved",
    saved: "Saved",
    modified: "Unsaved changes",
    radiusText: (r) => `${r}px radius`,
    densityText: (name) => `${name} density`,
    untitled: "Untitled interface DNA",
  },
};
const t = (key) => STR[LANG()][key] ?? STR.zh[key];

const state = { style: "restrained", density: "balanced", palette: "sage", font: "sans", radius: "14", spacing: "10", device: "desktop" };
const directionDefaults = {
  restrained: { palette: "sage", font: "sans", radius: "14", spacing: "10", density: "balanced" },
  editorial: { palette: "ink", font: "serif", radius: "0", spacing: "6", density: "compact" },
  vivid: { palette: "coral", font: "sans", radius: "28", spacing: "10", density: "compact" },
  future: { palette: "blue", font: "mono", radius: "14", spacing: "14", density: "balanced" },
};
const directionCases = { restrained: "fithub", editorial: "organique", vivid: "plate-play", future: "volt-route" };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function selectInGroup(group, button) {
  const value = button.dataset.value;
  if (!value) return;
  state[group] = value;
  syncChoiceGroups();
  applyPreview();
}

function selectStyle(button) {
  const style = button.dataset.style;
  if (!style) return;
  state.style = style;
  const defaults = directionDefaults[style];
  if (defaults) Object.assign(state, defaults);
  syncDirectionCards();
  syncChoiceGroups();
  applyPreview();
  updateDirectionCaseLink();
}

function syncDirectionCards() {
  $$(".direction-card").forEach((item) => {
    const selected = item.dataset.style === state.style;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-checked", String(selected));
  });
}

function updateDirectionCaseLink() {
  const caseId = directionCases[state.style];
  const language = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
  const link = $("[data-direction-case-link]");
  if (link && caseId) link.href = `./library.html?case=${caseId}&lang=${language}`;
  $$("[data-direction-card-case]").forEach((caseLink) => {
    caseLink.href = `./library.html?case=${caseLink.dataset.directionCardCase}&lang=${language}`;
  });
}

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
  if ($("#dockFont")) $("#dockFont").textContent = L().font[state.font];
  if ($("#dockRadius")) $("#dockRadius").textContent = t("radiusText")(state.radius);
  if ($("#dockDensity")) $("#dockDensity").textContent = t("densityText")(L().density[state.density]);
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
  if (!saveChip) return;
  if (saveChip.dataset.state === "saved") saveChip.textContent = t("saved");
  else if (saveChip.dataset.state === "modified") saveChip.textContent = t("modified");
  else saveChip.textContent = t("unsaved");
}

function renderSummary() {
  const summary = $("#dnaSummary");
  if (!summary) return;
  const terms = t("summaryTerms");
  const rows = [
    [terms[0], L().style[state.style]],
    [terms[1], paletteName(state.palette)],
    [terms[2], L().font[state.font]],
    [terms[3], `${L().radius[state.radius]} · ${state.radius}px`],
    [terms[4], `${L().spacing[state.spacing]} · ${state.spacing}px`],
    [terms[5], L().density[state.density]],
  ];
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

function renderPrompt() {
  const node = $("#dnaPrompt");
  if (node) node.textContent = dnaText();
}

function dnaPayload() {
  return {
    name: $("#dnaName")?.value.trim() || t("untitled"),
    updatedAt: new Date().toISOString(),
    ...Object.fromEntries(Object.entries(state).filter(([key]) => key !== "device")),
    paletteLabel: paletteName(state.palette),
    colors: paletteFor(state.palette).colors,
  };
}

function dnaText() {
  const data = dnaPayload();
  if (LANG() === "en") {
    return [
      `Interface DNA: ${data.name}`,
      `Direction: ${L().style[data.style]}`,
      `Colors: ${paletteName(data.palette)} (${data.colors.join(" / ")})`,
      `Typography: ${L().font[data.font]}`,
      `Radius: ${data.radius}px`,
      `Base spacing: ${data.spacing}px`,
      `Density: ${L().density[data.density]}`,
      "Reuse rule: new pages should inherit these visual rules and only adjust content structure per task.",
    ].join("\n");
  }
  return [
    `界面设计 DNA：${data.name}`,
    `设计方向：${L().style[data.style]}`,
    `颜色：${paletteName(data.palette)}（${data.colors.join(" / ")}）`,
    `字体：${L().font[data.font]}`,
    `圆角：${data.radius}px`,
    `基础间距：${data.spacing}px`,
    `界面密度：${L().density[data.density]}`,
    "复用要求：新页面应继承以上视觉规则，仅根据页面任务调整内容结构。",
  ].join("\n");
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
  try {
    await navigator.clipboard.writeText(dnaText());
    toast(t("toastCopied"));
  } catch {
    toast(t("toastCopyFail"));
  }
}

function saveDna() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dnaPayload()));
  if ($("#saveNote")) $("#saveNote").textContent = t("saveNote");
  const saveChip = $("#dna-save .dna-section-value");
  if (saveChip) {
    saveChip.dataset.state = "saved";
    saveChip.textContent = t("saved");
  }
  toast(t("toastSaved"));
}

function restoreDna() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return;
    ["style", "density", "palette", "font", "radius", "spacing"].forEach((key) => {
      if (saved[key] != null) state[key] = String(saved[key]);
    });
    if (state.palette && !basePalettes[state.palette] && Array.isArray(saved.colors)) {
      extraPalettes[state.palette] = { label: saved.paletteLabel || "自定义配色", colors: saved.colors };
    }
    if (saved.name && $("#dnaName")) $("#dnaName").value = saved.name;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function installEvents() {
  $$(".direction-card").forEach((button) => button.addEventListener("click", () => selectStyle(button)));
  $$('[data-choice-group]').forEach((group) => group.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-value]");
    if (button) selectInGroup(group.dataset.choiceGroup, button);
  }));
  $$('[data-choice-select]').forEach((select) => select.addEventListener("change", () => {
    state[select.dataset.choiceSelect] = select.value;
    applyPreview();
  }));
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
  "dna.copyPrompt": { zh: "复制提示词", en: "Copy prompt" },
  "dna.saveDna": { zh: "保存 DNA", en: "Save DNA" },
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
  "dna.radiusLegend": { zh: "圆角", en: "Radius" },
  "dna.radiusSharp": { zh: "直角", en: "Sharp" },
  "dna.radiusModerate": { zh: "适中", en: "Moderate" },
  "dna.radiusRounded": { zh: "圆润", en: "Rounded" },
  "dna.spacingLegend": { zh: "间距", en: "Spacing" },
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
  "dna.pageArticle": { zh: "文章页", en: "Article" },
  "dna.pageProduct": { zh: "商品详情", en: "Product" },
  "dna.pageSettings": { zh: "设置页", en: "Settings" },
  "dna.pickerLabel": { zh: "预览内容", en: "Preview" },
  "dna.groupPages": { zh: "页面", en: "Pages" },
  "dna.groupComponents": { zh: "组件", en: "Components" },
  "dna.unsaved": { zh: "未保存", en: "Not saved" },
  "dna.saved": { zh: "已保存", en: "Saved" },
  "dna.modified": { zh: "有未保存修改", en: "Unsaved changes" },
  "footer.learn": { zh: "学习路径", en: "Learning path" },
  "footer.vocabulary": { zh: "UI 词典", en: "UI vocabulary" },
  "footer.library": { zh: "案例库", en: "Case library" },
});

restoreDna();
syncDirectionCards();
syncChoiceGroups();
installEvents();
installSectionDropdowns();
applyPreview();
updateDirectionCaseLink();

window.addEventListener("image2:languagechange", () => {
  applyPreview();
  updateDirectionCaseLink();
});
