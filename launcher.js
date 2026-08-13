const i18n = window.image2I18n;
const track = (name, properties) => window.image2Analytics?.track(name, properties);

const copy = {
  zh: {
    intents: {
      explore: { label: "探索现有项目", detail: "理解代码、页面和资产", title: "探索一个现有项目", intro: "选择你想了解的范围，我们会生成一条只读检查指令。", link: "打开案例库" },
      create: { label: "从零创建", detail: "从需求生成新页面", title: "从需求创建新页面", intro: "描述目标、交付形式和必要约束，生成一条直接实施的指令。", link: "浏览创建案例" },
      rebuild: { label: "参考图还原", detail: "从参考输入还原 UI", title: "把参考图还原成 UI", intro: "明确参考来源和还原边界，再生成可执行的实现指令。", link: "浏览还原案例" },
      improve: { label: "优化现有页面", detail: "检查问题并直接改进", title: "检查并优化现有页面", intro: "提供页面或项目，选择检查重点和允许的修改范围。", link: "查看设计规范" },
      "design-system": { label: "切换设计系统", detail: "比较主流系统的效果", title: "比较并切换设计系统", intro: "用同一界面目标比较 Apple HIG、Material 3 和 Ant Design。", link: "打开设计系统实验室" },
    },
    modeTitle: "模式用途", modeIntro: "每种模式使用不同的输入和执行边界。", summary: "任务摘要", ready: "可以开始", waiting: "等待输入", viewPrompt: "查看完整调用指令", hidePrompt: "收起完整指令",
    copyStart: "复制并开始", save: "保存为预设", saved: "预设已保存", copied: "指令已复制，可以交给 Codex", copyFailed: "复制失败，请手动选择指令文本。", missing: "还缺少", completeNote: "复制后回到 Codex 直接粘贴即可。", waitingNote: "补齐必要信息后才会生成完整指令。",
    labels: { task: "任务", target: "范围", focus: "重点", depth: "深度", permission: "权限", format: "交付", reference: "参考", system: "设计系统" },
  },
  en: {
    intents: {
      explore: { label: "Explore a project", detail: "Understand code, pages, and assets", title: "Explore an existing project", intro: "Choose what to inspect and generate a read-only analysis instruction.", link: "Open case library" },
      create: { label: "Create from scratch", detail: "Generate a new page from a brief", title: "Create a new interface", intro: "Describe the goal, format, and constraints to generate an implementation instruction.", link: "Browse creation cases" },
      rebuild: { label: "Rebuild a reference", detail: "Recreate UI from a reference", title: "Rebuild a reference as UI", intro: "Set the reference source and fidelity boundary before implementation.", link: "Browse rebuild cases" },
      improve: { label: "Improve a page", detail: "Inspect issues and improve directly", title: "Inspect and improve an existing page", intro: "Provide a page or project, then choose the review focus and change boundary.", link: "View design guidance" },
      "design-system": { label: "Switch design system", detail: "Compare mainstream systems", title: "Compare design systems", intro: "Compare the same interface using Apple HIG, Material 3, and Ant Design.", link: "Open design system lab" },
    },
    modeTitle: "Task mode", modeIntro: "Each mode has its own inputs and execution boundary.", summary: "Task summary", ready: "Ready", waiting: "Waiting for input", viewPrompt: "View full instruction", hidePrompt: "Hide full instruction",
    copyStart: "Copy and start", save: "Save preset", saved: "Preset saved", copied: "Instruction copied. It is ready for Codex.", copyFailed: "Copy failed. Select the instruction text manually.", missing: "Still needed", completeNote: "Paste this directly into Codex.", waitingNote: "Complete the required information to generate the instruction.",
    labels: { task: "Task", target: "Scope", focus: "Focus", depth: "Depth", permission: "Permission", format: "Deliverable", reference: "Reference", system: "Design system" },
  },
};

const caseReferences = {
  plate: { name: "Plate Play", path: "./demo/plate-play/screenshots/library-preview-2x.png" },
  museum: { name: "ArtMuse", path: "./assets/cases/museum-app/library-preview-2x.png" },
  fashion: { name: "Vestra", path: "./assets/cases/fashion-shopping-app/library-preview-2x.png" },
};

const state = {
  intent: "explore",
  file: null,
  fileUrl: "",
  values: {},
};
const persistedAtLoad = readPersistedState();

const form = document.querySelector("#launcherForm");
const intentForm = document.querySelector("#intentForm");
const modeTabs = document.querySelector("#modeTabs");
const pageTitle = document.querySelector("#pageTitle");
const pageIntro = document.querySelector("#pageIntro");
const modeTitle = document.querySelector("#modeTitle");
const modeIntro = document.querySelector("#modeIntro");
const contextLink = document.querySelector("#contextLink");
const promptTitle = document.querySelector("#promptTitle");
const readyState = document.querySelector("#readyState");
const missingState = document.querySelector("#missingState");
const taskSummary = document.querySelector("#taskSummary");
const promptDetails = document.querySelector("#promptDetails");
const promptDetailsSummary = promptDetails.querySelector("summary");
const promptOutput = document.querySelector("#promptOutput");
const copyPrompt = document.querySelector("#copyPrompt");
const togglePrompt = document.querySelector("#togglePrompt");
const savePreset = document.querySelector("#savePreset");
const handoffNote = document.querySelector("#handoffNote");
const toast = document.querySelector("#toast");
let toastTimer = 0;

const lang = () => i18n?.language === "en" ? "en" : "zh";
const t = () => copy[lang()];

const fieldset = (legend, name, options, selected, className = "choice-list") => `
  <fieldset class="control-group">
    <legend>${legend}</legend>
    <div class="${className}">
      ${options.map(([value, label, detail]) => `<label><input type="${className.includes("check") ? "checkbox" : "radio"}" name="${name}" value="${value}" ${selected === value || Array.isArray(selected) && selected.includes(value) ? "checked" : ""}><span><strong>${label}</strong>${detail ? `<small>${detail}</small>` : ""}</span></label>`).join("")}
    </div>
  </fieldset>`;

