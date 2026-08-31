const STORAGE_KEY = "ondesign:interface-dna:v2";
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
const fontById = (id) => FONT_PRESETS.find((font) => font.id === id) || FONT_PRESETS[0];
const fontName = (id) => LANG() === "en" ? fontById(id).en : fontById(id).zh;
const fontDescription = (id) => LANG() === "en" ? fontById(id).descEn : fontById(id).descZh;

const labelSets = {
  zh: { style: { restrained: "克制", editorial: "编辑感", vivid: "活力", future: "未来感" }, density: { loose: "宽松", balanced: "平衡", compact: "紧凑" }, radius: { "0": "直角", "14": "适中", "28": "圆润" }, spacing: { "6": "紧凑", "10": "平衡", "14": "宽松" } },
  en: { style: { restrained: "Restrained", editorial: "Editorial", vivid: "Vivid", future: "Futuristic" }, density: { loose: "Loose", balanced: "Balanced", compact: "Compact" }, radius: { "0": "Sharp", "14": "Moderate", "28": "Rounded" }, spacing: { "6": "Compact", "10": "Balanced", "14": "Relaxed" } },
};
const L = () => labelSets[LANG()];
const STR = {
  zh: { saveNote: "已保存到当前浏览器，可继续用于其他页面。", toastCopied: "提示词已复制，去 AI 工具里粘贴吧", toastCopyFail: "复制失败，请重试", toastSaved: "界面 DNA 已保存", summaryTerms: ["设计方向", "颜色", "字体", "圆角", "间距", "密度"], unsaved: "未保存", saved: "已保存", modified: "有未保存修改", radiusText: (r) => `${r}px 圆角`, densityText: (name) => `${name}密度`, untitled: "未命名界面 DNA" },
  en: { saveNote: "Saved in this browser, ready to reuse on other pages.", toastCopied: "Prompt copied — paste it into your AI tool", toastCopyFail: "Copy failed, please retry", toastSaved: "Interface DNA saved", summaryTerms: ["Direction", "Colors", "Typography", "Radius", "Spacing", "Density"], unsaved: "Not saved", saved: "Saved", modified: "Unsaved changes", radiusText: (r) => `${r}px radius`, densityText: (name) => `${name} density`, untitled: "Untitled interface DNA" },
};
const t = (key) => STR[LANG()][key] ?? STR.zh[key];
const state = { style: "restrained", density: "balanced", palette: "sage", font: "system-sans", radius: "14", spacing: "10", device: "desktop" };
const directionDefaults = {
  restrained: { palette: "sage", font: "system-sans", radius: "14", spacing: "10", density: "balanced" },
  editorial: { palette: "ink", font: "noto-serif-sc", radius: "0", spacing: "6", density: "compact" },
  vivid: { palette: "coral", font: "noto-sans-sc", radius: "28", spacing: "10", density: "compact" },
  future: { palette: "blue", font: "ibm-plex-mono", radius: "14", spacing: "14", density: "balanced" },
};
const directionCases = { restrained: "fithub", editorial: "organique", vivid: "plate-play", future: "volt-route" };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
function selectInGroup(group, button) { const value = button.dataset.value; if (!value) return; state[group] = value; syncChoiceGroups(); applyPreview(); }
function selectStyle(button) { const style = button.dataset.style; if (!style) return; state.style = style; const defaults = directionDefaults[style]; if (defaults) Object.assign(state, defaults); syncDirectionCards(); syncChoiceGroups(); applyPreview(); updateDirectionCaseLink(); }
function syncDirectionCards() { $$(".direction-card").forEach((item) => { const selected = item.dataset.style === state.style; item.classList.toggle("is-selected", selected); item.setAttribute("aria-checked", String(selected)); }); }
function updateDirectionCaseLink() { const caseId = directionCases[state.style]; const language = document.documentElement.lang.startsWith("zh") ? "zh" : "en"; const link = $("[data-direction-case-link]"); if (link && caseId) link.href = `./library.html?case=${caseId}&lang=${language}`; $$("[data-direction-card-case]").forEach((caseLink) => { caseLink.href = `./library.html?case=${caseLink.dataset.directionCardCase}&lang=${language}`; }); }
function syncChoiceGroups() { ["density", "palette", "radius", "spacing"].forEach((group) => { $$(`[data-choice-group="${group}"] button`).forEach((item) => { const selected = item.dataset.value === state[group]; item.classList.toggle("is-selected", selected); if (item.getAttribute("role") === "radio") item.setAttribute("aria-checked", String(selected)); }); }); const fontSelect = $("[data-font-select]"); if (fontSelect && [...fontSelect.options].some((option) => option.value === state.font)) fontSelect.value = state.font; }
function renderFontDescription() { const node = $("[data-font-description]"); if (node) node.textContent = fontDescription(state.font); }
function applyPreview() {
  const root = document.documentElement; const palette = paletteFor(state.palette); const densityScale = { loose: 1.28, balanced: 1, compact: .78 }[state.density]; const selectedFont = fontById(state.font);
  root.style.setProperty("--dna-accent", palette.colors[0]); root.style.setProperty("--dna-accent-soft", palette.colors[1]); root.style.setProperty("--dna-canvas", palette.colors[2]); root.style.setProperty("--dna-ink", palette.colors[3]); root.style.setProperty("--dna-radius", `${state.radius}px`); root.style.setProperty("--dna-space", `${Number(state.spacing) * densityScale}px`); root.style.setProperty("--dna-display", selectedFont.stack); root.style.setProperty("--dna-body", selectedFont.stack); document.body.dataset.style = state.style;
  const styleRadius = { restrained: state.radius, editorial: "0", vivid: String(Math.max(16, Number(state.radius))), future: String(Math.max(4, Number(state.radius))) }[state.style]; $(".sample-visual")?.style.setProperty("border-radius", `${styleRadius}px`); $$("#dockPalette i").forEach((item, index) => { item.style.background = palette.colors[index]; }); if ($("#dockFont")) $("#dockFont").textContent = fontName(state.font); if ($("#dockRadius")) $("#dockRadius").textContent = t("radiusText")(state.radius); if ($("#dockDensity")) $("#dockDensity").textContent = t("densityText")(L().density[state.density]); renderFontDescription(); renderSummary(); renderPrompt(); renderSectionValues();
}
function renderSectionValues() { const direction = $('[data-section-value="direction"]'); const rules = $('[data-section-value="rules"]'); if (direction) direction.textContent = `${L().style[state.style]} · ${L().density[state.density]}`; if (rules) rules.textContent = `${paletteName(state.palette)} · ${fontName(state.font)}`; const saveChip = $("#dna-save .dna-section-value"); if (!saveChip) return; if (saveChip.dataset.state === "saved") saveChip.textContent = t("saved"); else if (saveChip.dataset.state === "modified") saveChip.textContent = t("modified"); else saveChip.textContent = t("unsaved"); }
function renderSummary() { const summary = $("#dnaSummary"); if (!summary) return; const terms = t("summaryTerms"); const rows = [[terms[0], L().style[state.style]], [terms[1], paletteName(state.palette)], [terms[2], fontName(state.font)], [terms[3], `${L().radius[state.radius]} · ${state.radius}px`], [terms[4], `${L().spacing[state.spacing]} · ${state.spacing}px`], [terms[5], L().density[state.density]]]; summary.replaceChildren(...rows.map(([term, value]) => { const row = document.createElement("div"); const dt = document.createElement("dt"); const dd = document.createElement("dd"); dt.textContent = term; dd.textContent = value; row.append(dt, dd); return row; })); }
function renderPrompt() { const node = $("#dnaPrompt"); if (node) node.textContent = dnaText(); }
function dnaPayload() { return { name: $("#dnaName")?.value.trim() || t("untitled"), updatedAt: new Date().toISOString(), ...Object.fromEntries(Object.entries(state).filter(([key]) => key !== "device")), fontLabel: fontName(state.font), paletteLabel: paletteName(state.palette), colors: paletteFor(state.palette).colors }; }
function dnaText() { const data = dnaPayload(); if (LANG() === "en") return [`Interface DNA: ${data.name}`, `Direction: ${L().style[data.style]}`, `Colors: ${paletteName(data.palette)} (${data.colors.join(" / ")})`, `Typography: ${fontName(data.font)}`, `Radius: ${data.radius}px`, `Base spacing: ${data.spacing}px`, `Density: ${L().density[data.density]}`, "Reuse rule: new pages should inherit these visual rules and only adjust content structure per task."].join("\n"); return [`界面设计 DNA：${data.name}`, `设计方向：${L().style[data.style]}`, `颜色：${paletteName(data.palette)}（${data.colors.join(" / ")}）`, `字体：${fontName(data.font)}`, `圆角：${data.radius}px`, `基础间距：${data.spacing}px`, `界面密度：${L().density[data.density]}`, "复用要求：新页面应继承以上视觉规则，仅根据页面任务调整内容结构。"].join("\n"); }
function toast(message) { const node = $("#dnaToast"); if (!node) return; node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; }, 2200); }
async function copyDna() { try { await navigator.clipboard.writeText(dnaText()); toast(t("toastCopied")); } catch { toast(t("toastCopyFail")); } }
function saveDna() { localStorage.setItem(STORAGE_KEY, JSON.stringify(dnaPayload())); if ($("#saveNote")) $("#saveNote").textContent = t("saveNote"); const saveChip = $("#dna-save .dna-section-value"); if (saveChip) { saveChip.dataset.state = "saved"; saveChip.textContent = t("saved"); } toast(t("toastSaved")); }
function restoreDna() { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); if (!saved) return; ["style", "density", "palette", "font", "radius", "spacing"].forEach((key) => { if (saved[key] != null) state[key] = String(saved[key]); }); if (!FONT_PRESETS.some((font) => font.id === state.font)) state.font = "system-sans"; if (state.palette && !basePalettes[state.palette] && Array.isArray(saved.colors)) extraPalettes[state.palette] = { label: saved.paletteLabel || "自定义配色", colors: saved.colors }; if (saved.name && $("#dnaName")) $("#dnaName").value = saved.name; } catch { localStorage.removeItem(STORAGE_KEY); } }
function installEvents() {
  $$(".direction-card").forEach((button) => button.addEventListener("click", () => selectStyle(button))); $$('[data-choice-group]').forEach((group) => group.addEventListener("click", (event) => { const button = event.target.closest("button[data-value]"); if (button) selectInGroup(group.dataset.choiceGroup, button); }));
  $("[data-font-select]")?.addEventListener("change", (event) => { state.font = event.target.value; document.body.removeAttribute("data-design-system"); applyPreview(); window.dispatchEvent(new CustomEvent("ondesign:fontchange", { detail: { id: state.font, name: fontName(state.font) } })); });
  $$("[data-scroll]").forEach((button) => button.addEventListener("click", () => { const target = document.querySelector(button.dataset.scroll); if (!target) return; if (target.tagName === "DETAILS") target.open = true; target.scrollIntoView({ behavior: "smooth", block: "start" }); }));
  $$("[data-device]").forEach((button) => button.addEventListener("click", () => { state.device = button.dataset.device; $$("[data-device]").forEach((item) => item.classList.toggle("is-selected", item === button)); $("[data-preview-stage]")?.classList.toggle("is-mobile", state.device === "mobile"); }));
  $('[data-preview-picker]')?.addEventListener("change", (event) => { $$(".sample-view").forEach((view) => { const active = view.dataset.view === event.target.value; view.hidden = !active; view.classList.toggle("is-active", active); }); }); $("#saveDna")?.addEventListener("click", saveDna); $("#copyDna")?.addEventListener("click", copyDna);
}
function installSectionDropdowns() { const sections = $$(".dna-controls > details"); sections.forEach((section) => section.addEventListener("toggle", () => { if (!section.open) return; sections.forEach((other) => { if (other !== section) other.open = false; }); })); }
window.image2I18n?.addTranslations({
  "dna.heroTitle": { zh: "界面设计 DNA", en: "Interface DNA" }, "dna.heroLede": { zh: "先选一个设计方向，再按需调整规范。每次只处理一组决定，右侧同步看到真实页面效果。", en: "Pick a design direction, then adjust the foundation as needed — one decision at a time, with the real page effect syncing on the right." }, "dna.copyPrompt": { zh: "复制提示词", en: "Copy prompt" }, "dna.saveDna": { zh: "保存 DNA", en: "Save DNA" },
  "dna.directionTitle": { zh: "视觉方向", en: "Visual direction" }, "dna.directionDesc": { zh: "先确定整体气质，密度随之匹配。", en: "Set the overall temperament first; density follows." }, "dna.dirRestrained": { zh: "克制", en: "Restrained" }, "dna.dirRestrainedDesc": { zh: "留白、秩序、柔和 · 案例「极简训练规划」", en: "Whitespace, order, softness · Case: FitHub" }, "dna.dirEditorial": { zh: "编辑感", en: "Editorial" }, "dna.dirEditorialDesc": { zh: "字体、网格、对比 · 案例「编辑式有机餐食」", en: "Typography, grid, contrast · Case: Organique Food" }, "dna.dirVivid": { zh: "活力", en: "Vivid" }, "dna.dirVividDesc": { zh: "高对比、丰富、直接 · 案例「高彩插画食谱」", en: "High contrast, rich, direct · Case: Plate Play" }, "dna.dirFuture": { zh: "未来感", en: "Futuristic" }, "dna.dirFutureDesc": { zh: "深邃、精致、氛围 · 案例「暗色电车充电导航」", en: "Deep, precise, atmospheric · Case: Volt Route" },
  "dna.densityLegend": { zh: "界面密度", en: "Density" }, "dna.densityLoose": { zh: "宽松", en: "Loose" }, "dna.densityBalanced": { zh: "平衡", en: "Balanced" }, "dna.densityCompact": { zh: "紧凑", en: "Compact" }, "dna.hintPre": { zh: "方向已绑定案例库真实案例效果，", en: "Each direction is bound to a real case-library demo — " }, "dna.hintLink": { zh: "在案例库中打开当前方向的案例", en: "open the current direction's case in the library" },
  "dna.rulesTitle": { zh: "基础规范", en: "Foundation" }, "dna.rulesDesc": { zh: "设计规范、颜色、字体、圆角与间距。", en: "Design system, colors, typography, radius and spacing." }, "dna.colorLegend": { zh: "颜色", en: "Colors" }, "dna.paletteSage": { zh: "鼠尾草绿", en: "Sage green" }, "dna.paletteInk": { zh: "墨黑灰", en: "Ink black" }, "dna.paletteBlue": { zh: "深海蓝", en: "Deep blue" }, "dna.paletteCoral": { zh: "暖珊瑚", en: "Warm coral" }, "dna.fontLegend": { zh: "字体", en: "Typography" },
  "dna.radiusLegend": { zh: "圆角", en: "Radius" }, "dna.radiusSharp": { zh: "直角", en: "Sharp" }, "dna.radiusModerate": { zh: "适中", en: "Moderate" }, "dna.radiusRounded": { zh: "圆润", en: "Rounded" }, "dna.spacingLegend": { zh: "间距", en: "Spacing" }, "dna.spacingCompact": { zh: "紧凑", en: "Compact" }, "dna.spacingBalanced": { zh: "平衡", en: "Balanced" }, "dna.spacingRelaxed": { zh: "宽松", en: "Relaxed" },
  "dna.saveTitle": { zh: "保存并复用", en: "Save & reuse" }, "dna.saveDesc": { zh: "命名、检查并复制这套 DNA。", en: "Name, review and copy this DNA." }, "dna.nameField": { zh: "规范名称", en: "Preset name" }, "dna.promptLabel": { zh: "生成的提示词", en: "Generated prompt" }, "dna.saveThis": { zh: "保存这套 DNA", en: "Save this DNA" },
  "dna.previewTitle": { zh: "实时预览", en: "Live preview" }, "dna.deviceDesktop": { zh: "桌面", en: "Desktop" }, "dna.deviceMobile": { zh: "移动", en: "Mobile" }, "dna.compLanding": { zh: "落地页", en: "Landing" }, "dna.compNav": { zh: "导航", en: "Nav" }, "dna.compCards": { zh: "卡片组", en: "Cards" }, "dna.compForm": { zh: "表单", en: "Form" }, "dna.compPricing": { zh: "定价", en: "Pricing" }, "dna.compDash": { zh: "数据后台", en: "Dashboard" }, "dna.pageArticle": { zh: "文章页", en: "Article" }, "dna.pageProduct": { zh: "商品详情", en: "Product" }, "dna.pageSettings": { zh: "设置页", en: "Settings" }, "dna.pickerLabel": { zh: "预览内容", en: "Preview" }, "dna.groupPages": { zh: "页面", en: "Pages" }, "dna.groupComponents": { zh: "组件", en: "Components" }, "dna.unsaved": { zh: "未保存", en: "Not saved" }, "dna.saved": { zh: "已保存", en: "Saved" }, "dna.modified": { zh: "有未保存修改", en: "Unsaved changes" }, "footer.learn": { zh: "学习路径", en: "Learning path" }, "footer.vocabulary": { zh: "UI 词典", en: "UI vocabulary" }, "footer.library": { zh: "案例库", en: "Case library" },
});
window.ONDesignFontPresets = FONT_PRESETS;
window.dispatchEvent(new CustomEvent("ondesign:fontpresetsready"));
restoreDna(); syncDirectionCards(); syncChoiceGroups(); installEvents(); installSectionDropdowns(); applyPreview(); updateDirectionCaseLink();
window.addEventListener("image2:languagechange", () => { syncChoiceGroups(); applyPreview(); updateDirectionCaseLink(); });