function targetSection(title, intro, defaultType = "url") {
  return `
    <section class="config-section" aria-labelledby="targetTitle">
      <div class="section-heading"><span>01</span><div><h2 id="targetTitle">${title}</h2><p>${intro}</p></div></div>
      <div class="segmented-control target-type-control" role="radiogroup" aria-label="检查对象类型">
        <label><input type="radio" name="targetType" value="repo" ${defaultType === "repo" ? "checked" : ""}><span>仓库路径</span></label>
        <label><input type="radio" name="targetType" value="url" ${defaultType === "url" ? "checked" : ""}><span>页面 URL</span></label>
        <label><input type="radio" name="targetType" value="file" ${defaultType === "file" ? "checked" : ""}><span>本地文件</span></label>
        <label><input type="radio" name="targetType" value="workspace" ${defaultType === "workspace" ? "checked" : ""}><span>当前工作区</span></label>
      </div>
      <label class="text-field target-field" data-target-input><span>对象位置</span><input name="target" type="text" autocomplete="off" placeholder="例如：https://example.com 或 /path/to/project"><small class="field-error" aria-live="polite"></small></label>
    </section>`;
}

function referenceSection(defaultSource = "none", required = false) {
  return `
    <section class="config-section reference-section" aria-labelledby="referenceTitle">
      <div class="section-heading"><span>02</span><div><h2 id="referenceTitle">参考来源</h2><p>案例库与本地上传是两类独立来源。</p></div></div>
      <div class="segmented-control three-way reference-source" role="radiogroup" aria-label="参考来源">
        <label><input type="radio" name="referenceSource" value="library" ${defaultSource === "library" ? "checked" : ""}><span>案例库</span></label>
        <label><input type="radio" name="referenceSource" value="upload" ${defaultSource === "upload" ? "checked" : ""}><span>上传本地图片</span></label>
        ${required ? "" : `<label><input type="radio" name="referenceSource" value="none" ${defaultSource === "none" ? "checked" : ""}><span>不使用参考</span></label>`}
      </div>
      <div class="reference-content" id="referenceContent"></div>
      <p class="privacy-note">本地图片只在当前浏览器预览，不会由此页面上传。</p>
    </section>`;
}

function designSystemControl(number = "04") {
  return `
    <section class="config-section" aria-labelledby="systemTitle">
      <div class="section-heading"><span>${number}</span><div><h2 id="systemTitle">设计系统</h2><p>选择后会联动平台、组件规则和 Design Tokens。</p></div><a href="./brands.html">在实验室中预览</a></div>
      <div class="segmented-control system-control" role="radiogroup" aria-label="设计系统">
        <label><input type="radio" name="designSystem" value="auto" checked><span>自动推荐</span></label>
        <label><input type="radio" name="designSystem" value="apple"><span>Apple HIG</span></label>
        <label><input type="radio" name="designSystem" value="material"><span>Material 3</span></label>
        <label><input type="radio" name="designSystem" value="ant"><span>Ant Design</span></label>
        <label><input type="radio" name="designSystem" value="custom"><span>自定义</span></label>
      </div>
      <p class="system-recommendation" id="systemRecommendation"></p>
    </section>`;
}

function exploreForm() {
  return `${targetSection("提供检查对象", "仓库、页面、文件或当前工作区。")}
    <section class="config-section" aria-labelledby="focusTitle">
      <div class="section-heading"><span>02</span><div><h2 id="focusTitle">选择检查重点</h2><p>可多选；“全面检查”会覆盖全部范围。</p></div></div>
      ${fieldset("检查重点", "focus", [["architecture", "代码架构", "模块、依赖与职责边界"], ["structure", "页面结构", "信息层级与布局组织"], ["tokens", "视觉与 Design Tokens", "颜色、字体与间距系统"], ["interaction", "组件与交互", "状态、反馈与关键路径"], ["assets", "图片资产", "来源、质量与使用方式"], ["accessibility", "可访问性与响应式", "键盘、对比度与断点"], ["all", "全面检查", "覆盖以上全部范围"]], ["architecture", "interaction", "tokens"], "choice-grid check-grid")}
    </section>
    <section class="config-section" aria-labelledby="depthTitle">
      <div class="section-heading"><span>03</span><div><h2 id="depthTitle">选择输出深度</h2><p>决定结果的详略和组织方式。</p></div></div>
      ${fieldset("输出深度", "reviewDepth", [["quick", "快速概览", "结论与关键上下文"], ["issues", "问题清单", "按严重程度列出发现"], ["full", "完整审查报告", "依据、风险与测试缺口"], ["roadmap", "优化路线图", "按优先级安排后续工作"]], "full", "choice-grid depth-grid")}
      ${fieldset("允许的操作", "permission", [["readonly", "仅分析，不修改", "默认只读边界"], ["suggest", "给出修改建议", "提供可执行建议但不写文件"], ["implement", "建议后直接实现", "完成分析后实施必要修改"]], "readonly", "choice-list permission-list")}
    </section>`;
}

function createForm() {
  return `
    <section class="config-section" aria-labelledby="briefTitle">
      <div class="section-heading"><span>01</span><div><h2 id="briefTitle">描述要创建的内容</h2><p>说明用户、核心任务和必要页面。</p></div></div>
      <label class="text-field textarea-field"><span>项目目标</span><textarea name="brief" rows="4" maxlength="500" placeholder="例如：为独立咖啡店创建响应式会员网站，包含菜单、集点卡和门店信息。"></textarea><small class="field-error" aria-live="polite"></small></label>
    </section>
    ${referenceSection("none")}
    <section class="config-section" aria-labelledby="deliveryTitle">
      <div class="section-heading"><span>03</span><div><h2 id="deliveryTitle">选择交付方式</h2><p>默认采用中性的响应式网页配置。</p></div></div>
      ${fieldset("交付形式", "format", [["web", "响应式网页", "桌面与移动布局"], ["mobile", "手机 App", "触控路径与窄屏布局"], ["dashboard", "产品后台", "高密度工作界面"], ["desktop", "桌面应用", "多面板窗口结构"]], "web", "choice-grid target-type-grid")}
      ${fieldset("实现深度", "interaction", [["single", "单个关键页面", "完整实现一个核心状态"], ["path", "关键路径", "实现 2-4 个相关页面或状态"], ["complete", "完整流程", "补齐空态、错误与完成反馈"]], "path", "choice-list")}
      ${fieldset("图片资产", "assets", [["needed", "按需生成图片", "只生成代码无法表达的位图资产"], ["none", "不生成图片", "仅使用代码和现有资产"], ["full", "完整效果图流程", "先生成效果图再拆分实现"]], "needed", "choice-list")}
    </section>
    ${designSystemControl("04")}`;
}

function rebuildForm() {
  return `
    <section class="config-section" aria-labelledby="briefTitle">
      <div class="section-heading"><span>01</span><div><h2 id="briefTitle">说明还原目标</h2><p>描述目标平台、需要保留的内容和可调整范围。</p></div></div>
      <label class="text-field textarea-field"><span>还原说明</span><textarea name="brief" rows="3" maxlength="500" placeholder="例如：还原为响应式网页，保留信息层级和视觉语言，文案可替换。"></textarea><small class="field-error" aria-live="polite"></small></label>
    </section>
    ${referenceSection("upload", true)}
    <section class="config-section" aria-labelledby="rebuildTitle">
      <div class="section-heading"><span>03</span><div><h2 id="rebuildTitle">决定还原边界</h2><p>把视觉参考转换为真实、可编辑的代码界面。</p></div></div>
      ${fieldset("目标形式", "format", [["web", "响应式网页", "桌面与移动布局"], ["mobile", "手机 App", "窄屏与触控路径"], ["dashboard", "产品后台", "工作型界面"], ["desktop", "桌面应用", "窗口和多面板结构"]], "web", "choice-grid target-type-grid")}
      ${fieldset("还原深度", "fidelity", [["structure", "结构优先", "保留布局和信息层级"], ["visual", "视觉优先", "同时还原颜色、字体与资产"], ["complete", "完整交互还原", "补齐页面、状态与关键路径"]], "visual", "choice-list")}
    </section>`;
}

function improveForm() {
  return `${targetSection("提供要优化的对象", "输入页面 URL、项目路径、本地文件或使用当前工作区。")}
    <section class="config-section" aria-labelledby="improveGoalTitle">
      <div class="section-heading"><span>02</span><div><h2 id="improveGoalTitle">说明优化目标</h2><p>写清当前问题或期望结果，不生成泛化改进任务。</p></div></div>
      <label class="text-field textarea-field"><span>优化目标</span><textarea name="improveGoal" rows="3" maxlength="500" placeholder="例如：减少首屏高度，修复移动端溢出，并提高表单完成率。"></textarea><small class="field-error" aria-live="polite"></small></label>
    </section>
    <section class="config-section" aria-labelledby="focusTitle">
      <div class="section-heading"><span>03</span><div><h2 id="focusTitle">选择优化重点</h2><p>只显示与现有界面改进相关的检查项。</p></div></div>
      ${fieldset("优化重点", "focus", [["clarity", "信息架构与清晰度", "层级、文案和任务流"], ["visual", "视觉与 Design Tokens", "一致性、排版和颜色"], ["interaction", "组件与交互", "控件、状态和反馈"], ["responsive", "可访问性与响应式", "键盘、对比度和断点"], ["performance", "性能与资产", "加载、图片和渲染成本"]], ["clarity", "visual", "interaction"], "choice-grid check-grid")}
      ${fieldset("允许的操作", "permission", [["suggest", "只给优化建议", "不修改代码"], ["implement", "检查后直接改进", "实施并验证相关修改"]], "implement", "choice-list permission-list")}
    </section>
    ${designSystemControl("04")}`;
}

function designSystemForm() {
  return `
    <section class="config-section" aria-labelledby="briefTitle">
      <div class="section-heading"><span>01</span><div><h2 id="briefTitle">提供比较模板</h2><p>描述同一套内容和关键操作，以便公平比较。</p></div></div>
      <label class="text-field textarea-field"><span>界面目标</span><textarea name="brief" rows="4" maxlength="500" placeholder="例如：包含订单表格、筛选器和详情抽屉的产品后台页面。"></textarea><small class="field-error" aria-live="polite"></small></label>
    </section>
    <section class="config-section" aria-labelledby="systemsTitle">
      <div class="section-heading"><span>02</span><div><h2 id="systemsTitle">选择要比较的系统</h2><p>至少选择两套，输出组件映射和取舍依据。</p></div></div>
      ${fieldset("设计系统", "systems", [["apple", "Apple HIG", "iOS / macOS 与 Apple 组件规则"], ["material", "Material 3", "Android / Web 与 Material Tokens"], ["ant", "Ant Design", "Web / 后台与 React antd"]], ["apple", "material", "ant"], "choice-grid check-grid")}
      ${fieldset("输出方式", "systemOutput", [["comparison", "对比报告", "组件、Tokens 和平台适配差异"], ["recommend", "自动推荐", "比较后选择最适合的一套"], ["prototype", "并列预览", "生成所选系统的可比较界面"]], "comparison", "choice-list")}
      <a class="lab-link" href="./brands.html">在设计系统实验室中预览</a>
    </section>`;
}

const renderers = { explore: exploreForm, create: createForm, rebuild: rebuildForm, improve: improveForm, "design-system": designSystemForm };

function readIntent() {
  const value = new URL(window.location.href).searchParams.get("intent");
  if (value === "build") return "create";
  if (value === "review" || value === "fix") return "improve";
  return Object.hasOwn(renderers, value) ? value : "explore";
}

function setIntent(intent, { updateUrl = true } = {}) {
  if (!Object.hasOwn(renderers, intent)) intent = "explore";
  state.intent = intent;
  clearFile();
  intentForm.innerHTML = renderers[intent]();
  intentForm.dataset.intent = intent;
  modeTabs.querySelectorAll("[data-intent]").forEach((button) => {
    const selected = button.dataset.intent === intent;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  intentForm.setAttribute("aria-labelledby", `tab-${intent}`);
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("intent", intent);
    window.history.replaceState({ intent }, "", url);
  }
  try { localStorage.setItem("image2-ui-intent", intent); } catch {}
  bindDynamicControls();
  applyLanguage();
  updateOutput();
  track("launcher_intent_select", { intent });
}

function clearFile() {
  if (state.fileUrl) URL.revokeObjectURL(state.fileUrl);
  state.file = null;
  state.fileUrl = "";
}

function renderReference() {
  const container = intentForm.querySelector("#referenceContent");
  if (!container) return;
  const source = getValue("referenceSource");
  if (source === "library") {
    const selectedCase = getValue("referenceCase") || "plate";
    const item = caseReferences[selectedCase];
    container.innerHTML = `<div class="library-reference"><img src="${item.path}" alt="${item.name} 案例预览"><label><span>案例库</span><select name="referenceCase"><option value="plate" ${selectedCase === "plate" ? "selected" : ""}>Plate Play</option><option value="museum" ${selectedCase === "museum" ? "selected" : ""}>ArtMuse</option><option value="fashion" ${selectedCase === "fashion" ? "selected" : ""}>Vestra</option></select></label><a href="./library.html">更换</a></div>`;
    container.querySelector("select").addEventListener("change", () => { renderReference(); updateOutput(); });
    return;
  }
  if (source === "upload") {
    container.innerHTML = state.file ? `<div class="upload-preview"><img src="${state.fileUrl}" alt="已选择的本地参考图"><div><strong>${escapeHtml(state.file.name)}</strong><small>${formatBytes(state.file.size)}</small></div><button type="button" data-remove-file>移除</button></div>` : `<label class="upload-zone" for="referenceFile"><input id="referenceFile" name="referenceFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif"><span aria-hidden="true">+</span><strong>选择本地参考图</strong><small>PNG / JPG / WebP / GIF</small></label>`;
    container.querySelector("#referenceFile")?.addEventListener("change", (event) => setFile(event.target.files?.[0]));
    container.querySelector("[data-remove-file]")?.addEventListener("click", () => { clearFile(); renderReference(); updateOutput(); });
    return;
  }
  container.innerHTML = `<p class="reference-empty">不使用视觉参考，将根据任务内容采用中性设计方向。</p>`;
}

function setFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  clearFile();
  state.file = file;
  state.fileUrl = URL.createObjectURL(file);
  renderReference();
  updateOutput();
  track("launcher_reference_select", { type: file.type, size: file.size });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function formatBytes(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function bindDynamicControls() {
  renderReference();
  updateTargetField();
  updateSystemRecommendation();
}

function updateTargetField() {
  const wrapper = intentForm.querySelector("[data-target-input]");
  if (!wrapper) return;
  const workspace = getValue("targetType") === "workspace";
  wrapper.hidden = workspace;
  wrapper.querySelector("input").disabled = workspace;
}

function updateSystemRecommendation() {
  const output = intentForm.querySelector("#systemRecommendation");
  if (!output) return;
  const system = getValue("designSystem");
  const format = getValue("format");
  const recommendations = {
    auto: format === "mobile" ? "自动推荐：根据移动端目标选择 Apple HIG 或 Material 3。" : format === "dashboard" ? "自动推荐：产品后台优先评估 Ant Design。" : "自动推荐：根据交付形式和技术栈选择最匹配的系统。",
    apple: "Apple HIG：联动 iOS / macOS、SwiftUI 和 Apple 组件规则。",
    material: "Material 3：联动 Android / Web 和 Material Tokens。",
    ant: "Ant Design：联动 Web / 后台和 React antd。",
    custom: "自定义：保留现有组件库，并建立项目自己的 Tokens。",
  };
  const recommendationsEn = {
    auto: format === "mobile" ? "Auto-recommendation: Apple HIG or Material 3 based on the mobile target." : format === "dashboard" ? "Auto-recommendation: prioritize Ant Design for product dashboards." : "Auto-recommendation: match the system to the deliverable and technology stack.",
    apple: "Apple HIG: use iOS/macOS, SwiftUI, and Apple component conventions.",
    material: "Material 3: use Android/Web and Material tokens.",
    ant: "Ant Design: use Web/dashboard patterns and React antd.",
    custom: "Custom: retain the existing component library and establish project tokens.",
  };
  output.textContent = (lang() === "en" ? recommendationsEn : recommendations)[system] || "";
}

function getValue(name) {
  const field = form.elements[name];
  if (!field) return "";
  if (field instanceof RadioNodeList) return field.value;
  return field.value || "";
}

function getChecked(name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

const labelMaps = {
  targetType: { repo: "仓库路径", url: "页面 URL", file: "本地文件", workspace: "当前工作区" },
  focus: { architecture: "代码架构", structure: "页面结构", tokens: "视觉与 Tokens", interaction: "组件与交互", assets: "图片资产", accessibility: "可访问性与响应式", all: "全面检查", clarity: "信息架构与清晰度", visual: "视觉与 Tokens", responsive: "可访问性与响应式", performance: "性能与资产" },
  reviewDepth: { quick: "快速概览", issues: "问题清单", full: "完整审查报告", roadmap: "优化路线图" },
  permission: { readonly: "只读，不修改", suggest: "给出建议，不修改", implement: "分析后直接实现" },
  format: { web: "响应式网页", mobile: "手机 App", dashboard: "产品后台", desktop: "桌面应用" },
  interaction: { single: "单个关键页面", path: "关键路径", complete: "完整流程" },
  assets: { needed: "按需生成图片", none: "不生成图片", full: "完整效果图流程" },
  fidelity: { structure: "结构优先", visual: "视觉优先", complete: "完整交互还原" },
  designSystem: { auto: "自动推荐", apple: "Apple HIG", material: "Material 3", ant: "Ant Design", custom: "自定义" },
  systemOutput: { comparison: "对比报告", recommend: "自动推荐", prototype: "并列预览" },
  systems: { apple: "Apple HIG", material: "Material 3", ant: "Ant Design" },
};

const englishLabels = {
  targetType: { repo: "Repository path", url: "Page URL", file: "Local file", workspace: "Current workspace" },
  focus: { architecture: "Code architecture", structure: "Page structure", tokens: "Visuals and tokens", interaction: "Components and interaction", assets: "Image assets", accessibility: "Accessibility and responsive", all: "Full review", clarity: "Information architecture", visual: "Visuals and tokens", responsive: "Accessibility and responsive", performance: "Performance and assets" },
  reviewDepth: { quick: "Quick overview", issues: "Issue list", full: "Full audit report", roadmap: "Improvement roadmap" },
  permission: { readonly: "Read only", suggest: "Suggest changes", implement: "Analyze and implement" },
  format: { web: "Responsive web", mobile: "Mobile app", dashboard: "Product dashboard", desktop: "Desktop app" },
  interaction: { single: "Single key page", path: "Key path", complete: "Complete flow" },
  assets: { needed: "Generate as needed", none: "No generated images", full: "Full effect-image flow" },
  fidelity: { structure: "Structure first", visual: "Visual fidelity", complete: "Complete interaction" },
  designSystem: { auto: "Auto-recommend", apple: "Apple HIG", material: "Material 3", ant: "Ant Design", custom: "Custom" },
  systemOutput: { comparison: "Comparison report", recommend: "Recommendation", prototype: "Side-by-side preview" },
  systems: { apple: "Apple HIG", material: "Material 3", ant: "Ant Design" },
};

const englishUiText = {
  "提供检查对象": "Provide an inspection target", "仓库、页面、文件或当前工作区。": "Repository, page, file, or current workspace.", "检查对象类型": "Inspection target type", "仓库路径": "Repository path", "页面 URL": "Page URL", "本地文件": "Local file", "当前工作区": "Current workspace", "对象位置": "Target location", "例如：https://example.com 或 /path/to/project": "Example: https://example.com or /path/to/project",
  "选择检查重点": "Choose review focus", "可多选；“全面检查”会覆盖全部范围。": "Select multiple; Full review covers every area.", "检查重点": "Review focus", "代码架构": "Code architecture", "模块、依赖与职责边界": "Modules, dependencies, and boundaries", "页面结构": "Page structure", "信息层级与布局组织": "Hierarchy and layout", "视觉与 Design Tokens": "Visuals and design tokens", "颜色、字体与间距系统": "Color, type, and spacing system", "组件与交互": "Components and interaction", "状态、反馈与关键路径": "States, feedback, and key paths", "图片资产": "Image assets", "来源、质量与使用方式": "Sources, quality, and usage", "可访问性与响应式": "Accessibility and responsive", "键盘、对比度与断点": "Keyboard, contrast, and breakpoints", "全面检查": "Full review", "覆盖以上全部范围": "Covers all areas above",
  "选择输出深度": "Choose output depth", "决定结果的详略和组织方式。": "Choose the level of detail and structure.", "输出深度": "Output depth", "快速概览": "Quick overview", "结论与关键上下文": "Conclusions and key context", "问题清单": "Issue list", "按严重程度列出发现": "Findings by severity", "完整审查报告": "Full audit report", "依据、风险与测试缺口": "Evidence, risks, and test gaps", "优化路线图": "Improvement roadmap", "按优先级安排后续工作": "Prioritized follow-up work", "允许的操作": "Allowed action", "仅分析，不修改": "Analyze only, do not modify", "默认只读边界": "Read-only by default", "给出修改建议": "Suggest changes", "提供可执行建议但不写文件": "Actionable suggestions without editing files", "建议后直接实现": "Implement after review", "完成分析后实施必要修改": "Implement necessary changes after analysis",
  "描述要创建的内容": "Describe what to create", "说明用户、核心任务和必要页面。": "Describe the user, core task, and required pages.", "项目目标": "Project goal", "描述目标、交付形式和必要约束，生成一条直接实施的指令。": "Describe the goal, format, and constraints for an implementation instruction.", "参考来源": "Reference source", "案例库与本地上传是两类独立来源。": "Choose between the case library and a local upload.", "案例库": "Case library", "上传本地图片": "Upload local image", "不使用参考": "No reference", "交付方式": "Deliverable", "默认采用中性的响应式网页配置。": "A neutral responsive web setup is selected by default.", "交付形式": "Format", "实现深度": "Implementation depth", "单个关键页面": "Single key page", "关键路径": "Key path", "完整流程": "Complete flow", "图片资产": "Image assets", "按需生成图片": "Generate images as needed", "只生成代码无法表达的位图资产": "Generate only bitmap assets code cannot express", "不生成图片": "No generated images", "仅使用代码和现有资产": "Use code and existing assets only", "完整效果图流程": "Full effect-image flow", "先生成效果图再拆分实现": "Generate an effect image before implementation", "设计系统": "Design system", "选择后会联动平台、组件规则和 Design Tokens。": "This links the platform, component rules, and design tokens.", "自动推荐": "Auto-recommend", "在实验室中预览": "Preview in the lab", "说明还原目标": "Describe the rebuild target", "描述目标平台、需要保留的内容和可调整范围。": "Describe the platform, content to preserve, and adjustable scope.", "还原说明": "Rebuild brief", "决定还原边界": "Set rebuild boundary", "把视觉参考转换为真实、可编辑的代码界面。": "Turn the visual reference into real, editable UI.", "目标形式": "Target format", "还原深度": "Rebuild depth", "结构优先": "Structure first", "视觉优先": "Visual fidelity", "完整交互还原": "Complete interaction", "提供要优化的对象": "Provide a target to improve", "输入页面 URL、项目路径、本地文件或使用当前工作区。": "Enter a page URL, project path, local file, or use the current workspace.", "优化目标": "Improvement goal", "写清当前问题或期望结果，不生成泛化改进任务。": "State the current problem or desired result; avoid generic tasks.", "选择优化重点": "Choose improvement focus", "只显示与现有界面改进相关的检查项。": "Only focus areas relevant to improving an existing interface.", "优化重点": "Improvement focus", "只给优化建议": "Suggestions only", "不修改代码": "Do not modify code", "检查后直接改进": "Improve after review", "实施并验证相关修改": "Implement and verify changes", "提供比较模板": "Provide a comparison template", "描述同一套内容和关键操作，以便公平比较。": "Describe the same content and key actions for a fair comparison.", "界面目标": "Interface goal", "选择要比较的系统": "Choose systems to compare", "至少选择两套，输出组件映射和取舍依据。": "Choose at least two and explain mappings and trade-offs.", "输出方式": "Output format", "对比报告": "Comparison report", "组件、Tokens 和平台适配差异": "Components, tokens, and platform differences", "并列预览": "Side-by-side preview", "生成所选系统的可比较界面": "Generate comparable interfaces for each system",
};

function localizeDynamicForm() {
  if (lang() !== "en") return;
  const root = intentForm;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const key = node.nodeValue.trim();
    if (englishUiText[key]) node.nodeValue = node.nodeValue.replace(key, englishUiText[key]);
  });
  root.querySelectorAll("[placeholder]").forEach((element) => {
    if (englishUiText[element.getAttribute("placeholder")]) element.setAttribute("placeholder", englishUiText[element.getAttribute("placeholder")]);
  });
  root.querySelectorAll("[aria-label]").forEach((element) => {
    if (englishUiText[element.getAttribute("aria-label")]) element.setAttribute("aria-label", englishUiText[element.getAttribute("aria-label")]);
  });
}

const label = (group, value) => (lang() === "en" ? englishLabels[group]?.[value] : labelMaps[group]?.[value]) || value;

function targetValue() {
  const type = getValue("targetType");
  return type === "workspace" ? label("targetType", "workspace") : getValue("target").trim();
}

function referenceValue() {
  const source = getValue("referenceSource");
  if (source === "library") return `${lang() === "en" ? "Case library" : "案例库"}: ${caseReferences[getValue("referenceCase") || "plate"].name}`;
  if (source === "upload") return state.file ? `${lang() === "en" ? "Local image" : "本地图片"}: ${state.file.name}` : "";
  return lang() === "en" ? "No reference" : "不使用参考";
}

function validate() {
  const missing = [];
  if (["explore", "improve"].includes(state.intent) && !targetValue()) missing.push(lang() === "en" ? "Inspection target" : "检查对象");
  if (state.intent === "improve" && !getValue("improveGoal").trim()) missing.push(lang() === "en" ? "Improvement goal" : "优化目标");
  if (["create", "design-system"].includes(state.intent) && !getValue("brief").trim()) missing.push(lang() === "en" ? (state.intent === "create" ? "Project goal" : "Interface goal") : (state.intent === "create" ? "项目目标" : "界面目标"));
  if (state.intent === "rebuild") {
    if (!getValue("brief").trim()) missing.push(lang() === "en" ? "Rebuild brief" : "还原说明");
    if (!["library", "upload"].includes(getValue("referenceSource"))) missing.push(lang() === "en" ? "Reference source" : "参考来源");
    if (getValue("referenceSource") === "upload" && !state.file) missing.push(lang() === "en" ? "Reference image" : "参考图片");
  }
  if (state.intent === "design-system" && getChecked("systems").length < 2) missing.push(lang() === "en" ? "At least two design systems" : "至少两套设计系统");
  if (["explore", "improve"].includes(state.intent) && !getChecked("focus").length) missing.push(lang() === "en" ? "Review focus" : "检查重点");
  return missing;
}

function buildSummary() {
  const intentLabel = t().intents[state.intent].label;
  const empty = lang() === "en" ? "Not provided" : "未提供";
  const none = lang() === "en" ? "Not selected" : "未选择";
  const separator = lang() === "en" ? ", " : "、";
  if (state.intent === "explore") return [["task", intentLabel], ["target", targetValue() || empty], ["focus", getChecked("focus").map((value) => label("focus", value)).join(separator) || none], ["depth", label("reviewDepth", getValue("reviewDepth"))], ["permission", label("permission", getValue("permission"))]];
  if (state.intent === "create") return [["task", intentLabel], ["target", getValue("brief").trim() || empty], ["format", label("format", getValue("format"))], ["reference", referenceValue()], ["system", label("designSystem", getValue("designSystem"))]];
  if (state.intent === "rebuild") return [["task", intentLabel], ["target", getValue("brief").trim() || empty], ["reference", referenceValue() || empty], ["format", label("format", getValue("format"))]];
  if (state.intent === "improve") return [["task", intentLabel], ["target", targetValue() || empty], ["depth", getValue("improveGoal").trim() || empty], ["focus", getChecked("focus").map((value) => label("focus", value)).join(separator) || none], ["permission", label("permission", getValue("permission"))], ["system", label("designSystem", getValue("designSystem"))]];
  return [["task", intentLabel], ["target", getValue("brief").trim() || empty], ["system", getChecked("systems").map((value) => label("systems", value)).join(separator) || none], ["depth", label("systemOutput", getValue("systemOutput"))]];
}

function buildPrompt() {
  const brief = getValue("brief").trim();
  if (lang() === "en") {
    if (state.intent === "explore") {
      const permission = getValue("permission");
      const boundary = permission === "readonly" ? "Run a read-only inspection. Do not modify any files." : permission === "suggest" ? "Give concrete change suggestions, but do not edit files." : "Report findings and suggestions first, then implement necessary changes and verify them.";
      return `Explore and understand this existing project: ${targetValue()}\n\nReview focus: ${getChecked("focus").map((value) => label("focus", value)).join(", ")}.\nOutput depth: ${label("reviewDepth", getValue("reviewDepth"))}.\nPermission: ${boundary}\n\nRead the relevant code, page structure, and assets first. Cite concrete files and line numbers. Do not generate a new interface, effect image, or image assets. Summarize key findings, risks, test gaps, and next steps.`;
    }
    if (state.intent === "create") return `Use $image-to-ui-skill to create this interface from scratch and implement it directly.\n\nProject goal: ${brief}\nDeliverable: ${label("format", getValue("format"))}\nReference: ${referenceValue()}\nDesign system: ${label("designSystem", getValue("designSystem"))}\nImplementation depth: ${label("interaction", getValue("interaction"))}\nImage assets: ${label("assets", getValue("assets"))}\n\nRender text, controls, icons, and layout in code. Generate bitmap assets only when code cannot express the required photo, illustration, or texture. Complete responsive implementation, key interactions, and browser verification.`;
    if (state.intent === "rebuild") return `Use $image-to-ui-skill to rebuild the provided UI reference and implement it directly.\n\nRebuild brief: ${brief}\nReference: ${referenceValue()}\nTarget format: ${label("format", getValue("format"))}\nRebuild depth: ${label("fidelity", getValue("fidelity"))}\n\nAnalyze the reference's structure, visual tokens, components, assets, and interactions. Separate code-ui from image2-assets; render readable text and standard controls in code. Do not use the full reference image as the final interface. Complete a clickable implementation and verify desktop and mobile layouts.`;
    if (state.intent === "improve") {
      const boundary = getValue("permission") === "implement" ? "Implement the changes after review and run relevant verification." : "Give optimization suggestions only; do not modify files.";
      return `Inspect and improve this existing interface: ${targetValue()}\n\nImprovement goal: ${getValue("improveGoal").trim()}\nFocus: ${getChecked("focus").map((value) => label("focus", value)).join(", ")}.\nDesign system: ${label("designSystem", getValue("designSystem"))}.\nPermission: ${boundary}\n\nInspect the existing design system, components, and implementation constraints first. Explain issues and evidence by severity. Preserve the product language and avoid unrelated refactors; when authorized, verify responsive behavior, accessibility, and key interactions.`;
    }
    return `Compare design systems for this interface goal: ${brief}\n\nSystems: ${getChecked("systems").map((value) => label("systems", value)).join(", ")}.\nOutput: ${label("systemOutput", getValue("systemOutput"))}.\n\nUse the same content structure and key actions for a fair comparison. Explain platform fit, component mapping, design tokens, interaction conventions, technology stack, migration cost, and the recommendation.`;
  }
  if (state.intent === "explore") {
    const permission = getValue("permission");
    const boundary = permission === "readonly" ? "执行只读检查，不得修改任何文件。" : permission === "suggest" ? "给出具体修改建议，但不要修改文件。" : "先报告发现和建议，再直接实施必要修改并验证。";
    return `探索并理解这个现有项目：${targetValue()}\n\n检查重点：${getChecked("focus").map((value) => label("focus", value)).join("、")}。\n输出深度：${label("reviewDepth", getValue("reviewDepth"))}。\n操作权限：${boundary}\n\n先读取相关代码、页面结构和资产，基于具体文件与行号给出证据。不要生成新界面、效果图或图片资产。检查完成后总结关键发现、风险、测试缺口和下一步。`;
  }
  if (state.intent === "create") return `使用 $image-to-ui-skill 从零创建以下界面，直接实施，不要只给方案。\n\n项目目标：${brief}\n交付形式：${label("format", getValue("format"))}\n参考来源：${referenceValue()}\n设计系统：${label("designSystem", getValue("designSystem"))}\n实现深度：${label("interaction", getValue("interaction"))}\n图片资产：${label("assets", getValue("assets"))}\n\n优先用代码实现文字、控件、图标和布局；只为代码无法表达的照片、插画或纹理生成位图。完成响应式实现、关键交互和浏览器验证，并给出预览入口与检查结果。`;
  if (state.intent === "rebuild") return `使用 $image-to-ui-skill 还原我提供的 UI 参考，直接实施。\n\n还原目标：${brief}\n参考来源：${referenceValue()}\n目标形式：${label("format", getValue("format"))}\n还原深度：${label("fidelity", getValue("fidelity"))}\n\n先分析参考图的页面结构、视觉 Tokens、组件、资产和交互，再区分 code-ui 与 image2-assets。所有可读文字和常规控件必须由代码渲染；不要把整张参考图当成最终界面。完成可点击实现并验证桌面和移动布局。`;
  if (state.intent === "improve") {
    const boundary = getValue("permission") === "implement" ? "检查后直接实施修改，并运行相关验证。" : "只给优化建议，不要修改文件。";
    return `检查并优化这个现有界面：${targetValue()}\n\n优化目标：${getValue("improveGoal").trim()}\n优化重点：${getChecked("focus").map((value) => label("focus", value)).join("、")}。\n设计系统：${label("designSystem", getValue("designSystem"))}。\n操作权限：${boundary}\n\n先检查现有设计系统、组件和实现约束，按严重程度说明问题及依据。保持现有产品语言，避免无关重构；如获准修改，完成响应式、可访问性和关键交互验证。`;
  }
  return `为以下界面目标比较设计系统：${brief}\n\n比较范围：${getChecked("systems").map((value) => label("systems", value)).join("、")}。\n输出方式：${label("systemOutput", getValue("systemOutput"))}。\n\n使用同一内容结构和关键操作进行公平比较。分别说明平台适配、组件映射、Design Tokens、交互惯例、技术栈和迁移成本，并给出有依据的推荐。`;
}

function renderSummary(rows) {
  taskSummary.replaceChildren(...rows.flatMap(([key, value]) => {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = t().labels[key] || key;
    dd.textContent = value;
    return [dt, dd];
  }));
}

function updateOutput() {
  const missing = validate();
  const complete = missing.length === 0;
  const rows = buildSummary();
  renderSummary(rows);
  missingState.hidden = complete;
  missingState.textContent = complete ? "" : `${t().missing}：${missing.join("、")}`;
  readyState.classList.toggle("is-ready", complete);
  readyState.querySelector("span").textContent = complete ? t().ready : t().waiting;
  promptOutput.textContent = complete ? buildPrompt() : "";
  promptDetails.hidden = !complete;
  if (!complete) promptDetails.open = false;
  copyPrompt.disabled = !complete;
  copyPrompt.textContent = complete ? t().copyStart : `${t().missing}：${missing[0]}`;
  togglePrompt.disabled = !complete;
  togglePrompt.textContent = promptDetails.open ? t().hidePrompt : t().viewPrompt;
  savePreset.disabled = !complete;
  handoffNote.textContent = complete ? t().completeNote : t().waitingNote;
  persistState();
}

function persistState() {
  const values = captureFormValues();
  try { localStorage.setItem("image2-ui-launcher", JSON.stringify({ intent: state.intent, values })); } catch {}
}

function captureFormValues() {
  const values = {};
  new FormData(form).forEach((value, key) => {
    if (value instanceof File) return;
    values[key] = Object.hasOwn(values, key) ? [].concat(values[key], value) : value;
  });
  return values;
}

function readPersistedState() {
  try {
    const saved = JSON.parse(localStorage.getItem("image2-ui-launcher") || "null");
    return saved && typeof saved === "object" ? saved : null;
  } catch { return null; }
}

function restorePersistedValues(values) {
  if (!values || typeof values !== "object") return;
  Object.entries(values).forEach(([name, raw]) => {
    const fields = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
    if (!fields.length) return;
    const selected = Array.isArray(raw) ? raw.map(String) : [String(raw)];
    fields.forEach((field) => {
      if (field.type === "checkbox" || field.type === "radio") field.checked = selected.includes(field.value);
      else field.value = selected[0] ?? "";
    });
  });
  bindDynamicControls();
  updateOutput();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2400);
}

async function copyText() {
  if (copyPrompt.disabled) return;
  const text = promptOutput.textContent;
  let copied = false;
  try {
    if (!navigator.clipboard?.writeText) throw new Error("clipboard-unavailable");
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    const range = document.createRange();
    range.selectNodeContents(promptOutput);
    const selection = window.getSelection();
    if (copied) selection.removeAllRanges();
    selection.addRange(range);
    try { copied = document.execCommand("copy"); } catch { copied = false; }
    selection.removeAllRanges();
  }
  showToast(copied ? t().copied : t().copyFailed);
  if (copied) track("launcher_prompt_copy", { intent: state.intent });
}

function saveCurrentPreset() {
  if (savePreset.disabled) return;
  const preset = { intent: state.intent, summary: buildSummary(), prompt: buildPrompt(), savedAt: new Date().toISOString() };
  try { localStorage.setItem("image2-ui-preset", JSON.stringify(preset)); }
  catch { return; }
  showToast(t().saved);
  track("launcher_preset_save", { intent: state.intent });
}

function applyLanguage() {
  const current = t();
  const intentCopy = current.intents[state.intent];
  const values = captureFormValues();
  intentForm.innerHTML = renderers[state.intent]();
  intentForm.dataset.intent = state.intent;
  restorePersistedValues(values);
  document.title = lang() === "en" ? "Task launcher · IMAGE2 UI" : "任务启动中心 · IMAGE2 UI";
  modeTitle.textContent = current.modeTitle;
  modeIntro.textContent = current.modeIntro;
  pageTitle.textContent = intentCopy.title;
  pageIntro.textContent = intentCopy.intro;
  contextLink.textContent = intentCopy.link;
  contextLink.href = state.intent === "design-system" || state.intent === "improve" ? "./brands.html" : "./library.html";
  promptTitle.textContent = current.summary;
  promptDetailsSummary.textContent = current.viewPrompt;
  togglePrompt.textContent = promptDetails.open ? current.hidePrompt : current.viewPrompt;
  savePreset.textContent = current.save;
  modeTabs.querySelectorAll("[data-intent]").forEach((button) => {
    const intent = button.dataset.intent;
    button.querySelector("strong").textContent = current.intents[intent].label;
    button.querySelector("small").textContent = current.intents[intent].detail;
  });
  localizeDynamicForm();
  updateOutput();
}

modeTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-intent]");
  if (button) setIntent(button.dataset.intent);
});
modeTabs.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const buttons = [...modeTabs.querySelectorAll("[data-intent]")];
  const index = buttons.indexOf(document.activeElement);
  const next = (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
  buttons[next].focus();
  setIntent(buttons[next].dataset.intent);
});
intentForm.addEventListener("input", updateOutput);
intentForm.addEventListener("change", (event) => {
  if (event.target.name === "referenceSource") { clearFile(); renderReference(); }
  if (event.target.name === "targetType") updateTargetField();
  if (event.target.name === "designSystem" || event.target.name === "format") updateSystemRecommendation();
  if (event.target.name === "focus" && event.target.value === "all" && event.target.checked) {
    intentForm.querySelectorAll('input[name="focus"]').forEach((input) => { if (input.value !== "all") input.checked = false; });
  } else if (event.target.name === "focus" && event.target.value !== "all" && event.target.checked) {
    const all = intentForm.querySelector('input[name="focus"][value="all"]');
    if (all) all.checked = false;
  }
  updateOutput();
});
promptDetails.addEventListener("toggle", () => { togglePrompt.textContent = promptDetails.open ? t().hidePrompt : t().viewPrompt; });
togglePrompt.addEventListener("click", () => { if (!togglePrompt.disabled) promptDetails.open = !promptDetails.open; });
copyPrompt.addEventListener("click", copyText);
savePreset.addEventListener("click", saveCurrentPreset);
window.addEventListener("popstate", () => setIntent(readIntent(), { updateUrl: false }));
i18n?.registerPage(applyLanguage);

const hasIntentQuery = new URL(window.location.href).searchParams.has("intent");
setIntent(hasIntentQuery ? readIntent() : (Object.hasOwn(renderers, persistedAtLoad?.intent) ? persistedAtLoad.intent : readIntent()), { updateUrl: false });
restorePersistedValues(persistedAtLoad?.intent === state.intent ? persistedAtLoad.values : null);
track("launcher_page_view", { intent: state.intent });
